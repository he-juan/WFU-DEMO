$(function(){
    var wholewidth = window.screen.width;
    var pageheight = window.parent.document.body.clientHeight;
    $("#remotectrl").css('top',(pageheight-558)/2).css('left',(wholewidth-222)/2);
    $("#closeremote").css('top',(pageheight-558)/2).css('left',(wholewidth+262)/2);
    var height = pageheight-108;
	var foottop = height + 160;
	$("#mainContentpage").css('height',height);
	$("#callframediv").css('width','100%').css('height',height-35);
	$("#iframediv").css('width','100%').css('height',height-50);
    $("#mainMenu").css('height',height-35);
	$("#incomingcall").css('width',990).css('height',height-50);
	$(".footContent").css('top',foottop).show();
	$(".rebootspan, .selectrebootspan").html("&nbsp;&nbsp;&nbsp;&nbsp;");
	//$("fieldset > div > div").addClass("righttext");
	hideApply();
    
    setInitState();
    pageEventActions();
    $("#tooltipdiv").css("width", 250).hide();
    var needchangepwd = $.cookie("needchange");
    if( needchangepwd == "1" ){
        showChangePassword();
    }
});
function setInitState(){
    var cookie_skin = $.cookie( "MyCssSkin");
    var version = $.cookie("ver");
    if(!version)
        version = new Date().getTime();
    if (cookie_skin) {
		var skinid = "#" + cookie_skin;
		$(skinid).addClass('selstyle').siblings().removeClass('selstyle');
    }
    $("#tooltipdiv").containerize();
    $(".mbc_title").text("");
    
	if(cookie_skin == "black") 
        $("#blffield").css("background","#8F8F8F");
    else 
        $("#blffield").css("background","url('img/blue/bg-blue-frame.png') repeat-y scroll 0 0 transparent");
}

