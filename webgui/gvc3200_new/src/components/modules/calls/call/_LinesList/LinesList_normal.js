/**
 * 线路列表 包括本地
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button } from 'antd'

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

// 返回每条线路的按钮状态
function calLineBtnStatus(lineItem, acctstatus){
    let itemTitle = '' , //线路标题
        isvideoedclass = '',  // 暂停视频上传按钮类名
        suspendclass = '',     // 暂停视频接收按钮 状态
        confvideoclass = '',   // 开启或关闭视频
        blockclass = '',       // 禁声
        muteclass = '',        // 静音
        feccclass = '';        // 摄像头控制 FECC
    
    const { state, acct, enablefecc, feccstate, isvideoed, isvideo, isremotehold , issuspend, isblock, islinemute, msg}= lineItem;

    switch (state) {
        case '3':   // 呼叫中
        case 'init3':  // 呼叫中时 刷新浏览器
            itemTitle = tr("a_509"); 
            isvideoedclass = suspendclass =  confvideoclass = blockclass = muteclass = feccclass = 'display-hidden';
            break;

        case '4': // 通话中
        case '5': // 通话中 处于保持状态
            itemTitle = isvideo == '1' ? tr('a_669') : tr('a_668');
            isvideoedclass = isvideoed == '1' ? 'unuploading' : 'uploading' ;
            suspendclass = issuspend == '1' ?  'confsuspend' : 'unconfsuspend';
            confvideoclass = isvideo == '1' ? 'confvideo' : 'confaudio';
            blockclass = isblock == '1' ? 'confblock' : 'unconfblock';
            muteclass = islinemute == '1' ?  'mute': 'unmute';
            feccclass = (enablefecc != '1' && feccstate != '1') ? 'startFECC btndisable' : 'startFECC';

            // disable 状态
            if(isvideo != '1' || isremotehold == '1') {
                suspendclass += ' btndisable';
            }
            if(isremotehold == '1') {
                confvideoclass += ' btndisable';
                blockclass += ' btndisable';
                muteclass += ' btndisable'
            }
            if (acct != 1) {
                isvideoedclass += ' btndisable';
            }

            // title加类型
            if(acctstatus.length > 0 ){
                let account = acct == '8' ? '3' : acct
                itemTitle += `(${acctstatus[account]['name']})`;
            }
            break;
        case 'init8': // 呼叫时 刷新浏览器
        case '8':
            isvideoedclass = suspendclass =  confvideoclass = blockclass = muteclass = 'display-hidden';
            switch(msg) {
                case "3":
                    itemTitle = tr("a_539");
                    break;
                case "4":
                    itemTitle = tr("a_540");
                    break;
                case "5":
                    itemTitle = tr("a_541");
                    break;
                case "6":
                    itemTitle = tr("a_542");
                    break;
                case "7":
                    itemTitle = tr("a_543");
                    break;
                case "8":
                    itemTitle = tr("a_544");
                    break;
                case "9":
                    itemTitle = tr("a_545");
                    break;
                default:
                    itemTitle = tr("a_643");
                    break;
                
            }
            break;

    }
    // 再加一层判断- -!
    if (acct == 1) {
        suspendclass = 'unconfsuspend btndisable';
        confvideoclass = 'confvideo btndisable';
        blockclass = 'unconfblock btndisable';
        muteclass = 'unmute btndisable'
    }
    return {
        itemTitle, //线路标题
        isvideoedclass,  // 暂停视频上传按钮类名
        suspendclass,     // 暂停视频接收按钮 状态
        confvideoclass,   // 开启或关闭视频
        blockclass,       // 禁声
        muteclass,        // 静音
        feccclass       // 摄像头控制 FECC
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


let mClicktimes = 0;
let mPreClickTime, mCurrentClickTime, mTipTimeout;


class LinesList extends Component {

    ispause = () => {
        if(this.props.heldStatus == '1') {
            this.props.promptMsg("WARNING", "a_10126");
            return true;
        }
        return false;
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

    // 暂停或恢复视频上传
    handleuploading = (line, isvideoed) => {
        if(!this.countClickedTimes()) {
            return false;
        }
        if(this.ispause()){
            return false;
        }
        let flag = 1 ;
        if(isvideoed == "1"){
            flag = 0;
        }
        this.props.conflinevideoedstate(line,flag);
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

    // 挂断某个线路
    handleEndline = (line, account) =>{
        if(this.props.callFeatureInfo.disconfstate == "0"){
            //check the line if pause
            if(this.props.heldStatus == "1"){
                this.props.promptMsg("WARNING", tr("a_10126"));
                return;
            }
        }
        let flag = "0";
        if(account == 1 && this.props.ipvrole == "2"){
            flag = "1";
        }
        this.props.endlinecall(line, flag);
    }

    // 开关视频
    handlelinevideoswitch =(lineitem) =>{
        if(!this.countClickedTimes())
        {
            return false;
        }
        if(this.ispause()){
            return false;
        }
        let mode = "1"
        if(lineitem.isvideo == "1"){
            mode = "0";
        }
        this.props.ctrlvideostate(lineitem.line, mode);
    }
    // 禁声
    handlelineblock = (line) =>{
        if(!this.countClickedTimes())
        {
            return false;
        }
        if(this.ispause()){
            return false;
        }
        this.props.blockLineOrNot(line);
    }
    // 静音
    handlelinemute = (lineitem) =>{
        if(lineitem.islinemute == "1"){
            this.props.ctrlLineMute(lineitem.line, "0");
        }else {
            this.props.ctrlLineMute(lineitem.line, "1");
        }
    }
    // 本地线路摄像头
    handlelocalcamera = () =>{
        if(!this.countClickedTimes())
        {
            return false;
        }
        this.props.ctrlCameraBlockState();
    }


    handlelocalmute =(ismute) => {
        if(!this.countClickedTimes())
        {
            return false;
        }
        this.props.ctrlLocalMute(ismute == "1" ? "0" : "1");
    }
    render() {
        const { acctstatus, feccbtnvisile, linestatus, localcamerablocked, heldStatus } = this.props
        const { localmuteclass, localcamerablockedclass, startFECCClass, localbtndisabled, ismute } = calLocalBtnStatus(linestatus, localcamerablocked)
        const isHeld = heldStatus == '1'
        return (
            <div className="ctrl-line">
                {/* 全场会控 */}
                <div className="whole-control">
                    <div className="confname">全场会控</div>
                    <div className="confnum"></div>
                    <div className="conftype"></div>
                    <div className="confbtn">
                        <Button id="allSuspend" disabled={isHeld} title={"点击关闭所有画面"} className="confvideo" />
                        <Button id="allBlock" disabled={isHeld} title={"点击全部禁声"} className="unconfblock" />
                        <Button id="allMute" disabled={isHeld} title={tr("a_413")} className="unmute" />
                    </div>
                </div>
                <div className="local-line">
                    <div className="confname">{tr("a_10032")}</div>
                    <div className="confnum"></div>
                    <div className="conftype"></div>
                    <div className="confbtn">
                        {/* <Button id="startFECC" title={tr("a_19020")} disabled={localbtndisabled} style={{display: feccbtnvisile ? 'block' : 'none' }} className={startFECCClass} onClick={this.handleStartFECC.bind(this, "-1")}/> */}
                        <Button id="closecamera" title={tr("a_628")} disabled={isHeld || localbtndisabled}  className={localcamerablockedclass} onClick={this.handlelocalcamera}/>
                        <Button id="localmute" title={tr("a_413")} disabled={isHeld || localbtndisabled}  className={localmuteclass} onClick={this.handlelocalmute.bind(this, ismute)}/>
                    </div>
                </div>
                {
                linestatus.map((item, i) => {
                    let disabledflag = item.acct == 1 || item.isremotehold == "1";
                    let {itemTitle, isvideoedclass, suspendclass, confvideoclass, blockclass, muteclass, feccclass } = calLineBtnStatus(item, acctstatus)
                    return <div className={`remote-line remote-line-${i}`} key={i}>
                        <div className="confname">{item.name || item.num}</div>
                        <div className="confnum">{item.acct == 1 ? (item.name || item.num) : item.num}</div>
                        <div className="conftype">{itemTitle}</div>
                        <div className="confbtn">
                            {/* 结束通话 */}
                            <Button title={tr("a_1")} className="endconf" disabled={isHeld}
                                    onClick={this.handleEndline.bind(this, item.line, item.acct)}/>
                            {/* 本地摄像头控制 */}
                            {/* <Button className={feccclass} style={{display: feccbtnvisile ? 'block' : 'none' }}
                                    onClick={this.handleStartFECC.bind(this, item.line)}
                                    disabled={item.enablefecc != "1" && item.feccstate != "1"}/> */}
                            {/* 暂停视频上传 */}
                            <Button title={tr("a_19241")} className={isvideoedclass}
                                    disabled={!isHeld && item.acct == 1 ? false : true}
                                    onClick={this.handleuploading.bind(this, item.line, item.isvideoed)}/>
                            {/* 暂停视频接受 */}
                            <Button title={tr("a_16700")}
                                    disabled={isHeld || disabledflag || item.isvideo == "0" ? true : false}
                                    className={suspendclass}/>
                            {/* 关闭视频 */}
                            <Button title={tr("a_628")}
                                    disabled={isHeld || disabledflag ? true : false}
                                    className={confvideoclass}
                                    onClick={this.handlelinevideoswitch.bind(this, item)}
                            />
                            {/* 禁声 */}
                            <Button title={tr("a_16701")}
                                    disabled={isHeld || disabledflag ? true : false}
                                    className={blockclass}
                                    onClick={this.handlelineblock.bind(this, item.line)}
                            />
                            {/* 静音 */}
                            <Button title={item.islinemute == "1" ? tr("a_659") : tr("a_649")}
                                    disabled={isHeld || disabledflag ? true : false}
                                    className={muteclass}
                                    onClick={this.handlelinemute.bind(this, item)}/>
                        </div>
                    </div>})
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    callFeatureInfo: state.callFeatureInfo,
    heldStatus: state.heldStatus,
    ipvrole: state.ipvrole,
    localcamerablocked: state.localcamerablocked,

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
      endlinecall: Actions.endlinecall,
      promptMsg: Actions.promptMsg,
      gethdmi1state: Actions.gethdmi1state,
      getItemValues:Actions.getItemValues,
      isFECCEnable: Actions.isFECCEnable,
      ctrlFECC: Actions.ctrlFECC,
      conflinevideoedstate: Actions.conflinevideoedstate,
      ctrlvideostate: Actions.ctrlvideostate,
      blockLineOrNot: Actions.blockLineOrNot,
      ctrlLineMute: Actions.ctrlLineMute,
      ctrlCameraBlockState: Actions.ctrlCameraBlockState,
      ctrlLocalMute: Actions.ctrlLocalMute,
    }

    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LinesList))