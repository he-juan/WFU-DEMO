import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance";
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Checkbox, Button, Select} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const pvaluearray = {
    "enablesca": ['1363', '1365', '1367', '1369', '1371', '1373', '29613', '29615', '29617', '29619', '29621', '29623', '29625', '29627', '29629', '29631'],
    "enbargein": ['2337', '2437', '2537', '2637', '2737', '2837', '51637', '51737', '51837', '51937', '52037', '52137', '52237', '52337', '52437', '52537'],
    "audofillcode": ['2335', '2435', '2535', '2635', '2735', '2835', '51635', '51735', '51835', '51935', '52035', '52135', '52235', '52335', '52435', '52535'],
    "callcode": ['2336', '2436', '2536', '2636', '2736', '2836', '51636', '51736', '51836', '51936', '52036', '52136', '52236', '52336', '52436', '52536'],
    "lineseizetime": ['2313', '2413', '2513', '2613', '2713', '2813', '51613', '51713', '51813', '51913', '52013', '52113', '52213', '52313', '52413', '52513']
}

let req_items = [];

class ScaForm extends Component {
    constructor(props){
        super(props);

        this.reqItem();
    }

    reqItem = (curacct) => {
        req_items = [];
        if (!curacct) {
            curacct = this.props.curAcct;
        }
        curacct = parseInt(curacct) - 1;

        req_items.push({"name": "enablesca", "pvalue": pvaluearray["enablesca"][curacct], "value": ""},
                        {"name": "enbargein", "pvalue": pvaluearray["enbargein"][curacct], "value": ""},
                        {"name": "audofillcode", "pvalue": pvaluearray["audofillcode"][curacct], "value": ""},
                        {"name": "callcode", "pvalue": pvaluearray["callcode"][curacct], "value": ""},
                        {"name": "lineseizetime", "pvalue": pvaluearray["lineseizetime"][curacct], "value": ""});
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed
            if (this.props.activeKey != nextProps.activeKey
                || nextProps.curAcct != this.props.curAcct) {
                this.props.getItemValues(this.reqItem(nextProps.curAcct));
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.props.setItemValues(req_items, values, 1);
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;
        let curacct = parseInt(this.props.curAcct) - 1;

        let itemList = 
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_enablesca")}<Tooltip title={callTipsTr("Enable SCA (Shared Call Appearance)")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("enablesca", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['enablesca'])
                    })(
                        <Checkbox className={"P-" + pvaluearray["enablesca"][curacct]}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_enbargein")}<Tooltip title={callTipsTr("Enable BargeIn")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("enbargein", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['enbargein'])
                    })(
                        <Checkbox className={"P-" + pvaluearray["enbargein"][curacct]}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_audofillcode")}<Tooltip title={callTipsTr("Auto-filling Pickup Feature Code")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("audofillcode", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['audofillcode'])
                    })(
                        <Checkbox className={"P-" + pvaluearray["audofillcode"][curacct]}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_callcode")}<Tooltip title={callTipsTr("Pickup Feature Code")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("callcode", {
                        initialValue: itemvalue['callcode']
                    })(
                        <Input className={"P-" + pvaluearray["callcode"][curacct]}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_lineseize")}<Tooltip title={callTipsTr("Line-seize Timeout")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("lineseizetime", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 15, 60)
                            }
                        }],
                        initialValue: itemvalue['lineseizetime']
                    })(
                        <Input className={"P-" + pvaluearray["lineseizetime"][curacct]}/>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
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
    enterSave: state.enterSave
})

export default connect(mapStateToProps)(Enhance(ScaForm));
