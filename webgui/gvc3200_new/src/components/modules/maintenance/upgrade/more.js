import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Checkbox, Radio, Select, Button, Row, InputNumber, Modal } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
const confirm = Modal.confirm
let req_items;

class MoreForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }

        this.handleNvram();
    }

    handleNvram = () => {
         req_items = [];
         req_items.push(
             this.getReqItem("sipnotify", "4428", ""),
             this.getReqItem("validatecert", "22030", ""),
             this.getReqItem("mdns", "1407", ""),
             this.getReqItem("dhcp66", "145", ""),
             this.getReqItem("autopro", "1414", ""),
             this.getReqItem("Overridedhcp", "8337", ""),
             this.getReqItem("dhcp120", "1411", ""),
         )
         return req_items;
    }

    componentDidMount() {
        this.props.getItemValues(req_items);
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items);
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
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

    cb_resetres = () => {
        const m_uploading = this.props.m_uploading;
        const callTr = this.props.callTr;
        const cb_resetres_ok = this.props.cb_resetres_ok;

        if(!m_uploading) {
            confirm({
                content: <span dangerouslySetInnerHTML={{__html: callTr("a_16472")}}></span>,
                okText: callTr("a_2"),
                cancelText: callTr("a_3"),
                onOk() {
                    cb_resetres_ok("0");
                },
            })
        }
    }

    onClickReset = () => {
        const cb_ping = this.props.cb_ping;
        cb_ping(() => {
            this.cb_resetres();
        });
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={< span > {callTr("a_19013")} < Tooltip title = {callTipsTr("Disable SIP NOTIFY Authentication")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("sipnotify", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.sipnotify)
                    })(
                        <Checkbox className="P-4428"/>
                    )}
                </FormItem>
                <FormItem label={< span > {callTr("a_19025")} < Tooltip title = {callTipsTr("Validate Server Certificate")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("validatecert", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.validatecert)
                    })(
                        <Checkbox className="P-22030"/>
                    )}
                </FormItem>
                <FormItem className="select-item" label={< span > {callTr("a_16334")} < Tooltip title = {callTipsTr("mDNS Override Server")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('mdns', {
                        rules: [],
                        initialValue: this.props.itemValues["mdns"] ? this.props.itemValues["mdns"] : "0"
                    })(
                        <Select className="P-1407">
                            <Option value="0">{callTr("a_39")}</Option>
                            <Option value="1">{callTr("a_16335")}</Option>
                            <Option value="2">{callTr("a_16336")}</Option>
                        </Select>
                    )
                    }
                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {callTr("a_16337")} < Tooltip title = {callTipsTr("Allow DHCP Option 43, 160 and 66 Override Server")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("dhcp66", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.dhcp66)
                    })(
                        <Checkbox className="P-4428"/>
                    )}
                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {callTr("a_19706")} < Tooltip title = {callTipsTr("Additional Override DHCP Option")} > <Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("Overridedhcp", {
                        rules: [],
                        initialValue: this.props.itemValues['Overridedhcp']?this.props.itemValues['Overridedhcp']:"0"
                    })(
                        <Select className="P-8337">
                            <Option value="0">{callTr("a_20")}</Option>
                            <Option value="2">{callTr("Option 160")}</Option>
                        </Select>
                    )}
                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {callTr("a_16338")} < Tooltip title = {callTipsTr("DHCP Option 120 Override SIP Server")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("dhcp120", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.dhcp120)
                    })(
                        <Checkbox className="P-1411"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {callTr("a_16339")} < Tooltip title = {callTipsTr("3CX Auto Provision")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("autopro", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.sipnotify)
                    })(
                        <Checkbox className="P-4428"/>
                    )}
                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={< span > {callTr("a_4105")} < Tooltip title = {callTipsTr("Factory Reset")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    <Button className="button" type="primary" onClick = {this.onClickReset.bind(this)}>{this.tr("a_resetkey")}</Button>
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        cb_ping:Actions.cb_ping,
        promptMsg:Actions.promptMsg,
        cb_resetres_ok:Actions.cb_resetres_ok
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(MoreForm));
