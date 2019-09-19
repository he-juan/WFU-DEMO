import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, BackTop, Spin, Icon } from 'antd'
import BakNav from '@/components/BakNav'
import BakHeader from '@/components/BakHeader'
import WebsocketMessage from '@/components/WebsocketMessage'
import FirmwareInstallTip from '@/components/FirmwareInstallTip'
import ConfControl from '@/components/ConfControl'
import backendRoutes from './backendRoutes'
import menuData from '@/components/BakNav/menulist'
import { getNetWorkStatus, getAcctStatus, getDefaultAcct, getIPVTExist, getTimeConfig, getCallLogs, getUserType, getContactsAndGroups } from '@/store/actions'
import { connect } from 'react-redux'
import './backend.less'
import { $t } from '@/Intl'

const { Header, Content, Sider } = Layout

@withRouter
@connect(
  (state) => ({
    productInfo: state.productInfo,
    wholeLoading: state.wholeLoading,
    callLogs: state.callLogs,
    locale: state.locale,
    timestampNow: state.timestampNow
  }),
  (dispatch) => ({
    getNetWorkStatus: () => dispatch(getNetWorkStatus()), // 获取全局的网络状态
    getAcctStatus: () => dispatch(getAcctStatus()), // 获取账号状态
    getDefaultAcct: () => dispatch(getDefaultAcct()), // 获取默认账号
    getIPVTExist: () => dispatch(getIPVTExist()), // 获取IPVT 激活状态
    getTimeConfig: () => dispatch(getTimeConfig()), // 获取时间相关的信息
    getCallLogs: () => dispatch(getCallLogs()), // 获取通话记录
    getContactsAndGroups: () => dispatch(getContactsAndGroups()), // 获取联系人群组
    getUserType: () => dispatch(getUserType()) // 获取用户类型
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
    await this.props.getTimeConfig()
    this.props.getNetWorkStatus()
    this.props.getAcctStatus()
    this.props.getDefaultAcct()
    this.props.getIPVTExist()
    this.props.getCallLogs()
    this.props.getUserType()
    this.props.getContactsAndGroups()
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.calContentHeight)
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
  getTitle () {
    const { location } = this.props
    let matchItem = null
    for (let i = 0; i < menuData.length; i++) {
      let sub = menuData[i].sub
      matchItem = sub.filter(item => new RegExp(item.path).test(location.pathname))[0]
      if (matchItem) break
    }
    if (!matchItem) return ''
    return $t(matchItem.name)
  }

  render () {
    const { productInfo, wholeLoading, locale, timestampNow } = this.props
    const { contentHeight } = this.state
    let curTitle = this.getTitle()
    if (timestampNow < 0) return null // 保证获取到当前设备时间, 时区等相关信息后 再渲染
    return (
      <Spin spinning={wholeLoading['isLoad']} tip={wholeLoading['tip']} indicator={<Icon type='loading-3-quarters' spin/>} wrapperClassName='whole-screen-spin'>
        {/* key={locale} 修改语言后， 不希望刷新浏览器 强制更新组件 */}
        <Layout key={locale}>
          <Header className='backend-header'>
            <BakHeader />
          </Header>
          <Layout>
            <Sider width={240} className='backend-sider'>
              <BakNav />
            </Sider>
            <Content className='backend-content' style={{ height: contentHeight }} id='backendContent'>
              <h3>{curTitle}</h3>
              <div className='backend-main' style={{ minHeight: contentHeight - 105 }}>
                {backendRoutes}
              </div>
              <div className='backend-copyright'>
                {`All Rights Reserved ${productInfo['Vendor']} ${new Date().getFullYear()}`}
              </div>
              {/* 会议控制 */}
              <ConfControl />
              {/* 回到顶部 */}
              <BackTop target={() => document.getElementById('backendContent')} />
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
