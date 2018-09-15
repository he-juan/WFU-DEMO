import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import {Layout, Tabs, Form, Tooltip, Icon, Button, Select, Checkbox, Input} from "antd";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"autocptbyregion", "pvalue":"22041", "value":""},
                    {"name":"dialtone", "pvalue":"4000", "value":""},
                    {"name":"secdialtone", "pvalue":"2909", "value": ""},
                    {"name":"ringbt", "pvalue":"4001", "value":""},
                    {"name":"busytone", "pvalue":"4002", "value":""},
                    {"name":"reordertone", "pvalue":"4003", "value":""},
                    {"name":"confmtone", "pvalue":"4004", "value":""},
                    {"name":"callwaittone", "pvalue":"4005", "value":""},
                    {"name":"cwaittonetx", "pvalue":"1555", "value":""},
                    //{"name":"pstndistone", "pvalue":"841", "value":""},
                    {"name":"defringcad2", "pvalue":"4040", "value":""}];

class RingtoneForm extends Component {
    constructor(props){
        super(props);

        this.state= {
            disabled: !!parseInt(props.childDisabled)
        }
    }
    handleCptChange = (e) => {
        this.setState({
            disabled: e.target.checked
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.childDisabled!=nextProps.childDisabled){
            this.setState({
                disabled: !!parseInt(nextProps.childDisabled)
            })
        }
        if(this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
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
        const itemvalue = this.props.itemValues;
        return(
            <Form className="configform" hideRequiredMark style={{'min-height': this.props.mainHeight}}>
                <FormItem label={<span>{callTr("a_autocptbyregion")}<Tooltip title={callTipsTr("Auto Config CPT by Region")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("autocptbyregion", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['autocptbyregion'])
                    })(
                        <Checkbox onChange={this.handleCptChange} className="P-22041"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16305")}<Tooltip title={callTipsTr("Dial Tone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("dialtone", {
                        rules: [{
                            max: 108, message: callTr("a_lengthlimit") + "108!"
                        }],
                        initialValue: itemvalue['dialtone']
                    })(
                        <Input disabled={this.state.disabled} className="P-4000"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_secdialtone")}<Tooltip title={callTipsTr("Second Dial Tone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("secdialtone", {
                        rules: [{
                            max: 108, message: callTr("a_lengthlimit") + "108!"
                        }],
                        initialValue: itemvalue['secdialtone']
                    })(
                        <Input disabled={this.state.disabled} className="P-2909"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16306")}<Tooltip title={callTipsTr("Ring Back Tone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("ringbt", {
                        rules: [{
                            max: 108, message: callTr("a_lengthlimit") + "108!"
                        }],
                        initialValue: itemvalue['ringbt']
                    })(
                        <Input disabled={this.state.disabled} className="P-4001"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16307")}<Tooltip title={callTipsTr("Busy Tone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("busytone", {
                        rules: [{
                            max: 108, message: callTr("a_lengthlimit") + "108!"
                        }],
                        initialValue: itemvalue['busytone']
                    })(
                        <Input disabled={this.state.disabled} className="P-4002"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16308")}<Tooltip title={callTipsTr("Reorder Tone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("reordertone", {
                        rules: [{
                            max: 108, message: callTr("a_lengthlimit") + "108!"
                        }],
                        initialValue: itemvalue['reordertone']
                    })(
                        <Input disabled={this.state.disabled} className="P-4003"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16309")}<Tooltip title={callTipsTr("Confirmation Tone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("confmtone", {
                        rules: [{
                            max: 108, message: callTr("a_lengthlimit") + "108!"
                        }],
                        initialValue: itemvalue['confmtone']
                    })(
                        <Input disabled={this.state.disabled} className="P-4004"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16310")}<Tooltip title={callTipsTr("Call-Waiting Tone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("callwaittone", {
                        rules: [{
                            max: 108, message: callTr("a_lengthlimit") + "108!"
                        }],
                        initialValue: itemvalue['callwaittone']
                    })(
                        <Input disabled={this.state.disabled} className="P-4005"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16311")}<Tooltip title={callTipsTr("Call-Waiting Tone Gain")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("cwaittonetx", {
                        initialValue: itemvalue['cwaittonetx'] ? itemvalue['cwaittonetx'] : "0"
                    })(
                        <Select disabled={this.state.disabled} className="P-1555">
							<Option value="0">{callTr("a_16144")}</Option>
							<Option value="1">{callTr("a_16236")}</Option>
							<Option value="2">{callTr("a_16145")}</Option>
						</Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16314")}<Tooltip title={callTipsTr("Default Ring Cadence")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("defringcad2", {
                        rules: [{
                            max: 108, message: callTr("a_lengthlimit") + "108!"
                        }],
                        initialValue: itemvalue['defringcad2']
                    })(
                        <Input disabled={this.state.disabled} className="P-4040"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>
        );
    }
}

const AudioRingtoneForm = Form.create()(RingtoneForm);

class Audio extends Component {
    constructor(props){
        super(props);
        this.state = {
            disabled: false
        }
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items,(values) =>{
            this.setState({
                disabled:values.autocptbyregion
            })
        });
    }

    render(){
        if(!this.props.itemValues){
            return null;
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("advanced_ring")}</div>
                <AudioRingtoneForm {...this.props} childDisabled={this.state.disabled} callTr={this.tr} callTipsTr={this.tips_tr} itemValues={this.props.itemValues}/>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    mainHeight: state.mainHeight,
    enterSave: state.enterSave
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues:Actions.getItemValues,
      setItemValues:Actions.setItemValues
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Audio));
