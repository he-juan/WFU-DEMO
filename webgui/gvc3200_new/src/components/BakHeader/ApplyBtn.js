/**
 * 应用按钮
 */
import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import API from '@/api'
import { getApplyStatus, setNeedApply, setWholeLoading, getAcctInfo } from '@/store/actions'
import Cookie from 'js-cookie'
import { $t } from '@/Intl'

// eslint-disable-next-line
let timer = null

@connect(
  state => ({
    needApply: state.needApply
  }),
  (dispatch) => ({
    getApplyStatus: () => dispatch(getApplyStatus()),
    setNeedApply: (flag) => dispatch(setNeedApply(flag)),
    setWholeLoading: (isLoad, tip) => dispatch(setWholeLoading(isLoad, tip)),
    getAcctInfo: () => dispatch(getAcctInfo())
  })
)
class ApplyBtn extends Component {
  componentDidMount () {
    const { getApplyStatus } = this.props
    getApplyStatus()
  }

  checkApplyStatus = () => {
    let _this = this
    API.applyPvaluersps().then(data => {
      if (data.phrebootresponse === '0') {
        this.props.getAcctInfo()
        this.props.setWholeLoading(false, '')
        this.props.setNeedApply(false)
      } else {
        timer = setTimeout(_this.checkApplyStatus, 300)
      }
    })
  }

  handleApply = () => {
    this.props.setWholeLoading(true, $t('m_136'))
    let _this = this
    // 检测是否Cookie 中是否存在applyFun 主要两个接口: autoanswer, callforward
    let applyFun = JSON.parse(Cookie.get('applyFun') || '[]')

    Promise.all([
      API.applyPvalue(),
      ...applyFun.map(item => {
        return API[item.action](decodeURIComponent(item.param))
      })
    ]).then(() => {
      Cookie.remove('applyFun')
      timer = setTimeout(_this.checkApplyStatus, 800)
    })
  }

  render () {
    const { needApply } = this.props
    return (
      <CSSTransition in={needApply} timeout={2500} unmountOnExit classNames='apply-btn'>
        <span className='apply-btn' onClick={() => this.handleApply()}>{$t('b_057')}</span>
      </CSSTransition>
    )
  }
}

export default ApplyBtn
