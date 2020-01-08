import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button, Switch, Modal, message } from 'antd'
import FormItem, { SelectItem, InputItem, PwInputItem, CheckboxItem, RadioGroupItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import NoData from '@/components/NoData'
import API from '@/api'
import './WifiBasic.less'
import { $t, $fm } from '@/Intl'

@Form.create()
class WifiDetailModal extends FormCommon {
  constructor () {
    super()
    this.phase2Map = {
      '0': [{ v: '0', t: 'None' }, { v: '3', t: 'MSCHAPV2' }, { v: '4', t: 'GTC' }],
      '1': [],
      '2': [{ v: '0', t: 'None' }, { v: '2', t: 'MSCHAP' }, { v: '3', t: 'MSCHAPV2' }, { v: '4', t: 'GTC' }],
      '3': []
    }
    this.levelTxtMap = {
      '0': 'c_203',
      '1': 'c_204',
      '2': 'c_205',
      '3': 'c_206',
      '4': 'c_206'
    }
    this.state = {
      eapMethod: '0', // EAP方法
      phase2arr: [{ v: '0', t: 'None' }, { v: '3', t: 'MSCHAPV2' }, { v: '4', t: 'GTC' }], //  阶段2身份验证
      needModify: false, // 是否需要修改
      advDisplay: false, // 显示高级选项
      staticDisplay: false, // 显示静态ip配置项
      connecting: false
    }
  }
  handleEapChange = (v) => {
    this.setState({
      eapMethod: v,
      phase2arr: this.phase2Map[v]
    })
  }
  // 显示高级选项
  showAdvOption = (e) => {
    let checked = e.target.checked
    let iptype = this.props.form.getFieldValue('iptype')

    this.setState({
      advDisplay: !!checked,
      staticDisplay: !!checked && iptype === '1'
    })
  }
  // 显示静态IP配置
  showStaticIPOption = (e) => {
    let v = e.target.value
    this.setState({
      staticDisplay: v === '1'
    })
  }
  // 编辑
  modifyConfig = () => {
    this.setState({
      needModify: true
    })
  }
  // 取消保存
  cancelSave = () => {
    let networkId = this.props.wifiSelected.networkId
    API.forgetWifi(networkId).then(m => {
      this.cbHide()
    })
  }
  // 断开
  handleDisconnect = () => {
    API.disconnectWifi().then(m => {
      this.cbHide()
    })
  }
  // 连接/保存
  handleConnnect = () => {
    const { wifiSelected } = this.props
    const { needModify } = this.state
    // 已保存的网络
    if (wifiSelected.isSaved === 'true' && !needModify) {
      this.setState({
        connecting: true
      })
      API.connectSavedWifi(wifiSelected['networkId']).then(() => {
        this.cbHide(5000)
      })
      return false
    }
    // 未保存的网络
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          connecting: true
        })
        API.connectWifi({
          ssid: wifiSelected['ssid'],
          bssid: wifiSelected['bssid'],
          security: wifiSelected['security'],
          networkid: wifiSelected['networkId'],
          password: values['wifipwd'] || '',
          eap: values['eapMethod'] || '-1',
          phase2: values['phase2'] || '-1',
          cacert: values['cacert'] || '',
          userca: values['usercert'] || '',
          identity: values['identity'] || '',
          anonymous: values['anonyidentity'] || '',
          istatic: values['iptype'] || '0',
          ipaddr: values['ipaddr'] || '',
          gateway: values['gateway'] || '',
          prefix: values['netprefix'] || '',
          dns1: values['dns1'] || '',
          dns2: values['dns2'] || '',
          // ip6addr,    // GVC不支持 ipv6wifi连接
          // ip6prefix,
          // ip6dns1,
          // ip6dns2
          saveplusconn: Number(!needModify)
        }).then(() => {
          this.cbHide(5000)
        })
      }
    })
  }
  // 请求回调 同时通过onHide通知页面重新开启wifi列表定时获取
  cbHide = (timeout) => {
    setTimeout(() => {
      message.success($t('m_094'))
      this.props.onHide()
    }, timeout || 0)
  }

  // wifi密码的校验规则
  wifiPwValidator = () => {
    let securitystr = this.props.wifiSelected.securityStr.toUpperCase()
    if (securitystr.indexOf('802.1X') === -1) {
      return {
        validator: (data, value, callback) => {
          if (value === '') {
            callback($fm('m_003'))
          } else if (securitystr.indexOf('WEP') !== -1 && [5, 10, 13, 26, 16, 32].indexOf(value.length) === -1) {
            callback($fm('m_093'))
          } else if (value.length < 8) {
            callback($fm('m_092'))
          } else {
            callback()
          }
        }
      }
    } else {
      return {}
    }
  }
  render () {
    const { wifiSelected, onHide } = this.props
    const { phase2arr, eapMethod, needModify, advDisplay, staticDisplay, connecting } = this.state
    const { getFieldDecorator: gfd } = this.props.form

    const {
      level, /* 信号强度 */
      speed, /* 连接速度 */
      frequency, /* 频率 */
      security, /* 安全性 */
      securityStr, /* 安全性str */
      isSaved, /* 已保存 */
      ssid, /* ssid名称 */
      cacerts, /* ca证书 */
      userCert, /* 用户证书 */
      isConnected, /* 是否已连接 */
      staticip, /* 静态ip地址 */
      staticgateway, /* 网关 */
      staticprefixlength,
      staticprefixdnsone,
      staticprefixdnstwo,
      staticip6 } = wifiSelected
    return (
      <Modal
        title={ssid}
        visible={true}
        onCancel={() => onHide(null)}
        className='wifi-detail-modal'
        footer={
          <div className='detail-modal-footer'>
            {
              isSaved === 'true'
                ? <>
                  <Button className='cancle-save-btn' onClick={this.cancelSave}>{$t('b_033')}</Button>
                  <Button className='edit-btn' onClick={this.modifyConfig}>{$t('b_018')}</Button>
                  </>
                : null
            }
            <Button className='cancle-btn' onClick={this.onHide}>{$t('b_005')}</Button>
            {
              isConnected === 'CONNECTED' && !needModify
                ? <Button className='disconnect-btn' type='primary' onClick={this.handleDisconnect}>{$t('b_034')}</Button>
                : <Button className='connect-btn' type='primary' loading={connecting} onClick={this.handleConnnect}>{needModify ? $t('b_001') : $t('b_032')}</Button>
            }
          </div>
        }
      >
        <Form hideRequiredMark className='wifi-detail-form' labelCol={{ span: 10 }} wrapperCol={{ span: 7, offset: 2 }}>
          <FormItem label='c_201' hide={!staticip}>
            {staticip}
          </FormItem>
          <FormItem label='c_200' hide={!staticip}>
            {staticip}
          </FormItem>
          <FormItem label='c_199' hide={!staticip6}>
            {staticip6}
          </FormItem>
          <FormItem label='c_198' hide={!(isConnected === 'CONNECTED')}>
            {$t('c_179')}
          </FormItem>
          <FormItem label='c_197'>
            {$t(this.levelTxtMap[level])}
          </FormItem>
          <FormItem label='c_202' hide={!(isConnected === 'CONNECTED')}>
            {speed ? speed + ' Mbps' : ''}
          </FormItem>
          <FormItem label='c_196' hide={!(isConnected === 'CONNECTED')}>
            {frequency || ''}
          </FormItem>
          {/* 安全性 */}
          <FormItem label='c_195'>
            {securityStr}
          </FormItem>
          {/* 是否是802.1x */}
          {
            (securityStr.toUpperCase().indexOf('802.1X') !== -1 && isSaved === 'false')
              ? <>
                  {/* EAP方法 */}
                  <SelectItem
                    label='c_194'
                    name='eapMethod'
                    gfd={gfd}
                    gfdOptions={{ initialValue: '0' }}
                    onChange={this.handleEapChange}
                    selectOptions={[
                      { v: '0', t: 'PEAP' },
                      { v: '1', t: 'TLS' },
                      { v: '2', t: 'TTLS' },
                      { v: '3', t: 'PWD' }
                    ]}
                  />
                  {/* 阶段2身份验证 */}
                  <SelectItem
                    label='c_193'
                    name='phase2'
                    gfd={gfd}
                    hide={!phase2arr.length}
                    gfdOptions={{ initialValue: phase2arr.length ? '0' : '-1' }}
                    selectOptions={phase2arr}
                  />
                  {/* CA证书 */}
                  <SelectItem
                    label='c_192'
                    name='cacert'
                    hide={eapMethod === '3'}
                    gfd={gfd}
                    gfdOptions={{ initialValue: '' }}
                    selectOptions={
                      [
                        { v: '', t: $t('c_190') },
                        ...(cacerts || []).map(ca => {
                          return { v: ca.cacert, t: ca.cacert }
                        })
                      ]
                    }
                  />
                  <SelectItem
                    label='c_191'
                    name='usercert'
                    hide={eapMethod !== '1'}
                    gfd={gfd}
                    gfdOptions={{ initialValue: '' }}
                    selectOptions={
                      [
                        { v: '', t: $t('c_190') },
                        ...(userCert || []).map(us => {
                          return { v: us.userCert, t: us.userCert }
                        })
                      ]
                    }
                  />
                  <InputItem
                    label='c_189'
                    name='identity'
                    gfd={gfd}
                    gfdOptions={{ initialValue: '' }}
                  />
                  <InputItem
                    label='c_188'
                    name='anonyidentity'
                    hide={eapMethod === '1' || eapMethod === '3'}
                    gfd={gfd}
                    gfdOptions={{ initialValue: '' }}
                  />
                </>
              : null
          }
          {
            isSaved === 'true' && !needModify // 已保存且不需要修改的 不显示
              ? null
              : <>
                  <PwInputItem
                    label='c_187'
                    name='wifipwd'
                    gfd={gfd}
                    hide={eapMethod === '1' || security === '0'}
                    gfdOptions={{ initialValue: '', rules: [this.wifiPwValidator()] }}
                  />
                  <CheckboxItem
                    label='c_186'
                    name='advanoption'
                    gfd={gfd}
                    onChange={this.showAdvOption}
                    gfdOptions={{ initialValue: 0 }}
                  />
                  <RadioGroupItem
                    label='c_185'
                    name='iptype'
                    hide={!advDisplay}
                    gfd={gfd}
                    onChange={this.showStaticIPOption}
                    gfdOptions={{ initialValue: staticip ? '1' : '0' }}
                    radioOptions={[
                      { v: '0', t: 'DHCP' },
                      { v: '1', t: $t('c_085') }
                    ]}
                  />
                  {/* 静态ip配置项 */}
                  {
                    !advDisplay || !staticDisplay ? null
                      : <>
                          <InputItem
                            label='c_184'
                            name='ipaddr'
                            gfd={gfd}
                            gfdOptions={{
                              rules: [
                                this.checkIPAddress(),
                                this.required()
                              ],
                              initialValue: staticip || ''
                            }}
                          />
                          <InputItem
                            label='c_183'
                            name='gateway'
                            gfd={gfd}
                            gfdOptions={{
                              rules: [
                                this.checkIPAddress(),
                                this.required()
                              ],
                              initialValue: staticgateway || ''
                            }}
                          />
                          <InputItem
                            label='c_182'
                            name='netprefix'
                            gfd={gfd}
                            gfdOptions={{
                              rules: [
                                this.digits(),
                                this.range(0, 32),
                                this.required()
                              ],
                              initialValue: staticprefixlength || ''
                            }}
                          />
                          <InputItem
                            label='c_207'
                            name='dns1'
                            gfd={gfd}
                            gfdOptions={{
                              rules: [
                                this.checkIPAddress(),
                                this.required()
                              ],
                              initialValue: staticprefixdnsone || ''
                            }}
                          />
                          <InputItem
                            label='c_208'
                            name='dns2'
                            gfd={gfd}
                            gfdOptions={{
                              rules: [
                                this.checkIPAddress()
                              ],
                              initialValue: staticprefixdnstwo || ''
                            }}
                          />
                        </>
                  }

                </>
          }
        </Form>
      </Modal>
    )
  }
}

