import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, BackTop, Spin, Icon, notification } from 'antd'
import BakNav from '@/components/BakNav'
import BakHeader from '@/components/BakHeader'
import WebsocketMessage, { MsgObserver } from '@/components/WebsocketMessage'
import FirmwareInstallTip from '@/components/FirmwareInstallTip'
import ConfControl from '@/components/ConfControl'
import backendRoutes from './backendRoutes'
import menuData from '@/components/BakNav/menulist'
import { store } from '@/store'
import { getNetWorkStatus, getTimeConfig, getCallLogs, getUserType, getContactsAndGroups, setUserType, getAcctInfo } from '@/store/actions'
import { connect } from 'react-redux'
import { $t } from '@/Intl'
import { isMenuRouteDeny, debounce } from '@/utils/tools'
import { rebootNotifyKey } from '@/utils/rebootNotify'
import API from '@/api'
import Cookie from 'js-cookie'
import './backend.less'

const { Header, Content, Sider } = Layout
let LOGOUT_TIMER

@withRouter
@connect(
  (state) => ({
    productInfo: state.productInfo,
    wholeLoading: state.wholeLoading,
    callLogs: state.callLogs,
    locale: state.locale,
    timestampNow: state.timestampNow,
    userType: state.userType
  }),
  (dispatch) => ({
    getNetWorkStatus: () => dispatch(getNetWorkStatus()), // 获取全局的网络状态
    getTimeConfig: () => dispatch(getTimeConfig()), // 获取时间相关的信息
    getCallLogs: () => dispatch(getCallLogs()), // 获取通话记录
    getContactsAndGroups: () => dispatch(getContactsAndGroups()), // 获取联系人群组
    getUserType: () => dispatch(getUserType()), // 获取用户类型
    getAcctInfo: () => dispatch(getAcctInfo()) // 获取账号状态, 获取默认账号, 获取IPVT 激活状态
  })
)
class Backend extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contentHeight: 800
    }
    document.title = props.productInfo['Product']
  }

  async componentDidMount () {
    this.setContentHeight()
    await this.props.getUserType()
    await this.props.getTimeConfig()
    this.props.getNetWorkStatus()
    this.props.getAcctInfo()
    this.props.getCallLogs()
    this.props.getContactsAndGroups()

    // 超时登出
    this.webTimeout()
    // 全局监听 enter 事件
    document.addEventListener('keydown', this.listenEnterEvent, false)

    // 休眠监听
    MsgObserver.subscribe('goto_sleep', () => {
      // this.props.history.push('/login')
      window.location.href = '/login'
    })

    // 通话记录更新
    MsgObserver.subscribe('calllog_updated', () => {
      this.props.getCallLogs()
    })

    // 联系人更新
    MsgObserver.subscribe('contacts_updated', debounce(() => {
      this.props.getContactsAndGroups()
    }, 800))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.calContentHeight)
    document.removeEventListener('keydown', this.listenEnterEvent)
    notification.close(rebootNotifyKey)
    clearInterval(LOGOUT_TIMER)
    MsgObserver.unsubscribe('goto_sleep')
    MsgObserver.unsubscribe('calllog_updated')
    MsgObserver.unsubscribe('contacts_updated')
  }

  setContentHeight = () => {
    this.calContentHeight()
    window.addEventListener('resize', this.calContentHeight, false)
  }

  calContentHeight = () => {
    const winHeight = document.documentElement.clientHeight || window.innerHeight
    const contentHeight = winHeight - 50
    this.setState({
      contentHeight
    })
  }

  // 全局监听 enter 事件
  listenEnterEvent = e => {
    let theEvent = e || window.event
    let code = theEvent.keyCode || theEvent.which || theEvent.charCode
    if (code === 13) {
      if (!document.querySelectorAll('.header-search-box').length) {
        let subNode = document.getElementById('subBtn')
        if (subNode) {
          e.preventDefault()
          // 回车执行保存
          document.getElementById('subBtn').click()
        }
      }
    }
  }

  // 超时登出
  webTimeout = () => {
    LOGOUT_TIMER = setInterval(() => {
      API.getConnectState().then(msg => {
        if (msg.state === '-1') {
          API.logoff().then(m => {
            if (m.Response === 'Success') {
              window.localStorage.setItem('logindate', '')
              store.dispatch(setUserType(null))
              Cookie.remove('type')
              Cookie.remove('logindate')
              // this.props.history.push('/login')
              window.location.href = '/login'
              clearInterval(LOGOUT_TIMER)
            }
          })
        }
      })
    }, 10000)
  }

  getTitle () {
    const { location } = this.props
    let matchItem = null
    let _menuData = menuData.filter(item => !isMenuRouteDeny(item))
    for (let i = 0; i < _menuData.length; i++) {
      let sub = _menuData[i].sub
      matchItem = (sub || [_menuData[i]]).filter(item => {
        return new RegExp(item.path).test(location.pathname) && !isMenuRouteDeny(item)
      })[0]
      if (matchItem) break
    }
    if (!matchItem) return ''
    return $t(matchItem.name)
  }

  render () {
    const { productInfo, wholeLoading, timestampNow } = this.props
    const { contentHeight } = this.state
    let curTitle = this.getTitle()
    if (timestampNow < 0) return null // 保证获取到当前设备时间, 时区等相关信息后 再渲染
    return (
      <Spin spinning={wholeLoading['isLoad']} tip={wholeLoading['tip']} indicator={<Icon type='loading-3-quarters' spin/>} wrapperClassName='whole-screen-spin'>
        {/* key={locale} 修改语言后， 不希望刷新浏览器 强制更新组件 */}
        <Layout >
          <Header className='backend-header'>
            <BakHeader />
          </Header>
          <Layout>
            <Sider width={240} className='backend-sider'>
              <div style={{ height: contentHeight, overflow: 'auto' }}>
                <BakNav />
              </div>
            </Sider>
            <Content className='backend-content' style={{ height: contentHeight }} id='backendContent'>
              <h3>{curTitle}</h3>
              <div className='backend-main' style={{ minHeight: contentHeight - 105 }}>
                {backendRoutes}
              </div>
              <div className='backend-copyright'>
                {`Copyright © ${productInfo['Vendor']} ${productInfo['Year']}. All Rights Reserved.`}
              </div>
              {/* 会议控制 */}
              <ConfControl />
              {/* 回到顶部 */}
              <BackTop title={$t('c_327')} target={() => document.getElementById('backendContent')} />
              {/* websocket */}
              <WebsocketMessage />
              {/* 固件升级安装进度条 */}
              <FirmwareInstallTip />
            </Content>
          </Layout>
        </Layout>
      </Spin>
    )
  }
}

export default Backend
