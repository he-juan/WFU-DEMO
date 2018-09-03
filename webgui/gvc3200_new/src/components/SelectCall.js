import React, { Component } from 'react'
import Enhance from './mixins/Enhance'
import * as Actions from './redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form,Checkbox, Modal, Tooltip, Table, Icon, Row,Col, Input, Button, Select, Radio } from "antd"

class SelectCall extends Component {
    callLog = [];
    selectedCallLog = [];
    constructor(props){
        super(props);
        this.state = {
            selectedRowKeys: [],
            curCallLog: []
        }
    }

    componentDidMount = () => {
        this.props.get_calllog(0, (result) => {
            let logItemdata = this.props.logItemdata;
            let data = [];
            let len = logItemdata.length;
            let counter = 0;
            let numberArr = {};
            for (let i = 0; i < len; i++) {
                let item = logItemdata[i];
                if(numberArr[item.NameOrNumber]){
                    continue;
                }
                numberArr[item.NameOrNumber] = item.NameOrNumber;
                data.push({
                    key: counter++,
                    name_type: {name:item.NameOrNumber,callType:item.Type},
                    blackWhiteType:"",
                    number: item.NameOrNumber,
                    time: parseInt(item.Date)
                });
            }
            this.callLog = [...data];
            this.setState({
                curCallLog: data
            });
        });
        this.props.getAcctStatus();
        this.props.getContacts();
    }

