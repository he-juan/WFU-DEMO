import * as actionUtil from './actionUtil'
import {store} from '../../entry'



/**
 * 电源管理 超时操作类型获取
 */
export const getTimeoutOpt = (callback) => (dispatch) => {
    let request = 'action=gettimeoutopt&region=advanset';
    actionUtil.handleGetRequest(request).then(function(data) {
        let _data = JSON.parse(data);
        if(_data['res'] === "success") {
            callback(_data['policy']);
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/**
 * 电源管理 超时时间
 */
export const getSleepMode = (callback) => (dispatch) => {
    let request = 'action=getsleepmode&region=advanset';
    actionUtil.handleGetRequest(request).then(function(data) {
        let _data = JSON.parse(data);
        if(_data['res'] === "success") {
            callback(_data['sleepmode']);
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/**
 * 电源管理 超时操作类型设置
 */
export const setTimeoutOpt = (value) => (dispatch)  => {
    let request = "action=settimeoutopt&region=advanset&type=" + value;
    actionUtil.handleGetRequest(request).then(function(data) {
        let _data = JSON.parse(data)
        if(_data.res === 'success') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_7479'}});
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/**
 * 电源管理 超时时间设置
 */
export const setSleepMode = (value) => (dispatch)  => {
    let request = "action=setsleepmode&region=advanset&sleepmode=" + value;
    actionUtil.handleGetRequest(request).then(function(data) {
        let _data = JSON.parse(data)
        if(_data.res === 'success') {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_7479'}});
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}



/**
 * 重启关机睡眠等操作时 检测是否正在升级或在拨打电话 弹出对应的弹窗
 * @param {function} callback 根据是否在通话中 弹出不同的提示层  1 未通话，2 正在通话
 */
export const checkUpgradingOrCalling = (callback) => (dispatch) => {
    let request = "action=isupgrade";
    actionUtil.handleGetRequest(request).then(function(data) {
        let _data = JSON.parse(data)
        let isUpgrading = _data.msg === '1';   //是否正在升级系统
        if(isUpgrading) {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_19242'}});
            return false;
        }
        let isCalling = store.getState().isCalling;    // 是否正在拨打电话
        if(isCalling) {
            // 如果正在拨打则弹出层提示用户操作
            callback(2)
            return false;
        }
        // 执行下一步操作
        callback(1);

    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}




/**
 * 重启 关机 睡眠接口
 * @param {number} type 0: 重启； 1：关机； 2：睡眠；  4: 强制重启； 5： 强制关机； 6： 强制睡眠；
 */
export const sysReboot = (type, cb) => (dispatch) => {
    let request = "action=reboot&reboottype=" + type;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "error" &&
            msgs.headers['message'].toLowerCase() == "authentication required") {
            dispatch({type: 'PAGE_STATUS', pageStatus: 0})
        } else {
            if(cb) {

                cb()
            }
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}



/**
 * 获取时区
 */
export const getTimezone = (lang,callback) => (dispatch) => {
    let lan=lang=='en'?0:1
    let request = 'action=gettimezone&lang='+lan;
    actionUtil.handleGetRequest(request).then(function(data) {
        var result=JSON.parse(data)
        if(result.Response=="Success"){
            callback(result);
        }
    })
}

/**
 * 时间设置表单提交
 */
export const saveTimeset = (value) => (dispatch) => {
    let request = "action=savetimeset&timezone=" + value;
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            // send notice action
        } else {
            // send notice action
            //dispatch({type: 'NOTICE_CHANGE', changeNotice: ["Save Successfully!", {color: '#fff', background: '#51c57d'}]});
            actionUtil.checkIsApplyNeed(dispatch);
        }
    })
}


/**
 * 获取时间日期用于初始化
 */
export const getDateInfo = (callback) => (dispatch) => {
    let request = "action=getdateinfo&region=maintenance";
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data)
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

export const setDateInfo = (values) => (dispatch) => {
    let datestr = encodeURIComponent(values.date);
    let timestr = encodeURIComponent(values.time);
    let request = `action=setdateinfo&region=maintenance&datestr=${datestr}&timestr=${timestr}`;
    actionUtil.handleGetRequest(request).then(function(data) {
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });

}

/**
 * 获取语言
 */
export const getLanguagesValues = (callback) => (dispatch) => {
    let request = 'action=getlanguages';

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        if(tObj.Response=="Success")
        callback(tObj);
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/**
 * 设置语言
 */
export const putLanguage = (value,callback) => (dispatch) => {
    let request = "action=putlanguage&lan=" + value
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        if(tObj.res=="success")
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_savesuc'}});
        if(callback) {
            callback(tObj);
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}


/**  
 * 设置语言文件
*/

export const cb_put_importlan = (callback) => (dispatch) => {
    let request = 'action=importlang';

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        if(tObj.res=="success")
        callback(tObj);
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/** 
 * 按层级获取可选的语言列表
*/
export const getLocaleList = (level,localeId,callback) => (dispatch) => {
    var request
    if(localeId){
        request = 'action=getLocaleListByLevel&level='+level+'&localeId='+localeId;
    }else{
        request = 'action=getLocaleListByLevel&level='+level;
    }

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        callback(tObj);
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/** 
 * 获取是否存在自定义的语言文件
 */
export const getCustomstate = (callback) => (dispatch) => {
    let request = 'action=custLanExist';

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        if(tObj.Response=="Success")
        callback(tObj);
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}
/**
 * 删除自定义语言文件
 */
export const deleteCustom = (callback) => (dispatch) => {
    let request = "action=rmcustlan"
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = JSON.parse(data);
        if(tObj.res=="success"){
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_del_ok'}});
            callback(tObj);
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/**
 * 检测当前管理员密码是否正确
 */
export const cb_check_current_pwd = (username, inputpwd, callback) => (dispatch) => {
    let request = "action=checkcurpwd&username=" + username + "&curpwd=" + encodeURIComponent(inputpwd);

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
        } else {
            callback(msgs);
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}


export const cb_check_password = (value, callback) => (dispatch) => {
    let g_actype = value;
    let request = "action=checkpwd&Username=" + g_actype;

    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {

        } else {
            callback(msgs);
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}


/**
 *  设置锁屏密码
 */
export const saveLockPwd = (value, callback) => (dispatch) => {
    let request = "action=savelockpwd&region=advanset&newlock=" + value
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_7479'}});
            actionUtil.checkIsApplyNeed(dispatch);
            if (typeof callback === 'function') {
                callback();
            }
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/**
 * 刪除锁屏密码
 */
export const delLockPwd = () => (dispatch) => {
    let request = "action=clearlock&region=advanset";
    actionUtil.handleGetRequest(request).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if (actionUtil.cb_if_is_fail(msgs)) {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_saveapplying'}});
        } else {
            dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "SUCCESS", content: 'a_57'}});
            if (typeof callback === 'function') {
                callback();
            }
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/************ 证书管理相关　start *******************/
export const getVeriCert = () => (dispatch) => {
    let request = 'action=getvericert&region=advanset';

    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")")
        dispatch({type: 'REQUEST_GET_VERI_CERT', certInfo: tObj})
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

export const checkVeriCert = (info, callback) => (dispatch) => {
    let request ;
    if(info.type == "sipCert"){
        request = 'action=checkvericert&region=advanset&maxnum=' + info.maxnum + "&pvalue0=" + info.pvalue;
    }else{
        request = 'action=setcustomcert&region=advanset&pvalue='+info.pvalue;
    }
    actionUtil.handleGetRequest(request).then(function(data) {
        callback(data);
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

export const uploadAndInstallCert = (values, file, callback) => (dispatch) => {
    let url = "../upload?type=vericert";

    actionUtil.handleUploadCert(url, file).then(function(data) {
        let msgs = actionUtil.res_parse_rawtext(data);
        if(msgs.headers['response'] == "Success"){
            cb_install_cert(values, callback);
        }
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

const cb_install_cert = (values, callback) => {
    let request = "action=installcert&certname=" + encodeURIComponent(values['certname']) + "&ext=" + values['ext'] +
                  "&use=" + values['certuse'] + "&certpwd=" + encodeURIComponent(values['certpwd']);
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")");
        callback(tObj);
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

export const cb_delete_cert = (name, use, callback) => (dispatch) => {
    let request = "action=deletecert&certname=" + encodeURIComponent(name) + "&use=" + use;
    actionUtil.handleGetRequest(request).then(function(data) {
        let tObj = eval("(" + data + ")");
        callback(tObj);
    }).catch(function(error) {
        console.error(error)
        dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
    });
}

/************ 证书管理相关　end *******************/

