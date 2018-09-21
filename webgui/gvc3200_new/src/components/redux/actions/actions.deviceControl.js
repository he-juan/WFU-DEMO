import * as actionUtil from "./actionUtil";


const promptForRequestFailed = () => (dispatch) => {
    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
}

export const getPresetInfoVedio = (callback) => (dispatch) => {
    var request = "action=getpresetinfo&region=control"
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const Ptzctrl = (type,callback) => (dispatch) => {
    var request = "action=ptzctrl&region=control&type=" + type + "&param=0"
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = actionUtil.res_parse_rawtext(data)
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const PtzctrlStop = (type,callback) => (dispatch) => {
    var request = "action=ptzctrl&region=control&type=stop&param=0"
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = actionUtil.res_parse_rawtext(data)
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const updatePosition = (type,callback) => (dispatch) => {
    var request = "action=setpreset&region=control&type=add&position=100"
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = actionUtil.res_parse_rawtext(data)
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}


export const sqliteconf = (selposition,callback) => (dispatch) => {
    var request = "action=sqliteconf&region=apps&type=gotopreset&id=" + selposition
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = actionUtil.res_parse_rawtext(data)
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const setpreset = (preset,callback) => (dispatch) => {
    var request = "action=setpreset&region=control&type=add&position=" + preset
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = actionUtil.res_parse_rawtext(data)
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const deletepreset = (preset,callback) => (dispatch) => {
    var request = "action=setpreset&region=control&type=delete&position=" + preset
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = actionUtil.res_parse_rawtext(data)
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

// for fecc
export const setKeyCode = (action,keycode,repeattimes,callback) => (dispatch) => {
    var request = "action=remotekeypress&region=remotekey&keyaction=" + action + "&keycode=" + keycode + "&repeattimes=" + repeattimes;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