function pageEventActions(){
    $("body").keypress(function(e){
        if(e.keyCode == '13') {
			return false;
        }
    });
	$("#dock").click(function() {
        $("#tiptitle").text(a_16041);
        $("#tipcontent").text(a_16042);
        $("#tooltipdiv").css("width", 250);
	});
	/*$("#pageflip").hover(function() {
        $("#pageflip .msg_block").css("z-index","100");
		$("#pageflip img , .msg_block").stop().animate({width: '320px', height: '319px'}, 500); 
	} , function() {
		$("#pageflip img").stop().animate({width: '50px', height: '52px'}, 220);
		$(".msg_block").stop() .animate({width: '50px', height: '50px'}, 200);
        $("#pageflip .msg_block").css("z-index","98");
	});*/
	$("button").mouseover(function(){
        $(this).addClass('buttonover');
    }).mouseout(function(){
        $(this).removeClass('buttonover');
    });
    $(".main_navi li").mouseover(function(){
        if( $(this).children(".leftsecmenuli2").length > 0 )
            $(this).children(".leftsecmenuli2").children(".leftsecmenuliimg").children(".iconimg").addClass('iconhover');
        else    
            $(this).children(".leftsecmenuliimg").children(".iconimg").addClass('iconhover');

        if( $("#acctmenuul").is(":hidden") ){
            if( $(this).children("#acctsubmenu").length > 0 )
                $("#iconaccount").addClass("iconhover");
            else{
                $("#iconaccount").removeClass("iconhover");
                $(this).children(".leftsecmenuliimg").children(".iconimg").addClass("iconhover");
            }
        }else
            $("#iconaccount").addClass("iconhover");
        $(this).find(".imghidemenuli2").addClass("iconhover");
    }).mouseout(function(){
        if( $(this).children(".leftsecmenuli2").length > 0 )
            $(this).children(".leftsecmenuli2").children(".leftsecmenuliimg").children(".iconimg").removeClass('iconhover');
        else    
            $(this).children(".leftsecmenuliimg").children(".iconimg").removeClass('iconhover');

        $(this).find(".imghidemenuli2").removeClass("iconhover");
        if( $("#acctmenuul").is(":hidden") ){
            $("#iconaccount").removeClass("iconhover");
        }
    });
    $(".KeypadDigit").mouseover(function(){
        $(this).addClass('KeypadDigitHover');
    }).mouseout(function(){
        $(this).removeClass('KeypadDigitHover');
    });
	$("#logoutdiv").click(function(){
		var urihead = "action=logoff";
		urihead += "&time=" + new Date().getTime();
		$.ajax ({
			type: 'get',
			url:'/manager',
			data:urihead,
			dataType:'text',
			success:function(data) {
				cb_logout_done(data);
			},
			error:function(xmlHttpRequest, errorThrown) {
				cb_networkerror(xmlHttpRequest, errorThrown);
			}
		});
	});
    $("#gmidoc").click(function(){
		window.open("../application/GMI_Guide_V2.0.html");
	});
	
	$("#changepwd").click(function(){
		//var frametagsrc = "advanset/security.html?time=" + new Date().getTime();
		//$("#iframediv").attr('src',frametagsrc);
		//$.cookie( "Mainpage" , "advanset"  , { path: '/', expires: 30 });
		//$("#advanset_network").addClass("selected").siblings().removeClass("selected");
		if( $.cookie("Mainpage") != "advanset" )
		    $("#advanset_network").click();
		$(".advanset\\/security\\.html").click();
	});
	
    $("#apply").click(function(){
        var busylinenum = parseInt($("#busylinenum",window.parent.document).val());
	    if (busylinenum > 0 ){
	        $.prompt(a_1516);
	        return false;
	    }
	    $("#applytext").text(a_16424);
	    //$("#apply").attr("disabled",true);
		$("#apply").attr("style","display:none;");
		var urihead = "action=applypvalue";
		if( $.cookie("applycert") == "1" )
		    urihead += "&applycert=1";
		urihead += "&time=" + new Date().getTime();
		$.ajax ({
			type: 'get',
			url:'/manager',
			data:urihead,
			dataType:'text',
			success:function(data) {
				cb_applypvalue_done(data);
			},
			error:function(xmlHttpRequest, errorThrown) {
				cb_networkerror(xmlHttpRequest, errorThrown);
			}
		});
	});
	$('.main_navi li').click(function(){
	    var submenu = 0;
	    var classattr = $(this).attr("class");
	    var framesrc = "";
	    if( classattr.indexOf("account") != -1 )
        {
            if( classattr.indexOf("hassubmenu") != -1 ) {
                submenu = 2;
                //restore previous account id html
                var acctIndex = $("#account_li").attr("acctIndex");
                var disid = "account" + acctIndex + "_general";
                //console.log("previd = "+disid);
                //console.log("prehtml = " + $("#m_account_id").text());
                $("#"+disid).children("span").text( $("#m_account_id").text() );
                
                /******************/
                $(this).removeClass("leftsecmenuli").siblings(".account").addClass("leftsecmenuli");
                $(this).children(".leftsecmenuliimg").hide();
                $(this).siblings().children(".leftsecmenuliimg").show();
                /******************/

                //set new clicked account id html
                var clickid = $(this).attr("id");
                acctIndex = clickid.substring(7,8);
                disid = "account" + acctIndex + "_general";
                if( acctIndex == "1" ){
                    $("#account_1_name").hide();
                    $(".account\\/sip\\.html, .account\\/network\\.html, .account\\/codec\\.html").show();
                }
                else if( acctIndex == "2" ){
                    $("#account_1_name").show();
                    $(".account\\/sip\\.html, .account\\/network\\.html, .account\\/codec\\.html").hide();
                }else{
                    $("#account_1_name").show();
                    $(".account\\/codec\\.html").show();
                    $(".account\\/sip\\.html, .account\\/network\\.html").hide();
                }
                
                $("#account_li").attr("acctIndex", acctIndex);
                //do not set AccountIndex cookie here for only one account active
                $.cookie( "AccountIndex" ,  acctIndex , { path: '/', expires: 30 });
                $('#accountindex').val(acctIndex);
                $("#m_account_id").text($(this).children("span").text());
                $(this).children("span").text("");
                //console.log(disid);
                $("#acctsubmenu").appendTo($("#"+disid));
                $("#acctsubmenu .leftsecmenu").css("display", "block");
                $(".hassubmenu").siblings().removeClass('active');
                var subpage = $("#account_li").attr("subpage");
                if( subpage != "" ){
                    if( acctIndex != "1" ){
                        if( subpage == "network" || subpage == "sip" )
                            subpage = "general";
                        else if( subpage == "codec" && acctIndex == "2" )
                            subpage = "general";                    
                    }
                    framesrc = "account/" + subpage + ".html";
                    $(".account\\/" + subpage + "\\.html").addClass('active').siblings().removeClass('active');
                    $("#subtitle").text( $(".account\\/" + subpage + "\\.html").find("span").text() );
                }else{
                    framesrc = "account/general.html";
                    $(".account\\/general\\.html").addClass('active').siblings().removeClass('active');
                    $("#account_li").attr("subpage", "general");
                    $("#subtitle").text( $(".account\\/general\\.html").find("span").text() );
                }
                //click menuli, change the arrow
                $(this).siblings().find(".imghidemenuli2").removeClass("active").show();
                $(this).find(".imghidemenuli2").removeClass("active").hide();
                $(this).children("#acctsubmenu").find(".imghidemenuli2").addClass("active").show();
                $(".iconimg").removeClass("iconactive");
                $(this).find(".iconimg").addClass('iconactive');
            }else{
                submenu = 1;
                $(".iconimg").removeClass("iconactive");
                $(this).find(".iconimg").addClass('iconactive');
                //$("#acctsubmenu").parent(".hassubmenu").addClass("active");
            }
        }
        else if( $(this).attr("class").indexOf("hassubmenu") != -1 )
	    {
            if( $(this).children(".leftsecmenu").css("display") == "none" )
            {
                $(this).siblings().removeClass("active");
                $(this).siblings().children(".leftsecmenu").css("display", "none");   //hide other submenu first
                //$(this).siblings().children(".acctmenu").children(".thirdmenuicn").removeClass("minus").addClass("plus");
                $(this).addClass('active');
	           // $("#account1_general").children(".acctmenu").removeClass("leftsecmenuli2").addClass("leftsecmenuli");
	            //$(this).children(".acctmenu").children(".thirdmenuicn").removeClass("plus").addClass("minus");
	            $(this).children(".leftsecmenu").css("display", "block");
	            $(this).children(".leftsecmenu").children("li:eq(0)").click();
                //click menuli, change the arrow
                $(".imghidemenuli2").removeClass("active");
                $(this).find(".imghidemenuli2").addClass("active");
                $(".iconimg").removeClass("iconactive");
                $(this).find(".iconimg").addClass('iconactive');
            }
	        return false;
	    }else if( $(this).parent("ul").attr("class") == "leftsecmenu" )
	    {
	        $(this).parent("ul").parent("li.hassubmenu").addClass('active');
	        submenu = 1;
	        $(this).children(".acctmenu").removeClass("leftsecmenuli2").addClass("leftsecmenuli");
	        $(this).children(".acctmenu").children(".thirdmenuicn").removeClass("plus").addClass("minus");
		    $(this).parent(".leftsecmenu").css("display", "block");
		    $(this).parent().parent().siblings().children(".leftsecmenu").css("display", "none");
            //click menuli, change the arrow
            $(".imghidemenuli2").removeClass("active");
            $(this).parent("ul").parent("li.hassubmenu").find(".imghidemenuli2").addClass("active");
            $(".iconimg").removeClass("iconactive");
            $(this).parent("ul").parent("li.hassubmenu").find(".iconimg").addClass('iconactive');
	    }else
	    {
	        $(this).children(".acctmenu").removeClass("leftsecmenuli").addClass("leftsecmenuli2");
	        $(this).children(".acctmenu").children(".thirdmenuicn").removeClass("minus").addClass("plus");
	        $(".leftsecmenu").css("display", "none");
            $(".iconimg").removeClass("iconactive");
            $(this).find(".iconimg").addClass('iconactive');
            $(".imghidemenuli2").removeClass("active");
	    }
	    //if($.browser.msie){}
        //else
		//	$("#iframediv").css('width','0px').css('height','0px');
		$(this).addClass('active').siblings().removeClass('active');
		if( framesrc == "" ) {
		    var liclass = $(this).attr("class");
		    framesrc = liclass.split(" ");
		    framesrc = framesrc[0];
		    if( framesrc.indexOf("apps/calllog.html") != -1 )
		    {
		        var tmp = framesrc.split("#");
		        $.cookie( "CalllogType" , tmp[1]  , { path: '/', expires: 30 });
		        framesrc = tmp[0];
		    }else if( framesrc.indexOf("apps/caption.html") != -1 )
		    {
		        var tmp = framesrc.split("#");
		        $.cookie( "CaptionType" , tmp[1]  , { path: '/', expires: 30 });
		        framesrc = tmp[0];
		    }
		    else if( (framesrc.indexOf("advanset/dispalycaption.html") != -1) || (framesrc.indexOf("advanset/dispalysitesetting.html") != -1))
		    {
		        var tmp = framesrc.split("#");
		        $.cookie( "CaptionType" , tmp[1]  , { path: '/', expires: 30 });
		        framesrc = tmp[0];
		    }
		}
		var frametagsrc = framesrc + "?ver=" + version;
		//console.log("src 11= " + frametagsrc);
		//var height = window.parent.document.body.scrollHeight-107;
        //$("#iframediv").css('width','100%').css('height',height);
		$("#iframediv").attr('src',frametagsrc);
		var menuitem = framesrc.split('.html');
		var menu = menuitem[0].split('/');
		$.cookie( "Mainpage" , menu[0]  , { path: '/', expires: 30 });
		$.cookie( "Subpage" , menu[1]  , { path: '/', expires: 30 });
		if( submenu == 1 ) {
		    //$(".hassubmenu").siblings().removeClass('active');
		    $("#subtitle").text( $(this).find("span").text() );
		    if( menu[0] == "account" ){
		        $("#account_li").attr("subpage", menu[1]);
		    }
		}else if( submenu == 0 ){
		    $(".leftsecmenu").children("li").removeClass('active');
		    $("#subtitle").text( $(this).find("span").text() );
		}
		return false;//to avoid exec this again
	});
    $(window).scroll(function() {
        var bodyTop = 0;  
        if (typeof window.pageYOffset != 'undefined') {  
            bodyTop = window.pageYOffset;  
        } else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {  
            bodyTop = document.documentElement.scrollTop;  
        }  
        else if (typeof document.body != 'undefined') {  
            bodyTop = document.body.scrollTop;  
        }     
        $("#tooltipdiv").css("top", 160 + bodyTop);
    });
}

