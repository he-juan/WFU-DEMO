/* eslint-disable eqeqeq */
import React, { Component } from 'react'
import { message, Modal } from 'antd'
import { $t, formatMessage } from '@/Intl'
import { connect } from 'react-redux'
import { setWholeLoading } from '@/store/actions'
import { injectIntl } from 'react-intl'

let SHARE_SCREEN = {}

const loadRTCjs = () => new Promise((resolve, reject) => {
  let scriptEl = document.createElement('script')
  scriptEl.src = '/gsRTC.min.js'
  scriptEl.onload = () => {
    window.GsRTC.prototype.preInit()

    SHARE_SCREEN.CALL = window.call
    SHARE_SCREEN.BEGIN_SCREEN = window.beginScreen
    SHARE_SCREEN.PAUSE_PRESENT = window.pausePresent
    SHARE_SCREEN.STOP_SCREEN = window.stopScreen
    SHARE_SCREEN.HANG_UP = window.hangUP

    resolve()
  }
  document.body.appendChild(scriptEl)
})

// redux connect 和 react-intl context 似乎有冲突，导致其不能更新
@injectIntl
@connect(
  state => ({
    confInfo: state.confInfo
  }),
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
    loadRTCjs().then(() => {
      setTimeout(() => {
        console.log('gsRTC ******************************')
        // web关闭演示的回调
        window.gsRTC.on('stopShareScreen', (res) => {
          console.log('STOP_SCREEN ************************' + res.codeType + '**********************')
          // 停止共享后挂断线路 （挂断有问题, 回调不会执行）
          SHARE_SCREEN.HANG_UP((res) => {
            console.log('HANG_UP ************************' + res.codeType + '**********************')
          })
          // 这段本应该放在HANG_UP回调内部
          setTimeout(() => {
            this.setState({
              isCalled: false,
              isSharing: false
            })
          }, 300)
        })
        // web开演示的回调
        window.gsRTC.on('shareScreen', (res) => {
          console.log('BEGIN_SCREEN ************************' + res.codeType + '**********************')
          if (+res.codeType !== 200) {
            message.error(formatMessage({ id: 'm_267' }, { n: res.codeType }))
            this.setState({
              isSharing: false,
              isCalling: false
            })
          }
          this.setState({
            isSharing: true
          })
        })

        // gs_phone请求开启演示
        window.gsRTC.on('shareScreenRequest', (cb) => {
          Modal.destroyAll()
          let cancel = () => {
            cb.call(window.gsRTC, false)
          }
          // 页面刷新前手动拒绝
          window.addEventListener('beforeunload', cancel)
          Modal.confirm({
            title: $t('m_263'), // 确定开始屏幕共享？
            onOk: () => {
              cb.call(window.gsRTC, true)
              window.removeEventListener('beforeunload', cancel)
              cancel = null
            },
            onCancel: () => {
              cb.call(window.gsRTC, false)
              window.removeEventListener('beforeunload', cancel)
              cancel = null
            }
          })
        })
        // gs_phone请求关闭演示
        window.gsRTC.on('stopShareScreenRequest', (cb) => {
          Modal.destroyAll()
          // 直接关闭
          this.setState({
            isSharing: false
          })
          cb.call(window.gsRTC, true)
        })
        // gs_phone请求结束通话
        window.gsRTC.on('hangupRequest', (cb) => {
          Modal.destroyAll()
          this.setState({
            isSharing: false,
            isCalled: false
          })
          cb.call(window.gsRTC, true)
        })
      }, 300)
    })
  }

  getURL = () => {
    const host = window.location.host
    const protocol = window.location.protocol
    return protocol.indexOf('https:') !== -1 ? `wss://${host}/websockify` : `ws://${host}/websockify`
  }

  // 首次点击 调用call
  handleCall = (isBgScreen) => {
    this.setState({
      isCalling: true
    })
    this.props.setWholeLoading(true, $t('m_063'))
    SHARE_SCREEN.CALL(this.getURL(), res => {
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
        }, 500)
      }
    })
  }

  // call 完成后 调用 beginScreen
  handleStartShare = () => {
    SHARE_SCREEN.BEGIN_SCREEN((res) => {
      // console.log('BEGIN_SCREEN ************************' + res.codeType + '**********************')
      if (res.codeType == 200) {
      } else {
        this.handleStopShare()
      }
    })
  }

  // 调用stopScreen
  handleStopShare = () => {
    SHARE_SCREEN.STOP_SCREEN((res) => {
      // console.log('STOP_SCREEN ************************' + res.codeType + '**********************')
      if (res.codeType == 200) {
        this.setState({
          isSharing: false
        })
      }
    })
  }

  handleClick = () => {
    if (window.location.protocol !== 'https:') {
      return message.error($t('m_262')) // 共享屏幕功能需要开启https.
    }

    if (navigator.mediaDevices === undefined || navigator.mediaDevices.enumerateDevices === undefined) {
      return message.error($t('m_268')) // 当前版本浏览器可能不支持屏幕共享功能，推荐使用最新版本的chrome或火狐浏览器。
    }

    let { isSharing, rtc_enabled, isCalled, isCalling } = this.state

    if (isCalling) {
      return false
    }

    // 是否 调用过call了， 第一次点击需求调用 call, call返回200后 再次执行handleClick
    if (!isCalled) {
      this.handleCall(true)
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
    let { isReceivePresentation, idleConfSeat } = this.props.confInfo

    let isDisabled = (+idleConfSeat === 0 || isReceivePresentation) && !isSharing

    return (
     <>
      <span
        className={`screen-share-btn ${isDisabled ? 'disabled' : ''}`}
        onClick={ isDisabled ? () => {} : this.handleClick}
      >
        {isSharing ? $t('c_361') : $t('c_360')}
      </span>
      {/* <span onClick={() => this.handleCall()} style={{ float: 'right', cursor: 'pointer' }}>
        {$t('c_367')}
        &nbsp; &nbsp;
      </span> */}
     </>
    )
  }
}

export default ScreenShare
