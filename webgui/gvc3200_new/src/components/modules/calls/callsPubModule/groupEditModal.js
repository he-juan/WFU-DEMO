import React, { Component } from 'react'
import Enhance from '../../../mixins/Enhance'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form,Checkbox, Modal, Tooltip, Icon, Row,Col, Input, Button, Select, Radio } from "antd"
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const Search = Input.Search
let children = [];
//var selectItems = [];

class GroupEditModal extends Component {
    contactList = [];
    selectedContactList =[];
    constructor(props){
        super(props);
        this.state = {
            searchContacts:[],
            selectedRowKeys: [],
            curContactList: []
        }
    }

    componentDidMount = () => {
        let contactsInformation = this.props.contactsInformation
        this.contactList = contactsInformation;
        this.setState({
            curContactList: contactsInformation
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.displayGroupModal !== nextProps.displayGroupModal) {
            this.handleSearch('')
            this.props.form.resetFields();
        }
    }

    handleOk = () => {
        let addoredit = this.props.addNewGroup ? 'add' : 'edit';
        let groupname = this.props.form.getFieldValue('groupname');
        let editGroup = this.props.editGroup;
        let contactids='',setGroupsFlag=true;
        let obj = this.props.obj;
        if((groupname == undefined || groupname.replace(/(^\s*)|(\s*$)/g,"") == "")) {
            this.props.promptMsg('ERROR','a_groupnameempty');
            return false;
        }
        let groupInformation = this.props.groupInformation;
        for (var i = 0; i < groupInformation.length; i++) {
            if ((groupname == groupInformation[i].Name) && ((addoredit == 'add'))) {
                this.props.promptMsg('ERROR','a_groupnamesame');
                return false;
            }
        }

        let ringtone = this.props.form.getFieldValue('ringtone');
        if (addoredit != 'add') {
            if(editGroup['Name'] == groupname && editGroup['Ringtone'] == ringtone ) {
                setGroupsFlag = false;
            }
        }
        let starPos = 'contactCheckbox'.length
        for(var key in obj){
            let a = key.indexOf('contactCheckbox')
            if(a!==-1){
                if(obj[key]===true){
                    if(contactids != ''){
                        contactids += ":::";
                    }
                    contactids += key.substr(starPos);
                }
            }
        }
        if (addoredit == 'add') {
            this.props.setGroups(groupname,'','',(data) => {
                this.props.updateGroupMembers(0,data['msg'],contactids);
                this.props.updateGroups();
            })
        } else {
            if(setGroupsFlag) {
                this.props.setGroups(groupname,'',editGroup['Id'],()=>{

                })
            }
            this.props.updateGroupMembers(0,editGroup['Id'],contactids);
            this.props.updateGroups();
        }
        this.props.handleHideGroupModal()
    }

    handleCancel = () => {
        this.props.handleHideGroupModal()
    }

    handleSearch = (e) => {
        var self = this;
        var searchkey = e.toLowerCase().trim();
        let data = [];
        let dataSource = self.props.contactsInformation
        if (searchkey == "") {
            data = [...dataSource];
        } else {
            let len = dataSource.length;
            for (let i = 0; i < len; i++) {
                let contact = dataSource[i];
                if (contact.Number[0].indexOf(searchkey) != -1 || contact.Name.toLowerCase().indexOf(searchkey) != -1) {
                    data.push(contact);
                }
            }
        }
        this.setState({
            curContactList: data
        });
        this.props.handleSearchResult(data,null);
    }
    handleSearchAll = (e) => {
        this.props.handleSearchResult(this.state.curContactList,e.target.checked);
    }

    handleListenValue = (e) => {
        this.handleSearch(e.target.value)
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {callTr} = this.props;
        const selectItems = this.props.selectItems;
        const obj = this.props.obj;
        return (
             <Modal title={callTr('a_4837')} onOk={this.handleOk} onCancel={this.handleCancel} okText={callTr("a_2")} cancelText={callTr("a_3")} className='groups-modal' visible={this.props.displayGroupModal}>
                <Form hideRequiredMark>
                    <FormItem label={(<span>{callTr("a_groupname")}</span>)}>
                        {getFieldDecorator('groupname', {
                            initialValue:obj.groupname
                        })(
                            <Input style={{width: '89%'}} placeholder={callTr('a_groupname')} />
                        )}
                    </FormItem>
                    <div className = "contactsSelect">
                        <div className = "contactsDiv">
                            <p>{callTr("a_19631")}</p>
                            <div>
                                <Search placeholder={callTr("a_65")} onSearch={this.handleSearch} onChange={this.handleListenValue} enterButton/>
                                <Row type="flex" justify="around" align="middle" style={{ marginTop:'14px',height: '20px', fontSize: '0.875rem'}}>
                                    <Col span={2}>
                                        {getFieldDecorator('contactCheckall', {
                                            valuePropName: 'checked',
                                            initialValue:Number(obj['contactCheckall'])
                                        })(
                                            <Checkbox onChange={this.handleSearchAll}></Checkbox>
                                        )}
                                    </Col>
                                    <Col span={6}>
                                        <span>{callTr('a_405')}</span>
                                    </Col>
                                </Row>
                                {
                                    (this.state.curContactList).map((item, index) => {
                                        return (
                                            <Row type="flex" justify="around" align="middle" style={{ marginTop:'14px',height: '20px', fontSize: '0.875rem'}}>
                                                <Col span={2}>
                                                    {getFieldDecorator('contactCheckbox'+item['RawId'], {
                                                        valuePropName: 'checked',
                                                        initialValue: obj['contactCheckbox'+item['RawId']]
                                                    })(
                                                        <Checkbox onClick={this.props.checkboxChange.bind(item, item)} data-className='contactCheckbox' data-RawId={item.RawId}></Checkbox>
                                                        )}
                                                </Col>
                                                <Col span={6}>
                                                    <span style={{display: 'inline-block',position: 'relative', 'max-width': '72px',overflow: 'hidden','white-space': 'nowrap','text-overflow': 'ellipsis'}} data-className='nametext'>{item['Name']}</span>
                                                </Col>
                                                <Col span={16} style = {{'text-align':'right','max-width': '188px',overflow: 'hidden','white-space': 'nowrap','text-overflow': 'ellipsis'}}>
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
                            </div>
                        </div>
                        <div className = "selectcontacts">
                            <p>{callTr("a_contactselect")}</p>
                            <div>
                                {
                                    selectItems.map((item, index) => {
                                        return (
                                            <Row type="flex" justify="around" align="middle" style={{ marginTop:'14px',height: '20px', fontSize: '0.875rem'}}>
                                                <Col span={6}>
                                                    <span style={{display: 'inline-block',position: 'relative', 'max-width': '72px',overflow: 'hidden','white-space': 'nowrap','text-overflow': 'ellipsis'}} data-className='nametext'>{item['Name']}</span>
                                                </Col>
                                                <Col span={16} style = {{'text-align':'right','max-width': '188px',overflow: 'hidden','white-space': 'nowrap','text-overflow': 'ellipsis'}}>
                                                    {
                                                        item['Number'].map((num,index,arr)=>{
                                                            return <span style={{}} data-className='numbertext' style={{paddingRight:'10px'}}>{`${num}${arr.length>1 && index != arr.length-1 ? "," : ""}`}</span>
                                                        })
                                                    }
                                                </Col>
                                                <Col span={2} style = {{height:'21px', textAlign:"right"}}>
                                                    <button className='allow-delete' id = {'allow-delete-group'+index} onClick={this.props.handleDelete.bind(this, item, index)} ></button>
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    groupInformation:state.groupInformation,
});

function mapDispatchToProps(dispatch) {
    var actions = {
        getTonelist:Actions.getTonelist,
        setGroups:Actions.setGroups,
        updateGroupMembers:Actions.updateGroupMembers,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(GroupEditModal))
