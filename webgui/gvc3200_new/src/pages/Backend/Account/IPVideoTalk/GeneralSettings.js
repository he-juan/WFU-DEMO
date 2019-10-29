import React from 'react'
import { Form, Button } from 'antd'
import { connect } from 'react-redux'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, SelectItem, InputItem } from '@/components/FormItem'
import DefaultAcctModal from '@/components/DefaultAcctModal'
import { getIPVTExist } from '@/store/actions'
import { $t } from '@/Intl'
import { rebootNotify } from '@/utils/tools'

@connect(
  state => ({
    IPVTExist: state.IPVTExist,
    acctStatus: state.acctStatus,
    defaultAcct: state.defaultAcct
  }),
  dispatch => ({
    getIPVTExist: () => dispatch(getIPVTExist())
  })
)
@Form.create()
class GeneralSettings extends FormCommon {
  options = getOptions('Account.IPVT.General')
  // 获取当前组件中 重启配置项
  rebootOptions = {}

  state = {
    restActiveAcct: []
  }
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
      // 保存 初始值
      for (const key in this.options) {
        if (this.options[key].reboot) {
          this.rebootOptions[key] = data[key]
        }
      }
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    const { acctStatus, defaultAcct } = this.props
    validateFields((err, values) => {
      if (!err) {
        let restActiveAcct = acctStatus.filter(acct => acct.acctIndex !== 1 && acct.activate === 1)
        if ((values['P7059'] === 0 || values['P401'] === 0) && defaultAcct === 1 && restActiveAcct.length > 0) {
          this.setState({
            restActiveAcct: restActiveAcct
          })
          return false
        }

        this.submitFormValue(values, 1).then(msgs => {
          if (msgs.Response === 'Success') {
            // 判断是否 弹出 重启提示弹窗
            rebootNotify({ oldOptions: this.rebootOptions, newOptions: values }, () => {
              for (const key in this.rebootOptions) {
                this.rebootOptions[key] = values[key].toString()
              }
            })
            this.props.getIPVTExist()
          }
        })
      }
    })
  }
  render () {
    const { restActiveAcct } = this.state
    const { getFieldDecorator: gfd } = this.props.form
    const { IPVTExist } = this.props
    const options = this.options

    return (
      <Form >
        {/* 开启IPVideoTalk服务 */}
        <CheckboxItem
          {...options['P7059']}
          gfd={gfd}
        />
        {/* 帐号激活 */}
        <CheckboxItem
          {...options['P401']}
          gfd={gfd}
          hide={IPVTExist !== '1'}
        />
        {/* 显示名称 */}
        <InputItem
          {...options['P407']}
          gfd={gfd}
          hide={IPVTExist !== '1'}
        />
        {/* SIP传输 */}
        <SelectItem
          {...options['P448']}
          gfd={gfd}
          hide={IPVTExist !== '1'}
          selectOptions={[
            { v: '1', t: 'TCP' },
            { v: '2', t: 'TLS' }
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
