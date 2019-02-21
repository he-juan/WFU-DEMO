import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance"
import { Layout, Button, Icon, Slider, Popover,Modal } from "antd"
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {globalObj} from "../../../redux/actions/actionUtil"
import FECCModal from "./FECCModal";
import VideoinviteDialog from "./videoinviteDialog"
import LayoutModal from './LayoutModal/index';
import LayoutModel_SFU from './LayoutModal_SFU';
import PresentationModal from './presentationModal';
import InviteMemberModal from './InviteMemberModal';
import DetailsModal from './detailsModal';
import DTMFModal from './DTMFModal';
import RecordModal from './RecordModal';
const Content = Layout
let tmpclass = "", disacct = "", linestatustip = "",ctrlbtnvisible = "display-hidden", maskvisible = "display-hidden", obj_incominginfo = new Object(), contactItems;
let dialogLeaveTimeout;
let mClicktimes = 0;
let mPreClickTime, mCurrentClickTime, mTipTimeout;

class CallDialog extends Component {
    constructor(props){
        super(props);

		this.state = {
            callstatus: "callee-status",
            holdtype: "",
            acctstatus: [],
            displayFECCModal:false,
            FECCline: "-1",
            LayoutModalVisible: false,
            endallConfirm1Visible: false,
            endallConfirm2Visible: false,
            endallConfirm2Title: "",
            PresentModalVisible: false,
            InviteMemberModalVisible: false,
            detailsModalVisible:false,
            otherCtrlVisible: false,
            DTMFVisible: false,
            DTMFDisplay: true,
            recordModalVisible: false,
            DTFMString: "",
            is4kon: false,
            ishdmione4K: false,
            isline4Kvideo: false
		}
		this.req_items = new Array();
        this.req_items.push(
            this.getReqItem("disconfstate", "1311", ""),
            this.getReqItem("autovideostate", "25023", ""),
            this.getReqItem("incalldtmf", "338", ""),
            this.getReqItem("remotevideo", "2326", ""),
            this.getReqItem("disipcall", "277", ""),
            this.getReqItem("distranfer", "1341", ""),
            this.getReqItem("tranfermode", "1685", ""),
            this.getReqItem("usequickipcall", "184", ""),
            this.getReqItem("disablepresent", "26001", ""),
            this.getReqItem("enablefecc", "26004", ""),
            this.getReqItem("prefix", "66", ""),
            this.getReqItem("disdialplan", "1687", ""),
            this.getReqItem("autovideostate", "25023", "")
        )
    }

    componentWillMount = () => {
        this.props.callstatusreport("0");  //页面刚进来时，停止detail message.
    }

    componentDidMount = () => {
        globalObj.isCallStatus = true;
        if (this.props.msgsContacts.length == undefined) {
            this.props.getContacts();
        }
        this.props.getAcctStatus((acctstatus) => {
            if (!this.isEmptyObject(acctstatus)) {
                this.getAcctStatusData(acctstatus);
            }
        });
        this.props.getBFCPMode();
        this.props.getItemValues(this.req_items, (data) => {
            let callfeatures = new Object();
            let item;
            for (let i in this.req_items) {
                item = this.req_items[i];
                callfeatures[item.name] = data[item.name];
            }
            this.props.setDeviceCallFeature(callfeatures);

            if (data["incalldtmf"] == "1") {
                this.setState({DTMFDisplay: false});
            } else {
                this.setState({DTMFDisplay: true});
            }
        });
        let getis4kcon = new Promise((resolve, reject) => {
            this.props.getHDMI1Resolution((is4kon) => {
                resolve(is4kon);
            });
        });
        let gethdmione4K = new Promise((resolve, reject) => {
            this.props.gethdmione4K(true, (ishdmione4K) => {
                resolve(ishdmione4K);
            });
        });
        let getline4Kvideo = new Promise((resolve, reject) => {
            this.props.getline4Kvideo(true, (isline4Kvideo) => {
                resolve(isline4Kvideo);
            })
        })

        let promiseAll = Promise.all([getis4kcon, gethdmione4K, getline4Kvideo])
            .then((result) => {
                this.setState({
                    is4kon: result[0],
                    ishdmione4K: result[1] == "true" ? true : false,
                    isline4Kvideo: result[2] == "true" ? true : false
                });
            });
        //当账号为0 时需要判断是否为sfu会议
        //  sfu 获取role
        this.props.getsfuconfmyrole(function(role){

        })
    }

    componentWillUnmount = () => {
        clearTimeout(dialogLeaveTimeout);
    }

    countClickedTimes =()=>{
        if(mClicktimes == 0){
            mPreClickTime = new Date().getTime();
            mClicktimes ++;
            return true;
        }
        mCurrentClickTime = new Date().getTime();
        if((mCurrentClickTime - mPreClickTime) < 1000) {
            this.props.promptMsg("WARNING","a_552");
            mPreClickTime = mCurrentClickTime;
            return false;
        }
        mClicktimes ++ ;
        mPreClickTime = mCurrentClickTime;
        return true;
    }

