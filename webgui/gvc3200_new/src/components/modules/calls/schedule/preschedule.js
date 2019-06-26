import React, {Component, PropTypes} from 'react';
import Enhance from "../../../mixins/Enhance";
import NewConfEdit from "../callsPubModule/newConfEdit"
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm, Form ,Popover,Row,Col} from "antd";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import './schedule.less'
const rowKey = function(record) {
    return record.key;
};
const NewConfEditForm = Form.create()(NewConfEdit)
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
            confdetail:false,
            datefmt:'',
            schedules:[]
        }
    }

    componentDidMount = () => {
        // this.props.get_calllog(0);
        // if(!this.props.confmemberinfodata.length) {
        //     this.props.getAllConfMember()
        // }
        // if(!this.props.preconfdata.length) {
        //     this.props.getPreConf();
        // }
        // if(!this.props.confinfodata.length) {
        //     this.props.getConfInfo()
        // }
        // if(!this.props.contactsAcct.length) {
            // this.props.getAcctStatus((result)=>{
            //     if(!this.isEmptyObject(result)) {
            //         let acctstatus = result.headers;
            //         let max = 16;
            //         if(this.isWP8xx()) max = 2;
            //         for(let i = 0; i < max; i++){
            //             if(acctstatus[`account_${i}_status`] == "1"){
            //                 this.setState({existActiveAccount: true});
            //                 break;
            //             }
            //         }
            //     }
            // });
        // }
        this.props.getItemValues([this.getReqItem("datefmt", "102", "")], (data) => {
           this.setState({'datefmt':data.datefmt})
        })
        this.props.getSchedules(schedules => {
            this.setState({schedules})
        })
        // if(!this.props.presetinfo.length) {
        //     this.props.getPresetInfo()
        // }

    }

    componentWillUnmount = () => {
    }

    updateDate = () => {
        // this.props.getAllConfMember();
        // this.props.getPreConf();
        this.props.getSchedules(schedules => {
            this.setState({schedules})
        })
        // this.props.getConfInfo()
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
       // console.log(event)
        event.stopPropagation( );
        // console.log('text',deleteId,option)
        if(option==1) {
            this.props.get_deleteOnceConf(deleteId, (result) => {
                if (result == 'success') {
                    this.updateDate()
                    this.props.promptMsg('SUCCESS',"a_64");
                } else {
                    this.props.promptMsg('SUCCESS',"a_63");
                }
            });
        } else {
            this.props.get_deleteConf(deleteId, (result) => {
                if (result == 'success') {
                    this.updateDate()
                    this.props.promptMsg('SUCCESS',"a_64");
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

        let confinfo = text
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
      //  console.log(this.tojson(repetRule))
        if(confinfo.Schedulepsw) {
            obj.pinCode = confinfo.Schedulepsw
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
      //  console.log(obj)

        this.props.form.setFieldsValue(obj);
        // console.log('text',text)

        let member = []
        text.Members.forEach((item,i) => {
            member[i] = {
                number:item.Number,
                name:item.name,
                acct:item.Acctid
            }
        })

        this.setState({
            displayNewConfModal: true,
            addNewConf:false,
            confMemberData:member,
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

    convertTimeInfo = (startTime,duration) => {
        // console.log(startTime)
        // startTime = '2019-05-09 23:09'
        let startTimeO = moment(startTime)
        let datefmtObj = {
            '3': 'YYYY/M/D',
            '0': 'YYYY/M/D',
            '1': 'M/D/YYYY',
            '2': 'D/M/YYYY'
        }
        let datefmt = this.state.datefmt
        let endTime = moment(startTime).add(duration,'m')
        let range = ` ${startTimeO.format('HH:mm')} - ${endTime.format('HH:mm')}`
        if(moment().isSame(startTime, 'day')) {
            return this.tr("Today") + range
        } else if(moment().add(1,'d').isSame(startTime, 'day')) {
            return this.tr("Tommorw") + range
        } else if (moment().isSame(startTime, 'year')) {
            return `${moment(startTime).format('MM/DD')}  ${range}`
        } else {
            let format = datefmtObj[datefmt]
            return moment(startTime).format(format)
        }
    }

    handleHideNewConfModal = () => {
        this.setState({displayNewConfModal: false})
    }

    handleNewConf = () => {
        this.setState({
            displayNewConfModal: true,
            addNewConf:true,
            confMemberData:[]
        })
    }

    render() {
        const [confinfodata, callTr, _createTime, isToday, convertTime, logItemdata, view_status_Duration,curContactList] =
            [this.props.confinfodata, this.props.callTr, this.props._createTime, this.props.isToday, this.props.convertTime, this.props.logItemdata, this.props.view_status_Duration, this.state.curContactList];
        // let preconfdata = this.props.preconfdata;
        let stateObj = {
            '3': this.tr('a_9348'),
            '2': this.tr('a_10155'),
            '1':this.tr('a_notstart'),
            '0':this.tr('a_over')
        }
        let schedules = this.state.schedules
        let data = []
        schedules.forEach((item,index) => {
            item.key = 'conf'+index
            if(item.InviteAcct == '') {
                data.push(item)
            }
        })


        // data = []

        // data.
        let loading = true
        let arr = []
        // data.push(schedules[0])
        // data.push(schedules[1])
        // arr.push(schedules[0])

        data = data.sort((a,b) => {
            if (a && b) {
                let a1 = parseInt(a.Confstate)
                let b1 = parseInt(b.Confstate)
                if(a1 == b1 && a1 !=0) {
                    if(a1 == 0) {
                        return 0
                    }
                    return 1
                }
                return  b1- a1
            }
            return 0
        })
        if(data.length > 0) {
            loading = false
        }
        // console.log(data)

        return (
            <div>
                <Button className='btn_addschedule' onClick={this.handleNewConf} type="primary" >
                    {callTr('a_10035')}
                </Button>
                <div className = 'preconflist'>
                    {
                        (data != "" || data.length > 0) && data.map((item) => {
                            return (
                                <div key={item.key} className={'confbox'} onClick={(e)=>this.handleEdit(e,item,true)}>
                                    <Row>
                                        <Col className='conf-label ellips' span={15}>
                                            {item['Recycle'] != '0' && <i className="inlineIcon repeatIcon" />}
                                            {item.Displayname}
                                        </Col>
                                        {/* <Col span={12}>{item.Starttime}</Col> */}
                                        <Col className='conf-status' span={9}>
                                        <span className={'statecolor' + item.Confstate}>{stateObj[item.Confstate]}</span>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='conf-label' span={3}>{callTr('a_10056')}：</Col>
                                        <Col className='ellips conf-text' span={12}>{this.convertTimeInfo(item.Starttime,item.Duration)}</Col>
                                        <Col className='conf-status' span={9}></Col>
                                    </Row>
                                    {/* <Row>
                                        <Col className='conf-label' span={3}>{callTr('a_3501')}：</Col>
                                        <Col className='' span={12}>{item.Duration / 60}{callTr('a_15008')}</Col>
                                        <Col className='conf-status' span={9}></Col>
                                    </Row> */}
                                    {/* <Row>
                                        <Col className='conf-label' span={3}>{callTr('a_10055')}：</Col>
                                        <Col className='' span={12}>{item.Host == 1? callTr('a_10057'): htmlEncode(item.Host)}</Col>
                                        <Col className='conf-status' span={9}></Col>
                                    </Row> */}
                                    <Row>
                                        <Col className='conf-label' span={3}>{callTr('a_10055')}：</Col>
                                        <Col className='ellips conf-text' span={9}>{item.Host == 1? callTr('a_10057'): htmlEncode(item.Host)}</Col>
                                        {item.Confstate != '3' ?
                                            <Col className='conf-status' span={12}>
                                            <Button type="primary" style={{background:'#4bd66a',borderColor:'#4bd66a'}}>{callTr("a_19623")}</Button>
                                            <Button
                                                // onClick={this.handleEdit.bind(this, item)}
                                                onClick={(e)=>this.handleEdit(e,item)} type="primary" >{callTr("a_19624")}</Button>
                                            {/*<Button type="primary">{callTr("a_cancelMeet")}</Button>*/}

                                            {item['Recycle'] == '0' ? (
                                                <Popconfirm placement="top" title={callTr("a_9334")} okText={callTr("a_2")} cancelText={callTr("a_3")} onConfirm={(e)=>this.handleOkDelete(e,item.Id)}>
                                                    {/*<button className='allow-delete'></button>*/}
                                                    <Button className='cancel_btn' onClick={(e)=>this.cancelPop(e)} type="primary">{callTr("a_19625")}</Button>
                                                </Popconfirm>
                                            ) : (
                                                <Popover title={callTr('a_10160')} content={
                                                    <div>
                                                        <p onClick={(e)=>this.handleOkDelete(e,item.Id,1)} >{callTr('a_cancelConf')}</p>
                                                        <p onClick={(e)=>this.handleOkDelete(e,item.Id)} >{callTr('a_cancelConfAll')}</p>
                                                    </div>
                                                } trigger="click">
                                                    <Button className='cancel_btn' onClick={(e)=>this.cancelPop(e)} type="primary">{callTr("a_19625")}</Button>
                                                </Popover>
                                            )}


                                            {/*<Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>*/}

                                        </Col>
                                        :
                                        <Col className='conf-status' span={12}/>
                                        }

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
                    { data.length > 0 ?
                        null:
                        <div className = "nodata_tip">
                            <div className="nodata"></div>
                            <p>
                                {this.tr('a_noConf_try')}&nbsp;
                                <span onClick={this.props.handleNewConf}>{`"${this.tr('a_10035')}"`}</span>
                            </p>
                        </div>
                    }
                </div>
                {
                    !loading ? <NewConfEditForm {...this.props} callTr={this.props.callTr}
                                              handleHideNewConfModal= {this.handleHideNewConfModal}
                                              updateDate = {this.updateDate}
                                              displayNewConfModal={this.state.displayNewConfModal}
                                              confMemberData={this.state.confMemberData}
                                              addNewConf={this.state.addNewConf}
                                              editConfData = {this.state.editConfData}
                                              confSubject = {this.state.confSubject}
                                              confdetail = {this.state.confdetail}/>
                        : null
                }


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
    contactsAcct: state.contactsAcct,
    confinfodata:state.confinfodata

})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        get_calllog: Actions.get_calllog,
        getAcctStatus:Actions.getAcctStatus,
        get_deleteCall: Actions.get_deleteCall,
        getContacts:Actions.getContacts,
        getGroups:Actions.getGroups,
        getTonelist:Actions.getTonelist,
        setContacts:Actions.setContacts,
        getContactsinfo:Actions.getContactsinfo,
        getAllConfMember:Actions.getAllConfMember,
        get_deleteCallConf:Actions.get_deleteCallConf,
        getPreConf:Actions.getPreConf,
        getConfInfo:Actions.getConfInfo,
        get_deleteConf:Actions.get_deleteConf,
        get_deleteOnceConf:Actions.get_deleteOnceConf,
        getSchedules:Actions.getSchedules
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Call));
