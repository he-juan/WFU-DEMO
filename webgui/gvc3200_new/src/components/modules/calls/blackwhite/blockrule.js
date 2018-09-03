import React, {Component, PropTypes} from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Enhance from "../../../mixins/Enhance";
import ContactsEdit from "../../../ContactsEdit";
import { Input, Icon, Tooltip, Button, Checkbox, Table, Modal, Popconfirm, Form, Select } from "antd";
import * as Actions from '../../../redux/actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
const FormItem = Form.Item;
let req_items;

class Blockrule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            callpwdDisplay: '',
            pwdstatus:"password"
        }
        this.handleNvram();
    }

    handleNvram = () => {
        req_items = [];
        req_items.push(
            this.getReqItem("unwhitecall", "22209", ""),
            this.getReqItem("callpwd", "22223", "")
        )
        return req_items;
    }

    handlePwdVisible = () => {
        this.setState({pwdstatus: this.state.pwdstatus == "password" ? "text" : "password"});
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {
            this.checkoutvalue(values.unwhitecall)
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items, (values) => {
                    this.checkoutvalue(values.unwhitecall)
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
            if(!err) {
                let values = this.props.form.getFieldsValue();
                var re = /^\d+(?=\.{0,1}\d+$|$)/;
                if (values.unwhitecall == "1") {
                    if (values.callpwd.trim() == "") {
                        this.props.promptMsg('ERROR', 'a_callpwdfill');
                        return false;
                    } else if (!re.test(values.callpwd.trim())) {
                        this.props.promptMsg('ERROR', 'tip_requiredigit2');
                        return false;
                    } else if (values.callpwd.length > 32) {
                        this.props.promptMsg('ERROR', 'a_callpwd32');
                        return false;
                    }
                } else {
                    values.callpwd = '';
                }
                this.props.setItemValues(req_items, values);
            }
        });
    }

    checkoutvalue = (value) => {
        let callpwdDisplay;
        if (value == '1') {
            callpwdDisplay = 'display-block'
        } else {
            callpwdDisplay = "display-hidden"
        }
        this.setState({callpwdDisplay:callpwdDisplay})
    }

    onChangeMode = (value) => {
        this.checkoutvalue(value);
    }

    render() {
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const {getFieldDecorator} = this.props.form;

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={< span > {callTr("a_unwhitecall")}</span >}>
                    {getFieldDecorator("unwhitecall", {
                        rules: [],
                        initialValue: this.props.itemValues["unwhitecall"] ? this.props.itemValues["unwhitecall"] : "0"
                    })(
                        <Select onChange={ this.onChangeMode.bind(this) } className="p-22209">
                            <Option value="0">{callTr("a_blockcall")}</Option>
                            <Option value="1">{callTr("a_setpwd")}</Option>
                            <Option value="2">{callTr("a_answercall")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className={ this.state.callpwdDisplay } label={< span > {callTr("a_callpwd")}</span >}>
                    <Input type={this.state.pwdstatus} name = "callpwd" style= {{display:"none"}} disabled autocomplete = "off"/>
                    {getFieldDecorator("callpwd", {
                        rules:[],
                        initialValue: this.props.itemValues.callpwd
                    })(<Input type={this.state.pwdstatus} name="callpwd" className = "p-22223" suffix={<Icon type="eye" className={this.state.pwdstatus} onClick={this.handlePwdVisible} />}  />)}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
                </FormItem>
            </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; hideItem[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }

        return itemList;
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        cb_ping:Actions.cb_ping,
        promptMsg:Actions.promptMsg,
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Blockrule))
