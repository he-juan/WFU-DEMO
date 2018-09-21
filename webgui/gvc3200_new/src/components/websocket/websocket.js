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

    getCallType = (message, isvideo) =>{
        let calltype = message.msg;
        let calltypeint = parseInt(calltype);
        if(calltypeint < 16 || isvideo == "0"){ //audio call
            message.isvideo = "0";
        }else if(calltypeint < parseInt("0xfc", 16) || isvideo == "1"){
            message.isvideo = "1";
        }
    }

    changelinesstatus = (message) =>{
        let linesinfo = [];
        let i = 0;
        if(this.props.linesinfo.length == 0){
            if(message.state == "4"){
                this.getCallType(message);
            }
            linesinfo.push(message);
        }else{
            for(  i = 0; i < this.props.linesinfo.length; i++ ){
                if(this.props.linesinfo[i].line == message.line){
                    if(message.state == "4"){
                        //get the call type - begin
                        let isvideo = this.props.linesinfo[i].isvideo;
                        this.getCallType(message, isvideo);
                    }
                    if(message.state == "3" || message.state == "4"){
                        //get the name and num --begin
                        let name = this.props.linesinfo[i].name;
                        let number = this.props.linesinfo[i].num;
                        message.name = message.name || name;
                        message.num = message.number || number;
                    }
                    linesinfo.push(message);
                }else{
                    linesinfo.push(this.props.linesinfo[i]);
                }

            }
        }
        this.props.setDialineInfo1(linesinfo);
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
        for( let i = 0; i < this.props.linesinfo.length; i++ ){
            if(this.props.linesinfo[i].line == message.line) {
                if(message['flag'].indexOf("MuteMic") != -1){
                    this.props.linesinfo[i].islocalmute = message['flag'].split("=")[1];
                }
            }
            linesinfo.push(this.props.linesinfo[i]);
        }
        this.props.setDialineInfo1(linesinfo);
    }

    handlemessage = (message) => {
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
                                onOk() {
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
                        globalObj.isCallStatus = false;
                        this.props.getConnectState();
                        this.props.setMuteStatus(message['line'],0);
                        this.props.setHeldStatus("0");
                        this.props.showCallDialog(10);
                        endcalltimeout = setTimeout(() => {
                			this.props.showCallDialog("end");
                		}, 1000);
                        break;
                    case "1":
                    case "3":
                        if(endcalltimeout){
                            clearTimeout(endcalltimeout);
                        }
                        this.changelinesstatus(message);
                        break;
                    case "4":
                        // accept the call
                        this.changelinesstatus(message);
                        break;
                    case "8":
                        //failed
                        switch (message['msg']){
                            case "6":
                                this.props.showCallDialog(86);
                                break;
                            case "7":
                                this.props.showCallDialog(87);
                                break;
                            case "8":
                                this.props.showCallDialog(88);
                                break;
                            default:
                                this.props.showCallDialog(8);
                                break;
                        }
                        break;
                }
                break;
            case "local_mute":
                this.handlemuteline(message);
                break;
            case 'updatename':
                this.updatename(message);
                break;
            case 'auto_answer':
                if(this.props.product != "GAC2510"){
                    break;
                }
                let pacct = this.returnAcctNum(message['acct']);
                this.props.getNvrams(new Array(pacct), (value) => {
                    this.props.showCallDialog(4);
                    this.props.setDialineInfo(message['line'], message['acct'], value.headers[pacct], message['isvideo'], message['disname'], message['num']);
                });
                break;
            case 'mute':
                if(message['flag'].indexOf("MuteMic") != -1){
                    this.props.setMuteStatus(message['line'], message['flag'].split("=")[1]);
                }else if(message['flag'].indexOf("been_held") !=-1){
                    this.props.setHeldStatus(message['flag'].split("=")[1]);
                }
                break;
            case 'callrecord':
                this.props.setRecordStatus(message['state']);
                break;
            case 'speaker_test':
                this.props.setSpeakerTestStatus(message['status']);
                break;
            case 'resetkey_test':
                this.props.setResetKeyTestStatus(message['status']);
                break;

        }
    }

    returnAcctNum = (acct) => {
        const acctPvalue = ["35", "404", "504", "604", "1704",  "1804", "50604", "50704", "50804", "50904", "51004", "51104", "51204", "51304", "51404", "51504"];
        return acctPvalue[Number(acct)];
    }

    handleData = (data) => {
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

    handleUrl = () => {
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
    linesinfo: state.linesInfo
})

function mapDispatchToProps(dispatch) {
    var actions = {
        promptMsg:Actions.promptMsg,
        setPageStatus:Actions.setPageStatus,
        getConnectState:Actions.getConnectState,
        progressMessage:Actions.progressMessage,
        showCallDialog: Actions.showCallDialog,
        setDialineInfo: Actions.setDialineInfo,
        setDialineInfo1: Actions.setDialineInfo1,
        getNvrams: Actions.getNvrams,
        setMuteStatus: Actions.setMuteStatus,
        setRecordStatus: Actions.setRecordStatus,
        setHeldStatus: Actions.setHeldStatus,
        setSpeakerTestStatus: Actions.setSpeakerTestStatus,
        setResetKeyTestStatus: Actions.setResetKeyTestStatus
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(HandleWebsocket));
