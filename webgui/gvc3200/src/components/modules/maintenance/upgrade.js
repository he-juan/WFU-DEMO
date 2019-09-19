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
        let tabList =[
            (hiddenOptions,i) => {
                return <TabPane tab={this.tr("a_19179")} key={i}>
                    <UpgradeFirmwareForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey} m_uploading={ this.state.m_uploading } changeMuploading = {this.changeMuploading}
                                         hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_19820")} key={i}>
                    <UpgradeConfigForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey} m_uploading={ this.state.m_uploading } changeMuploading = {this.changeMuploading}
                                       hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_19821")} key={i}>
                    <UpgradeDeployForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                                       hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            } ,
            (hiddenOptions,i) => {
                return<TabPane tab={this.tr("a_4101")} key={i}>
                    <UpgradeMoreForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey} m_uploading={ this.state.m_uploading } changeMuploading = {this.changeMuploading}
                                     hideItem={hiddenOptions} tabOrder={i} />
                </TabPane>
            }
        ]

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_1605")}</div>
                <Tabs className="config-tab" activeKey={this.props.activeKey} onChange = {this.callback.bind(this)} style={{'minHeight':this.props.mainHeight}}>
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
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        jumptoTab: Actions.jumptoTab
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Upgrade));
