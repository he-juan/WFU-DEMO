import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Tooltip } from 'antd'
import NoData from '../../NoData'
import { parseAcct, mapToSource, getRecordIcon as getIconClass, momentFormat, escapeRegExp } from '@/utils/tools'

let timer, DATASOURCE

class CallLogsTab extends Component {
  static propTypes = {
    callLogs: PropTypes.array.isRequired, // 通话记录
    timezone: PropTypes.any.isRequired, // 时区
    onAdd: PropTypes.func.isRequired, // 添加事件
    filterTags: PropTypes.string.isRequired // 过滤
  }

  constructor (props) {
    super(props)

    this.state = {
      dataSource: [],
      expandedKeys: '', // 展开
      curPage: 1
    }
  }

  // 解析通话记录
  parseCallLogs = (logs) => {
    let result = logs.map(log => {
      let r = {}
      if (log.isconf === '1') { // 如果是会议通话, 需要对members进行列举
        Object.assign(r, log)
        r.key = 'l-conf-' + log.confid
        r.col0 = log.confname // 会议名称
        r.col1 = ''
        r.col2 = log.date
        r.lvl = '0'
        if (log.members) {
          r.children = log.members.map(m => {
            let i = {}
            Object.assign(i, m)
            i.key = `${r.key}-${m.id}`
            i.col0 = m.name
            i.col1 = parseAcct(m.acct)
            i.col2 = m.date
            i.source = mapToSource(m.calltype)
            i.numberText = m.number
            i.lvl = '1'
            return i
          })
        }
      } else { // 如果是单路通话 ,取list的第一个值
        let m = log.list[0]
        Object.assign(r, m)
        r.isconf = '0'
        r.key = 'l-sin-' + m.id
        r.col0 = log.name
        r.col1 = parseAcct(m.acct)
        r.col2 = m.date
        r.source = mapToSource(m.calltype)
        r.lvl = '0'
        r.children = [Object.assign({}, r, {
          key: 'c-l-sin-' + m.id,
          col2: m.date,
          numberText: m.number,
          lvl: '1'
        })]
      }
      return r
    })
    return result
  }

  handleRowClick = (record) => {
    if (!record.children) return false
    this.setState({
      expandedKeys: record.key
    })
  }

  setRowClassName = (record, index) => {
    if (record.lvl === '0') {
      return index % 2 === 1 ? 'gray' : ''
    }
    return ''
  }

  handleAddRecord = (record, e) => {
    e.stopPropagation()
    const { onAdd } = this.props
    onAdd(record)
  }

  // 滚动分页加载
  handleTableScroll = (e) => {
    if (timer) return false
    const { curPage, dataSource } = this.state
    const outerHeight = e.target.offsetHeight
    const scrollTop = e.target.scrollTop
    timer = setTimeout(() => {
      timer = null
      const innerHeight = this.refs.recordTable.offsetHeight
      if (innerHeight - outerHeight - scrollTop < 300) {
        if (30 * curPage > dataSource.length) return
        this.setState({
          curPage: this.state.curPage + 1
        })
      }
    }, 100)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.filterTags !== nextProps.filterTags) { // filterTags 过滤项
      let filterTags = nextProps.filterTags
      let _dataSource = DATASOURCE
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
        dataSource: _dataSource,
        curPage: 1
      })
    }
  }

  componentDidMount () {
    const { callLogs } = this.props // timezone
    // moment.tz.setDefault(timezone)
    const dataCallLogs = this.parseCallLogs(callLogs)
    DATASOURCE = dataCallLogs
    this.setState({
      dataSource: dataCallLogs
    })
  }

  render () {
    const { dataSource, expandedKeys, curPage } = this.state
    let _dataSource = dataSource.slice(0, 30 * curPage)
    const columns = [
      {
        key: 'col0',
        dataIndex: 'col0',
        width: '35%',
        render: (text, record, index) => {
          return (
            <div className={`record-name ${record.numberText ? 'has-number' : ''}`}>
              <i className={'icons ' + getIconClass(record)}></i>
              <strong dangerouslySetInnerHTML={{ __html: text }}></strong>
              {record.numberText ? <em dangerouslySetInnerHTML={{ __html: `(${record.numberText})` }}></em> : ''}
            </div>
          )
        }
      },
      {
        key: 'col1',
        dataIndex: 'col1',
        width: '25%'
      },
      {
        key: 'col2',
        dataIndex: 'col2',
        width: '25%',
        render: (text, record, index) => {
          if (record.lvl) {
            return momentFormat(text, record.lvl === '1', false).strRes
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
              <Tooltip>
                <span className='icons icon-add' onClick={(e) => this.handleAddRecord(record, e)}></span>
              </Tooltip>
            </div>
          )
        }
      }
    ]

    return (
      <div className='tab-content' onScroll={(e) => this.handleTableScroll(e)}>
        <div ref='recordTable'>
          {
            _dataSource.length > 0 ? <Table
              className='calllogs-table'
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
      </div>
    )
  }
}

export default CallLogsTab
