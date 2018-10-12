import * as actionUtil from './actionUtil'
import * as Store from '../../entry'

// it should be got missed calls data
const promptForRequestFailed = () => (dispatch) => {
    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
}

/**
 * @param linesinfo 所有通话线路的信息
 * @param callback
 */
export const setDialineInfo1= (linesinfo, callback) => (dispatch) => {
    //0~8 - represent the status of line
    dispatch({type: 'DIAL_LINE_INFO1', linesInfo: linesinfo})
}
/**
 * set the number of current lines
 */
export const setbusylinenum = (busylinenum) => (dispatch) => {
    dispatch({ type: 'BUSYLINE_STATUS', busylinenum:  busylinenum})
}

export const setVideoInvitesInfo = (videoinvitelines) => (dispatch) => {
    dispatch({type: 'VIDEO_INVITE_INFO', videoinvitelines: videoinvitelines})
}

export const get_leftcalllogname = (callback) => (dispatch) =>{
    let request = 'action=sqlitecontacts&region=apps&type=leftcalllogname';
    request += "&time=" + new Date().getTime();

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

export const getremoteupgradestate = (callback) => {
    let isrmtctrlupgrade = false;
    let request =  "action=get&var-0000=:remote_update";
    request += "&time=" + new Date().getTime();

    actionUtil.handleSyncRequest(request, (data)=>{
        let msgs = actionUtil.res_parse_rawtext(data);
        if(msgs.headers[':remote_update'] == "1"){
            isrmtctrlupgrade = true;
        }
    });
    return isrmtctrlupgrade;
}

export const cb_originate_call = (action, numbers, accounts) => (dispatch) => {
    let request = 'action='+ action ;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data){
    }).catch(function(error) {
        promptForRequestFailed()
    });
}

export const addconfmemeber = (numbers, accounts, confid, callmode, isvideo, isquickstart, pingcode, isdialplan, confname) => (dispatch) => {
    let request = 'action=addconfmemeber&region=confctrl&numbers=' + encodeURIComponent(numbers) + "&accounts=" +
        encodeURIComponent(accounts) + "&confid=" + confid + "&callmode=" + callmode + "&isvideo=" + isvideo +
        "&isquickstart=" + isquickstart + "&pingcode=" + pingcode + "&isdialplan=" + isdialplan + "&confname=" + confname;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "error") {
            if (msgs.headers['message'] && msgs.headers['message'].toLowerCase() == "authentication required") {
                dispatch({type: 'PAGE_STATUS', pageStatus: 0})
            } else {
                if (msgs.headers['message'] == "0")
                    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_534'}});
                else
                    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_533'}});
            }
        }
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const quickStartIPVConf = (isvideo) => (dispatch) => {
    let request = 'action=quickStartIPVConf&region=confctrl&isvideo=' + isvideo;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data){
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_start_addmemberconf = (acctstates, numbers, accounts, callmode, confid, isdialplan, confname, isvideo, isquickstart, pingcode) => (dispatch) => {
    //check if all the lines are busy
    {

    }
    //check remote upgrading
    if(getremoteupgradestate()){
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_19236'}});
        return false;
    }
    let accountArr =  accounts.split(":::");
    let unactive = 0;
    for(let i = 0 ; i< accountArr.length; i++){
        if (acctstates[accountArr[i]].activate == "0") {
            unactive ++;
        }
    }
    if(unactive == accountArr.length){
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_19374'}})
        return false;
    }
    // let tempnumbers = numbers.split(":::");
    if (isquickstart == undefined)
        isquickstart = 0;
    if (pingcode == undefined)
        pingcode = "";
    if (isdialplan == undefined || isdialplan === "")
        isdialplan = 1;

    if (confname == undefined)
        confname = "";
    var urihead;
    if (callmode == undefined || callmode == "")
        callmode = "call";
    addconfmemeber(numbers, accounts, confid,callmode,isvideo,isquickstart,pingcode,isdialplan,confname)(dispatch);
}

export const cb_start_single_call = (acctstates, dialnum, dialacct, ispaging, isdialplan, isipcall, isvideo) => (dispatch) => {
    if (dialnum == "") {
        return false;
    }
    //check remote upgrading
    if(getremoteupgradestate()){
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_19236'}});
        return false;
    }
    if (acctstates[dialacct].activate == "0") {
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_19374'}});
        return false;
    }
    if (acctstates[dialacct].register == "0") {
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_19375'}});
        return false;
    }
    if (dialnum == "anonymous") {
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_10083'}});
        return false;
    }
    if (isipcall == undefined) {
        isipcall = 0;
    }
    setTimeout(()=>{
        cb_originate_call("originatecall&region=webservice&destnum=" + encodeURIComponent(dialnum) + "&account=" + dialacct + "&isvideo=" + isvideo + "&ispaging=" + ispaging + "&isipcall=" + isipcall + "&isdialplan=" + isdialplan + "&headerstring=&format=json", dialnum, dialacct)(dispatch);
    }, 100);
}

/**
 * 获取最大通话路数
 */
export const getMaxlineCount =() => (dispatch) =>{
    let request = "action=getmaxlinecount";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data){
        let tObj = JSON.parse(data);
        dispatch({type: 'REQUEST_GET_MAXLINECOUNT', maxlinecount: tObj.count});
    }).catch(function(error) {
        console.log("getMaxlineCount Exception:",error);
    });
}