    getAcctStatusData = (acctstatus) => {
        let curAcct = [];
        const acctStatus = acctstatus.headers;
        let max = 4;
        for (let i = 0; i < max; i++) {
            let accountname = acctStatus[`account_${i}_name`];
            if (i == 3) {

                if(acctStatus[`account_${6}_name`].length > 0){
                    accountname = acctStatus[`account_${6}_name`]
                }else if( acctStatus[`account_${6}_no`].length > 0 ){
                    accountname = acctStatus[`account_${6}_no`]
                }else{
                    accountname = "H.323";
                }
                curAcct.push(
                    {
                        "acctindex": i,
                        "register": acctStatus[`account_${6}_status`],
                        "activate": acctStatus[`account_${6}_activate`],
                        "name": accountname
                    });
            } else {
                if (i == 0) {
                    if (acctStatus[`account_${i}_name`].length > 0) {
                        accountname = acctStatus[`account_${i}_name`];
                    } else if (acctStatus[`account_${i}_no`].length > 0) {
                        accountname = acctStatus[`account_${i}_no`];
                    } else {
                        accountname = "SIP";
                    }
                }
                curAcct.push(
                    {
                        "acctindex": i,
                        "register": acctStatus[`account_${i}_status`],
                        "activate": acctStatus[`account_${i}_activate`],
                        "name": accountname
                    });
            }
        }
        this.setState({acctstatus: curAcct});
    }


    timeConvert = (time) => {
        let hour = Math.floor(time / 3600);
        let min = Math.floor( (time % 3600) / 60 );
        let sec = time % 60;

        if(hour < 10){
            hour = `0${hour}`;
        }

        if(min < 10){
            min = `0${min}`;
        }

        if(sec < 10){
            sec = `0${sec}`;
        }

        return `${hour} : ${min} : ${sec}`;
    }

    hasipvtline = () => {
        let linestatus = this.props.linestatus;
        for(let i = 0; i< linestatus.length;i++){
            if(linestatus[i].acct == "1"){
                return true;
            }
        }
        return false;
    }

    ispause = () => {
        if(this.props.heldStatus == '1') {
            this.props.promptMsg("WARNING", "a_10126");
            return true;
        }
        return false;
    }

	handleEndCall = () => {
        globalObj.isCallStatus = false;
        this.props.endCall(0);
	}

	minimizeDialog = () => {
		this.props.showCallDialog(10);
		setTimeout(() => {
			this.props.showCallDialog("minimize");
		}, 1000);
	}

    handlelocalmute =(ismute) => {
        if(!this.countClickedTimes())
        {
            return false;
        }
        this.props.ctrlLocalMute(ismute == "1" ? "0" : "1");
    }
    handlelocalcamera = () =>{
        if(!this.countClickedTimes())
        {
            return false;
        }
        this.props.ctrlCameraBlockState();
    }

    handlelinemute = (lineitem) =>{
        if(lineitem.islinemute == "1"){
            this.props.ctrlLineMute(lineitem.line, "0");
        }else{
            this.props.ctrlLineMute(lineitem.line, "1");
        }
    }

    handlelineblock = (line) =>{
        if(!this.countClickedTimes())
        {
            return false;
        }
        if(this.ispause()){
            return false;
        }
        this.props.blockLineOrNot(line);
    }

    handlelinevideoswitch =(lineitem) =>{
        if(!this.countClickedTimes())
        {
            return false;
        }
        if(this.ispause()){
            return false;
        }
        let mode = "1"
        if(lineitem.isvideo == "1"){
            mode = "0";
        }
        this.props.ctrlvideostate(lineitem.line, mode);
    }

    handleStartFECC = (line) =>{
        if(!this.countClickedTimes()){
            return false;
        }
        this.props.gethdmi1state((result) => {
            if(result.state == "1"){  //HDMI 1 has connected
                let req_items = new Array;
                req_items.push(
                    this.getReqItem("hdmi2", "hdmi2", ""),
                    this.getReqItem("hdmi3", "hdmi3", "")
                );
                this.props.getItemValues(req_items, (values) => {
                    let hdmi2state = values["hdmi2"];
                    let hdmi3state = values["hdmi3"];
                    let hdmi23state = 0;
                    if(hdmi3state == "1" && hdmi2state == "1")
                        hdmi23state = 4;
                    else if(hdmi3state != "1" && hdmi2state == "1")
                        hdmi23state = 5;
                    else if(hdmi3state != "1" && hdmi2state != "1")
                        hdmi23state = 6;

                    if(hdmi23state == 4 || hdmi23state == 5 || hdmi23state == 6)
                    {
                        /**
                         open FECC
                         1. HDMI1
                         2. HDMI1, HDMI2
                         3. HDMI1, HDMI2, HDMI3
                         **/
                        this.props.isFECCEnable(line, (result) => {
                            if (result.res.toLowerCase() == "success" && result.flag == "true") {
                                //start FECC
                                this.props.ctrlFECC(line, 1, (result) =>{
                                    if(result.res == "success" || result == 0 ){
                                    }else{
                                        this.props.promptMsg("WARNING", this.tr("a_63"));
                                    }
                                });
                            } else {
                                //not enable FECC
                                this.props.promptMsg("WARNING", this.tr("a_63"));
                            }

                        });
                    }
                    else
                    {
                        this.props.promptMsg("WARNING", this.tr("a_16707") + " " + this.tr("a_63"));
                    }
                })
            }else{
                this.props.promptMsg("WARNING", this.tr("a_16707") + " " + this.tr("a_63"));
            }
        });
    }

