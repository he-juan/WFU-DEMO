import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance"
import { Table, Tooltip } from "antd"
import * as Actions from 'components/redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment-timezone'

function tr(text) {
  var tr_text = text;
  var language = $.cookie('MyLanguage') == null ? 'en' : $.cookie('MyLanguage');
  try {
      tr_text = window.eval(text+"_" + language);
  } catch (err) {
  } finally {
      return tr_text;
  }
}

let timer, DATASOURCE

// 格式化数据戳 昨天今天特殊处理
const parseDate = (function () {
  const TODAYZERO = moment(moment().format('YYYY/MM/DD')).valueOf()
  const YESTERDAYZERO = moment(moment().subtract(1, 'days').format('YYYY/MM/DD')).valueOf()
  const TOMMORROWZERO = moment(moment().add(1, 'days').format('YYYY/MM/DD')).valueOf()
  const YEARZERO = moment(moment().format('YYYY/1/1')).valueOf()
  return function (timestamp, lvl) {
    let fmt = ''
    timestamp = parseInt(timestamp)
    if( YESTERDAYZERO <= timestamp  && timestamp < TODAYZERO) {
      fmt = `[${tr('a_23553')}] ${lvl == '1' ? 'H:mm' : ''}`
    } else if( TODAYZERO <= timestamp  && timestamp < TOMMORROWZERO ) {
      // fmt = fmt.replace('MM/DD/YYYY', `[${tr('a_23554')}]`)
      fmt = 'H:mm'
    } else if (YEARZERO <= timestamp && timestamp < YESTERDAYZERO) {
      fmt = `MM/DD ${lvl == '1' ? 'H:mm' : ''}`
    } else {
      fmt = `MM/DD/YYYY ${lvl == '1' ? 'H:mm' : ''}`
    }
    let date = moment(parseInt(timestamp)).format(fmt)
    return date
  }
})()

// parse 账号类型
const parseAcct = (function () {
  const acctMap = {
    "0": "SIP",
    "1": "IPVideoTalk",
    "2": "Bluejeans",
    "8": "H.323"
  }
  return function(acct) {
    return acctMap[acct]
  }
})()

// callType 映射source
const mapToSource = (function(){
  let mapper = {
      '1': '3', //来电 source 取 3
      '2': '4', //去电 source 取 4,
      '3': '3', //未接来电 source 取 3,
      '0': '1', //联系人 source 取1,
  }
  return function(type) {
    return mapper[type] || '0'
  }
})()

// 返回图标名 是否是会议, 单路(呼入,呼出,未接来电), 联系人
const getIconClass = function(record) {
  const {isconf, calltype, isvideo} = record
  // 会议类型
  if(isconf == '1') {
    return 'icon-conf'
  }
  // 单路或成员
  if(calltype) {
    switch(calltype) {
      case '1':
        return isvideo == '1' ? 'icon-in-video' : 'icon-in-audio'
      case '2':
        return isvideo == '1' ? 'icon-out-video' : 'icon-out-audio'
      case '3':
        return isvideo == '1' ? 'icon-miss-video' : 'icon-miss-audio'
    }
  }
  // 联系人
  return 'icon-contacts'
  
}


class CallLogsTab extends Component {

  constructor() {
    super()
    this.state = {
      dataSource: [],
      expandedKeys: '',
      curPage: 1
    }
  }

  componentDidMount () {
    const { callLogsNew, timezone } = this.props
    moment.tz.setDefault(timezone)
    const dataCallLogs = this.parseCallLogs(callLogsNew)
    DATASOURCE = dataCallLogs
    this.setState({
      dataSource: dataCallLogs
    })
  }
  // 解析通话记录
  parseCallLogs = (logs) => {
    let result = logs.map(log => {
      let r = {}
      if(log.isconf == '1') {   //如果是会议通话, 需要对members进行列举
        Object.assign(r, log)
        r.key = 'l-conf-' + log.confid
        r.col0 = log.confname  // 会议名称
        r.col1 = ''
        r.col2 = log.date
        r.lvl = '0'
        if(log.members) {
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
      } else {     // 如果是单路通话 ,取list的第一个值
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
    if(!record.children) return false
    this.setState({
      expandedKeys: record.key
    })
  }
  setRowClassName = (record, index) => {
    if(record.lvl == '0' ){
      return index % 2 == 1  ? 'gray' : ''
    }
    return ''
    // return record.key == this.state.expandedKeys ? 'active' : ''
  }
  
  handleAddRecord = (record, e) => {
    e.stopPropagation()
    const { onAdd } = this.props
    onAdd(record)
  }

  handleTableScroll = (e) => {
    if(timer) return false
    const { curPage, dataSource } = this.state
    const outerHeight = e.target.offsetHeight;
    const scrollTop = e.target.scrollTop;
    timer = setTimeout(() => {
        timer = null
        const innerHeight = this.refs.recordTable.offsetHeight;
        if(innerHeight - outerHeight - scrollTop < 300) {
            if(30 * curPage > dataSource.length) return
            this.setState({
                curPage: this.state.curPage + 1
            })
        }
    }, 100)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.filterTags != nextProps.filterTags) { // filterTags 过滤项
      let filterTags = nextProps.filterTags
      let _dataSource = DATASOURCE
      if(filterTags.trim().length) {
        _dataSource = DATASOURCE.filter(item => {
          return item.col0.indexOf(filterTags) >= 0 || item.numberText && item.numberText.indexOf(filterTags) >= 0
        }).map(item => {
          let _item = JSON.parse(JSON.stringify(item))
          _item.col0 = _item.col0.replace(filterTags, `<b>${filterTags}</b>`)
          if(_item.numberText) {
            _item.numberText = _item.numberText.replace(filterTags, `<b>${filterTags}</b>`)
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

  render() {
    const { dataSource, expandedKeys, curPage } = this.state
    let _dataSource = dataSource.slice(0, 30 * curPage)
    const _this = this
    const columns = [
      {
        key: 'col0',
        dataIndex: 'col0',
        width: '35%',
        render(text, record, index) {
          return (
            <div className={`record-name ${record.numberText ? 'has-number' : ''}`}>
              <i className={getIconClass(record)}></i>
              <strong dangerouslySetInnerHTML={{__html: text}}></strong>
              {record.numberText ? <em dangerouslySetInnerHTML={{__html: `(${record.numberText})`}}></em> : ''}
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
        render(text, record, index) {
          if(record.lvl) {
            return parseDate(text, record.lvl)
          } 
         
          return ''
        }
      },
      {
        key: 'col3',
        dataIndex: 'col3',
        width: '15%',
        render(text, record, index){
          return (
            <div className="operate-btns">
              <Tooltip title={tr('a_403')}>
                <span className="add-btn" onClick={(e) => _this.handleAddRecord(record, e)}></span>
              </Tooltip>
            </div>
          )
        }
      }
    ]


    return (
      <div className="tab-content" onScroll={(e) => this.handleTableScroll(e)}>
        <div ref="recordTable">
          <Table
            className="calllogs-table"
            columns={columns}
            pagination={false}
            dataSource={_dataSource}
            showHeader={false}
            onRowClick={this.handleRowClick}
            expandedRowKeys={[expandedKeys]}
            expandIconColumnIndex={-1}
            rowClassName={this.setRowClassName}
          />
        </div>
      </div>
    )
  }
}


const mapState = (state) => {
  return {
    callLogsNew: state.callLogsNew,
    timezone: state.timezone
  }
}
const mapDispatch = (dispatch) => {
  let actions = {
  }
  return bindActionCreators(actions, dispatch)
}
export default connect(mapState, mapDispatch)(Enhance(CallLogsTab))