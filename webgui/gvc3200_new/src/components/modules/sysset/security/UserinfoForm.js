import React, { Component, PropTypes } from 'react'
import * as optionsFilter from "../../../template/optionsFilter"
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Select, Button} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

var g_actype = "user";

class PasswordRank extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const visible = this.props.visible;
        const rank = this.props.rank;
        const callTr = this.props.callTr;

        switch (rank) {
            case 1:
                return(
                    <div className="pwdrank" style={ visible ? {"display": "block"} : {"display": "none"} }>
                        <div className="pwdrankchild red"></div>
                        <div className="pwdrankchild"></div>
                        <div className="pwdrankchild"></div>
                        <div className="pwdranklabel">{callTr("a_weak")}</div>
                    </div>
                )
                break;
            case 2:
                return(
                    <div className="pwdrank" style={ visible ? {"display": "block"} : {"display": "none"} }>
                        <div className="pwdrankchild yellow"></div>
                        <div className="pwdrankchild yellow"></div>
                        <div className="pwdrankchild"></div>
                        <div className="pwdranklabel">{callTr("a_medium")}</div>
                    </div>
                )
                break;
            case 3:
                return(
                    <div className="pwdrank" style={ visible ? {"display": "block"} : {"display": "none"} }>
                        <div className="pwdrankchild green"></div>
                        <div className="pwdrankchild green"></div>
                        <div className="pwdrankchild green"></div>
                        <div className="pwdranklabel">{callTr("a_strong")}</div>
                    </div>
                )
                break;
        }
    }
}

class UserinfoForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            adminconfirmDirty: false,
            userconfirmDirty: false,
            pwdstatus0: "password",
            pwdstatus1: "password",
            pwdstatus2: "password",
            pwdstatus3: "password",
            pwdstatus4: "password",
            adminvisible: false,
            uservisible: false,
            adminrank: 1,
            userrank: 1,
        };
    }

    componentDidMount = () => {
        g_actype = $.cookie('type');
    }

    checkCurPwd = (curpwd_input, cb) => {
        let value = curpwd_input; 
        if(value != ""){
            const username = this.props.userType;
            this.props.cb_check_current_pwd(username, value, (msgs) => {
                if(msgs.headers["response"] == "Success"){
                    if(msgs.headers["same"] == 0){
                        this.props.form.setFields({
                            curadmipwd: {
                                value: value,
                                errors: [new Error(this.props.callTr("a_pwdnotsame"))],
                            }
                        })
                    }
                    else{
                        cb();
                    }
                }
            });
        }
        else{
            return false;
        }
    }

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if(rule.role == "admin"){
            if(this.state.adminconfirmDirty){
                form.validateFields(['adminpasswd2'], {force: true});
            }
        }
        else{
            if(this.state.userconfirmDirty){
                form.validateFields(['userpasswd2'], {force: true});
            }
        }
        callback();
    }

    checkPassword = (rule, value, callback) =>    {
        const form = this.props.form;

        if(rule.role == "admin"){
            if(value && !this.state.adminconfirmDirty){
                this.setState({
                    adminconfirmDirty:true
                })
            }
            if(value !== form.getFieldValue('adminpasswd'))
                callback(this.props.callTr("a_samepwd"));
            else
                callback();
        }
        else{
            if(value && !this.state.userconfirmDirty){
                this.setState({
                    userconfirmDirty:true
                })
            }
            if(value !== form.getFieldValue('userpasswd'))
                callback(this.props.callTr("a_samepwd"));
            else
                callback();
        }
    }

    checkPassword2 = (rule,value,callback) => {
        if(value==""){
            callback();
            return
        }
        if(value.length < 6 && value.length>0){
            callback(this.props.callTr("pwdRule0"));
            return
        }
        if (/^[0-9]*$/.test(value) || /^[a-z]*$/.test(value) || /^[A-Z]*$/.test(value)) {
            callback(this.props.callTr("pwdRule1"));
            return;
        }
        let hasNumber=false
        for(let j=0;j<value.length;j++){
            if(/^[0-9]$/.test(value[j])){
                hasNumber=true;
                break
            }
        }
        if(!hasNumber){
            callback(this.props.callTr("pwdRule1"));
            return;
        }
        callback();
    }

    checkCharacter = (rule, value, callback) => {
        /* add limitation for input characters only ascii code between 33-126 are allowed */
        if(value != "" && value != undefined){
            let reg = new RegExp("^[\x21-\x7E]+$");
            if(!reg.test( value ))
                callback(this.props.callTr("tip_error"));
        }
        callback();
    }


    /*to control password visible or secret*/
    handlePwdVisible = (order) => {
        this.setState({[`pwdstatus${order}`]: this.state[`pwdstatus${order}`] == "password" ? "text" : "password"});
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.activeKey == "1" && this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        const form = this.props.form;
        const username = this.props.userType;

        let req_items = [];
        form.validateFieldsAndScroll((err, values) => {
            if(!err){
                const curpwd_input = form.getFieldValue("curadmipwd");
                const adminpwd_input = form.getFieldValue("adminpasswd");
                const userpwd_input = form.getFieldValue("userpasswd");
                if(username == "admin"){
                    if(adminpwd_input == "" && userpwd_input == ""){
                        this.props.promptMsg("ERROR", "a_adminoruserpwdempty");
                        return;
                    }
                    else{
                        if(adminpwd_input != "")
                            req_items = [{"name":"adminpasswd", "pvalue":"2", "value":""}];

                        if(userpwd_input != "")
                            req_items.push({"name":"userpasswd", "pvalue":"196", "value":""});
                    }
                }else{
                    if(userpwd_input == ""){
                        this.props.promptMsg("ERROR", "a_userpwdempty");
                        return;
                    }
                    else{
                        req_items = [{"name":"userpasswd", "pvalue":"196", "value":""}];
                    }
                }

                this.checkCurPwd(curpwd_input, () => {
                    this.props.setItemValues(req_items, values, 0, () => {
                        this.props.cb_check_password(g_actype, (msgs)=> {
                            if( msgs.headers["needchange"] == 0 ){
                                $.cookie("needchange", "0", {path: '/', expires:10});
                                this.props.passTipStyle("display-hidden");
                            }else{
                                $.cookie("needchange", "1", {path: '/', expires:10});
                                this.props.passTipStyle("display-block");
                            }
                        });
                        form.resetFields()
                        this.setState({
                            adminvisible: false,
                            uservisible: false
                        })
                    });
                })
                
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;
        const logintype = this.props.userType;
        let itemList =
            <Form className="pwdform" hideRequiredMark>
                <FormItem label={<span>{logintype == "admin" ? callTr("a_curadminpwd") : callTr("a_curuserpwd")}<Tooltip title={callTipsTr("Current Admin Password")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("curadmipwd", {
                        rules: [{
                            required: true, message: callTr("tip_require")
                        }],
                        initialValue: ""
                    })(
                        <Input maxLength="32" type={this.state.pwdstatus0} className="P-null"
                            suffix={<Icon type="eye" className={this.state.pwdstatus0} onClick={this.handlePwdVisible.bind(this, 0)} />} />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_adminpwd")}<Tooltip title={callTipsTr("Admin Password")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("adminpasswd", {
                        rules: [{
                            role: "admin", validator: this.checkConfirm,
                        }, {
                            validator: this.checkCharacter
                        },{
                            validator: this.checkPassword2
                        }],
                        initialValue: ""
                    })(
                        <Input maxLength="32" type={this.state.pwdstatus1} className="P-2"
                            suffix={<Icon type="eye" className={this.state.pwdstatus1} onClick={this.handlePwdVisible.bind(this, 1)} />} />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_conadminpwd")}<Tooltip title={callTipsTr("Confirm Admin Password")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("adminpasswd2", {
                        rules: [{
                            role: "admin", validator: this.checkPassword,
                        }, {
                            validator: this.checkCharacter
                        }],
                        initialValue: ""
                    })(
                        <Input maxLength="32" type={this.state.pwdstatus2}
                            suffix={<Icon type="eye" className={this.state.pwdstatus2} onClick={this.handlePwdVisible.bind(this, 2)} />} />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_userpwd")}<Tooltip title={callTipsTr("User Password")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("userpasswd", {
                        rules: [{
                            role: "user", validator: this.checkConfirm,
                        }, {
                            validator: this.checkCharacter
                        },{
                            validator: this.checkPassword2
                        }],
                        initialValue: ""
                    })(
                        <Input maxLength="32" type={this.state.pwdstatus3}
                            suffix={<Icon type="eye" className={this.state.pwdstatus3} onClick={this.handlePwdVisible.bind(this, 3)} />} />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_conuserpwd")}<Tooltip title={callTipsTr("Confirm User Password")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("userpasswd2", {
                        rules: [{
                            role: "user", validator: this.checkPassword,
                        }, {
                            validator: this.checkCharacter
                        }],
                        initialValue: ""
                    })(
                        <Input maxLength="32" type={this.state.pwdstatus4} className="P-196"
                            suffix={<Icon type="eye" className={this.state.pwdstatus4} onClick={this.handlePwdVisible.bind(this, 4)} />} />
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
                </FormItem>
            </Form> ;

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
        cb_check_password: Actions.cb_check_password,
        passTipStyle: Actions.passTipStyle,
        cb_check_current_pwd: Actions.cb_check_current_pwd
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserinfoForm);
