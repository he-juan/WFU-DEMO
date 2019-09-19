import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import WifiAdd from './WifiAdd'
import WifiAdvanced from './WifiAdvanced'
import WifiBasic from './WifiBasic'

const routes = [
  { tab: 'r_047', path: '/bak/network_wifi/basic', component: WifiBasic },
  { tab: 'r_048', path: '/bak/network_wifi/add', component: WifiAdd },
  { tab: 'r_022', path: '/bak/network_wifi/advanced', component: WifiAdvanced }
]

class Wifi extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
        redirect={{ from: '/bak/network_wifi', to: '/bak/network_wifi/basic' }}
      />
    )
  }
}

export default Wifi
