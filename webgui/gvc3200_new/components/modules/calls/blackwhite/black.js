import React, {Component, PropTypes} from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Enhance from "../../../mixins/Enhance";
import SelectCall from "../../../SelectCall";
import SelectContacts from "../../../SelectConcats";
import ManualModal from "./ManualModal";
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm, Form } from "antd";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const FormItem = Form.Item;


const ManualModalForm = Form.create()(ManualModal);
const SelectCallForm = Form.create()(SelectCall);
const SelectContactsForm = Form.create()(SelectContacts);

class Black extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            addmanualVisible:false,
            manultitle:'',
            numberinput: '',
            Idblack:'',
            displayCallModal:false,
            displayContactsModal:false,
            displayRemoveConfirmModal: false
        }
    }

    componentDidMount = () => {
        this.props.get_Blacklist("members");
    }

    handleremoveblacklist = () => {
        const {selectedRowKeys} = this.state;
        var array = [];
        for ( var i = 0; i < selectedRowKeys.length; i++ ) {
            var number = $(".blacklisttable table tbody tr:eq("+selectedRowKeys[i]+") td:eq(4) div")['0']['id'];
            array = array.concat(number);
        }
        var deleteId;
        deleteId = array.length == this.props.blacklistItemdata.length ? deleteId = "" : deleteId = array.join(',');
        this.props.removeBlacklist(deleteId, (result) => {
            this.props.get_Blacklist("members");
        });
        this.setState({
            selectedRowKeys: [],
            displayRemoveConfirmModal: false
        });
    }

    showContactModal = () => {
        this.setState({
            displayContactsModal: true,
        })
    }

    handleDeleteItem = (text, index) => {
        var Id = text.Id;
        this.props.removeBlacklist(Id, (result) => {
            this.props.get_Blacklist("members");
        });
        this.setState({
            selectedRowKeys: []
        });
    }

    handleEditItem = (text, index) => {
        this.setState({
            addmanualVisible: true,
            manultitle: 'a_remarksadjust',
            numberinput: 'disabled',
            Idblack: text.Id
        });
        var obj = {
            manualnumber: text.number,
            manualname: text.note
        }
        this.props.form.setFieldsValue(obj);
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
        return <span className = "blacklist">{callTr("a_blackset")}</span>
    }

    _createActions = (text, record, index) => {
        let status;
        status = <div id = {text.Id} className = {"callRecord " + "Id" + text.Id}>
            <button className='allow-edit' id = {'allow-edit'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
            <Popconfirm placement="top" okText={this.tr("a_ok")} cancelText={this.tr("a_cancel")} onConfirm={this.handleDeleteItem.bind(this, text, index)}>
                <button className='allow-delete' id = {'allow-delete'+index} ></button>
            </Popconfirm>
        </div>;
        return status;
    }

    showCallModal = () => {
        this.setState({
            displayCallModal: true,
        })
    }

    showAddModal = () => {
        this.props.form.resetFields();
        this.setState({
            addmanualVisible: true,
            manultitle: 'a_addmanul',
            numberinput: ''
        });
    }

    showConfirmModal = () => {
        this.setState({displayRemoveConfirmModal: true});
    }

    handleRemoveBlksCancel = () => {
        this.setState({displayRemoveConfirmModal: false});
    }

    handleHideModal = () => {
        this.setState({addmanualVisible: false});
    }

    handleHideCallModal = () => {
        this.setState({displayCallModal: false})
    }

    handleHideContactsModal = () => {
        this.setState({displayContactsModal: false})
    }

    render() {
        const callTr = this.props.callTr;
        const blacklistItemdata = this.props.blacklistItemdata;
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
        if (blacklistItemdata.length == 0) {
            showtips = "block";
        } else {
            showtips = "none";
        }
        for (let i = 0; i < blacklistItemdata.length; i++) {
            data.push({
                key: 1,
                row0: blacklistItemdata[i].note,
                row1: blacklistItemdata[i],
                row2: blacklistItemdata[i].number,
                row3: blacklistItemdata[i]
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
                        <Button type="primary" disabled={!hasSelected}  style={{marginRight:'10px'}} onClick={this.showConfirmModal}>
                                {this.tr("a_removeblack")}
                        </Button>
                        <Modal visible={this.state.displayRemoveConfirmModal} className="black-white-confirm-modal" onCancel={this.handleRemoveBlksCancel} footer={null}>
                            <p className="confirm-content">{this.tr("a_deleteblack")}</p>
                            <div className="modal-footer">
                                <Button onClick={this.handleRemoveBlksCancel}>{this.tr("a_cancel")}</Button>
                                <Button type="primary" onClick={this.handleremoveblacklist}>{this.tr("a_ok")}</Button>
                            </div>
                        </Modal>
                        <Button type="primary" onClick={this.showContactModal} style={{marginRight:'10px'}}>
                            {this.tr("a_addcontacts")}
                        </Button>
                        <Button type="primary" onClick={this.showCallModal} style={{marginRight:'10px'}}>
                            {this.tr("a_addcall")}
                        </Button>
                        <Button type="primary" onClick={this.showAddModal}>
                            {this.tr("a_addmanul")}
                        </Button>
                    </div>
                </div>
                <div className = 'CallDiv blacklisttable'>
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
                <ManualModalForm {...this.props} blacklistItemdata={blacklistItemdata} itemType={"black"} handleHideModal={this.handleHideModal}
                                 callTr={callTr} Idblack={this.state.Idblack} numberinput={this.state.numberinput} manultitle={this.state.manultitle}
                                 addmanualVisible={this.state.addmanualVisible} />
                <SelectCallForm {...this.props} callTr={callTr} handleHideCallModal= {this.handleHideCallModal} displayCallModal={this.state.displayCallModal} />
                <SelectContactsForm {...this.props} itemType={"black"} callTr={callTr} searchId={"blackSearchId"} handleHideContactsModal= {this.handleHideContactsModal} displayContactsModal={this.state.displayContactsModal} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    blacklistItemdata: state.blacklistItemdata
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_Blacklist: Actions.get_Blacklist,
        addNewBlackMember: Actions.addNewBlackMember,
        removeBlacklist: Actions.removeBlacklist,
        editBlackMember: Actions.editBlackMember
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Black))
