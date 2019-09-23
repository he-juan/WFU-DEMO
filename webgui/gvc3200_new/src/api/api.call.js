/* eslint-disable no-multiple-empty-lines */
/**
 * 通话模块接口(会控接口是否区分出来？)
 */
import _axios from '@/utils/request'
import { parseUrlParams } from '@/utils/tools'
import { message } from 'antd'
import { $t } from '@/Intl'

/**
 * 获取通讯录
 */
export const getContacts = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getcontacts'
  })
}

/**
 * 获取通话记录
 */
export const getCallLogs = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getcalllogs'
  })
}

/**
 * 获取联系人群组列表
 */
export const getContactsGroups = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=sqlitecontacts&region=apps&type=groups'
  })
}

/**
 * 删除会议记录
 * @param {String} delId 需要删除的会议Id 通过逗号连接 如： 359,360,432
 */
export const removeCallConf = (delId) => {
  return _axios({
    method: 'get',
    url: '/manager?action=removecallconf&region=webservice&confId=' + delId
  })
}

/**
 * 删除单路通话记录（目前有未接来电的记录通过这个接口删除， 其他单路通话实际上还是会议通话， 因此应该调用removeCallConf）
 * @param {String} delId 需要删除的单路通话id 通过逗号连接
 * @param {*} flag ？
 */
export const removeCall = (delId, flag) => {
  return _axios({
    method: 'get',
    url: `/manager?action=removecall&region=webservice&flag=${flag}&id=${delId}`
  })
}

/**
 * 清空所有通话记录
 */
export const clearAllCallHistory = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=clearallcallhistory&region=webservice'
  })
}

/**
 * 删除联系人
 * @param {String} contactids 联系人id 传空则清空所有
 */
export const removeContact = (contactids) => {
  return _axios({
    method: 'get',
    url: '/manager?action=removecontact&region=webservice&contactid=' + contactids
  })
}

/**
 * 添加或编辑联系人  // 这个接口有很多问题 不能修改， 同名联系人不能添加
 * @param {JsonString} contactInfo 待添加或编辑的联系人信息
 */
export const setContact = (contactInfo) => {
  return _axios({
    method: 'get',
    url: '/manager?action=setcontact&region=webservice&format=json&contactInfo=' + contactInfo
  })
}

/**
 * 导入导出通讯录
 * @param {Object} param0
 */
export const putportphbk = ({ flag, portReplace, portClear, opmode, portType, portEncode }) => {
  return _axios({
    method: 'get',
    url: `/manager?action=putportphbk&${parseUrlParams({
      flag,
      portReplace,
      portClear,
      opmode,
      portType,
      portEncode
    })}`
  })
}

/**
 * 导入通讯录的处理？
 */
export const phbkresponse = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=phbkresponse'
  })
}

/**
 * 导出通讯录相关的接口
 */
export const savephbk = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=savephbk'
  })
}

/**
 * 修改下载通讯录的配置后会调用的接口
 */
export const sendphbknotify = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=phbknotify'
  })
}

/**
 * 下载通讯录
 * @param {Object} param0
 */
export const putdownphbk = (
  downMode,
  flag,
  downUrl,
  downReplace,
  downClear,
  downInterval,
  downType,
  downEncode,
  Username,
  passWord
) => {
  return _axios({
    method: 'get',
    url: `/manager?action=putdownphbk&${parseUrlParams(
      downMode,
      flag,
      downUrl,
      downReplace,
      downClear,
      downInterval,
      downType,
      downEncode,
      Username,
      passWord
    )}`
  })
}

/**
 * 删除群组
 * @param {String} groupIds 待移除的groupid, 逗号隔开 eg. '345, 346'
 */
export const removeGroup = (groupIds) => {
  return _axios({
    method: 'get',
    url: '/manager?action=removegroup&region=webservice&groupID=' + groupIds
  })
}

/**
 * 设置群组名称
 * @param {String} groupInfo group id和名称的拼接 id:::name  eg. 387:::suzzdf
 */
export const setGroup = (groupInfo) => {
  return _axios({
    method: 'get',
    url: `/manager?action=setgroup&region=webservice&groupInfo=${groupInfo}&format=json`
  })
}

/**
 * 设置群组下的联系人
 * @param {Object} param0 {id， contactids}  eg. {id: 387, contactids: 001:::002:::45691}
 */
export const updateGroupMemberShip = ({ id, contactids }) => {
  return _axios({
    method: 'get',
    url: `/manager?action=updateGroupMemberShip&region=webservice&${parseUrlParams({
      id,
      contactids
    })}`
  })
}

