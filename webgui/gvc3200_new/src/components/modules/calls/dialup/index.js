import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance"
import { Layout, Dropdown, Menu, Input, Button, Icon, message } from "antd"
import TagsInput from 'react-tagsinput'
import * as Actions from 'components/redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LogContacts from './LogAndContacts'
import './dialup.less'

function parseAcctStatus(acctstatus) {
  let headers = acctstatus.headers
  let result = [];
  let acctIndex = [
    { index: '0',name: 'SIP' },
    { index: '1',name: 'IPVideoTalk' },
    { index: '2',name: 'BlueJeans' },
    { index: '8',name: 'H.323' },
  ]
  acctIndex.map((item) => {
    let i = item.index
    let name = item.name
    result.push({
      "acctindex": i,
      "register": parseInt(headers[`account_${i == 8 ? 6 : i}_status`]),  // 账号注册状态
      "activate": parseInt(headers[`account_${i == 8 ? 6 : i}_activate`]), // 账号激活状态
      "num": headers[`account_${i == 8 ? 6 : i}_no`],
      "name": name
    })
  })
  return result
}

function deepCopy(obj){
  return JSON.parse(JSON.stringify(obj))
}

class Dialup extends Component {
  constructor(props){
    super(props)
    this.state = {
      acctStatus: null,  // 所有激活账号
      selectAcct: this.props.defaultAcct || '0',     // 当前选中账号
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
      tagsInputValue: ''
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
  // 添加拨打成员, 只有输入逗号回车键才会触发
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

  // 通过联系人通话记录列表添加成员
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

    if(IPVTlen >= 200 && lastMem.acct == '1') {
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
      } else if(IPVTlen > 0 && IPVTlen < 200 && lastMem.acct == '1') {
        _memToCall.push(lastMem)
      }
    } else {
      _memToCall.push(lastMem)
    }
    
    
    return _memToCall
  }

  // 呼出接口
  handleDialup = (isvideo) => {
    const { memToCall, selectAcct, tagsInputValue, bjMemToCall } = this.state
    let _memToCall = deepCopy(memToCall)
    // 如果有输入数字但未添加进成员, 拨打时push到成员里
    if(tagsInputValue != '' && !/\D/.test(tagsInputValue)) {
      _memToCall.push({
        num: tagsInputValue,
        acct: selectAcct,
        isvideo: isvideo,
        source: '2',
        isconf: '1',
      })
    }
    
    // bluejeans 处理
    if(selectAcct == 2) {
      let numAry = bjMemToCall[0].num.split('.')
      if(!numAry[0].trim().length || !numAry[0].trim().length) return false
      _memToCall = bjMemToCall
    }

    
    if(_memToCall.length == 0 ) {
      // ipvt 快速会议
      if (selectAcct == 1) { 
        this.props.quickStartIPVConf(isvideo)
      } 
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
  render() {
    const { acctStatus, selectAcct, memToCall, tagsInputValue } = this.state
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
                <span><em className={`acct-icon acct-${v.acctindex} ${!v.register ? 'acct-unregister' : ''}`}></em>{v.name}</span>
                <span>{v.num}</span>
                <span>{!v.register ? this.tr('a_1139') : defaultAcct == v.acctindex ? this.tr('a_19113') : <Button type="primary" size='small' onClick={this.setDefaultAcct.bind(this, v.acctindex)}>{this.tr('a_16697')}</Button>}</span>
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
              :<span className="tagsinput-placeholder"> {selectAcct == 1 ? `${this.tr('a_16693')}( ${this.tr('a_10158')} )` : this.tr('a_16693')} </span>
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
    
    let selectAcctItem = acctStatus.filter(item => item.acctindex == selectAcct)[0] || '0'
    return (
      <Layout className="content-container">
        <div className="subpagetitle">{this.tr("a_9400")}</div>
        <div className="dialup-main" style={{minHeight: this.props.mainHeight}}>
          {/* 账号切换以及呼出 */}
          <div className="dialup-box">
            <div className="dialup-inputs">
              <Dropdown overlay={AcctMenu} trigger={['click']}>
                <div className={`selected-acct ${selectAcctItem.register == 0 ? 'unregister' : ''}`}>
                  <span><em className={`acct-icon acct-${selectAcct}`}></em>{selectAcctItem.name}</span><span>{selectAcctItem.num}</span> <Icon type="caret-down" />
                </div>
              </Dropdown>
              {InputArea}
            </div>
            <div className="dialup-btns">
              <span className="video-call-btn" onClick={() => this.handleDialup(1)}>
                <em />
              </span>
              <span className="audio-call-btn" onClick={() => this.handleDialup(0)}>
                <em />
              </span>
            </div>
          </div>
          {/* 通话记录; 联系人 */}
          <div className="dialup-record-list">
            <p className="record-list-title">{this.tr('a_23552')}</p>
            <LogContacts
              onAdd={(item) => this.handleAddMemFromList(item)}
              filterTags={tagsInputValue}
            />
          </div>
        </div>
      </Layout>
    )
  }
}

const mapState = (state) => ({
  linesInfo: state.linesInfo,
  defaultAcct: state.defaultAcct,
  mainHeight: state.mainHeight,
  maxlinecount: state.maxlinecount
})

const mapDispatch = (dispatch) => {
  var actions = {
      promptMsg:Actions.promptMsg,
      setDefaultAcct: Actions.set_defaultacct,
      getAcctStatus: Actions.getAcctStatus,
      makeCall: Actions.makeCall,
      quickStartIPVConf: Actions.quickStartIPVConf

  }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapState, mapDispatch)(Enhance(Dialup))