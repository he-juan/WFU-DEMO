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

const req_items = [{"name":"avayamode", "pvalue":"22018", "value":""},
    {"name":"vgregisternum", "pvalue":"22133", "value":""},
    {"name":"filterchars", "pvalue":"22012", "value":""},
    {"name":"escapeuri", "pvalue":"1406", "value":""},
    {"name":"use3rdapp", "pvalue":"oem_phone_name", "value":""},
    {"name":"recordmode", "pvalue":"6760", "value":""},
    {"name":"environment", "pvalue":"22093", "value":""},
    {"name":"disablevideo", "pvalue":"22091", "value":""},
    {"name":"usequickipcall", "pvalue":"184", "value":""},
    {"name":"callwait", "pvalue":"91", "value":""},
    {"name":"discallwaittone", "pvalue":"186", "value":""},
    {"name":"disdndring", "pvalue":"1486", "value":""},
    {"name":"disabletrnf", "pvalue":"1341", "value":""},
    {"name":"disablebefortrnf", "pvalue":"8466", "value":""},
    {"name":"dfttrnfmode", "pvalue":"1685", "value":""},
    {"name":"enablefunction", "pvalue":"preview", "value":""},
    {"name":"disableconf", "pvalue":"1311", "value":""},
    {"name":"autoconf", "pvalue":"1682", "value":""},
    {"name":"entrymute", "pvalue":"29607", "value":""},
    {"name":"dialkey", "pvalue":"72", "value":""},
    {"name":"alring", "pvalue":"1439", "value":""},
    {"name":"ofhdial", "pvalue":"71", "value":""},
    {"name":"ofautodialdelay", "pvalue":"8388", "value":""},
    {"name":"ofhtimeout", "pvalue":"1485", "value":""},
    {"name":"dtmfbtnsize", "pvalue":"dial_dtmf_btn_size", "value":""},
    {"name":"dtmfbtncolor", "pvalue":"dial_dtmf_btn_color", "value":""},
    {"name":"autounhold", "pvalue":"29067", "value":""},
    {"name":"offcradlepickup", "pvalue":"30120", "value":""},
    {"name":"oncradlehangup", "pvalue":"30140", "value":""}];

class CallfeaturesForm extends Component {
    constructor(props){
        super(props);
        this.state={
            packagename: '',
            isuseThird: '',
            transvis: "display-block",
            incomingfunc: "",
            incominghelp: ""
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
        }
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {
            this.checkValue(values.use3rdapp)
            if(data['disabletrnf'] == "1"){
                this.setState({transvis: "display-hidden"});

                if(data['enablefunction'] == "2"){
                    this.setState({
                        incomingfunc: "warning",
                        incominghelp: "a_transfertip"
                    });
                }
            }
            if(data['disablevideo'] == "1" && data['enablefunction'] == "1"){
                this.setState({
                    incomingfunc: "warning",
                    incominghelp: "a_incomingtip"
                });
            }
        });
        this.props.getThirdapplist();
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                if(this.props.product == "GXV3380" && req_items.length == "13"){
                    req_items.splice(req_items.length - 1, 1);
                }
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

    checkValue = (value) => {
        let isuseThird = '';
        if (value == "" || value == undefined) {
            isuseThird = 'display-hidden'
        } else {
            isuseThird = 'display-block'
        }
        this.setState({isuseThird: isuseThird, packagename:value})
    }

    onChangeMode = (value) => {
        this.checkValue(value);
    }

    handleTransVisible = (e) => {
        let incomingfunc = this.props.form.getFieldValue("enablefunction");
        let disablevideo = this.props.form.getFieldValue("disablevideo");
        if(e.target.checked){
            this.setState({transvis: "display-hidden"});
            if(incomingfunc == "2") this.validIncomeFuncStatus(2);
        }else{
            this.setState({transvis: "display-block"});

            switch (incomingfunc) {
                case "0":
                case "2":
                    this.validIncomeFuncStatus(0);
                    break;
                case "1":
                    if(disablevideo) this.validIncomeFuncStatus(1);
            }
        }
    }

