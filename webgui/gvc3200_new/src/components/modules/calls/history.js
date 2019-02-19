import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import {Layout, Tabs, Popconfirm, Modal, Input, message, Form,Spin} from "antd";
import * as Actions from '../../redux/actions/index';
import { bindActionCreators } from 'redux';
import {  connect } from 'react-redux';
import * as optionsFilter from "../../template/optionsFilter";
import Call from "./history/call";
import MissedCall from "./history/missedcall";

const Content = Layout;
const TabPane = Tabs.TabPane;
const CallForm = Form.create()(Call);
const MissedCallForm = Form.create()(MissedCall);

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    callback = (key) => {
        window.scrollTo(0, 0);
        this.props.jumptoTab(key);
    }

    componentDidMount = () => {
        if(!this.props.contactsInformation.length) {
            this.props.getContacts()
        }
        if(!this.props.contactinfodata.length) {
            this.props.getContactsinfo();
        }
        // if(!this.props.callnameinfo.length) {
        //     this.props.getNormalCalllogNames()
        // }
        // if(!this.props.confmemberinfodata.length) {
        //     this.props.getAllConfMember()
        // }
        this.props.get_calllog(0);
        this.props.getNormalCalllogNames()
        this.props.getAllConfMember()


    }

    isYestday = (theDate) => {
        var date = (new Date());    //当前时间
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
        var yestday = new Date(today - 24*3600*1000).getTime();
        return theDate.getTime() < today && yestday <= theDate.getTime();
    }

    isToday = (str) => {
        var value;
        var isYtd;
        if (new Date(str).toDateString() === new Date().toDateString()) {
           value = "Today";
       }else if (new Date(str) < new Date()){
           value = (this.isYestday(new Date(str))) ? "Yestday" : "Before";
       }
       return value;
    }

    _createTime = (text, record, index) => {
        var Timevalue = this.convertTime(text);
        return Timevalue;
    }

    render() {
        // let logItemdata = this.props.logItemdata
        // let confmember = this.props.confmemberinfodata
        // let contactList = this.props.contactsInformation
        // let callnameinfo = this.props.callnameinfo
        let loading = false
        // console.log(confmember,contactList,callnameinfo)
        // if (!confmember.length || !contactList.length || !callnameinfo.length) {
        //     loading = true
        // }
        // if(logItemdata.length > 0) {
        //     loading = false
        // }
        let tabList =[
            (hiddenOptions,i) => {
                return<TabPane tab = {this.tr("a_10009")} key={i}>
                    <CallForm {...this.props} hideItem={hiddenOptions} tabOrder={i} loading = {loading} view_status_Duration = {this.view_status_Duration} _createTime={this._createTime} convertTime={this.convertTime} isToday={this.isToday} callTr={this.tr} getReqItem = {this.getReqItem} activeKey={this.state.activeKey} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab = {this.tr("a_3524")} key={i}>
                    <MissedCallForm {...this.props} hideItem={hiddenOptions} tabOrder={i} loading = {loading} view_status_Duration = {this.view_status_Duration} _createTime={this._createTime} convertTime={this.convertTime} isToday={this.isToday} callTr={this.tr} getReqItem = {this.getReqItem} activeKey={this.state.activeKey} />
                </TabPane>
            }
        ]
        return (
            <div>
                <Content className="content-container config-container">
                    <div className="subpagetitle">{this.tr("a_3536")}</div>
                    <Tabs className="config-tab" activeKey={this.props.activeKey} onChange = {this.callback.bind(this)} style = {{'minHeight':this.props.mainHeight}}>
                        {
                            tabList.map((item,index)=>{
                                let hiddenOptions = optionsFilter.getHiddenOptions(index)
                                if (hiddenOptions[0] == -1) {
                                    return null
                                }else{
                                    return item(hiddenOptions,index.toString())
                                }
                            })
                        }
                    </Tabs>
                </Content>
                <div className='load-modal' style={{display: loading ? 'block':'none'}}>
                    <Spin className='spin-style' size="large" />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    activeKey: state.TabactiveKey,
    userType: state.userType,
    logItemdata: state.logItemdata,
    contactinfodata: state.contactinfodata,
    confmemberinfodata: state.confmemberinfodata,
    contactsInformation: state.contactsInformation,
    callnameinfo:state.callnameinfo
})

function mapDispatchToProps(dispatch) {
    var actions = {
        jumptoTab: Actions.jumptoTab,
        getItemValues:Actions.getItemValues,
        promptMsg:Actions.promptMsg,
        get_calllog: Actions.get_calllog,
        getContacts:Actions.getContacts,
        getContactsinfo:Actions.getContactsinfo,
        getAllConfMember:Actions.getAllConfMember,
        getNormalCalllogNames:Actions.getNormalCalllogNames

    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(History));
