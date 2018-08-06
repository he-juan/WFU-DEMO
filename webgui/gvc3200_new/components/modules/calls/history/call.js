import React, {Component, PropTypes} from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Enhance from "../../../mixins/Enhance";
import NewContactsEdit from "../../../newContactsEdit";
import AddLocalcontacts from "../../../addLocalcontacts";
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm, Form } from "antd";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const NewContactsEditForm = Form.create()(NewContactsEdit);
const AddLocalcontactsForm = Form.create()(AddLocalcontacts);

class ContactEditDiv extends Component {
    constructor(props){
        super(props);
        this.state = {
            editContact:{},
            displayModal:false,
            addNewContact:false,
            items:[],
            groups:[],
            handleSaveContactGroupId:new Function(),
            emailValues:[],
            numValues:[],
            displayLocalContactsModal:false,
            addnumber:'',
            addaccount:'',
            showtips: 'none'
        }
    }

    componentDidMount = () => {
        this.updateContact();
    }

    updateContact = () => {
        this.props.getContactCount();
        this.props.getContacts((items)=>{this.setState({items:items})});
        this.props.getGroups((groups)=>{this.setState({groups:groups})});
        this.props.getContactsinfo();
    }

    handleClose = () => {
        this.props.handleHide();
    }

    handleHideModal = () => {
        this.setState({displayModal:false,addNewContact:false})
    }

    handleEditContacts = (number, account) => {
        var containermask = document.getElementsByClassName("containermask")[0];
        containermask.style.display="none";
        let numValues = this.state.numValues;
        numValues.length = 0;
        this.setState({displayModal:true,addNewContact:true,emailValues:[""]});
        numValues.push(number + " " + account);
        this.setState({numValues:numValues})
    }

    handleaddLocalContacts = (number, account) => {
        this.setState({
            displayLocalContactsModal: true,
            addnumber: number,
            addaccount: account
        })
    }

    handleHideLocalContactsModal = () => {
        this.setState({displayLocalContactsModal: false})
    }

    handleOkDelete = ( item ) => {
        var divId = "logitemdiv" + item.Id;
        var div = document.getElementById(divId);
        var parentDiv = document.getElementById("logitemsdiv");
        var containerdiv = document.getElementById("containerdiv");
        this.props.get_deleteCall(item.Id, (result) => {
            if (result == 'success') {
                this.props.get_calllog(0);
                div.parentNode.removeChild(div);
                if (parentDiv.children.length == 0) {
                    containerdiv.style.display="none";
                }
            }
        });
    }

    checkRepeatName = (firstname,lastname) => {
        let data = this.props.contactinfodata
        firstname = firstname ? firstname : ""
        lastname = lastname ? lastname : ""
        for(var i = 0; data[i] != undefined; i++) {
            if(data[i].FirstName == firstname && data[i].LastName == lastname)
                return true;
        }
        return false
    }

