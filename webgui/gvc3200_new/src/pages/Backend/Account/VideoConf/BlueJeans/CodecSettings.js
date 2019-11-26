import React from 'react'
import { Form, Checkbox, Button, message } from 'antd'
import Transfer from '@/components/Transfer'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, SelectItem, InputItem } from '@/components/FormItem'
import { $t } from '@/Intl'

@Form.create()
class CodecSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      vbrateAvailable: [],
      prevbrateAvailable: [],
      preFPSAvailable: [],
      targetVocoders: []
    }

    this.options = getOptions('Account.VideoConf.BlueJeans.Codec')

    // 视频大小对应的视频比特率
    this.imgsizeToVbrate = {
      '10': {
        options: ['1024', '1280', '1536', '1792', '2048', '2560', '3072', '3584', '4096'],
        defaults: '2048'
      },
      '9': {
        options: ['512', '640', '768', '896', '1024', '1280', '1536', '1792', '2048'],
        defaults: '1024'
      },
      '4': {
        options: ['384', '400', '416', '448', '512', '640', '768', '896', '1024'],
        defaults: '512'
      },
      '7': {
        options: ['384', '400', '416', '448', '512', '640', '768', '896', '1024'],
        defaults: '512'
      },
      '1': {
        options: ['384', '400', '416', '448', '512', '640', '768', '896', '1024'],
        defaults: '512'
      }
    }
    // 演示视频大小对应的视频比特率
    this.preSizeToPrevbrate = {
      '10': {
        options: ['512', '768', '1024', '1280', '1536', '1792', '2048'],
        defaults: '2048'
      },
      '9': {
        options: ['512', '640', '768', '896', '1024', '1280', '1536', '1792', '2048'],
        defaults: '1024'
      }
    }
    // 演示视频大小对应的演示帧率
    this.preSizeToPreFPS = {
      '10': ['5', '10', '15'],
      '9': ['5', '10', '15', '30']
    }
    // 语音编码 可选项
    this.vocoderSource = [
      { key: '9', title: 'G.722' },
      { key: '104', title: 'G.722.1' },
      { key: '0', title: 'PCMU' },
      { key: '8', title: 'PCMA' }
    ]
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form

    this.initFormValue(this.options).then(data => {
      const { P551, P552, P553, P554, ...others } = data

      this.initVocodersTran([P551, P552, P553, P554])
      this.setVbrateOptions(data.P2307)
      this.setPreVbrateOptions(data.P2376)
      setFieldsValue(others)
    })
  }

  // 初始化 语音编码 穿梭框
  initVocodersTran = (values) => {
    let vals = [...new Set(values)].filter(v => v !== '')
    let targetVocoders = []
    vals.forEach(v => {
      targetVocoders.push(this.vocoderSource.filter(item => item.key === v)[0].key)
    })
    this.setState({
      targetVocoders
    })
  }

  handleTranserVocoder = (v) => {
    if (v.length === 0) {
      message.error($t('m_084'))
      return false
    }
    this.setState({
      targetVocoders: v
    })
  }
  parseVocoderValues = (targets) => {
    let result = {}
    const pAry = ['P551', 'P552', 'P553', 'P554']
    pAry.forEach((p, i) => {
      result[p] = targets[i] ? targets[i] : ''
    })
    return result
  }

  // 修改h.264 视频大小 更新相应视频比特率可选范围
  handleImgSizeChange = (v) => {
    this.setVbrateOptions(v)
    let P2515 = v === this.INIT_VALUE['P2507'] ? this.INIT_VALUE['P2515'] : this.imgsizeToVbrate[v].defaults
    this.props.form.setFieldsValue({
      P2515
    })
  }

  // 设置视频比特率可选范围
  setVbrateOptions = (v) => {
    if (v === '' || !v) {
      v = '10'
    }
    let vbrateAvailable = this.imgsizeToVbrate[v].options
    this.setState({
      vbrateAvailable
    })
  }

  // 修改演示H.264视频大小, 更新演示视频比特率可选范围
  handlePreImgSizeChange = (v) => {
    this.setPreVbrateOptions(v)
    let P2578 = v === this.INIT_VALUE['P2576'] ? this.INIT_VALUE['P2578'] : this.preSizeToPrevbrate[v].defaults
    let P26242 = v === '10' ? '15' : '30'
    this.props.form.setFieldsValue({
      P2578,
      P26242
    })
  }

  // 设置演示视频比特率可选范围
  setPreVbrateOptions = (v) => {
    if (v === '' || !v) {
      v = '10'
    }
    let prevbrateAvailable = this.preSizeToPrevbrate[v].options
    let preFPSAvailable = this.preSizeToPreFPS[v]
    this.setState({
      prevbrateAvailable,
      preFPSAvailable
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        let vocoderValues = this.parseVocoderValues(this.state.targetVocoders)
        values = Object.assign({}, values, vocoderValues)
        this.submitFormValue(values, 1)
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const { targetVocoders } = this.state
    const options = this.options

    if (!targetVocoders.length) return null

    const disablePresent = !!Number(getFieldValue('P26201'))
    return (
      <Form>
        <h4 className='bak-sub-title'>{$t('c_101')}</h4>
        {/* DTMF */}
        <FormItem label='acct_058' tips='acct_058_tip'>
          <Form.Item className='sub-form-item'>
            {
              gfd('P2501', {
                valuePropName: 'checked',
                normalize: (value) => Number(value)
              })(
                <Checkbox>In audio</Checkbox>
              )
            }
          </Form.Item>
          <Form.Item className='sub-form-item' >
            {
              gfd('P2502', {
                valuePropName: 'checked',
                normalize: (value) => Number(value)
              })(
                <Checkbox>RFC2833</Checkbox>
              )
            }
          </Form.Item>
        </FormItem>
        {/* DTMF有效荷载类型 */}
        <InputItem
          {...options['P596']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 126),
              {
                validator: (data, value, callback) => {
                  if (value === '98' || value === '99') {
                    callback($t('m_082'))
                  } else {
                    callback()
                  }
                }
              }
            ]
          }}
        />
        {/* 语音编码 */}
        <FormItem label='acct_060' tips='acct_060_tip' >
          <Transfer
            className='form-item-transfer'
            titles={[$t('c_053'), $t('c_054')]}
            onChange={this.handleTranserVocoder}
            sorter={true}
            dataSource={this.vocoderSource}
            targetKeys={targetVocoders}
            render={item => item.title}
            style={{ marginBottom: 20 }}
          />
        </FormItem>
        {/* 编码协商优先级 */}
        <SelectItem
          {...options['P29261']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_102') },
            { v: '1', t: $t('c_103') }
          ]}
        />
        {/* 静音抑制 */}
        <CheckboxItem
          {...options['P585']}
          gfd={gfd}
        />
        {/* 语音帧/TX */}
        <InputItem
          {...options['P586']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(1, 64)
            ]
          }}
        />
        {/* G.722.1速率 */}
        <SelectItem
          {...options['P2573']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: '24kbps ' + $t('c_104') },
            { v: '1', t: '32kbps ' + $t('c_104') }
          ]}
        />
        {/* G.722.1有效荷载类型 */}
        <InputItem
          {...options['P2574']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 126),
              {
                validator: (data, value, callback) => {
                  if (value === '98' || value === '99') {
                    callback($t('m_082'))
                  } else {
                    callback()
                  }
                }
              }
            ]
          }}
        />
        {/* 使用200OK SDP中首位匹配编码 */}
        <CheckboxItem
          {...options['P2548']}
          gfd={gfd}
        />
        {/* 开启音频前向纠错 */}
        <CheckboxItem
          {...options['P26273']}
          gfd={gfd}
        />
        {/* 音频FEC有效荷载类型 */}
        <InputItem
          {...options['P26274']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 127)
            ]
          }}
        />
        {/* 音频RED有效荷载类型 */}
        <InputItem
          {...options['P26275']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 127),
              {
                validator: (data, value, callback) => {
                  if (value === '98' || value === '99') {
                    callback($t('m_082'))
                  } else {
                    callback()
                  }
                }
              }
            ]
          }}
        />
        <h4 className='bak-sub-title'>{$t('c_105')}</h4>
        {/* 支持RFC5168 */}
        <CheckboxItem
          {...options['P578']}
          gfd={gfd}
        />
        {/* 丢包重传 */}
        <SelectItem
          {...options['P26285']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: 'NACK' },
            { v: '1', t: 'NACK+RTX(SSRC-GROUP)' },
            { v: '2', t: $t('c_098') }
          ]}
        />
        {/* 开启视频前向纠错 */}
        <CheckboxItem
          {...options['P2593']}
          gfd={gfd}
        />
        {/* FEC有效荷载类型 */}
        <InputItem
          {...options['P2594']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 127)
            ]
          }}
        />
        {/* SDP带宽属性 */}
        <SelectItem
          {...options['P2560']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_106') },
            { v: '1', t: $t('c_107') },
            { v: '2', t: $t('c_065') }
          ]}
        />
        {/* 视频抖动缓冲区最大值 */}
        <InputItem
          {...options['P2581']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 1000)
            ]
          }}
        />
        {/* H.264视频大小 */}
        <SelectItem
          {...options['P2507']}
          gfd={gfd}
          onChange={(v) => { this.handleImgSizeChange(v) }}
          selectOptions={[
            { v: '10', t: '1080P' },
            { v: '9', t: '720P' },
            { v: '4', t: '4CIF' },
            { v: '7', t: '4SIF' },
            { v: '1', t: 'VGA' }
          ]}
        />
        {/* 视频比特率 */}
        <SelectItem
          {...options['P2515']}
          gfd={gfd}
          selectOptions={this.state.vbrateAvailable.map((v) => {
            return { v: v, t: v + 'Kbps' }
          })}
        />
        {/* 视频帧率 */}
        <SelectItem
          {...options['P25006']}
          gfd={gfd}
          selectOptions={[
            { v: '5', t: '5 ' + $t('c_108') },
            { v: '15', t: '15 ' + $t('c_108') },
            { v: '25', t: '25 ' + $t('c_108') },
            { v: '30', t: '30 ' + $t('c_108') },
            { v: '29', t: $t('c_109') }
          ]}
        />
        {/* H.264有效荷载类型 */}
        <InputItem
          {...options['P562']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 127)
            ]
          }}
        />
        {/* 打包模式 */}
        <SelectItem
          {...options['P26205']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: '0' },
            { v: '1', t: '1' },
            { v: '2', t: $t('c_110') }
          ]}
        />
        {/* H.264 Profile 类型 */}
        <SelectItem
          {...options['P2562']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_111') },
            { v: '1', t: $t('c_112') },
            { v: '2', t: $t('c_113') },
            { v: '3', t: 'BP & MP & HP' }
          ]}
        />
        {/* 使用H.264 Constrained Profiles */}
        <CheckboxItem
          {...options['P26245']}
          gfd={gfd}
        />

        <h4 className='bak-sub-title'>{$t('c_114')}</h4>
        {/* 禁止演示 */}
        <CheckboxItem
          {...options['P26201']}
          gfd={gfd}
        />
        {/* 初始INVITE携带媒体信息 */}
        <CheckboxItem
          {...options['PsendPreMode_2']}
          gfd={gfd}
          disabled={disablePresent}
        />
        {/* 演示H.264 视频大小 */}
        <SelectItem
          {...options['P2576']}
          gfd={gfd}
          onChange={(v) => { this.handlePreImgSizeChange(v) }}
          disabled={disablePresent}
          selectOptions={[
            { v: '10', t: '1080P' },
            { v: '9', t: '720P' }
          ]}
        />
        {/* 演示H.264 Profile类型 */}
        <SelectItem
          {...options['P2577']}
          gfd={gfd}
          disabled={disablePresent}
          selectOptions={[
            { v: '0', t: $t('c_111') },
            { v: '1', t: $t('c_112') },
            { v: '2', t: $t('c_113') },
            { v: '3', t: 'BP & MP & HP' }
          ]}
        />
        {/* 演示视频速率 */}
        <SelectItem
          {...options['P2578']}
          gfd={gfd}
          disabled={disablePresent}
          selectOptions={this.state.prevbrateAvailable.map((v) => {
            return { v: v, t: v + 'Kbps' }
          })}
        />
        {/* 演示视频帧率 */}
        <SelectItem
          {...options['P26242']}
          gfd={gfd}
          disabled={disablePresent}
          selectOptions={this.state.preFPSAvailable.map(v => {
            return { v: v, t: v + $t('c_108') }
          })}
        />
        <FormItem >
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default CodecSettings
