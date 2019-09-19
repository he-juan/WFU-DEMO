/**
 * ipvt共享摄像头选择弹窗
 */

import React, {Component} from 'react'
import Enhance from "../../../../mixins/Enhance";
import * as Actions from '../../../../redux/actions/index';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal, Button} from "antd"

class IPVTShareCamera extends Component {
  acceptipvtinvite = (line) => {
    this.props.acceptorejectipvtcmr(line, "1");
    this.props.setipvtcmrinviteinfo(null);
  }

  rejectipvtinvite = (line) => {
      this.props.acceptorejectipvtcmr(line, "0");
      this.props.setipvtcmrinviteinfo(null);
  }
  render() {
    const { ipvtcmrinviteinfo } = this.props
    if(!ipvtcmrinviteinfo) return null
    return (
      <Modal visible={ true } width={300} footer={null} closable={false} className="endall-confirm">
        <p className="confirm-content"><span>{ipvtcmrinviteinfo.name || ""}</span><span>{this.tr("a_10218")}</span></p>
        <div className="modal-footer">
          <Button type="primary" onClick={()=>this.acceptipvtinvite(ipvtcmrinviteinfo.line)}>{this.tr("a_10000")}</Button>
          <Button onClick={()=>this.rejectipvtinvite(ipvtcmrinviteinfo.line)}>{this.tr("a_19138")}</Button>
        </div>
      </Modal>
    )
  }
}


const mapStateToProps = (state) => ({
  ipvtcmrinviteinfo: state.ipvtcmrinviteinfo,

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
      setipvtcmrinviteinfo: Actions.setipvtcmrinviteinfo,
      acceptorejectipvtcmr: Actions.acceptorejectipvtcmr,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(IPVTShareCamera))