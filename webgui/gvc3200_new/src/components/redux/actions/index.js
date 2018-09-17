
import $ from 'jquery'
import * as actionUtil from './actionUtil'
import * as Store from '../../entry'
/**********************************************************************/
/****************************** actions *******************************/
/**********************************************************************/

// export const setCurLocale = (cur_locale) => (dispatch) => {
//     dispatch({type: 'LOCALE_CHANGE', curLocale: cur_locale})
// }

export const promptMsg = (type, label) => (dispatch) => {
    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: type, content: label}})
}

export const promptSpinMsg = (spinStyle, spinTip) => (dispatch) => {
    dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: spinStyle, spinTip: spinTip}})
}

export const progressMessage = (percent, display, text) => (dispatch) => {
    dispatch({type: 'MSG_PROGRESS', progressMsg: {percent: percent, display:display, text:text}})
}

export const setUploadStatus = (status) => (dispatch) => {
    dispatch({type: 'UPLOAD_STATUS', uploadStatus: {status:status}})
}

export const setCurAccount = (acctIndex) => (dispatch) => {
    dispatch({type: 'ACCOUNT_CHANGE', curAccount: acctIndex})
}

export const setPageStatus = (page) => (dispatch) => {
    dispatch({type: 'PAGE_STATUS', pageStatus: page})
}

export const jumptoTab = (num) => (dispatch) => {
    dispatch({type: 'TAB_ACTIVE_KEY_CHANGE', TabactiveKey: num})
}

export const passTipStyle = (style) => (dispatch) => {
    dispatch({type: 'CHANGE_PWD_STYLE', passtipStyle: style})
}

export const changeTabKeys = (current, openKeys) => (dispatch) => {
    dispatch({type: 'CHANGE_TAB_KEYS', changetabKeys: {current:current, openKeys:openKeys}})
}

export const setHashChange = (value) => (dispatch) => {
    dispatch({type: 'HASH_CHANGE', hashChange: value})
}

export const setCurMenu = (value) => (dispatch) => {
    dispatch({type: 'CUR_MENU_CHANGE', curMenu: value})
}

export const setTabKey = (value) => (dispatch) => {
    dispatch({type: 'TAB_KEY_CHANGE', curTabKey: value})
}

export const updateMainHeight = (value) => (dispatch) => {
    dispatch({type: 'HEIGHT_CHANGE', mainHeight: value})
}

export const enterPageSaving = (value) => (dispatch) => {
    dispatch({type: 'ENTER_SAVING', enterSave: value})
}

export const setLogcat = (value) => (dispatch) => {
    dispatch({type: 'REQUEST_GET_LOGCAT_FILE', logcatFile: value})
}

export const setMaxAcctNum = (value) => (dispatch) => {
    dispatch({type: 'SET_MAX_ACCT_NUM', maxAcctNum: value})
}

export const showCallDialog = (value) => (dispatch) => {
    //value: "end"/"minimize"-not render  9-enter  10-leave
    dispatch({type: 'SHOW_CALL_DIALOG', callDialog: value})
}

