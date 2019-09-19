// 摄像头控制弹窗

import React, {Component} from 'react'
import Enhance from "../../../../mixins/Enhance";
import * as Actions from '../../../../redux/actions/index';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Modal} from "antd"

let mPressTimer = "";
let mSaveingPreset = false;

class FECCModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            directionitem: "normal",
            mPressedDown:false,
            presetbtndisplay:"display-hidden",
            curPresetbtnindex: 0
        }
    }

    showpresetbtn = (index) =>{
        var top = parseInt(index / 4) * 59 + 29;
        var left = index % 4 * 103 - 14;
        $("#presetbtndiv").css("top", top).css("left", left).fadeIn(500);
        this.setState({curPresetbtnindex: index});
    }

    hidepresetbtn = () => {
        $("#presetbtndiv").fadeOut(500);
    }

    gotopreset =()=>{
        let presetIndex = this.state.curPresetbtnindex;
        let line = this.props.FECCStatus.line;
        this.props.gotoFECCpreset(line, presetIndex);
    }

    savepreset = () =>{
        if( mSaveingPreset ){
            this.props.promptMsg("WARNING", "a_552");
            return false;
        }
        mSaveingPreset = true;
        let presetIndex = this.state.curPresetbtnindex;
        let line = this.props.FECCStatus.line;
        this.props.saveFECCpreset(line, presetIndex);
        setTimeout(function(){
                mSaveingPreset = false;
                },2000);
    }

    handleDirection = (action, keycode) =>{
        let counttimes = 0;
        this.props.setKeyCode(0, keycode, 0);
        if(action == 1){
            clearInterval(mPressTimer);
            this.props.setKeyCode(action, keycode, 0);
        }else{
            mPressTimer = setInterval(() => {this.props.setKeyCode(action, keycode, ++counttimes);}, 200);
        }
    }

    changeBackgroud = (direction) => {
        let direc = direction + "hover";
        this.setState({
            directionitem: direc
        });
    }

    resetBackground = (keycode) =>{
        this.setState({
            directionitem: "normal"
        });
        clearInterval(mPressTimer);
        this.props.setKeyCode(1, keycode, 0);
    }

    handleCancel = () =>{
        let line = this.props.FECCStatus.line;
        this.props.ctrlFECC(line, 0, (result) =>{
            if(result.res == "success" || result == 0 ){
            }else{
                this.props.promptMsg("WARNING", this.tr("a_63"));
            }
        });
    }

    hanleKeycode = (keycode) => {
        let _this = this;
        this.props.setKeyCode(0, keycode, 0);
        mPressTimer = setInterval(() => this.props.setKeyCode(0, keycode, 0), 200)

        function docMouseUp(){
            clearInterval(mPressTimer)
            document.removeEventListener('mouseup', docMouseUp ,false)
            docMouseUp = null
            _this.props.setKeyCode(1, keycode, 0);
        }
        document.addEventListener('mouseup',docMouseUp ,false)
    }

    render() {
        let tr = this.tr;
        let title = tr("a_10026") + "   " + tr("a_10032");
        var presetArray = (new Array(24)).fill(0);


        let feccInfo = this.props.FECCStatus;
        if(!feccInfo) return null;
        let feccdisplay = feccInfo.status == "1" ? true : false
        return (
            <Modal className="fecc-modal" title={title} keyboard="false" maskClosable="false" footer={null}
                   visible={feccdisplay} onCancel={this.handleCancel}>
                <div className="fecc-modal-content">
                    <div className="feccleft">
                        <div>{tr("a_10024")}</div>
                        <div className="presetdiv" onMouseLeave={this.hidepresetbtn}>
                            <div id="presetbtndiv">
                                <div id="gotopreset" className="presetbtn" onClick={this.gotopreset}>{tr("a_19174")}</div>
                                <div id="savepreset" className="presetbtn" onClick={this.savepreset}>{tr("a_17")}</div>
                            </div>
                            {
                                presetArray.map((item, i) => {
                                    let topitemclass="";
                                    if( i < 4 ){
                                        topitemclass = "topitem";
                                    }
                                    return <div key={i} className={topitemclass + " presetitem"} onMouseEnter={this.showpresetbtn.bind(this, i)}>
                                        <span className="presetnumitem">{i + 1}</span>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="ctrldiv">
                        <div className={"direction " + this.state.directionitem}>
                            <div className="up ptzctrl" onMouseEnter={this.changeBackgroud.bind(this,'up')} onMouseLeave={this.resetBackground.bind(this,"19")}
                                 onMouseDown={this.handleDirection.bind(this,0, "19")} onMouseUp={this.handleDirection.bind(this, 1, "19")}></div>
                            <div className="right ptzctrl" onMouseEnter={this.changeBackgroud.bind(this,'right')} onMouseLeave={this.resetBackground.bind(this, "22")}
                                 onMouseDown={this.handleDirection.bind(this, 0, "22")} onMouseUp={this.handleDirection.bind(this, 1, "22")}></div>
                            <div className="down ptzctrl" onMouseEnter={this.changeBackgroud.bind(this,'down')} onMouseLeave={this.resetBackground.bind(this, "20")}
                                 onMouseDown={this.handleDirection.bind(this, 0, "20")} onMouseUp={this.handleDirection.bind(this, 1, "20")}></div>
                            <div className="left ptzctrl" onMouseEnter={this.changeBackgroud.bind(this,'left')} onMouseLeave={this.resetBackground.bind(this, "21")}
                                 onMouseDown={this.handleDirection.bind(this, 0, "21")} onMouseUp={this.handleDirection.bind(this, 1, "21")}></div>
                        </div>
                        <div className="zoomopt">
                            <div className="enlarge">
                                <span onMouseDown={this.hanleKeycode.bind(this,'168')}></span>
                            </div>
                            <div className="reduce">
                                <span onMouseDown={this.hanleKeycode.bind(this,'169')}></span>
                            </div>
                        </div>
                    </div>

                </div>
            </Modal>
        )
    }

}

const mapStateToProps = (state) => ({
  FECCStatus: state.FECCStatus,

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        setKeyCode: Actions.setKeyCode,
        gotoFECCpreset: Actions.gotoFECCpreset,
        saveFECCpreset: Actions.saveFECCpreset,
        promptMsg: Actions.promptMsg,
        ctrlFECC: Actions.ctrlFECC
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(FECCModal))
