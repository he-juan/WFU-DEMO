import React, { Component, PropTypes } from 'react'
import Enhance from '../../../mixins/Enhance'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Store from '../../../entry'
import { Form, Icon, Tooltip, Checkbox, Radio, Select, Button, Upload, message, Modal } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm
let portnum = 0
let hiddenConf = true

class ImexportForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            importfileencode:"UTF-8",
            importtype:"1",
            fileencode:"UTF-8",
            exporttype:"1",
            exportFiletype:"0",
            disabled1:true,
            disabled2:true,
            fileList:[],
        }
    }

    handlePvalue = () => {
        let req_items = [];
        req_items.push(
            this.getReqItem("maxImportCount", 1688, "")
        )
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue())
    }

    componentWillMount = () => {
        const oemid = this.props.oemId;
        const product = this.props.product;
        if(oemid && oemid === "54" && product === "GXV3380"){
            hiddenConf = false
        }
    }

    hanleExportContacts = () => {
        let {exportFiletype,fileencode,exporttype} = this.state;
        let importConfig = this.getImportConfig(0);
        let [portredup, portclearold] = [importConfig[0],importConfig[1]]
        let data = "&opmode=1&portType=" + exporttype + "&portEncode=" + fileencode + "&exporttype=" + exportFiletype;
        this.props.cb_put_port_param('putportphbk', 0, data, portredup, portclearold);
        this.props.cb_save_fav('savephbk',exporttype,this.cb_get_portresponse_done);
    }

    cb_get_portresponse_done = (data,mode) => {
        let msgs = this.res_parse_rawtext(data);
        this.cb_if_auth_fail(msgs);
        this.cb_if_is_fail(msgs);
        let response = msgs.headers["phbkresponse"];
        let phbkprogress = msgs.headers["phbkprogress"];
        let max = msgs.headers["max"];
        let value = Math.floor((phbkprogress/max).toFixed(2) * 100);

        if(response>2 && portnum > 0) {
            Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_patient'}});
            this.props.progressMessage(value,'none',this.tr('a_exporting'));
            portnum = 0;
        }
        switch( response ) {
            case '0':
            case '1':
                value = 0;
            case '2':
                if(portnum < 60){
                    if( mode == 1 ){
                        setTimeout(() => {this.cb_get_xmlresponse()},3000);
                    }
                    else if( mode == 2 ) {
                        setTimeout(() => {this.cb_get_vcardresponse()},3000);
                    }
                    else if ( mode == 3 ) {
                        setTimeout(() => {this.cb_get_csvresponse()},3000);
                    }
                    if( portnum == 0 ){
                        Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_exporting'}});
                    }
                    this.props.progressMessage(value,'block',this.tr('a_exporting'));
                    portnum ++;
                }　else {
                    Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_patient'}});
                    this.props.promptMsg("ERROR", "a_exportfail");
                    portnum = 0;
                }
                break;
            case '3':
                if( mode == 1 )
                    parent.window.location.href = "/phonebook/phonebook.xml?time=" + new Date().getTime();
                else if( mode == 2 )
                    parent.window.location.href = "/phonebook/phonebook.vcf?time=" + new Date().getTime();
                else if( mode == 3 )
                    parent.window.location.href = "/phonebook/phonebook.csv?time=" + new Date().getTime();
                this.props.promptMsg("SUCCESS", "a_exportsuccess");
                break;
            case '4':
                let errorCode = phbkprogress;
                let errorMessage = 'a_exportfail';
                if(errorCode == 3) {
                    errorMessage = 'a_4786';
                } else if (errorCode == 22) {
                    errorMessage = 'a_taskinprogress';
                }
                this.props.promptMsg("ERROR", errorMessage);
                break;
            default:
        }

    }

    cb_get_xmlresponse = () => {
        this.props.cb_get_portresponse(1,this.cb_get_portresponse_done);
    }

    cb_get_vcardresponse = () => {
        this.props.cb_get_portresponse(2,this.cb_get_portresponse_done);
    }

    cb_get_csvresponse = () => {
        this.props.cb_get_portresponse(3,this.cb_get_portresponse_done);
    }

    cb_put_importphbk = () => {
        let {importfileencode,importtype} = this.state;
        let importConfig = this.getImportConfig(1)
        let [portredup, portclearold] = [importConfig[0],importConfig[1]]
        let data = "&opmode=0&portType=" + importtype + "&portEncode=" + importfileencode;
        this.props.cb_put_port_param('putportphbk', 1, data, portredup, portclearold,this.cb_import_reponse);
    }

    cb_import_reponse = (data) => {
        let msgs = this.res_parse_rawtext(data);
        this.cb_if_auth_fail(msgs);
        this.cb_if_is_fail(msgs);
        let response = msgs.headers["phbkresponse"];
        let phbkprogress = msgs.headers["phbkprogress"];
        let max=msgs.headers["max"]
        let value = Math.floor((phbkprogress/max).toFixed(2) * 100);

        if (response>2) {
            Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_patient'}});
            this.props.progressMessage(value,'none',this.tr('a_importing'));
        }
        switch( response ) {
            case '0':
            case '1':
                value = 0;
            case '2':
                setTimeout(() => {this.props.cb_get_portresponse(0,this.cb_import_reponse)},3000);
                Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_importing'}});
                this.props.progressMessage(value,'block',this.tr('a_importing'));
                break;
            case '3':
                this.props.promptMsg("SUCCESS", "a_importsuccess");
                break;
            case '4':
                let errorCode = phbkprogress;
                let errorMessage = 'a_16474';
                if(errorCode == 4) {
                    errorMessage = 'a_nospaceleft';
                } else if (errorCode == 12) {
                    errorMessage = this.tr('a_contactsfull') + this.props.itemValues['maxImportCount'] + "!";
                } else if (errorCode == 22) {
                    errorMessage = 'a_taskinprogress';
                }
                this.props.promptMsg("ERROR", errorMessage);
                break;
            default:
        }

    }

    handleFileTypeChange = (type,val) => {
        switch (type) {
            case "importfileencode":
                this.setState({importfileencode:val})
                break;
            case "importtype":
                this.setState({importtype:val})
                break;
            case "fileencode":
                this.setState({fileencode:val})
                break;
            case "exporttype":
                this.setState({exporttype:val})
                break;
            case "exportFiletype":
                this.setState({exportFiletype:val})
                break;

            default:
        }
    }

    hanleClick = (type,e) => {
        switch (type) {
            case "clearoldlist0":
                this.setState({disabled1: !this.state.disabled1})
                break;
            case "downdup0":
                this.setState({disabled2: !this.state.disabled2})
                break;
            default:
        }
    }

    getImportConfig = (flag) => {
        let redup = 0,clearold = 0;
        if(this.props.form.getFieldValue('downdup0')) {
            if(parseInt(this.props.form.getFieldValue('downdupmode0'))) {
                redup = 2;
            } else {
                redup = 1;
            }
        }
        if(this.props.form.getFieldValue('clearoldlist0')) {
            if(parseInt(this.props.form.getFieldValue('clearoldlistmode0'))) {
                clearold = 2;
            } else {
                clearold = 1;
            }
        }
        return [redup,clearold]
    }

    beforeUploadhandle = (file, fileList) => {
        return new Promise((resolve, reject) => {
            this.props.cb_ping();
            let name = file.name
            let ext = name.slice(name.lastIndexOf(".")+1)
            if( (ext && /^(xml|vcf|csv)$/.test(ext)) && ext != 'xml' && this.state.importtype == '1') {
                Modal.info({
                    content: <span dangerouslySetInnerHTML={{__html: this.tr("ext_xml")}}></span>,
                    okText: <span dangerouslySetInnerHTML={{__html: this.tr("a_2")}}></span>,
                    onOk() {},
                });
                reject();
            }
            if( (ext && /^(xml|vcf|csv)$/.test(ext)) && ext != 'vcf' && this.state.importtype == '2') {
                Modal.info({
                    content: <span dangerouslySetInnerHTML={{__html: this.tr("ext_vcard")}}></span>,
                    okText: <span dangerouslySetInnerHTML={{__html: this.tr("a_2")}}></span>,
                    onOk() {},
                });
                reject();
            }
            if((ext && /^(xml|vcf|csv)$/.test(ext)) && ext != 'csv' && this.state.importtype == '3') {
                Modal.info({
                    content: <span dangerouslySetInnerHTML={{__html: this.tr("ext_csv")}}></span>,
                    okText: <span dangerouslySetInnerHTML={{__html: this.tr("a_2")}}></span>,
                    onOk() {},
                });
                reject();
            }
            if ( !(ext && /^(xml|vcf|csv)$/.test(ext)) ){
                Modal.info({
                    content: <span dangerouslySetInnerHTML={{__html:hiddenConf ? this.tr("ext_xml_etc") : this.tr("ext_xml_csv_etc")}}></span>,
                    okText: <span dangerouslySetInnerHTML={{__html: this.tr("a_2")}}></span>,
                    onOk() {},
                });
                reject();
            } else {
                resolve(file);
            }
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.form.resetFields();
            }
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const [callTr,itemValues] = [this.props.callTr,this.props.itemValues];
        let self = this;
        const importContactsProps = {
            name: 'file',
            showUploadList: false,
            action: '../upload?type=phonebook&t='+this.state.importtype,
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                let fileList = info.fileList.slice(-1)
                self.setState({fileList:fileList})

                if (info.file.status !== 'uploading') {

                }
                if (info.file.status === 'done') {
                    //message.success(callTr('a_uploadsuc'));
                    self.cb_put_importphbk(1,0)
                } else if (info.file.status === 'error') {
                    message.error(callTr('a_uploadfail'));
                }
            },
            beforeUpload: self.beforeUploadhandle,
            onRemove() {
                message.destroy()
            }
        };

        let itemList =
            <Form>
                <p className="blocktitle"><s></s>{this.tr("a_45")}</p>
                <FormItem label={(<span>{callTr("a_16485")}&nbsp;<Tooltip title={this.tips_tr("Clear The Old List")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('clearoldlist0', {
                        valuePropName: 'checked',
                        initialValue: 0
                    })(
                        <Checkbox onClick = {this.hanleClick.bind(this,"clearoldlist0")} />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_clearoldlistmode")}&nbsp;<Tooltip title={this.tips_tr("Clear Old History Mode")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('clearoldlistmode0', {
                        initialValue: "0"
                    })(
                        <RadioGroup disabled = {this.state.disabled1} >
                            <Radio value="0">{callTr("a_clearall")}</Radio>
                            <Radio value="1">{callTr("a_keeplocalcontacts")}</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_downdup")}&nbsp;<Tooltip title={this.tips_tr("Replace Duplicate Items")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('downdup0', {
                        valuePropName: 'checked',
                        initialValue: 0
                    })(
                        <Checkbox onClick = {this.hanleClick.bind(this,"downdup0")} />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_downdupmode")}&nbsp;<Tooltip title={this.tips_tr("Replace Duplicate Entries Mode")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('downdupmode0', {
                        initialValue: "0"
                    })(
                        <RadioGroup disabled = {this.state.disabled2}>
                            <Radio value="0">{callTr("a_replacebyname")}</Radio>
                            <Radio value="1">{callTr("a_replacebynumber")}</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem className = "select-item" label={(<span>{callTr("a_4755")}&nbsp;<Tooltip title={this.tips_tr("File Encoding")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('importfileencode', {
                        initialValue: "UTF-8"
                    })(
                        <Select onChange = {this.handleFileTypeChange.bind(this,'importfileencode')}>
                            <Option value="UTF-8">UTF-8</Option>
                            <Option value="GBK">GBK</Option>
                            <Option value="UTF-16">UTF-16</Option>
                            <Option value="UTF-32">UTF-32</Option>
                            <Option value="Big5">Big5</Option>
                            <Option value="Big5-HKSCS">Big5-HKSCS</Option>
                            <Option value="Shift-JIS">Shift-JIS</Option>
                            <Option value="ISO8859-1">ISO8859-1</Option>
                            <Option value="ISO8859-15">ISO8859-15</Option>
                            <Option value="Windows-1251">Windows-1251</Option>
                            <Option value="EUC-KR">EUC-KR</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className = "select-item" label={(<span>{callTr("a_4756")}&nbsp;<Tooltip title={this.tips_tr("File Type")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('importtype', {
                        initialValue: "1"
                    })(
                        <Select onChange = {this.handleFileTypeChange.bind(this,'importtype')}>
                            <Option value="1">XML</Option>
                            <Option value="2">VCard</Option>
                            <Option style={{display: hiddenConf ? 'none' : 'block' }} value="3">CSV</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={(<span style={{visibility:'hidden'}}>g</span>)}>
                    <Upload {...importContactsProps} fileList={this.state.fileList}>
                        <Button>
                            <Icon type="upload" /> {this.tr("a_importlocal")}
                        </Button>
                    </Upload>
                </FormItem>

                <p className="blocktitle"><s></s>{this.tr("a_34")}</p>
                <FormItem className = "select-item" label={(<span>{callTr("a_4755")}&nbsp;<Tooltip title={this.tips_tr("File Encoding")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('fileencode', {
                        initialValue: "UTF-8"
                    })(
                        <Select onChange = {this.handleFileTypeChange.bind(this,'fileencode')}>
                            <Option value="UTF-8">UTF-8</Option>
                            <Option value="GBK">GBK</Option>
                            <Option value="UTF-16">UTF-16</Option>
                            <Option value="UTF-32">UTF-32</Option>
                            <Option value="Big5">Big5</Option>
                            <Option value="Big5-HKSCS">Big5-HKSCS</Option>
                            <Option value="Shift-JIS">Shift-JIS</Option>
                            <Option value="ISO8859-1">ISO8859-1</Option>
                            <Option value="ISO8859-15">ISO8859-15</Option>
                            <Option value="Windows-1251">Windows-1251</Option>
                            <Option value="EUC-KR">EUC-KR</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className = "select-item" label={(<span>{callTr("a_4756")}&nbsp;<Tooltip title={this.tips_tr("File Type")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('exporttype', {
                        initialValue: "1"
                    })(
                        <Select onChange = {this.handleFileTypeChange.bind(this,'exporttype')}>
                            <Option value="1">XML</Option>
                            <Option value="2">VCard</Option>
                            <Option style={{display: hiddenConf ? 'none' : 'block' }} value="3">CSV</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem style={{display: hiddenConf ? 'none' : 'block' }} className = "select-item" label={(<span>{callTr("a_exportfiletype")}&nbsp;<Tooltip title={this.tips_tr("Export Type")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('exportFiletype', {
                        initialValue: "0"
                    })(
                        <Select onChange = {this.handleFileTypeChange.bind(this,'exportFiletype')}>
                            <Option value="0">{callTr("appset_phonebook")}</Option>
                            <Option value="1">{callTr("a_templatefile")}</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem label={(<span style={{visibility:'hidden'}}>g</span>)}>
                    <Button onClick = {this.hanleExportContacts}  size="large"><Icon type="download" />{callTr("a_34")}</Button>
                </FormItem>
            </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;
    }
}

const mapStateToProps = (state) => ({
    activeKey: state.TabactiveKey,
    oemId: state.oemId,
    product: state.product
})
function mapDispatchToProps(dispatch) {
    var actions = {

    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(ImexportForm));
