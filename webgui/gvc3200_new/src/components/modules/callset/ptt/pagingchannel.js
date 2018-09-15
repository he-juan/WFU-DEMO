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

class pagingchannel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Modalvisible: false,
            showChannelNum: "0",
            PagingchannelUsable: props.itemValues.PagingchannelUsable,
            PagingchannelJoinable: props.itemValues.PagingchannelJoinable,
            PagingchannelTransmittable: props.itemValues.PagingchannelTransmittable,
            PagingchannelReceiveable: props.itemValues.PagingchannelReceiveable,
            PagingChannelLabel: props.itemValues.PagingChannelLabel
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.Modalvisible != nextProps.Modalvisible) {
            this.setState({
                Modalvisible: nextProps.Modalvisible,
            })
        }
        if (this.props.itemValues.PagingchannelUsable != nextProps.itemValues.PagingchannelUsable) {
            this.setState({
                PagingchannelUsable: nextProps.itemValues.PagingchannelUsable,
            })
        }
        if (this.props.itemValues.PagingchannelJoinable != nextProps.itemValues.PagingchannelJoinable) {
            this.setState({
                PagingchannelJoinable: nextProps.itemValues.PagingchannelJoinable,
            })
        }
        if (this.props.itemValues.PagingchannelTransmittable != nextProps.itemValues.PagingchannelTransmittable) {
            this.setState({
                PagingchannelTransmittable: nextProps.itemValues.PagingchannelTransmittable,
            })
        }
        if (this.props.itemValues.PagingchannelReceiveable != nextProps.itemValues.PagingchannelReceiveable) {
            this.setState({
                PagingchannelReceiveable: nextProps.itemValues.PagingchannelReceiveable,
            })
        }
        if (this.props.itemValues.PagingChannelLabel != nextProps.itemValues.PagingChannelLabel) {
            this.setState({
                PagingChannelLabel: nextProps.itemValues.PagingChannelLabel,
            })
        }
    }

    handleOk = () => {
        this.props.form.validateFieldsAndScroll(["PagingChannelLabel"], (err) => {
            if (!err) {
                let req_items = [
                    {"name": "PagingchannelUsable", "pvalue": "22203", "value": ""},
                    {"name": "PagingchannelJoinable", "pvalue": "22204", "value": ""},
                    {"name": "PagingchannelTransmittable", "pvalue": "22205", "value": ""},
                    {"name": "PagingchannelReceiveable", "pvalue": "22206", "value": ""},
                    {"name": "PagingChannelLabel", "pvalue": "22207", "value": ""},
                    {"name": "PagingdefaultChannel", "pvalue": "22199", "value": ""},
                ]
                let values = {};
                values.PagingchannelUsable = this.state.PagingchannelUsable
                values.PagingchannelJoinable = this.state.PagingchannelJoinable
                values.PagingchannelTransmittable = this.state.PagingchannelTransmittable
                values.PagingchannelReceiveable = this.state.PagingchannelReceiveable
                values.PagingChannelLabel = this.state.PagingChannelLabel
                if (values.PagingchannelUsable[this.props.itemValues.PagingdefaultChannel - 26] == 0 || values.PagingchannelReceiveable[this.props.itemValues.PagingdefaultChannel - 26] == 0) {
                    let defaultchannel = "-1"
                    for (let i = 0; i < 25; i++) {
                        if (values.PagingchannelUsable[i] == 1 && values.PagingchannelReceiveable[i] == 1) {
                            defaultchannel = i + 1;
                            break;
                        }
                    }
                    values.PagingdefaultChannel = defaultchannel + 25
                } else {
                    values.PagingdefaultChannel = this.props.itemValues.PagingdefaultChannel
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
            PagingChannelLabel: this.state.PagingChannelLabel.split("^")[index] ? this.state.PagingChannelLabel.split("^")[index] : ""
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
        var a = this.state.PagingchannelUsable
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
            PagingchannelUsable: b,
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
        var a = this.state.PagingchannelJoinable
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
            PagingchannelJoinable: b
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
        var a = this.state.PagingchannelTransmittable
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
            PagingchannelTransmittable: b
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
        var a = this.state.PagingchannelReceiveable
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
            PagingchannelReceiveable: b
        })
    }

    changeLabel = (e) => {
        var a = this.state.PagingChannelLabel
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
            PagingChannelLabel: b
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
        return <Modal className="pttContent" width={900} title={callTr("a_SpectralinkSetting")} maskClosable={false}
                      onCancel={this.handleCancel}
                      visible={this.state.Modalvisible}
                      footer={[
                          <Button key="back" type="ghost" size="large"
                                  onClick={this.handleCancel}>{this.tr("a_3")}</Button>,
                          <Button key="submit" type="primary" onClick={this.handleOk}>
                              {this.tr("a_17")}
                          </Button>,
                      ]}>
            <div className="pttChannelBox">
                <div className="pttChannelBox_left">
                    <div className="pttRight_title">{callTr("a_ptt_channel")}</div>
                    {[...Array(25)].map((item, i) => {
                        return <div className={this.state.showChannelNum == i ? "pttChannel active" : "pttChannel"}
                                    onClick={this.showChannel.bind(this, i)}>
                            <span>{i + 26}&nbsp;&nbsp;</span>
                            {this.props.itemValues.PagingemergencyChannel == i + 26 ? this.tr("a_modalemergencyChannel") : this.props.itemValues.PagingpriorityChannel == i + 26 ? this.tr("a_modalpriorityChannel") : ""}
                        </div>
                    })}
                </div>
                <div className="pttChannelBox_right">
                    <div className="pttRight_title">{parseInt(this.state.showChannelNum) + 26}</div>
                    <div style={{height: 10}}></div>
                    <FormItem {...formItemLayout} style={{width: '466px'}}
                              label={<span>{callTr("a_channelmodal1")}</span>}>
                        {getFieldDecorator("channel11", {})(
                            <Switch
                                checked={this.state.PagingchannelUsable ? !!parseInt(this.state.PagingchannelUsable[this.state.showChannelNum]) : false}
                                className="P-22203" onChange={this.changechannelUsable}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} style={{width: '466px'}}
                              label={<span>{callTr("a_channelmodal2")}</span>}>
                        {getFieldDecorator("channel22", {})(
                            <Switch
                                checked={this.state.PagingchannelTransmittable ? !!parseInt(this.state.PagingchannelTransmittable[this.state.showChannelNum]) : false}
                                className="P-22205" onChange={this.changechannelTransmittable}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} style={{width: '466px'}}
                              label={<span>{callTr("a_channelmodal3")}</span>}>
                        {getFieldDecorator("channel33", {})(
                            <Switch
                                checked={this.state.PagingchannelReceiveable ? !!parseInt(this.state.PagingchannelReceiveable[this.state.showChannelNum]) : false}
                                className="P-22206" onChange={this.changechannelReceiveable}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} style={{width: '466px'}}
                              label={<span>{callTr("a_channelmodal44")}</span>}>
                        {getFieldDecorator("channel44", {})(
                            <Switch
                                checked={this.state.PagingchannelJoinable ? !!parseInt(this.state.PagingchannelJoinable[this.state.showChannelNum]) : false}
                                className="P-22204" onChange={this.changechannelJoinable}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} style={{width: '466px'}}
                              label={<span>{callTr("a_channelmodal5")}</span>}>
                        {getFieldDecorator("PagingChannelLabel", {
                            initialValue: this.props.itemValues.PagingChannelLabel.split("^")[this.state.showChannelNum],
                            rules: [{
                                validator: this.checkMode
                            }],
                        })(
                            <Input style={{width: "240px"}} maxLength="32" className="P-22207"
                                   placeholder={callTr("a_pttmodal44")} onChange={this.changeLabel.bind(this)}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(pagingchannel));