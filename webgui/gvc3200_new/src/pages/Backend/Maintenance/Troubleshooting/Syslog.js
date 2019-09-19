import React from 'react'
import { Form, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { SelectItem, InputItem, CheckboxItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t } from '@/Intl'

@Form.create()
class Syslog extends FormCommon {
  constructor () {
    super()

    this.options = getOptions('Maintenance.TroubleShooting.Syslog')
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
  }
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        this.submitFormValue(values)
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const P208 = getFieldValue('P208')
    const options = this.options

    return (
      <Form>
        {/* 系统日志协议 */}
        <SelectItem
          gfd={gfd}
          {...options['P8402']}
          selectOptions={[
            { v: '0', t: 'UDP' },
            { v: '1', t: 'SSL/TLS' }
          ]}
        />
        {/* 系统日志服务器地址 */}
        <InputItem
          gfd={gfd}
          {...options['P207']}
          gfdOptions={{
            rules: [
              this.maxLen(128),
              this.checkaddressPath()
            ]
          }}
        />
        {/* 系统日志级别 */}
        <SelectItem
          gfd={gfd}
          {...options['P208']}
          selectOptions={[
            { v: '0', t: 'None' },
            { v: '1', t: 'Debug' },
            { v: '2', t: 'Info' },
            { v: '3', t: 'Warning' },
            { v: '4', t: 'Error' }
          ]}
        />
        {/* 发送SIP日志 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1387']}
          hide={P208 !== '1'}
        />
        {/* 系统日志关键词过滤 */}
        <InputItem
          gfd={gfd}
          {...options['P22129']}
        />
        {/* H.323信令日志级别 */}
        <SelectItem
          gfd={gfd}
          {...options['P25055']}
          selectOptions={[
            { v: '0', t: $t('c_070') },
            { v: '1', t: '1' },
            { v: '2', t: '2' },
            { v: '3', t: '3' },
            { v: '4', t: '4' },
            { v: '5', t: '5' },
            { v: '6', t: '6' },
            { v: '7', t: '7' },
            { v: '8', t: '8' },
            { v: '9', t: '9' },
            { v: '10', t: '10' }
          ]}
        />
        <FormItem label=''>
          <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Syslog
