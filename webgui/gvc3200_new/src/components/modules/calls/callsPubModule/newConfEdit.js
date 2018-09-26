import React, { Component } from 'react'
import Enhance from '../../../mixins/Enhance'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form,Checkbox, Modal, Tooltip, Icon, Row,Col, Input, Button, Select, Radio,DatePicker,Table,Cascader,Tabs } from "antd"
import moment from 'moment';
import {setTimeoutOpt} from "../../../redux/actions";
const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane;

const weekstrArr = ['SU','MO','TU','WE','TH','FR','SA']

class NewContactsEdit extends Component {
    // selectedContactRowKeys = [];
    // selectedCallRowKeys = [];
    constructor(props){
        super(props);
        this.state = {
            addNewContact:[0],
            selectedRowKeys: [],
            selectedContactRowKeys: [],
            selectedCallRowKeys:[],
            value:"",
            cycle_group_class:{
                str_interval: 'a_15028',
                customRepeat:'display-hidden',
                everyFixedDays: 'display-hidden',
                dayofweek: 'display-hidden',
                everyFixedMonth: 'display-hidden',
                monthByDay: 'display-hidden',
                monthByWeek: 'display-hidden',
                everyFixedYear: 'display-hidden',
                customClass:'display-hidden',
                interval:'display-hidden'
            },
            displayAddModal: false,
            allContacts:[],
            curContacts:[],
            allCallLog:[],
            curCallLog:[],
            tempMember:[],
            curMember:[],
            extraSearchMember:[],
            selExtraSearMem:[],
            contType:'-1',
            callType:'-1',
            activeKey:'0',
            showContact: true,
            showCallLog: true
        }
    }

    componentWillMount = () => {
        if(this.props.editConfData && this.props.editConfData.length > 0) {
            let editConfData = this.props.editConfData[0]
            let confinfo = editConfData.confinfo
            let Displayname = confinfo.Displayname
            let Duration = confinfo.Duration
            let Starttime = confinfo.Starttime
            let Recyle = confinfo.Recyle
            let RepetRule = confinfo.RepeatRule
            let Preset = confinfo.Preset
            this.props.form.setFieldsValue({
                confSubject: Displayname,
            });
        }
    }

    componentDidMount = () => {
        // this.props.getContactCount();
        // this.props.get_calllog(0);
        // this.props.getContacts((items)=>{this.setState({items:items})});
        if(!this.props.contactsInformation.length) {
            this.props.getContacts()
        }
        if(!this.props.callnameinfo.length) {
            this.props.getNormalCalllogNames()
        }
        if(!this.props.confmemberinfodata.length) {
            this.props.getAllConfMember()
        }
        if(!this.props.contactsAcct.length) {
            this.props.getAcctStatus()
        }
        if(!this.props.presetinfo.length) {
            this.props.getPresetInfo()
        }
    }

    handleOk = () => {
        if(this.props.confdetail) {
            this.handleCancel()
        }
        let addoredit = this.props.addNewConf ? 'add' : 'edit';
        let values = this.props.form.getFieldsValue();
        values.confStatedate = values.confStatedate.format('YYYY-MM-DD')
        let start_time = values.confStatedate + ' ' + values.confhours + ':' +values.confminutes
        if(moment(start_time).isBefore(moment())) {
            this.props.promptMsg('ERROR','a_16708');
            return
        }
        let memberData = this.state.curMember
        if(memberData.length == 0) {
            this.props.promptMsg('ERROR','a_16436');
            return
        }
        let host = 1
        let confname = values.confSubject
        let duration = 60 * values.duration
        let setdate = new Date(start_time)
        let milliseconds= setdate.getTime()
        let pincode = values.pinCode
        let repeat = parseInt(values.cycle)
        let repeatRule = '', membernames = '', membernumbers = '', memberaccts = '',memberemails='',recordsfrom = '';
        switch(repeat){
            case 0:
                repeatRule = "";
                break;
            case 1:
                repeatRule = "FREQ=DAILY";
                break;
            case 2:
                repeatRule = "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";
                break;
            case 3:
                repeatRule = "FREQ=WEEKLY;BYDAY=" + weekstrArr[setdate.getDay()];
                break;
            case 4:
                var day = parseInt(setdate.getDate());
                var dayweek = parseInt(setdate.getDay());
                var ordinal = Math.ceil( day / 7 );
                if( ordinal >= 5 )
                    ordinal = -1;
                repeatRule = "FREQ=MONTHLY;BYDAY=" + ordinal + weekstrArr[dayweek];
                break;
            case 5:
                repeatRule = "FREQ=MONTHLY";
                break;
            case 6:
                repeatRule = "FREQ=YEARLY";
                break;
            case 7:
                repeatRule = this.getCustomRepeatRule();
                break;
        }
        let preset = values.confpreset
        for (let i = 0; i < memberData.length; i++) {
            // console.log(memberData[i])
            if(i>0) {
                membernames += ':::';
                membernumbers += ':::';
                memberaccts += ':::';
                recordsfrom += ':::';
            }
            membernames += memberData[i].recordName ? memberData[i].recordName : memberData[i].Name
            membernumbers += memberData[i].Number
            memberaccts += memberData[i].Account || memberData[i].Acctid
            // recordsfrom = memberData[i].recordsfrom || ''
            let type = memberData[i].Type
            if (type==1 || type==3) {
                recordsfrom +=3
            } else if (type == 2) {
                recordsfrom += 4
            } else {
                recordsfrom += 5
            }
        }
        // console.log(recordsfrom)

        let infostr = "&host=" + encodeURIComponent(host)
            + "&confname=" + encodeURIComponent(confname)
            + "&duration=" + encodeURIComponent(duration)
            + "&start_time=" + encodeURIComponent(start_time)
            + "&milliseconds=" + encodeURIComponent(milliseconds)
            + "&pincode=" + encodeURIComponent(pincode)
            + "&repeat=" + encodeURIComponent(repeat)
            + "&repeatRule=" + encodeURIComponent(repeatRule)
            + "&preset=" + encodeURIComponent(preset)
            + "&reminder=0&schedulednd=0&autoanswer=0"
            + "&membernames=" + encodeURIComponent(membernames)
            + "&membernumbers=" + encodeURIComponent(membernumbers)
            + "&memberaccts=" + encodeURIComponent(memberaccts)
            + "&recordsfrom=" + encodeURIComponent(recordsfrom)

        this.props.handleHideNewConfModal();
        this.checkoutCyclemode(0);
        this.props.form.resetFields()
        this.setState({
            curMember:[],
            tempMember:[]
        })

        if (addoredit == 'add') {
            this.props.setschedule(infostr,()=>{
            })
        } else {
            infostr = values.Id + infostr
            this.props.setschedule(infostr, 1, ()=>{

            })
        }
        if(typeof this.props.updateDate == "function") {
            let self = this
            setTimeout(function () {
                self.props.updateDate()
            }, 500);
            // this.props.updateDate();
        }
        // console.log(infostr)
    }

