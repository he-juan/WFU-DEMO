import React, { Component, PropTypes } from 'react';
import {Form, Input, Button, Modal, Icon, Row, Col, message, Tooltip, Table, Popconfirm} from "antd";
import Enhance from "../../../mixins/Enhance.js"
const FormItem = Form.Item;
const {Column} = Table;

const req_items = [{"name":"sipdomain", "pvalue":"22017", "value":""}];

class SipDomainForm extends Component{
	state = {
		disabled: false,
		serverdata: [],
		btntype: "a_23",
		curorder: 0,
		keys: [0],
		display: [],  //default: display-hidden
		direction: [],  //default: down
	}
	
	componentDidMount = () => {
		this.props.getItemValues(req_items, (values) => {
			let sipdomain = values['sipdomain'];
			if(sipdomain != ""){
				let re = new RegExp("'", "g");
				sipdomain = sipdomain.split(";");
				let temparr = [], displayarr = [], directionarr = [];
				for(let i = 0; i < sipdomain.length; i++){
					sipdomain[i] = JSON.parse(sipdomain[i].replace(re, "\""));
					temparr.push({
						order: i,
						serveralias: sipdomain[i].alias,
						serverlist: sipdomain[i].servers
					});
					
					displayarr.push("display-hidden");
					directionarr.push("down");
				}
				
				this.setState({
					serverdata: temparr,
					display: displayarr,
					direction: directionarr
				});
			}
		});
	}
	
	/*click delete icon to remove item from server list*/
	remove = (k) => {
		const {form} = this.props;
		const keys = this.state.keys;
		if(keys.length == 1)
			return;

		this.setState({
			keys: keys.filter(key => key !== k)
		});
	}
	
	/*click plus icon to add item to server list*/
	add = (k) => {
		const keys = this.state.keys;
		const product = this.props.product;
		

		this.props.form.validateFields([`serverlist${k}`], (err, value) => {
			if(!err){
				let limitlength = 5;
				if(product == "GXV3380" || product == "GXV3370"){
					limitlength = 16;
				}
				
				if(keys.length == limitlength){
					const errtip = this.props.callTr("a_servernumberlimit") + limitlength + "!";
					this.props.promptMsg("ERROR", errtip);
					return;
				}
				
				const nextKeys = keys.concat(++k);
				this.setState({
					keys: nextKeys,
				});
			}
		});
	}
	
	isSameServer = (rule, value, callback) => {
		const keys = this.state.keys;
		const form = this.props.form;

		for(let i = 0; i < keys.length; i++){
			if(rule.k != keys[i] && value == form.getFieldValue(`serverlist${keys[i]}`)){
				callback(this.props.callTr("a_repeatserveraddr"));
			}
		}
		callback();
	}
	
	checkServerDomain = (rule, value, callback) => {
		if(value.length > 64)
			callback(this.props.callTr("a_serveraliaslength"));
		const {form} = this.props;
		const serverdata = this.state.serverdata;
		
		if(this.state.btntype == "a_23"){
			for(let i = 0; i < serverdata.length; i++){
				if(value == serverdata[i].serveralias){
					callback(this.props.callTr("a_serveraliasrepeat"));
				}
			}
			callback();
		}
		
		callback();
	}
	
	/*change the value of server of server list will set to array mItemlist*/
	handleItemChange = (index, type, e) => {
		let value = e.target.value;
		if(type == "server"){
			if(value == ""){
				this.setState({
					disabled: true
				});
			}else{
				this.setState({
					disabled: false
				});
			}
			mItemlist[curserver].alias = value;
		}else{
			mItemlist[curserver].servers[index] = value;
		}
	}
	
	putServerData = (type, tempserver) => {
		let sipdomain = "";
		for(let i = 0; i < tempserver.length; i++){
			let tmp = {"alias": tempserver[i].serveralias, "servers": tempserver[i].serverlist};
			sipdomain += JSON.stringify(tmp) + ";";
		}
		sipdomain = sipdomain.substring(0, sipdomain.length - 1);
		
		let tmptip;
		switch (type) {
			case "add":
				tmptip = "a_add_ok";
				break;
			case "delete":
				tmptip = "a_del_ok";
				break;
			case "edit":
				tmptip = "a_edit_ok";
		}
		
		this.props.putNvrams(["22017"], [sipdomain], tmptip, () => {
			this.setState({serverdata: tempserver});
		});
	}
	
	onCancel = () => {
		const form = this.props.form;
		form.resetFields();
		this.setState({
			keys: [0],
			btntype: "a_23"
		});
	}
	
	onSaving = () => {
		const form = this.props.form;
		const keys = this.state.keys;
		let tempserver = this.state.serverdata;
		let displayarr = this.state.display;
		let directionarr = this.state.direction;
		
        form.validateFieldsAndScroll((err, values) => {
            if(!err){
				const curserveralias = form.getFieldValue("serveralias");
				/* add server item logic */
				if(this.state.btntype == "a_23"){
					let odr = 0;
					if(tempserver.length){
						odr = tempserver[tempserver.length-1].order + 1;
					}
					let newserveritem = {"order": odr, "serveralias": curserveralias, "serverlist": []};
					for(let i = 0; i < keys.length; i++){
						newserveritem.serverlist.push(form.getFieldValue(`serverlist${keys[i]}`));
					}

					tempserver.push(newserveritem);
					displayarr.push("display-hidden");
					directionarr.push("down");
					
					this.putServerData("add", tempserver);
					form.resetFields();
					this.setState({
						keys: [0],
						display: displayarr,
						direction: directionarr
					});
				}
				/* edit server item logic */
				else{
					const curorder = this.state.curorder;
					tempserver[curorder].serveralias = curserveralias;
					tempserver[curorder].serverlist.length = 0;
					for(let i = 0; i < keys.length; i++){
						tempserver[curorder].serverlist.push(form.getFieldValue(`serverlist${keys[i]}`));
					}
					
					this.putServerData("edit", tempserver);
					form.resetFields();
					this.setState({
						keys: [0],
						btntype: "a_23",
					});
				}
            }
        });
	}
	
