import React, {Component, PropTypes} from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Enhance from "../../../mixins/Enhance";
import ContactsEdit from "../callsPubModule/ContactsEdit";
import GroupEditModal from "../callsPubModule/groupEditModal"
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm, Form } from "antd";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const GroupEditModalForm = Form.create()(GroupEditModal);

class GroupTab extends Component {
    groupList = [];
    selectedDataList = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            displayDelGroupModal: false,
            displayGroupModal: false,
            addNewGroup:false,
            contactSelet:[],
            selectItems:[],
            obj:{},
            searchResultArr:[],
            curContactList: [],
            groupInformation: [],
            showtips: 'none'
        }
    }

    componentDidMount = () => {
        this.updateGroups();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed or selected account changed
            if (this.props.activeKey != nextProps.activeKey
                || this.props.curAccount != nextProps.curAccount) {
                this.props.getContacts();
            }
        }
        if(this.props.groupInformation != nextProps.groupInformation || this.props.contactsInformation!= nextProps.contactsInformation) {
            this._createData();
        }
    }

    updateGroups = () => {
        // this.props.getContactCount();
        this.props.getGroups();
        this.props.getContacts();
        let self = this
        setTimeout(function () {
            self._createData()
        },500)
    }

    handleOkDeleteAll = () => {
        let datasource = this.selectedDataList
        let seletedArr = [];
        for (let i = 0; i <datasource.length ; i++) {
            seletedArr = seletedArr.concat(datasource[i].id)
        }
        var deleteId = seletedArr.join(',');
        this.props.removeGroup(deleteId);
        let searchInput = $(".search_div #search")[1]
        if (searchInput.value) {
            searchInput.value = ""
        }
        setTimeout(()=>{
            this.props.getGroups(() => {
               this._createData()
            });
        },300)
        this.selectedDataList = [];
        this.setState({
            selectedRowKeys: [],
            displayDelGroupModal: false
        });

    }

    showGroupModal = () => {
        this.props.form.resetFields();
        this.setState({
            displayGroupModal: true,
            addNewGroup:true,
            editGroup:"",
            contactSelet:[],
            selectItems:[],
            obj:{}
        })
    }

    handleHideGroupModal = () => {
        this.setState({displayGroupModal:false,addNewGroup:false})
    }

    showDelGroupModal = () => {
        this.setState({displayDelGroupModal: true})
    }

    handleDelGroupCancel = () => {
        this.setState({displayDelGroupModal: false})
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    onSelectItem = (record, selected, selectedRows) => {
        let self = this;
        let name = record.row0;
        let id = record.row2.Id;
        if (selected) {
            self.selectedDataList.push({name: name, id: id});
        } else {
            for (let j = 0; j < self.selectedDataList.length; j++) {
                if (self.selectedDataList[j].id == id) {
                    self.selectedDataList.splice(j, 1);
                    break;
                }
            }
        }
    }

    onSelectAllGroup = (selected, selectedRows) => {
        let self = this;
        if (selected) {
            if (self.groupList.length == 0) {
                self.selectedDataList = [...selectedRows];
            } else {
                for (let i = 0; i < selectedRows.length; i++) {
                    let name = selectedRows[i].row0;
                    let id = selectedRows[i].row2.Id;
                    for (var j = 0; j < self.selectedDataList.length; j++) {
                        if (self.selectedDataList[j].id == id) {
                            break;
                        }
                    }
                    if (j == self.selectedDataList.length) {
                        self.selectedDataList.push({name: name, id: id});
                    }
                }
            }
        } else {
            for (let i = self.state.curContactList.length - 1; i >= 0; i--) {
                for (var j = 0; j < self.selectedDataList.length; j++) {
                    let item = self.state.curContactList[i]
                    let id = item.row2.Id;
                    if (self.selectedDataList[j].id === id) {
                        break;
                    }
                }
                if (j != self.selectedDataList.length) {
                    self.selectedDataList.splice(j, 1);
                }
            }
        }
    }

    handleChange = (e) => {
        var self = this;
        var searchkey = e.target.value.toLowerCase();
        let data = [];
        let dataSource = self.groupList
        if (searchkey === "") {
            data = [...dataSource];
        } else {
            let len = dataSource.length;
            for (let i = 0; i < len; i++) {
                let item = dataSource[i];
                let name = item.row0;
                if (name.indexOf(searchkey) != -1) {
                    data.push(item);
                }
            }
        }
        let selectRows = [];
        for(let i = 0; i<self.selectedDataList.length;i++){
            for(let j=0;j<data.length;j++){
                let item = data[j];
                let name = item.row0;
                if(self.selectedDataList[i].name === name){
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

    handleEditItem = (text) => {
        this.setState({displayGroupModal:true,editGroup:text});
        this.props.form.resetFields();
        var contactsNameObj = {};
        var contactSelet = [];
        var selectItems = [];
        text.ContactId.map((id) => {
            this.props.contactsInformation.map((item, index) => {
                if (item.RawId == id) {
                    contactsNameObj['contactCheckbox'+item.RawId] = true;
                    contactSelet.push(item.RawId)
                    selectItems.push(item)
                    return true;
                }
            })
        })
        let searchKey = ''
        var obj = Object.assign({groupname:text.Name,ringtone:text.Ringtone,searchKey:searchKey},contactsNameObj)
        obj = this.changeCheckAll(selectItems,obj)
        this.setState({contactSelet:contactSelet,selectItems:selectItems, obj:obj})
        this.props.form.resetFields();
    }

    checkboxChange = (text,e) => {
        let contactSelet = this.state.contactSelet;
        let selectItems = [];
        let obj = this.state.obj;
        let searchResultArr = this.state.searchResultArr
        const contactsInformation = this.props.contactsInformation;
        var index = $.inArray(text.RawId,contactSelet);
        if (e.target.checked) {
            if (index === -1) {
                contactSelet.push(text.RawId);
                obj['contactCheckbox' + text.RawId] = true;
            }
        } else {
            obj['contactCheckbox' + text.RawId] = false;
            if (index !== -1) {
                contactSelet.splice(index,1);
            }
        }
        for (var i = 0; i < contactSelet.length; i++) {
            for ( var j = 0; j < contactsInformation.length; j++) {
                if (contactSelet[i] === contactsInformation[j]['RawId'] ) {
                    selectItems.push(contactsInformation[j]);
                }
            }
        }
        obj = this.changeCheckAll(searchResultArr,obj)
        this.setState({selectItems:selectItems, obj:obj})
        this.props.form.setFieldsValue(obj)
    }

    changeCheckAll = (curArr,obj) => {
        let curIdArr = []
        for(let i in curArr){
            curIdArr.push(curArr[i].RawId);
        }
        let selectedIdArr = []
        let starpos = 'contactCheckbox'.length
        for(var key in obj){
            let a = key.indexOf('contactCheckbox')
            if(a!==-1){
                if(obj[key]===true)
                    selectedIdArr.push(key.substr(starpos))
            }
        }
        let num = 0;
        for (let i = 0; i < selectedIdArr.length; i++) {
            for (let j = 0; j <curIdArr.length ; j++) {
                if(selectedIdArr[i]===curIdArr[j]){
                    num = num + 1
                }
            }
        }
        if (num!==0 && num === curIdArr.length){
            obj['contactCheckall'] = true
        } else {
            obj['contactCheckall'] = false
        }
        return obj
    }


    handleDelete = (text,index,e) => {
        let obj = this.state.obj;
        let contactSelet = this.state.contactSelet;
        let selectItems = this.state.selectItems;
        selectItems = [];
        const contactsInformation = this.props.contactsInformation;
        var index = $.inArray(text.RawId,contactSelet);
        if (index != -1) {
            contactSelet.splice(index,1);
        }
        for (var i = 0; i < contactSelet.length; i++) {
            for ( var j = 0; j < contactsInformation.length; j++) {
                if (contactSelet[i] == contactsInformation[j]['RawId']) {
                    selectItems.push(contactsInformation[j]);
                }
            }
        }
        obj['contactCheckbox' + text.RawId] = false;
        if (selectItems.length != contactsInformation.length) {
            obj['contactCheckall'] = false;
        }
        this.setState({selectItems:selectItems, obj:obj})
        this.props.form.setFieldsValue(obj)
    }

    handleSearchResult = (searchResultArr, seleceted) => {
        let obj = this.state.obj;
        this.setState({searchResultArr:searchResultArr})
        let contactSelet = this.state.contactSelet;
        let selectItems = this.state.selectItems
        if(searchResultArr && searchResultArr.length>0 ){
            for (var i = 0; i < searchResultArr.length; i++) {
                var index = $.inArray(searchResultArr[i].RawId,contactSelet);
                if (seleceted) {
                    if (index === -1) {
                        contactSelet.push(searchResultArr[i].RawId);
                        selectItems.push(searchResultArr[i]);
                    }
                    obj['contactCheckbox' + searchResultArr[i]['RawId']] = true;
                } else if(seleceted === false) {
                    if (index !== -1) {
                        contactSelet.splice(index,1);
                        selectItems.splice(index,1)
                    }
                    obj['contactCheckbox' + searchResultArr[i]['RawId']] = false;
                }
            }
            obj = this.changeCheckAll(searchResultArr,obj)
            if (seleceted === null) {
                this.setState({obj:obj})
                this.props.form.setFieldsValue(obj);
            } else {
                this.setState({selectItems:selectItems, obj:obj, contactSelet:contactSelet});
                this.props.form.setFieldsValue(obj);
            }
        }
    }

    handleDeleteItem = (text) => {
        this.props.removeGroup(text.Id);
        this.props.getGroups((result) => {
            this._createData();
        });

    }

    _createName = (text, record, index) => {
        let status;
        status = <div style = {{'height':'33px'}}><span className = "contactsIcon"></span><span className = "ellips contactstext">{text}</span></div>;
        return status;
    }

    _createData = () => {
        const callTr = this.props.callTr;
        let mContactNum = this.props.mContactNum;
        let groupInformation = this.props.groupInformation;
        let contactsInformation = this.props.contactsInformation;
        let data = [];
        if (groupInformation.length == 0) {
            this.setState({showtips:'block'})
        } else {
            this.setState({showtips:'none'})
        }
        for (var i = 0; i < groupInformation.length; i++) {
            groupInformation[i]['names'] = [];
            groupInformation[i]['numbers'] = [];
            groupInformation[i].ContactId.map((id) => {
                contactsInformation.map((item, index) => {
                    if (item.RawId == id) {
                        groupInformation[i]['names'].push(item.Name);
                        groupInformation[i]['numbers'].push(item.Number[0]);
                    }
                })
            });
            data.push({
                key: i,
                row0: groupInformation[i].Name,
                row1: groupInformation[i].numbers.length + " " + callTr("a_16647"),
                row2: groupInformation[i]
            })
        }
        this.groupList = data;
        this.setState({
            curContactList: data
        });
        return data
    }

    createActions = (text, record, index) => {
        let statue;
        statue = <div className = {"callRecord " + text.Id}>
            <button className='allow-edit' id = {'allow-edit'+index}  onClick={this.handleEditItem.bind(this, text, index)}></button>
            <Popconfirm placement="top" title={this.tr("a_19628")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleDeleteItem.bind(this, text, index)}>
                <button className='allow-delete' id = {'allow-delete'+index} ></button>
            </Popconfirm>
        </div>;
        return statue;
    }

    render() {
        const callTr = this.props.callTr;
        let contactsInformation = this.props.contactsInformation;
        const curDataList = this.state.curContactList
        const columns = [{
            title: callTr("a_4779"),
            key: 'row0',
            dataIndex: 'row0',
            width: '40%',
            render: (text, record, index) => (
                this._createName(text, record, index)
            )
        } ,{
            title: callTr("a_16046"),
            key: 'row1',
            dataIndex: 'row1',
            width: '30%',
        }, {
            title: callTr("a_44"),
            key: 'row2',
            dataIndex: 'row2',
            width: '30%',
            render: (text, record, index) => (
                this.createActions(text, record, index)
            )
        }];
        let data = curDataList ? curDataList : this._createData()
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelectItem,
            onSelectAll: this.onSelectAllGroup
        }
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <div style={{margin:"0px 10px"}}>
                <div style={{margin:"4px 10px 10px 22px", height:'32px'}}>
                    <div style={{'float':'left'}}>
                        <Button className="select-delete" type="primary" disabled={!hasSelected} style={{marginRight:'10px'}} onClick={this.showDelGroupModal}>
                            <i className={!hasSelected ? "select-delete-icon" : ""} />
                            {this.tr("a_19067")}
                        </Button>
                        <Modal visible={this.state.displayDelGroupModal} title={this.tr("a_19627")} className="confirm-modal"
                               okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.handleOkDeleteAll} onCancel={this.handleDelGroupCancel}>
                            <p className="confirm-content">{this.tr("a_19628")}</p>
                        </Modal>
                        <Button type="primary" style={{marginRight:'10px'}} onClick={this.showGroupModal}>
                            {this.tr("a_4838")}
                        </Button>
                    </div>
                    <div style={{'float':'right'}}>
                        <div className = 'search_div'>
                            <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} id="search" onChange={this.handleChange.bind(this)} placeholder = {callTr("a_65")}></Input>
                        </div>
                    </div>
                </div>
                <div className = 'CallDiv Grouptable'>
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
                        <p>{this.tr("a_10082")}</p>
                    </div>
                </div>
                <GroupEditModalForm {...this.props} handleHideGroupModal={this.handleHideGroupModal}  displayGroupModal={this.state.displayGroupModal} callTr={this.props.callTr}
                    htmlEncode={this.htmlEncode} editGroup={this.state.editGroup} addNewGroup={this.state.addNewGroup} contactsInformation={contactsInformation}
                    promptMsg={this.props.promptMsg} updateGroups={this.updateGroups} contactSelet={this.state.contactSelet} selectItems={this.state.selectItems} obj={this.state.obj}
                    checkboxChange={this.checkboxChange} handleDelete={this.handleDelete} handleSelectAll={this.handleSelectAll} handleSearchResult={this.handleSearchResult}  />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    mContactNum:state.mContactNum,
    groupInformation:state.groupInformation,
    contactsInformation:state.contactsInformation,
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
    const actios = {
        getContactCount:Actions.getContactCount,
        getGroups:Actions.getGroups,
        getContacts:Actions.getContacts,
        removeGroup:Actions.removeGroup,
    }

    return bindActionCreators(actios, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(GroupTab));
