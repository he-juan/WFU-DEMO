/**
 * 录像功能  GVC3220 暂废弃  移入Others
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button, Modal } from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RecordModal from './RecordModal'
import RecordModalSFU from './RecordModal_sfu'

/**
 * Record  prop: 
 * 
 * ctrlbtnvisible, recordvisible, is4kon, ishdmione4K, isline4Kvideo
 * 
 * countClickedTimes, ispause, hasipvtline
 */

class Record extends Component {
  constructor() {
    super()
    this.state = {
      recordModalVisible : false
    }
  }

  handleRecord = () => {
    if (!this.props.countClickedTimes()) {
        return false;
    }
    if (this.props.ispause()) {
        return false;
    }
    
    if((this.props.hasipvtline && this.props.ipvrole == "2") || (this.props.msfurole >= 1 && this.props.recordStatus == '0') ){
        this.setState({recordModalVisible:true});
        return;
    }

    if (this.props.is4kon) {
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

  handleContinueRecord = (flag) => {
    localStorage.removeItem('isRecorded')
    this.toogleRecordModal(flag);
  }
  render() {
    const { ctrlbtnvisible, recordStatus, ipvtRecordStatus, is4kon, ishdmione4K, isline4Kvideo, msfurole } = this.props;

    let recordvisible = (!is4kon && (!ishdmione4K || !isline4Kvideo)) || this.props.ipvtrcdallowstatus;

    if(ctrlbtnvisible== 'display-hidden' || !recordvisible) return null;

    let recordclass = "unrcd";
    if(recordStatus == "1" || ipvtRecordStatus == "1"){
        recordclass = "rcd";
    };
    return (
      <span>
        <Button title={this.tr("a_12098")} className={`${ctrlbtnvisible} ${recordclass}`} onClick={this.handleRecord.bind(this)}/>
        {
          msfurole < 1 ? 
          <RecordModal visible={this.state.recordModalVisible} onHide={() => this.toogleRecordModal(false)}/>
          :
          <RecordModalSFU visible={this.state.recordModalVisible} onHide={() => this.toogleRecordModal(false)} />
        }
        <Modal
          title="提示"
          visible={this.props.heldStatus == '0' && localStorage.getItem('isRecorded') == '1'}
          okText="确认"
          onCancel={() => this.handleContinueRecord(false)}
          onOk= {() => this.handleContinueRecord(true)}
          cancelText="取消"
          width="320"
        >
          <p style={{fontSize: 16, textAlign: 'left'}}>你要继续录像吗?</p>
        </Modal>
      </span>
    )
  }
}


const mapStateToProps = (state) => ({
  msfurole: state.msfurole,
  ipvrole: state.ipvrole,
  recordStatus: state.recordStatus,
  ipvtRecordStatus: state.ipvtRecordStatus,
  ipvtrcdallowstatus: state.ipvtrcdallowstatus,
  heldStatus: state.heldStatus
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
      promptMsg: Actions.promptMsg,
      handlerecord: Actions.handlerecord,
      handleipvtrecord: Actions.handleipvtrecord
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Record))