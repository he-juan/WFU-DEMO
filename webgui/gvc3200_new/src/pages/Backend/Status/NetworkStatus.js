import React, { Component } from 'react'
import { Form } from 'antd'
import FormItem from '@/components/FormItem'
import { connect } from 'react-redux'
import API from '@/api'
import { $t } from '@/Intl'

@connect(
  (state) => ({
    networkStatus: state.networkStatus
  })
)
class NetworkStatus extends Component {
  constructor () {
    super()
    this.state = {
      netInfo: {
        twovlan: '',
        voipvid: '',
        voipnettype: '',
        nettype: '',
        proxy: '',
        // voip
        vipaddress: '',
        vmask: '',
        vgateway: '',
        vdns: '',
        vdns2: ''
      }
    }
  }
  componentDidMount () {
    this.getNetInfos()
  }

  getNetInfos () {
    let _this = this
    API.getPvalues(['P22104', 'P22111', 'P22105', 'P80', 'P1552', 'P22106', 'P22017', 'P22108', 'P22109', 'P22110'])
      .then(data => {
        let _netInfo = {
          twovlan: data['P22104'],
          voipvid: data['P22111'],
          voipnettype: data['P22105'],
          nettype: data['P80'],
          proxy: data['P1552'],
          vipaddress: data['P22106'],
          vmask: data['P22107'],
          vgateway: data['P22108'],
          vdns: data['P22109'],
          vdns2: data['P22110']
        }
        _this.setState({
          netInfo: _netInfo
        })
        return Promise.resolve(_netInfo)
      }).then(_netInfo => {
        if (_netInfo.twovlan === '1' && _netInfo.voipnettype !== '1') {
          API.getVoipnetworkInfo(_netInfo.voipvid).then(voipData => {
            _this.setState({
              netInfo: Object.assign({}, this.state.netInfo, {
                vipaddress: voipData['ip'],
                vmask: voipData['mask'],
                vgateway: voipData['gateway'],
                vdns: voipData['dns'],
                vdns2: voipData['dns2']
              })
            })
          })
        }
      })
  }

  parseAddrType (type) {
    switch (type) {
      case '':
      case '0':
        return $t('c_084') // 自动获取
      case '1':
        return $t('c_085') // 静态ip
      case '2' :
        return 'PPPoE'
      default:
        return ''
    }
  }
  render () {
    const { networkStatus } = this.props
    const { netInfo } = this.state
    // console.log(networkStatus)
    return (
      <Form>
        {/* MAC地址 */}
        <FormItem lang='sta_001'>
          { networkStatus['mac'] && networkStatus['mac'].toUpperCase() }
        </FormItem>
        {/* HTTP/HTTPS代理服务器 */}
        <FormItem lang='sta_002' hide={netInfo['proxy'] === ''}>
          { netInfo['proxy'] }
        </FormItem>
        {/* NAT类型 */}
        <FormItem lang='sta_003'>
          { netInfo['nettype'] }
        </FormItem>
        {/* VPN IP */}
        <FormItem lang='sta_004' hide={ !networkStatus['vpn_ip'] || networkStatus['vpn_ip'] === '0.0.0.0' }>
          { networkStatus['vpn_ip'] }
        </FormItem>
        <h4 className='bak-sub-title'>{netInfo['twovlan'] === '1' ? $t('c_086') : 'IPV4'}</h4>
        {/* 地址类型 */}
        <FormItem lang='sta_005'>
          { this.parseAddrType(networkStatus['ipv4Type']) }
        </FormItem>
        {/* IPv4地址 */}
        <FormItem lang='sta_006'>
          { networkStatus['ipv4Addr'] }
        </FormItem>
        {/* 子网掩码 */}
        <FormItem lang='sta_007'>
          { networkStatus['mask'] }
        </FormItem>
        {/* 网关 */}
        <FormItem lang='sta_008'>
          { networkStatus['gateway'] }
        </FormItem>
        {/* DNS服务器1 */}
        <FormItem lang='sta_009'>
          { networkStatus['dns1'] }
        </FormItem>
        {/* DNS服务器2 */}
        <FormItem lang='sta_010'>
          { networkStatus['dns2'] }
        </FormItem>
        <h4 className='bak-sub-title'>IPV6</h4>
        {/* IPv6地址类型 */}
        <FormItem lang='sta_011'>
          { this.parseAddrType(networkStatus['ipv6Type']) }
        </FormItem>
        {/* IPv6地址 */}
        <FormItem lang='sta_012'>
          { networkStatus['ipv6Addr'] }
        </FormItem>
        {/* IPv6 DNS服务器1 */}
        <FormItem lang='sta_013'>
          { networkStatus['ipv6Dns1'] }
        </FormItem>
        {/* IPv6 DNS服务器2 */}
        <FormItem lang='sta_014'>
          { networkStatus['ipv6Dns2'] }
        </FormItem>
        {
          netInfo['twovlan'] === '1' ? (
          <>
            <h4 className='bak-sub-title'>{$t('c_087')}</h4>
            {/* 地址类型 */}
            <FormItem lang='sta_005'>
              { netInfo['voipnettype'] === '1' ? $t('c_085') : $t('c_084') }
            </FormItem>
            {/* IP地址 */}
            <FormItem lang='sta_015'>
              { netInfo['vipaddress'] }
            </FormItem>
            {/* 子网掩码 */}
            <FormItem lang='sta_007'>
              { netInfo['vmask'] }
            </FormItem>
            {/* 网关 */}
            <FormItem lang='sta_008'>
              { netInfo['vgateway'] }
            </FormItem>
            {/* DNS服务器1 */}
            <FormItem lang='sta_009'>
              { netInfo['vdns'] }
            </FormItem>
            {/* DNS服务器2 */}
            <FormItem lang='sta_010'>
              { netInfo['vdns2'] }
            </FormItem>
          </>
          ) : null
        }
      </Form>
    )
  }
}

export default NetworkStatus
