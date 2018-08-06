import React from "react";
import { hashHistory } from 'react-router';
import Enhance from "../mixins/Enhance";
import * as Actions from '../redux/actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Layout, Menu, Icon} from "antd";
const Sider = Layout;
const SubMenu = Menu.SubMenu;

class MainNav extends React.Component {
    constructor(props) {
        super(props);

        let hashname = location.hash.split('/');
        let openkey;
        let current
        if (hashname.length === 3) {
            openkey = hashname[1];
            current = hashname[2];
            var currentArr = current.split("?_k");
            if (currentArr[0] === '') {
                current = hashname[1];
            } else {
                current = currentArr[0];
            }
            if (openkey === '') {
                openkey = 'status';
                current = 'acct';
            }
        } else if (hashname.length === 2) {
            openkey = hashname[1].split("?_k")[0];
            current = hashname[1].split("?_k")[0];
        } else {
            openkey = 'status';
            current = 'acct';
        }
        this.state = {
            current: current,
            openKeys: [openkey],
            menus: []
        };

        if( hashname ){
            if (openkey == current) {
                this.props.setCurMenu([this.state.openKeys[0]]);
                hashHistory.push('/' + this.state.openKeys[0] + "/");
            } else {
                this.props.setCurMenu([this.state.openKeys[0], this.state.current]);
                hashHistory.push('/' + this.state.openKeys[0] + "/" + this.state.current);
            }
            this.props.setTabKey("1");
        }
    }

    handleClick(e){
        const keyPath = e.keyPath.reverse();
        this.props.setCurMenu(keyPath);
        this.props.setTabKey("1");
        hashHistory.push('/' + keyPath.join('/'));
        this.setState({
            current: e.key
        });
        this.props.jumptoTab(0);
    };

    handleSubMenuClick(firstKey, event) {
        if(this.props.userType == "user") {
            if(event.key == "callset")
                firstKey = "callfeatures";
            else if(event.key == "maintenance")
                firstKey = "diagnosis";
        }

        this.props.setCurMenu([event.key, firstKey]);
        this.props.setTabKey("1");

        hashHistory.push('/' + event.key + "/" + firstKey);
        this.setState({
            current: firstKey
        });
    }

    componentWillMount = () => {
        const product = this.props.product;
        const oemid = this.props.oemId;

        this.props.getMenuList( (menus) => {
            let pId
            switch (product) {
                case "WP800":
                    pId="1";
                    break;
                case "WP820":
                    pId="1";
                    break;
                case "GXV3380":
                    pId="2";
                    break;
                case "GXV3370":
                    pId="3";
                    break;
                case "GAC2510":
                    pId="4";
                    break;

            }
            if(product == "GXV3380" && this.props.ipvtExist == "0"){
                menus[1].sub.length = 0;
            }

            if(this.props.fxoexistState != 1){
                for (let i in menus[5].sub){
                    if(menus[5].sub[i].name == "fxo"){
                        menus[5].sub[i].product = pId;
                        break;
                    }
                }
            }

            if(oemid != "54"){
                for (let i in menus[5].sub){
                    if(menus[5].sub[i].name == "sitename"){
                        menus[5].sub[i].product = pId;
                    }
                    if(menus[5].sub[i].name == "backup" && pId == "2") {
                        menus[5].sub[i].product = pId;
                    }
                }
            }

            for(let i = menus.length - 1; i >= 0; i--){
                let tmpro = menus[i].product;
                if(tmpro != undefined && tmpro.indexOf(pId) != -1) {
                    menus.splice(i, 1);
                } else {
                    let sub = menus[i].sub;
                    for(let j = sub.length - 1; j >= 0; j--){
                        if(sub[j].product != undefined && sub[j].product.indexOf(pId) != -1){
                            sub.splice(j, 1);
                        }
                    }
                }
            }

            this.setState({menus: menus});
        });
    }

    onOpenChange(openKeys) {
        this.props.jumptoTab(0);
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

        let nextOpenKeys = [];

        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }

        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }

        this.setState({ openKeys: nextOpenKeys });
    }

    getAncestorKeys = (key) => {
        const map = {};
        return map[key] || [];
    }

    render() {
        const usertype = this.props.userType;
        let menus = this.state.menus;
        let hashname = location.hash.split('/');
        let openkey;
        let current
        if (hashname.length === 3) {
            openkey = hashname[1];
            current = hashname[2];
            var currentArr = current.split("?_k");
            if (currentArr[0] === '') {
                current = hashname[1];
            } else {
                current = currentArr[0];
            }
        } else if (hashname.length === 2) {
            openkey = hashname[1].split("?_k")[0];
            current = hashname[1].split("?_k")[0];
        } else {
            openkey = 'status';
            current = 'acct';
        }
        return (
            <Sider className="menu-container" trigger={null}>
                <Menu
                    theme="dark"
                    mode="inline"
                    openKeys={[openkey]}
                    selectedKeys={[current]}
                    style={{"width":"240px", "min-height":"100%", "overflow-x":"hidden"}}
                    onClick={this.handleClick.bind(this)}
                    onOpenChange={ this.onOpenChange.bind(this) }
                    >
                    {menus.length ?
                        menus.map((menu, i) => {
                            if(menu.sub.length){
                                return usertype == "user" && menu.acl == 1 ? null :
                                <SubMenu key={menu.name} title={<span><Icon className={menu.name} />{this.tr(menu.lang)}</span>} onTitleClick={this.handleSubMenuClick.bind(this, menu.sub[0].name)}>
                                    {
                                        menu.sub.map((submenu, j) => {
                                            return usertype == "user" && submenu.acl == 1 ? null : <Menu.Item key={submenu.name} style={{"fontSize":"0.875rem"}}>{this.tr(submenu.lang)}</Menu.Item>
                                        })
                                    }
                                </SubMenu>
                            }
                            else{
                                return usertype == "user" && menu.acl == 1 ? null : <Menu.Item className="MuneItem" key={menu.name} style={{"fontSize":"0.875rem"}}><Icon className={menu.name} />{this.tr(menu.lang)}</Menu.Item>
                            }
                        })
                    : null}
                </Menu>
            </Sider>
        );
    }
};

const mapStateToProps = (state) => ({
    curLocale: state.curLocale,
    pageStatus: state.pageStatus,
    //menuList: state.menuList,
    ipvtExist: state.ipvtExist,
    product: state.product,
    changetabKeys: state.changetabKeys,
    hashChange: state.hashChange,
    fxoexistState: state.fxoexistState,
    userType: state.userType,
    oemId: state.oemId
})

const mapDispatchToProps = (dispatch) => {
    let actions = {
        setCurMenu: Actions.setCurMenu,
        getMenuList:Actions.getMenuList,
        getItemValues:Actions.getItemValues,
        jumptoTab:Actions.jumptoTab,
        setPageStatus:Actions.setPageStatus,
        setTabKey: Actions.setTabKey
    }
    return bindActionCreators(Actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Enhance(MainNav));
