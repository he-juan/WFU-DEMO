import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance";
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Checkbox, Select, Button, InputNumber} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"pagingbarge", "pvalue":"1566", "value":""},
                    {"name":"pagingpri", "pvalue":"1567", "value":""},
                    {"name":"pagingcodec", "pvalue":"1568", "value":""},
                    {"name":"mpenablevideo", "pvalue":"22031", "value":""},
                    {"name":"pagingvideocodec", "pvalue":"22024", "value":""},
                    {"name":"imgsize", "pvalue":"22025", "value":""},
                    {"name":"vbrate", "pvalue":"22026", "value":""},
                    {"name":"vfperrate", "pvalue":"22027", "value":""},
                    {"name":"protype", "pvalue":"22028", "value":""},
                    {"name":"h264payload", "pvalue":"22029", "value":""}];

class SettingForm extends Component {
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
                this.props.setItemValues(req_items, values, 1);
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
		const vbratearray = ["32", "64", "96", "128", "160", "192", "210", "256", "384", "512", "640", "768", "1024", "1280", "1536", "2048"];
        const itemvalue = this.props.itemValues;

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_pagingbarge")}<Tooltip title={callTipsTr("Paging Barge")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("pagingbarge", {
                        initialValue: itemvalue['pagingbarge'] ? itemvalue['pagingbarge'] : "0"
                    })(
                        <Select className="P-1566">
                            <Option value="0">{callTr("a_39")}</Option>
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                            <Option value="5">5</Option>
                            <Option value="6">6</Option>
                            <Option value="7">7</Option>
                            <Option value="8">8</Option>
                            <Option value="9">9</Option>
                            <Option value="10">10</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_pagingpri")}<Tooltip title={callTipsTr("Paging Priority Active")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("pagingpri", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['pagingpri'])
                    })(
                        <Checkbox className="P-1567"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_pagingcodec")}<Tooltip title={callTipsTr("Multicast Paging Codec")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("pagingcodec", {
                        initialValue: itemvalue['pagingcodec'] ? itemvalue['pagingcodec'] : "0"
                    })(
                        <Select className="P-1568">
                            <Option value="0">PCMU</Option>
                            <Option value="8">PCMA</Option>
                            <Option value="2">G726-32</Option>
                            <Option value="9">G722</Option>
                            <Option value="18">G729A/B</Option>
                            <Option value="98">iLBC</Option>
                            <Option value="123">Opus</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_mpenablevideo")}<Tooltip title={callTipsTr("Enable Multicast Paging Video")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("mpenablevideo", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['mpenablevideo'])
                    })(
                        <Checkbox className="P-22031"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_pagingvideocodec")}<Tooltip title={callTipsTr("Multicast Paging Video Codec")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("pagingvideocodec", {
                        initialValue: itemvalue['pagingvideocodec']
                    })(
                        <Select className="P-22024">
                            <Option value="99" selected="selected">H.264</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_mcimgsize")}<Tooltip title={this.props.product == 'GXV3380' ? callTipsTr("Multicast Paging Image Size") : callTipsTr("Multicast Paging Image Size_1")}>
                    <Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("imgsize", {
                        initialValue: itemvalue['imgsize']
                    })(
                        <Select className="P-22025">
                            <Option value="10" className={this.props.product == 'GXV3380' ? "display-block" : "display-hidden"}>
                                1080P
                            </Option>
                            <Option value="9">720P</Option>
                            <Option value="4">4CIF</Option>
                            <Option value="1">VGA</Option>
                            <Option value="5">CIF</Option>
                            <Option value="0">QVGA</Option>
                            <Option value="6">QCIF</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_mcvidbr")}<Tooltip title={callTipsTr("Multicast Paging Video Bit Rate")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vbrate", {
                        initialValue: itemvalue['vbrate']
                    })(
                        <Select className="P-22026">
                            {
                                vbratearray.map((vbrate, i) => {
                                    return <Option key={i} value={vbrate}>{vbrate + " kbps"}</Option>
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_mcvidfr")}<Tooltip title={callTipsTr("Video Frame Rate")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vfperrate", {
                        initialValue: itemvalue['vfperrate']
                    })(
                        <Select className="P-22027">
                            <Option value="15">{"15 " + callTr("a_frame")}</Option>
                            <Option value="25">{"25 " + callTr("a_frame")}</Option>
                            <Option value="30">{"30 " + callTr("a_frame")}</Option>
                            <Option value="29">{callTr("a_variable")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_mch264protype")}<Tooltip title={callTipsTr("Multicast Paging H.264 Profile Type")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("protype", {
                        initialValue: itemvalue['protype'] ? itemvalue['protype'] : "0"
                    })(
                        <Select className="P-22028">
                            <Option value="0">{callTr("a_16120")}</Option>
                            <Option value="1">{callTr("a_16121")}</Option>
                            <Option value="2">{callTr("a_16122")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_mch264payload")}<Tooltip title={callTipsTr("Multicast Paging H.264 Payload Type")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("h264payload", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 127)
                            }
                        }],
                        initialValue: itemvalue['h264payload']
                    })(
                        <Input className="P-22029"/>
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
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(Enhance(SettingForm));
