import React, {Component, PropTypes} from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Enhance from "../../../mixins/Enhance";
import NewContactsEdit from "../../../newContactsEdit";
import AddLocalcontacts from "../../../addLocalcontacts";
import NewConEdit from "../../../newConfEdit"
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm, Form ,Popover,Row,Col} from "antd";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';


const NewContactsEditForm = Form.create()(NewContactsEdit);
const AddLocalcontactsForm = Form.create()(AddLocalcontacts);
const NewConEditForm = Form.create()(NewConEdit)
const rowKey = function(record) {
    return record.key;
};
class ContactEditDiv extends Component {
    constructor(props){
        super(props);
        this.state = {
            editContact:{},
            displayModal:false,
            addNewContact:false,
            items:[],
            groups:[],
            handleSaveContactGroupId:new Function(),
            emailValues:[],
            numValues:[],
            displayLocalContactsModal:false,
            addnumber:'',
            addaccount:'',
            showtips: 'none',
            contactsinfo:[],
            confMember:[],
            confSubject:''
        }
    }

    componentDidMount = () => {
        this.updateContact();
    }

    updateContact = () => {
        this.props.getContactCount();
        this.props.getContacts((items)=>{this.setState({items:items})});
        this.props.getGroups((groups)=>{this.setState({groups:groups})});
        // this.props.getContactsinfo((infos)=>{this.setState({contactsinfo:infos})});
        // this.props.getAllConfMember((memberinfo)=>{this.setState({confMember:memberinfo})})
        this.props.getContactsinfo();
        this.props.getAllConfMember();
        this.props.getPreConf();
        this.props.getConfInfo()
    }

    handleClose = () => {
        this.props.handleHide();
    }

    handleHideModal = () => {
        this.setState({displayModal:false,addNewContact:false})
    }

    handleEditContacts = (number, account) => {
        var containermask = document.getElementsByClassName("containermask")[0];
        containermask.style.display="none";
        let numValues = this.state.numValues;
        numValues.length = 0;
        this.setState({displayModal:true,addNewContact:true,emailValues:[""]});
        numValues.push(number + " " + account);
        this.setState({numValues:numValues})
    }

    handleaddLocalContacts = (number, account) => {
        this.setState({
            displayLocalContactsModal: true,
            addnumber: number,
            addaccount: account
        })
    }

    handleHideLocalContactsModal = () => {
        this.setState({displayLocalContactsModal: false})
    }

    handleOkDelete = ( item ) => {
        var divId = "logitemdiv" + item.Id;
        var div = document.getElementById(divId);
        var parentDiv = document.getElementById("logitemsdiv");
        var containerdiv = document.getElementById("containerdiv");
        this.props.get_deleteCall(item.Id, (result) => {
            if (result == 'success') {
                this.props.get_calllog(0);
                div.parentNode.removeChild(div);
                if (parentDiv.children.length == 0) {
                    containerdiv.style.display="none";
                }
            }
        });
    }

    checkRepeatName = (firstname,lastname) => {
        let data = this.props.contactinfodata
        firstname = firstname ? firstname : ""
        lastname = lastname ? lastname : ""
        for(var i = 0; data[i] != undefined; i++) {
            if(data[i].FirstName == firstname && data[i].LastName == lastname)
                return true;
        }
        return false
    }

