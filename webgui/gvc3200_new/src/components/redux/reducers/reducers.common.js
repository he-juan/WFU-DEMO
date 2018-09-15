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

/**
 * 监控 敲击回车键 触发表单提交
 */
export const enterSave = (state={}, action) => {
    switch (action.type) {
        case Actions.ENTER_SAVING:
            return action.enterSave
        default:
            return state
    }
}

/**
 * 返回表单初始数据
 */
export const itemValues = (state={}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_ITEM_VALUE:
            return action.itemValues
        default:
            return state
    }
}

/**
 * 临时模拟用一下，后续等通话功能完善后再改
 * 是否在拨打状态
 * state 为 0 则 未拨打， 为 1 则 正在拨打
 */
export const isCalling = (state = 0, action) => {
    return state
}