WEB_SOCKET_SWF_LOCATION = "js/WebSocketMain.swf";
WEB_SOCKET_DEBUG = true;

var ws,wsdata;
var obj_incominginfo = new Object();//store info of incoming call
var ws_host = location.host;
var protocol = location.protocol;
var mContactitems;
var mcontact_array="",mitemsinfo_array="";
var mConnectTime = 0;
var initwebsocket = function(){
    var wsuri = "";
    if(protocol.indexOf("https:") != -1)
        wsuri = 'wss://' + ws_host + '/tcp_proxy';
    else
        wsuri = 'ws://' + ws_host + '/tcp_proxy';

    ws = new WebSocket(wsuri);
    //console.log(ws.readyState);
    ws.onopen = function(e) {
        ws.send("open" + '\n');
        //console.log(11);
    };
    ws.onmessage = function (e) {
        mConnectTime = 0;
        var data = e.data.substring(0, e.data.length-1);
        //console.log("websocket data:" + data);
        wsdata = eval("([" + data + "])");
        for(var i=0; i<wsdata.length; i++)
            if(wsdata[i].reback != "done")
                handlemessage(wsdata[i]);  
    };
    ws.onclose = function(e){
        //console.log(e);
        ws.send("close" + '\n');
        var urihead = "action=gettcpserverstate" + "";
        urihead += "&time=" + new Date().getTime();
        $.ajax ({
            type: 'get',
            url:'/manager',
            data:urihead,
            dataType:'text',
            success:function(data) {
                var msgs = res_parse_rawtext(data);
                if (msgs.headers['response'].toLowerCase() == "error" &&
                    msgs.headers['message'].toLowerCase() == "authentication required") {
                    window.parent.location.href='/login.html';
                    throw "exit";
                } else {
                    if(mConnectTime < 15)
                        setTimeout(function(){initwebsocket();},2000);
                    mConnectTime++;
                }
            },
            error:function(xmlHttpRequest, errorThrown) {
                //alert("NetWork ERROR!");
            }
        });
        
    };
};

window.onbeforeunload = function() {
    //console.log("refresh");
    websocket_close();   
};

window.onload = function() {
    initwebsocket();    
};

function websocket_close(){
    ws.close();   
}

$(function(){   
    $("#incomingcall,#maskdiv").hide();    $("#incomingcall").show();

    confEventActions(); 
});

function get_initws(){
    var urihead = "region=confctrl&action=getallLineInfo";
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            //console.log(data);
            wsdata = eval("([" + data + "])");
            for(var i=0; i<wsdata.length; i++)
                if(wsdata[i].reback != "done")
                    handlemessage(wsdata[i]);
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}

function deal_contactitem(item,iteminfo){
    mContactitems = [];
    for(var i = 0;item[i] != undefined; i++)
    {
        var rawid = item[i].RawId;
        var name = item[i].Name;
        for(var n=0;iteminfo[n] != undefined; n++)
        {
            var infotype = iteminfo[n].InfoType;
            if( infotype == 5 && rawid == iteminfo[n].RawId){
                iteminfo[n].Number = iteminfo[n].Info;
                iteminfo[n].Name = name;
                mContactitems.push(iteminfo[n]);
            }
        }
    }    
}

