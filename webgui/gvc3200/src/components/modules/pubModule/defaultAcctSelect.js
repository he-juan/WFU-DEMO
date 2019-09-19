import React, { Component } from 'react'
import { Modal, Select } from 'antd'
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Enhance from '../../mixins/Enhance';

const Option = Select.Option

function parseAcctStatus(acctstatus) {
  let headers = acctstatus.headers
  let result = [];
  let acctIndex = [
    { index: '0',name: 'SIP' },
    { index: '1',name: 'IPVideoTalk' },
    // { index: '2',name: 'BlueJeans' },
    { index: '8',name: 'H.323' },
  ]
  acctIndex.map((item) => {
    let i = item.index
    let name = item.name
    result.push({
      "acctindex": i,
      "register": parseInt(headers[`account_${i == 8 ? 6 : i}_status`]),  // 账号注册状态
      "activate": parseInt(headers[`account_${i == 8 ? 6 : i}_activate`]), // 账号激活状态
      "num": headers[`account_${i == 8 ? 6 : i}_no`],
      "name": name
    })
  })
  return result
}
class DefaultAcctSelect extends Component {
  constructor () {
    super()
    this.state = {
      activateStatus: null,
      defAcc: 0
    }
  }
  componentDidMount() {
    const { getAcctStatus, currAcct } = this.props
    getAcctStatus((acctstatus) => {
      if (!this.isEmptyObject(acctstatus)) {
        let activateStatus = parseAcctStatus(acctstatus).filter(v => v.activate == '1' && v.register == '1' && v.acctindex != currAcct)
        // let activateStatus = parseAcctStatus(acctstatus).filter(v => v.acctindex != currAcct)
        this.setState({
          activateStatus: activateStatus,
          defAcc: activateStatus[0].acctindex
        })
      }
    })
  }
  handleSelectDef() {
    this.props.setDefaultAcct(this.state.defAcc, () => {
      this.props.cb()
    })
  }
  render() {
    const { activateStatus } = this.state
    if(!activateStatus) return null
    const { defaultAcct, currAcct} = this.props
    return (
      <Modal 
        visible={defaultAcct == currAcct} 
        width={400} 
        onOk={() => this.handleSelectDef()}
        onCancel={() => this.props.cancel()}
        >
        <div style={{margin: '20px 0 0', lineHeight: 1.5, fontSize: 13}}>
          {this.tr('a_19198')}: <br /> <br />
          <Select style={{width: 200}} defaultValue={activateStatus[0].acctindex} onSelect={(v) => this.setState({defAcc: v})}>
            {activateStatus.map(v => {
              return <Option value={v.acctindex} key={v.name}>{v.name}</Option>
            })}
          </Select>
        </div>
      </Modal>
    )
  }
}

const mapState = (state) => ({
  defaultAcct: state.defaultAcct,
})

const mapDispatch = (dispatch) => {
  var actions = {
    getAcctStatus: Actions.getAcctStatus,
    setDefaultAcct: Actions.set_defaultacct
  }

  return bindActionCreators(actions, dispatch)
}
export default connect(mapState, mapDispatch)(Enhance(DefaultAcctSelect))