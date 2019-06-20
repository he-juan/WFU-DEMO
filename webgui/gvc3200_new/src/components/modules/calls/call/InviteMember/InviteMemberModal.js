import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance";
import * as Actions from 'components/redux/actions/index'
import { Modal, Select, Input, Checkbox, Tabs, Button, message } from 'antd';
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

function deepCopy(obj){
  return JSON.parse(JSON.stringify(obj))
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
      tagsInputValue: '',
      bjMemToCall: [   // bluejeans 拨打成员
        {
          acct: '2',
          isvideo: '1',
          source: '2',
          num: '.'
        }
      ],
      activeTab: '1',
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
      tagsInputValue: ''
    })
  }

  // 添加拨打成员
  handleChangeMemToCall = (mems) => {
    const { selectAcct, memToCall } = this.state
    let _memToCall = mems.map((number) => {
      // 已添加进memToCall的 直接从memToCall取, 不要去覆盖
      let memAlready = memToCall.filter(item => item.name == number)[0]
      if(memAlready) return memAlready
      return {
        num: number,
        acct: selectAcct,
        isvideo: '1',
        isconf: '1',
        source: '2',
        name: number
      }
    })
    // 输入的非数字字符串无法添加
    let lastMem = _memToCall.slice(-1)[0]
    if(lastMem && /\D/.test(lastMem.num) && lastMem.acct != '2') {
      message.error(this.tr('a_10104'))
      return false
    }
    _memToCall = this.limitMaxMembers(_memToCall, 'input')
    this.setState({
      memToCall:_memToCall,
      tagsInputValue: ''
    })
  }

  handleAddMemFromList = (record) => {
    let { memToCall, selectAcct } = this.state
    if(selectAcct == 2) return
    let _memToCall = deepCopy(memToCall)
    if(record.isconf == '1' && record.children) {
      record.children.forEach(i => {
        _memToCall = this.pushMemToCall(_memToCall, i)
        _memToCall = this.limitMaxMembers(_memToCall, 'add')
      })
    } else {
      _memToCall = this.pushMemToCall(_memToCall, record)
      _memToCall = this.limitMaxMembers(_memToCall, 'add')
    }


    this.setState({
      memToCall: _memToCall,
      tagsInputValue: ''
    })
  }
  // push _memToCall 添加 去重等操作
  pushMemToCall(_memToCall, item) {
    const {number, acct, isvideo, source, name} = item

    if(acct == '1') {
      let names = name.split(',')
      number.split(',').forEach((n, i) => {
         // 去重 去掉相同号码且账号类型相同的账号
        _memToCall = _memToCall.filter(mem => {
          return mem.num != n || (mem.num == n && mem.acct != acct)
        })
        _memToCall.push({
          num: n,
          acct: acct,
          isvideo: isvideo,
          source: source,
          isconf: '1',
          name: names[i]
        })
      })
    } else {
       // 去重 去掉相同号码且账号类型相同的账号
      _memToCall = _memToCall.filter(mem => {
        return mem.num != number || (mem.num == number && mem.acct != acct)
      })
      _memToCall.push({
        num: number,
        acct: acct,
        isvideo: isvideo,
        source: source,
        isconf: '1',
        name: name
      })
    }

    return _memToCall
  }
  // bluejeans 账号处理
  handleBjMember = (content) => {
    const { bjMemToCall } = this.state
    let _bjMemToCall = deepCopy(bjMemToCall)

    let numAry = _bjMemToCall[0].num.split('.')
    numAry[0] = content.id ? content.id : numAry[0]
    numAry[1] = content.pw ? content.pw : numAry[1]

    _bjMemToCall[0].num = numAry.join('.')
    this.setState({
      bjMemToCall: _bjMemToCall
    })
  }

  handleTagsInput = (v) => {
    this.setState({
      tagsInputValue: v
    })
  }

  // 切换tab
  selectTab = (i) => {
    this.setState({
      activeTab: i,
      tagsInputValue: ''
    })
  }

  handleInvite = (isvideo) => {
    const { memToCall, selectAcct, tagsInputValue, bjMemToCall } = this.state
    let _memToCall = deepCopy(memToCall)
    // 如果有输入数字但未添加进成员, 拨打时push到成员里
    if(tagsInputValue != '') {
      if(!/\D/.test(tagsInputValue)) {
        _memToCall.push({
          num: tagsInputValue,
          acct: selectAcct,
          isvideo: isvideo,
          source: '2',
          isconf: '1',
        })
      } else {
        message.error(this.tr('a_10104'))
        this.setState({
          tagsInputValue: ''
        })
        return false
      }
    }

    // bluejeans 处理
    if(selectAcct == 2) {
      let numAry = bjMemToCall[0].num.split('.')
      if(!numAry[0].trim().length || !numAry[0].trim().length) return false
      _memToCall = bjMemToCall
    }

    if(_memToCall.length == 0 ) {
      return false
    }
    this.props.makeCall(_memToCall.map(item => {
      item.isvideo = isvideo
      return item
    }))
    this.setState({
      memToCall: [],
      tagsInputValue: ''
    })
    this.props.onHide()
  }

  // 最大线路限制 IPVT成员合并为一路, 非IPVT成员各自为一路
  limitMaxMembers(_memToCall, flag) {
    if (_memToCall.length == 0) return _memToCall
    const { maxlinecount, linesInfo } = this.props
    let lastMem = _memToCall.pop()  // // 最后一个是待添加的, 暂移除
    let temp = _memToCall.concat(linesInfo) // 并且与已在通话线路中的成员合并
    let nonIPVTlen = temp.filter(v => v.acct != '1').length // 非IPVT线路数量
    let IPVTlen = temp.length - nonIPVTlen

    // 存在ipvt线路且ipvt线路成员不超过100
    let curLinesLen = IPVTlen > 0  ? nonIPVTlen + 1 : nonIPVTlen  // 线路总数量
    let maxNum = 200
    if(IPVTlen >= maxNum && lastMem.acct == '1') {
      this.props.promptMsg('ERROR', 'a_23577')
      return _memToCall
    }

    if(curLinesLen >= maxlinecount ) {   // 如果当前输入框内成员数加已有线路数 大于限制 且 当前待添加的不是IPVT
      if(IPVTlen == 0 ) {
        this.props.promptMsg('ERROR', 'a_23550')
      } else if(IPVTlen > 0 && lastMem.acct != '1') {
        this.props.promptMsg('ERROR','a_23551')
        if(flag == 'input') {
          this.setState({
            selectAcct: '1'
          })
        }
      } else if(IPVTlen > 0 && IPVTlen < maxNum && lastMem.acct == '1') {
        _memToCall.push(lastMem)
      }
    } else {
      _memToCall.push(lastMem)
    }


    return _memToCall
  }


  // 根据账号类型区分颜色
  renderTag = (props) => {
    let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, className, ...other} = props
    const { memToCall } = this.state
    return (
      <span key={key} {...other} className={`${className} acct-${memToCall[key].acct}`} >
        {getTagDisplayValue(tag)}
        {!disabled &&
          <a className={classNameRemove} onClick={(e) => onRemove(key)} />
        }
      </span>
    )
  }
  handleAddMember = () => {
    const { memToCall } = this.state
    let data = []
    console.log(memToCall)
    memToCall.forEach(item => {
      let obj = item
      obj.number = item.num
      data.push(obj)
    })
    this.props.handleNumberData(data)
    this.setState({
      memToCall: [],
      tagsInputValue: ''
    })
    this.props.onHide()
  }

  render() {
    const { visible, onHide } = this.props
    const { memToCall, acctStatus, selectAcct, activeTab, tagsInputValue } = this.state
    if( !acctStatus ) return null;

     // 通话输入域
     const InputArea = (
      <div className="invite-inputs-area">
        {
          selectAcct != 2 ?
          <div className="invite-tagsinput-wrapper">
            <TagsInput
              value={memToCall.map(v => v.name)}
              onChange={this.handleChangeMemToCall}
              addKeys={[13]}
              onlyUnique={true}
              // addOnBlur={true}
              inputProps={{placeholder: '', maxLength: '23', style:{width: tagsInputValue.length * 10 }}}
              inputValue={tagsInputValue}
              onChangeInput={this.handleTagsInput}
              renderTag={this.renderTag}
              />
            {
              memToCall.length > 0 || tagsInputValue.length > 0
              ? null
              :<span className="tagsinput-placeholder"> {this.tr('a_16693')}</span>
           }
          </div>
          :
          <div className="bj-inputs">
            <Input placeholder="Meeting ID" onChange={(e) => this.handleBjMember({id: e.target.value})} size="large" ></Input>
            <Input placeholder="Password (optional)" onChange={(e) => this.handleBjMember({pw: e.target.value}) } size="large"></Input>
          </div>
        }
      </div>
    )

    return (
      <Modal
        width={1000}
        style={this.modalStyle}
        className="invite-modal"
        visible={visible}
        onCancel={onHide}
        title={this.tr('a_517')}
        okText={this.tr('a_23')}
        footer={
           this.props.isJustAddMember ?
              <Button onClick={() => this.handleAddMember()}>添加</Button>
              :
              <div>
                <Button type="primary" disabled={memToCall.length == 0 && selectAcct != '2'} onClick={() => this.handleInvite(1)}>{this.tr("a_23557"/**视频邀请 */)}</Button>
                <Button type="primary" disabled={memToCall.length == 0 && selectAcct != '2'} onClick={() => this.handleInvite(0)}>{this.tr("a_23558"/**音频邀请 */)}</Button>
              </div>
        }
      >
        <div style={{ height: '570px' }}>
          <Tabs onChange={(i) => this.selectTab(i)}>
            <TabPane tab={this.tr('a_23556')} key="1"></TabPane>
            <TabPane tab={this.tr('a_307')} key="2"></TabPane>
            {/* <TabPane tab="企业通讯录" key="3"></TabPane> */}
          </Tabs>
          <div className="invite-area">
            {InputArea}
            <Select className="acct-select" size="large" value={selectAcct} onChange={item => this.handleSelectAcct(item)}>
              {
                acctStatus.map((v, i) => {
                  if(!v.activate) return null

                  return (
                    <Option key={i} value={v.acctindex} disabled={!v.register}><em className={`acct-icon acct-${v.acctindex} ${!v.register ? 'acct-unregister' : ''}`}></em>{v.name}</Option>
                  )
                })
              }
            </Select>
          </div>
          {
            activeTab == '1' ?
            <ContactsTab onAdd={(item) => this.handleAddMemFromList(item)} filterTags={tagsInputValue} />
            : activeTab == '2' ?
            <CallLogsTab onAdd={(item) => this.handleAddMemFromList(item)} filterTags={tagsInputValue} />
            :
            <EpContactsBookTab onAdd={(item) => this.handleAddMemFromList(item)} filterTags={tagsInputValue} />
          }
        </div>
      </Modal>
    )
  }
}




const mapState = (state) => {
  return {
    defaultAcct: state.defaultAcct,
    maxlinecount: state.maxlinecount,
    linesInfo: state.linesInfo
  }
}
const mapDispatch = (dispatch) => {
  let actions = {
    promptMsg:Actions.promptMsg,
    getAcctStatus: Actions.getAcctStatus,
    makeCall: Actions.makeCall
  }
  return bindActionCreators(actions, dispatch)
}
export default connect(mapState, mapDispatch)(Enhance(InviteMemberModal))

