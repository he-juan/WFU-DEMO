import React, { Component, PropTypes } from 'react'
import Enhance from '../../mixins/Enhance';
import { FormattedHTMLMessage } from 'react-intl'
import { ChromePicker } from 'react-color';
import { Layout, Tabs, Form, Tooltip, Icon, Button, Select, Checkbox, Input, Slider } from 'antd';
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

class SitenameForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayColorPicker: false,
            itemValues: {},
            curColor: ""
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.enterSave != nextProps.enterSave) {
            this.handleSubmit();
        }
    }

    componentDidMount = () => {
        this.props.handleSqlSitename((data) => {
            this.setState({
                itemValues: data[0],
                curColor: data[0].fontcolor
            });
        })
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (values['bold']) {
                    values['bold'] = 1;
                } else {
                    values['bold'] = 0;
                }
                let paramurl1 = "bgtp=" + values['bgtp'] +
                    "&sitename=" + encodeURIComponent(values['sitename']) +
                    "&dispos=" + values['dispos'] +
                    "&disduration=" + values['disduration'] +
                    "&fontcolor=" + encodeURIComponent(this.state.curColor) +
                    "&fontsize=" + values['fontsize'] +
                    "&bold=" + values['bold'],
                    paramurl2 = "horizont=" + values['horizonoffset'] + "&direction=x",
                    paramurl3 = "vertical=" + values['vericaloffset'] + "&direction=y";

                this.props.setSitenameInfo(paramurl1, 1);
                this.props.setSitenameInfo(paramurl2, 2);
                this.props.setSitenameInfo(paramurl3, 2);
            }
        });
    }

    showBlockPicker = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }

    hideBlockPicker = () => {
        this.setState({ displayColorPicker: false });
    }

    handleColorChange = (color) => {
        this.setState({ curColor: color.hex });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalues = this.state.itemValues;

        return (
            <Form className="configform" hideRequiredMark style={{ 'min-height': this.props.mainHeight }}>
                <FormItem label={<span>{callTr("a_16225")}<Tooltip title={<FormattedHTMLMessage id={callTipsTr("Site Name")} />}><Icon type="question-circle-o" /></Tooltip></span>}>
                    {getFieldDecorator("sitename", {
                        initialValue: itemvalues["Sitename"] ? itemvalues["Sitename"] : ""
                    })(
                        <Input maxLength={16} />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16221")}<Tooltip title={callTipsTr("Background Transparency")}><Icon type="question-circle-o" /></Tooltip></span>}>
                    {getFieldDecorator("bgtp", {
                        initialValue: itemvalues["bg_tp"] ? itemvalues["bg_tp"] : "0"
                    })(
                        <Select>
                            <Option value="0">{callTr("a_16223")}</Option>
                            <Option value="1">5%</Option>
                            <Option value="2">10%</Option>
                            <Option value="3">15%</Option>
                            <Option value="4">20%</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem label={<span>{callTr("a_16226")}<Tooltip title={callTipsTr("Display Position")}><Icon type="question-circle-o" /></Tooltip></span>}>
                    {getFieldDecorator("dispos", {
                        initialValue: itemvalues["displayposition"] ? itemvalues["displayposition"] : "0"
                    })(
                        <Select>
                            <Option value="0">{callTr("a_16227")}</Option>
                            <Option value="1">{callTr("a_16228")}</Option>
                            <Option value="2">{callTr("a_16229")}</Option>
                            <Option value="3">{callTr("a_16230")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16231")}<Tooltip title={callTipsTr("Display Duration")}><Icon type="question-circle-o" /></Tooltip></span>}>
                    {getFieldDecorator("disduration", {
                        initialValue: itemvalues["displayduration"] ? itemvalues["displayduration"] : "0"
                    })(
                        <Select>
                            <Option value="0">{callTr("a_16233")}</Option>
                            <Option value="1">1 {callTr("a_109")}</Option>
                            <Option value="2">5 {callTr("a_110")}</Option>
                            <Option value="3">10 {callTr("a_110")}</Option>
                            <Option value="4">{callTr("a_16232")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16234")}<Tooltip title={callTipsTr("Font Color")}><Icon type="question-circle-o" /></Tooltip></span>}>
                    <div>
                        <div className="color-pick-btn" onClick={this.showBlockPicker}>
                            <div className="color-chosen" style={{ background: this.state.curColor }}></div>
                        </div>
                        {this.state.displayColorPicker
                            ? <div className="font-block-picker">
                                <div className="color-cover" onClick={this.hideBlockPicker}></div>
                                {getFieldDecorator("fontcolor")(
                                    <ChromePicker color={this.state.curColor} onChange={this.handleColorChange} disableAlpha={true} />
                                )}
                            </div>
                            : null}
                    </div>
                </FormItem>
                <FormItem label={<span>{callTr("a_16235")}<Tooltip title={callTipsTr("Font Size")}><Icon type="question-circle-o" /></Tooltip></span>}>
                    {getFieldDecorator("fontsize", {
                        initialValue: itemvalues["fontsize"] ? itemvalues["fontsize"] : "0"
                    })(
                        <Select>
                            <Option value="0">{callTr("a_16246")}</Option>
                            <Option value="1">{callTr("a_16247")}</Option>
                            <Option value="2">{callTr("a_16248")}</Option>
                            <Option value="3">{callTr("a_16236")}</Option>
                            <Option value="4">{callTr("a_16249")}</Option>
                            <Option value="5">{callTr("a_16250")}</Option>
                            <Option value="6">{callTr("a_16251")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16237")}<Tooltip title={callTipsTr("Bold")}><Icon type="question-circle-o" /></Tooltip></span>}>
                    {getFieldDecorator("bold", {
                        valuePropName: "checked",
                        initialValue: parseInt(itemvalues["bold"])
                    })(
                        <Checkbox />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16610")}<Tooltip title={<FormattedHTMLMessage id={callTipsTr("Horizontal Offset")} />}><Icon type="question-circle-o" /></Tooltip></span>}>
                    {getFieldDecorator("horizonoffset", {
                        initialValue: itemvalues["horizont"]
                    })(
                        <Slider min={0} max={96} marks={{ 0: "0", 96: "96" }} />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_16611")}<Tooltip title={<FormattedHTMLMessage id={callTipsTr("Vertical Offset")} />}><Icon type="question-circle-o" /></Tooltip></span>}>
                    {getFieldDecorator("vericaloffset", {
                        initialValue: itemvalues["vertical"]
                    })(
                        <Slider min={0} max={96} marks={{ 0: "0", 96: "96" }} />
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedSitenameForm = Form.create()(SitenameForm);

class Sitename extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_16013")}</div>
                <WrappedSitenameForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} />
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    enterSave: state.enterSave
})

function mapDispatchToProps(dispatch) {
    var actions = {
        handleSqlSitename: Actions.cb_sqlite_sitename,
        setSitenameInfo: Actions.setSitenameInfo
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Sitename));