    render() {
        const callTr = this.props.callTr;
        const convertTime = this.props.convertTime;
        var number;
        var account;
        var nameAccount;
        var numberaccount;
        if ( !$.isEmptyObject(this.props.detailDiv)) {
            number = this.props.detailDiv.Number;
            account = this.props.detailDiv.Account;
        }
        let contactsInformation = this.props.contactsInformation;
        let buttonDisplay = '';
        // if (contactsInformation.length > 0) {
        //     for ( var i = 0; i <  contactsInformation.length; i++) {
        //         var a = contactsInformation[i].Number.indexOf(number);
        //         if ( a !== -1 && this.props.detailDiv.row6 === true) {
        //             buttonDisplay = 'none';
        //             break;
        //         } else {
        //             buttonDisplay = 'inline-block';
        //         }
        //     }
        // }
        // var detailItems = this.props.detailDiv.row3;
        var detailItemsToday = new Array;
        var detailItemsYestday = new Array;
        var detailItemsBefore = new Array;
        // for (var i = 0; i < (detailItems && detailItems.length); i++) {
        //     var value = this.props.isToday(parseInt(detailItems[i]['Date']));
        //     if (value == "Today") {
        //         detailItemsToday.push(detailItems[i])
        //     } else if (value == "Yestday") {
        //         detailItemsYestday.push(detailItems[i])
        //     } else if (value == "Before") {
        //         detailItemsBefore.push(detailItems[i])
        //     }
        // }
        const acctStatus = this.props.acctStatus;
        var accountItems = [];
        // for(var item in acctStatus.headers){
        //     accountItems[item]=acctStatus.headers[item]
        // }
        var accountNumber;
        // if (accountItems.response) {
        //     if (accountItems["account_"+ account + "_name"]) {
        //         accountNumber = accountItems["account_"+ account + "_name"]
        //     } else {
        //         accountNumber = accountItems["account_"+ account + "_no"]
        //     }
        // }
        return (
            <div className = {"containermask " + this.props.displayDiv}>
                <div id = "containerdiv ">
                    <div id = "contacteditdiv" className='addContact-select'>
                        <div id = "itemdetaildiv">
                            <div className = "titlediv">
                                <span>{callTr("a_select")}</span>
                                <div style = {{'float':'right'}} >
                                    <button type = "Button" onClick={this.handleClose}/>
                                </div>
                            </div>
                            <div className = "appsbtn">
                                <Button type="primary" style={{marginRight:'15px',display:buttonDisplay,width:'170px'}} onClick={this.handleaddLocalContacts.bind(this, number, account)} >{callTr("a_addLocalcontact")}</Button>
                                <Button type="primary" style={{display:buttonDisplay,width:'160px'}} onClick={this.handleEditContacts.bind(this, number, account)} >{callTr("a_addcontact")}</Button>
                            </div>
                        </div>
                        <NewContactsEditForm {...this.props} emailValues={this.state.emailValues} numValues={this.state.numValues} updateContact={this.updateContact} groups={this.state.groups} editContact={this.state.editContact} handleSaveContactGroupId = {this.state.handleSaveContactGroupId} displayModal={this.state.displayModal} detailItems={this.state.detailItems} addNewContact={this.state.addNewContact} handleHideModal={this.handleHideModal} checkRepeatName={this.checkRepeatName} product={this.props.product} callTr={this.props.callTr} getReqItem ={this.props.getReqItem} getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>
                        <AddLocalcontactsForm {...this.props} callTr={this.props.callTr} handleHideLocalContactsModal= {this.handleHideLocalContactsModal} displayLocalContactsModal={this.state.displayLocalContactsModal} addnumber={this.state.addnumber} addaccount={this.state.addaccount} />
                    </div>
                </div>
            </div>
        );
    }
}


