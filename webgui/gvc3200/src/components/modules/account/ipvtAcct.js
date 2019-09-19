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
        const { ipvtExist } = this.props
        
        let tabList = ipvtExist == '1' ? [
            (hiddenOptions,i) => {
                return<TabPane tab={this.props.callTr("a_16023")} key={i}>
                    <IpvtGeneralForm {...this.props} activeKey={this.props.tab} callTr = {this.props.callTr} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.props.callTr("a_16026")} key={i}>
                    <IpvtCodecFrom {...this.props} activeKey={this.props.tab} callTr = {this.props.callTr}  hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.props.callTr("a_16027")} key={i}>
                    <IpvtSipForm {...this.props} activeKey={this.props.tab} callTr = {this.props.callTr}  hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            }
        ] : [
            (hiddenOptions,i) => {
                return<TabPane tab={this.props.callTr("a_16023")} key={i}>
                    <IpvtGeneralForm {...this.props} activeKey={this.props.tab} callTr = {this.props.callTr} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            }
        ] 
        return <Tabs className="config-tab" activeKey={this.props.tab} size="middle" onChange = {this.handleTabChnage} style={{'minHeight': this.props.mainHeight}}>
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
        </Tabs>;
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
    ipvtExist: state.ipvtExist
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
