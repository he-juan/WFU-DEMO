import React, { Component } from 'react'
import { getInterfaceStatus } from '@/api/api.status'
import { $t } from '@/Intl'
import './PeripheralStatus.less'

class PeripheralStatus extends Component {
  // 0 未检测 1 可用 2 不可用
  state = {
    line_in: '0',
    line_out: '0',
    speaker: '0',
    hdmi_in: '0',
    hdmi_out1: '0',
    hdmi_out2: '0',
    sd: '0',
    usb1: '0',
    usb2: '0',
    media: '0',
    lan: '0',
    di_in: '0'
  }

  getInterfaceStatus = () => {
    const state = this.state
    getInterfaceStatus().then(msgs => {
      if (typeof (msgs.data) === 'object') {
        this.setState(Object.assign({}, state, msgs.data))
      }
    })
  }

  // 渲染 className
  renderCName = (state = '0') => {
    switch (+state) {
      case 1:
        return ' on'
      case 2:
        return ' off'
      case 0:
      default:
        return ''
    }
  }

  // componentDidMount
  async componentDidMount () {
    this.getInterfaceStatus()
  }

  render () {
    const {
      line_in,
      line_out,
      hdmi_in,
      hdmi_out1,
      hdmi_out2,
      sd,
      usb1,
      usb2,
      media,
      lan,
      di_in
    } = this.state
    const ths = ['LINE IN', 'LINE OUT', 'HDMI IN', 'HDMI OUT', 'SD', 'USB1', 'USB2', 'MEDIA', 'LAN', 'DI-IN 12V']

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
                <span className={'icons icon-linein' + this.renderCName(line_in)}></span>
                <span style={{ marginLeft: 40 }} className={'icons icon-lineout' + this.renderCName(line_out)}></span>
              </td>
              <td>
                <span className={'icons icon-hdmiin' + this.renderCName(hdmi_in)}></span>
              </td>
              <td>
                <div style={{ marginTop: -14 }}>
                  <span className={'icons icon-hdmi2out' + this.renderCName(hdmi_out2)}></span>
                  <span style={{ marginLeft: 40 }} className={'icons icon-hdmi1out' + this.renderCName(hdmi_out1)}></span>
                </div>
              </td>
              <td>
                <span className={'icons icon-sd' + this.renderCName(sd)}></span>
              </td>
              <td>
                <span className={'icons icon-usb' + this.renderCName(usb1)}></span>
              </td>
              <td>
                <span className={'icons icon-usb' + this.renderCName(usb2)}></span>
              </td>
              <td colSpan='2'>
                <span className={'icons icon-jack' + this.renderCName(media)}></span>
                <span style={{ marginLeft: 40 }} className={'icons icon-jack' + this.renderCName(lan)}></span>
              </td>
              <td>
                <span className={'icons icon-dicn' + this.renderCName(di_in)}></span>
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
