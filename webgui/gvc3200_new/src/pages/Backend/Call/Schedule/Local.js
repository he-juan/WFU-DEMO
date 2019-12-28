import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import API from '@/api'
import NoData from '@/components/NoData'
import { getLinesInfo } from '@/store/actions'
import ConfSetModal from '@/components/ComponentsOfCall/ConfSetModal' // 添加或者编辑或预览会议弹窗
import LocalConfList from './LocalConfList'
import './Schedule.less'
import { $t } from '@/Intl'
import { deepCopy } from '@/utils/tools'

@connect(
  state => ({
    linesInfo: state.linesInfo || ''
  }),
  dispatch => ({
    getLinesInfo: () => dispatch(getLinesInfo())
  })
)
class LocalSchedule extends Component {
  // constructor
  constructor (props) {
    super(props)

    this.state = {
      schedules: [],
      displayModal: false,
      allDisabled: false,
      currConf: {}
    }
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

  // 设置 modal 是否显示
  setDisplayModal = (displayModal = false, allDisabled = false, obj = {}) => {
    this.setState({
      displayModal,
      allDisabled,
      ...obj
    })
  }

  // 处理 冒泡和 事件传播
  cancelPop = (event) => {
    event.cancelBubble = true // true 为阻止冒泡
    event.stopPropagation() // 阻止事件的进一步传播，包括（冒泡，捕获），无参数
  }

  // 立即启会
  handleStartConf = (event, { Id, Displayname, Confdnd, Confautoanswer, Members }) => {
    this.cancelPop(event)

    let { linesInfo } = this.props
    if (linesInfo.length > 0) {
      return message.error($t('m_126'))
    }
    // 开始会议了
    API.startSchedule({
      Id,
      Displayname,
      Confdnd,
      Confautoanswer,
      Members: encodeURIComponent(JSON.stringify(Members.map(el => {
        return {
          num: el.Number,
          acct: el.Acctid,
          isvideo: '1',
          isconf: '1',
          source: el.RecordFrom
        }
      })))
    })
  }

  // 取消会议 option 为1 删除单个
  handleCancelConf = (event, Id, option) => {
    this.cancelPop(event)

    let callback = (res) => {
      if (res.toLowerCase() === 'success') {
        this.handleGetSchedules()
        message.success($t('m_027'))
      } else {
        message.error($t('m_028'))
      }
    }

    if (option === 1) {
      API.deleteOnceSchedule(Id).then(({ Response: res }) => callback(res))
    } else {
      API.deleteSchedule(Id).then(({ res }) => callback(res))
    }
  }

  // 设置会议 包含编辑 添加 预览 add  edit preview
  handleSetConf = (type = 'add', e, item = '') => {
    e && this.cancelPop(e) // 解决冒泡啥的
    // let currConf = convertCurrConf(item)
    if (type === 'add' && item) item.Id = '' // 当前为 重新预约
    this.setDisplayModal(true, type === 'preview', { currConf: item })
  }

  // componentDidMount
  componentDidMount () {
    let { getLinesInfo } = this.props
    getLinesInfo()
    this.handleGetSchedules()
  }

  // render
  render () {
    let { schedules, displayModal, allDisabled, currConf } = this.state
    let _schedules = deepCopy(schedules)
    let _currConf = deepCopy(currConf)

    _schedules = _schedules.filter(item => {
      return item.InviteAcct === ''
    })
    // 排个序
    if (_schedules.length > 1) {
      _schedules = _schedules.sort((a, b) => {
        let a1 = parseInt(a.Confstate)
        let b1 = parseInt(b.Confstate)
        if (a1 === b1 && a1 !== 0) {
          return 1
        }
        return b1 - a1
      })
    }

    return (
      <div className='schedule-page'>
        <Button type='primary' style={{ margin: '16px 0' }} onClick={() => this.handleSetConf('add')}>{$t('b_048')}</Button>
        {/* 会议列表 */}
        {
          _schedules.length > 0 ? <LocalConfList
            schedules={_schedules}
            handleSetConf={this.handleSetConf}
            handleStartConf={this.handleStartConf}
            handleCancelConf={this.handleCancelConf}
            cancelPop={this.cancelPop}
          /> : <NoData tip={<p>{$t('c_244')} <span className='add-span' onClick={() => this.handleSetConf('add')}>"{$t('b_048')}"</span></p>}/>
        }
        {/* 添加 编辑 预览 会议弹窗 */}
        {
          displayModal && <ConfSetModal
            visible={displayModal}
            schedules={_schedules}
            allDisabled={allDisabled || false}
            onCancel={this.setDisplayModal}
            currConf={_currConf}
            updateDate={this.handleGetSchedules}
          />
        }
      </div>
    )
  }
}

export default LocalSchedule
