/* eslint-disable object-property-newline */
/* eslint-disable indent */
import React, { Component } from 'react'
import { List, Picker, InputItem, WhiteSpace, Button, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import API from '../../api'
import { history } from '../../QuickConfigApp'
import { $t } from '../../Intl'
import { checkIpv4Address } from '../../validators'
class Ipv4 extends Component {
  state = {
    values: {
      addressType: ['0'],
      ipv4: '',
      mask: '',
      gateway: '',
      dns1: '',
      dns2: '',
      ppoeId: '',
      ppoepw: ''
    }
  }
  componentDidMount () {
    API.getPvalues(
      [ 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14',
        'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'P21',
        'P22', 'P23', 'P24', 'P25', 'P26', 'P27', 'P28', 'P82', 'P83'
      ]
    ).then(data => {
      const { P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23, P24, P82, P83 } = data

      this.setState({
        values: {
          addressType: [P8],
          ipv4: `${P9}.${P10}.${P11}.${P12}`,
          mask: `${P13}.${P14}.${P15}.${P16}`,
          gateway: `${P17}.${P18}.${P19}.${P20}`,
          dns1: `${P21}.${P22}.${P23}.${P24}`,
          ppoeId: P82,
          ppoepw: P83
        }
      })
    })
  }

  updateValues = (fields) => {
    this.setState({
      values: Object.assign({}, this.state.values, fields)
    })
  }
  handleSubmit = () => {
    const { values } = this.state
    const P8 = values.addressType[0]
    let submitValues = { P8 }
    if (P8 === '1') {
      // 输入校验
      if (!checkIpv4Address(values.ipv4)) {
        return Toast.fail($t('c_053')) // IP地址格式不正确
      }
      if (!checkIpv4Address(values.mask)) {
        return Toast.fail($t('c_058')) // 子网掩码格式不正确
      }
      if (!checkIpv4Address(values.gateway)) {
        return Toast.fail($t('c_059')) // 网关地址格式不正确
      }
      if (!checkIpv4Address(values.dns1)) {
        return Toast.fail($t('c_060')) // DNS地址格式不正确
      }
      const [P9, P10, P11, P12] = values.ipv4.split('.')
      const [P13, P14, P15, P16] = values.mask.split('.')
      const [P17, P18, P19, P20] = values.gateway.split('.')
      const [P21, P22, P23, P24] = values.dns1.split('.')
      submitValues = Object.assign({}, submitValues, { P9, P10, P11, P12, P13, P14, P15, P16, P17,
        P18, P19, P20, P21, P22, P23, P24 })
    } else if (P8 === '2') {
      const [ P82, P83] = [ values.ppoeId, values.ppoepw]
      if (P82 === '' || P83 === '') {
        return Toast.fail($t('c_061')) // PPPoE帐号和密码不能为空
      }
      submitValues = Object.assign({}, submitValues, { P82, P83 })
    }

    API.putPvalues(submitValues).then(m => {
      history.replace('/network/advanced')
    })
  }
  render () {
    const { values } = this.state
    return (
      <div className='child-page ipv4-page'>
        <h3>{$t('c_051')}</h3>
        <List>
          <Picker
            data={[
              { label: 'DHCP', value: '0' },
              { label: $t('c_026'), value: '1' },
              { label: 'PPPoE', value: '2' }
            ]}
            cols={1}
            value={values.addressType}
            onChange={(v) => this.updateValues({ addressType: v })}
          >
            <List.Item arrow='horizontal'>{$t('c_012')}</List.Item>
          </Picker>
        </List>
        <WhiteSpace size='xl'/>
        {
          values.addressType[0] === '1' ? (
            <List>
              <InputItem
                type='money'
                value={values.ipv4}
                placeholder={$t('c_062')}
                labelNumber={6}
                onChange={(v) => this.updateValues({ ipv4: v })}
              >
                {/* IPv4地址 */}
                {$t('c_019')}
              </InputItem>
              <InputItem
                type='money'
                value={values.mask}
                placeholder={$t('c_062')}
                labelNumber={6}
                onChange={(v) => this.updateValues({ mask: v })}
              >
                {/* 子网掩码 */}
                {$t('c_020')}
              </InputItem>
              <InputItem
                type='money'
                value={values.gateway}
                placeholder={$t('c_062')}
                labelNumber={6}
                onChange={(v) => this.updateValues({ gateway: v })}
              >
                {/* 默认网关 */}
                {$t('c_021')}
              </InputItem>
              <InputItem
                type='money'
                value={values.dns1}
                placeholder={$t('c_062')}
                labelNumber={6}
                onChange={(v) => this.updateValues({ dns1: v })}
              >
                {/* DNS服务器1 */}
                {$t('c_022')}
              </InputItem>
            </List>
          ) : values.addressType[0] === '2' ? (
            <List>
              <InputItem
                value={values.ppoeId}
                placeholder={$t('c_062')}
                labelNumber={7}
                onChange={(v) => this.updateValues({ ppoeId: v })}
              >
                {/* PPPoE帐号ID */}
                {$t('c_024')}
              </InputItem>
              <InputItem
                key='ppoepw' // Bugfree 2815
                type='password'
                placeholder={$t('c_062')}
                autoComplete={'new-password'}
                labelNumber={7}
                onChange={(v) => this.updateValues({ ppoepw: v })}
              >
                {/* PPPoE密码 */}
                {$t('c_025')}
              </InputItem>
            </List>
          ) : null
        }

        <div className='page-footer'>
          <div className='link-btns'>
            <Link className='link-btn' to='/network/advanced' replace>
              {$t('c_002')}
            </Link>
            <Button type='primary' onClick={this.handleSubmit}>
              {$t('c_004')}
            </Button>
          </div>
          <p></p>
        </div>
      </div>
    )
  }
}

export default Ipv4
