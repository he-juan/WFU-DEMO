import React, {Component, PropTypes} from 'react'
import Enhance from "../../../mixins/Enhance";
import {Layout, Form, Radio, Select, Input, Tooltip, Icon, Switch, Checkbox, Button, Slider, Modal} from "antd";
import * as Actions from '../../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

const Content = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const req_items = [
    {"name": "listenaddr0", "pvalue": "1569", "value": ""},
    {"name": "listenaddr1", "pvalue": "1571", "value": ""},
    {"name": "listenaddr2", "pvalue": "1573", "value": ""},
    {"name": "listenaddr3", "pvalue": "1575", "value": ""},
    {"name": "listenaddr4", "pvalue": "1577", "value": ""},
    {"name": "listenaddr5", "pvalue": "1579", "value": ""},
    {"name": "listenaddr6", "pvalue": "1581", "value": ""},
    {"name": "listenaddr7", "pvalue": "1583", "value": ""},
    {"name": "listenaddr8", "pvalue": "1585", "value": ""},
    {"name": "listenaddr9", "pvalue": "1587", "value": ""},
    {"name": "paginglabel0", "pvalue": "1570", "value": ""},
    {"name": "paginglabel1", "pvalue": "1572", "value": ""},
    {"name": "paginglabel2", "pvalue": "1574", "value": ""},
    {"name": "paginglabel3", "pvalue": "1576", "value": ""},
    {"name": "paginglabel4", "pvalue": "1578", "value": ""},
    {"name": "paginglabel5", "pvalue": "1580", "value": ""},
    {"name": "paginglabel6", "pvalue": "1582", "value": ""},
    {"name": "paginglabel7", "pvalue": "1584", "value": ""},
    {"name": "paginglabel8", "pvalue": "1586", "value": ""},
    {"name": "paginglabel9", "pvalue": "1588", "value": ""}
];

class channel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Modalvisible: false,
            whichModal: this.props.whichModal
        }
    }

    checkListenAddr = (rule, value, callback) => {
        if (value.length > 128)
            callback(this.tr("a_19805") + "128!");

        let valid = false;
        if (value != "") {
            value = $.trim(value);
            let re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
            if (re.test(value)) {
                if (RegExp.$1 > 223 && RegExp.$1 < 240 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
                    valid = true;
                }
            }
        }else{
            valid = true;
        }
        const itemvalue = this.props.itemValues;
        if (value != ""){
            if(value==itemvalue['multicastAddress'].split(":")[0]){
                callback(this.tr("a_pttAdressError2"));
                return;
            }
        }

        if (!valid)
            callback(this.tr("a_ipError"));
        else
            callback();
    }

    checkPort = (rule, value, callback) => {
        let valid = false;
        if (value != "") {
            if (value > 0 && value <= 65535) {
                valid = true
            } else {
                valid = false
            }
        }else{
            valid = true;
        }

        if (!valid)
            callback(this.tr("a_ipError2"));
        else
            callback();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.whichModal != this.props.whichModal) {
            this.setState({
                whichModal: nextProps.whichModal
            })
            if (this.props.itemValues['listenaddr' + nextProps.whichModal].indexOf(":") != -1) {
                this.props.form.setFieldsValue({
                    label: this.props.itemValues['paginglabel' + nextProps.whichModal],
                    addr1: this.props.itemValues['listenaddr' + nextProps.whichModal].split(":")[0],
                    addr2: this.props.itemValues['listenaddr' + nextProps.whichModal].split(":")[1],
                })
            } else {
                this.props.form.setFieldsValue({
                    label: this.props.itemValues['paginglabel' + nextProps.whichModal],
                    addr1: "",
                    addr2: "",
                })
            }
        }
        if (nextProps.Modalvisible != this.props.Modalvisible)
            this.setState({
                Modalvisible: nextProps.Modalvisible
            })
    }

    handleOk = () => {
        this.props.form.validateFieldsAndScroll(["label", "addr1", "addr2"], (err, values) => {
            if (!err) {
                let isSame=false
                for(var i=0;i<10;i++){
                    if(i!=this.props.whichModal&&this.props.itemValues['listenaddr'+i]!=0&&(values.addr1 + ":" + values.addr2)==this.props.itemValues['listenaddr'+i]){
                        isSame=true;
                        break;
                    }
                }
                if(isSame){
                    this.props.promptMsg("ERROR", "a_pttAdressError3");
                    return
                }

                let req_items = [
                    {
                        "name": "listenaddr" + this.state.whichModal,
                        "pvalue": 1569 + 2 * this.state.whichModal,
                        "value": ""
                    },
                    {
                        "name": "paginglabel" + this.state.whichModal,
                        "pvalue": 1570 + 2 * this.state.whichModal,
                        "value": ""
                    },
                ]
                if (values.addr1 == "") {
                    values[`listenaddr${this.state.whichModal}`] = "";
                    this.props.form.setFieldsValue({
                        addr1: "",
                        addr2: ""
                    })
                } else if (values.addr2 == "") {
                    values[`listenaddr${this.state.whichModal}`] = "";
                    this.props.form.setFieldsValue({
                        addr1: "",
                        addr2: ""
                    })
                } else {
                    values[`listenaddr${this.state.whichModal}`] = values.addr1 + ":" + values.addr2
                }
                values[`paginglabel${this.state.whichModal}`] = values.label
                this.props.setItemValues(req_items, values, 0, this.props.updateData);
                this.props.hideFun()
            }
        });
    }

    handleCancel = () => {
        this.props.hideFun()
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const callTr = this.props.callTr;
        const itemvalue = this.props.itemValues;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17}
        };
        return <Modal className="pttContent" title={callTr("a_ptt_channel") + (parseInt(this.state.whichModal) + 1)}
                      maskClosable={false}
                      onCancel={this.handleCancel} visible={this.state.Modalvisible}
                      footer={[
                          <Button key="back" type="ghost" size="large"
                                  onClick={this.handleCancel}>{this.tr("a_3")}</Button>,
                          <Button key="submit" type="primary" onClick={this.handleOk}>
                              {this.tr("a_17")}
                          </Button>,
                      ]}>
            <Form className="configform pttModal">
                <FormItem {...formItemLayout} label={<span>{callTr("a_label")}</span>} style={{width: '450px'}}>
                    {getFieldDecorator(`label`, {
                        initialValue: itemvalue[`paginglabel${this.state.whichModal}`]
                    })(
                        <Input maxLength="32" placeholder={callTr("a_pttmodal1")}/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={<span>{callTr("a_ptt_multicastAddress2")}</span>}
                          style={{width: '450px'}}>
                    {getFieldDecorator("addr1", {
                        initialValue: itemvalue[`listenaddr${this.state.whichModal}`] ? itemvalue[`listenaddr${this.state.whichModal}`].split(":")[0] : "",
                        rules: [{
                            validator: this.checkListenAddr
                        }],
                    })(
                        <Input maxLength="32" placeholder={callTr("a_pttmodal2")}/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={<span>{callTr("a_9207")}</span>}
                          style={{width: '450px'}}>
                    {getFieldDecorator("addr2", {
                        initialValue: itemvalue[`listenaddr${this.state.whichModal}`] ? itemvalue[`listenaddr${this.state.whichModal}`].split(":")[1] : "",
                        rules: [{
                            validator: this.checkPort
                        }],
                    })(
                        <Input maxLength="32" placeholder={callTr("a_pttmodal3")}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
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