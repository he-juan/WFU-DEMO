import * as actionUtil from './actionUtil'
import {store} from '../../entry'

const promptForRequestFailed = () => (dispatch) => {
  dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_neterror'}});
}



export const getAcctStatus = (callback) => (dispatch) => {
  let request = 'action=status';

  actionUtil.handleGetRequest(request).then(function(data) {
      let msgs = actionUtil.res_parse_rawtext(data);
      dispatch({type: 'REQUEST_GET_ACCT_STATUS', acctStatus: msgs});
      callback(msgs);
  }).catch(function(error) {
      promptForRequestFailed();
  });
}


export const getNetworkStatus = (cb) => (dispatch) => {
  let request = 'action=network&region=status';

  actionUtil.handleGetRequest(request).then(function(data) {
      let msgs = JSON.parse(data);
      dispatch({type: 'REQUEST_GET_NETWORK_STATUS', networkStatus: msgs})
      if(cb) {
        cb(msgs)
      }
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



//  外围设备状态

export const gethdmiinstate2 = (cb) => () => {
  let request = 'action=gethdmiinstate&region=status&time=' + new Date().getTime()

  actionUtil.handleGetRequest(request).then(function(data) {
    cb(JSON.parse(data))
  })
}

export const gethdmi1state2 = (cb) => () => {
  let request = 'action=gethdmi1state&region=status&time=' + new Date().getTime()

  actionUtil.handleGetRequest(request).then(function(data) {
    cb(JSON.parse(data))
  })
}

export const gethdmi2state2 = (cb) => () => {
  let request = 'action=gethdmi2state&region=status&time=' + new Date().getTime()

  actionUtil.handleGetRequest(request).then(function(data) {
    cb(JSON.parse(data))
  })
}

export const getusbstate2 = (cb) => () => {
  let request = 'action=getusbstate&region=status&time=' + new Date().getTime()

  actionUtil.handleGetRequest(request).then(function(data) {
    cb(JSON.parse(data))
  })
}

export const getsdcardstate2 = (cb) => () => {
  let request = 'action=getsdcardstate&region=status&time=' + new Date().getTime()

  actionUtil.handleGetRequest(request).then(function(data) {
    cb(JSON.parse(data))
  })
}