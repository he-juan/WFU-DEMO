import React from 'react'
import { Form, Button, message } from 'antd'
import Transfer from '@/components/Transfer'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { SelectItem, InputItem } from '@/components/FormItem'
import { $t } from '@/Intl'

@Form.create()
class CodecSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      vbrateAvailable: [],
      targetVocoders: []
    }

    this.options = getOptions('Account.H323.Codec')

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

    // 语音编码 可选项
    this.vocoderSource = [
      { key: '9', title: 'G.722' },
      { key: '104', title: 'G.722.1' },
      { key: '0', title: 'PCMU' },
      { key: '8', title: 'PCMA' },
      { key: '103', title: 'G.722.1C' }
    ]
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form

    this.initFormValue(this.options).then(data => {
      const { P25037, P25038, P25039, P25040, P25041, ...others } = data
      this.initVocodersTran([P25037, P25038, P25039, P25040, P25041])
      this.setVbrateOptions(data.P25061)
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
    const pAry = ['P25037', 'P25038', 'P25039', 'P25040', 'P25041']
    pAry.forEach((p, i) => {
      result[p] = targets[i] ? targets[i] : ''
    })
    return result
  }

  // 修改h.264 视频大小 更新相应视频比特率可选范围
  handleImgSizeChange = (v) => {
    this.setVbrateOptions(v)
    let P25063 = v === this.INIT_VALUE['P25061'] ? this.INIT_VALUE['P25063'] : this.imgsizeToVbrate[v].defaults
    this.props.form.setFieldsValue({
      P25063
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

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let vocoderValues = this.parseVocoderValues(this.state.targetVocoders)
        values = Object.assign({}, values, vocoderValues)
        this.submitFormValue(values, 1)
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd } = this.props.form
    const { targetVocoders } = this.state
    const options = this.options

    if (!targetVocoders.length) return null

    return (
      <Form>
        <SelectItem
          {...options['P25049']}
          tips='acct_058_tip_2'
          gfd={gfd}
          selectOptions={[
            { v: '0', t: 'In audio' },
            { v: '1', t: 'RFC2833' },
            { v: '2', t: 'H245 signal' }
          ]}
        />
        <FormItem lang='acct_060' >
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
        {/* H.264 视频大小 */}
        <SelectItem
          {...options['P25061']}
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
          {...options['P25063']}
          gfd={gfd}
          selectOptions={this.state.vbrateAvailable.map((v) => {
            return { v: v, t: v + 'Kbps' }
          })}
        />
        {/* 视频帧率 */}
        <SelectItem
          {...options['P25062']}
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
          {...options['P25064']}
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
          {...options['P25072']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: '0' },
            { v: '1', t: '1' },
            { v: '2', t: $t('c_110') }
          ]}
        />

        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default CodecSettings
