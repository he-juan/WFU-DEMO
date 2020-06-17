import React from 'react'
import { Route, Redirect, Switch, withRouter, Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import ContextProvider from './ContextProvider'
import Intl, { $t } from './Intl'
import './common.less'
import API from './api'
// pages
import Language from './pages/Language'
import Timezone from './pages/Timezone'
import Network from './pages/Network'
import Account from './pages/Account'
import Result from './pages/Result'
import RefreshQrCode from './pages/RefreshQrCode'
import ScreenLock from './pages/ScreenLock'

export const history = createBrowserHistory({
  basename: '/quickconf.html'
})

const routes = [
  { path: '/language', component: Language, title: 'c_046' }, // 选择语言
  { path: '/timezone', component: Timezone, title: 'c_047' }, // 选择时区
  { path: '/network', component: Network, title: 'c_048', exact: false }, // 网络配置
  { path: '/account', component: Account, title: 'c_049' }, // 帐号配置
  { path: '/result', component: Result, title: 'c_045' }, // 配置成功
  { path: '/refreshqrcode', component: RefreshQrCode, title: 'c_044' }, // 刷新二维码
  { path: '/screenlock', component: ScreenLock, title: 'c_039' } // 设置锁屏密码
]

// 修改document.title
const HandleDocTitle = withRouter(({ location }) => {
  // const { pathname } = location
  // const matchedRoute = routes.find(route => pathname.includes(route.path))
  // document.title = matchedRoute ? $t(matchedRoute.title) : $t('c_050') // 快速配置

  document.title = $t('c_050')
  return null
})

class QuickConifgApp extends React.Component {
  state = {
    checkqrtoken: ''
  }

  componentDidMount () {
    API.checkqrtoken(document.location.hash.slice(1)).then(m => {
      // eslint-disable-next-line no-eval
      m = typeof m === 'string' ? eval(m) : m // 处理2b接口的返回
      this.setState({
        checkqrtoken: m.res // success or error
      })
    })
  }

  render () {
    const { checkqrtoken } = this.state
    // console.log(checkqrtoken)
    return (
      <ContextProvider>
        <Intl>
          <Router history={history}>
            <HandleDocTitle />
            <div className='main-container'>
              <TransitionGroup className='transition-wrapper'>
                {
                  checkqrtoken === 'success' ? (
                    <Switch>
                      {
                        routes.map(route => {
                          const { path, component: Component, ...props } = route
                          return (
                            <Route path={path} exact key={path} {...props}>
                              {({ match }) => (
                                <CSSTransition
                                  in={match != null}
                                  timeout={1000}
                                  classNames='fade-page'
                                  unmountOnExit
                                >
                                  <Component />
                                </CSSTransition>
                              )}
                            </Route>
                          )
                        })
                      }
                      <Route component={() => <Redirect to='/language' />} />
                    </Switch>
                  ) : checkqrtoken === 'error' ? (
                    <RefreshQrCode />
                  ) : null
                }
              </TransitionGroup>
            </div>
          </Router>
        </Intl>
      </ContextProvider>
    )
  }
}

export default QuickConifgApp
