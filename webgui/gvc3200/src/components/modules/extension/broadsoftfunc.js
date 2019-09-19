import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import CallForm from "./broadsoftfunc/CallForm.js";
import ScaForm from "./broadsoftfunc/ScaForm.js";
import {Layout, Tabs, Form, Icon} from "antd";
import * as optionsFilter from "../../template/optionsFilter";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;

const BroadsoftCallForm = Form.create()(CallForm);
const BroadsoftScaForm = Form.create()(ScaForm);

class Broadsoftfunc extends Component {
    constructor(props){
        super(props);

        this.state = {
            activeAcct : "1",
            callctrdisable: true,
        }
    }

    onChange = (type, key) => {
        window.scrollTo(0,0);
        if(type == 1){
            this.setState({activeAcct: key});
        }else{
            this.props.jumptoTab(key);
        }
    }

    onTabClick = () => {
        $(".ant-tabs-content").addClass("animated backgroundChange").show();
        setTimeout(function () {
            $(".ant-tabs-content").removeClass("animated backgroundChange");
        }, 1000);
    }

    saveFormRef = (form) => {
        this.form = form;
    }

    render(){
        let tabList =[
            (hiddenOptions,i) => {
                return<TabPane tab={("BroadSoft " + this.tr("a_callset"))} key={i}>
                    <BroadsoftCallForm {...this.props} ref={this.saveFormRef} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                                       curAcct={this.state.activeAcct} callctrdisable={this.state.callctrdisable} tabOrder={i}  hideItem={hiddenOptions} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={"SCA"} key={i}>
                    <BroadsoftScaForm {...this.props} ref={this.saveFormRef} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                                      curAcct={this.state.activeAcct} tabOrder={i}  hideItem={hiddenOptions} />
                </TabPane>
            }
        ]

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("ext_broadsoft")}</div>
                <Tabs defaultActiveKey={this.props.curAccount} onTabClick={this.onTabClick.bind(this)} className="AcctTabs" activeKey={this.state.activeAcct}
                    onChange={this.onChange.bind(this, 1)} type="card" size="large">
                    {
                        [...Array(this.props.maxAcctNum)].map((tabpane, index) => {
                            return (
                                <TabPane tab={<span><Icon className="userIcon"/>{this.tr("a_account")+" "+(index+1)}</span>} key={index+1}></TabPane>
                            )
                        })
                    }
                </Tabs>
                <Tabs className="config-tab" activeKey={this.props.activeKey} onChange={this.onChange.bind(this, 2)} style={{minHeight: this.props.mainHeight-65}}>
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
    ipvtExist: state.ipvtExist,
    mainHeight: state.mainHeight,
    activeKey: state.TabactiveKey,
    maxAcctNum: state.maxAcctNum,
    curAccount: state.curAccount
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getItemValues: Actions.getItemValues,
      setItemValues: Actions.setItemValues,
      jumptoTab: Actions.jumptoTab
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Broadsoftfunc));
