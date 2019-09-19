import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import GeneralSettings from './GeneralSettings'
import CodecSettings from './CodecSettings'
import CallSettings from './CallSettings'

const routes = [
  { tab: 'r_014', path: '/bak/acct_h323/general', component: GeneralSettings },
  { tab: 'r_045', path: '/bak/acct_h323/codec', component: CodecSettings },
  { tab: 'r_046', path: '/bak/acct_h323/call', component: CallSettings }
]

class H323 extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
        redirect={{ from: '/bak/acct_h323', to: '/bak/acct_h323/general' }}
      />
    )
  }
}

export default H323
