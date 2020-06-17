/* 通用 */
import common from './zh.common'
/* 通话 */
import call from './zh.call'
/* 账号 */
import account from './zh.account'
/* 通话设置 */
import callFeature from './zh.callFeature'
/* 网络设置 */
import network from './zh.network'
/* 系统设置 */
import systemSettings from './zh.systemSettings'
/* 设备控制 */
import deviceControl from './zh.deviceControl'
/* 应用 */
import app from './zh.app'
/* 维护 */
import maintenance from './zh.maintenance'
/* 状态 */
import status from './zh.status'

/* eslint-disable no-multiple-empty-lines */
export default {
  /** ***************************** 通用 c_xxx *****************************************/
  ...common,
  ...call,
  ...account,
  ...callFeature,
  ...network,
  ...systemSettings,
  ...deviceControl,
  ...app,
  ...maintenance,
  ...status

}
