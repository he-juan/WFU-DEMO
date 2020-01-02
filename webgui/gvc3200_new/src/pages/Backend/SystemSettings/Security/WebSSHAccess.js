import React from 'react'
import { Form, Button, Modal, message } from 'antd'
import { getOptions } from '@/template'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, SelectItem, InputItem } from '@/components/FormItem'
import { $t } from '@/Intl'

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
    })
  }

  handleProtocolChange = (v) => {
    const { setFieldsValue } = this.props.form
    if (originPort !== '80' && originPort !== '443') return false
    setFieldsValue({
      P901: v === '0' ? '80' : '443'
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

        if (originProtocal !== curProtocal || originPort !== curPort) {
          if (curProtocal === '0' && curPort === '443') {
            return message.error($t('m_237')) // Port cannot be 443 when  access method is HTTP.
          }
          if (curProtocal === '1' && curPort === '80') {
            return message.error($t('m_238'))
          }
          let hostname = window.location.hostname
          let protocal = curProtocal === '0' ? 'http://' : 'https://'
          let newUrl = protocal + hostname + ':' + curPort

          Modal.info({
            title: $t('m_004') + newUrl,
            okText: $t('b_002'),
            onOk: () => {
              this.submitFormValue(values, 0).then(() => {
                setTimeout(() => {
                  window.location.href = newUrl
                }, 200)
              })
            }
          })
        } else {
          this.submitFormValue(values, 0)
        }
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
          onChange={this.handleProtocolChange}
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
