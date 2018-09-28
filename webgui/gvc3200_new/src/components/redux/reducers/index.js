import { combineReducers } from 'redux'

import * as common from './reducers.common'
import * as account from './reducers.account'
import * as calls from './reducers.calls'
import * as callset from './reducers.callset'
import * as phoneSetting from './reducers.phoneSettings'
import * as networkSetting from './reducers.networkSettings'
import * as systemSettings from './reducers.systemSettings'
import * as deviceControl from './reducers.deviceControl'
import * as applications from './reducers.applications'
import * as maintenance from './reducers.maintenance'
import * as status from './reducers.status'



import * as Actions from '../actions/actionType'

// const curLocale = (state = {}, action) => {
//     switch (action.type) {
//         case Actions.LOCALE_CHANGE:
//             return action.curLocale
//         default:
//             return state
//     }
// }

// const pageStatus = (state = {}, action) => {
//     switch (action.type) {
//         case Actions.PAGE_STATUS:
//             return action.pageStatus
//         default:
//             return state
//     }
// }

const hashChange = (state = {}, action) => {
    switch (action.type) {
        case Actions.HASH_CHANGE:
            return action.hashChange
        default:
            return state
    }
}

const curMenu = (state = {}, action) => {
    switch (action.type) {
        case Actions.CUR_MENU_CHANGE:
            return action.curMenu
        default:
            return state
    }
}

const curTabKey = (state = {}, action) => {
    switch (action.type) {
        case Actions.TAB_KEY_CHANGE:
            return action.curTabKey
        default:
            return state
    }
}

const TabactiveKey = (state = 0, action) => {
    switch (action.type) {
        case Actions.TAB_ACTIVE_KEY_CHANGE:
            return action.TabactiveKey
        default:
            return state
    }
}

const passtipStyle = (state = {}, action) => {
    switch (action.type) {
        case Actions.CHANGE_PWD_STYLE:
            return action.passtipStyle
        default:
            return state
    }
}

const changetabKeys = (state = {}, action) => {
    switch (action.type) {
        case Actions.CHANGE_TAB_KEYS:
            return action.changetabKeys
        default:
            return state
    }
}

const userType = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_USER_TYPE:
            return action.userType
        default:
            return state
    }
}

const menuList = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_MENU:
            return action.menuList
        default:
            return state
    }
}

const vendor = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_VENDOR:
            return action.vendor
        default:
            return state
    }
}

const product = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_PRODUCT:
            return action.product
        default:
            return state
    }
}

const productStr = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_PRODUCTSTR:
            return action.productStr
        default:
            return state
    }
}

const fxoexistState = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_FXOEXIT:
            return action.fxoexistState
        default:
            return state
    }
}

const oemId = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_COLOREXIT:
            return action.oemId
        default:
            return state
    }
}

const notifyMsg = (state = {}, action) => {
    switch (action.type) {
        case Actions.MSG_PROMPT:
            return action.notifyMsg
        default:
            return state
    }
}

const spinMsg = (state = {}, action) => {
    switch (action.type) {
        case Actions.MSG_PROMPT_SPIN:
            return action.spinMsg
        default:
            return state
    }
}

const progressMsg = (state = {}, action) => {
    switch (action.type) {
        case Actions.MSG_PROGRESS:
            return action.progressMsg
        default:
            return state
    }
}

const uploadStatus = (state = {}, action) => {
    switch (action.type) {
        case Actions.UPLOAD_STATUS:
            return action.uploadStatus
        default:
            return state
    }
}

const maxAcctNum = (state = {}, action) => {
    switch (action.type) {
        case Actions.SET_MAX_ACCT_NUM:
            return action.maxAcctNum
        default:
            return state
    }
}

/*
  minimize : 最小化
 */
const callDialogStatus = (state = {}, action) => {
    switch (action.type) {
        case Actions.SHOW_CALL_DIALOG:
            return action.callDialogStatus
        default:
            return state
    }
}

const lineInfo = (state = {}, action) => {
    switch (action.type) {
        case Actions.DIAL_LINE_INFO:
            return action.lineInfo
        default:
            return state
    }
}

const muteStatus = (state = {}, action) => {
    switch (action.type) {
        case Actions.MUTE_STATUS:
            return action.muteStatus
        default:
            return state
    }
}

const recordStatus = (state = {}, action) => {
    switch (action.type) {
        case Actions.RECORD_STATUS:
            return action.recordStatus
        default:
            return state
    }
}

