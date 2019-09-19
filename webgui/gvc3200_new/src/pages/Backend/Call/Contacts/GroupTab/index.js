import React, { Component } from 'react'
import { Button, Pagination, Modal, message, Input, Icon } from 'antd'
import NoData from '@/components/NoData'
import GroupList from './GroupList'
import GroupEditModal from './GroupEditModal'
import { connect } from 'react-redux'
import { getContactsAndGroups } from '@/store/actions'
import API from '@/api'
import './GroupTab.less'
import { deepCopy, debounceReactEvent } from '@/utils/tools'
import { $t } from '@/Intl'

@connect(
  state => ({
    contactsGroups: state.contactsGroups,
    contacts: state.contacts
  }),
  dispatch => ({
    getContactsAndGroups: () => dispatch(getContactsAndGroups())
  })
)
class GroupsTab extends Component {
  state = {
    filterKey: '',
    filteredGroups: [], // 过滤后的数据
    curPageData: [],
    curPage: 1,
    pageNum: 10,
    selectedGroups: [],
    groupEditing: null
  }

  componentDidMount () {
    this.updateFilteredGroups()
    this.updateCurPageData()
  }

  componentDidUpdate (preProps, preState) {
    if (preState.filteredGroups !== this.state.filteredGroups ||
       preState.curPage !== this.state.curPage ||
       preState.pageNum !== this.state.pageNum
    ) {
      this.updateCurPageData()
    }

    // 更新 filteredGroups
    if (preProps.contactsGroups !== this.props.contactsGroups || preState.filterKey !== this.state.filterKey) {
      this.updateFilteredGroups()
    }

    // 当删除完最后一页时， 页码向前移动一页， 否则会出现空页面的问题
    if (preState.curPageData.length > 0 && this.state.curPageData.length === 0) {
      this.setState({
        curPage: Math.max(1, this.state.curPage - 1)
      })
    }
  }
  // 搜索输入的关键词进行过滤
  updateFilteredGroups = () => {
    const { contactsGroups } = this.props
    const { filterKey } = this.state
    let filteredGroups
    if (filterKey) {
      filteredGroups = deepCopy(contactsGroups.filter(group => group.name.toLowerCase().indexOf(filterKey) > -1))
    } else {
      filteredGroups = deepCopy(contactsGroups)
    }
    this.setState({
      filteredGroups
    })
  }
  // 更新当前页数据
  updateCurPageData = () => {
    const { curPage, pageNum, filteredGroups } = this.state
    const curPageGroups = filteredGroups.slice((curPage - 1) * pageNum, curPage * pageNum)
    const result = curPageGroups.map(group => {
      group.key = group.id
      return group
    })
    this.setState({
      curPageData: result
    })
  }

  // 清空群组
  handleClear = () => {
    const { getContactsAndGroups, contactsGroups } = this.props
    Modal.confirm({
      title: $t('c_233'),
      onOk: () => {
        let groupIds = contactsGroups.map(group => group.id).join(',')
        API.removeGroup(groupIds).then((msg) => {
          if (msg.res === 'success') {
            message.success($t('m_099'))
            this.setState({
              selectedGroups: []
            })
            setTimeout(() => {
              getContactsAndGroups()
            }, 200)
          } else {
            message.error($t('m_100'))
          }
        })
      }
    })
  }
  // 删除选中
  handleDelete = () => {
    const { selectedGroups } = this.state
    const { getContactsAndGroups } = this.props
    Modal.confirm({
      title: $t('c_234'),
      onOk: () => {
        let groupIds = selectedGroups.map(group => group.id).join(',')
        API.removeGroup(groupIds).then((msg) => {
          if (msg.res === 'success') {
            message.success($t('m_013'))
            this.setState({
              selectedGroups: []
            })
            setTimeout(() => {
              getContactsAndGroups()
            }, 200)
          } else {
            message.error($t('m_014'))
          }
        })
      }
    })
  }
  // 编辑群组
  handleEditGroup = (group) => {
    this.setState({
      groupEditing: group
    })
  }
  // 选中
  handleSelectGroup = (items) => {
    this.setState({
      selectedGroups: items
    })
  }
  // 新建群组
  handleAddGroup = () => {
    this.setState({
      groupEditing: {
        id: '', // 新增的群组id为空
        name: '',
        num: 0,
        contacts: []
      }
    })
  }
  // 跳转分页
  handlePageChange = (v) => {
    this.setState({
      curPage: v,
      selectedGroups: []
    })
  }
  // 调整每页显示数
  handlePageNumChange = (cur, size) => {
    this.setState({
      pageNum: size
    })
  }
  // 过滤
  handleFilterChange = debounceReactEvent((e) => {
    this.setState({
      filterKey: e.target.value,
      curPage: 1,
      selectedGroups: []
    })
  }, 400)

  // 编辑或添加群组后更新列表数据
  updateGroupsData = () => {
    setTimeout(() => {
      this.props.getContactsAndGroups()
    }, 200)
  }
  render () {
    const { contactsGroups } = this.props
    const { filteredGroups, curPageData, filterKey, selectedGroups, curPage, pageNum, groupEditing } = this.state
    return (
      <div className='group-tab-page'>
        <div className='group-tab-head'>
          <Button type='primary' icon='delete' disabled={selectedGroups.length === 0} onClick={this.handleDelete}>{$t('b_003')}</Button>
          <Button type='primary' icon='delete' disabled={contactsGroups.length === 0} onClick={this.handleClear}>{$t('b_037')}</Button>
          <Button type='primary' onClick={this.handleAddGroup}>{$t('b_047')}</Button>
          <Input
            onChange={this.handleFilterChange}
            prefix={<Icon type='search'/>}
            placeholder={$t('c_209')}
            className='group-search-input'
          />
        </div>
        {
          (filteredGroups.length > 0)
            ? (
            <>
              <div className='group-tab-list'>
                <GroupList
                  dataSource={curPageData}
                  onSelectRow={this.handleSelectGroup}
                  selectedGroups={selectedGroups}
                  onEditGroup={(group) => { this.handleEditGroup(group) }}
                />
              </div>
              <div className='group-pagination'>
                <Pagination
                  className='bak-pagination'
                  showSizeChanger
                  current={curPage}
                  pageSize={pageNum}
                  total={filteredGroups.length}
                  onChange={this.handlePageChange}
                  onShowSizeChange={this.handlePageNumChange}
                />
              </div>
            </>
            )
            : <NoData tip={
              filterKey && contactsGroups.length
                ? $t('c_210')
                : (
                  <span className='group-empty-tips'>
                    {$t('c_231')}<em onClick={this.handleAddGroup}>"{$t('b_047')}"</em>
                  </span>
                )}
            />
        }
        <GroupEditModal
          groupEditing={groupEditing}
          onCancel={() => { this.handleEditGroup(null) }}
          onEditComplete={ this.updateGroupsData}
          contactsGroups={contactsGroups}
        />
      </div>
    )
  }
}

export default GroupsTab
