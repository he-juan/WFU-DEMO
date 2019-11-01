/**
 * 这是一层对tab路由页的封装, 包括了tab组件以及tab级路由过渡代码的逻辑
 */
import React from 'react'
import { Tabs } from 'antd'
import { withRouter, Switch, Redirect, Route } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { $t } from '@/Intl'
import PropTypes from 'prop-types'
import { isMenuRouteDeny } from '@/utils/tools'

import './tabpages.less'

const TabPane = Tabs.TabPane

const TabPages = (props) => {
  let { history, location, routes } = props
  routes = routes.filter(v => {
    return !isMenuRouteDeny(v)
  })
  const _to = routes[0].path
  const _from = _to.split('/').slice(0, -1).join('/')
  return (
    <div className='tab-pages'>
      <Tabs className='link-tabs' activeKey={location.pathname} onChange={(path) => { history.push(path) }} >
        {
          routes.map(v => <TabPane tab={$t(v.tab)} key={v.path}></TabPane>)
        }
      </Tabs>
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
    </div>
  )
}

TabPages.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    tab: PropTypes.tab, // 词条key
    path: PropTypes.path,
    component: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func
    ])
  })).isRequired
}

export default withRouter(TabPages)
