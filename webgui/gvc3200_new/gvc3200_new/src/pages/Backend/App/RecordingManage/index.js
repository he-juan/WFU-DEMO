import React, { Component } from 'react'
import TabPages from '@/components/TabPages'
import VideoList from './VideoList'
import AudioList from './AudioList'
import RecordingConifg from './RecordingConfig'
import './index.less'

const routes = [
  { tab: 'r_080', path: '/manage/app_record/videos', component: VideoList },
  { tab: 'r_081', path: '/manage/app_record/audios', component: AudioList },
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
