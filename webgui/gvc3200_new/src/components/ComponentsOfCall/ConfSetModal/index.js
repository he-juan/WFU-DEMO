import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, DatePicker, Input, Select, Checkbox, Cascader, Button, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import moment from 'moment'
import { convertCurrConf } from './ScheduleTools'
import { transStr, deepCopy, uniqBy } from '@/utils/tools'
import API from '@/api'
import InviteMemberModal from '../InviteMemberModal'
import './ConfSetModalStyle.less'
import { $t, $fm } from '@/Intl'

const weekOptions = [
  { label: $t('c_058'), value: 'SU' },
  { label: $t('c_059'), value: 'MO' },
  { label: $t('c_060'), value: 'TU' },
  { label: $t('c_061'), value: 'WE' },
  { label: $t('c_062'), value: 'TH' },
  { label: $t('c_063'), value: 'FR' },
  { label: $t('c_064'), value: 'SA' }
]

const stateObj = {
  '3': $t('c_245'),
  '2': $t('c_246'),
  '1': $t('c_247'),
  '0': $t('c_248')
}

const googleStatus = {
  '0': $t('c_254'),
  '1': $t('c_255'),
  '2': $t('c_119'),
  '3': $t('c_256')
}

// 修饰一下 Form.Item
const FormItem = ({ hide = undefined, ...others }) => {
  return (
    <Form.Item style={{ display: typeof hide !== 'undefined' && !!hide ? 'none' : 'block' }} {...others} />
  )
}

// 需要 forwardRef 解决 新api  暴露的问题
let CDatePicker = ({ ...others }, ref) => {
  return (
    <DatePicker ref={ref} {...others} getCalendarContainer={triggerNode => triggerNode} />
  )
}
CDatePicker = forwardRef(CDatePicker)

// 需要 forwardRef 解决 新api  暴露的问题
let CSelect = (props, ref) => {
  let { width, options, ...othter } = props
  return (
    <Select ref={ref} style={{ width }} {...othter} getPopupContainer={triggerNode => triggerNode}>
      {
        options.map(item => (
          <Select.Option value={item.v} key={item.v}>{item.t}</Select.Option>
        ))
      }
    </Select>
  )
}
CSelect = forwardRef(CSelect)