function handlemessage(data){
    var type = data.type;
    mContactitems = confFrame.getContactitems();
    switch(type)
    {
        case "call":
            $("#incomingcall")[0].contentWindow.handle_callmessage(data,obj_incominginfo);
            break;
        case "init":
            confFrame.init_conference(data);
            break;
        case "detail":
            confFrame.showDetails(data);
            break;
        case "showDetail":
            //confFrame.changeShowDetails_Status(data);
            break;
        case "video_invite":
            var remotevideostate = $("#remotevideo").val();
            if(remotevideostate == "0")
            {
                if(!$("#incomingcall").is(":visible"))
                    isopenincall(true);
                confFrame.video_Invite(data);
            }
            break;
        case "conf_pause":
            confFrame.setconfpause_callback(data);
            break;
        case "camera_block":
            confFrame.setcameraBlocked_callback(data);
            break;
        case "mic_block":
            confFrame.setmute_callback(data);
            break;
        case "local_mute":
            confFrame.localmute_callback(data);
            break;
        case "presentation_status":
            confFrame.setBFCP_callback(data);
            break;
        case "updateDND":
            confFrame.updateDNDState(data);
            break;
        case "switchhvideosource":
            confFrame.setsubstream_callback(data);
            break;
        case "record":
            confFrame.setrecord_callback(data);
            break;
        case "video_invite_res":
            confFrame.video_Inviteres_callback(data,0);
            break;
        case "video_invite_ack":
            confFrame.video_Inviteres_callback(data,1);
            break;
        case "attendtrnf":
            confFrame.attend_trnf_callback(data);
            break;
        case "blindtrnf":
            confFrame.blind_trnf_callback(data);
            break;
        case "callout":
            confFrame.handle_callout(data);
            break;
        case "videoon":
            confFrame.handle_video_on(data);
            break;
        case "callfeature":
            confFrame.handle_callfeature(data);
            break;
        case "updatename":
            if($("#incominglist .itemdiv[line=\""+data.line+"\"]").length > 0)
            {
                $("#incominglist .itemdiv[line=\""+data.line+"\"]").children(".itemname").find("span").attr("title",data.name).text(data.name);
                obj_incominginfo[data.line].name = data.name;
            }
            else
                confFrame.handle_updatename(data);
            break;
        case "feccstate":
            confFrame.handle_feccstate(data);
            break;
        case "enablefecc":
            confFrame.update_feccstate(data.state,data.line);
            break;
        case "blockstate":
            confFrame.update_blockstate(data);
            break;
        case "suspendstate":
            confFrame.update_suspendstate(data);
            break;
        case "remote_hold":
            confFrame.handle_remotehold(data);
            break;
        case "line_suspend_state":
            confFrame.update_line_suspendstate(data);
            break;
        case "line_resume_state":
            confFrame.update_line_resumestate(data);
            break;
        case "auto_answer":
            confFrame.handle_autoanswer(data);
            break;
        case "goto_sleep":
            change_to_sleep_mode();
            break;
        default:
            break;
    }
}
function change_to_sleep_mode(){
    var urihead = "action=logoff";
    var callfn = "logoff_done(data)";
    cb_get_call_action(urihead,callfn);
}

function logoff_done(data){
    self.location='login.html';
}

function del_obj_incominginfo(line)
{
    delete obj_incominginfo[line];
}

function showincominglist(iscall,data)
{
    if(data == undefined)
        return false;
    var dataline = data.line;
    if(iscall)
    {
        if($("#incominglist .itemdiv[line=\""+data.line+"\"]").length > 0)
            return false;
        /*if(mContactitems != undefined)
        {
            for(var i=0;mContactitems[i] != undefined;i++)
            {
                //get the name of incoming call 
                var number = mContactitems[i].Number;
                number = number.replace(/\s/g,"");
                if(number == data.num)
                    data.name = mContactitems[i].Name;
            }
        }*/
        var num = data.num;
        var callname = data.name;
        if(callname == "")
        {
            callname = num;
            data.name = num;
        }

        var itemdiv = document.createElement("DIV");
        itemdiv.id = data.num;
        itemdiv.setAttribute("line",data.line);
        itemdiv.setAttribute("isvideo",data.msg);
        itemdiv.setAttribute("acct",data.acct);
        itemdiv.className = "itemdiv";

        var checkdiv = document.createElement('DIV');
        checkdiv.className='itemcheck';
        var checkbox = document.createElement('INPUT');
        checkbox.type = 'checkbox';
        checkbox.className = "inputcbx";
        checkdiv.appendChild(checkbox);
        itemdiv.appendChild(checkdiv);

        var icondiv = document.createElement('DIV');
        icondiv.className='itemicon';
        var itemicon = document.createElement('DIV');
        itemicon.className='appcontacticon';
        icondiv.appendChild(itemicon);
        itemdiv.appendChild(icondiv);
        
        var namediv = document.createElement('DIV');
        namediv.className='itemname';
        var spantext = document.createElement('SPAN');
        spantext.innerHTML = htmlEncode(callname);
        spantext.setAttribute("title", callname);
        namediv.appendChild(spantext);
        itemdiv.appendChild(namediv);
        
        var numberdiv = document.createElement('DIV');
        numberdiv.className='itemtime';
        var numbertext = document.createElement('SPAN');
        numbertext.innerHTML = htmlEncode(num);
        numberdiv.appendChild(numbertext);
        itemdiv.appendChild(numberdiv);

        $("#incominglist").append(itemdiv);
        
        obj_incominginfo[dataline] = data;
    }
    else
    {     
        $("#incominglist div").each(function(){
            if($(this).attr("line") == data.line)
            {
                $(this).remove();
                return false;
            }
        });
        if(obj_incominginfo[dataline] != undefined)
            del_obj_incominginfo(dataline);
    }

    var objnumber = 0;
    $("#incominglist .itemdiv").each(function(){
        objnumber++;
    });
    
    if(objnumber <= 1)
    {
        $("#incominglist .inputcbx").hide();
        $("#incominglist .inputcbx").each(function(){
            var isvideo = $(this).parent().parent().attr("isvideo");
            var acct = $(this).parent().parent().attr("acct");
            if(isvideo == 1)
            {
                //one checked line is video call
                $("#videoaccept,#audioaccept").show();
            }
            else
            {
                $("#audioaccept").show();
                $("#videoaccept").hide();
            }
            if(acct == "8")
            {
                $(".callaccept").hide();
                $(".h323mode, #audioaccept").show();
            }
            else
            {
                $(".h323mode").hide();
            }
        });
    }
    else{
        $("#incominglist .inputcbx").show();
        $("#incominglist .inputcbx")[0].setAttribute("checked",true);
    }
        

    if(data.msg == "1" && data.state == "2")
    {
        //video call
        data.isvideo = "1";
        $("#videoaccept,#audioaccept").show();
    }
    else if(data.msg == "0" && data.state == "2")
    {
        //audio call
        data.isvideo = "0";
        $("#audioaccept").show();
        $("#videoaccept").hide();
    }
    if(data.acct == "8")
    {
        $(".callaccept").hide();
        $(".h323mode, #audioaccept").show();
    }
    else
    {
        $(".h323mode").hide();
    }

    if(mDisableconf == "0")
    {
        //conf enabled
        $("#addtoconf").show();
        $("#accpet").hide();
    }
    else
    {
        //conf disabled
        $("#addtoconf").hide();
        $("#accpet").show();
    }
    addlistEvent();

    
}

