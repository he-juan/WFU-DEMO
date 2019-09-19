import React from 'react'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, InputItem, PwInputItem } from '@/components/FormItem'
import { Form, Input, Button } from 'antd'
import { getOptions } from '@/template'
import { $t } from '@/Intl'
import { rebootNotify } from '@/utils/tools'

@Form.create()
class TR069 extends FormCommon {
  constructor () {
    super()

    this.options = getOptions('System.TR069')
    // 获取当前组件中 重启配置项
    this.rebootOptions = {}
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then((data) => {
      setFieldsValue(data)
      // 保存 初始值
      for (const key in this.options) {
        if (this.options[key].reboot) {
          this.rebootOptions[key] = data[key]
        }
      }
    })
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        this.submitFormValue(values).then(msgs => {
          if (msgs.Response === 'Success') {
            // 判断是否 弹出 重启提示弹窗
            rebootNotify({ oldOptions: this.rebootOptions, newOptions: values }, () => {
              for (const key in this.rebootOptions) {
                this.rebootOptions[key] = values[key].toString()
              }
            })
          }
        })
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        {/* 打开TR069 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1409']}
        />
        {/* ACS源 */}
        <InputItem
          gfd={gfd}
          {...options['P4503']}
          gfdOptions={{
            rules: [
              this.checkaddressPath()
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
              this.digits()
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
              this.maxLen(64),
              this.range(0, 65535)
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
          <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default TR069
