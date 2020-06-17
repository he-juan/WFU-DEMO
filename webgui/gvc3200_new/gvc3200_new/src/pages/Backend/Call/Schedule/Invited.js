import React, { Component } from 'react'
import { message } from 'antd'
import { connect } from 'react-redux'
import { deepCopy } from '@/utils/tools'
import API from '@/api'
import NoData from '@/components/NoData'
import ConfSetModal from '@/components/ComponentsOfCall/ConfSetModal' // 添加或者编辑或预览会议弹窗
import InvitedConfList from './InvitedConfList'
import { getConfList } from '@/store/actions'
import { $t } from '@/Intl'
import './Schedule.less'

/**
 * schedules
 * handleSetConf
 * handleStartConf
 * handleCancelConf
 * cancelPop
 */
@connect(
  state => ({
    confInfo: state.confInfo || '',
    confList: state.confList || []
  }),
  dispatch => ({
    getConfList: () => dispatch(getConfList())
  })
)
class InvitedSchedule extends Component {
  // constructor
  constructor (props, context) {
    super(props)

    this.state = {
      displayModal: false,
      currConf: {}
    }
  }

  // 处理 冒泡和 事件传播
  cancelPop = (event) => {
    event.cancelBubble = true // true 为阻止冒泡
    event.stopPropagation() // 阻止事件的进一步传播，包括（冒泡，捕获），无参数
  }

  // 设置 modal 是否显示
  setDisplayModal = (displayModal = false, obj = {}) => {
    this.setState({
      displayModal,
      ...obj
    })
  }

  // 预览会议
  handlePreviewConf = (item = '') => {
    this.setDisplayModal(true, { currConf: item })
  }

  // 接受 或 拒接 会议 (接受状态 要拒接,拒接状态 要接受)
  handleDelConf = (e, item) => {
    this.cancelPop(e)
    API.setGoogleConfState(item.GoogleStatus === '2' ? '9' : '10', item.Id).then(res => {
      if (res.Response === 'Success') {
        message.success($t('m_027'))
      } else {
        message.success($t('m_028'))
      }
    })
  }

  // render
  render () {
    let { displayModal, currConf } = this.state
    const { confList } = this.props
    console.log(confList)

    let _schedules = deepCopy(confList)
    let _currConf = deepCopy(currConf)
    // 过滤 排序
    _schedules = _schedules.filter(item => {
      return item.InviteAcct !== '' // 过滤出非受邀请的会议
    }).sort((a, b) => {
      return a.Milliseconds - b.Milliseconds
    })

    return (
      <div className='schedule-page'>
        {/* 邀请列表 */}
        {
          _schedules.length > 0 ? <InvitedConfList
            schedules={_schedules}
            handlePreviewConf={this.handlePreviewConf}
            handleDelConf={this.handleDelConf}
          /> : <NoData tip={<p>{ $t('c_364') }</p>} />
        }
        {/* 预览会议 */}
        {
          displayModal && <ConfSetModal
            visible={displayModal}
            allDisabled={true}
            onCancel={this.setDisplayModal}
            currConf={_currConf}
            updateDate={this.handleGetSchedules}
          />
        }
      </div>
    )
  }
}

export default InvitedSchedule
