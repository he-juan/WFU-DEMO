import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import SettingForm from "./multicast/SettingForm.js";
import ListenerForm from "./multicast/ListenerForm.js";
import {Layout, Tabs, Form} from "antd";
import * as optionsFilter from "../../template/optionsFilter.js";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;

const MulticastSettingForm = Form.create()(SettingForm);
const MulticastListenerForm = Form.create()(ListenerForm);

class Multicast extends Component {
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
            <Tabs className="config-tab" activeKey={this.props.activeKey} onChange={this.onChange} style={{'min-height': this.props.mainHeight}}>
                <TabPane tab={this.tr("a_multipaging")} key={0}>
                    <MulticastSettingForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr}
                        activeKey={this.props.activeKey} hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("a_multicastlisten")} key={1}>
                    <MulticastListenerForm {...this.props} callTr={this.tr} activeKey={this.props.activeKey}
                        hideItem={hideItem} tabOrder="" />
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
                <div className="subpagetitle">{this.tr("a_multipaging")}</div>
                {tabList}
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    product: state.product,
    mainHeight: state.mainHeight,
    userType: state.userType,
    activeKey: state.TabactiveKey
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues: Actions.getItemValues,
      setItemValues: Actions.setItemValues,
      jumptoTab: Actions.jumptoTab
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Multicast));