@Form.create()
class WifiBasic extends FormCommon {
  constructor (props) {
    super(props)
    this.TIMER = null
    this.TIMER2 = null
    this.state = {
      wifiFunc: '0',
      wifiScaling: false,
      wifiList: [],
      wifiSelected: null
    }
    this.options = getOptions('Network.WIFI.Basic')
  }
  componentDidMount () {
    API.getPvalues(['P7800']).then(data => {
      this.setState({
        wifiFunc: data['P7800']
      })
      if (data['P7800'] === '1') {
        this.startWifiScan()
      }
    })
  }
  // 开始定时搜索wifi
  startWifiScan = () => {
    clearInterval(this.TIMER)
    this.handleWifiScan()
    this.TIMER = setInterval(() => {
      this.handleWifiScan()
    }, 12000)
  }
  // 停止定时搜索
  stopWifiScan = () => {
    clearInterval(this.TIMER)
    clearTimeout(this.TIMER2)
    this.TIMER = null
    this.TIMER2 = null
    this.setState({
      wifiScaling: false
    })
  }

  componentWillUnmount () {
    clearInterval(this.TIMER)
    clearTimeout(this.TIMER2)
    this.TIMER = null
    this.TIMER2 = null
  }

  // 切换wifi功能
  toogleWifiFunc = () => {
    let { wifiFunc } = this.state
    let _wifiFunc = wifiFunc === '0' ? '1' : '0'
    this.setState({
      wifiFunc: _wifiFunc
    })
    API.putPvalues({ P7800: _wifiFunc }).then(m => {
      if (_wifiFunc === '1') {
        this.startWifiScan()
      } else {
        this.stopWifiScan()
        this.setState({
          wifiList: []
        })
      }
    })
  }

