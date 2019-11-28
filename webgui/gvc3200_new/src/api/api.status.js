/**
 * 状态模块api
 */
import _axios from '@/utils/request'

/**
 * voipnetwork
 */
export const getVoipnetworkInfo = (voipvid) => {
  return _axios({
    method: 'get',
    url: '/manager?action=voipnetwork&ethname=eth0.' + voipvid
  })
}

/**
 * 获取运行时长
 */
export const getSysUptime = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=uptime'
  }).then(data => {
    const { Response, ...rest } = data
    return rest
  })
}

/**
 * 获取设备型号
 */
export const getSysProduct = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=product'
  }).then(data => {
    const { Response, ...rest } = data
    return rest
  })
}

/**
 * 获取PN值
 */
export const getSysPn = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=pn'
  }).then(data => {
    const { Response, ...rest } = data
    return rest
  })
}

/**
 * 接口状态 - getHdmiinstate
 */
export const getHdmiinstate = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=gethdmiinstate&region=status'
  })
}

export const getHdmi1state = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=gethdmi1state&region=status'
  })
}

export const getHdmi2state = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=gethdmi2state&region=status'
  })
}

export const getUsbstate = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getusbstate&region=status'
  })
}

export const getSdcardstate = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getsdcardstate&region=status'
  })
}
