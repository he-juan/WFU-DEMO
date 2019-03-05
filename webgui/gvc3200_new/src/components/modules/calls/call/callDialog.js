import React, { Component } from 'react'
import Enhance from "../../../mixins/Enhance"
import { Layout, Button, Popover,Modal } from "antd"
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
import LinesList from './LinesList'

let tmpclass = "", ctrlbtnvisible = "display-hidden", maskvisible = "display-hidden";
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
        if (!this.props.msgsContacts || this.props.msgsContacts.length == undefined) {
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
    // 判断是否有ipvt通话
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

    // 结束回话
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
        // 如果是ipvt会议
        if(ipvtline){
            this.props.getipvrole(ipvtline, "closeprompt", (result)=>{
                if(result == "2"){
                    this.setState({
                        endallConfirm1Visible: true
                    })
                }else{
                    let endall2title = this.tr("a_10103");  // a_10103: 您确定要结束会议吗?
                    if(result == "1" || result == "3"){
                        endall2title = this.tr("a_19357");  // a_19357: 您确定要离开IPVT会议吗
                        for(let i = 0 ; i < linestatus.length; i++) {
                            let lineitem = linestatus[i];
                            if (lineitem.acct == 0) {
                                endall2title = this.tr("a_19354"); //a_19354: 您确定要离开IPVT会议并且结束本地会议吗?
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
        console.log(this.state.acctstatus)
        //dialogstatus: 9-enter  10-leave  1~7-line statues 86-not found  87-timeout 88-busy
        let {callDialogStatus, linestatus, recordStatus, ipvtRecordStatus, handsupStatus, ipvrole, ipvtcmrinviteinfo, msfurole} = this.props;
        let videoinvitelines = "";
        if(this.props.videoinvitelines){
            videoinvitelines = this.props.videoinvitelines.split(",");
        }
        // 保持按钮状态
        let heldclass = this.props.heldStatus == '0' ? "unhold-icon" : 'hold-icon';

        for(let i = 0 ; i < linestatus.length; i++){
            let lineitem = linestatus[i];
            let  state= lineitem.state;
            let account = lineitem.acct;
            switch (state) {
                case "3":  // 呼叫中
                case "init3":  // 呼叫中时 刷新浏览器
                    if (tmpclass != "call-dialog-in call-dialog-in-active") {
                        tmpclass = "call-dialog-in call-dialog-in-active";
                        maskvisible = "display-block";
                    }
                    if (dialogLeaveTimeout) {
                        clearTimeout(dialogLeaveTimeout);
                    }
                    ctrlbtnvisible = "display-hidden";
                    break;
                case "4": // 通话中
                case "5": //  通话中 处于保持状态
                    if (tmpclass != "call-dialog-in call-dialog-in-active") {
                        tmpclass = "call-dialog-in call-dialog-in-active";
                        maskvisible = "display-block";
                    }
                    ctrlbtnvisible = "display-block";
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
                case "init8":   // 呼叫时 点击刷新
                case "8":  // 呼叫失败
                    if (tmpclass != "call-dialog-in call-dialog-in-active") {
                        tmpclass = "call-dialog-in call-dialog-in-active";
                        maskvisible = "display-block";
                    }
                    ctrlbtnvisible = "display-hidden";
                    break;
            }
        }

        let feccInfo = this.props.FECCStatus;
        let feccline = "";
        let feccdisplay = false;
        if(feccInfo){
            feccline = feccInfo.line;
            feccdisplay = feccInfo.status == "1" ? true : false
        }
        if(callDialogStatus == 10){  //当所有线路均取消时 显示消失动画
            if(maskvisible == "display-block"){
                tmpclass = "call-dialog-out call-dialog-out-active";
                dialogLeaveTimeout = setTimeout(() => {maskvisible = "display-hidden"}, 1000);
            }
        }
        if(callDialogStatus == "9"){
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
                    <LinesList linestatus={linestatus} acctstatus={this.state.acctstatus} feccbtnvisile={feccbtnvisile} />
                    <div className="call-ctrl-btn">
                        {/* 添加成员按钮 */}
                        <Button title={this.tr("a_517")} className={`${ctrlbtnvisible} addmember-btn`} disabled={!this.hasipvtline()} onClick={() => {this.toogleInviteMemberModal(true)}} /> 
                        {/* 录像按钮 */}
                        <Button title={this.tr("a_12098")} className={`${ctrlbtnvisible} ${recordclass}`}
                                style={{display: recordvisible  ? 'block': 'none'}} onClick={this.handleRecord.bind(this)}/>
                        {/* 布局按钮 */}
                        <Button title={this.tr("a_16703")} className={`${ctrlbtnvisible} layout-btn`}
                                style={{display: this.state.is4kon ? 'none': 'block'}} onClick={() => this.toogleLayoutModal(true)}/>
                        {/* 保持按钮 */}
                        <Button title={this.tr("a_11")} className={`${ctrlbtnvisible} ${heldclass}`} onClick={this.handleHoldall} />
                        {/* 演示按钮 */}
                        <Button title={this.tr("a_10004")} className={`${ctrlbtnvisible} present-btn unpresen-icon ${this.props.presentation ? 'active': ''}`} onClick={() => this.tooglePresentModal(true)}/>
                        {/* 举手按钮 */}
                        <Button title={this.tr("a_10220")} className={`${ctrlbtnvisible} ${handsupclass}`} style={{display: handsupdisplay}}  onClick={()=>this.handleHandsup()} />
                        {/* 结束按钮 */}
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
                {/* 本地摄像头控制 弹窗 */}
                <FECCModal line={feccline} display={feccdisplay} handleHideModal={this.handleHideFECC}/>
                {/* 布局弹窗 */}
                {
                    this.props.isvideo == 1 ? 
                    msfurole == -1 ?
                    <LayoutModal visible={this.state.LayoutModalVisible} onHide={() => this.toogleLayoutModal(false)} confname={linestatus[0].name || linestatus[0].num} conftype={this.state.acctstatus[0].name}/> 
                    : 
                    <LayoutModel_SFU visible={this.state.LayoutModalVisible} onHide={() => this.toogleLayoutModal(false)} />
                    : null
                }
                {/* 通话详情 */}
                {
                    linestatus.length >0 && this.state.detailsModalVisible?
                        <DetailsModal visible={this.state.detailsModalVisible} linestatus={this.props.linestatus} onHide={this.handlehidedetails} /> : ""
                }
                {/* 开启录像弹窗 */}
                <RecordModal visible={this.state.recordModalVisible} onHide={() => this.toogleRecordModal(false)}/>
                {/* 结束会议确认框 1 列表点击成员 */}
                <Modal visible={this.state.endallConfirm1Visible} className="endall-confirm" footer={null} onCancel={this.handleEndall1Cancel}>
                    <p className="confirm-content">{this.tr("a_10224")}</p>
                    <div className="modal-footer">
                        <Button type="primary" onClick={this.endConf}>{this.tr("a_10067")}</Button>
                        <Button type="primary" onClick={this.exitConf}>{this.tr("a_10225")}</Button>
                        <Button onClick={this.handleEndall1Cancel}>{this.tr("a_3")}</Button>
                    </div>
                </Modal>
                {/* 结束会议确认框 2*/}
                <Modal visible={this.state.endallConfirm2Visible} className="endall-confirm" footer={null} onCancel={this.handleEndall2Cancel}>
                    <p className="confirm-content">{this.state.endallConfirm2Title}</p>
                    <div className="modal-footer">
                        <Button type="primary" onClick={this.endAllCall}>{this.tr("a_2")}</Button>
                        <Button onClick={this.handleEndall2Cancel}>{this.tr("a_3")}</Button>
                    </div>
                </Modal>
                {/* IPVT会议 邀请弹窗 */}
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
                {/* 演示弹窗 */}
                <PresentationModal visible={this.state.PresentModalVisible} onHide={() => this.tooglePresentModal(false)} />
                {/* 邀请成员 */}
                <InviteMemberModal visible={this.state.InviteMemberModalVisible} onHide={() => this.toogleInviteMemberModal(false)}  linestatus={linestatus}/>
                {/* 小键盘 */}
                <DTMFModal visible={this.state.DTMFVisible} textdisplay={this.state.DTMFDisplay} DTMFString={this.state.DTMFString} onHide={this.hideDTMFModal}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    recordStatus: state.recordStatus,
    msgsContacts: state.msgsContacts,
    FECCStatus: state.FECCStatus,
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
      endCall: Actions.endCall,
      getContacts:Actions.getContacts,
      promptMsg: Actions.promptMsg,
      getAcctStatus: Actions.getAcctStatus,
      gethdmi1state: Actions.gethdmi1state,
      getItemValues:Actions.getItemValues,
      isFECCEnable: Actions.isFECCEnable,
      ctrlFECC: Actions.ctrlFECC,
      getipvrole: Actions.getipvrole,
      setDndMode: Actions.setDndMode,
      getCameraBlocked: Actions.getCameraBlocked,
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