function isshowincominglist(flag)
{
    if(flag)
    {
        $("#incomingcalldiv").queue(function(){
            $(this).slideDown(800);
            $(this).dequeue();
        });
    }
    else
    {
        $("#incomingcalldiv").queue(function(){
            $(this).slideUp(800);
            $(this).dequeue();
        });
    }
}

function addlistEvent()
{
    $("#incominglist .inputcbx").click(function(){
        var num = 0;
        var isallaudio = 1;
        $("#incominglist .inputcbx").each(function(){
            var isvideo = $(this).parent().parent().attr("isvideo");
            if($(this).prop("checked") == true)
            {
                num++;
                if(isvideo == "1")
                    isallaudio = 0;
                if(num > 1)
                {
                    if(isallaudio == 1)
                    {
                        //all checked line are audio call
                        $("#audioaccept").show();
                        $("#videoaccept").hide();
                        
                    }
                    else
                    {
                        $("#videoaccept,#audioaccept").show();
                    }
                }
                else
                {
                    if(isvideo == 1)
                    {
                        //one checked line is video call
                        $("#videoaccept,#audioaccept").show();
                    }
                    else
                    {
                        $("#audioaccept").show();
                        $("#videoaccept").hide();
                    }
                }   
            }
        });
    });
}

function isopenincall(flag)
{
    if(mDisableconf == "1")
    {
        $("#incomingcall").contents().find("#addmember").parent().hide();
        $("#incomingcall").contents().find("#addnewcall").parent().show();
    }
    else
    {
        $("#incomingcall").contents().find("#addmember").parent().show();
        $("#incomingcall").contents().find("#addnewcall").parent().hide();
    }
    if(flag)
    {
        $("#meettingdiv").queue(function(next){
            $this = $(this);
            $("#maskdiv").fadeTo(800,0.5);
            $("#incomingcall").show();
            $this.css("overflow","visible");
            $this.animate({left:"-990px"},800,function(){});
            $this.dequeue();
        }); 
        //$("#incomingcall")[0].contentWindow.settabwidth();
        $("#rightsidebtn #meettingdiv img").attr("src","img/call/meeting_control_setback_button_unpressed.png").attr("alt","setback");
    }
    else
    {
        $("#meettingdiv").queue(function(next){
            $("#maskdiv").fadeOut(800);
            $(this).animate({left:"0px"},800,function(){
                $("#incomingcall").hide();
                $(this).css("overflow","hidden");
                var tabnum = parseInt(confFrame.countTabs());
                if(tabnum > 0)
                {
                    $("#rightsidebtn #meettingdiv img").attr("src","img/call/meeting_control_calling_button_unpressed.gif").attr("alt","open");
                }
                else
                {
                    $("#rightsidebtn #meettingdiv img").attr("src","img/call/meeting_control_open_button_unpressed.png").attr("alt","open");
                }
            });
            $(this).dequeue();
        });
    }
}

