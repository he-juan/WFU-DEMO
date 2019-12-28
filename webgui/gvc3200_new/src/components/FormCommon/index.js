/**
 * 表单可复用封装  // 通过继承来达到复用, 目前还其他合适的方法达到复用, 高阶组件感觉不太好
 */
import { Component } from 'react'
import API from '@/api'
import { store } from '@/store'
import { getApplyStatus } from '@/store/actions'
import { message } from 'antd'
import { $t, $fm, formatMessage } from '@/Intl'
import { rebootNotify } from '@/utils/rebootNotify'

// 定义一些 额外的重启项 但是 不走 rebootNotify 逻辑的那种
const specialRebootOptions = [
  'upgradefile', // 升级-固件-上传固件文件更新
  'importcfg', // 升级-配置升级-上传设备配置
  'safemode' // 升级-高级设置-安全模式
]

class FormCommon extends Component {
  // 储存初始化的表单数据
  INIT_VALUE = null

  RebootOptions = {} // initFormValue时存储重启配置项
  ShouldReboot = false // 是否应该提示重启提示弹窗

  /** 表单初始化 */
  initFormValue = (options) => {
    let params = [] // 供API.getPvalues 调用的p值数组
    let keys = Object.keys(options)

    keys.filter(key => !options[key].noInit && !options[key].deny && !options[key].notp).forEach((key, i) => {
      let item = options[key]
      params.push(item.p)
    })

    return API.getPvalues(params).then(data => {
      this.INIT_VALUE = data
      // 保存 重启配置初始值
      for (const key in options) {
        if (options[key].reboot && !options[key].deny && !specialRebootOptions.includes(key)) {
          this.RebootOptions[key] = data[key]
        }
      }
      return Promise.resolve(data)
    }).catch((err) => {
      console.error(err)
      message.error($t('m_071'))
    })
  }
  /** 表单提交 */
  submitFormValue = (params, flag = 0, isApply = 1) => {
    return API.putPvalues(params, flag).then((data) => {
      isApply === 1 && store.dispatch(getApplyStatus('submit')) // 默认 通知 apply

      if (data.Response.toLocaleLowerCase() === 'success') {
        if (Object.keys(this.RebootOptions).length > 0 || this.ShouldReboot) {
          // 判断是否 弹出 重启提示弹窗
          rebootNotify({ oldOptions: this.RebootOptions, newOptions: params, immediate: this.ShouldReboot }, () => {
            if (this.ShouldReboot) {
              this.ShouldReboot = false
              return false
            }
            for (const key in this.RebootOptions) {
              if (params[key] !== null && params[key] !== undefined) {
                this.RebootOptions[key] = params[key].toString()
              }
            }
          })
        }
      }
      return Promise.resolve(data)
    }).catch(err => {
      console.error(err)
      // 当在安全设置中修改了页面/远程访问后，由于即时生效导致 url 发生变化，所以不在进行 抛出错误处理
      if (params['P900'] !== this.INIT_VALUE['P900'] || params['901'] !== this.INIT_VALUE['P901']) {
        return false
      }
      message.error($t('m_002'))
    })
  }

  /** 表单验证 */
  // 网址格式 包含ipv6
  checkaddressPath () {
    return {
      validator: (data, value, callback) => {
        var expression = /^((https?:\/\/)?|(ftp:\/\/)?|(tftp:\/\/)?)(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i
        var expression1 = /^(((https?:\/\/)?|(ftp:\/\/)?|(tftp:\/\/)?)((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:)|(\[([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[[0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){1,7}:\](:[1-9]([0-9]){0,4}){0,1}))(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?)$/
        if (!value || expression.test(value) || expression1.test(value)) {
          callback()
        } else {
          callback($fm('m_072'))
        }
      }
    }
  }

  // 检测是否是ipv6
  checkIpv6 () {
    return {
      validator: (data, value, callback) => {
        const reg = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:)|(\[([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[[0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){1,7}:\](:[1-9]([0-9]){0,4}){0,1}))$/
        if (value && !reg.test(value)) {
          callback($fm('m_073'))
        } else {
          callback()
        }
      }
    }
  }
  // 校验合法的Url
  checkUrlPath () {
    return {
      validator: (data, value, callback) => {
        var expression = /^((https?:\/\/)?|(ftp:\/\/)?|(tftp:\/\/)?)(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
        if (!value || expression.test(value)) {
          callback()
        } else {
          callback($fm('m_072'))
        }
      }
    }
  }
  // 检测IP地址
  checkIPAddress () {
    return {
      validator: (data, value, callback) => {
        if (!value || /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/i.test(value) ||
            (/^\[?((([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(:((:[0-9a-fA-F]{1,4}){1,6}|:))|([0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,5}|:))|(([0-9a-fA-F]{1,4}:){2}((:[0-9a-fA-F]{1,4}){1,4}|:))|(([0-9a-fA-F]{1,4}:){3}((:[0-9a-fA-F]{1,4}){1,3}|:))|(([0-9a-fA-F]{1,4}:){4}((:[0-9a-fA-F]{1,4}){1,2}|:))|(([0-9a-fA-F]{1,4}:){5}:([0-9a-fA-F]{1,4})?)|(([0-9a-fA-F]{1,4}:){6}:))\]?$/.test(value) &&
            ((value.indexOf('[') !== -1 && value.indexOf(']')) !== -1 || (!(value.indexOf('[') !== -1) && !(value.indexOf(']') !== -1))))) {
          callback()
        } else {
          callback($fm('m_074'))
        }
      }
    }
  }
  // 整数
  digits () {
    return {
      validator: (data, value, callback) => {
        if (!value || (value && /^(0|[1-9][0-9]*)$/i.test(value))) {
          callback()
        } else {
          callback($fm('m_075'))
        }
      }
    }
  }

  // 范围
  range (min, max) {
    return {
      validator: (data, value, callback) => {
        if (value && (value > max || value < min)) {
          callback($fm('m_078') + min + '-' + max)
        } else {
          callback()
        }
      }
    }
  }

  // max 64
  maxLen (n) {
    return { max: n, message: formatMessage({ id: 'm_080' }, { n }) }
  }

  // 时间校验
  checkoutTimeformat = () => {
    return {
      validator: (data, value, callback) => {
        if (!value || (value && /^(0?\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/i.test(value))) {
          callback()
        } else {
          callback($fm('m_079'))
        }
      }
    }
  }

  // 中文检测
  checkNoCH () {
    return {
      validator: (data, value, callback) => {
        if (value.match(/^[^\u4e00-\u9fa5]{0,}$/)) {
          callback()
        } else {
          callback($fm('m_076'))
        }
      }
    }
  }

  // 必填
  required () {
    return {
      required: true,
      message: $fm('m_003')
    }
  }
}

export default FormCommon