export const getContacts = (callback) => (dispatch) => {
    // let request = 'action=sqlitecontacts&type=contacts';
    // let request = 'action=sqlitecontacts&region=apps&type=contacts';
    let request = "action=sqlitecontacts&region=apps&type=contacts&sqlstr=select contacts._id as contacts_id,raw_contacts._id as raw_contacts_id,raw_contacts.display_name as contact_display_name,data.phone,data.accountid,data._id from contacts left join raw_contacts on contacts.name_raw_contact_id=raw_contacts._id left join (select _id, raw_contact_id,data1 as phone,data11 as accountid from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on raw_contacts._id=data.raw_contact_id;"
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();
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
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_deleteCall = (deleteId,flag, callback) => (dispatch) => {
    let request = 'action=removecall&region=webservice&flag='+ flag +'&id=' + deleteId;
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        callback(tObj.res);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const getContactsinfo = () => (dispatch) => {
    let request = 'action=sqlitecontacts&region=apps&type=contactinfo';
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        callback(tObj.res);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const get_deleteOnceConf = (deleteId, callback) => (dispatch) => {
    let request = 'action=notifyschedule&region=webservice&type=5&scheduleId=' + deleteId;
    request += "&time=" + new Date().getTime();

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
    request += "&time=" + new Date().getTime();

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

/**
 * mute or unmute local line
 * @param ismute
 */
export const ctrlLocalMute = (ismute, callback) => (dispatch) => {
    let request = "action=ctrllocalmute&region=confctrl&setmute=" + ismute;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data){
        let tObj = JSON.parse(data);
    }).catch(function(error) {
        console.log("ctrllocalmute Exception:",error);
    });
}

export const ctrlLineMute = (line, ismute) => (dispatch) => {
    let request = "action=ctrllinemute&region=confctrl&line="+line+"&setmute="+ismute;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data){
        let tObj = JSON.parse(data);
    }).catch(function(error) {
        console.log("ctrlLineMute Exception:",error);
    });
}


export const gethdmi1state = (callback) => (dispatch) => {
    let request = "action=gethdmi1state&region=status";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data){
        let tObj = JSON.parse(data);
        callback(tObj)
    }).catch(function(error) {
        console.log("gethdmi1state Exception:",error);
    });
}

export const isFECCEnable = (line, callback) => (dispatch) =>{
    let request = "region=confctrl&action=isFECCEnable&line=" + line;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        data = data.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
        let tObj = eval("(" + data + ")");
        callback(tObj)
    }).catch(function (error) {
        console.log("isFECCEnable Exception:", error);
    });
}

export const ctrlFECC = (line, flag, callback) => (dispatch) =>{
    let request = "";
    if(flag == 1){
        request = "region=confctrl&action=startFECC&line=" + line;
    }else{
        request = "region=confctrl&action=stopFECC&line=" + line;
    }
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        data = data.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
        let tObj = eval("(" + data + ")");
        callback(tObj)
    }).catch(function (error) {
        console.log("ctrlFECC Exception:", error);
    });
}

