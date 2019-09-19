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
  componentWillUnmount () {
    clearTimeout(pingTimer)
    pingTimer = null
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
    this.setState({
      inputDisable: true,
      startDisable: true,
      stopDisable: false,
      pingResult: '',
      notFirst: true
    })
    API.startPing(addr).then(m => {
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
      const { Response, offset, pingmsg } = m
      if (Response === 'Success') {
        if (pingmsg !== 'continue') {
          let pingResult = this.state.pingResult + pingmsg + '\n'
          this.setState({
            pingResult
          })
          pingTimer = setTimeout(() => this.getPingMsg(offset), 1000)
        } else {
          clearTimeout(pingTimer)
          this.setState({
            inputDisable: false,
            startDisable: false,
            stopDisable: true
          })
        }
      } else {
        clearTimeout(pingTimer)
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
        message.success($t('m_070'))
        this.setState({
          stopDisable: true
        })
      } else {
        message.error($t('m_069'))
      }
    })
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
              this.checkUrlPath(),
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
