/**
 * 联系人设置， 添加弹窗 （通话记录， 通讯录中会用到）
 */
import React, { Component } from 'react'
import { Modal, Form, Input, Select, message, Checkbox } from 'antd'
import { connect } from 'react-redux'
import { store } from '@/store'
import { getCallLogs, getContactsAndGroups } from '@/store/actions'
import { deepCopy } from '@/utils/tools'
import PropTypes from 'prop-types'
import './ContactsEditModal.less'
import API from '@/api'
import { $t } from '@/Intl'

/**
 * editContacts 类
 */

export class EditContacts {
  constructor (props = {}, isAdd = false) {
    this.id = props.id || ''
    this.isfavourite = props.isfavourite || ''
    this.address = props.address || ''
    this.company = props.company || ''
    this.department = props.department || ''
    this.email = props.email || [{ type: '1', address: '' }]
    this.group = props.group || []
    this.name = props.name || { displayname: '', givenname: '', familyname: '' }
    this.note = props.note || ''
    this.phone = props.phone || [{ acct: store.getState().defaultAcct, number: '', type: '2' }]
    this.rank = props.rank || ''
    this.ringtone = props.ringtone || ''
    this.title = props.title || ''
    this.website = props.website || ''

    this.isAdd = isAdd // 标识是否是添加还是编辑
  }
}

@connect(
  state => ({
    defaultAcct: state.defaultAcct.toString(), // 默认账号
    contactsGroups: state.contactsGroups, // 群组
    contacts: state.contacts
  }),
  dispatch => ({
    getCallLogs: () => dispatch(getCallLogs()),
    getContactsAndGroups: () => dispatch(getContactsAndGroups())
  })
)
class ContactsEditModal extends Component {
  static propTypes = {
    editContacts: PropTypes.object, // 上述editContacts 类实例 或 null
    onCancel: PropTypes.func
  }
  state = {
    editContacts: null
  }
  componentDidUpdate (preProps) {
    if (preProps.editContacts !== this.props.editContacts) {
      this.setState({
        editContacts: deepCopy(this.props.editContacts)
      })
    }
  }
  // 删除一个phone
  handleDelPhone = (i) => {
    let _editContacts = deepCopy(this.state.editContacts)
    if (_editContacts.phone.length <= 1) return false
    _editContacts.phone.splice(i, 1)
    this.setState({
      editContacts: _editContacts
    })
  }
  // 添加一个phone
  handleAddPhone = () => {
    const { defaultAcct } = this.props
    let _editContacts = deepCopy(this.state.editContacts)
    if (_editContacts.phone.filter(item => item.number.length === 0).length) {
      message.error($t('m_101'))
      return false
    }
    _editContacts.phone.push({
      acct: defaultAcct || '-1', number: '', type: '2'
    })
    this.setState({
      editContacts: _editContacts
    })
  }
  /** 更新联系人信息的state */
  updateEditContacts = (label, payload) => {
    let _editContacts = deepCopy(this.state.editContacts)
    switch (label) {
      case 'address':
      case 'website':
      case 'note':
        _editContacts[label] = payload.v
        break
      case 'displayname':
        _editContacts['name']['displayname'] = payload.v.trim()
        break
      case 'phoneAcct':
        _editContacts.phone[payload.index].acct = payload.v
        break
      case 'phoneNumber':
        _editContacts.phone[payload.index].number = payload.v
        break
      case 'email':
        _editContacts.email[0].address = payload.v
        break
      case 'group':
        if (payload.checked) {
          _editContacts.group.push(payload.v)
        } else {
          let i = _editContacts.group.findIndex(item => item.id === payload.v.id)
          _editContacts.group.splice(i, 1)
        }
        break
      default:
    }
    this.setState({
      editContacts: _editContacts
    })
  }
  handleSubmitContacts = () => {
    const { contacts } = this.props
    const { editContacts } = this.state
    const { name, isAdd } = editContacts
    const _this = this
    if (name['displayname'].length === 0) {
      message.error($t('m_102'))
      return false
    }
    if (contacts.some(contact => contact['name']['displayname'] === name['displayname']) && isAdd) {
      Modal.confirm({
        title: $t('m_103'),
        onOk: () => {
          _this.setContact(editContacts)
        }
      })
    } else {
      this.setContact(editContacts)
    }
  }

