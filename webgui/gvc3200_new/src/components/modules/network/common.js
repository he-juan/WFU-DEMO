import React, {Component, PropTypes} from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { Form, Layout, Button, Row, Tooltip, Checkbox, Icon, InputNumber, Input, Select, Tabs,Upload, message , Radio, Modal} from 'antd';
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
let req_items;

class Common extends Component {

    constructor(props) {
        super(props)

        this.state = {
            pcportmode:"",
            openlldpStyle:"",
            input_disabled:""
        }

        req_items = new Array;
        req_items.push(
            this.getReqItem("relprednsser1", "92", ""),
            this.getReqItem("relprednsser2", "93", ""),
            this.getReqItem("relprednsser3", "94", ""),
            this.getReqItem("relprednsser4", "95", ""),
            this.getReqItem("secrelprednsser1", "5026", ""),
            this.getReqItem("secrelprednsser2", "5027", ""),
            this.getReqItem("secrelprednsser3", "5028", ""),
            this.getReqItem("secrelprednsser4", "5029", ""),
            this.getReqItem("enablelldp", "1684", ""),
            this.getReqItem("lldpinterval", "22122", ""),
            this.getReqItem("enablecdp", "22119", ""),
            this.getReqItem("layer3qossip", "1558", ""),
            this.getReqItem("layer3qosaudio", "1559", ""),
            this.getReqItem("layer3qosvideo", "1560", ""),
            this.getReqItem("useragent", "1541", ""),
            this.getReqItem("sipuseragent", "26027", ""),
            //this.getReqItem("mediaaddr", "media_address", ""),
            this.getReqItem("pcportmode", "1348", ""),
            this.getReqItem("pcporttag", "229", ""),
            this.getReqItem("pcporttagpv", "230", ""),
            this.getReqItem("openlldp", "in_lldp", ""),
            this.getReqItem("proxyhttp", "1552", ""),
            this.getReqItem("noproxy", "22011", "")
        );
    }

    componentDidMount() {
        this.props.getItemValues(req_items ,(values) => {
            this.checkoutPcportmode(values.pcportmode);
            if (values.openlldp == "1") {
                this.cb_lldp_mode_change(true);
            } else {
                this.cb_lldp_mode_change(false);
            }
            this.checkoutproxyhttp(values.proxyhttp);
        });
        this.props.getReadshowipState();
    }

    checkoutproxyhttp = (value) => {
        const { setFieldsValue } = this.props.form;
        var proxystr = value;
        var proxypos = proxystr.lastIndexOf(":");
        if( proxypos != -1 ) {
            let proxyhttpurl = proxystr.substring(0, proxypos);
            let proxyhttpport = proxystr.substring(proxypos+1)
            setFieldsValue({
                proxyhttpurl:proxyhttpurl,
                proxyhttpport:proxyhttpport
            })
        }else{
            setFieldsValue({
                proxyhttpurl:proxystr
            })
        }
    }

    cb_lldp_mode_change = (value) => {
        let openlldpStyle;
        let input_disabled;
        let values = this.props.form.getFieldsValue();
        if (value && values.openlldp == "1") {
            openlldpStyle = "display-gray";
            input_disabled = "disabled";
        } else {
            openlldpStyle = "display-block";
            input_disabled = "";
        }
        this.setState({
            openlldpStyle:openlldpStyle,
            input_disabled:input_disabled
        });
    }

