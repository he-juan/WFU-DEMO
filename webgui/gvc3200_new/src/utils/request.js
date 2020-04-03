/**
 * axios 封装
 */
import axios from 'axios'
import { parseRawText } from '@/utils/tools'
import { history } from '@/App'
import Cookie from 'js-cookie'

// 实例化一个_axios
const _axios = axios.create({
  // timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
})

// 请求拦截
_axios.interceptors.request.use(
  config => {
    // 当为formdata提交时，修改headers
    if (config.commitType === 'form') {
      config.headers['Content-Type'] = 'multipart/form-data'
    }
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
    // 格式化以字符串返回的数据
    if (typeof data === 'string' && data.length > 0) {
      if (res.config.stringData) { // 如果是_axios请求 配置了stringData 为true, 表明该数据就是字符串，不需要解析成json
        data = res.data
      } else {
        try {
          data = parseRawText(data)
        } catch (e) {
          console.warn(e)
        }
      }
    }
    if (data.Response === 'Error' && data.Message === 'Authentication Required') { // 认证失败 回退登录页
      Cookie.remove('type')
      if (history.location.pathname === '/login') return false
      // history.push(`/login?redirect=${encodeURIComponent(history.location.pathname)}`) //menu 会有报错 Can't perform a React state update on an unmounted component, 暂未找到解决方案, 改成刷新
      let _pathname = history.location.pathname
      window.location.href = `/login?redirect=${encodeURIComponent(_pathname)}`
    }
    return data
  },
  err => {
    if (err.response && err.response.status >= 500 && window.location.pathname !== '/login') {
      Cookie.remove('type')
      window.location.href = `/login`
      return false
    }
    return Promise.reject(err)
  }
)

export default _axios
