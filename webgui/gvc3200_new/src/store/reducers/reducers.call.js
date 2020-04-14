/**
 * 通话模块下的reducers 区分出来
 */
import * as Types from '../actionTypes'

/**
 * 联系人
 */
export const contacts = (state = [], action) => {
  switch (action.type) {
    case Types.SET_CONTACTS:
      return action.contacts
    default:
      return state
  }
}

/**
 * 通话记录
 */
export const callLogs = (state = [], action) => {
  switch (action.type) {
    case Types.SET_CALL_LOGS:
      return action.callLogs
    default:
      return state
  }
}

/**
 * 联系人群组
 */
export const contactsGroups = (state = [], action) => {
  switch (action.type) {
    case Types.SET_CONTACTS_GROUPS:
      return action.contactsGroups
    default:
      return state
  }
}

/**
 * 最大通话成员数
 */
export const maxLineCount = (state = 100, action) => {
  return action.type === Types.SET_MAX_LineCOUNT ? action.maxlinecount : state
}

/**
 * 线路状态
 */
export const linesInfo = (state = [], action) => {
  switch (action.type) {
    case Types.SET_LINES_INFO:
      return action.linesInfo
    default:
      return state
  }
}

/**
 * 全局会议状态
 */
export const confInfo = (state = {}, action) => {
  switch (action.type) {
    case Types.SET_CONF_INFO:
      return action.confInfo
    default:
      return state
  }
}

/**
 * 会议账号
 */
export const confAccts = (state = '', action) => {
  switch (action.type) {
    case Types.SET_CONF_ACCTS:
      return action.confAccts
    default:
      return state
  }
}

/**
 * 会议列表
 */
export const confList = (state = [], action) => {
  switch (action.type) {
    case Types.SET_CONF_LIST:
      return action.confList
    default:
      return state
  }
}
