import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import XsiForm from "./broadsoftcontact/XsiForm.js";
import NetListForm from "./broadsoftcontact/NetListForm.js";
import {Layout, Tabs, Form} from "antd";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const TabPane = Tabs.TabPane;

const BroadsoftXsiForm = Form.create()(XsiForm);
const BroadsoftNetListForm = Form.create()(NetListForm);

class Broadsoftcontact extends Component {
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
                <TabPane tab={this.tr("a_xsiset")} key={0}>
                    <BroadsoftXsiForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr}
                        callTipsTr={this.tips_tr} hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("a_netdir")} key={1}>
                    <BroadsoftNetListForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr}
                        callTipsTr={this.tips_tr} hideItem={hideItem} tabOrder="" />
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
                <div className="subpagetitle">{this.tr("maintenance_broadsoft")}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Broadsoftcontact));
