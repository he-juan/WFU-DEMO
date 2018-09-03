import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import FirmwareForm from "./upgrade/firmware";
import ConfigForm from "./upgrade/config";
import DeployForm from "./upgrade/deploy";
import MoreForm from "./upgrade/more";
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { Form, Layout, Tabs, Input, Icon, Tooltip, Radio, Select, AutoComplete, Button } from "antd";
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

const UpgradeFirmwareForm = Form.create()(FirmwareForm);
const UpgradeConfigForm = Form.create()(ConfigForm);
const UpgradeDeployForm = Form.create()(DeployForm);
const UpgradeMoreForm = Form.create()(MoreForm);

class Upgrade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            m_uploading:0
        }
    }

    callback = (key) => {
        window.scrollTo(0,0);
        this.props.jumptoTab(key);
    }

    changeMuploading = (value) => {
        this.setState({
            m_uploading:value
        })
    }

    render() {
        let hideItem = [];
        let tabList =
            <Tabs className="config-tab" activeKey={this.props.activeKey} onChange = {this.callback.bind(this)} style={{'minHeight':this.props.mainHeight}}>
                <TabPane tab={this.tr("a_firmwaretitle")} key={0}>
                    <UpgradeFirmwareForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey} m_uploading={ this.state.m_uploading } changeMuploading = {this.changeMuploading}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("a_configtitle")} key={1}>
                    <UpgradeConfigForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey} m_uploading={ this.state.m_uploading } changeMuploading = {this.changeMuploading}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("a_deploy")} key={2}>
                    <UpgradeDeployForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("advanced_menu")} key={3}>
                    <UpgradeMoreForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey} m_uploading={ this.state.m_uploading } changeMuploading = {this.changeMuploading}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
            </Tabs>;

        for (var i = 0, j = 0; tabList.props.children[i] != undefined; i++, j++) {
            let hiddenOptions = optionsFilter.getHiddenOptions(j);

            if (hiddenOptions[0] == -1) {
                tabList.props.children.splice(i, 1);
                //handleReqItem.splice(i, 1);
                i--;
            } else {
                tabList.props.children[i].key = i;
                tabList.props.children[i].props.key = i;
                tabList.props.children[i].props.children.props.tabOrder = i;
                tabList.props.children[i].props.children.props.hideItem = hiddenOptions;
            }
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("maintenance_upgrade")}</div>
                {tabList}
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
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        setTabKey: Actions.setTabKey,
        jumptoTab: Actions.jumptoTab
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Upgrade));
