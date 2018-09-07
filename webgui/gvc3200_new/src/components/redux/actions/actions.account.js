import * as actionUtil from './actionUtil'
import * as Store from '../../entry'

export const set_defaultacct = (acctindex, callback) => (dispatch) =>{
    let request = 'action=setdefaultacct&region=account&account=' + acctindex;
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data)
        if (msgs['res'] == 'success') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_savesuc'}});
            callback();
        } else if (msgs['res'] == 'error') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_errorname'}});
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}