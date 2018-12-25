import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import LoginForm from "./broadsoftimp/LoginForm.js";
import ImpForm from "./broadsoftimp/ImpForm.js";
import {Layout, Tabs, Form} from "antd";
import * as optionsFilter from "../../template/optionsFilter";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;

const BroadsoftLoginForm = Form.create()(LoginForm);
const BroadsoftImpForm = Form.create()(ImpForm);

class Broadsoftimp extends Component {
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
                return<TabPane tab={this.tr("a_logincre")} key={i}>
                    <BroadsoftLoginForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr}  hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_impsettings")} key={i}>
                    <BroadsoftImpForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr} callTipsTr={this.tips_tr} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            }
        ]

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">BroadSoft IM&P</div>
                <Tabs className="config-tab" className="config-tab" activeKey={this.props.activeKey} onChange={this.onChange} style={{minHeight: this.props.mainHeight}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Broadsoftimp));
