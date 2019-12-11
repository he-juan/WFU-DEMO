import React, { Component } from 'react'
import { List, InputItem, Button } from 'antd-mobile'
import { Link } from 'react-router-dom'
import { Switch } from 'antd-mobile'
import { history } from '../../QuickConfigApp'
import API from '../../api'
import { $t } from '../../Intl'

class AcctConfig extends Component {
  state = {
    values: {
      P47: '', // SIP帐号服务器
      P35: '', // SIP用户ID
      P36: '', // SIP认证ID
      P34: '', // SIP认证密码
      P270: '', // 帐号名称
      P3: '', // 显示名称
      sitename: '', // 会场名称
      P271: ''

    }
  }
  async componentDidMount () {
    let pvalues = await API.getPvalues(['P47', 'P35', 'P36', 'P34', 'P270', 'P3', 'P271'])
    let siteData = await API.sqlitedisplay()
    this.setState({
      values: {
        ...pvalues,
        sitename: siteData.Data ? siteData.Data[0].Sitename : ''
      }
    })
  }
  updateValues = (fields) => {
    this.setState({
      values: Object.assign({}, this.state.values, fields)
    })
  }
  handleSubmit = async () => {
    const { sitename, ...rest } = this.state.values
    await API.putPvalues(rest)
    await API.setSitesettingInfo(sitename)
    history.replace('/result')
  }
  render () {
    const { values } = this.state
    return (
      <div className='page account-config-page'>
        <h3>{$t('c_049')}</h3>
        <List>
          <InputItem
            labelNumber={7}
            value={values.P47}
            onChange={(v) => this.updateValues({ P47: v })}
          >
            {/* SIP帐号服务器 */}
            {$t('c_029')}
          </InputItem>
          <InputItem
            labelNumber={7}
            type='digit'
            value={values.P35}
            onChange={(v) => this.updateValues({ P35: v })}
          >
            {/* SIP用户ID */}
            {$t('c_030')}
          </InputItem>
          <InputItem
            className='long-label'
            labelNumber={7}
            type='digit'
            value={values.P36}
            onChange={(v) => this.updateValues({ P36: v })}
          >
            {/* SIP认证ID */}
            {$t('c_031')}
          </InputItem>
          <InputItem
            className='long-label'
            labelNumber={7}
            type='password'
            value={values.P34}
            onChange={(v) => this.updateValues({ P34: v })}
          >
            {/* SIP认证密码 */}
            {$t('c_032')}
          </InputItem>
          <InputItem
            labelNumber={7}
            type='text'
            value={values.P270}
            onChange={(v) => this.updateValues({ P270: v })}
          >
            {/* 帐号名称 */}
            {$t('c_033')}
          </InputItem>
          <InputItem
            labelNumber={7}
            type='text'
            value={values.P3}
            onChange={(v) => this.updateValues({ P3: v })}
          >
            {/* 显示名称 */}
            {$t('c_034')}
          </InputItem>
          <InputItem
            labelNumber={7}
            type='text'
            value={values.sitename}
            onChange={(v) => this.updateValues({ sitename: v })}
          >
            {/* 会场名称 */}
            {$t('c_035')}
          </InputItem>
          <List.Item
            extra={<Switch checked={!!values.P271}/>}
            onChange={(e) => this.updateValues({ P271: Number(e.target.checked) })}
          >
            {/* 激活帐号 */}
            {$t('c_036')}
          </List.Item>
        </List>
        <div className='page-footer' >
          <div className='link-btns'>
            <Link className='link-btn' to='/network' replace>
              {$t('c_002')}
            </Link>
            <Button type='primary' onClick={this.handleSubmit}>
              {$t('c_001')}
            </Button>
          </div>
          <p>4/4</p>
        </div>
      </div>
    )
  }
}

export default AcctConfig
