import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance"
import { Layout, Button, Modal } from "antd"
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout

class Reset extends Component {
    constructor(props){
        super(props);
        this.state = {
            resetkeytestmode: "off",
            displayConfirmModal: false
        }
    }

    componentDidMount = () => {
        this.props.getNvrams(new Array("resetkeytest"), (values) => {
            if(values.headers['resetkeytest'] == 1){
                this.setState({
                    resetkeytestmode: "on"
                });
            }else{
                this.setState({
                    resetkeytestmode: "off"
                });
            }
        })
    }

    componentWillReceiveProps = (nextProps) => {
        let self = this;
        if (nextProps.resetkeyteststatus != this.props.resetkeyteststatus) {
            if (nextProps.resetkeyteststatus == 2) {
                self.setState({
                    resetkeytestmode: "off"
                });
            }
        }
    }

    showConfirmModal = () => {
        this.setState({displayConfirmModal: true});
    }

    handleConfirmCancel =() =>{
        this.setState({displayConfirmModal: false});
    }

    startResetkeyTest = () => {
        let self = this;
        this.setState({displayConfirmModal: false});
        this.props.resetkeytest("on", (result) => {
            if (result.res == "success") {
                self.setState({
                    resetkeytestmode: "on"
                });
                self.props.setResetKeyTestStatus(-1);
            }
        });
    }

    stopResetkeyTest = () => {
        let self = this;
        this.props.resetkeytest("off", (result) => {
            if (result.res == "success") {
                self.setState({
                    resetkeytestmode: "off"
                });
            }
        });
    }

    render(){
        let resetkeytestmode = this.state.resetkeytestmode;
        let pressstatusStr = this.tr("reset_unpressed");
        if(resetkeytestmode == "on"){
            let resetkeystatus = this.props.resetkeyteststatus;
            if(resetkeystatus == 0){
                pressstatusStr = this.tr("reset_longpress");
            }else if(resetkeystatus == 1){
                pressstatusStr = this.tr("reset_shortpress");
            }else if(resetkeystatus == 2){
                resetkeytestmode = "off";
            }
        }
        let resettestcontent = "";
        let tipDisplay = "display-hidden"
        if(resetkeytestmode == "on"){
            resettestcontent = this.tr("a_resetkeystatus") + pressstatusStr;
            tipDisplay = "display-block";
        }

        return (
            <Content className="content-container">
                <div className="subpagetitle">{this.tr("reset_test")}</div>
                <div className="detect-area" style={{'min-height':this.props.mainHeight, paddingTop: "0px"}}>
                    <div className="resetkeytest-tip">
                        <div className={`${tipDisplay} tip-content`}>
                            {this.tr("tip_resetkeytest")}
                        </div>
                    </div>
                    <div className="detect-reset ab-center">
                        <p className="resettip">{resetkeytestmode == "on" ? this.tr("reset_testip") : ""}</p>
                        <div className="reset-pic">
                            <div className="tip-dot-line"></div>
                            <div className="reset-text">{this.tr("a_16348")}</div>
                        </div>
                        <div className="reset-btn">
                            <p>{resettestcontent}</p>
                            <Button onClick={resetkeytestmode == "on" ? this.stopResetkeyTest : this.showConfirmModal} style={{top:"50px"}}>
                                {resetkeytestmode == "on" ? this.tr("a_stoptest") : this.tr("a_starttest")}
                            </Button>
                        </div>
                        <Modal visible={this.state.displayConfirmModal} title={this.tr("a_starttest")} className="confirm-modal" style={{marginTop:"200px"}}
                               okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.startResetkeyTest} onCancel={this.handleConfirmCancel}>
                            <p className="confirm-content">{this.tr("tip_resetkeytest")}</p>
                        </Modal>
                    </div>
                </div>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    resetkeyteststatus : state.resetkeyteststatus
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getNvrams: Actions.getNvrams,
      resetkeytest: Actions.resetkeytest,
      setResetKeyTestStatus: Actions.setResetKeyTestStatus
  }

  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Reset));