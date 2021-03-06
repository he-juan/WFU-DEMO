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
        let data = this.props.contactsNew
        let contactList = this.handleContactData(data)
        this.contactList = contactList;
        this.setState({
            curContactList: contactList
        });
    }

    handleContactData = (data) => {
        let contactList = []
        data.forEach(item => {
            let number = item.phone.length ? item.phone[0].number : ''
            let obj = {
                id: item.id,
                name: item.name.displayname,
                number: number
            }
            contactList.push(obj)
        });
        return contactList
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
            this.props.promptMsg('ERROR','a_19635');
            return false;
        }
        let groupInformation = this.props.groupInformation;
        for (var i = 0; i < groupInformation.length; i++) {
            if ((groupname == groupInformation[i].Name) && ((addoredit == 'add'))) {
                this.props.promptMsg('ERROR','a_4834');
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
        $("#search_group").val("")
        this.props.handleHideGroupModal()
    }

    handleSearch = (e) => {
        var self = this;
        var searchkey = e.toLowerCase().trim();
        let data = [];
        let dataSource = self.props.contactsNew
        dataSource = this.handleContactData(dataSource)
        if (searchkey == "") {
            data = [...dataSource];
        } else {
            let len = dataSource.length;
            for (let i = 0; i < len; i++) {
                let contact = dataSource[i];
                if (contact.number.indexOf(searchkey) != -1 || contact.name.toLowerCase().indexOf(searchkey) != -1) {
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
        // console.log(selectItems,'selectItems')
        const obj = this.props.obj;
        return (
             <Modal title={callTr('a_4837')} onOk={this.handleOk} onCancel={this.handleCancel} okText={callTr("a_2")} cancelText={callTr("a_3")} className='groups-modal' visible={this.props.displayGroupModal}>
                <Form hideRequiredMark>
                    <FormItem label={(<span>{callTr("a_4791")}</span>)}>
                        {getFieldDecorator('groupname', {
                            rules: [{
                                max: 60, message: callTr("a_19805") + "60!"
                            }],
                            initialValue:obj.groupname
                        })(
                            <Input style={{width: '89%'}} placeholder={callTr('a_4791')} />
                        )}
                    </FormItem>
                    <div className = "contactsSelect">
                        <div className = "contactsDiv">
                            <p>{callTr("a_19631")}</p>
                            <div>
                                <Search placeholder={callTr("a_65")} id="search_group" onSearch={this.handleSearch} onChange={this.handleListenValue}/>
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
                                            <Row type="flex" key={'r'+index} justify="around" align="middle" style={{ marginTop:'14px',height: '20px', fontSize: '0.875rem'}}>
                                                <Col span={2}>
                                                    {getFieldDecorator('contactCheckbox'+item['id'], {
                                                        valuePropName: 'checked',
                                                        initialValue: obj['contactCheckbox'+item['id']]
                                                    })(
                                                        <Checkbox onClick={this.props.checkboxChange.bind(item, item)} data-className='contactCheckbox' data-RawId={item.RawId}></Checkbox>
                                                        )}
                                                </Col>
                                                <Col span={6}>
                                                    <span style={{display: 'inline-block',position: 'relative', maxWidth: '72px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}} data-className='nametext'>{item['name']}</span>
                                                </Col>
                                                <Col title={item['number']} span={16} style = {{textAlign:'right',maxWidth: '188px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}}>
                                                    {item['number']}
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className = "selectcontacts">
                            <p>{callTr("a_19636")}</p>
                            <div>
                                {
                                    selectItems.map((item, index) => {
                                        return (
                                            <Row key={'r2'+index} type="flex" justify="around" align="middle" style={{ marginTop:'14px',height: '20px', fontSize: '0.875rem'}}>
                                                <Col span={6}>
                                                    <span style={{display: 'inline-block',position: 'relative', maxWidth: '72px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}} data-className='nametext'>{item['name']}</span>
                                                </Col>
                                                <Col title={item['number']} span={16} style = {{textAlign:'right',maxWidth: '188px',overflow: 'hidden',whiteSpace: 'nowrap',textOverflow: 'ellipsis'}}>
                                                    {item['number']}
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
    contactsNew:state.contactsNew
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
