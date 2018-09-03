import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance"
import { connect } from 'react-redux'
import {Form, Tooltip, Modal, Input, Select, Button, Icon} from "antd"
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'

const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [
    {"name": "roaminggoodrssi", "pvalue": "22232", "value": ""},
    {"name": "roaminggoodinterval", "pvalue": "22230", "value": ""},
    {"name": "roamingpoorinterval", "pvalue": "22231", "value": ""}];

class RoamingForm extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items);
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
                this.props.setItemValues(req_items, values, 0, ()=>{
                    Modal.info({
                        content: <span dangerouslySetInnerHTML={{__html: this.props.callTr("a_wifirebooteffect")}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: this.props.callTr("a_ok")}}></span>,
                        onOk() {},
                    });
                });
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;

        return(
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_signalthreshold")}<Tooltip title={callTipsTr("Signal Threshold")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("roaminggoodrssi", {
                        rules: [{
                            required:true, message: callTr("tip_require")
                        }, {
                            validator: (data, value, callback) => {
                                this.checkdigits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, -100, -30)
                            }
                        }],
                        initialValue: this.props.itemValues['roaminggoodrssi'] ? this.props.itemValues['roaminggoodrssi'] : -70
                    })(
                        <Input className="P-22232" placeholder={this.tr("tip_signalthrholdrange")}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_roaminggoodinterval")}<Tooltip title={callTipsTr("Good Signal Scanning Interval")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("roaminggoodinterval", {
                        rules: [{
                             required:true, message: callTr("tip_require")
                        },{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 1, 65535)
                            }
                        }],
                        initialValue: this.props.itemValues['roaminggoodinterval'] ? this.props.itemValues['roaminggoodinterval'] : 1000
                    })(
                        <Input className="P-22230"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_roamingpoorinterval")}<Tooltip title={callTipsTr("Poor Signal Scanning Interval")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("roamingpoorinterval", {
                        rules: [{
                            required:true, message: callTr("tip_require")
                        },{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 1, 65535)
                            }
                        }],
                        initialValue: this.props.itemValues['roamingpoorinterval'] ? this.props.itemValues['roamingpoorinterval'] : 50
                    })(
                        <Input className="P-22231"/>
                    )}
                </FormItem>

                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
                </FormItem>
            </Form>);
    }
}

const mapStateToProps = (state) => ({
    activeKey: state.TabactiveKey,
    itemValues: state.itemValues,
    enterSave: state.enterSave,
})

function mapDispatchToProps(dispatch) {
    var actions = {
        promptMsg:Actions.promptMsg,
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(RoamingForm));
