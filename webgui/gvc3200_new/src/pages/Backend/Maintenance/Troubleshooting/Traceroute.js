import React from 'react'
import { Form, Button, Input, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { InputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { connect } from 'react-redux'
import API from '@/api'
import './Traceroute.less'
import { $t } from '@/Intl'

let traceTimer = null

@connect(
  state => ({
    gateway: state.networkStatus.gateway
  })
)
@Form.create()
class Traceroute extends FormCommon {
  state = {
    trResult: '',
    inputDisable: false,
    startDisable: false,
    stopDisable: true,
    notFirst: false
  }
  options = getOptions('Maintenance.TroubleShooting.Traceroute')
  componentWillUnmount () {
    clearTimeout(traceTimer)
    traceTimer = null
  }
  // 开始
  startTraceroute = (addr) => {
    this.setState({
      inputDisable: true,
      startDisable: true,
      stopDisable: false,
      trResult: '',
      notFirst: true
    })
    API.startTraceroute(addr).then(m => {
      if (m.Response === 'Success') {
        traceTimer = setTimeout(() => {
          this.getTracerouteMsg(0)
        }, 3000)
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

  getTracerouteMsg = (offset) => {
    let { trResult } = this.state
    API.getTracerouteMsg(offset).then(m => {
      const { pingmsg, Response, offset } = m
      if (Response === 'Success') {
        if (pingmsg !== '') {
          trResult += pingmsg
          this.setState({
            trResult: trResult
          })
        }
        traceTimer = setTimeout(() => this.getTracerouteMsg(offset), 3000)
      } else {
        let errmsg = m.Message
        this.setState({
          trResult: errmsg,
          inputDisable: false,
          startDisable: false,
          stopDisable: true
        })
      }
    })
  }

  handleStart = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { targethost } = values
        this.startTraceroute(targethost)
      }
    })
  }

  handleStop = () => {
    API.stopTraceroute().then(m => {
      if (m.Response === 'Success') {
        clearTimeout(traceTimer)
        this.setState({
          inputDisable: false,
          startDisable: false,
          stopDisable: true
        })
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const { gateway } = this.props
    const { trResult, stopDisable, startDisable, inputDisable, notFirst } = this.state
    const options = this.options

    return (
      <Form hideRequiredMark>
        {/* 目标主机 */}
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
        <Input.TextArea className={`result-area ${trResult.length > 0 || notFirst ? 'show' : ''}`} value={trResult} disabled/>
      </Form>
    )
  }
}

export default Traceroute
