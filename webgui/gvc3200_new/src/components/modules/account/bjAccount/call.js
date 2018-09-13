import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { connect } from 'react-redux'
import * as Store from '../../../entry'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Icon, Tooltip, Select, Button, Checkbox, Upload, message } from "antd";
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
let req_items = new Array;

class CallForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList:[]
        }
    }

    handlePvalue = () => {
        req_items = [];
        req_items.push(
            this.getReqItem("calllog", "542", ""),   //呼叫日志
            this.getReqItem("dialkey", "592", ""),    //＃键拨号
            this.getReqItem("enablemoh", "2557", "")
        );
        return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue());
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue());
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.setItemValues(req_items, values, 1);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;
        const itemValues = this.props.itemValues;
        if (this.isEmptyObject(this.props.itemValues)) {
            return null;
        }
        let self = this;
        const UploadMOHfileProps = {
            name: 'file',
            showUploadList: false,
            action: '../upload?type=audiofile&acct=3',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                let fileList = info.fileList.slice(-1)
                self.setState({fileList:fileList})
                if (info.file.status == 'uploading') {
                    Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_uploading'}});
                }
                if (info.file.status === 'done') {
                    Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_process'}});
                    window.localStorage.setItem("fileList",JSON.stringify(fileList))
                    let fileext = info.file.name.slice(name.lastIndexOf(".")+1)
                    self.props.cb_audio_upload(fileext,3,(label,type)=>{
                        Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_process'}});
                        Modal.info({
                            content: <span dangerouslySetInnerHTML={{__html: self.tr(label)}}></span>,
                            okText: <span dangerouslySetInnerHTML={{__html: self.tr('a_2')}}></span>,
                            onOk() {},
                        });
                    })
                } else if (info.file.status === 'error') {
                    message.error(callTr('a_uploadfail'));
                }
            },
            beforeUpload: self.beforeUploadhandle,
            onRemove() {
                message.destroy();
                window.localStorage.removeItem("fileList");
                return true;
            }
        };
        let itemList =
            <Form>
                <FormItem className="select-item" label={(<span>{callTr("a_calllog")}&nbsp;<Tooltip title={this.tips_tr("Call Log")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('calllog', {
                        initialValue: this.props.itemValues['calllog'] ? this.props.itemValues['calllog'] : "0"
                    })(
                        <Select className={"P-542"}>
                            <Option value="0">{callTr("a_logall")}</Option>
                            <Option value="2">{callTr("a_lognone")}</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem  label={(<span>{callTr("a_usepound")}&nbsp;<Tooltip title={this.tips_tr("Use # as Dial Key")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('dialkey', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['dialkey'])
                    })(<Checkbox className="592"/>)
                   }
                </FormItem>
                <FormItem  label={(<span>{callTr("a_uploadaudio")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Upload Local MOH Audio File")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    <Upload {...UploadMOHfileProps} fileList={this.state.fileList}>
                        <Button>
                            <Icon type="upload" /> {this.tr("a_browse")}
                        </Button>
                    </Upload>
               </FormItem>
               <FormItem  label={(<span>{callTr("a_enablemoh")}&nbsp;<Tooltip title={this.tips_tr("Enable Local MOH")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablemoh', {
                       valuePropName: 'checked',
                       initialValue: parseInt(itemValues['enablemoh'])
                       })(
                           <Checkbox className={"P-2557" }/>
                   )}
               </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
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
    activeKey: state.TabactiveKey
})

export default connect(mapStateToProps)(Enhance(CallForm));
