import {options} from "./template.js"
import * as Store from '../entry'

const getSubObjs = (menu, key) => {
    let objs = [];
    for (var m in menu) {
        if (menu[m]['name'] == key) {
            objs = menu[m]['sub'];
            break;
        }
    }

    return objs;
}

var states;
const getStates = () => states = Store.store.getState();

// hidden the data or not
const hiddenConfigName = (data) => {
    var product = data['product'];
    var acl = data['acl'];
    var oem = data['oem'];
    let pId = "";
    switch(states.product) {
        case "GVC3200":
            pId = '1';
            break;
        case "GVC3210":
            pId = '2';
            break;
        case "GVC3220":
            pId = '3';
            break;
    }
    if(states.oemId != "54"){
        let name = data['name']
        if(name === 'sitename'){
            return true;
        }
    }
    var oemArr =(oem && oem.replace(/\s/g, "").split(','));
    if ((states.userType == 'user' && acl == '1')
        || (oem && oemArr.indexOf(states.oemId) != -1)
        || (product && product.indexOf(pId) != -1)) {
        return true;
    }
    return false;
}

const tr = (text) => {
    var tr_text = text;
    var language = $.cookie('MyLanguage') == null ? 'en' : $.cookie('MyLanguage');
    try {
        tr_text = window.eval(text+"_" + language);
    } catch (err) {
    } finally {
        return tr_text;
    }
}

const matchSearch = function(value, data, url,array){
    if( (data instanceof Array) && data.length > 0 ){
        for( var i = 0; i < data.length; i++ ){
            var obj = data[i];
            if( !hiddenConfigName(obj) ){
                if( obj['sub'] ){
                    matchSearch(value,obj['sub'],{address: url['address'] + obj['name'] + '/', lang:url['lang'] + tr(obj['lang']) + '/', tabindex: i },array);
                }else{
                    var name = tr(obj['lang']);
                    if( name && obj['name'] ){
                        var url_address = url['address'];
                        var urlArr = url_address.substring(0,url_address.length-1).split('/');
                        var url_lang = url['lang'];
                        var url_langArr = url_lang.substring(0,url_lang.length-1).split('/');
                        var index = name.toLowerCase().indexOf(value.toLowerCase());
                        if( index != -1 ){
                            var nameArr = [];
                            nameArr.push(name.substring(0,index));
                            nameArr.push(name.substring(index,index+value.toLowerCase().length));
                            nameArr.push(name.substring(index+value.toLowerCase().length));
                            var searchresult_item = {};
                            searchresult_item.url = urlArr;
                            searchresult_item.lang = url_langArr;
                            searchresult_item.tab = url['tabindex'];
                            searchresult_item.name = nameArr;
                            array.push(searchresult_item);
                        }
                    }
                }
            }
        }
    }
}

const matchSearchResult = (value) => {
    getStates();
    var searcharray = [];
    matchSearch(value,options,{address:'',lang:'',tabindex:0},searcharray);

    if( searcharray ){
        var newSearchobject = {};
        var newSearcharray = [];
        for( var i = 0; i < searcharray.length; i++ ){
            var obj = searcharray[i];
            var menuVal = obj.url[0];
            if( newSearchobject[menuVal] ){
                newSearchobject[menuVal].push(obj);
            }else{
                newSearchobject[menuVal] = [];
                newSearchobject[menuVal].push(obj);
            }
        }
        for( var prop in newSearchobject ){
            newSearcharray.push({menu:prop,value:newSearchobject[prop]});
        }
        return newSearcharray;
    }else{
        return searcharray;
    }
}
export {matchSearchResult};

export const getHiddenOptions = (key) => {
    getStates();
    let user = states.userType;
    let menu = states.curMenu;
    let tab = key;
    let optionObj = options;
    let tabObj;
    let items;
    let ret = [];
    if (user != "admin" && user != "user") {
        return ret;
    }

    /*
    for (var i in menu) {
        if(menu[0] == 'account' && menu.length == 1) {
            optionObj = optionObj[menu[i]]['sipAcct']
        } else {
            optionObj = optionObj[menu[i]];
        }
    }
    */

    for (var i in menu) {
        optionObj = getSubObjs(optionObj, menu[i]);
    }

    if (menu[0] == 'account' && menu.length == 1) {
        optionObj = optionObj[0]['sub'];
    }

    tabObj = optionObj[tab];

    if (tabObj == undefined) {
        return ret;
    }

    // tab need't render
    if( hiddenConfigName(tabObj) ){
        ret.push(-1);
        return ret;
    }

    items = tabObj.sub;

    for (var i = 0; items[i] != undefined; i++) {
        // user & oem & product
        if( hiddenConfigName(items[i]) ){
            ret.push(i);
        }
    }

    return ret;
}

export const getFirstTab = () => {
    getStates();
    let menu = states.curMenu;
    let optionObj = options;
    let firstTab = "0";

    for (var i in menu) {
        optionObj = getSubObjs(optionObj, menu[i]);
    }

    if (menu[0] == 'account' && menu.length == 1) {
        optionObj = optionObj[0]['sub'];
    }

    for(let i=0;i<optionObj.length;i++){
        if(!hiddenConfigName(optionObj[i])){
            firstTab=i.toString();
            break;
        }
    }
    return firstTab;
}

