import React, {Component, PropTypes} from 'react';
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { Layout, Tabs, Input, Checkbox, Form, Tooltip, Icon, InputNumber, Button } from "antd";
import * as optionsFilter from "../../template/optionsFilter"
import { FormattedHTMLMessage } from 'react-intl'
const Content = Layout;
const FormItem = Form.Item;
const req_items = [{"name":"rtpport", "pvalue":"39", "value":""},
                    {"name":"randomport", "pvalue":"78", "value":""},
                    {"name":"keepalive", "pvalue":"84", "value":""},
                    {"name":"stunserver", "pvalue":"76", "value":""},
                    {"name":"stunservername", "pvalue":"22042", "value":""},
                    {"name":"stunserverpwd", "pvalue":"22043", "value":""},
                    {"name":"natip", "pvalue":"101", "value":""},
                    {"name":"remoteappconnect", "pvalue":"25022", "value":""}];

class General extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pwdstatus1:'password',
            pwdstatus2:'password',
        }
        this.state = {
            type: "password",
        }
        
    }

    checkRtpPort = (rule, value, callback) => {
        if(value % 2 != 0 || value == ""){
            callback(rule.method("a_16685"));
        }
        callback();
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items);
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.props.setItemValues(req_items, values, 1);
            }
        });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.tr;
        const callTipsTr = this.tips_tr;
        const itemvalue = this.props.itemValues;

        let itemList =
            <Form className="configform" hideRequiredMark style={{'min-height': this.props.mainHeight}} >
                <FormItem label={<span>{callTr("a_16280")}<Tooltip placement="bottom" title={<FormattedHTMLMessage id={this.isWP8xx() ? callTipsTr("Local RTP Port for WP800") : callTipsTr("Local RTP Port")} />}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("rtpport", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 50040, 65000)
                            }
                        },{
                            validator: this.checkRtpPort, method: callTr
                        }],
                        initialValue: itemvalue['rtpport']
                    })(
                        <Input className={"P-39"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16281")}<Tooltip title={callTipsTr("Use Random Port")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("randomport", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['randomport'])
                    })(
                        <Checkbox className={"P-78"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16282")}<Tooltip title={callTipsTr("Keep-alive Interval")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("keepalive", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 10, 160)
                            }
                        }],
                        initialValue: itemvalue['keepalive']
                    })(
                        <Input className={"P-84"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16283")}<Tooltip title={callTipsTr("STUN/TURN Server")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("stunserver", {
                        rules: [{
                            max: 32, message: callTr("a_15073")
                        },{
                            validator: (data, value, callback) => {
                                this.checkUrlPath(data, value, callback)
                            }
                        }],
                        initialValue: itemvalue['stunserver']
                    })(
                        <Input className={"P-76"} autoComplete={false}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_19026")}<Tooltip title={callTipsTr("TURN Server Username")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("stunservername", {
                        rules: [{
                            max: 32, message: callTr("a_15073")
                        }],
                        initialValue: itemvalue['stunservername']
                    })(
                        <Input autocomplete="off" className={"P-22042"} autoComplete={false}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_19027")}<Tooltip title={callTipsTr("TURN Server Password")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("stunserverpwd", {
                        rules: [{
                            max: 128, message: callTr("a_19243")
                        }],
                        initialValue: itemvalue['stunserverpwd']
                    })(
                        <Input type={this.state.type} className={"P-22043"} autoComplete={false}
                               suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />} />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16284")}<Tooltip title={callTipsTr("Use NAT IP")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("natip", {
                        rules: [{
                            max: 32, message: callTr("a_19243")
                        }],
                        initialValue: itemvalue['natip']
                    })(
                        <Input className={"P-101"}/>
                    )}
                </FormItem>

                <FormItem label={<span>{callTr("a_16616")}<Tooltip title={callTipsTr("Use Random Port")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("remoteappconnect", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['remoteappconnect'])
                    })(
                        <Checkbox className={"P-25022"}/>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>

        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length-1; hiddenOptions[i] != undefined && i >= 0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_16023")}</div>
                {itemList}
            </Content>
        )
    }
}

const GeneralForm = Form.create()(Enhance(General));
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
        setItemValues:Actions.setItemValues,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralForm);
