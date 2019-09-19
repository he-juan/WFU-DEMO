import * as Call from './api.call'
import * as CommonAPI from './api.common'
import * as AccountAPI from './api.account'
import * as CallFeatureAPI from './api.callfeature'
import * as NetWorkAPI from './api.network'
import * as StatusAPI from './api.status'
import * as SystemAPI from './api.system'
import * as DeviceCtrlAPI from './api.devicecontrol'
import * as MaintenacneAPI from './api.maintenance'
import * as AppAPI from './api.app'

export default {
  ...Call,
  ...CommonAPI,
  ...AccountAPI,
  ...CallFeatureAPI,
  ...NetWorkAPI,
  ...StatusAPI,
  ...SystemAPI,
  ...DeviceCtrlAPI,
  ...MaintenacneAPI,
  ...AppAPI
}
