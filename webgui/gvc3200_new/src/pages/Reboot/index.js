import React, { Component } from 'react'
import Cookie from 'js-cookie'
import { sysReboot } from '@/api/api.system'
import { history } from '@/App'
import './Reboot.less'
import { $t } from '@/Intl'

class Reboot extends Component {
  state = {
    productInfo: Cookie.get('productInfo'),
    rebootype: Cookie.get('reboottype') || '0'
  }

  componentDidMount () {
    let { rebootype } = this.state
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
      title = $t('b_009')
      subtitle = $t('m_030')
      tips = $t('m_033')
    } else if (rebootype === '1' || rebootype === '5') {
      title = $t('b_008')
      subtitle = $t('m_031')
      tips = $t('m_034')
    } else if (rebootype === '2' || rebootype === '6') {
      title = $t('b_007')
      subtitle = $t('m_032')
      tips = $t('m_035')
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
          <div className='tips'>{tips}</div>

          <span onClick={() => history.push('/login')} className='relogin'>{$t('b_014')}</span>
          <div className='copyright'>
            {`All Rights Reserved ${productInfo['Vendor']} ${new Date().getFullYear()}`}
          </div>
        </div>
      </div>
    )
  }
}

export default Reboot
