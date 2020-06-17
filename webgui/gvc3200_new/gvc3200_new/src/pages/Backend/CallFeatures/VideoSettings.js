import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button } from 'antd'
import FormItem, { SelectItem, CheckboxItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { $t } from '@/Intl'

@Form.create()
class VideoSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      prevbrateAvailable: [],
      preFPSAvailable: []
    }

    this.options = getOptions('CallFeature.VideoSettings')

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
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      // data.P921 = data.P921 || '1'
      setFieldsValue(data)
      this.setPreVbrateOptions(data.P51976)
    })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        this.submitFormValue(values, 1)
      }
    })
  }

    // 修改演示视频大小, 更新演示视频比特率可选范围
    handlePreImgSizeChange = (v) => {
      this.setPreVbrateOptions(v)
      let P51978 = v === this.INIT_VALUE['P51976'] ? this.INIT_VALUE['P51978'] : this.preSizeToPrevbrate[v].defaults
      let P52942 = v === '10' ? '15' : '30'
      this.props.form.setFieldsValue({
        P51978,
        P52942
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

    render () {
      const { getFieldDecorator: gfd } = this.props.form
      const options = this.options
      return (
        <Form>
          {/* 自动开始视频 */}
          <CheckboxItem
            {...options['P25023']}
            gfd={gfd}
          />
          {/* 视频显示模式 */}
          <SelectItem
            {...options['P921']}
            gfd={gfd}
            selectOptions= {[
              { v: '0', t: $t('c_162') },
              { v: '1', t: $t('c_163') },
              { v: '2', t: $t('c_164') }
            ]}
          />
          {/* 触发视频解码跳帧 */}
          <CheckboxItem
            {...options['P22008']}
            gfd={gfd}
          />
          <h4 className='bak-sub-title'>{$t('c_360')}</h4>
          {/* 演示视频分辨率 */}
          <SelectItem
            {...options['P51976']}
            gfd={gfd}
            onChange={(v) => this.handlePreImgSizeChange(v)}
            selectOptions={[
              { v: '10', t: '1080P' },
              { v: '9', t: '720P' }
            ]}
          />
          {/* 演示视频码率 */}
          <SelectItem
            {...options['P51978']}
            gfd={gfd}
            selectOptions={this.state.prevbrateAvailable.map((v) => {
              return { v: v, t: v + 'Kbps' }
            })}
          />
          {/* 演示视频帧率 */}
          <SelectItem
            {...options['P52942']}
            gfd={gfd}
            selectOptions={this.state.preFPSAvailable.map(v => {
              return { v: v, t: v + $t('c_108') }
            })}
          />
          <FormItem>
            <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
          </FormItem>
        </Form>
      )
    }
}

export default VideoSettings