    getCustomRepeatRule = () => {
        let values = this.props.form.getFieldsValue();
        var freq = "", byday = "", byyearday = "";
        var bymonthday = -1, ordinal = -1, dayweek = 0;
        let repeatRule = ''
        var custype = parseInt(values.customRepeat)
        switch(custype){
            case 0:
                freq = "DAILY";
                break;
            case 1:
                freq = "WEEKLY";
                for (let i = 0; i < 7; i++) {
                    if(values['dayofweek' + i]) {
                        if( byday != "" ){
                            byday += ",";
                        }
                        byday += weekstrArr[i]
                    }
                }
                break;
            case 2:
                freq = "MONTHLY";
                bymonthday = values.monthByDay
                break;
            case 3:
                freq = "MONTHLY";
                ordinal = values.monthWeekOrdinal
                if( ordinal == '5' ){
                    byday += "-1";
                }else{
                    byday += ordinal;
                }
                dayweek = values.monthWeekDay;
                byday += weekstrArr[dayweek];
                break;
            case 4:
                freq = "YEARLY";
                byyearday = values.yearly.toString().replace(',','')
                break;
        }
        if( freq != "" ){
            repeatRule = "FREQ=" + freq;
        }
        var interval = values.interval
        if( interval > 1 ){
            repeatRule += ";INTERVAL=" + interval;
        }
        if( byday != "" ){
            repeatRule += ";BYDAY=" + byday;
        }
        if( bymonthday != -1 ){
            // if( bymonthday < 1 || bymonthday > 31 ){
            //     // $.prompt("Date error!");
            //     this.props.promptMsg('ERROR','a_groupnameempty');
            //     return;
            // }
            repeatRule += ";BYMONTHDAY=" + bymonthday;
        }
        if( byyearday != "" ){
            repeatRule += ";BYYEARDAY=" + byyearday;
        }
        let enddate = values.customEndDate
        if(enddate) {
            enddate=enddate.format('YYYY-MM-DD')
            enddate += " 23:59";
            enddate = enddate.replace(/-/g, "/");
            var myDate = new Date(enddate);
            var time = myDate.getTime();
            var offset = myDate.getTimezoneOffset();
            myDate.setTime(time+offset*60000);
            repeatRule += ";UNTIL=" + this.date2str(myDate,"yyyyMMddThhmmssZ");
        }
        // console.log(repeatRule)
        return repeatRule;
    }

