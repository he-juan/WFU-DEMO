import React from 'react'
import { Form, Button, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { SelectItem, InputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import API from '@/api'
import { $t } from '@/Intl'

@Form.create()
class Logcat extends FormCommon {
  options = getOptions('Maintenance.TroubleShooting.Logcat')

  clearLog = () => {
    API.clearLogcat().then(m => {
      if (m.Response === 'Success') {
        message.success($t('m_067'))
      }
    })
  }
  getLogcat = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { logTag, logPri } = values
        API.getLogcat(logTag, logPri).then(m => {
          if (m.Response === 'Success') {
            setTimeout(() => {
              window.location.href = `/logcat/logcat.text?time=` + new Date().getTime()
            }, 200)
          }
        })
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        {/* 清除日志 */}
        <FormItem {...options['clearLog']}>
          <Button onClick={this.clearLog}>{$t('b_023')}</Button>
        </FormItem>
        {/* 日志标签 */}
        <InputItem
          {...options['logTag']}
          gfd={gfd}
          gfdOptions={{ initialValue: '' }}
        />
        {/* 日志优先级 */}
        <SelectItem
          {...options['logPri']}
          gfd={gfd}
          selectOptions={[
            { v: 'V', t: 'Verbose' },
            { v: 'D', t: 'Debug' },
            { v: 'I', t: 'Info' },
            { v: 'W', t: 'Warning' },
            { v: 'E', t: 'Error' },
            { v: 'F', t: 'Fatal' },
            { v: 'S', t: 'Silent (supress all output)' }
          ]}
          gfdOptions={{ initialValue: 'V' }}
        />
        <FormItem label=''>
          <Button type='primary' onClick={this.getLogcat}>{$t('b_024')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Logcat
