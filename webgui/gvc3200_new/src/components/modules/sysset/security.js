import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import RmtacsForm from "./security/RmtacsForm.js";
import UserinfoForm from "./security/UserinfoForm.js";
import SiptlsForm from "./security/SiptlsForm.js";
import CertificateForm from "./security/CertificateForm.js";
import ScreenLockForm from './security/ScreenLockForm'
import {Layout, Tabs, Form} from "antd";
import * as optionsFilter from "../../template/optionsFilter.js";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;

const SecurityRmtacsForm = Form.create()(RmtacsForm);
const SecurityUserinfoForm = Form.create()(UserinfoForm);
const SecuritySiptlsForm = Form.create()(SiptlsForm);
const SecurityCertificateForm = Form.create()(CertificateForm);
const SecurityScreenLockForm = Form.create()(ScreenLockForm);
let tabList;

class Security extends Component {
    constructor(props){
        super(props);
    }

    onChange = (key) => {
        window.scrollTo(0,0);
        this.props.jumptoTab(key);
    }

    render(){
        let tabList =[
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_16029")} key={i} tabName="remoteaccess">
                    <SecurityRmtacsForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                                        hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_19806")} key={i} tabName="userinfo">
                    <SecurityUserinfoForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                                          hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_19806")} key={i} tabName="userinfo">
                    <SecurityUserinfoForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                                          hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_19806")} key={i} tabName="userinfo">
                    <SecurityUserinfoForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                                          hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_19806")} key={i} tabName="userinfo">
                    <SecurityUserinfoForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                                          hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            }
        ]
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_4221")}</div>
                <Tabs className="config-tab" activeKey={this.props.activeKey} onChange={this.onChange} style={{minHeight: this.props.mainHeight}}>
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
    activeKey: state.TabactiveKey,
    mainHeight: state.mainHeight,
    userType: state.userType
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues: Actions.getItemValues,
      setItemValues: Actions.setItemValues,
      jumptoTab: Actions.jumptoTab,
      promptMsg:Actions.promptMsg,
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Security));
