import * as Actions from '../actions/actionType'

export const callFeatureInfo = (state = {}, action) => {
    switch (action.type) {
        case Actions.SET_CALLFEATURE_INFO:
            return action.callFeatureInfo
        default:
            return state
    }
}