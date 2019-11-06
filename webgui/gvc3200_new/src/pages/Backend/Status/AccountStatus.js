import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAcctStatus } from '@/store/actions'
import './AccountStatus.less'
import { $t } from '@/Intl'

@connect(
  state => ({
    acctStatus: state.acctStatus
  }),
  dispatch => ({
    getAcctStatus: () => dispatch(getAcctStatus())
  })
)
class AccountStatus extends Component {
  componentDidMount () {
    this.props.getAcctStatus()
  }
  render () {
    const { acctStatus } = this.props
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
            acctStatus.map(acctInfo => (
              <tr key={acctInfo.acctIndex}>
                <td>
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
            ))
          }
        </tbody>
      </table>
    )
  }
}

export default AccountStatus
