import React from 'react'
import { Form, Button, message } from 'antd'
import Transfer from '@/components/Transfer'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem from '@/components/FormItem'
import { $t } from '@/Intl'

@Form.create()
class CodecSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      targetVideos: []
    }

    this.options = getOptions('Account.IPVT.Codec')

    // 视频编码 可选项
    this.videoSource = [
      { key: '99', title: 'H.264' },
      { key: '114', title: 'H.265' }
    ]
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form

    this.initFormValue(this.options).then(data => {
      const { P464, P465, ...others } = data
      this.initVideoTran([P464, P465])
      setFieldsValue(others)
    })
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
    const pAry = ['P464', 'P465']
    pAry.forEach((p, i) => {
      result[p] = targets[i] ? targets[i] : ''
    })
    return result
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        let videoValues = this.parseVideoValues(this.state.targetVideos)
        values = Object.assign({}, values, videoValues)
        this.submitFormValue(values, 1)
      }
    })
  }
  render () {
    const { targetVideos } = this.state
    // if (!targetVideos.length) return null

    return (
      <Form>
        {/* 视频编码 */}
        <FormItem label='acct_085' tips='acct_085_tip' >
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
        <FormItem label='' >
          <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default CodecSettings
