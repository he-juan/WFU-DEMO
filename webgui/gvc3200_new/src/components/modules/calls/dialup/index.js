import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance"
import { Layout, Dropdown, Menu, Input, Button, Icon, Row, Col, Form, Popover, Table } from "antd"
import TagsInput from 'react-tagsinput'
import * as Actions from 'components/redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LogContacts from './LogAndContacts'
import CallAPI from './api'
import './dialup.less'

function parseAcctStatus(acctstatus) {
  let headers = acctstatus.headers
  let result = [];
  let acctIndex = ['0', '1','2', '8']
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



class Dialup extends Component {
  constructor(props){
    super(props)
    this.state = {
      acctStatus: null,  // 所有激活账号
      selectAcct: this.props.defaultAcct,     // 当前选中账号
      memToCall: []      // 输入的待拨打成员号码
    }
  }
  componentDidMount = () => {
    const { getAcctStatus } = this.props
    // 激活的账号列表获取
    getAcctStatus((acctstatus) => {
      if (!this.isEmptyObject(acctstatus)) {
        this.setState({
          acctStatus: parseAcctStatus(acctstatus)
        })
      }
    })
   
  }

  // 选择拨打账号
  handleSelectAcct(item) {
    let acctIndex = item.key
    this.setState({
      selectAcct: acctIndex,
      memToCall: []
    })
  }
  // 设置默认账号
  setDefaultAcct = (acctindex) => {
    this.props.setDefaultAcct(acctindex, () => {
      this.setState({
        selectAcct: acctindex
      })
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

  // 通过联系人通话记录列表添加成员
  handleAddMemFromList = (record) => {
    let { memToCall } = this.state
    let _memToCall = memToCall.slice()
    if(record.isconf == '1' && record.children) {
      record.children.forEach(i => {
        _memToCall = this.pushMemToCall(_memToCall, i)
      })
    } else {
      _memToCall = this.pushMemToCall(_memToCall, record)
    }
    
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


  // 呼出接口
  handleDialup = (isvideo) => {
    const { memToCall, selectAcct } = this.state
    // 快速会议
    if(memToCall.length == 0 ) {
      if (selectAcct == 1) {
        CallAPI.quickStartIPVConf()
      } 
      return false
    }
    // bluejeans 处理
    if(selectAcct == 2) {
      let numAry = memToCall[0].num.split('.')
      if(!numAry[0].trim().length || !numAry[0].trim().length) return false
    }

    let _memToCall = memToCall.map(item => {
      item.isvideo = isvideo
      return item
    })
    CallAPI.makeCall(_memToCall)
    this.setState({
      memToCall: []
    })
  }

  // bluejeans 账号处理
  handleBjMember = (content) => {
    const { memToCall } = this.state
    let _memToCall = memToCall
    if(!_memToCall.length) {
      _memToCall[0] = {
        acct: 2,
        isvideo: 1,
        source: 2,
        num: '.'
      }
    }
    let numAry = _memToCall[0].num.split('.')
    numAry[0] = content.id ? content.id : numAry[0]
    numAry[1] = content.pw ? content.pw : numAry[1]

    _memToCall[0].num = numAry.join('.')
    this.setState({
      memToCall: _memToCall
    })
  }

  render() {
    const { acctStatus, selectAcct, memToCall } = this.state
    const { defaultAcct } = this.props
    if( !acctStatus ) return null;
    // 可选账号
    const AcctMenu = (
      <Menu className="acct-menu" onClick={(item) => this.handleSelectAcct(item)}>
        {
          acctStatus.map((v, i) => {
            if(!v.activate) return null;
            return (
              <Menu.Item key={v.acctindex} disabled={!v.register}>
                <span>{v.name}</span>
                <span>{v.num}</span>
                <span>{!v.register ? '账号未注册' : defaultAcct == v.acctindex ? '默认账号' : <Button onClick={this.setDefaultAcct.bind(this, v.acctindex)}>设为默认账号</Button>}</span>
              </Menu.Item>
            )
          })
        }
      </Menu>
    )
    // 通话输入域
    const InputArea = (
      <div className="dialup-inputs-area">
        {
          selectAcct != 2 ? 
          <div className="tagsinput-wrapper">
            <TagsInput 
              value={memToCall.map(v => v.name)} 
              onChange={this.handleChangeMemToCall} 
              addKeys={[13, 188]} 
              onlyUnique={true} 
              addOnBlur={true} 
              inputProps={{placeholder: ''}}
              />
            {
              memToCall.length > 0 
              ? null 
              :<span className="tagsinput-placeholder"> {selectAcct == 1 ? '输入号码或IP地址，多个可以用“,”分隔（如果为空，一键开启IPVT会议）' : '输入号码或IP地址，多个可以用“,”分隔'} </span>
            }
          </div>
          :
          <div className="bj-inputs">
            <Input placeholder="Meeting ID" size="large" onChange={(e) => this.handleBjMember({id: e.target.value})}></Input> <br />
            <Input placeholder="Password (optional)" onChange={(e) => this.handleBjMember({pw: e.target.value}) } size="large"></Input>
          </div>
        }  
      </div>
    )
    return (
      <Layout className="content-container">
        <div className="subpagetitle">{this.tr("a_9400")}</div>
        <div className="dialup-main" style={{minHeight: this.props.mainHeight}}>
          {/* 账号切换以及呼出 */}
          <div className="dialup-box">
            <div className="dialup-inputs">
              <Dropdown overlay={AcctMenu} trigger={['click']}>
                <div className="selected-acct">
                  <span>{acctStatus[selectAcct].name}</span> <span>{acctStatus[selectAcct].num}</span> <Icon type="down"/>
                </div>
              </Dropdown>
              {InputArea}
            </div>
            <div className="dialup-btns">
              <span className="video-call-btn" onClick={() => this.handleDialup(1)}>视频</span>
              <span className="audio-call-btn" onClick={() => this.handleDialup(0)}>音频</span>
            </div>
          </div>
          {/* 通话记录; 联系人 */}
          <div className="dialup-record-list">
            <LogContacts
              onAdd={(item) => this.handleAddMemFromList(item)}
            />
          </div>
        </div>
      </Layout>
    )
  }
}

const mapState = (state) => ({
  defaultAcct: state.defaultAcct,
  mainHeight: state.mainHeight
})

const mapDispatch = (dispatch) => {
  var actions = {
      setDefaultAcct: Actions.set_defaultacct,
      getAcctStatus: Actions.getAcctStatus,

  }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapState, mapDispatch)(Enhance(Dialup))