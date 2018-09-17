import * as actionUtil from './actionUtil'
import * as Store from '../../entry'

// it should be got missed calls data
const promptForRequestFailed = () => (dispatch) => {
    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
}
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
        promptForRequestFailed()
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

export const getContacts = (callback) => (dispatch) => {
    // let request = 'action=sqlitecontacts&type=contacts';
    // let request = 'action=sqlitecontacts&region=apps&type=contacts';
    let request = "action=sqlitecontacts&region=apps&type=contacts&sqlstr=select contacts._id as contacts_id,raw_contacts._id as raw_contacts_id,raw_contacts.display_name as contact_display_name,data.phone,data.accountid,data._id from contacts left join raw_contacts on contacts.name_raw_contact_id=raw_contacts._id left join (select _id, raw_contact_id,data1 as phone,data11 as accountid from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on raw_contacts._id=data.raw_contact_id;"

    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data)
        if (msgs['Response'] == 'Success') {
            let msgsArr = formatContactAndGroupsData(msgs['Data'],'Number');
            let msgsAcct = formatContactAndGroupsData(msgs['Data'],'AcctIndex');
            let msgsContacts = msgs['Data'];
            dispatch({type: 'GET_CONTACTS_MSGS', msgsContacts: msgsContacts});
            dispatch({type: 'GET_CONTACTS_INFORMATION', contactsInformation: msgsArr});
            dispatch({type: 'GET_CONTACTS_ACCT', contactsAcct: msgsAcct});
            callback(msgsArr);
        } else {
            callback([]);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const setContacts = (infostr,callback) => (dispatch) => {
    let request="action=setcontact&region=webservice&contactInfo=" + encodeURIComponent(infostr) + "&format=json";
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data)
        if (msgs['res'] == 'success') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_saved'}});
            callback();
        } else if (msgs['res'] == 'error') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_errorname'}});
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const removeContact = (contactid, callback) => (dispatch) => {
    let request = 'action=removecontact&region=webservice&contactid='+contactid;
    actionUtil.handleGetRequest(request).then(function(data){
        var tObj = eval("(" + data + ")");
        if (tObj.res == "success"){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_del_ok'}});
        }
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getGroups = (callback) => (dispatch) => {
    // let request = 'action=sqlitecontacts&type=groups';
    let request = 'action=sqlitecontacts&region=apps&type=groups';
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data)
        if (msgs['Response'] == 'Success') {
            let msgsArr = formatContactAndGroupsData(msgs['Data'],'ContactId');
            dispatch({type: 'GET_GROUP_INFORMATION', groupInformation: msgsArr});
            callback(msgsArr);
        } else {
            callback([]);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

const formatContactAndGroupsData = function(data,type){
    //type is Number or ContactId
    let msgsArr=[],tempObj={},numberArr=[];
    let tempMsgs = JSON.parse(JSON.stringify(data));
    let initDateFormat = function (_tempMsg) {
        if(_tempMsg.length>0) {
            tempObj = _tempMsg[_tempMsg.length-1];
            numberArr.push(tempObj[type]);
            _tempMsg.splice(_tempMsg.length-1,1);
            for(let i=_tempMsg.length-1;i>=0;i--) {
                if(_tempMsg[i].Id == tempObj.Id) {
                    numberArr.push(_tempMsg[i][type])
                    _tempMsg.splice(i,1);
                }
            }
            tempObj[type] = numberArr.reverse();
            numberArr = [];

            msgsArr.push(tempObj);
            initDateFormat(_tempMsg)
        }
    }
    initDateFormat(tempMsgs);
    msgsArr = msgsArr.reverse();
    return msgsArr;
}

export const setGroups = (groupname,ringtone,editGroupId,callback) => (dispatch) => {
    let request = 'action=setgroup&region=webservice&groupInfo='+encodeURIComponent(editGroupId+':::'+groupname)+'&format=json';
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data)
        if (msgs['res'] == 'success') {
            callback(msgs);
        } else {

        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const updateGroupMembers = (mEditMode,id,contactids) => (dispatch) => {
    let request='';
    if( mEditMode == 0 ){
        request += "action=updateGroupMemberShip&region=webservice&id=";
        request += id;
        request += "&contactids=";
        request += encodeURIComponent(contactids);
    }else if(mEditMode == 1) {
        request = "cleargroup&groupID=" + id;
    }
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data)
        if (msgs['res'] == 'success') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_savesuc'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const removeGroup = (groupid) => (dispatch) => {
    let request = 'action=removegroup&region=webservice&groupID='+groupid;
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data);
        if (msgs.res == "success") {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_del_ok'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_del_failed'}});
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_calllog = (type, callback) => (dispatch) => {
    let request;
    if( type == 0 || type == 4 || type == 6){
        request = "action=sqlitecontacts&region=apps&type=leftcalllogall&logtype=" + type;
    }else{
        request = "action=sqlitecontacts&region=apps&type=leftcalllogtype&logtype=" + type;
    }
    actionUtil.handleGetRequest(request).then(function(data) {
        var logItemdata = [];
        var json;
        var Use24Hour;
        if( data.substring(0, 1) == "{" )
        {
            json = eval("(" + data + ")");
            logItemdata = json.Data;
            Use24Hour = json.Use24Hour;
        }
        dispatch({type: 'REQUEST_GET_CALLLOG', logItemdata: logItemdata});
        dispatch({type: 'REQUEST_GET_USE24HOUR', Use24Hour: Use24Hour});
        callback(logItemdata);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_clear = (callback) => (dispatch) => {
    let request = 'action=clearallcallhistory&region=webservice';
    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_deleteCall = (deleteId,flag, callback) => (dispatch) => {
    let request = 'action=removecall&region=webservice&flag='+ flag +'&id=' + deleteId;
    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        callback(tObj.res);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const get_deleteCallConf = (deleteId,callback) => (dispatch) => {
    let request = 'action=removecallconf&region=webservice&confId=' + deleteId;
    // let request = 'action=removecallconf&region=webservice&confId=' + deleteId
    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        callback(tObj.res);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const getContactsinfo = () => (dispatch) => {
    let request = 'action=sqlitecontacts&region=apps&type=contactinfo';
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = JSON.parse(data);
        let contactinfodata = msgs['Data'];
        dispatch({type: 'REQUEST_GET_CONTACTINFO', contactinfodata: contactinfodata});
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const getAllConfMember = (callback) => (dispatch) => {
    let request = 'action=sqlitecontacts&region=apps&type=confmember&flag=1';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = JSON.parse(data);
        let confmemberinfodata = msgs['Data'];
        dispatch({type: 'REQUEST_GET_CONFMEMBERINFO', confmemberinfodata: confmemberinfodata});
        callback(confmemberinfodata);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getNormalCalllogNames = () => (dispatch) => {
    let request = 'action=sqlitecontacts&region=apps&type=leftcalllogname';

    actionUtil.handleGetRequest(request).then(function(res) {
        let msgs = JSON.parse(res);
        let data = msgs['Data'];
        dispatch({type: 'REQUEST_GET_CALLNAME', callnameinfo: data});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getPreConf = (callback) => (dispatch) => {
    let request = 'action=sqliteconf&region=apps&type=preconf';
    actionUtil.handleGetRequest(request).then(function(res) {
        let msgs = JSON.parse(res);
        let data = msgs['Data'];
        dispatch({type: 'REQUEST_GET_PRECONFINFO', preconfdata: data});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getConfInfo = (callback) => (dispatch) => {
    let request = 'action=sqliteconf&region=apps&type=schedule';
    actionUtil.handleGetRequest(request).then(function(res) {
        let msgs = JSON.parse(res);
        let data = msgs['Data'];
        dispatch({type: 'REQUEST_GET_CONFINFO', confinfodata: data});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_deleteConf = (deleteId, callback) => (dispatch) => {
    let request = 'action=deleteschedule&region=webservice&id=' + deleteId;
    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        callback(tObj.res);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const get_deleteOnceConf = (deleteId, callback) => (dispatch) => {
    let request = 'action=notifyschedule&region=webservice&type=5&scheduleId=' + deleteId;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        var response = msgs.headers['response'];
        if(response == "Success") {
            callback('success')
        } else {
            callback("ERROR")
        }
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const setschedule = (infostr,type,callback) => (dispatch) => {
    let request="action=addschedule&region=webservice&id=" + infostr;
    if(type == 1) {
        request="action=updateschedule&region=webservice&id=" + infostr;
    }
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data)
        if (msgs['res'] == 'success') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_saved'}});
            callback();
        } else if (msgs['res'] == 'error') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_errorname'}});
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

// export const updateschedule = (infostr,callback) => (dispatch) => {
//     let request="action=updateschedule&region=webservice&id=" + encodeURIComponent(infostr) + "&format=json";
//     actionUtil.handleGetRequest(request).then(function(data){
//         let msgs = JSON.parse(data)
//         if (msgs['res'] == 'success') {
//             dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_saved'}});
//             callback();
//         } else if (msgs['res'] == 'error') {
//             dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_errorname'}});
//         }
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }