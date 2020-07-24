/* eslint-disable eqeqeq */
import React, { Component } from 'react'
import { message, Modal } from 'antd'
import { $t, formatMessage } from '@/Intl'
import API from '@/api'
import { connect } from 'react-redux'
import { setWholeLoading } from '@/store/actions'
import { injectIntl } from 'react-intl'
import { history } from '@/App'
import { BROWSER } from '@/utils/tools'
import URLBar from './urlbar.png'

let SHARE_SCREEN = {}
let CONFIRM_MODAL = null
let CONFIRM_TIMER = null

// {name: "chrome", version: "80.0.3987", os: "Linux", type: "browser"}

const isBrowserEnable = () => {
  let name = BROWSER.name
  let version = BROWSER.version
  if (
    (name === 'chrome' && version >= '72') ||
    (name === 'opera' && version >= '60') ||
    (name === 'firefox' && version >= '60') ||
    (name === 'edge-chromium' && version >= '79') ||
    (name === 'safari' && version >= '13.1.1')
  ) {
    return true
  }
  return false
}

// 获取演示分辨率
const getPreImgSize = (cb) => {
  API.getPvalues(['P51976']).then(res => {
    const { P51976 } = res
    cb && cb(P51976 === '9' ? '720' : '1080')
  })
}

const loadRTCjs = () => new Promise((resolve, reject) => {
  let scriptEl = document.createElement('script')
  scriptEl.src = '/gsRTC.min.js'
  scriptEl.onload = () => {
    window.GsRTC.prototype.preInit()
    window.GsRTC.prototype.getPreImgSize = getPreImgSize

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
    isSharing: false // 是否正在share
  }

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
          CONFIRM_MODAL = Modal.confirm({
            title: $t('m_263'), // 确定开始屏幕共享？
            onOk: () => {
              cb.call(window.gsRTC, true)
              window.removeEventListener('beforeunload', cancel)
              cancel = null
              clearTimeout(CONFIRM_TIMER)
            },
            onCancel: () => {
              cb.call(window.gsRTC, false)
              window.removeEventListener('beforeunload', cancel)
              cancel = null
              clearTimeout(CONFIRM_TIMER)
            }
          })
          CONFIRM_TIMER = setTimeout(() => {
            CONFIRM_MODAL && CONFIRM_MODAL.destroy()
            window.removeEventListener('beforeunload', cancel)
            cancel = null
          }, 31000)
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
          isCalled: false,
          isCalling: false
        })
        switch (res.codeType) {
          // safari
          case 403: {
            if (res.isCallSuccess === 'false') {
              this.handleClick()
            }
            break
          }
          // 4k 返回
          case 488: {
            message.error($t('m_272'))
            break
          }
          // 浏览器不支持
          case 301: {
            message.error($t('m_268'))
            break
          }
          default: {
            message.error('Error: ' + res.codeType)
          }
        }
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
        if (res.codeType == 403) {
          this.setState({
            isSharing: false
          })
          if (res.rejectAuthorizationTip === 'true') { // 火狐需要开启权限
            Modal.info({
              icon: null,
              width: 660,
              title: <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{$t('m_274')}</div>,
              content: <div style={{ textAlign: 'center', paddingTop: 20, fontSize: 12 }}><p>{$t('m_275')}</p><img src={URLBar} alt='demo'/></div>
            })
          }
        }
        if (res.codeType == 408) {
          this.setState({
            isSharing: false
          })
          message.error($t('m_271'))
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
      return Modal.confirm({
        title: $t('m_262'),
        icon: 'info-circle',
        cancelText: $t('b_069'),
        okText: $t('b_068'),
        onCancel () {
          history.push('/manage/sys_security/webssh')
        }
      })
    }

    let { isSharing, isCalled, isCalling } = this.state

    if (isCalling) {
      return false
    }

    // 是否 调用过call了， 第一次点击需求调用 call, call返回200后 再次执行handleClick
    if (!isCalled) {
      this.handleCall(true)
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
