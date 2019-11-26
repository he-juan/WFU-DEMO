import React, { Component } from 'react'
import { Button, Pagination, Modal, message, Dropdown, Menu, Input, Icon } from 'antd'
import NoData from '@/components/NoData'
import ContactsEditModal, { EditContacts } from '@/components/ComponentsOfCall/ContactsEditModal'
import ContactsList from './ContactsList'
import ImportModal from './ImportModal'
import ExportModal from './ExportModal'
import DownloadModal from './DownloadModal'
import { connect } from 'react-redux'
import { getContactsAndGroups, getCallLogs } from '@/store/actions'
import API from '@/api'
import './ContactsTab.less'
import { debounceReactEvent, deepCopy } from '@/utils/tools'
import { $t } from '@/Intl'

@connect(
  state => ({
    contacts: state.contacts
  }),
  dispatch => ({
    getContactsAndGroups: () => dispatch(getContactsAndGroups()),
    getCallLogs: () => dispatch(getCallLogs())
  })
)
class ContactTab extends Component {
  state = {
    filterKey: '', // 搜索过滤的key
    filteredContacts: [], // 过滤后的联系人列表
    curPageData: [], // 当页联系人解析后的数据
    curPage: 1, // 当前页
    pageNum: 10, // 当前每页显示数量
    selectedContacts: [], // 选中的联系人
    contactsEditing: null, // 当前被编辑（或添加）的联系人
    visibleModal: null, // 当前显示的弹窗 可选项： "import", "export", "download"
    maxContactsCount: 2000 // 最大联系人数量
  }
  componentDidMount () {
    this.updateFilteredContacts()
    this.updateCurPageData()
    API.getPvalues(['P1688']).then(data => {
      this.setState({
        maxContactsCount: parseInt(data.P1688)
      })
    })
  }

  componentDidUpdate (preProps, preState) {
    // 当过滤后通话记录源数据， 页码， 每页显示数修改后， 更新当前页的记录数据
    if (preState.filteredContacts !== this.state.filteredContacts || preState.curPage !== this.state.curPage || preState.pageNum !== this.state.pageNum) {
      this.updateCurPageData()
    }
    // 更新 filteredContacts
    if (preProps.contacts !== this.props.contacts || preState.filterKey !== this.state.filterKey) {
      this.updateFilteredContacts()
    }
    // 当删除完最后一页时， 页码向前移动一页， 否则会出现空页面的问题
    if (preState.curPageData.length > 0 && this.state.curPageData.length === 0) {
      this.setState({
        curPage: Math.max(1, this.state.curPage - 1)
      })
    }
  }
  // 搜索输入的关键词进行过滤
  updateFilteredContacts = () => {
    const { contacts } = this.props
    const { filterKey } = this.state
    let filteredContacts
    if (filterKey.length) {
      filteredContacts = deepCopy(contacts.filter(contact => contact.name.displayname.toLowerCase().indexOf(filterKey.toLowerCase()) > -1))
    } else {
      filteredContacts = deepCopy(contacts)
    }
    this.setState({
      filteredContacts
    })
  }
  // 当过滤后通话记录源数据， 页码， 每页显示数修改后， 更新当前页的记录数据
  updateCurPageData = () => {
    const { curPage, pageNum, filteredContacts } = this.state
    const curPageContacts = filteredContacts.slice((curPage - 1) * pageNum, curPage * pageNum)
    const result = curPageContacts.map(contact => {
      contact.key = contact.id
      return contact
    })
    this.setState({
      curPageData: result
    })
  }
  // 跳转分页
  handlePageChange = (v) => {
    this.setState({
      curPage: v,
      selectedContacts: []
    })
  }
  // 调整每页显示数
  handlePageNumChange = (cur, size) => {
    this.setState({
      pageNum: size
    })
  }
  // 选中行或取消选中行
  handleSelectRow = (items) => {
    this.setState({
      selectedContacts: items
    })
  }
  // 删除选中的联系人
  handleDeleteContact = () => {
    const { selectedContacts } = this.state
    Modal.confirm({
      title: $t('m_097'),
      onOk: () => {
        let contactids = selectedContacts.map(contact => contact.id).join(',')
        API.removeContact(contactids).then(m => {
          if (m.res === 'success') {
            message.success($t('m_013'))
            this.setState({
              selectedContacts: []
            })
            this.updateContactsData()
          } else {
            message.success($t('m_014'))
          }
        })
      }
    })
  }
  // 清空联系人
  handleClearContacts = () => {
    Modal.confirm({
      title: $t('m_098'),
      onOk: () => {
        API.removeContact('').then(m => {
          if (m.res === 'success') {
            message.success($t('m_099'))
            this.setState({
              selectedContacts: []
            })
            this.updateContactsData()
          } else {
            message.success($t('m_0100'))
          }
        })
      }
    })
  }

