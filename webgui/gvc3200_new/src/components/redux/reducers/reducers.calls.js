import * as Actions from '../actions/actionType'

/**
 * 未接来电记录，包括id, name
 */
const missedcallsname = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_MISSEDCALLLOGNAME:
            return action.missedcallsname
        default:
            return state
    }
}