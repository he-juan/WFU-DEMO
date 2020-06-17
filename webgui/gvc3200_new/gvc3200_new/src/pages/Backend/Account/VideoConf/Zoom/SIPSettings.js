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
    this.options = getOptions('Account.VideoConf.Zoom.SIP')
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      data.P2830 = data.P2830 || '0'
      data.Psessionexp_5 = parseInt(data.Psessionexp_5) || parseInt(data.P1834) || '180'
      setFieldsValue(data)
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        // 会话超时时间处理
        if (values['P1834']) {
          if (parseFloat(values['Psessionexp_5']) < parseFloat(values['P1827'])) {
            message.error($t('m_081'))
            return false
          }
          values['P1834'] = values['Psessionexp_5']
        }
        this.submitFormValue(values, 1)
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const options = this.options
    const enableSessionTimer = getFieldValue('P1834')

    return (
      <Form hideRequiredMark>
        {/* SIP传输 */}
        <SelectItem
          {...options['P1848']}
          gfd={gfd}
          selectOptions={[
            { v: '1', t: 'TCP' },
            { v: '2', t: 'TLS' }
          ]}
        />
        {/* 重新注册前注销 */}
        <SelectItem
          gfd={gfd}
          {...options['P1811']}
          selectOptions={[
            { v: '0', t: $t('c_046') },
            { v: '1', t: $t('c_009') },
            { v: '2', t: 'Instance' }
          ]}
        />
        {/* 注册期限(分钟) */}
        <InputItem
          gfd={gfd}
          {...options['P1812']}
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
          {...options['P2830']}
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
          {...options['P26551']}
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
          {...options['P1871']}
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
          {...options['P1813']}
          tips='acct_023_tip_2'
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
          {...options['P1815']}
        />
        {/* start 存在奇怪的交互 */}
        {/* 开启会话超时 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1834']}
        />
        {/* 会话超时时间(秒) */}
        <InputItem
          gfd={gfd}
          {...options['Psessionexp_5']}
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
          {...options['P1827']}
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
          {...options['P1832']}
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
          {...options['P1833']}
          hide={!enableSessionTimer}
          selectOptions={[
            { v: '1', t: 'UAC' },
            { v: '2', t: 'UAS' }
          ]}
        />
        {/* 强制INVITE */}
        <CheckboxItem
          gfd={gfd}
          hide={!enableSessionTimer}
          {...options['P1831']}
        />
        {/* 主叫请求计时 */}
        <CheckboxItem
          gfd={gfd}
          hide={!enableSessionTimer}
          {...options['P1828']}
        />
        {/* 被叫请求计时 */}
        <CheckboxItem
          gfd={gfd}
          hide={!enableSessionTimer}
          {...options['P1829']}
        />
        {/* 强制计时 */}
        <CheckboxItem
          gfd={gfd}
          hide={!enableSessionTimer}
          {...options['P1830']}
        />
        {/* 开启100rel */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1835']}
        />
        {/* 来电ID显示 */}
        <SelectItem
          gfd={gfd}
          {...options['P2824']}
          selectOptions={[
            { v: '0', t: $t('c_096') },
            { v: '1', t: $t('c_066') },
            { v: '2', t: $t('c_097') }
          ]}
        />
        {/* 使用Privacy头域 */}
        <SelectItem
          gfd={gfd}
          {...options['P2838']}
          selectOptions={[
            { v: '0', t: $t('c_026') },
            { v: '1', t: $t('c_046') },
            { v: '2', t: $t('c_045') }
          ]}
        />
        {/* 使用P-Preferred-Identity头域 */}
        <SelectItem
          gfd={gfd}
          {...options['P2839']}
          selectOptions={[
            { v: '0', t: $t('c_026') },
            { v: '1', t: $t('c_046') },
            { v: '2', t: $t('c_045') }
          ]}
        />
        {/* 使用MAC头域 */}
        <SelectItem
          gfd={gfd}
          {...options['P29590']}
          selectOptions={[
            { v: '0', t: $t('c_046') },
            { v: '1', t: $t('c_298') },
            { v: '2', t: $t('c_299') }
          ]}
        />
        {/* 在User-Agent添加MAC */}
        <SelectItem
          gfd={gfd}
          {...options['P26561']}
          selectOptions={[
            { v: '0', t: $t('c_046') },
            { v: '1', t: $t('c_300') },
            { v: '2', t: $t('c_299') }
          ]}
        />
        {/* SIP传输 */}
        <SelectItem
          gfd={gfd}
          {...options['P1875']}
          selectOptions={[
            { v: '0', t: 'UDP' },
            { v: '1', t: 'TCP' },
            { v: '2', t: 'TLS' }
          ]}
        />
        {/* RTP IP过滤 */}
        <SelectItem
          gfd={gfd}
          {...options['P26526']}
          selectOptions={[
            { v: '0', t: $t('c_098') },
            { v: '1', t: $t('c_099') },
            { v: '2', t: $t('c_100') }
          ]}
        />
        {/* RTP超时（秒） */}
        <InputItem
          gfd={gfd}
          {...options['P29568']}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(0, 600)
            ]
          }}
        />
        {/* TLS使用的SIP URI格式 */}
        <FormItem {...options['P2829']}>
          {
            gfd('P2829')(
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
          {...options['P2831']}
        />
        {/* RFC2543 Hold */}
        <CheckboxItem
          gfd={gfd}
          {...options['P26562']}
        />
        {/* 对称RTP */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1860']}
        />
        {/* 支持SIP实例ID */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1889']}
        />
        {/* 验证入局SIP消息 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2806']}
        />
        {/* 检查来电INVITE的SIP用户ID */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1849']}
        />
        {/* 验证来电INVITE */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2846']}
        />
        {/* 用于Challenge INVITE ＆ NOTIFY的SIP Realm */}
        <InputItem
          gfd={gfd}
          {...options['P26521']}
        />
        {/* 仅接受已知服务器的SIP请求 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2847']}
        />
        {/* SIP T1超时时间 */}
        <SelectItem
          gfd={gfd}
          {...options['P1840']}
          selectOptions={[
            { v: '50', t: '0.5 ' + $t('c_091') },
            { v: '100', t: '1 ' + $t('c_091') },
            { v: '200', t: '2 ' + $t('c_091') }
          ]}
        />
        {/* SIP T2间隔时间 */}
        <SelectItem
          gfd={gfd}
          {...options['P1841']}
          selectOptions={[
            { v: '200', t: '2 ' + $t('c_091') },
            { v: '400', t: '4 ' + $t('c_091') },
            { v: '800', t: '8 ' + $t('c_091') }
          ]}
        />
        {/* SIP Timer D间隔时间 */}
        <InputItem
          gfd={gfd}
          {...options['P2887']}
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
          {...options['P2805']}
        />
        {/* 检查域名证书 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P2811']}
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
