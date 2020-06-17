import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import WifiAdd from './WifiAdd'
import WifiAdvanced from './WifiAdvanced'
import WifiBasic from './WifiBasic'

const routes = [
  { tab: 'r_047', path: '/manage/network_wifi/basic', component: WifiBasic },
  { tab: 'r_048', path: '/manage/network_wifi/add', component: WifiAdd },
  { tab: 'r_022', path: '/manage/network_wifi/advanced', component: WifiAdvanced }
]

class Wifi extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
      />
    )
  }
}

export default Wifi
