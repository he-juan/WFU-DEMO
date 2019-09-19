/**
 * 固件安装时的进度条提示
 */
import React, { PureComponent } from 'react'
import { Progress, Modal } from 'antd'
import { MsgObserver } from '@/components/WebsocketMessage'
import './FirmwareInstallTip.less'
import { $t } from '@/Intl'

let TIMER = null

const StatusResult = {
  '1': 'm_140', // '版本一样，不需要更新',
  '2': 'm_141', // 读取固件出错
  '3': 'm_142', // 固件签名出错
  '5': 'm_143', // 固件不适用于此硬件
  '6': 'm_144', // 固件中image ID不匹配
  '7': 'm_145', // 固件不兼容
  '8': 'm_146', // 内存不足
  '9': 'm_147', // 固件已损坏
  '10': 'm_148', // 磁盘空间不足
  '11': 'm_149', // 固件中OEM ID不匹配
  '128': 'm_150', // 固件服务器路径已修改
  '15': 'm_139' // 未知错误
}

class FirmwareInstallTip extends PureComponent {
  state = {
    percent: 0
  }
  componentDidMount () {
    MsgObserver.subscribe('install', (message) => {
      const { msg, val } = message

      if (msg === 'progress') {
        this.msgProgressHandler(val)
      } else if (msg === 'status') {
        this.msgＳtatusHandler(val)
      }
    })
  }

  msgProgressHandler = (val) => {
    let percent = parseInt(val)
    this.setState({
      percent: percent
    })
    if (percent === 100) {
      TIMER = setTimeout(() => {
        this.setState({
          percent: 0
        })
        Modal.info({
          title: $t('m_151'),
          okText: $t('b_002'),
          onOk: () => {
            window.location.href = '/login'
          }
        })
      }, 2000)
    }
  }

  msgＳtatusHandler = (val) => {
    this.setState({
      percent: 0
    })
    let errMsg = `${$t('m_138')},${$t(StatusResult[val] || 'm_139')}.`
    Modal.error({
      title: errMsg,
      okText: $t('b_002')
    })
  }

  componentWillUnmount () {
    MsgObserver.unsubscribe('install')
    clearTimeout(TIMER)
  }
  render () {
    const { percent } = this.state
    return (
      <Modal
        visible={percent > 0}
        footer={null}
        closable={false}
        transitionName={''}
        className='install-tip-modal'
        centered={true}
      >
        <p className='install-percent'>{percent} %</p>
        {/* 固件更新 */}
        <p className='install-txt'>{$t('c_307')}</p>
        <Progress percent={percent} status='active' strokeColor='#3d77ff' showInfo={false}/>
      </Modal>
    )
  }
}

export default FirmwareInstallTip
