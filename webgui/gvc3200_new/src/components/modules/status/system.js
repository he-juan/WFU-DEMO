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

class System extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }

        req_items = new Array;
        req_items.push(
            this.getReqItem("hardware-revision","hw_rev", ""),
            this.getReqItem("system-version","68", ""),
            this.getReqItem("recovery-version","7033", ""),
            this.getReqItem("boot-version","69", ""),
            this.getReqItem("kernel-version","70", ""),
            this.getReqItem("android-version","and_rev", ""),
            this.getReqItem("lcd-serialNum","lcd_sn", ""),
            this.getReqItem("ddr-serialNum","ddr_sn", ""),
            this.getReqItem("fct-serialNum","fct_sn", "")
        );
    }

    view_status_uptime_write(data) {
    var dayhtml = "";
    if (parseInt(data['day']) > 1) {
        dayhtml += data['day'] + " " + this.tr("a_106") + ", ";
    } else if (parseInt(data['day']) > 0) {
        dayhtml += data['day'] + " " + this.tr("a_105") + ", ";
    }

    if (parseInt(data['hour']) > 1) {
        dayhtml += data['hour'] + " "+ this.tr("a_15008") + ", ";
    } else if ((parseInt(data['hour']) > 0) || (dayhtml.length > 1)) {
        dayhtml += data['hour'] + " " + this.tr("a_15007") + ", ";
    }

    if (parseInt(data['min']) > 1) {
        dayhtml += data['min'] + " " + this.tr("a_110") + ", ";
    } else if ((parseInt(data['min']) > 0) || (dayhtml.length > 1)) {
        dayhtml += data['min'] + " " + this.tr("a_109") + ", ";
    }

    if (parseInt(data['sec']) > 1) {
        dayhtml += data['sec'] + " " + this.tr("a_114") + " ";
    } else {
        dayhtml += data['sec'] + " " + this.tr("a_116");
    }
        return dayhtml;
    }

    componentDidMount() {
        this.props.getItemValues(req_items);
        this.props.getSystemUptime();
        this.props.getSystemProduct();
        this.props.getSystemPn();
    }

    render() {
        let productModel = this.props.systemProduct;
        let pnValue = this.props.systemPn;
        let systemUptime = this.props.systemUptime;

        var productModelItem = [];
        for (var item in productModel.headers){
            productModelItem[item] = productModel.headers[item]
        }

        var pnValueItem = [];
        for (var item in pnValue.headers){
            pnValueItem[item] = pnValue.headers[item]
        }

        var systemUptimeItem = [];
        for (var item in systemUptime.headers){
            systemUptimeItem[item] = systemUptime.headers[item]
        }

        let itemList =
            <Form className="configform" style={{'min-height': this.props.mainHeight}}>
                <FormItem label={<span>{this.tr("a_16404")}<Tooltip title={this.tips_tr("Product Model")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="product-model">{ productModelItem["product"] }</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_4134")}<Tooltip title={this.tips_tr("Hardware Revision")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="hardware-revision">{ this.props.itemValues['hardware-revision'] }</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_16406")}<Tooltip title={this.tips_tr("Part Number")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="part-number">{ pnValueItem["pn"] }</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_4130")}<Tooltip title={this.tips_tr("System Version")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="system-version">{ this.props.itemValues['system-version'] }</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_4131")}<Tooltip title={this.tips_tr("Recovery Version")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="recovery-version">{ this.props.itemValues['recovery-version'] }</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_16408")}<Tooltip title={this.tips_tr("Boot Version")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="boot-version">{ this.props.itemValues['boot-version'] }</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_16416")}<Tooltip title={this.tips_tr("Kernel Version")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="kernel-version">{ this.props.itemValues['kernel-version'] }</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_16415")}<Tooltip title={this.tips_tr("Android Version")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="android-version">{ this.props.itemValues['android-version'] }</span>
                </FormItem>
                <FormItem label={<span>{this.tr("a_16417")}<Tooltip title={this.tips_tr("System Up Time")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    <span ref="system-uptime">{ this.view_status_uptime_write(systemUptimeItem) }</span>
                </FormItem>
            </Form>;
        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length-1; hiddenOptions[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_4148")}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(System));
