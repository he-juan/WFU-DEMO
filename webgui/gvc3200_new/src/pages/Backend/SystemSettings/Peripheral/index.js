import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import HDMI from './HDMI' // HDMI
import Camera from './Camera' // 摄像头
import WirelessMic from './WirelessMic' // 无线麦 r_076 待做
import Media from './Media' // Media r_077 待做

const routes = [
  { tab: 'r_074', path: '/manage/sys_peripheral/hdmi', component: HDMI },
  { tab: 'r_075', path: '/manage/sys_peripheral/camera', component: Camera },
  { tab: 'r_076', path: '/manage/sys_peripheral/wirelessmic', component: WirelessMic },
  { tab: 'r_077', path: '/manage/sys_peripheral/media', component: Media }
]

class Security extends Component {
  render () {
    return (
      <TabPages routes={routes}
      />
    )
  }
}

export default Security
