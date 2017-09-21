var req_indexs = new Array("7045","7046","7047");
var MSG_OK = 1;
var MSG_ALERT = 2;
var MSG_NORMAL = 3;
var MSG_FAIL = 4;
var MSG_APPLY = 5;
var PERMANENCE = "permanence";
var applyFunctions = new Array();
var downnum=0;       //using for counting the timeout when downloading favorites and so on.
var mIPtest = /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;
var mRegnumber = new RegExp("^[0-9]*$");

$(window).load(function() {
	$(".rebootspan, .selectrebootspan").html("&nbsp;&nbsp;&nbsp;&nbsp;");
	//$("fieldset > div > div").addClass("righttext");
	checkIsApplyNeed();
});
$(function(){
    $("#statusdiv").prependTo( $("#Formvalidate") );
    $("select option:eq(0)").attr("selected", true);
    $("input[type=radio],input[type=checkbox]").addClass('inputradio');

    //add a star flag to differ the needreboot items
    $(".maintenancebody .rebootitem").each(function(){           
        //var $required = $("<strong class='needreboot'> *&nbsp;</strong>");
        //$(this).prepend($required);
    });
    $(".maintenancebody .noreboot").each(function(){
        //var $required = $("<strong>&nbsp;&nbsp;&nbsp;</strong>");
        //$(this).prepend($required);
    });

	$("button").mouseover(function(){
        $(this).addClass('buttonover');
    }).mouseout(function(){
        $(this).removeClass('buttonover');
    });
    $(".widebtn").mouseover(function(){
        $(this).addClass('widebtnover');
    }).mouseout(function(){
        $(this).removeClass('widebtnover');
    });
    $("input[type=text],input[type=password],textarea").focus(function(){
		$(this).addClass("inputActive");
    }).blur(function(){
		$(this).removeClass("inputActive");
    });
    $("input[type=text],input[type=password],textarea").mouseover(function(){
        $(this).addClass("inputHover");
    }).mouseout(function(){
        $(this).removeClass("inputHover");
    });
	
	$("fieldset div,fieldset div div").mouseover(function(){
		var tmptitle = $(this).attr('webtip');
		if(tmptitle == undefined || tmptitle == ""){
			$("#tiptitle", parent.document.body).text(a_16041);
			$("#tipcontent", parent.document.body).text(a_16042);
		}
		else{
			for (var i = 0; i < parent.tip_item.length; i++) {
				if ( parent.tip_item[i].id == tmptitle ){
					$("#tipcontent", parent.document.body).html(parent.tip_item[i].content);
					if( parent.tip_item[i].tranid != undefined && parent.tip_item[i].tranid != "" )	
						$("#tiptitle", parent.document.body).text(parent.tip_item[i].tranid);
					else{
					    var spantext = $(this).children("div").eq(0).children("span").text();
					    if( spantext != undefined && spantext != "" )
					        $("#tiptitle", parent.document.body).text(spantext);
					    else{
					        if( tmptitle == "Match Incoming Caller ID" || tmptitle == "Distinctive Ring Tone" ){
					            spantext = $(this).children("span").text();
					            $("#tiptitle", parent.document.body).text(spantext);
					        }else{
					            $("#tiptitle", parent.document.body).text(tmptitle);
					        }
						}
				    }
				}
			};
		}
	}).mouseout(function(){
		//$("#tiptitle", parent.document.body).text(a_dfttitle);
        //$("#tipcontent", parent.document.body).text(a_dftcontent);
    });

	$('input[name=filesrc], input[name=downmode]').click(function(){
        cb_downmode_change();
    });

	$("body").keypress(function(e){
        if(e.keyCode == '13') {
			if($("#jqibox").length != 0)
				$("#jqibox").remove();
		    if( $.cookie( "Mainpage") != "apps" || ($.cookie( "Mainpage") == "apps" && ($.cookie("Subpage") == "ldap" || $.cookie("Subpage") == "emergency"))){
                $("#a_save").click();
			    return false;
			}else{
			    var focusel = document.activeElement;
			    if( focusel.type != "textarea" )
			        return false;
			}
        }
    });

	$("#a_cancel").click(function(){
		var frmsrc = $("#iframediv",parent.document.body).attr('src');
		$("#iframediv",parent.document.body).attr('src', frmsrc);
	});

    //move fieldset into div to solve in some browser the fieldset can not show scroll
    /*$("<div class='formDiv'></div>").appendTo($("#Formvalidate"));
    $("#Formvalidate fieldset").appendTo($(".formDiv"));*/

    //set maindiv and body hight
    var height = $("#Formvalidate").outerHeight()-70;
    //$(".formDiv").css("height",height);
    if($.cookie("Mainpage") == "apps" && ($.cookie("Subpage") != "ldap" && $.cookie("Subpage") != "emergency"))
    {
        var bodyheight = $("#mainbody").outerHeight()-2;
        $("#leftdiv,#rightdiv").css("height",bodyheight);
    }
    else if( $.cookie("Mainpage") != "call" )
    {   
        var bodyheight = $("#iframediv",parent.document.body).outerHeight()-2;
        $("#framebody").css("height",bodyheight);
    }
});
function ReqItem(id, pvalue, value) {
	this.id = id;
	this.pvalue = pvalue;
	this.value = value;
	if ( typeof ReqItem._initialized == 'undefined') {
	ReqItem.prototype.showColor = function () {
		alert( this.pvalue);
	} ;
	ReqItem._initialized = true ;
	}
}
function set_frame_skin( skinName ){
    $("#framecssfile").attr("href","../css/"+ skinName +"_frame.css"); //设置不同皮肤
}
function res_parse_rawtext(data) {
    msgs = new Object();
    msgs.headers = new Array();
    msgs.names = new Array();

    var allheaders = data.split('\r\n');
    var y = 0;
    for (var x = 0; x < allheaders.length; x++) {
        if (allheaders[x].length) {
            var fields = allheaders[x].split('=');
           if (fields[0] != undefined
                && fields[1] != undefined) {
				var valuestr = fields[1];
                var j = 2;
                while (j < fields.length) {
                    valuestr += "=" + fields[j];
                    j++;
                }
				try
				{
					msgs.headers[fields[0].toLowerCase()] = decodeURIComponent(valuestr);
				}
				catch (e)
				{
					msgs.headers[fields[0].toLowerCase()] = valuestr;
				}
                msgs.names[y++] = fields[0].toLowerCase();
            }
        }
    }

    return msgs;
}
function cb_networkerror(xmlHttpRequest, errorThrown){
	if(errorThrown)
		view_message(errorThrown, MSG_ALERT);
	else
        view_message(a_16418, MSG_ALERT);
}
function cb_if_auth_fail(msgs){
    if (msgs.headers['response'] != undefined && msgs.headers['response'].toLowerCase() == "error" && 
        msgs.headers['message'] != undefined && msgs.headers['message'].toLowerCase() == "authentication required") {
        window.parent.location.href = '/login.html';
	throw "exit";
    }
}
function cb_if_is_fail(msgs){
    if (msgs.headers['response'] != undefined && msgs.headers['response'].toLowerCase() == "error") {
        //window.parent.location.href = '/login.html';
        return true;
    }else {
        return false;
    }
}
function cb_is_fail(msgs){
    if (msgs.headers['response'].toLowerCase() == "error") {
        return true;
    }else {
        return false;
    }
}
function appendApplyFunction(funcname)
{
    applyFunctions.push(funcname);
}
function applyDbusFunction()
{
	var applyfun = $.cookie("applyfunc");
	if (applyfun != undefined && applyfun != "") {
		fun_arr = applyfun.split(";");
		for (var i = 0; i < fun_arr.length; i++)
			applyFunctions.push(fun_arr[i]);
	}
	
    for(var i = 0; i < applyFunctions.length; i ++)
    {
        eval(applyFunctions[i]);
    } 
    applyFunctions.splice(0, applyFunctions.length);
	$.cookie("applyfunc", "", {path: '/', expires:10});
}
function clear_viewmessage(){
    $(".statustip").remove();
    $(".statustip").css('bgColor', "white");
}
function view_message(text, type, time){
    var status_color;
    if (type == MSG_ALERT) {
        status_color="#DE8D8D" ;
    } else if (type == MSG_APPLY) {
        status_color="red" ;
    } else if (type == MSG_OK) {
        status_color="#068F29" ;
    } else if (type == MSG_FAIL) {
        status_color="red" ;
    } else if (type == MSG_NORMAL) {
        status_color = "white";
    } else {
        status_color = "white";
    }
	$(".statustip").remove();
	var $statustip;
	if (type == MSG_APPLY)
	{
	    $statustip = $("<span style='Color:" + status_color + "' class='statustip'>" + text + "</span><button id='applyPvalue' onClick='applyNow()' class='widebtn, statustip'>" + a_apply + "</button>");
	}else
	{
	    $statustip = $("<span style='Color:" + status_color + "' class='statustip'>" + text + "</span>");
	}
	$statustip.appendTo($("#statusdiv"));
	$("#Formvalidate").scrollTop("0");
	//window.parent.location.href='/index.html#tips';
	
	if (type == MSG_APPLY)
	    return;
    if (time == undefined || time == '' || time == 0) {
        time = 10000;
    }

    if (time == PERMANENCE) {
        return;
    }
    setTimeout(clear_viewmessage,5000);
}

