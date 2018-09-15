import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance";
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Form, Tooltip, Icon, Input, Button, Select} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"bsauthtype", "pvalue":"22054", "value":""},
                    {"name":"server", "pvalue":"1591", "value":""},
                    {"name":"port", "pvalue":"1592", "value":""},
                    {"name":"actionpath", "pvalue":"2937", "value":""},
                    {"name":"userid", "pvalue":"22034", "value":""},
                    {"name":"uname", "pvalue":"1593", "value":""},
                    {"name":"pwd", "pvalue":"1594", "value":""},
                    {"name":"loginpwd", "pvalue":"22103", "value":""},
                    {"name":"bsmaxhits", "pvalue":"22014", "value":""},
                    {"name":"bsorders", "pvalue":"bs_contacts_order", "value":""}];

class MovedOptions extends Component {
    constructor(props){
        super(props);
    }

    selectOption = (e) => {
        /*only one option can be selected*/
        if(e.target.className == "sub-option-active"){
            e.target.className = "sub-option";
        }else {
            let options = e.target.parentNode.childNodes;
            for(let i = 0; i < options.length; i++){
                if(options[i].className == "sub-option-active"){
                    options[i].className = "sub-option";
                    break;
                }
            }

            e.target.className = "sub-option-active";
        }
    }

    optionMoved = (type) => {
        let optionorder = [], seloption, optionsdom, optionindex;
        if(document.getElementsByClassName("sub-option-active").length == 0){
            return false;
        }else{
            optionsdom = document.getElementsByClassName("option-container")[0].childNodes;
            seloption = document.getElementsByClassName("sub-option-active")[0].id.substring(0, 1);

            for(let i = 0; i < optionsdom.length; i++){
                let optionvalue = optionsdom[i].id.substring(0, 1);
                optionorder.push(optionvalue);
                if(optionvalue == seloption)
                    optionindex = i;
            }
        }

        if(type == "up"){
            if(optionindex > 0){
                let temp = optionorder[optionindex];
                optionorder[optionindex] = optionorder[optionindex - 1];
                optionorder[optionindex - 1] = temp;
            }
        }else{
            if(optionindex < optionorder.length - 1){
                let temp = optionorder[optionindex];
                optionorder[optionindex] = optionorder[optionindex + 1];
                optionorder[optionindex + 1] = temp;
            }
        }

        let optionstring = "";
        for(let i = 0; i < optionorder.length; i++){
            if(i == 0)
                optionstring += optionorder[i];
            else
                optionstring += "," + optionorder[i];
        }
        this.props.renderOptions(optionstring);
    }

    render() {
        const options = this.props.options;
        const callTr = this.props.callTr;

        return (
            <div className="options-component">
                <div className="option-container">
                    {
                        options.map((option, i) => {
                            return (
                                <div className='sub-option' id={`${option.key}-sub-option`} key={option.key} onClick={this.selectOption}>
                                    {callTr(option.name)}
                                </div>
                            )
                        })
                    }
                </div>
                <div className="operate-buttons">
                    <Button type="button" className="sip-btn-o" onClick={this.optionMoved.bind(this, "up")}>
                        <Icon type="up-square-o" style={{fontSize: 16, color: '#08c'}}/>
                        {callTr("a_up")}
                    </Button>
                    <Button type="button" className="sip-btn-o" onClick={this.optionMoved.bind(this, "down")}>
                        <Icon type="down-square-o" style={{fontSize: 16, color: '#08c'}}/>
                        {callTr("a_down")}
                    </Button>
                </div>
            </div>
        )
    }
}

let options = [];
const optionname = ['a_typeop2', 'a_typegroupcm', 'a_typeop1', 'a_typeentercm', 'a_typeop3', 'a_typeop9'];

class XsiForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            visible: {type1: "display-block", type2: "display-hidden"},
            pwdtype1: "password",
            pwdtype2: "password",
        }
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {
            this.changeLoginType(values['bsauthtype']);
        });
        this.props.readHideConfig((msgs) => {
            this.props.form.setFieldsValue({
                bsupdateinterval: msgs.headers['bsinterval']
            });
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items, (values) => {
                    this.changeLoginType(values['bsauthtype']);
                });
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
                this.props.writeHideConfig(2, values['bsupdateinterval']);
            }
        });
    }

    renderOptions = (optionorder) => {
        optionorder = optionorder.split(",");
        options = [];
        for(let i = 0; i < 6; i++){
            options.push({ "key": optionorder[i], "name": optionname[parseInt(optionorder[i])] });
        }

        this.props.form.setFieldsValue({
            bsorders: optionorder,
        });
    }

    changeLoginType = (value) => {
        if(value == "1"){
            this.setState({
                visible: {type1: "display-hidden", type2: "display-block"}
            });
        }else{
            this.setState({
                visible: {type1: "display-block", type2: "display-hidden"}
            });
        }
    }

    handlePwdVisible1 = () => {
        this.setState({pwdtype1: this.state.pwdtype1 == "password" ? "text" : "password"});
    }

    handlePwdVisible2 = () => {
        this.setState({pwdtype2: this.state.pwdtype2 == "password" ? "text" : "password"});
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        let itemvalue = this.props.itemValues;
        if(itemvalue["bsorders"] != undefined){
            if(itemvalue["bsorders"] == undefined || itemvalue["bsorders"] == "")
                itemvalue["bsorders"] = "0,1,2,3,4,5";
            let optionorder = itemvalue["bsorders"].split(",");
            for(let i = 0; i < 6; i++){
                options.push({ "key": optionorder[i], "name": optionname[parseInt(optionorder[i])] });
            }
        }

        let itemList = 
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_bsauthtype")}<Tooltip title={callTipsTr("Authentication Type")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("bsauthtype", {
                        initialValue: itemvalue['bsauthtype'] ? itemvalue['bsauthtype'] : "0"
                    })(
                        <Select onChange={this.changeLoginType} className="P-22054">
                            <Option value="0">{callTr("a_bsauthsip")}</Option>
                            <Option value="1">{callTr("a_logincre")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_19191")}<Tooltip title={callTipsTr("Server")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("server", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.checkUrlPath(data, value, callback);
                            }
                        }],
                        initialValue: itemvalue['server']
                    })(
                        <Input className="P-1591"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_1173")}<Tooltip title={callTipsTr("Port ")}><Icon type="question-circle-o"/></Tooltip></span>}>
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
                        <Input className="P-1592"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_actionpath")}<Tooltip title={callTipsTr("Action Path")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("actionpath", {
                        initialValue: itemvalue['actionpath']
                    })(
                        <Input className="P-2937"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_bsuserid")}<Tooltip title={callTipsTr("User ID")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("userid", {
                        initialValue: itemvalue['userid']
                    })(
                        <Input className="P-22034"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_authid")}<Tooltip title={callTipsTr("Username")}><Icon type="question-circle-o"/></Tooltip></span>}
                    className={this.state.visible.type1}>
                    {getFieldDecorator("uname", {
                        initialValue: itemvalue['uname']
                    })(
                        <Input className="P-1593"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_authpwd")}<Tooltip title={callTipsTr("Password ")}><Icon type="question-circle-o"/></Tooltip></span>}
                    className={this.state.visible.type1}>
                    {getFieldDecorator("pwd", {
                        initialValue: itemvalue['pwd']
                    })(
                        <Input type={this.state.pwdtype1} className="P-1594"
                            suffix={<Icon type="eye" className={this.state.pwdtype1} onClick={this.handlePwdVisible1} />}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_bspassword")}<Tooltip title={callTipsTr("Password ")}><Icon type="question-circle-o"/></Tooltip></span>}
                    className={this.state.visible.type2}>
                    {getFieldDecorator("loginpwd", {
                        initialValue: itemvalue['loginpwd']
                    })(
                        <Input type={this.state.pwdtype2} className="P-22103"
                            suffix={<Icon type="eye" className={this.state.pwdtype2} onClick={this.handlePwdVisible2} />}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_bsupdateinterval")}<Tooltip title={callTipsTr("BroadSoft Directory & Call Logs Update Interval")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("bsupdateinterval",{
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 60, 2147483647)
                            }
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_bsmaxhits")}<Tooltip title={callTipsTr("BroadSoft Directory Hits")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("bsmaxhits", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 1, 1000)
                            }
                        }],
                        initialValue: itemvalue['bsmaxhits']
                    })(
                        <Input className="P-22014"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_bsorders")}<Tooltip title={callTipsTr("BroadSoft Directory Order")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("bsorders", {
                        initialValue: itemvalue['bsorders']
                    })(
                        <MovedOptions options={options} callTr={callTr} renderOptions={this.renderOptions} className="P-bs_contacts_order"/>
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

function mapDispatchToProps(dispatch) {
  var actions = {
      readHideConfig: Actions.readHideConfig,
      writeHideConfig: Actions.writeHideConfig
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(XsiForm));
