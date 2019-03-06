import React, { Component } from 'react'
import Enhance from "../../../mixins/Enhance"
import { Layout, Button, Popover,Modal } from "antd"
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {globalObj} from "../../../redux/actions/actionUtil"
import FECCModal from "./FECCModal";
import VideoinviteDialog from "./videoinviteDialog"
import InviteMember from './InviteMember';
import Record from './Record'
import Presentation from './Presentation'
import Layouts from './Layouts'
import Handsup from './Handsup'
import Hold from './Hold'
import EndCall from './EndCall'
import Others from './Others'
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

	// handleEndCall = () => {
    //     globalObj.isCallStatus = false;
    //     this.props.endCall(0);
	// }

	minimizeDialog = () => {
		this.props.showCallDialog(10);
		setTimeout(() => {
			this.props.showCallDialog("minimize");
		}, 1000);
	}


    // handleVolChange = (value) => {
    //     this.props.setVolume(value);
    // }

    componentWillUnmount = () => {
        clearInterval(this.callTick);
    }

    



    acceptipvtinvite = (line) => {
        this.props.acceptorejectipvtcmr(line, "1");
        this.props.setipvtcmrinviteinfo(null);
    }

    rejectipvtinvite = (line) => {
        this.props.acceptorejectipvtcmr(line, "0");
        this.props.setipvtcmrinviteinfo(null);
    }


    
    render(){
        //dialogstatus: 9-enter  10-leave  1~7-line statues 86-not found  87-timeout 88-busy
        let {callDialogStatus, linestatus, ipvtcmrinviteinfo, msfurole} = this.props;
        let videoinvitelines = "";
        if(this.props.videoinvitelines){
            videoinvitelines = this.props.videoinvitelines.split(",");
        }
        

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
                                // 打开摄像头控制
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
                                // 获取本地摄像头开启状态
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

        
        let feccbtnvisile = !this.state.is4kon && (!this.state.ishdmione4K || !this.state.isline4Kvideo);

        const _hasipvtline = this.hasipvtline()
        const _ispause = this.ispause()
        return (
            <div className={`call-dialog ant-modal-mask ${maskvisible}`}>
				<div className={`call-ctrl ${tmpclass}`}>
                    <div style={{height:'50px',background:'#eceef3'}}>
                        <div className="ctrl-title">{this.tr("a_callconf")}</div>
                        <div className="shrink-icon" onClick={this.minimizeDialog}></div>
                    </div>
                    <LinesList linestatus={linestatus} acctstatus={this.state.acctstatus} feccbtnvisile={feccbtnvisile} />
                    <div className="call-ctrl-btn">
                        {/* 添加成员按钮 */}
                        <InviteMember 
                            ctrlbtnvisible={ctrlbtnvisible} 
                            ispause={_ispause} 
                            disabled={!_hasipvtline} 
                            linestatus={linestatus} 
                        />
                        {/* 录像按钮 */}
                        <Record 
                            ctrlbtnvisible={ctrlbtnvisible}  
                            is4kon={this.state.is4kon}
                            ishdmione4K={this.state.ishdmione4K}
                            isline4Kvideo={this.state.isline4Kvideo}
                            countClickedTimes={this.countClickedTimes.bind(this)} 
                            ispause={_ispause}
                            hasipvtline={_hasipvtline}
                        />
                        
                        {/* 布局按钮 */}
                        <Layouts 
                            ctrlbtnvisible={ctrlbtnvisible} 
                            is4kon={this.state.is4kon}
                            acctstatus={this.state.acctstatus}
                            ispause={_ispause}
                            msfurole={msfurole}
                            linestatus={linestatus} 
                        />
                        
                        {/* 保持按钮 */}
                        <Hold 
                            ctrlbtnvisible={ctrlbtnvisible}
                            linestatus={linestatus}
                            countClickedTimes={this.countClickedTimes.bind(this)} 
                        />
                        
                        {/* 演示按钮 */}
                        <Presentation 
                            ctrlbtnvisible={ctrlbtnvisible}
                            ispause={_ispause}
                        />

                        {/* 举手按钮 */}
                        <Handsup 
                            ctrlbtnvisible={ctrlbtnvisible}
                            hasipvtline={_hasipvtline}
                            countClickedTimes={this.countClickedTimes.bind(this)} 
                        />

                        {/* 结束按钮 */}
                        
                        <EndCall 
                            linestatus={linestatus}

                        />


                        {/* 其他功能 */}
                        <Others
                            linestatus={linestatus}
                            ctrlbtnvisible={ctrlbtnvisible}
                            ispause={_ispause}
                            hasipvtline={_hasipvtline}
                        />
					</div>
                    {
                        videoinvitelines.length > 0 ?
                            <VideoinviteDialog linestatus={this.props.linestatus}></VideoinviteDialog> : null
                    }
				</div>
                {/* 本地摄像头控制 弹窗 */}
                <FECCModal line={feccline} display={feccdisplay} handleHideModal={this.handleHideFECC}/>
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

                
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    msgsContacts: state.msgsContacts,
    FECCStatus: state.FECCStatus,
    ipvrole: state.ipvrole,
    videoinvitelines: state.videoinvitelines,
    heldStatus: state.heldStatus,
    ipvtcmrinviteinfo: state.ipvtcmrinviteinfo,
    // sfu
    msfurole: state.msfurole
})

function mapDispatchToProps(dispatch) {
  var actions = {
	  showCallDialog: Actions.showCallDialog,
      getContacts:Actions.getContacts,
      promptMsg: Actions.promptMsg,
      getAcctStatus: Actions.getAcctStatus,
      getItemValues:Actions.getItemValues,
      ctrlFECC: Actions.ctrlFECC,
      getipvrole: Actions.getipvrole,
      getCameraBlocked: Actions.getCameraBlocked,
      getBFCPMode: Actions.getBFCPMode,
      callstatusreport: Actions.callstatusreport,
      setDeviceCallFeature: Actions.setDeviceCallFeature,
      getHDMI1Resolution : Actions.getHDMI1Resolution,
      gethdmione4K: Actions.gethdmione4K,
      getline4Kvideo: Actions.getline4Kvideo,
      isallowipvtrcd: Actions.isallowipvtrcd,
      acceptorejectipvtcmr: Actions.acceptorejectipvtcmr,
      setipvtcmrinviteinfo: Actions.setipvtcmrinviteinfo,
      // sfu
      getsfuconfmyrole: Actions.getsfuconfmyrole
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(CallDialog));