const applyButtonStatus = (state={}, action) => {
    switch (action.type) {
        case Actions.UPDATE_APPLY_BUTTON:
            return action.applyButtonStatus
        default:
            return state
    }
}

const mainHeight = (state={}, action) => {
    switch (action.type) {
        case Actions.HEIGHT_CHANGE:
            return action.mainHeight
        default:
            return state
    }
}

// const enterSave = (state={}, action) => {
//     switch (action.type) {
//         case Actions.ENTER_SAVING:
//             return action.enterSave
//         default:
//             return state
//     }
// }

const curAccount = (state = '0', action) => {
    switch (action.type) {
        case Actions.ACCOUNT_CHANGE:
            return action.curAccount
        default:
            return state
    }
}

// const itemValues = (state={}, action) => {
//     switch (action.type) {
//         case Actions.REQUEST_GET_ITEM_VALUE:
//             return action.itemValues
//         default:
//             return state
//     }
// }

const ipvtExist = (state={}, action) => {
    switch (action.type) {
        case Actions.GET_IPVT_EXIST:
            return action.ipvtExist
        default:
            return state
    }
}


const acctStatus = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_ACCT_STATUS:
            return action.acctStatus
        default:
            return state
    }
}

const networkStatus = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_NETWORK_STATUS:
            return action.networkStatus
        default:
            return state
    }
}

const systemUptime = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_SYSTEM_UPTIME:
            return action.systemUptime
        default:
            return state
    }
}

const systemProduct = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_SYSTEM_PRODUCT:
            return action.systemProduct
        default:
            return state
    }
}

const systemPn = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_SYSTEM_PN:
            return action.systemPn
        default:
            return state
    }
}

const storageInfo = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_STORAGE_INFO:
            return action.storageInfo
        default:
            return state
    }
}

const eventItems = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_EVENT_ITEMS:
            return action.eventItems
        default:
            return state
    }
}

const readshowipState = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_READSHOWIP_STATE:
            return action.readshowipState
        default:
            return state
    }
}

const timezoneValues = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_TIMEZONE_VALUES:
            return action.timezoneValues
        default:
            return state
    }
}

const languagesValues = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_LANGUAGES_VALUES:
            return action.languagesValues
        default:
            return state
    }
}

const logcatFile = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_LOGCAT_FILE:
            return action.logcatFile
        default:
            return state
    }
}

const tracelist = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_TRACE_LIST:
            return action.tracelist
        default:
            return state
    }
}

const coredumplist = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_COREDUMP_LIST:
            return action.coredumplist
        default:
            return state
    }
}

const recordlist = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_RECORD_LIST:
            return action.recordlist
        default:
            return state
    }
}

const screenList = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_SCREEN_LIST:
            return action.screenList
        default:
            return state
    }
}

const norrecordinglist = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_NORRECORDINGLIST:
            return action.norrecordinglist
        case Actions.CHANGE_NORRECORDINGLIST:
            return action.norrecordinglist
            break;
        default:
            return state
    }
}

const recordinglist = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_RECORDINGLIST:
            return action.recordinglist
        case Actions.CHANGE_RECORDINGLIST:
            return action.recordinglist
        default:
            return state
    }
}

const blf = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_BLF:
            return action.blf
        default:
            return state
    }
}

const logItemdata = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_CALLLOG:
            return action.logItemdata
        default:
            return state
    }
}

const Use24Hour = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_USE24HOUR:
            return action.Use24Hour
        default:
            return state
    }
}

const interceptItemdata = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_INTERCEPTLOG:
            return action.interceptItemdata
        default:
            return state
    }
}

const blacklistItemdata = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_BLACKLIST:
            return action.blacklistItemdata
        default:
            return state
    }
}

const whitelistItemdata = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_WHITELIST:
            return action.whitelistItemdata
        default:
            return state
    }
}

const mpkExist = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_MPK_EXIST:
            return action.mpkExist
        default:
            return state
    }
}

const certInfo = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_VERI_CERT:
            return action.certInfo
        default:
            return state
    }
}

const wifiResult = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_WIFI_RESULT:
            return action.wifiResult
        default:
            return state
    }
}

const maxVolume = (state=8, action) => {
    switch (action.type) {
        case Actions.GET_MAX_VOLUME:
            return action.maxVolume
        default:
            return state
    }
}

const lightBrightness = (state={}, action) => {
    switch (action.type) {
        case Actions.GET_LIGHT_BRIGHTNESS:
            return action.lightBrightness
        default:
            return state
    }
}

