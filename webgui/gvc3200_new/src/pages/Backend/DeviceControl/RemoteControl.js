import React from 'react'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem } from '@/components/FormItem'
import { Form, Button } from 'antd'
import { getOptions } from '@/template'
import { $t } from '@/Intl'

@Form.create()
class RemoteControl extends FormCommon {
  options = getOptions('DeviceControl.RemoteControl')
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
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
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        {/* 禁止手机遥控器连接 */}
        <CheckboxItem
          {...options['P25022']}
          gfd={gfd}
        />
        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default RemoteControl
