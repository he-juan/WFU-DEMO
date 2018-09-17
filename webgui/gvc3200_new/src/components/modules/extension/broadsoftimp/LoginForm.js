import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance"
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Button} from "antd";
const FormItem = Form.Item;

const req_items = [{"name":"server", "pvalue":"6006", "value":""},
                    {"name":"port", "pvalue":"6005", "value":""},
                    {"name":"username", "pvalue":"2966", "value":""},
                    {"name":"password", "pvalue":"2967", "value":""}];

class LoginForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            type: "password",
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
        const itemvalue = this.props.itemValues;

        let itemList = 
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_19191")}<Tooltip title={callTipsTr("Server ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("server", {
                        initialValue: itemvalue['server']
                    })(
                        <Input className="P-6006"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_ptt_multiPort")}<Tooltip title={callTipsTr("Port   ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("port", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 65535)
                            }
                        }],
                        initialValue: itemvalue['port']
                    })(
                        <Input className="P-6005"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_username")}<Tooltip title={callTipsTr("Username ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("username", {
                        initialValue: itemvalue['username']
                    })(
                        <Input className="P-2966"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_password")}<Tooltip title={callTipsTr("Password   ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("password", {
                        initialValue: itemvalue['password']
                    })(
                        <Input type={this.state.type} className="P-2967"
                            suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />}/>
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
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(Enhance(LoginForm));
