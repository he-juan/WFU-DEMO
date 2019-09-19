import React, { Component } from 'react'
import { List, Picker, InputItem, WhiteSpace, Button, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import API from '../../api'
import { history } from '../../QuickConfigApp'
import { $t } from '../../Intl'
import { checkIpv6Address, checkdigits } from '../../validators'

class Ipv6 extends Component {
  state = {
    values: {
      addressType: ['0'],
      ipv6: '',
      ipv6prefix: '',
      dns1: '',
      dns2: ''
    }
  }

  handlePickAddressType = (v) => {
    this.setState({
      addressType: v
    })
  }
  updateValues = (fields) => {
    this.setState({
      values: Object.assign({}, this.state.values, fields)
    })
  }
  componentDidMount = () => {
    API.getPvalues(['P1419', 'P1420', 'P1421', 'P1424', 'P1425']).then(data => {
      const { P1419, P1420, P1421, P1424, P1425 } = data
      this.setState({
        values: {
          addressType: [P1419],
          ipv6: P1420,
          ipv6prefix: P1421,
          dns1: P1424,
          dns2: P1425
        }
      })
    })
  }
  handleSubmit = () => {
    const { values } = this.state
    const P1419 = values.addressType[0]
    let submitValues = { P1419 }
    if (P1419 === '1') {
      const [P1420, P1421, P1424, P1425] = [values.ipv6, values.ipv6prefix, values.dns1, values.dns2]
      if (!checkIpv6Address(P1420)) {
        return Toast.fail($t('c_053')) // IP地址格式错误
      }
      if (!checkdigits(P1421)) {
        return Toast.fail($t('c_054')) // IPv6前缀长度只能为数字
      }
      if (parseInt(P1421) < 1 || parseInt(P1421) > 128) {
        return Toast.fail($t('c_055')) // IPv6前缀长度有效值
      }
      if (P1424 !== '' && !checkIpv6Address(P1424)) {
        return Toast.fail($t('c_056')) // DNS服务器1格式不正确
      }
      if (P1425 !== '' && !checkIpv6Address(P1425)) {
        return Toast.fail($t('c_057')) // DNS服务器2格式不正确
      }
      submitValues = Object.assign({}, submitValues, { P1420, P1421, P1424, P1425 })
    }

    API.putPvalues(submitValues).then(() => {
      history.replace('/network/advanced')
    })
  }
  render () {
    const { values } = this.state
    return (
      <div className='child-page ipv6-page'>
        <h3>{$t('c_052')}</h3>
        <List>
          <Picker
            data={[
              { label: 'DHCP', value: '0' },
              { label: $t('c_026'), value: '1' }
            ]}
            cols={1}
            value={values.addressType}
            onPickerChange={(v) => this.updateValues({ addressType: v })}
          >
            <List.Item arrow='horizontal'>{$t('c_013')}</List.Item>
          </Picker>
        </List>
        <WhiteSpace size='xl'/>
        {
          values.addressType[0] === '1' ? (
            <List>
              <InputItem
                value={values['ipv6']}
                labelNumber={7}
                onChange={(v) => this.updateValues({ ipv6: v })}
              >
                {/* IPv6地址 */}
                {$t('c_027')}
              </InputItem>
              <InputItem
                type='number'
                labelNumber={7}
                value={values['ipv6prefix']}
                onChange={(v) => this.updateValues({ ipv6prefix: v })}
              >
                {/* IPv6前缀长度 */}
                {$t('c_028')}
              </InputItem>
              <InputItem
                type='money'
                value={values['dns1']}
                onChange={(v) => this.updateValues({ dns1: v })}
              >
                {/* DNS服务器1 */}
                {$t('c_022')}
              </InputItem>
              <InputItem
                type='money'
                value={values['dns2']}
                onChange={(v) => this.updateValues({ dns2: v })}
              >
                {/* DNS服务器2 */}
                {$t('c_023')}
              </InputItem>
            </List>
          ) : null
        }

        <div className='page-footer'>
          <div className='link-btns'>
            <Link className='link-btn' to='/network/advanced' replace>
              {$t('c_002')}
            </Link>
            <Button type='primary' onClick={() => this.handleSubmit()}>
              {$t('c_004')}
            </Button>
          </div>
          <p></p>
        </div>
      </div>
    )
  }
}

export default Ipv6
