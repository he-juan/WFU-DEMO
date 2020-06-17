import React from 'react'
import { Form, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { SelectItem } from '@/components/FormItem'
import { $t } from '@/Intl'

@Form.create()
class CallSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('Account.IPVT.Call')
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
        {/* 空闲时自动接听 */}
        <SelectItem
          {...options['P425']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_046') },
            { v: '1', t: $t('c_045') }
          ]}
        />
        {/* 常用布局模式 */}
        <SelectItem
          {...options['P29170']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_120') },
            { v: '1', t: $t('c_121') },
            { v: '2', t: $t('c_122') },
            { v: '3', t: $t('c_123') }
          ]}
        />
        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default CallSettings
