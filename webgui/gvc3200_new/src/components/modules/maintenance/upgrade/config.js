import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Checkbox, Radio, Select, Button, Row, Upload, message,Modal } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items;
var GAPS_PATH = "fm.grandstream.com/gs";
var a_confpathval = "";

class ConfigForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            gapsitem:"",
            password1:"password",
            password2:"password",
            password3:"password"
        }

        this.handleNvram();
    }

    handleNvram = () => {
         req_items = [];
         req_items.push(
             this.getReqItem("updateconfigvia", "212", ""),
             this.getReqItem("confpath", "237", ""),
             this.getReqItem("confighttpuser", "1360", ""),
             this.getReqItem("confighttppass", "1361", ""),
             this.getReqItem("httpauth", "20713", ""),
             this.getReqItem("confpre", "234", ""),
             this.getReqItem("confpost", "235", ""),
             this.getReqItem("authconffile", "240", ""),
             this.getReqItem("xmlpass", "1359", ""),
             this.getReqItem("custvia", "6775", ""),
             this.getReqItem("custurl", "6774", ""),
             this.getReqItem("custusername", "6776", ""),
             this.getReqItem("custpassword", "6777", ""),
             this.getReqItem("copyfromconfig", "6778", "")
         )
         return req_items;
    }

    componentDidMount() {
        this.props.getItemValues(req_items, (values) => {
            if (this.props.oemId != "70") {
                this.checkoutGapsitem(values.confpath)
            }
        });
    }

    handlePwdVisible1 = () => {
        this.setState({password1: this.state.password1 == "password" ? "text" : "password"});
    }

    handlePwdVisible2 = () => {
        this.setState({password2: this.state.password2 == "password" ? "text" : "password"});
    }

    handlePwdVisible3 = () => {
        this.setState({password3: this.state.password3 == "password" ? "text" : "password"});
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items, (values) => {
                    if (this.props.oemId != "70") {
                        this.checkoutGapsitem(values.confpath);
                    }
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
        if(!err) {
            let values = this.props.form.getFieldsValue();
            var pre;
            switch (values.updateconfigvia) {
                case "0":
                    pre = "TFTP://"
                    break;
                case "1":
                    pre = "HTTP://"
                    break;
                case "2":
                    pre = "HTTPS://"
                    break;
                default:
            }
            if( values.confpath.substring(0, pre.length).toUpperCase() == pre )
            {
                values.confpath = values.confpath.substring(pre.length);
            } else if (values.confpath.indexOf("://") != -1) {
                    this.props.promptMsg('ERROR', "a_configurlerror");
                return false;
            }
            values.confpath = $.trim(values.confpath);

            var custviapre;
            switch (values.custvia) {
                case "0":
                    custviapre = "TFTP://"
                    break;
                case "1":
                    custviapre = "HTTP://"
                    break;
                case "2":
                    custviapre = "HTTPS://"
                    break;
                default:
            }
            if( values.custurl.substring(0, custviapre.length).toUpperCase() == custviapre )
            {
                values.custurl = values.custurl.substring(custviapre.length);
            } else if (values.custurl.indexOf("://") != -1) {
                this.props.promptMsg('ERROR', "a_custvialerror");
                return false;
            }
            values.custurl = $.trim(values.custurl);

            this.props.setItemValues(req_items, values);
            }
        });
    }

    clickgetSaveConf = () => {
        this.props.getSaveConf();
    }

    checkoutGapsitem = (values) => {
        let gapsitem;
        let usegsgap;
        const { setFieldsValue } = this.props.form;
        a_confpathval = values;

        if(a_confpathval == GAPS_PATH) {
            gapsitem = "display-hidden";
            usegsgap = true;
        } else {
            gapsitem = "display-block";
            usegsgap = false;
        }
        this.setState({
            gapsitem:gapsitem
        });
        setFieldsValue({
            usegsgap:usegsgap
        });
    }

    onChangeGapsitem = (e) => {
        let gapsitem;
        let confpath;
        const { setFieldsValue } = this.props.form;
        if (e.target.checked === true) {
            gapsitem = "display-hidden";
            confpath = GAPS_PATH;
        } else {
            gapsitem = "display-block";
            confpath = a_confpathval;
        }
        this.setState({
            gapsitem:gapsitem
        });
        setFieldsValue({
            confpath:confpath
        });
    }

    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }

    beforeBrowsehandle = () => {
        const cb_ping = this.props.cb_ping;
        const changeMuploading = this.props.changeMuploading;
        const callTr = this.props.callTr;
        changeMuploading(2);
        cb_ping();
    }

    tips_notice = (result) => {
        const callTr = this.props.callTr;
        let tips;
        result == 1 ? tips = "a_uploadfail" : tips = "a_uploadsuctips";
        Modal.info({
            content: <span dangerouslySetInnerHTML={{__html: callTr(tips)}}></span>,
            okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
            onOk() {},
        });
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;
        const get_Importconf = this.props.get_Importconf;
        const self = this;
        const product = this.props.product;
        const oemId = this.props.oemId;


        const propsA_importconf = {
            name: 'file',
            showUploadList: false,
            action: '../upload?type=importcfg',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    //message.success(`${info.file.name} file uploaded successfully`);
                    get_Importconf( (result) => {
                        self.tips_notice(result);
                    });
                } else if (info.file.status === 'error') {
                    //message.error(`${info.file.name} file upload failed.`);
                }
            },
            onRemove() {
                message.destroy()
            },
            beforeUpload: self.beforeBrowsehandle
        };

        let itemList =
            <Form hideRequiredMark>
                <p className="blocktitle"><s></s>{this.tr("a_configtitle")}</p>
                <FormItem label={< span > {callTr("a_19213")} < Tooltip title = {callTipsTr((oemId == "54") ? "Use Grandstream GAPS For D3X" : "Use Grandstream GAPS")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("usegsgap", {
                        rules: [],
                        valuePropName: 'checked',
                        //initialValue: usegsgap
                    })(
                        <Checkbox onChange={this.onChangeGapsitem.bind(this)} />
                    )}
                </FormItem>
              {/*  <FormItem className = {"select-item" + " " +this.state.gapsitem} label={< span > {callTr("a_configupvia")} < Tooltip title = {callTipsTr("Config Upgrade Via")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator('updateconfigvia', {
                        rules: [],
                        initialValue: this.props.itemValues["updateconfigvia"] ? this.props.itemValues["updateconfigvia"] : "0"
                    })(
                        <Select className="P-212">
                            <Option value="0">TFTP</Option>
                            <Option value="1">HTTP</Option>
                            <Option value="2">HTTPS</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem className = {this.state.gapsitem} label={< span > {callTr("a_4114")} < Tooltip title = {callTipsTr("Config Server Path")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("confpath", {
                        rules: [{
                            max: 256, message: callTr("a_lengthlimit") + "256"
                        }],
                        initialValue: this.props.itemValues.confpath
                    })(<Input className="P-237"/>)}
                </FormItem>*/}
                <FormItem label={< span > {callTr("a_confighttpuser")} < Tooltip title = {callTipsTr("Config HTTP/HTTPS User Name")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    <Input type="text" name = "confighttpuser" style= {{display:"none"}} disabled autocomplete = "off"/>
                    {getFieldDecorator("confighttpuser", {
                        rules: [],
                        initialValue: this.props.itemValues.confighttpuser
                    })(<Input className="P-1360"/>)}
                </FormItem>
                <FormItem label={< span > {callTr("a_4112")} < Tooltip title = {callTipsTr("Config HTTP/HTTPS Password")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    <Input type={this.state.password1} name = "confighttppass" style= {{display:"none"}} disabled autocomplete = "off"/>
                    {getFieldDecorator("confighttppass", {
                        rules: [],
                        initialValue: this.props.itemValues.confighttppass
                    })(<Input type={this.state.password1} name = "confighttppass" className="P-1361" suffix={<Icon type="eye" className={this.state.password1} onClick={this.handlePwdVisible1}/>}/>)}
                </FormItem>
                <FormItem label={< span > {callTr("a_16352")} < Tooltip title = {callTipsTr("Always send HTTP Basic Authentication Information")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("httpauth", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.httpauth)
                    })(
                        <Checkbox className="P-20713"/>
                    )}
                </FormItem>
                <FormItem label={< span > {callTr("a_16332")} < Tooltip title = {callTipsTr("Config File Prefix")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("confpre", {
                        rules: [
                            {
                                max: 128,
                                message: callTr("a_lengthlimit") + "128"
                            }
                        ],
                        initialValue: this.props.itemValues.confpre
                    })(<Input className="P-234"/>)}
                </FormItem>
                <FormItem label={< span > {callTr("a_16333")} < Tooltip title = {callTipsTr("Config File Postfix")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("confpost", {
                        rules: [
                            {
                                max: 128,
                                message: callTr("a_lengthlimit") + "128"
                            }
                        ],
                        initialValue: this.props.itemValues.confpost
                    })(<Input className="P-235"/>)}
                </FormItem>
                <FormItem label={< span > {callTr("a_16347")} < Tooltip title = {callTipsTr("Authenticate Conf File")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("authconffile", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.authconffile)
                    })(
                        <Checkbox className="P-240"/>
                    )}
                </FormItem>
                <FormItem label={< span > {callTr("a_16327")} < Tooltip title = {callTipsTr("XML Config File Password")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("xmlpass", {
                        rules: [],
                        initialValue: this.props.itemValues.xmlpass
                    })(<Input type={this.state.password2} className="P-1359" suffix={<Icon type="eye" className={this.state.password2} onClick={this.handlePwdVisible2}/>} />)}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16351")}&nbsp;<Tooltip title={callTipsTr("Download Device Configuration")}><Icon type="question-circle-o"/></Tooltip></span>)}>
                    {(
                        <Button className="button" type="primary" onClick={this.clickgetSaveConf.bind(this)} >{this.tr("a_28")}</Button>
                    )
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_19184")}&nbsp;<Tooltip title={callTipsTr("Upload Device Configuration")}><Icon type="question-circle-o"/></Tooltip></span>)}>
                    {getFieldDecorator('a_19184', {
                        valuePropName: 'fileList',
                        normalize: this._normFile
                    })(
                        <div>
                            <Upload {...propsA_importconf}>
                                <Button>
                                    <Icon type="upload" /> {this.tr("a_16486")}
                                </Button>
                            </Upload>
                            <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                        </div>
                    )}
                </FormItem>
                <p className="blocktitle"><s></s>{this.tr("a_19203")}</p>
                <FormItem className="select-item" label={(<span>{callTr("a_19200")}&nbsp;<Tooltip title={callTipsTr("GUI customization file download via")}><Icon type="question-circle-o"/></Tooltip></span>)}>
                    {getFieldDecorator('custvia', {
                        rules: [],
                        initialValue: this.props.itemValues["custvia"] ? this.props.itemValues["custvia"] : "0"
                    })(
                        <Select className="P-6775">
                            <Option value="0">TFTP</Option>
                            <Option value="1">HTTP</Option>
                            <Option value="2">HTTPS</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem label={< span > {callTr("a_19199")} < Tooltip title = {callTipsTr("GUI customization file URL")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("custurl", {
                        rules: [
                            {
                                max: 256, message: "STUN server length can't over 256!"
                            }
                        ],
                        initialValue: this.props.itemValues.custurl
                    })(<Input className="P-6774"/>)}
                </FormItem>
                <FormItem label={< span > {callTr("a_19201")} < Tooltip title = {callTipsTr("GUI customization file HTTP/HTTPS username")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("custusername", {
                        rules: [
                            {
                                max: 32,
                                message: "TURN server username length can't over 128!"
                            }
                        ],
                        initialValue: this.props.itemValues.custusername
                    })(<Input className="P-6776"/>)}
                </FormItem>
                <FormItem label={< span > {callTr("a_19202")} < Tooltip title = {callTipsTr("GUI customization file HTTP/HTTPS password")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("custpassword", {
                        rules: [
                            {
                                max: 128,
                                message: "TURN server password length can't over 128!"
                            }
                        ],
                        initialValue: this.props.itemValues.custpassword
                    })(<Input type={this.state.password3} className="P-6777" suffix={<Icon type="eye" className={this.state.password3} onClick={this.handlePwdVisible3}/>} />)}
                </FormItem>
                <FormItem label={< span > {callTr("a_19224")} < Tooltip title = {callTipsTr("Use Configurations of Config File Server")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("copyfromconfig", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.copyfromconfig)
                    })(
                        <Checkbox className="P-6778"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

//export default Enhance(ConfigForm);
const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    product: state.product,
    oemId: state.oemId
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        getSaveConf:Actions.getSaveConf,
        cb_ping:Actions.cb_ping,
        get_Importconf:Actions.get_Importconf,
        promptMsg: Actions.promptMsg
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(ConfigForm));
