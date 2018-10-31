import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import {Layout, Tabs, Popconfirm, Modal, Input, message, Form, Button} from "antd";
import * as Actions from '../../redux/actions/index';
import { bindActionCreators } from 'redux';
import {  connect } from 'react-redux';
import * as optionsFilter from "../../template/optionsFilter";
import PreShedule from "./schedule/preschedule";
import Schdule_History from "./schedule/schedule_history";
import NewConfEdit from "./callsPubModule/newConfEdit"

const Content = Layout;
const TabPane = Tabs.TabPane;
const ScheduleForm = Form.create()(PreShedule);
const HistoryForm = Form.create()(Schdule_History);
const NewConfEditForm = Form.create()(NewConfEdit)

class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayNewConfModal: false,
            confMemberData:[],
            addNewConf:false
        }
    }

    callback = (key) => {
        window.scrollTo(0, 0);
        this.props.jumptoTab(key);
    }

    updateDate = () => {
        this.props.getAllConfMember();
        this.props.getPreConf();
        this.props.getConfInfo()
    }

    componentDidMount = () => {

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
        const callTr = this.tr;
        let hideItem = [];
        let tabList =
            <Tabs className="config-tab" activeKey={this.props.activeKey} onChange = {this.callback.bind(this)} style = {{'minHeight':this.props.mainHeight}}>
                <TabPane tab = {this.tr("a_10011")} key={0}>
                    <ScheduleForm {...this.props} hideItem={hideItem} view_status_Duration = {this.view_status_Duration} _createTime={this._createTime} convertTime={this.convertTime} isToday={this.isToday} callTr={this.tr} getReqItem = {this.getReqItem} activeKey={this.state.activeKey} />
                </TabPane>
                <TabPane tab = {this.tr("history_all")} key={1}>
                    <HistoryForm {...this.props} hideItem={hideItem} view_status_Duration = {this.view_status_Duration} _createTime={this._createTime} convertTime={this.convertTime} isToday={this.isToday} callTr={this.tr} getReqItem = {this.getReqItem} activeKey={this.state.activeKey} />
                </TabPane>
            </Tabs>

        for (var i = 0, j = 0; tabList.props.children[i] != undefined; i++, j++) {
            let hiddenOptions = optionsFilter.getHiddenOptions(j);

            if (hiddenOptions[0] == -1) {
                tabList.props.children.splice(i, 1);
                i--;
            } else {
                tabList.props.children[i].key = i;
                tabList.props.children[i].props.key = i;
                tabList.props.children[i].props.children.props.tabOrder = i;
                tabList.props.children[i].props.children.props.hideItem = hiddenOptions;
            }
        }

        return (
            <div>
                <Content className="content-container config-container">
                    <div className="subpagetitle">{this.tr("a_10011")}</div>
                    <Button className='btn_addschedule' onClick={this.handleNewConf} type="primary" >
                        {callTr('a_10035')}
                    </Button>
                    {tabList}
                </Content>
                <NewConfEditForm {...this.props} callTr={callTr}
                                handleHideNewConfModal= {this.handleHideNewConfModal}
                                updateDate = {this.updateDate}
                                displayNewConfModal={this.state.displayNewConfModal}
                                confMemberData={this.state.confMemberData}
                                addNewConf={this.state.addNewConf}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    activeKey: state.TabactiveKey,
    userType: state.userType
})

function mapDispatchToProps(dispatch) {
    var actions = {
        jumptoTab: Actions.jumptoTab,
        getItemValues:Actions.getItemValues,
        promptMsg:Actions.promptMsg,
        getAllConfMember:Actions.getAllConfMember,
        getPreConf:Actions.getPreConf,
        getConfInfo:Actions.getConfInfo
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(History));
