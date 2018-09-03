import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Form, Tooltip, Icon, Input, Select, Button, Modal, Slider, Checkbox} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

const req_items = [{"name":"headsettx", "pvalue":"1301", "value":""},
                    {"name":"headsetrx", "pvalue":"1302", "value":""},
                    {"name":"earphonetx", "pvalue":"22002", "value":""},
                    {"name":"earphonerx", "pvalue":"22003", "value":""},
                    {"name":"headsetctrl", "pvalue":"22113", "value":""},
                    {"name":"ehsheadset", "pvalue":"1487", "value":""},
                    {"name":"handsettx", "pvalue":"1464", "value":""},
                    {"name":"handsetrx", "pvalue":"2906", "value":""},
                    {"name":"vcardtx", "pvalue":"vcom_tx", "value":""},
                    {"name":"vcardrx", "pvalue":"vcom_rx", "value":""},
                    {"name":"handseteqrx", "pvalue":"handsetequrx", "value":""}];

class VoiceForm extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
        this.props.getMaxVolume();
        this.props.getCurVolume((vol) => {
            //console.log(this.refs.volslider);
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                volslider:vol
            });
        });
    }

    checkHandsetTx = (callback) => {
        confirm({
            content: this.props.callTr("a_handsetrxtip"),
            okText: this.props.callTr("a_ok"),
            cancelText: this.props.callTr("a_cancel"),
            onOk() {
                callback();
            }
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items);
                this.props.getMaxVolume();
                this.props.getCurVolume((vol) => {
                    const { setFieldsValue } = this.props.form;
                    setFieldsValue({
                        volslider:vol
                    });
                });
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                if(values['handsettx'] == "2" || values['handsetrx'] == "2"){
                    this.checkHandsetTx(() => {
                        this.props.setItemValues(req_items, values);
                    });
                }
                else{
                    this.props.setItemValues(req_items, values);
                }
            }
        });
    }

    onVolAfterChange = (value) => {
        this.props.setVolume(value);
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;
        const headsettxarray = ["-24", "-18", "-12", "-6", "0", "+6", "+12", "+18", "+24"];
		const headsetrxarray = ["-9", "-6", "0", "+6", "+9"];
        const earphonetxarray = ["-24", "-18", "-12", "-6", "0", "6", "12", "18", "24"];
        const earphonerxarray = ["-9", "-6", "0", "6", "9"];
		const vcardtxarray = ["-18", "-15", "-12", "-9", "-6", "-3", "0", "+3", "+6", "+9", "+12", "+15", "+18"];

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_headsettx")}<Tooltip title={callTipsTr("RJ9 Headset TX Gain")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("headsettx", {
                        initialValue: itemvalue['headsettx']
                    })(
                        <Select className="P-1301">
                            {
                                headsettxarray.map((headset, i) => {
                                    return <Option key={i} value={parseInt(headset)} >{headset}</Option>
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_headsetrx")}<Tooltip title={callTipsTr("RJ9 Headset RX Gain")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("headsetrx", {
                        initialValue: itemvalue['headsetrx']
                    })(
                        <Select className="P-1302">
                            {
                                headsetrxarray.map((headset, i) => {
                                    return <Option key={i} value={parseInt(headset)} >{headset}</Option>
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_earphonetx")}<Tooltip title={callTipsTr("3.5mm Earphone TX Gain")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("earphonetx", {
                        initialValue: itemvalue['earphonetx']
                    })(
                        <Select className="P-22002">
                            {
                                earphonetxarray.map((earphonetx, i) => {
                                    return <Option key={i} value={parseInt(earphonetx)} >{earphonetx}</Option>
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_earphonerx")}<Tooltip title={callTipsTr("3.5mm Earphone RX Gain")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("earphonerx", {
                        initialValue: itemvalue['earphonerx']
                    })(
                        <Select className="P-22003">
                            {
                                earphonerxarray.map((earphonerx, i) => {
                                    return <Option key={i} value={parseInt(earphonerx)} >{earphonerx}</Option>
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_ehsheadset")}<Tooltip title={callTipsTr("Headset Type")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("ehsheadset", {
                        initialValue: itemvalue['ehsheadset'] ? itemvalue['ehsheadset'] : "0"
                    })(
                        <Select className="P-1487">
                            <Option value="0">{callTr("a_normalheadset")}</Option>
                            <Option value="1">{callTr("a_plantehs")}</Option>
                        </Select>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_headsetctrl")}<Tooltip title={callTipsTr("Enable 3.5mm Headset Control")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("headsetctrl", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['headsetctrl'])
                    })(
                        <Checkbox className="P-22113"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_handsettx")}<Tooltip title={callTipsTr("Handset TX Gain")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("handsettx", {
                        initialValue: itemvalue['handsettx']
                    })(
                        <Select className="P-1464">
                            <Option value="0">0</Option>
                            <Option value="1">-6</Option>
                            <Option value="2">+6</Option>
                        </Select>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_handsetrx")}<Tooltip title={callTipsTr("Handset RX Gain")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("handsetrx", {
                        initialValue: itemvalue['handsetrx'] ? itemvalue['handsetrx'] : "0"
                    })(
                        <Select className="P-2906">
                            <Option value="0">0</Option>
                            <Option value="1">-6</Option>
                            <Option value="2">+6</Option>
                        </Select>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_vcardtx")}<Tooltip title={callTipsTr("Virtual Sound Card TX Gain")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vcardtx", {
                        initialValue: itemvalue['vcardtx'] ? itemvalue['vcardtx'] : "0"
                    })(
                        <Select className="P-vcom_tx">
                            {
                                vcardtxarray.map((vcard, i) => {
                                    return <Option key={i} value={parseInt(vcard)} >{vcard}</Option>
                                })
                            }
                        </Select>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_vcardrx")}<Tooltip title={callTipsTr("Virtual Sound Card RX Gain")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vcardrx", {
                        initialValue: itemvalue['vcardrx'] ? itemvalue['vcardrx'] : "0"
                    })(
                        <Select className="P-vcom_rx">
                            {
                                vcardtxarray.map((vcard, i) => {
                                    return <Option key={i} value={parseInt(vcard)} >{vcard}</Option>
                                })
                            }
                        </Select>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_handseteqrx")}<Tooltip title={callTipsTr("Handset Equalizer RX")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("handseteqrx", {
                        initialValue: itemvalue['handseteqrx'] ? itemvalue['handseteqrx'] : "0"
                    })(
                        <Select className="P-handsetequrx">
                            <Option value="0">{callTr("a_default")}</Option>
                            <Option value="1">{callTr("a_eqgentle")}</Option>
                            <Option value="2">{callTr("a_eqfidelity")}</Option>
                        </Select>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_adjustvol")}</span>}>
                    {getFieldDecorator("volslider")(
                        <Slider min={0} max={parseInt(this.props.maxVolume)} defaultValue={parseInt(this.props.curVolume)} onAfterChange={this.onVolAfterChange} />
                    )}
                </FormItem>
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
    maxVolume: state.maxVolume,
    curVolume: state.curVolume
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        getMaxVolume: Actions.getMaxVolume,
        getCurVolume: Actions.getCurVolume,
        setVolume: Actions.setVolume
    }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VoiceForm);
