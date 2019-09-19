// 使用context 缓存一些全局数据， 不用redux
import React, { createContext, useState, useEffect } from 'react'

// 语言列表和当前语言
export const GlobalContext = createContext({
  curLocale: [],
  localeList: [],
  timezone: '',
  timezoneList: [],
  setCurLocale: () => {},
  setLocaleList: () => {},
  setTimezone: () => {},
  setTimezoneList: () => {}
})

const ContextProvider = (props) => {
  const { children } = props
  const sessionLocales = JSON.parse(sessionStorage.getItem('curLocale') || '[]')
  const [curLocale, setCurLocale] = useState(sessionLocales)
  const [localeList, setLocaleList] = useState([])
  const [timezone, setTimezone] = useState([])
  const [timezoneList, setTimezoneList] = useState([])
  // 更新了语言后重置时区列表
  useEffect(() => {
    sessionStorage.setItem('curLocale', JSON.stringify(curLocale))
    setTimezoneList([])
  }, [curLocale])
  return (
    <GlobalContext.Provider value={{
      curLocale,
      localeList,
      timezone,
      timezoneList,
      setCurLocale: setCurLocale,
      setLocaleList: setLocaleList,
      setTimezone: setTimezone,
      setTimezoneList: setTimezoneList
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default ContextProvider
