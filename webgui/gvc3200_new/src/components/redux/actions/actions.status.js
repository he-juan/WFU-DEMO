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
        cb()
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