// 注意一下，modal 无法被
@Form.create()
class ConfSetModal extends FormCommon {
  static propTypes = {
    visible: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]).isRequired,
    allDisabled: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    currConf: PropTypes.oneOfType([
      PropTypes.shape({
        Id: PropTypes.string,
        confname: PropTypes.string,
        bindAccount: PropTypes.string,
        confStatedate: PropTypes.object,
        confhours: PropTypes.string,
        confminutes: PropTypes.string,
        duration: PropTypes.string,
        preset: PropTypes.string,
        repeat: PropTypes.string,
        customRepeat: PropTypes.string,
        interval: PropTypes.string,
        dayOfWeek: PropTypes.array,
        monthWeekOrdinal: PropTypes.string,
        monthWeekDay: PropTypes.string,
        monthByDay: PropTypes.string,
        yearly: PropTypes.array,
        pincode: PropTypes.string,
        autoanswer: PropTypes.number,
        customEndDate: PropTypes.object,
        memberData: PropTypes.array
      }),
      PropTypes.string
    ]),
    updateDate: PropTypes.func
  }

  constructor (props) {
    super(props)
    let types = typeof props.visible
    let currConf = convertCurrConf(props.currConf, types === 'object' ? 'history' : '')

    this.state = {
      presetInfo: [], // 预置位列表
      displayAddModal: false, // 添加成员弹窗
      curMember: deepCopy(currConf.memberData),
      currConf
    }
  }

  // 获取预置位列表
  getPresetInfo = () => {
    API.getPresetInfo().then(res => {
      if (res.Response === 'success') {
        this.setState({ presetInfo: res.Data })
      } else {
        message.error(res.Message || $t('m_071'))
      }
    })
  }

  // 获取自定义重复规则
  getCustomRepeatRule = () => {
    let values = this.props.form.getFieldsValue()
    let [freq, byday, byyearday, bymonthday, ordinal, repeatRule] = ['', '', '', -1, -1, []]
    let custype = parseInt(values.customRepeat)
    let interval = values.interval
    let enddate = values.customEndDate

    switch (custype) {
      default:
      case 0:
        freq = 'DAILY'
        break
      case 1:
        freq = 'WEEKLY'
        byday = values['dayOfWeek'].join(',')
        break
      case 2: // 每月按星期
        freq = 'MONTHLY'
        ordinal = values.monthWeekOrdinal
        if (ordinal === '5') byday = '-1'
        else byday = ordinal
        byday += values.monthWeekDay // 拼接周几
        break
      case 3: // 每月按日期
        freq = 'MONTHLY'
        bymonthday = values.monthByDay
        break
      case 4:
        freq = 'YEARLY'
        byyearday = values.yearly.join('')
        break
    }

    if (freq !== '') repeatRule.push('FREQ=' + freq)
    if (+interval > 1) repeatRule.push('INTERVAL=' + interval)
    if (byday !== '') repeatRule.push('BYDAY=' + byday)
    if (bymonthday !== -1) repeatRule.push('BYMONTHDAY=' + bymonthday)
    if (byyearday !== '') repeatRule.push('BYYEARDAY=' + byyearday)

    if (enddate) {
      enddate = enddate.format('YYYY-MM-DD') + ' 23:59'
      let _enddate = new Date(enddate)
      let time = _enddate.getTime()
      let offset = _enddate.getTimezoneOffset()
      _enddate.setTime(time + offset * 60000)
      repeatRule.push('UNTIL=' + moment(_enddate).format('YYYYMMDDTHHmmss') + 'Z')
    }
    return repeatRule.join(';')
  }

  // 不可选中日期
  disabledDate =(current) => {
    return current && current.valueOf() < Date.now()
  }

  // 循环周期 - 不可选中日期
  disabledStartDate = (current) => {
    let { getFieldValue } = this.props.form
    return current && moment(current.valueOf()).isBefore(moment(getFieldValue('confStatedate')))
  }

  // 日期级联选择
  createDateOption = () => {
    let dateOption = []
    let month = [1, 3, 5, 7, 8, 10, 12]
    for (let i = 1; i < 13; i++) {
      let children = []
      for (let j = 1; j < 32; j++) {
        let dayObj = { label: j, value: transStr(j) }

        if (month.includes(i)) {
          children.push(dayObj)
        } else if (i === 2 && j < 29) {
          children.push(dayObj)
        } else if (i !== 2 && j < 31) {
          children.push(dayObj)
        }
      }
      dateOption.push({ label: i, value: transStr(i), children })
    }
    return dateOption
  }

  // 生成相关的下拉框选项
  createOptions = (confminutes) => {
    let { presetInfo } = this.state
    // accountArr
    let accountArr = [
      { v: '-1', t: '本地' },
      { v: '0', t: 'Google账号' }
    ]
    // dayArr hoursArr minutesArr durationArr
    let dayArr = Array(31).fill().map((item, index) => {
      return { v: index + 1, t: index + 1 }
    })
    let hoursArr = Array(24).fill().map((item, index) => {
      let hours = transStr(index + 1)
      return { v: hours, t: hours }
    })
    let confminutesIndex = ''
    let minutesArr = Array(12).fill().map((item, index) => {
      let minutes = transStr(index * 5)
      if (+confminutes > +minutes - 5 && +confminutes < +minutes) {
        confminutesIndex = index
      }
      return { v: minutes, t: minutes }
    })
    // confminutes
    confminutesIndex > 0 && minutesArr.splice(confminutesIndex, 0, { v: confminutes, t: confminutes })

    let durationArr = Array(5).fill().map((item, index) => {
      let duration = index * 0.5 + 1
      return { v: duration, t: duration }
    })
    // presetArr
    let _presetinfo = deepCopy(presetInfo)
    let presetArr = [
      { v: '-1', t: $t('c_065') }
    ]
    _presetinfo.forEach(item => {
      let position = parseInt(item.position)
      let name = item.name ? ('(' + item.name + ')') : ''
      if (position < 24) {
        presetArr.push({ v: position.toString(), t: $t('c_274') + `${position + 1}${name}` })
      }
    })
    let crepeatArr = [
      { v: '0', t: $t('c_263') },
      { v: '1', t: $t('c_264') },
      { v: '2', t: $t('c_265') },
      { v: '3', t: $t('c_266') },
      { v: '4', t: $t('c_267') }
    ]
    let weekordinalArr = [
      { v: '1', t: $t('c_268') },
      { v: '2', t: $t('c_269') },
      { v: '3', t: $t('c_270') },
      { v: '4', t: $t('c_271') },
      { v: '5', t: $t('c_273') }
    ]
    let weekdayArr = weekOptions.map(el => ({ v: el.value, t: el.label }))
    return { accountArr, dayArr, hoursArr, minutesArr, durationArr, presetArr, crepeatArr, weekordinalArr, weekdayArr }
  }

  // 关闭弹窗
  onModalCancel = (cb) => {
    this.setState({ curMember: [] })
    cb()
  }

  // 开始日期change
  stateDateChange = (e, str) => {
    let { setFieldsValue } = this.props.form
    if (e !== null) setFieldsValue({ confStatedate1: e })
  }

  // 添加成员弹窗 --------------------
  handleAddMemberModal = (bool = true) => {
    this.setState({ displayAddModal: bool })
  }

  // 添加成员弹窗 确认添加
  handleMemberData = (data) => {
    let { curMember } = this.state
    let memberArr = uniqBy(curMember.concat(data), 'number')

    this.setState({
      curMember: memberArr,
      displayAddModal: false
    })
  }

  // 删除成员
  deleteMemberData = (index) => {
    let { curMember } = this.state
    curMember.splice(index, 1)
    this.setState({ curMember })
  }

  // email
  handleEmail = (e, index) => {
    let value = e.target.value
    let curMember = this.state.curMember
    curMember[index].email = value
    this.setState({ curMember })
  }

  // 确定 会议了
  handleOk = () => {
    let { allDisabled, form: { validateFields, setFields }, onCancel, updateDate } = this.props
    let { currConf } = this.state
    if (allDisabled) return onCancel()
    validateFields((err, values) => {
      if (!err) {
        let modalType = currConf.Id ? 'edit' : 'add'
        if (values.confStatedate instanceof Object === false) {
          setFields({
            confStatedate: {
              confStatedate: values.confStatedate,
              errors: [new Error('Please select time!')]
            }
          })
          return false
        }

        values.confStatedate = values.confStatedate.format('YYYY-MM-DD')
        let start_time = values.confStatedate + ' ' + values.confhours + ':' + values.confminutes

        // 判断开始时间
        if (moment(start_time).isBefore(moment())) {
          return message.error($t('m_127'))
        }
        let curMember = this.state.curMember
        if (curMember.length === 0) {
          return message.error($t('m_128'))
        }
        let host = 1
        let confname = values.confname
        let duration = 60 * values.duration
        let setdate = new Date(start_time)
        let milliseconds = setdate.getTime()
        let pincode = values.pincode
        let repeat = parseInt(values.repeat)
        let preset = values.preset
        let autoanswer = values.autoanswer || '0'
        let [ repeatRule, membernames, membernumbers, memberaccts, recordsfrom ] = Array(6).fill('') // memberemails
        // 处理重复规则
        switch (repeat) {
          default:
          case 0:
            repeatRule = ''
            break
          // case 1:
          //   repeatRule = 'FREQ=DAILY'
          //   break
          case 1:
            repeatRule = 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR'
            break
          case 2:
            repeatRule = 'FREQ=WEEKLY;BYDAY=' + weekOptions[setdate.getDay()].value
            break
          // case 4:
          //   let day = parseInt(setdate.getDate())
          //   let dayweek = parseInt(setdate.getDay())
          //   let ordinal = Math.ceil(day / 7)
          //   if (ordinal >= 5) ordinal = -1
          //   repeatRule = 'FREQ=MONTHLY;BYDAY=' + ordinal + weekOptions[dayweek].value
          //   break
          case 3:
            repeatRule = 'FREQ=MONTHLY'
            break
          // case 6:
          //   repeatRule = 'FREQ=YEARLY'
          //   break
          case 4:
            repeatRule = this.getCustomRepeatRule()
            break
        }
        // 处理成员
        for (let i = 0; i < curMember.length; i++) {
          if (i > 0) {
            membernames += ':::'
            membernumbers += ':::'
            memberaccts += ':::'
            recordsfrom += ':::'
          }
          membernames += curMember[i].name
          membernumbers += curMember[i].number
          memberaccts += curMember[i].acct
          let type = curMember[i].calltype
          if (type === 1 || type === 3) recordsfrom += 3
          else if (type === 2) recordsfrom += 4
          else recordsfrom += 5
        }

        // 整理参数
        let params = {
          id: currConf.Id,
          host,
          confname,
          duration,
          start_time,
          milliseconds,
          pincode,
          repeat,
          repeatRule,
          preset,
          reminder: 0,
          schedulednd: 0,
          autoanswer,
          membernames,
          membernumbers,
          memberaccts,
          recordsfrom
        }

        for (const key in params) {
          params[key] = encodeURIComponent(params[key])
        }

        // 发送请求
        API.setSchedule(params, modalType).then((msgs) => {
          if (msgs['res'] === 'success') {
            message.success($t('c_181'))
            this.setState({ curMember: [] })
            onCancel() // 关闭弹窗
            updateDate && updateDate() // 更新数据
          } else {
            message.error(msgs['res'])
          }
        })
      }
    })
  }

  // componentDidMount
  componentDidMount () {
    this.getPresetInfo()
  }

  // render
  render () {
    let { form: { getFieldDecorator: gfd, getFieldValue: gfv }, visible, allDisabled, onCancel } = this.props
    if (!visible) return null
    let { displayAddModal, curMember, currConf } = this.state
    // 处理repeatArr
    let statedate = (gfv('confStatedate') ? gfv('confStatedate') : currConf.confStatedate).format('YYYY-MM-DD')
    let repeatArr = [
      { v: '0', t: $t('c_257') },
      // { v: '1', t: '每天' },
      { v: '1', t: $t('c_258') },
      { v: '2', t: $fm('c_259', { n: weekOptions[new Date(statedate).getDay()].label }) }, // c_259: '每周（每周一）'
      // { v: '4', t: '每月 (按星期)' },
      { v: '3', t: $fm('c_260', { n: new Date(statedate).getDate() }) }, // c_260: '每月（每月8号）'
      // { v: '6', t: '每年天' },
      { v: '4', t: $t('c_261') }
    ]

    let title = allDisabled ? $t('c_275') : (currConf.Id === '' ? $t('b_048') : $t('b_052'))
    const dateFormat = 'YYYY/MM/DD'
    const intervalStr = {
      '0': $t('c_276'),
      '1': $t('c_277'),
      '2': $t('c_278'),
      '3': $t('c_278'),
      '4': $t('c_279')
    }
    const DateOptions = this.createDateOption()
    // optionObj
    let optionObj = this.createOptions(currConf['confminutes'])

    // 关联账号
    let showbindAccount = false
    let bindAccount = '-1'
    if (showbindAccount) {
      bindAccount = gfv('bindAccount')
    }

    // confname SIP账号名称发起的会议
    return (
      <>
        <Modal visible={!!visible} onCancel={() => this.onModalCancel(onCancel)} onOk={this.handleOk} width={800} wrapClassName='conf-setmodal' title={title} cancelText={$t('b_005')} okText={$t('b_002')}>
          <Form hideRequiredMark>
            {
              allDisabled && <FormItem label={$t('c_280')}>{stateObj[currConf['confstate']]}</FormItem>
            }
            <FormItem label={$t('c_281')} hide={!showbindAccount}>
              {gfd('bindAccount', {
                initialValue: currConf['bindAccount']
              })(
                <CSelect width='25%' disabled={allDisabled} options={optionObj.accountArr} />
              )}
            </FormItem>
            <FormItem label={$t('c_283')}>
              {gfd('confname', {
                initialValue: currConf['confname'],
                rules: [
                  this.required(),
                  this.maxLen(60)
                ]
              })(
                <Input disabled={allDisabled} style={{ width: '60%' }}/>
              )}
            </FormItem>
            <FormItem label={$t('c_284')}>
              <Form.Item style={{ width: '40%' }}>
                {gfd('confStatedate', {
                  initialValue: currConf['confStatedate']
                })(
                  <CDatePicker disabled={allDisabled} allowClear={false} disabledDate={this.disabledDate} onChange={this.stateDateChange} format={dateFormat}/>
                )}
              </Form.Item>
              &nbsp;&nbsp;
              <Form.Item style={{ width: '25%' }}>
                {gfd('confhours', {
                  initialValue: currConf['confhours'],
                  rules: [this.required()]
                })(
                  <CSelect disabled={allDisabled} options={optionObj.hoursArr}/>
                )}
              </Form.Item>
              &nbsp;<span>:</span>&nbsp;
              <Form.Item style={{ width: '25%' }}>
                {gfd('confminutes', {
                  initialValue: currConf['confminutes'],
                  rules: [this.required()]
                })(
                  <CSelect disabled={allDisabled} options={optionObj.minutesArr}/>
                )}
              </Form.Item>
            </FormItem>
            {/* <FormItem label='开始时间'></FormItem> */}
            <FormItem label={$t('c_285')}>
              {gfd('duration', {
                initialValue: currConf['duration'],
                rules: [this.required()]
              })(
                <CSelect disabled={allDisabled} width='25%' options={optionObj.durationArr}/>
              )}
              &nbsp;&nbsp;<span>{$t('c_089')}</span>
            </FormItem>
            <FormItem label={$t('c_274')}>
              {gfd('preset', {
                initialValue: currConf['preset']
              })(
                <CSelect disabled={allDisabled} width='40%' options={optionObj.presetArr}/>
              )}
            </FormItem>
            <FormItem label={$t('c_286')}>
              {gfd('repeat', {
                initialValue: currConf['repeat']
              })(
                <CSelect disabled={allDisabled} width='40%' options={repeatArr}/>
              )}
            </FormItem>
            <FormItem label={$t('c_287')} hide={+gfv('repeat') !== 4}>
              {gfd('customRepeat', {
                initialValue: currConf['customRepeat']
              })(
                <CSelect disabled={allDisabled} width='40%' options={optionObj.crepeatArr}/>
              )}
            </FormItem>
            <FormItem label={intervalStr[gfv('customRepeat')]} hide={+gfv('repeat') !== 4}>
              {gfd('interval', {
                initialValue: currConf['interval']
              })(
                <Input disabled={allDisabled} style={{ width: '40%' }} />
              )}
            </FormItem>
            <FormItem label={$t('c_288')} hide={+gfv('repeat') !== 4 ? true : +gfv('customRepeat') !== 1}>
              {gfd('dayOfWeek', {
                initialValue: currConf['dayOfWeek']
              })(
                <Checkbox.Group disabled={allDisabled} options={weekOptions} />
              )}
            </FormItem>
            {/* 每月 按星期 */}
            <FormItem label={$t('c_289')} hide={+gfv('repeat') !== 4 ? true : +gfv('customRepeat') !== 2}>
              <Form.Item style={{ width: '40%' }}>
                {gfd('monthWeekOrdinal', {
                  initialValue: currConf['monthWeekOrdinal']
                })(
                  <CSelect disabled={allDisabled} options={optionObj.weekordinalArr}/>
                )}
              </Form.Item>
              &nbsp;-&nbsp;
              <Form.Item style={{ width: '40%' }}>
                {gfd('monthWeekDay', {
                  initialValue: currConf['monthWeekDay']
                })(
                  <CSelect disabled={allDisabled} options={optionObj.weekdayArr}/>
                )}
              </Form.Item>
            </FormItem>
            {/* 每月 按日 */}
            <FormItem label={$t('c_289')} hide={+gfv('repeat') !== 4 ? true : +gfv('customRepeat') !== 3}>
              {gfd('monthByDay', {
                initialValue: currConf['monthByDay']
              })(
                <CSelect disabled={allDisabled} width='40%' options={optionObj.dayArr}/>
              )}
            </FormItem>
            <FormItem label={$t('c_289')} hide={+gfv('repeat') !== 4 ? true : +gfv('customRepeat') !== 4}>
              {gfd('yearly', {
                initialValue: currConf['yearly']
              })(
                <Cascader disabled={allDisabled} options={DateOptions} placeholder={$t('c_290')} style={{ width: '40%' }} />
              )}
            </FormItem>
            <FormItem label={$t('c_291')} hide={+gfv('repeat') !== 4}>
              <Form.Item style={{ width: '40%' }}>
                {gfd('confStatedate1', {
                  initialValue: currConf['confStatedate']
                })(
                  <CDatePicker disabled={true} format={dateFormat}/>
                )}
              </Form.Item>
              &nbsp;-&nbsp;
              <Form.Item style={{ width: '40%' }}>
                {gfd('customEndDate', {
                  initialValue: currConf['customEndDate']
                })(
                  <CDatePicker disabled={allDisabled} disabledDate={this.disabledStartDate} placeholder={$t('c_293')} format={dateFormat}/>
                )}
              </Form.Item>
            </FormItem>
            <FormItem label={$t('c_292')}>
              {gfd('pincode', {
                initialValue: currConf['pincode'],
                rules: [
                  this.digits(),
                  this.maxLen(10)
                ]
              })(
                <Input disabled={allDisabled} style={{ width: '40%' }} placeholder={$t('c_294')}/>
              )}
            </FormItem>
            {
              gfv('pincode') ? <FormItem label=' '>
                {gfd('autoanswer', {
                  valuePropName: 'checked',
                  normalize: (value) => Number(value),
                  initialValue: currConf['autoanswer']
                })(
                  <Checkbox disabled={allDisabled}>{$t('c_295')}</Checkbox>
                )}
              </FormItem> : null
            }
            <FormItem label={(<span className='ant-form-item-required'>{$t('c_296')}</span>)}>
              {
                !allDisabled && <div><Button type='primary' onClick={() => this.handleAddMemberModal(true)}>{$t('b_056')}</Button></div>
              }
              {
                curMember.length > 0 && <div className='memberlist'>
                  {
                    curMember.map((member, index) => {
                      return (
                        <div className='memberrow' key={index}>
                          <div className='memberinfo'>
                            <div className='ellipsis name'>{member.name ? member.name : member.number}</div>
                            <div className='ellipsis'>{member.number}</div>
                          </div>
                          { showbindAccount && bindAccount === '0' &&
                            <div className='memberEmaiBox'>
                              <Input disabled={allDisabled} value={member.email || ''} onChange={(e) => this.handleEmail(e, index)} style={{ width: '100%' }}/>
                            </div>
                          }
                          {
                            allDisabled ? <span className={'statecolor' + member['googleStatus']}>{googleStatus[member['googleStatus']]}</span> : <span className='icons icon-tdclose' onClick={() => this.deleteMemberData(index)}></span>
                          }
                        </div>
                      )
                    })
                  }
                </div>
              }
            </FormItem>
          </Form>
        </Modal>

        {/* 添加成员弹窗 */}
        {
          !allDisabled && <InviteMemberModal visible={displayAddModal} onCancel={() => this.handleAddMemberModal(false)} handleMemberData={this.handleMemberData} isJustAddMember={true}/>
        }
      </>
    )
  }
}

export default ConfSetModal
