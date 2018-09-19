import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Icon, Tooltip, Select, Button, Transfer, Checkbox, Input, Modal } from "antd";
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items = new Array;


class CodecForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vbrateAvailable: [],
            videoTargetKeys: [],
            beforeImgsize: "",
            beforePacketModel: "",
            disablePresentStatus: false
        }
        
        this.videoDataSource = [
            {
                key: '9',
                title: 'G.722',
            },
            {
                key: '104',
                title: 'G.722.1',
            },
            {
                key: '0',
                title: 'PCMU',
            },
            {
                key: '8',
                title: 'PCMA',
            }
        ]

        // 视频大小对应的视频比特率
        this.imgsizeToVbrate = {
            '10': ['1024','1280','1536','1792','2048','2560','3072','3584','4096'],
            '9' : ['512', '640', '768', '896', '1024', '1280', '1536', '1792', '2048'],
            '4' : ['384', '400', '416', '448', '512', '640', '768', '896', '1024'],
            '7' : ['384', '400', '416', '448', '512', '640', '768', '896', '1024'],
            '1' : ['384', '400', '416', '448', '512', '640', '768', '896', '1024'],
        }


    }

    handlePvalue = () => {
        req_items = [];
        req_items.push(
            /**
             * 音频
             */
            this.getReqItem("inaudio", "2501", ""),  //DTMF
            this.getReqItem("RFC2833", "2502", ""),
            this.getReqItem("dtmfpayload", "596", ""),  //DTMF有效荷载类型
            this.getReqItem("P551", "551", ""),　　　　//　语音编码
            this.getReqItem("P552", "552", ""),
            this.getReqItem("P553", "553", ""),
            this.getReqItem("P554", "554", ""),
            this.getReqItem("codecpri", "29261", ""),  // 编码协商优先级
            this.getReqItem("silencesup", "585", ""),  // 静音抑制
            this.getReqItem("vocfp", "586", ""),　　　　// 语音帧／TX
            this.getReqItem("g722rate", "2573", ""),   // G.722.1　速率
            this.getReqItem("g722payload", "2574", ""),  // G.722.1有效荷载类型
            this.getReqItem("usefvcode", "2548", ""),   // 使用200OK SDP中首位匹配编码 
            this.getReqItem("audioredfec", "26273", ""),  // 开启音频前向纠错
            this.getReqItem("audiofecpayload", "26274", ""),　　// 音频FEC有效载荷类型
            this.getReqItem("audioredpayload", "26275", ""),   // 音频RED有效载荷类型

            /**
             * 视频
             */
            this.getReqItem("enablerfc", "578", ""), // 支持ＲＦＣ５１６８
            this.getReqItem("enablertx", "26285", ""),　// 丢包重传
            this.getReqItem("enablefec", "2593", ""),　　// 开启视频前向纠错
            this.getReqItem("fecpayload", "2594", ""),　　// FEC有效荷载类型
            this.getReqItem("sdpattr", "2560", ""),　　　　// SDP带宽属性
            this.getReqItem("jittermax", "2581", ""),　　　//　视频抖动缓冲区最大值
            this.getReqItem("imgsize", "2507", ""),　　　//Ｈ.264视频大小
            this.getReqItem("vbrate", "2515", ""),　　　//　视频比特率
            this.getReqItem("vidframerate", "25006", ""),　　//　视频帧率
            this.getReqItem("h264payload", "562", ""),　　//　Ｈ.264有效荷载类型
            this.getReqItem("packetmodel", "26205", ""),　//　打包模式
            this.getReqItem("protype", "2562", ""),　　　　// Ｈ.264 Profile类型
            this.getReqItem("useh264profile", "26245", ""),　// 使用H.264 Constrained Profiles

            /**
             * 演示设置
             */
            this.getReqItem("disablepresent", "26201", ""),
            this.getReqItem("initialinvite", "sendPreMode_2", ""),
            this.getReqItem("presentimagesize","2576", ""),
            this.getReqItem("presentprofile", "2577", ""),
            this.getReqItem("presentvideobitrate","2578", ""),
            this.getReqItem("presentvideoframebate", "26242", ""),



        );
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            this.getVideoData(values);
            this.setVbrateOptions(values['imgsize']);
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue(), (values) => {
                    this.getVideoData(values);
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
    getVideoData(values){
        let keys = ["P551", "P552", "P553", "P554"];
        let videoTargetKeys = [];
        keys.forEach((i) => {
            if(values[i] != '') {
                videoTargetKeys.push(values[i])
            }
        })
        this.setState({
            videoTargetKeys
        })
    }
    handleChange = (nextTargetKeys) => {
        this.setState({videoTargetKeys: nextTargetKeys});
    }
    saveVideo = () => {
        const keys = ["P551", "P552", "P553", "P554"];
        const values = this.state.videoTargetKeys;
        let videoObj = {};
        keys.forEach((item, i) => {
            videoObj[item] = values[i] ? values[i] : ''
        })
        // console.log(videoObj)
        return videoObj;
    }
    handleImgSizeChange = (v) => {
        this.setVbrateOptions(v);
        let vbrate = v == this.props.itemValues['imgsize'] ? this.props.itemValues['vbrate'] : this.imgsizeToVbrate[v][4]
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
    toggleDisablePresent() {
        let disablePresentStatus = this.state.disablePresentStatus
        this.setState({
            disablePresentStatus:!disablePresentStatus
        })
    }
    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
               Object.assign(values, this.saveVideo())
               this.props.setItemValues(req_items, values,1);
          }
        });
     }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        if(this.isEmptyObject(this.props.itemValues)) {
            return null;
        }

        let itemList =
           <Form>
               <p className="blocktitle"><s></s>{callTr("a_10017")}</p>
               <FormItem label={(<span>{"DTMF"}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("DTMF")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('inaudio', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["inaudio"])
                    })(<Checkbox className="P-2501">In audio</Checkbox>)
                    }
                    {getFieldDecorator('RFC2833', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["RFC2833"])
                    })(<Checkbox className="P-2502">RFC2833</Checkbox>)
                    }
                </FormItem>
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
                    })(<Input className="P-596" />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16115")}&nbsp;<Tooltip title={this.tips_tr("Preferred Video Coder")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    <Transfer dataSource={this.videoDataSource} targetKeys={this.state.videoTargetKeys} render={item => item.title} onChange={this.handleChange} sorter={true} titles={[callTr("a_4877"), callTr("a_407")]} listStyle={{ width: 135, height: 206, }}/>
                </FormItem>
                <FormItem className="select-item" 　label={(<span>{callTr("a_19181")}&nbsp;<Tooltip title={this.tips_tr("Codec Negotiation Priority")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('codecpri', {
                        initialValue: this.props.itemValues['codecpri'] ? this.props.itemValues['codecpri'] : "0"
                    })(
                        <Select className="P-29261">
                            <Option value="0">{callTr("a_19182")}</Option>
                            <Option value="1">{callTr("a_19183")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16132")}&nbsp;<Tooltip title={this.tips_tr("Silence Suppression")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('silencesup', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["silencesup"])
                    })(<Checkbox className="P-585" />)
                    }
                </FormItem>
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
                    })(<Input className="P-586" />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_16134")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("G.722.1 Rate")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('g722rate', {
                        initialValue: this.props.itemValues['g722rate'] ? this.props.itemValues['g722rate'] : "0"
                    })(
                        <Select className="P-2573">
                            <Option value="0">24kbps {callTr('a_16135')}</Option>
                            <Option value="1">32kbps {callTr('a_16135')}</Option>
                        </Select>
                    )}
                </FormItem>
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
                        <Input type="text" className="P-2574" />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_19170")}&nbsp;<Tooltip title={this.tips_tr("Use First Matching Vocoder in 200OK SDP")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('usefvcode', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["usefvcode"])
                    })(<Checkbox className="P-2548" />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_19387")}&nbsp;<Tooltip title={this.tips_tr("Enable Audio RED with FEC")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('audioredfec', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["audioredfec"])
                    })(<Checkbox className="P-26273" />)
                    }
                </FormItem>
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
                        <Input type="text" className="P-26274" />
                    )}
                </FormItem>
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
                        <Input type="text" className="P-26275" />
                    )}
                </FormItem>
                <p className="blocktitle"><s></s>{callTr("a_10016")}</p>
                <FormItem label={(<span>{callTr("a_16105")}&nbsp;<Tooltip title={this.tips_tr("Enable RFC5168 Support")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('enablerfc', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["enablerfc"])
                    })(<Checkbox className="P-578" />)
                    }
                </FormItem>
                <FormItem label={(<span>{callTr("a_19256")}&nbsp;<Tooltip title={this.tips_tr("Enable RTX")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('enablertx', {
                        initialValue: this.props.itemValues['enablertx'] ? this.props.itemValues['enablertx'] : "0"
                    })(
                        <Select className="P-26285">
                            <Option value="0">NACK</Option>
                            <Option value="1">NACK+RTX(SSRC-GROUP)</Option>
                            <Option value="2">{callTr('a_32')}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16658")}&nbsp;<Tooltip title={this.tips_tr("Enable Video FEC")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('enablefec', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["enablefec"])
                    })(<Checkbox className="P-2593" />)
                    }
                </FormItem>
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
                        <Input type="text" className="P-2594" />
                    )}
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16108")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("SDP Bandwidth Attribute")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('sdpattr', {
                        initialValue: this.props.itemValues['sdpattr'] ? this.props.itemValues['sdpattr'] : "0"
                    })(
                        <Select className="P-2560">
                            <Option value="0">{callTr("a_16109")}</Option>
                            <Option value="1">{callTr("a_16110")}</Option>
                            <Option value="3">{callTr("a_4771")}</Option>
                        </Select>
                    )}
                </FormItem>
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
                        <Input type="text" className="P-2581" />
                    )}
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16118")}&nbsp;<Tooltip title={this.tips_tr("H.264 Image Size")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('imgsize', {
                        initialValue: this.props.itemValues['imgsize'] ? this.props.itemValues['imgsize'] : "10"
                    })(
                        <Select className="P-2507" onChange={(v) => {this.handleImgSizeChange(v)}}>
                            <Option value="10">1080p</Option>
                            <Option value="9">720p</Option>
                            <Option value="4">4CIF</Option>
                            <Option value="7">4SIF</Option>
                            <Option value="1">VGA</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_10020")}&nbsp;<Tooltip title={this.tips_tr("Video Bit Rate")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('vbrate', {
                        initialValue: this.props.itemValues['vbrate'] ? this.props.itemValues['vbrate'] : "2048"
                    })(
                        <Select className="P-2515">
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
                <FormItem label={(<span>{callTr("a_16274")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Video Frame Rate")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('vidframerate', {
                        initialValue: this.props.itemValues['vidframerate'] ? this.props.itemValues['vidframerate'] : "5"
                    })(
                        <Select className="P-25006">
                            <Option value="5">5{callTr("a_16277")}</Option>
                            <Option value="15">15{callTr("a_16277")}</Option>
                            <Option value="25">25{callTr("a_16277")}</Option>
                            <Option value="30">30{callTr("a_16277")}</Option>
                            <Option value="29">{callTr("a_16278")}</Option>
                        </Select>
                    )}
                </FormItem>
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
                        <Input type="text" className="P-562" />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16584")}&nbsp;<Tooltip title={this.tips_tr("Packetization-mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('packetmodel', {
                        initialValue: this.props.itemValues['packetmodel']
                    })(
                        <Select className="P-26205">
                            <Option value="0">0</Option>
                            <Option value="1">1</Option>
                            <Option value="2">{callTr('a_9047')}</Option>
                        </Select>
                    )
                    }
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16119")}&nbsp;<Tooltip title={this.tips_tr("H.264 Profile Type")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('protype', {
                        initialValue: this.props.itemValues['protype'] ? this.props.itemValues['protype'] : "0"
                    })(
                        <Select className="P-2562">
                            <Option value="0">{callTr("a_16120")}</Option>
                            <Option value="1">{callTr("a_16121")}</Option>
                            <Option value="2">{callTr("a_16122")}</Option>
                            <Option value="3">{callTr("a_16123")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_19253")}&nbsp;<Tooltip title={this.tips_tr("Use H.264 Constrained Profiles")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('useh264profile', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues["useh264profile"])
                    })(<Checkbox className="P-26245" />)
                    }
                </FormItem>
                
                <p className="blocktitle"><s></s>{callTr("a_16640")}</p>
                {/* 禁止演示 */}
                <FormItem label={(<span>{callTr("a_19014")}&nbsp;<Tooltip title={this.tips_tr("Disable Presentation")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('disablepresent', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['disablepresent'])
                    })(<Checkbox className="P-26201"  onChange={() => {this.toggleDisablePresent()}}/>)
                    }
                </FormItem>
                {/* 初始INVITE携带媒体信息 */}
                <FormItem label={(<span>{callTr("a_19240")}&nbsp;<Tooltip title={this.tips_tr("INITIAL INVITE")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('initialinvite', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['initialinvite'])
                    })(<Checkbox className="P-sendPreMode_2"  disabled={this.state.disablePresentStatus}/>)
                    }
                </FormItem>
                {/* 演示H.264 视频大小 */}
                <FormItem className="select-item" label={(<span>{callTr("a_16214")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Presentation H.264 Image Size")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('presentimagesize', {
                        initialValue: this.props.itemValues['presentimagesize'] ? this.props.itemValues['presentimagesize'] : "10"
                    })(
                        <Select className="P-2576" disabled={this.state.disablePresentStatus}>
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
                        <Select className="P-2577" disabled={this.state.disablePresentStatus}>
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
                        <Select className="P-2578" disabled={this.state.disablePresentStatus}>
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
                        <Select className="P-26242" disabled={this.state.disablePresentStatus}>
                            <Option value="5">{callTr("a_5f")}</Option>
                            <Option value="10">{callTr("a_10f")}</Option>
                            <Option value="15">{callTr("a_15f")}</Option>
                        </Select>
                    )}
                </FormItem>


                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
            </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;
    }
}

const mapStateToProps = (state) => ({
    enterSave: state.enterSave,
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(Enhance(CodecForm));
