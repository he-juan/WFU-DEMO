import React, {Component, PropTypes} from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Enhance from "../../../mixins/Enhance";
import NewContactsEdit from "../../../newContactsEdit";
import AddLocalcontacts from "../../../addLocalcontacts";
import NewConEdit from "../../../newConfEdit"
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm, Form ,Popover} from "antd";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const NewContactsEditForm = Form.create()(NewContactsEdit);
const AddLocalcontactsForm = Form.create()(AddLocalcontacts);
const NewConEditForm = Form.create()(NewConEdit)
const rowKey = function(record) {
    return record.key;
};
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
            showtips: 'none',
            contactsinfo:[],
            confMember:[]
        }
    }

    componentDidMount = () => {
        this.updateContact();
    }

    updateContact = () => {
        this.props.getContactCount();
        this.props.getContacts((items)=>{this.setState({items:items})});
        this.props.getGroups((groups)=>{this.setState({groups:groups})});
        // this.props.getContactsinfo((infos)=>{this.setState({contactsinfo:infos})});
        // this.props.getAllConfMember((memberinfo)=>{this.setState({confMember:memberinfo})})
        this.props.getContactsinfo();
        this.props.getAllConfMember()
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
            number = this.props.detailDiv.Number;
            account = this.props.detailDiv.Account;
        }
        let contactsInformation = this.props.contactsInformation;
        let buttonDisplay = '';
        // if (contactsInformation.length > 0) {
        //     for ( var i = 0; i <  contactsInformation.length; i++) {
        //         var a = contactsInformation[i].Number.indexOf(number);
        //         if ( a !== -1 && this.props.detailDiv.row6 === true) {
        //             buttonDisplay = 'none';
        //             break;
        //         } else {
        //             buttonDisplay = 'inline-block';
        //         }
        //     }
        // }
        // var detailItems = this.props.detailDiv.row3;
        var detailItemsToday = new Array;
        var detailItemsYestday = new Array;
        var detailItemsBefore = new Array;
        // for (var i = 0; i < (detailItems && detailItems.length); i++) {
        //     var value = this.props.isToday(parseInt(detailItems[i]['Date']));
        //     if (value == "Today") {
        //         detailItemsToday.push(detailItems[i])
        //     } else if (value == "Yestday") {
        //         detailItemsYestday.push(detailItems[i])
        //     } else if (value == "Before") {
        //         detailItemsBefore.push(detailItems[i])
        //     }
        // }
        const acctStatus = this.props.acctStatus;
        var accountItems = [];
        // for(var item in acctStatus.headers){
        //     accountItems[item]=acctStatus.headers[item]
        // }
        var accountNumber;
        // if (accountItems.response) {
        //     if (accountItems["account_"+ account + "_name"]) {
        //         accountNumber = accountItems["account_"+ account + "_name"]
        //     } else {
        //         accountNumber = accountItems["account_"+ account + "_no"]
        //     }
        // }
        return (
            <div className = {"containermask " + this.props.displayDiv}>
                <div id = "containerdiv ">
                    <div id = "contacteditdiv" className='addContact-select'>
                        <div id = "itemdetaildiv">
                            <div className = "titlediv">
                                <span>{callTr("a_select")}</span>
                                <div style = {{'float':'right'}} >
                                    <button type = "Button" onClick={this.handleClose}/>
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
            displayAddBlacklistModal: false,
            expandedRows:[],
            checkedAll: false,
            displayNewConfModal: false,
            confMemberData:[],
            addNewConf:false
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
        console.log(this.state.selectedRowKeys)
    }

    onSelectItem = (record, selected, selectedRows) => {
        let self = this;
        console.log('onSelectItem',record)
        let key = record.key
        let id = record.row0.logItem.Id
        // let name = record.row0.row0;
        // let number = record.row0.row1;
        // let id = record.row0.row4;
        if (selected) {
            self.selectedContactList.push({key: key, id: id});
        } else {
            for (let j = 0; j < self.selectedContactList.length; j++) {
                if (self.selectedContactList[j].id == id) {
                    self.selectedContactList.splice(j, 1);
                    break;
                }
            }
        }

        if (self.selectedContactList.length == self.state.curContactList.length && self.selectedContactList.length != 0) {
            this.state.checkedAll = true
        } else {
            this.state.checkedAll = false
        }
    }

    onSelectAllContacts = (e) => {
        this.state.checkedAll = e.target.checked
        let data = this.state.curContactList
        let selectedRowKeys = []
        let selectedContactList = []
        for (let i = 0; i < data.length; i++) {
            if(e.target.checked) {
                selectedRowKeys.push(data[i].key)
                selectedContactList.push({id:data[i].row0.logItem.Id})
            }
        }
        this.selectedContactList = selectedContactList
        this.setState({
            selectedRowKeys: selectedRowKeys
        });
    }


    handleOkDeleteAll = () => {
        let selectedRowKeys = this.state.selectedRowKeys
        let datasource = this.selectedContactList
        // let datasource = this.state.selectedRowKeys

        console.log(datasource)

        let seletedArr = [];

        for (let i = 0; i <datasource.length ; i++) {
            seletedArr = seletedArr.concat(datasource[i].id)
        }
        var deleteId = seletedArr.join(',');
        var flag = 2;
        this.get_deleteCallConf(deleteId,(result) => {
            if (result == 'success') {
                this.props.get_calllog(0);
                this.props.promptMsg('SUCCESS',"a_del_ok");
                this._createData();
                this.selectedContactList = [];
            }
        })

        // this.props.get_deleteCall(deleteId,flag, (result) => {
        //     if (result == 'success') {
        //         this.props.get_calllog(0);
        //         this.props.promptMsg('SUCCESS',"a_del_ok");
        //         this._createData();
        //         this.selectedContactList = [];
        //     }
        // });
        this.setState({
            selectedRowKeys: [],
            displayDelHistCallsModal: false
        });
    }

    _createRow0 = (text, record , index) => {
        // console.log('_createRow0',text)
        let logItem = text.logItem
        let memberArr = text.memberArr
        let nameStr = logItem.NameOrNumber + '：'
        for (let i = 0; memberArr[i] != undefined; i++) {
            if(i>0) {
                nameStr += '，'
            }
            nameStr += memberArr[i].recordName ? memberArr[i].recordName : memberArr[i].Name
        }
        // console.log(nameStr)
        // text = this.changerow0(text);
        // var name = text.row0;
        // var nameValue = name + ((text.row1.length > 1) ? " (" + text.row1.length + ")": "");
        return <span className={nameStr}><i className={"type" + logItem.Type}></i>{nameStr}</span>;
    }


    handleAddContact = (text) => {
        // text = this.changerow0(text);
        // console.log('text',text)
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
        let curnum = text.Number;

        if(curnum == "anonymous"){
            this.props.promptMsg('WARNING','a_tip_dialanonymous');
            return false;
        }

        let acct = text['Account'];
        var source;
        switch (text['Type']) {
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
        let logItem = text.logItem
        let content = []
        let memberArr = record.row0.memberArr
        if(memberArr.length>1) {
            for (let i = 0; memberArr[i] != undefined ; i++) {
                content.push(
                    <div className="select-callnum">
                        <span>{memberArr[i].Number}</span><span><button className='allow-call' id = {'allow-call'+index} onClick={this.handleCall.bind(this, memberArr[i], index)}></button></span>
                    </div>
                )
            }
            statue = <div id = {logItem.Id} className = {"callRecord" + " type" + logItem.Type}>
                <button className='allow-detail' id = {'allow-detail'+index}  onClick={this.handleNewConf.bind(this, memberArr, index)}></button>
                <Popover content={content} placement="leftTop" trigger="click">
                    <button className='allow-call' id = {'allow-call'+index}></button>
                </Popover>
            </div>;
        } else {
            statue =
            <div id = {logItem.Id} className = {"callRecord" + " type" + logItem.Type}>
                <button className={memberArr[0].recordName ? 'display-hidden allow-addContact' : 'display-inline allow-addContact'} id = {'allow-addContact'+index} onClick={this.handleAddContact.bind(this, memberArr[0], index)}></button>
                <button className='allow-detail' id = {'allow-detail'+index}  onClick={this.handleNewConf.bind(this, memberArr[0], index)}></button>
                <button className='allow-call' id = {'allow-call'+index} onClick={this.handleCall.bind(this, memberArr[0], index)}></button>
            </div>;
        }
        return statue;
    }

    _createData = () => {
        let dataResult = [];
        let logItemdata = this.props.logItemdata
        if (logItemdata.length == 0) {
            this.setState({showtips:'block'})
        } else {
            this.setState({showtips:'none'})
        }
        let confmember = this.props.confmemberinfodata
        let contactList = this.props.contactsInformation
        // console.log(confmember)
        for ( let i = 0; i < logItemdata.length; i++ ) {
            let data = {};
            let memberArr = []
            let haslogItem = false
            for (let j = 0; j < confmember.length; j++) {
                if(confmember[j].Id == logItemdata[i].Id) {
                    confmember[j].recordName = ''
                    for (let k = 0; k < contactList.length; k++) {
                        if(confmember[j].Number == contactList[k].Number) {
                            confmember[j].recordName = contactList[k].Name
                        }
                    }
                    memberArr.push(confmember[j])
                    haslogItem = true
                }
            }
            if (haslogItem) {
                data = {
                    logItem : logItemdata[i],
                    memberArr: memberArr
                }

                dataResult.push({
                    key: i,
                    row0: data,
                    row1: parseInt(logItemdata[i].Date),
                    row2: data
                })
            }
        }
        this.historyList = dataResult;
        this.setState({
            curContactList: dataResult
        });
        return dataResult
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

    handelOnRowClick(record) {
        //添加双击执行发那个法 获取自己维护的 数组，判断数组中是否包含 这行key，相应添加或者删除
        console.log('click')
        $('.line-hoverbg').removeClass('line-hoverbg')
        $('.ant-table-row:eq('+record.key+')').addClass('line-hoverbg')
        // let nodeStr =
        // console.log($('.ant-table-row:eq('+record.key+')'))
        // console.log(this)
        // console.log($("#search"))
        // console.log($('.' + record.row2))
        // console.log($('.' + record.row2).parent().parent())
        // console.log($('#call-line'+ record.key))
        // console.log($('#call-line'+ record.key).parent().parent())
        let expandedRows = this.state.expandedRows
        console.log(expandedRows,record.key)
        if(expandedRows.length > 0 && expandedRows[0] == record.key ) {
            console.log('here')
            this.setState({
                expandedRows: []
            });
        } else {
            this.setState({
                expandedRows: [record.key]
            });
        }
    }

    _createInlineName(text) {
        // text = this.changerow0(text);
        var nameValue = text.recordName ? text.recordName : text.Name

        // var nameValue = name + ((text.row1.length > 1) ? " (" + text.row1.length + ")": "");
        var className;
        if(text.IsVideo=='1') {
            className = 'typeVideo'
        } else {
            className = 'typeConf'
        }
        return <span className={name}><i className={className}></i>{nameValue}</span>;
    }
    _createInlineAction(text) {
        let status;
        status =
        <div className = {"callRecord"}>
            <button className={text.recordName ? 'display-hidden allow-addContact' : 'display-inline allow-addContact'}  onClick={this.handleAddContact.bind(this, text,0)}></button>
            <button className='allow-detail'  onClick={this.handleNewConf.bind(this, text,0)}></button>
            <button className='allow-call' onClick={this.handleCall.bind(this, text)}></button>
        </div>;
        return status;

    }

    expandedRowRender(record){	//显示内容和样式的渲染
        let data = record.row0.logItem
        let memberArr = record.row0.memberArr
        let status = [];
        for (let i = 0; memberArr[i] != undefined ; i++) {
            status.push(
                <div className="call-line">
                    <div className='call-line-info call-line-name'>{this._createInlineName(memberArr[i])}</div>
                    <div className='call-line-info call-line-number'>{memberArr[i].Number}</div>
                    <div className='call-line-info call-line-date'>{this.props.convertTime(memberArr[i].Date)}</div>
                    <div className='call-line-info call-line-duration'>{this.view_status_Duration(memberArr[i].Duration)}</div>
                    <div className='call-line-info call-line-act'>
                        {this._createInlineAction(memberArr[i])}
                    </div>
                </div>
            )
        }
        return status;
    }

    handleNewConf = (text) => {
        this.setState({
            displayNewConfModal: true,
            addNewConf:true,
            confMemberData:text
        })
    }

    handleHideNewConfModal = () => {
        this.setState({displayNewConfModal: false})
    }

    render() {
        const [contactsInformation, callTr, _createTime, isToday, convertTime, logItemdata, view_status_Duration,curContactList] =
            [this.props.contactsInformation, this.props.callTr, this.props._createTime, this.props.isToday, this.props.convertTime, this.props.logItemdata, this.props.view_status_Duration, this.state.curContactList];
        // console.log(contactsInformation,logItemdata,this.props.confmemberinfodata)
        // const confmember = this.props.confmemberinfodata
        const {getFieldDecorator} = this.props.form;
        // console.log('contactsInformation',contactsInformation)

        const columns = [{
            title: callTr("a_name"),
            key: 'row0',
            dataIndex: 'row0',
            width: '55%',
            render: (text, record, index) => (
                this._createRow0(text, record, index)
            )
        }, {
            title: callTr("a_4304"),
            key: 'row1',
            dataIndex: 'row1',
            width: '30%',
            render: (text, record, index) => (
                _createTime(text, record, index)
            )
        },{
            title: callTr("a_operate"),
            key: 'row2',
            dataIndex: 'row2',
            width: '15%',
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

        let checkall = false
        return (
            <div style={{margin:"0px 10px"}}>
                <div className='btnbox'>
                    <div style={{'float':'left'}}>
                        <Checkbox className='call-checkall' checked={this.state.checkedAll} defaultChecked={false} onChange={this.onSelectAllContacts}></Checkbox>
                        <Button className="select-delete" type="primary" disabled={!hasSelected} style={{marginRight:'10px'}} onClick={this.showDelHistCallsModal}>
                            <i className={!hasSelected ? "select-delete-icon" : ""} />
                            {this.tr("a_19067")}
                        </Button>
                        <Modal visible={this.state.displayDelHistCallsModal} title={this.tr("a_deletehiscalls")} className="confirm-modal"
                               okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.handleOkDeleteAll} onCancel={this.handleDelHistCallsCancel}>
                            <p className="confirm-content">{this.tr("a_deletecalls")}</p>
                        </Modal>
                    </div>
                    {/*<div style={{'float':'right'}}>*/}
                        {/*<div className = 'search_div'>*/}
                            {/*<Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} id="search" onChange={this.handleChange.bind(this)} placeholder = {callTr("a_65")}></Input>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                </div>
                <div className = 'CallDiv Callhistory'>
                    <Table
                        rowSelection={rowSelection}
                        rowKey = {rowKey}
                        columns = { columns }
                        pagination = { false }
                        dataSource = { data }
                        showHeader = { false }
                        expandIconAsCell={false}
                        expandedRowRender= {this.expandedRowRender.bind(this)}
                        onRowClick={this.handelOnRowClick.bind(this)}	//添加单击方法
                        expandedRowKeys={this.state.expandedRows}		//添加 回设置 展开的数组
                        expandIconColumnIndex={-1}
                    />
                    <div className = "nodatooltips" style={{display: this.state.showtips}}>
                        <div></div>
                        <p>{this.tr("no_data")}</p>
                    </div>
                </div>
                <ContactEditDiv {...this.props} contactsInformation={contactsInformation} view_status_Duration={view_status_Duration} isToday={isToday} convertTime = {convertTime} displayDiv={this.state.displayDiv}
                                detailDiv = {this.state.detailDiv} callTr={callTr} handleHide={this.handleHide} handleAddContact={this.handleAddContact} />
                <NewConEditForm {...this.props} callTr={this.props.callTr}
                                handleHideNewConfModal= {this.handleHideNewConfModal}
                                displayNewConfModal={this.state.displayNewConfModal}
                                confMemberData={this.state.confMemberData}
                                addNewConf={this.state.addNewConf}/>

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
    contactinfodata: state.contactinfodata,
    confmemberinfodata: state.confmemberinfodata

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
        getAllConfMember:Actions.getAllConfMember,
        get_deleteCallConf:Actions.get_deleteCallConf
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Call));
