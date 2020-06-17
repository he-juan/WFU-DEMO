/**
 * 设备控制api
 */
import _axios from '@/utils/request'

/**
 * 获取预置位信息 ?
 */
export const getPresetInfo = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getpresetinfo&region=control'
  })
}

/**
 * 下发设置预置位
 * @param {Number} position 预置位position
 */
export const gotoPreset = (position) => {
  return _axios({
    method: 'get',
    url: '/manager?action=sqliteconf&region=apps&type=gotopreset&id=' + position
  })
}

/**
 * 保存(或更新?)预置位
 * @param {Number} position 预置位position
 */
export const addPreset = (position, name) => {
  return _axios({
    method: 'get',
    url: '/manager?action=setpreset&region=control&type=add&position=' + position + '&name=' + name
  })
}

/**
 * 删除预置位
 * @param {Number} position position
 */
export const deletePreset = (position) => {
  return _axios({
    method: 'get',
    url: '/manager?action=setpreset&region=control&type=delete&position=' + position
  })
}

/**
 * 摄像头操作接口
 * @param {String} type 可选值: stop, up, right, down, left, zoomwide, zoomtele, focusone, focusfar, focusnear
 */
export const ptzCtrl = (type) => {
  return _axios({
    method: 'get',
    url: '/manager?action=ptzctrl&region=control&param=0&type=' + type
  })
}

/**
 * 获取hdmi连接状态
 */
export const getHDMIConnectStatus = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=gethdmiconnectstatus&region=advanset'
  })
}

/**
 * 获取可选的hdmi 输出分辨率
 * @param {String} hdmi hdmi1 或 hdmi2
 */
export const getHDMIMode = (hdmi) => {
  return _axios({
    method: 'get',
    url: '/manager?action=gethdmimodes&region=advanset&hdmi=' + hdmi
  })
}

/**
 * 获取当前hdmi 输出分辨率
 * @param {String} hdmi hdmi1 或 hdmi2
 */
export const getCurHDMIMode = (hdmi) => {
  return _axios({
    method: 'get',
    url: '/manager?action=getcurhdmimode&region=advanset&hdmi=' + hdmi
  })
}

/**
 * 设置hdmi分辨率
 * @param {String} hdmi hdmi1 or hdmi2
 * @param {String} value value
 */
export const setHDMIMode = (hdmi, value) => {
  return _axios({
    method: 'get',
    url: `/manager?action=sethdmioutputmode&region=advanset&hdmi=${hdmi}&mode=${value}`
  })
}
