import React, { Component, createRef } from 'react'
import { Modal, Input, Form, message } from 'antd'
import ContactsSelectList from '@/components/ComponentsOfCall/ContactsSelectList'
import ScrollPage from '@/components/ScrollPage'
import PropTypes from 'prop-types'
import { deepCopy } from '@/utils/tools'
import API from '@/api'
import { $t } from '@/Intl'

class GroupEditModal extends Component {
  static propTypes = {
    groupEditing: PropTypes.object,
    onCancel: PropTypes.func,
    onEditComplete: PropTypes.func, // 编辑完成后通知更新数据
    contactsGroups: PropTypes.array // 所有已有的群组列表
  }
  state = {
    checkedContacts: [],
    submitting: false,
    checkedCurPage: 1 // 选中的成员当前页
  }
  groupNameRef = createRef()
  handleCheckContacts = (contacts) => {
    this.setState({
      checkedContacts: contacts
    })
  }
  componentDidUpdate = (preProps, preState) => {
    // 点击群组编辑按钮打开modal时
    if (preProps.groupEditing !== this.props.groupEditing && this.props.groupEditing !== null) {
      // 待编辑的群组中的联系人即已经为选中状态
      const { contacts } = this.props.groupEditing
      this.setState({
        checkedContacts: contacts || []
      })
    }
  }
  // 取消勾选
  unCheckContact = (contact) => {
    const _checkedContacts = deepCopy(this.state.checkedContacts)
    let unCheckIndex = _checkedContacts.findIndex(item => item.id === contact.id)
    _checkedContacts.splice(unCheckIndex, 1)
    this.setState({
      checkedContacts: _checkedContacts
    })
  }
  // 提交
  handleSubmitGroup = async () => {
    const { checkedContacts } = this.state
    const { groupEditing, onCancel, onEditComplete, contactsGroups } = this.props
    let groupName = this.groupNameRef.current.state.value
    let groupId = groupEditing.id
    let contactids = checkedContacts.map(contact => contact.id).join(':::')
    if (groupName.length === 0) {
      message.error($t('m_122'))
      return false
    }
    // 如果  群组名与其他群组重复时，提示重复
    if (contactsGroups.findIndex(group => { return group.name === groupName && group.id !== groupId }) > -1) {
      message.error($t('m_123'))
      return false
    }
    this.setState({ submitting: true })
    let data = await API.setGroup(`${groupId}:::${groupName}`)
    if (data.res !== 'success') {
      message.error($t('m_002'))
      this.setState({ submitting: false })
      return false
    }
    groupId = groupId === '' ? data.msg : groupId // 如果groupId为空表明为添加群组， 则该群组id为setGroup 返回的msg
    let data2 = await API.updateGroupMemberShip({ id: groupId, contactids: contactids })
    if (data2.res === 'success') {
      message.success($t('m_001'))
      onEditComplete() // 通知父组件更新群组列表
      onCancel()
    } else {
      message.error($t('m_002'))
    }
    this.setState({ submitting: false })
  }

  updateCheckedPage = () => {
    const { checkedCurPage } = this.state
    this.setState({
      checkedCurPage: checkedCurPage + 1
    })
  }
  render () {
    const { groupEditing, onCancel } = this.props
    const { checkedContacts, submitting, checkedCurPage } = this.state
    if (!groupEditing) return false
    return (
      <Modal
        visible={!!groupEditing}
        className='group-edit-modal'
        onCancel={onCancel}
        width={800}
        title={$t(groupEditing.id === '' ? 'c_236' : 'c_237')}
        destroyOnClose
        onOk={this.handleSubmitGroup}
        confirmLoading={submitting}
      >
        <Form.Item label={$t('c_238')} className='group-name-edit' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
          <Input placeholder={$t('c_238')} defaultValue={groupEditing.name} ref={this.groupNameRef}/>
        </Form.Item>
        <div className='group-member-edit'>
          <div className='all-contacts'>
            <h4>{$t('c_239')}</h4>
            <div className='list-wrapper'>
              <ContactsSelectList onListChecked={this.handleCheckContacts} checkedContacts={checkedContacts} />
            </div>
          </div>
          <div className='selected-contacts'>
            <h4>{$t('c_240')}</h4>
            <ScrollPage
              onLoad={this.updateCheckedPage}
              wrapperHeight={398}
              noMore={(checkedCurPage - 1) * 50 > checkedContacts.length}
            >
              {
                checkedContacts.length
                  ? (
                    <ul className='list-wrapper '>
                      {
                        checkedContacts.slice(0, checkedCurPage * 50).map(contact => {
                          return (
                            <li key={contact.id}>
                              <span>{contact.name.displayname}</span>
                              <span>
                                {contact.phone[0] ? contact.phone[0].number : ''}
                                <i className='icons icon-delete-2' onClick={() => this.unCheckContact(contact)}/>
                              </span>
                            </li>
                          )
                        })
                      }
                    </ul>
                  )
                  : (
                    <ul className='list-wrapper '>
                      <p className='empty-tips'>{$t('c_241')}</p>
                    </ul>
                  )

              }
            </ScrollPage>
          </div>
        </div>
      </Modal>
    )
  }
}

export default GroupEditModal
