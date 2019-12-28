import React from 'react'
import { Form, Button, message } from 'antd'
import { connect } from 'react-redux'
import FormCommon from '@/components/FormCommon'
import FormItem, { PwInputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { checkCurrentPwd } from '@/api/api.system'
import { $t, $fm } from '@/Intl'

// redux connect
@connect(
  state => ({
    userType: state.userType
  }),
  dispatch => ({})
)

// antd form.create
@Form.create()
class UserInfoManage extends FormCommon {
  // constructor
  constructor (props) {
    super(props)

    this.options = getOptions('System.Security.UserInfoManage')

    // 定义 state
    this.state = {
      adminconfirmDirty: false,
      userconfirmDirty: false
    }
  }

  // 检查当前输入密码是否正确 value 输入密码 cb 回调函数
  checkCurPwd = (value, userType, cb) => {
    const { setFields } = this.props.form
    if (value !== '') {
      checkCurrentPwd(value, userType).then(data => {
        if (data.Response === 'Success') {
          if (data.Same && +data.Same === 0) {
            setFields({
              curadmipwd: {
                value,
                errors: [new Error($t('m_005'))]
              }
            })
          } else {
            cb && cb()
          }
        } else {
          message.error(data.Message)
        }
      })
    } else {
      return false
    }
  }

  // 密码 触发 repeat字段 检验
  checkConfirm = (role) => {
    const { adminconfirmDirty, userconfirmDirty } = this.state
    const { form } = this.props
    return {
      validator: (rule, value, callback) => {
        if (role === 'admin') {
          adminconfirmDirty && form.validateFields(['adminpasswd2'], { force: true })
        } else {
          userconfirmDirty && form.validateFields(['userpasswd2'], { force: true })
        }
        callback()
      }
    }
  }

  // 检测密码 必须是 ascii code between 33-126
  checkCharacter = () => {
    /* add limitation for input characters only ascii code between 33-126 are allowed */
    return {
      validator: (rule, value, callback) => {
        if (value !== '' && value !== undefined) {
          const reg = new RegExp('^[\x21-\x7E]+$')
          if (reg.test(value)) callback()
          else callback($fm('m_006'))
        } else {
          callback()
        }
      }
    }
  }

  // 检验repeat 密码 是否 与 原密码相同
  checkPassword = (role) => {
    const { form } = this.props
    const { adminconfirmDirty, userconfirmDirty } = this.state
    return {
      validator: (rule, value, callback) => {
        if (role === 'admin') {
          if (value && !adminconfirmDirty) {
            this.setState({
              adminconfirmDirty: true
            })
          }
          if (value !== form.getFieldValue('P2')) callback($fm('m_007'))
          else callback()
        } else {
          if (value && !userconfirmDirty) {
            this.setState({
              userconfirmDirty: true
            })
          }
          if (value !== form.getFieldValue('P196')) callback($fm('m_007'))
          else callback()
        }
      }
    }
  }

  // 检查密码 是否符合格式
  checkPassword2 = () => {
    return {
      validator: (rule, value, callback) => {
        if (!value) {
          callback()
          return
        }
        if (value && value.length < 6) {
          callback($fm('m_008'))
          return
        }
        let msg = $t('m_009')
        if (/^[0-9]*$/.test(value) || /^[a-z]*$/.test(value) || /^[A-Z]*$/.test(value)) {
          callback(msg)
          return
        }
        let hasNumber = false
        for (let j = 0; j < value.length; j++) {
          if (/^[0-9]$/.test(value[j])) {
            hasNumber = true
            break
          }
        }
        if (!hasNumber) {
          callback(msg)
          return
        }
        callback()
      }
    }
  }

  // 提交数据
  handleSubmit = () => {
    const { validateFields, resetFields } = this.props.form
    const { userType } = this.props

    validateFields((err, values) => {
      let { P2, P196 } = values
      let params = {}
      if (!err) {
        if (userType === 'admin') {
          if (values['P2'] === '' && values['P196'] === '') {
            return message.error($t('m_010'))
          } else {
            params = { P2, P196 }
          }
        } else {
          if (values['P196'] === '') {
            return message.error($t('m_011'))
          } else {
            params = { P196 }
          }
        }
        // 判断当前密码 是否正确
        this.checkCurPwd(values['curadmipwd'], userType, () => {
          this.submitFormValue(params, 0).then(() => {
            resetFields()
          })
        })
      }
    })
  }

  // render
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const { userType } = this.props
    const options = this.options

    return (
      <Form hideRequiredMark>
        {/* 当前管理员密码 */}
        <PwInputItem
          label={userType === 'admin' ? 'sys_sec_004_1' : 'sys_sec_004_2'}
          tips={'sys_sec_004_tip'}
          gfd={gfd}
          name='curadmipwd'
          gfdOptions={{
            rules: [
              this.required()
            ]
          }}
        />
        {/* 管理员新密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['P2']}
          gfdOptions={{
            rules: [
              this.checkConfirm('admin'),
              this.checkCharacter(),
              this.checkPassword2()
            ]
          }}
        />
        {/* 确认管理员新密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['adminpasswd2']}
          gfdOptions={{
            rules: [
              this.checkPassword('admin'),
              this.checkCharacter()
            ]
          }}
        />
        {/* 用户新密码 */}
        <PwInputItem
          gfd={gfd}
          name='P196'
          {...options['P196']}
          gfdOptions={{
            rules: [
              this.checkConfirm('user'),
              this.checkCharacter(),
              this.checkPassword2()
            ]
          }}
        />
        {/* 确认用户新密码 */}
        <PwInputItem
          gfd={gfd}
          name='userpasswd2'
          {...options['userpasswd2']}
          gfdOptions={{
            rules: [
              this.checkPassword('user'),
              this.checkCharacter()
            ]
          }}
        />
        <FormItem label=''>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default UserInfoManage
