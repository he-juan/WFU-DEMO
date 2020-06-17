import React, { Component } from 'react'
import { Button, Pagination, Modal, message } from 'antd'
import NoData from '@/components/NoData'
import { connect } from 'react-redux'
import { getCallLogs, getConfAccts } from '@/store/actions'
import CallHistoryList from './CallHistoryList'
import { parseAcct, mapToSource } from '@/utils/tools'
import API from '@/api'
import './CallHistory.less'
import { $t } from '@/Intl'

@connect(
  state => ({
    acctStatus: state.acctStatus, // 获取账号状态-所有激活账号
    callLogs: state.callLogs,
    contacts: state.contacts
  }),
  dispatch => ({
    getCallLogs: () => { dispatch(getCallLogs()) },
    getConfAccts: () => dispatch(getConfAccts())
  })
)
class CallHistory extends Component {
  state = {
    curPageData: [], // 当页通话记录解析后的数据
    curPage: 1, // 当前页
    pageNum: 10, // 当前每页显示数量
    selectedLogs: [], // 选中的记录
    isAutoVideo: '0'
  }

  componentDidMount () {
    this.props.getConfAccts() // 主动获取一次 会议预约的账号
    this.updateCurPageData()
    API.getPvalues(['P25023']).then(data => {
      this.setState({
        isAutoVideo: data.P25023
      })
    })
  }

  componentDidUpdate (preProps, preState) {
    // 当通话记录源数据， 页码， 每页显示数修改后， 更新当前页的记录数据
    if (preProps.callLogs !== this.props.callLogs || preState.curPage !== this.state.curPage || preState.pageNum !== this.state.pageNum) {
      this.updateCurPageData()
    }
    // 当删除完最后一页时， 页码向前移动一页， 否则会出现空页面的问题
    if (preState.curPageData.length > 0 && this.state.curPageData.length === 0) {
      this.setState({
        curPage: Math.max(0, this.state.curPage - 1)
      })
    }
  }

  // 该方法处理一些数据如key, child等，减少一些后续渲染时的判断
  updateCurPageData = () => {
    const { callLogs } = this.props
    const { curPage, pageNum } = this.state
    const curPageLogs = callLogs.slice((curPage - 1) * pageNum, curPage * pageNum)
    const result = curPageLogs.map(log => {
      let r0 = {}
      if (log.isconf === '1') {
        r0 = {
          ...log,
          key: `log-conf-${log.confid}`,
          lvl: '0'
        }
        if (log.members) {
          r0.child = log.members.map(mem => {
            let r1 = {
              ...mem,
              key: `${r0.key}-${mem.id}`,
              acctStr: parseAcct(mem.acct),
              source: mapToSource(mem.calltype),
              lvl: '1'
            }
            return r1
          })
        }
      } else { // 单路通话， 如果是单路通话则将list中的第一条记录添加为第一级数据
        let rcd0 = log.list[0]
        const { list, ...rest } = Object.assign({}, log, rcd0)
        r0 = {
          ...rest,
          key: `log-single-${rcd0.id}`,
          source: mapToSource(rcd0.calltype),
          lvl: '0'
        }
        r0.child = list.map(rcd => {
          let r1 = {
            ...rcd,
            key: `${r0.key}-${rcd.id}-${rcd.calltype}`,
            acctStr: parseAcct(rcd.acct),
            source: mapToSource(rcd.calltype),
            lvl: '1'
          }
          return r1
        })
      }
      return r0
    })
    this.setState({
      curPageData: result
    })
  }

  // 跳转分页
  handlePageChange = (v) => {
    this.setState({
      curPage: v,
      selectedLogs: []
    })
  }

  // 调整每页显示数
  handlePageNumChange = (cur, size) => {
    this.setState({
      pageNum: size
    })
  }

  // 选中行或取消选中行
  handleSelectRow = (items) => {
    this.setState({
      selectedLogs: items
    })
  }

  // 删除选中的记录
  handleDeleteLog = () => {
    const { selectedLogs } = this.state
    const { getCallLogs } = this.props
    Modal.confirm({
      title: $t('m_152'), // 是否确定删除所选通话记录
      onOk: () => {
        let selectedCalls = []
        let selectedConfs = []
        selectedLogs.forEach(log => {
          if (log.isconf === '0') {
            log.child.forEach(item => {
              if (item.calltype === '3') { // 只有未接来电(calltype 为 3)才调删除单路会议的接口
                selectedCalls.push(item.id)
              } else {
                selectedConfs.push(item.id)
              }
            })
          } else {
            selectedConfs.push(log.confid)
          }
        })
        Promise.all([
          selectedCalls.length && API.removeCall(selectedCalls.join(','), 2),
          selectedConfs.length && API.removeCallConf(selectedConfs.join(','))
        ]).then(msg => {
          if (msg.filter(m => m.res === 'error').length === 0) {
            message.success($t('m_013')) // 删除成功！
            this.setState({
              selectedLogs: []
            })
            setTimeout(() => {
              getCallLogs() // 删除后重新获取一遍通话记录
            }, 200)
          } else {
            message.error($t('m_014')) // 删除失败!
          }
        })
      }
    })
  }

  // 清空所有
  handleClearAll = () => {
    const { getCallLogs } = this.props
    Modal.confirm({
      title: $t('m_153'), // 是否确定要清空通话记录
      onOk: () => {
        API.clearAllCallHistory().then(m => {
          if (m.res === 'success') {
            message.success($t('m_013')) // 删除成功！
            this.setState({
              selectedLogs: []
            })
            setTimeout(() => {
              getCallLogs()
            }, 200)
          } else {
            message.error(m.msg)
          }
        })
      }
    })
  }

  render () {
    const { acctStatus, callLogs, contacts } = this.props
    const { curPageData, selectedLogs, pageNum, curPage, isAutoVideo } = this.state
    return (
      <div className='call-history-page'>
        <div className='call-history-head'>
          <Button className='delete-btn' icon='delete' type='primary' disabled={selectedLogs.length === 0} onClick={this.handleDeleteLog}>{$t('b_003')}</Button>
          <Button className='clear-btn' icon='delete' type='primary' disabled={callLogs.length === 0} onClick={this.handleClearAll}>{$t('b_037')}</Button>
        </div>
        {
          callLogs.length > 0
            ? (
              <>
                <div className='call-history-list'>
                  <CallHistoryList
                    isAutoVideo={isAutoVideo}
                    acctStatus={acctStatus}
                    dataSource={curPageData}
                    selectedLogs={selectedLogs}
                    onSelectRow={this.handleSelectRow}
                    contacts={contacts}
                  />
                </div>
                <div className='call-history-pagination'>
                  <Pagination
                    className='bak-pagination'
                    showTotal={total => `Total: ${total}`}
                    showSizeChanger
                    current={curPage}
                    pageSize={pageNum}
                    total={callLogs.length}
                    onChange={this.handlePageChange}
                    onShowSizeChange={this.handlePageNumChange}
                  />
                </div>
              </>
            )
            : <NoData tip={$t('c_343')}/>
        }

      </div>
    )
  }
}

export default CallHistory
