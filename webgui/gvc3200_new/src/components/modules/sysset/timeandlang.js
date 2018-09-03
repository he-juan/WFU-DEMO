import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import TimezoneForm from "./timeandlang/timezone";
import LanguageForm from "./timeandlang/language";
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Layout, Tabs, Form} from "antd";
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const TabPane = Tabs.TabPane;

const TimeLangTimezoneForm = Form.create()(TimezoneForm);
const TimeLangLanguageForm = Form.create()(LanguageForm);

class Timeandlang extends Component {
    constructor(props) {
        super(props);
    }

    callback = (key) => {
        window.scrollTo(0,0);
        this.props.jumptoTab(key);
    }

    render() {
        let hideItem = [];
        let tabList =
            <Tabs className="config-tab" activeKey={this.props.activeKey} onChange = {this.callback.bind(this)} style={{'minHeight': this.props.mainHeight}}>
                <TabPane tab={this.tr("maintenance_time")} key={0}>
                    <TimeLangTimezoneForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
                        hideItem={hideItem} tabOrder="" />
                </TabPane>
                <TabPane tab={this.tr("maintenance_lang")} key={1}>
                    <TimeLangLanguageForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} activeKey={this.props.activeKey}
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
                <div className="subpagetitle">{this.tr("time_lang")}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Timeandlang));
