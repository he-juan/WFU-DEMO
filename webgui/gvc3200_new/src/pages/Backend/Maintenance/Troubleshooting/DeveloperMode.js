import React from 'react'
import { Form, Button, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import API from '@/api'
import { $t } from '@/Intl'

@Form.create()
class DeveloperMode extends FormCommon {
  options = getOptions('Maintenance.TroubleShooting.DeveloperMode')

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    API.getDevelopmode().then(data => {
      setFieldsValue({
        devMode: data.devestate
      })
    })
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        API.setDevelopmode(values.devMode).then(m => {
          if (m.response === 'success') {
            message.success($t('m_001'))
          } else {
            message.error($t('m_002'))
          }
        })
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        <CheckboxItem
          {...options['devMode']}
          gfd={gfd}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default DeveloperMode
