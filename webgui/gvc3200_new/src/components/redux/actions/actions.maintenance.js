import * as actionUtil from "./actionUtil";

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

