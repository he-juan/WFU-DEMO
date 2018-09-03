import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Select, Button} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"sslcer", "pvalue":"280", "value":""},
                    {"name":"sslpkey", "pvalue":"279", "value":""},
                    {"name":"sslpkpwd", "pvalue":"281", "value":""}];

class SiptlsForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            type: "password"
        }
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
    }

    handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
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
        const form = this.props.form;
        form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.props.setItemValues(req_items, values, 1, () => {
                    form.setFieldsValue({
                        sslcer: "",
                        sslpkey: ""
                    })
                });
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
                <FormItem label={<span>{callTr("a_sslcer")}<Tooltip title={callTipsTr("SIP TLS Certificate")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("sslcer", {
                        initialValue: ""
                    })(
                        <Input type="textarea" autosize={{minRows: 2, maxRows: 6}} className="P-280"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_sslpkey")}<Tooltip title={callTipsTr("SIP TLS Private Key")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("sslpkey", {
                        initialValue: ""
                    })(
                        <Input type="textarea" autosize={{minRows: 2, maxRows: 6}} className="P-279"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_sslpkpwd")}<Tooltip title={callTipsTr("SIP TLS Private Key Password")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("sslpkpwd", {
                        initialValue: itemvalue['sslpkpwd']
                    })(
                        <Input type={this.state.type} className="P-281"
                            suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />}/>
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

export default connect(mapStateToProps)(SiptlsForm);
