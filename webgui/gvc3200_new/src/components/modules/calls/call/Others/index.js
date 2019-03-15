/**
 * 其他功能: 启用勿扰模式,打开拨号键盘,通话详情..
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button, Popover} from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DetailsModal from './DetailsModal'
import DetailsModalSFU from './DetailsModal_sfu'
import DTMFModal from './DTMFModal'


class Others extends Component {
  constructor() {
    super()
    this.state = {
      DTMFString: "",
      DTMFVisible: false,
      otherCtrlVisible: false,
      detailsModalVisible:false,
    }
  }
 
  
  handlednd = () =>{
    if(this.props.hasipvtline){
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

  showDTMF = () => {
    if(this.props.ispause){
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

  showDetails = () =>{
    this.props.callstatusreport("1");
    this.setState({
        detailsModalVisible:true,
        otherCtrlVisible: false
    });
    let webcalldetailitem = [this.getReqItem("web_calldetail", ":web_calldetail", "")];
    let values = {};
    values.web_calldetail = "1";
    this.props.setItemValues(webcalldetailitem, values,"3");
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

  render() {
    const {ctrlbtnvisible, linestatus, DTMFDisplay, msfurole, acctstatus} = this.props
    return (
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

        {/* 通话详情 */}
        {
          linestatus.length > 0 && msfurole < 1 && this.state.detailsModalVisible ?
            <DetailsModal visible={this.state.detailsModalVisible} linestatus={this.props.linestatus} onHide={this.handlehidedetails} /> : ""
        }
        {
          msfurole >= 1 && this.state.detailsModalVisible ?
          <DetailsModalSFU visible={this.state.detailsModalVisible}  onHide={this.handlehidedetails} acctstatus={acctstatus}/> : ""
        }
        {/* 小键盘 */}
        <DTMFModal visible={this.state.DTMFVisible} textdisplay={DTMFDisplay} DTMFString={this.state.DTMFString} onHide={this.hideDTMFModal}/>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  msfurole: state.msfurole,
  dndstatus: state.dndstatus,
  heldStatus: state.heldStatus
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
    promptMsg: Actions.promptMsg,
    setDndMode: Actions.setDndMode,
    getconfdtmf: Actions.getconfdtmf,
    callstatusreport: Actions.callstatusreport,
    getguicalldetailstatus: Actions.getguicalldetailstatus,
    setItemValues: Actions.setItemValues,
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Others))