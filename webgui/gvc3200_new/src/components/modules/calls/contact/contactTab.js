import React, {Component, PropTypes} from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Enhance from "../../../mixins/Enhance";
import NewContactsEdit from "../../../newContactsEdit";
import ImportEdit from './import'
import ExportEdit from './export'
import CallSelectNum from './selectNum'
import DownloadContactsForm from "./download";
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm, Form, Menu, Dropdown, Popover } from "antd";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const NewContactsEditForm = Form.create()(NewContactsEdit);
const ImportEditForm = Form.create()(ImportEdit);
const ExportEditForm = Form.create()(ExportEdit);
const ContactsDownloadForm = Form.create()(DownloadContactsForm);

class ContactTab extends Component {
    contactList = [];
    selectedContactList = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            displayDelContactsModal: false,
            displayAddWhitelistModal: false,
            displayAddBlacklistModal: false,
            displayImportModal:false,
            displayExportModal:false,
            displayModal:false,
            displayDwonloadModal:false,
            addNewContact:false,
            items:[],
            groups:[],
            editContact:{},
            emailValues:[],
            numValues:[],
            curContactList: [],
            groupInformation: [],
            existActiveAccount: false,
            showtips: 'none'

        }
    }

    componentDidMount = () => {
        console.log('componentDidMount')
        this.updateContact();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed or selected account changed
            if (this.props.activeKey != nextProps.activeKey
                || this.props.curAccount != nextProps.curAccount) {
                // this.updateContact();
                this.props.getGroups((groups)=>{this.setState({groups:groups})});

            }
        }
        if (this.props.form == nextProps.form) {
            this._createData();
        }
        if($.isArray(nextProps.contactsInformation)
            && $.isArray(nextProps.contactsInformation)
            && this.props.contactsInformation.length !== nextProps.contactsInformation.length) {
            console.log('componentWillReceiveProps')
            this.updateContact();
            this._createData();
        }
    }


    updateContact = () => {
        this.props.getContactCount();
        this.props.getContacts((items)=>{this.setState({items:items})});
        this.props.getGroups((groups)=>{this.setState({groups:groups})});
        this.props.getContactsinfo();
        console.log('updateContact')
        if(!this.isEmptyObject(this.props.acctStatus)){
            this.setState({
                existActiveAccount: this.checkActiveAcct(this.props.acctStatus)
            });
        }else{
            this.props.getAcctStatus((result)=>{
                this.setState({
                    existActiveAccount: this.checkActiveAcct(result)
                });
            })
        }
    }

    checkActiveAcct = (acctStatus) =>{
        let acctstatus = acctStatus.headers;
        let max = 16;
        if(this.isWP8xx()) max = 2;

        for(let i = 0; i < max; i++){
            if(acctstatus[`account_${i}_status`] == "1"){
                return true;
            }
        }
        return false;
    }

    handleHideModal = () => {
        this.setState({displayModal:false,addNewContact:false})
    }

    handleHideImportModal = () => {
        this.setState({displayImportModal: false});
    }

    handleHideExportModal = () => {
        this.setState({displayExportModal: false});
    }

    handleHideDownloadModal = () => {
        this.setState({displayDwonloadModal: false})
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onSelectItem = (record, selected, selectedRows) => {
        let self = this;
        let name = record.row0;
        let number = record.row3.Number;
        let id = record.row3.Id;
        if (selected) {
            self.selectedContactList.push({name: name, number: number, id: id});
        } else {
            for (let j = 0; j < self.selectedContactList.length; j++) {
                if (self.selectedContactList[j].id == id) {
                    self.selectedContactList.splice(j, 1);
                    break;
                }
            }
        }
    }

    onSelectAllContacts = (selected, selectedRows) => {
        let self = this;
        if (selected) {
            if (self.contactList.length == 0) {
                self.selectedContactList = [...selectedRows];
            } else {
                for (let i = 0; i < selectedRows.length; i++) {
                    let name = selectedRows[i].row0;
                    let number = selectedRows[i].row3.Number;
                    let id = selectedRows[i].row3.Id;
                    for (var j = 0; j < self.selectedContactList.length; j++) {
                        if (self.selectedContactList[j].id == id ) {
                            break;
                        }
                    }
                    if (j == self.selectedContactList.length) {
                        self.selectedContactList.push({name: name, number: number,id: id});
                    }
                }
            }
        } else {
            for (let i = self.state.curContactList.length - 1; i >= 0; i--) {
                for (var j = 0; j < self.selectedContactList.length; j++) {
                    let item = self.state.curContactList[i]
                    let id = item.row3.Id;
                    if (self.selectedContactList[j].id == id) {
                        break;
                    }
                }
                if (j != self.selectedContactList.length) {
                    self.selectedContactList.splice(j, 1);
                }
            }
        }
    }
    showDelContactsModal =() =>{
        this.setState({ displayDelContactsModal: true });
    }

    handleDelContactsCancel =()=>{
        this.setState({ displayDelContactsModal: false });
    }

    showAddWhitelistModal =() =>{
        this.setState({ displayAddWhitelistModal: true });
    }

    handleAddWhitelistCancel =()=>{
        this.setState({ displayAddWhitelistModal: false });
    }

    showAddBlacklistModal = () => {
        this.setState({displayAddBlacklistModal: true});
    }

    handleAddBlacklistCancel = () =>{
        this.setState({displayAddBlacklistModal: false});
    }

    handleOkDeleteAll = () => {
        let datasource = this.selectedContactList
        let seletedArr = [];
        for (let i = 0; i <datasource.length ; i++) {
            seletedArr = seletedArr.concat(datasource[i].id)
        }
        var deleteId = seletedArr.join(',');
        this.props.removeContact(deleteId, (result) => {
            let searchkey = $("#search").val()
            if (searchkey) {
                $("#search").val("");
            }
            this.props.getContacts();
            this.selectedContactList = [];
            this._createData();
        });
        this.setState({
            selectedRowKeys: [],
            displayDelContactsModal: false
        });
    }

    showContactModal = () => {
        this.props.form.resetFields();
        this.setState({displayModal:true,addNewContact:true,emailValues:[""],numValues:[""]});
    }

    handleCall = (text, index) => {
        if(!this.state.existActiveAccount){
            this.props.promptMsg('WARNING','no_existActiveAcct');
            return;
        }
        if(this.props.callDialog == "minimize"){
            this.props.promptMsg('WARNING','a_talkingwait');
            return;
        }
        let source = 1;
        let curnum = text.Number[0].trim();
        let acct = text.AcctIndex[0];
        this.props.sendSingleCall(curnum, acct, 0, 0, source, 0);
    }

    handleEditItem = (text, index) => {
        // var firstname = text.firstname;
        var name = text.Name;
        console.log(text,text.Name)
        this.props.form.resetFields();
        let emailValues = this.state.emailValues;
        let numValues = this.state.numValues;
        emailValues.length = 0;
        numValues.length = 0;
        if (text.Emaill.length == 0) {
            emailValues = [''];
        }
        this.setState({displayModal:true,editContact:text,addNewContact:false});
        var obj = {
            name:name
        };
        for (var i = 0; i < text.AcctIndex.length; i++) {
            let acctstatus = this.props.acctStatus.headers;
            console.log('head',this.props.acctStatus.headers)
            var Index = text.AcctIndex[i];
            if(acctstatus[`account_${Index}_no`] == ""){
                text.AcctIndex[i] = '-1'
            }
            numValues.push(text.Number[i]+ " " + text.AcctIndex[i]);
            obj['bindaccount'+i] = text.AcctIndex[i];
            obj['accountnumber'+i] = text.Number[i];
        }
        for (var i = 0; i < text.Emaill.length; i++) {
            emailValues.push(text.Emaill[i]);
        }
        for (var i = 0; i < text.GroupName.length; i++) {
            obj['groupnumber' + text.GroupName[i] + text.GroupId[i]] = true;
        }
        this.setState({numValues: numValues, emailValues: emailValues})
        this.props.form.setFieldsValue(obj);
    }

    bouncer = (arr) => {
        return arr.filter(function(val) {
            return !(!val || val === "" || val === "undefined");
        });
    }

    checkRepeatName = (name) => {
        let data = this.props.contactsInformation
        console.log(this.props.contactsInformation)
        name = name ? name : ""
        // lastname = lastname ? lastname : ""
        for(var i = 0; data[i] != undefined; i++) {
            // console.log(data[i])
            if(data[i].Name == name)
                return true;
        }
        return false
    }

    _createName = (text, record, index) => {
        let status;
        status = <div style = {{'height':'33px'}} title={text}><span className = "contactsIcon"></span><span className = "ellips contactstext contactname">{text}</span></div>;
        return status;
    }

    _createNumber = (text) => {
        return <div style = {{'height':'33px'}} title={text}><span className = "ellips contactstext contactnumber" style={{ 'paddingLeft':'0'}}>{text}</span></div>;
    }

    _createActions = (text, record, index) => {
        let statue;
        var number = this.bouncer(text.Number);
        if (number.length > 1) {
            return (
                <div id = {text.Id} className = {"callRecord number" + number.join(',') } >
                    <Popover
                        content={
                            <CallSelectNum sendSingleCall = {this.props.sendSingleCall} selectnumItem={text} existActiveAccount={this.state.existActiveAccount}/>
                        }
                        placement="topRight"
                        trigger="focus"
                    >
                        <button className='allow-call' id = {'allow-call'+index}></button>
                    </Popover>
                    <button className='allow-edit' id = {'allow-edit'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
                </div>
            )
        } else {
            return (
                <div id = {text.Id} className = {"callRecord number" + number.join(',') } >
                    <button className='allow-call' id = {'allow-call'+index}  onClick={this.handleCall.bind(this, text, index)}></button>
                    <button className='allow-edit' id = {'allow-edit'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
                </div>
            )
        }
    }

    _createData = () => {
        if(!$.isArray(this.props.contactsInformation) || !$.isArray(this.props.groupInformation)
            || !$.isArray(this.props.contactsAcct) ) {
            return;
        }
        if (!$.isArray(this.props.contactinfodata)) {
            // this.props.getContactsinfo();
            return;
        }
        let contactsInformation  = this.props.contactsInformation;
        let groupInformation = this.props.groupInformation;
        let contactinfodata = this.props.contactinfodata;
        let contactsAcct = this.props.contactsAcct;
        let data = [];
        let contactItems = [];
        if (contactsInformation.length == 0) {
            this.setState({showtips:'block'})
        } else {
            this.setState({showtips:'none'})
        }
        for (let i = 0; i < contactsInformation.length; i++ ) {
            contactItems.push({
                key: i,
                Id: contactsInformation[i].Id,
                Name: contactsInformation[i].Name,
                Number: contactsInformation[i].Number,
                RawId: contactsInformation[i].RawId
            })
        }
        for (var i = 0; i < contactItems.length; i++) {
            contactItems[i]['GroupName'] = [];
            contactItems[i]['GroupId'] = [];
            for (var j = 0; j < groupInformation.length; j ++) {
                if ($.inArray(contactItems[i].RawId,groupInformation[j].ContactId) != -1) {
                    contactItems[i]['GroupName'].push(groupInformation[j].Name)
                    contactItems[i]['GroupId'].push(groupInformation[j].Id)
                }
            }
        }
        for (var i = 0; i < contactItems.length; i++) {
            contactItems[i]['Emaill'] = [];
            contactItems[i]['firstname'] = "";
            contactItems[i]['lastname'] = "";
            for (var j = 0; j < contactinfodata.length; j++ ) {
                if ((contactinfodata[j].RawId == contactItems[i].RawId) && (contactinfodata[j].InfoType == "1")) {
                    contactItems[i]['Emaill'].push(contactinfodata[j].Info)
                }
                if ((contactItems[i].RawId == contactinfodata[j].RawId)&&(contactItems[i].Name == contactinfodata[j].Info)&&(contactinfodata[j].InfoType == "7")) {
                    contactItems[i]['firstname'] = contactinfodata[j].FirstName;
                    contactItems[i]['lastname'] = contactinfodata[j].LastName;
                    break;
                }
            }
        }
        for (var i = 0; i < contactItems.length; i++) {
            contactItems[i]['AcctIndex'] = [];
            for (var j = 0; j < contactsAcct.length; j++) {
                if (contactsAcct[j].Id == contactItems[i].Id) {
                    contactItems[i]['AcctIndex'] = contactsAcct[j].AcctIndex
                }
            }
        }
        for ( var i = 0; i < contactItems.length; i++ ) {
            data.push({
                key: i,
                row0: contactItems[i].Name,
                row1: contactItems[i].Number.join(','),
                row2: contactItems[i].GroupName.join(','),
                row3: contactItems[i]
            })
        }
        this.contactList = data;
        this.setState({
            curContactList: data
        });
        return data
    }

    handleImport = () => {
        this.setState({displayImportModal: true});
    }

    handleExport = () => {
        this.setState({displayExportModal: true});
    }

    handleDownload = () => {
        this.setState({displayDwonloadModal: true});
    }

    handleChange = (e) => {
        var self = this;
        var searchkey = e.target.value.trim();
        let data = [];
        let dataSource = self.contactList
        if (searchkey === "") {
            data = [...dataSource];
        } else {
            let len = dataSource.length;
            for (let i = 0; i < len; i++) {
                let item = dataSource[i];
                let name = item.row0;
                let number = item.row3.Number[0];
                let groupname = item.row2;
                if (number.indexOf(searchkey) != -1 || name.indexOf(searchkey) != -1 || groupname.indexOf(searchkey) != -1) {
                    data.push(item);
                }
            }
        }

        let selectRows = [];
        for(let i = 0; i<self.selectedContactList.length;i++){
            for(let j=0;j<data.length;j++){
                let item = data[j];
                let name = item.row0;
                let id = item.row3.Id;
                if(self.selectedContactList[i].id == id){
                    selectRows.push(j);
                    break;
                }
            }
        }
        this.setState({
            curContactList: data,
            selectedRowKeys:selectRows
        });
    }

    render() {
        const callTr = this.props.callTr;
        const moreMenu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.handleImport.bind(this)}>{callTr("a_importcontacts")}</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.handleExport.bind(this)}>{callTr("a_exportcontacts")}</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.handleDownload.bind(this)}>{callTr("a_downloadcontacts")}</a>
                </Menu.Item>
            </Menu>
        );
        const curContactList = this.state.curContactList
        const columns = [{
            title: callTr("a_name"),
            // title: '',
            key: 'row0',
            dataIndex: 'row0',
            width: '25%',
            render: (text, record, index) => (
                this._createName(text, record, index)
            )
        }, {
            title: callTr("a_number"),
            // title: '',
            key: 'row1',
            dataIndex: 'row1',
            width: '25%',
            render: (text, record, index) => (
                this._createNumber(text)
            )
        }, {
            title: callTr("a_concatgroup"),
            // title: '',
            key: 'row2',
            dataIndex: 'row2',
            width: '25%'
        }, {
            // title: callTr("a_operate"),
            title: '',
            key: 'row3',
            dataIndex: 'row3',
            width: '25%',
            render: (text, record, index) => (
                this._createActions(text, record, index)
            )
        }];
        let data = curContactList;
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelectItem,
            onSelectAll: this.onSelectAllContacts
        }
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <div style={{margin:"0px 10px"}}>
                <div style={{margin:"4px 10px 10px 22px", height:'32px'}}>
                    <div style={{'float':'left'}}>
                        <Button className="select-delete" type="primary" disabled={!hasSelected} style={{marginRight:'10px'}} onClick={this.showDelContactsModal}>
                            <i className={!hasSelected ? "select-delete-icon" : ""} />
                            {this.tr("a_delete")}
                        </Button>
                        <Modal visible={this.state.displayDelContactsModal} title={this.tr("a_deletecontactstitle")} className="confirm-modal"
                               okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.handleOkDeleteAll} onCancel={this.handleDelContactsCancel}>
                            <p className="confirm-content">{this.tr("a_deletecontacts")}</p>
                        </Modal>
                        <Button type="primary" style={{marginRight:'10px'}} onClick={this.showContactModal}>
                            {this.tr("a_newcontact")}
                        </Button>
                        <Dropdown overlay={moreMenu} placement="bottomCenter">
                            <Button type="primary">{this.tr("a_more")}</Button>
                        </Dropdown>
                    </div>
                    <div style={{'float':'right'}}>
                        <div className = 'search_div'>
                            <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} id="search" onChange={this.handleChange.bind(this)} placeholder = {callTr("a_65")}></Input>
                        </div>
                    </div>
                </div>
                <div className = 'CallDiv Contactstable'>
                    <Table
                        rowSelection={rowSelection}
                        rowKey = ""
                        columns = { columns }
                        pagination = { false }
                        dataSource = { data }
                        // showHeader = { false }
                    />
                    <div className = "nodatooltips" style={{display: this.state.showtips}}>
                        <div></div>
                        <p>{this.tr("no_data")}</p>
                    </div>
                </div>
                <NewContactsEditForm {...this.props} emailValues={this.state.emailValues} numValues={this.state.numValues} updateContact={this.updateContact} groups={this.state.groups} editContact={this.state.editContact} handleSaveContactGroupId = {this.state.handleSaveContactGroupId} displayModal={this.state.displayModal} addNewContact={this.state.addNewContact} handleHideModal={this.handleHideModal} checkRepeatName={this.checkRepeatName} product={this.props.product} callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                <ImportEditForm {...this.props} displayImportModal={this.state.displayImportModal}  handleHideImportModal={this.handleHideImportModal}  callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                <ExportEditForm {...this.props} displayExportModal={this.state.displayExportModal}  handleHideExportModal={this.handleHideExportModal}  callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                <ContactsDownloadForm {...this.props} displayDwonloadModal={this.state.displayDwonloadModal} handleHideDownloadModal={this.handleHideDownloadModal} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    contactsInformation: state.contactsInformation,
    groupInformation: state.groupInformation,
    contactinfodata: state.contactinfodata,
    contactsAcct: state.contactsAcct,
    activeKey: state.TabactiveKey,
    callDialog: state.callDialog,
    acctStatus: state.acctStatus,
    product: state.product
})

const mapDispatchToProps = (dispatch) => {
    const actios = {
        getContacts:Actions.getContacts,
        getGroups:Actions.getGroups,
        removeContact:Actions.removeContact,
        addNewBlackMember: Actions.addNewBlackMember,
        getContactCount:Actions.getContactCount,
        setContacts:Actions.setContacts,
        getContactsinfo:Actions.getContactsinfo,
        sendSingleCall:Actions.sendSingleCall,
        addNewWhiteMember: Actions.addNewWhiteMember,
        getAcctStatus: Actions.getAcctStatus
    }

    return bindActionCreators(actios, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(ContactTab));
