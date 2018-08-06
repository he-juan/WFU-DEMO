import React, { Component, PropTypes } from 'react'
import Enhance from '../../mixins/Enhance';
import { FormattedHTMLMessage } from 'react-intl'
import { ChromePicker } from 'react-color';
import {Layout, Tabs, Form, Tooltip, Icon, Button, Select, Checkbox, Input, Slider, Modal, message} from 'antd';
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const FormItem = Form.Item;
let checklogitems = ['configuration', 'callrecord', 'contacts'];
let req_items;

class BackupModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            backupbtndisable: true,
        }

    }

    handleAddOk = () => {
        const callTr = this.props.callTr;
        const oemId = this.props.oemId;
        const promptMsg = this.props.promptMsg;
        let values = this.props.form.getFieldsValue();
        if (values.callrecord == undefined && values.configuration == undefined && values.contacts == undefined) {
            promptMsg('ERROR', "a_backuplimit");
            return false;
        }
        this.props.promptSpinMsg('display-block', "a_backuping");
        var config = values.configuration == true ? "1" : '0';
        var callhistory = values.callrecord == true ? "1" : "0";
        var contacts;
        if (oemId == "54") {
            contacts = "0";
        } else {
            contacts = values.contacts == true ? "1" : "0";
        }
        //var contacts = values.contacts == true ? "1" : "0";
        this.props.Start_Backupcontent(config, callhistory, contacts, (result) =>{
            if (result.response == "success") {
                this.props.Get_backupinfo( (result) => {
                    this.props.promptSpinMsg('display-hidden', "a_backuping");
                    promptMsg('SUCCESS', "a_backupsuc");
                    this.props.handleBackupInfo(result)
                });
            } else {
                this.props.promptSpinMsg('display-hidden', "a_backuping");
                promptMsg('ERROR', "a_backupfail");
            }
        } )
        this.props.displayBackupDiv();
        this.props.handleHideBackuoModal();
        this.setState({backupbtndisable:true})
    }

    handleCancel = () => {
        this.props.handleHideBackuoModal();
        this.setState({backupbtndisable:true})
    }

    checkItem = (id, e) => {
        let checked = e.target.checked;
        const form = this.props.form;
        switch (id) {
            case 'configuration':
            case 'callrecord':
            case 'contacts':
                let tmparr = [...checklogitems];
                tmparr = tmparr.filter(item => item != id);
                if (checked){
                    this.setState({backupbtndisable: false});
                }else {
                    let backupbtndisable = true;
                    for(let i in tmparr){
                        if(form.getFieldValue(tmparr[i])){
                            backupbtndisable = false;
                            break;
                        }
                    }
                    if(backupbtndisable){
                        this.setState({backupbtndisable: true});
                    }
                }
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const callTr = this.props.callTr;
        const backupModalvisible = this.props.backupModalvisible;
        var contactsDisplay = "none";
        var contactsinfo = ""
        var connectIcon = "";
        if (this.props.oemId != "54") {
            contactsDisplay = "block";
        } else {
            contactsinfo = "a_backup_contacts";
            connectIcon = ", ";
        }

        return (
            <Modal
                title = {callTr("a_backup")}
                className="backup-modal"
                visible = {backupModalvisible}
                onOk={this.handleAddOk}
                onCancel={this.handleCancel}
                footer = {[
                    <Button type="primary" disabled={this.state.backupbtndisable} onClick={this.handleAddOk}>{callTr("a_backup")}</Button>,
                    <Button type="primary" onClick={this.handleCancel}>
                      {callTr("a_cancel")}
                    </Button>,
                ]}
            >
                <p>{callTr("a_backupwarm")}</p>
                <Form hideRequiredMark>
                    <FormItem label={( <span> {callTr("a_backupcontent")} </span> )}>
                        <div className="ellips">
                            {getFieldDecorator("configuration", {
                                valuePropName: 'checked'
                            })(
                                <Checkbox onChange={this.checkItem.bind(this, 'configuration')}  />
                            )}
                            <span> {callTr("a_backup_cfg")}</span>
                        </div>
                        <div className="ellips">
                            {getFieldDecorator("callrecord", {
                                valuePropName: 'checked'
                            })(
                                <Checkbox onChange={this.checkItem.bind(this, 'callrecord')} />
                            )}
                            <span> {callTr("call_history") + connectIcon + callTr(contactsinfo)}</span>
                        </div>
                        <div className="ellips" style={{display:contactsDisplay}}>
                            {getFieldDecorator("contacts", {
                                valuePropName: 'checked'
                            })(
                                <Checkbox onChange={this.checkItem.bind(this, 'contacts')} />
                            )}
                            <span> {callTr("a_backup_contacts")}</span>
                        </div>
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

const BackupModalForm = Form.create()(BackupModal);

class RestoreModal extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    handleCancel = () => {
        this.props.handleHideRecoryModal();
    }

    render() {
        const callTr = this.props.callTr;
        const restoreModalVisible = this.props.restoreModalVisible;
        var contactsDisplay = "none";
        var contactsinfo = ""
        var connectIcon = "";
        if (this.props.oemId != "54") {
            contactsDisplay = "block";
        } else {
            contactsinfo = "a_backup_contacts";
            connectIcon = ", ";
        }

        return (
            <Modal
                className="backup-modal restoreModal"
                title = {callTr("a_bkstore")}
                visible = {restoreModalVisible}
                onCancel={this.handleCancel}
            >
                <div>
                    <div className = "restoreProcess">
                        <div className="ProcessItem">
                            <div className="icon iconCfg"></div>
                            <div className="infor">
                                <p style={{color:'#0d1017', "fontWeight":'bold'}}>{callTr("a_backup_cfg")}</p>
                                <p style={{color:'#55627b'}}>{callTr("a_Synced")}</p>
                            </div>
                        </div>
                        <div className="prosessbar">
                            <div className="right"></div>
                        </div>
                    </div>
                    <div className = "restoreProcess">
                        <div className="ProcessItem">
                            <div className="icon iconCall"></div>
                            <div className="infor">
                                <p style={{color:'#0d1017', "fontWeight":'bold'}}>{callTr("call_history") + connectIcon + callTr(contactsinfo)}</p>
                                <p style={{color:'#55627b'}}>{callTr("a_inbackup")}</p>
                            </div>
                        </div>
                        <div className="prosessbar">
                            <div className="bkping"></div>
                        </div>
                    </div>
                    <div className = "restoreProcess" style={{display:contactsDisplay}}>
                        <div className="ProcessItem">
                            <div className="icon iconContacts"></div>
                            <div className="infor">
                                <p style={{color:'#0d1017', "fontWeight":'bold'}}>{callTr("a_backup_contacts")}</p>
                                <p style={{color:'#55627b'}}>{callTr("a_waitbkp")}</p>
                            </div>
                        </div>
                        <div className="prosessbar">
                            <div className="bkping"></div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

const RestoreModalForm = Form.create()(RestoreModal);

class Backup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restoreCofirmModalVisible: false,
            deleteCofirmModalVisible: false,
            backupModalvisible: false,
            restoreModalVisible: false,
            unbackupdisplay: "none",
            backupdisplay: "none",
            backupdate: "",
            isConfig: "",
            isCallhistory:"",
            isContacts: "",
            backupSize:"",
            isDivided1:'',
            isDivided2:''
        }

        req_items = new Array;
        req_items.push(
            this.getReqItem("is_phone_busy", "is_phone_busy", "")
        )
    }

    componentDidMount = () => {
        this.props.Get_backupinfo( (result) => {
            if (result.indexOf("error") == -1) {
                this.handleBackupInfo(result);
                this.displayBackupDiv();
            } else {
                this.setState({backupdisplay:'none', unbackupdisplay:'block'})
            }

        })
    }

    handleBackupInfo = (result) => {
        var backupinfo = (result.substring(1, result.length-3)+'"').split(', ')
        var backInfoArr = [];
        var length = backupinfo[1].split(":")[1].length;
        backInfoArr = backupinfo[1].split(":")[1].substring(1, length-1).split(',');
        var backuptime = backInfoArr[0];
        var backuptimearr = backuptime.split("_")
        var backupdate = backuptimearr[0] + "/" + backuptimearr[1] + "/" + backuptimearr[2] + " " + backuptimearr[3] + ":" + backuptimearr[4] + ":" +backuptimearr[5];
        var isDivided1;
        var isDivided2;
        var isConfig = backInfoArr[1] == "1" ? "a_backup_cfg" : "";
        //var isCallhistory = backInfoArr[2] == "1" ? "call_history" : "";
        //var isContacts = backInfoArr[3] == "1" ? "a_backup_contacts" : "";
        var isContacts;
        var isCallhistory;
        if (this.props.oemId == "54") {
            isContacts = "";
            isCallhistory = backInfoArr[2] == "1" ? "call_historycontact" : "";
            isDivided1 = (backInfoArr[2] == "1" && backInfoArr[1] == "1") ? ", " : "";
            isDivided2 = '';
        } else {
            isContacts = backInfoArr[3] == "1" ? "a_backup_contacts" : "";
            isDivided1 = ((backInfoArr[1] == "1" && backInfoArr[2] == "1") || (backInfoArr[1] == "1" && backInfoArr[3] == "1")) ? ", " : "";
            isCallhistory = backInfoArr[2] == "1" ? "call_history" : "";
            isDivided2 = ((backInfoArr[2] == "1" && backInfoArr[3] == "1") || (backInfoArr[1] == "1" && backInfoArr[3] == "1") && (isDivided1 == "")) ? ", " : "";
        }
        var backupSize = backInfoArr[4];
        var backupSizeinfo = backupSize/1024 <= 1024 ? backupSize/1024 + "KB" : backupSize/1024/1024 + "MB";
        this.displayBackupInfo(backupdate, isConfig, isCallhistory, isContacts,backupSizeinfo,isDivided1,isDivided2);
    }

    displayBackupDiv = () => {
        this.setState({backupdisplay:'block', unbackupdisplay:'none'})
    }

    displayBackupInfo = (backupdate,isConfig, isCallhistory, isContacts, backupSize, isDivided1, isDivided2) => {
        this.setState({backupdate: backupdate, isConfig: isConfig, isCallhistory: isCallhistory, isContacts: isContacts,backupSize:backupSize,isDivided1:isDivided1, isDivided2:isDivided2});
    }

    handleHideBackuoModal = () => {
        this.setState({backupModalvisible: false})
    }

    showBackupModal = () => {
        this.props.form.resetFields();
        this.setState({backupModalvisible: true})
    }

    handleHideRecoryModal = () => {
        this.setState({restoreModalVisible: false})
    }

    cb_reboot = () => {
        var urihead = "action=ping";
        urihead += "&time=" + new Date().getTime();
        var self = this;
        $.ajax ({
            type: 'get',
            url:'/manager',
            data:urihead,
            dataType:'text',
            success:function(data) {
                self.cb_rebootres(data);
            },
            error:function(xmlHttpRequest, errorThrown) {
                self.cb_networkerror(xmlHttpRequest, errorThrown);
            }
        });
    }

    cb_rebootres(data) {
        var msgs = this.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "pong") {
            this.props.setPageStatus(2)
        } else {
            this.props.setPageStatus(0)
        }
    }

    showRestoryModal = () => {
        const promptMsg = this.props.promptMsg;
        this.setState({restoreCofirmModalVisible:false})
        this.setState({restoreModalVisible: true})
        this.props.handle_Recoverbackup((result) => {
            if (result.indexOf("success") != -1) {
                var self = this;
                Modal.confirm({
                    content: <span dangerouslySetInnerHTML={{__html: this.tr("a_rebootcheck")}}></span>,
                    okText: <span dangerouslySetInnerHTML={{__html: this.tr("a_ok")}}></span>,
                    cancelText: <span dangerouslySetInnerHTML={{__html: this.tr("a_cancel")}}></span>,
                    onOk() {self.cb_reboot()},
                    onCancel() {}
                });
            } else {
                promptMsg('ERROR', "a_restorefail");
            }
            this.handleHideRecoryModal();
        });
    }

    showRestoryConfirmModal = () => {
        this.props.getItemValues(req_items, (values) => {
            if (values.is_phone_busy == "1") {
                this.props.promptMsg('ERROR', "a_restorecall");
            } else {
                this.setState({restoreCofirmModalVisible:true});
            }
        })
    }

    hideRestoryConfirmModal = () => {
        this.setState({restoreCofirmModalVisible:false})
    }

    showDeleteConfirmModal = () => {
        this.setState({deleteCofirmModalVisible:true})
    }

    hideDeleteConfirmModal = () => {
        this.setState({deleteCofirmModalVisible:false})
    }

    handledeleteBackup = () => {
        const promptMsg = this.props.promptMsg;
        this.hideDeleteConfirmModal();
        this.props.handle_Deletebackup((result) => {
            if (result.indexOf("success") != -1) {
                promptMsg('SUCCESS', "a_del_ok");
            } else {
                promptMsg('ERROR', "a_del_failed");
            }
            this.setState({backupdisplay:'none', unbackupdisplay:'block'});
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Content className="content-container">
                <div className="subpagetitle">{this.tr("a_backup")}</div>
                <div className="backup-content" style={{'min-height':this.props.mainHeight}}>
                    <div className="unbackupdiv" style={{display:this.state.unbackupdisplay}}>
                        <div className="unbackuppng">
                        </div>
                        <div className="unbackupinfo">
                            <p>{this.tr("backup_tip")}</p>
                            <p>{this.tr("a_try")}<a onClick={this.showBackupModal}>{this.tr("start_backup")}</a></p>
                        </div>
                    </div>
                    <div className="backupdiv" style={{display:this.state.backupdisplay}}>
                        <div className="backuppng"></div>
                        <div className="backupinfo">
                            <div>
                                <p><span className="backuptitle">{this.tr("a_backupcontent")}</span><span className="backupdetail">{this.tr(this.state.isConfig)+ this.state.isDivided1 + this.tr(this.state.isCallhistory)+ this.state.isDivided2 + this.tr(this.state.isContacts)}</span></p>
                                <p><span className="backuptitle">{this.tr("a_backuptime")}</span><span className="backupdetail">{this.state.backupdate}</span></p>
                                <p><span className="backuptitle">{this.tr("a_backupsize")}</span><span className="backupdetail">{this.state.backupSize}</span></p>
                            </div>
                            <div className="operationDiv" style={{'text-align':'right'}}>
                                <Modal visible={this.state.restoreCofirmModalVisible} title={this.tr("a_restore")} className="confirm-modal"
                                       okText={this.tr("a_ok")} cancelText={this.tr("a_cancel")} onOk={this.showRestoryModal} onCancel={this.hideRestoryConfirmModal}>
                                    <p className="confirm-content">{this.tr("a_isBackup")}</p>
                                </Modal>
                                <Button className="select-restory" type="primary" onClick={this.showRestoryConfirmModal}><i></i>{this.tr("a_restore")}</Button>
                                <Modal visible={this.state.deleteCofirmModalVisible} title={this.tr("a_delete")} className="confirm-modal"
                                       okText={this.tr("a_ok")} cancelText={this.tr("a_cancel")} onOk={this.handledeleteBackup} onCancel={this.hideDeleteConfirmModal}>
                                    <p className="confirm-content">{this.tr("a_isdeleteBackup")}</p>
                                </Modal>
                                <Button className="select-delete" type="primary" onClick = {this.showDeleteConfirmModal}><i></i>{this.tr("a_delete")}</Button>
                                <Button type="primary" onClick={this.showBackupModal}>{this.tr("a_backup")}</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <BackupModalForm {...this.props} promptMsg={this.props.promptMsg} handleHideBackuoModal={this.handleHideBackuoModal}
                    callTr={this.tr} displayBackupDiv={this.displayBackupDiv} displayBackupInfo={this.displayBackupInfo} handleBackupInfo={this.handleBackupInfo} backupModalvisible={this.state.backupModalvisible} />
                <RestoreModalForm {...this.props} promptMsg={this.props.promptMsg} handleHideRecoryModal={this.handleHideRecoryModal}
                    callTr={this.tr} restoreModalVisible={this.state.restoreModalVisible}/>
            </Content>
        )
    }

}

const BackupForm = Form.create()(Enhance(Backup));
const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    mainHeight: state.mainHeight,
    userType: state.userType,
    enterSave: state.enterSave,
    oemId: state.oemId
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        Start_Backupcontent:Actions.Start_Backupcontent,
        Get_backupinfo:Actions.Get_backupinfo,
        handle_Deletebackup:Actions.handle_Deletebackup,
        handle_Recoverbackup:Actions.handle_Recoverbackup,
        promptSpinMsg:Actions.promptSpinMsg,
        setPageStatus: Actions.setPageStatus,
        promptMsg: Actions.promptMsg
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(BackupForm));
