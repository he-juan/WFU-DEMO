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