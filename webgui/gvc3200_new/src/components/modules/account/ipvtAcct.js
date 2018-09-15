import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import GeneralForm from "./ipvtAccount/general";
import CallForm from "./ipvtAccount/call";
import CodecFrom from "./ipvtAccount/codec"
import {Layout, Tabs, Form} from "antd";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const TabPane = Tabs.TabPane;

const IpvtGeneralForm = Form.create()(GeneralForm);
const IpvtSipForm = Form.create()(CallForm);
const IpvtCodecFrom = Form.create()(CodecFrom);

class SlidingTabsDemo extends Component {
    constructor(props){
        super(props);
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

    handleTabChnage = (ActiveKey) => {
        window.scrollTo(0,0);
        this.props.jumptoTab(ActiveKey);
    }

    render() {
        let hideItem = [];
        let tabList =
                <Tabs className="config-tab" activeKey={this.props.tab} size="middle" onChange = {this.handleTabChnage} style={{'minHeight': this.props.mainHeight}}>
                    <TabPane tab={this.props.callTr("a_16023")} key={0}>
                        <IpvtGeneralForm {...this.props} activeKey={this.props.tab} callTr = {this.props.callTr} hideItem={hideItem} tabOrder="" />
                    </TabPane>
                    <TabPane tab={this.props.callTr("a_16026")} key={1}>
                        <IpvtCodecFrom {...this.props} activeKey={this.props.tab} callTr = {this.props.callTr}  hideItem={hideItem} tabOrder="" />
                    </TabPane>
                    <TabPane tab={this.props.callTr("a_16027")} key={2}>
                        <IpvtSipForm {...this.props} activeKey={this.props.tab} callTr = {this.props.callTr}  hideItem={hideItem} tabOrder="" />
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

        return tabList;
    }
}

class IpvtAcct extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">IPVideoTalk</div>
                <SlidingTabsDemo {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} callIsEmptyObject={this.isEmptyObject} />
            </Content>
        )
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    mainHeight: state.mainHeight,
    userType: state.userType,
    tab: state.TabactiveKey,
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        jumptoTab: Actions.jumptoTab
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(IpvtAcct))
