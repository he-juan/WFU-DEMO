import React, { Component } from 'react'
import EPTZControl from '@/components/EPTZControl'
import './CameraControl.less'

class CameraControl extends Component {
  render () {
    return (
      <div className='camera-ctrl-page'>
        <div className='ctrl-wrapper'>
          <EPTZControl />
        </div>
      </div>
    )
  }
}

export default CameraControl
