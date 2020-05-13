/**
 * 会议控制组件， 同步websocket, 控制会议各种状态如成员数量， 演示， 录像，保持等等 (TODO...)
 */
import React, { Component } from 'react'
import { MsgObserver } from '@/components/WebsocketMessage'
import { connect } from 'react-redux'
import { getMaxLineCount, getLinesInfo, setLinesInfo, getConfInfo, setConfInfo, getCallLogs } from '@/store/actions'
import { deepCopy } from '@/utils/tools'
import MiniScreen from './MiniScreen'
import RegularScreen from './RegularScreen'

@connect(
  state => ({
    linesInfo: state.linesInfo
  }),
  dispatch => ({
    getMaxLineCount: () => dispatch(getMaxLineCount()), // 获取最大线路数
    getLinesInfo: () => dispatch(getLinesInfo()), // 获取线路信息
    setLinesInfo: (linesInfo) => dispatch(setLinesInfo(linesInfo)), // 更新线路信息
    getConfInfo: () => dispatch(getConfInfo()), // 获取会议信息
    setConfInfo: (confInfo) => dispatch(setConfInfo(confInfo)), // 更新会议信息
    getCallLogs: () => dispatch(getCallLogs()) // 获取通话记录
  })
)
class ConfControl extends Component {
  state = {
    screenStatus: 'null' // mini, regular, or null
  }

  componentDidMount () {
    this.presentaionStatusChangeHandler()
    this.confStatusChangeHandler()
    this.lineStatusChangeHandler()
    this.props.getMaxLineCount() // 获取最大线路数
    this.props.getLinesInfo() // 获取线路信息
    this.props.getConfInfo() // 获取会议信息
  }

  confStatusChangeHandler = () => {
    // 订阅会议状态变化
    MsgObserver.subscribe('confStatusChange', (msg) => {
      this.props.setConfInfo(msg.data)
    })
  }

  presentaionStatusChangeHandler = () => {
    // 订阅演示状态变化
    MsgObserver.subscribe('presentaionStatusChange', (msg) => {
      this.props.getConfInfo()
    })
  }

  lineStatusChangeHandler = () => {
    // 订阅会议线路变化
    MsgObserver.subscribe('lineStatusChange', (msg) => {
      const { linesInfo, setLinesInfo } = this.props
      const { data } = msg
      let _linesInfo = deepCopy(linesInfo)
      let lineIndex = _linesInfo.findIndex(item => item.line === data.line)
      if (lineIndex > -1) {
        if (data.state !== 0 && data.state !== 7) {
          _linesInfo.splice(lineIndex, 1, data)
        } else {
          _linesInfo.splice(lineIndex, 1)
        }
      } else {
        _linesInfo.push(data)
      }
      // 更新通话记录
      if (_linesInfo.length === 0) {
        setTimeout(() => {
          this.props.getCallLogs()
        }, 200)
      }
      setLinesInfo(_linesInfo)
    })
  }

  componentWillUnMount = () => {
    MsgObserver.unsubscribe('confStatusChange')
    MsgObserver.unsubscribe('lineStatusChange')
    MsgObserver.unsubscribe('presentaionStatusChange')
  }

  render () {
    const { screenStatus } = this.state
    return (
      <>
        {
          screenStatus === 'mini' ? <MiniScreen onSwitchScreen={() => this.setState({ screenStatus: 'regular' })}/> : null
        }
        {
          screenStatus === 'regular' ? <RegularScreen onSwitchScreen={() => this.setState({ screenStatus: 'mini' })} /> : null
        }
      </>
    )
  }
}

export default ConfControl
