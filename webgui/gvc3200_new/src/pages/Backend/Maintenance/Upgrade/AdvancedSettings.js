import React from 'react'
import Cookie from 'js-cookie'
import { Form, Button, Modal } from 'antd'
import { getOptions } from '@/template'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, SelectItem } from '@/components/FormItem'
import { resetres as ApiResetres } from '@/api/api.maintenance'
import { $t } from '@/Intl'
import { rebootNotify } from '@/utils/tools'

@Form.create()
class AdvancedSettings extends FormCommon {
  // constructor
  constructor (props) {
    super(props)

    this.options = getOptions('Maintenance.Upgrade.AdvancedSettings')
    // 获取当前组件中 重启配置项
    this.rebootOptions = {}
  }

  // componentDidMount
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
      // 保存 初始值
      for (const key in this.options) {
        if (this.options[key].reboot && !this.options[key].deny) {
          this.rebootOptions[key] = data[key]
        }
      }
    })
  }

  // 复位键
  handleClickReset = () => {
    Modal.confirm({
      title: $t('c_042'),
      content: $t('m_066'),
      okText: $t('b_002'),
      cancelText: $t('b_005'),
      onOk () {
        ApiResetres('0').then((msgs) => {
          if (msgs.Response === 'Success') {
            Cookie.set('resetreboot', '1', { path: '/', expires: 10 })
          }
        })
      }
    })
  }

  // 提交数据
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

  // render
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        {/* 禁用SIP NOTIFY认证 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P4428']}
        />
        {/* 验证服务器证书 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P22030']}
        />
        {/* 启动mDNS服务器设置 */}
        <SelectItem
          gfd={gfd}
          onChange={this.handleChangeAutoup}
          {...options['P1407']}
          selectOptions={[
            { v: '0', t: $t('c_066') },
            { v: '1', t: $t('c_067') },
            { v: '2', t: $t('c_068') }
          ]}
        />
        {/* 启动DHCP选项43、160和66服务器设置 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P145']}
        />
        {/* 额外的DHCP选项设置 */}
        <SelectItem
          gfd={gfd}
          onChange={this.handleChangeAutoup}
          {...options['P8337']}
          selectOptions={[
            { v: '0', t: $t('c_065') },
            { v: '2', t: 'Option 160' }
          ]}
        />
        {/* 启动DHCP选项120服务器设置 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1411']}
        />
        {/* 3CX自动设定 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1414']}
        />
        {/* 恢复出厂设置 */}
        <FormItem {...options['reset']}>
          <Button type='primary' style={{ width: 100 }} onClick={this.handleClickReset}>{$t('b_022')}</Button>
        </FormItem>

        <FormItem label=''>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default AdvancedSettings
