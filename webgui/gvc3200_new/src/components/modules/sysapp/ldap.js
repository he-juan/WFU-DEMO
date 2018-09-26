import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import { FormattedHTMLMessage } from 'react-intl'
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as optionsFilter from "../../template/optionsFilter"
import { Form,Layout, Tabs, Tooltip, Icon, Input, Checkbox, Button, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const Content = Layout;
const TabPane = Tabs.TabPane;
let req_items = new Array;
let acctname_item = ['a_12','270','417','517','617','1717','1817',"50617","50717","50817","50917","51017","51117","51217","51317","51417","51517"];

class LdapForm extends Component {
    constructor(props){
        super(props);
        this.state = {pwdstatus1:"password"}
    }

    handlePvalue = () => {
         let getReqItem = this.props.getReqItem
         req_items = []
         req_items.push(
             getReqItem("connectmode", "8037", ""),
             getReqItem("serveraddr", "8020", ""),
             getReqItem("port", "8021", ""),
             getReqItem("basedn", "8022", ""),
             getReqItem("ldapusername", "8023", ""),
             getReqItem("ldappassword", "8024", ""),
             getReqItem("nameattr", "8028", ""),
             getReqItem("numattr", "8029", ""),
             getReqItem("mailattr", "8038", ""),
             getReqItem("namefilter", "8026", ""),
             getReqItem("numberfilter", "8025", ""),
             getReqItem("mailfilter", "8039", ""),
             getReqItem("searchfieldfilter", "ldap_search_field", ""),
             getReqItem("disnameattr", "8030", ""),
             getReqItem("maxhits", "8031", ""),
             getReqItem("timeout", "8032", ""),
             getReqItem("lookupdial", "8034", ""),
             getReqItem("lookupcall", "8035", ""),
             getReqItem("ldapdftacct", "22039", "")
         );
        if(this.isWP8xx()) {
            acctname_item.splice(3,acctname_item.length-1)
        }
         for(var i = 1 ;i<acctname_item.length;i++) {
             req_items.push(getReqItem("name"+i, acctname_item[i], ""))
         }
         return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue())
    }

    checkMixhits = (rule, value, callback) => {
        const form = this.props.form;
        if(value < 0 || value > 4000){
            callback(this.props.callTr("tip_maxhits"));
        }
        callback()
    }

    handlePwdVisible1 = () => {
        this.setState({pwdstatus1: this.state.pwdstatus1 == "password" ? "text" : "password"});
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              let req_items = this.handlePvalue();
              req_items.splice(18,req_items.length-1)
              this.props.setItemValues(req_items, values);
          }
        });
     }

    render() {
        const {getFieldDecorator} = this.props.form;
        const [callTr,tips_tr,checkUrlPath] = [this.props.callTr,this.props.tips_tr,this.props.checkUrlPath];
        this.isWP8xx() && (acctname_item.splice(3,acctname_item.length-1))
        let itemList =
            <Form hideRequiredMark>
                <FormItem className = "select-item" label={(<span>{callTr("a_15022")}&nbsp;<Tooltip title={tips_tr("Connection Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('connectmode', {
                        initialValue: this.props.itemValues['connectmode'] ? this.props.itemValues['connectmode'] : "0"
                        })(
                            <Select className="P-8037">
                            <Option value="0">LDAP</Option>
                            <Option value="1">LDAPS</Option>
                            </Select>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_6755")}&nbsp;<Tooltip title={tips_tr("Server Address")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('serveraddr', {
                        rules: [{
                            max:64,message: callTr("a_19632"),
                        },{
                            validator: (data, value, callback) => {
                                checkUrlPath(data, value, callback)
                            }
                          }],
                          initialValue: this.props.itemValues['serveraddr']
                        })(
                            <Input type="text" className="P-8020"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_ptt_multiPort")}<Tooltip title={tips_tr("Port  ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("port", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.props.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.props.range(data, value, callback, 0, 65535)
                            }
                        }],
                        initialValue: this.props.itemValues['port']
                    })(
                        <Input className="P-8021"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_6757")}&nbsp;<Tooltip title={tips_tr("Base DN")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('basedn', {
                        rules: [{
                            max:64,message: callTr("a_19632"),
                        }],
                        initialValue: this.props.itemValues['basedn']
                        })(
                            <Input type="text" className="P-8022"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_username")}&nbsp;<Tooltip title={tips_tr("LDAP User Name")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    <Input type="text" name = "ldapusername" style= {{display:"none"}} disabled autocomplete = "off"/>
                    {getFieldDecorator('ldapusername', {
                        rules: [{
                            max:64,message: callTr("a_19632")
                        }],
                        initialValue: this.props.itemValues['ldapusername']
                        })(
                            <Input type="text" name = "ldapusername" className="P-8023"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_password")}&nbsp;<Tooltip title={tips_tr("LDAP Password")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    <Input type={this.state.pwdstatus1} name = "ldappassword" style= {{display:"none"}} disabled autocomplete = "off"/>
                    {getFieldDecorator('ldappassword', {
                        rules: [{
                            max:64,message: callTr("a_19632"),
                        }],
                        initialValue: this.props.itemValues['ldappassword']
                        })(
                            <Input type={this.state.pwdstatus1} name="ldappassword" className="P-8024" suffix={<Icon type="eye" className={this.state.pwdstatus1} onClick={this.handlePwdVisible1} />}/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_6764")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={tips_tr("LDAP Name Attributes")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('nameattr', {
                        rules: [{
                            max:64,message: callTr("a_19632"),
                        }],
                        initialValue: this.props.itemValues['nameattr']
                        })(
                            <Input type="text" className="P-8028"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_6765")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={tips_tr("LDAP Number Attributes")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('numattr', {
                        rules: [{
                            max:64,message: callTr("a_19632"),
                        }],
                        initialValue: this.props.itemValues['numattr']
                        })(
                            <Input type="text" className="P-8029"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_6766")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={tips_tr("LDAP Mail Attributes")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('mailattr', {
                        rules: [{
                            max:64,message: callTr("a_19632"),
                        }],
                        initialValue: this.props.itemValues['mailattr']
                        })(
                            <Input type="text" className="P-8038"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_6774")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={tips_tr("LDAP Name Filter")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('namefilter', {
                        rules: [{
                            max:64,message: callTr("a_19632"),
                        }],
                        initialValue: this.props.itemValues['namefilter']
                        })(
                            <Input type="text" className="P-8026"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_6775")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={tips_tr("LDAP Number Filter")} />}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('numberfilter', {
                        rules: [{
                            max:64,message: callTr("a_19632"),
                        }],
                        initialValue: this.props.itemValues['numberfilter']
                        })(
                            <Input type="text" className="P-8025"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_mailfilter")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={tips_tr("LDAP Mail Filter")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('mailfilter', {
                        rules: [{
                            max:64,message: callTr("a_19632"),
                        }],
                        initialValue: this.props.itemValues['mailfilter']
                        })(
                            <Input type="text" className="P-8039"/>
                    )}
                </FormItem>
                {/*<FormItem label={(<span>{callTr("a_searchfieldfilter")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={tips_tr("Search Field Filter")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('searchfieldfilter', {
                        initialValue: this.props.itemValues['searchfieldfilter'] ? this.props.itemValues['searchfieldfilter'] : "0"
                    })(
                        <Select className="P-ldap_search_field">
                            <Option value="0">{callTr("a_allfilter")}</Option>
                            <Option value="1">{callTr("a_namefilter2")}</Option>
                            <Option value="2">{callTr("a_numberfilter2")}</Option>
                            <Option value="3">{callTr("a_mailfilter2")}</Option>
                        </Select>
                    )}
                </FormItem>*/}
                <FormItem label={(<span>{callTr("a_6767")}&nbsp;<Tooltip title={tips_tr("LDAP Displaying Name Attributes")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('disnameattr', {
                        rules: [{
                            max:64,message: callTr("a_19632"),
                        }],
                        initialValue: this.props.itemValues['disnameattr']
                        })(
                            <Input type="text" className="P-8030"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_6760")}<Tooltip title={tips_tr("Max Hits")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("maxhits", {
                        rules: [{
                            validator: this.checkMixhits,
                        }],
                        initialValue: this.props.itemValues['maxhits']
                    })(
                        <Input type="text" className="P-8031"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_searchtimeout")}&nbsp;<Tooltip title={tips_tr("Search Timeout")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('timeout', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.props.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.props.range(data, value, callback, 1, 4000)
                            }
                        }],
                        initialValue: this.props.itemValues['timeout']
                        })(
                            <Input type="text" className="P-8032"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_lookupdial")}&nbsp;<Tooltip title={tips_tr("LDAP Lookup For Dial")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('lookupdial', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['lookupdial'])
                        })(
                            <Checkbox className="P-8034"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_lookupcall")}&nbsp;<Tooltip title={tips_tr("LDAP Lookup For Incoming Call")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('lookupcall', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['lookupcall'])
                        })(
                            <Checkbox className="P-8035"/>
                    )}
                </FormItem>
                <FormItem className = "select-item" label={(<span>{callTr("a_ldapdftacct")}&nbsp;<Tooltip title={tips_tr("LDAP Dialing Default Account")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('ldapdftacct', {
                        initialValue: this.props.itemValues['ldapdftacct'] ? this.props.itemValues['ldapdftacct'] : "-1"
                        })(
                            <Select className="P-22039">
                            {
                                acctname_item.map((val,i,arr) => {
                                    if(i==16 && this.props.ipvtExist == '1') {
                                       return <Option value={`${i-1}`} style={{display:'none'}}></Option>
                                    } else {
                                        return <Option value={`${i-1}`}>{this.props.itemValues["name" + i] ? this.props.itemValues["name" + i] : i == 0 ? callTr("a_12") : callTr("a_301") + ` ${i}`}</Option>
                                    }
                                })
                            }
                            </Select>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>;

        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length-1; hiddenOptions[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }

        return itemList;
    }
}
const SysappLdapForm = Form.create()(Enhance(LdapForm));
class Ldap extends Component {
    constructor(props){
        super(props);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(this.props.curLocale != nextProps.curLocale) {
            return true
        }
        let curItemValues = [],nextItemValues = []
        for(let key in this.props.itemValues) {
            curItemValues.push(this.props.itemValues[key])
        }
        for(let key in nextItemValues.itemValues) {
            nextItemValues.push(nextItemValues.itemValues[key])
        }
        if (curItemValues.length != nextItemValues.length) {
            return true
        }
        let result = curItemValues.some((curItem,index,arr) => {
            return curItem != nextItemValues[index]
        })
        return result
    }

    render(){
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("appset_ldap")}</div>
                <div className="config-tab" style={{'minHeight': this.props.mainHeight,'paddingTop': '20px'}}>
                    <SysappLdapForm {...this.props} callTr={this.tr} tips_tr={this.tips_tr} checkUrlPath={this.checkUrlPath} digits={this.digits} range={this.range} getReqItem={this.getReqItem}/>
                </div>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    product : state.product,
    ipvtExist: state.ipvtExist,
    mainHeight: state.mainHeight,
    enterSave: state.enterSave,
    userType: state.userType
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        setItemValues:Actions.setItemValues,
        getItemValues:Actions.getItemValues
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Ldap));
