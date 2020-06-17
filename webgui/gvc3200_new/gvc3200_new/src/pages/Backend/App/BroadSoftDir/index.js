import React from 'react'
import TabPages from '@/components/TabPages'

import NetworkDir from './NetworkDir'
import XSIServiceSet from './XSIServiceSet'

const BroadSoft = () => {
  return <TabPages routes={[
    // XSI服务设置
    { tab: 'r_085', path: '/manage/app_broadsoftdir/xsi', component: XSIServiceSet },
    // 网络目录
    { tab: 'r_086', path: '/manage/app_broadsoftdir/networkdir', component: NetworkDir }
  ]}/>
}

export default BroadSoft