function applyNow()
{
    var urihead = "action=applypvalue";
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data, textStatus) {
			cb_put_suc(data);
        },
        error:function(xmlHttpRequest, errorThrown) {
			cb_networkerror(xmlHttpRequest, errorThrown);
		}
    });
}

function hideApply()
{
    var height = window.parent.document.body.scrollHeight-77;
	window.parent.$("#applydiv").hide();
    //window.parent.$("#pageslide-body-wrap, #topbg").css( "top", "0");
}

function animateApply(elem, range){
    var curMax = range = range || 6;
    var startFunc = function(){};
    var endFunc = function(){};
    var drct = 0;
    var step = 1;

    elem.css("position",'relative');

    (function jump()
    {
        var t = parseInt(elem.css("top"));
        if (!drct) {
            startFunc.apply(this);
            elem.css("top",'0');
            drct = 1;
        }
        else {
            var nextTop = t - step * drct;
            if (nextTop >= -curMax && nextTop <= 0) elem.css("top", nextTop + 'px');
            else if(nextTop < -curMax) drct = -1;
           else {
                var nextMax = curMax / 2;
                if (nextMax < 1) {
                    endFunc.apply(this);
                    curMax = range;
                    drct = 0;
                    elem.css("top",'0');
                    return;
                }
                curMax = nextMax;
                drct = 1;
            }
        }
        setTimeout(function(){jump();}, 200 / (curMax+3) + drct * 3);
    })();

}

function cb_isNeedApply( data )
{
    var msgs = res_parse_rawtext(data);
    cb_if_auth_fail(msgs);
	var needApply = msgs.headers['needapply'];
    if( needApply == 1 ) {
        window.parent.$("#applydiv").show();
        window.parent.$("#apply").show();
        animateApply(window.parent.$("#apply"),6);
    }else{
        hideApply();
    }
}

function checkIsApplyNeed()
{
    var urihead = "action=needapply";
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            cb_isNeedApply(data);
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}

function cb_put_suc(data, mode)
{
    var msgs = res_parse_rawtext(data);
	cb_if_auth_fail(msgs);
	if( cb_if_is_fail(msgs) )
	    view_message(a_16419, MSG_FAIL);
    else 
        view_message(a_7479, MSG_OK);
    checkIsApplyNeed();
    /*if (mode == "cfupdated") {
         dbussend_cfupdated();
    }*/
}

