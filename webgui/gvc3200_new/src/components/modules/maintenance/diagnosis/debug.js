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
        if( values.headers['mode'] == "on" ) {
            mode = 0;
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
                    this.setState({aStart: "a_19281"});
                }
            }
        }
    }

    handleDebug = () => {
        const form = this.props.form;
        let items = form.getFieldsValue(checklogitems);
        let aStart;

        if(this.state.aStart == "a_19281") {
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
            if(items['mode'] == "on" && values.headers.response == 'Error') {
                mode = 1;
                aStart = "a_9"
                this.setState({
                    aStart: aStart,
                    ckbdisabled: !this.state.ckbdisabled
                });
                this.props.promptMsg('ERROR', this.tr('a_2095'))
            }
            if(items['mode'] == "off" || items['mode'] == "none") {
                this.props.getTracelist((value) => {
                    const { setFieldsValue } = this.props.form;
                    setFieldsValue({
                        tracelist:value
                    })
                });
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

    checkoutList = () => {
        window.location = "/ppp/";
    }

    checkoutCoredump = () => {
        window.location = "/coredump/";
    }

    checkoutRecfiles = () => {
        this.props.viewRecordList((response) => {
            if (response.res == "success")  {
                window.location = "/Recfiles/";
            } else {
                this.props.promptMsg('ERROR', this.tr('a_63'))
            }
        });
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
                    this.setState({aStart: "a_19281", debugbtndisable: true});
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
                        this.setState({aStart: "a_19281"});
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

        let itemList =
            <Form hideRequiredMark>
                <p className="blocktitle"><s></s>{this.tr("a_19277")}</p>
                <FormItem label={( <span> {callTr("a_19277")} <Tooltip title={callTipsTr("One-click Debugging")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {(
                        <Button type="primary" onClick={this.handleDebug.bind(this)}
                            disabled={this.state.debugbtndisable}>{this.tr(aStart)}</Button>
                    )}
                </FormItem>

                <FormItem className="one-click-debug" label={( <span> {callTr("a_19280")} <Tooltip title={callTipsTr("Debug Information List")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
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
                            initialValue: Number(this.props.itemValues.syslog) == 1
                        })(
                            <Checkbox onChange={this.checkDebugItem.bind(this, 'syslog')} disabled={this.state.ckbdisabled} />
                        )}
                        <span> {callTr("a_4144")}</span>
                    </div>
                    <div>
                        {getFieldDecorator("logcat", {
                            valuePropName: 'checked',
                            initialValue: Number(this.props.itemValues.logcat) == 1
                        })(
                            <Checkbox onChange={this.checkDebugItem.bind(this, 'logcat')} disabled={this.state.ckbdisabled} />
                        )}
                        <span> {callTr("a_16030")}</span>
                    </div>
                    <div>
                        {getFieldDecorator("capture", {
                            valuePropName: 'checked',
                            initialValue: Number(this.props.itemValues.capture) == 1
                        })(
                            <Checkbox onChange={this.checkDebugItem.bind(this, 'capture')} disabled={this.state.ckbdisabled} />
                        )}
                        <span> {callTr("a_16357")}</span>
                    </div>
                </FormItem>

                <FormItem  className="select-item" label={( <span> {callTr("a_16359")} <Tooltip title={callTipsTr("Package List")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {(
                        <Row>
                            {getFieldDecorator('tracelist', {
                                rules: [],
                                initialValue: tracelist[0]
                            })(<Select style={{width:240}} notFoundContent="">
                                {children_tracelist}
                            </Select>
                            )}
                            <Button  type="primary" className="debug-delete-btn" onClick = {this.deleteTrace.bind(this)}>{this.tr("a_19067")}</Button>
                        </Row>
                    )}
                </FormItem>
                <FormItem label={( <span> {callTr("a_16358")} <Tooltip title={callTipsTr("View Package")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {(
                        <Button  type="primary" onClick = {this.checkoutList.bind(this)} >{this.tr("a_2106")}</Button>
                    )}
                </FormItem>
                <p className="blocktitle"><s></s>{this.tr("a_19823")}</p>
                <FormItem label={( <span> {callTr("a_19262")} <Tooltip title={callTipsTr("Enable Core Dump Generation")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {getFieldDecorator("enabcoredump", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: this.props.itemValues.enabcoredump == 1
                    })(
                        <Checkbox />
                    )}
                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
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
                            <Button  type="primary" className="debug-delete-btn" onClick = {this.deleteCoredumplist.bind(this)}>{this.tr("a_19067")}</Button>
                        </Row>
                    )}
                </FormItem>
                <FormItem label={( <span> {callTr("a_19264")} <Tooltip title={callTipsTr("View Core Dump")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {(
                        <Button  type="primary" onClick = {this.checkoutCoredump.bind(this)}>{this.tr("a_2106")}</Button>
                    )}
                </FormItem>
                <p className="blocktitle"><s></s>{this.tr("a_410")}</p>
                <FormItem label={( <span> {callTr("a_410")} <Tooltip title={callTipsTr("Record")}> <Icon type="question-circle-o"/> </Tooltip> </span> )}>
                    {(
                        <Button  type="primary" onClick={this.startRecord.bind(this)}>{this.tr(recordStart)}</Button>
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
                            <Button  type="primary" className="debug-delete-btn" onClick = {this.deleteRecordlist.bind(this)}>{this.tr("a_19067")}</Button>
                        </Row>
                    )}
                </FormItem>
                <FormItem label={( <span> {callTr("a_19261")} <Tooltip title={callTipsTr("View Recording")}> <Icon type="question-circle-o"/> </Tooltip> </span> )} >
                    {(
                        <Button  type="primary" onClick = {this.checkoutRecfiles.bind(this)}>{this.tr("a_2106")}</Button>
                    )}
                </FormItem>
                <FormItem >
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{this.tr("a_17")}</Button>
                </FormItem>
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
    viewRecordList: Actions.viewRecordList,
    getDelete:Actions.getDelete,
    getRecordState:Actions.getRecordState,
    Screenshort:Actions.Screenshort,
    oneClickDebug: Actions.oneClickDebug,
    promptMsg: Actions.promptMsg
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DebugForm));
