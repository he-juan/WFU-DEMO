import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance"
import { Layout, Button, Icon, Slider } from "antd"
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {globalObj} from "../../redux/actions/actionUtil"
const Content = Layout
let tmpclass = "", disacct = "", linestatustip = "",ctrlbtnvisible = "display-hidden", maskvisible = "", obj_incominginfo = new Object(), contactItems;
let dialogLeaveTimeout;
let mClicktimes = 0;
let mPreClickTime, mCurrentClickTime;

class CallDialog extends Component {
    constructor(props){
        super(props);

		this.state = {
			soundvisible: "display-hidden",
            curtime: 0,
            displaytime: "00:00:00",
            currectime: 0,
            displayrec: "00:00:00",
            callstatus: "callee-status",
            holdtype: "",
            acctstatus: []
		}
    }

    componentWillMount = () => {

    }

    componentDidMount = () => {
        globalObj.isCallStatus = true;
        if(this.props.msgsContacts.length == undefined){
            this.props.getContacts();
        }
        this.props.getAcctStatus((acctstatus) => {
            if (!this.isEmptyObject(acctstatus)) {
                this.getAcctStatusData(acctstatus);
            }
        });
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

    callTimeTick = () => {
        let curtime = this.state.curtime;
        curtime ++;
        let displayContent = this.timeConvert(curtime);
        let callholdstatus = "callee-status", holdtype = "";
        if(this.props.heldStatus == "1") {
            displayContent += ' (' + this.tr("a_inheld") + ')';
            callholdstatus = "callee-status-hold";
            holdtype = "call-type-hold";
        }
        this.setState({
            curtime: curtime,
            displaytime: displayContent,
            callstatus: callholdstatus,
            holdtype: holdtype
        });

        if(this.props.recordStatus == "1"){
            let currectime = this.state.currectime;
            currectime ++;
            this.setState({
                currectime: currectime,
                displayrec: this.timeConvert(currectime)
            })
        }else if(this.state.currectime !=0 ){
            this.setState({
                currectime: 0,
                displayrec: "00 : 00 : 00"
            });
        }
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

    handleStartFECC = () =>{
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
                        this.props.isFECCEnable("-1", (result) => {
                            if (result.res.toLowerCase() == "success" && result.flag == "true") {
                                //start FECC
                                this.props.ctrlFECC("-1", 1, (result) =>{
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

	showSoundSlider = (tag) => {
	    if(tag)
			this.setState({ soundvisible: "display-block" });
		else
			this.setState({ soundvisible: "display-hidden" });
	}

    handleVolChange = (value) => {
        this.props.setVolume(value);
    }

    handleLineMute = () => {
        this.props.ctrlLineMute(0);
    }

    handleLineRecord = () => {
        //type: 1-to start  0-to stop
        let type = 1;
        if(this.props.recordStatus == "1"){
            type = 0;
            this.setState({
                currectime: 0,
                displayrec: "00 : 00 : 00"
            });
        }

        this.props.ctrlLineRecord(0, type);
        if (this.props.recordStatus == "1") {
            this.props.promptMsg('SUCCESS', "a_recoresave");
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.callTick);
    }

    render(){
        //dialogstatus: 9-enter  10-leave  1~7-line statues 86-not found  87-timeout 88-busy
        let linestatustip = [];
        let linestatus = this.props.linestatus;
        for(let i = 0 ; i < linestatus.length; i++){
            let lineitem = linestatus[i];
            let  state= lineitem.state;
            let account = lineitem.acct;
            linestatustip[i] = "";
            switch (state) {
                case "3":
                    if (tmpclass != "call-dialog-in call-dialog-in-active") {
                        tmpclass = "call-dialog-in call-dialog-in-active";
                        maskvisible = "display-block";
                    }
                    if (dialogLeaveTimeout) {
                        clearTimeout(dialogLeaveTimeout);
                    }
                    linestatustip[i] = this.tr("a_509");
                    break;
                case "4":
                    if (tmpclass != "call-dialog-in call-dialog-in-active") {
                        tmpclass = "call-dialog-in call-dialog-in-active";
                        maskvisible = "display-block";
                    }
                    ctrlbtnvisible = "display-block";
                    if (lineitem.isvideo == 1) {
                        linestatustip[i] = this.tr("a_669");
                    } else {
                        linestatustip[i] = this.tr("a_668");
                    }
                    break;
                case "init4":
                case "init5":
                    if (tmpclass != "call-dialog-in call-dialog-in-active") {
                        tmpclass = "call-dialog-in call-dialog-in-active";
                        maskvisible = "display-block";
                    }
                    ctrlbtnvisible = "display-block";
                    if (lineitem.isvideo == 1) {
                        linestatustip[i] = this.tr("a_669");
                    } else {
                        linestatustip[i] = this.tr("a_668");
                    }
                    if(account == 8) account = 3;
                    if(this.state.acctstatus.length > 0){
                        linestatustip[i] += " (" + this.state.acctstatus[account]["name"]+")";
                    }
                    break;
            }

        }
        let ismute = linestatus[0].islocalmute == "1" ? "1" : "0";
        let localmuteclass = ismute == "1" ? "mute" : "unmute";
        let heldclass = this.props.heldStatus == "1" ? "hold-icon" : "unhold-icon";


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
                                <Button id="startFECC" title={this.tr("a_19241")}  className="startFECC" onClick={this.handleStartFECC}/>
                                <Button id="closecamera" title={this.tr("a_628")}  className="unclosecamera" />
                                <Button id="localmute" title={this.tr("a_413")}  className={localmuteclass} onClick={this.handlelocalmute.bind(this, ismute)}/>
                            </div>
                        </div>
                        {
                            linestatus.map((item, i) => {
                                return <div className={`remote-line remote-line-${i}`}>
                                    <div className="confname">{item.name || item.num}</div>
                                    <div className="confnum">{item.acct == 1 ? (item.name || item.num) : item.num}</div>
                                    <div className="conftype">{linestatustip[i]}</div>
                                    <div className="confbtn">
                                        <Button id="end" title={this.tr("a_1")} className="endconf"/>
                                        <Button id="isvideoupdating" title={this.tr("a_19241")} className="uploading"/>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className="call-ctrl-btn">
                        <Button title={this.tr("a_517")} className={`${ctrlbtnvisible} addmember-btn`} />
                        <Button title={this.tr("a_12098")} className={`${ctrlbtnvisible} rcd-btn unrcd-icon`}/>
                        <Button title={this.tr("a_16703")} className={`${ctrlbtnvisible} layout-btn`} />
                        <Button title={this.tr("a_12098")} className={`${ctrlbtnvisible} ${heldclass}`} />
                        <Button title={this.tr("a_10004")} className={`${ctrlbtnvisible} present-btn unpresen-icon`} />
                        <Button title={this.tr("a_1")}  className="end-btn" />
					</div>
				</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight + 50,
    lineInfo: state.lineInfo,
    maxVolume: state.maxVolume,
    curVolume: state.curVolume,
    muteStatus: state.muteStatus,
    recordStatus: state.recordStatus,
    msgsContacts: state.msgsContacts,
    heldStatus: state.heldStatus
})

function mapDispatchToProps(dispatch) {
  var actions = {
	  showCallDialog: Actions.showCallDialog,
      getMaxVolume: Actions.getMaxVolume,
      getCurVolume: Actions.getCurVolume,
      setVolume: Actions.setVolume,
      endCall: Actions.endCall,
      ctrlLineMute: Actions.ctrlLineMute,
      ctrlLineRecord: Actions.ctrlLineRecord,
      getAllLineStatus: Actions.getAllLineStatus,
      getContacts:Actions.getContacts,
      promptMsg: Actions.promptMsg,
      getAcctStatus: Actions.getAcctStatus,
      ctrlLocalMute: Actions.ctrlLocalMute,
      gethdmi1state: Actions.gethdmi1state,
      getItemValues:Actions.getItemValues,
      isFECCEnable: Actions.isFECCEnable,
      ctrlFECC: Actions.ctrlFECC
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(CallDialog));
