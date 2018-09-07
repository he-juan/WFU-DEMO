import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router';
import Enhance from "../../mixins/Enhance"
import { Layout, Select, Input, Button, Icon, Row, Col, Form, Popover } from "antd"
import * as Actions from '../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CallSelectNum from './contact/selectNum'
const Content = Layout
const Option = Select.Option
const FormItem = Form.Item
let req_items;
let mInputIpvtNum = 0;
let mInputNum = 0;
let mMaxlineNum = 1;
let mClickAdd = 0;
// var mMaxlineNum = 0;
let mHasIPVNumber = 0;
let mNeedRemove = 0;  //need the variable when input character in inputnum then add member by add button
let mCalling = false;
let mDisDialrule = [];


class DialUpForm extends Component {
    globalItems = [];
    contactItems = [];
    constructor(props){
        super(props);

        this.state = {
            displayitems: [],
            filterStr: "",
            acctstatus: [],
            defaultacct: 0,
            selacct: -1,
            accountsdivdisplay: "display-hidden",
            ipvttalkdialdisplay: "display-hidden",
            bjdialdisplay : "display-hidden",
            accountdisplayarr: ["display-hidden","display-hidden","display-hidden","display-hidden"],
            maxinputnum: -1,
        }
        req_items = new Array;
        req_items.push(
            this.getReqItem("defaultAcct", "22046", ""),
            this.getReqItem("disdialplan", "2382", "")
        )
    }