function dbussend_cfupdated(){
    var urihead = "action=cfupdated";
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data, textStatus) {
			cb_put_suc(data);
        },
        error:function(xmlHttpRequest, errorThrown) {
			cb_networkerror(xmlHttpRequest, errorThrown);
		}
    });
}
function cb_ping(){
    var urihead = "action=ping" + "";
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            pingesuccess(data);
        },
        error:function(xmlHttpRequest, errorThrown) {
            alert("NetWork ERROR!");
        }
    });
}
function pingesuccess(data){
    var msgs = res_parse_rawtext(data);
    if (msgs.headers['response'].toLowerCase() == "error" &&
        msgs.headers['message'].toLowerCase() == "authentication required") {
        window.parent.location.href='/login.html';
	throw "exit";
    } else {
    }
}
function build_get(count, vari){
    var s = "";
    var cnt = "" + count;
    while (cnt.length < 4) {
        cnt = "0" + cnt;
    }

    s += "&var-" + cnt + "=" + encodeURIComponent(vari);
    return s;
}
function cb_get(items){
	var uritail = "";
    for (var i = 0; i < items.length; i++) {
        uritail += build_get(i, items[i].pvalue);
    }
	var urihead = "action=get" + uritail;
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            cb_get_items_suc(data, items);
        },
        error:function(xmlHttpRequest, errorThrown) {
            view_message("Get Error", MSG_ALERT);
        }
    });
}

function cb_get_items_suc(data, items){
    var msgs = res_parse_rawtext(data);
    cb_if_auth_fail(msgs);
    view_page_write(msgs, items);
    checkIsApplyNeed();
}

function view_page_write(msgs, items){
    var temp;
	var typeattr;
	for (var i = 0; i < items.length; i++) {
		var tempid = '#' + items[i].id;
        var temp = $(tempid);
        if (temp == null || temp == undefined || temp.length == 0 || temp.attr('type') == "radio") {
			var tempname = 'input[name=' + items[i].id + ']';
			temp = $(tempname);
        }
        typeattr = temp.attr('type');
        if( typeattr == undefined ){
            if( temp.is("select") ){
                if( temp.attr("multiple") == "multiple" )
                    typeattr = "select-multiple";
                else
                    typeattr = "select-one";
            }else if( temp.is("textarea") ){
                typeattr = "textarea";
            }
        }
        if (typeattr == 'checkbox') {
            if (msgs.headers[items[i].pvalue.toLowerCase()] == "1" ) {
                temp.attr('checked', true);
            } else {
                temp.attr('checked', false);
            }
        } else if (typeattr == 'text') {
			var tempval = msgs.headers[items[i].pvalue.toLowerCase()];
            temp.val( tempval );
            if ((temp.attr["typename"] != undefined) && (temp.attr["typename"].val() == "sldValue")){
                for (var j = 0; j < bar_items.length; j++) {
                    if (bar_items[j].id == temp.attr('id')) {
                        bar_items[j].bar_class.SetValue(temp.val());
                    }
                }
            }
        } else if (typeattr == 'select-one') {
			var tempsel = tempid + ' option';
			var tempsel = $(tempsel);
            for (var q = 0; q < tempsel.length; q++) {
                if (tempsel.eq(q).val() ==
                    msgs.headers[items[i].pvalue.toLowerCase()]) {
                    //tempsel.eq(q).attr('selected', true);
					temp.getSetSSValue(tempsel.eq(q).val());
                    break;
                }
            }
        } else if (typeattr == 'select-multiple') {

        } else if (typeattr == 'password') {
            temp.val( msgs.headers[items[i].pvalue.toLowerCase()] );
        } else if (temp.length != undefined && temp.length > 1 && temp[0].type == "radio") {
			temp.each(function(){
				if($(this).val() == msgs.headers[items[i].pvalue.toLowerCase()])
					$(this).attr('checked',true);
				});
            /*for (var j = 0; j < temp.length; j++){
                if (temp[j].val() == msgs.headers[items[i].pvalue.toLowerCase()]) {
                    temp[j].attr('checked', true);
                }
            }*/
        } else if (typeattr == 'textarea') {
        } else {
            temp.text( msgs.headers[items[i].pvalue.toLowerCase()] );
        }
    }
	get_item_suc_callback(msgs);
}

function cb_set_property(type, value)
{
    var urihead = "action=setprop&type=" + type + "&value=" + encodeURIComponent(value);
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            //cb_get_setting_suc(data, setname);
        },
        error:function(xmlHttpRequest, errorThrown) {
            view_message("Get Error", MSG_ALERT);
        }
    });
}
function cb_get_action(action){
	var urihead = "action=" + action;
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            cb_get_action_done(data, action);
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}
function cb_get_action_sync(action){
    var urihead = "action=" + action;
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        async:false,
        dataType:'text',
        success:function(data) {
            cb_get_action_done(data, action);
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}
function cb_put(items, mode, flag){
    var uritail = "";
    var typeattr;
    for (var i = 0, k = 0; i < items.length; i++, k++) {
		var tempid = '#' + items[i].id;
        var temp = $(tempid);
        if (temp == null || temp == undefined || temp.length == 0 || temp.attr('type') == "radio") {
			var tempname = 'input[name=' + items[i].id + ']';
			temp = $(tempname);
        }
        var val;
        typeattr = temp.attr('type');
        if( typeattr == undefined ){
            if( temp.is("select") ){
                if( temp.attr("multiple") == "multiple" )
                    typeattr = "select-multiple";
                else
                    typeattr = "select-one";
            }else if( temp.is("textarea") ){
                typeattr = "textarea";
            }
        }
        if (typeattr == 'checkbox') {
            if (temp.prop("checked") == true) {
                val = "1";
            } else {
                val = "0";
            }
        } else if (typeattr == 'text') {
            val = temp.val();
        } else if (typeattr == 'textarea') {
            if (temp.val().length > 0)
            {
                val = temp.val();
            }
            else 
            {
                k--;
                continue;
            }
        } else if (typeattr == 'select-one') {
            val = temp.val();
        } else if (typeattr == 'select-multiple') {
        } else if (typeattr == 'password') {
            val = temp.val();
        } else if (typeattr == "radio" || (temp.length != undefined && temp.length > 1 && temp[0].attr('type') == "radio")) {
			temp.each(function(){
				if($(this).prop("checked") == true)
					val = $(this).val();
			});
			
        } else {
            console.log(items[i].id + ' is ' + temp.attr('type'));
            console.log("Unknown Type, Please refer to developer.");
        }
        uritail +=
            build_put(k, items[i].pvalue, val);
    }

    //this flag is for phone reboot system, only add in FP3, FP2 doesn't has this flag param
    var urihead;
    if( flag != undefined )
    {
        urihead = "action=put&flag=" + flag + uritail;    
    }else
    {
        urihead = "action=put&flag=1" + uritail;    
    }
    //var urihead = "action=put&flag=1" + uritail;    
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            cb_put_suc(data, mode);
        },
        error:function(xmlHttpRequest, errorThrown) {
            view_message("Put Error", MSG_ALERT);
        }
    });
}
function build_put(count, vari, vali){
    var s = "";
    var cnt = "" + count;
    while (cnt.length < 4) {
        cnt = "0" + cnt;
    }

    s += "&var-" + cnt + "=" + encodeURIComponent(vari);
    s += "&val-" + cnt + "=" + encodeURIComponent(vali);
    return s;
}

