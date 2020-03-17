/* eslint-disable no-multi-spaces */
/* eslint-disable no-multiple-empty-lines */
import moment from 'moment'
import { store } from '@/store'
import { history } from '@/App'
import { $t, $fm } from '@/Intl'
import deepClone from './deepClone'

/**
 * search parse
 * @param {string} search eg. ?redirect=%2Fbak%2Facct_sip%2Fgeneral
 */
export const parseSearch = function (search) {
  if (!search) return {}
  let searchAry = search.replace('?', '').split('&')
  let result = {}
  searchAry.forEach(s => {
    let sAry = s.split('=')
    result[sAry[0]] = decodeURIComponent(sAry[1])
  })

  return result
}

/**
 * 返回的字符串
 * @param {string} data 未格式化的字符串
 */
export const parseRawText = function (data) {
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

/**
 * 补0
 * @param {string} num 待补0
 * @param {number} n 补几位
 */
export const prefixInteger = function (num, n) {
  return (Array(n).join(0) + num).slice(-n)
}

/**
 * 按application/x-www-form-urlencoded进行格式化
 * @param {Object} obj eg. {name: 'admin', password: 'admin1'}
 * @return {string} name=admin&password=admin1
 */
export const parseUrlParams = (obj) => {
  let keys = Object.keys(obj)
  let result = ''
  keys.forEach(key => {
    result += `${key}=${obj[key]}&`
  })
  return result.slice(0, -1)
}

/**
 * 深拷贝
 * @param {*} payload json对象或array
 */
export const deepCopy = deepClone

/**
 * 函数防抖
 * @param {Function} fn 被防抖的函数
 * @param {Number} ms 延时
 */
export const debounce = (fn, ms = 100) => {
  let TIMER = null
  return function () {
    let _this = this
    let _args = arguments
    clearTimeout(TIMER)
    TIMER = setTimeout(function () {
      TIMER = null
      fn.apply(_this, _args)
    }, ms)
  }
}

/**
 * 针对 react综合事件的防抖 // https://reactjs.org/docs/events.html#overview
 * @param {Function} fn 被防抖的函数
 * @param {Number} ms 延时
 */
export const debounceReactEvent = (fn, ms = 100) => {
  let debounceFn = debounce(fn, ms)
  return function () {
    let _args = arguments
    try {
      _args[0].persist() // 事件放第一位参数， 否则出错
    } catch (err) {
      throw Error('event must be the 1st！')
    }
    debounceFn.apply(null, _args)
  }
}

/**
 * 函数节流
 * @param {Function} fn
 * @param {Number} ms 延时
 */
export const throttle = (fn, ms = 100) => {
  let TIMER = null
  return function () {
    if (TIMER) return false
    let _this = this
    let _args = arguments
    TIMER = setTimeout(function () {
      clearTimeout(TIMER)
      TIMER = null
      fn.apply(_this, _args)
    }, ms)
  }
}

/**
 * 针对 react综合事件的节流 // https://reactjs.org/docs/events.html#overview
 * @param {Function} fn 被节流的函数
 * @param {Number} ms 延时
 */
export const throttleReactEvent = (fn, ms = 100) => {
  let throttleFn = throttle(fn, ms)
  return function () {
    let _args = arguments
    try {
      _args[0].persist() // 事件放第一位参数， 否则出错
    } catch (err) {
      throw Error('event must be the 1st！')
    }
    throttleFn.apply(null, _args)
  }
}

/**
 * transStr
 * 转化x小于10为 0x
 */
export const transStr = (num) => {
  num = parseInt(num)
  return num < 10 ? '0' + num : num.toString()
}

/**
 * convertStr
 * 转化 a=1;b=1 为 { a: 1, b: 1}
 */
export const convertStr = (str = '') => {
  let obj = {}
  if (str) {
    str.split(';').forEach(el => {
      let _el = el.split('=')
      obj[_el[0]] = _el[1]
    })
  }
  return obj
}


export const isIp = (value) => {
  return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/i.test(value) ||
  (/^\[?((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\]?$/.test(value) &&
  ((value.indexOf('[') !== -1 && value.indexOf(']')) !== -1 || (!(value.indexOf('[') !== -1) && !(value.indexOf(']') !== -1))))
}

/** *********************************************业务相关**************************************************************** */




/**
 * 帐号key => 帐号名称
 */
const acctMap = {
  '0': 'SIP',
  '1': 'IPVideoTalk',
  '2': 'Bluejeans',
  '8': 'H.323',
  '-1': $fm('c_219'), // 动态账号
  '4': $fm('c_301'), // 默认账号
  '5': 'Zoom'
}
/**
 * 根据帐号id匹配对应的帐号名称
 * @param {String} key 0, 1, 2, 8
 */
export const parseAcct = (key) => {
  return acctMap[key]
}






/**
 * calltype 和 souce的映射关系
 */
const TypeToSourceMap = {
  '1': '3', // 来电 source 取 3
  '2': '4', // 去电 source 取 4,
  '3': '3', // 未接来电 source 取 3,
  '0': '1' // 联系人 source 取1,
}
/**
 * 通话记录的callType 映射 source 用于呼叫
 * @param {String} type callType
 */
export const mapToSource = (type) => {
  return TypeToSourceMap[type] || '2'
}







/**
 * 返回图标名 是否是会议, 单路(呼入,呼出,未接来电), 联系人
 * @param {Object} record 消息记录或联系人记录
 */
export const getRecordIcon = function (record) {
  const { isconf, calltype, isvideo, isfavourite } = record
  // 会议类型
  if (isconf === '1') {
    return 'icon-conf'
  }
  // 单路或成员
  if (calltype) {
    switch (calltype) {
      case '1':
        return isvideo === '1' ? 'icon-in-video' : 'icon-in-audio'
      case '2':
        return isvideo === '1' ? 'icon-out-video' : 'icon-out-audio'
      case '3':
        return isvideo === '1' ? 'icon-miss-video' : 'icon-miss-audio'
      default:
    }
  }
  // 联系人
  return isfavourite === '1' ? 'icon-contacts-fav' : 'icon-contacts'
}






const utcOffset = moment().utcOffset() * 60000
/**
 * 根据记录的时间戳，结合时区，结合当前的机器时间，进行一系列处理并返回对应的格式字符串
 * @param {number} timestamp 某条记录的时间戳
 * @param {obj} param1 {
 * showtime, 是否显示时间
 * showtoday , 日期为今天时 是否显示 ‘今天’
 * }
 */
export const momentFormat = (timestamp, { showtime, showtoday }) => {
  let { timezone, timestampNow, dateTimeFmt: { dateFmt, timeFmt } } = store.getState() // 应用进来后首先会获取时间相关几个参数， 且必须先获取到， 否则这里getState会失效
  let curMoment = moment(parseInt(timestamp) - utcOffset + timezone)
  let fmtstr = ''
  if (!curMoment.isSame(moment(timestampNow), 'year')) {                           // 如果不是今年
    fmtstr = showtime ? `${dateFmt} ${timeFmt}` : `${dateFmt}`
  } else if (curMoment.isSame(moment(timestampNow).subtract(1, 'days'), 'day')) { // 如果是昨天
    fmtstr = showtime ? `[${$t('c_302')}] ${timeFmt}` : `[${$t('c_302')}]`
  } else if (curMoment.isSame(moment(timestampNow), 'day')) {                     // 今天
    fmtstr = showtoday ? `[${$t('c_303')}] ${timeFmt}` : `${timeFmt}`
  } else if (curMoment.isSame(moment(timestampNow).add(1, 'days'), 'day')) {      // 明天
    fmtstr = showtime ? `[${$t('c_304')}] ${timeFmt}` : `[${$t('c_304')}]`
  } else {                                                                 // 今年的其他日期时间
    let _dateFmt = dateFmt.replace(/(\/YYYY$|^YYYY\/)/, '')
    fmtstr = showtime ? `${_dateFmt} ${timeFmt}` : `${_dateFmt}`
  }

  return {
    strRes: curMoment.format(fmtstr),
    objRes: curMoment
  }
}

/**
 * 本地存储监听事件，返回一个 add 和 remove
 */
export const storageListener = (() => {
  let event = (e) => {
    let { key, newValue, oldValue } = e
    let newlogin = newValue > 0 && oldValue > 0
    let alllogout = !newValue && oldValue > 0
    if (key === 'logindate' && (newlogin || alllogout)) {
      if (window.isIEBrowser && window.isLoginPageEvent) {
        window.isLoginPageEvent = false
      } else {
        history.push('/login')
      }
    }
  }
  return {
    add: () => {
      window.addEventListener('storage', event, true)
    },
    remove: () => {
      window.removeEventListener('storage', event, true)
    }
  }
})()



/**
 * 根据路由的 denyModel 和 denyRole 判断是否显示菜单项
 */
export const isMenuRouteDeny = route => {
  let {
    productInfo: { BaseProduct },
    oemId,
    userType
  } = store.getState()
  let { denyModel, denyRole, denyOem } = route

  if (
    (denyRole && denyRole.indexOf(userType) > -1) ||
    (oemId === denyOem) ||
    (denyModel && denyModel.indexOf(BaseProduct) > -1)
  ) {
    return true
  }
  return false
}

/**
 * 一定的时间搓转换为 hh:mm:ss
 */
export const timesToDuration = duration => {
  let timeStr = ''
  duration = parseInt(duration / 1000, 10)
  let hour = parseInt(duration / 3600, 10)
  if (hour !== 0) {
    if (hour < 10) timeStr += '0'
    timeStr += hour + ':'
  }
  let min = parseInt((duration - hour * 3600) / 60, 10)
  if (min < 10) timeStr += '0'
  timeStr += min + ':'

  let second = duration - 3600 * hour - 60 * min
  if (second < 10) timeStr += '0'
  timeStr += second

  return timeStr
}

/**
 * 秒数转换为 hh:mm:ss
 */
export const formatTime = times => {
  let timetext = ''
  let seconds = times % 60
  let minutes = parseInt(times / 60)
  let hours = 0
  if (minutes !== 0) {
    hours = parseInt(minutes / 60)
    minutes = minutes % 60
  }

  timetext += hours < 10 ? '0' + hours : hours
  timetext += ':' + (minutes < 10 ? '0' + minutes : '' + minutes)
  timetext += ':' + (seconds < 10 ? '0' + seconds : '' + seconds)
  return timetext
}

/**
 * 缩写 IPV6 地址
 */
export const compressIPV6 = addr => {
  if (addr === '0:0:0:0:0:0:0:0') return addr
  let formatted = addr.replace(/(^|:)0+(?!(?::|$))/g, '$1').replace(/(:(?:0:){2,})(?!\S*(?:\1)0:)/, '::')
  let finalAddress = formatted.split(':')
    .map(octet => {
      return octet.replace(/\b0+/g, '')
    }).join(':')
  return finalAddress
}

/**
 * 根据数组中某个对象值去重 arr,key
 * @param {array} arr
 * @param {string} key
 */
export const uniqBy = (arr, key) => {
  const res = new Map()
  return arr.filter((a) => !res.has(a[key]) && res.set(a[key], 1))
}

/**
 * 转义正则表达式
 * @param {*} str
 */
export const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')



// 用于取反一些p值
export const reverseSomePvalue = (itemVal, itemName) => {
  let arr = [

    '26001', // sip禁用演示
    '26201', // bj 禁用演示
    '26501', // zoom 禁用演示
    '276', // 禁止SSH访问
    '338', // 禁止通话中DTMF显示
    '91', // 禁止呼叫等待
    '186', // 无呼叫等待音
    '1486', // 禁用勿扰模式提醒音
    '1549', // 升级时不弹出确认框
    '4428', // 禁用SIP NOTIFY认证
    '277' // 禁用IP拨打模式
  ]

  let inAdjust = -1
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === itemName) inAdjust = i
  }
  if (inAdjust !== -1) {
    itemVal = +itemVal === 1 ? 0 : 1
  }
  return itemVal
}
