import React, {Component, PropTypes} from 'react'
import Enhance from "../../mixins/Enhance";
import {
    Layout,
    Form,
    Radio,
    Select,
    Input,
    Tooltip,
    Icon,
    Checkbox,
    Button,
    Slider,
    Modal,
    Switch,
    Row,
    Col
} from "antd";
import channel from "./ptt/channel"
import Pagingchannel from "./ptt/pagingchannel"
import Pttchannel from "./ptt/pttchannel"
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'


const Content = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;


const req_items = [
    {"name": "Pagingenableglobal", "pvalue": "22194", "value": ""},
    {"name": "Pttenableglobal", "pvalue": "22177", "value": ""},
    {"name": "Multipagingenableglobal", "pvalue": "22208", "value": ""},
    {"name": "multicastAddress", "pvalue": "22183", "value": ""},
    {"name": "emergencyVolume", "pvalue": "22181", "value": ""},
    {"name": "defaultChannel", "pvalue": "22184", "value": ""},
    {"name": "priorityChannel", "pvalue": "22185", "value": ""},
    {"name": "emergencyChannel", "pvalue": "22186", "value": ""},
    {"name": "acceptatbusy", "pvalue": "22179", "value": ""},
    {"name": "callerID", "pvalue": "22182", "value": ""},
    {"name": "ptime", "pvalue": "22178", "value": ""},
    {"name": "audioCodec", "pvalue": "22180", "value": ""},
    {"name": "pagingbarge", "pvalue": "1566", "value": ""},
    {"name": "pagingpri", "pvalue": "1567", "value": ""},
    {"name": "pagingcodec", "pvalue": "1568", "value": ""},
    {"name": "PagingdefaultChannel", "pvalue": "22199", "value": ""},
    {"name": "PagingpriorityChannel", "pvalue": "22200", "value": ""},
    {"name": "PagingemergencyChannel", "pvalue": "22201", "value": ""},
    {"name": "Pagingacceptatbusy", "pvalue": "22196", "value": ""},
    {"name": "PagingcallerID", "pvalue": "22198", "value": ""},
    {"name": "Pagingptime", "pvalue": "22195", "value": ""},
    {"name": "PagingaudioCodec", "pvalue": "22197", "value": ""},
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
    {"name": "paginglabel9", "pvalue": "1588", "value": ""},
    {"name": "channelUsable", "pvalue": "22187", "value": ""},
    {"name": "channelJoinable", "pvalue": "22188", "value": ""},
    {"name": "channelTransmittable", "pvalue": "22189", "value": ""},
    {"name": "channelReceiveable", "pvalue": "22190", "value": ""},
    {"name": "pttChannelLabel", "pvalue": "22192", "value": ""},
    {"name": "PagingchannelUsable", "pvalue": "22203", "value": ""},
    {"name": "PagingchannelJoinable", "pvalue": "22204", "value": ""},
    {"name": "PagingchannelTransmittable", "pvalue": "22205", "value": ""},
    {"name": "PagingchannelReceiveable", "pvalue": "22206", "value": ""},
    {"name": "PagingChannelLabel", "pvalue": "22207", "value": ""},
];
const PagingChannelModal = Form.create()(Pagingchannel);
const PttchannelModal = Form.create()(Pttchannel);
const ChannelModal = Form.create()(channel);