    componentDidMount = () => {
        let self = this;
        this.props.getItemValues(req_items, (values) => {
            let isbjacct = values["defaultAcct"] == 2 ? true : false
            let defaultacct = values["defaultAcct"] == 8 ? 3 : values["defaultAcct"]
            this.setState({
                defaultacct: defaultacct,
                selacct: defaultacct,
                maxinputnum: defaultacct == 0 || defaultacct == 3 ? 1 : -1,
                ipvttalkdialdisplay: isbjacct ? "display-hidden" : "display-block",
                bjdialdisplay: isbjacct ? "display-block" : "display-hidden"
            });
            let disdialrule = values["disdialplan"];
            if(disdialrule == "" || disdialrule == undefined){
                disdialrule = 0;
            }else{
                disdialrule = parseInt(disdialrule).toString(2);
            }
            this.isneeddialplan_check(disdialrule);
        });

        this.props.getAcctStatus((acctstatus) => {
            if(!this.isEmptyObject(this.props.acctStatus)){
                this.getAcctStatusData(this.props.acctStatus);
            }
        });
        this.props.getCalllog(0, (logitems) => {
            this.globalItems = this.globalItems.concat(JSON.parse(JSON.stringify(logitems)));
            //获取会议成员的name 和 number， 之前只有 name， 格式类似：Conf 20180830_143457
            this.props.getAllConfMember((result) => {
                this.parseconfmember();
                this.props.getLeftcalllogname((result) => {
                    this.parsecalllogname(result);
                });
            });
            this.props.getContacts((result) => {
                this.contactItems = JSON.parse(JSON.stringify(this.props.contactsInformation));
                for (let i in this.contactItems) {
                    if (this.contactItems[i].Number.length > 1) {
                        this.contactItems[i].AcctIndex = this.props.contactsAcct[i].AcctIndex;
                    }
                    this.contactItems[i].Type = "0";
                }
                this.globalItems = this.globalItems.concat(this.contactItems);
                this.setState({displayitems: this.globalItems});
            });
        });

        $("#inputnum").removeClass("ant-input");
        $("#inputnum").manifest({
            formatDisplay: function (data, $item, $mpItem) {

                let mName = data;
                if( data.name == undefined ){
                    for(let i = 0; i < self.contactItems.length; i++){
                        let contactitem = self.contactItems[i];
                        if( -1 != contactitem.Number.indexOf(data) ){
                            mName = contactitem.Name;
                            break;
                        }
                    }
                }else{
                    mName = data.name;
                }
                return mName;
            },
            formatValue: function (data, $value, $item, $mpItem) {
                let selacct = self.state.selacct;
                let mNumber ;
                if( data.name == undefined ){
                    mNumber = data+":::" + selacct;
                    if( mHasIPVNumber == 0 && selacct == 1 ){
                        mHasIPVNumber = 1;
                    }
                    if( selacct == 0 && self.state.acctstatus[0].register == "0" )
                        $item.addClass("mf_item_0_unreg");
                    else
                        $item.addClass("mf_item_"+selacct);
                    $item.attr("acctId", selacct);
                }else{
                    mNumber = data.number;
                    var account = mNumber.split(":::")[1];
                    if( mHasIPVNumber == 0 && account == 1  ){
                        mHasIPVNumber = 1;
                        //mMaxlineNum --;
                        //$("#membermaxnum").text(mMaxlineNum);
                    }
                    if( account == 0 && self.state.acctstatus[0].register == "0" )
                        $item.addClass("mf_item_0_unreg");
                    else
                        $item.addClass("mf_item_"+account);
                    $item.attr("acctId", account);
                }
                return mNumber;
            },
            onAdd: function (data, $item, initial) {
                self.setState({
                    displayitems: self.globalItems,
                    filterStr: ""
                });
                let mNumber, mName;
                $("#numbertip").hide();
                //$("#membernumdiv").css("top", "-22px");
                if( data.number == undefined ){
                    //add by input a number
                    mNumber = data;
                    mName = data;
                    mNeedRemove = 1;
                    setTimeout("mNeedRemove = 0;",500)
                }else{
                    //add by press add button
                    mName = data.name;
                    mNumber = data.number;
                    mNeedRemove = 0;
                }

                if(mNumber.length > 128){
                    self.props.promptMsg('ERROR', "a_19243");
                    $item.remove();
                    return false;
                }

                var exist = 0;
                var values = $('#inputnum').manifest('values');
                for(var i = 0; i < values.length; i++){
                    if( values[i].split(":::")[0] == mNumber ){
                        exist = 1;
                        return false;
                    }
                }
                if( exist == 1 ){
                    return false;
                }
            },
            onChange: function (type, data, $item) {
                let selacct = self.state.selacct;
                if( type == "add" ){
                    if(selacct == 1){
                        if(mInputIpvtNum == 0)
                            mInputNum++;
                        mInputIpvtNum ++;
                    }
                    else{
                        mInputNum ++;
                    }
                }else if( type == "remove" ){
                    $("#inputnum").val("");
                    var acct = $item.attr("acctid");
                    if(acct == 1){
                        mInputIpvtNum --;
                        if(mInputIpvtNum == 0)
                            mInputNum--;
                    }
                    else{
                        mInputNum --;
                    }
                }
                $("#membernum").text(mInputNum);
                $(".mf_item").removeClass("mfred_item");
                if( mInputNum > mMaxlineNum ){
                    $("#membernum").css("color", "red");
                    $(".mf_item:gt("+(mMaxlineNum-1)+")").addClass("mfred_item");
                }else{
                    $("#membernum").css("color", "#444");
                }

                if(selacct == 1){
                    if(mInputNum > mMaxlineNum)
                        $("#inputnum").hide();
                    else
                        $("#inputnum").show();
                }
                else{
                    if(mInputNum >= mMaxlineNum)
                        $("#inputnum").hide();
                    else
                        $("#inputnum").show();
                }
                if( type == "add" && mClickAdd == 0 ){
                    //on_search_key();
                    //need use a timeout or else can't add the searched item
                    // mSearchTimer = setTimeout("on_search_key();", 500);
                }else if( type == "remove" ){
                    $("#inputnum").val("");
                    if( mHasIPVNumber == 1  ){
                        if( $item.attr("acctId") == 1 ){
                            var values = $('#inputnum').manifest('values');
                            var hasIPV = 0;
                            for(var i = 0; i < values.length; i++){
                                if( values[i].split(":::")[1] == 1 ){
                                    hasIPV = 1;
                                    break;
                                }
                            }
                            if( hasIPV == 0 ){
                                mHasIPVNumber = 0;
                                //mMaxlineNum ++;
                                //$("#membermaxnum").text(mMaxlineNum);
                            }
                        }
                    }
                }
            }
        });

        $("#inputnum").show();
    }

