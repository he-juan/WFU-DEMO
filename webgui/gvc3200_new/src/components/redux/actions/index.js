
import $ from 'jquery'
import * as actionUtil from './actionUtil'
import * as Store from '../../entry'
/**********************************************************************/
/****************************** actions *******************************/
/**********************************************************************/


export const setMaxAcctNum = (value) => (dispatch) => {
    dispatch({type: 'SET_MAX_ACCT_NUM', maxAcctNum: value})
}



export const setDialineInfo = (line, acctindex, acct, isvideo, name, num) => (dispatch) => {
    //0~8 - represent the status of line
    dispatch({type: 'DIAL_LINE_INFO', lineInfo: {line: line, acctindex: acctindex, acct: acct, isvideo: isvideo, name: name, num: num}})
}

export const setSpeakerTestStatus = (status) => (dispatch) => {
    dispatch({ type: 'SPEAKER_TEST_STATUS', speakerteststatus:  status})
}

export const setResetKeyTestStatus = (status) => (dispatch) => {
    dispatch({ type: 'RESETKEY_TEST_STATUS', resetkeyteststatus:  status})
}

export const setDndModeStatus = (status) => (dispatch) => {
    dispatch({ type: 'DND_MODE_STATUS', dndstatus:  status})
}

/**********************************************************************/
/***************************** requests *******************************/
/**********************************************************************/


const promptForRequestFailed = () => (dispatch) => {
    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
}

//################## global #################//

