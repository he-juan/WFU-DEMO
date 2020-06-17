import React, { Component } from 'react'
import TabPages from '@/components/TabPages'

import Syslog from './Syslog' // 系统日志
import Logcat from './Logcat' // 信息日志
import Debug from './Debug' // 调试
import Traceroute from './Traceroute' // 路由跟踪
import DeveloperMode from './DeveloperMode' // 开发者模式
import Ping from './Ping' // Ping
import NSLookup from './NSLookup' // 域名查询
import Remotediagnosis from './Remotediagnosis' // 远程诊断

const routes = [
  { tab: 'r_058', path: '/manage/maintenance_trouble/syslog', component: Syslog, denyRole: 'user' },
  { tab: 'r_059', path: '/manage/maintenance_trouble/logcat', component: Logcat },
  { tab: 'r_060', path: '/manage/maintenance_trouble/debug', component: Debug },
  { tab: 'r_061', path: '/manage/maintenance_trouble/traceroute', component: Traceroute },
  { tab: 'r_062', path: '/manage/maintenance_trouble/developermode', component: DeveloperMode },
  { tab: 'r_069', path: '/manage/maintenance_trouble/ping', component: Ping, denyRole: 'user' },
  { tab: 'r_063', path: '/manage/maintenance_trouble/nslookup', component: NSLookup, denyRole: 'user' },
  { tab: 'r_071', path: '/manage/maintenance_trouble/remotediagnosis', component: Remotediagnosis }
]

class Troubleshooting extends Component {
  render () {
    return (
      <TabPages routes={routes}/>
    )
  }
}

export default Troubleshooting
