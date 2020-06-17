/* common */
import common from './en.common'
/* call */
import call from './en.call'
/* account */
import account from './en.account'
/* call freature */
import callFeature from './en.callFeature'
/* network */
import network from './en.network'
/* systemSettings */
import systemSettings from './en.systemSettings'
/* deviceControl */
import deviceControl from './en.deviceControl'
/* app */
import app from './en.app'
/* maintenance */
import maintenance from './en.maintenance'
/* status */
import status from './en.status'

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
