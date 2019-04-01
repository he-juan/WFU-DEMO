/**
 * 线路列表 包括本地
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button } from 'antd'
import FECCModal from './FECCModal'

function tr(text) {
    var tr_text = text;
    var language = $.cookie('MyLanguage') == null ? 'en' : $.cookie('MyLanguage');
    try {
        tr_text = window.eval(text+"_" + language);
    } catch (err) {
    } finally {
        return tr_text;
    }
}



// 本地线路的按钮状态
function calLocalBtnStatus(linestatus, localcamerablocked) {
    let ismute = linestatus[0] && linestatus[0].isLocalMuted == "1" ? "1" : "0";
    let localmuteclass = "unmute";
    let localcamerablockedclass = "confvideo";
    let startFECCClass = "startFECC";
    let localbtndisabled = false;

    const talkingLines = linestatus.filter(v => {
        let state = v.state
        return ( state == '3' || state == 'init3' || state == 'init8' || state == '8')
    })
    if(talkingLines.length == linestatus.length) {
        localmuteclass += " btndisable";
        startFECCClass += " btndisable";
        localcamerablockedclass += " btndisable";
        localbtndisabled = true;
    } else {
        localmuteclass = ismute == "1" ? "mute" : "unmute";
        if(localcamerablocked == "0"){
            localcamerablockedclass = "confvideo";
        }else{
            localcamerablockedclass = "confaudio";
        }
    }

    return {
        localmuteclass,
        localcamerablockedclass,
        startFECCClass,
        localbtndisabled,
        ismute
    }
}



class LinesList extends Component {


    // 摄像头控制相关
    handleStartFECC = (line) =>{
        if(!this.props.countClickedTimes()){
            return false;
        }
        this.props.gethdmi1state((result) => {
            if(result.state == "1"){  //HDMI 1 has connected
                let req_items = new Array;
                req_items.push(
                    this.getReqItem("hdmi2", "hdmi2", ""),
                    this.getReqItem("hdmi3", "hdmi3", "")
                );
                this.props.getItemValues(req_items, (values) => {
                    let hdmi2state = values["hdmi2"];
                    let hdmi3state = values["hdmi3"];
                    let hdmi23state = 0;
                    if(hdmi3state == "1" && hdmi2state == "1")
                        hdmi23state = 4;
                    else if(hdmi3state != "1" && hdmi2state == "1")
                        hdmi23state = 5;
                    else if(hdmi3state != "1" && hdmi2state != "1")
                        hdmi23state = 6;

                    if(hdmi23state == 4 || hdmi23state == 5 || hdmi23state == 6)
                    {
                        /**
                         open FECC
                         1. HDMI1
                         2. HDMI1, HDMI2
                         3. HDMI1, HDMI2, HDMI3
                         **/
                        this.props.isFECCEnable(line, (result) => {
                            if (result.res.toLowerCase() == "success" && result.flag == "true") {
                                //start FECC
                                this.props.ctrlFECC(line, 1, (result) =>{
                                    if(result.res == "success" || result == 0 ){
                                    }else{
                                        this.props.promptMsg("WARNING", tr("a_63"));
                                    }
                                });
                            } else {
                                //not enable FECC
                                this.props.promptMsg("WARNING", tr("a_63"));
                            }

                        });
                    }
                    else
                    {
                        this.props.promptMsg("WARNING", tr("a_16707") + " " + tr("a_63"));
                    }
                })
            }else{
                this.props.promptMsg("WARNING", tr("a_16707") + " " + tr("a_63"));
            }
        });
    }

    render() {
        const { feccbtnvisile, linestatus } = this.props

        
        return (
            <span>
              <Button id="startFECC" title={tr("a_19020")} disabled={!feccbtnvisile} className={'startFECC'} onClick={this.handleStartFECC.bind(this, "-1")}/>
              <FECCModal />
            </span>
        )
    }
}


const mapStateToProps = (state) => ({
    localcamerablocked: state.localcamerablocked,

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
      promptMsg: Actions.promptMsg,
      gethdmi1state: Actions.gethdmi1state,
      getItemValues:Actions.getItemValues,
      isFECCEnable: Actions.isFECCEnable,
      ctrlFECC: Actions.ctrlFECC,
    }

    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LinesList))