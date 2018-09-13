import * as actionUtil from './actionUtil'
import * as Store from '../../entry'

// it should be got missed calls data
export const get_leftcalllogname = (callback) => (dispatch) =>{
    let request = 'action=sqlitecontacts&region=apps&type=leftcalllogname';
    actionUtil.handleGetRequest(request).then(function(data) {
        var missedcallsname = [];
        var json;
        if( data.substring(0, 1) == "{" )
        {
            json = eval("(" + data + ")");
            missedcallsname = json.Data;
        }
        dispatch({type: 'REQUEST_GET_MISSEDCALLLOGNAME', missedcallsname: missedcallsname});
        callback(missedcallsname);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_originate_call = (action, numbers,accounts) => (dispatch) =>{
    let request = 'action='+ action ;
    actionUtil.handleGetRequest(request).then(function(data){
    }).catch(function(error) {
        promptForRequestFailed();
    });

}

export const quickStartIPVConf = (isvideo) => (dispatch) => {
    let request = 'action=quickStartIPVConf&region=confctrl&isvideo=' + isvideo;
    actionUtil.handleGetRequest(request).then(function(data){
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

/**
 * 获取最大通话路数
 */
export const getMaxlineCount =() => (dispatch) =>{
    let request = "action=getmaxlinecount";
    actionUtil.handleGetRequest(request).then(function(data){
        let tObj = JSON.parse(data);
        dispatch({type: 'REQUEST_GET_MAXLINECOUNT', maxlinecount: tObj.count});
    }).catch(function(error) {
        console.log("getMaxlineCount Exception:",error);
    });
}

/**
 * set the number of current lines
 */
export const setbusylinenum = (busylinenum) => (dispatch) => {
    dispatch({ type: 'BUSYLINE_STATUS', busylinenum:  busylinenum})
}