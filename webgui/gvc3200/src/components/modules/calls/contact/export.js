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

class ExportEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            fileencode:"UTF-8",
            exporttype:"1"
        }
    }

    hanleExportContacts = () => {
        if (this.props.contactsInformation.length == 0) {
            this.props.promptMsg("ERROR", "a_4786");
            this.props.handleHideExportModal();
            return
        }
        let {exporttype,fileencode} = this.state;
        let importConfig = this.getImportConfig(0);
        let [portredup, portclearold] = [importConfig[0],importConfig[1]]
        let data = "&opmode=1&portType=" + exporttype + "&portEncode=" + fileencode;
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

        this.props.handleHideExportModal();

        if(response>2 && portnum > 0) {
            Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_16439'}});
            this.props.progressMessage(value,'none',this.tr('a_16427'));
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
                    } else {
                        setTimeout(() => {this.cb_get_csvresponse()},3000);
                    }
                    if( portnum == 0 ){
                        Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_16427'}});
                    }
                    this.props.progressMessage(value,'block',this.tr('a_16427'));
                    portnum ++;
                }　else {
                    Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_16439'}});
                    this.props.promptMsg("ERROR", "a_6171");
                    portnum = 0;
                }
                break;
            case '3':
                if( mode == 1 )
                    parent.window.location.href = "/phonebook/phonebook.xml?time=" + new Date().getTime();
                else if( mode == 2 )
                    parent.window.location.href = "/phonebook/phonebook.vcf?time=" + new Date().getTime();
                else
                    parent.window.location.href = "/phonebook/phonebook.csv?time=" + new Date().getTime();

                this.props.promptMsg("SUCCESS", "a_4781");
                break;
            case '4':
                let errorCode = phbkprogress;
                let errorMessage = 'a_6171';
                if(errorCode == 3) {
                    errorMessage = 'a_4786';
                } else if (errorCode == 22) {
                    errorMessage = 'a_19643';
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

    handleOk = () => {

    }

    handleCancel = () => {
        this.props.handleHideExportModal();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const [callTr,itemValues] = [this.props.callTr,this.props.itemValues];
        let self = this;

        return (
            <Modal title={callTr('a_19644')} className="importModal" onOk={this.handleOk} onCancel={this.handleCancel} visible={this.props.displayExportModal}>
                <Form hideRequiredMark>
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
                                <Option value="3">CSV</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={(<span style={{visibility:'hidden'}}>g</span>)}>
                        <Button onClick = {this.hanleExportContacts}  size="large"><Icon type="download" />{callTr("a_34")}</Button>
                    </FormItem>
                </Form>
            </Modal>
        )
    }

}

const mapStateToProps = (state) => ({
    activeKey: state.TabactiveKey
});
function mapDispatchToProps(dispatch) {
    var actions = {
        promptMsg:Actions.promptMsg,
        cb_put_port_param: Actions.cb_put_port_param,
        cb_save_fav: Actions.cb_save_fav,
        cb_get_portresponse: Actions.cb_get_portresponse,
        progressMessage:Actions.progressMessage
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(ExportEdit));
