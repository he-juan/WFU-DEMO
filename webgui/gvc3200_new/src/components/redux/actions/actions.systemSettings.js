import * as actionUtil from './actionUtil'
import * as Store from '../../entry'

/**
 * 获取时区
 */
export const getTimezone = (callback) => (dispatch) => {
    let request = 'action=gettimezone&region=advanset';
    actionUtil.handleGetRequest(request).then(function(data) {
        dispatch({type: 'REQUEST_GET_TIMEZONE_VALUES', timezoneValues: data});
        callback(data);
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
    });
}

/**
 * 时间设置表单提交
 */
export const saveTimeset = (value) => (dispatch) => {
    let request = "action=savetimeset&timezone=" + value;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            // send notice action
        } else {
            // send notice action
            //dispatch({type: 'NOTICE_CHANGE', changeNotice: ["Save Successfully!", {color: '#fff', background: '#51c57d'}]});
            actionUtil.checkIsApplyNeed();
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
    });
}


/**
 * 获取时间日期用于初始化
 */
export const getDateInfo = (callback) => (dispatch) => {
    let request = "action=getdateinfo&region=maintenance";
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data)
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
    });
}

export const setDateInfo = (values) => (dispatch) => {
    let datestr = encodeURIComponent(values.date);
    let timestr = encodeURIComponent(values.time);
    let request = `action=setdateinfo&region=maintenance&datestr=${datestr}&timestr=${timestr}`;
    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
    });

}

/**
 * 获取语言
 */
export const getLanguagesValues = (callback) => (dispatch) => {
    let request = 'action=getlanguages&region=advanset';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        dispatch({type: 'REQUEST_GET_LANGUAGES_VALUES', languagesValues: msgs});
        callback(msgs);
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
    });
}

/**
 * 设置语言
 */
export const putLanguage = (value) => (dispatch) => {
    var lancts = value.split("_");
    let request = "action=putlanguage&region=advanset&lan=" + lancts[0] + "&country=" + lancts[1];
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            // send notice action
        } else {
            // send notice action
            //dispatch({type: 'NOTICE_CHANGE', changeNotice: ["Save Successfully!", {color: '#fff', background: '#51c57d'}]});
            checkIsApplyNeed();
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}