    handleHideFECC = () =>{
    }

    handleEndline = (line, account) =>{
        if(this.props.callFeatureInfo.disconfstate == "0"){
            //check the line if pause
            if(this.props.heldStatus == "1"){
                this.props.promptMsg("WARNING", this.tr("a_10126"));
                return;
            }
        }
        let flag = "0";
        if(account == 1 && this.props.ipvrole == "2"){
            flag = "1";
        }
        this.props.endlinecall(line, flag);
    }

    handleuploading = (line, isvideoed) => {
        if(!this.countClickedTimes()) {
            return false;
        }
        if(this.ispause()){
            return false;
        }
        let flag = 1 ;
        if(isvideoed == "1"){
            flag = 0;
        }
        this.props.conflinevideoedstate(line,flag);
    }

    handlednd = () =>{
        if(this.hasipvtline()){
            if(this.props.dndstatus == "0"){
                this.props.promptMsg("WARNING", this.tr("a_16710"));
            }else{
                this.props.promptMsg("WARNING", this.tr("a_16716"));
            }
            return false;
        }
        if(this.props.dndstatus == "0"){
            this.props.setDndMode("1","1");
        }else{
            this.props.setDndMode("0","1");
        }
    }

    showDetails = () =>{
        this.props.callstatusreport("1");
        this.setState({
            detailsModalVisible:true,
            otherCtrlVisible: false
        });
    }

    showDTMF = () => {
        if(this.ispause()){
            return false;
        }
        this.props.getconfdtmf((data)=>{
            this.setState({DTMFString:data.dtmfstr});
        });
        this.setState({
            DTMFVisible: true,
            otherCtrlVisible: false
        });

    }

    hideDTMFModal = () =>{
        this.setState({DTMFVisible: false});
    }

    handleOtherCtrlChange = (visible) => {
        this.setState({ otherCtrlVisible: visible });
    }

    handleVolChange = (value) => {
        this.props.setVolume(value);
    }

    componentWillUnmount = () => {
        clearInterval(this.callTick);
    }
    handleHoldall = () =>{
        if(!this.countClickedTimes()) {
            return false;
        }
        let linestatus = this.props.linestatus;
        for(let i = 0 ; i < linestatus.length; i++) {
            let lineitem = linestatus[i];
            let state = lineitem.state;
            if(state == "3" || state == "8" || state == "12")
            {
                // conference can not be held
                this.props.promptMsg('WARNING', "a_548");
                return false;
            }
        }
        //当在web端的会控界面上请求开启远端视频时，保持功能被禁用，直到远端设备弹窗消失
        if(this.props.videoonlines){
            this.props.promptMsg('WARNING', "a_10129");
            return false;
        }
        clearTimeout(mTipTimeout);
        mTipTimeout = setTimeout(()=>{
            this.props.promptMsg('WARNING', "a_7355");
        },500);
        let ishold = "1";
        if(linestatus[0].state == "5" ){
            ishold = "0"
        }
        this.props.confholdstate(ishold);
    }

    handleHandsup = () => {
        if(!this.countClickedTimes()) {
            return false;
        }
        this.props.upordownhand();
    }

    handleEndAll = () => {
        let linestatus = this.props.linestatus;
        let ipvtline;
        for(let i = 0 ; i < linestatus.length; i++) {
            let lineitem = linestatus[i];
            if (lineitem.acct == 1) {
                ipvtline = lineitem.line;
                break;
            }
        }
        if(ipvtline){
            this.props.getipvrole(ipvtline, "closeprompt", (result)=>{
                if(result == "2"){
                    this.setState({
                        endallConfirm1Visible: true
                    })
                }else{
                    let endall2title = this.tr("a_10103");
                    if(result == "1" || result == "3"){
                        endall2title = this.tr("a_19357");
                        for(let i = 0 ; i < linestatus.length; i++) {
                            let lineitem = linestatus[i];
                            if (lineitem.acct == 0) {
                                endall2title = this.tr("a_19354");
                                break;
                            }
                        }
                    }
                    this.setState({
                        endallConfirm2Visible: true,
                        endallConfirm2Title: endall2title
                    });
                }
            });
        }else{
            this.setState({
                endallConfirm2Visible: true,
                endallConfirm2Title: this.tr("a_10103")
            });
        }
    }

