import React, { Component } from 'react'
import { Route, Switch, Router, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { getProduct, getOemId } from '@/store/actions'
import AuthRoute from '@/components/Routes/AuthRoute'
import Login from '@/pages/Login'
import Backend from '@/pages/Backend'
import Reboot from '@/pages/Reboot'
import Intl from './Intl'

export const history = createBrowserHistory()

class App extends Component {
  componentDidMount () {
    // 获取设备型号
    store.dispatch(getProduct())
    // 获取oemId
    store.dispatch(getOemId())
  }

  render () {
    return (
      <Provider store={store}>
        <Intl>
          <Router history={history}>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/reboot' component={Reboot} />
              <AuthRoute path='/manage' component={Backend} />
              <Route component={() => <Redirect to='/login' />} />
            </Switch>
          </Router>
        </Intl>
      </Provider>
    )
  }
}

export default App
