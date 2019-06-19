import React, {Component, PropTypes} from 'react'
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

            dscp1State: false,
            dscp2State: false,
            dscp7State: false
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
            this.getReqItem("openlldp", "in_lldp", ""),
            this.getReqItem("proxyhttp", "1552", ""),
            this.getReqItem("noproxy", "22011", ""),
            
            // 三个临时p值
            this.getReqItem("dscp2", "dscp2", ""),  // 第三层SIP QoS
            this.getReqItem("dscp1", "dscp1", ""),  // 第三层音频QoS 
            this.getReqItem("dscp7", "dscp7", "")   // 第三层视频QoS
        );
    }

    componentDidMount() {
        this.props.getItemValues(req_items ,(values) => {
            this.cb_dscp2_dscp1_dscp7(values.dscp2, values.dscp1, values.dscp7)
            this.checkoutproxyhttp(values.proxyhttp);
        });
    }

    cb_dscp2_dscp1_dscp7(dscp2, dscp1, dscp7){
        this.setState({
            dscp2State : dscp2 != '' && dscp2 != '0',
            dscp1State : dscp1 != '' && dscp1 != '0',
            dscp7State : dscp7 != '' && dscp7 != '0',
        })
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


                req_items = req_items.filter( v => !(v.pvalue == 'dscp2' || v.pvalue == 'dscp1' || v.pvalue == 'dscp7'))
                if(this.state.dscp2State) {
                    req_items = req_items.filter(v => v.pvalue != '1558')
                }
                if(this.state.dscp1State) {
                    req_items = req_items.filter(v => v.pvalue != '1559')
                }
                if(this.state.dscp7State) {
                    req_items = req_items.filter(v => v.pvalue != '1560')
                }
                this.props.setItemValues(req_items, values);
            }
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const callTr = this.tr;
        const callTipsTr = this.tips_tr;
        const oemid = this.props.oemId;

        let itemList =
            <Form className="configform" hideRequiredMark style={{minHeight: this.props.mainHeight}}>
                <p className="blocktitle"><s></s>{this.tr("a_19655")}</p>
                <FormItem className = "ip-address" label={< span > {this.tr("a_16652")} < Tooltip title = {this.tips_tr("Preferred DNS 1")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
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
                <FormItem className = "ip-address" label={< span > {this.tr("a_16192")} < Tooltip title = {this.tips_tr("Preferred DNS 2")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
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

                <FormItem label={< span > { this.tr("a_16193") } < Tooltip title = {this.tips_tr("Enable LLDP")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("enablelldp", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: Boolean(Number(this.props.itemValues.enablelldp))
                    })(
                        <Checkbox className="P-1684"/>
                    )}
                </FormItem>
                
                <FormItem style={{display: this.props.oemId == '72' ? 'none' : 'block'}} label={< span > {this.tr("a_19286")} < Tooltip title = {this.tips_tr("Enable CDP")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("enablecdp", {
                        rules: [],
                        valuePropName: 'checked',
                        //initialValue: this.props.itemValues.enablecdp
                        initialValue: Boolean(Number(this.props.itemValues.enablecdp))
                    })(
                        <Checkbox className="P-22119"/>
                    )}
                    <Icon title={this.tr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem  label={< span > {this.tr("a_4275")} < Tooltip title = {this.tips_tr("Layer 3 QoS for SIP")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
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
                        initialValue: this.state.dscp2State ? this.props.itemValues.dscp2 : this.props.itemValues.layer3qossip
                    })(<Input className="P-1558" disabled={this.state.dscp2State ? true : false}/>)}
                </FormItem>
                <FormItem  label={< span > {this.tr("a_4276")} < Tooltip title = {this.tips_tr("Layer 3 QoS for Audio")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
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
                        initialValue: this.state.dscp1State ? this.props.itemValues.dscp1: this.props.itemValues.layer3qosaudio
                    })(<Input className="P-1559" disabled={this.state.dscp1State ? true : false}/>)}
                </FormItem>
                <FormItem  label={< span > {
                    this.tr("a_4277")
                } < Tooltip title = {this.tips_tr("Layer 3 QoS for Video")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
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
                        initialValue: this.state.dscp7State ? this.props.itemValues.dscp7 : this.props.itemValues.layer3qosvideo
                    })(<Input className="P-1560" disabled={this.state.dscp7State ? true : false}/>)}
                </FormItem>
                <FormItem label={< span > {this.tr("a_16194")} < Tooltip title = {this.tips_tr("HTTP/HTTPS User Agent")} > <Icon type="question-circle-o"/> </Tooltip></span>}>
                    {getFieldDecorator("useragent", {
                        rules: [ ],
                        initialValue: this.props.itemValues.useragent
                    })(<Input className="P-1541"/>)}

                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {this.tr("a_19128")} < Tooltip title = {this.tips_tr("SIP User Agent")} > <Icon type="question-circle-o"/> </Tooltip></span>}>
                    {getFieldDecorator("sipuseragent", {
                        rules: [ ],
                        initialValue: this.props.itemValues.sipuseragent
                    })(<Input className="P-26027"/>)}
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
    mainHeight: state.mainHeight,
    enterSave: state.enterSave,
    userType: state.userType,
    oemId: state.oemId
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        promptMsg:Actions.promptMsg,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(CommonForm));