    parseconfmember =() =>{
        let confmemberinfodata = this.props.confmemberinfodata;
        for(let i in this.globalItems){
            if(this.globalItems[i].Type == "0") continue;
            let nameornumber = "", number = "";
            for(let j in confmemberinfodata){
                if(confmemberinfodata[j].Id == this.globalItems[i].Id){
                    let name = confmemberinfodata[j].Name || confmemberinfodata[j].Number;
                    let itemnumber = confmemberinfodata[j].Number || confmemberinfodata[j].Name;
                    if(nameornumber != ""){
                        nameornumber += ", " + name;
                    }else{
                        nameornumber += name;
                    }
                    if(number != ""){
                        number +=", " + itemnumber;
                    }else{
                        number += itemnumber;
                    }
                    this.globalItems[i].NameOrNumber = nameornumber;
                    this.globalItems[i].Number = number;
                }
            }
        }
    }

    parsecalllogname = (missedcalllogsdata) =>{
        for(let i in this.globalItems){
            if(this.globalItems[i].Type == "0") continue;
            for(let j in missedcalllogsdata){
                if(missedcalllogsdata[j].Id == this.globalItems[i].Id){
                    let missedcallitemname = missedcalllogsdata[j].Name;
                    this.globalItems[i].Number = this.globalItems[i].NameOrNumber;
                    if(missedcallitemname){
                        this.globalItems[i].NameOrNumber = missedcallitemname;
                    }
                }
            }
        }
        this.setState({displayitems: this.globalItems});
    }

    getAcctStatusData =(acctstatus) => {
        let curAcct = [];
        const acctStatus = acctstatus.headers;
        let max = 4;
        for(let i = 0; i < max; i++){
            curAcct.push(
                {"acctindex": i, "register": acctStatus[`account_${i}_status`], "activate": acctStatus[`account_${i}_activate`],
                    "num": acctStatus[`account_${i}_no`], "name": acctStatus[`account_${i}_name`]});
        }
        this.setState({acctstatus:curAcct});
    }

    clickToAddAcct = () => {
        this.props.setCurMenu(['account']);
        this.props.setTabKey("1");
        hashHistory.push('/account');
        this.props.jumptoTab(0);
    }

    filterNumber = (e) => {
        let value = e.target.value.trim();
        let numbers = this.globalItems;
        let filternum = [];
        for (let i in numbers) {
            if(numbers[i].Type == "0"){
                for(let j in numbers[i].Number){
                    if(numbers[i].Number[j].indexOf(value) != -1){
                        filternum.push(numbers[i]);
                        break;
                    }
                }
            } else {
                if(numbers[i].Number.indexOf(value) != -1){
                    filternum.push(numbers[i]);
                }
            }
        }
        this.setState({
            displayitems: filternum,
            filterStr: value
        });
    }

     isneeddialplan_check = (str) =>{
        for(var i = 0; i < 7; i ++)
            mDisDialrule[i] = 1;
        let length = str.length;
        if(length == 5){
            str = str.substring(1, str.length);
            length = str.length;
        }

        let checkorder = new Array(6, 5, 3, 4);
        for(let i = 0; i < length; i++){
            if(str.substring(i, i+1) == 1)
                mDisDialrule[checkorder[length-i-1]] = 0;
        }
    }

    handleDialUp = (isbyinputnum, isvideo) => {
        if(isbyinputnum == 1) {
            const form = this.props.form;
            if (mCalling) return;
            mCalling = true;
            let selacct = this.state.selacct;
            if (selacct == "2") {
                let dialnum = form.getFieldValue("bjnumber").trim();
                if (dialnum == "") {
                    return false;
                }
                let bjpwd = form.getFieldValue("bjpwd").trim();
                if (bjpwd != "") {
                    dialnum += "." + bjpwd;
                }
                this.cb_start_addmemberconf(dialnum, selacct, "call", "", "", "", isvideo);
                setTimeout(function () {
                    mCalling = false;
                }, 1000);
                return;
            }

            var values = $('#inputnum').manifest('values');
            if (selacct == "1" && values.length == 0) {
                this.props.quickStartIPVConf(isvideo);
                setTimeout(function () {
                    mCalling = false;
                }, 1000);
                return;
            }

            var dialnum = "";
            var dialacct = "";
            for (var i = 0; i < values.length; i++) {
                if (dialnum != "") {
                    dialnum += ":::";
                    dialacct += ":::";
                }
                dialnum += values[i].split(":::")[0];
                dialacct += values[i].split(":::")[1];
            }
            if (dialnum == "") {
                setTimeout(function () {
                    mCalling = false;
                }, 1000);
                return;
            }

            if (dialnum != "") {
                //selacct may be 1 for bluejeans account when no account configured,so use 0 forever as only one account
                var isdialplan = mDisDialrule[6];
                if (selacct == "1" && values.length > 1) {
                    for (var i = 1; i < values.length; i++)
                        isdialplan += ":::" + mDisDialrule[6];
                }
                if (values.length == 1) {
                    this.cb_start_single_call(dialnum, dialacct, 0, isdialplan, 0, isvideo);
                } else {
                    this.cb_start_addmemberconf(dialnum, dialacct, "call", "", isdialplan, "", isvideo);
                }
                $('#inputnum').manifest('remove');
            }
            setTimeout(function () {
                mCalling = false;
            }, 1000);
        }
    }

