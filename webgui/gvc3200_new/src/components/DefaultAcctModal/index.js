/**
 * 当默认账号被取消激活时，需要弹窗显示选择其他账号作为默认账号, 如果没有其他账号则不显示该弹窗
 */
import React, { Component } from 'react'
import { Modal, Select } from 'antd'
import { connect } from 'react-redux'
import { setDefaultAcct } from '@/store/actions'
import PropTypes from 'prop-types'
import API from '@/api'
import { $t } from '@/Intl'

@connect(
  state => ({}),
  dispatch => ({
    setDefaultAcct: (acctIndex) => dispatch(setDefaultAcct(acctIndex))
  })
)
class DefaultAcctModal extends Component {
  static propTypes = {
    restActiveAcct: PropTypes.array, // 其他已激活的账号
    cb: PropTypes.func.isRequired // 当前页面表单的submit方法
  }

  state = {
    acctValue: 0
  }

  componentDidUpdate (preProps) {
    if (preProps.restActiveAcct.length === 0 && this.props.restActiveAcct.length > 0) {
      this.setState({
        acctValue: this.props.restActiveAcct[0].acctIndex
      })
    }
  }

  handleChange = (v) => {
    this.setState({
      acctValue: v
    })
  }

  handleOk = () => {
    const { setDefaultAcct, cb, onCancel } = this.props
    const acctValue = this.state.acctValue
    API.setDefAcct(acctValue).then(m => {
      setDefaultAcct(acctValue)
      setTimeout(() => {
        cb()
        onCancel()
      }, 0)
    })
  }

  render () {
    const { restActiveAcct, onCancel } = this.props
    const { acctValue } = this.state
    return (
      <Modal
        visible={restActiveAcct.length > 0}
        width={400}
        onCancel={onCancel}
        onOk={this.handleOk}
      >
        {/* 取消激活默认帐号, 重新设置默认帐号为 */}
        <p>{$t('c_306')}</p>
        <Select value={acctValue} onChange={this.handleChange} style={{ width: 250 }}>
          {
            restActiveAcct.map(acct => {
              return <Select.Option key={acct.acctIndex} value={acct.acctIndex}>{acct.name}</Select.Option>
            })
          }
        </Select>
      </Modal>
    )
  }
}

export default DefaultAcctModal
