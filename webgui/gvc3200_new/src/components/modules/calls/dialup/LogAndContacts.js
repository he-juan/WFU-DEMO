import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance"
import { Popover, Table, Modal, Checkbox, Button } from "antd"
import * as Actions from 'components/redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import CallAPI from './api'


// 格式化数据戳 昨天今天特殊处理
const parseDate = (function () {
  const TODAYZERO = moment(moment().format('YYYY/MM/DD')).valueOf()
  const YESTERDAYZERO = moment(moment().subtract(1, 'days').format('YYYY/MM/DD')).valueOf()
  const TOMMORROWZERO = moment(moment().add(1, 'days').format('YYYY/MM/DD')).valueOf()
  return function (timestamp, fmt) {
    timestamp = parseInt(timestamp)
    if( YESTERDAYZERO <= timestamp  && timestamp < TODAYZERO) {
      fmt = fmt.replace('YYYY M/D', '昨天')
    }
    if( TODAYZERO <= timestamp  && timestamp < TOMMORROWZERO ) {
      fmt = fmt.replace('YYYY M/D', '今天')
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



class LogAndContacts extends Component {
  constructor() {
    super()

    this.state = {
      dataSource: [],
      expandedKeys: '',
      confMemSelectToCall: []
    }
  }
  componentDidMount = () => {
    const { contacts2, callLogs2 } = this.props
    this.parseDataSource(contacts2, callLogs2)
  }
  parseDataSource = (contacts2, callLogs2) => {
    const dataContacts = this.parseContacts(contacts2)
    const dataCallLogs = this.parseCallLogs(callLogs2)
    this.setState({
      dataSource: [...dataCallLogs, ...dataContacts]
    })
  }
  // 解析联系人
  parseContacts = (contacts) => {
    let result = []
    contacts.forEach(item => {
      item.phone.forEach(phone => {
        let data = {
          key: 'c' + item.id + phone.acct,
          col0: item.name.displayname,
          col1: parseAcct(phone.acct),
          col2: phone.number,

          name: item.name.displayname,
          number: phone.number, 
          acct: phone.acct,
          isvideo: 1,
          source: 1, // 联系人呼出source 为1
        }
        result.push(data)
      })
    });
    return result
  }
  // 解析通话记录
  parseCallLogs = (logs) => {
    let result = logs.map(log => {
      let r = {}
      Object.assign(r, log)
      r.key = 'l' + log.confid
      r.col0 = log.confname  // 会议名称
      r.col1 = ''
      r.col2 = parseDate(log.date, 'YYYY M/D')
      if(log.members) {
        r.children = log.members.map(m => {
          let i = {}
          Object.assign(i, m)
          i.key = `${r.key}-${m.id}`
          i.col0 = m.name
          i.col1 = parseAcct(m.acct)
          i.col2 = parseDate(m.date, 'YYYY M/D H:mm')
          i.source = mapToSource(m.calltype)
          return i
        })
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
  setRowClassName = (record) => {
    return record.key == this.state.expandedKeys ? 'active' : ''
  }
  
  handleAddRecord = (record, e) => {
    e.stopPropagation()
    const { onAdd } = this.props
    onAdd(record)
  }

  handleCallRecord = (record, e) => {
    e.stopPropagation()
    // 点击的是会议记录
    if(record.children) {
      this.setState({
        confMemSelectToCall: record.children
      })
    } else { 
      // 点击成员
      const { acct, number:num, isvideo, source } = record
      let memToCall = [{
        acct,
        num,
        isvideo,
        source,
        isconf: "1"
      }]
      CallAPI.makeCall(memToCall)
    }
  }
  // 选择成员
  selectCallMem = (memId) => {
    const { confMemSelectToCall } = this.state
    const _memSelect = confMemSelectToCall.slice()
    for(let mem of _memSelect) {
      if(mem.id == memId) {
        mem.selected = !mem.selected
        break
      }
    }
    this.setState({
      confMemSelectToCall: _memSelect
    })
  }
  // 弹窗点击
  confMemSelectCall = () => {
    const { confMemSelectToCall } = this.state
    const selectedMems = confMemSelectToCall.filter(v => v.selected)
    const memToCall = selectedMems.map(mem => {
      const {acct, number: num, isvideo, source} = mem
      return {
        acct,
        num,
        isvideo,
        source,
        isconf: "1"
      }
    })
    CallAPI.makeCall(memToCall)
    this.setState({
      confMemSelectToCall: []
    })
  }

  render() {
    const { confMemSelectToCall } = this.state
    const _this = this
    const columns = [
      {
        key: 'col0',
        dataIndex: 'col0',
        width: '35%'
      }, 
      {
        key: 'col1',
        dataIndex: 'col1',
        width: '25%'
      },
      {
        key: 'col2',
        dataIndex: 'col2',
        width: '25%'
      },
      {
        key: 'col3',
        dataIndex: 'col3',
        width: '15%',
        render(text, record, index){
          return (
            <div className="operate-btns">
              <span className="add-btn" onClick={(e) => _this.handleAddRecord(record, e)}></span>
              <span className="call-btn" onClick={(e) => _this.handleCallRecord(record, e)}></span>
            </div>
          )
        }
      }
    ]
    
    return (
      <div>
        <Table
          className="log-contacts"
          columns={columns}
          pagination={false}
          dataSource={this.state.dataSource}
          showHeader={false}
          onRowClick={this.handleRowClick}
          expandedRowKeys={[this.state.expandedKeys]}
          expandIconColumnIndex={-1}
          rowClassName={this.setRowClassName}
        />
        <Modal 
          width={450} 
          className="modal-member" 
          title={'呼叫'} 
          visible={confMemSelectToCall.length > 0} 
          onCancel={() => this.setState({confMemSelectToCall: []})}
          footer={
              <Button  type="primary" onClick={() => this.confMemSelectCall()} disabled={confMemSelectToCall.filter(v => v.selected).length == 0}>呼叫</Button>
          }
          >
          <ul className="modal-member-ul">
            {
              confMemSelectToCall.map(mem => {
                return (
                  <li key={mem.id}>
                    <span>{mem.col0}</span><span>{mem.col1}</span><span>{mem.number}</span><span><Checkbox checked={!!mem.selected} onChange={() => this.selectCallMem(mem.id)} /></span>
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

const mapState = (state) => ({
  contacts2: state.contacts2,
  callLogs2: state.callLogs2
})

const mapDispatch = (dispatch) => {
  var actions = {

  }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapState, mapDispatch)(Enhance(LogAndContacts))
