import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import Language from './Language'
import Time from './Time'

const routes = [
  { tab: 'r_049', path: '/manage/sys_timelang/time', component: Time },
  { tab: 'r_050', path: '/manage/sys_timelang/lang', component: Language }
]

class Security extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
      />
    )
  }
}

export default Security
