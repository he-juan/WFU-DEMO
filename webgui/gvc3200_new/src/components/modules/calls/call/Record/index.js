/**
 * 录像功能
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button } from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RecordModal from './RecordModal'

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
    if (this.props.ispause) {
        return false;
    }
    
    if(this.props.hasipvtline && this.props.ipvrole == "2"){
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

  render() {
    const { ctrlbtnvisible, recordStatus, ipvtRecordStatus, is4kon, ishdmione4K, isline4Kvideo } = this.props;

    let recordvisible = (!is4kon && (!ishdmione4K || !isline4Kvideo)) || this.props.ipvtrcdallowstatus;

    if(ctrlbtnvisible== 'display-hidden' || !recordvisible) return null;

    let recordclass = "unrcd";
    if(recordStatus == "1" || ipvtRecordStatus == "1"){
        recordclass = "rcd";
    };
    return (
      <span>
        <Button title={this.tr("a_12098")} className={`${ctrlbtnvisible} ${recordclass}`} onClick={this.handleRecord.bind(this)}/>
        <RecordModal visible={this.state.recordModalVisible} onHide={() => this.toogleRecordModal(false)}/>
      </span>
    )
  }
}


const mapStateToProps = (state) => ({
  ipvrole: state.ipvrole,
  recordStatus: state.recordStatus,
  ipvtRecordStatus: state.ipvtRecordStatus,
  ipvtrcdallowstatus: state.ipvtrcdallowstatus
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