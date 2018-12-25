import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router';
import Enhance from "../../../mixins/Enhance"
import { Layout, Select, Input, Button, Icon, Row, Col, Form, Popover, Table } from "antd"
import * as Actions from '../../../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CallSelectNum from '../contact/selectNum'
const Content = Layout
const Option = Select.Option
const FormItem = Form.Item
let req_items;
// let mInputIpvtNum = 0;
let mInputNum = 0;
let mCurMaxlineNum = 0;
let mClickAdd = 0;
let mHasIPVNumber = 0;
let mNeedRemove = 0;  //need the variable when input character in inputnum then add member by add button
let mCalling = false;
let mDisDialrule = [];
let mDisableIPVT = 0;
const rowkey = record => {return record.key}


class DialUpForm extends Component {
    globalItems = [];
    contactItems = [];

    constructor(props) {
        super(props);

        this.state = {
            displayitems: [],
            filterStr: "",
            acctstatus: [],
            defaultacct: 0,
            selacct: -1,
            accountsdivdisplay: "display-hidden",
            ipvttalkdialdisplay: "display-hidden",
            bjdialdisplay: "display-hidden",
            accountdisplayarr: ["display-hidden", "display-hidden", "display-hidden", "display-hidden"],
            // maxinputnum: -1,
            expandedRows:[]
        }
        this.disconfstate = "0";
        req_items = new Array;
        req_items.push(
            this.getReqItem("defaultAcct", "22046", ""),
            this.getReqItem("disdialplan", "2382", ""),
            this.getReqItem("disconfstate", "1311", "")
        );
        this.callmode="0"; // "0": normal call;  "1": IP call
    }

