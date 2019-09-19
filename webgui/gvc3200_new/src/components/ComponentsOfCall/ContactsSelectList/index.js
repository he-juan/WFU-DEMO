/**
 * 联系人模糊搜索以及选择列表 有两种模式（checkbox选择 和 列表点击） 分别在（通话记录， 以及 群组选择中会用到）
 */
import React, { Component } from 'react'
import { Checkbox, Input, Icon } from 'antd'
import { deepCopy, debounceReactEvent } from '@/utils/tools'
import NoData from '@/components/NoData'
import ScrollPage from '@/components/ScrollPage'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './ContactsSelectList.less'
import { $t } from '@/Intl'

@connect(
  state => ({
    contacts: state.contacts
  })
)
class ContactsSelectList extends Component {
  static propTypes = {
    onListClick: PropTypes.func,
    onListChecked: PropTypes.func, // 选中handler 如果声明该函数， 列表为checkbox 列表
    checkedContacts: PropTypes.array, // 选中的contacts列表 checkbox 模式必传
    className: PropTypes.string
  }
  static defaultProps = {
    className: '',
    checkedContacts: []
  }

  state = {
    filter: '',
    curPage: 1 // 滚动分页

  }

  handleUpdateFilter = debounceReactEvent((e) => {
    this.setState({
      filter: e.target.value
    })
  }, 300)
  // 选中或移除
  handleChecked = (contact) => {
    const { checkedContacts, onListChecked } = this.props
    let _checkedContacts = deepCopy(checkedContacts)
    let checkedIndex = _checkedContacts.findIndex(c => c.id === contact.id)
    if (checkedIndex > -1) {
      _checkedContacts.splice(checkedIndex, 1)
      onListChecked(_checkedContacts)
    } else {
      _checkedContacts.push(contact)
      onListChecked(_checkedContacts)
    }
  }
  // 全选
  handleCheckAll = (e) => {
    const { contacts, onListChecked } = this.props
    let checked = e.target.checked
    onListChecked(checked ? contacts : [])
  }
  // 滚动加载
  updateContactsPage = () => {
    const { curPage } = this.state
    this.setState({
      curPage: curPage + 1
    })
  }
  render () {
    let { contacts, className, onListClick, onListChecked, checkedContacts } = this.props
    let { filter, curPage } = this.state

    let filteredContacts = contacts.filter(contact => contact.name.displayname.toLowerCase().indexOf(filter.toLowerCase()) !== -1).slice(0, curPage * 50)

    return (
      <div className={`contacts-select-list ${className}`}>
        <Input
          className='contacts-list-filter'
          onChange={this.handleUpdateFilter}
          suffix={<Icon type='search' />}
          placeholder={$t('c_209')}
        />
        {
          onListChecked ? (
            <p className='contacts-check-all'>
              <Checkbox checked={checkedContacts.length === contacts.length} onChange={this.handleCheckAll}>{$t('c_055')}</Checkbox>
            </p>
          ) : null
        }
        <ScrollPage
          wrapperHeight={300}
          noMore={(curPage - 1) * 50 > contacts.length}
          onLoad={this.updateContactsPage}
        >
          {
            filteredContacts.length === 0 ? <NoData />
              : onListChecked
                ? (
                  <ul className='contacts-list-ul'>
                    {
                      filteredContacts.map(contact => (
                        <li key={contact.id}>
                          <Checkbox
                            checked={checkedContacts.some(c => c.id === contact.id)}
                            onChange={() => this.handleChecked(contact)}
                            className='contacts-list-checkitem'
                          >
                            {contact.name.displayname}
                          </Checkbox>
                          <em>{contact.phone[0] ? contact.phone[0].number : ''}</em>
                        </li>
                      ))
                    }
                  </ul>
                )
                : (
                  <ul className='contacts-list-ul' >
                    {
                      filteredContacts.map(contact => (
                        <li key={contact.id} onClick={() => { onListClick && onListClick(contact) }} style={{ cursor: 'pointer' }}>
                          <i className='icons icon-contacts'/> {contact.name.displayname}
                        </li>
                      ))
                    }
                  </ul>
                )
          }
        </ScrollPage>
      </div>
    )
  }
}

export default ContactsSelectList
