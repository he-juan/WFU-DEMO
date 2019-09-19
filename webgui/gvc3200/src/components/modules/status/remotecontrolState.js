import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import * as optionsFilter from "../../template/optionsFilter.js";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Layout, Tooltip, Icon, Tabs } from 'antd';
const Content = Layout;
const TabPane = Tabs.TabPane;
let req_items;

const FormItem = Form.Item;

class Remote extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }

        req_items = new Array;
        req_items.push(
            this.getReqItem("remotebattery","remote_battery", ""),
            this.getReqItem("softversion","25026", ""),
            this.getReqItem("hardwareversion","25028", ""),
            this.getReqItem("patchversion","remote_patch_ver", ""),
        );
    }

    componentDidMount() {
        this.props.getItemValues(req_items);
    }

    render() {
        let itemList =
            <Form className="configform" style={{minHeight: this.props.mainHeight}}>
                <FormItem label={<span>{this.tr("a_4134")}<Tooltip title={this.tips_tr("Hardware Version")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="boot-version">{ this.props.itemValues['hardwareversion']?this.props.itemValues['hardwareversion']:this.tr("a_2085") }</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_16633")}<Tooltip title={this.tips_tr("Software Version")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="boot-version">{ this.props.itemValues['softversion']?this.props.itemValues['softversion']:this.tr("a_2085")}</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_12215")}<Tooltip title={this.tips_tr("Patch Version")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="kernel-version">{ this.props.itemValues['touchpadversion']?this.props.itemValues['patchversion']:this.tr("a_2085") }</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_16634")}<Tooltip title={this.tips_tr("Remote Battery")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="android-version">{ this.props.itemValues['remotebattery']?this.props.itemValues['remotebattery']:this.tr("a_2085") }</span>
                </FormItem>
            </Form>;
        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length-1; hiddenOptions[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_12001")}</div>
                {itemList}
            </Content>
        )
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    systemUptime: state.systemUptime,
    systemProduct: state.systemProduct,
    systemPn: state.systemPn,
    product: state.product,
    mainHeight: state.mainHeight
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues:Actions.getItemValues,
        getSystemUptime:Actions.getSystemUptime,
        getSystemProduct:Actions.getSystemProduct,
        getSystemPn:Actions.getSystemPn
    };
    return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Remote));