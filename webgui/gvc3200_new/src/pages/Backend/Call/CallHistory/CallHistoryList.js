/**
 * 通话记录列表
 */
import React, { Component } from 'react'
import { Table, Popover, Modal } from 'antd'
import { getRecordIcon, deepCopy, momentFormat } from '@/utils/tools'
import ScrollArea from 'react-scrollbar'
import moment from 'moment'
import PropTypes from 'prop-types'
import ContactsEditModal, { EditContacts } from '@/components/ComponentsOfCall/ContactsEditModal'
import ContactsSelectList from '@/components/ComponentsOfCall/ContactsSelectList'
import ConfCallModal from '@/components/ComponentsOfCall/ConfCallModal'
import ConfSetModal from '@/components/ComponentsOfCall/ConfSetModal' // 添加或者编辑或预览会议弹窗
import API from '@/api'
import { $t } from '@/Intl'

class CallHistoryList extends Component {
  static propTypes = {
    dataSource: PropTypes.array,
    selectedLogs: PropTypes.array,
    onSelectRow: PropTypes.func
  }

  state = {
    expandedRowKeys: [],
    recordToSave: null, // 需要添加进联系人的记录
    contactToAdd: null, // 需求添加进联系人的记录
    confMembers: [], // 点击会议记录通话时，该会议下的所有成员列表
    currConf: '' // 预约会议弹窗 会议内容
  }

  // 点击保存至联系人
  handleSaveToContacts = (record, e) => {
    e && e.stopPropagation()
    this.setState({
      recordToSave: record,
      contactToAdd: null
    })
  }

  // 点击添加联系人
  handleAddContacts = (record, e) => {
    e && e.stopPropagation()

    const _contactToAdd = !record ? null : new EditContacts({
      phone: [{
        number: record.number,
        type: '2',
        acct: record.acct
      }]
    }, true)

    this.setState({
      recordToSave: null,
      contactToAdd: _contactToAdd
    })
  }

  // 选择联系人后编辑联系人
  handleEditContacts = (contact) => {
    contact = deepCopy(contact)
    const { recordToSave } = this.state
    contact.phone.push({
      number: recordToSave.number,
      type: '2',
      acct: recordToSave.acct,
      __new__: 1 // 标记下是新增的号码
    })
    let _contactToAdd = new EditContacts(contact, false)
    this.setState({
      recordToSave: null,
      contactToAdd: _contactToAdd
    })
  }

  // 点击重新预约
  handleReSchedule = (record, e) => {
    e.stopPropagation()

    let { confname, acct, name, number, members } = record
    let currConf = {}
    confname && (currConf.confname = confname)
    if (members) {
      currConf.memberData = members.map(({ number, name, acct, calltype }) => {
        return { number, name, acct, calltype }
      })
    } else {
      currConf.memberData = [{ acct, name, number }]
    }

    this.setState({ currConf })
  }

  // 点击拨打
  handleCall = (record, e) => {
    e.stopPropagation()
    if (record.isconf === '1') {
      this.setState({
        confMembers: record.child
      })
    } else {
      const { acct, isvideo, number: num, source } = record
      // 是否需要做通话中成员数量最大长度判断？
      // ...
      API.makeCall([{
        acct,
        isvideo,
        num,
        source,
        isconf: 1
      }])
    }
  }

  // 时间差时间戳 转时分秒
  parseDuration = (recordItem) => {
    let { calltype, duration } = recordItem
    if (duration === '0') {
      if (calltype === '3') {
        return <b>{$t('c_308')}</b> // 未接来电
      } else if (calltype === '2') {
        return <b>{$t('c_309')}</b> // 呼叫失败
      } else {
        return '0' + $t('c_312')
      }
    }
    let timestr = ''
    let momentDura = moment.duration(parseInt(duration) * 1000)
    let day = momentDura.get('days')
    let hour = momentDura.get('hours')
    let min = momentDura.get('minutes')
    let sec = momentDura.get('seconds')

    if (day > 0) {
      hour = day * 24 + hour
    }
    if (hour > 0) {
      timestr = `${hour}${$t('c_310')}${min}${$t('c_311')}${sec}${$t('c_312')}`
    } else if (hour === 0 && min > 0) {
      timestr = `${min}${$t('c_311')}${sec}${$t('c_312')}`
    } else {
      timestr = `${sec}${$t('c_312')}`
    }
    return timestr
  }

  setRowClassName = (record, index) => {
    if (record.lvl === '0') {
      return index % 2 === 1 ? 'gray' : ''
    }
    return ''
  }
  // 子行展开项， 只展开一行
  handleExpandedRowsChange = (keys) => {
    this.setState({
      expandedRowKeys: keys.slice(-1)
    })
  }

  // popover content
  contactsPopover = (record) => {
    return (
      <div className='contacts-popover' onClick={(e) => { e.stopPropagation() }}>
        <p onClick={(e) => this.handleSaveToContacts(record, e)}>{$t('c_313') /* 保存至已有联系人 */}</p>
        <p onClick={(e) => this.handleAddContacts(record, e)}>{$t('c_314') /* 添加联系人 */}</p>
      </div>
    )
  }

