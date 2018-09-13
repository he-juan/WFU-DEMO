//import $ from 'jquery'
import Enhance from '../../mixins/Enhance'
import {Component} from 'react'
import * as Store from '../../entry'

export let mInttimeout;
export let globalObj = {isCallStatus: false};

export const cb_getConnectState = (mPingtimeout) => {
    let action = "action=getconnectstate&time="+ new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:action,
        dataType:'text',
        success:function(data) {
            let msgs = res_parse_rawtext(data);
            clearInterval(mInttimeout);
            let timeout = msgs.headers['timeout']
            if( timeout != undefined || msgs.headers['message'] == 'Authentication Required') {
                if(timeout == undefined) {
                    timeout = 0
                }
                mPingtimeout = timeout * 1000;
                if(mPingtimeout == 0) {
                    Store.store.dispatch({type: 'PAGE_STATUS', pageStatus: 0})
                    throw 'exit';
                }
            } else {
                mPingtimeout = 7*60*1000;
            }
            mInttimeout = setInterval(() => {cb_getConnectState(mPingtimeout)},mPingtimeout);
        },
        error:function(xmlHttpRequest, errorThrown) {
            reject(errorThrown);
        }
    });
}

const resetConnectTimer = function(){
    clearInterval(mInttimeout);
    if(!globalObj.isCallStatus){
        var timeOut = 15 * 60 * 1000;
        mInttimeout = setInterval(() => {cb_getConnectState(timeOut)},timeOut);
    }
}

/* aync http request, use promise to callback */
export const handleGetRequest = (request) => {
    return new Promise(function(resolve, reject) {
        $.ajax ({
            type: 'get',
            url: '/manager',
            data: request,
            async: true,
            dataType: 'text',
            cache: false,
            success: function(data) {
                resetConnectTimer();
                checkAuthen(data);
                resolve(data);
            },
            error: function(xmlHttpRequest, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}


export const handleSyncRequest = (request, callback) => {
        let tObj;
        $.ajax ({
            type: 'get',
            url: '/manager',
            data: request,
            async: false,
            dataType: 'text',
            cache: false,
            success: function(data) {
                resetConnectTimer();
                checkAuthen(data);
                tObj = data;
            },
            error: function(xmlHttpRequest, errorThrown) {
                reject(errorThrown);
            }
        });
        callback(tObj);
}

export const handleGetLogcat = (request) => {
    return new Promise(function(resolve, reject) {
        $.ajax ({
            type: 'get',
            url: '../../logcat/logcat.text',
            data: request,
            dataType: 'text',
            cache: false,
            success: function(data) {
                resetConnectTimer();
                checkAuthen(data);
                resolve(data);
            },
            error: function(xmlHttpRequest, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}

export const handleUploadCert = (url, data) => {
    return new Promise(function(resolve, reject) {
        $.ajax ({
            type: 'post',
            url: url,
            data: data,
            dataType: 'text',
            processData: false,
            cache: false,
            success: function(data) {
                resetConnectTimer();
                checkAuthen(data);
                resolve(data);
            },
            error: function(xmlHttpRequest, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}

export const build_get = function (count, vari) {
    var s = "";
    var cnt = "" + count;
    while (cnt.length < 4) {
        cnt = "0" + cnt;
    }

    s += "&var-" + cnt + "=" + encodeURIComponent(vari);
    return s;
}

export const res_parse_rawtext = function(data) {
    var msgs = new Object();
    msgs.headers = new Array();
    msgs.names = new Array();

    var allheaders = data.split('\r\n');
    var y = 0;
    for (var x = 0; x < allheaders.length; x++) {
        if (allheaders[x].length) {
            var fields = allheaders[x].split('=');

            if (fields[0] != undefined
                && fields[1] != undefined) {
                var valuestr = fields[1];
                var j = 2;
                while (j < fields.length) {
                    valuestr += "=" + fields[j];
                    j++;
                }
                try
                {
                    msgs.headers[fields[0].toLowerCase()] = decodeURIComponent(valuestr);
                }
                catch (e)
                {
                    msgs.headers[fields[0].toLowerCase()] = valuestr;
                }
                msgs.names[y++] = fields[0].toLowerCase();
            }
        }
    }

    return msgs;
}

export const pvalueToConfName = function(msgs, items) {
    var values = new Array();
    for (let i = 0; items[i] != undefined; i++) {
        var key = items[i].pvalue;
        if(typeof key == 'string') {
            key = items[i].pvalue.toLowerCase();
        }
        values[items[i].name] = msgs.headers[key];
    }

    return values;
}

export const build_put = function(count, vari, vali) {
    var s = "";
    var cnt = "" + count;
    while (cnt.length < 4) {
        cnt = "0" + cnt;
    }

    s += "&var-" + cnt + "=" + encodeURIComponent(vari);
    s += "&val-" + cnt + "=" + encodeURIComponent(vali);
    return s;
}

const checkAuthen = function(data) {
    if (data.indexOf("Authentication Required") != -1) {
        Store.store.dispatch({type: 'PAGE_STATUS', pageStatus: 0})
    }
}

export const cb_if_is_fail = function(msgs) {
    if (msgs.headers['response'] != undefined && msgs.headers['response'].toLowerCase() == "error") {
        return true;
    } else {
        return false;
    }
}


/**
 * 检测是否有需要被应用的配置项
 */
export　const checkIsApplyNeed = (dispatch) => {
    let request = "action=needapply";
    handleGetRequest(request).then(function(data) {
        let msgs = res_parse_rawtext(data);
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