class Call extends Component {
    historyList = [];
    selectedContactList = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            displayDiv: 'display-hidden',
            detailDiv: {},
            curContactList: [],
            existActiveAccount: false,
            displayDelHistCallsModal: false,
            displayAddWhitelistModal: false,
            displayAddBlacklistModal: false,
            expandedRows:[],
            checkedAll: false,
            displayNewConfModal: false,
            confMemberData: [],
            editConfData: [],
            addNewConf:false,
            confdetail:false
        }
    }

    componentDidMount = () => {
        this.props.get_calllog(0);
        this.props.getAllConfMember();
        this.props.getPreConf();
        this.props.getConfInfo()
        this.props.getAcctStatus((result)=>{
            if(!this.isEmptyObject(result)) {
                let acctstatus = result.headers;
                let max = 16;
                if(this.isWP8xx()) max = 2;

                for(let i = 0; i < max; i++){
                    if(acctstatus[`account_${i}_status`] == "1"){
                        this.setState({existActiveAccount: true});
                        break;
                    }
                }
            }
        });
    }

    updateDate = () => {
        this.props.getAllConfMember();
        this.props.getPreConf();
        this.props.getConfInfo()
    }

    componentWillReceiveProps = () => {
        // this._createData();
        // this.updateDate()
    }

    handleAddContact = (text) => {
        // text = this.changerow0(text);
        // console.log('text',text)
        this.setState({
            displayDiv : "display-block",
            detailDiv: text
        });
    }

    handleHide = () => {
        this.setState({
            displayDiv:"display-hidden",
            detailDiv: {}
        });
    }

    handleNewConf = (text) => {
        this.setState({
            displayNewConfModal: true,
            addNewConf:true,
            confMemberData:text
        })
    }

    handleHideNewConfModal = () => {
        this.setState({displayNewConfModal: false,confdetail:false})
    }

    handleOkDelete = (event,deleteId,option) => {
        // event.cancelBubble = true;
        console.log(event)
        event.stopPropagation( );
        // console.log('text',deleteId,option)
        if(option==1) {
            this.props.get_deleteOnceConf(deleteId, (result) => {
                if (result == 'success') {
                    this.updateDate()
                    this.props.promptMsg('SUCCESS',"a_del_ok");
                } else {
                    this.props.promptMsg('SUCCESS',"a_cancelerr");
                }
            });
        } else {
            this.props.get_deleteConf(deleteId, (result) => {
                if (result == 'success') {
                    this.updateDate()
                    this.props.promptMsg('SUCCESS',"a_del_ok");
                }
            });
        }
    }

    cancelPop = (event) => {
        event.cancelBubble = true;
        event.stopPropagation( );
    }

    handleEdit = (event,text,isDetail) => {
        let confdetail = isDetail == true
        if(isDetail != true) {
            event.cancelBubble = true;             // true 为阻止冒泡
            event.stopPropagation( );                // 阻止事件的进一步传播，包括（冒泡，捕获），无参数
        }
        this.props.form.resetFields();

        let confinfo = text.confinfo
        let Starttime = confinfo.Starttime
        let arr = Starttime.split(' ')
        let year = moment(arr[0],'YYYY-MM-DD')
        let hours = arr[1].split(':')[0]
        let minutes = arr[1].split(':')[1]
        let Duration = (confinfo.Duration / 60).toString()
        let Preset = confinfo.Preset.toString()
        let Recyle = confinfo.Recycle.toString()
        let repetRule = confinfo.RepeatRule

        let obj = {
            Id : confinfo.Id,
            confSubject : confinfo.Displayname,
            confStatedate : year,
            confhours : hours,
            confminutes : minutes,
            duration : Duration,
            confpreset : Preset,
            cycle : Recyle
        }
        console.log(this.tojson(repetRule))
        if(confinfo.Schedulepsw) {
            obj.pincode = confinfo.Schedulepsw
        }
        if(Recyle == '7') {
            // interval = confinfo
            let ruleobj = this.tojson(repetRule)
            let freq = ruleobj.FREQ
            let weekstrArr = ['SU','MO','TU','WE','TH','FR','SA']
            if (ruleobj.INTERVAL) {
                obj.interval = ruleobj.INTERVAL
            }
            if(ruleobj.UNTIL) {
                let value = ruleobj.UNTIL
                value = value.replace(/T/g, "");
                value = value.replace(/Z/g, "");
                let endDate = value.substring(0,4)+"/"+value.substring(4,6)+"/"+value.substring(6,8)+" "+value.substring(8,10)+":"+value.substring(10,12);
                var enddateobj = new Date(endDate);
                var time = enddateobj.getTime();
                var offset = enddateobj.getTimezoneOffset();
                enddateobj.setTime(time-offset*60000);
                var endmonth = (enddateobj.getMonth()+1);
                var endday = enddateobj.getDate();
                endDate = enddateobj.getFullYear() + "-";
                if( endmonth < 10 )
                    endDate += "0";
                endDate += endmonth;
                endDate += "-";
                if( endday < 10 )
                    endDate += "0";
                endDate += endday;
                obj.customEndDate = moment(endDate, 'YYYY-MM-DD')
            }
            if (repetRule.indexOf('DAILY') != -1) {
                obj.customRepeat = '0'
            } else if (repetRule.indexOf('WEEKLY') != -1 ) {
                obj.customRepeat = '1'
                if(ruleobj.BYDAY) {
                    let arr = ruleobj.BYDAY.split(',')
                    for (let i = 0; i < weekstrArr.length; i++) {
                        for (let j = 0; j < arr.length; j++) {
                            if(weekstrArr[i] == arr[j]) {
                                obj['dayofweek' + i] = 1
                            }
                        }
                    }
                }
            } else if (freq == 'MONTHLY' && repetRule.indexOf('BYMONTHDAY') != -1 ) {
                obj.customRepeat = '2'
                obj.monthByDay = ruleobj.BYMONTHDAY
            } else if (freq == 'MONTHLY' && repetRule.indexOf('BYDAY') != -1 ) {
                obj.customRepeat = '3'
                obj.monthWeekOrdinal = ruleobj.BYDAY.substring(0,1)
                for (let i = 0; i < weekstrArr.length; i++) {
                    if(weekstrArr[i] == ruleobj.BYDAY.substring(1,2)) {
                        obj.monthWeekDay = i.toString()
                    }
                }
            } else if (repetRule.indexOf('YEARLY') != -1 ) {
                obj.customRepeat = '4'
            }
        }
        console.log(obj)

        this.props.form.setFieldsValue(obj);

        this.setState({
            displayNewConfModal: true,
            addNewConf:false,
            confMemberData:text.memberArr,
            confdetail: confdetail
        })
    }

    tojson = (str) => {
        return eval("("+this.toArray(str)+")");
    }

    toArray = (str) => {
        var list = str.split(";");
        var myStr = "{";
        for(var i=0;i<list.length;i++)
        {
            try{
                var keys = list[i].split("=");
                var key = keys[0].replace(/(^\s*)|(\s*$)/g, "");
                var value= keys[1].replace(/(^\s*)|(\s*$)/g, "");
                if(i>0)
                {
                    myStr += ",";
                }
                myStr += "\""+key+"\":\""+value+"\"";
            }catch(e)
            {
                continue;
            }
        }
        myStr += "}";
        return myStr;
    }

    render() {
        const [confinfodata, callTr, _createTime, isToday, convertTime, logItemdata, view_status_Duration,curContactList] =
            [this.props.confinfodata, this.props.callTr, this.props._createTime, this.props.isToday, this.props.convertTime, this.props.logItemdata, this.props.view_status_Duration, this.state.curContactList];
        // console.log(contactsInformation,logItemdata,this.props.confmemberinfodata)

        let preconfdata = this.props.preconfdata;
        let status = [
            {type:0,statusname:callTr('a_waithost')},
            {type:1,statusname:callTr('a_9348')},
            {type:2,statusname:callTr('a_notstart')},
            {type:3,statusname:callTr('a_10174')},
            {type:4,statusname:callTr('a_over')}
        ]
        let data = []
        for (let i = 0; confinfodata[i]!=undefined; i++) {
            let memberArr = []
            for (let j = 0; j < preconfdata.length; j++) {
                if(preconfdata[j].Id == confinfodata[i].Id) {
                    memberArr.push(preconfdata[j])
                }
            }
            let obj ={
                confinfo:confinfodata[i],
                memberArr:memberArr,
                status:status[2]
            }


            data.push(obj)
        }
        // console.log(data)
        return (
            <div>
                <div className = 'preconflist'>
                    {
                        (data != "" || data.length > 0) && data.map((item) => {
                            return (
                                <div className={'confbox'} onClick={(e)=>this.handleEdit(e,item,true)}>
                                    <Row>
                                        <Col className='conf-label' span={3}>{callTr('a_10056')}：</Col>
                                        <Col span={12}>{item.confinfo.Starttime}</Col>
                                        <Col className='conf-status' span={9}>{item.status.statusname}</Col>
                                    </Row>
                                    <Row>
                                        <Col className='conf-label' span={3}>{callTr('theme')}：</Col>
                                        <Col className='ellips' span={12}>{item.confinfo.Displayname}</Col>
                                        <Col className='conf-status' span={9}></Col>
                                    </Row>
                                    <Row>
                                        <Col className='conf-label' span={3}>{callTr('a_confDuration')}：</Col>
                                        <Col className='' span={12}>{item.confinfo.Duration / 60}{callTr('a_15008')}</Col>
                                        <Col className='conf-status' span={9}></Col>
                                    </Row>
                                    <Row>
                                        <Col className='conf-label' span={3}>{callTr('a_10055')}：</Col>
                                        <Col className='' span={12}>{item.confinfo.Host == 1? callTr('a_10057'): htmlEncode(item.confinfo.Host)}</Col>
                                        <Col className='conf-status' span={9}></Col>
                                    </Row>
                                    <Row>
                                        <Col className='conf-label' span={3}>{callTr('a_nummember')}：</Col>
                                        <Col className='' span={3}>{item.memberArr.length}</Col>
                                        <Col className='conf-status' span={18}>
                                            <Button type="primary">{this.tr("a_startMeet")}</Button>
                                            <Button
                                                // onClick={this.handleEdit.bind(this, item)}
                                                onClick={(e)=>this.handleEdit(e,item)} type="primary">{this.tr("a_editMeet")}</Button>
                                            {/*<Button type="primary">{this.tr("a_cancelMeet")}</Button>*/}

                                            {item.confinfo['Recycle'] != '7' ? (
                                                <Popconfirm placement="top" title={this.tr("a_promptdelete")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={(e)=>this.handleOkDelete(e,item.confinfo.Id)}>
                                                    {/*<button className='allow-delete'></button>*/}
                                                    <Button onClick={(e)=>this.cancelPop(e)} type="primary">{this.tr("a_cancelMeet")}</Button>
                                                </Popconfirm>
                                            ) : (
                                                <Popover content={
                                                    <div>
                                                        <p onClick={(e)=>this.handleOkDelete(e,item.confinfo.Id)} >{callTr('a_delrepconf')}</p>
                                                        <p onClick={(e)=>this.handleOkDelete(e,item.confinfo.Id,1)} >{callTr('a_delreponceconf')}</p>
                                                    </div>
                                                } trigger="click">
                                                    <Button onClick={(e)=>this.cancelPop(e)} type="primary">{this.tr("a_cancelMeet")}</Button>
                                                </Popover>
                                            )}


                                            {/*<Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{this.tr("a_17")}</Button>*/}

                                        </Col>
                                    </Row>
                                    {/*<div style = {{'height':'33px'}}>*/}
                                    {/*<span className = "contactsIcon"></span>*/}
                                    {/*<span className = "ellips contactstext contactname">{member.recordName ? member.recordName:member.Name}</span>*/}
                                    {/*</div>*/}
                                    {/*<div>{member.Number} </div>*/}
                                    {/*<span>{member.recordName ? member.recordName:member.Name}</span><span></span>*/}
                                </div>
                            )
                        })
                    }
                </div>
                <div className = 'CallDiv Callhistory'>
                    <div className = "nodatooltips" style={{display: data.length > 0 ? 'none':'block'}}>
                        <div></div>
                        <p>{this.tr("no_data")}</p>
                    </div>
                </div>
                <NewConEditForm {...this.props} callTr={this.props.callTr}
                                handleHideNewConfModal= {this.handleHideNewConfModal}
                                updateDate = {this.updateDate}
                                displayNewConfModal={this.state.displayNewConfModal}
                                confMemberData={this.state.confMemberData}
                                addNewConf={this.state.addNewConf}
                                editConfData = {this.state.editConfData}
                                confSubject = {this.state.confSubject}
                                confdetail = {this.state.confdetail}
                />
            </div>
        )
    }
}



