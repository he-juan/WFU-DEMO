import * as actionUtil from "./actionUtil";

'recording&region=maintenance&type=getrecordinglist {"name": "record", "lang": "a_12098", "acl": 0, "product": "1"},'

const promptForRequestFailed = () => (dispatch) => {
    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
}

export const getVideoRecording = (callback) => (dispatch) => {
    let request = 'action=recording&region=maintenance&type=getrecordinglist';

    actionUtil.handleGetRequest(request).then(function(data) {
        let recordinglist = [];
        var Use24Hour;
        if( data.substring(0, 1) == "{" )
        {
            var json = eval("(" + data + ")");
            recordinglist = json.Data;
            Use24Hour = json.Use24Hour;
        }
        callback(recordinglist);
        dispatch({type: 'REQUEST_GET_VIDEORECORDINGLIST', videorecordinglist: recordinglist});
        dispatch({type: 'REQUEST_GET_USE24HOUR', Use24Hour: Use24Hour});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const resetVideoName = (infostr,callback) => (dispatch) => {
    let request="action=" + infostr + "&format=json"
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data)
        if (msgs['Response'].toLowerCase() == 'success') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_64'}});
            callback();
        } else if (msgs['Response'].toLowerCase() == 'error') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_18007'}});
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_lockRecord = (requestlock, callback) => (dispatch) => {
    let request = 'action=' + requestlock;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = JSON.parse(data);
        if (msgs['Response'].toLowerCase() == 'success') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'SUCCESS', content: 'a_64'}});
        }
        callback(msgs['Response']);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const get_deleteRecord = (requestDelete, callback) => (dispatch) => {
    let request = 'action='+requestDelete;
    actionUtil.handleGetRequest(request).then(function(data) {
        if( data.substring(0, 1) == "{" )
        {
            var json = eval("(" + data + ")");
        }
        callback(json);

    }).catch(function(error) {
        promptForRequestFailed();
    });
}