    cb_start_addmemberconf =(numbers, accounts, callmode, confid, isdialplan, confname, isvideo, isquickstart, pingcode)=>
    {
        let acctstates = this.state.acctstatus;
        if(acctstates[accounts].activate == "0") {
            this.props.promptMsg('WARNING', 'a_19374');
            return false;
        }
        if(acctstates[accounts].register == "0"){
            this.props.promptMsg('WARNING', 'a_19375');
            return false;
        }
        // let tempnumbers = numbers.split(":::");
        if(isquickstart == undefined)
            isquickstart = 0;
        if(pingcode == undefined)
            pingcode = "";
        if(isdialplan == undefined || isdialplan === "")
            isdialplan = 1;

        if(confname == undefined)
            confname = "";
        var urihead;
        if(callmode == undefined || callmode == "")
            callmode = "call";

        urihead = "addconfmemeber&region=confctrl&numbers=" + encodeURIComponent(numbers) + "&accounts=" + encodeURIComponent(accounts) + "&confid=" + confid + "&callmode=" + callmode + "&isvideo=" + isvideo + "&isquickstart=" + isquickstart + "&pingcode=" + pingcode + "&isdialplan=" + isdialplan + "&confname=" + confname;
        this.props.cb_originatecall(urihead,numbers, accounts);
    }

    cb_start_single_call =(dialnum, dialacct, ispaging, isdialplan, isipcall, isvideo) =>{
        let self = this;
        if( dialnum == "" ){
            return false;
        }
        let acctstates = this.state.acctstatus;
        if(acctstates[dialacct].activate == "0") {
            this.props.promptMsg('WARNING', 'a_19374');
            return false;
        }
        if(acctstates[dialacct].register == "0"){
            this.props.promptMsg('WARNING', 'a_19375');
            return false;
        }
        if( dialnum == "anonymous" ){
            this.props.promptMsg('WARNING', 'a_10083');
            return false;
        }
        if(isipcall == undefined)
        {
            isipcall = 0;
        }
        setTimeout(function(){
            self.props.cb_originatecall("originatecall&region=webservice&destnum=" + encodeURIComponent(dialnum) + "&account=" + dialacct + "&isvideo=" + isvideo + "&ispaging=" + ispaging +  "&isipcall=" + isipcall +  "&isdialplan=" + isdialplan + "&headerstring=&format=json",dialnum, dialacct);
        },100);
    }

    showAccounts = () =>{

    }

    focusinputnum = () => {
        $("#inputnum").focus();
    }

    inputnumberfocus = () => {
        $("#numbertip").hide();
    }
    inputnumberblur = () => {
        if( $("#inputnum").val() == "" ){
            var values = $('#inputnum').manifest('values');
            if( values.length == 0 ){
                $("#numbertip").show();
                $("#inputnum").val("");
            }
        }
    }
    handleMouseEnter =() =>{
    }

    handleMouseOver = (item, index) =>{
        let accountdisplayarr = this.state.accountdisplayarr;
        accountdisplayarr[index] = "display-block";
        this.setState({accountdisplayarr:accountdisplayarr})
    }

    handleMouseLeave = (item, index) =>{
        let accountdisplayarr = this.state.accountdisplayarr;
        accountdisplayarr[index] = "display-hidden";
        this.setState({accountdisplayarr:accountdisplayarr})
    }

    handleAcctSelectDiv = () =>{
        let accountsdivdisplay = this.state.accountsdivdisplay;
        accountsdivdisplay == "display-hidden" ? this.setState({accountsdivdisplay: "display-block"}) :
            this.setState({accountsdivdisplay: "display-hidden"});
    }

