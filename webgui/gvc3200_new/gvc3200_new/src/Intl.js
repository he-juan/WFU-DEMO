// https://github.com/formatjs/react-intl/issues/983#issuecomment-342314143
import React, { useState, useEffect } from 'react'
import { IntlProvider, addLocaleData, intlShape, FormattedMessage } from 'react-intl'
import { ConfigProvider } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { connect } from 'react-redux'
// react-intl
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'

addLocaleData([...en, ...zh])

const LocalePromise = {
  'en': {
    get_messages: () => import(/* webpackChunkName: "locale.en" */'@/assets/locales/locales_en'),
    get_antLocale: () => import(/* webpackChunkName: "locale.en" */'antd/es/locale-provider/en_US'),
    get_reactIntlLocale: () => import(/* webpackChunkName: "locale.en" */'react-intl/locale-data/en'),
    momentLocale: 'en'
  },
  'zh': {
    get_messages: () => import(/* webpackChunkName: "locale.zh" */'@/assets/locales/locales_zh'),
    get_antLocale: () => import(/* webpackChunkName: "locale.zh" */'antd/es/locale-provider/zh_CN'),
    get_reactIntlLocale: () => import(/* webpackChunkName: "locale.zh" */'react-intl/locale-data/zh'),
    momentLocale: 'zh-cn'
  }
}

let intl

const IntlCapture = (props, context) => {
  intl = context.intl
  return props.children
}
IntlCapture.contextTypes = {
  intl: intlShape.isRequired
}

// react-intl 暴露出方法供调用
export const formatMessage = (message, values) => {
  return intl.formatMessage(message, values)
}

export const $t = (id, values) => {
  return intl.formatMessage({ id }, values) // 坑爹的react-intl,有没有更好的方法？
}

// 组件方式
export const $fm = (id, values) => {
  return <FormattedMessage id={id} values={values}></FormattedMessage>
}

const IntlWrapper = (props) => {
  const { children, locale } = props
  const [ IntlLocale, setIntlLocale ] = useState({
    antLocale: null,
    messages: null,
    momentLocale: null
  })

  useEffect(() => {
    const { get_messages, get_antLocale, get_reactIntlLocale, momentLocale } = LocalePromise[locale] || LocalePromise['en']
    Promise.all([get_messages(), get_antLocale(), get_reactIntlLocale()])
      .then(([customMessage, antLocale, reactIntlLocale]) => {
        let _intlLocale = {
          messages: customMessage.default,
          antLocale: antLocale.default,
          reactIntlLocale: reactIntlLocale,
          momentLocale: momentLocale
        }
        setIntlLocale(_intlLocale)
      })
  }, [locale])

  const { antLocale, messages, momentLocale, reactIntlLocale } = IntlLocale

  if (!antLocale) return null // todo 加载语言的loading

  moment.locale(momentLocale)

  addLocaleData([...Object.values(reactIntlLocale)])

  return (
    // antd组件国际化 切换语言， 需要刷新浏览器， 这里暂时在backend组件内部用key强制刷新
    <ConfigProvider locale={antLocale}>
      <IntlProvider locale={locale} messages={messages}>
        <IntlCapture>
          {children}
        </IntlCapture>
      </IntlProvider>
    </ConfigProvider>
  )
}

export default connect(
  state => ({
    locale: state.locale
  })
)(IntlWrapper)
