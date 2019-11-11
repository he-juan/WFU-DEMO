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

    this.options = Object.assign(getOptions('System.Security.WebSSHAccess'), {
      Prssht_cfg_switch: { p: 'Prssht_cfg_switch' }
    })
    this.mRsshtcfgswitch = '0' // 远程诊断是否开启
    // 获取当前组件中 重启配置项
    this.rebootOptions = {}
  }

  // componentDidMount
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      this.mRsshtcfgswitch = data.Prssht_cfg_switch || '0'
      delete data.Prssht_cfg_switch
      setFieldsValue(data)
      // 赋值
      originProtocal = data['P900'] || 0 // 访问方式
      originPort = data['P901'] // 端口号
      // 保存 初始值
      for (const key in this.options) {
        if (this.options[key].reboot && !this.options[key].deny) {
          this.rebootOptions[key] = data[key]
        }
      }
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields, setFieldsValue } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let { P276, P900: curProtocal, P901: curPort } = values
        // 远程诊断已开启
        if (this.mRsshtcfgswitch === '1') {
          // 不能禁止ssh访问
          if (+P276 === 1) {
            return Modal.info({
              title: $t('m_211'),
              okText: $t('b_002'),
              onOk () {
                setFieldsValue({ P276: '0' })
              }
            })
          }
          // 禁止修改访问方法和端口
          if (originProtocal !== curProtocal || originPort !== curPort) {
            return Modal.info({
              title: $t('m_212'),
              okText: $t('b_002'),
              onOk () {
                setFieldsValue({
                  P900: originProtocal,
                  P901: originPort
                })
              }
            })
          }
        }
        this.submitFormValue(values, 0).then(() => {
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