    componentDidUpdate = () => {
        if (!this.props.displayCallModal ) {
            if($("#callsearch").val() || this.selectedCallLog.length>0){
                $("#callsearch").val("");
                this.selectedCallLog = [];
                this.setState({
                    selectedRowKeys: [],
                    curCallLog:this.callLog
                });
            }
        }
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onSelectItem=(record, selected, selectedRows) => {
        let self = this;
        if (selected) {
            self.selectedCallLog.push(record);
        } else {
            let len = self.selectedCallLog.length;
            for (let j = 0; j < self.selectedCallLog.length; j++) {
                if (self.selectedCallLog[j].number == record.number) {
                    self.selectedCallLog.splice(j, 1);
                    break;
                }
            }
        }
    }

    onSelectAllCallLog= (selected, selectedRows) => {
        let self = this;
        let curCallLog = self.state.curCallLog;
        if (selected) {
            if (selectedRows.length == self.callLog.length) {
                self.selectedCallLog = [...self.callLog];
            } else {
                let len = selectedRows.length;
                for (let i = 0; i < len; i++) {
                    for (var j = 0; j < self.selectedCallLog.length; j++) {
                        if (self.selectedCallLog[j].number == selectedRows[i].number) {
                            break;
                        }
                    }
                    if (j == self.selectedCallLog.length) {
                        self.selectedCallLog.push(selectedRows[i]);
                    }
                }
            }
        } else {
            for (let i = curCallLog.length - 1; i >= 0; i--) {
                let selectedCallLogLen = self.selectedCallLog.length;
                for (var j = 0; j < selectedCallLogLen; j++) {
                    if (self.selectedCallLog[j].number == curCallLog[i].number) {
                        break;
                    }
                }
                if (j != self.selectedCallLog.length) {
                    self.selectedCallLog.splice(j, 1);
                }
            }
        }
    }

    handleOk = () => {
        let self = this;
        let len = self.selectedCallLog.length;
        if (len == 0) {
            this.props.promptMsg('ERROR', "a_callchecked");
            return false;
        }
        var arrayNum = [];
        var arrayName = [];
        for (let i = 0; i < len; i++) {
            let name = self.selectedCallLog[i].name_type.name;
            let number = self.selectedCallLog[i].number;
            arrayNum = arrayNum.concat(number);
            arrayName = arrayName.concat(name);
        }
        let numbers = arrayNum.join(':::');
        let names = arrayName.join(':::');
        self.props.addNewBlackMember(numbers, names, (result) => {
            self.props.get_Blacklist("members");
        });
        self.setState({selectedRowKeys: []});
        this.props.handleHideCallModal()
    }

    handleCancel = () => {
        this.props.handleHideCallModal()
    }

    _createName = (text, record , index) => {
        var name = text.name;
        var contactsInformation = this.props.contactsInformation;
        let len = contactsInformation.length;
        for (let i = 0; i < len; i++) {
            if (contactsInformation[i].Number.indexOf(name) !== -1 ) {
                name = contactsInformation[i].Name.trim() || name;
                break;
            }
        }
        return <div><span className="ellips selectcalltext contactstext"><i className={"type" + text.callType}></i>{name}</span></div>;
    }

    _createNumber = (text) => {
        return <div><span className="ellips selectcalltext contactstext">{text}</span></div>;
    }

    _createTime = (text, record, index) => {
        var Timevalue = this.convertTime(text);
        return Timevalue;
    }

    handleChange = (e) => {
        var self = this;
        var searchkey = e.target.value.toLowerCase().trim();
        let data = [];
        if (searchkey == "") {
            data = [...this.callLog];
        } else {
            let len = this.callLog.length;
            for (let i = 0; i < len; i++) {
                let callItem = this.callLog[i];
                var name = callItem.name_type.name;
                var contactsInformation = this.props.contactsInformation;
                let len = contactsInformation.length;
                for (let i = 0; i < len; i++) {
                    for(let index in contactsInformation[i].Number) {
                        if (contactsInformation[i].Number[index] == name) {
                            name = contactsInformation[i].Name.trim() || name;
                            break;
                        }
                    }
                }
                if (callItem.number.indexOf(searchkey) != -1 || name.toLowerCase().indexOf(searchkey) != -1) {
                    data.push(callItem);
                }
            }
        }
        let selectRows = [];
        let len = self.selectedCallLog.length;
        for(let i = 0; i < len;i++) {
            let dataLen = data.length;
            for (let j = 0; j < dataLen; j++) {
                if (self.selectedCallLog[i].number === data[j].number) {
                    selectRows.push(j);
                    break;
                }
            }
        }
        this.setState({
            curCallLog: data,
            selectedRowKeys:selectRows
        });
    }

    render() {
        var showtips = "none";
        if (this.state.curCallLog.length == 0) {
            showtips = "block";
        } else {
            showtips = "none";
        }
        const [callTr, contactsInformation, logItemdata] = [this.props.callTr, this.props.contactsInformation, this.props.logItemdata];
        const columns = [{
            title: "",
            key: 'name_type',
            dataIndex: 'name_type',
            width: '25%',
            render: (text, record, index) => (
                this._createName(text, record, index)
            )
        }, {
            title: callTr(""),
            key: 'blackWhiteType',
            dataIndex: 'blackWhiteType',
            width: '25%'
        }, {
            title: "",
            key: 'number',
            dataIndex: 'number',
            width: '25%',
            render: (text) => (
                this._createNumber(text)
            )
        }, {
            title: "",
            key: 'time',
            dataIndex: 'time',
            width: '25%',
            render: (text, record, index) => (
                this._createTime(text, record, index)
            )
        }];
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelectItem,
            onSelectAll: this.onSelectAllCallLog
        }
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <Modal title={callTr('a_selectcall')} onOk={this.handleOk} onCancel={this.handleCancel} className='selectcall-modal blacklistmodule' visible={this.props.displayCallModal} okText={callTr("a_ok")} cancelText={callTr("a_cancel")}>
                <div className = 'search_call'>
                    <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} id="callsearch" onChange={this.handleChange.bind(this)} placeholder = {callTr("a_search")}></Input>
                </div>
                <Table
                    rowSelection={rowSelection}
                    rowKey = ""
                    columns = { columns }
                    pagination = { false }
                    dataSource = { this.state.curCallLog }
                    showHeader = { true }
                />
                <div className = "nodatooltips" style={{display: showtips}}>
                    <div></div>
                    <p>{this.tr("no_data")}</p>
                </div>
            </Modal>
        )
    }

}

const mapStateToProps = (state) => ({
    logItemdata: state.logItemdata,
    acctStatus: state.acctStatus,
    contactsInformation: state.contactsInformation,
    Use24Hour: state.Use24Hour
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_calllog: Actions.get_calllog,
        getAcctStatus:Actions.getAcctStatus,
        getContacts:Actions.getContacts,
        get_Blacklist: Actions.get_Blacklist
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(SelectCall));
