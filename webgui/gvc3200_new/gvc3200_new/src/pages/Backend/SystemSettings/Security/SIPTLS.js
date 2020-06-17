import React from 'react'
import { Form, Input, Button, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { PwInputItem, SelectItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t } from '@/Intl'

// antd form.create
@Form.create()
class SIPTLS extends FormCommon {
  // constructor
  constructor (props) {
    super(props)

    this.options = getOptions('System.Security.SIPTLS')
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      if (!data['P22293']) data['P22293'] = '11'
      if (!data['P22294']) data['P22294'] = '99'
      setFieldsValue(data)
    })
  }

  // 提交数据
  handleSubmit = () => {
    const { validateFields, setFieldsValue } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        if (values.P22294 < values.P22293) {
          return message.error($t('m_129'))
        }
        this.submitFormValue(values, 1).then(data => {
          setFieldsValue({
            P279: '',
            P280: '',
            P281: ''
          })
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
        {/* 最小TLS版本 */}
        <SelectItem
          gfd={gfd}
          {...options['P22293']}
          selectOptions={[
            { v: '10', t: '1.0' },
            { v: '11', t: '1.1' },
            { v: '12', t: '1.2' }
          ]}
        />
        {/* 最大TLS版本 */}
        <SelectItem
          gfd={gfd}
          {...options['P22294']}
          selectOptions={[
            { v: '10', t: '1.0' },
            { v: '11', t: '1.1' },
            { v: '12', t: '1.2' },
            { v: '99', t: $t('c_297') }
          ]}
        />
        {/* SIP TLS验证 */}
        <FormItem {...options['P280']}>
          {
            gfd('P280')(
              <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }}/>
            )
          }
        </FormItem>
        {/* SIP TLS私钥 */}
        <FormItem {...options['P279']}>
          {
            gfd('P279')(
              <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }}/>
            )
          }
        </FormItem>
        {/* SIP TLS私钥密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P281']}
        />
        <FormItem label=''>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default SIPTLS
