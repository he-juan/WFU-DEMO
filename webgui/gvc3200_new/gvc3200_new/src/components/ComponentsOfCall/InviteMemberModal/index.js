import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TagsInput from 'react-tagsinput'
import { Modal, Tabs, Input, Select, Button, message } from 'antd'
import { deepCopy } from '@/utils/tools'
import ContactsTab from './ContactsTab'
import CallLogsTab from './CallLogsTab'
import GroupMembersModal from './GroupMembersModal'
import { $t, formatMessage } from '@/Intl'
import './InviteMemberModalStyle.less'

const Option = Select.Option
const TabPane = Tabs.TabPane

@connect(
  state => ({
    acctStatus: state.acctStatus, // 获取账号状态-所有激活账号
    defaultAcct: state.defaultAcct.toString(), // 默认账号
    maxLineCount: state.maxLineCount, // 最大线路数
    linesInfo: state.linesInfo, // 线路信息
    contacts: state.contacts, // 联系人列表
    contactsGroups: state.contactsGroups, // 联系人群组
    callLogs: state.callLogs, // 通话记录
    timezone: state.timezone // 时区
  })
)
class InviteMemberModal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired, // 可视化
    members: PropTypes.array, // 已存在的成员
    onCancel: PropTypes.func.isRequired, // 取消事件
    handleMemberData: PropTypes.func.isRequired // 添加
  }

  static defaultProps = {
    members: []
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
          number: '.'
        }
      ],
      activeTab: '1', // 当前tab页码
      groupMembersModalvisible: false,
      groupMembers: [] // 当前打开添加分组成员弹窗的members
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
  limitMaxMembers = (memToCall, flag) => {
    if (memToCall.length === 0) return memToCall
    const { members, maxLineCount, linesInfo } = this.props
    let _memToCall = deepCopy(memToCall)

    let lastMem = _memToCall.pop() // 最后一个是待添加的, 暂移除
    let temp = _memToCall.concat(linesInfo, members) // 并且与已在通话线路中的成员合并(和已添加的成员合并)
    let nonIPVTlen = temp.filter(v => +v.acct !== 1).length // 非IPVT线路数量
    let IPVTlen = temp.length - nonIPVTlen // IPVT线路数量

    // 存在ipvt线路且ipvt线路成员不超过100
    let curLinesLen = IPVTlen > 0 ? nonIPVTlen + 1 : nonIPVTlen // 线路总数量, IPVT线路合并为1路
    // 如果当前输入框内成员数加已有线路数 大于限制 且 当前待添加的不是IPVT
    if (curLinesLen >= maxLineCount) {
      if (IPVTlen === 0) {
        message.error(formatMessage({ id: 'm_137' }, { max: maxLineCount })) // 成员数量已达上限
      } else if (IPVTlen > 0 && +lastMem.acct !== 1) {
        message.error($t('m_231')) // 通话线路已达上限，当前只能添加ipvt联系人
        flag === 'input' && this.setState({ selectAcct: '1' })
      } else if (IPVTlen > 0 && +lastMem.acct === 1) {
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
          return mem.number !== n || (mem.number === n && mem.acct !== acct)
        })
        _memToCall.push({
          number: n,
          acct,
          isvideo,
          source,
          isconf: '1',
          name: names[i],
          email: email || ''
        })
      })
    } else {
      // 去重 去掉相同号码且账号类型相同的账号
      _memToCall = _memToCall.filter(mem => {
        return mem.number !== number || (mem.number === number && mem.acct !== acct)
      })
      _memToCall.push({
        number,
        acct,
        isvideo,
        source,
        isconf: '1',
        name,
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

  // 添加时或者减少时自动计算偏移量
  handleTranslate = () => {
    const tagWidth = document.querySelector('.react-tagsinput').offsetWidth - 4
    const tagSpanWidth = document.querySelector('.react-tagsinput > span').offsetWidth
    const offset = parseInt(tagWidth - tagSpanWidth)
    if (offset < 0) {
      document.querySelector('.react-tagsinput > span').style.transform = `translateX(${offset}px)`
    } else {
      document.querySelector('.react-tagsinput > span').style.transform = `translateX(${0}px)`
    }
  }

  // 从tags添加拨打成员
  handleChangeMemToCall = (mems, changed, changedIndexes) => {
    const { selectAcct, memToCall } = this.state
    let _memToCall = deepCopy(memToCall)
    // 判断当前changed的行为, mems的长度大于时为添加
    if (mems.length > memToCall.length) {
      if (!/\D/.test(changed[0])) {
        _memToCall.push({
          number: changed[0],
          acct: selectAcct,
          isvideo: '1',
          isconf: '1',
          source: '2',
          name: changed[0],
          email: ''
        })
      } else {
        message.error($t('m_224')) // '此号码不符合拨号规则!'
        this.setState({
          tagsInputValue: ''
        })
        return false
      }
    } else {
      _memToCall.splice(changedIndexes[0], 1)
    }
    _memToCall = this.limitMaxMembers(_memToCall, 'input')
    this.setState({
      memToCall: _memToCall,
      tagsInputValue: ''
    }, () => {
      if (memToCall.length <= _memToCall.length) {
        this.handleTranslate()
      }
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
      this.handleGroupModal(true, record.children) // 打开群组成员添加弹窗
      // for (let i = 0; i < record.children.length; i++) {
      //   _memToCall = this.pushMemToCall(_memToCall, record.children[i]) // 先插入
      //   const realData = this.limitMaxMembers(_memToCall, 'add') // 判断是够超出限制
      //   // 对比长度，若已添加限制 则跳出循环
      //   if (realData.length < _memToCall.length) {
      //     _memToCall = realData
      //     break
      //   }
      // }
    } else {
      _memToCall = this.pushMemToCall(_memToCall, record)
      _memToCall = this.limitMaxMembers(_memToCall, 'add')
    }
    this.setState({
      memToCall: _memToCall,
      tagsInputValue: ''
    }, () => {
      this.handleTranslate()
    })
  }

  // bluejeans 账号处理
  handleBjMember = (content) => {
    const { bjMemToCall } = this.state
    let _bjMemToCall = deepCopy(bjMemToCall)

    let numAry = _bjMemToCall[0].number.split('.')
    numAry[0] = content.id ? content.id : numAry[0]
    numAry[1] = content.pw ? content.pw : numAry[1]

    _bjMemToCall[0].number = numAry.join('.')
    this.setState({
      bjMemToCall: _bjMemToCall
    })
  }

  // 视频邀请哈 1 视频 0 音频
  handleInvite = isvideo => {
    const { memToCall, selectAcct, tagsInputValue, bjMemToCall } = this.state
    const { handleMemberData } = this.props
    let _memToCall = deepCopy(memToCall)
    // 如果有输入数字但未添加进成员, 拨打时push到成员里
    if (tagsInputValue !== '') {
      if (!/\D/.test(tagsInputValue)) {
        _memToCall.push({
          number: tagsInputValue,
          acct: selectAcct,
          isvideo: isvideo,
          source: '2',
          isconf: '1'
        })
      } else {
        message.error($t('m_224')) // '此号码不符合拨号规则!'
        this.setState({
          tagsInputValue: ''
        })
        return false
      }
    }

    // bluejeans 处理
    if (selectAcct === '2') {
      let numAry = bjMemToCall[0].number.split('.')
      if (!numAry[0].trim().length || !numAry[0].trim().length) return false
      _memToCall = bjMemToCall
    }

    if (_memToCall.length === 0) {
      return false
    }

    handleMemberData(_memToCall.map(el => {
      return {
        ...el,
        isvideo,
        acct: +el.acct !== -1 ? el.acct : selectAcct
      }
    }), () => {
      this.setState({
        memToCall: [],
        tagsInputValue: ''
      }, () => {
        this.handleCancel()
      })
    })
  }

  // 取消的同时，去除数据
  handleCancel = () => {
    const { onCancel } = this.props
    this.setState({
      memToCall: [],
      tagsInputValue: '',
      activeTab: '1'
    }, () => {
      document.querySelector('.react-tagsinput > span').style.transform = 'translateX(0px)'
    })
    onCancel()
  }

  // componentDidMount
  componentDidMount () {
    const { acctStatus, defaultAcct } = this.props
    const effectAccts = acctStatus.filter(v => {
      return v.activate && v.acctIndex !== 2 && v.acctIndex !== 5
    })
    let selectAcct = defaultAcct
    if (+defaultAcct === 2 || +defaultAcct === 5) {
      selectAcct = effectAccts[0].acctIndex.toString()
    }
    this.setState({ selectAcct })

    document.addEventListener('click', this.handleClickFn, false)
  }

  // componentWillUnmount
  componentWillUnmount () {
    document.removeEventListener('click', this.handleClickFn, false)
  }

  // 绑定click 事件
  handleClickFn = (e) => {
    const exist = e.path.filter(item => {
      return typeof (item.className) === 'string' && item.className.includes('react-tagsinput')
    }).length
    if (exist) {
      document.addEventListener('keydown', this.handleKeyDownFn, false)
    } else {
      document.removeEventListener('keydown', this.handleKeyDownFn, false)
    }
  }

  // 左右按键 keydown 事件
  handleKeyDownFn = ({ keyCode }) => {
    // keyCode: 37 Left 39 Right
    const tagWidth = document.querySelector('.react-tagsinput').offsetWidth - 4
    const tagSpanWidth = document.querySelector('.react-tagsinput > span').offsetWidth
    const offset = parseInt(tagWidth - tagSpanWidth)
    const transform = document.querySelector('.react-tagsinput > span').style.transform
    const tx = parseInt(transform ? transform.match(/translateX\((\S*)px\)/)[1] : 0)
    if (offset < 0) {
      if (+keyCode === 39) {
        if (tx <= 0) {
          document.querySelector('.react-tagsinput > span').style.transform = `translateX(${+tx - 50 < offset ? offset : +tx - 50}px)`
        }
      } else if (+keyCode === 37) {
        if (tx >= offset) {
          document.querySelector('.react-tagsinput > span').style.transform = `translateX(${+tx + 50 >= 0 ? 0 : +tx + 50}px)`
        }
      }
    } else {
      tx < 0 && (document.querySelector('.react-tagsinput > span').style.transform = `translateX(${0}px)`)
    }
  }

  // 添加群组成员 打开model
  handleGroupModal = (bool = false, members = []) => {
    this.setState({
      groupMembersModalvisible: bool,
      groupMembers: members
    })
  }

  // 添加群组成员 确认添加
  handleGroupAdd = (records) => {
    let { memToCall, selectAcct } = this.state
    if (+selectAcct === 2) return

    let _memToCall = deepCopy(memToCall)
    for (let i = 0; i < records.length; i++) {
      _memToCall = this.pushMemToCall(_memToCall, records[i]) // 先插入
      const realData = this.limitMaxMembers(_memToCall, 'add') // 判断是够超出限制
      // 对比长度，若已添加限制 则跳出循环
      if (realData.length < _memToCall.length) {
        _memToCall = realData
        break
      }
    }

    this.setState({
      memToCall: _memToCall,
      tagsInputValue: ''
    }, () => {
      this.handleTranslate()
    })
  }

  render () {
    const { visible, acctStatus, contacts, contactsGroups, callLogs, timezone, members, maxLineCount, linesInfo } = this.props
    const { memToCall, activeTab, selectAcct, tagsInputValue, groupMembersModalvisible, groupMembers } = this.state
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
              inputProps={{ placeholder: '', maxLength: '23', style: { width: Math.min(tagsInputValue.length * 15, 590) } }}
              inputValue={tagsInputValue}
              onChangeInput={this.handleTagsInput}
              renderTag={this.renderTag}
            />
            {
              memToCall.length > 0 || tagsInputValue.length > 0 ? null : <span className='tagsinput-placeholder'>{ $t('c_350') }</span>
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
        onCancel={this.handleCancel}
        title={$t('c_336')}
        footer={
          <div>
            <Button type='primary' disabled={memToCall.length === 0 && selectAcct !== '2'} onClick={() => this.handleInvite('0')}>{$t('b_062')}</Button>
            <Button type='primary' disabled={memToCall.length === 0 && selectAcct !== '2'} onClick={() => this.handleInvite('1')}>{$t('b_061')}</Button>
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
                    // bugfree 3684
                    return v.activate && v.acctIndex !== 2 && v.acctIndex !== 5
                  })
                  .map((v, i) => {
                    return (
                      <Option key={i} value={v.acctIndex.toString()}><em className={`acct-icon acct-${v.acctIndex} ${!v.register ? 'acct-unregister' : ''}`}></em>{v.name}</Option>
                    )
                  })
              }
            </Select>
          </div>
          {/* tabcontent */}
          {
            activeTab === '1' ? <ContactsTab contacts={contacts} groups={contactsGroups} onAdd={this.handleAddMemFromList} filterTags={tagsInputValue} /> : <CallLogsTab callLogs={callLogs} timezone={timezone} onAdd={this.handleAddMemFromList} filterTags={tagsInputValue} />
          }
          {/* 群组添加时要弹窗 */}
          {
            groupMembersModalvisible && <GroupMembersModal exist={{ members, maxLineCount, linesInfo, memToCall }} groupMembers={groupMembers} pushMemToCall={this.pushMemToCall} onAdd={this.handleGroupAdd} onCancel={this.handleGroupModal} />
          }
        </div>
      </Modal>
    )
  }
}

export default InviteMemberModal
