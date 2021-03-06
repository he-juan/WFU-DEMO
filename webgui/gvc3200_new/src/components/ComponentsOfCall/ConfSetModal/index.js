import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Modal, DatePicker, Input, Select, Checkbox, Cascader, Button, message } from 'antd'
import FormCommon from '@/components/FormCommon'
import moment from 'moment'
import { convertCurrConf } from './ScheduleTools'
import { transStr, deepCopy } from '@/utils/tools'
import API from '@/api'
import InviteMemberModal from '../InviteMemberModal'
import './ConfSetModalStyle.less'
import { $t, $fm } from '@/Intl'
import { history } from '@/App'

const weekOptions = [
  { label: $fm('c_058'), value: 'SU' },
  { label: $fm('c_059'), value: 'MO' },
  { label: $fm('c_060'), value: 'TU' },
  { label: $fm('c_061'), value: 'WE' },
  { label: $fm('c_062'), value: 'TH' },
  { label: $fm('c_063'), value: 'FR' },
  { label: $fm('c_064'), value: 'SA' }
]

const stateObj = {
  '3': $fm('c_245'),
  '2': $fm('c_246'),
  '1': $fm('c_247'),
  '0': $fm('c_248')
}

const googleStatus = {
  '0': $fm('c_365'), // 未确定 改为 已接受
  '1': $fm('c_365'), // 已接受
  '2': $fm('c_366') // 已拒绝
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

let timestampNow = 0 // 全局存一个设备当前时间戳
let timestampNowInter = null

@connect(
  state => ({
    acctStatus: state.acctStatus, // 获取账号状态-所有激活账号
    defaultAcct: state.defaultAcct,
    maxLineCount: state.maxLineCount, // 最大线路数
    linesInfo: state.linesInfo, // 线路信息
    confAccts: state.confAccts || ''
  })
)
// 注意一下，modal 无法被
@Form.create()
class ConfSetModal extends FormCommon {
  static propTypes = {
    visible: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]).isRequired,
    schedules: PropTypes.array, // 会议预约列表
    allDisabled: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    currConf: PropTypes.oneOfType([
      PropTypes.shape({
        Id: PropTypes.string,
        confname: PropTypes.string,
        host: PropTypes.string, // 关联账号 1默认为sip
        confStatedate: PropTypes.object,
        confhours: PropTypes.string,
        confminutes: PropTypes.string,
        // duration: PropTypes.string, 废弃 转为 durationHour durationMin
        durationHour: PropTypes.string,
        durationMin: PropTypes.string,
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

    this.state = {
      presetInfo: [], // 预置位列表
      displayAddModal: false, // 添加成员弹窗
      curMember: [],
      currConf: {},
      dateInfo: {}
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

  // 获取设备时间
  getDateInfo = () => {
    return new Promise((resolve, reject) => {
      API.getDateInfo().then(data => {
        const { res, ...other } = data
        if (res === 'success') resolve(other)
        else reject(new Error('Fail Request'))
      })
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

  // 检测会议密码
  checkPincode () {
    return {
      validator: (data, value, callback) => {
        if (!value || (value && /^\d{0,10}$/.test(value))) {
          callback()
        } else {
          callback($fm('c_294'))
        }
      }
    }
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

    // dayArr hoursArr minutesArr hoursArr1 minutesArr1
    let dayArr = Array(31).fill().map((item, index) => {
      return { v: index + 1, t: index + 1 }
    })
    let hoursArr = []
    let hoursArr1 = []
    Array(24).fill().forEach((item, index) => {
      let hours = transStr(index)
      hoursArr.push({ v: hours, t: hours })
      hoursArr1.push({ v: index, t: index })
    })
    let confminutesIndex = ''
    let minutesArr = []
    let minutesArr1 = []
    Array(12).fill().forEach((item, index) => {
      let minutes = transStr(index * 5)
      minutes = +minutes === 0 ? '00' : minutes
      if (+confminutes > +minutes - 5 && +confminutes < +minutes) {
        confminutesIndex = index
      }
      minutesArr.push({ v: minutes, t: minutes })
      minutesArr1.push({ v: index * 5, t: index * 5 })
    })
    // confminutes
    confminutesIndex > 0 && minutesArr.splice(confminutesIndex, 0, { v: confminutes, t: confminutes })

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
    return { dayArr, hoursArr, hoursArr1, minutesArr, minutesArr1, presetArr, crepeatArr, weekordinalArr, weekdayArr }
  }

  // 关闭弹窗
  onModalCancel = (cb) => {
    this.setState({ curMember: [] })
    cb()
  }

  // 开始日期change
  stateDateChange = (e, str) => {
    let { getFieldValue, setFieldsValue } = this.props.form
    if (e !== null) {
      const obj = { confStatedate1: e }
      if (getFieldValue('repeat') !== '4') {
        const [month, days, date] = [e.month(), e.days(), e.date()]
        obj['dayOfWeek'] = [weekOptions[days].value] // 每周的星期几
        obj['monthWeekDay'] = weekOptions[days].value // 每月 按星期
        obj['monthByDay'] = date // 每月 按日
        obj['yearly'] = [transStr(month + 1), transStr(date)] // 每年
      }
      setFieldsValue(obj)
    }
  }

  // 会议时长的hour change
  durationHourChange = (val) => {
    let { setFieldsValue, getFieldValue } = this.props.form
    const min = getFieldValue('durationMin')
    if (+val === 0) {
      setFieldsValue({ durationMin: +min || 5 })
    }
  }

  // 添加/关闭成员弹窗 --------------------
  handleAddMemberModal = (bool = true) => {
    // 添加时
    if (bool) {
      const { curMember } = this.state
      const { maxLineCount, linesInfo } = this.props
      let temp = linesInfo.concat(curMember) // 与已在通话线路中的成员合并
      let nonIPVTlen = temp.filter(v => +v.acct !== 1).length // 非IPVT线路数量
      let IPVTlen = temp.length - nonIPVTlen // IPVT线路数量
      // 存在ipvt线路且ipvt线路成员不超过200
      let curLinesLen = IPVTlen > 0 ? nonIPVTlen + 1 : nonIPVTlen // 线路总数量, IPVT线路合并为1路
      // 如果当前成员数加已有线路数 大于限制
      if (curLinesLen >= maxLineCount) {
        if (IPVTlen === 0) {
          message.error($t('m_137', { max: maxLineCount })) // 成员数量已达上限
          return false
        } else if (IPVTlen > 0) {
          message.error($t('m_231')) // 通话线路已达上限，当前只能添加ipvt联系人
        }
      }
    }
    this.setState({ displayAddModal: bool })
  }

  // 找到 插入的Item 是否在arr中已存在，存在则返回下标index，否则返回 -1
  handleMemberExit (arr, item) {
    if (arr.length === 0) return -1
    let index = -1
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].number === item.number) {
        index = i
        break
      }
    }
    return index
  }

  // 添加成员弹窗 确认添加
  handleMemberData = (data, callback) => {
    const curMember = data.reduce((sums, item, index) => {
      const exitIndex = this.handleMemberExit(sums, item)
      if (exitIndex > -1) {
        sums.splice(exitIndex, 1)
      }
      sums.push(item)
      return sums
    }, deepCopy(this.state.curMember))

    this.setState({
      curMember,
      displayAddModal: false
    }, () => {
      callback()
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
    let { currConf, dateInfo } = this.state
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
        let setdate = moment(start_time)
        const diff = setdate.diff(moment(dateInfo.Date + ' ' + dateInfo.Time), 'seconds')
        const milliseconds = parseInt(dateInfo.Timestamp / 1000 + diff) * 1000

        // 判断开始时间应该比当前时间+5min晚
        if (moment(start_time).isBefore(moment(timestampNow).add(5, 'minutes'))) {
          return message.error($t('m_127'))
        }
        // 请添加参会成员
        let curMember = this.state.curMember
        if (curMember.length === 0) {
          return message.error($t('m_128'))
        }

        // 继续执行的方法
        const continueFn = () => {
          let host = values.host || '1'
          let confname = values.confname
          let duration = +values.durationMin + 60 * values.durationHour
          let pincode = values.pincode
          let repeat = parseInt(values.repeat)
          let preset = values.preset
          let autoanswer = values.autoanswer || '0'
          let [ repeatRule, membernames, membernumbers, memberaccts, memberemails, recordsfrom, membercalltypes ] = Array(7).fill('') // memberemails
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
              repeatRule = 'FREQ=WEEKLY;BYDAY=' + weekOptions[setdate.days()].value
              break
            // case 4:
            //   let day = parseInt(setdate.date())
            //   let dayweek = parseInt(setdate.days())
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
              memberemails += ':::'
              recordsfrom += ':::'
              membercalltypes += ':::'
            }
            membernames += curMember[i].name
            membernumbers += curMember[i].number
            memberaccts += curMember[i].acct
            memberemails += curMember[i].email
            let type = curMember[i].recordfrom
            if (type === 1 || type === 3) recordsfrom += '3'
            else if (type === 2) recordsfrom += '4'
            else recordsfrom += '5'
            membercalltypes += curMember[i].isvideo || '1'
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
            memberemails,
            recordsfrom,
            membercalltypes
          }

          for (const key in params) {
            params[key] = encodeURIComponent(params[key])
          }
          // 添加一个 会议开始前10分钟提醒 的配置
          params['need_reminder'] = '1'
          // 发送请求
          API.setSchedule(params, modalType).then((msgs) => {
            if (msgs['res'] === 'success') {
              message.success($t('c_181'))
              this.setState({ curMember: [] })
              onCancel() // 关闭弹窗
              updateDate && updateDate() // 更新数据
            } else {
              message.error(msgs['msg'])
            }
          })
        }

        // 会议预约页面才走这步
        const { pathname } = history.location
        if (pathname === '/manage/calling_schedule') {
          for (let i = 0; i < this.props.schedules.length; i++) {
            const { Starttime, Duration, Id, Confstate } = this.props.schedules[i]
            const sTime = moment(Starttime).valueOf()
            const eTime = moment(Starttime).add(+Duration, 'minutes').valueOf()
            if (milliseconds >= sTime && milliseconds <= eTime && currConf.Id !== Id && +Confstate !== 0) {
              // 该时间段内已有其他预约会议，建议调整本次会议时间
              const modal = Modal.confirm({
                title: $t('m_230'),
                okText: $t('b_059'),
                cancelText: $t('b_060'),
                onOk: () => {
                  modal.destroy()
                  continueFn()
                },
                onCancel: () => {
                  modal.destroy()
                }
              })
              return false
            }
          }
        }

        continueFn()
      }
    })
  }

  // componentDidMount
  componentDidMount () {
    this.getPresetInfo()
    this.getDateInfo().then(data => {
      timestampNow = Date.parse(data.Date + ' ' + data.Time)
      const { visible, currConf } = this.props
      let types = typeof visible
      const _currConf = convertCurrConf(currConf, types === 'object' ? 'history' : '', timestampNow)

      this.setState({
        curMember: deepCopy(_currConf.memberData),
        currConf: _currConf,
        dateInfo: data
      })
      timestampNowInter = setInterval(() => {
        timestampNow += 1000
      }, 1000)
    }).catch(err => message.error(err))
  }

  componentWillUnmount () {
    clearInterval(timestampNowInter)
    timestampNowInter = null
  }

  // render
  render () {
    let { acctStatus, confAccts, form: { getFieldDecorator: gfd, getFieldValue: gfv }, visible, allDisabled, onCancel } = this.props
    let { displayAddModal, curMember, currConf } = this.state
    if (!visible || Object.keys(currConf).length === 0) return null
    // 处理repeatArr
    let statedate = (gfv('confStatedate') ? gfv('confStatedate') : currConf.confStatedate).format('YYYY-MM-DD')
    let repeatArr = [
      { v: '0', t: $t('c_257') },
      // { v: '1', t: '每天' },
      { v: '1', t: $t('c_258') },
      { v: '2', t: $fm('c_259', { n: weekOptions[moment(statedate).days()].label }) }, // c_259: '每周（每周一）'
      // { v: '4', t: '每月 (按星期)' },
      { v: '3', t: $fm('c_260', { n: moment(statedate).date() }) }, // c_260: '每月（每月8号）'
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

    // 账号类型
    const accts = {
      '-1': $t('c_219'), // '动态账号'
      '0': 'SIP',
      '1': 'IPVideoTalk',
      '8': 'H.323'
      // '2': 'BlueJeans',
      // '5': 'Zoom'
    }
    let confnamePrefix = ''
    const sip = acctStatus.filter(v => +v.acctIndex === 0)
    confnamePrefix = sip[0].nameOrNum
    confAccts = confAccts || []

    return (
      <>
        <Modal
          visible={!!visible}
          footer={ allDisabled ? null : <div>
            <Button onClick={() => this.onModalCancel(onCancel)}>{$t('b_005')}</Button>
            <Button type='primary' onClick={this.handleOk}>{$t('b_002')}</Button>
          </div> }
          width={800}
          wrapClassName='conf-setmodal'
          title={title}
          onCancel={() => this.onModalCancel(onCancel)}
        >
          <Form hideRequiredMark style={{ minHeight: 400 }}>
            {
              allDisabled && <FormItem label={$t('c_280')}>{stateObj[currConf['confstate']]}</FormItem>
            }
            <FormItem label={$t('c_281')} hide={confAccts.length === 0}>
              {gfd('host', {
                initialValue: currConf['host']
              })(
                <CSelect width='60%' disabled={allDisabled} options={confAccts.map(item => ({ v: item.Id, t: item.Name }))} />
              )}
            </FormItem>
            <FormItem label={$t('c_283')}>
              {gfd('confname', {
                initialValue: currConf['confname'] || (confnamePrefix ? $t('c_489', { s: confnamePrefix }) : ''),
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
            {/* 会议时长 */}
            <FormItem label={$t('c_285')}>
              <Form.Item style={{ width: '25%' }}>
                {gfd('durationHour', {
                  initialValue: currConf['durationHour'],
                  rules: [this.required()]
                })(
                  <CSelect disabled={allDisabled} options={optionObj.hoursArr1} onChange={this.durationHourChange}/>
                )}
              </Form.Item>
              &nbsp;&nbsp;<span>{$t('c_089')}</span>&nbsp;&nbsp;
              <Form.Item style={{ width: '25%' }}>
                {gfd('durationMin', {
                  initialValue: currConf['durationMin'],
                  rules: [this.required()]
                })(
                  <CSelect disabled={allDisabled} options={optionObj.minutesArr1.filter(item => {
                    const hour = gfv('durationHour')
                    if (+hour === 0) return item.v > 0
                    else return item
                  })} />
                )}
              </Form.Item>
              &nbsp;&nbsp;<span>{$t('c_090')}</span>
            </FormItem>
            {/* 预置位 */}
            <FormItem label={$t('c_274')}>
              {gfd('preset', {
                initialValue: currConf['preset']
              })(
                <CSelect disabled={allDisabled} width='40%' options={optionObj.presetArr}/>
              )}
            </FormItem>
            {/* 重复 */}
            <FormItem label={$t('c_286')}>
              {gfd('repeat', {
                initialValue: currConf['repeat']
              })(
                <CSelect disabled={allDisabled} width='40%' options={repeatArr}/>
              )}
            </FormItem>
            {/* 自定义重复 */}
            <FormItem label={$t('c_287')} hide={+gfv('repeat') !== 4}>
              {gfd('customRepeat', {
                initialValue: currConf['customRepeat']
              })(
                <CSelect disabled={allDisabled} width='40%' options={optionObj.crepeatArr}/>
              )}
            </FormItem>
            <FormItem label={intervalStr[gfv('customRepeat')]} hide={+gfv('repeat') !== 4}>
              {gfd('interval', {
                initialValue: currConf['interval'],
                rules: [
                  this.digits(),
                  this.range(1, 99)
                ]
              })(
                <Input disabled={allDisabled} style={{ width: '40%' }} />
              )}
            </FormItem>
            {/* 每周的星期几 */}
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
                  this.checkPincode()
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
                      const name = member.name ? member.name : member.number
                      return (
                        <div className='memberrow' key={index}>
                          <div className='memberinfo'>
                            <div className='ellipsis name' title={name}>{name}</div>
                            <div className='ellipsis' title={member.number}>{member.number} ({accts[member.acct]})</div>
                          </div>
                          { confAccts && gfv('host') !== '1' &&
                            <div className='memberEmaiBox'>
                              <Input disabled={allDisabled} value={member.email || ''} onChange={(e) => this.handleEmail(e, index)} style={{ width: '100%' }}/>
                            </div>
                          }
                          {
                            allDisabled ? <span className={'statecolor' + (+member['googleStatus'] <= 1 ? '1' : member['googleStatus'])}>{googleStatus[member['googleStatus']]}</span> : <span className='icons icon-tdclose' onClick={() => this.deleteMemberData(index)}></span>
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
          !allDisabled && <InviteMemberModal visible={displayAddModal} members={curMember} onCancel={() => this.handleAddMemberModal(false)} handleMemberData={this.handleMemberData} />
        }
      </>
    )
  }
}

export default ConfSetModal