class Ptt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTab: "0",
            showTab2: "0",
            whichModal: "0",
            Modalvisible: false,
            Modalvisible2: false,
            Modalvisible3: false,
            showVol: 0,
            loading: true,
            showpagingbarge: false
        }
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, () => {
            this.setState({
                showVol: this.props.itemValues.emergencyVolume,
                loading: false,
                showpagingbarge: !!parseInt(this.props.itemValues.pagingpri)
            })
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.enterSave != nextProps.enterSave) {
            this.handleSubmit();
        }
    }

    onChange = (key) => {
        window.scrollTo(0, 0);
        this.props.jumptoTab(key);
    }

    changeTabs1 = (key) => {
        this.setState({
            showTab: key
        })
    }

    updateData = () => {
        this.props.getItemValues(req_items);
    }

    changeTabs2 = (key) => {
        this.setState({
            showTab2: key
        })
    }

    changeVol = (value) => {
        this.setState({
            showVol: value
        })
    }

    checkListenAddr = (rule, value, callback) => {
        if (value.length > 128)
            callback(this.tr("a_lengthlimit") + "128!");

        let valid = false;
        if (value != "") {
            value = $.trim(value);
            let re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
            if (re.test(value)) {
                if (RegExp.$1 > 223 && RegExp.$1 < 240 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
                    valid = true;
                }
            }
        }

        const itemvalue = this.props.itemValues;
        if (value != "") {
            if (value == itemvalue['listenaddr0'].split(":")[0]
                || value == itemvalue['listenaddr1'].split(":")[0]
                || value == itemvalue['listenaddr2'].split(":")[0]
                || value == itemvalue['listenaddr3'].split(":")[0]
                || value == itemvalue['listenaddr4'].split(":")[0]
                || value == itemvalue['listenaddr5'].split(":")[0]
                || value == itemvalue['listenaddr6'].split(":")[0]
                || value == itemvalue['listenaddr7'].split(":")[0]
                || value == itemvalue['listenaddr8'].split(":")[0]
                || value == itemvalue['listenaddr9'].split(":")[0]) {
                callback(this.tr("a_pttAdressError1"));
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
        }

        if (!valid)
            callback(this.tr("a_ipError2"));
        else
            callback();
    }

    showModal = (index) => {
        this.setState({
            whichModal: index,
            Modalvisible: true,
        })
    }

    hideModal = () => {
        this.setState({
            Modalvisible: false,
        })
    }

    showModal2 = () => {
        this.setState({
            Modalvisible2: true,
        })
    }

    hideModal2 = () => {
        this.setState({
            Modalvisible2: false,
        })
    }

    showModal3 = () => {
        this.setState({
            Modalvisible3: true,
        })
    }

    hideModal3 = () => {
        this.setState({
            Modalvisible3: false,
        })
    }

    showpagingbarge = (checked) => {
        this.setState({
            showpagingbarge: checked
        })
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll(
            ["multicastAddress",
                "multiPort",
                "emergencyVolume",
                "defaultChannel",
                "emergencyChannel",
                "priorityChannel",
                "acceptatbusy",
                "callerID",
                "ptime",
                "audioCodec",
                "pagingbarge",
                "pagingcodec",
                "pagingpri",
                "PagingaudioCodec",
                "PagingdefaultChannel",
                "PagingpriorityChannel",
                "PagingemergencyChannel",
                "Pagingacceptatbusy",
                "PagingcallerID",
                "Pagingptime",
                "Pagingenableglobal",
                "Pttenableglobal",
                "Multipagingenableglobal",
            ], (err, values) => {
                if (!err) {
                    const req_items = [
                        {"name": "Pagingenableglobal", "pvalue": "22194", "value": ""},
                        {"name": "Pttenableglobal", "pvalue": "22177", "value": ""},
                        {"name": "Multipagingenableglobal", "pvalue": "22208", "value": ""},
                        {"name": "multicastAddress", "pvalue": "22183", "value": ""},
                        {"name": "emergencyVolume", "pvalue": "22181", "value": ""},
                        {"name": "defaultChannel", "pvalue": "22184", "value": ""},
                        {"name": "priorityChannel", "pvalue": "22185", "value": ""},
                        {"name": "emergencyChannel", "pvalue": "22186", "value": ""},
                        {"name": "acceptatbusy", "pvalue": "22179", "value": ""},
                        {"name": "callerID", "pvalue": "22182", "value": ""},
                        {"name": "ptime", "pvalue": "22178", "value": ""},
                        {"name": "audioCodec", "pvalue": "22180", "value": ""},
                        {"name": "pagingbarge", "pvalue": "1566", "value": ""},
                        {"name": "pagingpri", "pvalue": "1567", "value": ""},
                        {"name": "pagingcodec", "pvalue": "1568", "value": ""},
                        {"name": "channelUsable", "pvalue": "22187", "value": ""},
                        {"name": "channelJoinable", "pvalue": "22188", "value": ""},
                        {"name": "channelTransmittable", "pvalue": "22189", "value": ""},
                        {"name": "channelReceiveable", "pvalue": "22190", "value": ""},
                        {"name": "PagingdefaultChannel", "pvalue": "22199", "value": ""},
                        {"name": "PagingpriorityChannel", "pvalue": "22200", "value": ""},
                        {"name": "PagingemergencyChannel", "pvalue": "22201", "value": ""},
                        {"name": "Pagingacceptatbusy", "pvalue": "22196", "value": ""},
                        {"name": "PagingcallerID", "pvalue": "22198", "value": ""},
                        {"name": "Pagingptime", "pvalue": "22195", "value": ""},
                        {"name": "PagingaudioCodec", "pvalue": "22197", "value": ""},
                        {"name": "PagingchannelUsable", "pvalue": "22203", "value": ""},
                        {"name": "PagingchannelJoinable", "pvalue": "22204", "value": ""},
                        {"name": "PagingchannelTransmittable", "pvalue": "22205", "value": ""},
                        {"name": "PagingchannelReceiveable", "pvalue": "22206", "value": ""},
                    ];
                    values.multicastAddress = values.multicastAddress + ":" + values.multiPort;
                    var a1 = this.props.itemValues.channelUsable
                    a1 = a1.split('')
                    a1[values.priorityChannel - 1] = 1
                    a1[values.emergencyChannel - 1] = 1
                    var b1 = ""
                    b1 = a1.join('');
                    var a2 = this.props.itemValues.channelJoinable
                    a2 = a2.split('')
                    a2[values.priorityChannel - 1] = 1
                    a2[values.emergencyChannel - 1] = 1
                    var b2 = ""
                    b2 = a2.join('');
                    var a3 = this.props.itemValues.channelTransmittable
                    a3 = a3.split('')
                    a3[values.priorityChannel - 1] = 1
                    a3[values.emergencyChannel - 1] = 1
                    var b3 = ""
                    b3 = a3.join('');
                    var a4 = this.props.itemValues.channelReceiveable
                    a4 = a4.split('')
                    a4[values.priorityChannel - 1] = 1
                    a4[values.emergencyChannel - 1] = 1
                    var b4 = ""
                    b4 = a4.join('');
                    var a5 = this.props.itemValues.PagingchannelUsable
                    a5 = a5.split('')
                    a5[values.PagingpriorityChannel - 26] = 1
                    a5[values.PagingemergencyChannel - 26] = 1
                    var b5 = ""
                    b5 = a5.join('');
                    var a6 = this.props.itemValues.PagingchannelJoinable
                    a6 = a6.split('')
                    a6[values.PagingpriorityChannel - 26] = 1
                    a6[values.PagingemergencyChannel - 26] = 1
                    var b6 = ""
                    b6 = a6.join('');
                    var a7 = this.props.itemValues.PagingchannelTransmittable
                    a7 = a7.split('')
                    a7[values.PagingpriorityChannel - 26] = 1
                    a7[values.PagingemergencyChannel - 26] = 1
                    var b7 = ""
                    b7 = a7.join('');
                    var a8 = this.props.itemValues.PagingchannelReceiveable
                    a8 = a8.split('')
                    a8[values.PagingpriorityChannel - 26] = 1
                    a8[values.PagingemergencyChannel - 26] = 1
                    var b8 = ""
                    b8 = a8.join('');
                    values.channelUsable = b1
                    values.channelJoinable = b2
                    values.channelTransmittable = b3
                    values.channelReceiveable = b4
                    values.PagingchannelUsable = b5
                    values.PagingchannelJoinable = b6
                    values.PagingchannelTransmittable = b7
                    values.PagingchannelReceiveable = b8
                    this.props.setItemValues(req_items, values, 0, this.updateData);
                }
            });
    }

    render() {
        const callTr = this.tr;
        const callTipsTr = this.tips_tr;
        const {getFieldDecorator} = this.props.form;
        const itemvalue = this.props.itemValues;
        var arr1 = ["", ""]
        if (itemvalue['multicastAddress']) {
            arr1 = itemvalue['multicastAddress'].split(":")
        }
        var num = 0
        if (this.state.loading) {
            return <div></div>
        }
        var options = []
        for (let i = 0; i < 25; i++) {
            if (itemvalue['channelUsable'][i] == 1 && itemvalue['channelReceiveable'][i] == 1) {
                num++
                options.push(<Option value={i + 1}>{i + 1}</Option>);
            }
        }
        var num2 = 0
        var options2 = []
        for (let i = 0; i < 25; i++) {
            if (itemvalue['PagingchannelUsable'][i] == 1 && itemvalue['PagingchannelReceiveable'][i] == 1) {
                num2++
                options2.push(<Option value={i + 26}>{i + 26}</Option>);
            }
        }
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_ptt")}</div>
                <Form className="configform" style={{'min-height': this.props.mainHeight}}>
                    <p className="blocktitle"><s></s>PTT</p>
                    <div style={{position: "relative"}}>
                        <div className="tabBox">
                            <div className={this.state.showTab == "0" ? "pttTab show" : "pttTab"}
                                 onClick={this.changeTabs1.bind(this, "0")}>
                                {this.tr("a_pttSetting")}
                            </div>
                            <div className={this.state.showTab == "1" ? "pttTab show" : "pttTab"}
                                 onClick={this.changeTabs1.bind(this, "1")}>
                                {this.tr("a_paginSetting")}
                            </div>
                            <div className={this.state.showTab == "2" ? "pttTab show" : "pttTab"}
                                 onClick={this.changeTabs1.bind(this, "2")}>
                                {this.tr("a_PttSetting2")}
                            </div>
                        </div>
                        <div className="tabShowBox">
                            <div className={this.state.showTab == "0" ? "pttTabShow show" : "pttTabShow"}>
                                <FormItem label={<span>{callTr("a_ptt_multicastAddress")}<Tooltip
                                    title={callTipsTr("Spectralink Multicast Address")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("multicastAddress", {
                                        initialValue: arr1[0],
                                        rules: [{
                                            validator: this.checkListenAddr
                                        }],
                                    })(
                                        <Input maxLength="32" className="P-22183"/>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_multiPort")}<Tooltip
                                    title={callTipsTr("Port No.")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("multiPort", {
                                        initialValue: arr1[1],
                                        rules: [{
                                            validator: this.checkPort
                                        }],
                                    })(
                                        <Input maxLength="32" className="P-22183"/>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_emergencyVolume")}<Tooltip
                                    title={callTipsTr("Emergency Intercom volume")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    <Row>
                                        <Col span={23}> {getFieldDecorator("emergencyVolume", {
                                            valuePropName: 'value',
                                            initialValue: itemvalue['emergencyVolume'] ? itemvalue['emergencyVolume'] : "8"
                                        })(
                                            <Slider min={1} max={8} onChange={this.changeVol} className="P-22181"/>
                                        )}</Col>
                                        <Col span={1}><span
                                            style={{color: "#3d77ff"}}>&nbsp;{this.state.showVol}</span></Col>
                                    </Row>
                                </FormItem>
                            </div>
                            <div className={this.state.showTab == "1" ? "pttTabShow show" : "pttTabShow"}>
                                <FormItem label={<span>{callTr("a_spectralinkPaging")}<Tooltip
                                    title={callTipsTr("Group Paging")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("Pagingenableglobal", {
                                        valuePropName: 'checked',
                                        initialValue: !!parseInt(itemvalue['Pagingenableglobal'])
                                    })(
                                        <Switch className="P-22194"/>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_Spectralinkdefault")}<Tooltip
                                    title={callTipsTr("Spectralinkdefault")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("PagingdefaultChannel", {
                                        initialValue: itemvalue['PagingdefaultChannel'] == "-1" ? "" : itemvalue['PagingdefaultChannel']
                                    })(
                                        <Select className="P-22199" disabled={num2 == 0}>
                                            {options2}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_Spectralinkpriority")}<Tooltip
                                    title={callTipsTr("Spectralinkpriority")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("PagingpriorityChannel", {
                                        initialValue: itemvalue['PagingpriorityChannel'] ? itemvalue['PagingpriorityChannel'] : "49"
                                    })(
                                        <Select className="P-22200">
                                            <Option value="26">26</Option>
                                            <Option value="27">27</Option>
                                            <Option value="28">28</Option>
                                            <Option value="29">29</Option>
                                            <Option value="30">30</Option>
                                            <Option value="31">31</Option>
                                            <Option value="32">32</Option>
                                            <Option value="33">33</Option>
                                            <Option value="34">34</Option>
                                            <Option value="35">35</Option>
                                            <Option value="36">36</Option>
                                            <Option value="37">37</Option>
                                            <Option value="38">38</Option>
                                            <Option value="39">39</Option>
                                            <Option value="40">40</Option>
                                            <Option value="41">41</Option>
                                            <Option value="42">42</Option>
                                            <Option value="43">43</Option>
                                            <Option value="44">44</Option>
                                            <Option value="45">45</Option>
                                            <Option value="46">46</Option>
                                            <Option value="47">47</Option>
                                            <Option value="48">48</Option>
                                            <Option value="49">49</Option>
                                            <Option value="50">50</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_Spectralinkemergency")}<Tooltip
                                    title={callTipsTr("Spectralinkemergency")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("PagingemergencyChannel", {
                                        initialValue: itemvalue['PagingemergencyChannel'] ? itemvalue['PagingemergencyChannel'] : "50"
                                    })(
                                        <Select className="P-22201">
                                            <Option value="26">26</Option>
                                            <Option value="27">27</Option>
                                            <Option value="28">28</Option>
                                            <Option value="29">29</Option>
                                            <Option value="30">30</Option>
                                            <Option value="31">31</Option>
                                            <Option value="32">32</Option>
                                            <Option value="33">33</Option>
                                            <Option value="34">34</Option>
                                            <Option value="35">35</Option>
                                            <Option value="36">36</Option>
                                            <Option value="37">37</Option>
                                            <Option value="38">38</Option>
                                            <Option value="39">39</Option>
                                            <Option value="40">40</Option>
                                            <Option value="41">41</Option>
                                            <Option value="42">42</Option>
                                            <Option value="43">43</Option>
                                            <Option value="44">44</Option>
                                            <Option value="45">45</Option>
                                            <Option value="46">46</Option>
                                            <Option value="47">47</Option>
                                            <Option value="48">48</Option>
                                            <Option value="49">49</Option>
                                            <Option value="50">50</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_acceptatbusy")}<Tooltip
                                    title={callTipsTr("Receive when Busy2")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("Pagingacceptatbusy", {
                                        valuePropName: 'checked',
                                        initialValue: !!parseInt(itemvalue['Pagingacceptatbusy'])
                                    })(
                                        <Switch className="P-22196"/>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_callerID")}<Tooltip
                                    title={callTipsTr("Sender ID2")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("PagingcallerID", {
                                        initialValue: itemvalue['PagingcallerID']
                                    })(
                                        <Input maxLength="32" className="P-22198"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label={<span>{callTr("a_ptt_ptime")}<Tooltip title={callTipsTr("Load Size2")}><Icon
                                        type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("Pagingptime", {
                                        initialValue: itemvalue['Pagingptime'] ? itemvalue['Pagingptime'] : "30"
                                    })(
                                        <Select className="P-22195">
                                            <Option value="10">10</Option>
                                            <Option value="20">20</Option>
                                            <Option value="30">30</Option>
                                            <Option value="40">40</Option>
                                            <Option value="50">50</Option>
                                            <Option value="60">60</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_audioCodec")}<Tooltip
                                    title={callTipsTr("Audio Coding2")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("PagingaudioCodec", {
                                        initialValue: itemvalue['PagingaudioCodec'] ? itemvalue['PagingaudioCodec'] : "0"
                                    })(
                                        <Select className="P-22197">
                                            <Option value="0">G.711</Option>
                                            <Option value="1">G.722</Option>
                                            <Option value="2">Opus</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_Spectralinkpaging2")}<Tooltip
                                    title={callTipsTr("Spectralinkpaging2")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    <a style={{marginTop: 7}} className="edit-icon" onClick={this.showModal3}></a>
                                </FormItem>
                            </div>
                            <div className={this.state.showTab == "2" ? "pttTabShow show" : "pttTabShow"}>
                                <FormItem label={<span>PTT<Tooltip title={callTipsTr("PTT")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("Pttenableglobal", {
                                        valuePropName: 'checked',
                                        initialValue: !!parseInt(itemvalue['Pttenableglobal'])
                                    })(
                                        <Switch className="P-22177"/>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_defaultChannel")}<Tooltip
                                    title={callTipsTr("Default Channel")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("defaultChannel", {
                                        initialValue: itemvalue['defaultChannel'] == "-1" ? "" : itemvalue['defaultChannel']
                                    })(
                                        <Select className="P-22184" disabled={num == 0}>
                                            {options}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_priorityChannel")}<Tooltip
                                    title={callTipsTr("Priority Call Channel")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("priorityChannel", {
                                        initialValue: itemvalue['priorityChannel'] ? itemvalue['priorityChannel'] : "24"
                                    })(
                                        <Select className="P-22185">
                                            <Option value="1">1</Option>
                                            <Option value="2">2</Option>
                                            <Option value="3">3</Option>
                                            <Option value="4">4</Option>
                                            <Option value="5">5</Option>
                                            <Option value="6">6</Option>
                                            <Option value="7">7</Option>
                                            <Option value="8">8</Option>
                                            <Option value="9">9</Option>
                                            <Option value="10">10</Option>
                                            <Option value="11">11</Option>
                                            <Option value="12">12</Option>
                                            <Option value="13">13</Option>
                                            <Option value="14">14</Option>
                                            <Option value="15">15</Option>
                                            <Option value="16">16</Option>
                                            <Option value="17">17</Option>
                                            <Option value="18">18</Option>
                                            <Option value="19">19</Option>
                                            <Option value="20">20</Option>
                                            <Option value="21">21</Option>
                                            <Option value="22">22</Option>
                                            <Option value="23">23</Option>
                                            <Option value="24">24</Option>
                                            <Option value="25">25</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_emergencyChannel")}<Tooltip
                                    title={callTipsTr("Emergency Call Channel")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("emergencyChannel", {
                                        initialValue: itemvalue['emergencyChannel'] ? itemvalue['emergencyChannel'] : "25"
                                    })(
                                        <Select className="P-22186">
                                            <Option value="1">1</Option>
                                            <Option value="2">2</Option>
                                            <Option value="3">3</Option>
                                            <Option value="4">4</Option>
                                            <Option value="5">5</Option>
                                            <Option value="6">6</Option>
                                            <Option value="7">7</Option>
                                            <Option value="8">8</Option>
                                            <Option value="9">9</Option>
                                            <Option value="10">10</Option>
                                            <Option value="11">11</Option>
                                            <Option value="12">12</Option>
                                            <Option value="13">13</Option>
                                            <Option value="14">14</Option>
                                            <Option value="15">15</Option>
                                            <Option value="16">16</Option>
                                            <Option value="17">17</Option>
                                            <Option value="18">18</Option>
                                            <Option value="19">19</Option>
                                            <Option value="20">20</Option>
                                            <Option value="21">21</Option>
                                            <Option value="22">22</Option>
                                            <Option value="23">23</Option>
                                            <Option value="24">24</Option>
                                            <Option value="25">25</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_acceptatbusy")}<Tooltip
                                    title={callTipsTr("Receive when Busy")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("acceptatbusy", {
                                        valuePropName: 'checked',
                                        initialValue: !!parseInt(itemvalue['acceptatbusy'])
                                    })(
                                        <Switch className="P-22179"/>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_callerID")}<Tooltip
                                    title={callTipsTr("Sender ID")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("callerID", {
                                        initialValue: itemvalue['callerID']
                                    })(
                                        <Input maxLength="32" className="P-22182"/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label={<span>{callTr("a_ptt_ptime")}<Tooltip title={callTipsTr("Load Size")}><Icon
                                        type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("ptime", {
                                        initialValue: itemvalue['ptime'] ? itemvalue['ptime'] : "30"
                                    })(
                                        <Select className="P-22178">
                                            <Option value="10">10</Option>
                                            <Option value="20">20</Option>
                                            <Option value="30">30</Option>
                                            <Option value="40">40</Option>
                                            <Option value="50">50</Option>
                                            <Option value="60">60</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_audioCodec")}<Tooltip
                                    title={callTipsTr("Audio Coding")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("audioCodec", {
                                        initialValue: itemvalue['audioCodec'] ? itemvalue['audioCodec'] : "0"
                                    })(
                                        <Select className="P-22180">
                                            <Option value="0">G.711</Option>
                                            <Option value="1">G.722</Option>
                                            <Option value="2">Opus</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label={<span>{callTr("a_ptt_channel")}<Tooltip
                                    title={callTipsTr("channelSeting")}><Icon
                                    type="question-circle-o"/></Tooltip></span>}>
                                    <a style={{marginTop: 7}} className="edit-icon" onClick={this.showModal2}></a>
                                </FormItem>
                            </div>
                        </div>
                    </div>
                    <p className="blocktitle"><s></s>{this.tr("a_multicast")}</p>
                    <div className="tabBox">
                        <div className={this.state.showTab2 == "0" ? "pttTab show" : "pttTab"}
                             onClick={this.changeTabs2.bind(this, "0")}>
                            {this.tr("a_pttSetting")}
                        </div>
                        <div className={this.state.showTab2 == "1" ? "pttTab show" : "pttTab"}
                             onClick={this.changeTabs2.bind(this, "1")}>
                            {this.tr("a_paginSetting")}
                        </div>
                    </div>
                    <div className="tabShowBox">
                        <div className={this.state.showTab2 == "0" ? "pttTabShow show" : "pttTabShow"}>
                            <FormItem label={<span>{callTr("a_pagingpri")}<Tooltip
                                title={callTipsTr("Paging Priority Active_wp")}><Icon
                                type="question-circle-o"/></Tooltip></span>}>
                                {getFieldDecorator("pagingpri", {
                                    valuePropName: 'checked',
                                    initialValue: !!parseInt(itemvalue['pagingpri'])
                                })(
                                    <Switch className="P-1567" onChange={this.showpagingbarge}/>
                                )}
                            </FormItem>
                            <div style={{display: this.state.showpagingbarge ? "none" : "block"}}>
                                <FormItem
                                    label={<span>{callTr("a_pagingbarge")}<Tooltip
                                        title={callTipsTr("Paging Barge_wp")}><Icon
                                        type="question-circle-o"/></Tooltip></span>}>
                                    {getFieldDecorator("pagingbarge", {
                                        initialValue: itemvalue['pagingbarge'] ? itemvalue['pagingbarge'] : "0"
                                    })(
                                        <Select className="P-1566">
                                            <Option value="0">{callTr("a_disable")}</Option>
                                            <Option value="1">1</Option>
                                            <Option value="2">2</Option>
                                            <Option value="3">3</Option>
                                            <Option value="4">4</Option>
                                            <Option value="5">5</Option>
                                            <Option value="6">6</Option>
                                            <Option value="7">7</Option>
                                            <Option value="8">8</Option>
                                            <Option value="9">9</Option>
                                            <Option value="10">10</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </div>
                            <FormItem label={<span>{callTr("a_pagingcodec")}<Tooltip
                                title={callTipsTr("Multicast Paging Codec")}><Icon
                                type="question-circle-o"/></Tooltip></span>}>
                                {getFieldDecorator("pagingcodec", {
                                    initialValue: itemvalue['pagingcodec'] ? itemvalue['pagingcodec'] : "0"
                                })(
                                    <Select className="P-1568">
                                        <Option value="0">PCMU</Option>
                                        <Option value="8">PCMA</Option>
                                        <Option value="2">G726-32</Option>
                                        <Option value="9">G722</Option>
                                        <Option value="18">G729A/B</Option>
                                        <Option value="98">iLBC</Option>
                                        <Option value="123">Opus</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                        <div id="channel" className={this.state.showTab2 == "1" ? "pttTabShow show" : "pttTabShow"}>
                            <FormItem label={<span>{callTr("a_multicast")}<Tooltip
                                title={callTipsTr("Multicast Paging")}><Icon
                                type="question-circle-o"/></Tooltip></span>}>
                                {getFieldDecorator("Multipagingenableglobal", {
                                    valuePropName: 'checked',
                                    initialValue: !!parseInt(itemvalue['Multipagingenableglobal'])
                                })(
                                    <Switch className="P-22208"/>
                                )}
                            </FormItem>
                            <FormItem label={<span>{callTr("a_multicast_channel")}<Tooltip
                                title={callTipsTr("Channel2")}><Icon
                                type="question-circle-o"/></Tooltip></span>}>
                                <div className="channelList_box">
                                    {[...Array(10)].map((item, i) => {
                                        return <div className="channelList" onClick={this.showModal.bind(this, i)}>
                                            <span>{i + 1}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            <span>{itemvalue[`paginglabel${i}`] ? itemvalue[`paginglabel${i}`] : itemvalue[`listenaddr${i}`] ? itemvalue[`listenaddr${i}`] :
                                                <span
                                                    style={{color: "#bac0ca"}}>{callTr("a_ptt_noSetting")}</span>}</span>
                                        </div>
                                    })}
                                </div>
                            </FormItem>
                        </div>
                    </div>
                    <Button className="submit" style={{marginLeft: 30, fontSize: '14px'}} type="primary"
                            onClick={this.handleSubmit}>{callTr("a_save")}</Button>
                </Form>
                <PttchannelModal {...this.props} Modalvisible={this.state.Modalvisible} updateData={this.updateData}
                                 callTr={this.tr}
                                 hideFun={this.hideModal} whichModal={this.state.whichModal}></PttchannelModal>
                <ChannelModal {...this.props} Modalvisible={this.state.Modalvisible2} updateData={this.updateData}
                              callTr={this.tr}
                              hideFun={this.hideModal2}></ChannelModal>
                <PagingChannelModal {...this.props} Modalvisible={this.state.Modalvisible3} updateData={this.updateData}
                                    callTr={this.tr}
                                    hideFun={this.hideModal3}></PagingChannelModal>
            </Content>
        );
    }
}

const pttForm = Form.create()(Enhance(Ptt));


const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    product: state.product,
    mainHeight: state.mainHeight,
    userType: state.userType,
    activeKey: state.TabactiveKey,
    itemValues: state.itemValues,
    enterSave: state.enterSave,
})

function mapDispatchToProps(dispatch) {
    var actions = {
        promptMsg: Actions.promptMsg,
        getItemValues: Actions.getItemValues,
        setItemValues: Actions.setItemValues,
        jumptoTab: Actions.jumptoTab
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(pttForm);