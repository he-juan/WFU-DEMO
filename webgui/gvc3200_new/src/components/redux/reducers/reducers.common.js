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

/**
 * 按钮应用状态
 */
export const applyButtonStatus = (state={}, action) => {
    switch (action.type) {
        case Actions.UPDATE_APPLY_BUTTON:
            return action.applyButtonStatus
        default:
            return state
    }
}

/**
 * 主内容高度
 */
export const mainHeight = (state={}, action) => {
    switch (action.type) {
        case Actions.HEIGHT_CHANGE:
            return action.mainHeight
        default:
            return state
    }
}

/**
 * 当前菜单 ?
 */
export const curMenu = (state = {}, action) => {
    switch (action.type) {
        case Actions.CUR_MENU_CHANGE:
            return action.curMenu
        default:
            return state
    }
}

/**
 * tab key
 */

export const TabactiveKey = (state = 0, action) => {
    switch (action.type) {
        case Actions.TAB_ACTIVE_KEY_CHANGE:
            return action.TabactiveKey
        default:
            return state
    }
}

/**
 * oemId
 */
export const oemId = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_COLOREXIT:
            return action.oemId
        default:
            return state
    }
}

/**
 * 
 */
export const passtipStyle = (state = {}, action) => {
    switch (action.type) {
        case Actions.CHANGE_PWD_STYLE:
            return action.passtipStyle
        default:
            return state
    }
}

/**
 * 用户类型 admin 还是user
 */
export const userType = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_USER_TYPE:
            return action.userType
        default:
            return state
    }
}

/**
 * 左侧列表
 */
export const menuList = (state = {}, action) => {
    switch (action.type) {
        case Actions.REQUEST_GET_MENU:
            return action.menuList
        default:
            return state
    }
}


/**
 * 默认账号
 */

export const defaultAcct = (state = '0', action) => {
    switch (action.type) {
        case Actions.SET_DEFAULT_ACCT:
            return action.defaultAcct
        default:
            return state
    }
}