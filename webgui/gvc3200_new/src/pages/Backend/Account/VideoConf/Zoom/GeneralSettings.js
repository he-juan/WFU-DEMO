import React from 'react'
import { Form, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import { connect } from 'react-redux'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, InputItem } from '@/components/FormItem'
import DefaultAcctModal from '@/components/DefaultAcctModal'
import { $t } from '@/Intl'

@connect(
  state => ({
    acctStatus: state.acctStatus,
    defaultAcct: state.defaultAcct
  })
)
@Form.create()
class GeneralSettings extends FormCommon {
  options = getOptions('Account.VideoConf.Zoom.General')
  state = {
    restActiveAcct: []
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
    const { acctStatus, defaultAcct } = this.props
    validateFields((err, values) => {
      if (!err) {
        let restActiveAcct = acctStatus.filter(acct => acct.acctIndex !== 5 && acct.activate === 1)
        if ((values['P1801'] === 0 && defaultAcct === 5) && restActiveAcct.length > 0) {
          this.setState({
            restActiveAcct: restActiveAcct
          })
          return false
        }
        this.submitFormValue(values, 1)
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
          {...options['P1801']}
          gfd={gfd}
        />
        {/* Zoom服务器 */}
        <InputItem
          {...options['P1802']}
          gfd={gfd}
        />
        {/* 显示名称 */}
        <InputItem
          {...options['P1817']}
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