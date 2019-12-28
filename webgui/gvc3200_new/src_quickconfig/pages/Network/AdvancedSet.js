import React, { Component } from 'react'
import { List, Picker, WhiteSpace, Button } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { history } from '../../QuickConfigApp'
import SlideRoute from '../../components/SlideRoute'
import NetworkIpv4 from './Ipv4'
import NetworkIpv6 from './Ipv6'
import API from '../../api'
import { $t } from '../../Intl'

class AdvancedSet extends Component {
  state = {
    P1415: '0'
  }
  componentDidMount () {
    API.getPvalues(['P1415']).then(data => {
      this.setState({
        P1415: data.P1415
      })
    })
  }
  handlePickProtocol = (v) => {
    this.setState({
      P1415: v[0]
    })
  }
  handleSubmit = (cb) => {
    const { P1415 } = this.state
    API.putPvalues({ P1415 }).then(cb)
  }
  render () {
    const { P1415 } = this.state
    return (
      <div className='child-page network-advanced-page'>
        <h3>{$t('c_008')}</h3>
        <List>
          <Picker
            data={[
              { label: $t('c_014'), value: '0' },
              { label: $t('c_015'), value: '1' },
              { label: $t('c_016'), value: '2' },
              { label: $t('c_017'), value: '3' }
            ]}
            cols={1}
            value={[P1415]}
            onPickerChange={this.handlePickProtocol}
          >
            <List.Item arrow='horizontal'>{$t('c_011')}</List.Item>
          </Picker>
        </List>
        <WhiteSpace size='xl'/>
        <List>
          <List.Item
            arrow='horizontal'
            onClick={() => { this.handleSubmit(() => history.replace('/network/advanced/ipv4')) }}
          >{$t('c_012')}
          </List.Item>
          <List.Item
            arrow='horizontal'
            onClick={() => { this.handleSubmit(() => history.replace('/network/advanced/ipv6')) }}
          >
            {$t('c_013')}
          </List.Item>
        </List>
        <div className='page-footer'>
          <div className='link-btns'>
            <Link className='link-btn' to='/network' replace>
              {$t('c_002')}
            </Link>
            <Button type='primary' onClick={() => { this.handleSubmit(() => history.replace('/network')) }}>
              {$t('c_004')}
            </Button>
          </div>
          <p></p>
        </div>
        <SlideRoute path='/network/advanced/ipv4' component={NetworkIpv4}/>
        <SlideRoute path='/network/advanced/ipv6' component={NetworkIpv6}/>
      </div>
    )
  }
}

export default AdvancedSet
