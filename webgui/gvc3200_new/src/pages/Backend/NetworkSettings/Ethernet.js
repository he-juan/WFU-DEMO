import React from 'react'
import FormCommon from '@/components/FormCommon'
import { Form, Button, Input, Upload, Icon, message, Spin } from 'antd'
import FormItem, { SelectItem, InputItem, RadioGroupItem, PwInputItem } from '@/components/FormItem'
import { getOptions } from '@/template'
import { history } from '@/App'
import API from '@/api'
import { $t } from '@/Intl'
import { compressIPV6 } from '@/utils/tools'

@Form.create()
class Ethernet extends FormCommon {
  constructor (props) {
    super(props)

    this.state = {
      twoVlan: false, // 双vlan
      inLldpvlanid: false, // ?
      inLldpvlanqos: false, // ?
      loadingData: true
    }

    this.options = getOptions('Network.Ethernet')

    this.ipInputRule = [this.required(), this.digits(), this.range(0, 255)]
  }

  componentDidMount () {
    const { setFieldsValue } = this.props.form

    // P22104 该p值标识是否是双vlan
    this.options['P22104'] = { p: 'P22104' }

    // P22111: 应用于VOIP通话的第二层QoS 802.1Q/VLAN标记(以太网)
    // P22112: 应用于VoIP通话的第二层QoS 802.1p优先级(以太网)
    this.options['P22111'] = { p: 'P22111' }
    this.options['P22112'] = { p: 'P22112' }

    // lldp环境临时P值
    this.options['Pvlan_id'] = { p: 'Pvlan_id' }
    this.options['Pvlan_qos'] = { p: 'Pvlan_qos' }
    this.options['Pin_lldp'] = { p: 'Pin_lldp' }

    this.initFormValue(this.options).then(data => {
      const { P22104, P22111, P22112, Pvlan_id, Pvlan_qos, Pin_lldp, ...others } = data

      // 缩写 IPV6 地址 '2001:0db8:0001:0003:0000:0000:0000:3002' => '2001:db8:1:3::3002'
      others['P1420'] = compressIPV6(others['P1420'])
      others['P1424'] = compressIPV6(others['P1424'])
      others['P1425'] = compressIPV6(others['P1425'])
      others['P1423'] = compressIPV6(others['P1423'])

      this.setState({
        twoVlan: Number(P22104)
      })
      // 初始表单
      setFieldsValue(others)
      // lldp环境下的处理
      this.lldpQosSet({ Pvlan_id, Pvlan_qos, Pin_lldp })
      this.setState({
        loadingData: false
      })
    })
  }

  // lldp环境下 P51 P87使用临时P值展示?
  lldpQosSet ({ Pvlan_id, Pvlan_qos, Pin_lldp }) {
    const { setFieldsValue } = this.props.form
    if (Pvlan_id !== '' && Pvlan_id !== '0') {
      setFieldsValue({ P51: Pvlan_id })
      this.setState({ inLldpvlanid: true })
    }
    if (Pvlan_qos !== '' && Pvlan_qos !== '0') {
      setFieldsValue({ P87: Pvlan_qos })
      this.setState({ inLldpvlanqos: true })
    }
  }

  // upload 配置
  uploadConfig = (url) => {
    return {
      name: 'file',
      action: url,
      onChange (info) {
        const { response, status } = info.file
        if (response && response.indexOf('Authentication Required') > -1) {
          history.push(`/login?redirect=${encodeURIComponent(history.location.pathname)}`)
          return false
        }
        if (status === 'done') {
        } else if (status === 'error') {
          message.error($t('m_019'))
        }
      },
      onRemove () {
        message.destroy()
      }
    }
  }

  // 子网掩码校验
  checkMaskCode = (mask1, mask2, mask3, mask4) => {
    function tobinary (n) {
      var binstr = tobinChange(n)
      while (binstr.length % 8 !== 0) {
        binstr = '0' + binstr
      }
      return binstr
    }
    function tobinChange (n) {
      if (!isNaN(n) && n > 0) {
        if (n % 2 === 0) {
          return tobinChange(n / 2) + '0'
        } else {
          if (n > 2) {
            return tobinChange(parseInt(n / 2)) + (n % 2)
          } else {
            return tobinChange(0) + n
          }
        }
      } else {
        return ''
      }
    }
    let submaskbinarystr = tobinary(parseInt(mask1)) + tobinary(parseInt(mask2)) + tobinary(parseInt(mask3)) + tobinary(parseInt(mask4))
    let pos0 = submaskbinarystr.indexOf('0')
    if ((pos0 >= 0 && pos0 < submaskbinarystr.lastIndexOf('1')) || !submaskbinarystr) {
      return false
    }
    return true
  }

