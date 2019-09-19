import tlAccount from './tl.account'
import tlCallFeatures from './tl.callFeatures'
import tlNetwork from './tl.network'
import tlApp from './tl.app'
import tlStatus from './tl.status'
import tlSystem from './tl.system'
import tlDeviceCtrl from './tl.deviceControl'
import tlMaintenance from './tl.maintenance'
import { store } from '@/store'

const template = [
  tlAccount,
  tlCallFeatures,
  tlNetwork,
  tlApp,
  tlStatus,
  tlSystem,
  tlDeviceCtrl,
  tlMaintenance
]

export default template

/**
 * 递归查找
 * @param {array} levelAry 层级数组
 * @param {array} target 每一级
 */
const findLevel = (levelAry, target) => {
  if (levelAry.length === 0) {
    return target
  }
  let L = levelAry.shift()
  for (let i = 0; i < target.length; i++) {
    let temp = target[i]
    if (temp.label === L) {
      if (levelAry.length > 0 && !temp.sub) {
        throw new Error('The level configuration item could not be found.[err1]')
      }
      return findLevel(levelAry, temp.sub)
    }
    if (i === target.length - 1) {
      throw new Error('The level configuration item could not be found.[err2]')
    }
  }
}
/**
 * 计算结果
 */
const attrResult = (result, p, item, oemId, BaseProduct, userType) => {
  let key = p
  result[key] = {
    p: p,
    lang: item.lang || '',
    notp: !item.p
  }
  if (
    (item.denyModel && item.denyModel.indexOf(BaseProduct) > -1) || // 当配置项 隐藏的 设备型号和当前型号匹配时
    (item.denyOem && item.denyOem.indexOf(oemId) > -1) || // 当配置项隐藏的oemId 和当前型号oemid匹配时
    (item.onlyAdmin && userType === 'user') // 当配置项只能admin显示 而当前为user用户时
  ) {
    result[key].deny = 1
  }
  if (item.noInit) {
    result[key].noInit = 1
  }
  if (item.reboot) {
    result[key].reboot = 1
  }
  return result
}

/**
 * 获取对应子模块的设置项
 * @param {string} levels eg. account.sip.general
 * @return {object} {P1: {p, hide, noInit?, deny?}, P2: {p, hide, noInit?, deny?}}
 * */
export const getOptions = (levels) => {
  const { oemId, productInfo: { BaseProduct }, userType } = store.getState()
  let levelAry = levels.split('.')
  let lastLevel = findLevel(levelAry, template)
  let result = {}
  lastLevel.forEach(item => {
    let { p, _p } = item
    if (!p && !_p) return false
    let val = p || _p
    if (Object.prototype.toString.call(val) === '[object Array]') {
      val.forEach(i => {
        attrResult(result, i, item, oemId, BaseProduct, userType)
      })
    } else {
      attrResult(result, val, item, oemId, BaseProduct, userType)
    }
  })
  return result
}