  handleWifiScan = () => {
    this.setState({
      wifiScaling: true
    })
    setTimeout(() => {
      API.wifiScan().then(m => {
        if (m.res === 'success') {
          this.handleWifiList(0, [])
        }
      })
    }, 800)
  }
  // 获取wifi列表
  handleWifiList = (start, wifiList) => {
    API.getWifiList(start).then(m => {
      let avaibleList = (m.list && m.list.filter(wifi => wifi.level !== '-1')) || []// 过滤掉强度为-1的
      if (m.msg === 'no ap' || avaibleList.length === 0) {
        clearTimeout(this.TIMER2)
        this.TIMER2 = setTimeout(() => this.handleWifiList(start, wifiList), 1000)
      } else if (m.res === 'success') {
        let count = m.count
        let len = m.list.length
        wifiList = wifiList.concat(avaibleList)
        let connectedIndex = wifiList.findIndex(item => item.isConnected === 'CONNECTED')
        if (connectedIndex > 0) {
          [wifiList[0], wifiList[connectedIndex]] = [wifiList[connectedIndex], wifiList[0]]
        }
        if ((start + len) >= count) {
          this.setState({
            wifiList,
            wifiScaling: false
          })
        } else {
          start += len
          this.TIMER2 = setTimeout(this.handleWifiList(start, wifiList), 200)
        }
      }
    })
  }
  // 点击wifi列表的连接按钮 如果是未加密且为保存的 直接连接, 否则打开弹窗进一步操作
  handleConnectClick = (wifiItem) => {
    if (wifiItem.security === '0' && wifiItem.isSaved === 'false') {
      API.connectWifi({
        ssid: wifiItem['ssid'],
        bssid: wifiItem['bssid'],
        security: wifiItem['security'],
        networkid: wifiItem['networkId'],
        saveplusconn: 1
      })
      return false
    }
    this.toogleWifiSelected(wifiItem)
  }

