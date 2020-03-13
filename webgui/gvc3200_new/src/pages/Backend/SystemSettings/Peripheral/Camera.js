import React from 'react'
import FormCommon from '@/components/FormCommon'
import FormItem, { SelectItem, SliderItem } from '@/components/FormItem'
import { Form, Button, message } from 'antd'
import { getOptions } from '@/template'
import { $t } from '@/Intl'
import API from '@/api'

@Form.create()
class Camera extends FormCommon {
  options = getOptions('System.Peripheral.Camera')

  state = {
    presetInfo: []
  }

  componentDidMount () {
    const { getFieldsValue, setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      const fileds = getFieldsValue()
      Object.keys(fileds).length > 0 && setFieldsValue(data)
    })
    this.getPresetInfo()
  }

  // 获取预置位列表
  getPresetInfo = () => {
    API.getPresetInfo().then(res => {
      if (res.Response === 'success') {
        this.setState({ presetInfo: res.Data })
      } else {
        message.error(res.Message || $t('m_071'))
      }
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
    const { presetInfo } = this.state

    const positions = [
      { v: '0', t: $t('c_022') },
      { v: '100', t: $t('c_023') }
    ]
    presetInfo.forEach(item => {
      const { position, name } = item
      if (+position < 24) {
        const s = (+position + 1).toString()
        positions.push({ v: s, t: name || $t('c_274') + s })
      }
    })

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
          selectOptions={positions}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Camera
