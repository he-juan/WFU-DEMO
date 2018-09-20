import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Checkbox, Radio, Select, Button, Row } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let checklogitems = ['syslog', 'logcat', 'capture',];
let req_items;
let mode = 1;
let rec_mode = 0;

class DebugForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            aStart:"a_9",
            recordStart:"a_9",
            debugbtndisable: false,
            ckbdisabled: false
        }

        this.handleNvram();
    }

    handleNvram = () => {
         req_items = new Array;
         req_items.push(
             this.getReqItem("enabcoredump", "29611", ""),
             this.getReqItem("syslog", "syslog", ""),
             this.getReqItem("logcat", "logcat", ""),
             this.getReqItem("capture", "capture", ""),
         )
         return req_items;
    }

    view_mode_write = (values) => {
        let aStart;
        if( values.headers['mode'] == "on" ) {
            mode = 0;
            aStart = "a_10";
            this.setState({
                ckbdisabled: true,
                aStart: "a_10"
            });
        }
    }

    getRecordState_suc = (msgs) => {
        var record_state = msgs.headers['record_state'];
        if (record_state == 1) {
            rec_mode = 1;
            this.setState({
                recordStart:"a_10"
            })
        }
    }

    componentDidMount() {
        if(this.props.oemId == "54"){
            checklogitems.push("acce");
            req_items.push(this.getReqItem("acce", "acce", ""));
        }
        this.props.getItemValues(req_items, (values) => {
            this.initDebugitemsStatus(values);
        });
        this.props.getCapturemode('capture&mode=mode', (values) => {
            this.view_mode_write(values);
        });
        this.props.getRecordState( (msgs) => {
            this.getRecordState_suc(msgs);
        });
        this.props.getTracelist();
        this.props.getCoredumplist();
        this.props.getRecordList();
        this.props.Screenshort("get", "");
    }

    htmlEncode = (str) => {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    initDebugitemsStatus = (values) => {
        /* count1 - when all items are unchecked (factory reset), init them with all checked as default value required */
        let count1 = 0, count2 = 0;
        checklogitems.map((item, i) => {
            if(values[item] == "" || values[item] == "0")
                count1 ++;
            else if(values[item] == "1")
                count2 ++;
        })

        if(count1 == checklogitems.length){
            let logitems = {};
            logitems.debugselectall = true;
            for(let i in checklogitems){
                logitems[checklogitems[i]] = true;
            }
            this.props.form.setFieldsValue(logitems);
        }

        if(count2 == checklogitems.length){
            this.props.form.setFieldsValue({debugselectall: true});
        } else {
            if(count1 != checklogitems.length &&  values['capture'] != "1"){
                if( values['acce'] == undefined || values['acce'] != "1" ){
                    this.setState({aStart: "a_screen"});
                }
            }
        }
    }

    handleDebug = () => {
        const form = this.props.form;
        let items = form.getFieldsValue(checklogitems);
        let aStart;

        if(this.state.aStart == "a_screen") {
            items.mode = "none";
        } else {
            if (mode == 1) {
                mode = 0;
                aStart = "a_10";
                items.mode = "on";
            } else {
                mode = 1;
                aStart = "a_9"
                items.mode = "off";
            }

            this.setState({
                aStart: aStart,
                ckbdisabled: !this.state.ckbdisabled
            });
        }

        this.props.oneClickDebug(items, (values) => {
            if(items['mode'] == "off" || items['mode'] == "none") {
                this.props.getTracelist((value) => {
                    const { setFieldsValue } = this.props.form;
                    setFieldsValue({
                        tracelist:value
                    })
                });
                //window.parent.location.href = "../ppp/debugInfo.tar";
            }
        });
    }

    startRecord = () => {
        if (rec_mode == 1) {
            rec_mode = 0;
            this.setState({
                recordStart:"a_10"
            });
            this.props.getRecording("stoprecording" ,(res) => {
                if (res === "Success") {
                    rec_mode = 0;
                    this.setState({
                        recordStart:"a_9"
                    });
                    this.props.getRecordList( (data) => {
                        const { setFieldsValue } = this.props.form;
                        setFieldsValue({
                            recordlist:data
                        })
                    });
                }
            });
        } else {
            rec_mode = 1;
            this.setState({
                recordStart:"a_9"
            });
            this.props.getRecording("startrecording" ,(res) => {
                if (res === "Success") {
                    rec_mode = 1;
                    this.setState({
                        recordStart:"a_10"
                    });
                }
            });
        }
    }

    startScreenShot = () => {
        this.props.Screenshort("new", "", (res) => {
            if (res.response == "success") {
                this.props.Screenshort("get", "", (data) => {
                    const { setFieldsValue } = this.props.form;
                    setFieldsValue({
                        screenList:data
                    })
                })
            }
        })
    }

    deleteTrace = () => {
        this.props.form.validateFieldsAndScroll({force: true}, (err, values) => {
            if (values.tracelist == "") {
                return;
            } else {
                let action = "deletetrace&tracename=" + values.tracelist;
                this.props.getDelete(action,(values) => {
                    this.props.getTracelist((value) => {
                        const { setFieldsValue } = this.props.form;
                        setFieldsValue({
                            tracelist:value
                        })
                    });
                });
            }
        })
    }

    deleteCoredumplist = () => {
        this.props.form.validateFieldsAndScroll({force: true}, (err, values) => {

            if (values.coredumplist == "") {
                return;
            } else {
                let action = "deletecoredump&coredumpname=" + values.coredumplist;
                this.props.getDelete(action,(values) => {
                    this.props.getCoredumplist();
                });
            }
        })
    }

    deleteRecordlist = () => {
        this.props.form.validateFieldsAndScroll({force: true}, (err, values) => {
            if(values.recordlist == "") {
                return;
            } else {
                let action = "deleterecord&recordname=" + values.recordlist;
                this.props.getDelete(action,(values) => {
                    this.props.getRecordList((value) => {
                        const { setFieldsValue } = this.props.form;
                        setFieldsValue({
                            recordlist:value
                        })
                    });
                });
            }
        })
    }

    deleteScreenlist = () => {
        this.props.form.validateFieldsAndScroll({force: true}, (err, values) => {
            if (values.screenList == "") {
                return;
            } else {
                this.props.Screenshort('delete', values.screenList, (value) => {
                    this.props.Screenshort('get', "",  (value) => {
                        const { setFieldsValue } = this.props.form;
                        setFieldsValue({
                            screenList:value
                        })
                    });
                })
            }
        })
    }

    checkoutList = () => {
        window.location = "/ppp/";
    }

    checkoutCoredump = () => {
        window.location = "/coredump/";
    }

    checkoutRecfiles = () => {
        window.location = "/Recfiles/";
    }

    checkoutScreenfiles = () => {
        window.location = "/screenshot/";
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items, (values) => {
                    this.initDebugitemsStatus(values);
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    checkDebugItem = (id, e) => {
        let checked = e.target.checked;
        const form = this.props.form;
        switch (id) {
            case 'selectall':
                if(checked){
                    let logitems = {};
                    for(let i in checklogitems){
                        logitems[checklogitems[i]] = true;
                    }
                    form.setFieldsValue(logitems);
                    this.setState({aStart: "a_9", debugbtndisable: false});
                }else{
                    let logitems = {};
                    for(let i in checklogitems){
                        logitems[checklogitems[i]] = false;
                    }
                    form.setFieldsValue(logitems);
                    this.setState({aStart: "a_screen", debugbtndisable: true});
                }
                break;
            case 'capture':
            case 'acce':
                if(checked){
                    this.setState({aStart: "a_9"});
                }else {
                    if ((id == "acce" && form.getFieldValue("capture")) || (id == "capture" && form.getFieldValue("acce")) ) {
                        this.setState({aStart: "a_9"});
                    } else {
                        this.setState({aStart: "a_screen"});
                    }
                }
            case 'syslog':
            case 'logcat':
            case 'tombstone':
            case 'anr':
                let tmparr = [...checklogitems];
                tmparr = tmparr.filter(item => item != id);
                if(checked){
                    this.setState({debugbtndisable: false});
                    let debugselectall = true;
                    for(let i in tmparr){
                        if(!form.getFieldValue(tmparr[i])){
                            debugselectall = false;
                            break;
                        }
                    }
                    if(debugselectall){
                        form.setFieldsValue({debugselectall: true});
                    }
                }else{
                    form.setFieldsValue({debugselectall: false});
                    let debugbtndisable = true;
                    for(let i in tmparr){
                        if(form.getFieldValue(tmparr[i])){
                            debugbtndisable = false;
                            break;
                        }
                    }
                    if(debugbtndisable){
                        this.setState({debugbtndisable: true});
                    }
                }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                let values = this.props.form.getFieldsValue();
                this.props.setItemValues(req_items, values);
            }
        });
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;
        let aStart = this.state.aStart;
        let recordStart = this.state.recordStart;
        let tracelist = this.props.tracelist;
        const children_tracelist = [];
        for (var i = 0; tracelist[i] != undefined; i++) {
            children_tracelist.push(<Option value = {tracelist[i]}>{this.htmlEncode(tracelist[i])}</Option>);
        }

        let coredumplist = this.props.coredumplist;
        const children_coredumplist = [];
        for (var i = 0; coredumplist[i] != undefined; i++) {
            children_coredumplist.push(<Option value = {coredumplist[i]}>{this.htmlEncode(coredumplist[i])}</Option>);
        }

        let recordlist = this.props.recordlist;
        const children_recordlist = [];
        for (var i = 0; recordlist[i] != undefined; i++) {
            children_recordlist.push(<Option value = {recordlist[i]}>{this.htmlEncode(recordlist[i])}</Option>);
        }

        let screenList = this.props.screenList;
        const children_screenList = [];
        for ( var i = 0; screenList[i] != undefined; i++ ) {
            children_screenList.push(<Option value = {screenList[i]}>{this.htmlEncode(screenList[i])}</Option>);
        }

        let debugInfoMenuTooltipTitle = "Debug Info Menu";
        if(this.props.oemId == "54"){
            debugInfoMenuTooltipTitle = "Debug Info Menu For D13&D3X";
        }

        let itemList =
            <Form hideRequiredMark>
                <p className="blocktitle"><s></s>{this.tr("a_19277")}</p>
                <FormItem label={( <span> {callTr("a_19277")} <Tooltip title={callTipsTr("One-click Debugging")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {(
                        <Button type="primary" onClick={this.handleDebug.bind(this)}
                            disabled={this.state.debugbtndisable}>{this.tr(aStart)}</Button>
                    )}
                </FormItem>

                <FormItem className="one-click-debug" label={( <span> {callTr("a_19280")} <Tooltip title={callTipsTr(debugInfoMenuTooltipTitle)}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    <div>
                        {getFieldDecorator("debugselectall", {
                            valuePropName: 'checked'
                        })(
                            <Checkbox onChange={this.checkDebugItem.bind(this, 'selectall')} disabled={this.state.ckbdisabled} />
                        )}
                        <span> {callTr("a_405")}</span>
                    </div>
                    <div className="dot-line"></div>
                    <div>
                        {getFieldDecorator("syslog", {
                            valuePropName: 'checked',
                            initialValue: Number(this.props.itemValues.syslog)
                        })(
                            <Checkbox onChange={this.checkDebugItem.bind(this, 'syslog')} disabled={this.state.ckbdisabled} />
                        )}
                        <span> {callTr("a_4144")}</span>
                    </div>
                    <div>
                        {getFieldDecorator("logcat", {
                            valuePropName: 'checked',
                            initialValue: Number(this.props.itemValues.logcat)
                        })(
                            <Checkbox onChange={this.checkDebugItem.bind(this, 'logcat')} disabled={this.state.ckbdisabled} />
                        )}
                        <span> {callTr("a_16030")}</span>
                    </div>
                    <div>
                        {getFieldDecorator("capture", {
                            valuePropName: 'checked',
                            initialValue: Number(this.props.itemValues.capture)
                        })(
                            <Checkbox onChange={this.checkDebugItem.bind(this, 'capture')} disabled={this.state.ckbdisabled} />
                        )}
                        <span> {callTr("a_16357")}</span>
                    </div>
                    {/*<div>
                        {getFieldDecorator("tombstone", {
                            valuePropName: 'checked',
                            initialValue: Number(this.props.itemValues.tombstone)
                        })(
                            <Checkbox onChange={this.checkDebugItem.bind(this, 'tombstone')} disabled={this.state.ckbdisabled} />
                        )}
                        <span> {callTr("a_tombstone")}</span>
                    </div>
                    <div>
                        {getFieldDecorator("anr", {
                            valuePropName: 'checked',
                            initialValue: Number(this.props.itemValues.anr)
                        })(
                            <Checkbox onChange={this.checkDebugItem.bind(this, 'anr')} disabled={this.state.ckbdisabled} />
                        )}
                        <span> {callTr("a_anr")}</span>
                    </div>
                    {
                        this.props.oemId != "54" ? "" :
                            <div>
                                {getFieldDecorator("acce", {
                                    valuePropName: 'checked',
                                    initialValue: Number(this.props.itemValues.acce)
                                })(
                                    <Checkbox onChange={this.checkDebugItem.bind(this, 'acce')} disabled={this.state.ckbdisabled} />
                                )}
                                <span> {callTr("a_4340")}</span>
                            </div>
                    }*/}
                </FormItem>

                <FormItem  className="select-item" label={( <span> {callTr("a_16359")} <Tooltip title={callTipsTr("Debug Info List")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {(
                        <Row>
                            {getFieldDecorator('tracelist', {
                                rules: [],
                                initialValue: tracelist[0]
                            })(<Select style={{width:240}} notFoundContent="">
                                {children_tracelist}
                            </Select>
                            )}
                            <Button className="debug" type="primary" className="debug-delete-btn" onClick = {this.deleteTrace.bind(this)}>{this.tr("a_19067")}</Button>
                        </Row>
                    )}
                </FormItem>
                <FormItem label={( <span> {callTr("a_16358")} <Tooltip title={callTipsTr("View Debug Info")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {(
                        <Button className="debug" type="primary" onClick = {this.checkoutList.bind(this)} >{this.tr("a_list")}</Button>
                    )}
                </FormItem>
                <p className="blocktitle"><s></s>{this.tr("a_coredump")}</p>
                <FormItem label={( <span> {callTr("a_19262")} <Tooltip title={callTipsTr("Enable Core Dump Generation")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {getFieldDecorator("enabcoredump", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: this.props.itemValues.enabcoredump
                    })(
                        <Checkbox />
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem className="select-item" label={( <span> {callTr("a_19263")} <Tooltip title={callTipsTr("Core Dump List")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {(
                        <Row>
                            {getFieldDecorator('coredumplist', {
                                rules: [],
                                initialValue: coredumplist[0]
                            })(<Select style={{width:240}} notFoundContent="">
                                {children_coredumplist}
                            </Select>
                            )}
                            <Button className="debug" type="primary" className="debug-delete-btn" onClick = {this.deleteCoredumplist.bind(this)}>{this.tr("a_19067")}</Button>
                        </Row>
                    )}
                </FormItem>
                <FormItem label={( <span> {callTr("a_19264")} <Tooltip title={callTipsTr("View Core Dump")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {(
                        <Button className="debug" type="primary" onClick = {this.checkoutCoredump.bind(this)}>{this.tr("a_list")}</Button>
                    )}
                </FormItem>
                <p className="blocktitle"><s></s>{this.tr("a_410")}</p>
                <FormItem label={( <span> {callTr("a_410")} <Tooltip title={callTipsTr("Record")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {(
                        <Button className="debug" type="primary" onClick={this.startRecord.bind(this)}>{this.tr(recordStart)}</Button>
                    )}
                </FormItem>
                <FormItem className="select-item" label={( <span> {callTr("a_19260")} <Tooltip title={callTipsTr("Recording List")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {(
                        <Row>
                            {getFieldDecorator('recordlist', {
                                rules: [],
                                initialValue: recordlist[0]
                            })(<Select style={{width:240}} notFoundContent="">
                                {children_recordlist}
                            </Select>
                            )}
                            <Button className="debug" type="primary" className="debug-delete-btn" onClick = {this.deleteRecordlist.bind(this)}>{this.tr("a_19067")}</Button>
                        </Row>
                    )}
                </FormItem>
                <FormItem label={( <span> {callTr("a_19261")} <Tooltip title={callTipsTr("View Recording")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {(
                        <Button className="debug" type="primary" onClick = {this.checkoutRecfiles.bind(this)}>{this.tr("a_list")}</Button>
                    )}
                </FormItem>
               {/* <p className="blocktitle"><s></s>{this.tr("a_screenshort")}</p>
                <FormItem label={( <span> {callTr("a_screenshort")} <Tooltip title={callTipsTr("Screenshot")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {(
                        <Button className="debug" type="primary" onClick={this.startScreenShot.bind(this)}>{this.tr("a_screen")}</Button>
                    )}
                </FormItem>
                <FormItem className="select-item" label={( <span> {callTr("a_screenlist")} <Tooltip title={callTipsTr("Screenshot List")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {(
                        <Row>
                            {getFieldDecorator('screenList', {
                                rules: [],
                                initialValue: screenList[0]
                            })(<Select style={{width:240}}>
                                {children_screenList}
                            </Select>
                            )}
                            <Button className="debug" type="primary" className="debug-delete-btn" onClick = {this.deleteScreenlist.bind(this)}>{this.tr("a_19067")}</Button>
                        </Row>
                    )}
                </FormItem>
                <FormItem label={( <span> {callTr("a_viewscreen")} <Tooltip title={callTipsTr("View Screenshot")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {(
                        <Button className="debug" type="primary" onClick = {this.checkoutScreenfiles.bind(this)}>{this.tr("a_list")}</Button>
                    )}
                </FormItem>
                <FormItem >
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{this.tr("a_17")}</Button>
                </FormItem>*/}
            </Form>

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

//export default Enhance(DebugForm);
const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    capturemode: state.capturemode,
    tracelist: state.tracelist,
    coredumplist:state.coredumplist,
    recordlist:state.recordlist,
    screenList:state.screenList,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    oemId: state.oemId
})

const mapDispatchToProps = (dispatch) => {
  const actions = {
    getItemValues:Actions.getItemValues,
    setItemValues:Actions.setItemValues,
    getCapturemode:Actions.getCapturemode,
    getTracelist:Actions.getTracelist,
    getCoredumplist:Actions.getCoredumplist,
    getdeleteTrace:Actions.getdeleteTrace,
    getRecording:Actions.getRecording,
    getRecordList:Actions.getRecordList,
    getDelete:Actions.getDelete,
    getRecordState:Actions.getRecordState,
    Screenshort:Actions.Screenshort,
    oneClickDebug: Actions.oneClickDebug
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DebugForm));
