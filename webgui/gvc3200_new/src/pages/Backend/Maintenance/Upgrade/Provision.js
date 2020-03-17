import React from 'react'
import { connect } from 'react-redux'
import { Form, Button, Input, Checkbox, Modal, message } from 'antd'
import Transfer from '@/components/Transfer'
import { getOptions } from '@/template'
import FormCommon from '@/components/FormCommon'
import FormItem, { CheckboxItem, SelectItem, InputItem } from '@/components/FormItem'
import { setProp as ApiSetProp } from '@/api/api.maintenance'
import { $t } from '@/Intl'

let INIT_START // 开始时间
let INIT_END // 结束时间

const isChanged = (target) => {
  return target && target.touched
}

// redux connect
@connect(
  state => ({
    productInfo: state.productInfo,
    networkStatus: state.networkStatus
  }),
  dispatch => ({})
)

// antd form.create
@Form.create({
  onFieldsChange (props, fields) {
    if (isChanged(fields.P193) || isChanged(fields.P22296) || isChanged(fields.P8458)) {
      let { P193, P22296, P8458 } = props.form.getFieldsValue(['P193', 'P22296', 'P8458'])
      if ((P22296 === '1' && (P8458 !== 1 || parseInt(P193) <= 1440))) {
        props.form.setFieldsValue({
          P285: ''
        })
      } else {
        props.form.setFieldsValue({
          P285: INIT_START
        })
      }
      if ((P193 && parseInt(P193) <= 1440 && P22296 === '1') || P8458 !== 1) {
        props.form.setFieldsValue({
          P8459: ''
        })
      } else {
        props.form.setFieldsValue({
          P8459: INIT_END
        })
      }
    }
  }
})
class Provision extends FormCommon {
  // constructor
  constructor (props) {
    super(props)

    this.state = {
      isHidePeroid: false,
      isHideRandom: false,
      isHideStartEndHour: false,
      isHideDayofweek: false,
      vocoderData: [], // 穿梭框数据
      vocoderTargetKeys: [],
      other: {
        P22032: '', // enablepnp
        P145: '', // dhcp66
        P40: '', // sipport1
        P413: '', // sipport2
        P513: '', // sipport3
        P613: '', // sipport4
        P1713: '', // sipport5
        P1813: '' // sipport6
      }
    }
    this.options = getOptions('Maintenance.Upgrade.Provision')
    for (let key in this.state.other) {
      this.options[key] = { p: key }
    }
  }

