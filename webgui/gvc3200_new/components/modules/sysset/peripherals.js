import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import LcdLedForm from "./peripherals/LcdLedForm.js";
import InterfaceForm from "./peripherals/InterfaceForm.js"
import VoiceForm from "./peripherals/VoiceForm.js";
import GestureForm from "./peripherals/GestureForm.js";
import {Layout, Tabs, Form} from "antd";
import * as optionsFilter from "../../template/optionsFilter";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;

const PeriLcdLedForm = Form.create()(LcdLedForm);
const PeriInterfaceForm = Form.create()(InterfaceForm);
const PeriVoiceForm = Form.create()(VoiceForm);
const PeriGestureForm = Form.create()(GestureForm);

class Peripherals extends Component {
    constructor(props){
        super(props);
    }

    onChange = (key) => {
        window.scrollTo(0,0);
        this.props.jumptoTab(key);
    }

    render(){
        let tmptitle = "a_lcdledmanage";
        if(this.props.product == "GAC2510" || this.isWP8xx())
            tmptitle = "a_ledmanage";

        let hideItem = [];
        let tabList =
            <Tabs className="config-tab" activeKey={this.props.activeKey} onChange={this.onChange} style={{'minHeight': this.props.mainHeight}}>
                <TabPane tab={this.tr(tmptitle)} key={0}>
                    <PeriLcdLedForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("a_perinterface")} key={1}>
                    <PeriInterfaceForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                        hideItem={hideItem} tabOrder=""  />
                </TabPane>
                <TabPane tab={this.tr("a_voicectrl")} key={2}>
                    <PeriVoiceForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("a_gesture")} key={3}>
                    <PeriGestureForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
            </Tabs>

        /* i: the array index of tabList
           j: the index in template.js */
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
                <div className="subpagetitle">{this.tr("cpnt_peripheral")}</div>
                {tabList}
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    product: state.product,
    activeKey: state.TabactiveKey,
    userType: state.userType
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues: Actions.getItemValues,
      setItemValues: Actions.setItemValues,
      updateLights: Actions.updateLights,
      jumptoTab: Actions.jumptoTab
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Peripherals));
