import React, { Component } from 'react'
import Enhance from "../../mixins/Enhance";
import NewContactsEdit from "./callsPubModule/newContactsEdit";
import AddLocalcontacts from "./callsPubModule/addLocalcontacts";
import NewConfEdit from "./callsPubModule/newConfEdit"
import CallMoeLine from "./callsPubModule/callMoreLine"
import {Layout, Tabs, Popconfirm, Modal, Input, message, Form,Spin,Button, Checkbox, Table , Popover} from "antd";
import * as Actions from '../../redux/actions/index';
import { bindActionCreators } from 'redux';
import {  connect } from 'react-redux';
import { debounce } from 'lodash';
import * as optionsFilter from "../../template/optionsFilter";
var datefmt = ''
var timezone = ''

const Content = Layout;
const NewContactsEditForm = Form.create()(NewContactsEdit);
const AddLocalcontactsForm = Form.create()(AddLocalcontacts);
const NewConfEditForm = Form.create()(NewConfEdit)
const rowKey = function(record) {
    return record.key;
};
let req_items;
let rowkeys =[]

class History extends Component {
    historyList = [];
    selectedContactList = [];
    curData = [];
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            displayDiv: 'display-hidden',
            add_num_info: {},
            curContactList: [],
            existActiveAccount: false,
            displayDelHistCallsModal: false,
            displayClearHistotyModal: false,
            expandedRows:[],
            checkedAll: false,
            displayNewConfModal: false,
            confMemberData:[],
            addNewConf:false,
            selacct:-1,
            curAcct:null,
            curPage: 1,
            selectedRows: [],
            logListData:[],
            displayCallModal:false,
            curCallData:[],
            pagesize: 10,

