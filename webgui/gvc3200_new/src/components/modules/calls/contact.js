import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import {Layout, Tabs, Popconfirm, Modal, Input, message, Form} from "antd";
import * as Actions from '../../redux/actions/index';
import { bindActionCreators } from 'redux';
import {  connect } from 'react-redux';
import * as optionsFilter from "../../template/optionsFilter";
import ContactTab from "./contact/contactTab";
import GroupTab from "./contact/groupTab";
const Content = Layout;
const TabPane = Tabs.TabPane;

const ContactTabForm = Form.create()(ContactTab);
const GroupTabForm = Form.create()(GroupTab);

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    callback = (key) => {
        window.scrollTo(0,0);
        this.props.jumptoTab(key);
    }

    componentDidMount = () => {

    }

    render() {
        let tabList =[
                (hiddenOptions,i) => {
                    return<TabPane tab = {this.tr("a_19630")} key={i}>
                        <ContactTabForm {...this.props} hideItem={hiddenOptions} callTr={this.tr} getReqItem = {this.getReqItem} activeKey={this.state.activeKey} tabOrder={i}/>
                    </TabPane>
                } ,
                (hiddenOptions,i) => {
                    return<TabPane tab = {this.tr("a_4779")} key={i}>
                        <GroupTabForm {...this.props} hideItem={hiddenOptions} callTr={this.tr} getReqItem = {this.getReqItem} activeKey={this.state.activeKey} tabOrder={i}/>
                    </TabPane>
                }
            ]
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_19631")}</div>
                <Tabs className="config-tab" activeKey={this.props.activeKey} onChange = {this.callback.bind(this)} style = {{'minHeight':this.props.mainHeight}}>
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
    activeKey: state.TabactiveKey,
    userType: state.userType
})

function mapDispatchToProps(dispatch) {
    var actions = {
        jumptoTab: Actions.jumptoTab,
        getItemValues:Actions.getItemValues,
        promptMsg:Actions.promptMsg
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Contact));