    selectAcctitem = (item, index) =>{

        if(item.activate == '0' || item.register == "0"){
            return;
        }
        this.setState({
            selacct:index,
            accountsdivdisplay: "display-hidden",
            ipvttalkdialdisplay: index == 2 ? "display-hidden" : "display-block",
            bjdialdisplay: index == 2 ? "display-block" : "display-hidden"
        });
        if(index == 0 || index == 3){
            this.setState({maxinputnum:1});
        }else{
            this.setState({maxinputnum: -1});
        }
    }

    setDefaultAcct = (acctindex) =>{
        this.props.setDefaultAcct(acctindex, () => {
            this.setState({defaultacct:acctindex,
                selacct:acctindex
            })
        })
    }


    render(){
        const { getFieldDecorator } = this.props.form;
        const msgsContacts = this.props.msgsContacts;
        let acctstatus = this.state.acctstatus;
        let selacct = this.state.selacct != -1 ? this.state.selacct : this.state.defaultacct;
        return (
            <Content className="content-container">
                <div className="subpagetitle">{this.tr("a_dialup")}</div>
                <Form className="call-area" style={{'min-height': this.props.mainHeight, 'height': this.props.mainHeight}}>
                    <div className="dial-up-top">
                        <div className="acctselbox">
                            {
                                acctstatus.length ?
                                <div onClick={this.handleAcctSelectDiv.bind(this)}> <span style={{display:'inline-block', width: '300px'}}>{acctstatus[selacct].name}</span> <span>{acctstatus[selacct].num}</span> </div>
                                : ""
                            }
                        </div>
                        <div className={"account-info " + this.state.accountsdivdisplay}>
                            <ol>
                                {acctstatus.map((item, i) => {
                                    return <li className={`account-item ${item.activate == '0' || item.register == '0' ? 'acct-item-disable':''}`} onMouseOver={this.handleMouseOver.bind(this, item, i)}
                                               onMouseLeave={this.handleMouseLeave.bind(this, item, i)} onClick={this.selectAcctitem.bind(this, item, i)}>
                                        <span className="acct-item-name">{item.name}</span> <span className="acct-item-num">{item.num}</span>
                                        {item.activate == "0" ? <span className={"acct_status " + this.state.accountdisplayarr[i]}>{this.tr("a_18564")}</span> :
                                            item.register == "0" ? <span className={"acct_status " + this.state.accountdisplayarr[i]}>{this.tr("a_acctunregistered")}</span> :
                                                i == this.state.defaultacct ? <span className={"acct_status " + this.state.accountdisplayarr[i]}>{this.tr("a_19113")}</span> :
                                                    <Button type="primary" style={{marginTop:'4px'}} className={"acct_status " + this.state.accountdisplayarr[i]} onClick={this.setDefaultAcct.bind(this, i)}>
                                                        {this.tr("a_16697")} </Button>
                                        }
                                    </li>
                                })}
                            </ol>
                        </div>
                        <FormItem className={"call-inputnum-formitem " +  this.state.ipvttalkdialdisplay}>
                            <div className="dialdiv">
                            {
                                <input id="inputnum" className="" onChange={this.filterNumber} onPressEnter={this.handleDialUp.bind(this, 1, 0)} style={{width:"13px"}}
                                           onFocus={this.inputnumberfocus.bind(this)} onBlur={this.inputnumberblur.bind(this)} />
                            }
                            <div id="membernumdiv" className={this.state.maxinputnum == -1 ? 'display-hidden' : 'display-block'} style={{position:'absolute',top:'60px',right:'3px',fontSize:'16px',color:'#444',width:'30px'}}>
                                    <span id="membernum">0</span>/<span id="membermaxnum">{this.state.maxinputnum == -1 ? "": this.state.maxinputnum}</span>
                                </div>
                            <div style={{position:"relative",top:"-102px",left:'10px',fontSize:'14px',color:'#444',width:'420px',color:'#999'}} id="numbertipdiv" onClick={this.focusinputnum.bind(this)}>
                                    <span id="numbertip">Multiply numbers can seperate with ",".</span>
                                </div>
                            </div>
                        </FormItem>
                        <div className={"call-inputnum-formitem " + this.state.bjdialdisplay}>
                            <FormItem >
                               {
                                    getFieldDecorator("bjnumber", {
                                        initialValue : ""
                                    })(
                                        <Input style={{width:"500px"}} placeholder={this.tr("a_15055")} />
                                    )
                                }
                            </FormItem>
                            <FormItem >
                                {
                                    getFieldDecorator("bjpwd", {
                                        initialValue : ""
                                    })(
                                        <Input style={{width:"500px"}} placeholder={this.tr("a_16705")} />
                                    )
                                }
                            </FormItem>
                        </div>
                        <Button type="primary" className="call-out" onClick={this.handleDialUp.bind(this, 1, 1)}><span className="display-icon phone-icon" /> 视频</Button>
                        <Button type="primary" className="call-out" onClick={this.handleDialUp.bind(this, 1, 0)}><span className="display-icon phone-icon" />语音</Button>
                    </div>
                    <div className="dial-up-bottom">
                        {this.state.displayitems.length ?
                            this.state.displayitems.map((item, i) => {
                                let name, number;
                                if(item.Type == "0"){
                                    name = item.Name;
                                    number = item.Number.join(",");
                                } else {
                                    name = item.NameOrNumber;
                                    number = item.Number;
                                    let contactslen = msgsContacts.length;
                                    for(var i = 0; i < contactslen; i++){
                                        let contactItem = msgsContacts[i];
                                        if(contactItem.Number && contactItem.Number == number &&
                                            (contactItem.AcctIndex == item.Account || contactItem.AcctIndex == '-1')){
                                            name = contactItem.Name;
                                            break;
                                        }
                                    }
                                    if(!name) name = number;
                                }
                                let preStr = number, filterStr = "", lastStr = "";
                                if(this.state.filterStr != ""){
                                    filterStr = this.state.filterStr;
                                    let index = preStr.indexOf(filterStr);
                                    preStr = preStr.substring(0,index);
                                    lastStr = number.substring(index+filterStr.length);
                                }

                                return(
                                    <Row className="call-items" type="flex" justify="space-around">
                                        <Col span={8} style={{paddingLeft:26}}><div><div className={`display-icon item-type${item.Type}`}></div><div className="ellips contactstext contactname">{name}</div></div></Col>
                                        <Col span={5}></Col>
                                        <Col span={9}><span className="ellips contactstext contactnumber">{preStr}<span style={{color:"#ff0a0a"}}>{filterStr}</span><span>{lastStr}</span></span></Col>
                                        <Col className="callRecord" span={2} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                            {
                                                item.Type == "0" && item.Number.length > 1 ?
                                                <Popover
                                                    content={
                                                        <CallSelectNum sendSingleCall={this.props.sendSingleCall} selectnumItem={item}/>
                                                    }
                                                    placement="topRight"
                                                    trigger="focus">
                                                    <button className="item-call-btn display-icon"></button>
                                                </Popover> :
                                                <div className="item-call-btn display-icon"></div>
                                            }
                                        </Col>
                                    </Row>
                                )
                            }) :
                            <Row>
                                <div className = "nodatatips">
                                    <div></div>
                                    <p>{this.tr("no_data")}</p>
                                </div>
                            </Row>
                        }
                    </div>
                </Form>
            </Content>
        );
    }
}