function cb_get_call_action(urihead,callbackfn)
{
    urihead += "&time=" + new Date().getTime();
    $.ajax ({
        type: 'get',
        url:'/manager',
        data:urihead,
        dataType:'text',
        success:function(data) {
            //console.log(data);
            if( data.substring(0, 1) == "{" )
            {
            }else
            {
                var msgs = res_parse_rawtext(data);
                cb_if_auth_fail(msgs);
            }
            eval(callbackfn);
        },
        error:function(xmlHttpRequest, errorThrown) {
            cb_networkerror(xmlHttpRequest, errorThrown);
        }
    });
}

function accept_callback(objnumber, dataindex,state,initdata)
{
    var data = obj_incominginfo[dataindex];
    var incomglength = $("#incomingcalldiv #incominglist div").length;
    if(initdata != undefined)
        data = initdata;
    if(state != undefined)
        data.state = state;
    $("#incomingcall")[0].contentWindow.acceptorcallout(data,0);
    showincominglist(false,data);
    del_obj_incominginfo(dataindex);
    if($("#rightsidebtn #meettingdiv img").attr("alt") != "setback")
    {
        isopenincall(true);
    }
}

function addtoconf_callback(dataid,state,initdata)
{
    var i,objnumber;
    var data = obj_incominginfo[dataid];
    objnumber = 0;
    if(initdata != undefined)
        data = initdata;
    if(state != undefined)
        data.state = state;
    $("#incomingcall")[0].contentWindow.addtoconf(data);
    showincominglist(false,data);
    del_obj_incominginfo(dataid);
    var incomglength = $("#incomingcalldiv #incominglist div").length;
    for(i in obj_incominginfo)
        objnumber++;

    if($("#rightsidebtn #meettingdiv img").attr("alt") != "setback")
    {
        isopenincall(true);
    }
}

function reject_callback(objnumber, dataindex)
{
    del_obj_incominginfo(dataindex);
}

function showTips(type)
{
    $("#incomingcalldiv .listtips").remove();
    var html_tip = "<div class='listtips'>";
    var tips;
    switch(type)
    {
        case 0:
            tips = a_16671;
            break;
        case 1:
            tips = a_16672;
            break;
        default:
            break;
    }
    html_tip = html_tip + tips;
    html_tip += "</div>";

    $(html_tip).insertBefore($("#incominglist")).slideDown(800,function(){
        setTimeout(function(){$("#incomingcalldiv .listtips").slideUp(800,function(){
            $("#incomingcalldiv .listtips").remove();
            });},
            2000);
    });
}

