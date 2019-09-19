import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button } from 'antd'
import FormItem, { SelectItem, InputItem, PwInputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t } from '@/Intl'

@Form.create()
class WifiAdd extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('Network.WIFI.Add')
  }
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
  }

  // 动态的校验
  pwLengthCheck = (P7830) => {
    if (P7830 === '2') {
      return {
        validator: (data, value, callback) => {
          if (value && value.length < 8) {
            callback($t('m_092'))
          } else {
            callback()
          }
        }
      }
    } else if (P7830 === '1') {
      return {
        validator: (data, value, callback) => {
          if (value && [5, 10, 13, 26, 16, 32].indexOf(value.length) === -1) {
            callback($t('m_092'))
          } else {
            callback()
          }
        }
      }
    } else {
      return {}
    }
  }

  handleModeChange = () => {
    this.props.form.setFieldsValue({ P7814: '' })
  }

  // 提交表单
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
    const options = this.options
    const P7830 = getFieldValue('P7830')
    return (
      <Form>
        {/* ESSID */}
        <InputItem
          {...options['P7812']}
          gfd={gfd}
        />
        {/* 隐藏SSID的安全模式 */}
        <SelectItem
          {...options['P7830']}
          gfd={gfd}
          onChange={() => this.handleModeChange()}
          selectOptions={[
            { v: '0', t: $t('c_065') },
            { v: '1', t: 'WEP' },
            { v: '2', t: 'WPA/WPA2 PSK' }
          ]}
        />
        {/* 密码 */}
        <PwInputItem
          {...options['P7814']}
          gfd={gfd}
          hide={P7830 === '0' || P7830 === ''}
          gfdOptions={{
            rules: [
              this.pwLengthCheck(P7830)
            ]
          }}
        />
        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default WifiAdd
