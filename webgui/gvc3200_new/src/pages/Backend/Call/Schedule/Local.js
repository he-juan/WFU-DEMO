import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import API from '@/api'
import NoData from '@/components/NoData'
import { getLinesInfo, getConfList } from '@/store/actions'
import ConfSetModal from '@/components/ComponentsOfCall/ConfSetModal' // 添加或者编辑或预览会议弹窗
import LocalConfList from './LocalConfList'
import './Schedule.less'
import { $t } from '@/Intl'
import { deepCopy } from '@/utils/tools'

@connect(
  state => ({
    acctStatus: state.acctStatus, // 获取账号状态-所有激活账号
    linesInfo: state.linesInfo || '',
    confInfo: state.confInfo || '',
    confList: state.confList || []
  }),
  dispatch => ({
    getLinesInfo: () => dispatch(getLinesInfo()),
    getConfList: () => dispatch(getConfList())
  })
)
class LocalSchedule extends Component {
  // constructor
  constructor (props) {
    super(props)

    this.state = {
      displayModal: false,
      allDisabled: false,
      currConf: {}
    }
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
      Members: JSON.stringify(Members.map(el => {
        return {
          num: el.Number,
          acct: el.Acctid,
          isvideo: el.IsVideo,
          isconf: '1',
          source: el.RecordFrom
        }
      }))
    })
  }

  // 取消会议 option 为1 删除单个
  handleCancelConf = (event, Id, host, setstate) => {
    this.cancelPop(event)

    let callback = (res) => {
      if (res.toLowerCase() === 'success') {
        this.props.getConfList()
        message.success($t('m_027'))
      } else {
        message.error($t('m_028'))
      }
      setstate && setstate(false)
    }

    if (host) {
      if (+host === 1 || host === 'IPVT' || host === 'IPVideoTalk') {
        API.deleteOnceSchedule(Id, 5).then(({ Response: res }) => callback(res))
      } else {
        API.deleteOnceSchedule(Id, 12).then(({ Response: res }) => callback(res))
      }
    } else {
      API.deleteSchedule(Id).then(({ res }) => callback(res))
    }
  }

  // 设置会议 包含编辑 添加 预览 add  edit preview
  handleSetConf = (type = 'add', e, item = '') => {
    e && this.cancelPop(e) // 解决冒泡啥的
    // 当不为预览的情况下，判断是否有存在 非 zoom 和 bj的账号
    if (type !== 'preview') {
      const effectAccts = this.props.acctStatus.filter(v => {
        return v.activate && v.acctIndex !== 2 && v.acctIndex !== 5
      })
      if (effectAccts.length === 0) {
        message.error($t('m_259'))
        return false
      }
    }
    if (type === 'add' && item) item.Id = '' // 当前为 重新预约
    this.setDisplayModal(true, type === 'preview', { currConf: item })
  }

  // componentDidMount
  componentDidMount () {
    let { getLinesInfo } = this.props
    getLinesInfo()
  }

  // render
  render () {
    let { displayModal, allDisabled, currConf } = this.state
    const { confList } = this.props
    let _schedules = deepCopy(confList)
    let _currConf = deepCopy(currConf)

    _schedules = _schedules.filter(item => {
      return item.InviteAcct === '' // 过滤出非受邀请的会议
    })

    // 排个序
    // 按会议类型排序，进行中3>待主持2>未开始1>已结束0；
    // 待主持、进行中、未开始的会议按照开始时间正序排列，已结束的会议按照开始时间倒叙排列
    if (_schedules.length > 1) {
      const states = { state0: [], state1: [], state2: [], state3: [] }
      _schedules.forEach(item => {
        const { Confstate } = item
        states['state' + Confstate].push(item)
      })
      for (const key in states) {
        if (key === 'state0') states[key] = states[key].sort((a, b) => b.Milliseconds - a.Milliseconds) // 倒叙
        else states[key] = states[key].sort((a, b) => a.Milliseconds - b.Milliseconds) // 正序
      }
      _schedules = states['state3'].concat(states['state2'], states['state1'], states['state0'])
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
            updateDate={this.props.getConfList}
          />
        }
      </div>
    )
  }
}

export default LocalSchedule
