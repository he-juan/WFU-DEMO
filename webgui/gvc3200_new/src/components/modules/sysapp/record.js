import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import {Layout, Tabs, Popconfirm, Modal, Input, message, Form, Button, Icon} from "antd";
import * as Actions from '../../redux/actions/index';
import { bindActionCreators } from 'redux';
import {  connect } from 'react-redux';
import Call from "./record/call";
import Normal from "./record/normal";
import * as optionsFilter from "../../template/optionsFilter"
import RecordSet from "./recordset";
const Content = Layout;
const TabPane = Tabs.TabPane;
const RecordSetForm = Form.create()(RecordSet);
var mEitdId;
var mSpChar = ["\\",":","*","?","<",">","|","\""];
var mOpid;
var mType;
var path;
var recordlistInfo = [];
var norrecordinglist = [];
class Record extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey:0,
            displaySetModal: false,
            showRecordSet: false
        }
    }

    componentDidMount = () => {
        this.updateData();
        if(this.isWP8xx() || (this.props.product == "GXV3380" && this.props.oemId == '54')){
            this.setState({showRecordSet:true})
        }
    }

    updateData = () => {
        this.props.get_recordinglist( (result) => {
            recordlistInfo = result;
        });
        this.props.get_norrecordinglist( (result) => {
            norrecordinglist = result;
        });
    }

    callback = (key) => {
        window.scrollTo(0,0);
        this.setState({activeKey:key})
    }

    convertUTCStrToLocal = (timeStr) => {
        var year = timeStr.substring(0, 4);
        var month = timeStr.substring(5, 7);
        var day = timeStr.substring(8, 10);
        var hour = timeStr.substring(11, 13);
        var min = timeStr.substring(14, 16);
        var sec = timeStr.substring(17, 19);

        var dateObj = new Date(parseInt(year, 10), parseInt(month, 10)-1, parseInt(day, 10), parseInt(hour, 10), parseInt(min, 10), parseInt(sec, 10));
        var timeValue = dateObj.getTime();

        var d=new Date();
        var gmtValue = -(d.getTimezoneOffset()/60);

        return timeValue + gmtValue*60*60*1000;
    }

    view_status_Time = (Timevalue) => {
        var longdatestr;
        if( parseInt(Timevalue) > 10000 ){
            longdatestr = this.convertTime(parseInt(Timevalue));
            return longdatestr;
        }
        else{
            return Timevalue;
        }
    }

    handlePlaying = (text, index) => {
        mOpid = text.Id;
        var classname = document.getElementById(mOpid).className;
        var lock = (classname && classname.split(' ')[1] && classname.split(' ')[1].substring(8));
        var islock;
        islock = lock == 0 ? islock = 0 : islock = 1;
        var id = "playDiv" + index;
        var PlayDiv = document.getElementById(id);
        var Editdiv = document.getElementById(text.Id);
        var downloadButtonId = "allow-download" + index;
        var downloadButton = document.getElementById(downloadButtonId);
        var editButtonId = "allow-edit" + index;
        var editButton = document.getElementById(editButtonId);
        var deleteButtonId = "allow-delete" + index;
        var deleteButton = document.getElementById(deleteButtonId);
        var lockedButtonId = "allow-lock" + index;
        var lockedButton = document.getElementById(lockedButtonId);
        var audio = PlayDiv.firstChild;
        var timeLine = PlayDiv.firstChild.nextSibling;
        var audioButton = PlayDiv.firstChild.nextSibling.nextSibling;
        var progressBarBg = PlayDiv.lastChild.previousSibling;
        var progressBar = PlayDiv.lastChild.previousSibling.firstChild;
        var self = this;
        for (let i = 0; i <recordlistInfo.length ; i++) {
            let className = $('#playDiv'+i+' i').attr('class')
            if( (className === 'Playing') && (i != index)) {
                this.props.promptMsg("ERROR", "a_playinglimit");
                return false;
            }
        }
        audio.addEventListener('timeupdate', function () {
            var value = audio.currentTime / audio.duration;
            progressBar.style.width= value * 100 + '%';
            $('#playDiv'+index+ ' #progressBarBg').hover(function(e){
                var pgsWidth = progressBarBg.offsetWidth;
                var timerate = (e.pageX - 658) / pgsWidth;
                var timeValue = audio.duration * timerate;
                var left = e.pageX - 658 +'px';
                var timeFormat = self.view_status_Duration(timeValue*1000);
                if (!audio.paused || audio.currentTime != 0) {
                    timeLine.style.display= "inline-block";
                }
                timeLine.style.left= left;
                timeLine.innerHTML = timeFormat;
            }, function(){
                timeLine.style.display= "none";
            })
        }, false);
        audio.addEventListener('ended', function() {
            Editdiv.className = 'callRecord';
            progressBar.style.width= 0;
            progressBarBg.style.cursor= "default";
            audio.currentTime = 0;
            audioButton.className = "initial";
            editButton.disabled='';
            downloadButton.disabled='';
            deleteButton.disabled='';
            lockedButton.disabled='';
            var id = 'allow-lock'+index;
            var spanId = 'locktype' + text.Id;
            var name = islock == 0 ? 'allow-lock locktype0' : 'allow-lock locktype1';
            var namediv = islock == 0 ? 'callRecord locktype0' : 'callRecord locktype1';
            var namespan = islock == 0 ? 'lock locktype0' : 'lock locktype1';
            document.getElementById(id).setAttribute("class", name);
            document.getElementById(mOpid).setAttribute("class", namediv);
            document.getElementById(spanId).setAttribute("class", namespan);
        })
        mEitdId = index;
        mOpid = text.Id;
        mType = text.Type;
        var recordinglistInfo;
        if (mType == "0") {
            recordinglistInfo = recordlistInfo;
        } else {
            recordinglistInfo = norrecordinglist;
        }
        for (var i = 0; i < recordinglistInfo.length; i++) {
            if (mOpid == recordinglistInfo[i]['Id']) {
                path = recordinglistInfo[i]['Path'];
                break;
            }
        }
        var recNames = "";
        var paths = path.split(",");
        for (var i = 0; paths != undefined && paths[i] != undefined; i++) {
            var pathName = paths[i].split("/");
            var recName = pathName[pathName.length-1].split(".")[0];

            if (recNames == "")
                recNames = recName;
            else
                recNames += "," + recName;
        }
        var requestplay = "playrecord&region=maintenance&path=" + encodeURIComponent(recNames) +  "&recordtype=" + mType;
        if (audioButton.className == "initial") {
            this.props.getPlayRecord(requestplay, (result) => {
                if (result.headers['response'] == "Success") {
                    audio.src = "/records/"+recNames+".wav";
                    var playPromise = audio.play();
                    // In browsers that don’t yet support this functionality,
                    // playPromise won’t be defined.
                    if (playPromise !== undefined) {
                      playPromise.then(function() {
                        //play started!
                        audioButton.className = "Playing";
                        Editdiv.className = 'diabaledPlay';
                        editButton.disabled='disabled';
                        downloadButton.disabled='disabled';
                        deleteButton.disabled='disabled';
                        lockedButton.disabled='disabled';
                        progressBarBg.style.cursor= "pointer";
                      }).catch(function(error) {
                        //play failed.
                        this.props.promptMsg("ERROR", "a_playerror");
                      });
                    }
                } else {
                    this.props.promptMsg("ERROR", "a_playerror");
                }
            })
        } else if (audioButton.className == "Playing"){
            audioButton.className = "Pause";
            Editdiv.className = 'diabaledPlay';
            editButton.disabled='disabled';
            downloadButton.disabled='disabled';
            deleteButton.disabled='disabled';
            lockedButton.disabled='disabled';
            audio.pause();
        } else if (audioButton.className == "Pause") {
            audioButton.className = "Playing";
            Editdiv.className = 'diabaledPlay';
            editButton.disabled='disabled';
            downloadButton.disabled='disabled';
            deleteButton.disabled='disabled';
            lockedButton.disabled='disabled';
            audio.play();
        }
    }

    handleGrag = (text, index, e) => {
        var id = "playDiv" + index;
        var PlayDiv = document.getElementById(id);
        var audio = PlayDiv.firstChild;
        var progressBarBg = PlayDiv.lastChild.previousSibling;
        if (!audio.paused || audio.currentTime != 0) {
            progressBarBg.style.cursor= "pointer";
            var pgsWidth = progressBarBg.offsetWidth;
            var rate = (e.pageX - 575) / pgsWidth;
            audio.currentTime = audio.duration * rate;
        } else {
            progressBarBg.style.cursor= "default";
        }
    }

    _createDuration = (text, record, index) => {
        var duration = text.Duration;
        var durationTimeArr = this.view_status_Duration(duration);
        var pathArr = text.Path.split(',');
        let statue;
        if (pathArr.length > 1) {
            statue = <span style={{"paddingLeft":"5px"}}>--</span>
        } else {
            statue = <div id={"playDiv" + index} style={{"height":"35px","line-height":"35px","position":"relative"}}>
                <audio></audio>
                <span className = "timeLine">00:00</span>
                <i className='initial' onClick={this.handlePlaying.bind(this, text, index)}></i>
                <div className="progress-bar-bg" id="progressBarBg" onClick = {this.handleGrag.bind(this, text, index)}>
                    <div className="progress-bar" id="progressBar"></div>
                </div>
                <span>{this.tr(durationTimeArr)}</span>
            </div>;
        }
        return statue;
    }

    _createName = (text, record, index) => {
        var name = text.Name;
        var statue = <span id = {'locktype' + text.Id} className={'lock locktype' + text.Lock}>{name}<i style={!this.isWP8xx() ? {display:'inline-block'} : {display:'none'}}></i></span>
        return statue;
    }

    _createTime = (text, record, index) => {
        var Timevalue = this.convertUTCStrToLocal(text);
        Timevalue = this.view_status_Time(Timevalue);
        return Timevalue;
    }

    _createActions = (text, record, index) => {
        let statue;
        statue = <div id = {text.Id} className = {"callRecord locktype" + text.Lock}>
            <button className='allow-download'  id = {'allow-download'+index}  onClick={this.handleDownload.bind(this,text,index)}></button>
            <button className='allow-edit' id = {'allow-edit'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
            <button style={!this.isWP8xx() ? {display:'inline-block'} : {display:'none'}} className={'allow-lock' + ' locktype' + text.Lock} id = {'allow-lock'+index}  onClick={this.handleLockItem.bind(this, text, index)}></button>
            <Popconfirm placement="top" title={this.tr("a_deleteall")} okText={this.tr("a_ok")} cancelText={this.tr("a_cancel")} onConfirm={this.handleOkDelete.bind(this, text, index)}>
                <button className='allow-delete' id = {'allow-delete'+index} ></button>
            </Popconfirm>
        </div>;
        return statue;
    }

    handleDownload = (text, index) => {
        mEitdId = index;
        mOpid = text.Id;
        mType = text.Type;
        var recordinglistInfo;
        if (mType == "0") {
            recordinglistInfo = recordlistInfo;
        } else {
            recordinglistInfo = norrecordinglist;
        }
        for (var i = 0; i < recordinglistInfo.length; i++) {
            if (mOpid == recordinglistInfo[i]['Id']) {
                path = recordinglistInfo[i]['Path'];
                break;
            }
        }
        var recNames = "";
        var paths = path.split(",");
        for (var i = 0; paths != undefined && paths[i] != undefined; i++) {
            var pathName = paths[i].split("/");
            var recName = pathName[pathName.length-1].split(".")[0];

            if (recNames == "")
                recNames = recName;
            else
                recNames += "," + recName;
        }
        path = path.replace(/ogg/g, "rgs").replace(/wav/g, "rgs").replace(/rgs/g, "");
        var requestdown = "downrecord&region=maintenance&path=" + encodeURIComponent(recNames) + "&id=" + mOpid + "&recordtype=" + mType;
        this.props.get_downRecord(requestdown);
    }

    handleLockItem = (text, index,e) => {
        mEitdId = index;
        mOpid = text.Id;
        mType = text.Type;
        var recordinglistInfo;
        var self = this;
        var islock;
        var classname = e.target.className;
        var locktype = classname.split(" ")[1].substring(8);
        islock = locktype == 0 ? islock = 1 : islock = 0;
        if (mType == "0") {
            recordinglistInfo = recordlistInfo;
        } else {
            recordinglistInfo = norrecordinglist;
        }
        for (var i = 0; i < recordinglistInfo.length; i++) {
            if (mOpid == recordinglistInfo[i]['Id']) {
                break;
            }
        }
        var requestlock = "recording&region=maintenance&type=lockrecord&id=" + mOpid + "&lockstate=" + islock + "&recordtype=" + mType;
        this.props.get_lockRecord(requestlock, (result) => {
            if (result == 'success') {
                var id = 'allow-lock'+index;
                var spanId = 'locktype' + text.Id;
                var name = islock == 0 ? 'allow-lock locktype0' : 'allow-lock locktype1';
                var namediv = islock == 0 ? 'callRecord locktype0' : 'callRecord locktype1';
                var namespan = islock == 0 ? 'lock locktype0' : 'lock locktype1';
                document.getElementById(id).setAttribute("class", name);
                document.getElementById(mOpid).setAttribute("class", namediv);
                document.getElementById(spanId).setAttribute("class", namespan);
            }
        });
    }

    handleEditItem = (text, index) => {
        mEitdId = index;
        mOpid = text.Id;
        mType = text.Type;
        var recordinglistInfo;
        var self = this;
        if (mType == "0") {
            recordinglistInfo = recordlistInfo;
        } else {
            recordinglistInfo = norrecordinglist;
        }
        for (var i = 0; i < recordinglistInfo.length; i++) {
            if (mOpid == recordinglistInfo[i]['Id']) {
                path = recordinglistInfo[i]['Path'];
                break;
            }
        }
        Modal.info({
            title: <span dangerouslySetInnerHTML={{__html: self.tr("a_rename")}}></span>,
            content: (
                <div>
                    <Input id="renameinput" name="renameinput" type="text" ></Input>
                </div>
            ),
            okText: <span dangerouslySetInnerHTML={{__html: self.tr("a_ok")}}></span>,
            cancelText: <span dangerouslySetInnerHTML={{__html: self.tr("a_cancel")}}></span>,
            onOk() {self.handleOk(mOpid,mType,path)},
            onCancel() {}
        });
    }

    handleOk = (mOpid,mType,path) => {
        var value  = document.getElementById("renameinput").value;
        var oldname;
        var recordinglistInfo;
        if (mType == "0") {
            recordinglistInfo = recordlistInfo;
        } else {
            recordinglistInfo = norrecordinglist;
        }
        for (var i = 0; i < recordinglistInfo.length; i++) {
            if (mOpid == recordinglistInfo[i]['Id']) {
                oldname = recordinglistInfo[i]['Name'];
                break;
            }
        }
        var newname = $.trim(value);
        if (newname.length > 64) {
            this.props.promptMsg('ERROR',"a_recordlen");
            return false;
        }

        var spcharlength = mSpChar.length;
        var illegalflag = false;
        if (newname == '') {
            return false;
        } else {
            this.props.get_recordinglist( (result) => {
                recordinglistInfo = result;
            });
            for (let i = 0; i <recordinglistInfo.length ; i++) {
                if(newname === recordinglistInfo[i].Name) {
                    if(recordinglistInfo[i]['Id'] !== mOpid){
                        this.props.promptMsg('ERROR',"a_nameexist");
                        return false;
                    }
                }
            }
        }
        var n = 0;
        for (var n = 0; n < spcharlength; n++) {
            if (newname.indexOf(mSpChar[n]) != -1) {
                illegalflag = true;
                break;
            }
        }
        var reg = new RegExp("^[a-zA-Z0-9\u4E00-\u9FA5\uF900-\uFA2D_-]+$");
        if (!reg.test(newname)) {
            illegalflag = true;
        }
        if (illegalflag) {
            this.props.promptMsg('ERROR',"a_renameerr");
            return false;
        }
        if (newname == oldname) {
            return false;
        }
        this.props.promptSpinMsg('display-block', "a_processing");
        var hassame = false;
        var requestUri = "recording&region=maintenance&type=renamerecord&id=" + mOpid + "&newname=" + encodeURIComponent(newname) + "&recordtype=" + mType;
        var pathNum = 0;
        if (path.split(",").length > 1) {
            var tmpPaths = path.split(",");
            var newPath = "";
            for (var i = 0; tmpPaths[i] != undefined; i++) {
                var pathSplit = tmpPaths[i].split("/");
                var nameStr = pathSplit[pathSplit.length-1].split("_");
                nameStr = nameStr[nameStr.length-1];
                var realNameStr = pathSplit[pathSplit.length-1].substring(0, pathSplit[pathSplit.length-1].length - nameStr.length - 1);
                var oldNameStr = realNameStr;
                var newNameStr = newname;
                var tmpPathsName = tmpPaths[i].split("/");
                var newpathName = tmpPathsName[3].replace(new RegExp(oldNameStr, 'g'), newNameStr);
                tmpPaths[i] = tmpPaths[i].replace(new RegExp(tmpPathsName[3], 'g'), newpathName);
                if (newPath == ""){
                    newPath = tmpPaths[i];
                } else {
                    newPath += "," + tmpPaths[i];
                }
            }
        } else {
            var pathSplit = path.split("/");
            var nameStr = pathSplit[pathSplit.length -1].split(".")[0];

            if (mType == "2") {
                var oldNameStr = nameStr + ".wav";
                var newNameStr = newname + ".wav";
            } else {
                var oldNameStr = nameStr + ".ogg";
                var newNameStr = newname + ".ogg";
            }
            var newPath = path.replace(new RegExp(oldNameStr, 'g'), newNameStr);
        }
        requestUri += "&newpath=" + encodeURIComponent(newPath);
        var paths = path.split(",");
        for (var i = 0; paths[i] != undefined; i++) {
            paths[i] = paths[i].replace(/ogg/g, "rgs").replace(/wav/g, "rgs");
            if (paths.length > 1) {
                var pathSplit = paths[i].split("/");
                var nameStr = pathSplit[pathSplit.length - 1].split("_");
                nameStr = nameStr[nameStr.length-1];
                var realNameStr = pathSplit[pathSplit.length-1].substring(0, pathSplit[pathSplit.length-1].length - nameStr.length - 1);
                var oldNameStr = realNameStr;
                var newNameStr = newname;

                var newpathName = pathSplit[3].replace(new RegExp(oldNameStr, 'g'), newNameStr);
                var newpath = paths[i].replace(new RegExp(pathSplit[3], 'g'), newpathName);
            } else {
                var pathSplit = paths[i].split("/");
                var nameStr = pathSplit[pathSplit.length-1].split(".")[0];

                var oldNameStr = nameStr + ".rgs";
                var newNameStr = newname + ".rgs";

                var newpath = paths[i].replace(new RegExp(oldNameStr, 'g'), newNameStr);
            }
            paths[i] = paths[i].replace(/rgs/g, "*");
            requestUri += "&path" + pathNum + "=" + encodeURIComponent(paths[i]);
            requestUri += "&newpath" + pathNum + "=" + encodeURIComponent(newpath);

            pathNum++;
        }
        requestUri += "&pathnum=" + pathNum;
        this.props.get_renameRecord(requestUri, (data) => {
            if (data.response == "success") {

                this.props.promptSpinMsg('display-hidden', "a_processing");
                var newpath = requestUri.split("newpath=")[1].split("&")[0];
                newpath = decodeURIComponent(newpath);
                for (var i = 0; i < recordinglistInfo.length; i++) {
                   if (mOpid == recordinglistInfo[i]['Id']) {
                       recordinglistInfo[i]['Path'] = newpath;
                   }
                }
                this.updateData();
                this.props.promptMsg('SUCCESS',"a_edit_ok");
                var requesturi = "recordingnotify&region=maintenance&type=rename&id=" + mOpid;
                this.props.get_recordingNotify(requesturi);
           } else {
               var msg = data.Msg;
                this.props.promptSpinMsg('display-hidden', "a_processing");
                if (msg == "Playing") {
                    this.props.promptMsg('ERROR',"a_playing");
                } else {
                    this.props.promptMsg('ERROR',"a_errorname");
                }
           }
        });
    }

    handleOkDelete = (text, index) => {
        mEitdId = index;
        mOpid = text.Id;
        mType = text.Type;
        var classname = document.getElementById(mOpid).className;
        var lock = classname.split(' ')[1].substring(8);
        if( lock == "1" ){
            this.props.promptMsg('ERROR',"a_del_locked");
            return false;
        }
        var recordinglistInfo;
        if (mType == "0") {
            recordinglistInfo = recordlistInfo;
        } else {
            recordinglistInfo = norrecordinglist;
        }
        for (var i = 0; i < recordinglistInfo.length; i++) {
            if (mOpid == recordinglistInfo[i]['Id']) {
                path = recordinglistInfo[i]['Path'];
                break;
            }
        }
        var number = 1;
        var delteId = [mOpid];
        path = path.replace(/ogg/g, "rgs").replace(/wav/g, "rgs").replace(/rgs/g, "*").replace(/,/g, " ");
        var requestDelete = "recording&region=maintenance&type=deleterecord&id0=" + mOpid + "&filename0=" + encodeURIComponent(path) + "&recordtype0=" + mType + "&num=" + number;
        this.props.get_deleteRecord(requestDelete, (data) => {
            if (data.id == '') {
                this.props.promptMsg('ERROR',"a_del_failed");
            } else if (data.id === delteId.join(',')) {
                this.props.promptMsg('SUCCESS',"a_del_ok");
            } else {
                this.props.promptMsg('ERROR',"a_delerr");
            }
            $(".CallDiv #allow-download"+mEitdId).parent().parent().parent().remove();
            for (var i = recordinglistInfo.length; i > 0; i--) {
                if (mOpid == recordinglistInfo[i]['Id']) {
                    recordinglistInfo.splice(i,1);
                }
            }
            var requesturi = "recordingnotify&region=maintenance&type=rename&id=" + data.id;
            this.props.get_recordingNotify(requesturi);
        });
    }

    handleRecordSet = () => {
        this.setState({displaySetModal: true});
    }
    handleHideSetModal = () => {
        this.setState({displaySetModal: false});
    }

    render() {
        let hideItem = [];
        let tabList =
            <Tabs className="config-tab" activeKey={this.state.activeKey} onChange = {this.callback.bind(this)} style = {{'minHeight':this.props.mainHeight}}>
                <TabPane tab = {this.tr("call_record")} key={0}>
                    <Call {...this.props} hideItem={hideItem} callTr={this.tr} activeKey={this.state.activeKey}
                        _createName = {this._createName} _createDuration = {this._createDuration} _createTime = {this._createTime} _createActions = {this._createActions} />
                </TabPane>
                <TabPane tab = {this.tr("normal_record")} key={1}>
                    <Normal {...this.props} hideItem={hideItem} callTr={this.tr} activeKey={this.state.activeKey}
                        _createName = {this._createName} _createDuration = {this._createDuration} _createTime = {this._createTime} _createActions = {this._createActions} />
                </TabPane>
            </Tabs>

        for (var i = 0, j = 0; tabList.props.children[i] != undefined; i++, j++) {
            let hiddenOptions = optionsFilter.getHiddenOptions(j);

            if (hiddenOptions[0] == -1) {
                tabList.props.children.splice(i,1);
                i--;
            } else {
                tabList.props.children[i].key = i;
                tabList.props.children[i].props.key = i;
                tabList.props.children[i].props.children.props.tabOrder = i;
                tabList.props.children[i].props.children.props.hideItem = hiddenOptions;
            }
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("sysapp_record")}</div>
                {
                this.state.showRecordSet ?
                <div  style={{height:'1px',position:'relative',background:'transparent'}}>
                    <i className='recordSetIcon' onClick={this.handleRecordSet.bind(this)}></i>
                </div>:null
                }
                {tabList}
                <RecordSetForm {...this.props} displaySetModal={this.state.displaySetModal} handleHideSetModal={this.handleHideSetModal}  callTr={this.tr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    userType: state.userType,
    recordinglist:state.recordinglist,
    norrecordinglist:state.norrecordinglist,
    product: state.product,
    oemId:state.oemId,
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues: Actions.getItemValues,
        setItemValues: Actions.setItemValues,
        get_recordinglist: Actions.get_recordinglist,
        get_norrecordinglist: Actions.get_norrecordinglist,
        get_downRecord: Actions.get_downRecord,
        get_lockRecord: Actions.get_lockRecord,
        getPlayRecord: Actions.getPlayRecord,
        promptMsg:Actions.promptMsg,
        promptSpinMsg:Actions.promptSpinMsg,
        get_renameRecord: Actions.get_renameRecord,
        get_deleteRecord: Actions.get_deleteRecord,
        get_recordingNotify: Actions.get_recordingNotify
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Record));
