import React, {Component, PropTypes} from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Enhance from "../../../mixins/Enhance";
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm } from "antd";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ContactEditDiv extends Component {
    constructor(props){
        super(props);
        this.state = {}
    }

    handleClose = () => {
        this.props.handleHide();
    }

    render() {
        const callTr = this.props.callTr;
        const convertTime = this.props.convertTime;
        var number;
        var account;
        var name;
        var account;
        if ( !$.isEmptyObject(this.props.detailDiv)) {
            number = this.props.detailDiv.number;
            account = this.props.detailDiv.account[0];
            if (this.props.detailDiv.note[0] !== '') {
                name = this.props.detailDiv.note[0];
                number = "("+number+")";
            } else {
                name = "";
                number = number;
            }
            //name = this.props.detailDiv.note[0] !== '' ?  ' (' + this.props.detailDiv.note[0] + ')' : '' ;
        }

        var detailItems = this.props.detailDiv;
        var timeToday = new Array;
        var timeYestday = new Array;
        var timeBefore = new Array;
        for (var i = 0; i < (detailItems.time && detailItems.time.length); i++) {
            var value = this.props.isToday(parseInt(detailItems.time[i]));
            if (value == "Today") {
                timeToday.push(detailItems.time[i])
            } else if (value == "Yestday") {
                timeYestday.push(detailItems.time[i])
            } else if (value == "Before") {
                timeBefore.push(detailItems.time[i])
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
                                <span>{callTr("a_block_history")}</span>
                                <div style = {{'float':'right'}} >
                                    <button type = "Button" onClick={this.handleClose}/>
                                </div>
                            </div>
                            <div id = "logdetaildiv" className = "blockdiv">
                                <div>
                                    <div className = "user">
                                    </div>
                                    <div className = "userInfo">
                                        <span className = "infonum"><strong className = "name ellips">{name}</strong><strong className="number">{number}</strong></span>
                                        <span className = "infoaccout"><i></i>{accountNumber}<span className="localcount">{" (" + callTr("a_localaccount") + ")"}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div id = "logitemsdiv">
                                <div id = "logitemsdivtoday">
                                    <p className = {"items" + timeToday.length}>{callTr("a_today")}</p>
                                    {
                                        timeToday && timeToday.map((item,idx,items) => {
                                            return (
                                                <div className = {"logitemdiv " + value} id = {"logitemdiv" + item.Id}>
                                                    <span className = "calldate"><i className="blocktype"></i>{convertTime(parseInt(item))}</span>
                                                    <span className = "callDur">{callTr("a_block")}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div id = "logitemsdivtoday">
                                    <p className = {"items" + timeYestday.length}>{callTr("a_yestday")}</p>
                                    {
                                        timeYestday && timeYestday.map((item,idx,items) => {
                                            return (
                                                <div className = {"logitemdiv " + value} id = {"logitemdiv" + item.Id}>
                                                    <span className = "calldate"><i className="blocktype"></i>{convertTime(parseInt(item))}</span>
                                                    <span className = "callDur">{callTr("a_block")}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div id = "logitemsdivbefore">
                                    <p className = {"items" + timeBefore.length}>{callTr("a_before")}</p>
                                    {
                                        timeBefore && timeBefore.map((item,idx,items) => {
                                            return (
                                                <div className = {"logitemdiv " + value} id = {"logitemdiv" + item.Id}>
                                                    <span className = "calldate"><i className="blocktype"></i>{convertTime(parseInt(item))}</span>
                                                    <span className = "callDur">{callTr("a_block")}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Intercept extends Component {
    selectedDataList = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            displayDiv: 'display-hidden',
            detailDiv: {},
            displayDelInterceptModal: false,
            displayAddWhitelistModal: false,
            existActiveAccount: false
        }
    }

    componentDidMount = () => {
        this.props.get_Blacklist("history");
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

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onSelectItem = (record, selected, selectedRows) => {
        let self = this;
        var name = record.row0.note[0] ? record.row0.note[0] : record.row0.number[0];
        let number = record.row0.number;
        let id = record.row0.Id;
        let numberAccount = record.row0.numberAccount
        if (selected) {
            self.selectedDataList.push({name: name, number: number, id: id,numberAccount: numberAccount});
        } else {
            for (let j = 0; j < self.selectedDataList.length; j++) {
                if (self.selectedDataList[j].numberAccount==numberAccount) {
                    self.selectedDataList.splice(j, 1);
                    break;
                }
            }
        }
    }

    onSelectAllContacts = (selected, selectedRows) => {
        let self = this;
        let curdata = this.props.interceptItemdata
        if (selected) {
            for (let i = 0; i < selectedRows.length; i++) {
                let item = selectedRows[i]
                var name = item.row0.note[0] ? item.row0.note[0] : item.row0.number[0];
                let number = item.row0.number;
                let id = item.row0.Id;
                let numberAccount = item.row0.numberAccount
                for (var j = 0; j < self.selectedDataList.length; j++) {
                    if (self.selectedDataList[j].numberAccount === numberAccount) {
                    }
                }
                if (j == self.selectedDataList.length) {
                    self.selectedDataList.push({name: name, number: number,id: id,numberAccount: numberAccount});
                }
            }
        } else {
            for (let i = curdata.length - 1; i >= 0; i--) {
                let index = null
                for (var j = 0; j < self.selectedDataList.length; j++) {
                    let numberAccount = curdata[i].number + "" + curdata[i].account
                    if (self.selectedDataList[j].numberAccount === numberAccount) {
                        index = j
                        break;
                    }
                }
                if (index != self.selectedDataList.length) {
                    self.selectedDataList.splice(index, 1);
                }
            }
        }
    }

    showDelInterceptModal =()=> {
        this.setState({displayDelInterceptModal: true});
    }

    handleDelInterceptCancel =() =>{
        this.setState({displayDelInterceptModal: false});
    }

    showAddWhitelistModal =()=> {
        this.setState({displayAddWhitelistModal: true});
    }

    handleAddWhitelistCancel =() =>{
        this.setState({displayAddWhitelistModal: false});
    }

    handleOkDeleteAll = () => {
        let datasource = this.selectedDataList;
        let seletedArr = [];
        for (let i = 0; i <datasource.length ; i++) {
            seletedArr = seletedArr.concat(datasource[i].id)
        }
        var deleteNum = seletedArr.join(',')
        var flag = 5;
        this.props.get_deleteCall(deleteNum,flag, (result) => {
            if (result == 'success') {
                this.props.promptMsg('SUCCESS',"a_del_ok");
                this.props.get_Blacklist("history");
            }
        });
        this.selectedDataList = [];
        this.setState({
            selectedRowKeys: [],
            displayDelInterceptModal: false
        });
    }

    handleAddWhitelist = () => {
        let datasource = this.selectedDataList
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
        this.props.addNewWhiteMember(numbers, names);
        this.selectedDataList = [];
        this.setState({
            selectedRowKeys: [],
            displayAddWhitelistModal: false
        });
    }

    handleEditItem = (text, index) => {
        this.setState({
            displayDiv : "display-block",
            detailDiv: text
        });
    }

    handleHide = () => {
        this.setState({
            displayDiv:"display-hidden",
            detailDiv: {}
        });
    }

    _createName = (text, record, index) => {
        var name = text.note[0] ? text.note[0] : text.number;
        var nameValue = name + ((text.Id.length > 1) ? " (" + text.Id.length + ")": "");
        return <span data-name={name} className="ellips inteccontactstext contactname"><i className={"block"}></i>{nameValue}</span>;
    }

    _createActions = (text, record, index) => {
        var Id = text.Id.join(',');
        let statue;
        statue = <div id = {Id} className = {"callRecord " + "Id" + Id}>
            <button className='allow-call' id = {'allow-call'+index}  onClick={this.handleCall.bind(this, text, index)}></button>
            <button className='allow-detail' id = {'allow-detail'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
        </div>;
        return statue;
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
        let curnum = text.number[0];

        if(curnum == "anonymous"){
            this.props.promptMsg('WARNING','a_tip_dialanonymous');
            return false;
        }

        let acct = text.account[0];
        let source = 3;
        this.props.sendSingleCall(curnum, acct, 0, 0, source, 0)
    }

    render() {
        const [interceptItemdata, callTr, _createTime, isToday, convertTime] =
            [this.props.interceptItemdata, this.props.callTr, this.props._createTime, this.props.isToday, this.props.convertTime];
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
            width: '20%',
        }, {
            title: callTr("a_date"),
            key: 'row3',
            dataIndex: 'row3',
            width: '20%',
            render: (text, record, index) => (
                _createTime(text, record, index)
            )
        }, {
            title: callTr("a_operate"),
            key: 'row4',
            dataIndex: 'row4',
            width: '20%',
            render: (text, record, index) => (
                this._createActions(text, record, index)
            )
        }];

        let dataResult = [];
        let data = [];
        var showtips = "none";
        if (interceptItemdata.length == 0) {
            showtips = "block";
        } else {
            showtips = "none";
        }
        for (let i = 0; i < interceptItemdata.length; i++) {
            dataResult.push({
                Id: interceptItemdata[i].Id,
                account: interceptItemdata[i].account,
                note: interceptItemdata[i].note,
                number: interceptItemdata[i].number,
                numberAccount: interceptItemdata[i].number + "" + interceptItemdata[i].account,
                time: interceptItemdata[i].time
            })
        }
        var hash = {};
        var i = 0;
        var res = [];
        dataResult.reverse().forEach(function(item) {
            var numberAccount = item.numberAccount;
            hash[numberAccount] ? res[hash[numberAccount] - 1].Id.push(item.Id) && res[hash[numberAccount] - 1].account.push(item.account) && res[hash[numberAccount] - 1].note.push(item.note)  && res[hash[numberAccount] - 1].time.push(item.time) && res[hash[numberAccount] - 1].note.push(item.number) : hash[numberAccount] = ++i && res.push({
                numberAccount:numberAccount,
                Id:[item.Id],
                account:[item.account],
                note:[item.note],
                time:[item.time],
                number:[item.number]
            })
        })
        for ( let i = 0; i < res.length; i++ ) {
            data.push({
                key: i,
                row0: res[i],
                row1: res[i],
                row2: res[i].number,
                row3: parseInt(res[i]['time'][0]),
                row4: res[i]
            })
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
                        <Button className="select-delete" type="primary" disabled={!hasSelected} style={{marginRight:'10px'}} onClick={this.showDelInterceptModal}>
                            <i className={!hasSelected ? "select-delete-icon" : ""} />
                            {this.tr("a_delete")}
                        </Button>
                        <Modal visible={this.state.displayDelInterceptModal} title={this.tr("a_delinterceptcalls")} className="confirm-modal"
                               okText={this.tr("a_ok")} cancelText={this.tr("a_cancel")} onOk={this.handleOkDeleteAll} onCancel={this.handleDelInterceptCancel}>
                            <p className="confirm-content">{this.tr("a_isdelinterceptcalls")}</p>
                        </Modal>
                        <Button type="primary" disabled={!hasSelected}  style={{marginRight:'10px'}} onClick={this.showAddWhitelistModal}>
                            {this.tr("a_whitelist")}
                        </Button>
                        <Modal visible={this.state.displayAddWhitelistModal} title={this.tr("a_whitelist")} className="confirm-modal"
                               okText={this.tr("a_ok")} cancelText={this.tr("a_cancel")} onOk={this.handleAddWhitelist} onCancel={this.handleAddWhitelistCancel}>
                            <p className="confirm-content">{this.tr("a_isWhitelist")}</p>
                        </Modal>
                    </div>
                </div>
                <div className = 'CallDiv InternetDiv'>
                    <Table
                        rowSelection={rowSelection}
                        rowKey = ""
                        columns = { columns }
                        pagination = { false }
                        dataSource = { data }
                        showHeader = { true }
                    />
                    <div className = "nodatooltips" style={{display: showtips}}>
                        <div></div>
                        <p>{this.tr("no_data")}</p>
                    </div>
                </div>
                <ContactEditDiv {...this.props} isToday={isToday} convertTime = {convertTime} displayDiv={this.state.displayDiv} detailDiv = {this.state.detailDiv} callTr={callTr} handleHide={this.handleHide} handleEditItem={this.handleEditItem} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    interceptItemdata: state.interceptItemdata,
    contactsInformation: state.contactsInformation,
    acctStatus: state.acctStatus,
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_Blacklist: Actions.get_Blacklist,
        getAcctStatus: Actions.getAcctStatus,
        get_deleteCall: Actions.get_deleteCall,
        addNewWhiteMember: Actions.addNewWhiteMember,
        sendSingleCall: Actions.sendSingleCall
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Intercept));
