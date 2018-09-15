import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance";
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Checkbox, Select, Button, InputNumber, Modal} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [{"name":"distelnet", "pvalue":"276", "value":""},     // 禁止SSH访问
                    {"name":"accessmethod", "pvalue":"900", "value":""},　// 连接方式
                    {"name":"port", "pvalue":"901", "value":""},　　　　　//　端口
                    {"name":"confmenu", "pvalue":"1357", "value":""},
                    {"name":"apppermission", "pvalue":"29604", "value":""}];

let originProtocal = 0;
let originPort = 80;

class RmtacsForm extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {
            originProtocal = values['accessmethod'];
            originPort = values['port'];
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items, (values) => {
                    originProtocal = values['accessmethod'];
                    originPort = values['port'];
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    changeAccessMethod = (value) => {
        const form = this.props.form;
        let curport = form.getFieldValue("port");
        if(curport == "80" && value == "1"){
            form.setFieldsValue({
                port: 443
            });
        }
        else if(curport == "443" && value == "0"){
            form.setFieldsValue({
                port: 80
            });
        }
    }

    handleSubmit = () => {
        const callTr = this.props.callTr;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.props.setItemValues(req_items, values);
                let curProtocal = this.props.form.getFieldValue("accessmethod");
                let curPort = this.props.form.getFieldValue("port");
                if(!originProtocal){
                    originProtocal = 0
                }
                if (originProtocal != curProtocal || originPort != curPort) {
                    let url = window.parent.location.href;
                    let ip = url.split("/")[2];
                    let pos = ip.lastIndexOf(":");
                    if ( -1 != pos && ip.endsWith(originPort)) {
                        ip = ip.substring(0, pos);
                    }
                    let protocal = curProtocal == 0 ? "http://" : "https://";
                    let newUrl = protocal + ip + ":" + curPort;

                    Modal.info({
                        content: <span dangerouslySetInnerHTML={{__html: callTr("a_protocalchanged") + newUrl}}></span>,
                        okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                        onOk() {
                            window.parent.location.href = newUrl;
                        },
                    });
                }
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;

        let itemList =
            <Form hideRequiredMark>
                <FormItem label={<span>{callTr("a_16316")}<Tooltip title={callTipsTr("Disable SSH")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("distelnet", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['distelnet'])
                    })(
                        <Checkbox className="P-276"/>
                    )}
                    <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <FormItem label={<span>{callTr("a_12057")}<Tooltip title={callTipsTr("Access Methode")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("accessmethod", {
                        initialValue: itemvalue['accessmethod'] ? itemvalue['accessmethod'] : "0"
                    })(
                        <Select onChange={this.changeAccessMethod} className="P-900">
                            <Option value="0">HTTP</Option>
                            <Option value="1">HTTPS</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_1173")}<Tooltip title={callTipsTr("Port")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("port", {
                        rules: [{
                            required: true, message: callTr("tip_require")
                        },{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 1, 65535)
                            }
                        }],
                        initialValue: itemvalue['port']
                    })(
                        <Input className="P-901"/>
                    )}
                </FormItem>
                {/* <FormItem label={<span>{callTr("a_confmenu")}<Tooltip title={callTipsTr("Configuration via Keypad Menu")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("confmenu", {
                        initialValue: itemvalue['confmenu'] ? itemvalue['confmenu'] : "0"
                    })(
                        <Select className="P-1357">
                            <Option value="0">{callTr("a_16323")}</Option>
                            <Option value="1">{callTr("a_16324")}</Option>
                            <Option value="3">{callTr("a_basicset_netset")}</Option>
                            <Option value="2">{callTr("a_16325")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_apppermission")}<Tooltip title={callTipsTr("Permission to Install/Uninstall Apps")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("apppermission", {
                        initialValue: itemvalue['apppermission'] ? itemvalue['apppermission'] : "0"
                    })(
                        <Select className="P-29604">
                            <Option value="0">{callTr("a_allow")}</Option>
                            <Option value="1">{callTr("a_needpwd")}</Option>
                            <Option value="2">{callTr("a_needpwd2")}</Option>
                            <Option value="3">{callTr("a_notallow")}</Option>
                        </Select>
                    )}
                </FormItem> */}
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
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
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(Enhance(RmtacsForm));
