import React,{Component} from 'react';
import { hashHistory } from 'react-router';
import Enhance from './mixins/Enhance';
import * as Actions from './redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Layout, Menu, Button, Select, Input, Dropdown, Icon, Popconfirm,Modal} from "antd";
const Header = Layout;
const Search = Input.Search;
import { matchSearchResult } from './template/optionsFilter'

const confirm = Modal.confirm;

class SearchresultItem extends Component {
    constructor(props) {
        super(props);
    }

    handleclick(item,e){
        if( this.props.jumpPage == 'searchInput-fadein' ){
            var url = [item['url'][0],item['url'][1]];
            if(($.inArray("account", url) != -1) && (this.props.isWP8xx())) {
                url.pop();
            }
            hashHistory.push('/'+url.join('/'));
            this.props.setCurMenu(url);
            this.props.jumptoTab(item['tab']);
            this.props.HiddenSearchresult()
        }
    }

    render(){
        const searchresultItem = this.props.searchresultItem;
        if( searchresultItem && searchresultItem.length > 0 ){
            return (
                <div id="searchresultItem">
                    {
                        searchresultItem.map(function (item) {
                                return (
                                    <div className="searchresult-item" onClick={this.handleclick.bind(this,item)}>
                                        <span>{item.lang[1]}</span><span>></span>
                                        <span>{item.lang[2]}</span><span>></span>
                                        <span>{item.name[0]}</span>
                                        <span id="searchresult-val">{item.name[1]}</span>
                                        <span>{item.name[2]}</span>
                                    </div>
                                    )
                        },this)
                    }
                </div>
            )
        }else{
            return (
                <div></div>
            )
        }
    }
}

class SearchResult extends Component {
    constructor(props) {
        super(props);
    }

    HiddenSearchresult(){
        this.props.HiddenSearchresult();
    }

    render(){
        const searchresult = this.props.searchresult;
        if( searchresult && searchresult.length > 0 ){
            return (
                <div id="searchresult">
                    {
                        searchresult.map(function (item) {
                            var searchresultmenu = 'searchresult-menu' + item['menu'];
                            return (
                            <div className="searchresult-menu">
                                <div className={'searchresult-menu-title ' + searchresultmenu}>
                                    <span className='searchresult-menu-icon'>

                                    </span>
                                    <span className='searchresult-menu-content'>
                                        {item['value'][0]['lang'][0]}
                                    </span>
                                </div>
                                <SearchresultItem isWP8xx={this.props.isWP8xx} HiddenSearchresult={this.HiddenSearchresult.bind(this)} jumpPage={this.props.jumpPage} setCurMenu={this.props.setCurMenu} searchresultItem={item['value']} jumptoTab={this.props.jumptoTab} product={this.props.product}>
                                </SearchresultItem>
                            </div>
                            )
                        },this)
                    }
                </div>
            )
        }else{
            return (
                <div style={{"fontSize":"0.875rem","color":"#0d1017","lineHeight":"40px", "marginLeft":"3px"}}>{this.props.callTr("a_noresult")}</div>
            )
        }
    }
}

