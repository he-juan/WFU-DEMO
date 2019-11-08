import React, { Component } from 'react'
import Cookie from 'js-cookie'
import { sysReboot } from '@/api/api.system'
import { history } from '@/App'
import './Reboot.less'
import { $t } from '@/Intl'

class Reboot extends Component {
  state = {
    productInfo: Cookie.get('productInfo'),
    rebootype: Cookie.get('reboottype') || '-1'
  }

  componentDidMount () {
    let { rebootype } = this.state
    Cookie.remove('reboottype')
    if (rebootype === '-1') return history.replace('/login')
    if (rebootype === 'reset') return false
    setTimeout(() => {
      sysReboot(rebootype)
      Cookie.set('type', '', { path: '/', expires: -1 }) // 清除掉 type 强制返回登录
    }, 1000)
  }

  render () {
    let { productInfo, rebootype } = this.state
    productInfo = JSON.parse(productInfo)
    let [title, subtitle, tips] = Array(3)

    if (rebootype === '0' || rebootype === '4') {
      title = $t('b_009') // 重启
      subtitle = $t('m_030') // 设备重启中
      tips = $t('m_033') // 若设备正在通话，待通话结束后会自动重启<br>您可以在重启后2分钟左右点击下面的链接, 重新登录页面
    } else if (rebootype === '1' || rebootype === '5') {
      title = $t('b_008') // 关机
      subtitle = $t('m_031') // 设备关机中
      tips = $t('m_034') // 您可以在重新启动后点击下面的链接, 重新登录页面
    } else if (rebootype === '2' || rebootype === '6') {
      title = $t('b_007') // 睡眠
      subtitle = $t('m_032') // 设备睡眠中...
      tips = $t('m_035') // 您可以在唤醒设备后点击下面的链接, 重新登录页面
    } else if (rebootype === 'reset') {
      title = $t('b_009') // 重启
      subtitle = $t('m_209') // 设备正在恢复出厂中...
      tips = $t('m_210') // 若设备正在通话，待通话结束后会自动恢复出厂<br>您可以在唤醒设备后点击下面的链接, 重新登录页面
    }

    return (
      <div className='reboot'>
        <div className='header-box'>
          <a href='http://www.grandstream.com' rel='noopener noreferrer' target='_blank'>
            <i className='icons icon-logo'></i>
            <span>{productInfo.Product}</span>
          </a>
          <span>{title}</span>
        </div>
        <div className='content-box'>
          <div className='subtitle'>{subtitle}</div>
          <div className='tips' dangerouslySetInnerHTML={{ __html: tips }}></div>

          <span onClick={() => history.replace('/login')} className='relogin'>{$t('b_014')}</span>
          <div className='copyright'>
            {`All Rights Reserved ${productInfo['Vendor']} ${new Date().getFullYear()}`}
          </div>
        </div>
      </div>
    )
  }
}

export default Reboot
