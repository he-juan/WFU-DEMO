import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Icon, Tooltip, Select, Button } from "antd";
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items = new Array;

class CallForm extends React.Component {
    constructor(props) {
        super(props);
    }

    handlePvalue = () => {
        req_items = [];
        req_items.push(
            this.getReqItem("autoansidle", "425", ""),
            this.getReqItem("default_layout_mode_1","29170","")
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
               <FormItem className = "select-item"　 label={(<span>{callTr("a_19141")}&nbsp;<Tooltip title={this.tips_tr("Auto Answer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('autoansidle', {
                        initialValue: this.props.itemValues['autoansidle'] ? this.props.itemValues['autoansidle'] : "0"
                        })(
                            <Select className={"P-425"}>
                                <Option value="0">{callTr("a_6")}</Option>
                                <Option value="1">{callTr("a_5")}</Option>
                            </Select>
                   )}
          　　　</FormItem>
                <FormItem className = "select-item"　 label={(<span>{callTr("a_12233")}&nbsp;<Tooltip title={this.tips_tr("Common Layout Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('default_layout_mode_1', {
                        initialValue: this.props.itemValues['default_layout_mode_1'] ? this.props.itemValues['default_layout_mode_1'] : "0"
                        })(
                            <Select className={"P-default_layout_mode_1"}>
                                <Option value="0">{callTr("a_10031")}</Option>
                                <Option value="1">{callTr("a_10025")}</Option>
                                <Option value="2">{callTr("a_10070")}</Option>
                                <Option value="3">{callTr("a_10037")}</Option>
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
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(Enhance(CallForm));