            editContact:{},
            showNewContactModal:false,
            addNewContact:false,
            items:[],
            groups:[],
            handleSaveContactGroupId:new Function(),
            emailValues:[],
            numValues:[],
            displayLocalContactsModal:false,
            addnumber:'',
            addaccount:'',
            confMember:[],
            defaultacct:''
        }
        req_items = new Array;
        req_items.push(
            this.getReqItem("defaultAcct", "22046", ""),
            this.getReqItem("disdialplan", "2382", ""),
            this.getReqItem("datefmt", "102", "")
        );
        this.callmode="0"; // "0": normal call;  "1": IP call
        this.handleLogData = debounce(this.handleLogData, 500)
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {
            let defaultacct = values["defaultAcct"] == "8" ? 3 : values["defaultAcct"] || "-1"
            datefmt = values.datefmt
            this.setState({
                defaultacct: defaultacct,
                selacct: defaultacct
            });
        });
        if(!this.props.timezone) {
            this.props.getTimezone(this.props.curLocale,(value)=>{
                timezone = value.timezone.id
            });
        } else {
            timezone = this.props.timezone
        }
        let data = this.props.callLogsNew
        if(!data.length) {
            this.props.getCallLogsNew()
        } else {
            this.handleLogData(data)
        }
        if(!$.isArray(this.props.contactsNew)) {
            setTimeout(() => {
                this.props.getContacts_new()
            }, 2000);
            // return;
        }
        /**newcontact */
        if(!this.props.groupInformation.length) {
            this.props.getGroups((groups)=>{this.setState({groups:groups})});
        } else {
            this.setState({groups:this.props.groupInformation})
        }
        // if(!this.props.callnameinfo.length) {
        //     this.props.getNormalCalllogNames()
        // }
    }

    componentWillReceiveProps = (nextProps) => {
        // if(nextProps.callLogsNew.length !== this.props.callLogsNew.length) {
            this.handleLogData(nextProps.callLogsNew)
        // }
    }

    _createDetailTime = (text,showYstdDetail) => {
        datefmt = datefmt || '3'
        var Timevalue = this.convertTime(text,datefmt,timezone,showYstdDetail);
        return Timevalue
    }

    sortMember = (member,member2) => {
        return parseInt(member.acct) - parseInt(member2.acct)
    }

    handleLogData = (data) => {
        let log = []
        data.forEach((item,i) => {
            // let obj = {}
            let listData = []

            if(item.isconf === '1') {
                listData = item.members
                let sipmember = []
                let ipvtmember = []
                let H323member = []
                let othermember = []
                item.members.forEach(member => {
                    // if(member.acct == '0'){
                    //     sipmember.push(member)
                    // }
                    if(member.acct == '1' ) {
                        if(ipvtmember.length) {
                            member.ipvtconftitle = 'Conf:'
                        }
                        ipvtmember.push(member)
                    } else {
                        othermember.push(member)
                    }

                    // if(member.acct == '8' ){
                    //     H323member.push(member)
                    // } else {
                    //     othermember.push(member)
                    // }
                    // else {
                    //     sipmember.push(member)
                    // }

                })
                // let newmember = sipmember.concat(ipvtmember,H323member,othermember)
                // item.members = newmember
                ipvtmember.sort(()=> {return -1})
                othermember.sort(()=> {return -1})
                item.members = othermember.concat(ipvtmember)
                item.isipvtconf = '0'
                if(item.members.length === ipvtmember.length) {
                    item.isipvtconf = '1'
                }
                // if(hasIPVT && hasSip) {
                //     item.conftype = 'mixconf'
                // } else if(hasIPVT && !hasSip) {
                //     item.conftype = 'ipvtconf'
                // }
                // else {
                //     item.conftype = 'sip'
                // }
            }
            item.key = 'k' + i
            let obj = {
                key: 'c' + i,
                row0: item,
                row1: item.date,
                row2: item,
                row3: item
                // name: item.name.displayname,
                // number: phone.number,
                // acct: phone.acct,
                // isvideo: 1,
                // source: 1, // 联系人呼出source 为1
            }
            if(item.isconf === '0') {
                obj.row1 = item.list[0].date
            } else {

            }
            if(item.conftype) {

            }
            log.push(obj)
        });
        this.setState({logListData:log})
        this.curData = log
    }

    onSelectChange = (selectedRowKeys,selectedRows) => {
        // this.setState({selectedRowKeys});
        // console.log('onSelectChange',selectedRowKeys,selectedRows)

        let page = this.state.curPage
        // this.setState({});
        let checkedAll = false
        if(selectedRows.length) {
            checkedAll = true
        }
        this.setState({selectedRowKeys,selectedRows,checkedAll})
        if(page!=1) {
            let arr = []
            let data = this.curData
            for (let i = 0; i < selectedRowKeys.length; i++) {
                arr.push(data[selectedRowKeys[i]])
            }
            this.setState({selectedRows:arr});
        }
        rowkeys = selectedRowKeys
    }

    onSelectItem = (record, selected, selectedRows) => {
        let selectedRowKeys = rowkeys
        let page = this.state.curPage
        let arr = []
        if(page!=1) {
            selectedRows = []
            let data = this.curData
            if(data) {
                for (let i = 0; i < selectedRowKeys.length; i++) {
                    arr.push(data[selectedRowKeys[i]])
                }
            } else {
                arr = selectedRows
            }
            this.setState({selectedRows:arr});
        }
        // console.log('onSelectItem',arr)

    }

    onSelectAllContacts = (e) => {
        let selected = e.target.checked
        let data = this.curData
        let selectedRowKeys = []
        let selectedRows = []
        let page = this.state.curPage
        let pagesize = this.state.pagesize
        let begin = pagesize * (page-1)
        while(begin >= data.length) {
            begin = begin - pagesize
        }
        // let length = data.length < pagesize ? data.length : pagesize
        for (let i = 0; i < pagesize; i++) {
            if(selected) {
                let n = begin + i
                if(data[n]) {
                    selectedRowKeys.push(data[n].key)
                    selectedRows.push(data[n])
                }
            }
        }
        this.setState({
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows,
            checkedAll:selected
        });
    }

    handleOkDeleteAll = () => {
        let data = this.state.selectedRows
        let datasource = []
        for(let i =0;i<data.length;i++) {
            datasource.push(data[i].row0)
        }
        let seletedConfArr = [];
        let seletedCallArr = [];
        for (let i = 0; i <datasource.length ; i++) {
            if(datasource[i].isconf == '0') {
                let callhistory = datasource[i].list
                callhistory.forEach(item => {
                    if(item.calltype == 3) { //
                        seletedCallArr = seletedCallArr.concat(item.id)
                    } else {
                        seletedConfArr = seletedConfArr.concat(item.id)
                    }
                })
            } else {
                seletedConfArr = seletedConfArr.concat(datasource[i].confid)
            }
            // if(datasource[i].isconf == '1') {
            //     seletedConfArr = seletedConfArr.concat(datasource[i].confid)
            // } else {
            //     let callhistory = datasource[i].list
            //     callhistory.forEach(item => {
            //         seletedCallArr = seletedCallArr.concat(item.id)
            //     })
            // }
        }
        let self = this
        var delconf = new Promise(function(resolve, reject) {
            if (seletedConfArr.length) {
                let deleteId = seletedConfArr.join(',');
                self.props.get_deleteCallConf(deleteId,(result) => {
                    if (result == 'success') {
                        resolve('success')
                    } else {
                        reject()
                    }
                })
            }
        })
        var delcall = new Promise(function(resolve, reject) {
            if(seletedCallArr.length) {
                let deleteId = seletedCallArr.join(',');
                let flag = 2;
                self.props.get_deleteCall(deleteId,flag, (result) => {
                    if (result == 'success') {
                        resolve('success')
                    } else {
                        reject()
                    }
                });
            }
        })
        var promiseAll
        if(seletedConfArr.length > 0 && seletedCallArr.length > 0) {
            promiseAll = Promise.all([delconf,delcall])
        } else if (seletedConfArr.length > 0) {
            promiseAll = Promise.all([delconf])
        } else {
            promiseAll = Promise.all([delcall])
        }

        promiseAll.then(function (res) {
            self.props.getCallLogsNew()
            setTimeout(function () {
                self.props.promptMsg('SUCCESS', "a_57");
            }, 500);
            self.selectedContactList = [];
        })
        this.selectedContactList = []
        this.setState({
            selectedRowKeys: [],
            displayDelHistCallsModal: false,
            checkedAll:false
        });
    }

    _createRow0 = (text, record , index) => {
        // return "123"
        let content = []
        let type = '0'
        if(text.isconf === '1') {
            // return text.confname
            let source = text.members
            // type = source[0].calltype
            // if(source[0].isvideo) {
            //     type = Number(type) + 3
            // }
            type ='conf'
            if(text.isipvtconf == '1') {
                let num = source[0].number
                let namestr = 'Conf：' + num
                content.push(
                    <span className = "ellips" title={namestr}>{namestr}</span>
                )
            } else {
                source.forEach((item,i) => {
                    let name = ''
                    let classStr = source.length > 1 ? 'ellips ellipsName' : 'ellips';

                    if (i>0) {
                        name += "，"
                    }
                    name += item.name;
                    content.push(
                        <span className ={classStr} key={'st'+i} title={item.name}>{name}</span>
                    )
                })
            }


        } else {
            // return text.name
            let source = text.list
            type = source[0].calltype
            if(source[0].isvideo == '1') {
                type = Number(type) + 3
            }
            content.push(<span className = "ellips" key={"n"+text.key} title={text.name }>{text.name }</span>)
        }
        return <span className={"nameStr"}><i className={"type" + type}></i>{content}</span>;
    }


    handleAddContact = (text, index, event) => {
        if(!event.Id) {
            event.cancelBubble = true;
            event.stopPropagation( );
        } else {
            text = event
        }
        this.setState({displayDiv : "display-block",add_num_info: text});
    }

    showDelHistCallsModal = () => {
        this.setState({displayDelHistCallsModal: true});
    }

    handleDelHistCallsCancel = () =>{
        this.setState({displayDelHistCallsModal: false});
    }

    showClearHistotyModal = () => {
        this.setState({displayClearHistotyModal: true});
    }

    handleClearHistotyModal = () =>{
        this.setState({displayClearHistotyModal: false});
    }

    handleOkClearAll = () => {
        this.props.clearCallHistory()
        this.handleClearHistotyModal()
    }

    handleCall = (text, index, event) => {
        if(!event.Id) {
            event.cancelBubble = true;
            event.stopPropagation( );
        } else {
            text = event
        }
        if(text.acct === '1') {
            let names = text.name.split(',')
            let numbers = text.number.split(",")
            if(names.length>1) {
                let curCallData = []
                names.forEach((item, i) => {
                    curCallData[i] = {
                        acct: text.acct,
                        names: names[i],
                        numbers: numbers[i],
                        isvideo: text.isvideo,
                        source: text.calltype || 3
                    }
                })
                this.setState({displayCallModal:true,curCallData:curCallData})
                return
            }
        }
        let memToCall =[]
        memToCall.push({
            num: text.number,
            acct: text.acct,
            isvideo: text.isvideo || 0,
            source: text.calltype || 3,
            isconf: '1',
        })
        this.props.makeCall(memToCall)
    }

    // handleHide = () => {
    //     this.setState({displayDiv:"display-hidden",add_num_info: {}});
    // }

    handleHideCallMoreModal = () => {
        this.setState({displayCallModal:false,curCallData:{}})
    }

    showCallModal = (text, index, event) => {
        let curCallData = []
        if(!event.Id) {
            event.cancelBubble = true;
            event.stopPropagation( );
        } else {
            text = event
        }
        // console.log(text)
        text.forEach((item, i) => {
            if(item.acct === '1') {
                let names = item.name.split(",")
                let numbers = item.number.split(",")
                if(names.length) {
                    names.forEach((o, j) => {
                        let obj = {
                            acct: item.acct,
                            names: names[j],
                            numbers: numbers[j],
                            isvideo: item.isvideo,
                            source: item.calltype
                        }
                        curCallData.push(obj)
                    })
                }
            } else {
                curCallData[i] = {
                    acct: item.acct,
                    names: item.name,
                    numbers: item.number,
                    isvideo: item.isvideo,
                    source: item.calltype
                }
            }
        })


        this.setState({displayCallModal:true,curCallData:curCallData})
    }

    _createActions = (text, record, index) => {
        let statue;
        // let logItem = text.logItem
        // let content = []
        // let memberArr = record.row0.memberArr
        let reConfTitle = this.tr('a_10058')
        let callTitle = this.tr('a_504')
        // if()
        if(text.isconf === '1') {
            let source = text.members
            // source.forEach(item)
            statue = <div  className = {"callRecord" + " type"}>
                <button title={reConfTitle} className='reschedule' id = {'reschedule'+index}  onClick={this.handleNewConf.bind(this, source, index)}></button>
                <button title={callTitle} className={'allow-call ' + index} onClick={this.showCallModal.bind(this, source, index)}></button>
            </div>;
        } else {
            let source = text.list
            let contact = source[0]
            let number = contact.number
            let account = contact.acct
            let contactsNew = this.props.contactsNew
            let addContent =
            <div className="popover_Contact">
                {contactsNew.length>0 && <li onClick={this.handleaddLocalContacts.bind(this, number, account)}>{this.tr("a_19629")}</li>}
                <li onClick={this.handleEditContacts.bind(this, number, account)}>{this.tr("a_15003")}</li>
            </div>
            statue =
                <div className = {"callRecord" + " type"} key={'a'+text.key}>
                    {/* <Popover content={content} placement="top" trigger="hover">
                        <button className={memberArr[0].recordName ? 'display-hidden allow-addContact' : 'display-inline allow-addContact'} id = {'allow-addContact'+index} onClick={(e)=>this.handleAddContact(e,memberArr[0], index)}></button>
                    </Popover> */}
                    {/* <button className={contact.iscontact == '1' ? 'display-hidden allow-addContact' : 'display-inline allow-addContact'} id = {'allow-addContact'+index} onClick={this.handleAddContact.bind(this,contact, index)}></button> */}
                    <Popover content={addContent} placement="top" trigger="hover">
                        <button className={contact.iscontact == '1' ? 'display-hidden allow-addContact' : 'display-inline allow-addContact'} id = {'allow-addContact'+index}></button>
                    </Popover>
                    <button title={reConfTitle} className='reschedule' id = {'reschedule'+index} onClick={this.handleNewConf.bind(this,contact, index)}></button>
                    <button title={callTitle} className='allow-call' id = {'allow-call'+index} onClick={this.handleCall.bind(this,contact, index)} ></button>
                </div>;
        }
        return statue
    }

    _createData = () => {
        let dataResult = [];
        let logItemdata = this.props.logItemdata
        let confmember = this.props.confmemberinfodata
        let contactList = this.props.contactsInformation
        let callnameinfo = this.props.callnameinfo
        if(!logItemdata.length) {
            return dataResult
        }
        if(JSON.stringify(logItemdata)== '{}' || JSON.stringify(confmember)== '{}' || JSON.stringify(contactList)== '{}') {
            return dataResult
        }
        for ( let i = 0; i < logItemdata.length; i++ ) {
            let data = {};
            let memberArr = []
            let haslogItem = false
            if(logItemdata[i].IsConf == '1') {
                for (let j = 0; j < confmember.length; j++) {
                    if(confmember[j].Id == logItemdata[i].Id) {
                        confmember[j].recordName = ''
                        for (let k = 0; k < contactList.length; k++) {
                            if(confmember[j].Number == contactList[k].Number) {
                                confmember[j].recordName = contactList[k].Name
                            }
                        }
                        memberArr.push(confmember[j])
                        haslogItem = true
                    }
                }
            }
            if (!haslogItem) {
                let obj = Object.assign({}, logItemdata[i])
                obj.Number = logItemdata[i].NameOrNumber
                obj.Name = logItemdata[i].NameOrNumber
                obj.recordName = ''
                if(obj.Name != obj.Number) {
                    obj.recordName = obj.Name
                }
                memberArr.push(obj)
            }
            if(memberArr.length) {
                data = {
                    logItem :  logItemdata[i],
                    memberArr: memberArr
                }
                dataResult.push({
                    key: i,
                    row0: data,
                    row1: parseInt(logItemdata[i].Date),
                    row2: data
                })
            }
        }
        this.curData = dataResult
        return dataResult
    }

    handelOnRowClick(record) {
        //添加双击执行发那个法 获取自己维护的 数组，判断数组中是否包含 这行key，相应添加或者删除
        let num = parseInt(record.key)
        $('.ant-table-row').removeClass('line-hoverbg')
        $('.ant-table-row:eq('+ num +')').addClass('line-hoverbg')
        let expandedRows = this.state.expandedRows
        if(expandedRows.length > 0 && expandedRows[0] == record.key ) {
            this.setState({
                expandedRows: []
            });
        } else {
            this.setState({
                expandedRows: [record.key]
            });
        }
    }

    _createInlineName(logItem) {
        let type = logItem.calltype
        // let isVideo = ''
        if(logItem.isvideo == '1') {
            type = Number(type) + 3
        }
        var className = 'inlineIcon type' + type
        let dom =
                <div className="inlineCallInfo">
                    <i className={className}></i>
                    <div className="inlineNameNum">
                        <li className="ellips ellipsName ellipsDetailName">{logItem.name}</li>
                        <li className="ellips ellipsName ellipsDetailName">{logItem.number}</li>
                    </div>
                </div>
        return dom
    }

    _createInlineAction(text,isconf) {
        let status;
        let hiddenAddContact = true
        if(isconf === '1' && text.iscontact !== '1') {
            hiddenAddContact = false
        }
        // let hiddenAddContact = false
        // if(contact.iscontact) {
        //     hiddenAddContact = true
        // }
        // console.log(text)
        if(text.acct === '1') {
            if(text.name.split(',').length >1 ) {
                hiddenAddContact = true
            }
        }
        // let contact = source[0]
        let number = text.number
        let account = text.acct
        // let contactsNew = this.props.contactsNew
        // console.log(contactsNew)
        let addContent =
        <div className="popover_Contact">
            <li onClick={this.handleaddLocalContacts.bind(this, number, account)}>{this.tr("a_19629")}</li>
            <li onClick={this.handleEditContacts.bind(this, number, account)}>{this.tr("a_15003")}</li>
        </div>


        status =
            <div className = {"callRecord"}>
                <Popover content={addContent} placement="top" trigger="hover">
                    <button className={hiddenAddContact ? 'display-hidden allow-addContact' : 'display-inline allow-addContact'}  onClick={this.handleAddContact.bind(this, text,0)}></button>
                </Popover>
                {/* <button className='allow-detail'  onClick={this.handleNewConf.bind(this, text,0)}></button> */}
                <button className='allow-call' onClick={this.handleCall.bind(this, text,'')}></button>
            </div>;
        return status;

    }

    expandedRowRender(record){	//显示内容和样式的渲染
        // let data = record.row0.logItem
        let data = record.row3

        // let memberArr = data.row0.memberArr
        let datasource = []
        if(data.isconf === '1') {
            datasource = data.members
        } else {
            datasource = data.list
        }
        let status = [];
        let showYstdDetail = true
        for (let i = 0; datasource[i] != undefined ; i++) {
            status.push(
                <div className="call-line" key={'s'+i}>
                    <div className='call-line-info ellips call-line-name'>{this._createInlineName(datasource[i])}</div>
                    <div className='call-line-info ellips call-line-number'>{this._createNumType(datasource[i])}</div>
                    <div className='call-line-info ellips call-line-date'>{this._createDetailTime(datasource[i].date,showYstdDetail)}</div>
                    <div className='call-line-info call-line-duration'>{this.convertDuration(datasource[i])}</div>
                    <div className='call-line-info ellips call-line-act'>
                        {this._createInlineAction(datasource[i],data.isconf)}
                    </div>
                </div>
            )
        }
        return <div style={{maxHeight:500,overflowY:'auto'}}>{status}</div>;
    }

    _createNumType = (data) => {
        let obj = {
            '-1': 'Active account',
            '0': 'SIP',
            '1': 'IPVideoTalk',
            '8':'H.323'
        }
        let acct = data.acct || '-1'
        let accttype = obj[acct]
        // let a = parseInt('5')
        return accttype
    }

    convertDuration = (data) => {
        // type = 1  来电
        // type = 2  去电
        // type = 3  未接来电
        let duration = data.duration
        const callTr = this.tr
        if( duration == 0 ) {
            if(data.calltype == 3) {
                return <span className="missCallText" title={callTr('missed_call')}>{callTr('missed_call')}</span>
            } else if(data.calltype == 2) {
                return <span className="missCallText" title={callTr('call_fail')}>{callTr('call_fail')}</span>
            } else {
                return "0" + callTr('a_114');
            }
        }

        var day = parseInt(duration / (24 * 3600));
        duration %= (24 * 3600);
        var hour = parseInt(duration / 3600);
        if( day > 0 )
            hour += day * 24;
        duration %= 3600;
        var min = parseInt(duration / 60);
        var sec = parseInt(duration % 60);
        var timestr = "";
        if( hour > 0 ){
            timestr += hour + callTr('a_108') + "" + min + callTr('a_110') + "" + sec + callTr('a_113');
        }else if( min > 0 ){
            timestr += min + callTr('a_110') + "" + sec + callTr('a_113');
        }else{
            timestr += sec + callTr('a_114');
        }
        <span title={timestr}>{timestr}</span>
        return <span title={timestr}>{timestr}</span>;
    }

    handleNewConf = (text, index, event) => {
        if(!event.Id) {
            event.cancelBubble = true;
            event.stopPropagation( );
        } else {
            text = event
        }

        let data = text
        if(!text.length) {
            data = [text]
        }
        this.setState({
            displayNewConfModal: true,
            addNewConf:true,
            confMemberData:data
        })
    }

    handleHideNewConfModal = () => {
        this.setState({displayNewConfModal: false})
    }

    changePage = (pageNumber) => {
        this.setState({
            curPage: pageNumber,
            selectedRows: [],
            selectedRowKeys:[],
            checkedAll: false
        });
    }

    /****newContact  LocalContact******/
    updateContact = () => {
        // this.props.getContactsinfo();
        // this.props.getAllConfMember()
        setTimeout(() => {
            this.props.getGroups((groups)=>{this.setState({groups:groups})});
            this.props.getCallLogsNew()
            this.props.getContactsNew()
        }, 2500);
    }

    // handleClose = () => {
    //     this.props.handleHide();
    // }

    handleHideModal = () => {
        this.setState({showNewContactModal:false,addNewContact:false})
    }

    handleEditContacts = (number, account) => {
        // var containermask = document.getElementsByClassName("containermask")[0];
        // containermask.style.display="none";
        let numValues = this.state.numValues;
        numValues.length = 0;
        this.setState({showNewContactModal:true,addNewContact:true,emailValues:[""]});
        numValues.push(number + "--- ---" + account);
        this.setState({numValues:numValues})
        // this.props.handleHide()
    }

    handleaddLocalContacts = (number, account) => {
        // console.log(number, account)
        this.setState({
            displayLocalContactsModal: true,
            addnumber: number,
            addaccount: account
        })
        // this.props.handleHide()
    }

    handleHideLocalContactsModal = () => {
        this.setState({displayLocalContactsModal: false})
    }

    checkRepeatName = (name) => {
        let data = this.props.contactsNew
        let index = data.findIndex((v,i,a)=>{
            return v.name.displayname == name;
        });
        if(index == -1) {
            return false
        } else {
            return true
        }
    }

    onShowSizeChange = (current, size) => {
        this.setState({
            curPage:current,
            pagesize:size
        })
    }

    render() {
        const [callTr, _createDetailTime, getReqItem] =
            [this.tr,  this._createDetailTime, this.getReqItem];
        const columns = [{
            title: callTr("a_19626"),
            key: 'row0',
            dataIndex: 'row0',
            width: '55%',
            render: (text, record, index) => (
                this._createRow0(text, record, index)
            )
        }, {
            title: callTr("a_4304"),
            key: 'row1',
            dataIndex: 'row1',
            width: '30%',
            render: (text, record, index) => (
                _createDetailTime(text)
            )
        },{
            title: callTr("a_44"),
            key: 'row2',
            dataIndex: 'row2',
            width: '15%',
            render: (text, record, index) => (
                this._createActions(text, record, index)
            )
        }];
        let data = this.state.logListData
        let pageobj = false
        if(data.length>10) {
            pageobj = {
                pageSize: this.state.pagesize,
                onChange:this.changePage,
                total: data.length,
                showTotal: total => callTr('a_total') + ": " + total,
                showSizeChanger:true,
                pageSizeOptions:["10","20","30","40"],
                onShowSizeChange:this.onShowSizeChange
            }
        }

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelectItem,
            onSelectAll: this.onSelectAllContacts
        }
        const hasSelected = selectedRowKeys.length > 0;

        return (
            <div>
                <Content className="content-container config-container">
                    <div className="subpagetitle">{this.tr("a_3536")}</div>
                    <div style={{margin:"0px 10px",'minHeight':(this.props.mainHeight+10)}}>
                        <div className='btnbox'>
                            <div style={{'float':'left'}}>
                                <Checkbox className='call-checkall' checked={this.state.checkedAll} defaultChecked={false} onChange={this.onSelectAllContacts}></Checkbox>
                                <Button className="select-delete" type="primary" disabled={!hasSelected} style={{marginRight:'10px'}} onClick={this.showDelHistCallsModal}>
                                    <i className={!hasSelected ? "select-delete-icon" : ""} />
                                    {this.tr("a_19067")}
                                </Button>
                                <Modal visible={this.state.displayDelHistCallsModal} title={this.tr("a_3342")} className="confirm-modal"
                                    okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.handleOkDeleteAll} onCancel={this.handleDelHistCallsCancel}>
                                    <p className="confirm-content">{this.tr("a_3531")}</p>
                                </Modal>
                                <Button className="select-delete" type="primary" style={{marginRight:'10px'}} onClick={this.showClearHistotyModal}>
                                    <i/>{this.tr("a_404")}
                                </Button>
                                <Modal visible={this.state.displayClearHistotyModal} title={this.tr("a_3523")} className="confirm-modal"
                                    okText={this.tr("a_2")} cancelText={this.tr("a_3")} onOk={this.handleOkClearAll} onCancel={this.handleClearHistotyModal}>
                                    <p className="confirm-content">{this.tr("a_3504")}</p>
                                </Modal>
                            </div>
                        </div>
                        <div className = 'CallDiv Callhistory paging_center'>
                            <Table
                                rowSelection={rowSelection}
                                rowKey = {rowKey}
                                columns = { columns }
                                pagination = { false }
                                dataSource = { data }
                                showHeader = { false }
                                expandIconAsCell={false}
                                expandedRowRender= {this.expandedRowRender.bind(this)}
                                onRowClick={this.handelOnRowClick.bind(this)}	//添加单击方法
                                expandedRowKeys={this.state.expandedRows}		//添加 回设置 展开的数组
                                expandIconColumnIndex={-1}
                                pagination = { pageobj }
                            />
                            <div className = "nodatooltips" style={{display: !data.length ? 'block':'none'}}>
                                <div></div>
                                <p>{this.tr("a_10082")}</p>
                            </div>
                        </div>
                        {/* { this.state.displayDiv ? <ContactEditDiv {...this.props} contactsInformation={contactsInformation} view_status_Duration={view_status_Duration} isToday={isToday} convertTime = {convertTime} displayDiv={this.state.displayDiv}
                                                    add_num_info = {this.state.add_num_info} callTr={callTr} handleHide={this.handleHide} handleAddContact={this.handleAddContact} />
                            : null
                        } */}
                        { this.state.displayNewConfModal ? <NewConfEditForm {...this.props} callTr={callTr}
                                                    handleHideNewConfModal= {this.handleHideNewConfModal}
                                                    displayNewConfModal={this.state.displayNewConfModal}
                                                    confMemberData={this.state.confMemberData}
                                                    addNewConf={this.state.addNewConf}/>
                            : null
                        }

                        <NewContactsEditForm {...this.props} defaultacct={this.state.defaultacct} displayModal={this.state.showNewContactModal} emailValues={this.state.emailValues} numValues={this.state.numValues}
                            updateContact={this.updateContact} groups={this.state.groups} editContact={this.state.editContact} handleSaveContactGroupId = {this.state.handleSaveContactGroupId} detailItems={this.state.detailItems}
                            addNewContact={this.state.addNewContact} handleHideModal={this.handleHideModal} checkRepeatName={this.checkRepeatName} product={this.props.product} callTr={callTr} getReqItem ={getReqItem}
                            getItemValues={this.props.getItemValues} itemValues={this.props.itemValues} promptMsg={this.props.promptMsg} htmlEncode={this.htmlEncode}/>

                        <AddLocalcontactsForm {...this.props} defaultacct={this.state.defaultacct} displayLocalContactsModal={this.state.displayLocalContactsModal} callTr={callTr} updateContact={this.updateContact}
                        handleHideLocalContactsModal= {this.handleHideLocalContactsModal} addnumber={this.state.addnumber} addaccount={this.state.addaccount} getReqItem ={getReqItem} />

                        <CallMoeLine {...this.props} handleHideCallMoreModal={this.handleHideCallMoreModal}  displayCallModal={this.state.displayCallModal} callTr={callTr}
                        htmlEncode={this.htmlEncode} promptMsg={this.props.promptMsg} curCallData={this.state.curCallData}/>
                    </div>
                </Content>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    activeKey: state.TabactiveKey,
    userType: state.userType,
    logItemdata: state.logItemdata,
    confmemberinfodata: state.confmemberinfodata,
    contactsInformation: state.contactsInformation,
    callnameinfo:state.callnameinfo,
    callLogsNew:state.callLogsNew,

    callDialog: state.callDialog,
    msgsContacts: state.msgsContacts,
    contactinfodata: state.contactinfodata,
    groupInformation: state.groupInformation,
    contactsNew: state.contactsNew,
    timezone: state.timezone,


})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        promptMsg:Actions.promptMsg,
        getItemValues:Actions.getItemValues,
        getAcctStatus:Actions.getAcctStatus,
        get_deleteCall: Actions.get_deleteCall,
        getGroups:Actions.getGroups,
        setContacts:Actions.setContacts,
        getContactsinfo:Actions.getContactsinfo,
        getAllConfMember:Actions.getAllConfMember,
        get_deleteCallConf:Actions.get_deleteCallConf,
        getNormalCalllogNames:Actions.getNormalCalllogNames,
        cb_start_single_call:Actions.cb_start_single_call,
        getCallLogsNew:Actions.getCallLogsNew,
        clearCallHistory:Actions.get_clear,
        getContactsNew:Actions.getContactsNew,
        makeCall: Actions.makeCall,
        getTimezone:Actions.getTimezone,

    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(History));