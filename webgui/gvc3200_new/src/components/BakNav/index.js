/**
 * 左侧菜单导航
 */
import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'
import './baknav.less'
import menuData from './menulist'
import { getPvalues } from '@/api/api.common'
import { $t } from '@/Intl'
const { SubMenu } = Menu
const WIFI_MENU_PATH = '/bak/network_wifi'

@withRouter
class BakNav extends Component {
  state = {
    openKeys: this.getOpenKeys(menuData, []),
    SHOW_WIFI_MENU: false
  }
  // 根据pathname 递归找到openkey
  getOpenKeys (menu, result) {
    const { pathname } = this.props.location
    for (let i = 0; i < menu.length; i++) {
      let p = menu[i].path
      let sub = menu[i].sub
      if (p && pathname.indexOf(p) >= 0) {
        result.push(p)
        if (sub) {
          this.getOpenKeys(sub, result)
        }
        break
      }
    }
    return result
  }
  handleOpenChange = (k) => {
    // const { history } = this.props
    let lastKey = k[k.length - 1]
    if (k[0] && lastKey.indexOf(k[0]) < 0) {
      k = [lastKey]
    }
    // 目前按两级菜单处理 //点击默认进入第一个子菜单路由
    // let destlv1 = menuData.filter(item => item.path === k[0])[0]
    // if (!destlv1) return false
    // let destlv2 = destlv1.sub ? destlv1.sub[0].path : destlv1.path
    // history.push(destlv2)
    this.setState({
      openKeys: k
    })
  }
  buildMenu (menuData) {
    let { SHOW_WIFI_MENU } = this.state
    const { location } = this.props
    const pathname = location.pathname.split('/').slice(0, 3).join('/')
    return menuData.map((v) => {
      if (v.sub) {
        return (
          <SubMenu key={v.path} title={<span> { v.icon ? <i className={`icons ${v.icon} ${pathname.indexOf(v.path) !== -1 ? 'active' : ''}`} /> : null}<span>{$t(v.name)}</span></span>}>
            {this.buildMenu(v.sub)}
          </SubMenu>
        )
      }
      return (
        WIFI_MENU_PATH === v.path && !SHOW_WIFI_MENU ? null : <Menu.Item key={v.path}>
          <Link to={v.path}>
            { v.icon ? <i className={`icons ${v.icon}`} /> : null}
            <span>{$t(v.name)}</span>
          </Link>
        </Menu.Item>
      )
    })
  }

  componentDidMount () {
    // 获取wifi设置开关是否开启
    getPvalues(['P22038']).then(data => {
      console.log(data)
      this.setState({
        SHOW_WIFI_MENU: +data['P22038'] !== 1
      })
    })
  }

  componentDidUpdate (prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({
        openKeys: this.getOpenKeys(menuData, [])
      })
    }
  }

  render () {
    const { openKeys } = this.state
    const { location } = this.props
    const pathname = location.pathname.split('/').slice(0, 3).join('/')
    return (
      <Menu
        mode='inline'
        theme='dark'
        className='backend-nav'
        openKeys={openKeys}
        selectedKeys={[pathname]}
        onOpenChange={this.handleOpenChange}
      >
        {this.buildMenu(menuData)}
      </Menu>
    )
  }
}

export default BakNav