export const getUserType = (callback) => (dispatch) => {
    let request = 'action=getusertype';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let usertype = msgs.headers['user'];
        dispatch({type: 'REQUEST_USER_TYPE', userType: usertype});
        callback(usertype);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getdevicestatus = (callback) => (dispatch) => {
    let request = 'action=devicestatus';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let usertype = msgs.headers['status'];
        callback(usertype);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getMenuList = (callback) => (dispatch) => {
    let request = 'action=getmenu';

    actionUtil.handleGetRequest(request).then(function(data) {
        let menu = [];
        let tObj = JSON.parse(data);
        if (tObj !== undefined && tObj['menu'] !== undefined) {
            menu = tObj['menu'];
        }
        dispatch({type: 'REQUEST_GET_MENU', menuList: menu});
        callback(menu);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getFxoexit = () => (dispatch) => {
    let request = 'action=fxoexist';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let fxoexist = msgs.headers['fxoexist'];
        dispatch({type: 'REQUEST_GET_FXOEXIT', fxoexistState: fxoexist});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getVendor = (callback) => (dispatch) => {
    let request = 'action=vendor';
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let vendor = msgs.headers['vendor'];
        callback(msgs)
        dispatch({type: 'REQUEST_GET_VENDOR', vendor: vendor});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getProduct = () => (dispatch) => {
    let request = 'action=productinfo&time=' + new Date().getTime();
    actionUtil.handleSyncRequest(request, (data) => {
        let msgs = actionUtil.res_parse_rawtext(data);

        if (msgs.headers['product']) {
            dispatch({type: 'REQUEST_GET_PRODUCT', product: msgs.headers['product']});
            dispatch({type: 'REQUEST_GET_PRODUCTSTR', productStr: msgs.headers['product']});
            dispatch({type: 'REQUEST_GET_VENDOR', vendor: msgs.headers['vendor']});
        }
    })
}

export const getColorExit= () => (dispatch) => {
    let request = 'action=coloreExist&time=' + new Date().getTime();
    actionUtil.handleSyncRequest(request, (data) => {
        let msgs = actionUtil.res_parse_rawtext(data);
        let oemId = msgs.headers['coloreexist'];
        dispatch({type: 'REQUEST_GET_COLOREXIT', oemId: oemId});
    })
}

export const cbLogin = (callback) => (dispatch) => {
    let request = 'action=loginrealm&time=' + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}
export const cbLoginRealm = (username, md5pass, callback) => (dispatch) => {
    let request = "action=login&Username=" + encodeURIComponent(username) + "&Secret=" + encodeURIComponent(md5pass) + "&t=sha&src=web";

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const changePwd = (adminpwd,userpwd,callback) =>(dispatch)=>{
    let request
    if(adminpwd==""){
        request = 'action=changedefaultpwd&userpwd='+encodeURIComponent(userpwd);
    }else if(userpwd==""){
        request = 'action=changedefaultpwd&adminpwd='+encodeURIComponent(adminpwd);
    }
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs)
    }).catch(function(error) {
        promptForRequestFailed();
    })
}
export const checkLockout = (callback) => (dispatch) => {
    let request = "action=checklockout";

    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const reboot = () => (dispatch) => {
    let request = 'action=reboot';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "error" &&
            msgs.headers['message'].toLowerCase() == "authentication required") {
            dispatch({type: 'PAGE_STATUS', pageStatus: 0})
        } else {
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

const checkIsApplyNeed = (dispatch) => {
    let request = "action=needapply";

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let needApply = msgs.headers['needapply'];

        var str;
        if (needApply == "1") {
            str = new Date().getTime();
        } else {
            str = "1";
        }
        dispatch({type: 'UPDATE_APPLY_BUTTON', applyButtonStatus: str});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const applyValue = (applyfunc, callback) => (dispatch) => {
    let request = 'action=applypvalue';

    //dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_applying'}});
    dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_applying'}});

    actionUtil.handleGetRequest(request).then(function(data) {
        setTimeout(() => getApplyResponse(dispatch, applyfunc), 500);
        callback();
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

/**
 * 将配置 存cookie 或 应用
 */
const getApplyResponse = (dispatch, applyfunc) => {
    let request = 'action=applypvaluersps';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let res = msgs.headers['phrebootresponse'];
        if (res == 0) {
            getAcctStatusApply(dispatch);

            saveOrRunApplyFunInCookie('run');

            setTimeout(()=>{
                dispatch({type: 'UPDATE_APPLY_BUTTON', applyButtonStatus: 0});
                dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_applying'}});
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_applysuc'}});
           },500);
        } else {
            setTimeout(()=>getApplyResponse(dispatch), 500);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

const getAcctStatusApply  = (dispatch, callback) => {
    let request = 'action=status';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        dispatch({type: 'REQUEST_GET_ACCT_STATUS', acctStatus: msgs});
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

const saveOrRunApplyFunInCookie = (type,urihead) => {
    let applyFun = Store.cookie("applyFun");
    if(!applyFun) {
        applyFun = [];
    } else {
        applyFun = JSON.parse(applyFun)
    }

    if(type == 'run') {
        for(let i=0;i<applyFun.length;i++) {
            let request = applyFun[i];
            actionUtil.handleGetRequest(request).then(function(data) {
            }).catch(function(error) {
                promptForRequestFailed();
            });
        }
        Store.cookie("applyFun",'', { path: '/', expires: 10 });
    } else if(type == 'save') {
        let everys = urihead.split('&');
        let actionType = everys[0],acctIdx = everys[1];
        //action=callforwardacct=0
        let actionTemp = actionType + '&' + acctIdx;
        let exp = new RegExp(actionTemp);
        for(var i=0,exist=0;i<applyFun.length;i++) {
            exist = applyFun[i].match(exp);
            if(exist) {
                applyFun[i] = urihead;
                break;
            }
        }
        if(!exist) {
            applyFun.push(urihead);
        }
        applyFun = JSON.stringify(applyFun);
        Store.cookie("applyFun",applyFun , { path: '/', expires: 10 });

    }

}


export const getNvrams = (nvrams, callback) => (dispatch) => {
    let request = "action=get"
    for (let i = 0; i < nvrams.length; i++) {
        request += actionUtil.build_get(i, nvrams[i]);
    }
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const putNvrams = (nvrams, values, prompt, callback) => (dispatch) => {
    let request = "action=put&flag=0"
    for (let i = 0; i < nvrams.length; i++) {
        request += actionUtil.build_put(i, nvrams[i], values[i]);
    }
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: prompt}});
            callback();
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getConnectState = () => (dispatch) => {
    let mPingtimeout = 0
    actionUtil.cb_getConnectState(mPingtimeout)
}




//################## account #################//
export const getIpvtExist = (data) => (dispatch) => {
    let ipvtExist = data["P7059"];
    dispatch({type: "GET_IPVT_EXIST", ipvtExist: ipvtExist});
}

export const cb_audio_upload = (fileext,acctIndex,callback) => (dispatch) => {
	let request = "action=converaudio&region=account&ext=" + fileext + "&acct=" + acctIndex;
	request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        //dispatch({type: "REQUEST_GET_READ_CONFIG", hideConfig: msgs});
        var response = msgs.headers['response'];

        if(response == "Success") {
            callback("a_16669","SUCCESS")
        } else {
            callback("a_16477","ERROR")
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getTonelist = (tonelist,callback) => (dispatch) => {
    let request = 'region=account&action='+tonelist;

    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getTonelistAll = (callback) => (dispatch) => {
    let request = 'action=tonelist&region=account';
    let request2 = 'action=customtone&region=account';
    Promise.all([
        actionUtil.handleGetRequest(request),
        actionUtil.handleGetRequest(request2)])
        .then((result) => {
        callback(result)
    }).catch((error) => {
        promptForRequestFailed();
    })
}

//################## callset #################//
export const readHideConfig = (callback) => (dispatch) => {
    let request = 'action=readconfig';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        //dispatch({type: "REQUEST_GET_READ_CONFIG", hideConfig: msgs});
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const writeHideConfig = (type, value) => (dispatch) => {
    let request = "";
    if(type == 2){
        request = "action=writeconfig&bsinterval=" + value;
    }else{
        /*for(let i = 0; i < value.length; i++){
            if(value[i])
                value[i] = 0;
            else
                value[i] = 1;
        }*/
        request = "action=writeconfig&calllogvisible=" + value;
    }
    actionUtil.handleGetRequest(request).then(function(data) {
        if (actionUtil.cb_if_is_fail(msgs)) {
            // send notice action
        } else {
            // send notice action
            checkIsApplyNeed();
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}


//################## sysset #################//





const cb_get_import_response = (callback) => (dispatch) => {
    let request = 'action=importlanrsps';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        var response = msgs.headers["importlanrsps"];
        if (response == -1) {
            setTimeout(cb_get_import_response(), 3000);
        } else {
            if (response == 0) {
                //notice failed;
            } else {
                //notice success;
                callback();
            }
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_get_wifiresult = (callback) => (dispatch) => {
    let request = "action=wifiscan";

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")")
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_get_wifilist = (start, callback) => (dispatch) => {
    let request = "action=getwifilist&start=" + start;

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")")
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_connect_wifi = (wifidata, callback) => (dispatch) => {
    let request = "action=connectwifi";
    for(let i in wifidata){
        if(wifidata[i].value == undefined)
            wifidata[i].value = "";
        request += "&" + wifidata[i].name + "=" + wifidata[i].value;
    }

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")")
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_connectsaved_wifi = (networkid, callback) => (dispatch) => {
    let request = "action=connectsavedwifi&networkid=" + networkid;

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")")
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_forget_wifi = (networkid, callback) => (dispatch) => {
    let request = "action=forgetwifi&networkid=" + networkid;

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")")
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_disconnect_wifi = (callback) => (dispatch) => {
    let request = "action=disconnectwifi";

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")")
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}


export const updateLights = () => (dispatch) => {
    let request = "action=updatelights";

    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getCounCodeStatus = (callback) => (dispatch) => {
    let request = "action=countrycodestatus";

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")");
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getBluetoothState = (callback) => (dispatch) => {
    let request = "action=getbluetoothstate";

    actionUtil.handleGetRequest(request).then(function(data) {
        dispatch({type: 'GET_BLUETOOTH_STATUS', bluetooth: data})
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const setBluetoothState = (enabled,callback) => (dispatch) => {
    let request = "action=setbluetoothstate&enabled=" + enabled;

    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getDiscoverableEnable = (callback) => (dispatch) => {
    let request = "action=getdiscoverable";

    actionUtil.handleGetRequest(request).then(function(data) {
        dispatch({type: 'GET_DISCOVERABLE_STATUS', discoverable: data});
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const setDiscoverableEnable = (enabled, timeout, callback) => (dispatch) => {
    let request = "action=setdiscoverable&enabled=" + enabled;
    if(enabled == 1){
        request += "&timeout=" + timeout;
    }
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getPairedBluetooth = (callback) => (dispatch) => {
    let request = "action=getpairedbluetooth";

    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getDiscoverableTimeout = (callback) => (dispatch) => {
    let request = "action=getDiscoverableTimeout";
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const setbtname = (name, callback) => (dispatch) => {
    let request = "action=setbtname&name=" + encodeURIComponent(name);
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const unpairbluetooth = (address, callback) => (dispatch) => {
    let request = "action=unpairbluetooth&address=" + address;
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}





//################## sysset #################//

export const getMaxVolume = () => (dispatch) => {
    let request = "action=getmaxvol&voltype=1";
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")");
        if (tObj['res'] == 'success') {
            dispatch({type: 'GET_MAX_VOLUME', maxVolume: tObj['vol']});
        } else {
            dispatch({type: 'GET_MAX_VOLUME', maxVolume: 8});
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getLightBrightness = (callback) => (dispatch) => {
    let request = "action=getLightBrightness";
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")");
        dispatch({type: 'GET_LIGHT_BRIGHTNESS', lightBrightness: tObj});
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const openLight = (value) => (dispatch) => {
    let request = 'action=openLight&color='+value;
    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const closeLight = () => (dispatch) => {
    let request = 'action=closeLight';
    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const setLightBrightness = (id, value) => (dispatch) => {
    let request = 'action=setLightBrightness&color='+id+'&brightness='+value;
    actionUtil.handleGetRequest(request).then(function(data) {

    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const getCurVolume = (callback) => (dispatch) => {
    let request = "action=getcurrentvol&voltype=1";
    actionUtil.handleSyncRequest(request,(data) => {
        let tObj = eval("(" + data + ")");
        if (tObj['res'] == 'success') {
            dispatch({type: 'GET_CUR_VOLUME', curVolume: tObj['vol']});
            callback(tObj['vol']);
        } else {
            dispatch({type: 'GET_CUR_VOLUME', curVolume: 4});
        }
    });
}

export const setVolume = (vol) => (dispatch) => {
    let request = "action=setvolume&voltype=1&vol=" + vol;
    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}


//################## sysapp  #################//
export const putmpkext = (extindex,nametype,fromserv,callback) => (dispatch) => {
    if(typeof fromserv == 'boolean') {
        fromserv = Number(fromserv)
    } else if (typeof fromserv == 'number' && isNaN(fromserv)) {
        fromserv = '0'
    } else if (fromserv == undefined){
        fromserv = ""
    }
    let request = "action=putmpkext&extIndex="+extindex+"&nametype="+nametype+"&fromserv="+fromserv;
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data)
    }).catch(function(error) {
        promptForRequestFailed();
    });
}


export const getBlf = (extindex,callback) => (dispatch) => {
    let request = "action=getblf&mpkindex=" + extindex;
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data)
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const check_mpk_exist = (type, id, name, acct, mode,idIndex,extindex,blfValues,callTr,save_func) => (dispatch) => {
    let request;
    request = "action=getmpkexist&number=" + encodeURIComponent(id) + "&account=" + acct + "&mode=" + mode + "&name=" + encodeURIComponent(name);
    if( type == "edit" )
        request += "&index=" + id;
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data) {
        if( data == 0 ){
            cb_put_blf_data(type, id, name, acct, mode,idIndex,extindex,blfValues,callTr,save_func);
        } else {
            if(data == 1){
                //dispatch({type: 'NOTICE_CHANGE', changeNotice: [callTr("a_blfexist"),{backgroundColor:'red',color:'white'}]})
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: "a_blfexist"}});
            }
            else if(data == 2) {
                //dispatch({type: 'NOTICE_CHANGE', changeNotice: [callTr("a_mpkblacklist"),{backgroundColor:'red',color:'white'}]})
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: "a_mpkblacklist"}});
            }
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

const cb_put_blf_data = (type, newid, newname, newacct, newmode,idIndex,extindex,blfValues,callTr,save_func) => {
    let request = "action=putblf&extIndex=" + extindex + "&type=" + type + "&mode=" + newmode + "&acct=" + newacct + "&name=" + encodeURIComponent(newname) + "&id=" + encodeURIComponent(newid);
    if( type == "edit" ) {
        request += "&index=" + blfValues.Data[idIndex].id;
    } else {
    	request += "&index=-1";
    }
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data) {
        save_func()
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_blf_delete = (extindex,dataId,selectedRowKeys,blfValuesData,callback) => (dispatch) =>{
    for(var i=0; i<dataId.length; i++) {
        var urihead = "action=putblf&type=delete&index=" + dataId[i].id + "&extIndex=" + extindex;
		urihead += "&time=" + new Date().getTime();
		$.ajax ({
    		type: 'get',
    		async: false,
    		url:'/manager',
    		data:urihead,
    		dataType:'text',
    		success:function(data) {
                callback(dataId[i]);
    		},
    		error:function(xmlHttpRequest, errorThrown) {
        		cb_networkerror(xmlHttpRequest, errorThrown);
    		}
		});
    }

}


export const cb_get_down_response = (flag,cb_alert_response) => (dispatch) => {
    var urihead = "action=phbkresponse";
    urihead += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(urihead).then(function(data) {
        cb_get_response_done(data,flag,cb_alert_response);
    }).catch(function(error) {
        // send error message notice
    });
}

const cb_get_response_done = (data,flag,cb_alert_response) => {
    var msgs = actionUtil.res_parse_rawtext(data);
    actionUtil.cb_if_is_fail(msgs);
    cb_alert_response(msgs,flag);
}

export const deleteVpkValues = (items,flag, callback) => (dispatch) => {
    let uritail = "";
    uritail = '&matchCallNumIp='+items[0]['pvalue']+'&vpkacctval='+items[1]['pvalue']+'&vpkdtmf='+items[2]['pvalue']+'&vpkmodeval='+items[3]['pvalue']+'&vpkname='+items[4]['pvalue']+'&vpkuserid='+items[5]['pvalue'];
    flag = (flag == 0 || flag == 1)?flag:0;
    let request = "action=deletevpk&flag=" + flag + uritail;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_del_ok'}});
            //checkIsApplyNeed(dispatch);
            dispatch({type: 'UPDATE_APPLY_BUTTON', applyButtonStatus: new Date().getTime()});
            callback();
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const setVpkValues = (items, values, flag, key,keyMode, getVpkValues,vpkOrder,ModeChange) => (dispatch) => {
    let uritail = "",itemVal;
    for (let i = 0; i < items.length; i++) {
        if(key < 10) {
            itemVal = values[items[i].name.slice(0,-1)]
        } else {
            itemVal = values[items[i].name.slice(0,-2)]
        }

        uritail += actionUtil.build_put(i, items[i].pvalue, itemVal);
    }

    flag = (flag == 0 || flag == 1)?flag:0;

    let request = "action=put&flag=" + flag + uritail;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_7479'}});
            checkIsApplyNeed(dispatch);
            getVpkValues(vpkOrder);
            keyMode == "17" && ModeChange("17");
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}



export const getVpkOrder = () => (dispatch) => {
    let vpkOrder = [];
    let request = 'action=getvpkorder';
    $.ajax ({
        type: 'get',
        url: '/manager',
        data: request,
        async: false,
        dataType: 'text',
        cache: false,
        success: function(data) {
            let msgs = JSON.parse(data)
            if(msgs.response == "success")
                vpkOrder = msgs.order.split(',');
        }.bind(this),
        error: function(xmlHttpRequest, errorThrown) {
            promptForRequestFailed();
        }
    });
    return vpkOrder;
}

export const updateVpkOrder = (nvramindex,orderindex) => (dispatch) => {
    let request = 'action=updatevpkorder&nvramindex='+nvramindex+'&orderindex='+orderindex;
    $.ajax ({
        type: 'get',
        url: '/manager',
        data: request,
        async: false,
        dataType: 'text',
        cache: false,
        success: function(data) {
            //let msgs = JSON.parse(data)
            //vpkOrder = msgs.order.split(',');
        }.bind(this),
        error: function(xmlHttpRequest, errorThrown) {
            promptForRequestFailed();
        }
    });
}

export const updateMpkOrder = (value,changeValue) => (dispatch) => {
    let request = 'action=putmpkorder&extIndex=0&from='+value+'&to='+changeValue
    request += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url: '/manager',
        data: request,
        async: false,
        dataType: 'text',
        cache: false,
        success: function(data) {

        }.bind(this),
        error: function(xmlHttpRequest, errorThrown) {
            promptForRequestFailed();
        }
    });
}

export const get_norrecordinglist = (callback) => (dispatch) => {
    let request = 'action=recording&region=maintenance&type=getnorrecordinglist';

    actionUtil.handleGetRequest(request).then(function(data) {
        let norrecordinglist = [];
        if( data.substring(0, 1) == "{" )
        {
            var json = eval("(" + data + ")");
            norrecordinglist = json.Data;
        }
        callback(norrecordinglist);
        dispatch({type: 'REQUEST_GET_NORRECORDINGLIST', norrecordinglist: norrecordinglist});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}


export const get_renameRecord = (requestUri, callback) => (dispatch) => {
    let request = 'action='+requestUri;
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

export const get_recordingNotify = (requesturi) => {
    let request = 'action='+requesturi;
    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}



export const getPlayRecord = (requestplay, callback) => (dispatch) => {
    let request = 'action='+requestplay;
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_downRecord = (requestdown) => (dispatch) => {
    let request = 'action='+requestdown;
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            var msg = msgs.headers['msg'];
            if (msg == "Playing") {
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_downloaderror'}});
            } else {
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_3315'}});
            }
        } else {
            window.location.href = "/records?time=" + new Date().getTime();
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}



export const ftprecordingupdate = () => (dispatch) => {
    let request = "action=ftprecordingupdate";
    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}



export const addNewBlackMember = (numbers, names,callback) => (dispatch) => {
    let request = 'action=addnewblackmember&region=webservice&numbers=' + encodeURIComponent(numbers) + "&notes=" + encodeURIComponent(names);
    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        if (tObj.res == "success"){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_backlistsuc'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_7363'}});
        }
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const get_Blacklist = (type,callback) => (dispatch) => {
    let request = 'action=sqlitecontacts&type=blacklist&blacktype=' + type;
    actionUtil.handleGetRequest(request).then(function(data) {
        var blackItemdata = [];
        var json;
        var distype;
        var stateInfo;
        if( data.substring(0, 1) == "{" )
        {
            json = eval("(" + data + ")");
            blackItemdata = json.Data;
        }
        if ( type == "history" ) {
            distype = 'REQUEST_GET_INTERCEPTLOG';
            stateInfo = 'interceptItemdata';
        } else {
            distype = 'REQUEST_GET_BLACKLIST';
            stateInfo = 'blacklistItemdata';
        }
        dispatch({type: distype, [stateInfo]: blackItemdata});
        if(callback){
            callback(blackItemdata);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const addNewWhiteMember = (numbers, names,callback) => (dispatch) => {
    let request = 'action=addnewwhitemember&region=webservice&numbers=' + encodeURIComponent(numbers) + "&notes=" + encodeURIComponent(names);
    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        if (tObj.res == "success"){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_whitelistsuc'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_7363'}});
        }
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

//################## Detection #################//
export const diagnosePem = (callback) => (dispatch) => {
    let request = 'action=diagnosepem';
    actionUtil.handleGetRequest(request).then(function(data){
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error){
        promptForRequestFailed();
    })
}

export const getThirdapplist = () => (dispatch) => {
    let request = 'action=getthirdapplist';
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        let thirdapplist = tObj.list;
        dispatch({type: 'REQUEST_GET_THIRDAPPLIST', thirdapplist: thirdapplist});
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const audioloopTest =(mode, micIndex, callback) => (dispatch) => {
    let request ;
    if(mode == 'play') {
        request =  'action=audiolooptest&mode=' + mode + '&mic=' + micIndex;
    }else{
        request =  'action=audiolooptest&mode=' + mode ;
    }
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error) {
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
        dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: "a_9348"}})
    });
}

export const speakertest =(mode, callback) => (dispatch) => {
    let request =  'action=speakertest&mode=' + mode;
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error) {
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
        dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: "a_9348"}})
    });
}


export const resetkeytest =(mode, callback) => (dispatch) => {
    let request =  'action=resetkeytest&mode=' + mode;
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const Start_Backupcontent = (config, callhistory, contacts, callback) => (dispatch) => {
    let request = 'action=startbackup&config=' + config + '&callhistory=' + callhistory + '&contacts=' + contacts;
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const Get_backupinfo = (callback) => (dispatch) => {
    let request = 'action=getbackupinfo';
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const handle_Deletebackup = (callback) => (dispatch) => {
    let request = "action=deletebackup";
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data)
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const handle_Recoverbackup = (callback) => (dispatch) => {
    let request = "action=recoverbackup";
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getDndMode = (callback) => (dispatch) => {
    let request = 'action=isDNDOn';
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

/**
 * @param value 1:open dnd  2:close dnd
 * @param mode  1:dnd  2.lock
 * @param callback
 */
export const setDndMode = (value, mode, callback) => (dispatch) => {
    let request;
    if (mode == "0") {
        request = "action=setdndonoroff&region=confctrl&setdnd=" + value + "&account=0";
    }else{
        request = "action=setdndonoroff&region=confctrl&setdnd=" + value + "&account=0&dndtype=" + mode;
    }
    actionUtil.handleGetRequest(request).then(function (data) {
        let tObj = JSON.parse(data);
        callback(data)
    }).catch(function (error) {
        promptForRequestFailed();
    });
}














export * from './actions.common'
export * from './actions.account'
export * from './actions.applications'
export * from './actions.calls'
export * from './actions.callset'
export * from './actions.deviceControl'
export * from './actions.maintenance'
export * from './actions.networkSettings'
export * from './actions.phoneSettings'
export * from './actions.status'
export * from './actions.systemSettings'
