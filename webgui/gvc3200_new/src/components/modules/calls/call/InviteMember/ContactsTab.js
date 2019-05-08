import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance"
import { Tooltip, Table, Modal, Checkbox, Button } from "antd"
import * as Actions from 'components/redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

let timer, DATASOURCE

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
        return isvideo ? 'icon-in-video' : 'icon-in-audio'
      case '2':
        return isvideo ? 'icon-out-video' : 'icon-out-audio'
      case '3':
        return isvideo ? 'icon-miss-video' : 'icon-miss-audio'
    }
  }
  // 联系人
  return 'icon-contacts'
  
}


class ContactsTab extends Component {
  constructor() {
    super()
    this.state = {
      dataSource: [],
      curPage: 1
    }
  }
  componentDidMount () {
    const { contactsNew } = this.props
    const dataContacts = this.parseContacts(contactsNew)
    DATASOURCE = dataContacts
    this.setState({
      dataSource: dataContacts
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
          numberText: phone.number,
          acct: phone.acct,
          isvideo: 1,
          source: 1, // 联系人呼出source 为1
          contacts: '1'
        }
        result.push(data)
      })
    });
    return result
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
    const { dataSource, curPage } = this.state
    let _dataSource = dataSource.slice(0, 30 * curPage)
    const _this = this
    const columns = [
      {
        key: 'col0',
        dataIndex: 'col0',
        width: '35%',
        render(text, record, index) {
          return (
            <div className={`record-name`}>
              <i className={getIconClass(record)}></i>
              <strong dangerouslySetInnerHTML={{__html: text}}></strong>
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
          return <span dangerouslySetInnerHTML={{__html: record.numberText}}></span>
        }
      },
      {
        key: 'col3',
        dataIndex: 'col3',
        width: '15%',
        render(text, record, index){
          return (
            <div className="operate-btns">
              <Tooltip  title="添加">
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
            className="contacts-table"
            columns={columns}
            pagination={false}
            dataSource={_dataSource}
            showHeader={false}
          />
        </div>
      </div>
    )
  }
}


const mapState = (state) => {
  return {
    contactsNew: state.contactsNew
  }
}
const mapDispatch = (dispatch) => {
  let actions = {
  }
  return bindActionCreators(actions, dispatch)
}
export default connect(mapState, mapDispatch)(Enhance(ContactsTab))