    handleEndall1Cancel = () =>{
        this.setState({
            endallConfirm1Visible: false
        })
    }
    endConf =()=>{
        this.props.endconf("0");
        this.setState({
            endallConfirm1Visible: false
        })
    }
    exitConf =() => {
        this.props.endconf("1");
        this.setState({
            endallConfirm1Visible: false
        })
    }
    endAllCall =() =>{
        this.props.endconf("1");
        this.setState({
            endallConfirm2Visible: false
        })

    }
    handleEndall2Cancel = () => {
        this.setState({
            endallConfirm2Visible: false
        })
    }

    acceptipvtinvite = (line) => {
        this.props.acceptorejectipvtcmr(line, "1");
        this.props.setipvtcmrinviteinfo(null);
    }

    rejectipvtinvite = (line) => {
        this.props.acceptorejectipvtcmr(line, "0");
        this.props.setipvtcmrinviteinfo(null);
    }

    toogleLayoutModal = (visible) => {
        if(this.props.isvideo == '0') {
            this.props.promptMsg('WARNING', "a_10109");
            return;
        }
        if(visible == true && this.ispause()) {
            return;
        }
        this.setState({
            LayoutModalVisible: visible
        })
    }
    tooglePresentModal = (visible) => {
        if(visible == true && this.ispause()) {
            return;
        }
        this.setState({
            PresentModalVisible: visible
        })
    }
    toogleInviteMemberModal = (visible) => {
        if(visible == true && this.ispause()) {
            return;
        }
        this.setState({
            InviteMemberModalVisible: visible
        })
    }

    handleRecord = () => {
        if (!this.countClickedTimes()) {
            return false;
        }
        if (this.ispause()) {
            return false;
        }

        if(this.hasipvtline() && this.props.ipvrole == "2" && this.props.isallowipvtrcd){
            //可开启云端和本地录像
            this.setState({recordModalVisible:true});
            return;
        }

        if (this.state.is4kon) {
            this.props.promptMsg('ERROR', 'a_605');
            return;
        }
        let recordstatus = this.props.recordStatus || this.props.ipvtRecordStatus;
        /* 0-not recording  1- in recording */
        this.props.handlerecord(recordstatus);
    }

    toogleRecordModal = (visible) =>{
        this.setState({
            recordModalVisible: visible
        })
    }

    handlehidedetails = () =>{
        this.props.getguicalldetailstatus((data)=>{
            let state = data.headers[':gui_calldetail'];
            if(state == "" || state == undefined ){
                state = "0";
            }
            if(state == "0"){
                this.props.callstatusreport("0");
            }
        });
        this.setState({detailsModalVisible:false});
    }
    
