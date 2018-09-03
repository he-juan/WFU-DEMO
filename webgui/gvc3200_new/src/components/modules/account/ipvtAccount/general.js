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
    }

    handlePvalue = () => {
        req_items = [];
        req_items.push(
            this.getReqItem("accountactive", "51501", ""),
            this.getReqItem("name", "51507", ""),
            this.getReqItem("siptranport", "51548", ""),
            this.getReqItem("accountname", "51517", "")
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

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              values['accountname'] = "IPVideoTalk"
              this.props.setItemValues(req_items, values,1);
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
           <Form>
               <FormItem label={(<span>{callTr("a_accountactive")}&nbsp;<Tooltip title={this.tips_tr("Account Active")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('accountactive', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['accountactive'])
                    })(<Checkbox className={"P-51501"}/>)
                    }
               </FormItem>

               <FormItem label={(<span>{callTr("a_name")}&nbsp;<Tooltip title={this.tips_tr("Name")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('name', {
                       rules: [{
                          max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['name']
                       })(
                       <Input type="text" className={"P-51507"}/>
                   )}
               </FormItem>
               <FormItem label={(<span>{callTr("a_curplans")}&nbsp;<Tooltip title={this.tips_tr("Current plans")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('curpackage', {
                       })(
                           <span id = "curpackagehtml">IPVideoTalk Pro<a href="http://www.ipvideotalk.com/pricing.html" id="viewpackage" target="_blank" style={{marginLeft:'20px'}}>{callTr("a_detail")}</a></span>
                   )}
               </FormItem>
               <FormItem className = "select-item"　 label={(<span>{callTr("a_siptranport")}&nbsp;<Tooltip title={this.tips_tr("SIP Transport ")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('siptranport', {
                        initialValue: Number(this.props.itemValues['siptranport']) ? this.props.itemValues['siptranport'] : "1"
                        })(
                            <Select className={"P-51548"}>
                                <Option value="1">TCP</Option>
                                <Option value="2">TLS</Option>
                            </Select>
                   )}
          　　　</FormItem>
              <FormItem>
                  <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
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
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(Enhance(GeneralForm));
