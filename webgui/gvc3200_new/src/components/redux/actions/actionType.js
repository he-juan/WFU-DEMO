/****** actions *****/
export const LOCALE_CHANGE = 'LOCALE_CHANGE'
export const MSG_PROMPT = 'MSG_PROMPT'
export const MSG_PROMPT_SPIN = 'MSG_PROMPT_SPIN'
export const ACCOUNT_CHANGE = 'ACCOUNT_CHANGE'
export const MSG_PROGRESS = 'MSG_PROGRESS'
export const PAGE_STATUS = 'PAGE_STATUS'
export const TAB_ACTIVE_KEY_CHANGE = 'TAB_ACTIVE_KEY_CHANGE'
export const CHANGE_PWD_STYLE = 'CHANGE_PWD_STYLE'
export const CHANGE_TAB_KEYS = 'CHANGE_TAB_KEYS'
export const UPDATE_APPLY_BUTTON = 'UPDATE_APPLY_BUTTON'
export const HASH_CHANGE = 'HASH_CHANGE'
export const CUR_MENU_CHANGE = 'CUR_MENU_CHANGE'
export const TAB_KEY_CHANGE = 'TAB_KEY_CHANGE'
export const HEIGHT_CHANGE = 'HEIGHT_CHANGE'
export const ENTER_SAVING = 'ENTER_SAVING'
export const UPLOAD_STATUS = 'UPLOAD_STATUS'
export const SET_MAX_ACCT_NUM = 'SET_MAX_ACCT_NUM'
export const SHOW_CALL_DIALOG = 'SHOW_CALL_DIALOG'
export const DIAL_LINE_INFO = 'DIAL_LINE_INFO'
export const DIAL_LINE_INFO1 = 'DIAL_LINE_INFO1'
export const INCOMMING_LINE_INFO = 'INCOMMING_LINE_INFO'
export const MUTE_STATUS = 'MUTE_STATUS'
export const RECORD_STATUS = 'RECORD_STATUS'
export const HELD_STATUS = 'HELD_STATUS'
export const SPEAKER_TEST_STATUS = 'SPEAKER_TEST_STATUS'
export const RESETKEY_TEST_STATUS = 'RESETKEY_TEST_STATUS'
export const BUSYLINE_STATUS = 'BUSYLINE_STATUS'
export const FECC_STATUS = 'FECC_STATUS'
export const SET_CALLFEATURE_INFO = 'SET_CALLFEATURE_INFO'
export const DND_MODE_STATUS = 'DND_MODE_STATUS'
export const VIDEO_INVITE_INFO = 'VIDEO_INVITE_INFO'
export const VIDEO_ON_LINES = 'VIDEO_ON_LINES'
export const LINE_DETAIL_INFO = 'LINE_DETAIL_INFO'

/****** requests ******/

// global
export const REQUEST_USER_TYPE = 'REQUEST_USER_TYPE'
export const REQUEST_GET_MENU = 'REQUEST_GET_MENU'
export const REQUEST_GET_VENDOR = 'REQUEST_GET_VENDOR'
export const REQUEST_GET_ITEM_VALUE = 'REQUEST_GET_ITEM_VALUE'
export const REQUEST_GET_PRODUCT = 'REQUEST_GET_PRODUCT'
export const REQUEST_GET_PRODUCTSTR = 'REQUEST_GET_PRODUCTSTR'
export const REQUEST_GET_FXOEXIT = 'REQUEST_GET_FXOEXIT'
export const REQUEST_GET_COLOREXIT = 'REQUEST_GET_COLOREXIT'

// status
export const REQUEST_GET_ACCT_STATUS = 'REQUEST_GET_ACCT_STATUS'
export const REQUEST_GET_NETWORK_STATUS = 'REQUEST_GET_NETWORK_STATUS'
export const REQUEST_GET_SYSTEM_UPTIME = 'REQUEST_GET_SYSTEM_UPTIME'
export const REQUEST_GET_SYSTEM_PRODUCT = 'REQUEST_GET_SYSTEM_PRODUCT'
export const REQUEST_GET_SYSTEM_PN = 'REQUEST_GET_SYSTEM_PN'
export const REQUEST_GET_STORAGE_INFO = 'REQUEST_GET_STORAGE_INFO'

// account
export const GET_IPVT_EXIST = 'GET_IPVT_EXIST'
export const SET_DEFAULT_ACCT = 'SET_DEFAULT_ACCT'

// sysset
export const REQUEST_GET_READSHOWIP_STATE = 'REQUEST_GET_READSHOWIP_STATE'
export const REQUEST_GET_TIMEZONE_VALUES = 'REQUEST_GET_TIMEZONE_VALUES'
export const REQUEST_GET_LANGUAGES_VALUES = 'REQUEST_GET_LANGUAGES_VALUES'
export const REQUEST_GET_VERI_CERT = 'REQUEST_GET_VERI_CERT'
export const REQUEST_GET_WIFI_RESULT = 'REQUEST_GET_WIFI_RESULT'
export const GET_MAX_VOLUME = 'GET_MAX_VOLUME'
export const GET_CUR_VOLUME = 'GET_CUR_VOLUME'
export const GET_LIGHT_BRIGHTNESS = 'GET_LIGHT_BRIGHTNESS'
export const GET_BLUETOOTH_STATUS = 'GET_BLUETOOTH_STATUS'
export const GET_DISCOVERABLE_STATUS = 'GET_DISCOVERABLE_STATUS'

