import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Form, Tooltip, Icon, Input, Checkbox, Select, Button, Slider, Row, Col, Switch} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"ringoncall", "pvalue":"22225", "value":""},
        {"name":"msginfo", "pvalue":"22228", "value":""},
        {"name":"msgcustom", "pvalue":"gsensor_flip_reply_sms_customer", "value":""},
        {"name":"weakvolume", "pvalue":"22226", "value":""},
        {"name":"weakalarm", "pvalue":"22227", "value":""},
        {"name":"callslience", "pvalue":"22229", "value":""}
    ];

class GestureForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            SMSmode: '',
            Msgmode: ''
        }
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {
            this.checkoutSMSvalue(values.ringoncall);
            this.checkoutMsgvalue(values.msginfo);
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items, (values) => {
                    this.checkoutSMSvalue(values.ringoncall);
                    this.checkoutMsgvalue(values.msginfo);
                });
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err){
                this.props.setItemValues(req_items, values);
            }
        });
    }

    checkoutSMSvalue = (value) => {
        let SMSmode;
        value = value ? value : '0';
        if (value === '2') {
            SMSmode = 'display-block'
        } else {
            SMSmode = 'display-hidden'
        }
        this.setState({
            SMSmode: SMSmode
        })
    }

    checkoutMsgvalue = (value) => {
        let Msgmode;
        value = value ? value : 'not_convenient';
        if (value === 'customize') {
            Msgmode = 'display-block'
        } else {
            Msgmode = 'display-hidden'
        }
        this.setState({
            Msgmode: Msgmode
        })
    }

    onChangeMode = (value) => {
        this.checkoutSMSvalue(value);
    }

    onChangeMsgMode = (value) => {
        this.checkoutMsgvalue(value);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;

        let itemList =
            <Form hideRequiredMark style={{'min-height': this.props.mainHeight}}>
                <p className="blocktitle"><s></s>{callTr("flip_phone")}</p>
                <FormItem className="select-item" label={< span > {callTr("a_ringoncall")} < Tooltip title = {callTipsTr("Reject incoming call")} > <Icon type="question-circle-o"/> < /Tooltip>< /span>}>
                    {getFieldDecorator('ringoncall', {
                        rules: [],
                        initialValue: itemvalue["ringoncall"] ? itemvalue["ringoncall"] : "3"
                    })(
                        <Select className="P-22225" onChange={ this.onChangeMode.bind(this) }>
                            <Option value="1">{callTr("a_10038")}</Option>
                            <Option value="2">{callTr("a_rejectwithmsg")}</Option>
                            <Option value="3">{callTr("a_8")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className={"select-item " + this.state.SMSmode} label={< span > {callTr("a_msginfo")} < Tooltip title = {callTipsTr("Reply content")} > <Icon type="question-circle-o"/> < /Tooltip>< /span>}>
                    {getFieldDecorator('msginfo', {
                        rules: [],
                        initialValue: itemvalue["msginfo"] ? itemvalue["msginfo"] : "not_convenient"
                    })(
                        <Select className="P-22228" onChange={this.onChangeMsgMode.bind(this)}>
                            <Option value="not_convenient">{callTr("a_msginfo0")}</Option>
                            <Option value="call_later">{callTr("a_msginfo1")}</Option>
                            <Option value="in_metting">{callTr("a_msginfo2")}</Option>
                            <Option value="in_a_call">{callTr("a_msginfo3")}</Option>
                            <Option value="customize">{callTr("a_msgcustom")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className={this.state.Msgmode} label={< span > {callTr("a_msgcustom")} < Tooltip title = {callTipsTr("Customize")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("msgcustom", {
                        rules: [{
                            max: 60,
                            message: callTr("a_lengthlimit") + "60"
                        }],
                        initialValue: itemvalue.msgcustom
                    })(<Input className="P-gsensor_flip_reply_sms_customer"/>)}
                </FormItem>
                <p className="blocktitle"><s></s>{callTr("pick_phone")}</p>
                <FormItem label={<span>{callTr("a_weakvolume")} < Tooltip title = {callTipsTr("Lower Ring tone volume")} > <Icon type="question-circle-o"/> < /Tooltip></span>}>
                    {getFieldDecorator("weakvolume", {
                        initialValue: itemvalue['weakvolume'] ? itemvalue['weakvolume'] : "3"
                    })(
                        <Select className="P-22226">
                            <Option value="1">{callTr("a_649")}</Option>
                            <Option value="2">{callTr("a_alarmweak")}</Option>
                            <Option value="3">{callTr("a_8")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_weakalarm")} < Tooltip title = {callTipsTr("Alarm volume down")} > <Icon type="question-circle-o"/> < /Tooltip></span>}>
                    {getFieldDecorator("weakalarm", {
                        initialValue: itemvalue['weakalarm'] ? itemvalue['weakalarm'] : "3"
                    })(
                        <Select className="P-22227">
                            <Option value="1">{callTr("a_649")}</Option>
                            <Option value="2">{callTr("a_alarmweak")}</Option>
                            <Option value="3">{callTr("a_8")}</Option>
                        </Select>
                    )}
                </FormItem>
                <p className="blocktitle"><s></s>{callTr("dounleTap_phone")}</p>
                <FormItem label={<span>{callTr("a_callslience")} < Tooltip title = {callTipsTr("Mute/unmute during a call")} > <Icon type="question-circle-o"/> < /Tooltip></span>}>
                    {getFieldDecorator("callslience", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['callslience'])
                    })(
                        <Checkbox className="P-22229" />
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form> ;

        let hideItem = this.props.hideItem;
        for(let i = hideItem.length - 1; hideItem[i] != undefined && i >= 0; i-- ) {
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

export default connect(mapStateToProps)(GestureForm);
