import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import $ from 'jquery'
import { Form, Layout, Input, Icon, Tooltip, Button, Tabs } from "antd";
import * as optionsFilter from "../../template/optionsFilter"
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Content = Layout;

class EventnoticeForm extends Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if(!err) {
            this.props.setEventItems(values);
          }
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const checkUrlPath = this.props.checkUrlPath;
        let eventItems = this.props.eventItems;
        let eventItemsArr = [];
        let item;
        for (item in eventItems.headers) {
            eventItemsArr[item] = eventItems.headers[item]
        }

        let itemList =
            <Form className="configform" hideRequiredMark style={{'minHeight': this.props.mainHeight}}>
                <FormItem label={< span > { callTr("a_onboot") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('Setup', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.setup
                    })(<Input id="setup"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_670") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('IncomingCall', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.incomingcall
                    })(<Input id="IncomingCall"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_outgoingcall") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('Dial', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.dial
                    })(<Input id="Dial"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_onoffhook") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('OffHook', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.offhook
                    })(<Input id="OffHook"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_ononhook") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('OnHook', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.onhook
                    })(<Input id="OnHook"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_3524") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('MissCall', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.misscall
                    })(<Input id="MissCall"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_onconnected") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('CallStart', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.callstart
                    })(<Input id="CallStart"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_ondisconnected") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('CallStop', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.callstop
                    })(<Input id="CallStop"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_dndon") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('DndOn', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.dndon
                    })(<Input id="DndOn"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_dndoff") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('DndOff', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.dndoff
                    })(<Input id="DndOff"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_forwardon") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('ForwardingOn', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.forwardingon
                    })(<Input id="ForwardingOn"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_forwardoff") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('ForwardingOff', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.forwardingoff
                    })(<Input id="ForwardingOff"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_blindtransfer") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('BlindTransfer', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.blindtransfer
                    })(<Input id="BlindTransfer"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_attendtransfer") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('AttendTransfer', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.attendtransfer
                    })(<Input id="AttendTransfer"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_onhold") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('Hold', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.hold
                    })(<Input id="Hold"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_onunhold") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('UnHold', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.unhold
                    })(<Input id="UnHold"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_logon") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('LogOn', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.logon
                    })(<Input id="LogOn"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_logoff") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('LogOff', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.logoff
                    })(<Input id="LogOff"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_onregister") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('Register', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.register
                    })(<Input id="Register"/>)}
                </FormItem>
                <FormItem label={< span > { callTr("a_onunregister") } < Tooltip title={ callTipsTr("Action URL")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('Unregister', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: eventItemsArr.unregister
                    })(<Input id="Unregister"/>)}
                </FormItem>
                <FormItem >
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>;

        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length-1; hiddenOptions[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }

        return itemList;

    }
}

const MaintenanceEventnoticeForm = Form.create()(EventnoticeForm);

class Eventnotice extends Component {
    constructor(props) {
        super(props);
    }
    state = {};

    componentDidMount() {
        this.props.getEventItems();
    }

    render() {
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("maintenance_actionurl")}</div>
                <MaintenanceEventnoticeForm {...this.props} callTr={this.tr} callTipsTr={this.tips_tr} checkUrlPath={this.checkUrlPath} />
            </Content>
        )
    }
}

//const EventnoticeForm = Form.create()(Enhance(Eventnotice));
const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    eventItems: state.eventItems,
    mainHeight: state.mainHeight,
    userType: state.userType,
    enterSave: state.enterSave
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getEventItems:Actions.getEventItems,
        setEventItems:Actions.setEventItems
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Eventnotice));
