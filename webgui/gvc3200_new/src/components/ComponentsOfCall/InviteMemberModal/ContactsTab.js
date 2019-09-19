import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip, Table } from 'antd'
import { parseAcct } from '@/utils/tools'
import NoData from '../../NoData'

let timer, DATASOURCE

class ContactsTab extends Component {
  static propTypes = {
    contacts: PropTypes.array.isRequired, // 联系人
    onAdd: PropTypes.func.isRequired, // 添加事件
    filterTags: PropTypes.string.isRequired // 过滤
  }

  constructor (props) {
    super(props)

    this.state = {
      dataSource: [],
      curPage: 1
    }
  }

  // 返回图标名 是否是会议, 单路(呼入,呼出,未接来电), 联系人
  getIconClass = ({ isfavourite }) => {
    return isfavourite === '1' ? 'icon-contacts-fav' : 'icon-contacts'
  }

  // 解析联系人
  parseContacts = (contacts) => {
    let result = []
    contacts.forEach(item => {
      item.phone.forEach((phone, i) => {
        let data = {
          key: 'c' + item.id + i,
          col0: item.name.displayname,
          col1: parseAcct(phone.acct),
          col2: phone.number,
          name: item.name.displayname,
          number: phone.number,
          numberText: phone.number,
          acct: phone.acct,
          isvideo: 1,
          source: 1, // 联系人呼出source 为1
          contacts: '1',
          lvl: '0',
          isfavourite: item.isfavourite,
          email: item.email[0] ? item.email[0].address : ''
        }
        result.push(data)
      })
    })
    return result
  }

  setRowClassName = (record, index) => {
    if (record.lvl === '0') {
      return index % 2 === 1 ? 'gray' : ''
    }
    return ''
  }

  // 滚动分页加载
  handleTableScroll = (e) => {
    if (timer) return false
    const { curPage, dataSource } = this.state
    const outerHeight = e.target.offsetHeight
    const scrollTop = e.target.scrollTop
    timer = setTimeout(() => {
      timer = null
      const innerHeight = this.refs.recordTable.offsetHeight
      if (innerHeight - outerHeight - scrollTop < 300) {
        if (30 * curPage > dataSource.length) return
        this.setState({
          curPage: this.state.curPage + 1
        })
      }
    }, 100)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.filterTags !== nextProps.filterTags) { // filterTags 过滤项
      let filterTags = nextProps.filterTags
      let _dataSource = DATASOURCE
      if (filterTags.trim().length) {
        _dataSource = DATASOURCE.filter(item => {
          return item.col0.indexOf(filterTags) >= 0 || (item.numberText && item.numberText.indexOf(filterTags) >= 0)
        }).map(item => {
          let _item = JSON.parse(JSON.stringify(item))
          _item.col0 = _item.col0.replace(filterTags, `<b>${filterTags}</b>`)
          if (_item.numberText) {
            _item.numberText = _item.numberText.replace(filterTags, `<b>${filterTags}</b>`)
          }
          return _item
        })
      }
      this.setState({
        dataSource: _dataSource,
        curPage: 1
      })
    }
  }

  componentDidMount () {
    const { contacts } = this.props
    const dataContacts = this.parseContacts(contacts)
    DATASOURCE = dataContacts
    this.setState({
      dataSource: dataContacts
    })
  }

  render () {
    const { dataSource, curPage } = this.state
    const { onAdd } = this.props
    let _dataSource = dataSource.slice(0, 30 * curPage)

    const columns = [
      {
        key: 'col0',
        dataIndex: 'col0',
        width: '35%',
        render: (text, record, index) => {
          return (
            <div className='record-name'>
              <i className={'icons ' + this.getIconClass(record)}></i>
              <strong dangerouslySetInnerHTML={{ __html: text }}></strong>
            </div>
          )
        }
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
          return <span dangerouslySetInnerHTML={{ __html: record.numberText }}></span>
        }
      },
      {
        key: 'col3',
        dataIndex: 'col3',
        width: '15%',
        render: (text, record, index) => {
          return (
            <div className='operate-btns'>
              <Tooltip>
                <span className='icons icon-add' onClick={() => onAdd(record)}></span>
              </Tooltip>
            </div>
          )
        }
      }
    ]
    return (
      <div className='tab-content' onScroll={(e) => this.handleTableScroll(e)}>
        <div ref='recordTable'>
          {
            _dataSource.length > 0 ? <Table
              className='contacts-table'
              columns={columns}
              pagination={false}
              dataSource={_dataSource}
              showHeader={false}
              rowClassName={this.setRowClassName}
            /> : <NoData/>
          }
        </div>
      </div>
    )
  }
}

export default ContactsTab