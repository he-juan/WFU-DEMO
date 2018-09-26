import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Input, Icon, Tooltip, Checkbox, Select, Button } from "antd";
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items = new Array;

class GeneralForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pwdstatus: 'password'
        }
    }

    handlePvalue = () => {
        req_items = [];
        req_items.push(
            this.getReqItem("accountactive", "25059", ""),
            this.getReqItem("enablegk", "25032", ""),
            this.getReqItem("enableh460", "25066", ""),
            this.getReqItem("gkdiscovermode", "25051", ""),
            this.getReqItem("userid", "25034", ""),
            this.getReqItem("authid", "25035", ""),
            this.getReqItem("authpwd", "25036", ""),
            // this.getReqItem("vmuserid", "626", ""),   // 语音信箱接入号
            this.getReqItem("regexp", "25054", ""),   // 注册期限
            this.getReqItem("localport", "25068", ""),　// H323本地端口
            this.getReqItem("symrtp", "25067", ""),　　　// 对称ＲＴＰ
            this.getReqItem("sipserver", "25033", ""),
        );
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue());
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue());
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }
    handlePwdVisible = () => {
        let status = this.state.pwdstatus
        this.setState({
            pwdstatus: status === 'password' ? 'text' : 'password'
        })
    }
    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.setItemValues(req_items, values, 1);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        if (this.isEmptyObject(this.props.itemValues)) {
            return null;
        }

        let itemList =
            <Form>
                <FormItem label={(<span>{callTr("a_1119")}&nbsp;<Tooltip title={this.tips_tr("Account Active")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('accountactive', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['accountactive'])
                    })(<Checkbox className={"P-25059"} />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_19120")}&nbsp;<Tooltip title={this.tips_tr("Enable GK")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('enablegk', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['enablegk'])
                    })(<Checkbox className={"P-25032"} />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_19204")}&nbsp;<Tooltip title={this.tips_tr("Enable H.460")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('enableh460', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['enableh460'])
                    })(<Checkbox className={"P-25066"} />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_19122")}&nbsp;<Tooltip title={this.tips_tr("GK Discover Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('gkdiscovermode', {
                        initialValue: this.props.itemValues['gkdiscovermode'] ? this.props.itemValues['gkdiscovermode'] : "0"
                    })(
                        <Select className="P-25051">
                            <Option value="0">{callTr("a_9047")}</Option>
                            <Option value="1">{callTr("a_1016")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_19117")}&nbsp;<Tooltip title={this.tips_tr("GK Site Number")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('userid', {

                        initialValue: this.props.itemValues['userid']
                    })(
                        <Input type="text" className="P-25034" />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_19118")}&nbsp;<Tooltip title={this.tips_tr("GK Authentication Username")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('authid', {

                        initialValue: this.props.itemValues['authid']
                    })(
                        <Input type="text" className="P-25035" />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_19119")}&nbsp;<Tooltip title={this.tips_tr("GK Authentication Password")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('authpwd', {
                       rules: [{
                          max:64,message: callTr("a_19632"),
                       }],
                       initialValue: this.props.itemValues['authpwd']
                       })(
                       <Input type={this.state.pwdstatus} id = "authpwd" name = "authpwd" className="P-25036" suffix={<Icon type="eye" className={this.state.pwdstatus} onClick={this.handlePwdVisible} />}/>
                   )}
               </FormItem>
               {/* <FormItem label={(<span>{callTr("a_1125")}&nbsp;<Tooltip title={this.tips_tr("Voice Mail Access Number")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('vmuserid', {

                        initialValue: this.props.itemValues['vmuserid']
                    })(
                        <Input type="text" className="P-626" />
                    )}
                </FormItem> */}
               <FormItem label={(<span>{callTr("a_16069")}&nbsp;<Tooltip title={this.tips_tr("Register Expiration")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('regexp', {

                        initialValue: this.props.itemValues['regexp']
                    })(
                        <Input type="text" className="P-25054" />
                    )}
                </FormItem>
               <FormItem label={(<span>{callTr("a_19210")}&nbsp;<Tooltip title={this.tips_tr("H.323 Local Port")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('localport', {

                        initialValue: this.props.itemValues['localport']
                    })(
                        <Input type="text" className="P-25068" />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16096")}&nbsp;<Tooltip title={this.tips_tr("Symmetric RTP")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('symrtp', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['symrtp'])
                    })(<Checkbox className={"P-25067"} />)
                    }
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>;
        let hideItem = this.props.hideItem;
        for (var i = hideItem.length - 1; i >= 0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;

    }
}

const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(Enhance(GeneralForm));
