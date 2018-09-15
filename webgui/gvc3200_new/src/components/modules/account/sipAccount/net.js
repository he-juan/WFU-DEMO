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
    // 网络
    'outbp' : "48",               // 出局代理
    'secoutbp' : "2333",          // 备用出局代理
    'usednssrv' : "103",          // DNS模式
    'natstun' : "52",             // NAT检测
    'proxy' : "197"               // 使用代理
};

class NetForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pwdstatus:Array(16).fill('password'),
        }
    }

    handlePvalue = () => {
         req_items = [];
         req_items.push(
             this.getReqItem("outbp", nvram["outbp"], ""),
             this.getReqItem("secoutbp", nvram["secoutbp"], ""),
             this.getReqItem("usednssrv", nvram["usednssrv"], ""),
             this.getReqItem("natstun", nvram["natstun"], ""),
             this.getReqItem("proxy", nvram["proxy"], "")
         );
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            
        });
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
               <FormItem label={(<span>{callTr("a_16057")}&nbsp;<Tooltip title={this.tips_tr("Outbound Proxy")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                  {getFieldDecorator('outbp', {
                      rules: [{
                          validator: (data, value, callback) => {
                              this.checkaddressPath(data, value, callback)
                          }
                       }],
                       initialValue: this.props.itemValues['outbp']
                       })(
                          <Input type="text" id="outbp" className={"P-" + nvram["outbp"]}/>
                  )}
              </FormItem>
              <FormItem label={(<span>{callTr("a_16058")}&nbsp;<Tooltip title={this.tips_tr("Secondary Outbound Proxy")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('secoutbp', {
                      rules: [{
                          max:64,message: callTr("max_length64"),
                       },{
                          validator: (data, value, callback) => {
                              this.checkaddressPath(data, value, callback)
                         }
                       }],
                       initialValue: this.props.itemValues['secoutbp']
                       })(
                          <Input type="text" id="secoutbp" className={"P-" + nvram["secoutbp"]}/>
                  )}
              </FormItem>
              <FormItem className = "select-item"  label={(<span>{callTr("a_16059")}&nbsp;<Tooltip title={this.tips_tr("DNS Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('usednssrv', {
                       initialValue: this.props.itemValues['usednssrv'] ? this.props.itemValues['usednssrv'] : "0"
                       })(
                           <Select className={"P-" + nvram["usednssrv"]}>
                               <Option value="0">A Record</Option>
                               <Option value="1">SRV</Option>
                               <Option value="2">NAPTR/SRV</Option>
                           </Select>
                  )}
         　　　</FormItem>
              
              <FormItem className = "select-item"  label={(<span>{callTr("a_16060")}&nbsp;<Tooltip title={this.isWP8xx() ? this.tips_tr("NAT Traversal for WP800") : this.tips_tr("NAT Traversal")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                  {getFieldDecorator('natstun', {
                       initialValue: this.props.itemValues['natstun'] ? this.props.itemValues['natstun'] : "0"
                       })(
                           <Select className={"P-" + nvram["natstun"]}>
                               <Option value="0">NAT NO</Option>
                               <Option value="1">STUN</Option>
                               <Option value="2">{callTr("a_16064")}</Option>
                               <Option style={{display:this.isWP8xx() ? 'none' : 'block' }} value="3">UPnP</Option>
                               <Option value="4">{callTr("a_9047")}</Option>
                               <Option value="5">OpenVPN</Option>
                           </Select>
                  )}
        　　 　</FormItem>
              <FormItem  label={(<span>{callTr("a_16061")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Proxy-Require")} />}><Icon type="question-circle-o" /></Tooltip></span>)} >
                  {getFieldDecorator('proxy', {
                      rules: [{
                          max:64,message: callTr("max_length64"),
                      }],
                      initialValue: this.props.itemValues['proxy']
                      })(
                         <Input type="text" id="proxy" className={"P-" + nvram["proxy"]}/>
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

export default connect(mapStateToProps)(Enhance(NetForm));
