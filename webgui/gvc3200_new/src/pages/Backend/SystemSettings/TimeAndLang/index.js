import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import Language from './Language'
import Time from './Time'

const routes = [
  { tab: 'r_049', path: '/bak/sys_timelang/time', component: Time },
  { tab: 'r_050', path: '/bak/sys_timelang/lang', component: Language }
]

class Security extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
        redirect={{ from: '/bak/sys_timelang', to: '/bak/sys_timelang/time' }}
      />
    )
  }
}

export default Security