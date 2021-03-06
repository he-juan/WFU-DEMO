import React from 'react'
import { Form, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import { connect } from 'react-redux'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, InputItem } from '@/components/FormItem'
import DefaultAcctModal from '@/components/DefaultAcctModal'
import { getAcctInfo } from '@/store/actions'
import { $t } from '@/Intl'

@connect(
  state => ({
    acctStatus: state.acctStatus,
    defaultAcct: state.defaultAcct
  }),
  dispatch => ({
    getAcctInfo: () => dispatch(getAcctInfo())
  })
)
@Form.create()
class GeneralSettings extends FormCommon {
  options = getOptions('Account.VideoConf.BlueJeans.General')

  state = {
    restActiveAcct: []
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.props.getAcctInfo()
    this.initFormValue(this.options).then(data => {
      data['P507'] = data['P507'] || 'BlueJeans'
      setFieldsValue(data)
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields, setFieldsValue } = this.props.form
    const { acctStatus, defaultAcct } = this.props
    validateFields((err, values) => {
      if (!err) {
        let restActiveAcct = acctStatus.filter(acct => acct.acctIndex !== 2 && acct.activate === 1)
        if ((values['P501'] === 0 && defaultAcct === 2) && restActiveAcct.length > 0) {
          this.setState({
            restActiveAcct: restActiveAcct
          })
          return false
        }
        this.submitFormValue(values, 1).then(res => {
          values['P507'] === '' && (setFieldsValue({ 'P507': 'BlueJeans' }))
        })
      }
    })
  }

  render () {
    const { restActiveAcct } = this.state
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options
    return (
      <Form>
        {/* 帐号激活 */}
        <CheckboxItem
          {...options['P501']}
          gfd={gfd}
        />
        {/* 显示名称 */}
        <InputItem
          {...options['P507']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        <FormItem label='' >
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
        <DefaultAcctModal restActiveAcct={restActiveAcct} cb={() => this.handleSubmit()} onCancel={() => this.setState({ restActiveAcct: [] })}/>
      </Form>
    )
  }
}

export default GeneralSettings