  // 编辑联系人
  handleEditContacts = (contact) => {
    this.setState({
      contactsEditing: new EditContacts(contact, false)
    })
  }
  // {$t('b_038')}联系人
  handleAddContacts = () => {
    this.setState({
      contactsEditing: new EditContacts({}, true)
    })
  }
  // 导入，清空， 删除后更新联系人列表， 消息记录， 群组数据
  updateContactsData = () => {
    const { getContactsAndGroups, getCallLogs } = this.props
    setTimeout(() => {
      getContactsAndGroups()
      getCallLogs()
    }, 200)
  }
  // 切换显示导入联系人弹窗
  toggleModal = (flag) => {
    this.setState({
      visibleModal: flag
    })
  }
  handleFilterChange = debounceReactEvent((e) => {
    this.setState({
      filterKey: e.target.value,
      curPage: 1,
      selectedContacts: []
    })
  }, 400)
  render () {
    const { maxContactsCount, contacts } = this.props
    const { filteredContacts, curPageData, curPage, pageNum, selectedContacts, contactsEditing, visibleModal, filterKey } = this.state
    return (
      <div className='contacts-tab-page'>
        <div className='contacts-tab-head'>
          <Button type='primary' icon='delete' disabled={selectedContacts.length === 0} onClick={this.handleDeleteContact}>{$t('b_003')}</Button>
          <Button type='primary' icon='delete' disabled={contacts.length === 0} onClick={this.handleClearContacts}>{$t('b_037')}</Button>
          <Button type='primary' onClick={this.handleAddContacts}>{$t('b_038')}</Button>
          <Dropdown
            overlayClassName='contacts-more'
            placement='bottomCenter'
            overlay={
              <Menu>
                <Menu.Item onClick={() => this.toggleModal('import')}>{$t('b_039')}</Menu.Item>
                <Menu.Item onClick={() => this.toggleModal('export')} disabled={contacts.length === 0}>{$t('b_040')}</Menu.Item>
                <Menu.Item onClick={() => this.toggleModal('download')}>{$t('b_041')}</Menu.Item>
              </Menu>
            }>
            <Button type='primary'>{$t('b_042')}</Button>
          </Dropdown>
          <Input
            onChange={this.handleFilterChange}
            prefix={<Icon type='search'/>}
            placeholder={$t('c_209')}
            className='contacts-search-input'
          />
        </div>
        {
          (filteredContacts.length > 0)
            ? (
              <>
                <div className='contacts-tab-list'>
                  <ContactsList
                    dataSource={curPageData}
                    selectedContacts={selectedContacts}
                    onSelectRow={this.handleSelectRow}
                    onEditContacts={this.handleEditContacts}
                  />
                </div>
                <div className='contacts-pagination'>
                  <Pagination
                    className='bak-pagination'
                    showSizeChanger
                    current={curPage}
                    pageSize={pageNum}
                    total={filteredContacts.length}
                    onChange={this.handlePageChange}
                    onShowSizeChange={this.handlePageNumChange}
                  />
                </div>
              </>
            )
            : <NoData tip={
              filterKey && contacts.length
                ? $t('c_210')
                : (
                  <span className='contacts-empty-tips'>
                    {$t('c_211')}<em onClick={this.handleAddContacts}>"{$t('b_038')}"</em>，
                    <em onClick={() => this.toggleModal('import')}>"{$t('b_039')}"</em> {$t('c_212')}
                    <em onClick={() => this.toggleModal('download')}>"{$t('b_041')}"</em>
                  </span>
                )
            }/>
        }
        {/* 联系人编辑弹窗 */}
        <ContactsEditModal
          editContacts={contactsEditing}
          onCancel={() => this.setState({ contactsEditing: null })}
        />
        {/* 导入联系人弹窗 */}
        <ImportModal
          visible={visibleModal === 'import'}
          onCancel={() => this.toggleModal(null)}
          contactsLength={contacts.length}
          onImport={this.updateContactsData}
          maxContactsCount={maxContactsCount}
        />
        {/* 导出弹窗 */}
        <ExportModal
          visible={visibleModal === 'export'}
          onCancel={() => this.toggleModal(null)}
          contactsLength={contacts.length}
        />
        {/* 下载弹窗 */}
        <DownloadModal
          visible={visibleModal === 'download'}
          onCancel={() => this.toggleModal(null)}
          contactsLength={contacts.length}
          maxContactsCount={maxContactsCount}
          onDownload={this.updateContactsData}
        />
      </div>
    )
  }
}

export default ContactTab
