import React, { Component, PropTypes } from 'react'
import * as Actions from '../../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Form, Tooltip, Icon, Button, Upload, Table, Popconfirm, Modal, Select, Input} from "antd";
const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const {Column} = Table;

class AddCert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: "password",
            pwdvisible: "display-hidden",
            selbtndisable: false,
            fileList: [],
        }
    }

	componentWillReceiveProps = (nextProps) => {
		if(nextProps.reset){
			this.props.form.resetFields();
			this.setState({
				type: "password",
	            pwdvisible: "display-hidden",
	            selbtndisable: false,
	            fileList: [],
			});
		}
	}

    handlePwdVisible = () => {
        this.setState({type: this.state.type == "password" ? "text" : "password"});
    }

    checkIsSelected = (rule, value, callback) => {
        if(!value){
            callback(this.props.callTr("a_unselect_cert"));
        }else{
            callback();
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const callTr = this.props.callTr;

        const cilentCertProps = {
            name: 'file',
            multiple: false,  //support upload multiple files or not
            showUploadList: true,  //show upload list or not
            action: '../upload?type=vericert',
            accept: '.crt, .cer, .pem, .p12, .pfx',
            beforeUpload: (file) => {
                const filetype = file.name.substring(file.name.length - 3, file.name.length);
                if(filetype == "p12" || filetype == "pfx"){
                    this.setState({pwdvisible: "display-block"});
                }
                this.setState( ({ fileList })  => ({
                    fileList: [...fileList, file],
                    selbtndisable: true,
                }), () => {
					this.props.form.setFieldsValue({
						isselected: true,
						filelist: this.state.fileList
					});
				});
                return false;
            },
            onRemove: (file) => {
                this.setState({
                    fileList: [],
                    selbtndisable: false,
                    pwdvisible: "display-hidden"
                }, () => {
					this.props.form.setFieldsValue({
						isselected: false,
						filelist: []
					});
				});
            },
            fileList: this.state.fileList
        };

        return(
            <Form className="add-cert-modal" hideRequiredMark>
                <FormItem label={<span>{callTr("a_certuse")}</span>}>
                    {getFieldDecorator("certuse", {
                        initialValue: "0"
                    })(
                        <Select>
                            <Option value="0">{callTr("a_userforvpn")}</Option>
                            <Option value="1">Wi-Fi</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_selectcert")}</span>}>
                    {getFieldDecorator("isselected", {
                        initialValue: false,
                        rules: [{
                            validator: this.checkIsSelected
                        }]
                    })(
                        <Upload {...cilentCertProps}>
                            <Button type="primary" disabled={this.state.selbtndisable} style={{width: 100}}>{callTr("a_73")}</Button>
                        </Upload>
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_certname")}</span>}>
                    {getFieldDecorator("certname", {
                        initialValue: "",
                        rules: [{
                            required: true, message: callTr("a_19637") + "!"
                        }]
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label={<span>{callTr("a_6759")}</span>} className={this.state.pwdvisible}>
                    {getFieldDecorator("certpwd", {
                        initialValue: "",
                        rules: [{
							required: this.state.pwdvisible == "display-block" ? true : false, message: callTr("a_19637") + "!"
							//required: true, message: callTr("a_19637") + "!"
                        }]
                    })(
						<Input type={this.state.type}
                            suffix={<Icon type="eye" className={this.state.type} onClick={this.handlePwdVisible} />}/>
                    )}
                </FormItem>
				{getFieldDecorator("filelist",{
					initialValue: []
				})(
					<Input className="display-hidden"/>
				)}
            </Form>
        );
    }
}

const AddCertForm = Form.create()(AddCert);

class ClientCert extends Component {
    constructor(props){
        super(props);

        this.state = {
            addcertvisible: false,
			reset: false,
			certdata: [],
            loading: false
        }
    }

    componentDidMount = () => {
		this.handleGetCertData();
    }

    handleGetCertData = () => {
        let certdata = [];
        this.props.getVpnCerts((vpncerts) => {
			if(vpncerts.length){
				for(let i in vpncerts){
					certdata.push({
						certorder: parseInt(i) + 1,
						certname: vpncerts[i],
						certuse: "a_userforvpn"
					});
				}
			}

			this.props.getWifiCerts((wificerts) => {
				if(wificerts.length){
					let startorder = certdata.length + 1;
					for(let j in wificerts){
						certdata.push({
							certorder: parseInt(j) + startorder,
							certname: wificerts[j],
							certuse: "Wi-Fi"
						});
					}
				}

				this.setState({certdata: certdata});
			});
        });
    }

    handleCertModalVisible = (visible) => {
        this.setState({
			addcertvisible: visible,
			reset: !visible
		}, () => ({
			reset: false
		}));
    }

    handleUploadAndInstall = () => {
        const form = this.props.form;
        form.validateFieldsAndScroll(["certuse", "isselected", "certname", "certpwd", "filelist"], (err, values) => {
            if(!err){
				let file = values['filelist'][0];
                const filetype = file.name.substring(file.name.length - 3, file.name.length);
                values['ext'] = filetype;
				const formData = new FormData();
				formData.append('files[]', file);
				this.props.uploadAndInstallCert(values, formData, (data) => {
                    if(data.res == "success"){
                        this.setState({loading: true});
                        setTimeout(() => {
                            this.handleGetCertData();
                            this.setState({loading: false}, () => {
                                //this.props.promptMsg("SUCCESS", "a_installsuc");
                                this.handleCertModalVisible(false);
                                const modal = Modal.info({
                                    title: this.props.callTr("a_installtip"),
                                    content: this.props.callTr("a_canotinclude"),
                                    okText: this.props.callTr("a_2"),
                                });
                                setTimeout(() => modal.destroy(), 3000);
                            });
                        }, 1500);
                    }
                    else{
                        //this.props.promptMsg("ERROR", "a_installfail");
                        const modal = Modal.error({
                            title: this.props.callTr("a_installfail"),
                            okText: this.props.callTr("a_2"),
                        });
                        setTimeout(() => modal.destroy(), 3000);
                        this.handleCertModalVisible(false);
                    }
				});
            }
        });
    }

	handleDeleteCert = (text) => {
		let name = text.certname;
        let use = text.certuse;
        if(use.indexOf("Wi-Fi") != -1){
            use = 1;
        }else{
            use = 0;
        }

        this.props.deleteCert(name, use, (data) => {
            if(data.res == "success"){
                this.handleGetCertData();
                this.props.promptMsg('SUCCESS', 'a_del_ok');
            }
        })
	}

    render(){
        const callTr = this.props.callTr;
        return(
            <div className="ca-cert-block">
                <div style={{"fontSize":"0.875rem", "margin-bottom":"40px"}}>
                    <div>{callTr("a_addcert")}</div>
                    <Button className="upload-btn" onClick={this.handleCertModalVisible.bind(this, true)}>
                        <span className="upload-icon" />
                        <span style={{marginLeft: "5px"}}>{callTr("a_23")}</span>
                    </Button>
                </div>
                <Table className="list-table" style={{maxWidth: "950px", paddingRight: "40px"}} dataSource={this.state.certdata} pagination={false} >
                    <Column title={callTr("a_19218")} dataIndex="certorder" key="certorder" />
                    <Column title={callTr("a_certname")} dataIndex="certname" key="certname" />
                    <Column title={callTr("a_certuse")} dataIndex="certuse" key="certuse" render={(text) => (<span>{callTr(text)}</span>)}/>
                    <Column title={callTr("a_44")} key="delete" render={(text, record, index) => (
                        <span>
                            <Popconfirm placement="top" title={callTr("a_promptdelete")} okText={callTr("a_2")} cancelText={callTr("a_3")}
								onConfirm={this.handleDeleteCert.bind(this, text)}>
                                <a className="delete-icon"></a>
                            </Popconfirm>
                        </span>
                    )}/>
                </Table>
                <Modal title={callTr("a_addcert")} okText={callTr("a_uploadinstall")} cancelText={callTr("a_3")}
                    visible={this.state.addcertvisible} onOk={this.handleUploadAndInstall} confirmLoading={this.state.loading}
                    onCancel={this.handleCertModalVisible.bind(this, false)}>
                    <AddCertForm {...this.props} reset={this.state.reset}/>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(ClientCert);
