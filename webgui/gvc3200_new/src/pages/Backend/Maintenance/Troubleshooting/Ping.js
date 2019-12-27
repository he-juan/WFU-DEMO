import React from 'react'
import { Form, Button, Input, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { InputItem } from '@/components/FormItem'
import { connect } from 'react-redux'
import { getOptions } from '@/template'
import API from '@/api'
import './Traceroute.less'
import { $t } from '@/Intl'

let pingTimer = null
let pingIsStop = false

@connect(
  state => ({
    gateway: state.networkStatus.gateway
  })
)
@Form.create()
class Ping extends FormCommon {
  state = {
    pingResult: '',
    inputDisable: false,
    startDisable: false,
    stopDisable: true,
    notFirst: false
  }
  options = getOptions('Maintenance.TroubleShooting.Ping')

  componentDidMount () {
    window.addEventListener('beforeunload', this.stopPingHandler)
  }

  componentWillUnmount () {
    this.stopPingHandler()
    window.removeEventListener('beforeunload', this.stopPingHandler)
  }

  handleStart = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { targethost } = values
        this.startPing(targethost)
      }
    })
  }

  startPing = (addr) => {
    const reg1 = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:)|(\[([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[[0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){1,7}:\](:[1-9]([0-9]){0,4}){0,1}))$/
    const reg2 = /^((https?:\/\/)?|(ftp:\/\/)?|(tftp:\/\/)?)(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
    let type
    if (reg1.test(addr)) type = 'ipv6'
    else if (reg2.test(addr)) type = 'ipv4'

    this.setState({
      inputDisable: true,
      startDisable: true,
      stopDisable: false,
      pingResult: '',
      notFirst: true
    })
    API.startPing(addr, type).then(m => {
      pingIsStop = false
      if (m.Response === 'Success') {
        pingTimer = setTimeout(() => {
          this.getPingMsg(0)
        }, 2000)
      } else {
        this.setState({
          inputDisable: false,
          startDisable: false,
          stopDisable: true
        })
        message.error($t('m_069'))
      }
    })
  }

  getPingMsg = (offset) => {
    API.getPingMsg(offset).then(m => {
      const { Response } = m
      if (Response === 'Success') {
        const { pingmsg } = m
        if (pingmsg !== 'continue') {
          if (/rtt/.test(pingmsg)) {
            this.stopPingHandler()
            this.setState({
              inputDisable: false,
              startDisable: false,
              stopDisable: true
            })
            return false
          }
          const curOffset = m.offset
          let pingResult = this.state.pingResult + pingmsg + '\n'
          this.setState({
            pingResult
          })
          pingTimer = setTimeout(() => this.getPingMsg(curOffset), 1000)
        } else {
          if (pingIsStop) {
            clearTimeout(pingTimer)
            pingTimer = null
            this.setState({
              inputDisable: false,
              startDisable: false,
              stopDisable: true
            })
          } else {
            pingTimer = setTimeout(() => this.getPingMsg(offset), 1000)
          }
        }
      } else {
        clearTimeout(pingTimer)
        pingTimer = null
        this.setState({
          pingResult: this.setState.pingResult + m.Message + '\n',
          inputDisable: false,
          startDisable: false,
          stopDisable: true
        })
      }
    })
  }

  handleStop = () => {
    API.stopPing().then(m => {
      if (m.Response === 'Success') {
        pingIsStop = true
        message.success($t('m_070'))
        this.setState({
          stopDisable: true
        })
      } else {
        message.error($t('m_069'))
      }
    })
  }

  /** 组件销毁，刷新都需要调用 */
  stopPingHandler = () => {
    clearTimeout(pingTimer)
    pingTimer = null
    if (pingIsStop) return false
    API.stopPing()
    pingIsStop = true
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const { gateway } = this.props
    const { pingResult, stopDisable, startDisable, inputDisable, notFirst } = this.state
    const options = this.options

    return (
      <Form hideRequiredMark>
        <InputItem
          {...options['targethost']}
          gfd={gfd}
          disabled={inputDisable}
          gfdOptions={{
            initialValue: gateway,
            rules: [
              this.checkaddressPath(),
              this.required()
            ]
          }}
        />
        <FormItem>
          <Button type='primary' onClick={this.handleStart} disabled={startDisable}>{$t('b_025')}</Button> &nbsp;
          <Button type='danger' onClick={this.handleStop} disabled={stopDisable}>{$t('b_026')}</Button>
        </FormItem>
        <Input.TextArea className={`result-area ${pingResult.length > 0 || notFirst ? 'show' : ''}`} value={pingResult} disabled/>
      </Form>
    )
  }
}

export default Ping
