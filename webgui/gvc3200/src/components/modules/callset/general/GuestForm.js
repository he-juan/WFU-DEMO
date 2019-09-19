import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Checkbox, Select, Button} from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"publicmode", "pvalue":"22015", "value":""},
                    {"name":"publicmodeint", "pvalue":"22016", "value":""},
                    {"name":"logoutpin", "pvalue":"22019", "value":""}];



class GuestForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            type: "password",
            itemValues:[]
        }
    }

    handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values)=>{
            this.setState({itemValues: values});
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items, (values)=>{
                    this.setState({itemValues: values});
                });
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
        const itemvalue = this.state.itemValues;
        let itemList =
            <div>
                <Form hideRequiredMark>
                    <div className="blocktitle"><s></s>{callTr("a_guestsetting")}</div>
                    <FormItem label={<span>{callTr("a_publicmode")}<Tooltip title={callTipsTr("Guest Login")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator("publicmode", {
                            valuePropName: 'checked',
                            initialValue: parseInt(itemvalue['publicmode'])
                        })(
                            <Checkbox className={"P-22015"}/>
                        )}
                        <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                    </FormItem>
                    <FormItem label={<span>{callTr("a_publicmodeint")}<Tooltip title={callTipsTr("Guest Login Timeout")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator("publicmodeint", {
                            initialValue: itemvalue['publicmodeint'] ? itemvalue['publicmodeint'] : "0"
                        })(
                            <Select className={"P-22016"}>
    							<Option value="0">{callTr("a_42")}</Option>
    							<Option value="60">{"1 " + callTr("a_15007")}</Option>
    							<Option value="120">{"2 " + callTr("a_15008")}</Option>
    							<Option value="240">{"4 " + callTr("a_15008")}</Option>
    							<Option value="480">{"8 " + callTr("a_15008")}</Option>
    						</Select>
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_logoutpin")}<Tooltip title={callTipsTr("Guest Login PIN Code")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator("logoutpin", {
                            initialValue: itemvalue['logoutpin']
                        })(
                            <Input type={this.state.type} className={"P-22019"}
                                suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />} />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                    </FormItem>
                </Form>
            </div>;
        let hideItem = this.props.hideItem;
        React.Children.map(itemList.props.children,function(child){
            for (var i = hideItem.length - 1; i >= 0; i--) {
                child.props.children.splice(hideItem[i]+1, 1);
            }
        });
        return itemList;
    }
}

const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(GuestForm);
