import React from 'react'
import { Form, Checkbox, Button, message } from 'antd'
import Transfer from '@/components/Transfer'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, SelectItem, InputItem } from '@/components/FormItem'
import { $t, $fm } from '@/Intl'

@Form.create()
class CodecSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      vbrateAvailable: [],
      prevbrateAvailable: [],
      preFPSAvailable: [],
      targetVocoders: [],
      targetVideos: [],
      h265_enable: '1'
    }

    this.options = getOptions('Account.VideoConf.Zoom.Codec')

    // 视频大小对应的视频比特率
    this.imgsizeToVbrate = {
      '11': {
        options: ['1024', '1280', '1536', '1792', '2048', '2560', '3072', '3584', '4096', '4608', '5120', '5632', '6144', '6656', '7168', '7680', '8192'],
        defaults: '4096'
      },
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
      '9': ['5', '10', '15', '25', '30']
    }

    // 语音编码 可选项
    this.vocoderSource = [
      { key: '0', title: 'PCMU' },
      { key: '8', title: 'PCMA' },
      { key: '9', title: 'G.722' },
      { key: '104', title: 'G.722.1' },
      { key: '18', title: 'G729A/B' },
      { key: '98', title: 'iLBC' },
      { key: '123', title: 'Opus' },
      { key: '103', title: 'G.722.1C' }
    ]

    // 视频编码 可选项
    this.videoSource = [
      { key: '99', title: 'H.264' },
      { key: '114', title: 'H.265' }
    ]
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form

    this.options['Ph265_enable'] = { p: 'Ph265_enable' }

    this.initFormValue(this.options).then(data => {
      const { P1851, P1852, P1853, P1854, P1855, P1856, P1857, P1858, P1864, P1865, Ph265_enable, ...others } = data

      this.initVocodersTran([P1851, P1852, P1853, P1854, P1855, P1856, P1857, P1858])
      this.initVideoTran([P1864, P1865])
      this.setVbrateOptions(data.P2807)
      this.setPreVbrateOptions(data.P2876)
      this.setState({
        h265_enable: Ph265_enable
      })
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
    const pAry = ['P1851', 'P1852', 'P1853', 'P1854', 'P1855', 'P1856', 'P1857', 'P1858']
    pAry.forEach((p, i) => {
      result[p] = targets[i] ? targets[i] : ''
    })
    return result
  }

  // 初始化 视频编码 穿梭框
  initVideoTran = (values) => {
    let vals = [...new Set(values)].filter(v => v !== '')
    let targetVideos = []
    vals.forEach(v => {
      targetVideos.push(this.videoSource.filter(item => item.key === v)[0].key)
    })
    this.setState({
      targetVideos
    })
  }

  handleTranserVideo = (v) => {
    if (v.length === 0) {
      message.error($t('m_084'))
      return false
    }
    this.setState({
      targetVideos: v
    })
  }

  parseVideoValues = (targets) => {
    let result = {}
    const pAry = ['P1864', 'P1865', 'P1875']
    pAry.forEach((p, i) => {
      result[p] = targets[i] ? targets[i] : ''
    })
    return result
  }

  // 修改h.264 视频大小 更新相应视频比特率可选范围
  handleImgSizeChange = (v) => {
    this.setVbrateOptions(v)
    let P2815 = v === this.INIT_VALUE['P2807'] ? this.INIT_VALUE['P2815'] : this.imgsizeToVbrate[v].defaults
    this.props.form.setFieldsValue({
      P2815
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
    let P2878 = v === this.INIT_VALUE['P2876'] ? this.INIT_VALUE['P2878'] : this.preSizeToPrevbrate[v].defaults
    let P26542 = v === '10' ? '15' : '30'
    this.props.form.setFieldsValue({
      P2878,
      P26542
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
    const { validateFields, setFieldsValue } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let setVals = {}

        values['P1896'] === '' && (setVals['P1896'] = values['P1896'] = '101')
        values['P2874'] === '' && (setVals['P2874'] = values['P2874'] = '104')
        values['P26516'] === '' && (setVals['P26516'] = values['P26516'] = '103')
        values['P2885'] === '' && (setVals['P2885'] = values['P2885'] = '123')
        values['P26575'] === '' && (setVals['P26575'] = values['P26575'] = '124')
        values['P26574'] === '' && (setVals['P26574'] = values['P26574'] = '121')
        values['P26508'] === '' && (setVals['P26508'] = values['P26508'] = '125')
        values['P2894'] === '' && (setVals['P2894'] = values['P2894'] = '120')
        values['P1862'] === '' && (setVals['P1862'] = values['P1862'] = '99')

        let payloads = [
          values['P1896'], values['P2874'], values['P26516'], values['P2885'],
          values['P26575'], values['P26574'], values['P26508'], values['P2894'], values['P1862']
        ]

        // 存在H265时
        if (this.state.h265_enable !== '0') {
          if (values['P26586'] === '') {
            setVals['P26586'] = values['P26586'] = '114'
          }
          payloads.push(values['P26586'])
        }

        Object.keys(setVals).length > 0 && setFieldsValue(setVals)

        if (new Set(payloads).size < payloads.length) {
          message.error($t('m_083'))
          return false
        }

        let vocoderValues = this.parseVocoderValues(this.state.targetVocoders)
        let videoValues = this.parseVideoValues(this.state.targetVideos)
        values = Object.assign({}, values, vocoderValues, videoValues)
        this.submitFormValue(values, 1)
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const { targetVocoders, targetVideos, h265_enable } = this.state
    const options = this.options
    if (!targetVocoders.length) return null

    const disablePresent = !!Number(getFieldValue('P26501'))
    return (
      <Form>
        <h4 className='bak-sub-title'>{$t('c_101')}</h4>
        {/* DTMF */}
        <FormItem label='acct_058' tips='acct_058_tip'>
          <Form.Item className='sub-form-item'>
            {
              gfd('P2801', {
                valuePropName: 'checked',
                normalize: (value) => Number(value)
              })(
                <Checkbox>In audio</Checkbox>
              )
            }
          </Form.Item>
          <Form.Item className='sub-form-item' >
            {
              gfd('P2802', {
                valuePropName: 'checked',
                normalize: (value) => Number(value)
              })(
                <Checkbox>RFC2833</Checkbox>
              )
            }
          </Form.Item>
          <Form.Item className='sub-form-item'>
            {
              gfd('P2803', {
                valuePropName: 'checked',
                normalize: (value) => Number(value)
              })(
                <Checkbox>SIP INFO</Checkbox>
              )
            }
          </Form.Item>
        </FormItem>
        {/* DTMF有效荷载类型 */}
        <InputItem
          {...options['P1896']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 126),
              {
                validator: (data, value, callback) => {
                  if (value === '98' || value === '99') {
                    callback($fm('m_082'))
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
          {...options['P29561']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_102') },
            { v: '1', t: $t('c_103') }
          ]}
        />
        {/* 静音抑制 */}
        <CheckboxItem
          {...options['P1885']}
          gfd={gfd}
        />
        {/* 语音帧/TX */}
        <InputItem
          {...options['P1886']}
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
          {...options['P2873']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: '24kbps ' + $t('c_104') },
            { v: '1', t: '32kbps ' + $t('c_104') }
          ]}
        />
        {/* G.722.1有效荷载类型 */}
        <InputItem
          {...options['P2874']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 126),
              {
                validator: (data, value, callback) => {
                  if (value === '98' || value === '99') {
                    callback($fm('m_082'))
                  } else {
                    callback()
                  }
                }
              }
            ]
          }}
        />
        {/* G.722.1C 速率 */}
        <SelectItem
          {...options['P26517']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: '24kbps ' + $t('c_104') },
            { v: '1', t: '32kbps ' + $t('c_104') },
            { v: '2', t: '48kbps ' + $t('c_104') }
          ]}
        />
        {/* G.722.1C有效荷载类型 */}
        <InputItem
          {...options['P26516']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 126),
              {
                validator: (data, value, callback) => {
                  if (value === '98' || value === '99') {
                    callback($fm('m_082'))
                  } else {
                    callback()
                  }
                }
              }
            ]
          }}
        />
        {/* Opus有效荷载类型 */}
        <InputItem
          {...options['P2885']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 126),
              {
                validator: (data, value, callback) => {
                  if (value === '98' || value === '99') {
                    callback($fm('m_082'))
                  } else {
                    callback()
                  }
                }
              }
            ]
          }}
        />
        {/* iLBC帧大小 */}
        <SelectItem
          {...options['P1895']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: '20ms' },
            { v: '1', t: '30ms' }
          ]}
        />
        {/* 使用200OK SDP中首位匹配编码 */}
        <CheckboxItem
          {...options['P2848']}
          gfd={gfd}
        />
        {/* 开启音频前向纠错 */}
        <CheckboxItem
          {...options['P26573']}
          gfd={gfd}
        />
        {/* 音频FEC有效荷载类型 */}
        <InputItem
          {...options['P26574']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 126)
            ]
          }}
        />
        {/* 音频RED有效荷载类型 */}
        <InputItem
          {...options['P26575']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 126),
              {
                validator: (data, value, callback) => {
                  if (value === '98' || value === '99') {
                    callback($fm('m_082'))
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
          {...options['P1878']}
          gfd={gfd}
        />
        {/* 丢包重传 */}
        <SelectItem
          {...options['P26585']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: 'NACK' },
            { v: '1', t: 'NACK+RTX(SSRC-GROUP)' },
            { v: '2', t: $t('c_098') }
          ]}
        />
        {/* 开启视频前向纠错 */}
        <CheckboxItem
          {...options['P2893']}
          gfd={gfd}
        />
        {/* 视频前向纠错模式 */}
        {/* <RadioGroupItem
          {...options['P26022']}
          gfd={gfd}
          radioOptions={[
            { v: '0', t: '0' },
            { v: '1', t: '1' }
          ]}
        /> */}
        {/* FEC有效荷载类型 */}
        <InputItem
          {...options['P2894']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 127)
            ]
          }}
        />
        {/* 开启FECC */}
        <CheckboxItem
          {...options['P26504']}
          gfd={gfd}
        />
        {/* FECC H.224有效荷载类型 */}
        <InputItem
          {...options['P26508']}
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
          {...options['P2860']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_106') },
            { v: '1', t: $t('c_107') },
            { v: '3', t: $t('c_065') }
          ]}
        />
        {/* 视频抖动缓冲区最大值(ms) */}
        <InputItem
          {...options['P2881']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(0, 1000)
            ]
          }}
        />
        {/* 开启视频渐进刷新 */}
        <CheckboxItem
          {...options['P25111']}
          gfd={gfd}
        />
        {/* 视频编码 */}
        <FormItem label='acct_085' tips='acct_085_tip' hide={ h265_enable === '0' }>
          <Transfer
            className='form-item-transfer'
            titles={[$t('c_053'), $t('c_054')]}
            onChange={this.handleTranserVideo}
            sorter={true}
            dataSource={this.videoSource}
            targetKeys={targetVideos}
            render={item => item.title}
            style={{ marginBottom: 20 }}
          />
        </FormItem>
        {/* H.264 视频大小 */}
        <SelectItem
          {...options['P2807']}
          gfd={gfd}
          onChange={(v) => { this.handleImgSizeChange(v) }}
          selectOptions={[
            { v: '11', t: '4k' },
            { v: '10', t: '1080P' },
            { v: '9', t: '720P' },
            { v: '4', t: '4CIF' },
            { v: '7', t: '4SIF' },
            { v: '1', t: 'VGA' }
          ]}
        />
        {/* 视频比特率 */}
        <SelectItem
          {...options['P2815']}
          gfd={gfd}
          selectOptions={this.state.vbrateAvailable.map((v) => {
            return { v: v, t: v + 'Kbps' }
          })}
        />
        {/* 视频帧率 */}
        <SelectItem
          {...options['P25008']}
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
          {...options['P1862']}
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
          {...options['P26505']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: '0' },
            { v: '1', t: '1' },
            { v: '2', t: $t('c_110') }
          ]}
        />
        {/* H.264 Profile 类型 */}
        <SelectItem
          {...options['P2862']}
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
          {...options['P26545']}
          gfd={gfd}
        />
        {/* H.265有效荷载类型 */}
        <InputItem
          {...options['P26586']}
          gfd={gfd}
          hide={ h265_enable === '0' }
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(96, 126)
            ]
          }}
        />

        <h4 className='bak-sub-title'>{$t('c_114')}</h4>
        {/* 禁止演示 */}
        <CheckboxItem
          {...options['P26501']}
          gfd={gfd}
        />
        {/* 初始INVITE携带媒体信息 */}
        <CheckboxItem
          {...options['PsendPreMode_5']}
          gfd={gfd}
          disabled={disablePresent}
        />
        {/* 演示H.264 视频大小 */}
        <SelectItem
          {...options['P2876']}
          gfd={gfd}
          onChange={(v) => this.handlePreImgSizeChange(v)}
          disabled={disablePresent}
          selectOptions={[
            { v: '10', t: '1080P' },
            { v: '9', t: '720P' }
          ]}
        />
        {/* 演示H.264 Profile类型 */}
        <SelectItem
          {...options['P2877']}
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
          {...options['P2878']}
          gfd={gfd}
          disabled={disablePresent}
          selectOptions={this.state.prevbrateAvailable.map((v) => {
            return { v: v, t: v + 'Kbps' }
          })}
        />
        {/* 演示视频帧率 */}
        <SelectItem
          {...options['P26542']}
          gfd={gfd}
          disabled={disablePresent}
          selectOptions={this.state.preFPSAvailable.map(v => {
            return { v: v, t: v + $t('c_108') }
          })}
        />
        {/* BFCP传输协议 */}
        <SelectItem
          {...options['P26541']}
          gfd={gfd}
          disabled={disablePresent}
          selectOptions={[
            { v: '0', t: $t('c_096') },
            { v: '1', t: 'UDP' },
            { v: '2', t: 'TCP' }
          ]}
        />
        <h4 className='bak-sub-title'>{$t('c_115')}</h4>
        {/* SRTP方式 */}
        <SelectItem
          {...options['P1843']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_098') },
            { v: '1', t: $t('c_116') },
            { v: '2', t: $t('c_117') }
          ]}
        />
        {/* SRTP加密位数 */}
        <SelectItem
          {...options['P2883']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: 'AES 128&256 bit' },
            { v: '1', t: 'AES 128 bit' },
            { v: '2', t: 'AES 256 bit' }
          ]}
        />
        <FormItem label='' >
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default CodecSettings
