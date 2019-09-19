/**
 * 通话设置api
 */
import _axios from '@/utils/request'
import { parseUrlParams } from '@/utils/tools'

/**
 * 获取会场信息
 */
export const getSiteNameInfo = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=sqlitedisplay&region=advanset&type=sitesetting&affect=read'
  })
}

/**
 * 设置会场信息
 * http://localhost:8080/manager?action=setSitesettingInfo&region=advanset&bgtp=0&sitename=&dispos=0&disduration=0&fontcolor=&fontsize=0&bold=0&_=1559532453534
 * @param {object} params url参数 { bgtp, sitename, dispos, disduration, fontcolor, fontsize, bold }
 */
export const setSitesettingInfo = (params) => {
  const { bgtp, sitename, dispos, disduration, fontcolor, fontsize, bold } = params
  return _axios({
    method: 'get',
    url: '/manager?action=setSitesettingInfo&region=advanset&' + parseUrlParams({ bgtp, sitename, dispos, disduration, fontcolor, fontsize, bold })
  })
}

/**
 * 设置会场信息 垂直水平偏移量
 * @param {obj} params {vertical, direction}, {horizont, direction}
 */
export const setSitesettingOffset = (params) => {
  return _axios({
    method: 'get',
    url: '/manager?action=setSitesettingOffset&region=advanset&' + parseUrlParams(params)
  })
}

/**
 * 获取 铃声音量,媒体音量,闹钟音量,设备铃声,通知铃声
 */
export const getAudioinfo = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getaudioinfo&region=control'
  })
}

/**
 * 设置 铃声音量,媒体音量,闹钟音量,设备铃声,通知铃声
 */
export const setVolume = (params) => {
  return _axios({
    method: 'get',
    url: '/manager?action=setvolume&region=control&' + parseUrlParams(params)
  })
}

/**
 * 获取设备铃声
 */
export const getTonedblist = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=tonedblist&region=account'
  })
}

/**
 * 获取通知铃声
 */
export const getNotificationdblist = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=notificationdblist&region=account'
  })
}