/************************Functions for account pages**************************************************************/
function dbussend_vbupdated( account ){
    var urihead = "action=vbupdated&region=account&account=" + account;
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data, textStatus) {
			//cb_put_suc(data);
        },
        error:function(xmlHttpRequest, errorThrown) {
			cb_networkerror(xmlHttpRequest, errorThrown);
		}
    });
}
function cb_set_displayname(displayName, activate, actindex){
    if( displayName == "" )
        displayName = "SIP";
    if( $("#account1_general", parent.document.body).hasClass("active") ){
        $("#m_account_id", parent.document.body).text(displayName);
    }else{
        $("#account_1_name", parent.document.body).text(displayName);
    }
    window.parent.update_accountname(displayName, activate, actindex);
}
function cb_set_autoanswer( i ) {
    var auto_answer = 0;
    if (($('#autoanswer').val() == 1) || ($('#autoanswer').val() == 2)) {
        auto_answer = 1;
    }
	var urihead = "action=autoanswer&region=account&acct=" + i + "&value=" + auto_answer;
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            //cb_put_suc(data);
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}
function cb_set_callforward( i, type ) {
    /*var call_forward = 0;

    if (($('#uccf').val().length > 0) || ($('#bcf').val().length > 0) || ($('#nacf').val().length > 0)) {
        call_forward = 1;
    }*/
	var urihead = "action=callforward&region=account&acct=" + i + "&type=" + type;
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            //cb_put_suc(data);
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}

function cb_check_forward_time(val)
{
    if( val == "" )
        return 1;
    var reg = new RegExp("^[0-9:]+$");
    if(!reg.test(val)){
        return 0;
    }
    var valid = 0;
    var datetime = val.split(':');
    if( datetime.length == 2 )
    {
        if( !isNaN(datetime[0]) && !isNaN(datetime[1]) && parseInt(datetime[0]) >= 0 && parseInt(datetime[0]) <=23
            && parseInt(datetime[1]) >= 0 && parseInt(datetime[1]) <=59 )
            valid = 1;
    }else
    {
        valid = 0;
    }
    return valid;
}

/************************Functions for download pages**************************************************************/
function cb_get_down_response(){
	cb_get_response(1);
}
function cb_get_upload_response(){
	cb_get_response(2);
}
function cb_get_export_response(){
    cb_get_response(3);
}
function cb_alert_response(t,flag){
    if(flag == 1 && t!= 1){window.parent.unblock_func();}
	if(flag == 2 && t!= 1){$("#a_browse").text(a_done).removeClass('widebtn');}
    switch(t) {
		case '1':
			if(downnum < 20 || curdownaction == "putdownphbk"){
				if(flag == 2){
					setTimeout("cb_get_upload_response()",3000);
				}else if(flag == 3){
					setTimeout("cb_get_export_response()",3000);
				}else{
				    setTimeout("cb_get_down_response()",3000);
				}
				downnum ++;
			}else{
				if(flag == 2){$("#a_browse").text(a_done).removeClass('widebtn');}
				if(flag == 3){$.prompt(a_6171);}
				else{$.prompt(a_56);window.parent.unblock_func();}
			}
			break;
		case '0':
		    if(flag == 3)
		        cb_get_fav_url();
		    else{
		        reget_contact();
			    $.prompt(a_55);
			}
			break;
		case '2':
			$.prompt(a_16420);
			break;
		case '3':
			$.prompt(a_4772);
			break;
		/*case '3':
			$.prompt(a_downparsefail);
			break;*/
		case '4':
			$.prompt(a_56);
			break;	
		case '5':
			$.prompt(a_16421);
			break;
		case '6':
			$.prompt(a_16422);
			break;
		case '8':
			$.prompt(a_16423);
			break;
		default:
		    $.prompt(a_3315);
			break;
	}  
	if( t != 1 )
	    downnum = 0;
}

/*****************************Function for apply settings**********************************************/
function cb_set_remotevideo(videostate)
{
    window.parent.update_remote_video(videostate);
}

function cb_set_disableconf(disconf,autovideo,distranfer,disipcall,tranfermode,disquickipcall,disdialplan)
{
    window.parent.update_disable_conf(disconf,autovideo,distranfer,disipcall,tranfermode,disquickipcall,disdialplan);
}

function cb_set_incalldtmf(incalldtmf)
{
    window.parent.update_disable_incalldtmf(incalldtmf);
}

function cb_set_disablepresent(disablepresent,enablefecc)
{
    window.parent.update_disable_present(disablepresent,enablefecc);
}

function cb_set_prefix(prefix)
{
    window.parent.update_prefix(prefix);
}