  setContact = (editContacts) => {
    const { getCallLogs, getContactsAndGroups } = this.props
    const { id, name, phone, email, note, website, address, group, isAdd } = editContacts
    //  提交格式。。。。
    const contactInfo = {
      rawcontact: isAdd ? {} : { contactid: id },
      structuredname: { displayname: name['displayname'] },
      groupmembership: group.map(g => ({
        groupid: g.id
      })),
      phone: phone.filter(i => i.number.trim() !== '').map(item => ({
        type: item.type,
        account: item.acct,
        number: item.number
      })),
      email: email,
      note: [{ note: note }],
      website: [{ type: '7', url: website }], // 这个字段传参有问题
      structuredpostal: [{ fomatted: address }]
    }
    API.setContact(JSON.stringify(contactInfo)).then(msg => {
      if (msg.res === 'success') {
        message.success($t('m_027'))
        this.props.onCancel()
        setTimeout(() => {
          getCallLogs()
          getContactsAndGroups()
        }, 5000) // 更新数据， 目前本地生成数据太慢， 暂时设成5秒， 到时看情况改
      } else {
        message.success($t('m_028'))
      }
    })
  }

  render () {
    const { onCancel, contactsGroups } = this.props
    const { editContacts } = this.state
    // console.log(editContacts)
    if (!editContacts) return null
    const { isAdd } = editContacts
    return (
      <Modal
        className='edit-contacts-modal'
        visible={true}
        onCancel={onCancel}
        width={900}
        onOk={this.handleSubmitContacts}
        title={$t(isAdd ? 'c_216' : 'c_217')}
      >
        <Form
          hideRequiredMark
          className='contacts-form'
        >
          <Form.Item label={$t('c_218')}>
            <Input
              value={editContacts['name']['displayname']}
              onChange={(e) => this.updateEditContacts('displayname', {
                v: e.target.value
              })}
            />
          </Form.Item>
          <Form.Item label={$t('c_214')}>
            {
              editContacts['phone'].map((phoneItem, i) => {
                return (
                  <div className='acct-number-items' key={i}>
                    <Form.Item>
                      <Select
                        value={phoneItem.acct.toString()}
                        onChange={v => this.updateEditContacts('phoneAcct', {
                          v: v,
                          index: i
                        })}
                      >
                        <Select.Option value='-1'>{$t('c_219')}</Select.Option>
                        <Select.Option value='0'>SIP</Select.Option>
                        <Select.Option value='1'>IPVideoTalk</Select.Option>
                        <Select.Option value='8'>H.323</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Input
                        style={{ color: phoneItem.__new__ ? '#3d77ff' : '' }}
                        value={phoneItem.number}
                        onChange={e => this.updateEditContacts('phoneNumber', {
                          v: e.target.value,
                          index: i
                        })}
                      />
                    </Form.Item>
                    <i className={`icons icon-del-number ${editContacts['phone'].length <= 1 ? 'disabled' : ''}`} onClick={() => this.handleDelPhone(i)}></i>
                  </div>
                )
              })
            }

            <div className='acct-number-items'>
              <span className='add-number-tips'>{$t('b_044')}</span>
              <i className='icons icon-add-number' onClick={this.handleAddPhone}></i>
            </div>
          </Form.Item>
          <Form.Item label={$t('c_220')}>
            <Input
              value={editContacts['email'][0] ? editContacts['email'][0].address : ''}
              onChange={e => this.updateEditContacts('email', {
                v: e.target.value
              })}
            />
          </Form.Item>
          <Form.Item label={$t('c_221')}>
            <Input
              value={editContacts['address']}
              onChange={e => this.updateEditContacts('address', {
                v: e.target.value
              })}
            />
          </Form.Item>
          <Form.Item label={$t('c_222')}>
            <Input
              value={editContacts['note']}
              onChange={e => this.updateEditContacts('note', {
                v: e.target.value
              })}
            />
          </Form.Item>
          <Form.Item label={$t('c_223')}>
            <Input
              value={editContacts['website']}
              onChange={e => this.updateEditContacts('website', {
                v: e.target.value
              })}
            />
          </Form.Item>
          <Form.Item label={$t('c_215')}>
            <ul className='contacts-group-ul'>
              {
                contactsGroups.map(group => {
                  return (
                    <li key={group.id}>
                      <Checkbox
                        checked={editContacts['group'].some(item => item.id === group.id)}
                        value={group.id}
                        onChange={e => this.updateEditContacts('group', {
                          v: group,
                          checked: e.target.checked
                        })}
                      >{group.name}</Checkbox>
                    </li>
                  )
                })
              }
            </ul>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default ContactsEditModal
