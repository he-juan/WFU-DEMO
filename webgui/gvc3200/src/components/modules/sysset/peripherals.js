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

        let tabList =[
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr(tmptitle)} key={i}>
                    <PeriLcdLedForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                                    hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_perinterface")} key={i}>
                    <PeriInterfaceForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                                       hideItem={hiddenOptions} tabOrder={i}  />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_perinterface")} key={i}>
                    <PeriInterfaceForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                                       hideItem={hiddenOptions} tabOrder={i}  />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_perinterface")} key={i}>
                    <PeriInterfaceForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}
                                       hideItem={hiddenOptions} tabOrder={i}  />
                </TabPane>
            }
        ]

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("cpnt_peripheral")}</div>
                <Tabs className="config-tab" activeKey={this.props.activeKey} onChange={this.onChange} style={{'minHeight': this.props.mainHeight}}>
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
