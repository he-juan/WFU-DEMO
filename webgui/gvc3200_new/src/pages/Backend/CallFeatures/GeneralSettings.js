import React from 'react'
import { Form, Input, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, InputItem, PwInputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t, $fm } from '@/Intl'

@Form.create()
class GeneralSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('CallFeature.General')
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
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
        {/* 本地RTP端口 */}
        <InputItem
          {...options['P39']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(1024, 65400),
              {
                validator: (rule, value, callback) => {
                  callback(parseInt(value) % 2 !== 0 || value === '' ? $fm('m_087') : undefined)
                }
              }
            ]
          }}
        />
        {/* 使用随机端口 */}
        <CheckboxItem
          {...options['P78']}
          gfd={gfd}
        />
        {/* 心跳间隔 */}
        <InputItem
          {...options['P84']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(10, 160)
            ]
          }}
        />
        {/* TURN服务器 */}
        <InputItem
          {...options['P76']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen(32),
              this.checkUrlPath()
            ]
          }}
        />
        {/* TURN服务器用户名 */}
        <FormItem {...options['P22042']}>
          {
            gfd('P22042', {
              rules: [
                this.maxLen(32)
              ]
            })(
              <Input autoComplete='username' />
            )
          }
        </FormItem>
        {/* TURN服务器密码 */}
        <PwInputItem
          {...options['P22043']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen(128)
            ]
          }}
        />
        {/* 使用NAT IP */}
        <InputItem
          {...options['P101']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen(32),
              this.checkIPAddress()
            ]
          }}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default GeneralSettings