  toogleWifiSelected = (flag) => {
    this.setState({
      wifiSelected: flag
    })
    if (!flag) {
      this.startWifiScan()
    } else {
      this.stopWifiScan()
    }
  }
  render () {
    const { wifiFunc, wifiScaling, wifiList, wifiSelected } = this.state
    const options = this.options
    // console.log(this.options)
    return (
      <Form className='wifi-basic'>
        {/* Wi-Fi功能 */}
        <FormItem {...options['P7800']}>
          <Switch checkedChildren={$t('c_069')} unCheckedChildren={$t('c_070')} checked={wifiFunc === '1'} onChange={() => this.toogleWifiFunc()}/>
        </FormItem>
        {/* ESSID */}
        <FormItem {...options['ESSID']}>
          <Button type='primary' className='scan-btn' disabled={wifiFunc !== '1'} onClick={() => this.handleWifiScan()} loading={wifiScaling}>{$t('b_030')}</Button>
        </FormItem>
        <div className='wifilist-wrapper'>
          {
            wifiList.length === 0
              ? <NoData />
              : (
              <>
                {
                  wifiList[0] && wifiList[0].isConnected === 'CONNECTED'
                    ? <div className='connected-wifi'>
                      <span className='item-ssid'>{wifiList[0].ssid}</span>
                      <span className='item-securityStr'>{$t('c_179')}</span>
                      <span className='item-level'><i className={`icons icon-wifi lvl-${wifiList[0].level}`}></i></span>
                      <span className='item-connected'>
                        <Button className='item-edit-btn' onClick={() => this.handleConnectClick(wifiList[0])}>{$t('b_031')}</Button>
                      </span>
                    </div>

                    : null
                }
                <p className='wifilist-title'>{$t('c_180')}</p>
                <ul className='wifilist-ul'>
                  {
                    wifiList.map((item, i) => {
                      if (item.isConnected !== 'CONNECTED') {
                        return (
                          <li key={i}>
                            {
                              item.isSaved !== 'true'
                                ? <span className='item-ssid'>{item.ssid}</span>
                                : <span className='item-ssid-saved'>{item.ssid}<br/><em>{$t('c_181')}</em></span>
                            }

                            <span className='item-securityStr'>{item.securityStr !== 'None' ? item.securityStr.split(' ')[0] : ''}</span>
                            <span className='item-level'><i className={`icons icon-wifi lvl-${item.level}`}></i></span>
                            <span className='item-connected'>
                              <Button className='item-connect-btn' onClick={() => this.handleConnectClick(item)}>{$t('b_032')}</Button>
                            </span>
                          </li>
                        )
                      }
                      return null
                    })
                  }
                </ul>
              </>
              )
          }

        </div>
        {
          wifiSelected
            ? <WifiDetailModal wifiSelected={wifiSelected} onHide={() => this.toogleWifiSelected(null)} />
            : null
        }
      </Form>
    )
  }
}

export default WifiBasic
