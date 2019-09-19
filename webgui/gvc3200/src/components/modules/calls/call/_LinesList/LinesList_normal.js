/**
 * 线路列表 包括本地
 */
import React, { Component } from 'react'
import Enhance from "../../../../mixins/Enhance"
import * as Actions from '../../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, message } from 'antd'

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
        feccclass = '',        // 摄像头控制 FECC
        recallclass = 'display-hidden';
    
    const { state, acct, enablefecc, feccstate, isvideoed, isvideo, isremotehold , issuspend, isblock, islinemute, msg}= lineItem;

    switch (String(state)) {
        case '3':   // 呼叫中
        case 'init3':  // 呼叫中时 刷新浏览器
            itemTitle = tr("a_509"); 
            isvideoedclass = suspendclass =  confvideoclass = blockclass = muteclass = feccclass = 'display-hidden';
            break;

        case '4': // 通话中
        case '5': // 通话中 处于保持状态
            itemTitle = isvideo == '1' ? tr('a_669') : tr('a_668');
            isvideoedclass = isvideoed == '1' ? 'unuploading' : 'uploading' ;
            suspendclass = isvideo == '0' ? 'unsuspend' : issuspend == '1' ?  'suspend' : 'unsuspend';
            confvideoclass = isvideo == '1' ? 'confvideo' : 'confaudio';
            blockclass = isblock == '1' ? 'confblock' : 'unconfblock';
            muteclass = islinemute == '1' ?  'mute': 'unmute';
            feccclass = (enablefecc != '1' && feccstate != '1') ? 'startFECC btndisable' : 'startFECC';

           
            break;
        case 'init8': // 呼叫时 刷新浏览器
        case '8':
            isvideoedclass = suspendclass =  confvideoclass = blockclass = muteclass = 'display-hidden';
            recallclass = 'confrecall';
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
        suspendclass = 'unsuspend';
        confvideoclass = 'confvideo';
        blockclass = 'unconfblock';
        muteclass = 'unmute'
    }
    return {
        itemTitle, //线路标题
        isvideoedclass,  // 暂停视频上传按钮类名
        suspendclass,     // 暂停视频接收按钮 状态
        confvideoclass,   // 开启或关闭视频
        blockclass,       // 禁声
        muteclass,        // 静音
        feccclass,       // 摄像头控制 FECC
        recallclass
    }
}

// 本地线路的按钮状态
function calLocalBtnStatus(globalConfInfo) {
    
    return {
        localmuteclass: globalConfInfo.localmutestate == '1' ? 'mute' : 'unmute',
        localcamerastateclass : globalConfInfo.localcamerastate == '1' ? 'cameraclose' : 'cameraopen',
        ismute: parseInt(globalConfInfo.localmutestate),
        localcamerastate: parseInt(globalConfInfo.localcamerastate)
    }
}


let mClicktimes = 0;
let mPreClickTime, mCurrentClickTime, mTipTimeout;


class LinesList extends Component {

