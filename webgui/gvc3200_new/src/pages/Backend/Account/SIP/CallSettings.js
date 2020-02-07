import React from 'react'
import { Form, Input, Select, Checkbox, Button, Tooltip, Icon, Upload, Modal, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import { getOptions } from '@/template'
import FormItem, { CheckboxItem, SelectItem, InputItem } from '@/components/FormItem'
import { prefixInteger } from '@/utils/tools'
import { history } from '@/App'
import { connect } from 'react-redux'
import API from '@/api'
import Cookie from 'js-cookie'
import { $t } from '@/Intl'
import { setWholeLoading } from '@/store/actions'

import './CallSettings.less'

const Option = Select.Option
const CheckGroup = Checkbox.Group

@connect(
  state => ({}),
  dispatch => ({
    setWholeLoading: (isLoad, tip) => dispatch(setWholeLoading(isLoad, tip))
  })
)
@Form.create()
class CallSettings extends FormCommon {
  constructor (props) {
    super(props)

    this.options = getOptions('Account.SIP.Call')

    this.state = {
      ringtones: []
    }
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    // 表单初始化
    this.initFormValue(this.options).then(data => {
      const { P2382, ...others } = data
      others['P2382'] = this.parseP2382(P2382)
      setFieldsValue(others)
    })
    this.getDefaultRingTone()
  }

  // 获取默认铃声
  getDefaultRingTone = () => {
    // 获取铃声
    API.getDefaultRingTone().then(data => {
      if (data.Response !== 'Success') return false
      let ringtones = data.Ringtone
      ringtones = ringtones.sort().map(v => {
        let ringTitle = v.split('.')[0]
        return {
          value: '/system/media/audio/ringtones/' + v,
          title: ringTitle
        }
      })
      this.setState({
        ringtones: ringtones || []
      })
    })
  }

  // P2382 值映射成二进制 取其index, 组成数组, 初始化对于的checkbox.group
  parseP2382 (v) {
    let result = []
    let binary = prefixInteger(Number(v).toString(2), 5)
    binary.split('').forEach((v, i) => {
      if (v === '1') {
        result.push(i)
      }
    })
    return result
  }

  // P2382 数组转成提交时需要的P值
  deParseP2382 (ary) {
    let temp = ['0', '0', '0', '0', '0']
    ary.forEach(v => {
      temp[v] = '1'
    })
    let result = parseInt(Number(temp.join('')), 2)

    return result
  }

  // 将 自动应答 和 呼叫转移类型 的接口存储在Cookie中, 点击应用时调用
  saveFunToCookie = (values) => {
    const {
      P90,
      Pdisplay_0,
      PallTo_0,
      Pstarttime_0,
      Pfinishtime_0,
      PinTimeForward_0,
      PoutTimeForward_0,
      PbusyForwardEnable_0,
      PbusyForward_0,
      PdelayedForwardEnable_0,
      PdelayedForward_0,
      P139,
      PdndForwardEnable_0,
      PdndForward_0 } = values
    // let applyFun = JSON.parse(Cookie.get('applyFun') || '[]')
    let applyFun = []

    applyFun.push({
      action: 'autoanswer',
      param: encodeURIComponent('region=account&acct=0&value=' + P90)
    })

    switch (Pdisplay_0) {
      case 'allTo' :
        applyFun.push({
          action: 'callforward',
          param: encodeURIComponent(`region=account&acct=0&type=${Pdisplay_0}&number=${PallTo_0}`)
        })
        break
      case 'TimeRule' :
        applyFun.push({
          action: 'callforward',
          param: encodeURIComponent(`region=account&acct=0&type=${Pdisplay_0}&time1=${Pstarttime_0}&time2=${Pfinishtime_0}&number1=${PinTimeForward_0}&number2=${PoutTimeForward_0}`)
        })
        break
      case 'WorkRule' :
        applyFun.push({
          action: 'callforward',
          param: encodeURIComponent(`region=account&acct=0&type=${Pdisplay_0}&isbusyto=${PbusyForwardEnable_0}&number1=${PbusyForward_0}&isnoanswerto=${PdelayedForwardEnable_0}&number2=${PdelayedForward_0}&noanswerlimit=${P139}&isdndto=${PdndForwardEnable_0}&number3=${PdndForward_0}`)
        })
        break
      default:
        applyFun.push({
          action: 'callforward',
          param: 'region=account&acct=0&type=None'
        })
    }
    Cookie.set('applyFun', JSON.stringify(applyFun), { expires: 365 })
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        values['P2382'] = this.deParseP2382(values['P2382'])
        values['P290'] = encodeURIComponent(values['P290'])
        this.saveFunToCookie(values)
        this.submitFormValue(values, 1)
      }
    })
  }

  render () {
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const { ringtones } = this.state
    const options = this.options
    // 呼叫转移类型
    const CFType = getFieldValue('Pdisplay_0')

    // 铃声选择
    const RingSelect = (
      <Select>
        <Option value='content://settings/system/ringtone'>{$t('c_138')}</Option>
        <Option value='ringtone_silence'>Silent</Option>
        {
          ringtones.map((ring, i) => <Option value={ring.value} key={i}>{ring.title}</Option>)
        }
      </Select>
    )
    const _this = this
    // 上传MOH
    const MOHUploadProps = {
      name: 'file',
      showUploadList: false,
      accept: '.wav,.mp3',
      action: '/upload?type=audiofile&acct=0',
      headers: {
      },
      onChange (info) {
        if (info.file.response && info.file.response.indexOf('Authentication Required') > -1) {
          history.push(`/login?redirect=${encodeURIComponent(history.location.pathname)}`)
          return false
        }
        if (info.file.status === 'uploading') {
          _this.props.setWholeLoading(true, $t('m_062'))
        }
        if (info.file.status === 'done') {
          let fileext = info.file.name.split('.').pop()
          API.converaudio(fileext, 0).then((m) => {
            _this.props.setWholeLoading(false, '')
            Modal.info({
              title: m.Response === 'Success' ? $t('m_085') : $t('m_019'),
              okText: $t('b_002'),
              onOk () {}
            })
          })
        } else if (info.file.status === 'error') {
          message.error($t('m_019'))
        }
      },
      beforeUpload: (file) => {
        return new Promise((resolve, reject) => {
          let ext = file.name.split('.').pop()
          if (!(ext && (/^(wav)$/.test(ext) || /^(mp3)$/.test(ext)))) {
            Modal.info({
              title: $t('m_086'),
              okText: $t('b_002'),
              onOk () {}
            })
            reject(Error(''))
          } else {
            resolve(file)
          }
        })
      }
    }

    return (
      <Form hideRequiredMark>
        {/* 远程视频请求 */}
        <SelectItem
          {...options['P2326']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_042') },
            { v: '1', t: $t('c_118') },
            { v: '2', t: $t('c_119') }
          ]}
        />
        {/* 常用布局模式 */}
        <SelectItem
          {...options['P29070']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_120') },
            { v: '1', t: $t('c_121') },
            { v: '2', t: $t('c_122') },
            { v: '3', t: $t('c_123') }
          ]}
        />
        {/* 拨号前缀 */}
        <InputItem
          {...options['P66']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 禁用拨号规则 */}
        <FormItem {...options['P2382']}>
          {
            gfd('P2382')(
              <CheckGroup options={[
                { label: $t('c_124'), value: 4 },
                { label: $t('c_125'), value: 3 },
                { label: $t('c_126'), value: 2 },
                { label: $t('c_127'), value: 1 },
                { label: 'Click2Dial', value: 0 }
              ]} />
            )
          }
        </FormItem>
        {/* 拨号规则 */}
        <InputItem
          {...options['P290']}
          gfd={gfd}
        />
        {/* 使用Refer-To报文头转移 */}
        <CheckboxItem
          {...options['P135']}
          gfd={gfd}
        />
        {/* 自动应答 */}
        <SelectItem
          {...options['P90']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_046') },
            { v: '1', t: $t('c_045') }
          ]}
        />
        {/* 发送匿名 */}
        <CheckboxItem
          {...options['P65']}
          gfd={gfd}
        />
        {/* 拒绝匿名呼叫 */}
        <CheckboxItem
          {...options['P129']}
          gfd={gfd}
        />
        {/* 呼叫日志 */}
        <SelectItem
          {...options['P182']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_128') },
            { v: '1', t: $t('c_129') },
            { v: '2', t: $t('c_130') }
          ]}
        />
        {/* 特殊模式 */}
        <SelectItem
          {...options['P198']}
          gfd={gfd}
          selectOptions={[
            { v: '100', t: $t('c_106') },
            { v: '102', t: 'BroadSoft' },
            { v: '108', t: 'CBCOM' },
            { v: '109', t: 'RNK' },
            { v: '113', t: $t('c_131') },
            { v: '114', t: 'ZTE IMS' },
            { v: '115', t: 'Mobotix' },
            { v: '116', t: 'ZTE NGN' },
            { v: '117', t: $t('c_132') }
          ]}
        />
        {/* 功能键同步 */}
        <SelectItem
          {...options['P2325']}
          gfd={gfd}
          selectOptions={[
            { v: '0', t: $t('c_066') },
            { v: '1', t: 'BroadSoft' }
          ]}
        />
        {/* 激活呼叫功能 */}
        <CheckboxItem
          {...options['P191']}
          gfd={gfd}
        />
        {/* 振铃超时时间 */}
        <InputItem
          {...options['P1328']}
          gfd={gfd}
          gfdOptions={{
            rules: [
              this.digits(),
              this.range(0, 300)
            ]
          }}
        />
        {/* #键拨号 */}
        <CheckboxItem
          {...options['P72']}
          gfd={gfd}
        />
        {/* 上传本地MOH音频文件 */}
        <FormItem {...options['MOHUploadProps']}>
          <Upload {...MOHUploadProps}>
            <Button>
              <Icon type='upload' /> {$t('b_016')}
            </Button>
          </Upload>
        </FormItem>
        {/* 开启本地MOH功能 */}
        <CheckboxItem
          {...options['P2357']}
          gfd={gfd}
        />
        {/* 帐号默认铃声 */}
        <FormItem {...options['P104']}>
          {
            gfd('P104', {
              normalize: (v) => v === '' ? 'content://settings/system/ringtone' : v
            })(
              RingSelect
            )
          }
        </FormItem>
        <h4 className='bak-sub-title'>{$t('c_133')}</h4>
        {/* 呼叫转移类型 */}
        <SelectItem
          {...options['Pdisplay_0']}
          gfd={gfd}
          selectOptions={[
            { v: 'None', t: $t('c_065') },
            { v: 'allTo', t: $t('c_134') },
            { v: 'TimeRule', t: $t('c_135') },
            { v: 'WorkRule', t: $t('c_136') }
          ]}
        />
        {/* 无条件到 */}
        <InputItem
          {...options['PallTo_0']}
          gfd={gfd}
          hide={CFType !== 'allTo'}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 时间段 */}
        <FormItem label='acct_123' tips='acct_123_tip' hide={CFType !== 'TimeRule'} className='time-quantum'>
          <Form.Item className='sub-form-item'>
            {
              gfd('Pstarttime_0', {
                rules: [
                  this.checkoutTimeformat()
                ],
                hidden: CFType !== 'TimeRule'
              })(
                <Input />
              )
            }
          </Form.Item>
          <em>~</em>
          <Form.Item className='sub-form-item'>
            {
              gfd('Pfinishtime_0', {
                rules: [
                  this.checkoutTimeformat()
                ],
                hidden: CFType !== 'TimeRule'
              })(
                <Input />
              )
            }
          </Form.Item>
        </FormItem>
        {/* 时间段内转移到 */}
        <InputItem
          {...options['PinTimeForward_0']}
          gfd={gfd}
          hide={CFType !== 'TimeRule'}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 时间段外转移到 */}
        <InputItem
          {...options['PoutTimeForward_0']}
          gfd={gfd}
          hide={CFType !== 'TimeRule'}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 开启遇忙转移 */}
        <CheckboxItem
          {...options['PbusyForwardEnable_0']}
          gfd={gfd}
          hide={CFType !== 'WorkRule'}
        />
        {/* 本地忙到 */}
        <InputItem
          {...options['PbusyForward_0']}
          gfd={gfd}
          hide={CFType !== 'WorkRule'}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 开启无应答转移 */}
        <CheckboxItem
          {...options['PdelayedForwardEnable_0']}
          gfd={gfd}
          hide={CFType !== 'WorkRule'}
        />
        {/* 无应答到 */}
        <InputItem
          {...options['PdelayedForward_0']}
          gfd={gfd}
          hide={CFType !== 'WorkRule'}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        {/* 无应答超时时间(秒) */}
        <InputItem
          {...options['P139']}
          gfd={gfd}
          hide={CFType !== 'WorkRule'}
          gfdOptions={{
            rules: [
              this.required(),
              this.digits(),
              this.range(1, 120)
            ]
          }}
        />
        {/* 开启勿扰转移 */}
        <CheckboxItem
          {...options['PdndForwardEnable_0']}
          gfd={gfd}
          hide={CFType !== 'WorkRule'}
        />
        {/* 勿扰时到 */}
        <InputItem
          {...options['PdndForward_0']}
          gfd={gfd}
          hide={CFType !== 'WorkRule'}
          gfdOptions={{
            rules: [
              this.maxLen(64)
            ]
          }}
        />
        <h4 className='bak-sub-title'>{$t('c_137')}</h4>
        <div className='call-setting-rings'>
          <p className='ring-titles'>
            <span>{$t('acct_148')} <Tooltip title={<span dangerouslySetInnerHTML={{ __html: $t('acct_148_tip') }}></span>} ><Icon type='question-circle-o' /></Tooltip></span>
            <span>{$t('acct_149')} <Tooltip title={$t('acct_149_tip')} ><Icon type='question-circle-o' /></Tooltip></span>
          </p>
          <div className='bak-form-item'>
            <span>
              {gfd('P1488')(<Input />)}
            </span>
            <span>
              {gfd('P1489', {
                normalize: (v) => v === '' ? 'content://settings/system/ringtone' : v
              })(RingSelect)}
            </span>
          </div>
          <div className='bak-form-item'>
            <span>
              {gfd('P1490')(<Input />)}
            </span>
            <span>
              {gfd('P1491', {
                normalize: (v) => v === '' ? 'content://settings/system/ringtone' : v
              })(RingSelect)}
            </span>
          </div>
          <div className='bak-form-item'>
            <span>
              {gfd('P1492')(<Input />)}
            </span>
            <span>
              {gfd('P1493', {
                normalize: (v) => v === '' ? 'content://settings/system/ringtone' : v
              })(RingSelect)}
            </span>
          </div>
        </div>
        <FormItem label='' >
          <Button className='sub-btn' onClick={this.handleSubmit} id='subBtn'>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default CallSettings
