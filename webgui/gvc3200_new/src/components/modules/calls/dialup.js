import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router';
import Enhance from "../../mixins/Enhance"
import { Layout, Select, Input, Button, Icon, Row, Col, Form, Popover } from "antd"
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CallSelectNum from './contact/selectNum'
const Content = Layout
const Option = Select.Option
const FormItem = Form.Item

class DialUpForm extends Component {
    globalItems = [];
    contactItems = [];
    constructor(props){
        super(props);
        
        this.state = {
            displayitems: [],
            filterStr: ""
        }
    }
    
    componentDidMount = () => {
        this.props.getAcctStatus();
        this.props.getCalllog(6, (logitems) => {
            this.globalItems = this.globalItems.concat(JSON.parse(JSON.stringify(logitems)));
            this.props.getContacts((result) => {
                this.contactItems = JSON.parse(JSON.stringify(this.props.contactsInformation));
                for (let i in this.contactItems) {
                    if (this.contactItems[i].Number.length > 1) {
                        this.contactItems[i].AcctIndex = this.props.contactsAcct[i].AcctIndex;
                    }
                    this.contactItems[i].Type = "0";
                }
                this.globalItems = this.globalItems.concat(this.contactItems);
                this.setState({displayitems: this.globalItems});
            });
        });
    }

    clickToAddAcct = () => {
        this.props.setCurMenu(['account']);
        this.props.setTabKey("1");
        hashHistory.push('/account');
        this.props.jumptoTab(0);
    }
    
    filterNumber = (e) => {
        let value = e.target.value.trim();
        let numbers = this.globalItems;
        let filternum = [];
        for (let i in numbers) {
            if(numbers[i].Type == "0"){
                for(let j in numbers[i].Number){
                    if(numbers[i].Number[j].indexOf(value) != -1){
                        filternum.push(numbers[i]);
                        break;
                    }
                }
            } else {
                if(numbers[i].NameOrNumber.indexOf(value) != -1){
                    filternum.push(numbers[i]);
                }
            }
        }
        
        this.setState({
            displayitems: filternum,
            filterStr: value
        });
    }
    
