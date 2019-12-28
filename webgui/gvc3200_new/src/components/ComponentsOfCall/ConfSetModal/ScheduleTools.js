// ScheduleTools
import moment from 'moment'
import { transStr, convertStr, momentFormat } from '@/utils/tools'
import { store } from '@/store'

// 转化时间
export const convertTimeInfo = (Milliseconds, duration) => {
  let { strRes, objRes } = momentFormat(Milliseconds, { showtime: true, showtoday: true })

  let endTime = objRes.add(duration, 'minutes')

  let range = ` ${strRes} - ${endTime.format(store.getState().dateTimeFmt.timeFmt)}`
  return range
}

// 转换记录 生成 currConf
export const convertCurrConf = (item = '', page = '', timestampNow = '') => {
  let now = moment(+timestampNow || +store.getState().timestampNow).add(10, 'minutes')
  let currConf = {
    Id: '',
    confname: 'xxx发起的会议', // 会议名称 或 主题
    bindAccount: '-1', // 关联帐号
    confStatedate: moment(now, 'YYYY/MM/DD'), // 开始时间
    confhours: transStr(now.hours()),
    confminutes: transStr(now.minutes()),
    duration: '1', // 持续时间 1 默认 1小时 60分钟
    preset: '-1', // 预置位
    repeat: '0', // 重复
    customRepeat: '0', // 自定义重复 每天 每周 每月 (按星期)， 每月 (按日期) 每年
    interval: '1', // 每固定 什么鬼 天
    dayOfWeek: [], // 按每周 周日-周一 checkbox
    monthWeekOrdinal: '1', // 每月 (按星期) 第几周
    monthWeekDay: 'SU', // 每月 (按星期) 周几
    monthByDay: '1', // 每月 (按日期)
    yearly: [transStr(now.month() + 1), transStr(now.date())], // 每年 08， 02
    pincode: '', // 密码
    autoanswer: 0, // 是否开启预约成员无需PIN
    // customEndDate: '', // 添加时不赋值 注意
    memberData: [] // 成员
  }
  // 来自 通话继续重新预约
  if (item && page === 'history') {
    return Object.assign({}, currConf, item)
  }

  if (item) {
    let { Starttime, RepeatRule } = item // RepeatRule 会议的重复策略
    let timeArr = moment(Starttime.replace(/\//g, '-')).format('YYYY/MM/DD HH:mm').split(' ')

    Object.assign(currConf, {
      Id: item.Id,
      confstate: item.Confstate, // 会议状态 预览需要
      confname: item.Displayname, // Displayname 会议名称
      confStatedate: moment(timeArr[0], 'YYYY/MM/DD'),
      confhours: timeArr[1].split(':')[0],
      confminutes: timeArr[1].split(':')[1],
      duration: (item.Duration / 60).toString(), // Duration 会议时长，单位分钟
      preset: item.Preset.toString(), // Preset 预置位id
      repeat: item.Recycle.toString(), // Recycle 会议的重复情况
      pincode: item.Confdnd || '',
      autoanswer: item.Confautoanswer ? +item.Confautoanswer : 0
    })

    // 会议成员
    currConf.memberData = item.Members.map(el => {
      return {
        number: el.Number,
        name: el.Name,
        acct: el.Acctid,
        // calltype: el.RecordFrom 不知道 这个有什么关系
        googleStatus: el.GoogleStatus // 谷歌会议状态
      }
    })

    // 重复规则
    if (currConf.repeat === '7') {
      let ruleobj = convertStr(RepeatRule)
      let { FREQ, BYDAY, INTERVAL, UNTIL, BYMONTHDAY, BYYEARDAY } = ruleobj
      if (INTERVAL) currConf.interval = INTERVAL
      else currConf.interval = ''

      // 存在 UNTIL 则去处理 customEndDate
      if (UNTIL) {
        UNTIL = UNTIL.replace(/T/g, '').replace(/Z/g, '')
        let enddateobj = new Date(UNTIL.substring(0, 4) + '/' + UNTIL.substring(4, 6) + '/' + UNTIL.substring(6, 8) + ' ' + UNTIL.substring(8, 10) + ':' + UNTIL.substring(10, 12))
        // getTimezoneOffset 本地时间与 GMT 时间之间的时间差，以分钟为单位
        enddateobj.setTime(enddateobj.getTime() - enddateobj.getTimezoneOffset() * 60000) // 解决差值
        currConf.customEndDate = moment(enddateobj, 'YYYY/MM/DD')// 格式化 返回对象
      }

      if (FREQ === 'DAILY') {
        currConf.customRepeat = '0'
      } else if (FREQ === 'WEEKLY') {
        currConf.customRepeat = '1'
        if (BYDAY) {
          currConf.dayOfWeek = BYDAY.split(',')
        }
      } else if (FREQ === 'MONTHLY' && ruleobj.hasOwnProperty('BYDAY')) {
        currConf.customRepeat = '2'
        currConf.monthWeekOrdinal = BYDAY.substring(0, 1)
        currConf.monthWeekDay = BYDAY.substring(1, 3)
      } else if (FREQ === 'MONTHLY' && ruleobj.hasOwnProperty('BYMONTHDAY')) {
        currConf.customRepeat = '3'
        currConf.monthByDay = BYMONTHDAY
      } else if (FREQ === 'YEARLY') {
        currConf.customRepeat = '4'
        if (BYYEARDAY) {
          currConf.yearly = BYYEARDAY.split(',')
        }
      }
    }
  }

  return currConf
}
