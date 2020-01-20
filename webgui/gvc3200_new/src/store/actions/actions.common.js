import * as Types from '../actionTypes'
import API from '@/api'
import Cookie from 'js-cookie'
import { message } from 'antd'
import { $t } from '@/Intl'

/** ******************************** pure actions ***************************/

/**
 * 设置语言
 */
export const setLocale = (locale) => {
  return {
    type: Types.SET_LOCALE,
    locale: locale
  }
}

/**
 * 设置产品名称
 */
export const setProductInfo = (productInfo) => {
  return {
    type: Types.SET_PRODUCT_INFO,
    productInfo: productInfo
  }
}

/**
 * 设置oemid
 */
export const setOemId = (oemId) => {
  return {
    type: Types.SET_OEM_ID,
    oemId: oemId
  }
}

/**
 * 设置是否应用的状态
 */
export const setNeedApply = (needApply) => {
  return {
    type: Types.SET_NEEDAPPLY,
    needApply: needApply
  }
}

/**
 * 显示全局loading, 应用, 上传等功能会用到
 * @param {Boolean} isLoad 是否显示全局loading
 * @param {String} tip 提示文字
 */
export const setWholeLoading = (isLoad, tip) => {
  return {
    type: Types.SET_WHOLE_LOADING,
    wholeLoading: { isLoad, tip }
  }
}

/**
 * 设置帐号信息
 */
export const setAcctStatus = (acctStatus) => {
  return {
    type: Types.SET_ACCT_STATUS,
    acctStatus
  }
}

/**
 * 设置默认账号
 */
export const setDefaultAcct = (defaultAcct) => {
  return {
    type: Types.SET_DEFAULT_ACCT,
    defaultAcct: defaultAcct
  }
}

/**
 * 设置网络状态
 */
export const setNetworkStatus = (networkStatus) => {
  return {
    type: Types.SET_NETWORK_STATUS,
    networkStatus: networkStatus
  }
}

/**
 * 设置IPVT激活状态
 */
export const setIPVTExist = (exist) => {
  return {
    type: Types.SET_IPVT_EXIST,
    IPVTExist: exist
  }
}

/**
 * 设置时区
 */
export const setTimezone = (timezone) => {
  return {
    type: Types.SET_TIME_ZONE,
    timezone: timezone
  }
}

/**
 * 设置当前日期时间显示格式
 */
export const setDateTimeFmt = (dateTimeFmt) => {
  return {
    type: Types.SET_DATE_TIME_FMT,
    dateTimeFmt
  }
}

/**
 * 设置设备的当前时间戳
 */
export const setTimestampNow = (timestampNow) => {
  return {
    type: Types.SET_TIMESTAMP_NOW,
    timestampNow
  }
}

/**
 * 设置用户类型
 */
export const setUserType = (userType) => {
  return {
    type: Types.SET_USER_TYPE,
    userType
  }
}

/** ******************************** async actions ***************************/

/**
 * 获取产品信息
 */
export const getProduct = () => (dispatch) => {
  API.getProduct().then((data) => {
    const { Response, ...other } = data
    dispatch(setProductInfo({ ...other }))
    Cookie.set('productInfo', { ...other })
    document.title = other.Product
  })
}

/**
 * 获取设置oemId
 */

export const getOemId = () => (dispatch) => {
  API.getOemId().then(data => {
    dispatch(setOemId(data.coloreexist || '0'))
  })
}

/**
 * 获取应用状态
 */
export const getApplyStatus = (type = '') => (dispatch) => {
  API.checkNeedApply().then((data) => {
    if (data.Response === 'Success') {
      // 当属于提交操作时，判断是否需要更新，更换 tip
      type === 'submit' && message.success($t(data.needapply === '1' ? 'm_216' : 'm_001'))
      dispatch(setNeedApply(data.needapply === '1'))
    }
  })
}

/**
 * 获取账号状态
 */
export const getAcctStatus = () => (dispatch) => {
  API.getAcctStatus().then((data) => {
    if (data.Response === 'Success') {
      let acctStatus = []
      const accts = [
        { index: 0, name: 'SIP' },
        { index: 1, name: 'IPVideoTalk' },
        { index: 8, name: 'H.323' }, // H.323 下标为8，用账号6 奇怪！！！
        { index: 2, name: 'BlueJeans' },
        { index: 5, name: 'Zoom' } // 取账号5
      ]
      accts.forEach(({ index: i, name }) => {
        let istr = i === 8 ? 6 : i
        acctStatus.push({
          'acctIndex': i,
          'register': parseInt(data[`Account_${istr}_STATUS`]),
          'activate': parseInt(data[`Account_${istr}_ACTIVATE`]), // 账号激活状态
          'num': data[`Account_${istr}_NO`],
          'server': data[`Account_${istr}_SERVER`],
          'name': name

        })
      })
      dispatch(setAcctStatus(acctStatus))
    }
  })
}