	onDelete = (order) => {
		let tempserver = this.state.serverdata;
		tempserver.map((server, index) => {
			if(server.order == order){
				tempserver.splice(index, 1);
				return null;
			}
		});
		
		this.putServerData("delete", tempserver);
	}
	
	onEdit = (text) => {
		const form = this.props.form;
		let tmpkeys = [];
		for(let i = 0; i < text.serverlist.length; i++){
			tmpkeys.push(i);
		}
		this.setState({
			keys: tmpkeys,
			btntype: "a_17",
			curorder: text.order
		});
		
		setTimeout(() => {
			form.setFieldsValue({serveralias: text.serveralias});
			this.state.keys.map((key, index) => {
				form.setFieldsValue({[`serverlist${key}`]: text.serverlist[index]});
			});
		}, 10);
	}
	
	toggleList = (text) => {
		let tempdisplay = this.state.display;
		let tempdirection = this.state.direction;

		tempdisplay[text.order] = tempdisplay[text.order] == "display-hidden" ? "display-block" : "display-hidden";
		tempdirection[text.order] = tempdirection[text.order] == "down" ? "up" : "down";

		this.setState({
			display: tempdisplay,
			direction: tempdirection
		});

	}
	
	render(){
		const {visible, itemvalue, onCancel, form, callTr, callTipsTr,product} = this.props;
		const {getFieldDecorator, getFieldValue} = this.props.form;
		
		/*keys here to control server list*/
		const keys = this.state.keys;
		const serverListItems = this.state.keys.map((k, index) => {
			return (
				<FormItem key={k} label={index == 0 ? <span>{callTr("a_serverlist")}<Tooltip title={callTipsTr(this.isWP8xx() ? "Server List" : "Server List ")}><Icon type="question-circle-o"/></Tooltip></span> : " "}>
					{getFieldDecorator(`serverlist${k}`, {
						validateTrigger: ["onChange"],
						rules: [{
							required: true,
							whitespace: true,
							message: callTr("a_servicelimit")
						},{
							validator: (data, value, callback) => {
                                this.checkaddressPath(data, value, callback)
                            }
						},{
							validator: this.isSameServer, k: k
						}],
					})(
						<Input />
					)}
					<Icon className={index == keys.length - 1 ? "add-item-icon" : "remove-item-icon"} 
						onClick={index == keys.length - 1 ? this.add.bind(this, k) : this.remove.bind(this, k)} />
				</FormItem>
			)
		})
		
		return (
			<div>
				<Form className="sipdomianform" hideRequiredMark>
					<div className="blocktitle"><s></s>{callTr("a_sipdomain")}</div>
					<FormItem label={<span>{callTr("a_serveralias")}<Tooltip title={callTipsTr("Server Alias")}><Icon type="question-circle-o"/></Tooltip></span>}>
						{getFieldDecorator("serveralias", {
							validateTrigger: ["onChange", "onBlur"],
							rules: [{
								required: true,
								whitespace: true,
								message: callTr("a_serveraliasempty")
							},{
								validator: this.checkServerDomain
							}],
							initialValue: ""
						})(
							<Input />
						)}
					</FormItem>
					{serverListItems}
					<FormItem className="operatebtn">
	                    <Button className="cancel" size="large" onClick={this.onCancel}>{callTr("a_3")}</Button>
	                    <Button className="submit" type="primary" size="large" onClick={this.onSaving}>{callTr(this.state.btntype)}</Button>
	                </FormItem>
				</Form>
				<Table className="list-table" style={{"max-width":"1000px", margin: "50px 50px", paddingLeft: "55px"}} dataSource={this.state.serverdata} pagination={false} >
					<Column title={this.tr("a_serveralias")} dataIndex="serveralias" key="serveralias" />
					<Column title={this.tr("a_serverlist")} key={`serverlist${this.state.serverdata.order}` } render={(text, record, index) => (
						<div>
							<span className="serverlistspan">{text.serverlist[0]}</span>
							<span className={text.serverlist.length > 1 ? `arrow-icon-${this.state.direction[text.order]}` : ""} 
								onClick={this.toggleList.bind(this, text)}></span>
							<div className={this.state.display[text.order]} key={`serverdata${this.state.serverdata.order}`}>
								{
									text.serverlist.length > 1 ? 
									[...Array(text.serverlist.length -1)].map((item, i) => {
										return (
											<div key={i}>{text.serverlist[i + 1]}</div>
										)
									}) : null
								 }
							</div>
						</div>
					)}/>
					<Column title={this.tr("a_operate")} key="operate" render={(text, record, index) => (
						<span>
							<a className="edit-icon" onClick={this.onEdit.bind(this, text)}></a>
							<Popconfirm placement="top" title={this.tr("a_promptdelete")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.onDelete.bind(this, text.order)}>
								<a className="delete-icon" style={{margin: "3px 0 0 10px"}}></a>
							</Popconfirm>
						</span>
					)}/>
				</Table>
			</div>
		);
	}
}

export default Enhance(SipDomainForm);
