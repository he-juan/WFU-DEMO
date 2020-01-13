/**
 * 语言选择
 */
import React, { Component } from 'react'
import { Dropdown, Menu, Icon } from 'antd'
import { connect } from 'react-redux'
import { setLocale } from '@/store/actions'
import Cookie from 'js-cookie'
import './localselect.less'

const LocalMap = {
  'en': 'English',
  'zh': '中文'
}

@connect(
  (state) => ({
    locale: state.locale
  }),
  (dispatch) => ({
    setLocale: locale => dispatch(setLocale(locale))
  })
)
class LocalSelect extends Component {
  handleSelect = (i) => {
    this.props.setLocale(i.key)
    Cookie.set('locale', i.key, { expires: 1000 })
  }

  render () {
    const { locale } = this.props

    const menu = (
      <Menu onClick={ i => this.handleSelect(i)}>
        <Menu.Item key='en'>English</Menu.Item>
        <Menu.Item key='zh'>中文</Menu.Item>
      </Menu>
    )

    return (
      <Dropdown
        overlay={menu}
        className='locale-select'
        overlayClassName='locale-dropdown'
        getPopupContainer={() => document.getElementById('localeSelect')}
      >
        <div id='localeSelect'>
          <span className='locale-txt'>{LocalMap[locale]}</span> &nbsp;<Icon type='down' />
        </div>
      </Dropdown>
    )
  }
}

export default LocalSelect
