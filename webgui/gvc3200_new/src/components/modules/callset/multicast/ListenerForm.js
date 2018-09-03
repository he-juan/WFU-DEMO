import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Input, Button, Row, Col} from "antd";
const FormItem = Form.Item;

const req_items = [{"name":"listenaddr0", "pvalue":"1569", "value":""},
                    {"name":"listenaddr1", "pvalue":"1571", "value":""},
                    {"name":"listenaddr2", "pvalue":"1573", "value":""},
                    {"name":"listenaddr3", "pvalue":"1575", "value":""},
                    {"name":"listenaddr4", "pvalue":"1577", "value":""},
                    {"name":"listenaddr5", "pvalue":"1579", "value":""},
                    {"name":"listenaddr6", "pvalue":"1581", "value":""},
                    {"name":"listenaddr7", "pvalue":"1583", "value":""},
                    {"name":"listenaddr8", "pvalue":"1585", "value":""},
                    {"name":"listenaddr9", "pvalue":"1587", "value":""},
                    {"name":"paginglabel0", "pvalue":"1570", "value":""},
                    {"name":"paginglabel1", "pvalue":"1572", "value":""},
                    {"name":"paginglabel2", "pvalue":"1574", "value":""},
                    {"name":"paginglabel3", "pvalue":"1576", "value":""},
                    {"name":"paginglabel4", "pvalue":"1578", "value":""},
                    {"name":"paginglabel5", "pvalue":"1580", "value":""},
                    {"name":"paginglabel6", "pvalue":"1582", "value":""},
                    {"name":"paginglabel7", "pvalue":"1584", "value":""},
                    {"name":"paginglabel8", "pvalue":"1586", "value":""},
                    {"name":"paginglabel9", "pvalue":"1588", "value":""}];

class ListenerForm extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
    }

    checkDialIPv6_withPort = (ip) => {
        let exp = /^(((\[([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4}\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4}\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4}\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4}\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4}\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[[0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4}\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4}\]:)(([1-9]([0-9]){0,4})|([0-9])))|((\[([0-9A-Fa-f]{1,4}:){1,7}:\]:)(([1-9]([0-9]){0,4})|([0-9]))))$/;
        let flag = ip.match(exp);
        if (flag != undefined && flag != "") {
            return true;
        } else {
            return false;
        }
    }

    checkListenAddr = (rule, value, callback) => {
        const form = this.props.form;
        if(value.length > 128)
            callback(rule.method("a_lengthlimit") + "128!");

        let valid = false;
        if(value != ""){
            value = $.trim(value);

            let ipaddr = value.split(":");
            if(ipaddr.length <= 2){
                if(ipaddr[1] > 0 && ipaddr[1] <= 65535 ){
                    let re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
                    if(re.test(ipaddr[0]))
                    {
                        if(RegExp.$1>223 && RegExp.$1<240 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256){
                            valid = true;
                            value = ipaddr[0] + ":" + parseInt(ipaddr[1]);
                            form.setFieldsValue({[rule.id]: value});
                        }
                    }
                }
            }else{
                if(this.checkDialIPv6_withPort(value))
                    valid = true;
            }
        }
        else{
            valid = true;   //allow to be blank
        }

        if(!valid)
            callback(rule.method("a_ipporterror"));
        else
            callback();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items);
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
                this.props.setItemValues(req_items, values, 1);
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const itemvalue = this.props.itemValues;

        return(
            <Form hideRequiredMark style={{"width":"800px", "margin-left":"100px"}}>
                <Row className="pagingtitle" type="flex" justify="space-around">
                    <Col span={2}>{callTr("a_priority")}</Col>
                    <Col span={11}>{callTr("a_listenaddr")}</Col>
                    <Col span={11}>{callTr("a_label")}</Col>
                </Row>
                {
                    [...Array(10)].map((item, i) => {
                        return (
                            <Row type="flex" justify="space-around" key={i} >
                                <Col span={2} className="pagingorder" >{i+1}</Col>
                                <Col span={11}>
                                    <FormItem className="colitem">
                                        {getFieldDecorator(`listenaddr${i}`, {
                                            rules:[{
                                                method: callTr, validator: this.checkListenAddr, id:`listenaddr${i}`
                                            }],
                                            initialValue: itemvalue[`listenaddr${i}`]
                                        })(
                                            <Input className="listenaddr" />
                                        )}
                                        <Icon title={callTr("a_rebooteffect")} className="rebooticon" type="exclamation-circle-o" />
                                    </FormItem>
                                </Col>
                                <Col span={11}>
                                    <FormItem className="colitem">
                                        {getFieldDecorator(`paginglabel${i}`, {
                                            initialValue: itemvalue[`paginglabel${i}`]
                                        })(
                                            <Input className="paginglabel" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        )
                    })
                }
                <FormItem>
                    <Button className="submit" type="primary" size="large" style={{marginLeft: '132%'}} onClick={this.handleSubmit}>
                        {callTr("a_save")}
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(ListenerForm);