const curVolume = (state=4, action) => {
    switch (action.type) {
        case Actions.GET_CUR_VOLUME:
            return action.curVolume
        default:
            return state
    }
}

const mContactNum = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_CONTACTCOUNT:
            return action.mContactNum
        default:
            return state
    }
}

const contactsInformation = (state={}, action) => {
    switch (action.type) {
        case Actions.GET_CONTACTS_INFORMATION:
            return action.contactsInformation
        default:
            return state
    }
}

const msgsContacts = (state={}, action) => {
    switch (action.type) {
        case Actions.GET_CONTACTS_MSGS:
            return action.msgsContacts
        default:
            return state
    }
}

const contactsAcct = (state={}, action) => {
    switch (action.type) {
        case Actions.GET_CONTACTS_ACCT:
            return action.contactsAcct
        default:
            return state
    }
}

const groupInformation = (state={}, action) => {
    switch (action.type) {
        case Actions.GET_GROUP_INFORMATION:
            return action.groupInformation
        default:
            return state
    }
}

const contactinfodata = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_CONTACTINFO:
            return action.contactinfodata
        default:
            return state
    }
}

const confmemberinfodata = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_CONFMEMBERINFO:
            return action.confmemberinfodata
        default:
            return state
    }
}

const callnameinfo = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_CALLNAME:
            return action.callnameinfo
        default:
            return state
    }
}

const preconfdata = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_PRECONFINFO:
            return action.preconfdata
        default:
            return state
    }
}

const presetinfo = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_PRESETINFO:
            return action.presetinfo
        default:
            return state
    }
}

const confinfodata = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_CONFINFO:
            return action.confinfodata
        default:
            return state
    }
}

const bluetooth = (state={}, action) => {
    switch (action.type) {
        case Actions.GET_BLUETOOTH_STATUS:
            return action.bluetooth
        default:
            return state
    }
}

const discoverable = (state={}, action) => {
    switch (action.type) {
        case Actions.GET_DISCOVERABLE_STATUS:
            return action.discoverable
        default:
            return state
    }
}


const speakerteststatus = (state=-1,action) => {
    switch (action.type) {
        case Actions.SPEAKER_TEST_STATUS:
            return action.speakerteststatus
        default:
            return state
    }
}

const resetkeyteststatus = (state=-1,action) => {
    switch (action.type) {
        case Actions.RESETKEY_TEST_STATUS:
            return action.resetkeyteststatus
        default:
            return state
    }
}

const dndstatus = (state = "0", action) =>{
    switch (action.type) {
        case Actions.DND_MODE_STATUS:
            return action.dndstatus
        default:
            return state
    }
}



const rootReducer = combineReducers({
    // curLocale,
    userType,
    menuList,
    vendor,
    product,
    productStr,
    fxoexistState,
    oemId,
    notifyMsg,
    spinMsg,
    progressMsg,
    uploadStatus,
    maxAcctNum,
    callDialogStatus,
    lineInfo,
    muteStatus,
    recordStatus,
    // heldStatus,
    applyButtonStatus,
    mainHeight,
    // enterSave,
    curAccount,
    // itemValues,
    acctStatus,
    networkStatus,
    systemUptime,
    systemProduct,
    systemPn,
    storageInfo,
    eventItems,
    // pageStatus,
    hashChange,
    curMenu,
    curTabKey,
    TabactiveKey,
    passtipStyle,
    changetabKeys,
    readshowipState,
    timezoneValues,
    languagesValues,
    logcatFile,
    tracelist,
    coredumplist,
    recordlist,
    screenList,
    norrecordinglist,
    recordinglist,
    blf,
    logItemdata,
    Use24Hour,
    interceptItemdata,
    blacklistItemdata,
    whitelistItemdata,
    mpkExist,
    ipvtExist,
    certInfo,
    wifiResult,
    maxVolume,
    lightBrightness,
    curVolume,
    mContactNum,
    contactsInformation,
    msgsContacts,
    contactsAcct,
    groupInformation,
    contactinfodata,
    confmemberinfodata,
    callnameinfo,
    preconfdata,
    confinfodata,
    presetinfo,
    bluetooth,
    discoverable,
    speakerteststatus,
    resetkeyteststatus,
    dndstatus,


// 拆分后处理
    ...common,
    ...account,
    ...applications,
    ...calls,
    ...callset,
    ...phoneSetting,
    ...networkSetting,
    ...systemSettings,
    ...deviceControl,
    ...maintenance,
    ...status
})

export default rootReducer
