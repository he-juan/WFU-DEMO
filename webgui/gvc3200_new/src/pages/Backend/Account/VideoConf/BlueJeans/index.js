import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import GeneralSettings from './GeneralSettings'
import CodecSettings from './CodecSettings'
import CallSettings from './CallSettings'

const routes = [
  { tab: 'r_014', path: '/manage/acct_videoconf/bj/general', component: GeneralSettings },
  { tab: 'r_045', path: '/manage/acct_videoconf/bj/codec', component: CodecSettings },
  { tab: 'r_046', path: '/manage/acct_videoconf/bj/call', component: CallSettings }
]

class BlueJeans extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
      />
    )
  }
}

export default BlueJeans
