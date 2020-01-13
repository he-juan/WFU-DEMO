import React from 'react'
import { Form, Button, Divider, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { SelectItem, InputItem } from '@/components/FormItem'
import NoData from '@/components/NoData'
import { getOptions } from '@/template'
import API from '@/api'
import { $t } from '@/Intl'

@Form.create()
class Logcat extends FormCommon {
  options = getOptions('Maintenance.TroubleShooting.Logcat')

  state = {
    logcatFile: ''
  }

  clearLog = () => {
    API.clearLogcat().then(m => {
      if (m.Response === 'Success') {
        message.success($t('m_067'))
        this.setState({
          logcatFile: ''
        })
      }
    })
  }

  getLogcat = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { logTag, logPri } = values
        API.getLogcat(logTag.trim(), logPri).then(m => {
          if (m.Response === 'Success') {
            setTimeout(() => {
              API.getLogcatText().then(text => {
                this.setState({
                  logcatFile: text
                })
                // unwillmount不取消
                setTimeout(() => {
                  API.removeLogcat()
                }, 2000)
              })
            }, 200)
          }
        })
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options
    const { logcatFile } = this.state

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
          gfdOptions={{
            initialValue: '',
            rules: [
              this.maxLen(32)
            ]
          }}
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
        <Divider />
        {/* 日志 */}
        {
          logcatFile ? <pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{logcatFile}</pre> : <NoData />
        }
      </Form>
    )
  }
}

export default Logcat
