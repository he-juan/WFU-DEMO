import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance"
import { FormattedHTMLMessage } from 'react-intl'
import { Form, Layout, Transfer, Modal, Input, Icon, Tooltip, Checkbox, Radio, Select, Button } from "antd"
const FormItem = Form.Item
const Content = Layout
const Option = Select.Option
const RadioGroup = Radio.Group
let req_items = new Array;
let dtmfpayload;
const nvram = {
    /**
     * 音频
     */
    'inaudio': "2301", //DTMF inaudio
    'RFC2833': "2302", //DTMF RFC2833
    'sipinfo': "2303", //DTMF sipinfo
    'dtmfpayload': "79", // DTMF有效荷载类型
    'P57': "57",       // 语音编码
    'P58': "58",
    'P59': "59",
    'P60': "60",
    'P61': "61",
    'P62': "62",
    'P46': "46",
    'P98': "98",
    'codecpri': "29061", // 编码协商优先级
    'silencesup': "50",  // 静音抑制
    'vocfp': "37",      // 语音帧/TX
    'g722rate': "2373",   // 新增  G.722.1速率
    'g722payload': "2374", // 新增 G.722.1有效荷载类型
    'g7221crate': "26017",  // 新增 G.722.1C 速率
    'g7221cpayload': "26016", // 新增  G.722.1C有效荷载类型
    'opuspayload': "2385",  // Opus有效荷载类型
    'ilibcfs': "97",       // iLBC帧大小
    'usefvcode': "2348",   // 使用200OK SDP中首位匹配编码
    'audioredfec': "26073", // 开启音频前向纠错
    'audiofecpayload': "26074", // 音频FEC有效荷载类型 
    'audioredpayload': "26075", // 音频RED有效荷载类型 
    /**
     * 视频
     */
    'P295': "295",
    'P296': "296",
    'enablerfc': "1331",        // 支持RFC5168
    'enablertx' : "26085",     // 丢包重传
    'enablefec': "2393",       // 开启视频前向纠错
    'fecmode': "26022",        // 视频前向纠错模式
    'fecpayload': "2394",      // FEC有效荷载类型
    'enablefecc': "26004",     // 新增 开启FECC
    'feccpayload': "26008",         //新增 FECC H.224有效荷载类型
    'h264payload': "293",           // H.264有效荷载类型
    'packetmodel': "26005",         // 打包模式
    'imgsize': "2307",              //H.264 视频大小
    'protype': "2362",              // H.264 Profile 类型
    'useh264profile': "26045",      // 使用H.264 Constrained Profiles
    'vbrate': "2315",              //视频比特率
    'sdpattr': "2360",            // SDP带宽属性
    'vidframerate': "25004",      // 新增  视频帧率
    'jittermax': "2381",          // 新增  视频抖动缓冲区最大值
    'decoderefresh': "25111",      // 新增  开启视频渐进刷新
    'h265payload':"26086",         // H.265有效荷载类型
    /**
     * 演示
     */
    'disablepresent': "26001",    // 禁止演示
    'initialinvite': "sendPreMode_0",  // 初始INVITE携带媒体信息
    'presentimagesize': "2376",    // 演示H.264 视频大小
    'presentprofile': "2377",      // 演示H.264 Profile类型
    'presentvideobitrate': "2378",  // 演示视频速率
    'presentvideoframebate': "26042", // 演示视频帧率
    'bfcptranspro': "26041",         // BFCP传输协议

    /**
     * SRTP
     */
    'srtp': "183",                  // SRTP方式
    'encryptdigit': "2383",         // SRTP加密位数

}

class CodecForm extends React.Component {
    constructor(props) {
        super(props);
        this.handlePvalue();
        
        this.state = {
            vbrateAvailable: [],
            VocoderData: [],
            VocoderTargetKeys: [],
            VideoDate: [],
            VideoTargetKeys: [],
            beforeImgsize: "",
            beforePacketModel: "",
            disablePresentStatus: false
        }

        // 视频大小对应的视频比特率
        this.imgsizeToVbrate = {
            '11' : ['1024','1280','1536','1792','2048','2560','3072','3584','4096', '4608', '5120', '5632', '6144', '6656', '7168', '7680', '8192'],
            '10': ['1024','1280','1536','1792','2048','2560','3072','3584','4096'],
            '9' : ['512', '640', '768', '896', '1024', '1280', '1536', '1792', '2048'],
            '4' : ['384', '400', '416', '448', '512', '640', '768', '896', '1024'],
            '7' : ['384', '400', '416', '448', '512', '640', '768', '896', '1024'],
            '1' : ['384', '400', '416', '448', '512', '640', '768', '896', '1024'],
        }
    }