    componentWillUpdate = (nextProps) => {
        if (this.props.presentation != nextProps.presentation || this.props.presentSource != nextProps.presentSource || this.props.presentLineMsg != nextProps.presentLineMsg) {
            this.setState({
                PresentModalVisible: false,
                LayoutModalVisible:false,
            })
        }
    }
    render(){
        //dialogstatus: 9-enter  10-leave  1~7-line statues 86-not found  87-timeout 88-busy
        let {status, linestatus, recordStatus, ipvtRecordStatus, handsupStatus, ipvrole, ipvtcmrinviteinfo, msfurole} = this.props;
        let videoinvitelines = "";
        if(this.props.videoinvitelines){
            videoinvitelines = this.props.videoinvitelines.split(",");
        }
        let linestatustip = [];
        let linevideouploadclass = [];
        let lineisvideoedclass = [], linesuspendclass = [], lineconfvideoclass = [], lineblockclass = [], linemuteclass = [],linefeccclass = [] ;
        let lineuploadingdisable = [];
        let state3num = 0, state8num = 0;
        let heldclass = this.props.heldStatus == '0' ? "unhold-icon" : 'hold-icon';
        for(let i = 0 ; i < linestatus.length; i++){
            let lineitem = linestatus[i];
            let  state= lineitem.state;
            let account = lineitem.acct;
            lineuploadingdisable[i] = false;
            linestatustip[i] = "";
            switch (state) {
                case "3":
                case "init3":
                    state3num ++;
                    if (tmpclass != "call-dialog-in call-dialog-in-active") {
                        tmpclass = "call-dialog-in call-dialog-in-active";
                        maskvisible = "display-block";
                    }
                    if (dialogLeaveTimeout) {
                        clearTimeout(dialogLeaveTimeout);
                    }
                    linestatustip[i] = this.tr("a_509");
                    linevideouploadclass[i] = "display-hidden";
                    ctrlbtnvisible = "display-hidden";
                    lineisvideoedclass[i] = lineconfvideoclass[i] = linesuspendclass[i] = lineblockclass[i]
                        = linemuteclass[i] = linefeccclass[i] = "display-hidden";
                    break;
                case "4":
                case "5":
                    linevideouploadclass[i] = "display-block" + " uploading";
                    if (tmpclass != "call-dialog-in call-dialog-in-active") {
                        tmpclass = "call-dialog-in call-dialog-in-active";
                        maskvisible = "display-block";
                    }
                    ctrlbtnvisible = "display-block";
                    lineisvideoedclass[i] = "uploading";
                    linesuspendclass[i]="unconfsuspend";
                    lineblockclass[i] = "unconfblock";
                    linemuteclass[i] = "unmute";
                    linefeccclass[i] = "startFECC";
                    if(lineitem.enablefecc != "1" && lineitem.feccstate != "1"){
                        linefeccclass[i] += " btndisable";
                    }
                    if(lineitem.issuspend == "1"){
                        linesuspendclass[i]="confsuspend";
                    }
                    if (lineitem.isvideo == "1") {
                        linestatustip[i] = this.tr("a_669");
                        lineconfvideoclass[i] = "confvideo";
                    } else {
                        linestatustip[i] = this.tr("a_668");
                        lineconfvideoclass[i] = "confaudio";
                        linesuspendclass[i] += " btndisable";
                    }
                    if(lineitem.isblock == "1"){
                        lineblockclass[i] = "confblock";
                    }
                    if(lineitem.islinemute == "1"){
                        linemuteclass[i] = "mute";
                    }
                    if(lineitem.isvideoed == "1"){
                        lineisvideoedclass[i] = "unuploading"
                    }else{
                        lineisvideoedclass[i] = "uploading"
                    }

                    if(lineitem.isremotehold == "1") {
                        linesuspendclass[i] += " btndisable";
                        lineconfvideoclass[i] += " btndisable";
                        lineblockclass[i] += " btndisable";
                        linemuteclass[i] += " btndisable";
                    }
                    if(account != 1){
                        lineisvideoedclass[i] += " btndisable";
                    }
                    if(account == 8) account = 3;
                    if(this.state.acctstatus.length > 0){
                        linestatustip[i] += " (" + this.state.acctstatus[account]["name"]+")";
                    }
                    if(lineitem.feccline && lineitem.feccline != "-2"){
                        if(!this.setfeccstateTimer){
                            this.setfeccstateTimer = setTimeout(()=>{
                                this.props.ctrlFECC(lineitem.feccline, 1, (result) =>{
                                    if(result.res == "success" || result == 0 ){
                                    }else{
                                        this.props.promptMsg("WARNING", this.tr("a_63"));
                                    }
                                });
                            },500);
                        }
                    }
                    if(!this.getcamerablockedTimmer){
                        this.getcamerablockedTimmer = setTimeout(()=>{
                                this.props.getCameraBlocked();
                        });
                    }

                    //handle ipvt line
                    if(account == 1){
                        if(!this.getipvroleTimer){
                            this.getipvroleTimer = setTimeout(()=>{
                                this.props.getipvrole(lineitem.line,"init");
                                this.props.isallowipvtrcd();
                            });
                        }
                    }
                    break;
                case "init8":
                case "8":
                    state8num ++;
                    if (tmpclass != "call-dialog-in call-dialog-in-active") {
                        tmpclass = "call-dialog-in call-dialog-in-active";
                        maskvisible = "display-block";
                    }
                    ctrlbtnvisible = "display-hidden";
                    lineisvideoedclass[i] = lineconfvideoclass[i] = linesuspendclass[i] = lineblockclass[i] = linemuteclass[i] = "display-hidden";
                    switch(lineitem.msg){
                        case "3":
                            linestatustip[i] = this.tr("a_539");
                            break;
                        case "4":
                            linestatustip[i] = this.tr("a_540");
                            break;
                        case "5":
                            linestatustip[i] = this.tr("a_541");
                            break;
                        case "6":
                            linestatustip[i] = this.tr("a_542");
                            break;
                        case "7":
                            linestatustip[i] = this.tr("a_543");
                            break;
                        case "8":
                            linestatustip[i] = this.tr("a_544");
                            break;
                        case "9":
                            linestatustip[i] = this.tr("a_545");
                            break;
                        default:
                            linestatustip[i] = this.tr("a_643");
                            break;
                    }
                    break;
            }
        }

        let ismute = linestatus[0] && linestatus[0].isLocalMuted == "1" ? "1" : "0";
        let localmuteclass = "unmute";
        let localcamerablockedclass = "confvideo";
        let startFECCClass = "startFECC";
        let localbtndisabled = false;
        if((state3num + state8num) == linestatus.length){  //there has no line in talking
            localmuteclass += " btndisable";
            startFECCClass += " btndisable";
            localcamerablockedclass += " btndisable";
            localbtndisabled = true;
        }else{
            localmuteclass = ismute == "1" ? "mute" : "unmute";
            if(this.props.localcamerablocked == "0"){
                localcamerablockedclass = "confvideo";
            }else{
                localcamerablockedclass = "confaudio";
            }
        }

        let feccInfo = this.props.FECCStatus;
        let feccline = "";
        let feccdisplay = false;
        if(feccInfo){
            feccline = feccInfo.line;
            feccdisplay = feccInfo.status == "1" ? true : false
        }
        if(linestatus.length == 0 && status == 10){  //当所有线路均取消时 显示消失动画
            if(maskvisible == "display-block"){
                tmpclass = "call-dialog-out call-dialog-out-active";
                dialogLeaveTimeout = setTimeout(() => {maskvisible = "display-hidden"}, 1000);
            }
        }
        if(status == "9"){
            if(tmpclass != "call-dialog-in call-dialog-in-active"){
                tmpclass = "call-dialog-in call-dialog-in-active";
                maskvisible = "display-block";
            }
        }

        let recordvisible = (!this.state.is4kon && (!this.state.ishdmione4K || !this.state.isline4Kvideo)) || this.props.ipvtrcdallowstatus;
        let feccbtnvisile = !this.state.is4kon && (!this.state.ishdmione4K || !this.state.isline4Kvideo);
        let recordclass = "unrcd";
        if(recordStatus == "1" || ipvtRecordStatus == "1"){
            recordclass = "rcd"
        }
        let handsupclass = "unhandsup";
        let handsupdisplay = "none";
        if(this.hasipvtline() && (ipvrole == "1" || ipvrole == "3") ){
            handsupdisplay = "block";
        }
        if(handsupStatus == "1"){
            handsupclass = "handsup"
        }

        return (
            <div className={`call-dialog ant-modal-mask ${maskvisible}`}>
				<div className={`call-ctrl ${tmpclass}`}>
                    {/*<div className={`rec-sign ${this.props.recordStatus == "1" ? "display-block" : "display-hidden"}`} ><span></span>　<span> {this.state.displayrec}</span></div>*/}
                    <div style={{height:'50px',background:'#eceef3'}}>
                        <div className="ctrl-title">{this.tr("a_callconf")}</div>
                        <div className="shrink-icon" onClick={this.minimizeDialog}></div>
                    </div>
                    <div className="ctrl-line">
                        <div className="local-line">
                            <div className="confname">{this.tr("a_10032")}</div>
                            <div className="confnum"></div>
                            <div className="conftype"></div>
                            <div className="confbtn">
                                <Button id="startFECC" title={this.tr("a_19241")} disabled={localbtndisabled} style={{display: feccbtnvisile ? 'block' : 'none' }} className={startFECCClass} onClick={this.handleStartFECC.bind(this, "-1")}/>
                                <Button id="closecamera" title={this.tr("a_628")} disabled={localbtndisabled}  className={localcamerablockedclass} onClick={this.handlelocalcamera}/>
                                <Button id="localmute" title={this.tr("a_413")} disabled={localbtndisabled}  className={localmuteclass} onClick={this.handlelocalmute.bind(this, ismute)}/>
                            </div>
                        </div>
                        {
                            linestatus.map((item, i) => {
                                let disabledflag = item.acct == 1 || item.isremotehold == "1";
                                return <div className={`remote-line remote-line-${i}`}>
                                    <div className="confname">{item.name || item.num}</div>
                                    <div className="confnum">{item.acct == 1 ? (item.name || item.num) : item.num}</div>
                                    <div className="conftype">{linestatustip[i]}</div>
                                    <div className="confbtn">
                                        <Button title={this.tr("a_1")} className="endconf"
                                                onClick={this.handleEndline.bind(this, item.line, item.acct)}/>
                                        <Button className={linefeccclass[i]} style={{display: feccbtnvisile ? 'block' : 'none' }}
                                                onClick={this.handleStartFECC.bind(this, item.line)}
                                                disabled={item.enablefecc != "1" && item.feccstate != "1"}/>
                                        <Button title={this.tr("a_19241")} className={lineisvideoedclass[i]}
                                                disabled={item.acct == 1 ? false : true}
                                                onClick={this.handleuploading.bind(this, item.line, item.isvideoed)}/>
                                        <Button title={this.tr("a_16700")}
                                                disabled={disabledflag || item.isvideo == "0" ? true : false}
                                                className={item.acct == 1 ? "unconfsuspend btndisable" : linesuspendclass[i]}/>
                                        <Button title={this.tr("a_623")}
                                                disabled={disabledflag ? true : false}
                                                className={item.acct == 1 ? "confvideo btndisable" : lineconfvideoclass[i]}
                                                onClick={this.handlelinevideoswitch.bind(this, item)}
                                        />
                                        <Button title={this.tr("a_16701")}
                                                disabled={disabledflag ? true : false}
                                                className={item.acct == 1 ? "unconfblock btndisable" : lineblockclass[i]}
                                                onClick={this.handlelineblock.bind(this, item.line)}
                                        />
                                        <Button title={item.islinemute == "1" ? this.tr("a_659") : this.tr("a_649")}
                                                disabled={disabledflag ? true : false}
                                                className={item.acct == 1 ? "unmute btndisable" : linemuteclass[i]}
                                                onClick={this.handlelinemute.bind(this, item)}/>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className="call-ctrl-btn">
                        <Button title={this.tr("a_517")} className={`${ctrlbtnvisible} addmember-btn`} disabled={!this.hasipvtline()} onClick={() => {this.toogleInviteMemberModal(true)}} /> 
                        <Button title={this.tr("a_12098")} className={`${ctrlbtnvisible} ${recordclass}`}
                                style={{display: recordvisible  ? 'block': 'none'}} onClick={this.handleRecord.bind(this)}/>
                        <Button title={this.tr("a_16703")} className={`${ctrlbtnvisible} layout-btn`}
                                style={{display: this.state.is4kon ? 'none': 'block'}} onClick={() => this.toogleLayoutModal(true)}/>
                        <Button title={this.tr("a_11")} className={`${ctrlbtnvisible} ${heldclass}`} onClick={this.handleHoldall} />
                        <Button title={this.tr("a_10004")} className={`${ctrlbtnvisible} present-btn unpresen-icon ${this.props.presentation ? 'active': ''}`} onClick={() => this.tooglePresentModal(true)}/>
                        <Button title={this.tr("a_10220")} className={`${ctrlbtnvisible} ${handsupclass}`} style={{display: handsupdisplay}}  onClick={()=>this.handleHandsup()} />
                        <Button title={this.tr("a_1")}  className="end-btn" onClick={this.handleEndAll}/>
                        <div className={ctrlbtnvisible + ' left-actions'} style={{position: "absolute", right: "10px"}}>
                            <Popover
                                content={<div style={{lineHeight:'30px', cursor:'pointer'}}>
                                    <div onClick={this.handlednd}>{this.props.dndstatus == "1" ? this.tr("a_10254") : this.tr("a_10253")}</div>
                                    <div onClick={this.showDTMF}>{this.tr("a_10256")}</div>
                                    <div onClick={this.showDetails}>{this.tr("a_10015")}</div>
                                </div>}
                                trigger="click" visible={this.state.otherCtrlVisible} onVisibleChange={this.handleOtherCtrlChange}>
                                <Button type="primary" style={{width: "100px"}}>Other</Button>
                            </Popover>
                        </div>
					</div>
                    {
                        videoinvitelines.length > 0 ?
                            <VideoinviteDialog linestatus={this.props.linestatus}></VideoinviteDialog> : null
                    }
				</div>

                <FECCModal line={feccline} display={feccdisplay} handleHideModal={this.handleHideFECC}/>
                {
                    this.props.isvideo == 1 ? 
                    msfurole == -1 ?
                    <LayoutModal visible={this.state.LayoutModalVisible} onHide={() => this.toogleLayoutModal(false)} confname={linestatus[0].name || linestatus[0].num} conftype={linestatustip[0]}/> 
                    : 
                    <LayoutModel_SFU visible={this.state.LayoutModalVisible} onHide={() => this.toogleLayoutModal(false)} />
                    : null
                }
                {
                    linestatus.length >0 && this.state.detailsModalVisible?
                        <DetailsModal visible={this.state.detailsModalVisible} linestatus={this.props.linestatus} onHide={this.handlehidedetails} /> : ""
                }
                <RecordModal visible={this.state.recordModalVisible} onHide={() => this.toogleRecordModal(false)}/>
                <Modal visible={this.state.endallConfirm1Visible} className="endall-confirm" footer={null} onCancel={this.handleEndall1Cancel}>
                    <p className="confirm-content">{this.tr("a_10224")}</p>
                    <div className="modal-footer">
                        <Button type="primary" onClick={this.endConf}>{this.tr("a_10067")}</Button>
                        <Button type="primary" onClick={this.exitConf}>{this.tr("a_10225")}</Button>
                        <Button onClick={this.handleEndall1Cancel}>{this.tr("a_3")}</Button>
                    </div>
                </Modal>
                <Modal visible={this.state.endallConfirm2Visible} className="endall-confirm" footer={null} onCancel={this.handleEndall2Cancel}>
                    <p className="confirm-content">{this.state.endallConfirm2Title}</p>
                    <div className="modal-footer">
                        <Button type="primary" onClick={this.endAllCall}>{this.tr("a_2")}</Button>
                        <Button onClick={this.handleEndall2Cancel}>{this.tr("a_3")}</Button>
                    </div>
                </Modal>
                {
                    ipvtcmrinviteinfo != null ?
                        <Modal visible={ true } width={300} footer={null} closable={false} className="endall-confirm">
                            <p className="confirm-content"><span>{ipvtcmrinviteinfo.name || ""}</span><span>{this.tr("a_10218")}</span></p>
                            <div className="modal-footer">
                                <Button type="primary" onClick={()=>this.acceptipvtinvite(ipvtcmrinviteinfo.line)}>{this.tr("a_10000")}</Button>
                                <Button onClick={()=>this.rejectipvtinvite(ipvtcmrinviteinfo.line)}>{this.tr("a_19138")}</Button>
                            </div>
                        </Modal> : null
                }
                <PresentationModal visible={this.state.PresentModalVisible} onHide={() => this.tooglePresentModal(false)} />
                <InviteMemberModal visible={this.state.InviteMemberModalVisible} onHide={() => this.toogleInviteMemberModal(false)}  linestatus={linestatus}/>
                <DTMFModal visible={this.state.DTMFVisible} textdisplay={this.state.DTMFDisplay} DTMFString={this.state.DTMFString} onHide={this.hideDTMFModal}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight + 50,
    maxVolume: state.maxVolume,
    curVolume: state.curVolume,
    muteStatus: state.muteStatus,
    recordStatus: state.recordStatus,
    msgsContacts: state.msgsContacts,
    FECCStatus: state.FECCStatus,
    callFeatureInfo: state.callFeatureInfo,
    ipvrole: state.ipvrole,
    dndstatus: state.dndstatus,
    localcamerablocked: state.localcamerablocked,
    videoinvitelines: state.videoinvitelines,
    heldStatus: state.heldStatus,
    isvideo: state.isvideo,
    presentation: state.presentation,
    presentSource: state.presentSource,
    presentLineMsg: state.presentLineMsg,
    videoonlines: state.videoonlines,
    ipvtrcdallowstatus: state.ipvtrcdallowstatus,
    ipvtRecordStatus: state.ipvtRecordStatus,
    handsupStatus: state.handsupStatus,
    ipvtcmrinviteinfo: state.ipvtcmrinviteinfo,
    // sfu
    msfurole: state.msfurole
})

function mapDispatchToProps(dispatch) {
  var actions = {
	  showCallDialog: Actions.showCallDialog,
      // getMaxVolume: Actions.getMaxVolume,
      // getCurVolume: Actions.getCurVolume,
      // setVolume: Actions.setVolume,
      endCall: Actions.endCall,
      // ctrlLineRecord: Actions.ctrlLineRecord,
      getAllLineStatus: Actions.getAllLineStatus,
      getContacts:Actions.getContacts,
      promptMsg: Actions.promptMsg,
      getAcctStatus: Actions.getAcctStatus,
      ctrlLocalMute: Actions.ctrlLocalMute,
      gethdmi1state: Actions.gethdmi1state,
      getItemValues:Actions.getItemValues,
      isFECCEnable: Actions.isFECCEnable,
      ctrlFECC: Actions.ctrlFECC,
      getipvrole: Actions.getipvrole,
      endlinecall: Actions.endlinecall,
      setDndMode: Actions.setDndMode,
      ctrlLineMute: Actions.ctrlLineMute,
      blockLineOrNot: Actions.blockLineOrNot,
      ctrlvideostate: Actions.ctrlvideostate,
      conflinevideoedstate: Actions.conflinevideoedstate,
      getCameraBlocked: Actions.getCameraBlocked,
      ctrlCameraBlockState: Actions.ctrlCameraBlockState,
      endconf: Actions.endconf,
      getBFCPMode: Actions.getBFCPMode,
      confholdstate: Actions.confholdstate,
      callstatusreport: Actions.callstatusreport,
      getguicalldetailstatus: Actions.getguicalldetailstatus,
      getconfdtmf: Actions.getconfdtmf,
      setDeviceCallFeature: Actions.setDeviceCallFeature,
      getHDMI1Resolution : Actions.getHDMI1Resolution,
      gethdmione4K: Actions.gethdmione4K,
      getline4Kvideo: Actions.getline4Kvideo,
      isallowipvtrcd: Actions.isallowipvtrcd,
      handlerecord: Actions.handlerecord,
      upordownhand: Actions.upordownhand,
      acceptorejectipvtcmr: Actions.acceptorejectipvtcmr,
      setipvtcmrinviteinfo: Actions.setipvtcmrinviteinfo,
      // sfu
      getsfuconfmyrole: Actions.getsfuconfmyrole
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(CallDialog));