const DialUp = Form.create()(Enhance(DialUpForm));

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    mainHeight: state.mainHeight,
    userType: state.userType,
    msgsContacts: state.msgsContacts,  //contacts list
    contactsAcct: state.contactsAcct,  //contacts with accounts formatted
    contactsInformation: state.contactsInformation,  //contacts with numbers formatted
    acctStatus: state.acctStatus,
    product: state.product,
    callDialog: state.callDialog,
    confmemberinfodata: state.confmemberinfodata

})

function mapDispatchToProps(dispatch) {
  var actions = {
      jumptoTab: Actions.jumptoTab,
      setCurMenu: Actions.setCurMenu,
      getContacts: Actions.getContacts,
      sendSingleCall: Actions.sendSingleCall,
      showCallDialog: Actions.showCallDialog,
      getCalllog: Actions.get_calllog,
      getAcctStatus: Actions.getAcctStatus,
      setTabKey: Actions.setTabKey,
      promptMsg: Actions.promptMsg,
      getItemValues:Actions.getItemValues,
      setItemValues:Actions.setItemValues,
      getAllConfMember: Actions.getAllConfMember,
      getLeftcalllogname: Actions.get_leftcalllogname,
      setDefaultAcct: Actions.set_defaultacct,
      cb_originatecall: Actions.cb_originate_call,
      quickStartIPVConf: Actions.quickStartIPVConf

  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DialUp));
