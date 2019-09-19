import React from 'react';
import { Modal } from "antd";
import Websocket from './init_websocket.js';
import Enhance from '../mixins/Enhance';
import * as Actions from '../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {globalObj} from "../redux/actions/actionUtil"

let endcalltimeout;

class HandleWebsocket extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getConnectState()
    }

    componentWillUnmount = () => {
        clearTimeout(endcalltimeout);
    }

    getCallType = (message, isvideo) => {
        let calltype = message.msg;
        let calltypeint = parseInt(calltype);
        if(calltypeint < 16 ){ //audio call
            message.isvideo = "0";
        }else if(calltypeint < parseInt("0xfc", 16)){
            message.isvideo = "1";
        }
    }

    // 0-video codec is not H.265  1-video codec is H.265
    getvideocodec = (message) => {
        let msgint = parseInt(message.msg);
        if (msgint >= 16 && msgint < 64) {
            message.videocodec = "0";
        } else if (msgint >= 64 && msgint < 253) {
            message.videocodec = "1";
        }
    }

    changelinesstatus = (message) =>{
        let linesinfo = [];
        if(this.props.linesinfo.length == 0){
            if(message.state == "4"){
                this.getCallType(message);
                this.getvideocodec(message);
            }
            if(message.state != "0"){
                linesinfo.push(message);
            }
            this.props.setDialineInfo1(linesinfo);
        }else{
            for(let  i = 0; i < this.props.linesinfo.length; i++ ) {
                let lineitem = this.props.linesinfo[i];
                if (this.props.linesinfo[i].line == message.line) {
                    if (message.state == "4" || message.state == "5") {
                        //get the call type - begin
                        this.getCallType(message);
                        if(message.isvideo){
                            lineitem.isvideo = message.isvideo;
                        }
                        this.getvideocodec(message);
                        if(message.videocodec){
                            lineitem.videocodec = message.videocodec;
                        }
                    }
                    if (message.state == "0") {
                        if(message.acct == "1"){
                            this.props.setipvrolestatus("-1");
                        }
                        continue;
                    }else {
                        //get the name and num --begin
                        let name = this.props.linesinfo[i].name;
                        let number = this.props.linesinfo[i].num;
                        lineitem.name = message.name || name;
                        lineitem.num = message.number || number;
                        lineitem.msg = message.msg;
                    }
                    lineitem.state = message.state;
                }
                linesinfo.push(lineitem);
            }
            this.props.setDialineInfo1(linesinfo);
        }

    }

    updatename = (message) =>{
        let linesinfo = [];
        for( let i = 0; i < this.props.linesinfo.length; i++ ){
            if(this.props.linesinfo[i].line == message.line) {
                this.props.linesinfo[i].name = message.name;
            }
            linesinfo.push(this.props.linesinfo[i]);
        }
        this.props.setDialineInfo1(linesinfo);
    }

    handlemuteline = (message) => {
        let linesinfo = [];
        let flag = false;
        for( let i = 0; i < this.props.linesinfo.length; i++ ){
            if(this.props.linesinfo[i].line == message.line) {
                if(message.flag.setChanParam &&  message.flag.setChanParam.LocalMuteVoip){
                    this.props.linesinfo[i].isLocalMuted = message.flag.setChanParam.LocalMuteVoip;
                    flag = true;
                    break;
                }
            }
        }
        if(flag){
            linesinfo = [...this.props.linesinfo];
            this.props.setDialineInfo1(linesinfo);
        }
    }
    //message.state == 1 : remote hold ; 0 : unhold
    handleremotehold = (message) => {
        let linesinfo = [];
        let flag = false;
        for( let i = 0; i < this.props.linesinfo.length; i++ ){
            if(this.props.linesinfo[i].line == message.line) {
                this.props.linesinfo[i].isremotehold = message.state;
                flag = true;
                break;
            }
        }
        if(flag){
            linesinfo = [...this.props.linesinfo];
            this.props.setDialineInfo1(linesinfo);
        }
    }

    handleFECC = (message) => {
        this.props.setFECCStatus(message.line, message.state);
    }

    handlevideoinvite = (message) => {
        let lines = ""
        if(this.props.videoinvitelines == ""){
            lines = message.line;
        }else{
            lines = this.props.videoinvitelines + "," + message.line;
        }
        this.props.setVideoInvitesInfo(lines);
        if(this.props.callDialogStatus == "minimize"){
            this.props.showCallDialog("9");
        }
    }
    handlevideoon = (message) => {
        let lines = "";
        if(this.props.videoonlines == ""){
            lines = message.line;
        }else{
            lines = this.props.videoonlines + "," + message.line;
        }
        this.props.setvideoonlines(lines);
    }
    handlevideoinviteack = (message) => {
        let lines = this.props.videoonlines.split(",");
        for(let j = lines.length; j >= 0; j-- ){
            if(lines[j] == message.line){
                lines.splice(j,1);
                break;
            }
        }
        this.props.setvideoonlines(lines.join(","));
    }
    handlevideoinvres = (message) => {
        let lines = this.props.videoinvitelines.split(",");
        for(let j = lines.length; j >= 0; j-- ){
            if(lines[j] == message.line){
                lines.splice(j,1);
                break;
            }
        }
        this.props.setVideoInvitesInfo(lines.join(","));
    }

    handleipvtchangehost = (message) => {
        let state = message.state;  //0-change to host  1-change to guest  2-change to panelists
        switch (state) {
            case "0":
                this.props.setipvrolestatus("2");
                break;
            case "1":
                this.props.setipvrolestatus("1");
                break;
            case "2":
                this.props.setipvrolestatus("3");
                break;
        }
        this.props.isallowipvtrcd();
    }

    handlemicblock = (message) =>{
        let linesinfo = [];
        let flag = false;
        for( let i = 0; i < this.props.linesinfo.length; i++ ){
            if(this.props.linesinfo[i].line == message.line) {
                this.props.linesinfo[i].islinemute = message.flag;
                flag = true;
                break;
            }
        }
        if(flag){
            linesinfo = [...this.props.linesinfo];
            this.props.setDialineInfo1(linesinfo);
        }
    }

    handleblock = (message) =>{
        let isStateString = typeof message.state == 'string'
        if(isStateString && message.state.split("=")[0] != "BlockHP"){
            return;
        }
        let linesinfo = [];
        let flag = false;
        for( let i = 0; i < this.props.linesinfo.length; i++ ){
            if(this.props.linesinfo[i].line == message.line) {
                this.props.linesinfo[i].isblock = message.state.setChanParam.MicState;
                flag = true;
                break;
            }
        }
        if(flag){
            linesinfo = [...this.props.linesinfo];
            this.props.setDialineInfo1(linesinfo);
        }
    }

    updatevideoedstate = (message) => {
        let line = message.line;
        let type = message.type;
        let isvideoed = "0";
        // flag:  0-the operation failed   1-the operation successed
        if(message.flag == "1"){
            if(type.indexOf("open") == -1){
                isvideoed = "1";
            }
        }else {
            if(type.indexOf("open") != -1){
                isvideoed = "1";
            }
        }
        let linesinfo = [];
        let flag = false;
        for( let i = 0; i < this.props.linesinfo.length; i++ ){
            if(this.props.linesinfo[i].line == message.line) {
                this.props.linesinfo[i].isvideoed = isvideoed;
                flag = true;
                break;
            }
        }
        if(flag){
            linesinfo = [...this.props.linesinfo];
            this.props.setDialineInfo1(linesinfo);
        }
    }


    handlemessage = (message) => {
        // console.log(message)
        let type = message['type'];
        switch (type) {
            case 'install':
                let a_2 = this.tr('a_2')
                if(message['msg'] == 'progress') {
                    this.props.progressMessage(message['val'], 'block', this.tr('a_firmwareupgrade'));
                    if (message['val'] == 100) {
                        setTimeout(() => {
                            this.props.progressMessage(message['val'], 'none', this.tr('a_firmwareupgrade'));
                            let a_succheck = this.tr('a_succheck')
                            Modal.info({
                                content: <span dangerouslySetInnerHTML={{__html: a_succheck}}></span>,
                                okText: <span dangerouslySetInnerHTML={{__html: a_2}}></span>,
                                onOk: ()  => {
                                    location.hash=""
                                    window.location.reload()
                                },
                            });
                        }, 3000)
                    }
                } else if(message['msg'] == 'status') {
                    this.props.progressMessage('0', 'none', this.tr('a_firmwareupgrade'));
                    let errorMsg;
                    switch (message['val']) {
                        case '1':
                            errorMsg = 'a_samever';
                            break;
                        case '2':
                            errorMsg = 'a_readwrong';
                            break;
                        case '3':
                            errorMsg = 'a_wrongsig';
                            break;
                        case '5':
                            errorMsg = 'a_hwnotcomp';
                            break;
                        case '6':
                            errorMsg = 'a_imagenotcomp';
                            break;
                        case '7':
                            errorMsg = 'a_notcomp';
                            break;
                        case '8':
                            errorMsg = 'a_16460';
                            break;
                        case '9':
                            errorMsg = 'a_brokenfile';
                            break;
                        case '10':
                            errorMsg = 'a_lowspace';
                            break;
                        case '11':
                            errorMsg = 'a_oemidnotcompatiable';
                            break;
                        case '128':
                            errorMsg = 'a_installpathchange';
                            break;
                        case '15':
                        default:
                            errorMsg = 'a_unknownfail';
                    }

                    errorMsg = this.tr('a_3316') + ',' + this.tr(errorMsg) + '!';
                    Modal.info({
                        content: <span dangerouslySetInnerHTML={{__html: errorMsg}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: a_2}}></span>,
                        onOk() {
                        },
                    });
                }
            case 'call':
                switch (message['state']) {
                    case "0":
                        // dile/end the call
                        this.props.getConnectState();
                        // this.props.showCallDialog(10);
                        this.changelinesstatus(message);
                        if( this.props.linesinfo.length <= 0 ){ // 所有线路都取消时
                            globalObj.isCallStatus = false;
                            this.props.showCallDialog("end");
                        }
                        sessionStorage.removeItem('recordSource')
                        break;
                    case "1":
                    case "3":
                        if(endcalltimeout){
                            clearTimeout(endcalltimeout);
                        }
                        this.changelinesstatus(message);
                        break;
                    case "2": // incoming call
                        let linesinfo = [...this.props.linesinfo];
                        linesinfo[linesinfo.length] = message;
                        this.props.setDialineInfo1(linesinfo);
                        break;
                    case "4":
                        // accept the call
                    case "5": //hold all line
                        if(this.props.recordStatus == '1') {
                            sessionStorage.setItem('isRecorded', '1')
                        }
                        this.changelinesstatus(message);
                        break;
                    case "8":
                        // call failed
                        this.changelinesstatus(message);
                        break;
                }
                break;
            case "local_mute":
                if(message.flag.callrecord) {
                    this.handleCallRecord(message.flag.callrecord)
                } else {
                    this.handlemuteline(message);
                }
                break;
            case 'updatename':
                this.updatename(message);
                break;
            case 'feccstate':
                this.handleFECC(message);
                break;
            case 'enablefecc':
                let linesinfo = [];
                let flag = false;
                for( let i = 0; i < this.props.linesinfo.length; i++ ){
                    if(this.props.linesinfo[i].line == message.line) {
                        this.props.linesinfo[i].enablefecc = message.state;
                        flag = true;
                        break;
                    }
                }
                if(flag){
                    linesinfo = [...this.props.linesinfo];
                    this.props.setDialineInfo1(linesinfo);
                }
                break;
            case 'remote_hold':
                this.handleremotehold(message);
                break;
            case 'auto_answer':
                let pacct = this.returnAcctNum(message['acct']);
                this.props.getNvrams(new Array(pacct), (value) => {
                    this.props.showCallDialog(4);
                });
                break;
            
            case 'mic_block':
                this.handlemicblock(message);
                break;
            case 'blockstate':
                this.handleblock(message);
                break;
            case 'open_camera_status':
                this.updatevideoedstate(message);
                break;
            case 'close_camera_status':
                this.updatevideoedstate(message);
                break;
            case 'video_invite':
                this.handlevideoinvite(message);
                break;
            case 'videoon':
                this.handlevideoon(message);
                break;
            case 'video_invite_ack':
                this.handlevideoinviteack(message);
                break;
            case 'video_invite_res':
                this.handlevideoinvres(message);
                break;
            case 'record':
                this.props.setRecordStatus(message['state']);
                break;
            case "IPVT_record_state":
                this.props.setIPVTRecordStatus(message['state']);
                break;
            case 'IPVT_change_host':
                this.handleipvtchangehost(message);
                break;
            case 'switchhvideosource':
                this.props.setPresentation(message['state'] == 1);
                break;
            case 'select_presentation_source':
            case 'switch_presentation_source':
                this.props.setPresentSource(message['switchto']);
                break;
            case 'presentation_status':
                this.props.setPresentLineMsg(message['line'], message['msg']);
                break;
            case 'detail':
                this.props.setlinedetailinfo(message);
                break;
            case 'hdmi_status':
                this.props.setHDMIstatus(message['hdmi'], message['status']);
                break;
            case "IPVT_hand_operate":
            case 'IPVT_hand_operate_for_web':
                this.props.setHandsupstatus(message['state']);
                break;
            case 'IPVT_camera_invite':
                this.props.setipvtcmrinviteinfo(message);
                break;
            case 'IPVT_operate_camera':
                if(message['isvideoed'] == "1")
                    this.props.setipvtcmrinviteinfo(null);
                break;
            case 'IPVT_reject_camera_request':
                if(message['status'] != "1")
                    this.props.setipvtcmrinviteinfo(null);
                break;
            case 'sfu_member_join':
            case 'sfu_mute_member':
            case 'sfu_member_leave':
            case 'sfu_lock_meeting':
                this.props.getsfuconfinfo();
                break;
            case 'sfu_change_host':
            case 'sfu_login':
                this.props.getsfuconfmyrole();
                this.props.getsfuconfinfo();
                break;
            case 'unhold_continue_record':
                sessionStorage.removeItem('isRecorded');
                if(message['status'] == '0') {
                    sessionStorage.removeItem('recordSource')
                }
                 break;

                
            // 新的消息 以上大部分无效
            case 'line-status-changed': 
                if(window.TIMER_GETLINES) {
                    clearTimeout(window.TIMER_GETLINES)
                    window.TIMER_GETLINES = null
                }
                window.TIMER_GETLINES = setTimeout(() => {
                    this.props.getAllLineStatus()
                    window.TIMER_GETLINES = null
                }, 100)
                break;
            // 新的消息 会议全局状态信息
            case 'conf-status-changed':
                this.props.setGlobalConfInfo(message.data);
                break;
            case 'dnd':
                this.props.setDndModeStatus(message.state);
                break;
            case 'presentaion-status-changed':
                this.props.setPreState(message.data)
                break;
        }
    }

    returnAcctNum = (acct) => {
        const acctPvalue = ["35", "404", "504", "604", "1704",  "1804", "50604", "50704", "50804", "50904", "51004", "51104", "51204", "51304", "51404", "51504"];
        return acctPvalue[Number(acct)];
    }

    handleData = (data) => {
        data = data.replace(/,$/, '')
        let wsdata = window.eval("([" + data + "])");
        //console.log(wsdata);
        for(let i=0; i<wsdata.length; i++){
            if(wsdata[i].reback != "done") {
                this.handlemessage(wsdata[i]);
            }
        }
    }

    handleOpen = () => {
        //console.log("open")
    }

    handleClose = () => {
        //console.log("close")
    }
    handleCallRecord = (callrecord) => {
        let flag = callrecord.opt == 'start' ? 1 : 0
        if(flag == 1) {
            sessionStorage.removeItem('isRecorded')
        }
        this.props.setRecordStatus(flag)
    }
    handleUrl = () => {
        // let ws_host = location.host
        let ws_host = location.host
        let ws_protocol = location.protocol
        let wsuri = "";
        if (ws_protocol.indexOf("https:") != -1) {
            wsuri = 'wss://' + ws_host + '/tcp_proxy';
        } else {
            wsuri = 'ws://' + ws_host + '/tcp_proxy';
        }

        return wsuri;
    }

    render() {
        return (
                <Websocket url = {this.handleUrl()} onMessage={this.handleData}
                onOpen={this.handleOpen} onClose={this.handleClose} debug = {true} />
        );
    }
}