function translate_download(){
	$("#a_downset").text(a_16480);
	$("#a_savefav").text(a_16481);
    $("#a_filesrc").text(a_16482);
    $("#a_srcinternet").text(a_16483);
	$("#a_srclocal").text(a_16484);
	$("#a_clearoldlist").text(a_16485);
	$("#a_downdup").text(a_4754);
	$("#a_clearoldyes, #a_downdupyes").text(a_5);
	$("#a_downmode").text(a_4765);
	$("#a_downoff").text(a_8);
	$("#a_downserver").text(a_4766);
	$("#a_downnow").text(a_4768);
	$("#a_download").text(a_28);
	$("#a_localfile").text(a_16484);
	$("#a_browse").text(a_16486);
	$("#a_save, #savefavnow").text(a_17);
	$("#a_cancel").text(a_3);
}
function translate_downloads()
{
    $("#a_imexport").text(a_16487);
    $("#a_exporttype, #a_downloadtype").text(a_4756);
    $("#a_downset, #a_download").text(a_28);
    $("#a_savefav").text(a_16481);
    $("#a_portclearoldlist, #a_clearoldlist").text(a_16485);
	$("#a_portdowndup, #a_downdup").text(a_4754);
	$("#a_portclearoldyes, #a_portdowndupyes, #a_clearoldyes, #a_downdupyes").text(a_5);
	$("#a_downmode").text(a_4765);
	$("#a_downoff").text(a_8);
	$("#a_downserver").text(a_4766);
	$("#a_downnow").text(a_4768);
	$("#a_localfile").text(a_16484);
	$("#a_browse").text(a_16486);
	$("#a_save, #savefavnow").text(a_17);
	$("#a_cancel").text(a_3);
}
function cb_downmode_change(){
	if( $("#downmode").val() == 0 ){
        $('#downnow').attr('disabled',true);
	}else{
	    $('#downnow').attr('disabled',false);
	}
}
function cb_get_download_params(action){
    var urihead = "action=" + action;
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            cb_get_download_params_done(data);
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}
function cb_get_download_params_done(data){
    var msgs = res_parse_rawtext(data);
    cb_if_auth_fail(msgs);
    cb_if_is_fail(msgs);
    view_downloads_write(msgs); 
}
function view_downloads_write(msgs){ 
	if (msgs.headers["port-replace"] == "1")
        $('#portdowndup').attr('checked',true);
    else
        $('#portdowndup').attr('checked',false);

	if (msgs.headers["port-clear"] == "1")
        $('#portclearold').attr('checked',true);
    else
        $('#portclearold').attr('checked',false);
        
    /*var downmode = msgs.headers["down-mode"];
    if(downmode == 1) { $('#downtftp').attr('checked',true); }
    else if(downmode == 2) { $('#downhttp').attr('checked',true); }
    else { $('#downoff').attr('checked',true); }
    cb_downmode_change();
    
	if(msgs.headers['down-url'] != undefined)
		$("#downserver").val(msgs.headers['down-url']);

	if (msgs.headers["down-replace"] == "1")
        $('#downdup').attr('checked',true);
    else
        $('#downdup').attr('checked',false);

	if (msgs.headers["down-clear"] == "1")
        $('#clearold').attr('checked',true);
    else
        $('#clearold').attr('checked',false);*/
        
    view_private_write(msgs);
}
function cb_get_download_response(action,flag){
    var urihead = "action=" + action + "&flag=" + flag;
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            cb_get_response_done(data,flag);
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}
function cb_put_port_param(action, flag, data){
    var portredup = 0; var portclearold = 0;
    if($('#portdowndup').prop("checked") == true) { portredup = 1; }
    if($('#portclearold').prop("checked") == true) { portclearold = 1; }
    
    var urihead = "action=" + action + "&flag=" + flag + "&portReplace=" + portredup + "&portClear=" + portclearold;
    urihead += data;
    urihead += "&time=" + new Date().getTime();
    
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            if(flag ==0)
                cb_put_suc(data);
            else if(flag == 1)
                setTimeout("cb_get_upload_response()",3000);   //cb_get_response(2);
			else if(flag == 3){
			    setTimeout("cb_get_export_response()",3000);   //cb_get_response(3);
            }
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}
function cb_put_download_param(action, flag, data){
    if(flag == 1)
        window.parent.block_download_func();
    var downmode = $("#downmode").val(); 
    
    var redup = 0; var clearold = 0;
    if($('#downdup').prop("checked") == true) { redup = 1; }
    if($('#clearold').prop("checked") == true) { clearold = 1; }

    curdownaction = action;
    var urihead = "action=" + action + "&downMode=" + downmode + "&flag=" + flag + "&downUrl=" + encodeURIComponent($("#downserver").val()) + "&downReplace=" + redup + "&downClear=" + clearold;
    
    urihead += data;
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            if(flag ==0)
                cb_put_suc(data);
            else if(flag == 1)
                cb_get_response(1);
			else{
            }
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}

