/* eslint-disable no-trailing-spaces */
/* eslint-disable padded-blocks */
/* eslint-disable no-multiple-empty-lines */
import React, { Component } from 'react'
import { Dropdown, Menu, Input, Button, Icon, message } from 'antd'
import TagsInput from 'react-tagsinput'
import { connect } from 'react-redux'
import { setDefaultAcct, getDefaultAcct, getAcctStatus } from '@/store/actions'
import { deepCopy, parseAcct, mapToSource } from '@/utils/tools'
import LogAndContacts from './LogAndContacts'
import API from '@/api'
import { $t, formatMessage } from '@/Intl'
import './Call.less'

const isIp = (value) => {
  return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/i.test(value) ||
  (/^\[?((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\]?$/.test(value) &&
  ((value.indexOf('[') !== -1 && value.indexOf(']')) !== -1 || (!(value.indexOf('[') !== -1) && !(value.indexOf(']') !== -1))))
}

@connect(
  state => ({
    linesInfo: state.linesInfo,
    maxLineCount: state.maxLineCount,
    acctStatus: state.acctStatus, // 激活的账号列表获取
    defaultAcct: state.defaultAcct, // 默认选中账号
    contacts: state.contacts, // 联系人列表
    callLogs: state.callLogs, // 通话记录
    IPVTExist: state.IPVTExist
  }),
  dispatch => ({
    setDefaultAcct: (acctIndex) => dispatch(setDefaultAcct(acctIndex)),
    getDefaultAcct: () => dispatch(getDefaultAcct()),
    getAcctStatus: () => dispatch(getAcctStatus())
  })
)

class Call extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selectAcct: this.props.defaultAcct || '0', // 当前选中账号
      memToCall: [],
      tagsInputValue: '',
      bjMemToCall: [{ num: '.' }],
      dataSource: this.parseDataSource(props.contacts, props.callLogs) // 表格数据
    }
  }

  componentDidMount = () => {
    this.props.getDefaultAcct()
    this.props.getAcctStatus()
    this.parseDataSource()
  }

  // 选择 账号
  handleSelectAcct = (item) => {
    let acctIndex = item.key
    this.setState({
      selectAcct: acctIndex,
      tagsInputValue: ''
    })
  }

  // 设置默认账号
  handleSetDefaultAcct = (acctIndex, e) => {
    const { setDefaultAcct } = this.props
    API.setDefAcct(acctIndex).then(m => {
      if (m.res === 'success') {
        message.success($t('m_232'))
        setDefaultAcct(acctIndex)
        setTimeout(() => {
          this.setState({
            selectAcct: acctIndex
          })
        }, 50)
      } else {
        message.error(m.msg)
      }
    })
  }

  // push _memToCall 添加 去重等操作
  pushMemToCall (_memToCall, item) {
    const { number, acct, isvideo, source, name } = item

    if (+acct === 1) {
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
          name: names[i]
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
        name: name
      })
    }

    return _memToCall
  }

  // 最大线路限制 IPVT成员合并为一路, 非IPVT成员各自为一路
  limitMaxMembers (_memToCall, flag) {
    if (_memToCall.length === 0) return _memToCall
    const { maxLineCount, linesInfo } = this.props

    let lastMem = _memToCall.pop() // 最后一个是待添加的, 暂移除
    let temp = _memToCall.concat(linesInfo) // 并且与已在通话线路中的成员合并
    let nonIPVTlen = temp.filter(v => +v.acct !== 1).length // 非IPVT线路数量
    let IPVTlen = temp.length - nonIPVTlen

    let curLinesLen = IPVTlen > 0 ? nonIPVTlen + 1 : nonIPVTlen // 线路总数量
    // 成员数量达到200上限
    if (IPVTlen >= 200 && +lastMem.acct === 1) {
      message.error($t('m_227')) // IPVideoTalk成员数量已达上限
      return _memToCall
    }
    // 如果当前输入框内成员数加已有线路数 大于限制 且 当前待添加的不是IPVT
    if (curLinesLen >= maxLineCount) {
      if (IPVTlen === 0) {
        message.error($t('m_226')) // 成员数量已达上限
      } else if (IPVTlen > 0 && +lastMem.acct !== 1) {
        message.error($t('m_225')) // 通话线路已达上限，当前只能选择IPVideoTalk号码.
        if (flag === 'input') {
          this.setState({ selectAcct: '1' })
        }
      } else if (IPVTlen > 0 && IPVTlen < 200 && +lastMem.acct === 1) {
        _memToCall.push(lastMem)
      }
    } else {
      _memToCall.push(lastMem)
    }

    return _memToCall
  }

  // 添加拨打成员, 只有输入逗号回车键才会触发
  handleChangeMemToCall = (mems) => {
    const { selectAcct, memToCall, tagsInputValue } = this.state
    let _memToCall = []
    if (tagsInputValue) { // 添加
      let lastNumber = tagsInputValue
      let lastMem = {
        num: lastNumber,
        acct: selectAcct,
        isvideo: '1',
        isconf: '1',
        source: '2',
        name: lastNumber
      }
      // 输入的非数字或ip字符串无法添加
      if (lastMem && /\D/.test(lastMem.num) && !isIp(lastMem.num) && +selectAcct !== 2) {
        return message.error($t('m_224')) // 此号码不符合拨号规则
      }
      // 号码去重
      let isUnique = memToCall.filter(item => item.num === lastMem.num && item.acct === lastMem.acct).length === 0
      if (!isUnique) {
        return message.error($t('m_235')) // 此联系人已存在
      }
      _memToCall = [...memToCall, lastMem]
      // 号码最大数量限制
      _memToCall = this.limitMaxMembers(_memToCall, 'input')

    } else { // 删除

      _memToCall = memToCall.slice(0, -1)

    }
    
    this.setState({
      memToCall: _memToCall
    })
  }

  // 赋值 tagsInputValue
  handleTagsInput = (v) => {
    this.setState({
      tagsInputValue: v
    })
  }

  // 根据账号类型区分颜色
  renderTag = (props) => {
    let { tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, className, ...other } = props
    const { memToCall } = this.state

    let colori = memToCall[key].acct
    if (+colori === -1) {
      let firstaccItem = this.props.acctStatus.filter(v => v.activate)[0]
      colori = firstaccItem ? firstaccItem.acctIndex : 0
    }

    return (
      <span key={key} {...other} className={`${className} acct-${colori}`} >
        { getTagDisplayValue(tag) }
        { !disabled && <span className={classNameRemove} onClick={() => onRemove(key)} /> }
      </span>
    )
  }

  // 呼出接口
  handleDialup = (isvideo) => {
    const { acctStatus } = this.props
    const { memToCall, selectAcct, tagsInputValue, bjMemToCall } = this.state
    // 账号未注册成功时 禁止拨打并提示错误
    let selectAcctItem = acctStatus.filter(item => +item.acctIndex === +selectAcct)[0]
    if (!selectAcctItem || selectAcctItem.register !== 1) {
      return message.error(formatMessage({ id: 'm_233' }, { acct: selectAcctItem.name }))
    }
    let _memToCall = deepCopy(memToCall)
    // 如果有输入数字但未添加进成员, 拨打时push到成员里
    if (tagsInputValue !== '') {
      if (!/\D/.test(tagsInputValue) || isIp(tagsInputValue)) {
        _memToCall.push({
          num: tagsInputValue,
          acct: selectAcct,
          isvideo: isvideo,
          source: '2',
          isconf: '1'
        })
      } else {
        message.error($t('m_224')) // 此号码不符合拨号规则
        this.setState({
          tagsInputValue: ''
        })
        return false
      }
    }

    // bluejeans 处理
    if (+selectAcct === 2) {
      let numAry = bjMemToCall[0].num.split('.')
      if (!numAry[0].trim().length || !numAry[0].trim().length) return false
      _memToCall = bjMemToCall
    }

    if (_memToCall.length === 0) {
      // ipvt 快速会议
      if (+selectAcct === 1) {
        // this.props.quickStartIPVConf(isvideo)
      } else {
        message.error($t('m_234'))
      }
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

  // 解析联系人
  parseContacts = (contacts) => {
    if (!contacts) return []
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
          lvl: '0',
          isfavourite: item.isfavourite
        }
        result.push(data)
      })
    })
    return result
  }

  // 解析通话记录
  parseCallLogs = (logs) => {
    if (!logs) return []
    let result = logs.map(log => {
      let r = {}
      // 如果是会议通话, 需要对members进行列举
      if (+log.isconf === 1) {
        Object.assign(r, log)
        r.key = 'l-conf-' + log.confid
        r.col0 = log.confname // 会议名称
        r.col1 = ''
        r.col2 = log.date
        r.lvl = '0'
        if (log.members) {
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
      } else { // 如果是单路通话 ,取list的第一个值
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

  // 格式化表格数据
  parseDataSource = (contacts, callLogs) => {
    const dataContacts = this.parseContacts(contacts)
    const dataCallLogs = this.parseCallLogs(callLogs).slice(0, 20)
    return [...dataCallLogs, ...dataContacts]
  }

  // 通过联系人通话记录列表添加成员
  handleAddMemFromList = (record) => {
    let { memToCall, selectAcct } = this.state
    if (+selectAcct !== 2) {
      let _memToCall = deepCopy(memToCall)
      if (+record.isconf === 1 && record.children) {
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
  }

  componentDidUpdate (prevProps) {
    if (this.props.callLogs.length !== prevProps.callLogs.length || this.props.contacts.length !== prevProps.contacts.length) {
      const { contacts, callLogs } = this.props
      this.setState({
        dataSource: this.parseDataSource(contacts, callLogs)
      })
    }
  }

  render () {
    const { acctStatus, defaultAcct, IPVTExist } = this.props
    const { selectAcct, memToCall, tagsInputValue, dataSource } = this.state

    if (!acctStatus) return null

    let selectAcctItem = acctStatus.filter(item => +item.acctIndex === +selectAcct)[0] || '0'

    // 可选账号 菜单
    const acctMenu = (
      <Menu className='acct-menu' onClick={(item) => this.handleSelectAcct(item)}>
        {
          acctStatus.map((v, i) => {
            if (!v.activate) return null
            if (v.acctIndex === 1 && +IPVTExist === 0) return null // ipvt 功能未开启时不显示
            return (
              <Menu.Item key={v.acctIndex} className={!v.register ? 'disabled' : ''}>
                <span><em className={`acct-icon acct-${v.acctIndex} ${!v.register ? 'acct-unregister' : ''}`}></em>{v.name}</span>
                <span>{v.num}</span>
                <span>{
                  defaultAcct === v.acctIndex ? $t('c_301') : <Button type='primary' size='small' onClick={e => this.handleSetDefaultAcct(v.acctIndex, e)}>{$t('b_058')}</Button>}</span>
              </Menu.Item>
            )
          })
        }
      </Menu>
    )

    const allInactivated = acctStatus.filter(v => v.activate).length === 0
    // dropdown
    const dropArea = (
      <Dropdown overlay={acctMenu} getPopupContainer={triggerNode => triggerNode.parentElement} trigger={['click']} disabled={allInactivated}>
        <div className={`selected-acct ${+selectAcctItem.register === 0 ? 'unregister' : ''}`}>
          <span><em className={`acct-icon acct-${selectAcct}`}></em>{allInactivated ? $t('c_332') : selectAcctItem.name}</span>
          <span>{allInactivated ? '' : selectAcctItem.num}</span>
          <Icon type='caret-down' />
        </div>
      </Dropdown>
    )

    // 通话输入域
    const InputArea = (
      <div className='dialup-inputs-area'>
        {
          +selectAcct !== 2 ? <div className='tagsinput-wrapper'>
            <TagsInput
              value={memToCall.map(v => v.name)}
              onChange={this.handleChangeMemToCall}
              addKeys={[13]}
              // onlyUnique={true}
              // addOnBlur={true}
              inputProps={{ placeholder: '', maxLength: '40', style: { width: Math.min(tagsInputValue.length * 15, 590) } }}
              inputValue={tagsInputValue}
              onChangeInput={this.handleTagsInput}
              renderTag={this.renderTag}
            />
            {
              memToCall.length > 0 || tagsInputValue.length > 0 ? null : <span className='tagsinput-placeholder'>
                {/* 多个号码可以'Enter'分隔.  ( 如果为空，一键开启IPVT会议 ) */}
                {$t('c_330')}{+selectAcct === 1 ? $t('c_331') : ''}
              </span>
            }
          </div> : <div className='bj-inputs'>
            <Input placeholder={$t('c_337')} onChange={(e) => this.handleBjMember({ id: e.target.value })} /><br />
            <Input placeholder={$t('c_338')} onChange={(e) => this.handleBjMember({ pw: e.target.value })} />
          </div>
        }
      </div>
    )

    return (
      <div className='dialuppage'>
        {/* 账号切换以及呼出 */}
        <div className='dialup-box'>
          <div className='dialup-inputs'>
            {dropArea}
            {InputArea}
          </div>
          {/* 按钮 */}
          <div className='dialup-btns'>
            <span className='video-call-btn' onClick={() => this.handleDialup(1)}><em /></span>
            <span className='audio-call-btn' onClick={() => this.handleDialup(0)}><em /></span>
          </div>
        </div>
        {/* 记录以及联系人 */}
        <div className='dialup-list'>
          <div className='list-title'>{$t('c_329')}</div>
          {
            dataSource.length > 0 && <LogAndContacts dataSource={dataSource} onAdd={(item) => this.handleAddMemFromList(item)} filterTags={tagsInputValue}/>
          }
        </div>
      </div>
    )
  }
}

export default Call
