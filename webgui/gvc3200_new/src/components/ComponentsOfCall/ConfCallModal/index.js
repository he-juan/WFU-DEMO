/**
 * 会议记录的呼出 弹出成员选择框（通话记录以及 拨打页面, 群组 会用到）
 *
 * confMembers 结构 [{
 *  acct: "0" // 必须
    acctStr: "SIP" // 必须
    calltype: "2"
    date: "1564538505018"
    duration: "0"
    id: "765"  // 必须
    iscontact: "1"
    isvideo: "1"
    key: "log-conf-520-765"
    lvl: "1"
    name: "鲍坚宇BaoJianYu"   // 必须
    number: "3557"    // 必须
    source: "4"   // 必须
}]
 */
import React, { Component } from 'react'
import { Modal, Button, Checkbox } from 'antd'
import { parseAcct, mapToSource, deepCopy } from '@/utils/tools'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './ConfCallModal.less'
import API from '@/api'
import ScrollPage from '@/components/ScrollPage'
import { $t } from '@/Intl'

@connect(
  state => ({
    linesInfo: state.linesInfo,
    maxLineCount: state.maxLineCount
  })
)
class ConfCallModal extends Component {
  static propTypes = {
    confMembers: PropTypes.arrayOf(PropTypes.shape({
      acct: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired
    })), // 某条会议记录或群组中待拨打的成员列表
    onCancel: PropTypes.func
  }
  static defaultProps = {
    confMembers: []
  }
  state = {
    selectedMems: [], // 选中的成员
    curPage: 1 // 滚动分页
  }

  selectCallMem = (mem) => {
    let selectedMems = deepCopy(this.state.selectedMems)
    let curIndex = selectedMems.findIndex(item => { return item.number === mem.number && item.id === mem.id })
    if (curIndex > -1) {
      selectedMems.splice(curIndex, 1)
    } else {
      selectedMems.push(mem)
    }
    this.setState({
      selectedMems: selectedMems
    })
  }
  handleCall = () => {
    const { selectedMems } = this.state
    const { onCancel } = this.props
    let _selectedMems = selectedMems.map(mem => ({
      acct: mem.acct,
      source: mem.source || mapToSource(mem.calltype),
      isvideo: mem.isvideo,
      num: mem.number,
      isconf: '1'
    }))
    API.makeCall(_selectedMems)
    this.setState({
      selectedMems: []
    })
    onCancel()
  }
  // 滚动到底后回调
  handleUpdatePage = () => {
    const { curPage } = this.state
    this.setState({
      curPage: curPage + 1
    })
  }
  // 计算当前正在通话的有效线路长度， ipvt算一路，
  liveLinesLength = (linesInfo) => {
    // 先过滤掉通话失败的线路
    let tempLines1 = linesInfo.filter(item => parseInt(item.state) !== 8)
    // 再过滤掉ipvt线路
    let tempLines2 = tempLines1.filter(line => line.acct !== '1')
    // 比较tempLines1 和 tempLines1长度， 如果少于，说明有ipvt线路， 再补1
    return tempLines2.length < tempLines1.length ? tempLines2.length + 1 : tempLines2.length
  }

  render () {
    const { confMembers, onCancel, maxLineCount, linesInfo } = this.props
    const { selectedMems, curPage } = this.state
    // 最大线路数 - 通话失败（state === '8'）的线路 - 当前选中的线路
    // ipvt线路， 算一条线路(该逻辑未加)
    const isOverMax = maxLineCount - this.liveLinesLength(linesInfo) - selectedMems.length <= 0
    return (
      <Modal
        visible={confMembers.length > 0}
        title={$t('c_305')}
        transitionName=''
        maskTransitionName=''
        destroyOnClose={true}
        onCancel={onCancel}
        className='conf-call-modal'
        width={600}
        footer={
          <div className='conf-call-footer'>
            <Button onClick={onCancel}>{$t('b_005')}</Button>
            <Button type='primary' disabled={selectedMems.length === 0} onClick={this.handleCall}>{$t('b_043')}</Button>
          </div>
        }
      >
        <p className='conf-call-tip'>
          {/* 成员数量已达上限 */}
          <span style={{ display: isOverMax ? 'inline-block' : 'none' }}><i className='icons icon-info' />{$t('m_137')}({maxLineCount})</span>
        </p>
        <ScrollPage
          onLoad={this.handleUpdatePage}
          wrapperHeight={320}
          noMore={(curPage - 1) * 50 > confMembers.length}
        >
          <ul className='conf-call-list'>
            {
              confMembers.slice(0, curPage * 50).map(mem => {
                return (
                  <li key={mem.key || mem.id}>
                    <span>
                      <Checkbox
                        disabled={isOverMax && selectedMems.findIndex(item => { return item.id === mem.id && item.number === mem.number }) < 0}
                        onChange={() => this.selectCallMem(mem)}
                      />
                    </span>
                    <span>{mem.name}</span>
                    <span>{parseAcct(mem.acct)}</span>
                    <span>{mem.number}</span>
                  </li>
                )
              })
            }
          </ul>
        </ScrollPage>
      </Modal>
    )
  }
}

export default ConfCallModal
