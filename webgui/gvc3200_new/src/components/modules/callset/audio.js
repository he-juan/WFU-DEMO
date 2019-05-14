import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import { Layout, Tabs, Form, Tooltip, Icon, Button, Select, Checkbox, Input, Slider } from "antd";
import * as Actions from '../../redux/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const Content = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

const req_items = [
    { "name": "echodelay", "pvalue": "22280", "value": "" },    //回声延迟单独处理
    { "name": "ringbt", "pvalue": "4001", "value": "" },
    { "name": "busytone", "pvalue": "4002", "value": "" },
    { "name": "reordertone", "pvalue": "4003", "value": "" },
    { "name": "confmtone", "pvalue": "4004", "value": "" },
    { "name": "defringcad2", "pvalue": "4040", "value": "" },
    { "name": "audiodevice", "pvalue": "22050", "value": "" },
    { "name": "aeclevel", "pvalue": "echolevel", "value": "" },
];



class Audio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            audioInfo: {
                curMedia: '',
                curNotify: '',
                curRing: '',
                curSpeaker: '',
                mediaMax: '',
                notifyMax: '',
                notifyRingtone: '',
                ringMax: '',
                speakerMax: '',
                sysRingtone: ''
            },
            tonedblist: [],
            notificationdblist: [],
            showAEC: false
        }

        this.echodelayMap = {
            '-2': 40,
            '-1': 50,
            '0': 60,
            '1': 70,
            '2': 80,
            '3': 90,
            '4': 100,
            '5': 110,
            '6': 120,
            '7': 130,
            '8': 140,
            '9': 150

        }
    }
    componentDidMount = () => {
        this.props.getItemValues(req_items, (data) => {
            this.audiodeviceChange(data['audiodevice'])
        });
        this.props.getAudioinfo((data) => {
            this.setState({
                audioInfo: data
            })
        })
        this.props.getTonedblist((data) => {
            this.setState({
                tonedblist: data.Ringtone
            })
        })
        this.props.getNotificationdblist((data) => {
            this.setState({
                notificationdblist: data.Ringtone
            })
        })
    }

    mapEchodelayValue = (v) => {
        let echodelayMap = this.echodelayMap
        return Object.keys(echodelayMap).filter((i) => {
            return echodelayMap[i] == v
        })[0]
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.enterSave != nextProps.enterSave) {
            this.handleSubmit();
        }
    }

    findToneId = (list, title) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i].title == title) {
                return list[i].id;
            }
        }
    }

    audiodeviceChange = (v) => {
        if( v == 5) {
            this.setState({
                showAEC: true
            })
        } else {
            this.setState({
                showAEC: false
            })
        }
    }
    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // echodelay 单独处理
                let echodelayValue = {};
                let echodelayItems = [{ "name": "echodelay", "pvalue": "22280", "value": "" }];
                echodelayValue['echodelay'] = this.echodelayMap[values['echodelay']];
                this.props.setItemValues(echodelayItems, echodelayValue);

                // 移除 echodelay
                delete values['echodelay'];
                req_items.shift();
                if(values["audiodevice"] != '5') { values['aeclevel'] = '0'}
                this.props.setItemValues(req_items, values, 1);

                // 针对ringTone, notifyTone 特殊处理
                let _ringTone = values.ringTone,
                    _notifyTone = values.notifyTone;

                if (_ringTone.indexOf('content://') < 0 && _ringTone.length) {
                    console.log(_ringTone)
                    _ringTone = `content://media/internal/audio/media/${this.findToneId(this.state.tonedblist, _ringTone)}`
                }
                if (_notifyTone.indexOf('content://') < 0 && _ringTone.length) {
                    console.log(_notifyTone)
                    _notifyTone = `content://media/internal/audio/media/${this.findToneId(this.state.notificationdblist, _notifyTone)}`
                }

                // setVolume
                this.props.setAudioVolume({
                    ringVal: values.ringVal,
                    mediaVal: values.mediaVal,
                    notifyVal: values.notifyVal,
                    ringTone: _ringTone,
                    notifyTone: _notifyTone
                })
            }
        });
    }

    render() {
        if (!this.props.itemValues || this.state.audioInfo.curMedia == '' || !this.state.tonedblist.length || !this.state.notificationdblist.length) {
            // 解决闪烁问题
            return (  
                <Content className="content-container config-container">
                    <div className="subpagetitle">{this.tr("a_16589")}</div>
                    <Form className="configform" hideRequiredMark style={{ minHeight: this.props.mainHeight }}>
                    </Form>
                </Content>
            )
            
        }
        const { getFieldDecorator } = this.props.form;
        const callTr = this.tr;
        const callTipsTr = this.tips_tr;
        const itemvalue = this.props.itemValues;
        const audioInfo = this.state.audioInfo
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_16589")}</div>
                <Form className="configform" hideRequiredMark style={{ minHeight: this.props.mainHeight }}>
                    {/* 回声延迟 */}
                    <FormItem label={<span>{callTr("a_19246")}<Tooltip title={callTipsTr("Echo Delay")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("echodelay", {
                            initialValue: parseInt(this.mapEchodelayValue(itemvalue['echodelay'] || 60))
                        })(
                            <Slider min={-2} max={9} marks={{ "-2": "-2", "9": "9" }} />
                        )}
                    </FormItem>
                    {/* 铃声音量 */}
                    <FormItem label={<span>{callTr("a_16254")}<Tooltip title={callTipsTr("Ringtone Volume")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("ringVal", {
                            initialValue: parseInt(audioInfo['curRing'])
                        })(
                            <Slider min={0} max={7} marks={{ 0: "0", 7: "7" }} />
                        )}
                    </FormItem>
                    {/* 媒体音量  */}
                    <FormItem label={<span>{callTr("a_16636")}<Tooltip title={callTipsTr("Media Volume")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("mediaVal", {
                            initialValue: parseInt(audioInfo['curMedia'])
                        })(
                            <Slider min={0} max={15} marks={{ 0: "0", 15: "15" }} />
                        )}
                    </FormItem>
                    {/* 闹钟音量  */}
                    {/* <FormItem label={<span>{callTr("a_19017")}<Tooltip title={callTipsTr("Alarm Volume")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("notifyVal", {
                            initialValue: parseInt(audioInfo['curNotify'])
                        })(
                            <Slider min={0} max={7} marks={{ 0: "0", 7: "7" }} />
                        )}
                    </FormItem> */}
                    {/* speakerVal  */}
                    {/* <FormItem label={<span>{callTr("a_16255")}<Tooltip title={callTipsTr("Echo Delay")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("speakerVal", {
                            initialValue: parseInt(itemvalue['speakerVal'])
                        })(
                            <div></div>
                        )}
                    </FormItem> */}
                    {/* 设备铃声  */}
                    <FormItem label={<span>{callTr("a_12082")}<Tooltip title={callTipsTr("System Ringtone")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("ringTone", {
                            initialValue: audioInfo['sysRingtone']
                        })(
                            <Select>
                                <Option value="">静音</Option>
                                {
                                    this.state.tonedblist.map((item) => {
                                        return (
                                            <Option value={`content://media/internal/audio/media/${item.id}`} key={item.id}>
                                                {item.title}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    {/* 通知铃声  */}
                    <FormItem label={<span>{callTr("a_12083")}<Tooltip title={callTipsTr("Notification Tone")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("notifyTone", {
                            initialValue: audioInfo['notifyRingtone']
                        })(
                            <Select>
                                <Option value="">静音</Option>
                                {
                                    this.state.notificationdblist.map((item) => {
                                        return (
                                            <Option value={`content://media/internal/audio/media/${item.id}`} key={item.id} >
                                                {item.title}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    {/* 音频设备 */}
                    <FormItem label={<span>{callTr("a_19127")}<Tooltip title={callTipsTr("Audio Device")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("audiodevice", {
                            initialValue: itemvalue['audiodevice']
                        })(
                            <Select onSelect={(v) => {this.audiodeviceChange(v)}}>
                                <Option value="0">{callTr("a_1015")}</Option>
                                <Option value="1">{callTr("a_304")}</Option>
                                <Option value="2">USB</Option>
                                <Option value="3">HDMI</Option>
                                <Option value="4">{callTr("a_12181")}</Option>
                                <Option value="5">{callTr("a_12199")}</Option>
                            </Select>
                        )}
                    </FormItem>
                    {/* 回音抑制等级 */}
                    <FormItem style={{display: this.state.showAEC ? 'block': 'none'}} label={<span>{callTr("a_19813")}<Tooltip title={callTipsTr("AEC Level")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("aeclevel", {
                            initialValue: itemvalue['aeclevel'] || "0"
                        })(
                            <Select>
                                <Option value="0">{callTr("a_32")}</Option>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                                <Option value="5">5</Option>
                            </Select>
                        )}
                    </FormItem>
                    {/* 回铃音 */}
                    <FormItem label={<span>{callTr("a_16306")}<Tooltip title={callTipsTr("Ring Back Tone")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("ringbt", {
                            rules: [{
                                max: 108, message: callTr("a_19805") + "108!"
                            }],
                            initialValue: itemvalue['ringbt']
                        })(
                            <Input disabled={this.state.disabled} className="P-4001" />
                        )}
                    </FormItem>
                    {/* 忙音 */}
                    <FormItem label={<span>{callTr("a_16307")}<Tooltip title={callTipsTr("Busy Tone")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("busytone", {
                            rules: [{
                                max: 108, message: callTr("a_19805") + "108!"
                            }],
                            initialValue: itemvalue['busytone']
                        })(
                            <Input disabled={this.state.disabled} className="P-4002" />
                        )}
                    </FormItem>
                    {/* 续订音 */}
                    <FormItem label={<span>{callTr("a_16308")}<Tooltip title={callTipsTr("Reorder Tone")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("reordertone", {
                            rules: [{
                                max: 108, message: callTr("a_19805") + "108!"
                            }],
                            initialValue: itemvalue['reordertone']
                        })(
                            <Input disabled={this.state.disabled} className="P-4003" />
                        )}
                    </FormItem>
                    {/* 确认铃音 */}
                    <FormItem label={<span>{callTr("a_16309")}<Tooltip title={callTipsTr("Confirmation Tone")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("confmtone", {
                            rules: [{
                                max: 108, message: callTr("a_19805") + "108!"
                            }],
                            initialValue: itemvalue['confmtone']
                        })(
                            <Input disabled={this.state.disabled} className="P-4004" />
                        )}
                    </FormItem>
                    {/* <FormItem label={<span>{callTr("a_16310")}<Tooltip title={callTipsTr("Call-Waiting Tone")}><Icon type="question-circle-o"/></Tooltip></span>}>
                        {getFieldDecorator("callwaittone", {
                            rules: [{
                                max: 108, message: callTr("a_19805") + "108!"
                            }],
                            initialValue: itemvalue['callwaittone']
                        })(
                            <Input disabled={this.state.disabled} className="P-4005"/>
                        )}
                    </FormItem> */}
                    {/* 默认振铃音 */}
                    <FormItem label={<span>{callTr("a_16313")}<Tooltip title={callTipsTr("Default Ring Cadence")}><Icon type="question-circle-o" /></Tooltip></span>}>
                        {getFieldDecorator("defringcad2", {
                            rules: [{
                                max: 108, message: callTr("a_19805") + "108!"
                            }],
                            initialValue: itemvalue['defringcad2']
                        })(
                            <Input disabled={this.state.disabled} className="P-4040" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                    </FormItem>
                </Form>
            </Content>
        );
    }
}

const AudioForm = Form.create()(Enhance(Audio));



const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    itemValues: state.itemValues,
    mainHeight: state.mainHeight,
    enterSave: state.enterSave
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues: Actions.getItemValues,
        setItemValues: Actions.setItemValues,
        setAudioVolume: Actions.setAudioVolume,
        getAudioinfo: Actions.getAudioinfo,
        getTonedblist: Actions.getTonedblist,
        getNotificationdblist: Actions.getNotificationdblist
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioForm);
