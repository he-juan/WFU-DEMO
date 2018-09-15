import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Tooltip, Icon, Input, Select, Button } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;



class SiptlsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type1: "password",
            type2: "password"
        }
    }
    handlePwdVisible = (i) => {
        
        this.setState({ [`type${i}`]: this.state[`type${i}`] == "password" ? "text" : "password" });
    }
    checkPwd1 = (rules, value, callback) => {
        if(value && value !== this.props.form.getFieldValue('newlock')){
            callback(this.props.callTr("a_samepwd"))
        }else {
            callback()
        }

    }
    handleDelete = () => {
        this.props.delLockPwd();
    }
    checkPwd2 = (rules, value, callback) => {
        let form = this.props.form
        if(form.getFieldValue('renewlock') != '') {
            form.validateFields(['renewlock'], {force: true});
        }
        callback();
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
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
            if (err) return false;
            this.props.saveLockPwd(values['newlock'], () => {
                this.props.form.resetFields();
            });
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_9690")}<Tooltip title={callTipsTr("？？")}><Icon type="question-circle-o" /></Tooltip></span>}>
                    <Button type="default" size="default" onClick={() => this.handleDelete()}>{callTr("a_21")}</Button>
                </FormItem>
                <FormItem label={<span>{callTr("a_9688")}<Tooltip title={callTipsTr("？？")}><Icon type="question-circle-o" /></Tooltip></span>}>
                    {getFieldDecorator("newlock", {
                        initialValue: '',
                        rules: [
                            {
                                required: true, 
                                message: callTr("tip_require")
                            },
                            {
                                pattern: /^\d{6}$/,
                                message: callTr("a_9670")
                            },
                            {
                                validator: this.checkPwd2
                            }
                        ]
                    })(
                        <Input type={this.state.type1} 
                            suffix={<Icon type="eye" className={this.state.type1} onClick={() => {this.handlePwdVisible(1)}} />} />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_9689")}<Tooltip title={callTipsTr("？？")}><Icon type="question-circle-o" /></Tooltip></span>}>
                    {getFieldDecorator("renewlock", {
                        initialValue: '',
                        rules: [
                            {
                                required: true, 
                                message: callTr("tip_require")
                            },
                            {
                                validator: this.checkPwd1
                            }
                        ]
                    })(
                        <Input type={this.state.type2} 
                            suffix={<Icon type="eye" className={this.state.type2} onClick={() => {this.handlePwdVisible(2)}} />} />
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>;

        let hideItem = this.props.hideItem;
        for (let i = hideItem.length - 1; hideItem[i] != undefined && i >= 0; i--) {
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
        saveLockPwd: Actions.saveLockPwd,
        delLockPwd: Actions.delLockPwd
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(SiptlsForm);
