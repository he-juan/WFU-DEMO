import React, { Component } from 'react'
import { connect } from 'react-redux'
import TabPages from '@/components/TabPages'
import GeneralSettings from './GeneralSettings'
import CodecSettings from './CodecSettings'
import CallSettings from './CallSettings'

const routes = [
  { tab: 'r_014', path: '/bak/acct_ipvt/general', component: GeneralSettings },
  { tab: 'r_045', path: '/bak/acct_ipvt/codec', component: CodecSettings },
  { tab: 'r_046', path: '/bak/acct_ipvt/call', component: CallSettings }
]

@connect(
  state => ({
    IPVTExist: state.IPVTExist
  })
)
class IPVideoTalk extends Component {
  render () {
    const { IPVTExist } = this.props
    let _routes = IPVTExist !== '1' ? routes.slice(0, 1) : routes
    return (
      <TabPages
        routes={_routes}
      />
    )
  }
}

export default IPVideoTalk
