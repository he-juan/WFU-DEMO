import React, { Component, PropTypes } from 'react'
import Enhance from "../../mixins/Enhance";
import { FormattedHTMLMessage } from 'react-intl'
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Store from '../../entry'
import { Layout, Form, Tooltip, Icon, Button, Select, Input, Table, Popconfirm, Tabs } from "antd";
const FormItem = Form.Item;
const Content = Layout;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const {Column} = Table;
let req_items = new Array;
let acctname_item = ['270','417','517','617','1717','1817',"50617","50717","50817","50917","51017","51117","51217","51317","51417","51517"];
let accountactive = ["271", "401", "501", "601", "1701", "1801","50601","50701","50801","50901","51001","51101","51201","51301","51401","51501"];
let sipserver = ["47", "402", "502", "602", "1702", "1802","50602","50702","50802","50902","51002","51102","51202","51302","51402","51502"];
let userid = ["35", "404", "504", "604", "1704", "1804","50604","50704","50804","50904","51004","51104","51204","51304","51404","51504"];

const nvram = {
    'vpkmode' : ["323","324","325","326","327","328","329","353","357","361","365","369","373","377","381","385"],
    'vpkacct' : ["301","304","307","310","313","316","319","354","358","362","366","370","374","378","382","386"],
    'vpkname' : ["302","305","308","311","314","317","320","355","359","363","367","371","375","379","383","387"],
    'vpkuserid' : ["303","306","309","312","315","318","321","356","360","364","368","372","376","380","384","388"],
    'vpkdtmf' : ["26052","26152","26252","26352","26452","26552","52652","52752","52852","52952","53052","53152","53252","53352","53452","53552"],
    'matchCallNumIp' : ["26053","26153","26253","26353","26453","26553","52653","52753","52853","52953","53053","53153","53253","53353","53453","53553"]
};
let checkAcctRig = []
class VpkForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            vpkacct: 0,
            dtmf:false,
            addedAcct: [],
            defaultAcct: [],
            keyMode:"0",
            dtmfMode:"0",
            checkAcctRig:"",
        }
    }

    handlePvalue = (operatename) => {
         let [getReqItem,vpkdata] = [this.props.getReqItem,this.props.vpkdata]
         let acctIdx,AddVpkOrder;
         req_items = [];

         if( operatename == "a_17") {
             acctIdx = this.props.VpkEditIdx
             AddVpkOrder = parseInt(vpkdata[acctIdx].vpkOrder)
         } else {
             if(vpkdata.length > 0) {
                 let flag = false;  //下标是否连续的标志
                 let orderArr = this.props.vpkOrder
                 for(let i = 0;i<orderArr.length;i++) {
                   if(!new Set(orderArr).has(`${i}`)) {
                       AddVpkOrder = i;
                       flag = true;
                       break;
                   }
                 }

                 if(!flag) {
                     AddVpkOrder = orderArr.length;
                 }
             } else {
                 AddVpkOrder = 0
             }
         }
         req_items.push(
             getReqItem("vpkmode"+AddVpkOrder, nvram["vpkmode"][AddVpkOrder], ""),
             getReqItem("vpkacct"+AddVpkOrder, nvram["vpkacct"][AddVpkOrder], ""),
             getReqItem("vpkname"+AddVpkOrder, nvram["vpkname"][AddVpkOrder], ""),
             getReqItem("vpkuserid"+AddVpkOrder, nvram["vpkuserid"][AddVpkOrder], ""),
             getReqItem("vpkdtmf"+AddVpkOrder, nvram["vpkdtmf"][AddVpkOrder], ""),
             getReqItem("matchCallNumIp"+AddVpkOrder, nvram["matchCallNumIp"][AddVpkOrder], "")
         )
         for(let i = 0 ;i<vpkdata.length;i++) {
             let vpkidx = parseInt(vpkdata[i].vpkOrder)
             req_items.push(
                 getReqItem("name"+vpkdata[i].vpkOrder, acctname_item[vpkidx], "")
             );
         }
         return [req_items,AddVpkOrder];
    }

    checkAcctRigster = () => {
        let checkAcctArr = []
        let getReqItem = this.props.getReqItem
        for(let i=0;i<16;i++) {
            checkAcctArr.push(
                getReqItem("name"+i,acctname_item[i], ""),
                getReqItem("accountactive"+i, accountactive[i], ""),
                getReqItem("sipserver"+i, sipserver[i], ""),
                getReqItem("userid"+i, userid[i], "")
            )
        }
        return checkAcctArr;
    }

    handleVpkAcctChange = (val) => {
        this.setState({vpkacct:parseInt(val)})
    }

    handleCancel = (init) => {
        const form = this.props.form;
        form.setFieldsValue({
            vpkname: "",
            vpkuserid: "",
            vpkAddress: "",
            vpkdtmfContent: "",
            matchCallNumIp: ""
        });
        this.props.onChangeState("a_23");
        if (init != 'init') {
            this.props.handleVpkFormHideShow('hide')
        }
    }

    componentDidMount = () => {
        this.props.transferKeyModeFun(this.handleKeyModeChange)
        this.props.transferDtmfChange(this.handleDtmfChange)
        this.handleKeyModeChange("0")
        this.handleCancel('init');
        this.props.getItemValues(this.checkAcctRigster(),(values) => {
            checkAcctRig = values;
            this.setState({checkAcctRig:values})
        })
        document.getElementsByClassName("vpklist")[0].style.top = '-30px'
    }

    handleKeyModeChange = (selChange,val) => {
        if(selChange == 'initKeyMode') {
            this.props.form.setFieldsValue({
                vpkmode: "0",
                vpkname: "",
                vpkuserid: "",
                vpkAddress: "",
                vpkdtmfContent: "",
                matchCallNumIp: ""
            });
        }
        if(selChange == 'selChange') {
            this.props.form.setFieldsValue({
                vpkname: "",
                vpkuserid: "",
                vpkAddress: "",
                vpkdtmfContent: "",
                matchCallNumIp: ""
            });
        } else {
            val = selChange;
        }
        let vpkItem = Array.from(document.getElementsByClassName("vpkItem")).forEach((item) => {
            item.style.display = "none"
        })
        this.setState({dtmf:false,keyMode:"0"})
        if(val != 17 && !(val == 5 && this.props.form.getFieldValue('vpkdtmf') == '3') ) {
            document.getElementsByClassName("vpklist")[0].style.top = '0'
        }
        switch (val) {
            case "17":
                document.getElementsByClassName("vpkacct")[0].style.display = "block"
                this.setState({keyMode:"17"})
                let top = this.props.disableAddBtn == true ? '-92' : '-30';
                document.getElementsByClassName("vpklist")[0].style.top = top + 'px';
                break;
            case "4":
                Array.from(document.getElementsByClassName("acctModeHide")).forEach((item) => {
                    item.style.display = "block"
                })
                this.setState({keyMode:"4"})
                break;
            case "13":
                Array.from(document.getElementsByClassName("acctModeHide")).forEach((item) => {
                    item.style.display = "block"
                })
                document.getElementsByClassName("vpklist")[0].style.top = '-46px';
                this.setState({keyMode:"13"})
                break;
            case "5":
                Array.from(document.getElementsByClassName("showDtmf")).forEach((item) => {
                    item.style.display = "block"
                })
                if(this.props.form.getFieldValue('vpkdtmf') == '3') {
                    this.handleDtmfChange('3')
                }
                this.setState({dtmf:true,keyMode:'5'})
                break;
            default:
                Array.from(document.getElementsByClassName("vpkItem")).forEach((item) => {
                    item.style.display = "block"
                })
                Array.from(document.getElementsByClassName("vpkdtmf")).forEach((item) => {
                    item.style.display = "none"
                })
        }
        //return defaultAcct;
    }

    handleDtmfChange = (val) => {
        this.setState({dtmfMode:val})
        if(val == "3") {
            document.getElementsByClassName("matchCallNumIp")[0].style.display = "block"
            document.getElementsByClassName("vpklist")[0].style.top = '46px'
        } else {
            document.getElementsByClassName("matchCallNumIp")[0].style.display = "none"
            document.getElementsByClassName("vpklist")[0].style.top = '0'
        }
    }

    checkCastFormatInvalid = ( ipstr ) => {
        if( ipstr == "" ) return true;
        var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if(re.test(ipstr))
        {
            if( RegExp.$1>223 && RegExp.$1<240 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256)
                return true;
        }
        return false;
    }

    handleValid = (operatename) => {

        let result = this.checkSameVpk(operatename)
        if (result === false) {
            Store.store.dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: "a_acctblfexist"}});
            return false;
        }

        if( this.state.keyMode != '4' && this.state.keyMode != '5' && this.state.keyMode != '13' ) {
            if(this.props.form.getFieldValue("vpkacct") == null) {
                Store.store.dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: "a_accempty"}});
                return false;
            }

        }

        if(this.state.keyMode == '5') {
            var dtmfContent = this.props.form.getFieldValue("vpkuserid");
            var Exp = new RegExp("^[0-9abcdABCD,;*#]*$");
            if(!Exp.test(dtmfContent)) {
                Store.store.dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: "a_dtmfcontentlimit"}});
                return false;
            }
        }

        let valid = 1;
        if (this.state.keyMode == "13") {
            var ipaddr = this.props.form.getFieldValue("vpkuserid");
            if( ipaddr != "" ) {
                ipaddr = $.trim(ipaddr);
                var ipports = ipaddr.split(":");
                if( ipports.length != 2 ){
                    valid = 0;
                }else{
                    if( !this.checkCastFormatInvalid( ipports[0] )){
                        valid = 0;
                    }else{
                        var numExp = new RegExp("^[0-9]*$");
                        var port = parseInt(ipports[1], 10);
                        if(!numExp.test(ipports[1]) || ipports[1] == "" || port < 1 || port > 65535 ) {
                            valid = 0;
                        }
                    }
                }
            }
        }
        if( valid == 0 ) {
            Store.store.dispatch({type: 'MSG_PROMPT', notifyMsg: {type: "ERROR", content: "a_multicastipporterror"}});
            return false;
        }

    }

    checkSameVpk = (operatename) => {
        let vpkdata = this.props.vpkdata
        let values = this.props.form.getFieldsValue()
        switch (this.state.keyMode) {
            case '17':
                for(let i = 0; i < vpkdata.length; i++) {
                    if(operatename == 'a_17' && i == this.props.VpkEditIdx) {
                        continue;
                    }
                    if(vpkdata[i]['vpkmodeval'] == '17' && vpkdata[i].vpkacctval == values['vpkacct'] ) {
                        return false;
                    }
                }
                break;
            case '5':
                for(let i = 0; i < vpkdata.length; i++) {
                    if(operatename == 'a_17' && i == this.props.VpkEditIdx) {
                        continue;
                    }
                    if(vpkdata[i]['vpkmodeval'] == values['vpkmode'] && vpkdata[i]['vpkdtmfContent'] == values['vpkuserid'] && vpkdata[i]['vpkdtmf'] == values['vpkdtmf'] ) {
                        return false;
                    }
                }
                break;
            case '4':
            case '13':
                for(let i = 0; i < vpkdata.length; i++) {
                    if(operatename == 'a_17' && i == this.props.VpkEditIdx) {
                        continue;
                    }
                    if(vpkdata[i]['vpkmodeval'] == values['vpkmode'] && vpkdata[i]['vpkAddress'] == values['vpkuserid'] ) {
                        return false;
                    }
                }
                break;
            default:
                for(let i=0;i < vpkdata.length; i++) {
                    if(operatename == 'a_17' && i == this.props.VpkEditIdx) {
                        continue;
                    }
                    if(vpkdata[i]['vpkmodeval'] == values['vpkmode'] && vpkdata[i]['vpkacctval'] == values['vpkacct'] && vpkdata[i]['vpkuserid'] == values['vpkuserid']) {
                        return false;
                    }
                }
        }
    }

    handleSubmit = (operatename,e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              let result = this.handleValid(operatename)
              if(result === false) {
                  return false;
              }
              for (let key in values) {
                  if(values[key] == undefined) {
                      values[key] = ""
                  }
              }
              let req_items_arr = this.handlePvalue(operatename);
              req_items_arr[0].splice(6,req_items_arr[0].length-1)
              let vpkOrder = this.props.vpkOrder;
              if(operatename == 'a_23') {
                  if(vpkOrder[0] == "") {
                      vpkOrder = []
                  }
                  vpkOrder.push(`${req_items_arr[1]}`)
              }
              this.props.changeVpkOrderState(vpkOrder)
              this.props.handleVpkFormHideShow('hide')
              this.props.setVpkValues(req_items_arr[0], values,1,req_items_arr[1],this.state.keyMode,this.props.getVpkItemsValues,vpkOrder,this.handleKeyModeChange);
          }
        });
     }

    render() {
        const { getFieldDecorator } = this.props.form;
        const [callTr,tips_tr,itemValues,checkAcctRig,ipvtExist,keyMode] = [this.props.callTr,this.props.tips_tr,this.props.itemValues,this.state.checkAcctRig,this.props.ipvtExist,this.state.keyMode];
        return (
            <Form onSubmit={this.handleSubmit.bind(this,this.props.operatename)} hideRequiredMark>
                <FormItem className = "select-item"  label={(<span>{callTr("a_keymode")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={tips_tr("Key Mode VPK")} />} ><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('vpkmode', {
                        initialValue: this.props.itemValues['vpkmode'] ? this.props.itemValues['vpkmode'] : "0"
                        })(
                            <Select onChange = {this.handleKeyModeChange.bind(this,'selChange')} disabled={!this.props.disableAddBtn}>
                                <Option value="17">{callTr("a_301")}</Option>
                                <Option value="0">{callTr("a_speeddial")}</Option>
                                <Option value="1">{callTr("a_busy")}</Option>
                                <Option value="8">{callTr("a_callredir")}</Option>
                                <Option value="10">{callTr("a_callintercom")}</Option>
                                <Option value="4">{callTr("a_dialvia")}</Option>
                                <Option value="5">{callTr("a_dtmfdial")}</Option>
                                <Option value="9">{callTr("a_callpark")}</Option>
                                <Option value="13">{callTr("a_multipaging")}</Option>
                                <Option value="15">{callTr("a_conference")}</Option>
                                <Option value="16">{callTr("a_dialprefix")}</Option>
                            </Select>
                    )}
                </FormItem>
                <FormItem className = "select-item vpkItem vpkacct"  label={(<span>{callTr("a_account")}&nbsp;<Tooltip title={tips_tr("Account VPK")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('vpkacct', {
                        initialValue: this.props.itemValues['vpkacct'] ? this.props.itemValues['vpkacct'] : (checkAcctRig['sipserver0'] != "" && checkAcctRig['accountactive0'] == "1" && checkAcctRig['userid0'] != "") ? '0' : null
                        })(
                            <Select onChange = {this.handleVpkAcctChange} disabled={!this.props.disableAddBtn}>
                            {
                                acctname_item.map((val,i,arr) => {
                                    if (typeof checkAcctRig === 'object' && checkAcctRig['accountactive'+i] == "1" && checkAcctRig['sipserver'+i] != "" && checkAcctRig['userid'+i] != "") {
                                        if(keyMode=='17' || keyMode!= '17' && ipvtExist == '0') {
                                            return <Option value={`${i}`}>{checkAcctRig["name"+i] ? checkAcctRig["name"+i] : checkAcctRig["userid"+i]}</Option>
                                        } else if(keyMode!= '17' && ipvtExist == '1' && i<15) {
                                            return <Option value={`${i}`}>{checkAcctRig["name" + i] ? checkAcctRig["name" + i] : checkAcctRig["userid" + i]}</Option>
                                        } else {
                                            return <Option value={`${i}`} style={{display:'none'}}></Option>
                                        }
                                    } else {
                                        return <Option value={`${i}`} style={{display:'none'}}></Option>
                                    }
                                })
                            }
                            </Select>
                    )}
                </FormItem>
                <FormItem  className = "vpkItem acctModeHide showDtmf"　label={(<span>{callTr("a_name")}&nbsp;<Tooltip title={tips_tr("Name VPK")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('vpkname', {
                        rules: [{
                            required:this.state.keyMode == "17" ? false : true,max:64,message: callTr("max_length64"),
                        }],
                        initialValue: this.props.itemValues['vpkname']
                        })(
                            <Input type="text" disabled={!this.props.disableAddBtn} />
                    )}
                </FormItem>
                <FormItem  className = "vpkItem acctModeHide showDtmf" label={(<span>{callTr(`${this.state.dtmf == true ? "a_dtmfcontent" : this.state.keyMode == "13" ? "a_address" : "a_userid" }`)}&nbsp;<Tooltip title={tips_tr(`${this.state.keyMode == '5' ? 'DTMF Content' : this.state.keyMode == '13' ? 'Multicast Paging Address' : 'UserID VPK' }`)}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('vpkuserid', {
                        rules: [{
                            required:this.state.keyMode == "17" ? false : true,max:64,message: callTr("max_length64"),
                        }],
                        initialValue: this.props.itemValues['vpkuserid']
                        })(
                            <Input type="text" disabled={!this.props.disableAddBtn} />
                    )}
                </FormItem>
                <FormItem className = "select-item vpkItem showDtmf vpkdtmf"  label={(<span>{callTr("a_dtmfcond")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={tips_tr("Dial DTMF Condition")} />} ><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('vpkdtmf', {
                        initialValue: this.props.itemValues['vpkdtmf'] ? this.props.itemValues['vpkdtmf'] : "0"
                        })(
                            <Select onChange = {this.handleDtmfChange}>
                                <Option value="0">{callTr("a_inandoutcall")}</Option>
                                <Option value="1">{callTr("a_incallonly")}</Option>
                                <Option value="2">{callTr("a_outcallonly")}</Option>
                                <Option value="3">{callTr("a_matchedcall")}</Option>
                            </Select>
                    )}
                </FormItem>
                <FormItem  className = "vpkItem vpkdtmf matchCallNumIp"　label={(<span>{callTr("a_dtmfcondcid")}&nbsp;<Tooltip title={tips_tr("Dial DTMF Condition Matched Caller Number Or IP")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                    {getFieldDecorator('matchCallNumIp', {
                        rules: [{
                            required: (this.state.keyMode == "5" && this.state.dtmfMode == "3") ? true : false,max:64,message: callTr("max_length64"),
                        }],
                        initialValue: this.props.itemValues['matchCallNumIp']
                        })(
                            <Input type="text" />
                    )}
                </FormItem>
                <FormItem className="operatebtn">
                    <Button className="cancel" size="large" onClick={this.handleCancel}>{callTr("a_3")}</Button>
                    <Button className="submit" type="primary" htmlType="submit" size="large" disabled={this.props.disableAppend}>
                        {callTr(this.props.operatename)}
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

const SysappVpkForm = Form.create()(VpkForm);
class Vpk extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedRowKeys: [], //configure the default column
            vpkdata: [],
            operatename: "a_23",
            VpkEditIdx:"",
            disableAppend: false,
            disableAddBtn: false,
            vpkOrder:[],
            handleKeyModeChange:new Function(),
            handleDtmfChange:new Function(),
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(this.props.curLocale != nextProps.curLocale) {
            return true
        }
        let curItemValues = [],nextItemValues = []
        for(let key in this.props.itemValues) {
            curItemValues.push(this.props.itemValues[key])
        }
        for(let key in nextItemValues.itemValues) {
            nextItemValues.push(nextItemValues.itemValues[key])
        }
        if (curItemValues.length != nextItemValues.length) {
            return true
        }
        let result = curItemValues.some((curItem,index,arr) => {
            return curItem != nextItemValues[index]
        })
        return result
    }

    saveFormRef = (form) => {
        this.form = form;
    }

    componentDidMount = () => {
        let vpkOrder = this.props.getVpkOrder()
        this.setState({vpkOrder:vpkOrder})
        this.getVpkItemsValues(vpkOrder)
    }

    getVpkModeName = (key) => {
        let name = ""
        switch (key) {
            case "17":
                name = "a_301"
                break;
            case "0":
                name = "a_speeddial"
                break;
            case "1":
                name = "a_busy"
                break;
            case "8":
                name = "a_callredir"
                break;
            case "10":
                name = "a_callintercom"
                break;
            case "4":
                name = "a_dialvia"
                break;
            case "5":
                name = "a_dtmfdial"
                break;
            case "9":
                name = "a_callpark"
                break;
            case "13":
                name = "a_multipaging"
                break;
            case "15":
                name = "a_conference"
                break;
            case "16":
                name = "a_dialprefix"
                break;
        }
        return name;
    }

    getDTMFName = (key) => {
        let name = ""
        switch (key) {
            case "0":
                name = "a_inandoutcall"
                break;
            case "1":
                name = "a_incallonly"
                break;
            case "2":
                name = "a_outcallonly"
                break;
            case "3":
                name = "a_matchedcall"
        }
        return name;
    }

    getVpkItemsValues = (vpkOrder) => {
        if(vpkOrder.length == 0 || vpkOrder[0] == "") {
            this.setState({ vpkdata: [] });
            return 0;
        }
        let req_items = [];
        for(let i = 0; i < vpkOrder.length; i++){
            req_items.push(
                this.getReqItem("vpkmode"+vpkOrder[i], nvram["vpkmode"][vpkOrder[i]], ""),
                this.getReqItem("vpkacct"+vpkOrder[i], nvram["vpkacct"][vpkOrder[i]], ""),
                this.getReqItem("vpkname"+vpkOrder[i], nvram["vpkname"][vpkOrder[i]], ""),
                this.getReqItem("vpkuserid"+vpkOrder[i], nvram["vpkuserid"][vpkOrder[i]], ""),
                this.getReqItem("vpkdtmf"+vpkOrder[i], nvram["vpkdtmf"][vpkOrder[i]], ""),
                this.getReqItem("matchCallNumIp"+vpkOrder[i], nvram["matchCallNumIp"][vpkOrder[i]], ""),
                this.getReqItem("accountactive"+vpkOrder[i], accountactive[vpkOrder[i]], "")
            );
        }
        this.props.getItemValues(req_items,(values) => {
            this.getItemValuesCallback(values,vpkOrder)
            this.onChangeState('a_23',vpkOrder.length)
        })
    }

    getItemValuesCallback = (values,Order) => {
        let tempvpk = [];
        let vpkOrders = Order;
        for(let j = 0; j < vpkOrders.length; j++){
            let vpkOrder = vpkOrders[j];
            let vpkmode = this.getVpkModeName(values["vpkmode"+vpkOrder]),
                vpkacct = checkAcctRig["name"+values["vpkacct"+vpkOrder]] != "" ? checkAcctRig["name"+values["vpkacct"+vpkOrder]] : checkAcctRig["userid"+values["vpkacct"+vpkOrder]] ,
                vpkname = values["vpkname"+vpkOrder],
                vpkuserid = values["vpkuserid"+vpkOrder],
                vpkdtmfContent = values["vpkuserid"+vpkOrder],
                vpkAddress = values["vpkuserid"+vpkOrder],
                vpkdtmf = values["vpkdtmf"+vpkOrder],
                matchCallNumIp = values["matchCallNumIp"+vpkOrder];

            if (values["vpkmode"+vpkOrder] == "17") {
                [vpkname, vpkuserid, vpkdtmfContent, vpkAddress, vpkdtmf, matchCallNumIp] = ["--", "--", "--", "--", "--", "--"]
            } else if (values["vpkmode"+vpkOrder] == "4") {
                [vpkacct,vpkdtmfContent,vpkAddress,vpkdtmf,matchCallNumIp] = ["--","--","--","--","--"]
            } else if (values["vpkmode"+vpkOrder] == "13") {
                [vpkacct,vpkdtmfContent,vpkuserid,vpkdtmf,matchCallNumIp] = ["--","--","--","--","--"]
            } else if (values["vpkmode"+vpkOrder] == "5") {
                [vpkacct,vpkuserid,vpkAddress] = ["--","--","--"];
                if(vpkdtmf != "3") {
                    matchCallNumIp = "--"
                }
                vpkdtmf = this.getDTMFName(vpkdtmf);
            } else if (values["vpkmode"+vpkOrder] == "-1") {
                [vpkmode,vpkacct,vpkname,vpkuserid,vpkdtmfContent,vpkAddress,vpkdtmf,matchCallNumIp] = ["","","","","","","",""]
            } else {
                [vpkdtmfContent,vpkAddress,vpkdtmf,matchCallNumIp] = ["--","--","--","--"]
            }

            tempvpk.push({
                key: j+1,
                vpkmode: vpkmode,
                vpkmodeval:values["vpkmode"+vpkOrder],
                vpkacct: vpkacct,
                vpkacctval: values["vpkacct"+vpkOrder],
                vpkname: vpkname,
                vpkuserid: vpkuserid,
                vpkAddress:vpkAddress,
                vpkdtmfContent:vpkdtmfContent,
                vpkdtmf: vpkdtmf,
                vpkdtmfval:values["vpkdtmf"+vpkOrder],
                accountactive : values["accountactive"+vpkOrder],
                matchCallNumIp : matchCallNumIp,
                vpkOrder:vpkOrder
            });
        }
        this.setState({
            vpkdata: tempvpk
        });
        this.handleIconStyle();
    }

    handleIconStyle = () => {
        let upIcons = document.getElementsByClassName(`allow-up`);
        let downIcons = document.getElementsByClassName(`arrow-down`);
        upIcons[0].className = `allow-up first-up`;
        downIcons.length > 1 && (downIcons[downIcons.length-2].className = `arrow-down`);
        downIcons[downIcons.length-1].className = `arrow-down last-down`;

    }

    handleDeleteItem = (text, index) => {
        let vpkOrder = this.state.vpkOrder
        let del_items = [];
        del_items.push(
            this.getReqItem("matchCallNumIp"+vpkOrder[index], nvram["matchCallNumIp"][vpkOrder[index]], ""),
            this.getReqItem("vpkacct"+vpkOrder[index], nvram["vpkacct"][vpkOrder[index]], ""),
            this.getReqItem("vpkdtmf"+vpkOrder[index], nvram["vpkdtmf"][vpkOrder[index]], ""),
            this.getReqItem("vpkmode"+vpkOrder[index], nvram["vpkmode"][vpkOrder[index]], ""),
            this.getReqItem("vpkname"+vpkOrder[index], nvram["vpkname"][vpkOrder[index]], ""),
            this.getReqItem("vpkuserid"+vpkOrder[index], nvram["vpkuserid"][vpkOrder[index]], "")
        );
        this.props.deleteVpkValues(del_items,0,() => {
            vpkOrder.splice(index,1)
            this.setState({disableAppend: false,vpkOrder:vpkOrder})
            this.getVpkItemsValues(vpkOrder)
        })
    }

    handleDeleteMulti = () => {
        const {selectedRowKeys} = this.state;
        for(let i = selectedRowKeys.length-1 ; i >=0  ; i--){
            this.handleDeleteItem({}, selectedRowKeys[i]-1)
        }

        this.setState({
            disableAppend: false,
            selectedRowKeys: []
        });

    }

    onChangeState = (type,len) => {
        this.setState({operatename: type,});
        len >= 16 && this.setState({disableAppend: true});
    }

    changeVpkOrderState = (vpkOrder) => {
        this.setState({vpkOrder: vpkOrder})
    }

    handleVpkEdit = (text,index) => {
        const form = this.form;
        form.setFieldsValue({
            vpkmode: `${text.vpkmodeval}`,
            vpkname: `${text.vpkname}`,
            vpkacct: text.vpkacctval,
            vpkuserid: text.vpkmodeval == 5 ? text.vpkdtmfContent : text.vpkmodeval == 13 ? text.vpkAddress : text.vpkuserid,
            vpkdtmf: `${text.vpkdtmfval}`,
            matchCallNumIp: text.matchCallNumIp
        });
        this.setState({
            operatename: "a_17",
            VpkEditIdx: index,
            disableAppend: false,
        });
    }

    transferKeyModeFun = (handleKeyModeChange) => {
        this.setState({handleKeyModeChange:handleKeyModeChange})
    }

    transferDtmfChange = (handleDtmfChange) => {
        this.setState({handleDtmfChange:handleDtmfChange})
    }

    handleEditItem = (text,index) => {
        this.handleVpkFormHideShow('edit',text);
        this.handleVpkEdit(text,index);
        setTimeout(()=>{
            document.getElementById("vpkname").focus();
        },500)
    }

    hanldeMoveUp = (text, index) => {
        let vpkdata = this.state.vpkdata
        if(index > 0) {
            let prevVpk = vpkdata[index - 1]
            let curVpk = text
            prevVpk['key'] = index+1
            curVpk['key'] = index
            vpkdata[index] = prevVpk
            vpkdata[index - 1] = curVpk
            this.setState({vpkdata: vpkdata});
            this.props.updateVpkOrder(text['vpkOrder'],index-1)
        }

    }

    hanldeMoveDown = (text,index) => {
        let vpkdata = this.state.vpkdata
        if(index < vpkdata.length-1) {
            let nextVpk = vpkdata[index + 1]
            let curVpk = text
            nextVpk['key'] = index+1
            curVpk['key'] = index+2
            vpkdata[index] = nextVpk
            vpkdata[index+1] = curVpk
            this.setState({vpkdata: vpkdata});
            this.props.updateVpkOrder(text['vpkOrder'],index+1)
        }
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    handleVpkFormHideShow = (mode,text) => {
        if(mode == 'hide') {
            document.getElementsByClassName("vpklist")[0].style.top = '-30px'
            document.getElementById('sysappvpkform').className = 'a-fadeout'
            this.setState({disableAddBtn:false})
        } else {
            document.getElementById('sysappvpkform').className = 'a-fadein'
            this.setState({disableAddBtn:true},()=> {
                if(mode == 'edit') {
                    this.state.handleKeyModeChange(text.vpkmodeval)
                    text.vpkmodeval == '5' && this.state.handleDtmfChange(text.vpkdtmfval)
                } else {
                    this.state.handleKeyModeChange('initKeyMode')
                }

            })
        }
    }

    render() {
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <Content className="content-container config-container">
                <div className="subpagetitle">{this.tr("a_accountprogkeys")}</div>
                <div className="config-tab" style={{'minHeight': this.props.mainHeight,'paddingTop': '20px'}}>
                    <div id='sysappvpkform'>
                        <SysappVpkForm {...this.props} ref={this.saveFormRef} operatename={this.state.operatename} disableAddBtn = {this.state.disableAddBtn}
                                   onChangeState={this.onChangeState} changeVpkOrderState={this.changeVpkOrderState} getVpkItemsValues = {this.getVpkItemsValues} vpkdata={this.state.vpkdata} VpkEditIdx={this.state.VpkEditIdx} disableAppend={this.state.disableAppend}
                                   vpkOrder={this.state.vpkOrder} transferKeyModeFun ={this.transferKeyModeFun} transferDtmfChange = {this.transferDtmfChange} handleVpkFormHideShow={this.handleVpkFormHideShow} callTr={this.tr} tips_tr = {this.tips_tr} getReqItem = {this.getReqItem} />
                    </div>
                    <div className="vpklist">
                        <div>
                            <Button style={{width : '86px'}} type="primary" disabled={this.state.disableAddBtn} onClick={this.handleVpkFormHideShow} >{this.tr("a_23")}</Button>
                            <Popconfirm placement="top" title={this.tr("a_promptdelete")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleDeleteMulti}>
                                <Button type="primary" className= "select-delete" disabled={!hasSelected}>
                                    <i className={!hasSelected ? "select-delete-icon" : ""} />{this.tr("a_19067")}
                                </Button>
                            </Popconfirm>
                        </div>
                        <Table style={{"maxWidth":"1400px"}} rowSelection={rowSelection} dataSource={this.state.vpkdata} pagination={false} >

                            <Column title={this.tr("a_groupnum")} dataIndex="key" key="groupnum" />
                            <Column title={this.tr("a_keymode")} dataIndex="vpkmode" key="mode" render={(text, record, index) => ( this.tr(text) )}/>
                            <Column title={this.tr("a_301")} dataIndex="vpkacct" key="acct" />
                            <Column title={this.tr("a_name")} dataIndex="vpkname" key="name" />
                            <Column title={this.tr("a_userid")} dataIndex="vpkuserid" key="userid" />
                            <Column title={this.tr("a_address")} dataIndex="vpkAddress" key="address" />
                            <Column title={this.tr("a_dtmfcontent")} dataIndex="vpkdtmfContent" key="dtmfContent" />
                            <Column title={this.tr("a_dtmfcond")} dataIndex="vpkdtmf" key="dtmfcond" render={(text, record, index) => ( this.tr(text) )} />
                            <Column title={this.tr("a_dtmfcondcid")} dataIndex="matchCallNumIp" key="dtmfcondcid" />
                            <Column title={this.tr("a_operate")} key="operate" render={(text, record, index) => (
                                <pre>
                                    <i className='allow-up' onClick={this.hanldeMoveUp.bind(this, text, index)}/>
                                    <span className="ant-divider" />
                                    <i className="arrow-down" onClick={this.hanldeMoveDown.bind(this, text, index)}/>
                                    <span className="ant-divider" />
                                    <i className='allow-edit' onClick={this.handleEditItem.bind(this, text, index)}/>
                                    <span className="ant-divider" />
                                    <Popconfirm placement="top" title={this.tr("a_promptdelete")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleDeleteItem.bind(this, text, index)}>
                                        <i className='allow-delete'/>
                                    </Popconfirm>
                                </pre>
                            )}/>
                        </Table>
                    </div>
                </div>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    itemValues:state.itemValues,
    curLocale:state.curLocale,
    product: state.product,
    ipvtExist: state.ipvtExist,
    mainHeight: state.mainHeight,
    userType: state.userType
})

const mapDispatchToProps = (dispatch) => {
    var actions = {
        setItemValues:Actions.setItemValues,
        getItemValues:Actions.getItemValues,
        deleteVpkValues:Actions.deleteVpkValues,
        setVpkValues:Actions.setVpkValues,
        putNvrams: Actions.putNvrams,
        getVpkOrder: Actions.getVpkOrder,
        updateVpkOrder: Actions.updateVpkOrder
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Vpk));