function cb_save_fav(action){
	var urihead = "action=" + action;
	//urihead += data;
	urihead += "&time=" + new Date().getTime();
	$.ajax ({
		type: 'get',
		url:'/manager',
		data:urihead,
		dataType:'text',
		success:function(data) {
			cb_get_fav_url();
		},
		error:function(xmlHttpRequest, errorThrown) {
			cb_networkerror(xmlHttpRequest, errorThrown);
		}
	});
}
function cb_originate_call(action,dialnum, dialacct){
    var disipcall = window.parent.$("#disipcall").val();
    if( mIPtest.test( dialnum.split(':')[0] ) && disipcall == 1 ) 
    {
        $.prompt(a_10084);
        return false;
    }        
    var flag = false;
    flag = window.parent.confFrame.isAllInConf(dialnum);
    if(flag)
    {
        window.top.isopenincall(true);
        setTimeout(function(){
            window.parent.confFrame.delayshowtip(a_12223);
        },500);
        return false;
    }
    var urihead = "action=" + action;
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            if( data.substring(0, 1) == "{" )
            {
                var tObj = eval("(" + data + ")");
                if( tObj.res == "error" ){
                    if( tObj.msg != undefined && tObj.msg == "authentication required" ){
                        window.parent.location.href = '/login.html';
                    }else{
                        if( tObj.msg == "0" )
                            $.prompt(a_534);
                        else
                            $.prompt(a_533);
                    }
                }
                else
                {
                    var callmessage = {};
                    var line = 0;
                    callmessage.type = "callout";
                    for(;line < 8;line++)
                    {
                        if(window.parent.confFrame.mLineState[line] == 0)
                        {
                            callmessage.line = line;
                            break;
                        }
                    }
                    callmessage.type = "call";
                    callmessage.state = "3";
                    callmessage.msg = "1";
                    callmessage.sqlname = "0";
                    
                    if(action.indexOf("originatecall") != -1)
                    {
                        var prefixval = $("#prefix",window.parent.document).val();
                        var disdialplan = $("#disdialplan",window.parent.document).val();
                        if(disdialplan == "1")
                        {
                            prefixval = "";
                        }
                        callmessage.acct = dialacct;
                        callmessage.num = prefixval + dialnum;
                        callmessage.name = prefixval + dialnum;
                        window.parent.handlemessage(callmessage);
                    }
                    /*else if(action.indexOf("addconfmemeber") != -1)
                    {
                        dialnum = dialnum.split(":::");
                        dialacct = dialacct.split(":::");
                        var i = 0;
                        for(;i<dialnum.length; i++)
                        {
                            callmessage.acct = dialacct[i];
                            callmessage.num = dialnum[i];
                            callmessage.name = dialnum[i];
                            window.parent.handlemessage(callmessage);
                        }
                    }*/
                }
            }
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });    
}
function cb_start_single_call(dialnum, dialacct, ispaging, isdialplan, isipcall, isvideo){
    if( dialnum == "" ){
        return false;
    }
    /*var enableacct = $("#enableacct",window.parent.document).val();
    if( enableacct == "0" ){
        $.prompt(a_18564);
        return false;
    }*/
	
	var isrmtctrlupgrade = false;
	var urihead = "action=get&var-0000=:remote_update&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
		async:false,
        success:function(data) {
			var msgs = res_parse_rawtext(data);
		    cb_if_auth_fail(msgs);
		    if (cb_is_fail(msgs)){}   
		    else {
				if(msgs.headers[':remote_update'] == "1")
					isrmtctrlupgrade = true;
			}
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
	
	if(isrmtctrlupgrade){
		$.prompt(a_19236);
		return false;
	}
	
	if(typeof(mAcctStatus) != "undefined"){
		var acctname = ['SIP', 'IPVT', 'BlueJeans', "", "", "", 'H.323'];
		var tempacct = dialacct;
		if(dialacct == 8)
			tempacct = 6;
		
		var unactive = 0;
		for(var i = 0; i < mAcctStatus.length; i++){
			if(mAcctStatus[i].activate == 0)
				unactive ++;
		}
		if(unactive == mAcctStatus.length){
			$.prompt(a_19374);
			return false;
		}
		
		if(!checkIpv4Address(dialnum) && !checkDialIPv6(dialnum)){
			if(mAcctStatus[tempacct].activate == 1 && mAcctStatus[tempacct].status == 0){
				if(tempacct < acctname.length)
					$.prompt(acctname[tempacct] + a_19375);
				else
					$.prompt(a_19375);
				return false;
			}
		}
	}
	
    if( dialnum == "anonymous" ){
        $.prompt(a_10083);
        return false;
    }
    if(isipcall == undefined)
    {
        isipcall = 0;
    }
    var disableIPVT = parseInt($("#disableipvt",window.parent.document).val());
    if( disableIPVT == 1 && dialacct == 1 ){
        $.prompt(a_15051);
        return false;
    }
    dialnum = dialnum.split(":::")[0];
    if(isipcall == 1)
    {
        if (checkDialIPv6(dialnum)) {   //IPv6
            var port = 0;
            if (dialnum.indexOf("#") != -1) {
                port = parseInt(dialnum.split("#")[1], 10);
            } else if (dialnum.indexOf(".") != -1) {
                port = parseInt(dialnum.split(":")[1], 10);
            } else if (dialnum.indexOf("]:") != -1) {
                port = parseInt(dialnum.split("]:")[1], 10);
            }

            if (port < 0 || port > 65535) {
                $.prompt(a_4246);
                return false;
            }
        } else {
            var ipnumber = dialnum.split(":");
            if (!mIPtest.test(ipnumber[0])) {
                $.prompt(a_4246);
                return false;
            }
            if (ipnumber[1] != undefined) {
                //port
                if (!mRegnumber.test(ipnumber[1]) || parseInt(ipnumber[1], 10) < 0 || parseInt(ipnumber[1], 10) > 65535) {
                    $.prompt(a_4246);
                    return false;
                }
            }
        }
    }else{
        var ipnumber = dialnum.split(":");
        if( $("#disipcall",window.parent.document).val() != '1' && (mIPtest.test(ipnumber[0]) || checkDialIPv6(dialnum)))
            isipcall = 1;
    }
    var flag = true;
    var confstate = $("#disconfstate",window.parent.document).val();
    if(confstate == "0")
    {
        if($("#pause",window.parent.confFrame.document).attr("ishold") == "0")
        {
            $.prompt(a_10080);
            return false;
        }
        var busylinenum = parseInt($("#busylinenum",window.parent.document).val());
        var maxlinenum = parseInt($("#maxlinenum",window.parent.document).val());
        if(busylinenum >= maxlinenum)
            flag = false;
    }
    if(!flag)
    {
        $.prompt(a_16683);
        return false;
    }
    if(isvideo == undefined)
    {
        isvideo = "1";
        if(window.parent.mAutovideo == "0")
            isvideo = "0";
    }
    
	if(isdialplan == undefined || isdialplan === "")
		isdialplan = 1;
    if( dialacct == '2' || dialacct == '8' )
        isdialplan = 0;
    
    window.parent.confFrame.judge_failedLine(dialnum);
    setTimeout(function(){
        cb_originate_call("originatecall&region=webservice&destnum=" + encodeURIComponent(dialnum) + "&account=" + dialacct + "&isvideo=" + isvideo + "&ispaging=" + ispaging +  "&isipcall=" + isipcall +  "&isdialplan=" + isdialplan + "&headerstring=&format=json",dialnum, dialacct);
    },100);
}

function cb_start_addmemberconf(numbers, accounts, callmode, confid, isdialplan, confname, isvideo, isquickstart, pingcode){
    var flag = true;
    var confstate = $("#disconfstate",window.parent.document).val();
    if(confstate == "0")
    {
        if($("#pause",window.parent.confFrame.document).attr("ishold") == "0")
        {
            $.prompt(a_10080);
            return false;
        }
        var busylinenum = parseInt($("#busylinenum",window.parent.document).val());
        var maxlinenum = parseInt($("#maxlinenum",window.parent.document).val());
        if(busylinenum >= maxlinenum)
            flag = false;
		
		if($(".remoteline").attr("account") == 1 && maxlinenum == 1)
			flag = true;
    }
    if(!flag)
    {
        $.prompt(a_16683);
        return false;
    }
	
	var isrmtctrlupgrade = false;
	var urihead = "action=get&var-0000=:remote_update&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
		async:false,
        success:function(data) {
			var msgs = res_parse_rawtext(data);
		    cb_if_auth_fail(msgs);
		    if (cb_is_fail(msgs)){}   
		    else {
				if(msgs.headers[':remote_update'] == "1")
					isrmtctrlupgrade = true;
			}
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
	
	if(isrmtctrlupgrade){
		$.prompt(a_19236);
		return false;
	}

	if(typeof(mAcctStatus) != "undefined"){
		var acctname = ['SIP', 'IPVT', 'BlueJeans', "", "", "", 'H.323'];
		var tempacct = accounts.split(":::");
		
		for(var i = 0, length = tempacct.length; i < length; i++){
			if(tempacct[i] == 8)
				tempacct[i] = 6;
		}
		
		var unactive = 0;
		for(var i = 0; i < mAcctStatus.length; i++){
			if(mAcctStatus[i].activate == 0)
				unactive ++;
		}
		if(unactive == mAcctStatus.length){
			$.prompt(a_19374);
			return false;
		}
		
		var tempnumbers = numbers.split(":::");
		for(var i = 0, length = tempnumbers.length; i < length; i++){
			if(!checkIpv4Address(tempnumbers[i]) && !checkDialIPv6(tempnumbers[i])){
				if(mAcctStatus[tempacct[i]].activate == 1 && mAcctStatus[tempacct[i]].status == 0){
					if(tempacct[i] < acctname.length)
						$.prompt(acctname[tempacct] + a_19375);
					else
						$.prompt(a_19375);
					return false;
				}
			}
		}
		
	}

    if( callmode == "ipcall" ){
        var numbersarray = numbers.split(":::");
        var acctarray = accounts.split(":::");
        var invalidnum = 0;
        var newnumber = "";
        var newacct = "";
        for(var i = 0; i < numbersarray.length; i++ ){
            if (checkDialIPv6(numbersarray[i])) {   //IPv6
                var port = 0;
                if (numbersarray[i].indexOf("#") != -1) {
                    port = parseInt(numbersarray[i].split("#")[1], 10);
                } else if (numbersarray[i].indexOf(".") != -1) {
                    port = parseInt(numbersarray[i].split(":")[1], 10);
                } else if (numbersarray[i].indexOf("]:") != -1) {
                    port = parseInt(numbersarray[i].split("]:")[1], 10);
                }

                if (port < 0 || port > 65535) {
                    invalidnum ++;
                    continue;
                }
            } else {
                var ipnumber = numbersarray[i].split(":");
                if(!mIPtest.test(ipnumber[0]))
                {
                    invalidnum ++;
                    continue;
                }
                if(ipnumber[1] != undefined)
                {
                    //port
                    if(!mRegnumber.test(ipnumber[1]) || parseInt(ipnumber[1], 10) < 0 || parseInt(ipnumber[1], 10) > 65535)
                    {
                        invalidnum ++;
                        continue;
                    }
                }
            }
            if( newnumber != "" ) {
                newnumber += ":::";
                newacct += ":::";
            }
            newnumber += numbersarray[i];
            newacct += acctarray[i];
        }
        if( invalidnum == numbersarray.length ){
            $.prompt(a_4246);
            return false;
        }else if( invalidnum > 0 ){
            numbers = newnumber;
            accounts = newacct;
        }
    }    
    if(isvideo == undefined)
    {
        isvideo = "1";
        if(window.parent.mAutovideo == "0")
            isvideo = "0";
    }
	
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
        
    /*var disableIPVT = parseInt($("#disableipvt",window.parent.document).val());
    if( disableIPVT ){
        var dialnum = "", dialacct = "";
        var numbersarray = numbers.split(":::");
        var accountsarray = accounts.split(":::");
        for(var i = 0; i < accountsarray.length; i++){
            if( accountsarray[i] != 1 ){
                if( dialnum != "" ){
                    dialnum += ":::";
                    dialacct += ":::";
                }
                dialnum += numbersarray[i];
                dialacct += accountsarray[i];
            }
        }
        if( dialnum == "" ){
            $.prompt(a_15051);
            return false;
        }
        numbers = dialnum;
        accounts = dialacct;
    }*/
    
    urihead = "addconfmemeber&region=confctrl&numbers=" + encodeURIComponent(numbers) + "&accounts=" + encodeURIComponent(accounts) + "&confid=" + confid + "&callmode=" + callmode + "&isvideo=" + isvideo + "&isquickstart=" + isquickstart + "&pingcode=" + pingcode + "&isdialplan=" + isdialplan + "&confname=" + confname;
    cb_originate_call(urihead,numbers, accounts);
}

function convertTime(date){
    mDateObj.setTime(date);
    var timestr = mDateObj.getFullYear()+"/";
    var month = mDateObj.getMonth()+1;
    if( month < 10 )
        timestr += "0";
    timestr += month;
    timestr += "/";
    var date = mDateObj.getDate();
    if( date < 10 )
        timestr += "0";
    timestr += date;
    timestr += " ";
    var hours = mDateObj.getHours();
    if( hours <= 12 ){
        if( hours < 10 )
            timestr += "0";
        timestr += hours;
    }else{
        if( mUse24Hour == 0 ){
            if( hours < 22 )
                timestr += "0";
            timestr += (hours-12);
        }else{
            timestr += hours;
        }
    }
    timestr += ":";
    var minutes = mDateObj.getMinutes();
    if( minutes < 10 )
        timestr += "0";
    timestr += minutes;
    if( mUse24Hour == 0 ){
        if( hours < 12 )
            timestr += " am";
        else
            timestr += " pm"; 
    }
    
    return timestr;
}

function checkIpv4Address(ip){    
    var strRegex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))?$/;
    var result = ip.match(strRegex);
    if(result != "" && result != undefined)
        return true;
    else
        return false;
}

