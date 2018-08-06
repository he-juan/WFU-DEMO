import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import {
    Layout,
    Form,
    Radio,
    Select,
    Input,
    Tooltip,
    Icon,
    Switch,
    Checkbox,
    Button,
    Slider,
    Modal
} from "antd";
import * as Actions from '../../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const Content = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class channel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Modalvisible: false,
            showChannelNum: "0",
            channelUsable: props.itemValues.channelUsable,
            channelJoinable: props.itemValues.channelJoinable,
            channelTransmittable: props.itemValues.channelTransmittable,
            channelReceiveable: props.itemValues.channelReceiveable,
            pttChannelLabel: props.itemValues.pttChannelLabel
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.Modalvisible != nextProps.Modalvisible) {
            this.setState({
                Modalvisible: nextProps.Modalvisible,
            })
        }
        if (this.props.itemValues.channelUsable != nextProps.itemValues.channelUsable) {
            this.setState({
                channelUsable: nextProps.itemValues.channelUsable,
            })
        }
        if (this.props.itemValues.channelJoinable != nextProps.itemValues.channelJoinable) {
            this.setState({
                channelJoinable: nextProps.itemValues.channelJoinable,
            })
        }
        if (this.props.itemValues.channelTransmittable != nextProps.itemValues.channelTransmittable) {
            this.setState({
                channelTransmittable: nextProps.itemValues.channelTransmittable,
            })
        }
        if (this.props.itemValues.channelReceiveable != nextProps.itemValues.channelReceiveable) {
            this.setState({
                channelReceiveable: nextProps.itemValues.channelReceiveable,
            })
        }
        if (this.props.itemValues.pttChannelLabel != nextProps.itemValues.pttChannelLabel) {
            this.setState({
                pttChannelLabel: nextProps.itemValues.pttChannelLabel,
            })
        }
    }

    handleOk = () => {
        this.props.form.validateFieldsAndScroll(["pttChannelLabel"], (err) => {
            if (!err) {
                let req_items = [
                    {"name": "channelUsable", "pvalue": "22187", "value": ""},
                    {"name": "channelJoinable", "pvalue": "22188", "value": ""},
                    {"name": "channelTransmittable", "pvalue": "22189", "value": ""},
                    {"name": "channelReceiveable", "pvalue": "22190", "value": ""},
                    {"name": "defaultChannel", "pvalue": "22184", "value": ""},
                    {"name": "pttChannelLabel", "pvalue": "22192", "value": ""},
                ]
                let values = {};
                values.channelUsable = this.state.channelUsable
                values.channelJoinable = this.state.channelJoinable
                values.channelTransmittable = this.state.channelTransmittable
                values.channelReceiveable = this.state.channelReceiveable
                values.pttChannelLabel = this.state.pttChannelLabel
                if (values.channelUsable[this.props.itemValues.defaultChannel - 1] == 0 || values.channelReceiveable[this.props.itemValues.defaultChannel - 1] == 0) {
                    let defaultchannel = "-1"
                    for (let i = 0; i < 25; i++) {
                        if (values.channelUsable[i] == 1 && values.channelReceiveable[i] == 1) {
                            defaultchannel = i + 1;
                            break;
                        }
                    }
                    values.defaultChannel = defaultchannel
                } else {
                    values.defaultChannel = this.props.itemValues.defaultChannel
                }
                this.props.setItemValues(req_items, values, 0, this.props.updateData);
                this.props.hideFun()
            }
        });

    }

    handleCancel = () => {
        this.props.hideFun()
    }

    showChannel = (index) => {
        this.setState({
            showChannelNum: index
        })
        this.props.form.setFieldsValue({
            pttChannelLabel: this.state.pttChannelLabel.split("^")[index] ? this.state.pttChannelLabel.split("^")[index] : ""
        })
    }

    changechannelUsable = (value) => {
        if (this.props.userType != "admin") {
            if (this.props.itemValues.priorityChannel == parseInt(this.state.showChannelNum) + 1 || this.props.itemValues.emergencyChannel == parseInt(this.state.showChannelNum) + 1) {
                this.props.promptMsg("ERROR", "a_pttError");
                return
            }
        }
        let num = value == true ? "1" : "0";
        var a = this.state.channelUsable
        a = a.split('')
        let c = a.length
        if (c < 25) {
            for (let i = 0; i < 25 - c; i++) {
                a.push(0)
            }
        }
        a[this.state.showChannelNum] = num
        var b = ""
        b = a.join('');
        this.setState({
            channelUsable: b,
        })
    }

    changechannelJoinable = (value) => {
        if (this.props.userType != "admin") {
            if (this.props.itemValues.priorityChannel == parseInt(this.state.showChannelNum) + 1 || this.props.itemValues.emergencyChannel == parseInt(this.state.showChannelNum) + 1) {
                this.props.promptMsg("ERROR", "a_pttError");
                return
            }
        }
        let num = value == true ? "1" : "0"
        var a = this.state.channelJoinable
        a = a.split('')
        let c = a.length
        if (c < 25) {
            for (let i = 0; i < 25 - c; i++) {
                a.push(0)
            }
        }
        a[this.state.showChannelNum] = num
        var b = ""
        b = a.join('');
        this.setState({
            channelJoinable: b
        })
    }

    changechannelTransmittable = (value) => {
        if (this.props.userType != "admin") {
            if (this.props.itemValues.priorityChannel == parseInt(this.state.showChannelNum) + 1 || this.props.itemValues.emergencyChannel == parseInt(this.state.showChannelNum) + 1) {
                this.props.promptMsg("ERROR", "a_pttError");
                return
            }
        }
        let num = value == true ? "1" : "0"
        var a = this.state.channelTransmittable
        a = a.split('')
        let c = a.length
        if (c < 25) {
            for (let i = 0; i < 25 - c; i++) {
                a.push(0)
            }
        }
        a[this.state.showChannelNum] = num
        var b = ""
        b = a.join('');
        this.setState({
            channelTransmittable: b
        })
    }

    changechannelReceiveable = (value) => {
        if (this.props.userType != "admin") {
            if (this.props.itemValues.priorityChannel == parseInt(this.state.showChannelNum) + 1 || this.props.itemValues.emergencyChannel == parseInt(this.state.showChannelNum) + 1) {
                this.props.promptMsg("ERROR", "a_pttError");
                return
            }
        }
        let num = value == true ? "1" : "0"
        var a = this.state.channelReceiveable
        a = a.split('')
        let c = a.length
        if (c < 25) {
            for (let i = 0; i < 25 - c; i++) {
                a.push(0)
            }
        }
        a[this.state.showChannelNum] = num
        var b = ""
        b = a.join('');
        this.setState({
            channelReceiveable: b
        })
    }

    changeLabel = (e) => {
        var a = this.state.pttChannelLabel
        a = a.split('^')
        let c = a.length
        if (c < 25) {
            for (let i = 0; i < 25 - c; i++) {
                a.push("")
            }
        }
        a[this.state.showChannelNum] = e.target.value
        var b = ""
        b = a.join('^');
        this.setState({
            pttChannelLabel: b
        })
    }

    checkMode = (rule, value, callback) => {
        if (value.indexOf("^") != -1) {
            callback(this.tr("a_modeError"));
        }
        callback();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const callTr = this.props.callTr;
        const itemvalue = this.props.itemValues;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        return <Modal className="pttContent" width={900} title={callTr("a_ptt_channelSetting")} maskClosable={false}
                      onCancel={this.handleCancel}
                      visible={this.state.Modalvisible}
                      footer={[
                          <Button key="back" type="ghost" size="large"
                                  onClick={this.handleCancel}>{this.tr("a_cancel")}</Button>,
                          <Button key="submit" type="primary" onClick={this.handleOk}>
                              {this.tr("a_save")}
                          </Button>,
                      ]}>
            <div className="pttChannelBox">
                <div className="pttChannelBox_left">
                    <div className="pttRight_title">{callTr("a_ptt_channel")}</div>
                    {[...Array(25)].map((item, i) => {
                        return <div className={this.state.showChannelNum == i ? "pttChannel active" : "pttChannel"}
                                    onClick={this.showChannel.bind(this, i)}>
                            <span>{i + 1}&nbsp;&nbsp;</span>
                            {this.props.itemValues.emergencyChannel == i + 1 ? this.tr("a_modalemergencyChannel") : this.props.itemValues.priorityChannel == i + 1 ? this.tr("a_modalpriorityChannel") : ""}
                        </div>
                    })}
                </div>
                <div className="pttChannelBox_right">
                    <div className="pttRight_title">{parseInt(this.state.showChannelNum) + 1}</div>
                    <div style={{height: 10}}></div>
                    <FormItem {...formItemLayout} style={{width: '466px'}}
                              label={<span>{callTr("a_channelmodal1")}</span>}>
                        {getFieldDecorator("channel1", {})(
                            <Switch
                                checked={this.state.channelUsable ? !!parseInt(this.state.channelUsable[this.state.showChannelNum]) : false}
                                className="P-22187" onChange={this.changechannelUsable}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} style={{width: '466px'}}
                              label={<span>{callTr("a_channelmodal2")}</span>}>
                        {getFieldDecorator("channel2", {})(
                            <Switch
                                checked={this.state.channelTransmittable ? !!parseInt(this.state.channelTransmittable[this.state.showChannelNum]) : false}
                                className="P-22189" onChange={this.changechannelTransmittable}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} style={{width: '466px'}}
                              label={<span>{callTr("a_channelmodal3")}</span>}>
                        {getFieldDecorator("channel3", {})(
                            <Switch
                                checked={this.state.channelReceiveable ? !!parseInt(this.state.channelReceiveable[this.state.showChannelNum]) : false}
                                className="P-22190" onChange={this.changechannelReceiveable}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} style={{width: '466px'}}
                              label={<span>{callTr("a_channelmodal4")}</span>}>
                        {getFieldDecorator("channel4", {})(
                            <Switch
                                checked={this.state.channelJoinable ? !!parseInt(this.state.channelJoinable[this.state.showChannelNum]) : false}
                                className="P-22188" onChange={this.changechannelJoinable}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} style={{width: '466px'}}
                              label={<span>{callTr("a_channelmodal5")}</span>}>
                        {getFieldDecorator("pttChannelLabel", {
                            initialValue: this.props.itemValues.pttChannelLabel.split("^")[this.state.showChannelNum],
                            rules: [{
                                validator: this.checkMode
                            }],
                        })(
                            <Input style={{width: "240px"}} maxLength="32" className="P-22192"
                                   placeholder={callTr("a_pttmodal4")} onChange={this.changeLabel.bind(this)}/>
                        )}
                    </FormItem>
                </div>
            </div>
        </Modal>
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    userType: state.userType,
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues: Actions.getItemValues,
        setItemValues: Actions.setItemValues,
        jumptoTab: Actions.jumptoTab
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(channel));
