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
let req_items = new Array;
let acctnames = new Array;


class NewContactsEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            addNewContact:[0],
            editNumbers:[],
            groups:[],
            value:"",
            numValuesinnr:[""],
            eValue:"",
            emailValuesinnr:[""]
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

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            acctnames = values;
        })
        // this.props.getContactCount();
    }

    connectInputValue = (e) => {
        let [input,value] = [e.target,e.target.value]
        value = value.trim();
        this.setState({value:value},(e) => {
            let iceIndex = input.id.split("accountnumber")[1]
            let numValuesinnr = this.state.numValuesinnr
            numValuesinnr[iceIndex] = value
            this.setState({numValuesinnr:numValuesinnr})
        })
    }

    hanleNumContacts = (type,index,e) => {
        let numValues = this.props.numValues;
        let addNewContact = this.props.addNewContact;
        let numValuesinnr;
        if (numValues.length === 1 && numValues[0] === "" && addNewContact == true) {
            numValuesinnr = this.state.numValuesinnr;
        } else {
            numValuesinnr = numValues;
        }
        if(type == 1) {
            let len = numValuesinnr.length
            for (let i = 0; i < len ; i++) {
                let value = this.props.form.getFieldValue(`accountnumber${i}`)
                if(value==='' && typeof value){
                    this.props.promptMsg('ERROR','a_7483');
                    return false;
                } else if(!value) {
                    break
                }
            }
            if(numValuesinnr[numValuesinnr.length-1] == "") {
                numValuesinnr.pop()
            }
            numValuesinnr.push("");
            this.setState({numValuesinnr: numValuesinnr})
        } else if(type == 0) {
            if(numValuesinnr.length>1) {
                numValuesinnr.splice(index,1)
                for(let i=0;i<numValuesinnr.length;i++){
                    this.props.form.resetFields(['accountnumber'+i])
                }
                this.setState({numValuesinnr:numValuesinnr})
            }
        } else {
            this.props.promptMsg('ERROR','a_7483');
            return false;
        }
    }

    handleOk = () => {
        let addoredit = this.props.addNewContact ? 'add' : 'edit';
        let displayname = this.props.form.getFieldsValue(['name']).name
        let values = this.props.form.getFieldsValue();
        if(displayname == undefined || displayname.replace(/(^\s*)|(\s*$)/g,"") == "") {
            this.props.promptMsg('ERROR','a_4835');
            return false;
        }
        if(typeof this.props.checkRepeatName == "function" && this.props.checkRepeatName(displayname) && (addoredit == "add")){
            const {callTr} = this.props;
            let self = this
            Modal.confirm({
                content: <span dangerouslySetInnerHTML={{__html: callTr("a_19633")}}></span>,
                okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                cancelText: <span dangerouslySetInnerHTML={{__html: callTr("a_3")}}></span>,
                onCancel() {
                    return false
                },
                onOk() {
                    self.handleAddEditContacts(displayname);
                },
            });
        } else {
            this.handleAddEditContacts(displayname);
        }
    }

    handleAddEditContacts = (displayname) => {
        const {callTr} = this.props;
        let addoredit = this.props.addNewContact ? 'add' : 'edit';
        let numberstr = "";
        let groupstr = "";
        let numValues = this.props.numValues;
        let addNewContact = this.props.addNewContact;
        let values = this.props.form.getFieldsValue();
        let numValuesinnr;
        if (numValues.length === 1 && numValues[0] === "" && addNewContact == true) {
            numValuesinnr = this.state.numValuesinnr;
        } else {
            numValuesinnr = numValues;
        }
        for (var i = 0; i < numValuesinnr.length; i++ ) {
            if(values['accountnumber'+i].length > 60) {
                let str = callTr("a_7485") + callTr("a_19805") + "60!"
                this.props.promptMsg('ERROR', str);
                return false
            }

            if (this.props.form.getFieldsValue(['accountnumber' + i])['accountnumber'+i] == "") {
                continue;
            } else {
                var type = i;
                if (type == 0) {
                    type = 2;
                } else if (type >= 2) {
                    type +=1;
                }
                if( numberstr != "" )
                    numberstr += ',';
                numberstr += '{"type":"' + type + '","account":"' + this.props.form.getFieldsValue(['bindaccount' + i])['bindaccount'+i];
                numberstr += '","number":"' + this.props.form.getFieldsValue(['accountnumber' + i])['accountnumber'+i];
                numberstr += '"}';
            }

        }
        for (var i = 0; i < this.props.groups.length; i++) {
            if( groupstr != "" )
                groupstr += ',';
            if (this.props.form.getFieldsValue(['groupnumber' + this.props.groups[i].Name + this.props.groups[i].Id])['groupnumber' + this.props.groups[i].Name + this.props.groups[i].Id] == true) {
                groupstr += '{"groupid":"' + this.props.groups[i].Id + '"}';
            }
        }
        let rawcontact='{}';
        if(addoredit == 'edit'){
            rawcontact = `{"contactid":"${this.props.editContact['id']}"}`;
        }
        let infostr = `{"rawcontact":${rawcontact},"structuredname":{"displayname":"${displayname}"},"groupmembership":[${groupstr}],"phone":[${numberstr}],"email":[{"type": "1", "address":"${values.email || ''}"}],"note":[{"note":"${values.note || ''}"}],"website":[{"type": "7", "url": "${values.website || ''}"}],"structuredpostal":[{"fomatted":"${values.address|| ""}"}]}`;
        this.props.setContacts(infostr,()=>{
            // setTimeout(() => {
                this.props.updateContact()
            // }, 2500);
        })
        this.props.handleHideModal();
        var containermask = document.getElementsByClassName("containermask")[0];
        if (containermask){
            containermask.style.display = "block";
        }
        this.setState({numValuesinnr:[""],emailValuesinnr:[""]});

    }

    handleCancel = () => {
        this.props.handleHideModal();
        var containermask = document.getElementsByClassName("containermask")[0];
        if (containermask){
            containermask.style.display = "block";
        }
        this.setState({numValuesinnr:[""],emailValuesinnr:[""]});
    }

    checkGroupItem = (id, e) => {
        let checked = e.target.checked;
        const form = this.props.form;
        if (checked) {
            form.setFieldsValue({id: true})
        } else {
            form.setFieldsValue({id: false})
        }
    }

    render() {
        let numValues = this.props.numValues;
        let addNewContact = this.props.addNewContact;
        let numValuesmap = [];

        // let defaultacct = this.props.defaultacct == 2 ? 0 : this.props.defaultacct
        let defaultacct = typeof(this.props.defaultacct) != undefined ? this.props.defaultacct : '-1'

        if (numValues.length === 1 && numValues[0] === "" && addNewContact == true) {
            numValuesmap = this.state.numValuesinnr;
        } else {
            numValuesmap = numValues;
        }
        let title = this.props.addNewContact ? 'a_4840' : 'a_4839';
        const {getFieldDecorator} = this.props.form;
        const {callTr,itemValues} = this.props;
        var acctnumber = new Array;
        for (var item in acctnames) {
            acctnumber.push(acctnames[item]);
        }
        let GroupDisplay = (this.props.groups.length == 0) ? 'none' : 'block';
        let numFromHistor = this.props.numFromHistor
        return (
            // this.props.displayModal &&
            <Modal title={callTr(title)}  onOk={this.handleOk} onCancel={this.handleCancel} okText={callTr("a_2")} cancelText={callTr("a_3")} className={`contacts-modal ${this.props.displayModal ? 'display-block':'display-hidden'}`} visible={this.props.displayModal}>
                <Form hideRequiredMark >
                    <FormItem label={(<span>{callTr("a_7474")}</span>)}>
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true, message: callTr("a_19637")
                            },{
                                max: 60, message: callTr("a_19805") + "60!"
                            }]
                        })(
                            <Input autoFocus='autofocus' style={{width:'89%'}}/>
                        )}
                    </FormItem>
                    {
                        (numValuesmap != "" || numValuesmap.length > 0) && numValuesmap.map((val,idx,arr) => {
                            return (
                                <FormItem  key={'f'+idx} className="numcontact" label={idx == 0 ? (<span>{callTr("a_10006")}&nbsp;</span>) : (<span style={{visibility:'hidden'}}>{"紧急联系人"}</span>)} >
                                    {getFieldDecorator('bindaccount'+idx, {
                                        initialValue: val.split("--- ---")[1] ? val.split("--- ---")[1] : defaultacct
                                    })(
                                        <Select style={{width:'44%'}}>
                                            <Option value="-1">{callTr("a_active_account")}</Option>
                                            <Option value="0">SIP</Option>
                                            <Option value="1">IPVideoTalk</Option>
                                            <Option value="8">H.323</Option>
                                        </Select>
                                    )}&nbsp;&nbsp;
                                    {getFieldDecorator('accountnumber'+idx, {
                                        rules: [{
                                            max:64,message: callTr("a_19632"),
                                        }],
                                        initialValue: val.split('--- ---')[0]
                                    })(
                                        <Input style={{width:'44%',color:numFromHistor && idx == numValuesmap.length -1 ? '#3d77ff': "" }} type="text" autoFocus="autofocus" onChange ={this.connectInputValue} />
                                    )}
                                    <i className='del-btn' onClick = {this.hanleNumContacts.bind(this,'0',idx)}
                                    style={{ backgroundPosition: idx === 0 && numValuesmap.length == 1  ? '-584px -25px' :  '-21px -25px',
                                    cursor:idx === 0 && numValuesmap.length == 1 ? "not-allowed":"pointer"}}/>
                                </FormItem>
                            )
                        })
                    }
                    <FormItem label={(<span>{""}</span>)}>
                        <span style={{float:"right",marginRight:54,color:'#5889fe'}}>{callTr("a_addNum")}</span>
                        <i className={'add-btn'} onClick = {this.hanleNumContacts.bind(this,'1')}
                        style={{ cursor: "pointer"}}
                        />
                    </FormItem>
                    <FormItem label={(<span>{callTr("a_302")}</span>)}>
                        {getFieldDecorator('email', {
                            rules: [{
                                max: 60, message: callTr("a_19805") + "60!"
                            }]
                        })(
                            <Input style={{width:'89%'}}/>
                        )}
                    </FormItem>
                    <FormItem label={(<span>{callTr("a_4748")}</span>)}>
                        {getFieldDecorator('address', {
                            rules: [{
                                max: 60, message: callTr("a_19805") + "60!"
                            }]
                        })(
                            <Input style={{width:'89%'}}/>
                        )}
                    </FormItem>
                    <FormItem label={(<span>{callTr("a_note")}</span>)}>
                        {getFieldDecorator('note', {})(
                            <Input style={{width:'89%'}}/>
                        )}
                    </FormItem>
                    <FormItem label={(<span>{callTr("a_website")}</span>)}>
                        {getFieldDecorator('website', {})(
                            <Input style={{width:'89%'}}/>
                        )}
                    </FormItem>
                    <div className = "contactGroupselect" style={{display:GroupDisplay}}>
                        <FormItem className="one-click-debug" label={<span>{callTr("a_4779")}</span>}>
                            {
                                this.props.groups.map((item, index) => {
                                    return (
                                        <div key={'d'+index}>
                                            {getFieldDecorator("groupnumber" + item['Name'] + item['Id'], {
                                                valuePropName: 'checked',
                                                initialValue: Number("groupnumber" + item['Name'] + item['Id'])
                                            })(
                                                <Checkbox onChange={this.checkGroupItem.bind(this, "groupnumber" + item['Name'] + item['Id'])} />
                                            )}
                                            <span className="ellips" style={{'maxWidth':'430px',position:'absolute'}}>{item['Name']}</span>
                                        </div>
                                    )
                                })
                            }
                        </FormItem>
                    </div>
                </Form>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    product: state.product
});

function mapDispatchToProps(dispatch) {
    var actions = {}
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps ,mapDispatchToProps)(Enhance(NewContactsEdit));
