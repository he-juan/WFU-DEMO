//complie
// source envlighttpdxxx.sh
// $CC $CFLAGS $LDFLAGS $LIBS tcpserver.c  -o tcpserver crtbegin_dynamic.o crtend_android.o 

#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <string.h>
#include <stdlib.h>
#include <sys/un.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <dbus/dbus.h>
#include <pthread.h>
#include <sys/ioctl.h>
#include <malloc.h>
#include <sqlite3.h>
#include <stdbool.h>
#include <android/log.h>

#define  LOGD(x...) __android_log_print(ANDROID_LOG_DEBUG, "WebServer", x)

#define DBUS_PATH                 "/com/grandstream/dbus/gui"
#define DBUS_INTERFACE            "com.grandstream.dbus.signal"

#define SIGNAL_STATUS        "status"
#define SIGNAL_DEVICE             "device"
#define SIGNAL_CALL             "call"
#define SIGNAL_PHONEEXIT             "phone_exit"
#define SIGNAL_CAPTURE       "capture"
#define SIGNAL_PHONEINIT             "phone_init"
#define SIGNAL_PHONE_BOOK_RESPONSE "phone_book_response"
#define SIGNAL_PHONE_BOOK_PORTRESPONSE "phbk_export_response"
#define SIGNAL_CALLSTATUSREPORT "callstatus_report"
#define SIGNAL_CALLSTATUS "callStatus"
#define SIGNAL_VIDEOINVITE "video_invite"
#define SIGNAL_CONFPAUSE "conf_pause"
#define SIGNAL_CAMERABLOCK "camera_block"
#define SIGNAL_CAMERASTATUS_OPEN "open_camera_status"
#define SIGNAL_CAMERASTATUS_CLOSE "close_camera_status"
#define SIGNAL_MICBLOCK "mic_block"
#define SIGNAL_PRESENTATION "presentation_status"
#define SIGNAL_UPDATEDND "dnd_state"
#define SIGNAL_AVSAPI "avsapi"
#define SIGNAL_SWITCHVIDEOSOURCE "isSwitchVideoSouceOn"         //switch_videosource
#define SIGNAL_RECORDING "avs_callrecord"
#define SIGNAL_VIDEORESTATE "video_invite_res"
#define SIGNAL_VIDEOACKSTATE "video_invite_ack"
#define SIGNAL_ATTENDTRNF "auto_attended_trnf"
#define SIGNAL_BLINDTRNF "transferline"
#define SIGNAL_DIALFULL "dial_full"
#define SIGNAL_CONFADDUSER "conf_add_user"
#define SIGNAL_VIDEO_ON "video_on"
#define SIGNAL_CALLFEATURE "call_feature"
#define SIGNAL_UPDATENAME "update_name"
#define SIGNAL_FECCSTATE "fecc_func"
#define SIGNAL_ENABLEFECC "remote_camera_control"
#define SIGNAL_SETPARAM "avs_setparam"
#define SIGNAL_CHANGESUSPEND "change_suspend" 
#define SIGNAL_REMOTEHOLD "remote_hold" 
#define SIGNAL_SUSPENDSTATUS "change_suspend_status" 
#define SIGNAL_RESUMESTATUS "change_resume_status"
#define SIGNAL_SLEEP             "avs_standby"
#define SIGNAL_AUTO_ANSWER  "auto_answer_alert"
#define SIGNAL_HDMI_STATUS "hdmi_status"
#define SIGNAL_UNHOLD_RECORD "unhold_continue_record"
#define SIGNAL_IPVT_CMR_INVITE "IPVT_camera_invite"
#define SIGNAL_IPVT_REJECT_CMR "IPVT_reject_camera_request"
#define SIGNAL_IPVT_OPERATE_CMR "IPVT_operate_camera"
#define SIGNAL_IPVT_CHANGE_HOST "IPVT_change_host"
#define SIGNAL_IPVT_HAND_OPERATE "IPVT_hand_operate"
#define SIGNAL_IPVT_HAND_OPRT_WEB "IPVT_hand_operate_for_web"
#define SIGNAL_UI_SYNC "ui_sync"
#define SIGNAL_WIFIDIS_STATUS "wifidisplay_status"
#define SIGNAL_SWITCHPRE_SOURCE "switch_presentation_source"
#define SIGNAL_SELECTPRE_SOURCE "select_presentation_source"
#define SIGNAL_IPVT_RECORD_OPERATE "IPVT_record_operate"
#define SIGNAL_IPVT_RECORD_STATE "IPVT_record_state"
#define SIGNAL_SCHE_OPERATE "schedule_operate"
#define SIGNAL_SCHE_EVENT_OPERATE "schedule_event_operate"

