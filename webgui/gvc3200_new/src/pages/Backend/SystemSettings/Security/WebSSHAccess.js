import React from 'react'
import { Form, Button, Modal } from 'antd'
import { getOptions } from '@/template'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, SelectItem, InputItem } from '@/components/FormItem'
import { $t } from '@/Intl'
import { rebootNotify } from '@/utils/tools'

// 存储获取到的 Protocal Port
let originProtocal = 0
let originPort = 80

// antd form.create
@Form.create()
class WebSSHAccess extends FormCommon {
  // constructor
  constructor (props) {
    super(props)

    this.options = getOptions('System.Security.WebSSHAccess')
    // 获取当前组件中 重启配置项
    this.rebootOptions = {}
  }

  // componentDidMount
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
      // 赋值
      originProtocal = data['P900']
      originPort = data['P901']
      // 保存 初始值
      for (const key in this.options) {
        if (this.options[key].reboot) {
          this.rebootOptions[key] = data[key]
        }
      }
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        this.submitFormValue(values, 0).then(() => {
          let { P900: curProtocal, P901: curPort } = values
          if (!originProtocal) {
            originProtocal = 0
          }
          if (originProtocal !== curProtocal || originPort !== curPort) {
            let url = window.location.href
            let ip = url.split('/')[2]
            let pos = ip.lastIndexOf(':')
            if (pos !== -1 && ip.endsWith(originPort)) {
              ip = ip.substring(0, pos)
            }
            let protocal = curProtocal === 0 ? 'http://' : 'https://'
            let newUrl = protocal + ip + ':' + curPort

            Modal.info({
              content: $t('m_004') + newUrl,
              okText: $t('b_002'),
              onOk () {
                window.location.href = newUrl
              }
            })
          } else {
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

  // render
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form hideRequiredMark>
        {/* 禁止SSH访问 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P276']}
        />
        {/* 访问方式 */}
        <SelectItem
          gfd={gfd}
          {...options['P900']}
          selectOptions={[
            { v: '0', t: 'HTTP' },
            { v: '1', t: 'HTTPS' }
          ]}
        />
        {/* 端口号 */}
        <InputItem
          gfd={gfd}
          {...options['P901']}
          gfdOptions={{
            rules: [
              this.required(),
              this.digits(),
              this.range(1, 65535)
            ]
          }}
        />
        <FormItem label=''>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default WebSSHAccess
