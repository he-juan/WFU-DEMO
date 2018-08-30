import React, { Component } from 'react'
import Enhance from './mixins/Enhance'
import * as Actions from './redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form,Checkbox, Modal, Tooltip, Icon, Row,Col, Input, Button, Select, Radio,DatePicker,Table,Cascader,Tabs } from "antd"
import moment from 'moment';
const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane;

const weekstrArr = ['SU','MO','TU','WE','TH','FR','SA']

const config = {
    rules: [{ type: 'object', required: true, message: 'Please select time!' }],
};

class NewContactsEdit extends Component {
    constructor(props){
        super(props);
        this.state = {
            addNewContact:[0],
            selectedRowKeys: [],
            editNumbers:[],
            groups:[],
            value:"",
            numValuesinnr:[""],
            eValue:"",
            emailValuesinnr:[""],
            cycle_group_class:{
                str_interval: 'a_everyFixedDays',
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
            curContacts:[]
        }
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        // this.props.getContactCount();
        this.props.get_calllog(0);
        this.props.getContacts()
        // this.props.getContacts((items)=>{this.setState({items:items})});

        this.props.getPresetInfo()
    }

    handleOk = () => {
        let addoredit = this.props.addNewContact ? 'add' : 'edit';
        let values = this.props.form.getFieldsValue();
        values.confStatedate = values.confStatedate.format('YYYY-MM-DD')
        let start_time = values.confStatedate + ' ' + values.confhours + ':' +values.confminutes
        if(moment(start_time).isBefore(moment())) {
            this.props.promptMsg('ERROR','a_timeWarn');
            return
        }
        let memberData = this.props.confMemberData
        if(memberData.length == 0) {
            this.props.promptMsg('ERROR','a_memberempty');
            return
        }
        let host = 1
        let confname = values.confSubject
        let duration = 60 * values.duration
        let setdate = new Date(start_time)
        let milliseconds= setdate.getTime()
        let pincode = values.pinCode
        let repeat = parseInt(values.cycle)
        let repeatRule = '', membernames = '', membernumbers = '', memberaccts = '',recordsfrom = '';
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
            if(i>0) {
                membernames += ':::';
                membernumbers += ':::';
                memberaccts += ':::';
                recordsfrom += ':::';
            }
            membernames += memberData[i].recordName ? memberData[i].recordName : memberData[i].Name
            membernumbers += memberData[i].Number
            memberaccts += memberData[i].Account
            let type = memberData[i].Type
            if (type==1 || type==3) {
                recordsfrom +=3
            } else if (type == 2) {
                recordsfrom += 4
            } else {
                recordsfrom += 5
            }
        }

        let infostr = "&host" + encodeURIComponent(host)
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


        // this.props.setschedule(infostr,()=>{
        //     this.props.getContactCount();
        //     this.props.getPresetInfo()
        // })

    }

    getCustomRepeatRule = () => {
        let values = this.props.form.getFieldsValue();
        var freq = "", byday = "", byyearday = "";
        var bymonthday = -1, ordinal = -1, dayweek = 0;
        let repeatRule = ''
        var custype = parseInt(values.customRepeat)

        console.log('custype',custype)
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
                console.log('heheeee')
                // var repmonth = parseInt($("#cusyearlydatemonth").val());
                // var repday = parseInt($("#cusyearlydateday").val());
                // if( repmonth < 10 )
                //     byyearday += "0";
                // byyearday += repmonth;
                // if( repday < 10 )
                //     byyearday += "0";
                // byyearday += repday;
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
        console.log(repeatRule)
        return repeatRule;
    }

