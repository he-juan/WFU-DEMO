import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Form, Tooltip, Icon, Input, Checkbox, Select, Button, Slider, Row, Col, Switch} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"disbacklight", "pvalue":"351", "value":""},
                    {"name":"dismissindtor", "pvalue":"1691", "value":""},
                    {"name":"dismwiindtor", "pvalue":"1692", "value":""},
                    {"name":"disnewmsgindtor", "pvalue":"1693", "value":""},
                    {"name":"disfullindtor", "pvalue":"1694", "value":""},
                    {"name":"dislcdindtor", "pvalue":"1695", "value":""},
                    {"name":"keybacklight", "pvalue":"22234", "value":""}];

class LcdLedForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            redEnabled:false,
            blueEnabled:false,
            greenEnabled:false,
        }
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
        this.props.getLightBrightness((result) => {
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                redslider:parseInt(result.red.cur),
                greenslider:parseInt(result.green.cur),
                blueslider:parseInt(result.blue.cur)
            });
        });

    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items);
                this.props.getLightBrightness((result) => {
                    const { setFieldsValue } = this.props.form;
                    setFieldsValue({
                        redslider:parseInt(result.red.cur),
                        greenslider:parseInt(result.green.cur),
                        blueslider:parseInt(result.blue.cur)
                    });
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.props.setItemValues(req_items, values, 0, (result) =>{
                    this.props.updateLights();
                });
            }
        });
    }

    handleredEnabledChange = (disabled) => {
        this.setState({ redEnabled : disabled });
        if (disabled == true) {
            this.state.greenEnabled == true && this.setState({ greenEnabled : false });
            this.state.blueEnabled == true && this.setState({ blueEnabled : false });
            this.props.openLight(0);
        } else {
            this.props.closeLight();
        }
    }

    handleblueEnabledChange = (disabled) => {
        this.setState({ blueEnabled : disabled });
        if (disabled == true) {
            this.state.redEnabled == true && this.setState({ redEnabled : false });
            this.state.greenEnabled == true && this.setState({ greenEnabled : false });
            this.props.openLight(2);
        } else {
            this.props.closeLight();
        }
    }

    handlegreenEnabledChange = (disabled) => {
        this.setState({ greenEnabled: disabled });
        if (disabled == true) {
            this.state.redEnabled == true && this.setState({ redEnabled : false });
            this.state.blueEnabled == true && this.setState({ blueEnabled : false });
            this.props.openLight(1);
        } else {
            this.props.closeLight();
        }
    }

    onRedChange = (value) => {
        this.props.setLightBrightness(0,value);
    }

    onGreenChange = (value) => {
        this.props.setLightBrightness(1,value);
    }

    onBlueChange = (value) => {
        this.props.setLightBrightness(2,value);
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr
        const itemvalue = this.props.itemValues;
        const lightBrightness = this.props.lightBrightness;
        var redMax = 0, greenMax = 0, blueMax = 0;
        if (!$.isEmptyObject(lightBrightness)) {
            redMax = lightBrightness.red.max;
            greenMax = lightBrightness.green.max;
            blueMax = lightBrightness.blue.max;
        }

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_disbacklight")}<Tooltip title={callTipsTr("Disable Missed Call Backlight")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disbacklight", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disbacklight'])
                    })(
                        <Checkbox className="P-351"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_dismissindtor")}<Tooltip title={callTipsTr("Disable Missed Call Indicator")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("dismissindtor", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['dismissindtor'])
                    })(
                        <Checkbox className="P-1691"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_dismwiindtor")}<Tooltip title={callTipsTr("Disable MWI Indicator")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("dismwiindtor", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['dismwiindtor'])
                    })(
                        <Checkbox className="P-1692"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_disnewmsgindtor")}<Tooltip title={callTipsTr("Disable New Message Indicator")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disnewmsgindtor", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disnewmsgindtor'])
                    })(
                        <Checkbox className="P-1693"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_disfullindtor")}<Tooltip title={callTipsTr("Disable Contact Full Indicator")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("disfullindtor", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['disfullindtor'])
                    })(
                        <Checkbox className="P-1694"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_dislcdindtor")}<Tooltip title={callTipsTr("Disable Indicator When LCD is Off")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("dislcdindtor", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['dislcdindtor'])
                    })(
                        <Checkbox className="P-1695"/>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_keybacklight")}<Tooltip title={callTipsTr("Enable Keypad Backlight")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("keybacklight", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['keybacklight'])
                    })(
                        <Checkbox className="P-22234"/>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
                </FormItem>
                <p className={"blocktitle"}><s></s>{callTr("a_adjustlight")}</p>
                <FormItem　className = "redControl" label={<span>{callTr("a_adjustred")}</span>}>
                    <Row>
                        <Col span={4}>
                            <Switch size="small" checked={this.state.redEnabled} onChange={this.handleredEnabledChange} />
                        </Col>
                        <Col span={20}>
                            {getFieldDecorator("redslider")(
                                <Slider min={0} max={parseInt(redMax)} disabled={!this.state.redEnabled} onChange={this.onRedChange} />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem className = "greenControl" label={<span>{callTr("a_adjustgreen")}</span>}>
                    <Row>
                        <Col span={4}>
                            <Switch size="small" checked={this.state.greenEnabled} onChange={this.handlegreenEnabledChange} />
                        </Col>
                        <Col span={20}>
                            {getFieldDecorator("greenslider")(
                                <Slider min={0} max={parseInt(greenMax)} disabled={!this.state.greenEnabled} onChange={this.onGreenChange} />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label={<span>{callTr("a_adjustblue")}</span>}>
                    <Row>
                        <Col span={4}>
                            <Switch size="small" checked={this.state.blueEnabled} onChange={this.handleblueEnabledChange} />
                        </Col>
                        <Col span={20}>
                            {getFieldDecorator("blueslider")(
                                <Slider min={0} max={parseInt(blueMax)} disabled={!this.state.blueEnabled} onChange={this.onBlueChange} />
                            )}
                        </Col>
                    </Row>
                </FormItem>
            </Form> ;

        let hideItem = this.props.hideItem;
        for (let i = hideItem.length-1; hideItem[i] != undefined && i >= 0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    lightBrightness: state.lightBrightness
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        getLightBrightness: Actions.getLightBrightness,
        openLight: Actions.openLight,
        closeLight: Actions.closeLight,
        setLightBrightness: Actions.setLightBrightness
    }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LcdLedForm);
