import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import RmtacsForm from "./security/RmtacsForm.js";
import UserinfoForm from "./security/UserinfoForm.js";
import SiptlsForm from "./security/SiptlsForm.js";
import CertificateForm from "./security/CertificateForm.js";
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
        let hideItem = [];
        tabList =
            <Tabs className="config-tab" activeKey={this.props.activeKey} onChange={this.onChange} style={{'min-height': this.props.mainHeight}}>
                <TabPane tab={this.tr("maintenance_web")} key={0} tabName="remoteaccess">
                    <SecurityRmtacsForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("a_userinfo")} key={1} tabName="userinfo">
                    <SecurityUserinfoForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab="SIP TLS" key={2} tabName="siptls">
                    <SecuritySiptlsForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("a_certmanage")} key={3} tabName="certificate">
                    <SecurityCertificateForm {...this.props} callTr={this.tr} hideItem={hideItem} tabOrder="" />
                </TabPane>
            </Tabs> ;

        for (let i = 0, j = 0; tabList.props.children[i] != undefined; i++, j++) {
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
                <div className="subpagetitle">{this.tr("security_set")}</div>
                {tabList}
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
