import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Layout, Row, Tooltip, Icon, Input, Tabs } from 'antd';
const Content = Layout;
const TabPane = Tabs.TabPane;
let req_items;

const FormItem = Form.Item;

class Network extends Component {
    constructor(props) {
        super(props)
        this.state = {
            voipsetipv4: "display-block",
            voipset:"display-hidden",
            vpnipdiv:"display-hidden",
            proxydiv:"display-hidden",
            vnetwork:"",
            vipaddress:"",
            vmask:"",
            vgateway:"",
            vdns:"",
            vdns2:""
        }

        req_items = new Array;
        req_items.push(
            this.getReqItem("twovlan", "22104", ""),
            this.getReqItem("voipvid", "22111", ""),
            this.getReqItem("voipnettype", "22105", ""),
            this.getReqItem("nat-type", "80", ""),
            this.getReqItem("proxy", "1552", ""),
            this.getReqItem("vpnenable","7050",""),
            this.getReqItem("vpnip", "vpn_ip", ""),
            this.getReqItem("netstatus", "network_status", "")
        );
    }

    get_ipv6addtype(data) {
        var ipv6addtype = "";
        if (data == "0" || data == "") {
            ipv6addtype = this.tr("a_dhcp")
        } else {
            ipv6addtype = this.tr("a_4125")
        }
        return ipv6addtype;
    }

    get_ipv4addtype(data) {
        var ipv4addtype = "";
        if (data == "0" || data == "") {
            ipv4addtype = this.tr("a_dhcp")
        } else if (data == "1") {
            ipv4addtype = this.tr("a_4125")
        } else if (data == "2") {
            ipv4addtype = this.tr("a_16183")
        }
        return ipv4addtype;
    }

    check_vpnip = (value) => {
        let vpnipdiv;
        if (value == '' || value == ' ' || value == undefined) {
            vpnipdiv = "display-hidden";
        } else {
            vpnipdiv = "display-block";
        }
        this.setState({
            vpnipdiv:vpnipdiv
        })
    }

    check_proxy = (value) => {
        let proxydiv;
        if (value == '') {
            proxydiv = "display-hidden";
        } else {
            proxydiv = "display-block";
        }
        this.setState({
            proxydiv:proxydiv
        })
    }

    check_twovlan = (values) => {
        let vnetwork;
        if(values.twovlan == "1") {
            if (values.voipnettype == "1") {
                vnetwork = this.tr("a_4125");
                this.props.get_action_network("get&var-0000=22106&var-0001=22107&var-0002=22108&var-0003=22109&var-0004=22110", (msgs) => {
                    this.setState({
                        vipaddress:msgs.headers['22106'],
                        vmask:msgs.headers['22107'],
                        vgateway:msgs.headers['22108'],
                        vdns:msgs.headers['22109'],
                        vdns2:msgs.headers['22110']
                    })
                });
            } else {
                vnetwork = this.tr("a_dhcp");
                var voipvid = values.voipvid;
                if (voipvid == "") {
                    voipvid = "0"
                }
                voipvid = 'eth0.' + voipvid;
                this.props.get_action_network('voipnetwork&ethname=' + voipvid ,(msgs) => {
                    this.getVoipnetwork_suc(msgs);
                });
            }
            this.setState({
                voipset:"display-block",
                voipsetipv4:"display-hidden",
                vnetwork:vnetwork
            })
        }
    }

    getVoipnetwork_suc = (msgs) => {
        let vipaddress;
        let vgateway;
        let vdns;
        let vdns2;
        let vmask;
        let voipip = msgs.headers['ip'];
        if (voipip != 'none') {
            vipaddress = voipip;
            if (voipip != "") {
                vgateway = msgs.headers['gateway'];
                vdns = msgs.headers['dns'];
                vdns2 = msgs.headers['dns2'];
            }
        }
        if (msgs.headers['mask'] != 'none') {
            vmask = msgs.headers['mask'];
        }
        this.setState({
            vipaddress:vipaddress,
            vmask:vmask,
            vgateway:vgateway,
            vdns:vdns,
            vdns2:vdns2
        })
    }

