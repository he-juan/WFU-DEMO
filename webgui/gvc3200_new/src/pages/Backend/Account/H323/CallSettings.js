import React from 'react'
import { Form, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, SelectItem } from '@/components/FormItem'
import { $t } from '@/Intl'

@Form.create()
class CallSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('Account.H323.Call')
  }
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    // 表单初始化
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
        {/* '自动应答' */}
        <SelectItem
          {...options['P25048']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_046') },
            { v: '1', t: $t('c_045') }
          ]}
        />
        {/* 开启H225心跳间隔 */}
        <CheckboxItem
          {...options['P25058']}
          gfd={gfd}
        />
        {/* 开启H245心跳间隔 */}
        <CheckboxItem
          {...options['P25057']}
          gfd={gfd}
        />
        {/* 开启RTDR */}
        <CheckboxItem
          {...options['P25060']}
          gfd={gfd}
        />
        {/* 常用布局模式 */}
        <SelectItem
          {...options['P25073']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_120') },
            { v: '1', t: $t('c_121') },
            { v: '2', t: $t('c_122') },
            { v: '3', t: $t('c_123') }
          ]}
        />
        <FormItem >
          <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default CallSettings
