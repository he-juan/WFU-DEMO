import React, {Component, PropTypes} from 'react';
import Enhance from "../../../mixins/Enhance";
import NewContactsEdit from "../callsPubModule/newContactsEdit";
import AddLocalcontacts from "../callsPubModule/addLocalcontacts";
import NewConEdit from "../callsPubModule/newConfEdit"
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
let req_items;
class ContactEditDiv extends Component {
    curData = [];
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
            confMember:[],
            acctstatus: [],
            selacct:-1,
            curAcct:null

        }
    }

    componentDidMount = () => {
        if(!this.props.groupInformation.length) {
            this.props.getGroups((groups)=>{this.setState({groups:groups})});
        } else {
            this.setState({groups:this.props.groupInformation})
        }
    }

    updateContact = () => {
        // this.props.getContactCount();
        this.props.getContacts((items)=>{this.setState({items:items})});
        this.props.getGroups((groups)=>{this.setState({groups:groups})});
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
        var number;
        var account;
        if ( !$.isEmptyObject(this.props.detailDiv)) {
            number = this.props.detailDiv.Number;
            account = this.props.detailDiv.Account;
        }
        let buttonDisplay = '';
        return (
            <div className = {"containermask " + this.props.displayDiv}>
                <div id = "containerdiv ">
                    <div id = "contacteditdiv" className='addContact-select'>
                        <div id = "itemdetaildiv">
                            <div className = "titlediv">
                                <span>{callTr("a_73")}</span>
                                <div style = {{'float':'right'}} >
                                    <button type = "Button" onClick={this.handleClose}/>
                                </div>
                            </div>
                            <div className = "appsbtn">
                                <Button type="primary" style={{marginRight:'15px',display:buttonDisplay,width:'170px'}} onClick={this.handleaddLocalContacts.bind(this, number, account)} >{callTr("a_19629")}</Button>
                                <Button type="primary" style={{display:buttonDisplay,width:'160px'}} onClick={this.handleEditContacts.bind(this, number, account)} >{callTr("a_15003")}</Button>
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
        this.props.getAcctStatus((acctstatus) => {
            if (!this.isEmptyObject(acctstatus)) {
                this.getAcctStatusData(acctstatus);
            }
        });
        this.props.getItemValues(req_items, (values) => {
            let defaultacct = values["defaultAcct"] == "8" ? 3 : values["defaultAcct"] || "-1"
            this.setState({
                defaultacct: defaultacct,
                selacct: defaultacct
            });
        });
    }

    componentWillReceiveProps = () => {
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

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onSelectItem = (record, selected, selectedRows) => {
        let self = this;
        let key = record.key
        let id = record.row0.logItem.Id
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
        // this.state.checkedAll = e.target.checked
        let selected = e.target.checked

        let data =this.curData
        let selectedRowKeys = []
        let selectedContactList = []
        for (let i = 0; i < data.length; i++) {
            if(selected) {
                selectedRowKeys.push(data[i].key)
                selectedContactList.push({id:data[i].row0.logItem.Id})
            }
        }
        this.selectedContactList = selectedContactList
        this.setState({
            selectedRowKeys: selectedRowKeys,
            checkedAll:selected
        });
    }


    handleOkDeleteAll = () => {
        let datasource = this.selectedContactList
        let seletedConfArr = [];
        let seletedCallArr = [];
        for (let i = 0; i <datasource.length ; i++) {
            if(datasource[i].IsConf == '1') {
                seletedConfArr = seletedConfArr.concat(datasource[i].id)
            } else {
                seletedCallArr = seletedCallArr.concat(datasource[i].id)
            }
        }
        let self = this
        var delconf = new Promise(function(resolve, reject) {
            if (seletedConfArr.length) {
                let deleteId = seletedConfArr.join(',');
                self.props.get_deleteCallConf(deleteId,(result) => {
                    if (result == 'success') {
                        resolve('success')
                    } else {
                        reject()
                    }
                })
            }
        })
        var delcall = new Promise(function(resolve, reject) {
            if(seletedCallArr.length) {
                let deleteId = seletedCallArr.join(',');
                let flag = 2;
                self.props.get_deleteCall(deleteId,flag, (result) => {
                    if (result == 'success') {
                        resolve('success')
                    } else {
                        reject()
                    }
                });
            }
        })
        var promiseAll
        if(seletedConfArr.length > 0 && seletedCallArr.length > 0) {
            promiseAll = Promise.all([delconf,delcall])
        } else if (seletedConfArr.length > 0) {
            promiseAll = Promise.all([delconf])
        } else {
            promiseAll = Promise.all([delcall])
        }

        promiseAll.then(function (res) {
            self.props.get_calllog(0);
            setTimeout(function () {
                self.props.promptMsg('SUCCESS', "a_57");
                // self._createData();
            }, 500);
            self.selectedContactList = [];
        })
        this.selectedContactList = []
        this.setState({
            selectedRowKeys: [],
            displayDelHistCallsModal: false
        });
    }


    _createRow0 = (text, record , index) => {
        let logItem = text.logItem
        let memberArr = text.memberArr
        let type = logItem.Type
        if (type == '-1') {
            type = memberArr[0].Type
        }
        let nameStr = ''
        if(logItem.IsConf == '1') {
            nameStr = logItem.NameOrNumber + '：'
            for (let i = 0; memberArr[i] != undefined; i++) {
                if(i>0) {
                    nameStr += '，'
                }
                nameStr += memberArr[i].recordName ? memberArr[i].recordName : memberArr[i].Name
            }
        } else {
            nameStr = memberArr[0].Name
        }
        return <span className={nameStr}><i className={"type" + type}></i>{nameStr}</span>;
    }


    handleAddContact = (event,text) => {
        if(!event.Id) {
            event.cancelBubble = true;
            event.stopPropagation( );
        } else {
            text = event
        }
        this.setState({displayDiv : "display-block",detailDiv: text});
    }

    showDelHistCallsModal = () => {
        this.setState({displayDelHistCallsModal: true});
    }

    handleDelHistCallsCancel = () =>{
        this.setState({displayDelHistCallsModal: false});
    }

    handleCall = (event,text, index) => {
        let {acctstatus} = this.state;
        if(!event.Id) {
            event.cancelBubble = true;
            event.stopPropagation( );
        } else {
            text = event
        }
        let curnum = text.Number;
        let acct = text['Account'];
        this.props.cb_start_single_call(acctstatus, curnum, acct, 0, 0, 0 , 0);
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
                        <span>{memberArr[i].Number}</span><span><button className='allow-call' id = {'allow-call'+index} onClick={(e)=>this.handleCall.bind(e, memberArr[i], index)}></button></span>
                    </div>
                )
            }
            statue = <div id = {logItem.Id} className = {"callRecord" + " type" + logItem.Type}>
                <button className='allow-detail' id = {'allow-detail'+index}  onClick={(e)=>this.handleNewConf.bind(e, memberArr, index)}></button>
                <Popover content={content} placement="leftTop" trigger="hover">
                    <button className='allow-call' id = {'allow-call'+index} onClick={(e)=>this.hiddenRows.bind(e, memberArr, index)}></button>
                </Popover>
            </div>;
        } else {
            statue =
                <div id = {logItem.Id} className = {"callRecord" + " type" + logItem.Type}>
                    <button className={memberArr[0].recordName ? 'display-hidden allow-addContact' : 'display-inline allow-addContact'} id = {'allow-addContact'+index} onClick={(e)=>this.handleAddContact(e,memberArr[0], index)}></button>
                    <button className='allow-detail' id = {'allow-detail'+index} onClick={(e)=>this.handleNewConf(e,memberArr[0], index)}></button>
                    <button className='allow-call' id = {'allow-call'+index} onClick={(e)=>this.handleCall(e,memberArr[0], index)} ></button>
                </div>;
        }
        return statue;
    }

    _createData = () => {
        let dataResult = [];
        let logItemdata = this.props.logItemdata
        let confmember = this.props.confmemberinfodata
        let contactList = this.props.contactsInformation
        // let callnameinfo = this.props.callnameinfo

        // if (!confmember.length || !contactList.length || !logItemdata.length || !callnameinfo.length) {
        //     return dataResult
        // }
        if(JSON.stringify(logItemdata)== '{}' || JSON.stringify(confmember)== '{}' || JSON.stringify(contactList)== '{}') {
            return dataResult
        }
        for ( let i = 0; i < logItemdata.length; i++ ) {
            let data = {};
            let memberArr = []
            let haslogItem = false
            if(logItemdata[i].IsConf == '1') {
                for (let j = 0; j < confmember.length; j++) {
                    if( logItemdata[i].Type == '3' && confmember[j].Id == logItemdata[i].Id) {
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
            } else {
                let obj = Object.assign({}, logItemdata[i])
                obj.Number = logItemdata[i].NameOrNumber
                obj.Name = logItemdata[i].NameOrNumber
                obj.recordName = ''
                if(obj.Name != obj.Number) {
                    obj.recordName = obj.Name
                }
                memberArr.push(obj)
            }
            // if (!haslogItem) {
            //     for (let j = 0; callnameinfo[j] != undefined; j++) {
            //         if(logItemdata[i].Type == '3' && callnameinfo[j].Id == logItemdata[i].Id) {
            //             let obj = logItemdata[i]
            //             obj.Name = callnameinfo[j].Name
            //             obj.Number = logItemdata[i].NameOrNumber
            //             obj.recordName = ''
            //             if(obj.Name != obj.Number) {
            //                 obj.recordName = obj.Name
            //             }
            //             memberArr.push(obj)
            //         }
            //     }
            // }
            data = {
                logItem : logItemdata[i],
                memberArr: memberArr
            }
            // if(memberArr.length > 0) {
            dataResult.push({
                key: i,
                row0: data,
                row1: parseInt(logItemdata[i].Date),
                row2: data
            })
            // }

        }
        this.curData = dataResult

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
        let num = parseInt(record.key)
        $('.ant-table-row').removeClass('line-hoverbg')
        $('.ant-table-row:eq('+ num +')').addClass('line-hoverbg')
        let expandedRows = this.state.expandedRows
        if(expandedRows.length > 0 && expandedRows[0] == record.key ) {
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
        var nameValue = text.recordName ? text.recordName : text.Name
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
                    <div className='call-line-info call-line-duration'>{this.convertDuration(memberArr[i].Duration)}</div>
                    <div className='call-line-info call-line-act'>
                        {this._createInlineAction(memberArr[i])}
                    </div>
                </div>
            )
        }
        return status;
    }


    handleNewConf = (event,text) => {
        if(!event.Id) {
            event.cancelBubble = true;
            event.stopPropagation( );
        } else {
            text = event
        }

        let data = text
        if(!text.length) {
            data = [text]

        }
        this.setState({
            displayNewConfModal: true,
            addNewConf:true,
            confMemberData:data
        })
    }

    handleHideNewConfModal = () => {
        this.setState({displayNewConfModal: false})
    }

    render() {
        const [contactsInformation, callTr, _createTime, isToday, convertTime, view_status_Duration] =
            [this.props.contactsInformation, this.props.callTr, this.props._createTime, this.props.isToday, this.props.convertTime,  this.props.view_status_Duration];
        const columns = [{
            title: callTr("a_19626"),
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
            title: callTr("a_44"),
            key: 'row2',
            dataIndex: 'row2',
            width: '15%',
            render: (text, record, index) => (
                this._createActions(text, record, index)
            )
        }];
        let data = this._createData()
        let isloading = this.props.loading
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
                <div className='btnbox'>
                    <div style={{'float':'left'}}>
                        <Checkbox className='call-checkall' checked={this.state.checkedAll} defaultChecked={false} onChange={this.onSelectAllContacts}></Checkbox>
                        <Button className="select-delete" type="primary" disabled={!hasSelected} style={{marginRight:'10px'}} onClick={this.showDelHistCallsModal}>
                            <i className={!hasSelected ? "select-delete-icon" : ""} />
                            {this.tr("a_19067")}
                        </Button>
                        <Modal visible={this.state.displayDelHistCallsModal} title={this.tr("a_3342")} className="confirm-modal"
                               okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.handleOkDeleteAll} onCancel={this.handleDelHistCallsCancel}>
                            <p className="confirm-content">{this.tr("a_3531")}</p>
                        </Modal>
                    </div>
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
                        // expandedRowRender= {this.expandedRowRender.bind(this)}
                        // onRowClick={this.handelOnRowClick.bind(this)}	//添加单击方法
                        // expandedRowKeys={this.state.expandedRows}		//添加 回设置 展开的数组
                        expandIconColumnIndex={-1}
                    />
                    <div className = "nodatooltips" style={{display: (!data.length && !isloading) ? 'block':'none'}}>
                        <div></div>
                        <p>{this.tr("a_10082")}</p>
                    </div>
                </div>
                { this.state.detailDiv ? <ContactEditDiv {...this.props} contactsInformation={contactsInformation} view_status_Duration={view_status_Duration} isToday={isToday} convertTime = {convertTime} displayDiv={this.state.displayDiv}
                                               detailDiv = {this.state.detailDiv} callTr={callTr} handleHide={this.handleHide} handleAddContact={this.handleAddContact} />
                    : null
                }
                { this.state.displayNewConfModal ? <NewConEditForm {...this.props} callTr={this.props.callTr}
                                               handleHideNewConfModal= {this.handleHideNewConfModal}
                                               displayNewConfModal={this.state.displayNewConfModal}
                                               confMemberData={this.state.confMemberData}
                                               addNewConf={this.state.addNewConf}/>
                    : null
                }

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
    confmemberinfodata: state.confmemberinfodata,
    callnameinfo:state.callnameinfo,
    groupInformation: state.groupInformation
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
        get_deleteCallConf:Actions.get_deleteCallConf,
        getNormalCalllogNames:Actions.getNormalCalllogNames,
        cb_start_single_call:Actions.cb_start_single_call
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Call));
