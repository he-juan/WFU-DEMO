import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import SwitchForm from "./switch/switchForm";
import TimeForm from "./switch/timeForm";
import {Layout, Tabs, Form} from "antd";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const TabPane = Tabs.TabPane;

const SwitchBasicForm = Form.create()(SwitchForm);
const SwitchTimeForm = Form.create()(TimeForm);
class Switch extends Component {
    constructor(props){
        super(props);
    }

    onChange = (key) => {
        window.scrollTo(0,0);
        this.props.jumptoTab(key);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(this.props.curLocale != nextProps.curLocale) {
            return true
        }
        let curItemValues = [],nextItemValues = []
        for(let key in this.props.itemValues) {
            curItemValues.push(this.props.itemValues[key])
        }
        for(let key in nextItemValues.itemValues) {
            nextItemValues.push(nextItemValues.itemValues[key])
        }
        if (curItemValues.length != nextItemValues.length) {
            return true
        }
        let result = curItemValues.some((curItem,index,arr) => {
            return curItem != nextItemValues[index]
        })
        return result
    }

    render(){
        let hideItem = [];
        let tabList =
            <Tabs className="config-tab" activeKey={this.props.activeKey} style={{'minHeight': this.props.mainHeight,'minWidth':'1035px'}} onChange={this.onChange}>
                <TabPane tab={this.tr("advanced_switchSetting")} key={0}>
                    <SwitchBasicForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr} hideItem={hideItem}></SwitchBasicForm>
                </TabPane>
                <TabPane tab={this.tr("advanced_switchTime")} key={1}>
                    <SwitchTimeForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr} hideItem={hideItem}></SwitchTimeForm>
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
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_switch")}</div>
                {tabList}
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues:state.itemValues,
    product: state.product,
    mainHeight: state.mainHeight,
    contactsAcct: state.groupInformation,
    msgsContacts:state.msgsContacts,
    activeKey: state.TabactiveKey,
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        promptMsg:Actions.promptMsg,
        setItemValues:Actions.setItemValues,
        getItemValues:Actions.getItemValues,
        getContacts:Actions.getContacts,
        getTonelist: Actions.getTonelist,
        getTonelistAll:Actions.getTonelistAll,
        jumptoTab: Actions.jumptoTab,
        cb_ping: Actions.cb_ping,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Switch));
