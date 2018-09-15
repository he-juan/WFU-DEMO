import React, {Component, PropTypes} from 'react';
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { Layout, Tabs, Input, Checkbox, Form, Tooltip, Icon, InputNumber, Button } from "antd";
import * as optionsFilter from "../../template/optionsFilter"
import $ from 'jquery';
const Content = Layout;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
let req_items;

class Tr069 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pwdstatus1:'password',
            pwdstatus2:'password',
        }

        req_items = new Array;
        req_items.push(
            this.getReqItem("openacs", "1409", ""),
            this.getReqItem("acsurl", "4503", ""),
            this.getReqItem("acsusername", "4504", ""),
            this.getReqItem("acspwd", "4505", ""),
            this.getReqItem("perialenable", "4506", ""),
            this.getReqItem("perialinterval", "4507", ""),
            this.getReqItem("conusername", "4511", ""),
            this.getReqItem("conpwd", "4512", ""),
            this.getReqItem("conport", "4518", ""),
            this.getReqItem("cpecert", "8220", ""),
            this.getReqItem("cpekey", "8221", "")
        )
    }

    handlePwdVisible1 = () => {
        let pwdstatus = this.state.pwdstatus1;
        pwdstatus = pwdstatus == "password" ? "text" : "password";
        this.setState({pwdstatus1 : pwdstatus});
    }
    handlePwdVisible2 = () => {
        let pwdstatus = this.state.pwdstatus2;
        pwdstatus = pwdstatus == "password" ? "text" : "password";
        this.setState({pwdstatus2 : pwdstatus});
    }


    componentDidMount() {
        this.props.getItemValues(req_items);
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
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
        const {getFieldDecorator} = this.props.form;

        let itemList =
            <Form className="configform" hideRequiredMark style={{'min-height': this.props.mainHeight}}>
                <FormItem label={< span > {
                    this.tr("a_16360")
                } < Tooltip title = {this.tips_tr("Enable TR-069")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("openacs", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.openacs)
                    })(
                        <Checkbox className="P-1409"/>
                    )}
                    <Icon title={this.tr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {
                    this.tr("a_acsurl")
                } < Tooltip title = {this.tips_tr("ACS URL")} > <Icon type="question-circle-o"/> </Tooltip></span>}>
                    {getFieldDecorator("acsurl", {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkaddressPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue:this.props.itemValues.acsurl
                    })(<Input className="P-4503"/>)}
                </FormItem>
                <FormItem label={< span > {
                    this.tr("a_acsusername")
                } < Tooltip title = {this.tips_tr("ACS Username")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("acsusername", {
                        rules: [
                            {
                                max: 64,
                                message: this.tr("a_lengthlimit") + "64"
                            }
                        ],
                        initialValue:this.props.itemValues.acsusername
                    })(<Input className="P-4504"/>)}
                </FormItem>
                <FormItem label={< span > {
                    this.tr("a_acspwd")
                } < Tooltip title = {this.tips_tr("ACS Password")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("acspwd", {
                        rules: [ ],
                        initialValue:this.props.itemValues.acspwd
                    })(<Input type={this.state.pwdstatus1} className="P-4505"  suffix={<Icon type="eye" className={this.state.pwdstatus1} onClick={this.handlePwdVisible1} />}/>)}
                </FormItem>
                <FormItem label={< span > {
                    this.tr("a_perialenable")
                } < Tooltip title = {this.tips_tr("Periodic Inform Enable")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("perialenable", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.perialenable)
                    })(
                        <Checkbox className="P-4506"/>
                    )}
                </FormItem>
                <FormItem label={< span > {
                    this.tr("a_16369")
                } < Tooltip title = {this.tips_tr("Periodic Inform Interval")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("perialinterval", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }],
                        initialValue:this.props.itemValues.perialinterval
                    })(<Input className="P-4507"/>)}
                </FormItem>
                <FormItem label={< span > {
                    this.tr("a_conusername")
                } < Tooltip title = {this.tips_tr("Connection Request Username")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("conusername", {
                        rules: [
                            {
                                max: 64,
                                message: this.tr("a_lengthlimit") + "64"
                            }
                        ],
                        initialValue:this.props.itemValues.conusername
                    })(<Input className="P-4511"/>)}
                </FormItem>
                <FormItem label={< span > {
                    this.tr("a_conpwd")
                } < Tooltip title = {this.tips_tr("Connection Request Password")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("conpwd", {
                        rules: [
                            {
                                max: 64,
                                message: this.tr("a_lengthlimit") + "64"
                            }
                        ],
                        initialValue:this.props.itemValues.conpwd
                    })(<Input type={this.state.pwdstatus2} className="P-4512" suffix={<Icon type="eye" className={this.state.pwdstatus2} onClick={this.handlePwdVisible2} />} />)}
                </FormItem>
                <FormItem label={< span > {
                    this.tr("a_conport")
                } < Tooltip title = {this.tips_tr("Connection Request Port")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("conport", {
                        rules: [{
                                validator: (data, value, callback) => {
                                    this.digits(data, value, callback)
                                }
                            }, {
                                validator: (data, value, callback) => {
                                    this.range(data, value, callback, 0, 65535)
                                }
                            }],
                        initialValue:this.props.itemValues.conport
                    })(<Input min={0} max={65535} className="P-4518"/>)}
                </FormItem>
                <FormItem label={< span > {
                    this.tr("a_16373")
                } < Tooltip title = {this.tips_tr("CPE Cert File")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("cpecert", {
                        rules: [ ],
                        initialValue:this.props.itemValues.cpecert
                    })(<Input type="textarea" className="P-8220" autosize={{
                        minRows: 5
                    }}/>)
                    }
                </FormItem>
                <FormItem label={< span > {
                    this.tr("a_16374")
                } < Tooltip title = {this.tips_tr("CPE Cert Key")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("cpekey", {
                        rules: [ ],
                        initialValue:this.props.itemValues.cpekey
                    })(<Input type="textarea" className="P-8221" autosize={{
                        minRows: 5
                    }}/>)
                    }
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{this.tr("a_17")}</Button>
                </FormItem>
            </Form>

        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length-1; hiddenOptions[i] != undefined && i >= 0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_tr069")}</div>
                {itemList}
            </Content>
        )
    }
}

//export default Enhance(Tr069);
const Tr069Form = Form.create()(Enhance(Tr069));
const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    mainHeight: state.mainHeight,
    userType: state.userType,
    enterSave: state.enterSave
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Tr069Form));
