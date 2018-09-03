import * as Actions from '../actions/actionType'

/**
 * 设置语言
 */
export const curLocale = (state = {}, action) => {
    switch (action.type) {
        case Actions.LOCALE_CHANGE:
            return action.curLocale
        default:
            return state
    }
}

/**
 * 页面状态: pageStatus
 * 0: 登录页
 * 1: 登录成功后
 * 2: 重启
 */
export const pageStatus = (state = {}, action) => {
    switch (action.type) {
        case Actions.PAGE_STATUS:
            return action.pageStatus
        default:
            return state
    }
}