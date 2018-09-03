import React, { Component, PropTypes } from 'react'
import Enhance from "../mixins/Enhance"
import { Layout, Button, Icon, Slider } from "antd"
import * as Actions from '../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {globalObj} from "../redux/actions/actionUtil"
const Content = Layout
let tmpclass = "", disacct = "", linestatustip = "", ctrlbtnvisible = "", maskvisible = "", curvol = "", contactItems;
let dialogLeaveTimeout;

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
            holdtype: ""
		}
    }

    componentWillMount = () => {
        this.props.getMaxVolume();

        /*the request has modified to sync since the defaultValue of Slider won't change once rendered*/
        this.props.getCurVolume((vol) => {
            curvol = Number(vol);
        });
    }

    componentDidMount = () => {
        globalObj.isCallStatus = true;
        this.props.getAllLineStatus((data) => {
            let tObj = JSON.parse(data);
            let calltime = Number(tObj['callduration']);
            let rectime = Number(tObj['recordduration']);

            if(calltime){
                let curtime = Math.round(calltime / 1000);  //unit: ms -> s
                let displayContent = this.timeConvert(curtime);
                let callholdstatus = "callee-status";
                let holdtype = "";
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

                if(rectime){
                    let currectime = Math.round(rectime / 1000)
                    this.setState({
                        currectime: currectime,
                        displayrec: this.timeConvert(currectime)
                    });
                }
                if(!this.callTick){
                    this.callTick = setInterval(() => {
                        this.callTimeTick();
                    }, 1000);
                }
            }
        });
        if(this.props.msgsContacts.length == undefined){
            this.props.getContacts();
        }
    }

    componentWillUnmount = () => {
        clearTimeout(dialogLeaveTimeout);
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
        let dialogstatus = this.props.status;
        switch (dialogstatus) {
            case 3:
                if(dialogLeaveTimeout){
                    clearTimeout(dialogLeaveTimeout);
                }
                ctrlbtnvisible = "display-hidden";
                linestatustip = "a_dialing_up";
                //no need break here
            case 9:
                if(tmpclass != "call-dialog-in call-dialog-in-active"){
                    tmpclass = "call-dialog-in call-dialog-in-active";
                    maskvisible = "display-block";
                }
                if(linestatustip == "a_intalk") dialogstatus = 4;  //to keep call type icon same after minisize the call dialog
                break;
            case 10:
                tmpclass = "call-dialog-out call-dialog-out-active";
                dialogLeaveTimeout = setTimeout(() => {maskvisible = "display-hidden"}, 1000);
                break;
            case 4:
                if(tmpclass != "call-dialog-in call-dialog-in-active"){
                    tmpclass = "call-dialog-in call-dialog-in-active";
                    maskvisible = "display-block";
                }
                ctrlbtnvisible = "display-block";
                linestatustip = "a_intalk";
                if(!this.callTick){
                    this.callTick = setInterval(() => {
                        this.callTimeTick();
                    }, 1000);
                }
                break;
            case 8:
                ctrlbtnvisible = "display-hidden";
                linestatustip = "call_failed" ;
                break;
            case 86:
                ctrlbtnvisible = "display-hidden";
                linestatustip = "call_notfound" ;
                break;
            case 87:
                ctrlbtnvisible = "display-hidden";
                linestatustip = "call_timeout" ;
                break;
            case 88:
                ctrlbtnvisible = "display-hidden";
                linestatustip = "call_busy" ;
                break;
        }

        let disname = "";
        if(!this.isEmptyObject(this.props.lineInfo)) {
            let tmp = this.props.lineInfo;
            const msgsContacts = this.props.msgsContacts;
            if (tmp['name'] != "") {
                disname = `${tmp['name']} (${tmp['num']}) `;
            }
            let contactslen = msgsContacts.length;
            for (var i = 0; i < contactslen; i++) {
                if (tmp['num'] == msgsContacts[i].Number && (msgsContacts[i].AcctIndex == tmp['acctindex'] || msgsContacts[i].AcctIndex == '-1')) {
                    disname = `${msgsContacts[i].Name} (${tmp['num']})`;
                    break;
                }
            }
            if (!disname) disname = tmp['num'];
            disacct = tmp['acct'];
        }

        return (
            <div className={`call-dialog ant-modal-mask ${maskvisible}`}>
				<div className={`call-ctrl ${tmpclass}`}>
                    <div className={`rec-sign ${this.props.recordStatus == "1" ? "display-block" : "display-hidden"}`} ><span></span>　<span> {this.state.displayrec}</span></div>
                    <div className="shrink-icon" onClick={this.minimizeDialog}></div>
                    <div className="local-num"><div></div><div>{disacct}</div></div>
					<div className="callee-icon"><div className={`mute-tip-icon ${this.props.muteStatus.status == "1" ? "display-block" : "display-hidden"}`}><span></span></div></div>
                    <p className="callee-name-num" title={disname}>{disname}</p>
                    <p className="line-status-tip"><div className={`${this.state.callstatus}`}><div className={`call-type-${dialogstatus} ${this.state.holdtype}`}></div>
                        <span>{dialogstatus == "4" ? this.state.displaytime : this.tr(linestatustip)}</span></div></p>
                    <div className="call-ctrl-btn">
    					<Button  title={this.props.muteStatus.status == "1" ? this.tr("a_callunmute"): this.tr("a_callmute")} className={`${ctrlbtnvisible} mute-btn`} onClick={this.handleLineMute}>
                            <Icon className={this.props.muteStatus.status == "1" ? "unmute-icon": "mute-icon"} />
                        </Button>
    					<Button title={this.props.recordStatus == "1" ? this.tr("a_recordstop"): this.tr("a_callrecord")} className={`${ctrlbtnvisible} rcd-btn`} onClick={this.handleLineRecord}>
                            <Icon className={this.props.recordStatus == "1" ? "stop-rcd-icon" : "rcd-icon"} />
                        </Button>
    					<Button title={this.tr("a_endcall")}  className="end-btn" onClick={this.handleEndCall}>
                            <Icon className="end-icon" />
                        </Button>
                        <div className={`sound-slider ${this.state.soundvisible}`} onMouseOver={this.showSoundSlider.bind(this, true)}  onMouseOut={this.showSoundSlider.bind(this, false)}>
    						<Slider style={{height: 180, bottom: -10}} min={1} max={this.props.maxVolume} vertical defaultValue={curvol} onAfterChange={this.handleVolChange} />
    					</div>
                        <div title={this.tr("a_adjustvol")} className={`sound-icon`} onMouseOver={this.showSoundSlider.bind(this, true)}>
                            <div className="icon-pic">
                            </div>
                        </div>
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
      promptMsg: Actions.promptMsg
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(CallDialog));
