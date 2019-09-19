import React from 'react'
import { Form, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, SelectItem, InputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t } from '@/Intl'

@Form.create()
class CallFeatures extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('CallFeature.CallFeature')
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
        <h4 className='bak-sub-title'>{$t('c_101')}</h4>
        {/* 无呼叫等待音 */}
        <CheckboxItem
          {...options['P186']}
          gfd={gfd}
        />
        {/* 禁用勿扰模式提醒音 */}
        <CheckboxItem
          {...options['P1486']}
          gfd={gfd}
        />
        {/* 接通时自动静音 */}
        <SelectItem
          {...options['P29607']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_066') },
            { v: '1', t: $t('c_140') },
            { v: '2', t: $t('c_141') },
            { v: '3', t: $t('c_142') }
          ]}
        />

        <h4 className='bak-sub-title'>{$t('c_143')}</h4>
        {/* 将SIP URI中的"#"转义成%23 */}
        <CheckboxItem
          {...options['P1406']}
          gfd={gfd}
        />
        {/* 禁止通话中DTMF显示 */}
        <CheckboxItem
          {...options['P338']}
          gfd={gfd}
        />
        {/* 过滤字符集 */}
        <InputItem
          {...options['P22012']}
          gfd={gfd}
        />
        {/* 禁止呼叫等待 */}
        <CheckboxItem
          {...options['P91']}
          gfd={gfd}
        />
        {/* 禁用IP拨打模式 */}
        <CheckboxItem
          {...options['P277']}
          gfd={gfd}
        />
        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default CallFeatures
