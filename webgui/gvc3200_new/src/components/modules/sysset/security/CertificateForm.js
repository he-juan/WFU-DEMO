import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form } from "antd";
import SipCert from "./certs/SipCert";
import CustomCert from "./certs/CustomCert"

class CertificateForm extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const { callTr } = this.props;
        return(
            <Form hideRequiredMark>
                <div className="blocktitle"><s></s>{callTr("a_802ca")}</div>
                <SipCert {...this.props} />
                <div className="blocktitle"><s></s>{callTr("a_19282")}</div>
                <CustomCert {...this.props} />
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({

})

function mapDispatchToProps(dispatch) {
  let actions = {
      getVeriCert: Actions.getVeriCert,
      checkVeriCert: Actions.checkVeriCert,
      putNvrams: Actions.putNvrams,
      promptMsg: Actions.promptMsg,
      uploadAndInstallCert: Actions.uploadAndInstallCert,
      deleteCert: Actions.cb_delete_cert
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CertificateForm);
