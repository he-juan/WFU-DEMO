import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Checkbox, Button, Select} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const pvaluearray = {
    "feakey": ['2325', '2425', '2525', '2625', '2725', '2825', '51625', '51725', '51825', '51925', '52025', '52125', '52225', '52325', '52425', '52525'],
    "bscallpark": ['2388', '2488', '2588', '2688', '2788', '2888', '51688', '51788', '51888', '51988', '52088', '52188', '52288', '52388', '52488', '52588'],
    "confuri": ['2318', '2418', '2518', '2618', '2718', '2818', '51618', '51718', '51818', '51918', '52018', '52118', '52218', '52318', '52418', '52518'],
    "bcallcenter": ['2341', '2441', '2541', '2641', '2741', '2841', '51641', '51741', '51841', '51941', '52041', '52141', '52241', '52341', '52441', '52541'],
    "hotelevent": ['2342', '2442', '2542', '2642', '2742', '2842', '51642', '51742', '51842', '51942', '52042', '52142', '52242', '52342', '52442', '52542'],
    "centerstatus": ['2343', '2443', '2543', '2643', '2743', '2843', '51643', '51743', '51843', '51943', '52043', '52143', '52243', '52343', '52443', '52543']
}

let req_items = [];

class CallForm extends Component {
    constructor(props){
        super(props);

		this.state = {
			disabled: true,
		}

        this.reqItem();
    }

    reqItem = (curacct) => {
        req_items = [];
        if (!curacct) {
            curacct = this.props.curAcct;
        }
        curacct = parseInt(curacct) - 1;

        req_items.push({"name": "feakey", "pvalue": pvaluearray["feakey"][curacct], "value": ""},
                        {"name": "bscallpark", "pvalue": pvaluearray["bscallpark"][curacct], "value": ""},
                        {"name": "confuri", "pvalue": pvaluearray["confuri"][curacct], "value": ""},
                        {"name": "bcallcenter", "pvalue": pvaluearray["bcallcenter"][curacct], "value": ""},
                        {"name": "hotelevent", "pvalue": pvaluearray["hotelevent"][curacct], "value": ""},
                        {"name": "centerstatus", "pvalue": pvaluearray["centerstatus"][curacct], "value": ""});
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {
            if(values['bcallcenter'] == "1"){
                this.setState({
                    disabled: false
                });
            }
        });
    }

	handleCallCenterChange = (e) => {
		this.setState({
			disabled: e.target.checked ? false : true,
		});

        this.props.form.setFieldsValue({
            feakey: e.target.checked ? "1" : "0",
        });
	}

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed
            if (this.props.activeKey != nextProps.activeKey
                || nextProps.curAcct != this.props.curAcct) {
                this.props.getItemValues(this.reqItem(nextProps.curAcct), (values) => {
                    if(values['bcallcenter'] == "1") {
                        this.setState({
                            disabled: false
                        });
                    }
                });
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }

        if(nextProps.curAcct != this.props.curAcct || nextProps.callctrdisable != this.props.callctrdisable){
            this.setState({
                disabled: nextProps.callctrdisable
            });
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
                <FormItem label={<span>{callTr("a_feakey")}<Tooltip title={callTipsTr("Feature Key Synchronization")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("feakey", {
                        initialValue: itemvalue['feakey'] ? itemvalue['feakey'] : "0"
                    })(
                        <Select className={"P-" + pvaluearray["feakey"][curacct]}>
                            <Option value="0">{callTr("a_disable")}</Option>
                            <Option value="1">BroadSoft</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_bscallpark")}<Tooltip title={callTipsTr("Enable BroadSoft Call Park")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("bscallpark", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['bscallpark'])
                    })(
                        <Checkbox className={"P-" + pvaluearray["bscallpark"][curacct]}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_confuri")}<Tooltip title={callTipsTr("Conference URI")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("confuri", {
                        initialValue: itemvalue['confuri']
                    })(
                        <Input className={"P-" + pvaluearray["confuri"][curacct]}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_bcallcenter")}<Tooltip title={callTipsTr("BroadSoft Call Center")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("bcallcenter", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['bcallcenter'])
                    })(
                        <Checkbox onChange={this.handleCallCenterChange} className={"P-" + pvaluearray["bcallcenter"][curacct]}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_hotelevent")}<Tooltip title={callTipsTr("Hoteling Event")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("hotelevent", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['hotelevent'])
                    })(
                        <Checkbox disabled={this.state.disabled} className={"P-" + pvaluearray["hotelevent"][curacct]}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_centerstatus")}<Tooltip title={callTipsTr("Call Center Status")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("centerstatus", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['centerstatus'])
                    })(
                        <Checkbox disabled={this.state.disabled} className={"P-" + pvaluearray["centerstatus"][curacct]}/>
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
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(CallForm);
