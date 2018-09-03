import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import GeneralForm from "./mpk/general";
import MpkForm from "./mpk/mpk";
import {Layout, Tabs, Form} from "antd";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const TabPane = Tabs.TabPane;

const SysappGeneralForm = Form.create()(GeneralForm);
const SysappMpkForm = Form.create()(MpkForm);

class Mpk extends Component {
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
            <Tabs className="config-tab" activeKey={this.props.activeKey} style={{'minHeight': this.props.mainHeight}} onChange={this.onChange}>
                <TabPane tab={this.tr("advanced_mpkset")} key="1">
                    <SysappMpkForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("advanced_eventlist")} key="2">
                    <SysappGeneralForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} hideItem={hideItem} tabOrder="" />
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
                <div className="subpagetitle">{this.tr("sysapp_mpk")}</div>
                {tabList}
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues:state.itemValues,
    product: state.product,
    ipvtExist: state.ipvtExist,
    mainHeight: state.mainHeight,
    enterSave: state.enterSave,
    userType: state.userType,
    activeKey: state.TabactiveKey,
    maxAcctNum: state.maxAcctNum,
    oemId: state.oemId,
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        setItemValues:Actions.setItemValues,
        getItemValues:Actions.getItemValues,
        getBlf:Actions.getBlf,
        cb_ping: Actions.cb_ping,
        promptMsg: Actions.promptMsg,
        check_mpk_exist: Actions.check_mpk_exist,
        get_blf_delete:Actions.get_blf_delete,
        jumptoTab: Actions.jumptoTab,
        updateMpkOrder:Actions.updateMpkOrder,
        putmpkext:Actions.putmpkext
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Mpk));
