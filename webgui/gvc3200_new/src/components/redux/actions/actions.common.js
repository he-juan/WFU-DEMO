import $ from 'jquery'
import * as actionUtil from './actionUtil'
import * as Store from '../../entry'



const promptForRequestFailed = () => (dispatch) => {
    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
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
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
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
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_7479'}});
            actionUtil.checkIsApplyNeed(dispatch);
            if (typeof callback === 'function') {
                callback();
            }
        }
    }).catch(function(error) {
        console.log(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/**
 * 检测是否有需要被应用的配置项
 */
export const checkIsApply = () => (dispatch) => {
    actionUtil.checkIsApplyNeed(dispatch);
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
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
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

/**************calls contact*******************/
export const cb_put_port_param = (action, flag, data,portredup,portclearold,cb_import_response) => (dispatch) => {

    let urihead = "action=" + action + "&flag=" + flag + "&portReplace=" + portredup + "&portClear=" + portclearold;
    urihead += data;
    urihead += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(urihead).then(function(data) {
        if (flag == 0) { //export
            let msgs = actionUtil.res_parse_rawtext(data);
            if( actionUtil.cb_if_is_fail(msgs) )
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
            else {
                checkIsApplyNeed();
            }
        } else if(flag == 1) {     //import
            let msgs = JSON.parse(data);
            if(msgs['res'] == 'success') {
                let urihead = "action=phbkresponse";
                urihead += "&time=" + new Date().getTime();
                actionUtil.handleGetRequest(urihead).then(function(data) {
                    cb_import_response(data);
                }).catch(function(error) {
                });
            }
        }
    }).catch(function(error) {
        // send error message notice
    });
}

export const cb_save_fav = (action,portmode,cb_get_portresponse_done) => (dispatch) => {
    let urihead = "action=" + action;
    urihead += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(urihead).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let response = msgs.headers["response"];
        if(response == "Sucess") {
            let urihead = "action=phbkresponse";
            urihead += "&time=" + new Date().getTime();
            actionUtil.handleGetRequest(urihead).then(function(data) {
                cb_get_portresponse_done(data,portmode);
            }).catch(function(error) {
                // send error message notice
            });
        }
    }).catch(function(error) {
        // send error message notice
    });

}

export const cb_get_portresponse = (mode,cb_get_portresponse_done) => (dispatch) => {
    let urihead = "action=phbkresponse";
    urihead += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(urihead).then(function(data) {
        cb_get_portresponse_done(data,mode);
    }).catch(function(error) {
        // send error message notice
    });
}

export const saveDownContactsParams = (items, values, flag, callback,argu) => (dispatch) => {
    let uritail = "",itemVal;
    for (let i = 0; i < items.length; i++) {
        itemVal = values[items[i].name]
        if(typeof itemVal == 'boolean') {
            itemVal = Number(itemVal)
        } else if (typeof itemVal == 'number' && isNaN(itemVal)) {
            itemVal = '0'
        }
        else if(typeof itemVal == 'number' && isNaN(itemVal)){
            itemVal = ""
        }
        uritail += actionUtil.build_put(i, items[i].pvalue, itemVal);
    }

    let request = "action=put&flag=0"+ uritail;
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(argu)
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_put_download_param = (action, flag, data, downserver, downConfig, cb_alert_response) => (dispatch) => {
    let [downmode,redup,clearold] = downConfig;

    let request = "action=" + action + "&downMode=" + downmode + "&flag=" + flag + "&downUrl=" + encodeURIComponent(downserver) + "&downReplace=" + redup + "&downClear=" + clearold;
    request += data;
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data) {

        let msgs = JSON.parse(data);
        if(msgs['res'] == 'success') {
            if(flag == 0) {
                if( actionUtil.cb_if_is_fail(msgs) ) {
                    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
                } else {
                    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_7479'}});
                    checkIsApplyNeed();
                }
            } else if(flag == 1) {
                dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_3325'}});
                var urihead = "action=phbkresponse";
                urihead += "&time=" + new Date().getTime();
                actionUtil.handleGetRequest(urihead).then(function(data) {
                    cb_get_response_done(data,1,cb_alert_response);
                }).catch(function(error) {
                    // send error message notice
                });
            }
        }
    }).catch(function(error) {
        // send error message notice
    });
}

export const getPresetInfo = (callback) => (dispatch) => {
    let request = 'action=getpresetinfo&region=control';
    actionUtil.handleGetRequest(request).then(function(res) {
        let msgs = JSON.parse(res);
        let data = msgs['Data'];
        dispatch({type: 'REQUEST_GET_PRESETINFO', presetinfo: data});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getContactCount = () => (dispatch) => {
    let request = 'action=getcontactcount';
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data)
        if (msgs['res'] == 'success') {
            dispatch({type: 'REQUEST_GET_CONTACTCOUNT',mContactNum: msgs['msg']});
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}
