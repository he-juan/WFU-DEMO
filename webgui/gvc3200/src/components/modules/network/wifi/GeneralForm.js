import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance";
import * as Actions from '../../../redux/actions/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Form, Tooltip, Icon, Input, Checkbox, Radio, Button, Switch, Row, Col, Modal, Select} from "antd";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const req_items = [{"name":"wififunc", "pvalue":"7800", "value":""}];

class DetailForm extends Component {
    constructor(props){
        super(props);

        this.state = {
            type: "password",
            display: "display-hidden",
            static: "display-hidden",
            ipaddrdisplay: "display-block",
            ipv4addrdisplay: "display-hidden",
            ipv6addrdisplay: "display-hidden",
            phase2arr: ["0:a_20", "3:MSCHAPV2", "4:GTC"],
            cert_iden_visible: ["display-block", "display-hidden", "display-block", "display-block", "display-block"],
        }
    }

    componentDidMount = () => {
        let protocoltype = this.props.protocoltype;
        this.initIpaddressDisplay(protocoltype);
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.wifiData.bssid != nextProps.wifiData.bssid){
            this.handleResetForm();

            if(nextProps.wifiData.securityStr.toUpperCase().indexOf("802.1X") != -1){
                this.ctrlCertConfig("0");
            }
        }

        if(!nextProps.needmodify && this.props.needmodify){
            this.handleResetForm();
        }

