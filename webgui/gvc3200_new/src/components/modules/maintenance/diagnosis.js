import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import LogactForm from "./diagnosis/logcat";
import SyslogForm from "./diagnosis/syslog";
import TracerouteForm from "./diagnosis/traceroute";
import DebugForm from "./diagnosis/debug"
import DevForm from "./diagnosis/developerMode"
import IpForm from "./diagnosis/ipPing"
import nslookupForm from "./diagnosis/nslookup"
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
const DiagnosisnsLookupForm = Form.create()(nslookupForm);

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

    componentDidMount = () => {
        this.props.getNetworkStatus()
    }


    render() {
        let tabList =[
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_4144")} key={i}>
                    <DiagnosisSyslogForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                                         hideItem={hiddenOptions} tabOrder={i}/>
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_16030")} key={i}>
                    <DiagnosisLogactForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                                         hideItem={hiddenOptions} tabOrder={i}/>
                </TabPane>
            },
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_16031")} key={i}>
                    <DiagnosisDebugForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                                        hideItem={hiddenOptions} tabOrder={i}/>
                </TabPane>
            },
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_16628")} key={i}>
                    <DiagnosisTracerouteForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                                             clearTraceroute = {this.clearTraceroute} hideItem={hiddenOptions} tabOrder={i}/>
                </TabPane>
            },
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_4347")} key={i}>
                    <DiagnosisDevForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey} m_uploading={ this.state.m_uploading } changeMuploading = {this.changeMuploading}
                                      hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            },
            (hiddenOptions,i) => {
                return<TabPane tab={"Ping"} key={i}>
                    <DiagnosisIpForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey} m_uploading={ this.state.m_uploading } changeMuploading = {this.changeMuploading}
                                     clearPing = {this.clearPing} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            },
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_19814")} key={i}>
                    <DiagnosisnsLookupForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                                           hideItem={hiddenOptions} tabOrder={i}/>
                </TabPane>
            }
        ]

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("system_diagnosis")}</div>
                <Tabs className="config-tab" activeKey={this.props.activeKey} onChange = {this.callback.bind(this)} style={{'minHeight': this.props.mainHeight}}>
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
        setLogcat: Actions.setLogcat,
        stop_ping:Actions.stop_ping,
        jumptoTab: Actions.jumptoTab,
        getNetworkStatus: Actions.getNetworkStatus
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Diagnosis));
