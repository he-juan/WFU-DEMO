/**
 * 线路列表 包括本地
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button } from 'antd'
import './LineList_sfu.css'

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
function calLocalBtnStatus(linestatus, localcamerastate) {
    let ismute = linestatus[0] && linestatus[0].isLocalMuted == "1" ? "1" : "0";
    let localmuteclass = "unmute";
    let localcamerastateclass = "confvideo";
    let startFECCClass = "startFECC";
    let localbtndisabled = false;

    const talkingLines = linestatus.filter(v => {
        let state = v.state
        return ( state == '3' || state == 'init3' || state == 'init8' || state == '8')
    })
    if(talkingLines.length == linestatus.length) {
        localmuteclass += " btndisable";
        startFECCClass += " btndisable";
        localcamerastateclass += " btndisable";
        localbtndisabled = true;
    } else {
        localmuteclass = ismute == "1" ? "mute" : "unmute";
        if(localcamerastate == "0"){
            localcamerastateclass = "confvideo";
        }else{
            localcamerastateclass = "confaudio";
        }
    }

    return {
        localmuteclass,
        localcamerastateclass,
        startFECCClass,
        localbtndisabled,
        ismute
    }
}


let mClicktimes = 0;
let mPreClickTime, mCurrentClickTime;


class LinesList extends Component {
    constructor() {
      super()
      this.state = {
        sfu_lock: null
      }
    }

    // 防止快速点击
    countClickedTimes = ()=>{
        if(mClicktimes == 0){
            mPreClickTime = new Date().getTime();
            mClicktimes ++;
            return true;
        }
        mCurrentClickTime = new Date().getTime();
        if((mCurrentClickTime - mPreClickTime) < 1000) {
            this.props.promptMsg("WARNING","a_552");
            mPreClickTime = mCurrentClickTime;
            return false;
        }
        mClicktimes ++ ;
        mPreClickTime = mCurrentClickTime;
        return true;
    }


    // 摄像头控制相关
    handleStartFECC = (line) =>{
        if(!this.countClickedTimes()){
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

    // 静音
    handlelinemute = (lineitem) =>{
        $.get('/manager?action=ctrllinemute&region=confctrl&line=' + lineitem.line + '&setmute=' + (lineitem.islinemute == '1' ? "0" : "1"))
    }
    // 本地线路摄像头
    handlelocalcamera = () =>{
        if(!this.countClickedTimes())
        {
            return false;
        }
        // this.props.ctrlCameraBlockState();
    }


    handlelocalmute =(ismute) => {
        if(!this.countClickedTimes())
        {
            return false;
        }
        $.get('/manager?action=ctrllocalmute&region=confctrl&setmute=' + (ismute == "1" ? "0" : "1"))
    }
    componentDidMount() {
      this.props.getsfuconfinfo()
    }
    // 锁定/解锁会议
    handleSfuLock(isLocked) {
      if(!this.countClickedTimes())
      {
          return false;
      }
      let islock = isLocked == '0' ? 1 : 0
      this.props.locksfuconf(islock)
    }
    // 全场静音
    handleSfuMuteAll() {
      if(!this.countClickedTimes())
      {
          return false;
      }
      this.props.mutesfuallaudio(1)
    }
    // 解除全场静音
    handleSfuUnMuteAll() {
      if(!this.countClickedTimes())
      {
          return false;
      }
      this.props.mutesfuallaudio(0)
    }
    // 踢出成员
    handleSfuKickMember(number) {
      if(!this.countClickedTimes())
      {
          return false;
      }
      this.props.kicksfumember(number)
    }
    handleSfuTranhost(number) {
      if(!this.countClickedTimes())
      {
          return false;
      }
      this.props.transfersfuhost(number)
    }
    handleSfuMuteMember(ismuted, number) {
      if(!this.countClickedTimes())
      {
          return false;
      }
      ismuted = ismuted == '1' ? '0' : '1'
      this.props.mutesfumemberaudio(ismuted, number)
    }
    render() {
        const { sfu_lock } = this.state
        const { acctstatus, feccbtnvisile, linestatus, localcamerastate, sfu_meetinginfo, msfurole } = this.props
        const { localmuteclass, localcamerastateclass, startFECCClass, localbtndisabled, ismute } = calLocalBtnStatus(linestatus, localcamerastate)
        if(!sfu_meetinginfo || linestatus.length == 0 || acctstatus.length == 0) {
          return <div className="ctrl-line"></div>
        }
        let {hostUser, isLocked, memberInfoList} = sfu_meetinginfo
        isLocked = sfu_lock != null ? sfu_lock : isLocked
        return (
            <div className="ctrl-line sfu-confline">
                <div className="local-line">
                    <div className="confname">{tr("a_10032")}</div>
                    <div className="confnum"></div>
                    <div className="conftype"></div>
                    <div className="confbtn">
                        {/* <Button id="startFECC" title={tr("a_19020")} disabled={localbtndisabled} style={{display: feccbtnvisile ? 'block' : 'none' }} className={startFECCClass} onClick={this.handleStartFECC.bind(this, "-1")}/> */}
                        <Button id="closecamera" title={tr("a_628")} disabled={localbtndisabled}  className={localcamerastateclass} onClick={this.handlelocalcamera}/>
                        <Button id="localmute" title={tr("a_413")} disabled={localbtndisabled}  className={localmuteclass} onClick={this.handlelocalmute.bind(this, ismute)}/>
                    </div>
                </div>
                {
                  msfurole != 2 ? null : 
                  <div>

                    <div className={`remote-line remote-line-0`}>
                      <div className="confname">{linestatus[0].name || linestatus[0].num}</div>
                      <div className="confnum">{linestatus[0].acct == 1 ? (linestatus[0].name || linestatus[0].num) : linestatus[0].num}</div>
                      <div className="conftype">{linestatus[0].isVideo == '1' ? tr('a_669') : tr('a_668')}{`(${acctstatus[0]['name']})`}</div>
                      <div className="confbtn">
                        {/* 取消全场静音 */}
                        <Button title={tr("a_10296")} className="sfu_unmute" onClick={this.handleSfuUnMuteAll.bind(this)}/>
                        {/* 全场静音 */}
                        <Button title={tr("a_10295")} className="sfu_mute" onClick={this.handleSfuMuteAll.bind(this)}/>
                        {/* 锁定会议 */}
                        <Button title={isLocked == '1' ? tr("a_10347") : tr("a_10346")} className={isLocked == '1' ? 'sfu_locked': 'sfu_lock'} onClick={this.handleSfuLock.bind(this, isLocked)}/>
                      </div>
                    </div>
                    <div className={`remote-line`}>
                      <div className="confname">{tr('a_10271')}</div>
                    </div>
                    {
                      memberInfoList.map((item, i) => {
                        if(item.role == '2') return null
                        return <div className={`remote-line remote-line-${i}`} key={i}>
                            <div className="confname">{item.name || item.number}</div>
                            <div className="confnum">{item.number}</div>
                            <div className="conftype"></div>
                            <div className="confbtn">
                              {/* 踢出 */}
                              <Button title={tr("a_10304")} className="sfu_kick" onClick={this.handleSfuKickMember.bind(this, item.number)}/>
                              {/* 授予主持人 */}
                              <Button title={tr("a_10368")} className="sfu_tranhost" onClick={this.handleSfuTranhost.bind(this, item.number)}/>
                              {/* 静音成员 */}
                              <Button title={item.isMuted =='1' ? tr("a_659") : tr("a_18")} className={item.isMuted == '1' ? 'sfu_mute' : 'sfu_unmute'} onClick={this.handleSfuMuteMember.bind(this, item.isMuted, item.number)}/>
                            </div>
                        </div>})
                      }
                  </div>
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    callFeatureInfo: state.callFeatureInfo,
    ipvrole: state.ipvrole,
    localcamerastate: state.globalConfInfo.localcamerastate,
    sfu_meetinginfo: state.sfu_meetinginfo,
    msfurole: state.msfurole
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
      promptMsg: Actions.promptMsg,
      gethdmi1state: Actions.gethdmi1state,
      getItemValues:Actions.getItemValues,
      isFECCEnable: Actions.isFECCEnable,
      ctrlFECC: Actions.ctrlFECC,

      //sfu
      getsfuconfinfo: Actions.getsfuconfinfo,
      locksfuconf: Actions.locksfuconf,
      mutesfuallaudio: Actions.mutesfuallaudio,
      kicksfumember: Actions.kicksfumember,
      transfersfuhost: Actions.transfersfuhost,
      mutesfumemberaudio: Actions.mutesfumemberaudio
    }

    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LinesList))