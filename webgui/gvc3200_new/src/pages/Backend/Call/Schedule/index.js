import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { getConfInfo, getConfAccts, getConfList } from '@/store/actions'
import { MsgObserver } from '@/components/WebsocketMessage'
import { debounce } from '@/utils/tools'
import TabPages from '@/components/TabPages'
import LocalSchedule from './Local'
import InvitedSchedule from './Invited'

const routes = [
  { tab: 'r_042', path: '/manage/calling_schedule/local', component: LocalSchedule },
  { tab: 'r_043', path: '/manage/calling_schedule/invited', component: InvitedSchedule }
]
@connect(
  state => ({
    confInfo: state.confInfo || '',
    confAccts: state.confAccts || ''
  }),
  dispatch => ({
    getConfInfo: () => dispatch(getConfInfo()),
    getConfAccts: () => dispatch(getConfAccts()),
    getConfList: () => dispatch(getConfList())
  })
)
class Schedule extends Component {
  componentDidMount () {
    const { getConfInfo, getConfAccts, getConfList } = this.props
    getConfInfo()
    getConfAccts()
    getConfList()

    // 受邀请会议记录更新
    MsgObserver.subscribe('schedule_updated', debounce(() => {
      this.props.getConfList()
    }, 800))
  }

  componentWillMount () {
    MsgObserver.unsubscribe('schedule_updated')
  }

  // componentDidUpdate
  componentDidUpdate (prevProps, prevState) {
    // 监听 props中的linesInfo，去触发会议预约列表的更新
    if (JSON.stringify(prevProps.confInfo) !== JSON.stringify(this.props.confInfo) && Object.keys(prevProps.confInfo).length !== 0) {
      setTimeout(() => {
        this.props.getConfList()
      }, 500)
    }
  }

  // render
  render () {
    const { confAccts } = this.props // confAccts 有值 则为注册了谷歌账号

    return (
      <Fragment>
        {
          confAccts ? <TabPages
            routes={routes}
            redirect={{ from: '/manage/calling_schedule/', to: '/manage/calling_schedule/local' }}
          /> : <LocalSchedule/>
        }
      </Fragment>
    )
  }
}

export default Schedule
