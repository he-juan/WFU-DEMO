import * as Actions from '../actions/actionType'

// 账号状态
export const acctStatus = (state={}, action) => {
  switch (action.type) {
      case Actions.REQUEST_GET_ACCT_STATUS:
          return action.acctStatus
      default:
          return state
  }
}