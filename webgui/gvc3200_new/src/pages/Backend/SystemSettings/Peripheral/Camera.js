import React from 'react'
import FormCommon from '@/components/FormCommon'
import FormItem, { SelectItem, SliderItem } from '@/components/FormItem'
import { Form, Button } from 'antd'
import { getOptions } from '@/template'
import { $t } from '@/Intl'

@Form.create()
class Camera extends FormCommon {
  options = getOptions('System.Peripheral.Camera')

  componentDidMount () {
    const { getFieldsValue, setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      const fileds = getFieldsValue()
      Object.keys(fileds).length > 0 && setFieldsValue(data)
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
        {/* 移动速度 */}
        <SliderItem
          gfd={gfd}
          {...options['P25029']}
          min={1}
          max={16}
        />
        {/* 初始化位置 */}
        <SelectItem
          gfd={gfd}
          {...options['P25030']}
          selectOptions={[
            { v: '0', t: $t('c_022') },
            { v: '1', t: $t('c_023') }
          ]}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Camera
