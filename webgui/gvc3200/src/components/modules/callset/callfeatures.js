import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import {Layout, Tabs, Form, Tooltip, Icon, Button, Select, Checkbox, Input} from "antd";
import * as optionsFilter from "../../template/optionsFilter.js";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [
    // 音频
    {"name":"discallwaittone", "pvalue":"186", "value":""},   // 无呼叫等待音
    {"name":"disdndring", "pvalue":"1486", "value":""},       // 禁用DND提示音
    {"name":"entrymute", "pvalue":"29607", "value":""},    // 接通时自动静音
    // {"name":"noiseblock", "pvalue":"25110", "value":""},    // Noise Shield

    // 规则

    {"name":"escapeuri", "pvalue":"1406", "value":""},      //将SIP URI中的'#'转义成%23
    {"name":"disableincalldtmf", "pvalue":"338", "value":""},  // 禁止通话中DTMF显示
    {"name":"filterchars", "pvalue":"22012", "value":""},     // 过滤字符集 
    {"name":"callwait", "pvalue":"91", "value":""},         // 禁止呼叫等待
    {"name":"DisableDirectIPCall", "pvalue":"277", "value":""}  // 禁用IP拨打模式
]



class CallfeaturesForm extends Component {
    constructor(props){
        super(props);
        this.state={
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
        }
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {
        });
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                
                this.props.setItemValues(req_items, values, 1);

                const beforefilter = this.props.itemValues['filterchars'];
                const afterfilter = values['filterchars'];

                if(afterfilter != beforefilter){
                    let applyfun = $.cookie("applyfunc");
                    if(applyfun != "" && applyfun != undefined)
                        applyfun += ";action=sendlighttpd&param=45";
                    else
                        applyfun += "action=sendlighttpd&param=45";
                    $.cookie("applyfunc", applyfun, {path: '/', expires:10});
                }
            }
        });
    }


    onChangeMode = (value) => {
        this.checkValue(value);
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;
        let itemList =
            <Form className="configform" hideRequiredMark style={{'minHeight': this.props.mainHeight}}>   
                <p className="blocktitle"><s></s>{callTr("a_10017")}</p>
                {/* 无呼叫等待音 */}
                <FormItem label={<span>{callTr("a_16290")}<Tooltip title={callTipsTr("Disable Call-Waiting Tone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("discallwaittone", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['discallwaittone'])
                    })(
                        <Checkbox className={"P-186"}/>
                    )}
                </FormItem>
                {/* 禁用DND提示音 */}
                <FormItem label={<span>{callTr("a_16292")}<Tooltip title={callTipsTr("Disable DND Reminder Ring")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disdndring", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disdndring'])
                    })(
                        <Checkbox className={"P-1486"}/>
                    )}
                </FormItem>
                {/* 接通时自动静音 */}
                <FormItem label={<span>{callTr("a_19328")}<Tooltip title={callTipsTr("Auto Mute on Entry")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("entrymute", {
                        initialValue: itemvalue['entrymute'] ? itemvalue['entrymute'] : "0"
                    })(
                        <Select className={"P-29607"}>
                            <Option value="0">{callTr("a_39")}</Option>
                            <Option value="1">{callTr("a_19329")}</Option>
                            <Option value="2">{callTr("a_19330")}</Option>
                            <Option value="3">{callTr("a_19331")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* Noise Shield */}
                {/* <FormItem label={<span>{callTr("Noise shield")}<Tooltip title={callTipsTr("Noise Shield")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("noiseblock", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['noiseblock'])
                    })(
                        <Checkbox className={"P-25110"}/>
                    )}
                </FormItem> */}

                <p className="blocktitle"><s></s>{callTr("a_19804")}</p>
                {/* 将SIP URI中的'#'转义成%23 */}
                <FormItem label={<span>{callTr("a_16300")}<Tooltip title={callTipsTr("Escape '#' as %23 in SIP URI")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("escapeuri", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['escapeuri'])
                    })(
                        <Checkbox className="P-1406"/>
                    )}
                </FormItem>
                {/* 禁止通话中DTMF显示 */}
                <FormItem label={<span>{callTr("a_16279")}<Tooltip title={callTipsTr("Disable in-call DTMF display")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disableincalldtmf", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disableincalldtmf'])
                    })(
                        <Checkbox className={"P-338"}/>
                    )}
                </FormItem>    

                {/* 过滤字符集 */}
                <FormItem label={<span>{callTr("a_19112")}<Tooltip title={callTipsTr("Filter Characters")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("filterchars", {
                        initialValue: itemvalue['filterchars']
                    })(
                        <Input className="P-22012"/>
                    )}
                </FormItem>
                {/* 禁用呼叫等待 */}
                <FormItem label={<span>{callTr("a_16641")}<Tooltip title={callTipsTr("Disable Call-Waiting")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("callwait", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['callwait'])
                    })(
                        <Checkbox className={"P-91"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16293")}<Tooltip title={callTipsTr("Disable Direct IP Call")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("DisableDirectIPCall", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['DisableDirectIPCall'])
                    })(
                        <Checkbox className={"P-277"}/>
                    )}
                </FormItem>
                
                
                
                
                
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form> ;
        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length-1; hiddenOptions[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }
        return itemList;
    }
}

const CallsetFeatureForm = Form.create()(Enhance(CallfeaturesForm));

class Callfeatures extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
    }

    render(){
        if(!this.props.itemValues){
            return null;
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_16027")}</div>
                <CallsetFeatureForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} itemValues={this.props.itemValues}/>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    userType: state.userType,
    itemValues: state.itemValues,
    enterSave: state.enterSave
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues: Actions.getItemValues,
      setItemValues: Actions.setItemValues,
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Callfeatures));
