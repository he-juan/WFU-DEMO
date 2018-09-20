import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import LogactForm from "./diagnosis/logcat";
import SyslogForm from "./diagnosis/syslog";
import TracerouteForm from "./diagnosis/traceroute";
import DebugForm from "./diagnosis/debug"
import DevForm from "./diagnosis/developerMode"
import IpForm from "./diagnosis/ipPing"
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { Form, Layout, Tabs, Input, Icon, Tooltip, Radio, Select, AutoComplete, Button } from "antd";
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

const DiagnosisSyslogForm = Form.create()(SyslogForm);
const DiagnosisLogactForm = Form.create()(LogactForm);
const DiagnosisDebugForm = Form.create()(DebugForm);
const DiagnosisTracerouteForm = Form.create()(TracerouteForm);
const DiagnosisDevForm = Form.create()(DevForm);
const DiagnosisIpForm = Form.create()(IpForm);

class Diagnosis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clearTraceroute:new Function(),
            clearPing:new Function(),
        }
    }

    callback = (key) => {
        window.scrollTo(0,0);
        this.props.jumptoTab(key);
        this.props.setLogcat('');
        this.state.clearTraceroute();
        this.state.clearPing();
        this.props.stop_ping();
    }

    clearTraceroute = (clearTraceroute) => {
         this.setState({clearTraceroute:clearTraceroute})
    }

    clearPing = (clearPing) => {
        this.setState({clearPing:clearPing})
    }



    render() {
        let hideItem = [];
        let tabList =
            <Tabs className="config-tab" activeKey={this.props.activeKey} onChange = {this.callback.bind(this)} style={{'minHeight': this.props.mainHeight}}>
                <TabPane tab={this.tr("a_4144")} key={0}>
                    <DiagnosisSyslogForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                        hideItem={hideItem} tabOrder=""/>
                </TabPane>
                <TabPane tab={this.tr("a_16030")} key={1}>
                    <DiagnosisLogactForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                        hideItem={hideItem} tabOrder=""/>
                </TabPane>
                <TabPane tab={this.tr("a_16031")} key={2}>
                    <DiagnosisDebugForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                        hideItem={hideItem} tabOrder=""/>
                </TabPane>
                <TabPane tab={this.tr("a_16628")} key={3}>
                    <DiagnosisTracerouteForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                        clearTraceroute = {this.clearTraceroute} hideItem={hideItem} tabOrder=""/>
                </TabPane>
                <TabPane tab={this.tr("a_4347")} key={4}>
                    <DiagnosisDevForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey} m_uploading={ this.state.m_uploading } changeMuploading = {this.changeMuploading}
                                    hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={"Ping"} key={4}>
                    <DiagnosisIpForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey} m_uploading={ this.state.m_uploading } changeMuploading = {this.changeMuploading}
                                     clearPing = {this.clearPing} hideItem={hideItem} tabOrder="" />
                </TabPane>
            </Tabs>

        for (var i = 0, j = 0; tabList.props.children[i] != undefined; i++, j++) {
            let hiddenOptions = optionsFilter.getHiddenOptions(j);

            if (hiddenOptions[0] == -1) {
                tabList.props.children.splice(i, 1);
                //handleReqItem.splice(i, 1);
                i--;
            } else {
                tabList.props.children[i].key = i;
                tabList.props.children[i].props.key = i;
                tabList.props.children[i].props.children.props.tabOrder = i;
                tabList.props.children[i].props.children.props.hideItem = hiddenOptions;
            }
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("system_diagnosis")}</div>
                {tabList}
            </Content>
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
        setChangeCurLocale: Actions.setChangeCurLocale,
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        setTabKey: Actions.setTabKey,
        setLogcat: Actions.setLogcat,
        stop_ping:Actions.stop_ping,
        jumptoTab: Actions.jumptoTab
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Diagnosis));
