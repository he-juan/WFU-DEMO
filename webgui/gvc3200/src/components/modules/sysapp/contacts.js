import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import GeneralForm from "./contacts/general";
import ImexportForm from "./contacts/imexport";
import DownloadContactsForm from "./contacts/downloadcontacts";
import ContactsForm from "./contacts/contacts";
import GroupsContactsForm from "./contacts/groups";
import {Layout, Tabs, Form} from "antd";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const TabPane = Tabs.TabPane;

const ContactsGeneralForm = Form.create()(GeneralForm);
const ContactsImexportForm = Form.create()(ImexportForm);
const ContactsDownloadForm = Form.create()(DownloadContactsForm);
const ContactsContactsForm = Form.create()(ContactsForm);
const ContactsGroupsForm = Form.create()(GroupsContactsForm);

class SlidingTabsDemo extends Component {
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
        let tabList =[
            (hiddenOptions,i) => {
                return<TabPane tab={this.props.callTr("a_16023")} key={i}>
                    <ContactsGeneralForm {...this.props} activeKey={this.props.activeKey} callTr={this.props.callTr} getReqItem = {this.props.getReqItem} isEmptyObject = {this.props.callIsEmptyObject} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.props.callTr("a_imexportcontacts")} key={i}>
                    <ContactsImexportForm {...this.props} activeKey={this.props.activeKey} callTr={this.props.callTr} getReqItem = {this.props.getReqItem} isEmptyObject = {this.props.callIsEmptyObject} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.props.callTr("a_4808")} key={i}>
                    <ContactsDownloadForm {...this.props} activeKey={this.props.activeKey} callTr={this.props.callTr} getReqItem = {this.props.getReqItem} isEmptyObject = {this.props.callIsEmptyObject} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.props.callTr("a_19631")} key={i}>
                    <ContactsContactsForm {...this.props} activeKey={this.props.activeKey} callTr={this.props.callTr} getReqItem = {this.props.getReqItem} isEmptyObject = {this.props.callIsEmptyObject} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.props.callTr("a_4779")} key={i}>
                    <ContactsGroupsForm {...this.props} activeKey={this.props.activeKey} callTr={this.props.callTr} getReqItem = {this.props.getReqItem} isEmptyObject = {this.props.callIsEmptyObject} hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            }
        ]
        return <Tabs className="config-tab" activeKey={this.props.activeKey} style={{'minHeight': this.props.mainHeight}} onChange={this.onChange}>
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

class Contacts extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("appset_phonebook")}</div>
                <SlidingTabsDemo {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} getReqItem = {this.getReqItem} callIsEmptyObject={this.isEmptyObject} />
            </Content>
        )
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues:state.itemValues,
    mainHeight: state.mainHeight,
    enterSave: state.enterSave,
    userType: state.userType,
    activeKey: state.TabactiveKey,
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        promptMsg:Actions.promptMsg,
        setItemValues:Actions.setItemValues,
        getItemValues:Actions.getItemValues,
        cb_put_port_param: Actions.cb_put_port_param,
        cb_save_fav: Actions.cb_save_fav,
        cb_ping: Actions.cb_ping,
        cb_get_portresponse: Actions.cb_get_portresponse,
        cb_put_download_param: Actions.cb_put_download_param,
        cb_get_down_response: Actions.cb_get_down_response,
        saveDownContactsParams: Actions.saveDownContactsParams,
        progressMessage:Actions.progressMessage,
        jumptoTab: Actions.jumptoTab
    }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Contacts));
