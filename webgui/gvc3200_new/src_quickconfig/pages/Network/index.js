
import React, { Component } from 'react'
import { List } from 'antd-mobile'
import { Link } from 'react-router-dom'
import SlideRoute from '../../components/SlideRoute'
import NetworkAdvanced from './AdvancedSet'
import './network.less'
import API from '../../api'
import { $t } from '../../Intl'

const EthIcon = ({ isactive }) => {
  return <i className={`eth-icon ${isactive ? 'active' : ''}`} />
}

// const WifiIcon = ({ isactive }) => {
//   return <i className={`wifi-icon ${isactive ? 'active' : ''}`} />
// }

class Network extends Component {
  state = {
    netStatus: {
      ip: '',
      eth: false,
      wifi: false
    },
    preIp: '0'
  }

  componentDidMount () {
    API.getPvalues(['P1415']).then(data => {
      this.setState({
        preIp: data.P1415
      })
    })
    API.network().then((data) => {
      const { ipv4Addr, ethstatus, wifistatus, ipv6Addr } = data
      // console.log(data)
      this.setState({
        netStatus: {
          ip: ipv4Addr,
          ipv6: ipv6Addr,
          eth: ethstatus === '1',
          wifi: wifistatus === '1'
        }
      })
    })
  }

  showIp = (netStatus) => {
    // console.log(netStatus)
    const { ip, ipv6 } = netStatus
    const { preIp } = this.state
    switch (preIp) {
      case '0':
      case '2':
        return ip || ipv6
      case '1':
      case '3':
        return ipv6 || ip
      default:
        return ip
    }
  }

  render () {
    const { netStatus } = this.state
    return (
      <div className='page network-page'>
        <h3>{$t('c_048')}</h3>
        <List className='network-status'>
          <List.Item
            extra={this.showIp(netStatus)}
            className='ip-list-item'
          >
            {$t('c_018')}
          </List.Item>
          <List.Item
            thumb={<EthIcon isactive={netStatus.eth}/>}
            extra={netStatus.eth ? $t('c_009') : $t('c_010')}
          >
            {$t('c_007')}
          </List.Item>
          {/* <List.Item
            thumb={<WifiIcon isactive={netStatus.wifi}/>}
            extra={netStatus.wifi ? $t('c_009') : $t('c_010')}
          >
            WI-FI
          </List.Item> */}
        </List>
        <List>
          <Link to='/network/advanced' replace>
            <List.Item
              arrow='horizontal'
            >
              {$t('c_008')}
            </List.Item>
          </Link>
        </List>
        <div className='page-footer'>
          <div className='link-btns'>
            <Link className='link-btn' to='/timezone' replace>
              {$t('c_002')}
            </Link>
            <Link className='link-btn primary' to='/account' replace>
              {$t('c_001')}
            </Link>
          </div>
          <p>3/4</p>
        </div>
        <SlideRoute path='/network/advanced' component={NetworkAdvanced} />

      </div>
    )
  }
}

export default Network
