import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TagsInput from 'react-tagsinput'
import { Modal, Tabs, Input, Select, Button, message } from 'antd'
import API from '@/api'
import { deepCopy } from '@/utils/tools'
import ContactsTab from './ContactsTab'
import CallLogsTab from './CallLogsTab'
import { $t } from '@/Intl'
import './InviteMemberModalStyle.less'

const Option = Select.Option
const TabPane = Tabs.TabPane

@connect(
  state => ({
    acctStatus: state.acctStatus, // 获取账号状态-所有激活账号
    defaultAcct: state.defaultAcct.toString(), // 默认账号
    maxLineCount: '', // 最大线路数
    linesInfo: '', // 线路信息
    contacts: state.contacts, // 联系人列表
    callLogs: state.callLogs, // 通话记录
    timezone: state.timezone // 时区
  })
)
class InviteMemberModal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired, // 可视化
    onCancel: PropTypes.func.isRequired, // 取消事件
    handleMemberData: PropTypes.func.isRequired, // 添加
    isJustAddMember: PropTypes.bool // 只是添加
  }

  // constructor
  constructor (props) {
    super(props)

    this.state = {
      // acctStatus: null, // 所有激活账号
      selectAcct: '0', // 当前选中账号
      memToCall: [], // 输入的待拨打成员号码
      tagsInputValue: '', // tags 输入值
      bjMemToCall: [ // bluejeans 拨打成员
        {
          acct: '2',
          isvideo: '1',
          source: '2', // 来源
          num: '.'
        }
      ],
      activeTab: '1' // 当前tab页码
    }
  }

  // 切换tab
  selectTab = (i) => {
    this.setState({
      activeTab: i,
      tagsInputValue: ''
    })
  }

  // 最大线路限制 IPVT成员合并为一路, 非IPVT成员各自为一路
  limitMaxMembers = (_memToCall, flag) => {
    if (_memToCall.length === 0) return _memToCall
    const { maxlinecount, linesInfo } = this.props
    let lastMem = _memToCall.pop() // 最后一个是待添加的, 暂移除
    let temp = _memToCall.concat(linesInfo) // 并且与已在通话线路中的成员合并
    let nonIPVTlen = temp.filter(v => v.acct !== '1').length // 非IPVT线路数量
    let IPVTlen = temp.length - nonIPVTlen

    // 存在ipvt线路且ipvt线路成员不超过100
    let curLinesLen = IPVTlen > 0 ? nonIPVTlen + 1 : nonIPVTlen // 线路总数量
    let maxNum = 200
    if (IPVTlen >= maxNum && lastMem.acct === '1') {
      message.error('IPVT' + $t('m_137'))
      return _memToCall
    }
    // 如果当前输入框内成员数加已有线路数 大于限制 且 当前待添加的不是IPVT
    if (curLinesLen >= maxlinecount) {
      if (IPVTlen === 0) {
        message.error($t('m_137'))
      } else if (IPVTlen > 0 && lastMem.acct !== '1') {
        message.error($t('m_231'))
        flag === 'input' && this.setState({ selectAcct: '1' })
      } else if (IPVTlen > 0 && IPVTlen < maxNum && lastMem.acct === '1') {
        _memToCall.push(lastMem)
      }
    } else {
      _memToCall.push(lastMem)
    }

    return _memToCall
  }

  // push _memToCall 添加 去重等操作
  pushMemToCall = (_memToCall, item) => {
    const { number, acct, isvideo, source, name, email } = item

    if (acct === '1') {
      let names = name.split(',')
      number.split(',').forEach((n, i) => {
        // 去重 去掉相同号码且账号类型相同的账号
        _memToCall = _memToCall.filter(mem => {
          return mem.num !== n || (mem.num === n && mem.acct !== acct)
        })
        _memToCall.push({
          num: n,
          acct: acct,
          isvideo: isvideo,
          source: source,
          isconf: '1',
          name: names[i],
          email: email || ''
        })
      })
    } else {
      // 去重 去掉相同号码且账号类型相同的账号
      _memToCall = _memToCall.filter(mem => {
        return mem.num !== number || (mem.num === number && mem.acct !== acct)
      })
      _memToCall.push({
        num: number,
        acct: acct,
        isvideo: isvideo,
        source: source,
        isconf: '1',
        name: name,
        email: email || ''
      })
    }
    return _memToCall
  }

  // 选择拨打账号
  handleSelectAcct = (item) => {
    this.setState({
      selectAcct: item,
      tagsInputValue: ''
    })
  }

  // 从tags添加拨打成员
  handleChangeMemToCall = (mems) => {
    const { selectAcct, memToCall } = this.state
    let _memToCall = mems.map((number) => {
      // 已添加进memToCall的 直接从memToCall取, 不要去覆盖
      let memAlready = memToCall.filter(item => item.name === number)[0]
      if (memAlready) return memAlready
      return {
        num: number,
        acct: selectAcct,
        isvideo: '1',
        isconf: '1',
        source: '2',
        name: number,
        email: ''
      }
    })
    // 输入的非数字字符串无法添加
    let lastMem = _memToCall.slice(-1)[0]
    if (lastMem && /\D/.test(lastMem.num) && +lastMem.acct !== 2) {
      message.error('此号码不符合拨号规则!')
      return false
    }
    _memToCall = this.limitMaxMembers(_memToCall, 'input')
    this.setState({
      memToCall: _memToCall,
      tagsInputValue: ''
    })
  }

  // 设置 tagsInputValue
  handleTagsInput = (v) => {
    this.setState({ tagsInputValue: v })
  }

  // 根据账号类型区分颜色
  renderTag = (props) => {
    let { tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, className, ...other } = props
    const { memToCall } = this.state
    return (
      <span key={key} {...other} className={`${className} acct-${memToCall[key].acct}`} >
        {getTagDisplayValue(tag)}
        {
          !disabled && <span className={classNameRemove} onClick={(e) => onRemove(key)} />
        }
      </span>
    )
  }

  // 添加成员向上一层modal
  handleAddMemFromList = (record) => {
    let { memToCall, selectAcct } = this.state
    if (+selectAcct === 2) return

    let _memToCall = deepCopy(memToCall)
    if (record.isconf === '1' && record.children) {
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

  // 视频邀请哈 1 视频 0 音频
  handleInvite = (isvideo) => {
    const { memToCall, selectAcct, tagsInputValue, bjMemToCall } = this.state
    let _memToCall = deepCopy(memToCall)
    // 如果有输入数字但未添加进成员, 拨打时push到成员里
    if (tagsInputValue !== '') {
      if (!/\D/.test(tagsInputValue)) {
        _memToCall.push({
          num: tagsInputValue,
          acct: selectAcct,
          isvideo: isvideo,
          source: '2',
          isconf: '1'
        })
      } else {
        message.error('此号码不符合拨号规则!')
        this.setState({
          tagsInputValue: ''
        })
        return false
      }
    }

    // bluejeans 处理
    if (selectAcct === '2') {
      let numAry = bjMemToCall[0].num.split('.')
      if (!numAry[0].trim().length || !numAry[0].trim().length) return false
      _memToCall = bjMemToCall
    }

    if (_memToCall.length === 0) {
      return false
    }
    API.makeCall(_memToCall.map(item => {
      item.isvideo = isvideo
      return item
    }))
    this.setState({
      memToCall: [],
      tagsInputValue: ''
    })
    this.props.onCancel()
  }

  // 这次是真的 要添加了
  handleAddMember = () => {
    const { memToCall } = this.state
    const { handleMemberData, onCancel } = this.props
    let data = memToCall.map(el => {
      let obj = el
      obj.number = el.num
      return obj
    })
    handleMemberData(data, () => {
      this.setState({
        memToCall: [],
        tagsInputValue: ''
      }, () => {
        onCancel()
      })
    })
  }

  // componentDidMount
  componentDidMount () {
    this.setState({
      selectAcct: this.props.defaultAcct
    })
  }

  render () {
    const { visible, onCancel, isJustAddMember, acctStatus, contacts, callLogs, timezone } = this.props
    const { memToCall, activeTab, selectAcct, tagsInputValue } = this.state
    if (!acctStatus) return null

    // 通话输入域
    const InputArea = (
      <div className='invite-inputs-area'>
        {
          selectAcct !== '2' ? <div className='invite-tagsinput-wrapper'>
            <TagsInput
              value={memToCall.map(v => v.name)}
              onChange={this.handleChangeMemToCall}
              addKeys={[13]}
              onlyUnique={true}
              // addOnBlur={true}
              inputProps={{ placeholder: '', maxLength: '23', style: { width: tagsInputValue.length * 10 } }}
              inputValue={tagsInputValue}
              onChangeInput={this.handleTagsInput}
              renderTag={this.renderTag}
            />
            {
              memToCall.length > 0 || tagsInputValue.length > 0 ? null : <span className='tagsinput-placeholder'>多个号码可以"Enter"分隔.</span>
            }
          </div> : <div className='bj-inputs'>
            <Input placeholder='Meeting ID' onChange={(e) => this.handleBjMember({ id: e.target.value })} />
            <Input placeholder='Password (optional)' onChange={(e) => this.handleBjMember({ pw: e.target.value })} />
          </div>
        }
      </div>
    )

    return (
      <Modal
        width={1000}
        className='invitemember-modal'
        visible={visible}
        onCancel={onCancel}
        title={$t('c_336')}
        footer={
          isJustAddMember ? <Button onClick={this.handleAddMember}>{$t('b_056')}</Button> : <div>
            <Button type='primary' disabled={memToCall.length === 0 && selectAcct !== '2'} onClick={() => this.handleInvite(1)}>{$t('b_061')}</Button>
            <Button type='primary' disabled={memToCall.length === 0 && selectAcct !== '2'} onClick={() => this.handleInvite(0)}>{$t('b_062')}</Button>
          </div>
        }
      >
        <div style={{ height: '570px' }}>
          <Tabs onChange={(i) => this.selectTab(i)}>
            {/* 本地通讯录 */}
            <TabPane tab={$t('c_333')} key='1'></TabPane>
            {/* 通话记录 */}
            <TabPane tab={$t('c_334')} key='2'></TabPane>
          </Tabs>
          {/* invite-area */}
          <div className='invite-area'>
            {InputArea}
            <Select className='acct-select' value={selectAcct} onChange={item => this.handleSelectAcct(item)} getPopupContainer={triggerNode => triggerNode}>
              {
                acctStatus
                  .filter(v => {
                    return v.activate
                  })
                  .map((v, i) => {
                    return (
                      <Option key={i} value={v.acctIndex.toString()} disabled={!v.register}><em className={`acct-icon acct-${v.acctIndex} ${!v.register ? 'acct-unregister' : ''}`}></em>{v.name}</Option>
                    )
                  })
              }
            </Select>
          </div>
          {/* tabcontent */}
          {
            activeTab === '1' ? <ContactsTab contacts={contacts} onAdd={this.handleAddMemFromList} filterTags={tagsInputValue} /> : <CallLogsTab callLogs={callLogs} timezone={timezone} onAdd={this.handleAddMemFromList} filterTags={tagsInputValue} />
          }
        </div>
      </Modal>
    )
  }
}

export default InviteMemberModal
