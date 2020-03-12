import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Button, Checkbox } from 'antd'
import { $t } from '@/Intl'
import { momentFormat } from '@/utils/tools'
import NoData from '../../NoData'

class GroupMembersModal extends Component {
  static propTypes = {
    exist: PropTypes.object.isRequired, // 已存在的
    groupMembers: PropTypes.array.isRequired,
    pushMemToCall: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired, // 添加事件
    onCancel: PropTypes.func.isRequired // 取消事件
  }

  static defaultProps = {
    exist: {},
    groupMembers: []
  }

  constructor (props) {
    super(props)

    this.state = {
      disabled: false,
      useMembers: [], // 重新得到一个 checked 和 disabled 的members
      checkMembers: [] // 实际选择的members，不包含在他设置预约的弹窗的members
    }
  }

  componentDidMount () {
    const { exist: { members, linesInfo, memToCall }, groupMembers, pushMemToCall } = this.props
    // 打开的群组里面有成员
    if (groupMembers.length > 0) {
      const temp = pushMemToCall([], groupMembers[0]) // 先插入一个试试，用来判断是否已经满了
      const _temp = this.limitMaxMembers(temp, 'magic') // 判断是够超出限制, 初始化的时候 limitMaxMembers，magic 说明是需要特殊处理
      const arr = linesInfo.concat(members, memToCall) // 这样的一个合并处理，里面会有重复数据（没去重）
      const numbers = arr.map(item => {
        return item.number || item.num
      })
      // 逻辑有些混乱 需要二次整理
      this.setState({
        disabled: _temp.length < temp.length, // 满足已添加条件符合，则disabled
        useMembers: groupMembers.map(item => {
          let obj = {
            checked: false,
            disabled: false
          }
          // 去标记已经存在的member
          if (numbers.includes(item.number)) {
            obj = {
              checked: true,
              disabled: true
            }
          }
          return Object.assign({}, item, obj)
        })
      })
    }
  }

  limitMaxMembers = (mems, flag) => {
    if (mems.length === 0) return mems
    let _mems = JSON.parse(JSON.stringify(mems))
    const { exist: { members, maxLineCount, linesInfo, memToCall } } = this.props
    const count = flag === 'magic' ? maxLineCount : maxLineCount - 1 // 特殊处理后的count判断条件

    let lastMem = _mems.pop() // 最后一个是待添加的, 暂移除
    let temp = _mems.concat(linesInfo, members, memToCall) // 并且与已在通话线路中的成员合并(和已添加的成员合并)
    let nonIPVTlen = temp.filter(v => +v.acct !== 1).length // 非IPVT线路数量
    let IPVTlen = temp.length - nonIPVTlen // IPVT线路数量

    // 存在ipvt线路且ipvt线路成员不超过100
    let curLinesLen = IPVTlen > 0 ? nonIPVTlen + 1 : nonIPVTlen // 线路总数量, IPVT线路合并为1路
    // 如果当前输入框内成员数加已有线路数 大于限制 且 当前待添加的不是IPVT
    if (curLinesLen >= count) {
      if (IPVTlen === 0) {
        // 成员数量已达上限
      } else if (IPVTlen > 0 && +lastMem.acct !== 1) {
        // 通话线路已达上限，当前只能添加ipvt联系人
      } else if (IPVTlen > 0 && +lastMem.acct === 1) {
        _mems.push(lastMem)
      }
    } else {
      _mems.push(lastMem)
    }

    return _mems
  }

  handleCancel = () => {
    const { onCancel } = this.props
    this.setState({
      disabled: false,
      useMembers: [],
      checkMembers: []
    })
    onCancel()
  }

  handleAdd = () => {
    const { onAdd } = this.props
    onAdd(this.state.checkMembers)
    this.handleCancel()
  }

  handleCheckChange = (e, index) => {
    let { disabled, useMembers, checkMembers } = this.state
    useMembers[index].checked = e.target.checked

    if (e.target.checked) {
      const { pushMemToCall } = this.props
      const mems = pushMemToCall(checkMembers, useMembers[index]) // 先插入
      const _mems = this.limitMaxMembers(mems) // 判断是够超出限制
      // 对比长度
      disabled = _mems.length < mems.length
    } else {
      if (disabled) disabled = false
    }

    this.setState({
      disabled,
      useMembers,
      checkMembers: useMembers.filter(item => item.checked && !item.disabled)
    })
  }

  render () {
    const { disabled, useMembers, checkMembers } = this.state

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
        width: '25%',
        render: (text, record, index) => {
          if (record.lvl) {
            return momentFormat(text, { showtime: true, showtoday: false }).strRes
          }
          return ''
        }
      },
      {
        key: 'col3',
        dataIndex: 'col3',
        width: '15%',
        render: (text, record, index) => {
          return (
            <div>
              <Checkbox
                disabled={record.disabled || (disabled && !record.checked && record.acct !== '1')}
                checked={record.checked}
                onChange={(e) => this.handleCheckChange(e, index)}
              />
            </div>
          )
        }
      }
    ]

    return (
      <Modal
        width={800}
        className='invitemember-modal'
        visible={true}
        onCancel={this.handleCancel}
        title={$t('b_056')}
        centered
        footer={
          <div>
            <Button onClick={this.handleCancel}>{$t('b_005')}</Button>
            <Button type='primary' disabled={useMembers.length === 0 || checkMembers.length === 0} onClick={this.handleAdd}>{$t('b_056')}</Button>
          </div>
        }
      >
        <div style={{ height: 460, overflow: 'auto' }}>
          {
            useMembers.length > 0 ? <Table
              columns={columns}
              pagination={false}
              dataSource={useMembers}
              showHeader={false}
            /> : <NoData/>
          }
        </div>
      </Modal>
    )
  }
}

export default GroupMembersModal
