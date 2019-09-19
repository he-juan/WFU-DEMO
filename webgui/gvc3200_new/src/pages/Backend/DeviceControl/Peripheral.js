import React from 'react'
import FormCommon from '@/components/FormCommon'
import FormItem, { SelectItem, SliderItem, CheckboxItem } from '@/components/FormItem'
import { Form, Button } from 'antd'
import { getOptions } from '@/template'
import API from '@/api'
import { $t } from '@/Intl'

@Form.create()
class Peripheral extends FormCommon {
  options = getOptions('DeviceControl.Peripheral')
  state = {
    HDMI1List: [],
    HDMI2List: []
  }
  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
    this.initHDMIStatus()
  }

  // 获取hdmi连接状态并初始化hdmi配置项
  initHDMIStatus = () => {
    const { setFieldsValue } = this.props.form
    API.getHDMIConnectStatus().then(data => {
      // hdmi1
      if (data.hdmi1 === 'true') {
        Promise.all([
          API.getHDMIMode('hdmi1'),
          API.getCurHDMIMode('hdmi1')
        ]).then(dataHDMI1 => {
          if (dataHDMI1[0].res === 'success' && dataHDMI1[1].res === 'success') {
            const _HDMI1List = this.parseResolutionList(dataHDMI1[0].modes)
            this.setState({
              HDMI1List: _HDMI1List
            }, () => setFieldsValue({ HDMI1Res: dataHDMI1[1].mode }))
          }
        })
      } else {
        this.setState({
          HDMI1List: [{ v: '-1', t: $t('c_021') }]
        }, () => setFieldsValue({ HDMI1Res: '-1' }))
      }

      // hdmi2
      if (data.hdmi2 === 'true') {
        Promise.all([
          API.getHDMIMode('hdmi2'),
          API.getCurHDMIMode('hdmi2')
        ]).then(dataHDMI2 => {
          if (dataHDMI2[0].res === 'success' && dataHDMI2[1].res === 'success') {
            const _HDMI2List = this.parseResolutionList(dataHDMI2[0].modes)
            this.setState({
              HDMI2List: _HDMI2List
            }, () => setFieldsValue({ HDMI2Res: dataHDMI2[1].mode }))
          }
        })
      } else {
        this.setState({
          HDMI2List: [{ v: '-1', t: $t('c_021') }]
        }, () => setFieldsValue({ HDMI2Res: '-1' }))
      }
    })
  }

  parseResolutionList = (modes) => {
    let result = []
    modes = modes.split(',')
    modes.forEach((mode, i) => {
      if (mode.indexOf('-P') !== -1) {
        mode = mode.substring(0, mode.length - 2)
        mode += `(${$t('c_020')})`
      }
      result.push({ v: i + '', t: mode })
    })

    return result
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        const { HDMI1Res, HDMI2Res, ...other } = values

        API.setHDMIMode('hdmi1', HDMI1Res)
        API.setHDMIMode('hdmi2', HDMI2Res)
        this.submitFormValue(other)
      }
    })
  }

  render () {
    const { HDMI1List, HDMI2List } = this.state
    const { getFieldDecorator: gfd } = this.props.form
    const options = this.options

    return (
      <Form>
        <h4 className='bak-sub-title'>HDMI</h4>
        {/* HDMI 1输出分辨率 */}
        <SelectItem
          {...options['HDMI1Res']}
          gfd={gfd}
          selectOptions={HDMI1List}
        />
        {/* HDMI 2输出分辨率 */}
        <SelectItem
          {...options['HDMI2Res']}
          gfd={gfd}
          selectOptions={HDMI2List}
        />
        {/* 当接入HDMI时自动开启演示 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P25109']}
        />
        <h4 className='bak-sub-title'>{$t('c_024')}</h4>
        {/* 移动速度 */}
        <SliderItem
          gfd={gfd}
          {...options['P25029']}
          min={1}
          max={16}
        />
        {/* 初始化位置 */}
        <SelectItem
          gfd={gfd}
          {...options['P25030']}
          selectOptions={[
            { v: '0', t: $t('c_022') },
            { v: '1', t: $t('c_023') }
          ]}
        />
        <FormItem>
          <Button className='sub-btn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Peripheral
