import * as Types from '../actionTypes'
import Cookie from 'js-cookie'

/**
 * 语言
 */
export const locale = (state = Cookie.get('locale') || 'en', action) => {
  switch (action.type) {
    case Types.SET_LOCALE:
      return action.locale
    default:
      return state
  }
}

/**
 * 产品名称
 */
export const productInfo = (state = JSON.parse(Cookie.get('productInfo') || '{"Product":"", "Vendor": ""}'), action) => {
  switch (action.type) {
    case Types.SET_PRODUCT_INFO:
      return action.productInfo
    default:
      return state
  }
}

export const oemId = (state = '0', action) => {
  switch (action.type) {
    case Types.SET_OEM_ID:
      return action.oemId
    default:
      return state
  }
}

/**
 * 是否有待应用的配置项
 */
export const needApply = (state = false, action) => {
  switch (action.type) {
    case Types.SET_NEEDAPPLY:
      return action.needApply
    default :
      return state
  }
}

/**
 * 是否显示全屏的loading层
 */
export const wholeLoading = (state = { isLoad: false, tip: '' }, action) => {
  switch (action.type) {
    case Types.SET_WHOLE_LOADING:
      return action.wholeLoading
    default:
      return state
  }
}
/**
 * 所有帐号状态
 */
export const acctStatus = (state = [], action) => {
  switch (action.type) {
    case Types.SET_ACCT_STATUS:
      return action.acctStatus
    default :
      return state
  }
}

/**
 * 默认账号
 */
export const defaultAcct = (state = 0, action) => {
  switch (action.type) {
    case Types.SET_DEFAULT_ACCT:
      return action.defaultAcct
    default:
      return state
  }
}

/**
 * 全局网络状态
 */
export const networkStatus = (state = {}, action) => {
  return action.type === Types.SET_NETWORK_STATUS ? action.networkStatus : state
}

/**
 * ipvt 激活状态
 */
export const IPVTExist = (state = 0, action) => {
  return action.type === Types.SET_IPVT_EXIST ? action.IPVTExist : state
}

/**
 * 根据时区计算出的时间戳偏移量
 */
export const timezone = (state = 0, action) => {
  return action.type === Types.SET_TIME_ZONE ? action.timezone : state
}

/**
 * 设备当前时间(已经过时区转换)的时间戳
 */
export const timestampNow = (state = -1, action) => {
  return action.type === Types.SET_TIMESTAMP_NOW ? action.timestampNow : state
}
/**
 * 设置日期时间的格式
 */
export const dateTimeFmt = (state = { dateFmt: 'YYYY/MM/DD', timeFmt: 'HH:mm' }, action) => {
  return action.type === Types.SET_DATE_TIME_FMT ? action.dateTimeFmt : state
}

/**
 * 用户类型
 */
export const userType = (state = Cookie.get('type') || 'admin', action) => {
  return action.type === Types.SET_USER_TYPE ? action.userType : state
}
