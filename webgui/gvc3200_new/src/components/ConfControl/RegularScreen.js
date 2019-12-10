import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './RegularScreen.less'
import { history } from '@/App'

class RegularScreen extends Component {
  static propTypes = {
    onSwitchScreen: PropTypes.func
  }
  unListen = null
  componentDidMount () {
    this.unListen = history.listen(() => {
      this.props.onSwitchScreen()
    })
  }
  componentWillUnmount () {
    this.unListen && this.unListen()
  }
  render () {
    const { onSwitchScreen } = this.props
    return (
      <div className='regular-screen'>
        <i className='close-icon' onClick={() => onSwitchScreen()}>缩放</i>
        <p></p>
        <div className='regular-screen-main'>

        </div>
      </div>
    )
  }
}

export default RegularScreen
