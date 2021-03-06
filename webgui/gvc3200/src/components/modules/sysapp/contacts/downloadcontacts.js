import React, { Component, PropTypes } from 'react'
import Enhance from '../../../mixins/Enhance'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Store from '../../../entry'
import { Form, Tooltip, Icon, Input, Checkbox, Button, Select, Radio } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
let req_items = new Array;

class DownloadContactsForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            pwdstatus1:"password",
            disabled1:false,
            disabled2:false,
            disabled3:false,
        }
    }

    handleVisibleType = (item,e) => {
        if(item == "clearold") {
            this.setState({ disabled1: !this.state.disabled1});
        } else if(item == "downdup") {
            this.setState({ disabled2: !this.state.disabled2});
        }
    }

    handlePvalue = () => {
         req_items = [];
         let getReqItem = this.props.getReqItem
         req_items.push(
             getReqItem("clearold", '1435', ""),
             getReqItem("downdup", '1436', ""),
             getReqItem("downmode", '330', ""),
             getReqItem("downencodetype", '1681', ""),
             getReqItem("downserver", '331', ""),
             getReqItem("httpsusername", '6713', ""),
             getReqItem("httpspass", '6714', ""),
             getReqItem("phbkdowninterval", '332', "")
         );
         return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(),(values) => {
            if(values["downmode"] == '0' || values["downmode"] == '' ) {
                this.setState({disabled3:true})
            } else if (values["downmode"] == '1') {
                Array.from(document.querySelectorAll('.httpuser')).map((item)=>{
                    item.style.display = 'none';
                })
            }
            if(values["clearold"] == "0" || values["clearold"] == "-1" || values["clearold"] == "" ) {
                this.setState({disabled1:true})
                this.props.form.setFieldsValue({
                    clearold:0,
                    clearoldlistmode: `${parseFloat(values["clearold"],10)+1}`
                })
            } else if(values["clearold"] == "1" || values["clearold"] == "2") {
                this.props.form.setFieldsValue({
                    clearold:1,
                    clearoldlistmode: `${parseFloat(values["clearold"],10)-1}`
                })
            }
            if(values["downdup"] == "0" || values["downdup"] == "-1" || values["downdup"] == "") {
                this.setState({disabled2:true})
                this.props.form.setFieldsValue({
                    downdup:0,
                    downdupmode: `${parseFloat(values["downdup"],10)+1}`
                })
            } else if(values["downdup"] == "1" || values["downdup"] == "2") {
                this.props.form.setFieldsValue({
                    downdup:1,
                    downdupmode: `${parseFloat(values["downdup"],10)-1}`
                })
            }
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue(),(values) => {
                    if(values["downmode"] == '0' || values["downmode"] == '' ) {
                        this.setState({disabled3:true})
                    }
                    if(values["clearold"] == "0" || values["clearold"] == "-1" || values["clearold"] == "" ) {
                        this.setState({disabled1:true})
                        this.props.form.setFieldsValue({
                            clearold:0,
                            clearoldlistmode: `${parseFloat(values["clearold"],10)+1}`
                        })
                    } else if(values["clearold"] == "1" || values["clearold"] == "2") {
                        this.props.form.setFieldsValue({
                            clearold:1,
                            clearoldlistmode: `${parseFloat(values["clearold"],10)-1}`
                        })
                    }
                    if(values["downdup"] == "0" || values["downdup"] == "-1" || values["downdup"] == "") {
                        this.setState({disabled2:true})
                        this.props.form.setFieldsValue({
                            downdup:0,
                            downdupmode: `${parseFloat(values["downdup"],10)+1}`
                        })
                    } else if(values["downdup"] == "1" || values["downdup"] == "2") {
                        this.props.form.setFieldsValue({
                            downdup:1,
                            downdupmode: `${parseFloat(values["downdup"],10)-1}`
                        })
                    }
                });
                this.props.form.resetFields();
            }
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let req_items = this.handlePvalue();
                let clearmode = this.props.form.getFieldValue('clearoldlistmode')
                let replacemode = this.props.form.getFieldValue('downdupmode')
                if(this.props.form.getFieldValue('clearold') == 1 ) {
                    values['clearold'] = `${parseFloat(clearmode,10)+1}`
                } else {
                    values['clearold'] = `${parseFloat(clearmode,10)-1}`
                }
                if(this.props.form.getFieldValue('downdup') == 1 ) {
                    values['downdup'] = `${parseFloat(replacemode,10)+1}`
                } else {
                    values['downdup'] = `${parseFloat(replacemode,10)-1}`
                }
                this.props.setItemValues(req_items, values);
            }
        });
     }

     handleDownloadContacts = () => {
         if( document.all.downserver.value == "" ){
            this.props.promptMsg("ERROR", "a_19640");
            return false;
         }
         let values = this.props.form.getFieldsValue();
         let req_items = this.handlePvalue();
         this.props.saveDownContactsParams(req_items,values,0,this.cb_put_downphbk,1)
     }

    cb_put_downphbk = (flag) => {
        let tempinterval = this.props.form.getFieldValue('phbkdowninterval');
        if(tempinterval == "") { tempinterval = 0; }
        let data = "&downInterval=" + tempinterval + "&downType=" + "0" + "&downEncode=" + this.props.form.getFieldValue('downencodetype') + "&Username=" + this.props.form.getFieldValue('httpsusername')+ "&passWord=" + this.props.form.getFieldValue('httpspass');
        let downConfig = this.getDownConfig(flag)
        this.props.cb_put_download_param('putdownphbk', flag, data,document.all.downserver.value,downConfig, this.cb_alert_response);
    }

    cb_alert_response = (msgs,flag) => {
        let response = msgs.headers["phbkresponse"];
        let phbkprogress = msgs.headers["phbkprogress"];
        let max = msgs.headers["max"];
        let value = Math.floor((phbkprogress/max).toFixed(2) * 100);

        if(Number(response) > 2 && flag == 1){
            Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_3325'}});
            this.props.progressMessage(value,'none',this.tr('a_3325'));
        }
        switch(response) {
            case '0':
    		case '1':
    		    value = 0;
            case '2':
    		    setTimeout(()=>{this.props.cb_get_down_response(flag,this.cb_alert_response)},3000);
                this.props.progressMessage(value,'block',this.tr('a_3325'));
    		    break;
            case '3':
                this.props.promptMsg("SUCCESS", "a_downsuc");
    			break;
    		case '4':
                let errorCode = phbkprogress;
                let errorMessage = 'a_3315';
                if(errorCode == 4) {
                    errorMessage = 'a_19641';
                } else if (errorCode == 15) {
                    errorMessage = 'a_19642';
                } else if (errorCode == 22) {
                    errorMessage = 'a_19643';
                }
                this.props.promptMsg("ERROR", errorMessage);
                break;
    		default:
    	}
    }

    getDownConfig = (flag) => {
        if(flag == 1) {
            //window.parent.block_download_func();
        }
        let downmode = 0;
        switch (this.props.form.getFieldValue('downmode')) {
            case "1":
                downmode = 1;
                break;
            case "2":
                downmode = 2;
                break;
            case "3":
                downmode = 3;
                break;
            default:
        }
        let redup = 0,clearold = 0;
        if(this.props.form.getFieldValue('downdup')) {
            if(parseInt(this.props.form.getFieldValue('downdupmode'))) {
                redup = 2;
            } else {
                redup = 1;
            }
        }
        if(this.props.form.getFieldValue('clearold')) {
            if(parseInt(this.props.form.getFieldValue('clearoldlistmode'))) {
                clearold = 2;
            } else {
                clearold = 1;
            }
         }
        return [downmode,redup,clearold]
    }

    handlePwdVisible1 = () => {
        this.setState({pwdstatus1: this.state.pwdstatus1 == "password" ? "text" : "password"});
    }

    handleDownModeChange = (e) => {
        if(e.target.value == "0") {
            this.setState({disabled3:true})
        } else {
            this.setState({disabled3:false})
        }
        if(e.target.value == "1") {
            Array.from(document.querySelectorAll('.httpuser')).map((item)=>{
                item.style.display = 'none';
            })
        } else {
            Array.from(document.querySelectorAll('.httpuser')).map((item)=>{
                item.style.display = 'block';
            })
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const [callTr,itemValues] = [this.props.callTr,this.props.itemValues];
        if(this.props.isEmptyObject(this.props.itemValues)) {
            return null;
        }

        let itemList =
            <Form>
                <FormItem label={(<span>{callTr("a_16485")}&nbsp;<Tooltip title={this.tips_tr("Clear The Old List ")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('clearold', {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemValues.clearold)
                        })(
                            <Checkbox onClick={this.handleVisibleType.bind(this,"clearold")} className="P-1435"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_19645")}&nbsp;<Tooltip title={this.tips_tr("Clear Old History Mode ")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('clearoldlistmode', {
                        initialValue: "0"
                        })(
                            <RadioGroup disabled = {this.state.disabled1}>
                                <Radio value="0">{callTr("a_19646")}</Radio>
                                <Radio value="1">{callTr("a_19647")}</Radio>
                            </RadioGroup>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_19648")}&nbsp;<Tooltip title={this.tips_tr("Replace Duplicate Items ")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('downdup', {
                        valuePropName: 'checked',
                        initialValue: parseInt(itemValues.downdup)
                        })(
                            <Checkbox onClick={this.handleVisibleType.bind(this,"downdup")} className="P-1436"/>
                    )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_19649")}&nbsp;<Tooltip title={this.tips_tr("Replace Duplicate Entries Mode ")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                {getFieldDecorator('downdupmode', {
                    initialValue: "0"
                    })(
                        <RadioGroup disabled = {this.state.disabled2}>
                            <Radio value="0">{callTr("a_19650")}</Radio>
                            <Radio value="1">{callTr("a_19651")}</Radio>
                        </RadioGroup>
                )}
                </FormItem>
                <FormItem label={(<span>{callTr("a_4765")}&nbsp;<Tooltip title={this.tips_tr("Download Mode")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('downmode', {
                        initialValue: this.props.itemValues['downmode'] ? this.props.itemValues['downmode'] : "0"
                    })(
                        <RadioGroup onChange={this.handleDownModeChange} className="P-330">
                            <Radio value = "0">{callTr("a_downoff")}</Radio>
                            <Radio value = "1">TFTP</Radio>
                            <Radio value = "2">HTTP</Radio>
                            <Radio value = "3">HTTPS</Radio>
                        </RadioGroup>
                    )
                    }
                </FormItem>
                <FormItem className = "select-item" label={(<span>{callTr("a_4755")}&nbsp;<Tooltip title={this.tips_tr("File Encoding")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('downencodetype', {
                         initialValue: this.props.itemValues['downencodetype'] ? this.props.itemValues['downencodetype'] : "UTF-8"
                         })(
                             <Select className="P-1681">
                                 <Option value="UTF-8">UTF-8</Option>
                                 <Option value="GBK">GBK</Option>
                                 <Option value="UTF-16">UTF-16</Option>
                                 <Option value="UTF-32">UTF-32</Option>
                                 <Option value="Big5">Big5</Option>
                                 <Option value="Big5-HKSCS">Big5-HKSCS</Option>
                                 <Option value="Shift-JIS">Shift-JIS</Option>
                                 <Option value="ISO8859-1">ISO8859-1</Option>
                                 <Option value="ISO8859-15">ISO8859-15</Option>
                                 <Option value="Windows-1251">Windows-1251</Option>
                                 <Option value="EUC-KR">EUC-KR</Option>
                             </Select>
                    )}
           　　　</FormItem>
                <FormItem label={(<span>{callTr("a_4766")}&nbsp;<Tooltip title={this.tips_tr("Download Server")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('downserver', {
                       rules: [{
                           max:64,message: callTr("a_19632"),
                       },{
                           validator: (data, value, callback) => {
                               this.checkaddressPath(data, value, callback)
                           }
                       }],
                       initialValue: this.props.itemValues['downserver']
                       })(
                           <Input type="text" className="P-331"/>
                   )}
               </FormItem>
              <FormItem className='httpuser' label={(<span>{callTr("a_4111")}&nbsp;<Tooltip title={this.tips_tr("Config HTTP/HTTPS User Name")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                 <Input type="text" name = "httpsusername1" style= {{display:"none"}} disabled autoComplete = "off"/>
                 {getFieldDecorator('httpsusername', {
                     rules: [{
                         max:64,message: callTr("a_19632"),
                     }],
                     initialValue: this.props.itemValues['httpsusername']
                     })(
                         <Input type="text" name="httpsusername1" className="P-6713"/>
                 )}
             </FormItem>
             <FormItem className='httpuser' label={(<span>{callTr("a_4112")}&nbsp;<Tooltip title={this.tips_tr("Config HTTP/HTTPS Password")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                <Input type={this.state.pwdstatus1} name = "httpspass1" style= {{display:"none"}} disabled autoComplete = "off"/>
                {getFieldDecorator('httpspass', {
                    rules: [{
                        max:64,message: callTr("a_19632"),
                    }],
                    initialValue: this.props.itemValues['httpspass']
                    })(
                        <Input type={this.state.pwdstatus1} name="httpspass1" className="P-6714" suffix={<Icon type="eye" className={this.state.pwdstatus1} onClick={this.handlePwdVisible1} />}/>
                )}
            </FormItem>
            <FormItem className = "select-item" label={(<span>{callTr("a_19652")}&nbsp;<Tooltip title={this.tips_tr("Download Interval")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                {getFieldDecorator('phbkdowninterval', {
                     initialValue: this.props.itemValues['phbkdowninterval'] ? this.props.itemValues['phbkdowninterval'] : "0"
                     })(
                         <Select className="P-332">
                             <Option value="0">{callTr("a_20")}</Option>
                             <Option value="120">{callTr("a_2hour")}</Option>
                             <Option value="240">{callTr("a_4hour")}</Option>
                             <Option value="360">{callTr("a_6hour")}</Option>
                             <Option value="480">{callTr("a_8hour")}</Option>
                             <Option value="720">{callTr("a_12hours")}</Option>
                         </Select>
                )}
       　　　</FormItem>
           <FormItem label={(<span>{callTr("a_20029")}&nbsp;<Tooltip title={ this.tips_tr("Download Now")}><Icon type="question-circle-o" /></Tooltip></span>)}>
               <Button type="primary" onClick={this.handleDownloadContacts} disabled = {this.state.disabled3}>{callTr("a_28")}</Button>
           </FormItem>
           <FormItem>
               <Button type="primary" className="submit" size="large" onClick={this.handleSubmit}>{callTr("a_17")}</Button>
           </FormItem>
        </Form>;

        let hideItem = this.props.hideItem;
        for (var i = hideItem.length-1; i>=0; i--) {
            itemList.props.children.splice(hideItem[i], 1);
        }
        return itemList;
    }
}

//export default DownloadContactsForm;
const mapStateToProps = (state) => ({
    itemValues:state.itemValues,
    activeKey: state.TabactiveKey
})
function mapDispatchToProps(dispatch) {
  var actions = {
      promptMsg:Actions.promptMsg,
      setItemValues:Actions.setItemValues,
      getItemValues:Actions.getItemValues
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DownloadContactsForm));
