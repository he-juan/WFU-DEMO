/**
 * 网络设置模块相关api
 */
import _axios from '@/utils/request'
import { parseUrlParams } from '@/utils/tools'

/**
 * ?
 * @param {obj} params {enable, vid, priority}
 */
export const putTwoVlan = ({ enable, vid, priority }) => {
  return _axios({
    method: 'get',
    url: '/manager?action=puttwovlan&' + parseUrlParams({ enable, vid, priority })
  })
}

/**
 * ?
 */
export const putNetwork = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=putnetwork'
  })
}

/**
 * 重启802.1X
 */
export const restart8021x = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=restart8021x'
  })
}

/**
 * openVPN 配置文件解压
 */
export const unzipOpenVPNFile = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=unzipopenvpnfile&region=advanset'
  })
}

/**
 * openVPN 证书上传后的处理接口  // 接口可能有问题
 */
export const setOpenVPNCert = (pvalue) => {
  return _axios({
    method: 'get',
    url: '/manager?action=setopenvpncert&region=advanset&pvalue=' + pvalue
  })
}

/**
 * wifi扫描
 */
export const wifiScan = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=wifiscan'
  })
}

/**
 * 获取wifi列表
 */
export const getWifiList = (start) => {
  return _axios({
    method: 'get',
    url: '/manager?action=getwifilist&start=' + start
  })
}

/**
 * wifi连接接口
 * @param {obj} wifidata wifi 信息 eg.
 * {ssid, bssid, security, networkid, password, eap, phase2, cacert, userca, identity, anonymous, istatic, ipaddr, gateway, prefix,
 * dns1, dns2, ip6addr, ip6prefix, ip6dns1, ip6dns2, saveplusconn
 * }
 */
export const connectWifi = (wifidata) => {
  return _axios({
    method: 'get',
    url: '/manager?action=connectwifi&' + parseUrlParams(wifidata)
  })
}

/**
 * 取消保存
 * @param {string} networkId id
 */
export const forgetWifi = (networkId) => {
  return _axios({
    method: 'get',
    url: '/manager?action=forgetwifi&networkid=' + networkId
  })
}

/**
 * 断开wifi
 */
export const disconnectWifi = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=disconnectwifi'
  })
}

/**
 * 连接到已保存的wifi
 */
export const connectSavedWifi = (networkId) => {
  return _axios({
    method: 'get',
    url: '/manager?action=connectsavedwifi&networkid=' + networkId
  })
}