function hideApply()
{
	$("#applytips").hide(); 
    //$("#pageslide-body-wrap, #topbg").css( "top", "0");
}

function showChangePassword()
{
	$("#changepwddiv").show();
    $("#pageslide-body-wrap, #topbg").css( "top", "40px");
}

function hideChangePassword()
{
	$("#changepwddiv").hide();
    $("#pageslide-body-wrap, #topbg").css( "top", "0");
}

function cb_get_apply_response_done(data)
{
    var msgs = res_parse_rawtext(data);
    var response = msgs.headers["phrebootresponse"];
    if(response == 0)
    {
        //$("#apply").attr("disabled", false);
		myFrame.applyDbusFunction();
        $("#applytips").show();
		$("#applytext").text(a_16425);
        unblock_func();
        setTimeout( "hideApply()", 3000 );
    }else{
        setTimeout("cb_get_apply_response()",3000);
    }
}


function cb_get_apply_response()
{
    var urihead = "action=applypvaluersps";
	urihead += "&time=" + new Date().getTime();
	$.ajax ({
		type: 'get',
		url:'/manager',
		data:urihead,
		dataType:'text',
		success:function(data) {
			cb_get_apply_response_done(data);
		},
		error:function(xmlHttpRequest, errorThrown) {
			cb_networkerror(xmlHttpRequest, errorThrown);
		}
	});
}

