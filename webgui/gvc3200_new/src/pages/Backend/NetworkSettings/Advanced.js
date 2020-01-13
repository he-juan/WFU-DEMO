import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button, Input, message } from 'antd'
import FormItem, { InputItem, CheckboxItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t } from '@/Intl'

@Form.create()
class Advanced extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      dscp2State: false,
      dscp1State: false,
      dscp7State: false
    }
    this.options = getOptions('Network.Advanced')
    this.ipInputRule = [this.digits(), this.range(0, 255)]
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    // P1552 代理服务器主机名加端口,需要特殊处理下
    this.options['P1552'] = { p: 'P1552' }
    // 三个临时p值
    this.options['Pdscp2'] = { p: 'Pdscp2' } // 第三层SIP QoS
    this.options['Pdscp1'] = { p: 'Pdscp1' } // 第三层音频 QoS
    this.options['Pdscp7'] = { p: 'Pdscp7' } // 第三层视频 QoS

    this.initFormValue(this.options).then(data => {
      const { P1552, Pdscp2, Pdscp1, Pdscp7, ...other } = data

      this.setHttpProxy(P1552)

      let states = this.HandleDscp({ Pdscp2, Pdscp1, Pdscp7 })

      other.P1558 = states.dscp2State ? Pdscp2 : other.P1558
      other.P1559 = states.dscp1State ? Pdscp1 : other.P1559
      other.P1560 = states.dscp7State ? Pdscp7 : other.P1560

      setFieldsValue(other)
    })
  }

  // P1552 代理服务器主机名加端口处理 如: 1.1.1.1:80  => 1.1.1.1, 80
  setHttpProxy = (url) => {
    const { setFieldsValue } = this.props.form
    let proxyHostName = ''
    let proxyPort = ''
    if (url.length !== 0) {
      let pos = url.lastIndexOf(':')
      proxyHostName = pos !== -1 ? url.substring(0, pos) : url
      proxyPort = pos !== -1 ? url.substring(pos + 1) : ''
    }

    setFieldsValue({
      proxyHostName,
      proxyPort
    })
  }

  // 临时P值的处理
  HandleDscp = ({ Pdscp2, Pdscp1, Pdscp7 }) => {
    const dscp2State = Pdscp2 !== '' && Pdscp2 !== '0'
    const dscp1State = Pdscp1 !== '' && Pdscp1 !== '0'
    const dscp7State = Pdscp7 !== '' && Pdscp7 !== '0'
    this.setState({
      dscp2State,
      dscp1State,
      dscp7State
    })
    return {
      dscp2State,
      dscp1State,
      dscp7State
    }
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    const { dscp2State, dscp1State, dscp7State } = this.state
    validateFields((err, values) => {
      if (!err) {
        let { proxyHostName, proxyPort, ...rest } = values

        if (!proxyHostName && (proxyPort || rest['P22011'])) {
          message.error($t('m_218'))
          return false
        }
        if (!proxyPort && (proxyHostName || rest['P22011'])) {
          message.error($t('m_219'))
          return false
        }
        proxyHostName = proxyHostName.replace(/(https:\/\/|http:\/\/)/i, '')
        rest.P1552 = proxyPort ? `${proxyHostName}:${proxyPort}` : proxyHostName

        // dscp 不提交
        if (dscp2State) delete rest.P1558
        if (dscp1State) delete rest.P1559
        if (dscp7State) delete rest.P1560
        this.submitFormValue(rest)
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const { dscp2State, dscp1State, dscp7State } = this.state
    const options = this.options
    return (
      <Form hideRequiredMark>
        <h4 className='bak-sub-title'>{$t('c_175')}</h4>
        {/* 首选DNS服务器1 */}
        <FormItem {...options['P92']} className='ip-input-form-item'>
          <Form.Item className='sub-form-item'>
            {gfd('P92', { rules: this.ipInputRule })(<Input />)}
          </Form.Item>
          <em>.</em>
          <Form.Item className='sub-form-item'>
            {gfd('P93', { rules: this.ipInputRule })(<Input />)}
          </Form.Item>
          <em>.</em>
          <Form.Item className='sub-form-item'>
            {gfd('P94', { rules: this.ipInputRule })(<Input />)}
          </Form.Item>
          <em>.</em>
          <Form.Item className='sub-form-item'>
            {gfd('P95', { rules: this.ipInputRule })(<Input />)}
          </Form.Item>
        </FormItem>
        {/* 首选DNS服务器2 */}
        <FormItem {...options['P5026']} className='ip-input-form-item'>
          <Form.Item className='sub-form-item'>
            {gfd('P5026', { rules: this.ipInputRule })(<Input />)}
          </Form.Item>
          <em>.</em>
          <Form.Item className='sub-form-item'>
            {gfd('P5027', { rules: this.ipInputRule })(<Input />)}
          </Form.Item>
          <em>.</em>
          <Form.Item className='sub-form-item'>
            {gfd('P5028', { rules: this.ipInputRule })(<Input />)}
          </Form.Item>
          <em>.</em>
          <Form.Item className='sub-form-item'>
            {gfd('P5029', { rules: this.ipInputRule })(<Input />)}
          </Form.Item>
        </FormItem>
        {/* 开启LLDP */}
        <CheckboxItem
          {...options['P1684']}
          gfd={gfd}
        />

        {/* 开启CDP */}
        <CheckboxItem
          {...options['P22119']}
          gfd={gfd}
        />
        {/* 第三层SIP QoS */}
        <InputItem
          {...options['P1558']}
          gfd={gfd}
          disabled={dscp2State}
          gfdOptions={{
            rules: [
              this.required(),
              this.digits(),
              this.range(0, 63)
            ]
          }}
        />
        <InputItem
          {...options['P1559']}
          gfd={gfd}
          disabled={dscp1State}
          gfdOptions={{
            rules: [
              this.required(),
              this.digits(),
              this.range(0, 63)
            ]
          }}
        />
        <InputItem
          {...options['P1560']}
          gfd={gfd}
          disabled={dscp7State}
          gfdOptions={{
            rules: [
              this.required(),
              this.digits(),
              this.range(0, 63)
            ]
          }}
        />
        <InputItem
          {...options['P1541']}
          gfd={gfd}
        />
        <InputItem
          {...options['P26027']}
          gfd={gfd}
        />
        <h4 className='bak-sub-title'>{$t('c_176')}</h4>
        {/* HTTP/HTTPS代理服务器主机名 */}
        <InputItem
          {...options['proxyHostName']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              // this.checkUrlPath(),
              // {
              //   validator: (data, value, callback) => {
              //     value = value || ''
              //     let txt = value.replace(/(https:\/\/|http:\/\/)/i, '')
              //     if (txt.indexOf(':') > -1) {
              //       callback($fm('m_090'))
              //     } else {
              //       callback()
              //     }
              //   }
              // }
            ]
          }}
        />
        {/* HTTP/HTTPS代理服务器端口 */}
        <InputItem
          {...options['proxyPort']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(0, 65535)
            ]
          }}
        />
        {/* 对以下网址不使用代理 */}
        <InputItem
          {...options['P22011']}
          gfd={gfd}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Advanced