export const getHDMI1Resolution = (async, callback) => (dispatch) =>{
    let request = "action=get&var-0000=25104";
    request += "&time=" + new Date().getTime();

    if(async == true){
        actionUtil.handleGetRequest(request).then(function (data) {
            let msgs = actionUtil.res_parse_rawtext(data);
            callback(msgs);
        }).catch(function (error) {
            console.log("getHDMI1Resolution Exception:", error);
        });
    }else{
        actionUtil.handleSyncRequest(request).then(function (data) {
            let msgs = actionUtil.res_parse_rawtext(data);
            callback(msgs);
        }).catch(function (error) {
            console.log("getHDMI1Resolution Exception:", error);
        });
    }
}

export const getAllLineStatus = (callback) => (dispatch) => {
    let request = 'region=confctrl&action=getallLineInfo';
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        let lineinfoArr = eval("([" + data + "])");
        dispatch({type: 'DIAL_LINE_INFO1', linesInfo: lineinfoArr});
        callback(lineinfoArr);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const setMuteStatus = (line, status) => (dispatch) => {
    dispatch({ type: 'MUTE_STATUS', muteStatus: {line: line, status: status} })
}

export const setRecordStatus = (status) => (dispatch) => {
    dispatch({ type: 'RECORD_STATUS', recordStatus:  status})
}

export const setHeldStatus = (status) => (dispatch) => {
    dispatch({ type: 'HELD_STATUS', heldStatus:  status})
}

export const setFECCStatus = (line, status) => (dispatch) =>{
    dispatch({ type: 'FECC_STATUS', FECCStatus: {line: line, status: status}});
}

export const isConfOnHold = (callback) => (dispatch) =>{
    let request = "action=isConfOnHold&region=confctrl";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        var result = eval("("+data+")");
        if(result.res == "success" || result == 0){
            if(result.flag == "true"){
                dispatch({ type: 'HELD_STATUS', heldStatus: "1"})
            }else{
                dispatch({ type: 'HELD_STATUS', heldStatus: "0"})
            }
        }
        callback(result);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const gotoFECCpreset = (line, presetid) => (dispatch) =>{
    let request = "action=FECCpreset&region=confctrl&type=goto&line=" + line + "&presetid=" + presetid;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const saveFECCpreset = (line, presetid) => (dispatch) =>{
    let request = "action=FECCpreset&region=confctrl&type=save&line=" + line + "&presetid=" + presetid;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
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

export const getipvrole = (line, type) => (dispatch) => {
    let request = "action=getipvrole&region=confctrl&line=" + line + "&type" + type;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        var result = eval("("+data+")");
        dispatch({ type: 'REQUEST_GET_IPVTROLE', ipvrole: result.role+""});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const endlinecall = (line, flag) => (dispatch) =>{
    let request = "action=endcall&region=webservice&line=" + line + "&flag=" + flag ;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        var result = eval("("+data+")");
        if(result != 0){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_63'}});
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const blockLineOrNot = (line) =>(dispatch) => {
    let request = "action=blockLineOrNot&region=confctrl&line="+line;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const ctrlvideostate = (line, mode) =>(dispatch) => {
    let request = "action=ctrlvideostate&region=confctrl&isflag="+ mode + "&line=" + line;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const acceptringline = (line, isaccept, isvideo, callback) => (dispatch) => {
    let request = "action=acceptringline&region=confctrl&isaccept=" + isaccept + "&line=" + line + "&isvideo=" + isvideo;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const conflinevideoedstate = (line, isvideoed) => ( dispatch ) => {
    let request = "action=conflinevideoedstate&region=confctrl&isvideoed="+ isvideoed + "&line="+ line;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const getCameraBlocked = () => ( dispatch ) => {
    let request = "action=isCameraBlocked&region=confctrl";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let result = eval("("+data+")");
        let flag = "0";
        if(result.flag == "true" || result.flag == "0"){
            flag = "0";
        } else if(result.flag == "false" || result.flag == "1"){
            flag = "1";
        }
        setLocalcameraStatus(flag)(dispatch);
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const setLocalcameraStatus = (flag) => (dispatch) =>{
    dispatch({ type: 'REQUEST_GET_CAMERABLOCKEDSTATUS', localcamerablocked: flag});
}

export const ctrlCameraBlockState = () => (dispatch) => {
    let request = "action=ctrlCameraBlockState&region=confctrl";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const acceptOrRejectvideo = (isaccept, line) => (dispatch) => {
    let request = "action=isacceptvideo&region=confctrl&isflag=" + isaccept + "&line=" + line;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

