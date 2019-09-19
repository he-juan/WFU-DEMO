import React from 'react'
import ReactDOM from 'react-dom'
import './assets/common.css'
import './assets/icons/icon.less'
import App from './App'
import { storageListener } from './utils/tools'
import { message } from 'antd'
// import * as serviceWorker from './serviceWorker'

message.config({
  maxCount: 1,
  duration: 2
})

window.isIEBrowser = !!window.ActiveXObject || 'ActiveXObject' in window
window.isLoginPageEvent = false // 当在登录页中 登录成功后会 设为true，然后针对ie中 当前tab也会触发 监听storage 做拦截
// 监听本地存储事件
storageListener.add()

ReactDOM.render(<App />, document.getElementById('root'))

if (process.env.NODE_ENV === 'development') {
  require('./mock/mock.js')
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
