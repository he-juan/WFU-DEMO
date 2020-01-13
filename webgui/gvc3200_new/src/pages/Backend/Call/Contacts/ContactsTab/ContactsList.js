import React, { Component } from 'react'
import { Table, Popover } from 'antd'
import PropTypes from 'prop-types'
import { getRecordIcon, parseAcct } from '@/utils/tools'
import API from '@/api'
import { $t } from '@/Intl'

class ContactsList extends Component {
  static propTypes = {
    dataSouce: PropTypes.array,
    selectedContacts: PropTypes.array,
    onSelectRow: PropTypes.func,
    onEditContacts: PropTypes.func
  }

  handleCall = (phoneItem) => {
    // 是否需要做最大线路数限制判断？ 还是依靠后端返回
    const { acct, number: num } = phoneItem

    API.makeCall([{
      acct,
      num,
      isvideo: '1', // 默认视频呼出
      source: '1', // 联系人source取1
      isconf: '1'
    }])
  }

  columns = () => {
    const { onEditContacts } = this.props
    let _this = this
    return [
      {
        key: 'col0',
        width: '30%',
        title: $t('c_213'),
        render (text, record, index) {
          return (
            <div className='contact-list-names'>
              <i className={`icons ${getRecordIcon(record)}`}></i>
              <span>{record.name.displayname}</span>
            </div>
          )
        }
      },
      {
        key: 'col1',
        width: '25%',
        title: $t('c_214'),
        render (text, record, index) {
          return (
            <div className='contact-list-numbers'>
              {
                record.phone.map(i => i.number).join(',')
              }
            </div>
          )
        }
      },
      {
        key: 'col2',
        width: '25%',
        title: $t('c_215'),
        render (text, record, index) {
          return (
            <div className='contact-list-groups'>
              {
                record.group.map(g => g.name).join(',')
              }
            </div>
          )
        }
      },
      {
        key: 'col4',
        render (text, record, index) {
          return (
            <div className='contact-list-btns'>
              {
                record.phone.length > 1
                  ? (
                    <Popover
                      placement='topLeft'
                      getPopupContainer ={e => e}
                      trigger='click'
                      content={
                        <div className='contacts-call-popover'>
                          {
                            record.phone.map((item, i) => (
                              <p key={i} >
                                <span>
                                  {item.number}
                                  <strong>({parseAcct(item.acct)})</strong>
                                </span>
                                <i className='icons icon-call-btn' onClick={() => _this.handleCall(item)} />
                              </p>
                            ))
                          }
                        </div>
                      }>
                      <i className='icons icon-call-btn' title={$t('b_043')} />
                    </Popover>
                  )
                  : <i className='icons icon-call-btn' onClick={() => _this.handleCall(record.phone[0])} title={$t('b_043')}/>
              }
              <i className='icons icon-edit-contacts' onClick={() => onEditContacts(record)} title={$t('b_018')}/>
            </div>
          )
        }
      }
    ]
  }

  render () {
    const { dataSource, selectedContacts, onSelectRow } = this.props
    return (
      <Table
        className='contacts-list'
        columns={this.columns()}
        dataSource={dataSource}
        pagination={false}
        rowSelection={{
          columnWidth: 43,
          selectedRowKeys: selectedContacts.map(contacts => contacts.key),
          onChange: (keys, items) => {
            onSelectRow(items)
          }
        }}
      />
    )
  }
}

export default ContactsList
