/**
 * 系统设置模块api
 */
import _axios from '@/utils/request'

/**
 * 电源管理, 超时操作值获取
 */
export const getTimeoutOpt = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=gettimeoutopt&region=advanset'
  })
}

export const setTimeoutOpt = (type) => {
  return _axios({
    method: 'get',
    url: '/manager?action=settimeoutopt&region=advanset&type=' + type
  })
}

export const getSleepMode = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getsleepmode&region=advanset'
  })
}

export const setSleepMode = (mode) => {
  return _axios({
    method: 'get',
    url: '/manager?action=setsleepmode&region=advanset&sleepmode=' + mode
  })
}

/**
 * 检查是否正在升级
 */
export const isUpgrade = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=isupgrade'
  })
}

/**
 * 重启 关机 睡眠接口
 * @param {number} type 0: 重启； 1：关机； 2：睡眠；  4: 强制重启； 5： 强制关机； 6： 强制睡眠；
 */
export const sysReboot = (reboottype) => {
  return _axios({
    method: 'get',
    url: '/manager?action=reboot&reboottype=' + reboottype
  })
}

/**
 * 设置时区
 * @param {String} value 时区值
 */
export const saveTimeSet = (value) => {
  return _axios({
    method: 'get',
    url: '/manager?action=savetimeset&timezone=' + value
  })
}

/**
 * 设置日期时间
 * @param {Object} param0 {date, time} 日期 和 时间
 */
export const setDateInfo = ({ date, time }) => {
  let dateStr = encodeURIComponent(date)
  let timeStr = encodeURIComponent(time)
  return _axios({
    method: 'get',
    url: `/manager?action=setdateinfo&region=maintenance&datestr=${dateStr}&timestr=${timeStr}`
  })
}

// 语言相关接口 H60不支持

/**
 * 获取语言
 */
export const getLanguage = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getlanguages'
  })
}

/**
 * 设置语言
 * @param {String} lan 语言值
 */
export const putLanguage = (lan) => {
  return _axios({
    method: 'get',
    url: '/manager?action=putlanguage&lan=' + lan
  })
}

/**
 * 设置语言文件
 */
export const importLang = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=importlang'
  })
}

/**
 * 按层级获取可选的语言列表
 * @param {Number} level 层级
 * @param {*} localeId ''
 */
export const getLocaleList = (level, localeId) => {
  return _axios({
    method: 'get',
    url: `/manager?action=getLocaleListByLevel&level=${level}&localeId=${localeId}`
  })
}

/**
 * 获取是否存在自定义的语言文件
 */
export const custLanExist = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=custLanExist'
  })
}

/**
 * 删除自定义语言文件
 */
export const rmCustlan = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=rmcustlan'
  })
}

/**
 * 检测当前管理员密码是否正确
 * @param {string} username admin 或 user
 * @param {string} curpwd 密码
 */
export const checkCurrentPwd = (curpwd, username) => {
  return _axios({
    method: 'get',
    url: `/manager?action=checkcurpwd&username=${username}&curpwd=${encodeURIComponent(curpwd)}`
  })
}

/**
 * 又一个检测密码 判断新密码是不是默认密码 20190711 废弃，原因目前无法修改为默认密码
 * @param {string} username admin 或 user
 */
export const checkPassword = (username, curpwd) => {
  return _axios({
    method: 'get',
    url: `/manager?action=checkpwd&Username=${username}`
  })
}

/**
 * 刪除锁屏密码
 */
export const rmLockPwd = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=clearlock&region=advanset'
  })
}

/**
 * 设置锁屏密码
 */
export const saveLockPwd = (value) => {
  return _axios({
    method: 'get',
    url: '/manager?action=savelockpwd&region=advanset&newlock=' + value
  })
}

/**
 * 获取 VeriCert CA证书
 */
export const getVeriCert = () => {
  return _axios({
    method: 'get',
    url: '/manager?action=getvericert&region=advanset'
  })
}

/**
 * 检查 VeriCert CA证书
 */
export const checkVeriCert = (info) => {
  let url = ''
  if (info.type === 'sipCert') {
    url = '/manager?action=checkvericert&region=advanset&maxnum=' + info.maxnum + '&pvalue0=' + info.pvalue
  } else {
    url = '/manager?action=setcustomcert&region=advanset&pvalue=' + info.pvalue
  }
  return _axios({
    method: 'get',
    url
  })
}
