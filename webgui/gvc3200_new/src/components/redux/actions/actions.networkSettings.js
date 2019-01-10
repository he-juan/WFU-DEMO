import * as actionUtil from "./actionUtil";

export const getReadshowipState = (callback) => (dispatch) => {
    let request = 'action=readshowip';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        dispatch({type: 'REQUEST_GET_READSHOWIP_STATE', readshowipState: msgs});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_showwidgetip = (showip) => (dispatch) => {
    let request = 'action=writeshowip&showip='+showip;

    actionUtil.handleGetRequest(request).then(function(data) {

    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_Restart8021x = () => (dispatch) => {
    let request = 'action=restart8021x';

    actionUtil.handleGetRequest(request).then(function(data) {

    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_lldp_qos_check = (callback) => (dispatch) => {
    let request = 'action=get&var-0000=vlan_id&var-0001=vlan_qos&var-0002=in_lldp&time=' + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_putTwoline = (enable, vid, priority, callback) => (dispatch) => {
    let request = "action=puttwovlan&enable=" + enable + "&vid=" + vid + "&priority=" + priority;

    actionUtil.handleGetRequest(request).then(function(data) {
        callback(enable);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_put_network2 = () => (dispatch) => {
    let request = 'action=putnetwork';

    actionUtil.handleGetRequest(request).then(function(data) {
        //window.parent.unblock_func();
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const setOpenVPNCert = (pvalue, callback) => (dispatch) => {
    let request = "action=setopenvpncert&region=advanset&pvalue=" + pvalue;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}
