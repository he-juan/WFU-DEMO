/* eslint-disable no-multiple-empty-lines */
import _axios from './_axios'

/**
 * 似乎是个鉴权接口
 */
export const checkqrtoken = () => {
  let hash = document.location.hash
  if (hash) {
    hash = hash.substring(1)
  }
  return _axios({
    method: 'get',
    url: '/manager?action=checkqrtoken&region=quickconf&t=' + hash + '&format=json&jsoncallback='
  })
}

/**
 * 刷新二维码
 */
export const refreshqrcode = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=refreshqrcode&region=quickconf'
  })
}




/**
 * 获取语言
 */
export const getLanguage = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getlanguages&region=quickconf'
  })
}

/**
 * 设置语言
 * @param {String} lan 语言值
 */
export const putLanguage = (lan) => {
  return _axios({
    method: 'get',
    url: '/manager?action=putlanguage&region=quickconf&lan=' + lan
  })
}

/**
 * 按层级获取可选的语言列表
 * @param {Number} level 层级
 * @param {*} localeId ''
 */
export const getLocaleList = (level, localeId) => {
  return _axios({
    method: 'get',
    url: `/manager?action=getLocaleListByLevel&region=quickconf&level=${level}&localeId=${localeId}`
  })
}




/**
 * 获取时区
 * @param {String} lang 语言
 */
export const getTimezone = (lang) => {
  lang = lang === 'zh_Hans' ? 1 : 0
  return _axios({
    method: 'get',
    url: '/manager?action=gettimezone&region=quickconf&lang=' + lang
  })
}




/**
 * 设置时区
 * @param {String} value 时区值
 */
export const saveTimeSet = (value) => {
  return _axios({
    method: 'get',
    url: '/manager?action=savetimeset&region=quickconf&timezone=' + value
  })
}



export const network = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=network&region=quickconf'
  })
}




const prefixInteger = function (num, n) {
  return (Array(n).join(0) + num).slice(-n)
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
    url: `/manager?region=quickconf&action=get&${urlParams.join('&')}`
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
    urlParams.push(`var-${prefixInteger(i, 4)}=${key.slice(1)}`) // key.slice(1) 去掉 P前缀
    urlParams.push(`val-${prefixInteger(i, 4)}=${v}`)
  })
  return _axios({
    method: 'get',
    url: `/manager?region=quickconf&action=put&flag=${flag}&${urlParams.join('&')}`
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
 * 获取会场名称
 */
export const sqlitedisplay = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=sqlitedisplay&region=quickconf&type=sitesetting&affect=read'
  })
}

/**
 * 设置会场信息
 * http://localhost:8080/manager?action=setSitesettingInfo&region=advanset&bgtp=0&sitename=&dispos=0&disduration=0&fontcolor=&fontsize=0&bold=0&_=1559532453534
 * @param {string} params sitename
 */
export const setSitesettingInfo = (sitename) => {
  return _axios({
    method: 'get',
    url: '/manager?action=setSitesettingInfo&region=quickconf&sitename=' + sitename
  })
}

/**
 * 设置锁屏密码
 */
export const savelockpwd = (value) => {
  return _axios({
    method: 'get',
    url: '/manager?action=savelockpwd&region=quickconf&newlock=' + value
  })
}



export default {
  checkqrtoken,
  refreshqrcode,
  getLanguage,
  putLanguage,
  getLocaleList,
  getTimezone,
  saveTimeSet,
  network,
  getPvalues,
  putPvalues,
  sqlitedisplay,
  setSitesettingInfo,
  savelockpwd
}
