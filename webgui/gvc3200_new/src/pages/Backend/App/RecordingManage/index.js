import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import RecordingList from './RecordingList'
import RecordingConifg from './RecordingConfig'

const routes = [
  { tab: 'r_080', path: '/manage/app_record/list', component: RecordingList },
  { tab: 'r_079', path: '/manage/app_record/config', component: RecordingConifg }

]

class RecordingManage extends Component {
  render () {
    return (
      <TabPages
        routes={routes}
      />
    )
  }
}

export default RecordingManage
