import React, { Component } from 'react'
import { Table, message } from 'antd'
import PropTypes from 'prop-types'
import ConfCallModal from '@/components/ComponentsOfCall/ConfCallModal'
import { deepCopy } from '@/utils/tools'
import { $t } from '@/Intl'

class GroupList extends Component {
  static propTypes = {
    isAutoVideo: PropTypes.string,
    dataSource: PropTypes.array,
    onSelectRow: PropTypes.func,
    selectedGroups: PropTypes.array,
    onEditGroup: PropTypes.func
  }

  state = {
    contactsToCall: []
  }

  handleCall = (group) => {
    if (group.contacts.length === 0) {
      message.error($t('m_121'))
    }
    let _contacts = deepCopy(group.contacts)
    // 一个成员有多个号码需要拆分出来
    let contactsToCall = []
    _contacts.forEach(contact => {
      const { id, name, phone } = contact
      phone.forEach(p => {
        const { acct, number } = p
        if (number === '') return false
        contactsToCall.push({
          id: id,
          name: name.displayname,
          acct: acct,
          number: number,
          source: '2',
          key: `${id}-${acct}-${number}`
        })
      })
    })
    this.setState({
      contactsToCall
    })
  }

  cancelCall = () => {
    this.setState({
      contactsToCall: []
    })
  }

  columns = () => {
    const { onEditGroup } = this.props
    let _this = this
    return [
      {
        key: 'col0',
        width: '30%',
        title: $t('c_215'),
        render (text, record, index) {
          return (
            <div className='group-list-names'>
              <i className=''/>
              <span>{record.name}</span>
            </div>
          )
        }
      },
      {
        key: 'col1',
        width: '30%',
        title: $t('c_233'),
        render (text, record, index) {
          return (
            <div className='group-list-numbers'>
              {record.num + $t(+record.num < 2 ? 'c_234' : 'c_235')}
            </div>
          )
        }
      },
      {
        key: 'col2',
        title: $t('c_005'),
        render (text, record, index) {
          return (
            <div className='group-list-btns'>
              <i title={$t('b_043')} className='icons icon-call-btn' onClick={() => { _this.handleCall(record) }}/>
              <i title={$t('b_018')} className='icons icon-edit-contacts' onClick={() => onEditGroup(record)}/>
              {/* <i className='icons icon-delete' onClick={() => {}}/> */}
            </div>
          )
        }
      }
    ]
  }

  render () {
    const { isAutoVideo, dataSource, onSelectRow, selectedGroups } = this.props
    const { contactsToCall } = this.state
    return (
      <>
        <Table
          className='group-tab-table'
          dataSource={dataSource}
          pagination={false}
          columns={this.columns()}
          rowSelection={{
            columnWidth: 43,
            selectedRowKeys: selectedGroups.map(group => group.key),
            onChange: (keys, items) => {
              onSelectRow(items)
            }
          }}
        />
        <ConfCallModal isAutoVideo={isAutoVideo} confMembers={contactsToCall} onCancel={this.cancelCall}/>
      </>
    )
  }
}

export default GroupList
