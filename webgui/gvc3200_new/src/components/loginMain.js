import React, {Component} from "react";
import Enhance from "./mixins/Enhance";
import * as Actions from './redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Form, Input, message, Button, Menu, Dropdown, Icon, Tooltip, Alert} from "antd";

const FormItem = Form.Item;
var lockout = 0;

class LoginMain extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			adminconfirmDirty: false,
			userconfirmDirty: false,
			disabled_login: "",
			password: "password",
			username: "",
			type: "password",
			pwdstatus0: "password",
			pwdstatus1: "password",
			pwdstatus2: "password",
			pwdstatus3: "password",
			userType: "admin",
			identifyingCode: "a_identifyingCode",
			changeAdmin: "a_6157",
			changeAdmin2: "a_6159",
			changeUser: "a_6157",
			changeUser2: "a_6159",
			idCodeValue: "",
			submitDisabled: false,
			isChangePwdPage: false,
			showError1:false,
			showError2:false,
			Error1:"",
			Error2:"",
		}
	}

	componentDidMount() {
		var lan = $.cookie("MyLanguage") != null ? $.cookie("MyLanguage") : this.props.oemId == "54" ? 'zh' : 'en';
		$.cookie("MyLanguage", lan, {path: '/', expires: 10});
		const form = this.props.form;
		form.setFieldsValue({
			language: lan
		});

		$('.mainDiv').hide();
		$('.mainDiv').slideDown(1000, this.showForm);

		this.props.checkLockout((data) => {
			this.cb_check_lockout_done(data);
		});
		if (this.props.oemId == "54" && this.props.product == "GXV3380") {
			this.createCode()
		}
	}

	createCode = () => {
		var c1 = document.getElementById("idCode")
		var w = 120;
		var h = 44;
		c1.width = w;
		c1.height = h;
		var ctx = c1.getContext('2d');

		ctx.fillStyle = rc(180, 230);
		ctx.fillRect(0, 0, w, h);

		ctx.textBaseline = 'top';
		var pool = 'ABCDEFGHJKLMNPQRSTWXY3456789';
		var txtAll = ''
		for (var i = 0; i < 4; i++) {
			var txt = pool[rn(0, pool.length)];
			txtAll = txtAll + txt;
			ctx.fillStyle = rc(10, 100);
			ctx.font = rn(15, 20) + 'px Arial';
			var txtWidth = ctx.measureText(txt).width;

			ctx.save();

			ctx.translate(i * 30 + 15, 20);
			ctx.rotate(rn(-12, 12) * Math.PI / 180);
			ctx.fillText(txt, rn(-15, 15 - txtWidth), rn(-15, 15 - txtWidth));
			ctx.restore();
		}
		this.setState({
			idCodeValue: txtAll
		})

		for (var i = 0; i < 6; i++) {
			ctx.beginPath();
			ctx.moveTo(rn(0, w), rn(0, h));
			ctx.lineTo(rn(0, w), rn(0, h));
			ctx.strokeStyle = rc(80, 180);
			ctx.stroke();
		}

		for (var i = 0; i < 50; i++) {
			ctx.beginPath();
			ctx.arc(rn(0, w), rn(0, h), 1, 0, 2 * Math.PI);
			ctx.fillStyle = rc(80, 230);
			ctx.fill();
		}

		function rn(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}

		function rc(min, max) {
			var r = rn(min, max);
			var g = rn(min, max);
			var b = rn(min, max);
			return `rgb(${r},${g},${b})`;
		}
	}


	handlePwdVisible = () => {
		this.setState({type: this.state.type == "password" ? "text" : "password"});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				message.destroy();
				if (values.username === '') {
					this.setState({
						showError1:true,
						Error1:"loginError11",
					})
				} else if (values.password === '') {
					this.setState({
						showError1:true,
						Error1:"loginError12",
					})
				} else if (this.state.idCodeValue != "" && values.identifyingCode.toLowerCase() != this.state.idCodeValue.toLowerCase()) {
					this.setState({
						showError1:true,
						Error1:"a_erroridentifyingCode",
					})
				} else {
					this.props.cb_ping();
					this.props.cbLogin((data) => {
						// var username = values.username + ":" + data;
						var A1 = values.username + ":" + data + ":" + values.password;
						var shapass = sha256(A1);
						// var shausername = sha256(username);
						this.props.cbLoginRealm(values.username, shapass, (data) => {
							this.cbLoginRealmDone(data)
						});
					});
				}
			}
		});
	}

	cbLoginRealmDone = (msgs) => {
		let disabled_login;
		if (msgs.headers['response'].toLowerCase() == "success") {
			$.cookie("needchange", msgs.headers['needchange'], {path: '/', expires: 10});
			if (msgs.headers['ver'] != "") {
				$.cookie("ver", msgs.headers['ver'], {path: '/', expires: 10});
			} else {
				$.cookie("ver", new Date().getTime(), {path: '/', expires: 10});
			}
			if (msgs.headers['needchange'] == "1") {
				this.props.form.validateFieldsAndScroll((err, values) => {
					this.setState({
						userType: values.username,
						isChangePwdPage: true
					})
				})
				if (this.state.userType == "admin") {
					$("#adminpasswd").focus()
				} else {
					$("#userpasswd").focus()
				}
			} else {
				this.props.setPageStatus(1)
			}
			$.cookie("logindate", new Date().getTime(), {path: '/', expires: 10});
		} else {
			this.props.setPageStatus(0)
			message.destroy();
			if (msgs.headers["message"] == "Locked") {
				if (msgs.headers["locktype"] == "2") {
					disabled_login = "disabled";
					this.setState({
						showError1:true,
						Error1:"lockedrebootuser",
					})
				} else {
					disabled_login = "disabled";
					this.setState({
						showError1:true,
						Error1:"lockeduser",
					})
					var self = this;
					setTimeout(function () {
						self.unlockout()
					}, 301000);
				}
			} else if (msgs.headers["message"] == "Invalid Username") {
				this.setState({
					showError1:true,
					Error1:"invaliduser",
				})
			} else {
				var times = 5 - parseInt(msgs.headers["times"]);
				if (times <= 0) {
					lockout = 1;
					this.setState({
						showError1:true,
						Error1:"lockout",
					})
					disabled_login = "disabled";
					var self = this;
					setTimeout(function () {
						self.unlockout()
					}, 301000);
				} else {
					lockout = 0;
					var errmsg = this.tr("authfail") + " " + this.tr("lefttimes") + times;
					this.setState({
						showError1:true,
						Error1:errmsg,
					})
				}
			}
			this.setState({
				disabled_login: disabled_login
			})

		}
	}

	cb_check_lockout_done(data) {
		if (data == "2") {
			lockout = 1;
			this.setState({
				showError1:true,
				Error1:"lockreboot",
			})
			disabled_login = "disabled";
		} else if (data == "1") {
			lockout = 1;
			this.setState({
				showError1:true,
				Error1:"lockout",
			})
			disabled_login = "disabled";
			var self = this;
			setTimeout(function () {
				self.unlockout();
			}, 301000);
		} else {
			lockout = 0;
		}
		this.setState({
			disabled_login: disabled_login
		})
	}

	unlockout() {
		lockout = 0;
		disabled_login = ""
		this.props.checkLockout((data) => {
			this.cb_check_lockout_done(data);
		});
		this.setState({
			disabled_login: disabled_login
		})
	}

	showForm() {
		$("#lobinbtmline").show();
		$('.loginDiv').fadeIn(1000);
		$('#username').val('').focus();
	}

	localeChange = (value) => {
		this.props.setCurLocale(value);
		$.cookie("MyLanguage", value, {path: '/', expires: 10});
	}

	onFocusPassword = () => {
		this.setState({password: ""})
	}

	onFocusUsername = () => {
		this.setState({username: ""})
	}

	onBlurPassword = () => {
		this.setState({password: "password"})
	}

	onBlurUsername = () => {
		this.setState({username: "username"})
	}

	onFocusIdentifyingCode = () => {
		this.setState({identifyingCode: ""})
	}

	onBlurIdentifyingCode = () => {
		this.setState({identifyingCode: "a_identifyingCode"})
	}

	onFocuschangeAdmin = () => {
		this.setState({changeAdmin: ""})
	}

	onBlurchangeAdmin = () => {
		this.setState({changeAdmin: "a_6157"})
	}

	onFocuschangeAdmin2 = () => {
		this.setState({changeAdmin2: ""})
	}

	onBlurchangeAdmin2 = () => {
		this.setState({changeAdmin2: "a_6159"})
	}

	onFocuschangeUser = () => {
		this.setState({changeUser: ""})
	}

	onBlurchangeUser = () => {
		this.setState({changeUser: "a_6157"})
	}

	onFocuschangeUser2 = () => {
		this.setState({changeUser2: ""})
	}

	onBlurchangeUser2 = () => {
		this.setState({changeUser2: "a_6159"})
	}

	handleSubmit2 = (e) => {
		e.preventDefault();
		const form = this.props.form;
		const username = this.state.userType;
		form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				const adminpwd_input = form.getFieldValue("adminpasswd");
				const userpwd_input = form.getFieldValue("userpasswd");

				const adminpwd_input2 = form.getFieldValue("adminpasswd2");
				const userpwd_input2 = form.getFieldValue("userpasswd2");

				if (username == "admin") {
					if (adminpwd_input == "") {
						this.setState({
							showError2:true,
							Error2:"loginError3",
						})
					} else if (adminpwd_input2 == "") {
						this.setState({
							showError2:true,
							Error2:"loginError4",
						})
					} else if (adminpwd_input == "admin") {
						this.setState({
							showError2:true,
							Error2:"loginError5",
						})
					} else if (adminpwd_input != adminpwd_input2) {
						this.setState({
							showError2:true,
							Error2:"loginError6",
						})
					} else {
						if (adminpwd_input.length < 6 && adminpwd_input.length > 0) {
							this.setState({
								showError2:true,
								Error2:"pwdRule0",
							})
							return;
						}
						if (/^[0-9]*$/.test(adminpwd_input) || /^[a-z]*$/.test(adminpwd_input) || /^[A-Z]*$/.test(adminpwd_input)) {
							this.setState({
								showError2:true,
								Error2:"loginError7",
							})
							return;
						}
						let hasNumber = false
						for (let j = 0; j < adminpwd_input.length; j++) {
							if (/^[0-9]$/.test(adminpwd_input[j])) {
								hasNumber = true;
								break
							}
						}
						if (!hasNumber) {
							this.setState({
								showError2:true,
								Error2:"loginError7",
							})
							return;
						}
						this.setState({
							submitDisabled: true
						})
						this.props.changePwd(adminpwd_input, "", this.changepwdCallback);
					}
				} else {
					if (userpwd_input == "") {
						this.setState({
							showError2:true,
							Error2:"loginError3",
						})
					} else if (userpwd_input2 == "") {
						this.setState({
							showError2:true,
							Error2:"loginError4",
						})
					} else if (userpwd_input == "123") {
						this.setState({
							showError2:true,
							Error2:"loginError5",
						})
					} else if (userpwd_input != userpwd_input2) {
						this.setState({
							showError2:true,
							Error2:"loginError6",
						})
					} else {
						if (userpwd_input.length < 6 && userpwd_input.length > 0) {
							this.setState({
								showError2:true,
								Error2:"pwdRule0",
							})
							return;
						}
						if (/^[0-9]*$/.test(userpwd_input) || /^[a-z]*$/.test(userpwd_input) || /^[A-Z]*$/.test(adminpwd_input)) {
							this.setState({
								showError2:true,
								Error2:"loginError7",
							})
							return;
						}
						let hasNumber = false
						for (let j = 0; j < userpwd_input.length; j++) {
							if (/^[0-9]$/.test(userpwd_input[j])) {
								hasNumber = true;
								break
							}
						}
						if (!hasNumber) {
							this.setState({
								showError2:true,
								Error2:"loginError7",
							})
							return;
						}
						this.setState({
							submitDisabled: true
						})
						this.props.changePwd("", userpwd_input, this.changepwdCallback);
					}
				}
			}
		});
	}

	changepwdCallback = (msgs) => {
		if (msgs.headers['response'] == "Success") {
			$.cookie("needchange", "", {path: '/', expires: 10});
			this.props.setPageStatus(1)
		} else {
			this.setState({
				submitDisabled: false
			})
			this.setState({
				showError2:true,
				Error2:"changepwdError" + msgs.headers['errorcode'],
			})
		}

	}

	/*    handleAdminConfirmBlur = (e) => {
					const value = e.target.value;
					this.setState({adminconfirmDirty: this.state.adminconfirmDirty || !!value});
			}

			handleUserConfirmBlur = (e) => {
					const value = e.target.value;
					this.setState({userconfirmDirty: this.state.userconfirmDirty || !!value});
			}*/

	checkConfirm = (rule, value, callback) => {
		const form = this.props.form;
		if (rule.role == "admin") {
			if (this.state.adminconfirmDirty) {
				form.validateFields(['adminpasswd2'], {force: true});
			}
		}
		else {
			if (this.state.userconfirmDirty) {
				form.validateFields(['userpasswd2'], {force: true});
			}
		}
		callback();
	}
	checkPassword = (rule, value, callback) => {
		const form = this.props.form;

		if (rule.role == "admin") {
			if (value && !this.state.adminconfirmDirty) {
				this.setState({
					adminconfirmDirty: true
				})
			}
			if (value !== form.getFieldValue('adminpasswd'))
				callback(this.tr("a_samepwd"));
			else
				callback();
		}
		else {
			if (value && !this.state.userconfirmDirty) {
				this.setState({
					userconfirmDirty: true
				})
			}
			if (value !== form.getFieldValue('userpasswd'))
				callback(this.tr("a_samepwd"));
			else
				callback();
		}
	}
	checkPassword2 = (rule, value, callback) => {
		if (value == "") {
			callback();
			return
		}
		if (value.length < 6 && value.length > 0) {
			callback(this.tr("pwdRule0"));
			return
		}
		if (/^[0-9]*$/.test(value) || /^[a-z]*$/.test(value) || /^[A-Z]*$/.test(value)) {
			callback(this.tr("pwdRule1"));
			return;
		}
		let hasNumber = false
		for (let j = 0; j < value.length; j++) {
			if (/^[0-9]$/.test(value[j])) {
				hasNumber = true;
				break
			}
		}
		if (!hasNumber) {
			callback(this.tr("pwdRule1"));
			return;
		}
		callback();
	}
	checkCharacter = (rule, value, callback) => {
		/* add limitation for input characters only ascii code between 33-126 are allowed */
		if (value != "" && value != undefined) {
			let reg = new RegExp("^[\x21-\x7E]+$");
			if (!reg.test(value))
				callback(this.tr("tip_error"));
		}
		callback();
	}

	handlePwdVisible2 = (order) => {
		this.setState({[`pwdstatus${order}`]: this.state[`pwdstatus${order}`] == "password" ? "text" : "password"});
	}

	render() {
		const {getFieldDecorator} = this.props.form;
		let disabled_login = this.state.disabled_login;
		const languageMenu = (
			<Menu className="loginlanmenu">
				<Menu.Item key="1">
					<span onClick={this.localeChange.bind(this, "en")}>English</span>
				</Menu.Item>
				<Menu.Item key="2">
					<span onClick={this.localeChange.bind(this, "zh")}>中文</span>
				</Menu.Item>
			</Menu>
		);
		return (
			<div className="bgDiv">
				<div className="mainDiv">
					<div className={this.state.isChangePwdPage ? "hide" : ""} id="loginBox">
						<div className="titleDiv">
							<span className="titleSpan">{this.tr("a_welcome")} {this.props.productStr}</span>
						</div>
						<div className="loginDiv">
							<Form onSubmit={this.handleSubmit}>
								{this.state.showError1?<div className="login_error">
									<b className="error_icon"></b>{this.tr(this.state.Error1)}
								</div>:null}
								<div className="changepwdPrompt">

								</div>
								<div className="expose">
									<div className="input-wrap">
										<FormItem>
											{getFieldDecorator("username", {
												initialValue: ""
											})(<Input id="username" autofocus="autofocus"
											          onBlur={this.onBlurUsername.bind(this)}
											          onFocus={this.onFocusUsername.bind(this)}
											          placeholder={this.tr(this.state.username)} autocomplete="off"
												/>
											)}
										</FormItem>
										<span className="input-ico userIcon"></span>
									</div>
									<div className="input-wrap">
										<FormItem>
											<Input id="password" type="password" style={{display: "none"}} disabled
											       autocomplete="off"
											/>
											{getFieldDecorator("password", {
												rules: [],
												initialValue: ""
											})(<Input id="password" type={this.state.type} maxLength="32"
											          onBlur={this.onBlurPassword.bind(this)}
											          onFocus={this.onFocusPassword.bind(this)}
											          placeholder={this.tr(this.state.password)}
											          suffix={<Icon type="eye" className={this.state.type}
											                        style={{marginTop: 12, marginRight: 8}}
											                        onClick={this.handlePwdVisible}/>}/>
											)}
										</FormItem>
										<span className="input-ico lockIcon"></span>
									</div>
									<div style={{position: "relative"}}>
										{this.props.oemId == "54" && this.props.product == "GXV3380" ? <FormItem>
											{getFieldDecorator("identifyingCode", {
												rules: [],
												initialValue: ""
											})(<Input id="identifyingCode"
											          onBlur={this.onBlurIdentifyingCode.bind(this)}
											          onFocus={this.onFocusIdentifyingCode.bind(this)}
											          placeholder={this.tr(this.state.identifyingCode)}
											          autocomplete="off"/>)}
										</FormItem> : ""}
										{this.props.oemId == "54" && this.props.product == "GXV3380" ?
											<canvas id="idCode" style={{
												position: "absolute",
												left: 280,
												top: 10,
												cursor: "pointer",
											}} onClick={this.createCode}></canvas> : ""
										}
									</div>
									<Button id='loginbtn' type="primary" htmlType="submit"
									        disabled={disabled_login}>{this.tr("login")}</Button>
								</div>
							</Form>
						</div>
					</div>
					<div className={this.state.isChangePwdPage ? "" : "hide"} id="changePwdBox">
						<div className="titleDiv">
							<span className="titleSpan">{this.tr("a_6295")}</span>
						</div>
						<div className="loginDiv">
							<Form onSubmit={this.handleSubmit2}>
								{this.state.showError2?<div className="login_error">
									<b className="error_icon"></b>{this.tr(this.state.Error2)}
								</div>:null}
								<div className="changepwdPrompt">
									{this.tr("a_changepwdPrompt")}
								</div>
								<div className="expose">
									{this.state.userType == "admin" ?
										<div style={{position:"relative"}}><FormItem>
											{getFieldDecorator("adminpasswd", {
												rules: [],
												initialValue: ""
											})(
												<Input maxLength="32" type={this.state.pwdstatus0} className="P-2"
												       suffix={<Icon type="eye" className={this.state.pwdstatus0}
												                     style={{marginTop: 12, marginRight: 8}}
												                     onClick={this.handlePwdVisible2.bind(this, 0)}/>}
												       placeholder={this.tr(this.state.changeAdmin)}
												       onBlur={this.onBlurchangeAdmin.bind(this)}
												       onFocus={this.onFocuschangeAdmin.bind(this)}
												/>
											)}
										</FormItem>{this.state.changeAdmin==""?<div className="passwordRule">{this.tr("a_passwordRule")}</div>:null}</div> : ""
									}
									{this.state.userType == "admin" ?
										<FormItem>
											{getFieldDecorator("adminpasswd2", {
												rules: [],
												initialValue: ""
											})(
												<Input maxLength="32" type={this.state.pwdstatus1}
												       suffix={<Icon type="eye" className={this.state.pwdstatus1}
												                     style={{marginTop: 12, marginRight: 8}}
												                     onClick={this.handlePwdVisible2.bind(this, 1)}/>}
												       placeholder={this.tr(this.state.changeAdmin2)}
												       onBlur={this.onBlurchangeAdmin2.bind(this)}
												       onFocus={this.onFocuschangeAdmin2.bind(this)}
												/>
											)}
										</FormItem> : ""
									}
									{this.state.userType == "user" ?
										<div style={{position:"relative"}}><FormItem>
											{getFieldDecorator("userpasswd", {
												rules: [],
												initialValue: ""
											})(
												<Input maxLength="32" type={this.state.pwdstatus2}
												       suffix={<Icon type="eye" className={this.state.pwdstatus2}
												                     style={{marginTop: 12, marginRight: 8}}
												                     onClick={this.handlePwdVisible2.bind(this, 2)}/>}
												       placeholder={this.tr(this.state.changeUser)}
												       onBlur={this.onBlurchangeUser.bind(this)}
												       onFocus={this.onFocuschangeUser.bind(this)}
												/>
											)}
										</FormItem>{this.state.changeUser==""?<div className="passwordRule">{this.tr("a_passwordRule")}</div>:null}</div> : ""
									}
									{this.state.userType == "user" ?
										<FormItem>
											{getFieldDecorator("userpasswd2", {
												rules: [],
												initialValue: ""
											})(
												<Input maxLength="32" type={this.state.pwdstatus3}
												       className="P-196"
												       suffix={<Icon type="eye" className={this.state.pwdstatus3}
												                     style={{marginTop: 12, marginRight: 8}}
												                     onClick={this.handlePwdVisible2.bind(this, 3)}/>}
												       placeholder={this.tr(this.state.changeUser2)}
												       onBlur={this.onBlurchangeUser2.bind(this)}
												       onFocus={this.onFocuschangeUser2.bind(this)}
												/>
											)}
										</FormItem> : ""
									}
									<Button id="loginbtn2" key="submit" type="primary" htmlType="submit"
									        disabled={this.state.submitDisabled}>
										{this.tr("a_17")}
									</Button>

								</div>
							</Form>
						</div>
					</div>
				</div>


				<div className="loginlanbox">
					<FormItem>
						{getFieldDecorator("language")(
							<div className="loginlan">
								<Dropdown overlay={languageMenu}>
                                                <span>
                                                    {$.cookie("MyLanguage") == "zh" ? "中文" : "English"}
	                                                <Icon type="down"
	                                                      style={{float: "right", marginTop: '12px', fontSize: 18}}/>
                                                </span>
								</Dropdown>
							</div>
						)}
					</FormItem>
				</div>
				<div className="loginFooter">
					<span className={this.props.oemId == "54" ? 'display-hidden' : 'display-block'}>{"All Rights Reserved " + this.props.vendor + " 2018"}</span>
				</div>
			</div>
		);
	}
};


const LoginMainForm = Form.create()(Enhance(LoginMain));

const mapStateToProps = (state) => ({
	curLocale: state.curLocale,
	pageStatus: state.pageStatus,
	productStr: state.productStr,
	oemId: state.oemId,
	product: state.product,
	vendor: state.vendor
})

function mapDispatchToProps(dispatch) {
	var actions = {
		setCurLocale: Actions.setCurLocale,
		setPageStatus: Actions.setPageStatus,
		getProduct: Actions.getProduct,
		cb_ping: Actions.cb_ping,
		cbLogin: Actions.cbLogin,
		cbLoginRealm: Actions.cbLoginRealm,
		checkLockout: Actions.checkLockout,
		changePwd: Actions.changePwd
	}
	return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(LoginMainForm));
