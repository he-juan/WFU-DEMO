import React from 'react'
import { Form, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { SelectItem, InputItem, CheckboxItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t, $fm } from '@/Intl'

function getLength (val) {
  var str = String(val)
  var bytesCount = 0
  for (var i = 0, n = str.length; i < n; i++) {
    var c = str.charCodeAt(i)
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      bytesCount += 1
    } else {
      bytesCount += 2
    }
  }
  return bytesCount
}

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

  keyValidator = () => {
    return {
      validator: (data, value, callback) => {
        let keys = value.split(',')
        if (keys.length > 5) {
          return callback($fm('m_239'))
        }
        for (let i = 0; i < keys.length; i++) {
          let byteLen = getLength(keys[i])
          if (byteLen > 50) {
            return callback($fm('m_240'))
          }
        }
        callback()
      }
    }
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
          gfdOptions={{
            rules: [
              this.keyValidator()
            ]
          }}
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
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Syslog