    handleDialUp = (tag, curnum, curacct) => {
        // tag: 0-contact  1-call in  2-call out  3-missing call  4-typing number to dial up
        const form = this.props.form;
        if(tag == 4){
            curnum = form.getFieldValue("inputnum").trim();
            if(!this.existActiveAccount){
                curacct = -1;
            }else{
                curacct = form.getFieldValue("selacct");
            }
            form.setFieldsValue({"inputnum": ""});
            this.setState({
                displayitems: this.globalItems,
                filterStr: ""
            });
        }
        // request won't be sent when there is a call exists
        let calltip = document.getElementsByClassName('on-call-tip')[0];
        if(calltip){
            this.props.promptMsg('WARNING','a_talkingwait');
            return false;
        }
        if(!curnum){
            this.props.promptMsg('WARNING','a_switchNonumber');
            return false;
        }

        if(curnum == "anonymous"){
            this.props.promptMsg('WARNING','a_tip_dialanonymous');
            return false;
        }

        //source: OTHER = 0; CONTACT = 1; DIAL_VIEW = 2; IN_CALL_HISTORY = 3; OUT_CALL_HISTORY = 4; MPK_OR_CLICK_TO_DIAL = 5;
        let typearr = [1, 3, 4, 3, 2];
        this.props.sendSingleCall(curnum, curacct, 0, 0, typearr[tag], 0);
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        
        const msgsContacts = this.props.msgsContacts;

        let curAcct = [];
        this.existActiveAccount = false;
        if(!this.isEmptyObject(this.props.acctStatus)) {
            const acctstatus = this.props.acctStatus.headers;
            let max = 16;
            if(this.isWP8xx()) max = 2;
            
            for(let i = 0; i < max; i++){
                if(acctstatus[`account_${i}_status`] == "1"){
                    curAcct.push({"order": i, "num": acctstatus[`account_${i}_no`]});
                    this.existActiveAccount = true;
                }
            }
        }
        
        return (
            <Content className="content-container">
                <div className="subpagetitle">{this.tr("a_dialup")}</div>
                <Form className="call-area" style={{'min-height': this.props.mainHeight, 'height': this.props.mainHeight}}>
                    <div className="dial-up-top">
                        {curAcct.length ?
                            getFieldDecorator("selacct", {
                                initialValue: curAcct[0].order
                            })(
                                <Select>
                                    {curAcct.map((acct, i) => {
                                        return <Option value={acct.order}><span className="spot-icon"></span>{acct.num}</Option>
                                    })}
                                </Select>
                            ) :
                            this.props.userType == "admin" ?
                                <Button className="call-acct-btn" onClick={this.clickToAddAcct}><Icon type="plus" />{this.tr("a_add_acct")}</Button> :
                                <Button className="call-acct-btn" disabled="disabled">{this.tr("no_use_acct")}</Button>
                        }
                        <FormItem className="call-inputnum-formitem">
                            {
                                getFieldDecorator("inputnum", {
                                    initialValue: ""
                                })(
                                    <Input className="call-input-num" placeholder={this.tr("a_inputnum")} onChange={this.filterNumber} onPressEnter={this.handleDialUp.bind(this, 4, "")}></Input>
                                )
                            }
                        </FormItem>
                        <Button type="primary" className="call-out" onClick={this.handleDialUp.bind(this, 4, "")}><span className="display-icon phone-icon" /></Button>
                    </div>
                    <div className="dial-up-bottom">
                        {this.state.displayitems.length ? 
                            <Row className="recent-call-title" type="flex" justify="space-around">
                                <Col span={24}>{this.tr("recent_call")}</Col>
                            </Row> :
                            null
                        }
                        {this.state.displayitems.length ? 
                            this.state.displayitems.map((item, i) => {
                                let name, number;
                                if(item.Type == "0"){
                                    name = item.Name;
                                    number = item.Number.join(",");
                                } else {
                                    name = item.IdentityName;
                                    number = item.NameOrNumber;
                                    let contactslen = msgsContacts.length;
                                    for(var i = 0; i < contactslen; i++){
                                        let contactItem = msgsContacts[i];
                                        if(contactItem.Number && contactItem.Number == number &&
                                            (contactItem.AcctIndex == item.Account || contactItem.AcctIndex == '-1')){
                                            name = contactItem.Name;
                                            break;
                                        }
                                    }
                                    if(!name) name = number;
                                }
                                let preStr = number, filterStr = "", lastStr = "";
                                if(this.state.filterStr != ""){
                                    filterStr = this.state.filterStr;
                                    let index = preStr.indexOf(filterStr);
                                    preStr = preStr.substring(0,index);
                                    lastStr = number.substring(index+filterStr.length);
                                }

                                return(
                                    <Row className="call-items" type="flex" justify="space-around">
                                        <Col span={8} style={{paddingLeft:26}}><div><div className={`display-icon item-type${item.Type}`}></div><div className="ellips contactstext contactname">{name}</div></div></Col>
                                        <Col span={5}></Col>
                                        <Col span={9}><span className="ellips contactstext contactnumber">{preStr}<span style={{color:"#ff0a0a"}}>{filterStr}</span><span>{lastStr}</span></span></Col>
                                        <Col className="callRecord" span={2} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                            {
                                                item.Type == "0" && item.Number.length > 1 ? 
                                                <Popover
                                                    content={
                                                        <CallSelectNum sendSingleCall={this.props.sendSingleCall} selectnumItem={item} existActiveAccount={this.existActiveAccount}/>
                                                    }
                                                    placement="topRight"
                                                    trigger="focus">
                                                    <button className="item-call-btn display-icon"></button>
                                                </Popover> : 
                                                <div className="item-call-btn display-icon" onClick={this.handleDialUp.bind(this, Number(item.Type), number, item.Type == "0" ? item.AcctIndex : item.Account)}></div> 
                                            }
                                        </Col>
                                    </Row>
                                )
                            }) :
                            <Row>
                                <div className = "nodatatips">
                                    <div></div>
                                    <p>{this.tr("no_data")}</p>
                                </div>
                            </Row>
                        }
                    </div>
                </Form>
            </Content>
        );
    }
}

const DialUp = Form.create()(Enhance(DialUpForm));

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    userType: state.userType,
    msgsContacts: state.msgsContacts,  //contacts list
    contactsAcct: state.contactsAcct,  //contacts with accounts formatted
    contactsInformation: state.contactsInformation,  //contacts with numbers formatted
    acctStatus: state.acctStatus,
    product: state.product,
    callDialog: state.callDialog

})

function mapDispatchToProps(dispatch) {
  var actions = {
      jumptoTab: Actions.jumptoTab,
      setCurMenu: Actions.setCurMenu,
      getContacts: Actions.getContacts,
      sendSingleCall: Actions.sendSingleCall,
      showCallDialog: Actions.showCallDialog,
      getCalllog: Actions.get_calllog,
      getAcctStatus: Actions.getAcctStatus,
      setTabKey: Actions.setTabKey,
      promptMsg: Actions.promptMsg,
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DialUp));
