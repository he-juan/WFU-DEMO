import React, { Component } from 'react'
import { Button, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import PalaceInput from '../../components/PalaceInput'
import API from '../../api'
import { history } from '../../QuickConfigApp'
import './screenlock.less'
import { $t } from '../../Intl'

class ScreenLock extends Component {
  state = {
    pw: '',
    cpw: '',
    confirm: false
  }
  handlePw = (v) => {
    this.setState({
      pw: v
    })
    if (v.length >= 6) {
      setTimeout(() => {
        this.setState({
          confirm: true
        })
      }, 200)
    }
  }
  handlecPw = (v) => {
    this.setState({
      cpw: v
    })
  }
  handleSubmit = async () => {
    const { pw, cpw } = this.state
    if (!pw) return history.replace('/result')
    if (pw !== cpw) {
      this.setState({
        pw: '',
        cpw: '',
        confirm: false
      })
      // 密码不一致，请重新设置锁屏密码
      Toast.fail($t('c_040'))
      return false
    }
    await API.savelockpwd(pw)
    history.replace('/result')
  }
  render () {
    const { pw, cpw, confirm } = this.state
    return (
      <div className='page screenlock-page'>
        <p className='screenlock-title'>{!confirm ? $t('c_039') : $t('c_038')}</p>
        {
          !confirm
            ? <PalaceInput value={pw} onChange={this.handlePw} />
            : <PalaceInput value={cpw} onChange={this.handlecPw} />

        }
        <p className='screenlock-tip'>{$t('c_037')}</p>
        <div className='page-footer'>
          <div className='link-btns'>
            <Link className='link-btn' to='/account' replace>
              {$t('c_002')}
            </Link>
            <Button type='primary' onClick={this.handleSubmit}>
              {$t('c_004')}
            </Button>
          </div>
          <p>5/5</p>
        </div>
      </div>
    )
  }
}

export default ScreenLock