function checkDialIPv6(ip) {
    var exp = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:)|(\[([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\](:[1-9]([0-9]){0,4}){0,1})|(\[[0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4}\](:[1-9]([0-9]){0,4}){0,1})|(\[([0-9A-Fa-f]{1,4}:){1,7}:\](:[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}(#[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4}(#[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4}(#[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4}(#[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4}(#[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4}(#[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)(#[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)(#[1-9]([0-9]){0,4}){0,1})|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)(#[1-9]([0-9]){0,4}){0,1})|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4}(#[1-9]([0-9]){0,4}){0,1})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4}(#[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}:){1,7}:(#[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}\.){7}[0-9A-Fa-f]{1,4}(:[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}\.){6}\.[0-9A-Fa-f]{1,4}(:[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}\.){5}\.([0-9A-Fa-f]{1,4}\.)?[0-9A-Fa-f]{1,4}(:[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}\.){4}\.([0-9A-Fa-f]{1,4}\.){0,2}[0-9A-Fa-f]{1,4}(:[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}\.){3}\.([0-9A-Fa-f]{1,4}\.){0,3}[0-9A-Fa-f]{1,4}(:[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}\.){2}.([0-9A-Fa-f]{1,4}\.){0,4}[0-9A-Fa-f]{1,4}(:[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}\.){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)(:[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}\.){0,5}\.((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)(:[1-9]([0-9]){0,4}){0,1})|(\.\.([0-9A-Fa-f]{1,4}\.){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)(:[1-9]([0-9]){0,4}){0,1})|([0-9A-Fa-f]{1,4}\.\.([0-9A-Fa-f]{1,4}\.){0,5}[0-9A-Fa-f]{1,4}(:[1-9]([0-9]){0,4}){0,1})|(\.\.([0-9A-Fa-f]{1,4}\.){0,6}[0-9A-Fa-f]{1,4}(:[1-9]([0-9]){0,4}){0,1})|(([0-9A-Fa-f]{1,4}\.){1,7}\.(:[1-9]([0-9]){0,4}){0,1}))$/;
    var flag = ip.match(exp);
    if (flag != undefined && flag != "") {
        return true;
    } else {
        return false;
    }
}

function htmlEncode(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function htmlDecode(str) {
    var div = document.createElement("div");
    div.innerHTML = str;
    return div.innerHTML;
}

/*show out prompt, especially for multiply choises*/
function alertPrompt($appenddiv, alertinfo, btnarray){
    if($("#alertprompt") != undefined)
        $("#alertprompt").remove();
	
	var alert_delete = "<div id='alertprompt'>"+
					   "<div id='backgrdboard'></div>"+
					   "<div id='alertboard'>"+
					   "<div id='alertinfo'>" + alertinfo + "</div>"+
					   "<div id='cancelicon'>X</div>"+
					   "<div id='btngroup'></div></div></div>";

	$appenddiv.append(alert_delete);
					   
	for(var i = 0; i < btnarray.length; i++){
		var btnhtml = "<button class='promptbtn'>" + btnarray[i] + "</button>";
		$("#btngroup").append(btnhtml);
	}
	$("#btngroup").append("<button id='cancelbtn'>" + a_3 + "</button>");

    $("#backgrdboard").css({"width":"100%", "height":"840px", "position":"fixed", "background":"#aaa", "z-index":"999", "opacity":"0.6", "top":"0px", "display":"none"});
    $("#alertboard").css({"left":"50%", "margin-left":"-313px", "position":"absolute", "top":"15%", "width":"600px", "z-index":"1000", "background":"#fff", "border":"1px solid #eee", "font-size":"12px", "padding":"12px", "text-align":"left", "font-weight":"bold", "opacity":"1"});
    $("#alertinfo").css({"float":"left", "width":"550px", "color":"black", "line-height":"20px", "margin":"10px"});
    $("#cancelicon").css({"color":"#bbb", "cursor":"pointer", "position":"absolute", "right":"0px", "top":"3px", "width":"15px"});
    $("#btngroup").css({"float":"left", "width":"600px", "text-align":"right"});
    $("#btngroup button").css({"background":"#2f6073", "border":"1px solid #f4f4f4", "color":"#fff", "margin":"0 10px", "padding":"3px 10px", "font-size":"12px", "font-weight":"bold"});
	$("#backgrdboard").fadeIn(500);
	$('#alertboard').fadeIn(1000);
	
	$("#cancelicon, #cancelbtn").unbind().live("click", function(){
		$("#backgrdboard").fadeOut(500);
	    $("#alertboard").fadeOut(500);
	});
}
