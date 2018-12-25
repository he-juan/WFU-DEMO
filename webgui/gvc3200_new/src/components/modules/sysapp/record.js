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
    }

    updateData = () => {
        this.props.get_recordinglist( (result) => {
            recordlistInfo = result;
        });
        // this.props.get_norrecordinglist( (result) => {
        //     norrecordinglist = result;
        // });
    }

    callback = (key) => {
        window.scrollTo(0,0);
        this.setState({activeKey:key})
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

    _createName = (text, record, index) => {
        let path = text.Path
        let info = this.getRecordNameAndPath(path)
        var name = info.name
        var statue = <span id = {'locktype' + text.Id} className={'lock ellips locktype' + text.Lock}><i/>{name}</span>
        return statue;
    }

    _createTime = (text, record, index) => {
        text = parseInt(text)
        let Timevalue = this.view_status_Time(text);
        return Timevalue;
    }

    _createActions = (text, record, index) => {
        let statue;
        statue = <div id = {text.Id} className = {"callRecord locktype" + text.Lock}>
            <button className='allow-download'  id = {'allow-download'+index}  onClick={this.handleDownload.bind(this,text.Path,index)}></button>
            <button className='allow-edit' id = {'allow-edit'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
            <button style={!this.isWP8xx() ? {display:'inline-block'} : {display:'none'}} className={'allow-lock' + ' locktype' + text.Lock} id = {'allow-lock'+index}  onClick={this.handleLockItem.bind(this, text, index)}></button>
            <Popconfirm placement="top" title={this.tr("a_6174")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleOkDelete.bind(this, text, index)}>
                <button className='allow-delete' id = {'allow-delete'+index} ></button>
            </Popconfirm>
        </div>;
        return statue;
    }

    getRecordNameAndPath = (path) => {
        let mNameIndex = path.lastIndexOf("/") + 1;
        let name = path.substring(mNameIndex);
        let pathOnly = path.substring(0,mNameIndex-1)
        return {name:name,pathOnly:pathOnly}
    }

    handleDownload = (path, index) => {
        let record = this.getRecordNameAndPath(path)
        let recordingpath = record.pathOnly
        let recordingName = record.name

        if( recordingpath.indexOf("sdcard") != -1 ) {
            parent.window.location.href = "/sdcard/Recording/" + encodeURIComponent(recordingName) + "?time=" + new Date().getTime();
        } else if( recordingpath.indexOf("usbhost") != -1 ){
            if( recordingpath.indexOf("usbhost0") != -1 )
                parent.window.location.href = "/usbhost0/Recording/" + encodeURIComponent(recordingName) + "?time=" + new Date().getTime();
            else if( recordingpath.indexOf("usbhost2") != -1 )
                parent.window.location.href = "/usbhost2/Recording/" + encodeURIComponent(recordingName) + "?time=" + new Date().getTime();
            else if( recordingpath.indexOf("usbhost3") != -1 )
                parent.window.location.href = "/usbhost3/Recording/" + encodeURIComponent(recordingName) + "?time=" + new Date().getTime();
            else
                parent.window.location.href = "/usbhost1/Recording/" + encodeURIComponent(recordingName) + "?time=" + new Date().getTime();
        } else {
            parent.window.location.href = "/Recording/" + encodeURIComponent(recordingName) + "?time=" + new Date().getTime();
        }
    }

    handleLockItem = (text, index,e) => {
        mEitdId = index;
        mOpid = text.Id;
        var islock;
        var classname = e.target.className;
        var locktype = classname.split(" ")[1].substring(8);
        islock = locktype == 0 ? islock = 1 : islock = 0;
        var requestlock = "recording&region=maintenance&type=lockrecord&id=" + mOpid + "&lockstate=" + islock;
        this.props.get_lockRecord(requestlock, (result) => {
            if (result == 'Success') {
                var id = 'allow-lock'+index;
                var spanId = 'locktype' + text.Id;
                var name = islock == 0 ? 'allow-lock locktype0' : 'allow-lock locktype1';
                var namediv = islock == 0 ? 'callRecord locktype0' : 'callRecord locktype1';
                var namespan = islock == 0 ? 'lock ellips locktype0' : 'lock ellips locktype1';
                document.getElementById(id).setAttribute("class", name);
                document.getElementById(mOpid).setAttribute("class", namediv);
                document.getElementById(spanId).setAttribute("class", namespan);
            }
        });
    }

    handleEditItem = (text, index) => {
        let id = text.Id
        let dom = 'locktype' + id;
        let className = document.getElementById(dom).className;
        var lock = className.split('locktype')[1]
        if(lock == '1') {
            this.props.promptMsg('ERROR',"a_18567");
            return false
        }
        var self = this;
        Modal.info({
            title: <span dangerouslySetInnerHTML={{__html: self.tr("a_69")}}></span>,
            content: (
                <div>
                    <Input id="renameinput" name="renameinput" type="text"></Input>
                </div>
            ),
            okText: <span dangerouslySetInnerHTML={{__html: self.tr("a_2")}}></span>,
            cancelText: <span dangerouslySetInnerHTML={{__html: self.tr("a_3")}}></span>,
            onOk() {self.handleOk(text)},
            onCancel() {}
        });
    }

    handleOk = (text) => {
        var value  = document.getElementById("renameinput").value;
        var newname = $.trim(value);
        if (newname.length > 64) {
            this.props.promptMsg('ERROR',"a_15073");
            return false;
        }
        let path = text.Path
        let info = this.getRecordNameAndPath(path)
        var oldname = info.name
        let pathOnly = info.pathOnly
        var recordinglistInfo = [];
        let mOpid = text.Id
        var spcharlength = mSpChar.length;
        var illegalflag = false;
        if (newname == '') {
            return false;
        } else {
            recordinglistInfo = this.props.recordinglist
            for (let i = 0; recordinglistInfo[i] != undefined ; i++) {
                let item = recordinglistInfo[i]
                let name = this.getRecordNameAndPath(item.Path).name
                let str = newname + '.mkv'
                if(str === name) {
                    if(item['Id'] !== mOpid){
                        this.props.promptMsg('ERROR',"a_18568");
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
            this.props.promptMsg('ERROR',"a_2096");
            return false;
        }
        newname += '.mkv'
        if (newname == oldname) {
            return false;
        }
        // this.props.promptSpinMsg('display-block', "a_processing");
        var requestUri = "recording&region=maintenance&type=renamerecord&id=" + mOpid + "&name=" + encodeURIComponent(oldname) + "&newname=" + encodeURIComponent(newname) + "&pathonly=" + encodeURIComponent(pathOnly);
        this.props.resetVideoName(requestUri,()=>{
            this.updateData()
        })
    }

    handleOkDelete = (text, index) => {
        if (text.Lock == '1') {
            this.props.promptMsg('ERROR',"a_6162");
        }
        let mOpid = text.Id;
        let path = text.Path
        var delteId = [mOpid];
        path = path.replace(/ogg/g, "rgs").replace(/wav/g, "rgs").replace(/rgs/g, "*").replace(/,/g, " ");
        var requestDelete = "recording&region=maintenance&type=deleterecord&id=" + mOpid + "&filename=" + encodeURIComponent(path);
        this.props.get_deleteRecord(requestDelete, (data) => {
            if (data.Id == '') {
                this.props.promptMsg('ERROR',"a_58");
            } else if (data.Id === delteId.join(',')) {
                this.props.promptMsg('SUCCESS',"a_57");
            } else {
                this.props.promptMsg('ERROR',"a_20157");
            }
            $(".CallDiv #allow-download"+mEitdId).parent().parent().parent().remove();
            for (var i = recordinglistInfo.length; i > 0; i--) {
                if (mOpid == recordinglistInfo[i]['Id']) {
                    recordinglistInfo.splice(i,1);
                }
            }
            this.updateData()
            var requesturi = "recordingnotify&region=maintenance&type=rename&id=" + data.id;
            this.props.get_recordingNotify(requesturi);
        });
    }

    render() {
        let tabList =[
            (hiddenOptions,i) => {
                return<TabPane tab = {this.tr("a_12098")} key={i}>
                    <Call {...this.props} hideItem={hiddenOptions} tabOrder={i} callTr={this.tr} activeKey={this.state.activeKey}
                          _createName = {this._createName}  _createTime = {this._createTime} _createActions = {this._createActions} getRecordNameAndPath={this.getRecordNameAndPath} updateData={this.updateData}/>
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab = {this.tr("normal_record")} key={i}>
                    <Normal {...this.props} hideItem={hiddenOptions} tabOrder={i} callTr={this.tr} activeKey={this.state.activeKey}
                            _createName = {this._createName} _createDuration = {this._createDuration} _createTime = {this._createTime} _createActions = {this._createActions} />
                </TabPane>
            }
        ]

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_12098")}</div>
                <Tabs className="config-tab" activeKey={this.state.activeKey} onChange = {this.callback.bind(this)} style = {{'minHeight':this.props.mainHeight}}>
                    {
                        tabList.map((item,index)=>{
                            let hiddenOptions = optionsFilter.getHiddenOptions(index)
                            if (hiddenOptions[0] == -1) {
                                return null
                            }else{
                                return item(hiddenOptions,index.toString())
                            }
                        })
                    }
                </Tabs>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    userType: state.userType,
    recordinglist:state.videorecordinglist,
    norrecordinglist:state.norrecordinglist,
    product: state.product,
    oemId:state.oemId,
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues: Actions.getItemValues,
        setItemValues: Actions.setItemValues,
        get_recordinglist: Actions.getVideoRecording,
        get_norrecordinglist: Actions.get_norrecordinglist,
        get_downRecord: Actions.get_downRecord,
        get_lockRecord: Actions.get_lockRecord,
        getPlayRecord: Actions.getPlayRecord,
        promptMsg:Actions.promptMsg,
        promptSpinMsg:Actions.promptSpinMsg,
        get_renameRecord: Actions.get_renameRecord,
        get_deleteRecord: Actions.get_deleteRecord,
        get_recordingNotify: Actions.get_recordingNotify,
        resetVideoName:Actions.resetVideoName
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Record));