// maintenance
export const REQUEST_GET_EVENT_ITEMS = 'REQUEST_GET_EVENT_ITEMS'
export const REQUEST_GET_LOGCAT_FILE = 'REQUEST_GET_LOGCAT_FILE'
export const REQUEST_GET_TRACE_LIST = 'REQUEST_GET_TRACE_LIST'
export const REQUEST_GET_COREDUMP_LIST = 'REQUEST_GET_COREDUMP_LIST'
export const REQUEST_GET_RECORD_LIST = 'REQUEST_GET_RECORD_LIST'
export const REQUEST_GET_SCREEN_LIST = 'REQUEST_GET_SCREEN_LIST'

// sysapp
export const REQUEST_GET_BLF = 'REQUEST_GET_BLF'
export const REQUEST_GET_NORRECORDINGLIST = 'REQUEST_GET_NORRECORDINGLIST'
export const REQUEST_GET_RECORDINGLIST = 'REQUEST_GET_RECORDINGLIST'
export const CHANGE_RECORDINGLIST = 'CHANGE_RECORDINGLIST'
export const CHANGE_NORRECORDINGLIST = 'CHANGE_NORRECORDINGLIST'
export const REQUEST_GET_CONTACTCOUNT = 'REQUEST_GET_CONTACTCOUNT'
export const REQUEST_GET_CALLLOG = 'REQUEST_GET_CALLLOG'
export const REQUEST_GET_USE24HOUR = 'REQUEST_GET_USE24HOUR'
export const REQUEST_GET_INTERCEPTLOG = 'REQUEST_GET_INTERCEPTLOG'
export const REQUEST_GET_BLACKLIST = 'REQUEST_GET_BLACKLIST'
export const REQUEST_GET_WHITELIST = 'REQUEST_GET_WHITELIST'
export const GET_CONTACTS_INFORMATION = 'GET_CONTACTS_INFORMATION'
export const GET_CONTACTS_MSGS = 'GET_CONTACTS_MSGS'
export const GET_CONTACTS_ACCT = 'GET_CONTACTS_ACCT'
export const GET_GROUP_INFORMATION = 'GET_GROUP_INFORMATION'
export const REQUEST_GET_CONTACTINFO = 'REQUEST_GET_CONTACTINFO'
export const REQUEST_GET_CONFMEMBERINFO = 'REQUEST_GET_CONFMEMBERINFO'
export const REQUEST_GET_CALLNAME = 'REQUEST_GET_CALLNAME'
export const REQUEST_GET_PRECONFINFO = 'REQUEST_GET_PRECONFINFO'
export const REQUEST_GET_CONFINFO = 'REQUEST_GET_CONFINFO'
export const REQUEST_GET_PRESETINFO = 'REQUEST_GET_PRESETINFO'
export const REQUEST_GET_MISSEDCALLLOGNAME = 'REQUEST_GET_MISSEDCALLLOGNAME'
export const REQUEST_GET_VIDEORECORDINGLIST = 'REQUEST_GET_VIDEORECORDINGLIST'


//calls
export const REQUEST_GET_MAXLINECOUNT = 'REQUEST_GET_MAXLINECOUNT'
export const IPVT_ROLE_STATUS = 'IPVT_ROLE_STATUS'
export const REQUEST_GET_CAMERABLOCKEDSTATUS = 'REQUEST_GET_CAMERABLOCKEDSTATUS'
export const SET_PRESENT = 'SET_PRESENT'
export const SET_PRESENT_SOURCE = 'SET_PRESENT_SOURCE'
export const SET_PRESENT_LINE_MSG = 'SET_PRESENT_LINE_MSG'
export const SET_IS_VIDEO = 'SET_IS_VIDEO'
export const SET_HDMI_STATUS = 'SET_HDMI_STATUS'
export const SET_IPVTRCD_ALLOWSTATUS = 'SET_IPVTRCD_ALLOWSTATUS'
export const IPVT_RECORD_STATUS = 'IPVT_RECORD_STATUS'
export const IPVT_HANDSUP_STATUS = 'IPVT_HANDSUP_STATUS'
export const IPVT_CAMERA_INVITE = 'IPVT_CAMERA_INVITE'
export const SET_CONTACTS = 'SET_CONTACTS'
export const SET_CALLLOGS = 'SET_CALLLOGS'
export const SET_GLOBAL_CONF_INFO = 'SET_GLOBAL_CONF_INFO'
// SFU
export const SET_MSFUROLE = 'SET_MSFUROLE'
export const SET_SFU_MEETINGINFO = 'SET_SFU_MEETINGINFO'


// extension