  // componentDidMount
  componentDidMount () {
    const { productInfo, networkStatus } = this.props
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      // 获取额外数据
      let other = {
        P22032: data['P22032'],
        P145: data['P145'],
        P40: data['P40'],
        P413: data['P413'],
        P513: data['P513'],
        P613: data['P613'],
        P1713: data['P1713'],
        P1813: data['P1813']
      }
      for (let key in other) {
        delete data[key]
      }
      data['P286'] = !data['P286'] ? [] : data['P286'].split('/')
      let CFGProvision = data['P8501']
      delete data['P8501']
      // 处理穿梭框数据
      let vocoderData = []
      let vocoderTargetKeys = []
      if (CFGProvision !== undefined) {
        vocoderData = [
          {
            key: 'cfg' + networkStatus['mac'].replace(/:/g, '').toLocaleLowerCase()
          },
          {
            key: 'cfg' + networkStatus['mac'].replace(/:/g, '').toLocaleLowerCase() + '.xml'
          },
          {
            key: 'cfg' + productInfo['BaseProduct'].toLocaleLowerCase() + '.xml'
          },
          {
            key: 'cfg.xml'
          }
        ]
      }
      if (CFGProvision === '') {
        vocoderTargetKeys = vocoderData.map(el => {
          return el.key
        })
      } else {
        vocoderTargetKeys = CFGProvision.split(';').map((item) => {
          return item.replace(/\$product/g, productInfo['BaseProduct']).replace(/\$mac/g, networkStatus['mac']).replace(/:/g, '').toLocaleLowerCase()
        })
      }
      vocoderTargetKeys = Array.from(new Set(vocoderTargetKeys))
      vocoderData = Array.from(new Set(vocoderData.map((el) => {
        return el.key
      }))).map(el => {
        return { key: el }
      })
      this.setState({
        vocoderTargetKeys,
        vocoderData,
        other
      })

      this.handleChangeAutoup(data['P22296'], false) // 处理 隐藏区域
      // 为啥要进行这样的处理，暂废弃
      // if (data['P22296'] === '3' && (data['P285'] === '' || data['P8459'] === '')) {
      //   data['P285'] = ''
      //   data['P8459'] = ''
      // }
      INIT_START = this.INIT_VALUE['P285']
      INIT_END = this.INIT_VALUE['P8459']
      setFieldsValue(data)
    })
  }

  // 自动升级 change
  handleChangeAutoup = (value, bool = true) => {
    let values = this.props.form.getFieldsValue()
    let mode = {}
    if (value === '0' || value === '') { // 如果 自动升级为否 则：
      mode = {
        isHidePeroid: true, // 隐藏 "自动升级检查间隔"
        isHideRandom: true, // 隐藏 "开启随机自动升级"
        isHideStartEndHour: true, // 隐藏 自动升级时间(0-23)
        isHideDayofweek: true // 隐藏 每周的星期几
      }
    } else if (value === '1') { // 如果 自动升级为每分钟检查 则：
      mode = {
        isHidePeroid: false, // 显示 "自动升级检查间隔"
        isHideRandom: false, // 显示 "开启随机自动升级"
        isHideStartEndHour: false, // 显示 "自动升级时间(0-23)"
        isHideDayofweek: true // 隐藏 每周的星期几
      }
      if (bool) {
        if (values['P22296'] === '1' && (values['P8458'] !== 1 || parseInt(values['P193']) <= 1440)) {
          this.props.form.setFieldsValue({
            P285: '',
            P8459: ''
          })
        } else {
          this.props.form.setFieldsValue({
            P285: INIT_START,
            P8459: INIT_END
          })
        }
      }
    } else if (value === '2') { // 如果 自动升级为每天检查
      mode = {
        isHidePeroid: true, // 隐藏 "自动升级检查间隔"
        isHideRandom: false, // 显示 "开启随机自动升级"
        isHideStartEndHour: false, // 显示 "自动升级时间(0-23)"
        isHideDayofweek: true // 隐藏 每周的星期几
      }
    } else if (value === '3') { // 如果 自动升级为每周检查
      mode = {
        isHidePeroid: true, // 隐藏 "自动升级检查间隔"
        isHideRandom: false, // 显示 "开启随机自动升级"
        isHideStartEndHour: false, // 显示 "自动升级时间(0-23)"
        isHideDayofweek: false // 显示 每周的星期几
      }
    }
    this.setState(mode)
  }

  // 配置文件部署 change
  handleVocoderChange = (v) => {
    if (v.length === 0) {
      console.log('...')
      return false
    }
    this.setState({
      vocoderTargetKeys: v
    })
  }

  // 确定保存
  confirmSave = (values) => {
    const { other } = this.state
    // 处理 星期数据
    values['P286'] = values['P286'].join('/')
    // 处理 配置文件部署
    values['P8501'] = this.state.vocoderTargetKeys.join(';')
    if (!values['P8501']) {
      return message.error($t('m_131'))
    }
    this.submitFormValue(values).then(() => {
      INIT_START = values['P285']
      INIT_END = values['P8459']
    }) // 提交修改
    ApiSetProp(3, +other['P145'] === 1 ? 1 : 0)
  }

  // 提交数据
  handleSubmit = () => {
    const { validateFields, setFields } = this.props.form
    const { other } = this.state
    validateFields((err, values) => {
      if (!err) {
        // P22296, P193 分钟间隔 P8458 开启自动升级 P285 开始 P8459 结束
        if (+values['P22296'] > 0) {
          // 满足条件时不能为空 P22296 1 按分钟 2 每天检查，这个地方的判断条件改的次数太多了，有点怪异
          let condition1 = (values['P22296'] === '2' || values['P22296'] === '3') && !values['P285']
          let condition2 = values['P22296'] === '1' && values['P8458'] === 1 && !isNaN(values['P193']) && values['P193'] / 1440 > 1 && !values['P285']
          if (condition1 || condition2) {
            return setFields({
              P285: {
                value: '',
                errors: [new Error($t('m_135'))] // 开始时间不能为空
              }
            })
          }
          // 无论是按分钟还是按天 按周 ，只要开启了随机自动升级 且 开始时间 不会空，则结束时间必填
          if (+values['P8458'] === 1) {
            if (values['P285'] && !values['P8459']) {
              return setFields({
                P8459: {
                  value: '',
                  errors: [new Error($t('m_256'))] // 结束时间不嫩为空
                }
              })
            }
            if ((!values['P8459'] && values['P285']) || (values['P8459'] && !values['P285'])) {
              return message.error($t('m_133')) // 开始时间与结束时间不能为空.
            }
            if (values['P8459'] && (parseInt(values['P285']) > parseInt(values['P8459']))) {
              return message.error($t('m_132')) // 自动升级开始时间不能超过结束时间
            }
          }
          // 按周的情况下 需要判断周几
          if (values['P22296'] === '3' && values['P286'].length === 0) {
            return message.error($t('m_257')) // 每周的星期几不能为空
          }
        }
        // 判断是否弹窗确认
        if (+other['P22032'] === 1 && JSON.stringify(other).includes(':"5060"')) {
          Modal.confirm({
            title: $t('c_042'),
            content: $t('m_134'),
            okText: $t('b_002'),
            cancelText: $t('b_005'),
            onOk: () => {
              this.confirmSave(values)
            }
          })
        } else {
          this.confirmSave(values)
        }
      }
    })
  }

  // render
  render () {
    const { getFieldDecorator: gfd, getFieldsValue } = this.props.form
    const plainOptions = [
      { label: $t('c_058'), value: '0' },
      { label: $t('c_059'), value: '1' },
      { label: $t('c_060'), value: '2' },
      { label: $t('c_061'), value: '3' },
      { label: $t('c_062'), value: '4' },
      { label: $t('c_063'), value: '5' },
      { label: $t('c_064'), value: '6' }
    ]
    const { isHidePeroid, isHideRandom, isHideDayofweek, isHideStartEndHour, vocoderData, vocoderTargetKeys } = this.state

    const options = this.options
    const { P193, P22296, P8458 } = getFieldsValue(['P193', 'P22296', 'P8458'])
    return (
      <Form>
        {/* 自动升级 */}
        <div className='bak-sub-title'><s></s>{$t('c_043')}</div>
        {/* 自动升级 */}
        <SelectItem
          gfd={gfd}
          {...options['P22296']}
          onChange={this.handleChangeAutoup}
          selectOptions={[
            { v: '0', t: $t('c_046') },
            { v: '1', t: $t('c_047') },
            { v: '2', t: $t('c_048') },
            { v: '3', t: $t('c_049') }
          ]}
        />
        {/* 自动升级检查间隔(分) */}
        <InputItem
          gfd={gfd}
          {...options['P193']}
          hide={isHidePeroid}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(60, 5256000)
            ]
          }}
        />
        {/* 开启随机自动升级 */}
        <CheckboxItem
          hide={isHideRandom}
          gfd={gfd}
          {...options['P8458']}
        />
        {/* 自动升级时间(0-23) */}
        <FormItem lang='mai_up_028' hide={isHideStartEndHour}>
          <Form.Item className='sub-form-item'>
            {
              gfd('P285', {
                hidden: isHideStartEndHour,
                rules: [
                  this.digits(),
                  this.range(0, 23)
                ]
              })(
                <Input
                  disabled={
                    (P22296 === '1' && (P8458 !== 1 || parseInt(P193) <= 1440)) // // 如果自动升级类型为每分钟检查(P22296 === ‘1’)时，不勾选随机自动升级((P8458 !== 1) 或 自动升级检查间隔 小于1440
                  }
                  style={{ width: '150px' }}
                ></Input>
              )
            }
          </Form.Item>
          <span style={{ width: '38px', display: 'inline-block', textAlign: 'center' }}>-</span>
          <Form.Item className='sub-form-item' >
            {
              gfd('P8459', {
                hidden: isHideStartEndHour,
                rules: [
                  this.digits(),
                  this.range(0, 23)
                ]
              })(
                <Input disabled={(P193 && parseInt(P193) <= 1440 && P22296 === '1') || P8458 !== 1} style={{ width: '150px' }}></Input>
              )
            }
          </Form.Item>
        </FormItem>
        {/* 每周的星期几 */}
        <FormItem lang='mai_up_029' hide={isHideDayofweek}>
          {
            gfd('P286')(
              <Checkbox.Group options={plainOptions} />
            )
          }
        </FormItem>
        {/* 固件升级和配置文件检测 */}
        <SelectItem
          gfd={gfd}
          {...options['P238']}
          selectOptions={[
            { v: '0', t: $t('c_050') },
            { v: '1', t: $t('c_051') },
            { v: '2', t: $t('c_052') }
          ]}
        />
        {/* 升级时弹出确认框 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P1549']}
        />

        {/* 配置文件部署 */}
        <div className='bak-sub-title'><s></s>{$t('c_044')}</div>
        {/* 配置文件部署 */}
        <FormItem {...options['P8501']}>
          <Transfer
            className='form-item-transfer'
            titles={[$t('c_053'), $t('c_054')]}
            onChange={this.handleVocoderChange}
            sorter={true}
            dataSource={vocoderData}
            targetKeys={vocoderTargetKeys}
            render={item => item.key}
            style={{ marginBottom: 20 }}
          />
        </FormItem>
        <FormItem label=''>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Provision