    componentDidMount() {
        this.props.getItemValues(req_items,(values) => {
            if(values.vpnenable == "1"){
                this.check_vpnip(values.vpnip);
            }
            this.check_proxy(values.proxy);
            this.check_twovlan(values);
        });
        this.props.getNetworkStatus();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let networkStatus = this.props.networkStatus;

      return (
          <Content className="content-container config-container">
              <div className="subpagetitle">{this.tr("a_4147")}</div>
                    <Form  className="configform" style={{'min-height': this.props.mainHeight}}>
                        <FormItem label={<span>{this.tr("a_16403")}<Tooltip title={this.tips_tr("MAC Address ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="mac-address">{networkStatus["mac"] && networkStatus["mac"].toUpperCase() }</span>
                        </FormItem>
                        <FormItem className = {this.state.proxydiv} label={<span>{this.tr("a_proxystatus")}<Tooltip title={this.tips_tr("HTTP/HTTPS Proxy ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="a_16061">{ this.props.itemValues['proxy'] }</span>
                        </FormItem>
                        <FormItem label={<span>{this.tr("a_4155")}<Tooltip title={this.tips_tr("NAT Type")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="nat-type">{ this.props.itemValues['nat-type'] }</span>
                        </FormItem>
                        <FormItem className = {this.state.vpnipdiv} label={<span>{"VPN IP"}</span>}>
                            <span ref="vpnip">{ this.props.itemValues['vpnip'] }</span>
                        </FormItem>
                        <p className={"blocktitle"+" "+ this.state.voipset}><s></s>{this.tr("a_netfordata")}</p>
                        <p className={"blocktitle"+" " + this.state.voipsetipv4}><s></s>IPV4</p>
                        <FormItem label={<span>{this.tr("a_4150")}<Tooltip title={this.tips_tr("Address Type ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="address-type">{ this.get_ipv4addtype(networkStatus["ipv4Type"]) }</span>
                        </FormItem>
                        <FormItem label={<span>{this.tr("a_4313")}<Tooltip title={this.tips_tr("IP Address ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="ipv4-address">{ networkStatus["ipv4Addr"] }</span>
                        </FormItem>
                        <FormItem label={<span>{this.tr("a_4127")}<Tooltip title={this.tips_tr("Subnet Mask ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="subnet-mask">{ networkStatus["mask"] }</span>
                        </FormItem>
                        <FormItem label={<span>{this.tr("a_gateway")}<Tooltip title={this.tips_tr("Default Gateway ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="default-gateway">{ networkStatus["gateway"] }</span>
                        </FormItem>
                        <FormItem label={<span>{this.tr("a_19227")}<Tooltip title={this.tips_tr("DNS Server 1 ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="dns-server1">{ networkStatus["dns1"] }</span>
                        </FormItem>
                        <FormItem label={<span>{this.tr("a_19228")}<Tooltip title={this.tips_tr("DNS Server 2 ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="dns-server2">{ networkStatus["dns2"] }</span>
                        </FormItem>
                        <p className="blocktitle"><s></s>IPV6</p>
                        <FormItem label={<span>{this.tr("a_19308")}<Tooltip title={this.tips_tr("IPv6 Address Type ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="ipv6address-type">{ this.get_ipv6addtype(networkStatus["ipv6Type"]) }</span>
                        </FormItem>
                        <FormItem label={<span>{this.tr("a_19226")}<Tooltip title={this.tips_tr("IPv6 Address ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="ipv6address">{ networkStatus["ipv6Addr"]||"0:0:0:0:0:0:0:0" }</span>
                        </FormItem>
                        <FormItem label={<span>{this.tr("a_ipv6dnsser1")}<Tooltip title={this.tips_tr("IPv6 DNS Server 1 ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="ipv6dns-server1">{ networkStatus["ipv6Dns1"]||"0:0:0:0:0:0:0:0" }</span>
                        </FormItem>
                        <FormItem label={<span>{this.tr("a_ipv6dnsser2")}<Tooltip title={this.tips_tr("IPv6 DNS Server 2 ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="ipv6dns-server2">{ networkStatus["ipv6Dns2"]||"0:0:0:0:0:0:0:0"  }</span>
                        </FormItem>
                        <p className={"blocktitle" + " " + this.state.voipset}><s></s>{this.tr("a_netforvoip")}</p>
                        <FormItem className = {this.state.voipset} label={<span>{this.tr("a_4150")}<Tooltip title={this.tips_tr("Address Type ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="vnetwork">{ this.state.vnetwork }</span>
                        </FormItem>
                        <FormItem className = {this.state.voipset} label={<span>{this.tr("a_23531")}<Tooltip title={this.tips_tr("IP Address ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="vipaddress">{ this.state.vipaddress }</span>
                        </FormItem>
                        <FormItem className = {this.state.voipset} label={<span>{this.tr("a_4127")}<Tooltip title={this.tips_tr("Subnet Mask ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="vmask">{ this.state.vmask }</span>
                        </FormItem>
                        <FormItem className = {this.state.voipset} label={<span>{this.tr("a_gateway")}<Tooltip title={this.tips_tr("Default Gateway ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="vgateway">{ this.state.vgateway }</span>
                        </FormItem>
                        <FormItem className = {this.state.voipset} label={<span>{this.tr("a_19227")}<Tooltip title={this.tips_tr("DNS Server 1 ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="vdns">{ this.state.vdns }</span>
                        </FormItem>
                        <FormItem className = {this.state.voipset} label={<span>{this.tr("a_19228")}<Tooltip title={this.tips_tr("DNS Server 2 ")}><Icon type="question-circle-o"/></Tooltip></span>}>
                            <span ref="vdns2">{ this.state.vdns2 }</span>
                        </FormItem>
                      <Row className = "hiddenInfo">
                          <FormItem>
                              {getFieldDecorator('netstatus', {
                                  rules: [],
                                  initialValue: this.props.itemValues.netstatus
                              })(<Input maxLength="40" style = {{display:"none"}}/>)
                              }
                          </FormItem>
                          <FormItem>
                              {getFieldDecorator('twovlan', {
                                  rules: [],
                                  initialValue: this.props.itemValues.twovlan
                              })(<Input maxLength="40" style = {{display:"none"}}/>)
                              }
                          </FormItem>
                          <FormItem>
                              {getFieldDecorator('voipvid', {
                                  rules: [],
                                  initialValue: this.props.itemValues.voipvid
                              })(<Input maxLength="40" style = {{display:"none"}}/>)
                              }
                          </FormItem>
                          <FormItem>
                              {getFieldDecorator('voipnettype', {
                                  rules: [],
                                  initialValue: this.props.itemValues.voipnettype
                              })(<Input maxLength="40" style = {{display:"none"}}/>)
                              }
                          </FormItem>
                      </Row>
                    </Form>
          </Content>
      )
    }
}

const NetworkForm = Form.create()(Enhance(Network));
const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    networkStatus: state.networkStatus,
    mainHeight: state.mainHeight
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues:Actions.getItemValues,
        getNetworkStatus:Actions.getNetworkStatus,
        get_action_network:Actions.get_action_network
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkForm);
