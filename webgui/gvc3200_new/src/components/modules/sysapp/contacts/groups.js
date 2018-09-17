import React, { Component } from 'react'
import Enhance from '../../../mixins/Enhance'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form,Checkbox, Modal,Badge,Collapse, Tooltip, Icon, Row,Col, Input, Button, Select, Radio } from "antd"
const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search;
const Panel = Collapse.Panel;
const acctname_item = ['270','417','517','617','1717','1817',"50617","50717","50817","50917","51017","51117","51217","51317","51417","51517"];
let mGroups = [];
let mEditMode=0;
let selectid = "";
let children=[];
let req_items = new Array;

class GroupsAddEditBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            addNewGroup:[0],
            groups:[],
            searchContacts:[]
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
        this.props.getContactCount();
        this.props.getTonelist("tonelist", (data)=> {
            this.getTonelistDone(data);
        });
    }

    handleSubmit = () => {

    }

    handleOk = () => {
        let addoredit = this.props.addNewGroup ? 'add' : 'edit';
        let groupname = this.props.form.getFieldValue('groupname');
        let editGroup = this.props.editGroup;
        let contactids='',setGroupsFlag=true;
        if((groupname == undefined || groupname.replace(/(^\s*)|(\s*$)/g,"") == "")) {
            this.props.promptMsg('ERROR','a_nameempty');
            return false;
        }

        if(this.judgeSameContacts(groupname)) {
            return false;
        } else {
            let ringtone = this.props.form.getFieldValue('ringtone');
            //this.props.editGroup
            if(addoredit != 'add') {
                if(editGroup['Name'] == groupname && editGroup['Ringtone'] == ringtone ) {
                    setGroupsFlag = false;
                }
            }

            let cbs = document.querySelectorAll('[data-className=contactCheckbox]')
            for(let i=0,len=cbs.length;i<len;i++) {
                if(cbs[i]['checked']) {
                    if(contactids != ''){
                        contactids += ":::";
                    }
                    contactids += cbs[i].getAttribute("data-rawid");
                }
            }
            if(addoredit == 'add') {
                this.props.setGroups(groupname,ringtone,'',(data)=>{
                    this.props.updateGroupMembers(0,data['msg'],contactids);
                    this.props.updateGroups();
                })
            } else {
                if(setGroupsFlag) {
                    this.props.setGroups(groupname,ringtone,editGroup['Id'],()=>{

                    })
                }
                this.props.updateGroupMembers(0,editGroup['Id'],contactids);
                this.props.updateGroups();

            }

        }

        this.props.handleHideModal();
    }

    judgeSameContacts = (newGroup) => {
        if(mGroups.length == 0) {
            return false;
        }
        for(var i = 0; mGroups[i] != undefined; i++) {
            if(mGroups[i] ==  newGroup)
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
            ringtone = ringtone.sort((a,b) => {
                return a['title'].toLowerCase() > b['title'].toLowerCase() ? 1 : -1;
            });
            for (var i = 0; ringtone[i] != undefined; i++) {
                children.push(<Option value = {ringtone[i].data}>{this.props.htmlEncode(ringtone[i].title)}</Option>);
            }
        }
    }

    checkboxChange = () => {

    }

    handleSelectAll = (e) => {
        let checkboxs = document.querySelectorAll('.contacts-modal .ant-checkbox-input')
        if(e.target.checked) {
            checkboxs.forEach((item,index)=> {
                item.checked = true;
                item.parentNode.className = "ant-checkbox ant-checkbox-checked";
            })
        } else {
            checkboxs.forEach((item,index)=> {
                item.checked = false;
                item.parentNode.className = "ant-checkbox";
            })
        }
    }

    handleSearch = (value) => {
        let contacts = this.props.items;
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

    render() {
        const {getFieldDecorator} = this.props.form;
        const {callTr,itemValues,mContactNum} = this.props;
        return (
            <Modal title={callTr('a_addcontactgroups')} onOk={this.handleOk} onCancel={this.handleCancel} className='contacts-modal' visible={this.props.displayModal}>
                <Form hideRequiredMark >
                    <FormItem label={(<span>{callTr("a_name")}</span>)}>
                        {getFieldDecorator('groupname', {
                        })(
                            <Input style={{width:'80%'}} placeholder={callTr('a_name')}/>
                        )}
                    </FormItem>
                    <FormItem className = "select-item"  label={(<span>{callTr("a_groupringtone")}</span>)}>
                        {getFieldDecorator('ringtone', {
                            initialValue: itemValues['ringtone'] ? itemValues['ringtone'] : 'content://settings/system/ringtone'
                        })(
                            <Select style={{width:'100%'}}>
                                <Option value="content://settings/system/ringtone">{callTr("a_8421")}</Option>
                                <Option value="ringtone_silence">Silent</Option>
                                {children}
                            </Select>
                        )}
                    </FormItem>

                    <Badge style={{margin:'0.5rem 0',fontWeight:'bold'}} status="processing" text={callTr("a_16046")} />
                    <FormItem>
                        <Search style={{margin:'0.5rem 1rem',height:'32px'}} placeholder={ `${callTr('a_65')} ${mContactNum} ${callTr('a_backup_contacts')}` } onSearch={this.handleSearch} onChange={this.handleListenValue} enterButton/>
                    </FormItem>
                    {
                        (this.state.searchContacts.length>0 ? this.state.searchContacts : this.props.items).map((item,index)=>{
                            return (
                                <Row type="flex" justify="around" align="middle" style={{ margin:'0.5rem 1rem',height: '20px', fontSize: '0.875rem'}}>
                                    <Col span={2}>
                                        {getFieldDecorator('contactCheckbox'+index, {
                                            valuePropName: 'checked',
                                        })(
                                            <Checkbox data-className='contactCheckbox' data-RawId={item.RawId} onChange={this.checkboxChange}></Checkbox>
                                        )}
                                    </Col>
                                    <Col span={6}>
                                        <span data-className='nametext'>{item['Name']}</span>
                                    </Col>
                                    <Col span={6}>
                                        {
                                            item['Number'].map((num,index,arr)=>{
                                                return <span data-className='numbertext' style={{paddingRight:'10px'}}>{`${num}${arr.length>1 && index != arr.length-1 ? "," : ""}`}</span>
                                            })
                                        }
                                    </Col>
                                </Row>
                            )
                        })
                    }
                    <Row style={{ margin:'1.5rem 1rem',height: '20px', fontSize: '0.875rem'}}>
                        <Checkbox onChange={this.handleSelectAll}>{callTr('a_selectall')}</Checkbox>&nbsp;
                    </Row>
                </Form>
            </Modal>
        )
    }
}
const ContactsGroupsForm = Form.create()(GroupsAddEditBox);

class GroupsForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            deleteBtn:true,
            displayModal:false,
            addNewGroup:false,
            items:[],
            groups:[],
            editGroup:"",
            addResponseFlagHas:false //新增(这里用作判断是否触发了checkbox change事件)完成之后是否更新标志，默认false
        }
    }

    componentDidMount = () => {
        this.updateGroups();
    }

    updateGroups = () => {
        this.props.getContactCount();
        this.props.getContacts((items)=>{this.setState({items:items})});
        this.props.getGroups((groups)=>{
            this.setState({groups:groups})
        });
    }

    handleAddContact = () => {
        this.setState({displayModal:true,addNewGroup:true})
    }

    handleHideModal = () => {
        this.setState({displayModal:false,addNewGroup:false})
    }

    handleDeleteMultiple = () => {
        let checkboxs = document.querySelectorAll('#group-content .ant-checkbox-checked .ant-checkbox-input')
        let rawids = [];
        for(let i=0,len=checkboxs.length;i<checkboxs.length;i++){
            let rawid = checkboxs[i].getAttribute('data-groupid')
            if(rawid) {
                rawids.push(rawid);
            }
        }
        if(rawids.length>0) {
            this.handleDeleteGroup(rawids.join(','))
        }
    }

    componentDidUpdate = () => {
        let checkboxLength = document.querySelectorAll('#group-content .ant-checkbox-checked').length
        let deleteBtn = this.state.deleteBtn;
        if(checkboxLength>0 && deleteBtn) {
            this.setState({deleteBtn: false});
        } else if(checkboxLength == 0 && !deleteBtn) {
            this.setState({deleteBtn: true});
        }
    }

    selectAllCheckbox = (check,e) => {
        let checkboxs = document.querySelectorAll('#group-content .ant-checkbox-input')
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
        let selectAll = document.querySelector("#group-content input[data-classname='select-all-checkbox']");
        if(check == 'one' && (!e.target.checked) && selectAll.parentNode.className.indexOf('ant-checkbox-checked') != -1) {
            selectAll.checked = false;
            selectAll.parentNode.className = "ant-checkbox";
        }
        this.setState({addResponseFlagHas: true});
    }

    handleDeleteGroup = (groupId) => {
        this.props.removeGroup(groupId);
        this.updateGroups();
    }

    handleEditGroup = (group) => {
        this.setState({displayModal:true,editGroup:group})
        this.props.form.resetFields();
        var contactsNameObj = {};
        group.ContactId.map((id)=>{
            this.state.items.map((item,index)=>{
                if(item.Id == id) {
                    contactsNameObj['contactCheckbox'+index] = true;
                    return true;
                }
            })
        })
        var obj = Object.assign({groupname:group.Name,ringtone:group.Ringtone},contactsNameObj)
        this.props.form.setFieldsValue(obj);
    }

    handelDeleteMember = (group,contactid) => {
        let index = group.ContactId.indexOf(contactid);
        group.ContactId.splice(index,1);
        let contactids = group.ContactId.join(':::')
        this.props.updateGroupMembers(0,group['Id'],contactids);
        this.updateGroups();
    }

    render() {
        //const {getFieldDecorator} = this.props.form;
        const {callTr,mContactNum} = this.props;

        const groupslength = JSON.parse(JSON.stringify(this.state.groups)).length-1;
        return (
            <div id="group-content" style={{margin: 10}}>
                <Row type="flex" justify="around" align="middle" style={{ height: '60px', fontSize: '0.875rem'}}>
                    <Col span={2}>
                        <Checkbox data-classname='select-all-checkbox' onChange={this.selectAllCheckbox.bind(this,'multi')}></Checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="primary" size='large' disabled={this.state.deleteBtn} onClick={this.handleDeleteMultiple}>{callTr('a_19067')}</Button>
                    </Col>

                    <Col span={2}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button type="primary" size='large' onClick={this.handleAddContact}>{callTr('a_23')}</Button>
                    </Col>
                </Row>
                <Collapse accordion bordered={false} defaultActiveKey={[String(groupslength)]}>
                    {
                        this.state.groups.map((group,index)=> {
                            return (
                                <Panel showArrow={false} header={(<p className='groups-panel'><Checkbox data-groupid={group['Id']} onChange={this.checkCheckboxChange.bind(this,'one')}></Checkbox><span style={{margin:'0 50px'}}>{group['Name']}</span><Button type="button" onClick={this.handleDeleteGroup.bind(this,group['Id'])} id={'itemdelbtn'+index} className='itemoperbtn' style={{marginRight:'10px'}}>删除</Button><Button type="button" id={'itemeditbtn'+index} className='itemoperbtn' onClick={this.handleEditGroup.bind(this,group)}>编辑</Button></p>)} key={index}>
                                    {
                                        group.ContactId.map((contactId,index)=>{

                                            let contactInfo = this.state.items.filter((item,index)=>{
                                                return item.Id == contactId;
                                            })
                                            if(contactInfo.length == 0) {
                                                return false;
                                            }
                                            //return <div className='contact_div'><span>{contactInfo[0].Name}</span><span>{contactInfo[0].Number}</span></div>
                                            return (
                                                <Row type="flex" justify="around" align="middle" style={{ height: '60px', fontSize: '0.875rem',borderBottom:'1px dotted #ddd'}}>
                                                    <Col span={1} ></Col>
                                                    <Col span={2} data-className='itemname'>
                                                        <span data-className='nametext'>{contactInfo[0].Name}</span>
                                                    </Col>
                                                    <Col span={4} data-className='itemnumber'>
                                                        {
                                                            contactInfo[0].Number.map((num,index,arr)=>{
                                                                return <span data-className='numbertext' style={{paddingRight:'10px'}}>{`${num}${arr.length>1 && index != arr.length-1 ? "," : ""}`}</span>
                                                            })
                                                        }
                                                    </Col>
                                                    <Col span={4} data-className='divcallbtn'>
                                                        {/*<Button type="button" id='itemcallbtn' className='itemoperbtn'></Button>*/}
                                                        {/*<Button type="button" id='itemdetailbtn' className='itemoperbtn'></Button>*/}
                                                        {/*<Button type="button" id='itemeditbtn' className='itemoperbtn'>编辑</Button>*/}
                                                        <Button type="button" id={'itemdelbtn'+index} className='itemoperbtn' onClick={this.handelDeleteMember.bind(this,group,contactInfo[0]['Id'])}>删除</Button>
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }
                                </Panel>
                            )
                        })
                    }
                </Collapse>
                <ContactsGroupsForm {...this.props} editGroup={this.state.editGroup} displayModal={this.state.displayModal} items={this.state.items} groups={this.state.groups} updateGroups={this.updateGroups} addNewGroup={this.state.addNewGroup} handleHideModal={this.handleHideModal} product={this.props.product} callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    mContactNum:state.mContactNum
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        getContactCount:Actions.getContactCount,
        getContacts:Actions.getContacts,
        getGroups:Actions.getGroups,
        setGroups:Actions.setGroups,
        updateGroupMembers:Actions.updateGroupMembers,
        removeGroup:Actions.removeGroup,
        removeContact:Actions.removeContact,
        getTonelist:Actions.getTonelist
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(GroupsForm));
