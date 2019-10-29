import React from 'react'
import { Form, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { SelectItem, InputItem } from '@/components/FormItem'
import { $t } from '@/Intl'

@Form.create()
class NetworkSettings extends FormCommon {
  constructor (props) {
    super(props)
    this.options = getOptions('Account.SIP.Network')
  }
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.submitFormValue(values, 1)
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options
    return (
      <Form>
        {/* 出局代理 */}
        <InputItem
          gfd={gfd}
          {...options['P48']}
          gfdOptions={{
            rules: [
              this.maxLen(64),
              this.checkaddressPath()
            ]
          }}
        />
        {/* 备用出局代理 */}
        <InputItem
          gfd={gfd}
          {...options['P2333']}
          gfdOptions={{
            rules: [
              this.checkaddressPath()
            ]
          }}
        />
        {/* DNS模式 */}
        <SelectItem
          gfd={gfd}
          {...options['P103']}
          selectOptions={[
            { v: '0', t: 'A Record' },
            { v: '1', t: 'SRV' },
            { v: '2', t: 'NAPTR/SRV' }
          ]}
        />
        {/* NAT检测 */}
        <SelectItem
          gfd={gfd}
          {...options['P52']}
          selectOptions={[
            { v: '0', t: 'NAT NO' },
            { v: '1', t: 'STUN' },
            { v: '2', t: $t('c_095') },
            { v: '3', t: 'UPnP' },
            { v: '4', t: 'Auto' },
            { v: '5', t: 'OpenVPN' },
            { v: '6', t: 'TURN' }
          ]}
        />
        {/* 使用代理 */}
        <InputItem
          gfd={gfd}
          {...options['P197']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        <FormItem label='' >
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default NetworkSettings
