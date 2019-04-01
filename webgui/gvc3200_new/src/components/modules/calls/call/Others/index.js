/**
 * 其他功能: 启用勿扰模式,打开拨号键盘,通话详情..
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button, Popover} from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DetailsBtn from './DetailsBtn'
import DTMFBtn from './DTMFBtn'
import DNDBtn from './DNDBtn'
import HoldBtn from './HoldBtn'
import RecordBtn from './RecordBtn'

class Others extends Component {
  constructor() {
    super()
    this.state = {
      otherCtrlVisible: false,
    }
  }
 
  


  

  handleOtherCtrlChange = (visible) => {
    this.setState({ otherCtrlVisible: visible });
  }

  render() {
    const {ctrlbtnvisible, linestatus, DTMFDisplay, hasipvtline, acctstatus, ispause, is4kon, ishdmione4K, isline4Kvideo, countClickedTimes} = this.props
    return (
      <div className={ctrlbtnvisible + ' left-actions'} style={{position: "absolute", right: "10px"}}>
        <Popover
          content={<div style={{lineHeight:'30px', cursor:'pointer'}}>
            {/* 录像 */}
            <RecordBtn is4kon={is4kon} ishdmione4K={ishdmione4K} isline4Kvideo={isline4Kvideo} countClickedTimes={countClickedTimes} ispause={ispause}  hasipvtline={hasipvtline}/>
            {/* 保持 */}
            <HoldBtn ctrlbtnvisible={ctrlbtnvisible} linestatus={linestatus} />
            {/* DND */}
            <DNDBtn  hasipvtline={hasipvtline}/>
            {/* DTMF */}
            <DTMFBtn DTMFDisplay={DTMFDisplay} ispause={ispause} hideOtherCtrl={() => this.handleOtherCtrlChange(false)} />
            {/* 通话详情 */}
            <DetailsBtn acctstatus={acctstatus} linestatus={linestatus} hideOtherCtrl={() => this.handleOtherCtrlChange(false)} ispause={ispause}/>
          </div>}

          trigger="click" visible={this.state.otherCtrlVisible} onVisibleChange={this.handleOtherCtrlChange}>
          <Button type="primary" style={{width: "100px"}}>Other</Button>
        </Popover>
        
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  recordStatus: state.recordStatus
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Others))