    render() {
        const callTr = this.props.callTr;
        const convertTime = this.props.convertTime;
        var number;
        var account;
        var nameAccount;
        var numberaccount;
        if ( !$.isEmptyObject(this.props.detailDiv)) {
            number = this.props.detailDiv.row1[0];
            account = this.props.detailDiv.row3[0]['Account'];
            if (this.props.detailDiv.row0 === number) {
                nameAccount = number;
                numberaccount = ""
            } else {
                nameAccount = "("+number+")";
                numberaccount = this.props.detailDiv.row0;
            }
        }
        let contactsInformation = this.props.contactsInformation;
        let buttonDisplay = '';
        if (contactsInformation.length > 0) {
            for ( var i = 0; i <  contactsInformation.length; i++) {
                var a = contactsInformation[i].Number.indexOf(number);
                if ( a !== -1 && this.props.detailDiv.row6 === true) {
                    buttonDisplay = 'none';
                    break;
                } else {
                    buttonDisplay = 'inline-block';
                }
            }
        }
        var detailItems = this.props.detailDiv.row3;
        var detailItemsToday = new Array;
        var detailItemsYestday = new Array;
        var detailItemsBefore = new Array;
        for (var i = 0; i < (detailItems && detailItems.length); i++) {
            var value = this.props.isToday(parseInt(detailItems[i]['Date']));
            if (value == "Today") {
                detailItemsToday.push(detailItems[i])
            } else if (value == "Yestday") {
                detailItemsYestday.push(detailItems[i])
            } else if (value == "Before") {
                detailItemsBefore.push(detailItems[i])
            }
        }
        const acctStatus = this.props.acctStatus;
        var accountItems = [];
        for(var item in acctStatus.headers){
            accountItems[item]=acctStatus.headers[item]
        }
        var accountNumber;
        if (accountItems.response) {
            if (accountItems["account_"+ account + "_name"]) {
                accountNumber = accountItems["account_"+ account + "_name"]
            } else {
                accountNumber = accountItems["account_"+ account + "_no"]
            }
        }
        return (
            <div className = {"containermask " + this.props.displayDiv}>
                <div id = "containerdiv">
                    <div id = "contacteditdiv">
                        <div id = "itemdetaildiv">
                            <div className = "titlediv">
                                <span>{callTr("a_detail")}</span>
                                <div style = {{'float':'right'}} >
                                    <button type = "Button" onClick={this.handleClose}/>
                                </div>
                            </div>
                            <div id = "logdetaildiv">
                                <div>
                                    <div className = "user">
                                    </div>
                                    <div className = "userInfo">
                                        <span className = "infonum"><strong className = "name ellips">{numberaccount}</strong><strong className="number">{nameAccount}</strong></span>
                                        <span className = "infoaccout"><i></i>{accountNumber}<span className="localcount">{" (" + callTr("a_localaccount") + ")"}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div id = "logitemsdiv">
                                <div id = "logitemsdivtoday">
                                    <p className = {"items" + detailItemsToday.length}>{callTr("a_today")}</p>
                                    {
                                        detailItemsToday && detailItemsToday.map((item,idx,items) => {
                                            return (
                                                <div className = "logitemdiv" id = {"logitemdiv" + item.Id}>
                                                    <span className = "calldate"><i className={"type" + item.Type}></i>{convertTime(parseInt(item.Date))}</span>
                                                    <span className = "callDur">{this.props.view_status_Duration(item.Duration*1000)}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div id = "logitemsdivtoday">
                                    <p className = {"items" + detailItemsYestday.length}>{callTr("a_yestday")}</p>
                                    {
                                        detailItemsYestday && detailItemsYestday.map((item,idx,items) => {
                                            return (
                                                <div className = "logitemdiv" id = {"logitemdiv" + item.Id}>
                                                    <span className = "calldate"><i className={"type" + item.Type}></i>{convertTime(parseInt(item.Date))}</span>
                                                    <span className = "callDur">{this.props.view_status_Duration(item.Duration*1000)}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div id = "logitemsdivbefore">
                                    <p className = {"items" + detailItemsBefore.length}>{callTr("a_before")}</p>
                                    {
                                        detailItemsBefore && detailItemsBefore.map((item,idx,items) => {
                                            return (
                                                <div className = "logitemdiv" id = {"logitemdiv" + item.Id}>
                                                    <span className = "calldate"><i className={"type" + item.Type}></i>{convertTime(parseInt(item.Date))}</span>
                                                    <span className = "callDur">{this.props.view_status_Duration(item.Duration*1000)}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className = "appsbtn">
                                <Button type="primary" style={{marginRight:'15px',display:buttonDisplay,width:'170px'}} onClick={this.handleaddLocalContacts.bind(this, number, account)} >{callTr("a_addLocalcontact")}</Button>
                                <Button type="primary" style={{display:buttonDisplay,width:'160px'}} onClick={this.handleEditContacts.bind(this, number, account)} >{callTr("a_addcontact")}</Button>
                            </div>
                        </div>
                        <NewContactsEditForm {...this.props} emailValues={this.state.emailValues} numValues={this.state.numValues} updateContact={this.updateContact} groups={this.state.groups} editContact={this.state.editContact} handleSaveContactGroupId = {this.state.handleSaveContactGroupId} displayModal={this.state.displayModal} detailItems={this.state.detailItems} addNewContact={this.state.addNewContact} handleHideModal={this.handleHideModal} checkRepeatName={this.checkRepeatName} product={this.props.product} callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                        <AddLocalcontactsForm {...this.props} callTr={this.props.callTr} handleHideLocalContactsModal= {this.handleHideLocalContactsModal} displayLocalContactsModal={this.state.displayLocalContactsModal} addnumber={this.state.addnumber} addaccount={this.state.addaccount} />
                    </div>
                </div>
            </div>
        );
    }
}

class Call extends Component {
    historyList = [];
    selectedContactList = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            displayDiv: 'display-hidden',
            detailDiv: {},
            curContactList: [],
            existActiveAccount: false,
            displayDelHistCallsModal: false,
            displayAddWhitelistModal: false,
            displayAddBlacklistModal: false
        }
    }

    componentDidMount = () => {
        this.props.get_calllog(0);
        this.props.getAcctStatus((result)=>{
            if(!this.isEmptyObject(result)) {
                let acctstatus = result.headers;
                let max = 16;
                if(this.isWP8xx()) max = 2;

                for(let i = 0; i < max; i++){
                    if(acctstatus[`account_${i}_status`] == "1"){
                        this.setState({existActiveAccount: true});
                        break;
                    }
                }
            }
        });
    }

    componentWillReceiveProps = () => {
        this._createData();
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onSelectItem = (record, selected, selectedRows) => {
        let self = this;
        let name = record.row0.row0;
        let number = record.row0.row1;
        let id = record.row0.row4;
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
            if (self.historyList.length == 0) {
                self.selectedContactList = [...selectedRows];
            } else {
                for (let i = 0; i < selectedRows.length; i++) {
                    let item = selectedRows[i]
                    let name = item.row0.row0;
                    let number = item.row0.row1;
                    let id = item.row0.row4;
                    for (var j = 0; j < self.selectedContactList.length; j++) {
                        if (self.selectedContactList[j].id == id) {
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
                let index = null
                for (var j = 0; j < self.selectedContactList.length; j++) {
                    let id = self.state.curContactList[i].row0.row4
                    if (self.selectedContactList[j].id == id ) {
                        index = j
                        break;
                    }
                }
                if (j != self.selectedContactList.length) {
                    self.selectedContactList.splice(index, 1);
                }
            }
        }
    }

    handleAddBlacklist = () => {
        let datasource = this.selectedContactList
        var arrayNum = [];
        var arrayName = [];
        let contactItem;
        for (let i = 0; i <datasource.length ; i++) {
            contactItem = datasource[i];
            for(let j = 0; j < contactItem.number.length; j++){
                arrayName.push(contactItem.name);
                arrayNum.push(contactItem.number[j]);
            }
        }
        var numbers = arrayNum.join(':::');
        var names = arrayName.join(':::');
        this.props.addNewBlackMember(numbers, names, (result) => {
            this.selectedContactList = [] ;
        });
        this.setState({
            selectedRowKeys: [],
            displayAddBlacklistModal: false
        });
    }

    handleAddWhitelist = () => {
        let datasource = this.selectedContactList
        var arrayNum = [];
        var arrayName = [];
        let contactItem;
        for (let i = 0; i <datasource.length ; i++) {
            contactItem = datasource[i];
            for(let j = 0; j < contactItem.number.length; j++){
                arrayName.push(contactItem.name);
                arrayNum.push(contactItem.number[j]);
            }
        }
        var numbers = arrayNum.join(':::');
        var names = arrayName.join(':::');
        this.props.addNewWhiteMember(numbers, names, (result) => {
            this.selectedContactList = [] ;
        });
        this.setState({
            selectedRowKeys: [],
            displayAddWhitelistModal: false
        });
    }

    handleOkDeleteAll = () => {
        let datasource = this.selectedContactList
        let seletedArr = [];
        for (let i = 0; i <datasource.length ; i++) {
            seletedArr = seletedArr.concat(datasource[i].id)
        }
        var deleteId = seletedArr.join(',');
        var flag = 2;
        this.props.get_deleteCall(deleteId,flag, (result) => {
            if (result == 'success') {
                let self = this
                this.props.get_calllog(0);
                let searchkey = $("#search").val()
                setTimeout(function(){
                    self.props.promptMsg('SUCCESS',"a_del_ok");
                    self._createData();
                    if (searchkey) {
                        $("#search").val("");
                    }
                },500);
                this.selectedContactList = [];
            }
        });
        this.setState({
            selectedRowKeys: [],
            displayDelHistCallsModal: false
        });
    }

    _createName = (text, record , index) => {
        text = this.changerow0(text);
        var name = text.row0;
        var nameValue = name + ((text.row1.length > 1) ? " (" + text.row1.length + ")": "");
        return <span className={name}><i className={"type" + text['row3'][0].Type}></i>{nameValue}</span>;
    }

    handleEditItem = (text, index) => {
        text = this.changerow0(text);
        this.setState({
            displayDiv : "display-block",
            detailDiv: text
        });
    }

    changerow0 = (text) => {
        var msgsContacts = this.props.msgsContacts;
        let accountIndex = text.row0.split('--- ---')[1] || text.row5;
        text.row0 = text.row0.split('--- ---')[0];
        if (msgsContacts.length > 0) {
            for ( let i = 0; i <  msgsContacts.length; i++) {
                if((msgsContacts[i].Number == text.row1[0]) && (msgsContacts[i].AcctIndex == accountIndex)){
                    text.row0 = msgsContacts[i].Name;
                    if(msgsContacts[i].AcctIndex == accountIndex) {
                        text.row6 = true
                        text.row5 = accountIndex
                        break;
                    } else {
                        text.row6 = false
                    }
                }

            }
        }
        return text
    }

    showDelHistCallsModal = () => {
        this.setState({displayDelHistCallsModal: true});
    }

    handleDelHistCallsCancel = () =>{
        this.setState({displayDelHistCallsModal: false});
    }

    showAddWhitelistModal = () => {
        this.setState({displayAddWhitelistModal: true});
    }

    handleAddWhitelistCancel = () =>{
        this.setState({displayAddWhitelistModal: false});
    }

    showAddBlacklistModal = () => {
        this.setState({displayAddBlacklistModal: true});
    }

    handleAddBlacklistCancel = () =>{
        this.setState({displayAddBlacklistModal: false});
    }

    handleCall = (text, index) => {
        if(!this.state.existActiveAccount){
            this.props.promptMsg('WARNING','no_existActiveAcct');
            return false;
        }
        if(this.props.callDialog == "minimize"){
            this.props.promptMsg('WARNING','a_talkingwait');
            return;
        }
        let curnum = text.row1[0];

        if(curnum == "anonymous"){
            this.props.promptMsg('WARNING','a_tip_dialanonymous');
            return false;
        }

        let acct = text.row3[0]['Account'];
        var source;
        switch (text.row3[0]['Type']) {
            case "1":
                source = 3;
                break;
            case "2":
                source = 4;
                break;
            default:
                source = 0;
        }
        this.props.sendSingleCall(curnum, acct, 0, 0, source, 0)
    }

    handleHide = () => {
        this.setState({
            displayDiv:"display-hidden",
            detailDiv: {}
        });
    }

    _createActions = (text, record, index) => {
        let statue;
        statue = <div id = {text.Id} className = {"callRecord" + " type" + text['row3'][0].Type + " Id" + text['row4']}>
            <button className='allow-call' id = {'allow-call'+index}  onClick={this.handleCall.bind(this, text, index)}></button>
            <button className='allow-detail' id = {'allow-detail'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
        </div>;
        return statue;
    }

    _createData = () => {
        let data = [];
        let dataResult = [];
        let res = []
        var hash = {};
        var i = 0;
        let logItemdata = this.props.logItemdata
        if (logItemdata.length == 0) {
            this.setState({showtips:'block'})
        } else {
            this.setState({showtips:'none'})
        }
        for ( let i = 0; i < logItemdata.length; i++ ) {
            let row0data = logItemdata[i].NameOrNumber  + "--- ---" + logItemdata[i].Account
            if (logItemdata[i].IdentityName  !== '') {
                row0data = logItemdata[i].IdentityName  + "--- ---" + logItemdata[i].Account;
            }
            dataResult.push({
                key: i,
                row0: row0data,
                row1: logItemdata[i].NameOrNumber,
                row2: parseInt(logItemdata[i].Date),
                row3: logItemdata[i],
                row4: logItemdata[i].Id
            })
        }
        dataResult.forEach(function(item) {
            var row0 = item.row0;
            hash[row0] ? res[hash[row0] -1].row1.push(item.row1) && res[hash[row0] -1].row2.push(item.row2) && res[hash[row0] -1].row3.push(item.row3) && res[hash[row0] -1].row4.push(item.row4) : hash[row0]  = ++i && res.push({
                row0: row0,
                row1: [item.row1],
                row2: [item.row2],
                row3: [item.row3],
                row4: [item.row4]
            })
        });
        for ( let i = 0; i < res.length; i++ ) {
            data.push({
                key: i,
                row0: res[i],
                row1: res[i],
                row2: res[i].row1[0],
                row3: parseInt(res[i].row2[0]),
                row4: res[i]
            })
        }
        this.historyList = data;
        this.setState({
            curContactList: data
        });
        return data
    }

    handleChange = (e) => {
        var self = this;
        var searchkey = e.target.value.toLowerCase().trim();
        let data = [];
        let dataSource = self.historyList
        if (searchkey === "") {
            data = [...dataSource];
        } else {
            let len = dataSource.length;
            for (let i = 0; i < len; i++) {
                let item = dataSource[i];
                let name = item.row0.row0.toLowerCase();
                let number = item.row0.row1[0];
                if (number.indexOf(searchkey) != -1 || name.indexOf(searchkey) != -1) {
                    data.push(item);
                }
            }
        }

        let selectRows = [];
        for(let i = 0; i<self.selectedContactList.length;i++){
            for(let j=0;j<data.length;j++){
                let item = data[j];
                let name = item.row0.row0.toLowerCase();
                let number = item.row0.row1[0];
                if(self.selectedContactList[i].number === number && self.selectedContactList[i].name === name){
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
        const [contactsInformation, callTr, _createTime, isToday, convertTime, logItemdata, view_status_Duration,curContactList] =
            [this.props.contactsInformation, this.props.callTr, this.props._createTime, this.props.isToday, this.props.convertTime, this.props.logItemdata, this.props.view_status_Duration, this.state.curContactList];
        const columns = [{
            title: callTr("a_name"),
            key: 'row0',
            dataIndex: 'row0',
            width: '20%',
            render: (text, record, index) => (
                this._createName(text, record, index)
            )
        }, {
            title: callTr(""),
            key: 'row1',
            dataIndex: 'row1',
            width: '20%'
        }, {
            title: callTr("a_number"),
            key: 'row2',
            dataIndex: 'row2',
            width: '20%'
        }, {
            title: callTr("a_date"),
            key: 'row3',
            dataIndex: 'row3',
            width: '20%',
            render: (text, record, index) => (
                _createTime(text, record, index)
            )
        },{
            title: callTr("a_operate"),
            key: 'row4',
            dataIndex: 'row4',
            width: '20%',
            render: (text, record, index) => (
                this._createActions(text, record, index)
            )
        }];
        let data = [];
        if (curContactList) {
            data = curContactList;
        } else {
            data = this._createData();
        }
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
                        <Button className="select-delete" type="primary" disabled={!hasSelected} style={{marginRight:'10px'}} onClick={this.showDelHistCallsModal}>
                            <i className={!hasSelected ? "select-delete-icon" : ""} />
                            {this.tr("a_delete")}
                        </Button>
                        <Modal visible={this.state.displayDelHistCallsModal} title={this.tr("a_deletehiscalls")} className="confirm-modal"
                               okText={this.tr("a_ok")} cancelText={this.tr("a_cancel")} onOk={this.handleOkDeleteAll} onCancel={this.handleDelHistCallsCancel}>
                            <p className="confirm-content">{this.tr("a_deletecalls")}</p>
                        </Modal>
                        <Button type="primary" disabled={!hasSelected}  style={{marginRight:'10px'}} onClick={this.showAddWhitelistModal}>
                            {this.tr("a_whitelist")}
                        </Button>
                        <Modal visible={this.state.displayAddWhitelistModal} title={this.tr("a_whitelist")} className="confirm-modal"
                               okText={this.tr("a_ok")} cancelText={this.tr("a_cancel")} onOk={this.handleAddWhitelist} onCancel={this.handleAddWhitelistCancel}>
                            <p className="confirm-content">{this.tr("a_isWhitelist")}</p>
                        </Modal>
                        <Button type="primary" disabled={!hasSelected} onClick={this.showAddBlacklistModal}>
                            {this.tr("a_blacklist")}
                        </Button>
                        <Modal visible={this.state.displayAddBlacklistModal} title={this.tr("a_blacklist")} className="confirm-modal"
                               okText={this.tr("a_ok")} cancelText={this.tr("a_cancel")} onOk={this.handleAddBlacklist} onCancel={this.handleAddBlacklistCancel}>
                            <p className="confirm-content">{this.tr("a_isBlacklist")}</p>
                        </Modal>
                    </div>
                    <div style={{'float':'right'}}>
                        <div className = 'search_div'>
                            <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} id="search" onChange={this.handleChange.bind(this)} placeholder = {callTr("a_search")}></Input>
                        </div>
                    </div>
                </div>
                <div className = 'CallDiv Callhistory'>
                    <Table
                        rowSelection={rowSelection}
                        rowKey = ""
                        columns = { columns }
                        pagination = { false }
                        dataSource = { data }
                        showHeader = { true }
                    />
                    <div className = "nodatooltips" style={{display: this.state.showtips}}>
                        <div></div>
                        <p>{this.tr("no_data")}</p>
                    </div>
                </div>
                <ContactEditDiv {...this.props} contactsInformation={contactsInformation} view_status_Duration={view_status_Duration} isToday={isToday} convertTime = {convertTime} displayDiv={this.state.displayDiv}
                                detailDiv = {this.state.detailDiv} callTr={callTr} handleHide={this.handleHide} handleEditItem={this.handleEditItem} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    logItemdata: state.logItemdata,
    acctStatus: state.acctStatus,
    contactsInformation: state.contactsInformation,
    callDialog: state.callDialog,
    msgsContacts: state.msgsContacts,
    contactinfodata: state.contactinfodata

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_calllog: Actions.get_calllog,
        get_clear: Actions.get_clear,
        getAcctStatus:Actions.getAcctStatus,
        get_deleteCall: Actions.get_deleteCall,
        getContactCount:Actions.getContactCount,
        getContacts:Actions.getContacts,
        getGroups:Actions.getGroups,
        getTonelist:Actions.getTonelist,
        setContacts:Actions.setContacts,
        addNewBlackMember: Actions.addNewBlackMember,
        sendSingleCall: Actions.sendSingleCall,
        addNewWhiteMember: Actions.addNewWhiteMember,
        getContactsinfo:Actions.getContactsinfo,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Call));
