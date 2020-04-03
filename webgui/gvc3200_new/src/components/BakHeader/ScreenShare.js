/* eslint-disable eqeqeq */
import React, { Component } from 'react'
import { message } from 'antd'
import { $t } from '@/Intl'

const GS_RTC = window.GS_RTC

class ScreenShare extends Component {
  state = {
    isSharing: false,
    rtc_enabled: true
  }

  errorCode = null

  componentDidMount () {
    setTimeout(() => {
      GS_RTC.CALL(this.getURL(), res => {
        console.log('CALL************************' + res.codeType + '**********************')
        if (res.codeType != 200) {
          this.setState({
            rtc_enabled: false
          })
          this.errorCode = res.codeType
        }
      })

      console.log('gsRTC ******************************', window.gsRTC)

      window.gsRTC.on('stopShareScreen', () => {
        this.setState({
          isSharing: false
        })
      })
      window.gsRTC.on('shareScreen', () => {
        this.setState({
          isSharing: true
        })
      })
    }, 1000)
  }

  getURL = () => {
    const host = process.env.NODE_ENV === 'development' ? '192.168.125.108' : window.location.host
    const protocol = window.location.protocol
    return protocol.indexOf('https:') !== -1 ? `wss://${host}/websockify` : `ws://${host}/websockify`
  }

  handleStartShare = () => {
    GS_RTC.BEGIN_SCREEN((res) => {
      console.log('BEGIN_SCREEN ************************' + res.codeType + '**********************')
      if (res.codeType == 200) {
      } else {
        this.handleStopShare()
      }
    })
  }

  handleStopShare = () => {
    GS_RTC.STOP_SCREEN((res) => {
      console.log('STOP_SCREEN ************************' + res.codeType + '**********************')
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
    if (!this.state.rtc_enabled) {
      message.error(this.errorCode)
      return false
    }
    let { isSharing } = this.state
    if (isSharing) {
      this.handleStopShare()
    } else {
      this.handleStartShare()
    }
  }

  render () {
    let { isSharing } = this.state
    return (
      <span className='screen-share-btn' onClick={this.handleClick}>
        {isSharing ? $t('c_361') : $t('c_360')}
      </span>
    )
  }
}

export default ScreenShare
