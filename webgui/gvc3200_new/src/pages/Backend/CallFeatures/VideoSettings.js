import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button } from 'antd'
import FormItem, { SelectItem, CheckboxItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t } from '@/Intl'

@Form.create()
class VideoSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('CallFeature.VideoSettings')
  }
  componentDidMount () {
    const { setFieldsValue } = this.props.form
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
        {/* 自动开始视频 */}
        <CheckboxItem
          {...options['P25023']}
          gfd={gfd}
        />
        {/* 视频显示模式 */}
        <SelectItem
          {...options['P921']}
          gfd={gfd}
          selectOptions= {[
            { v: '0', t: $t('c_162') },
            { v: '1', t: $t('c_163') },
            { v: '2', t: $t('c_164') }
          ]}
        />
        {/* 触发视频解码跳帧 */}
        <CheckboxItem
          {...options['P22008']}
          gfd={gfd}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default VideoSettings
