import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import GeneralSettings from './GeneralSettings'
import CodecSettings from './CodecSettings'
import CallSettings from './CallSettings'

const routes = [
  { tab: 'r_014', path: '/bak/acct_bj/general', component: GeneralSettings },
  { tab: 'r_045', path: '/bak/acct_bj/codec', component: CodecSettings },
  { tab: 'r_046', path: '/bak/acct_bj/call', component: CallSettings }
]

class BlueJeans extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
        redirect={{ from: '/bak/acct_bj', to: '/bak/acct_bj/general' }}
      />
    )
  }
}

export default BlueJeans