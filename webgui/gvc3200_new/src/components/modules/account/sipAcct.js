import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import GeneralForm from "./sipAccount/general";
import NetFrom from './sipAccount/net'
import SipForm from "./sipAccount/sip";
import CodecForm from "./sipAccount/codec";
import CallForm from "./sipAccount/call";
import AdvancedForm from "./sipAccount/advanced";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form,Layout, Tabs, Icon, Select } from "antd";
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

const AccountGeneralForm = Form.create()(GeneralForm);
const AccountNetForm = Form.create()(NetFrom);
const AccountSipForm = Form.create()(SipForm);
const AccountCodecForm = Form.create()(CodecForm);
const AccountCallForm = Form.create()(CallForm);
const AccountAdvancedForm = Form.create()(AdvancedForm);

class SlidingTabsDemo extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(this.props.curLocale != nextProps.curLocale) {
            return true
        }
        if(this.props.acctStatus != nextProps.acctStatus) {
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
            this.form.resetFields()
            return true
        }
        let result = curItemValues.some((curItem,index,arr) => {
            return curItem != nextItemValues[index]
        })
        if(result == true) {
            this.form.resetFields()
        }
        return result
    }

    componentDidMount = () => {
        this.onChange("1",'0');
        this.props.getAcctStatus();
    }

    onChange(tabsNum,ActiveKey,e) {
        if(tabsNum == "1") {
            this.props.setCurAccount(ActiveKey)
        } else {
            window.scrollTo(0,0);
            this.props.jumptoTab(ActiveKey);
        }
  }

  onTabClick = () => {
      $(".ant-tabs-content").addClass("animatedfade backgroundChange").show();
      setTimeout(function () {
          $(".ant-tabs-content").removeClass("animatedfade backgroundChange");
      }, 1000);
  }

  saveFormRef = (form) => {
      this.form = form;
  }

  render() {
      if(this.props.callIsEmptyObject(this.props)) {
          return null;
      }

      let [language,callTr,maxacctnum,tab2] = [this.props.curLocale,this.props.callTr,this.props.maxAcctNum,this.props.tab2]
      let accountStatus = this.props.acctStatus;
      let accountItems = [];
      for(let item in accountStatus.headers){
        accountItems[item]=accountStatus.headers[item]
      }

      for (let i = 0; i< maxacctnum; i++) {
          if ((accountItems["account_"+ `${i}`+"_no"] != "") && (accountItems["account_"+ `${i}`+"_no"] != undefined)
             && (accountItems["account_"+ `${i}`+"_server"] != "") && (accountItems["account_"+ `${i}`+"_server"] != undefined)) {
                 $(".AcctTabs .ant-tabs-tab:eq(" + i + ")").addClass("RegisterStatus");
             } else {
                 $(".AcctTabs .ant-tabs-tab:eq(" + i + ")").removeClass("RegisterStatus");
             }
      }

      let tabList =[
          (hiddenOptions,i) => {
              return<TabPane tab={callTr("a_16023")} key={i}>
                  <AccountGeneralForm {...this.props} activeKey={tab2} ref = {this.saveFormRef} callTr = {this.props.callTr} tabOrder={i}  hideItem={hiddenOptions} />
              </TabPane>
          } ,
          (hiddenOptions,i) => {
              return<TabPane tab={callTr("a_16024")} key={i}>
                  <AccountNetForm {...this.props} activeKey={tab2} ref = {this.saveFormRef} callTr = {this.props.callTr} tabOrder={i}  hideItem={hiddenOptions} />
              </TabPane>
          },
          (hiddenOptions,i) => {
              return<TabPane tab={callTr("a_16025")} key={i}>
                  <AccountSipForm {...this.props} activeKey={tab2} ref = {this.saveFormRef} callTr = {this.props.callTr} tabOrder={i}  hideItem={hiddenOptions} />
              </TabPane>
          },
          (hiddenOptions,i) => {
              return<TabPane tab={callTr("a_16026")} key={i}>
                  <AccountCodecForm {...this.props} activeKey={tab2} ref = {this.saveFormRef} callTr = {this.props.callTr} tabOrder={i} hideItem={hiddenOptions} />
              </TabPane>
          },
          (hiddenOptions,i) => {
              return<TabPane tab={callTr("a_16027")} key={i}>
                  <AccountCallForm {...this.props} activeKey={tab2} ref = {this.saveFormRef} callTr = {this.props.callTr} tabOrder={i}  hideItem={hiddenOptions} />
              </TabPane>
          },
      ]
      return (
            <div style = {{background:"#f3f7fa"}}>
                <Tabs className="config-tab accountTab" activeKey={tab2} size="middle" onChange={this.onChange.bind(this,"2")} style={{"minHeight":this.props.mainHeight}}>
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
            </div>
      )
  }
}

class SipAccount extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">SIP</div>
                <SlidingTabsDemo {...this.props} callTr = {this.tr} callIsEmptyObject = {this.isEmptyObject} getReqItem = {this.getReqItem}/>
            </Content>
        );
    }
}
const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    curAccount:state.curAccount,
    itemValues: state.itemValues,
    product: state.product,
    acctStatus: state.acctStatus,
    mainHeight: state.mainHeight,
    userType: state.userType,
    maxAcctNum: state.maxAcctNum,
    tab2: state.TabactiveKey,
    oemId: state.oemId
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        setCurAccount:Actions.setCurAccount,
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        cb_ping: Actions.cb_ping,
        cb_audio_upload: Actions.cb_audio_upload,
        promptMsg:Actions.promptMsg,
        getAcctStatus:Actions.getAcctStatus,
        cb_set_autoanswer:Actions.cb_set_autoanswer,
        cb_updateautoanswerstatus:Actions.cb_updateautoanswerstatus,
        cb_set_callforward:Actions.cb_set_callforward,
        jumptoTab: Actions.jumptoTab
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(SipAccount))
