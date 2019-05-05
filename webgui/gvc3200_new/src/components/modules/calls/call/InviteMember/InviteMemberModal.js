import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance";
import * as Actions from 'components/redux/actions/index'
import { Modal, Select, Input, Checkbox, Tabs } from 'antd';
import TagsInput from 'react-tagsinput'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CallLogsTab from './CallLogsTab'
import ContactsTab from './ContactsTab'
import EpContactsBookTab from './EpContactsBookTab'
import './inviteMember.less'
const Option = Select.Option
const TabPane = Tabs.TabPane

function parseAcctStatus(acctstatus) {
  let headers = acctstatus.headers
  let result = [];
  let acctIndex = ['0', '1', '2', '8']
  acctIndex.map((i) => {
    result.push({
      "acctindex": i,
      "register": parseInt(headers[`account_${i == 8 ? 6 : i}_status`]),  // 账号注册状态
      "activate": parseInt(headers[`account_${i == 8 ? 6 : i}_activate`]), // 账号激活状态
      "num": headers[`account_${i == 8 ? 6 : i}_no`],
      "name": i == 0 ? 'SIP' : i == 8 ? 'H.323' : headers[`account_${i}_name`]
    })
  })
  return result
}

class InviteMemberModal extends Component {
  constructor() {
    super();
    this.modalStyle = {
      position: 'absolute',
      left: '0',
      top: '-10px',
      bottom: '0',
      right: '0',
      margin: 'auto',
      height: '700px',
      paddingBottom: '0',
    }
    this.state = {
      acctStatus: null,  // 所有激活账号
      selectAcct: 0,     // 当前选中账号
      memToCall: [],      // 输入的待拨打成员号码
      activeTab: '1'
    }
  }
  
  componentDidMount() {
    const { getAcctStatus, defaultAcct } = this.props
    // 激活的账号列表获取
    getAcctStatus((acctstatus) => {
      if (!this.isEmptyObject(acctstatus)) {
        this.setState({
          acctStatus: parseAcctStatus(acctstatus)
        })
      }
    })
    this.setState({
      selectAcct: defaultAcct
    })
  }
  
  // 选择拨打账号
  handleSelectAcct(item) {
    this.setState({
      selectAcct: item,
      memToCall: []
    })
  }

  // 添加拨打成员
  handleChangeMemToCall = (mems) => {
    const { selectAcct } = this.state
    let memToCall = mems.map((number) => {
      return {
        num: number,
        acct: selectAcct,
        isvideo: 1,
        isconf: 1,
        source: 2,
        name: number
      }
    })
    this.setState({
      memToCall:memToCall
    })
  }

  handleAddMemFromList = (record) => {
    let { memToCall } = this.state
    let _memToCall = memToCall.slice()
    _memToCall = this.pushMemToCall(_memToCall, record)
    this.setState({
      memToCall: _memToCall
    })
  }
  // push _memToCall 添加 去重等操作
  pushMemToCall(_memToCall, item) {
    const {number, acct, isvideo, source, name} = item
    // 去重 相同的号码
    _memToCall = _memToCall.filter(mem => mem.num != number)
    _memToCall.push({
      num: number,
      acct: acct,
      isvideo: isvideo,
      source: source,
      isconf: 1,
      name: name
    })
    return _memToCall
  }
  // 切换tab
  selectTab = (i) => {
    this.setState({
      activeTab: i
    })
  }
  render() {
    const { visible, onHide } = this.props
    const { memToCall, acctStatus, selectAcct, activeTab } = this.state
    if( !acctStatus ) return null;
    return (
      <Modal
        width={1000}
        style={this.modalStyle}
        className="invite-modal"
        visible={visible}
        onCancel={onHide}
        title={this.tr('a_517')}
        okText={this.tr('a_23')}
        onOk={() => this.handleSubmit()}
      >
        <div style={{ height: '570px' }}>
          <Tabs onChange={(i) => this.selectTab(i)}>
            <TabPane tab="本地通讯录" key="1"></TabPane>
            <TabPane tab="通话记录" key="2"></TabPane>
            <TabPane tab="企业通讯录" key="3"></TabPane>
          </Tabs>
          <div className="input-area">
            <TagsInput 
              value={memToCall.map(v => v.name)} 
              onChange={this.handleChangeMemToCall} 
              addKeys={[13, 188]} 
              onlyUnique={true} 
              addOnBlur={true} 
              inputProps={{placeholder: ''}}
            />
            <Select className="acct-select" size="large" value={selectAcct} onChange={item => this.handleSelectAcct(item)}>
              {
                acctStatus.map((v, i) => {
                  if(!v.activate) return null
                  
                  return (
                    <Option key={i} value={v.acctindex} disabled={!v.register}>{v.name}</Option>
                  )
                })
              }
            </Select>
          </div>
          {
            activeTab == '1' ? 
            <ContactsTab onAdd={(item) => this.handleAddMemFromList(item)} /> 
            : activeTab == '2' ? 
            <CallLogsTab onAdd={(item) => this.handleAddMemFromList(item)} /> 
            : 
            <EpContactsBookTab onAdd={(item) => this.handleAddMemFromList(item)} />
          }
        </div>
      </Modal>
    )
  }
}




const mapState = (state) => {
  return {
    defaultAcct: state.defaultAcct
  }
}
const mapDispatch = (dispatch) => {
  let actions = {
    getAcctStatus: Actions.getAcctStatus
  }
  return bindActionCreators(actions, dispatch)
}
export default connect(mapState, mapDispatch)(Enhance(InviteMemberModal))

