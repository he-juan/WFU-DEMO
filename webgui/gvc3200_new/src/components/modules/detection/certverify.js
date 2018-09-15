import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance"
import { Layout } from "antd"
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout

class CertVerify extends Component {
    constructor(props){
        super(props);
        this.state = {
            validtype: -1  // 0-failed  1-success
        }
    }

    componentDidMount = () => {
        this.props.promptSpinMsg('display-block', "a_9348");
        this.props.diagnosePem((data) => {
            this.props.promptSpinMsg('display-hidden', "a_9348");
            if (data.response == "true") {
                this.setState({validtype: 1});
            } else {
                this.setState({validtype: 0});
            }
        });
    }

    render(){
        let validResult = "";
        if(this.state.validtype == 1){
            validResult = "valid_suc";
        }else if(this.state.validtype == 0){
            validResult = "valid_fail";
        }
        return (
            <Content className="content-container">
                <div className="subpagetitle">{this.tr("cert_check")}</div>
                <div className="detect-area" style={{'min-height':this.props.mainHeight}}>
                    <div className="ab-center detect-cert">
                        <div className={`cert-pic pic-${this.state.validtype}`}></div>
                        <p>{this.tr(validResult)}</p>
                    </div>
                </div>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
})

function mapDispatchToProps(dispatch) {
  var actions = {
      diagnosePem: Actions.diagnosePem,
      promptSpinMsg: Actions.promptSpinMsg,
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(CertVerify));
