import React, { Component, PropTypes } from 'react'
import Enhance from '../../mixins/Enhance'
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Store from '../../entry'
import { Form, Icon, Tooltip, Checkbox, Radio, Select, Button, Upload, message, Modal, Input } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm
var req_items = new Array;


class RecordSet extends Component {
    constructor(props){
        super(props);
        this.state = {
            type:"password",
            ftpitemdis: "display-hidden"
        }
        req_items = new Array;
        req_items.push(
            this.getReqItem("recordmode", "record_mode", ""),
            this.getReqItem("enableftpupload", "enableftpupload", ""),
            this.getReqItem("ftpuploadinterval", "ftpuploadinterval", ""),
            this.getReqItem("ftpusername", "ftpusername", ""),
            this.getReqItem("ftppwd", "ftppwd", ""),
            this.getReqItem("ftpurl", "ftpurl", ""),
            this.getReqItem("ftpport", "ftpport", ""),
            this.getReqItem("ftppath", "ftppath", ""),
        )
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items, (values) => {
            this.checkftpitem(values.enableftpupload)
        });
    }

    handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
    }

    handleOk = () => {

    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const itemValues = this.props.itemValues
                var tmpproxy = $.trim(values.ftpurl);
                var tmpport = $.trim(values.ftpport);
                let callTr = this.tr;

                if(this.props.product == "GXV3380") {
                    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                    if (tmpproxy.indexOf(":") != -1 || tmpproxy.split(":").length == 2 || (!reg.test(tmpproxy) && tmpproxy != '')) {
                        Modal.info({
                            content: <span dangerouslySetInnerHTML={{__html: callTr("warn_ftpurl")}}></span>,
                            okText: <span dangerouslySetInnerHTML={{__html: callTr("a_ok")}}></span>,
                            onOk() {},
                        });
                        return false;
                    }
                    if( (tmpproxy == "" && tmpport != "") || (tmpproxy != "" && tmpport == "")) {
                        Modal.info({
                            content: <span dangerouslySetInnerHTML={{__html: callTr("warn_ftp")}}></span>,
                            okText: <span dangerouslySetInnerHTML={{__html: callTr("a_ok")}}></span>,
                            onOk() {},
                        });
                        return false;
                    }
                    let path_verify = /^(\/[^///:"<>;&!*'`(){}[\]?|]+)+\/{1}$|^\/{1}$/;
                    if(!path_verify.test(values.ftppath) && values.ftppath!='') {
                        Modal.info({
                            content: <span dangerouslySetInnerHTML={{__html: callTr("warn_ftppath")}}></span>,
                            okText: <span dangerouslySetInnerHTML={{__html: callTr("a_ok")}}></span>,
                            onOk() {},
                        });
                        return false;
                    }
                    if(values.enableftpupload) {
                        if(tmpproxy == "" || tmpport=="") {
                            Modal.info({
                                content: <span dangerouslySetInnerHTML={{__html: callTr("warn_ftp")}}></span>,
                                okText: <span dangerouslySetInnerHTML={{__html: callTr("a_ok")}}></span>,
                                onOk() {},
                            });
                            return false;
                        } else if(values.ftppath==''){
                            Modal.info({
                                content: <span dangerouslySetInnerHTML={{__html: callTr("warn_ftppath")}}></span>,
                                okText: <span dangerouslySetInnerHTML={{__html: callTr("a_ok")}}></span>,
                                onOk() {},
                            });
                            return false;
                        }
                    }
                }
                this.props.setItemValues(req_items, values);
                if( values.ftpuploadinterval!=itemValues.ftpuploadinterval
                    || values.ftpusername!=itemValues.ftpusername
                    || values.ftppwd!=itemValues.ftppwd
                    || values.ftpurl!=itemValues.ftpurl
                    || values.ftpport!=itemValues.ftpport
                    || values.ftppath!=itemValues.ftppath
                    || values.enableftpupload!=itemValues.enableftpupload) {
                    this.props.ftprecordupdate()
                }
                this.props.handleHideSetModal();
            }
        });
    }

    handleCancel = () => {
        this.props.handleHideSetModal();
    }

    checkftpitem = (values) => {
        let ftpitemdis;
        if(values == 1) {
            ftpitemdis = "display-block";
        } else {
            ftpitemdis = "display-hidden";
        }
        this.setState({
            ftpitemdis:ftpitemdis
        });
    }

    onChangeftpitem = (e) => {
        let ftpitemdis;
        if (e.target.checked === true) {
            ftpitemdis = "display-block";
        } else {
            ftpitemdis = "display-hidden";
        }
        this.setState({
            ftpitemdis:ftpitemdis
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const [callTr,itemValues] = [this.props.callTr,this.props.itemValues];
        let callTipsTr = this.tips_tr
        return (
            <Modal title={callTr('recordset')} className="importModal recordSetModal" onOk={this.handleOk} onCancel={this.handleCancel} visible={this.props.displaySetModal}>
                <Form hideRequiredMark>
                    <FormItem  className = "select-item" label={(<span>{callTr("recordstroageshort")}</span>)}>
                        {getFieldDecorator('recordmode', {
                            initialValue: itemValues.recordmode ? itemValues.recordmode : "0"
                        })(
                            <Select>
                                <Option value="0">{callTr("recordreplace")}</Option>
                                <Option value="1">{callTr("recordstop")}</Option>
                            </Select>
                        )}
                    </FormItem>
                    {this.props.product == "GXV3380" ? <div>
                        <FormItem label={<span>{callTr("enableftpupload")}</span>}>
                            {getFieldDecorator("enableftpupload", {
                                valuePropName: 'checked',
                                initialValue: Boolean(Number(itemValues.enableftpupload))
                            })(
                                <Checkbox onChange={this.onChangeftpitem.bind(this)} />
                            )}
                        </FormItem>
                        <div className={this.state.ftpitemdis}>
                            <FormItem label={< span > {callTr("a_serveraddr")} </span >}>
                                {getFieldDecorator("ftpurl", {
                                    rules: [{
                                        max: 256, message: this.tr("a_lengthlimit") + "256"
                                    }],
                                    initialValue: itemValues.ftpurl ? itemValues.ftpurl : ""
                                })(<Input className=""/>)}
                            </FormItem>
                            <FormItem label={< span > {callTr("a_port")} </span >}>
                                {getFieldDecorator("ftpport", {
                                    rules: [{
                                        validator: (data, value, callback) => {
                                            this.digits(data, value, callback)
                                        }
                                    }, {
                                        validator: (data, value, callback) => {
                                            this.range(data, value, callback, 0, 65535)
                                        }
                                    }],
                                    initialValue: itemValues.ftpport ? itemValues.ftpport : ""
                                })(<Input className=""/>)}
                            </FormItem>
                            <FormItem label={< span > {callTr("serversavepath")} </span >}>
                                {getFieldDecorator("ftppath", {
                                    initialValue: itemValues.ftppath ? itemValues.ftppath : ""
                                })(<Input className=""/>)}
                            </FormItem>
                            <FormItem label={< span > {callTr("a_cusername")} </span >}>
                                {getFieldDecorator("ftpusername", {
                                    initialValue: itemValues.ftpusername ? itemValues.ftpusername : ""
                                })(<Input className=""/>)}
                            </FormItem>
                            <FormItem label={< span > {callTr("a_password")} </span >}>
                                {getFieldDecorator("ftppwd", {
                                    initialValue: itemValues.ftppwd ? itemValues.ftppwd : ""
                                })(<Input type={this.state.type} name = "httppass" suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible}/>} />)}
                            </FormItem>
                            <FormItem  className = "select-item" label={(<span>{callTr("ftpuploadinterval")}</span>)}>
                                {getFieldDecorator('ftpuploadinterval', {
                                    initialValue: itemValues.ftpuploadinterval ? itemValues.ftpuploadinterval : "0"
                                })(
                                    <Select>
                                        <Option value="0">{callTr('a_none')}</Option>
                                        <Option value="2">2</Option>
                                        <Option value="4">4</Option>
                                        <Option value="6">6</Option>
                                        <Option value="8">8</Option>
                                        <Option value="12">12</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </div>
                    </div> : null}
                    <Button className="submit" style={{marginLeft: 306, fontSize: '14px'}} type="primary"
                            onClick={this.handleSubmit}>{callTr("a_save")}</Button>
                </Form>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    activeKey: state.TabactiveKey,
    product: state.product,
    itemValues: state.itemValues
});
function mapDispatchToProps(dispatch) {
    var actions = {
        ftprecordupdate: Actions.ftprecordingupdate
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(RecordSet));
