import React, {Component, PropTypes} from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Enhance from "../../../mixins/Enhance";
import ContactsEdit from "../../../ContactsEdit";
import SelectContacts from "../../../SelectConcats"
import ManualModal from "./ManualModal";
import BlockCallModal from "./blockCallModal";
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm, Form } from "antd";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const FormItem = Form.Item;

const SelectContactsForm = Form.create()(SelectContacts);
const ManualModalForm = Form.create()(ManualModal);

class White extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            addmanualVisible:false,
            manultitle:'',
            numberinput: '',
            whiteId:'',
            displayCallModal:false,
            displayContactsModal:false,
            displayBlockCallModal:false,
            displayRemoveConfirmModal: false,
        }
    }

    componentDidMount = () => {
        this.props.get_Whitelist("members");
    }

    handleRemoveWhitelist = () => {
        const {selectedRowKeys} = this.state;
        var array = [];
        for ( var i = 0; i < selectedRowKeys.length; i++ ) {
            var number = $(".CallDiv table tbody tr:eq("+selectedRowKeys[i]+") td:eq(4) div")['0']['id'];
            array = array.concat(number);
        }
        var deleteId;
        deleteId = array.length == this.props.whitelistItemdata.length ? deleteId = "" : deleteId = array.join(',');
        this.props.removeWhitelist(deleteId, (result) => {
            this.props.get_Whitelist("members");
        });
        this.setState({
            selectedRowKeys: [],
            displayRemoveConfirmModal: false
        });
    }

    handleEditItem = (text, index) => {
        this.setState({
            addmanualVisible: true,
            manultitle: 'a_remarksadjust',
            numberinput: 'disabled',
            whiteId: text.Id
        });
        var obj = {
            manualnumber: text.number,
            manualname: text.note
        }
        this.props.form.setFieldsValue(obj);
    }



    showContactModal = () => {
        this.setState({
            displayContactsModal: true,
        })
    }
    showBlockCallModal =()=>{
        this.setState({displayBlockCallModal: true});
    }

    handleHideContactsModal = () => {
        this.setState({displayContactsModal: false})
    }

    handleHideBlockCallModal = () => {
        this.setState({displayBlockCallModal: false})
    }

    showAddModal = () => {
        this.props.form.resetFields();
        this.setState({
            addmanualVisible: true,
            manultitle: 'a_addmanul',
            numberinput: ''
        });
    }
    showConfirmModal = () =>{
        this.setState({
            displayRemoveConfirmModal: true
        });
    }

    handleHideModal = () => {
        this.setState({addmanualVisible: false});
    }

    handleCancel = () => {
        this.setState({ displayRemoveConfirmModal: false });
    }

    handleDeleteItem = (text, index) => {
        var Id = text.Id;
        this.props.removeWhitelist(Id, (result) => {
            this.props.get_Whitelist("members");
        });
        this.setState({
            selectedRowKeys: []
        });
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    _createName = (text, record, index) => {
        let status;
        status = <div style = {{'height':'33px'}}><span className = "contactsIcon"></span><span className = "ellips contactstext contactname">{text}</span></div>;
        return status;
    }

    _createList = (text, record, index) => {
        const callTr = this.props.callTr;
        return <span className = "whitelist">{callTr("a_whiteset")}</span>
    }

    _createActions = (text, record, index) => {
        let status;
        status = <div id = {text.Id} className = {"callRecord " + "Id" + text.Id}>
            <button className='allow-edit' id = {'allow-edit'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
            <Popconfirm placement="top" title={this.tr("a_deletewhite")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleDeleteItem.bind(this, text, index)}>
                <button className='allow-delete' id = {'allow-delete'+index} ></button>
            </Popconfirm>
        </div>;
        return status;
    }

    render() {
        const callTr = this.props.callTr;
        const whitelistItemdata = this.props.whitelistItemdata;
        const columns = [{
            title: callTr("a_name"),
            key: 'row0',
            dataIndex: 'row0',
            width: '30%',
            render: (text, record, index) => (
                this._createName(text, record, index)
            )
        }, {
            title: callTr(""),
            key: 'row1',
            dataIndex: 'row1',
            width: '25%',
            render: (text, record, index) => (
                this._createList(text, record, index)
            )
        }, {
            title: callTr("a_number"),
            key: 'row2',
            dataIndex: 'row2',
            width: '25%'
        }, {
            title: callTr("a_operate"),
            key: 'row3',
            dataIndex: 'row3',
            width: '20%',
            render: (text, record, index) => (
                this._createActions(text, record, index)
            )
        }];

        let data = [];
        var showtips = "none";
        if (whitelistItemdata.length == 0) {
            showtips = "block";
        } else {
            showtips = "none";
        }

        for (let i = 0; i < whitelistItemdata.length; i++) {
            data.push({
                key: 1,
                row0: whitelistItemdata[i].note,
                row1: whitelistItemdata[i],
                row2: whitelistItemdata[i].number,
                row3: whitelistItemdata[i]
            })
        }
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div style={{margin:"0px 10px"}}>
                <div style={{margin:"4px 10px 10px 22px", height:'32px'}}>
                    <div style={{'float':'left'}}>
                        <Button type="primary" disabled={!hasSelected}  style={{marginRight:'10px'}} onClick={this.showConfirmModal}>{this.tr("a_removewhite")}</Button>
                        <Modal visible={this.state.displayRemoveConfirmModal} className="black-white-confirm-modal" onCancel={this.handleCancel} footer={null}>
                            <p className="confirm-content">{this.tr("a_deletewhite")}</p>
                            <div className="modal-footer">
                                <Button onClick={this.handleCancel}>{this.tr("a_3")}</Button>
                                <Button type="primary" onClick={this.handleRemoveWhitelist}>{this.tr("a_2")}</Button>
                            </div>
                        </Modal>
                        <Button type="primary" onClick={this.showContactModal} style={{marginRight:'10px'}}>
                            {this.tr("a_addcontacts")}
                        </Button>
                        <Button type="primary" onClick={this.showBlockCallModal} style={{marginRight:'10px'}}>
                            {this.tr("a_addblock")}
                        </Button>
                        <Button type="primary" onClick={this.showAddModal}>
                            {this.tr("a_addmanul")}
                        </Button>
                    </div>
                </div>
                <div className = 'CallDiv Contactstable'>
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
                <ManualModalForm {...this.props} whitelistItemdata={whitelistItemdata} promptMsg={this.props.promptMsg} itemType={"white"}
                                 handleHideModal={this.handleHideModal} callTr={callTr} whiteId={this.state.whiteId} numberinput={this.state.numberinput} manultitle={this.state.manultitle}
                                 addmanualVisible={this.state.addmanualVisible} />
                <BlockCallModal {...this.props} callTr={callTr} displayBlockCallModal={this.state.displayBlockCallModal} handleHideBlockCallModal={this.handleHideBlockCallModal}/>
                <SelectContactsForm {...this.props} callTr={callTr} itemType={"white"} searchId={"whiteSearchId"} handleHideContactsModal= {this.handleHideContactsModal} displayContactsModal={this.state.displayContactsModal} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    whitelistItemdata: state.whitelistItemdata
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_Whitelist: Actions.get_Whitelist,
        removeWhitelist: Actions.removeWhitelist,
        editWhiteMember: Actions.editWhiteMember,
        addNewWhiteMember: Actions.addNewWhiteMember,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(White))
