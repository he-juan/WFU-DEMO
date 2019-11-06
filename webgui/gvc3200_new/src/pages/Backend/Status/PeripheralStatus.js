import React, { Component } from 'react'
import { getHdmiinstate, getHdmi1state, getHdmi2state, getUsbstate, getSdcardstate } from '@/api/api.status'
import { $t } from '@/Intl'
import './PeripheralStatus.less'

class PeripheralStatus extends Component {
  // 0 未检测 1 可用 2 不可用
  state = {
    lineinstate: '0',
    lineoutstate: '0',
    spkrstate: '0',
    hdmiinstate: '0',
    hdmi1state: '0',
    hdmi2state: '0',
    usbstate: '0',
    sdcardstate: '0',
    mediatate: '0',
    lantate: '0',
    dicnstate: '0'
  }

  getHdmiinstate = () => {
    return new Promise((resolve, reject) => {
      getHdmiinstate().then((msgs) => {
        resolve(msgs.state || '0')
      })
    })
  }

  getHdmi1state = () => {
    return new Promise((resolve, reject) => {
      getHdmi1state().then((msgs) => {
        resolve(msgs.state || '0')
      })
    })
  }

  getHdmi2state = () => {
    return new Promise((resolve, reject) => {
      getHdmi2state().then((msgs) => {
        resolve(msgs.state || '0')
      })
    })
  }

  getUsbstate = () => {
    return new Promise((resolve, reject) => {
      getUsbstate().then((msgs) => {
        resolve(msgs.msg || '0')
      })
    })
  }

  getSdcardstate = () => {
    return new Promise((resolve, reject) => {
      getSdcardstate().then((msgs) => {
        resolve(msgs.msg || '0')
      })
    })
  }

  // 渲染 className
  renderCName = (state) => {
    switch (state) {
      case '1':
        return ' on'
      case '2':
        return ' off'
      case '0':
      default:
        return ''
    }
  }

  // componentDidMount
  async componentDidMount () {
    let hdmiinstate = await this.getHdmiinstate()
    let hdmi1state = await this.getHdmi1state()
    let hdmi2state = await this.getHdmi2state()
    let usbstate = await this.getUsbstate()
    let sdcardstate = await this.getSdcardstate()

    this.setState({
      hdmiinstate,
      hdmi1state,
      hdmi2state,
      usbstate,
      sdcardstate
    })

    alert('lineinstate, lineoutstate, spkrstate, mediatate, lantate, dicnstate 无协议')
  }

  render () {
    const { lineinstate, lineoutstate, spkrstate, hdmiinstate, hdmi1state, hdmi2state, usbstate, sdcardstate, mediatate, lantate, dicnstate } = this.state
    const ths = ['LINE IN', 'LINE OUT', 'SPKR', 'HDMI IN', 'HDMI OUT', 'SD', 'USB', 'MEDIA', 'LAN', 'DI-IN 12V']

    return (
      <div style={{ paddingTop: 20 }}>
        <table className='peripheral-table'>
          <thead>
            <tr>
              {
                ths.map(item => {
                  return (
                    <th key={item}>{item}</th>
                  )
                })
              }
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan='2'>
                <span className={'icons icon-linein' + this.renderCName(lineinstate)}></span>
                <span style={{ marginLeft: 40 }} className={'icons icon-lineout' + this.renderCName(lineoutstate)}></span>
              </td>
              <td>
                <span className={'icons icon-spkr' + this.renderCName(spkrstate)}></span>
              </td>
              <td>
                <span className={'icons icon-hdmiin' + this.renderCName(hdmiinstate)}></span>
              </td>
              <td>
                <div style={{ marginTop: -14 }}>
                  <span className={'icons icon-hdmi1out' + this.renderCName(hdmi1state)}></span>
                  <span style={{ marginLeft: 40 }} className={'icons icon-hdmi2out' + this.renderCName(hdmi2state)}></span>
                </div>
              </td>
              <td>
                <span className={'icons icon-sd' + this.renderCName(sdcardstate)}></span>
              </td>
              <td>
                <span className={'icons icon-usb' + this.renderCName(usbstate)}></span>
              </td>
              <td colSpan='2'>
                <span className={'icons icon-jack' + this.renderCName(mediatate)}></span>
                <span style={{ marginLeft: 40 }} className={'icons icon-jack' + this.renderCName(lantate)}></span>
              </td>
              <td>
                <span className={'icons icon-dicn' + this.renderCName(dicnstate)}></span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className='peripheral-info'>
          * {$t('c_325')}
        </div>
      </div>
    )
  }
}

export default PeripheralStatus
