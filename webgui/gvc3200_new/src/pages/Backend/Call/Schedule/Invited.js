import React, { Component } from 'react'
import { message } from 'antd'
import { cloneDeep, sortBy } from 'lodash'
import API from '@/api'
import NoData from '@/components/NoData'
import ConfSetModal from '@/components/ComponentsOfCall/ConfSetModal' // 添加或者编辑或预览会议弹窗
import InvitedConfList from './InvitedConfList'
import './Schedule.less'

/**
 * schedules
 * handleSetConf
 * handleStartConf
 * handleCancelConf
 * cancelPop
 */
class InvitedSchedule extends Component {
  // constructor
  constructor (props, context) {
    super(props)

    this.state = {
      schedules: [],
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

  // 获取会议记录
  handleGetSchedules = () => {
    API.getSchedules().then(({ result, msg, data }) => {
      if (+result === 0) {
        this.setState({ schedules: data.schedules })
      } else {
        message.error(msg)
      }
    })
  }

  // 预览会议
  handlePreviewConf = (item = '') => {
    this.setDisplayModal(true, { currConf: item })
  }

  // 接受 或 拒接 会议 (接受状态 要拒接,拒接状态 要接受)
  handleDelConf = (e, item) => {
    this.cancelPop(e)
    console.log(item)
  }

  // componentDidMount
  componentDidMount () {
    this.handleGetSchedules()
  }

  // render
  render () {
    let { schedules, displayModal, currConf } = this.state
    let _schedules = cloneDeep(schedules)
    let _currConf = cloneDeep(currConf)
    _schedules = sortBy(_schedules, (o) => {
      let m = +o.Milliseconds
      return m
    })

    return (
      <div className='schedule-page'>
        {/* 邀请列表 */}
        {
          _schedules.length > 0 ? <InvitedConfList
            schedules={_schedules}
            handlePreviewConf={this.handlePreviewConf}
            handleDelConf={this.handleDelConf}
          /> : <NoData tip='没有受邀请的预约会议'/>
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
