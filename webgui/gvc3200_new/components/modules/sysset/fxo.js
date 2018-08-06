import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { Form, Layout, Button, Row, Tooltip, Checkbox, Icon, InputNumber, Input, Select, Radio } from 'antd';
const Content = Layout;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
let req_items;

class Fxo extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        req_items = new Array;
        req_items.push(
            this.getReqItem("acmodel", "899", ""),
            this.getReqItem("country_based", "864", ""),
            this.getReqItem("impedance_based", "849", ""),
            this.getReqItem("calleridscheme", "863", ""),
            this.getReqItem("enablecudis", "893", ""),
            this.getReqItem("cudisthreshold", "764", ""),
            this.getReqItem("enablepstn", "712", "")
        );
    }

    componentDidMount() {
        this.props.getItemValues(req_items);
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
        if(!err) {
            let values = this.props.form.getFieldsValue();
            this.props.setItemValues(req_items, values);
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">FXO</div>
                <Form className="configform" hideRequiredMark>
                    <FormItem label={<span>{this.tr("a_acmodel")}<Tooltip title={this.tips_tr("AC termination model")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator('acmodel', {
                            rules: [],
                            initialValue: this.props.itemValues.acmodel
                        })(
                            <RadioGroup>
                                <Radio value="0">{this.tr("a_country")}</Radio>
                                <Radio value="1">{this.tr("a_impedance")}</Radio>
                            </RadioGroup>
                        )}
                        <Icon title={this.tr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                    </FormItem>
                    <FormItem className="select-item" label={<span>{this.tr("a_countrybased")}<Tooltip title={this.tips_tr("Country based")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator('country_based', {
                            rules: [],
                            initialValue: this.props.itemValues["country_based"] ? this.props.itemValues["country_based"] : "0"
                        })(
                            <Select>
                                <Option value="0">USA</Option>
                                <Option value="1">AUSTRIA</Option>
                                <Option value="13">AUSTRALIA/NEW ZEALAND</Option>
                                <Option value="2">BELGIUM</Option>
                                <Option value="14">CHINA</Option>
                                <Option value="3">FINLAND</Option>
                                <Option value="4">FRANCE</Option>
                                <Option value="5">GERMANY</Option>
                                <Option value="6">GREECE</Option>
                                <Option value="7">ITALY</Option>
                                <Option value="8">JAPAN</Option>
                                <Option value="9">NORWAY</Option>
                                <Option value="10">SPAIN</Option>
                                <Option value="11">SWEDEN</Option>
                                <Option value="12">UK</Option>
                            </Select>
                        )}
                        <Icon title={this.tr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                    </FormItem>
                    <FormItem className="select-item" label={<span>{this.tr("a_impedancebased")}<Tooltip title={this.tips_tr("Impedance based")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator('impedance_based', {
                            rules: [],
                            initialValue: this.props.itemValues["impedance_based"] ? this.props.itemValues["impedance_based"] : "0"
                        })(
                            <Select>
                                <Option value="30">600R -- 600 ohms</Option>
                                <Option value="31-">600R -- 600 ohms + 2.16uF</Option>
                                <Option value="32">900R -- 900 ohms</Option>
                                <Option value="33-">900R -- 900 ohms + 2.16uF</Option>
                                <Option value="34">COMPLEX1 -- 220 ohms + (820 ohms || 115nF)</Option>
                                <Option value="35">COMPLEX2 -- 270 ohms + (750 ohms || 150nF)</Option>
                                <Option value="36">COMPLEX3 -- 370 ohms + (620 ohms || 310nF)</Option>
                                <Option value="37-">COMPLEX4 -- 600R, 270 ohms + (750 ohms || 150nF)</Option>
                                <Option value="38">COMPLEX5 -- 320 ohms + (1050 ohms || 230nF)</Option>
                                <Option value="39">COMPLEX6 -- 350 ohms + (1000 ohms || 210nF)</Option>
                                <Option value="40">COMPLEX7 -- 200 ohms + (680 ohms || 100nF)</Option>
                                <Option value="41-">COMPLEX8 -- 370 ohms + (820 ohms || 110nF)</Option>
                                <Option value="42">COMPLEX9 -- 275 ohms + (780 ohms || 115nF)</Option>
                                <Option value="43">COMPLEX10 -- 120 ohms + (820 ohms || 110nF)</Option>
                            </Select>
                        )}
                        <Icon title={this.tr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                    </FormItem>
                    <FormItem className="select-item" label={<span>{this.tr("a_calleridscheme")}<Tooltip title={this.tips_tr("Caller ID Scheme")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator('calleridscheme', {
                            rules: [],
                            initialValue: this.props.itemValues["calleridscheme"] ? this.props.itemValues["calleridscheme"] : "0"
                        })(
                            <Select>
                                <Option value="0">Bellcore/Telcordia</Option>
                                <Option value="1">ETSI-FSK during ringing</Option>
                                <Option value="2">ETSI-FSK prior to ringing with DTAS</Option>
                                <Option value="3">ETSI-FSK prior to ringing with LR+DTAS</Option>
                                <Option value="4">ETSI-FSK prior to ringing with RP</Option>
                                <Option value="5">ETSI-DTMF during ringing</Option>
                                <Option value="6">ETSI-DTMF prior to ringing with DTAS</Option>
                                <Option value="7">ETSI-DTMF prior to ringing with LR+DTAS</Option>
                                <Option value="8">ETSI-DTMF prior to ringing with RP</Option>
                                <Option value="9">SIN 227 - BT</Option>
                                <Option value="10">NTT Japan</Option>
                                <Option value="11">DTMF Denmark prior to ringing no DTAS no LR</Option>
                                <Option value="12">DTMF Denmark prior to ringing with LR</Option>
                                <Option value="13">DTMF Sweden/Finalnd prior to ringing with LR</Option>
                                <Option value="14">DTMF Brazil</Option>
                                <Option value="15">DTMF-FSK Brazil</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={< span > {
                        this.tr("a_enablecudis")
                    } < Tooltip title = {this.tips_tr("Enable current disconnect")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                        {getFieldDecorator("enablecudis", {
                            valuePropName: 'checked',
                            initialValue: parseInt(this.props.itemValues.enablecudis)
                        })(
                            <Checkbox />
                        )}
                        <Icon title={this.tr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                    </FormItem>
                    <FormItem label={< span > {
                        this.tr("a_cudisthreshold")
                    } < Tooltip title = {this.tips_tr("Current disconnect threshold")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                        {getFieldDecorator("cudisthreshold", {
                            rules: [{
                                validator: (data, value, callback) => {
                                    this.digits(data, value, callback)
                                }
                            }, {
                                validator: (data, value, callback) => {
                                    this.range(data, value, callback, 50, 800)
                                }
                            }],
                            initialValue: this.props.itemValues.cudisthreshold
                        })(
                            <Input />
                        )}
                        <Icon title={this.tr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                    </FormItem>
                    <FormItem label={< span > {
                        this.tr("a_enablepstn")
                    } < Tooltip title = {this.tips_tr("Enable PSTN disconnect tone detection")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                        {getFieldDecorator("enablepstn", {
                            valuePropName: 'checked',
                            initialValue: parseInt(this.props.itemValues.enablepstn)
                        })(
                            <Checkbox />
                        )}
                        <Icon title={this.tr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                    </FormItem>
                    <FormItem>
                        <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{this.tr("a_save")}</Button>
                    </FormItem>
                </Form>
            </Content>
        )
    }
}

//export default Enhance(Fxo);
const FxoForm = Form.create()(Enhance(Fxo));
const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    enterSave: state.enterSave
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(FxoForm));
