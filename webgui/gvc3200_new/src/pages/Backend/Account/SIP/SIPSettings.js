import React from 'react'
import { Form, Button, Radio, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, SelectItem, InputItem } from '@/components/FormItem'
import { $t } from '@/Intl'

const RadioGroup = Radio.Group

@Form.create()
class SIPSettings extends FormCommon {
  constructor (props) {
    super(props)
    this.options = getOptions('Account.SIP.SIP')
  }
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 会话超时时间处理
        if (values['P260']) {
          if (parseFloat(values['Psessionexp_0']) < parseFloat(values['P261'])) {
            message.error($t('m_081'))
            return false
          }
          values['P260'] = values['Psessionexp_0']
        }
        this.submitFormValue(values, 1)
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const options = this.options
    const enableSessionTimer = getFieldValue('P260')

    return (
      <Form hideRequiredMark>
        {/* SIP注册 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P31']}
        />
        {/* 重新注册前注销 */}
        <SelectItem
          gfd={gfd}
          {...options['P81']}
          selectOptions={[
            { v: '0', t: $t('c_046') },
            { v: '1', t: $t('c_009') },
            { v: '2', t: 'Instance' }
          ]}
        />
        {/* 注册期限(分钟) */}
        <InputItem
          gfd={gfd}
          {...options['P32']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(1, 64800)
            ]
          }}
        />
        {/* 注册期限内重新注册等待时间(秒) */}
        <InputItem
          gfd={gfd}
          {...options['P2330']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(0, 64800)
            ]
          }}
        />
        {/* 订阅超时(分钟) */}
        <InputItem
          gfd={gfd}
          {...options['P26051']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(0, 64800)
            ]
          }}
        />
        {/* 重试注册间隔时间(秒) */}
        <InputItem
          gfd={gfd}
          {...options['P138']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(1, 3600)
            ]
          }}
        />
        {/* 本地SIP端口 */}
        <InputItem
          gfd={gfd}
          {...options['P40']}
          gfdOptions={{
            rules: [
              this.required(),
              this.digits(),
              this.range(5, 65535)
            ]
          }}
        />
        {/* 支持MWI */}
        <CheckboxItem
          gfd={gfd}
          {...options['P99']}
        />
        {/* start 存在奇怪的交互 */}
        {/* 开启会话超时 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P260']}
        />
        {/* 会话超时时间(秒) */}
        <InputItem
          gfd={gfd}
          {...options['Psessionexp_0']}
          hide={!enableSessionTimer}
          gfdOptions={{
            rules: [
              this.required(),
              this.digits(),
              this.range(90, 64800)
            ]
          }}
        />
        {/* 最小超时时间(秒) */}
        <InputItem
          gfd={gfd}
          {...options['P261']}
          hide={!enableSessionTimer}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(90, 64800)
            ]
          }}
        />
        {/* UAC指定刷新对象 */}
        <SelectItem
          gfd={gfd}
          {...options['P266']}
          hide={!enableSessionTimer}
          selectOptions={[
            { v: '0', t: 'Omit' },
            { v: '1', t: 'UAC' },
            { v: '2', t: 'UAS' }
          ]}
        />
        {/* UAS指定刷新对象 */}
        <SelectItem
          gfd={gfd}
          {...options['P267']}
          hide={!enableSessionTimer}
          selectOptions={[
            { v: '1', t: 'UAC' },
            { v: '2', t: 'UAS' }
          ]}
        />
        {/* 强制INVITE */}
        <CheckboxItem
          gfd={gfd}
          {...options['P265']}
        />
        {/* 主叫请求计时 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P262']}
        />
        {/* 被叫请求计时 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P263']}
        />
        {/* 强制计时 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P264']}
        />
        {/* 开启100rel */}
        <CheckboxItem
          gfd={gfd}
          {...options['P272']}
        />
        {/* 来电ID显示 */}
        <SelectItem
          gfd={gfd}
          {...options['P2324']}
          selectOptions={[
            { v: '0', t: $t('c_096') },
            { v: '1', t: $t('c_066') },
            { v: '2', t: $t('c_097') }
          ]}
        />
        {/* 使用Privacy头域 */}
        <SelectItem
          gfd={gfd}
          {...options['P2338']}
          selectOptions={[
            { v: '0', t: $t('c_026') },
            { v: '1', t: $t('c_046') },
            { v: '2', t: $t('c_045') }
          ]}
        />
        {/* 使用P-Preferred-Identity头域 */}
        <SelectItem
          gfd={gfd}
          {...options['P2339']}
          selectOptions={[
            { v: '0', t: $t('c_026') },
            { v: '1', t: $t('c_046') },
            { v: '2', t: $t('c_045') }
          ]}
        />
        {/* 使用MAC头域 */}
        <SelectItem
          gfd={gfd}
          {...options['P29090']}
          selectOptions={[
            { v: '0', t: $t('c_046') },
            { v: '1', t: $t('c_298') },
            { v: '2', t: $t('c_299') }
          ]}
        />
        {/* 在User-Agent添加MAC */}
        <SelectItem
          gfd={gfd}
          {...options['P26061']}
          selectOptions={[
            { v: '0', t: $t('c_046') },
            { v: '1', t: $t('c_300') },
            { v: '2', t: $t('c_299') }
          ]}
        />
        {/* SIP传输 */}
        <SelectItem
          gfd={gfd}
          {...options['P130']}
          selectOptions={[
            { v: '0', t: 'UDP' },
            { v: '1', t: 'TCP' },
            { v: '2', t: 'TLS' }
          ]}
        />
        {/* RTP IP过滤 */}
        <SelectItem
          gfd={gfd}
          {...options['P26026']}
          selectOptions={[
            { v: '0', t: $t('c_098') },
            { v: '1', t: $t('c_099') },
            { v: '2', t: $t('c_100') }
          ]}
        />
        {/* RTP超时（秒） */}
        <InputItem
          gfd={gfd}
          {...options['P29068']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(0, 600)
            ]
          }}
        />
        {/* TLS使用的SIP URI格式 */}
        <FormItem {...options['P2329']}>
          {
            gfd('P2329')(
              <RadioGroup>
                <Radio value='0'>sip</Radio>
                <Radio value='1'>sips</Radio>
              </RadioGroup>
            )
          }
        </FormItem>
        {/* TCP/TLS Contact使用实际临时端口 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2331']}
        />
        {/* RFC2543 Hold */}
        <CheckboxItem
          gfd={gfd}
          {...options['P26062']}
        />
        {/* 对称RTP */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1860']}
        />
        {/* 支持SIP实例ID */}
        <CheckboxItem
          gfd={gfd}
          {...options['P288']}
        />
        {/* 验证入局SIP消息 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2306']}
        />
        {/* 检查来电INVITE的SIP用户ID */}
        <CheckboxItem
          gfd={gfd}
          {...options['P258']}
        />
        {/* 验证来电INVITE */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2346']}
        />
        {/* 用于Challenge INVITE ＆ NOTIFY的SIP Realm */}
        <InputItem
          gfd={gfd}
          {...options['P26021']}
        />
        {/* 仅接受已知服务器的SIP请求 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2347']}
        />
        {/* SIP T1超时时间 */}
        <SelectItem
          gfd={gfd}
          {...options['P209']}
          selectOptions={[
            { v: '50', t: '0.5 ' + $t('c_091') },
            { v: '100', t: '1 ' + $t('c_091') },
            { v: '200', t: '2 ' + $t('c_091') }
          ]}
        />
        {/* SIP T2间隔时间 */}
        <SelectItem
          gfd={gfd}
          {...options['P250']}
          selectOptions={[
            { v: '200', t: '2 ' + $t('c_091') },
            { v: '400', t: '4 ' + $t('c_091') },
            { v: '800', t: '8 ' + $t('c_091') }
          ]}
        />
        {/* SIP Timer D间隔时间 */}
        <InputItem
          gfd={gfd}
          {...options['P2387']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(0, 64)
            ]
          }}
        />
        {/* 从路由移除OBP */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2305']}
        />
        {/* 检查域名证书 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2311']}
        />
        {/* 验证证书链 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2867']}
        />

        <FormItem label='' >
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default SIPSettings
