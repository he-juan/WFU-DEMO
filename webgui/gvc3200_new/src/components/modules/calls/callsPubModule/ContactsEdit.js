import React, { Component } from 'react'
import Enhance from '../../../mixins/Enhance'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form,Checkbox, Modal, Tooltip, Icon, Row,Col, Input, Button, Select, Radio } from "antd"
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const Search = Input.Search;
const acctname_item = ['270','417','517','617','1717','1817',"50617","50717","50817","50917","51017","51117","51217","51317","51417","51517"];
let mCurContacts = [];
let children=[];
let req_items = new Array;

class ContactsEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            addNewContact:[0],
            editNumbers:[],
            groups:[],
            contactId:"",
        }
    }

    handlePvalue = () => {
        let getReqItem = this.props.getReqItem;
        req_items = [];
        if(this.isWP8xx()) {
            acctname_item.splice(2,acctname_item.length-1)
        }
        for(var i = 0 ;i<acctname_item.length;i++) {
            req_items.push(getReqItem("name"+i, acctname_item[i], ""))
        }
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue())
        // this.props.getContactCount();
        this.props.getTonelist("tonelist", (data)=> {
            this.getTonelistDone(data);
        });
        setTimeout(()=>{
            this.props.groups.length>0 && this.handleSaveContactGroupId(this.props.groups[0]['Id'])
        },500)
    }

    handleSubmit = () => {

    }

    handleOk = () => {
        let name = this.props.form.getFieldsValue(['firstname','lastname'])
        let [firstname,lastname] = [name.firstname,name.lastname]
        if((firstname == undefined || firstname.replace(/(^\s*)|(\s*$)/g,"") == "") && (lastname == undefined || lastname.replace(/(^\s*)|(\s*$)/g,"") == "")) {
            this.props.promptMsg('ERROR','a_7442');
            return false;
        }

        if(this.judgeSameContacts(firstname, lastname)) {
            return false;
        } else {
            this.handleAddEditContacts(firstname, lastname);
        }
        this.props.handleHideModal();
    }

    handleAddEditContacts = (firstname, lastname) => {
        let addoredit = this.props.addNewContact ? 'add' : 'edit';
        let contactNumber = this.props.form.getFieldsValue(['workphone','familyphone','mobilephone'])
        let contactgroups = this.state.contactId;
        let curAccount = this.props.curAccount;
        let rawcontact='{}';
        if(addoredit == 'edit'){
            rawcontact = `{contactid:${this.props.editContact['Id']}}`;
        }
        let infostr = `{'rawcontact':${rawcontact},'structuredname':{'givenname':${lastname},'familyname':${firstname}},'groupmembership':[{'groupid':${contactgroups}}],'phone':[{'type':2,'account':${curAccount},'number':${contactNumber.workphone}},{'type':2,'account':${curAccount},'number':${contactNumber.familyphone}},{'type':2,'account':${curAccount},'number':${contactNumber.mobilephone}}],'email':[]}`;
        this.props.setContacts(infostr,()=>{
            this.props.updateContact()
        })

    }

    handleSaveContactGroupId = (val) => {
        this.setState({contactId:val})
    }

    judgeSameContacts = (firstname,lastname) => {
        if(mCurContacts.length == 0) {
            return false;
        }
        for(var i = 0; mCurContacts[i] != undefined; i++) {
            if(mCurContacts[i].FirstName == firstname && mCurContacts[i].LastName == lastname)
                return true;
        }
        return false;
    }

    handleCancel = () => {
        this.props.handleHideModal();
    }

    getTonelistDone = (data) => {
        if( data.substring(0,1) == '{' ) {
            var json = eval("(" + data + ")");
            var ringtone = json.Ringtone;
            var ringname, indexdot;
            ringtone = ringtone.sort((a,b) => {
                return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
            });
            for (var i = 0; ringtone[i] != undefined; i++) {
                indexdot = ringtone[i].lastIndexOf(".");
                ringname = ringtone[i].substring(0,indexdot);
                children.push(<Option value = {"/system/media/audio/ringtones/" + ringtone[i]}>{this.props.htmlEncode(ringname)}</Option>);
            }
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {callTr,itemValues} = this.props;
        return (
            <Modal title={callTr('a_15003')} onOk={this.handleOk} onCancel={this.handleCancel} className='contacts-modal' visible={this.props.displayModal}>
                <Form hideRequiredMark >
                    <FormItem label={(<span>{callTr("a_19626")}</span>)}>
                        {getFieldDecorator('firstname', {
                        })(
                            <Input style={{width:'40%'}} placeholder={callTr('a_207')}/>
                        )}&nbsp;&nbsp;
                        {getFieldDecorator('lastname', {
                        })(
                            <Input style={{width:'40%'}} placeholder={callTr('a_208')} />
                        )}
                    </FormItem>
                    <FormItem label={(<span>{callTr("a_workphone")}</span>)}>
                        {getFieldDecorator('workphone', {
                        })(
                            <Input style={{width:'80%'}} placeholder={callTr('a_workphone')} />
                        )}
                    </FormItem>
                    <FormItem label={(<span>{callTr("a_familyphone")}</span>)}>
                        {getFieldDecorator('familyphone', {
                        })(
                            <Input style={{width:'80%'}} placeholder={callTr('a_familyphone')} />
                        )}
                    </FormItem>
                    <FormItem label={(<span>{callTr("a_mobilephone")}</span>)}>
                        {getFieldDecorator('mobilephone', {
                        })(
                            <Input style={{width:'80%'}} placeholder={callTr('a_mobilephone')} />
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_4779")}</span>}>
                        {getFieldDecorator("contactgroups", {
                            initialValue: this.props.groups.length>0 ? this.props.groups[0]['Name'] : null
                        })(
                            <Select onChange={this.handleSaveContactGroupId} style={{width:'100%'}}>
                                {
                                    this.props.groups.map((item,index)=>{
                                        return <option value={item['Id']}>{item['Name']}</option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    {/*
                    <FormItem className = "select-item"  label={(<span>{callTr("a_ringtone")}</span>)}>
                        {getFieldDecorator('ringtone', {
                            initialValue: itemValues['ringtone'] ? itemValues['ringtone'] : 'content://settings/system/ringtone'
                        })(
                            <Select style={{width:'50%'}}>
                                <Option value="content://settings/system/ringtone">{callTr("a_8421")}</Option>
                                <Option value="ringtone_silence">Silent</Option>
                                {children}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_bindaccount")}</span>}>
                        {getFieldDecorator('bindaccount', {
                            initialValue: '0'
                        })(
                            <Select style={{width:'50%'}}>
                                {
                                    acctname_item.map((acct,index)=> {
                                        return <Option value={`${index}`}>{itemValues['name'+index] ? itemValues['name'+index] : `${callTr('a_301')} ${index+1}` }</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_contactaddress")}</span>}>
                        {getFieldDecorator('contactaddress', {
                        })(
                            <Input style={{width:'80%'}} placeholder={callTr('a_contactaddress')}/>
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_company")}</span>}>
                        {getFieldDecorator('company', {
                        })(
                            <Input style={{width:'80%'}} placeholder={callTr('a_company')}/>
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_contactrank")}</span>}>
                        {getFieldDecorator('contactrank', {
                        })(
                            <Input style={{width:'80%'}} placeholder={callTr('a_contactrank')}/>
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_department")}</span>}>
                        {getFieldDecorator('department', {
                        })(
                            <Input style={{width:'80%'}} placeholder={callTr('a_department')}/>
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_contacttitle")}</span>}>
                        {getFieldDecorator('contacttitle', {
                        })(
                            <Input style={{width:'80%'}} placeholder={callTr('a_contacttitle')}/>
                        )}
                    </FormItem>
                    */}
                </Form>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
    var actions = {}
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps ,mapDispatchToProps)(Enhance(ContactsEdit));