const mapStateToProps = (state) => ({
    pageStatus: state.pageStatus,
    product: state.product,
    linesinfo: state.linesInfo,
    ipvrole: state.ipvrole,
    videoinvitelines: state.videoinvitelines,
    callDialogStatus: state.callDialogStatus,
    videoonlines: state.videoonlines,
    recordStatus: state.recordStatus
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        promptMsg:Actions.promptMsg,
        setPageStatus:Actions.setPageStatus,
        getConnectState:Actions.getConnectState,
        progressMessage:Actions.progressMessage,
        showCallDialog: Actions.showCallDialog,
        setDialineInfo1: Actions.setDialineInfo1,
        getNvrams: Actions.getNvrams,
        setMuteStatus: Actions.setMuteStatus,
        setRecordStatus: Actions.setRecordStatus,
        setIPVTRecordStatus: Actions.setIPVTRecordStatus,
        setFECCStatus: Actions.setFECCStatus,
        setDndModeStatus: Actions.setDndModeStatus,
        setVideoInvitesInfo: Actions.setVideoInvitesInfo,
        setipvrolestatus: Actions.setipvrolestatus,
        setPresentation: Actions.setPresentation,
        setPresentSource: Actions.setPresentSource,
        setPresentLineMsg: Actions.setPresentLineMsg,
        setvideoonlines: Actions.setvideoonlines,
        setlinedetailinfo: Actions.setlinedetailinfo,
        setHDMIstatus: Actions.setHDMIstatus,
        isallowipvtrcd: Actions.isallowipvtrcd,
        setHandsupstatus: Actions.setHandsupstatus,
        setipvtcmrinviteinfo: Actions.setipvtcmrinviteinfo,
        setGlobalConfInfo: Actions.setGlobalConfInfo,
        getAllLineStatus: Actions.getAllLineStatus,
        setPreState: Actions.setPreState,
        //sfu
        getsfuconfinfo: Actions.getsfuconfinfo,
        getsfuconfmyrole: Actions.getsfuconfmyrole,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(HandleWebsocket));
