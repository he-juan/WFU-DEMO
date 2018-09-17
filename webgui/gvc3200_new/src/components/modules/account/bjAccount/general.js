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
            this.getReqItem("accountactive", "501", ""),
            this.getReqItem("name", "507", ""),
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
                    })(<Checkbox className={"P-501"}/>)
                    }
               </FormItem>
               <FormItem label={(<span>{callTr("a_alias")}&nbsp;<Tooltip title={this.tips_tr("Name")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('name', {
                       rules: [{
                          max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['name']
                       })(
                       <Input type="text" className={"P-507"}/>
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
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(Enhance(GeneralForm));
