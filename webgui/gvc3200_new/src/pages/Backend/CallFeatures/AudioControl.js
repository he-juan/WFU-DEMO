import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button, Spin } from 'antd'
import FormItem, { SelectItem, InputItem, SliderItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import API from '@/api'
import { $t } from '@/Intl'

@Form.create()
class AudioControl extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('CallFeature.AudioControl')
    this.state = {
      notifyRing: [],
      deviceRing: [],
      dataLoading: true
    }
    this.echodelayMap = {
      '-2': '40',
      '-1': '50',
      '0': '60',
      '1': '70',
      '2': '80',
      '3': '90',
      '4': '100',
      '5': '110',
      '6': '120',
      '7': '130',
      '8': '140',
      '9': '150'
    }
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form

    // 获取铃声列表以及相关信息
    Promise.all([
      API.getNotificationdblist(),
      API.getTonedblist(),
      API.getAudioinfo()
    ]).then(res => {
      let notifyRing = this.parseToneList(res[0].Ringtone)
      let deviceRing = this.parseToneList(res[1].Ringtone)
      this.setState({
        notifyRing,
        deviceRing
      })
      // audioInfo 表单的初始化
      let audioInfo = res[2]
      setFieldsValue({
        curRing: audioInfo['curRing'],
        curMedia: audioInfo['curMedia'],
        sysRingtone: audioInfo['sysRingtone'],
        notifyRingtone: audioInfo['notifyRingtone']
      })
      this.setState({
        dataLoading: false
      })
    })

    this.initFormValue(this.options).then(data => {
      // 回声延迟特殊处理

      data['P22280'] = this.getEcodelayValue(data['P22280'])
      setFieldsValue(data)
    })
  }

  // 映射对应的key值
  getEcodelayValue = (v) => {
    let r = Object.entries(this.echodelayMap).filter(item => item[1] === v)[0]
    return r ? r[0] : '-2'
  }
  parseToneList = (ringData) => {
    return ringData.map(ring => ({
      v: `content://media/internal/audio/media/${ring.id}`,
      t: ring.title
    }))
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFieldsAndScroll } = this.props.form
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { curRing, curMedia, sysRingtone, notifyRingtone, ...others } = values

        // 回声延迟特殊处理
        others['P22280'] = this.echodelayMap[others['P22280']]

        if (others['P22050'] !== '5') {
          others['Pecholevel'] = '0'
        }

        this.submitFormValue(others, 1)

        // 设置铃声
        API.setVolume({
          ringVal: curRing,
          mediaVal: curMedia,
          ringTone: encodeURIComponent(sysRingtone),
          notifyTone: encodeURIComponent(notifyRingtone)
        })
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const { deviceRing, notifyRing, dataLoading } = this.state
    const options = this.options

    let audioDeviceVal = getFieldValue('P22050')

    return (
      <Spin spinning={dataLoading} wrapperClassName='common-loading-spin'>
        <Form>
          {/* 回声延迟 */}
          <SliderItem
            {...options['P22280']}
            gfd={gfd}
            min={-2}
            max={9}
          />
          {/* 铃声音量 */}
          <SliderItem
            {...options['curRing']}
            gfd={gfd}
            min={0}
            max={7}
          />
          {/* 媒体音量 */}
          <SliderItem
            {...options['curMedia']}
            gfd={gfd}
            min={0}
            max={15}
          />
          {/* 设备铃声 */}
          <SelectItem
            {...options['sysRingtone']}
            gfd={gfd}
            selectOptions={[
              { v: '', t: $t('c_158') },
              ...deviceRing
            ]}
          />
          {/* 通知铃声 */}
          <SelectItem
            {...options['notifyRingtone']}
            gfd={gfd}
            selectOptions={[
              { v: '', t: $t('c_158') },
              ...notifyRing
            ]}
          />
          {/* 音频设备 */}
          <SelectItem
            {...options['P22050']}
            gfd={gfd}
            selectOptions={[
              { v: '0', t: $t('c_096') },
              { v: '1', t: $t('c_159') },
              { v: '2', t: 'USB' },
              { v: '3', t: 'HDMI' },
              { v: '4', t: $t('c_160') },
              { v: '5', t: $t('c_161') }
            ]}
          />
          {/* 音频回声抑制等级 */}
          <SelectItem
            {...options['Pecholevel']}
            gfd={gfd}
            hide={audioDeviceVal !== '5'}
            selectOptions={[
              { v: '0', t: $t('c_098') },
              { v: '1', t: '1' },
              { v: '2', t: '2' },
              { v: '3', t: '3' },
              { v: '4', t: '4' },
              { v: '5', t: '5' }
            ]}
          />
          {/* 回铃音 */}
          <InputItem
            {...options['P4001']}
            gfd={gfd}
          />
          {/* 忙音 */}
          <InputItem
            {...options['P4002']}
            gfd={gfd}
          />
          {/* 续订音 */}
          <InputItem
            {...options['P4003']}
            gfd={gfd}
          />
          {/* 确认铃音 */}
          <InputItem
            {...options['P4004']}
            gfd={gfd}
          />
          {/* 确认铃音 */}
          <InputItem
            {...options['P4040']}
            gfd={gfd}
          />
          <FormItem>
            <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default AudioControl
