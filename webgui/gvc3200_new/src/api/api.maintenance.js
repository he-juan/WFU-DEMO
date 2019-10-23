/**
 * 维护模块api
 */
import _axios from '@/utils/request'
import { parseUrlParams } from '@/utils/tools'

/**
 * 上传固件前确定是否完全升级
 * @param {Number} upgradeall 0 || 1
 */
export const provisionInit = (upgradeall = 0) => {
  return _axios({
    method: 'get',
    url: '/manager?action=provisioninit&region=maintenance&upgradeall=' + upgradeall
  })
}

/**
 * 上传完成后提示升级
 */
export const upgradeNow = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=upgradenow&region=maintenance'
  })
}

/**
 * ? 初始化上传状态?
 */
export const initupstatus = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=initupstatus&region=maintenance'
  })
}

/**
 * 获取 上传的 conf
 */
export const getImportconf = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=importconf'
  })
}

/**
 * 获取 已保存的 conf
 */
export const getSaveConf = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=saveconf'
  })
}

/**
 * setprop
 */
export const setProp = (type, value) => {
  let url = '/manager?action=setprop&type=' + type + '&value=' + encodeURIComponent(value)

  return _axios({
    method: 'get',
    url
  })
}

/**
 * 复位键功能
 */
export const resetres = (flag) => {
  let url = '/manager?action=factset&resetstyle=' + flag

  return _axios({
    method: 'get',
    url
  })
}

/**
* 清除日志
*/
export const clearLogcat = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=clearlogcat&region=maintenance'
  })
}

/**
 * 获取日志, 设备端生成日志文件
 * @param {String} logTag 日志标签
 * @param {String} logPri 日志优先级
 */
export const getLogcat = (logTag, logPri) => {
  return _axios({
    method: 'get',
    url: `/manager?action=getlogcat&region=maintenance&tag=${logTag}&priority=${logPri}`
  })
}

/**
 * 开始traceroute
 * @param {String} addr 目标域名或ip
 */
export const startTraceroute = (addr) => {
  return _axios({
    method: 'get',
    url: '/manager?action=starttraceroute&addr=' + addr
  })
}

/**
 * traceroute 信息
 * @param {String} offset offset
 */
export const getTracerouteMsg = (offset) => {
  return _axios({
    method: 'get',
    url: '/manager?action=gettracroutemsg&offset=' + offset
  })
}

/**
 * 停止traceroute
 */
export const stopTraceroute = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=stoptracroute'
  })
}

/**
 * 获取是否开启开发者模式
 */
export const getDevelopmode = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=developmode&way=get'
  })
}

/**
 * 设置开启开发者模式
 * @param {Number} mode 0 或 1
 */
export const setDevelopmode = (mode) => {
  return _axios({
    method: 'get',
    url: '/manager?action=developmode&way=set&devestate=' + mode
  })
}

/**
 * 开始ping
 * @param {String} addr ip 或 域名
 * @param {String} type ipv6 或 ipv4
 */
export const startPing = (addr, type) => {
  return _axios({
    method: 'get',
    url: '/manager?action=startping&addr=' + addr + '&type=' + type
  })
}

/**
 * 获取ping结果
 * @param {Number} offset offset
 */
export const getPingMsg = (offset) => {
  return _axios({
    method: 'get',
    url: '/manager?action=getpingmsg&offset=' + offset
  })
}

/**
 * 停止ping
 */
export const stopPing = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=stopping'
  })
}

/**
 * 域名查询
 * @param {String} addr ip 或域名
 */
export const nsLookup = (addr) => {
  return _axios({
    method: 'get',
    url: '/manager?action=nslookup&host=' + addr
  })
}

/**
 * 一键调试
 * @param {Object} params 参数对象 可能包含的键有 mode, syslog, logcat, capture, acce
 */
export const onClickDebug = (params) => {
  return _axios({
    method: 'get',
    url: '/manager?action=oneclickdebug&region=maintenance&' + parseUrlParams(params)
  })
}

/**
 * 抓取列表
 */
export const getTracelist = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=tracelist&region=maintenance'
  })
}

/**
 * 删除调试信息
 * @param {String} tracename 调试信息列表的某一条
 */
export const deleteTrace = (tracename) => {
  return _axios({
    method: 'get',
    url: '/manager?action=deletetrace&tracename=' + tracename
  })
}

export const getCaptureState = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=capture&mode=mode'
  })
}

/**
 * 获取核心转储列表
 */
export const getCoredumplist = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=coredumplist'
  })
}

/**
 * 删除核心存储文件
 * @param {String} coredumpname 核心存储文件
 */
export const deleteCoredump = (coredumpname) => {
  return _axios({
    method: 'get',
    url: '/manager?action=deletecoredump&coredumpname=' + coredumpname
  })
}

/**
 * 停止录音
 */
export const stopRecording = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=stoprecording'
  })
}

/**
 * 开始录音
 */
export const startRecording = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=startrecording'
  })
}

/**
 * 获取录音列表
 */
export const getRecordList = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getrecordlist'
  })
}

/**
 * 删除录音
 */
export const deleteRecord = (recordname) => {
  return _axios({
    method: 'get',
    url: '/manager?action=deleterecord&recordname=' + recordname
  })
}

/**
 * 检查当前是否在录音
 */
export const getRecordState = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getrecordstate&region=maintenacne'
  })
}
