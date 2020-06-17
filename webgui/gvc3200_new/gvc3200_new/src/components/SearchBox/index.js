import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import { Input } from 'antd'
import { $t } from '@/Intl'
import { history } from '@/App'
import template from '@/template'
import { deepCopy } from '@/utils/tools'
import './SearchBox.less'

const { Search } = Input

@connect(
  state => ({
    oemId: state.oemId,
    productInfo: state.productInfo, // { BaseProduct }
    userType: state.userType
  })
)
class SearchBox extends Component {
  constructor (props) {
    super(props)

    this.valueReg = ''
    this.searchInput = ''
    this.state = {
      searchResult: '',
      searchValue: '',
      searchBox: false
    }
  }

  trTitle (str, val) {
    let arr = str.split('/').filter(lang => !!lang).map(lang => {
      return $t(lang)
    })
    arr.forEach((item, index) => {
      if (index === arr.length - 1) {
        arr[index] = item.replace(this.valueReg, '<span>$1</span>')
      }
    })
    return arr.join(' > ')
  }

  // 判断是否是 deny 项目
  isDeny (item) {
    let { oemId, productInfo: { BaseProduct }, userType } = this.props
    if (
      (item.denyModel && item.denyModel.indexOf(BaseProduct) > -1) || // 当配置项 隐藏的 设备型号和当前型号匹配时
      (item.denyOem && item.denyOem.indexOf(oemId) > -1) || // 当配置项隐藏的oemId 和当前型号oemid匹配时
      (item.denyRole && item.denyRole.indexOf(userType) > -1) // 当配置项隐藏的用户类型和当前用户类型匹配时 （admin, 或user）
    ) {
      return true
    } else {
      return false
    }
  }

  isMatch (lang, val) {
    return $t(lang).toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) >= 0
  }

  buildResultItem (item, title, path, val) {
    let _title = deepCopy(title)
    let _path = '/manage/'
    _title.push(item.lang)
    _title = _title.join('/')

    if (path.length < 3) {
      _path += path.join('_')
    } else {
      _path += path.slice(0, 2).join('_')
      _path += '/' + path.slice(2).join('/')
    }
    return {
      path: _path,
      title: this.trTitle(_title, val)
    }
  }

  // 遍历得到相关menu
  getSearchResult = (val) => {
    let _this = this
    let result = {}

    function find (ary, path = [], title = []) {
      for (let i = 0; i < ary.length; i++) {
        let item = ary[i]
        // 判断是否 deny
        if (_this.isDeny(item)) {
          if (i === ary.length - 1) {
            path.pop()
            title.pop()
          }
          continue
        }
        // 如果有子集
        if (item.sub && item.sub.length > 0) {
          path.push(item.path)
          title.push(item.lang)
          find(item.sub, path, title)
        } else {
          // 进行匹配
          if (item.lang && _this.isMatch(item.lang, val)) {
            let title0 = title[0]
            if (!(title0 in result)) {
              result[title0] = []
            }
            result[title0].push(_this.buildResultItem(item, title.slice(1), path, val))
          }
        }
        // 遍历到最后时跳出该递归了，需要回退一个位置
        if (i === ary.length - 1) {
          path.pop()
          title.pop()
        }
      }
    }
    find(template)
    return result
  }

  // 跳转路由
  jumpToPath = (path) => {
    history.push(path)
    this.setState({
      searchBox: false
    })
  }

  // handleClick
  handleClick = (e) => {
    e.nativeEvent.stopImmediatePropagation()
  }

  // handleSetShow
  handleSetShow = (e) => {
    const { searchBox } = this.state
    this.setState({
      searchBox: !searchBox
    })
  }

  // 查询
  handleOnSearch = (value) => {
    let _value = value.trim()
    if (_value !== '') {
      this.valueReg = new RegExp(`(${_value})`, 'ig')
      let result = this.getSearchResult(_value)
      this.setState({
        searchValue: _value,
        searchResult: result
      })
    }
  }

  handleEventListener = () => {
    const { searchBox } = this.state
    searchBox && this.setState({
      searchBox: false
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const { searchBox } = this.state
    if (searchBox) this.searchInput.focus()
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.handleEventListener)
  }

  componentDidMount () {
    document.addEventListener('click', this.handleEventListener)
  }

  render () {
    let { searchResult, searchValue, searchBox } = this.state

    return (
      <div className='header-search' onClick={e => this.handleClick(e)}>
        <span className='icons header-search-icon' onClick={e => this.handleSetShow(e)}></span>
        <CSSTransition in={searchBox} timeout={300} unmountOnExit classNames='fade'>
          <div className='header-search-box'>
            <Search
              ref={el => { this.searchInput = el }}
              placeholder={$t('c_209')}
              style={{ width: '100%' }}
              defaultValue={searchValue}
              onSearch={value => this.handleOnSearch(value)}
            />
            {
              Object.keys(searchResult).length === 0 ? searchValue === '' ? <div className='search-desc'>{$t('m_095')}</div> : <div className='nodata'>{$t('m_096')}</div> : <div className='search-result'>
                {
                  Object.keys(searchResult).map(key => {
                    return (
                      <div className='result-menu' key={key}>
                        <div className='menu-title clearfix'>
                          <span className={'icons menu-icon ' + key}></span>
                          <span className='menu-text'>{$t(key)}</span>
                        </div>
                        <div className='menu-content'>
                          {
                            searchResult[key].map((item, index) => {
                              return <div className='menu-item' key={index} onClick={() => this.jumpToPath(item.path)} dangerouslySetInnerHTML={{ __html: item.title }} />
                            })
                          }
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            }
          </div>
        </CSSTransition>
      </div>
    )
  }
}

export default SearchBox
