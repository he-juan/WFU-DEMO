import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import GeneralForm from "./wifi/GeneralForm.js";
import SecurityForm from "./wifi/SecurityForm.js"
import MoreForm from "./wifi/MoreForm.js";
import RoamingForm from "./wifi/RoamingForm.js";
import {Layout, Tabs, Form} from "antd";
import * as optionsFilter from "../../template/optionsFilter";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;

const WifiGeneralForm = Form.create()(GeneralForm);
const WifiSecurityForm = Form.create()(SecurityForm);
const WifiMoreForm = Form.create()(MoreForm);
const WifiRoamingForm = Form.create()(RoamingForm);

class Wifi extends Component {
    constructor(props){
        super(props);
    }

    onChange = (key) => {
        window.scrollTo(0,0);
        this.props.jumptoTab(key);
    }

    render(){
        let tabList =[
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_wifinormal")} key={i}>
                    <WifiGeneralForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_wifiauth")} key={i}>
                    <WifiSecurityForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_4101")} key={i}>
                    <WifiMoreForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_wifiroaming")} key={i}>
                    <WifiRoamingForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            }
        ]
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_4314")}</div>
                <Tabs className="config-tab" activeKey={this.props.activeKey} onChange={this.onChange} style={{minHeight: this.props.mainHeight}}>
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
                </Tabs>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    activeKey: state.TabactiveKey
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues:Actions.getItemValues,
      setItemValues:Actions.setItemValues,
      jumptoTab: Actions.jumptoTab,
      getCounCodeStatus: Actions.getCounCodeStatus
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Wifi));