        if(this.props.protocoltype != nextProps.protocoltype){
            this.initIpaddressDisplay(nextProps.protocoltype);
        }
    }

    initIpaddressDisplay = (protocoltype) =>{
        if(this.isWP8xx() ){
            this.setState({ipaddrdisplay:"display-hidden"});
            if(protocoltype == "0" || protocoltype == "1"){
                this.setState({
                    ipv4addrdisplay:"display-block",
                    ipv6addrdisplay: "display-block"
                });
            }else if(protocoltype == "2"){
                this.setState({
                    ipv4addrdisplay:"display-block",
                    ipv6addrdisplay: "display-hidden"
                });
            }else if(protocoltype == "3"){
                this.setState({
                    ipv4addrdisplay:"display-hidden",
                    ipv6addrdisplay: "display-block"
                });
            }
        }
    }



    handleResetForm = () => {
        this.props.form.resetFields();
        this.setState({
            display: "display-hidden",
            static: "display-hidden",
        });
    }

    handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
    }

    checkPwdLength = (rule, value, callback) => {
        const securitystr = this.props.wifiData.securityStr.toUpperCase();

        /*for 802.1X password is not required*/
        if(securitystr.indexOf("802.1X") == -1){
            if(value == ""){
                callback(this.props.callTr("a_19637"));
            }else if(securitystr.indexOf("WEP") != -1){
                /* WEP password only allowed the length of 5,10,13,26,16,32 */
                let allowedLength = [5, 10, 13, 26, 16, 32];
                let checkres = allowedLength.some((curvalue, i) => {
                    return value.length == curvalue;
                })
                if(!checkres){
                    callback(this.props.callTr("a_pwdlengthallowed"));
                }
            }else if(value != "" && value.length < 8){
                callback(this.props.callTr("a_pwdlengthlimit"));
            }
        }

        callback();
    }

    showAdvOption = (e) => {
        var iptype = this.props.form.getFieldValue("nettype");
        let checked = e.target.checked;
        this.setState({
            display: checked ? "display-block" : "display-hidden",
            static: checked && iptype == "1" ? "display-block" : "display-hidden",
        })
    }

    netTypeChange = (e) => {
        this.setState({
            static: e.target.value == "1" ? "display-block" : "display-hidden",
        })
    }

    /*configs related to certification would be different when EAP method changed*/
    ctrlCertConfig = (value) => {
        switch (value) {
            case "0":
                this.setState({
                    phase2arr: ["0:a_20", "3:MSCHAPV2", "4:GTC"],
                    cert_iden_visible: ["display-block", "display-hidden", "display-block", "display-block", "display-block"],
                });
                break;
            case "1":
                this.setState({
                    phase2arr: [],
                    cert_iden_visible: ["display-block", "display-block", "display-block", "display-hidden", "display-hidden"],
                });
                break;
            case "2":
                this.setState({
                    phase2arr: ["0:a_20", "1:PAP", "2:MSCHAP", "3:MSCHAPV2", "4:GTC"],
                    cert_iden_visible: ["display-block", "display-hidden", "display-block", "display-block", "display-block"],
                });
                break;
            case "3":
                this.setState({
                    phase2arr: [],
                    cert_iden_visible: ["display-hidden", "display-hidden", "display-block", "display-hidden", "display-block"],
                });
                break;
        }
    }

    checkIpv6  = (data, value, callback) => {
        const reg = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:)|(\[([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[[0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){1,7}:\](:[1-9]([0-9]){0,4}){0,1}))$/
        if (value && !reg.test(value)) {
            callback(this.tr("a_19657"));
        } else {
            callback()
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {callTr, needmodify, protocoltype} = this.props;
        const wifidata = this.props.wifiData;
        const strengtharr = ["无", "弱", "一般", "较强", "强"];
        let securitystr = wifidata.securityStr;
        if(securitystr.toLowerCase() == "none"){
            securitystr = callTr("a_20");
        }

        let itemstatus = "display-hidden";
        if(wifidata.isConnected == "CONNECTED"){
            itemstatus = "display-block";
        }

        return (
            <Form className="wifi-detail-form" hideRequiredMark>
                {
                    wifidata.staticip ?
                    <FormItem className={this.state.ipaddrdisplay} label={<span>{callTr("a_23531")}</span>}>
                        <span>{wifidata.staticip}</span>
                    </FormItem>
                    : ""
                }
                {
                    wifidata.staticip ?
                    <FormItem className={this.state.ipv4addrdisplay} label={<span>{callTr("a_4313")}</span>}>
                        <span>{wifidata.staticip}</span>
                    </FormItem> : ""
                }
                {
                    wifidata.staticip6 ?
                    <FormItem className={this.state.ipv6addrdisplay} label={<span>{callTr("a_19226")}</span>}>
                        <span>{wifidata.staticip6}</span>
                    </FormItem> : ""
                }
                <FormItem label={<span>{callTr("a_10060")}</span>} className={itemstatus}>
                    <span>{callTr("a_23529")}</span>
                </FormItem>
                <FormItem label={<span>{callTr("a_wifistrength")}</span>}>
                    <span>{strengtharr[parseInt(wifidata.level)]}</span>
                </FormItem>
                <FormItem label={<span>{callTr("a_linkspeed")}</span>} className={itemstatus}>
                    <span>{wifidata.speed ? wifidata.speed + " Mbps" : ''}</span>
                </FormItem>
                <FormItem label={<span>{callTr("a_frequency")}</span>} className={itemstatus}>
                    <span>{wifidata.frequency ? wifidata.frequency : ''}</span>
                </FormItem>
                <FormItem label={<span>{callTr("a_authmode")}</span>}>
                    <span>{securitystr}</span>
                </FormItem>

                {securitystr.toUpperCase().indexOf("802.1X") != -1 && wifidata.isSaved == "false" ?
                    <div>
                        <FormItem label={<span>{callTr("a_eapmethod")}</span>}>
                            {getFieldDecorator("eapmethod", {
                                initialValue: "0"
                            })(
                                <Select onChange={this.ctrlCertConfig}>
                                    <Option value="0">PEAP</Option>
                                    <Option value="1">TLS</Option>
                                    <Option value="2">TTLS</Option>
                                    <Option value="3">PWD</Option>
                                </Select>
                            )}
                        </FormItem>
                        {
                            this.state.phase2arr.length ?
                            <FormItem label={<span>{callTr("a_phase2")}</span>}>
                                {getFieldDecorator("phase2", {
                                    initialValue: "0"
                                })(
                                    <Select>
                                    {
                                        this.state.phase2arr.map((option, i) => {
                                            option = option.split(":");
                                            return <Option value={option[0]}>{callTr(option[1])}</Option>
                                        })
                                    }
                                    </Select>
                                )}
                            </FormItem> : ""
                        }
                        <FormItem label={<span>{callTr("a_19667")}</span>} className={this.state.cert_iden_visible[0]}>
                            {getFieldDecorator("cacert", {
                                initialValue: ""
                            })(
                                <Select>
                                    <Option value="">{"(" + callTr("a_unspec") + ")"}</Option>
                                    {
                                        eval(wifidata.cacerts).length ? eval(wifidata.cacerts).map((ca, i) => {
                                            return <Option value={ca.cacert}>{ca.cacert}</Option>
                                        }) : <Option value="">{"(" + callTr("a_unspec") + ")"}</Option>
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={<span>{callTr("a_usercert")}</span>} className={this.state.cert_iden_visible[1]}>
                            {getFieldDecorator("usercert", {
                                initialValue: ""
                            })(
                                <Select>
                                    <Option value="">{"(" + callTr("a_unspec") + ")"}</Option>
                                    {
                                        eval(wifidata.userCert).length ? eval(wifidata.userCert).map((uscert, i) => {
                                            return <Option value={uscert.userCert}>{uscert.userCert}</Option>
                                        }) : <Option value="">{"(" + callTr("a_unspec") + ")"}</Option>
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label={<span>{callTr("a_iden802")}</span>} className={this.state.cert_iden_visible[2]}>
                            {getFieldDecorator("identity", {
                                initialValue: ""
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem label={<span>{callTr("a_anonyiden")}</span>} className={this.state.cert_iden_visible[3]}>
                            {getFieldDecorator("anonyidentity", {
                                initialValue: ""
                            })(
                                <Input />
                            )}
                        </FormItem>
                    </div>
                : ""}
                <div className={wifidata.isSaved == "true" && !needmodify ? "display-hidden" : "display-block"}>
                    <FormItem label={<span>{callTr("a_6759")}</span>} className={this.state.cert_iden_visible[4]} style={{display: wifidata.security == '0' ? 'none' : 'block'}}>
                        {getFieldDecorator("wifipwd", {
                            rules: [{
                                validator: this.checkPwdLength
                            }],
                            initialValue: ""
                        })(
                            <Input type={this.state.type} suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />}/>
                        )}
                    </FormItem>
                    <FormItem label={<span>{callTr("a_advancedoption")}</span>}>
                        {getFieldDecorator("advanoption", {
                            valuePropName: 'checked',
                            initialValue: 0
                        })(
                            <Checkbox onChange={this.showAdvOption} />
                        )}
                    </FormItem>
                    <div className={this.state.display}>
                        <FormItem label={<span>{"IP " + callTr("a_4150")}</span>}>
                            {getFieldDecorator("nettype", {
                                initialValue: wifidata.staticip ? "1" : "0"
                            })(
                                <RadioGroup onChange={this.netTypeChange}>
                                    <Radio value="0">DHCP</Radio>
                                    <Radio value="1">{callTr("a_4125")}</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </div>
                    <div className={this.state.static}>
                        {
                            protocoltype == "3" && this.isWP8xx() ? "":
                            <div>
                                <p className="blocktitle" style={this.isWP8xx() ? {display:'block'} : {display:'none'}}><s></s>IPv4</p>
                                <FormItem label={<span>{callTr("a_23531")}</span>}>
                                    {getFieldDecorator("ipaddr", {
                                        rules: [{
                                            validator: (data, value, callback) => {
                                                this.ipAddress(data, value, callback);
                                            }
                                        }, {
                                            required: true, message: callTr("a_19637")
                                        }],
                                        initialValue: wifidata.staticip ? wifidata.staticip : ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_16191")}</span>}>
                                    {getFieldDecorator("gateway", {
                                        rules: [{
                                            validator: (data, value, callback) => {
                                                this.ipAddress(data, value, callback);
                                            }
                                        }, {
                                            required: true, message: callTr("a_19637")
                                        }],
                                        initialValue: wifidata.staticgateway ? wifidata.staticgateway : ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_netprefix")}</span>}>
                                    {getFieldDecorator("netprefix", {
                                        rules: [{
                                            validator: (data, value, callback) => {
                                                this.digits(data, value, callback);
                                            }
                                        }, {
                                            validator: (data, value, callback) => {
                                                this.range(data, value, callback, 0, 32);
                                            }
                                        },{
                                            required: true, message: callTr("a_19637")
                                        }],
                                        initialValue: wifidata.staticprefixlength ? wifidata.staticprefixlength : ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label={<span>DNS 1</span>}>
                                    {getFieldDecorator("dns1", {
                                        rules: [{
                                            validator: (data, value, callback) => {
                                                this.ipAddress(data, value, callback);
                                            }
                                        }, {
                                            required: true, message: callTr("a_19637")
                                        }],
                                        initialValue: wifidata.staticprefixdnsone ? wifidata.staticprefixdnsone : ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem label={<span>DNS 2</span>}>
                                    {getFieldDecorator("dns2", {
                                        rules: [{
                                            validator: (data, value, callback) => {
                                                this.ipAddress(data, value, callback);
                                            }
                                        }],
                                        initialValue: wifidata.staticprefixdnstwo ? wifidata.staticprefixdnstwo : ""
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                            </div>

                        }
                        {
                            protocoltype != "2" && this.isWP8xx() ?
                            <div>
                                <p className={"blocktitle"} ><s></s>IPv6</p>
                                <FormItem label={<span> {callTr("a_19309")}</span >}>
                                    {getFieldDecorator('staticipv6addr', {
                                        rules: [{
                                            required: true,
                                            message: callTr("a_19637")
                                        },{
                                                validator: (data, value, callback) => {
                                                    this.checkIpv6(data, value, callback)
                                                }
                                            }
                                        ],
                                        initialValue: wifidata.staticip6 ? wifidata.staticip6 : ""
                                    })(<Input maxLength="40"/>)}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_19310")}</span >}>
                                    {getFieldDecorator('ipv6prefixlen', {
                                        rules: [{
                                            required: true,
                                            message: callTr("a_19637")
                                        },{
                                            validator: (data, value, callback) => {
                                                this.digits(data, value, callback)
                                            }
                                        },{
                                            validator: (data, value, callback) => {
                                                this.range(data, value, callback,1,128)
                                            }
                                        }],
                                        initialValue: wifidata.static6prefixlength ? wifidata.static6prefixlength : ""
                                    })(<Input maxLength="40"/>)
                                    }
                                </FormItem>
                                <FormItem label={<span> {callTr("a_19227")}</span>}>
                                    {getFieldDecorator('ipv6dns1', {
                                        rules: [{
                                            required: true,
                                            message: callTr("a_19637")
                                        }, {
                                                validator: (data, value, callback) => {
                                                    this.checkIpv6(data, value, callback)
                                                }
                                            }
                                        ],
                                        initialValue: wifidata.static6dnsone ? wifidata.static6dnsone : ""
                                    })(<Input maxLength="40"/>)}
                                </FormItem>
                                <FormItem label={<span> {callTr("a_19228")}</span >}>
                                    {getFieldDecorator('ipv6dns2', {
                                        rules: [
                                            {
                                                validator: (data, value, callback) => {
                                                    this.checkIpv6(data, value, callback)
                                                }
                                            }
                                        ],
                                        initialValue: wifidata.static6dnstwo ? wifidata.static6dnstwo : ""
                                    })(<Input maxLength="40"/>)}
                                </FormItem>
                            </div> : ""
                        }


                    </div>
                </div>
            </Form>
        )
    }
}

const WifiDetailForm = Form.create()(Enhance(DetailForm));

class GeneralForm extends Component {
    constructor(props){
        super(props);

		this.state = {
			disabled: true,
            visible: false,
            wifi: {ssid: "", security: "", level: "", isSaved: "", isConnected: ""},
            wifiresult: [],
            confirmLoading: false,
            needmodify: false,
            protocoltype: "0",
		}
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {

            this.setState({
                protocoltype: values['protocoltype'] ? values['protocoltype'] : "0"
            });
            if(values['wififunc'] == "1"){
                this.setState({
                    disabled: false
                });

                this.handleWifiScan();
                this.refreshWifiList = setInterval(
                    () => this.handleWifiScan(),
                    15000
                )
            }
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(req_items, (values) => {
                    this.setState({
                        protocoltype: values['protocoltype'] ? values['protocoltype'] : "0"
                    });
                    if(values['wififunc'] == "1"){
                        this.setState({
                            disabled: false
                        });

                        this.handleWifiScan();
                        this.refreshWifiList = setInterval(
                            () => this.handleWifiScan(),
                            15000
                        )
                    }
                });
                this.props.form.resetFields();
            }
        }else{
            clearInterval(this.refreshWifiList);
        }
	}

    componentWillUnmount = () => {
        clearInterval(this.refreshWifiList);
    }

    changeProtocaltype =(val) =>{
    }

	handleWifiChange = (checked) => {
        let nvram = ["7800"];
        let pvalue;
        if(checked){
            pvalue = ["1"];
        }else{
            pvalue = ["0"];
        }

        this.props.putNvrams(nvram, pvalue, "", () => {
            this.setState({
    			disabled: !checked,
                wifiresult: [],
                loading: false
            });
            if(checked) {
                this.handleWifiScan();
                this.refreshWifiList = setInterval(
                    () => this.handleWifiScan(),
                    15000
                )
            }
        });
	}

    handleWifiScan = () => {
        this.props.getItemValues(req_items, (values) => {
            if(values['wififunc'] == "1"){
                this.setState({loading: true});

                setTimeout(() => {
                    this.props.getWifiResult((tObj) => {
                        if(tObj.res == "success"){
                            this.handleWifiList(0, []);
                        }
                    });
                }, 800);
            }else{
                /*in case the wifi switch is turned off on lcd*/
                this.handleWifiChange(false);
                this.props.form.setFieldsValue({wififunc: 0});
            }
        });
    }

    handleWifiList = (start, wifiList) => {
        this.props.getWifiList(start, (tObj) => {
            if(!this.refs.generalForm) return;
            if (tObj.msg == "no ap") {
                setTimeout(this.handleWifiList(start, wifiList), 1000);
            } else if (tObj.res == "success" && !this.state.disabled) {
                var count = tObj.count;
                var len = tObj.list.length;
                wifiList = wifiList.concat(tObj.list);

                let connectedAP = -1;
                for (let i in wifiList) {
                    if (wifiList[i].isConnected == "CONNECTED") {
                        connectedAP = i;
                        break;
                    }
                }

                if (connectedAP > 0) {
                    /* swap the two SSIDs to move the connected SSID to the top of the list. (ES6结构赋值) */
                    [wifiList[0], wifiList[connectedAP]] = [wifiList[connectedAP], wifiList[0]];
                }

                this.setState({
                    wifiresult: wifiList
                });
                
                if ((start + len) >= count) {
                    this.setState({
                        loading: false
                    });
                } else {
                    start += len;
                    setTimeout(this.handleWifiList(start, wifiList), 200);
                }
            }
        })
    }

    editWifiInfo = (index) => {
        const wifilist = this.state.wifiresult;

        /*there is no need to show Modal for unsaved open wifi*/
        if(wifilist[index].security == "0" && wifilist[index].isSaved == "false"){
            this.setState({wifi: wifilist[index]}, () => {this.handleConnect()});
            return;
        }

        this.setState({
            visible: true,
            wifi: wifilist[index]
        }, () => {
            clearInterval(this.refreshWifiList);
            if(document.querySelector(".custombtn") != undefined){
                let forgetbtn = document.querySelector(".forgetbtn");
                let modifybtn = document.querySelector(".modifybtn");
                if(wifilist[index].isSaved == "true"){
                    forgetbtn.innerHTML = this.props.callTr("a_forget");
                    modifybtn.innerHTML = this.props.callTr("a_22");
                    forgetbtn.style.display = "block";
                    modifybtn.style.display = "block";
                }else{
                    forgetbtn.style.display = "none";
                    modifybtn.style.display = "none";
                }
            }else{
                this.addCustomBtn();
            }
        });
    }

    /*wifi can be forgotten & modified, add custom buttons on wifi modal*/
    addCustomBtn = () => {
        const wifidata = this.state.wifi;
        if(wifidata.isSaved == "true"){
            let modelfooter = document.querySelector(".ant-modal-footer");

            let modifybtn = document.createElement("Button");
            modifybtn.className = "ant-btn ant-btn-lg modifybtn custombtn";
            modifybtn.setAttribute("type", "button");
            modifybtn.innerHTML = this.props.callTr("a_22");
            modelfooter.insertBefore(modifybtn, modelfooter.childNodes[0]);

            let forgetbtn = document.createElement("Button");
            forgetbtn.className = "ant-btn ant-btn-lg forgetbtn custombtn";
            forgetbtn.setAttribute("type", "button");
            forgetbtn.innerHTML = this.props.callTr("a_forget");
            modelfooter.insertBefore(forgetbtn, modelfooter.childNodes[0]);

            document.querySelector(".modifybtn").onclick = e => {
                this.handleModifyWifi();
            }

            document.querySelector(".forgetbtn").onclick = e => {
                this.handleForgetWifi();
            }
        }
    }

    wifiModalHidden = (flag) => {
        //flag: 0-connect unsaved wifi   1-forget wifi or disconnect wifi   2-cancel modal
        switch (flag) {
            case 0:
                this.props.promptMsg('SUCCESS', 'a_checkwifi');
                setTimeout(() => {
                    this.setState({
                        confirmLoading: false,
                        visible: false
                    }, () => {
                        this.handleWifiScan();
                        this.refreshWifiList = setInterval(
                            () => this.handleWifiScan(),
                            15000
                        );
                    });
                }, 5000);
                break;
            case 1:
                this.props.promptMsg('SUCCESS', 'a_checkwifi');
                this.handleWifiScan();
                this.refreshWifiList = setInterval(
                    () => this.handleWifiScan(),
                    15000
                )
            case 2:
                this.setState({visible: false});
                break;
        }

        if(this.state.needmodify){
            this.setState({needmodify: false});
        }
    }

    handleForgetWifi = () => {
        const networkid = this.state.wifi.networkId;
        this.props.forgetWifi(networkid);
        this.wifiModalHidden(1);
    }

    handleModifyWifi = () => {
        this.setState({needmodify: true});
    }

    handleCancle = () => {
        const wifi = this.state.wifi;
        this.wifiModalHidden(2);
    }

    handleConnect = () => {
        const form = this.props.form;
        const curwifi = this.state.wifi;

        let checkresult = true;
        if (curwifi.isSaved == "false") {
            form.validateFieldsAndScroll(['wifipwd'], (err, values) => {
                if (err)
                    checkresult = false;
            });
        }

        if (form.getFieldValue("nettype") == "1") {
            var validateFields = ['ipaddr', 'gateway', 'netprefix', 'dns1'];
            if (this.isWP8xx()) {
                if (form.getFieldValue("protocoltype") == "3") {
                    validateFields = ['staticipv6addr', 'ipv6prefixlen', 'ipv6dns1']
                }
                if (form.getFieldValue("protocoltype") == "0" || form.getFieldValue("protocoltype") == "1") {
                    validateFields = ['ipaddr', 'gateway', 'netprefix', 'dns1', 'staticipv6addr', 'ipv6prefixlen', 'ipv6dns1'];
                }
            }
            form.validateFieldsAndScroll(validateFields, (err, values) => {
                if (err)
                    checkresult = false;
            });
        }

        if (!checkresult) {
            return;
        }

        if (curwifi.isSaved == "true" && !this.state.needmodify) {
            if (curwifi.isConnected == "CONNECTED") {
                //disconnect
                this.props.disconnectWifi();
                this.wifiModalHidden(1);
            } else {
                //connect saved wifi
                this.props.connectSavedWifi(curwifi.networkId);
                this.setState({confirmLoading: true});
                this.wifiModalHidden(0);
            }
        } else {
            let wifidataarr = [];

            let eap = -1, phase2 = -1;
            if (curwifi.securityStr.toUpperCase().indexOf("802.1X") != -1) {
                eap = form.getFieldValue("eapmethod");
                if (eap == "0" || eap == "2") {
                    phase2 = form.getFieldValue("phase2");
                }
            }
            let saveplusconn = 1;
            if (this.state.needmodify) saveplusconn = 0;
            wifidataarr.push({name: "ssid", value: curwifi.ssid},
                {name: "bssid", value: curwifi.bssid},
                {name: "security", value: curwifi.security},
                {name: "networkid", value: curwifi.networkId},
                {name: "password", value: encodeURIComponent(form.getFieldValue("wifipwd"))},
                {name: "eap", value: eap},
                {name: "phase2", value: phase2},
                {name: "cacert", value: form.getFieldValue("cacert")},
                {name: "userca", value: form.getFieldValue("usercert")},
                {name: "identity", value: form.getFieldValue("identity")},
                {name: "anonymous", value: form.getFieldValue("anonyidentity")},
                {name: "istatic", value: form.getFieldValue("nettype")},
                {name: "ipaddr", value: form.getFieldValue("ipaddr") ? form.getFieldValue("ipaddr") : ""},
                {name: "gateway", value: form.getFieldValue("gateway") ? form.getFieldValue("gateway") : ""},
                {name: "prefix", value: form.getFieldValue("netprefix") ? form.getFieldValue("netprefix") : ""},
                {name: "dns1", value: form.getFieldValue("dns1") ? form.getFieldValue("dns1") : ""},
                {name: "dns2", value: form.getFieldValue("dns2") ? form.getFieldValue("dns2") : ""},
                {name: "ip6addr", value: form.getFieldValue("staticipv6addr") ? form.getFieldValue("staticipv6addr") : ""},
                {name: "ip6prefix", value: form.getFieldValue("ipv6prefixlen") ? form.getFieldValue("ipv6prefixlen") : ""},
                {name: "ip6dns1", value: form.getFieldValue("ipv6dns1") ? form.getFieldValue("ipv6dns1") : ""},
                {name: "ip6dns2", value: form.getFieldValue("ipv6dns2") ? form.getFieldValue("ipv6dns2") : ""},
                {name: "saveplusconn", value: saveplusconn});  //saveplusconn: false - only save   true - save plus connect

            this.props.connectWifi(wifidataarr);
            if (saveplusconn) {
                this.setState({confirmLoading: true});
                this.wifiModalHidden(0);
            } else {
                this.wifiModalHidden(1);
            }
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const callTipsTr = this.props.callTipsTr;
        const itemvalue = this.props.itemValues;
        let oktext = "";
        if(this.state.needmodify){
            oktext = "a_17";
        }else{
            if (this.state.wifi.isConnected == "CONNECTED"){
                oktext = "a_disconnect";
            }else{
                oktext = "a_connect";
            }
        }
        return(
            <Form hideRequiredMark ref="generalForm">
                <FormItem label={<span>{callTr("a_wififunc")}<Tooltip title={callTipsTr("Wi-Fi Function")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("wififunc", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['wififunc']) == 1
                    })(
                        <Switch checkedChildren={callTr("a_7")} unCheckedChildren={callTr("a_downoff")}
							onChange={this.handleWifiChange}/>
                    )}
                </FormItem>
                <FormItem className="essid" label={<span>ESSID<Tooltip title={callTipsTr("ESSID")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("essid")(
						<div>
							<div>
                                <Tooltip placement="right" title={callTr("a_wifiautoscan")}>
                                    <Button type="primary" disabled={this.state.disabled} onClick={this.handleWifiScan} loading={this.state.loading}>
                                        {callTr("a_scan")}
                                    </Button>
                                </Tooltip>
                            </div>
                            <div className="wifilist">
                                {
                                    !this.state.wifiresult.length ? <div className="nowifi"><div></div><p>{callTr("a_10082")}</p></div> :
                                    <div>
                                        {
                                            this.state.wifiresult[0].isConnected == "CONNECTED" ?
                                            <Row className="wifirow connectedwifi" type="flex" justify="space-around">
                                                <Col span={12}>{this.state.wifiresult[0].ssid}</Col>
                                                <Col span={4}><div className="wifisecu" style={{fontSize: 12}}>{callTr("a_23529")}</div></Col>
                                                <Col span={1}></Col>
                                                <Col span={2}><div className={`wificon wifilevel_${this.state.wifiresult[0].level}`}></div></Col>
                                                <Col span={5}>
                                                    <Button onClick={this.editWifiInfo.bind(this, 0)}>{callTr("a_detail")}</Button>
                                                </Col>
                                            </Row> : ""
                                        }
                                        <div className="avaiwifititle">
                                            {callTr("a_avaiwifi")}
                                        </div>
                                        {
                                            this.state.wifiresult.map((wifi, i) => {
                                                if(wifi.isConnected != "CONNECTED" && wifi.level != "-1"){
                                                    return (
                                                        <Row key={i} className="wifirow" type="flex" justify="space-around">
                                                            <Col span={12}>
                                                                {wifi.isSaved == "true" ?
                                                                <div className="savedwifi">
                                                                    <p>{wifi.ssid}</p>
                                                                    <p style={{fontSize: "0.75em"}}>{callTr("a_saved")}</p>
                                                                </div> :
                                                                wifi.ssid}
                                                            </Col>
                                                            <Col span={4}>
                                                                <div className="wifisecu">
                                                                    {wifi.securityStr != "None"
                                                                    ? wifi.securityStr.split(" ")[0]
                                                                    : ""}
                                                                </div>
                                                            </Col>
                                                            <Col span={1}></Col>
                                                            <Col span={2}><div className={`wificon wifilevel_${wifi.level}`}></div></Col>
                                                            <Col span={5}>
                                                                <Button onClick={this.editWifiInfo.bind(this, i)}>{wifi.isConnected == "CONNECTED" ? callTr("a_detail") : callTr("a_connect")}</Button>
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                }
                                <Modal title={this.state.wifi.ssid} onOk={this.handleConnect} onCancel={this.handleCancle} confirmLoading={this.state.confirmLoading}
                                    visible={this.state.visible} okText={callTr(oktext)} cancelText={callTr("a_3")}>
                                    <WifiDetailForm {...this.props} callTr={callTr} wifiData={this.state.wifi} needmodify={this.state.needmodify} protocoltype={this.state.protocoltype} />
                                </Modal>
                            </div>
						</div>
                    )}
                </FormItem>
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    itemValues: state.itemValues,
    activeKey: state.TabactiveKey,
    product: state.product
})

function mapDispatchToProps(dispatch) {
  var actions = {
      getWifiResult: Actions.cb_get_wifiresult,
      getWifiList: Actions.cb_get_wifilist,
      putNvrams: Actions.putNvrams,
      connectWifi: Actions.cb_connect_wifi,
      connectSavedWifi: Actions.cb_connectsaved_wifi,
      forgetWifi: Actions.cb_forget_wifi,
      disconnectWifi: Actions.cb_disconnect_wifi,
      promptMsg: Actions.promptMsg
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(GeneralForm));
