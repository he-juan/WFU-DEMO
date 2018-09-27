import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Input, Icon, Tooltip, Checkbox, Select, Button, Radio,Row, Col, Upload, message, Modal } from "antd";
import * as Store from '../../../entry'
import * as Actions from "../../../redux/actions";
import {bindActionCreators} from "redux";
const FormItem = Form.Item;
const Content = Layout;
const RadioGroup = Radio.Group;
const Option = Select.Option;
let req_items = new Array;
let acctname_item = ['270','417','517','617','1717','1817',"50617","50717","50817","50917","51017","51117","51217","51317","51417","51517"];
const nvram = {
    'remotevideo' : "2326",  // 远程视频请求
    'prefix' : "66",                 // 拨号前缀
    'dialplancheck' : "2382",        //  禁用拨号规则
    'dialplan' : "290",              // 拨号规则
    'autoanswer' : "90",     // 自动应答
    'sendanony' : "65",      // 发送匿名
    'anonyrej' : "129",      // 拒绝匿名呼叫
    'calllog' : "182",       // 呼叫日志
    'spefea' : "198" ,       // 新增 特殊模式
    'feakey' : "2325",      // 新增 功能键同步
    'enablefea' : "191",     // 激活呼叫功能
    'dialkey' : "72",        // #拨号
    'ringto' : "1328",       // 振铃超时时间
    'targetcon' : "135",     // 使用Refer-To报文头转移
    'enablemoh' : "2357",    // 新增 开启本地MOH功能
    /**呼叫转移 */
    'cftype' : "display_0",  // 呼叫转移类型
    'uccf' : "allTo_0",            // 呼叫转移-无条件到
    'timecffrom' : "starttime_0",     // 起始时间
    'timecfto' : "finishtime_0",      // 结束时间
    'intimeto' : "inTimeForward_0",    //  时间段内转移到
    'outtimeto' : "outTimeForward_0",         // 时间段外转移到
    'enablebusyto' : "busyForwardEnable_0",   // 开启遇忙转移
    'busyto' : "busyForward_0",                    // 本地忙到
    'enablenoanswerto' : "delayedForwardEnable_0",   // 开启无应答转移
    'noanswerto' : "delayedForward_0",               // 无应答到
    'forwardwt' : "139",                             // 无应答超时时间
    'enabledndforward': "dndForwardEnable_0",        //开启勿扰转移
    'dndto': 'dndForward_0',                       // 勿扰时到



    /**铃声 */
    'defaultringtone' : "104",       // 账号默认铃声
    'callerid1' : "1488",
    'tonename1' : "1489",
    'callerid2' : "1490",
    'tonename2' : "1491",
    'callerid3' : "1492",
    'tonename3' : "1493"


};

var children = [];

class CallForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {autoanswer:'0'}
      this.handlePvalue();
    }

    handlePvalue = () => {
         req_items = [];
         req_items.push(
             this.getReqItem("remotevideo", nvram["remotevideo"], ""),
             this.getReqItem("autoanswer", nvram["autoanswer"], ""),
             this.getReqItem("sendanony", nvram["sendanony"], ""),
             this.getReqItem("anonyrej", nvram["anonyrej"], ""),
             this.getReqItem("calllog", nvram["calllog"], ""),
             this.getReqItem("spefea", nvram["spefea"], ""),
             this.getReqItem("feakey", nvram["feakey"], ""),
             this.getReqItem("enablefea", nvram["enablefea"], ""),
             this.getReqItem("ringto", nvram["ringto"], ""),
             this.getReqItem("targetcon", nvram["targetcon"], ""),
             this.getReqItem("enablemoh", nvram["enablemoh"], ""),
             this.getReqItem("cftype", nvram["cftype"], ""),
             this.getReqItem("uccf", nvram["uccf"], ""),
             this.getReqItem("timecffrom", nvram["timecffrom"], ""),
             this.getReqItem("timecfto", nvram["timecfto"], ""),
             this.getReqItem("intimeto", nvram["intimeto"], ""),
             this.getReqItem("outtimeto", nvram["outtimeto"], ""),
             this.getReqItem("enablebusyto", nvram["enablebusyto"], ""),
             this.getReqItem("busyto", nvram["busyto"], ""),
             this.getReqItem("enablenoanswerto", nvram["enablenoanswerto"], ""),
             this.getReqItem("noanswerto", nvram["noanswerto"], ""),
             this.getReqItem("forwardwt", nvram["forwardwt"], ""),
             this.getReqItem("enabledndforward", nvram["enabledndforward"], ""),
             this.getReqItem("dndto", nvram["dndto"], ""),
             this.getReqItem("prefix", nvram["prefix"], ""),
             this.getReqItem("dialplancheck", nvram["dialplancheck"], ""),
             this.getReqItem("dialplan", nvram["dialplan"], ""),
             this.getReqItem("defaultringtone", nvram["defaultringtone"], ""),
             this.getReqItem("callerid1", nvram["callerid1"], ""),
             this.getReqItem("tonename1", nvram["tonename1"], ""),
             this.getReqItem("callerid2", nvram["callerid2"], ""),
             this.getReqItem("tonename2", nvram["tonename2"], ""),
             this.getReqItem("callerid3", nvram["callerid3"], ""),
             this.getReqItem("tonename3", nvram["tonename3"], ""),
             this.getReqItem("dialkey", nvram["dialkey"], "")
         );
        if(this.props.userType == 'user') {
            req_items = req_items.slice(-13)
            return req_items;
        }

         if (this.props.oemId != "54") {
             req_items.push(this.getReqItem("autoanswer", nvram["autoanswer"], ""));
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

        this.props.getTonelist("tonelist", (data)=> {
            this.getTonelistDone(data);
        });
    }

    getTonelistDone = (data) => {
        if( data.substring(0,1) == '{' ) {
            let json = eval("(" + data + ")");
            let ringtone = json.Ringtone;
            ringtone = ringtone.sort((a,b) => {
                return a.toLowerCase() > b.toLowerCase();
            });
            for (let i = 0; ringtone[i] != undefined; i++) {
                let indexdot = ringtone[i].lastIndexOf(".");
			    let ringname = ringtone[i].substring(0, indexdot);
                children.push(<Option value = {'/system/media/audio/ringtones/' + ringtone[i]}>{this.htmlEncode(ringname)}</Option>);
            }
        }
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            this.hanleCallTransferType(values["cftype"]);
            this.handleAutoAnswer(values["autoanswer"]);
        });
        this.hanleCallTransferType('None');
    }

    handleSetautoAnswerEnable = (curAccount, values) => {
        if (values.autoanswer == "1" || values.autoanswer == "2" || values.autoanswer == "3") {
            values["autoanswerEnabled"] = "1";
        } else {
            values["autoanswerEnabled"] = "0";
        }
        return values;
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

    tobinary = (n) => {
        var binstr = this.tobinChange(n);
        while( binstr.length % 5 != 0 ) {
            binstr = "0" + binstr;
        }
        return binstr;
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
            if (this.props.activeKey != nextProps.activeKey) {
                this.props.getItemValues(this.handlePvalue(), (values) => {
                    this.hanleCallTransferType(values["cftype"]);
                    this.handleAutoAnswer(values["autoanswer"]);
                });
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleAutoAnswer = (val) => {
        this.setState({autoanswer:val})
    }

    hanleCallTransferType = (val) => {
        const { setFieldsValue } = this.props.form
        Array.from(document.getElementsByClassName('None')).forEach((item) => {
            item.style.display = "none"
        })
        switch (val) {
            case "allTo":
                document.getElementsByClassName('AllTo')[0].style.display = "block"
                setFieldsValue({cftype:'allTo'})
                break;
            case "TimeRule":
                Array.from(document.getElementsByClassName('TimeRule')).forEach((item) => {
                    item.style.display = "block"
                })
                setFieldsValue({cftype:'TimeRule'})
                break;
            case "WorkRule":
                Array.from(document.getElementsByClassName('WorkRule')).forEach((item) => {
                    item.style.display = "block"
                });
                setFieldsValue({cftype:'WorkRule'})
                break;
            case "None":
            case "NONE":
            default:
                setFieldsValue({cftype:'None'})
                break;


        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            //   let curAccount = this.props.curAccount;
              let curAccount = 1;
              this.props.cb_set_autoanswer(curAccount,values['autoanswer']);
              switch (values['cftype']) {
                  case 'allTo':
                      this.props.cb_set_callforward(curAccount,values['cftype'],values['uccf'])
                      break;
                  case 'TimeRule':
                      this.props.cb_set_callforward(curAccount,values['cftype'],values['timecffrom'],values['timecfto'],values['intimeto'],values['outtimeto'])
                      break;
                  case 'WorkRule':
                      this.props.cb_set_callforward(curAccount,values['cftype'],Number(values['enablebusyto']),values['busyto'],Number(values['enablenoanswerto']),values['noanswerto'],values['forwardwt'],Number(values['enabledndforward']),values['dndto'])
                      break;
                  default:
                      this.props.cb_set_callforward(curAccount,values['cftype'])
                      break;
              }
              values = this.handleCheckboxGroup(values)
              values = this.handleSetautoAnswerEnable(curAccount, values);
              // let req_items = this.handlePvalue();
              // req_items.forEach((item,index,items) => {
              //     if(index < acctname_item.length ) {
              //         items.pop()
              //     } else {
              //         return false;
              //     }
              // })
              this.props.setItemValues(req_items, values,1);
          }
        });
     }

     checkoutTimeformat = (data, value, callback) => {
         const callTr = this.props.callTr;
         if (!value || (value && /^(0?\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/i.test(value))) {
             callback()
         } else {
             callback(callTr("tip_timeformat"))
         }
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
        const [callTr,itemValues,product] = [this.props.callTr,this.props.itemValues,this.props.product];

        let dialplancheck;
        if(itemValues.dialplancheck != undefined && !this.isEmptyObject(itemValues)) {
            dialplancheck = Number(itemValues.dialplancheck);
            dialplancheck = this.tobinary(dialplancheck)
            dialplancheck = dialplancheck.split("")
        } else {
            dialplancheck = [0,0,0,0,0]
        }

        let self = this;
        const UploadMOHfileProps = {
            name: 'file',
            showUploadList: false,
            action: '../upload?type=audiofile&acct=1',
            headers: {
                authorization: 'authorization-text'
            },
            onChange(info) {
                let fileList = info.fileList.slice(-1)
                self.setState({fileList:fileList})
                if (info.file.status == 'uploading') {
                    Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_16431'}});
                }
                if (info.file.status === 'done') {
                    Store.store.dispatch({type: 'MSG_PROMPT_SPIN', spinMsg: {spinStyle: "display-block", spinTip: 'a_9348'}});
                    window.localStorage.setItem("fileList",JSON.stringify(fileList))
                    let fileext = info.file.name.slice(name.lastIndexOf(".")+1)
                    self.props.cb_audio_upload(fileext,1,(label,type)=>{
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
                window.localStorage.removeItem("fileList");
                return true;
            }
        };
        let itemList =
           <Form>
               <FormItem className = "select-item"　 label={(<span>{callTr("a_16106")}&nbsp;<Tooltip title={this.tips_tr("Remote Video Request")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('remotevideo', {
                       initialValue: this.props.itemValues['remotevideo'] ? this.props.itemValues['remotevideo'] : "0"
                       })(
                           <Select className={"P-" + nvram["remotevideo"]}>
                               <Option value="0">{callTr("a_415")}</Option>
                               <Option value="1">{callTr("a_10000")}</Option>
                               <Option value="2">{callTr("a_16107")}</Option>
                           </Select>
                   )}
         　　　 </FormItem>

               <FormItem  label={(<span>{callTr("a_16149")}&nbsp;<Tooltip title={this.tips_tr("Dial Plan Prefix")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('prefix', {
                       rules: [{
                           max:64,message: callTr("a_19632"),
                       }],
                       initialValue: itemValues['prefix']
                   })(
                       <Input type="text" className={"P-" + nvram["prefix"]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16291")}&nbsp;<Tooltip title={this.tips_tr(this.isWP8xx() ? "Disable DialPlan For WP800" : "Disable DialPlan")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('disdialpage', {
                       valuePropName: 'checked',
                       initialValue: parseInt(dialplancheck[4])
                   })(
                       <Checkbox>{callTr("a_19369")}</Checkbox>
                   )}
                   {getFieldDecorator('discontact', {
                       valuePropName: 'checked',
                       initialValue: parseInt(dialplancheck[3])
                   })(
                       <Checkbox>{callTr("a_19370")}</Checkbox>
                   )}
                   {getFieldDecorator('disincoming', {
                       valuePropName: 'checked',
                       initialValue: parseInt(dialplancheck[2])
                   })(
                       <Checkbox>{callTr("a_19371")}</Checkbox>
                   )}
                   {getFieldDecorator('disoutgoing', {
                       valuePropName: 'checked',
                       initialValue: parseInt(dialplancheck[1])
                   })(
                       <Checkbox>{callTr("a_19372")}</Checkbox>
                   )}
                   {getFieldDecorator('dismpkclick', {
                       valuePropName: 'checked',
                       initialValue: parseInt(dialplancheck[0])
                   })(
                       <Checkbox>{callTr("a_321")} ＆ {callTr("a_19373")}</Checkbox>
                   )}

               </FormItem>
               <FormItem  label={(<span>{callTr("a_16150")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("DialPlan")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('dialplan', {
                       rules: [],
                       initialValue: itemValues['dialplan']
                   })(
                       <Input type="text" className={"P-" + nvram["dialplan"]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16154")}&nbsp;<Tooltip title={this.tips_tr("Refer-To Use Target Contact")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('targetcon', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues['targetcon'])
                   })(
                       <Checkbox />
                   )}
               </FormItem>
               <FormItem className = "select-item"　　label={(<span>{callTr("a_1102")}&nbsp;<Tooltip title={this.tips_tr("Auto Answer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('autoanswer', {
                       initialValue: this.props.itemValues['autoanswer'] ? this.props.itemValues['autoanswer'] : "0"
                       })(
                           <Select onChange={this.handleAutoAnswer} className={"P-" + nvram["autoanswer"]}>
                               <Option value="0">{callTr("a_6")}</Option>
                               <Option value="1">{callTr("a_5")}</Option>
                           </Select>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16155")}&nbsp;<Tooltip title={this.tips_tr("Send Anonymous")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('sendanony', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['sendanony'])
                    })(<Checkbox className={"P-" + nvram["sendanony"]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16156")}&nbsp;<Tooltip title={this.tips_tr("Anonymous Call Rejection")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('anonyrej', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['anonyrej'])
                    })(<Checkbox className={"P-" + nvram["anonyrej"]}/>)
                   }
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_16157")}&nbsp;<Tooltip title={this.tips_tr("Call Log")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('calllog', {
                       initialValue: this.props.itemValues['calllog'] ? this.props.itemValues['calllog'] : "0"
                       })(
                           <Select className={"P-" + nvram["calllog"]}>
                               <Option value="0">{callTr("a_16158")}</Option>
                               <Option value="1">{callTr("a_16159")}</Option>
                               <Option value="2">{callTr("a_16160")}</Option>
                           </Select>
                   )}
               </FormItem>
               <FormItem className="select-item" label={(<span>{callTr("a_16161")}&nbsp;<Tooltip title={this.tips_tr("Special Feature")}><Icon type="question-circle-o"/></Tooltip></span>)}>
                   {getFieldDecorator('spefea', {
                       initialValue: parseInt(itemValues['spefea']) ? itemValues['spefea'] : "100"
                   })(
                       <Select className={"P-" + nvram["spefea"]}>
                           <Option value="100">{callTr("a_16109")}</Option>
                           <Option value="102">BroadSoft</Option>
                           <Option value="108">CBCOM</Option>
                           <Option value="109">RNK</Option>
                           <Option value="113">{callTr("a_16162")}</Option>
                           <Option value="114">ZTE IMS</Option>
                           <Option value="115">Mobotix</Option>
                           <Option value="116">ZTE NGN</Option>
                           <Option value="117">{callTr("a_16163")}</Option>
                       </Select>
                   )}
               </FormItem>
               {/* 功能键同步 */}
               <FormItem className="select-item" label={(<span>{callTr("a_16164")}&nbsp;<Tooltip title={this.tips_tr("Special Feature")}><Icon type="question-circle-o"/></Tooltip></span>)}>
                   {getFieldDecorator('feakey', {
                       initialValue: parseInt(itemValues['feakey']) ? itemValues['feakey'] : "0"
                   })(
                       <Select className={"P-" + nvram["feakey"]}>
                           <Option value="0">{callTr("a_32")}</Option>
                           <Option value="1">Broadsoft</Option>
                       </Select>
                   )}
               </FormItem>

               <FormItem  label={(<span>{callTr("a_16165")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Enable Call Features")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablefea', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['enablefea'])
                    })(<Checkbox className={"P-" + nvram["enablefea"]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16169")}&nbsp;<Tooltip title={this.tips_tr("Ring Timeout")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('ringto', {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 0, 300)
                           }
                       }],
                       initialValue: this.props.itemValues['ringto']
                       })(
                           <Input type="text" className={"P-" + nvram["ringto"]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16171")}&nbsp;<Tooltip title={this.tips_tr("Use # as Dial Key")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('dialkey', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['dialkey'])
                    })(<Checkbox className={"P-" + nvram["dialkey"]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_16180")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Upload Local MOH Audio File")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
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
                           <Checkbox className={"P-" + nvram["enablemoh"]}/>
                   )}
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_16177")}&nbsp;<Tooltip title={this.tips_tr("Account Ring Tone")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('defaultringtone', {
                       initialValue: itemValues['defaultringtone'] ? itemValues['defaultringtone'] : 'content://settings/system/ringtone'
                   })(
                       <Select>
                           <Option value="content://settings/system/ringtone">{callTr("a_8421")}</Option>
                           <Option value="ringtone_silence">Silent</Option>
                           {children}
                       </Select>
                   )}
               </FormItem>

               <p className="blocktitle"><s></s>{callTr("a_16166")}</p>
               <FormItem className = "select-item"  label={(<span>{callTr("a_1104")}&nbsp;<Tooltip title={this.tips_tr("Call Forward Type")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('cftype', {
                       initialValue: this.props.itemValues['cftype'] ? this.props.itemValues['cftype'] : "None"
                       })(
                           <Select onChange = {this.hanleCallTransferType} className={"P-" + nvram["cftype"]}>
                               <Option value="None">{callTr("a_20")}</Option>
                               <Option value="allTo">{callTr("a_1106")}</Option>
                               <Option value="TimeRule">{callTr("a_1112")}</Option>
                               <Option value="WorkRule">{callTr("a_4369")}</Option>
                           </Select>
                   )}
               </FormItem>
               <FormItem  className = "alltoTtem None AllTo" label={(<span>{callTr("a_1107")}&nbsp;<Tooltip title={this.tips_tr("All To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('uccf', {
                       rules: [{
                           max:64,message: callTr("a_19632"),
                       }],
                       initialValue: this.props.itemValues['uccf']
                       })(
                           <Input type="text" className={"P-" + nvram["uccf"]}/>
                   )}
               </FormItem>
               <FormItem  className = "timecfItem None TimeRule" label={(<span>{callTr("a_16167")}&nbsp;<Tooltip title={this.tips_tr("Time Period")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   <FormItem>
                       {getFieldDecorator('timecffrom', {
                           rules: [{
                               validator: (data, value, callback) => {
                                   this.checkoutTimeformat(data, value, callback)
                               }
                           }],
                           initialValue: this.props.itemValues['timecffrom'] ? this.props.itemValues['timecffrom'] : '09:00'
                           })(
                               <Input type="text" className={"short-input"+" "+"P-" + nvram["timecffrom"]}/>
                       )}
                   </FormItem>
                   <div style={{'float':'left', 'margin-right':'15px'}}>~</div>
                   <FormItem>
                       {getFieldDecorator('timecfto', {
                           rules: [{
                               validator: (data, value, callback) => {
                                   this.checkoutTimeformat(data, value, callback)
                               }
                           }],
                           initialValue: this.props.itemValues['timecfto'] ? this.props.itemValues['timecfto'] : '21:00'
                           })(
                             <Input type="text" className={"short-input"+" "+"P-" + nvram["timecfto"]}/>
                       )}
                   </FormItem>
               </FormItem>
               <FormItem  className = "intimetoItem None TimeRule" label={(<span>{callTr("a_1115")}&nbsp;<Tooltip title={this.tips_tr("In Time Forward To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('intimeto', {
                       rules: [{
                           max:64,message: callTr("a_19632"),
                       }],
                       initialValue: this.props.itemValues['intimeto']
                       })(
                           <Input type="text" className={"P-" + nvram["intimeto"]}/>
                   )}
               </FormItem>
               <FormItem  className = "outtimetoItem None TimeRule" label={(<span>{callTr("a_1116")}&nbsp;<Tooltip title={this.tips_tr("Out Time Forward To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('outtimeto', {
                       rules: [{
                           max:64,message: callTr("a_19632"),
                        }],
                        initialValue: this.props.itemValues['outtimeto']
                        })(
                           <Input type="text" className={"P-" + nvram["outtimeto"]}/>
                   )}
               </FormItem>
               <FormItem  className = "enablebusytoItem None WorkRule" label={(<span>{callTr("a_19114")}&nbsp;<Tooltip title={this.tips_tr("Enable Busy Forward")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablebusyto', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['enablebusyto'])
                    })(<Checkbox className={"P-" + nvram["enablebusyto"]}/>)
                   }
               </FormItem>
               <FormItem  className = "busytoItem None WorkRule" label={(<span>{callTr("a_1109")}&nbsp;<Tooltip title={this.tips_tr("Busy To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('busyto', {
                       rules: [{
                           max:64,message: callTr("a_19632"),
                       }],
                       initialValue: this.props.itemValues['busyto']
                       })(
                           <Input type="text" className={"P-" + nvram["busyto"]}/>
                   )}
               </FormItem>
               <FormItem  className = "enablenoanswertoItem None WorkRule" label={(<span>{callTr("a_19115")}&nbsp;<Tooltip title={this.tips_tr("Enable No Answer Forward")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablenoanswerto', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['enablenoanswerto'])
                    })(<Checkbox className={"P-" + nvram["enablenoanswerto"]}/>)
                   }
               </FormItem>
               <FormItem  className = "noanswertoItem None WorkRule" label={(<span>{callTr("a_1110")}&nbsp;<Tooltip title={this.tips_tr("No Answer To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('noanswerto', {
                       rules: [{
                           max:64,message: callTr("a_19632"),
                       }],
                       initialValue: this.props.itemValues['noanswerto']
                       })(
                           <Input type="text" className={"P-" + nvram["noanswerto"]}/>
                   )}
               </FormItem>
               <FormItem  className = "forwardwtItem None WorkRule" label={(<span>{callTr("a_1111")}&nbsp;<Tooltip title={this.tips_tr("No Answer Timeout")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('forwardwt', {
                       rules: [{
                           required: true,
                           message: callTr("a_19637")
                       },{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 1, 120)
                           }
                       }],
                       initialValue: this.props.itemValues['forwardwt'] ? this.props.itemValues['forwardwt'] : '20'
                       })(
                           <Input type="text" className={"P-" + nvram["forwardwt"]}/>
                   )}
               </FormItem>
               <FormItem  className = "enabledndforwardItem None WorkRule" label={(<span>{callTr("a_19244")}&nbsp;<Tooltip title={this.tips_tr("Enable DND Forward")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enabledndforward', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues['enabledndforward'])
                   })(<Checkbox />)
                   }
               </FormItem>
               <FormItem  className = "dndtoItem None WorkRule" label={(<span>{callTr("a_19245")}&nbsp;<Tooltip title={this.tips_tr("DND To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('dndto', {
                       rules: [{
                           max:64,message: callTr("a_19632"),
                       }],
                       initialValue: this.props.itemValues['dndto']
                   })(
                       <Input type="text" />
                   )}
               </FormItem>




               <p className="blocktitle"><s></s>{callTr("a_4752")}</p>
               <Row gutter={30} style={{width:'1500px',marginLeft:'17px'}}>
                   <Col span={2}></Col>
                   <Col className="ring-capture" span={4} style={{marginLeft:'13px',marginRight:'14px',paddingLeft:'0'}}>
                       <span>{callTr("a_16178")}</span>
                   </Col>
                   <Col className="ring-capture" span={4}>
                       <span>{callTr("a_16179")}</span>
                   </Col>
                   <Col span={21}></Col>
               </Row>
               <Row gutter={30} style={{width:'1500px',marginLeft:'17px',marginBottom:'20px'}}>
                   <Col span={2}></Col>
                   <Col span={4} style={{marginLeft:'13px',marginRight:'14px',paddingLeft:'0'}}>
                       {getFieldDecorator('callerid1', {
                           rules: [{
                               max:64,message: callTr("a_19632"),
                           }],
                           initialValue: itemValues['callerid1']
                       })(
                           <Input type="text" style={{width:'100%'}} className={"P-" + nvram["callerid1"]}/>
                       )}
                   </Col>
                   <Col span={4}>
                       {getFieldDecorator('tonename1', {
                           initialValue: itemValues['tonename1'] ? itemValues['tonename1'] : "content://settings/system/ringtone"
                       })(
                           <Select style={{width:'100%'}} className={"P-" + nvram["tonename1"]}>
                               <Option value="content://settings/system/ringtone">{callTr("a_8421")}</Option>
                               <Option value="ringtone_silence">Silent</Option>
                               {children}
                           </Select>
                       )}
                   </Col>
                   <Col span={10}></Col>
               </Row>
               <Row gutter={30} style={{width:'1500px',marginLeft:'17px',marginBottom:'20px'}}>
                   <Col span={2}></Col>
                   <Col span={4} style={{marginLeft:'13px',marginRight:'14px',paddingLeft:'0'}}>
                       {getFieldDecorator('callerid2', {
                           rules: [{
                               max:64,message: callTr("a_19632"),
                           }],
                           initialValue: itemValues['callerid2']
                       })(
                           <Input type="text" style={{width:'100%'}} className={"P-" + nvram["callerid2"]}/>
                       )}
                   </Col>
                   <Col span={4}>
                       {getFieldDecorator('tonename2', {
                           initialValue: itemValues['tonename2'] ? itemValues['tonename2'] : "content://settings/system/ringtone"
                       })(
                           <Select style={{width:'100%'}} className={"P-" + nvram["tonename2"]}>
                               <Option value="content://settings/system/ringtone">{callTr("a_8421")}</Option>
                               <Option value="ringtone_silence">Silent</Option>
                               {children}
                           </Select>
                       )}
                   </Col>
                   <Col span={10}></Col>
               </Row>
               <Row gutter={30} style={{width:'1500px',marginLeft:'17px'}}>
                   <Col span={2}></Col>
                   <Col span={4} style={{marginLeft:'13px',marginRight:'14px',paddingLeft:'0'}}>
                       {getFieldDecorator('callerid3', {
                           rules: [{
                               max:64,message: callTr("a_19632"),
                           }],
                           initialValue: itemValues['callerid3']
                       })(
                           <Input type="text" style={{width:'100%'}} className={"P-" + nvram["callerid3"]}/>
                       )}
                   </Col>
                   <Col span={4}>
                       {getFieldDecorator('tonename3', {
                           initialValue: itemValues['tonename3'] ? itemValues['tonename3'] : "content://settings/system/ringtone"
                       })(
                           <Select style={{width:'100%'}} className={"P-" + nvram["tonename3"]}>
                               <Option value="content://settings/system/ringtone">{callTr("a_8421")}</Option>
                               <Option value="ringtone_silence">Silent</Option>
                               {children}
                           </Select>
                       )}
                   </Col>
                   <Col span={10}></Col>
               </Row>
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
        getTonelist: Actions.getTonelist
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(CallForm));
