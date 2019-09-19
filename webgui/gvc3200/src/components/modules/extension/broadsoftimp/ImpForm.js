import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Checkbox, Button, Select} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"bsimp", "pvalue":"2964", "value":""},
                    {"name":"bsacct", "pvalue":"2965", "value":""},
                    {"name":"autologin", "pvalue":"2968", "value":""},
                    {"name":"disnonxmpp", "pvalue":"2969", "value":""}];

class ImpForm extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount = () => {
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
            if(!err){
                this.props.setItemValues(req_items, values);
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues

        let itemList = 
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_bsimp")}<Tooltip title={callTipsTr("Enable BroadSoft IM&P")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("bsimp", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['bsimp'])
                    })(
                        <Checkbox className="P-2964"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_bsacct")}<Tooltip title={callTipsTr("Associated BroadSoft Account")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("bsacct", {
                        initialValue: itemvalue['bsacct'] ? itemvalue['bsacct'] : "0"
                    })(
                        <Select className="P-2965">
                        {
                            [...Array(this.props.maxAcctNum)].map((item, i) => {
                                return <Option value={i + ""}>{callTr("a_301") + (i+1)}</Option>
                            })
                        }
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16364")}<Tooltip title={callTipsTr("Auto Login")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("autologin", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['autologin'])
                    })(
                        <Checkbox className="P-2968"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_disnonxmpp")}<Tooltip title={callTipsTr("Display Non XMPP Contacts")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disnonxmpp", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disnonxmpp'])
                    })(
                        <Checkbox className="P-2969"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form> ;
        
        let hideItem = this.props.hideItem;
        for (let i = hideItem.length-1; hideItem[i] != undefined && i >= 0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    maxAcctNum: state.maxAcctNum,
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(ImpForm);
