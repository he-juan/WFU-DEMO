import React, { Component } from 'react'
import { connect } from 'react-redux'
import TabPages from '@/components/TabPages'
import { setWholeLoading } from '@/store/actions'

import ConfigFile from './ConfigFile'
import Firmware from './Firmware'
import Provision from './Provision'
import AdvancedSettings from './AdvancedSettings'

const routes = [
  { tab: 'r_055', path: '/bak/maintenance_upgrade/firmware', component: Firmware },
  { tab: 'r_056', path: '/bak/maintenance_upgrade/configfile', component: ConfigFile },
  { tab: 'r_057', path: '/bak/maintenance_upgrade/provision', component: Provision },
  { tab: 'r_022', path: '/bak/maintenance_upgrade/advanced', component: AdvancedSettings }
]

// wholeLoading
@connect(
  state => ({
    wholeLoading: state.wholeLoading
  }),
  dispatch => ({
    setWholeLoading: (isLoad, tip) => dispatch(setWholeLoading(isLoad, tip))
  })
)
class Upgrade extends Component {
  componentWillUnmount () {
    let { wholeLoading: { isLoad }, setWholeLoading } = this.props
    if (isLoad) {
      setWholeLoading({ isLoad: false, tip: '' })
    }
  }

  render () {
    return (
      <TabPages
        routes={routes}
        redirect={{ from: '/bak/maintenance_upgrade/', to: '/bak/maintenance_upgrade/firmware' }}
      />
    )
  }
}

export default Upgrade
