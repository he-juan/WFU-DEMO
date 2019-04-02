/**
 * 录像功能
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button, Modal, Checkbox } from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


/***************************录像******************************************** */

class RecordModal extends Component {

  constructor(props) {
      super(props);
  }

  handlelocalrcd = () =>{
      let recordstatus = this.props.recordStatus;
      /* 0-not recording  1- in recording */
      this.props.handlerecord(recordstatus);
  }
  handleipvtrcd = () =>{
      let recordstatus = this.props.ipvtRecordStatus;
      /* 0-not recording  1- in recording */
      this.props.handleipvtrecord(recordstatus);
  }

  render() {
      let {visible, onHide, recordStatus, ipvtRecordStatus} = this.props;
      let localrcdstatusclass = "rcdstart", ipvtrcdstatusclass = "rcdstart";
      if(recordStatus == "1"){
          localrcdstatusclass = "rcdstop";
      }
      if(ipvtRecordStatus == "1"){
          ipvtrcdstatusclass = "rcdstop";
      }
      return (
          <Modal className="record-modal" title={this.tr("a_19252")} width="400px" footer={null} visible={visible} onCancel={onHide}>
              <div style={{height: "100px"}}>
                  <div>
                      <div className="localrcd recordline">
                          <div className="rcdicon"></div>
                          <div className="rcdlinename">{this.tr("a_19249")}</div>
                          <div className={localrcdstatusclass} onClick={()=>this.handlelocalrcd()}></div>
                      </div>
                      <div className="ipvtrcd recordline">
                          <div className="rcdicon"></div>
                          <div className="rcdlinename">{this.tr("a_19250")}</div>
                          <div className={ipvtrcdstatusclass} onClick={()=>this.handleipvtrcd()}></div>
                      </div>
                  </div>
              </div>
          </Modal>
      )
  }
}

RecordModal = connect((state) => ({
  recordStatus: state.recordStatus,
  ipvtRecordStatus: state.ipvtRecordStatus
}), (dispatch) => {
  const actions = {
    handlerecord: Actions.handlerecord,
    handleipvtrecord: Actions.handleipvtrecord
  }
  return bindActionCreators(actions, dispatch)
})(Enhance(RecordModal))



/***************************录像 end******************************************** */




/***************************录像SFU******************************************** */
class RecordModalSFU extends Component {
  constructor() {
    super()
    let recordSource = sessionStorage.getItem("recordSource") 
    this.state = {
      list: [],
      checkedSource: recordSource ? recordSource.split(",") : []
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.visible != this.props.visible && prevProps.visible == false) {
      this.props.getsfuvideolayoutlist((list) => {
        this.setState({
          list: list
        })
      })
    }
  }
  handleCheck = (v) => {
    if(v.length > 3) v.shift()
    this.setState({
      checkedSource: v
    })
  }
  handleSubmit = () => {
    let _checkedSource = this.state.checkedSource.join(',')
    sessionStorage.setItem("recordSource", _checkedSource)
    this.props.startconfrecording(_checkedSource)
    this.props.onHide()
  }
  render() {
    const { visible, onHide } = this.props
    const { list, checkedSource } = this.state
    return (
      <Modal visible={visible} title="录像" onCancel={onHide} okText="保存" onOk={() => this.handleSubmit()}>
        <p style={{fontSize: 16, marginBottom:20}}>请选择要录制的屏幕,最多3方:</p>
        <Checkbox.Group value={checkedSource} onChange={(v) => this.handleCheck(v)}>
        <p style={{lineHeight: '28px', overflow: 'hidden', width: 300, paddingLeft: 20}}><span>{'演示画面'}</span> <Checkbox style={{float: 'right'}} value="Content"></Checkbox></p>
          {
            list.map(v => {
              if (v.name == 'null') return null
              return <p style={{lineHeight: '28px', overflow: 'hidden', width: 300, paddingLeft: 20}}><span>{ v.name}</span> <Checkbox style={{float: 'right'}} value={v.trackId}></Checkbox></p>
            })
          }
        </Checkbox.Group>
      </Modal>
    )
  }


}


RecordModalSFU = connect(() => {}, (dispatch) => {
  const actions = {
    getsfuvideolayoutlist: Actions.getsfuvideolayoutlist,
    startconfrecording:Actions.startconfrecording
  }
  return bindActionCreators(actions, dispatch)
})(Enhance(RecordModalSFU))

/***************************录像SFU END******************************************** */


































/**
 * Record  prop: 
 * 
 * recordvisible, is4kon, ishdmione4K, isline4Kvideo
 * 
 * countClickedTimes, ispause, hasipvtline
 */

class RecordBtn extends Component {
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
    sessionStorage.removeItem('isRecorded')
    this.toogleRecordModal(flag);
  }
  render() {
    const { recordStatus, ipvtRecordStatus, is4kon, ishdmione4K, isline4Kvideo, msfurole } = this.props;

    let recordvisible = (!is4kon && (!ishdmione4K || !isline4Kvideo)) || this.props.ipvtrcdallowstatus;

    if(!recordvisible) return null;

    let recordclass = "unrcd";
    if(recordStatus == "1" || ipvtRecordStatus == "1"){
        recordclass = "rcd";
    };
    return (
      <div onClick={this.handleRecord.bind(this)}>
        { recordclass == "unrcd" ? "录像" : "取消录像"}
        {
          msfurole < 1 ? 
          <RecordModal visible={this.state.recordModalVisible} onHide={() => this.toogleRecordModal(false)}/>
          :
          <RecordModalSFU visible={this.state.recordModalVisible} onHide={() => this.toogleRecordModal(false)} />
        }
        <Modal
          title="提示"
          visible={this.props.heldStatus == '0' && sessionStorage.getItem('isRecorded') == '1'}
          okText="确认"
          onCancel={() => this.handleContinueRecord(false)}
          onOk= {() => this.handleContinueRecord(true)}
          cancelText="取消"
          width="320"
        >
          <p style={{fontSize: 16, textAlign: 'left'}}>你要继续录像吗?</p>
        </Modal>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(RecordBtn))