  // table columns
  columns = () => {
    const _this = this
    return [
      {
        key: 'col0',
        width: '40%',
        className: 'list-col0',
        title: $t('c_213'),
        render (text, record, index) {
          return (
            <div className='log-list-names'>
              <i className={`icons ${getRecordIcon(record)}`}></i>
              <strong>{record.isconf === '1' ? record.confname : record.name}</strong>
            </div>
          )
        }
      },
      // {
      //   key: 'col1',
      //   width: '15%',
      //   className: 'list-col1',
      //   render () {
      //     return ''
      //   }
      // },
      {
        key: 'col2',
        width: '18%',
        className: 'list-col2',
        title: $t('c_315'),
        render (text, record, index) {
          return momentFormat(record.date, { showtime: false, showtoday: false }).strRes
        }
      },
      // {
      //   key: 'col3',
      //   className: 'list-col3'
      // },
      {
        key: 'col4',
        // width: '15%',
        className: 'list-col4',
        title: $t('c_005'),
        render (text, record, index) {
          return (
            <div className='log-list-btns'>
              {
                record.iscontact === '0' && record.isconf !== '1' && record.acct !== '2' // record.acct !== '2' bluejeans 账号应该不能添加至联系人
                  ? (
                    <Popover content={_this.contactsPopover(record)} overlayClassName='contacts-popover-overlay'>
                      <i className='icons icon-add-contacts' onClick={(e) => { e.stopPropagation() }}/>
                    </Popover>
                  )
                  : null
              }
              <i title={$t('c_316')} className='icons icon-schedule' onClick={(e) => _this.handleReSchedule(record, e)}/>
              <i title={$t('c_305')} className='icons icon-call-btn' onClick={(e) => _this.handleCall(record, e)}/>
            </div>
          )
        }
      }
    ]
  }

  // 展开子行， 单路的消息记录显示该记录的历史呼叫记录， 会议显示该记录的成员记录
  expandedRowRender = (record) => {
    const child = record.child
    const _this = this
    return (
      <ScrollArea // 滚动条 导致 icon无法对齐， 暂引入第三方自定义滚动条包，
        speed={0.8}
        className='record-child-area'
        horizontal={false}
        smoothScrolling={true}
      >
        <ul className='record-child-ul'>
          {
            child.map(item => (
              <li className='record-child-li' key={item.key}>
                <div className='record-child-check'></div>
                <div className='record-child-col0'>
                  <i className={`icons ${getRecordIcon(item)}`} />
                  <strong>
                    {item.name}
                  </strong>
                  <em>
                    {item.number}
                  </em>
                </div>
                <div className='record-child-col1'>
                  {item.acctStr}
                </div>
                <div className='record-child-col2'>
                  {momentFormat(item.date, { showtime: true }).strRes}
                </div>
                <div className='record-child-col3'>
                  {this.parseDuration(item)}
                </div>
                <div className='record-child-col4'>
                  <div className='log-list-btns'>
                    {
                      item.iscontact === '0' && item.acct !== '2' && record.isconf === '1'// item.acct !== '2' bluejeans 账号应该不能添加至联系人
                        ? (
                          <Popover content={_this.contactsPopover(item)} overlayClassName='contacts-popover-overlay'>
                            <i className='icons icon-add-contacts' onClick={(e) => { e.stopPropagation() }}/>
                          </Popover>
                        )
                        : null
                    }
                    <i title={$t('c_305')} className='icons icon-call-btn' onClick={(e) => _this.handleCall(record, e)}/>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      </ScrollArea>
    )
  }
  render () {
    const { dataSource, selectedLogs, onSelectRow } = this.props
    const { expandedRowKeys, contactToAdd, recordToSave, confMembers, currConf } = this.state
    return (
      <>
        <Table
          className='call-history-list'
          dataSource={dataSource}
          columns={this.columns()}
          expandedRowRender={this.expandedRowRender}
          expandIconAsCell={false}
          expandRowByClick={true}
          expandIcon={null}
          onExpandedRowsChange={this.handleExpandedRowsChange}
          expandedRowKeys={expandedRowKeys}
          rowClassName={this.setRowClassName}
          pagination={false}
          rowSelection={{
            columnWidth: 63,
            selectedRowKeys: selectedLogs.map(record => record.key),
            onChange: (keys, items) => {
              onSelectRow(items)
            }
          }}
        />
        <Modal
          visible={recordToSave !== null}
          onCancel={() => this.handleSaveToContacts(null)}
          className='contacts-list-modal'
          transitionName=''
          maskTransitionName=''
          title={$t('c_317') /* 选择联系人 */}
        >
          <ContactsSelectList onListClick={(contacts) => this.handleEditContacts(contacts)} />
        </Modal>
        {/* 通用的联系人编辑弹窗 */}
        <ContactsEditModal editContacts={contactToAdd} onCancel={() => this.handleAddContacts(null)}/>
        {/* 会议通话弹窗 */}
        <ConfCallModal confMembers={confMembers} onCancel={() => this.setState({ confMembers: [] })}/>
        {/* 重新预约会议弹窗 */}
        {
          currConf && <ConfSetModal visible={currConf} currConf={currConf} allDisabled={false} onCancel={() => this.setState({ currConf: null })}/>
        }
      </>
    )
  }
}

export default CallHistoryList
