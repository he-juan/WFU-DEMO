import React, { Component, PropTypes } from 'react'
import Enhance from "../../../mixins/Enhance";
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Layout, Row, Col, Input, Radio, Icon, Tooltip, Checkbox, Select,Button,Upload, message, Modal } from "antd";
import * as Store from '../../../entry'
const FormItem = Form.Item;
const Content = Layout;
const RadioGroup = Radio.Group
const Option = Select.Option;
let req_items = new Array;
let acctname_item = ['270','417','517','617','1717','1817',"50617","50717","50817","50917","51017","51117","51217","51317","51417","51517"];
const nvram = {
    'checkdomain' : ["2311", "2411", "2511", "2611", "2711", "2811","51611","51711","51811","51911","52011","52111","52211","52311","52411","52511"],
    'validatecert' : ["2367", "2467", "2567", "2667", "2767", "2867","51667","51767","51867","51967","52067","52167","52267","52367","52467","52567"],
    'validincommsg' : ["2306", "2406", "2506", "2606", "2706", "2806","51606","51706","51806","51906","52006","52106","52206","52306","52406","52506"],
    'allowrefer' : ["26023", "26123", "26223", "26323", "26423", "26523","52623","52723","52823","52923","53023","53123","53223","53323","53423","53523"],
    'accpsip' : ["2347", "2447", "2547", "2647", "2747", "2847","51647","51747","51847","51947","52047","52147","52247","52347","52447","52547"],
    'checkinvite' : ["258", "449", "549", "649", "1749", "1849","50649","50749","50849","50949","51049","51149","51249","51349","51449","51549"],
    'sipreset' : ["26015", "26115", "26215", "26315", "26415", "26515","52615","52715","52815","52915","53015","53115","53215","53315","53415","53515"],
    'authinvite' : ["2346", "2446", "2546", "2646", "2746", "2846","51646","51746","51846","51946","52046","52146","52246","52346","52446","52546"],
    'challenge' : ["26021","26121", "26221", "26321", "26421", "26521","52621", "52721","52821","52921","53021","53121","53221","53321","53421","53521"],
    'enablemoh' : ["2357", "2457", "2557", "2657", "2757", "2857","51657","51757","51857","51957","52057","52157","52257","52357","52457","52557"],
    'group' : ["2391", "2491", "2591", "2691", "2791", "2891","51691","51791","51891","51991","52091","52191","52291","52391","52491","52591"],
    'spefea' : ["198", "424", "524", "624", "1724", "1824","50624","50724","50824","50924","51024","51124","51224","51324","51424","51524"]
};

class AdvancedForm extends React.Component {
    constructor(props) {
      super(props);
      let defalutFileList = window.localStorage.getItem("fileList"+this.props.curAccount)
      this.state = {fileList:JSON.parse(defalutFileList)}
    }

    handlePvalue = (activeAccount) => {
         let curAccount = activeAccount ? activeAccount : this.props.curAccount;
         req_items = [];
         req_items.push(
             this.getReqItem("checkdomain", nvram["checkdomain"][curAccount], ""),
             this.getReqItem("validatecert", nvram["validatecert"][curAccount], ""),
             this.getReqItem("validincommsg", nvram["validincommsg"][curAccount], ""),
             this.getReqItem("allowrefer", nvram["allowrefer"][curAccount], ""),
             this.getReqItem("accpsip", nvram["accpsip"][curAccount], ""),
             this.getReqItem("checkinvite", nvram["checkinvite"][curAccount], ""),
             this.getReqItem("sipreset", nvram["sipreset"][curAccount], ""),
             this.getReqItem("authinvite", nvram["authinvite"][curAccount], ""),
             this.getReqItem("challenge"+curAccount, nvram["challenge"][curAccount], ""),
             this.getReqItem("enablemoh", nvram["enablemoh"][curAccount], ""),
             this.getReqItem("group", nvram["group"][curAccount], ""),
             this.getReqItem("spefea", nvram["spefea"][curAccount], "")
         );
         for(var i = 0 ;i<acctname_item.length;i++) {
             req_items.push(this.getReqItem("name"+i, acctname_item[i], ""))
         }
         return req_items;
    }

