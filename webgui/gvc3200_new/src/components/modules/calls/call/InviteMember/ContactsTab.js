import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance"
import { Popover, Table, Modal, Checkbox, Button } from "antd"
import * as Actions from 'components/redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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

class ContactsTab extends Component {
  constructor() {
    super()
    this.state = {
      dataSource: []
    }
  }
  componentDidMount () {
    const { contacts2 } = this.props
    const dataContacts = this.parseContacts(contacts2)
    this.setState({
      dataSource: [...dataContacts]
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
  handleAddRecord = (record, e) => {
    e.stopPropagation()
    const { onAdd } = this.props
    onAdd(record)
  }
  render() {
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
            </div>
          )
        }
      }
    ]
    return (
      <div className="tab-content">
         <Table
          className="contacts-table"
          columns={columns}
          pagination={false}
          dataSource={this.state.dataSource}
          showHeader={false}
        />
      </div>
    )
  }
}


const mapState = (state) => {
  return {
    contacts2: state.contacts2
  }
}
const mapDispatch = (dispatch) => {
  let actions = {
  }
  return bindActionCreators(actions, dispatch)
}
export default connect(mapState, mapDispatch)(Enhance(ContactsTab))