import React, {Component, PropTypes} from 'react';
import Enhance from "../../../mixins/Enhance";
import NewContactsEdit from "../callsPubModule/newContactsEdit";
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
let req_items;
let rowkeys =[]

class ContactTab extends Component {
    contactList = [];
    selectedContactList = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            displayDelContactsModal: false,
            displayClearContactModal: false,
            displayAddWhitelistModal: false,
            displayAddBlacklistModal: false,
            displayImportModal:false,
            displayExportModal:false,
            displayModal:false,
            displayDwonloadModal:false,
            addNewContact:false,
            groups:[],
            editContact:{},
            emailValues:[],
            numValues:[],
            curContactList: [],
            groupInformation: [],
            existActiveAccount: false,
            showtips: 'none',
            acctstatus: [],
            selacct:-1,
            curAcct:null,
            curPage: 1,
            updateState: '',
            maxImportCount: ''

        }
        req_items = new Array;
        req_items.push(
            this.getReqItem("defaultAcct", "22046", ""),
            this.getReqItem("disdialplan", "2382", ""),
            this.getReqItem("maxImportCount", 1688, "")
        );
        this.callmode="0"; // "0": normal call;  "1": IP call
    }

    componentDidMount = () => {
        // let self = this
        // if(!this.props.groupInformation.length) {
        //     this.props.getGroups((groups)=>{this.setState({groups:groups})});
        // } else {
        //     this.setState({groups:this.props.groupInformation})
        // }
        // if(!this.props.contactsInformation.length) {
        //     this.props.getContacts((items)=>{this.setState({items:items})});
        // }
        // if(!this.props.contactinfodata.length) {
        //     this.props.getContactsinfo();
        //     setTimeout(function () {
        //         self._createData();
        //     },500)
        // }
        let showloading = true

        this.props.getItemValues(req_items, (values) => {
            let defaultacct = values["defaultAcct"] == "8" ? 3 : values["defaultAcct"] || "-1"
            this.setState({
                defaultacct: defaultacct,
                selacct: defaultacct,
                maxImportCount: values.maxImportCount
            });
        });
        let data = this.props.contactsNew
        // console.log(this.props.contactsNew)
        if(!data.length) {
            this.updateContact(showloading);
        } else {
            this.handleContactData(data)
        }

        this.props.getAcctStatus((acctstatus) => {
            if (!this.isEmptyObject(acctstatus)) {
                this.getAcctStatusData(acctstatus);
            }
        });

        // this._createData();
    }

    getAcctStatusData = (acctstatus) => {
        let curAcct = [];
        let selacct = this.state.selacct;
        const acctStatus = acctstatus.headers;
        let max = 4;
        for (let i = 0; i < max; i++) {
            if (i == 3) {
                curAcct.push(
                    {
                        "acctindex": i,
                        "register": acctStatus[`account_${6}_status`],
                        "activate": acctStatus[`account_${6}_activate`],
                        "num": acctStatus[`account_${6}_name`],
                        "name": "H.323"
                    });
                if(acctStatus[`account_${6}_activate`] == "1" && selacct == -1){
                    this.setState({selacct: 3});
                }
            } else {
                if(acctStatus[`account_${i}_activate`] == "1" && selacct == -1){
                    this.setState({selacct: i});
                }
                let accountname = acctStatus[`account_${i}_name`];
                if (i == 0) {
                    if (acctStatus[`account_${i}_name`].length > 0) {
                        accountname = acctStatus[`account_${i}_name`];
                    } else if (acctStatus[`account_${i}_no`].length > 0) {
                        accountname = acctStatus[`account_${i}_no`];
                    } else {
                        accountname = "SIP";
                    }
                }
                curAcct.push(
                    {
                        "acctindex": i,
                        "register": acctStatus[`account_${i}_status`],
                        "activate": acctStatus[`account_${i}_activate`],
                        "num": acctStatus[`account_${i}_no`],
                        "name": accountname
                    });
            }
        }
        this.setState({acctstatus: curAcct});
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed or selected account changed
            if (this.props.activeKey != nextProps.activeKey
                || this.props.curAccount != nextProps.curAccount) {
                // this.updateContact();
                this.props.getGroups((groups)=>{this.setState({groups:groups})});
                this.handleContactData(nextProps.contactsNew)
            }
            if (this.props.form == nextProps.form) {
                // this._createData();
            }
            if($.isArray(nextProps.contactsNew)
                && $.isArray(nextProps.contactsNew)
                && this.props.contactsNew.length !== nextProps.contactsNew.length) {
                this.handleContactData(nextProps.contactsNew)
                // this._createData();
            }
        }
    }


    updateContact = (showloading) => {
        // this.props.getContactCount();
        this.props.getContacts_new()
        this.handleContactData(this.props.contactsNew)
        // this.props.getContacts((items)=>{this.setState({updateState:''})});
        this.props.getGroups((groups)=>{this.setState({groups:groups})});
        this.props.getContactsinfo(showloading);
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
        let searchkey = $("#search").val()
        if (searchkey!='') {
            $("#search").val("");
        }
        // setTimeout(()=> this._createData(),500)
    }

    handleContactData = (contactsData) => {
        let curContactList = []
        contactsData.forEach(item => {
            let phoneStr = ''
            let phoneArr = []
            item.phone.forEach(phone => {
                if(phoneStr){
                    phoneStr += ','
                }
                phoneStr += phone.number
                phoneArr.push(phone.number)
            })
            let groupStr = ''
            let groupArr = []
            item.group.forEach(group => {
                if(groupStr){
                    groupStr += ','
                }
                groupStr += group.name
                groupArr.push(group.name)
            })
            let row0 = {
                name:item.name.displayname,
                isfavourite:item.isfavourite
            }
            let data = {
                key: 'c' + item.id,
                row0: row0,
                row1: phoneArr,
                row2: groupArr,
                row3: item,
                name: item.name.displayname,

                // number: phone.number,
                // acct: phone.acct,
                // isvideo: 1,
                // source: 1, // 联系人呼出source 为1
            }
            curContactList.push(data)
        })
        this.contactList = curContactList
        this.setState({curContactList,curContactList})
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

    onSelectChange = (selectedRowKeys,selectedRows) => {
        let page = this.state.curPage
        this.setState({selectedRowKeys,selectedRows});
        if(page!=1) {
            let arr = []
            let data = this.getCurSelectedRows(page)
            for (let i = 0; i < selectedRowKeys.length; i++) {
                arr.push(data[selectedRowKeys[i]])
            }
            this.setState({selectedRows:arr});
        }
        rowkeys = selectedRowKeys
    }

    onSelectItem = (record, selected, selectedRows) => {
        let selectedRowKeys = rowkeys
        let page = this.state.curPage
        if(page!=1) {
            selectedRows = []
            let data = this.getCurSelectedRows(page)
            for (let i = 0; i < selectedRowKeys.length; i++) {
                selectedRows.push(data[selectedRowKeys[i]])
            }
            this.setState({selectedRows:selectedRows});
        }
    }

    onSelectAllContacts = (selected, selectedRows) => {
        let page = this.state.curPage
        if(page != 1) {
            selectedRows = this.getCurSelectedRows(page)
        }
    }

    getCurSelectedRows = (page) =>{
        if(page == 1) {
            return
        }
        let selectedRows = []
        let pagesize = 15
        let begin = pagesize * (page-1)
        let i = 0
        while (i<15) {
            selectedRows.push(this.state.curContactList[begin+i])
            i+=1
        }
        this.setState({selectedRows:selectedRows})
        return selectedRows
    }

    showDelContactsModal =() =>{
        this.setState({ displayDelContactsModal: true });
    }

    handleDelContactsCancel =()=>{
        this.setState({ displayDelContactsModal: false });
    }

    showClearContactsModal =() =>{
        this.setState({ displayClearContactModal: true });
    }

    handleClearContactsCancel =()=>{
        this.setState({ displayClearContactModal: false });
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
        let data = this.state.selectedRows
        // console.log(data)
        let deleteid = ""
        for (let i = 0; i < data.length; i++) {
            let id = data[i].row3.id
            if(deleteid) {
                deleteid += ","
            }
            deleteid += id
        }
        this.props.removeContact(deleteid, () => {
            this.updateContact()
            // this.props.getContacts((items)=>{this.setState({updateState:''})});
            // this._createData();
            // let searchkey = $("#search").val()
            // if (searchkey) {
            //     $("#search").val("");
            // }
        })
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
            displayDelContactsModal: false
        });
    }

    handleOkClearAll = () => {
        // console.log('clear')
        // this.props.clearContact()
        this.handleClearContactsCancel()
    }

    showContactModal = () => {
        this.props.form.resetFields();
        this.setState({displayModal:true,addNewContact:true,emailValues:[""],numValues:[""]});
    }

    handleCall = (text, index) => {
        let {acctstatus} = this.state;
        let curnum = text.number;
        let acct = text.acct;
        this.props.cb_start_single_call(acctstatus, curnum, acct, 0, 0, 0 , 0);
    }

    handleEditItem = (text, index) => {
        // console.log('edit',text)
        var name = text.name.displayname;
        this.props.form.resetFields();
        let emailValues = this.state.emailValues;
        let numValues = this.state.numValues;
        emailValues.length = 0;
        numValues.length = 0;
        if (text.email.length == 0) {
            emailValues = [''];
        }
        let email = ''
        if(text.email[0]) {
            email = text.email[0].address
        }
        this.setState({displayModal:true,editContact:text,addNewContact:false});
        var obj = {
            name: name,
            email: email,
            address: text.address,
            note: text.note,
            website: text.website
        };
        // for (var i = 0; i < text.phone.length; i++) {
            // let acctstatus = this.props.acctStatus.headers;
            // var Index = text.AcctIndex[i];
            // if(acctstatus[`account_${Index}_no`] == ""){
            //     text.AcctIndex[i] = '-1'
            // }
            // numValues.push(text.Number[i]+ " " + text.AcctIndex[i]);
            // obj['bindaccount'+i] = text.AcctIndex[i];
            // obj['accountnumber'+i] = text.Number[i];
        // }
        text.phone.forEach((item,i) => {
            // console.log(i,item)
            let acctstatus = this.props.acctStatus.headers;
            let Index = item.acct;
            if(acctstatus[`account_${Index}_no`] == ""){
                text.acct = '-1'
            }
            obj['bindaccount'+i] = item.acct;
            obj['accountnumber'+i] = item.number;
            numValues.push(item.number+ "--- ---" + item.acct)
        })
        for (var i = 0; i < text.email.length; i++) {
            emailValues.push(text.email[i].address);
        }
        for (var i = 0; i < text.group.length; i++) {
            obj['groupnumber' + text.group[i].name + text.group[i].id] = true;
        }
        this.setState({numValues: numValues, emailValues: emailValues})
        // console.log(obj)
        this.props.form.setFieldsValue(obj);
    }

    bouncer = (arr) => {
        return arr.filter(function(val) {
            return !(!val.number || val.number === "" || val.number === "undefined");
        });
    }

    checkRepeatName = (name) => {
        let data = this.props.contactsInformation
        name = name ? name : ""
        for(var i = 0; data[i] != undefined; i++) {
            if(data[i].Name == name)
                return true;
        }
        return false
    }

    _createName = (text, record, index) => {
        let status;
        // console.log(text)
        status = <div style = {{'height':'33px'}} title={text.name}><span className = {'contactsIcon' + text.isfavourite == '1' ? " contactsIcon_fav" : ""}></span><span className = "ellips contactstext contactname">{text.name}</span></div>;
        return status;
    }

    _createNumberOrGroup = (text) => {
        let content = []
        text.forEach((item, i) => {
            let str = ''
            if(i>0) {
                str += ' ,'
            }
            str += item
            content.push(
                <span className = "ellips contactstext contactnumber" style={{ 'paddingLeft':'0'}} title={item}>{str}</span>
            )
        })
        return <div style = {{'height':'33px'}} title={text}>{content}</div>
    }

    _createActions = (text, record, index) => {
        // return null
        let statue;
        var number = this.bouncer(text.phone);
        let callTitle = this.tr('a_504')
        let editTitle = this.tr('a_22')
        if (number.length > 1) {
            return (
                <div id = {text.id} className = {"callRecord number" + number.join(',') } >
                    <Popover
                        content={
                            <CallSelectNum sendSingleCall = {this.props.sendSingleCall} selectnumItem={text.phone} existActiveAccount={this.state.existActiveAccount}/>
                        }
                        placement="topRight"
                        trigger="focus"
                    >
                        <button title={callTitle} className='allow-call' id = {'allow-call'+index}></button>
                    </Popover>
                    <button className='allow-edit' title={editTitle} id = {'allow-edit'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
                </div>
            )
        } else {
            return (
                <div id = {text.Id} className = {"callRecord number" + number.join(',') } >
                    <button title={callTitle} className='allow-call' id = {'allow-call'+index}  onClick={this.handleCall.bind(this, text.phone[0], index)}></button>
                    <button title={editTitle} className='allow-edit' id = {'allow-edit'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
                </div>
            )
        }
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
        var searchkey = e.target.value.trim().toUpperCase();
        let data = [];
        let dataSource = self.contactList
        // console.log(dataSource)
        if (searchkey === "") {
            data = [...dataSource];
        } else {
            let len = dataSource.length;
            for (let i = 0; i < len; i++) {
                let item = dataSource[i];
                let name = item.row0.name.toUpperCase();
                let number = item.row1.join(',');
                let groupname = item.row2.join(',');
                // let Pinyin = item.row3.Pinyin;
                // let PinyinFirst = item.row3.PinyinFirst;
                if (number.indexOf(searchkey) != -1
                || name.indexOf(searchkey) != -1
                || groupname.indexOf(searchkey) != -1) {
                    data.push(item);
                }
            }
        }

        let selectRows = [];
        for(let i = 0; i<self.selectedContactList.length;i++){
            for(let j=0;j<data.length;j++){
                let item = data[j];
                let name = item.row0.name;
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

    changePage = (pageNumber) => {
        this.setState({
            curPage: pageNumber,
            selectedRows: [],
            selectedRowKeys:[]
        });
    }

    render() {
        // console.log(this.props.contactsInformation,this.props.groupInformation,this.props.contactsAcct)
        // if(JSON.stringify(this.props.contactsInformation) == '{}' || JSON.stringify(this.props.groupInformation) == '{}'
        //     || JSON.stringify(this.props.contactsAcct)== '{}' ) {
        //     return null;
        // }
        const callTr = this.props.callTr;
        const moreMenu = (
            <Menu>
                <Menu.Item>
                    <a onClick={this.handleImport.bind(this)}>{callTr("a_4806")}</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.handleExport.bind(this)}>{callTr("a_4807")}</a>
                </Menu.Item>
                <Menu.Item>
                    <a onClick={this.handleDownload.bind(this)}>{callTr("a_4808")}</a>
                </Menu.Item>
            </Menu>
        );
        const curContactList = this.state.curContactList
        // console.log('curContactList',curContactList)
        const columns = [{
            title: callTr("a_19626"),
            // title: '',
            key: 'row0',
            dataIndex: 'row0',
            width: '25%',
            render: (text, record, index) => (
                this._createName(text, record, index)
            )
        }, {
            title: callTr("a_10006"),
            // title: '',
            key: 'row1',
            dataIndex: 'row1',
            width: '25%',
            render: (text, record, index) => (
                this._createNumberOrGroup(text)
            )
        }, {
            title: callTr("a_4779"),
            // title: '',
            key: 'row2',
            dataIndex: 'row2',
            width: '25%',
            render: (text, record, index) => (
                this._createNumberOrGroup(text)
            )
        }, {
            // title: callTr("a_44"),
            title: '',
            key: 'row3',
            dataIndex: 'row3',
            width: '25%',
            render: (text, record, index) => (
                this._createActions(text, record, index)
            )
        }];
        let pageobj = false
        // let data = []
        let data = curContactList;
        // console.log(data)
        if(data.length>15) {
            pageobj = {
                pageSize: 15,
                onChange:this.changePage
            }
        }
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelectItem,
            onSelectAll: this.onSelectAllContacts
        }
        const hasSelected = selectedRowKeys.length > 0;
        let disAddMember = false
        let maxImportCount = this.state.maxImportCount ? this.state.maxImportCount : 2000
        if(data.length == maxImportCount) {
            disAddMember = true
        }
        return (
            <div style={{margin:"0px 10px"}}>
                <div style={{margin:"4px 10px 10px 22px", height:'32px'}}>
                    <div style={{'float':'left'}}>
                        <Button className="select-delete" type="primary" disabled={!hasSelected} style={{marginRight:'10px'}} onClick={this.showDelContactsModal}>
                            <i className={!hasSelected ? "select-delete-icon" : ""} />
                            {this.tr("a_19067")}
                        </Button>
                        <Modal visible={this.state.displayDelContactsModal} title={this.tr("a_4798")} className="confirm-modal"
                               okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.handleOkDeleteAll} onCancel={this.handleDelContactsCancel}>
                            <p className="confirm-content">{this.tr("a_4795")}</p>
                        </Modal>
                        <Button className="select-delete" type="primary" style={{marginRight:'10px'}} onClick={this.showClearContactsModal}>
                            <i/>{this.tr("a_404")}
                        </Button>
                        <Modal visible={this.state.displayClearContactModal} title={this.tr("清空联系人")} className="confirm-modal"
                               okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.handleOkClearAll} onCancel={this.handleClearContactsCancel}>
                            <p className="confirm-content">{this.tr("确定清空所有联系人？")}</p>
                        </Modal>
                        <Button type="primary" style={{marginRight:'10px'}} disabled={disAddMember} onClick={this.showContactModal}>
                            {this.tr("a_4840")}
                        </Button>
                        <Dropdown overlay={moreMenu} placement="bottomCenter">
                            <Button type="primary">{this.tr("a_19070")}</Button>
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
                        pagination = { pageobj }
                        dataSource = { data }
                        // showHeader = { false }
                    />
                    { data.length > 0 ?
                        null:
                        <div className = "nodata_tip">
                            <p>
                                {`没有联系人，试试“`}
                                <span onClick={this.showContactModal}>{this.tr('a_9046')}</span>
                                {`”，“`}
                                <span onClick={this.handleImport.bind(this)}>{this.tr('a_4806')}</span>
                                {`"或"`}
                                <span onClick={this.handleDownload.bind(this)}>{this.tr('a_4808') + `"`}</span>

                            </p>
                        </div>
                    }
                </div>
                {
                    this.state.displayImportModal ?
                    <ImportEditForm  displayImportModal={this.state.displayImportModal} contactNum = {data.length} maxImportCount ={maxImportCount}  handleHideImportModal={this.handleHideImportModal}  callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                    : null
                }
                {
                    this.state.displayExportModal ?
                    <ExportEditForm  displayExportModal={this.state.displayExportModal} contactsInformation={this.props.contactsInformation} handleHideExportModal={this.handleHideExportModal}  callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                    : null
                }
                {
                    this.state.displayDwonloadModal ?
                    <ContactsDownloadForm  displayDwonloadModal={this.state.displayDwonloadModal} contactNum = {data.length} maxImportCount ={maxImportCount} handleHideDownloadModal={this.handleHideDownloadModal} callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} />
                    : null
                }
                <NewContactsEditForm {...this.props} emailValues={this.state.emailValues} numValues={this.state.numValues} updateContact={this.updateContact} groups={this.state.groups}
                editContact={this.state.editContact} handleSaveContactGroupId = {this.state.handleSaveContactGroupId} displayModal={this.state.displayModal} addNewContact={this.state.addNewContact}
                handleHideModal={this.handleHideModal} checkRepeatName={this.checkRepeatName} product={this.props.product} callTr={this.props.callTr} getReqItem ={this.props.getReqItem}
                getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode} defaultacct ={this.state.defaultacct}/>

                {/* <ImportEditForm  displayImportModal={this.state.displayImportModal}  handleHideImportModal={this.handleHideImportModal}  callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                <ExportEditForm  displayExportModal={this.state.displayExportModal}  handleHideExportModal={this.handleHideExportModal}  callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                <ContactsDownloadForm  displayDwonloadModal={this.state.displayDwonloadModal} handleHideDownloadModal={this.handleHideDownloadModal} callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} />  */}
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
    product: state.product,
    contactsNew: state.contactsNew
})

const mapDispatchToProps = (dispatch) => {
    const actios = {
        getContacts:Actions.getContacts,
        getGroups:Actions.getGroups,
        removeContact:Actions.removeContact,
        getContactCount:Actions.getContactCount,
        setContacts:Actions.setContacts,
        getContactsinfo:Actions.getContactsinfo,
        sendSingleCall:Actions.sendSingleCall,
        getAcctStatus: Actions.getAcctStatus,
        cb_start_single_call:Actions.cb_start_single_call,
        getContacts_new:Actions.getContactsNew,
        clearContact:Actions.clearContact
    }

    return bindActionCreators(actios, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(ContactTab));
