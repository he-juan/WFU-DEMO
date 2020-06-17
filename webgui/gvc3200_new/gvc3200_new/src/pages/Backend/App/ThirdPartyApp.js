import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button } from 'antd'
import FormItem, { SelectItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import API from '@/api'
import { $t } from '@/Intl'

@Form.create()
class ThirdPartyApp extends FormCommon {
  options= getOptions('App.ThirdPartyApp')

  state = {
    appList: []
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form

    Promise.all([
      API.getAppList(),
      this.initFormValue(this.options)
    ]).then(result => {
      const [msgs, data] = result
      if (msgs.res === 'success') {
        this.setState({
          appList: msgs.list
        }, () => {
          setFieldsValue(data)
        })
      }
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        this.submitFormValue(values)
      }
    })
  }

  render () {
    const { appList } = this.state
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        <SelectItem
          gfd={gfd}
          {...options['Pconfig_user_app']}
          selectOptions={[
            { v: '', t: $t('c_328') },
            ...appList.map(app => ({ v: app.value, t: app.label }))
          ]}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default ThirdPartyApp
