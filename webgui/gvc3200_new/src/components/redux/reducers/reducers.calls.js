import * as Actions from '../actions/actionType'

/**
 * 未接来电记录，包括id, name
 */
export const missedcallsname = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_MISSEDCALLLOGNAME:
            return action.missedcallsname
        default:
            return state
    }
}

/**
 */
export const maxlinecount = (state = {}, action) =>{
    switch (action.type) {
        case Actions.REQUEST_GET_MAXLINECOUNT:
            return action.maxlinecount
        default:
            return state
    }
}

export const busylinenum = (state = 0, action) =>{
    switch (action.type) {
        case Actions.BUSYLINE_STATUS:
            return action.busylinenum
        default:
            return state
    }
}

export const linesInfo = (state = [], action) => {
    switch (action.type) {
        case Actions.DIAL_LINE_INFO1:
            return action.linesInfo
        default:
            return state
    }
}


export const incomingcalls = (state = {style:"display-hidden",incomingcallsinfo:[]}, action) => {
    switch (action.type) {
        case Actions.INCOMMING_LINE_INFO:
            return action.incomingcalls
        default:
            return state
    }
}

/**
 * 是否处于保持状态
 */
export const heldStatus = (state = {}, action) => {
    switch (action.type) {
        case Actions.HELD_STATUS:
            return action.heldStatus
        default:
            return state
    }
}

export const FECCStatus = (state = {}, action) => {
    switch (action.type) {
        case Actions.FECC_STATUS:
            return action.FECCStatus
        default:
            return state
    }
}

export const ipvrole = (state = "-1", action) => {
    switch (action.type) {
        case Actions.IPVT_ROLE_STATUS:
            return action.ipvrole
        default:
            return state
    }
}

export const localcamerablocked = (state = "0", action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_CAMERABLOCKEDSTATUS:
            return action.localcamerablocked
        default:
            return state
    }
}

export const videoinvitelines = (state = "", action) =>{
    switch (action.type) {
        case Actions.VIDEO_INVITE_INFO:
            return action.videoinvitelines
        default:
            return state
    }
}

export const presentation = (state = false, action) => {
    switch (action.type){
        case Actions.SET_PRESENT:
            return action.isPresent;
        default:
            return state
    }
}

export const presentSource = (state = 'hdmi', action) => {
    switch (action.type) {
        case Actions.SET_PRESENT_SOURCE:
            return action.presentSource;
        default:
            return state;
    }
}

export const presentLineMsg = (state = {line:'', msg: ''}, action) => {
    switch (action.type) {
        case Actions.SET_PRESENT_LINE_MSG:
            return {
                line: action.line,
                msg: action.msg
            }
        default:
            return state
    }
}

export const videoonlines = (state = "", action) =>{
    switch (action.type) {
        case Actions.VIDEO_ON_LINES:
            return action.videoonlines
        default:
            return state
    }
}

export const detailinfo = (state = {}, action) =>{
    switch (action.type) {
        case Actions.LINE_DETAIL_INFO:
            return action.detailinfo
        default:
            return state
    }
}

export const handsupStatus = (state = "0", action) =>{
    switch (action.type) {
        case Actions.IPVT_HANDSUP_STATUS:
            return action.handsupStatus
        default:
            return state
    }
}

export const ipvtcmrinviteinfo = (state = null, action) => {
    switch (action.type) {
        case Actions.IPVT_CAMERA_INVITE:
            return action.ipvtcmrinviteinfo
        default:
            return state
    }
}

export const isvideo = (state = "1", action) => {
    switch (action.type) {
        case Actions.SET_IS_VIDEO:
            return action.isvideo;
        default:
            return state
    }
}

export const hdmiStatus = (state = {'hdmi1': '0','hdmi2': '0','hdmiIn': '0'}, action) => {
    switch(action.type) {
        case Actions.SET_HDMI_STATUS:
            return Object.assign({}, state, action.payload)
        default:
            return state;
    }
}

export const ipvtrcdallowstatus = (state = false, action) => {
    switch (action.type){
        case Actions.SET_IPVTRCD_ALLOWSTATUS:
            return action.ipvtrcdallowstatus;
        default:
            return state
    }
}

export const recordStatus = (state = "0", action) => {
    switch (action.type) {
        case Actions.RECORD_STATUS:
            return action.recordStatus
        default:
            return state
    }
}

export const ipvtRecordStatus = (state = "0", action) => {
    switch (action.type) {
        case Actions.IPVT_RECORD_STATUS:
            return action.ipvtRecordStatus
        default:
            return state
    }
}


// sfu
export const msfurole = (state = "-1", action) => {
    switch(action.type) {
        case Actions.SET_MSFUROLE:
            return action.role
        default:
            return state
    }
}