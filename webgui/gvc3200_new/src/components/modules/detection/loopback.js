import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance"
import { Layout, Button, Modal } from "antd"
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const micTipArray =["mic1looptesting", "mic2looptesting", "mic3looptesting"];

class Loopback extends Component {
    constructor(props){
        super(props);
        this.state = {
            startMicTestVisible: "display-block",
            stopMicTestVisible: "display-hidden",
            audiolooptip: "",
            micdisabled: false,
            displayConfirmModal: false,
            mictesttype: ""
        }
    }

    componentDidMount = () => {
        this.props.getNvrams(new Array("audiolooptest"), (values) => {
            if(values.headers['audiolooptest'] == 1){
                this.setState({
                    startMicTestVisible: "display-hidden",
                    stopMicTestVisible:"display-block",
                    audiolooptip: "audio_looptip"
                })
            }else{
                this.setState ({
                    startMicTestVisible: "display-block",
                    stopMicTestVisible:"display-hidden",
                    audiolooptip: ""
                })
            }
        })
    }

    showConfirmModal = () => {
        this.setState({displayConfirmModal: true});
    }

    handleConfirmCancel =() =>{
        this.setState({displayConfirmModal: false});
    }

    micPhoneTest = (micIndex) => {
        let self = this;
        self.setState({
            audiolooptip: micTipArray[micIndex],
            micdisabled: true,
            mictesttype: micIndex+1
        });
        this.props.audioloopTest("play", micIndex, () => {
            setTimeout(function () {
                self.setState({
                    audiolooptip: "audio_looptip",
                    micdisabled: false,
                    mictesttype: ""
                });
            }, 2000);
        });
    }

    micStopTest =() => {
        this.props.audioloopTest("off", -1, (result) => {
            if(result.res == "success") {
                this.setState({
                    startMicTestVisible: "display-block",
                    stopMicTestVisible: "display-hidden",
                    audiolooptip: "",
                    mictesttype: ""
                })
            }
        });
    }

    micStartTest =()=>{
        let self = this;
        const { audioloopTest, promptSpinMsg, promptMsg } = self.props;
        this.setState({
            displayConfirmModal: false
        });
        promptSpinMsg('display-block', "a_sound_collection");
        audioloopTest("on", -1, (result) =>{
            if(result.res == "success"){
                self.setState({
                    startMicTestVisible: "display-hidden",
                    stopMicTestVisible:"display-block",
                    audiolooptip: "audio_looptip"
                })
            }else{
                promptMsg('ERROR', "collection_fail");
            }
            promptSpinMsg('display-hidden', "a_sound_collection");
        });
    }

    render(){
        return (
            <Content className="content-container" >
                <div className="subpagetitle">{this.tr("audio_loopback")}</div>
                <div className="detect-area" style={{minHeight:this.props.mainHeight, paddingTop: "0px"}}>
                    <div className="startaudioloop-tip">
                        <div className={`${this.state.stopMicTestVisible} tip-content`}>
                            {this.tr("tip_audioloopstart")}
                        </div>
                    </div>
                    <div className="ab-center detect-loop">
                        <p className="audiolooptip">{this.tr(this.state.audiolooptip)}</p>
                        <div className="audioloop-pic">
                            <div className="mic1"><div>MIC1</div><div className="tip-dot-line1"></div></div>
                            <div className="mic2-3" style={{textAlign: "left", left:"-50px"}}><div>MIC2</div><div className="tip-dot-line2-3" style={{left:"42px"}}></div></div>
                            <div className="mic2-3" style={{textAlign: "right", right:"-50px"}}><div>MIC3</div><div className="tip-dot-line2-3"></div></div>
                            <div className={`mic-light-type${this.state.mictesttype}`}></div>
                        </div>
                        <div className={`mic-btn ${this.state.startMicTestVisible}`}>
                            <Button onClick={this.showConfirmModal}>{this.tr("a_starttest")}</Button>
                        </div>
                        <Modal visible={this.state.displayConfirmModal} title={this.tr("a_starttest")} className="confirm-modal" style={{marginTop:"200px"}}
                               okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.micStartTest} onCancel={this.handleConfirmCancel}>
                            <p className="confirm-content">{this.tr("tip_audioloopstart")}</p>
                        </Modal>
                        <div className={`mic-btn ${this.state.stopMicTestVisible}`}>
                            {
                                [...Array(3)].map((btn, i) => {
                                    return(
                                        <Button onClick={this.micPhoneTest.bind(this, i)}disabled={this.state.micdisabled}>
                                            <span className="micro-icon"></span>
                                            {this.tr("micro_phone") + (i+1) + " " + this.tr("a_4370")}
                                        </Button>
                                    )
                                })
                            }
                            <Button onClick={this.micStopTest} disabled={this.state.micdisabled} style={{width: "110px",marginLeft: "20px"}}>{this.tr("a_stoptest")}</Button>
                        </div>
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
      getNvrams: Actions.getNvrams,
      audioloopTest: Actions.audioloopTest,
      promptSpinMsg: Actions.promptSpinMsg,
      promptMsg: Actions.promptMsg
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Loopback));
