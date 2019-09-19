import React from 'react'
import { Form, Button, Input } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { InputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import API from '@/api'
import './Traceroute.less'
import { $t } from '@/Intl'

@Form.create()
class NSLookup extends FormCommon {
  state = {
    nsResult: '',
    inputDisable: false,
    startDisable: false,
    notFirst: false
  }
  options = getOptions('Maintenance.TroubleShooting.NSLookup')
  handleStart = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { targethost } = values
        this.startNSLookup(targethost)
      }
    })
  }
  startNSLookup = (addr) => {
    this.setState({
      nsResult: '',
      startDisable: true,
      inputDisable: true,
      notFirst: true
    })
    API.nsLookup(addr).then(data => {
      this.setState({
        nsResult: data,
        inputDisable: false,
        startDisable: false
      })
    })
  }
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const { nsResult, startDisable, inputDisable, notFirst } = this.state
    const options = this.options

    return (
      <Form hideRequiredMark>
        <InputItem
          {...options['addr']}
          gfd={gfd}
          disabled={inputDisable}
          gfdOptions={{
            rules: [
              this.checkUrlPath(),
              this.required()
            ]
          }}
        />
        <FormItem>
          <Button type='primary' onClick={this.handleStart} disabled={startDisable}>{$t('b_025')}</Button>
        </FormItem>
        <Input.TextArea className={`result-area ${nsResult.length > 0 || notFirst ? 'show' : ''}`} value={nsResult} disabled/>
      </Form>
    )
  }
}

export default NSLookup
