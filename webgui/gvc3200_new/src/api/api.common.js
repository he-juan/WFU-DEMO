import _axios from '@/utils/request'
import { prefixInteger, parseUrlParams } from '@/utils/tools'

// product 获取产品信息
export const getProduct = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=productinfo'
  })
}

// oem 获取
export const getOemId = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=coloreExist'
  })
}

// getSalt 登录加盐
export const getSalt = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=loginrealm'
  })
}
// login  登录接口
export const login = (username, password) => {
  return _axios({
    method: 'get',
    url: '/manager?action=login&Username=' + encodeURIComponent(username) + '&Secret=' + encodeURIComponent(password) + '&t=sha&src=web'
  })
}

// logoff 登出接口
export const logoff = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=logoff'
  })
}

/**
 * 修改密码
 * @param {Object} params { userpwd: '' } 或 { adminpwd: '' }
 */
export const changDefaultPwd = (params) => {
  return _axios({
    method: 'get',
    url: '/manager?action=changedefaultpwd&' + parseUrlParams(params)
  })
}

/**
 * 过期登出
 */
export const getConnectState = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getconnectstate'
  })
}

/**
 * 检测是否需要应用
 */
export const checkNeedApply = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=needapply'
  })
}

/**
 * 应用
 */
export const applyPvalue = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=applypvalue'
  })
}

/**
 * 检测是否应用成功
 */
export const applyPvaluersps = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=applypvaluersps'
  })
}

/**
 * 获取 p 值 用于初始化表单
 * @param {Array} params eg: [601, 602,...]
 */
export const getPvalues = (params) => {
  let urlParams = params.map((p, i) => {
    return `var-${prefixInteger(i, 4)}=${p.slice(1)}` // p.slice(1) 去掉 P前缀
  })
  return _axios({
    method: 'get',
    url: `/manager?action=get&${urlParams.join('&')}`
  }).then(data => {
    const { Response, ...pvalues } = data
    if (Response === 'Success') {
      let result = {}
      let keys = Object.keys(pvalues)
      keys.forEach(key => {
        result['P' + key] = pvalues[key]
      })
      return Promise.resolve(result)
    } else {
      return Promise.reject(Error('getPvalues err'))
    }
  })
}

/**
 * 设置 p 值
 * @param {object} params eg: {P601: '1', P602: '2}
 * @param {number} flag 0 不需要应用 1 需要应用
 */
export const putPvalues = (params, flag = 0) => {
  let urlParams = []
  let keys = Object.keys(params)
  keys.filter(v => typeof params[v] !== 'undefined').forEach((key, i) => {
    let v = params[key]
    let val = typeof v === 'boolean' ? Number(v) : typeof v === 'string' ? encodeURIComponent(v) : v
    urlParams.push(`var-${prefixInteger(i, 4)}=${key.slice(1)}`) // key.slice(1) 去掉 P前缀
    urlParams.push(`val-${prefixInteger(i, 4)}=${val}`)
  })
  return _axios({
    method: 'get',
    url: `/manager?action=put&flag=${flag}&${urlParams.join('&')}`
  }).then(data => {
    const { Response } = data
    if (Response === 'Success') {
      return Promise.resolve(data)
    } else {
      return Promise.reject(Error('putPvalues err'))
    }
  })
}

/**
 * 获取账号状态
 */
export const getAcctStatus = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=status'
  })
}

/**
 * 设置默认账号
 */
export const setDefAcct = (acctIndex) => {
  return _axios({
    method: 'get',
    url: '/manager?action=setdefaultacct&region=account&account=' + acctIndex
  })
}

/**
 * 获取全局网络状态
 */
export const getNetworkStatus = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=network'
  })
}

/**
 * 获取用户类型
 */
export const getUserType = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getusertype'
  })
}

/**
 * 遥控器 设置键值
 */
export const setKeyCode = (keyaction, keycode, repeattimes) => {
  let url = '/manager?action=remotekeypress&region=remotekey&' + parseUrlParams({ keyaction, keycode, repeattimes })
  return _axios({
    method: 'get',
    url
  })
}

/**
 * ping 一下服务器
 */
export const serverPing = (callback) => {
  let url = '/manager?action=ping'
  return _axios({
    method: 'get',
    url
  })
}

/** ****************时间相关的几个接口， (系统设置页内也有用到)******************** */

/**
 * 获取时区
 * @param {String} lang 语言
 */
export const getTimezone = (lang) => {
  lang = lang === 'en' ? 0 : 1
  return _axios({
    method: 'get',
    url: '/manager?action=gettimezone&lang=' + lang
  })
}

/**
 * 获取日期
 */
export const getDateInfo = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getdateinfo&region=maintenance'
  })
}

/**
 * 获取日期时间的显示格式 P102: 3 年月日; 0 年月日; 1 月日年; 2 日月年。 P122： 1为24小时; 0为12小时进制
 */
export const getDateTimeFmt = () => {
  return getPvalues(['P102', 'P122'])
}
