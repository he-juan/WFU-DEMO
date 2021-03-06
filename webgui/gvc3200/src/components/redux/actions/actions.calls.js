import * as actionUtil from './actionUtil'
import {store} from '../../entry'


let mIPtest = /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;
let mRegnumber = new RegExp("^[0-9]*$");
// it should be got missed calls data
const promptForRequestFailed = () => (dispatch) => {
    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
}


// 新接口 获取联系人
export const getContactsNew = () => (dispatch) => {
    let request = 'action=getcontacts'
    actionUtil.handleGetRequest(request).then(function(m) {
        let contactsNew = JSON.parse(m).data.contacts
        dispatch({type: 'SET_CONTACTS', contactsNew:contactsNew})
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

// 新接口 获取通话记录
export const getCallLogsNew = () => (dispatch) => {
    let request = 'action=getcalllogs'
    actionUtil.handleGetRequest(request).then(function(m) {
        let callLogsNew = JSON.parse(m).data.calllogs
        dispatch({type: 'SET_CALLLOGS', callLogsNew:callLogsNew})
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

// 新接口 获取会议记录
export const getSchedules = (callback) => (dispatch) => {
    let request = 'action=getschedules'
    actionUtil.handleGetRequest(request).then(function(m) {
        let schedules = JSON.parse(m).data.schedules
        callback(schedules)
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

// 新接口 统一的呼出接口
export const makeCall = (memToCall) => (dispatch) => {
    let request = 'action=makecall&members='+ JSON.stringify(memToCall)
    actionUtil.handleGetRequest(request).then(function(m) {

    })
}


// 新接口 快速会议
export const quickStartIPVConf = (isvideo) => (dispatch) => {
    let request = 'action=quickStartIPVConf&region=confctrl&isvideo=' + isvideo;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data){
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const sendSingleCall = (num, acct, isvideo, isconf, source, callmode) => (dispatch) => {
    let request = 'action=originatecall&number=' + num + "&account=" + acct + "&isvideo=" + isvideo + "&isconf=" + isconf + "&source=" + source + "&callmode=" + callmode;

    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const endCall = (line) => (dispatch) => {
    let request = 'action=endcall&line=' + line;

    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}



export const ctrlLineRecord = (line, setrecord) => (dispatch) => {
    let request = "action=ctrllinerecord&line=" + line + "&setrecord=" + setrecord;

    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}


export const showCallDialog = (value) => (dispatch) => {
    //value: "end"/"minimize"-not render  9-enter  10-leave
    // GVC3210 多路通话  需要保存线路信息
    dispatch({type: 'SHOW_CALL_DIALOG', callDialogStatus: value})
}

/**
 * @param linesinfo 所有通话线路的信息
 * @param callback
 */
export const setDialineInfo1= (linesinfo, callback) => (dispatch) => {
    //0~8 - represent the status of line

    // 保持的线路
    let unHoldlines = linesinfo.filter((v) => {
        return v.state != '5';
    });
    // 为视频通话的线路
    let isVideoLines = linesinfo.filter((v) => {
        return v.isvideo == '1';
    });
    let incomingcallsinfo = [];
    for(let i = linesinfo.length -1 ; i >= 0; i--){
        //check if is incomming call
        if(linesinfo[i].state == "2") {
            incomingcallsinfo.push(linesinfo[i]);
        }
    }
    if(incomingcallsinfo.length > 0){
        dispatch({type: 'INCOMMING_LINE_INFO', incomingcalls: {style: 'display-block', incomingcallsinfo: incomingcallsinfo}});
    }else{
        dispatch({type: 'INCOMMING_LINE_INFO', incomingcalls: {style: 'display-hidden', incomingcallsinfo: incomingcallsinfo}});
    }
    dispatch({type: 'SET_IS_VIDEO', isvideo: isVideoLines.length > 0 ? '1' : '0' });

    dispatch({type: 'DIAL_LINE_INFO1', linesInfo: linesinfo});
    setbusylinenum(linesinfo.length)(dispatch);
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

/**
 * role: 0-normal 1-guest 2-host 3-panelists
 */
export const setipvrolestatus = (role) => (dispatch) => {
    dispatch({ type: 'IPVT_ROLE_STATUS', ipvrole: role});
}
export const setvideoonlines = (videoonlines) => (dispatch) => {
    dispatch({ type: 'VIDEO_ON_LINES', videoonlines: videoonlines});
}
export const setlinedetailinfo = (detailinfo) => (dispatch) => {
    dispatch({ type: 'LINE_DETAIL_INFO', detailinfo: detailinfo});
}
/**
 * 三个根hdmi线 插拔状态 websocket同步
 */
export const setHDMIstatus = (hdmi, status) => (dispatch) => {
    dispatch({type: 'SET_HDMI_STATUS', payload: {[hdmi]: status}})
}

export const setallowipvtrcdstatus = (isallow) => (dispatch) => {
    dispatch({type: 'SET_IPVTRCD_ALLOWSTATUS', ipvtrcdallowstatus: isallow})
}

export const setMuteStatus = (line, status) => (dispatch) => {
    dispatch({ type: 'MUTE_STATUS', muteStatus: {line: line, status: status} })
}

/**
 * 录像或者本地录像的状态   区别于IPVT record 云端录像
 */
export const setRecordStatus = (status) => (dispatch) => {
    dispatch({ type: 'RECORD_STATUS', recordStatus:  status})
}

export const setIPVTRecordStatus = (status) => (dispatch) => {
    dispatch({ type: 'IPVT_RECORD_STATUS', ipvtRecordStatus:  status})
}



export const setFECCStatus = (line, status) => (dispatch) =>{
    dispatch({ type: 'FECC_STATUS', FECCStatus: {line: line, status: status}});
}

export const setHandsupstatus = (status) => (dispatch) => {
    dispatch({type: 'IPVT_HANDSUP_STATUS', handsupStatus: status});
}

export const setipvtcmrinviteinfo = (info) => (dispatch)=>{
    dispatch({type: 'IPVT_CAMERA_INVITE', ipvtcmrinviteinfo: info});
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
    let { callFeatureInfo } = store.getState();
    if( mIPtest.test( numbers.split(':')[0] ) && callFeatureInfo.disipcall == "1" )
    {
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_10084'}});
        return false;
    }
    let request = 'action='+ action ;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data){
    }).catch(function(error) {
        promptForRequestFailed()
    });
}
// 添加会议成员
export const addconfmemeber = (numbers, accounts, confid, callmode, isvideo, isquickstart, pingcode, isdialplan, confname, source) => (dispatch) => {
    let request = 'action=addconfmemeber&region=confctrl&numbers=' + encodeURIComponent(numbers) + "&accounts=" +
        encodeURIComponent(accounts) + "&confid=" + confid + "&callmode=" + callmode + "&isvideo=" + isvideo +
        "&isquickstart=" + isquickstart + "&pingcode=" + pingcode + "&isdialplan=" + isdialplan + "&confname=" + confname + "&source="+ source;
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


export const cb_start_addmemberconf = (acctstates, numbers, accounts, callmode, confid, isdialplan, confname, isvideo, source, isquickstart, pingcode) => (dispatch) => {
    //check if all the lines are busy
    let { busylinenum, maxlinecount, linesInfo, globalConfInfo } = store.getState();
    // 保持状态不能拨打
    if(globalConfInfo.isonhold == "1"){
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_10080'}});
        return;
    }
    let alllinebusyflag = false;
    if( busylinenum >= maxlinecount ){
        alllinebusyflag = true;
    }
    if(linesInfo.length > 0){
        if(linesInfo[0].acct == "1" && maxlinecount == 1){
            alllinebusyflag = false;
        }
    }
    // 在忙线路为最大线路 且 非IPVT会议 不能拨打
    if(alllinebusyflag){
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_16683'}});
        return;
    }
    //check remote upgrading
    // 设备正在升级不能拨打
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
    // 所有帐号未激活不能拨打
    if(unactive == accountArr.length){
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_19374'}})
        return false;
    }

    // 如果是ip呼叫 需要检测ip格式
    if( callmode == "ipcall" ){
        var numbersarray = numbers.split(":::");
        var acctarray = accounts.split(":::");
        var invalidnum = 0;
        var newnumber = "";
        var newacct = "";
        for(var i = 0; i < numbersarray.length; i++ ){
            if (actionUtil.checkDialIPv6(numbersarray[i])) {   //IPv6
                var port = 0;
                if (numbersarray[i].indexOf("#") != -1) {
                    port = parseInt(numbersarray[i].split("#")[1], 10);
                } else if (numbersarray[i].indexOf(".") != -1) {
                    port = parseInt(numbersarray[i].split(":")[1], 10);
                } else if (numbersarray[i].indexOf("]:") != -1) {
                    port = parseInt(numbersarray[i].split("]:")[1], 10);
                }

                if (port < 0 || port > 65535) {
                    invalidnum++;
                    continue;
                }
            } else {
                var ipnumber = numbersarray[i].split(":");
                if(!mIPtest.test(ipnumber[0]))
                {
                    invalidnum++;
                    continue;
                }
                if(ipnumber[1] != undefined)
                {
                    //port
                    if(!mRegnumber.test(ipnumber[1]) || parseInt(ipnumber[1], 10) < 0 || parseInt(ipnumber[1], 10) > 65535)
                    {
                        invalidnum ++;
                        continue;
                    }
                }
            }
            if( newnumber != "" ) {
                newnumber += ":::";
                newacct += ":::";
            }
            newnumber += numbersarray[i];
            newacct += acctarray[i];
        }
        if( invalidnum == numbersarray.length ){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_4246'}})
            return false;
        }else if( invalidnum > 0 ){
            numbers = newnumber;
            accounts = newacct;
        }
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
    addconfmemeber(numbers, accounts, confid,callmode,isvideo,isquickstart,pingcode,isdialplan,confname, source)(dispatch);
}

export const cb_start_single_call = (acctstates, dialnum, dialacct, ispaging, isdialplan, isipcall, isvideo, source) => (dispatch) => {
    if (dialnum == "") {
        return false;
    }
    let { busylinenum, maxlinecount, linesInfo, globalConfInfo, callFeatureInfo } = store.getState();
    if(globalConfInfo.isonhold == "1"){
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_10080'}});
        return;
    }
    let alllinebusyflag = false;
    if( busylinenum >= maxlinecount ){
        alllinebusyflag = true;
    }
    if(alllinebusyflag){
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_16683'}});
        return;
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

    dialnum = dialnum.split(":::")[0];
    if(isipcall == 1)
    {
        if (actionUtil.checkDialIPv6(dialnum)) {   //IPv6
            let port = 0;
            if (dialnum.indexOf("#") != -1) {
                port = parseInt(dialnum.split("#")[1], 10);
            } else if (dialnum.indexOf(".") != -1) {
                port = parseInt(dialnum.split(":")[1], 10);
            } else if (dialnum.indexOf("]:") != -1) {
                port = parseInt(dialnum.split("]:")[1], 10);
            }

            if (port < 0 || port > 65535) {
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_4246'}});
                return false;
            }
        } else {
            let ipnumber = dialnum.split(":");
            if (!mIPtest.test(ipnumber[0])) {
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_4246'}});
                return false;
            }
            if (ipnumber[1] != undefined) {
                //port
                if (!mRegnumber.test(ipnumber[1]) || parseInt(ipnumber[1], 10) < 0 || parseInt(ipnumber[1], 10) > 65535) {
                    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'WARNING', content: 'a_4246'}});
                    return false;
                }
            }
        }
    }else{
        let ipnumber = dialnum.split(":");
        if( callFeatureInfo.disipcall != '1' && (mIPtest.test(ipnumber[0]) || actionUtil.checkDialIPv6(dialnum)))
            isipcall = 1;
    }
    setTimeout(()=>{
        cb_originate_call("originatecall&region=webservice&destnum=" + encodeURIComponent(dialnum) + "&account=" + dialacct + "&isvideo=" + isvideo + "&ispaging=" + ispaging + "&isipcall=" + isipcall + "&isdialplan=" + isdialplan +"&source="+ source + "&headerstring=&format=json", dialnum, dialacct)(dispatch);
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
        dispatch({type: 'REQUEST_GET_MAXLINECOUNT', maxlinecount: tObj.data.count});
    }).catch(function(error) {
        console.log("getMaxlineCount Exception:",error);
    });
}

/**
 * 获取联系人列表
 */
export const getContacts = (callback) => (dispatch) => {
    let request = 'action=sqlitecontacts&region=apps&type=contacts';
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
    //let request = 'action=setgroup&region=webservice&groupInfo='+encodeURIComponent(editGroupId+':::'+groupname+':::'+ringtone)+'&format=json';
    let request = 'action=setgroup&region=webservice&groupInfo='+encodeURIComponent(editGroupId+':::'+groupname)+'&format=json';
    // request += "&time=" + new Date().getTime();
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
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_7479'}});
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

// export const getContactsinfo = () => (dispatch) => {
//     let request = 'action=sqlitecontacts&region=apps&type=contactinfo';
//     request += "&time=" + new Date().getTime();
//     actionUtil.handleGetRequest(request).then(function(data) {
//         let msgs = JSON.parse(data);
//         let contactinfodata = msgs['Data'];
//         dispatch({type: 'REQUEST_GET_CONTACTINFO', contactinfodata: contactinfodata});
//     }).catch(function(error) {
//         promptForRequestFailed();
//     })
// }

export const getContactsinfo = (showloading,callback) => (dispatch) => {
    let request = 'action=sqlitecontacts&region=apps&type=contactinfo';
    if(showloading) {
        dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block"}});
    }
    actionUtil.handleGetRequest(request).then(function(data) {
        if(showloading) {
            dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden"}})
        }
        let msgs = JSON.parse(data);
        let contactinfodata = msgs['Data'];
        dispatch({type: 'REQUEST_GET_CONTACTINFO', contactinfodata: contactinfodata});
        callback(msgs)
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


export const ctrlLineMute = (line, ismute) => (dispatch) => {
    let request = "action=ctrllinemute&region=confctrl&line="+line+"&setmute="+ismute;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data){
        let tObj = JSON.parse(data);
    }).catch(function(error) {
        console.log("ctrlLineMute Exception:",error);
    });
}

export const gethdmiinstate = () => (dispatch) => {
    let request = 'action=gethdmiinstate&region=status'
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data)
        dispatch(setHDMIstatus('hdmiIn', data.state))
    })
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
/**
 * 检查是否4kon
 *
 */
export const getHDMI1Resolution = ( callback) => (dispatch) => {
    let request = "action=get&var-0000=25104";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let hdmi1out = msgs.headers['25104'];
        hdmi1out = hdmi1out.split("P")[0];
        hdmi1out = hdmi1out.split("x");
        let is4kon = false;
        if (hdmi1out[0] >= 3840 && hdmi1out[1] >= 2160) {
            //hdmi out is 4k
            is4kon = true;
        }
        else {
            is4kon = false;
        }
        callback(is4kon);
    }).catch(function (error) {
        console.log("getHDMI1Resolution Exception:", error);
    });

}

/**
 * 判断HDMI1输出是否为4k
 */
export const gethdmione4K = (async, callback) => (dispatch) =>{
    let request = "action=gethdmione4K&region=confctrl";
    request += "&time=" + new Date().getTime();

    if(async == true){
        actionUtil.handleGetRequest(request).then(function (data) {
            let tObj = eval("(" + data + ")");
            let ishdmione4K = tObj.isHdmiOne4K;
            callback(ishdmione4K);
        }).catch(function (error) {
            console.log("gethdmione4K Exception:", error);
        });
    }else{
        actionUtil.handleSyncRequest (request, (data)=>{
            let tObj = eval("(" + data + ")")
            let ishdmione4K = tObj.isHdmiOne4K;
            callback(ishdmione4K);
        });
    }
}


export const getline4Kvideo = (async, callback) => (dispatch) =>{
    let request = "action=getline4Kvideo&region=confctrl";
    request += "&time=" + new Date().getTime();

    if(async == true){
        actionUtil.handleGetRequest(request).then(function (data) {
            let tObj = eval("(" + data + ")");
            let isline4Kvideo = tObj.hasLine4KVideo;
            callback(isline4Kvideo);
        }).catch(function (error) {
            console.log("getline4Kvideo Exception:", error);
        });
    }else{
        actionUtil.handleSyncRequest (request, (data)=>{
            let tObj = eval("(" + data + ")");
            let isline4Kvideo = tObj.hasLine4KVideo;
            callback(isline4Kvideo);
        });
    }
}

const getvideocodec = (message) => {
    if(message.state != "4"){
        return;
    }
    let msgint = parseInt(message.videomsg);
    if (msgint >= 16 && msgint < 64) {
        message.videocodec = "0";
    } else if (msgint >= 64 && msgint < 253) {
        message.videocodec = "1";
    }
}

export const getAllLineStatus = (callback) => (dispatch) => {
    let request = 'region=confctrl&action=getallLineInfo';
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        // if(JSON.parse(data).res == 'error') return false
        let lineinfoArr = eval("([" + data + "])");
        if(lineinfoArr.length>0){
            getvideocodec(lineinfoArr[0])
        }
        dispatch(setDialineInfo1(lineinfoArr))// dispatch({type: 'DIAL_LINE_INFO1', linesInfo: lineinfoArr});
        if(callback) {
            callback(lineinfoArr);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

// export const isConfOnHold = (callback) => (dispatch) =>{
//     let request = "action=isConfOnHold&region=confctrl";
//     request += "&time=" + new Date().getTime();

//     actionUtil.handleGetRequest(request).then(function(data) {
//         var result = eval("("+data+")");
//         if(result.res == "success" || result == 0){
//             if(result.flag == "true"){
//                 dispatch({ type: 'HELD_STATUS', heldStatus: "1"})
//             }else{
//                 dispatch({ type: 'HELD_STATUS', heldStatus: "0"})
//             }
//         }
//         callback(result);
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

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

export const getipvrole = (line, type, callback) => (dispatch) => {
    let request = "action=getipvrole&region=confctrl&line=" + line + "&type=" + type;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        var result = eval("("+data+")");
        setipvrolestatus(result.role+"")(dispatch);
        callback(result.role+"");
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

export const endconf = (flag) => (dispatch) =>{
    dispatch(showCallDialog('10')) // fix 当结束会议时还会重新mount通话框导致重新发请求的问题.
    let request = "action=endconf&region=confctrl&flag=" + flag ;
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

// 暂停恢复视频上传
export const conflinevideoedstate = (line, isvideoed) => ( dispatch ) => {
    let request = "action=conflinevideoedstate&region=confctrl&isvideoed="+ isvideoed + "&line="+ line;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

// 暂停视频接受功能
export const suspendLineOrNot = (line) => (dispatch) => {
    let request = "action=suspendLineOrNot&region=confctrl&line=" + line
    actionUtil.handleGetRequest(request).then(function(){
        dispatch(getAllLineStatus(function(){}))
    })
}



export const acceptOrRejectvideo = (isaccept, line) => (dispatch) => {
    let request = "action=isacceptvideo&region=confctrl&isflag=" + isaccept + "&line=" + line;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const setPresentation = (isPresent) => (dispatch) => {
    dispatch({
        type: 'SET_PRESENT',
        isPresent: isPresent
    })
}

/**
 * mode 大于0 则说明在演示中
 */
export const getBFCPMode = (cb) => (dispatch) => {
    let request = "action=getBFCPMode&region=confctrl&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function (data) {
        let _data = JSON.parse(data)
        if(parseInt(_data.mode) > 0 ){
            dispatch(setPresentation(true))
        } else {
            dispatch(setPresentation(false))
        }
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const setPresentSource = (switchto) => (dispatch) => {
    dispatch({
        type: 'SET_PRESENT_SOURCE',
        presentSource: switchto
    })
}
export const setPresentLineMsg = (line, msg) => dispatch =>{
    dispatch({
        type: 'SET_PRESENT_LINE_MSG',
        line: line,
        msg: msg
    })
}


export const confholdstate = (ishold) => (dispatch) => {
    let request = "action=confholdstate&region=confctrl&sethold=" + ishold;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const callstatusreport = (open) => (dispatch) => {
    let request = "action=callstatusReport&region=confctrl&ctrlopen=" + open;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const getguicalldetailstatus = (callback) => (disptach) =>{
    let request = "action=get&var-0000=:gui_calldetail";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs)
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const getIPVConfInfo = (ipvline, callback) => (dispatch) => {
    let request = "action=getIPVConfInfo&region=confctrl&line=" + ipvline;
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let result = eval("(" + data + ")");
        callback(result);
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const getconfdtmf = (callback) =>(dispatch) =>{
    let request = "action=getconfdtmf";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let result = eval("(" + data + ")");
        callback(result);
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const sendDTMFchar = (number, callback) =>(dispatch) => {
    let request = "action=sendconfdtmf&dtmf="+ encodeURIComponent(number);
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let result = eval("(" + data + ")");
        callback(result);
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const isallowipvtrcd = (callback) => (dispatch) =>{
    let request = "action=isallowipvtrcd&region=confctrl";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let tObj = eval("(" + data + ")");
        let isallowipvtrcd = eval(tObj.isAllow);
        setallowipvtrcdstatus(isallowipvtrcd);
        callback(isallowipvtrcd);
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const handlerecord = (recordstatus, callback) => (dispatch) =>{
    let request;
    if(recordstatus == "1"){ //目前正在处在录像状态， 需要关闭录像
        request = "action=ctrlconfrecord&state=0";
    }else{
        request = "action=ctrlconfrecord&state=1";
    }
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        if(JSON.parse(data).result == "1"){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_9692'}});
        }
        callback(tObj);
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const handleipvtrecord = (ipvtrcdstatus, callback) => (dispatch) =>{
    let request;
    if(ipvtrcdstatus == "1"){ //目前正在处在录像状态， 需要关闭录像
        request = "action=ipvtrecord&region=confctrl&state=0";
    }else{
        request = "action=ipvtrecord&region=confctrl&state=1";
    }
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        data = data.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
        let tObj = eval("(" + data + ")");
        callback(tObj.res.toLowerCase());
    }).catch(function (error) {
        promptForRequestFailed();
    });
}


/**
 * ipvt会议 本地录像状态
 */
export const getlocalrcdstatus = () => (dispatch) => {
    let request = "action=isrecording&region=confctrl";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let tObj = eval("(" + data + ")");
        if(tObj.state == "true"){
            setRecordStatus("1")(dispatch);
        }else{
            setRecordStatus("0")(dispatch);
        }

    }).catch(function (error) {
        promptForRequestFailed();
    });
}

/**
 * ipvt会议 云端录像状态
 */
export const getipvtrcdstatus = () => (dispatch) => {
    let request = "action=ipvtrcdstate&region=confctrl";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let tObj = eval("(" + data + ")");
        if(tObj.isOn == "true"){
            setIPVTRecordStatus("1")(dispatch);
        }else{
            setIPVTRecordStatus("0")(dispatch);
        }

    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const getipvthandsupstatus = () => (dispatch) => {
    let request = "action=isipvthandup&region=confctrl";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
        let tObj = eval("(" + data + ")");
        if(tObj.isHandUp == "true"){
            setHandsupstatus("1")(dispatch);
        }else{
            setHandsupstatus("0")(dispatch);
        }
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const upordownhand = () => (dispatch) => {
    let request = "action=upordownhand&region=confctrl";
    request += "&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function (data) {
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const acceptorejectipvtcmr = (line, accept) => (dispatch) => {
    let request = "action=acceptorejectipvtcmr&region=confctrl&line=" + line + "&accept=" + accept;
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function (data) {
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

export const resumecamera = (callback) => (dispatch) => {
    let request = "action=resumecamera&region=confctrl";
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function (data) {
        let tObj = eval("(" + data + ")");
        callback(tObj.state);
    }).catch(function (error) {
        promptForRequestFailed();
    });
}
//
export const getcmrnameandnumber = (callback) => (dispatch) => {
    let request = "action=getcmrnameandnumber&region=confctrl";
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function (data) {
        let tObj = eval("(" + data + ")");
        callback(tObj);
    }).catch(function (error) {
        promptForRequestFailed();
    });
}

// 设置全局会议状态
export const setGlobalConfInfo = (globalConfInfo) => {
    return {
        type: 'SET_GLOBAL_CONF_INFO',
        globalConfInfo: globalConfInfo
    }
}

// 获取全局的会议状态
export const getGlobalConfInfo = (callback) => (dispatch) => {
    let request = "action=getglobalconfinfo"
    actionUtil.handleGetRequest(request).then(function (data) {
        let _data = JSON.parse(data).data
        dispatch(setGlobalConfInfo(_data))
        if(callback) {
            callback(_data)
        }
    })
}


// 演示相关
export const setPreState = (preState) => {
    return {
        type: 'SET_PRE_STATE',
        preState: preState
    }
}
export const getPreState = (callback) => (dispatch) => {
    let request = 'action=getpresentationstate'
    actionUtil.handleGetRequest(request).then(function(data) {
        let _data = JSON.parse(data).data
        dispatch(setPreState(_data))
    })
}


















/******************** SFU 版本 ********************************************/


// 判断是否是SFU会议  不稳定..
// export const issfuconf = () => (dispatch) => {
//     let request = 'action=issfuconf&region=webservice'
//     request += "&time=" + new Date().getTime();
//     actionUtil.handleGetRequest(request).then(function(data) {
//         console.log(data)
//     })
// }
// 设置 msfurole
export const set_msfurole = (role) => {
    return {
        type: 'SET_MSFUROLE',
        role: role
    }
}

//  获取 msfurole
export const getsfuconfmyrole = (cb, n = 0) => (dispatch) => {
    if(n > 4) {
        dispatch(set_msfurole(-1))
        if(cb) {
            cb(-1)
        }
        return false
    }
    let request = "action=getsfuconfmyrole&region=webservice"
    request += "&time=" + new Date().getTime()
    actionUtil.handleGetRequest(request).then(function(data) {
        data =  eval("(" + data + ")");
        if(data.res == 'success') {
            dispatch(set_msfurole(data.role))
            if(cb) {
                cb(data.role)
            }
        } else {
            setTimeout(() => {
                dispatch(getsfuconfmyrole(cb, ++n))
            }, 300);
        }
    })
}

// 全场静音或取消全场静音
export const mutesfuallaudio = (ismute) => (dispatch) => {
    //ismuted=0 取消全场静音  ismuted=1 全场静音
    let request = "action=mutesfuallaudio&region=webservice&ismuted="+ismute
    actionUtil.handleGetRequest(request).then(function(data) {})
}

// 获取SFU会议成员列表信息
export const getsfuconfinfo = () => (dispatch) => {
    let request = "action=getsfuconfinfo&region=webservice"
    actionUtil.handleGetRequest(request).then(function(data) {
        data = JSON.parse(data)
        dispatch({type: 'SET_SFU_MEETINGINFO', info: data.meetingInfo})
    })

}

// 锁定/解锁 sfu会议
export const locksfuconf = (islock, cb) => (dispatch) => {
    // islock  0 : 解锁; 1: 锁定;
    let request = "action=locksfuconf&region=webservice&islock="+islock
    actionUtil.handleGetRequest(request).then(function(data) {
    })
}

// 静音/取消静音 单独成员线路

export const mutesfumemberaudio = (ismuted, number) => (dispatch) => {
    // ismuted 1: 静音 0: 取消静音
    // number 成员号码
    let request = "action=mutesfumemberaudio&region=webservice&number="+number+"&ismuted="+ismuted
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data) {
    })
}

// 踢出成员
export const kicksfumember = (number) => (dispatch) => {
    // number 成员号码
    let request = "action=kicksfumember&region=webservice&number="+number
    actionUtil.handleGetRequest(request).then(function(data) {})
}

// 授予主持人
export const transfersfuhost = (number) => (dispatch) => {
    // number 成员号码
    let request = "action=transfersfuhost&region=webservice&number="+number
    actionUtil.handleGetRequest(request).then(function(data) {})
}

// 获取可被转让为主持人的信息列表
export const getsfutransferablelist = (cb) => (dispatch) => {
    let request = "action=getsfutransferablelist&region=webservice"
    actionUtil.handleGetRequest(request).then(function(data) {
        let _data = JSON.parse(data)
        if(_data.res == 'success') {
            cb(_data.transferableHostList)
        }
    })
}

// 获取视频布局列表

export const getsfuvideolayoutlist = (cb) => () => {
    let request = "action=getsfuvideolayoutlist&region=webservice"
    actionUtil.handleGetRequest(request).then(function(data) {
        let _data = JSON.parse(data)
        if(_data.res == 'success') {
            cb(_data.displayList)
        }
    })
}

// 开始录像

export const startconfrecording = (sources) => () => {
    let request = 'action=startconfrecording&source=' + sources + '&region=webservice'
    actionUtil.handleGetRequest(request).then(function(data) {
        // let _data = JSON.parse(data)
        // if(_data.res == 'success') {
        //     cb(_data.displayList)
        // }
    })
}

// 邀请 sfu成员

export const invitesfumember = (number) => () => {
    let request = 'action=invitesfumember&region=webservice&number=' + number
    actionUtil.handleGetRequest(request).then(function(data) {
        // let _data = JSON.parse(data)
        // if(_data.res == 'success') {
        //     cb(_data.displayList)
        // }
    })
}