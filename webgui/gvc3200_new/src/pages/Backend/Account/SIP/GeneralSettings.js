import React from 'react'
import { Form, Input, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import { connect } from 'react-redux'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, SelectItem, InputItem, PwInputItem } from '@/components/FormItem'
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
  options = getOptions('Account.SIP.General')

  state = {
    restActiveAcct: []
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.props.getAcctInfo()
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form
    const { acctStatus, defaultAcct } = this.props
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 当当前账号被取消激活且当前账号为默认账号， 并且还有其他账号为激活状态时, 弹出选择框设置其他账号为默认账号
        let restActiveAcct = acctStatus.filter(acct => acct.acctIndex !== 0 && acct.activate === 1)
        if ((values['P271'] === 0 && defaultAcct === 0) && restActiveAcct.length > 0) {
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
          gfd={gfd}
          {...options['P271']}
        />
        {/* 帐号名称 */}
        <InputItem
          gfd={gfd}
          {...options['P270']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* SIP 服务器 */}
        <InputItem
          gfd={gfd}
          {...options['P47']}
          gfdOptions={{
            rules: [
              // this.checkaddressPath()
            ]
          }}
        />
        {/* 备用SIP服务器 */}
        <InputItem
          gfd={gfd}
          {...options['P602']}
          gfdOptions={{
            rules: [
              // this.checkaddressPath()
            ]
          }}
        />
        {/* 第三SIP服务器 */}
        <InputItem
          gfd={gfd}
          {...options['P1702']}
          gfdOptions={{
            rules: [
              // this.checkaddressPath()
            ]
          }}
        />
        {/* SIP用户ID */}
        <InputItem
          gfd={gfd}
          {...options['P35']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* SIP认证ID */}
        <FormItem {...options['P36']}>
          {
            gfd('P36', {
              rules: [
                this.maxLen(64)
              ]
            })(
              <Input autoComplete='username' />
            )
          }
        </FormItem>
        {/* SIP认证密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P34']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 显示名称 */}
        <InputItem
          gfd={gfd}
          {...options['P3']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 语音信箱接入号 */}
        <InputItem
          gfd={gfd}
          {...options['P33']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 电话 URI */}
        <SelectItem
          gfd={gfd}
          {...options['P63']}
          selectOptions={[
            { v: '0', t: $t('c_066') },
            { v: '1', t: $t('c_093') },
            { v: '2', t: $t('c_094') }
          ]}
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
