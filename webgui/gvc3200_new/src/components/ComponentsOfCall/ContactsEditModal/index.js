/**
 * 联系人设置， 添加弹窗 （通话记录， 通讯录中会用到）
 */
import React, { Component } from 'react'
import { Modal, Form, Input, Select, message, Checkbox } from 'antd'
import { connect } from 'react-redux'
import { store } from '@/store'
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
    this.email = props.email && props.email[0] ? props.email : [{ type: '1', address: '' }]
    this.group = props.group || []
    this.name = props.name || { displayname: '', givenname: '', familyname: '' }
    this.note = props.note || ''
    this.phone = props.phone || [{ acct: this.getDefAcct(), number: '', type: '2' }]
    this.rank = props.rank || ''
    this.ringtone = props.ringtone || ''
    this.title = props.title || ''
    this.website = props.website || ''

    this.isAdd = isAdd // 标识是否是添加还是编辑
  }

  getDefAcct = () => {
    let defAcct = store.getState().defaultAcct
    if (+defAcct === 2 || +defAcct === 5) {
      defAcct = 0
    }
    return defAcct
  }
}

@connect(
  state => ({
    defaultAcct: state.defaultAcct.toString(), // 默认账号
    contactsGroups: state.contactsGroups, // 群组
    contacts: state.contacts
  })
)
class ContactsEditModal extends Component {
  static propTypes = {
    editContacts: PropTypes.object, // 上述editContacts 类实例 或 null
    onCancel: PropTypes.func,
    maxContactsCount: PropTypes.number
  }

  state = {
    editContacts: null,
    submiting: false
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
    if (payload.v.length > 60) {
      return message.error($t('m_222'))
    }
    let _editContacts = deepCopy(this.state.editContacts)
    switch (label) {
      case 'address':
      case 'website':
      case 'note':
        _editContacts[label] = payload.v
        break
      case 'displayname':
        _editContacts['name']['displayname'] = payload.v
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

    if (name['displayname'].length === 0) {
      message.error($t('m_102'))
      return false
    }
    if (contacts.some(contact => contact['name']['displayname'] === name['displayname']) && isAdd) {
      Modal.confirm({
        title: $t('m_103'),
        onOk: () => {
          this.setContact(editContacts)
        }
      })
    } else {
      this.setContact(editContacts)
    }
  }

  setContact = (editContacts) => {
    const { maxContactsCount, contacts } = this.props
    const { id, name, phone, email, note, website, address, group, isAdd } = editContacts
    //  提交格式。。。。
    const contactInfo = {
      rawcontact: isAdd ? {} : { contactid: id },
      structuredname: { displayname: encodeURIComponent(name['displayname']) },
      groupmembership: group.filter(g => g.id !== '').map(g => ({
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
    this.setState({
      submiting: true
    })
    API.setContact(JSON.stringify(contactInfo)).then(msg => {
      this.setState({
        submiting: false
      })
      if (msg.res === 'success') {
        message.success($t('m_027'))
        this.props.onCancel()
      } else {
        // 后端没有返回是否是联系人满了，只能自己判断下...
        if (maxContactsCount && maxContactsCount <= contacts.length) {
          message.error($t('m_108'))
        } else {
          message.error($t('m_028'))
        }
      }
    })
  }

  render () {
    const { onCancel, contactsGroups } = this.props
    const { editContacts, submiting } = this.state
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
        confirmLoading={submiting}
      >
        <Form
          hideRequiredMark
          className='contacts-form'
        >
          {/* 显示名称 */}
          <Form.Item label={$t('c_218')}>
            <Input
              value={editContacts['name']['displayname']}
              onChange={(e) => this.updateEditContacts('displayname', {
                v: e.target.value
              })}
            />
          </Form.Item>
          {/* 号码 */}
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
                        <Select.Option value='0'>SIP</Select.Option>
                        <Select.Option value='1'>IPVideoTalk</Select.Option>
                        <Select.Option value='8'>H.323</Select.Option>
                        <Select.Option value='-1'>{$t('c_219')}</Select.Option>
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
          {/* 电子邮件 */}
          <Form.Item label={$t('c_220')}>
            <Input
              value={editContacts['email'][0] ? editContacts['email'][0].address : ''}
              onChange={e => this.updateEditContacts('email', {
                v: e.target.value
              })}
            />
          </Form.Item>
          {/* 通信地址 */}
          <Form.Item label={$t('c_221')}>
            <Input
              value={editContacts['address']}
              onChange={e => this.updateEditContacts('address', {
                v: e.target.value
              })}
            />
          </Form.Item>
          {/* 备注 */}
          <Form.Item label={$t('c_222')}>
            <Input
              value={editContacts['note']}
              onChange={e => this.updateEditContacts('note', {
                v: e.target.value
              })}
            />
          </Form.Item>
          {/* 网址 */}
          <Form.Item label={$t('c_223')}>
            <Input
              value={editContacts['website']}
              onChange={e => this.updateEditContacts('website', {
                v: e.target.value
              })}
            />
          </Form.Item>
          {/*  群组 */}
          <Form.Item label={$t('c_215')} style={{ display: contactsGroups.length === 0 ? 'none' : 'block' }}>
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