    componentWillReceiveProps = (nextProps) => {
        // this.props.getItemValues(req_items, (values) => {
        //     this.checkoutproxyhttp(values.proxyhttp);
        // });
        // this.props.form.resetFields();
        if(this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                /*if ((this.props.oemId == "54") && (values.mediaaddr.trim()== "")) {
                    this.props.promptMsg('ERROR',"a_medarrwrong");
                    return false;
                }*/
                let set
                set = new Set([values['relprednsser1'],values["relprednsser2"],values["relprednsser3"],values["relprednsser4"]]);
                if ([...set].length != 1 && set.has('')) {
                    for(var i = 1; i <= 4; i++) {
                        $("#relprednsser"+i).parent().attr("class","ant-form-item-control has-error");
                    }
                    setTimeout(function () {
                        for(var i = 1; i <= 4; i++) {
                            $("#relprednsser"+i).parent().attr("class","ant-form-item-control has-success");
                        }
                    }, 2000);
                    this.props.promptMsg('ERROR',"a_16442");
                    return false;
                }
                set = new Set([values['secrelprednsser1'],values["secrelprednsser2"],values["secrelprednsser3"],values["secrelprednsser4"]]);
                if ([...set].length != 1 && set.has('')) {
                    for(var i = 1; i <= 4; i++) {
                        $("#secrelprednsser"+i).parent().attr("class","ant-form-item-control has-error");
                    }
                    setTimeout(function () {
                        for(var i = 1; i <= 4; i++) {
                            $("#secrelprednsser"+i).parent().attr("class","ant-form-item-control has-success");
                        }
                    }, 2000);
                    this.props.promptMsg('ERROR',"a_16442");
                    return false;
                }
                var showip = 1;
                if (values.showwidgetip === false) {
                    showip = 0
                }
                this.props.get_showwidgetip(showip);
                var tmpproxy = values.proxyhttpurl;
                tmpproxy = $.trim(tmpproxy);
                var tmpport = values.proxyhttpport;
                tmpport = $.trim(tmpport);
                var tmpnoproxy =values.noproxy;
                tmpnoproxy = $.trim(tmpnoproxy);
                let callTr = this.tr;
                let pre1 = "HTTP://"
                let pre2 = "HTTPS://"
                if( tmpproxy.substring(0, pre1.length).toUpperCase() === pre1) {
                    tmpproxy = tmpproxy.substring(pre1.length)
                } else if ( tmpproxy.substring(0, pre2.length).toUpperCase() === pre2 ) {
                    tmpproxy = tmpproxy.substring(pre2.length)
                }
                if (tmpproxy.indexOf(":") != -1 && tmpproxy.split(":").length == 2 || tmpproxy.toUpperCase().indexOf("HTTP") != -1) {
                    Modal.info({
                        content: <span dangerouslySetInnerHTML={{__html: callTr("a_16444")}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                        onOk() {},
                    });
                    return false;
                }
                if( (tmpproxy == "" && tmpport != "") || (tmpproxy != "" && tmpport == "") || (tmpnoproxy != "" && tmpproxy == "" && tmpport == "") ) {
                    Modal.info({
                        content: <span dangerouslySetInnerHTML={{__html: callTr("a_16445")}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                        onOk() {},
                    });
                    return false;
                }

                if( tmpport != "" ) {
                    values.proxyhttp = tmpproxy+":"+tmpport;
                }else{
                    values.proxyhttp = tmpproxy;
                }

                this.props.setItemValues(req_items, values);
            }
        });
    }

    checkoutPcportmode = (value) => {
        let pcportmode;
        value = value ? value : '0';
        if (value === '0') {
            pcportmode = "display-block"
        } else {
            pcportmode = "display-hidden"
        }
        this.setState({
            pcportmode: pcportmode
        })
    }

    onChangeMode = (value) => {
        this.checkoutPcportmode(value);
    }

