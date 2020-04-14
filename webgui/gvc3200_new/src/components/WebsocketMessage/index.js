import React, { PureComponent } from 'react'
import InitWebsocket from './InitWebsocket'
import MsgObserver from './Observer'

const DEV = process.env.NODE_ENV === 'development'

class WebsocketMessage extends PureComponent {
  getURL = () => {
    const host = window.location.host
    const protocol = window.location.protocol
    return protocol.indexOf('https:') !== -1 ? `wss://${host}/tcp_proxy` : `ws://${host}/tcp_proxy`
  }

  onOpen = () => {
    this.refWebsocket.sendMessage('open\n')
  }

  onMessage = (data) => {
    let megAry = JSON.parse(`[${data.replace(/,$/, '')}]`)
    megAry.forEach(msg => {
      this.handleMessage(msg)
    })
  }

  handleMessage = (msg) => {
    DEV && console.log(msg)
    switch (msg.type) {
      // 会议控制相关
      case 'conf-status-changed':
        MsgObserver.trigger('confStatusChange', msg)
        break
      // 通话线路
      case 'line-status-changed':
        MsgObserver.trigger('lineStatusChange', msg)
        break
      // 演示状态
      case 'presentaion-status-changed':
        MsgObserver.trigger('presentaionStatusChange', msg)
        break
      // 勿扰模式
      case 'dnd':
        MsgObserver.trigger('dnd', msg)
        break
      // 固件安装
      case 'install':
        MsgObserver.trigger('install', msg)
        break
      // 睡眠
      case 'goto_sleep':
        MsgObserver.trigger('goto_sleep', msg)
        break
      // 通话记录更新
      case 'calllog_updated':
        MsgObserver.trigger('calllog_updated', msg)
        break
      // 联系人更新
      case 'contacts_updated':
        MsgObserver.trigger('contacts_updated', msg)
        break
      // 受邀请会议记录更新
      case 'schedule_updated':
        MsgObserver.trigger('schedule_updated', msg)
        break
      default:
    }
  }

  render () {
    return (
      <InitWebsocket ref={(el) => { this.refWebsocket = el }} onMessage={this.onMessage} url={this.getURL()} onOpen={this.onOpen} debug={DEV} reconnect={true}/>
    )
  }
}

export { MsgObserver }
export default WebsocketMessage
