import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance"
import { Layout } from "antd"
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout

class Speaker extends Component {
    constructor(props){
        super(props);
        this.state ={
            speakerMode: "off"
        };
    }
    
    componentDidMount = () => {
        this.props.getNvrams(new Array("speakertest"), (values) => {
            if (values.headers['speakertest'] == 1) {
                this.setState({
                    speakerMode: "on"
                })
            } else {
                this.setState({
                    speakerMode: "off"
                })
            }
        })
    }

    handleTest = () => {
        const { speakerTestStatus,speakerTest, promptSpinMsg, promptMsg } = this.props;
        promptSpinMsg('display-block', "a_9348");
        speakerTestStatus == 1 ?
            speakerTest("off", (result) => {
                if(result.res != "success"){
                    promptMsg('ERROR', "process_fail");
                }
                promptSpinMsg('display-hidden', "a_9348");
            }) : speakerTest("on", (result) => {
                if(result.res != "success"){
                    promptMsg('ERROR', "process_fail");
                }
                promptSpinMsg('display-hidden', "a_9348");
            })
    }

    render() {
        let speakerMode = this.state.speakerMode;
        const speakerTestStatus = this.props.speakerTestStatus;
        if(speakerTestStatus == 1){
            speakerMode = "on";
        }else if(speakerTestStatus == 0){
            speakerMode = "off";
        }
        return (
            <Content className="content-container">
                <div className="subpagetitle">{this.tr("a_18540")}</div>
                <div className="detect-area" style={{minHeight: this.props.mainHeight}}>
                    <div className="detect-speaker ab-center">
                        <p className="speakertip">{this.tr("speaker_tip")}</p>
                        <div className={`speaker-btn test-${speakerMode}`} onClick={this.handleTest}></div>
                    </div>
                </div>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    speakerTestStatus : state.speakerteststatus
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getNvrams: Actions.getNvrams,
      speakerTest: Actions.speakertest,
      promptSpinMsg:Actions.promptSpinMsg,
      promptMsg: Actions.promptMsg
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Speaker));