import React, { Component } from 'react'
import { Button, Icon, Toast } from 'antd-mobile'
import qrcode from '../../assets/img/qrcode.png'
import qrcodeActive from '../../assets/img/qrcode_active.png'
import './RefreshQrCode.less'
import API from '../../api'
import { $t } from '../../Intl'
class RefreshQrCode extends Component {
  state = {
    isActive: false
  }
  handleRefreshQrCode = () => {
    API.refreshqrcode().then((m) => {
      if (m.response === 'success') {
        this.setState({
          isActive: true
        })
      } else {
        Toast.fail('操作失败！')
      }
    })
  }
  render () {
    const { isActive } = this.state
    return (
      <div className='page refresh-qrcode-page'>
        {
          isActive ? (
            <>
              <img src={qrcodeActive} alt='qrcode' />
              <p className='active'>
                <Icon type='check-circle-o' size='md' className='icons' color='#108ee9' />{$t('c_041')} <br />
                {$t('c_042')}
              </p>
            </>
          ) : (
            <>
              <img src={qrcode} alt='qrcode'/>
              <p>
                {$t('c_043')}
              </p>
              <div className='page-footer'>
                <Button type='primary' className='refresh-btn' onClick={this.handleRefreshQrCode}>
                  {$t('c_044')}
                </Button>
              </div>
            </>
          )
        }

      </div>
    )
  }
}

export default RefreshQrCode
