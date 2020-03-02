import React from 'react'
import { Form, DatePicker, TimePicker, Button } from 'antd'
import FormCommon from '@/components/FormCommon'
import FormItem, { InputItem, SelectItem, CheckboxItem } from '@/components/FormItem'
import { connect } from 'react-redux'
import moment from 'moment'
import { getOptions } from '@/template'
import API from '@/api'
import { setTimezone, setDateTimeFmt } from '@/store/actions'
import { $t } from '@/Intl'

@connect(
  state => ({
    locale: state.locale
  }),
  dispatch => ({
    setTimezone: (timezone) => dispatch(setTimezone(timezone)),
    setDateTimeFmt: (dateTimeFmt) => dispatch(setDateTimeFmt(dateTimeFmt))
  })
)
@Form.create()
class Time extends FormCommon {
  constructor () {
    super()
    this.options = getOptions('System.TimeAndLang.Time')

    this.datefmtMap = {
      '3': 'YYYY/M/D',
      '0': 'YYYY/M/D',
      '1': 'M/D/YYYY',
      '2': 'D/M/YYYY'
    }
    this.timefmtMap = {
      '0': 'hh:mm A',
      '1': 'HH:mm'
    }

    this.state = {
      timezonelist: []
    }
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form
    this.initFormValue(this.options).then(data => {
      setFieldsValue(data)
    })
    this.initTimezone()
    this.initDateInfo()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.locale !== this.props.locale) {
      this.initTimezone()
    }
  }

  // 获取时区列表以及相应的值
  initTimezone = () => {
    const { setFieldsValue } = this.props.form
    const { locale } = this.props
    API.getTimezone(locale).then(data => {
      let _timezonelist = []
      let flag = false
      data.list.forEach(item => {
        _timezonelist.push({ v: item.id, t: item.name })
        if (item.id === data.timezone.id) {
          flag = true
        }
      })
      if (!flag) {
        _timezonelist.push({ v: data.timezone.id, t: data.timezone.name })
      }
      this.setState({
        timezonelist: _timezonelist
      })
      setFieldsValue({ timezone: data.timezone.id })
    })
  }

  // 获取日期信息
  initDateInfo = () => {
    const { setFieldsValue } = this.props.form
    API.getDateInfo().then(data => {
      let date = moment(data.Date, 'YYYY/MM/DD')
      let time = moment(data.Time, 'HH:mm')
      setFieldsValue({
        date,
        time
      })
    })
  }

  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        const { date, time, timezone, ...other } = values
        let _date = date.format('YYYY/M/D')
        let _time = time.format('HH:mm')
        Promise.all([
          API.setDateInfo({
            date: _date,
            time: _time
          }),
          API.saveTimeSet(timezone),
          this.submitFormValue(other)
        ]).then((m) => {
          if (m[0].res === 'success' && m[1].res === 'success') {
            // 设置日期和时间的显示格式
            let dateFmt = this.datefmtMap[values['P102']]
            let timeFmt = this.timefmtMap[values['P122']]
            this.props.setDateTimeFmt({ dateFmt, timeFmt })

            // 按照时区计算出时间戳偏移量
            let match = this.state.timezonelist.filter(item => item.v === timezone)[0]
            let temp = match.t.match(/UTC(\+|\-)(\d+):(\d+)/)
            let _timezone = (parseInt(temp[2]) * 3600000 + parseInt(temp[3]) * 60000) * (temp[1] === '+' ? 1 : -1)
            this.props.setTimezone(_timezone)
            // 这里的处理还需要优化
            setTimeout(() => {
              this.initDateInfo()
            }, 3000)
          }
        })
      }
    })
  }

  render () {
    let { getFieldDecorator: gfd, getFieldValue } = this.props.form
    let { timezonelist } = this.state
    const options = this.options

    let P102 = getFieldValue('P102')
    let P122 = getFieldValue('P122')
    return (
      <Form className='time-page'>
        {/* 指定网络时间协议服务器地址 1 */}
        <InputItem
          gfd={gfd}
          {...options['P30']}
          gfdOptions={{
            rules: [
              this.maxLen(32),
              this.checkUrlPath()
            ]
          }}
        />
        {/* 指定网络时间协议服务器地址 2 */}
        <InputItem
          gfd={gfd}
          {...options['P8333']}
          gfdOptions={{
            rules: [
              this.maxLen(32),
              this.checkUrlPath()
            ]
          }}
        />
        {/* 设置日期 */}
        <FormItem {...options['DatePicker']}>
          {
            gfd('date')(
              <DatePicker format={this.datefmtMap[P102]} allowClear={false} showToday={false} />
            )
          }
        </FormItem>
        {/* 设置时间 */}
        <FormItem {...options['TimePicker']}>
          {
            gfd('time')(
              <TimePicker format={this.timefmtMap[P122]} allowClear={false} />
            )
          }
        </FormItem>
        {/* 时区 */}
        <SelectItem {...options['timezone']} gfd={gfd} selectOptions={timezonelist}
        />
        {/* 启动DHCP option 42设定NTP服务器 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P144']}
          reboot={true}
        />
        {/* 启动DHCP option 2设定时区 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P143']}
          reboot={true}
        />
        {/* 使用24小时格式 */}
        <CheckboxItem
          gfd={gfd}
          {...options['P122']}
        />
        {/* 日期显示格式 */}
        <SelectItem
          gfd={gfd}
          {...options['P102']}
          selectOptions={[
            { v: '3', t: $t('c_016') },
            { v: '0', t: $t('c_017') },
            { v: '1', t: $t('c_018') },
            { v: '2', t: $t('c_019') }
          ]}
        />
        <FormItem>
          <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Time
