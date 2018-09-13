import React, { Component, PropTypes } from 'react'
import Enhance from '../../../mixins/Enhance'
import { FormattedHTMLMessage } from 'react-intl'
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Table, Popconfirm, Tooltip, Icon, Input, Checkbox, Button, Select,Switch,Modal} from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const {Column} = Table;
let acctname_item = ['270','417','517','617','1717','1817',"50617","50717","50817","50917","51017","51117","51217","51317","51417","51517"];
let accountactive = ["271", "401", "501", "601", "1701", "1801","50601","50701","50801","50901","51001","51101","51201","51301","51401","51501"];
let sipserver = ["47", "402", "502", "602", "1702", "1802","50602","50702","50802","50902","51002","51102","51202","51302","51402","51502"];
let userid = ["35", "404", "504", "604", "1704", "1804","50604","50704","50804","50904","51004","51104","51204","51304","51404","51504"];

let data = [];
let dataId=[];
const extindex = 0

class Child extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount = () => {

    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.enterSave != nextProps.enterSave) {
            this.handleSubmit0();
        }
    }

    handleSubmit0 = () => {
        let values = this.props.form.getFieldsValue(["nametype","fromserv"])
        let mpk_req_items = [{name:"nametype",pvalue:"22127",value:""},{name:"fromserv",pvalue:"22130",value:""}];
        this.props.setItemValues(mpk_req_items,values,1,this.props.putmpkext("0",values.nametype,values.fromserv))
     }

    render() {
        const { getFieldDecorator } = this.props.form;
        const [callTr,tips_tr,itemValues] = [this.props.callTr,this.props.tips_tr,this.props.itemValues];
        return (
            <Form onSubmit={this.handleSubmit0} hideRequiredMark >
                <FormItem className = "select-item" label={(<span>{callTr("a_disformat")}&nbsp;<Tooltip title={tips_tr("Display Format")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('nametype', {
                         initialValue: itemValues.nametype ? itemValues.nametype : "3"
                         })(
                             <Select>
                                 <Option value="0">{callTr("a_phname")}</Option>
                                 <Option value="1">{callTr("a_userid")}</Option>
                                 <Option value="2">{callTr("a_name_userid")}</Option>
                                 <Option value="3">{callTr("a_name_userid_keymode")}</Option>
                             </Select>
                    )}
        　　　   </FormItem>
                <FormItem label={(<span>{callTr("a_disfmtfromser")}&nbsp;<Tooltip title={tips_tr("Show DisplayName from Server")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                    {getFieldDecorator('fromserv', {
                         valuePropName: 'checked',
                         initialValue: parseInt(itemValues.fromserv)
                         })(
                             <Checkbox />
                    )}
                </FormItem>
                <FormItem>
                    <Button className="submit" type="primary" htmlType="submit" style={{width:'80px'}}>
                        {callTr("a_save")}
                    </Button>
                </FormItem>
            </Form>
        )
    }
}
const ChildForm = Form.create()(Child);
class MpkForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedRowKeys: [], //configure the default column
            data:[],
            blfValues:{},
            blfValuesData:[],
            addkeymode:'0',
            addname:'',
            addacct:'0',
            adduserid:'',
            btnFlag:false,
            idIndex:"",
            curBlfVal:'',
            checkAcctArr:'',
            disableAddBtn:false,
            optionSelect:"0",
            keymodeNoAccount:false,
            keymodeIsMetting:false,
            modalVisible:false,
            confSet:[{"account":"0","name":"","number":""}],
            confSetOK:[{"account":"0","name":"","number":""}],
            confmaxLength:6,
            MuteValue:0,
            Mute:false
        }
    }

    componentWillMount = () => {
        this.props.getBlf("0",this.getBlfSuc)
    }

    componentDidMount = () => {
        this.props.getItemValues(this.checkAcctRigster(),(values) => {
            this.setState({checkAcctRig:values})
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.activeKey != nextProps.activeKey) {
            this.props.getItemValues(this.checkAcctRigster(),(values) => {
                this.setState({checkAcctRig:values})
            })
        }
    }

    checkAcctRigster = () => {
        let checkAcctArr = []
        for(let i=0;i<16;i++) {
            checkAcctArr.push(
                this.getReqItem("name"+i,acctname_item[i], ""),
                this.getReqItem("accountactive"+i, accountactive[i], ""),
                this.getReqItem("sipserver"+i, sipserver[i], ""),
                this.getReqItem("userid"+i, userid[i], "")
            )
        }
        checkAcctArr.push({name:"nametype",pvalue:"22127",value:""})
        checkAcctArr.push({name:"fromserv",pvalue:"22130",value:""})
        return checkAcctArr;
    }

    onSelectChange = (selectedRowKeys) => {
        //console.log("selectedRowKeys changed: ", selectedRowKeys);
        this.setState({selectedRowKeys});
    }

    handleDelete = () => {
        let blfValuesData = this.state.blfValues.Data;
        let selectedRowKeys = this.state.selectedRowKeys;
        for (var i=0;i<selectedRowKeys.length;i++) {
            dataId.push(blfValuesData[selectedRowKeys[i]])
        }
        this.props.get_blf_delete(extindex,dataId,selectedRowKeys,blfValuesData, this.handlePutSuc)
        this.setState({selectedRowKeys:[]})
    }

    handlePutSuc = (dataIdItem) => {
        this.props.promptMsg("SUCCESS", "a_del_ok");
        let selIndex = 0;
        let blfValuesData = this.state.blfValues.Data;
        let selectedRowKeys = this.state.selectedRowKeys;
        for( var j = 0; j<blfValuesData.length; j++ ) {
            if( dataIdItem.id == blfValuesData[j].id ) {
                selIndex = j;
                blfValuesData.splice(j, 1);
                break;
            }
        }
        const dataSource = [...this.state.data];
        dataSource.splice(selIndex+1, 1);
        this.setState({ data:dataSource });
        this.setState({blfValuesData:blfValuesData},()=>{
            this.getBlfVal(blfValuesData)
        })
    }

    handleMpkConfigChange = (item,e) => {
        switch (item) {
            case 'keymode':
                let keymode　= e
                if( keymode == 2 || keymode == 4 || keymode == 5 || keymode == 13 ) {
                    this.setState({keymodeNoAccount:true,keymodeIsMetting:false})
                } else if(keymode == 15){
                    this.setState({keymodeNoAccount:false,keymodeIsMetting:true})
                } else {
                    this.setState({keymodeNoAccount:false,keymodeIsMetting:false})
                }
                this.setState({addkeymode:keymode})
                break;
            case 'account':
                this.setState({addacct:e})
                break;
            case 'name':
                this.setState({addname:e.target.value})
                break;
            case 'userid':
                this.setState({adduserid:e.target.value})
                break;
            default:
        }
    }

    handleMuteChange =(checked) =>{
        if(checked==true){
            this.setState({
                MuteValue:1,
                Mute:checked
            })
        }else{
            this.setState({
                MuteValue:0,
                Mute:checked
            })
        }
    }

    getVpkModeName = (key) => {
        let name = ""
        switch (key) {
            case "16":
                name = "a_dialprefix"
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
        }
        return name;
    }

    getBlfSuc = (data1) => {
        if( data1.substring(0, 1) == "{" ) {
            let tObj = eval("(" + data1 + ")");
            this.getBlfVal(tObj.Data)
            this.setState({blfValues:tObj,blfValuesData:tObj.Data})
        }
    }

    getBlfVal = (data1) => {
        let blfValuesData = data1;
        let itemValues=this.props.itemValues
        data = []
        for(let i = 0; i < blfValuesData.length; i++) {
            if(blfValuesData[i].mode=="13"){
                data.push({
                    key: i,
                    name: blfValuesData[i].name,
                    keymode: this.getVpkModeName(blfValuesData[i].mode),
                    account: "",
                    userId:"",
                    id:blfValuesData[i].id,
                    address: blfValuesData[i].number,
                    dtmf: "--",
                    option: this.tr("a_selected"),
                    mode: blfValuesData[i].mode
                });
            }else if(blfValuesData[i].mode=="4"){
                data.push({
                    key: i,
                    name: blfValuesData[i].name,
                    keymode: this.getVpkModeName(blfValuesData[i].mode),
                    account: "",
                    userId:blfValuesData[i].number,
                    id:blfValuesData[i].id,
                    address: "--",
                    dtmf: "--",
                    option: this.tr("a_selected"),
                    mode: blfValuesData[i].mode
                });
            }else if(blfValuesData[i].mode=="5"){
                data.push({
                    key: i,
                    name: blfValuesData[i].name,
                    keymode: this.getVpkModeName(blfValuesData[i].mode),
                    account: "",
                    userId:"",
                    id:blfValuesData[i].id,
                    address: "--",
                    dtmf: blfValuesData[i].number,
                    option: this.tr("a_selected"),
                    mode: blfValuesData[i].mode
                });
            }else if(blfValuesData[i].mode=="15"){
                data.push({
                    key: i,
                    name: blfValuesData[i].name,
                    keymode: this.getVpkModeName(blfValuesData[i].mode),
                    account: blfValuesData[i].acct,
                    userId:blfValuesData[i].number,
                    id:blfValuesData[i].id,
                    address: "--",
                    dtmf: "--",
                    option: this.tr("a_selected"),
                    mode: blfValuesData[i].mode,
                });
            }else{
                data.push({
                    key: i,
                    name: blfValuesData[i].name,
                    keymode: this.getVpkModeName(blfValuesData[i].mode),
                    account: blfValuesData[i].acct,
                    userId: blfValuesData[i].number,
                    id:blfValuesData[i].id,
                    address: "--",
                    dtmf: "--",
                    option: this.tr("a_selected"),
                    mode: blfValuesData[i].mode
                });
            }
        }
        this.setState({data:data})
    }

    handleEdit = (text, record, index,event) => {
        let option
        switch (text.keymode){
            case "a_speeddial":
                option="0";
                break;
            case "a_busy":
                option="1";
                break;
            case "a_callredir":
                option="8";
                break;
            case "a_dialvia":
                option="4";
                break;
            case "a_callintercom":
                option="10";
                break;
            case "a_dtmfdial":
                option="5";
                break;
            case "a_callpark":
                option="9";
                break;
            case "a_multipaging":
                option="13";
                break;
            case "a_conference":
                option="15";
                break;
            case "a_dialprefix":
                option="16";
                break;
            default:option="0"
        }
        let keymode　= option
        if( keymode == 2 || keymode == 4 || keymode == 5 || keymode == 13 ) {
            this.setState({
                keymodeNoAccount:true,
                keymodeIsMetting:false,
                btnFlag:true,
                idIndex:index,
                addkeymode: option,
                addacct: text.account,
                addname: text.name,
            })
            this.props.form.setFieldsValue({
                addkeymode: option,
                addacct: text.account,
                addname: text.name,
                adduserid: text.userId,
            });
        }else if(keymode == 15){
            let length=text.userId.split(";").length
            let confSet=[]
            for(var i=0;i<length;i++){
                confSet.push({"account":"","name":"","number":""})
            }
            let acctArr=text.account.split(";")
            for(var j=0;j<acctArr.length;j++){
                confSet[j].account=acctArr[j]
            }
            let nameArr=text.name.split(";")
            nameArr.splice(0,2)
            for(var k=0;k<nameArr.length;k++){
                confSet[k].name=nameArr[k]
            }
            let idArr=text.userId.split(";")
            for(var q=0;q<idArr.length;q++){
                confSet[q].number=idArr[q]
            }
            this.setState({
                keymodeNoAccount:true,
                keymodeIsMetting:true,
                btnFlag:true,
                idIndex:index,
                addkeymode: option,
                addacct: text.account,
                addname: text.name.split(";")[0],
                adduserid: text.userId,
                MuteValue:text.name.split(";")[1],
                confSet:confSet,
                confSetOK:confSet,
                Mute:text.name.split(";")[1]=="1"?true:false
            })
            this.props.form.setFieldsValue({
                addkeymode: option,
                confName: text.name.split(";")[0],
                Mute: false,
            });
        } else {
            this.setState({
                keymodeNoAccount:false,
                keymodeIsMetting:false,
                btnFlag:true,
                idIndex:index,
                addkeymode: option,
                addacct: text.account,
                addname: text.name,
                adduserid: text.userId,
            })
            this.props.form.setFieldsValue({
                addkeymode: option,
                addacct: text.account,
                addname: text.name,
                adduserid: text.userId,
            });
        }
        this.handleMpkFormHideShow('edit');
    }

    hanleCancelMpk = () => {
        this.setState({addname:'',adduserid:'',btnFlag:false})
        this.handleMpkFormHideShow('hide')
    }

    hanleAddEditMpk = (type) => {
        this.props.cb_ping()
        if( extindex > 0 && this.state.blfValues.Data.length >= 40 ) {
            this.props.promptMsg('ERROR', "a_nomoreext");
			return false;
		}

        if(this.state.addkeymode == '5') {
            var dtmfContent = this.props.form.getFieldValue("adduserid");
            var Exp = new RegExp("^[0-9abcdABCD,;*#]*$");
            if(!Exp.test(dtmfContent)) {
                this.props.promptMsg("ERROR", "a_dtmfcontentlimit");
                return false;
            }
        }

        let valid = 1;
        if (this.state.addkeymode == 13) {
            let ipaddr = this.state.adduserid;
            if( ipaddr != "" ) {
                ipaddr = ipaddr.replace(/(^\s*)|(\s*$)/g,"");
                this.setState({adduserid:ipaddr})
                let ipports = ipaddr.split(":");
                if( ipports.length != 2 ){
                    valid = 0;
                }else{
                    if( !this.checkCastFormatInvalid( ipports[0] )){
                        valid = 0;
                    }else{
                        let numExp = new RegExp("^[0-9]*$");
                        let port = parseInt(ipports[1], 10);
                        if(!numExp.test(ipports[1]) || ipports[1] == "" || port < 1 || port > 65535 ) {
                            valid = 0;
                        }
                    }
                }
            }
        }
        if( valid == 0 ) {
            this.props.promptMsg("ERROR", "a_invalidid");
            return false;
        }
        if(type == 'add') {
            this.cb_put_blf("add");
        } else if (type == 'edit') {
            this.cb_put_blf("edit",this.state.idIndex)
        }

        setTimeout(()=>{this.props.getBlf("0",this.getBlfSuc);},1000)
    }

    checkCastFormatInvalid = (ipstr) => {
        if( ipstr == "" ) {
            return true;
        }
        let re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
        if(re.test(ipstr)) {
            if( RegExp.$1>223 && RegExp.$1<240 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256)
                return true;
        }
        return false;
    }

    cb_put_blf = (type,idIndex) => {
    	let newmode = this.state.addkeymode;
        let newid = this.state.adduserid;
    	if (newmode == 5 && !(newid.match(new RegExp("^[0-9A-Da-d*#,;]+$")))) {
            this.props.promptMsg("ERROR", "a_dtmfwrong");
    		return false;
    	}
        let newname = this.state.addname;
        if( newname.indexOf("'") != -1 || newname.indexOf("\\") != -1 ) {
            this.props.promptMsg("ERROR", "a_nameempty");
            return false;
        }
        let newacct = this.state.addacct;
        let blfValues = this.state.blfValues;
        if(newmode==15){
            var confSetName=[]
            var confSetAcct=[]
            var confSetNumber=[]
            for(let i=0;i<this.state.confSetOK.length;i++){
                confSetName.push(this.state.confSetOK[i].name)
                confSetAcct.push(this.state.confSetOK[i].account)
                confSetNumber.push(this.state.confSetOK[i].number)
            }
            newname= this.state.addname+";"+this.state.MuteValue+";"+confSetName.join(";")
            if(this.state.confSetOK[0].name==""){
                this.props.promptMsg("ERROR", "a_conferenceError");
                return
            }else if (this.state.confSetOK[0].number=="") {
                this.props.promptMsg("ERROR", "a_conferenceError2_zh");
                return
            }
            newid=confSetNumber.join(";")
            newacct=confSetAcct.join(";")
        }
        this.props.check_mpk_exist(type, newid, newname, newacct, newmode,idIndex,extindex,blfValues,this.tr,this.save_func);
    }

    save_func = () => {
        this.props.promptMsg("SUCCESS", "a_savesuc");
    }

    handleSubmit1 = (operatebtn,e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              if(values.confName){
                  if(values.confName.indexOf(";")!=-1){
                      this.props.promptMsg("ERROR", "a_stringError2");
                      return
                  }
              }
              operatebtn = operatebtn == false ? "add" : "edit"
              this.hanleAddEditMpk(operatebtn)
              this.handleMpkFormHideShow('hide')
          }
        });
     }

    handleMpkFormHideShow = (mode) => {
        if(mode == 'hide') {
            document.getElementById('mpkForm').className = 'b-fadeout'
            this.setState({disableAddBtn:false})
        } else {
            document.getElementById('mpkForm').className = 'b-fadein'
            this.setState({disableAddBtn:true})
            if(mode != 'edit') {
                this.props.form.setFieldsValue({
                    addkeymode: "0",
                    addacct: "0",
                    addname: "",
                    adduserid: "",
                    confName:"",
                    MuteValue:0
                });
                this.setState({
                    addkeymode: "0",
                    addacct: "0",
                    addname: "",
                    adduserid: "",
                })
            }
        }
    }

    hanldeMoveUp = (text, index) => {
        let data = this.state.data
        if(index > 0) {
            let value=data[index-1].id
            let changeValue=text.id
            this.props.updateMpkOrder(value,changeValue)
            this.props.getBlf("0",this.getBlfSuc)
        }
    }

    hanldeMoveDown = (text,index) => {
        let data = this.state.data

        if(index < data.length-1) {
            let value=data[index+1].id
            let changeValue=text.id
            this.props.updateMpkOrder(value,changeValue)
            this.props.getBlf("0",this.getBlfSuc)
        }
    }

    showModal= () => {
        this.setState({
            modalVisible:true
        })
    }
    handleOk=() =>{
        let hasString=false
        for(let i=0;i<this.state.confSet.length;i++){
            if(this.state.confSet[i].name.indexOf(";")!=-1||this.state.confSet[i].number.indexOf(";")!=-1){
                hasString=true;
                break;
            }
        }
        if(hasString){
            this.props.promptMsg("ERROR", "a_stringError");
            return;
        }
        this.setState({
            modalVisible:false,
            confSetOK:[].concat(this.state.confSet)
        })
    }
    handleCancel=() =>{
        this.setState({
            modalVisible:false,
            confSet:[].concat(this.state.confSetOK)
        })
    }
    hanleIceContacts=(index)=>{
        var confSet=this.state.confSet
        if(this.state.confmaxLength != this.state.confSet.length && this.state.confSet.length == index + 1){
            confSet.push({"account":"0","name":"","number":""})
        }else{
            confSet.splice(index, 1)
        }
        this.setState({
            confSet:confSet
        })
    }
    changeConfNumber=(index,e)=>{
        var newConfSet=this.state.confSet
        newConfSet[index].number=e.target.value
        this.setState({
            confSet:newConfSet
        })
    }
    changeConfName=(index,e)=>{
        var newConfSet=this.state.confSet
        newConfSet[index].name=e.target.value
            this.setState({
                confSet:newConfSet
            })
    }
    changeConfAccount=(index,e)=>{
        var newConfSet=this.state.confSet
        newConfSet[index].account=e
            this.setState({
                confSet:newConfSet
            })
    }
    checkString=(rule, value, callback)=>{
        console.log(value)
        if(value==undefined){
            return
        }
        if (value.indexOf(";") != -1) {
            callback(this.tr("a_stringError"));
        }
        callback();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const [callTr,itemValues,checkAcctRig,ipvtExist] = [this.props.callTr,this.props.itemValues,this.state.checkAcctRig,this.props.ipvtExist];
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        const conf=this.state.confSet
        const hasSelected = selectedRowKeys.length > 0;
        if(this.isEmptyObject(itemValues)) {
            return null;
        }
        return (
            <div>
                <p className="blocktitle"><s></s>{callTr('a_formatting')}</p>
                <ChildForm {...this.props} callTr = {this.tr} tips_tr = {this.tips_tr} />
                <p className="blocktitle"><s></s>BLF</p>
                <div id='mpkForm'>
                    <Form hideRequiredMark>
                        <FormItem className = "select-item"  label={(<span>{callTr("a_keymode")}&nbsp;<Tooltip title={ <FormattedHTMLMessage  id={this.tips_tr("Key Mode ")} />} ><Icon type="question-circle-o" /></Tooltip></span>)}>
                            {getFieldDecorator('addkeymode', {
                                 initialValue:this.state.optionSelect
                                 })(
                                     <Select onChange = {this.handleMpkConfigChange.bind(this,'keymode')} disabled={!this.state.disableAddBtn}>
                                        <Option value="0">{callTr("a_speeddial")}</Option>
                                        <Option value="1">{callTr("a_busy")}</Option>
                                        <Option value="8" style={{"display":this.props.oemId=="54"?"none":"block"}}>{callTr("a_callredir")}</Option>
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
                        {this.state.keymodeIsMetting?null:<FormItem className = "select-item edit_acctdiv" style={{display:this.state.keymodeNoAccount?"none":"block"}} label={(<span>{callTr("a_account")}&nbsp;<Tooltip title={this.tips_tr("Account ")}><Icon type="question-circle-o" /></Tooltip></span>)}>
                            {getFieldDecorator('addacct', {
                                initialValue:this.state.addacct
                            })(
                                <Select onChange = {this.handleMpkConfigChange.bind(this,'account')} disabled={!this.state.disableAddBtn}>
                                    {
                                        acctname_item.map((item,i,arr) => {
                                            if (typeof checkAcctRig === 'object' && checkAcctRig['accountactive'+i] == "1" && checkAcctRig['sipserver'+i] != "" && checkAcctRig['userid'+i] != "") {
                                                if(ipvtExist == '1' && i==15) {
                                                    return <Option value={`${i}`} style={{display:'none'}}></Option>
                                                } else {
                                                    return <Option value={`${i}`}>{checkAcctRig["name"+i] ? checkAcctRig["name"+i] : checkAcctRig["userid"+i]}</Option>
                                                }
                                            } else {
                                                return <Option value={`${i}`}>{`${this.tr("a_acct")} ${i+1}`}</Option>
                                            }
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>}
                        {this.state.keymodeIsMetting?null:<FormItem label={(<span>{callTr("a_displayname")}&nbsp;<Tooltip title={this.tips_tr("Name  ")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                            {getFieldDecorator('addname', {
                                rules: [{
                                    required:true,max:64,message: callTr("max_length64"),
                                }],
                                initialValue: this.state.addname
                            })(
                                <Input type="text" onChange = {this.handleMpkConfigChange.bind(this,'name')} disabled={!this.state.disableAddBtn} />
                            )}
                        </FormItem>}
                        {this.state.keymodeIsMetting?null:<FormItem label={(<span>{callTr(`${this.state.addkeymode == '5' ? 'a_dtmfcontent' : this.state.addkeymode == '13' ? 'a_address' : 'a_userid' }`)}&nbsp;<Tooltip title={this.tips_tr(`${this.state.addkeymode == '5' ? 'DTMF Content' : this.state.addkeymode == '13' ? 'Multicast Paging Address' : 'UserID ' }`)}><Icon type="question-circle-o" /></Tooltip></span>)} >
                            {getFieldDecorator('adduserid', {
                                rules: [{
                                    required:true,max:64,message: callTr("max_length64"),
                                }],
                                initialValue: this.state.adduserid
                            })(
                                <Input type="text" onChange = {this.handleMpkConfigChange.bind(this,'userid')} disabled={!this.state.disableAddBtn} />
                            )}
                        </FormItem>}
                        {this.state.keymodeIsMetting?<FormItem label={(<span>{callTr("a_conferenceName")}&nbsp;<Tooltip title={this.tips_tr("conferenceName")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                            {getFieldDecorator('confName', {
                                rules: [{
                                    required:true,max:64,message: callTr("max_length64"),
                                }],
                            })(
                                <Input type="text" onChange = {this.handleMpkConfigChange.bind(this,'name')} disabled={!this.state.disableAddBtn} />
                            )}
                        </FormItem>:null}
                        {this.state.keymodeIsMetting?<FormItem label={(<span>{callTr("a_conferenceMute")}&nbsp;<Tooltip title={this.tips_tr("conferenceMute")}><Icon type="question-circle-o" /></Tooltip></span>)} >
                                <Switch className="P-22205" checked={this.state.Mute} onChange={this.handleMuteChange}/>
                            </FormItem>:null}
                        <FormItem style={{display:this.state.keymodeIsMetting?"block":"none"}} label={<span></span>} >
                            <Button type="primary"  size="large" onClick={this.showModal}>
                                {this.tr("a_config")}
                            </Button>
                            <Modal title={callTr("a_conferenceList")} visible={this.state.modalVisible}
                                   onOk={this.handleOk} onCancel={this.handleCancel}>
                                {/*{conf.map((item,i)=>{
                                    return<div>
                                            <Input type="text"  value={item.number} />
                                            <Input type="text"  value={item.name} />
                                        <Select value={item.account}>
                                            {
                                                acctname_item.map((item,i,arr) => {
                                                    if (typeof checkAcctRig === 'object' && checkAcctRig['accountactive'+i] == "1" && checkAcctRig['sipserver'+i] != "" && checkAcctRig['userid'+i] != "") {
                                                        if(ipvtExist == '1' && i==15) {
                                                            return <Option value={`${i}`} style={{display:'none'}}></Option>
                                                        } else {

                   return <Option value={`${i}`}>{checkAcctRig["name"+i] ? checkAcctRig["name"+i] : checkAcctRig["userid"+i]}</Option>
                                                        }
                                                    } else {
                                                        return <Option value={`${i}`}>{`${this.tr("a_acct")} ${i+1}`}</Option>
                                                    }
                                                })
                                            }
                                        </Select>
                                        <i className={`${this.state.confmaxLength == this.state.confSet.length ? 'del-btn' : this.state.confSet.length == i + 1 ? 'add-btn' : 'del-btn'}`}
                                           onClick={this.hanleIceContacts.bind(this,i)}
                                           style={{backgroundPosition: this.state.numbermaxLength == this.state.confSet.length ?  '-21px -25px' : this.state.confSet.length == i + 1 ?  '-63px -25px' :  '-21px -25px',
                                               width:20,
                                               height:20,
                                               background:'transparent url("/img/icon.png") -63px -25px no-repeat',
                                               display:'inline-block'
                                           }}/>
                                        </div>
                                })
                                }*/}
                                <Table className="mpk_table"  dataSource={this.state.confSet} pagination={false} >
                                    <Column title={this.tr("a_number")} dataIndex="number" key="number"
                                            render={(text, record, index) => (
                                                <Input type="text" value={text} onChange={this.changeConfNumber.bind(this,index)}/>
                                            )}
                                    />
                                    <Column title={this.tr("a_name1")} dataIndex="name" key="name" render={(text, record, index) => (
                                        <Input type="text" value={text} onChange={this.changeConfName.bind(this,index)}/>
                                    )}/>
                                    <Column title={this.tr("a_account")} dataIndex="account" key="account"
                                            render={(text, record, index) => (
                                                <Select value={text} onChange={this.changeConfAccount.bind(this,index)}>
                                                {
                                                    acctname_item.map((item,i,arr) => {
                                                        if (typeof checkAcctRig === 'object' && checkAcctRig['accountactive'+i] == "1" && checkAcctRig['sipserver'+i] != "" && checkAcctRig['userid'+i] != "") {
                                                            if(ipvtExist == '1' && i==15) {
                                                                return <Option value={`${i}`} style={{display:'none'}}></Option>
                                                            } else {
                                                                return <Option value={`${i}`}>{checkAcctRig["name"+i] ? checkAcctRig["name"+i] : checkAcctRig["userid"+i]}</Option>
                                                            }
                                                        } else {
                                                            return <Option value={`${i}`}>{`${this.tr("a_acct")} ${i+1}`}</Option>
                                                        }
                                                    })
                                                }
                                                </Select>
                                            )}/>
                                    <Column title={this.tr("a_operate")} render={(text, record, index) => (
                                             <i className={`${this.state.confmaxLength == this.state.confSet.length ? 'del-btn' : this.state.confSet.length == index + 1 ? 'add-btn' : 'del-btn'}`}
                                                onClick={this.hanleIceContacts.bind(this,index)}
                                            style={{
                                                width:20,
                                                height:20,
                                                marginLeft:"30px",
                                                marginRight:"30px",
                                                background:'transparent url("/img/icon.png") -63px -25px no-repeat',
                                                display:'inline-block',
                                                backgroundPosition: this.state.confmaxLength == this.state.confSet.length ?  '-21px -25px' : this.state.confSet.length == index + 1 ?  '-63px -25px' :  '-21px -25px',
                                            }}/>
                                    )}/>
                                </Table>
                            </Modal>
                        </FormItem>
                        <FormItem　className="operatebtn">
                            <Button className="cancel" size="large" onClick={this.hanleCancelMpk}>{callTr("a_3")}</Button>
                            <Button className="submit" type="primary" onClick={this.handleSubmit1.bind(this,this.state.btnFlag)} size="large">
                                {this.state.btnFlag == false　? this.tr("a_23") : this.tr("a_2")}
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <div className="mpklist">
                    <div>
                        <Button style={{width : '86px'}} type="primary" disabled={this.state.disableAddBtn} onClick={this.handleMpkFormHideShow} >{this.tr("a_23")}</Button>
                        <Popconfirm placement="top" title={this.tr("a_promptdelete")} okText={this.tr("a_2")} cancelText={this.tr("a_3")} onConfirm={this.handleDelete}>
                            <Button type="primary" className= "select-delete" disabled={!hasSelected}>
                                <i className={!hasSelected ? "select-delete-icon" : ""} />{this.tr("a_delete")}
                            </Button>
                        </Popconfirm>
                    </div>
                    <Table className="mpk_table" style={{"max-width":"1180px"}} rowSelection={rowSelection} dataSource={this.state.data} pagination={false} >
                        <Column title={this.tr("a_displayname")} dataIndex="name" key="name" render={
                            (text,record,index)=>{
                                if(typeof checkAcctRig === 'object'&&this.state.data[index].mode=="15" ){
                                    return text.split(";")[0]
                                }else{
                                    return text
                                }
                            }}/>
                        <Column title={this.tr("a_keymode")} dataIndex="keymode" key="keymode" render={(text, record, index) => (this.tr(text))} />
                        <Column title={this.tr("a_account")} dataIndex="account" key="acctount" render={
                            (text,record,index)=>{
                                if(typeof checkAcctRig === 'object'&&this.state.data[index].mode=="13" ){
                                    return ""
                                }else if(typeof checkAcctRig === 'object'&&this.state.data[index].mode=="4" ){
                                    return ""
                                }else if(typeof checkAcctRig === 'object'&&this.state.data[index].mode=="5" ){
                                    return ""
                                }else if(typeof checkAcctRig === 'object'&&this.state.data[index].mode=="15" ){
                                    return ""
                                }else if (typeof checkAcctRig === 'object' && checkAcctRig['accountactive'+text] == "1" && checkAcctRig['sipserver'+text] != "" && checkAcctRig['userid'+text] != "") {
                                    return checkAcctRig["name"+text] ? checkAcctRig["name"+text] : checkAcctRig["userid"+text]
                                }else {
                                    return `${this.tr("a_acct")} ${parseInt(text)+1}`
                                }
                            }}/>
                        <Column title={this.tr("a_value")} dataIndex="userId" key="userId"  render={
                            (text,record,index)=>{
                                if(typeof checkAcctRig === 'object'&&this.state.data[index].mode=="15" ){
                                    return ""
                                }else{
                                    return text
                                }
                            }}/>/>
                        <Column title={this.tr("a_address")} dataIndex="address" key="address" />
                        <Column title={this.tr("a_dtmfcontent")} dataIndex="dtmf" key="dtmf" />
                        <Column title={this.tr("a_operate")} key="option" render={(text, record, index) => (
                            <pre>
                                <i className='allow-up' onClick={this.hanldeMoveUp.bind(this, text, index)} style={{ backgroundPosition: index != 0 ? '-104px -66px' : '-84px -66px' }}/>
                                <span className="ant-divider" />
                                <i className="arrow-down" onClick={this.hanldeMoveDown.bind(this, text, index)} style={{ backgroundPosition: index != this.state.data.length-1 ? '-168px -66px' : '-146px -66px'  }}/>
                                <span className="ant-divider" />
                                <i className='allow-edit' onClick={this.handleEdit.bind(this,text, record, index)} style={{ backgroundPosition: '-272px -66px'}}/>
                            </pre>
                        )}/>
                    </Table>
                </div>
            </div>
        )
  }
}

const mapStateToProps = (state) => ({
    activeKey: state.TabactiveKey
})

const mapDispatchToProps = (dispatch) => {
    const actions = {}
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(MpkForm));
