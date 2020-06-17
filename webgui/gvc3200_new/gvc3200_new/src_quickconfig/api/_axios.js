import axios from 'axios'
import { history } from '../QuickConfigApp'

/**
 * 返回的字符串
 * @param {string} data 未格式化的字符串
 */
const parseRawText = function (data) {
  let msgs = {}
  data = data.split('\r\n')
  data.forEach(str => {
    if (str.trim().length) {
      let reg = /([^=]+)=([\s\S]*)/
      let ary = str.match(reg)
      msgs[ary[1]] = ary[2]
      // 存在多个=号时以下做法出错
      // let ary = str.split('=')
      // let key = ary[0]
      // msgs[key] = ary[1]
    }
  })
  return msgs
}

const _axios = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
})

// 请求拦截
_axios.interceptors.request.use(
  config => {
    // ...
    config.url += `&time=${new Date().getTime()}`
    return config
  },
  error => {
    console.error(error)
    Promise.reject(error)
  }
)

// 返回拦截
_axios.interceptors.response.use(
  res => {
    let { data } = res
    if (typeof data === 'string' && data.length > 0) {
      try {
        data = parseRawText(data)
      } catch (e) {
        console.warn(e)
      }
    }
    if (data === 'Cookie Invalid') {
      history.replace('/refreshqrcode')
    }
    return data
  },
  err => {
    return Promise.reject(err)
  }
)

export default _axios
