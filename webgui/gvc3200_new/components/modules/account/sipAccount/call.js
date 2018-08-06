import React, { Component, PropTypes } from 'react'
import { FormattedHTMLMessage } from 'react-intl'
import { connect } from 'react-redux'
import Enhance from "../../../mixins/Enhance";
import { Form, Layout, Input, Icon, Tooltip, Checkbox, Select, Button, Radio,Row, Col } from "antd";
import * as Actions from "../../../redux/actions";
import {bindActionCreators} from "redux";
const FormItem = Form.Item;
const Content = Layout;
const RadioGroup = Radio.Group;
const Option = Select.Option;
let req_items = new Array;
let acctname_item = ['270','417','517','617','1717','1817',"50617","50717","50817","50917","51017","51117","51217","51317","51417","51517"];
const nvram = {
    'autovideo' : ["2314", "2414", "2514", "2614", "2714", "2814","51614","51714","51814","51914","52014","52114","52214","52314","52414","52514"],
    'remotevideo' : ["2326", "2426", "2526", "2626", "2726", "2826","51626","51726","51826","51926","52026","52126","52226","52326","52426","52526"],
     'videolayout' : ["2332", "2432", "2532", "2632", "2732", "2832","51632","51732","51832","51932","52032","52132","52232","52332","52432","52532"],
    'autoanswer' : ["90", "425", "525", "625", "1725", "1825","50625","50725","50825","50925","51025","51125","51225","51325","51425","51525"],
    'autoanswerType' : ["autoAnswerType_0", "autoAnswerType_1", "autoAnswerType_2", "autoAnswerType_3", "autoAnswerType_4", "autoAnswerType_5","autoAnswerType_6","autoAnswerType_7","autoAnswerType_8","autoAnswerType_9","autoAnswerType_10","autoAnswerType_11","autoAnswerType_12","autoAnswerType_13","autoAnswerType_14","autoAnswerType_15"],
    'autoanswerEnabled' : ["autoAnswerEnable_0", "autoAnswerEnable_1", "autoAnswerEnable_2", "autoAnswerEnable_3", "autoAnswerEnable_4", "autoAnswerEnable_5","autoAnswerEnable_6","autoAnswerEnable_7","autoAnswerEnable_8","autoAnswerEnable_9","autoAnswerEnable_10","autoAnswerEnable_11","autoAnswerEnable_12","autoAnswerEnable_13","autoAnswerEnable_14","autoAnswerEnable_15"],
    'autoAnswerStart' : ["autoAnswerStart_0", "autoAnswerStart_1", "autoAnswerStart_2", "autoAnswerStart_3", "autoAnswerStart_4", "autoAnswerStart_5","autoAnswerStart_6","autoAnswerStart_7","autoAnswerStart_8","autoAnswerStart_9","autoAnswerStart_10","autoAnswerStart_11","autoAnswerStart_12","autoAnswerStart_13","autoAnswerStart_14","autoAnswerStart_15"],
    'autoAnswerEnd' : ["autoAnswerEnd_0", "autoAnswerEnd_1", "autoAnswerEnd_2", "autoAnswerEnd_3", "autoAnswerEnd_4", "autoAnswerEnd_5","autoAnswerEnd_6","autoAnswerEnd_7","autoAnswerEnd_8","autoAnswerEnd_9","autoAnswerEnd_10","autoAnswerEnd_11","autoAnswerEnd_12","autoAnswerEnd_13","autoAnswerEnd_14","autoAnswerEnd_15"],
    'warmingtone' : ["26072", "26172", "26272", "26372", "26472", "26572","52672","52772","52872","52972","53072","53172","53272","53372","53472","53572"],
    'caiforaa': ["2356","2456","2556","2656","2756","2856","51656","51756","51856","51956","52056","52156","52256","52356","52456","52556"],
    'interbarg' : ["26019", "26119", "26219", "26319", "26419", "26519","52619","52719","52819","52919","53019","53119","53219","53319","53419","53519"],
    'autoprvw' : ["29062", "29162", "29262", "29362", "29462", "29562","53662","53762","53862","53962","54062","54162","54262","54362","54462","54562"],
    'sendanony' : ["65", "421", "521", "621", "1721", "1821","50621","50721","50821","50921","51021","51121","51221","51321","51421","51521"],
    'anonyrej' : ["129", "446", "546", "646", "1746", "1846","50646","50746","50846","50946","51046","51146","51246","51346","51446","51546"],
    'calllog' : ["182", "442", "542", "642", "1742", "1842","50642","50742","50842","50942","51042","51142","51242","51342","51442","51542"],
    'enablefea' : ["191", "420", "520", "620", "1720", "1820","50620","50720","50820","50920","51020","51120","51220","51320","51420","51520"],
    'tranonhang' : ["2304", "2404", "2504", "2604", "2704", "2804","51604","51704","51804","51904","52004","52104","52204","52304","52404","52504"],
    'dialkey' : ["72", "492", "592", "692", "1792", "1892","50692","50792","50892","50992","51092","51192","51292","51392","51492","51592"],
    'dndfeaon' : ["2344", "2444", "2544", "2644", "2744", "2844","51644","51744","51844","51944","52044","52144","52244","52344","52444","52544"],
    'dndfeaoff' : ["2345", "2445", "2545", "2645", "2745", "2845","51645","51745","51845","51945","52045","52145","52245","52345","52445","52545"],
    'keytimeout' : ["85", "491", "591", "691", "1791", "1891","50691","50791","50891","50991","51091","51191","51291","51391","51491","51591"],
    'ringto' : ["1328", "476", "576", "676", "1776", "1876","50676","50776","50876","50976","51076","51176","51276","51376","51476","51576"],
    'targetcon' : ["135", "469", "569", "669", "1769", "1869","50669","50769","50869","50969","51069","51169","51269","51369","51469","51569"],
    'RFC2543Hold' : ["26062","26162","26262","26362","26462","26562","52662","52762","52862","52962","53062","53162","53262","53362","53462","53562"],
    'cftype' : ["display_0","display_1","display_2","display_3","display_4","display_5","display_6","display_7","display_8","display_9","display_10","display_11","display_12","display_13","display_14","display_15"],
    'uccf' : ["allTo_0","allTo_1","allTo_2","allTo_3","allTo_4","allTo_5","allTo_6","allTo_7","allTo_8","allTo_9","allTo_10","allTo_11","allTo_12","allTo_13","allTo_14","allTo_15"],
    'timecffrom' : ["starttime_0","starttime_1","starttime_2","starttime_3","starttime_4","starttime_5","starttime_6","starttime_7","starttime_8","starttime_9","starttime_10","starttime_11","starttime_12","starttime_13","starttime_14","starttime_15"],
    'timecfto' : ["finishtime_0","finishtime_1","finishtime_2","finishtime_3","finishtime_4","finishtime_5","finishtime_6","finishtime_7","finishtime_8","finishtime_9","finishtime_10","finishtime_11","finishtime_12","finishtime_13","finishtime_14","finishtime_15"],
    'intimeto' : ["inTimeForward_0","inTimeForward_1","inTimeForward_2","inTimeForward_3","inTimeForward_4","inTimeForward_5","inTimeForward_6","inTimeForward_7","inTimeForward_8","inTimeForward_9","inTimeForward_10","inTimeForward_11","inTimeForward_12","inTimeForward_13","inTimeForward_14","inTimeForward_15"],
    'outtimeto' : ["outTimeForward_0","outTimeForward_1","outTimeForward_2","outTimeForward_3","outTimeForward_4","outTimeForward_5","outTimeForward_6","outTimeForward_7","outTimeForward_8","outTimeForward_9","outTimeForward_10","outTimeForward_11","outTimeForward_12","outTimeForward_13","outTimeForward_14","outTimeForward_15"],
    'enablebusyto' : ["busyForwardEnable_0","busyForwardEnable_1","busyForwardEnable_2","busyForwardEnable_3","busyForwardEnable_4","busyForwardEnable_5","busyForwardEnable_6","busyForwardEnable_7","busyForwardEnable_8","busyForwardEnable_9","busyForwardEnable_10","busyForwardEnable_11","busyForwardEnable_12","busyForwardEnable_13","busyForwardEnable_14","busyForwardEnable_15"],
    'busyto' : ["busyForward_0","busyForward_1","busyForward_2","busyForward_3","busyForward_4","busyForward_5","busyForward_6","busyForward_7","busyForward_8","busyForward_9","busyForward_10","busyForward_11","busyForward_12","busyForward_13","busyForward_14","busyForward_15"],
    'enablenoanswerto' : ["delayedForwardEnable_0","delayedForwardEnable_1","delayedForwardEnable_2","delayedForwardEnable_3","delayedForwardEnable_4","delayedForwardEnable_5","delayedForwardEnable_6","delayedForwardEnable_7","delayedForwardEnable_8","delayedForwardEnable_9","delayedForwardEnable_10","delayedForwardEnable_11","delayedForwardEnable_12","delayedForwardEnable_13","delayedForwardEnable_14","delayedForwardEnable_15"],
    'noanswerto' : ["delayedForward_0","delayedForward_1","delayedForward_2","delayedForward_3","delayedForward_4","delayedForward_5","delayedForward_6","delayedForward_7","delayedForward_8","delayedForward_9","delayedForward_10","delayedForward_11","delayedForward_12","delayedForward_13","delayedForward_14","delayedForward_15"],
    'forwardwt' : ["139","470","570","670","1770","1870","50670","50770","50870","50970","51070","51170","51270","51370","51470","51570"],
    'enabledndforward': ["dndForwardEnable_0","dndForwardEnable_1","dndForwardEnable_2","dndForwardEnable_3","dndForwardEnable_4","dndForwardEnable_5","dndForwardEnable_6","dndForwardEnable_7","dndForwardEnable_8","dndForwardEnable_9","dndForwardEnable_10","dndForwardEnable_11","dndForwardEnable_12","dndForwardEnable_13","dndForwardEnable_14","dndForwardEnable_15"],
    'dndto': ['dndForward_0','dndForward_1','dndForward_2','dndForward_3','dndForward_4','dndForward_5','dndForward_6','dndForward_7','dndForward_8','dndForward_9','dndForward_10','dndForward_11','dndForward_12','dndForward_13','dndForward_14','dndForward_15'],

    'prefix' : ["66", "419", "519", "619", "1719", "1819","50619","50719","50819","50919","51019","51119","51219","51319","51419","51519"],
    'dialplancheck' : ["2382","2482","2582","2682","2782","2882","51682","51782","51882","51982","52082","52182","52282","52382","52482","52582"],
    'dialplan' : ["290", "459", "559", "659", "1759", "1859","50659","50759","50859","50959","51059","51159","51259","51359","51459","51559"],
    'callerdisplay' : ["2324", "2424", "2524", "2624", "2724", "2824","51624","51724","51824","51924","52024","52124","52224","52324","52424","52524"],
    'ignalertinfo' : ["26018", "26118", "26218", "26318", "26418", "26518","52618","52718","52818","52918","53018","53118","53218","53318","53418","53518"],
    'defaultringtone' : ["104","423","523","623","1723","1823","50623","50723","50823","50923","51023","51123","51223","51323","51423","51523"],
    'callerid1' : ["1488","1494","1500","1506","1512","1518","52677","52777","52877","52977","53077","53177","53277","53377","53477","53577"],
    'tonename1' : ["1489","1495","1501","1507","1513","1519","52678","52778","52878","52978","53078","53178","53278","53378","53478","53578"],
    'callerid2' : ["1490","1496","1502","1508","1514","1520","52679","52779","52879","52979","53079","53179","53279","53379","53479","53579"],
    'tonename2' : ["1491","1497","1503","1509","1515","1521","52680","52780","52880","52980","53080","53180","53280","53380","53480","53580"],
    'callerid3' : ["1492","1498","1504","1510","1516","1522","52681","52781","52881","52981","53081","53181","53281","53381","53481","53581"],
    'tonename3' : ["1493","1499","1505","1511","1517","1523","52682","52782","52882","52982","53082","53182","53282","53382","53482","53582"]


};

