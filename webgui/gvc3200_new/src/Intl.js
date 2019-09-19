// https://github.com/formatjs/react-intl/issues/983#issuecomment-342314143
import React from 'react'
import { IntlProvider, addLocaleData, intlShape, FormattedMessage } from 'react-intl'
import { ConfigProvider } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { connect } from 'react-redux'
// react-intl
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
// antd-locale
import ant_zhCN from 'antd/es/locale-provider/zh_CN'
import ant_enUS from 'antd/es/locale-provider/en_US'
// custom
import locales_en from '@/assets/locales/locales_en'
import locales_zh from '@/assets/locales/locales_zh'

addLocaleData([...en, ...zh])

const IntlLocale = {
  'en': {
    messages: locales_en,
    antLocale: ant_enUS,
    momentLocale: 'en'
  },
  'zh': {
    messages: locales_zh,
    antLocale: ant_zhCN,
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

export const $t = (id) => {
  return intl.formatMessage({ id }) // 坑爹的react-intl,有没有更好的方法？
}

// 组件方式
export const $fm = (id) => {
  return <FormattedMessage id={id}></FormattedMessage>
}

const IntlWrapper = (props) => {
  const { children, locale } = props
  const { antLocale, messages, momentLocale } = IntlLocale[locale]
  moment.locale(momentLocale)
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
