import React, { Component, createRef } from 'react'
import { Form, Layout, Input, Button } from 'antd'
import sha256 from 'sha256'
import Cookie from 'js-cookie'
import { history } from '@/App'
import PwInput from '@/components/PwInput'
import LocalSelect from '@/components/LocalSelect'
import { connect } from 'react-redux'
import { setUserType } from '@/store/actions'
import API from '@/api'
import { parseSearch } from '@/utils/tools'
import './login.less'
import { $t, $fm } from '@/Intl'

const FormItem = Form.Item

/**
 * 登录表单
 */
@Form.create()
class LoginForm extends Component {
  state = {
    hasErr: false,
    errTips: '',
    locked: false
  }

  usernameRef = ''

  componentDidMount () {
    document.addEventListener('keydown', this.enterListener, false)
    this.usernameRef.focus()
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.enterListener)
  }

  enterListener = (e) => {
    if (e.keyCode !== 13) return false
    this.handleLogin()
  }

  handleLogin = () => {
    const form = this.props.form
    let { username, password } = form.getFieldsValue(['username', 'password'])
    if (!(username && username.length)) {
      this.errorTip($fm('m_154')) // 请输入用户名
      return false
    }
    if (!(password && password.length)) {
      this.errorTip($fm('m_155'))
      return false
    }
    API.getSalt().then(salt => {
      let shapass = sha256(`${username}:${salt}:${password}`)
      return API.login(username, shapass)
    }).then(data => {
      this.handleLoginData(data, username)
    })
  }

  handleLoginData = (data, username) => {
    let { Response, Needchange, Ver } = data
    if (Response === 'Success') {
      let timestamp = new Date().getTime()
      Cookie.set('needchange', Needchange, { expires: 10 })
      Cookie.set('ver', Ver !== '' ? Ver : timestamp, { expires: 10 })
      Cookie.set('logindate', timestamp, { expires: 10 })
      Cookie.get('type') && this.props.setUserType(Cookie.get('type'))
      window.isIEBrowser && (window.isLoginPageEvent = true)
      window.localStorage.setItem('logindate', timestamp)
      if (Needchange === '1') {
        this.props.changePw(username)
      } else {
        let redirect = parseSearch(history.location.search).redirect
        history.push(redirect || '/manage/status_account')
      }
    } else {
      const { Message, Times, LockType } = data
      switch (Message) {
        case 'Locked':
          this.setState({
            locked: true
          })
          this.errorTip(LockType === '2' ? $fm('m_156') : $fm('m_157'))
          break
        case 'Invalid Username':
          this.errorTip($fm('m_158'))
          break
        case 'Authentication failed':
          let leftTimes = 5 - parseInt(Times)
          this.errorTip(leftTimes > 0 ? $fm('m_159', { n: leftTimes }) : $fm('m_160'))
          if (leftTimes === 0) {
            this.setState({
              locked: true
            })
          }
          break
        default:
          this.errorTip($fm('m_161'))
      }
    }
  }
  errorTip = (tip) => {
    this.setState({
      hasErr: true,
      errTips: tip
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { hasErr, errTips, locked } = this.state
    const { product } = this.props
    return (
      <Form className='login-form' >
        <h2 className='login-title'>{$t('c_318')} {product}</h2>
        <div className='login-box'>
          <div className='err-tips' style={{ display: hasErr ? 'block' : 'none' }}>
            <span>
              <i className='icons icon-info' /> {errTips}
            </span>
          </div>
          <FormItem>
            {
              getFieldDecorator('username', {
                initialValue: ''
              })(
                <Input placeholder={$t('c_319')} type='text' name='username' ref={e => { this.usernameRef = e }} size='large' prefix={<i className='icons icon-user' />} autoComplete='off'/>
              )
            }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('password', {
                initialValue: ''
              })(
                <PwInput placeholder={$t('c_187')} prefix={<i className='icons icon-lock' />}/>
              )
            }
          </FormItem>
          <Button className='login-submit' disabled={locked} onClick={() => this.handleLogin()}>{$t('b_014')}</Button>
        </div>
      </Form>
    )
  }
}

/**
 * 修改密码表单
 */
@Form.create()
class PwChangeForm extends Component {
  state = {
    hasErr: false,
    errTips: '',
    pw1Rule: true
  }
  refPw1 = createRef()

