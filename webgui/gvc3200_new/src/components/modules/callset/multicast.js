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
        let tabList =[
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_multipaging")} key={i}>
                    <MulticastSettingForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr}
                                          activeKey={this.props.activeKey} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_multicastlisten")} key={i}>
                    <MulticastListenerForm {...this.props} callTr={this.tr} activeKey={this.props.activeKey}
                                           hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            }
        ]
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_multipaging")}</div>
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
