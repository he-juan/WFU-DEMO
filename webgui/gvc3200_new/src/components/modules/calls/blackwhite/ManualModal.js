import React, {Component} from 'react';
import {Form, Input, Modal} from "antd";

const FormItem = Form.Item;


class ManualModal extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    handleAddOk = () => {
        let whitelistItemdata = this.props.whitelistItemdata;
        let blacklistItemdata = this.props.blacklistItemdata;
        let manualnumber = this.props.form.getFieldsValue(['manualnumber']);
        let manualname = this.props.form.getFieldsValue(['manualname']);
        let [number,name] = [manualnumber.manualnumber,manualname.manualname];
        name = (name == undefined || name == "") ? number : name;
        if (this.props.manultitle == "a_remarksadjust") {
            var id = this.props.Idblack || this.props.whiteId;
            if (this.props.itemType == "black") {
                this.props.editBlackMember(id, name, (result) => {
                    this.props.get_Blacklist("members");
                });
            } else {
                this.props.editWhiteMember(id, name, (result) => {
                    this.props.get_Whitelist("members");
                });
            }
        }
        else {
            for (var i = 0; i < (whitelistItemdata && whitelistItemdata.length); i++) {
                if (number == whitelistItemdata[i]['number']) {
                    this.props.promptMsg('ERROR','a_whiteexit');
                    return false;
                }
            }
            for (var i = 0; i < (blacklistItemdata && blacklistItemdata.length); i++) {
                if (number == blacklistItemdata[i]['number']) {
                    this.props.promptMsg('ERROR','a_blackexit');
                    return false;
                }
            }
            if (number == undefined) {
                this.props.promptMsg('ERROR','a_numberempty');
                return false;
            }
            if (!(/^(0|[0-9][0-9]*)$/i.test(number))) {
                this.props.promptMsg('ERROR','a_numbererror');
                return false;
            }
            if(this.props.itemType=="black"){
                this.props.addNewBlackMember(number, name, (result) => {
                    this.props.get_Blacklist("members");
                });
            }else{
                this.props.addNewWhiteMember(number, name, (result) => {
                    this.props.get_Whitelist("members");
                });
            }
        }
        this.props.handleHideModal();
    }

    handleCancel = () => {
        this.props.handleHideModal();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const callTr = this.props.callTr;
        const addmanualVisible = this.props.addmanualVisible;
        const manultitle = this.props.manultitle;
        const numberinput = this.props.numberinput;
        return (
            <Modal
                className='black-modal'
                title = {callTr(manultitle)}
                visible = {addmanualVisible}
                onOk={this.handleAddOk}
                onCancel={this.handleCancel}
                okText={callTr("a_ok")}
                cancelText={callTr("a_cancel")}
            >
                <Form hideRequiredMark>
                    <FormItem label={(<span>{callTr("a_number")}</span>)}>
                        {getFieldDecorator('manualnumber', {
                        })(
                            <Input type = "text" disabled={numberinput} placeholder={callTr("a_nameinput")}/>
                        )}
                    </FormItem>
                    <FormItem label={(<span>{callTr("a_remarks")}</span>)}>
                        {getFieldDecorator('manualname', {
                        })(
                            <Input type = "text" placeholder={callTr("a_remarksinput")}/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default ManualModal
