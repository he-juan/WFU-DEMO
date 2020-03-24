import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAcctInfo } from '@/store/actions'
import './AccountStatus.less'
import { $t } from '@/Intl'

@connect(
  state => ({
    acctStatus: state.acctStatus,
    IPVTExist: state.IPVTExist,
    locale: state.locale
  }),
  dispatch => ({
    getAcctInfo: () => dispatch(getAcctInfo())
  })
)
class AccountStatus extends Component {
  componentDidMount () {
    this.props.getAcctInfo()
  }

  componentDidUpdate (preProps) {
    if (preProps.locale !== this.props.locale) { // 解决切换语言不更新的问题
      setTimeout(() => this.forceUpdate(), 200)
    }
  }

  render () {
    const { acctStatus, IPVTExist } = this.props
    const ths = ['c_078', 'c_079', 'c_080', 'c_081']

    return (
      <table className='accounts-table'>
        <thead>
          <tr>
            {
              ths.map(el => <th key={el}>{$t(el)}</th>)
            }
          </tr>
        </thead>
        <tbody>
          {
            acctStatus.map(acctInfo => {
              if (acctInfo.acctIndex === 1 && IPVTExist === 0) return null
              return (
                <tr key={acctInfo.acctIndex}>
                  <td title={acctInfo['name'] || '-'}>
                    <i className={`icons icon-acctstatus ${+acctInfo.register === 0 ? '' : acctInfo.activate !== 7 ? 'active-1' : 'active-2'}`}></i>
                    {acctInfo['name'] || '-'}
                  </td>
                  <td>
                    {acctInfo['num'] || '-'}
                  </td>
                  <td>
                    {acctInfo['server'] || '-'}
                  </td>
                  <td>
                    <span style={{ color: acctInfo['register'] === 0 ? '#7d8a99' : '#42db66' }}>
                      {acctInfo['register'] === 0 ? $t('c_083') : $t('c_082')}
                    </span>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}

export default AccountStatus