    componentDidMount = () => {
        let self = this;
        let {maxlinecount, busylinenum} = this.props;
        mCurMaxlineNum = maxlinecount - busylinenum;
        this.props.getItemValues(req_items, (values) => {
            let isbjacct = values["defaultAcct"] == "2" ? true : false
            let defaultacct = values["defaultAcct"] == "8" ? 3 : values["defaultAcct"] || "-1"
            this.setState({
                defaultacct: defaultacct,
                selacct: defaultacct,
                // maxinputnum: maxlinenum,
                ipvttalkdialdisplay: isbjacct ? "display-hidden" : "display-block",
                bjdialdisplay: isbjacct ? "display-block" : "display-hidden"
            });
            let disdialrule = values["disdialplan"];
            if (disdialrule == "" || disdialrule == undefined) {
                disdialrule = 0;
            } else {
                disdialrule = parseInt(disdialrule).toString(2);
            }
            this.disconfstate = values["disconfstate"];
            this.isneeddialplan_check(disdialrule);
        });

        this.props.getAcctStatus((acctstatus) => {
            if (!this.isEmptyObject(acctstatus)) {
                this.getAcctStatusData(acctstatus);
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
        });

        $("#inputnum").removeClass("ant-input");
        $("#inputnum").manifest({
            formatDisplay: function (data, $item, $mpItem) {

                let mName = data;
                if (data.name == undefined) {
                    for (let i = 0; i < self.contactItems.length; i++) {
                        let contactitem = self.contactItems[i];
                        if (-1 != contactitem.Number.indexOf(data)) {
                            mName = contactitem.Name;
                            break;
                        }
                    }
                } else {
                    mName = data.name;
                }
                return mName;
            },
            formatValue: function (data, $value, $item, $mpItem) {
                let selacct = self.state.selacct;
                let mNumber;
                if (data.name == undefined) {
                    mNumber = data + ":::" + selacct;
                    if (mHasIPVNumber == 0 && selacct == 1) {
                        mHasIPVNumber = 1;
                    }
                    if (selacct == 0 && self.state.acctstatus[0].register == "0")
                        $item.addClass("mf_item_0_unreg");
                    else
                        $item.addClass("mf_item_" + selacct);
                    $item.attr("acctId", selacct);
                } else {
                    mNumber = data.number;
                    var account = mNumber.split(":::")[1];
                    if (mHasIPVNumber == 0 && account == 1) {
                        mHasIPVNumber = 1;
                        //mMaxlineNum --;
                        //$("#membermaxnum").text(mMaxlineNum);
                    }
                    if (account == 0 && self.state.acctstatus[0].register == "0")
                        $item.addClass("mf_item_0_unreg");
                    else
                        $item.addClass("mf_item_" + account);
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
                if (data.number == undefined) {
                    //add by input a number
                    mNumber = data;
                    mName = data;
                    mNeedRemove = 1;
                    setTimeout("mNeedRemove = 0;", 500)
                } else {
                    //add by press add button
                    mName = data.name;
                    mNumber = data.number;
                    mNeedRemove = 0;
                }

                if (mNumber.length > 128) {
                    self.props.promptMsg('ERROR', "a_19243");
                    $item.remove();
                    return false;
                }

                var exist = 0;
                var values = $('#inputnum').manifest('values');
                for (var i = 0; i < values.length; i++) {
                    if (values[i] == mNumber) {
                        exist = 1;
                        return false;
                    }
                }
                if (exist == 1) {
                    return false;
                }
            },
            onChange: function (type, data, $item) {
                let selacct = self.state.selacct;
                if (type == "add") {
                    if(data.number && data.number.indexOf(":::") != -1){  // add by btn
                        if (data.number.split(":::")[1] != "1") //   acct is not ipvt
                            mInputNum ++;
                    }else{  //add by input
                        if(selacct != 1){
                            mInputNum ++;
                        }
                    }
                } else if (type == "remove") {
                    $("#inputnum").val("");
                    var acct = $item.attr("acctid");
                    if (acct != 1) {
                        mInputNum--;
                    }
                }
                $("#membernum").text(mInputNum);
                $(".mf_item").removeClass("mfred_item");
                if (mInputNum > mCurMaxlineNum) {
                    $("#membernum").css("color", "red");
                    $(".mf_item:gt(" + (mCurMaxlineNum - 1) + ")").addClass("mfred_item");
                } else {
                    $("#membernum").css("color", "#444");
                }

                if (selacct == 1) {
                    if (mInputNum > mCurMaxlineNum)
                        $("#inputnum").hide();
                    else
                        $("#inputnum").show();
                }
                else {
                    if (mInputNum >= mCurMaxlineNum)
                        $("#inputnum").hide();
                    else
                        $("#inputnum").show();
                }
                if (type == "add" && mClickAdd == 0) {
                    //on_search_key();
                    //need use a timeout or else can't add the searched item
                    // mSearchTimer = setTimeout("on_search_key();", 500);
                } else if (type == "remove") {
                    $("#inputnum").val("");
                    if (mHasIPVNumber == 1) {
                        if ($item.attr("acctId") == 1) {
                            var values = $('#inputnum').manifest('values');
                            var hasIPV = 0;
                            for (var i = 0; i < values.length; i++) {
                                if (values[i].split(":::")[1] == 1) {
                                    hasIPV = 1;
                                    break;
                                }
                            }
                            if (hasIPV == 0) {
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

    hasipvtline = () => {
        let linesInfo = this.props.linesInfo;
        for(let i = 0; i< linesInfo.length;i++){
            if(linesInfo[i].acct == "1"){
                return true;
            }
        }
        return false;
    }

    parseconfmember = () => {
        let confmemberinfodata = this.props.confmemberinfodata;
        for (let i in this.globalItems) {
            if (this.globalItems[i].Type == "0") continue;
            let nameornumber = "", number = "", account = "";
            for (let j in confmemberinfodata) {
                if (this.globalItems[i].Id == confmemberinfodata[j].Id && this.globalItems[i].IsConf == "1") {
                    let name = confmemberinfodata[j].Name;
                    let itemnumber = confmemberinfodata[j].Number;
                    let itemaccount = confmemberinfodata[j].Account;
                    if (nameornumber != "") {
                        nameornumber += ":::" + name;
                    } else {
                        nameornumber += name;
                    }
                    if (number != "") {
                        number += ":::" + itemnumber;
                    } else {
                        number += itemnumber;
                    }
                    if(account != "" ){
                        account += ":::"+itemaccount;
                    }else{
                        account += itemaccount;
                    }
                    this.globalItems[i].Name = nameornumber;
                    this.globalItems[i].Number = number;
                    this.globalItems[i].Account = account;
                }
            }
        }
    }

    parsecalllogname = (missedcalllogsdata) => {

        for (let i in this.globalItems) {
            for (let j in missedcalllogsdata) {
                if (missedcalllogsdata[j].Id == this.globalItems[i].Id ) {
                    let missedcallitemname = missedcalllogsdata[j].Name;
                    this.globalItems[i].Number = this.globalItems[i].Name;
                    if (missedcallitemname) {
                        this.globalItems[i].Name = missedcallitemname;
                    }
                }
            }
        }
        this.props.getContacts((result) => {
            this.contactItems = JSON.parse(JSON.stringify(this.props.msgsContacts));
            for (let i in this.contactItems) {
                this.contactItems[i].Type = "0";
            }
            this.globalItems = this.globalItems.concat(this.contactItems);
            this.setState({displayitems: this.globalItems});
        });
    }

    getAcctStatusData = (acctstatus) => {
        let curAcct = [];
        let selacct = this.state.selacct;
        const acctStatus = acctstatus.headers;
        let max = 4;
        for (let i = 0; i < max; i++) {
            if (i == 3) {
                curAcct.push(
                    {
                        "acctindex": i,
                        "register": acctStatus[`account_${6}_status`],
                        "activate": acctStatus[`account_${6}_activate`],
                        "num": acctStatus[`account_${6}_name`],
                        "name": "H.323"
                    });
                if(acctStatus[`account_${6}_activate`] == "1" && selacct == -1){
                    this.setState({selacct: 3});
                }
            } else {
                if(acctStatus[`account_${i}_activate`] == "1" && selacct == -1){
                    this.setState({selacct: i});
                }
                let accountname = acctStatus[`account_${i}_name`];
                if (i == 0) {
                    if (acctStatus[`account_${i}_name`].length > 0) {
                        accountname = acctStatus[`account_${i}_name`];
                    } else if (acctStatus[`account_${i}_no`].length > 0) {
                        accountname = acctStatus[`account_${i}_no`];
                    } else {
                        accountname = "SIP";
                    }
                }
                curAcct.push(
                    {
                        "acctindex": i,
                        "register": acctStatus[`account_${i}_status`],
                        "activate": acctStatus[`account_${i}_activate`],
                        "num": acctStatus[`account_${i}_no`],
                        "name": accountname
                    });
            }
        }
        if(curAcct[1].activate == 1){
            mDisableIPVT = 0;
        }else{
            mDisableIPVT = 1;
        }
        this.setState({acctstatus: curAcct});
    }

    clickToAddAcct = () => {
        this.props.setCurMenu(['account']);
        hashHistory.push('/account');
        this.props.jumptoTab(0);
    }

    filterNumber = (e) => {
        let value = e.target.value.trim();
        let numbers = this.globalItems;
        let filternum = [];
        for (let i in numbers) {
            if (numbers[i].Type == "0") {
                if (numbers[i].Number.indexOf(value) != -1) {
                    filternum.push(numbers[i]);
                }
            } else {
                if (numbers[i].Number && numbers[i].Number.indexOf(value) != -1) {
                    filternum.push(numbers[i]);
                }
            }
        }
        this.setState({
            displayitems: filternum,
            filterStr: value
        });
    }

    isneeddialplan_check = (str) => {
        for (var i = 0; i < 7; i++)
            mDisDialrule[i] = 1;
        let length = str.length;
        if (length == 5) {
            str = str.substring(1, str.length);
            length = str.length;
        }

        let checkorder = new Array(6, 5, 3, 4);
        for (let i = 0; i < length; i++) {
            if (str.substring(i, i + 1) == 1)
                mDisDialrule[checkorder[length - i - 1]] = 0;
        }
    }

    switchcallmode = (value) => {
        this.callmode = value;
    }

    handleDialUp = (isbyinputnum, isvideo) => {
        let {acctstatus, selacct} = this.state;
        let {busylinenum, maxlinecount, promptMsg, showCallDialog, linesInfo} = this.props;
        if (isbyinputnum == 1) {
            const form = this.props.form;
            if (mCalling) return;
            mCalling = true;
            if (selacct == "2") {
                if(busylinenum >= maxlinecount){
                    promptMsg('WARNING', 'a_16683');
                    setTimeout(function () {mCalling = false;}, 1000);
                    return false;
                }
                let dialnum = form.getFieldValue("bjnumber").trim();
                if (!dialnum) {
                    setTimeout(function () {mCalling = false;}, 1000);
                    return false;
                }
                let bjpwd = form.getFieldValue("bjpwd").trim();
                if (bjpwd != "") {
                    dialnum += "." + bjpwd;
                }
                this.props.cb_start_addmemberconf(acctstatus, dialnum, selacct+"", "call", "", "", "", isvideo);
                setTimeout(function () {
                    mCalling = false;
                }, 1000);
                return;
            }

            var values = $('#inputnum').manifest('values');
            if (selacct == "1" && values.length == 0) {
                if(this.hasipvtline()){
                    showCallDialog("9");
                    setTimeout(function(){mCalling = false;},1000);
                    return;
                }else{
                    if(linesInfo && linesInfo.length > 0){
                        promptMsg('WARNING', 'a_16683');
                        setTimeout(function(){mCalling = false;},1000);
                        return;
                    }
                }
                this.props.quickStartIPVConf(isvideo);
                setTimeout(function () {mCalling = false;}, 1000);
                return;
            }

            let dialnum = "";
            let dialacct = "";
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

            let isipcall = 0, mode = "call";
            if(this.callmode == "1"){
                isipcall = 1;
                mode = "ipcall";
            }
            if (dialnum != "") {
                //selacct may be 1 for bluejeans account when no account configured,so use 0 forever as only one account
                var isdialplan = mDisDialrule[6];
                if (selacct == "1" && values.length > 1) {
                    for (var i = 1; i < values.length; i++)
                        isdialplan += ":::" + mDisDialrule[6];
                }
                if (values.length == 1 && !this.hasipvtline()) {
                    this.props.cb_start_single_call(acctstatus, dialnum, dialacct, 0, isdialplan, isipcall , isvideo);
                } else {
                    this.props.cb_start_addmemberconf(acctstatus, dialnum, dialacct, mode, "", isdialplan, "", isvideo);
                }
                $('#inputnum').manifest('remove');
            }
            setTimeout(function () {
                mCalling = false;
            }, 1000);
        }
    }

    showAccounts = () => {

    }

    focusinputnum = () => {
        $("#inputnum").css("width", "13px").focus();
    }

    inputnumberfocus = () => {
        $("#numbertip").hide();
    }
    inputnumberblur = () => {
        if ($("#inputnum").val() == "") {
            var values = $('#inputnum').manifest('values');
            if (values.length == 0) {
                $("#numbertip").show();
                $("#inputnum").val("");
            }
        }
    }
    handleMouseEnter = () => {
    }

    handleMouseOver = (item, index) => {
        let accountdisplayarr = this.state.accountdisplayarr;
        accountdisplayarr[index] = "display-block";
        this.setState({accountdisplayarr: accountdisplayarr})
    }

    handleMouseLeave = (item, index) => {
        let accountdisplayarr = this.state.accountdisplayarr;
        accountdisplayarr[index] = "display-hidden";
        this.setState({accountdisplayarr: accountdisplayarr})
    }

    handleAcctSelectDiv = () => {
        let accountsdivdisplay = this.state.accountsdivdisplay;
        accountsdivdisplay == "display-hidden" ? this.setState({accountsdivdisplay: "display-block"}) :
            this.setState({accountsdivdisplay: "display-hidden"});
    }

    selectAcctitem = (item, index) => {
        const {busylinenum, maxlinecount} = this.props;
        let curmaxline = maxlinecount - busylinenum;

        if (item.activate == '0' || item.register == "0") {
            return;
        }
        this.setState({
            selacct: index,
            accountsdivdisplay: "display-hidden",
            ipvttalkdialdisplay: index == 2 ? "display-hidden" : "display-block",
            bjdialdisplay: index == 2 ? "display-block" : "display-hidden"
        });


        var values = $('#inputnum').manifest('values');
        if(index != 1){
            if( $("#membernum").text() >= curmaxline || values.length >= curmaxline )
                $("#inputnum").hide();
            else
                $("#inputnum").show();
        }else{
            if(values.length == 0 || this.hasipvtline() )
                $("#dialnum").show();
            $("#membernumdiv").hide();
        }

        if( index == 1 ){
            $("#numbertip").text(this.tr("a_16693")+" ("+this.tr("a_10158")+")");
            let values = $('#inputnum').manifest('values')
            if(values.length < 1){
                $("#numbertip").show();
            }
        }else{
            $("#numbertip").text("");
        }


        // if(index == 0 || index == 3){
        //     this.setState({maxinputnum:1});
        // }else{
        //     this.setState({maxinputnum: -1});
        // }
    }

    setDefaultAcct = (acctindex) => {
        this.props.setDefaultAcct(acctindex, () => {
            acctindex = acctindex == 3 ? 8 : acctindex;
            this.setState({
                defaultacct: acctindex,
                selacct: acctindex
            })
        })
    }

    _renderName = (text, record, index) => {
        return <div style={{height: '44px', lineHeight: '44px'}}>
            <div className={`display-icon item-type${record.row3.Type}`}></div>
            <div className="ellips contactstext contactname">{text.replace(/:::/g,",")}</div>
        </div>
    }

    _renderNumber = (text) => {
        text = text.replace(/:::/g,",");
        let preStr = text, filterStr = "", lastStr = "";
        if (this.state.filterStr != "") {
            filterStr = this.state.filterStr;
            let index = preStr.indexOf(filterStr);
            preStr = preStr.substring(0, index);
            lastStr = text.substring(index + filterStr.length);
        }
        return <span className="ellips contactstext contactnumber">{preStr}<span style={{color:"#ff0a0a"}}>{filterStr}</span><span>{lastStr}</span></span>
    }


    _renderDate = (text) => {
        if(text==""){
            return ""
        }
        return this.convertTime(text);
    }

    _renderActions =(text, record, index) =>{
        let isConf = "0";
        if(record.row3.Type == "0"){
            isConf = "0";
        }else if(record.row3 && record.row3.IsConf){
            isConf = record.row3.IsConf;
        }

        return <div className="callRecord">
            <div className="item-call-btn display-icon" style={{float:'right'}} onClick={this.handleRedial.bind(this,record.row3,isConf)}></div>
            <div className="item-add-btn display-icon" style={{top:'0px', float:'right'}} onClick={this.addtoinputbox.bind(this,record,0)}></div>
        </div>
    }

    /**
     *
     * @param type   1：点击整条记录下的单条的添加按钮；  0：点击整条记录右边的添加按钮
     * @param e event
     */
    addtoinputbox = (record, type, e) =>{
        e.stopPropagation();
        const { busylinenum, maxlinecount, promptMsg } = this.props;
        let curMaxlineNum = maxlinecount - busylinenum;
        if( mNeedRemove == 1 ){
            $('#inputnum').manifest('remove', ':last');
        }
        $('#inputnum').val("");
        mClickAdd = 1;
        var values = $('#inputnum').manifest('values');
        var hasipvtacct = false;  //正要添加的号码是否有ipvt帐号
        if(type == 0) {
            let accts = record.row3.Account || record.row3.AcctIndex;
            if(accts.split(":::").indexOf("1") != -1 ){
                hasipvtacct = true;
            }
        }else{
            if(record.Account == "1"){
                hasipvtacct = true;
            }
        }
        if(values.length >= curMaxlineNum ){
            if(hasipvtacct){
                //检查已输入的号码类型
                for( let i=0; i < values.length; i++ ) {
                    var number = values[i].split(":::")[0];
                    var acct = values[i].split(":::")[1];
                    if (acct != 1) {
                        promptMsg('WARNING', this.tr('a_54') + this.tr('a_12222'));
                        return;
                    }
                }
            }else{
                promptMsg('WARNING', this.tr('a_54') + this.tr('a_12222'));
                return;
            }
        }

        if(type == 1){
            $('#inputnum').manifest('add', {
                name: this.htmlEncode(record.Name),
                number: this.htmlEncode(record.Number) + ":::" + record.Account
            });
        } else if(type == 0){
            let names = record.row0.split(',');
            let numbers = record.row1.split(',');
            let accounts = [];
            if(record.row3.Type == "0"){
                accounts = record.row3.AcctIndex.split(":::") ;
            }else{
                accounts = record.row3.Account.split(":::") ;
            }
            let hasdisipv = false;
            let newmembernum = 0;
            for(let i = 0; i < numbers.length; i++) {
                if (mDisableIPVT && accounts[i] == 1) {
                    hasdisipv = true;
                    continue;
                }
                newmembernum++;
                $('#inputnum').manifest('add', {
                    name: this.htmlEncode(names[i]),
                    number: this.htmlEncode(numbers[i]) + ":::" + accounts[i]
                });
            }
            mClickAdd = 0;
            if( hasdisipv && newmembernum == 0 ){
                this.props.promptMsg('WARNING', 'a_15051');
            }
        }
    }


    handleRedial = (record, isConf, e) => {
        e.stopPropagation();
        let {acctstatus} = this.state;
        if(isConf != "1"){
            let dialnum = "", dialacct = "";
            dialnum = record.Number || record.NameOrNumber;
            dialacct = record.Account || record.AcctIndex;
            if(dialnum){
                if( mDisableIPVT && dialacct == 1 ){
                    this.props.promptMsg('WARNING', 'a_15051');
                    return false;
                }
                let isdialplan;
                if(record.Type == "0"){
                    isdialplan = mDisDialrule[5];
                }else{
                    isdialplan = mDisDialrule[3];
                }
                this.props.cb_start_single_call(acctstatus,dialnum, dialacct, 0 , isdialplan, 0, "1");

            }else{
                this.props.promptMsg('WARNING', 'a_16665');
                return;
            }
        }else{
            if(this.disconfstate == "1"){
                this.props.promptMsg('WARNING', this.tr('a_560'));
                return;
            }
            let dialnum = record.Number;
            let dialacct = record.Account;
            let dialnums = record.Number.split(":::");
            let dialnames = record.Name.split(":::");
            let dialaccts= record.Account.split(":::");
            let tmpnum = record.Number.replace(/-/g,"");
            if( tmpnum == "" ){
                this.props.promptMsg('WARNING', this.tr('a_16665'));
                return false;
            }

            if( dialnums.length == 1 && record.Account != 2 ){
                if( mDisableIPVT && record.Account == 1 ){
                    this.props.promptMsg('WARNING', this.tr('a_15051'));
                    return false;
                }
                let isdialplan;
                if(record.Type == 2)
                    isdialplan = mDisDialrule[4];
                else
                    isdialplan = mDisDialrule[3];
                this.props.cb_start_single_call(acctstatus, record.Number, record.Account, 0, isdialplan, 0, record.IsVideo);
            }else{
                if( mDisableIPVT ){
                    let dialnum = "", dialacct = "";
                    for(let i = 0; i < dialaccts.length; i++){
                        if( dialaccts[i] != 1 ){
                            if( dialnum != "" ){
                                dialnum += ":::";
                                dialacct += ":::";
                            }
                            dialnum += dialnums[i];
                            dialacct += dialaccts[i];
                        }
                    }
                    if( dialnum == "" ){
                        this.props.promptMsg('WARNING', this.tr('a_15051'));
                        return false;
                    }
                }

                var isdialplan = "";
                for(var i = 0; i < dialaccts.length; i++){
                    if(record.Type == 2)
                        isdialplan += mDisDialrule[4] + ":::";
                    else
                        isdialplan += mDisDialrule[3] + ":::";
                }
                isdialplan = isdialplan.substring(0, isdialplan.length - 3);
                this.props.cb_start_addmemberconf(acctstatus, dialnum, dialacct, "call", "", isdialplan, "", record.IsVideo);
            }
            return;
        }
    }


    expandedRowRender = (record) =>{
        if(record.row3.IsConf != "1") return "";
        let confId = record.row3.Id;
        let isConf = record.row3.IsConf;
        let confmemberinfodata = this.props.confmemberinfodata;
        let confmembers = [];
        for(let i = 0; i < confmemberinfodata.length; i++){
            if(confmemberinfodata[i].Id == confId){
                confmembers.push(
                    <Row style={{height:'40px',lineHeight:'40px'}}>
                        <Col span={6} style={{paddingLeft:'40px'}}>{confmemberinfodata[i].Name}</Col>
                        <Col span={6} style={{paddingLeft:'8px'}}>{confmemberinfodata[i].Number}</Col>
                        <Col span={6} style={{paddingLeft:'8px'}}>{this.convertTime(confmemberinfodata[i].Date)}</Col>
                        <Col span={6}><div className="callRecord">
                            <div className="item-call-btn display-icon" style={{float:'right'}} onClick={this.handleRedial.bind(this,confmemberinfodata[i],isConf)}></div>
                            <div className="item-add-btn" style={{top:'0px', float:'right'}} onClick={this.addtoinputbox.bind(this,confmemberinfodata[i],1)}></div></div>
                        </Col>
                    </Row>
                )
            }
        }
        return confmembers
    }

    handelOnRowClick = (record) => {
        let expandedRows = this.state.expandedRows;
        $('.ant-table-row').removeClass('line-hoverbg')
        $('.ant-table-row:eq('+ record.key +')').addClass('line-hoverbg')
        if(-1 != expandedRows.indexOf(record.key)){
            this.setState({expandedRows: []});
        }else{
            this.setState({expandedRows: [record.key]});
        }
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const {busylinenum, maxlinecount, msgsContacts} = this.props;
        let acctstatus = this.state.acctstatus;
        let selacct = this.state.selacct != -1 ? this.state.selacct : this.state.defaultacct;
        let displayitems = this.state.displayitems;
        let displaydataslen = displayitems.length;
        let displaydatas = [];
        let j = 0;
        for (let i = 0; i < displaydataslen; i++) {  //去除正在通话的记录

            if (displayitems[i].Name) {
                displaydatas.push({
                    key: j++,
                    row0: displayitems[i].Name || displayitems[i].Number,
                    row1: displayitems[i].Number || displayitems[i].NameOrNumber,
                    row2: displayitems[i].Date || "",
                    row3: displayitems[i]
                })
            }
        }
        let nodatatipdisplay = "none";
        if (displaydatas.length == 0) {
            nodatatipdisplay = "block";
        }

        const columns = [{
            title: this.tr("a_19626"),
            key: 'row0',
            dataIndex: 'row0',
            width: '25%',
            render: (text, record, index) => (
                this._renderName(text, record, index)
            )
        }, {
            title: this.tr("a_10006"),
            key: 'row1',
            dataIndex: 'row1',
            width: '25%',
            render: (text, record, index) => (
                this._renderNumber(text)
            )
        }, {
            title: this.tr("a_6289"),
            key: 'row2',
            dataIndex: 'row2',
            width: '25%',
            render: (text, record, index) => (
                this._renderDate(text)
            )
        }, {
            title: this.tr("a_44"),
            key: 'row3',
            dataIndex: 'row3',
            width: '25%',
            render: (text, record, index) => (
                this._renderActions(text, record, index)
            )
        }];

        return (
            <Content className="content-container">
                <div className="subpagetitle">{this.tr("a_9400")}</div>
                <Form className="call-area"
                      style={{minHeight: this.props.mainHeight, height: this.props.mainHeight}}>
                    <div className="dial-up-top">
                        <div className="acctselbox">
                            {
                                acctstatus.length ?
                                    <div onClick={this.handleAcctSelectDiv.bind(this)}> <span
                                        style={{display: 'inline-block', width: '300px'}}>
                                    {selacct != -1 ? acctstatus[selacct].name : this.tr("a_9684").substring(0, this.tr("a_9684").length - 1)}</span>
                                        <span>{selacct != -1 ? acctstatus[selacct].num : ""}</span></div>
                                    : ""
                            }
                        </div>
                        <div className={"account-info " + this.state.accountsdivdisplay}>
                            <ol>
                                {acctstatus.map((item, i) => {
                                    return <li
                                        className={`account-item ${item.activate == '0' || item.register == '0' ? 'acct-item-disable' : ''}`}
                                        onMouseOver={this.handleMouseOver.bind(this, item, i)}
                                        onMouseLeave={this.handleMouseLeave.bind(this, item, i)}
                                        onClick={this.selectAcctitem.bind(this, item, i)}>
                                        <span className="acct-item-name">{item.name}</span> <span
                                        className="acct-item-num">{item.num}</span>
                                        {item.activate == "0" ? <span
                                                className={"acct_status " + this.state.accountdisplayarr[i]}>{this.tr("a_18564")}</span> :
                                            item.register == "0" ?
                                                <span className={"acct_status " + this.state.accountdisplayarr[i]}>{this.tr("a_acctunregistered")}</span> :
                                                i == this.state.defaultacct ? <span
                                                        className={"acct_status " + this.state.accountdisplayarr[i]}>{this.tr("a_19113")}</span> :
                                                    <Button type="primary" style={{marginTop: '4px'}}
                                                            className={"acct_status " + this.state.accountdisplayarr[i]}
                                                            onClick={this.setDefaultAcct.bind(this, i)}>
                                                        {this.tr("a_16697")} </Button>
                                        }
                                    </li>
                                })}
                            </ol>
                        </div>
                        <FormItem className={"call-inputnum-formitem " + this.state.ipvttalkdialdisplay}>
                            <div className="dialdiv">
                                {
                                    <Input id="inputnum" className="" onChange={this.filterNumber}
                                           onPressEnter={this.handleDialUp.bind(this, 1, 0)} style={{width: "13px"}}
                                           onFocus={this.inputnumberfocus.bind(this)}
                                           onBlur={this.inputnumberblur.bind(this)}/>
                                }
                                <div id="membernumdiv" className={selacct == 1 ? 'display-hidden' : 'display-block'}
                                     style={{position: 'absolute', top: '60px', right: '3px', fontSize: '16px', color: '#444', width: '30px'}}>
                                    <span id="membernum">0</span>/<span id="membermaxnum">{ maxlinecount - busylinenum }</span>
                                </div>
                                <div style={{position: "relative", top: "-102px", left: '10px', fontSize: '14px', color: '#444', width: '600px', color: '#999'}} id="numbertipdiv" onClick={this.focusinputnum.bind(this)}>
                                    <span id="numbertip">{this.tr("a_16693") + " (" + this.tr("a_10158") + ")"}</span>
                                </div>
                            </div>
                        </FormItem>
                        <div className={"call-inputnum-formitem " + this.state.bjdialdisplay}>
                            <FormItem>
                                {
                                    getFieldDecorator("bjnumber", {
                                        initialValue: ""
                                    })(
                                        <Input style={{width: "500px"}} placeholder={this.tr("a_15055")}/>
                                    )
                                }
                            </FormItem>
                            <FormItem>
                                {
                                    getFieldDecorator("bjpwd", {
                                        initialValue: ""
                                    })(
                                        <Input style={{width: "500px"}} placeholder={this.tr("a_16705")}/>
                                    )
                                }
                            </FormItem>
                        </div>
                        <div style={{float: 'left', marginLeft: '10px'}}>
                            <div>
                                <Button type="primary" className="call-out"
                                        onClick={this.handleDialUp.bind(this, 1, 1)}><span
                                    className="display-icon phone-icon"/> 视频</Button>
                                <Button type="primary" className="call-out" style={{marginLeft: '10px'}}
                                        onClick={this.handleDialUp.bind(this, 1, 0)}><span
                                    className="display-icon phone-icon"/>语音</Button>
                            </div>
                            <div style={{marginTop:'10px'}}>
                                <Select defaultValue="0" onChange={this.switchcallmode}>
                                    <Option value="0">{this.tr("a_504")}</Option>
                                    <Option value="1">{this.tr("a_506")}</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="dial-up-bottom">
                        <Table
                            rowKey={rowkey}
                            columns={columns}
                            pagination={false}
                            dataSource={displaydatas}
                            showHeader={false}
                            // expandRowByClick = { true }
                            expandedRowRender={this.expandedRowRender.bind(this)}
                            expandIconColumnIndex={-1}
                            expandIconAsCell={false}
                            onRowClick={this.handelOnRowClick.bind(this)}    //添加单击方法
                            expandedRowKeys={this.state.expandedRows}
                            // expandedRowKeys = {[]}
                        />
                        <div className="nodatooltips" style={{display: nodatatipdisplay}}>
                            <div></div>
                            <p>{this.tr("a_10082")}</p>
                        </div>
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
    confmemberinfodata: state.confmemberinfodata,
    maxlinecount: state.maxlinecount,
    busylinenum: state.busylinenum,
    linesInfo: state.linesInfo
})

function mapDispatchToProps(dispatch) {
  var actions = {
      jumptoTab: Actions.jumptoTab,
      setCurMenu: Actions.setCurMenu,
      getContacts: Actions.getContacts2,
      sendSingleCall: Actions.sendSingleCall,
      showCallDialog: Actions.showCallDialog,
      getCalllog: Actions.get_calllog,
      getAcctStatus: Actions.getAcctStatus,
      promptMsg: Actions.promptMsg,
      getItemValues:Actions.getItemValues,
      setItemValues:Actions.setItemValues,
      getAllConfMember: Actions.getAllConfMember,
      getLeftcalllogname: Actions.get_leftcalllogname,
      setDefaultAcct: Actions.set_defaultacct,
      // cb_originatecall: Actions.cb_originate_call,
      quickStartIPVConf: Actions.quickStartIPVConf,
      // addconfmemeber: Actions.addconfmemeber,
      cb_start_addmemberconf: Actions.cb_start_addmemberconf,
      cb_start_single_call:Actions.cb_start_single_call
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(DialUp));