    date2str = (x,y) => {
        var z ={y:x.getFullYear(),M:x.getMonth()+1,d:x.getDate(),h:x.getHours(),m:x.getMinutes(),s:x.getSeconds()};
        return y.replace(/(y+|M+|d+|h+|m+|s+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-(v.length>2?v.length:2))});

    }

    handleCancel = () => {
        this.props.handleHideNewConfModal();
        // this.checkoutCyclemode(0);
        var containermask = document.getElementsByClassName("containermask")[0];
        if (containermask){
            containermask.style.display = "block";
        }
        this.props.form.resetFields()
        this.setState({curMember:[]});
    }

    onChangeCycle = (value) => {
        this.checkoutCyclemode(value);
    }

    checkoutCyclemode = (value) => {
        let mode = {
            customRepeat:'display-hidden',
            everyFixedDays: 'display-hidden',
            dayofweek: 'display-hidden',
            everyFixedMonth: 'display-hidden',
            monthByDay: 'display-hidden',
            monthByWeek: 'display-hidden',
            everyFixedYear: 'display-hidden',
            customClass:'display-hidden',
            interval:'display-hidden',
            str_interval:'a_15028'
        };
        if (value == '7') {
            mode.customRepeat = 'display-block'
            mode.everyFixedDays = 'display-block'
        }
        return mode
    }

    onChangeCustomCycle = (value) => {
        this.checkoutCustomCycleMode(value);
    }

    checkoutCustomCycleMode = (value) => {
        let mode = {
            everyFixedDays: 'display-hidden',
            dayofweek: 'display-hidden',
            everyFixedMonth: 'display-hidden',
            monthByDay: 'display-hidden',
            monthByWeek: 'display-hidden',
            everyFixedYear: 'display-hidden',
            customClass:'display-block',
            interval:'display-block',
            str_interval:'a_15028'
        };
        if (value == '0') {
            mode.everyFixedDays = 'display-block'
            mode.str_interval='a_15028'
        } else if(value == '1') {
            mode.dayofweek = 'display-block'
            mode.str_interval = 'a_15029'
        } else if(value == '2') {
            mode.everyFixedMonth = 'display-block'
            mode.monthByDay = 'display-block'
            mode.str_interval = 'a_15030'
        } else if(value == '3') {
            mode.everyFixedMonth = 'display-block'
            mode.monthByWeek ='display-block'
            mode.str_interval = 'a_15030'
        } else if(value == '4') {
            mode.everyFixedYear = 'display-block'
            mode.str_interval = 'a_15031'
        }

        return mode
    }

    _createName = (text, record, index) => {
        let name = text.Name
        let status;
        status = <div style = {{'height':'33px'}} title={name}><span className = "contactsIcon"></span><span className = "ellips contactstext contactname">{name}</span></div>;
        return status;
    }

    createDateOption = () => {
        let dateOption = []
        let month = [1,3,5,7,8,10,12]
        const {callTr} = this.props;
        for (let i = 1; i < 13; i++) {
            let obj = {}
            obj.label = i
            // + callTr('a_month')

            obj.value = i
            if(i<10) {
                obj.value = '0' + i
            }
            obj.children = []
            for (let j = 1; j < 32; j++) {
                let dayObj = {label : j,value : j}
                if(j<10) {
                    dayObj.value = '0' + j
                }
                if(month.includes(i)) {
                    obj.children.push(dayObj)
                } else if(i==2 && j<29) {
                    obj.children.push(dayObj)
                } else if(i!=2 && j<31) {
                    obj.children.push(dayObj)
                }
            }
            dateOption.push(obj)
        }
        return dateOption
    }

    createOptionObj = (extraMinutes) => {
        const {callTr} = this.props;
        let monthArr =[]
        let dayArr= []
        let hoursArr = []
        let minutesArr = []
        let durationArr = []
        extraMinutes = parseInt(extraMinutes)
        let presetArr = [
            <Option value = '-1'>{callTr('a_20')}</Option>
        ]
        let presetinfo = this.props.presetinfo
        for (let i = 0; i < 31; i++) {
            if(i<12) {
                let minutes = i * 5
                minutes = this.transStr(minutes)
                minutesArr.push(<Option value = {minutes.toString()}>{minutes}</Option>)
                if(extraMinutes < ((i+1) * 5) && (parseInt(extraMinutes/5) != extraMinutes/5)
                ) {
                    extraMinutes = this.transStr(extraMinutes)
                    minutesArr.push(<Option value = {this.transStr(extraMinutes)}>{extraMinutes}</Option>)
                }
            }
            if(i<24) {
                let hours = i
                hours = this.transStr(hours)
                hoursArr.push(<Option value = {hours}>{hours}</Option>)
            }
            if(i>1 && i<7) {
                let duration = (0.5 * i).toString()
                durationArr.push(<Option value = {duration}>{duration}</Option>)
            }
            dayArr.push(<Option value = {i+1}>{i+1}</Option>)
        }
        for (let i = 0; presetinfo[i] != undefined ; i++) {
            let position = parseInt(presetinfo[i].position)
            let name = presetinfo[i].name ? ('(' +presetinfo[i].name +')') : ''
            if(position<24) {
                presetArr.push(<Option value = {position.toString()}>{callTr('a_10024') + (position + 1) + name }</Option>)
            }
        }
        return {dayArr:dayArr,hoursArr:hoursArr,minutesArr:minutesArr,durationArr:durationArr,presetArr:presetArr}
    }

    disabledDate =(current) => {
        return current && current.valueOf() < Date.now();
    }

    disabledStartDate =(current) => {
        let values = this.props.form.getFieldsValue();
        let date = moment(values.confStatedate)
        return current && moment(current.valueOf()).isBefore(moment(date));
    }

    onStartChange = () => {
    }

    transStr = (num) => {
        num = parseInt(num)
        return num < 10 ? '0' + num : num.toString()
    }


    /*******AddModal****contact list***/

    handleAddMember = () => {
        this.setState({
            displayAddModal: true
        })
    }

    handleAddModalOk = () => {
        let memberArr = []
        let curMember = this.state.curMember
        let tempMember = this.state.tempMember
        // for (let i = tempMember.length -1 ; i >= 0 ; i--) {
        //     for (let j = 0; j < curMember.length; j++) {
        //         if(tempMember[i] && curMember[j] && tempMember[i].Number == curMember[j].Number) {
        //             tempMember.splice(i,1)
        //         }
        //     }
        // }
        memberArr = curMember.concat(tempMember)
        for (let i = memberArr.length -1 ; memberArr[i] != undefined ; i--) {
            for (let j = i-1; memberArr[j] != undefined ; j--) {
                // console.log(memberArr[i],memberArr[j])
                if(memberArr[j] && memberArr[i] && memberArr[i].Number == memberArr[j].Number) {
                    memberArr.splice(j,1)
                }
            }
        }
        // memberArr = curMember.concat(tempMember)
        this.setState({
            curMember: memberArr,
            tempMember:[],
            selectedRowKeys:[],
            selectedContactRowKeys:[],
            selectedCallRowKeys:[],
            displayAddModal: false,
            activeKey:'0'
        })
    }

    handleAddModalCancel = () => {
        this.setState({
            tempMember:[],
            selectedRowKeys:[],
            selectedContactRowKeys:[],
            selectedCallRowKeys:[],
            displayAddModal: false,
            activeKey:'0'
        })
    }

    createContactObj = () => {
        const columns = [
            {title: '',key: 'row0',dataIndex: 'row0',width: '50%'},
            {title: '',key: 'row1',dataIndex: 'row1',width: '25%'},
            {title: '',key: 'row2',dataIndex: 'row2',width: '25%'}];
        let contactsInformation  = this.props.contactsInformation;
        let contactsAcct = this.props.contactsAcct
        // console.log('contactsInformation',contactsInformation)
        // console.log('contactsAcct',this.props.contactsAcct)
        if(!this.props.contactsAcct.length){
            return {columns:columns,data:[]}
        }
        let contactItems = [];
        for (let i = 0; i < contactsInformation.length; i++ ) {
            if(contactsInformation[i].Number.length > 1 ) {
                for (let j = 0; j < contactsInformation[i].Number.length; j++) {
                    for (let k = 0; k < contactsAcct.length; k++) {
                        if(contactsInformation[i].Id == contactsAcct[k].Id) {
                            contactItems.push({
                                key: i,
                                row0: contactsInformation[i].Name,
                                row1: this.createTypeName(contactsAcct[k].AcctIndex[j]),
                                row2: contactsInformation[i].Number[j],
                                acct: contactsAcct[k].AcctIndex[j]
                            })
                        }
                    }
                }
            } else {
                contactItems.push({
                    key: i,
                    row0: contactsInformation[i].Name,
                    row1: this.createTypeName(contactsInformation[i].AcctIndex),
                    row2: contactsInformation[i].Number[0],
                    acct: contactsInformation[i].AcctIndex
                })
            }

        }
        for (let i = 0; i < contactItems.length; i++) {
            contactItems[i].key = i
        }

        if(contactItems.length) {
            if(!this.state.allContacts.length) {
                this.setState({allContacts:contactItems});
            }
            if(!this.state.curContacts.length) {
                this.setState({curContacts:contactItems});
            }
        }
        return {columns:columns,data:contactItems}
    }

    createTypeName = (value) => {
        let typeName = 'SIP'
        if (value == '1') {
            // typeName = 'IPVideoTalk'
            typeName = 'IPVT'
        } else if (value == '8') {
            typeName = 'H.323'
        }
        return typeName
    }

    handleSearchContact = (e) => {
        var searchkey = e.target.value.trim();
        let data = [];
        let dataSource = this.state.allContacts
        let selectedList = this.state.selectedContactRowKeys
        // console.log(dataSource)

        let acct = this.state.contType
        if(searchkey =='') {
            data = [...dataSource]
        } else {
            for (let i = 0; i < dataSource.length; i++) {
                let item = dataSource[i]
                let name = item.row0;
                let number = item.row2;
                // console.log(name,number,acct,searchkey)
                if ((number.indexOf(searchkey) != -1 || name.indexOf(searchkey) != -1) && (item.acct == acct || acct=='-1')) {
                    data.push(item);
                }
            }
        }
        if(data.length) {
            this.setState({showContact:true})
        }

        let selExtraSearMem = this.state.selExtraSearMem
        if(selExtraSearMem.length > 0) {
            data = data.concat(selExtraSearMem)
        }
        let selectRows = []
        for(let i = 0; i < selectedList.length;i++){
            for(let j=0; j < data.length;j++){
                if(data[j].key == selectedList[i]){
                    selectRows.push(j);
                    break;
                }
            }
        }
        let extraSearchMember = this.state.extraSearchMember
        if (!data.length) {
            if(/^[0-9]+$/.test(searchkey) && searchkey!= '') {
                acct = acct == '-1' ? '0' : acct
                let typeName = 'SIP'
                if (acct == '1') {
                    // typeName = 'IPVideoTalk'
                    typeName = 'IPVT'
                } else if (acct == '8') {
                    typeName = 'H.323'
                }
                let obj = {
                    key: dataSource.length,
                    row0: searchkey,
                    row1: typeName,
                    row2: searchkey,
                    acct: acct
                }
                data.push(obj)
                extraSearchMember.push(obj)
            } else {
                this.setState({showContact:false})
            }
        }

        //  额外搜索的号码清空后无法选中
        this.setState({
            curContacts: data,
            selectedRowKeys:selectRows,
            extraSearchMember:extraSearchMember
        });
    }

    // onSelectChange = (selectedRowKeys) => {
    //     this.setState({selectedRowKeys});
    // }

    onSelectItem = (record, selected, selectedRows) => {
        if (selected) {
            if(this.checkMember(record.acct)) {
                return
            }
        }
        let selectedContactRowKeys = this.state.selectedContactRowKeys

        // console.log(record)

        let name = record.row0;
        // let number = record.row2[0];
        let number = record.row2;

        // console.log(number)
        let acct = record.acct
        let tempMember = this.state.tempMember
        if (selected) {
            tempMember.push({Name: name, Number: number, Account: acct});
            selectedContactRowKeys.push(record.key)
        } else {
            for (let j = 0; j < tempMember.length; j++) {
                if (tempMember[j].Number == number) {
                    tempMember.splice(j, 1);
                    break;
                }
            }
            for (let i = 0; i < selectedContactRowKeys.length; i++) {
                if (record.key == selectedContactRowKeys[i]) {
                    selectedContactRowKeys.splice(i,1)
                }
            }
        }

        let selectRows = []
        let selectedList = selectedContactRowKeys
        let data = this.state.curContacts

        for(let i = 0; i < selectedList.length;i++){
            for(let j=0; j < data.length;j++){
                if(data[j].key == selectedList[i]){
                    selectRows.push(j);
                    break;
                }
            }
        }

        let extraSearchMember = this.state.extraSearchMember

        for (let i = 0; i < extraSearchMember.length; i++) {
            if(record.row0 == extraSearchMember[i].row0 && selected) {
                data = this.state.selExtraSearMem
                data.push(extraSearchMember[i])
                this.setState({selExtraSearMem:data})
            }
        }

        this.setState({
            tempMember:tempMember,
            selectedContactRowKeys:selectedContactRowKeys,
            selectedRowKeys:selectRows
        })
    }

    checkMember = (newMemberAcct) => {
        let member = this.state.curMember
        if (this.state.tempMember.length > 0) {
            member = this.state.tempMember
        }

        // let existMember = this.state.curMember.length > 0 || this.state.tempMember.length > 0
        let ismax = true
        if((member[0] && (member[0].Acctid == '1' || member[0].Account == '1' ) && newMemberAcct == '1') || !member[0]){
            ismax = false
        } else {
            this.props.promptMsg('ERROR','a_10097');
        }
        return ismax
    }

    handlefilter = (value,v) => {
        // v : 0 1 8
        // value : 0 contact  1 calllog
        if(value == '1') {
            this.setState({callType: v});
        } else {
            this.setState({contType: v});
        }
        // if(v != -1) {
        //     let data = [];
        //     let dataSource = this.state.allContacts
        //     if(value == '1') {
        //         dataSource = this.state.allCallLog
        //     }
        //     for (let i = 0; i < dataSource.length; i++) {
        //         if (dataSource[i].acct == v) {
        //             data.push(dataSource[i]);
        //         }
        //     }
        //     if(value == '1') {
        //         this.setState({curCallLog: data, callType: v});
        //     } else {
        //         this.setState({curContacts: data, contType: v});
        //     }
        // }
    }

    /*******AddModal****contact list***/

    createCalllogObj = () => {
        // console.log('create Call again')
        const columns = [
            {title: '',key: 'row0',dataIndex: 'row0',width: '75%',
                render: (text, record, index) => (
                    this._createRow0(text, record, index)
                )},
            {title: '',key: 'row1',dataIndex: 'row1',width: '25%',
                render: (text, record, index) => (
                    this.convertTime(text, record, index)
                )}];
        let logItemdata = this.props.logItemdata
        let confmember = this.props.confmemberinfodata ? this.props.confmemberinfodata : []



        let contactList = this.props.contactsInformation
        let callnameinfo = this.props.callnameinfo
        if(!contactList.length || !confmember.length) {
            return {columns:columns,data:[]}
        }
        let dataResult = [];
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
                let hasrecord = false
                for (let j = 0; callnameinfo[j] != undefined; j++) {
                    if(callnameinfo[j].Id == logItemdata[i].Id) {
                        hasrecord = true
                        let obj = logItemdata[i]
                        obj.Name = callnameinfo[j].Name
                        obj.Number = logItemdata[i].NameOrNumber
                        memberArr.push(obj)
                    }
                }
                if(!hasrecord) {
                    let obj = logItemdata[i]
                    // console.log('obj',obj)
                    obj.Name = logItemdata[i].NameOrNumber
                    obj.Number = logItemdata[i].NameOrNumber
                    memberArr.push(obj)
                }

            }
            data = {
                logItem : logItemdata[i],
                memberArr: memberArr
            }
            dataResult.push({
                key: i,
                row0: data,
                row1: parseInt(logItemdata[i].Date)
            })
        }
        if(dataResult.length) {
            if(!this.state.allCallLog.length) {
                this.setState({allCallLog:dataResult});
            }
            if(!this.state.curCallLog.length) {
                this.setState({curCallLog:dataResult});
            }
        }

        return {columns:columns,data:dataResult}

        // if (logItemdata.length == 0) {
        //     this.setState({showtips:'block'})
        // } else {
        //     this.setState({showtips:'none'})
        // }
    }

    _createRow0 = (text, record , index) => {
        let logItem = text.logItem
        let memberArr = text.memberArr
        let type = logItem.Type
        if (type == '-1') {
            type = memberArr[0].Type
        }
        let nameStr = ''
        if(logItem.IsConf == '1') {
            // nameStr = logItem.NameOrNumber + '：'
            nameStr = 'Conf:'
            for (let i = 0; memberArr[i] != undefined; i++) {
                if(i>0) {
                    nameStr += '，'
                }
                nameStr += memberArr[i].recordName ? memberArr[i].recordName : memberArr[i].Name
            }
        } else {
            nameStr = memberArr[0].Name
        }
        return <span className={nameStr}><i className={"type" + type}></i>{nameStr}</span>;
    }

    handleSearchCall = (e) => {
        var searchkey = e.target.value.trim();
        let data = [];
        let dataSource = this.state.allCallLog
        let acct = this.state.callType
        let selectedList = this.state.selectedCallRowKeys
        // console.log(dataSource)
        if(searchkey =='') {
            data = [...dataSource]
        } else {
            for (let i = 0; i < dataSource.length; i++) {
                let logItem = dataSource[i].row0.logItem
                let memberArr = dataSource[i].row0.memberArr
                let nameStr = ''
                let numberStr = ""
                if(logItem.IsConf == '1') {
                    // nameStr = logItem.NameOrNumber + '：'
                    nameStr = 'Conf：'

                    for (let i = 0; memberArr[i] != undefined; i++) {
                        if(i>0) {
                            nameStr += '，'
                        }
                        nameStr += memberArr[i].recordName ? memberArr[i].recordName : memberArr[i].Name
                        numberStr += memberArr[i].Number
                    }
                } else {
                    nameStr = memberArr[0].Name
                    numberStr = memberArr[0].Number
                }
                if ((nameStr.indexOf(searchkey) != -1 || numberStr.indexOf(searchkey) != -1) && (memberArr[0].Account == acct || acct=='-1')) {
                    data.push(dataSource[i]);
                }
            }
        }

        if (!data.length) {
            this.setState({showCallLog:false})
        } else {
            this.setState({showCallLog:true})
        }

        let selectRows = []
        for(let i = 0; i < selectedList.length;i++){
            for(let j=0; j < data.length;j++){
                if(data[j].key == selectedList[i]){
                    selectRows.push(j);
                    break;
                }
            }
        }

        this.setState({
            curCallLog: data,
            selectedRowKeys:selectRows
        });

    }

    onCallRowChange = (selectedCallRowKeys) => {

        // this.setState({selectedCallRowKeys});
    }

    onSelectCallItem = (record, selected, selectedRows) => {
        let dataArr = record.row0.memberArr
        if (selected) {
            if(this.checkMember(dataArr[0].Account)) {
                return
            }
        }
        let tempMember = this.state.tempMember
        let selectedCallRowKeys = this.state.selectedCallRowKeys
        if(selected) {
            selectedCallRowKeys.push(record.key)
        } else {
            for (let i = 0; i < selectedCallRowKeys.length; i++) {
                if (record.key == selectedCallRowKeys[i]) {
                    selectedCallRowKeys.splice(i,1)
                }
            }
        }
        for (let j = 0; dataArr[j] != undefined ; j++) {
            let item = dataArr[j]
            let name = item.Name;
            let number = item.Number;
            let acct = item.Account
            // console.log(dataArr[j],name,number)
            if (selected) {
                tempMember.push({Name: name, Number: number, Account: acct});
            } else {
                for (let i = tempMember.length - 1 ; tempMember[i] != undefined; i++) {
                    if (tempMember[i].Number == number) {
                        tempMember.splice(i, 1);
                        // break;
                    }
                }
            }
        }
        let selectRows = []
        let selectedList = selectedCallRowKeys

        // console.log(selectedCallRowKeys)

        let data = this.state.curCallLog

        for(let i = 0; i < selectedList.length;i++){
            for(let j=0; j < data.length;j++){
                if(data[j].key == selectedList[i]){
                    selectRows.push(j);
                    break;
                }
            }
        }

        this.setState({
            tempMember:tempMember,
            selectedCallRowKeys:selectedCallRowKeys,
            selectedRowKeys:selectRows
        })
    }

    changeTab = (key) => {
        let selectedRowKeys = []
        if (key == '1') {
            selectedRowKeys = this.state.selectedCallRowKeys
        } else {
            selectedRowKeys = this.state.selectedContactRowKeys
        }
        this.setState({selectedRowKeys:selectedRowKeys})
    }

    render() {
        let title = this.props.addNewConf ? 'a_10035' : 'a_10051'; // add : edit
        let allDisabled = false
        let modalclass = 'importModal confModal '

        if(this.props.confdetail) { // show detail
            title = 'a_12160'
            modalclass += 'hidden-modal-btn'
            allDisabled = true
        }
        let values = this.props.form.getFieldsValue();
        const {getFieldDecorator} = this.props.form;
        const {callTr,itemValues} = this.props;

        let dateFormat = 'YYYY/MM/DD';
        let now = moment().add(10, "minutes")
        let curMonth = now.month()
        let curDay = now.date()
        let curDate = now
        let curHour = this.transStr(now.hours())
        let curMinutes = this.transStr(now.minutes())
        let curWeekDay = now.day()
        let weekNum = Math.ceil(curDay / 7).toString()
        let dayofweekArrvalue = []

        for (let i = 0; i < 7; i++) {
            dayofweekArrvalue[i] = i==curWeekDay ? 1:0
        }
        // let memberData = this.props.confMemberData
        let memberData = this.props.confMemberData
        if( this.state.curMember.length == 0  && this.props.confMemberData.length>0) {
            this.setState({curMember:this.props.confMemberData})
        } else if(this.state.curMember.length > 0) {
            memberData = this.state.curMember
        }

        let DateOptions = this.createDateOption()
        let extraMinutes = values.confminutes
        let optionObj = {}
        if( (parseInt(extraMinutes/5)) != extraMinutes/5 ) {
            optionObj = this.createOptionObj(values.confminutes)
        } else {
            optionObj = this.createOptionObj(curMinutes)
        }

        let contactObj = this.createContactObj()
        let contactData = contactObj.data
        if (this.state.curContacts) {
            contactData = this.state.curContacts
        }
        if(!this.state.showContact) {
            contactData = []
        }

        let calllogObj = this.createCalllogObj()
        let calllogData = calllogObj.data
        if (this.state.curCallLog) {
            calllogData = this.state.curCallLog
        }
        if(!this.state.showCallLog) {
            calllogData = []
        }

        let classObj = {}
        if(values.cycle != '7') {
            classObj = this.checkoutCyclemode(values.cycle)
        } else {
            classObj = this.checkoutCustomCycleMode(values.customRepeat)
        }

        const {selectedRowKeys} = this.state;
        const ContRowSelection = {
            selectedRowKeys,
            onSelect: this.onSelectItem
        }
        const callRowSelection = {
            selectedRowKeys,
            onSelect: this.onSelectCallItem,
        }
        return(
            <div>
                <Modal  className={modalclass} visible={this.props.displayNewConfModal}
                       title={callTr(title)} onOk={this.handleOk} onCancel={this.handleCancel} okText={callTr("a_2")} cancelText={callTr("a_3")} >
                    <Form onSubmit={this.handleSubmit} hideRequiredMark >
                        <FormItem className='display-hidden'>
                            {getFieldDecorator('Id', {})(
                                <Input hidden />
                            )}
                        </FormItem>
                        <FormItem label={(<span>{callTr("a_15054")}</span>)}>
                            {getFieldDecorator('confSubject', {
                                rules: [{required: true, message: callTr("a_19637")}]
                            })(
                                <Input disabled={allDisabled} style={{width:'93%'}}/>
                            )}
                        </FormItem>
                        <FormItem label={(<span>{callTr("a_4033")}</span>)}>
                            {getFieldDecorator('confStatedate', {
                                rules: [{ type: 'object', required: true, message: 'Please select time!' }],
                                initialValue:moment(curDate, 'YYYY-MM-DD')
                            })(
                                <DatePicker disabled={allDisabled} disabledDate={this.disabledDate} onChange={this.onStartChange.bind(this)} style={{width:'40%'}} format={dateFormat}/>
                            )}
                            &nbsp;&nbsp;
                            {getFieldDecorator('confhours', {
                                rules: [{required: true, message: callTr("a_19637")}],
                                initialValue: curHour.toString()
                            })(
                                <Select disabled={allDisabled} defaultValue="a1" style={{width:'25%'}} >
                                    {optionObj.hoursArr}
                                </Select>
                            )}
                            &nbsp;<span>:</span>&nbsp;
                            {getFieldDecorator('confminutes', {
                                rules: [{required: true, message: callTr("a_19637")}],
                                initialValue: curMinutes.toString()

                            })(
                                <Select disabled={allDisabled} style={{width:'25%'}}>
                                    {optionObj.minutesArr}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={(<span>{callTr("a_3501")}</span>)}>
                            {getFieldDecorator('duration', {
                                rules: [{required: true, message: callTr("a_19637")}],
                                initialValue: '1'
                            })(
                                <Select disabled={allDisabled} style={{width:'25%'}}>
                                    {optionObj.durationArr}
                                </Select>
                            )}
                            &nbsp;&nbsp;
                            <span>{callTr("a_15007")}</span>
                        </FormItem>
                        <FormItem label={(<span>{callTr("a_10024")}</span>)}>
                            {getFieldDecorator('confpreset', {
                                initialValue: '-1'
                            })(
                                <Select disabled={allDisabled} style={{width:'40%'}}>
                                    {optionObj.presetArr}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={(<span>{callTr("a_10054")}</span>)}>
                            {getFieldDecorator('cycle', {
                                initialValue: '0'
                            })(
                                <Select disabled={allDisabled} style={{width:'40%'}} >
                                    <option value="0">{callTr("a_10143")}</option>
                                    <option value="1">{callTr("a_10144")}</option>
                                    <option value="2">{callTr("a_10145")}</option>
                                    <option value="3">{callTr("a_10146")}</option>
                                    <option value="4">{callTr("a_10148")}</option>
                                    <option value="5">{callTr("a_10149")}</option>
                                    <option value="6">{callTr("a_10150")}</option>
                                    <option value="7">{callTr("a_10151")}</option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={classObj.customRepeat} label={(<span>{callTr("a_15025")}</span>)}>
                            {getFieldDecorator('customRepeat', {
                                initialValue: '0'
                            })(
                                <Select disabled={allDisabled} style={{width:'40%'}} >
                                    <option value="0">{callTr("a_10144")}</option>
                                    <option value="1">{callTr("a_10146")}</option>
                                    <option value="2">{callTr("a_10148")}</option>
                                    <option value="3">{callTr("a_10149")}</option>
                                    <option value="4">{callTr("a_10150")}</option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.interval } label={(<span>{callTr(classObj.str_interval)}</span>)}>
                            {getFieldDecorator('interval', {
                                initialValue: '1'
                            })(
                                <Input disabled={allDisabled} style={{width:'40%'}}/>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.dayofweek + " " + "mutilCheckbox" } label={< span > { callTr("a_16346") }</span >}>
                            {getFieldDecorator('dayofweek', {
                                rules: [],
                                // initialValue: this.props.itemValues['dayofweek']
                            })(<Input disabled={allDisabled} className="P-286" style={{"display": "none"}}/>)}
                            {getFieldDecorator('dayofweek0', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[0])
                            })(
                                <Checkbox disabled={allDisabled}>{callTr("a_130")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek1', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[1])
                            })(
                                <Checkbox disabled={allDisabled}>{callTr("a_124")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek2', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[2])
                            })(
                                <Checkbox disabled={allDisabled}>{callTr("a_125")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek3', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[3])
                            })(
                                <Checkbox disabled={allDisabled}>{callTr("a_126")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek4', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[4])
                            })(
                                <Checkbox disabled={allDisabled}>{callTr("a_127")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek5', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[5])
                            })(
                                <Checkbox disabled={allDisabled}>{callTr("a_128")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek6', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[6])
                            })(
                                <Checkbox disabled={allDisabled}>{callTr("a_129")}</Checkbox>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.monthByDay } label={(<span>{callTr("a_15032")}</span>)}>
                            {getFieldDecorator('monthByDay', {
                                initialValue: curDay.toString()
                            })(
                                <Select disabled={allDisabled} style={{width:'40%'}} >
                                    {optionObj.dayArr}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.monthByWeek } label={(<span>{callTr("a_15032")}</span>)}>
                            {getFieldDecorator('monthWeekOrdinal', {
                                initialValue: weekNum.toString()
                            })(
                                <Select disabled={allDisabled} style={{width:'40%'}} >
                                    <option value="1">{callTr("a_19162")}</option>
                                    <option value="2">{callTr("a_116")}</option>
                                    <option value="3">{callTr("a_19164")}</option>
                                    <option value="4">{callTr("a_19165")}</option>
                                    <option value="5">{callTr("a_19166")}</option>
                                </Select>
                            )}&nbsp;&nbsp;
                            {getFieldDecorator('monthWeekDay', {
                                initialValue: curWeekDay.toString()
                            })(
                                <Select disabled={allDisabled} style={{width:'40%'}} >
                                    <option value="0">{callTr("a_130")}</option>
                                    <option value="1">{callTr("a_124")}</option>
                                    <option value="2">{callTr("a_125")}</option>
                                    <option value="3">{callTr("a_126")}</option>
                                    <option value="4">{callTr("a_127")}</option>
                                    <option value="5">{callTr("a_128")}</option>
                                    <option value="6">{callTr("a_129")}</option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.everyFixedYear } label={(<span>{callTr("a_15032")}</span>)}>
                            {getFieldDecorator('yearly', {
                                initialValue: [this.transStr(curMonth), this.transStr(curDay)]
                            })(
                                <Cascader disabled={allDisabled} options={DateOptions}  placeholder="Please select" style={{width:'40%'}} />
                            )}
                        </FormItem>
                        <FormItem className={ classObj.customClass } label={(<span>{callTr("a_19621")}</span>)}>
                            {getFieldDecorator('confStatedate', {
                            })(
                                <DatePicker
                                    disabled={allDisabled}
                                    format="YYYY-MM-DD"
                                    disabledDate={this.disabledDate}
                                    disabled={true}
                                    style={{width:'40%'}}
                                />
                            )}
                            &nbsp;-&nbsp;
                            {getFieldDecorator('customEndDate', {

                            })(
                                <DatePicker disabled={allDisabled} disabledDate={this.disabledStartDate} placeholder="为空则无结束日期"
                                    format="YYYY-MM-DD"
                                    style={{width:'40%'}}
                                />
                            )}
                        </FormItem>

                        <FormItem label={(<span>{callTr("a_19133")}</span>)}>
                            {getFieldDecorator('pinCode', {
                                initialValue: ''
                            })(
                                <Input disabled={allDisabled} style={{width:'40%'}}/>
                            )}

                        </FormItem>
                        <FormItem label={(<span className='ant-form-item-required'>{callTr("a_15035")}</span>)}>
                            <Button disabled={allDisabled} type="primary" onClick={this.handleAddMember.bind(this)}>
                                {callTr('a_23')}
                            </Button>
                        </FormItem>
                        <div className = 'confinfo_memberlist'>
                            {
                                (memberData.length > 0) && memberData.map((member) => {
                                    return (
                                        <div className={'memberlist'}>
                                            <div style = {{'height':'33px'}}>
                                                <span className = "contactsIcon"></span>
                                                <span className = "ellips contactstext contactname">{member.recordName ? member.recordName:member.Name}</span>
                                            </div>
                                            <div>{member.Number} </div>
                                            {/*<span>{member.recordName ? member.recordName:member.Name}</span><span></span>*/}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Form>
                </Modal>

                <Modal className='importModal confModal' style={{'minHeight':'540px'}} title={callTr('a_517')} onOk={this.handleAddModalOk} onCancel={this.handleAddModalCancel}
                       okText={callTr("a_2")} cancelText={callTr("a_3")}  visible={this.state.displayAddModal}>
                    <Tabs className="config-tab" defaultActiveKey={this.state.activeKey} onChange={this.changeTab}>
                        <TabPane tab = {this.tr("a_19631")} key='0'>
                            <div className="scrollbox">
                                <div style={{marginBottom:'15px'}}>
                                    <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.handleSearchContact.bind(this)} style={{'width':'73%'}} placeholder = {callTr("a_65")}></Input>
                                    <Select value={this.state.contType} className="acctselect" onChange={this.handlefilter.bind(this,0)} style={{'width':'25%','margin-left':'2%'}}>
                                        <option value="-1">All</option>
                                        <option value="0">SIP</option>
                                        <option value="1">IPVideoTalk</option>
                                        <option value="8">H.323</option>
                                    </Select>
                                </div>
                                <Table
                                    rowSelection={ContRowSelection}
                                    rowKey = ""
                                    columns = { contactObj.columns }
                                    pagination = { false }
                                    dataSource = { contactData }
                                    showHeader = { false }
                                />
                            </div>
                        </TabPane>
                        <TabPane tab = {this.tr("a_3536")} key='1'>
                            <div className="scrollbox">
                                <div style={{marginBottom:'15px'}}>
                                    <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.handleSearchCall.bind(this)} style={{'width':'73%'}} placeholder = {callTr("a_65")}></Input>
                                    <Select value={this.state.callType} className="acctselect" onChange={this.handlefilter.bind(this,1)} style={{'width':'25%','margin-left':'2%'}}>
                                        <option value="-1">All</option>
                                        <option value="0">SIP</option>
                                        <option value="1">IPVideoTalk</option>
                                        <option value="8">H.323</option>
                                    </Select>
                                </div>
                                <Table
                                    rowSelection={callRowSelection}
                                    rowKey = ""
                                    columns = { calllogObj.columns }
                                    pagination = { false }
                                    dataSource = { calllogData }
                                    showHeader = { false }
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    product: state.product,
    presetinfo: state.presetinfo,
    activeKey: state.TabactiveKey,
    contactsInformation: state.contactsInformation,
    logItemdata: state.logItemdata,
    callnameinfo:state.callnameinfo,
    confmemberinfodata:state.confmemberinfodata,
    contactsAcct: state.contactsAcct,
});

function mapDispatchToProps(dispatch) {
    var actions = {
        get_calllog: Actions.get_calllog,
        getContacts:Actions.getContacts,
        getPresetInfo: Actions.getPresetInfo,
        setschedule: Actions.setschedule,
        getNormalCalllogNames:Actions.getNormalCalllogNames,
        getAllConfMember:Actions.getAllConfMember,
        getAcctStatus: Actions.getAcctStatus
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps ,mapDispatchToProps)(Enhance(NewContactsEdit));
