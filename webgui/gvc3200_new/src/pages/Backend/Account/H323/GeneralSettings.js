import React from 'react'
import { Form, Input, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import { connect } from 'react-redux'
import { getDefaultAcct } from '@/store/actions'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, SelectItem, InputItem, PwInputItem } from '@/components/FormItem'
import DefaultAcctModal from '@/components/DefaultAcctModal'
import { $t } from '@/Intl'

@connect(
  state => ({
    acctStatus: state.acctStatus,
    defaultAcct: state.defaultAcct
  }),
  dispatch => ({
    getDefaultAcct: () => dispatch(getDefaultAcct())
  })
)
@Form.create()
class GeneralSettings extends FormCommon {
  options = getOptions('Account.H323.General')

  state = {
    restActiveAcct: []
  }
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.props.getDefaultAcct()
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
        let restActiveAcct = acctStatus.filter(acct => acct.acctIndex !== 8 && acct.activate === 1)
        if ((values['P25059'] === 0 && defaultAcct === 8) && restActiveAcct.length > 0) {
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
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const GKMode = parseInt(getFieldValue('P25051'))
    const options = this.options
    return (
      <Form>
        {/* 帐号激活 */}
        <CheckboxItem
          {...options['P25059']}
          gfd={gfd}
        />
        {/* 开启GK */}
        <CheckboxItem
          {...options['P25032']}
          gfd={gfd}
        />
        {/* 开启H.460 */}
        <CheckboxItem
          {...options['P25066']}
          gfd={gfd}
        />
        {/* GK发现模式 */}
        <SelectItem
          {...options['P25051']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_110') },
            { v: '1', t: $t('c_139') }
          ]}
        />
        {/* GK地址 */}
        <InputItem
          {...options['P25033']}
          gfd={gfd}
          hide={!GKMode}
        />
        {/* 会场号码 */}
        <InputItem
          {...options['P25034']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* GK认证用户名 */}
        <FormItem {...options['P25035']}>
          {
            gfd('P25035', {
            })(
              <Input autoComplete='username' />
            )
          }
        </FormItem>
        {/* GK认证密码 */}
        <PwInputItem
          {...options['P25036']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 语音信箱接入号 */}
        <InputItem
          {...options['P626']}
          gfd={gfd}

        />
        {/* 注册期限(分钟) */}
        <InputItem
          {...options['P25054']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.range(1, 1440)
            ]
          }}
        />
        {/* H.323本地端口 */}
        <InputItem
          {...options['P25068']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.range(1024, 65535)
            ]
          }}
        />
        {/* 对称RTP */}
        <CheckboxItem
          {...options['P25067']}
          gfd={gfd}
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
