/**
 * 其他功能: 启用勿扰模式,打开拨号键盘,通话详情..
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button, Popover} from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CallDetailsBtn from './CallDetailsBtn'
import ConfDetailsBtn from './ConfDetailBtn'
import DTMFBtn from './DTMFBtn'
import DNDBtn from './DNDBtn'
import HoldBtn from './HoldBtn'
import RecordBtn from './RecordBtn'
import HandsupBtn from './HandsupBtn'

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
    const {msfurole,linestatus, DTMFDisplay, hasipvtline, acctstatus, ispause, is4kon, ishdmione4K, isline4Kvideo, countClickedTimes} = this.props
    return (
      <span >
        <Popover
        
          content={<div  className='menu-popover'>
            {/* 录像 */}
            <RecordBtn is4kon={is4kon} ishdmione4K={ishdmione4K} isline4Kvideo={isline4Kvideo} countClickedTimes={countClickedTimes} ispause={ispause}  hasipvtline={hasipvtline}/>
            {/* 保持 */}
            { 
              msfurole < 1 ?
              <HoldBtn linestatus={linestatus} />  
              : null
              }
            {/* 举手 */}
            <HandsupBtn hasipvtline={hasipvtline} countClickedTimes={countClickedTimes} />
            {/* DND */}
            <DNDBtn  hasipvtline={hasipvtline}/>
            {/* DTMF */}
            <DTMFBtn DTMFDisplay={DTMFDisplay} ispause={ispause} hideOtherCtrl={() => this.handleOtherCtrlChange(false)} />
            {/* 通话详情 */}
            <CallDetailsBtn acctstatus={acctstatus} linestatus={linestatus} hideOtherCtrl={() => this.handleOtherCtrlChange(false)} ispause={ispause}/>
            {/** 会议详情 */}
            <ConfDetailsBtn acctstatus={acctstatus} linestatus={linestatus} hideOtherCtrl={() => this.handleOtherCtrlChange(false) } ispause={ispause}/>
          </div>}
          trigger="click" 
          visible={this.state.otherCtrlVisible} 
          onVisibleChange={this.handleOtherCtrlChange}
          // getPopupContainer={(el) => el}
          placement="topRight"
          
          >
          <Button type="primary" className='menu-btn' ></Button> 
        </Popover>
          <br/>   
          {'菜单'}
      </span>
    )
  }
}


const mapStateToProps = (state) => ({
  msfurole: state.msfurole
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Others))