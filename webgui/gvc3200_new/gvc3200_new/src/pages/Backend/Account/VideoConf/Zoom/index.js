import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import GeneralSettings from './GeneralSettings'
import SIPSettings from './SIPSettings'
import CodecSettings from './CodecSettings'
import CallSettings from './CallSettings'

const routes = [
  { tab: 'r_014', path: '/manage/acct_videoconf/zoom/general', component: GeneralSettings },
  { tab: 'r_044', path: '/manage/acct_videoconf/zoom/sip', component: SIPSettings },
  { tab: 'r_045', path: '/manage/acct_videoconf/zoom/codec', component: CodecSettings },
  { tab: 'r_046', path: '/manage/acct_videoconf/zoom/call', component: CallSettings }
]

class Zoom extends Component {
  componentDidUpdate (prevProps, prevState) {
    this.props.autoScroll()
  }

  render () {
    return (
      <TabPages
        routes={routes}
      />
    )
  }
}

export default Zoom
