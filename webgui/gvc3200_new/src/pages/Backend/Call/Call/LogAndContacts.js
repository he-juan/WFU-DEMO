import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Tooltip } from 'antd'
import NoData from '@/components/NoData'
import { getRecordIcon as getIconClass, momentFormat } from '@/utils/tools'
import API from '@/api'

let timer, DATASOURCE

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
    maxHeight: 0
  }

  calContentHeight = () => {
    const winHeight = document.documentElement.clientHeight || window.innerHeight
    return winHeight - 50 - 65 - 170 - 65
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

  // 添加
  handleAddRecord = (record, e) => {
    e.stopPropagation()
    const { onAdd } = this.props
    onAdd(record)
  }

  // 呼叫
  handleCallRecord = (record, e) => {
    e.stopPropagation()
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
        isvideo,
        num,
        source,
        isconf: 1
      }])
    }
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
    this.setState({
      maxHeight: this.calContentHeight(),
      tableData: dataSource
    })
  }

  componentWillReceiveProps (nextProps) {
    let _dataSource = []
    if (this.props.filterTags !== nextProps.filterTags) { // filterTags 过滤项
      let filterTags = nextProps.filterTags
      _dataSource = DATASOURCE
      if (filterTags.trim().length) {
        _dataSource = DATASOURCE.filter(item => {
          return item.col0.indexOf(filterTags) >= 0 || (item.numberText && item.numberText.indexOf(filterTags) >= 0)
        }).map(item => {
          let _item = JSON.parse(JSON.stringify(item))
          _item.col0 = _item.col0.replace(filterTags, `<b>${filterTags}</b>`)
          if (_item.numberText) {
            _item.numberText = _item.numberText.replace(filterTags, `<b>${filterTags}</b>`)
          }
          return _item
        })
      }
      this.setState({
        tableData: _dataSource,
        curPage: 1
      })
    } else {
      _dataSource = DATASOURCE
    }
  }

  render () {
    const { tableData, expandedKeys, curPage, maxHeight } = this.state
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
              <Tooltip title='添加'>
                <span className='icons icon-add' onClick={(e) => this.handleAddRecord(record, e)}></span>
              </Tooltip>
              <Tooltip title='呼叫'>
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
      </div>
    )
  }
}

export default LogAndContacts