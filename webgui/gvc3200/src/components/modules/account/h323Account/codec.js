import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Icon, Tooltip, Select, Button, Checkbox, Input, Modal } from "antd";
import Transfer from '../../pubModule/transfer';
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items = new Array;


class CodecForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vocoderTargetKeys: [],
            vbrateAvailable: []  // 可选的视频比特率
        }
        // 视频编码
        this.vocoderDataSource = [
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
            },
            {
                key: '103',
                title: 'G.722.1C',
            },
        ];
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
            this.getReqItem("h323dtmf", "25049", ""),  
            this.getReqItem("imgsize", "25061", ""),
            this.getReqItem("vbrate", "25063", ""),
            this.getReqItem("vidframerate", "25062", ""),
            this.getReqItem("h264payload", "25064", ""),
            this.getReqItem("packetmodel", "25072", ""),

            this.getReqItem("P25037", "25037", ""),
            this.getReqItem("P25038", "25038", ""),
            this.getReqItem("P25039", "25039", ""),
            this.getReqItem("P25040", "25040", ""),
            this.getReqItem("P25041", "25041", ""),



        );
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            this.getVocoderData(values);
            this.setVbrateOptions(values['imgsize'])
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue(), (values) => {
                    this.getVocoderData(values);
                    this.setVbrateOptions(values['imgsize'])
                });
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }
    getVocoderData(values){
        let keys = ["P25037", "P25038", "P25039", "P25040", "P25041"];
        let vocoderTargetKeys = [];
        keys.forEach((i) => {
            if(values[i] != '') {
                vocoderTargetKeys.push(values[i])
            }
        })
        this.setState({
            vocoderTargetKeys: [...new Set([...vocoderTargetKeys])]
        })
    }
    handleChange = (nextTargetKeys) => {
        this.setState({vocoderTargetKeys: nextTargetKeys});
    }
    saveVideo = () => {
        let keys = ["P25037", "P25038", "P25039", "P25040", "P25041"];
        let values = this.state.vocoderTargetKeys;
        let videoObj = {};
        keys.forEach((item, i) => {
            videoObj[item] = values[i] ? values[i] : ''
        })
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
               <FormItem className="select-item" 　label={(<span> DTMF <Tooltip title={this.tips_tr("H323DTMF")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('h323dtmf', {
                        initialValue: this.props.itemValues['h323dtmf'] ? this.props.itemValues['h323dtmf'] : "0"
                    })(
                        <Select className="P-25049">
                            <Option value="0">In audio</Option>
                            <Option value="1">RFC2833</Option>
                            <Option value="2">H245 signal</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className="transfer-control"  label={(<span>{callTr("a_16114")}&nbsp;<Tooltip title={  this.tips_tr("Preferred Vocoder")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    <Transfer dataSource={this.vocoderDataSource} targetKeys={this.state.vocoderTargetKeys} render={item => item.title} onChange={this.handleChange} sorter={true} titles={[callTr("a_4877"), callTr("a_407")]} listStyle={{ width: 190, height: 206, }}/>
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_16118")}&nbsp;<Tooltip title={this.tips_tr("H.264 Image Size")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('imgsize', {
                        initialValue: this.props.itemValues['imgsize'] ? this.props.itemValues['imgsize'] : "10"
                    })(
                        <Select className="P-25061" onChange={(v) => {this.handleImgSizeChange(v)}}>
                            <Option value="10">1080p</Option>
                            <Option value="9">720p</Option>
                            <Option value="4">4CIF</Option>
                            <Option value="7">4SIF</Option>
                            <Option value="1">VGA</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem className="select-item" label={(<span>{callTr("a_10020")}&nbsp;<Tooltip title={  this.tips_tr("Video Bit Rate2") }><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('vbrate', {
                        initialValue: this.props.itemValues['vbrate'] ? this.props.itemValues['vbrate'] : "2048"
                    })(
                        <Select className="P-25063">
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
                <FormItem label={(<span>{callTr("a_16274")}&nbsp;<Tooltip title={this.tips_tr("Video Frame Rate")} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('vidframerate', {
                        initialValue: this.props.itemValues['vidframerate'] ? this.props.itemValues['vidframerate'] : "5"
                    })(
                        <Select className="P-25062">
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
                                this.range(data, value, callback, 96, 127)
                            }
                        }],
                        initialValue: this.props.itemValues['h264payload']
                    })(
                        <Input type="text" className="P-25064" />
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_16584")}&nbsp;<Tooltip title={this.tips_tr("Packetization-mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('packetmodel', {
                        initialValue: this.props.itemValues['packetmodel']
                    })(
                        <Select className="P-25072">
                            <Option value="0">0</Option>
                            <Option value="1">1</Option>
                            <Option value="2">{callTr('a_9047')}</Option>
                        </Select>
                    )
                    }
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
