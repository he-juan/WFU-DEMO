import React, { useContext } from 'react'
import { IntlProvider, addLocaleData, intlShape, FormattedMessage } from 'react-intl'
import { GlobalContext } from './ContextProvider'
import { LocaleProvider } from 'antd-mobile'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'

// custom
import locales_en from './assets/locales/en.locales'
import locales_zh from './assets/locales/zh.locales'

import locales_am_en from 'antd-mobile/lib/locale-provider/en_US'

addLocaleData([...en, ...zh])

const IntlLocale = {
  'en': locales_en,
  'zh': locales_zh
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

const Intl = (props) => {
  const { children } = props
  const { curLocale } = useContext(GlobalContext)
  let locale = curLocale[0] === 'zh_Hans' ? 'zh' : 'en'
  return (
    <IntlProvider locale={locale || 'en'} messages={IntlLocale[locale] || IntlLocale['en']}>
      <IntlCapture>
        <LocaleProvider locale={locale === 'en' ? locales_am_en : undefined}>
          {children}
        </LocaleProvider>
      </IntlCapture>
    </IntlProvider>
  )
}

export default Intl