function confEventActions()
{
    //accpet or addtoconf , must make the checkbox checked
    $(".callaccept").unbind("click").click(function(){//console.log("click");
        var isaccept = 1;
        var line,isaddtoconf;
        var objnumber = 0;
        var i,num;
        var id = $(this).attr("id");
        var isvideo = 0;

        if(id == "videoaccept")
            isvideo = 1;
        for(i in obj_incominginfo)
        {
            if(obj_incominginfo[i].state == "2")
                objnumber++;
        }
        if(objnumber > 1)
        {
            num = 0;
            $("#incominglist .inputcbx").each(function(){
                if($(this).prop("checked") == true)
                {
                    num ++;
                    var dataline = $(this).parent().parent().attr("line");
                    var acct = $(this).parent().parent().attr("acct");
                    if(acct == "8" && id == "answer")
                    {
                        isvideo = "1";
                    }
                    line = parseInt(dataline);
                    if(mDisableconf == "1")
                    {
                        isaddtoconf = 0;
                        var urihead = "action=acceptringline&region=confctrl&isaccept="+isaccept+"&line="+line+"&isvideo="+isvideo;
                        var callfn = "";
                    }
                    else
                    {
                        isaddtoconf = 1;
                        var urihead = "action=acceptringline&region=confctrl&isaccept="+isaccept+"&line="+line+"&isvideo="+isvideo;
                        var callfn  = "";
                    }
                    cb_get_call_action(urihead,callfn);
                    // $("#incomingcall")[0].contentWindow.acceptorcallout(obj_incominginfo[dataline]);
                    // showincominglist(false,obj_incominginfo[dataline]);
                    // delete obj_incominginfo[dataline];
                    //return false;
                }
            });
            if(num == 0)
                showTips(0);
        }
        else if(objnumber == 1)
        {
            //var onecalldata = obj_incominginfo[i]
            line = parseInt(i);
            if(obj_incominginfo[i].acct == "8" && id == "answer")
            {
                isvideo = "1";
            }
            if(mDisableconf == "1")
            {
                isaddtoconf = 0;
                var urihead = "action=acceptringline&region=confctrl&isaccept="+isaccept+"&line="+line+"&isvideo="+isvideo;
                var callfn = "";
            }
            else
            {
                isaddtoconf = 1;
                var urihead = "action=acceptringline&region=confctrl&isaccept="+isaccept+"&line="+line+"&isvideo="+isvideo;
                var callfn  = "";
            }
            cb_get_call_action(urihead,callfn);
            // $("#incomingcall")[0].contentWindow.acceptorcallout(onecalldata);
            // $("#incomingcalldiv").slideUp(1000,function(){showincominglist(false,onecalldata);});
            // delete obj_incominginfo[i];    
        }
        
    });
    $("#reject").unbind("click").click(function(){
        var isaccept = 0;
        var line,isvideo=0;
        var objnumber = 0;
        var i,num;
        for(i in obj_incominginfo)
        {
            if(obj_incominginfo[i].state == "2")
                objnumber++;
        }
        if(objnumber > 1)
        {
            num = 0;
            $("#incominglist .inputcbx").each(function(){
                if($(this).prop("checked") == true)
                {
                    num++;
                    var dataline = $(this).parent().parent().attr("line");
                    line = parseInt(dataline);
                    isaddtoconf = 0;
                    var urihead = "action=acceptringline&region=confctrl&isaccept="+isaccept+"&line="+line+"&isvideo="+isvideo;
                    var callfn = "reject_callback("+objnumber+","+dataline+");";
                    cb_get_call_action(urihead,callfn);
                    //return;
                }
            });
            if(num == 0)
                showTips(0);
        }
        else
        {
            if($("#incomingcalldiv #incominglist div").length > 0)
            {
                isaddtoconf = 0;
                line = parseInt(i);
                var urihead = "action=acceptringline&region=confctrl&isaccept="+isaccept+"&line="+line+"&isvideo="+isvideo;
                var callfn = "reject_callback("+objnumber+","+i+");";
                cb_get_call_action(urihead,callfn);
            }
        }
    });
    $("#rightsidebtn #meettingdiv img").unbind("click").click(function(e){
        var type = $(this).attr("alt");
        switch(type)
        {
            case "open":
                isopenincall(true);
                break;
            case "setback":
                isopenincall(false);
                break;
            default:
                break;
        }
    });

    $("#rightsidebtn #meettingdiv img").hover(function(){
        var state = $(this).attr("alt");
        if(state == "setback")
        {
            $(this).attr("src","img/call/meeting_control_setback_button_hover.png");
        }
    },function(){
        var state = $(this).attr("alt");
        if(state == "setback")
        {
            $(this).attr("src","img/call/meeting_control_setback_button_unpressed.png");
        }
    });
    
    /*$("#incominglist .inputcbx").live("click",function(){
        var num = 0;
        $("#incominglist .inputcbx").each(function(){
            if($(this).prop("checked") == true)
                num++;
        });

        if(num > 1)
        {
            showTips(1);
            $("#accept,#reject").attr("disabled","disabled");
        }
        else
        {
            $("#accept,#reject").removeAttr("disabled");
        }
    });*/

    $("#closecalldiv").click(function(){
        // $("#incomingcalldiv").queue(function(){
        //     $(this).slideUp(800);
        //     $(this).dequeue();
        // });
        $("#incomingcalldiv").hide();
        if($("#incomingcall").is(":visible"))
        {
            $("#rightsidebtn #meettingdiv img").attr("src","img/call/meeting_control_setback_button_unpressed.png").attr("alt","setback");
        }
        else
        {
            $("#rightsidebtn #meettingdiv img").attr("src","img/call/meeting_control_open_button_unpressed.png").attr("alt","open");
        }
    });
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
