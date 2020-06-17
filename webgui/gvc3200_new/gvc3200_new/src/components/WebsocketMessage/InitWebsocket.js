import React from 'react'
import PropTypes from 'prop-types'
import { history } from '@/App'
import { serverPing } from '@/api/api.common'

class InitWebsocket extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    onMessage: PropTypes.func.isRequired,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    debug: PropTypes.bool,
    reconnect: PropTypes.bool,
    protocol: PropTypes.string,
    reconnectIntervalInMilliSeconds: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.state = {
      ws: new WebSocket(this.props.url, this.props.protocol),
      attempts: 1
    }
    this.sendMessage = this.sendMessage.bind(this)
    this.setupWebsocket = this.setupWebsocket.bind(this)
  }

  logging (logline) {
    if (this.props.debug === true) {
      console.log(logline)
    }
  }

  generateInterval (k) {
    if (this.props.reconnectIntervalInMilliSeconds > 0) {
      return this.props.reconnectIntervalInMilliSeconds
    }
    return Math.min(30, (Math.pow(2, k) - 1)) * 1000
  }

  setupWebsocket () {
    let websocket = this.state.ws

    websocket.onopen = () => {
      this.logging('Websocket connected')
      if (typeof this.props.onOpen === 'function') this.props.onOpen()
    }

    websocket.onmessage = (evt) => {
      this.props.onMessage(evt.data)
    }

    this.shouldReconnect = this.props.reconnect
    websocket.onclose = () => {
      this.logging('Websocket disconnected')
      if (typeof this.props.onClose === 'function') this.props.onClose()
      if (history.location.pathname === '/login') return false
      // ping 一下服务器
      serverPing().then(data => {
        if (data['response'] === 'error' && data['message'] === 'authentication required') {
          window.location.href = '/login'
          // history.push('/login')
          throw new Error('exit')
        } else {
          // callback(msgs)
          if (this.shouldReconnect) {
            let time = this.generateInterval(this.state.attempts)
            this.timeoutID = setTimeout(() => {
              this.setState({ attempts: this.state.attempts + 1 })
              this.setState({ ws: new WebSocket(this.props.url, this.props.protocol) })
              this.setupWebsocket()
            }, time)
          }
        }
      })
    }
  }

  componentDidMount () {
    this.setupWebsocket()
  }

  componentWillUnmount () {
    this.shouldReconnect = false
    clearTimeout(this.timeoutID)
    let websocket = this.state.ws
    websocket.close()
  }

  sendMessage (message) {
    let websocket = this.state.ws
    websocket.send(message)
  }

  render () {
    return (
      <></>
    )
  }
}

export default InitWebsocket
