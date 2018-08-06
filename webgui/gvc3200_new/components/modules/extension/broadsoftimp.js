import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import LoginForm from "./broadsoftimp/LoginForm.js";
import ImpForm from "./broadsoftimp/ImpForm.js";
import {Layout, Tabs, Form} from "antd";
import * as optionsFilter from "../../template/optionsFilter";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;

const BroadsoftLoginForm = Form.create()(LoginForm);
const BroadsoftImpForm = Form.create()(ImpForm);

class Broadsoftimp extends Component {
    constructor(props){
        super(props);
    }

    onChange = (key) => {
        window.scrollTo(0,0);
        this.props.jumptoTab(key);
    }

    render(){
        let hideItem = [];
        let tabList =
            <Tabs className="config-tab" className="config-tab" activeKey={this.props.activeKey} onChange={this.onChange} style={{'min-height': this.props.mainHeight}}>
                <TabPane tab={this.tr("a_logincre")} key={0}>
                    <BroadsoftLoginForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}  hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("a_impsettings")} key={1}>
                    <BroadsoftImpForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr} hideItem={hideItem} tabOrder="" />
                </TabPane>
            </Tabs>

        for (var i = 0; i < tabList.props.children.length; i++) {
            let hiddenOptions = optionsFilter.getHiddenOptions(i);
            if (hiddenOptions[0] == -1) {
                tabList.props.children.splice(i, 1);
            } else {
                tabList.props.children[i].key = i;
                tabList.props.children[i].props.key = i;
                tabList.props.children[i].props.children.props.tabOrder = i;
                tabList.props.children[i].props.children.props.hideItem = hiddenOptions;
            }
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">BroadSoft IM&P</div>
                {tabList}
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues:Actions.getItemValues,
      setItemValues:Actions.setItemValues,
      jumptoTab: Actions.jumptoTab
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Broadsoftimp));
