/**
 * 演示功能
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { Button, Modal, Popover, message, Tooltip } from "antd"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


const preSourceMap = {
  1: 'HDMI IN',
  2: 'Wi-Fi Display'
}

class Presentation extends Component {
  constructor () {
    super()
    this.state = {
      PresentModalVisible: false,
      presentPopoverVisible: false
    }
  }
  tooglePresentModal = (visible) => {
    if(visible == true && this.props.ispause()) {
        return;
    }
    this.setState({
        PresentModalVisible: visible
    })
  }
  tooglePopover = (visible) => {
    if(visible == true && this.props.ispause()) {
      return;
    }
    this.setState({
      presentPopoverVisible: visible
    })
  }
  handlePresentClick = () => {
    const { source, state } = this.props.preState
    let len = source.length
    if(len == 1) {
      // 直接开启演示
      this.setPresetationState(state != -1 ? -1 : source[0])
    } else {
      this.tooglePresentModal(true)
    }
  }
  setPresetationState = (state) => {
    let _this = this
    $.ajax({
      url: `/manager?action=setpresentationstate&state=${state}`,
      method: 'GET',
      dataType: 'json',
      success: function(m){
        if(m.result == 0) {
          message.success(_this.tr('a_64'))
        } else {
          message.error(_this.tr('a_63'))

        }
      }
    })
  }
  componentDidMount = () => {
    this.props.getPreState()
  }
  componentDidUpdate = (prevProps) => {
  }
  render() {
    const {PresentModalVisible, presentPopoverVisible} = this.state
    const { preState } = this.props
    if(!preState) return null
    let { source, state } = preState
    let len = source.length
    
    if(len == 0) return null
    if(state == 0) {
      return (
        <Tooltip placement='top' title={this.tr('a_23582')}>
          <span style={{color: '#8b8a8a'}}>
            <Button className={`present-btn`} disabled={true} /> 
            <br />
            {this.tr('a_10004')}
          </span>
        </Tooltip>
      )
    }
    return (
      <span>
        {
          (len > 1 && state != -1)  //如果多个演示源 且正在演示中
          ? 
          <Popover trigger="click" placement='topRight' visible={presentPopoverVisible} content={
            <div className='menu-popover'>
              <div onClick={() => {this.setPresetationState(-1); this.tooglePopover(false)}}>{this.tr('a_19359')}</div>
              <div onClick={() => {this.tooglePresentModal(true); this.tooglePopover(false)}}>{this.tr('a_23581')}</div>
            </div>
          }>
            <Button  className={`present-btn ${state != -1 ? 'active': ''}`} onClick={() => this.tooglePopover(true)}/> 
          </Popover> 
          :
          <Button className={`present-btn ${state != -1 ? 'active': ''}`}  onClick={() => this.handlePresentClick()}/> 

        }
        <br />
        {state == -1  ? this.tr('a_10004') : len > 1 ? this.tr('a_10004') : this.tr("a_19359") }
        <Modal
          visible={PresentModalVisible}
          title={this.tr('a_23580')}
          width={400}
          style={{ top: '350px' }}
          onCancel={() => this.tooglePresentModal(false)}
          footer={null}
        >
          <ul className='presource-type-list'>
            {
              source.map(i => {
                return <li onClick={() => {this.setPresetationState(i); this.tooglePresentModal(false)}}  key={i}>
                  <span className={`presource-${i} ${ i == state ? 'active' : ''}`}></span>
                  {preSourceMap[i]}
                </li>
              })
            }
          </ul>
        </Modal>
      </span>
    )
  }
}

const mapStateToProps = (state) => ({
  preState: state.preState,
  locale: state.curLocale
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
    getPreState: Actions.getPreState
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Presentation))