import React, { Component } from 'react'
import Enhance from './mixins/Enhance'
import NewContactsEdit from "./newContactsEdit";
import * as Actions from './redux/actions/index'
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
        this.props.getContacts((items)=>{this.setState({items:items})});
        this.props.getGroups((groups)=>{this.setState({groups:groups})});
        this.props.getContactsinfo();
    }

    handleOk = () => {
        this.props.handleHideLocalContactsModal();
    }

    handleCancel = () => {
        this.props.handleHideLocalContactsModal();
    }

    handleChange = (e) => {
        const contactsInformation = this.props.contactsInformation;
        var self = this;
        var searchkey = e.target.value.toLowerCase().trim();
        let trs = document.querySelectorAll(".addlocalcontacts table tbody tr");
        if (searchkey == "") {
            for (var i = 0; i < trs.length; i++) {
                trs[i].style.display = 'table-row';
            }
        } else {
            for (var i = 0; i < contactsInformation.length; i++) {
                if (contactsInformation[i]['Name'].toLowerCase().indexOf(searchkey) == -1) {
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
        var firstname = text.firstname;
        var lastname = text.lastname;
        this.props.form.resetFields();
        let emailValues = this.state.emailValues;
        let numValues = this.state.numValues;
        if (text.Number.length >= 3) {
            this.props.promptMsg('ERROR','a_numberexceed');
            return false;
        }
        emailValues.length = 0;
        numValues.length = 0;
        if (text.Emaill.length == 0) {
            emailValues = [''];
        }
        this.setState({displayModal:true,editContact:text});
        var obj = {
            lastname:lastname,
            firstname:firstname
        };
        for (var i = 0; i < text.AcctIndex.length; i++) {
            numValues.push(text.Number[i]+ " " + text.AcctIndex[i]);
            obj['bindaccount'+i] = text.AcctIndex[i];
            obj['accountnumber'+i] = text.Number[i];
        }
        obj['bindaccount'+text.AcctIndex.length] = this.props.addaccount;
        obj['accountnumber'+text.AcctIndex.length] = this.props.addnumber;
        numValues.push(this.props.addnumber+ " " + this.props.addaccount);
        for (var i = 0; i < text.Emaill.length; i++) {
            emailValues.push(text.Emaill[i]);
        }
        for (var i = 0; i < text.GroupName.length; i++) {
            obj['groupnumber' + text.GroupName[i] + text.GroupId[i]] = true;
        }
        this.setState({numValues: numValues, emailValues: emailValues})
        this.props.form.setFieldsValue(obj);
    }

    _createName = (text, record, index) => {
        let status;
        status = <div style={{'height': '33px'}} onClick={this.handleAddcontacts.bind(this, text)}><span className="contactsIcon"></span><span
            className="ellips contactstext">{text.Name}</span></div>;
        return status;
    }

    render() {
        let contactsInformation  = this.props.contactsInformation;
        let groupInformation = this.props.groupInformation;
        let contactinfodata = this.props.contactinfodata;
        let contactsAcct = this.props.contactsAcct;
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
        for ( let i = 0; i < contactsInformation.length; i++ ) {
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
                if ((contactItems[i].RawId == contactinfodata[j].RawId)&&(contactItems[i].Name == contactinfodata[j].Info)) {
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
                row0:contactItems[i]
            })
        }

        return (
            <Modal title = {callTr('a_selectcontact')} onOk={this.handleOk} onCancel={this.handleCancel}
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
                <NewContactsEditForm {...this.props} emailValues={this.state.emailValues} numValues={this.state.numValues} updateContact={this.updateContact} groups={this.state.groups} editContact={this.state.editContact}
                displayModal={this.state.displayModal} addNewContact={this.state.addNewContact} handleHideModal={this.handleHideModal} product={this.props.product} callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    contactsInformation: state.contactsInformation,
    groupInformation: state.groupInformation,
    contactinfodata: state.contactinfodata,
    contactsAcct: state.contactsAcct,
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
