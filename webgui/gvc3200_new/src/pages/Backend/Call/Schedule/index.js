import React, { Component, Fragment } from 'react'
import TabPages from '@/components/TabPages'
import LocalSchedule from './Local'
import InvitedSchedule from './Invited'

const routes = [
  { tab: 'r_042', path: '/bak/calling_schedule/local', component: LocalSchedule },
  { tab: 'r_043', path: '/bak/calling_schedule/invited', component: InvitedSchedule }
]
class Schedule extends Component {
  // render
  render () {
    // 激活Google账户 默认false 接口暂无
    const isGoogle = false
    return (
      <Fragment>
        {
          isGoogle ? <TabPages
            routes={routes}
            redirect={{ from: '/bak/calling_schedule/', to: '/bak/calling_schedule/local' }}
          /> : <LocalSchedule/>
        }
      </Fragment>
    )
  }
}

export default Schedule
