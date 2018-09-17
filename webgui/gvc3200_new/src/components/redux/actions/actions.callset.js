
import $ from 'jquery'
import * as actionUtil from './actionUtil'
import * as Store from '../../entry'



/**
 * 会场名称 表单初始化
 */
export const cb_sqlite_sitename = (callback) => (dispatch) => {
    let request = "action=sqlitedisplay&region=advanset&type=sitesetting&affect=read";

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")")
        callback(tObj.Data);
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}





/**
 * 会场名称 表单提交
 */
export const setSitenameInfo = (paramurl, type) => (dispatch) => {
    let request = "";
    if(type == 1)
        request = "action=setSitesettingInfo&region=advanset&" + paramurl;
    else
        request = "action=setSitesettingOffset&region=advanset&" + paramurl;

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")")
        if (tObj.res != "success") {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_savesuc'}});
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}