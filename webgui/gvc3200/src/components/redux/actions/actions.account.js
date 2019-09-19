
import $ from 'jquery'
import * as actionUtil from './actionUtil'
import * as Store from '../../entry'



/**
 * 存cookie 或 应用
 */
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
                console.log(error)
                dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_16418'}});
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

/**
 * 自动应答设置
 */
export const cb_set_autoanswer = ( i ,autoanswer ) => (dispatch) => {
    var urihead = "action=autoanswer&region=account&acct=" + i + "&value=" + autoanswer;
    urihead += "&time=" + new Date().getTime();
    saveOrRunApplyFunInCookie('save',urihead)
}

/**
 * ？
 */
export const cb_updateautoanswerstatus = (i) => (dispatch) => {
    var urihead = "action=updateautoanswerstatus&region=account&acct=" + i;
    urihead += "&time=" + new Date().getTime();
    saveOrRunApplyFunInCookie('save',urihead)
}

/**
 * 呼叫转移设置
 */
export const cb_set_callforward = ( i, type ,isbusyto, number1, isnoanswerto, number2, noanswerlimit, isdndto, number3 ) => (dispatch) => {
    //autoTo number
    //TimeRurl time1, time2, number1, number2
    //Other isbusyto, number1, isnoanswerto, number2, noanswerlimit, isdndto, number3
    var urihead = "action=callforward&region=account&acct=" + i + "&type=" + type;
    switch (type) {
        case 'allTo':
            urihead += "&number="+isbusyto
            break;
        case 'TimeRule':
            urihead += "&time1="+encodeURI(isbusyto)+"&time2="+encodeURI(number1)+"&number1="+isnoanswerto+"&number2="+number2
            break;
        case 'WorkRule':
            urihead += "&isbusyto="+isbusyto+"&number1="+number1+"&isnoanswerto="+isnoanswerto+"&number2="+number2+"&noanswerlimit="+noanswerlimit+"&isdndto="+isdndto+"&number3="+number3
            break;
        default:
            break;
    }
    urihead += "&time=" + new Date().getTime();
    saveOrRunApplyFunInCookie('save',urihead);
}
