import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance"
import { FormattedHTMLMessage } from 'react-intl'
import * as Store from '../../../entry'
import { Form, Layout, Input, Icon, Tooltip, Checkbox, Radio, Select, Button } from "antd"
const FormItem = Form.Item
const Content = Layout
const Option = Select.Option
const RadioGroup = Radio.Group
let req_items = new Array;
const nvram = {
    'sipreg' : ["31", "410", "510", "610", "1710", "1810","50610","50710","50810","50910","51010","51110","51210","51310","51410","51510"],
    'unreg' : ["81", "411", "511", "611", "1711", "1811","50611","50711","50811","50911","51011","51111","51211","51311","51411","51511"],
    'regexp' : ["32", "412", "512", "612", "1712", "1812","50612","50712","50812","50912","51012","51112","51212","51312","51412","51512"],
    'regbeforeexp': ["2330", "2430", "2530", "2630", "2730", "2830","51630","51730","51830","51930","52030","52130","52230","52330","52430","52530"],
    'retrytime' : ["138", "471", "571", "671", "1771", "1871","50671","50771","50871","50971","51071","51171","51271","51371","51471","51571"],
    'registerheader': ["2359","2459","2559","2659","2759","2859","51659","51759","51859","51959","52059","52159","52259","52359","52459","52559"],
    'sipport' : ["40", "413", "513", "613", "1713", "1813","50613","50713","50813","50913","51013","51113","51213","51313","51413","51513"],
    'siptranport' : ["130", "448", "548", "648", "1748", "1848","50648","50748","50848","50948","51048","51148","51248","51348","51448","51548"],
    'sipschema' : ["2329", "2429", "2529", "2629", "2729", "2829","51629","51729","51829","51929","52029","52129","52229","52329","52429","52529"],
    'useepport' : ["2331", "2431", "2531", "2631", "2731", "2831","51631","51731","51831","51931","52031","52131","52231","52331","52431","52531"],
    'suptsipintid': ["288","489","589","689","1789","1889","50689","50789","50889","50989","51089","51189","51289","51389","51489","51589"],
    'sipt1to' : ["209", "440", "540", "640", "1740", "1840","50640","50740","50840","50940","51040","51140","51240","51340","51440","51540"],
    'sipt2int' : ["250", "441", "541", "641", "1741", "1841","50641","50741","50841","50941","51041","51141","51241","51341","51441","51541"],
    'siptdint' : ["2387", "2487", "2587", "2687", "2787", "2887","51687","51787","51887","51987","52087","52187","52287","52387","52487","52587"],
    'removeobp' : ["2305", "2405", "2505", "2605", "2705", "2805","51605","51705","51805","51905","52005","52105","52205","52305","52405","52505"],
    '100rel' : ["272", "435", "535", "635", "1735", "1835","50635","50735","50835","50935","51035","51135","51235","51335","51435","51535"],
    'enablesip' : ["2397", "2497", "2597", "2697", "2797", "2897","51697","51797","51897","51997","52097","52197","52297","52397","52497","52597"],
    'sipperiod' : ["2398", "2498", "2598", "2698", "2798", "2898","51698","51798","51898","51998","52098","52198","52298","52398","52498","52598"],
    'maxsipmsg' : ["2399", "2499", "2599", "2699", "2799", "2899","51699","51799","51899","51999","52099","52199","52299","52399","52499","52599"],
    'mwi' : ["99", "415", "515", "615", "1715", "1815","50615","50715","50815","50915","51015","51115","51215","51315","51415","51515"],
    'usepheader' : ["2338", "2438", "2538", "2638", "2738", "2838","51638","51738","51838","51938","52038","52138","52238","52338","52438","52538"],
    'useppiheader' : ["2339", "2439", "2539", "2639", "2739", "2839","51639","51739","51839","51939","52039","52139","52239","52339","52439","52539"],
    'seexp' : ["sessionexp_0", "sessionexp_1", "sessionexp_2", "sessionexp_3", "sessionexp_4", "sessionexp_5","sessionexp_6","sessionexp_7","sessionexp_8","sessionexp_9","sessionexp_10","sessionexp_11","sessionexp_12","sessionexp_13","sessionexp_14","sessionexp_15"],
    'minse' : ["261", "427", "527", "627", "1727", "1827","50627","50727","50827","50927","51027","51127","51227","51327","51427","51527"],
    'uacref' : ["266", "432", "532", "632", "1732", "1832","50632","50732","50832","50932","51032","51132","51232","51332","51432","51532"],
    'uasref' : ["267", "433", "533", "633", "1733", "1833","50633","50733","50833","50933","51033","51133","51233","51333","51433","51533"],
    'forinvite' : ["265", "431", "531", "631", "1731", "1831","50631","50731","50831","50931","51031","51131","51231","51331","51431","51531"],
    'callert' : ["262", "428", "528", "628", "1728", "1828","50628","50728","50828","50928","51028","51128","51228","51328","51428","51528"],
    'calleet' : ["263", "429", "529", "629", "1729", "1829","50629","50729","50829","50929","51029","51129","51229","51329","51429","51529"],
    'forcet' : ["264", "430", "530", "630", "1730", "1830","50630","50730","50830","50930","51030","51130","51230","51330","51430","51530"],
    'opensession' : ["260", "434", "534", "634", "1734", "1834","50634","50734","50834","50934","51034","51134","51234","51334","51434","51534"]
}

class SipForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {opensession:false}
    }

    handlePvalue = (activeAccount) => {
        let curAccount = activeAccount ? activeAccount : this.props.curAccount;
         req_items = [];
         req_items.push(
             this.getReqItem("sipreg", nvram["sipreg"][curAccount], ""),
             this.getReqItem("unreg", nvram["unreg"][curAccount], ""),
             this.getReqItem("regexp"+curAccount, nvram["regexp"][curAccount], ""),
             this.getReqItem("regbeforeexp"+curAccount, nvram["regbeforeexp"][curAccount], ""),
             this.getReqItem("retrytime"+curAccount, nvram["retrytime"][curAccount], ""),
             this.getReqItem("registerheader", nvram["registerheader"][curAccount], ""),
             this.getReqItem("sipport"+curAccount, nvram["sipport"][curAccount], ""),
             this.getReqItem("siptranport", nvram["siptranport"][curAccount], ""),
             this.getReqItem("sipschema", nvram["sipschema"][curAccount], ""),
             this.getReqItem("useepport", nvram["useepport"][curAccount], ""),
             this.getReqItem("suptsipintid", nvram["suptsipintid"][curAccount], ""),
             this.getReqItem("sipt1to", nvram["sipt1to"][curAccount], ""),
             this.getReqItem("sipt2int", nvram["sipt2int"][curAccount], ""),
             this.getReqItem("siptdint"+curAccount, nvram["siptdint"][curAccount], ""),
             this.getReqItem("removeobp", nvram["removeobp"][curAccount], ""),
             this.getReqItem("100rel", nvram["100rel"][curAccount], ""),
             this.getReqItem("enablesip", nvram["enablesip"][curAccount], ""),
             this.getReqItem("sipperiod"+curAccount, nvram["sipperiod"][curAccount], ""),
             this.getReqItem("maxsipmsg"+curAccount, nvram["maxsipmsg"][curAccount], ""),
             this.getReqItem("mwi", nvram["mwi"][curAccount], ""),
             this.getReqItem("usepheader", nvram["usepheader"][curAccount], ""),
             this.getReqItem("useppiheader", nvram["useppiheader"][curAccount], ""),
             this.getReqItem("seexp"+curAccount, nvram["seexp"][curAccount], ""),
             this.getReqItem("minse"+curAccount, nvram["minse"][curAccount], ""),
             this.getReqItem("uacref", nvram["uacref"][curAccount], ""),
             this.getReqItem("uasref", nvram["uasref"][curAccount], ""),
             this.getReqItem("forinvite", nvram["forinvite"][curAccount], ""),
             this.getReqItem("callert", nvram["callert"][curAccount], ""),
             this.getReqItem("calleet", nvram["calleet"][curAccount], ""),
             this.getReqItem("forcet", nvram["forcet"][curAccount], ""),
             this.getReqItem("opensession"+curAccount, nvram["opensession"][curAccount], ""),
         );
         return req_items;
    }

    componentDidMount = () => {
        this.props.getItemValues(this.handlePvalue(), (values) => {
            let opensession = Boolean(parseInt(values['opensession'+this.props.curAccount]));
            this.handleOpenSession(opensession);
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.activeKey == this.props.tabOrder) {
            // selected tab changed or selected account changed
            if (this.props.activeKey != nextProps.activeKey
                || this.props.curAccount != nextProps.curAccount) {
                this.props.getItemValues(this.handlePvalue(nextProps.curAccount), (values) => {
                    let opensession = Boolean(parseInt(values['opensession'+nextProps.curAccount]));
                    this.handleOpenSession(opensession);
                });
                this.props.form.resetFields();
            }

            // enter key pressed
            if (this.props.enterSave != nextProps.enterSave) {
                this.handleSubmit();
            }
        }
    }

    handleOpenSession = (e) => {
        if(typeof e == 'boolean') {
            this.setState({opensession:e})
        } else {
            this.setState({opensession:e.target.checked})
        }
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              for (let key in values) {
                  if(values[key] == undefined) {
                      values[key] = ""
                  }
              }
              let curAccount = this.props.curAccount;
              if(parseFloat(values['seexp'+curAccount]) < parseFloat(values["minse"+curAccount])) {
                  Store.store.dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: 'a_wrongse'}});
                  return false;
              }
              if(values["seexpCheckbox"]) {
                  values["opensession"+curAccount] = values["seexp"+curAccount]
              } else {
                  values["opensession"+curAccount] = '0'
              }
              this.props.setItemValues(this.handlePvalue(), values,1);
          }
        });
     }

    render() {
        const { getFieldDecorator } = this.props.form;
        const [callTr,curAccount] = [this.props.callTr,this.props.curAccount];
        let itemList =
           <Form hideRequiredMark>
               <p className="blocktitle"><s></s>{callTr("a_sipbasic")}</p>
               <FormItem  label={(<span>{callTr("a_sipreg")}&nbsp;<Tooltip title={this.tips_tr("SIP Registration")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('sipreg', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["sipreg"])
                   })(<Checkbox className={"P-" + nvram["sipreg"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_unregor")}&nbsp;<Tooltip title={this.tips_tr("Unregister Before New Registration")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('unreg', {
                        initialValue: this.props.itemValues['unreg'] ? this.props.itemValues['unreg'] : "0"
                        })(
                            <Select className={"P-" + nvram["unreg"][curAccount]}>
                                <Option value="0">{callTr("a_no")}</Option>
                                <Option value="1">{callTr("a_all")}</Option>
                                <Option value="2">{callTr("a_instance")}</Option>
                            </Select>
                   )}
          　　　</FormItem>
               <FormItem  label={(<span>{callTr("a_regexp")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Register Expitation")} />}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('regexp'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 1, 64800)
                           }
                       }],
                       initialValue: this.props.itemValues['regexp'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["regexp"][curAccount]}/>
                       )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_regbeforeexp")}&nbsp;<Tooltip title={this.tips_tr("Reregister before Expiration")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('regbeforeexp'+curAccount, {
                       rules: [{
                         validator: (data, value, callback) => {
                             this.digits(data, value, callback)
                         }
                     },{
                         validator: (data, value, callback) => {
                             this.range(data, value, callback, 0, 64800)
                         }
                     }],
                       initialValue: this.props.itemValues['regbeforeexp'+curAccount]
                       })(
                       <Input type="text" className={"P-" + nvram["regbeforeexp"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_retrytime")}&nbsp;<Tooltip title={this.tips_tr("Registration Retry Wait Time")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('retrytime'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 1, 3600)
                           }
                       }],
                       initialValue: this.props.itemValues['retrytime'+curAccount]
                       })(
                       <Input type="text" className={"P-" + nvram["retrytime"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_registerAuthHeader")}&nbsp;<Tooltip title={ this.tips_tr("Add Auth Header On RE-REGISTER") }><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('registerheader', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["registerheader"])
                   })(<Checkbox className={"P-" + nvram["registerheader"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_enablesip")}&nbsp;<Tooltip title={this.tips_tr("Enable SIP OPTIONS Keep Alive")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablesip', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["enablesip"])
                   })(<Checkbox className={"P-" + nvram["enablesip"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_sipperiod")}&nbsp;<Tooltip title={this.tips_tr("OPTIONS Keep Alive Interval")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('sipperiod'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 1, 64800)
                           }
                       }],
                       initialValue: this.props.itemValues["sipperiod"+curAccount]
                   })(
                       <Input type="text" className={"P-" + nvram["sipperiod"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_maxsipmsg")}&nbsp;<Tooltip title={this.tips_tr("OPTIONS Keep Alive Maximum Tries")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('maxsipmsg'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 3, 10)
                           }
                       }],
                       initialValue: this.props.itemValues["maxsipmsg"+curAccount]
                   })(
                       <Input type="text" className={"P-" + nvram["maxsipmsg"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_s4mwi")}&nbsp;<Tooltip title={this.tips_tr("SUBSCRIBE for MWI")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('mwi', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["mwi"])
                   })(<Checkbox className={"P-" + nvram["mwi"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem className = "select-item"　 label={(<span>{callTr("a_usepheader")}&nbsp;<Tooltip title={this.tips_tr("Use Privacy Header")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('usepheader', {
                       initialValue: this.props.itemValues['usepheader'] ? this.props.itemValues['usepheader'] : "0"
                   })(
                       <Select>
                           <Option value="0">{callTr("a_default")}</Option>
                           <Option value="1">{callTr("a_no")}</Option>
                           <Option value="2">{callTr("a_yes")}</Option>
                       </Select>
                   )}
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_useppiheader")}&nbsp;<Tooltip title={this.tips_tr("Use P-Preferred-Identity Header")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('useppiheader', {
                       initialValue: this.props.itemValues['useppiheader'] ? this.props.itemValues['useppiheader'] : "0"
                   })(
                       <Select>
                           <Option value="0">{callTr("a_default")}</Option>
                           <Option value="1">{callTr("a_no")}</Option>
                           <Option value="2">{callTr("a_yes")}</Option>
                       </Select>
                   )}
               </FormItem>
               <FormItem className = "select-item"　 label={(<span>{callTr("a_siptranport")}&nbsp;<Tooltip title={this.tips_tr("SIP Transport")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('siptranport', {
                        initialValue: this.props.itemValues['siptranport'] ? this.props.itemValues['siptranport'] : "0"
                        })(
                            <Select className={"P-" + nvram["siptranport"][curAccount]}>
                                <Option value="0">UDP</Option>
                                <Option value="1">TCP</Option>
                                <Option value="2">TLS</Option>
                            </Select>
                   )}
          　　 </FormItem>
               <FormItem  label={(<span>{callTr("a_sipport")}&nbsp;<Tooltip title={this.tips_tr("Local SIP Port")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('sipport'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 0, 65535)
                           }
                       }],
                       initialValue: this.props.itemValues['sipport'+curAccount]
                   })(
                       <Input type="text" className={"P-" + nvram["sipport"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_sipschema")}&nbsp;<Tooltip title={this.tips_tr("SIP URI Scheme When Using TLS")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('sipschema', {
                       initialValue: this.props.itemValues['sipschema']
                   })(
                       <RadioGroup className={"P-" + nvram["sipschema"][curAccount]}>
                           <Radio value="0">sip</Radio>
                           <Radio value="1">sips</Radio>
                       </RadioGroup>
                   )
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_useepport")}&nbsp;<Tooltip title={this.tips_tr("Use Actual Ephemeral Port in Contact with TCP/TLS")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('useepport', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["useepport"])
                   })(<Checkbox className={"P-" + nvram["useepport"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_suptsipintid")}&nbsp;<Tooltip title={this.tips_tr("Support SIP Instance ID")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('suptsipintid', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["suptsipintid"])
                   })(<Checkbox className={"P-" + nvram["suptsipintid"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_sipt1to")}&nbsp;<Tooltip title={this.tips_tr("SIP T1 Timeout")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('sipt1to', {
                        initialValue: this.props.itemValues['sipt1to'] ? this.props.itemValues['sipt1to'] : "50"
                        })(
                            <Select className={"P-" + nvram["sipt1to"][curAccount]}>
                                <Option value="50">{callTr("a_halfsec")}</Option>
                                <Option value="100">{callTr("a_onesec")}</Option>
                                <Option value="200">{callTr("a_twosec")}</Option>
                            </Select>
                   )}
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_sipt2int")}&nbsp;<Tooltip title={this.tips_tr("SIP T2 Interval")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('sipt2int', {
                        initialValue: this.props.itemValues['sipt2int'] ? this.props.itemValues['sipt2int'] : "200"
                        })(
                            <Select className={"P-" + nvram["sipt2int"][curAccount]}>
                                <Option value="200">{callTr("a_twosec")}</Option>
                                <Option value="400">{callTr("a_foursec")}</Option>
                                <Option value="800">{callTr("a_eigsec")}</Option>
                            </Select>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_siptdint")}&nbsp;<Tooltip title={this.tips_tr("SIP Timer D Interval")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('siptdint'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 0, 64)
                           }
                       }],
                       initialValue: this.props.itemValues['siptdint'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["siptdint"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_removeobp")}&nbsp;<Tooltip title={this.tips_tr("Remove OBP from Route")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('removeobp', {
                        initialValue: this.props.itemValues['removeobp'] ? this.props.itemValues['removeobp'] : "0"
                        })(
                            <Select className={"P-" + nvram["removeobp"][curAccount]}>
                                <Option value="0">{callTr("a_disable")}</Option>
                                <Option value="1">{callTr("a_active")}</Option>
                                <Option value="2">{callTr("a_always")}</Option>
                            </Select>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_en10rel")}&nbsp;<Tooltip title={this.tips_tr("Enable 100rel")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('100rel', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["100rel"])
                   })(<Checkbox className={"P-" + nvram["100rel"][curAccount]}/>)
                   }
               </FormItem>
               <p className="blocktitle"><s></s>{callTr("a_sessiontime")}</p>
               <FormItem  label={(<span>{callTr("a_opensession")}&nbsp;<Tooltip title={this.tips_tr("Enable Session Timer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('seexpCheckbox', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["opensession"+curAccount]) ? true : false
                   })(<Checkbox onChange={this.handleOpenSession} className={"P-" + nvram["opensession"][curAccount]}/>)
                   }
               </FormItem>

               <FormItem style={{display:this.state.opensession?'block':'none'}}  label={(<span>{callTr("a_seexp")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Session Expiration")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('seexp'+curAccount, {
                       rules: [{
                           required: true,
                           message: this.tr("tip_require")
                       },{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       }, {
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 90, 64800)
                           }
                       }],
                       initialValue: parseInt(this.props.itemValues["opensession"+curAccount]) ? parseInt(this.props.itemValues["opensession"+curAccount]) : this.props.itemValues["seexp"+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["seexp"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem style={{display:this.state.opensession?'block':'none'}} label={(<span>{callTr("a_minse")}&nbsp;<Tooltip title={this.tips_tr("Min-SE")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('minse'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       }, {
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 90, 64800)
                           }
                       }],
                       initialValue: this.props.itemValues["minse"+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["minse"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem style={{display:this.state.opensession?'block':'none'}} className = "select-item"　 label={(<span>{callTr("a_uacsr")}&nbsp;<Tooltip title={this.tips_tr("UAC Specify Refresher")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('uacref', {
                        initialValue: this.props.itemValues['uacref'] ? this.props.itemValues['uacref'] : "0"
                        })(
                            <Select className={"P-" + nvram["uacref"][curAccount]}>
                                <Option value="0">Omit</Option>
                                <Option value="1">UAC</Option>
                                <Option value="2">UAS</Option>
                            </Select>
                   )}
          　　　</FormItem>
               <FormItem  style={{display:this.state.opensession?'block':'none'}} className = "select-item"  label={(<span>{callTr("a_uassr")}&nbsp;<Tooltip title={this.tips_tr("UAS Specify Refresher")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('uasref', {
                        initialValue: this.props.itemValues['uasref'] ? this.props.itemValues['uasref'] : "1"
                        })(
                            <Select className={"P-" + nvram["uasref"][curAccount]}>
                                <Option value="1">UAC</Option>
                                <Option value="2">UAS</Option>
                            </Select>
                   )}
         　　　 </FormItem>
               <FormItem style={{display:this.state.opensession?'block':'none'}} label={(<span>{callTr("a_callerreq")}&nbsp;<Tooltip title={this.tips_tr("Caller Request Timer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('callert', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["callert"])
                   })(<Checkbox className={"P-" + nvram["callert"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem style={{display:this.state.opensession?'block':'none'}} label={(<span>{callTr("a_calleereq")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Callee Request Timer")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('calleet', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["calleet"])
                   })(<Checkbox className={"P-" + nvram["calleet"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem style={{display:this.state.opensession?'block':'none'}} label={(<span>{callTr("a_fortimer")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Force Timer")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('forcet', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["forcet"])
                   })(<Checkbox className={"P-" + nvram["forcet"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem style={{display:this.state.opensession?'block':'none'}} label={(<span>{callTr("a_forceinv")}&nbsp;<Tooltip title={this.tips_tr("Force INVITE")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('forinvite', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["forinvite"])
                   })(<Checkbox className={"P-" + nvram["forinvite"][curAccount]}/>)
                   }
               </FormItem>

               <FormItem>
                   <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
               </FormItem>
               <FormItem>
                   {getFieldDecorator('opensession'+curAccount, {
                       rules: [],
                       initialValue: this.props.itemValues["opensession"+curAccount]
                       })(
                           <Input style={{"display":"none"}} type="text" className={"P-" + nvram["opensession"][curAccount]}/>
                   )}
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

export default connect(mapStateToProps)(Enhance(SipForm));
