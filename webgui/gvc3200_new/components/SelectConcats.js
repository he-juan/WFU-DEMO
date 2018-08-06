import React, { Component } from 'react'
import Enhance from './mixins/Enhance'
import * as Actions from './redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form,Checkbox, Modal, Table, Input, Icon, Button, Select, Radio } from "antd"

class SelectContacts extends Component {
    contactList = [];
    selectedContactList = [];
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            curContactList: []
        }
    }

    componentDidMount = () => {
        this.props.getContacts((result) => {
            let msgsContacts = this.props.msgsContacts;
            let data = [];
            for (var i = 0; i < msgsContacts.length; i++) {
                data.push({
                    key: i,
                    name: msgsContacts[i].Name,
                    number: msgsContacts[i].Number
                })
            }
            this.contactList = [...data];
            this.setState({
                curContactList: data
            });
        });
    }

    componentDidUpdate = () => {
        if (!this.props.displayContactsModal ) {
            if($("#" + this.props.searchId).val() || this.selectedContactList.length>0){
                $("#" + this.props.searchId).val("");
                this.selectedContactList = [];
                this.setState({
                    selectedRowKeys: [],
                    curContactList:this.contactList
                });
            }
        }
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys})
    }

    onSelectItem = (record, selected, selectedRows) => {
        let self = this;
        if (selected) {
            self.selectedContactList.push({name: record.name, number: record.number});
        } else {
            for (let j = 0; j < self.selectedContactList.length; j++) {
                if (self.selectedContactList[j].number == record.number) {
                    self.selectedContactList.splice(j, 1);
                    break;
                }
            }
        }
    }

    onSelectAllContacts = (selected, selectedRows) => {
        let self = this;
        if (selected) {
            if (selectedRows.length == self.contactList.length) {
                self.selectedContactList = [...self.contactList];
            } else {
                if (self.contactList.length == 0) {
                    self.selectedContactList = [...selectedRows];
                } else {
                    for (let i = 0; i < selectedRows.length; i++) {
                        for (var j = 0; j < self.selectedContactList.length; j++) {
                            if (self.selectedContactList[j].number == selectedRows[i].number) {
                                break;
                            }
                        }
                        if (j == self.selectedContactList.length) {
                            self.selectedContactList.push(selectedRows[i]);
                        }
                    }
                }
            }
        } else {
            for (let i = self.state.curContactList.length - 1; i >= 0; i--) {
                for (var j = 0; j < self.selectedContactList.length; j++) {
                    if (self.selectedContactList[j].number == self.state.curContactList[i].number) {
                        break;
                    }
                }
                if (j != self.selectedContactList.length) {
                    self.selectedContactList.splice(j, 1);
                }
            }
        }
    }

    handleOk = () => {
        let self = this;
        if (self.selectedContactList.length == 0) {
            this.props.promptMsg('ERROR', "a_contactschecked");
           return false;
        }
        var arrayNum = [];
        var arrayName = [];
        let len = self.selectedContactList.length;
        for (let i = 0; i < len; i++) {
            let name = self.selectedContactList[i].name;
            let number = self.selectedContactList[i].number;
            arrayNum = arrayNum.concat(number);
            arrayName = arrayName.concat(name);
        }
        let numbers = arrayNum.join(':::');
        let names = arrayName.join(':::');
        if (self.props.itemType == "black") {
            self.props.addNewBlackMember(numbers, names, (result) => {
                self.props.get_Blacklist("members");
            });
        } else if (self.props.itemType == "white") {
            self.props.addNewWhiteMember(numbers, names, (result) => {
                self.props.get_Whitelist("members");
            });
        }
        self.setState({selectedRowKeys: []});
        self.props.handleHideContactsModal();
    }

    handleCancel = () => {
        this.props.handleHideContactsModal()
    }

    handleChange = (e) => {
        var self = this;
        var searchkey = e.target.value.toLowerCase().trim();
        let data = [];
        if (searchkey == "") {
            data = [...this.contactList];
        } else {
            let len = this.contactList.length;
            for (let i = 0; i < len; i++) {
                let contact = this.contactList[i];
                if (contact.number.indexOf(searchkey) != -1 || contact.name.toLowerCase().indexOf(searchkey) != -1) {
                    data.push(contact);
                }
            }
        }
        let selectRows = [];
        for(let i = 0; i<self.selectedContactList.length;i++){
            for(let j=0;j<data.length;j++){
                if(self.selectedContactList[i].number === data[j].number ){
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

    _createName = (text, record, index) => {
        let status;
        status = <div style={{'height': '33px'}}><span className="contactsIcon"></span><span
            className="ellips contactstext">{text}</span></div>;
        return status;
    }

    _createNumber = (text, record, index) => {
       let status;
       status = <div style={{'height': '33px'}}><span
           className="ellips contactstext">{text}</span></div>;
       return status;
   }

    contactSortByName = (contact1,contact2) => {
        return contact1.name.localeCompare(contact2.name);
    }

    render() {
        var showtips = "none";
        if (this.state.curContactList.length == 0) {
            showtips = "block";
        } else {
            showtips = "none";
        }
        let me = this;
        const callTr = this.props.callTr;
        const columns = [{
            title: "",
            key: "name",
            dataIndex: 'name',
            width: '50%',
            render: (text, record, index) => (
                this._createName(text, record, index)
            )
        }, {
            title: "",
            key: "number",
            dataIndex: "number",
            width: '50%',
            render: (text, record, index) => (
                this._createNumber(text, record, index)
            )
        }];


        const {selectedRowKeys} = me.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelectItem,
            onSelectAll: this.onSelectAllContacts
        }
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <Modal title={callTr('a_selectcontact')} onOk={this.handleOk} onCancel={this.handleCancel}
                   className='selectcontact-modal contactModal' visible={this.props.displayContactsModal}
                   okText={callTr("a_ok")} cancelText={callTr("a_cancel")}>
                <div className='search_call'>
                    <Input prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}}/>}
                           id={this.props.searchId} onChange={this.handleChange.bind(this)}
                           placeholder={callTr("a_search")}></Input>
                </div>
                <Table
                    rowSelection={rowSelection}
                    rowKey=""
                    columns={columns}
                    pagination={false}
                    dataSource={this.state.curContactList}
                    showHeader={true}
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
    msgsContacts: state.msgsContacts
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getContacts:Actions.getContacts,
        promptMsg: Actions.promptMsg
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(SelectContacts))
