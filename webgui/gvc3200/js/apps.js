function get_contact(){
    //get contact
    //cb_get_action("getcontactsbyorder&region=webservice&format=json");
    cb_get_action("sqlitecontacts&region=apps&type=contacts");
}

function get_contact_pinyin_by_rawid(rawid){
    //get contact pinyin info by raw contact id
    cb_get_action("sqlitecontacts&region=apps&type=contactpinyin&rawid=" + rawid);
}

function get_contact_info(){
    //get email, number, groupinfo
    cb_get_action("sqlitecontacts&region=apps&type=contactinfo");
}

function get_groups()
{
    //get groups
    cb_get_action("sqlitecontacts&region=apps&type=groups");
}

function get_left_calllog(logtype){
    var action = "";
    if( logtype == 0 ){//|| logtype == 4
        action = "sqlitecontacts&region=apps&type=leftcalllogall&logtype=" + logtype;
    }else{
        action = "sqlitecontacts&region=apps&type=leftcalllogtype&logtype=" + logtype;
    }
    
    cb_get_action(action);
}

function get_normal_calllog_names(){
    var action = "sqlitecontacts&region=apps&type=leftcalllogname";
    
    cb_get_action(action);
}
function get_normal_calllog(flag, logtype)
{
    //get callhistory, logtype: 0-all, 1-incoming , 2-outgoing, 3-missed
    //flag: 3-latest single log(not in conf, one-way), 2-latest single log(include in conf members), 0-single log by logtype
    var action = "sqlitecontacts&region=apps&type=calllog&flag=" + flag + "&logtype=" + logtype; 
    cb_get_action(action);
}
function get_callconf_by_name(name){
    var action = "sqlitecontacts&region=apps&type=leftcalllogall&flag=1&name=" + encodeURIComponent(name);
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
function get_calllog_by_number(number, account, logtype){
    var action = "sqlitecontacts&region=apps&type=calllog&flag=1&number=" + encodeURIComponent(number) + "&account=" + account + "&logtype=" + logtype;
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
function get_conflog()
{
    cb_get_action("sqlitecontacts&region=apps&type=conflog");
}
function get_all_conf_member()
{
    //get conference log with members
    var action = "sqlitecontacts&region=apps&type=confmember&flag=1";
    
    cb_get_action(action);
}

function get_conflog_only()
{
    //get conference log only
    cb_get_action("sqlitecontacts&region=apps&type=conflogonly");
}

function get_schedulecall()
{
    //get schedule
    cb_get_action("sqliteconf&region=apps&type=schedulecall");
}

function get_schedule()
{
    //cb_get_action("sqliteconf&region=apps&type=schedule&sqlstr=select schedule.id as id,schedule.group_id as groupid,schedule.start_time as start_time, schedule.duration as duration, schedule.need_reminder as need_reminder, schedule.reminder_time as reminder_time from schedule order by start_time;");
    cb_get_action("sqliteconf&region=apps&type=schedule");
}

function get_email(){
    //get email
    cb_get_action("sqlitecontacts&region=apps&type=email");
}

function get_preconf()
{
    //get pre-conference
    //cb_get_action("sqliteconf&region=apps&type=preconf&sqlstr=select conf_group.id as confid,conf_group.display_name as confname,group_contacts.id as contactid, group_contacts.number as number, group_contacts.name as name,conf_group.is_on_top as ontop from conf_group left join group_contacts on conf_group.id=group_contacts.group_id order by ontop desc,confname;");
    cb_get_action("sqliteconf&region=apps&type=preconf");
}

function convertCurrentTime(date){
    var dateObj = new Date;
    if( date != undefined && date != "" )
        dateObj.setTime(date);
    var timestr = dateObj.getFullYear()+"-";
    var month = dateObj.getMonth()+1;
    if( month < 10 )
        timestr += "0";
    timestr += month;
    timestr += "-";
    var date = dateObj.getDate();
    if( date < 10 )
        timestr += "0";
    timestr += date;
    timestr += " ";
    var hours = dateObj.getHours();
    if( hours < 10 )
        timestr += "0"
    timestr += hours;
    timestr += ":";
    var minutes = dateObj.getMinutes();
    if( minutes < 10 )
        timestr += "0";
    timestr += minutes;
    timestr += ":";
    var seconds = dateObj.getSeconds();
    if( seconds < 10 )
        timestr += "0";
    timestr += seconds;
    return timestr;
}
function convertDuration(duration){
    if( duration == 0 )
        return "00:00";
    var day = parseInt(duration / (24 * 3600));
    duration %= (24 * 3600);
    var hour = parseInt(duration / 3600);
    if( day > 0 )
        hour += day * 24;
    duration %= 3600;
    var min = parseInt(duration / 60);
    var sec = parseInt(duration % 60);
    var timestr = "";
    /*if( day > 0 ){
        timestr += day + " ";
        if( day > 1 )
            timestr += a_days;
        else
            timestr += a_day;
        timestr += " ";
    }*/
    if( hour > 0 ){
        if( hour < 10 )
            timestr += "0";
        timestr += hour + ":";
    }
    if( min > 0 ){
        if( min < 10 )
            timestr += "0";
        timestr += min + ":";
    }else{
        timestr += "00:";
    } 
    if( sec > 0 ){
        if( sec < 10 )
            timestr += "0";
        timestr += sec;
    }else{
        timestr += "00";
    }   
    return timestr;
    
}
