/**
 * 通话模块下的actions 区分出来
 */
import * as Types from '../actionTypes'
import API from '@/api'

/** ******************************** pure actions ***************************/

/**
 * 设置联系人
 */

export const setContacts = (contacts) => {
  return {
    type: Types.SET_CONTACTS,
    contacts: contacts
  }
}

/**
 * 设置通话记录
 */
export const setCallLogs = (callLogs) => {
  return {
    type: Types.SET_CALL_LOGS,
    callLogs: callLogs
  }
}

/**
 * 设置联系人群组
 */
export const setContactsGroups = (contactsGroups) => {
  return {
    type: Types.SET_CONTACTS_GROUPS,
    contactsGroups: contactsGroups
  }
}

/**
 * 设置最大成员数
 */
export const setMaxLineCount = (maxlinecount) => {
  return {
    type: Types.SET_MAX_LineCOUNT,
    maxlinecount
  }
}

/**
 * 设置线路信息
 */
export const setLinesInfo = (linesInfo) => {
  return {
    type: Types.SET_LINES_INFO,
    linesInfo
  }
}

/**
 * 设置全局会议状态信息
 */
export const setConfInfo = (confInfo) => {
  return {
    type: Types.SET_CONF_INFO,
    confInfo
  }
}

/**
 * 设置会议账号相关 sip和谷歌
 */
export const setConfAccts = (confAccts) => {
  return {
    type: Types.SET_CONF_ACCTS,
    confAccts
  }
}

/**
 * 设置会议列表
 */
export const setConfList = (confList) => {
  return {
    type: Types.SET_CONF_LIST,
    confList
  }
}
/** ******************************** async actions ***************************/

/**
 * 获取并存储 联系人
 */
// export const getContacts = () => (dispatch) => {
//   API.getContacts().then(({ result, data }) => {
//     if (!result && data) {
//       dispatch(setContacts(data.contacts))
//     }
//   })
// }

/**
 * 获取并设置 通话记录
 */
export const getCallLogs = () => (dispatch) => {
  API.getCallLogs().then(({ result, data }) => {
    if (!result && data) {
      dispatch(setCallLogs(data.calllogs))
    }
  })
}

/**
 * 根据id查找联系人
 * @param {String} id 联系人id
 * @param {Array} contacts 所有联系人的列表
 */
const getContactsById = (id, contacts) => {
  return contacts.find(item => Number(item.id) === Number(id))
}

/**
 * 获取联系人和群组列表 先获取联系人列表， 再获取群组，并根据群组下的contactid 找到 对应的联系人 合并在一个数组内
 */
export const getContactsAndGroups = () => (dispatch) => {
  API.getContacts().then(({ data }) => {
    dispatch(setContacts(data.contacts)) // 设置联系人
    return data.contacts
  }).then(contacts => {
    API.getContactsGroups().then(({ Response, Data }) => {
      if (Response === 'Success') {
        let tempGroups = {}
        Data.forEach(group => {
          const id = group.Id
          const name = group.Name
          const contactId = group.ContactId
          const curContact = getContactsById(contactId, contacts)
          if (tempGroups[id]) {
            curContact && tempGroups[id].contacts.push(curContact) // 未找到联系人则不插入 (群组成员的id没有在联系人列表中找到， 这个是后端数据不正确的原因)
            ++tempGroups[id].num
          } else {
            tempGroups[id] = {
              id,
              name,
              num: contactId !== '0' ? 1 : 0,
              contacts: contactId !== '0' && curContact ? [curContact] : [] }
          }
        })
        let contactsGroups = Object.values(tempGroups)
        dispatch(setContactsGroups(contactsGroups)) // 设置群组
      }
    })
  })
}

/**
 * 获取并设置最大线路数
 */
export const getMaxLineCount = () => (dispatch) => {
  API.getMaxLineCount().then(data => {
    if (!data.result) {
      dispatch(setMaxLineCount(data.data.count))
    }
  })
}

/**
 * 获取并设置线路信息
 */
export const getLinesInfo = () => (dispatch) => {
  API.getAllLineInfo().then(data => {
    let linesInfo = typeof data === 'object' ? [data] : JSON.parse(`[${data}]`)
    dispatch(setLinesInfo(linesInfo))
  })
}

/**
 * 获取并设置全局会议状态信息
 *
 */
export const getConfInfo = () => (dispatch) => {
  API.getGlobalConfInfo().then(data => {
    if (!data.result) {
      dispatch(setConfInfo(data.data))
    }
  })
}

/**
 * 获取会议账号相关 sip和谷歌
 */
export const getConfAccts = () => (dispatch) => {
  API.getConfAccts().then(({ result, msg, data }) => {
    if (!result) {
      dispatch(setConfAccts(data.accounts || ''))
    } else {
      dispatch(setConfAccts(''))
    }
  })
}

/**
 * 获取会议列表
 */
export const getConfList = () => (dispatch) => {
  API.getSchedules().then(({ result, msg, data }) => {
    if (!result) {
      dispatch(setConfList(data.schedules.filter(s => s.Host !== 'IPVideoTalk')))
    }
  })
}
