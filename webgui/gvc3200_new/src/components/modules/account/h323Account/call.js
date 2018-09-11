import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { connect } from 'react-redux'
import * as Store from '../../../entry'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Icon, Tooltip, Select, Button, Checkbox, Upload, message } from "antd";
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items = new Array;

class CallForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList:[]
        }
    }

    handlePvalue = () => {
        req_items = [];
        req_items.push(
            this.getReqItem("autoanswer", "25048", ""),   
            this.getReqItem("h225alive", "25058", ""),    
            this.getReqItem("h245alive", "25057", ""),
            this.getReqItem("enablertdr", "25060", "")
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
                this.props.setItemValues(req_items, values, 1);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const itemValues = this.props.itemValues;
        if (this.isEmptyObject(this.props.itemValues)) {
            return null;
        }
       
        let itemList =
            <Form>
                <FormItem className="select-item" label={(<span>{callTr("a_autoans")}&nbsp;<Tooltip title={this.tips_tr("Auto Answer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('autoanswer', {
                        initialValue: this.props.itemValues['autoanswer'] ? this.props.itemValues['autoanswer'] : "0"
                    })(
                        <Select className={"P-25048"}>
                            <Option value="0">{callTr("a_no")}</Option>
                            <Option value="1">{callTr("a_yes")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_enableh225keepalive")}&nbsp;<Tooltip title={this.tips_tr("？？")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('h225alive', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['h225alive'])
                    })(<Checkbox className={"P-25058"} />)
                    }
                </FormItem>     
                <FormItem label={(<span>{callTr("a_enableh245keepalive")}&nbsp;<Tooltip title={this.tips_tr("？？")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('h245alive', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['h245alive'])
                    })(<Checkbox className={"P-25057"} />)
                    }
                </FormItem>  
                <FormItem label={(<span>{callTr("a_enableRTDR")}&nbsp;<Tooltip title={this.tips_tr("??")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('enablertdr', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['enablertdr'])
                    })(<Checkbox className={"P-25060"} />)
                    }
                </FormItem> 
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
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

export default connect(mapStateToProps)(Enhance(CallForm));