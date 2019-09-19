import React, { Component } from 'react'
import TabPages from '@/components/TabPages'

import Syslog from './Syslog'
import Logcat from './Logcat'
import Debug from './Debug'
import Traceroute from './Traceroute'
import DeveloperMode from './DeveloperMode'
import Ping from './Ping'
import NSLookup from './NSLookup'

const routes = [
  { tab: 'r_058', path: '/bak/maintenance_trouble/syslog', component: Syslog },
  { tab: 'r_059', path: '/bak/maintenance_trouble/logcat', component: Logcat },
  { tab: 'r_060', path: '/bak/maintenance_trouble/debug', component: Debug },
  { tab: 'r_061', path: '/bak/maintenance_trouble/traceroute', component: Traceroute },
  { tab: 'r_062', path: '/bak/maintenance_trouble/developermode', component: DeveloperMode },
  { tab: 'r_069', path: '/bak/maintenance_trouble/ping', component: Ping },
  { tab: 'r_063', path: '/bak/maintenance_trouble/nslookup', component: NSLookup }
]

class Troubleshooting extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
        redirect={{ from: '/bak/maintenance_trouble/', to: '/bak/maintenance_trouble/syslog' }}
      />
    )
  }
}

export default Troubleshooting
