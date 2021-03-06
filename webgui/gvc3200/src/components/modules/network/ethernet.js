import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import {Layout,Form, Input, Icon, Tooltip, Checkbox, Radio, Select, Button, Row, InputNumber,Upload,message, Modal } from "antd";
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as optionsFilter from "../../template/optionsFilter"
const Content = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
// const TabPane = Tabs.TabPane;
let req_items;
var mTwoVlanEnabled = 0;
var mTwoVlanVID = 0;
var mTwoVlanPriority = 0;
var default_ipv6static;
var default_ipv6prefix;

class Ethernet extends Component {
    constructor(props) {
        super(props)

        this.state = {
            type: "password",
            ca_Aupload:"a_16197",
            client_Aupload:"a_16197",
            privatekey_Aupload:"a_16197",
            type802: 'password',
            beginInit: false,
            inLldpvlanid: false,
            inLldpvlanqos: false
        }

        this.handleNvram();

    }

    handleNvram = () => {
        req_items = [];
        req_items.push(
            this.getReqItem("protocoltype", "1415", ""),
            this.getReqItem("twovlan", "22104", ""),
            this.getReqItem("networktype", "8", ""),
            this.getReqItem("dhcpvlan", "8300", ""),
            this.getReqItem("dhcpop12", "146", ""),
            this.getReqItem("dhcpop60", "148", ""),
            this.getReqItem("ipaddr1", "9", ""),
            this.getReqItem("ipaddr2", "10", ""),
            this.getReqItem("ipaddr3", "11", ""),
            this.getReqItem("ipaddr4", "12", ""),
            this.getReqItem("mask1", "13", ""),
            this.getReqItem("mask2", "14", ""),
            this.getReqItem("mask3", "15", ""),
            this.getReqItem("mask4", "16", ""),
            this.getReqItem("gateway1", "17", ""),
            this.getReqItem("gateway2", "18", ""),
            this.getReqItem("gateway3", "19", ""),
            this.getReqItem("gateway4", "20", ""),
            this.getReqItem("prednsser1", "21", ""),
            this.getReqItem("prednsser2", "22", ""),
            this.getReqItem("prednsser3", "23", ""),
            this.getReqItem("prednsser4", "24", ""),
            this.getReqItem("alerdnsser1", "25", ""),
            this.getReqItem("alerdnsser2", "26", ""),
            this.getReqItem("alerdnsser3", "27", ""),
            this.getReqItem("alerdnsser4", "28", ""),
            this.getReqItem("ppoeaccount", "82", ""),
            this.getReqItem("ppoepassword", "83", ""),
            this.getReqItem("layer2qos", "51", ""),
            this.getReqItem("layer2qospv", "87", ""),
            this.getReqItem("networktypevoip", "22105", ""),
            this.getReqItem("networkvoipip", "22106", ""),
            this.getReqItem("networkvoipmask", "22107", ""),
            this.getReqItem("networkvoipgateway", "22108", ""),
            this.getReqItem("networkvoipdns1", "22109", ""),
            this.getReqItem("networkvoipdns2", "22110", ""),
            this.getReqItem("layer2qosvoip", "22111", ""),
            this.getReqItem("layer2qospvvoip", "22112", ""),
            this.getReqItem("ipv6addr", "1419", ""),
            this.getReqItem("staticipv6addr", "1420", ""),
            this.getReqItem("ipv6prefixlen", "1421", ""),
            this.getReqItem("ipv6dns1", "1424", ""),
            this.getReqItem("ipv6dns2", "1425", ""),
            this.getReqItem("prefdnsserver", "1423", ""),
            this.getReqItem("ipv6addrvoip", "22114", ""),
            this.getReqItem("staticipv6addrvoip", "22115", ""),
            this.getReqItem("ipv6prefixlenvoip", "22116", ""),

            this.getReqItem("xmode", "7901", ""),
            this.getReqItem("identity", "7902", ""),
            this.getReqItem("md5pas", "7903", "")
        )
        return req_items;
    }

    checkoutXmode = (itemValues,str) => {
        let value = this.getCurValue(itemValues,str)
        let mode = {};
        if (value === '0' || value == undefined) {
            mode = {
                identity:'display-hidden',
                md5pas: 'display-hidden',
                a_802ca: 'display-hidden',
                a_802client: 'display-hidden',
                a_privatekey: 'display-hidden'
            }
        } else if (value === '1') {
            mode = {
                identity:'display-block',
                md5pas: 'display-block',
                a_802ca: 'display-hidden',
                a_802client: 'display-hidden',
                a_privatekey: 'display-hidden'
            }
        } else if (value === '2') {
            mode = {
                identity:'display-block',
                md5pas: 'display-block',
                a_802ca: 'display-block',
                a_802client: 'display-block',
                a_privatekey: 'display-block'
            }
        } else if (value === '3') {
            mode = {
                identity:'display-block',
                md5pas: 'display-block',
                a_802ca: 'display-block',
                a_802client: 'display-hidden',
                a_privatekey: 'display-hidden'
            }
        }
        return mode
    }