    changeDisableVideo = (e) => {
        let incomingfunc = this.props.form.getFieldValue("enablefunction");
        let disabletrans = this.props.form.getFieldValue("disabletrnf");
        if(e.target.checked){
            if(incomingfunc == "1") this.validIncomeFuncStatus(1);
        }else{
            switch (incomingfunc) {
                case "0":
                case "1":
                    this.validIncomeFuncStatus(0);
                    break;
                case "2":
                    if(disabletrans) this.validIncomeFuncStatus(2);
            }
        }
    }

    changeIncomingFunc = (value) => {
        let disablevideo = this.props.form.getFieldValue("disablevideo");
        let disabletrans = this.props.form.getFieldValue("disabletrnf");
        if(value == "1" && disablevideo){
            this.validIncomeFuncStatus(1);
        }else if(value == "2" && disabletrans){
            this.validIncomeFuncStatus(2);
        }else{
            this.validIncomeFuncStatus(0);
        }
    }

    /* preview mode won't take effect when video call feature is disabled, show warning prompt */
    validIncomeFuncStatus = (tag) => {
        switch (tag) {
            case 0:
                this.setState({
                    incomingfunc: "",
                    incominghelp: ""
                });
                break;
            case 1:
                this.setState({
                    incomingfunc: "warning",
                    incominghelp: "a_incomingtip"
                });
                break;
            case 2:
                this.setState({
                    incomingfunc: "warning",
                    incominghelp: "a_transfertip"
                });
                break;
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;
        const product = this.props.product;
        let virgrouprange = 5;
        let virgrouptrans = "a_vacctregister";
        let virgrouptitle = "Number Of Accounts the Virtual Account Group Register";
        if(product == "GXV3380"){
            virgrouprange = 15;
            virgrouptrans = "a_vgregisternum";
            virgrouptitle = "Virtual Account Group Concurrence Register";
        }else if(product == "GXV3370"){
            virgrouprange = 16;
            virgrouptitle = "Virtual Account Group Concurrence Register";
        }
        let thirdapplist = this.props.thirdapplist;
        const children = [];
        for (var i = 0; thirdapplist[i] != undefined; i++) {
            children.push(<Option value = {thirdapplist[i].value}>{this.htmlEncode(thirdapplist[i].label)}</Option>)
        }
        let itemList =
            <Form className="configform" hideRequiredMark style={{'minHeight': this.props.mainHeight}}>
                <FormItem label={<span>{callTr("a_disablevideo")}<Tooltip title={callTipsTr("Disable Video Call Feature")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disablevideo", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disablevideo'])
                    })(
                        <Checkbox className={"P-22091"} onClick={this.changeDisableVideo}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16294")}<Tooltip title={callTipsTr("Use Quick IP-call mode")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("usequickipcall", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['usequickipcall'])
                    })(
                        <Checkbox className={"P-184"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_callwait")}<Tooltip title={callTipsTr("Disable Call-Waiting")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("callwait", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['callwait'])
                    })(
                        <Checkbox className={"P-91"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16290")}<Tooltip title={callTipsTr("Disable Call-Waiting Tone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("discallwaittone", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['discallwaittone'])
                    })(
                        <Checkbox className={"P-186"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_disdndring")}<Tooltip title={callTipsTr("Disable DND Reminder Ring")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disdndring", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disdndring'])
                    })(
                        <Checkbox className={"P-1486"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16295")}<Tooltip title={callTipsTr("Disable Transfer")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disabletrnf", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disabletrnf'])
                    })(
                        <Checkbox onClick={this.handleTransVisible} className={"P-1341"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_disablebefortrnf")}<Tooltip title={callTipsTr("Hold Call Before Completing Transfer")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disablebefortrnf", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disablebefortrnf'])
                    })(
                        <Checkbox className={"P-8466"}/>
                    )}
                </FormItem>
                <FormItem className={this.state.transvis} label={<span>{callTr("a_16296")}<Tooltip title={callTipsTr("Default Transfer Mode")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("dfttrnfmode", {
                        initialValue: itemvalue['dfttrnfmode'] ? itemvalue['dfttrnfmode'] : "0"
                    })(
                        <Select className={"P-1685"}>
                            <Option value="0">{callTr("a_blindtrnf")}</Option>
                            <Option value="1">{callTr("a_attendtrnf")}</Option>
                            <Option value="2">{callTr("a_attendtrnfonly")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16615")}<Tooltip title={callTipsTr("Enable Function for Incoming Call")}><Icon type="question-circle-o"/></Tooltip></span>}
                          validateStatus={this.state.incomingfunc} help={callTr(this.state.incominghelp)} hasFeedback>
                    {getFieldDecorator("enablefunction", {
                        initialValue: itemvalue['enablefunction'] ? itemvalue['enablefunction'] : "0"
                    })(
                        <Select className={"P-preview"} onChange={this.changeIncomingFunc}>
                            <Option value="0">{callTr("a_20")}</Option>
                            <Option value="1">{callTr("a_68")}</Option>
                            <Option value="2">{callTr("a_enforward")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16297")}<Tooltip title={callTipsTr("Disable Conference")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disableconf", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disableconf'])
                    })(
                        <Checkbox className={"P-1311"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16289")}<Tooltip title={callTipsTr("Auto Conference")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("autoconf", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['autoconf'])
                    })(
                        <Checkbox className={"P-1682"}/>
                    )}
                </FormItem>
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
                <FormItem  label={(<span>{callTr("a_16171")}<Tooltip title={callTipsTr("Use # as Dial Key")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('dialkey', {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['dialkey'])
                    })(
                        <Checkbox className={"P-72"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_alring")}<Tooltip title={callTipsTr("Always Ring Speaker")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("alring", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['alring'])
                    })(
                        <Checkbox className={"P-1439"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16301")}<Tooltip title={callTipsTr("Offhook Auto Dial")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("ofhdial", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.phoneNumber(data, value, callback)
                            }
                        },{
                            max: 128, message: callTr("a_lengthlimit") + "128!",
                        }],
                        initialValue: itemvalue['ofhdial']
                    })(
                        <Input className={"P-71"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_ofautodialdelay")}<Tooltip title={callTipsTr("Offhook Auto Dial Delay")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("ofautodialdelay", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 60)
                            }
                        }],
                        initialValue: itemvalue['ofautodialdelay']
                    })(
                        <Input className={"P-8388"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_ofhtimeout")}<Tooltip title={callTipsTr("Offhook/Onhook Timeout")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("ofhtimeout", {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 10, 60)
                            }
                        }],
                        initialValue: itemvalue['ofhtimeout']
                    })(
                        <Input className={"P-1485"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_offcradlepickup")}<Tooltip title={callTipsTr("Off-cradle Pickup")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("offcradlepickup", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['offcradlepickup'])
                    })(
                        <Checkbox className={"P-30120"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_oncradlehangup")}<Tooltip title={callTipsTr("On-cradle Hangup")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("oncradlehangup", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['oncradlehangup'])
                    })(
                        <Checkbox className={"P-30140"}/>
                    )}
                </FormItem>


                <FormItem label={<span>{callTr("a_dtmfbtnsize")}<Tooltip title={callTipsTr("Dial Dtmf Button Size")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("dtmfbtnsize", {
                        initialValue: itemvalue['dtmfbtnsize'] ? itemvalue['dtmfbtnsize'] : "0"
                    })(
                        <Select className={"P-dial_dtmf_btn_size"}>
                            <Option value="0">{callTr("a_16249")}</Option>
                            <Option value="1">{callTr("a_10090")}</Option>
                            <Option value="2">{callTr("a_16248")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_dtmfbtncolor")}<Tooltip title={callTipsTr("Dial Dtmf Button Color")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("dtmfbtncolor", {
                        initialValue: itemvalue['dtmfbtncolor'] ? itemvalue['dtmfbtncolor'] : "0"
                    })(
                        <Select className={"P-dial_dtmf_btn_color"}>
                            <Option value="0">{callTr("a_dtmfcolorred")}</Option>
                            <Option value="1">{callTr("a_dtmfcoloryellow")}</Option>
                            <Option value="2">{callTr("a_dtmfcolorgrey")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_autounhold")}<Tooltip title={callTipsTr("Auto Unhold When Press the Line Key")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("autounhold", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['autounhold'])
                    })(
                        <Checkbox className={"P-29067"}/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_avayamode")}<Tooltip title={callTipsTr("Virtual Account Group Avaya Mode")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("avayamode", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['avayamode'])
                    })(
                        <Checkbox className="P-22018"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr(virgrouptrans)}<Tooltip title={callTipsTr(virgrouptitle)}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vgregisternum", {
                        rules: [{
                            required: true,
                            message: this.tr("tip_require")
                        }, {
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 1, virgrouprange)
                            }
                        }],
                        initialValue: itemvalue['vgregisternum']
                    })(
                        <Input className="P-22133"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_19112")}<Tooltip title={callTipsTr("Filter Characters")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("filterchars", {
                        initialValue: itemvalue['filterchars']
                    })(
                        <Input className="P-22012"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_escapeuri")}<Tooltip title={callTipsTr("Escape '#' as %23 in SIP URI")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("escapeuri", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['escapeuri'])
                    })(
                        <Checkbox className="P-1406"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_use3rdapp")}<Tooltip title={callTipsTr("Use 3rd Party App as Basic Phone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("use3rdapp", {
                        initialValue: itemvalue['use3rdapp'] ? itemvalue['use3rdapp'] : ''
                    })(
                        <Select onChange={ this.onChangeMode.bind(this) } className="P-oem_phone_name">
                            <Option value="">{callTr("a_20")}</Option>
                            {children}
                        </Select>
                    )}
                </FormItem>
                <FormItem className={this.state.isuseThird} label={<span>{callTr("a_use3rdapppkt")}<Tooltip title={callTipsTr("3rd Party App Package Name")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span>{ this.state.packagename == "" ? itemvalue['use3rdapp'] : this.state.packagename }</span>
                </FormItem>
                <FormItem label={<span>{callTr("a_recordmode")}<Tooltip title={callTipsTr("Record Mode")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("recordmode", {
                        initialValue: itemvalue['recordmode'] ? itemvalue['recordmode'] : this.isWP8xx() ? "1" : "0"
                    })(
                        <Select className="P-6760">
                            <Option className={this.isWP8xx() ? 'display-hidden' : ''} value="0">{callTr("a_recordlocally")}</Option>
                            <Option value="1">{callTr("a_recordportaone")}</Option>
                            <Option value="2">{callTr("a_recorducm")}</Option>
                            <Option value="3" className={product == "GAC2510" ? "display-hidden" : "display-block"}>{callTr("a_recordbs")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_environment")}<Tooltip title={callTipsTr("Environment")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("environment", {
                        initialValue: itemvalue['environment'] ? itemvalue['environment'] : "0"
                    })(
                        <Select>
                            <Option value="0">{callTr("a_indoor")}</Option>
                            <Option value="1">{callTr("a_outdoor")}</Option>
                        </Select>
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
    product: state.product,
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    thirdapplist: state.thirdapplist
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues: Actions.getItemValues,
      setItemValues: Actions.setItemValues,
      getThirdapplist: Actions.getThirdapplist
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Callfeatures));
