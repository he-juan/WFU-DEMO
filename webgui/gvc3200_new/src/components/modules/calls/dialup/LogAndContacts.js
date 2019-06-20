import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance"
import { Popover, Table, Modal, Checkbox, Button, Tooltip } from "antd"
import * as Actions from 'components/redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

let timer, timer2, DATASOURCE

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
    "8": "H.323",
    "-1": tr("a_19113"),
    "4": tr("a_19113")
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
  const {isconf, calltype, isvideo, isfavourite} = record
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
  return isfavourite == '1' ? 'icon-contacts-fav' : 'icon-contacts'
  
}

class LogAndContacts extends Component {
  constructor() {
    super()

    this.state = {
      dataSource: [],
      expandedKeys: '',
      confMemSelectToCall: [],
      curPage: 1
    }
  }
  componentDidMount = () => {
    const { contactsNew, callLogsNew } = this.props
    this.parseDataSource(contactsNew, callLogsNew)
  }
  parseDataSource = (contactsNew, callLogsNew) => {
    const dataContacts = this.parseContacts(contactsNew)
    const dataCallLogs = this.parseCallLogs(callLogsNew).slice(0, 20)
    DATASOURCE = [...dataCallLogs, ...dataContacts]
    this.setState({
      dataSource: DATASOURCE
    })
  }
  // 解析联系人
  parseContacts = (contacts) => {
    let result = []
    contacts.forEach(item => {
      item.phone.forEach((phone, i) => {
        let data = {
          key: 'c-' + item.id + '-' + i,
          col0: item.name.displayname,
          col1: parseAcct(phone.acct),
          col2: phone.number,
          name: item.name.displayname,
          number: phone.number, 
          numberText: phone.number,
          acct: phone.acct,
          isvideo: '1',
          source: '1', // 联系人呼出source 为1
          contacts: '1', // 列表中联系人不需要在名称下显示号码, 这里标记做个区分
          lvl : '0',
          isfavourite: item.isfavourite
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

  handleCallRecord = (record, e) => {
    e.stopPropagation()
    // 点击的是会议记录
    if(record.isconf == '1') {
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
      this.props.makeCall(memToCall)
    }
  }
  // 选择成员
  selectCallMem = (memId) => {
    const { confMemSelectToCall } = this.state
    const { maxlinecount, linesInfo } = this.props
    // console.log(linesInfo)
    let _memSelect = JSON.parse(JSON.stringify(confMemSelectToCall))
    for(let mem of _memSelect) {
      if(mem.id == memId) {
        mem.selected = !mem.selected
        break
      }
    }
    // console.log(_memSelect)
    // 选中的拨打成员数_memSelect　＋　在拨打的线路数linesInfo(去重，去除拨打失败的)　不超过最大线路数maxlinecount
    let len = linesInfo.filter(item => item.state != '8').length + _memSelect.filter(i => i.selected && !linesInfo.some(j => j.num == i.number)).length
    if(len >= parseInt(maxlinecount)) {
      _memSelect = _memSelect.map(mem => {
        if(mem.selected) return mem
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
    this.props.makeCall(memToCall)
    this.setState({
      confMemSelectToCall: []
    })
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
      clearTimeout(timer2)
      timer2 = setTimeout(() => {
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
      }, 300)
      
    }
  }
  render() {
    const { confMemSelectToCall,dataSource, expandedKeys, curPage } = this.state
    const { mainHeight, maxlinecount} = this.props  
    let _dataSource = dataSource.slice(0, 30 * curPage)
    const _this = this
    const columns = [
      {
        key: 'col0',
        dataIndex: 'col0',
        width: '30%',
        render(text, record, index) {
          return (
            <div className={`record-name ${record.numberText && !record.contacts ? 'has-number' : ''}`}>
              <i className={getIconClass(record)}></i>
              <strong dangerouslySetInnerHTML={{__html: text}}></strong>
              {record.numberText && !record.contacts ? <em dangerouslySetInnerHTML={{__html: `${record.numberText}`}}></em> : ''}
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
        render(text, record, index) {
          if(record.contacts) {
            return <span dangerouslySetInnerHTML={{__html: record.numberText}}></span> 
          } 
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
              <Tooltip  title={tr('a_403')}>
                <span className="add-btn" onClick={(e) => _this.handleAddRecord(record, e)}></span>
              </Tooltip>
              <Tooltip  title={tr('a_9400')}>
                <span className="call-btn" onClick={(e) => _this.handleCallRecord(record, e)}></span>
              </Tooltip>
            </div>
          )
        }
      }
    ]
    return (
      <div className="log-contacts-wrap" onScroll={(e) => this.handleTableScroll(e)} style={{maxHeight: mainHeight - 170}} >
        <div ref="recordTable">
          <Table
            className="log-contacts"
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
        <Modal 
          width={900}
          className="modal-member" 
          title={tr('a_504')} 
          visible={confMemSelectToCall.length > 0} 
          onCancel={() => this.setState({confMemSelectToCall: []})}
          transitionName=""
          maskTransitionName=""
          footer={
            <div className="modal-member-footer">
              <Button size='large'>{tr('a_3')}</Button>
              <Button size='large' type="primary" onClick={() => this.confMemSelectCall()} disabled={confMemSelectToCall.filter(v => v.selected).length == 0}>{tr('a_504')}</Button>
            </div>
          }
          >
          <p className="modal-tips"><span style={{display: confMemSelectToCall.some(mem => mem.checkDisable) ? 'inline-block': 'none'}}><b className="error_icon"></b>{`${tr('a_23550')}(${maxlinecount})`}</span></p>
          <ul className="modal-member-ul">
            {
              confMemSelectToCall.map(mem => {
                return (
                  <li key={mem.id}>
                    <span><Checkbox disabled={Boolean(mem.checkDisable)} checked={!!mem.selected} onChange={() => this.selectCallMem(mem.id)} /></span><span>{mem.col0}</span><span>{mem.col1}</span><span>{mem.number}</span>
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
  contactsNew: state.contactsNew,
  callLogsNew: state.callLogsNew,
  mainHeight: state.mainHeight,
  maxlinecount: state.maxlinecount,
  linesInfo: state.linesInfo,
})

const mapDispatch = (dispatch) => {
  var actions = {
    makeCall: Actions.makeCall
  }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapState, mapDispatch)(Enhance(LogAndContacts))
