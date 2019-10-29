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
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
    API.getAppList().then(data => {
      if (data.response === 'success') {
        this.setState({
          appList: data.body
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
            ...appList.map(app => ({ v: app.value, t: app.name }))
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
