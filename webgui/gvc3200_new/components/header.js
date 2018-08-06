import React,{Component} from 'react';
import { hashHistory } from 'react-router';
import Enhance from './mixins/Enhance';
import * as Actions from './redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Layout, Menu, Button, Select, Input, Dropdown, Icon, Popconfirm} from "antd";
const Header = Layout;
const Search = Input.Search;
import { matchSearchResult } from './template/optionsFilter'

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

class MainHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dndstyle: 'dndoff'
        }
    }

    componentDidMount() {
        var mylanguage = $.cookie( "MyLanguage") != null ? $.cookie( "MyLanguage") : 'en';
        this.props.setCurLocale( mylanguage );
        this.props.checkIsApply();
        var pwdchange = $.cookie("needchange");
        pwdchange == 0 ? this.props.passTipStyle("display-hidden") : this.props.passTipStyle("display-block");
        var dndstyle;
        this.props.getDndMode( (result) => {
            dndstyle = (result.dndinfo == 'dndon' ? 'dndon' : 'dndoff');
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
        this.props.getDndMode( (result) => {
            dndtype = (result.dndinfo == 'dndon' ? '0' : '1');
            this.props.setDndMode(dndtype, (result) => {
                this.props.getDndMode( (result) => {
                    dndstyle = (result.dndinfo == 'dndon' ? 'dndon' : 'dndoff');
                    this.setState({dndstyle: dndstyle})
                })
            });
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
                        {this.isWP8xx() ? <div className={"remote " + this.state.dndstyle} id="dndbtn">
                            <a onClick={this.handleSetDndMode}>{this.tr("a_dnd")}</a>
                        </div> : ''}
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
    productStr: state.productStr
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
      getDndMode: Actions.getDndMode
  }
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(MainHeader));
