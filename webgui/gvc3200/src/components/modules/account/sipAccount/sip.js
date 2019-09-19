import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance"
import * as Store from '../../../entry'
import { Form, Layout, Input, Icon, Tooltip, Checkbox, Radio, Select, Button } from "antd"
const FormItem = Form.Item
const Content = Layout
const Option = Select.Option
const RadioGroup = Radio.Group
let req_items = new Array;
const nvram = {
    'sipreg': "31",   //sip注册
    'unreg': "81",    //重新注册前注销
    'regexp': "32",   //注册期限(分钟)
    'subexp': "26051",
    'regbeforeexp': "2330", //注册期限内重新注册等待时间
    'retrytime': "138", //重新注册间隔时间
    'sipport': "40", // sip端口
    'mwi': "99",  // 支持mwi
    'opensession': "260",  // 开启会话超时
    'seexp': "sessionexp_0", // 会话超时时间
    'minse': "261", // 会话最小超时时间
    'uacref': "266", // UAC指定刷新对象
    'uasref': "267", // UAS指定刷新对象
    'forinvite': "265", // 强制INVITE
    'callert': "262", // 主叫请求计时
    'calleet': "263", // 被叫请求计时
    'forcet': "264",  // 强制计时
    '100rel': "272", // 开启 100rel
    'callerdisplay': "2324", // 来电ID显示
    'usepheader': "2338", //使用Privacy头域
    'useppiheader': "2339", //使用P-Preferred-Identity头域
    'usemacheader': '26061',  //使用mac头域
    'siptranport': "130", // sip传输
    'sipschema': "2329", // TLS使用的SIP URI格式
    'useepport': "2331", // TCP/TLS Contact使用实际临时端口
    'symrtp': "1860", //对称RTP
    'suptsipintid': "288", // 支持SIP实例ID
    'validincommsg': "2306",  // 验证入局SIP消息
    'checkinvite': "258",     // 检查来电INVITE的SIP用户ID
    'authinvite': "2346",      // 验证来电INVITE
    'siprealm': "26021",      // 用于Challenge INVITE ＆ NOTIFY的SIP Realm
    'accpsip': "2347",        // 仅接受已知服务器的SIP请求
    'sipt1to': "209",        // SIP T1 超时时间
    'sipt2int': "250",       // SIP T2间隔时间
    'siptdint': "2387",      //SIP Timer D间隔时间
    'removeobp': "2305",     // 从路由移除OBP
    'checkdomain': "2311",   // 检查域名证书
    'validatecert': "2867",    // 验证证书链
    'RFC2543Hold': "26062",
    'rtpipfilter' : "26026",
    'rtptimeout' : "29068"
}

class SipForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opensession: false }
    }

    handlePvalue = () => {
        req_items = [];
        req_items.push(
            this.getReqItem("sipreg", nvram["sipreg"], ""),
            this.getReqItem("unreg", nvram["unreg"], ""),
            this.getReqItem("regexp", nvram["regexp"], ""),
            this.getReqItem("regbeforeexp", nvram["regbeforeexp"], ""),
            this.getReqItem("subexp", nvram["subexp"], ""),
            this.getReqItem("retrytime", nvram["retrytime"], ""),
            this.getReqItem("sipport", nvram["sipport"], ""),
            this.getReqItem("mwi", nvram["mwi"], ""),
            this.getReqItem("opensession", nvram["opensession"], ""),
            this.getReqItem("seexp", nvram["seexp"], ""),
            this.getReqItem("minse", nvram["minse"], ""),
            this.getReqItem("uacref", nvram["uacref"], ""),
            this.getReqItem("uasref", nvram["uasref"], ""),
            this.getReqItem("forinvite", nvram["forinvite"], ""),
            this.getReqItem("callert", nvram["callert"], ""),
            this.getReqItem("calleet", nvram["calleet"], ""),
            this.getReqItem("forcet", nvram["forcet"], ""),
            this.getReqItem("100rel", nvram["100rel"], ""),
            this.getReqItem("callerdisplay", nvram["callerdisplay"], ""),
            this.getReqItem("usepheader", nvram["usepheader"], ""),
            this.getReqItem("useppiheader", nvram["useppiheader"], ""),
            this.getReqItem("usemacheader", nvram["usemacheader"], ""),
            this.getReqItem("siptranport", nvram["siptranport"], ""),
            this.getReqItem("sipschema", nvram["sipschema"], ""),
            this.getReqItem("useepport", nvram["useepport"], ""),
            this.getReqItem("symrtp", nvram["symrtp"], ""),
            this.getReqItem("suptsipintid", nvram["suptsipintid"], ""),
            this.getReqItem("validincommsg", nvram["validincommsg"], ""),
            this.getReqItem("checkinvite", nvram["checkinvite"], ""),
            this.getReqItem("authinvite", nvram["authinvite"], ""),
            this.getReqItem("siprealm", nvram["siprealm"], ""),
            this.getReqItem("accpsip", nvram["accpsip"], ""),
            this.getReqItem("sipt1to", nvram["sipt1to"], ""),
            this.getReqItem("sipt2int", nvram["sipt2int"], ""),
            this.getReqItem("siptdint", nvram["siptdint"], ""),
            this.getReqItem("removeobp", nvram["removeobp"], ""),
            this.getReqItem("checkdomain", nvram["checkdomain"], ""),
            this.getReqItem("validatecert", nvram["validatecert"], ""),
            this.getReqItem("RFC2543Hold", nvram["RFC2543Hold"], ""),
            this.getReqItem("rtpipfilter", nvram["rtpipfilter"], ""),
            this.getReqItem("rtptimeout", nvram["rtptimeout"], ""),
        );
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            let opensession = Boolean(parseInt(values['opensession']));
            this.handleOpenSession(opensession);
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed or selected account changed
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue(), (values) => {
                    let opensession = Boolean(parseInt(values['opensession']));
                    this.handleOpenSession(opensession);
                });
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleOpenSession = (e) => {
        if (typeof e == 'boolean') {
            this.setState({ opensession: e })
        } else {
            this.setState({ opensession: e.target.checked })
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                for (let key in values) {
                    if (values[key] == undefined) {
                        values[key] = ""
                    }
                }
                if (parseFloat(values['seexp']) < parseFloat(values["minse"])) {
                    Store.store.dispatch({ type: 'MSG_PROMPT', notifyMsg: { type: "ERROR", content: 'a_16443' } });
                    return false;
                }
                if (values["seexpCheckbox"]) {
                    values["opensession"] = values["seexp"]
                } else {
                    values["opensession"] = '0'
                }
                this.props.setItemValues(this.handlePvalue(), values, 1);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        let itemList =
            <Form style={{height: this.props.mainHeight - 57, overflowY: 'auto', overflowX: 'hidden'}} hideRequiredMark>
                <FormItem label={(<span>{callTr("a_16066")}&nbsp;<Tooltip title={this.tips_tr("SIP Registration")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('sipreg', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["sipreg"])
                    })(<Checkbox className={"P-" + nvram["sipreg"]} />)
                    }
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16067")}&nbsp;<Tooltip title={this.tips_tr("Unregister Before New Registration")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('unreg', {
                        initialValue: this.props.itemValues['unreg'] ? this.props.itemValues['unreg'] : "0"
                    })(
                        <Select className={"P-" + nvram["unreg"]}>
                            <Option value="0">{callTr("a_6")}</Option>
                            <Option value="1">{callTr("a_10009")}</Option>
                            <Option value="2">Instance</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16069")}&nbsp;<Tooltip title={this.tips_tr("Register Expiration")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('regexp', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 1, 64800)
                            }
                        }],
                        initialValue: this.props.itemValues['regexp']
                    })(
                        <Input type="text" className={"P-" + nvram["regexp"]} />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_19802")}&nbsp;<Tooltip title={this.tips_tr("Reregister before Expiration")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('regbeforeexp', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 64800)
                            }
                        }],
                        initialValue: this.props.itemValues['regbeforeexp'] || '0'
                    })(
                        <Input type="text" className={"P-" + nvram["regbeforeexp"]} />
                    )}
                </FormItem>
                {/* 订阅超时 */}
                <FormItem label={(<span>{callTr("a_12238")}&nbsp;<Tooltip title={this.tips_tr("Subscribe Expiration")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('subexp', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 64800)
                            }
                        }],
                        initialValue: this.props.itemValues['subexp'] || '0'
                    })(
                        <Input type="text" className={"P-" + nvram["subexp"]} />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16070")}&nbsp;<Tooltip title={this.tips_tr("Wait Time Retry Registration")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('retrytime', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 1, 3600)
                            }
                        }],
                        initialValue: this.props.itemValues['retrytime']
                    })(
                        <Input type="text" className={"P-" + nvram["retrytime"]} />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16071")}&nbsp;<Tooltip title={this.tips_tr("Local SIP Port")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('sipport', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 65535)
                            }
                        }],
                        initialValue: this.props.itemValues['sipport']
                    })(
                        <Input type="text" className={"P-" + nvram["sipport"]} />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16072")}&nbsp;<Tooltip title={this.tips_tr("SUBSCRIBE for MWI")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('mwi', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["mwi"])
                    })(<Checkbox className={"P-" + nvram["mwi"]} />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16675")}&nbsp;<Tooltip title={this.tips_tr("Enable Session Timer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('seexpCheckbox', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["opensession"]) ? true : false
                    })(<Checkbox onChange={this.handleOpenSession} className={"P-" + nvram["opensession"]} />)
                    }
                </FormItem>
                <FormItem style={{ display: this.state.opensession ? 'block' : 'none' }} label={(<span>{callTr("a_16073")}&nbsp;<Tooltip title={this.tips_tr("Session Expiration")} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('seexp', {
                        rules: [{
                            required: true,
                            message: this.tr("a_19637")
                        }, {
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 90, 64800)
                            }
                        }],
                        initialValue: parseInt(this.props.itemValues["opensession"]) ? parseInt(this.props.itemValues["opensession"]) : this.props.itemValues["seexp"]
                    })(
                        <Input type="text" className={"P-" + nvram["seexp"]} />
                    )}
                </FormItem>
                <FormItem style={{ display: this.state.opensession ? 'block' : 'none' }} label={(<span>{callTr("a_16074")}&nbsp;<Tooltip title={this.tips_tr("Min-SE")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('minse', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 90, 64800)
                            }
                        }],
                        initialValue: this.props.itemValues["minse"]
                    })(
                        <Input type="text" className={"P-" + nvram["minse"]} />
                    )}
                </FormItem>
                <FormItem style={{ display: this.state.opensession ? 'block' : 'none' }} className="select-item" label={(<span>{callTr("a_16075")}&nbsp;<Tooltip title={this.tips_tr("UAC Specify Refresher")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('uacref', {
                        initialValue: this.props.itemValues['uacref'] ? this.props.itemValues['uacref'] : "0"
                    })(
                        <Select className={"P-" + nvram["uacref"]}>
                            <Option value="0">Omit</Option>
                            <Option value="1">UAC</Option>
                            <Option value="2">UAS</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem style={{ display: this.state.opensession ? 'block' : 'none' }} className="select-item" label={(<span>{callTr("a_16076")}&nbsp;<Tooltip title={this.tips_tr("UAS Specify Refresher")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('uasref', {
                        initialValue: this.props.itemValues['uasref'] ? this.props.itemValues['uasref'] : "1"
                    })(
                        <Select className={"P-" + nvram["uasref"]}>
                            <Option value="1">UAC</Option>
                            <Option value="2">UAS</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem style={{ display: this.state.opensession ? 'block' : 'none' }} label={(<span>{callTr("a_16077")}&nbsp;<Tooltip title={this.tips_tr("Force INVITE")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('forinvite', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["forinvite"])
                    })(<Checkbox className={"P-" + nvram["forinvite"]} />)
                    }
                </FormItem>
                <FormItem style={{ display: this.state.opensession ? 'block' : 'none' }} label={(<span>{callTr("a_16090")}&nbsp;<Tooltip title={this.tips_tr("Caller Request Timer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('callert', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["callert"])
                    })(<Checkbox className={"P-" + nvram["callert"]} />)
                    }
                </FormItem>
                <FormItem style={{ display: this.state.opensession ? 'block' : 'none' }} label={(<span>{callTr("a_16091")}&nbsp;<Tooltip title={this.tips_tr("Callee Request Timer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('calleet', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["calleet"])
                    })(<Checkbox className={"P-" + nvram["calleet"]} />)
                    }
                </FormItem>
                <FormItem style={{ display: this.state.opensession ? 'block' : 'none' }} label={(<span>{callTr("a_16092")}&nbsp;<Tooltip title={this.tips_tr("Force Timer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('forcet', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["forcet"])
                    })(<Checkbox className={"P-" + nvram["forcet"]} />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16085")}&nbsp;<Tooltip title={this.tips_tr("Enable 100rel")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('100rel', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["100rel"])
                    })(<Checkbox className={"P-" + nvram["100rel"]} />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16086")}&nbsp;<Tooltip title={this.tips_tr("Caller ID Display")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {/* 来电ID显示 */}
                    {getFieldDecorator('callerdisplay', {
                        initialValue: this.props.itemValues['callerdisplay'] ? this.props.itemValues['callerdisplay'] : "0"
                    })(
                        <Select>
                            <Option value="0">{callTr("a_1015")}</Option>
                            <Option value="1">{callTr("a_39")}</Option>
                            <Option value="2">{callTr("a_16087")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16088")}&nbsp;<Tooltip title={this.tips_tr("Use Privacy Header")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('usepheader', {
                        initialValue: this.props.itemValues['usepheader'] ? this.props.itemValues['usepheader'] : "0"
                    })(
                        <Select>
                            <Option value="0">{callTr("a_12")}</Option>
                            <Option value="1">{callTr("a_6")}</Option>
                            <Option value="2">{callTr("a_5")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16089")}&nbsp;<Tooltip title={this.tips_tr("Use P-Preferred-Identity Header")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('useppiheader', {
                        initialValue: this.props.itemValues['useppiheader'] ? this.props.itemValues['useppiheader'] : "0"
                    })(
                        <Select>
                            <Option value="0">{callTr("a_12")}</Option>
                            <Option value="1">{callTr("a_6")}</Option>
                            <Option value="2">{callTr("a_5")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 使用mac头域 */}
                <FormItem className="select-item" label={(<span>{callTr("a_12237")}&nbsp;<Tooltip title={this.tips_tr("Use Mac Header")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('usemacheader', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['usemacheader'] ? this.props.itemValues['usemacheader'] : "0")
                    })(<Checkbox className={"P-" + nvram["usemacheader"]} />)}
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16093")}&nbsp;<Tooltip title={this.tips_tr("SIP Transport")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('siptranport', {
                        initialValue: this.props.itemValues['siptranport'] ? this.props.itemValues['siptranport'] : "0"
                    })(
                        <Select className={"P-" + nvram["siptranport"]}>
                            <Option value="0">UDP</Option>
                            <Option value="1">TCP</Option>
                            <Option value="2">TLS</Option>
                        </Select>
                    )}
                </FormItem>
                {/* RTP IP过滤 */}
                <FormItem label={(<span>{callTr("a_19154")}&nbsp;<Tooltip title={this.tips_tr("RTP IP Filter")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('rtpipfilter', {
                        initialValue: this.props.itemValues['rtpipfilter'] ? this.props.itemValues['rtpipfilter'] : "0"
                    })(
                        <Select className={"P-" + nvram["rtpipfilter"]}>
                            <Option value="0">{callTr("a_32")}</Option>
                            <Option value="1">{callTr("a_19155")}</Option>
                            <Option value="2">{callTr("a_19156")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* RTP 超时(秒) */}
                <FormItem label={(<span>{callTr("a_19287")}&nbsp;<Tooltip title={this.tips_tr("RTP Timeout (s)")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('rtptimeout', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 600)
                            }
                        }],
                        initialValue: this.props.itemValues['rtptimeout']
                        })(<Input className={"P-" + nvram["rtptimeout"]}/>)
                   }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16094")}&nbsp;<Tooltip title={this.tips_tr("SIP URI Scheme When Using TLS")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('sipschema', {
                        initialValue: this.props.itemValues['sipschema']
                    })(
                        <RadioGroup className={"P-" + nvram["sipschema"]}>
                            <Radio value="0">sip</Radio>
                            <Radio value="1">sips</Radio>
                        </RadioGroup>
                    )
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16095")}&nbsp;<Tooltip title={this.tips_tr("Use Actual Ephemeral Port in Contact with TCP/TLS")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('useepport', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["useepport"])
                    })(<Checkbox className={"P-" + nvram["useepport"]} />)
                    }
                </FormItem>
                <FormItem  label={(<span>{'RFC2543 Hold'}&nbsp;<Tooltip title={this.tips_tr("RFC2543 Hold")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('RFC2543Hold', {
                        valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues['RFC2543Hold'])
                   })(
                        <Checkbox className={"P-" + nvram["RFC2543Hold"]} />
                   )
                   }
               </FormItem>
                <FormItem label={(<span>{callTr("a_16096")}&nbsp;<Tooltip title={this.tips_tr("Symmetric RTP")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {/* 对称RTP */}
                    {getFieldDecorator('symrtp', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["symrtp"])
                    })(<Checkbox className={"P-" + nvram["symrtp"]} />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16097")}&nbsp;<Tooltip title={this.tips_tr("Support SIP Instance ID")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('suptsipintid', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["suptsipintid"])
                    })(<Checkbox className={"P-" + nvram["suptsipintid"]} />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16098")}&nbsp;<Tooltip title={this.tips_tr("Validate Incoming SIP Messages")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {/* 验证入局SIP消息 */}
                    {getFieldDecorator('validincommsg', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["validincommsg"])
                    })(<Checkbox className={"P-" + nvram["validincommsg"]} />)
                    }
                </FormItem>

                <FormItem label={(<span>{callTr("a_16078")}&nbsp;<Tooltip title={this.tips_tr("Check SIP User ID for Incoming INVITE")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {/* 检查来电INVITE的SIP用户ID  */}
                    {getFieldDecorator('checkinvite', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["checkinvite"])
                    })(<Checkbox className={"P-" + nvram["checkinvite"]} />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16079")}&nbsp;<Tooltip title={this.tips_tr("Authenticate Incoming INVITE")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {/* 验证来电INVITE  */}
                    {getFieldDecorator('authinvite', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["authinvite"])
                    })(<Checkbox className={"P-" + nvram["authinvite"]} />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16691")}&nbsp;<Tooltip title={this.tips_tr("SIP Realm Used for Challenge INVITE & NOTIFY")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {/* 用于Challenge INVITE ＆ NOTIFY的SIP Realm  */}
                    {getFieldDecorator('siprealm', {
                        initialValue: this.props.itemValues['siprealm']
                    })(
                        <Input type="text" className={"P-" + nvram["siprealm"]} />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16080")}&nbsp;<Tooltip title={this.tips_tr("Only Accept SIP Requests from Known Servers")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {/* 仅接受已知服务器的SIP请求  */}
                    {getFieldDecorator('accpsip', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["accpsip"])
                    })(<Checkbox className={"P-" + nvram["accpsip"]} />)
                    }
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16099")}&nbsp;<Tooltip title={this.tips_tr("SIP T1 Timeout")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('sipt1to', {
                        initialValue: this.props.itemValues['sipt1to'] ? this.props.itemValues['sipt1to'] : "50"
                    })(
                        <Select className={"P-" + nvram["sipt1to"]}>
                            <Option value="50">0.5{callTr("a_113")}</Option>
                            <Option value="100">1{callTr("a_113")}</Option>
                            <Option value="200">2{callTr("a_113")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16100")}&nbsp;<Tooltip title={this.tips_tr("SIP T2 Interval")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('sipt2int', {
                        initialValue: this.props.itemValues['sipt2int'] ? this.props.itemValues['sipt2int'] : "200"
                    })(
                        <Select className={"P-" + nvram["sipt2int"]}>
                            <Option value="200">2{callTr("a_113")}</Option>
                            <Option value="400">4{callTr("a_113")}</Option>
                            <Option value="800">8{callTr("a_113")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_19803")}&nbsp;<Tooltip title={this.tips_tr("SIP Timer D Interval")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('siptdint', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 64)
                            }
                        }],
                        initialValue: this.props.itemValues['siptdint']
                    })(
                        <Input type="text" className={"P-" + nvram["siptdint"]} />
                    )}
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16101")}&nbsp;<Tooltip title={this.tips_tr("Remove OBP from route")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('removeobp', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['removeobp'])
                    })(<Checkbox className={"P-" + nvram["removeobp"]} />)}
                </FormItem>

                <FormItem label={(<span>{callTr("a_16102")}&nbsp;<Tooltip title={this.tips_tr("Check Domain Certificates")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {/* 检查域名证书 */}
                    {getFieldDecorator('checkdomain', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["checkdomain"])
                    })(<Checkbox className={"P-" + nvram["checkdomain"]} />)
                    }
                </FormItem>

                <FormItem label={(<span>{callTr("a_19336")}&nbsp;<Tooltip title={this.tips_tr("Validate Certification Chain")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {/* 验证证书链 */}
                    {getFieldDecorator('validatecert', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["validatecert"])
                    })(<Checkbox className={"P-" + nvram["validatecert"]} />)
                    }
                </FormItem>

                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
                <FormItem>
                    {getFieldDecorator('opensession', {
                        rules: [],
                        initialValue: this.props.itemValues["opensession"]
                    })(
                        <Input style={{ "display": "none" }} type="text" className={"P-" + nvram["opensession"]} />
                    )}
                </FormItem>
            </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length - 1; i >= 0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;

    }
}

const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey,
    mainHeight: state.mainHeight
})

export default connect(mapStateToProps)(Enhance(SipForm));
