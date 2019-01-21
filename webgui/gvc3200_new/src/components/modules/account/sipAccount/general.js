import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance";
import { FormattedHTMLMessage } from 'react-intl'
import { Form, Layout, Input, Icon, Tooltip, Checkbox, Select, Button } from "antd";
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items = new Array;
const nvram = {
    // 常规
    'accountactive' : "271",       // 账号激活
    'accountname' : "270",         // 账号名称
    'sipserver' : "47",           // SIP服务器
    'secsipserver': "602",        // 备用SIP服务器
    'thirdsipserver': "1702",     // 第三SIP服务器
    'userid' : "35",              // 用户ID
    'authid' : "36",              // 认证ID
    'authpwd' : "34",             // 验证密码
    'name' : "3",                 // 显示名
    'teluri' : "63",              // 电话URI
    'vmuserid' : "33",            // 语音信箱接入号
};

class GeneralForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pwdstatus:Array(16).fill('password'),
        }
    }

    handlePvalue = () => {
         req_items = [];
         req_items.push(
             this.getReqItem("accountactive", nvram["accountactive"], ""),
             this.getReqItem("accountname", nvram["accountname"], ""),
             this.getReqItem("sipserver", nvram["sipserver"], ""),
             this.getReqItem("secsipserver", nvram["secsipserver"], ""),
             this.getReqItem("thirdsipserver", nvram["thirdsipserver"], ""),
             this.getReqItem("userid", nvram["userid"], ""),
             this.getReqItem("authid", nvram["authid"], ""),
            //  this.getReqItem("authpwd", nvram["authpwd"], ""),
             this.getReqItem("name", nvram["name"], ""),
             this.getReqItem("teluri", nvram["teluri"], ""),
             this.getReqItem("vmuserid", nvram["vmuserid"], ""),
         );
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {

        });
    }


    handlePwdVisible = () => {
        let pwdstatus = this.state.pwdstatus;
        pwdstatus = pwdstatus == "password" ? "text" : "password";
        this.setState({pwdstatus: pwdstatus});
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed or selected account changed
            if (this.props.activeKey != nextProps.activeKey) {

                this.props.getItemValues(this.handlePvalue(), (values) => {

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
          if (!err) {
              let req_items = this.handlePvalue()
              if(this.props.form.getFieldValue("authpwd")){
                  req_items.push(this.getReqItem("authpwd", nvram["authpwd"], ""),)
              }
              for (let key in values) {
                  if(values[key] == undefined) {
                      values[key] = ""
                  }
              }
              this.props.setItemValues(req_items, values, 1);
          }
        });
     }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        if(this.isEmptyObject(this.props.itemValues)) {
            return null;
        }

        let itemList =
           <Form onSubmit={this.handleSubmit}>
               <FormItem label={(<span>{callTr("a_1119")}&nbsp;<Tooltip title= {this.tips_tr("Account Active")} ><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('accountactive', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['accountactive'])
                    })(<Checkbox className={"P-" + nvram["accountactive"]} />)
                    }
               </FormItem>
               <FormItem label={(<span>{callTr("a_1120")}&nbsp;<Tooltip title={this.tips_tr("Account Name")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('accountname', {
                        rules: [{ max:64, message: callTr("a_19632"), whitespace: true }],
                        initialValue: this.props.itemValues['accountname'] ? this.props.itemValues['accountname'] : ""
                    })(<Input className={"P-" + nvram["accountname"]} />)
                    }
               </FormItem>
               <FormItem label={(<span>{callTr("a_23536")}&nbsp;<Tooltip title={this.tips_tr("SIP Server")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('sipserver', {
                       rules: [{
                         max:64,message: callTr("max_length64"),
                       },{
                         validator: (data, value, callback) => {
                           this.checkaddressPath(data, value, callback)
                         }
                     }],
                     initialValue: this.props.itemValues['sipserver']
                     })(
                       <Input type="text" id="sipserver" className={"P-" + nvram["sipserver"]} />
                 )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16055")}&nbsp;<Tooltip title={this.tips_tr("SIP User ID")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('secsipserver', {
                            rules: [{
                                max:64,message: callTr("max_length64"),
                            },{
                                validator: (data, value, callback) => {
                                this.checkaddressPath(data, value, callback)
                                }
                            }],
                            initialValue: this.props.itemValues['secsipserver']
                            })(
                            <Input type="text" id="secsipserver" className={"P-" + nvram["secsipserver"]} />
                    )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_19168")}&nbsp;<Tooltip title={this.tips_tr("SIP User ID")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('thirdsipserver', {
                            rules: [{
                                max:64,message: callTr("max_length64"),
                            },{
                                validator: (data, value, callback) => {
                                this.checkaddressPath(data, value, callback)
                                }
                            }],
                            initialValue: this.props.itemValues['thirdsipserver']
                            })(
                            <Input type="text" id="thirdsipserver" className={"P-" + nvram["thirdsipserver"]} />
                    )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_1122")}&nbsp;<Tooltip title={this.tips_tr("SIP User ID")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('userid', {
                       rules: [{
                          max:64,message: callTr("max_length64"),
                        }],
                        initialValue: this.props.itemValues['userid']
                        })(
                          <Input type="text" id="userid" className={"P-" + nvram["userid"]} />
                    )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_1123")}&nbsp;<Tooltip title={this.tips_tr("SIP Authentication ID")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   <Input type="text" name = "authid" style= {{display:"none"}} disabled autoComplete = "off"/>
                   {getFieldDecorator('authid', {
                       rules: [{
                          max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['authid']
                       })(
                       <Input type="text" name="authid" className={"P-" + nvram["authid"]} />
                   )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_1124")}&nbsp;<Tooltip title={this.tips_tr("SIP Authentication Password")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    <Input type={this.state.pwdstatus.toString()} name = "authpwd" style= {{display:"none"}} disabled autoComplete = "off"/>
                   {getFieldDecorator('authpwd', {
                       rules: [{
                          max:64,message: callTr("max_length64"),
                       }],
                       initialValue: "" //this.props.itemValues['authpwd']
                       })(
                       <Input type={this.state.pwdstatus} id = "authpwd" name = "authpwd" className={"P-" + nvram["authpwd"]} suffix={<Icon type="eye" className={this.state.pwdstatus} onClick={this.handlePwdVisible} />}/>
                   )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_1126")}&nbsp;<Tooltip title={this.tips_tr("Display Name")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('name', {
                       rules: [{
                          max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['name']
                       })(
                       <Input type="text" id="name" className={"P-" + nvram["name"]} />
                   )}
               </FormItem>

              <FormItem label={(<span>{callTr("a_1125")}&nbsp;<Tooltip title={this.tips_tr("Voice Mail Access Number")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('vmuserid', {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['vmuserid']
                   })(
                       <Input type="text" id="vmuserid" className={"P-" + nvram["vmuserid"]} />
                   )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_16056")}&nbsp;<Tooltip title={this.tips_tr("Tel URI")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('teluri', {
                       initialValue: this.props.itemValues['teluri'] || "0"
                   })(
                       <Select>
                           <Option value="0">{callTr("a_39")}</Option>
                           <Option value="1">{callTr("a_16065")}</Option>
                           <Option value="2">{callTr("a_40")}</Option>
                       </Select>
                   )}
               </FormItem>
              <FormItem>
                  <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
              </FormItem>
        </Form>;
        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;

    }
}

const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    product: state.product
})

export default connect(mapStateToProps)(Enhance(GeneralForm));
