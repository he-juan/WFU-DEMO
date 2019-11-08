import React, { Component } from 'react'
import { $t } from '@/Intl'
import { Modal } from 'antd'
import API from '@/api'

class DNDBtn extends Component {
  state = {
    dndStatus: 0
  }
  setDndStatus = (dndStatus) => {
    this.setState({
      dndStatus
    })
  }
  componentDidMount () {
    API.getPvalues(['Pdnd']).then(data => {
      this.setDndStatus(+data.Pdnd)
    })
  }
  handleDnd = () => {
    const { dndStatus } = this.state
    let status = dndStatus ? 0 : 1
    Modal.confirm({
      title: status ? $t('m_205') : $t('m_206'),
      onOk: () => {
        API.ctrlConfDnd(status).then(msg => {
          if (msg.result === 0) this.setDndStatus(status)
        })
      }
    })
  }

  render () {
    const { dndStatus } = this.state
    return (
      <span onClick={this.handleDnd} className={`dnd-btn ${dndStatus ? 'active' : ''}`}>
        {$t('c_326')}
      </span>
    )
  }
}

export default DNDBtn