    ispause = () => {
        if(this.props.isOnHold == '1') {
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

    suspendLineOrNot = (item) => {
        if(!this.countClickedTimes()) {
            return false;
        }
        if(this.ispause()){
            return false;
        }
        
        $.get('/manager?action=ctrllinevideo&line='+item.line+'&state='+ (item.issuspend == '1' ? '0' : '1'))
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
    handleEndline = (item) =>{
        if(this.props.callFeatureInfo.disconfstate == "0"){
            //check the line if pause
            if(this.props.isOnHold == "1"){
                this.props.promptMsg("WARNING", tr("a_10126"));
                return;
            }
        }
        let flag = "0";
        if(item.acct == 1 && this.props.ipvrole == "2"){
            flag = "1";
        }
        // this.props.endlinecall(line, flag);
        $.get('/manager?action=endcall&line='+ item.line)
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
        $.get('/manager?action=ctrlvideostate&region=confctrl&isflag='+ mode + '&line=' + lineitem.line)
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
        $.get('/manager?action=ctrllineblock&region=confctrl&line=' + line)
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
        
        $.get('/manager?action=ctrllocalvideo')
    }


    handlelocalmute =(ismute) => {
        if(!this.countClickedTimes())
        {
            return false;
        }
        $.get('/manager?action=ctrllocalmute&region=confctrl&setmute=' + (ismute == "1" ? "0" : "1"))
    }

    // 全场静音
    toggleAllMute = () => {
        if(!this.countClickedTimes())
        {
            return false;
        }
        $.get('/manager?action=ctrlconfmute')
    }
    // 全场禁声
    toggleAllBlock = () => {
        if(!this.countClickedTimes())
        {
            return false;
        }
        $.get('/manager?action=ctrlconfblock')
    }
    // 全场关闭摄像头
    toggleAllSuspend = (isAllSuspend) => {
        if(!this.countClickedTimes())
        {
            return false;
        }
        $.get('/manager?action=ctrlconfvideo&state=' + (isAllSuspend ? 0 : 1))
    }
    // 回拨
    handleReCall = (item) => {
        
        const { line } = item
        $.get(`/manager?action=redialline&line=${line}`)
    }
    componentWillReceiveProps (nextProps) {
        if(nextProps.isAllMute != this.props.isAllMute && this.props.isAllMute != undefined) {
            if(nextProps.isAllMute == '1') {
                this.props.promptMsg("SUCCESS", this.tr('a_10292'));
            } else {
                this.props.promptMsg("SUCCESS", this.tr('a_10293'));
            }
        }
    }
    render() {
        const { acctstatus, feccbtnvisile, linestatus, globalConfInfo, isOnHold, isAllMute, isAllBlock } = this.props
        const { localmuteclass, localcamerastateclass, ismute, localcamerastate } = calLocalBtnStatus(globalConfInfo)
        const isHeld = isOnHold == '1'
        // 接口的isAllSuspend 有问题, 这里自行计算
        const isAllSuspend = linestatus.filter(item => {
            return item.state != '8' && item.isvideo == '1' && item.issuspend == '0'
        }).length == 0

        const isAllAudio = linestatus.filter(item => {
            return item.state != 8 && item.isvideo == '1'
        }).length == 0


        return (
            <div className="ctrl-line">
                {/* 全场会控 */}
                <div className="whole-control">
                    <span className="confname">{this.tr('a_23565')}</span>
                    <span className="confnum"></span>
                    <span className="conftype"></span>
                    <span className="confbtn">
                        <Button id="allSuspend" disabled={isHeld || isAllAudio} title={isAllSuspend ? this.tr('a_23562') : this.tr('a_23561')} onClick={ () => this.toggleAllSuspend(isAllSuspend)}  className={isAllAudio ?'unsuspend' : isAllSuspend ? "suspend" : "unsuspend"} />
                        <Button id="allBlock" disabled={isHeld} title={isAllBlock ? this.tr('a_23560'): this.tr('a_23559')} onClick={this.toggleAllBlock} className={ isAllBlock ? "confblock" : "unconfblock"} />
                        <Button id="allMute" disabled={isHeld} title={isAllMute ? this.tr('a_23564'): this.tr('a_23563')} onClick={this.toggleAllMute} className={ isAllMute ? "mute" : "unmute"} />
                    </span>
                </div>
                {/* 本地线路 */}
                <div className="local-line">
                    <span className="confname">{tr("a_10032")}</span>
                    <span className="confnum"></span>
                    <span className="conftype"></span>
                    <span className="confbtn">
                        {/* ipvt 共享摄像头, 设备暂未支持ipvt */}
                        <Button id='ipvtSharecamera' disabled={true} title={''} onClick={() => {}} className={true ? 'unsharecamera': 'sharecamera'} />
                        <Button id="closeCamera" title={localcamerastate ? this.tr('a_23569') : this.tr('a_23568') } disabled={isHeld}  className={localcamerastateclass} onClick={this.handlelocalcamera}/>
                        <Button id="localMute" title={ismute ? this.tr('a_23567') : this.tr('a_23566')} disabled={isHeld}  className={localmuteclass} onClick={this.handlelocalmute.bind(this, ismute)}/>
                    </span>
                </div>
                {/* 成员线路 */}
                {
                linestatus.map((item, i) => {
                    let disabledflag = item.acct == 1 || item.isremotehold == "1";
                    let {itemTitle, isvideoedclass, suspendclass, confvideoclass, blockclass, muteclass, feccclass, recallclass } = calLineBtnStatus(item, acctstatus)
                    return <div className={`remote-line remote-line-${i}`} key={i}>
                        <span className="confname">{item.name || item.num}</span>
                        <span className="confnum">{item.acct == 1 ? (item.name || item.num) : item.num}</span>
                        <span className={`conftype ${item.state == '8' ? 'call-fail' : item.state == ('3' || 'init3') ? 'call-ing' : ''}`}>{itemTitle}</span>
                        <span className="confbtn">
                            {/* 结束通话 */}
                            <Button title={this.tr('a_1')} className="endconf" disabled={isHeld}
                                    onClick={this.handleEndline.bind(this, item)}/>
                            {/* 通话失败回拨 */}
                            <Button title={this.tr('a_23570')} className={recallclass} disabled={isHeld}
                                    onClick={this.handleReCall.bind(this, item)}/>
                            {/* 本地摄像头控制 */}
                            {/* <Button className={feccclass} style={{display: feccbtnvisile ? 'block' : 'none' }}
                                    onClick={this.handleStartFECC.bind(this, item.line)}
                                    disabled={item.enablefecc != "1" && item.feccstate != "1"}/> */}
                            {/* 暂停视频上传 */}
                            {/* <Button title={tr("a_19241")} className={isvideoedclass}
                                    disabled={!isHeld && item.acct == 1 ? false : true}
                                    onClick={this.handleuploading.bind(this, item.line, item.isvideoed)}/> */} 

                            {/* 点击关闭他的画面 */}
                            <Button title={ item.issuspend == '1'? this.tr('a_23571'): this.tr('a_23572')}
                                    disabled={isHeld || disabledflag || item.isvideo == "0" ? true : false}
                                    className={suspendclass}
                                    onClick={this.suspendLineOrNot.bind(this, item)}
                                    />
                            {/* 关闭视频 */}
                            <Button title={item.isvideo == '1' ? this.tr('a_23573') : this.tr('a_23574') }
                                    disabled={isHeld || disabledflag ? true : false}
                                    className={confvideoclass}
                                    onClick={this.handlelinevideoswitch.bind(this, item)}
                            />
                            {/* 禁声 */}
                            <Button title={item.isblock  == '1' ? this.tr('a_23576') : this.tr('a_23575')}
                                    disabled={isHeld || disabledflag ? true : false}
                                    className={blockclass}
                                    onClick={this.handlelineblock.bind(this, item.line)}
                            />
                            {/* 静音 */}
                            <Button title={item.ismute == '1' ? this.tr('a_23567') : this.tr('a_23566')}
                                    disabled={isHeld || disabledflag ? true : false}
                                    className={muteclass}
                                    onClick={this.handlelinemute.bind(this, item)}/>
                        </span>
                    </div>})
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    callFeatureInfo: state.callFeatureInfo,
    isOnHold: state.globalConfInfo.isonhold,
    ipvrole: state.ipvrole,
    globalConfInfo: state.globalConfInfo,
    isAllMute: state.globalConfInfo.isallmute,
    isAllBlock: state.globalConfInfo.isallblock,
    isAllSuspend: state.globalConfInfo.isallsuspend
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
      suspendLineOrNot: Actions.suspendLineOrNot,
      makeCall: Actions.makeCall
    }

    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LinesList))