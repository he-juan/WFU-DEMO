import React, {Component, PropTypes} from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Tabs, Input, Icon, Tooltip, Checkbox, Radio, Select, Button, Upload, message, Modal } from "antd";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
const confirm = Modal.confirm
let req_items;

class FirmwareForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            upfirmfile_Aupload:"a_16197",
            type:"password"
        }

        this.handleNvram();

    }

    handleNvram = () => {
         req_items = [];
         req_items.push(
             this.getReqItem("upgradeall", "upgradeall", ""),
             this.getReqItem("updatevia", "6767", ""),
             this.getReqItem("firpath", "192", ""),
             this.getReqItem("httpuser", "6768", ""),
             this.getReqItem("httppass", "6769", ""),
             this.getReqItem("firpre", "232", ""),
             this.getReqItem("firpost", "233", "")
         )
         return req_items;
    }

    componentDidMount() {
        this.props.getItemValues(req_items);
        this.props.initUploadStatus();
    }

    handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
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
        if(!err) {
            let values = this.props.form.getFieldsValue();
            var pre;
            switch (values.updatevia) {
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
            if( values.firpath.substring(0, pre.length).toUpperCase() == pre )
            {
                values.firpath = values.firpath.substring(pre.length);
            } else if (values.firpath.indexOf("://") != -1) {
                this.props.promptMsg('ERROR', "a_urlerror");
                return false;
            }
            values.firpath = $.trim(values.firpath);
            this.props.setItemValues(req_items, values);
            }
        });
    }

    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }

    setupfirmfile_Aupload = () => {
        this.setState({
            upfirmfile_Aupload:"a_23522"
        })
    }

    prompt_upgrade_result = (result) => {
        const callTr = this.props.callTr;
        var information;
        switch(result)
            {
                case 0:
                    information = callTr("a_succheck");
                    break;
                case 1:
                    information = callTr("a_samever");
                    break;
                case 2:
                    information = callTr("a_readwrong");
                    break;
                case 3:
                    information = callTr("a_wrongsig");
                    break;
                case 4:
                    information = callTr("a_noversion");
                    break;
                case 5:
                    information = callTr("a_hwnotcomp");
                    break;
                case 6:
                    information = callTr("a_imagenotcomp");
                    break;
                case 7:
                    information = callTr("a_notcomp");
                    break;
                case 8:
                    information = callTr("a_16460");
                    break;
                case 9:
                    information = callTr("a_brokenfile");
                    break;
                case 10:
                    information = callTr("a_lowspace");
                    break;
                case 11:
                    information = callTr("a_oemidnotcompatiable");
                    break;
                case 15:
                default:
                    information = callTr("a_unknownfail");
                    break;
            }
        if(result != 0) {
            this.props.promptSpinMsg('display-hidden', "a_uploadwait");
            Modal.info({
                content: <span dangerouslySetInnerHTML={{__html: information}}></span>,
                okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                onOk() {
                },
            });
        } else {
            this.props.promptSpinMsg('display-hidden', "a_uploadwait");
            this.props.setUploadStatus('done')
        }
            return false;
    }

    beforeUploadhandle = (file, fileList) => {
        const callTr = this.props.callTr;
        const cb_ping = this.props.cb_ping;
        const changeMuploading = this.props.changeMuploading;
        const cb_check_provision = this.props.cb_check_provision;
        const promptSpinMsg = this.props.promptSpinMsg;
        let values = this.props.form.getFieldsValue();

        return new Promise(function(resolve, reject) {
            let isupdate = true;
            var upgradeall = 0;
            if(values.upgradeall == true) {
                upgradeall = 1;
            }
            promptSpinMsg('display-block', "a_uploadwait");
            changeMuploading(1);
            cb_ping();
            cb_check_provision(upgradeall,(values) => {
                if (values === "0") {
                    Modal.info({
                        content: <span dangerouslySetInnerHTML={{__html: callTr("a_provisioning")}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                        onOk() {},
                    });
                    promptSpinMsg('display-hidden', "a_uploadwait");
                    reject();
                } else {
                    resolve(file);
                }
            });
        });
    }

    handleUpgrade = () => {
        const callTr = this.props.callTr;
        const cb_ping = this.props.cb_ping;
        const changeMuploading = this.props.changeMuploading;
        this.props.systemUpgrade(() => {
            changeMuploading(3);
            cb_ping();
            const modal = Modal.info({
                content: <span dangerouslySetInnerHTML={{__html: callTr("a_upgrading")}}></span>,
                okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                onOk() {},
            });
            setTimeout(() => modal.destroy(), 2000);
        });
    }

    clickUpgrade = () => {
        const callTr = this.props.callTr;
        let self = this;
        Modal.confirm({
            content: <span dangerouslySetInnerHTML={{__html: callTr("a_confsysupgrade")}}></span>,
            okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
            cancelText: <span dangerouslySetInnerHTML={{__html: callTr("a_3")}}></span>,
            onOk() {self.handleUpgrade()},
            onCancel() {}
        });
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;

        const cb_upgrade_now = this.props.cb_upgrade_now;
        const changeMuploading = this.props.changeMuploading;
        const promptSpinMsg = this.props.promptSpinMsg;
        const promptMsg = this.props.promptMsg;
        let self = this;

        const propsA_upfirmfile = {
            name: 'file',
            showUploadList: true,
            action: '../upload?type=upgradefile',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    self.setupfirmfile_Aupload();
                    let values = self.props.form.getFieldsValue();
                    let upgradeall = values.upgradeall;
                    if( info.file.response.indexOf("Response=Success") != -1 ){
                        cb_upgrade_now(upgradeall, (result)=>{
                            self.prompt_upgrade_result(result);
                        });
                    }else if( info.file.response.indexOf("Message=Not enough space") != -1 ){
                        //button.text(a_7404);
                        Modal.info({
                            content: <span dangerouslySetInnerHTML={{__html: callTr("a_uploadfail") + callTr("a_lowspace")}}></span>,
                            okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                            onOk() {},
                        });
                        promptSpinMsg('display-hidden', "a_uploadwait");
                    }else{
                        //button.text(a_7404);
                        Modal.info({
                            content: <span dangerouslySetInnerHTML={{__html: callTr("a_uploadfail")}}></span>,
                            okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                            onOk() {},
                        });
                        promptSpinMsg('display-hidden', "a_uploadwait");
                    }
                    changeMuploading(0);
                } else if (info.file.status === 'error') {
                    promptMsg('ERROR', "a_uploadfail");
                    promptSpinMsg('display-hidden', "a_uploadwait");
                }
            },
            onRemove() {
                message.destroy()
            },
            beforeUpload: self.beforeUploadhandle
        };


        let itemList =
            <Form hideRequiredMark>
                <FormItem label={< span > { callTr("a_16648") } < Tooltip title = {callTipsTr("Complete Upgrade")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("upgradeall", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues.upgradeall)
                    })(
                        <Checkbox  className="P-upgradeall"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16328")}&nbsp;<Tooltip title={callTipsTr("Upload Firmware File to Update")}><Icon type="question-circle-o"/></Tooltip></span>)}>
                    {getFieldDecorator('a_16328', {
                        valuePropName: 'fileList',
                        normalize: this._normFile
                    })(
                        <div>
                            <Upload {...propsA_upfirmfile}>
                                <Button>
                                    <Icon type="upload" /> {this.tr(this.state.upfirmfile_Aupload)}
                                </Button>
                            </Upload>
                            <Icon title={callTr("a_rebooteffect")} style={{left:'100px'}} className="rebooticon" type="exclamation-circle-o" />
                        </div>
                    )}
                </FormItem>
                <FormItem className="select-item" label={< span > { callTr("a_19175") } < Tooltip title={callTipsTr("Firmware Upgrade Via")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator('updatevia', {
                        rules: [],
                        initialValue: this.props.itemValues["updatevia"] ? this.props.itemValues["updatevia"] : "1"
                    })(
                        <Select className="P-6767">
                            <Option value="0">TFTP</Option>
                            <Option value="1">HTTP</Option>
                            <Option value="2">HTTPS</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem label={< span > {callTr("a_4113")} < Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Firmware Server Path")} />} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("firpath", {
                        rules: [{
                            max: 256, message: this.tr("a_lengthlimit") + "256"
                        }],
                        initialValue: this.props.itemValues.firpath
                    })(<Input className="P-192"/>)}
                </FormItem>
                <FormItem label={< span > {callTr("a_httpuser")} < Tooltip title = {callTipsTr("Firmware HTTP/HTTPS User Name")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    <Input type="text" name = "httpuser" style= {{display:"none"}} disabled autocomplete = "off"/>
                    {getFieldDecorator("httpuser", {
                        rules: [],
                        initialValue: this.props.itemValues.httpuser
                    })(<Input name = "httpuser" className="P-6768"/>)}
                </FormItem>
                <FormItem label={< span > {callTr("a_4112")} < Tooltip title = {callTipsTr("Firmware HTTP/HTTPS Password")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    <Input type={this.state.type} name = "httppass" style= {{display:"none"}} disabled autocomplete = "off"/>
                    {getFieldDecorator("httppass", {
                        rules: [],
                        initialValue: this.props.itemValues.httppass
                    })(<Input type={this.state.type} name = "httppass" suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible}/>} className="P-6769" />)}
                </FormItem>
                <FormItem label={< span > {callTr("a_16330")} < Tooltip title = {callTipsTr("Firmware File Prefix")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("firpre", {
                        rules: [
                            {
                                max: 128,
                                message: this.tr("a_lengthlimit") + "128"
                            }
                        ],
                        initialValue: this.props.itemValues.firpre
                    })(<Input className="P-232"/>)}
                </FormItem>
                <FormItem label={< span > {callTr("a_16331")} < Tooltip title = {callTipsTr("Firmware File Postfix")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("firpost", {
                        rules: [
                            {
                                max: 128,
                                message: this.tr("a_lengthlimit") + "128"
                            }
                        ],
                        initialValue: this.props.itemValues.firpost
                    })(<Input className="P-233"/>)}
                </FormItem>
              {/*  <FormItem label={( <span>{callTr("a_firmwareupgrade")}&nbsp; <Tooltip title={callTipsTr("Firmware Upgrade")}>
                    <Icon type="question-circle-o"/> </Tooltip></span>
                )}>
                    {(
                        <Button className="button" type="primary" onClick={this.clickUpgrade.bind(this)}>{this.tr("a_upgrade")}</Button>
                    )}
                </FormItem>*/}
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

//export default Enhance(FirmwareForm);
const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        cb_ping:Actions.cb_ping,
        cb_check_provision:Actions.cb_check_provision,
        cb_upgrade_now:Actions.cb_upgrade_now,
        promptMsg: Actions.promptMsg,
        initUploadStatus: Actions.initUploadStatus,
        systemUpgrade: Actions.systemUpgrade,
        setUploadStatus:Actions.setUploadStatus,
        promptSpinMsg:Actions.promptSpinMsg
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(FirmwareForm));
