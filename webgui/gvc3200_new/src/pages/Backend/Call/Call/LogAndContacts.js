import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Tooltip, Button, Modal, Checkbox, Icon } from 'antd'
import NoData from '@/components/NoData'
import { getRecordIcon as getIconClass, momentFormat, escapeRegExp } from '@/utils/tools'
import API from '@/api'
import { $t } from '@/Intl'
import { connect } from 'react-redux'

let timer, DATASOURCE

@connect(
  state => ({
    maxLineCount: state.maxLineCount,
    linesInfo: state.linesInfo
  })
)
class LogAndContacts extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired, // 列表数据
    onAdd: PropTypes.func.isRequired, // 添加事件
    filterTags: PropTypes.string.isRequired // 过滤
  }

  state = {
    tableData: [],
    confMemSelectToCall: [],
    expandedKeys: '', // 展开
    curPage: 1,
    maxHeight: 0,
    isAutoVideo: '0'
  }

  calContentHeight = () => {
    const winHeight = document.documentElement.clientHeight || window.innerHeight
    return winHeight - 50 - 65 - 170 - 65
  }

  handleRowClick = (record) => {
    if (!record.children) return false
    this.setState({
      expandedKeys: record.key === this.state.expandedKeys ? '' : record.key
    })
  }

  setRowClassName = (record, index) => {
    if (record.lvl === '0') {
      return index % 2 === 1 ? 'gray' : ''
    }
    return ''
  }

  // 添加
  handleAddRecord = (record, e) => {
    e.stopPropagation()
    const { onAdd } = this.props
    onAdd(record)
  }

  // 呼叫
  handleCallRecord = (record, e) => {
    e.stopPropagation()
    const { isAutoVideo } = this.state
    // 点击的是会议记录
    if (+record.isconf === 1) {
      this.setState({
        confMemSelectToCall: record.children
      })
    } else {
      // 点击成员
      const { acct, number: num, isvideo, source } = record
      API.makeCall([{
        acct,
        isvideo: +isAutoVideo === 1 ? isvideo : '0',
        num,
        source,
        isconf: 1
      }])
    }
  }

  // 选择成员
  selectCallMem = (memId) => {
    const { confMemSelectToCall } = this.state
    const { maxLineCount, linesInfo } = this.props
    // console.log(linesInfo)
    let _memSelect = JSON.parse(JSON.stringify(confMemSelectToCall))
    for (let mem of _memSelect) {
      if (mem.id === memId) {
        mem.selected = !mem.selected
        break
      }
    }
    // console.log(_memSelect)
    // 选中的拨打成员数_memSelect+在拨打的线路数linesInfo(去重，去除拨打失败的)不超过最大线路数maxLineCount
    let len = linesInfo.filter(item => item.state !== '8').length + _memSelect.filter(i => i.selected && !linesInfo.some(j => j.num === i.number)).length
    if (len >= parseInt(maxLineCount)) {
      _memSelect = _memSelect.map(mem => {
        if (mem.selected) return mem
        mem.checkDisable = true
        return mem
      })
    } else {
      _memSelect = _memSelect.map(mem => {
        delete mem.checkDisable
        return mem
      })
    }
    this.setState({
      confMemSelectToCall: _memSelect
    })
  }

  // 弹窗点击
  confMemSelectCall = () => {
    const { confMemSelectToCall, isAutoVideo } = this.state
    const selectedMems = confMemSelectToCall.filter(v => v.selected)
    const memToCall = selectedMems.map(mem => {
      const { acct, number: num, isvideo, source } = mem
      return {
        acct,
        num,
        isvideo: +isAutoVideo === 1 ? isvideo : '0',
        source,
        isconf: '1'
      }
    })

    API.makeCall(memToCall)
    this.setState({
      confMemSelectToCall: []
    })
  }

  handleTableScroll = (e) => {
    if (timer) return false
    const { curPage, tableData } = this.state
    const outerHeight = e.target.offsetHeight
    const scrollTop = e.target.scrollTop
    timer = setTimeout(() => {
      timer = null
      const innerHeight = this.refs.recordTable.offsetHeight
      if (innerHeight - outerHeight - scrollTop < 300) {
        if (30 * curPage > tableData.length) return
        this.setState({
          curPage: this.state.curPage + 1
        })
      }
    }, 100)
  }

  componentDidMount () {
    const { dataSource } = this.props
    DATASOURCE = dataSource

    // 获取是否开启了 自动视频 功能
    API.getPvalues(['P25023']).then(data => {
      this.setState({
        maxHeight: this.calContentHeight(),
        tableData: dataSource,
        isAutoVideo: data.P25023
      })
    })
  }

  componentDidUpdate (prevProps) {
    let _dataSource = []
    if (this.props.filterTags !== prevProps.filterTags) { // filterTags 过滤项
      let filterTags = this.props.filterTags
      _dataSource = DATASOURCE
      if (filterTags.trim().length) {
        const filter = escapeRegExp(filterTags)
        const filterReg = new RegExp(filter, 'ig')
        _dataSource = DATASOURCE.filter(item => {
          return item.col0.indexOf(filterTags) >= 0 || (item.numberText && item.numberText.indexOf(filterTags) >= 0)
        }).map(item => {
          let _item = JSON.parse(JSON.stringify(item))
          _item.col0 = _item.col0.replace(filterReg, `<b>${filterTags}</b>`)
          if (_item.numberText) {
            _item.numberText = _item.numberText.replace(filterReg, `<b>${filterTags}</b>`)
          }
          return _item
        })
      }
      this.setState({
        tableData: _dataSource,
        curPage: 1
      })
    }
    if (this.props.dataSource !== prevProps.dataSource) {
      DATASOURCE = this.props.dataSource
      this.setState({
        tableData: this.props.dataSource
      })
    }
  }

  render () {
    const { confMemSelectToCall, tableData, expandedKeys, curPage, maxHeight } = this.state
    const { maxLineCount } = this.props
    let _dataSource = tableData.slice(0, 30 * curPage)
    const columns = [
      {
        key: 'col0',
        dataIndex: 'col0',
        width: '30%',
        render: (text, record, index) => {
          return (
            <div className={`record-name ${record.numberText && !record.contacts ? 'has-number' : ''}`}>
              <i className={getIconClass(record)}></i>
              <strong dangerouslySetInnerHTML={{ __html: text }}></strong>
              {record.numberText && !record.contacts ? <em dangerouslySetInnerHTML={{ __html: `${record.numberText}` }}></em> : ''}
            </div>
          )
        }
      },
      {
        key: 'col1',
        dataIndex: 'col1',
        width: '30%'
      },
      {
        key: 'col2',
        dataIndex: 'col2',
        width: '25%',
        render: (text, record, index) => {
          if (record.contacts) {
            return <span dangerouslySetInnerHTML={{ __html: record.numberText }}></span>
          }
          if (record.lvl) {
            return momentFormat(text, { showtime: +record.lvl === 1, showtoday: false }).strRes
          }
          return ''
        }
      },
      {
        key: 'col3',
        dataIndex: 'col3',
        width: '15%',
        render: (text, record, index) => {
          return (
            <div className='operate-btns'>
              <Tooltip title={$t('b_056')}>
                <span className='icons icon-add' onClick={(e) => this.handleAddRecord(record, e)}></span>
              </Tooltip>
              <Tooltip title={$t('b_043')}>
                <span className='icons icon-call-btn' style={{ marginLeft: 10 }} onClick={(e) => this.handleCallRecord(record, e)}></span>
              </Tooltip>
            </div>
          )
        }
      }
    ]
    return (
      <div className='log-contacts-wrap' onScroll={(e) => this.handleTableScroll(e)} style={{ maxHeight }}>
        <div ref='recordTable'>
          {
            _dataSource.length > 0 ? <Table
              className='log-contacts'
              columns={columns}
              pagination={false}
              dataSource={_dataSource}
              showHeader={false}
              onRow={record => ({
                onClick: event => this.handleRowClick(record)
              })}
              expandedRowKeys={[expandedKeys]}
              expandIconColumnIndex={-1}
              rowClassName={this.setRowClassName}
            /> : <NoData/>
          }
        </div>
        <Modal
          width={680}
          className='modal-member'
          title={$t('c_305')}
          visible={confMemSelectToCall.length > 0}
          onCancel={() => this.setState({ confMemSelectToCall: [] })}
          transitionName=''
          maskTransitionName=''
          footer={
            <div className='modal-member-footer'>
              <Button onClick={() => this.setState({ confMemSelectToCall: [] })} >{$t('b_005')}</Button>
              <Button type='primary' onClick={() => this.confMemSelectCall()} disabled={confMemSelectToCall.filter(v => v.selected).length === 0}>{$t('c_305')}</Button>
            </div>
          }
        >
          <p className='modal-tips'>
            <span style={{ display: confMemSelectToCall.some(mem => mem.checkDisable) ? 'inline-block' : 'none' }}>
              <Icon type='exclamation-circle' theme='filled' className='tips-icon'/>{`${$t('m_236')}(${maxLineCount})`}</span>
          </p>
          <ul className='modal-member-ul'>
            {
              confMemSelectToCall.map(mem => {
                return (
                  <li key={mem.id}>
                    <span>
                      <Checkbox disabled={Boolean(mem.checkDisable)} checked={!!mem.selected} onChange={() => this.selectCallMem(mem.id)} />
                    </span>
                    <span>{mem.col0}</span>
                    <span>{mem.col1}</span>
                    <span>{mem.number}</span>
                  </li>
                )
              })
            }
          </ul>
        </Modal>
      </div>
    )
  }
}

export default LogAndContacts