function cb_applypvalue_done(data)
{
    var msgs = res_parse_rawtext(data);
    if (msgs.headers['response'].toLowerCase() == "error" &&
        msgs.headers['message'].toLowerCase() == "authentication required") {
        //window.location.href='/login.html';
    } else if (msgs.headers['response'].toLowerCase() == "error") {
        $("#applytips").show();
        $("#applytext").text(a_16424);
    } else {
        if( $.cookie("applycert") == "1" ){
            $.cookie("applycert", "0", {path: '/', expires:10});
        }
        //$("#applytext").text(a_applysuc);
        //$("#apply").attr("disabled", false);
		//setTimeout( "hideApply()", 3000 );
		block_download_func(a_4887);
		setTimeout("cb_get_apply_response()",3000);
    }   
}

function move_to_submenu() {
	var mainmenu = $.cookie( "Mainpage");
	if (mainmenu && mainmenu != "call" ) {
	    var folder = mainmenu;
	    var submenu = $.cookie( "Subpage");
	    var id = '.' + folder + '\\/' + submenu + '\\.html';
	    $("#dock").show();
	    if( mainmenu == "account" )
	    {
	        folder = "advanset";
	        //$("#accountdiv").show();
	        var mainid = "#advanset_network";
	        $(mainid).addClass('selected').siblings().removeClass('selected');
	        /**********nav status of selected ***************/
	        $(".select_img").hide();
	        $(mainid).children(".select_img").show();
	        /**********nav status of selected end***************/
	        //mainmenu += $.cookie('AccountIndex');
            var acctIndex = $.cookie('AccountIndex');
            if(acctIndex == undefined || acctIndex == "")
            {
                acctIndex = "1";
            }
	        id = "#" + mainmenu + acctIndex + "_general";
	        $("#account_li").attr("subpage", submenu);
	    }else if( mainmenu == "advanset" && submenu == "mpkext" )
	    {
	    	submenu += $.cookie('MpkExtIndex');
	    }else if(mainmenu == "status")
	    {
	    	hideApply();
	    }else if(mainmenu == "apps" && submenu == "calllog" )
	    {
	    	id += "\\#";
	    	id += $.cookie( "CalllogType") ? $.cookie( "CalllogType") : "0";
	    }else if(mainmenu == "apps" && submenu == "caption" )
	    {
	    	id += "\\#";
	    	id += $.cookie( "CaptionType") ? $.cookie( "CaptionType") : "2";
	    }else if(mainmenu == "advanset" && (submenu == "dispalysitesetting" || submenu == "dispalycaption"))
	    {
	    	id += "\\#";
	    	id += $.cookie( "CaptionType") ? $.cookie( "CaptionType") : "0";
	    }
	    
	    if( mainmenu == "account" ){
		    var maintitle = $("#advanset_network").find("span").text();
			$("#maintitle").text( maintitle );
			document.title = maintitle;
		}else{
		    $("#account1_general").children("span").text("");
			$(".ddsmoothmenu ul li").each(function(){
			    var tmpmenuid = $(this).attr('id');
			    var menuid = tmpmenuid.split('_');
			    if( mainmenu == menuid[0] ){
				    $(this).addClass('selected').siblings().removeClass('selected');
				    /**********nav status of selected ***************/
		            $(".select_img").hide();
		            $(this).children(".select_img").show();
		            /**********nav status of selected end***************/
				    var maintitle = $(this).find("span").text();
				    $("#maintitle").text( maintitle );
				    document.title = maintitle;
				    return false;
			    }
            });
        }
		var menuid = '#' + folder + '_li';
		var mainfolder = folder;
		$(menuid).show();
		$(id).click();
    }else{
        $(".sidemenu, .framebody").css("display", "none");
        $(".callframebody").css("display", "block"); 
        $("#call_call").addClass('selected').siblings().removeClass('selected');
        document.title = $("#call_menu").text(); 
        /**********nav status of selected ***************/
        $(".select_img").hide();
        $("#call_call").children(".select_img").show();
        /**********nav status of selected end***************/
		$("#dock").hide();
        $("#callframediv").attr('src',"call/call.html?ver=" + version);
        $("#account1_general").children("span").text("");
        
        /*$("#account1_general").children("span").text("");
		$('#status_li').show();
		$('#status_account').addClass('selected');
        $(".select_img").hide();
        $('#status_account').children(".select_img").show();
		$("#iframediv").attr('src','status/account.html?ver=' + version);
		var maintitle = $('#status_account').children("span").text();
		$("#maintitle").text( maintitle );
		document.title = maintitle;
		$("#subtitle").text( $('#status\\/account\\.html').children("span").text() );
		$('#status\\/account\\.html, .status\\/account\\.html').addClass('active');*/
	}
    $("#incomingcall").attr('src',"call/conf_control.html?ver=" + version +"&calltype=0").hide();
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
				try{
					msgs.headers[fields[0].toLowerCase()] = decodeURIComponent(valuestr);
				}catch (e){
					msgs.headers[fields[0].toLowerCase()] = valuestr;
				}
                msgs.names[y++] = fields[0].toLowerCase();
            }
        }
    }
    return msgs;
}