  // 提交表单
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        if (this.state.inLldpvlanid || this.state.inLldpvlanqos) {
          delete values['P51']
          delete values['P87']
        }
        if (values.P8 === '2' && (values.P82 === '' || values.P83 === '')) {
          message.error($t('m_088'))
          return false
        }
        if (values.P8 === '1') {
          if (+values['P9'] > 223 && +values['P9'] < 240) {
            message.error($t('m_217'))
            return false
          }
          if (!this.checkMaskCode(values['P13'], values['P14'], values['P15'], values['P16'])) {
            message.error($t('m_089'))
            return false
          }
          let gatewaySet = new Set(values['P17'], values['P18'], values['P19'], values['P20'])
          if ([...gatewaySet].length === 1 && [...gatewaySet][0] === '0') {
            message.error($t('m_172'))
            return false
          }
        }
        // 处理双vlan和非双vlan时, 不太理解的操作 可能会存在比较严重的bug
        if (this.state.twoVlan) {
          let P22111 = this.INIT_VALUE.P22111 || '0'
          let P22112 = this.INIT_VALUE.P22112 || '0'

          API.putTwoVlan({ enable: 0, vid: P22111, privority: P22112 })
            .then(() => {
              return this.submitFormValue(values, 0, 0)
            })
            .then(() => {
              message.success($t('m_001'))
              return API.putTwoVlan({ enable: 1, vid: P22111, privority: P22112 })
            })
        } else {
          this.submitFormValue(values, 0, 0).then(msgs => {
            if (msgs.Response === 'Success') {
              message.success($t('m_001'))
              API.putNetwork()
            }
          })
        }
        // API.restart8021x()
      }
    })
  }
  render () {
    const { getFieldDecorator: gfd, getFieldValue } = this.props.form
    const { twoVlan, inLldpvlanid, inLldpvlanqos, loadingData } = this.state
    const options = this.options
    // ipv4 地址类型
    const P8 = getFieldValue('P8')
    // ipv6 地址
    const P1419 = getFieldValue('P1419')
    // 802.1X模式
    const P7901 = getFieldValue('P7901')
    // ipv4(voip) 地址类型
    const P22105 = getFieldValue('P22105')
    // ipv6(voip) 地址
    const P22114 = getFieldValue('P22114')
    return (
      <Spin spinning={loadingData} wrapperClassName='common-loading-spin'>
        <Form hideRequiredMark>
          {/* 首选网络协议 */}
          <SelectItem
            {...options['P1415']}
            gfd={gfd}
            selectOptions={[
              { v: '0', t: $t('c_165') },
              { v: '1', t: $t('c_166') },
              { v: '2', t: $t('c_167') },
              { v: '3', t: $t('c_168') }
            ]}
          />
          {
            twoVlan ? <h4 className='bak-sub-title'>{$t('c_086')}</h4> : null
          }
          <h4 className={twoVlan ? 'bak-sub-title-1' : 'bak-sub-title'}>IPv4</h4>
          {/* IPv4地址类型 */}
          <RadioGroupItem
            {...options['P8']}
            gfd={gfd}
            radioOptions={[
              { v: '0', t: 'DHCP' },
              { v: '1', t: $t('c_085') },
              { v: '2', t: 'PPPoE' }
            ]}
          />
          {/* DHCP VLAN模式 */}
          <SelectItem
            {...options['P8300']}
            gfd={gfd}
            hide={P8 !== '0'}
            selectOptions={[
              { v: '0', t: $t('c_066') },
              { v: '1', t: $t('c_170') },
              { v: '2', t: $t('c_171') }
            ]}
          />
          {/* 主机名(Option 12) */}
          <InputItem
            {...options['P146']}
            gfd={gfd}
            hide={P8 !== '0'}
            gfdOptions={{
              rules: [
                this.maxLen(40),
                this.checkNoCH()
              ]
            }}
          />
          {/* 厂家类别名(Option 60) */}
          <InputItem
            {...options['P148']}
            gfd={gfd}
            hide={P8 !== '0'}
            gfdOptions={{
              rules: [
                this.maxLen(40),
                this.checkNoCH()
              ]
            }}
          />
          {/* IP地址 */}
          <FormItem {...options['P9']} hide={P8 !== '1'} className='ip-input-form-item'>
            <Form.Item className='sub-form-item'>
              {gfd('P9', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P10', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P11', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P12', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
          </FormItem>
          {/* 子网掩码 */}
          <FormItem {...options['P13']} hide={P8 !== '1'} className='ip-input-form-item'>
            <Form.Item className='sub-form-item'>
              {gfd('P13', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P14', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P15', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P16', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
          </FormItem>
          {/* 网关 */}
          <FormItem {...options['P17']} hide={P8 !== '1'} className='ip-input-form-item'>
            <Form.Item className='sub-form-item'>
              {gfd('P17', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P18', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P19', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P20', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
          </FormItem>
          {/* DNS服务器1 */}
          <FormItem {...options['P21']} hide={P8 !== '1'} className='ip-input-form-item'>
            <Form.Item className='sub-form-item'>
              {gfd('P21', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P22', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P23', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P24', { rules: this.ipInputRule, hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
          </FormItem>
          {/* DNS服务器2 */}
          <FormItem {...options['P25']} hide={P8 !== '1'} className='ip-input-form-item'>
            <Form.Item className='sub-form-item'>
              {gfd('P25', { rules: [this.digits(), this.range(0, 255)], hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P26', { rules: [this.digits(), this.range(0, 255)], hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P27', { rules: [this.digits(), this.range(0, 255)], hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
            <em>.</em>
            <Form.Item className='sub-form-item'>
              {gfd('P28', { rules: [this.digits(), this.range(0, 255)], hidden: P8 !== '1' })(<Input />)}
            </Form.Item>
          </FormItem>
          {/* PPPoE帐号ID */}
          <InputItem
            {...options['P82']}
            gfd={gfd}
            hide={P8 !== '2'}
            gfdOptions={{
              rules: [
                this.maxLen(32)
              ]
            }}
          />
          {/* PPPoE密码 */}
          <PwInputItem
            {...options['P83']}
            gfd={gfd}
            hide={P8 !== '2'}
            gfdOptions={{
              rules: [
                this.maxLen(32)
              ]
            }}
          />
          {/* 应用于数据的第二层QoS 802.1Q/VLAN标记(以太网)或 第二层QoS 802.1Q/VLAN标记(以太网) */}
          <InputItem
            label={twoVlan ? 'net_013' : 'net_006'}
            tips='net_006_tip'
            gfd={gfd}
            name='P51'
            disabled={inLldpvlanid}
            gfdOptions={{
              rules: [
                this.required(),
                this.digits(),
                this.range(0, 4094)
              ]
            }}
          />
          {/* 应用于数据的第二层QoS 802.1p优先级 (以太网)或  第二层QoS 802.1p优先级 (以太网) */}
          <InputItem
            label={twoVlan ? 'net_014' : 'net_007' }
            tips='net_007_tip'
            gfd={gfd}
            name='P87'
            disabled={inLldpvlanqos}
            reboot={true}
            gfdOptions={{
              rules: [
                this.required(),
                this.digits(),
                this.range(0, 7)
              ]
            }}
          />
          <h4 className={twoVlan ? 'bak-sub-title-1' : 'bak-sub-title'}>IPv6</h4>
          {/* IPv6地址 */}
          <SelectItem
            {...options['P1419']}
            tips='123'
            gfd={gfd}
            selectOptions={[
              { v: '0', t: $t('c_172') },
              { v: '1', t: $t('c_173') }
            ]}
          />
          {/* 静态IPv6地址 */}
          <InputItem
            {...options['P1420']}
            gfd={gfd}
            hide={P1419 !== '1'}
            gfdOptions={{
              rules: [
                this.required(),
                this.checkIpv6()
              ]
            }}
          />
          {/* IPv6前缀长度 */}
          <InputItem
            {...options['P1421']}
            gfd={gfd}
            hide={P1419 !== '1'}
            gfdOptions={{
              rules: [
                this.required(),
                this.digits(),
                this.range(1, 128)
              ]
            }}
          />
          {/* DNS服务器1 */}
          <InputItem
            {...options['P1424']}
            gfd={gfd}
            hide={P1419 !== '1'}
            gfdOptions={{
              rules: [
                this.required(),
                this.checkIpv6()
              ]
            }}
          />
          {/* DNS服务器2 */}
          <InputItem
            {...options['P1425']}
            gfd={gfd}
            hide={P1419 !== '1'}
            gfdOptions={{
              rules: [
                this.checkIpv6()
              ]
            }}
          />
          {/* 首选DNS服务器 */}
          <InputItem
            {...options['P1423']}
            gfd={gfd}
            gfdOptions={{
              rules: [
                this.checkIpv6()
              ]
            }}
          />
          <div style={{ display: twoVlan ? 'block' : 'none' }}>
            <h4 className='bak-sub-title'>{$t('c_087')}</h4>
            <h4 className='bak-sub-title-1'>IPv4</h4>
            {/* IPv4地址类型 */}
            <RadioGroupItem
              {...options['P22105']}
              gfd={gfd}
              radioOptions={[
                { v: '0', t: 'DHCP' },
                { v: '1', t: $t('c_085') }
              ]}
            />
            {/* IP地址 */}
            <InputItem
              {...options['P22106']}
              gfd={gfd}
              hide={P22105 !== '1'}
              gfdOptions={{
                rules: [
                  this.checkUrlPath()
                ]
              }}
            />
            {/* 子网掩码 */}
            <InputItem
              {...options['P22107']}
              gfd={gfd}
              hide={P22105 !== '1'}
              gfdOptions={{
                rules: [
                  this.checkUrlPath()
                ]
              }}
            />
            {/* 网关 */}
            <InputItem
              {...options['P22108']}
              gfd={gfd}
              hide={P22105 !== '1'}
              gfdOptions={{
                rules: [
                  this.checkUrlPath()
                ]
              }}
            />
            {/* DNS服务器1 */}
            <InputItem
              {...options['P22109']}
              gfd={gfd}
              hide={P22105 !== '1'}
              gfdOptions={{
                rules: [
                  this.checkUrlPath()
                ]
              }}
            />
            {/* DNS服务器2 */}
            <InputItem
              {...options['P22110']}
              gfd={gfd}
              hide={P22105 !== '1'}
              gfdOptions={{
                rules: [
                  this.checkUrlPath()
                ]
              }}
            />
            <h4 className='bak-sub-title-1'>IPv6</h4>
            {/* IPv6地址 */}
            <SelectItem
              {...options['P22114']}
              gfd={gfd}
              selectOptions={[
                { v: '0', t: $t('c_172') },
                { v: '1', t: $t('c_173') }
              ]}
            />
            {/* 静态IPv6地址 */}
            <InputItem
              {...options['P22115']}
              gfd={gfd}
              hide={P22114 !== '1'}
              gfdOptions={{
                rules: [
                  this.checkIpv6()
                ]
              }}
            />
            {/* IPv6前缀长度 */}
            <InputItem
              {...options['P22116']}
              gfd={gfd}
              hide={P22114 !== '1'}
              gfdOptions={{
              }}
            />
          </div>
          <h4 className='bak-sub-title'>{$t('c_174')}</h4>
          {/* 802.1X模式 */}
          <SelectItem
            {...options['P7901']}
            gfd={gfd}
            selectOptions={[
              { v: '0', t: $t('c_066') },
              { v: '1', t: 'EAP-MD5' },
              { v: '2', t: 'EAP-TLS' },
              { v: '3', t: 'EAP-PEAP' }
            ]}
          />
          {/* 802.1X认证信息 */}
          <InputItem
            {...options['P7902']}
            gfd={gfd}
            hide={P7901 !== '1' && P7901 !== '3'}
          />
          {/* 802.1X密码 */}
          <PwInputItem
            {...options['P7903']}
            gfd={gfd}
            hide={P7901 === '0'}
          />
          <FormItem {...options['802ca']} hide={P7901 === '0' || P7901 === '1'}>
            <Upload {...this.uploadConfig('../upload?type=802ca')}>
              <Button>
                <Icon type='upload' /> {$t('b_016')}
              </Button>
            </Upload>
          </FormItem>
          <FormItem {...options['802client']} hide={P7901 !== '2'}>
            <Upload {...this.uploadConfig('../upload?type=802client')}>
              <Button>
                <Icon type='upload' /> {$t('b_016')}
              </Button>
            </Upload>
          </FormItem>
          <FormItem {...options['802privatekey']} hide={P7901 !== '2'}>
            <Upload {...this.uploadConfig('../upload?type=802privatekey')}>
              <Button>
                <Icon type='upload' /> {$t('b_016')}
              </Button>
            </Upload>
          </FormItem>
          <FormItem>
            <Button className='sub-btn' id='subBtn' onClick={this.handleSubmit}>{$t('b_001')}</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default Ethernet
