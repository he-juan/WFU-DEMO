import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button } from 'antd'
import { connect } from 'react-redux'
import FormItem, { SelectItem, InputItem, CheckboxItem, PwInputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import API from '@/api'
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
    this.getLDAPAccts()
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
  }
  // LDAP拨号默认帐号可选项
  getLDAPAccts = () => {
    API.getPvalues(['P270', 'P417', 'P517', 'P617', 'P1717', 'P1817', 'P50617', 'P50717', 'P50817', 'P50917', 'P51017', 'P51117', 'P51217', 'P51317', 'P51417', 'P51517'])
      .then(data => {
        let keys = Object.keys(data)
        let acctsOptions = keys.map((key, i) => {
          return { v: i + '', t: data[key] || $t('c_025') + (i + 1) }
        })
        if (this.props.IPVTExist === '1') {
          acctsOptions.splice(-1)
        }
        this.setState({
          acctsOptions
        })
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
              this.range(0, 65535)
            ]
          }}
        />
        {/* 根节点 */}
        <InputItem
          gfd={gfd}
          {...options['P8022']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 用户名（绑定节点） */}
        <InputItem
          gfd={gfd}
          {...options['P8023']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P8024']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* LDAP名字属性 */}
        <InputItem
          gfd={gfd}
          {...options['P8028']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* LDAP号码属性 */}
        <InputItem
          gfd={gfd}
          {...options['P8029']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* LDAP邮件属性 */}
        <InputItem
          gfd={gfd}
          {...options['P8038']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* LDAP名字筛选规则 */}
        <InputItem
          gfd={gfd}
          {...options['P8026']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* LDAP号码筛选规则 */}
        <InputItem
          {...options['P8025']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* LDAP邮箱筛选规则 */}
        <InputItem
          gfd={gfd}
          {...options['P8039']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* LDAP显示名属性 */}
        <InputItem
          gfd={gfd}
          {...options['P8030']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 最大返回条数 */}
        <InputItem
          gfd={gfd}
          {...options['P8031']}
          gfdOptions={{
            rules: [
              this.maxLen(64)
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
              this.range(1, 4000)
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
        {/* LDAP拨号默认帐号 */}
        <SelectItem
          gfd={gfd}
          {...options['P22039']}
          selectOptions={[
            { v: '-1', t: $t('c_026') },
            ...this.state.acctsOptions
          ]}
        />
        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default LDAPContacts
