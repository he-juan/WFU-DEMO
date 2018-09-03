import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Checkbox, Select, Button} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"aemode", "pvalue":"915", "value":""},
                    {"name":"hdmimode", "pvalue":"hdmi_mode", "value":""},
                    {"name":"disrj9autodtc", "pvalue":"22132", "value":""},
                    {"name":"USB", "pvalue":"22036", "value":""},
                    {"name":"SD", "pvalue":"22035", "value":""},
                    {"name":"Camera", "pvalue":"22236", "value":""},
                    ];

class InterfaceForm extends Component {
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
               /* if(values.Camera==true){
                    values.Camera=this.props.itemValues['Camera']
                }else{
                    values.Camera=2
                }*/
                values.USB=!values.USB
                values.SD=!values.SD
                values.Camera=!values.Camera
                this.props.setItemValues(req_items, values);
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_aemode")}<Tooltip title={callTipsTr("AE Mode")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("aemode", {
                        initialValue: itemvalue['aemode'] ? itemvalue['aemode'] : "0"
                    })(
                        <Select className="P-915">
                            <Option value="0">{callTr("a_modebright")}</Option>
                            <Option value="1">{callTr("a_modedark")}</Option>
                        </Select>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_hdmimode")}<Tooltip title={callTipsTr("HDMI Control")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("hdmimode", {
                        initialValue: itemvalue['hdmimode'] ? itemvalue['hdmimode'] : "1"
                    })(
                        <Select className="P-hdmi_mode">
                            <Option value="0">{callTr("a_close")}</Option>
                            <Option value="1">{callTr("a_disori")}</Option>
                            <Option value="2">{callTr("a_disoppo")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_disrj9autodtc")}<Tooltip title={callTipsTr("Disable RJ9 Headset Auto Detect")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disrj9autodtc", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disrj9autodtc'])
                    })(
                        <Checkbox className="P-22132"/>
                    )}
                </FormItem>
                {this.props.oemId==70?<FormItem label={<span>{callTr("USB")}<Tooltip title={callTipsTr("USB")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator("USB", {
                            valuePropName: 'checked',
                            initialValue: !parseInt(itemvalue['USB'])
                        })(
                            <Checkbox className="P-22036"/>
                        )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                    </FormItem>:null}
                {this.props.oemId==70?<FormItem label={<span>{callTr("SD")}<Tooltip title={callTipsTr("SD")}><Icon type="question-circle-o"/></Tooltip></span>}>
                {getFieldDecorator("SD", {
                    valuePropName: 'checked',
                    initialValue: !parseInt(itemvalue['SD'])
                })(
                    <Checkbox className="P-22035"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                    </FormItem>:null}
                {this.props.oemId==70?<FormItem label={<span>{callTr("Camera")}<Tooltip title={callTipsTr("Camera")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("Camera", {
                        valuePropName: 'checked',
                        initialValue: !parseInt(itemvalue['Camera'])
                    })(
                        <Checkbox className="P-22236"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>:null}
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
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
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    oemId: state.oemId,
})

export default connect(mapStateToProps)(InterfaceForm);
