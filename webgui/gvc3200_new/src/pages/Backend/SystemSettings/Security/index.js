import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import WebSSHAccess from './WebSSHAccess'
import UserInfoManage from './UserInfoManage'
import ScreenLock from './ScreenLock'
import SIPTLS from './SIPTLS'
import CertManage from './CertManage'

const routes = [
  { tab: 'r_051', path: '/manage/sys_security/webssh', component: WebSSHAccess },
  { tab: 'r_052', path: '/manage/sys_security/userinfo', component: UserInfoManage },
  { tab: 'r_053', path: '/manage/sys_security/screenlock', component: ScreenLock },
  { tab: 'r_068', path: '/manage/sys_security/siptls', component: SIPTLS },
  { tab: 'r_054', path: '/manage/sys_security/certmanage', component: CertManage }
]

class Security extends Component {
  render () {
    return (
      <TabPages routes={routes}
      />
    )
  }
}

export default Security
