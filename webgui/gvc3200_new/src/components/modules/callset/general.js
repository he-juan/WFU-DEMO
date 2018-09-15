import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import GeneralForm from "./general/GeneralForm.js";
import GuestForm from "./general/GuestForm.js";
import SipDomainForm from './general/SipDomainForm.js';
import {Layout, Tabs, Form} from "antd";
import * as optionsFilter from "../../template/optionsFilter.js";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;

const CallsetGeneralForm = Form.create()(GeneralForm);
const CallsetGuestForm = Form.create()(GuestForm);
const CallsetSipDomainForm = Form.create()(SipDomainForm);

class General extends Component {
    constructor(props){
        super(props);
    }

    componentWillUpdate = () => {
        const form = this.form;
        form.resetFields();
    }

    onChange = (key) => {
        window.scrollTo(0, 0);
        this.props.jumptoTab(key);
    }

    saveFormRef = (form) => {
        this.form = form;
    }

    render(){
        let hideItem = [];
        let tabList =
            <Tabs className="config-tab" activeKey={this.props.activeKey} onChange={this.onChange} style={{'min-height': this.props.mainHeight}}>
                <TabPane tab={this.tr("a_16597")} key={0}>
                    <CallsetGeneralForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                        hideItem={hideItem} tabOrder="" ref={this.saveFormRef} />
                </TabPane>
                <TabPane tab={this.tr("a_guestset")} key={1}>
                    <CallsetGuestForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                        hideItem={hideItem} tabOrder="" ref={this.saveFormRef} />
                    <CallsetSipDomainForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} />
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
                if(i == 1){
                    tabList.props.children[i].props.children[0].props.tabOrder = i;
                    tabList.props.children[i].props.children[0].props.hideItem = hiddenOptions;
                }else{
                    tabList.props.children[i].props.children.props.tabOrder = i;
                    tabList.props.children[i].props.children.props.hideItem = hiddenOptions;
                }
            }
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_16023")}</div>
                {tabList}
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    product: state.product,
    userType: state.userType,
    maxAcctNum: state.maxAcctNum,
    activeKey: state.TabactiveKey
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues: Actions.getItemValues,
      setItemValues: Actions.setItemValues,
      promptMsg: Actions.promptMsg,
      putNvrams: Actions.putNvrams,
      jumptoTab: Actions.jumptoTab
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(General));
