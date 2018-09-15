import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Radio, Select, Button ,Checkbox} from "antd";
import * as Actions from '../../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items;

class SyslogForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            aSendlog:''
        }

        this.handleNvram();
    }

    handleNvram = () => {
        req_items = new Array;
        req_items.push(
            this.getReqItem("syslogptl", "8402", ""),
            this.getReqItem("syslogser", "207", ""),
            this.getReqItem("sysloglev", "208", ""),
            this.getReqItem("syslogfilter", "22129", ""),
            this.getReqItem("sendlog", "1387", "")
        )
        return req_items;
    }

    componentDidMount() {
        this.props.getItemValues(req_items, (values) => {
            this.checkoutLoglevel(values.sysloglev);
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items, (values) => {
                    this.checkoutLoglevel(values.sysloglev);
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    checkoutLoglevel = (value) => {
        let aSendlog;
        if (value === '1') {
            aSendlog = 'display-block'
        } else {
            aSendlog = 'display-hidden'
        }
        this.setState({
            aSendlog: aSendlog
        })
    }

    onChangeLoglevel = (value) => {
        this.checkoutLoglevel(value);
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let values = this.props.form.getFieldsValue();
                this.props.setItemValues(req_items, values);
            }
        });
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;

        let itemList =
            <Form hideRequiredMark>
                <FormItem className="select-item" label={(<span>{callTr("a_12200")}
                    <Tooltip title={callTipsTr("Syslog Protocol")}><Icon type="question-circle-o"/></Tooltip>
                    </span>)}>
                    {getFieldDecorator('syslogptl', {
                        rules: [],
                        initialValue: this.props.itemValues['syslogptl'] ? this.props.itemValues['syslogptl'] : "0"
                    })(
                        <Select className="P-8402">
                            <Option value="0">UDP</Option>
                            <Option value="1">SSL/TLS</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_syslogser")}
                    <Tooltip title={callTipsTr("Syslog Server")}><Icon type="question-circle-o"/></Tooltip></span>)}>
                    {getFieldDecorator('syslogser', {
                        rules: [
                            {
                                max: 128,
                                message: callTr("a_lengthlimit") + "128"
                            },{
                                validator: (data, value, callback) => {
                                    this.checkaddressPath(data, $.trim(value), callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues['syslogser']
                    })(<Input className="P-207"/>)}
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_4136")}
                        <Tooltip title={callTipsTr("Syslog Level")}><Icon type="question-circle-o"/></Tooltip>
                    </span>
                )}>
                    {getFieldDecorator('sysloglev', {
                        rules: [],
                        initialValue: this.props.itemValues['sysloglev'] ? this.props.itemValues['sysloglev'] : "0"
                    })(
                        <Select onChange={ this.onChangeLoglevel.bind(this) } className="P-208">
                            <Option value="0">None</Option>
                            <Option value="1">Debug</Option>
                            <Option value="2">Info</Option>
                            <Option value="3">Warning</Option>
                            <Option value="4">Error</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className={ this.state.aSendlog } label={< span > {
                    callTr("a_19126")
                } < Tooltip title = {callTipsTr("Send SIP Log")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("sendlog", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.sendlog)
                    })(
                        <Checkbox className="P-1387"/>
                    )}
                </FormItem>
                <FormItem label={(
                    <span>
                        {callTr("a_12201")}
                        <Tooltip title={callTipsTr("Syslog Filter")}>
                            <Icon type="question-circle-o"/>
                        </Tooltip>
                    </span>
                )}>
                    {getFieldDecorator('syslogfilter', {
                        rules: [],
                        initialValue: this.props.itemValues['syslogfilter']
                    })(<Input className="P-22129"/>)}
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
        getItemValues: Actions.getItemValues,
        setItemValues: Actions.setItemValues
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(SyslogForm));