class InputSearchdiv extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchresult: [],
            searchValue: '',
            addClass: 'searchInput-fadeout display-hidden',
            displayresult: 'display-hidden'
        }
    }


    searchInput(value){
        if( value ){
            var newSearcharray = matchSearchResult(value);
            this.setState({
                searchresult: newSearcharray,
                searchValue: value
            })
        }else{
            this.setState({
                searchValue: value
            })
        }
    }

    handleclick(ev){
        var addClass = this.state.addClass;
        var displayresult = this.state.displayresult;
        if( addClass == 'searchInput-fadeout display-hidden' || addClass == 'searchInput-fadeout' ){
            this.setState({addClass: 'searchInput-fadein', displayresult: 'display-block'})
            setTimeout(function(){document.getElementById('searchconfig').focus();},400)
        }else if( addClass == 'searchInput-fadein' ){
            this.setState({addClass: 'searchInput-fadeout', displayresult: 'display-hidden'})
        }
    }

    HiddenSearchresult(){
        this.setState({addClass: 'searchInput-fadeout', displayresult: 'display-hidden'})
    }

    render() {
        return (
            <div id="InputSearchdiv">
                <div id="searchbtn" onClick={this.handleclick.bind(this)}></div>
                <div className={this.state.addClass} id="inputSearchresultdiv">
                    <div style={{ "width": "0","height": "0","border-left": "9px solid transparent","border-right": "9px solid transparent","border-bottom": "10px solid #fff","position": "absolute","right": "130px","top": "-7px" }}></div>
                    <div style={{ "padding-right": '25px' }}>
                        <Search
                            id="searchconfig"
                            placeholder={this.props.callTr('a_search')}
                            style={{ width: '100%' }}
                            onSearch={value => this.searchInput(value)}
                        />
                    </div>
                    {/*<div style={{"line-height":"30px","margin-left": '3px',"margin-right": '25px', 'color':'#bac0ca'}} className={this.state.searchValue?'':'display-hidden'}>{this.props.callTr('a_searchaborttip')}"<span>{this.state.searchValue}</span> "</div>*/}
                    <div style={{"line-height":"30px","margin-left": '3px',"margin-right": '25px', 'color':'#bac0ca'}} className={this.state.searchValue?'display-hidden':''}><span>{this.props.callTr('a_searchtip')}</span></div>
                    <div className={(this.state.searchValue?'':'display-hidden') || this.state.displayresult}>
                        <SearchResult isWP8xx={this.props.isWP8xx} callTr={this.props.callTr} HiddenSearchresult={this.HiddenSearchresult.bind(this)} searchresult={this.state.searchresult} jumpPage={this.state.addClass} jumptoTab={this.props.jumptoTab} setCurMenu={this.props.setCurMenu} setTabKey={this.props.setTabKey} product={this.props.product} />
                    </div>
                </div>
            </div>
        )
    }

}

const req_items = [
    {"name": "dnd", "pvalue": "dnd", "value": ""},
]

class MainHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dndstyle: 'dndoff',
            showControl:false,
            mInterval:""
        }
    }

    componentDidMount() {
        var mylanguage = $.cookie( "MyLanguage") != null ? $.cookie( "MyLanguage") : 'en';
        this.props.setCurLocale( mylanguage );
        this.props.checkIsApply();
        var pwdchange = $.cookie("needchange");
        pwdchange == 0 ? this.props.passTipStyle("display-hidden") : this.props.passTipStyle("display-block");
        var dndstyle;
        this.props.getItemValues(req_items,(values) => {
            dndstyle = (values.dnd == '1' ? 'dndon' : 'dndoff');
            this.setState({dndstyle: dndstyle})
        })
    }

    cb_reboot = () => {
        var urihead = "action=ping";
        urihead += "&time=" + new Date().getTime();
        var self = this;
        $.ajax ({
            type: 'get',
            url:'/manager',
            data:urihead,
            dataType:'text',
            success:function(data) {
                self.cb_rebootres(data);
            },
            error:function(xmlHttpRequest, errorThrown) {
                self.cb_networkerror(xmlHttpRequest, errorThrown);
            }
        });
    }

    cb_rebootres(data) {
        var msgs = this.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "pong") {
            this.props.setPageStatus(2)
        } else {
            this.props.setPageStatus(0)
        }
    }

    handleClickLogout() {
        hashHistory.push('/status/acct');
        this.props.setPageStatus(0)
        var urihead = "action=logoff";
        urihead += "&time=" + new Date().getTime();
        var self = this;
		$.ajax ({
			type: 'get',
			url:'/manager',
			data:urihead,
			dataType:'text',
			success:function(data) {
				self.cb_logout_done(data);
			},
			error:function(xmlHttpRequest, errorThrown) {
				self.cb_networkerror(xmlHttpRequest, errorThrown);
			}
		});
    }

    handlepwdchange = () => {
        hashHistory.push('/sysset/security');
        this.props.changeTabKeys("security","sysset");
        this.props.setCurMenu(["sysset", "security"]);
        this.props.getUserType((usertype) => {
            if(usertype == "admin"){
                this.props.jumptoTab(1);
            }else{
                this.props.jumptoTab(0);
            }
        });
    }

    handleSetDndMode = () => {
        var dndtype;
        var dndstyle;
        this.props.getItemValues(req_items,(values)=>{
            var self = this;
            if(values.dnd == '1'){
                confirm({
                    title: 'close?',
                    content: 'close?',
                    okText: 'Yes',
                    cancelText: 'No',
                    onOk() {
                        self.props.setDndMode("0",()=>{
                            self.setState({dndstyle: "dndoff"})
                        })
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            }else{
                confirm({
                    title: 'open??',
                    content: 'open',
                    okText: 'Yes',
                    cancelText: 'No',
                    onOk() {
                        self.props.setDndMode("1",()=>{
                            self.setState({dndstyle: "dndon"})
                        })
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            }
           /* dndtype = (result.dndinfo == 'dndon' ? '0' : '1');
            this.props.setDndMode(dndtype, (result) => {
                this.props.getDndMode( (result) => {
                    dndstyle = (result.dndinfo == 'dndon' ? 'dndon' : 'dndoff');
                    this.setState({dndstyle: dndstyle})
                })
            });*/
        });
    }






    cb_logout_done(data) {
        var msgs = this.res_parse_rawtext(data);
        if (msgs.headers['response'].toLowerCase() == "success") {
            this.props.setPageStatus(0)
        } else {
            this.props.setPageStatus(0)
        }
    }

    handleLangChange(value){
        this.props.setCurLocale(`${value}`);
        $.cookie( "MyLanguage" , `${value}` , { path: '/', expires: 10 });
    }

    showRemoteControl=()=>{
        this.setState({
            showControl:true
        })
    }

    closeRemoteControl=()=>{
        this.setState({
            showControl:false
        })
    }

    sendKey=(keycode)=>{
        if( keycode != undefined && keycode != "" ){
            var counttimes = 0;
            this.props.setKeyCode(0, keycode, 0);
            this.state.mInterval = setInterval(()=>{this.props.setKeyCode(0, keycode, ++counttimes);}, 200);
        }
    }

    clearsendKey=(keycode)=>{
        clearInterval(this.state.mInterval);
        if( keycode != undefined && keycode != "" ){
            this.props.setKeyCode(1, keycode, 0);
        }
    }

    render() {
        const {applyButtonStatus,pwdvisible,product,oemId,userType} = this.props;

        this.updateApplyButton(applyButtonStatus);

        const applyfunc = $.cookie("applyfunc");

        const operationMenu = (
            <Menu className = "headermenu">
                <Menu.Item><div className = "triangleIcon triangleIconAdmin"></div></Menu.Item>
                <Menu.Item className="headermenuitem" key="1">
                    <Popconfirm placement="left" title={this.tr("a_confirmrbt")} onConfirm={this.cb_reboot} okText={this.tr("a_ok")} cancelText={this.tr("a_cancel")}>
                        <a>
                            <Icon className="poweroff" style={{"margin-right":"7px"}} />
                            {this.tr("reboot")}
                        </a>
                    </Popconfirm>
                </Menu.Item>
                <Menu.Item className="headermenuitem" key="2">
                    <a onClick={this.handleClickLogout.bind(this)}>
                        <Icon className="logout" style={{"margin-right":"7px"}} />
                        {this.tr("logout")}
                    </a>
                </Menu.Item>
            </Menu>
        );

        const languageMenu = (
            <Menu className = "headermenu">
                <Menu.Item><div className = "triangleIcon"></div></Menu.Item>
                <Menu.Item className="headermenuitem" key="1">
                    <a onClick={this.handleLangChange.bind(this, "en")}>English</a>
                </Menu.Item>
                <Menu.Item className="headermenuitem" key="2">
                    <a onClick={this.handleLangChange.bind(this, "zh")}>中文</a>
                </Menu.Item>
            </Menu>
        );

        return (
            <Header className='header-container'>
                <Menu theme="dark" type="horizontal" style={{"height":"100%"}}>
                    <div className={"changepwddiv" + " " +pwdvisible} >
                        {this.tr("a_changedftpwd")}
                        <a onClick={this.handlepwdchange}>{this.tr("a_changepwd")}</a>
                    </div>
                    <div className='header-vendor-div'>
                        {oemId=="54"?<span>{this.props.productStr}</span>:
                            oemId=="70"?
                                <a>
                                    <i className ="spriteNec"></i>
                                    <span>{this.props.productStr}</span>
                                </a>:
                                <a href="http://www.grandstream.com" target="_blank">
                                    <i className ="sprite"></i>
                                    <span>{this.props.productStr}</span>
                                </a>
                        }
                    </div>
                    <div className='header-btn-div'>
                        <div className={"remote " + this.state.dndstyle} id="dndbtn">
                            <a onClick={this.handleSetDndMode}>{this.tr("a_dnd")}</a>
                        </div>
                        <div className="RemoteControl" style={{width:100}}>
                            <a onClick={this.showRemoteControl}>{this.tr("a_RemoteControl")}</a>
                        </div>
                        <div>
                            <Dropdown overlay={languageMenu}>
                                <a style={{"display":"inline-block", "width":"100%", "height":"100%"}}>
                                    {$.cookie("MyLanguage") == "zh" ? "中文" : "English"}
                                    <Icon type="down" style={{"margin-left":"5px"}} />
                                </a>
                            </Dropdown>
                        </div>
                        <div className="divideline"></div>
                        <div>
                            <Dropdown overlay={operationMenu}>
                                <a style={{"display":"inline-block", "width":"100%", "height":"100%"}}>
                                    <Icon className = "adminLogo" type="user" style={{"margin-right":"3px"}}/>
                                    {$.cookie("type")}
                                    <Icon type="down" style={{"margin-left":"5px"}} />
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                    <InputSearchdiv callTr={this.tr} isWP8xx={this.isWP8xx} jumptoTab={this.props.jumptoTab} setCurMenu={this.props.setCurMenu} product={product} userType={userType}>
                    </InputSearchdiv>
                    <div className="applyDiv">
                        <Button id="apply" className="apply"
                            onClick={this.props.applyValue.bind(this, applyfunc, ()=>{$.cookie("applyfunc", "", {path: '/', expires:10});})} ghost>{this.tr("a_apply")}
                        </Button>
                    </div>
                    <div id="RemoteControlModal" style={{display: this.state.showControl ? "block" : "none"}}>
                        <div id="remotectrl" className="borderradius">
                            <div id="tophomebtn">
                                <button id="powerbtn" keycode="26" onMouseDown={this.sendKey.bind(this,26)} onMouseUp={this.clearsendKey.bind(this,26)}></button>
                            </div>
                            <div id="touchpad"></div>
                            <div id="topbuttonarea" className="btnarea">
                                <button id="returnkey" className="optbtnleft" keycode="4" onMouseDown={this.sendKey.bind(this,4)} onMouseUp={this.clearsendKey.bind(this,4)}><div></div></button>
                                <button id="homekey" className="optbtnmid" keycode="3" onMouseDown={this.sendKey.bind(this,3)} onMouseUp={this.clearsendKey.bind(this,3)}><div></div></button>
                                <button id="menukey" className="optbtnright" keycode="82" onMouseDown={this.sendKey.bind(this,82)} onMouseUp={this.clearsendKey.bind(this,82)}><div></div></button>
                            </div>
                            <div className="btnarea">
                                <button id="customkey" keycode="285" onMouseDown={this.sendKey.bind(this,285)} onMouseUp={this.clearsendKey.bind(this,285)}><div></div></button>
                            </div>
                            <div id="funcbtn" className="btnarea">
                                <button id="reddigit" className="optbtnleft" keycode="281" onMouseDown={this.sendKey.bind(this,281)} onMouseUp={this.clearsendKey.bind(this,281)}><div></div></button>
                                <button id="yellowdigit" className="optbtnmid" keycode="282" onMouseDown={this.sendKey.bind(this,282)} onMouseUp={this.clearsendKey.bind(this,282)}><div></div></button>
                                <button id="bluedigit" className="optbtnright" keycode="283" onMouseDown={this.sendKey.bind(this,283)} onMouseUp={this.clearsendKey.bind(this,283)}><div></div></button>
                            </div>
                            <div className="radiusbtn">
                                <button id="volumedownbtn" keycode="25" onMouseDown={this.sendKey.bind(this,25)} onMouseUp={this.clearsendKey.bind(this,25)}><div></div></button>
                                <button id="volumeupbtn" keycode="24" onMouseDown={this.sendKey.bind(this,24)} onMouseUp={this.clearsendKey.bind(this,24)}><div></div></button>
                            </div>
                            <div className="centerarrow">
                                <div style={{width:"100%",height:'20px',textAlign:"center"}}><button id="topbtn" className="arrowbtn" keycode="19" onMouseDown={this.sendKey.bind(this,19)} onMouseUp={this.clearsendKey.bind(this,19)}><div></div></button></div>
                                <div style={{width:"100%", height:'52px'}}>
                                    <div style={{width:"20px", height:"52px",position:"absolute",left:0}}><button id="leftbtn" className="arrowbtn" keycode="21" onMouseDown={this.sendKey.bind(this,21)} onMouseUp={this.clearsendKey.bind(this,21)}><div></div></button></div>
                                    <button id="centerbtn" className="center" keycode="23" onMouseDown={this.sendKey.bind(this,23)} onMouseUp={this.clearsendKey.bind(this,23)}></button>
                                    <div style={{width:"20px", height:"52px", position:"absolute", right:0}}><button id="rightbtn" className="arrowbtn" keycode="22"onMouseDown={this.sendKey.bind(this,22)} onMouseUp={this.clearsendKey.bind(this,22)}><div></div></button></div>
                                </div>
                                <div style={{width:"100%", height:"20px", textAlign:"center"}}><button id="bottombtn" className="arrowbtn" keycode="20" onMouseDown={this.sendKey.bind(this,20)} onMouseUp={this.clearsendKey.bind(this,20)}><div></div></button></div>
                            </div>
                            <div className="radiusbtn" style={{marginTop:"-23px",height:"37px"}}>
                                <button id="zoomoutbtn" keycode="169" onMouseDown={this.sendKey.bind(this,169)} onMouseUp={this.clearsendKey.bind(this,169)}><div></div></button>
                                <button id="zoominbtn" keycode="168" onMouseDown={this.sendKey.bind(this,168)} onMouseUp={this.clearsendKey.bind(this,168)}><div></div></button>
                            </div>
                            <div id="mediabtn" className="downbtnarea">
                                <button id="layoutbtn" className="optbtnleft" keycode="277" onMouseDown={this.sendKey.bind(this,277)} onMouseUp={this.clearsendKey.bind(this,277)}><div></div></button>
                                <button id="ptzbtn" className="optbtnmid" keycode="276" onMouseDown={this.sendKey.bind(this,276)} onMouseUp={this.clearsendKey.bind(this,276)}><div></div></button>
                                <button id="presentationbtn" className="optbtnright" keycode="278" onMouseDown={this.sendKey.bind(this,278)} onMouseUp={this.clearsendKey.bind(this,278)}><div></div></button>
                            </div>
                            <div className="downbtnarea">
                                <button id="digitcall" className="optbtnleft" keycode="5" onMouseDown={this.sendKey.bind(this,5)} onMouseUp={this.clearsendKey.bind(this,5)}><div></div></button>
                                <button id="digitback" className="optbtnmid" keycode="67" onMouseDown={this.sendKey.bind(this,67)} onMouseUp={this.clearsendKey.bind(this,67)}><div></div></button>
                                <button id="digitendcall" className="optbtnright" keycode="6" onMouseDown={this.sendKey.bind(this,6)} onMouseUp={this.clearsendKey.bind(this,6)}><div></div></button>
                            </div>
                            <div className="downbtnarea">
                                <button id="digit1" className="optbtnleft" keycode="8" onMouseDown={this.sendKey.bind(this,8)} onMouseUp={this.clearsendKey.bind(this,8)}><div></div></button>
                                <button id="digit2" className="optbtnmid" keycode="9" onMouseDown={this.sendKey.bind(this,9)} onMouseUp={this.clearsendKey.bind(this,9)}><div></div></button>
                                <button id="digit3" className="optbtnright" keycode="10" onMouseDown={this.sendKey.bind(this,10)} onMouseUp={this.clearsendKey.bind(this,10)}><div></div></button>
                            </div>
                            <div className="downbtnarea">
                                <button id="digit4" className="optbtnleft" keycode="11" onMouseDown={this.sendKey.bind(this,11)} onMouseUp={this.clearsendKey.bind(this,11)}><div></div></button>
                                <button id="digit5" className="optbtnmid" keycode="12" onMouseDown={this.sendKey.bind(this,12)} onMouseUp={this.clearsendKey.bind(this,12)}><div></div></button>
                                <button id="digit6" className="optbtnright" keycode="13" onMouseDown={this.sendKey.bind(this,13)} onMouseUp={this.clearsendKey.bind(this,13)}><div></div></button>
                            </div>
                            <div className="downbtnarea">
                                <button id="digit7" className="optbtnleft" keycode="14" onMouseDown={this.sendKey.bind(this,14)} onMouseUp={this.clearsendKey.bind(this,14)}><div></div></button>
                                <button id="digit8" className="optbtnmid" keycode="15" onMouseDown={this.sendKey.bind(this,15)} onMouseUp={this.clearsendKey.bind(this,15)}><div></div></button>
                                <button id="digit9" className="optbtnright" keycode="16" onMouseDown={this.sendKey.bind(this,16)} onMouseUp={this.clearsendKey.bind(this,16)}><div></div></button>
                            </div>
                            <div className="downbtnarea">
                                <button id="digitasterisk" className="optbtnleft" keycode="17" onMouseDown={this.sendKey.bind(this,17)} onMouseUp={this.clearsendKey.bind(this,17)}><div></div></button>
                                <button id="digit0" className="optbtnmid" keycode="7" onMouseDown={this.sendKey.bind(this,7)} onMouseUp={this.clearsendKey.bind(this,7)}><div></div></button>
                                <button id="digithash" className="optbtnright" keycode="18" onMouseDown={this.sendKey.bind(this,18)} onMouseUp={this.clearsendKey.bind(this,18)}><div></div></button>
                            </div>
                            <div id="bottommutebtn">
                                <button id="mutebtn" className="center" keycode="91" onMouseDown={this.sendKey.bind(this,91)} onMouseUp={this.clearsendKey.bind(this,91)}></button>
                            </div>
                            <div id="closeremote" onClick={this.closeRemoteControl}></div>
                        </div>
                    </div>
                </Menu>
            </Header>
        );
    }
};

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    pageStatus: state.pageStatus,
    pwdvisible: state.passtipStyle,
    applyButtonStatus: state.applyButtonStatus,
    product: state.product,
    oemId:state.oemId,
    userType: state.userType,
    productStr: state.productStr,
    itemValues:state.itemValues,
})

function mapDispatchToProps(dispatch) {
  var actions = {
      setCurLocale: Actions.setCurLocale,
      promptMsg: Actions.promptMsg,
      setPageStatus: Actions.setPageStatus,
      jumptoTab: Actions.jumptoTab,
      changeTabKeys: Actions.changeTabKeys,
      applyValue: Actions.applyValue,
      checkIsApply: Actions.checkIsApply,
      passTipStyle: Actions.passTipStyle,
      getUserType: Actions.getUserType,
      setCurMenu: Actions.setCurMenu,
      setDndMode: Actions.setDndMode,
      getDndMode: Actions.getDndMode,
      setKeyCode:Actions.setKeyCode,
      getItemValues:Actions.getItemValues,
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(MainHeader));
