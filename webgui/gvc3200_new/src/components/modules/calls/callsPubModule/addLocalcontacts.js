import React, { Component } from 'react'
import Enhance from '../../../mixins/Enhance'
import NewContactsEdit from "./newContactsEdit";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Modal, Table, Input, Icon, Button, Select } from "antd"

const NewContactsEditForm = Form.create()(NewContactsEdit);

class AddLocalcontacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayModal:false,
            addNewContact:false,
            items:[],
            groups:[],
            editContact:{},
            emailValues:[],
            numValues:[],
        }
    }

    componentDidMount = () => {
        this.updateContact();
    }

    updateContact = () => {
    }

    handleOk = () => {
        this.props.handleHideLocalContactsModal();
    }

    handleCancel = () => {
        this.props.handleHideLocalContactsModal();
    }

    handleChange = (e) => {
        const contactsNew = this.props.contactsNew;
        var self = this;
        var searchkey = e.target.value.toLowerCase().trim();
        let trs = document.querySelectorAll(".addlocalcontacts table tbody tr");
        if (searchkey == "") {
            for (var i = 0; i < trs.length; i++) {
                trs[i].style.display = 'table-row';
            }
        } else {
            for (var i = 0; i < contactsNew.length; i++) {
                if (contactsNew[i]['name']['displayname'].toLowerCase().indexOf(searchkey) == -1) {
                    trs[i].style.display = "none";
                } else {
                    trs[i].style.display = "table-row";
                }
            }
        }
    }

    handleHideModal = () => {
        this.setState({displayModal:false,addNewContact:false})
    }

    handleAddcontacts = (text) => {
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
        this.setState({displayModal:true,editContact:text});
        var obj = {
            name: name,
            email: email,
            address: text.address,
            note: text.note,
            website: text.website
        };
        text.phone.forEach((item,i) => {
            let acctstatus = this.props.acctStatus.headers;
            let Index = item.acct;
            if(acctstatus[`account_${Index}_no`] == ""){
                text.acct = '-1'
            }
            obj['bindaccount'+i] = item.acct;
            obj['accountnumber'+i] = item.number;
            numValues.push(item.number+ "--- ---" + item.acct)
        })
        obj['bindaccount'+text.phone.length] = this.props.addaccount;
        obj['accountnumber'+text.phone.length] = this.props.addnumber;
        numValues.push(this.props.addnumber+ "--- ---" + this.props.addaccount);
        for (var i = 0; i < text.email.length; i++) {
            emailValues.push(text.email[i].address);
        }
        for (var i = 0; i < text.group.length; i++) {
            obj['groupnumber' + text.group[i].name + text.group[i].id] = true;
        }
        this.setState({numValues: numValues, emailValues: emailValues})
        this.props.form.setFieldsValue(obj);
    }

    _createName = (text, record, index) => {
        let status;
        status = <div style={{'height': '33px'}} onClick={this.handleAddcontacts.bind(this, text)}><span className="contactsIcon"></span><span
            className="ellips contactstext">{text.name.displayname}</span></div>;
        return status;
    }

    render() {
        // let groupInformation = this.props.groupInformation;
        let contactsNew = this.props.contactsNew
        const callTr = this.props.callTr;
        const columns = [{
            title: "",
            key: "row0",
            dataIndex: 'row0',
            render: (text, record, index) => (
                this._createName(text, record, index)
            )
        }];
        let data = [];
        let contactItems = [];
        contactsNew.forEach((item,i) => {
            data.push({
                key: i,
                row0: item
            })
        });

        let numFromHistor = true
        return (
            <Modal title = {callTr('a_19634')} onOk={this.handleOk} onCancel={this.handleCancel}
                    className='selectcontact-modal addlocalcontacts' visible={this.props.displayLocalContactsModal}
                    okText={callTr("a_2")} cancelText={callTr("a_3")} >
                <div className='search_call'>
                    <Input prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}}/>}
                           onChange={this.handleChange.bind(this)}
                           placeholder={callTr("a_65")}></Input>
                </div>
                <Table
                    rowKey=""
                    columns={columns}
                    pagination={false}
                    dataSource={data}
                    showHeader={true}
                />
                <NewContactsEditForm {...this.props} numFromHistor={numFromHistor} emailValues={this.state.emailValues} numValues={this.state.numValues} updateContact={this.updateContact} groups={this.state.groups} editContact={this.state.editContact}
                displayModal={this.state.displayModal} addNewContact={this.state.addNewContact} handleHideModal={this.handleHideModal} product={this.props.product} callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    // contactsInformation: state.contactsInformation,
    groupInformation: state.groupInformation,
    // contactinfodata: state.contactinfodata,
    // contactsAcct: state.contactsAcct,
    contactsNew: state.contactsNew
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getContacts: Actions.getContacts,
        getGroups: Actions.getGroups,
        getContactsinfo:Actions.getContactsinfo
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(AddLocalcontacts))