    componentWillMount = () => {
        switch (this.props.product) {
            case "GXV3380":
            case "GXV3370":
                break;
            case "WP800":
            case "WP820":
            default:
                acctname_item.splice(2,acctname_item.length-1)
        }
    }


    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            this.handleSpefeaChange(values["spefea"]);
        });
    }



    handleCheckboxGroup = (values) => {
        let dialplancheck = `${Number(values['dismpkclick'])}`+`${Number(values['disoutgoing'])}`+`${Number(values['disincoming'])}`+`${Number(values['discontact'])}`+`${Number(values['disdialpage'])}`;
        delete values['dismpkclick']
        delete values['disoutgoing']
        delete values['disincoming']
        delete values['discontact']
        delete values['disdialpage']
        dialplancheck = dialplancheck.replace(/NaN/g,'0')
        dialplancheck = parseInt(dialplancheck, 2)
        values["dialplancheck"] = dialplancheck
        return values;
    }

    tobinChange = (n) => {
        if(!isNaN(n) && n>0)
        {
            if(n%2==0) {
                return this.tobinChange(n/2)+"0";
            } else {
                if(n>2) {
                    return this.tobinChange(parseInt(n/2))+(n%2);
                } else {
                    return this.tobinChange(0)+n;
                }
            }
        } else {
            return "";
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed or selected account changed
            if (this.props.activeKey != nextProps.activeKey
                || this.props.curAccount != nextProps.curAccount) {
                this.props.getItemValues(this.handlePvalue(nextProps.curAccount), (values) => {
                    this.handleSpefeaChange(values["spefea"]);
                });
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }

        let defalutFileList = window.localStorage.getItem("fileList"+nextProps.curAccount)
        this.setState({fileList:JSON.parse(defalutFileList)})
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values = this.handleCheckboxGroup(values)
                let req_items = this.handlePvalue();
                req_items.forEach((item,index,items) => {
                    if(index < acctname_item.length ) {
                        items.pop()
                    } else {
                        return false;
                    }
                })
                this.props.setItemValues(req_items, values,1);
            }
        });
     }

     beforeUploadhandle = (file, fileList) => {
        return new Promise((resolve, reject) => {
            this.props.cb_ping();
            let name = file.name
            let ext = name.slice(name.lastIndexOf(".")+1)
            if (!(ext && (/^(wav)$/.test(ext) || /^(mp3)$/.test(ext)))) {
                Modal.info({
                    content: <span dangerouslySetInnerHTML={{__html: this.tr("ext_wrong")}}></span>,
                    okText: <span dangerouslySetInnerHTML={{__html: this.tr("a_2")}}></span>,
                    onOk() {},
                });
                reject();
            } else {
                resolve(file);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const [callTr,itemValues] = [this.props.callTr,this.props.itemValues];
        const curAccount = this.props.curAccount;
        let self = this;
        const UploadMOHfileProps = {
            name: 'file',
            showUploadList: false,
            action: '../upload?type=audiofile&acct=' + curAccount ,
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
                    Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_9348'}});
                    window.localStorage.setItem("fileList"+curAccount,JSON.stringify(fileList))
                    let fileext = info.file.name.slice(name.lastIndexOf(".")+1)
                    self.props.cb_audio_upload(fileext,curAccount,(label,type)=>{
                        Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-hidden", spinTip: 'a_9348'}});
                        Modal.info({
                            content: <span dangerouslySetInnerHTML={{__html: self.tr(label)}}></span>,
                            okText: <span dangerouslySetInnerHTML={{__html: self.tr('a_2')}}></span>,
                            onOk() {},
                        });
                    })
                } else if (info.file.status === 'error') {
                    message.error(callTr('a_16477'));
                }
            },
            beforeUpload: self.beforeUploadhandle,
            onRemove() {
                message.destroy();
                window.localStorage.removeItem("fileList"+curAccount);
                return true;
            }
        };

       let itemList =
           <Form hideRequiredMark>
               <p className="blocktitle"><s></s>{callTr("a_4221")}</p>
               <FormItem  label={(<span>{callTr("a_16102")}&nbsp;<Tooltip title={this.tips_tr("Check Domain Certificates")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('checkdomain', {
                       valuePropName: 'checked',
                       initialValue: parseInt(itemValues['checkdomain'])
                       })(
                           <Checkbox className={"P-" + nvram["checkdomain"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_19336")}&nbsp;<Tooltip title={this.tips_tr("Validate Certification Chain")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('validatecert', {
                       valuePropName: 'checked',
                       initialValue: parseInt(itemValues['validatecert'])
                       })(
                           <Checkbox className={"P-" + nvram["validatecert"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16098")}&nbsp;<Tooltip title={this.tips_tr("Validate Incoming SIP Messages")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('validincommsg', {
                       valuePropName: 'checked',
                       initialValue: parseInt(itemValues['validincommsg'])
                       })(
                           <Checkbox className={"P-" + nvram["validincommsg"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_allowrefer")}&nbsp;<Tooltip title={this.tips_tr("Allow Unsolicited REFER")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('allowrefer', {
                       initialValue: itemValues['allowrefer']
                       })(
                           <Select className={"P-" + nvram["allowrefer"][curAccount]}>
                               <Option value="0">{callTr("a_disabled")}</Option>
                               <Option value="1">{callTr("a_enabled1")}</Option>
                               <Option value="2">{callTr("a_enableandforce")}</Option>
                           </Select>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16080")}&nbsp;<Tooltip title={this.tips_tr("Only Accept SIP Requests from Known Servers")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('accpsip', {
                       valuePropName: 'checked',
                       initialValue: parseInt(itemValues['accpsip'])
                       })(
                           <Checkbox className={"P-" + nvram["accpsip"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16078")}&nbsp;<Tooltip title={this.tips_tr("Check SIP User ID for Incoming INVITE")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('checkinvite', {
                       valuePropName: 'checked',
                       initialValue: parseInt(itemValues['checkinvite'])
                       })(
                           <Checkbox className={"P-" + nvram["checkinvite"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_sipreset")}&nbsp;<Tooltip title={this.tips_tr("Allow SIP Reset")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('sipreset', {
                       valuePropName: 'checked',
                       initialValue: parseInt(itemValues['sipreset'])
                       })(
                           <Checkbox className={"P-" + nvram["sipreset"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_authinvite")}&nbsp;<Tooltip title={this.tips_tr("Authenticate Incoming INVITE")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('authinvite', {
                       valuePropName: 'checked',
                       initialValue: parseInt(itemValues['authinvite'])
                   })(
                       <Checkbox className={"P-" + nvram["authinvite"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_challenge")}&nbsp;<Tooltip title={ this.tips_tr("SIP realm used for challenge INVITE & NOTIFY")} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('challenge'+curAccount, {
                       rules: [{
                           max:64,message: callTr("a_19632"),
                       }],
                       initialValue: itemValues['challenge'+curAccount]
                   })(
                       <Input type="text" className={"P-" + nvram["challenge"][curAccount]}/>
                   )}
               </FormItem>
               <p className="blocktitle"><s></s>MOH</p>
               <FormItem  label={(<span>{callTr("a_16180")}&nbsp;<Tooltip title={ this.tips_tr("Upload Local MOH Audio File")} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                    <Upload {...UploadMOHfileProps} fileList={this.state.fileList}>
                        <Button>
                            <Icon type="upload" /> {this.tr("a_16486")}
                        </Button>
                    </Upload>
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16181")}&nbsp;<Tooltip title={this.tips_tr("Enable Local MOH")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablemoh', {
                       valuePropName: 'checked',
                       initialValue: parseInt(itemValues['enablemoh'])
                       })(
                           <Checkbox className={"P-" + nvram["enablemoh"][curAccount]}/>
                   )}
               </FormItem>
               <p className="blocktitle"><s></s>{callTr("a_advancedcallfun")}</p>
               <FormItem className = "select-item"  label={(<span>{callTr("a_group")}&nbsp;<Tooltip title={this.tips_tr("Virtual Account Group")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('group', {
                       initialValue: itemValues['group'] ? itemValues['group'] : "-1"
                       })(
                           <Select className={"P-" + nvram["group"][curAccount]}>
                               <Option value="-1">{callTr("a_12")}</Option>
                               {
                                   acctname_item.map((val,i,arr) => {
                                       if(i==15 && this.props.ipvtExist == '1'){
                                           return <Option value={`${i}`} style={{display:'none'}}></Option>
                                       } else {
                                           return <Option value={`${i}`}>{callTr("a_group")+` ${i+1}`}</Option>
                                       }

                                   })
                               }
                           </Select>
                   )}
               </FormItem>
               <FormItem className="select-item" label={(<span>{callTr("a_16161")}&nbsp;<Tooltip title={this.tips_tr("Special Feature")}><Icon type="question-circle-o"/></Tooltip></span>)}>
                   {getFieldDecorator('spefea', {
                       initialValue: parseInt(itemValues['spefea']) ? itemValues['spefea'] : "100"
                   })(
                       <Select onChange={this.handleSpefeaChange} className={"P-" + nvram["spefea"][curAccount]}>
                           <Option value="100">{callTr("a_16109")}</Option>
                           <Option value="102">BroadSoft</Option>
                           <Option value="113">China Mobile</Option>
                           <Option value="114">ZTE IMS</Option>
                           <Option value="115">Mobotix</Option>
                           <Option value="116">ZTE NGN</Option>
                           <Option value="117">{callTr("a_16163")}</Option>
                           <Option value="123">NEC</Option>
                           <Option value="125">WorldStone</Option>
                       </Select>
                   )}
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

const mapDispatchToProps = (dispatch) => {
    const actions = {
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(AdvancedForm));