export const setDialineInfo = (line, acctindex, acct, isvideo, name, num) => (dispatch) => {
    //0~8 - represent the status of line
    dispatch({type: 'DIAL_LINE_INFO', lineInfo: {line: line, acctindex: acctindex, acct: acct, isvideo: isvideo, name: name, num: num}})
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

export const setSpeakerTestStatus = (status) => (dispatch) => {
    dispatch({ type: 'SPEAKER_TEST_STATUS', speakerteststatus:  status})
}

export const setResetKeyTestStatus = (status) => (dispatch) => {
    dispatch({ type: 'RESETKEY_TEST_STATUS', resetkeyteststatus:  status})
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
        dispatch({type: 'REQUEST_GET_PRODUCT', product: msgs.headers['product']});
        dispatch({type: 'REQUEST_GET_PRODUCTSTR', productStr: msgs.headers['product']});
        dispatch({type: 'REQUEST_GET_VENDOR', vendor: msgs.headers['vendor']});
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

// export const getItemValues = (items, callback) => (dispatch) => {
//     let uritail = "";
//     for (var i = 0; i < items.length; i++) {
//         uritail += actionUtil.build_get(i, items[i].pvalue);
//     }
//     let request = "action=get" + uritail;

//     actionUtil.handleGetRequest(request).then(function(data) {
//         let msgs = actionUtil.res_parse_rawtext(data);
//         let values = actionUtil.pvalueToConfName(msgs, items);
//         dispatch({type: 'REQUEST_GET_ITEM_VALUE', itemValues: values});
//         callback(values);
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const setItemValues = (items, values, flag, callback) => (dispatch) => {
//     let uritail = "",itemVal;
//     for (let i = 0; i < items.length; i++) {
//         itemVal = values[items[i].name]
//         if(typeof itemVal == 'boolean') {
//             itemVal = Number(itemVal)
//         } else if (typeof itemVal == 'number' && isNaN(itemVal)) {
//             itemVal = '0'
//         } else if (itemVal == undefined){
//             itemVal = ""
//         }
//         uritail += actionUtil.build_put(i, items[i].pvalue, itemVal);
//     }
//     flag = (flag == 0 || flag == 1) ? flag : 0;

//     let request = "action=put&flag=" + flag + uritail;
//     actionUtil.handleGetRequest(request).then(function(data) {
//         let msgs = actionUtil.res_parse_rawtext(data);
//         if (actionUtil.cb_if_is_fail(msgs)) {
//             dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
//         } else {
//             dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_savesuc'}});
//             checkIsApplyNeed(dispatch);
//             callback();
//         }
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const checkIsApply = () => (dispatch) => {
//     checkIsApplyNeed(dispatch);
// }

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
        setTimeout(() => getApplyResponse(dispatch, applyfunc), 3000);
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
           },3000);
        } else {
            setTimeout(()=>getApplyResponse(dispatch), 3000);
        }
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

// export const cb_set_autoanswer = ( i ,autoanswer ) => (dispatch) => {
//     var urihead = "action=autoanswer&acct=" + i + "&value=" + autoanswer;
//     urihead += "&time=" + new Date().getTime();
//     saveOrRunApplyFunInCookie('save',urihead)
// }

// export const cb_updateautoanswerstatus = (i) => (dispatch) => {
//     var urihead = "action=updateautoanswerstatus&acct=" + i;
//     urihead += "&time=" + new Date().getTime();
//     saveOrRunApplyFunInCookie('save',urihead)
// }

// export const cb_set_callforward = ( i, type ,isbusyto, number1, isnoanswerto, number2, noanswerlimit, isdndto, number3 ) => (dispatch) => {
//     //autoTo number
//     //TimeRurl time1, time2, number1, number2
//     //Other isbusyto, number1, isnoanswerto, number2, noanswerlimit, isdndto, number3
//     var urihead = "action=callforward&acct=" + i + "&type=" + type;
//     switch (type) {
//         case 'allTo':
//             urihead += "&number="+isbusyto
//             break;
//         case 'TimeRule':
//             urihead += "&time1="+encodeURI(isbusyto)+"&time2="+encodeURI(number1)+"&number1="+isnoanswerto+"&number2="+number2
//             break;
//         case 'WorkRule':
//             urihead += "&isbusyto="+isbusyto+"&number1="+number1+"&isnoanswerto="+isnoanswerto+"&number2="+number2+"&noanswerlimit="+noanswerlimit+"&isdndto="+isdndto+"&number3="+number3
//             break;
//         default:
//             break;
//     }
//     urihead += "&time=" + new Date().getTime();
//     saveOrRunApplyFunInCookie('save',urihead);
// }

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

//################## status #################//

export const getAcctStatus = (callback) => (dispatch) => {
    getAcctStatusApply(dispatch, callback);
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

export const getNetworkStatus = () => (dispatch) => {
    let request = 'action=network&format=json';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = JSON.parse(data);
        dispatch({type: 'REQUEST_GET_NETWORK_STATUS', networkStatus: msgs})
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_action_network = (action,callback) => (dispatch) => {
    let request = 'action=' + action;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getSystemUptime = () => (dispatch) => {
    let request = 'action=uptime';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        dispatch({type: 'REQUEST_GET_SYSTEM_UPTIME', systemUptime: msgs})
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getSystemProduct = () => (dispatch) => {
    let request = 'action=product';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        dispatch({type: 'REQUEST_GET_SYSTEM_PRODUCT', systemProduct: msgs})
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getSystemPn = () => (dispatch) => {
    let request = 'action=pn';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        dispatch({type: 'REQUEST_GET_SYSTEM_PN', systemPn: msgs})
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getStorageInfo = () => (dispatch) => {
    let request = 'action=getstorageinfo';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = JSON.parse(data);
        dispatch({type: 'REQUEST_GET_STORAGE_INFO', storageInfo: msgs})
    }).catch(function(error) {
        promptForRequestFailed();
    });
}


//################## account #################//
export const getIpvtExist = (data) => (dispatch) => {
    let ipvtExist = data["P7059"];
    dispatch({type: "GET_IPVT_EXIST", ipvtExist: ipvtExist});
}

export const cb_audio_upload = (fileext,acctIndex,callback) => (dispatch) => {
	let request = "action=converaudio&ext=" + fileext + "&acct=" + acctIndex;
	request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        //dispatch({type: "REQUEST_GET_READ_CONFIG", hideConfig: msgs});
        var response = msgs.headers['response'];

        if(response == "Success") {
            callback("a_uploadsuc","SUCCESS")
        } else {
            callback("a_uploadfail","ERROR")
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

//################### calls ##################//
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

export const getAllLineStatus = (callback) => (dispatch) => {
    let request = 'action=getalllinestatus';

    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const ctrlLineMute = (line) => (dispatch) => {
    let request = "action=ctrllinemute&line=" + line;

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










// export const getTimezone = (callback) => (dispatch) => {
//     let request = 'action=gettimezone&region=advanset';
//     actionUtil.handleGetRequest(request).then(function(data) {
//         dispatch({type: 'REQUEST_GET_TIMEZONE_VALUES', timezoneValues: data});
//         callback(data);
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const saveTimeset = (value) => (dispatch) => {
//     let request = "action=savetimeset&timezone=" + value;
//     actionUtil.handleGetRequest(request).then(function(data) {
//         let msgs = actionUtil.res_parse_rawtext(data);
//         if (actionUtil.cb_if_is_fail(msgs)) {
//             // send notice action
//         } else {
//             // send notice action
//             //dispatch({type: 'NOTICE_CHANGE', changeNotice: ["Save Successfully!", {color: '#fff', background: '#51c57d'}]});
//             checkIsApplyNeed();
//         }
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const getLanguagesValues = (callback) => (dispatch) => {
//     let request = 'action=getlanguages';

//     actionUtil.handleGetRequest(request).then(function(data) {
//         let msgs = actionUtil.res_parse_rawtext(data);
//         dispatch({type: 'REQUEST_GET_LANGUAGES_VALUES', languagesValues: msgs});
//         callback(msgs);
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const putLanguage = (value) => (dispatch) => {
//     var lancts = value.split("_");
//     let request = "action=putlanguage&lan=" + lancts[0] + "&country=" + lancts[1];
//     actionUtil.handleGetRequest(request).then(function(data) {
//         let msgs = actionUtil.res_parse_rawtext(data);
//         if (actionUtil.cb_if_is_fail(msgs)) {
//             // send notice action
//         } else {
//             // send notice action
//             //dispatch({type: 'NOTICE_CHANGE', changeNotice: ["Save Successfully!", {color: '#fff', background: '#51c57d'}]});
//             checkIsApplyNeed();
//         }
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }



export const cb_put_importlan = (callback) => (dispatch) => {
    let request = 'action=importlang';

    actionUtil.handleGetRequest(request).then(function(data) {
        setTimeout(cb_get_import_response(callback), 3000);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

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

// export const getVeriCert = () => (dispatch) => {
//     let request = 'action=getvericert';

//     actionUtil.handleGetRequest(request).then(function(data) {
//         let tObj = eval("(" + data + ")")
//         dispatch({type: 'REQUEST_GET_VERI_CERT', certInfo: tObj})
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const checkVeriCert = (info, callback) => (dispatch) => {
//     let request ;
//     if(info.type == "sipCert"){
//         request = 'action=checkvericert&maxnum=' + info.maxnum + "&pvalue0=" + info.pvalue;
//     }else{
//         request = 'action=setcustomcert&pvalue='+info.pvalue;
//     }
//     actionUtil.handleGetRequest(request).then(function(data) {
//         callback(data);
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const getVpnCerts = (callback) => (dispatch) => {
//     let request = 'action=getvpncerts';

//     actionUtil.handleGetRequest(request).then(function(data) {
//         let tObj = eval("(" + data + ")");
//         callback(tObj.list);
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const getWifiCerts = (callback) => (dispatch) => {
//     let request = 'action=getwificerts';

//     actionUtil.handleGetRequest(request).then(function(data) {
//         let tObj = eval("(" + data + ")");
//         callback(tObj.list);
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const uploadAndInstallCert = (values, file, callback) => (dispatch) => {
//     let url = "../upload?type=vericert";

//     actionUtil.handleUploadCert(url, file).then(function(data) {
//         let msgs = actionUtil.res_parse_rawtext(data);
//         if(msgs.headers['response'] == "Success"){
//             cb_install_cert(values, callback);
//         }
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// const cb_install_cert = (values, callback) => {
//     let request = "action=installcert&certname=" + encodeURIComponent(values['certname']) + "&ext=" + values['ext'] +
//                   "&use=" + values['certuse'] + "&certpwd=" + encodeURIComponent(values['certpwd']);
//     actionUtil.handleGetRequest(request).then(function(data) {
//         let tObj = eval("(" + data + ")");
//         callback(tObj);
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const cb_delete_cert = (name, use, callback) => (dispatch) => {
//     let request = "action=deletecert&certname=" + encodeURIComponent(name) + "&use=" + use;
//     actionUtil.handleGetRequest(request).then(function(data) {
//         let tObj = eval("(" + data + ")");
//         callback(tObj);
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const cb_check_password = (value, callback) => (dispatch) => {
//     let g_actype = value;
//     let request = "action=checkpwd&Username=" + g_actype;

//     actionUtil.handleGetRequest(request).then(function(data) {
//         let msgs = actionUtil.res_parse_rawtext(data);
//         if (actionUtil.cb_if_is_fail(msgs)) {

//         } else {
//             callback(msgs);
//         }
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const cb_check_current_pwd = (username, inputpwd, callback) => (dispatch) => {
//     let request = "action=checkcurpwd&username=" + username + "&curpwd=" + encodeURIComponent(inputpwd);

//     actionUtil.handleGetRequest(request).then(function(data) {
//         let msgs = actionUtil.res_parse_rawtext(data);
//         if (actionUtil.cb_if_is_fail(msgs)) {
//         } else {
//             callback(msgs);
//         }
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

export const cb_get_wifiresult = (callback) => (dispatch) => {
    let request = "action=wifiscan";

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")")
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_get_wifilist = (callback) => (dispatch) => {
    let request = "action=getwifilist";

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

// export const cb_sqlite_sitename = (callback) => (dispatch) => {
//     let request = "action=sqlitedisplay&type=sitesetting&affect=read";

//     actionUtil.handleGetRequest(request).then(function(data) {
//         let tObj = eval("(" + data + ")")
//         callback(tObj.Data);
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

// export const setSitenameInfo = (paramurl, type) => (dispatch) => {
//     let request = "";
//     if(type == 1)
//         request = "action=setsitenameinfo&" + paramurl;
//     else
//         request = "action=setsitenameoffset&" + paramurl;

//     actionUtil.handleGetRequest(request).then(function(data) {
//         let tObj = eval("(" + data + ")")
//         if (tObj.res != "success") {
//             dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
//         } else {
//             dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_savesuc'}});
//         }
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

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





//################## maintenance #################//
export const getEventItems = () => (dispatch) => {
    let request = 'action=getactionurls';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        dispatch({type: 'REQUEST_GET_EVENT_ITEMS', eventItems: msgs})
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const setEventItems = (values) => (dispatch) => {
    var setEventItemsArr = [];
    var urihead = "action=putactionurls";
    for (var i in values) {
        urihead += "&";
        urihead += i;
        urihead += "=";
        (values[i]) && (values[i] = values[i].replace(/&/g, "&amp;"));
        urihead += encodeURIComponent(values[i]||'');
    }
    urihead += "&time=" + new Date().getTime();
    let request = urihead;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_savesuc'}});
            checkIsApplyNeed();
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getLogcatDown = (values,callback) => (dispatch) => {
    var request = "action=getlogcat&tag=" + ($.trim(values.logtag) || '') + "&priority=" + values.logpriority;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback();
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getLogcatfile = () => (dispatch) => {
    var request = "";

    actionUtil.handleGetLogcat(request).then(function(data) {
        dispatch({type: 'REQUEST_GET_LOGCAT_FILE', logcatFile: data});
        setTimeout(removeLogcat(), 2000);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

const removeLogcat = () => (dispatch) => {
    let request = 'action=removelogcat';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getClearLogcat = () => (dispatch) => {
    let request = 'action=clearlogcat';
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "error" &&
            msgs.headers['message'].toLowerCase() == "authentication required") {
            dispatch({type: 'PAGE_STATUS', pageStatus: 0})
        }
        if (actionUtil.cb_if_is_fail(msgs)) {
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_clearsuc'}});
            dispatch({type: 'REQUEST_GET_LOGCAT_FILE', logcatFile: ""});
            checkIsApplyNeed();
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getCapturemode = (action,callback) => (dispatch) => {
    let request = 'action='+action;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        checkIsApplyNeed();
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getRecordState = (callback) => (dispatch) => {
    let request = 'action=getrecordstate';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getDelete = (action,callback) => (dispatch) => {
    let request = 'action='+action;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "error" &&
            msgs.headers['message'].toLowerCase() == "authentication required") {
            dispatch({type: 'PAGE_STATUS', pageStatus: 0})
        } else {
        }
        if (msgs.headers['response'] != undefined && msgs.headers['response'].toLowerCase() == "error") {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_del_failed'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_del_ok'}});
        }
        checkIsApplyNeed();
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getTracelist = (callback) => (dispatch) => {
    let request = 'action=tracelist';

    actionUtil.handleGetRequest(request).then(function(data) {
        let tracelist = [];
        if( data.substring(0, 1) == "{" )
        {
            var json = eval("(" + data + ")");
            tracelist = json.Tracelist;
    	}
        dispatch({type: 'REQUEST_GET_TRACE_LIST', tracelist: tracelist});
        callback(tracelist[0]);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getCoredumplist = () => (dispatch) => {
    let request = 'action=coredumplist';

    actionUtil.handleGetRequest(request).then(function(data) {
        let coredumplist = [];
        if( data.substring(0, 1) == "{" )
        {
            var json = eval("(" + data + ")");
            coredumplist = json.Coredumplist;
    	}
        dispatch({type: 'REQUEST_GET_COREDUMP_LIST', coredumplist: coredumplist});
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getRecording = (action,callback) => (dispatch) => {
    let request = 'action='+action;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let res = msgs.headers['response'];
        callback(res);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const Screenshort = (type, value, callback) => (dispatch) => {
    let request;
    if (value) {
        request = 'action=screenshot&type=' + type + '&name=' + value;
    } else {
        request = 'action=screenshot&type=' + type;
    }

    actionUtil.handleGetRequest(request).then(function(data) {
        var json = eval("(" + data + ")");
        if ( type == "new" ) {
            callback(json);
        } if ( type == "get" ) {
            let screenList = [];
            if ( data.substring(0, 1) == "{" ) {
                var json = eval("(" + data + ")");
                screenList = json.piclist;
            }
            dispatch({type: 'REQUEST_GET_SCREEN_LIST', screenList: screenList});
            callback(screenList[0]);
        } if ( type == "delete" ) {
            if (json.response != undefined && json.response.toLowerCase() == "error") {
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_del_failed'}});
            } else {
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_del_ok'}});
            }
            callback(json);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getRecordList = (callback) => (dispatch) => {
    let request = 'action=getrecordlist';

    actionUtil.handleGetRequest(request).then(function(data) {
        let recordlist = [];
        if( data.substring(0, 1) == "{" )
        {
            var json = eval("(" + data + ")");
            recordlist = json.Records;
    	}
        dispatch({type: 'REQUEST_GET_RECORD_LIST', recordlist: recordlist});
        callback(recordlist[0]);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const start_ping = (addr,callback) => (dispatch) => {
    let request = "action=starttraceroute&addr=" + addr;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_ping_msg = (offset,callback) => (dispatch) => {
    let request = "action=gettracroutemsg&offset=" + offset;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const stop_ping = (callback) => (dispatch) => {
    let request = "action=stoptracroute";

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        callback(msgs);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getSaveConf = () => (dispatch) => {
    let request = 'action=saveconf';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            // send notice action
        } else {
            window.location.href = "/config.txt?time=" + new Date().getTime();
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_resetres_ok = (flag) => (dispatch) => {
    let request = 'action=factset&resetstyle='+flag;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {

        } else {
            Store.cookie("resetreboot", "1", { path: '/', expires: 10 });
            dispatch({type: 'PAGE_STATUS', pageStatus: 2})
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_check_provision = (upgradeall,callback) => (dispatch) => {
    let request = 'action=provisioninit&upgradeall=' + upgradeall;

    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const initUploadStatus = () => (dispatch) => {
    let request = 'action=initupstatus';

    actionUtil.handleGetRequest(request).then(function(data) {

    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const systemUpgrade = (callback) => (dispatch) => {
    let request = "action=sysupgrade&time=" + new Date().getTime();

    actionUtil.handleGetRequest(request).then(function(data) {
        callback();
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_upgrade_now = (upgradeall,callback) => (dispatch) => {
    let request = 'action=upgradenow';

    actionUtil.handleGetRequest(request).then(function(data) {
        var msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            if (upgradeall === true) {
                var result = parseInt(msgs.headers["result"]);
                if (result == 2) {
                    callback(result);
                } else {
                    result = 3;
                    callback(result);
                }
            }
        } else {
            /*if (upgradeall === true) {
                var result = 11;
                callback(result);
                return;
            }*/
            var result = parseInt(msgs.headers["result"]);
            callback(result);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const get_Importconf = (callback) => (dispatch) => {
    let request = 'action=importconf';

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let result;
        if (actionUtil.cb_if_is_fail(msgs)) {
            result = 1;
            callback(result);
        } else {
            result = 2;
            callback(result);
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const cb_set_property = (type,value) => (dispatch) => {
    let request = "action=setprop&type=" + type + "&value=" + encodeURIComponent(value);

    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

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

export const oneClickDebug = (items, callback) => (dispatch) => {
    let request = "action=oneclickdebug&mode=" + items['mode'] +
                "&syslog=" + Number(items['syslog']) +
                "&logcat=" + Number(items['logcat']) +
                "&capture=" + Number(items['capture']) +
                "&tombstone=" + Number(items['tombstone']) +
                "&anr=" + Number(items['anr']);
    if(items["acce"] != undefined){
        request += "&acce=" + Number(items['acce']);
    }
    actionUtil.handleGetRequest(request).then(function(data){
        callback(data);
    }).catch(function(error){
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

export const cb_put_port_param = (action, flag, data,portredup,portclearold,cb_import_response) => (dispatch) => {

    let urihead = "action=" + action + "&flag=" + flag + "&portReplace=" + portredup + "&portClear=" + portclearold;
    urihead += data;
    urihead += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(urihead).then(function(data) {
        if (flag == 0) { //export
            let msgs = actionUtil.res_parse_rawtext(data);
            if( actionUtil.cb_if_is_fail(msgs) )
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
            else {
                checkIsApplyNeed();
            }
        } else if(flag == 1) {     //import
            let msgs = JSON.parse(data);
            if(msgs['res'] == 'success') {
                let urihead = "action=phbkresponse";
                urihead += "&time=" + new Date().getTime();
                actionUtil.handleGetRequest(urihead).then(function(data) {
                    cb_import_response(data);
                }).catch(function(error) {
                });
            }
        }
    }).catch(function(error) {
        // send error message notice
    });
}

export const cb_save_fav = (action,portmode,cb_get_portresponse_done) => (dispatch) => {
    let urihead = "action=" + action;
    urihead += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(urihead).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        let response = msgs.headers["response"];
        if(response == "Sucess") {
            let urihead = "action=phbkresponse";
            urihead += "&time=" + new Date().getTime();
            actionUtil.handleGetRequest(urihead).then(function(data) {
                cb_get_portresponse_done(data,portmode);
            }).catch(function(error) {
                // send error message notice
            });
        }
    }).catch(function(error) {
        // send error message notice
    });

}

export const cb_get_portresponse = (mode,cb_get_portresponse_done) => (dispatch) => {
    let urihead = "action=phbkresponse";
    urihead += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(urihead).then(function(data) {
        cb_get_portresponse_done(data,mode);
    }).catch(function(error) {
        // send error message notice
    });
}

export const cb_put_download_param = (action, flag, data, downserver, downConfig, cb_alert_response) => (dispatch) => {
    let [downmode,redup,clearold] = downConfig;

    let request = "action=" + action + "&downMode=" + downmode + "&flag=" + flag + "&downUrl=" + encodeURIComponent(downserver) + "&downReplace=" + redup + "&downClear=" + clearold;
    request += data;
    request += "&time=" + new Date().getTime();
    actionUtil.handleGetRequest(request).then(function(data) {

        let msgs = JSON.parse(data);
        if(msgs['res'] == 'success') {
            if(flag == 0) {
                if( actionUtil.cb_if_is_fail(msgs) ) {
                    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
                } else {
                    dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_savesuc'}});
                    checkIsApplyNeed();
                }
            } else if(flag == 1) {
                dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_downloading'}});
                var urihead = "action=phbkresponse";
                urihead += "&time=" + new Date().getTime();
                actionUtil.handleGetRequest(urihead).then(function(data) {
                    cb_get_response_done(data,1,cb_alert_response);
                }).catch(function(error) {
                    // send error message notice
                });
            }
        }
    }).catch(function(error) {
        // send error message notice
    });
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
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_savesuc'}});
            checkIsApplyNeed(dispatch);
            getVpkValues(vpkOrder);
            keyMode == "17" && ModeChange("17");
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const saveDownContactsParams = (items, values, flag, callback,argu) => (dispatch) => {
    let uritail = "",itemVal;
    for (let i = 0; i < items.length; i++) {
        itemVal = values[items[i].name]
        if(typeof itemVal == 'boolean') {
            itemVal = Number(itemVal)
        } else if (typeof itemVal == 'number' && isNaN(itemVal)) {
            itemVal = '0'
        }
        else if(typeof itemVal == 'number' && isNaN(itemVal)){
            itemVal = ""
        }
        uritail += actionUtil.build_put(i, items[i].pvalue, itemVal);
    }

    let request = "action=put&flag=0"+ uritail;
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(argu)
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

export const get_recordinglist = (callback) => (dispatch) => {
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
        dispatch({type: 'REQUEST_GET_RECORDINGLIST', recordinglist: recordinglist});
        dispatch({type: 'REQUEST_GET_USE24HOUR', Use24Hour: Use24Hour});
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

export const get_lockRecord = (requestlock, callback) => (dispatch) => {
    let request = 'action=' + requestlock;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = JSON.parse(data);
        if (msgs['response'] == 'success') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: 'SUCCESS', content: 'a_locksuccess'}});
        }
        callback(msgs['response']);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const ftprecordingupdate = () => (dispatch) => {
    let request = "action=ftprecordingupdate";
    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        promptForRequestFailed();
    });
}

export const getContactCount = () => (dispatch) => {
    let request = 'action=getcontactcount';
    actionUtil.handleGetRequest(request).then(function(data){
        let msgs = JSON.parse(data)
        if (msgs['res'] == 'success') {
            dispatch({type: 'REQUEST_GET_CONTACTCOUNT',mContactNum: msgs['msg']});
        }
    }).catch(function(error) {
        promptForRequestFailed();
    });
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
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_63'}});
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
    let request = 'action=setgroup&region=webservice&groupInfo='+encodeURIComponent(editGroupId+':::'+groupname+':::'+ringtone)+'&format=json';
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
        request += "action=updateGroupMemberShip&id=";
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
    let request = 'action=removegroup&groupID='+groupid;
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
    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        callback(tObj.res);
    }).catch(function(error) {
        promptForRequestFailed();
    })
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

export const get_Whitelist = (type) => (dispatch) => {
    let request = 'action=sqlitecontacts&type=whitelist&whitetype=' + type;

    actionUtil.handleGetRequest(request).then(function(data) {
        var whiteItemdata = [];
        var json;
        var distype;
        var stateInfo;
        if( data.substring(0, 1) == "{" )
        {
            json = eval("(" + data + ")");
            whiteItemdata = json.Data;
        }
        if ( type == "members" ) {
            distype = 'REQUEST_GET_WHITELIST';
            stateInfo = 'whitelistItemdata';
        }
        dispatch({type: distype, [stateInfo]: whiteItemdata});
    }).catch(function(error) {
        promptForRequestFailed();
    })
}


export const removeBlacklist = (id, callback) => (dispatch) => {
    let request = 'action=delblackmember&id=' + id;
    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        if (tObj.res == "success"){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_deleteblksuc'}});
        }
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const removeWhitelist = (id, callback) => (dispatch) => {
    let request = 'action=delwhitemember&id=' + id;
    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        if (tObj.res == "success"){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_deletewhitesuc'}});
        }
        callback(tObj);
    }).catch(function(error) {
        promptForRequestFailed();
    })
}

export const editBlackMember = (id, name,callback) => (dispatch) => {
    let request = 'action=editblackmember&id=' + id + '&note=' + encodeURIComponent(name);
    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        if (tObj.res == "success"){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_edit_ok'}});
        }
        callback(tObj);
    })
}

export const editWhiteMember = (id, name,callback) => (dispatch) => {
    let request = 'action=editwhitemember&id=' + id + '&note=' + encodeURIComponent(name);
    actionUtil.handleGetRequest(request).then(function(data) {
        var tObj = eval("(" + data + ")");
        if (tObj.res == "success"){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_edit_ok'}});
        }
        callback(tObj);
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

export const getPresetInfo = (callback) => (dispatch) => {
    let request = 'action=getpresetinfo&region=control';
    actionUtil.handleGetRequest(request).then(function(res) {
        let msgs = JSON.parse(res);
        let data = msgs['Data'];
        dispatch({type: 'REQUEST_GET_PRESETINFO', presetinfo: data});
    }).catch(function(error) {
        promptForRequestFailed();
    });
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
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_63'}});
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
//             dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_63'}});
//         }
//     }).catch(function(error) {
//         promptForRequestFailed();
//     });
// }

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



export const setDndMode = (value, callback) => (dispatch) => {
    let request ="action=setdndonoroff&region=confctrl&setdnd="+value+"&account=0";
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(data)
    }).catch(function(error) {
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
