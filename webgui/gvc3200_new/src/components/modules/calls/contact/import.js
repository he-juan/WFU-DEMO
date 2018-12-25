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

class ImportEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            importfileencode:"UTF-8",
            importtype:"0",
            fileencode:"UTF-8",
            exporttype:"1",
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
        let portphbkresponse = msgs.headers["portphbkresponse"];
        this.props.handleHideImportModal();
        if ( parseInt(response) > 2) {
            Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_16439'}});
            // this.props.progressMessage('','none',this.tr('a_16430'));
        }
        switch (response) {
            case '1':
                // if(downnum < 80){
                //     setTimeout("cb_get_upload_response()",5000);
                setTimeout(() => {this.props.cb_get_portresponse(0,this.cb_import_reponse)},5000);
                Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_16430'}});
                // this.props.progressMessage('','block',this.tr('a_16430'));
                //     downnum ++;
                //     break;
                // }else{
                //     $("#a_browse").text(a_7404).removeClass('widebtn');
                // }
                break;
            case '2':
                this.props.promptMsg("ERROR", 'a_16420');
                break;
            case '3':
                this.props.promptMsg("ERROR", 'a_4772');
                break;
            /*case '3':
                if( $("#exporttype").val() == 2 )
                    $.prompt(a_downparsefail+a_selcode);
                else
                    $.prompt(a_downparsefail);
                break;*/
            case '4':
                this.props.promptMsg("ERROR", 'a_16474');
                break;
            case '9':
                this.props.promptMsg("ERROR", 'a_16433');
                break;
            case '10':
                this.props.promptMsg("ERROR", 'a_16434');
                break;
            default:
                break;
        }
        if(portphbkresponse == 0) {
            this.props.getContacts();
            this.props.promptMsg("SUCCESS", 'a_4780');
        }

        if(response != 1) {
            Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_16439'}});
        }
        // this.props.getContacts();
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

   handleOk = () => {

   }

   handleCancel = () => {
       this.props.handleHideImportModal();
   }

   render() {
       const {getFieldDecorator} = this.props.form;
       const [callTr,itemValues] = [this.props.callTr,this.props.itemValues];
       let self = this;

       const importContactsProps = {
           name: 'file',
           showUploadList: false,
           action: '../upload?type=phonebook',
           headers: {
               authorization: 'authorization-text'
           },
           onChange(info) {
               let fileList = info.fileList.slice(-1)
               self.setState({fileList:fileList})
               if (info.file.status !== 'uploading') {}
               if (info.file.status === 'done') {
                   //message.success(callTr('a_16669'));
                   self.cb_put_importphbk(1,0)
               } else if (info.file.status === 'error') {
                   message.error(callTr('a_16477'));
               }
           },
           beforeUpload: self.beforeUploadhandle,
           onRemove() {
               message.destroy()
           }
       };

       return (
           <Modal title={callTr('a_45')} className="importModal" onOk={this.handleOk} onCancel={this.handleCancel} visible={this.props.displayImportModal}>
                <Form hideRequiredMark>
                    <FormItem label={(<span>{callTr("a_16485")}&nbsp;<Tooltip title={this.tips_tr("Clear The Old List")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                        {getFieldDecorator('clearoldlist0', {
                            valuePropName: 'checked',
                            initialValue: 0
                            })(
                                <Checkbox onClick = {this.hanleClick.bind(this,"clearoldlist0")} />
                        )}
                    </FormItem>
                    <FormItem label={(<span>{callTr("a_19648")}&nbsp;<Tooltip title={this.tips_tr("Replace Duplicate Items")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                        {getFieldDecorator('downdup0', {
                            valuePropName: 'checked',
                            initialValue: 0
                            })(
                                <Checkbox onClick = {this.hanleClick.bind(this,"downdup0")} />
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
                            initialValue: "0"
                        })(
                            <Select onChange = {this.handleFileTypeChange.bind(this,'importtype')}>
                                <Option value="0">XML</Option>
                                <Option value="1">VCard</Option>
                                <Option value="2">CSV</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={(<span style={{visibility:'hidden'}}>g</span>)}>
                        <Upload {...importContactsProps} fileList={this.state.fileList}>
                            <Button>
                                <Icon type="upload" /> {this.tr("a_45")}
                            </Button>
                        </Upload>
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
      cb_ping: Actions.cb_ping,
      cb_put_port_param: Actions.cb_put_port_param,
      promptMsg:Actions.promptMsg,
      getItemValues:Actions.getItemValues,
      cb_get_portresponse: Actions.cb_get_portresponse,
      progressMessage:Actions.progressMessage,
      getContacts:Actions.getContacts,
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(ImportEdit));
