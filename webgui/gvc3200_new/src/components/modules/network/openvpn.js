import React, { Component, PropTypes } from 'react'
import * as Actions from '../../redux/actions/index'
import {bindActionCreators} from 'redux'
import { connect } from 'react-redux'
import Enhance from "../../mixins/Enhance"
import {Form, Layout, Tooltip, Icon, Input, Checkbox, Select, Button, Radio, Upload, message} from "antd"
import * as optionsFilter from "../../template/optionsFilter";
const Content = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const certPvalue = ["9902", "9903", "9904"];

const req_items = [{"name":"vpnenable", "pvalue":"7050", "value":""},
                    {"name":"vpnlzoenable", "pvalue":"8508", "value":""},
                    {"name":"vpnserver", "pvalue":"7051", "value":""},
                    {"name":"vpnport", "pvalue":"7052", "value":""},
					{"name":"vpntransport", "pvalue":"2912", "value":""},
					{"name":"vpncipher", "pvalue":"8396", "value":""},
					{"name":"vpnusername", "pvalue":"8394", "value":""},
					{"name":"vpnpwd", "pvalue":"8395", "value":""}];

class OpenVPN extends Component {
    constructor(props){
        super(props);

		this.state = {
			curpvalue: "",
			disableDelBtn1: true,
			disableDelBtn2: true,
			disableDelBtn3: true,
			type: "password"
		}
    }

    componentDidMount = () => {
        this.props.getItemValues(req_items);
		this.props.getNvrams(new Array("9902", "9903", "9904"), (values) => {
			if(values.headers['9902']){
				this.setState({ disableDelBtn1: false });
			}
			if(values.headers['9903']){
				this.setState({ disableDelBtn2: false });
			}
			if(values.headers['9904']){
				this.setState({ disableDelBtn3: false });
			}
		})
    }

    componentWillReceiveProps = (nextProps) => {
        if(this.props.enterSave != nextProps.enterSave){
            this.handleSubmit();
        }
    }

	handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
    }

	handleUploadCert = (tag, info) => {
		if(info.file.status == "done"){
			if(info.file.response.indexOf("Response") != -1){
				let pvalue = certPvalue[tag];

				/* set the content of certificate into pvalue */
				this.props.setOpenVPNCert(pvalue, (value) => {
					if(value.headers.response == "Success"){
						message.success(this.tr("a_16669"));
						this.setState({[`disableDelBtn${tag + 1}`]: false});
					}else{
						message.success(this.tr("a_16477"));
					}
				});
			}
		}
	}

	/* set corresponding pvalue as empty to delete the certificate */
	deleteCert = (tag) => {
		this.props.putNvrams(new Array(certPvalue[tag]), new Array(""), "a_del_ok", () => {
			this.setState({[`disableDelBtn${tag + 1}`]: true});
		});
	}

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.props.setItemValues(req_items, values);
            }
        });
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.tr;
        const callTipsTr = this.tips_tr;
        const itemvalue = this.props.itemValues;

        let itemList =
            <Form hideRequiredMark className="configform" style={{minHeight: this.props.mainHeight}}>
				<FormItem label={<span>{callTr("a_19265")}<Tooltip title={callTipsTr("OpenVPN Enable")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vpnenable", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['vpnenable'])
                    })(
                        <Checkbox className="P-7050"/>
                    )}
                </FormItem>
				<FormItem label={<span>{callTr("enable_openvpn_lzo")}<Tooltip title={callTipsTr("Lzo-Compression Enable")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vpnlzoenable", {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemvalue['vpnlzoenable'] || "0")
                    })(
						<Checkbox className="P-8508"/>
                    )}
				</FormItem>
				<FormItem label={<span>{callTr("a_19266")}<Tooltip title={callTipsTr("OpenVPN Server Address")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vpnserver", {
                        initialValue: itemvalue['vpnserver'],
						rules: [{
							validator: (data, value, callback) => {
                                this.checkaddressPath(data, value, callback)
                            }
						}]
                    })(
                        <Input className="P-7051" />
                    )}
                </FormItem>
				<FormItem label={<span>{callTr("a_19267")}<Tooltip title={callTipsTr("OpenVPN Port")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vpnport", {
                        initialValue: itemvalue['vpnport'],
						rules: [{
							validator: (data, value, callback) => {
                                this.digits(data, value, callback)
                            }
						}, {
							validator: (data, value, callback) => {
                                this.range(data, value, callback, 0, 65535)
                            }
						}]
                    })(
                        <Input className="P-7052" />
                    )}
                </FormItem>
				<FormItem label={<span>{callTr("a_19268")}<Tooltip title={callTipsTr("OpenVPN Transport")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vpntransport", {
                        initialValue: itemvalue['vpntransport'] ? itemvalue['vpntransport'] : "0"
                    })(
                        <RadioGroup className="P-2912" >
							<Radio value="0">UDP</Radio>
							<Radio value="1">TCP</Radio>
						</RadioGroup>
                    )}
                </FormItem>

				<FormItem label={<span>{callTr("a_19668")}<Tooltip title={callTipsTr("OpenVPN CA")}><Icon type="question-circle-o"/></Tooltip></span>}>
					<Upload name="file" multiple={false} showUploadList={false} action="../upload?type=vericert" accept=".crt" onChange={this.handleUploadCert.bind(this, 0)}>
						<Button className="openvpn-upload-btn" type="primary">{callTr("a_16197")}</Button>
					</Upload>
					<Button type="primary" disabled={this.state.disableDelBtn1} onClick={this.deleteCert.bind(this, 0)}>{callTr("a_19067")}</Button>
                </FormItem>

				<FormItem label={<span>{callTr("a_19269")}<Tooltip title={callTipsTr("OpenVPN Client Certificate")}><Icon type="question-circle-o"/></Tooltip></span>}>
					<Upload name="file" multiple={false} showUploadList={false} action="../upload?type=vericert" accept=".crt" onChange={this.handleUploadCert.bind(this, 1)}>
						<Button className="openvpn-upload-btn" type="primary">{callTr("a_16197")}</Button>
					</Upload>
					<Button type="primary" disabled={this.state.disableDelBtn2} onClick={this.deleteCert.bind(this, 1)}>{callTr("a_19067")}</Button>
                </FormItem>

				<FormItem label={<span>{callTr("a_19270")}<Tooltip title={callTipsTr("OpenVPN Client Key")}><Icon type="question-circle-o"/></Tooltip></span>}>
					<Upload name="file" multiple={false} showUploadList={false} action="../upload?type=vericert" accept=".key" onChange={this.handleUploadCert.bind(this, 2)}>
						<Button className="openvpn-upload-btn" type="primary">{callTr("a_16197")}</Button>
					</Upload>
					<Button type="primary" disabled={this.state.disableDelBtn3} onClick={this.deleteCert.bind(this, 2)}>{callTr("a_19067")}</Button>
                </FormItem>

                <FormItem label={<span>{callTr("a_19271")}<Tooltip title={callTipsTr("OpenVPN Cipher Method")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vpncipher", {
                        initialValue: itemvalue['vpncipher'] ? itemvalue['vpncipher'] : "0"
                    })(
                        <Select className="P-8396">
                            <Option value="0">Blowfish</Option>
                            <Option value="1">AES-128</Option>
							<Option value="2">AES-256</Option>
							<Option value="3">Triple-DES</Option>
                        </Select>
                    )}
                </FormItem>
				<FormItem label={<span>{callTr("a_19272")}<Tooltip title={callTipsTr("OpenVPN Username")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vpnusername", {
                        initialValue: itemvalue['vpnusername']
                    })(
                        <Input className="P-8394" />
                    )}
                </FormItem>
				<FormItem label={<span>{callTr("a_19273")}<Tooltip title={callTipsTr("OpenVPN Password")}><Icon type="question-circle-o"/></Tooltip></span>}>
                    {getFieldDecorator("vpnpwd", {
                        initialValue: itemvalue['vpnpwd']
                    })(
                        <Input className="P-8395" type={this.state.type} autocomplete="off" suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />} />
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
                </FormItem>
				<div className="openvpn-copyright">
					<p>© 2002-2014 OpenVPN Technologies, Inc.</p>
					<p>OpenVPN is a registered trademark of OpenVPN Technologies, Inc.</p>
				</div>
            </Form> ;

        let hiddenOptions = optionsFilter.getHiddenOptions(0);
        for (var i = hiddenOptions.length-1; hiddenOptions[i] != undefined && i>=0; i--) {
            itemList.props.children.splice(hiddenOptions[i], 1);
        }

        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_19274")}</div>
                {itemList}
            </Content>
        )
    }
}

const OpenVPNForm = Form.create()(Enhance(OpenVPN));
const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    itemValues: state.itemValues,
    enterSave: state.enterSave,
    userType: state.userType
})

function mapDispatchToProps(dispatch) {
    var actions = {
        getItemValues:Actions.getItemValues,
        setItemValues:Actions.setItemValues,
        setOpenVPNCert: Actions.setOpenVPNCert,
        getNvrams: Actions.getNvrams,
        putNvrams: Actions.putNvrams
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(OpenVPNForm));
