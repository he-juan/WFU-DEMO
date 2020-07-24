import React from 'react'
import ReactDOM from 'react-dom'
import './assets/common.css'
import './assets/icons/icon.less'
import App from './App'
import { registerShowPHandler } from './utils/showp'
import { message } from 'antd'
// import * as serviceWorker from './serviceWorker'

message.config({
  maxCount: 1,
  duration: 2,
  top: 50
})

// showp
registerShowPHandler()

ReactDOM.render(<App />, document.getElementById('root'))

if (process.env.NODE_ENV === 'development') {
  require('./mock/mock.js')
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
