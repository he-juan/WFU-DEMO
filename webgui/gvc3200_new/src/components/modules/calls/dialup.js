import React, { Component, PropTypes } from 'react'
import { hashHistory } from 'react-router';
import Enhance from "../../mixins/Enhance"
import { Layout, Select, Input, Button, Icon, Row, Col, Form, Popover, Table } from "antd"
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
            maxinputnum: -1,
            expandedRows:[]
        }
        req_items = new Array;
        req_items.push(
            this.getReqItem("defaultAcct", "22046", ""),
            this.getReqItem("disdialplan", "2382", "")
        )
    }

    componentDidMount = () => {
        let self = this;
        let maxlinenum = this.props.maxlinecount;
        mCurMaxlineNum = this.props.maxlinecount;
        this.props.getItemValues(req_items, (values) => {
            let isbjacct = values["defaultAcct"] == 2 ? true : false
            let defaultacct = values["defaultAcct"] == 8 ? 3 : values["defaultAcct"]
            this.setState({
                defaultacct: defaultacct,
                selacct: defaultacct,
                maxinputnum: maxlinenum,
                ipvttalkdialdisplay: isbjacct ? "display-hidden" : "display-block",
                bjdialdisplay: isbjacct ? "display-block" : "display-hidden"
            });
            let disdialrule = values["disdialplan"];
            if (disdialrule == "" || disdialrule == undefined) {
                disdialrule = 0;
            } else {
                disdialrule = parseInt(disdialrule).toString(2);
            }
            this.isneeddialplan_check(disdialrule);
        });

        this.props.getAcctStatus((acctstatus) => {
            if (!this.isEmptyObject(this.props.acctStatus)) {
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
                //$("#membernumdiv").css("top", "-22px");
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
                    if (values[i].split(":::")[0] == mNumber) {
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
                    if (selacct == 1) {
                        if (mInputIpvtNum == 0)
                            mInputNum++;
                        mInputIpvtNum++;
                    }
                    else {
                        mInputNum++;
                    }
                } else if (type == "remove") {
                    $("#inputnum").val("");
                    var acct = $item.attr("acctid");
                    if (acct == 1) {
                        mInputIpvtNum--;
                        if (mInputIpvtNum == 0)
                            mInputNum--;
                    }
                    else {
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

    parseconfmember = () => {
        let confmemberinfodata = this.props.confmemberinfodata;
        for (let i in this.globalItems) {
            if (this.globalItems[i].Type == "0") continue;
            let nameornumber = "", number = "", account = "" ;
            for (let j in confmemberinfodata) {
                if (this.globalItems[i].Id == confmemberinfodata[j].Id && this.globalItems[i].IsConf == "1") {
                    let name = confmemberinfodata[j].Name;
                    let itemnumber = confmemberinfodata[j].Number;
                    let itemaccount = confmemberinfodata[j].Account;
                    if (nameornumber != "") {
                        nameornumber += "," + name;
                    } else {
                        nameornumber += name;
                    }
                    if (number != "") {
                        number += "," + itemnumber;
                    } else {
                        number += itemnumber;
                    }
                    if(account != "" ){
                        account += ","+itemaccount;
                    }else{
                        account += itemaccount;
                    }
                    this.globalItems[i].NameOrNumber = nameornumber;
                    this.globalItems[i].Number = number;
                    this.globalItems[i].Account = account;
                }
            }
        }
    }

    parsecalllogname = (missedcalllogsdata) => {
        for (let i in this.globalItems) {
            for (let j in missedcalllogsdata) {
                if (missedcalllogsdata[j].Id == this.globalItems[i].Id && this.globalItems[i].IsConf == "0") {
                    let missedcallitemname = missedcalllogsdata[j].Name;
                    this.globalItems[i].Number = this.globalItems[i].NameOrNumber;
                    if (missedcallitemname) {
                        this.globalItems[i].NameOrNumber = missedcallitemname;
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
            } else {
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
        this.props.setTabKey("1");
        hashHistory.push('/account');
        this.props.jumptoTab(0);
    }

    filterNumber = (e) => {
        let value = e.target.value.trim();
        let numbers = this.globalItems;
        let filternum = [];
        for (let i in numbers) {
            if (numbers[i].Type == "0") {
                for (let j in numbers[i].Number) {
                    if (numbers[i].Number[j].indexOf(value) != -1) {
                        filternum.push(numbers[i]);
                        break;
                    }
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

    handleDialUp = (isbyinputnum, isvideo) => {
        if (isbyinputnum == 1) {
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

    cb_start_addmemberconf = (numbers, accounts, callmode, confid, isdialplan, confname, isvideo, isquickstart, pingcode) => {
        let acctstates = this.state.acctstatus;
        let accountArr =  accounts.split(":::");
        let unactive = 0;
        for(let i = 0 ; i< accountArr.length; i++){
            if (acctstates[accountArr[i]].activate == "0") {
                unactive ++;
            }
        }
        if(unactive == accountArr.length){
            this.props.promptMsg('WARNING', 'a_19374');
            return false;
        }



        // let tempnumbers = numbers.split(":::");
        if (isquickstart == undefined)
            isquickstart = 0;
        if (pingcode == undefined)
            pingcode = "";
        if (isdialplan == undefined || isdialplan === "")
            isdialplan = 1;

        if (confname == undefined)
            confname = "";
        var urihead;
        if (callmode == undefined || callmode == "")
            callmode = "call";

        urihead = "addconfmemeber&region=confctrl&numbers=" + encodeURIComponent(numbers) + "&accounts=" + encodeURIComponent(accounts) + "&confid=" + confid + "&callmode=" + callmode + "&isvideo=" + isvideo + "&isquickstart=" + isquickstart + "&pingcode=" + pingcode + "&isdialplan=" + isdialplan + "&confname=" + confname;
        this.props.cb_originatecall(urihead, numbers, accounts);
    }

    cb_start_single_call = (dialnum, dialacct, ispaging, isdialplan, isipcall, isvideo) => {
        let self = this;
        if (dialnum == "") {
            return false;
        }
        let acctstates = this.state.acctstatus;
        if (acctstates[dialacct].activate == "0") {
            this.props.promptMsg('WARNING', 'a_19374');
            return false;
        }
        if (acctstates[dialacct].register == "0") {
            this.props.promptMsg('WARNING', 'a_19375');
            return false;
        }
        if (dialnum == "anonymous") {
            this.props.promptMsg('WARNING', 'a_10083');
            return false;
        }
        if (isipcall == undefined) {
            isipcall = 0;
        }
        setTimeout(function () {
            self.props.cb_originatecall("originatecall&region=webservice&destnum=" + encodeURIComponent(dialnum) + "&account=" + dialacct + "&isvideo=" + isvideo + "&ispaging=" + ispaging + "&isipcall=" + isipcall + "&isdialplan=" + isdialplan + "&headerstring=&format=json", dialnum, dialacct);
        }, 100);
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

        if (item.activate == '0' || item.register == "0") {
            return;
        }
        this.setState({
            selacct: index,
            accountsdivdisplay: "display-hidden",
            ipvttalkdialdisplay: index == 2 ? "display-hidden" : "display-block",
            bjdialdisplay: index == 2 ? "display-block" : "display-hidden"
        });
        if(index != 1){
            if($("#membernum").text() == this.state.maxinputnum)
                $("#inputnum").hide();
            else
                $("#inputnum").show();
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
            <div className="ellips contactstext contactname">{text}</div>
        </div>
    }

    _renderNumber = (text) => {
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
        return <div className="callRecord">
            <div className="item-call-btn display-icon" style={{float:'right'}}></div>
            <div className="allow-detail" style={{top:'0px', float:'right'}} onClick={this.addtoinputbox.bind(this,record)}></div>
        </div>
    }

    addtoinputbox = (record, e) =>{
        e.stopPropagation();
        if( mNeedRemove == 1 ){
            $('#inputnum').manifest('remove', ':last');
        }
        $('#inputnum').val("");
        mClickAdd = 1;
        var values = $('#inputnum').manifest('values');
        if( values.length >= mCurMaxlineNum ) return;
        let names = record.row0.split(',');
        let numbers = record.row1.split(',');
        let accounts = record.row3.Account.split(",");
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

    expandedRowRender = (record) =>{
        if(record.row3.IsConf != "1") return "";
        let confId = record.row3.Id;
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
                            <div className="item-call-btn display-icon" style={{float:'right'}}></div>
                            <div className="allow-detail" style={{top:'0px', float:'right'}} ></div></div>
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


    render(){
        const { getFieldDecorator } = this.props.form;
        const msgsContacts = this.props.msgsContacts;
        let acctstatus = this.state.acctstatus;
        let selacct = this.state.selacct != -1 ? this.state.selacct : this.state.defaultacct;
        let displayitems = this.state.displayitems;
        let displaydataslen = displayitems.length;
        let displaydatas = [];
        for(let i = 0 ; i < displaydataslen  ; i++){  //去除正在通话的记录
            if(displayitems[i].Number){
                displaydatas.push({
                    key: i,
                    row0: displayitems[i].Name || displayitems[i].NameOrNumber || displayitems[i].Number,
                    row1: displayitems[i].Number,
                    row2: displayitems[i].Date || "",
                    row3: displayitems[i]
                })
            }
        }
        let nodatatipdisplay = "none";
        if(displaydatas.length == 0){
            nodatatipdisplay = "block";
        }

        const columns = [{
            title: this.tr("a_name"),
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
        },{
            title: this.tr("a_6289"),
            key: 'row2',
            dataIndex: 'row2',
            width: '25%',
            render: (text, record, index) => (
                this._renderDate(text)
            )
        }, {
            title: this.tr("a_operate"),
            key: 'row3',
            dataIndex: 'row3',
            width: '25%',
            render: (text, record, index) => (
                this._renderActions(text, record, index)
            )
        }];

        return (
            <Content className="content-container">
                <div className="subpagetitle">{this.tr("a_dialup")}</div>
                <Form className="call-area" >
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
                            <div id="membernumdiv" className={selacct == 1 ? 'display-hidden' : 'display-block'} style={{position:'absolute',top:'60px',right:'3px',fontSize:'16px',color:'#444',width:'30px'}}>
                                    <span id="membernum">0</span>/<span id="membermaxnum">{this.state.maxinputnum}</span>
                                </div>
                            <div style={{position:"relative",top:"-102px",left:'10px',fontSize:'14px',color:'#444',width:'600px',color:'#999'}} id="numbertipdiv" onClick={this.focusinputnum.bind(this)}>
                                    <span id="numbertip">{this.tr("a_16693")+" ("+this.tr("a_10158")+")"}</span>
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
                        <Table
                            rowKey = {rowkey}
                            columns = { columns }
                            pagination = { false }
                            dataSource = { displaydatas }
                            showHeader = { false }
                            // expandRowByClick = { true }
                            expandedRowRender = {this.expandedRowRender.bind(this)}
                            expandIconColumnIndex= { -1 }
                            expandIconAsCell={false}
                            onRowClick={this.handelOnRowClick.bind(this)}	//添加单击方法
                            expandedRowKeys={this.state.expandedRows}
                            // expandedRowKeys = {[]}
                        />
                        <div className = "nodatooltips" style={{display: nodatatipdisplay}}>
                            <div></div>
                            <p>{this.tr("no_data")}</p>
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
    maxlinecount: state.maxlinecount

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
