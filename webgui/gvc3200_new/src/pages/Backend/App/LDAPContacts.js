import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button, message } from 'antd'
import { connect } from 'react-redux'
import FormItem, { SelectItem, InputItem, CheckboxItem, PwInputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t } from '@/Intl'

@connect(
  state => ({
    IPVTExist: state.IPVTExist
  })
)
@Form.create()
class LDAPContacts extends FormCommon {
  constructor (props) {
    super(props)
    this.state = {
      acctsOptions: []
    }
    this.options = getOptions('App.LDAPContacts')
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
        const { P8021, P8031, P8032, P8028, P8029 } = values
        // LDAP名字、号码属性不能同时为空
        if (P8028 === '' && P8029 === '') {
          return message.error($t('m_228'))
        }

        values.P8021 = P8021 || '389' // 端口号默认389
        values.P8031 = P8031 || '50' // 最大返回条数 默认50
        values.P8032 = P8032 || '30' // 搜索超时 默认30
        this.submitFormValue(values)
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        {/* 连接模式 */}
        <SelectItem
          gfd={gfd}
          {...options['P8037']}
          selectOptions={[
            { v: '0', t: 'LDAP' },
            { v: '1', t: 'LDAPS' }
          ]}
        />
        {/* 服务器地址 */}
        <InputItem
          gfd={gfd}
          {...options['P8020']}
          gfdOptions={{
            rules: [
              this.maxLen(64),
              this.checkUrlPath()
            ]
          }}
        />
        {/* 端口号 */}
        <InputItem
          gfd={gfd}
          {...options['P8021']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(1, 65535)
            ]
          }}
        />
        {/* 根节点 */}
        <InputItem
          gfd={gfd}
          {...options['P8022']}
          gfdOptions={{
            rules: [
              // this.maxLen(64)
            ]
          }}
        />
        {/* 用户名（绑定节点） */}
        <InputItem
          gfd={gfd}
          {...options['P8023']}
          gfdOptions={{
            rules: [
              // this.maxLen(64)
            ]
          }}
        />
        {/* 密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P8024']}
          gfdOptions={{
            rules: [
              // this.maxLen(64)
            ]
          }}
        />
        {/* LDAP名字属性 */}
        <InputItem
          gfd={gfd}
          {...options['P8028']}
          gfdOptions={{
            rules: [
              // this.maxLen(64)
            ]
          }}
        />
        {/* LDAP号码属性 */}
        <InputItem
          gfd={gfd}
          {...options['P8029']}
          gfdOptions={{
            rules: [
              // this.maxLen(64)
            ]
          }}
        />
        {/* LDAP邮件属性 */}
        <InputItem
          gfd={gfd}
          {...options['P8038']}
          gfdOptions={{
            rules: [
              // this.maxLen(64)
            ]
          }}
        />
        {/* LDAP名字筛选规则 */}
        <InputItem
          gfd={gfd}
          {...options['P8026']}
          gfdOptions={{
            rules: [
              // this.maxLen(64)
            ]
          }}
        />
        {/* LDAP号码筛选规则 */}
        <InputItem
          {...options['P8025']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              // this.maxLen(64)
            ]
          }}
        />
        {/* LDAP邮件筛选规则 */}
        <InputItem
          gfd={gfd}
          {...options['P8039']}
          gfdOptions={{
            rules: [
              // this.maxLen(64)
            ]
          }}
        />
        {/* LDAP显示名属性 */}
        <InputItem
          gfd={gfd}
          {...options['P8030']}
          gfdOptions={{
            rules: [
              // this.maxLen(64)
            ]
          }}
        />
        {/* 最大返回条数 */}
        <InputItem
          gfd={gfd}
          {...options['P8031']}
          gfdOptions={{
            rules: [
              this.maxLen(64),
              this.range(0, 4000),
              this.digits()
            ]
          }}
        />
        {/* 搜索超时(秒) */}
        <InputItem
          gfd={gfd}
          {...options['P8032']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(1, 180)
            ]
          }}
        />
        {/* 拨号时进行LDAP查找 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P8034']}
        />
        {/* 来电时进行LDAP查找 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P8035']}
        />
        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default LDAPContacts
