import React from 'react'
import { Form, Button, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { PwInputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { rmLockPwd, saveLockPwd } from '@/api/api.system'
import { $t } from '@/Intl'

// antd form.create
@Form.create()
class ScreenLock extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('System.Security.ScreenLock')
  }

  // 刪除锁屏密码
  handleDelete = () => {
    rmLockPwd().then(data => {
      if (data.res === 'success') {
        message.success($t('m_013'))
      } else {
        message.error($t('m_014'))
      }
    })
  }

  // 触发当renewlock 不为空时，强制进行 验证
  checkPwd1 = () => {
    let { getFieldValue, validateFields } = this.props.form
    return {
      validator: (rule, value, callback) => {
        if (getFieldValue('renewlock') !== '') {
          validateFields(['renewlock'], { force: true })
        }
        callback()
      }
    }
  }

  // 检查 repeat 密码是否与新密码相同
  checkPwd2 = () => {
    const { getFieldValue } = this.props.form
    return {
      validator: (rule, value, callback) => {
        if (value && value !== getFieldValue('newlock')) {
          callback($t('m_007'))
        } else {
          callback()
        }
      }
    }
  }

  // 提交数据
  handleSubmit = () => {
    const { validateFields, resetFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        saveLockPwd(values['newlock']).then(data => {
          if (data.res === 'success') {
            message.success($t('m_001'))
            resetFields()
          } else {
            message.error($t('m_002'))
          }
        })
      }
    })
  }

  // render
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form hideRequiredMark>
        {/* 删除锁屏密码 */}
        <FormItem {...options['deletelock']}>
          <Button type='default' onClick={this.handleDelete}>{$t('b_003')}</Button>
        </FormItem>
        {/* 锁屏密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['newlock']}
          gfdOptions={{
            rules: [
              this.required(),
              {
                pattern: /^\d{6}$/,
                message: $t('m_012')
              },
              this.checkPwd1()
            ]
          }}
        />
        {/* 确认锁屏密码 */}
        <PwInputItem
          gfd={gfd}
          {...options['renewlock']}
          gfdOptions={{
            rules: [
              this.required(),
              this.checkPwd2()
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

export default ScreenLock
