import React, { Component } from 'react'
import Enhance from '../../../mixins/Enhance'
import ContactsEdit from "../../../ContactsEdit"
import ImportEdit from './import'
import ExportEdit from './export'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form,Checkbox, Modal, Tooltip, Icon, Row,Col, Input, Button, Select, Radio } from "antd"
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const Search = Input.Search;

const ContactsEditForm = Form.create()(ContactsEdit);
const ImportEditForm = Form.create()(ImportEdit);
const ExportEditForm = Form.create()(ExportEdit);

class ContactsForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            deleteBtn:true,
            displayModal:false,
            addNewContact:false,
            items:[],
            groups:[],
            editContact:{},
            handleSaveContactGroupId:new Function(),
            searchContacts:[],
            addResponseFlagHas:false, //新增(这里用作判断是否触发了checkbox change事件)完成之后是否更新标志，默认false
            displayImportModal:false,
            displayExportModal:false
        }
    }

    componentDidMount = () => {
        this.updateContact()

    }

    updateContact = () => {
        this.props.getContactCount();
        this.props.getContacts((items)=>{this.setState({items:items})});
        this.props.getGroups((groups)=>{this.setState({groups:groups})});
    }

    handleSearch = (value) => {
        let contacts = this.state.items;
        if(value != "" && contacts instanceof Array && contacts.length>0) {
            let searchResult = contacts.filter((itemObj,index)=> {
                let exist = itemObj.Number.some((num)=>{return num.indexOf(value) != -1})
                return itemObj.Name.indexOf(value) != -1 || exist ;
            })
            this.setState({searchContacts:searchResult})
        } else {
            this.setState({searchContacts:[]})
        }
    }

    handleListenValue = (e) => {
        this.handleSearch(e.target.value)
    }

    handleAddContact = () => {
        this.props.form.resetFields();
        this.setState({displayModal:true,addNewContact:true})
    }

    handleHideModal = () => {
        this.setState({displayModal:false,addNewContact:false})
    }

    handleImport = () => {
        this.props.form.resetFields();
        this.setState({displayImportModal: true});

    }

    handleExport = () => {
        this.props.form.resetFields();
        this.setState({displayExportModal: true});

    }

    handleHideImportModal = () => {
        this.setState({displayImportModal: false});
    }

    handleHideExportModal = () => {
        this.setState({displayExportModal: false});
    }

    handleDeleteMultiple = () => {
        let checkboxs = document.querySelectorAll('#contact-content .ant-checkbox-checked .ant-checkbox-input')
        let rawids = [];
        for(let i=0,len=checkboxs.length;i<checkboxs.length;i++){
            let rawid = checkboxs[i].getAttribute('data-rawid')
            if(rawid) {
                rawids.push(rawid);
            }
        }
        if(rawids.length>0) {
            this.handleRemoveContact(rawids.join(','))
        }
    }

    componentDidUpdate = () => {
        let checkboxLength = document.querySelectorAll('#contact-content .ant-checkbox-checked').length
        let deleteBtn = this.state.deleteBtn;
        if(checkboxLength>0 && deleteBtn) {
            this.setState({deleteBtn: false});
        } else if(checkboxLength == 0 && !deleteBtn) {
            this.setState({deleteBtn: true});
        }

    }

    selectAllCheckbox = (check,e) => {
        let checkboxs = document.querySelectorAll('#contact-content .ant-checkbox-input')
        this.checkCheckboxChange(check,e)
        if(e.target.checked) {
            checkboxs.forEach((item,index)=> {
                if(index>0 && (!item.checked) ) {
                    item.click();
                    item.checked = true;
                    item.parentNode.className = "ant-checkbox ant-checkbox-checked";
                }
            })
        } else {
            checkboxs.forEach((item,index)=> {
                if(index>0 && item.checked) {
                    item.click();
                    item.checked = false;
                    item.parentNode.className = "ant-checkbox";
                }

            })
        }
    }

    checkCheckboxChange = (check,e) => {
        let selectAll = document.querySelector("#contact-content input[data-classname='select-all-checkbox']");
        if(check == 'one' && (!e.target.checked) && selectAll.parentNode.className.indexOf('ant-checkbox-checked') != -1) {
            selectAll.checked = false;
            selectAll.parentNode.className = "ant-checkbox";
        }
        this.setState({addResponseFlagHas: true});
    }

    handleEditContact = (contact) => {
        this.setState({displayModal:true,editContact:contact})
        //this.props.form.resetFields();
        let name = contact.Name.split(" ");
        let number = contact.Number;
         var obj = {
             mobilephone:number[2],
             familyphone:number[1],
             workphone:number[0],
             lastname:name[1],
             firstname:name[0]
         };
        this.props.form.setFieldsValue(obj);
    }


    handleRemoveContact = (contactid) => {
        this.props.removeContact(contactid)
        this.updateContact();

    }

    handleCheckGroups = (item) => {
        let groups = this.state.groups;
        let reduceGroupsName=[];
        if(groups.length>0) {
            groups.forEach((group,index)=>{
                let exist = group.ContactId.some((id,index)=>{
                    return id == item.Id
                })
                exist && reduceGroupsName.push(group.Name);
            })
            return reduceGroupsName;
        }
        return reduceGroupsName;
    }

    render() {
        //const {getFieldDecorator} = this.props.form;
        const {callTr,mContactNum} = this.props;
        return (
            <div id="contact-content" style={{margin: 10}}>
                <Row type="flex" justify="around" align="middle" style={{ height: '60px', fontSize: '0.875rem'}}>
                    <Col span={2}>
                        <Checkbox onChange={this.selectAllCheckbox.bind(this,'multi')} data-classname='select-all-checkbox' ></Checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="primary" size='large' disabled={this.state.deleteBtn} onClick={this.handleDeleteMultiple}>{callTr('a_19067')}</Button>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" size='large' onClick={this.handleImport}>{callTr('a_45')}</Button>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" size='large' onClick={this.handleExport}>{callTr('a_34')}</Button>
                    </Col>
                    <Col span={2}>
                        <Button type="primary" size='large' onClick={this.handleAddContact}>{callTr('a_23')}</Button>
                    </Col>
                    <Col span={6}>
                        <Search style={{marginTop:'-0.5rem',height:'32px'}} placeholder={ `${callTr('a_65')} ${mContactNum} ${callTr('a_9603')}` } onSearch={this.handleSearch} onChange={this.handleListenValue} enterButton/>
                    </Col>
                </Row>
                {
                    (this.state.searchContacts.length>0 ? this.state.searchContacts : this.state.items).map((item,idx,items) => {
                        return (
                            <Row type="flex" justify="around" align="middle" style={{ height: '60px', fontSize: '0.875rem',borderBottom:'1px dotted #ddd'}}>
                                <Col span={1} data-className='itemcheck'>

                                    <Checkbox onChange={this.checkCheckboxChange.bind(this,'one')} data-className='row-inputcbx' data-rawid={item['RawId']}></Checkbox>
                                </Col>
                                <Col span={2} data-className='itemname'>
                                    <span data-className='nametext'>{item['Name']}</span>
                                </Col>
                                <Col span={4} data-className='itemnumber'>
                                    {
                                        item['Number'].map((num,index,arr)=>{
                                            return <span data-className='numbertext' style={{paddingRight:'10px'}}>{`${num}${arr.length>1 && index != arr.length-1 ? "," : ""}`}</span>
                                        })
                                    }
                                </Col>
                                <Col span={4} data-className='itemgroup'>
                                    {
                                        this.handleCheckGroups(item).map((name,index,arr)=>{
                                            return <span data-className='grouptext' style={{paddingRight:'10px'}}>{`${name}${arr.length>1 && index != arr.length-1 ? "," : ""}`}</span>
                                        })
                                    }
                                </Col>
                                <Col span={4} data-className='divcallbtn' data-contactid={item['Id']}>
                                    {/*<Button type="button" id='itemcallbtn' className='itemoperbtn'></Button>*/}
                                    {/*<Button type="button" id='itemdetailbtn' className='itemoperbtn'></Button>*/}
                                    <Button type="button" id='itemeditbtn' className='itemoperbtn' onClick={this.handleEditContact.bind(this,item)} style={{marginRight:'10px'}}>{callTr('a_22')}</Button>
                                    <Button type="button" id='itemdelbtn' className='itemoperbtn' onClick={this.handleRemoveContact.bind(this,item['Id'])}>{callTr('a_19067')}</Button>
                                </Col>
                            </Row>
                        )
                    })
                }
                <ContactsEditForm {...this.props} updateContact={this.updateContact} groups={this.state.groups} editContact={this.state.editContact} handleSaveContactGroupId = {this.state.handleSaveContactGroupId} displayModal={this.state.displayModal} addNewContact={this.state.addNewContact} handleHideModal={this.handleHideModal} product={this.props.product} callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                <ImportEditForm {...this.props} displayImportModal={this.state.displayImportModal}  handleHideImportModal={this.handleHideImportModal}  callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                <ExportEditForm {...this.props} displayExportModal={this.state.displayExportModal}  handleHideExportModal={this.handleHideExportModal}  callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    mContactNum:state.mContactNum,
    curAccount:state.curAccount
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        getContactCount:Actions.getContactCount,
        getContacts:Actions.getContacts,
        getGroups:Actions.getGroups,
        setContacts:Actions.setContacts,
        removeContact:Actions.removeContact,
        getTonelist:Actions.getTonelist
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(ContactsForm));