  componentDidMount () {
    this.refPw1.current.focus()
    document.addEventListener('keydown', this.enterListener, false)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.enterListener)
  }

  enterListener = (e) => {
    if (e.keyCode !== 13) return false
    this.handleSave()
  }

  errorTip = (tip) => {
    this.setState({
      hasErr: true,
      errTips: tip
    })
  }
  handlePw1Rule = (flag) => {
    this.setState({
      pw1Rule: flag
    })
  }
  handleSave = () => {
    const { form, changeType } = this.props
    const { pw1, pw2 } = form.getFieldsValue()
    switch (true) {
      case pw1 === '' :
        this.errorTip($fm('m_162')) // 请输入新密码
        return false
      case pw2 === '' :
        this.errorTip($fm('m_163')) // 请输入确认密码
        return false
      case pw1 !== pw2:
        this.errorTip($fm('m_164')) // 密码不匹配
        return false
      case pw1.length < 6 && pw1.length > 0:
        this.errorTip($fm('m_165')) // 请输入至少6个字符。
        return false
      // case (pw1 === 'admin' && changeType === 'admin') || (pw1 === '123' && changeType === 'user') :
      //   this.errorTip('新密码不可为默认密码')
      //   return false
      case (/^[0-9]*$/.test(pw1) || /^[a-z]*$/.test(pw1) || /^[A-Z]*$/.test(pw1)) :
        this.errorTip($fm('m_166')) // 密码格式错误
        return false
      default:
        // ..
    }

    let payload = changeType === 'admin' ? { adminpwd: encodeURIComponent(pw1) } : { userpwd: encodeURIComponent(pw1) }
    API.changDefaultPwd(payload).then(m => {
      if (m.Response === 'Success') {
        this.props.setUserType(Cookie.get('type'))
        history.push('/manage/status_account')
      } else {
        const errors = {
          '0': $fm('m_167'), // 修改失败
          '1': $fm('m_168'), // 管理员密码不能为空
          '2': $fm('m_169'), // 管理员新密码不能和默认密码相同
          '3': $fm('m_170'), // 用户密码不能为空
          '4': $fm('m_171') // 用户新密码不能和默认密码相同
        }
        this.errorTip(errors[m.ErrorCode])
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { hasErr, errTips, pw1Rule } = this.state
    return (
      <Form className='login-form' >
        <h2 className='login-title changepw'>
          {$t('c_320')}
        </h2>
        <p className='changepw-info'>{$t('c_321')}</p>
        <div className='login-box'>
          <div className='err-tips' style={{ display: hasErr ? 'block' : 'none' }}>
            <span>
              <i className='icons icon-info' /> {errTips}
            </span>
          </div>
          <FormItem className='pw1-input'>
            {
              getFieldDecorator('pw1', {
                initialValue: ''
              })(
                <PwInput
                  placeholder={$t('c_322')}
                  prefix={<i className='icons icon-lock' />}
                  ref={this.refPw1}
                  onFocus={() => this.handlePw1Rule(true)}
                  onBlur={() => this.handlePw1Rule(false)}
                />
              )
            }
            <span className='pw-rule' style={{ display: pw1Rule ? 'block' : 'none' }}>{$t('c_323')}</span>
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('pw2', {
                initialValue: ''
              })(
                <PwInput
                  placeholder={$t('c_324')}
                  prefix={<i className='icons icon-lock' />}
                />
              )
            }
          </FormItem>
          <Button className='login-submit' onClick={() => this.handleSave()}>{$t('b_001')}</Button>
        </div>
      </Form>
    )
  }
}

// 登陆页
@connect(
  (state) => ({
    productInfo: state.productInfo
  }),
  (dispatch) => ({
    // getProduct: () => dispatch(getProduct())  //入口文件下获取了
    setUserType: (type) => dispatch(setUserType(type))
  })
)
class Login extends Component {
  state = {
    needChange: false,
    changeType: 'admin'
  }
  componentDidMount () {
    // this.props.getProduct()
  }
  handleChangePw = (username) => {
    this.setState({
      needChange: true,
      changeType: username
    })
  }
  render () {
    const { productInfo, setUserType } = this.props
    const { needChange, changeType } = this.state
    return (
      <Layout className='login-page'>
        <div className='login-locale-select'>
          <LocalSelect />
        </div>
        {
          !needChange
            ? <LoginForm product={productInfo['Product']} changePw={(username) => this.handleChangePw(username)} setUserType={setUserType}/>
            : <PwChangeForm changeType={changeType} setUserType={setUserType}/>
        }
        <div className='login-page-footer'>
          {` All Rights Reserved ${productInfo['Vendor']} ${new Date().getFullYear()}`}
        </div>
      </Layout>
    )
  }
}

export default Login