var children = [];

class CallForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {autoanswer:'0'}
      this.handlePvalue();
    }

    handlePvalue = (activeAccount) => {
         let curAccount = activeAccount ? activeAccount : this.props.curAccount;
         req_items = [];
         req_items.push(
             this.getReqItem("autovideo", nvram["autovideo"][curAccount], ""),
             this.getReqItem("remotevideo", nvram["remotevideo"][curAccount], ""),
             this.getReqItem("videolayout", nvram["videolayout"][curAccount], ""),
             //this.getReqItem("autoanswer", nvram["autoanswer"][curAccount], ""),
             this.getReqItem("warmingtone", nvram["warmingtone"][curAccount], ""),
             this.getReqItem("caiforaa"+curAccount, nvram["caiforaa"][curAccount], ""),
             this.getReqItem("interbarg", nvram["interbarg"][curAccount], ""),
             this.getReqItem("autoprvw", nvram["autoprvw"][curAccount], ""),
             this.getReqItem("sendanony", nvram["sendanony"][curAccount], ""),
             this.getReqItem("anonyrej", nvram["anonyrej"][curAccount], ""),
             this.getReqItem("calllog", nvram["calllog"][curAccount], ""),
             this.getReqItem("enablefea", nvram["enablefea"][curAccount], ""),
             this.getReqItem("tranonhang", nvram["tranonhang"][curAccount], ""),
             this.getReqItem("dndfeaon"+curAccount, nvram["dndfeaon"][curAccount], ""),
             this.getReqItem("dndfeaoff"+curAccount, nvram["dndfeaoff"][curAccount], ""),
             this.getReqItem("keytimeout"+curAccount, nvram["keytimeout"][curAccount], ""),
             this.getReqItem("ringto"+curAccount, nvram["ringto"][curAccount], ""),
             this.getReqItem("targetcon", nvram["targetcon"][curAccount], ""),
             this.getReqItem("RFC2543Hold", nvram["RFC2543Hold"][curAccount], ""),
             this.getReqItem("cftype", nvram["cftype"][curAccount], ""),
             this.getReqItem("uccf"+curAccount, nvram["uccf"][curAccount], ""),
             this.getReqItem("timecffrom"+curAccount, nvram["timecffrom"][curAccount], ""),
             this.getReqItem("timecfto"+curAccount, nvram["timecfto"][curAccount], ""),
             this.getReqItem("intimeto"+curAccount, nvram["intimeto"][curAccount], ""),
             this.getReqItem("outtimeto"+curAccount, nvram["outtimeto"][curAccount], ""),
             this.getReqItem("enablebusyto", nvram["enablebusyto"][curAccount], ""),
             this.getReqItem("busyto"+curAccount, nvram["busyto"][curAccount], ""),
             this.getReqItem("enablenoanswerto", nvram["enablenoanswerto"][curAccount], ""),
             this.getReqItem("noanswerto"+curAccount, nvram["noanswerto"][curAccount], ""),
             this.getReqItem("forwardwt"+curAccount, nvram["forwardwt"][curAccount], ""),
             this.getReqItem("enabledndforward", nvram["enabledndforward"][curAccount], ""),
             this.getReqItem("dndto"+curAccount, nvram["dndto"][curAccount], ""),

             this.getReqItem("prefix"+curAccount, nvram["prefix"][curAccount], ""),
             this.getReqItem("dialplancheck", nvram["dialplancheck"][curAccount], ""),
             this.getReqItem("dialplan"+curAccount, nvram["dialplan"][curAccount], ""),
             this.getReqItem("callerdisplay", nvram["callerdisplay"][curAccount], ""),
             this.getReqItem("ignalertinfo", nvram["ignalertinfo"][curAccount], ""),
             this.getReqItem("defaultringtone", nvram["defaultringtone"][curAccount], ""),
             this.getReqItem("callerid1"+curAccount, nvram["callerid1"][curAccount], ""),
             this.getReqItem("tonename1", nvram["tonename1"][curAccount], ""),
             this.getReqItem("callerid2"+curAccount, nvram["callerid2"][curAccount], ""),
             this.getReqItem("tonename2", nvram["tonename2"][curAccount], ""),
             this.getReqItem("callerid3"+curAccount, nvram["callerid3"][curAccount], ""),
             this.getReqItem("tonename3", nvram["tonename3"][curAccount], "")
         );
        if(this.props.userType == 'user') {
            req_items = req_items.slice(-13)
            return req_items;
        }
         if(this.props.product == "GXV3380" || this.props.product == "GXV3370" ){
             req_items.push(this.getReqItem("dialkey", nvram["dialkey"][curAccount], ""));
         }
         if (this.props.oemId != "54") {
             req_items.push(this.getReqItem("autoanswer", nvram["autoanswer"][curAccount], ""));
         }
         if (this.props.oemId == '54' && this.props.product == "GXV3380") {
             req_items.push(this.getReqItem("autoanswer", nvram["autoanswerType"][curAccount], ""));
             req_items.push(this.getReqItem("autoanswerEnabled"+curAccount, nvram["autoanswerEnabled"][curAccount], ""));
             req_items.push(this.getReqItem("autoAnswerStart"+curAccount, nvram["autoAnswerStart"][curAccount], ""));
             req_items.push(this.getReqItem("autoAnswerEnd"+curAccount, nvram["autoAnswerEnd"][curAccount], ""));
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
            var json = eval("(" + data + ")");
            var ringtone = json.Ringtone;
            ringtone = ringtone.sort((a,b) => {
                return a['title'].toLowerCase() > b['title'].toLowerCase() ? 1 : -1;
            });
            for (var i = 0; ringtone[i] != undefined; i++) {
                children.push(<Option value = {ringtone[i].data}>{this.htmlEncode(ringtone[i].title)}</Option>);
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
            values["autoanswerEnabled" +curAccount] = "1";
        } else {
            values["autoanswerEnabled" +curAccount] = "0";
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
            if (this.props.activeKey != nextProps.activeKey
                || this.props.curAccount != nextProps.curAccount) {
                this.props.getItemValues(this.handlePvalue(nextProps.curAccount), (values) => {
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
              let curAccount = this.props.curAccount;
              if (this.props.oemId == '54' && this.props.product == "GXV3380") {
                  this.props.cb_updateautoanswerstatus(curAccount);
              } else {
                  this.props.cb_set_autoanswer(curAccount,values['autoanswer']);
              }
              switch (values['cftype']) {
                  case 'allTo':
                      this.props.cb_set_callforward(curAccount,values['cftype'],values['uccf'+curAccount])
                      break;
                  case 'TimeRule':
                      this.props.cb_set_callforward(curAccount,values['cftype'],values['timecffrom'+curAccount],values['timecfto'+curAccount],values['intimeto'+curAccount],values['outtimeto'+curAccount])
                      break;
                  case 'WorkRule':
                      this.props.cb_set_callforward(curAccount,values['cftype'],Number(values['enablebusyto']),values['busyto'+curAccount],Number(values['enablenoanswerto']),values['noanswerto'+curAccount],values['forwardwt'+curAccount],Number(values['enabledndforward']),values['dndto'+curAccount])
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const [callTr,curAccount,itemValues,product] = [this.props.callTr,this.props.curAccount,this.props.itemValues,this.props.product];

        let dialplancheck;
        if(itemValues.dialplancheck != undefined && !this.isEmptyObject(itemValues)) {
            dialplancheck = Number(itemValues.dialplancheck);
            dialplancheck = this.tobinary(dialplancheck)
            dialplancheck = dialplancheck.split("")
        } else {
            dialplancheck = [0,0,0,0,0]
        }
        let itemList =
           <Form>
               <p className="blocktitle"><s></s>{callTr("a_apply_fun")}</p>

               <FormItem label={(<span>{callTr("a_autovideo")}&nbsp;<Tooltip title={this.tips_tr("Start Video Automatically")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('autovideo', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['autovideo'])
                    })(<Checkbox className={"P-" + nvram["autovideo"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem className = "select-item"　 label={(<span>{callTr("a_remotevideo")}&nbsp;<Tooltip title={this.tips_tr("Remote Video Request")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('remotevideo', {
                       initialValue: this.props.itemValues['remotevideo'] ? this.props.itemValues['remotevideo'] : "0"
                       })(
                           <Select className={"P-" + nvram["remotevideo"][curAccount]}>
                               <Option value="0">{callTr("a_prompt")}</Option>
                               <Option value="1">{callTr("a_accept")}</Option>
                               <Option value="2">{callTr("a_deny")}</Option>
                           </Select>
                   )}
         　　　 </FormItem>
               <FormItem className = "select-item"　 label={(<span>{callTr("a_videolayout")}&nbsp;<Tooltip title={this.tips_tr("Video Layout")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('videolayout', {
                        initialValue: this.props.itemValues['videolayout'] ? this.props.itemValues['videolayout'] : "0"
                        })(
                            <Select className={"P-" + nvram["videolayout"][curAccount]}>
                                <Option value="0">{callTr("a_default")}</Option>
                                <Option value="1">{callTr("a_fullscreen")}</Option>
                                <Option value="2">{callTr("a_fswithoutvideo")}</Option>
                            </Select>
                    )}
          　　　 </FormItem>
               {this.props.product == "GXV3380" && this.props.oemId == "54" ? <FormItem className = "select-item"　　label={(<span>{callTr("a_autoans")}&nbsp;<Tooltip title={this.tips_tr("Auto Answer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('autoanswer', {
                       initialValue: this.props.itemValues['autoanswer'] ? this.props.itemValues['autoanswer'] : "0"
                       })(
                           <Select onChange={this.handleAutoAnswer} className={"P-" + nvram["autoanswer"][curAccount]}>
                               <Option value="0">{callTr("a_no")}</Option>
                               <Option value="1">{callTr("a_yes")}</Option>
                               <Option value="2">{callTr("a_pagint")}</Option>
                               <Option value="3">{callTr("a_timeint")}</Option>
                           </Select>
                   )}
               </FormItem> :
               <FormItem className = "select-item"　　label={(<span>{callTr("a_autoans")}&nbsp;<Tooltip title={this.tips_tr("Auto Answer")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('autoanswer', {
                       initialValue: this.props.itemValues['autoanswer'] ? this.props.itemValues['autoanswer'] : "0"
                       })(
                           <Select onChange={this.handleAutoAnswer} className={"P-" + nvram["autoanswer"][curAccount]}>
                               <Option value="0">{callTr("a_no")}</Option>
                               <Option value="1">{callTr("a_yes")}</Option>
                               <Option value="2">{callTr("a_pagint")}</Option>
                           </Select>
                   )}
               </FormItem>
               }
               <FormItem style={{display: this.state.autoanswer == '3' ?'block':'none'}} className={this.props.oemId == "54" ? 'display-block' : 'display-hidden'}  label={(<span>{callTr("a_timestart")}&nbsp;</span>)} >
                   {getFieldDecorator('autoAnswerStart'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.checkoutTimeformat(data, value, callback)
                           }
                       }],
                       initialValue: this.props.itemValues['autoAnswerStart'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["autoAnswerStart"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem style={{display: this.state.autoanswer == '3' ?'block':'none'}} className={this.props.oemId == "54" ? 'display-block' : 'display-hidden'}  label={(<span>{callTr("a_timeend")}&nbsp;</span>)} >
                   {getFieldDecorator('autoAnswerEnd'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.checkoutTimeformat(data, value, callback)
                           }
                       }],
                       initialValue: this.props.itemValues['autoAnswerEnd'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["autoAnswerEnd"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_warmingtone")}&nbsp;<Tooltip title={this.tips_tr("Play warning tone for Auto Answer Intercom")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('warmingtone', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues["warmingtone"])
                   })(<Checkbox className={"P-" + nvram["warmingtone"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem style={{display: this.state.autoanswer == '2' ?'block':'none'}} label={(<span>{callTr("a_caiforaa")}&nbsp;<Tooltip title={this.tips_tr("Custom Alert-Info for Auto Answer")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('caiforaa'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['caiforaa'+curAccount]
                   })(
                       <Input type="text" className={"P-" + nvram["caiforaa"][curAccount]} />
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_interbarg")}&nbsp;<Tooltip title={this.tips_tr("Intercom Barging")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('interbarg', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues['interbarg'])
                   })(<Checkbox className={"P-" + nvram["interbarg"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem className = "select-item"　label={(<span>{callTr("a_autoprvw")}&nbsp;<Tooltip title={this.tips_tr("Auto Preview")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('autoprvw', {
                        initialValue: this.props.itemValues['autoprvw'] ? this.props.itemValues['autoprvw'] : "0"
                    })(<Select className={"P-" + nvram["autoprvw"][curAccount]}>
                        <Option value="0">{callTr("a_no")}</Option>
                        <Option value="1">{callTr("a_yes")}</Option>
                        <Option value="2">{callTr("a_autoprvm")}</Option>
                    </Select> )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_sendanoy")}&nbsp;<Tooltip title={this.tips_tr("Send Anonymous")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('sendanony', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['sendanony'])
                    })(<Checkbox className={"P-" + nvram["sendanony"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_anonycallrej")}&nbsp;<Tooltip title={this.tips_tr("Anonymous Call Rejection")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('anonyrej', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['anonyrej'])
                    })(<Checkbox className={"P-" + nvram["anonyrej"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem className = "select-item"  label={(<span>{callTr("a_calllog")}&nbsp;<Tooltip title={this.tips_tr("Call Log")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('calllog', {
                       initialValue: this.props.itemValues['calllog'] ? this.props.itemValues['calllog'] : "0"
                       })(
                           <Select className={"P-" + nvram["calllog"][curAccount]}>
                               <Option value="0">{callTr("a_logall")}</Option>
                               <Option value="1">{callTr("a_logmiss")}</Option>
                               <Option value="2">{callTr("a_lognone")}</Option>
                               <Option value="3">{callTr("a_lognomissed")}</Option>
                           </Select>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_encallfea")}&nbsp;<Tooltip title={<FormattedHTMLMessage id={this.tips_tr("Enable Call Features")} />}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablefea', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['enablefea'])
                    })(<Checkbox className={"P-" + nvram["enablefea"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_tranonhang")}&nbsp;<Tooltip title={this.tips_tr("Transfer on 3 way conference Hangup")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('tranonhang', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['tranonhang'])
                    })(<Checkbox className={"P-" + nvram["tranonhang"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_usepound")}&nbsp;<Tooltip title={this.tips_tr("Use # as Dial Key")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('dialkey', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['dialkey'])
                    })(<Checkbox className={"P-" + nvram["dialkey"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  label={(<span>{callTr("a_dndfeaon")}&nbsp;<Tooltip title={this.tips_tr("DND Call Feature On")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('dndfeaon'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['dndfeaon'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["dndfeaon"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_dndfeaoff")}&nbsp;<Tooltip title={this.tips_tr("DND Call Feature Off")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('dndfeaoff'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['dndfeaoff'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["dndfeaoff"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_nokeyentry")}&nbsp;<Tooltip title={this.tips_tr("No Key Entry Timeout")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('keytimeout'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 0, 30)
                           }
                       }],
                       initialValue: this.props.itemValues['keytimeout'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["keytimeout"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_ringto")}&nbsp;<Tooltip title={this.tips_tr("Ring Timeout")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('ringto'+curAccount, {
                       rules: [{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 0, 300)
                           }
                       }],
                       initialValue: this.props.itemValues['ringto'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["ringto"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_referto")}&nbsp;<Tooltip title={this.tips_tr("Refer-To Use Target Contact")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('targetcon', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues['targetcon'])
                   })(
                       <Checkbox />
                   )}
               </FormItem>
               <FormItem  label={(<span>{'RFC2543 Hold'}&nbsp;<Tooltip title={this.tips_tr("RFC2543 Hold")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('RFC2543Hold', {
                       initialValue: this.props.itemValues['RFC2543Hold'] ? this.props.itemValues['RFC2543Hold'] : '0'
                   })(
                       <RadioGroup className={"P-" + nvram["RFC2543Hold"][curAccount]}>
                           <Radio value="0">{callTr('a_no')}</Radio>
                           <Radio value="1">{callTr('a_yes')}</Radio>
                       </RadioGroup>
                   )
                   }
               </FormItem>
               <p className="blocktitle"><s></s>{callTr("a_callforward")}</p>
               <FormItem className = "select-item"  label={(<span>{callTr("a_cftype")}&nbsp;<Tooltip title={this.tips_tr("Call Forward Type")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('cftype', {
                       initialValue: this.props.itemValues['cftype'] ? this.props.itemValues['cftype'] : "None"
                       })(
                           <Select onChange = {this.hanleCallTransferType} className={"P-" + nvram["cftype"][curAccount]}>
                               <Option value="None">{callTr("a_none")}</Option>
                               <Option value="allTo">{callTr("a_uccf")}</Option>
                               <Option value="TimeRule">{callTr("a_timecf")}</Option>
                               <Option value="WorkRule">{callTr("a_workcf")}</Option>
                           </Select>
                   )}
               </FormItem>
               <FormItem  className = "alltoTtem None AllTo" label={(<span>{callTr("a_allto")}&nbsp;<Tooltip title={this.tips_tr("All To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('uccf'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['uccf'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["uccf"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  className = "timecfItem None TimeRule" label={(<span>{callTr("a_timerd")}&nbsp;<Tooltip title={this.tips_tr("Time Period")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   <FormItem>
                       {getFieldDecorator('timecffrom'+curAccount, {
                           rules: [{
                               validator: (data, value, callback) => {
                                   this.checkoutTimeformat(data, value, callback)
                               }
                           }],
                           initialValue: this.props.itemValues['timecffrom'+curAccount] ? this.props.itemValues['timecffrom'+curAccount] : '09:00'
                           })(
                               <Input type="text" className={"short-input"+" "+"P-" + nvram["timecffrom"][curAccount]}/>
                       )}
                   </FormItem>
                   <div style={{'float':'left', 'margin-right':'15px'}}>~</div>
                   <FormItem>
                       {getFieldDecorator('timecfto'+curAccount, {
                           rules: [{
                               validator: (data, value, callback) => {
                                   this.checkoutTimeformat(data, value, callback)
                               }
                           }],
                           initialValue: this.props.itemValues['timecfto'+curAccount] ? this.props.itemValues['timecfto'+curAccount] : '21:00'
                           })(
                             <Input type="text" className={"short-input"+" "+"P-" + nvram["timecfto"][curAccount]}/>
                       )}
                   </FormItem>
               </FormItem>
               <FormItem  className = "intimetoItem None TimeRule" label={(<span>{callTr("a_intimeto")}&nbsp;<Tooltip title={this.tips_tr("In Time Forward To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('intimeto'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['intimeto'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["intimeto"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  className = "outtimetoItem None TimeRule" label={(<span>{callTr("a_outtimeto")}&nbsp;<Tooltip title={this.tips_tr("Out Time Forward To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('outtimeto'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                        }],
                        initialValue: this.props.itemValues['outtimeto'+curAccount]
                        })(
                           <Input type="text" className={"P-" + nvram["outtimeto"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  className = "enablebusytoItem None WorkRule" label={(<span>{callTr("a_enablebusyto")}&nbsp;<Tooltip title={this.tips_tr("Enable Busy Forward")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablebusyto', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['enablebusyto'])
                    })(<Checkbox className={"P-" + nvram["enablebusyto"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  className = "busytoItem None WorkRule" label={(<span>{callTr("a_busyto")}&nbsp;<Tooltip title={this.tips_tr("Busy To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('busyto'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['busyto'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["busyto"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  className = "enablenoanswertoItem None WorkRule" label={(<span>{callTr("a_enablenoanswerto")}&nbsp;<Tooltip title={this.tips_tr("Enable No Answer Forward")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enablenoanswerto', {
                        valuePropName: 'checked',
                        initialValue: parseInt(this.props.itemValues['enablenoanswerto'])
                    })(<Checkbox className={"P-" + nvram["enablenoanswerto"][curAccount]}/>)
                   }
               </FormItem>
               <FormItem  className = "noanswertoItem None WorkRule" label={(<span>{callTr("a_noanswerto")}&nbsp;<Tooltip title={this.tips_tr("No Answer To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('noanswerto'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['noanswerto'+curAccount]
                       })(
                           <Input type="text" className={"P-" + nvram["noanswerto"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  className = "forwardwtItem None WorkRule" label={(<span>{callTr("a_forwardwt")}&nbsp;<Tooltip title={this.tips_tr("No Answer Timeout")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('forwardwt'+curAccount, {
                       rules: [{
                           message: callTr("tip_require")
                       },{
                           validator: (data, value, callback) => {
                               this.digits(data, value, callback)
                           }
                       },{
                           validator: (data, value, callback) => {
                               this.range(data, value, callback, 1, 120)
                           }
                       }],
                       initialValue: this.props.itemValues['forwardwt'+curAccount] ? this.props.itemValues['forwardwt'+curAccount] : '20'
                       })(
                           <Input type="text" className={"P-" + nvram["forwardwt"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  className = "enabledndforwardItem None WorkRule" label={(<span>{callTr("a_enabledndforward")}&nbsp;<Tooltip title={this.tips_tr("Enable DND Forward")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('enabledndforward', {
                       valuePropName: 'checked',
                       initialValue: parseInt(this.props.itemValues['enabledndforward'])
                   })(<Checkbox />)
                   }
               </FormItem>
               <FormItem  className = "dndtoItem None WorkRule" label={(<span>{callTr("a_dndto")}&nbsp;<Tooltip title={this.tips_tr("DND To")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('dndto'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: this.props.itemValues['dndto'+curAccount]
                   })(
                       <Input type="text" />
                   )}
               </FormItem>



               <p className="blocktitle"><s></s>{callTr("a_dialplan")}</p>
               <FormItem  label={(<span>{callTr("a_dialplanpr")}&nbsp;<Tooltip title={this.tips_tr("Dial Plan Prefix")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('prefix'+curAccount, {
                       rules: [{
                           max:64,message: callTr("max_length64"),
                       }],
                       initialValue: itemValues['prefix'+curAccount]
                   })(
                       <Input type="text" className={"P-" + nvram["prefix"][curAccount]}/>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_disdialplan")}&nbsp;<Tooltip title={this.tips_tr(this.isWP8xx() ? "Disable DialPlan For WP800" : "Disable DialPlan")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('disdialpage', {
                       valuePropName: 'checked',
                       initialValue: parseInt(dialplancheck[4])
                   })(
                       <Checkbox>{callTr("a_disdialpage")}</Checkbox>
                   )}
                   {getFieldDecorator('discontact', {
                       valuePropName: 'checked',
                       initialValue: parseInt(dialplancheck[3])
                   })(
                       <Checkbox>{callTr("a_discontact")}</Checkbox>
                   )}
                   {getFieldDecorator('disincoming', {
                       valuePropName: 'checked',
                       initialValue: parseInt(dialplancheck[2])
                   })(
                       <Checkbox>{callTr("a_disincoming")}</Checkbox>
                   )}
                   {getFieldDecorator('disoutgoing', {
                       valuePropName: 'checked',
                       initialValue: parseInt(dialplancheck[1])
                   })(
                       <Checkbox>{callTr("a_disoutgoing")}</Checkbox>
                   )}
                   {!this.isWP8xx() && product !== "GAC2510" ? getFieldDecorator('dismpkclick', {
                       valuePropName: 'checked',
                       initialValue: parseInt(dialplancheck[0])
                   })(
                       <Checkbox>{callTr("a_dismpkclick")}</Checkbox>
                   ) : ""}

               </FormItem>
               <FormItem  label={(<span>{callTr("a_dialplan")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("DialPlan")} />} ><Icon type="question-circle-o" /></Tooltip></span>)} >
                   {getFieldDecorator('dialplan'+curAccount, {
                       rules: [],
                       initialValue: itemValues['dialplan'+curAccount]
                   })(
                       <Input type="text" className={"P-" + nvram["dialplan"][curAccount]}/>
                   )}
               </FormItem>
               <p className="blocktitle"><s></s>{callTr("a_callerids")}</p>
               <FormItem className = "select-item"  label={(<span>{callTr("a_callerdisplay")}&nbsp;<Tooltip title={this.tips_tr("Caller ID Display")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('callerdisplay', {
                       initialValue: itemValues['callerdisplay'] ? itemValues['callerdisplay'] : "0"
                   })(
                       <Select className={"P-" + nvram["callerdisplay"][curAccount]}>
                           <Option value="0">{callTr("a_auto")}</Option>
                           <Option value="1">{callTr("a_disabled")}</Option>
                           <Option value="2">{callTr("a_fromheader")}</Option>
                           {/*<Option value="3">{callTr("a_PAIheader")}</Option>*/}
                       </Select>
                   )}
               </FormItem>
               <p className="blocktitle"><s></s>{callTr("a_ringtone")}</p>
               <FormItem className = "select-item"  label={(<span>{callTr("a_defaultringtone")}&nbsp;<Tooltip title={this.tips_tr("Account Ring Tone")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('defaultringtone', {
                       initialValue: itemValues['defaultringtone'] ? itemValues['defaultringtone'] : 'content://settings/system/ringtone'
                   })(
                       <Select>
                           <Option value="content://settings/system/ringtone">{callTr("a_sysdefault")}</Option>
                           <Option value="ringtone_silence">Silent</Option>
                           {children}
                       </Select>
                   )}
               </FormItem>
               <FormItem  label={(<span>{callTr("a_ignoreAIheader")}&nbsp;<Tooltip title={this.tips_tr("Ignore Alert-Info header")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                   {getFieldDecorator('ignalertinfo', {
                       valuePropName: 'checked',
                       initialValue: parseInt(itemValues['ignalertinfo'])
                   })(
                       <Checkbox />
                   )}
               </FormItem>
               <Row gutter={30} style={{width:'1500px',marginLeft:'17px'}}>
                   <Col span={2}></Col>
                   <Col className="ring-capture" span={4} style={{marginLeft:'13px',marginRight:'14px',paddingLeft:'0'}}>
                       <span>{callTr("a_matchincad")}</span>
                   </Col>
                   <Col className="ring-capture" span={4}>
                       <span>{callTr("a_cusrtone")}</span>
                   </Col>
                   <Col span={21}></Col>
               </Row>
               <Row gutter={30} style={{width:'1500px',marginLeft:'17px',marginBottom:'20px'}}>
                   <Col span={2}></Col>
                   <Col span={4} style={{marginLeft:'13px',marginRight:'14px',paddingLeft:'0'}}>
                       {getFieldDecorator('callerid1'+curAccount, {
                           rules: [{
                               max:64,message: callTr("max_length64"),
                           }],
                           initialValue: itemValues['callerid1'+curAccount]
                       })(
                           <Input type="text" style={{width:'100%'}} className={"P-" + nvram["callerid1"][curAccount]}/>
                       )}
                   </Col>
                   <Col span={4}>
                       {getFieldDecorator('tonename1', {
                           initialValue: itemValues['tonename1'] ? itemValues['tonename1'] : "content://settings/system/ringtone"
                       })(
                           <Select style={{width:'100%'}} className={"P-" + nvram["tonename1"][curAccount]}>
                               <Option value="content://settings/system/ringtone">{callTr("a_sysdefault")}</Option>
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
                       {getFieldDecorator('callerid2'+curAccount, {
                           rules: [{
                               max:64,message: callTr("max_length64"),
                           }],
                           initialValue: itemValues['callerid2'+curAccount]
                       })(
                           <Input type="text" style={{width:'100%'}} className={"P-" + nvram["callerid2"][curAccount]}/>
                       )}
                   </Col>
                   <Col span={4}>
                       {getFieldDecorator('tonename2', {
                           initialValue: itemValues['tonename2'] ? itemValues['tonename2'] : "content://settings/system/ringtone"
                       })(
                           <Select style={{width:'100%'}} className={"P-" + nvram["tonename2"][curAccount]}>
                               <Option value="content://settings/system/ringtone">{callTr("a_sysdefault")}</Option>
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
                       {getFieldDecorator('callerid3'+curAccount, {
                           rules: [{
                               max:64,message: callTr("max_length64"),
                           }],
                           initialValue: itemValues['callerid3'+curAccount]
                       })(
                           <Input type="text" style={{width:'100%'}} className={"P-" + nvram["callerid3"][curAccount]}/>
                       )}
                   </Col>
                   <Col span={4}>
                       {getFieldDecorator('tonename3', {
                           initialValue: itemValues['tonename3'] ? itemValues['tonename3'] : "content://settings/system/ringtone"
                       })(
                           <Select style={{width:'100%'}} className={"P-" + nvram["tonename3"][curAccount]}>
                               <Option value="content://settings/system/ringtone">{callTr("a_sysdefault")}</Option>
                               <Option value="ringtone_silence">Silent</Option>
                               {children}
                           </Select>
                       )}
                   </Col>
                   <Col span={10}></Col>
               </Row>
               <FormItem>
                   <Button className="submit" type="primary" size="large" onClick={this.handleSubmit}>{callTr("a_save")}</Button>
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