const callErr = {
  '-1': 'm_061', // 未知错误
  '2': 'm_173', // 帐号不可用
  '3': 'm_174', // 匿名号码不可呼叫
  '4': 'm_175', // 号码为呼叫功能码
  '5': 'm_176', // 启用SRTP呼叫功能
  '6': 'm_177', // 禁用SRTP功能
  '7': 'm_178', // 匿名呼叫功能已激活
  '8': 'm_179', // 匿名呼叫功能禁用
  '9': 'm_180', // 呼叫等待功能已激活
  '10': 'm_181', // 呼叫等待功能已禁用
  '11': 'm_182', // 无条件转移功能已激活
  '12': 'm_183', // 无条件转移功能已禁用
  '13': 'm_184', // 遇忙转移功能已激活
  '14': 'm_185', // 遇忙转移功能已禁用
  '15': 'm_186', // 无应答转移功能已激活
  '16': 'm_187', // 无应答转移功能已禁用
  '17': 'm_188', // 禁止IP呼叫
  '18': 'm_189', // IP格式错误
  '19': 'm_190', // 不符合拨号规则
  '20': 'm_191', // 符合部分拨号规则
  '21': 'm_192', // 会议被禁用
  '22': 'm_193', // 成员数量已达上限
  '23': 'm_195', // 线路已满
  '24': 'm_196', // 蓝牙线路已满
  '25': 'm_197', // 拨打的号码已存在一条呼叫中的线路
  '26': 'm_198', // 拨打的号码已存在一条振铃中的线路
  '27': 'm_199', // 拨打的号码已存在一条通话中的线路
  '29': 'm_200', // 拨打的号码已存在一条会议中的线路
  '30': 'm_201', // 锁屏中，拨打的号码不是紧急号码
  '31': 'm_202', // 话机恢复数据中，不能呼叫
  '32': 'm_203', // 视频线路已满，不能进行视频呼叫
  '33': 'm_204' // 323帐号不支持会议
}

/**
 * 统一的呼出接口
 * @param {Array} memToCall 待呼出的成员列表
 * memToCall eg. [
 *  {
 *   "acct":"8",  账号类型 0， 1, 2, 8
 *   "num":"1020", 号码
 *   "isvideo":"1", 是否是视频会议
 *   "source":"4",  呼出来源: 来电记录取 3,  去电记录 取 4, 未接来电 取 3,  联系人 取1， 输入框输入拨打取 2
 *   "isconf":"1"  该值写死为 1
 *  },
 *  ...
 * ]
 */
export const makeCall = (memToCall) => {
  return _axios({
    method: 'get',
    url: '/manager?action=makecall&members=' + encodeURIComponent(JSON.stringify(memToCall))
  }).then(msg => {
    let ret = JSON.parse(msg.data.ret).filter(r => parseInt(r) !== 0)[0] // 这里只取第一个错误
    if (ret) {
      message.error($t(callErr[ret]))
    }
    return Promise.resolve(msg)
  }).catch(err => {
    console.error(err)
    return Promise.reject(err)
  })
}

/**
 * 获取最大线路数
 */
export const getMaxLineCount = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getmaxlinecount'
  })
}

/**
 * 获取当前线路信息
 */
export const getAllLineInfo = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getallLineInfo'
  })
}

/**
 * 获取会议的全局状态
 */
export const getGlobalConfInfo = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getglobalconfinfo'
  })
}

/**
 * 新接口 获取会议记录
 */
export const getSchedules = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getschedules'
  })
}

/**
 * 立即启会
 */
export const startSchedule = (params) => {
  return _axios({
    method: 'get',
    url: '/manager?action=startpreconf&' + parseUrlParams(params)
  }).then(msg => {
    let ret = JSON.parse(msg.data.ret).filter(r => parseInt(r) !== 0)[0] // 这里只取第一个错误
    if (ret) {
      message.error($t(callErr[ret]))
    }
    return Promise.resolve(msg)
  }).catch(err => {
    console.error(err)
    return Promise.reject(err)
  })
}

/**
 * 删除 单个会议
 */
export const deleteOnceSchedule = (Id) => {
  return _axios({
    method: 'get',
    url: '/manager?action=notifyschedule&region=webservice&type=5&scheduleId=' + Id
  })
}

/**
 * 删除 整个会议
 */
export const deleteSchedule = (Id) => {
  return _axios({
    method: 'get',
    url: '/manager?action=deleteschedule&region=webservice&id=' + Id
  })
}

/**
 * 添加 或者 编辑会议
 */
export const setSchedule = (params, type = 'add') => {
  let url = ''
  if (type === 'add') url = '/manager?action=addschedule&region=webservice&'
  else url = '/manager?action=updateschedule&region=webservice&'
  url += parseUrlParams(params)
  return _axios({
    method: 'get',
    url
  })
}
