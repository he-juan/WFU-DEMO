import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter, Switch, Redirect, Route } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Tabs } from 'antd'
import { $t } from '@/Intl'
import { isMenuRouteDeny } from '@/utils/tools'

import BlueJeans from './BlueJeans'
import Zoom from './Zoom'
import './index.less'

let backContent = null
let accoutsTab = null
// let linksTab = null 不使用linksTab的原因是，linksTab 是子组件渲染

const routes = [
  { tab: 'r_066', path: '/manage/acct_videoconf/bj', isEdit: false, component: BlueJeans }, // BlueJeans
  { tab: 'r_073', path: '/manage/acct_videoconf/zoom', isEdit: false, component: Zoom } // Zoom
]

@withRouter
@connect(
  state => ({
    acctStatus: state.acctStatus
  })
)
class VideoConf extends PureComponent {
  componentDidMount () {
    backContent = document.getElementById('backendContent')
    accoutsTab = document.getElementsByClassName('videoconf-tab')[0]

    backContent.addEventListener('scroll', this.scrollHandler, false)
    window.addEventListener('resize', this.autoWidth, false)
  }

  componentWillUnmount () {
    let linksTab = document.getElementsByClassName('link-tabs')[0]

    backContent.removeEventListener('scroll', this.scrollHandler)
    window.removeEventListener('resize', this.autoWidth, false)
    accoutsTab.removeAttribute('style')
    linksTab.removeAttribute('style')
    backContent.classList.remove('back-content-fixed')
  }

  // 固定顶部的账号切换tab, 不太好的处理
  scrollHandler = (e) => {
    let backConTop = e.target.scrollTop
    let linksTab = document.getElementsByClassName('link-tabs')[0]
    if (backConTop >= 45 && backContent.classList && !backContent.classList.contains('back-content-fixed')) {
      backContent.classList.add('back-content-fixed')
      this.autoWidth()
      backContent.scrollTop = backConTop
    } else if (backConTop < 45 && backContent.classList && backContent.classList.contains('back-content-fixed')) {
      backContent.classList.remove('back-content-fixed')
      accoutsTab.removeAttribute('style')
      linksTab.removeAttribute('style')
    }
  }

  autoWidth = () => {
    let w = document.getElementsByClassName('backend-main')[0].offsetWidth
    let linksTab = document.getElementsByClassName('link-tabs')[0]
    accoutsTab.setAttribute('style', `width:${w}px`)
    linksTab.setAttribute('style', `width:${w}px`)
  }

  render () {
    let { acctStatus, history, location } = this.props
    // 不知道 edit的显示条件什么
    acctStatus.forEach(item => {
      if (item.name === 'BlueJeans' && item.num && item.server) {
        routes[0].isEdit = true
      }
      if (item.name === 'Zoom' && item.num && item.server) {
        routes[1].isEdit = true
      }
    })
    let _routes = routes.filter(v => {
      return !isMenuRouteDeny(v)
    })
    const _to = _routes[0].path
    const _from = _to.split('/').slice(0, -1).join('/')
    const activeKey = location.pathname.substr(0, location.pathname.lastIndexOf('/'))

    return (
      <>
        <Tabs
          className='videoconf-tab'
          activeKey={activeKey}
          tabBarGutter={10}
          animated={false}
          onChange={(path) => { history.push(path) }}
        >
          {
            routes.map(v => (
              <Tabs.TabPane tab={<><i className={'icons icon-acct' + (v.isEdit ? '-edit' : '')}></i>{$t(v.tab)}</>} key={v.path}></Tabs.TabPane>
            ))
          }
        </Tabs>
        {/* 组件 */}
        <TransitionGroup>
          <Switch location={location}>
            <Redirect exact from={_from} to={_to} />
            {
              routes.map(({ component: Component, path, ...props }) => (
                <Route key={path} path={path} {...props}>
                  {({ match }) => (
                    <CSSTransition
                      in={match != null}
                      timeout={800}
                      classNames='ani-tab-page'
                      unmountOnExit
                    >
                      <Component />
                    </CSSTransition>
                  )}
                </Route>
              ))
            }
            <Route component={() => <Redirect to={'/manage'} />}/>
          </Switch>
        </TransitionGroup>
      </>
    )
  }
}

export default VideoConf
