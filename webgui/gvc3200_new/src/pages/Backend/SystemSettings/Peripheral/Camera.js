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
    const { presetInfo } = this.state

    validateFields((err, values) => {
      if (!err) {
        // 需要将每个预置位的 Pcamera_boot_position 传递过去 系统默认位置 0,0,0,591105
        let Pcamera_boot_position = '0,0,0,591105' // 系统默认位置，当前固定 后期看安卓端怎么处理
        if (+values.P25030 !== 0) {
          const position = +values.P25030 < 100 ? +values.P25030 - 1 : 100
          Pcamera_boot_position = presetInfo.filter(item => +item.position === position)[0].cmrparam
        }
        this.submitFormValue(Object.assign({}, values, { Pcamera_boot_position }))
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
