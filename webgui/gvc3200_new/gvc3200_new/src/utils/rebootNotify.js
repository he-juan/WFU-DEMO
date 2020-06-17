/* eslint-disable no-multi-spaces */
/* eslint-disable no-multiple-empty-lines */
import React from 'react'
import Cookie from 'js-cookie'
import { Button, notification } from 'antd'
import { store } from '@/store'
import { history } from '@/App'
import { $t } from '@/Intl'
import API from '@/api'

export let rebootNotifyKey = 'updatable'
let rebootUnsubscribe = () => {}

let curLocale
/**
 * 根据是否重启判断弹窗 重启提示弹窗
 * @param {object} oldOptions 获取到的options
 * @param {object} newOptions 编辑过的options
 * @param {booleab} immediate 立即执行 不再判断status
 * @param {function} callback 回到函数
 */
export const rebootNotify = ({ oldOptions, newOptions, immediate = false }, callback = '') => {
  // $fm
  let notifyFn = () => {
    const closeFn = () => {
      notification.close(rebootNotifyKey)
      rebootUnsubscribe()
    }
    const confirmFn = () => {
      // 重启确认框点击确定后先调应用接口
      let applyFun = JSON.parse(Cookie.get('applyFun') || '[]')
      Promise.all([
        API.applyPvalue(),
        ...applyFun.map(item => {
          return API[item.action](decodeURIComponent(item.param))
        })
      ]).then(() => {
        // 前往重启页面 调用重启页面
        let { linesInfo } = store.getState()
        Cookie.remove('applyFun')
        Cookie.set('reboottype', linesInfo.length > 0 ? 4 : 0, {
          path: '/',
          expires: 10
        })
        notification.close(rebootNotifyKey)
        rebootUnsubscribe()
        history.push('/reboot')
      })
    }

    const btn = (
      <>
        <Button onClick={closeFn} style={{ marginRight: 10 }}>{$t('b_005')}</Button>
        <Button type='primary' onClick={confirmFn}>{$t('b_002')}</Button>
      </>
    )
    notification.open({
      message: $t('c_042'),
      description: $t('c_243'),
      btn,
      key: rebootNotifyKey,
      duration: 0,
      top: 50,
      style: {
        marginRight: -8
      },
      onClose: () => {
        rebootUnsubscribe()
      }
    })
    curLocale = store.getState().locale // 获取 locale
    rebootUnsubscribe() // 防止多次订阅，先执行 取消订阅
    // 通过订阅 store的变化 ，来重复执行 open方法 然后根据 唯一key的方式更新 内容
    rebootUnsubscribe = store.subscribe(() => {
      let locale = store.getState().locale
      if (locale !== curLocale) {
        setTimeout(() => { notifyFn() }, 50)
        curLocale = locale
      }
    })
  }

  if (immediate) {
    notifyFn()
    callback && callback()
  } else {
    let status = !1
    for (const key in oldOptions) {
      const [ oldBool, newBool ] = [oldOptions[key] !== null && oldOptions[key] !== undefined, newOptions[key] !== null && newOptions[key] !== undefined]
      const oldVal = oldBool ? oldOptions[key].toString() : ''
      const newVal = newBool ? newOptions[key].toString() : ''
      if (oldVal !== newVal && newBool) {
        status = !0
        break
      }
    }
    if (status) {
      notifyFn()
      callback && callback()
    }
  }
}
