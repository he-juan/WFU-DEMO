import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Select, Button} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"essidname", "pvalue":"7812", "value":""},
                    {"name":"essidpwd", "pvalue":"7830", "value":""},
                    {"name":"hiddenauthmode", "pvalue":"7814", "value":""}];

class SecurityForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            type: "password",
            validstatus: "",
            help: "",
            pwdisplay: "display-hidden"
        }
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {
            this.props.form.setFieldsValue({
                essidname: values['essidname'],
                hiddenauthmode: values['hiddenauthmode'],
                essidpwd: values['essidpwd']
            })
            if(values['hiddenauthmode'] != "0"){
                this.setState({pwdisplay: "display-block"})
            }
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items, (values) => {
                    this.props.form.setFieldsValue({
                        essidname: values['essidname'],
                        hiddenauthmode: values['hiddenauthmode'],
                        essidpwd: values['essidpwd']
                    });
                    this.checkEssidPwd(values.hiddenauthmode)
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
    }

    checkPwdLength = (e) => {
        let value = e.target.value;
        let hiddenauthmode = this.props.form.getFieldValue("hiddenauthmode");

        if(hiddenauthmode == "2" && value.length < 8){
            this.setState({
                validstatus: "error",
                help: "a_pwdlengthlimit"
            });
        }else{
            this.setState({
                validstatus: "",
                help: ""
            });
        }
    }

    checkEssidPwd = (value) => {
        let essidpwd = this.props.form.getFieldValue("essidpwd");
        if(value == "0"){
            this.setState({pwdisplay: "display-hidden"})
        }else{
            this.setState({pwdisplay: "display-block"})
        }

        if(value == "2" && essidpwd.length < 8){
            this.setState({
                validstatus: "error",
                help: "a_pwdlengthlimit"
            });
        }else{
            this.setState({
                validstatus: "",
                help: ""
            });
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err && this.state.validstatus != "error"){
                if(values.hiddenauthmode == '0') {
                    values.essidpwd = ''
                    this.props.form.setFieldsValue({'essidpwd': ''})
                }
                this.props.setItemValues(req_items, values);
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;

        return(
            <Form hideRequiredMark>
                <FormItem label={<span>ESSID<Tooltip title={callTipsTr("ESSID ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("essidname", {
                        // initialValue: itemvalue['essidname']
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_hiddenauthmode")}<Tooltip title={callTipsTr("Security Mode for Hidden SSID")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("hiddenauthmode", {
                        // initialValue: itemvalue['hiddenauthmode'] ? itemvalue['hiddenauthmode'] : "0"
                    })(
						<Select onChange={this.checkEssidPwd}>
							<Option value="0">{callTr("a_20")}</Option>
							<Option value="1">WEP</Option>
							<Option value="2">WPA/WPA2 PSK</Option>
							{/*<Option value="3">802.1X EAP</Option>*/}
						</Select>
                    )}
                </FormItem>
                <FormItem validateStatus={this.state.validstatus} help={callTr(this.state.help)} className={this.state.pwdisplay}
                    label={<span>{callTr("a_6759")}<Tooltip title={callTipsTr("Password  ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("essidpwd", {
                        // initialValue: itemvalue['essidpwd'],
                    })(
                        <Input type={this.state.type} onChange={this.checkPwdLength}
                            suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />} />
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(SecurityForm);
