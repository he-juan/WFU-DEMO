import React from 'react'
import { Router, hashHistory } from 'react-router'
import Routes from "./routes"
import MainNav from './nav/main_nav'
import Footer from "./modules/pubModule/footer"
import Enhance from "./mixins/Enhance"
import {Layout,BackTop,LocaleProvider} from "antd"
import * as Actions from './redux/actions/index'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import CallDialog from './modules/calls/call/callDialog'
import CallTip from './modules/calls/call/callTip'
import IncomingcallDialog from './modules/calls/call/incomingcallDialog'
import en_US from "antd/lib/locale-provider/en_US";
import ja_JP from "antd/lib/locale-provider/ja_JP";
import es_ES from "antd/lib/locale-provider/es_ES";
import pt_BR from "antd/lib/locale-provider/pt_BR";
import ru_RU from "antd/lib/locale-provider/ru_RU";
const Content  = Layout;
let savingtimes = 0;
let req_items;

class Main extends React.Component {
    constructor(props) {
        super(props);
        req_items = new Array;
    }

    componentWillMount = () => {
        if(this.props.callDialogStatus != "end") {
            this.props.showCallDialog("end");
        }
        let isipvtexist = false;
        this.props.getItemValues([this.getReqItem("P7059", "7059", "")], (data) => {
            this.props.getIpvtExist(data);

            if(data["P7059"] == "1"){
                isipvtexist = true;
            }

            const product = this.props.product;
            let maxacctnum;
            switch (product) {
                case "GVC3210":
                    maxacctnum = 4;
                    break;
                default:
                    maxacctnum = 16;
            }
            if(isipvtexist && maxacctnum == 16){
                maxacctnum = 15;
            }
            this.props.setMaxAcctNum(maxacctnum);
        });

        this.props.getMaxlineCount();

        this.props.getUserType();
        this.props.getFxoexit();
    }
    enterSaveHandler = (e) => {
        if (e.key == 'Enter' && e.target.id !== 'searchconfig') {
            this.props.enterPageSaving(savingtimes++);
        }
    }
    componentDidMount() {
        this.props.updateMainHeight(document.body.offsetHeight - 150);
        let _this = this;
        document.addEventListener('keypress', _this.enterSaveHandler, false)
        this.props.getDefaultAcct()
        this.props.getContactsNew()
        this.props.getCallLogsNew()
        this.props.getTimezone('en')
        this.props.getItemValues([this.getReqItem("P122", "122", "")], (data) => {
            this.props.setUse24Hour(data.P122)
        })
        this.props.getDateInfo()
        /*get dial line status to init the call page*/
        this.props.getAllLineStatus((result)=>{
            if(result.length > 0){
                // this.props.isConfOnHold();
                this.props.getlocalrcdstatus();
                for(let i = 0; i< result.length; i++){
                    if(result[i].acct == "1"){
                        this.props.getipvtrcdstatus();
                        this.props.getipvthandsupstatus();
                        this.props.resumecamera((result)=>{
                            if(result == "1"){
                                this.props.getcmrnameandnumber((data)=>{
                                    let ipvtcmrinviteinfo = {};
                                    ipvtcmrinviteinfo.line = result[i].line;
                                    ipvtcmrinviteinfo.name = data.cameraName;
                                    ipvtcmrinviteinfo.number = data.cameraNumber;
                                    this.props.setipvtcmrinviteinfo(ipvtcmrinviteinfo);
                                });
                            }
                        });
                    }
                }
            }
        });

        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }

        window.onscroll = function () {
            var t = document.documentElement.scrollTop || document.body.scrollTop;
            var top_div1_father = document.getElementsByClassName("AcctTabs")[0];
            var top_div2_father = document.getElementsByClassName("accountTab")[0];
            if (top_div1_father && top_div2_father) {
                var top_div1 = top_div1_father.children[0];
                var top_div2 = top_div2_father.children[0];
                if (t > 30) {
                    top_div1.style.position = "fixed";
                    top_div1.style.top = "50px";
                    top_div1.style.left = "240px";
                    top_div1.style.paddingTop = "8px";
                    top_div1.style.background = "#f3f7fa";
                    top_div1.style.zIndex = "1000";
                    top_div2.style.position = "fixed";
                    top_div2.style.top = "105px";
                    top_div2.style.left = "242px";
                    top_div2.style.width = $("body").width() - 254 + 'px';
                    top_div2.style.background = "#fff";
                    top_div2.style.zIndex = "1000";
                } else {
                    top_div1.style.position = "static";
                    top_div1.style.paddingTop = "0";
                    top_div2.style.position = "static";
                    top_div2.style.width = "100%"
                }
            }
        }
    }
    componentWillUnmount() {
        let _this = this;
        document.removeEventListener('keypress', _this.enterSaveHandler, false)
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.linesinfo.length > 0 && nextProps.linesinfo == 0) {
            setTimeout(() => {
                this.props.getCallLogsNew()
            }, 1000)
        }
    }
    render() {
        let locale
        if (this.props.curLocale == 'en') {
            locale = en_US;
        }else if(this.props.curLocale == 'ja'){
            locale = ja_JP;
        }else if(this.props.curLocale == 'es'){
            locale = es_ES;
        }else if(this.props.curLocale == 'pt'){
            locale = pt_BR;
        }else if(this.props.curLocale == 'ru'){
            locale = ru_RU;
        } else if(this.props.curLocale == 'zh'){
            locale = null;
        }
        let linesinfo = [...this.props.linesinfo];
        let incomingcallsinfo = [];
        for(let i = linesinfo.length -1 ; i >= 0; i--){
            //check if is incomming call
            if(linesinfo[i].state == "2") {
                incomingcallsinfo.push(linesinfo[i]);
                linesinfo.splice(i, 1);
            }
        }

        return (
            <LocaleProvider locale={locale}>
            <Content className='main-container'>
                <MainNav />
                <div className='main-content'>
                    {
                        this.props.callDialogStatus == "minimize"
                        ? <CallTip status={this.props.callDialogStatus} />
                        : null
                    }
                    {
                        (linesinfo.length > 0 && this.props.callDialogStatus != "minimize")
                        || this.props.callDialogStatus == "10" || this.props.callDialogStatus == "9"
                        ? <CallDialog linestatus={linesinfo} callDialogStatus={this.props.callDialogStatus} />
                        : null
                    }
                    <Router history={ hashHistory }>
                        { Routes() }
                    </Router>
                    <div>
                        <BackTop />
                    </div>
                    <Footer />
                </div>
            </Content>
            </LocaleProvider>
        );
    }
}

const mapStateToProps = (state) => ({
    product: state.product,
    callDialogStatus: state.callDialogStatus,
    curLocale:state.curLocale,
    linesinfo: state.linesInfo
})

const mapDispatchToProps = (dispatch) => {
    const actions = {
        updateMainHeight: Actions.updateMainHeight,
        enterPageSaving: Actions.enterPageSaving,
        getUserType: Actions.getUserType,
        setMaxAcctNum: Actions.setMaxAcctNum,
        getIpvtExist: Actions.getIpvtExist,
        getItemValues: Actions.getItemValues,
        getFxoexit: Actions.getFxoexit,
        getAllLineStatus: Actions.getAllLineStatus,
        showCallDialog: Actions.showCallDialog,
        getNvrams: Actions.getNvrams,
        setMuteStatus: Actions.setMuteStatus,
        getMaxlineCount: Actions.getMaxlineCount,
        getlocalrcdstatus: Actions.getlocalrcdstatus,
        getipvtrcdstatus: Actions.getipvtrcdstatus,
        getipvthandsupstatus: Actions.getipvthandsupstatus,
        resumecamera: Actions.resumecamera,
        getcmrnameandnumber: Actions.getcmrnameandnumber,
        setipvtcmrinviteinfo: Actions.setipvtcmrinviteinfo,
        getDefaultAcct: Actions.getDefaultAcct,
        getContactsNew: Actions.getContactsNew,
        getCallLogsNew: Actions.getCallLogsNew,
        getTimezone: Actions.getTimezone,
        setUse24Hour: Actions.setUse24Hour,
        getDateInfo: Actions.getDateInfo
    }
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(Main));
