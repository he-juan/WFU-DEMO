import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance"
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedHTMLMessage } from 'react-intl'
import {Form, Tooltip, Icon, Input, Checkbox, InputNumber, Button} from "antd"
const FormItem = Form.Item;

const req_items = [{"name":"rtpport", "pvalue":"39", "value":""},
                    {"name":"randomport", "pvalue":"78", "value":""},
                    {"name":"disableincalldtmf", "pvalue":"338", "value":""},
                    {"name":"conbackendmatch", "pvalue":"22128", "value":""},
                    {"name":"keepalive", "pvalue":"84", "value":""},
                    {"name":"stunserver", "pvalue":"76", "value":""},
                    {"name":"stunservername", "pvalue":"22042", "value":""},
                    {"name":"stunserverpwd", "pvalue":"22043", "value":""},
                    {"name":"natip", "pvalue":"101", "value":""}];


class GeneralForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            type: "password",
        }
    }

    checkRtpPort = (rule, value, callback) => {
        if(value % 2 != 0 || value == ""){
            callback(rule.method("a_rtpporterror"));
        }
        callback();
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
        this.props.readHideConfig((msgs) => {
            this.props.form.setFieldsValue({
                //hideldap: !parseInt(msgs.headers['ldapvisible']),
                hidecalllog: !parseInt(msgs.headers['calllogvisible'])
            });
        });
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

                /*let hidevalues = [];
                hidevalues.push(values['hideldap']);
                hidevalues.push(values['hidecalllog']);*/
                this.props.writeHideConfig(1, Number(!values['hidecalllog']));
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;
        let itemList =
            <Form hideRequiredMark>
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
                <FormItem label={<span>{callTr("a_16279")}<Tooltip title={callTipsTr("Disable in-call DTMF display")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disableincalldtmf", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disableincalldtmf'])
                    })(
                        <Checkbox className={"P-338"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_backmatch")}<Tooltip title={this.props.product!="GAC2510"?callTipsTr("Enable Enterprise Contacts Timeout Auto Search"):callTipsTr("Enable Enterprise Contacts Timeout Auto Search2")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("conbackendmatch", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['conbackendmatch'])
                    })(
                        <Checkbox className={"P-22128"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16624")}<Tooltip title={callTipsTr("Hide Local Call History")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("hidecalllog", {
                        valuePropName: 'checked',
                    })(
                        <Checkbox />
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
                <FormItem label={<span>{callTr("a_stunserver")}<Tooltip title={callTipsTr("STUN Server")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("stunserver", {
                        rules: [{
                            max: 32, message: callTr("a_19805") + "32!"
                        },{
                            validator: (data, value, callback) => {
                                this.checkUrlPath(data, value, callback)
                            }
                        }],
                        initialValue: itemvalue['stunserver']
                    })(
                        <Input className={"P-76"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_19026")}<Tooltip title={callTipsTr("TURN Server Username")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("stunservername", {
                        rules: [{
                            max: 32, message: callTr("a_19805") + "32!"
                        }],
                        initialValue: itemvalue['stunservername']
                    })(
                        <Input autocomplete="off" className={"P-22042"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_19027")}<Tooltip title={callTipsTr("TURN Server Password")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("stunserverpwd", {
                        rules: [{
                            max: 128, message: callTr("a_19805") + "128!"
                        }],
                        initialValue: itemvalue['stunserverpwd']
                    })(
                        <Input type={this.state.type} className={"P-22043"}
                               suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />} />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16284")}<Tooltip title={callTipsTr("Use NAT IP")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("natip", {
                        rules: [{
                            max: 32, message: callTr("a_19805") + "32!"
                        }],
                        initialValue: itemvalue['natip']
                    })(
                        <Input className={"P-101"}/>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>
        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    product:state.product
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues: Actions.getItemValues,
      setItemValues: Actions.setItemValues,
      readHideConfig: Actions.readHideConfig,
      writeHideConfig: Actions.writeHideConfig
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(GeneralForm));
