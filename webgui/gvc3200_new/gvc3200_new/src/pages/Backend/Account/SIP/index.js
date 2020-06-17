import React, { Component } from 'react'
import TabPages from '@/components/TabPages'

import GeneralSettings from './GeneralSettings'
import CodecSettings from './CodecSettings'
import SIPSettings from './SIPSettings'
import NetworkSettings from './NetworkSettings'
import CallSettings from './CallSettings'

const routes = [
  { tab: 'r_014', path: '/manage/acct_sip/general', component: GeneralSettings },
  { tab: 'r_004', path: '/manage/acct_sip/network', component: NetworkSettings },
  { tab: 'r_044', path: '/manage/acct_sip/sip', component: SIPSettings },
  { tab: 'r_045', path: '/manage/acct_sip/codec', component: CodecSettings },
  { tab: 'r_046', path: '/manage/acct_sip/call', component: CallSettings }
]

class SIP extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
      />
    )
  }
}

export default SIP
