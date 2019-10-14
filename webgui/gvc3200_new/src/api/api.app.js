import { parseUrlParams } from '@/utils/tools'

/**
 * 应用模块相关api
 */
import _axios from '@/utils/request'
/**
 * 获取默认铃声
 */
export const getRecordingList = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=recording&region=maintenance&type=getrecordinglist'
  })
}

/**
 * 删除录像
 */
export const deleteRecord = (id, path) => {
  return _axios({
    method: 'get',
    url: '/manager?action=recording&region=maintenance&type=deleterecord&id=' + id + '&filename=' + encodeURIComponent(path)
  })
}

/**
 * 获取录像保存路径
 */
export const getRecordingPath = (path) => {
  return _axios({
    method: 'get',
    url: '/manager?action=getrecordingpath'
  })
}

/**
 * 设置录像保存入口
 */
export const setRecordingPath = (path) => {
  return _axios({
    method: 'get',
    url: '/manager?action=setrecordingpath&path=' + path
  })
}

/**
 * 修改录像名称 id, name, newname, pathonly
 */
export const renameRecord = (params = {}) => {
  return _axios({
    method: 'get',
    url: '/manager?action=recording&region=maintenance&type=renamerecord&' + parseUrlParams(params) + '&format=json'
  })
}

/**
 * 锁定和解锁录像
 */
export const setRecordLockstate = (id, lockstate) => {
  return _axios({
    method: 'get',
    url: '/manager?action=recording&region=maintenance&type=lockrecord&id=' + id + '&lockstate=' + lockstate
  })
}

/**
 * 获取第三方app列表
 */
export const getAppList = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getapplist'
  })
}