    handlePvalue = (activeAccount) => {
        
        req_items = [];
        req_items.push(
            this.getReqItem("inaudio", nvram["inaudio"], ""),
            this.getReqItem("RFC2833", nvram["RFC2833"], ""),
            this.getReqItem("sipinfo", nvram["sipinfo"], ""),
            this.getReqItem("dtmfpayload", nvram["dtmfpayload"], ""),
            this.getReqItem("P57", nvram["P57"], ""),
            this.getReqItem("P58", nvram["P58"], ""),
            this.getReqItem("P59", nvram["P59"], ""),
            this.getReqItem("P60", nvram["P60"], ""),
            this.getReqItem("P61", nvram["P61"], ""),
            this.getReqItem("P62", nvram["P62"], ""),
            this.getReqItem("P46", nvram["P46"], ""),
            this.getReqItem("P98", nvram["P98"], ""),
            this.getReqItem("codecpri", nvram["codecpri"], ""),
            this.getReqItem("silencesup", nvram["silencesup"], ""),
            this.getReqItem("vocfp", nvram["vocfp"], ""),
            this.getReqItem("g722rate", nvram["g722rate"], ""),
            this.getReqItem("g722payload", nvram["g722payload"], ""),
            this.getReqItem("g7221crate", nvram["g7221crate"], ""),
            this.getReqItem("g7221cpayload", nvram["g7221cpayload"], ""),
            this.getReqItem("opuspayload", nvram["opuspayload"], ""),
            this.getReqItem("ilibcfs", nvram["ilibcfs"], ""),
            this.getReqItem("usefvcode", nvram["usefvcode"], ""),
            this.getReqItem("audioredfec", nvram["audioredfec"], ""),
            this.getReqItem("audiofecpayload", nvram["audiofecpayload"], ""),
            this.getReqItem("audioredpayload", nvram["audioredpayload"], ""),
            this.getReqItem("enablerfc", nvram["enablerfc"], ""),
            this.getReqItem("enablefec", nvram["enablefec"], ""),
            this.getReqItem("fecmode", nvram["fecmode"], ""),
            this.getReqItem("fecpayload", nvram["fecpayload"], ""),
            this.getReqItem("enablefecc", nvram["enablefecc"], ""),
            this.getReqItem("feccpayload", nvram["feccpayload"], ""),
            this.getReqItem("h264payload", nvram["h264payload"], ""),
            this.getReqItem("packetmodel", nvram["packetmodel"], ""),
            this.getReqItem("imgsize", nvram["imgsize"], ""),
            this.getReqItem("protype", nvram["protype"], ""),
            this.getReqItem("vbrate", nvram["vbrate"], ""),
            this.getReqItem("sdpattr", nvram["sdpattr"], ""),
            this.getReqItem("vidframerate", nvram["vidframerate"], ""),
            this.getReqItem("jittermax", nvram["jittermax"], ""),
            this.getReqItem("decoderefresh", nvram["decoderefresh"], ""),
            this.getReqItem("disablepresent", nvram["disablepresent"], ""),
            this.getReqItem("presentimagesize", nvram["presentimagesize"], ""),
            this.getReqItem("presentprofile", nvram["presentprofile"], ""),
            this.getReqItem("presentvideobitrate", nvram["presentvideobitrate"], ""),
            this.getReqItem("presentvideoframebate", nvram["presentvideoframebate"], ""),
            this.getReqItem("bfcptranspro", nvram["bfcptranspro"], ""),
            this.getReqItem("srtp", nvram["srtp"], ""),
            this.getReqItem("encryptdigit", nvram["encryptdigit"], ""),

            this.getReqItem("useh264profile", nvram["useh264profile"], ""),
            this.getReqItem("initialinvite", nvram["initialinvite"], ""),
            this.getReqItem("P295", nvram["P295"], ""),
            this.getReqItem("P296", nvram["P296"], ""),
            this.getReqItem("enablertx", nvram["enablertx"], ""),
            this.getReqItem("h265payload", nvram["h265payload"], ""),

            // 待确认丢弃字段
            //this.getReqItem("P296", nvram["P296"], ""),
            //this.getReqItem("P8", nvram["P8"], ""),

        );
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            this.setCodecTransfer(values);
            this.setVbrateOptions(values['imgsize']);
            this.setState({
                beforeImgsize: values['imgsize'],
                beforePacketModel: values['packetmodel'],
                disablePresentStatus: values['disablepresent'] == 1
            })
        });
    }

    setCodecTransfer = (values) => {
        this.getVocoderData(values);
        this.getVideoData(values);
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed or selected account changed
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue(), (values) => {
                    this.setCodecTransfer(values);
                    this.setVbrateOptions(values['imgsize']);
                });
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    checkServerPath = (data, value, callback) => {
        //address port is needed
        var expression = /^((https?:\/\/)?|(ftp:\/\/)?|(tftp:\/\/)?)(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])))(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        if (!value || expression.test(value)) {
            callback();
        } else {
            callback(this.tr("tip_url"));
        }
    }

    getVocoderData = (itemValues) => {
        const VocoderTargetKeys = [];
        const VocoderData = [];
        let itemVal = itemValues;
        let ops = ["PCMU", "PCMA", "G722", "G.722.1", "G729A/B", "iLBC", "Opus","G.722.1C"];
        let values = ['0', '8', '9', '104','18', '98', '123', '103'];
        const keys = ['P57', 'P58', 'P59', 'P60', 'P61', 'P62', 'P46', 'P98'];
        let set = new Set([itemVal['P57'], itemVal['P58'], itemVal['P59'], itemVal['P60'], itemVal['P61'], itemVal['P62'], itemVal['P46'], itemVal['P98']])
        for (let i = 0, j = [...set].length; i < ops.length; i++) {
            let chosenIdx = values.indexOf([...set][i])
            const data = {
                key: i.toString(),
                description: ops[i],
                chosen: j--
            };
            j = j <= 0 ? j = 0 : j;
            if (data.chosen && [...set][i] != "") {
                VocoderTargetKeys.push(`${chosenIdx}`);
            }
            VocoderData.push(data);
        }
        this.setState({ VocoderData, VocoderTargetKeys });
    }

    getVideoData = (itemValues) => {
        const VideoTargetKeys = [];
        let values = itemValues;
        const VideoData = [
            {
                key: '99',
                title: 'H264'
            },
            {
                key: '114',
                title: 'H265'
            }
        ];
        const keys = ['P295', "P296"];
        keys.forEach((item, i) => {
            if(values[item] != '') {
                VideoTargetKeys.push(values[item])
            }
        })
        this.setState({ VideoData, VideoTargetKeys });
    }

    handleVocoderChange = (VocoderTargetKeys, direction, moveKeys) => {
        if (VocoderTargetKeys.length == 0) {
            this.props.promptMsg("ERROR", "a_16440")
            return false;
        }
        this.setState({ VocoderTargetKeys });
    }

    handleVideoChange = (VideoTargetKeys, direction, moveKeys) => {
        if (VideoTargetKeys.length == 0) {
            this.props.promptMsg("ERROR", "a_16440")
            return false;
        }
        this.setState({ VideoTargetKeys });
    }

    savePreferredVocoder = () => {
        let pv = this.state.VocoderTargetKeys;
        let keys = ['P57', 'P58', 'P59', 'P60', 'P61', 'P62', "P46", 'P98'];
        let values = ['0', '8', '9', '104', '18',  '98', '123', '103'];

        for (var i = 0, pvObj = {}; i < pv.length; i++) {
            let pvkey = Number(pv[i]);
            pvObj[keys[i]] = values[pvkey];
        }
        for (var i = pv.length; i < keys.length; i++) {
            pvObj[keys[i]] = '';
        }
        return pvObj;
    }

    saveVideo = () => {
        let video = this.state.VideoTargetKeys;
        let keys = ['P295','P296'];
        let videoObj = {};
        keys.forEach((item, i) => {
            videoObj[item] = video[i] ? video[i] : ''
        })
        console.log(videoObj)
        return videoObj;
    }

    renderItem = (item) => {
        const customLabel = (
            <span className="custom-item">
                {item.description}
            </span>
        );

        return {
            label: customLabel,  // for displayed item
            value: item.title,   // for title and filter matching
        };
    }

    handleImgSizeChange = (v) => {
        this.setVbrateOptions(v);
        let vbrate = v == this.props.itemValues['imgsize'] ? this.props.itemValues['vbrate'] : this.imgsizeToVbrate[v][0]
        this.props.form.setFieldsValue({
            vbrate
        })
    }

    setVbrateOptions = (v) => {
        if(v == '' || !v) {
            v = '10'
        }
        let vbrateAvailable = this.imgsizeToVbrate[v];
        this.setState({
            vbrateAvailable
        })
    }
    handleSubmit = () => {
        const product = this.props.product;
        const { setFieldsValue } = this.props.form;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (values["opuspayload"] == "") {
                    values["opuspayload"] = "123";
                    setFieldsValue({
                        ['opuspayload']: "123"
                    })
                }
                if (values["fecpayload"] == "") {
                    values["fecpayload"] == "120";
                    setFieldsValue({
                        ['fecpayload']: "120"
                    })
                }
                
                let set = new Set([values['dtmfpayload'], values["h264payload"], values["opuspayload"],  values["fecpayload"], values["audiofecpayload"], values["audioredpayload"]])
                
                if (set.has('97')) {
                    this.props.promptMsg('ERROR', "payload_error2")
                    return false;
                }

                // save selectMultiple
                let pvObj = this.savePreferredVocoder()
                let videoObj = this.saveVideo()
                Object.assign(values, pvObj, videoObj);
                this.props.setItemValues(req_items, values, 1);
            }
        });
    }

    toggleDisablePresent() {
        let disablePresentStatus = this.state.disablePresentStatus
        this.setState({
            disablePresentStatus:!disablePresentStatus
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const [callTr, product] = [this.props.callTr, this.props.product];
        if (this.isEmptyObject(this.props.itemValues)) {
            return null;
        }
        let itemList =
            <Form>
                <p className="blocktitle"><s></s>{callTr("a_10017")}</p>
                {/* DTMF */}
                <FormItem label={(<span>{"DTMF"}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("DTMF")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('inaudio', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["inaudio"])
                    })(<Checkbox className={"P-" + nvram["inaudio"]}>In audio</Checkbox>)
                    }
                    {getFieldDecorator('RFC2833', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["RFC2833"])
                    })(<Checkbox className={"P-" + nvram["RFC2833"]}>RFC2833</Checkbox>)
                    }
                    {getFieldDecorator('sipinfo', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["sipinfo"])
                    })(<Checkbox className={"P-" + nvram["sipinfo"]}>SIP INFO</Checkbox>)
                    }
                </FormItem>
                {/* DTMF有效荷载类型 */}
                <FormItem label={(<span>{callTr("a_16113")}&nbsp;<Tooltip title={this.tips_tr("DTMF Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('dtmfpayload', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 126)
                            }
                        }],
                        initialValue: this.props.itemValues['dtmfpayload']
                    })(<Input className={"P-" + nvram["dtmfpayload"]} />)
                    }
                </FormItem>
                {/* 语音编码 */}
                <FormItem className="transfer-control"　 label={(<span>{callTr("a_16114")}&nbsp;<Tooltip title={this.tips_tr("Preferred Vocoder")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    <Transfer className="vocodertrans" dataSource={this.state.VocoderData} sorter={true} titles={[callTr("a_4877"), callTr("a_407")]} listStyle={{ width: 190, height: 206, }} targetKeys={this.state.VocoderTargetKeys} onChange={this.handleVocoderChange} render={this.renderItem} />
                </FormItem>
                {/* 编码协商优先级 */}
                <FormItem className="select-item" 　label={(<span>{callTr("a_19181")}&nbsp;<Tooltip title={this.tips_tr("Codec Negotiation Priority")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('codecpri', {
                        initialValue: this.props.itemValues['codecpri'] ? this.props.itemValues['codecpri'] : "0"
                    })(
                        <Select className={"P-" + nvram["codecpri"]}>
                            <Option value="0">{callTr("a_19182")}</Option>
                            <Option value="1">{callTr("a_19183")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 静音抑制 */}
                <FormItem label={(<span>{callTr("a_16132")}&nbsp;<Tooltip title={this.tips_tr("Silence Suppression")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('silencesup', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["silencesup"])
                    })(<Checkbox className={"P-" + nvram["silencesup"]} />)
                    }
                </FormItem>
                {/* 语音帧/TX */}
                <FormItem label={(<span>{callTr("a_16133")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Voice Frames Per TX")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('vocfp', {
                        rules: [
                            {
                                validator: (data, value, callback) => {
                                    this.digits(data, value, callback)
                                }
                            },
                            {
                                validator: (data, value, callback) => {
                                    this.range(data, value, callback, 1, 64)
                                }
                            }
                        ],
                        initialValue: this.props.itemValues['vocfp']
                    })(<Input className={"P-" + nvram["vocfp"]} />)
                    }
                </FormItem>
                {/* 新增  G.722.1速率 */}
                <FormItem label={(<span>{callTr("a_16134")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("G.722.1 Rate")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('g722rate', {
                        initialValue: this.props.itemValues['g722rate'] ? this.props.itemValues['g722rate'] : "0"
                    })(
                        <Select className={"P-" + nvram["g722rate"]}>
                            <Option value="0">24kbps {callTr('a_16135')}</Option>
                            <Option value="1">32kbps {callTr('a_16135')}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 新增 G.722.1有效荷载类型 */}
                <FormItem label={(<span>{callTr("a_18563")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("G.722.1 Payload Type")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('g722payload', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 126)
                            }
                        }],
                        initialValue: this.props.itemValues['g722payload']
                    })(
                        <Input type="text" className={"P-" + nvram["g722payload"]} />
                    )}
                </FormItem>
                {/* 新增 G.722.1C 速率 */}
                <FormItem label={(<span>{callTr("G.722.1C 速率")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("G.722.1C Rate")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('g7221crate', {
                        initialValue: this.props.itemValues['g7221crate'] ? this.props.itemValues['g7221crate'] : "0"
                    })(
                        <Select className={"P-" + nvram["g7221crate"]}>
                            <Option value="0">24kbps {callTr('a_16135')}</Option>
                            <Option value="1">32kbps {callTr('a_16135')}</Option>
                            <Option value="2">48kbps {callTr('a_16135')}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 新增  G.722.1C有效荷载类型 */}
                <FormItem label={(<span>{callTr("a_19109")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("G.722.1C Payload Type")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('g7221cpayload', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 126)
                            }
                        }],
                        initialValue: this.props.itemValues['g7221cpayload']
                    })(
                        <Input type="text" className={"P-" + nvram["g7221cpayload"]} />
                    )}
                </FormItem>
                {/* Opus有效荷载类型 */}
                <FormItem label={(<span>{callTr("a_19125")}&nbsp;<Tooltip title={this.tips_tr("Opus Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('opuspayload', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 126)
                            }
                        }],
                        initialValue: this.props.itemValues['opuspayload']
                    })(
                        <Input type="text" className={"P-" + nvram["opuspayload"]} />
                    )}
                </FormItem>
                {/* iLBC帧大小 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16116")}&nbsp;<Tooltip title={this.tips_tr("iLBC Frame Size")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('ilibcfs', {
                        initialValue: this.props.itemValues['ilibcfs'] ? this.props.itemValues['ilibcfs'] : "0"
                    })(
                        <Select className={"P-" + nvram["ilibcfs"]}>
                            <Option value="0">20ms</Option>
                            <Option value="1">30ms</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 使用200OK SDP中首位匹配编码 */}
                <FormItem label={(<span>{callTr("a_19170")}&nbsp;<Tooltip title={this.tips_tr("Use First Matching Vocoder in 200OK SDP")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('usefvcode', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["usefvcode"])
                    })(<Checkbox className={"P-" + nvram["usefvcode"]} />)
                    }
                </FormItem>
                {/* 开启音频前向纠错 */}
                <FormItem label={(<span>{callTr("a_19387")}&nbsp;<Tooltip title={this.tips_tr("Enable Audio RED with FEC")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('audioredfec', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["audioredfec"])
                    })(<Checkbox className={"P-" + nvram["audioredfec"]} />)
                    }
                </FormItem>
                {/* 音频FEC有效荷载类型  */}
                <FormItem label={(<span>{callTr("a_19388")}&nbsp;<Tooltip title={this.tips_tr("Audio FEC Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('audiofecpayload', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 126)
                            }
                        }],
                        initialValue: this.props.itemValues['audiofecpayload'] ? this.props.itemValues['audiofecpayload'] : 121
                    })(
                        <Input type="text" className={"P-" + nvram["audiofecpayload"]} />
                    )}
                </FormItem>
                {/* 音频RED有效荷载类型  */}
                <FormItem label={(<span>{callTr("a_19389")}&nbsp;<Tooltip title={this.tips_tr("Audio RED Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('audioredpayload', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 126)
                            }
                        }],
                        initialValue: this.props.itemValues['audioredpayload'] ? this.props.itemValues['audioredpayload'] : 124
                    })(
                        <Input type="text" className={"P-" + nvram["audioredpayload"]} />
                    )}
                </FormItem>

                <p className="blocktitle"><s></s>{callTr("a_10016")}</p>
                
                {/* 支持RFC5168 */}
                <FormItem label={(<span>{callTr("a_16105")}&nbsp;<Tooltip title={this.tips_tr("Enable RFC5168 Support")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('enablerfc', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["enablerfc"])
                    })(<Checkbox className={"P-" + nvram["enablerfc"]} />)
                    }
                </FormItem>
                {/* 丢包重传 */}
                <FormItem label={(<span>{callTr("a_19256")}&nbsp;<Tooltip title={this.tips_tr("Enable RTX")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('enablertx', {
                        initialValue: this.props.itemValues['enablertx'] ? this.props.itemValues['enablertx'] : "0"
                    })(
                        <Select className={"P-" + nvram["enablertx"]}>
                            <Option value="0">NACK</Option>
                            <Option value="1">NACK+RTX(SSRC-GROUP)</Option>
                            <Option value="2">{callTr('a_32')}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 开启视频前向纠错 */}
                <FormItem label={(<span>{callTr("a_16658")}&nbsp;<Tooltip title={this.tips_tr("Enable Video FEC")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('enablefec', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["enablefec"])
                    })(<Checkbox className={"P-" + nvram["enablefec"]} />)
                    }
                </FormItem>
                {/* 视频前向纠错模式 */}
                <FormItem label={(<span>{callTr("a_19111")}&nbsp;<Tooltip title={this.tips_tr("Video FEC Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('fecmode', {
                        initialValue: this.props.itemValues['fecmode']
                    })(
                        <RadioGroup className={"P-" + nvram["fecmode"]}>
                            <Radio value="0">0</Radio>
                            <Radio value="1">1</Radio>
                        </RadioGroup>
                    )
                    }
                </FormItem>
                {/* FEC有效荷载类型 */}
                <FormItem label={(<span>{callTr("a_16657")}&nbsp;<Tooltip title={this.tips_tr("FEC Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('fecpayload', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 126)
                            }
                        }],
                        initialValue: this.props.itemValues['fecpayload']
                    })(
                        <Input type="text" className={"P-" + nvram["fecpayload"]} />
                    )}
                </FormItem>
                {/* 新增 开启FECC */}
                <FormItem label={(<span>{callTr("a_19020")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Enable FECC")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('enablefecc', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["enablefecc"])
                    })(<Checkbox className={"P-" + nvram["enablefecc"]} />)
                    }
                </FormItem>
                {/* 新增 FECC H.224有效荷载类型 */}
                <FormItem label={(<span>{callTr("a_19022")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Voice Frames Per TX")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('feccpayload', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 126)
                            }
                        }],
                        initialValue: this.props.itemValues['feccpayload']
                    })(
                        <Input type="text" className={"P-" + nvram["feccpayload"]} />
                    )}
                </FormItem>
                {/* SDP带宽属性 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16108")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("SDP Bandwidth Attribute")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('sdpattr', {
                        initialValue: this.props.itemValues['sdpattr'] ? this.props.itemValues['sdpattr'] : "0"
                    })(
                        <Select className={"P-" + nvram["sdpattr"]}>
                            <Option value="0">{callTr("a_16109")}</Option>
                            <Option value="1">{callTr("a_16110")}</Option>
                            <Option value="2">{callTr("a_16111")}</Option>
                            <Option value="3">{callTr("a_4771")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 视频抖动缓冲区最大值 */}
                <FormItem label={(<span>{callTr("a_16146")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Video Jitter Buffer Maximum")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('jittermax', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 1000)
                            }
                        }],
                        initialValue: this.props.itemValues['jittermax']
                    })(
                        <Input type="text" className={"P-" + nvram["jittermax"]} />
                    )}
                </FormItem>
                {/* 开启视频渐进刷新 */}
                <FormItem label={(<span>{callTr("a_19235")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Enable video Gradual decoder refresh")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('decoderefresh', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["decoderefresh"])
                    })(<Checkbox className={"P-" + nvram["decoderefresh"]} />)
                    }
                </FormItem>
                {/* 视频编码 */}
                <FormItem className="transfer-control" label={(<span>{callTr("a_16115")}&nbsp;<Tooltip title={this.tips_tr("Preferred Video Coder")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    <Transfer dataSource={this.state.VideoData} sorter={true} titles={[callTr("a_4877"), callTr("a_407")]} listStyle={{ width: 190, height: 206, }} targetKeys={this.state.VideoTargetKeys} onChange={this.handleVideoChange} render={item => item.title} />
                </FormItem>
                {/* H.264 视频大小 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16118")}&nbsp;<Tooltip title={this.tips_tr("H.264 Image Size")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('imgsize', {
                        initialValue: this.props.itemValues['imgsize'] ? this.props.itemValues['imgsize'] : "10"
                    })(
                        <Select className={"P-" + nvram["imgsize"]} onChange={(v) => {this.handleImgSizeChange(v)}}>
                            <Option value="11">4K</Option>
                            <Option value="10">1080P</Option>
                            <Option value="9">720P</Option>
                            <Option value="4">4CIF</Option>
                            <Option value="7">4SIF</Option>
                            <Option value="1">VGA</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 视频比特率 */}
                <FormItem className="select-item" label={(<span>{callTr("a_10020")}&nbsp;<Tooltip title={this.tips_tr("Video Bit Rate")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('vbrate', {
                        initialValue: this.props.itemValues['vbrate'] ? this.props.itemValues['vbrate'] : "2048"
                    })(
                        <Select className={"P-" + nvram["vbrate"]}>
                            {
                                this.state.vbrateAvailable.map((v) => {
                                    return (
                                        <Option value={v}>{v}Kbps</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                {/* 新增  视频帧率 */}
                <FormItem label={(<span>{callTr("a_16274")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Video Frame Rate")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('vidframerate', {
                        initialValue: this.props.itemValues['vidframerate'] ? this.props.itemValues['vidframerate'] : "5"
                    })(
                        <Select className={"P-" + nvram["vidframerate"]}>
                            <Option value="5">5{callTr("a_16277")}</Option>
                            <Option value="15">15{callTr("a_16277")}</Option>
                            <Option value="25">25{callTr("a_16277")}</Option>
                            <Option value="30">30{callTr("a_16277")}</Option>
                            <Option value="29">{callTr("a_16278")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* H.264有效荷载类型 */}
                <FormItem label={(<span>{callTr("a_16124")}&nbsp;<Tooltip title={this.tips_tr("H.264 Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('h264payload', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 126)
                            }
                        }],
                        initialValue: this.props.itemValues['h264payload']
                    })(
                        <Input type="text" className={"P-" + nvram["h264payload"]} />
                    )}
                </FormItem>
                {/* 打包模式 */}
                <FormItem label={(<span>{callTr("a_16584")}&nbsp;<Tooltip title={this.tips_tr("Packetization-mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('packetmodel', {
                        initialValue: this.props.itemValues['packetmodel']
                    })(
                        <Select className={"P-" + nvram["packetmodel"]}>
                            <Option value="0">0</Option>
                            <Option value="1">1</Option>
                            <Option value="2">{callTr('a_9047')}</Option>
                        </Select>
                    )
                    }
                </FormItem>
                
                {/* H.264 Profile 类型 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16119")}&nbsp;<Tooltip title={this.tips_tr("H.264 Profile Type")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('protype', {
                        initialValue: this.props.itemValues['protype'] ? this.props.itemValues['protype'] : "0"
                    })(
                        <Select className={"P-" + nvram["protype"]}>
                            <Option value="0">{callTr("a_16120")}</Option>
                            <Option value="1">{callTr("a_16121")}</Option>
                            <Option value="2">{callTr("a_16122")}</Option>
                            <Option value="3">{callTr("a_16123")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 使用H.264 Constrained Profiles */}
                <FormItem label={(<span>{callTr("a_19253")}&nbsp;<Tooltip title={this.tips_tr("Use H.264 Constrained Profiles")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('useh264profile', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["useh264profile"])
                    })(<Checkbox className={"P-" + nvram["useh264profile"]} />)
                    }
                </FormItem>
                {/* H.265有效荷载类型 */}
                <FormItem label={(<span>{callTr("a_19258")}&nbsp;<Tooltip title={this.tips_tr("H.265 Payload Type")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('h265payload', {
                        rules: [{
                            validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
                        }, {
                            validator: (data, value, callback) => {
                                this.range(data, value, callback, 96, 126)
                            }
                        }],
                        initialValue: this.props.itemValues['h265payload']
                    })(
                        <Input type="text" className={"P-" + nvram["h265payload"]} />
                    )}
                </FormItem>
                
                
                
                


                <p className="blocktitle"><s></s>{callTr("a_16640")}</p>
                {/* 禁止演示 */}
                <FormItem label={(<span>{callTr("a_19014")}&nbsp;<Tooltip title={this.tips_tr("Disable Presentation")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('disablepresent', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['disablepresent'])
                    })(<Checkbox className={"P-" + nvram["disablepresent"]}  onChange={() => {this.toggleDisablePresent()}}/>)
                    }
                </FormItem>
                {/* 初始INVITE携带媒体信息 */}
                <FormItem label={(<span>{callTr("a_19240")}&nbsp;<Tooltip title={this.tips_tr("INITIAL INVITE")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('initialinvite', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['initialinvite'])
                    })(<Checkbox className={"P-" + nvram["initialinvite"]}  disabled={this.state.disablePresentStatus}/>)
                    }
                </FormItem>
                {/* 演示H.264 视频大小 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16214")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Presentation H.264 Image Size")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('presentimagesize', {
                        initialValue: this.props.itemValues['presentimagesize'] ? this.props.itemValues['presentimagesize'] : "10"
                    })(
                        <Select className={"P-" + nvram["presentimagesize"]} disabled={this.state.disablePresentStatus}>
                            <Option value="10">1080P</Option>
                            <Option value="9">720P</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 演示H.264 Profile类型 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16215")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Presentation H.264 Profile")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('presentprofile', {
                        initialValue: this.props.itemValues['presentprofile'] ? this.props.itemValues['presentprofile'] : "0"
                    })(
                        <Select className={"P-" + nvram["presentprofile"]} disabled={this.state.disablePresentStatus}>
                            <Option value="0">{callTr("a_16120")}</Option>
                            <Option value="1">{callTr("a_16121")}</Option>
                            <Option value="2">{callTr("a_16122")}</Option>
                            <Option value="3">{callTr("a_16123")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 演示视频速率 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16203")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Presentation Video Bit Rate(Kbps)")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('presentvideobitrate', {
                        initialValue: this.props.itemValues['presentvideobitrate'] ? this.props.itemValues['presentvideobitrate'] : "2048"
                    })(
                        <Select className={"P-" + nvram["presentvideobitrate"]} disabled={this.state.disablePresentStatus}>
                            <Option value="512">512Kbps</Option>
                            <Option value="768">768Kbps</Option>
                            <Option value="1024">1024Kbps</Option>
                            <Option value="1280">1280Kbps</Option>
                            <Option value="1536">1536Kbps</Option>
                            <Option value="1792">1792Kbps</Option>
                            <Option value="2048">2048Kbps</Option>
                        </Select>
                    )}
                </FormItem>
                {/* 演示视频帧率 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16205")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Presentation Video Frame Rate")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('presentvideoframebate', {
                        initialValue: this.props.itemValues['presentvideoframebate'] ? this.props.itemValues['presentvideoframebate'] : "5"
                    })(
                        <Select className={"P-" + nvram["presentvideoframebate"]} disabled={this.state.disablePresentStatus}>
                            <Option value="5">{callTr("a_5f")}</Option>
                            <Option value="10">{callTr("a_10f")}</Option>
                            <Option value="15">{callTr("a_15f")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* BFCP传输协议 */}
                <FormItem className="select-item" label={(<span>{callTr("a_19134")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("BFCP Transport Protocol")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('bfcptranspro', {
                        initialValue: this.props.itemValues['bfcptranspro'] ? this.props.itemValues['bfcptranspro'] : "0"
                    })(
                        <Select className={"P-" + nvram["bfcptranspro"]} disabled={this.state.disablePresentStatus}>
                            <Option value="0">{callTr("a_1015")}</Option>
                            <Option value="1">UDP</Option>
                            <Option value="2">TCP</Option>
                        </Select>
                    )}
                </FormItem>
                <p className="blocktitle"><s></s>{callTr("account_rtp")}</p>
                {/* SRTP方式 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16128")}&nbsp;<Tooltip title={this.tips_tr("SRTP Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('srtp', {
                        initialValue: this.props.itemValues['srtp'] ? this.props.itemValues['srtp'] : "0"
                    })(
                        <Select className={"P-" + nvram["srtp"]}>
                            <Option value="0">{callTr("a_32")}</Option>
                            <Option value="1">{callTr("a_16129")}</Option>
                            <Option value="2">{callTr("a_16130")}</Option>
                        </Select>
                    )}
                </FormItem>
                {/* SRTP加密位数 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16131")}&nbsp;<Tooltip title={this.tips_tr("SRTP Key Length")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('encryptdigit', {
                        initialValue: this.props.itemValues['encryptdigit'] ? this.props.itemValues['encryptdigit'] : "0"
                    })(
                        <Select className={"P-" + nvram["encryptdigit"]}>
                            <Option value="0">AES 128&256 bit</Option>
                            <Option value="1">AES 128 bit</Option>
                            <Option value="2">AES 256 bit</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
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
    product: state.product
})

export default connect(mapStateToProps)(Enhance(CodecForm));
