import $ from 'jquery'
import * as actionUtil from './actionUtil'
import * as Store from '../../entry'



const promptForRequestFailed = () => (dispatch) => {
    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
}

/**
 * 设置语音
 */
export const setCurLocale = (cur_locale) => (dispatch) => {
    dispatch({type: 'LOCALE_CHANGE', curLocale: cur_locale})
}



/**
 * 获取表单数据，初始化
 */
export const getItemValues = (items, callback) => (dispatch) => {
    let uritail = "";
    for (var i = 0; i < items.length; i++) {
        uritail += actionUtil.build_get(i, items[i].pvalue);
    }
    let request = "action=get" + uritail;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let values = actionUtil.pvalueToConfName(msgs, items);
        dispatch({type: 'REQUEST_GET_ITEM_VALUE', itemValues: values});
        if (typeof callback === 'function') {
            callback(values);
        }
    }).catch(function(error) {
        console.log(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
    });
}

/**
 * 表单数据提交
 */
export const setItemValues = (items, values, flag, callback) => (dispatch) => {
    let uritail = "",itemVal;
    for (let i = 0; i < items.length; i++) {
        itemVal = values[items[i].name]
        if(typeof itemVal == 'boolean') {
            itemVal = Number(itemVal)
        } else if (typeof itemVal == 'number' && isNaN(itemVal)) {
            itemVal = '0'
        } else if (itemVal == undefined){
            itemVal = ""
        }
        uritail += actionUtil.build_put(i, items[i].pvalue, itemVal);
    }
    flag = (flag == 0 || flag == 1) ? flag : 0;
    let request = "action=put&flag=" + flag + uritail;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_savesuc'}});
            checkIsApplyNeed(dispatch);
            if (typeof callback === 'function') {
                callback();
            }
        }
    }).catch(function(error) {
        console.log(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
    });
}

/**
 * 检测是否有需要被应用的配置项
 */
export const checkIsApply = () => (dispatch) => {
    checkIsApplyNeed(dispatch);
}

/**
 * 检测是否有需要被应用的配置项
 */
const checkIsApplyNeed = (dispatch) => {
    let request = "action=needapply";

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let needApply = msgs.headers['needapply'];

        var str;
        if (needApply == "1") {
            str = new Date().getTime();
        } else {
            str = "1";
        }
        dispatch({type: 'UPDATE_APPLY_BUTTON', applyButtonStatus: str});
    }).catch(function(error) {
        console.log(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
    });
}

export const cb_ping = (callback) => (dispatch) => {
    let request = "action=ping" + "";
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            // send notice action
        } else {
            if (msgs.headers['response'].toLowerCase() == "error" &&
                msgs.headers['message'].toLowerCase() == "authentication required") {
                dispatch({type: 'PAGE_STATUS', pageStatus: 0})
                throw "exit";
            } else {
                callback();
            }
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}