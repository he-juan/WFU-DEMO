import React from 'react'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, InputItem, PwInputItem } from '@/components/FormItem'
import { Form, Input, Button } from 'antd'
import { getOptions } from '@/template'
import { $t, $fm } from '@/Intl'

@Form.create()
class TR069 extends FormCommon {
  constructor () {
    super()

    this.options = getOptions('System.TR069')
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.options['P40'] = { p: 'P40' } // SIP > SIP > 本地SIP端口
    this.options['P1813'] = { p: 'P1813' } // 视频会议服务平台 > Zoom > SIP > 本地SIP端口

    this.initFormValue(this.options).then((data) => {
      setFieldsValue(data)
    })
  }

  // 定制验证acs请求端口
  validatePort = () => {
    return {
      validator: (data, value, callback) => {
        const ports = [this.INIT_VALUE['P40'], this.INIT_VALUE['P1813']]
        const index = ports.indexOf(value)
        if (!!value && index > -1) {
          callback($fm('m_258', { s: ports[index] })) // s 已经被使用
        } else {
          callback()
        }
      }
    }
  }

  // 验证估计服务器网址非数字
  validateUrl = () => {
    return {
      validator: (data, value, callback) => {
        if (value && /^\d+$/.test(value)) {
          callback($fm('m_072'))
        } else {
          callback()
        }
      }
    }
  }

  // 开启改变
  handleEnableChange = (e) => {
    const { getFieldValue, setFields } = this.props.form
    const P4503 = getFieldValue('P4503')
    if (!e.target.checked && !P4503) {
      setFields({
        P4503: {
          value: '',
          errors: ''
        }
      })
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
    const options = this.options
    const P1409 = getFieldValue('P1409')

    return (
      <Form hideRequiredMark>
        {/* 打开TR069 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1409']}
          onChange={this.handleEnableChange}
        />
        {/* ACS源 */}
        <InputItem
          gfd={gfd}
          {...options['P4503']}
          gfdOptions={{
            rules: [
              { required: P1409 === 1, message: $fm('m_003') },
              /// this.checkaddressPath()
              this.validateUrl()
            ]
          }}
        />
        {/* ACS源 */}
        <InputItem
          gfd={gfd}
          {...options['P4504']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* ACS密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P4505']}
        />
        {/* 开启定时连接 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P4506']}
        />
        {/* 定时连接间隔(秒) */}
        <InputItem
          gfd={gfd}
          {...options['P4507']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(1, 4294967295)
            ]
          }}
        />
        {/* ACS连接请求用户名 */}
        <InputItem
          gfd={gfd}
          {...options['P4511']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* ACS连接请求密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P4512']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* ACS连接请求端口 */}
        <InputItem
          gfd={gfd}
          {...options['P4518']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(0, 65535),
              this.validatePort()
            ]
          }}
        />
        {/* CPE证书 */}
        <FormItem {...options['P8220']}>
          {
            gfd('P8220')(
              <Input.TextArea rows={8}/>
            )
          }
        </FormItem>
        {/* CPE证书密码 */}
        <FormItem {...options['P8221']}>
          {
            gfd('P8221')(
              <Input.TextArea rows={8}/>
            )
          }
        </FormItem>
        <FormItem label=''>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default TR069