    tobinary = (n) => {
        var binstr = this.tobinChange(n);
        while( binstr.length % 8 != 0 ) {
            binstr = "0" + binstr;
        }
        return binstr;
    }

    tobinChange = (n) => {
        if(!isNaN(n) && n>0)
        {
            if(n%2==0)
            {
                return this.tobinChange(n/2)+"0";
            }
            else {
                if(n>2)
                {
                    return this.tobinChange(parseInt(n/2))+(n%2);
                }
                else
                {
                    return this.tobinChange(0)+n;
                }
            }
        }
        else
        {
            return "";
        }
    }

    cb_lldp_qos_set = (msgs) => {
        var vlanid, vlanqos;
        const { setFieldsValue } = this.props.form;
        vlanid = msgs.headers['vlan_id'];
        vlanqos = msgs.headers['vlan_qos'];

        if(vlanid != "" && vlanid != "0") {
            setFieldsValue({ layer2qos:vlanid });
            this.setState({ inLldpvlanid: true });
        }

        if(vlanqos != "" && vlanqos != "0") {
            setFieldsValue({ layer2qospv:vlanqos });
            this.setState({ inLldpvlanqos: true });
        }

    }

    checkoutItem = (values) => {
        const { setFieldsValue } = this.props.form;
        if(Boolean(Number(values.twovlan)) === true){
            mTwoVlanEnabled = 1;
        }
        mTwoVlanVID = values.layer2qosvoip;
        if ( mTwoVlanVID == "" ) {
            mTwoVlanVID = "0";
        }
        mTwoVlanPriority = values.layer2qospvvoip;
        if ( mTwoVlanPriority == "" ) {
            mTwoVlanPriority = "0";
        }

        if (values.ipv6dns1 == "0") {
            setFieldsValue({ ipv6dns1:"" });
        }
        if (values.ipv6dns2 == "0") {
            setFieldsValue({ ipv6dns2:"" });
        }

        default_ipv6static = values.staticipv6addr;
        default_ipv6prefix = values.ipv6prefixlen;
    }

    componentDidMount() {
        this.props.getItemValues(req_items, (values) => {
            this.props.cb_lldp_qos_check( (msgs) => {
                this.cb_lldp_qos_set(msgs);
            });
            this.checkoutItem(values);
            this.setState({beginInit:true})
        });
    }

    checkIpv6  = (data, value, callback) => {
        const reg = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:)|(\[([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[[0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){1,7}:\](:[1-9]([0-9]){0,4}){0,1}))$/
        if (value && !reg.test(value)) {
            callback(this.tr("a_19657"));
        } else {
            callback()
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.enterSave != nextProps.enterSave) {
            this.handleSubmit();
        }
    }

    handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
    }

    handleMd5PWDVisible = () => {
        this.setState({type802: this.state.type802 == "password" ? "text" : "password"});
    }


