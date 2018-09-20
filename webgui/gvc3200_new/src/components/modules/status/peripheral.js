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

class peripheral extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data:{}
        }

        req_items = new Array;
        req_items.push(
            this.getReqItem("recover","remote_battery", ""),
            this.getReqItem("camerahardversion","25026", ""),
            this.getReqItem("cpever","25028", ""),
            this.getReqItem("android","25027", ""),
            this.getReqItem("speakerphone","25027", ""),
        );
    }

    componentDidMount() {
        this.props.getItemValues(req_items);
    }

    render() {
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{"外围设备状态"}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(peripheral));