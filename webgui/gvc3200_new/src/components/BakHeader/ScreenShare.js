/* eslint-disable eqeqeq */
import React, { Component } from 'react'
import { message } from 'antd'
import { $t } from '@/Intl'
import { connect } from 'react-redux'
import { setWholeLoading } from '@/store/actions'

const GS_RTC = window.GS_RTC

@connect(
  state => ({}),
  dispatch => ({
    setWholeLoading: (isLoad, tips) => dispatch(setWholeLoading(isLoad, tips))
  })
)
class ScreenShare extends Component {
  state = {
    isCalled: false, // 是否call了
    isCalling: false, // 是否正在call
    isSharing: false, // 是否正在share
    rtc_enabled: true // 屏幕共享是否可用
  }

  errorCode = null

  componentDidMount () {
    setTimeout(() => {
      console.log('gsRTC ******************************', window.gsRTC)

      window.gsRTC.on('stopShareScreen', (res) => {
        console.log('STOP_SCREEN ************************' + res.codeType + '**********************')
        this.setState({
          isSharing: false
        })
      })
      window.gsRTC.on('shareScreen', (res) => {
        console.log('BEGIN_SCREEN ************************' + res.codeType + '**********************')
        this.setState({
          isSharing: true
        })
      })
    }, 1000)
  }

  getURL = () => {
    const host = process.env.NODE_ENV === 'development' ? '192.168.124.191' : window.location.host
    const protocol = window.location.protocol
    return protocol.indexOf('https:') !== -1 ? `wss://${host}/websockify` : `ws://${host}/websockify`
  }

  // 首次点击 调用call
  handleCall = (isBgScreen) => {
    this.setState({
      isCalling: true
    })
    this.props.setWholeLoading(true, $t('m_063'))
    GS_RTC.CALL(this.getURL(), res => {
      this.props.setWholeLoading(false, '')
      console.log('CALL************************' + res.codeType + '**********************')
      if (res.codeType != 200) {
        this.setState({
          rtc_enabled: false,
          isCalled: true,
          isCalling: false
        })
        message.error(res.codeType)
        this.errorCode = res.codeType
      } else {
        this.setState({
          isCalled: true,
          isCalling: false
        })
        setTimeout(() => {
          isBgScreen && this.handleClick()
        }, 1000)
      }
    })
  }

  // call 完成后 调用 beginScreen
  handleStartShare = () => {
    GS_RTC.BEGIN_SCREEN((res) => {
      // console.log('BEGIN_SCREEN ************************' + res.codeType + '**********************')
      if (res.codeType == 200) {
      } else {
        this.handleStopShare()
      }
    })
  }

  // 调用stopScreen
  handleStopShare = () => {
    GS_RTC.STOP_SCREEN((res) => {
      // console.log('STOP_SCREEN ************************' + res.codeType + '**********************')
      if (res.codeType == 200) {
        this.setState({
          isSharing: false
        })
      }
    })
  }

  handleClick = () => {
    if (navigator.mediaDevices === undefined || navigator.mediaDevices.enumerateDevices === undefined) {
      return message.error($t('m_262')) // 共享屏幕功能需要开启https.
    }

    let { isSharing, rtc_enabled, isCalled, isCalling } = this.state

    if (isCalling) {
      return false
    }

    // 是否 调用过call了， 第一次点击需求调用 call, call返回200后 再次执行handleClick
    if (!isCalled) {
      this.handleCall()
      return false
    }

    // rtc_enabled 根据 call返回是否200确定共享屏幕功能是否可用， 如果不可用 报错返回
    if (!rtc_enabled) {
      message.error(this.errorCode)
      return false
    }

    // 如果正在开启共享屏幕功能， 则点击后执行暂停
    if (isSharing) {
      this.handleStopShare()
    } else {
      this.handleStartShare()
    }
  }

  render () {
    let { isSharing } = this.state
    return (
     <>
      <span className='screen-share-btn' onClick={this.handleClick}>
        {isSharing ? $t('c_361') : $t('c_360')}
      </span>
      <span title='临时测试用' onClick={() => this.handleCall()} style={{ float: 'right', cursor: 'pointer' }}>
        建立通话
        &nbsp; &nbsp;
      </span>
     </>
    )
  }
}

export default ScreenShare
