/* eslint-disable eqeqeq */
import React, { Component } from 'react'
import { message, Modal } from 'antd'
import { $t, formatMessage } from '@/Intl'
import { connect } from 'react-redux'
import { setWholeLoading } from '@/store/actions'
import { injectIntl } from 'react-intl'
import { detect } from 'detect-browser'

let SHARE_SCREEN = {}

const BROWSER = detect()
// {name: "chrome", version: "80.0.3987", os: "Linux", type: "browser"}

const isBrowserEnable = () => {
  let name = BROWSER.name
  let version = parseInt(BROWSER.version)
  if (
    (name === 'chrome' && version >= 72) ||
    (name === 'opera' && version >= 60) ||
    (name === 'firefox' && version >= 60)
    // (name === 'safari') // 不支持但是计划支持，暂开放
  ) {
    return true
  }
  return false
}

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
          this.setState({
            isSharing: false
          })
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
          } else {
            this.setState({
              isSharing: true
            })
          }
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
        if (res.codeType === 301) {
          message.error($t('m_268'))
        } else {
          message.error('Error: ' + res.codeType)
        }
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
      console.log('*************' + res.codeType)

      if (res.codeType == 200) {
      } else {
        if (res.codeType == 104) {
          this.setState({
            isSharing: false
          })
        }
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
    if (!isBrowserEnable()) {
      return Modal.info({
        title: $t('m_268')
      }) // 当前版本浏览器可能不支持屏幕共享功能
    }

    if (window.location.protocol !== 'https:') {
      return Modal.info({
        title: $t('m_262')
      })
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