    onChangeEnablelldp = (e) => {
        this.cb_lldp_mode_change(e.target.checked);
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const callTr = this.tr;
        const callTipsTr = this.tips_tr;
        const oemid = this.props.oemId;
        let readshowipState = this.props.readshowipState;
        var showwidgetip;
        if(readshowipState.headers)
        {
            readshowipState.headers['showip'] == "0" ? showwidgetip = false: showwidgetip = true;
        }

        let itemList =
            <Form className="configform" hideRequiredMark style={{'min-height': this.props.mainHeight}}>
                <p className="blocktitle"><s></s>{this.tr("a_19655")}</p>
                <FormItem className = "ip-address" label={< span > {this.tr("a_16652")} < Tooltip title = {this.tips_tr("Alternate DNS Server")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {(
                        <Row className="div-inputnumber">
                            <FormItem>
                                {getFieldDecorator('relprednsser1', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['relprednsser1']
                                })(<Input className="P-92"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('relprednsser2', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    }, {
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['relprednsser2']
                                })(<Input className="P-93"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('relprednsser3', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['relprednsser3']
                                })(<Input className="P-94"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('relprednsser4', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['relprednsser4']
                                })(<Input className="P-95"/>)}
                            </FormItem>
                        </Row>
                    )}
                </FormItem>
                <FormItem className = "ip-address" label={< span > {this.tr("a_19656")} < Tooltip title = {this.tips_tr("Second Alternate DNS Server")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {(
                        <Row className="div-inputnumber">
                            <FormItem>
                                {getFieldDecorator('secrelprednsser1', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['secrelprednsser1']
                                })(<Input className="P-5026"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('secrelprednsser2', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['secrelprednsser2']
                                })(<Input className="P-5027"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('secrelprednsser3', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['secrelprednsser3']
                                })(<Input className="P-5028"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('secrelprednsser4', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['secrelprednsser4']
                                })(<Input className="P-5029"/>)}
                            </FormItem>
                        </Row>
                    )}
                </FormItem>
                {/*<FormItem label={< span > {this.tr("a_showwidgetip")
                } < Tooltip title = {this.tips_tr("Show IP Address On Account Widget")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("showwidgetip", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: showwidgetip
                    })(
                        <Checkbox />
                    )}
                </FormItem>*/}
                <FormItem label={< span > { this.tr("a_16193") } < Tooltip title = {this.tips_tr("Enable LLDP")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("enablelldp", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: Boolean(Number(this.props.itemValues.enablelldp))
                    })(
                        <Checkbox className="P-1684"/>
                    )}
                </FormItem>
                {/*<FormItem label={< span > {this.tr("a_lldpinterval")} < Tooltip title = {this.tips_tr("LLDP TX Interval")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("lldpinterval", {
                        rules: [{
                            required: true,
                            message: this.tr("a_19637")
                        },{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 1, 3600)
                            }
                        }],
                        initialValue: this.props.itemValues.lldpinterval
                    })(
                        <Input min={1} max={3600} className="P-22122"/>
                    )}
                    <Icon title={this.tr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {this.tr("a_enablecdp")} < Tooltip title = {this.tips_tr("Enable CDP")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("enablecdp", {
                        rules: [],
                        valuePropName: 'checked',
                        //initialValue: this.props.itemValues.enablecdp
                        initialValue: Boolean(Number(this.props.itemValues.enablecdp))
                    })(
                        <Checkbox className="P-22119"/>
                    )}
                    <Icon title={this.tr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>*/}
                <FormItem className = {this.state.openlldpStyle} label={< span > {this.tr("a_4275")} < Tooltip title = {this.tips_tr("Layer 3 QoS for SIP")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("layer3qossip", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 63)
                            }
                        }],
                        initialValue: this.props.itemValues.layer3qossip
                    })(<Input className="P-1558" disabled={this.state.input_disabled}/>)}
                </FormItem>
                <FormItem className = {this.state.openlldpStyle} label={< span > {this.tr("a_4276")} < Tooltip title = {this.tips_tr("Layer 3 QoS for Audio")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("layer3qosaudio", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 63)
                            }
                        }],
                        initialValue: this.props.itemValues.layer3qosaudio
                    })(<Input className="P-1559" disabled={this.state.input_disabled}/>)}
                </FormItem>
                <FormItem className = {this.state.openlldpStyle} label={< span > {
                    this.tr("a_4277")
                } < Tooltip title = {this.tips_tr("Layer 3 QoS for Video")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("layer3qosvideo", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 63)
                            }
                        }],
                        initialValue: this.props.itemValues.layer3qosvideo
                    })(<Input className="P-1560" disabled={this.state.input_disabled}/>)}
                </FormItem>
                <FormItem label={< span > {this.tr("a_16194")} < Tooltip title = {this.tips_tr("HTTP/HTTPS User Agent")} > <Icon type="question-circle-o"/> < /Tooltip>< /span>}>
                    {getFieldDecorator("useragent", {
                        rules: [ ],
                        initialValue: this.props.itemValues.useragent
                    })(<Input className="P-1541"/>)}
                    <Icon title={this.tr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {this.tr("a_19128")} < Tooltip title = {this.tips_tr("SIP User Agent")} > <Icon type="question-circle-o"/> < /Tooltip>< /span>}>
                    {getFieldDecorator("sipuseragent", {
                        rules: [ ],
                        initialValue: this.props.itemValues.sipuseragent
                    })(<Input className="P-26027"/>)}
                </FormItem>
                {/*<FormItem className={oemid == "54" ? 'display-block' : 'display-hidden'} label={< span > {this.tr("a_19317")} < Tooltip title = {this.tips_tr("Media Address")} > <Icon type="question-circle-o"/> < /Tooltip>< /span>}>
                    {getFieldDecorator("mediaaddr", {
                        rules: [],
                        initialValue: this.props.itemValues.mediaaddr
                    })(<Input className="P-media_address"/>)}
                </FormItem>*/}
                <p className="blocktitle"><s></s>{this.tr("a_16600")}</p>
                <FormItem className="select-item" label={< span > {this.tr("a_16600")} < Tooltip title = {this.tips_tr("PC Port Mode")} > <Icon type="question-circle-o"/> < /Tooltip>< /span>}>
                    {getFieldDecorator('pcportmode', {
                        rules: [],
                        initialValue: this.props.itemValues["pcportmode"] ? this.props.itemValues["pcportmode"] : "0"
                    })(
                        <Select onChange={ this.onChangeMode.bind(this) } className="P-1348">
                            <Option value="0">{this.tr("a_38")}</Option>
                            <Option value="1">{this.tr("a_39")}</Option>
                            <Option value="2">{this.tr("a_16601")}</Option>
                        </Select>
                    )}
                    <Icon title={this.tr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem className={ this.state.pcportmode } label={< span > {this.tr("a_16598")} < Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("PC Port VLAN Tag")} />} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("pcporttag", {
                        rules: [{
                            required: true,
                            message: this.tr("a_19637")
                        },{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 4094)
                            }
                        }],
                        initialValue: this.props.itemValues.pcporttag
                    })(<Input min={0} max={4094} className="P-229"/>)}
                </FormItem>
                <FormItem className={ this.state.pcportmode } label={< span > {this.tr("a_16599")} < Tooltip title = {this.tips_tr("PC Port Priority Value")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("pcporttagpv", {
                        rules: [{
                            required: true,
                            message: this.tr("a_19637")
                        },{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 7)
                            }
                        }],
                        initialValue: this.props.itemValues.pcporttagpv
                    })(<Input min={0} max={7} className="P-230"/>)}
                </FormItem>
                <p className="blocktitle"><s></s>{callTr("a_16651")}</p>
                <FormItem label={<span>{callTr("a_16198")} <Tooltip title={callTipsTr("HTTP/HTTPS Proxy Hostname")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator('proxyhttpurl', {
                        rules: [],
                        //initialValue: eventItemsArr.setup
                    })(<Input />)}
                </FormItem>
                <FormItem label={<span>{callTr("a_16199")} <Tooltip title={callTipsTr("HTTP/HTTPS Proxy Port")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator('proxyhttpport', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 65535)
                            }
                        }],
                        //initialValue: eventItemsArr.setup
                    })(<Input />)}
                </FormItem>
                <FormItem label={<span>{callTr("a_16200")} <Tooltip title={callTipsTr("Bypass Proxy For")}> <Icon type="question-circle-o"/> </Tooltip> </span> }>
                    {getFieldDecorator("noproxy", {
                        rules: [ ],
                        initialValue: this.props.itemValues.noproxy
                    })(<Input className="P-22011"/>)}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{this.tr("a_17")}</Button>
                </FormItem>
                <FormItem>
                    {getFieldDecorator('openlldp', {
                        rules: [],
                        initialValue: this.props.itemValues.openlldp
                    })(<Input maxLength="40" style = {{display:"none"}} className="P-in_lldp"/>)
                    }
                </FormItem>
                <FormItem>
                    {getFieldDecorator('proxyhttp', {
                        rules: [],
                        initialValue: this.props.itemValues.proxyhttp
                    })(<Input style = {{display:"none"}}/>)}
                </FormItem>
            </Form>;

        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length-1; hiddenOptions[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }

        return (
            <Content className="content-container  config-container">
                <div className="subpagetitle">{this.tr("a_19655")}</div>
                {itemList}
            </Content>
        )
    }
}

//export default Enhance(Network);
const CommonForm = Form.create()(Enhance(Common));
const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    readshowipState: state.readshowipState,
    mainHeight: state.mainHeight,
    enterSave: state.enterSave,
    userType: state.userType,
    oemId: state.oemId
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        getReadshowipState:Actions.getReadshowipState,
        promptMsg:Actions.promptMsg,
        get_showwidgetip:Actions.get_showwidgetip
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(CommonForm));