/**
 * 获取默认账号
 */
export const getDefaultAcct = () => (dispatch) => {
  API.getPvalues(['P22046']).then(data => {
    dispatch(setDefaultAcct(+data['P22046']))
  })
}

/**
 * 获取IPVT激活状态
 */
export const getIPVTExist = () => (dispatch) => {
  API.getPvalues(['P7059']).then(data => {
    dispatch(setIPVTExist(+data['P7059']))
  })
}

/**
 * 获取账号相关信息，同时获取账号状态，默认账号, IPVT激活状态
 */
export const getAcctInfo = () => dispatch => {
  Promise.all([
    API.getAcctStatus(),
    API.getPvalues(['P22046', 'P7059'])
  ]).then(data => {
    const [acctData, { P22046, P7059 }] = data
    dispatch(setDefaultAcct(+P22046)) // 默认账号
    dispatch(setIPVTExist(+P7059)) // IPVT 激活状态

    if (acctData.Response === 'Success') {
      let acctStatus = []
      const accts = [
        { index: 0, name: 'SIP' },
        { index: 1, name: 'IPVideoTalk' },
        { index: 8, name: 'H.323' }, // H.323 下标为8，用账号6 奇怪！！！
        { index: 2, name: 'BlueJeans' },
        { index: 5, name: 'Zoom' } // 取账号5
      ]
      accts.forEach(({ index: i, name }) => {
        let istr = i === 8 ? 6 : i
        acctStatus.push({
          'acctIndex': i,
          'register': parseInt(acctData[`Account_${istr}_STATUS`]),
          'activate': (i === 1 && +P7059 === 0) ? 0 : parseInt(acctData[`Account_${istr}_ACTIVATE`]), // 账号激活状态 ipvt 账号激活状态还要看7059的p值
          'num': acctData[`Account_${istr}_NO`],
          'server': acctData[`Account_${istr}_SERVER`],
          'name': name
        })
      })
      dispatch(setAcctStatus(acctStatus)) // 账号状态
    }
  })
}

/**
 * 获取网络状态
 */
export const getNetWorkStatus = () => (dispatch) => {
  API.getNetworkStatus().then(data => {
    let { res, ...rest } = data
    if (data.res === 'success') {
      dispatch(setNetworkStatus(rest))
    }
  })
}

/**
 * 获取时区, 当前时间，当前的日期显示格式
 */
export const getTimeConfig = () => (dispatch) => {
  Promise.all([
    API.getCurTimezone(),
    API.getDateInfo(),
    API.getDateTimeFmt()
  ]).then(data => {
    const [result1, result2, result3] = data
    if (result1.response === 'success') {
      let temp = result1.timezone.name.match(/GMT(\+|\-)(\d+):(\d+)/)
      let timezone = (parseInt(temp[2]) * 3600000 + parseInt(temp[3]) * 60000) * (temp[1] === '+' ? 1 : -1) // 按照时区计算出时间戳偏移量
      dispatch(setTimezone(timezone))
    }
    if (result2.res === 'success') {
      let date = result2.Date
      let time = result2.Time
      dispatch(setTimestampNow(new Date(date + ' ' + time).getTime())) // 设置并存储设备的当前时间戳
    }
    if (result3) {
      let dateFmt = ''
      let timeFmt = ''
      switch (result3.P102) {
        case '0':
        case '3':
          dateFmt = 'YYYY/MM/DD'
          break
        case '1':
          dateFmt = 'MM/DD/YYYY'
          break
        case '2':
          dateFmt = 'DD/MM/YYYY'
          break
        default:
          dateFmt = 'YYYY/MM/DD'
      }
      timeFmt = result3.P122 === '1' ? 'HH:mm' : 'hh:mm A'

      dispatch(setDateTimeFmt({ // 设置日期和时间的显示格式
        dateFmt,
        timeFmt
      }))
    }
  })
}

/**
 * 获取用户类型
 */
export const getUserType = () => (dispatch) => {
  API.getUserType().then(data => {
    if (data.Response === 'Success') {
      dispatch(setUserType(data.User || 'user'))
    }
  })
}
