/**
 * 账号配置模块相关api
 */
import _axios from '@/utils/request'
/**
 * 获取默认铃声
 */
export const getDefaultRingTone = () => {
  return _axios({
    method: 'get',
    url: '/manager?region=account&action=tonelist'
  })
}

/**
 * 上传本地MOH音频文件后的回调
 */
export const converaudio = (fileext, acctIndex) => {
  return _axios({
    method: 'get',
    url: '/manager?region=account&action=converaudio&ext=' + fileext + '&acct=' + acctIndex
  })
}

/**
 * 自动应答设置生效接口
 * @param {string} param 'region=account&acct=1&value=' + P90
 */
export const autoanswer = (param) => {
  return _axios({
    method: 'get',
    url: '/manager?action=autoanswer&' + param
  })
}

/**
 * 呼叫转移类型 生效接口
 * @param {string} param
 * region=account&acct=1&type=${Pdisplay_0}&number=${PallTo_0}
 * region=account&acct=1&type=${Pdisplay_0}&time1=${Pstarttime_0}&time2=${Pfinishtime_0}&number1=${PinTimeForward_0}&number2=${PoutTimeForward_0}
 * region=account&acct=1&type=${Pdisplay_0}&isbusyto=${PbusyForwardEnable_0}&number1=${PbusyForward_0}&isnoanswerto=${PdelayedForwardEnable_0}&number2=${PdelayedForward_0}&noanswerlimit=${P139}&isdndto=${PdndForwardEnable_0}&number3=${PdndForward_0}
 */
export const callforward = (param) => {
  return _axios({
    method: 'get',
    url: '/manager?action=callforward&' + param
  })
}