    handleSubmit = () => {
        const callTr = this.tr;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(values['prednsser1'] == '0' && values['prednsser2'] == '0' && values['prednsser3'] == '0' && values['prednsser4'] == '0' && values['networktype'] == '1') {
                this.props.promptMsg('ERROR',  callTr('a_19637') +':'+callTr('a_16184'))
                return;
            } 
            if(!err) {
                let set;
                set = new Set([values['ipaddr1'],values["ipaddr2"],values["ipaddr3"],values["ipaddr4"]]);
                if ([...set].length != 1 && set.has('')) {
                    for(var i = 1; i <= 4; i++) {
                        $("#ipaddr"+i).parent().attr("class","ant-form-item-control has-error");
                    }
                    setTimeout(function () {
                        for(var i = 1; i <= 4; i++) {
                            $("#ipaddr"+i).parent().attr("class","ant-form-item-control has-success");
                        }
                    }, 2000);
                    this.props.promptMsg('ERROR',"a_16442");
                    return false;
                }
                set = new Set([values['mask1'],values["mask2"],values["mask3"],values["mask4"]]);
                if ([...set].length != 1 && set.has('')) {
                    for(var i = 1; i <= 4; i++) {
                        $("#mask"+i).parent().attr("class","ant-form-item-control has-error");
                    }
                    setTimeout(function () {
                        for(var i = 1; i <= 4; i++) {
                            $("#mask"+i).parent().attr("class","ant-form-item-control has-success");
                        }
                    }, 2000);
                    this.props.promptMsg('ERROR',"a_16442");
                    return false;
                }
                set = new Set([values['gateway1'],values["gateway2"],values["gateway3"],values["gateway4"]]);
                if ([...set].length != 1 && set.has('')) {
                    for(var i = 1; i <= 4; i++) {
                        $("#gateway"+i).parent().attr("class","ant-form-item-control has-error");
                    }
                    setTimeout(function () {
                        for(var i = 1; i <= 4; i++) {
                            $("#gateway"+i).parent().attr("class","ant-form-item-control has-success");
                        }
                    }, 2000);
                    this.props.promptMsg('ERROR',"a_16442");
                    return false;
                }
                set = new Set([values['prednsser1'],values["prednsser2"],values["prednsser3"],values["prednsser4"]]);
                if ([...set].length != 1 && set.has('')) {
                    for(var i = 1; i <= 4; i++) {
                        $("#prednsser"+i).parent().attr("class","ant-form-item-control has-error");
                    }
                    setTimeout(function () {
                        for(var i = 1; i <= 4; i++) {
                            $("#prednsser"+i).parent().attr("class","ant-form-item-control has-success");
                        }
                    }, 2000);
                    this.props.promptMsg('ERROR',"a_16442");
                    return false;
                } else if ([...set].length = 1 && set.has('')) {
                    for(var i = 1; i <= 4; i++) {
                        $("#prednsser"+i).parent().attr("class","ant-form-item-control has-error");
                    }
                    setTimeout(function () {
                        for(var i = 1; i <= 4; i++) {
                            $("#prednsser"+i).parent().attr("class","ant-form-item-control has-success");
                        }
                    }, 2000);
                    this.props.promptMsg('ERROR',"a_19637");
                    return false;
                }
                set = new Set([values['alerdnsser1'],values["alerdnsser2"],values["alerdnsser3"],values["alerdnsser4"]]);
                if ([...set].length != 1 && set.has('')) {
                    for(var i = 1; i <= 4; i++) {
                        $("#alerdnsser"+i).parent().attr("class","ant-form-item-control has-error");
                    }
                    setTimeout(function () {
                        for(var i = 1; i <= 4; i++) {
                            $("#alerdnsser"+i).parent().attr("class","ant-form-item-control has-success");
                        }
                    }, 2000);
                    this.props.promptMsg('ERROR',"a_16442");
                    return false;
                } else if ([...set].length = 1 && set.has('')) {
                    for (var i = 1; i <= 4; i++) {
                        values["alerdnsser"+i] = 0;
                        const { setFieldsValue } = this.props.form;
                        setFieldsValue({
                            alerdnsser1:0,
                            alerdnsser2:0,
                            alerdnsser3:0,
                            alerdnsser4:0
                        })
                    }
                }
                (values.twovlan == true) && (values.twovlan = "1");
                (values.twovlan == false) && (values.twovlan = "0");
                //this.props.setItemValues(req_items, values);
                if (values.networktype == "2") {
                    if (values.ppoeaccount == "" || values.ppoepassword == "") {
                        Modal.info({
                            content: <span dangerouslySetInnerHTML={{__html: callTr("a_16446")}}></span>,
                            okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                            onOk() {},
                        });
                        return false;
                    }
                }
                if (values.networktype == "1") {
                    var submaskbinarystr = this.tobinary(parseInt(values.mask1)) + this.tobinary(parseInt(values.mask2)) +
                        this.tobinary(parseInt(values.mask3)) + this.tobinary(parseInt(values.mask4));
                    var pos0 = submaskbinarystr.indexOf("0");
                    if( pos0 >= 0 && pos0 < submaskbinarystr.lastIndexOf("1") )
                    {
                        Modal.info({
                            content: <span dangerouslySetInnerHTML={{__html: callTr("a_4247")}}></span>,
                            okText: <span dangerouslySetInnerHTML={{__html: callTr("a_2")}}></span>,
                            onOk() {},
                        });
                        return false;
                    }
                }
                if (mTwoVlanEnabled == 1) {
                    this.props.cb_putTwoline(0,mTwoVlanVID,mTwoVlanPriority,(enable) => {
                        this.cb_putTwoline_callback(enable);
                    })
                } else {
                    if(this.state.inLldpvlanid || this.state.inLldpvlanqos) {
                        req_items = req_items.filter(v => !(v.pvalue == '51' || v.pvalue == '87'))
                    }
                    this.props.setItemValues(req_items, values,0,()=>{
                        this.setItemValuesCallback(values);
                    });
                }
                this.props.get_Restart8021x();
            }
        });
    }

    _normFile(e) {
        if (Array.isArray(e)) {
            return e
        }

        return e && e.fileList
    }

    setca_Aupload = () => {
        this.setState({
            ca_Aupload:"a_23522"
        })
    }

    setclient_Aupload = () => {
        this.setState({
            client_Aupload:"a_23522"
        })
    }

    setprivatekey_Aupload = () => {
        this.setState({
            privatekey_Aupload:"a_23522"
        })
    }

    setItemValuesCallback = (values) => {
        if (values.twovlan === true) {
            var vid = values.layer2qosvoip;
            if ( vid == "" ) {
                vid = "0";
            }
            var priority = values.layer2qospvvoip;
            if ( priority == "" ) {
                priority = "0";
            }
            this.props.cb_putTwoline(1, vid, priority);
        } else {
            mTwoVlanEnabled = 0;
            this.props.cb_put_network2();
        }
    }

    cb_putTwoline_callback = (enable) => {
        let values = this.props.form.getFieldsValue();
        if (enable == 0) {
            this.props.setItemValues(req_items, values,0,() =>{
                this.setItemValuesCallback(values);
            });
        } else {
            mTwoVlanEnabled = 1;
            mTwoVlanVID = values.layer2qosvoip;
            if (mTwoVlanVID == "") {
                mTwoVlanVID = "0";
            }
            mTwoVlanPriority = values.layer2qospvvoip;
            if ( mTwoVlanPriority == "" ) {
                mTwoVlanPriority = "0";
            }
            this.props.cb_put_network2();
        }
    }

    checkoutoutAddresstype = (itemValues,str) => {
        let value = this.getCurValue(itemValues,str)
        let mode = {};
        if (value === '0' || value == undefined) {
            mode = {
                DHCP:'display-block',
                staip: 'display-hidden',
                PPPoE: 'display-hidden',
            }
        } else if (value === '1') {
            mode = {
                DHCP:'display-hidden',
                staip: 'display-block',
                PPPoE: 'display-hidden',
            }
        } else if (value === '2') {
            mode = {
                DHCP:'display-hidden',
                staip: 'display-hidden',
                PPPoE: 'display-block',
            }
        }
        return mode
    }

    checkoutData = (itemValues,str) => {
        let value = this.getCurValue(itemValues,str)
        if (value === '1') {
            return "display-block"
        } else {
            return "display-hidden"
        }
    }

    getCurValue = (itemValues,str) => {
        let value = this.props.form.getFieldValue(str)
        value = value != undefined ? value : itemValues[str]
        return value
    }


    render() {
        const callTr = this.tr;
        const callTipsTr = this.tips_tr;
        const {getFieldDecorator} = this.props.form;
        const cb_ping = this.props.cb_ping;
        let self = this;
        let itemValues = this.props.itemValues
        if(!this.state.beginInit) {
            return null
        }
        let twovlan = this.getCurValue(itemValues,"twovlan")
        let IPv4Type, twovlanType, voipsetType, a_layer2qos, a_layer2qospv, ipv6class, ipv6addrvoipclass, networktypevoipclass, mode, lan_mode_class;
        if (twovlan === true) {
            IPv4Type = "display-hidden";
            twovlanType = "display-block";
            voipsetType = "display-block";
            a_layer2qos = "a_layer2qosdata";
            a_layer2qospv = "a_layer2qospvdata";
        } else {
            IPv4Type = "display-block";
            twovlanType = "display-hidden";
            voipsetType = "display-hidden";
            a_layer2qos = "a_layer2qos";
            a_layer2qospv = "a_layer2qospv";
        }
        ipv6class = this.checkoutData(itemValues,'ipv6addr')
        ipv6addrvoipclass = this.checkoutData(itemValues,'ipv6addrvoip')
        networktypevoipclass = this.checkoutData(itemValues,'networktypevoip')
        mode = this.checkoutoutAddresstype(itemValues,"networktype")
        lan_mode_class = this.checkoutXmode(itemValues,"xmode")
        const propsA_802ca = {
            name: 'file',
            showUploadList: false,
            action: '../upload?type=802ca',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    cb_ping();
                }
                if (info.file.status === 'done') {
                    message.success(callTr('a_16669'));
                    self.setca_Aupload();
                } else if (info.file.status === 'error') {
                    message.error(callTr('a_16477'));
                }
            },
            onRemove() {
                message.destroy()
            },
        };

        const propsA_802client = {
            name: 'file',
            showUploadList: false,
            action: '../upload?type=802client',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    cb_ping();
                }
                if (info.file.status === 'done') {
                    message.success(callTr('a_16669'));
                    self.setclient_Aupload();
                } else if (info.file.status === 'error') {
                    message.error(callTr('a_16477'));
                }
            },
            onRemove() {
                message.destroy()
            },
        };

        const propsA_privatekey = {
            name: 'file',
            showUploadList: false,
            action: '../upload?type=802privatekey',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    cb_ping();
                }
                if (info.file.status === 'done') {
                    message.success(callTr('a_16669'));
                    self.setprivatekey_Aupload();
                } else if (info.file.status === 'error') {
                    message.error(callTr('a_16477'));
                }
            },
            onRemove() {
                message.destroy()
            },
        };

        let itemList =
            <Form className="configform" hideRequiredMark style={{minHeight: this.props.mainHeight}}>
                <FormItem label={< span > {callTr("a_19225")} < Tooltip title={callTipsTr("Preferred Internet Protocol")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("protocoltype", {
                        initialValue: this.props.itemValues["protocoltype"]
                    })(
                        <Select className="P-1415">
                            <Option value="0">{callTr("a_19390")}</Option>
                            <Option value="1">{callTr("a_19391")}</Option>
                            <Option value="2">{callTr("a_19392")}</Option>
                            <Option value="3">{callTr("a_19393")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/*<FormItem label={< span > {callTr("a_twovlan")} < Tooltip title={callTipsTr("Different Networks for Data and VoIP Calls")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("twovlan", {
                        rules: [],
                        valuePropName: 'checked',
                        initialValue: Boolean(Number(this.props.itemValues.twovlan))
                    })(
                        <Checkbox className="P-22104"/>
                    )}
                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>*/}
                <p className={"blocktitle"+" "+ IPv4Type}><s></s>IPv4</p>
                <p className={"blocktitle"+" "+ twovlanType}><s></s>{callTr("a_19658")}</p>
                <p className={"threetitle"+" "+ twovlanType}>IPv4</p>
                <FormItem label={< span > {callTr("a_19659")} < Tooltip  title={ this.tips_tr("Address Type")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('networktype', {
                        rules: [],
                        initialValue: this.props.itemValues.networktype
                    })(
                        <RadioGroup className="P-8">
                            <Radio value="0">DHCP</Radio>
                            <Radio value="1">{callTr("a_4125")}</Radio>
                            <Radio value="2">PPPoE</Radio>
                        </RadioGroup>)}
                </FormItem>
                <FormItem className={ mode.DHCP } label={< span > {callTr("a_19335")} < Tooltip title={callTipsTr("DHCP VLAN Override")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("dhcpvlan", {
                        rules: [],
                        initialValue: this.props.itemValues["dhcpvlan"] ? this.props.itemValues["dhcpvlan"] : "0"
                    })(
                        <Select className="P-8300">
                            <Option value="0">{callTr("a_39")}</Option>
                            <Option value="1">{callTr("a_19333")}</Option>
                            <Option value="2">{callTr("a_19334")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className={ mode.DHCP } label={< span > {callTr("a_16187")} < Tooltip title={callTipsTr("Host name")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("dhcpop12", {
                        rules: [
                            {
                                max: 40,
                                message: callTr("a_19805") + "40"
                            },{
                                validator: (data, value, callback) => {
                                    this.checkNoCHString(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.dhcpop12
                    })(<Input className="P-146"/>)}
                </FormItem>
                <FormItem className={ mode.DHCP } label={< span > {callTr("a_16189")} < Tooltip title={callTipsTr("Vendor Class ID")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("dhcpop60", {
                        rules: [
                            {
                                max: 40,
                                message: callTr("a_19805") + "40"
                            },{
                                validator: (data, value, callback) => {
                                    this.checkNoCHString(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.dhcpop60
                    })(<Input className="P-148"/>)}
                </FormItem>

                <FormItem className={ "ip-address" + " " + mode.staip } label={< span > {this.tr("a_23531")} < Tooltip title={callTipsTr("IP Address")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {(
                        <Row className="div-inputnumber">
                            <FormItem>
                                {getFieldDecorator('ipaddr1', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['ipaddr1']
                                })(<Input className="P-9"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('ipaddr2', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['ipaddr2']
                                })(<Input className="P-10"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('ipaddr3', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['ipaddr3']
                                })(<Input className="P-11"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('ipaddr4', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['ipaddr4']
                                })(<Input className="P-12"/>)}
                            </FormItem>
                        </Row>
                    )}
                </FormItem>
                <FormItem className={ "ip-address" + " " + mode.staip } label={< span > {this.tr("a_4127")} < Tooltip title={callTipsTr("Subnet Mask")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {(
                        <Row className="div-inputnumber">
                            <FormItem>
                                {getFieldDecorator('mask1', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['mask1']
                                })(<Input className="P-13"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('mask2', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['mask2']
                                })(<Input className="P-14"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('mask3', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['mask3']
                                })(<Input className="P-15"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('mask4', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['mask4']
                                })(<Input className="P-16"/>)}
                            </FormItem>
                        </Row>
                    )}
                </FormItem>
                <FormItem className={ "ip-address" + " " + mode.staip } label={< span > {this.tr("a_16191")} < Tooltip title={callTipsTr("Default Gateway")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {(
                        <Row className="div-inputnumber">
                            <FormItem>
                                {getFieldDecorator('gateway1', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['gateway1']
                                })(<Input className="P-17"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('gateway2', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['gateway2']
                                })(<Input className="P-18"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('gateway3', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['gateway3']
                                })(<Input className="P-19"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('gateway4', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['gateway4']
                                })(<Input className="P-20"/>)}
                            </FormItem>
                        </Row>
                    )}
                </FormItem>
                <FormItem className={ "ip-address" + " " + mode.staip } label={< span > {this.tr("a_19227")} < Tooltip title={callTipsTr("DNS Server 1")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {(
                        <Row className="div-inputnumber">
                            <FormItem>
                                {getFieldDecorator('prednsser1', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['prednsser1']
                                })(<Input className="P-21"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('prednsser2', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['prednsser2']
                                })(<Input className="P-22"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('prednsser3', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['prednsser3']
                                })(<Input className="P-23"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('prednsser4', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['prednsser4']
                                })(<Input className="P-24"/>)}
                            </FormItem>
                        </Row>
                    )}
                </FormItem>
                <FormItem className={ "ip-address" + " " + mode.staip } label={< span > {this.tr("a_19228")} < Tooltip title={callTipsTr("DNS Server 2")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {(
                        <Row className="div-inputnumber">
                            <FormItem>
                                {getFieldDecorator('alerdnsser1', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['alerdnsser1']
                                })(<Input className="P-25"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('alerdnsser2', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['alerdnsser2']
                                })(<Input className="P-26"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('alerdnsser3', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['alerdnsser3']
                                })(<Input className="P-27"/>)}
                            </FormItem>
                            <Row className = "splitPoint">.</Row>
                            <FormItem>
                                {getFieldDecorator('alerdnsser4', {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 255)
                                        }
                                    },{
                                        //validator: this._isRangeConflict
                                    }],
                                    initialValue: this.props.itemValues['alerdnsser4']
                                })(<Input className="P-28"/>)}
                            </FormItem>
                        </Row>
                    )}
                </FormItem>
                <FormItem className={ mode.PPPoE } label={< span > {callTr("a_4156")} < Tooltip title={callTipsTr("PPPoE Account ID")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    <Input className="P-82" style = {{display:"none"}} disabled autoComplete = "off"/>
                    {getFieldDecorator("ppoeaccount", {
                        rules: [
                            {
                                max: 32,
                                message: callTr("a_19805") + "32"
                            }
                        ],
                        initialValue: this.props.itemValues.ppoeaccount
                    })(<Input className="P-82"/>)}
                </FormItem>
                <FormItem className={ mode.PPPoE } label={< span > {callTr("a_4157")} < Tooltip title={callTipsTr("PPPoE Password")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    <Input type="password" className="P-83" style = {{display:"none"}} disabled autoComplete = "off"/>
                    {getFieldDecorator("ppoepassword", {
                        rules: [
                            {
                                max: 32,
                                message: callTr("a_19805") + "40"
                            }
                        ],
                        initialValue: this.props.itemValues.ppoepassword
                    })(<Input type={this.state.type} className="P-83"
                              suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />} />)}
                </FormItem>
                <FormItem label={< span > {callTr(a_layer2qos)} < Tooltip title={callTipsTr("Layer 2 QoS 802.1Q/VLAN Tag")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("layer2qos", {
                        rules: [{
                            required: true,
                            message: callTr("a_19637")
                        },{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 4094)
                            }
                        }],
                        initialValue: this.props.itemValues.layer2qos
                    })(<Input disabled={this.state.inLldpvlanid}  min={0} max={4094} className="P-51" />)}
                </FormItem>
                <FormItem label={< span > {callTr(a_layer2qospv)} < Tooltip title={callTipsTr("Layer 2 QoS 802.1p Priority Value")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator("layer2qospv", {
                        rules: [{
                            required: true,
                            message: callTr("a_19637")
                        },{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 7)
                            }
                        }],
                        initialValue: this.props.itemValues.layer2qospv
                    })(<Input disabled={this.state.inLldpvlanqos} min={0} max={7} className="P-87" />)}

                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>
                <p className={"blocktitle"+" "+ IPv4Type}><s></s>IPv6</p>
                <p className={"threetitle"+" "+ twovlanType}>IPv6</p>
                <FormItem className="select-item" label={< span > {callTr("a_19226")} < Tooltip title = {callTipsTr("IPv6 Address")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('ipv6addr', {
                        rules: [],
                        initialValue: this.props.itemValues["ipv6addr"] ? this.props.itemValues["ipv6addr"] : "0"
                    })(
                        <Select className="P-1419">
                            <Option value="0">{callTr("a_19230")}</Option>
                            <Option value="1">{callTr("a_19231")}</Option>
                        </Select>)}
                </FormItem>
                <FormItem className={ ipv6class } label={< span > {callTr("a_19309")} < Tooltip title = {callTipsTr("Static IPv6 Address")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('staticipv6addr', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkIpv6(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.staticipv6addr
                    })(<Input maxLength="40" className="P-1420"/>)}
                </FormItem>
                <FormItem className={ ipv6class } label={< span > {callTr("a_19310")} < Tooltip title = {callTipsTr("IPv6 Prefix length")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
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
                        initialValue: this.props.itemValues.ipv6prefixlen
                    })(<Input maxLength="40" className="P-1421"/>)
                    }
                </FormItem>
                <FormItem className={ ipv6class } label={< span > {callTr("a_19227")} < Tooltip title = {callTipsTr("IPv6 DNS Server 1")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('ipv6dns1', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkIpv6(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.ipv6dns1
                    })(<Input maxLength="40" className="P-1424"/>)}
                </FormItem>
                <FormItem className={ ipv6class } label={< span > {callTr("a_19228")} < Tooltip title = {callTipsTr("IPv6 DNS Server 2")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('ipv6dns2', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkIpv6(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.ipv6dns2
                    })(<Input maxLength="40" className="P-1425"/>)}
                </FormItem>
                <FormItem label={< span > {callTr("a_19229")} < Tooltip title = {callTipsTr("Preferred DNS Server")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('prefdnsserver', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkIpv6(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.prefdnsserver
                    })(<Input maxLength="40" className="P-1423"/>)}
                </FormItem>
                <p className={"blocktitle"+" "+ twovlanType}><s></s>{callTr("a_19664")}</p>
                <p className={"threetitle"+" "+ twovlanType}>IPv4</p>
                <FormItem className = { twovlanType } label={< span > {callTr("a_19659")} < Tooltip title={ this.tips_tr("Voip Address Type")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('networktypevoip', {
                        rules: [],
                        initialValue: this.props.itemValues["networktypevoip"] ? this.props.itemValues["networktypevoip"] : "0"
                    })(
                        <RadioGroup className="P-22105">
                            <Radio value="0">DHCP</Radio>
                            <Radio value="1">{callTr("a_4125")}</Radio>
                        </RadioGroup>)}
                </FormItem>
                <FormItem className = {twovlanType + " " + networktypevoipclass} label={< span > {callTr("a_23531")} < Tooltip title={callTipsTr("IP Address")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('networkvoipip', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.networkvoipip
                    })(<Input maxLength="40" className="P-22106"/>)}
                </FormItem>
                <FormItem className = {twovlanType + " " + networktypevoipclass} label={< span > {callTr("a_4127")} < Tooltip title={callTipsTr("Subnet Mask")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('networkvoipmask', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.networkvoipmask
                    })(<Input maxLength="40" className="P-22107"/>)}
                </FormItem>
                <FormItem className = {twovlanType + " " + networktypevoipclass} label={< span > {callTr("a_16191")} < Tooltip title={callTipsTr("Default Gateway")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('networkvoipgateway', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.networkvoipgateway
                    })(<Input maxLength="40" className="P-22108"/>)}
                </FormItem>
                <FormItem className = {twovlanType + " " + networktypevoipclass} label={< span > {callTr("a_19227")} < Tooltip title={callTipsTr("DNS Server 1")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('networkvoipdns1', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.networkvoipdns1
                    })(<Input maxLength="40" className="P-22109"/>)}
                </FormItem>
                <FormItem className = {twovlanType + " " + networktypevoipclass} label={< span > {callTr("a_19228")} < Tooltip title={callTipsTr("DNS Server 2")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('networkvoipdns2', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkUrlPath(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.networkvoipdns2
                    })(<Input maxLength="40" className="P-22110"/>)}
                </FormItem>
                {/*<FormItem className = {voipsetType} label={< span > {callTr("a_19665")} < Tooltip title = {callTipsTr("Layer 2 QoS 802.1Q/VLAN Tag (Ethernet) for VoIP Calls")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("layer2qosvoip", {
                        rules: [{
                            required: true,
                            message: callTr("a_19637")
                        },{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 4094)
                            }
                        }],
                        initialValue: this.props.itemValues.layer2qosvoip
                    })(<Input min={0} max={4094} className="P-22111"/>)}
                </FormItem>*/}
                {/*<FormItem className = {voipsetType} label={< span > {callTr("a_19666")} < Tooltip title = {callTipsTr("Layer 2 QoS 802.1p Priority Value (Ethernet) for VoIP Calls")} > <Icon type="question-circle-o"/> < /Tooltip></span >}>
                    {getFieldDecorator("layer2qospvvoip", {
                        rules: [{
                            required: true,
                            message: callTr("a_19637")
                        },{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 7)
                            }
                        }],
                        initialValue: this.props.itemValues.layer2qospvvoip
                    })(<Input min={0} max={7} className="P-22112"/>)}
                    <Icon title={callTr("a_4278")} className="rebooticon" type="exclamation-circle-o" />
                </FormItem>*/}
                <p className={"threetitle"+" "+ twovlanType}>IPv6</p>
                <FormItem className={"select-item" + " " + twovlanType} label={< span > {callTr("a_19226")} < Tooltip title = {callTipsTr("IPv6 Address")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('ipv6addrvoip', {
                        rules: [],
                        initialValue: this.props.itemValues["ipv6addrvoip"] ? this.props.itemValues["ipv6addrvoip"] : "0"
                    })(
                        <Select className="P-22114">
                            <Option value="0">{callTr("a_19230")}</Option>
                            <Option value="1">{callTr("a_19231")}</Option>
                        </Select>)}
                </FormItem>
                <FormItem className={ twovlanType + " " + ipv6addrvoipclass } label={< span > {callTr("a_19309")} < Tooltip title = {callTipsTr("Static IPv6 Address")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('staticipv6addrvoip', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.checkIpv6(data, value, callback)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues.staticipv6addrvoip
                    })(<Input maxLength="40" className="P-22115"/>)}
                </FormItem>
                <FormItem className={ twovlanType + " " + ipv6addrvoipclass } label={< span > {callTr("a_19310")} < Tooltip title = {callTipsTr("IPv6 Prefix length")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('ipv6prefixlenvoip', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        },{
                            validator: (data, value, callback) => {
                                this.range(data, value, callback,1,128)
                            }
                        }],
                        initialValue: this.props.itemValues.ipv6prefixlenvoip
                    })(<Input maxLength="40" className="P-22116"/>)
                    }
                </FormItem>
                <p className="blocktitle"><s></s>{callTr("a_4140")}</p>
                <FormItem className="select-item"  label={< span > { callTr("a_4140") } < Tooltip title={callTipsTr("802.1X Mode")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    {getFieldDecorator('xmode', {
                        rules: [],
                        initialValue: this.props.itemValues["xmode"] ? this.props.itemValues["xmode"] : "0"
                    })(
                        <Select className="P-7901">
                            <Option value="0">{callTr("a_39")}</Option>
                            <Option value="1">EAP-MD5</Option>
                            <Option value="2">EAP-TLS</Option>
                            <Option value="3">EAP-PEAP</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className={ lan_mode_class.identity } label={< span > { callTr("a_16195") } < Tooltip title={callTipsTr("802.1X Identity")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    <Input type="text" name = "identity" style= {{display:"none"}} disabled autoComplete = "off"/>
                    {getFieldDecorator('identity', {
                        rules: [],
                        initialValue: this.props.itemValues.identity
                    })(<Input name = "identity" className="P-7902"/>)}
                </FormItem>
                <FormItem className={ lan_mode_class.md5pas } label={< span > { callTr("a_16196") } < Tooltip title = {callTipsTr("802.1X Secret")} > <Icon type="question-circle-o"/> </Tooltip></span >}>
                    <Input type={this.state.type802} name = "md5pas" style = {{display:"none"}} disabled autoComplete = "off"/>
                    {getFieldDecorator("md5pas", {
                        rules: [],
                        initialValue: this.props.itemValues.md5pas
                    })(<Input type={this.state.type802} name = "md5pas" suffix={<Icon type="eye" className={this.state.type802 + " P-7903"} onClick={this.handleMd5PWDVisible}/>}/>)}
                </FormItem>
                <FormItem className={ lan_mode_class.a_802ca } label={<span>{callTr("a_19667")} <Tooltip title={callTipsTr("CA Certificate")}> <Icon type="question-circle-o"/> </Tooltip> </span> } hasFeedback>
                    {getFieldDecorator('a_802ca', {
                        valuePropName: 'fileList',
                        normalize: this._normFile
                    })(
                        <Upload {...propsA_802ca}>
                            <Button>
                                <Icon type="upload" /> {this.tr(this.state.ca_Aupload)}
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                <FormItem className={ lan_mode_class.a_802client } label={<span>{callTr("a_4392")} <Tooltip title={callTipsTr("Client Certificate")}> <Icon type="question-circle-o"/> </Tooltip> </span> } hasFeedback>
                    {getFieldDecorator('a_4392', {
                        valuePropName: 'fileList',
                        normalize: this._normFile
                    })(
                        <Upload {...propsA_802client}>
                            <Button>
                                <Icon type="upload" /> {this.tr(this.state.client_Aupload)}
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                <FormItem className={ lan_mode_class.a_privatekey } label={<span>{callTr("a_4394")} <Tooltip title={callTipsTr("Private Key")}> <Icon type="question-circle-o"/> </Tooltip> </span> } hasFeedback>
                    {getFieldDecorator('a_4394', {
                        valuePropName: 'fileList',
                        normalize: this._normFile
                    })(
                        <Upload {...propsA_privatekey}>
                            <Button>
                                <Icon type="upload" /> {this.tr(this.state.privatekey_Aupload)}
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>
        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length-1; hiddenOptions[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_4120")}</div>
                {itemList}
            </Content>
        );
    }
}

const EthernetForm = Form.create()(Enhance(Ethernet));

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    activeKey: state.TabactiveKey,
    userType: state.userType,
    itemValues: state.itemValues,
    enterSave: state.enterSave,
})

function mapDispatchToProps(dispatch) {
    var actions = {
        promptMsg:Actions.promptMsg,
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        cb_putTwoline:Actions.cb_putTwoline,
        cb_put_network2:Actions.cb_put_network2,
        cb_ping:Actions.cb_ping,
        get_Restart8021x:Actions.get_Restart8021x,
        cb_lldp_qos_check:Actions.cb_lldp_qos_check
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(EthernetForm));
