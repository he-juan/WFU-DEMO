import React, { Component } from 'react'
import Enhance from "components/mixins/Enhance"
import { Layout, Dropdown, Menu, Input, Button, Icon } from "antd"
import TagsInput from 'react-tagsinput'
import * as Actions from 'components/redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LogContacts from './LogAndContacts'
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
      return false
    }
    this.setState({
      memToCall:_memToCall
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
      })
    } else {
      _memToCall = this.pushMemToCall(_memToCall, record)
    }
    
    this.setState({
      memToCall: _memToCall,
      tagsInputValue: ''
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
      isconf: '1',
      name: name
    })
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
              // addOnBlur={true} 
              inputProps={{placeholder: '', maxLength: '23', style:{width: tagsInputValue.length * 10 }}}
              inputValue={tagsInputValue}
              onChangeInput={this.handleTagsInput}
              renderTag={this.renderTag}
              />
            {
              memToCall.length > 0 || tagsInputValue.length > 0
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
                  <span><em className={`acct-icon acct-${selectAcct}`}></em> {acctStatus[selectAcct].name}</span> <span>{acctStatus[selectAcct].num}</span> <Icon type="down"/>
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
              filterTags={tagsInputValue}
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
      makeCall: Actions.makeCall,
      quickStartIPVConf: Actions.quickStartIPVConf

  }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapState, mapDispatch)(Enhance(Dialup))