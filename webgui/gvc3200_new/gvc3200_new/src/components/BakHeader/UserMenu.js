import React from 'react'
import { Menu, Dropdown, Icon } from 'antd'
// import { history } from '@/App'
import API from '@/api'
import Cookie from 'js-cookie'
import { $t } from '@/Intl'

const UserMenu = () => {
  const logout = () => {
    API.logoff().then(m => {
      if (m.Response === 'Success') {
        window.localStorage.setItem('logindate', '')
        Cookie.remove('type')
        // history.push('/login')

        window.location.href = '/login'
      }
    })
  }
  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>
        <i className='icons icon-logout' /> {$t('b_036')}
      </Menu.Item>
    </Menu>
  )
  const user = Cookie.get('type')
  return (
    <Dropdown
      overlay={menu}
      className='user-menu'
      overlayClassName='user-dropdown'
      getPopupContainer={() => document.getElementById('userMenu')}
    >
      <div id='userMenu'>
        <i className='icons icon-header' /> {user} <Icon type='down' />
      </div>
    </Dropdown>
  )
}

export default UserMenu
