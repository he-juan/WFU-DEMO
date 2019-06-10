import * as actionUtil from "./actionUtil";

const promptForRequestFailed = () => (dispatch) => {
    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
}

export const getdevelopmode = (callback) => (dispatch) => {
    var request = "action=developmode&way=get"
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const setdevelopmode = (devemode,callback) => (dispatch) => {
    var request = "action=developmode&way=set&devestate="+devemode
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        if(tObj.response=="success"){
            callback()
        }
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const start_ping2 = (addr,callback) => (dispatch) => {
    let request = "action=starttraceroute&addr=" + addr;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_ping_msg2 = (offset,callback) => (dispatch) => {
    let request = "action=gettracroutemsg&offset=" + offset;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const stop_ping2 = (callback) => (dispatch) => {
    let request = "action=stoptracroute";

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}



export const getEventItems = () => (dispatch) => {
    let request = 'action=getactionurls';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        dispatch({type: 'REQUEST_GET_EVENT_ITEMS', eventItems: msgs})
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const setEventItems = (values) => (dispatch) => {
    var setEventItemsArr = [];
    var urihead = "action=putactionurls";
    for (var i in values) {
        urihead += "&";
        urihead += i;
        urihead += "=";
        (values[i]) && (values[i] = values[i].replace(/&/g, "&amp;"));
        urihead += encodeURIComponent(values[i]||'');
    }
    urihead += "&time=" + new Date().getTime();
    let request = urihead;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_7479'}});
            actionUtil.checkIsApplyNeed(dispatch);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getLogcatDown = (values,callback) => (dispatch) => {
    var request = "action=getlogcat&region=maintenance&tag=" + ($.trim(values.logtag) || '') + "&priority=" + values.logpriority;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback();
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getLogcatfile = () => (dispatch) => {
    var request = "";

    actionUtil.handleGetLogcat(request).then(function(data) {
        dispatch({type: 'REQUEST_GET_LOGCAT_FILE', logcatFile: data});
        setTimeout(removeLogcat(), 2000);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

const removeLogcat = () => (dispatch) => {
    let request = 'action=removelogcat';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getClearLogcat = () => (dispatch) => {
    let request = 'action=clearlogcat&region=maintenance';
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "error" &&
            msgs.headers['message'].toLowerCase() == "authentication required") {
            dispatch({type: 'PAGE_STATUS', pageStatus: 0})
        }
        if (actionUtil.cb_if_is_fail(msgs)) {
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_clearsuc'}});
            dispatch({type: 'REQUEST_GET_LOGCAT_FILE', logcatFile: ""});
            actionUtil.checkIsApplyNeed(dispatch);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getCapturemode = (action,callback) => (dispatch) => {
    let request = 'action='+action;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        actionUtil.checkIsApplyNeed(dispatch);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getRecordState = (callback) => (dispatch) => {
    let request = 'action=getrecordstate';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getDelete = (action,callback) => (dispatch) => {
    let request = 'action='+action;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "error" &&
            msgs.headers['message'].toLowerCase() == "authentication required") {
            dispatch({type: 'PAGE_STATUS', pageStatus: 0})
        } else {
        }
        if (msgs.headers['response'] != undefined && msgs.headers['response'].toLowerCase() == "error") {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_del_failed'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_del_ok'}});
        }
        actionUtil.checkIsApplyNeed(dispatch);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getTracelist = (callback) => (dispatch) => {
    let request = 'action=tracelist&region=maintenance';

    actionUtil.handleGetRequest(request).then(function(data) {
        let tracelist = [];
        if( data.substring(0, 1) == "{" )
        {
            var json = eval("(" + data + ")");
            tracelist = json.Tracelist;
    	}
        dispatch({type: 'REQUEST_GET_TRACE_LIST', tracelist: tracelist});
        callback(tracelist[0]);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getCoredumplist = () => (dispatch) => {
    let request = 'action=coredumplist';

    actionUtil.handleGetRequest(request).then(function(data) {
        let coredumplist = [];
        if( data.substring(0, 1) == "{" )
        {
            var json = eval("(" + data + ")");
            coredumplist = json.Coredumplist;
    	}
        dispatch({type: 'REQUEST_GET_COREDUMP_LIST', coredumplist: coredumplist});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getRecording = (action,callback) => (dispatch) => {
    let request = 'action='+action;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let res = msgs.headers['response'];
        callback(res);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const Screenshort = (type, value, callback) => (dispatch) => {
    let request;
    if (value) {
        request = 'action=screenshot&type=' + type + '&name=' + value;
    } else {
        request = 'action=screenshot&type=' + type;
    }

    actionUtil.handleGetRequest(request).then(function(data) {
        var json = eval("(" + data + ")");
        if ( type == "new" ) {
            callback(json);
        } if ( type == "get" ) {
            let screenList = [];
            if ( data.substring(0, 1) == "{" ) {
                var json = eval("(" + data + ")");
                screenList = json.piclist;
            }
            dispatch({type: 'REQUEST_GET_SCREEN_LIST', screenList: screenList});
            callback(screenList[0]);
        } if ( type == "delete" ) {
            if (json.response != undefined && json.response.toLowerCase() == "error") {
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_del_failed'}});
            } else {
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_del_ok'}});
            }
            callback(json);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const viewRecordList = (callback) => (dispatch) => {
    let request = 'action=viewrecordlist';

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getRecordList = (callback) => (dispatch) => {
    let request = 'action=getrecordlist';
    actionUtil.handleGetRequest(request).then(function(data) {
        let recordlist = [];
        if( data.substring(0, 1) == "{" )
        {
            var json = eval("(" + data + ")");
            recordlist = json.Records;
    	}
        dispatch({type: 'REQUEST_GET_RECORD_LIST', recordlist: recordlist});
        callback(recordlist[0]);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const start_ping = (addr,callback) => (dispatch) => {
    let request = "action=starttraceroute&addr=" + addr;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_ping_msg = (offset,callback) => (dispatch) => {
    let request = "action=gettracroutemsg&offset=" + offset;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const stop_ping = (callback) => (dispatch) => {
    let request = "action=stoptracroute";

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getSaveConf = () => (dispatch) => {
    let request = 'action=saveconf';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            // send notice action
        } else {
            window.location.href = "/config.txt?time=" + new Date().getTime();
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_resetres_ok = (flag) => (dispatch) => {
    let request = 'action=factset&resetstyle='+flag;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {

        } else {
            Store.cookie("resetreboot", "1", { path: '/', expires: 10 });
            dispatch({type: 'PAGE_STATUS', pageStatus: 2})
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_check_provision = (upgradeall,callback) => (dispatch) => {
    let request = 'action=provisioninit&region=maintenance&upgradeall=' + upgradeall;

    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const initUploadStatus = () => (dispatch) => {
    let request = 'action=initupstatus&region=maintenance';

    actionUtil.handleGetRequest(request).then(function(data) {

    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const systemUpgrade = (callback) => (dispatch) => {
    let request = "action=sysupgrade&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        callback();
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_upgrade_now = (upgradeall,callback) => (dispatch) => {
    let request = 'action=upgradenow&region=maintenance';

    actionUtil.handleGetRequest(request).then(function(data) {
        var msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            if (upgradeall === true) {
                var result = parseInt(msgs.headers["result"]);
                if (result == 2) {
                    callback(result);
                } else {
                    result = 3;
                    callback(result);
                }
            }
        } else {
            /*if (upgradeall === true) {
                var result = 11;
                callback(result);
                return;
            }*/
            var result = parseInt(msgs.headers["result"]);
            callback(result);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_Importconf = (callback) => (dispatch) => {
    let request = 'action=importconf';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let result;
        if (actionUtil.cb_if_is_fail(msgs)) {
            result = 1;
            callback(result);
        } else {
            result = 2;
            callback(result);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_set_property = (type,value) => (dispatch) => {
    let request = "action=setprop&type=" + type + "&value=" + encodeURIComponent(value);

    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}


export const oneClickDebug = (items, callback) => (dispatch) => {
    let request = "action=oneclickdebug&mode=" + items['mode'] +
                "&syslog=" + Number(items['syslog']) +
                "&logcat=" + Number(items['logcat']) +
                "&capture=" + Number(items['capture']) +
                "&region=maintenance" ;
    if(items["acce"] != undefined){
        request += "&acce=" + Number(items['acce']);
    }
    actionUtil.handleGetRequest(request).then(function(data){
        callback(actionUtil.res_parse_rawtext(data));
    }).catch(function(error){
        promptForRequestFailed();
    });
}