    date2str = (x,y) => {
        var z ={y:x.getFullYear(),M:x.getMonth()+1,d:x.getDate(),h:x.getHours(),m:x.getMinutes(),s:x.getSeconds()};
        return y.replace(/(y+|M+|d+|h+|m+|s+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-(v.length>2?v.length:2))});

    }

    handleCancel = () => {
        this.props.handleHideNewConfModal();
        this.checkoutCyclemode(0);

        var containermask = document.getElementsByClassName("containermask")[0];
        if (containermask){
            containermask.style.display = "block";
        }
        this.props.form.resetFields()
        this.setState({numValuesinnr:[""],emailValuesinnr:[""]});
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
            interval:'display-hidden'
        };
        if (value == '7') {
            mode.customRepeat = 'display-block'
            mode.everyFixedDays = 'display-block'
        }
        this.setState({
            cycle_group_class: mode
        })
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
            str_interval:'a_everyFixedDays'

        };
        if (value == '0') {
            mode.everyFixedDays = 'display-block'
            mode.str_interval='a_everyFixedDays'
        } else if(value == '1') {
            mode.dayofweek = 'display-block'
            mode.str_interval = 'a_everyFixedWeeks'
        } else if(value == '2') {
            mode.everyFixedMonth = 'display-block'
            mode.monthByDay = 'display-block'
            mode.str_interval = 'a_everyFixedMonth'
        } else if(value == '3') {
            mode.everyFixedMonth = 'display-block'
            mode.monthByWeek ='display-block'
            mode.str_interval = 'a_everyFixedMonth'
        } else if(value == '4') {
            mode.everyFixedYear = 'display-block'
            mode.str_interval = 'a_everyFixedYear'
        }
        this.setState({
            cycle_group_class: mode
        })
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

    createOptionObj = () => {
        const {callTr} = this.props;
        let monthArr =[]
        let dayArr= []
        let hoursArr = []
        let minutesArr = []
        let durationArr = []
        let presetArr = [
            <Option value = '-1'>{callTr('a_none')}</Option>
        ]
        let presetinfo = this.props.presetinfo
        for (let i = 0; i < 31; i++) {
            if(i<12) {
                let minutes = i * 5
                minutes = minutes < 10 ? 0 + minutes.toString() : minutes.toString()
                minutesArr.push(<Option value = {minutes}>{minutes}</Option>)
            }
            if(i<24) {
                let hours = i
                hours = hours < 10 ? 0 + hours.toString() : hours.toString()
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
                presetArr.push(<Option value = {position}>{callTr('a_preset') + (position + 1) + name }</Option>)
            }
        }
        return {dayArr:dayArr,hoursArr:hoursArr,minutesArr:minutesArr,durationArr:durationArr,presetArr:presetArr}
    }

    disabledDate =(current) => {
        return current && current.valueOf() < Date.now();
    }

    onStartChange = () => {
        console.log(6666)
    }

    transStr = (num) => {
        return num<10 ? '0' + num : num
    }


    /*******AddModal*******/

    handleAddMember = () => {
        this.setState({
            displayAddModal: true
        })
    }

    handleAddModalOk = () => {

    }
    handleAddModalCancel = () => {
        this.setState({displayAddModal:false});
    }

    createContactObj = () => {
        // if(!$.isArray(this.props.contactsInformation)) {
        //     this.props.getContacts()
        //     return;
        // }
        const {callTr} = this.props;
        const columns = [
            {title: callTr("a_name"),key: 'row0',dataIndex: 'row0',width: '50%'},
            {title: callTr("a_type"),key: 'row1',dataIndex: 'row1',width: '25%'},
            {title: callTr("a_number"),key: 'row2',dataIndex: 'row2',width: '25%'
            }];
        let contactsInformation  = this.props.contactsInformation;
        console.log(contactsInformation)
        let contactItems = [];
        for (let i = 0; i < contactsInformation.length; i++ ) {
            let type = 'SIP'
            if (contactsInformation[i].AcctIndex == '1') {
                // type = 'IPVideoTalk'
                type = 'IPVT'
            } else if (contactsInformation[i].AcctIndex == '8') {
                type = 'H.323'
            }
            contactItems.push({
                key: i,
                row0: contactsInformation[i].Name,
                row1: type,
                row2: contactsInformation[i].Number,
            })
        }
        // this.setState({allContacts:contactItems});
        // if(!this.state.curContacts.length && contactItems.length) {
        //     this.setState({curContacts:contactItems});
        // }
        // return contactItems
        return {columns:columns,data:contactItems}
    }

    handleChange = () => {

    }

    render() {
        let title = this.props.addNewConf ? 'a_newConf' : 'a_editConf';
        const {getFieldDecorator} = this.props.form;
        const {callTr,itemValues} = this.props;
        let dateFormat = 'YYYY/MM/DD';
        let myDate = new Date()
        let curMonth = (parseInt(myDate.getMonth()) + 1)
        let curDay = myDate.getDate()
        let curDate = myDate.getFullYear() + '/' + curMonth + '/' + curDay
        let curHour = this.transStr(myDate.getHours())
        let curMinutes = myDate.getMinutes() + 10
        if (curMinutes > 59) {
            curMinutes = (curMinutes-59).toString()
            curHour = (parseInt(curHour) + 1).toString()
        }
        let curWeekDay = myDate.getDay().toString()
        let weekNum = Math.ceil(curDay / 7).toString()
        let dayofweekArrvalue = []
        for (let i = 0; i < 7; i++) {
            dayofweekArrvalue[i] = i==curWeekDay ? 1:0
        }
        let memberData = this.props.confMemberData
        let DateOptions = this.createDateOption()
        let optionObj = this.createOptionObj()
        let classObj = this.state.cycle_group_class
        // this.createContactObj()
        // const contactcolumns = [
        //     {title: callTr("a_name"),key: 'row0',dataIndex: 'row0',width: '50%'},
        //     {title: callTr("a_type"),key: 'row1',dataIndex: 'row1',width: '25%'},
        //     {title: callTr("a_number"),key: 'row2',dataIndex: 'row2',width: '25%'}];
        // let contactData = [];
        // if (this.state.curContacts) {
        //     contactData = this.state.curContacts;
        // } else {
        //     contactData = this.createContactData();
        // }
        // console.log('contactData',contactData)
        let contactObj = this.createContactObj()
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: this.onSelectItem,
            onSelectAll: this.onSelectAllContacts
        }
        return(
            <div>
                <Modal className='importModal confModal' visible={this.props.displayNewConfModal}
                       title={callTr(title)} onOk={this.handleOk} onCancel={this.handleCancel} okText={callTr("a_ok")} cancelText={callTr("a_cancel")} >
                    <Form onSubmit={this.handleSubmit} hideRequiredMark >
                        <FormItem label={(<span>{callTr("a_confSubject")}</span>)}>
                            {getFieldDecorator('confSubject', {
                                rules: [{required: true}]
                            })(
                                <Input style={{width:'93%'}}/>
                            )}
                        </FormItem>
                        <FormItem label={(<span>{callTr("a_timestart")}</span>)}>
                            {getFieldDecorator('confStatedate', {
                                rules: [{ type: 'object', required: true, message: 'Please select time!' }],
                                initialValue:moment(curDate, 'YYYY-MM-DD')
                             })(
                                <DatePicker disabledDate={this.disabledDate} onChange={this.onStartChange.bind(this)} style={{width:'40%'}} format={dateFormat}/>
                            )}
                            &nbsp;&nbsp;
                            {getFieldDecorator('confhours', {
                                rules: [{required: true}],
                                initialValue: curHour
                            })(
                                <Select defaultValue="a1" style={{width:'25%'}} >
                                    {optionObj.hoursArr}
                                </Select>
                            )}
                            &nbsp;<span>:</span>&nbsp;
                            {getFieldDecorator('confminutes', {
                                rules: [{required: true}],
                                initialValue: curMinutes

                            })(
                                <Select style={{width:'25%'}}>
                                    {optionObj.minutesArr}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={(<span>{callTr("a_confDuration")}</span>)}>
                            {getFieldDecorator('duration', {
                                rules: [{required: true}],
                                initialValue: '1'
                            })(
                                <Select style={{width:'25%'}}>
                                    {optionObj.durationArr}
                                </Select>
                            )}
                            &nbsp;&nbsp;
                            <span>{callTr("a_Hour")}</span>
                        </FormItem>
                        <FormItem label={(<span>{callTr("a_confPreset")}</span>)}>
                            {getFieldDecorator('confpreset', {
                                initialValue: '-1'
                            })(
                                <Select style={{width:'40%'}}>
                                    {optionObj.presetArr}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={(<span>{callTr("a_cycleType")}</span>)}>
                            {getFieldDecorator('cycle', {
                                initialValue: '0'
                            })(
                                <Select onChange={ this.onChangeCycle.bind(this) } style={{width:'40%'}} >
                                    <option value="0">{callTr("a_oneTimeEvent")}</option>
                                    <option value="1">{callTr("a_daily")}</option>
                                    <option value="2">{callTr("a_weekday")}</option>
                                    <option value="3">{callTr("a_weekly")}</option>
                                    <option value="4">{callTr("a_monthly")}</option>
                                    <option value="5">{callTr("a_monthly1")}</option>
                                    <option value="6">{callTr("a_yearly")}</option>
                                    <option value="7">{callTr("a_custom")}</option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.customRepeat } label={(<span>{callTr("a_customRepeat")}</span>)}>
                            {getFieldDecorator('customRepeat', {
                                initialValue: '0'
                            })(
                                <Select onChange={ this.onChangeCustomCycle.bind(this) } style={{width:'40%'}} >
                                    <option value="0">{callTr("a_daily")}</option>
                                    <option value="1">{callTr("a_weekly")}</option>
                                    <option value="2">{callTr("a_monthly")}</option>
                                    <option value="3">{callTr("a_monthly1")}</option>
                                    <option value="4">{callTr("a_yearly")}</option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.interval } label={(<span>{callTr(classObj.str_interval)}</span>)}>
                            {getFieldDecorator('interval', {
                                initialValue: '1'
                            })(
                                <Input style={{width:'40%'}}/>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.dayofweek + " " + "mutilCheckbox" } label={< span > { callTr("a_dayofweek") }</span >}>
                            {getFieldDecorator('dayofweek', {
                                rules: [],
                                // initialValue: this.props.itemValues['dayofweek']
                            })(<Input className="P-286" style={{"display": "none"}}/>)}
                            {getFieldDecorator('dayofweek0', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[0])
                            })(
                                <Checkbox>{callTr("a_sunday")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek1', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[1])
                            })(
                                <Checkbox>{callTr("a_monday")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek2', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[2])
                            })(
                                <Checkbox>{callTr("a_tuesday")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek3', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[3])
                            })(
                                <Checkbox>{callTr("a_wednesday")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek4', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[4])
                            })(
                                <Checkbox>{callTr("a_thursday")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek5', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[5])
                            })(
                                <Checkbox>{callTr("a_friday")}</Checkbox>
                            )}
                            {getFieldDecorator('dayofweek6', {
                                valuePropName: 'checked',
                                initialValue: parseInt(dayofweekArrvalue[6])
                            })(
                                <Checkbox>{callTr("a_saturday")}</Checkbox>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.monthByDay } label={(<span>{callTr("a_repeatDate")}</span>)}>
                            {getFieldDecorator('monthByDay', {
                                initialValue: curDay.toString()
                            })(
                                <Select style={{width:'40%'}} >
                                    {optionObj.dayArr}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.monthByWeek } label={(<span>{callTr("a_repeatDate")}</span>)}>
                            {getFieldDecorator('monthWeekOrdinal', {
                                initialValue: weekNum.toString()
                            })(
                                <Select style={{width:'40%'}} >
                                    <option value="1">{callTr("a_first")}</option>
                                    <option value="2">{callTr("a_second")}</option>
                                    <option value="3">{callTr("a_third")}</option>
                                    <option value="4">{callTr("a_fourth")}</option>
                                    <option value="5">{callTr("a_last")}</option>
                                </Select>
                            )}&nbsp;&nbsp;
                            {getFieldDecorator('monthWeekDay', {
                                initialValue: curWeekDay.toString()
                            })(
                                <Select  style={{width:'40%'}} >
                                    <option value="0">{callTr("a_sunday")}</option>
                                    <option value="1">{callTr("a_monday")}</option>
                                    <option value="2">{callTr("a_tuesday")}</option>
                                    <option value="3">{callTr("a_wednesday")}</option>
                                    <option value="4">{callTr("a_thursday")}</option>
                                    <option value="5">{callTr("a_friday")}</option>
                                    <option value="6">{callTr("a_saturday")}</option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={ classObj.everyFixedYear } label={(<span>{callTr("a_repeatDate")}</span>)}>
                            {getFieldDecorator('yearly', {
                                initialValue: [this.transStr(curMonth), this.transStr(curDay)]
                            })(
                                <Cascader options={DateOptions}  placeholder="Please select" style={{width:'40%'}} />
                            )}
                        </FormItem>
                        <FormItem className={ classObj.customClass } label={(<span>{callTr("a_cycle")}</span>)}>
                            {getFieldDecorator('confStatedate', {
                            })(
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={this.disabledDate}
                                    disabled={true}
                                    style={{width:'40%'}}
                                />
                            )}
                            &nbsp;-&nbsp;
                            {getFieldDecorator('customEndDate', {

                            })(
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    style={{width:'40%'}}
                                />
                            )}
                        </FormItem>

                        <FormItem label={(<span>{callTr("a_pinCode")}</span>)}>
                            {getFieldDecorator('pinCode', {
                                initialValue: ''
                            })(
                                <Input style={{width:'40%'}}/>
                            )}

                        </FormItem>
                        <FormItem label={(<span className='ant-form-item-required'>{callTr("a_confMember")}</span>)}>
                            <Button type="primary" onClick={this.handleAddMember.bind(this)}>
                                {callTr('a_add')}
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

                <Modal className='importModal confModal' style={{'minHeight':'540px'}} title={callTr('a_addMember')} onOk={this.handleAddModalOk} onCancel={this.handleAddModalCancel}
                       okText={callTr("a_ok")} cancelText={callTr("a_cancel")}  visible={this.state.displayAddModal}>
                    <Tabs className="config-tab" defaultActiveKey="0">
                        <TabPane tab = {this.tr("a_contactlist")} key='0'>
                            <div style={{'width':'90%',margin:'0 auto'}}>
                                <div style={{marginBottom:'15px'}}>
                                    <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} id="search" onChange={this.handleChange.bind(this)} style={{'width':'73%'}} placeholder = {callTr("a_search")}></Input>
                                    <Select id="addsipacct0" className="acctselect" style={{'width':'25%','margin-left':'2%'}}>
                                        <option value="0">SIP</option>
                                        <option value="1">IPVideoTalk</option>
                                        <option value="8">H.323</option>
                                    </Select>
                                </div>
                                <Table
                                    rowSelection={rowSelection}
                                    rowKey = ""
                                    columns = { contactObj.columns }
                                    pagination = { false }
                                    dataSource = { contactObj.data }
                                    showHeader = { false }
                                />
                                <div className = "nodatooltips" style={{display: contactObj.data.length == 0 ? 'block':'none'}}>
                                    <div></div>
                                    <p>{this.tr("no_data")}</p>
                                </div>
                            </div>

                        </TabPane>
                        <TabPane tab = {this.tr("a_concatgroup")} key='1'>
                            tab2
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
    contactsInformation: state.contactsInformation

});

function mapDispatchToProps(dispatch) {
    var actions = {
        get_calllog: Actions.get_calllog,
        getContacts:Actions.getContacts,
        getPresetInfo: Actions.getPresetInfo,
        setschedule: Actions.setschedule
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps ,mapDispatchToProps)(Enhance(NewContactsEdit));