const mapStateToProps = (state) => ({
    logItemdata: state.logItemdata,
    acctStatus: state.acctStatus,
    contactsInformation: state.contactsInformation,
    callDialog: state.callDialog,
    msgsContacts: state.msgsContacts,
    contactinfodata: state.contactinfodata,
    confmemberinfodata: state.confmemberinfodata,
    preconfdata:state.preconfdata,
    confinfodata:state.confinfodata

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_calllog: Actions.get_calllog,
        get_clear: Actions.get_clear,
        getAcctStatus:Actions.getAcctStatus,
        get_deleteCall: Actions.get_deleteCall,
        getContactCount:Actions.getContactCount,
        getContacts:Actions.getContacts,
        getGroups:Actions.getGroups,
        getTonelist:Actions.getTonelist,
        setContacts:Actions.setContacts,
        addNewBlackMember: Actions.addNewBlackMember,
        sendSingleCall: Actions.sendSingleCall,
        addNewWhiteMember: Actions.addNewWhiteMember,
        getContactsinfo:Actions.getContactsinfo,
        getAllConfMember:Actions.getAllConfMember,
        get_deleteCallConf:Actions.get_deleteCallConf,
        getPreConf:Actions.getPreConf,
        getConfInfo:Actions.getConfInfo,
        get_deleteConf:Actions.get_deleteConf,
        get_deleteOnceConf:Actions.get_deleteOnceConf
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Call));