function cb_logout_done(data){
    var msgs = res_parse_rawtext(data);
    if (msgs.headers['response'].toLowerCase() == "success") {
        self.location='login.html';
    } else {
        self.location='login.html';
    }
    websocket_close();
}
function add_remove_separator( skinName ){
    if(skinName == "blue")
    {
        /*var sepexist = $("#menuoption ul li.liOdd");
        if( sepexist.length == 0 )
        {
            var sepimg = '<li class="liOdd"><img src="img/blue/menu-separator.png" style="width:2px;height:35px;"/></li>';
            $("#menuoption ul li").each(function(){
                if( $(this).css("display") != "none" )
                {
                    $(this).after(sepimg);
                    $(this).addClass("liEven");
                }else
                {
                    $(this).addClass("liEven");
                }
            });
            $("#menuoption ul li.liOdd:last").remove(); 
        }*/
        $("#menuoption ul li").each(function(){
        	$(this).addClass("liEven");
        });
        //$("#menuoption ul li.liEven:last").removeClass("liEven"); 
        var sepacctexist = $("#accountdiv ul li.liOdd");
        if( sepacctexist.length == 0 )
        {
            var sepacctimg = '<li class="liOdd"><img src="img/blue/menu-acct-separator.png" style="width:2px;height:30px;"/></li>';
            $("#accountdiv ul li").each(function(){
                if( $(this).css("display") != "none" )
                {
                    $(this).after(sepacctimg);
                    $(this).addClass("liEven");
                }else
                {
                    $(this).addClass("liEven");
                }
            });
            $("#accountdiv ul li.liOdd:last").remove(); 
        }
        var sep2exist = $(".main_navi .li2Even");
        if( sep2exist.length == 0 )
        {
            var sep2img = '<li class="li2Odd"><img src="img/blue/menu-2-separator.png" style="width:190px;height:2px;"/></li>';
            //$(".main_navi li").css("display","block").after(sep2img);
            $(".main_navi li").each(function(){
                if( $(this).css("display") != "none" )
                {
                    $(this).after(sep2img);
                    $(this).addClass("li2Even");
                }else{
                    $(this).addClass("li2Even");
                }
            });
            //$(".main_navi li:even").addClass("li2Even");
            $(".main_navi li.li2Odd:last-child").remove();
        }
    }
    else{
        $(".ddsmoothmenu ul li.liOdd").remove();
        $(".ddsmoothmenu ul li").removeClass("liEven");
        $(".main_navi li.li2Odd").remove();
        $(".main_navi li").removeClass("li2Even");
    }
}
function change_skin(skinName){
    $("#cssfile").attr("href","css/"+ skinName +".css");
	if(skinName == "black") 
		$("#blffield").css("background","#8F8F8F");
	else 
		$("#blffield").css("background","url('img/blue/bg-blue-frame.png') repeat-y scroll 0 0 transparent");
		
    if ($("#confmenumode").val() == "1" || $("#confmenumode").val() == "2") {
        if( skinName == "blue" )
            $('#menuoption').css('background', 'url(\"../img/blue/menu-bg3.png\")');
        else
            $('#menuoption').css('background', '');
    }
}
function change_skin_cookie(skinName){
    $("#"+skinName).addClass("selstyle").siblings().removeClass("selstyle");
    $.cookie( "MyCssSkin" ,  skinName , { path: '/', expires: 10 });
}
function translate_menu(){
	$("#call_menu").text(a_504);
	$("#apps_menu").text(a_310);
	$("#status_menu").text(a_600);
	$("#advset_menu").text(a_319);
	$("#control_menu").text(a_16594);
	$("#maintenance_menu").text(a_16028);
	$("#lang").text(a_16216);
	//$("#themetext").text(theme);
	$("#reboottext").text(a_4251);
	$("#exittext").text(a_16);
}
function block_export_func(){
    $.blockUI({
        message: '<img src="../img/busy.gif" width="40px" height="40px" /><font class="downfont">' + a_16427  + '</font>',
        fadeIn: 700, 
        fadeOut: 700,
        css: { 
            width: '400px',
            border: 'none', 
            padding: '15px', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .7, 
            color: '#7f0000'
        } 
    });
}
function block_download_func(text){
    var tmptext;
    if( text == undefined )
        tmptext = a_3334;
    else
        tmptext = text;
    $.blockUI({
        message: '<img src="../img/busy.gif" width="40px" height="40px" /><font class="downfont">' + tmptext  + '</font>',
        fadeIn: 700, 
        fadeOut: 700,
        css: { 
            width: '400px',
            border: 'none', 
            padding: '15px', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .7, 
            color: '#7f0000'
        } 
    });
}
function unblock_func(){
    $.unblockUI();
}
function block_upload_func(){
    $.blockUI({
        message: '<img src="../img/busy.gif" width="40px" height="40px" /><font class="downfont">' + a_16426  + '</font>',
        fadeIn: 700, 
        fadeOut: 700,
        css: { 
            width: '400px',
            border: 'none', 
            padding: '15px', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .7, 
            color: '#7f0000'
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
            cb_get_action_suc(data, action);
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}
function cb_get_action_suc(data, action){
	cb_get_action_done(data, action);
}

function cb_networkerror(xmlHttpRequest, errorThrown)
{

}
function cb_if_auth_fail(msgs){
    if (msgs.headers['response'].toLowerCase() == "error"
        && msgs.headers['message'].toLowerCase() == "authentication required") {
        window.parent.location.href = '/login.html';
    }
}
function cb_is_fail(msgs){
    if (msgs.headers['response'].toLowerCase() == "error") {
        return true;
    }else {
        return false;
    }
}