static char *dbus_path = "/com/grandstream/dbus/webservice";
static char *dbus_dest = "com.grandstream.dbus.gmi.server";
static char *dbus_interface = "com.grandstream.dbus.method";


typedef struct node * PNode;
typedef struct node
{
    int state;
    int line;
    int acct;
    int msg;
    char* num;
    char* name;
    PNode next;
}Node,* List;

int sock_new = -1;
int sock_web = -1;
int sock_apk = -1;
int open_cache = 1;
List pHead = NULL;


DBusConnection* bus;
DBusConnection *subbus;

List CreateList(int data[],char *str1,char *str2);//    创建链表函数
//List TraverseList(List,int line);//    遍历链表函数
List freeList(List pHead);
int init_conference(List pHead);
void sendDataToSocket(char *sendData);
void replace(const char *src, const char *s1,const char *s2, char *target);
const char * _strstr(const char *src, const char *needle);

//using namespace android;

static DBusHandlerResult signal_filter2 (DBusConnection *dbconnection, DBusMessage *message, void *user_data)
{
    char* str;
    char* str2;
    char* str3;
    char* str4;
    char* str5;
    char* sendData = NULL;
    //char* str3;
    int i, j, k, m;
    int len;
    bool state = true;
    bool state2 = true;
    bool state3 = true;

    DBusError error;
    dbus_error_init (&error);
    //printf("signal_filter2+++++++\r\n");

    if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_STATUS ) ) // signal status
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i,
            DBUS_TYPE_INT32, &j, DBUS_TYPE_INVALID ) )
        {
            //todo
        }
        else
        {
           // printf( "receive status error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CALL ) ) // signal call
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INT32, &j,
                                    DBUS_TYPE_INT32, &m,
                                    DBUS_TYPE_INT32, &k,
                                    DBUS_TYPE_STRING, &str, 
                                    DBUS_TYPE_STRING, &str2, 
                                    DBUS_TYPE_INVALID ) )
        {
            //set_device_state(i,m);
            char *replacename=NULL,*contactname=NULL;
            int len2=0;
            int rc;
            int test = -1;
            int sqlname = 0;
            int countwhile = 0;
            len = 512 + strlen(str);
            
            if(contactname == NULL)
            {
                contactname = str2;
                sqlname = 0;
            }
               
            if( contactname != NULL ){
                len2 = strlen(contactname) * 2;
                replacename = malloc(len2);
                memset(replacename, 0, len2);
                replace(contactname, "\\", "\\\\", replacename);
                snprintf(contactname, len2, "%s", replacename);
                memset(replacename, 0, len2);
                replace(contactname, "\"", "\\\"", replacename);
                len += strlen(replacename);
            }
            else
                replacename = str;

            len = strlen(str)+strlen(replacename)+128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"call\",\"state\":\"%d\",\"line\":\"%d\",\"acct\":\"%d\",\"msg\":\"%d\",\"num\":\"%s\",\"name\":\"%s\",\"sqlname\":\"%d\"},",i,j,m,k,str,replacename,sqlname);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);

            free(sendData);
            if( str2 != NULL )
                free(replacename);
        }
        else
        {
            //printf( "receive call error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_DEVICE ) ) // signal device
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INT32, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            //todo
        }
        else
        {
            printf( "receive device error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_VIDEOINVITE ) ) // video invite
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"video_invite\",\"line\":\"%d\"},",i);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive video_invite error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_VIDEORESTATE ) ) // video invite res
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_BOOLEAN, &state,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"video_invite_res\",\"line\":\"%d\",\"flag\":\"%d\"},",i,state);
            printf("video invite res: %s\n",sendData);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive video_invite res error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_VIDEOACKSTATE ) ) // video invite ack
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_BOOLEAN, &state,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"video_invite_ack\",\"line\":\"%d\",\"flag\":\"%d\"},",i,state);
            printf("video invite res: %s\n",sendData);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive video_invite res error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CONFPAUSE ) ) // conf pause
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"conf_pause\",\"flag\":\"%d\"},",i);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive conf_pause error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CAMERABLOCK ) ) // camera block
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"camera_block\",\"flag\":\"%d\"},",i);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive camera_block error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CAMERASTATUS_OPEN ) ) // open camera status
    {
        if ( dbus_message_get_args( message, &error,
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_BOOLEAN, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"open_camera_status\",\"line\":\"%d\",\"flag\":\"%d\"},",i,j);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive camera_block error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CAMERASTATUS_CLOSE ) ) // close camera status
    {
        if ( dbus_message_get_args( message, &error,
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_BOOLEAN, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"close_camera_status\",\"line\":\"%d\",\"flag\":\"%d\"},",i,j);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive camera_block error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_MICBLOCK ) ) // mic block
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INT32, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"mic_block\",\"line\":\"%d\",\"flag\":\"%d\"},",i,j);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive camera_block error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_AVSAPI ) ) // local mute block
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_INVALID ) )
        {
            len = strlen(str) + 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"local_mute\",\"line\":\"%d\",\"flag\":\"%s\"},",i,str);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive local mute block error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_PRESENTATION ) ) // presentation status
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INT32, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"presentation_status\",\"line\":\"%d\",\"msg\":\"%d\"},",i,j);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive presentation_status error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CALLSTATUSREPORT ) ) // signal callstatus_report
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"showDetail\",\"state\":\"%d\"},",i);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive device error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_UPDATEDND ) ) // update dnd
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_STRING,&str,
                                    DBUS_TYPE_INT32,&i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = strlen(str) + 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"updateDND\",\"dndmode\":\"%s\",\"state\":\"%d\"},",str,i);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "update dnd error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_SWITCHVIDEOSOURCE ) ) // switch video source
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32,&i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = strlen(str) + 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"switchhvideosource\",\"state\":\"%d\"},",i);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "switch video source: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CALLSTATUS ) ) // signal callStatus
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_STRING, &str2,
                                    DBUS_TYPE_STRING, &str3,
                                    DBUS_TYPE_STRING, &str4,
                                    DBUS_TYPE_STRING, &str5,
                                    DBUS_TYPE_INVALID ) )
        {
            
            len = strlen(str) + strlen(str2) + strlen(str3) + strlen(str4) + strlen(str5) + 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"detail\",\"line\":\"%d\",\"video_snd\":\"%s\",\"video_rcv\":\"%s\",\"present_content\":\"%s\",\"audio_snd\":\"%s\",\"audio_rcv\":\"%s\"},",i,str,str2,str3,str4,str5);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            //printf( "receive capture error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_UPDATENAME ) ) // signal update_name
    {printf("%s",message);
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_INVALID ) )
        {
            char *replacename=NULL,*contactname=NULL;
            if(contactname == NULL)
            {
                contactname = str;
            }
            if( contactname != NULL ){
                len = strlen(contactname) * 2;
                replacename = malloc(len);
                memset(replacename, 0, len);
                replace(contactname, "\\", "\\\\", replacename);
                snprintf(contactname, len, "%s", replacename);
                memset(replacename, 0, len);
                replace(contactname, "\"", "\\\"", replacename);
            }else
                replacename = str;

            len = strlen(replacename)+128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"updatename\",\"line\":\"%d\",\"name\":\"%s\"},",i,replacename);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            //printf( "update_name error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_RECORDING ) ) // recording or hold
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_BOOLEAN, &state,
                                    DBUS_TYPE_INVALID ) )
        {
            len = strlen(str) + 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"record\",\"state\":\"%d\"},",state);
            //printf("has a call: %d\n",open_cache);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "receive device error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_ATTENDTRNF ) ) // attend transfer
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_INVALID ) )
        {
            len = strlen(str) + 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"attendtrnf\",\"line\":\"%d\",\"number\":\"%s\"},",i,str);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "attend transfer: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_BLINDTRNF ) ) // blind transfer
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_INVALID ) )
        {
            len = strlen(str) + 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"blindtrnf\",\"line\":\"%d\",\"number\":\"%s\"},",i,str);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "attend transfer: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_DIALFULL ) ) // dial full
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_INVALID ) )
        {
            len = strlen(str) + 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"callout\",\"line\":\"%d\",\"number\":\"%s\",\"name\":\"%s\"},",i,str,str);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "attend transfer: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CONFADDUSER ) ) // conf add user
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_BOOLEAN, &state,
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_BOOLEAN, &state,
                                    DBUS_TYPE_INVALID ) )
        {
            len = strlen(str) * 2 + 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"callout\",\"line\":\"%d\",\"number\":\"%s\",\"name\":\"%s\"},",i,str,str);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "attend transfer: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_VIDEO_ON ) ) // video_on
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"videoon\",\"line\":\"%d\"},",i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "attend transfer: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CALLFEATURE ) ) // call_feature
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"callfeature\",\"state\":\"%d\"},",i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "call_feature: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_FECCSTATE ) ) // SIGNAL_FECCSTATE 
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INT32, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"feccstate\",\"line\":\"%d\",\"state\":\"%d\"},",i,j);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "call_feature: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_ENABLEFECC ) ) // SIGNAL_ENABLEFECC 
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INT32, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"enablefecc\",\"state\":\"%d\",\"line\":\"%d\"},",i,j);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "call_feature: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_SETPARAM ) ) // SIGNAL_SETPARAM
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128 + strlen(str);
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"blockstate\",\"state\":\"%s\",\"line\":\"%d\"},",str,i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "call_feature: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CHANGESUSPEND ) ) // SIGNAL_CHANGESUSPEND
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_BOOLEAN, &state3,
                                    DBUS_TYPE_BOOLEAN, &state2,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"suspendstate\",\"line\":\"%d\",\"state\":\"%d\",\"isall\":\"%d\"},",i,state3,state2);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "call_feature: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_REMOTEHOLD ) ) // SIGNAL_REMOTEHOLD
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INT32, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"remote_hold\",\"line\":\"%d\",\"state\":\"%d\"},",i,j);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "remote_hold: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_SUSPENDSTATUS ) ) // SIGNAL_SUSPENDSTATUS
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_BOOLEAN, &state,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"line_suspend_state\",\"line\":\"%d\",\"state\":\"%d\"},",i,state);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "suspend_status: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_RESUMESTATUS ) ) // SIGNAL_RESUMESTATUS
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_BOOLEAN, &state,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"line_resume_state\",\"line\":\"%d\",\"state\":\"%d\"},",i,state);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "suspend_status: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_SLEEP ) ) // if going to sleep
    {
        if ( dbus_message_get_args( message, &error,
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            printf( "goint to sleep: %d\n", i );
            if( i == 1 ){
                len = 128;
                sendData = malloc(len);
                memset(sendData,0,len);
                snprintf(sendData,len,"{\"type\":\"goto_sleep\"},");
                sendDataToSocket(sendData);
                free(sendData);
            }
        }
        else
        {
            printf( "suspend_status: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if (dbus_message_is_signal(message, DBUS_INTERFACE, SIGNAL_AUTO_ANSWER))
    {
        if (dbus_message_get_args( message, &error,
                                   DBUS_TYPE_INT32, &i,
                                   DBUS_TYPE_INT32, &j,
                                   DBUS_TYPE_INT32, &m,
                                   DBUS_TYPE_STRING, &str,
                                   DBUS_TYPE_STRING, &str2,
                                   DBUS_TYPE_INVALID))
        {
            len = strlen(str) + strlen(str2) + 128;
            sendData = malloc(len);
            memset(sendData, 0, len);
            snprintf(sendData,len,"{\"type\":\"auto_answer\",\"line\":\"%d\",\"acct\":\"%d\",\"isvideo\":\"%d\",\"num\":\"%s\",\"name\":\"%s\"},", i, j, m, str, str2);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "suspend_status: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if (dbus_message_is_signal(message, DBUS_INTERFACE, SIGNAL_HDMI_STATUS))
    {
        if (dbus_message_get_args( message, &error,
                                   DBUS_TYPE_STRING, &str,
                                   DBUS_TYPE_INT32, &i,
                                   DBUS_TYPE_INVALID))
        {
            len = strlen(str) + 64;
            sendData = malloc(len);
            memset(sendData, 0, len);
            snprintf(sendData,len,"{\"type\":\"hdmi_status\",\"hdmi\":\"%s\",\"status\":\"%d\"},", str, i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "hdmi_status: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if (dbus_message_is_signal(message, DBUS_INTERFACE, SIGNAL_UNHOLD_RECORD))
    {
        if (dbus_message_get_args( message, &error,
                                   DBUS_TYPE_INT32, &i,
                                   DBUS_TYPE_INVALID))
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData, 0, len);
            snprintf(sendData,len,"{\"type\":\"unhold_continue_record\",\"status\":\"%d\"},", i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "unhold_continue_record: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_IPVT_CMR_INVITE ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_STRING, &str2,
                                    DBUS_TYPE_INVALID ) )
        {
            len = strlen(str) + strlen(str2) + 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"IPVT_camera_invite\",\"line\":\"%d\",\"name\":\"%s\",\"number\":\"%s\"},",i,str,str2);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "IPVT_camera_invite: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_IPVT_REJECT_CMR ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_INT32, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"IPVT_reject_camera_request\",\"line\":\"%d\",\"number\":\"%s\",\"status\":\"%d\"},", i, str, j);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "IPVT_reject_camera_request: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_IPVT_OPERATE_CMR ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_BOOLEAN, &state,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"IPVT_operate_camera\",\"line\":\"%d\",\"isvideoed\":\"%d\"},",i, state);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "IPVT_operate_camera: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_IPVT_CHANGE_HOST ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"IPVT_change_host\",\"state\":\"%d\"},", i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "IPVT_change_host: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_IPVT_HAND_OPERATE ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_BOOLEAN, &state,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"IPVT_hand_operate\",\"line\":\"%d\",\"state\":\"%d\"},", i, state);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "IPVT_hand_operate: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_IPVT_HAND_OPRT_WEB ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"IPVT_hand_operate_for_web\",\"state\":\"%d\"},", i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "IPVT_hand_operate_for_web: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_UI_SYNC ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"ui_sync\",\"state\":\"%d\"},", i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "ui_sync: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_WIFIDIS_STATUS ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"wifidisplay_status\",\"status\":\"%d\"},", i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "wifidisplay_status: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_SWITCHPRE_SOURCE ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"switch_presentation_source\",\"switchto\":\"%s\"},", str);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "switch_presentation_source: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_SELECTPRE_SOURCE ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_STRING, &str,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"select_presentation_source\",\"switchto\":\"%s\"},", str);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "switch_presentation_source: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_IPVT_RECORD_OPERATE ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INT32, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"IPVT_record_operate\",\"line\":\"%d\",\"state\":\"%d\"},",i, j);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "IPVT_record_operate: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_IPVT_RECORD_STATE ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"IPVT_record_state\",\"state\":\"%d\"},", i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "IPVT_record_state: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_SCHE_OPERATE ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"schedule_operate\",\"state\":\"%d\"},", i);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "IPVT_record_state: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_SCHE_EVENT_OPERATE ) )
    {
        if ( dbus_message_get_args( message, &error, 
                                    DBUS_TYPE_INT32, &i,
                                    DBUS_TYPE_INT32, &j,
                                    DBUS_TYPE_INVALID ) )
        {
            len = 128;
            sendData = malloc(len);
            memset(sendData,0,len);
            snprintf(sendData,len,"{\"type\":\"schedule_event_operate\",\"type\":\"%d\",\"state\":\"%d\"},", i, j);
            sendDataToSocket(sendData);
            free(sendData);
        }
        else
        {
            printf( "IPVT_record_state: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else
    {
        //printf("Ignore the signal\n");
    }

    return DBUS_HANDLER_RESULT_NOT_YET_HANDLED;
}

static DBusHandlerResult signal_filter (DBusConnection *dbconnection, DBusMessage *message, void *user_data)
{
    #if 0

    #endif
    return DBUS_HANDLER_RESULT_NOT_YET_HANDLED;
}

static void dbus_process()
{
    DBusError suberror;
    //init accountstatus

    dbus_error_init (&suberror);
    subbus = dbus_bus_get (DBUS_BUS_SYSTEM, &suberror);
    if (!subbus)
    {
        //printf ("Warning:Failed to connect to the D-BUS daemon: %s", suberror.message);
        dbus_error_free (&suberror);
        return;
    }

    dbus_bus_add_match (subbus, "type='signal',interface='com.grandstream.dbus.signal'", &suberror);
    dbus_bus_add_match( subbus, "type='method_call',interface='com.grandstream.dbus.signal'", &suberror );
    dbus_bus_add_match( subbus, "type='method_return',interface='com.grandstream.dbus.signal'", &suberror );
    dbus_connection_add_filter (subbus, signal_filter2, NULL, NULL);

    /*while (dbus_connection_read_write_dispatch (subbus, 0))
     ; // empty loop body*/

    int fd= -1;
    while (fd == -1)
    {
        if (subbus != 0)
            dbus_connection_get_unix_fd(subbus,
                                        &fd);
    }

    while(1)
    {
        fd_set rd_fds;
        FD_ZERO(&rd_fds);
        FD_SET(fd, &rd_fds);

        //printf("dbus select\n");
        int result = select(fd+1, &rd_fds, NULL, NULL, NULL);
        
        if (FD_ISSET(fd, &rd_fds))
        {
            while ( subbus != NULL )
            {
                //printf("dbus dispatch\n");
                dbus_connection_read_write_dispatch( subbus, 0 );
                if ( dbus_connection_get_dispatch_status( subbus ) != DBUS_DISPATCH_DATA_REMAINS )
                    break;
            }
        }
    }

    return;
}

static int dbus_init()
{
    dbus_threads_init_default();
    DBusError error;
    int i = 0;
    dbus_error_init( &error );

    while ( 1 )
    {
        bus = dbus_bus_get( DBUS_BUS_SYSTEM, NULL );
        if ( bus == NULL )
        {
            i++;
            if ( i < 3 )
            {
                //printf( "Failed to connect to Message Bus.Sleep for 3 seconds\r\n");
                sleep( 3 );
            }
            else
            {
               // printf( "Failed to start GUI interface\r\n");
                return 0;
            }
        }
        else
            break;
    }
    dbus_connection_set_exit_on_disconnect( bus, FALSE );
    dbus_bus_add_match( bus, "type='signal',interface='com.grandstream.dbus.signal'", &error );
    dbus_connection_add_filter( bus, signal_filter, NULL, NULL );

    return 0;
}

void sendDataToSocket(char *sendData)
{
    if(sock_web > 0)
    {
        send(sock_web,sendData, strlen(sendData),MSG_DONTWAIT);
    }
    if(sock_apk > 0)
    {
        int len = send(sock_apk,sendData, strlen(sendData),MSG_DONTWAIT);
        LOGD("send data -- %s -- to apk, len = %d", sendData, len);
    }
}

int main()
{
    int sockfd,ret,recv_num,send_num,send_num_total=0;

    fd_set readfds, testfds;
    int flag=1,len=sizeof(int);
    struct timeval timeout;
    int nZero=0;
    int nSendBuf=10*1024;//10K

    struct sockaddr_in server_addr;
    char buf[200];
    char* reback = NULL;

    pHead = (List)malloc(sizeof(Node));        //  分配一个不存放有效数据的头结点
    pHead->next = NULL;
//    remove("/data/server.socket");
//    memset(&server_addr,0,sizeof(server_addr));
    server_addr.sin_family=AF_INET;
//    strcpy(server_addr.sin_path,"/data/server.socket");

    /*for security, only local address is supposed to be listened*/
    //server_addr.sin_addr.s_addr=INADDR_ANY;
    server_addr.sin_addr.s_addr=inet_addr("127.0.0.1");

    //server_addr.sin_addr.S_un.S_addr=INADDR_ANY;
    server_addr.sin_port=htons(10000);
    sockfd=socket(AF_INET,SOCK_STREAM,0);
   
    //printf("this is the socket_server *TCP* mode.\n");
    if (sockfd<0)
    {
        //printf("调用socket函数建立socket描述符出错！\n");
         exit(1);
    }

    //bind the same port
    if( setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &flag, len) == -1)
    {
        exit(1);
    }

    if( setsockopt(sockfd,SOL_SOCKET,SO_SNDBUF,&nZero,len) == -1 )
    {
        exit(1);
    }

    //set send buffer
    if( setsockopt(sockfd,SOL_SOCKET,SO_SNDBUF,&nSendBuf,len) == -1 )
    {
        exit(1);
    }

    ret=bind(sockfd,(struct sockaddr *)(&server_addr),sizeof(server_addr));
    if (ret<0)
    {
        //printf("调用bind函数绑定套接字与地址出错！\n");
         exit(2);
    }
    
    ret=listen(sockfd,10);
    if (ret<0)
    {
        //printf("调用listen函数出错，无法宣告服务器已经可以接受连接！\n");
         exit(3);
    }
    FD_ZERO(&readfds);
    FD_SET(sockfd, &readfds);

    dbus_init();
    pthread_attr_t attr;
    pthread_t thread;

    pthread_attr_init( &attr );
    pthread_attr_setdetachstate( &attr, PTHREAD_CREATE_DETACHED );
    pthread_create( &thread, &attr, (void *)dbus_process, NULL );
    pthread_attr_destroy( &attr );
    
    while (1)
    {
        //#if 1  
        int fd, fd_temp;
        int numbytes;
        char buff[256];
        memset(buff,0,256);
        int nLen;
        static int count = 0;
        //struct sockaddr_in client_addr;
        //int len = sizeof(client_addr);
        testfds = readfds;
        timeout.tv_usec = 50000;
        timeout.tv_sec = 0;
//        ret = select(FD_SETSIZE, &testfds, (fd_set *)NULL, (fd_set *)NULL, &timeout);
        ret = select(FD_SETSIZE, &testfds, (fd_set *)NULL, (fd_set *)NULL, &timeout);
       // printf("%d\n", ret);
        if(ret == 0)
        {continue;}
        else if(ret == -1)
        {
            exit(4);
        }
        else
        {
            for(fd = 0; fd < FD_SETSIZE; fd++)
            {
                ret = FD_ISSET(fd, &testfds);
                if(ret)
                {
                    if(fd == sockfd)
                    {
                        if(sock_web != -1)
                        {
                            //printf("sock_web close %d\n", sock_web);
                            close(sock_web);
                            FD_CLR(sock_web, &readfds);
                            
                            //printf("sock_web  %d\n", sock_web);
                            sock_web = -1;
                        }
                        fd_temp=accept(sockfd,NULL,0);
                        //fd_temp=accept(sockfd,&client_addr,&len);
                        FD_SET(fd_temp, &readfds);
                        
                        ret = -1;
                        //if(count ++)
                        //printf("client port = %d, addr = %s\n", client_addr.sin_port, inet_ntoa(client_addr.sin_addr));

                        sock_new = fd_temp;
                        //printf("sock_web = %d, sock_apk = %d\n", sock_web, sock_apk);
                        reback = malloc(128);
                        snprintf(reback,128,"{\"reback\":\"done\"},");
                        send_num=send(sock_new,reback, strlen(reback),MSG_DONTWAIT);
                        free(reback);
                        //printf("%d\n", newfd);
                    }
                    else
                    {//printf("c\n");
                        ioctl(fd, FIONREAD, &nLen);
                            if(nLen == 0)
                            {
                                open_cache = 1;
                                //printf("close\n");
                                close(fd);
                                FD_CLR(fd, &readfds);
                            }
                            else
                            {
                                //printf("read\n");
                                if((numbytes = recv(fd, buff,sizeof(buff),0))==-1)
                                {
                                    perror("recv");
                                    exit(1);
                                }
                                if(strcmp(buff,"open\n")==0)
                                {
                                    open_cache = 0;
                                    //printf("init_conference\n");
                                    //init_conference(pHead);
                                    sock_web = sock_new;
                                    //printf("111 sock_web = %d, sock_apk = %d\n", sock_web, sock_apk);
                                }
                                else if(strcmp(buff,"apkcheck")==0)
                                {
                                    if(sock_apk != -1 && sock_apk != sock_new)
                                    {
                                        close(sock_apk);
                                        FD_CLR(sock_apk, &readfds);

                                        sock_apk = -1;
                                    }
                                    sock_apk = sock_new;
                                    //printf("222 sock_web = %d, sock_apk = %d\n", sock_web, sock_apk);
                                }
                                //printf("result  %s   %d \n",buff,strcmp(buff,"open\n") );
                            }
                    }
                }
            }
        }
    }
    close(sockfd);
}

const char * _strstr(const char *src, const char *needle)
{
    const char *p1 = src;
    const char *p2 = needle;

    while (*src != '\0' && *needle != '\0')
    {
        if (*src++ != *needle++) {
            needle = p2;
            src = ++p1;   //from next character to search needle
        }
    }

    if (*needle == '\0')
        return p1;

    return NULL;
}

void replace(const char *src, const char *s1,const char *s2, char *target)
{
    const char *ss=src;
    const char *p;

    p=_strstr(ss,s1);

    if(p==NULL){
        strcpy(target,src);
        return;
    }
    while(p!=NULL) {
        int n=p-ss;
        strncat(target,ss,n);
        strcat(target,s2);
        ss=p+strlen(s1);
        //p=strstr_(ss,s1);
        p=_strstr(ss,s1);
    }

    strcat(target,ss);
}


List CreateList(int data[],char *str1,char *str2)
{
    int isexist = 0;
    char *num,*name;
    num = NULL;
    name = NULL;
    List temp = pHead;
    List deltemp = pHead->next;
//printf("=2222222==%d======\n",isexist);
    while(NULL != deltemp)
    {//printf("==333333==%d====%d==\n",deltemp->line,data[1]);
        if(deltemp->line == data[1])
        {
            if(deltemp->state != data[0])
            {
                if(data[0] == 0 || data[0] == 8)
                {
                    temp->next = deltemp->next;
                    free(deltemp->num);
                    free(deltemp->name);
                    free(deltemp);
                }
                else
                {
                    //printf("....%s.........%s.....",num,name);
                    deltemp->state = data[0];
                    deltemp->acct = data[2];
                    deltemp->msg = data[3];
                    // if(strcmp(str1,"")!=0)
                    //     deltemp->num = str1;
                    // if(strcmp(str2,"")!=0)
                    //     deltemp->name = str2;
                }
            }
            isexist = 1;
        } 
        if(isexist == 1)                
            break;
        //printf("++++++++%d+++++++++\n",isexist);   
        
        deltemp = deltemp->next;   
        temp = temp->next;                             
    }

    if(isexist == 0)
    {//printf("==fufufufufufufufufu==\n");
        if(data[0] != 0 || data[0] != 8)
        {
            int len = 0;
            len = strlen(str1)+20;
            num = malloc(len);
            snprintf(num,len,str1);
            len = strlen(str2)+20;
            name = malloc(len);
            snprintf(name,len,str2);
            List pNew = (List)malloc(sizeof(Node));

            pNew->state = data[0];
            pNew->line = data[1];
            pNew->acct = data[2];
            pNew->msg = data[3];
            pNew->num = num;
            pNew->name = name;
            temp->next = pNew;
            pNew->next = NULL;
            temp = pNew;

            //printf("%s \n",pNew->num);
        }   
    }
    //printf("==================\n");
    
    return pHead;

}

//    遍历链表函数
/*
List TraverseList(List pHead,int line)
{
    int isexist = 0;
    printf("-----------------\n");
    List p = pHead->next;                            //将头节点的指针给予临时节点p
    List returnq = pHead;

    while(NULL != p)                                //节点p不为空，循环
    {
        printf("---------pHead--------\n");
        // if(p->line == line)
        // {
        //     isexist = 1;
        //     break;
        // }
        printf("state:%d,line:%d,acct:%d,msg:%d,num:%s,name:%s \n",p->state,p->line,p->acct,p->msg,p->num,p->name);                    
        p = p->next; 
        returnq = returnq->next;
    }
    printf("-----------------\n");
    printf("\n");
    return returnq;

} */

List freeList(List pHead)
{
    List deltemp = pHead->next;

    while(NULL != deltemp)
    {
        pHead->next = deltemp->next;
        free(deltemp->num);
        free(deltemp->name);
        free(deltemp);
        deltemp = pHead->next;
    }

    return pHead;
}

int init_conference(List pHead)
{
    int len = 0;
    char* sendData = NULL; 
    List temp = pHead->next;

    while(NULL != temp)
    {
        len = strlen(temp->name)+strlen(temp->num)+128;
        sendData = malloc(len);
        snprintf(sendData,len,"{\"type\":\"init\",\"state\":\"%d\",\"line\":\"%d\",\"acct\":\"%d\",\"msg\":\"%d\",\"num\":\"%s\",\"name\":\"%s\"},",temp->state,temp->line,temp->acct,temp->msg,temp->num,temp->name);   
        if(sock_web > 0 && open_cache == 0)
            send(sock_web,sendData, strlen(sendData),MSG_DONTWAIT);
        //printf("%s\n",sendData );
        free(sendData);
        temp = temp->next;
    }

    freeList(pHead);
}
