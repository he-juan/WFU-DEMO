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
        let tabList =[
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_xsiset")} key={i}>
                    <BroadsoftXsiForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr}
                                      callTipsTr={this.tips_tr} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_netdir")} key={i}>
                    <BroadsoftNetListForm {...this.props} activeKey={this.props.activeKey} callTr={this.tr}
                                          callTipsTr={this.tips_tr} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            }
        ]
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("maintenance_broadsoft")}</div>
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
