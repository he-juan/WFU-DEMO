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
  { tab: 'r_058', path: '/manage/maintenance_trouble/syslog', component: Syslog, denyRole: 'user' },
  { tab: 'r_059', path: '/manage/maintenance_trouble/logcat', component: Logcat },
  { tab: 'r_060', path: '/manage/maintenance_trouble/debug', component: Debug },
  { tab: 'r_061', path: '/manage/maintenance_trouble/traceroute', component: Traceroute },
  { tab: 'r_062', path: '/manage/maintenance_trouble/developermode', component: DeveloperMode },
  { tab: 'r_069', path: '/manage/maintenance_trouble/ping', component: Ping, denyRole: 'user' },
  { tab: 'r_063', path: '/manage/maintenance_trouble/nslookup', component: NSLookup, denyRole: 'user' }
]

class Troubleshooting extends Component {
  render () {
    return (
      <TabPages routes={routes}/>
    )
  }
}

export default Troubleshooting
