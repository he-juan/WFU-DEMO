#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <time.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <dirent.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <sys/vfs.h>
#include <sys/time.h> /* select() */ 
#define _GNU_SOURCE
#include <stdlib.h>
#include <stdio.h>
#include <sqlite3.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <fcntl.h>
#include <assert.h>
#include <net/if.h> 
#ifndef BUILD_RECOVER
#include <libxml/xmlmemory.h>
#include <libxml/parser.h>
#include <libxml/xmlerror.h>
#include <libxml/uri.h>
#include <libxml/entities.h>
#include <libxml/HTMLparser.h>
#include <libxml/xpath.h>
#endif
#include <strings.h>
#include <ctype.h>
#ifndef BUILD_RECOVER
#include <pthread.h>
#endif
#include "buffer.h"
#include "server.h"
#include "log.h"
#include "connections.h"

#ifdef BUILD_ON_ARM
#include "nvram.h"
#ifndef BUILD_RECOVER
#include <dbus/dbus.h>
#include "timezone_offset.h"
#endif

#endif
#include <stdbool.h>
#include "fdevent.h"

#include "request.h"
#include "response.h"
#include "network.h"
#include "http_chunk.h"
#include "stat_cache.h"
#include "joblist.h"

#include "plugin.h"

#include "inet_ntop_cache.h"

#include "md5.h"
#include <openssl/x509.h>
#include <openssl/x509v3.h>

#define HASHLEN 16
#define HASHHEXLEN 32
typedef unsigned char HASH[HASHLEN];
typedef char HASHHEX[HASHHEXLEN+1];

#ifdef BUILD_ON_ARM
#define PREFIX                           ""
#else
#define PREFIX                           "/home/target_QT"
#endif
#define PVALUENUM               320
#define COMMANDNUM              4

#define WEB_FACEBOOK            "http://api.facebook.com/restserver.php?api_key=09aacbfa33cf484fd2f2a9b898c0f6b4&method=auth.createToken&v=1.0&sig=2a03b3dbedb29344540850ce4dbdaf1d"
#define WEB_FACEBOOK_AUTH      "http://www.facebook.com/login.php?api_key=09aacbfa33cf484fd2f2a9b898c0f6b4&v=1.0&auth_token="
#define WEB_FACEBOOK_PRO       "http://www.facebook.com/connect/prompt_permissions.php?api_key=09aacbfa33cf484fd2f2a9b898c0f6b4&v=1.0&ext_perm=offline_access,read_stream,publish_stream"

#define APP_CONF_PATH                    PREFIX"/app/config"
#define APP_DATA_PATH                    PREFIX"/app/data"
#define APP_DATAFAV_PATH              PREFIX"/app/data/favorites"
#define TMP_FAVPATH                        PREFIX"/tmp/favorites"
#define DATA_DIR                        PREFIX"/data"
#define DATATMP_DIR                        PREFIX"/data/tmp"

#define CONF_CALLFUNC               APP_CONF_PATH"/Call/call.xml"
#define CONF_AUTOCONFIG               APP_CONF_PATH"/AutoConfig/autoconfig.xml"
#define CONF_RSSNEW               APP_CONF_PATH"/RSSNews/rssnews.xml"
#define CONF_BLF                 APP_CONF_PATH"/BLF/blf.xml"
#define CONF_COLORE                 APP_CONF_PATH"/ColorE/ColorELogin.xml"
#define CONF_WEATHER              APP_CONF_PATH"/Weather/weather.xml"
#define CONF_HWPHBK               APP_CONF_PATH"/HWPhonebook/huawei_server_api.xml"
#define CONF_LASTFM               APP_CONF_PATH"/LastFM/lastfm.xml"
#define CONF_GOOGLEVOICE            APP_CONF_PATH"/GoogleVoice/googlevoice.xml"
#define CONF_BOOKMARKS              APP_CONF_PATH"/Browser/download.xml"
#define CONF_SCREEN               APP_CONF_PATH"/SystemConfig/systemconfig.xml"
#define CONF_MENU                   APP_CONF_PATH"/MenuManager/menu.xml"
#define CONF_PHBKDOWNLOAD       "/data/data/com.android.contacts/shared_prefs/import_export_config.xml"
#define OLDLANGUAGE_PATH          APP_CONF_PATH"/language"
#define CONF_PTZ				"/data/data/com.android.settings/shared_prefs/camera_settings_params.xml"
#define CONF_MPK				"/data/data/com.base.module.mpk/shared_prefs/com.base.module.mpk.setting_shareprenferences.xml"
#define CONF_MPKEXT 		"/data/data/com.base.module.mpkext/shared_prefs/com.base.module.mpkext.setting_shareprenferences.xml"
#define CONF_SCHEDULE 		"/data/data/com.base.module.schedule/shared_prefs/schedule_settings.xml"
#define SYS_CONFIG_FILE                 APP_CONF_PATH"/SystemSetting/systemsettingmenuconfig.xml"
#define SYS_CONFIG_ACCT                         "0"
#define SYS_CONFIG_UPGRADE                  "1"

#define DATA_PHONEBOOK              APP_CONF_PATH"/Phonebook/Phonebook.xml"
#define DATA_BOOKMARKS              APP_CONF_PATH"/Browser/bookmarks.xml"
#define TMP_PHONEBOOKPATH         PREFIX"/sdcard/phonebook"
#define TMP_AUDIOFILEPATH		  PREFIX"/data/moh/account"
#define TMP_MESSAGEPATH           PREFIX"/sdcard/message"
#define TMP_CALLHISTORYPATH       PREFIX"/sdcard/callhistory"
#define TMP_GS_PHONEBOOK          TMP_PHONEBOOKPATH"/phonebook.xml"
#define TMP_BOOKMARKS                TMP_FAVPATH"/bookmarks.xml"

#define CONF_IM                      PREFIX"/data/.purple/accounts.xml"
#define CONF_IM_DIR                   PREFIX"/data/.purple"
#define VPN_PATH                           PREFIX"/data/openvpn"
#define DATA_PPP                           PREFIX"/data/ppp"
#define PCAP_PATH                           PREFIX"/sdcard/ppp"
#define DIR_802MODE                           PREFIX"/path"
#define PATH_802MODE                           PREFIX"/data/system/certs"
#define PATH_FRAME_CERT                     PREFIX"/data/framecomp"
#define TEMP_PVALUES                    PREFIX"/data/tmp/pvaluesCache"
#define TEMP_PATH              	       "/tmp"
#define TEMP_PVALUES_SH                    PREFIX"/tmp/set_pvalues.sh"
#define LANGUAGE_PATH             PREFIX"/app/config_flash/language"
#define RINGTONE_PATH             PREFIX"/app/ringtone"
#define TONELIST_PATH               "/system/media/audio/ringtones/"
#define NOTIFICATIONS_PATH               "/system/media/audio/notifications/"
#define FW_PATH              "/tmp/upgradefile"
#define FIFO_PATH              "/tmp/gparse.fifo"
#define CACHE_PATH       "/cache/"
#define FULL_UPGRADE_PATH       "/cache/fwupgradeall"
#define TMP_FULL_UPGRADE_PATH       "/tmp/fwupgradeall"
#define USB_DEVICE_PATH         "/sys/class/usb_device/"

#define DOWN_PHONEBOOK              "phonebook"
#define RECORING_PATH                      "/mnt/extsd/Recording"

#define JSON_TEMPLATE "var result = {\"Response\":\"%s\"%s};"

#define GUI_XML_PARSE_ATTR    (XML_PARSE_NOBLANKS |XML_PARSE_NOERROR | XML_PARSE_NOWARNING)

#define DBUS_PATH                 "/com/grandstream/dbus/gui"
#define DBUS_INTERFACE            "com.grandstream.dbus.signal"
#define SIGNAL_LIGHTTPD           "lighttpd"
#define SIGNAL_CALLUPDATED          "callfuncupdated"
#define SIGNAL_TVOUT              "tvout"
#define SIGNAL_FACTFUN            "factfun"
#define SIGNAL_CFUPDATED          "cfupdated"
#define SIGNAL_APPLYED          "applyed"

#define SIGNAL_VBRATEUPDATED          "video_bitrate_change"
#define SIGNAL_WIFI_CHANGED         "wifi_changed"
#define SIGNAL_WIFI_SCAN                    "wifi_scan"
#define SIGNAL_COLORE_CHANGE_PWD        "change_password"
#define SIGNAL_WEATHER_UPDATED          "weatherupdated"
#define SIGNAL_RSS_UPDATED              "rssupdated"
#define SIGNAL_BLFUPDATED           "blfupdated"
#define SIGNAL_MPKURIUPDATED        "blfuriupdated"
#define SIGNAL_MPKDATAUPDATED           "mpkdatachanged"
#define SIGNAL_MPKEXTDATAUPDATED	"extdatachanged"
#define SIGNAL_BLFREORDER           "sortchanged"
#define SIGNAL_BLFEXTREORDER 		"extsortchanged"
#define SIGNAL_BLFCOUNTUPDATED           "blfcountChanged"
#define SIGNAL_BLFNAMEUPDATED           "displayformatchanged"
#define SIGNAL_BLFFOLLOWUPDATED           "blfUrifollowChanged"
#define SIGNAL_URIBLFUPDATED           "uriblfupdated"
#define SIGNAL_PROXYUPDATED           "proxyChanged"
#define SIGNAL_CALLFORWARD              "callforward"
#define SIGNAL_IMPORT_CUSLANG              "importlan"
#define SIGNAL_CALLSTATUS_REPORT              "callstatus_report"
#define SIGNAL_CAMERACONTROL        "cam_ctrl"
#define SIGNAL_HDMI_OUTPUT        "hdmi_output"
#define SIGNAL_FECC_SAVE_LOCAL_PRESET     "local_camera_store_preset"
#define SIGNAL_FECC_GOTO_LOCAL_PRESET     "local_camera_activate_preset"
#define SIGNAL_FECC_SAVE_REMOTE_PRESET     "remote_camera_store_preset"
#define SIGNAL_FECC_GOTO_REMOTE_PRESET     "remote_camera_activate_preset"
#define TMP_CERT_PATH           "/tmp/upload_certs"
#define TMP_CERT                "/tmp/content_certs"
#define PROC_IF_INET6_PATH      "/proc/net/if_inet6"

//#define SIGNAL_LIGHTTPD_RSS_CHANGED             0
//#define SIGNAL_LIGHTTPD_WEATHER_CHANGED         1
//#define SIGNAL_LIGHTTPD_LAN_CHANGED             2
#define SIGNAL_LIGHTTPD_SCREEN_CHANGED          3
#define SIGNAL_LIGHTTPD_CAPTURE_ON              4
#define SIGNAL_LIGHTTPD_CAPTURE_OFF             5
#define SIGNAL_LIGHTTPD_TIMEZONE_CHANGED        6
//#define SIGNAL_LIGHTTPD_FACTREST                8
#define SIGNAL_ACCT1_TRANSFER_OFF               9
/*#define SIGNAL_ACCT1_TRANSFER_ON               10
#define SIGNAL_ACCT2_TRANSFER_OFF              11
#define SIGNAL_ACCT2_TRANSFER_ON               12
#define SIGNAL_ACCT3_TRANSFER_OFF              13
#define SIGNAL_ACCT3_TRANSFER_ON               14
*/
#define SIGNAL_ACCT1_AUTO_ANSWER_OFF           15
/*
#define SIGNAL_ACCT1_AUTO_ANSWER_ON            16
#define SIGNAL_ACCT2_AUTO_ANSWER_OFF           17
#define SIGNAL_ACCT2_AUTO_ANSWER_ON            18
#define SIGNAL_ACCT3_AUTO_ANSWER_OFF           19
#define SIGNAL_ACCT3_AUTO_ANSWER_ON            20
#define SIGNAL_LIGHTTPD_VOIP_FACRESET               21
#define SIGNAL_LIGHTTPD_USERDATA_FACRESET               22
*/
#define SIGNAL_LIGHTTPD_PHBKDOWN               25      /*with a 'down' suffix means download from internet*/
#define SIGNAL_LIGHTTPD_TONENAME               26
#define SIGNAL_LIGHTTPD_PHBKUPLOAD             27     /*with a 'up' or 'upload' suffix means download from localfile*/
#define SIGNAL_LIGHTTPD_RADIOFAVDOWN           28
/*#define SIGNAL_LIGHTTPD_RADIOFAVUPLOAD         29
#define SIGNAL_LIGHTTPD_YOUTUBEFAVDOWN         30
#define SIGNAL_LIGHTTPD_YOUTUBEFAVUPLOAD       31   //used by h323 autoanswer off
#define SIGNAL_LIGHTTPD_BOOKMARKUP             32       //used by h323 autoanswer on
#define SIGNAL_LIGHTTPD_WDPHOTOFAVUP           33
#define SIGNAL_LIGHTTPD_BOOKMARKSDOWN          34
#define SIGNAL_LIGHTTPD_WDPHOTOFAVDOWN         35
#define SIGNAL_LIGHTTPD_WEATHERFAVUP           39
#define SIGNAL_LIGHTTPD_WEATHERFAVDOWN          40
*/
#define SIGNAL_LIGHTTPD_PHBKDOWNLOADSAVE          41
//#define SIGNAL_LIGHTTPD_DOWNLOADSAVE            42

    
#define MTD_NANDFLASH		4
#define MEMGETINFO              _IOR('M', 1, struct mtd_info_user)
#define MEMERASE                _IOW('M', 2, struct erase_info_user)
#define MEMGETBADBLOCK		_IOW('M', 11, loff_t)
#define CONST_GCHAR_LEN(x) x, x ? strlen(x) : 0
#define SKYPE_VERSION     "1"

typedef struct mtd_info_user mtd_info_t;
typedef struct erase_info_user erase_info_t;

struct mtd_info_user {
	uint8_t type;
	uint32_t flags;
	uint32_t size;	 // Total size of the MTD
	uint32_t erasesize;
	uint32_t oobblock;  // Size of OOB blocks (e.g. 512)
	uint32_t oobsize;   // Amount of OOB data per block (e.g. 16)
	uint32_t ecctype;
	uint32_t eccsize;
};
struct erase_info_user {
	uint32_t start;
	uint32_t length;
};


#define DEBUGSWITCH 0
#ifndef SHA1_H
#define SHA1_H

#define INTERNAL_SHA1

#define SHA1_MAC_LEN 20

typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;

static char *dbus_path = "/com/grandstream/dbus/webservice";
static char *dbus_dest = "com.grandstream.dbus.gmi.server";
static char *dbus_interface = "com.grandstream.dbus.method";

void hmac_sha1_vector(const u8 *key, size_t key_len, size_t num_elem,
		      const u8 *addr[], const size_t *len, u8 *mac);
void hmac_sha1(const u8 *key, size_t key_len, const u8 *data, size_t data_len,
	       u8 *mac);
void pbkdf2_sha1(const char *passphrase, const char *ssid, size_t ssid_len,
		 int iterations, u8 *buf, size_t buflen);

struct SHA1Context;

void SHA1Init(struct SHA1Context *context);
void SHA1Update(struct SHA1Context *context, const void *data, u32 len);
void SHA1Final(unsigned char digest[20], struct SHA1Context *context);

#endif /* SHA1_H */

#ifdef USE_OPENSSL
# include <openssl/ssl.h>
# include <openssl/err.h>
#endif


#ifdef HAVE_SYS_FILIO_H
# include <sys/filio.h>
#endif

#include "sys-socket.h"

#ifndef BUILD_RECOVER
xmlChar * unhtmlize (xmlChar * string);
#endif

typedef struct {
	        PLUGIN_DATA;
} plugin_data;

char usercookie[80] = "";
char gmicookie[80] = "";
char usertype[80] = "";
char gmiusertype[80] = "";
char newloginuser[80] = "";
char curuser[80] = "";
time_t sessiontimeout = 0;
time_t gmisessiontimeout = 0;
#ifndef BUILD_RECOVER
ACCStatus accountstatus;
int phonerebooting = 0;
int capmode = 0;
int portphbkresponse = 1;
int phbkresponse = 1;
int radiofavresponse = 1;
int videofavresponse = 1;
int bookmarksrsps = 1;
int wdphotorsps = 1;
int weatherfavrsps = 1;
int chgcolorepwdrsps = 1;
int lan_reload_flag = 0;
int fxostatus = 1;
int fxocon = 0;
int wifiscanok = 0;
char *wifiscanresult = NULL;
int importlanrsps = -1;
int mpkextstartpvalue[5];
int passwrongtimes = 0;
int userpasswrongtimes = 0;
time_t lockoutime = 0;
time_t userlockoutime = 0;

int provision_local_fd;
int provision_ret;
int m_uploading = 0;
int m_upgradeall = 0;
const char *mRealm = NULL;
struct sockaddr_un provision_destaddr;
//pthread_cond_t changeinput_cond = PTHREAD_COND_INITIALIZER;

//void (*get_timezone_offset)(const char *ids[], const int n, long *result);
//void print_offset(buffer *b, long millis_offsets[], int n);

//#define SOFILE "libtimezone_offset.so"
char *ids[] = { "GMT","Pacific/Midway", "Pacific/Honolulu", "America/Anchorage",
                "America/Los_Angeles", "America/Tijuana","America/Phoenix", "America/Chihuahua", "America/Denver",
                "America/Costa_Rica", "America/Chicago", "America/Mexico_City", "America/Regina", "America/Bogota",
                "America/New_York", "America/Caracas", "America/Barbados", "America/Halifax", "America/Manaus",
                "America/Santiago", "America/St_Johns", "America/Sao_Paulo", "America/Argentina/Buenos_Aires",
                "America/Godthab", "America/Montevideo", "Atlantic/South_Georgia", "Atlantic/Azores", "Atlantic/Cape_Verde",
                "Africa/Casablanca", "Europe/London", "Europe/Amsterdam",
                "Europe/Belgrade", "Europe/Brussels", "Europe/Sarajevo", "Africa/Windhoek", "Africa/Brazzaville",
                "Asia/Amman", "Europe/Athens", "Asia/Beirut", "Africa/Cairo", "Europe/Helsinki",
                "Asia/Jerusalem", "Europe/Minsk", "Africa/Harare", "Asia/Baghdad",
                "Europe/Moscow", "Asia/Kuwait", "Africa/Nairobi", "Asia/Tehran", "Asia/Baku",
                "Asia/Tbilisi", "Asia/Yerevan", "Asia/Dubai", "Asia/Kabul", "Asia/Karachi",
                "Asia/Oral", "Asia/Yekaterinburg", "Asia/Calcutta", "Asia/Colombo", "Asia/Katmandu",
                "Asia/Almaty", "Asia/Rangoon", "Asia/Krasnoyarsk", "Asia/Bangkok",
                "Asia/Shanghai", "Asia/Hong_Kong", "Asia/Irkutsk",
                "Asia/Kuala_Lumpur", "Australia/Perth", "Asia/Taipei", "Asia/Seoul", "Asia/Tokyo",
                "Asia/Yakutsk", "Australia/Adelaide", "Australia/Darwin", "Australia/Brisbane", "Australia/Hobart",
                "Australia/Sydney", "Asia/Vladivostok", "Pacific/Guam", "Asia/Magadan", "Pacific/Majuro", 
                "Pacific/Auckland", "Pacific/Fiji", "Pacific/Tongatapu"
    };
    
#endif


#ifdef BUILD_ON_ARM
#ifndef BUILD_RECOVER
extern pthread_mutex_t dbusmutex;
extern DBusConnection* bus;
#endif
#endif

#ifndef BUILD_RECOVER
//extern GList  *pvalue_protect;
PvalueList *pvalue_protect = NULL;
PvalueList *command_protect = NULL;
static int dbus_send_lighttpd ( const int arg1 );
//static int dbus_send_tvout ( const int arg1 );
#endif

PvalueList *pvalue_cache = NULL;


extern char* MD5_string(char *string);

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


const char * strstr_ (const char *buf, const char *sub)
{
    const char *bp;
    const char *sp;

    if (!*sub)
        return buf;

    while (*buf)
    {
        bp = buf;
        sp = sub;
        do
        {
            if (!*sp)
            return buf;
        } while (*bp++ == *sp++);
        buf += 1;
    }
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

static int mysystem(char *cmd)
{
    char *targetcmd = NULL;
    int len = strlen(cmd) + 4;
    targetcmd = malloc(len);
    memset(targetcmd, 0, len);
    replace(cmd, "`", "", targetcmd);
    snprintf(cmd, len, "%s", targetcmd);
    memset(targetcmd, 0, len);
    replace(cmd, "$(", "", targetcmd);
    snprintf(cmd, len, "%s", targetcmd);
    free(targetcmd);
    return system(cmd);
}

static const char *msg_get_header(const struct message *m, char *var)
{
    char cmp[80];
    unsigned int x;

    snprintf(cmp, sizeof(cmp), "%s=", var);
    for (x = 0; x < m->hdrcount; x++) {
        if (!strncasecmp(cmp, m->headers[x], strlen(cmp))) {
            return m->headers[x] + strlen(cmp);
        }
    }

    return NULL;
}

static void uri_decode(char *s)
{
    char *o;
    unsigned int tmp;

    for (o = s; *s; s++, o++) {
        if (*s == '%' && strlen(s) > 2 && sscanf(s + 1, "%2x", &tmp) == 1) {
            /* have '%', two chars and correct parsing */
            *o = tmp;
            s += 2;	/* Will be incremented once more when we break out */
        } else /* all other cases, just copy */
            *o = *s;
    }
    *o = '\0';
}

static void json_handle(char *s)
{
    if (s == "" || s == NULL)
        return;
    char *o = malloc(strlen(s) + 1);
    memset(o, 0, strlen(s) + 1);
    memcpy(o, s, strlen(s));

    int count = 0;
    for (; *o; s++, o++)
    {
        switch(*o)
        {
            case '"':
                *s = '\\';
                *(++s) = '"';
                break;
            case '\'':
                *s = '\\';
                *(++s) = '\'';
                break;
            case '\\':
                *s = '\\';
                *(++s) = '\\';
                break;
            default:
                *s = *o;
                break;
        }
        count++;
    }
    *s = '\0';
    o -= count;
    free(o);
}

static int handle_checkneedapplyp(buffer *b)
{
    buffer_append_string(b, "Response=Success\r\n");

    if( pvalue_cache != NULL )
        buffer_append_string(b, "needapply=1\r\n");
    else
        buffer_append_string(b, "needapply=0\r\n");
    
    return 1;
}

static PvalueList *create_list_node(char *pvalue, char *data)
{
    PvalueList *newNode;
    newNode = (PvalueList *)malloc(sizeof(PvalueList));
    if (newNode == NULL)
    {
       printf("Memory allocation failure!\n");
       return NULL;
    }
    else
    {
       newNode->pvalue = strdup( pvalue );
       newNode->data = strdup( data );
       newNode->next = NULL;
    }
    
    return newNode;
}

static PvalueList* pvaluelist_append( PvalueList *head, char *pvalue, char *data )
{
    PvalueList *newNode = NULL;
    PvalueList *curPtr = head;
    PvalueList *prePtr = head;
    bool replaced  = FALSE;

    if (curPtr == NULL)
    {
        head = create_list_node(pvalue, data );
    }
    else
    {
        while ( curPtr != NULL )
        {
            if ( ( strcmp( curPtr->pvalue, pvalue ) == 0 ) )
            {
                free( curPtr->data );
                curPtr->data = strdup( data );
                replaced = TRUE;
                break;
            }
            prePtr = curPtr;
            curPtr = curPtr->next;
        }

        if ( !replaced && prePtr )
        {
            newNode = create_list_node(pvalue, data );
            newNode->next = NULL;
            prePtr->next = newNode;
        }
    }
    
    return head;
}


static char * pvaluelist_get( PvalueList *list, char *pvalue )
{
    char *value = NULL;

    PvalueList *p = list;
    while ( p != NULL )
    {
        if ( strcmp( p->pvalue, pvalue ) == 0 )
        {
            value = p->data;
            break;
        }

         p = p->next;
    }

    return value;
}

/*static int pvaluelist_find( PvalueList *list, char *pvalue )
{
    int find = 0;
    int pos = 0;

    PvalueList *p = list;
    while ( p != NULL )
    {
        pos++;
        if ( strcmp( p->pvalue, pvalue ) == 0 )
        {
            find = 1;
            break;
        }

         p = p->next;
    }

    return ( find == 1 ) ? pos : find;
}
*/

static const char *nvram_my_get( const char *var)
{
    char * value = "";
    if ( var != NULL )
    {
#ifdef BUILD_ON_ARM
        value = nvram_get( var );
#endif
        if ( value == NULL )
        {
            value = "";
        }
    }

    return value;
}

static int dbus_send_fecc_preset ( const char *signal, const int arg1, const int arg2 )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, signal);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INT32, &arg1, DBUS_TYPE_INT32, &arg2, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

static int dbus_send_hdmi_output ( const char *arg1, const int arg2, const int arg3 )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_HDMI_OUTPUT);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_STRING, &arg1, DBUS_TYPE_INT32, &arg2, DBUS_TYPE_INT32, &arg3, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

static int dbus_send_ptz_control ( const char *arg1, const int arg2, const int arg3, const int arg4, const int arg5 )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_CAMERACONTROL);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_STRING, &arg1, DBUS_TYPE_INT32, &arg2, DBUS_TYPE_INT32, &arg3, DBUS_TYPE_INT32, &arg4, DBUS_TYPE_INT32, &arg5, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

static int callback(void *NotUsed, int argc, char **argv, char **azColName){
    int i;
    printf("callback argc is %d\n", argc);
    for(i=0; i<argc; i++)
    {
        printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
    }
    printf("\n");
    return 0;
}

int sqlite_handle_contact(buffer *b, const struct message *m, const char *type)
{
    sqlite3 *db;
    int rc;
    sqlite3_stmt *stmt;
    char *phonenum = NULL, *disname = NULL, *targetname = NULL;

    char *sqlstr = NULL;
    const char *temp = NULL;
    int len = 1024;
    sqlstr = malloc(len);
    memset(sqlstr, 0, len);
    if( !strcasecmp(type, "contacts") ) {
        snprintf(sqlstr, len, "select contacts._id as contacts_id,raw_contacts._id as raw_contacts_id,raw_contacts.display_name as contact_display_name,data.phone,data.accountid,data._id,raw_contacts.chinese_pinyin as chinese_pinyin,raw_contacts.chinese_pinyin_first_letter as chinese_pinyin_first_letter,data.phonetype from contacts left join raw_contacts on contacts.name_raw_contact_id=raw_contacts._id left join (select _id, raw_contact_id,data1 as phone,data2 as phonetype,data11 as accountid from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on raw_contacts._id=data.raw_contact_id order by chinese_pinyin;");
    }
    else if( !strcasecmp(type, "contactinfo") ) {
        snprintf(sqlstr, len, "select _id, raw_contact_id,data1,data11 as accountid,mimetype_id,data2 from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/email_v2') or mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2');");
    }
    else if( !strcasecmp(type, "contactpinyin") ) {
        temp = msg_get_header(m, "rawid");
        if( temp == NULL ){
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            return -1;
        }
        snprintf(sqlstr, len, "select raw_contacts._id as raw_contacts_id,raw_contacts.chinese_pinyin as chinese_pinyin,raw_contacts.chinese_pinyin_first_letter as chinese_pinyin_first_letter from raw_contacts where _id=%d;", atoi(temp));
    }
    else if( !strcasecmp(type, "groups") ) {
        snprintf(sqlstr, len, "select groups._id as groupid, groups.title as groupname, data.raw_contact_id from groups left join (select data1 as groups_id,raw_contact_id from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/group_membership')) as data on groups._id=data.groups_id where groups.deleted=0;");
    }
    else if( !strcasecmp(type, "leftcalllogall") ) {
        temp = msg_get_header(m, "flag");
        if( temp != NULL && atoi(temp) == 1 ){
            const char *name = NULL;
            name = msg_get_header(m, "name");
            if( name == NULL ){
                buffer_append_string(b,"{\"Response\":\"Error\"}");
                return -1;
            }
            uri_decode((char*)name);
            snprintf(sqlstr, len, "select conf_log._id as calllog_id,conf_log.conf_name as name, conf_log.duration as duration, conf_log.start_time as date,0 as type,0 as isvideo, 1 as is_conference from conf_log where name=\"%s\" order by date desc;", name);
        }else{
            temp = msg_get_header(m, "logtype");
            if( temp == NULL ){
                buffer_append_string(b,"{\"Response\":\"Error\"}");
                return -1;
            }
            if( atoi(temp) == 0 ){
                snprintf(sqlstr, len, "select conf_log._id as calllog_id,conf_log.conf_name as name, conf_log.duration as duration, conf_log.start_time as date,-1 as type,conf_log.is_schedule as isvideo, 1 as is_conference, 0 as acctindex, conf_log._id as order1 from conf_log UNION ALL select calls._id as calllog_id,calls.number as name, calls.duration as duration, calls.date as date, calls.type as type, calls.media_type as isvideo, calls.group_id as is_conference, calls.gs_account as account, calls.number as order1 from calls where is_conference=0 order by date desc;");
            }else if( atoi(temp) == 4 ){
                snprintf(sqlstr, len, "select conf_log._id as calllog_id,conf_log.conf_name as name, conf_log.duration as duration, conf_log.start_time as date,0 as type,0 as isvideo, 1 as is_conference from conf_log group by name order by date desc;");
            }
        }
    }
    else if( !strcasecmp(type, "leftcalllogtype") ) {
        temp = msg_get_header(m, "logtype");
        if( temp == NULL ){
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            return -1;
        }
        snprintf(sqlstr, len, "select calls._id as calllog_id,calls.type as type,calls.name as name,calls.number as number,calls.duration as duration,calls.date as date,calls.is_conference as is_conference,calls.media_type as mediatype, calls.group_id as confid, calls.gs_account as account, raw_contacts.display_name as contactname from calls left join (select _id, raw_contact_id,data1 as contactnumber,data11 as contactacct from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on calls.number=data.contactnumber and calls.gs_account=data.contactacct left join raw_contacts on raw_contacts._id=data.raw_contact_id where calls.type=%d order by date desc;", atoi(temp));
    }
    else if( !strcasecmp(type, "leftcalllogname") ) {
        snprintf(sqlstr, len, "select calls._id as calllog_id,calls.name as name,raw_contacts.display_name as contactname from calls left join (select _id, raw_contact_id,data1 as contactnumber,data11 as contactacct from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on calls.number=data.contactnumber and calls.gs_account=data.contactacct left join raw_contacts on raw_contacts._id=data.raw_contact_id where calls.is_conference=0;");
    }
    else if( !strcasecmp(type, "confmember") ) {
        snprintf(sqlstr, len, "select conf_log._id as conflog_id,calls._id as logid, calls.number as number,calls.name as name,raw_contacts.display_name as contactname, calls.type as calltype, calls.duration as callduration, calls.date as calldate, calls.media_type as mediatype, calls.gs_account as account from conf_log left join calls on conf_log._id=calls.group_id and calls.is_conference=1 left join (select _id, raw_contact_id,data1 as contactnumber,data11 as contactacct from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on calls.number=data.contactnumber and calls.gs_account=data.contactacct left join raw_contacts on raw_contacts._id=data.raw_contact_id;");
    }
    else if( !strcasecmp(type, "calllog") ) {
        temp = msg_get_header(m, "flag");
        if( temp != NULL && atoi(temp) == 1 ){
            const char *number = NULL, *acct = NULL;
            number = msg_get_header(m, "number");
            if( number == NULL ){
                buffer_append_string(b,"{\"Response\":\"Error\"}");
                return -1;
            }
            int acctindex = 0;
            acct = msg_get_header(m, "account");
            if( acct != NULL ){
                acctindex = atoi(acct);
            }
            uri_decode((char*)number);
            const char *logtype = NULL;
            logtype = msg_get_header(m, "logtype");
            if( logtype != NULL && atoi(logtype) == 0 ){
                snprintf(sqlstr, len, "select calls._id as calllog_id,calls.type as type,calls.name as name,calls.number as number,calls.gs_account as account,calls.duration as duration,calls.date as date,calls.is_conference as is_conference,calls.media_type as mediatype, calls.group_id as confid, raw_contacts.display_name as contactname,conf_log.conf_name as confname from calls left join conf_log on calls.group_id=conf_log._id left join (select _id, raw_contact_id,data1 as contactnumber,data11 as contactacct from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on calls.number=data.contactnumber and calls.gs_account=data.contactacct left join raw_contacts on raw_contacts._id=data.raw_contact_id where number=\"%s\" and account=%d order by date desc;", number, acctindex);
            }else{
                snprintf(sqlstr, len, "select calls._id as calllog_id,calls.type as type,calls.name as name,calls.number as number,calls.gs_account as account,calls.duration as duration,calls.date as date,calls.is_conference as is_conference,calls.media_type as mediatype, calls.group_id as confid, raw_contacts.display_name as contactname,conf_log.conf_name as confname from calls left join conf_log on calls.group_id=conf_log._id left join (select _id, raw_contact_id,data1 as contactnumber,data11 as contactacct from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on calls.number=data.contactnumber and calls.gs_account=data.contactacct left join raw_contacts on raw_contacts._id=data.raw_contact_id where number=\"%s\" and type=3 and account=%d order by date desc;", number, acctindex);
            }
        }
        else if( temp != NULL && atoi(temp) == 2 ){
            //get all calls by latest,such as in schedule page
            snprintf(sqlstr, len, "select calls._id as calllog_id,calls.type as type,calls.name as name,calls.number as number,calls.gs_account as account,calls.duration as duration,calls.date as date,calls.is_conference as is_conference,calls.media_type as mediatype, calls.group_id as confid, raw_contacts.display_name as contactname from calls left join (select _id, raw_contact_id,data1 as contactnumber,data11 as contactacct from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on calls.number=data.contactnumber and calls.gs_account=data.contactacct left join raw_contacts on raw_contacts._id=data.raw_contact_id group by number order by date desc;");
        }
        else if( temp != NULL && atoi(temp) == 3 ){
            //get not conference calls by latest,such as in call page
            snprintf(sqlstr, len, "select calls._id as calllog_id,calls.type as type,calls.name as name,calls.number as number,calls.gs_account as account,calls.duration as duration,calls.date as date,calls.is_conference as is_conference,calls.media_type as mediatype, calls.group_id as confid, raw_contacts.display_name as contactname from calls left join (select _id, raw_contact_id,data1 as contactnumber,data11 as contactacct from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on calls.number=data.contactnumber and calls.gs_account=data.contactacct left join raw_contacts on raw_contacts._id=data.raw_contact_id where calls.is_conference=0 group by number order by date desc;");
        }
        else{
            const char *logtype = NULL;
            logtype = msg_get_header(m, "logtype");
            if( logtype == NULL ){
                buffer_append_string(b,"{\"Response\":\"Error\"}");
                return -1;
            }
            if( atoi(logtype) != 0 ){
                snprintf(sqlstr, len, "select calls._id as calllog_id,calls.type as type,calls.name as name,calls.number as number,calls.gs_account as account,calls.duration as duration,calls.date as date,calls.is_conference as is_conference,calls.media_type as mediatype, calls.group_id as confid, raw_contacts.display_name as contactname from calls left join (select _id, raw_contact_id,data1 as contactnumber,data11 as contactacct from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on calls.number=data.contactnumber and calls.gs_account=data.contactacct left join raw_contacts on raw_contacts._id=data.raw_contact_id where type=%d order by date desc;", atoi(logtype));
            }else{
                snprintf(sqlstr, len, "select calls._id as calllog_id,calls.type as type,calls.name as name,calls.number as number,calls.gs_account as account,calls.duration as duration,calls.date as date,calls.is_conference as is_conference,calls.media_type as mediatype, calls.group_id as confid, raw_contacts.display_name as contactname from calls left join (select _id, raw_contact_id,data1 as contactnumber,data11 as contactacct from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on calls.number=data.contactnumber and calls.gs_account=data.contactacct left join raw_contacts on raw_contacts._id=data.raw_contact_id order by date desc;");
            }
        }
    }
    else if( !strcasecmp(type, "conflogonly") ) {
        snprintf(sqlstr, len, "select conf_log._id as conflog_id,conf_log.conf_name as name,conf_log.duration as duration,conf_log.start_time as date from conf_log order by date desc;");
    }
    else if( !strcasecmp(type, "conflog") ) {
        snprintf(sqlstr, len, "select conf_log._id as conflog_id,conf_log.conf_name as confname,conf_log.duration as duration,conf_log.start_time as date,calls.number as number,calls.name as name,calls.gs_account as account,calls.group_id as conf_id,raw_contacts.display_name as contactname, calls.type as calltype, calls.duration as callduration, calls.date as calldate, calls.media_type as mediatype from conf_log left join calls on conf_log._id=calls.group_id and calls.is_conference=1 left join (select _id, raw_contact_id,data1 as contactnumber,data11 as contactacct from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/phone_v2')) as data on calls.number=data.contactnumber and calls.gs_account=data.contactacct left join raw_contacts on raw_contacts._id=data.raw_contact_id order by date desc;");
    }
    else if( !strcasecmp(type, "email") ) {
        snprintf(sqlstr, len, "select contacts._id as contacts_id,raw_contacts._id as raw_contacts_id,raw_contacts.display_name as contact_display_name,data.phone,data._id from contacts left join raw_contacts on contacts.name_raw_contact_id=raw_contacts._id left join (select _id, raw_contact_id,data1 as phone,data11 as accountid from data where mimetype_id=(select _id from mimetypes where mimetype='vnd.android.cursor.item/email_v2')) as data on raw_contacts._id=data.raw_contact_id;");
    }

    if( sqlstr == NULL || strlen(sqlstr) == 0 ){
        buffer_append_string(b,"{\"Response\":\"Error\"}");
        return -1;
    }
    printf("sqlite_handle_contact, sql str is %s\n", sqlstr);
    rc = sqlite3_open("/data/data/com.android.providers.contacts/databases/contacts2.db", &db);
    if( rc ){
        printf("Can't open database: %s\n", sqlite3_errmsg(db));
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        buffer_append_string(b,"{\"Response\":\"Success\",\"Data\":[]}");
        free(sqlstr);
        return -1;
    }
    rc= sqlite3_prepare_v2(db,sqlstr, strlen(sqlstr), &stmt,0);
    if( rc ){
        printf("Can't open statement: %s\n", sqlite3_errmsg(db));
        fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        buffer_append_string(b,"{\"Response\":\"Success\",\"Data\":[]}");
        free(sqlstr);
        return -1;
    }

    if( !strcasecmp(type, "leftcalllogall") || !strcasecmp(type, "leftcalllogtype") || !strcasecmp(type, "calllog") || !strcasecmp(type, "conflogonly") || !strcasecmp(type, "conflog")) {
        char *hourformat = NULL;
        hourformat = nvram_get ("122");
        buffer_append_string(b,"{\"Response\":\"Success\",\"Use24Hour\":\"");
        if( hourformat != NULL )
            buffer_append_string(b, hourformat);
        else
            buffer_append_string(b, "1");
        buffer_append_string(b, "\",\"Data\":[");
    }else{
        buffer_append_string(b,"{\"Response\":\"Success\",\"Data\":[");
    }


    int data1, data2, data3;
    char *res = NULL;
    int num = 0;

    if( !strcasecmp(type, "contacts") ) {
        int data4;
        char *pinyin, *pinyinfirst, *targetpinyin, *targetpinyinfirst, *targetnumber, *phonenumtype;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    //contact id
            data2 = sqlite3_column_int(stmt, 1);    //raw contact id
            disname = (char*)sqlite3_column_text(stmt,2);   //contact display name
            phonenum = (char*)sqlite3_column_text(stmt, 3);   //contact number
            data3 = sqlite3_column_int(stmt, 4);    //account index
            data4 = sqlite3_column_int(stmt, 5);    //dataid
            pinyin = (char*)sqlite3_column_text(stmt, 6);   //contact name pinyin
            pinyinfirst = (char*)sqlite3_column_text(stmt, 7);   //contact name pinyin
            phonenumtype = (char*)sqlite3_column_text(stmt, 8);    //contact number type

            if( disname == NULL ){
                printf("disname is null\n");
                continue;
            }
            if( phonenum == NULL ){
                printf("phonenum is null\n");
                //number may be empty for email contacts
                phonenum = "";
            }
            len = strlen(disname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            //replace(disname, "\\", "\\\\", targetname);
            //snprintf(disname, len, "%s", targetname);
            snprintf(targetname, len, "%s", disname);
            json_handle(targetname);
            //memset(targetname, 0, len);
            //replace(disname, "\"", "\\\"", targetname);

            len = strlen(phonenum) * 2;
            targetnumber = malloc(len);
            memset(targetnumber, 0, len);
            //replace(phonenum, "\"", "\\\"", targetnumber);
            snprintf(targetnumber, len, "%s", phonenum);
            json_handle(targetnumber);
            //memset(targetnumber, 0, len);
            //replace(phonenum, "\"", "\\\"", targetnumber);


            if( pinyin != NULL ){
                len = strlen(pinyin) * 2;
                targetpinyin = malloc(len);
                memset(targetpinyin, 0, len);
                snprintf(targetpinyin, len, "%s", pinyin);
                json_handle(targetpinyin);
                /*memset(targetpinyin, 0, len);
                replace(pinyin, "\\", "\\\\", targetpinyin);
                snprintf(pinyin, len, "%s", targetpinyin);
                memset(targetpinyin, 0, len);
                replace(pinyin, "\"", "\\\"", targetpinyin);*/
            }
            if( pinyinfirst != NULL ){
                len = strlen(pinyinfirst) * 2;
                targetpinyinfirst = malloc(len);
                memset(targetpinyinfirst, 0, len);
                snprintf(targetpinyinfirst, len, "%s", pinyinfirst);
                json_handle(targetpinyinfirst);
                /*replace(pinyinfirst, "\\", "\\\\", targetpinyinfirst);
                snprintf(pinyinfirst, len, "%s", targetpinyinfirst);
                memset(targetpinyinfirst, 0, len);
                replace(pinyinfirst, "\"", "\\\"", targetpinyinfirst);*/
            }
            len = strlen(targetname)+strlen(targetnumber)+256;
            if( pinyin != NULL ){
                len += strlen(targetpinyin);
            }
            if( pinyinfirst != NULL ){
                len += strlen(targetpinyinfirst);
            }
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"RawId\":\"%d\", \"Name\":\"%s\", \"Number\":\"%s\", \"AcctIndex\":\"%d\", \"DataId\":\"%d\", \"Pinyin\":\"%s\", \"PinyinFirst\":\"%s\", \"PhoneType\":\"%s\"}", data1, data2, targetname, targetnumber, data3, data4, pinyin == NULL ? "" : targetpinyin, pinyinfirst == NULL ? "" : targetpinyinfirst, phonenumtype);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"RawId\":\"%d\", \"Name\":\"%s\", \"Number\":\"%s\", \"AcctIndex\":\"%d\", \"DataId\":\"%d\", \"Pinyin\":\"%s\", \"PinyinFirst\":\"%s\", \"PhoneType\":\"%s\"}", data1, data2, targetname, targetnumber, data3, data4, pinyin == NULL ? "" : targetpinyin, pinyinfirst == NULL ? "" : targetpinyinfirst, phonenumtype);
            buffer_append_string(b, res);
            //printf("%10d %10d %10s %10s %10d\n", data1, data2, targetname, phonenum, data3);
            free(res);
            free(targetname);
            free(targetnumber);
            if( pinyin != NULL )
                free(targetpinyin);
            if( pinyinfirst != NULL )
                free(targetpinyinfirst);
            num ++;
        }
    }else if( !strcasecmp(type, "contactinfo") ) {
        int data4, data5;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    //data id
            data2 = sqlite3_column_int(stmt, 1);    //raw_contact_id
            disname = (char*)sqlite3_column_text(stmt,2);//email or number or groupid
            data3 = sqlite3_column_int(stmt, 3);    //account index
            data4 = sqlite3_column_int(stmt, 4);    //mimetype
            data5 = sqlite3_column_int(stmt, 5);    //email or number type
            if( disname == NULL ){
                printf("disname is null\n");
                continue;
            }
            len = strlen(disname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            snprintf(targetname, len, "%s", disname);
            json_handle(targetname);
            /*replace(disname, "\\", "\\\\", targetname);
            snprintf(disname, len, "%s", targetname);
            memset(targetname, 0, len);
            replace(disname, "\"", "\\\"", targetname);*/

            len = strlen(targetname)+128;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"RawId\":\"%d\", \"Info\":\"%s\", \"AcctIndex\":\"%d\", \"InfoType\":\"%d\", \"DataType\":\"%d\"}", data1, data2, targetname, data3, data5, data4);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"RawId\":\"%d\", \"Info\":\"%s\", \"AcctIndex\":\"%d\", \"InfoType\":\"%d\", \"DataType\":\"%d\"}", data1, data2, targetname, data3, data5, data4);
            
            buffer_append_string(b, res);

            //printf("%10d %10d %10s\n", data1, data2, targetname);
            free(res);
            free(targetname);
            num ++;
        }
    }else if( !strcasecmp(type, "contactpinyin") ) {
        char *pinyin, *pinyinfirst, *targetpinyin, *targetpinyinfirst;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    //raw contact id
            pinyin = (char*)sqlite3_column_text(stmt, 1);   //contact name pinyin
            pinyinfirst = (char*)sqlite3_column_text(stmt, 2);   //contact name pinyin

            if( pinyin != NULL ){
                len = strlen(pinyin) * 2;
                targetpinyin = malloc(len);
                memset(targetpinyin, 0, len);
                replace(pinyin, "\"", "\\\"", targetpinyin);
                len += strlen(targetpinyin);
            }
            if( pinyinfirst != NULL ){
                len = strlen(pinyinfirst) * 2;
                targetpinyinfirst = malloc(len);
                memset(targetpinyinfirst, 0, len);
                replace(pinyinfirst, "\"", "\\\"", targetpinyinfirst);
                len += strlen(targetpinyinfirst);
            }
            len = 128;
            if( pinyin != NULL ){
                len += strlen(targetpinyin);
            }
            if( pinyinfirst != NULL ){
                len += strlen(targetpinyinfirst);
            }
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"RawId\":\"%d\", \"Pinyin\":\"%s\", \"PinyinFirst\":\"%s\"}", data1, pinyin == NULL ? "" : targetpinyin, pinyinfirst == NULL ? "" : targetpinyinfirst);
            else
                snprintf(res, len, ",{\"RawId\":\"%d\", \"Pinyin\":\"%s\", \"PinyinFirst\":\"%s\"}", data1, pinyin == NULL ? "" : targetpinyin, pinyinfirst == NULL ? "" : targetpinyinfirst);
            buffer_append_string(b, res);
            free(res);
            if( pinyin != NULL )
                free(targetpinyin);
            if( pinyinfirst != NULL )
                free(targetpinyinfirst);
            num ++;
        }
    }else if( !strcasecmp(type, "groups") ) {
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    //group id
            disname = (char*)sqlite3_column_text(stmt,1);//group name
            data2 = sqlite3_column_int(stmt, 2);    //raw_contact_id
            if( disname == NULL ){
                printf("disname is null\n");
                continue;
            }
            len = strlen(disname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            snprintf(targetname, len, "%s", disname);
            json_handle(targetname);
            /*replace(disname, "\\", "\\\\", targetname);
            snprintf(disname, len, "%s", targetname);
            memset(targetname, 0, len);
            replace(disname, "\"", "\\\"", targetname);*/

            len = strlen(targetname)+128;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Name\":\"%s\", \"ContactId\":\"%d\"}", data1, targetname, data2);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Name\":\"%s\", \"ContactId\":\"%d\"}", data1, targetname, data2);
            buffer_append_string(b, res);
            //printf("%10d %10d %10s\n", data1, data2, targetname);
            free(res);
            free(targetname);
            num ++;
        }
    }else if( !strcasecmp(type, "leftcalllogall") ) {
        char *logdate;
        int data4, data5, data6;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    //calllog id
            disname = (char*)sqlite3_column_text(stmt,1);   //calllog name or number
            data2 = sqlite3_column_int(stmt, 2); //calllog duration
            logdate = (char*)sqlite3_column_text(stmt, 3);//calllog date
            data3 = sqlite3_column_int(stmt, 4);    //calllog type
            data4 = sqlite3_column_int(stmt, 5);    //calllog is video
            data5 = sqlite3_column_int(stmt, 6);    //is conf
            data6 = sqlite3_column_int(stmt, 7);    //calllog account index

            if( disname == NULL ) continue;

            len = strlen(disname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            snprintf(targetname, len, "%s", disname);
            json_handle(targetname);
            /*replace(disname, "\\", "\\\\", targetname);
            snprintf(disname, len, "%s", targetname);
            memset(targetname, 0, len);
            replace(disname, "\"", "\\\"", targetname);*/

            len = strlen(targetname)+strlen(logdate)+256;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"NameOrNumber\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\", \"Type\":\"%d\", \"IsVideo\":\"%d\", \"IsConf\":\"%d\", \"Account\":\"%d\"}", data1, targetname, data2, logdate, data3, data4, data5, data6);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"NameOrNumber\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\", \"Type\":\"%d\", \"IsVideo\":\"%d\", \"IsConf\":\"%d\", \"Account\":\"%d\"}", data1, targetname, data2, logdate, data3, data4, data5, data6);
            buffer_append_string(b, res);
            //printf("%10d %10d %10s %10s %10d %10d %10s %10s\n", data1, data2, targetname, phonenum, data3, data4, logdate, disname2 == NULL ? "" : targetname2);
            free(res);
            free(targetname);
            num ++;
        }
    }else if( !strcasecmp(type, "leftcalllogtype") ) {
        char *logdate, *disname2;
        int data4, data5, data6, data7;
        int iscontact = 0;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            /*if( num % 3 != 0 ){
                num ++;
                continue;
            }*/
            data1 = sqlite3_column_int(stmt, 0);    //calllog id
            data2 = sqlite3_column_int(stmt, 1);    //calllog type
            disname = (char*)sqlite3_column_text(stmt,2);
            phonenum = (char*)sqlite3_column_text(stmt, 3);
            data3 = sqlite3_column_int(stmt, 4);    //calllog duration
            logdate = (char*)sqlite3_column_text(stmt, 5);//calllog date
            data4 = sqlite3_column_int(stmt, 6);    //is conf
            data5 = sqlite3_column_int(stmt, 7);    //is video
            data6 = sqlite3_column_int(stmt, 8);    //conf id
            data7 = sqlite3_column_int(stmt, 9);    //calllog account
            disname2 = sqlite3_column_text(stmt, 10);    //contact name

            if( phonenum == NULL ) continue;
            if( disname2 == NULL ){
                iscontact = 0;
                if( disname == NULL ){
                    len = strlen(phonenum) * 2;
                    targetname = malloc(len);
                    memset(targetname, 0, len);
                    snprintf(targetname, len, "%s", phonenum);
                    json_handle(targetname);
                    /*replace(phonenum, "\\", "\\\\", targetname);
                    snprintf(phonenum, len, "%s", targetname);
                    memset(targetname, 0, len);
                    replace(phonenum, "\"", "\\\"", targetname);*/
                }else{
                    len = strlen(disname) * 2;
                    targetname = malloc(len);
                    memset(targetname, 0, len);
                    snprintf(targetname, len, "%s", disname);
                    json_handle(targetname);
                    /*replace(disname, "\\", "\\\\", targetname);
                    snprintf(disname, len, "%s", targetname);
                    memset(targetname, 0, len);
                    replace(disname, "\"", "\\\"", targetname);*/
                }
            }else{
                iscontact = 1;
                len = strlen(disname2) * 2;
                targetname = malloc(len);
                memset(targetname, 0, len);
                snprintf(targetname, len, "%s", disname2);
                json_handle(targetname);
                /*replace(disname2, "\\", "\\\\", targetname);
                snprintf(disname2, len, "%s", targetname);
                memset(targetname, 0, len);
                replace(disname2, "\"", "\\\"", targetname);*/
            }


            len = strlen(targetname)+strlen(phonenum)+strlen(logdate)+256;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Type\":\"%d\", \"Name\":\"%s\", \"Number\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\", \"IsConf\":\"%d\", \"IsVideo\":\"%d\", \"ConfId\":\"%d\", \"Account\":\"%d\", \"IsContact\":\"%d\"}", data1, data2, targetname, phonenum, data3, logdate, data4, data5, data6, data7, iscontact);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Type\":\"%d\", \"Name\":\"%s\", \"Number\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\", \"IsConf\":\"%d\", \"IsVideo\":\"%d\", \"ConfId\":\"%d\", \"Account\":\"%d\", \"IsContact\":\"%d\"}", data1, data2, targetname, phonenum, data3, logdate, data4, data5, data6, data7, iscontact);
            buffer_append_string(b, res);
            //printf("%10d %10d %10s %10s %10d %10d %10s %10s\n", data1, data2, targetname, phonenum, data3, data4, logdate, disname2 == NULL ? "" : targetname2);
            free(res);
            free(targetname);
            num ++;
        }
    }else if( !strcasecmp(type, "leftcalllogname") ) {
        char *disname2;
        int iscontact = 0;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    //calllog id
            disname = (char*)sqlite3_column_text(stmt,1);   //calllog name
            disname2 = (char*)sqlite3_column_text(stmt,2);    //contact name

            if( disname2 == NULL ){
                iscontact = 0;
                if( disname == NULL ){
                    printf("disname is null\n");
                }else{
                    len = strlen(disname) * 2;
                    targetname = malloc(len);
                    memset(targetname, 0, len);
                    snprintf(targetname, len, "%s", disname);
                    json_handle(targetname);
                    /*replace(disname, "\\", "\\\\", targetname);
                    snprintf(disname, len, "%s", targetname);
                    memset(targetname, 0, len);
                    replace(disname, "\"", "\\\"", targetname);*/
                }
            }else{
                iscontact = 1;
                len = strlen(disname2) * 2;
                targetname = malloc(len);
                memset(targetname, 0, len);
                snprintf(targetname, len, "%s", disname2);
                json_handle(targetname);
                /*replace(disname2, "\\", "\\\\", targetname);
                snprintf(disname2, len, "%s", targetname);
                memset(targetname, 0, len);
                replace(disname2, "\"", "\\\"", targetname);*/
            }

            len = 128;
            if( targetname != NULL ){
                len += strlen(targetname);
            }
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Name\":\"%s\", \"IsContact\":\"%d\"}", data1, targetname == NULL ? "" : targetname, iscontact);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Name\":\"%s\", \"IsContact\":\"%d\"}", data1, targetname == NULL ? "" : targetname, iscontact);
            buffer_append_string(b, res);
            free(res);
            if( targetname != NULL ){
                //printf("%10d %s\n", data1, targetname);
                free(targetname);
                targetname = NULL;
            }
            num ++;
        }
    }else if( !strcasecmp(type, "confmember") ) {
        char *disname2, *memberdate;
        int data4, data5, iscontact, data6;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            //printf("num = %d\n", num);
            data1 = sqlite3_column_int(stmt, 0);    //conflog id
            data2 = sqlite3_column_int(stmt, 1);    //conf member log id
            phonenum = (char*)sqlite3_column_text(stmt, 2); //member number
            disname = (char*)sqlite3_column_text(stmt,3);   //member name
            disname2 = (char*)sqlite3_column_text(stmt, 4);//member contact name
            data3 = sqlite3_column_int(stmt, 5);    //member type
            data4 = sqlite3_column_int(stmt, 6);    //member duration
            memberdate = (char*)sqlite3_column_text(stmt, 7);//member date
            data5 = sqlite3_column_int(stmt, 8);    //is video
            data6 = sqlite3_column_int(stmt, 9);    //member account

            if( phonenum == NULL ){
                printf("phonenum is null\n");
                continue;
            }
            if( memberdate == NULL ){
                printf("memberdate is null\n");
                continue;
            }
            if( disname2 == NULL ){
                iscontact = 0;
                if( disname == NULL ){
                    printf("disname is null\n");
                }else{
                    len = strlen(disname) * 2;
                    targetname = malloc(len);
                    memset(targetname, 0, len);
                    snprintf(targetname, len, "%s", disname);
                    json_handle(targetname);
                    /*replace(disname, "\\", "\\\\", targetname);
                    snprintf(disname, len, "%s", targetname);
                    memset(targetname, 0, len);
                    replace(disname, "\"", "\\\"", targetname);*/
                }
            }else{
                iscontact = 1;
                len = strlen(disname2) * 2;
                targetname = malloc(len);
                memset(targetname, 0, len);
                snprintf(targetname, len, "%s", disname2);
                json_handle(targetname);
                /*replace(disname2, "\\", "\\\\", targetname);
                snprintf(disname2, len, "%s", targetname);
                memset(targetname, 0, len);
                replace(disname2, "\"", "\\\"", targetname);*/
            }

            len = strlen(phonenum)+strlen(memberdate)+256;
            if( targetname != NULL ){
                len += strlen(targetname);
            }
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"LogId\":\"%d\", \"Number\":\"%s\", \"Name\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\", \"Type\":\"%d\", \"IsVideo\":\"%d\", \"IsContact\":\"%d\", \"Account\":\"%d\"}", data1, data2, phonenum, targetname == NULL ? "" : targetname, data4, memberdate, data3, data5, iscontact, data6);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"LogId\":\"%d\", \"Number\":\"%s\", \"Name\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\", \"Type\":\"%d\", \"IsVideo\":\"%d\", \"IsContact\":\"%d\", \"Account\":\"%d\"}", data1, data2, phonenum, targetname == NULL ? "" : targetname, data4, memberdate, data3, data5, iscontact, data6);
            buffer_append_string(b, res);
            num ++;
            //printf("%10d %10d %10d %16s %16s %32s %16s\n", data1, data3, data2, logdate, phonenum, targetname, targetname2);

            free(res);
            if( targetname != NULL ){
                free(targetname);
                targetname = NULL;
            }
        }
    }else if( !strcasecmp(type, "calllog") ) {
        char *logdate, *disname2, *targetname2, *confname, *targetconfname;
        int data4, data5, data6, data7, len2;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            /*if( num % 3 != 0 ){
                num ++;
                continue;
            }*/
            data1 = sqlite3_column_int(stmt, 0);    //calllog id
            data2 = sqlite3_column_int(stmt, 1);    //calllog type
            disname = (char*)sqlite3_column_text(stmt,2);
            phonenum = (char*)sqlite3_column_text(stmt, 3);
            data3 = sqlite3_column_int(stmt, 4);    //calllog account
            data4 = sqlite3_column_int(stmt, 5);    //calllog duration
            logdate = (char*)sqlite3_column_text(stmt, 6);//calllog date
            data5 = sqlite3_column_int(stmt, 7);    //is conf
            data6 = sqlite3_column_int(stmt, 8);    //is video
            data7 = sqlite3_column_int(stmt, 9);    //conf id
            disname2 = sqlite3_column_text(stmt, 10);    //contact name
            confname = sqlite3_column_text(stmt, 11);    //in conf name

            if( phonenum == NULL ) continue;
            if( disname == NULL ){
                len = strlen(phonenum) + 8;
                disname = malloc(len);
                memset(disname, 0, len);
                snprintf(disname, len, "%s", phonenum);
            }
            len = strlen(disname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            snprintf(targetname, len, "%s", disname);
            json_handle(targetname);
            /*replace(disname, "\\", "\\\\", targetname);
            snprintf(disname, len, "%s", targetname);
            memset(targetname, 0, len);
            replace(disname, "\"", "\\\"", targetname);*/

            len = strlen(targetname)+strlen(phonenum)+strlen(logdate)+256;
            if( disname2 != NULL ){
                len2 = strlen(disname2) * 2;
                targetname2 = malloc(len2);
                memset(targetname2, 0, len2);
                snprintf(targetname2, len2, "%s", disname2);
                json_handle(targetname2);
                /*replace(disname2, "\\", "\\\\", targetname2);
                snprintf(disname2, len2, "%s", targetname2);
                memset(targetname2, 0, len2);
                replace(disname2, "\"", "\\\"", targetname2);*/
                len += strlen(targetname2);
            }
            if( confname != NULL ){
                len2 = strlen(confname) * 2;
                targetconfname = malloc(len2);
                memset(targetconfname, 0, len2);
                snprintf(targetconfname, len, "%s", confname);
                json_handle(targetconfname);
                /*replace(confname, "\\", "\\\\", targetconfname);
                snprintf(confname, len2, "%s", targetconfname);
                memset(targetconfname, 0, len2);
                replace(confname, "\"", "\\\"", targetconfname);*/
                len += strlen(targetconfname);
            }
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Type\":\"%d\", \"Name\":\"%s\", \"Number\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\", \"AcctIndex\":\"%d\", \"IsConf\":\"%d\", \"IsVideo\":\"%d\", \"ContactName\":\"%s\", \"ConfId\":\"%d\", \"IsContact\":\"%d\", \"Confname\":\"%s\"}", data1, data2, targetname, phonenum, data4, logdate, data3, data5, data6, disname2 == NULL ? "" : targetname2, data7, disname2 == NULL ? 0 : 1, confname == NULL ? "" : targetconfname);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Type\":\"%d\", \"Name\":\"%s\", \"Number\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\", \"AcctIndex\":\"%d\", \"IsConf\":\"%d\", \"IsVideo\":\"%d\", \"ContactName\":\"%s\", \"ConfId\":\"%d\", \"IsContact\":\"%d\", \"Confname\":\"%s\"}", data1, data2, targetname, phonenum, data4, logdate, data3, data5, data6, disname2 == NULL ? "" : targetname2, data7, disname2 == NULL ? 0 : 1, confname == NULL ? "" : targetconfname);
            buffer_append_string(b, res);
            //printf("%10d %10d %10s %10s %10d %10d %10s %10s\n", data1, data2, targetname, phonenum, data3, data4, logdate, disname2 == NULL ? "" : targetname2);
            free(res);
            free(targetname);
            if( disname2 != NULL )
                free(targetname2);
            if( confname != NULL )
                free(targetconfname);
            num ++;
        }
    }else if( !strcasecmp(type, "conflogonly") ) {
        char *logdate;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    //conflog id
            disname = (char*)sqlite3_column_text(stmt,1);   //conf name
            data2 = sqlite3_column_int(stmt, 2);    //conflog duration
            logdate = (char*)sqlite3_column_text(stmt, 3);//conflog date

            if( disname == NULL ){
                printf("disname is null\n");
                continue;
            }
            if( logdate == NULL ){
                printf("logdate is null\n");
                continue;
            }
            len = strlen(disname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            snprintf(targetname, len, "%s", disname);
            json_handle(targetname);
            /*replace(disname, "\\", "\\\\", targetname);
            snprintf(disname, len, "%s", targetname);
            memset(targetname, 0, len);
            replace(disname, "\"", "\\\"", targetname);*/

            len = strlen(targetname)+strlen(logdate)+128;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Confname\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\"}", data1, targetname, data2, logdate);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Confname\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\"}", data1, targetname, data2, logdate);
            buffer_append_string(b, res);
            num ++;
            printf("%10d %10d %16s %16s\n", data1, data2, logdate, targetname);
            free(res);
            free(targetname);
        }
    }else if( !strcasecmp(type, "conflog") ) {
        char *logdate, *phonename, *disname2, *targetname2, *memberdate, *phonename2;
        int len2, data4, data5, data6;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            printf("num = %d\n", num);
            data1 = sqlite3_column_int(stmt, 0);    //conflog id
            disname = (char*)sqlite3_column_text(stmt,1);
            data2 = sqlite3_column_int(stmt, 2);    //conflog duration
            logdate = (char*)sqlite3_column_text(stmt, 3);//conflog date
            phonenum = (char*)sqlite3_column_text(stmt, 4); //contact number
            phonename = (char*)sqlite3_column_text(stmt, 5);//contact name from server
            data3 = sqlite3_column_int(stmt, 6);    //contact account index
            disname2 = (char*)sqlite3_column_text(stmt, 8);//member contact name
            data4 = sqlite3_column_int(stmt, 9);    //member type
            data5 = sqlite3_column_int(stmt, 10);    //member duration
            memberdate = (char*)sqlite3_column_text(stmt, 11);//member date
            data6 = sqlite3_column_int(stmt, 12);    //is video

            if( disname == NULL ){
                printf("disname is null\n");
                continue;
            }
            if( phonenum == NULL ){
                printf("phonenum is null\n");
                continue;
            }
            if( phonename == NULL ){
                printf("phonename is null\n");
                continue;
            }
            if( logdate == NULL ){
                printf("logdate is null\n");
                continue;
            }
            if( memberdate == NULL ){
                printf("memberdate is null\n");
                continue;
            }
            len = strlen(disname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            snprintf(targetname, len, "%s", disname);
            json_handle(targetname);
            /*replace(disname, "\\", "\\\\", targetname);
            snprintf(disname, len, "%s", targetname);
            memset(targetname, 0, len);
            replace(disname, "\"", "\\\"", targetname);*/

            len = strlen(targetname)+strlen(phonenum)+strlen(logdate)+strlen(memberdate)+256;
            if( disname2 != NULL ){
                len2 = strlen(disname2) * 2;
                targetname2 = malloc(len2);
                memset(targetname2, 0, len2);
                snprintf(targetname2, len2, "%s", disname2);
                json_handle(targetname2);
                /*replace(disname2, "\\", "\\\\", targetname2);
                snprintf(disname2, len2, "%s", targetname2);
                memset(targetname2, 0, len2);
                replace(disname2, "\"", "\\\"", targetname2);*/
                len += strlen(targetname2);
            }else{
                //printf("contact name is null, phonename = %s\n", phonename);
                len2 = strlen(phonename) * 2;
                targetname2 = malloc(len2);
                memset(targetname2, 0, len2);
                snprintf(targetname2, len2, "%s", phonename);
                json_handle(targetname2);
                //replace(phonename, "\"", "\\\"", targetname2);
                len += strlen(targetname2);
            }
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Confname\":\"%s\", \"AcctIndex\":\"%d\", \"Number\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\", \"ContactName\":\"%s\", \"CallType\":\"%d\", \"CallDuration\":\"%d\", \"CallDate\":\"%s\", \"IsVideo\":\"%d\"}", data1, targetname, data3, phonenum, data2, logdate, targetname2, data4, data5, memberdate, data6);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Confname\":\"%s\", \"AcctIndex\":\"%d\", \"Number\":\"%s\", \"Duration\":\"%d\", \"Date\":\"%s\", \"ContactName\":\"%s\", \"CallType\":\"%d\", \"CallDuration\":\"%d\", \"CallDate\":\"%s\", \"IsVideo\":\"%d\"}", data1, targetname, data3, phonenum, data2, logdate, targetname2, data4, data5, memberdate, data6);
            buffer_append_string(b, res);
            num ++;
            //printf("%10d %10d %10d %16s %16s %32s %16s\n", data1, data3, data2, logdate, phonenum, targetname, targetname2);
            free(res);
            free(targetname);
            free(targetname2);
        }
    }else if( !strcasecmp(type, "email") ) {
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0); //contact_id
            data2 = sqlite3_column_int(stmt, 1); //raw_contact_id
            disname = (char*)sqlite3_column_text(stmt,2);
            phonenum = (char*)sqlite3_column_text(stmt, 3);
            data3 = sqlite3_column_int(stmt, 4);

            if( disname == NULL ){
                printf("disname is null\n");
                continue;
            }
            if( phonenum == NULL ){
                printf("phonenum is null\n");
                continue;
            }
            len = strlen(disname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            snprintf(targetname, len, "%s", disname);
            json_handle(targetname);
            /*replace(disname, "\\", "\\\\", targetname);
            snprintf(disname, len, "%s", targetname);
            memset(targetname, 0, len);
            replace(disname, "\"", "\\\"", targetname);*/

            len = strlen(targetname)+strlen(phonenum)+64;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Name\":\"%s\", \"Email\":\"%s\", \"DataId\":\"%d\"}", data2, targetname, phonenum, data3);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Name\":\"%s\", \"Email\":\"%s\", \"DataId\":\"%d\"}", data2, targetname, phonenum, data3);
            buffer_append_string(b, res);
            //printf("%10d %10d %10s %10s %10d\n", data1, data2, targetname, phonenum, data3);
            free(res);
            free(targetname);
            num ++;
        }
    }

    printf("done for %s, num=%d\n",type, num);
    buffer_append_string(b, "]}");
    sqlite3_finalize(stmt);
    sqlite3_close(db);
    free(sqlstr);
    return 1;
}

int sqlite_handle_settings(buffer *b, const struct message *m, const char *type)
{
    sqlite3 *db;
    int rc;
    sqlite3_stmt *stmt;
    char *content, *disname;

    char *sqlstr = NULL;
    const char *temp = NULL;
    int len = 1024;
    sqlstr = malloc(len);
    memset(sqlstr, 0, len);
    if( !strcasecmp(type, "caption") ) {
        temp = msg_get_header(m, "type");
        if( temp == NULL ){
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            return -1;
        }
        snprintf(sqlstr, len, "select caption._id as id,caption.type as type,caption.caption_name as name,caption.caption_content as content from caption where type=%d;", atoi(temp));
    }

    if( sqlstr == NULL || strlen(sqlstr) == 0 ){
        buffer_append_string(b,"{\"Response\":\"Error\"}");
        return -1;
    }
    printf("sqlite_handle_settings, sql str is %s\n", sqlstr);
    rc = sqlite3_open("/data/data/com.android.providers.settings/databases/settings.db", &db);
    if( rc ){
        printf("Can't open database: %s\n", sqlite3_errmsg(db));
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        buffer_append_string(b,"{\"Response\":\"Success\",\"Data\":[]}");
        free(sqlstr);
        return -1;
    }
    rc= sqlite3_prepare_v2(db,sqlstr, strlen(sqlstr), &stmt,0);
    if( rc ){
        printf("Can't open statement: %s\n", sqlite3_errmsg(db));
        fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        buffer_append_string(b,"{\"Response\":\"Success\",\"Data\":[]}");
        free(sqlstr);
        return -1;
    }
    buffer_append_string(b,"{\"Response\":\"Success\",\"Data\":[");

    int data1, data2;
    char *res = NULL;
    int num = 0;

    if( !strcasecmp(type, "caption") ) {
        char *targetname, *targetcontent;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    // id
            data2 = sqlite3_column_int(stmt, 1);    //type
            disname = (char*)sqlite3_column_text(stmt,2);   //display name
            content = (char*)sqlite3_column_text(stmt, 3);   //content

            if( disname == NULL ){
                printf("disname is null\n");
                continue;
            }
            if( content == NULL ){
                printf("content is null\n");
                continue;
            }
            len = strlen(disname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            replace(disname, "\"", "\\\"", targetname);

            len = strlen(content) * 2;
            targetcontent = malloc(len);
            memset(targetcontent, 0, len);
            replace(content, "\"", "\\\"", targetcontent);

            len = strlen(targetname)+strlen(targetcontent)+128;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Type\":\"%d\", \"Name\":\"%s\", \"Content\":\"%s\"}", data1, data2, targetname, targetcontent);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Type\":\"%d\", \"Name\":\"%s\", \"Content\":\"%s\"}", data1, data2, targetname, targetcontent);
            buffer_append_string(b, res);
            printf("%10d %10d %10s %10s\n", data1, data2, targetname, content);
            free(res);
            free(targetname);
            free(targetcontent);
            num ++;
        }
    }


    buffer_append_string(b, "]}");
    sqlite3_finalize(stmt);
    sqlite3_close(db);
    free(sqlstr);
    return 1;
}

int sqlite_handle_conf(buffer *b, const struct message *m, const char *type)
{
    sqlite3 *db;
    int rc;
    sqlite3_stmt *stmt;
    char *disnumber, *disname, *confname, *targetname;

    char *sqlstr = NULL;
    char *errmsg = NULL;
    const char *temp = NULL;
    int len = 1024;
    sqlstr = malloc(len);
    memset(sqlstr, 0, len);
    if( !strcasecmp(type, "schedulecall") ) {
        snprintf(sqlstr, len, "select schedule.id,schedule.start_time_milliseconds,schedule.display_name,schedule.data1 as schedule_lost from schedule where schedule_lost!=\"1\" order by start_time;");
    }
    else if( !strcasecmp(type, "schedule") ) {
        snprintf(sqlstr, len, "select schedule.id as id,schedule.start_time as start_time, schedule.start_time_milliseconds as start_time_milliseconds, schedule.duration as duration, schedule.need_reminder as need_reminder, schedule.reminder_time as reminder_time, schedule.host as host, schedule.display_name as dispname, schedule.conf_dnd as confdnd, schedule.recycle as recycle, schedule.color as confcolor, schedule.data1 as data1, schedule.conf_auto_answer as conf_auto_answer, schedule.data2 as data2, schedule.data3 as data3, schedule.data4 as data4, schedule.data6 as data6, schedule.data7 as data7, schedule.rule as rule, schedule.data8 as data8, schedule.meeting_preset as meeting_preset, schedule.preset_position_name as preset_position_name from schedule order by start_time_milliseconds;");
    }
    else if( !strcasecmp(type, "gotopreset") ) {
        temp = msg_get_header(m, "id");
        if( temp == NULL ){
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            return -1;
        }
        snprintf(sqlstr, len, "select preset.pan, preset.tilt, preset.zoom, preset.focus from preset where id=%d;", atoi(temp));
    }
    else if( !strcasecmp(type, "preconf") ) {
        snprintf(sqlstr, len, "select schedule.id as confid,schedule.display_name as confname,group_contacts.id as contactid, group_contacts.number as number, group_contacts.name as name, group_contacts.account_id as acctid, group_contacts.host_email as email, group_contacts.data_source as data_source, group_contacts.state as state from schedule left join group_contacts on schedule.id=group_contacts.group_id order by confid desc,confname;");
    }
    else if( !strcasecmp(type, "updatestate") ){
        //if schedule is missed,set data2=1 in database
        temp = msg_get_header(m, "id");
        if( temp == NULL){
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            return -1;
        }
        snprintf(sqlstr, len, "update schedule set data2=1 where id=%d;",atoi(temp));
    }
    if( sqlstr == NULL || strlen(sqlstr) == 0 ){
        buffer_append_string(b,"{\"Response\":\"Error\"}");
        return -1;
    }

    printf("sqlite_handle_conf, sql str is %s\n", sqlstr);
    if( !strcasecmp(type, "caption") )
        rc = sqlite3_open("/data/data/com.android.providers.settings/databases/settings.db", &db);
    else if(!strcasecmp(type, "gotopreset"))
        rc = sqlite3_open("/data/data/com.base.module.preset/databases/preset.db", &db);
    else
        rc = sqlite3_open("/data/data/com.base.module.schedule/databases/conference.db", &db);
    if( rc ){
        printf("Can't open database: %s\n", sqlite3_errmsg(db));
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        free(sqlstr);
        return -1;
    }
    if( !strcasecmp(type, "updatestate") ) {
        rc = sqlite3_exec(db, sqlstr, 0, 0, &errmsg);
        if( rc ){
            printf("Can't open statement: %s\n", sqlite3_errmsg(db));
            fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
            buffer_append_string(b,"{\"Response\":\"failed\"}");
        }
        else
        {
            buffer_append_string(b,"{\"Response\":\"Success\"}");
        }
        sqlite3_close(db);
        free(sqlstr);
        return 1;
    }
    rc= sqlite3_prepare_v2(db,sqlstr, strlen(sqlstr), &stmt,0);
    if( rc ){
        printf("Can't open statement: %s\n", sqlite3_errmsg(db));
        fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        free(sqlstr);
        return -1;
    }
    if( !strcasecmp(type, "schedule") ){
        char *timestr = NULL;
        char *hourformat = NULL;
        time_t timer;
        struct tm *tblock;
        timer = time(NULL);
        tblock = localtime(&timer);
        timestr = malloc(24);
        hourformat = nvram_get ("122");
        memset(timestr, 0, 24);
        snprintf(timestr, 24, "%4.4d-%2.2d-%2.2d %2.2d:%2.2d:%2.2d", 1900+tblock->tm_year, 1+tblock->tm_mon, tblock->tm_mday, tblock->tm_hour, tblock->tm_min, tblock->tm_sec );
        buffer_append_string(b,"{\"Response\":\"Success\",\"Curtime\":\"");
        buffer_append_string(b, timestr);
        buffer_append_string(b,"\",\"Use24Hour\":\"");
        if( hourformat != NULL )
            buffer_append_string(b, hourformat);
        else
            buffer_append_string(b, "1");
        buffer_append_string(b,"\",\"Data\":[");
    }else{
        buffer_append_string(b,"{\"Response\":\"Success\",\"Data\":[");
    }
    int data1, data2, acctid;
    char *res = NULL;
    int num = 0;

    if( !strcasecmp(type, "preconf") ) {
        char *targetconfname, *targetemail, *email;
        int recordfrom, googlestate;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    // conf id
            confname = (char*)sqlite3_column_text(stmt,1);   //conf name
            data2 = sqlite3_column_int(stmt, 2);    //contact conf id
            disnumber = (char*)sqlite3_column_text(stmt, 3);   //contact number
            disname = (char*)sqlite3_column_text(stmt, 4);   //contact name
            acctid = sqlite3_column_int(stmt, 5);   //accout id
            email = (char*)sqlite3_column_text(stmt, 6);   //contact email
            recordfrom = sqlite3_column_int(stmt, 7);  //data source
            googlestate = sqlite3_column_int(stmt, 8); //google schedule state

            if( confname == NULL || disname == NULL || disnumber == NULL ){
                printf("disname or disnumber or conname is null\n");
                continue;
            }
            len = strlen(confname) * 2;
            targetconfname = malloc(len);
            memset(targetconfname, 0, len);
            snprintf(targetconfname, len, "%s", confname);
            json_handle(targetconfname);
            /*replace(confname, "\\", "\\\\", targetconfname);
            snprintf(confname, len, "%s", targetconfname);
            memset(targetconfname, 0, len);
            replace(confname, "\"", "\\\"", targetconfname);*/

            len = strlen(disname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            snprintf(targetname, len, "%s", disname);
            json_handle(targetname);
            /*replace(disname, "\\", "\\\\", targetname);
            snprintf(disname, len, "%s", targetname);
            memset(targetname, 0, len);
            replace(disname, "\"", "\\\"", targetname);*/

            if( email != NULL ){
                len = strlen(email) * 2;
                targetemail = malloc(len);
                memset(targetemail, 0, len);
                snprintf(targetemail, len, "%s", email);
                json_handle(targetemail);
                /*replace(email, "\\", "\\\\", targetemail);
                snprintf(email, len, "%s", targetemail);
                memset(targetemail, 0, len);
                replace(email, "\"", "\\\"", targetemail);*/
            }else{
                targetemail = "";
            }
            len = strlen(targetconfname)+strlen(targetname)+strlen(disnumber)+strlen(targetemail)+256;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Confname\":\"%s\", \"Number\":\"%s\", \"Name\":\"%s\", \"Acctid\":\"%d\", \"Email\":\"%s\", \"RecordFrom\":\"%d\", \"GoogleStatus\":\"%d\"}", data1, targetconfname, disnumber, targetname, acctid, targetemail, recordfrom, googlestate);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Confname\":\"%s\", \"Number\":\"%s\", \"Name\":\"%s\", \"Acctid\":\"%d\", \"Email\":\"%s\", \"RecordFrom\":\"%d\", \"GoogleStatus\":\"%d\"}", data1, targetconfname, disnumber, targetname, acctid, targetemail, recordfrom, googlestate);
            buffer_append_string(b, res);
            printf("%10d %10s %10s %10s\n", data1, targetconfname, targetname, disnumber);
            free(res);
            free(targetconfname);
            free(targetname);
            num ++;
        }
    }else if( !strcasecmp(type, "schedule") ) {
        int data3, data4, confdnd, recycle, confautoanswer;
        int len2;
        char *targetconfname,*host,*displayname,*color,*confstate,*starttime,*remindertime, *milliseconds, *ifinconf, *schedulenum, *schedulepsw,*scheduleurl, *schedulepstn, *repeatrule, *inviteacct, *preset, *presetname;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            printf("in while");
            data1 = sqlite3_column_int(stmt, 0);    // schedule id
            //data2 = sqlite3_column_int(stmt, 1);    //schedule group id
            starttime = (char*)sqlite3_column_text(stmt,1);   //start time
            milliseconds = (char*)sqlite3_column_text(stmt,2);   //start time milliseconds
            data3 = sqlite3_column_int(stmt, 3);    //duration
            data4 = sqlite3_column_int(stmt, 4);   //need remider
            remindertime = (char*)sqlite3_column_text(stmt, 5);   //remider time
            host = (char*)sqlite3_column_text(stmt, 6);   //host
            displayname = (char*)sqlite3_column_text(stmt, 7);   //displayname
            confdnd = sqlite3_column_int(stmt, 8);   //conf dnd
            recycle = sqlite3_column_int(stmt, 9);   //recycle
            color = (char*)sqlite3_column_text(stmt, 10);   //color
            confstate = (char*)sqlite3_column_text(stmt, 11);   //data1
            confautoanswer = sqlite3_column_int(stmt, 12);   //conf_auto_answer
            ifinconf = (char*)sqlite3_column_text(stmt, 13);   //if is in conf
            schedulepsw = (char*)sqlite3_column_text(stmt, 14);   //schedule password
            schedulenum = (char*)sqlite3_column_text(stmt, 15);   //schedule number
            scheduleurl = (char*)sqlite3_column_text(stmt, 16);   //schedule url
            schedulepstn = (char*)sqlite3_column_text(stmt, 17);   //schedule pstn
            repeatrule = (char*)sqlite3_column_text(stmt, 18);   //repeat rule
            inviteacct = (char*)sqlite3_column_text(stmt, 19);   //invite account
            preset = (char*)sqlite3_column_text(stmt, 20);   //preset index
            presetname = (char*)sqlite3_column_text(stmt, 21);   //preset name

            if( ifinconf != NULL && strcasecmp(ifinconf, "1") == 0 )
                continue;
            if( displayname == NULL ){
                printf("disname or disnumber or conname is null\n");
                continue;
            }
            if(schedulepsw == NULL)
                schedulepsw = "";
            if(schedulenum == NULL)
                schedulenum = "";
            if(scheduleurl == NULL)
                scheduleurl = "";
            if(schedulepstn == NULL)
                schedulepstn = "";
            if(repeatrule == NULL)
                repeatrule = "";
            if(inviteacct == NULL)
                inviteacct = "";
            if(preset == NULL)
                preset = "";
            if(presetname == NULL)
                presetname = "";
            len = strlen(displayname) * 2;
            targetconfname = malloc(len);
            memset(targetconfname, 0, len);
            snprintf(targetconfname, len, "%s", displayname);
            json_handle(targetconfname);
            //replace(displayname, "\"", "\\\"", targetconfname);

            len = strlen(targetconfname)+strlen(schedulepsw)+strlen(schedulenum)+strlen(scheduleurl)+strlen(schedulepstn)+strlen(repeatrule)+strlen(inviteacct)+strlen(presetname)+512;
            if( remindertime != NULL ){
                len2 = strlen(remindertime) * 2;
                targetname = malloc(len2);
                memset(targetname, 0, len2);
                snprintf(targetname, len2, "%s", remindertime);
                json_handle(targetname);
                //replace(remindertime, "\"", "\\\"", targetname);
                len += strlen(targetname);
            }
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Starttime\":\"%s\", \"Milliseconds\":\"%s\", \"Duration\":\"%d\", \"Reminder\":\"%d\", \"Retime\":\"%s\", \"Host\":\"%s\", \"Displayname\":\"%s\", \"Confdnd\":\"%d\", \"Recycle\":\"%d\", \"Color\":\"%s\", \"Confstate\":\"%s\", \"Confautoanswer\":\"%d\", \"Schedulenum\":\"%s\", \"Schedulepsw\":\"%s\", \"ScheduleURL\":\"%s\", \"SchedulePSTN\":\"%s\", \"RepeatRule\":\"%s\", \"InviteAcct\":\"%s\", \"Preset\":\"%s\", \"PresetName\":\"%s\"}", data1, starttime, milliseconds, data3, data4, remindertime == NULL ? "" : targetname, host, targetconfname, confdnd, recycle, color, confstate, confautoanswer, schedulenum, schedulepsw, scheduleurl, schedulepstn, repeatrule, inviteacct, preset, presetname);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Starttime\":\"%s\", \"Milliseconds\":\"%s\", \"Duration\":\"%d\", \"Reminder\":\"%d\", \"Retime\":\"%s\", \"Host\":\"%s\", \"Displayname\":\"%s\", \"Confdnd\":\"%d\", \"Recycle\":\"%d\", \"Color\":\"%s\", \"Confstate\":\"%s\", \"Confautoanswer\":\"%d\", \"Schedulenum\":\"%s\", \"Schedulepsw\":\"%s\", \"ScheduleURL\":\"%s\", \"SchedulePSTN\":\"%s\", \"RepeatRule\":\"%s\", \"InviteAcct\":\"%s\", \"Preset\":\"%s\", \"PresetName\":\"%s\"}", data1, starttime, milliseconds, data3, data4, remindertime == NULL ? "" : targetname, host, targetconfname, confdnd, recycle, color, confstate, confautoanswer, schedulenum, schedulepsw, scheduleurl, schedulepstn, repeatrule, inviteacct, preset, presetname);
            //printf("%s\n",res );
            buffer_append_string(b, res);
            free(res);
            num ++;
            //printf("%10d %10d %10s %10d %10d %10s\n", data1, targetconfname, data3, data4, disname);
            free(targetconfname);
            if( remindertime != NULL ){
                free(targetname);
            }
        }
    }else if( !strcasecmp(type, "schedulecall") ) {
        /*time_t now;
        time(&now);*/
        char *timestr = NULL;
        time_t timer;
        struct tm *tblock;
        timer = time(NULL);
        tblock = localtime(&timer);
        timestr = malloc(24);
        memset(timestr, 0, 24);
        snprintf(timestr, 24, "%4.4d/%2.2d/%2.2d %2.2d:%2.2d:%2.2d", 1900+tblock->tm_year, 1+tblock->tm_mon, tblock->tm_mday, tblock->tm_hour, tblock->tm_min, tblock->tm_sec );

        printf("%2.2d%2.2d%2.2d\n", tblock->tm_hour, tblock->tm_min, tblock->tm_sec);
        //long timemill;

        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    // schedule id
            disnumber = (char*)sqlite3_column_text(stmt,1);   //start time
            confname = (char*)sqlite3_column_text(stmt,2);   //schedule name

            if( disnumber == NULL || confname == NULL ){
                printf("disname or disnumber or conname is null\n");
                continue;
            }

            len = strlen(confname) * 2;
            targetname = malloc(len);
            memset(targetname, 0, len);
            snprintf(targetname, len, "%s", confname);
            json_handle(confname);
            //replace(confname, "\"", "\\\"", targetname);

            len = strlen(disnumber)+strlen(targetname)+128;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Curtime\":\"%s\", \"Id\":\"%d\", \"Starttime\":\"%s\", \"ScheduleName\":\"%s\"}", timestr, data1, disnumber, targetname);
            else
                snprintf(res, len, ",{\"Curtime\":\"%s\", \"Id\":\"%d\", \"Starttime\":\"%s\", \"ScheduleName\":\"%s\"}", timestr, data1, disnumber, targetname);
            buffer_append_string(b, res);
            printf("%24s %10s\n", timestr, targetname);
            free(res);
            num ++;
            free(targetname);
        }
    }else if( !strcasecmp(type, "caption") ) {
        int fontsize, fonttype, transparency, speed,spacing,effect,bold;
        char *captioncontent,*bgcolor,*fontcolor;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            printf("in while");
            data1 = sqlite3_column_int(stmt, 0);    // caption_type
            captioncontent = (char*)sqlite3_column_text(stmt,1);   //caption_content
            fonttype = sqlite3_column_int(stmt, 2);    //font_type
            fontsize = sqlite3_column_int(stmt, 3);   //font_size
            fontcolor = (char*)sqlite3_column_text(stmt, 4);   //font_color
            bold = sqlite3_column_int(stmt, 5);   //bold
            bgcolor = (char*)sqlite3_column_text(stmt, 6);   //background_color
            transparency = sqlite3_column_int(stmt, 7);   //transparency
            speed = sqlite3_column_int(stmt, 8);   //scrolling_speed
            effect = sqlite3_column_int(stmt, 9);   //effect
            spacing = sqlite3_column_int(stmt, 10);   //line_spacing

            len = strlen(captioncontent) + strlen(fontcolor)*2 + 256;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Type\":\"%d\", \"Content\":\"%s\", \"Font_type\":\"%d\", \"Font_size\":\"%d\", \"Font_color\":\"%s\", \"Bold\":\"%d\", \"Background_color\":\"%s\", \"Transparency\":\"%d\", \"Speed\":\"%d\", \"Effect\":\"%d\", \"Spacing\":\"%d\"}", data1, captioncontent, fonttype, fontsize, fontcolor, bold, bgcolor, transparency, speed, effect, spacing);
            else
                snprintf(res, len, ",{\"Type\":\"%d\", \"Content\":\"%s\", \"Font_type\":\"%d\", \"Font_size\":\"%d\", \"Font_color\":\"%s\", \"Bold\":\"%d\", \"Background_color\":\"%s\", \"Transparency\":\"%d\", \"Speed\":\"%d\", \"Effect\":\"%d\", \"Spacing\":\"%d\"}", data1, captioncontent, fonttype, fontsize, fontcolor, bold, bgcolor, transparency, speed, effect, spacing);
            //printf("%s\n",res );
            buffer_append_string(b, res);
            free(res);
            num ++;
            //printf("%10d %10d %10s %10d %10d %10s\n", data1, targetconfname, data3, data4, disname);
        }
    }else if( !strcasecmp(type, "gotopreset") ) {
        int data3, data4;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    // pan
            data2 = sqlite3_column_int(stmt, 1);    // tilt
            data3 = sqlite3_column_int(stmt, 2);    // zoom
            data4 = sqlite3_column_int(stmt, 3);    // focus

            dbus_send_ptz_control("preset_goto", data1, data2, data3, data4);
            buffer_append_string(b, "success");
        }
    }
    buffer_append_string(b, "]}");
    sqlite3_finalize(stmt);
    sqlite3_close(db);
    free(sqlstr);
    return 1;
}

//add by Hejie Shao
int sqlite_handle_display(buffer *b, const struct message *m, const char *type , const char *affect)
{
    sqlite3 *db;
    int rc;
    sqlite3_stmt *stmt;
    char * errmsg = NULL;
    char *sitename, *fontcolor, *bgcolor;

    char *sqlstr = NULL;
    //const char *temp = NULL;
    int len = 1024;
    sqlstr = malloc(len);
    memset(sqlstr, 0, len);
    if(!strcasecmp(affect, "read")) {
        snprintf(sqlstr, len, "select transparency,site_name,display_position,display_duration,font_color,font_size, bold, horizontal_offset,vertical_offset from  display where type=0;");
    }
    else if( !strcasecmp(affect, "update") ) {
        const char *bgtp = NULL, *sitename = NULL, *dispos = NULL, *disduration = NULL, *fontcolor = NULL, *fontsize = NULL, *bold = NULL;
        bgtp = msg_get_header(m, "bgtp");
        sitename = msg_get_header(m, "sitename");
        dispos = msg_get_header(m, "dispos");
        disduration = msg_get_header(m, "disduration");
        fontcolor = msg_get_header(m, "fontcolor");
        fontsize = msg_get_header(m, "fontsize");
        bold = msg_get_header(m, "bold");
        if( bgtp == NULL || sitename == NULL || dispos == NULL || disduration == NULL || fontcolor == NULL || fontsize == NULL || bold == NULL){
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            return -1;
        }
        uri_decode((char*)sitename);
        uri_decode((char*)fontcolor);
        snprintf(sqlstr, len, "update display set transparency=%d,site_name=\"%s\",display_position=%d,display_duration=%d,font_color=\"%s\",font_size=%d,bold=%d where type=0;", atoi(bgtp), sitename, atoi(dispos), atoi(disduration), fontcolor, atoi(fontsize), atoi(bold));
    }
    if( sqlstr == NULL || strlen(sqlstr) == 0 ){
        buffer_append_string(b,"{\"Response\":\"Error\"}");
        return -1;
    }

    printf("sqlite_handle_display, sql str is %s\n", sqlstr);
    rc = sqlite3_open("/data/data/com.android.providers.settings/databases/settings.db", &db);
    if( rc ){
        printf("Can't open database: %s\n", sqlite3_errmsg(db));
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        buffer_append_string(b,"{\"Response\":\"failed\"}");
        free(sqlstr);
        return -1;
    }

    if(!strcasecmp(affect, "read"))
    {
        rc= sqlite3_prepare_v2(db,sqlstr, strlen(sqlstr), &stmt,0);
        if( rc ){
            printf("Can't open statement: %s\n", sqlite3_errmsg(db));
            fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
            sqlite3_close(db);
            buffer_append_string(b,"{\"Response\":\"failed\"}");
            free(sqlstr);
            return -1;
        }
        buffer_append_string(b,"{\"Response\":\"Success\",\"Data\":[");

        int bg_tp, displayposition, displayduration, fontsize;
        int bold, transparency, scrollspeed, height, horizont, vertical;
        char *res = NULL;
        int num = 0, len=256;

        if( !strcasecmp(type, "sitesetting") ) {
            while(sqlite3_step(stmt)==SQLITE_ROW ) {
                bg_tp = sqlite3_column_int(stmt, 0);    //  background_transparency
                sitename = (char*)sqlite3_column_text(stmt,1);   // site_name
                displayposition = sqlite3_column_int(stmt, 2);    //display_position
                displayduration = sqlite3_column_int(stmt, 3);   //display_duration
                fontcolor = (char*)sqlite3_column_text(stmt, 4);   //font_color
                fontsize = sqlite3_column_int(stmt, 5);//font_size
                bold = sqlite3_column_int(stmt, 6); //bold
                horizont = sqlite3_column_int(stmt, 7); //horizont
                vertical = sqlite3_column_int(stmt, 8); //vertical

                if(sitename!=NULL)
                    len = strlen(sitename)+256;

                res = malloc( len );
                memset(res, 0, len);
                if( !num )
                    snprintf(res, len, "{\"bg_tp\":\"%d\", \"Sitename\":\"%s\", \"displayposition\":\"%d\", \"displayduration\":\"%d\",\"fontcolor\":\"%s\", \"fontsize\":\"%d\", \"bold\":\"%d\", \"horizont\":\"%d\", \"vertical\":\"%d\"}", bg_tp, sitename==NULL ? "" : sitename,displayposition, displayduration, fontcolor==NULL ? "ffffff" : fontcolor, fontsize, bold, horizont, vertical);
                else
                    snprintf(res, len, "{\"bg_tp\":\"%d\", \"Sitename\":\"%s\", \"displayposition\":\"%d\", \"displayduration\":\"%d\",\"fontcolor\":\"%s\", \"fontsize\":\"%d\", \"bold\":\"%d\", \"horizont\":\"%d\", \"vertical\":\"%d\"}", bg_tp, sitename==NULL ? "" : sitename, displayposition, displayduration, fontcolor==NULL ? "ffffff" : fontcolor, fontsize, bold, horizont, vertical);
                buffer_append_string(b, res);
                free(res);
                num ++;
                printf("{\"bg_tp\":\"%d\", \"Sitename\":\"%s\", \"displayposition\":\"%d\"}\n" , bg_tp, sitename,displayposition);
                printf("{\"displayduration\":\"%d\",\"fontcolor\":\"%s\", \"fontsize\":\"%d\", \"bold\":\"%d\"}\n", displayduration, fontcolor, fontsize, bold);
            }
        }else if(!strcasecmp(type, "displaycaption")){
            while(sqlite3_step(stmt)==SQLITE_ROW ) {
                fontsize = sqlite3_column_int(stmt, 0);//font_size
                bgcolor = (char*)sqlite3_column_text(stmt,1);   // background_color
                fontcolor = (char*)sqlite3_column_text(stmt, 2);   //font_color
                transparency = sqlite3_column_int(stmt, 3);    //  transparency
                scrollspeed = sqlite3_column_int(stmt, 4);    //scroll_speed
                height = sqlite3_column_int(stmt, 5);   //height  
                bold = sqlite3_column_int(stmt, 6); //bold

                res = malloc( len );
                memset(res, 0, len);
                if( !num )
                    snprintf(res, len, "{\"fontsize\":\"%d\", \"bgcolor\":\"%s\", \"fontcolor\":\"%s\", \"transparency\":\"%d\",\"scrollspeed\":\"%d\", \"height\":\"%d\", \"bold\":\"%d\"}", fontsize, bgcolor==NULL?"ffffff":bgcolor,fontcolor==NULL?"ffffff":fontcolor, transparency, scrollspeed, height, bold);
                else
                    snprintf(res, len, "{\"fontsize\":\"%d\", \"bgcolor\":\"%s\", \"fontcolor\":\"%s\", \"transparency\":\"%d\",\"scrollspeed\":\"%d\", \"height\":\"%d\", \"bold\":\"%d\"}", fontsize, bgcolor==NULL?"ffffff":bgcolor,fontcolor==NULL?"ffffff":fontcolor, transparency, scrollspeed, height, bold);
                buffer_append_string(b, res);
                free(res);
                num ++;
            }
        }
        buffer_append_string(b, "]}");
        sqlite3_finalize(stmt);
    }
    else if(!strcasecmp(affect, "update")){
        rc = sqlite3_exec(db, sqlstr, 0, 0, &errmsg);
        if( rc ){
            printf("Can't open statement: %s\n", sqlite3_errmsg(db));
            fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
            buffer_append_string(b,"{\"Response\":\"failed\"}");
            sqlite3_close(db);
            return -1;
        }
        buffer_append_string(b,"{\"Response\":\"Success\"}");
        
    }  
    sqlite3_close(db);
    free(sqlstr);
    return 1;
}

int sqlite_handle(buffer *b, const char *sqlstr)
{
    sqlite3 *db;
    int rc;
    char * errmsg = NULL;
    char **dbResult;
    int nRow, nColumn;
    int i , j;
    int index, len;
    char *temp = NULL;

    printf("sql str is %s\n", sqlstr);
    rc = sqlite3_open("/data/data/com.android.providers.settings/databases/settings.db", &db);
    if( rc ){
        printf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 0;
    }
    /*rc = sqlite3_exec(db, sqlstr, callback, 0, &errmsg);
    if( rc!=SQLITE_OK )
    {
        printf(stderr, "SQL error: %s\n", errmsg);
        sqlite3_free(errmsg);
    }*/
    rc = sqlite3_get_table ( db, sqlstr , &dbResult, &nRow, &nColumn, &errmsg );
    printf("db open suc --- rc = %d\n", rc);
    if( rc == SQLITE_OK )
    {
        index = nColumn;
        printf( "query %d records.\n", nRow );
        for( i = 0; i < nRow ; i++ )
        {
            printf("Record %d:\n" , i+1 );
            for( j = 0 ; j < nColumn; j++ )
            {
                if( !strcasecmp(dbResult[j], "name") )
                {
                    len = 4 + strlen(dbResult[j]) + strlen(dbResult[index]);
                    temp = malloc( len );
                    snprintf(temp, len, "%s=", dbResult[index]);
                    buffer_append_string(b, temp);
                    free(temp);
                }else if( !strcasecmp(dbResult[j], "value") )
                {
                    buffer_append_string(b, dbResult[index]);
                    buffer_append_string(b, "\r\n");
                }
                printf( "index:%d, name:%s, value:%s\n", index, dbResult[j], dbResult[index] );
                ++index;
            }
            printf("---index--%d--\n" , index);
        }
    }else
    {
        printf(stderr, "SQL error: %s\n", errmsg);
        sqlite3_free(errmsg);
    }
    sqlite3_free_table ( dbResult );
    sqlite3_close(db);
    return 1;
}

static char * build_JSON_res( server *srv, connection *con,  const struct message *m, char *appendRes )
{
    char *temp = NULL;
    if ( ( srv != NULL ) && ( con != NULL ) && ( m != NULL ) && ( appendRes != NULL ) )
    {
         response_header_overwrite(srv, con, CONST_STR_LEN("Content-Type"), 
                    CONST_STR_LEN("application/x-javascript; charset=utf-8"));
            
        const char * jsonCallback = msg_get_header( m, "jsoncallback" );
        if ( jsonCallback != NULL )
        {
            temp = malloc( strlen(appendRes) +10 + strlen( jsonCallback ) );
            snprintf( temp, strlen(appendRes) +10 + strlen( jsonCallback ),
                "%s(%s)", jsonCallback, appendRes );
        }
        else
        {
             temp = strdup( appendRes );
        }
    }
    
    return temp;
}

static char * build_JSON_formate( server *srv, connection *con,  const struct message *m, char *appendRes )
{
    char *temp = NULL;
    if ( ( srv != NULL ) && ( con != NULL ) && ( m != NULL ) && ( appendRes != NULL ) )
    {
         response_header_overwrite(srv, con, CONST_STR_LEN("Content-Type"), 
                    CONST_STR_LEN("application/x-javascript; charset=utf-8"));
            
        const char * jsonCallback = msg_get_header( m, "jsoncallback" );
        if ( jsonCallback != NULL )
        {
	    printf("jsonclall----------\r\n");
            temp = malloc( strlen(appendRes) + 10 + strlen( jsonCallback ) );
            snprintf( temp, strlen(appendRes) + 10 + strlen( jsonCallback ),
                "%s(%s)", jsonCallback, appendRes );
        }
        else
        {
             temp = strdup( appendRes );
        }
    }
    
    return temp;
}

static int handle_sqliteconf(buffer *b, const struct message *m)
{
    printf("handle_sqliteconf");
    const char *type = NULL;
    type = msg_get_header(m, "type");
    uri_decode((char *)type);
    return sqlite_handle_conf(b, m, type);
}

static int handle_sqlitesettings(buffer *b, const struct message *m)
{
    printf("handle_sqlitesetttings\n");
    const char *type = NULL;
    type = msg_get_header(m, "type");
    uri_decode((char *)type);
    const char *temp = NULL;
    return sqlite_handle_settings(b, m, type);
}

static int handle_sqlitecontacts(buffer *b, const struct message *m)
{
    printf("handle_sqlitesettting\n");
    const char *type = NULL;
    type = msg_get_header(m, "type");
    uri_decode((char *)type);

    return sqlite_handle_contact(b, m, type);
}

static int sqlite_handle_recording(buffer *b, const struct message *m, const char *type,const char *sqlstr){
    sqlite3 *db;
    int rc;
    char * errmsg = NULL;
    int result = 1;

    printf("sqlite_handle_recording, sql str is %s\n", sqlstr);
    rc = sqlite3_open("/data/data/com.base.module.recording/databases/recording_database", &db);
    if( rc ){
        printf("Can't open database: %s\n", sqlite3_errmsg(db));
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return -1;
    }

    if( !strcasecmp(type, "getrecordinglist") ) {
        sqlite3_stmt *stmt;
        rc= sqlite3_prepare_v2(db,sqlstr, strlen(sqlstr), &stmt,0);
        if( rc ){
            printf("Can't open statement: %s\n", sqlite3_errmsg(db));
            fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
            sqlite3_close(db);
            return -1;
        }
        char *hourformat = NULL;
        hourformat = nvram_get ("122");
        buffer_append_string(b,"{\"Response\":\"Success\",\"Use24Hour\":\"");
        if( hourformat != NULL )
            buffer_append_string(b, hourformat);
        else
            buffer_append_string(b, "1");
        buffer_append_string(b, "\",\"Data\":[");

        int data1, data2;
        char *path;
        char *res = NULL;
        int num = 0, len;

        char *targetpath, *createtime, *filesize;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            data1 = sqlite3_column_int(stmt, 0);    // id
            path = (char*)sqlite3_column_text(stmt,1);   // path
            data2 = sqlite3_column_int(stmt, 2);    //lock
            createtime = (char*)sqlite3_column_text(stmt,3);   // createtime
            filesize = (char*)sqlite3_column_text(stmt,4);   // filesize

            if( path == NULL ){
                printf("path is null\n");
                continue;
            }
            len = strlen(path) * 2;
            targetpath = malloc(len);
            memset(targetpath, 0, len);
            replace(path, "\"", "\\\"", targetpath);

            len = strlen(targetpath)+strlen(createtime)+strlen(filesize)+64;
            res = malloc( len );
            memset(res, 0, len);
            if( !num )
                snprintf(res, len, "{\"Id\":\"%d\", \"Path\":\"%s\", \"Lock\":\"%d\", \"Time\":\"%s\", \"Size\":\"%s\"}", data1, targetpath, data2, createtime, filesize);
            else
                snprintf(res, len, ",{\"Id\":\"%d\", \"Path\":\"%s\", \"Lock\":\"%d\", \"Time\":\"%s\", \"Size\":\"%s\"}", data1, targetpath, data2, createtime, filesize);
            buffer_append_string(b, res);
            free(res);
            free(targetpath);
            num ++;
        }
        buffer_append_string(b, "]}");

        sqlite3_finalize(stmt);
    }else if( !strcasecmp(type, "checklock") ) {
        sqlite3_stmt *stmt;
        rc= sqlite3_prepare_v2(db,sqlstr, strlen(sqlstr), &stmt,0);
        if( rc ){
            printf("Can't open statement: %s\n", sqlite3_errmsg(db));
            fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            sqlite3_close(db);
            return -1;
        }
        result = 0;
        while(sqlite3_step(stmt)==SQLITE_ROW ) {
            result ++;
        }
    }else if( !strcasecmp(type, "deleterecord") ) {
        rc = sqlite3_exec(db, sqlstr, 0, 0, &errmsg);
        printf("delete record: %d\n", rc);
        if( rc ){
            printf("Can't open statement: %s\n", sqlite3_errmsg(db));
            fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            sqlite3_close(db);
            return -1;
        }
        const char *id = NULL;
        id = msg_get_header(m, "id");
        buffer_append_string(b,"{\"Response\":\"Success\", \"Id\":\"");
        buffer_append_string(b, id);
        buffer_append_string(b, "\"}");
    }else if( !strcasecmp(type, "renamerecord") ) {
        rc = sqlite3_exec(db, sqlstr, 0, 0, &errmsg);
        if( rc ){
            printf("Can't open statement: %s\n", sqlite3_errmsg(db));
            fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            sqlite3_close(db);
            return -1;
        }
        buffer_append_string(b,"{\"Response\":\"Success\"}");
    }else if( !strcasecmp(type, "lockrecord") ) {
        rc = sqlite3_exec(db, sqlstr, 0, 0, &errmsg);
        if( rc ){
            printf("Can't open statement: %s\n", sqlite3_errmsg(db));
            fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            sqlite3_close(db);
            return -1;
        }
        buffer_append_string(b,"{\"Response\":\"Success\"}");
    }

    sqlite3_close(db);
    return result;
}

static int handle_recording_notify(buffer *b, const struct message *m){
    char *type = NULL, *position = NULL;
    type = msg_get_header(m, "type");
    position = msg_get_header(m, "id");

    if( type != NULL && position != NULL ){
        /*char *cmd = NULL;
        cmd = malloc(128);
        memset(cmd, 0, 128);
        snprintf(cmd, 128, "am broadcast -a com.base.module.phone.PRESET --es \"action\" \"%s\" --es \"position\" %s", type, position);
        system(cmd);*/
        if( strcasecmp(type, "delete") == 0 )
            system("am broadcast --user all -a com.base.module.recording.DELETE_ACTION");
        else
            system("am broadcast --user all -a com.base.module.recording.UPDATE_ACTION");
    }
    buffer_append_string(b, "Response=Success\r\n");
}

static int handle_recording(buffer *b, const struct message *m)
{
    printf("handle_recording\n");
    const char *type = NULL;
    type = msg_get_header(m, "type");
    uri_decode((char *)type);
    char *sqlstr = NULL;

    if( !strcasecmp(type, "getrecordinglist") ){
        sqlstr = malloc(128);
        memset(sqlstr, 0, 128);
        snprintf(sqlstr, 128, "select * from recording_list order by createtime desc;");
    }else if( !strcasecmp(type, "deleterecord") || !strcasecmp(type, "renamerecord") ){
        char *temp = NULL;
        temp = msg_get_header(m, "id");
        if( temp == NULL ){
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            return -1;
        }
        sqlstr = malloc(128);
        memset(sqlstr, 0, 128);
        snprintf(sqlstr, 128, "select * from recording_list where _id=%d and lockstate=0;", atoi(temp));
        int rst = sqlite_handle_recording(b, m, "checklock", sqlstr);
        if( rst <= 0 ){
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            return -1;
        }
        if( !strcasecmp(type, "deleterecord") ){
            int delok = 0;
            const char *filename = msg_get_header(m, "filename");
            if( filename != NULL ){
                uri_decode((char*)filename);
                char *cmd = NULL;
                int len = strlen(filename)*2;
                char *targetfilename = NULL;
                targetfilename = malloc(len);
                memset(targetfilename, 0, len);
                replace(filename, "../", "", targetfilename);

                len = strlen(targetfilename) + 128;
                cmd = malloc(len);
                memset(cmd, 0, len);
                //snprintf(cmd, len, "rm \"%s/%s\"", RECORING_PATH, targetfilename);
                snprintf(cmd, len, "rm \"%s\"", targetfilename);
                printf("cmd = %s\n", cmd);
                int result = mysystem(cmd);
                if( result == 0 ){
                    delok = 1;
                }
                free(cmd);
            }
            if( !delok ){
                buffer_append_string(b,"{\"Response\":\"Error\"}");
                return -1;
            }
            memset(sqlstr, 0, 128);
            snprintf(sqlstr, 128, "delete from recording_list where _id=%d and lockstate=0", atoi(temp));
        }else if( !strcasecmp(type, "renamerecord") ){
            int updateok = 0;
            const char *path = msg_get_header(m, "name");
            const char *newname = msg_get_header(m, "newname");
            const char *pathonly = msg_get_header(m, "pathonly");
            if( path != NULL && newname != NULL && pathonly != NULL){
                char *cmd = NULL;
                uri_decode((char*)path);
                uri_decode((char*)newname);
                uri_decode((char*)pathonly);
                if( !strcasecmp(path, "") || !strcasecmp(newname, "") ){
                    buffer_append_string(b,"{\"Response\":\"Error\"}");
                    return -1;
                }
                int len = strlen(path) + strlen(newname) + 64;
                cmd = malloc(len);
                memset(cmd, 0, len);
                snprintf(cmd, len, "mv \"%s/%s\" \"%s/%s\"", pathonly, path, pathonly, newname);
                char *targetcmd = NULL;
                len = strlen(cmd)*2;
                targetcmd = malloc(len);
                memset(targetcmd, 0, len);
                replace(cmd, "../", "", targetcmd);

                printf("targetcmd = %s\n", targetcmd);
                int result = mysystem(targetcmd);
                if( result == 0 ){
                    updateok = 1;
                }
                free(cmd);
                int updatelen;
                updatelen = strlen(newname)+128;
                sqlstr = malloc(updatelen);
                memset(sqlstr, 0, updatelen);
                snprintf(sqlstr, updatelen, "update recording_list set location=\"%s/%s\" where _id=%d", pathonly, newname, atoi(temp));
            }
            if( !updateok ){
                buffer_append_string(b,"{\"Response\":\"Error\"}");
                return -1;
            }
        }
    }else if( !strcasecmp(type, "lockrecord") ){
        int lockstate = 0;
        const char *locktmp = msg_get_header(m, "lockstate");
        printf("handle_recording\n");
        if( locktmp != NULL){
            if( !strcasecmp(locktmp, "") ){
                buffer_append_string(b,"{\"Response\":\"Error\"}");
                return -1;
            }
            lockstate = atoi(locktmp);
            char *temp = NULL;
            int updatelen = 128;
            temp = msg_get_header(m, "id");
            if( temp != NULL ){
                sqlstr = malloc(updatelen);
                memset(sqlstr, 0, updatelen);
                snprintf(sqlstr, updatelen, "update recording_list set lockstate=%d where _id=%d", lockstate, atoi(temp));
            }
        }
    }

    if( sqlstr != NULL ){
        int rst = sqlite_handle_recording(b, m, type, sqlstr);
        free(sqlstr);
        return rst;
    }else{
        buffer_append_string(b,"{\"Response\":\"Error\"}");
        return -1;
    }
}

static int handle_downloadrecordings(buffer *b, const struct message *m)
{
    const char *filenames = NULL;
    filenames = msg_get_header(m, "filenames");
    if( filenames != NULL ){
        uri_decode((char *)filenames);
        char *cmd = NULL;
        int len = strlen(filenames) + 128;
        cmd = malloc(len);
        memset(cmd, 0, len);
        snprintf(cmd, len, "cd %s/ && ls %s | xargs tar -cf Recording.tar.gz", RECORING_PATH, filenames);
        printf("cmd = %s\n", cmd);
        int result = mysystem(cmd);
        if( result )
            buffer_append_string(b, "Response=Error\r\n");
        else
            buffer_append_string(b, "Response=Success\r\n");
        free(cmd);
    }else{
        buffer_append_string(b, "Response=Error\r\n");
    }
    return 1;
}

static int handle_removetmprecord(buffer *b)
{
    char *cmd = NULL;
    cmd = malloc(128);
    snprintf(cmd, 128, "rm %s/Recording.tar.gz", RECORING_PATH);
    int result = system(cmd);
    printf("resule = %d\n", result);
    if( result )
        buffer_append_string(b, "Response=Error\r\n");
    else
        buffer_append_string(b, "Response=Success\r\n");
    free(cmd);

    return 1;
}

static int handle_getgoogleaccts(buffer *b)
{
    xmlDocPtr doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    xmlChar *key = NULL;
    xmlChar *val = NULL;
    char *temp = NULL;
    int len = 0, count = 0;

    doc = xmlReadFile(CONF_SCHEDULE, NULL, 0);

    if (doc == NULL)
    {
        printf("error: could not parse file %s\n", CONF_MPK);
        return 0;
    }

    buffer_append_string(b, "{\"Response\":\"Success\", \"Data\":[");

    /*Get the root element node */
    root_element = xmlDocGetRootElement(doc);
    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
    {
        //if (cur_node->type == XML_ELEMENT_NODE)
        {
            if ( !xmlStrcmp(cur_node->name, BAD_CAST "string") )
            {
                key = xmlGetProp(cur_node, BAD_CAST "name");
                printf("cur_node name is string, key = %s\n", key);
                if( key != NULL )
                {
                    val = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                    len =  strlen(key) + strlen(val) + 64;
                    temp = malloc( len );
                    if(!count)
                    {
                        snprintf(temp, len, "{\"Account\":\"%s\",\"Auth\":\"%s\"}", key, val);
                    }
                    else
                    {
                        snprintf(temp, len, ",{\"Account\":\"%s\",\"Auth\":\"%s\"}", key, val);
                    }
                    if (val != NULL) {
                        xmlFree(val);
                    }
                    count++;
                    buffer_append_string(b, temp);
                    xmlFree(key);
                }
            }
        }
    }
    xmlFreeDoc(doc);
    buffer_append_string(b, "]}");

    return 1;
}

static int handle_sqlitedisplay(buffer *b, const struct message *m)
{
    printf("handle_sqlitedisplay\n");
    const char *type = NULL;
    type = msg_get_header(m, "type");
    uri_decode((char *)type);
    const char *affect = NULL;
    affect = msg_get_header(m,"affect");
    uri_decode((char *)affect);
    return sqlite_handle_display(b, m, type, affect);
}

static void CvtHex(const HASH Bin, char Hex[33]) {
    unsigned short i;

    for (i = 0; i < 16; i++) {
        Hex[i*2] = int2hex((Bin[i] >> 4) & 0xf);
        Hex[i*2+1] = int2hex(Bin[i] & 0xf);
    }
    Hex[32] = '\0';
}

static int compare_md5_password(char *username, char *realm, char *password, char *pw){
    li_MD5_CTX Md5Ctx;
    HASH HA1;
    char a1[256];

    li_MD5_Init(&Md5Ctx);
    li_MD5_Update(&Md5Ctx, (unsigned char *)username, strlen(username));
    li_MD5_Update(&Md5Ctx, (unsigned char *)":", 1);
    li_MD5_Update(&Md5Ctx, (unsigned char *)realm, strlen(realm));
    li_MD5_Update(&Md5Ctx, (unsigned char *)":", 1);
    li_MD5_Update(&Md5Ctx, (unsigned char *)pw, strlen(pw));
    li_MD5_Final(HA1, &Md5Ctx);

    CvtHex(HA1, a1);
    //printf("a1=%s\n", a1);
    //printf("password=%s\n", password);

    if (0 == strcmp(password, a1)) {
        return 0;
    }

    return 1;
}

static int handle_loginrealm( buffer *b )
{
    long realm = random() * random();
    mRealm = malloc(64);
    snprintf( mRealm, 64, "%d", realm );
    buffer_append_string( b, mRealm );
}

static int handle_insleepmode(buffer *b)
{
    const char *val = NULL;

#ifdef BUILD_ON_ARM
    val = nvram_my_get("systemWakeup");
#else
    val = "1";
#endif

    if( !strcasecmp(val, "false") ){
        buffer_append_string(b, "Response=Success\r\nInsleep=1\r\n");
    }else{
        buffer_append_string(b, "Response=Success\r\nInsleep=0\r\n");
    }

    return 0;
}

static int handle_checklockout(buffer *b)
{
    int locked = 0;
    /*if( passwrongtimes >= 5 && userpasswrongtimes >= 5 ){
        time_t now;
        time(&now);
        if (now < lockoutime)
        {
            locked = 1;
            buffer_append_string( b, "1" );
        }else
        {
            //passwrongtimes = 0;
            locked = 0;
            buffer_append_string( b, "0" );
        }
    }else{
        locked = 0;
        buffer_append_string( b, "0" );
    }*/
    locked = 0;
    buffer_append_string( b, "0" );

    return locked;
}

static int authenticate (const struct message *m)
{
    const char *user = msg_get_header (m, "Username");
    const char *pass = msg_get_header (m, "Secret");
    //const char *realm = msg_get_header (m, "time");

    if (user == NULL || pass == NULL)
    {
        return -1;
    }
    uri_decode((char *) pass);
    char *realpass = NULL;
    int isdft = 0;

    if ((!strcasecmp ("admin", user)) || (!strcasecmp("gmiadmin", user)))
    {
#ifdef BUILD_ON_ARM
        realpass = nvram_get ("2");
#else
        realpass = "admin";
#endif
        if (realpass == NULL)
        {
            realpass = "admin";
#ifdef BUILD_ON_ARM
            nvram_set ("2", "admin");
            nvram_commit ();    
#endif
        }
        if( !strcmp(realpass, "admin") ){
            isdft = 1;
        }
        /*if (!strcmp (adminpwd, pass))
        {
	    if(!strcmp("admin", user))
            	strcpy (usertype, "admin");
	    else
		strcpy (gmiusertype, "gmiadmin");

	    strcpy(newloginuser, user);
	    strcpy(curuser, user);
        if( !strcmp(pass, "admin") )
            return 1;
        else
            return 0;
        }*/
        
    } else if (!strcasecmp ("user", user)) 
    {
#ifdef BUILD_ON_ARM
        realpass = nvram_get ("196");
#else
        realpass = "user";
#endif
        if (realpass == NULL)
        {
            //printf ("1.----------userpwd init is null----------\n");
            realpass = "123";
#ifdef BUILD_ON_ARM
            nvram_set ("196", "123");
            nvram_commit ();
#endif
        }
        if( !strcmp(realpass, "123") ){
            isdft = 1;
        }

        /*if (!strcmp (userpwd, pass))
        {
            strcpy (usertype, "user");
	    strcpy (newloginuser, user);
	    strcpy (curuser, user);
        if( !strcmp(pass, "123") )
            return 1;
        else
            return 0;
        }*/
    }else{
        if( mRealm != NULL ){
            free(mRealm);
            mRealm = NULL;
        }
        return -2;
    }

    int result = -1;
    if( mRealm != NULL ){
        result = compare_md5_password(user, mRealm, pass, realpass);
        free(mRealm);
        mRealm = NULL;
    }else{
        if( !strcasecmp(pass, realpass) )
            result = 0;
    }
    if( result == 0 ){
        if(!strcmp("admin", user))
            strcpy (usertype, "admin");
        else if(!strcmp("gmiadmin", user))
            strcpy (gmiusertype, "gmiadmin");
        else if(!strcmp("user", user))
            strcpy (usertype, "user");

        strcpy(newloginuser, user);
        strcpy(curuser, user);
        return isdft;
    }

    return -1;
}

static void authenticate_success_response(server *srv, connection *con, 
    buffer *b, const struct message *m, int authres)
{
    long unsigned int cookie;
    char *tmp = NULL;

    time_t now;
    cookie = rand();
    tmp = malloc(128);
    time(&now);

    if( (!strcasecmp("admin", newloginuser)) || (!strcasecmp("user", newloginuser))) {
    	sprintf(usercookie, "%08lx", cookie);
        snprintf(tmp, 128, "phonecookie=\"%s\";HttpOnly", usercookie);
    	sessiontimeout = now + WEB_TIMEOUT;
    } else if (!strcasecmp("gmiadmin", newloginuser)) {
	sprintf(gmicookie, "%08lx", cookie);
    snprintf(tmp, 128, "gmicookie=\"%s\";HttpOnly", gmicookie);
	gmisessiontimeout = now + WEB_TIMEOUT;
    }


    response_header_overwrite(srv, con, CONST_STR_LEN("Set-Cookie"),
        CONST_GCHAR_LEN(tmp));

    free(tmp);

    tmp = malloc(strlen(usertype)+16);
    snprintf(tmp, strlen(usertype)+16, "type=%s;", newloginuser);
    response_header_insert(srv, con, CONST_STR_LEN("Set-Cookie"),
        CONST_GCHAR_LEN(tmp));

    free(tmp);
     
    response_header_insert(srv, con, CONST_STR_LEN("Set-Cookie"),
        CONST_STR_LEN("Version=\"1\";"));
    tmp = malloc(16);
    snprintf(tmp, 16, "Max-Age=%d", WEB_TIMEOUT);
    response_header_insert(srv, con, CONST_STR_LEN("Set-Cookie"),
        CONST_GCHAR_LEN(tmp));

    free(tmp);

    char *insleep = NULL;
#ifdef BUILD_ON_ARM
    insleep = nvram_my_get("systemWakeup");
    if( !strcasecmp(insleep, "false") ){
        insleep = "1";
    }else{
        insleep = "0";
    }
#else
    insleep = "0";
#endif



    const char * resType = msg_get_header(m, "format");
    if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
    {
        response_header_overwrite(srv, con, CONST_STR_LEN("Content-Type"), 
            CONST_STR_LEN("application/x-javascript; charset=utf-8"));
        
        const char * jsonCallback = msg_get_header( m, "jsoncallback" );

        if ( jsonCallback != NULL )
        {
            tmp = malloc( 128 + strlen( jsonCallback ) );
            snprintf( tmp, 128 + strlen( jsonCallback ),
                "%s({\"res\": \"success\", \"msg\" : \"authentication accepted\", \"needchange\":\"%d\", \"insleep\":\"%s\"})", jsonCallback, authres, insleep );
        }
        else
        {
            tmp = malloc( 128 );
            snprintf( tmp, 128, "{\"res\": \"success\", \"msg\" : \"authentication accepted\", \"needchange\":\"%d\", \"insleep\":\"%s\"}", authres, insleep );
        }
        
        buffer_append_string( b, tmp );
        free(tmp);
    }
    else
    {
        tmp = malloc( 128 );
#ifdef BUILD_ON_ARM
        snprintf( tmp, 128, "Response=Success\r\nMessage=Authentication accepted\r\nNeedchange=%d\r\nVer=%s\r\nInSleep=%s\r\n", authres, nvram_my_get("68"), insleep );
#else
        snprintf( tmp, 128, "Response=Success\r\nMessage=Authentication accepted\r\nNeedchange=%d\r\nVer=\r\nInSleep=%s\r\n", authres, insleep );
#endif
        buffer_append_string(b, tmp);
        free(tmp);
    }
}

#ifndef BUILD_RECOVER
static int handle_logoff(buffer *b)
{
	long unsigned int cookie;

	cookie = rand();

	if( (!strcmp("admin", curuser)) || (!strcmp("user", curuser)) ) {
	    sprintf(usercookie, "%08lx", cookie);
	    strcpy(usertype, "none");
	    sessiontimeout = 0;
	} else if (!strcmp("gmiadmin", curuser)) {
	    sprintf(gmicookie, "%08lx", cookie);
	    strcpy(gmiusertype, "none");
	    gmisessiontimeout = 0;
	}
	//printf("logoff to del the cookie, usercookie now is %s, "
	//	"usertype now is %s, sessiontimeout now is %d\n",
	//	usercookie, usertype, sessiontimeout);
	buffer_append_string(b, "Response=Success\r\n"
		"Message=Logoff Success\r\n");

	return 0;
}

static void print_message (DBusMessage *message )
{
    /*const char *sender;
    const char *destination;
    int message_type;
    message_type = dbus_message_get_type( message );
    sender = dbus_message_get_sender( message );
    destination = dbus_message_get_destination( message );
    print_iter ( message, 1);*/
}

static int handle_ptzctrl(buffer *b, const struct message *m)
{
    const char *type = NULL;
    const char *param = NULL;

    type = msg_get_header(m, "type");
    param = msg_get_header(m, "param");
    if( type != NULL ){
        dbus_send_ptz_control(type, atoi(param), 0, 0, 0);
        buffer_append_string(b, "Response=Success\r\n");
    }else{
        buffer_append_string(b, "Response=Error\r\n");
    }
}

static int handle_setvolume(server *srv, connection *con, buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *temp = NULL;
    int ringvol = 0, mediavol = 0, notifyvol = 0, speakervol = 0;
    char *ringTone = NULL, *notifyTone = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setVolume" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        temp = msg_get_header(m, "ringVal");
        if ( temp == NULL )
        {
            ringvol = 0;
        }else{
            ringvol = atoi(temp);
        }

        temp = msg_get_header(m, "mediaVal");
        if ( temp == NULL )
        {
            mediavol = 0;
        }else{
            mediavol = atoi(temp);
        }

        temp = msg_get_header(m, "notifyVal");
        if ( temp == NULL )
        {
            notifyvol = 0;
        }else{
            notifyvol = atoi(temp);
        }

        temp = msg_get_header(m, "speakerVal");
        if ( temp == NULL )
        {
            speakervol = 0;
        }else{
            speakervol = atoi(temp);
        }

        ringTone = msg_get_header(m, "ringTone");
        if ( ringTone == NULL )
        {
            ringTone = "";
        }else{
            uri_decode((char*)ringTone);
        }

        notifyTone = msg_get_header(m, "notifyTone");
        if ( notifyTone == NULL )
        {
            notifyTone = "";
        }else{
            uri_decode((char*)notifyTone);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &ringvol ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &mediavol ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &notifyvol ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &speakervol ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &ringTone ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &notifyTone ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }
    return 0;
}

static int handle_setpreset(buffer *b, const struct message *m)
{
    const char *action = NULL;
    const char *position = NULL;

    action = msg_get_header(m, "type");
    position = msg_get_header(m, "position");
    if( action != NULL && position != NULL ){
        char *cmd = NULL;
        cmd = malloc(128);
        memset(cmd, 0, 128);
        if(!strcasecmp(action, "add"))
            snprintf(cmd, 128, "am broadcast -a com.base.module.preset.PRESET_SET --ei position %s", position);
        else if(!strcasecmp(action, "delete"))
            snprintf(cmd, 128, "am broadcast -a com.base.module.preset.PRESET_DEL --ei position %s", position);
        printf("cmd = %s\n", cmd);
        int result = mysystem(cmd);
        if( result )
            buffer_append_string(b, "Response=Error\r\n");
        else
            buffer_append_string(b, "Response=Success\r\n");
    }else{
        buffer_append_string(b, "Response=Error\r\n");
    }
}

static int handle_getcolore(buffer *b)
{
    char res[64] = "";
    xmlChar *key = NULL;
    xmlDoc *doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;

    doc = xmlReadFile( CONF_COLORE, NULL, 0 );
    if (doc == NULL)
    {
        printf("error: could not parse file %s\n", CONF_COLORE);
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Configuration File Not Found\r\n");
        return -1;
    }

    buffer_append_string (b, "Response=Success\r\n");

    /*Get the root element node */
    root_element = xmlDocGetRootElement(doc);
    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
    {
        if (cur_node->type == XML_ELEMENT_NODE)
        {
            if ((!xmlStrcmp(cur_node->name, BAD_CAST "enable")))
            {
                key = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                if (key != NULL)
                {
                    snprintf(res, sizeof(res), "enable=%s\r\n", (char *) key );
                    buffer_append_string(b, res);
                    xmlFree(key);
                }else
                {
                    buffer_append_string(b, "enable=\r\n");
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "username")))
            {
                key = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                if (key != NULL)
                {
                    snprintf(res, sizeof(res), "username=%s\r\n", (char *) key );
                    buffer_append_string(b, res);
                    xmlFree(key);
                }else
                {
                    buffer_append_string(b, "username=\r\n");
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "password")))
            {
                key = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                if (key != NULL)
                {
                    snprintf(res, sizeof(res), "password=%s\r\n", (char *) key );
                    buffer_append_string(b, res);
                    xmlFree(key);
                }else
                {
                    buffer_append_string(b, "password=\r\n");
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "save-password")))
            {
                key = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                if (key != NULL)
                {
                    snprintf(res, sizeof(res), "save-password=%s\r\n", (char *) key );
                    buffer_append_string(b, res);
                    xmlFree(key);
                }else
                {
                    buffer_append_string(b, "save-password=\r\n");
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "auto-login")))
            {
                key = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                if (key != NULL)
                {
                    snprintf(res, sizeof(res), "auto-login=%s\r\n", (char *) key );
                    buffer_append_string(b, res);
                    xmlFree(key);
                }else
                {
                    buffer_append_string(b, "auto-login=\r\n");
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "login-success")))
            {
                key = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                if (key != NULL)
                {
                    snprintf(res, sizeof(res), "loginsuc=%s\r\n", (char *) key );
                    buffer_append_string(b, res);
                    xmlFree(key);
                }else
                {
                    buffer_append_string(b, "loginsuc=\r\n");
                }
            }
        }
    }

    /*free the document */
    xmlFreeDoc(doc);
    return 1;
}

static int handle_putcolore (buffer *b, const struct message *m)
{
    xmlDocPtr doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    const char *temp = NULL;
    char val[256] = "";

    doc = xmlReadFile(CONF_COLORE, NULL, 0);

    if (doc == NULL)
    {
        printf("error: could not parse file %s\n", CONF_COLORE);
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Configuration File Not Found\r\n");
        return -1;
    }

    /*Get the root element node */
    root_element = xmlDocGetRootElement(doc);

    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
    {
        if (cur_node->type == XML_ELEMENT_NODE)
        {
            if ((!xmlStrcmp(cur_node->name, BAD_CAST "enable")))
            {
                temp = msg_get_header(m, "enable");
                if ( temp != NULL )
                {
                    memset(val, 0, sizeof(val));
                    strncpy(val, temp, sizeof(val) - 1);
                    uri_decode(val);
                    //tempint = atoi(val);
                    //snprintf(tempbuf, sizeof(tempbuf), "%d", tempint);
                    xmlNodeSetContent(cur_node, (xmlChar *) val);
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "username")))
            {
                temp = msg_get_header(m, "username");
                if ( temp != NULL )
                {
                    memset(val, 0, sizeof(val));
                    strncpy(val, temp, sizeof(val) - 1);
                    uri_decode(val);
                    xmlNodeSetContent(cur_node, (xmlChar *) val);
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "password")))
            {
                temp = msg_get_header(m, "pwd");
                if ( temp != NULL )
                {
                    memset(val, 0, sizeof(val));
                    strncpy(val, temp, sizeof(val) - 1);
                    uri_decode(val);
                    xmlNodeSetContent(cur_node, (xmlChar *) val);
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "save-password")))
            {
                temp = msg_get_header(m, "savepwd");
                if ( temp != NULL )
                {
                    memset(val, 0, sizeof(val));
                    strncpy(val, temp, sizeof(val) - 1);
                    uri_decode(val);
                    xmlNodeSetContent(cur_node, (xmlChar *) val);
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "auto-login")))
            {
                temp = msg_get_header(m, "autologin");
                if ( temp != NULL )
                {
                    memset(val, 0, sizeof(val));
                    strncpy(val, temp, sizeof(val) - 1);
                    uri_decode(val);
                    xmlNodeSetContent(cur_node, (xmlChar *) val);
                }
            }
        }
    }

    xmlSaveFormatFileEnc(CONF_COLORE, doc, "UTF-8", 1);
    xmlFreeDoc(doc);
    xmlCleanupParser();
    xmlMemoryDump();
    sync();

    buffer_append_string (b, "Response=Success\r\n");

    return 1;
}

static int handle_changepwd (buffer *b, const struct message *m)
{
    const char *uname = NULL;
    const char *oldpwd = NULL;
    const char *pwd = NULL;
    /*char val[256] = "";
    memset(val, 0, sizeof(val));
    strncpy(val, temp, sizeof(val) - 1);
    uri_decode(val);*/

    uname = msg_get_header(m, "uname");
    uri_decode((char *)uname);
    oldpwd = msg_get_header(m, "oldpwd");
    uri_decode((char *)oldpwd);
    pwd = msg_get_header(m, "pwd");
    uri_decode((char *)pwd);
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_COLORE_CHANGE_PWD);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_STRING, &uname, DBUS_TYPE_STRING, &oldpwd, DBUS_TYPE_STRING, &pwd, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );

#endif

    buffer_append_string (b, "Response=Success\r\n");
    return 0;
}

static int handle_chgcolorepwdrsps(buffer *b)
{
    char res[32] = "";

    buffer_append_string (b, "Response=Success\r\n");

    snprintf(res, sizeof(res), "chgcolorepwdrsps=%d\r\n", chgcolorepwdrsps);
    buffer_append_string(b, res);

    if(chgcolorepwdrsps != 1)
        chgcolorepwdrsps = 1;
    return 0;
}

static int handle_coloreExist(buffer *b)
{
    const char *val = NULL;
    char res[64] = "";

#ifdef BUILD_ON_ARM
    val = nvram_my_get("oem_id");
#else
    val = "unknown";
#endif
    snprintf(res, sizeof(res), "Response=Success\r\ncoloreexist=%s\r\n", val);
    buffer_append_string(b, res);

    return 0;
}
#endif

static int handle_get(buffer *b, const struct message *m)
{
    int x;
    char hdr[64] = "";
    char *res = NULL;

    const char *val = NULL, *var = NULL;
    const char *resType = NULL;
    char *temp = NULL;
    char *newtemp = NULL;
    const char * jsonCallback = NULL;

    resType = msg_get_header(m, "format");

    if((resType != NULL) && !strcasecmp(resType, "json"))
    {
        jsonCallback = msg_get_header( m, "jsoncallback" );    
    }
    else
    {
        buffer_append_string (b, "Response=Success\r\n");
    }

    for (x = 0; x < 10000; x++)
    {
    	snprintf(hdr, sizeof(hdr), "var-%04d", x);
    	var = msg_get_header(m, hdr);
        if( var != NULL )
            uri_decode(var);
#ifndef BUILD_RECOVER
        if ( (var == NULL) )
        {
            break;
        }else if( protected_pvalue_find(pvalue_protect, (char *) var) )
        {
            continue;
        }
#else
        if ( (var == NULL) )
        {
            break;
        }
#endif

        char *fromCache = pvaluelist_get( pvalue_cache, var );
        if ( fromCache != NULL )
        {
            val = fromCache;
        }
        else
        {
#ifdef BUILD_ON_ARM
            val = nvram_my_get(var);
#else
            val = "Unknow";
#endif
        }

        res = malloc(strlen(var)+strlen(val)+16);

        if(jsonCallback == NULL)
        {
            sprintf(res,"%s=%s\r\n", var, val);
            buffer_append_string(b, res);
        }
        else
        {
            if(temp == NULL)
            {
                sprintf(res,"\"%s\" : \"%s\"", var, val);
                temp = malloc((64 + strlen(res) + strlen(jsonCallback)) * sizeof(char));
                sprintf(temp, "%s({\"res\" : \"success\", %s", jsonCallback, res);
            }
            else
            {
                sprintf(res,", \"%s\" : \"%s\"", var, val);
                newtemp = realloc(temp, (strlen(temp) + strlen(res)) * sizeof(char));

                if(newtemp == NULL)
                {
                    free(temp);
                    temp = NULL;
                    break;
                }
                else
                {
                    temp = newtemp;
                    strcat(temp, res);
                }
            }
        }

        free(res);
    }

    if(jsonCallback != NULL)
    {
        if(temp == NULL)
        {
            temp = malloc((strlen(jsonCallback) + 128) * sizeof(char));
            sprintf(temp, "%s(%s)", jsonCallback, "{\"res\": \"error\", \"msg\" : \"new memory failed or no value\"}");
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            strcat(temp, "})");
            buffer_append_string( b, temp );
            free(temp);
        }
    }

    return 0;
}

#ifndef BUILD_RECOVER


static int dbus_send_cfupdated ( void )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_CFUPDATED);
    if ( message == NULL )
    {
        printf( "message is NULL\n" );
        return 1;
    }

    dbus_message_append_args( message,  DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif
    return 0;
}

static int dbus_send_applyed ( void )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_APPLYED);
    if ( message == NULL )
    {
        printf( "message is NULL\n" );
        return 1;
    }

    dbus_message_append_args( message,  DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif
    return 0;
}

/*static void get_blf_nametype(int extIndex, int *nametype, int *fromserv)
{
    xmlDocPtr doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    xmlChar *key = NULL;
	xmlChar *val = NULL;
    const char *tempbuf = NULL;
     
    if(extIndex == 0)
    	doc = xmlReadFile(CONF_MPK, NULL, 0);
    else
	doc = xmlReadFile(CONF_MPKEXT, NULL, 0);
 
    if (doc == NULL) 
    {
        printf("error: could not parse file %s\n", CONF_MPK);
        return 0;
    }
    
	tempbuf = malloc(24);
	snprintf(tempbuf, 24, "display_format%d", extIndex);
	printf("get extindex is %s\n", tempbuf);
    //int nametype = 0;
	//int fromserv = 0;
    
    //Get the root element node
	root_element = xmlDocGetRootElement(doc);
    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next) 
    {
    	if (cur_node->type == XML_ELEMENT_NODE) 
        {
        	if ((!xmlStrcmp(cur_node->name, BAD_CAST "int")))
            {
            	key = xmlGetProp(cur_node, BAD_CAST "name");
                if( key != NULL )
                {
                	if( strcmp( (char *)key, tempbuf) == 0 ) 
		            {
		            	//nametype = atoi( (char*)xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1) );
						val = xmlGetProp(cur_node, BAD_CAST "value");
						if (val != NULL) {
							*nametype = atoi(val);

							xmlFree(val);
						}
		            }
                	xmlFree(key);
                }
            }
			if ((!xmlStrcmp(cur_node->name, BAD_CAST "boolean")))
			{
				key = xmlGetProp(cur_node, BAD_CAST "name");
				if (key != NULL)
				{
					if (strcmp((char*)key, "displaynameshowfromserver") == 0)
					{
						val = xmlGetProp(cur_node, BAD_CAST "value");
						if (val != NULL) {
							if (strcmp(val, "true") == 0)
								*fromserv = 1;
							else
								*fromserv = 0;

							xmlFree(val);
						}
					}
					xmlFree(key);
				}
			}
        }
    }
    xmlFreeDoc(doc);
    //return nametype;
}

static int handle_getmpkexist(buffer *b, const struct message *m)
{
    sqlite3 *db;
    int rc;
    char * errmsg = NULL;
    char **dbResult;
    int nRow, nColumn;
    char *temp = NULL, *number = NULL, *oldIndex = NULL;

    rc = sqlite3_open("/data/data/com.base.module.mpkshutcut/databases/mpk.db", &db);
    if( rc ){
        printf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        buffer_append_string(b, "0");
        return 0;
    }
    number = msg_get_header(m, "number");
    uri_decode(number);
    int acct = 0, mode = 0;
    acct = atoi( msg_get_header(m, "account") );
    mode = atoi( msg_get_header(m, "mode") );
    temp = malloc( 128 );

    oldIndex = msg_get_header(m, "index");
    if( oldIndex != NULL )
    {
        if( mode == 2 || mode == 4 || mode == 5 )
            snprintf(temp, 128, "select * from mpkinfo where accountid=\"%s\" and mode=%d and id!=%d;", number, mode, atoi(oldIndex) );
        else
            snprintf(temp, 128, "select * from mpkinfo where accountid=\"%s\" and account=%d and mode=%d and id!=%d;", number, acct, mode, atoi(oldIndex));
    }else
    {
        if( mode == 2 || mode == 4 || mode == 5 )
            snprintf(temp, 128, "select * from mpkinfo where accountid=\"%s\" and mode=%d;", number, mode);
        else
            snprintf(temp, 128, "select * from mpkinfo where accountid=\"%s\" and account=%d and mode=%d;", number, acct, mode);
    }
    printf("temps is %s\n", temp);
    rc = sqlite3_get_table ( db, temp , &dbResult, &nRow, &nColumn, &errmsg );
    free(temp);
    if( rc == SQLITE_OK )
    {
        printf( "query %d records, nColumn is %d.\n", nRow, nColumn );
        temp = malloc( 8 );
        snprintf(temp, 8, "%d", nRow);
        buffer_append_string(b, temp);
        free(temp);
    }else
    {
        buffer_append_string(b, "0");
        printf(stderr, "SQL error: %s\n", errmsg);
        sqlite3_free(errmsg);
    }
    sqlite3_free_table ( dbResult );
    sqlite3_close(db);

    return 1;
}

// search CONF_MPK file. get the index of applied account via mpkindex(which board)
static int handle_getapldacct(buffer *b, const struct message *m)
{*/
    /* acct_name: "name" attr of "int" node
     * value: "value" attr of "int" node
     * index_str: change from value
     * name_str: change from acct_name
     * ptr: return of strstr function
     * mpkindex: the request argument
     */  	
 /*   xmlDoc *doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    xmlChar *acct_name = NULL;
    xmlChar *value = NULL;
    char *index_str = NULL;
    char *name_str = NULL;
    char *res = NULL;
    char *sub_str = NULL;
    char *temp_substr = NULL;
    int index_value = 0;
    int mpkindex = 0;
    int len = 0;
    int flag = 0;

    //get the request argument
    index_str = msg_get_header(m, "mpkindex");
    if(index_str != NULL)
    {
    	mpkindex = atoi(index_str);
        doc = xmlReadFile( CONF_MPK, NULL, 0);
        if(doc == NULL)
        {
            printf("error: could not parse file %s\n", CONF_MPK);
            buffer_append_string(b, "Response=Error\r\n"
                "Message=Configuration File Not Found\r\n");
            return -1;
        }

        buffer_append_string(b, "Response=Success\r\nacctindex=");

        res = malloc(2);

        root_element = xmlDocGetRootElement(doc);
        cur_node = root_element->xmlChildrenNode;

	while(cur_node != NULL)
        {
            if(!(xmlStrcmp(cur_node->name, BAD_CAST "int")))
            {
        //get the "value" attr. and compared with the request argument
                value = xmlGetProp(cur_node, BAD_CAST "value");
                index_value = atoi((char*)value);
                if(mpkindex == index_value)
                {
            //get the "name" attr
                    acct_name = xmlGetProp(cur_node, BAD_CAST "name");
                    name_str = (char*)acct_name;

		    len = strlen(name_str)-1;
		    
            // get the substr of name_str. remove the last number
		    sub_str = malloc(len+1);
		    temp_substr = sub_str;

		    while(len--)
			*(sub_str++) = *(name_str++);
		    *sub_str = '\0';

            //compare the substr with "blfgroup". if equal,node is the wanted
                    if(!(strcmp("blfgroup",temp_substr)))
                    {
            //get the account index.the last char of name_str
                        res[0] = *name_str;
                        res[1] = '\0';
                        if(flag!=0)
                            buffer_append_string(b,",");
                        buffer_append_string(b,res);
                        flag = 1;
                    }
		    free(temp_substr);
		    xmlFree(acct_name);
                }
                xmlFree(value);
            }
            cur_node = cur_node->next;
        }

        free(res);
        xmlFree(doc);
    }
    return 0;
}

static int handle_getmpkinfo(buffer *b, const struct message *m)
{
	char *temp = NULL;
	const char *val = NULL;
    
	temp = msg_get_header(m, "mpkindex");
	int mpkindex = atoi(temp);
	//temp = msg_get_header(m, "page");
	//int pageindex = atoi(temp);
	
	//printf("mpkindex:%d	page:%d\n", mpkindex, pageindex);

	//int addnum = pageindex * 100 + mpkindex * 200;
	int addnum = mpkindex * 200;
	printf("addnum is %d\n", addnum);
	int tmpint;
	char tempbuf[8] = "";
	char *curNumber = NULL, *curName = NULL, *curPos = NULL;
	int curAcct, curMode;
	int count = 0, len;
	int nametype = 0;
	int fromserv = 0;

	buffer_append_string(b, "{\"Response\":\"Success\",");

	//nametype = get_blf_nametype(mpkindex + 1);
	get_blf_nametype(mpkindex + 1, &nametype, &fromserv);
	temp = malloc(64);
	snprintf(temp, 64, "\"nametype\":\"%d\",\"Data\":[", nametype);
	buffer_append_string(b, temp);

	for( int i = 0; i < 40; i ++ )
	{
        tmpint = mpkextstartpvalue[1] + addnum + 5 * i;
        snprintf(tempbuf, 8, "%d", tmpint);
        curAcct = atoi( nvram_my_get(tempbuf) );

        tmpint = mpkextstartpvalue[3] + addnum + 5 * i;
        snprintf(tempbuf, 8, "%d", tmpint);
        curNumber = nvram_my_get(tempbuf);

        tmpint = mpkextstartpvalue[0] + addnum + 5 * i;
        snprintf(tempbuf, 8, "%d", tmpint);
        curMode = atoi( nvram_my_get(tempbuf) );

        tmpint = mpkextstartpvalue[2] + addnum + 5 * i;
        snprintf(tempbuf, 8, "%d", tmpint);
        curName = nvram_my_get(tempbuf);

        tmpint = mpkextstartpvalue[4] + addnum + 5 * i;
        snprintf(tempbuf, 8, "%d", tmpint);
        //curPos = atoi( nvram_my_get(tempbuf) );
	curPos = nvram_my_get(tempbuf);

        len =  strlen(curNumber) + strlen(curName) + strlen(curPos) + 128;
        temp = malloc( len );
        if(!count)
        {
            snprintf(temp, len, "{\"name\":\"%s\",\"number\":\"%s\",\"acct\":\"%d\",\"mode\":\"%d\",\"pos\":\"%s\"}", curName, curNumber, curAcct, curMode, curPos);
        }
        else
        {
            snprintf(temp, len, ",{\"name\":\"%s\",\"number\":\"%s\",\"acct\":\"%d\",\"mode\":\"%d\",\"pos\":\"%s\"}", curName, curNumber, curAcct, curMode, curPos);
        }
        buffer_append_string(b, temp);
        free(temp);
  		count ++;
	}
	buffer_append_string(b, "]}");
	
}

static int handle_getblf(buffer *b, const struct message *m)
{
    //const char *sqlstr = NULL;

    sqlite3 *db;
    int rc;
    char * errmsg = NULL;
    char **dbResult;
    int nRow, nColumn;
    int i , j, count = 0, isTone = 0;
    int index, len;
    char *temp = NULL, *name = NULL;

    rc = sqlite3_open("/data/data/com.base.module.mpk/databases/mpk.db", &db);
	
    if( rc ){
        printf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 0;
    }
    printf("db open suc\n");
    if(0){
        rc = sqlite3_exec(db, sqlstr, callback, 0, &errmsg);
        if( rc!=SQLITE_OK )
        {
            printf(stderr, "SQL error: %s\n", errmsg);
            sqlite3_free(errmsg);
        }
    }
    temp = msg_get_header(m, "mpkindex");
    int mpkindex = atoi(temp);
    int nametype = 0;
	int fromserv = 0;
    //nametype = get_blf_nametype(mpkindex);
	get_blf_nametype(mpkindex, &nametype, &fromserv);

    int blfcount = 0;

    if(0){
    temp = malloc( 64 );
    snprintf(temp, 64, "select * from mpkinfo where mode=1;");
    rc = sqlite3_get_table ( db, temp , &dbResult, &nRow, &nColumn, &errmsg );
    free(temp);
    if( rc == SQLITE_OK )
    {
        blfcount = nRow;
    }else
    {
        printf(stderr, "SQL error: %s\n", errmsg);
        sqlite3_free(errmsg);
    }
    }

    temp = malloc( 64 );
    //snprintf(temp, 64, "select * from mpkinfo where showpalce=%d order by sortindex;", mpkindex);
    snprintf(temp, 64, "select * from mpkinfo order by sortindex;");
    printf("temps is %s\n", temp);
    rc = sqlite3_get_table ( db, temp , &dbResult, &nRow, &nColumn, &errmsg );
    free(temp);
    char *curId = NULL, *curNumber = NULL, *curName = NULL;
    int curAcct, curMode;
    if( rc == SQLITE_OK )
    {
		blfcount = nRow;
        index = nColumn;
        printf( "query %d records, nColumn is %d.\n", nRow, nColumn );
        temp = malloc( 128 );
        snprintf(temp, 128, "{\"Response\":\"Success\",\"nametype\":\"%d\",\"fromserv\":\"%d\",\"blfcount\":\"%d\",\"Data\":[", nametype, fromserv, blfcount);
        buffer_append_string(b, temp);
        free(temp);
        for( i = 0; i < nRow ; i++ )
        {
            printf("Record %d:\n" , i+1 );
            for( j = 0 ; j < nColumn; j++ )
            {
                if( !strcasecmp(dbResult[j], "id") )
                {
                    curId = strdup(dbResult[index]);
                }
                else if( !strcasecmp(dbResult[j], "number") )
                {
                    curNumber = strdup(dbResult[index]);
                }else if( !strcasecmp(dbResult[j], "displayname") )
                {
                	curName = strdup(dbResult[index]);
                }else if( !strcasecmp(dbResult[j], "gsaccount") )
                {
                    curAcct = atoi(dbResult[index]);
                }else if( !strcasecmp(dbResult[j], "mode") )
                {
                    curMode = atoi(dbResult[index]);
                }
                ++index;
            }
            if( curNumber != NULL )
            {
            	len =  strlen(curNumber) + strlen(curName) + 64;
                temp = malloc( len );
                if(!count)
                {
                    snprintf(temp, len, "{\"id\":\"%s\",\"name\":\"%s\",\"number\":\"%s\",\"acct\":\"%d\",\"mode\":\"%d\"}", curId, curName, curNumber, curAcct, curMode);
                }
                else
                {
                    snprintf(temp, len, ",{\"id\":\"%s\",\"name\":\"%s\",\"number\":\"%s\",\"acct\":\"%d\",\"mode\":\"%d\"}", curId, curName, curNumber, curAcct, curMode);
                }
                count++;
                buffer_append_string(b, temp);
                free(curId);
                free(curName);
                free(curNumber);
                free(temp);
            }
        }
        buffer_append_string(b, "]}");
    }else
    {
        printf(stderr, "SQL error: %s\n", errmsg);
        sqlite3_free(errmsg);
    }
    sqlite3_free_table ( dbResult );
    sqlite3_close(db);
    
    return 1;
    
}
*/
static int dbus_send_string ( const char *dbusname )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, dbusname);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

/*static int dbus_send_mpk_order ( const int arg1, const int arg2, const int arg3 )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_BLFREORDER);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INT32, &arg1, DBUS_TYPE_INT32, &arg2, DBUS_TYPE_INT32, &arg3, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

static int dbus_send_mpkext_order (const int arg1, const int arg2, const int arg3)
{
	DBusMessage* message;
	
	if( bus == NULL )
	{
		printf( "Error: Dbus bus is NULL\n" );
		return 1;
	}

	message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_BLFEXTREORDER);
	if( message == NULL)
	{
		printf( "message is NULL\n" );
		return 1;
	}

	dbus_message_append_args( message, DBUS_TYPE_INT32, &arg1, DBUS_TYPE_INT32, &arg2, DBUS_TYPE_INT32, &arg3, DBUS_TYPE_INVALID );

	dbus_connection_send (bus, message, NULL );
	dbus_message_unref( message );

	return 0;
}

static int dbus_send_blf_int ( const char *dbusname, const int arg1 )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, dbusname);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INT32, &arg1, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

static int dbus_send_blf_uri_updated ( const int arg1, const int arg2, const char* arg3 )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_MPKURIUPDATED);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INT32, &arg1, DBUS_TYPE_INT32, &arg2, DBUS_TYPE_STRING, &arg3, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

static int dbus_send_blf_string ( const char *dbusname, const char* arg1 )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, dbusname);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_STRING, &arg1, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

static int dbus_send_blf_nametype_updated (const int extindex, const int nametype, const int isfromserv)
{
	DBusMessage* message;
	
	dbus_bool_t bool_fromserv;

	if( bus == NULL )
	{
		printf( "Error: Dbus bus is NULL\n" );
		return 1;
	}

	message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_BLFNAMEUPDATED );
	if( message ==NULL )
	{
		printf( "message is NULL\n" );
		return 1;
	}

	if (isfromserv == 0)
		bool_fromserv = false;
	else
		bool_fromserv = true;

	dbus_message_append_args( message, DBUS_TYPE_INT32, &extindex, DBUS_TYPE_INT32, &nametype, DBUS_TYPE_BOOLEAN, &bool_fromserv, DBUS_TYPE_INVALID);
	dbus_connection_send( bus, message, NULL);
	dbus_message_unref(message);

	return 0;
}

static int dbus_send_mpkext_data_updated ( const int nvramindex )
{ 
	DBusMessage* message;
	
	if( NULL == bus )
	{
		printf( "Error:Dbus bus is NULL\n" );
		return 1;
	}

	message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_MPKEXTDATAUPDATED );
	if( NULL == message )
	{
		printf( "message is NULL\n" );
		return 1;
	}

	dbus_message_append_args( message, DBUS_TYPE_INT32, &nvramindex, DBUS_TYPE_INVALID);
	dbus_connection_send( bus, message, NULL);
	dbus_message_unref( message );

	return 0;
}

static int dbus_send_mpk_data_updated ( const int type, const int opindex, const int acct, const char* name, const char* number, const int mode, const int extIndex )
{
	printf("type:%d, opindex:%d, acct:%d, name:%s, number:%s, mode:%d, extindex: %d\n", type, opindex, acct, name, number, mode, extIndex);
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_MPKDATAUPDATED);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INT32, &type,
    								DBUS_TYPE_INT32, &opindex, 
    								DBUS_TYPE_INT32, &acct, 
    								DBUS_TYPE_STRING, &name, 
    								DBUS_TYPE_STRING, &number, 
    								DBUS_TYPE_INT32, &mode, 
    								DBUS_TYPE_INT32, &extIndex, 
    								DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

static int handle_putmpkorder(buffer *b, const struct message *m)
{
	const char *extIndex = NULL;
    extIndex = msg_get_header(m, "extIndex");
    
    const char *fromIndex = NULL;
    fromIndex = msg_get_header(m, "from");
    
    const char *toIndex = NULL;
    toIndex = msg_get_header(m, "to");
    
    buffer_append_string (b, "Response=Success\r\n");
    dbus_send_mpk_order( atoi(extIndex), atoi(fromIndex), atoi(toIndex) );
}

static int handle_putmpkext(buffer *b, const struct message *m)
{
	int extindex = 0;
	int nametype = 0;
	int isfromserv = 0;
	char *temp = NULL;

	temp = msg_get_header(m, "extIndex");
	if ( temp!= NULL)
		extindex = atoi(temp);
	else 
	{
		buffer_append_string (b, "Response=Error\r\n");
        return 0;
	}
	
	temp = msg_get_header(m, "nametype");
	nametype = atoi(temp);

	temp = msg_get_header(m, "fromserv");
	isfromserv = atoi(temp);

	dbus_send_blf_nametype_updated(extindex, nametype, isfromserv);
	buffer_append_string (b, "Response=Success\r\n");
}

static int handle_putmpk(buffer *b, const struct message *m)
{
    char *temp = NULL, *tempbuf = NULL, *urivalue = NULL;
    int extindex = 0;
    int nametype = 0;
    
    temp = msg_get_header(m, "extIndex");
    if( temp != NULL )
        extindex = atoi(temp);
    else
    {
    	buffer_append_string (b, "Response=Error\r\n");
    	return 0;
    }
    
    //temp = msg_get_header(m, "nametype");

    //nametype = atoi(temp);
    //dbus_send_blf_nametype_updated(extindex, nametype);
	
    //buffer_append_string (b, "Response=Success\r\n");

    urivalue = msg_get_header(m, "urivalue");
    temp = msg_get_header(m, "uripos");
    nvram_set(temp, urivalue);
  
    nvram_commit();

    dbus_send_blf_int( SIGNAL_BLFUPDATED, -1);
    dbus_send_applyed();

    if( urivalue != NULL )
    {
        uri_decode(urivalue);
        dbus_send_blf_uri_updated( atoi(msg_get_header(m, "uriacct")), extindex, urivalue);
    }
	buffer_append_string (b, "Response=Success\r\n");

    return 1;
}

static int handle_putblfext(buffer *b, const struct message *m)
{
    const char *optype = NULL, *number = NULL, *name = NULL, *acct = NULL, *mode = NULL, *pos = NULL, *eventlist = NULL, *temp = NULL;
    int type, opindex, extIndex, posIndex, nvramIndex, exchangeIndex, isExchange, isDataChanged;

    optype = msg_get_header(m, "type");
    opindex = atoi(msg_get_header(m, "index"));
    extIndex = atoi(msg_get_header(m, "extIndex"));
    pos = msg_get_header(m, "posIndex");
    posIndex = atoi(pos);
    int addnum = 5 * ( posIndex - 1 ) + 200 * extIndex;
    nvramIndex = 40 * extIndex + ( posIndex -1 );
    int tempindex;
    char tempbuf[8] = "";
    if ( optype != NULL )
    {
        if( !strcasecmp(optype, "add") || !strcasecmp(optype, "edit") )
        {
            //type = 0;
            acct = msg_get_header(m, "acct");
            name = msg_get_header(m, "name");
            uri_decode(name);
            number = msg_get_header(m, "id");
            uri_decode(number);
            mode = msg_get_header(m, "mode");
            tempindex = mpkextstartpvalue[0] + addnum;
            snprintf(tempbuf, 8, "%d", tempindex);
            printf("tempbuf is :%d/ %s\n", tempindex, tempbuf);
			nvram_set(tempbuf, mode);

            tempindex = mpkextstartpvalue[1] + addnum;
            snprintf(tempbuf, 8, "%d", tempindex);
            nvram_set(tempbuf, acct);

            tempindex = mpkextstartpvalue[3] + addnum;
            snprintf(tempbuf, 8, "%d", tempindex);
            nvram_set(tempbuf, number);

            tempindex = mpkextstartpvalue[2] + addnum;
            snprintf(tempbuf, 8, "%d", tempindex);
            nvram_set(tempbuf, name);

            tempindex = mpkextstartpvalue[4] + addnum;
            snprintf(tempbuf, 8, "%d", tempindex);
	    	if(!strcmp(mode, "3")) 
	    	{
				eventlist = msg_get_header(m, "eventlist");
            	nvram_set(tempbuf, eventlist);
	    	}
		    else
				nvram_set(tempbuf, pos);

            //dbus_send_mpk_data_updated(type, opindex, acct, name, number, mode, extIndex);
        }
        else if( !strcasecmp(optype, "delete") )
        {
            //type = 1;
            tempindex = mpkextstartpvalue[0] + addnum;
            snprintf(tempbuf, 8, "%d", tempindex);
            nvram_set(tempbuf, "");

            tempindex = mpkextstartpvalue[1] + addnum;
            snprintf(tempbuf, 8, "%d", tempindex);
            nvram_set(tempbuf, "");

            tempindex = mpkextstartpvalue[3] + addnum;
            snprintf(tempbuf, 8, "%d", tempindex);
            nvram_set(tempbuf, "");

            tempindex = mpkextstartpvalue[2] + addnum;
            snprintf(tempbuf, 8, "%d", tempindex);
            nvram_set(tempbuf, "");

            tempindex = mpkextstartpvalue[4] + addnum;
            snprintf(tempbuf, 8, "%d", tempindex);
            nvram_set(tempbuf, "");
            //dbus_send_mpk_data_updated(type, opindex, "", "", "", 0, extIndex);
		}

#ifdef BUILD_ON_ARM
		nvram_commit();
#endif

		temp = msg_get_header(m, "isexchange");
		isExchange = atoi(temp);
		if( !strcasecmp(optype, "edit") && isExchange == 1 ) {
			temp = msg_get_header(m, "exchangepos");
			exchangeIndex = 40 * extIndex + ( atoi(temp)-1 );
			//dbus_send_mpkext_order( nvramIndex, exchangeIndex );
		
			temp = msg_get_header(m, "isdatachanged");
			isDataChanged = atoi(temp);
			if(isDataChanged == 1)
				//dbus_send_mpkext_data_updated(exchangeIndex);
				dbus_send_mpkext_order( nvramIndex, exchangeIndex, 1);
			else
				dbus_send_mpkext_order( nvramIndex, exchangeIndex, 0);
		}else if ( isExchange == -1 )
			dbus_send_mpkext_data_updated ( nvramIndex );

    	buffer_append_string (b, "Response=Success\r\n");
    }else
    {
    	buffer_append_string (b, "Response=Error\r\n");
    }
}

static int handle_putblf(buffer *b, const struct message *m)
{
    const char *optype = NULL, *number = NULL, *name = NULL;
    int type, opindex, extIndex, acct, mode;
    
    optype = msg_get_header(m, "type");
    opindex = atoi(msg_get_header(m, "index"));
    extIndex = atoi(msg_get_header(m, "extIndex"));
    if ( optype != NULL )
    {
    	if( !strcasecmp(optype, "add") )
    	{
    		type = 0;
    		acct = atoi(msg_get_header(m, "acct"));
    		name = msg_get_header(m, "name");
            uri_decode(name);
            number = msg_get_header(m, "id");
            uri_decode(number);
    		mode = atoi( msg_get_header(m, "mode") );
    		dbus_send_mpk_data_updated(type, opindex, acct, name, number, mode, extIndex);
    	}
    	else if( !strcasecmp(optype, "edit") )
    	{
    		type = 2;
    		acct = atoi(msg_get_header(m, "acct"));
    		name = msg_get_header(m, "name");
            uri_decode(name);
            number = msg_get_header(m, "id");
            uri_decode(number);
            mode = atoi( msg_get_header(m, "mode") );
    		dbus_send_mpk_data_updated(type, opindex, acct, name, number, mode, extIndex);
    	}
    	else if( !strcasecmp(optype, "delete") )
    	{
    		type = 1;
    		dbus_send_mpk_data_updated(type, opindex, 0, "", "", 0, extIndex);
    	}
    	buffer_append_string (b, "Response=Success\r\n");
    }else
    {
    	buffer_append_string (b, "Response=Error\r\n");
    }
}*/

static int handle_applyresponse (buffer *b)
{
    char res[32] = "";

    buffer_append_string (b, "Response=Success\r\n");

    snprintf(res, sizeof(res), "phrebootresponse=%d\r\n", phonerebooting);
    buffer_append_string(b, res);

    return 0;
}

static int handle_applycert (buffer *b)
{
    int result = -1;

    result = system("/system/xbin/makeTLScertFile.sh &");
    if (result == 0)
        buffer_append_string(b, "Response=Success\r\n");
    else
        buffer_append_string(b, "Response=Error\r\n");

    return 0;
}

static int handle_applypvalue(buffer *b, const struct message *m)
{
    if( phonerebooting )
    {
        buffer_append_string(b, "Response=Error\r\n");
        return 0;
    }

    int result = apply_cache_pvalue(0);
    if(result != 0)
    {
        buffer_append_string(b, "Response=Error\r\n");
    }
    else
    {
        buffer_append_string(b, "Response=Success\r\n");
        char *temp = NULL;
        temp = msg_get_header(m, "applycert");
        if( temp != NULL && atoi(temp) == 1 ){
            printf("apply cert\n");
            handle_applycert(b);
        }
        dbus_send_cfupdated();
        dbus_send_applyed();
    }
    return 1;
}

static int handle_put(buffer *b, const struct message *m)
{
    const char *resType = NULL;
    char *temp = NULL;
    const char * jsonCallback = NULL;

    resType = msg_get_header(m, "format");

    if( phonerebooting )
    {
        if((resType != NULL) && !strcasecmp(resType, "json"))
        {
            jsonCallback = msg_get_header( m, "jsoncallback" );

            if(jsonCallback != NULL)
            {
                temp = malloc(128 + strlen(jsonCallback));
                snprintf(temp, 128 + strlen(jsonCallback),
                         "%s(%s)", jsonCallback, "{\"res\": \"error\", \"msg\" : \"phone rebooting\"}");
            }
            else
            {
                temp = malloc(128);
                snprintf(temp, 128, "%s", "{\"res\": \"error\", \"msg\" : \"phone rebooting\"}");
            }
                
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string(b, "Response=Error\r\n");
        }

        return -1;
    }

    int x;
    int wfile = 1;
    int cfdbus = 1;
    char hdr[64] = "";
    char *val = NULL;
    const char *var = NULL, *tempval= NULL;

    var = msg_get_header(m, "flag");
	
    int tmpflag = 1;
    if ( var != NULL )
    {
        wfile = atoi(var);
        tmpflag = wfile;
        printf("var is %s, wfile is %d\n", var, wfile);
        if( wfile == 2 )
        {
            cfdbus = 0;
            wfile = 0;
        }
        else if( wfile == 3 )
        {
            cfdbus = 0;
            wfile = 0;
        }   
    }
    else
    {
        wfile = 0;
        tmpflag = 1;
    }
    
    /*if ( !wfile )
    {
        if( !access(TEMP_PVALUES, 0) )
        {
            tmpflag = 1;
        }
    }*/

    if((resType != NULL) && !strcasecmp(resType, "json"))
    {
        jsonCallback = msg_get_header( m, "jsoncallback" );

        if(jsonCallback != NULL)
        {
            temp = malloc(128 + strlen(jsonCallback));
            snprintf(temp, 128 + strlen(jsonCallback),
                     "%s({\"res\": \"success\", \"flag\" : \"%d\"})", jsonCallback, tmpflag);
        }
        else
        {
            temp = malloc(128);
            snprintf(temp, 128, "{\"res\": \"success\", \"flag\" : \"%d\"}", tmpflag);
        }
                
        buffer_append_string( b, temp );
        free(temp);
    }
    else
    {
        snprintf(hdr, sizeof(hdr), "Response=Success\r\nflag=%d", tmpflag);
        buffer_append_string(b, hdr);
    }

    for (x = 0; x < 10000; x++) {
        snprintf(hdr, sizeof(hdr), "var-%04d", x);
        var = msg_get_header(m, hdr);
        if ( (var == NULL) )
        {
            break;
        }else if( protected_pvalue_find(pvalue_protect, (char *) var) )
        {
            continue;
        }
        uri_decode(var);
        snprintf(hdr, sizeof(hdr), "val-%04d", x);
        tempval = msg_get_header(m, hdr);
	if(tempval == NULL){
	break;
	}
        val = malloc(strlen(tempval) + 16);
        memset(val, 0, strlen(tempval) + 16);
        strncpy(val, tempval, strlen(tempval));
        uri_decode(val);
        if( wfile )
        {
            pvalue_cache = pvaluelist_append(pvalue_cache, var, val );
             printf("put var is %s, val is %s\n", var, val );
        }
        else
        {
#ifdef BUILD_ON_ARM
            nvram_set(var, val);
#endif
        }
        free(val);
    } 
    if( wfile )
    {
        if( access(DATA_DIR, 0) ) {
            mkdir(DATA_DIR, 0755);
        }
        if( access(DATATMP_DIR, 0) ) {
            mkdir(DATATMP_DIR, 0755);
        }
        FILE *file_fd = NULL;
        file_fd = fopen(TEMP_PVALUES, "w+");

        if (file_fd != NULL)
        {
            PvalueList *curPtr = pvalue_cache;
            char *strToWrite = malloc( 512 );
            memset(strToWrite, 0, 512);
            int sizeOfStrToWrite = 512;

            while ( curPtr != NULL )
            {
                int newsize = strlen( strToWrite ) + strlen(curPtr->pvalue ) + strlen(curPtr->data )  + 4;
                printf("newsize is %d\n" , newsize );
                if ( sizeOfStrToWrite < newsize  )
                {
                    strToWrite = realloc( strToWrite, newsize );
                }
                snprintf( hdr, sizeof(hdr), "%s=%s\n", (curPtr->pvalue ), (curPtr->data ) );
                strcat( strToWrite, hdr );
                curPtr = curPtr->next;
            }
            printf(" add content %s to file\n", strToWrite );
            fwrite( strToWrite, 1, strlen(strToWrite), file_fd );
            fclose( file_fd );
            sync();
        }
    }
    else
    {
#ifdef BUILD_ON_ARM
        nvram_commit();
#endif
        if( cfdbus )
            dbus_send_cfupdated();
    }   

    return 0;
}

static int get_mac_address(char *ifname, char *mac)
{
    struct ifreq ifr;
    int fd;

    if (mac == NULL) {
        return -1;
    }
    strcpy (mac, "none");

    fd = socket(AF_INET, SOCK_DGRAM, 0);
    if (fd >= 0) {
        strcpy(ifr.ifr_name, ifname);
        if (ioctl (fd, SIOCGIFHWADDR, &ifr) == 0) {
            sprintf(mac, "%02x-%02x-%02x-%02x-%02x-%02x", 
                    (unsigned char)ifr.ifr_hwaddr.sa_data[0],
                    (unsigned char)ifr.ifr_hwaddr.sa_data[1],
                    (unsigned char)ifr.ifr_hwaddr.sa_data[2],
                    (unsigned char)ifr.ifr_hwaddr.sa_data[3],
                    (unsigned char)ifr.ifr_hwaddr.sa_data[4],
                    (unsigned char)ifr.ifr_hwaddr.sa_data[5]);
            close( fd );
            return 0;
        }

        close( fd );
    }
    
    return -1;
}

static int get_gateway(char *gateway)
{
    if (gateway == NULL) {
        return -1;
    }
        
    strcpy (gateway, "none");
    
    char *nettype = nvram_my_get("8");
    if(!strcmp(nettype, "1")){
        char *gate1 = NULL, *gate2 = NULL, *gate3 = NULL, *gate4 = NULL;
        gate1 = nvram_get("17");
        gate2 = nvram_get("18");
        gate3 = nvram_get("19");
        gate4 = nvram_get("20");
        int len = strlen(gate1) + strlen(gate2) + strlen(gate3) + strlen(gate4) + 16;
        
        if(gate1 != NULL && gate2 != NULL && gate3 != NULL && gate4 != NULL){
            sprintf(gateway, "%s.%s.%s.%s", gate1, gate2, gate3, gate4);
        }
    }
    else{
        FILE *fp = fopen("/proc/net/route", "r");
        char line[256] = "";
        //size_t len = 0;
        //ssize_t readd;
        char dev[64];
        unsigned int dest;
        unsigned int gw;

        if (fp == NULL)
            return -1;

        if (gateway == NULL) {
            fclose( fp );
            return -1;
        }
        strcpy (gateway, "none");

        //while ((readd = getline (&line, &len, fp)) != -1) {
        while (fgets( &line, sizeof(line), fp ) ) {
            if (sscanf (line, "%s %x %x", dev, &dest, &gw) > 0) {
                if (dest == 0x0) {
                    gw = ntohl (gw);
                    sprintf (gateway, "%u.%u.%u.%u", (gw >> 24) & 0xff,
                            (gw >> 16) & 0xff,
                            (gw >> 8) & 0xff,
                            gw & 0xff);
                    
                    memset(line, 0, sizeof(line));
                    fclose( fp );
                    return 0;
                }
            }
        }

        /*if (line != NULL) {
            free(line);
            line = NULL;
        }*/
     
        fclose( fp );
    }
    
    return -1;
}

static int get_dns_server(char *dns_server, int dns_type)
{
    if (dns_type == 1)
    {
        //system("getprop dhcp.eth0.dns1 > /tmp/dns");
        system("getprop net.dns1 > /tmp/dns");
    }
    else
    {
        //system("getprop dhcp.eth0.dns2 > /tmp/dns");
        system("getprop net.dns2 > /tmp/dns");
    }
    FILE *fp = fopen("/tmp/dns", "r");
    char line[32] = "";

    if (fp == NULL)
        return -1;
        
    if (dns_server == NULL) {
        fclose( fp );
        return -1;
    }
    strcpy(dns_server, "none");

    while (fgets( &line, sizeof(line), fp ) ) {
            if(line[strlen(line)-1] == '\n'){
                line[strlen(line)-1] = '\0';
            }
        strcpy (dns_server, line);
        
        if(!strcmp(dns_server, "") || dns_server == NULL){
            strcpy (dns_server, "0.0.0.0");
        }
    }
    fclose(fp);

    return 0;
}

static int get_ipv6_dns_server(char *dns_server, int dns_type) {
    if(dns_server == NULL)
    {
        return -1;
    }

    if (dns_type == 1)
        system("getprop dhcp6.eth0.dns1 > /tmp/dns");
    else if (dns_type == 2)
        system("getprop dhcp6.eth0.dns2 > /tmp/dns");

    FILE *fp = fopen("/tmp/dns", "r");
    char line[64] = "";

    if (fp != NULL)
    {
        while (fgets(&line, sizeof(line), fp)) 
        {
            if(line[strlen(line)-1] == '\n')
            {
                line[strlen(line)-1] = '\0';
            }
            strcpy (dns_server, line);
        }
        fclose(fp);
    }

    return 0;
}

static void print_iter( DBusMessage *message, int depth)
{
    DBusMessageIter iter;
    int current_type;
    dbus_uint32_t valuint32;
    dbus_int32_t valint32;
    char* valstring;
    dbus_bool_t valbool;
    
     dbus_message_iter_init (message, &iter);
     while ((current_type = dbus_message_iter_get_arg_type (&iter)) != DBUS_TYPE_INVALID)
     {
        switch ( current_type )
        {
            case DBUS_TYPE_UINT32:
                dbus_message_iter_get_basic(&iter, &valuint32);
                printf( "unint 32 type, %d\n", valuint32 );
                break;

            case DBUS_TYPE_INT32:
                dbus_message_iter_get_basic(&iter, &valint32);
                printf( "nint 32 type, %d\n", valint32 );
                break;

            case DBUS_TYPE_STRING:
                dbus_message_iter_get_basic(&iter, &valstring);
                printf( "string type, %s\n", valstring );
                break;

            case DBUS_TYPE_BOOLEAN:
                dbus_message_iter_get_basic(&iter, &valbool);
                printf( "boolean type, %d\n", valbool );
                break;
                
            default:
                break;
        }

        dbus_message_iter_next (&iter);
    }
     return 0;
}

static int handle_endcall(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    int lineIndex = -1;
    char res[128] = "";
    char *info = NULL;
    
    temp = msg_get_header(m, "line");
    if ( temp  == NULL ) {
        lineIndex = -1;
    } else {
        lineIndex = atoi(temp);
    }

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    fprintf(stderr, "handle_endCall\n");
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "endCall" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &lineIndex ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
        dbus_message_append_args( message,  DBUS_TYPE_INVALID );

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1+ strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't end call\"}";
            }

            temp = build_JSON_formate( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }
#endif
    return 0;
}

/**************callservice add by Hejie Shao ***********************************/
static int handle_setdndonoroff(server *srv, connection *con,buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *info = NULL;
    char *dndtype = NULL;
    char *dndvalue = NULL;
    char *cmd = NULL;
    char *account = NULL;
    int setdnd = 0, acct = 0;
    cmd = malloc(128);
    memset(cmd, 0, 128);

    dndvalue = msg_get_header(m,"setdnd");
    //dndtype = msg_get_header(m,"dndtype");
    account = msg_get_header(m, "account");
    
    if(dndvalue != NULL){
        setdnd = atoi(dndvalue);
    }
    
    if(account != NULL){
        acct = atoi(account);
    }

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    fprintf(stderr, "handle_endCall\n");
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "enableDND" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &acct ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &setdnd ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
        dbus_message_append_args( message,  DBUS_TYPE_INVALID );

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1+ strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't set vga in\"}";
            }

            temp = build_JSON_formate( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }
    /*if(type == NULL)
    {
        type = "";
    }

    if(strcmp("0",dndtype) == 0)
        dndtype = "none";
    else
        if(strcmp("1",dndtype) == 0)
            dndtype = "dnd";
        else
            if(strcmp("2",dndtype) == 0)
                dndtype = "conf_dnd";

    if(strcmp("0",type) == 0)
        type = "false";
    else
        if(strcmp("1",type) == 0)
            type = "true";

    snprintf(cmd, 128, "am broadcast -a com.base.module.phone.DND --es \"type\" \"%s\" --ez \"state\" %s", dndtype,type);
    
    int result = mysystem(cmd);
    if( result )
        temp = "{\"res\":\"failed\"}";
    else
    {
        temp = malloc(128);
        memset(temp, 0, 128);
        snprintf(temp, 128, "{\"res\":\"success\",\"dndinfo\":\"%s\",\"dndtype\":\"%s\"}", type, dndtype);
    }
    temp = build_JSON_formate( srv, con, m, temp );
        
    if ( temp != NULL )
    {
        buffer_append_string( b, temp );
        free(temp);
    }*/
    
    
    return 1;
}
static int handle_vgasend(server *srv, connection *con,buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    //char *targetcmd = NULL;
    int itype, ivalue;
    int len = 128;
    char res[128] = "";
    char *info = NULL;

    temp = msg_get_header(m,"type");

    if(temp == NULL)
    {
        itype = -1;
    }
    else
    {
        itype = atoi(temp);
    }

    temp = msg_get_header(m,"value");

    if(temp == NULL)
    {
        ivalue = -1;
    }
    else
    {
        ivalue = atoi(temp);
    }

    if( itype == -1 || ivalue == -1 )
        buffer_append_string(b, "Response=Error\r\n");
    else{
        ttycmd_vga_send(itype, ivalue);
    }

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    fprintf(stderr, "handle_endCall\n");
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setVGA_in" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &itype ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &ivalue ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
        dbus_message_append_args( message,  DBUS_TYPE_INVALID );

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1+ strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't set vga in\"}";
            }

            temp = build_JSON_formate( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }
#endif
    return 0;
}

static int handle_vgaread(server *srv, connection *con,buffer *b, const struct message *m)
{
    //const char *type = NULL, *value = NULL;
    char *temp = NULL;
    char *chtype = NULL;
    const char *sqlstr = NULL;
    //char *targetcmd = NULL;
    sqlite3 *db;
    int rc;
    int len = 128,itype=0;
    int value;
    char *sql_name[3] = {"vertical","horizontal","sampling"}; 
    sqlite3_stmt *stmt;

    rc = sqlite3_open("/data/data/com.android.providers.settings/databases/settings.db", &db);
    if( rc ){
        printf("Can't open database: %s\n", sqlite3_errmsg(db));
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        buffer_append_string(b,"{\"Response\":\"Failed\"}");
        return -1;
    }
    chtype = msg_get_header(m,"type");
    if(chtype == NULL)
    {
        itype = 0;
    }
    else
    {
        itype = atoi(chtype);
    }

    buffer_append_string(b,"{\"Response\":\"Success\",\"Data\":[{");
    if(itype==0)
        sqlstr = "select value from system where name=\"vga_in_vertical_offset\";";
    else if(itype == 1)
        sqlstr = "select value from system where name=\"vga_in_horizontal_offset\";";
    else if(itype == 2)
        sqlstr = "select value from system where name=\"sampling_phase\";";
    
    rc= sqlite3_prepare_v2(db,sqlstr, strlen(sqlstr), &stmt,0);
    if( rc ){
        printf("Can't open statement: %s\n", sqlite3_errmsg(db));
        fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        buffer_append_string(b,"{\"Response\":\"Failed\"}");
        return -1;
    }
    sqlite3_step(stmt);
    value = sqlite3_column_int(stmt, 0);
    temp = malloc(len);
    memset(temp,0,len);
    snprintf(temp,len,"\"%s\":\"%d\",\"type\":\"%d\"",sql_name[itype],value,itype);
    buffer_append_string(b, temp);
    free(temp);
    buffer_append_string(b, "}]}");
    sqlite3_finalize(stmt);
    sqlite3_close(db);
    return 0;
}

static int handle_confirmadminpsw(server *srv, connection *con,buffer *b, const struct message *m)
{
    const char *val = NULL, *var = NULL, *psw = NULL;
    char *temp = NULL;

        var = msg_get_header(m, "var");

#ifdef BUILD_ON_ARM
        val = nvram_my_get(var);
#else
        val = "Unknow";
#endif

        psw = msg_get_header(m, "adminpsw");

        if(strcmp(val,psw) == 0)
            temp = "{\"res\":\"success\"}";
        else
            temp = "{\"res\":\"failed\"}";

        temp = build_JSON_formate( srv, con, m, temp );
        
       if ( temp != NULL )
        {
            buffer_append_string( b, temp );
            free(temp);
        }
        

    return 0;
}

static int handle_acceptringline(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    int lineIndex = 0;
    int isAccept = 0;
    int isAddToConf = 0;
    char res[128] = "";
    char *info = NULL;
    
    temp = msg_get_header(m, "line");
    if ( temp  == NULL ) {
        lineIndex = 0;
    } else {
        lineIndex = atoi(temp);
    }
    temp = msg_get_header(m, "isaccept");
    if ( temp  == NULL ) {
        isAccept = 0;
    } else {
        isAccept = atoi(temp);
    }
    temp = msg_get_header(m, "isvideo");
    if ( temp  == NULL ) {
        isAddToConf = 0;
    } else {
        isAddToConf = atoi(temp);
    }

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    fprintf(stderr, "handle_acceptringline\n");
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "acceptOrRejectRingingLine" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &isAccept ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &lineIndex ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &isAddToConf ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
        dbus_message_append_args( message,  DBUS_TYPE_INVALID );

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1+ strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't accept call\"}";
            }

            temp = build_JSON_formate( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }
#endif
    return 0;
}

static int handle_callservice_by_two_param(server *srv, connection *con, buffer *b, const struct message *m,const char *parafirestname,const char *parasecondname, const char *method)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    int lineIndex = 0;
    int isflag = 0;
    char res[128] = "";
    char *info = NULL;
    
    temp = msg_get_header(m, parafirestname);
    if ( temp == NULL ) {
        isflag = 0;
    } else {
        isflag = atoi(temp);
    }

    temp = msg_get_header(m, parasecondname);
    if ( temp  == NULL ) {
        lineIndex = 0;
    } else {
        lineIndex = atoi(temp);
    }

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    fprintf(stderr, "handle_callservice_by_two_param\n");
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, method );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &isflag ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &lineIndex ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
        dbus_message_append_args( message,  DBUS_TYPE_INVALID );

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1+ strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't accept call\"}";
            }

            temp = build_JSON_formate( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }
#endif
    return 0;
}

static int handle_callservice_by_one_param(server *srv, connection *con, buffer *b, const struct message *m, const char *paraname, const char *method, int decode)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *param = NULL;
    char *temp = NULL;
    char *info = NULL;
    int tempparam;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, method );

    printf("handle_callservice_by_one_param, param = %s, method = %s\n", paraname, method);
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        param = msg_get_header(m, paraname);

        if ( param == NULL )
        {
            if( decode == 1 )
                param = "";
            else
                tempparam = 0;
        }else
        {
            if( decode == 1 )
                uri_decode(param);
            else
                tempparam = atoi(param);
        }

        if( decode == 1 ){
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &param ) )
            {
                printf( "Out of Memory when %s!\n", method );
                exit( 1 );
            }
        }else{
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &tempparam ) )
            {
                printf( "Out of Memory when %s!\n", method );
                exit( 1 );
            }
        }
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
                if( !strcasecmp(method, "setDisplayInfo") ){
                    system("sendevent /dev/input/event1 0 0 0 && sendevent /dev/input/event1 2 0 1 && sendevent /dev/input/event1 0 0 0");
                }
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_callservice_by_no_param(server *srv, connection *con, buffer *b, const struct message *m, const char *method)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 2.5*60*1000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, method );

    printf("handle_callservice_by_no_param %s\n", method);
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }
        
        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }
            
            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't call method\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}
static int handle_callstatus_report(server *srv, connection *con, buffer *b, const struct message *m, const char *paraname, int decode)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;
    const char *param = NULL;
    int *isopen = NULL;


    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_CALLSTATUS_REPORT);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }
    param = msg_get_header(m, paraname);

    if ( param == NULL )
    {
        param = "";
    }else if( decode ){
        uri_decode((char*)param);
    }

    if(strcmp(param,"0") == 0)
        isopen = 0;
    else
        if(strcmp(param,"1") == 0)
            isopen = 1;

    dbus_message_append_args( message, DBUS_TYPE_INT32, &isopen, DBUS_TYPE_INVALID );
    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
    buffer_append_string (b, "{\"res\":\"success\"}");
#endif
    return 0;
}

static int  handle_sendDTMF(server *srv, connection *con,
    buffer *b, const struct message *m, const char *method)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *dtmf = NULL;
    char *temp = NULL;
    char res[128] = "";
    char *info = NULL;

    dtmf = msg_get_header(m, "dtmfvalue");

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }


    fprintf(stderr, "handle_sendDTMF\n");
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, method );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        if ( dtmf != NULL )
        {
            uri_decode((char*)dtmf);
        }else{
            dtmf = "";
        }


        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &dtmf ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
        dbus_message_append_args( message,  DBUS_TYPE_INVALID );

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res2 = NULL;
            dbus_message_iter_init( reply, &iter );
            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res2);
                        printf( "string type, %s\n", res2 );
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }
            if ( res2 != NULL )
            {
                info = (char*)malloc((1+ strlen(res2)) * sizeof(char));
                sprintf(info, "%s", res2);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"timeout\"}";
            }
            temp = build_JSON_res( srv, con, m, temp );
            if(info != NULL)
            {
                free(info);
            }
            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }
        dbus_message_unref( message );
    }
    return 0;
}

static int  handle_transfernumber(server *srv, connection *con,
    buffer *b, const struct message *m, const char *method)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *number = NULL;
    char *temp = NULL;
    char res[128] = "";
    char *info = NULL;

    number = msg_get_header(m, "number");

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }


    fprintf(stderr, "handle_transfernumber\n");
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, method );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        if ( number != NULL )
        {
            uri_decode((char*)number);
        }else{
            number = "";
        }


        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &number ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
        dbus_message_append_args( message,  DBUS_TYPE_INVALID );

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res2 = NULL;
            dbus_message_iter_init( reply, &iter );
            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res2);
                        printf( "string type, %s\n", res2 );
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }
            if ( res2 != NULL )
            {
                info = (char*)malloc((1+ strlen(res2)) * sizeof(char));
                sprintf(info, "%s", res2);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"timeout\"}";
            }
            temp = build_JSON_res( srv, con, m, temp );
            if(info != NULL)
            {
                free(info);
            }
            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }
        dbus_message_unref( message );
    }
    return 0;
}

static int handle_getBFCPSupport(server *srv, connection *con, buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *param = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "isBFCPSupport" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        param = msg_get_header(m, "lines");

        if ( param == NULL )
        {
            param = "0";
        }else
        {
            uri_decode((char*)param);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &param ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_attendtransfer(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
	 int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    int lineIndex = 0;
    int iscancel = 0;
    const char *number = NULL;
    char *info = NULL;
    
    temp = msg_get_header(m, "line");
    if ( temp  == NULL ) {
        lineIndex = 0;
    } else {
        lineIndex = atoi(temp);
    }
    number = msg_get_header(m, "number");
    if ( number  == NULL ) {
        number = "";
    } else {
        uri_decode((char*)number);
    }
    temp = msg_get_header(m,"iscancel");
    if(temp == NULL){
        iscancel = 0;
    }
    else{
        iscancel = atoi(temp);
    }

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "attendTransferTo" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &number ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &iscancel ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }
#endif
    return 0;
}

static int handle_attendtransfercancel(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    int lineIndex = 0;
    char res[128] = "";
    char *info = NULL;
    
    temp = msg_get_header(m, "line");
    if ( temp  == NULL ) {
        lineIndex = 0;
    } else {
        lineIndex = atoi(temp);
    }

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    fprintf(stderr, "handle_acceptringline\n");
    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, "line");
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INT32, &lineIndex,
                                    DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
    temp = "{\"res\": \"success\"}";
    temp = build_JSON_res( srv, con, m, temp );
    if(info != NULL)
    {
        free(info);
    }
    if ( temp != NULL )
    {
        buffer_append_string( b, temp );
        free(temp);
    }
#endif
    return 0;
}

static int handle_attendtransfersplit(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *info = NULL;


    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    fprintf(stderr, "handle_acceptringline\n");
    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, "trnf_split");
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
    temp = "{\"res\": \"success\"}";
    temp = build_JSON_res( srv, con, m, temp );
    if(info != NULL)
    {
        free(info);
    }
    if ( temp != NULL )
    {
        buffer_append_string( b, temp );
        free(temp);
    }
#endif
    return 0;
}

static int handle_attendtransferline(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    int lineIndex = 0;
    char *info = NULL;
    
    temp = msg_get_header(m, "line");
    if ( temp  == NULL ) {
        lineIndex = 0;
    } else {
        lineIndex = atoi(temp);
    }


    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    fprintf(stderr, "handle_acceptringline\n");
    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, "endcall");
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INT32, &lineIndex,
                                    DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
    temp = "{\"res\": \"success\"}";
    temp = build_JSON_res( srv, con, m, temp );
    if(info != NULL)
    {
        free(info);
    }
    if ( temp != NULL )
    {
        buffer_append_string( b, temp );
        free(temp);
    }
#endif
    return 0;
}

static int handle_sendcontinuerecordCancel(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *recordtype = "record";
    int state = 2;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, "phone_state");
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return -1;
    }

    dbus_message_append_args( message, DBUS_TYPE_STRING, &recordtype,
                                    DBUS_TYPE_INT32, &state, 
                                    DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
    temp = "{\"res\": \"success\"}";
    temp = build_JSON_res( srv, con, m, temp );

    if ( temp != NULL )
    {
        buffer_append_string( b, temp );
        free(temp);
    }
#endif
    return 0;
}

static int handle_layoutctrl(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    int lineIndex = 0;
    char *laytype = NULL;
    
    laytype = msg_get_header(m, "mode");
    if ( laytype  == NULL ) {
        laytype = "overlap";
    } else {
        uri_decode((char*)laytype);
    }

    /*
    if layoutmode is 'pip',line means:
    0: remote(local)
    1: local(remote)
    */
    temp = msg_get_header(m, "pipstate");
    if ( temp  == NULL ) {
        lineIndex = 0;
    } else {
        lineIndex = atoi(temp);
    }


    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    if(strcmp(laytype,"max_show_chn") == 0 || strcmp(laytype,"max_hdmi_out") == 0)
        message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, "layout_ctrl");
    else
        message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, "hdmi_output");
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return -1;
    }

    if(strcmp(laytype,"pip") == 0)
    {
        int arg1 = 0;
        int arg2 = 0;
        int position = 4;
        temp = msg_get_header(m, "position");
        if ( temp  == NULL ) {
            position = 4;
        } else {
            position = atoi(temp);
        }
        printf( "message is %d ----- %d",lineIndex,position);
        dbus_message_append_args( message, DBUS_TYPE_STRING, &laytype,
                                    DBUS_TYPE_INT32, &arg1, 
                                    DBUS_TYPE_INT32, &arg2, 
                                    DBUS_TYPE_INT32, &lineIndex, 
                                    DBUS_TYPE_INT32, &position, 
                                    DBUS_TYPE_INVALID );
    }
    else if(strcmp(laytype,"max_show_chn") == 0)
    {
        dbus_message_append_args( message, DBUS_TYPE_STRING, &laytype,
                                    DBUS_TYPE_INT32, &lineIndex, 
                                    DBUS_TYPE_INVALID );
    }
    else if(strcmp(laytype,"max_hdmi_out") == 0)
    {
        dbus_message_append_args( message, DBUS_TYPE_STRING, &laytype,
                                    DBUS_TYPE_INT32, &lineIndex, 
                                    DBUS_TYPE_INVALID );
    }
    else
    {
        dbus_message_append_args( message, DBUS_TYPE_STRING, &laytype,
                                    DBUS_TYPE_INVALID );
    }

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
    temp = "{\"res\": \"success\"}";
    temp = build_JSON_res( srv, con, m, temp );

    if ( temp != NULL )
    {
        buffer_append_string( b, temp );
        free(temp);
    }
#endif
    return 0;
}

static int handle_getlayout(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *dbus_layout_interface = "com.grandstream.dbus.method_call.layoutmode_cur";
    char *layoutpath = "/com/grandstream/dbus/camtest";
    char *dbus_layoutdest = "chapi.gs_avs.server";
    
    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_layoutdest,layoutpath, dbus_layout_interface, "layoutmode_cur");
    
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return -1;
    }

    dbus_message_set_auto_start (message, TRUE);
    dbus_message_iter_init_append( message, &iter );
    dbus_message_append_args( message,DBUS_TYPE_INVALID );
    dbus_error_init( &error );

    reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
    if ( dbus_error_is_set( &error ) )
    {
        fprintf(stderr, "Error %s: %s\n",
            error.name,
            error.message);
    }

    if ( reply )
    {
        print_message( reply );
        int current_type;
        char *res = NULL;
        int arg[3];
        int i = 0;
        
        dbus_message_iter_init( reply, &iter );

        while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
        {
            switch ( current_type )
            {
                case DBUS_TYPE_STRING:
                    dbus_message_iter_get_basic(&iter, &res);
                    break;
                case DBUS_TYPE_INT32:
                   dbus_message_iter_get_basic(&iter, &arg[i]);
                   i++;
                   break;
                default:
                    break;
            } 
            dbus_message_iter_next (&iter);
        }

        if ( res != NULL )
        {
            temp = (char*)malloc((128+ strlen(res)) * sizeof(char));
            sprintf(temp, "{\"res\": \"success\", \"mode\": \"%s\", \"arg1\" : \"%d\", \"arg2\" : \"%d\", \"arg3\" : \"%d\"}", res,arg[0],arg[1],arg[2]);
        }
        else
        {
            temp = "{\"res\": \"error\", \"msg\": \"can't accept call\"}";
        }

        temp = build_JSON_res( srv, con, m, temp );
        if ( temp != NULL )
        {
            buffer_append_string( b, temp );
            free(temp);
        }
        dbus_message_unref( reply );
    }

    dbus_message_unref( message );
#endif
    return 0;
}

static int handle_getlayoutlineinfo(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *dbus_layout_interface = "com.grandstream.dbus.method_call.layout_channellist";
    char *layoutpath = "/com/grandstream/dbus/camtest";
    char *dbus_layoutdest = "chapi.gs_avs.server";
    
    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_layoutdest,layoutpath, dbus_layout_interface, "layout_channellist");
    
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return -1;
    }

    dbus_message_set_auto_start (message, TRUE);
    dbus_message_iter_init_append( message, &iter );
    dbus_message_append_args( message,DBUS_TYPE_INVALID );
    dbus_error_init( &error );

    reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
    if ( dbus_error_is_set( &error ) )
    {
        fprintf(stderr, "Error %s: %s\n",
            error.name,
            error.message);
    }

    if ( reply )
    {
        print_message( reply );
        int current_type;
        char *res[3];
        int arg;
        int i = 0;
        
        dbus_message_iter_init( reply, &iter );

        while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
        {
            switch ( current_type )
            {
                case DBUS_TYPE_STRING:
                    dbus_message_iter_get_basic(&iter, &res[i]);
                    i++;
                    break;
                case DBUS_TYPE_INT32:
                   dbus_message_iter_get_basic(&iter, &arg);
                   break;
                default:
                    break;
            } 
            dbus_message_iter_next (&iter);
        }

        if ( res != NULL )
        {
            temp = (char*)malloc((128+ strlen(res)) * sizeof(char));
            sprintf(temp, "{\"res\": \"success\", \"hdmi1\": \"%s\", \"hdmi2\" : \"%s\", \"hdmi3\" : \"%s\", \"mode\" : \"%d\"}", res[0],res[1],res[2],arg);
        }
        else
        {
            temp = "{\"res\": \"error\", \"msg\": \"can't accept call\"}";
        }

        temp = build_JSON_res( srv, con, m, temp );
        if ( temp != NULL )
        {
            buffer_append_string( b, temp );
            free(temp);
        }
        dbus_message_unref( reply );
    }

    dbus_message_unref( message );
#endif
    return 0;
}

static int handle_setSitesettingInfo(server *srv, connection *con, buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *param = NULL;
    char *temp = NULL;
    char *info = NULL;
    int bg_tp = 0;
    const char *sitename = NULL;
    int displayposition = 0;
    int displayduration = 0;
    const char *fontcolor = NULL;
    int fontsize = 0;
    int bold = 0;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setSitesettingInfo" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        param = msg_get_header(m, "bgtp");
        if ( param == NULL )
        {
            bg_tp = 0;
        }else
        {
            bg_tp = atoi(param);
        }

        sitename = msg_get_header(m,"sitename");
        if ( sitename == NULL )
        {
            sitename = "";
        }else
        {
            uri_decode((char*)sitename);
            printf("sitename %s\n",sitename );
        }

        param = msg_get_header(m,"dispos");
        if ( param == NULL )
        {
            displayposition = 0;
        }else
        {
            displayposition = atoi(param);
        }

        param = msg_get_header(m,"disduration");
        if ( param == NULL )
        {
            displayduration = 0;
        }else
        {
            displayduration = atoi(param);
        }

        fontcolor = msg_get_header(m,"fontcolor");
        if ( fontcolor == NULL )
        {
            fontcolor = "#FFFFFF";
        }else
        {
            uri_decode((char*)fontcolor);
        }

        param = msg_get_header(m,"fontsize");
        if ( param == NULL )
        {
            fontsize = 0;
        }else
        {
            fontsize = atoi(param);
        }

        param = msg_get_header(m,"bold");
        if ( param == NULL )
        {
            bold = 0;
        }else
        {
            bold = atoi(param);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &bg_tp ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &sitename ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &displayposition ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &displayduration ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &fontcolor ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &fontsize ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &bold ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_setSitesettingOffset(server *srv, connection *con, buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *param = NULL;
    char *temp = NULL;
    char *info = NULL;
    int horizont = 0;
    int vertical = 0;
    char *direction = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setSitesettingOffset" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        param = msg_get_header(m, "vertical");
        if ( param == NULL )
        {
            vertical = 0;
        }else
        {
            vertical = atoi(param);
        }

        direction = msg_get_header(m,"direction");
        if ( direction == NULL )
        {
            direction = "";
        }else
        {
            uri_decode((char*)direction);
        }

        param = msg_get_header(m,"horizont");
        if ( param == NULL )
        {
            horizont = 0;
        }else
        {
            horizont = atoi(param);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &vertical ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &horizont ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &direction ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_sethdmioutputmode(server *srv, connection *con, buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *param = NULL;
    char *temp = NULL;
    char *info = NULL;
    char *hdmi = NULL, *curmode = NULL;
    int mode = 0;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setHDMIOutputMode" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );
        
        hdmi = msg_get_header(m, "hdmi");
        if ( hdmi == NULL )
        {
            hdmi = "hdmi1";
        }
        
        curmode = msg_get_header(m, "mode");
        if ( curmode != NULL )
        {
            mode = atoi(curmode);
        }
        
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &hdmi ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &mode ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_dialPlanCheck(server *srv, connection *con, buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *param = NULL;
    char *temp = NULL;
    char *info = NULL;
    int account = 0;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "dialPlanCheck" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        param = msg_get_header(m, "number");
        temp = msg_get_header(m, "account");

        if ( param == NULL )
        {
            param = "";
        }else
        {
            uri_decode(param);
        }

        if ( temp == NULL )
        {
            account = 0;
        }else
        {
            account = atoi(temp);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &account ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &param ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_fecc_preset(buffer *b, const struct message *m){
    char *temp = NULL;
    int islocal = 0;
    int line = 0;
    temp = msg_get_header(m, "line");
    if( temp != NULL )
        line = atoi(temp);

    if( line == -1 ){
        line = 0;
        islocal = 1;
    }

    int presetid = 0;
    temp = msg_get_header(m, "presetid");
    if( temp != NULL )
        presetid = atoi(temp);

    int issave = 0;
    temp = msg_get_header(m, "type");
    if( temp != NULL && !strcasecmp(temp, "save") )
        issave = 1;

    if( islocal == 1 ){
        if( issave == 1 ){
            dbus_send_fecc_preset(SIGNAL_FECC_SAVE_LOCAL_PRESET, line, presetid);
        }else{
            dbus_send_fecc_preset(SIGNAL_FECC_GOTO_LOCAL_PRESET, line, presetid);
        }
    }else{
        if( issave == 1 ){
            dbus_send_fecc_preset(SIGNAL_FECC_SAVE_REMOTE_PRESET, line, presetid);
        }else{
            dbus_send_fecc_preset(SIGNAL_FECC_GOTO_REMOTE_PRESET, line, presetid);
        }
    }
    buffer_append_string( b, "{\"res\": \"success\"}" );
    return 0;
}

static int handle_setcallmode(server *srv, connection *con, buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *param = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setCallMode" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        param = msg_get_header(m, "callmode");

        if ( param == NULL )
        {
            param = "call";
        }else
        {
            uri_decode((char*)param);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &param ) )
        {
            printf( "Out of Memory when isBFCPSupport!\n");
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_set_customlayout(server *srv, connection *con, buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *info = NULL;
    char *hdmi1mode = NULL, *hdmi2mode = NULL, *hdmi1content = NULL, *hdmi2content = NULL;
    int mode1, mode2;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "displayCustomMode" );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        hdmi1mode = msg_get_header(m, "hdmi1mode");
        if ( hdmi1mode == NULL )
        {
            mode1 = 1;
        }else
        {
            mode1 = atoi(hdmi1mode);
        }

        hdmi2mode = msg_get_header(m, "hdmi2mode");
        if ( hdmi2mode == NULL )
        {
            mode2 = 1;
        }else
        {
            mode2 = atoi(hdmi2mode);
        }

        hdmi1content = msg_get_header(m, "hdmi1content");
        if ( hdmi1content == NULL )
        {
            return -1;
        }else
        {
            uri_decode(hdmi1content);
        }

        hdmi2content = msg_get_header(m, "hdmi2content");
        if ( hdmi2content == NULL )
        {
            return -1;
        }else
        {
            uri_decode(hdmi2content);
        }


        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &mode1 ) )
        {
            printf( "Out of Memory when setCustomLayoutStatus!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &hdmi1content ) )
        {
            printf( "Out of Memory when setCustomLayoutStatus!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &mode2 ) )
        {
            printf( "Out of Memory when setCustomLayoutStatus!\n");
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &hdmi2content ) )
        {
            printf( "Out of Memory when setCustomLayoutStatus!\n");
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}


/*********************callservice end******************************************/
/******************ip ping****************************/
static int handle_start_ping (buffer *b, const struct message *m, int type)
{
    char *addr = NULL;

    system("rm /data/ping.txt &");
    system("rm /data/traceroute.txt &");
    addr = msg_get_header(m, "addr");
    if (addr != NULL) {
        buffer_append_string(b, "Response=Success\r\n"
            "Message=Start success\r\n");
        char *cmd = NULL;
        cmd = malloc(128+strlen(addr));
        memset(cmd, 0, sizeof(cmd));
        if(type == 0)
            sprintf(cmd, "ping %s > /data/ping.txt &", addr);
        else
            if(type == 1)
                sprintf(cmd, "traceroute %s > /data/traceroute.txt &", addr);
        
        mysystem(cmd);
        free(cmd);

        /*ret = execlp("ping", "ping", addr, ">", "/data/ping.txt", (char *)0);
        if (ret == -1)
            return -1;*/
    } else {
        buffer_append_string(b, "Response=Error\r\n");
    }

    return 0;
}

static int handle_get_ping_msg (buffer *b, const struct message *m)
{
    char *temp = NULL, linestr[128];
    FILE *fp = NULL;
    int offset, res, count;
    char ch;

    temp = msg_get_header(m, "offset");
    offset = atoi(temp);

    fp = fopen("/data/ping.txt", "r");
    if (fp == NULL){
        system("killall ping");
        buffer_append_string(b, "Response=Error\r\n"
            "Message=unknown host\r\n");
        return -1;
    }

    res = fseek(fp, offset, SEEK_SET);
    if (res != 0){
        system("killall ping");
        buffer_append_string(b, "Response=Error\r\n"
            "Message=unknown host\r\n");
        return -1;
    }

    count = 0;
    ch = fgetc(fp);

    if (ch == 255) {
        buffer_append_string(b, "Response=Success\r\npingmsg=continue\r\n");
        close(fp);
        return 0;       
    }

    while(ch != -1 && ch != '\n')
    {
        *(linestr + count) = ch;
        ch = fgetc(fp);
        count ++;
    }

    *(linestr + count) = '\0';

    temp = malloc(strlen(linestr) + 64);
    sprintf(temp, "Response=Success\r\npingmsg=%s\r\noffset=%d\r\n", linestr, strlen(linestr) + offset + 1);
    buffer_append_string(b, temp);
    free(temp);

    fclose(fp);

    return 0;
}

static int handle_get_tracroute_msg (buffer *b, const struct message *m)
{
    char *temp = NULL;
    FILE *fp = NULL;
    int offset, res, count;
    char linestr[1024] = "";

    temp = msg_get_header(m, "offset");
    offset = atoi(temp);
    
    fp = fopen("/data/traceroute.txt", "r");
    if (fp == NULL){
        system("killall traceroute");
        buffer_append_string(b, "Response=Error\r\n"
            "Message=can not open file\r\n");
        return -1;
    }
    
    res = fseek(fp, offset, SEEK_SET);
    if (res != 0){
        system("killall traceroute");
        buffer_append_string(b, "Response=Error\r\n"
            "Message=unknown host\r\n");
        return -1;
    }

    fgets(linestr,1024,fp);

    temp = malloc(strlen(linestr) + 64);
    sprintf(temp, "Response=Success\r\npingmsg=%s\r\noffset=%d\r\n", linestr,strlen(linestr) + offset);
    buffer_append_string(b, temp);
    free(temp);
    
    fclose(fp);

    return 0;
}

static int handle_stop_ping(buffer *b, int type)
{
    if(type == 0)
        system("killall -2 ping");
    else
        if(type == 1)
            system("killall -2 traceroute");
    buffer_append_string(b, "Response=Success\r\n"
        "Message=Stop success\r\n");

    return 0;
}

static int handle_gethdmi1state(buffer *b)
{
    char *temp = NULL;
    char state = '0';
    FILE *fp = NULL;

    fp = fopen("/sys/devices/virtual/switch/hdmi/state","r");

    if (fp == NULL){
        buffer_append_string(b, "Response=Error\r\n"
            "Message=unknown file\r\n");
        return -1;
    }
    
    state = fgetc(fp); 
    temp = malloc(64);
    
    sprintf(temp, "Response=Success\r\nhdmi1state=%c\r\n", state);
    
    buffer_append_string(b, temp);
    free(temp);
    
    close(fp);

    return 0;
}

static int handle_getUSB2state(buffer *b)
{
    struct dirent *dp;
    DIR *dir;

    if( access( USB_DEVICE_PATH, 0 ) )
    {
        buffer_append_string(b, "Response=Error\r\nMessage=0\r\n");
        return -1;
    }

    if( (dir = opendir(USB_DEVICE_PATH))== NULL )
    {
        buffer_append_string(b, "Response=Error\r\nMessage=0\r\n");
        return -1;
    }

    int filenum = 0;
    while ((dp = readdir( dir )) != NULL)
    {
        if(dp == NULL)
        {
            printf("dp is null\n");
            break;
        }
        if (strcmp(dp->d_name, ".") != 0 && strcmp(dp->d_name, "..") != 0)
        {
            filenum ++;
        }
    }
    char *temp = NULL;
    temp = malloc(128);
    sprintf(temp, "Response=Success\r\nMessage=%d\r\n", filenum);
    buffer_append_string(b, temp);

    closedir(dir);
    return 1;

}

static int handle_getconnectstate(server *srv, connection *con, buffer *b, const struct message *m)
{
    int state = 0;
    char *temp = NULL;
    time_t timenow;
    time_t temp_timeout = 0;
    time(&timenow);

    if(sessiontimeout >= timenow)
        temp_timeout = sessiontimeout - timenow;
    else
        state = -1;

    //state = valid_connection(con);
    temp = malloc(128);
    sprintf(temp, "response=Success\r\nstate=%d\r\ntimeout=%d\r\n", state,temp_timeout);
    buffer_append_string(b, temp);
    free(temp);
}

static int handle_gettcpserverstate(server *srv, connection *con, buffer *b, const struct message *m)
{
    int state = 0;
    char *temp = NULL;
    FILE *fp = NULL;
    char linestr[1024] = "";
    char *tcpps = "/system/lighttpd/sbin/tcpserver";

    system("rm /data/pstcpserver.txt");
    int res = system("ps | grep tcpserver > /data/pstcpserver.txt");
    
    if(res == 0)
    {
        fp = fopen("/data/pstcpserver.txt", "r");
        if (fp == NULL){
            buffer_append_string(b, "Response=success\r\n");
            return -1;
        }
        while(fgets(linestr,1024,fp) != NULL)
        {
            if(!strstr(linestr,tcpps))
            {
                system("/system/lighttpd/sbin/tcpserver &");
                break;
            }
        }
        fclose(fp);    
    } 
    //state = valid_connection(con);
    temp = malloc(128);
    sprintf(temp, "response=Success\r\n");
    buffer_append_string(b, temp);
    free(temp);
}

static int handle_developmode(server *srv, connection *con, buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;    
    int state = 0;
    int len = 128;
    char *temp = NULL;
    char propdeve[128] = "";
    char *handleway = NULL;
    char *devestate = NULL;
    
    handleway = msg_get_header(m,"way");
    if(handleway == NULL)
    {
        handleway = "";
    }
    else
    {
        uri_decode(handleway);
    }

    temp = malloc(len);
    memset(propdeve,0,len);
    memset(temp,0,len);
    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        free(temp);
        return -1;
    }
    if ( !strcasecmp( handleway, "set" ) )
    {
        devestate = msg_get_header(m,"devestate");
        if(devestate == NULL)
        {
            devestate = "0";
        }
        else
        {
            uri_decode(devestate);
        }
        
        fprintf(stderr, "setDevelopMode\n");
        message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setDevelopMode" );
        if (message != NULL)
        {
            dbus_message_set_auto_start (message, TRUE);
            dbus_message_iter_init_append( message, &iter );

            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &devestate ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            } 

            dbus_message_append_args( message,  DBUS_TYPE_INVALID );
            dbus_error_init( &error );
            reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
            if ( dbus_error_is_set( &error ) )
            {
                fprintf(stderr, "Error %s: %s\n",
                    error.name,
                    error.message);
            }

            if ( reply )
            {
                print_message( reply );
                int current_type;
                char *res2 = NULL;
                dbus_message_iter_init( reply, &iter );
                while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
                {
                    switch ( current_type )
                    {
                        case DBUS_TYPE_STRING:
                            dbus_message_iter_get_basic(&iter, &res2);
                            printf( "string type, %s\n", res2 );
                            break;
                            
                        default:
                            break;
                    }

                    dbus_message_iter_next (&iter);
                }
                if ( res2 != NULL )
                {
                    sprintf(temp, "%s", res2);
                }
                else
                {
                    sprintf(temp, "{\"response\":\"failed\"}");
                }
            }
        }
    }
    else if ( !strcasecmp( handleway, "get" ) )
    {
        fprintf(stderr, "getDevelopMode\n");
        message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "getDevelopMode" );
        if (message != NULL)
        {
            dbus_message_set_auto_start (message, TRUE);
            dbus_message_iter_init_append( message, &iter );
            
            dbus_message_append_args( message,  DBUS_TYPE_INVALID );
            dbus_error_init( &error );
            reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
            if ( dbus_error_is_set( &error ) )
            {
                fprintf(stderr, "Error %s: %s\n",
                    error.name,
                    error.message);
            }

            if ( reply )
            {
                print_message( reply );
                int current_type;
                char *res2 = NULL;
                dbus_message_iter_init( reply, &iter );
                while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
                {
                    switch ( current_type )
                    {
                        case DBUS_TYPE_STRING:
                            dbus_message_iter_get_basic(&iter, &res2);
                            printf( "string type, %s\n", res2 );
                            break;
                            
                        default:
                            break;
                    }

                    dbus_message_iter_next (&iter);
                }
                if ( res2 != NULL )
                {
                    sprintf(temp, "%s", res2);
                }
                else
                {
                    sprintf(temp, "{\"response\":\"failed\"}");
                }
            }
        }
    }
    else
    {
        sprintf(temp, "{\"response\":\"failed\"}");
    }
    
    buffer_append_string(b, temp);
    free(temp);
#endif
    return 0;
}

/**********************************************/
static int handle_getLineStatus(server *srv, connection *con, buffer *b, const struct message *m)
{
printf("  handle_getLineStatus \r\n");
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    int lineIndex = 0;
    char res[128] = "";
    char *info = NULL;

    temp = msg_get_header(m, "line");
    if ( temp  == NULL || strlen(temp) == 0)
    {
        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            temp = "{\"res\": \"error\", \"msg\": \"line can't be null\"}";
            temp = build_JSON_res( srv, con, m, temp );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string (b, "Response=Error\r\n");
            snprintf(res, sizeof(res), "Message=line can't be null\r\n" );
            buffer_append_string(b, res);
        }
    }
    else
    {
        lineIndex = atoi(temp);
        if( lineIndex > 7 || lineIndex < 0 )
        {
          const char *resType = msg_get_header(m, "format");
              if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
            {
                temp = "{\"res\": \"error\", \"msg\": \"line invalid\"}";
                temp = build_JSON_res( srv, con, m, temp );
                buffer_append_string( b, temp );
                free(temp);
            }
            else
            {
                buffer_append_string (b, "Response=Error\r\n");
                snprintf(res, sizeof(res), "Message=line invalid\r\n" );
                buffer_append_string(b, res);
            }
            return;
        }
        type = DBUS_BUS_SYSTEM;
        dbus_error_init (&error);
        conn = dbus_bus_get (type, &error);
        if (conn == NULL)
        {
            printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
            dbus_error_free (&error);
            return -1;
        }

        fprintf(stderr, "handle_lineStatus\n");
        message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "getLineStatus" );

        if (message != NULL)
        {
            dbus_message_set_auto_start (message, TRUE);
            dbus_message_iter_init_append( message, &iter );

            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &lineIndex ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
            dbus_message_append_args( message,  DBUS_TYPE_INVALID );

         //   dbus_error_init( &error );
            reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
            if ( dbus_error_is_set( &error ) )
            {
                fprintf(stderr, "Error %s: %s\n",
                    error.name,
                    error.message);
            }

            if ( reply )
            {
                print_message( reply );
                int current_type;
                char *res = NULL;
                dbus_message_iter_init( reply, &iter );

                while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
                {
                    switch ( current_type )
                    {
                        case DBUS_TYPE_STRING:
                            dbus_message_iter_get_basic(&iter, &res);
                            break;

                        default:
                            break;
                    }

                    dbus_message_iter_next (&iter);
                }

                if ( res != NULL )
                {
                    info = (char*)malloc((1+ strlen(res)) * sizeof(char));
                    sprintf(info, "%s", res);
                    temp = info;
                }
                else
                {
                    temp = "{\"res\": \"error\", \"msg\": \"can't get line status\"}";
                }

                temp = build_JSON_formate( srv, con, m, temp );

                if(info != NULL)
                {
                    free(info);
                }

                if ( temp != NULL )
                {
                    buffer_append_string( b, temp );
                    free(temp);
                }
                dbus_message_unref( reply );
            }

            dbus_message_unref( message );
        }
    }
#endif
    return 0;
}

static int handle_originatecall (server *srv, connection *con,
    buffer *b, const struct message *m)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    int account = 0;
    int isVideo = 0;
    int isPaging = 0;
    int isDialPlan = 0;
    int isipcall = 0;
    const char *num = NULL;
    const char *headerString = "";
    char *temp = NULL;
    char res[128] = "";
    char *info = NULL;

    num = msg_get_header(m, "destnum");

    if ( num  == NULL || strlen(num) == 0)
    {
        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            temp = "{\"res\": \"error\", \"msg\": \"destnum can't be null\"}";
            temp = build_JSON_res( srv, con, m, temp );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string (b, "Response=Error\r\n");
            snprintf(res, sizeof(res), "Message=Number can't be null\r\n" );
            buffer_append_string(b, res);
        }
    }
    else
    {
        uri_decode((char*)num);
        type = DBUS_BUS_SYSTEM;
        dbus_error_init (&error);
        conn = dbus_bus_get (type, &error);
        if (conn == NULL)
        {
            printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
            dbus_error_free (&error);
            return -1;
        }

        fprintf(stderr, "handle_originatecall\n");
        message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "originateCall" );

        if (message != NULL)
        {
            dbus_message_set_auto_start (message, TRUE);
            dbus_message_iter_init_append( message, &iter );

            temp = msg_get_header(m, "account");
            if ( temp != NULL )
            {
                account = atoi( temp );
                printf("account: %d\n", account);
                printf("destnum: %s\n", num);
            }
            temp = msg_get_header(m, "isvideo");
             printf("isVideo: temp %s\n", temp);
            if ( temp != NULL )
            {
                if ( !strcasecmp( temp, "1" ) )
                {
                    isVideo = 1;
                }
            }
            printf("isVideo: %d\n", isVideo);

            temp = msg_get_header(m, "isdialplan");
            if ( temp != NULL )
            {
                if ( !strcasecmp( temp, "1" ) )
                {
                    isDialPlan = 1;
                }
            }
            temp = msg_get_header(m, "ispaging");
            printf("isPaging: temp %s\n", temp);
            if ( temp != NULL )
            {
                if ( !strcasecmp( temp, "1" ) )
                {
                    isPaging = 1;
                }
            }

            temp = msg_get_header(m, "isipcall");
            printf("isipcall: temp %s\n", temp);
            if ( temp != NULL )
            {
                if ( !strcasecmp( temp, "1" ) )
                {
                    isipcall = 1;
                }
            }

            temp = msg_get_header(m, "headerstring");
            if ( temp != NULL )
            {
                headerString = temp;
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &account ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
                if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &isVideo ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            } 
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &isDialPlan ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            } 
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &isPaging ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &isipcall ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &num ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            } 
            
            printf("num---%s\n", num);
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &headerString ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            } 
            //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
	    dbus_message_append_args( message,  DBUS_TYPE_INVALID );

            dbus_error_init( &error );
            reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
            if ( dbus_error_is_set( &error ) )
            {
                fprintf(stderr, "Error %s: %s\n",
                    error.name,
                    error.message);
            }

            if ( reply )
            {
                print_message( reply );
                int current_type;
                char *res2 = NULL;
                dbus_message_iter_init( reply, &iter );
                while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
                {
                    switch ( current_type )
                    {
                        case DBUS_TYPE_STRING:
                            dbus_message_iter_get_basic(&iter, &res2);
                            printf( "string type, %s\n", res2 );
                            break;
                            
                        default:
                            break;
                    }

                    dbus_message_iter_next (&iter);
                }
                if ( res2 != NULL )
                {
                    info = (char*)malloc((1+ strlen(res2)) * sizeof(char));
                    sprintf(info, "%s", res2);
                    temp = info;
                }
                else
                {
                    temp = "{\"res\": \"error\", \"msg\": \"timeout\"}";
                }
                temp = build_JSON_res( srv, con, m, temp );
                if(info != NULL)
                {
                    free(info);
                }
                if ( temp != NULL )
                {
                    buffer_append_string( b, temp );
                    free(temp);
                }
                dbus_message_unref( reply );
            }
            dbus_message_unref( message );
        }
    }
#endif
    return 0;
}

static int handle_addconfmemeber (server *srv, connection *con,
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *numbers = NULL, *accts = NULL, *callmode = NULL, *videotmp = NULL;
    const char *confname = NULL;
    char *temp = NULL;
    char res[128] = "";
    char *info = NULL;
    int videostate = 1;
    char *confid = NULL;
    int quickstart = 0;
    char *pingcode = NULL, *isquickstart = NULL, *isdialplan = NULL;

    numbers = msg_get_header(m, "numbers");
    accts = msg_get_header(m, "accounts");
    callmode = msg_get_header(m, "callmode");
    videotmp = msg_get_header(m, "isvideo");
    isquickstart = msg_get_header(m, "isquickstart");
    pingcode = msg_get_header(m, "pingcode");
    isdialplan = msg_get_header(m, "isdialplan");

    if ( numbers  == NULL || strlen(numbers) == 0 || accts  == NULL || strlen(accts) == 0)
    {
        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            temp = "{\"res\": \"error\", \"msg\": \"destnum can't be null\"}";
            temp = build_JSON_res( srv, con, m, temp );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string (b, "Response=Error\r\n");
            snprintf(res, sizeof(res), "Message=Number can't be null\r\n" );
            buffer_append_string(b, res);
        }
    }
    else
    {
        uri_decode((char*)numbers);
        uri_decode((char*)accts);
        type = DBUS_BUS_SYSTEM;
        dbus_error_init (&error);
        conn = dbus_bus_get (type, &error);
        if (conn == NULL)
        {
            printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
            dbus_error_free (&error);
            return -1;
        }

        fprintf(stderr, "handle_addconfmemeber\n");
        message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "addConfMemeber" );

        if (message != NULL)
        {
            dbus_message_set_auto_start (message, TRUE);
            dbus_message_iter_init_append( message, &iter );

            confname = msg_get_header(m, "confname");
            if ( confname != NULL )
            {
                uri_decode((char*)confname);
            }else{
                confname = "";
            }
            confid = msg_get_header(m, "confid");
            if ( confid == NULL || !strcmp(confid, ""))
            {
                confid = "-1";
            }

            if ( numbers != NULL )
            {
                uri_decode((char*)numbers);
            }else{
                numbers = "";
            }

            if ( accts != NULL )
            {
                uri_decode((char*)accts);
            }else{
                accts = "";
            }

            if ( callmode != NULL )
            {
                uri_decode((char*)callmode);
            }else{
                callmode = "call";
            }

            if ( videotmp != NULL )
            {
                videostate = atoi((char*)videotmp);
            }else{
                videostate = 1;
            }
            
            if(isquickstart != NULL)
                quickstart = atoi(isquickstart);
            
            if ( pingcode != NULL )
            {
                uri_decode((char*)pingcode);
            }else{
                pingcode = "";
            }

            if(isdialplan == NULL)
                isdialplan = "";
            
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &numbers ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &accts ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &confid ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &confname ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &callmode ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &videostate ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &quickstart ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &pingcode ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &isdialplan ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }

            //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
            dbus_message_append_args( message,  DBUS_TYPE_INVALID );

            dbus_error_init( &error );
            reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
            if ( dbus_error_is_set( &error ) )
            {
                fprintf(stderr, "Error %s: %s\n",
                    error.name,
                    error.message);
            }

            if ( reply )
            {
                print_message( reply );
                int current_type;
                char *res2 = NULL;
                dbus_message_iter_init( reply, &iter );
                while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
                {
                    switch ( current_type )
                    {
                        case DBUS_TYPE_STRING:
                            dbus_message_iter_get_basic(&iter, &res2);
                            printf( "string type, %s\n", res2 );
                            break;

                        default:
                            break;
                    }

                    dbus_message_iter_next (&iter);
                }
                if ( res2 != NULL )
                {
                    info = (char*)malloc((1+ strlen(res2)) * sizeof(char));
                    sprintf(info, "%s", res2);
                    temp = info;
                }
                else
                {
                    temp = "{\"res\": \"error\", \"msg\": \"timeout\"}";
                }
                temp = build_JSON_res( srv, con, m, temp );
                if(info != NULL)
                {
                    free(info);
                }
                if ( temp != NULL )
                {
                    buffer_append_string( b, temp );
                    free(temp);
                }
                dbus_message_unref( reply );
            }
            dbus_message_unref( message );
        }
    }
    return 0;
}

static int handle_vendor (server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    char res[128] = "";
    char buf[128] = "";
    FILE *sys_file;
    char *temp = NULL;
    int ret = -1;
    
    sys_file = fopen ("/proc/gxvboard/dev_info/vendor_fullname", "r");
    
    if (sys_file != NULL) {
        fread (buf, 127, 1, sys_file);
        fclose (sys_file);

        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\" : \"success\", \"vendor\" ", buf );
            temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string (b, "Response=Success\r\n");
            snprintf(res, sizeof(res), "Vendor=%s\r\n", buf);
            buffer_append_string(b, res);
        }
        ret = 1;
    } else {
        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "%s", "{\"res\": \"error\", \"msg\": \"can't get vendor\"}" );
            temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string(b, "Response=Error\r\n"
                    "Message=Can't get vendor\r\n");
        }
        ret = -1;
    }

    return ret;
}

#endif

/*Duplicate with handle_product && handle_vendor for save http request purpose*/
static int handle_productinfo (server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    char res[128] = "";
    char buf[128] = "";
    char vendorBuf[128] = "";
    FILE *sys_file;
    char * temp = NULL;

    sys_file = fopen ("/proc/gxvboard/dev_info/vendor_fullname", "r");
    
    if (sys_file != NULL) {
        fread (vendorBuf, 127, 1, sys_file);
        fclose (sys_file);
    }

    sys_file = fopen ("/proc/gxvboard/dev_info/dev_alias", "r");

    if (sys_file != NULL) {
        fread (buf, 127, 1, sys_file);
        fclose (sys_file);

        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\", \"vendor\":\"%s\"}", "{\"res\": \"success\", \"product\" ", buf, vendorBuf );
            temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string (b, "Response=Success\r\n");

            snprintf(res, sizeof(res), "Product=%s\r\nVendor=%s\r\n", buf, vendorBuf );
            buffer_append_string(b, res);
        }
        return 1;
    } else {
        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"error\", \"msg\" ", "can't get product information" );
            temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string(b, "Response=Error\r\n"
                    "Message=Can't get product model\r\n");
        }
        return -1;
    }

    return -1;
}

static int handle_product (server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    char res[128] = "";
    char buf[128] = "";
    FILE *sys_file;
    char * temp = NULL;

    sys_file = fopen ("/proc/gxvboard/dev_info/dev_alias", "r");

    if (sys_file != NULL) {
        fread (buf, 127, 1, sys_file);
        fclose (sys_file);

        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"success\", \"product\" ", buf );
            temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string (b, "Response=Success\r\n");

            snprintf(res, sizeof(res), "Product=%s\r\n", buf);
            buffer_append_string(b, res);
        }
        return 1;
    } else {
        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"error\", \"msg\" ", "can't get product model" );
            temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string(b, "Response=Error\r\n"
                    "Message=Can't get product model\r\n");
        }
        return -1;
    }

    return -1;
}

static int handle_hardware (server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    char res[128] = "";
    char buf[128] = "";
    FILE *sys_file;
    char *temp = NULL;
    
    sys_file = fopen ("/proc/gxvboard/dev_info/dev_rev", "r");
    
    if (sys_file != NULL) {
        fread (buf, 127, 1, sys_file);
        fclose (sys_file);

        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"success\", \"hardware\" ", buf );
            temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            snprintf(res,sizeof(res), "Response=Success\r\nHardware=%s\r\n" , buf);
            buffer_append_string (b, res);
        }
        return 1;
    } else {
         const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"error\", \"msg\" ", "can't get hardware version" );
            temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string (b, "Response=Error\r\n"
                    "Message=Can't get Hardware version\r\n");
        }
        return -1;
    }

    return -1;
}

static int start_daemon(int type)
{
    /* Our process ID and Session ID */
    pid_t pid = -1, sid = -1;

    /* Fork off the parent process */
    pid = fork();
    if ( pid < 0 )
    {
        exit( -2 );
    }
    /* If we got a good PID, then
       we can exit the parent process. */
    if ( pid > 0 )
    {
//exit the parent process
        exit( 0 );
    }

    /* Change the file mode mask */
    umask(0);

    /* Open any logs here */

    /* Create a new SID for the child process */
    sid = setsid();
    if ( sid < 0 )
    {
/* Log the failure */
        exit( -2 );
    }

    /* Change the current working directory */
    if ( (chdir("/")) < 0 )
    {
/* Log the failure */
        exit( -2 );
    }

    /* Close out the standard file descriptors */
    close(STDIN_FILENO);
    close(STDOUT_FILENO);
    close(STDERR_FILENO);

    /* Daemon-specific initialization goes here */

    // Child process.
    if ( pid == 0 )
    {
        if( type == 1 )
            system("am broadcast --user all -a com.base.module.systemmanager.UPGRADE_OR_REBOOT --es type shutdown");
        else if( type == 2 )
            system("am broadcast --user all -a com.base.module.systemmanager.UPGRADE_OR_REBOOT --es type sleep");
        else if( type == 3 )
            system("am broadcast --user all -a com.base.module.systemmanager.UPGRADE_OR_REBOOT --es type wakeup");
        else
            system("am broadcast --user all -a com.base.module.systemmanager.UPGRADE_OR_REBOOT --es type reboot");
    }

    exit(EXIT_SUCCESS);
}

static pid_t start_reboot(int type)
{
    //This process is used as daemon's parent, which will be ended when daemon is forked.
    pid_t pid = fork();

    // Fork error
    if ( pid == -1 )
    {
        return -1;
    }
    else if ( pid > 0 )
    {
        waitpid( pid, NULL, 0 );
    }
    // Child process.
    else if ( pid == 0 )
    {
        start_daemon(type);
    }

    return pid;
}

static int handle_reboot(server *srv, connection *con, buffer *b, const struct message *m)
{
    system("getprop sys.boot_completed > /tmp/bootcompleted");
    FILE *fp = fopen("/tmp/bootcompleted", "r");
    char bootok[2] = "";
    if (fp == NULL)
    {
        buffer_append_string (b, "Response=Error\r\nMessage=Boot not completed\r\n");
        return -1;
    }

    fgets( &bootok, sizeof(bootok), fp );
    if( !strcasecmp( bootok, "1" ) ){
        fclose(fp);
        buffer_append_string(b, "Response=Success\r\nMessage=Reboot Success\r\n");

        const char *temp = NULL;
        temp = msg_get_header(m, "reboottype");
        int type = 0;
        if( temp != NULL )
            type = atoi(temp);
        if( type == 0 )
            handle_callservice_by_no_param(srv, con, b, m, "rebootDevice");
        else
            start_reboot(type);
    }else{
        buffer_append_string (b, "Response=Error\r\nMessage=Boot not completed\r\n");
        fclose(fp);
        return -1;
    }

    return 0;
}

#ifndef BUILD_RECOVER
static int handle_pn (server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    char res[128] = "";
    char buf[128] = "";
    FILE *sys_file;

    sys_file = fopen ( "/proc/gxvboard/dev_info/PN", "r" );
    
    if (sys_file != NULL) {
        fread (buf, 127, 1, sys_file);
        fclose (sys_file);
        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"success\", \"pn\" ", buf );
            char *temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string (b, "Response=Success\r\n");
            snprintf(res, sizeof(res), "PN=%s\r\n", buf );
            buffer_append_string(b, res);
        }
        return 1;
    } else {
        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"error\", \"msg\" ", "can't get pn" );
            char *temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string(b, "Response=Error\r\n"
                    "Message=Can't get PN\r\n");
        }
        return -1;
    }

    return 1;
}

static int handle_sn (server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    char buf[128] = "";
    char res[128] = "";

    char pn[128] = "";
    FILE *sys_file = fopen ( "/proc/gxvboard/dev_info/PN", "r" );
    
    if (sys_file != NULL) 
    {
        fread (pn, 127, 1, sys_file);
        fclose (sys_file);
    }
    

    get_mac_address ("eth0", buf);
    const char *resType = msg_get_header(m, "format");
    if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
    {
        if ( ( strcasestr( pn, "963-40017" ) != NULL ) || ( strcasestr( pn, "96340017" ) != NULL ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"success\", \"sn: 00100300YY0200100000\" ", buf );
        }
        else if ( ( strcasestr( pn, "963-50017" ) != NULL ) || ( strcasestr( pn, "96350017" ) != NULL ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"success\", \"sn: 00100300TF0200100000\" ", buf );
        }
        else if ( ( strcasestr( pn, "963-30017" ) != NULL ) || ( strcasestr( pn, "96330017" ) != NULL ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"success\", \"sn: 00100300SB0100100000\" ", buf );
        }
        else if ( ( strcasestr( pn, "963-20015" ) != NULL ) || ( strcasestr( pn, "96320015" ) != NULL ) 
			|| ( strcasestr( pn, "963-30015" ) != NULL ) || ( strcasestr( pn, "96330015" ) != NULL ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"success\", \"sn: 00100300ZX3100100000\" ", buf );
        }
        else if ( ( strcasestr( pn, "963-70017" ) != NULL ) || ( strcasestr( pn, "96370017" ) != NULL ) )
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"success\", \"sn: 00100300ZX4100100000\" ", buf );
        }
        else
        {
            snprintf( res, sizeof( res ),
                    "%s: \"%s\"}", "{\"res\": \"success\", \"sn: 00100300CL0200100000\" ", buf );
        }
        char *temp = build_JSON_res( srv, con, m, res );
        buffer_append_string( b, temp );
        free(temp);
    }
    else
    {
        buffer_append_string (b, "Response=Success\r\n");
         if ( ( strcasestr( pn, "963-40017" ) != NULL ) || ( strcasestr( pn, "96340017" ) != NULL ) )
        {
             snprintf(res, sizeof(res), "sn=00100300YY0200100000%s\r\n", buf );
        }
        else if ( ( strcasestr( pn, "963-50017" ) != NULL ) || ( strcasestr( pn, "96350017" ) != NULL ) )
        {
            snprintf(res, sizeof(res), "sn=00100300TF0200100000%s\r\n", buf );
        }
        else if ( ( strcasestr( pn, "963-30017" ) != NULL ) || ( strcasestr( pn, "96330017" ) != NULL ) )
        {
            snprintf(res, sizeof(res), "sn=00100300SB0100100000%s\r\n", buf );
        }
        else if ( ( strcasestr( pn, "963-20015" ) != NULL ) || ( strcasestr( pn, "96320015" ) != NULL ) 
			|| ( strcasestr( pn, "963-30015" ) != NULL ) || ( strcasestr( pn, "96330015" ) != NULL ) )
        {
            snprintf(res, sizeof(res), "sn=00100300ZX3100100000%s\r\n", buf );
        }
        else if ( ( strcasestr( pn, "963-70017" ) != NULL ) || ( strcasestr( pn, "96370017" ) != NULL ) )
        {
            snprintf(res, sizeof(res), "sn=00100300ZX4100100000%s\r\n", buf );
        }
        else if ( !strcasecmp( pn, "963-90015" ) || !strcasecmp( pn, "96390015" ) )
        {
            snprintf(res, sizeof(res), "sn=00100300CL0200200000%s\r\n", buf );
        }
        else
        {
            snprintf(res, sizeof(res), "sn=00100300CL0200100000%s\r\n", buf );
        }
       
        buffer_append_string (b, res);
    }
    return 0;
}

static int dbus_send_proxyupdated ( void )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_PROXYUPDATED);
    if ( message == NULL )
    {
        printf( "message is NULL\n" );
        return 1;
    }

    dbus_message_append_args( message,  DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif
    return 0;
}

static int handle_factset (buffer *b,const struct message *m)
{
    /*FILE *file_fd = NULL;
    file_fd = fopen( "/proc/bootloader_bcd", "w+");

    if (file_fd != NULL)
    {
        const char *temp = NULL;
        temp = msg_get_header(m, "resetstyle");
        if(temp != NULL && strcmp(temp,"1") == 0) {
            const char *resetclear = "factory_reset 1 2 3 4";
            fwrite( resetclear, sizeof(resetclear), strlen("factory_reset 1 2 3 4") + 1, file_fd );
        }else{
            const char *reset = "factory_reset 1 2 3";
            fwrite( reset, sizeof(reset), strlen("factory_reset 1 2 3") + 1, file_fd );
        }
        //fwrite( "factory_reset 1 2 3", 1, strlen("factory_reset 1 2 3"), file_fd );
        fclose( file_fd );
        sync();
    }*/

    const char *temp = NULL;
    temp = msg_get_header(m, "resetstyle");
    int result;
    if(temp != NULL && strcmp(temp,"1") == 0) {
        result = system("am broadcast -a \"com.base.module.systemmanager.FACTORY_RESET\" --es cmd \"fixed_factory_reset 15\"");   // 1|2|4|8
    }else{
        result = system("am broadcast -a \"com.base.module.systemmanager.FACTORY_RESET\" --es cmd \"fixed_factory_reset 7\"");   // 1|2|4
    }
    sync();
    
    if( result == 0 )
        buffer_append_string (b, "Response=Success\r\n");
    else
        buffer_append_string (b, "Response=Error\r\n");

    return 1;
}

static int handle_backupcfg(buffer *b)
{
    int result = system("restorenvram -backup");
    if( result == 0 )
        buffer_append_string(b, "Response=Success\r\n");
    else
        buffer_append_string(b, "Response=Error\r\n");
    return 1;
}

static int handle_restorecfg(buffer *b)
{
    int result = system("restorenvram -restore");
    if( result == 0 )
        buffer_append_string(b, "Response=Success\r\n");
    else
        buffer_append_string(b, "Response=Error\r\n");
    return 1;
}

static int get_ip_mask(char* ifname, char *mask)
{
    struct ifreq ifr;
    int fd;

    if (mask == NULL) {
        return -1;
    }
    strcpy (mask, "none");

    fd = socket (AF_INET, SOCK_DGRAM, 0);
    if (fd >= 0) {
        u_int32_t ip;

        strcpy( ifr.ifr_name, ifname );

        if (ioctl (fd, SIOCGIFNETMASK, &ifr) == 0) {
            ip = ntohl (((struct sockaddr_in*)&ifr.ifr_addr)->sin_addr.s_addr);
            sprintf (mask, "%u.%u.%u.%u", (ip >> 24) & 0xff, (ip >> 16) & 0xff,
                    (ip >> 8) & 0xff, ip &0xff);
        } else {
            close(fd);
            return -1;
        }

        close(fd);
        return 0;
    }
    return -1;
}

/*static int dbus_send_factfun ( const int arg1 )
{
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_FACTFUN);
    if ( message == NULL )
    {
        printf( "message is NULL\n" );
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INT32, &arg1, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );

    return 0;
}*/

static int get_ip_address(char* ifname, char *addr)
{
    struct ifreq ifr;
    int fd;

    if (addr == NULL) {
        return -1;
    }
    strcpy(addr, "none");

    fd = socket (AF_INET, SOCK_DGRAM, 0);
    if (fd >= 0) {
        u_int32_t ip;

        strcpy (ifr.ifr_name, ifname);
        if (ioctl (fd, SIOCGIFADDR, &ifr) == 0) {
            ip = ntohl (((struct sockaddr_in*)&ifr.ifr_addr)->sin_addr.s_addr);
            sprintf (addr, "%u.%u.%u.%u", (ip >> 24) & 0xff, (ip >> 16) & 0xff,
            (ip >> 8) & 0xff, ip & 0xff);
        } else {
            close (fd);
            return -1;
        }

        close (fd);
        return 0;
    }
    return -1;
}

static int get_ipv6_address(char *iface, char *ipaddr)
{
    char str[128], address[64] = {0};
    char *addr, *index, *prefix, *scope, *flags, *name;
    char *delim = " \t\n", *p, *q;
    FILE *fp;
    int count, zero_flag, zero_count, max_zero_count, pos_flag, times_flag, unzero_flag;

    if (!ipaddr || !iface) {
        //printerr("addr6 and iface can't be NULL!\n");
        return -1;
    }

    strcpy(ipaddr, "");

    if (NULL == (fp = fopen(PROC_IF_INET6_PATH, "r"))) {
        //printerr("fopen error");
        return -1;
    }
    while (fgets(str, sizeof(str), fp)) {
        addr = strtok(str, delim);
        index = strtok(NULL, delim);
        prefix = strtok(NULL, delim);
        scope = strtok(NULL, delim);
        flags = strtok(NULL, delim);
        name = strtok(NULL, delim);
        //addr, index, prefix, scope, flags, name);

        if (strcmp(name, iface))
            continue;

        /* Just get IPv6 global address */
        if (strncmp("fe80", addr, 4) == 0)
            continue;

        memset(address, 0x00, sizeof(address));
        p = addr;
        q = address;
        count = 0;
        zero_flag = 0;
        zero_count = 0;
        max_zero_count = 0;
        pos_flag = 0;
        times_flag = 0;
        unzero_flag = 0;
        while (*p != '\0') {
            if (count == 4) {
                if (zero_flag == 0) {
                    zero_count++;
                    if (zero_count > max_zero_count) {
                        max_zero_count = zero_count;
                        if (times_flag == 7) {
                            pos_flag = 2;
                        }

                        if (unzero_flag == 0) {
                            pos_flag = 1;
                        }
                    }
                } else {
                    zero_count = 0;
                    unzero_flag = 1;
                }

                if (zero_count == 0) {
                    *q++ = ':';
                } else {
                    *q++ = '0';
                    *q++ = ':';
                }

                count = 0;
                zero_flag = 0;
                times_flag ++;
            }

            if (zero_flag == 0 && *p == '0') {
                p++;
            } else {
                *q++ = *p++;
                zero_flag = 1;
            }

            //*q++ = *p++;
            count++;
        }

        // need to format the '0' to '::'
        if (max_zero_count != 0) {
            char zero_str[16] = {0}, final_address[64] = {0};
            for (int i = 0; i < max_zero_count; i++) {
                if (i == 0 && pos_flag == 1) {
                    strcat(zero_str, "0");
                } else {
                    strcat(zero_str, ":0");
                }
                if (i == max_zero_count - 1 && pos_flag != 2) {
                    strcat(zero_str, ":");
                }
            }

            char *zero_ptr = strstr(address, zero_str);

            if (zero_ptr != NULL) {
                snprintf(final_address, zero_ptr - address + 1, "%s", address);
                strcat(final_address, "::");
                char tmpstr[64] = {0};
                snprintf(tmpstr, sizeof(tmpstr), "%s", zero_ptr + strlen(zero_str));
                strcat(final_address, tmpstr);
            }

            strcpy(ipaddr, final_address);
        } else {
            //strcpy(ipaddr,address);
            strcpy(ipaddr, address);
        }
        //inet_pton(AF_INET6, address, addr6);
        break;
    }

    fclose(fp);
    return 0;
}



static int handle_network (server *srv, connection *con,
    buffer *b, const struct message *m)
{
    char buf[128] = "";
    char res[128] = "";
    char mac[64] = "";
    char ip[64] = "";
    char ipv6[64] = "";
    char mask[64] = "";
    char gateway[64] = "";
    char dns[64] = "\0";
    char ipv6dns1[64] = "";
    char ipv6dns2[64] = "";
    char dns2[64] = "\0";
    char type[64] = "";
    char ipv6type[64] = "";
    char *info = NULL;
    char *temp = NULL;
    char *val = NULL;
    const char *resType = NULL;
    int ipv4_type = 0;
    int ipv6_type = 0;
    resType = msg_get_header(m, "format");
#ifdef BUILD_ON_ARM
    char *p_value = nvram_get("wan_device");
#else
    char *p_value = NULL;
#endif

    if ( (resType == NULL) || strcasecmp( resType, "json" ) )
    {
        buffer_append_string (b, "Response=Success\r\n");
    }
    
    if(p_value != NULL && p_value[0] != '\0' && strstr(p_value, "ppp") == NULL)
    {
        get_mac_address(p_value, buf);
    }
    else
    {
        get_mac_address("eth0", buf);
    }
    
    if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
    {
        snprintf(mac, sizeof(mac), "%s", buf );
    }
    else
    {
        snprintf(res, sizeof(res), "Mac=%s\r\n", buf );
        buffer_append_string (b, res);
    }
    
    if (p_value != NULL && p_value[0] != '\0')
    {
        get_ip_address(p_value, buf);
    }
    else
    {
        get_ip_address ("eth0", buf);
    }

    if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
    {
        snprintf(ip, sizeof(ip), "%s", buf );
    }
    else
    {
        snprintf(res, sizeof(res), "IP=%s\r\n", buf );
        buffer_append_string (b, res);
    }
   
    if (p_value != NULL && p_value[0] != '\0')
    {
        get_ip_mask(p_value, buf);
    }
    else
    {
        get_ip_mask("eth0", buf);
    }
    
    if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
    {
        snprintf(mask, sizeof(mask), "%s", buf );
    }
    else
    {
        snprintf(res, sizeof(res), "Mask=%s\r\n", buf );
        buffer_append_string (b, res);
    }
    
    get_gateway (buf);

    if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
    {
        snprintf(gateway, sizeof(gateway), "%s", buf );
    }
    else
    {
        snprintf(res, sizeof(res), "Gateway=%s\r\n", buf );
        buffer_append_string (b, res);
    }
    
    temp = nvram_my_get("8");
    if (temp != NULL)
        ipv4_type = atoi(temp);

    /*if (ipv4_type == 1)
    {
        snprintf(buf, sizeof(buf), "%s.%s.%s.%s", nvram_my_get("21"), nvram_my_get("22"), nvram_my_get("23"), nvram_my_get("24"));
    }
    else
    {
        get_dns_server(buf, 1);
    }*/
    
    get_dns_server(buf, 1);

    if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
    {
        snprintf(dns, sizeof(dns), "%s", buf );
    }
    else
    {
        snprintf(res, sizeof(res), "DNS=%s\r\n", buf );
        buffer_append_string (b, res);
    }

    /*if (ipv4_type == 1)
    {
        snprintf(buf, sizeof(buf), "%s.%s.%s.%s", nvram_my_get("25"), nvram_my_get("26"), nvram_my_get("27"), nvram_my_get("28"));
    }
    else
    {
        get_dns_server(buf, 2);
    }*/
    
    get_dns_server(buf, 2);

    if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
    {
       snprintf(dns2,sizeof(dns2),"%s",buf);
    }
    else
    {
        snprintf(res, sizeof(res), "DNS2=%s\r\n", buf );
        buffer_append_string (b, res);
    }
   
    temp = nvram_my_get("1419");
    if (temp != NULL)
        ipv6_type = atoi(temp);

    if (ipv6_type == 1)
    {
        snprintf(buf, sizeof(buf), "%s", nvram_my_get("1420"));
    }
    else if (p_value != NULL && p_value[0] != '\0')
    {
        get_ipv6_address(p_value, buf);
    }
    else
    {
        get_ipv6_address("eth0", buf);
    }

    if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
    {
        snprintf(ipv6, sizeof(ipv6), "%s", buf );
    }
    else
    {
        snprintf(res, sizeof(res), "IPv6=%s\r\n", buf );
        buffer_append_string (b, res);
    }

    /*
    if (ipv6_type == 1)
    {
        snprintf(buf, sizeof(buf), "%s", nvram_my_get("1424"));
    }
    else
    {
        get_ipv6_dns_server(buf, 1);
    }
    */    
    temp = nvram_my_get("1424");
    if (temp != NULL && !strcmp(temp, "")) {
        snprintf(buf, sizeof(buf), "%s", temp);
    }
    else
    {
        get_ipv6_dns_server(buf, 1);
    }

    if ((resType != NULL) && !strcasecmp(resType, "json"))
    {
        snprintf(ipv6dns1, sizeof(ipv6dns1), "%s", buf);
    }
    else
    {
        snprintf(res, sizeof(res), "IPv6DNS1=%s\r\n", buf);
        buffer_append_string (b, res);
    }

    /*
    if (ipv6_type == 1)
    {
        snprintf(buf, sizeof(buf), "%s", nvram_my_get("1425"));
    }
    else
    {
        get_ipv6_dns_server(buf, 2);
    }
    */
    temp = nvram_my_get("1425");
    if (temp != NULL && !strcmp(temp, "")) {
        snprintf(buf, sizeof(buf), "%s", temp);
    }
    else
    {
        get_ipv6_dns_server(buf, 2);
    }

    if ((resType != NULL) && !strcasecmp(resType, "json"))
    {
        snprintf(ipv6dns2, sizeof(ipv6dns2), "%s", buf);
    }
    else
    {
        snprintf(res, sizeof(res), "IPv6DNS2=%s\r\n", buf);
        buffer_append_string (b, res);
    }

#ifdef BUILD_ON_ARM
    val = nvram_my_get ("8");
#else
    val = "0";
#endif
    if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
    { 
        if (strcmp (val, "0") == 0) 
        {
            snprintf(type, sizeof(type), "dhcp" );
        } 
        else if (strcmp (val, "2") == 0) 
        {
            snprintf(type, sizeof(type), "pppoe" );
        } 
        else 
        {
            snprintf(type, sizeof(type), "static" );
        }

        if (ipv6_type == 0)
        {
            snprintf(ipv6type, sizeof(ipv6type), "dhcp");
        }
        else
        {
            snprintf(ipv6type, sizeof(ipv6type), "static");
        }

        info = (char*)malloc((256 + strlen(mac) + strlen(ip) + strlen(mask) + strlen(gateway) + strlen(dns) + strlen(dns2)
                    + strlen(type) + strlen(ipv6) + strlen(ipv6dns1) + strlen(ipv6dns2) + strlen(ipv6type)) * sizeof(char));

        sprintf(info,
                "{\"res\" : \"success\", \"mac\" : \"%s\", \"ip\" : \"%s\", \"mask\" : \"%s\", \"gateway\" : \"%s\", \"dns\" : \"%s\","
                "\"dns2\" : \"%s\",  \"type\" : \"%s\", \"ipv6\":\"%s\", \"ipv6dns1\":\"%s\", \"ipv6dns2\":\"%s\", \"ipv6type\":\"%s\"}",
                mac, ip, mask, gateway, dns,dns2, type, ipv6, ipv6dns1, ipv6dns2, ipv6type);
        temp = info;
        temp = build_JSON_formate( srv, con, m, temp );

        if(info != NULL)
        {
            free(info);
        }

        if ( temp != NULL )
        {
            buffer_append_string( b, temp );
            free(temp);
        }
    }
    else
    {
        if (strcmp (val, "0") == 0) 
        {
            snprintf(res, sizeof(res), "type=dhcp\r\n" );
        } 
        else if (strcmp (val, "2") == 0) 
        {
            snprintf(res, sizeof(res), "type=pppoe\r\n" );
        } 
        else 
        {
            snprintf(res, sizeof(res), "type=static\r\n" );
        }
        buffer_append_string (b, res);

        if (ipv6_type == 0)
        {
            snprintf(res, sizeof(res), "ipv6type=dhcp\r\n" );
        }
        else
        {
            snprintf(res, sizeof(res), "ipv6type=static\r\n" );
        }
        buffer_append_string (b, res);
    }
    
    return 1;
}

static int handle_fxoexist(buffer *b)
{
    char res[128] = "";
    char buf[128] = "";
    int fxoexist;
    FILE *sys_file;
    
    sys_file = fopen ("/proc/gxvboard/dev_info/have_FXO", "r");
    
    if (sys_file != NULL) {
        fread (buf, 127, 1, sys_file);
        fclose (sys_file);

        sscanf (buf, "%d", &fxoexist);
        snprintf(res, sizeof(res), "Response=Success\r\n"
            "fxoexist=%d\r\n",fxoexist);
        buffer_append_string (b, res);
        return 1;

    } else {
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Can't get fxo status\r\n");
        return -1;
    } 
}

static int handle_fxostatus(buffer *b)
{
    char res[64] = "";

    snprintf(res, sizeof(res), "Response=Success\r\n"
            "fxocon=%d\r\n",fxocon );
    buffer_append_string (b, res);
    
    snprintf(res, sizeof(res), "fxostatus=%d\r\n",fxostatus );
    buffer_append_string (b, res);

    return 1;
}


static int handle_uptime (server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    char res[128] = "";
    char buf[128] = "";
    int day, hour, min, sec;
    long long sys_time;
    FILE *sys_file;
    
    sys_file = fopen ("/proc/uptime", "r");
    
    if (sys_file != NULL) {
        sys_time = 0;
        fread (buf, 127, 1, sys_file);
        fclose (sys_file);

        sscanf (buf, "%lld", &sys_time);

        day = sys_time / (24 * 3600);
        sys_time %= (24 * 3600);
        hour = sys_time / 3600;
        sys_time %= 3600;
        min = sys_time / 60;
        sec = sys_time % 60;

        const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "{\"res\": \"success\", \"day\": \"%d\", \"hour\" : \"%d\","
                    " \"min\" : \"%d\", \"sec\" : \"%d\"}", day, hour, min, sec );
            char *temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string (b, "Response=Success\r\n");

            snprintf(res, sizeof(res), "Day=%d\r\n"
                "Hour=%d\r\n"
                "Min=%d\r\n"
                "Sec=%d\r\n",
                day, hour, min, sec );
            buffer_append_string(b, res);
        }
    } else {
    const char *resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
            snprintf( res, sizeof( res ),
                    "{\"res\": \"error\", \"msg\": \"can't get uptime\"}" );
            char *temp = build_JSON_res( srv, con, m, res );
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            buffer_append_string(b, "Response=Error\r\n"
                    "Message=Can't get uptime\r\n");
        }
    }

    return 1;
}

static int handle_status (  server *srv, connection *con,buffer *b, const struct message *m)
{
    char res[128] = "";
    int order[7] = {0, 1, 2, 3, 4, 5, 6};
    int acctindex[7] = {0, 1, 2, 3, 4, 5, 8};
    const char *servers[7] = {"Unknown", "Unknown", "Unknown, Unknown", "Unknown", "Unknown", "Unknown"};
    const char *numbers[7] = {"Unknown", "Unknown", "Unknown, Unknown", "Unknown", "Unknown", "Unknown"};
    const char *disname[7] = {"Account 1", "Account 2", "Account 3, Account 4", "Account 5", "Account 6", "H323"};
    const char *var = NULL;
    var = nvram_safe_get("4923");
    if(strcasecmp(var,"Registered") == 0)
        accountstatus.acc3 = 1;
    else
        accountstatus.acc3 = 0;
    int statuses[7] = {accountstatus.acc1, accountstatus.acc2, accountstatus.acc3, accountstatus.acc4, accountstatus.acc5, accountstatus.acc6, accountstatus.acch323};
    const char *activate[7] = {"0", "0", "0", "0", "0", "0", "0"};
    int acctnum = 7;
    int tmporder;
    const char *resType = NULL;
    const char *jsonCallback = NULL;

#ifdef BUILD_ON_ARM
    pthread_mutex_lock (&dbusmutex);

    servers[0] = nvram_my_get("47");
    servers[1] = nvram_my_get("402");
    servers[2] = nvram_my_get("502");
    servers[3] = nvram_my_get("602");
    servers[4] = nvram_my_get("1702");
    servers[5] = nvram_my_get("1802");
    servers[6] = nvram_my_get("25033");

    numbers[0] = nvram_my_get("35");
    numbers[1] = nvram_my_get("404");
    numbers[2] = nvram_my_get("504");
    numbers[3] = nvram_my_get("604");
    numbers[4] = nvram_my_get("1704");
    numbers[5] = nvram_my_get("1804");
    numbers[6] = nvram_my_get("25035");

    disname[0] = nvram_my_get("270");
    disname[1] = nvram_my_get("417");
    disname[2] = nvram_my_get("517");
    disname[3] = nvram_my_get("617");
    disname[4] = nvram_my_get("1717");
    disname[5] = nvram_my_get("1817");
    disname[6] = nvram_my_get("25034");
    var = nvram_my_get("gsid_0");
    if (strlen(var) > 2)
    {
        for(int ipvideo = 0; ipvideo < 6; ipvideo ++)
        {
            if (strcasestr(servers[ipvideo], "ipvideotalk") != NULL)
            {
                numbers[ipvideo] = nvram_my_get("gsid_0");
                break;
            }
        } 
    }
    
    activate[0] = nvram_my_get("271");
    activate[1] = nvram_my_get("401");
    activate[2] = nvram_my_get("501");
    activate[3] = nvram_my_get("601");
    activate[4] = nvram_my_get("1701");
    activate[5] = nvram_my_get("1801");
    activate[6] = nvram_my_get("25059");
#endif

    resType = msg_get_header(m, "format");
    int onum = 0;

    if ( (resType == NULL) || strcasecmp( resType, "json" ) )
    {
        buffer_append_string (b, "Response=Success\r\n");
        for( onum = 0; onum < acctnum; onum++ )
        {
            tmporder = order[onum];
            snprintf(res, sizeof(res), "Account_%d_SERVER=%s\r\n", tmporder, servers[ tmporder ] );
            buffer_append_string(b, res);
            snprintf(res, sizeof(res), "Account_%d_NO=%s\r\n", tmporder, numbers[ tmporder ] );
            buffer_append_string(b, res);
            snprintf(res, sizeof(res), "Account_%d_NAME=%s\r\n", tmporder, disname[ tmporder ] );
            buffer_append_string(b, res);
            snprintf(res, sizeof(res), "Account_%d_STATUS=%d\r\n", tmporder, statuses[ tmporder ] );
            buffer_append_string(b, res);
            snprintf(res, sizeof(res), "Account_%d_ACTIVATE=%s\r\n", tmporder, activate[ tmporder ] );
            buffer_append_string(b, res);
        }
    }
    else
    {
         response_header_overwrite(srv, con, CONST_STR_LEN("Content-Type"),
                CONST_STR_LEN("application/x-javascript; charset=utf-8"));

        jsonCallback = msg_get_header( m, "jsoncallback" );
        if(jsonCallback != NULL){
            buffer_append_string(b,jsonCallback);
             buffer_append_string(b,"(");

        }

        buffer_append_string(b, "{\"Response\":\"Success\",\"Data\":[");
        int first = 0;
        for( onum = 0; onum < acctnum; onum++ )
        {
            tmporder = order[onum];
            if( !first )
            {
                snprintf(res, sizeof(res), "{\"Index\":\"%d\"", acctindex[onum] ); //account order
            }else
            {
                snprintf(res, sizeof(res), ",{\"Index\":\"%d\"", acctindex[onum] ); //account order
            }
            buffer_append_string(b, res);
            snprintf(res, sizeof(res), ",\"Server\":\"%s\"", servers[ tmporder ] ); //server
            buffer_append_string(b, res);
            snprintf(res, sizeof(res), ",\"Number\":\"%s\"", numbers[ tmporder ] ); //number
            buffer_append_string(b, res);
            snprintf(res, sizeof(res), ",\"Name\":\"%s\"", disname[ tmporder ] ); //account name
            buffer_append_string(b, res);
            snprintf(res, sizeof(res), ",\"Status\":\"%d\"", statuses[ tmporder ] ); //status
            buffer_append_string(b, res);
            snprintf(res, sizeof(res), ",\"Activate\":\"%s\"}", activate[ tmporder ] ); //activate
            buffer_append_string(b, res);
            first ++;
        }
        buffer_append_string(b, "]}");

        if(jsonCallback != NULL){
            buffer_append_string(b,")");
        }
    }

#ifdef BUILD_ON_ARM
    pthread_mutex_unlock(&dbusmutex);
#endif
    return 0;
}

static void xmlNodeSetEncodeContent(xmlDocPtr doc, xmlNodePtr cur, const xmlChar * content)
{
    xmlChar * encode_buf = NULL;
    
    if ((cur != NULL) && (content != NULL))
    {
        encode_buf = xmlEncodeEntitiesReentrant(doc, (xmlChar *) content);
        if (encode_buf != NULL)
        {
            xmlNodeSetContent(cur, (xmlChar *) encode_buf);
            xmlFree(encode_buf);
            encode_buf = NULL;
        }
    }
}

/*static int handle_gethwservers(buffer *b)
{
    xmlChar *key = NULL;
    xmlDoc *doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    char res[128] = "";

    doc = xmlReadFile(CONF_HWPHBK, NULL, 0);

    if (doc == NULL)
    {
        printf("error: could not parse file %s\n", CONF_HWPHBK);
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Configuration File Not Found\r\n");
        return -1;
    }

    buffer_append_string (b, "Response=Success\r\n");

    //Get the root element node
    root_element = xmlDocGetRootElement(doc);
    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
    {
        if (cur_node->type == XML_ELEMENT_NODE)
        {
            if ((!xmlStrcmp(cur_node->name, BAD_CAST "search")))
            {
                key = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                if (key == NULL)
                {
                    buffer_append_string(b, "searchurl=\r\n");
                }
                else
                {
                    snprintf(res, sizeof(res), "searchurl=%s\r\n", (char *) key);
                    buffer_append_string(b, res);
                    xmlFree(key);
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "status")))
            {
                key = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                if (key == NULL)
                {
                    buffer_append_string(b, "statusurl=\r\n");
                }
                else
                {
                    snprintf(res, sizeof(res), "statusurl=%s\r\n", (char *) key);
                    buffer_append_string(b, res);
                    xmlFree(key);
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "photo")))
            {
                key = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                if (key == NULL)
                {
                    buffer_append_string(b, "photourl=\r\n");
                }
                else
                {
                    snprintf(res, sizeof(res), "photourl=%s\r\n", (char *) key);
                    buffer_append_string(b, res);
                    xmlFree(key);
                }
            }
        }
    }

    //free the document
    xmlFreeDoc(doc);
    return 1;
}

static int handle_puthwservers (buffer *b, const struct message *m)
{
    xmlDocPtr doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    const char *temp = NULL;
    char *val = NULL;

    doc = xmlReadFile(CONF_HWPHBK, NULL, 0);

    if (doc == NULL)
    {
        printf("error: could not parse file %s\n", CONF_HWPHBK);
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Configuration File Not Found\r\n");
        return -1;
    }

    //Get the root element node
    root_element = xmlDocGetRootElement(doc);
    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
    {
        if (cur_node->type == XML_ELEMENT_NODE)
        {
            if ((!xmlStrcmp(cur_node->name, BAD_CAST "search")))
            {
                temp = msg_get_header(m, "searchurl");
                if ( temp != NULL )
                {
                    val = strdup( (char*)temp );
                    uri_decode(val);
                    xmlNodeSetEncodeContent(doc, cur_node, (xmlChar *)val);
                    free(val);
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "status")))
            {
                temp = msg_get_header(m, "statusurl");
                if ( temp != NULL )
                {
                    val = strdup( (char*)temp );
                    uri_decode(val);
                    xmlNodeSetEncodeContent(doc, cur_node, (xmlChar *)val);
                    free(val);
                }
            }else if ((!xmlStrcmp(cur_node->name, BAD_CAST "photo")))
            {
                temp = msg_get_header(m, "photourl");
                if ( temp != NULL )
                {
                    val = strdup( (char*)temp );
                    uri_decode(val);
                    xmlNodeSetEncodeContent(doc, cur_node, (xmlChar *)val);
                    free(val);
                }
            }
        }
    }

    xmlSaveFormatFileEnc(CONF_HWPHBK, doc, "UTF-8", 1);
    xmlFreeDoc(doc);
    xmlCleanupParser();
    xmlMemoryDump();
    sync();

    buffer_append_string (b, "Response=Success\r\n");

    return 1;
}
*/
static int handle_androidverion(buffer *b)
{
    system("getprop ro.build.version.release > /tmp/androidver");
    FILE *fp = fopen("/tmp/androidver", "r");
    char androidver[8] = "";
    char country[3] = "";
    if (fp == NULL)
    {
        buffer_append_string (b, "Response=Success\r\nandroidver=\r\n");
        return -1;
    }

    fgets( &androidver, sizeof(androidver), fp );
    fclose(fp);
    buffer_append_string (b, "Response=Success\r\nandroidver=");
    buffer_append_string (b, androidver);
    buffer_append_string (b, "\r\n");

    return 1;
}

static int check_provision_pid()
{
    system("chmod +x /bin/pidof");
    char *cmdstr = NULL;
    cmdstr = malloc(40);
    sprintf(cmdstr, "pidof lighttpd > /tmp/tmppid &");
    printf("cmdstr is %s\n", cmdstr);
    int result = system(cmdstr);
    sleep(1);
    free(cmdstr);
    if(result == 0)
    {
        FILE *cur_pidfile;
        cur_pidfile = fopen ("/tmp/tmppid", "r");

        if (cur_pidfile != NULL) {
            char buf[32] = "";
            fread (buf, 32, 1, cur_pidfile);
            fclose (cur_pidfile);
            int pid = atoi(buf);
            if( pid != 0 )
            {
            	FILE *pid_file;
        		pid_file = fopen ("/tmp/PROVISION.PID", "r");
        		if (pid_file != NULL)
        		{
        			char buf2[32] = "";
			        fread (buf2, 32, 1, pid_file);
			        fclose (pid_file);
			        int pid2 = atoi(buf2);
                    if( pid == pid2 )
			        {
                        system("echo ' ' > /tmp/PROVISION.PID");
						return 1;
                    }
        		}
            }
        }
    }
    return 0;
}

static int handle_initupstatus(buffer *b)
{
    if( m_uploading )
    {
        check_provision_pid();
        m_uploading = 0;
    }
    buffer_append_string (b, "Response=Success\r\n");
}

static int handle_provisioninit(buffer *b, const struct message *m)
{
    if( m_uploading )
    {
        buffer_append_string (b, "0");
        return 0;
    }
    if( !access(FULL_UPGRADE_PATH, 0) )
    {
        printf("handle_provisioninit,upgrade all file EXIST,delete first\n");
        system("echo \" \" > /cache/fwupgradeall");
        unlink(FULL_UPGRADE_PATH);
    }
    if( !access(TMP_FULL_UPGRADE_PATH, 0) )
    {
        unlink(TMP_FULL_UPGRADE_PATH);
    }
    char *temp = NULL;
    temp = msg_get_header( m, "upgradeall" );
    if( temp != NULL ){
        m_upgradeall = atoi(temp);
        /*nvram_set("upgradeall", temp);
#ifdef BUILD_ON_ARM
        nvram_commit();
#endif*/
    }else{
        m_upgradeall = 0;
    }
    int result = 0;
    if( m_upgradeall == 0 ){
        provision_ret = provision_init(&provision_local_fd, &provision_destaddr);
        if(provision_ret)
        {
            check_provision_pid();
            buffer_append_string (b, "0");
            return 0;
        }

        m_uploading = 1;
        result = inform_gparse_update(provision_local_fd, &provision_destaddr);
        printf("inform_gparse_update result is %d\n", result);
    }
    if( result )
        buffer_append_string (b, "0");
    else
        buffer_append_string (b, "1");
    return 1;
}

static int handle_upgradenow (buffer *b)
{
    //unsigned int size;

    /* write fireware to /tmp/gparse.fifo */
    //size = file_manager_file_copy(FW_PATH, FIFO_PATH);
    //size = write2fifo(FIFO_PATH, FW_PATH);
    //printf("%u write to fifo\n", size >> 20);
    printf("m_upgradeall is %d\n", m_upgradeall);
    if( m_upgradeall == 1 ){
        int result = system("mv /tmp/fwupgradeall /cache/fwupgradeall");
        printf("rename result = %d\n", result);
        if( result != 0 ){
            buffer_append_string (b, "Response=Error\r\nresult=1\r\n");
            unlink(TMP_FULL_UPGRADE_PATH);
        }else{
            result = upgrade_all_fw(); //system("/system/bin/upgradeall &");
            if( result == 0 )
                buffer_append_string (b, "Response=Success\r\n");
            else{
                if( result == 2 )
                    buffer_append_string (b, "Response=Error\r\nresult=2\r\n");
                else
                    buffer_append_string (b, "Response=Error\r\nresult=1\r\n");
                if( !access(FULL_UPGRADE_PATH, 0) )
                {
                    printf("upgrade all file EXIST\n");
                    //system("echo \" \" > /cache/fwupgradeall");
                    unlink(FULL_UPGRADE_PATH);
                }
            }
        }
    }else{
        inform_gparse_end(provision_local_fd, &provision_destaddr);
        if( access(FIFO_PATH, 0) ) {
            buffer_append_string (b, "Response=Success\r\nresult=2\r\n");
            check_provision_pid();
            m_uploading = 0;
            return -1;
        }
        provision_ret = wait_for_gparse_result(provision_local_fd, &provision_destaddr);
        char res[32] = "";
        snprintf(res, sizeof(res), "Response=Success\r\nresult=%d\r\n", provision_ret);
        buffer_append_string (b, res);
        check_provision_pid();
    }
    m_uploading = 0;
    return 0;
}


static int handle_getcountry (buffer *b)
{
    xmlChar *key = NULL;
    xmlDoc *doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    xmlNode *cur_sub_node = NULL;
    char res[64] = "";

    doc = xmlReadFile(CONF_AUTOCONFIG, NULL, 0);

    if (doc == NULL)
    {
        printf("error: could not parse file %s\n", CONF_AUTOCONFIG);
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Configuration File Not Found\r\n");
        return -1;
    }

    buffer_append_string (b, "Response=Success\r\n");

    /*Get the root element node */
    root_element = xmlDocGetRootElement(doc);

    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
    {
        if (cur_node->type == XML_ELEMENT_NODE)
        {
            if ((!xmlStrcmp(cur_node->name, BAD_CAST "config")))
            {
                for (cur_sub_node = cur_node->xmlChildrenNode; cur_sub_node; cur_sub_node = cur_sub_node->next)
                {
                    if (cur_sub_node->type == XML_ELEMENT_NODE)
                    {
                        if ((!xmlStrcmp(cur_sub_node->name, BAD_CAST "country")))
                        {
                            key = xmlNodeListGetString(doc, cur_sub_node->xmlChildrenNode, 1);
                            if (key == NULL)
                            {
                                buffer_append_string(b, "country=\r\n");
                            }
                            else
                            {
                                snprintf(res, sizeof(res), "country=%s\r\n", (char *) key);
                                buffer_append_string(b, res);
                                xmlFree(key);
                            }
                        }
                    }
                }
            }
        }
    }

    /*free the document */
    xmlFreeDoc(doc);
    return 1;
}

static int handle_savephbk(buffer *b, const struct message *m)
{
    const char *resType = NULL;
    const char * jsonCallback = NULL;
    char *temp = NULL;
    // remove by jlxu, the follow four code
/*
    if( access( TMP_PHONEBOOKPATH, 0 ) )
    {
        mkdir(TMP_PHONEBOOKPATH, 0755);
    }
    dbus_send_lighttpd( SIGNAL_LIGHTTPD_PHBKUPLOAD);*/
    /*const char *temp = NULL;
    temp = msg_get_header(m, "mode");
    if(strcmp(temp,"1") == 0 || strcmp(temp,"2") == 0)
        dbus_send_lighttpd( SIGNAL_LIGHTTPD_PHBKUPLOAD);
    else{
        if (file_manager_file_copy(DATA_PHONEBOOK,TMP_GS_PHONEBOOK) == -2){
            buffer_append_string (b, "Response=Error\r\nMessage=can't find the phonebook!\r\n");
            return -1;
        }
        else if (file_manager_file_copy(DATA_PHONEBOOK,TMP_GS_PHONEBOOK) == -3){
            buffer_append_string (b, "Response=Error\r\nMessage=can't create the phonebook!\r\n");
            return -1;
        }
        else if (file_manager_file_copy(DATA_PHONEBOOK,TMP_GS_PHONEBOOK) == -1){
            buffer_append_string (b, "Response=Error\r\nMessage=Copy failed!\r\n");
            return -1;
        }
        else {
            buffer_append_string (b, "Response=Sucess\r\n");
        }
    }*/
    resType = msg_get_header(m, "format");

    if((resType != NULL) && !strcasecmp(resType, "json"))
    {
        jsonCallback = msg_get_header( m, "jsoncallback" );
    }

    if(jsonCallback != NULL)
    {
        temp = malloc((strlen(jsonCallback) + 32) * sizeof(char));

        if(temp != NULL)
        {
            sprintf(temp, "%s(%s)", jsonCallback, "{\"res\" : \"success\"}");
            buffer_append_string (b, temp);
            free(temp);
        }
    }
    else
    {
        buffer_append_string (b, "Response=Sucess\r\n");
    }

    return 1;
}

static int handle_getparams (buffer *b,const char*fileconf)
{
    xmlDocPtr doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *son2_node = NULL;
    //xmlNodePtr son2_node = NULL;
    xmlChar *key = NULL;
    xmlChar *nameattr = NULL;
    char res[128] = "";

    doc = xmlReadFile(fileconf, NULL, 0);

    if (doc == NULL)
    {
        printf("error: could not parse file %s\n", fileconf);
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Configuration File Not Found\r\n");
        return -1;
    }

    buffer_append_string (b, "Response=Success\r\n");
    /*Get the root element node */
    root_element = xmlDocGetRootElement(doc);

    for (son2_node = root_element->xmlChildrenNode; son2_node; son2_node = son2_node->next)
    {
        //if (cur_node->type == XML_ELEMENT_NODE)
        {
            if ((!xmlStrcmp(son2_node->name, (const xmlChar *)"string")))
            {
                //son2_node = cur_node ->xmlChildrenNode;
                nameattr = xmlGetProp(son2_node, BAD_CAST "name");

                printf("xml parse node is %s\n", son2_node->name);
                if (nameattr != NULL)
                {
                    if (!xmlStrcmp(nameattr, (const xmlChar *)"import_file_type"))
                    {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "port-type=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "port-type=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                    }
                    else if (!xmlStrcmp(nameattr, (const xmlChar *)"import_replace_duplicate"))
                    {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "port-replace=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "port-replace=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                    }
                    else if (!xmlStrcmp(nameattr, (const xmlChar *)"import_clear_old"))
                    {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "port-clear=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "port-clear=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                    }
                    else if (!xmlStrcmp(nameattr, (const xmlChar *)"import_encoding"))
                    {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "port-encode=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "port-encode=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                    }
                    else if (!xmlStrcmp(nameattr, (const xmlChar *)"export_file_type"))
                    {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "export-type=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "export-type=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                    }
                    else if (!xmlStrcmp(nameattr, (const xmlChar *)"export_encoding"))
                    {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "export-encode=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "export-encode=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                    }
                    xmlFree(nameattr);
                    //son2_node = son2_node->next;
                }
            }
            /*else if ((!xmlStrcmp(cur_node->name, (const xmlChar *)"Download")))
            {
                son2_node = cur_node ->xmlChildrenNode;

                while (son2_node != NULL)
                {
                    if (!xmlStrcmp(son2_node->name, (const xmlChar *)"downloadMode"))
                    {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "down-mode=\r\n");
                        }

                        else
                        {
                            snprintf(res, sizeof(res), "down-mode=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                    }

                    else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"url"))
                    {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "down-url=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "down-url=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                    }

                    else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"fileType"))
                    {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "down-type=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "down-type=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                      }
                    else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"replaceDup"))
                    {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "down-replace=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "down-replace=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                      }

                      else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"clearOld"))
                      {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "down-clear=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "down-clear=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                    }

                      else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"interval"))
                      {
                        key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                        if (key == NULL)
                        {
                            buffer_append_string(b, "down-interval=\r\n");
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "down-interval=%s\r\n", (char *) key);
                            buffer_append_string(b, res);
                            xmlFree(key);
                        }
                    }
                      else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"encoding"))
                        {
                            key = xmlNodeListGetString(doc, son2_node->xmlChildrenNode, 1);
                            if (key == NULL)
                            {
                                buffer_append_string(b, "down-encode=\r\n");
                            }
                            else
                            {
                                snprintf(res, sizeof(res), "down-encode=%s\r\n", (char *) key);
                                buffer_append_string(b, res);
                                xmlFree(key);
                            }
                        }

                    son2_node = son2_node->next;

                }
            }
            */
        }
    }

    xmlFreeDoc(doc);
    return 1;
}

static int handle_putportphbk (buffer *b, const struct message *m) {
    char *path = NULL;
    const char *flag = NULL;
    const char *opmode = NULL;
    const char *portType = NULL;
    const char *portReplace = NULL;
    const char *portClear = NULL;
    const char *portEncode = NULL;
    const char *resType = NULL;
    const char *jsonCallback = NULL;
    const char *status = NULL;
    char *json = NULL;
    char *result = NULL;
    char *temp = NULL;
    int len = 0;
    int reply_timeout = 10000;
    DBusMessage *message = NULL;
    DBusMessage *reply = NULL;
    DBusBusType type;
    DBusError error;
    DBusConnection *conn = NULL;
    DBusMessageIter iter;

    resType = msg_get_header(m, "format");
    if (resType != NULL && !strcasecmp(resType, "json")) {
        jsonCallback = msg_get_header(m, "jsoncallback");
    }

    flag = msg_get_header(m, "flag");
    if (flag == NULL) {
        if (jsonCallback != NULL) {
            result = malloc((strlen(jsonCallback) + 64) * sizeof(char));
            if (result != NULL) {
                sprintf(result, "%s({\"res\": \"error\", \"flag\": \"null\"})", jsonCallback);
                buffer_append_string(b, result);
                free(result);
            }
        } else {
            buffer_append_string(b, "{\"res\": \"error\", \"flag\": \"null\"}");
        }
    }

    status = nvram_get("phonebook_status");
    if (status != NULL && !strcasecmp(status, "1")) {
        if (jsonCallback != NULL) {
            result = malloc((strlen(jsonCallback) + 64) * sizeof(char));
            if (result != NULL) {
                sprintf(result, "%s({\"res\": \"success\", \"portphbkresponse\": \"1\"})", jsonCallback);
                buffer_append_string(b, result);
                free(result);
            }
        } else {
            buffer_append_string(b, "{\"res\": \"success\", \"portphbkresponse\": \"1\"}");
        }

        return 0;
    }

    opmode = msg_get_header(m, "opmode");
    if (opmode == NULL) {
        opmode = "";
    }
    portEncode = msg_get_header(m, "portEncode");
    if (portEncode == NULL) {
        portEncode = "";
    }
    portType = msg_get_header(m, "portType");
    if (portType == NULL) {
        portType = "";
    }
    portReplace = msg_get_header(m, "portReplace");
    if (portReplace == NULL) {
        portReplace = "";
    }
    portClear = msg_get_header(m, "portClear");
    if (portClear == NULL) {
        portClear = "";
    }

    if( access( TMP_PHONEBOOKPATH, 0 ) )
    {
        mkdir(TMP_PHONEBOOKPATH, 0777);
    }

    path = malloc(strlen(TMP_PHONEBOOKPATH) + strlen("/phonebook.xml") + 4);
    sprintf(path, "%s/%s", TMP_PHONEBOOKPATH, "phonebook.xml");

    if ( 0 == access(path, 0) ) {
        chmod(path, 0777);
    }

    if (!strcasecmp(flag, "0")) {
        message = dbus_message_new_method_call(dbus_dest, dbus_path, dbus_interface, "exportPhonebook");
        printf("handle_exportPhonebook");

    } else {
        message = dbus_message_new_method_call(dbus_dest, dbus_path, dbus_interface, "importPhonebook");
        printf("handle_importPhonebook");
    }

    type = DBUS_BUS_SYSTEM;
    dbus_error_init(&error);
    conn = dbus_bus_get(type, &error);
    if (conn == NULL) {
        printf("Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free(&error);
        if (message != NULL) {
            dbus_message_unref(message);
        }
        free(path);

        return -1;
    }

    if (message != NULL) {
        dbus_message_set_auto_start(message, TRUE);
        dbus_message_iter_init_append(message, &iter);

        len = 8;
        if (opmode != NULL) {
            len += strlen(opmode) + strlen(", \"mode\": \"\"");
        }
        if (portEncode != NULL) {
            len += strlen(portEncode) + strlen(", \"encode\": \"\"");
        }
        if (portType != NULL) {
            len += strlen(portType) + strlen(", \"type\": \"\"");
        }
        if (portReplace != NULL) {
            len += strlen(portReplace) + strlen(", \"replace\": \"\"");
        }
        if (portClear != NULL) {
            len += strlen(portClear) + strlen(", \"clear\": \"\"");
        }
        len += strlen(path) + strlen(", \"path\": \"\"");

        json = malloc(len * sizeof(char));
        if (json != NULL) {
            snprintf(json, len-1, 
                     "{\"path\": \"%s\", \"mode\": \"%s\", \"encode\": \"%s\", \"type\": \"%s\", \"replace\": \"%s\", \"clear\": \"%s\"}",
                     path, opmode, portEncode, portType, portReplace, portClear);

            if (!dbus_message_iter_append_basic(&iter, DBUS_TYPE_STRING, &json)) {
                printf("Out of Memory!\n");
                free(path);
                free(json);
                exit(1);
            }

            nvram_set("phonebook_status", "99");

            reply = dbus_connection_send_with_reply_and_block(conn, message, reply_timeout, &error);
            if (dbus_error_is_set(&error)) {
                fprintf(stderr, "Error %s: %s\n", error.name, error.message);
            }

            free(json);

            if (reply) {
                print_message(reply);
                int current_type;
                dbus_message_iter_init(reply, &iter);
                
                while((current_type = dbus_message_iter_get_arg_type(&iter)) != DBUS_TYPE_INVALID) {
                    switch(current_type) {
                        case DBUS_TYPE_STRING:
                            dbus_message_iter_get_basic(&iter, &result);
                            break;
                        default:
                            break;
                    }

                    dbus_message_iter_next(&iter);
                }

                if (result != NULL) {
                    if (jsonCallback != NULL) {
                        temp = malloc((strlen(jsonCallback) + strlen(result) + 8) * sizeof(char));
                        if (temp != NULL) {
                            sprintf(temp, "%s(%s)", jsonCallback, result);
                            buffer_append_string(b, temp);
                            free(temp);
                        }
                    } else {
                        buffer_append_string(b, "Response=Success\r\n");
                        buffer_append_string(b, result);
                    }
                }

                dbus_message_unref(reply);
            }
        }

        dbus_message_unref(message);
    }

    free(path);

    return 0;
}

static int handle_putdownphbk (buffer *b, const struct message *m) {
    char res[128];
    const char *flag = NULL;
    const char *opmode = NULL;
    const char *serverUrl = NULL;
    const char *interval = NULL;
    const char *downReplace = NULL;
    const char *downClear = NULL;
    const char *downEncode = NULL;
    const char *resType = NULL;
    const char *jsonCallback = NULL;
    const char *status = NULL;
    char *json = NULL;
    char *result = NULL;
    char *temp = NULL;
    int len = 0;
    int reply_timeout = 10000;
    DBusMessage *message = NULL;
    DBusMessage *reply = NULL;
    DBusBusType type;
    DBusError error;
    DBusConnection *conn = NULL;
    DBusMessageIter iter;

    status = nvram_get("phonebook_status");
    if (status != NULL && !strcasecmp(status, "1")) {
        if (jsonCallback != NULL) {
            result = malloc((strlen(jsonCallback) + 64) * sizeof(char));
            if (result != NULL) {
                sprintf(result, "%s({\"res\": \"success\", \"phbkresponse\": \"1\"})", jsonCallback);
                buffer_append_string(b, result);
                free(result);
            }
        } else {
            buffer_append_string(b, "{\"res\": \"success\", \"phbkresponse\": \"1\"}");
        }

        return 0;
    }

    resType = msg_get_header(m, "format");
    if (resType != NULL && !strcasecmp(resType, "json")) {
        jsonCallback = msg_get_header(m, "jsoncallback");
    }

    flag = msg_get_header(m, "flag");
    if (flag == NULL) {
        flag = "1";
    }

    opmode = msg_get_header(m, "downMode");
    if (opmode == NULL) {
        opmode = "";
    }
    serverUrl = msg_get_header(m, "downUrl");
    uri_decode((char*)serverUrl);
    if (serverUrl == NULL) {
        serverUrl = "";
    }
    interval = msg_get_header(m, "downInterval");
    if (interval == NULL) {
        interval = "";
    }
    downReplace = msg_get_header(m, "downReplace");
    if (downReplace == NULL) {
        downReplace = "";
    }
    downClear = msg_get_header(m, "downClear");
    if (downClear == NULL) {
        downClear = "";
    }
    downEncode = msg_get_header(m, "downEncode");
    if (downEncode == NULL) {
        downEncode = "";
    }

    message = dbus_message_new_method_call(dbus_dest, dbus_path, dbus_interface, "downloadPhonebook");

    type = DBUS_BUS_SYSTEM;
    dbus_error_init(&error);
    conn = dbus_bus_get(type, &error);
    if (conn == NULL) {
        printf("Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free(&error);
        if (message != NULL) {
            dbus_message_unref(message);
        }

        return -1;
    }

    if (message != NULL) {
        dbus_message_set_auto_start(message, TRUE);
        dbus_message_iter_init_append(message, &iter);

        len = 8;
        if (opmode != NULL) {
            len += strlen(opmode) + strlen(", \"mode\": \"\"");
        }
        if (serverUrl != NULL) {
            len += strlen(serverUrl) + strlen(", \"url\": \"\"");
        }
        if (interval != NULL) {
            len += strlen(interval) + strlen(", \"interval\": \"\"");
        }
        if (downReplace != NULL) {
            len += strlen(downReplace) + strlen(", \"replace\": \"\"");
        }
        if (downClear != NULL) {
            len += strlen(downClear) + strlen(", \"clear\": \"\"");
        }
        if (downEncode != NULL) {
            len += strlen(downEncode) + strlen(", \"encode\": \"\"");
        }
        len += strlen(flag) + strlen(", \"flag\": \"\"");

        json = malloc(len * sizeof(char));
        if (json != NULL) {
            snprintf(json, len-1, 
                     "{\"flag\": \"%s\", \"mode\": \"%s\", \"url\": \"%s\", \"interval\": \"%s\", \"replace\": \"%s\", \"clear\": \"%s\", \"encode\": \"%s\"}",
                     flag, opmode, serverUrl, interval, downReplace, downClear, downEncode);

            if (!dbus_message_iter_append_basic(&iter, DBUS_TYPE_STRING, &json)) {
                printf("Out of Memory!\n");
                free(json);
                exit(1);
            }

            nvram_set("phonebook_status", "99");

            reply = dbus_connection_send_with_reply_and_block(conn, message, reply_timeout, &error);
            if (dbus_error_is_set(&error)) {
                fprintf(stderr, "Error %s: %s\n", error.name, error.message);
            }

            free(json);

            if (reply) {
                print_message(reply);
                int current_type;
                dbus_message_iter_init(reply, &iter);
                
                while((current_type = dbus_message_iter_get_arg_type(&iter)) != DBUS_TYPE_INVALID) {
                    switch(current_type) {
                        case DBUS_TYPE_STRING:
                            dbus_message_iter_get_basic(&iter, &result);
                            break;
                        default:
                            break;
                    }

                    dbus_message_iter_next(&iter);
                }

                if (result != NULL) {
                    if (jsonCallback != NULL) {
                        temp = malloc((strlen(jsonCallback) + strlen(result) + 8) * sizeof(char));
                        if (temp != NULL) {
                            sprintf(temp, "%s(%s)", jsonCallback, result);
                            buffer_append_string(b, temp);
                            free(temp);
                        }
                    } else {
                        if ((resType != NULL) && !strcasecmp(resType, "json"))
                        {
                            buffer_append_string(b, result);
                        }
                        else
                        {
                            snprintf(res, sizeof(res), "flag=%s\r\n", flag);
                            buffer_append_string(b, res);
                        }
                    }
                }

                dbus_message_unref(reply);
            }
        }

        dbus_message_unref(message);
    }

    return 0;
}

static int handle_portphbkresponse (buffer *b, const struct message *m) {
    const char* resType = NULL;
    const char* jsonCallback = NULL;
    char* status = NULL;
    char* result = NULL;

    resType = msg_get_header(m, "format");
    if (resType != NULL && !strcasecmp(resType, "json")) {
        jsonCallback = msg_get_header(m, "jsoncallback");
    }

    status = nvram_get("phonebook_status");
    if (status != NULL) {
        if (!strcasecmp(status, "1")) {
            status = "1";
        } else if (!strcasecmp(status, "99")) {
            status = "1";
        } else if (!strcasecmp(status, "4")) {
            status = "4";
        } else if (!strcasecmp(status, "0")) {
            status = "0";
        }

        if (jsonCallback != NULL) {
            result = malloc((strlen(jsonCallback) + 64) * sizeof(char));
            if (result != NULL) {
                sprintf(result, "%s({\"res\": \"success\", \"portphbkresponse\": \"%s\"})", jsonCallback, status);
                buffer_append_string(b, result);
                free(result);
            }
        } else {
            result = malloc(64 * sizeof(char));
            if (result != NULL) {
                buffer_append_string (b, "Response=Success\r\n");
                sprintf(result, "portphbkresponse=%s\r\n", status);
               // sprintf(result, "{\"res\": \"success\", \"portphbkresponse\": \"%s\"}", status);
                buffer_append_string(b, result);
                free(result);
            }
        }
    }

    return 0;
}

static int handle_phbkresponse (buffer *b, const struct message *m) {
    const char* resType = NULL;
    const char* jsonCallback = NULL;
    char* status = NULL;
    char* result = NULL;

    resType = msg_get_header(m, "format");
    if (resType != NULL && !strcasecmp(resType, "json")) {
        jsonCallback = msg_get_header(m, "jsoncallback");
    }

    status = nvram_get("phonebook_status");
    if (status != NULL) {
        if (!strcasecmp(status, "1")) {
            status = "1";
        } else if (!strcasecmp(status, "99")) {
            status = "9";
        } else if (!strcasecmp(status, "4")) {
            status = "4";
        } else if (!strcasecmp(status, "0")) {
            status = "0";
        }

        if (jsonCallback != NULL) {
            result = malloc((strlen(jsonCallback) + 64) * sizeof(char));
            if (result != NULL) {
                sprintf(result, "%s({\"res\": \"success\", \"phbkresponse\": \"%s\"})", jsonCallback, status);
                buffer_append_string(b, result);
                free(result);
            }
        } else {
            result = malloc(64 * sizeof(char));
            if (result != NULL) {
                buffer_append_string (b, "Response=Success\r\n");
                sprintf(result, "phbkresponse=%s\r\n", status);
               // sprintf(result, "{\"res\": \"success\", \"phbkresponse\": \"%s\"}", status);
                buffer_append_string(b, result);
                free(result);
            }
        }
    }

    return 0;
}


/*static int handle_lanrsps(buffer *b)
{
    char res[32] = "";

    buffer_append_string (b, "Response=Success\r\n");
    
    snprintf(res, sizeof(res), "lanrsps=%d\r\n", lan_reload_flag);
    buffer_append_string(b, res);
    
    return 0;
}
*/

static int handle_setsyslogd(buffer *b)
{
    system("setprop ctl.start syslogd");
    buffer_append_string(b, "Response=Success\r\n");
    return 1;
}

static int handle_set_property(buffer *b, const struct message *m)
{
    char *cmd = NULL;
    const char *cmdtype = NULL;
    cmdtype = msg_get_header(m, "type");
    int result = -1;

    if( cmdtype != NULL )
    {
        int type = atoi(cmdtype);
        const char *value = NULL;
        value = msg_get_header(m, "value");
        uri_decode((char*)value);
        int len = 64+strlen(value);
        cmd = malloc(len);
        memset(cmd, 0, len);
        if( type == 0 ){
            snprintf(cmd, len, "setprop persist.dhcp.hostname \"%s\"", value);
        }else if( type == 1 ){
            snprintf(cmd, len, "setprop persist.dhcp.vendorclassid \"%s\"", value);
        }else if( type == 2 ){
            snprintf(cmd, len, "setprop persist.dhcp.vendorspec \"%s\"", value);
        }else if( type == 3 ){
            snprintf(cmd, len, "setprop dhcp.eth0.tftpserver \"%s\"", value);
        }
        result = mysystem(cmd);
        free(cmd);
    }

    if( result == 0 )
        buffer_append_string(b, "Response=Success\r\n");
    else
        buffer_append_string(b, "Response=Error\r\n");
    return 1;
}

static int handle_clearlogcat (buffer *b)
{
    int result = system("logcat -c");
    if(result == 0)
    {
        buffer_append_string (b, "Response=Success\r\n");
    }else
        buffer_append_string (b, "Response=Error\r\n");
    return 1;
}

static int handle_getlogcat (buffer *b, const struct message *m)
{
    const char *tag = NULL;
    const char *priority = NULL;
    char cmd[128] = "";

    tag = msg_get_header(m, "tag");
    uri_decode((char*)tag);
    if( tag == NULL || strcasecmp(tag, "") == 0 )
        tag = "*";
    priority = msg_get_header(m, "priority");
    if( priority == NULL )
        priority = "*";

    if( access("/tmp/logcat/", 0) ) {
        mkdir("/tmp/logcat/", 0777);
    }
    snprintf(cmd, sizeof(cmd), "logcat -ds %s:%s > /tmp/logcat/logcat.txt &", tag, priority);
    printf("cmd is %s\n",cmd);
    int result = mysystem(cmd);
    if(result == 0)
    {
        buffer_append_string (b, "Response=Success\r\n");
    }else
        buffer_append_string (b, "Response=Error\r\n");
    return 1;
}

static int handle_getlanguages (buffer *b)
{
    system("getprop persist.sys.language > /tmp/language");
    system("getprop persist.sys.country > /tmp/country");
    FILE *fp = fopen("/tmp/language", "r");
    FILE *fp2 = fopen("/tmp/country", "r");
    char lan[3] = "";
    char country[3] = "";
    if (fp == NULL || fp2 == NULL)
    {
        buffer_append_string (b, "Response=Success\r\nlanguage=en_US\r\n");
        return -1;
    }

    fgets( &lan, sizeof(lan), fp );
    fclose(fp);
    fgets( &country, sizeof(country), fp2 );
    fclose(fp2);
    buffer_append_string (b, "Response=Success\r\nlanguage=");
    buffer_append_string (b, lan);
    buffer_append_string (b, "_");
    buffer_append_string (b, country);
    buffer_append_string (b, "\r\n");

    return 1;
}

static int handle_putlanguage (buffer *b, const struct message *m)
{
    const char *lan = NULL;
    const char *country = NULL;
    char cmd[128] = "";

    lan = msg_get_header(m, "lan");
    country = msg_get_header(m, "country");
    snprintf(cmd, sizeof(cmd), "am broadcast -a com.android.settings.LanguageUpdate -e \"language\" \"%s\" -e \"country\" \"%s\"", lan, country);
    mysystem(cmd);
    printf("cmd is %s\n", cmd);
    buffer_append_string (b, "Response=Success\r\n");
    return 0;
}

static int handle_importlanguage(buffer *b)
{
    importlanrsps = -1;
    system("chmod 644 /data/import_language");
    dbus_send_string(SIGNAL_IMPORT_CUSLANG);
    buffer_append_string (b, "Response=Success\r\n");
    return 0;
}

static int handle_getimportlanresps (buffer *b)
{
    char res[32] = "";

    buffer_append_string (b, "Response=Success\r\n");

    snprintf(res, sizeof(res), "importlanrsps=%d\r\n", importlanrsps);
    buffer_append_string(b, res);

    return 0;
}

static int handle_importconfig(buffer *b)
{
    /*Dos2Unix pre-processing        --@xhhuang*/
    int result = system("/system/xbin/tr -d \"\r\" <  /data/import_config.txt > /data/import_config_new.txt");
    if( result != 0 ) {
        buffer_append_string (b, "Response=Error\r\n");
        return -1;
    } else {
        result = system("nvload false /data/import_config_new.txt");
        if( result != 0 ) {
            buffer_append_string (b, "Response=Error\r\n");
            return -1;
        } else {
            dbus_send_cfupdated();
            dbus_send_applyed();
            buffer_append_string (b, "Response=Success\r\n");
        }
    }

    return 1;
}

static int handle_saveconf(buffer *b)
{
    int result = system("nvram show > /tmp/configold.txt");
    if( result != 0 )
    {
        buffer_append_string (b, "Response=Error\r\n");
        return -1;
    }

    FILE *file_fd = NULL;
    file_fd = fopen("/tmp/config", "w+");
    if( file_fd == NULL )
    {
        buffer_append_string (b, "Response=Error\r\n");
        return -1;
    }

    FILE *fp = fopen( "/tmp/configold.txt" , "r");
    char * line = NULL;
    char *var = NULL;
    int tpvalue;
    char *pvaluestr = NULL;
    int plen = 0;
    char *strToWrite = NULL;
    int sizeOfStrToWrite = 256;
    line = malloc(sizeOfStrToWrite);
    memset(line, 0, sizeOfStrToWrite);

    while ((  fp != NULL) && !feof( fp ) )
    {
        fgets( line, sizeOfStrToWrite, fp );
        strToWrite = malloc( sizeOfStrToWrite );
        memset(strToWrite, 0, sizeOfStrToWrite);
        snprintf(strToWrite, sizeOfStrToWrite, "P%s", line);
        var = strtok( line, "=");
        if ( var != NULL )
        {
            tpvalue = atoi(var);
            if( tpvalue == 0 )
                continue;
            plen = strlen(var) + 4;
            pvaluestr = malloc(plen);
            memset(pvaluestr, 0, plen);
            snprintf(pvaluestr, plen, "%d", tpvalue);
            if( strlen(var) != strlen(pvaluestr) )
            {
                free(pvaluestr);
                continue;
            }else
                free(pvaluestr);
            switch(tpvalue)
            {
                case 34:        /*acct1-6 sip account passwords*/
                case 406:
                case 506:
                case 606:
                case 1706:
                case 1806:
                case 2:         /*admin password*/
                case 196:       /*user password*/
                case 1361:      /*http password*/
                case 1359:      /*xml password*/
                case 7903:      /*802.1x MD5 password*/
                case 7830:      /*wifi essid password*/
                case 22022:     /*wifi MD5 password*/
                case 83:        /*PPPoE password*/
                case 4505:      /*ACS password*/
                case 4512:      /*ACS connect password*/
                case 8024:      /*LDAP password*/
                case 279:       /*SIP TLS Certificate*/
                case 280:       /*SIP TLS Private Key*/
                case 281:       /*SIP TLS private key password*/
                case 1383:      /*Lock/Unlock password*/
                case 2352:      /*acct1-6 Auto User Presence password*/
                case 2452:
                case 2552:
                case 2652:
                case 2752:
                case 2852:
                case 9998:
                case 45:        /*version pvalues start*/
                case 68:
                case 7033:
                case 69:
                case 70:
                case 7030:
                case 7031:
                case 7032:
                case 7034:        /*version pvalues end*/
                case 2386:        /*acct1-6 domain certificate*/
                case 2486:
                case 2586:
                case 2686:
                case 2786:
                case 2886:
                case 1594:        /*Broadsoft Xsi Password(P1594)*/
                case 2967:        /*Broadsoft IM&P Password(P2967)*/
                case 6714:        /*Phonebook HTTP/HTTPS password(P6714)*/
                    break;
                default:
                    fwrite(strToWrite, strlen(strToWrite), 1, file_fd);
                    break;
            }
        }
        free(strToWrite);
        memset(line, 0, sizeof(line));
    }

    buffer_append_string (b, "Response=Success\r\n");
    free(line);
    fclose( fp );
    fclose( file_fd );
    unlink("/tmp/configold.txt");
    return 1;
}

static int handle_cfupdated (buffer *b)
{
    buffer_append_string (b, "Response=Success\r\n");
    dbus_send_cfupdated();
    return 1;
}

static int handle_vbupdated (buffer *b, const struct message *m)
{
    const char *temp = NULL;
    temp = msg_get_header(m, "account");
    if (temp == NULL)
    {
        buffer_append_string (b, "Response=ERROR\r\nMessage=Missed Parameter\r\n");
    }else
    {
        buffer_append_string (b, "Response=Success\r\n");
        int account = atoi(temp);
#ifdef BUILD_ON_ARM
        DBusMessage* message;

        if ( bus == NULL )
        {
            printf( "Error: Dbus bus is NULL\n" );
            return 1;
        }

        message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_VBRATEUPDATED);
        if ( message == NULL )
        {
            printf( "message is NULL\n" );
            return 1;
        }

        dbus_message_append_args( message,  DBUS_TYPE_INT32, &account, DBUS_TYPE_INVALID );
        dbus_message_append_args( message,  DBUS_TYPE_INVALID );

        dbus_connection_send( bus, message, NULL );
        dbus_message_unref( message );
#endif
    }
    return 1;
}

static int handle_autoanswer(buffer *b, const struct message *m)
{
    const char *account = NULL;
    const char *value = NULL;
    int acct_code = 0;
    int val_code = 0;

    account = msg_get_header(m, "acct");
    value = msg_get_header(m, "value");
    if ((account == NULL) || (value == NULL))
    {
        buffer_append_string (b, "Response=ERROR\r\nMessage=Missed Parameter\r\n");
    }
    else
    {
        sscanf (account, "%d", &acct_code);
        sscanf (value, "%d", &val_code);

        if (acct_code != 9 && (acct_code < 1 || acct_code > 3 || val_code < 0 || val_code > 1))
        {
            buffer_append_string (b, "Response=ERROR\r\nMessage=Parameter Invalid\r\n");
        }
        else
        {
            buffer_append_string (b, "Response=Success\r\n");
            dbus_send_lighttpd(SIGNAL_ACCT1_AUTO_ANSWER_OFF + 2 *(acct_code - 1) + val_code);
        }
    }

    return 1;
}

static int dbus_send_callforward(const int arg1, const char *arg2)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_CALLFORWARD);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INT32, &arg1, DBUS_TYPE_STRING, &arg2, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

static int handle_callforward(buffer *b, const struct message *m)
{
    const char *account = NULL;
    const char *value = NULL, *type = NULL;
    int acct_code = 0;
    int val_code = 0;

    account = msg_get_header(m, "acct");
    value = msg_get_header(m, "value");
    type = msg_get_header(m, "type");
    if ((account == NULL) || (value == NULL && type == NULL) )
    {
        buffer_append_string (b, "Response=ERROR\r\nMessage=Missed Parameter\r\n");
    }
    else
    {
        sscanf (account, "%d", &acct_code);
        if( value != NULL )
        {
            sscanf (value, "%d", &val_code);

            if (acct_code < 1 || acct_code > 3 || val_code < 0 || val_code > 1)
            {
                buffer_append_string (b, "Response=ERROR\r\nMessage=Parameter Invalid\r\n");
            }
            else
            {
                buffer_append_string (b, "Response=Success\r\n");
                dbus_send_lighttpd( SIGNAL_ACCT1_TRANSFER_OFF + 2 *(acct_code - 1) + val_code);
            }
        }else if( type != NULL )
        {
            buffer_append_string (b, "Response=Success\r\n");
            dbus_send_callforward((acct_code - 1), type);
        }

    }

    return 1;
}

/*static int handle_settimezone (buffer *b, const struct message *m)
{
    const char *temp = NULL;
    char val[256] = "";
    char cmd[256] = "";

    temp = msg_get_header(m, "timezone");
    if (temp == NULL)
    {
        buffer_append_string (b, "Response=Miss parater\r\n");
        return -1;
    }
    memset(val, 0, sizeof(val));
    memset(cmd, 0, sizeof(cmd));
    strncpy(val, temp, sizeof(val) - 1);
    uri_decode(val);
    char * c_ptr = nvram_get("override_time_zone");
    if ( ( c_ptr == NULL ) || ( strlen ( c_ptr ) == 0 ) )
    {
        //snprintf(cmd, sizeof(cmd), "/bin/echo \"%s\" > /etc/TZ", val);
        snprintf(cmd, sizeof(cmd), "/bin/echo \"$( cat<<'qWYBBmem'\n%s\nqWYBBmem\n)\" > /etc/TZ", val);
        system(cmd);
    }

    buffer_append_string (b, "Response=Success\r\n");
    dbus_send_lighttpd( SIGNAL_LIGHTTPD_TIMEZONE_CHANGED);
    return 1;
}
*/

static int handle_savetimeset (buffer *b, const struct message *m)
{
    const char *temp = NULL;
    char cmd[128] = "";
    int result;

    temp = msg_get_header(m, "timezone");
    if (temp != NULL)
    {
        memset(cmd, 0, sizeof(cmd));
        snprintf(cmd, sizeof(cmd), "setprop persist.sys.timezone %s", temp);
        result = mysystem(cmd);
        if(result == 0)
        {
            memset(cmd, 0, sizeof(cmd));
            snprintf(cmd, sizeof(cmd), "am broadcast -a android.intent.action.TIMEZONE_CHANGED -e time-zone %s", temp);
            mysystem(cmd);
        }
    }
    temp = msg_get_header(m, "timefmt");
    if (temp != NULL)
    {
        memset(cmd, 0, sizeof(cmd));
        snprintf(cmd, sizeof(cmd), "am broadcast -a android.intent.action.TIME_SET_SYNC -e time_12_24 %s", temp);
        result = mysystem(cmd);
    }
    temp = msg_get_header(m, "datefmt");
    if (temp != NULL)
    {
        memset(cmd, 0, sizeof(cmd));
        snprintf(cmd, sizeof(cmd), "am broadcast -a android.intent.action.DATE_FORMAT_SYNC -e date_format %s", temp);
        result = mysystem(cmd);
    }
    temp = msg_get_header(m, "auto");
    if (temp != NULL)
    {
        const char *usentp, *ntpserver = NULL;
        usentp = msg_get_header(m, "usentp");
        ntpserver = msg_get_header(m, "ntpserver");
        if( usentp != NULL && ntpserver != NULL )
        memset(cmd, 0, sizeof(cmd));
        snprintf(cmd, sizeof(cmd), "am broadcast -a com.base.module.setting.ntp_set -e auto_time %s -e use_defined_addr %s -e defined_addr \"%s\"", temp, usentp, ntpserver);
        result = mysystem(cmd);
    }
    buffer_append_string (b, "Response=Success\r\n");
    return 1;
}

static void create_default_ptz_config()
{
    xmlDocPtr cfg = NULL;
    xmlNodePtr root_node = NULL;
    xmlNodePtr speednode = NULL;
    xmlNodePtr posnode = NULL;

    cfg = xmlNewDoc( BAD_CAST "1.0" );
    root_node = xmlNewNode( NULL, BAD_CAST "map" );

    xmlDocSetRootElement(cfg, root_node);
    speednode = xmlNewChild(root_node, NULL, BAD_CAST "int", BAD_CAST "");
    if ( speednode != NULL )
    {
        xmlNewProp(speednode, BAD_CAST "name", BAD_CAST "move_speed" );
        xmlNewProp(speednode, BAD_CAST "value", BAD_CAST "8" );
    }

    posnode = xmlNewChild(root_node, NULL, BAD_CAST "int", BAD_CAST "");
    if ( posnode != NULL )
    {
        xmlNewProp(posnode, BAD_CAST "name", BAD_CAST "initial_position" );
        xmlNewProp(posnode, BAD_CAST "value", BAD_CAST "0" );
    }
    /*Dumping document to stdio or file*/
    xmlSaveFormatFileEnc( CONF_PTZ, cfg, "UTF-8", 1 );
    xmlFreeDoc(cfg);
    sync();

    char *cmd = NULL;
    cmd = malloc(128);
    memset(cmd, 0, 128);
    snprintf(cmd, 128, "chmod 777 %s", CONF_PTZ);
    system(cmd);
    free(cmd);
}

static int handle_getptz(buffer *b)
{
    xmlDocPtr doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    xmlChar *key = NULL;
    xmlChar *val = NULL;

    doc = xmlReadFile(CONF_PTZ, NULL, 0);

    if (doc == NULL)
    {
        printf("error: could not parse file %s\n", CONF_PTZ);
        create_default_ptz_config();
        buffer_append_string (b, "Response=Success\r\nMoveSpeed=8\r\nInitPos=0\r\n");
        return 0;
    }

    buffer_append_string (b, "Response=Success\r\n");
    /*Get the root element node */
    root_element = xmlDocGetRootElement(doc);
    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
    {
        //if (cur_node->type == XML_ELEMENT_NODE)
        {
            if ((!xmlStrcmp(cur_node->name, BAD_CAST "int")))
            {
                printf("cur_node name is string\n");
                key = xmlGetProp(cur_node, BAD_CAST "name");
                if( key != NULL )
                {
                    printf("cur_node name is %s\n", (char *)key);
                    if( strcmp( (char *)key, "move_speed") == 0 )
                    {
                        val = xmlGetProp(cur_node, BAD_CAST "value");
                        if (val != NULL) {
                            buffer_append_string (b, "MoveSpeed=");
                            buffer_append_string (b, val);
                            buffer_append_string (b, "\r\n");
                            printf("move_speed = %s\n", val);
                            xmlFree(val);
                        }
                    }else if( strcmp( (char *)key, "initial_position") == 0 )
                    {
                        val = xmlGetProp(cur_node, BAD_CAST "value");
                        if (val != NULL) {
                            buffer_append_string (b, "InitPos=");
                            buffer_append_string (b, val);
                            buffer_append_string (b, "\r\n");
                            printf("initial_position = %s\n", val);
                            xmlFree(val);
                        }
                    }
                    xmlFree(key);
                }
            }
        }
    }
    xmlFreeDoc(doc);
    return 1;
}

static int handle_setptz(buffer *b, const struct message *m)
{
    /*xmlDocPtr doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    xmlChar *key = NULL;
    const char *temp = NULL;
    int speed = -1;

    doc = xmlReadFile(CONF_PTZ, NULL, 0);

    if (doc == NULL)
    {
        printf("error: could not parse file %s\n", CONF_PTZ);
        return 0;
    }

    //Get the root element node
    root_element = xmlDocGetRootElement(doc);

    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
    {
        if (cur_node->type == XML_ELEMENT_NODE)
        {
            if ((!xmlStrcmp(cur_node->name, BAD_CAST "int")))
            {
                key = xmlGetProp(cur_node, BAD_CAST "name");
                if( key != NULL )
                {
                    if( strcmp( (char *)key, "move_speed") == 0 ){
                        temp = msg_get_header(m, "movespeed");
                        if ( temp != NULL )
                        {
                            speed = (atoi(temp))*2;
                            xmlSetProp(cur_node, "value", (xmlChar *) temp);
                        }
                    }
                    else if( strcmp( (char *)key, "initial_position") == 0 ){
                        temp = msg_get_header(m, "initpos");
                        if ( temp != NULL )
                        {
                            xmlSetProp(cur_node, "value", (xmlChar *) temp);
                        }
                    }
                }


            }
        }
    }

    xmlSaveFormatFileEnc(CONF_PTZ, doc, "UTF-8", 1);
    xmlFreeDoc(doc);
    xmlCleanupParser();
    xmlMemoryDump();
    sync();*/
    buffer_append_string (b, "Response=Success\r\n");

    char *temp = NULL;
    temp = msg_get_header(m, "movespeed");
    if ( temp != NULL ){
        dbus_send_ptz_control("ptspeed", atoi(temp), 0, 0, 0);
    }
    return 1;
}

static int handle_setfanspeed(buffer *b)
{
    int result = system("/system/xbin/setFanSpeed.sh &");
    if (result == 0)
        buffer_append_string(b, "Response=Success\r\n");
    else
        buffer_append_string(b, "Response=Error\r\n");

    return 0;
}

static int handle_checksecurity(buffer *b)
{
    char *result = false;
    char *buffer = NULL;
    buffer = malloc(2048);
    memset(buffer, 0, 2048);
#ifdef BUILD_ON_ARM
    result = nvram_get_safe_security("9602", buffer, 2048);
#endif
    if( result != NULL && strcasecmp(result,"1") == 0)
        buffer_append_string(b, "Response=Success\r\nLocked=1");
    else
        buffer_append_string(b, "Response=Success\r\nLocked=0");

    free(buffer);
    return 0;
}

static int handle_setdisplay_dbus(buffer *b, const struct message *m)
{
    const char *temp = NULL;
    temp = msg_get_header(m, "format");
    if( temp != NULL ){
        int outputvalue = -1;
        if( !strcasecmp(temp, "1034") ){
            outputvalue = 10;
        }else if( !strcasecmp(temp, "1033") ){
            outputvalue = 9;
        }else if( !strcasecmp(temp, "1029") ){
            outputvalue = 6;
        }else if( !strcasecmp(temp, "1028") ){
            outputvalue = 5;
        }else{
            outputvalue = atoi(temp);
        }
        /*else if( !strcasecmp(temp, "1027") ){
            outputvalue = 11;
        }else if( !strcasecmp(temp, "1026") ){
            outputvalue = 12;
        }*/
        if( outputvalue != -1 ){
            int hdminum = 1;
            temp = msg_get_header(m, "hdmi");
            if( temp != NULL )
                hdminum = atoi(temp);
            dbus_send_hdmi_output("intf_sync", hdminum, outputvalue);
            if( hdminum != 1 )
                buffer_append_string(b, "Response=Success\r\n");
            //dbus_send_hdmi_output("intf_sync", 2, outputvalue);
            //dbus_send_hdmi_output("intf_sync", 3, outputvalue);
        }
    }

    return 0;
}

static int handle_enableiptalkpro(buffer *b)
{
    char *p_value = nvram_get("ipvideotalkpro");
    if( p_value != NULL && !strcasecmp(p_value, "1") ){
        buffer_append_string (b, "Response=Success\r\n");
        return 1;
    }
    int result = system("cd /tmp/ && wget http://service.ipvideotalk.com/proservice/info.xml");
    if( result == 0 ){
        xmlChar *key = NULL;
        xmlDoc *doc = NULL;
        xmlNode *root_element = NULL;
        xmlNode *cur_node = NULL;

        doc = xmlReadFile("/tmp/info.xml", NULL, 0);

        if (doc == NULL)
        {
            printf("error: could not parse file /tmp/info.xml\n", CONF_AUTOCONFIG);
            buffer_append_string(b, "Response=Error\r\nMessage=Configuration File Not Found\r\n");
            return -1;
        }

        /*Get the root element node */
        root_element = xmlDocGetRootElement(doc);

        for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
        {
            if (cur_node->type == XML_ELEMENT_NODE)
            {
                if ((!xmlStrcmp(cur_node->name, BAD_CAST "service")))
                {
                    key = xmlNodeListGetString(doc, cur_node->xmlChildrenNode, 1);
                    if( key != NULL ){
                        if( strcasecmp(key, "release") == 0 )
                            buffer_append_string (b, "Response=Success\r\n");
                        else
                            buffer_append_string (b, "Response=Error\r\nMessage=NotReleased\r\n");
                        xmlFree(key);
                    }else{
                        buffer_append_string (b, "Response=Error\r\nMessage=NotReleased\r\n");
                    }
                }
            }
        }

        /*free the document */
        xmlFreeDoc(doc);
    }else{
        printf("result = %d\n", result);
        buffer_append_string (b, "Response=Error\r\nMessage=NoXml");
    }

    return 1;
}

void print_offset(buffer *b, long millis_offsets[], int n)
{
    int i;
    int hour, min;
    long offset;
    char sign;
    char gmtvalue[16] = "";
    for (i = 0; i < n; i++)
    {
        offset = millis_offsets[i] / 60000;
        sign = '+';
        if(offset < 0)
        {
            offset = - offset;
            sign = '-';
        }
        hour = (int)(offset/60);
        min  = (int)(offset%60);

        printf("%d, GMT%c%d:%02d %s, %ld\n", i, sign, hour, min, ids[i], millis_offsets[i]);
        if( i == 0 )
        {
            snprintf(gmtvalue, sizeof(gmtvalue), "\"GMT%c%d:%02d\"", sign, hour, min );
        }else
        {
            snprintf(gmtvalue, sizeof(gmtvalue), ",\"GMT%c%d:%02d\"", sign, hour, min );
        }
        buffer_append_string(b, gmtvalue);
    }
}

static int handle_gettimezone (buffer *b)
{
    //void *dp;
    int n;
    long *result;

    system("getprop persist.sys.timezone > /tmp/timezone");
    FILE *fp = fopen("/tmp/timezone", "r");
    char line[32] = "";

    if (fp == NULL)
        return -1;

    fgets( &line, sizeof(line), fp );
    fclose(fp);
    snprintf(line, strlen(line), "%s", line);

    buffer_append_string(b, "{\"Response\":\"Success\",");
    buffer_append_string(b, "\"timezone\":\"");
    buffer_append_string(b, (char *) line);
    buffer_append_string(b, "\",\"citygmt\":[");
    //dp=dlopen(SOFILE, RTLD_LAZY);
    //get_timezone_offset = dlsym(dp,"get_timezone_offset");

    //if(get_timezone_offset) {
        n = sizeof(ids)/sizeof(ids[0]);
        result = (long*)malloc(n * sizeof(long));

        get_timezone_offset(ids, n, result);
        print_offset(b, result, n);

        free(result);
    //}
    buffer_append_string(b, "]}");

/*    buffer_append_string (b, "Response=Success\r\ntimezone=");
    buffer_append_string (b, line);
    buffer_append_string (b, "\r\n");*/

    return 1;
}

static int handle_capture (buffer *b, const struct message *m)
{
    const char *temp = NULL;
	struct statfs fs;
	long long freespace = 0;
	long long pcap_size = 0;

    temp = msg_get_header(m, "mode");
    if( temp == NULL ){
        buffer_append_string(b, "Response=Error\r\n");
        return -1;
    }
    if (!strcasecmp(temp, "on"))
    {
        capmode = 1;
        printf("timestr is on\n");
        if( access(PCAP_PATH, 0) ) {
            mkdir(PCAP_PATH, 0777);
        }
        time_t timer;
        struct tm *tblock;

        /* gets time of day */
        timer = time(NULL);

        /* converts date/time to a structure */
        tblock = localtime(&timer);
        char timestr[32] = "";
        snprintf(timestr, sizeof(timestr), "%4d%02d%02d%02d%02d%02d", 1900+tblock->tm_year, 1+tblock->tm_mon, tblock->tm_mday, tblock->tm_hour, tblock->tm_min, tblock->tm_sec );
        printf("timestr is %s\n", timestr);

		if (statfs(PCAP_PATH, &fs) < 0)
			return -1;
		freespace = (((long long)fs.f_bsize*(long long)fs.f_bfree)/(long long)1024);
		printf("free space: %lld\n", freespace);

		pcap_size = (freespace/(long long)(2*1024));
		printf("pcap_size: %lld\n", pcap_size);

		if(pcap_size <= 100)
		{
			buffer_append_string (b, "Response=Error\r\n");
			return -1;
		}

        char cmdstr[128] = "";
#ifdef BUILD_ON_ARM
        char *p_value = nvram_get("wan_device");
#else
        char *p_value = NULL;
#endif

        if(p_value != NULL && p_value[0] != '\0' && strstr(p_value, "ppp") == NULL)
        {
            snprintf(cmdstr, sizeof(cmdstr), "tcpdump -s 0 -i %s -w %s/%s.pcap -n &", p_value, PCAP_PATH, timestr);
        }
        else
        {
            snprintf(cmdstr, sizeof(cmdstr), "tcpdump -s 0 -i eth0 -w %s/%s.pcap -n &", PCAP_PATH, timestr);
        }

        //snprintf(cmdstr, sizeof(cmdstr), "tcpdump -s 0 -w %s/%s.pcap &", PCAP_PATH, timestr);
        printf("cmdstr is %s\n", cmdstr);
        system(cmdstr);
        buffer_append_string (b, "Response=Success\r\n");
    }else if (!strcasecmp(temp, "off"))
    {
        capmode = 0;
        system("killall -9 tcpdump");
        buffer_append_string (b, "Response=Success\r\n");
    }else if (!strcasecmp(temp, "mode")) {
        buffer_append_string (b, "Response=Success\r\n");
        if (capmode == 1)
        {
            buffer_append_string(b, "mode=on\r\n");
        } else {
            buffer_append_string(b, "mode=off\r\n");
        }
    }

    return 1;
}

static int handle_deletetrace(buffer *b, const struct message *m)
{
    const char *temp = NULL;
    char *path = NULL;

    temp = msg_get_header(m, "tracename");
    if( temp != NULL )
    {
        char *filename = NULL;
        int len = strlen(temp)*2;
        filename = malloc(len);
        memset(filename, 0, len);
        replace(temp, "../", "", filename);

        len = strlen(PCAP_PATH) + strlen(filename) + 4;
        path = malloc(len);
        snprintf(path, len, "%s/%s", PCAP_PATH, filename);
        printf("path = %s\n", path);
        if( access(path, 0) == 0 )
        {
            unlink(path);
            buffer_append_string(b, "Response=Success\r\n");
        }else
        {
            buffer_append_string(b, "Response=Error\r\n");
        }
        free(filename);
        free(path);
    }else
    {
        buffer_append_string(b, "Response=Error\r\n");
    }
    return 1;
}

static int handle_tracelist (buffer *b)
{
    struct dirent *dp;
    DIR *dir;
    char *ptr = NULL;
    int j=0;
    char name[256] = "";
    char *fileExt = NULL;

    if( access( PCAP_PATH, 0 ) )
    {
        buffer_append_string(b, "Response=Error\r\n"
                "Message=The ringtone directory doesn't exist\r\n");
        return -1;
    }

    if( (dir = opendir(PCAP_PATH))== NULL )
    {
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Ring tone directory open failed\r\n");
        return -1;
    }

    buffer_append_string(b, "{\"Response\":\"Success\",\"Tracelist\":[");

    while ((dp = readdir( dir )) != NULL)
    {
        if(dp == NULL)
        {
            printf("dp is null\n");
            break;
        }
        if (strcmp(dp->d_name, ".") != 0 && strcmp(dp->d_name, "..") != 0)
        {
            sprintf(name, dp->d_name);
            if( name[0] != '.' )
            {
                uri_decode(name);
                ptr = strrchr(name, '.');
                if(ptr != NULL)
                {
                    fileExt = strdup(ptr+1);
                    if( strcasecmp(fileExt, "pcap") == 0 )
                    {
                        if(!j)
                        {
                            buffer_append_string(b, "\"");
                        }
                        else
                        {
                            buffer_append_string(b, ",\"");
                        }
                        buffer_append_string(b, name);
                        buffer_append_string(b, "\"");
                        j++;
                    }
                    free(fileExt);
                    fileExt = NULL;
                }
            }
        }
    }
    buffer_append_string(b, "]}");

    closedir(dir);
    return 1;

}

char* substr(const char*str, unsigned start, unsigned end)
{
    unsigned n = end - start;
    static char stbuf[256];
    strncpy(stbuf, str + start, n);
    stbuf[n] = 0;
    return stbuf;
}

int file_manager_file_copy(const char *old_file, const char *new_file)
{
    FILE *old_fd = NULL, *new_fd = NULL;
    char *buf = NULL;
    size_t len = 0;

    if (old_file == NULL || new_file == NULL ||
        old_file[0] == '\0' || new_file[0] == '\0')
    {
        return -1;
    }

    old_fd = fopen(old_file, "r+");
    new_fd = fopen(new_file, "w+");
    if (old_fd == NULL || new_fd == NULL)
    {
        if (old_fd != NULL)
        {
            fclose(old_fd);
            return -2;
        }
        if (new_fd != NULL)
        {
            fclose(new_fd);
            return -3;
        }
    }

    buf = malloc(1024 * 8);
    while (feof(old_fd) == 0)
    {
        len = fread(buf, 1, 1024 * 8, old_fd);
        fwrite(buf, 1, len, new_fd);
    }
    free(buf);
    fflush(new_fd);
    fclose(new_fd);
    fclose(old_fd);

    return 0;
}

static int dbus_send_lighttpd ( const int arg1 )
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_LIGHTTPD);
    if ( message == NULL )
    {
        printf( "message is NULL\n");
        return 1;
    }

    dbus_message_append_args( message, DBUS_TYPE_INT32, &arg1, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_message_unref( message );
#endif

    return 0;
}

static int handle_gettonename(buffer *b, const struct message *m)
{
    int x, len;
    char hdr[64] = "";
    char *res = NULL;
    char *tempval = NULL;
    const char *val = NULL, *var = NULL;
    char *ptr;

    buffer_append_string(b, "Response=Success\r\n");

    for (x = 0; x < 10000; x++) {
    	snprintf(hdr, sizeof(hdr), "var-%04d", x);
    	var = msg_get_header(m, hdr);

    	if ((!var || (*var == '\0')))
    		break;
#ifdef BUILD_ON_ARM
        val = nvram_my_get(var);
#else
        val = "0";
#endif

        if(strlen(val) == 0)
        {
            buffer_append_string(b, var);
            buffer_append_string(b, "=Ring tone 1\r\n");
            continue;
        }else if(strlen(val) == 1){
            tempval = malloc( 16 );
            snprintf(tempval, 16, "Ring tone %d", atoi(val) + 1);
            //printf("ddddddddddddd is- %s---\r\n", tempval);
        }
        else {
            ptr = strrchr(val, '/');
            if(ptr == NULL)
                continue;
            tempval = strdup(ptr+1);
        }
        
        uri_decode(tempval);
        len = strlen(var) + strlen(tempval) + 4;
        res = malloc(len);
        snprintf(res, len, "%s=%s\r\n", var, tempval);
        buffer_append_string(b, res);
        /*buffer_append_string(b, var);
        buffer_append_string(b, "=");
        buffer_append_string(b, tempval);
        buffer_append_string(b, "\r\n");*/
        free(tempval);
        free(res);
    }

    return 0;
}

/*static int handle_getnetwork(buffer *b)
{
    printf("-----handle_getnetwork--\n");
    sqlite3 *db;
    int rc;
    char * errmsg = NULL;
    char **dbResult;
    int nRow, nColumn;
    int i , j;
    int index;
    char *sqlstr = NULL, *resstr = NULL;

    rc = sqlite3_open("/data/data/com.android.providers.settings/databases/settings.db", &db);
    if( rc ){
        printf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 0;
    }
    buffer_append_string(b, "Response=Success\r\n");
    const char *netval[5] = {"eth_ip", "eth_mask", "eth_route", "eth_dns", "eth_dns2"};

    for( int si = 0; si < 5; si ++ )
    {
        printf("fined %d\n", si);
        sqlstr = malloc(64);
        snprintf(sqlstr, 64, "select * from secure where name=\"%s\";", netval[si]);
        printf("fined str %s\n", sqlstr);
        rc = sqlite3_get_table ( db, sqlstr , &dbResult, &nRow, &nColumn, &errmsg );
        if( rc == SQLITE_OK )
        {
            printf("-----handle_ok 111111111--\n");
            index = nColumn;
            printf( "query %d records.\n", nRow );
            for( i = 0; i < nRow ; i++ )
            {
                printf("Record %d:\n" , i+1 );
                for( j = 0 ; j < nColumn; j++ )
                {
                    if( !strcasecmp(dbResult[j], "value") )
                    {
                        resstr = malloc(32);
                        if( dbResult[index] != NULL )
                            snprintf(resstr, 32, "%s=%s\r\n", netval[si], dbResult[index]);
                        else
                            snprintf(resstr, 32, "%s=\r\n", netval[si]);
                        buffer_append_string(b, resstr);
                        free(resstr);
                    }
                    printf( "index:%d, name:%s, value:%s\n", index, dbResult[j], dbResult[index] );
                    ++index;
                }
                printf("---index--%d--\n" , index);
            }
        }else
        {
            printf("-----handle_error 111111111--\n");
            resstr = malloc(32);
            snprintf(resstr, 32, "%s=\r\n", netval[si]);
            buffer_append_string(b, resstr);
            free(resstr);
            printf(stderr, "SQL error: %s\n", errmsg);
            sqlite3_free(errmsg);
        }
        free(sqlstr);
        sqlite3_free_table ( dbResult );
    }

    sqlite3_close(db);
    return 1;
}
*/
static int handle_putnetwork(buffer *b)
{
    system("am broadcast -a android.intent.action.ETHERNET_WEB_SAVED");
    buffer_append_string(b, "Response=Success\r\n");

    return 1;
}

static int handle_rename_framecomp(buffer *b, const struct message *m)
{
    char *filename = NULL;

    filename = msg_get_header(m, "filename");
    if( filename != NULL ){
        char *cmd = NULL;
        uri_decode(filename);
        int len = strlen(filename) + 256;
        cmd = malloc(len);
        snprintf(cmd, len, "mv \"%s/framecomp.crt\" \"%s/%s\"", PATH_FRAME_CERT, PATH_FRAME_CERT, filename);
        int result = system(cmd);
        buffer_append_string(b, "Response=Success\r\n");
        free(cmd);
    }else{
        buffer_append_string(b, "Response=Error\r\n");
    }

    return 1;
}

int mypint( const char ** s, int n, int min, int max, int * e )
{
    int retval = 0;
    while (n) {
        if (**s < '0' || **s > '9') {
            *e = 1; return 0;
        }
        retval *= 10;
        retval += **s - '0';
        --n;
        ++(*s);
    }
    if (retval < min || retval > max)
        *e = 1;
    return retval;
}

time_t ASN1_TIME_get ( ASN1_TIME * a,int *err )
{
    char days[2][12] = {
        { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 },
        { 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 }
    };

    int dummy;
    const char *s;
    int generalized;
    struct tm t;
    int i, year, isleap, offset;
    time_t retval;

    if (err == NULL) err = &dummy;
    if (a->type == V_ASN1_GENERALIZEDTIME) {
        generalized = 1;
    } else if (a->type == V_ASN1_UTCTIME) {
        generalized = 0;
    } else {
        *err = 1;
        return 0;
    }

    s = a->data; // Data should be always null terminated

    if (s == NULL || s[a->length] != '\0') {
        *err = 1;
        return 0;
    }

    *err = 0;
    if (generalized) {
        t.tm_year = mypint(&s, 4, 0, 9999, err) - 1900;
    } else {
        t.tm_year = mypint(&s, 2, 0, 99, err);
        if (t.tm_year < 50) t.tm_year += 100;
    }

    t.tm_mon = mypint(&s, 2, 1, 12, err) - 1;
    t.tm_mday = mypint(&s, 2, 1, 31, err);
    // NOTE: It's not yet clear, if this implementation is 100% correct
    // for GeneralizedTime... but at least misinterpretation is
    // impossible --- we just throw an exception

    t.tm_hour = mypint(&s, 2, 0, 23, err);
    t.tm_min = mypint(&s, 2, 0, 59, err);
    if (*s >= '0' && *s <= '9') {
        t.tm_sec = mypint(&s, 2, 0, 59, err);
    } else {
        t.tm_sec = 0;
    }

    if (*err) return 0; // Format violation
    if (generalized) {
        // skip fractional seconds if any
        while (*s == '.' || *s == ',' || (*s >= '0' && *s <= '9')) ++s;
        // special treatment for local time
        if (*s == 0) {
            t.tm_isdst = -1;
            retval = mktime(&t); // Local time is easy :)
            if (retval == (time_t)-1) {
                *err = 2;
                retval = 0;
            }
            return retval;
        }
    }

    if (*s == 'Z') {
        offset = 0;
        ++s;
    } else if (*s == '-' || *s == '+') {
        i = (*s++ == '-');
        offset = mypint(&s, 2, 0, 12, err);
        offset *= 60;
        offset += mypint(&s, 2, 0, 59, err);
        if (*err) return 0; // Format violation
        if (i)
            offset = -offset;
    } else {
        *err = 1;
        return 0;
    }

    if (*s) {
        *err = 1;
        return 0;
    }


    // And here comes the hard part --- there's no standard function to

    // convert struct tm containing UTC time into time_t without

    // messing global timezone settings (breaks multithreading and may

    // cause other problems) and thus we have to do this "by hand"

    //

    // NOTE: Overflow check does not detect too big overflows, but is

    // sufficient thanks to the fact that year numbers are limited to four

    // digit non-negative values.

    retval = t.tm_sec;
    retval += (t.tm_min - offset) * 60;
    retval += t.tm_hour * 3600;
    retval += (t.tm_mday - 1) * 86400;
    year = t.tm_year + 1900;
    if ( sizeof (time_t) == 4) {
        // This is just to avoid too big overflows being undetected, finer
        // overflow detection is done below.
        if (year < 1900 || year > 2040)
            *err = 2;
    }

    // FIXME: Does POSIX really say, that all years divisible by 4 are

    // leap years (for consistency)??? Fortunately, this problem does

    // not exist for 32-bit time_t and we should'nt be worried about

    // this until the year of 2100 :)

    isleap = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);

    for (i = t.tm_mon - 1; i >= 0; --i)
        retval += days[isleap][i] * 86400;

    retval += (year - 1970) * 31536000;

    if (year < 1970) {
        retval -= ((1970 - year + 2) / 4) * 86400;
    if ( sizeof (time_t) > 4) {
        for (i = 1900; i >= year; i -= 100) {
            if (i % 400 == 0) continue ;
            retval += 86400;
        }
    }
    if (retval >= 0)
        *err = 2;
    } else {
        retval += ((year - 1970 + 1) / 4) * 86400;
        if ( sizeof (time_t) > 4) {
            for (i = 2100; i < year; i += 100) {
            // The following condition is the reason to
            // start with 2100 instead of 2000
                if (i % 400 == 0) continue ;
                retval -= 86400;
            }
        }
        if (retval < 0) *err = 2;
    }
    if (*err) retval = 0;
    return retval;
}

static int handle_getvericert(buffer *b)
{
    printf("handle_getvericert\n");
    const char *pcerts[6] = {"2386", "2486", "2586", "2686", "2786", "2886"};
    BIO *in = NULL;
    X509 *cert = NULL;
    int num = 0;
    X509_NAME *name;
    ASN1_TIME *validtime;
    char *infostr = NULL;
    char *temp = NULL;
    //int length = 1024*8;

    buffer_append_string(b, "{\"Response\":\"Success\",\"Data\":[");
    for(int i = 0; i < 6; i ++){
        temp = nvram_my_get(pcerts[i]);
        if( !strcasecmp(temp, "") ){
            printf("this pvalue %s is empty\n", pcerts[i]);
            continue;
        }
        if ((in = BIO_new_mem_buf((void*)temp, -1)) == NULL){
            printf("new mem buf error\n");
            continue;
        }
        if ((cert = PEM_read_bio_X509(in, NULL, NULL, NULL)) == NULL){
            printf("read bio buf error\n");
            continue;
        }

        name = X509_get_subject_name(cert);
        int count = X509_NAME_entry_count(name);

        if( !num )
            buffer_append_string(b, "{\"Pvalue\":\"");
        else
            buffer_append_string(b, ",{\"Pvalue\":\"");

        buffer_append_string(b, pcerts[i]);
        buffer_append_string(b, "\",\"Validtime\":\"");
        validtime = X509_get_notAfter(cert);
        //printf("validtime type is %d, date is %ld\n", validtime->type, ASN1_TIME_get(validtime, NULL));
        char *notafterstr = NULL;
        notafterstr = malloc(32);
        memset(notafterstr, 0, 32);
        snprintf(notafterstr, 32, "%ld", ASN1_TIME_get(validtime, NULL));
        buffer_append_string(b, notafterstr);
        free(notafterstr);
        buffer_append_string(b, "\",\"Info\":[");
        for(int i = 0; i < count; i++){
            /*pos = -1;
            for (;;) {
                pos = X509_NAME_get_index_by_NID(name, nids[i].key, pos);
                if (pos >=0 && pos <= j) {   // pos != -1
                    d = X509_NAME_ENTRY_get_data(X509_NAME_get_entry(name, pos));
                    printf("%s = %s [%d]\n", nids[i].name, d->data, d->length);
                }
            }
            */
            infostr = malloc(256);
            memset(infostr, 0, 256);

            X509_NAME_ENTRY *entry = X509_NAME_get_entry(name, i);

            if(!i)
            {
                snprintf(infostr, 256, "\"%s(%d)\"", X509_NAME_ENTRY_get_data(entry)->data, OBJ_obj2nid(entry->object));
            }
            else
            {
                snprintf(infostr, 256, ",\"%s(%d)\"", X509_NAME_ENTRY_get_data(entry)->data, OBJ_obj2nid(entry->object));
            }

            buffer_append_string(b, infostr);
            free(infostr);
            num ++;
        }
        buffer_append_string(b, "]}");
    }

    /*FILE *fp = fopen(CERT_FILENAME, "r");
    while ((cert = PEM_read_X509(fp, NULL, NULL, NULL)) != NULL){
        printf("handle_getvericert not null \n");

    }
    fclose(fp);*/
    buffer_append_string(b, "]}");

    return 1;
}

static int check_same_cert(long hash)
{
    const char *pcerts[6] = {"2386", "2486", "2586", "2686", "2786", "2886"};
    BIO *in = NULL;
    X509 *cert = NULL;
    long tmphash;
    int exist = 0;
    char *temp = NULL;

    for(int i = 0; i < 6; i ++){
        temp = nvram_my_get(pcerts[i]);
        if( !strcasecmp(temp, "") ){
            continue;
        }
        if ((in = BIO_new_mem_buf((void*)temp, -1)) == NULL){
            continue;
        }
        if ((cert = PEM_read_bio_X509(in, NULL, NULL, NULL)) == NULL){
            continue;
        }
        tmphash = X509_subject_name_hash(cert);
        printf("tmphash is %ld, hash is %ld\n", tmphash, hash);
        if( tmphash == hash )
        {
            exist = 1;
            break;
        }
    }

    return exist;
}

static int handle_check_vericert(buffer *b, const struct message *m)
{
    FILE *fp = fopen( TMP_CERT_PATH , "r");
    char line[1024] = "";
    char *val = NULL;
    char *buf = NULL;
    int start = 0;
    int length = 1024 * 8;
    int valid = 0;
    const char *temp = NULL;
    int validnum = 0;
    char *pvalueparam = NULL;
    int validmaxnum = 0;

    temp = msg_get_header(m, "maxnum");
    if( temp != NULL )
        validmaxnum = atoi(temp);

    while ((  fp != NULL) && !feof( fp ) )
    {
        if( validnum >= validmaxnum ) break;
        fgets( &line, 1024, fp );
        if( start == 1 ){
            //printf("line is %s\n", line);
            strcat(buf, line);
            val = strstr( line, "-END CERTIFICATE-");
            if( val != NULL ){
                start = 0;
                BIO *in = NULL;
                X509 *cert = NULL;
                FILE *new_fd = fopen(TMP_CERT, "w+");
                if( new_fd != NULL ){
                    fwrite(buf, 1, length, new_fd);
                    fflush(new_fd);
                    fclose(new_fd);
                }
                if ((in = BIO_new_mem_buf((void*)buf, -1)) == NULL){
                    printf("new mem buf error\n");
                    memset(line, 0, sizeof(line));
                    free(buf);
                    continue;
                }
                if ((cert = PEM_read_bio_X509(in, NULL, NULL, NULL)) == NULL){
                    printf("read bio buf error\n");
                    memset(line, 0, sizeof(line));
                    free(buf);
                    continue;
                }
                /*X509_STORE_CTX *storeCtx = X509_STORE_CTX_new();
                X509_STORE* m_store = X509_STORE_new();
                X509_LOOKUP* m_lookup = X509_STORE_add_lookup(m_store, X509_LOOKUP_file());
                if( m_lookup == NULL )
                    printf("m_lookup is null\n");
                X509_STORE_set_default_paths(m_store);
                X509_STORE_CTX_init(storeCtx, m_store, cert, NULL);
                X509_STORE_CTX_set_flags(storeCtx, X509_V_FLAG_CB_ISSUER_CHECK);

                X509_STORE* m_store = X509_STORE_new();
                X509_LOOKUP* m_lookup = X509_STORE_add_lookup(m_store, X509_LOOKUP_file());
                X509_STORE_load_locations(m_store, TMP_CERT, NULL);
                X509_STORE_set_default_paths(m_store);
                X509_LOOKUP_load_file(m_lookup, TMP_CERT, X509_FILETYPE_PEM);

                X509_STORE_CTX *storeCtx = X509_STORE_CTX_new();
                FILE *newfp = fopen(TMP_CERT, "r");
                X509 *cert = NULL;
                if ((cert = PEM_read_X509(newfp, NULL, NULL, NULL)) != NULL){
                    X509_STORE_CTX_init(storeCtx,m_store,cert,NULL);
                    //X509_STORE_CTX_set_flags(storeCtx, X509_V_FLAG_CB_ISSUER_CHECK);
                    if (X509_verify_cert(storeCtx) == 1)
                    {*/
                        if( check_same_cert( X509_subject_name_hash(cert) ) ){
                            valid = 3;
                        }else{
                            BASIC_CONSTRAINTS *bs;
                            bs=X509_get_ext_d2i(cert, NID_basic_constraints, NULL, NULL);
                            if (!bs){
                                if( valid != 1 )
                                    valid = 2;
                            }else{
                                printf("ca is %d\n", bs->ca);
                                if(bs->ca){
                                    pvalueparam = malloc(32);
                                    memset(pvalueparam, 0, 32);
                                    snprintf(pvalueparam, 32, "pvalue%d", validnum);
                                    temp = msg_get_header(m, pvalueparam);
                                    if( temp != NULL ){
                                        printf("set to pvalue %s\n", temp);
                                        valid = 1;
                                        nvram_set(temp, buf);
                                        validnum ++;
                                    }
                                }else{
                                    if( valid != 1 )
                                        valid = 2;
                                }
                                BASIC_CONSTRAINTS_free(bs);
                            }
                        }
                    /*}else
                    {
                        printf("Verificatione rror: %s\n",X509_verify_cert_error_string(storeCtx->error));
                        if( valid != 1 )
                            valid = 0;
                    }
                    X509_STORE_CTX_free(storeCtx);

                    if(m_store != NULL)
                    {
                       X509_STORE_free(m_store);
                       m_store = NULL;
                    }*/
                //}
                //fclose(newfp);
                free(buf);
            }
        }else{
            val = strstr( line, "-BEGIN CERTIFICATE-");
            if( val != NULL ){
                buf = malloc(length);
                memset(buf, 0, length);
                snprintf(buf, 1024, line);
                start = 1;
            }
        }
        memset(line, 0, sizeof(line));
    }
    if( valid == 1 ){
        nvram_commit();
        buffer_append_string(b, "1");
    }else if( valid == 2 ){
        buffer_append_string(b, "2");
    }else if( valid == 3 ){
        buffer_append_string(b, "3");
    }else{
        buffer_append_string(b, "0");
    }
    fclose(fp);
    //system("rm /tmp/upload_certs");

    return 1;

    /*
    if( valid == 1 ){
        //need to re-open the upload file,as fp pointer position is not at the start already
        FILE *old_fd = fopen(TMP_CERT_PATH, "r+");
        FILE *new_fd = fopen(CERT_FILENAME, "w+");
        char *buf = NULL;
        size_t len = 0;
        if( new_fd != NULL ){
            buf = malloc(1024 * 8);
            memset(buf, 0, 1024 * 8);
            while (feof(old_fd) == 0)
            {
                len = fread(buf, 1, 1024 * 8, old_fd);
                printf("buf is %s\n", buf);
                fwrite(buf, 1, len, new_fd);
            }
            free(buf);
            fflush(new_fd);
            fclose(new_fd);
            fclose(old_fd);
            //system("rm /tmp/upload_certs");
        }
    }*/
}

static int handle_tonelist1 (buffer *b)
{
    printf("handle_tonelist\n");
    //const char *sqlstr = NULL;

    sqlite3 *db;
    int rc;
    char * errmsg = NULL;
    char **dbResult;
    int nRow, nColumn;
    int i , j, count = 0, isTone = 0, curId;
    int index, len;
    char *temp = NULL, *path = NULL;

    rc = sqlite3_open("/data/data/com.android.providers.media/databases/external.db", &db);
    if( rc ){
        printf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 0;
    }
    printf("db open suc\n");
    /*rc = sqlite3_exec(db, sqlstr, callback, 0, &errmsg);
    if( rc!=SQLITE_OK )
    {
        printf(stderr, "SQL error: %s\n", errmsg);
        sqlite3_free(errmsg);
    }*/
    rc = sqlite3_get_table ( db, "select * from audio_meta where is_ringtone=1 order by upper(title);" , &dbResult, &nRow, &nColumn, &errmsg );
    if( rc == SQLITE_OK )
    {
        index = nColumn;
        printf( "query %d records, nColumn is %d.\n", nRow, nColumn );
        buffer_append_string(b, "{\"Response\":\"Success\",\"Ringtone\":[");
        for( i = 0; i < nRow ; i++ )
        {
            printf("Record %d:\n" , i+1 );
            isTone = 0;
            for( j = 0 ; j < nColumn; j++ )
            {
                if( !strcasecmp(dbResult[j], "_id") )
                {
                    curId = atoi(dbResult[index]);
                }
                else if( !strcasecmp(dbResult[j], "_data") )
                {
                    /*if( strstr(dbResult[index], "/system/media/audio/ringtones/") != NULL)
                    {
                        isTone = 1;
                    }*/
					path = dbResult[index];
                }
				else if( !strcasecmp(dbResult[j], "title"))
				{
					len = strlen(dbResult[index]) + strlen(path) + 32;
					temp = malloc ( len );

					if(!count)
					{
						snprintf(temp, len, "{\"data\":\"%s\",\"title\":\"%s\"}", path, dbResult[index]);
					}
					else
					{
						snprintf(temp, len, ",{\"data\":\"%s\",\"title\":\"%s\"}", path, dbResult[index]);
					}
					count ++;
					buffer_append_string(b,temp);
					free(temp);
				}
					
				/*else if( !strcasecmp(dbResult[j], "title") )
                {
                    len =  strlen(dbResult[index]) + 32;
                    temp = malloc( len );
                    if(!count)
                    {
                        snprintf(temp, len, "\"%s(%d)\"", dbResult[index], curId);
                    }
                    else
                    {
                        snprintf(temp, len, ",\"%s(%d)\"", dbResult[index], curId);
                    }
                    count++;
                    buffer_append_string(b, temp);
                    free(temp);
                }*/
                //printf( "index:%d, name:%s, value:%s\n", index, dbResult[j], dbResult[index] );
                ++index;
            }
        }
        buffer_append_string(b, "]}");
    }else
    {
        printf(stderr, "SQL error: %s\n", errmsg);
        sqlite3_free(errmsg);
    }
    sqlite3_free_table ( dbResult );
    sqlite3_close(db);
    
    return 1;
    
}

static int handle_tonelist (buffer *b, const char *path)
{
    struct dirent *dp;
    DIR *dir;
    char *ptr = NULL;
    int j=0;
    char name[256] = "";
    //char *fileExt = NULL;

    if( access( path, 0 ) )
    {
        buffer_append_string(b, "Response=Error\r\n"
                "Message=The ringtone directory doesn't exist\r\n");
        return -1;
    }

    if( (dir = opendir(path))== NULL )
    {
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Ring tone directory open failed\r\n");
        return -1;
    }

    buffer_append_string(b, "{\"Response\":\"Success\",\"Ringtone\":[");

    while ((dp = readdir( dir )) != NULL)
    {
        if(dp == NULL)
        {
            printf("dp is null\n");
            break;
        }
        if (strcmp(dp->d_name, ".") != 0 && strcmp(dp->d_name, "..") != 0)
        {
            sprintf(name, dp->d_name);
            if( name[0] != '.' )
            {
                uri_decode(name);
                ptr = strrchr(name, '.');
                if(ptr != NULL)
                {
                    //fileExt = strdup(ptr+1);
                    /*if( strcasecmp(fileExt, "aac") == 0
                        || strcasecmp(fileExt, "mp3") == 0
                        || strcasecmp(fileExt, "wma") == 0
                        || strcasecmp(fileExt, "ogg") == 0
                        || strcasecmp(fileExt, "flac") == 0
                        || strcasecmp(fileExt, "wav") == 0 )*/
                    {
                        if(!j)
                        {
                            buffer_append_string(b, "\"");
                        }
                        else
                        {
                            buffer_append_string(b, ",\"");
                        }
                        buffer_append_string(b, name);
                        buffer_append_string(b, "\"");
                        j++;
                    }
                    //free(fileExt);
                    //fileExt = NULL;
                }
            }
        }
    }
    buffer_append_string(b, "]}");

    closedir(dir);
    return 1;

}

static int handle_tonelist_db (buffer *b, int ringtone)
{
    printf("handle_tonelist_db\n");
    //const char *sqlstr = NULL;

    sqlite3 *db;
    int rc;
    char * errmsg = NULL;
    char **dbResult;
    int nRow, nColumn;
    int i , j, count = 0, isTone = 0, curId;
    int index, len;
    char *temp = NULL, *path = NULL;

    rc = sqlite3_open("/data/data/com.android.providers.media/databases/internal.db", &db);
    if( rc ){
        printf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 0;
    }
    printf("db open suc\n");
    /*rc = sqlite3_exec(db, sqlstr, callback, 0, &errmsg);
    if( rc!=SQLITE_OK )
    {
        printf(stderr, "SQL error: %s\n", errmsg);
        sqlite3_free(errmsg);
    }*/
    if( ringtone )
        rc = sqlite3_get_table ( db, "select * from audio_meta where is_ringtone=1 order by upper(title);" , &dbResult, &nRow, &nColumn, &errmsg );
    else
        rc = sqlite3_get_table ( db, "select * from audio_meta where is_notification=1 order by upper(title);" , &dbResult, &nRow, &nColumn, &errmsg );
    if( rc == SQLITE_OK )
    {
        index = nColumn;
        printf( "query %d records, nColumn is %d.\n", nRow, nColumn );
        buffer_append_string(b, "{\"Response\":\"Success\",\"Ringtone\":[");
        for( i = 0; i < nRow ; i++ )
        {
            printf("Record %d:\n" , i+1 );
            isTone = 0;
            for( j = 0 ; j < nColumn; j++ )
            {
                if( !strcasecmp(dbResult[j], "_id") )
                {
                    curId = atoi(dbResult[index]);
                }
                else if( !strcasecmp(dbResult[j], "_data") )
                {
                    /*if( strstr(dbResult[index], "/system/media/audio/ringtones/") != NULL)
                    {
                        isTone = 1;
                    }*/
                    path = dbResult[index];
                }
                else if( !strcasecmp(dbResult[j], "title"))
                {
                    len = strlen(dbResult[index]) + strlen(path) + 32;
                    temp = malloc ( len );

                    if(!count)
                    {
                        snprintf(temp, len, "{\"id\":\"%d\",\"title\":\"%s\"}", curId, dbResult[index]);
                    }
                    else
                    {
                        snprintf(temp, len, ",{\"id\":\"%d\",\"title\":\"%s\"}", curId, dbResult[index]);
                    }
                    count ++;
                    buffer_append_string(b,temp);
                    free(temp);
                }

                /*else if( !strcasecmp(dbResult[j], "title") )
                {
                    len =  strlen(dbResult[index]) + 32;
                    temp = malloc( len );
                    if(!count)
                    {
                        snprintf(temp, len, "\"%s(%d)\"", dbResult[index], curId);
                    }
                    else
                    {
                        snprintf(temp, len, ",\"%s(%d)\"", dbResult[index], curId);
                    }
                    count++;
                    buffer_append_string(b, temp);
                    free(temp);
                }*/
                //printf( "index:%d, name:%s, value:%s\n", index, dbResult[j], dbResult[index] );
                ++index;
            }
        }
        buffer_append_string(b, "]}");
    }else
    {
        printf(stderr, "SQL error: %s\n", errmsg);
        sqlite3_free(errmsg);
    }
    sqlite3_free_table ( dbResult );
    sqlite3_close(db);

    return 1;

}

static int handle_deltone(buffer *b, const struct message *m)
{
    int x, len;
    char hdr[64] = "";
    const char *file = NULL;
    char *path = NULL;
    char val[256] = "";
    int done = 0;
    

    for (x = 0; x < 10000; x++) {
        snprintf(hdr, sizeof(hdr), "file-%04d", x);
        file = msg_get_header(m, hdr);
        if (file == NULL)
        {
            break;
        }
        memset(val, 0, sizeof(val));
        strncpy(val, file, sizeof(val) - 1);
        uri_decode(val);

        len = strlen(RINGTONE_PATH) + strlen(val) + 4;
        path = malloc(len);
        snprintf(path, len, "%s/%s", RINGTONE_PATH, val);
        if( access(path, 0) == 0 )
        {
            unlink(path);
            done = 1;
        }
        free(path);
    }

    if (done)
    {
        buffer_append_string(b, "Response=Success\r\n");
    }
    else
    {
        buffer_append_string(b, "Response=Error\r\nMessage=File not exist");
    }

    return 1;
}

void sha1_vector(size_t num_elem, const u8 *addr[], const size_t *len, u8 *mac);

/**
 * hmac_sha1_vector - HMAC-SHA1 over data vector (RFC 2104)
 * @key: Key for HMAC operations
 * @key_len: Length of the key in bytes
 * @num_elem: Number of elements in the data vector
 * @addr: Pointers to the data areas
 * @len: Lengths of the data blocks
 * @mac: Buffer for the hash (20 bytes)
 */
void hmac_sha1_vector(const u8 *key, size_t key_len, size_t num_elem,
		      const u8 *addr[], const size_t *len, u8 *mac)
{
	unsigned char k_pad[64]; /* padding - key XORd with ipad/opad */
	unsigned char tk[20];
	const u8 *_addr[6];
	size_t _len[6], i;

	if (num_elem > 5) {
		/*
		 * Fixed limit on the number of fragments to avoid having to
		 * allocate memory (which could fail).
		 */
		return;
	}

        /* if key is longer than 64 bytes reset it to key = SHA1(key) */
        if (key_len > 64) {
		sha1_vector(1, &key, &key_len, tk);
		key = tk;
		key_len = 20;
        }

	/* the HMAC_SHA1 transform looks like:
	 *
	 * SHA1(K XOR opad, SHA1(K XOR ipad, text))
	 *
	 * where K is an n byte key
	 * ipad is the byte 0x36 repeated 64 times
	 * opad is the byte 0x5c repeated 64 times
	 * and text is the data being protected */

	/* start out by storing key in ipad */
	memset(k_pad, 0, sizeof(k_pad));
	memcpy(k_pad, key, key_len);
	/* XOR key with ipad values */
	for (i = 0; i < 64; i++)
		k_pad[i] ^= 0x36;

	/* perform inner SHA1 */
	_addr[0] = k_pad;
	_len[0] = 64;
	for (i = 0; i < num_elem; i++) {
		_addr[i + 1] = addr[i];
		_len[i + 1] = len[i];
	}
	sha1_vector(1 + num_elem, _addr, _len, mac);

	memset(k_pad, 0, sizeof(k_pad));
	memcpy(k_pad, key, key_len);
	/* XOR key with opad values */
	for (i = 0; i < 64; i++)
		k_pad[i] ^= 0x5c;

	/* perform outer SHA1 */
	_addr[0] = k_pad;
	_len[0] = 64;
	_addr[1] = mac;
	_len[1] = SHA1_MAC_LEN;
	sha1_vector(2, _addr, _len, mac);
}


/**
 * hmac_sha1 - HMAC-SHA1 over data buffer (RFC 2104)
 * @key: Key for HMAC operations
 * @key_len: Length of the key in bytes
 * @data: Pointers to the data area
 * @data_len: Length of the data area
 * @mac: Buffer for the hash (20 bytes)
 */
void hmac_sha1(const u8 *key, size_t key_len, const u8 *data, size_t data_len,
	       u8 *mac)
{
	hmac_sha1_vector(key, key_len, 1, &data, &data_len, mac);
}

static void pbkdf2_sha1_f(const char *passphrase, const char *ssid,
			  size_t ssid_len, int iterations, unsigned int count,
			  u8 *digest)
{
	unsigned char tmp[SHA1_MAC_LEN], tmp2[SHA1_MAC_LEN];
	int i, j;
	unsigned char count_buf[4];
	const u8 *addr[2];
	size_t len[2];
	size_t passphrase_len = strlen(passphrase);

	addr[0] = (u8 *) ssid;
	len[0] = ssid_len;
	addr[1] = count_buf;
	len[1] = 4;

	/* F(P, S, c, i) = U1 xor U2 xor ... Uc
	 * U1 = PRF(P, S || i)
	 * U2 = PRF(P, U1)
	 * Uc = PRF(P, Uc-1)
	 */

	count_buf[0] = (count >> 24) & 0xff;
	count_buf[1] = (count >> 16) & 0xff;
	count_buf[2] = (count >> 8) & 0xff;
	count_buf[3] = count & 0xff;
	hmac_sha1_vector((u8 *) passphrase, passphrase_len, 2, addr, len, tmp);
	memcpy(digest, tmp, SHA1_MAC_LEN);

	for (i = 1; i < iterations; i++) {
		hmac_sha1((u8 *) passphrase, passphrase_len, tmp, SHA1_MAC_LEN,
			  tmp2);
		memcpy(tmp, tmp2, SHA1_MAC_LEN);
		for (j = 0; j < SHA1_MAC_LEN; j++)
			digest[j] ^= tmp2[j];
	}
}


/**
 * pbkdf2_sha1 - SHA1-based key derivation function (PBKDF2) for IEEE 802.11i
 * @passphrase: ASCII passphrase
 * @ssid: SSID
 * @ssid_len: SSID length in bytes
 * @iterations: Number of iterations to run
 * @buf: Buffer for the generated key
 * @buflen: Length of the buffer in bytes
 *
 * This function is used to derive PSK for WPA-PSK. For this protocol,
 * iterations is set to 4096 and buflen to 32. This function is described in
 * IEEE Std 802.11-2004, Clause H.4. The main construction is from PKCS#5 v2.0.
 */
void pbkdf2_sha1(const char *passphrase, const char *ssid, size_t ssid_len,
		 int iterations, u8 *buf, size_t buflen)
{
	unsigned int count = 0;
	unsigned char *pos = buf;
	size_t left = buflen, plen;
	unsigned char digest[SHA1_MAC_LEN];

	while (left > 0) {
		count++;
		pbkdf2_sha1_f(passphrase, ssid, ssid_len, iterations, count,
			      digest);
		plen = left > SHA1_MAC_LEN ? SHA1_MAC_LEN : left;
		memcpy(pos, digest, plen);
		pos += plen;
		left -= plen;
	}
}


#ifdef INTERNAL_SHA1

struct SHA1Context {
	u32 state[5];
	u32 count[2];
	unsigned char buffers[64];
};

typedef struct SHA1Context SHA1_CTX;

static void SHA1Transform(u32 state[5], const unsigned char buffers[64]);


/**
 * sha1_vector - SHA-1 hash for data vector
 * @num_elem: Number of elements in the data vector
 * @addr: Pointers to the data areas
 * @len: Lengths of the data blocks
 * @mac: Buffer for the hash
 */
void sha1_vector(size_t num_elem, const u8 *addr[], const size_t *len,
		 u8 *mac)
{
	SHA1_CTX ctx;
	size_t i;

	SHA1Init(&ctx);
	for (i = 0; i < num_elem; i++)
		SHA1Update(&ctx, addr[i], len[i]);
	SHA1Final(mac, &ctx);
}


/* ===== start - public domain SHA1 implementation ===== */

/*
SHA-1 in C
By Steve Reid <sreid@sea-to-sky.net>
100% Public Domain

-----------------
Modified 7/98 
By James H. Brown <jbrown@burgoyne.com>
Still 100% Public Domain

Corrected a problem which generated improper hash values on 16 bit machines
Routine SHA1Update changed from
	void SHA1Update(SHA1_CTX* context, unsigned char* data, unsigned int
len)
to
	void SHA1Update(SHA1_CTX* context, unsigned char* data, unsigned
long len)

The 'len' parameter was declared an int which works fine on 32 bit machines.
However, on 16 bit machines an int is too small for the shifts being done
against
it.  This caused the hash function to generate incorrect values if len was
greater than 8191 (8K - 1) due to the 'len << 3' on line 3 of SHA1Update().

Since the file IO in main() reads 16K at a time, any file 8K or larger would
be guaranteed to generate the wrong hash (e.g. Test Vector #3, a million
"a"s).

I also changed the declaration of variables i & j in SHA1Update to 
unsigned long from unsigned int for the same reason.

These changes should make no difference to any 32 bit implementations since
an
int and a long are the same size in those environments.

--
I also corrected a few compiler warnings generated by Borland C.
1. Added #include <process.h> for exit() prototype
2. Removed unused variable 'j' in SHA1Final
3. Changed exit(0) to return(0) at end of main.

ALL changes I made can be located by searching for comments containing 'JHB'
-----------------
Modified 8/98
By Steve Reid <sreid@sea-to-sky.net>
Still 100% public domain

1- Removed #include <process.h> and used return() instead of exit()
2- Fixed overwriting of finalcount in SHA1Final() (discovered by Chris Hall)
3- Changed email address from steve@edmweb.com to sreid@sea-to-sky.net

-----------------
Modified 4/01
By Saul Kravitz <Saul.Kravitz@celera.com>
Still 100% PD
Modified to run on Compaq Alpha hardware.  

-----------------
Modified 4/01
By Jouni Malinen <j@w1.fi>
Minor changes to match the coding style used in Dynamics.

Modified September 24, 2004
By Jouni Malinen <j@w1.fi>
Fixed alignment issue in SHA1Transform when SHA1HANDSOFF is defined.

*/

/*
Test Vectors (from FIPS PUB 180-1)
"abc"
  A9993E36 4706816A BA3E2571 7850C26C 9CD0D89D
"abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"
  84983E44 1C3BD26E BAAE4AA1 F95129E5 E54670F1
A million repetitions of "a"
  34AA973C D4C4DAA4 F61EEB2B DBAD2731 6534016F
*/

#define SHA1HANDSOFF

#define rol(value, bits) (((value) << (bits)) | ((value) >> (32 - (bits))))

/* blk0() and blk() perform the initial expand. */
/* I got the idea of expanding during the round function from SSLeay */
#ifndef WORDS_BIGENDIAN
#define blk0(i) (block->l[i] = (rol(block->l[i], 24) & 0xFF00FF00) | \
	(rol(block->l[i], 8) & 0x00FF00FF))
#else
#define blk0(i) block->l[i]
#endif
#define blk(i) (block->l[i & 15] = rol(block->l[(i + 13) & 15] ^ \
	block->l[(i + 8) & 15] ^ block->l[(i + 2) & 15] ^ block->l[i & 15], 1))

/* (R0+R1), R2, R3, R4 are the different operations used in SHA1 */
#define R0(v,w,x,y,z,i) \
	z += ((w & (x ^ y)) ^ y) + blk0(i) + 0x5A827999 + rol(v, 5); \
	w = rol(w, 30);
#define R1(v,w,x,y,z,i) \
	z += ((w & (x ^ y)) ^ y) + blk(i) + 0x5A827999 + rol(v, 5); \
	w = rol(w, 30);
#define R2(v,w,x,y,z,i) \
	z += (w ^ x ^ y) + blk(i) + 0x6ED9EBA1 + rol(v, 5); w = rol(w, 30);
#define R3(v,w,x,y,z,i) \
	z += (((w | x) & y) | (w & x)) + blk(i) + 0x8F1BBCDC + rol(v, 5); \
	w = rol(w, 30);
#define R4(v,w,x,y,z,i) \
	z += (w ^ x ^ y) + blk(i) + 0xCA62C1D6 + rol(v, 5); \
	w=rol(w, 30);

/* Hash a single 512-bit block. This is the core of the algorithm. */

static void SHA1Transform(u32 state[5], const unsigned char buffers[64])
{
	u32 a, b, c, d, e;
	typedef union {
		unsigned char c[64];
		u32 l[16];
	} CHAR64LONG16;
	CHAR64LONG16* block;
#ifdef SHA1HANDSOFF
	u32 workspace[16];
	block = (CHAR64LONG16 *) workspace;
	memcpy(block, buffers, 64);
#else
	block = (CHAR64LONG16 *) buffers;
#endif
	/* Copy context->state[] to working vars */
	a = state[0];
	b = state[1];
	c = state[2];
	d = state[3];
	e = state[4];
	/* 4 rounds of 20 operations each. Loop unrolled. */
	R0(a,b,c,d,e, 0); R0(e,a,b,c,d, 1); R0(d,e,a,b,c, 2); R0(c,d,e,a,b, 3);
	R0(b,c,d,e,a, 4); R0(a,b,c,d,e, 5); R0(e,a,b,c,d, 6); R0(d,e,a,b,c, 7);
	R0(c,d,e,a,b, 8); R0(b,c,d,e,a, 9); R0(a,b,c,d,e,10); R0(e,a,b,c,d,11);
	R0(d,e,a,b,c,12); R0(c,d,e,a,b,13); R0(b,c,d,e,a,14); R0(a,b,c,d,e,15);
	R1(e,a,b,c,d,16); R1(d,e,a,b,c,17); R1(c,d,e,a,b,18); R1(b,c,d,e,a,19);
	R2(a,b,c,d,e,20); R2(e,a,b,c,d,21); R2(d,e,a,b,c,22); R2(c,d,e,a,b,23);
	R2(b,c,d,e,a,24); R2(a,b,c,d,e,25); R2(e,a,b,c,d,26); R2(d,e,a,b,c,27);
	R2(c,d,e,a,b,28); R2(b,c,d,e,a,29); R2(a,b,c,d,e,30); R2(e,a,b,c,d,31);
	R2(d,e,a,b,c,32); R2(c,d,e,a,b,33); R2(b,c,d,e,a,34); R2(a,b,c,d,e,35);
	R2(e,a,b,c,d,36); R2(d,e,a,b,c,37); R2(c,d,e,a,b,38); R2(b,c,d,e,a,39);
	R3(a,b,c,d,e,40); R3(e,a,b,c,d,41); R3(d,e,a,b,c,42); R3(c,d,e,a,b,43);
	R3(b,c,d,e,a,44); R3(a,b,c,d,e,45); R3(e,a,b,c,d,46); R3(d,e,a,b,c,47);
	R3(c,d,e,a,b,48); R3(b,c,d,e,a,49); R3(a,b,c,d,e,50); R3(e,a,b,c,d,51);
	R3(d,e,a,b,c,52); R3(c,d,e,a,b,53); R3(b,c,d,e,a,54); R3(a,b,c,d,e,55);
	R3(e,a,b,c,d,56); R3(d,e,a,b,c,57); R3(c,d,e,a,b,58); R3(b,c,d,e,a,59);
	R4(a,b,c,d,e,60); R4(e,a,b,c,d,61); R4(d,e,a,b,c,62); R4(c,d,e,a,b,63);
	R4(b,c,d,e,a,64); R4(a,b,c,d,e,65); R4(e,a,b,c,d,66); R4(d,e,a,b,c,67);
	R4(c,d,e,a,b,68); R4(b,c,d,e,a,69); R4(a,b,c,d,e,70); R4(e,a,b,c,d,71);
	R4(d,e,a,b,c,72); R4(c,d,e,a,b,73); R4(b,c,d,e,a,74); R4(a,b,c,d,e,75);
	R4(e,a,b,c,d,76); R4(d,e,a,b,c,77); R4(c,d,e,a,b,78); R4(b,c,d,e,a,79);
	/* Add the working vars back into context.state[] */
	state[0] += a;
	state[1] += b;
	state[2] += c;
	state[3] += d;
	state[4] += e;
	/* Wipe variables */
	a = b = c = d = e = 0;
#ifdef SHA1HANDSOFF
	memset(block, 0, 64);
#endif
}


/* SHA1Init - Initialize new context */

void SHA1Init(SHA1_CTX* context)
{
	/* SHA1 initialization constants */
	context->state[0] = 0x67452301;
	context->state[1] = 0xEFCDAB89;
	context->state[2] = 0x98BADCFE;
	context->state[3] = 0x10325476;
	context->state[4] = 0xC3D2E1F0;
	context->count[0] = context->count[1] = 0;
}


/* Run your data through this. */

void SHA1Update(SHA1_CTX* context, const void *_data, u32 len)
{
	u32 i, j;
	const unsigned char *data = _data;

#ifdef VERBOSE
	SHAPrintContext(context, "before");
#endif
	j = (context->count[0] >> 3) & 63;
	if ((context->count[0] += len << 3) < (len << 3))
		context->count[1]++;
	context->count[1] += (len >> 29);
	if ((j + len) > 63) {
		memcpy(&context->buffers[j], data, (i = 64-j));
		SHA1Transform(context->state, context->buffers);
		for ( ; i + 63 < len; i += 64) {
			SHA1Transform(context->state, &data[i]);
		}
		j = 0;
	}
	else i = 0;
	memcpy(&context->buffers[j], &data[i], len - i);
#ifdef VERBOSE
	SHAPrintContext(context, "after ");
#endif
}


/* Add padding and return the message digest. */

void SHA1Final(unsigned char digest[20], SHA1_CTX* context)
{
	u32 i;
	unsigned char finalcount[8];

	for (i = 0; i < 8; i++) {
		finalcount[i] = (unsigned char)
			((context->count[(i >= 4 ? 0 : 1)] >>
			  ((3-(i & 3)) * 8) ) & 255);  /* Endian independent */
	}
	SHA1Update(context, (unsigned char *) "\200", 1);
	while ((context->count[0] & 504) != 448) {
		SHA1Update(context, (unsigned char *) "\0", 1);
	}
	SHA1Update(context, finalcount, 8);  /* Should cause a SHA1Transform()
					      */
	for (i = 0; i < 20; i++) {
		digest[i] = (unsigned char)
			((context->state[i >> 2] >> ((3 - (i & 3)) * 8)) &
			 255);
	}
	/* Wipe variables */
	i = 0;
	memset(context->buffers, 0, 64);
	memset(context->state, 0, 20);
	memset(context->count, 0, 8);
	memset(finalcount, 0, 8);
}

/* ===== end - public domain SHA1 implementation ===== */

#endif /* INTERNAL_SHA1 */
/*
static int handle_sysconfig_acct(xmlDocPtr doc, xmlNodePtr root_node, buffer *b)
{
    xmlNodePtr cur_node = NULL, child_node = NULL, son2_node = NULL;
    xmlChar *key = NULL;
    char res[256] = "";
    int i = 1;
    
    if (root_node == NULL)
    {
        return -1;
    }

    buffer_append_string(b, "Response=Success\r\n");

    cur_node = root_node->xmlChildrenNode;
    while (cur_node != NULL)
    {
        if (!xmlStrcmp(cur_node->name, BAD_CAST "account"))
        {
            son2_node = cur_node->xmlChildrenNode;
            while (son2_node != NULL)
            {
                if ( (!xmlStrcmp(son2_node->name, BAD_CAST "account1"))
                    || (!xmlStrcmp(son2_node->name, BAD_CAST "account2"))
                    || (!xmlStrcmp(son2_node->name, BAD_CAST "account3")))
                {
                    if( !xmlStrcmp(son2_node->name, BAD_CAST "account1") )
                    {
                        i = 1;
                    }else if( !xmlStrcmp(son2_node->name, BAD_CAST "account2") )
                    {
                        i = 2;
                    }else if( !xmlStrcmp(son2_node->name, BAD_CAST "account3") )
                    {
                        i = 3;
                    }
                    child_node = son2_node->xmlChildrenNode;
                    while (child_node != NULL)
                    {
                        if (!xmlStrcmp(child_node->name, BAD_CAST "isHide"))
                        {
                            key = xmlNodeListGetString(doc, child_node->xmlChildrenNode, 1);
                            if (key == NULL)
                            {
                                snprintf(res, sizeof(res), "hide%d=\r\n", i);
                                buffer_append_string(b, res);
                            }
                            else
                            {
                                snprintf(res, sizeof(res), "hide%d=%s\r\n", i, (char *) key);
                                buffer_append_string(b, res);
                                xmlFree(key);
                            }
                        }else if (!xmlStrcmp(child_node->name, BAD_CAST "isLock"))
                        {
                            key = xmlNodeListGetString(doc, child_node->xmlChildrenNode, 1);
                            if (key == NULL)
                            {
                                snprintf(res, sizeof(res), "lock%d=\r\n", i);
                                buffer_append_string(b, res);
                            }
                            else
                            {
                                snprintf(res, sizeof(res), "lock%d=%s\r\n", i, (char *) key);
                                buffer_append_string(b, res);
                                xmlFree(key);
                            }
                        }
                        child_node = child_node->next;
                    }
                }
                son2_node = son2_node->next;
            }
        }
        cur_node = cur_node->next;
    }
    return 1;
}

static int handle_sysconfig_upgrade(xmlDocPtr doc, xmlNodePtr root_node, buffer *b)
{
    xmlNodePtr cur_node = NULL, child_node = NULL, son2_node = NULL;
    xmlChar *key = NULL;
    char res[128] = "";
    
    if (root_node == NULL)
    {
        return -1;
    }

    buffer_append_string(b, "Response=Success\r\n");

    cur_node = root_node->xmlChildrenNode;
    while (cur_node != NULL)
    {
        if (!xmlStrcmp(cur_node->name, BAD_CAST "maitenance"))
        {
            son2_node = cur_node->xmlChildrenNode;
            while (son2_node != NULL)
            {
                if (!xmlStrcmp(son2_node->name, BAD_CAST "factoryReset"))
                {
                    child_node = son2_node->xmlChildrenNode;
                    while (child_node != NULL)
                    {
                        if (!xmlStrcmp(child_node->name, BAD_CAST "isHide"))
                        {
                            key = xmlNodeListGetString(doc, child_node->xmlChildrenNode, 1);
                            if (key == NULL)
                            {
                                buffer_append_string(b, "hidereset=\r\n");
                            }
                            else
                            {
                                snprintf(res, sizeof(res), "hidereset=%s\r\n", (char *) key);
                                buffer_append_string(b, res);
                                xmlFree(key);
                            }
                        }else if (!xmlStrcmp(child_node->name, BAD_CAST "isLock"))
                        {
                            key = xmlNodeListGetString(doc, child_node->xmlChildrenNode, 1);
                            if (key == NULL)
                            {
                                buffer_append_string(b, "lockreset=\r\n");
                            }
                            else
                            {
                                snprintf(res, sizeof(res), "lockreset=%s\r\n", (char *) key);
                                buffer_append_string(b, res);
                                xmlFree(key);
                            }
                        }
                        child_node = child_node->next;
                    }
                }
                else if (!xmlStrcmp(son2_node->name, BAD_CAST "upgradePara"))
                {
                    child_node = son2_node->xmlChildrenNode;
                    while (child_node != NULL)
                    {
                        if (!xmlStrcmp(child_node->name, BAD_CAST "isHide"))
                        {
                            key = xmlNodeListGetString(doc, child_node->xmlChildrenNode, 1);
                            if (key == NULL)
                            {
                                buffer_append_string(b, "hidefirm=\r\n");
                            }
                            else
                            {
                                snprintf(res, sizeof(res), "hidefirm=%s\r\n", (char *) key);
                                buffer_append_string(b, res);
                                xmlFree(key);
                            }
                        }else if (!xmlStrcmp(child_node->name, BAD_CAST "isLock"))
                        {
                            key = xmlNodeListGetString(doc, child_node->xmlChildrenNode, 1);
                            if (key == NULL)
                            {
                                buffer_append_string(b, "lockfirm=\r\n");
                            }
                            else
                            {
                                snprintf(res, sizeof(res), "lockfirm=%s\r\n", (char *) key);
                                buffer_append_string(b, res);
                                xmlFree(key);
                            }
                        }
                        child_node = child_node->next;
                    }
                }
                son2_node = son2_node->next;
            }
        }
        cur_node = cur_node->next;
    }
    return 1;
}

static int handle_sysconfig(buffer *b, const struct message *m)
{        
    xmlDocPtr doc = NULL;
    xmlNode *cur_node = NULL;
    const char *temp = NULL;

    doc = xmlReadFile(SYS_CONFIG_FILE, NULL, 0);
 
    if (doc == NULL) 
    {
        printf("error: could not parse file %s\n", SYS_CONFIG_FILE);
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Configuration File Not Found\r\n");
        return -1;
    }
    
    cur_node = xmlDocGetRootElement(doc);
    
    cur_node = cur_node->xmlChildrenNode;
    while (cur_node != NULL)
    {
        if (!xmlStrcmp(cur_node->name, BAD_CAST "option"))
        {
            printf("option\n");
            temp = msg_get_header(m, "systype");
            if(temp != NULL)
            {
                if(strcmp(temp,SYS_CONFIG_ACCT) == 0)
                {
                    handle_sysconfig_acct(doc, cur_node, b);
                }
                else if(strcmp(temp,SYS_CONFIG_UPGRADE) == 0)
                {
                    handle_sysconfig_upgrade(doc, cur_node, b);
                }
            }
        }
        cur_node = cur_node->next;
    }

    xmlFreeDoc(doc);
    return 1;

}
*/

static int handle_getPhoneStatus(buffer *b, const struct message *m)
{
    const char *funcname = NULL;
    char *cmdstr = NULL;
    char *statusresult = NULL;

    funcname = msg_get_header(m, "funcname");
    if( funcname != NULL )
    {
        system("chmod +x /bin/pidof");
        cmdstr = malloc(strlen(funcname)+32);
        sprintf(cmdstr, "pidof %s > /tmp/gmitmp &", funcname);
        printf("cmdstr is %s\n", cmdstr);
        int result = mysystem(cmdstr);
        sleep(1);
        if(result == 0)
        {
            FILE *pid_file;
            pid_file = fopen ("/tmp/gmitmp", "r");

            if (pid_file != NULL) {
                char buf[32] = "";
                fread (buf, 32, 1, pid_file);
                fclose (pid_file);
                int pid = atoi(buf);
                if( pid != 0 )
                {
                    printf("pid is %s\n", buf);
                    sprintf(cmdstr, "cat /proc/%d/stat > /tmp/gmitmp2&", pid);
                    printf("cmdstr is %s\n", cmdstr);
                    int result2 = system(cmdstr);
                    sleep(1);
                    if( result2 == 0 )
                    {
                        FILE *stat_file;
                        stat_file = fopen ("/tmp/gmitmp2", "r");
                        if (stat_file != NULL)
                        {
                            char buf2[128] = "";
                            fread (buf2, 128, 1, stat_file);
                            fclose (stat_file);
                            printf("status buf is %s\n", buf2);
                            char *p = buf2;
                            strsep(&p, " ");
                            printf("%s\n", p);
                            strsep(&p, " ");
                            printf("%s\n", p);
                            statusresult = strsep(&p, " ");
                            printf("statusresult is %s\n", statusresult);
                            printf("%s\n", p);
                        } 
                    }
                    remove("/tmp/gmitmp2");
                 }
            }
        }
        free(cmdstr);
        remove("/tmp/gmitmp");
    }

    funcname = msg_get_header(m, "format");
    const char * jsonCallback = NULL;
    if((funcname != NULL) && !strcasecmp(funcname, "json"))
    {
        jsonCallback = msg_get_header( m, "jsoncallback" );
    }

    if(jsonCallback != NULL)
    {
        cmdstr = malloc((strlen(jsonCallback) + 32) * sizeof(char));

        if( cmdstr != NULL && statusresult != NULL )
        {
            sprintf(cmdstr, "%s(%s)", jsonCallback, statusresult);
        }else
        {
            sprintf(cmdstr, "%s(%s)", jsonCallback, "Unknown");
        }
        buffer_append_string (b, cmdstr);
        free(cmdstr);
    }
    else
    {
        if( statusresult != NULL )
        {
            buffer_append_string(b, statusresult);
        }
        else
        {
            buffer_append_string(b, "Unknown");
        }
    }
    return 0;
}


static int handle_getGmiVersion(server *srv, connection *con,buffer *b, const struct message *m)
{
char *gversion = NULL;


#ifndef BUILD_ARM
    gversion = nvram_get("gmi_version");
#else
    gversion = "Unknown";
#endif
    const char *resType = NULL;
    char * temp = NULL;
      char res[128] = "";
    resType = msg_get_header(m, "format");
    if (resType != NULL && !strcasecmp(resType, "json")) {
        snprintf( res, sizeof(res)-1,"%s: \"%s\"}", "{\"res\" : \"success\", \"msg\" ", gversion );
        temp = build_JSON_formate( srv, con, m, res );
        buffer_append_string(b,temp);
    }else{
        buffer_append_string(b, gversion);
    }

    return 1;
}

#endif

#ifndef BUILD_RECOVER
char *generate_file_name(buffer *b, const struct message *m)
{
    const char *type = NULL;
    char *file_name = NULL;
    char *temp = NULL;

    type = msg_get_header(m, "type");
    if (type == NULL)
    {
        buffer_append_string(b, "Response=Error\r\nMessage=Missing Type\r\n");
    }
    else
    {
        if( access(DATA_DIR, 0) ) {
            mkdir(DATA_DIR, 0755);
        }
        if( access(VPN_PATH, 0) )
        {
            mkdir(VPN_PATH, 0755);
        }
        if( access(DIR_802MODE, 0) )
        {
            mkdir(DIR_802MODE, 0755);
        }
        if( access(PATH_802MODE, 0) )
        {
            mkdir(PATH_802MODE, 0755);
        }
        if (!strcasecmp(type, "ca"))
        {
            file_name = strdup(VPN_PATH"/ca.crt");
        }
        else if (!strcasecmp(type, "cert")) 
        {
            file_name = strdup(VPN_PATH"/gxv3140.crt");
        }
        else if (!strcasecmp(type, "802ca"))
        {
            file_name = strdup(PATH_802MODE"/ca.pem");
        }
        else if (!strcasecmp(type, "802client"))
        {
            file_name = strdup(PATH_802MODE"/client.pem");
        }
        else if (!strcasecmp(type, "802privatekey"))
        {
            file_name = strdup(PATH_802MODE"/user.prv");
        }
        else if (!strcasecmp(type, "key"))
        {
            file_name = strdup(VPN_PATH"/gxv3140.key");
        }
        else if (!strcasecmp(type, "g3conf"))
        {
            if( access(DATA_PPP, 0) )
            {
                mkdir(DATA_PPP, 0755);
            }
            file_name = strdup(DATA_PPP"/3g");
        }
        else if (!strcasecmp(type, "g3script"))
        {
            if( access(DATA_PPP, 0) )
            {
                mkdir(DATA_PPP, 0755);
            }
            file_name = strdup(DATA_PPP"/chat-3g");
        }
        else if (!strcasecmp(type, "phonebook")) //modified by jlxu, upload phonebook savepath
        {
            if ( access(TMP_PHONEBOOKPATH, 0) )
            {
                mkdir(TMP_PHONEBOOKPATH, 0777);
            }
            file_name = strdup(TMP_PHONEBOOKPATH"/phonebook.xml");
            //file_name = strdup(TEMP_PATH"/phonebook_import");
        }
        else if (!strcasecmp(type, "upgradefile"))
        {
            if( m_upgradeall ){
                file_name = strdup(TMP_FULL_UPGRADE_PATH);
            }else
                file_name = strdup(FIFO_PATH);
        }
        else if (!strcasecmp(type, "vericert"))
        {
            file_name = strdup(TMP_CERT_PATH);
        }
        else if (!strcasecmp(type, "importlan"))
        {
            file_name = strdup(DATA_DIR"/import_language");
        }
        else if (!strcasecmp(type, "importcfg"))
        {
            file_name = strdup(DATA_DIR"/import_config.txt");
        }
        else if (!strcasecmp(type, "ringtone"))
        {
            temp = (char *)msg_get_header(m, "name");
            if (temp == NULL)
            {
                /*snprintf(res, sizeof(res), "Response=Error\r\nMessage=Name Required\r\n");
                buffer_append_string(b, res);
                free(res);*/
                file_name = strdup(TEMP_PATH"/ringtone.mp3");
            }
            else
            {
                char *val = malloc(strlen(temp) + 32);
                memset(val, 0, strlen(temp) + 32);
                strncpy(val, temp, strlen(temp));
                uri_decode(val);
                file_name = malloc(strlen(val)+32);
                sprintf(file_name, RINGTONE_PATH"/%s", val);
                free(val);
            }
        }
        else if (!strcasecmp(type, "frameca"))
        {
            if( access(PATH_FRAME_CERT, 0) )
            {
                mkdir(PATH_FRAME_CERT, 0755);
            }
            file_name = strdup(PATH_FRAME_CERT"/framecomp.crt");
        }
        else if (!strcasecmp(type, "audiofile")) //move from 2200
        {
            char *cmd;
            char *curacct = msg_get_header(m, "acct");

            /* filepath: /user_data/moh/account.../  */
            char *filepath = malloc(64);
            sprintf(filepath, TMP_AUDIOFILEPATH"%s", curacct);

            //if (access(TMP_AUDIOFILEPATH, 0))
            if (access(filepath, 0))
            {
                cmd = malloc(strlen(filepath) + 32);
                memset(cmd, 0, sizeof(cmd));
                sprintf(cmd, "mkdir -p %s", filepath);
                mysystem(cmd);

                memset(cmd, 0, sizeof(cmd));
                sprintf(cmd, "chmod 777 %s", filepath);
                mysystem(cmd);
                free(cmd);
                //mkdir(TMP_AUDIOFILEPATH, 0777);
            }

            /* the entire filename is /user_data/moh/account.../audiofile */
            file_name = malloc(64);
            sprintf(file_name, "%s/audiofile", filepath);
            //sprintf(file_name, TMP_AUDIOFILEPATH"/audiofile.%s", ext);
            free(filepath);
        }
        else
        {
            buffer_append_string(b, "Response=Error\r\nMessage=Unknow Type\r\n");
        }
    }

    return file_name;
}
#else
char *generate_file_name_recover(buffer *b, const struct message *m)
{
    const char *type = NULL;
    char* file_name = NULL;
    char res[128] ="";

    type = msg_get_header(m, "type");
    if (type == NULL)
    {
        snprintf(res, sizeof(res), "Response=Error\r\nMessage=Missing Type\r\n");
        buffer_append_string(b, res);
    }
    else
    {
        file_name = malloc(32);
        if (!strcasecmp(type, "recoverall"))
        {
            snprintf(file_name, 32, "/tmp/recoverall");
        }
        else if (!strcasecmp(type, "recoverboot"))
        {
            snprintf(file_name, 32, "/tmp/recoverboot");
        }
        else if (!strcasecmp(type, "recovercore"))
        {
            snprintf(file_name, 32, TEMP_PATH"/recovercore");
        }
        else if (!strcasecmp(type, "recoverbase"))
        {
            snprintf(file_name, 32, TEMP_PATH"/recoverbase");
        }
        else if (!strcasecmp(type, "recoverprogram"))
        {
            snprintf(file_name, 32, TEMP_PATH"/recoverprogram");
        }
        else if (!strcasecmp(type, "recoverguia"))
        {
            snprintf(file_name, 32, TEMP_PATH"/recoverguia");
        }
        else if (!strcasecmp(type, "recoverguib"))
        {
            snprintf(file_name, 32, TEMP_PATH"/recoverguib");
        }
        else if (!strcasecmp(type, "recoversupp"))
        {
            snprintf(file_name, 32, TEMP_PATH"/recoversupp");
        }
        else
        {
            snprintf(res, sizeof(res), "Response=Error\r\nMessage=Unknow Type\r\n");
            buffer_append_string(b, res);
        }
    }

    printf("genetate file name is %s>>>>>>>>>>>>>>>>>>>>>",file_name);
    return file_name;
}

static int handle_startrecover(buffer *b, const struct message *m)
{
        char res[80] = "";
        int result = 1;
        const char *type = NULL;
        const char *typenum = NULL;
        type = msg_get_header(m, "recovername");
        typenum = msg_get_header(m, "recovernum");
        if(type == NULL || typenum == NULL)
            return 0;
        printf("type typenum is %s-----%s------\r\n", type, typenum);
        snprintf(res, sizeof(res), "load_firmware %s %s", type, typenum);
        result = mysystem(res);
        //printf("exec result is %d-----------\r\n",result);
        if(result != 0)
            snprintf(res, sizeof(res), "Response=Error\r\n");
        else
            snprintf(res, sizeof(res), "Response=Success\r\n");
	buffer_append_string(b, res);
	return 0;
}

static int handle_recoverresult(buffer *b)
{
    char res[80] = "";  
    char buf[80] = "";
    FILE *log_file;
    
    log_file = fopen ("/tmp/log", "r");
    
    if (log_file != NULL) {
        fread (buf, 127, 1, log_file);
        fclose (log_file);

        buffer_append_string (b, "Response=Success\r\n");
        snprintf(res, sizeof(res), "Message=%s\r\n", buf);
        buffer_append_string (b, res);
        printf("res lenght is %d", strlen(res));
        return 1;
    } else {
        buffer_append_string (b, "Response=Error\r\n");
        return -1;
    }
}

static int handle_recoverreset (buffer *b)
{
    int result = 1;

    result = system("swap_erase");
    if(result != 0)
        buffer_append_string(b, "Response=Error\r\n");
    else
        buffer_append_string(b, "Response=Success\r\n");

    return 0;
}

static int handle_recoverversion(buffer *b)
{
    char res[80] = "";
    const char *val = NULL;

#ifdef BUILD_ON_ARM
    val = nvram_my_get("89");
#else
    val = " ";
#endif

    buffer_append_string (b, "Response=Success\r\n");
    snprintf(res, sizeof(res), "version=%s\r\n", val);
    buffer_append_string (b, res);
    return -1;
}
#endif

#ifndef BUILD_RECOVER
static int handle_getgroup(server *srv, connection *con,
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *gpID = NULL;
    char *temp = NULL;
    char *info = NULL;
    xmlDocPtr doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    xmlNodePtr son_node = NULL;
    xmlChar *key = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if( access( TMP_PHONEBOOKPATH, 0 ) )
    {
        mkdir(TMP_PHONEBOOKPATH, 0777);
    }

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "getGroup" );

    printf("handle_getgroup\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        gpID = msg_get_header(m, "groupID");

        if ( gpID == NULL )
        {
            gpID = "";
        }
      
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                if (strcmp("/sdcard/phonebook/groups.xml", res) == 0) {
                    doc = xmlReadFile(res, NULL, 0);

                    if (doc == NULL)
                    {
                        temp = "{\"res\": \"error\", \"msg\": \"can't get groups information\"}";
                        temp = build_JSON_formate( srv, con, m, temp );
                        if ( temp != NULL )
                        {
                            buffer_append_string( b, temp );
                            free(temp);
                        }

                        dbus_message_unref( reply );
                        dbus_message_unref( message );
                        return -1;
                    }

                    /*Get the root element node */
                    root_element = xmlDocGetRootElement(doc);

                    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
                    {
                        if (cur_node->type == XML_ELEMENT_NODE)
                        {
                            son_node = cur_node;

                            while (son_node != NULL)
                            {
                                if ((!xmlStrcmp(son_node->name, (const xmlChar *)"body")))
                                {
                                    key = xmlNodeListGetString(doc, son_node->xmlChildrenNode, 1);
                                    if (key != NULL)
                                    {
                                        info = (char*)malloc(1 + strlen((char*)key));
                                        sprintf(info, "%s", key);
                                        temp = info;
                                        xmlFree(key);
                                        break;
                                    } 
                                    else 
                                    {
                                        temp = "{\"res\": \"error\", \"msg\": \"can't get groups information\"}";
                                    }
                                }
                            }
                        }
                    }

                    xmlFreeDoc(doc);
                }
                else 
                {
                    info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                    sprintf(info, "%s", res);
                    temp = info;
                }
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get groups information\"}";
            }

            temp = build_JSON_formate( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}
static int handle_getcontact(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 10000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *ctID = NULL;
    const char *gpID = NULL;
    const char *ctName = NULL;
    char *temp = NULL;
    char *info = NULL;
    xmlDocPtr doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    xmlNodePtr son_node = NULL;
    xmlChar *key = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if( access( TMP_PHONEBOOKPATH, 0 ) )
    {
        mkdir(TMP_PHONEBOOKPATH, 0777);
    }

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "getContact" );

    printf("handle_getcontact\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        ctID = msg_get_header(m, "contactID");

        if ( ctID == NULL )
        {
            ctID = "";
        }

        gpID = msg_get_header(m, "groupID");

        if ( gpID == NULL )
        {
            gpID = "";
        }

        ctName = msg_get_header(m, "contactName");

        if ( ctName == NULL )
        {
            ctName = "";
        }
      
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &ctID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &ctName ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                if (strcmp("/sdcard/phonebook/contacts.xml", res) == 0) {
                    doc = xmlReadFile(res, NULL, 0);

                    if (doc == NULL)
                    {
                        temp = "{\"res\": \"error\", \"msg\": \"can't get contacts information\"}";
                        temp = build_JSON_formate( srv, con, m, temp );
                        if ( temp != NULL )
                        {
                            buffer_append_string( b, temp );
                            free(temp);
                        }

                        dbus_message_unref( reply );
                        dbus_message_unref( message );
                        return -1;
                    }

                    /*Get the root element node */
                    root_element = xmlDocGetRootElement(doc);

                    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
                    {
                        if (cur_node->type == XML_ELEMENT_NODE)
                        {
                            son_node = cur_node;

                            while (son_node != NULL)
                            {
                                if ((!xmlStrcmp(son_node->name, (const xmlChar *)"body")))
                                {
                                    key = xmlNodeListGetString(doc, son_node->xmlChildrenNode, 1);
                                    if (key != NULL)
                                    {
                                        info = (char*)malloc(1 + strlen(key));
                                        sprintf(info, "%s", key);
                                        temp = info;
                                        xmlFree(key);
                                        break;
                                    } 
                                    else 
                                    {
                                        temp = "{\"res\": \"error\", \"msg\": \"can't get contacts information\"}";
                                    }
                                }
                            }
                        }
                    }

                    xmlFreeDoc(doc);
                }
                else 
                {
                    info = (char*)malloc((1+ strlen(res)) * sizeof(char));
                    sprintf(info, "%s", res);
                    temp = info;
                }
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get contacts information\"}";
            }

            temp = build_JSON_formate( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_getgroupcount(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "getGroupCount" );

    printf("handle_getgroupcount\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get group count\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_getcontactcount(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "getContactCount" );

    printf("handle_getcontactcount\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get contact count\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }

            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

void urldecode(char *p)
{
    register int i=0;

    while(*(p+i))
    {
        if ((*p=*(p+i)) == '%')
        {
            *p=*(p+i+1) >= 'A' ? ((*(p+i+1) & 0XDF) - 'A') + 10 : (*(p+i+1) - '0');
            *p=(*p) * 16;
            *p+=*(p+i+2) >= 'A' ? ((*(p+i+2) & 0XDF) - 'A') + 10 : (*(p+i+2) - '0');
            i+=2;
        }
        else if (*(p+i)=='+')
        {
            *p=' ';
        }

        p++;
    }

    *p='\0';
}

static int handle_setgroup(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *gpInfo = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setGroup" );

    printf("handle_setgroup\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        gpInfo = msg_get_header(m, "groupInfo");

        if ( gpInfo == NULL )
        {
            gpInfo = "";
        }
        else
        {
            uri_decode( (char*)gpInfo );
        }
    
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpInfo ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
       
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't set group\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_updategroupmembership(server *srv, connection *con,
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 60000*5;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *gpID = NULL;
    const char *contactids = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "updateGroupMemberShip" );

    printf("handle_updategroupmembership\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        gpID = msg_get_header(m, "id");

        if ( gpID == NULL )
        {
            gpID = "";
        }
        contactids = msg_get_header(m, "contactids");
        if ( contactids == NULL )
        {
            contactids = "";
        }else{
            uri_decode((char*)contactids);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &contactids) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't edit group member\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_setcontact(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 10000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *ctInfo = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setContact" );

    printf("handle_setcontact\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        ctInfo = msg_get_header(m, "contactInfo");

        if ( ctInfo == NULL )
        {
            ctInfo = "";
        }
        else
        {
            uri_decode( (char*)ctInfo );
        }
      
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &ctInfo ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't set contact\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_removecontact(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 60000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *ctID = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "removeContact" );

    printf("handle_removecontact\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        ctID = msg_get_header(m, "contactID");

        if ( ctID == NULL )
        {
            ctID = "";
        }
      
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &ctID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't remove contact\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_renameconference(server *srv, connection *con,
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *gpID = NULL;
    const char *newname = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "renameConference" );

    printf("handle_renameconference \n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        gpID = msg_get_header(m, "id");

        if ( gpID == NULL )
        {
            gpID = "";
        }

        newname = msg_get_header(m, "name");
        if ( newname == NULL )
        {
            newname = "";
        }else{
            uri_decode((char*)newname);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &newname) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't edit conference member\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_setconference(server *srv, connection *con,
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *gpID = NULL;
    const char *confname = NULL;
    const char *names = NULL;
    const char *numbers = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setConference" );

    printf("handle_setconference");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        gpID = msg_get_header(m, "id");
        if ( gpID == NULL )
        {
            gpID = "";
        }

        confname = msg_get_header(m, "confname");
        if ( confname == NULL )
        {
            confname = "";
        }else{
            uri_decode((char*)confname);
        }

        names = msg_get_header(m, "membernames");
        if ( names == NULL )
        {
            names = "";
        }else{
            uri_decode((char*)names);
        }

        numbers = msg_get_header(m, "membernumbers");
        if ( numbers == NULL )
        {
            numbers = "";
        }else{
            uri_decode((char*)numbers);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &confname ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &names) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &numbers) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't set conference\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_updateconferencemembership(server *srv, connection *con,
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *gpID = NULL;
    const char *names = NULL;
    const char *numbers = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "updateConferenceMemberShip" );

    printf("handle_updateconferencemembership\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        gpID = msg_get_header(m, "id");

        if ( gpID == NULL )
        {
            gpID = "";
        }
        names = msg_get_header(m, "names");
        if ( names == NULL )
        {
            names = "";
        }else{
            uri_decode((char*)names);
        }

        numbers = msg_get_header(m, "numbers");
        if ( numbers == NULL )
        {
            numbers = "";
        }else{
            uri_decode((char*)numbers);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &names) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &numbers) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't edit conference member\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_notify_schedule_change(buffer *b, const struct message *m)
{
    const char *action = NULL;
    const char *scheduleId = NULL;

    action = msg_get_header(m, "type");
    scheduleId = msg_get_header(m, "scheduleId");
    if( action != NULL && scheduleId != NULL ){
        uri_decode((char*)scheduleId);
        char *cmd = NULL;
        cmd = malloc(128);
        memset(cmd, 0, 128);
        snprintf(cmd, 128, "am broadcast -a com.base.module.schedule.UPDATE_SCHEDULE --ei \"action\" \"%s\" --es \"schedule_id\" %s", action, scheduleId);
        printf("cmd = %s\n", cmd);
        int result = mysystem(cmd);
        if( result )
            buffer_append_string(b, "Response=Error\r\n");
        else
            buffer_append_string(b, "Response=Success\r\n");
    }else{
        buffer_append_string(b, "Response=Error\r\n");
    }
    return 1;
}

static int handle_googleschedule_status(buffer *b, const struct message *m)
{
    char *sqlstr = NULL;
    char *scheid = NULL, *status = NULL;
    
    status = msg_get_header(m, "status");

    if(status != NULL){
        if( !strcasecmp(status, "") ){
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            return -1;
        }
        
        int updatelen = 128;
        scheid = msg_get_header(m, "scheid");
        if( scheid != NULL ){
            sqlstr = malloc(updatelen);
            memset(sqlstr, 0, updatelen);
            snprintf(sqlstr, updatelen, "update group_contacts set state=%s where group_id=%s", status, scheid);
        }
        else{
            buffer_append_string(b, "{\"Response\":\"Error\"}");
            return -1;
        }
                
        sqlite3 *db;
        int rc;
        char * errmsg = NULL;
        int result = 1;

        printf("sql str is --- %s\n", sqlstr);
        rc = sqlite3_open("/data/data/com.base.module.schedule/databases/conference.db", &db);
        if( rc ){
            printf("Can't open database: %s\n", sqlite3_errmsg(db));
            fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
            sqlite3_close(db);
            return -1;
        }
        
        rc = sqlite3_exec(db, sqlstr, 0, 0, &errmsg);
        if( rc ){
            printf("Can't open statement: %s\n", sqlite3_errmsg(db));
            fprintf(stderr, "Can't open statement: %s\n", sqlite3_errmsg(db));
            buffer_append_string(b,"{\"Response\":\"Error\"}");
            sqlite3_close(db);
            return -1;
        }
        
        char *returnstr = NULL;
        returnstr = malloc(updatelen);
        memset(returnstr, 0, updatelen);
        snprintf(returnstr, updatelen, "{\"Response\":\"Success\", \"Scheid\":\"%s\",\"Operation\":\"%s\"}", scheid, status);
        buffer_append_string(b, returnstr);
    }
    else{
        buffer_append_string(b, "{\"Response\":\"Error\"}");
        return -1;
    }
}

static int handle_updateschedule(server *srv, connection *con, buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *gpID = NULL;
    const char *schname = NULL;
    const char *host = NULL;
    const char *duration = NULL;
    const char *start_time = NULL;
    const char *milliseconds = NULL;
    const char *dndkey = NULL;
    const char *repeatRule = NULL;
    const char *membername = NULL;
    const char *membernum = NULL, *memberacct = NULL, *memberemail = NULL;
    const char *preset = NULL;
    const char *tmp = NULL;
    int reminder = 0;
    int dnd = 0, repeat = 0;
    int autoanswer = 0;
    char *temp = NULL;
    char *info = NULL;
    char *recordfrom = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setSchedule" );
    
    printf("handle_updateschedule type = %d\n", type);
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        gpID = msg_get_header(m, "id");
        if ( gpID == NULL )
        {
            gpID = "";
        }

        duration = msg_get_header(m, "duration");
        if ( duration == NULL )
        {
            duration = "";
        }

        schname = msg_get_header(m, "confname");
        if ( schname == NULL )
        {
            schname = "";
        }else{
            uri_decode( (char*)schname );
        }

        host = msg_get_header(m, "host");
        if ( host == NULL )
        {
            host = "";
        }else{
            uri_decode( (char*)host );
        }

        start_time = msg_get_header(m, "start_time");
        if ( start_time == NULL )
        {
            start_time = "";
        }else{
            uri_decode( (char*)start_time );
        }

        milliseconds = msg_get_header(m, "milliseconds");
        if ( milliseconds == NULL )
        {
            milliseconds = "";
        }else{
            uri_decode( (char*)milliseconds );
        }

        tmp = msg_get_header(m, "reminder");
        if ( tmp != NULL)
        {
            if(!strcasecmp(tmp, "1"))
            {
                reminder = 1;
            }
            else
            {
                reminder = 0;
            }
        }

        tmp = msg_get_header(m, "autoanswer");
        if ( tmp != NULL)
        {
            if(!strcasecmp(tmp, "1"))
            {
                autoanswer = 1;
            }
            else
            {
                autoanswer = 0;
            }
        }

        tmp = msg_get_header(m, "schedulednd");
        if ( tmp != NULL)
        {
            if(!strcasecmp(tmp, "1"))
            {
                dnd = 1;
            }
            else
            {
                dnd = 0;
            }
        }

        dndkey = msg_get_header(m, "pincode");
        if ( dndkey == NULL )
        {
            dndkey = "";
        }
        else{
            uri_decode((char*)dndkey);
        }

        membername = msg_get_header(m, "membernames");
        if ( membername == NULL )
        {
            membername = "";
        }
        else{
            uri_decode((char*)membername);
        }

        membernum = msg_get_header(m, "membernumbers");
        if ( membernum == NULL )
        {
            membernum = "";
        }
        else{
            uri_decode((char*)membernum);
        }

        memberacct = msg_get_header(m, "memberaccts");
        if ( memberacct == NULL )
        {
            memberacct = "";
        }
        else{
            uri_decode((char*)memberacct);
        }

        memberemail = msg_get_header(m, "memberemails");
        if ( memberemail == NULL )
        {
            memberemail = "";
        }
        else{
            uri_decode((char*)memberemail);
        }


        tmp = msg_get_header(m, "repeat");
        if ( tmp != NULL)
        {
            repeat = atoi(tmp);
        }

        repeatRule = msg_get_header(m, "repeatRule");
        if ( repeatRule == NULL )
        {
            repeatRule = "";
        }
        else{
            uri_decode((char*)repeatRule);
        }

        recordfrom = msg_get_header(m, "recordsfrom");
        if(recordfrom == NULL)
        {
            recordfrom = "";
        }
        
        preset = msg_get_header(m, "preset");
        if ( preset == NULL )
        {
            preset = "";
        }
        else{
            uri_decode((char*)preset);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &schname) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &host) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &start_time) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &milliseconds) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &duration) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }   

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &reminder) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &autoanswer) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &dnd) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &dndkey) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &repeat) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &repeatRule) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &membername) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &membernum) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &memberacct) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &memberemail) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &recordfrom) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &preset) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't edit conference member\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_updatecaption(server *srv, connection *con, buffer *b, const struct message *m, int uptype)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *gpID = NULL;
    const char *tname = NULL;
    const char *content = NULL;
    const char *chartype = NULL;
    int cptype = 0;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    if( uptype == 0 )
        message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "addCaption" );
    else
        message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "updateCaption" );

    printf("handle_updatecaption uptype = %d\n", uptype);
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        gpID = msg_get_header(m, "id");
        if ( gpID == NULL )
        {
            gpID = "";
        }

        chartype = msg_get_header(m, "type");
        if ( chartype == NULL )
        {
            cptype = 0;
        }else{
            cptype = atoi(chartype);
        }

        tname = msg_get_header(m, "name");
        if ( tname == NULL )
        {
            tname = "";
        }else{
            uri_decode((char*)tname);
        }

        content = msg_get_header(m, "content");
        if ( content == NULL )
        {
            content = "";
        }else{
            uri_decode((char*)content);
        }

        if( uptype != 0 ){
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpID ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
        }
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &cptype ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &tname ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &content ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't clear group\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_operatecaption(server *srv, connection *con, buffer *b, const struct message *m, int uptype)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *content = NULL;
    const char *chartype = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    if( uptype == 0 )
        message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "previewCaption" );
    else if( uptype == 1 )
        message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "stopCaption" );
    else if( uptype == 2 )
        message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "shareCaption" );

    printf("handle_updatecaption uptype = %d\n", uptype);
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        chartype = msg_get_header(m, "type");
        if ( chartype == NULL )
        {
            chartype = "";
        }

        content = msg_get_header(m, "content");
        if ( content == NULL )
        {
            content = "";
        }else{
            uri_decode((char*)content);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &chartype ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
        if( uptype != 1 ){
            if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &content ) )
            {
                printf( "Out of Memory!\n" );
                exit( 1 );
            }
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't operate caption\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_cleargroup(server *srv, connection *con,
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *gpID = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "clearGroup" );

    printf("handle_cleargroup\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        gpID = msg_get_header(m, "groupID");

        if ( gpID == NULL )
        {
            gpID = "";
        }
      
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't clear group\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_clearallcallhistory(server *srv, connection *con,
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "clearAllCallHistory" );

    printf("handle_clearallcallhistory\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't clear all call history\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }

            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_removegroup(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 15000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *gpID = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "removeGroup" );

    printf("handle_removegroup\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        gpID = msg_get_header(m, "groupID");

        if ( gpID == NULL )
        {
            gpID = "";
        }
      
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &gpID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't remove group\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_movetodefault(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *ctID = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "moveToDefault" );

    printf("handle_movetodefault\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        ctID = msg_get_header(m, "contactID");

        if ( ctID == NULL )
        {
            ctID = "";
        }
      
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &ctID ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't move contact to default\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_webservice_by_one_param(server *srv, connection *con, buffer *b, const struct message *m, char *paraname, char *method, int decode)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *param = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, method );

    printf("handle_webservice_by_one_param, param = %s, method = %s\n", paraname, method);
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        param = msg_get_header(m, paraname);

        if ( param == NULL )
        {
            param = "";
        }else if( decode ){
            uri_decode((char*)param);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &param ) )
        {
            printf( "Out of Memory when %s!\n", method );
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n", error.name, error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't get result\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_webservice_by_two_string_param(server *srv, connection *con, buffer *b, const struct message *m, char *parafirestname,char *parasecondname, char *method)
{
#ifdef BUILD_ON_ARM
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    const char *param1 = NULL;
    const char *param2 = NULL;
    char *info = NULL;

    param1 = msg_get_header(m, parafirestname);
    if ( param1 == NULL ) {
        return -1;
    } else {
        uri_decode((char*)param1);
    }

    param2 = msg_get_header(m, parasecondname);
    if ( param2 == NULL ) {
        return -1;
    } else {
        uri_decode((char*)param2);
    }

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);
    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    fprintf(stderr, "handle_callservice_by_two_param\n");
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, method );

    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &param1 ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &param2 ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        //dbus_message_iter_append_basic(&iter,DBUS_TYPE_INVALID);
        dbus_message_append_args( message,  DBUS_TYPE_INVALID );

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );
        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1+ strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
                if( !strcasecmp(method, "setDateInfo") ){
                    time_t now;
                    time(&now);
                    sessiontimeout = now + WEB_TIMEOUT;
                }
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"can't accept call\"}";
            }

            temp = build_JSON_formate( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }
#endif
    return 0;
}

static int audio_conversion_new (char *infile, char *outfile, int step)
{
    char * cmd;

    cmd = malloc(128);
    memset(cmd, 0, sizeof(cmd));

    if (step == 0)
        sprintf(cmd, "/system/bin/sox %s -r 8000 -c 1 %s bass -3", infile, outfile);
    else
        sprintf(cmd, "/system/bin/sox %s %s", infile, outfile);
    mysystem(cmd);

    free(cmd);

    return 0;
}

/* conver the audiofile to alaw and ulaw format ,move from 2200 by ahluo on 20140319 */
static int handle_converaudio (buffer *b, const struct message *m)
{
    /* file_ext: extension of the audio file
       acct: the acct number
       filepath: path store the audio file
       infile: the whole name of audio file
       outfile: the whole name of outfile, filepath+ulaw, filepath+alaw
       cmd: system call string
       res_al, res_ul: the return of calling the sox conversion interfaces
    */
    char *file_ext = NULL, *acct = NULL, *filepath = NULL, *infile = NULL, *outfile_al = NULL, *outfile_ul = NULL, *cmd = NULL;
    //int res, res_al, res_ul;
    FILE *fp = NULL;

    file_ext = msg_get_header(m, "ext");
    acct  = msg_get_header(m, "acct");

    filepath = malloc(64);
    sprintf(filepath, TMP_AUDIOFILEPATH"%s", acct);

    /* change the name of audiofile("audiofile") to the one with extension,
       the sox funcions require */
    cmd = malloc(strlen(filepath)*2 + 32);
    memset(cmd, 0, sizeof(cmd));
    sprintf(cmd, "mv %s/audiofile %s/audiofile.%s", filepath, filepath, file_ext);
    mysystem(cmd);

    infile = malloc(strlen(file_ext) + 64);
    memset(infile, 0, sizeof(infile));
    sprintf(infile, "%s/audiofile.%s", filepath, file_ext);

    /*if (!strcmp(file_ext, "mp3"))
    {
        infile_wav = malloc(strlen(file_ext) + 64);
        memset(infile_wav, 0, sizeof(infile_wav));
        sprintf(infile_wav, "%s/audiofile.wav", filepath);

        res = audio_conversion (infile, infile_wav);
        if(res == -1)
        {
            memset(cmd, 0, sizeof(cmd));
            sprintf(cmd, "rm %s/\*", filepath);
            mysystem(cmd);
            free(cmd);
            free(infile);
            free(infile_wav);
            buffer_append_string(b,
                "Response=Error\r\n");
            printf("read audiofile failed\n");
            return -1;
        }
    }*/

    /*
    infile_temp = malloc(strlen(file_ext) + 64);
    memset(infile_temp, 0, sizeof(infile_temp));
    sprintf(infile_temp, "%s/audiofile_temp.wav", filepath);

    if (infile_wav != NULL)
        res = audio_conversion_rate (infile_wav, infile_temp);
    else
        res = audio_conversion_rate (infile, infile_temp);

    if(res == -1)
    {
        memset(cmd, 0, sizeof(cmd));
        sprintf(cmd, "rm %s/\", filepath);
        mysystem(cmd);
        free(cmd);
        free(infile);
        free(infile_temp);
        if(infile_wav != NULL)
            free(infile_wav);
        buffer_append_string(b,
            "Response=Error\r\n");
        printf("read audiofile failed2\n");
        return -1;
    } */

    outfile_al = malloc(strlen(filepath) + 32);
    memset(outfile_al, 0, sizeof(outfile_al));
    sprintf(outfile_al, "%s/audiofile.al", filepath);
    /* call sox functions. conver the audiofile to alaw format */
    //res_al = audio_conversion(infile_temp, outfile);
    audio_conversion_new (infile, outfile_al, 0);

    fp = fopen (outfile_al, "rb");
    if(fp != NULL)
    {
        fclose(fp);
        /* cmd string : mv .../audiofile.al .../alaw */
        /*memset(cmd, 0, sizeof(cmd));
        sprintf(cmd, "mv %s/audiofile.al %s/alaw", filepath, filepath);
        mysystem(cmd);
        res_al = 0;*/

        outfile_ul = malloc(strlen(filepath) + 32);
        memset(outfile_ul, 0, sizeof(outfile_ul));
        sprintf(outfile_ul, "%s/audiofile.ul", filepath);

        audio_conversion_new (outfile_al, outfile_ul, 1);
    }
    else
    {
        memset(cmd, 0, sizeof(cmd));
        sprintf(cmd, "rm %s/*", filepath);
        mysystem(cmd);
        free(cmd);
        free(infile);
        free(outfile_al);
        buffer_append_string(b,
            "Response=Error\r\n");
        printf("read audiofile failed\n");
        return -1;
    }

    /*
    memset(infile, 0, sizeof(infile));
    sprintf(infile, "%s/audiofile.%s", filepath, file_ext);*/


    //memset(outfile, 0, sizeof(outfile));
    //sprintf(outfile, "%s/audiofile.ul", filepath);
    /* call sox functions. conver the audiofile to ulaw format */
    //res_ul = audio_conversion(infile_temp, outfile);
    //audio_conversion_new (infile, outfile);

    /*fp = fopen (outfile, "rb");
    if(fp != NULL)
    {
        fclose(fp);
        memset(cmd, 0, sizeof(cmd));
        sprintf(cmd, "mv %s/audiofile.ul %s/ulaw", filepath, filepath);
        mysystem(cmd);
        res_ul = 0;
    } else
        res_ul = -1;*/

    memset(cmd, 0, sizeof(cmd));
    sprintf(cmd, "mv %s/audiofile.al %s/alaw", filepath, filepath);
    mysystem(cmd);

    memset(cmd, 0, sizeof(cmd));
    sprintf(cmd, "mv %s/audiofile.ul %s/ulaw", filepath, filepath);
    mysystem(cmd);

    /* delete the audiofile */
    memset(cmd, 0, sizeof(cmd));
    sprintf(cmd, "rm %s", infile);
    mysystem(cmd);

    /*
    memset(cmd, 0, sizeof(cmd));
    sprintf(cmd, "rm %s", infile_temp);
    mysystem(cmd);*/

    /*
    if(infile_wav != NULL)
    {
        memset(cmd, 0, sizeof(cmd));
        sprintf(cmd, "rm %s", infile_wav);
        mysystem(cmd);
        free(infile_wav);
    }*/

    free(cmd);

    buffer_append_string(b,
        "Response=Success\r\n");

    free(filepath);
    free(infile);
    //free(infile_temp);
    free(outfile_al);
    free(outfile_ul);
    return 0;
}

static int handle_savephbkconf (buffer *b, const struct message *m,const char*fileconf)
{
    xmlDocPtr doc = NULL;
    xmlNode *root_element = NULL;
    xmlNode *cur_node = NULL;
    const char *temp = NULL;
    char val[256] = "";
    xmlNodePtr son_node = NULL;
    xmlNodePtr son2_node = NULL;
    char tempbuf[8] = "";
    int tempint;

    doc = xmlReadFile(fileconf, NULL, 0);

    if (doc == NULL)
    {
        printf("error: could not parse file %s\n", fileconf);
        buffer_append_string(b, "Response=Error\r\n"
                "Message=Configuration File Not Found\r\n");
        return -1;
    }

    /*Get the root element node */
    root_element = xmlDocGetRootElement(doc);

    for (cur_node = root_element->xmlChildrenNode; cur_node; cur_node = cur_node->next)
    {
        if (cur_node->type == XML_ELEMENT_NODE)
        {
            //if ((!xmlStrcmp(cur_node->name, BAD_CAST "popular")))
                son_node = cur_node;

                while (son_node != NULL)
                {
                    if ((!xmlStrcmp(son_node->name, (const xmlChar *)"Download")))
                    {
                        son2_node = son_node ->xmlChildrenNode;

                        while (son2_node != NULL)
                        {
                            if (!xmlStrcmp(son2_node->name, (const xmlChar *)"downloadMode"))
                            {
                                temp = msg_get_header(m, "mode");
                                if ( temp != NULL )
                                {
                                    memset(val, 0, sizeof(val));
                                    strncpy(val, temp, sizeof(val) - 1);
                                    uri_decode(val);
                                    xmlNodeSetEncodeContent(doc, son2_node, (xmlChar *)val);
                                }
                            }
                            else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"url"))
                            {
                                temp = msg_get_header(m, "url");
                                if ( temp != NULL )
                                {
                                    memset(val, 0, sizeof(val));
                                    strncpy(val, temp, sizeof(val) - 1);
                                    uri_decode(val);
                                    xmlNodeSetEncodeContent(doc, son2_node, (xmlChar *)val);
                                }
                            }
                            else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"replaceDup"))
                            {
                                temp = msg_get_header(m, "redup");
                                if ( temp != NULL )
                                {
                                    memset(val, 0, sizeof(val));
                                    strncpy(val, temp, sizeof(val) - 1);
                                    uri_decode(val);
                                    xmlNodeSetEncodeContent(doc, son2_node, (xmlChar *)val);
                                }
                            }
                            else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"clearOld"))
                            {
                                temp = msg_get_header(m, "clearold");
                                if ( temp != NULL )
                                {
                                    memset(val, 0, sizeof(val));
                                    strncpy(val, temp, sizeof(val) - 1);
                                    uri_decode(val);
                                    xmlNodeSetEncodeContent(doc, son2_node, (xmlChar *)val);
                                }
                            }else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"interval"))
                            {
                                temp = msg_get_header(m, "interval");
                                if ( temp != NULL )
                                {
                                    memset(val, 0, sizeof(val));
                                    strncpy(val, temp, sizeof(val) - 1);
                                    uri_decode(val);
                                    tempint = atoi(val);
                                    if (tempint < 0)
                                    {
                                        tempint = 0;
                                    }
                                    else if (tempint > 720)
                                    {
                                        tempint = 720;
                                    }
                                    sprintf( tempbuf, "%d", tempint );
                                    xmlNodeSetEncodeContent(doc, son2_node, (xmlChar *)tempbuf);
                                }
                            }
                            else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"fileType"))
                            {
                                temp = msg_get_header(m, "fileType");
                                if ( temp != NULL )
                                {
                                    memset(val, 0, sizeof(val));
                                    strncpy(val, temp, sizeof(val) - 1);
                                    uri_decode(val);
                                    xmlNodeSetEncodeContent(doc, son2_node, (xmlChar *)val);
                                }
                            }
                            else if (!xmlStrcmp(son2_node->name, (const xmlChar *)"encoding"))
                            {
                                temp = msg_get_header(m, "encode");
                                if ( temp != NULL )
                                {
                                    memset(val, 0, sizeof(val));
                                    strncpy(val, temp, sizeof(val) - 1);
                                    uri_decode(val);
                                    xmlNodeSetEncodeContent(doc, son2_node, (xmlChar *)val);
                                }
                            }
                            son2_node = son2_node->next;
                        }
                    }
                    son_node = son_node->next;
                }
        }
    }

    xmlSaveFormatFileEnc(fileconf, doc, "UTF-8", 1);
    xmlFreeDoc(doc);
    xmlCleanupParser();
    xmlMemoryDump();
    sync();

    return 1;
}

static int handle_setPhonebookAddr(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    char *temp = NULL;

    if(handle_savephbkconf(b,m,CONF_PHBKDOWNLOAD) == -1)
    {
        temp = "{\"res\": \"error\", \"msg\": \"save phonebook configure failed\"}";
        temp = build_JSON_res( srv, con, m, temp );

        if ( temp != NULL )
        {
            buffer_append_string( b, temp );
            free(temp);
        }

        return -1;
    }
    else 
    {
        dbus_send_lighttpd( SIGNAL_LIGHTTPD_PHBKDOWNLOADSAVE);
    }

    temp = "{\"res\": \"success\", \"msg\": \"save phonebook configure\"}";
    temp = build_JSON_res( srv, con, m, temp );

    if ( temp != NULL )
    {
        buffer_append_string( b, temp );
        free(temp);
    }
   
    return 1;
}

static int handle_importPhonebook(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    char *temp = NULL;

    if(handle_savephbkconf(b,m,CONF_PHBKDOWNLOAD) == -1)
    {
        temp = "{\"res\": \"error\", \"msg\": \"save phonebook configure failed\"}";
        temp = build_JSON_res( srv, con, m, temp );

        if ( temp != NULL )
        {
            buffer_append_string( b, temp );
            free(temp);
        }

        return -1;
    }
    else 
    {
        dbus_send_lighttpd( SIGNAL_LIGHTTPD_PHBKDOWN);
    }
   
    temp = "{\"res\": \"success\", \"msg\": \"download phonebook\"}";
    temp = build_JSON_res( srv, con, m, temp );

    if ( temp != NULL )
    {
        buffer_append_string( b, temp );
        free(temp);
    }

    return 1;
}

static int handle_upgrade(buffer *b, const struct message *m)
{
    if(0 == handle_put(b, m))
    {
#ifdef BUILD_ON_ARM
        system("provision.sh &");
#endif
    }

    return 0;
}
/*static int handle_putwifiwpapsk(buffer *b, const struct message *m)
{
    char hdr[72] = "";
    char buf[32] = {0};
    unsigned char sha1_key[32] = {0};
    char sha1_hex_key[65] = {0};
    const char *tempval= NULL, *essid_tmp = NULL;

    buffer_append_string(b, "Response=Success\r\n");

    essid_tmp = msg_get_header(m, "essid");
    tempval = msg_get_header(m, "7830");
    if(essid_tmp != NULL && tempval != NULL)
    {
        pbkdf2_sha1(tempval,  essid_tmp != NULL ? essid_tmp : "",
        essid_tmp != NULL ? strlen(essid_tmp) : strlen(""), 4096, sha1_key, 32);
        for (int i = 0; i < 32; i++)
        {
            snprintf(buf, 3, "%02x", sha1_key[i]);
            strcat(sha1_hex_key, buf);
        }
        snprintf(hdr, sizeof(hdr), "7829=%s\n", sha1_hex_key);
        FILE *file_fd = NULL;
        if( access(TEMP_PVALUES, 0) )
        {
            file_fd = fopen(TEMP_PVALUES, "w+");
        }else
        {
            file_fd = fopen(TEMP_PVALUES, "a+");
        }

        if (file_fd != NULL)
        {
            fwrite(hdr, 1, strlen(hdr), file_fd);
            fclose(file_fd);
        }
    }

    return 0;
}

static int dbus_send_wifi_changed()
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_WIFI_CHANGED);
    if ( message == NULL )
    {
        printf( "Error: Dbus bus is NULL\n" );
        return 1;
    }


    printf("Send wifi changed");
    dbus_message_append_args( message, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_connection_flush( bus );
    dbus_message_unref( message );
#endif

    return 0;
}

static int handle_wifisave (buffer *b)
{
    system("netc up ra0");
    buffer_append_string (b, "Response=Success\r\n");
    dbus_send_wifi_changed();

    return 0;
}

static int dbus_send_wifi_scan()
{
#ifdef BUILD_ON_ARM
    DBusMessage* message;

    if ( bus == NULL )
    {
        printf( "Error: Dbus bus is NULL" );
        return 1;
    }

    message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_WIFI_SCAN);
    if ( message == NULL )
    {
        printf( "message is NULL" );
        return 1;
    }


    printf( "Send wifi_scan" );
    dbus_message_append_args( message, DBUS_TYPE_INVALID );

    dbus_connection_send( bus, message, NULL );
    dbus_connection_flush( bus );
    dbus_message_unref( message );
#endif

    return 0;
}

static int handle_wifiscan (buffer *b)
{
    int i = 0;

    dbus_send_wifi_scan();
    while(1){
        if(wifiscanok){
            if(wifiscanresult != NULL){
                printf("wifiscan strlen wifiscanresult = %d\n", strlen(wifiscanresult) );
                buffer_append_string(b, wifiscanresult);
                free(wifiscanresult);
                wifiscanresult = NULL;
            }
            break;
         }
        else if(i < 10) {
            i ++;
            sleep(2);
            continue;
        }
        else {
            buffer_append_string(b, "Response=Error\r\nMessage=can't get scan result");
            break;
        }
    }

    printf("wifiscan phonerebooting = %d\n", phonerebooting);
    return 0;
}
*/

static int handle_vpnenable(buffer *b)
{
    char res[64] = "";
    const char *val = NULL;

    buffer_append_string(b, "Response=Success\r\n");

#ifdef BUILD_ON_ARM
        val = nvram_my_get("7050");
#else
        val = "Unknow";
#endif
    snprintf(res, sizeof(res),  "7050=%s\r\n", val);
    buffer_append_string(b, res);

    return 0;
}

static int handle_launchservice(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *name = NULL;
    const char *arg = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "launchService" );

    printf("handle_launchservice\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        name = msg_get_header(m, "name");

        if ( name == NULL )
        {
            name = "";
        }

        arg = msg_get_header(m, "arg");

        if ( arg == NULL )
        {
            arg = "";
        }
        else
        {
            uri_decode( (char*)arg );
        }
      
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &name ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &arg ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"open application failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_closeservice(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *name = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "closeService" );

    printf("handle_closeservice\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        name = msg_get_header(m, "name");

        if ( name == NULL )
        {
            name = "";
        }
      
        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &name ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"close application failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_closecurservice(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 3000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "closeCurService" );

    printf("handle_closecurservice\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"close application failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_grabwindow(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char *path = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "grabWindow" );

    printf("handle_grabwindow\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        path = msg_get_header(m, "path");

        if ( path == NULL )
        {
            path = "";
        }
      
        uri_decode((char*)path);

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &path ) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"save grab failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_swipeScreen(server *srv, connection *con,
    buffer *b, const struct message *m)  {
    int start_x;
    int start_y;
    int end_x;
    int end_y;
    const char *tmp = NULL;
    char *temp = NULL;
    tmp = msg_get_header(m, "start_x");
         if ( tmp != NULL )
        {
            start_x = atoi(tmp);
        }
        else
        {
            start_x = -1;
        }

        tmp = msg_get_header(m, "start_y");

        if ( tmp != NULL )
        {
            start_y = atoi(tmp);
        }
        else
        {
            start_y = -1;
        }
         tmp = msg_get_header(m, "end_x");
        if ( tmp != NULL )
       {
           end_x = atoi(tmp);
       }
       else
       {
           end_x = -1;
       }

       tmp = msg_get_header(m, "end_y");

       if ( tmp != NULL )
       {
           end_y = atoi(tmp);
       }
       else
       {
           end_y = -1;
       }

     FILE *sys_file;
     char buf[128] = "";
     sys_file = fopen ("/proc/gxvboard/dev_info/dev_alias", "r");
     int  max_width = 480;
     int  max_height =272;
     if (sys_file != NULL) {
           fread (buf, 127, 1, sys_file);
           fclose (sys_file);
           printf(" product name %s",buf);
           if(strcmp(buf,"GXV3275") == 0){
             max_width=1024;
             max_height=600;
            }
     }
     printf(" screen max_width %d max_height %d",max_width,max_height);
     if(start_x <0 || start_x >max_width || start_y < 0 || start_y >max_height
     || end_x <0 || end_x >max_width || end_y < 0 || end_y >max_height){
       temp = "{\"res\": \"error\", \"msg\": \"the point out of screen\"}";
    }else{
        char command [50] ={0};
        sprintf(command,"input touchscreen swipe %d %d %d %d",start_x,start_y,end_x,end_y);
        printf("%s command1",command);
        int successflag = mysystem(command);
        printf("input touchscreen result flag %d",successflag);
        if(successflag == -1 || successflag == 127){
            temp = "{\"res\": \"error\", \"msg\": \"the point out of screen\"}";
        }else {
            temp = "{\"res\": \"success\"}";
        }
    }

     temp = build_JSON_res( srv, con, m, temp );
      if (temp != NULL )
      {
          buffer_append_string( b, temp );
          free(temp);
      }
   return 0;
}

static int handle_touchscreen(server *srv, connection *con,
    buffer *b, const struct message *m)  {
    int point_x;
    int point_y;
    int msec = 0;
    const char *tmp = NULL;
    char *temp = NULL;
    tmp = msg_get_header(m, "px");
         if ( tmp != NULL )
        {
            point_x = atoi(tmp);
        }
        else
        {
            point_x = -1;
        }

        tmp = msg_get_header(m, "py");

        if ( tmp != NULL )
        {
            point_y = atoi(tmp);
        }
        else
        {
            point_y = -1;
        }

        tmp = msg_get_header(m, "msec");

        if ( tmp != NULL )
        {
            msec = atoi(tmp);
        }
        else
        {
            msec = 0;
        }
     FILE *sys_file;
    char buf[128] = "";
    sys_file = fopen ("/proc/gxvboard/dev_info/dev_alias", "r");
    int  max_width = 480;
    int  max_height =272;
    if (sys_file != NULL) {
        fread (buf, 127, 1, sys_file);
        fclose (sys_file);
        printf(" product name %s",buf);
        if(strcmp(buf,"GXV3275") == 0){
          max_width=1024;
          max_height=600;
        }
    }
    printf(" screen max_width %d max_height %d",max_width,max_height);
    if(point_x <0 || point_x >max_width || point_y < 0 || point_y >max_height){
        temp = "{\"res\": \"error\", \"msg\": \"the point out of screen\"}";
    }else{
        char command [50] ={0};
        sprintf(command,"input touchscreen tap %d %d %d",point_x,point_y,msec);
        printf("%s command",command);
        int successflag = mysystem(command);
        printf("input touchscreen tap reslut %d",successflag);
        if(successflag == -1 || successflag == 127){
            temp = "{\"res\": \"error\", \"msg\": \"the point out of screen\"}";
        }else {
            temp = "{\"res\": \"success\"}";
        }
    }
     temp = build_JSON_res( srv, con, m, temp );

      if ( temp != NULL )
      {
          buffer_append_string( b, temp );
          free(temp);
      }
   return 0;
}

// old touchscreen method (under gmiversion 8)
/*static int handle_touchscreen(server *srv, connection *con,
    buffer *b, const struct message *m)
{


    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    int point_x;
    int point_y;
    int msec = 0;
    const char *tmp = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "touchScreen" );

    printf("handle_touchscreen\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        tmp = msg_get_header(m, "px");

        if ( tmp != NULL )
        {
            point_x = atoi(tmp);
        }
        else
        {
            point_x = -1;
        }

        tmp = msg_get_header(m, "py");

        if ( tmp != NULL )
        {
            point_y = atoi(tmp);
        }
        else
        {
            point_y = -1;
        }

        tmp = msg_get_header(m, "msec");

        if ( tmp != NULL )
        {
            msec = atoi(tmp);
        }
        else
        {
            msec = 0;
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &point_x) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &point_y) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &msec) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"touch screen failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}*/

static int handle_getmessage(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char* tmp = NULL;
    int flag = -1;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "getMessage" );

    printf("handle_getmessage\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        tmp = msg_get_header(m, "id");

        if ( tmp != NULL)
        {
            flag = atoi(tmp);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &flag) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"get message failed\"}";
            }

            temp = build_JSON_formate( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_setnewmessage(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char* tmp = NULL;
    const char* num = NULL;
    const char* account = NULL;
    const char* text = NULL;
    int send = 0;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "setNewMessage" );

    printf("handle_setnewmessage\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        num = msg_get_header(m, "number");

        if ( num == NULL )
        {
            num = "";
        }
      
        account = msg_get_header(m, "account");

        if ( account == NULL )
        {
            account = "";
        }

        text = msg_get_header(m, "content");

        if ( text == NULL )
        {
            text = "";
        }
        else
        {
            uri_decode( (char*)text );
        }

        tmp = msg_get_header(m, "flag");

        if ( tmp != NULL)
        {
            if(!strcasecmp(tmp, "1"))
            {
                send = 1;
            }
            else
            {
                send = 0;
            }
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &num) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &account) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &text) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &send) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"set new message failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_senddraftmessage(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char* id = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "sendDraftMessage" );

    printf("handle_senddraftmessage\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        id = msg_get_header(m, "messageID");

        if ( id == NULL)
        {
            id = "";
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &id) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"send message failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_removemessage(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char* tmp = NULL;
    const char* id = NULL;
    int flag = 0;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "removeMessage" );

    printf("handle_removemessage\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        id = msg_get_header(m, "ID");

        if ( id == NULL )
        {
            id = "";
        }

        tmp = msg_get_header(m, "flag");

        if ( tmp != NULL)
        {
            if(!strcasecmp(tmp, "1"))
            {
                flag = 1;
            }
            else
            {
                flag = 0;
            }
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &id) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &flag) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"remove message failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_savemessage(buffer *b, const struct message *m)
{
    char *path = NULL;
    char *json = NULL;
    char *result = NULL;
    int len = 0;
    int reply_timeout = 10000;
    DBusMessage *message = NULL;
    DBusMessage *reply = NULL;
    DBusBusType type;
    DBusError error;
    DBusConnection *conn = NULL;
    DBusMessageIter iter;
    const char *resType = NULL;
    const char *jsonCallback = NULL;
    char *temp = NULL;

    resType = msg_get_header(m, "format");
    if (resType != NULL && !strcasecmp(resType, "json")) {
        jsonCallback = msg_get_header(m, "jsoncallback");
    }

    if( access( TMP_MESSAGEPATH, 0 ) )
    {
        mkdir(TMP_MESSAGEPATH, 0777);
    }

    path = malloc(strlen(TMP_MESSAGEPATH) + strlen("/message.xml") + 4);
    sprintf(path, "%s/%s", TMP_MESSAGEPATH, "message.xml");

    message = dbus_message_new_method_call(dbus_dest, dbus_path, dbus_interface, "saveMessage");
    printf("handle_savemessage");

    type = DBUS_BUS_SYSTEM;
    dbus_error_init(&error);
    conn = dbus_bus_get(type, &error);
    if (conn == NULL) {
        printf("Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free(&error);
        if (message != NULL) {
            dbus_message_unref(message);
        }
        free(path);

        return -1;
    }

    if (message != NULL) {
        dbus_message_set_auto_start(message, TRUE);
        dbus_message_iter_init_append(message, &iter);

        len = 8 + strlen(path) + strlen(", \"path\": \"\"");
        json = malloc(len * sizeof(char));
        if (json != NULL) {
            snprintf(json, len-1, "{\"path\": \"%s\"}", path);

            if (!dbus_message_iter_append_basic(&iter, DBUS_TYPE_STRING, &json)) {
                printf("Out of Memory!\n");
                free(path);
                free(json);
                exit(1);
            }

            reply = dbus_connection_send_with_reply_and_block(conn, message, reply_timeout, &error);
            if (dbus_error_is_set(&error)) {
                fprintf(stderr, "Error %s: %s\n", error.name, error.message);
            }

            free(json);

            if (reply) {
                print_message(reply);
                int current_type;
                dbus_message_iter_init(reply, &iter);
                
                while((current_type = dbus_message_iter_get_arg_type(&iter)) != DBUS_TYPE_INVALID) {
                    switch(current_type) {
                        case DBUS_TYPE_STRING:
                            dbus_message_iter_get_basic(&iter, &result);
                            break;
                        default:
                            break;
                    }

                    dbus_message_iter_next(&iter);
                }

                if (result != NULL) {
                    if (jsonCallback != NULL) {
                        temp = malloc((strlen(jsonCallback) + strlen(result) + 8) * sizeof(char));
                        if (temp != NULL) {
                            sprintf(temp, "%s(%s)", jsonCallback, result);
                            buffer_append_string(b, temp);
                            free(temp);
                        }
                    } else {
                        buffer_append_string(b, result);
                    }
                }

                dbus_message_unref(reply);
            }
        }

        dbus_message_unref(message);
    }

    free(path);

    return 1;
}

static int handle_getlastcall(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char* tmp = NULL;
    int flag = 0;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "getLastCall" );

    printf("handle_getlastcall\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        tmp = msg_get_header(m, "type");

        if ( tmp != NULL)
        {
            flag = atoi(tmp);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &flag) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"get last call failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_removecall(server *srv, connection *con, 
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char* tmp = NULL;
    const char* id = NULL;
    int flag = 0;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }
                                          
    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "removeCall" );

    printf("handle_removecall\n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        id = msg_get_header(m, "ID");

        if ( id == NULL )
        {
            id = "";
        }

        tmp = msg_get_header(m, "flag");

        if ( tmp != NULL)
        {
            flag = atoi(tmp);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &id) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_INT32, &flag) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }
            
        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;
                            
                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"remove call failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_removecallbynumber(server *srv, connection *con,
    buffer *b, const struct message *m)
{
    DBusMessage* message = NULL;
    DBusError error;
    DBusMessageIter iter;
    DBusBusType type;
    int reply_timeout = 5000;
    DBusMessage *reply = NULL;
    DBusConnection *conn = NULL;
    const char* rtype = NULL;
    const char* number = NULL;
    char *temp = NULL;
    char *info = NULL;

    type = DBUS_BUS_SYSTEM;
    dbus_error_init (&error);
    conn = dbus_bus_get (type, &error);

    if (conn == NULL)
    {
        printf ( "Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free (&error);
        return -1;
    }

    message = dbus_message_new_method_call( dbus_dest, dbus_path, dbus_interface, "removeCallByNumber" );

    printf("handle_removecallbynumber \n");
    if (message != NULL)
    {
        dbus_message_set_auto_start (message, TRUE);
        dbus_message_iter_init_append( message, &iter );

        rtype = msg_get_header(m, "type");
        if ( rtype == NULL )
        {
            rtype = "";
        }

        number = msg_get_header(m, "number");
        if ( number == NULL )
        {
            number = "";
        }else{
            uri_decode((char*)number);
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &rtype) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        if ( !dbus_message_iter_append_basic( &iter, DBUS_TYPE_STRING, &number) )
        {
            printf( "Out of Memory!\n" );
            exit( 1 );
        }

        dbus_error_init( &error );
        reply = dbus_connection_send_with_reply_and_block( conn, message, reply_timeout, &error );

        if ( dbus_error_is_set( &error ) )
        {
            fprintf(stderr, "Error %s: %s\n",
                error.name,
                error.message);
        }

        if ( reply )
        {
            print_message( reply );
            int current_type;
            char *res = NULL;
            dbus_message_iter_init( reply, &iter );

            while ( ( current_type = dbus_message_iter_get_arg_type( &iter ) ) != DBUS_TYPE_INVALID )
            {
                switch ( current_type )
                {
                    case DBUS_TYPE_STRING:
                        dbus_message_iter_get_basic(&iter, &res);
                        break;

                    default:
                        break;
                }

                dbus_message_iter_next (&iter);
            }

            if ( res != NULL )
            {
                info = (char*)malloc((1 + strlen(res)) * sizeof(char));
                sprintf(info, "%s", res);
                temp = info;
            }
            else
            {
                temp = "{\"res\": \"error\", \"msg\": \"remove call by number failed\"}";
            }

            temp = build_JSON_res( srv, con, m, temp );

            if(info != NULL)
            {
                free(info);
            }

            if ( temp != NULL )
            {
                buffer_append_string( b, temp );
                free(temp);
            }
            dbus_message_unref( reply );
        }

        dbus_message_unref( message );
    }

    return 0;
}

static int handle_savecallhistory(buffer *b, const struct message *m)
{
    char *path = NULL;
    char *json = NULL;
    char *result = NULL;
    int len = 0;
    int reply_timeout = 10000;
    DBusMessage *message = NULL;
    DBusMessage *reply = NULL;
    DBusBusType type;
    DBusError error;
    DBusConnection *conn = NULL;
    DBusMessageIter iter;
    const char *resType = NULL;
    const char *jsonCallback = NULL;
    char *temp = NULL;

    resType = msg_get_header(m, "format");
    if (resType != NULL && !strcasecmp(resType, "json")) {
        jsonCallback = msg_get_header(m, "jsoncallback");
    }

    if( access( TMP_CALLHISTORYPATH, 0 ) )
    {
        mkdir(TMP_CALLHISTORYPATH, 0777);
    }

    path = malloc(strlen(TMP_CALLHISTORYPATH) + strlen("/callhistory.xml") + 4);
    sprintf(path, "%s/%s", TMP_CALLHISTORYPATH, "callhistory.xml");

    message = dbus_message_new_method_call(dbus_dest, dbus_path, dbus_interface, "saveCallhistory");
    printf("handle_savemessage");

    type = DBUS_BUS_SYSTEM;
    dbus_error_init(&error);
    conn = dbus_bus_get(type, &error);
    if (conn == NULL) {
        printf("Failed to open connection to %s message bus: %s\n", (type == DBUS_BUS_SYSTEM) ? "system" : "session", error.message);
        dbus_error_free(&error);
        if (message != NULL) {
            dbus_message_unref(message);
        }
        free(path);

        return -1;
    }

    if (message != NULL) {
        dbus_message_set_auto_start(message, TRUE);
        dbus_message_iter_init_append(message, &iter);

        len = 8 + strlen(path) + strlen(", \"path\": \"\"");
        json = malloc(len * sizeof(char));
        if (json != NULL) {
            snprintf(json, len-1, "{\"path\": \"%s\"}", path);

            if (!dbus_message_iter_append_basic(&iter, DBUS_TYPE_STRING, &json)) {
                printf("Out of Memory!\n");
                free(path);
                free(json);
                exit(1);
            }

            reply = dbus_connection_send_with_reply_and_block(conn, message, reply_timeout, &error);
            if (dbus_error_is_set(&error)) {
                fprintf(stderr, "Error %s: %s\n", error.name, error.message);
            }

            free(json);

            if (reply) {
                print_message(reply);
                int current_type;
                dbus_message_iter_init(reply, &iter);
                
                while((current_type = dbus_message_iter_get_arg_type(&iter)) != DBUS_TYPE_INVALID) {
                    switch(current_type) {
                        case DBUS_TYPE_STRING:
                            dbus_message_iter_get_basic(&iter, &result);
                            break;
                        default:
                            break;
                    }

                    dbus_message_iter_next(&iter);
                }

                if (result != NULL) {
                    if (jsonCallback != NULL) {
                        temp = malloc((strlen(jsonCallback) + strlen(result) + 8) * sizeof(char));
                        if (temp != NULL) {
                            sprintf(temp, "%s(%s)", jsonCallback, result);
                            buffer_append_string(b, temp);
                            free(temp);
                        }
                    } else {
                        buffer_append_string(b, result);
                    }
                }

                dbus_message_unref(reply);
            }
        }

        dbus_message_unref(message);
    }

    free(path);

    return 1;
}

#endif

static int handle_setheadsettype (buffer *b, const struct message *m)
{
    const char *temp = NULL;
	int val;

	temp = msg_get_header(m, "val");
	val = atoi(temp);

	if (val == 0)
		system("echo 'headset' > /sys/class/switch/ehs/ehs_type");
	else
		if (val == 1)
			system("echo 'plantronics' > /sys/class/switch/ehs/ehs_type");
		else
			system("echo 'jabra' > /sys/class/switch/ehs/ehs_type");

	buffer_append_string(b, "Response=Success\r\n");

	return 0;
}

static int process_upload(server *srv, connection *con, buffer *b, const struct message *m)
{
    printf("process_upload---------\r\n");
    //FILE *file_fd = NULL;
    int file_fd;
    char *file_name = NULL;
    char temp[32] = "";
    char * start = NULL;
    size_t length = 0;
    char *end = NULL;
    int strip_header = 0;
    char *chunk_start = NULL;
    char *chunk_end = NULL;
    int boundary_length = 29;
    char *boundary_ptr = NULL;
    const char *resType = NULL;
    char *tmp = NULL;
    const char * jsonCallback = NULL;
    size_t whlength = 0;

	if (con->request.content_length) 
	{
		chunkqueue *cq = con->request_content_queue;
                chunk *c;
        
		assert(chunkqueue_length(cq) == (off_t)con->request.content_length);
#ifndef BUILD_RECOVER
                file_name = generate_file_name(b, m);
#else
                file_name = generate_file_name_recover(b, m);
#endif

                //buffer_append_string(b, file_name);
        if (file_name == NULL)
        {
            return -1;
        }

        printf("file name is -----%s-----------\n", file_name);

        //file_fd = fopen(file_name, "w+");
        if( strcasecmp(file_name, FIFO_PATH) == 0 )
        {
            file_fd = open( file_name, O_WRONLY );
        }else
        {
            if( !access(file_name, 0) )
            {
                printf("file ---EXIST\n");
                char *cmd = NULL;
                int cmdlen = 32+strlen(file_name);
                cmd = malloc(cmdlen);
                snprintf(cmd, cmdlen, "echo \" \" > %s", file_name);
                system(cmd);
                free(cmd);
                unlink(file_name);
            }
            /*if( strcasecmp(file_name, TMP_FULL_UPGRADE_PATH) == 0 ){
                struct statfs fs;
                int result = statfs(CACHE_PATH, &fs);
                if (result < 0){
                    printf("statfs error no:%d\n", result);
                    printf("%s: %s\n", CACHE_PATH, strerror(errno));
                    return -1;
                }
                long long freespace = (((long long)fs.f_bsize*(long long)fs.f_bfree));
                printf("free space: %lld, file size:%d\n", freespace, con->request.content_length);
                if( freespace < con->request.content_length ){
                    printf("free space too small-------------\n");
                    buffer_append_string(b, "Response=Error\r\nMessage=Not enough space\r\n");
                    return -1;
                }

                //pcap_size = (freespace/(long long)(2*1024));
            }*/
            file_fd = open( file_name, O_WRONLY | O_CREAT, S_IRWXU);
        }
        if ( file_fd < 0 )
        {
            free(file_name);
            printf("open failed \n");
            return -1;
        }

        boundary_ptr = strstr(con->request.http_content_type, "boundary=");
        if (boundary_ptr != NULL)
        {
            boundary_ptr += strlen("boundary=");
            boundary_length = strlen(boundary_ptr);
        }

        /* there is content to send */
		for (c = cq->first; c; c = cq->first) {
            int r = 0;
                    strip_header++;
			/* copy all chunks */
			switch(c->type) {
			case FILE_CHUNK:
                            printf("file chunk -----------------\n");
				if (c->file.mmap.start == MAP_FAILED) {
					if (-1 == c->file.fd &&  /* open the file if not already open */
					    -1 == (c->file.fd = open(c->file.name->ptr, O_RDONLY))) {
						log_error_write(srv, __FILE__, __LINE__, "ss", "open failed: ", strerror(errno));
                        free(file_name);
                        snprintf(temp,sizeof(temp),"open O_RDONLY failed\r\n");
                        buffer_append_string(b,temp);
                                                close(file_fd);
						return -1;
					}

					c->file.mmap.length = c->file.length;

					if (MAP_FAILED == (c->file.mmap.start = mmap(0,  c->file.mmap.length, PROT_READ, MAP_SHARED, c->file.fd, 0))) {
						log_error_write(srv, __FILE__, __LINE__, "ssbd", "mmap failed: ",
								strerror(errno), c->file.name,  c->file.fd);
                        free(file_name);
                        snprintf(temp,sizeof(temp),"open PROT_READ failed\r\n");
                        buffer_append_string(b,temp);
                                                close(file_fd);
						return -1;
					}

					close(c->file.fd);
					c->file.fd = -1;

					/* chunk_reset() or chunk_free() will cleanup for us */
				}

                            if (chunk_start != NULL)
                            {
                                free(chunk_start);
                                chunk_start = NULL;
                            }

                            chunk_start = malloc(c->file.mmap.length + 1);
                            memset(chunk_start, 0, c->file.mmap.length + 1);
                            memcpy(chunk_start, c->file.mmap.start, c->file.mmap.length);
                            chunk_end = chunk_start + c->file.mmap.length;

                            /*if ((!strcasecmp(file_name, TEMP_PATH"/ringtone.mp3")))
                            {
#ifndef BUILD_RECOVER
                                if ((start = strstr(chunk_start + c->offset, "filename=\"")) != NULL)
                                {
                                    char *tempval = NULL;
                                    close(file_fd);
                                    free(file_name);
                                    end = strstr(start, "\"\r\n");
                                    start += strlen("filename=");
                                    tempval = start;
                                    if ((start = strrchr(start, '\\')) == NULL)
                                    {
                                        start = strrchr(tempval, '\/');
                                    }
                                    
                                    if ((start > end) || start == NULL)
                                    {
                                        start = tempval;
                                    }
                                    start++;
                                    length = strstr(start, "\"") - start;
                                    tempval = strndup( (const char* ) start, length );
                                    file_name = malloc( strlen(RINGTONE_PATH) + strlen(tempval) + 2 );
                                    sprintf(file_name, "%s/%s", RINGTONE_PATH, tempval);
                                    printf("resctuct file name to %s==============\n", file_name);
                                    //file_fd = fopen(file_name, "w+");
                                    file_fd = open(file_name, O_WRONLY);
                                    free(tempval);
                                    if ( file_fd == -1 )
                                    {
                                        printf("open failed \n");
                                        free(file_name);
                                        if (chunk_start != NULL)
                                        {
                                            free(chunk_start);
                                            chunk_start = NULL;
                                        }
                                        return -1;
                                    }
                                }
#endif
                            }
*/
                            char *cont = NULL;
                            start = NULL;
                            start = strstr(chunk_start + c->offset, "--");
                            cont = strstr(chunk_start + c->offset, "Content-Type:");
                            if ((start != NULL) && (cont != NULL) && strip_header == 1)
                                //&& ((start = strstr(start, "\r\n\r\n")) != NULL)
                                //&& ((cont = strstr(c->file.mmap.start + c->offset, "Content-Type:")) != NULL))
                            {
                                start = strstr(cont, "\r\n\r\n");
                                if (start != NULL)
                                {
                                    start += strlen("\r\n\r\n");
                                    
                                    printf("trip header %d\n", strip_header);
                                    c->offset += start - chunk_start;
                                }
                                else
                                {
                                    start = chunk_start + c->offset;
                                }
                            }
                            else
                            {
                                start = chunk_start + c->offset;
                            }
                            
                            //end = strstr(c->file.mmap.start + c->file.length - 54, "\r\n--------------------");
                            if (1)
                            {
                                //end = strstr(chunk_start + c->file.length - boundary_length + 1, "--");
                                end = strstr(chunk_start + c->file.length - boundary_length - 8, boundary_ptr);
                                if (end == NULL)
                                {
                                    end = chunk_start + c->file.length;
                                }
                                else
                                {
                                    char * dectet = NULL;
                                    dectet = end -1;
                                    //end += strlen("\r\n");

                                	while (((*dectet == '\r') && (*(dectet + 2) =='-')) 
                                        || ((*dectet == '\n') && (*(dectet + 1) =='-'))
                                        || (*dectet == '-') )
                                   {
                                        end--;
                                        dectet--;
                                   } 
                                }
                            }

                            length = end - start;

                                //if ((r = write(file_fd, c->file.mmap.start + c->offset, c->file.length - c->offset)) < 0) {
				printf("try write length %d~~~~~~~~~\n", length);

				if ((r = write(file_fd, start, length)) <= 0) {
                                //if ((r = fwrite(start, 1, length, file_fd)) <= 0) {
					switch(errno) {
					case ENOSPC:
						printf("error: %s", strerror(errno));
						con->http_status = 507;
                                            if (chunk_start != NULL)
                                            {
                                                free(chunk_start);
                                                chunk_start = NULL;
                                            }
						break;
					default:
						printf("error: %s", strerror(errno));
						//con->http_status = 403;
                                            if (chunk_start != NULL)
                                            {
                                                free(chunk_start);
                                                chunk_start = NULL;
                                            }
						break;
					}
                                }else
                                {
                                    whlength += r;
                                }

                                printf("write length, %d\n", r);
                            printf("write Done-------------\n" );
                            if (chunk_start != NULL)
                            {
                                free(chunk_start);
                                chunk_start = NULL;
                            }
				break;
                        case MEM_CHUNK:
                            printf("MEM_CHUNK chunk -----------------\n");
                            /*if ((!strcasecmp(file_name, TEMP_PATH"/ringtone.mp3")))
                            {
#ifndef BUILD_RECOVER
                                if ((start = strstr(c->mem->ptr + c->offset, "filename=\"")) != NULL)
                                {
                                    char * tempval = NULL;
                                    close(file_fd);
                                    free(file_name);
                                    end = strstr(start, "\"\r\n");
                                    start += strlen("filename=");
                                    tempval = start;
                                    if ((start = strrchr(start, '\\')) == NULL)
                                    {
                                        start = strrchr(tempval, '\/');
                                    }
                                    if ((start > end) || start == NULL)
                                    {
                                        start = tempval;
                                    }
                                    start++;
                                    length = strstr(start, "\"") - start;
                                    tempval = strndup( start, length );
                                    file_name = malloc( strlen(RINGTONE_PATH) + strlen(tempval) + 2 );
                                    sprintf(file_name, "%s/%s", RINGTONE_PATH, tempval);
                                    printf("resctuct file name to %s----------\n", file_name);
                                    //file_fd = fopen(file_name, "w+");
                                    file_fd = open(file_name, O_WRONLY);
                                    free(tempval);
                                }
#endif
                            }
                            */
                            if ((strip_header == 1) && ((start = strstr(c->mem->ptr + c->offset, "\r\n\r\n")) != NULL) 
                                 && (strstr(c->mem->ptr + c->offset, "Content-Type:") != NULL))

                            {
                                start += strlen("\r\n\r\n");
                            }
                            else
                            {
                                start = c->mem->ptr + c->offset;
                            }
                            //end = strstr(c->mem->ptr + c->mem->used - 55, "\r\n--------------------");
                            if (1)
                            {
                                end = strstr(c->mem->ptr + c->mem->used - boundary_length - 8, "--");
                                if (end == NULL)
                                {
                                    end = c->mem->ptr + c->mem->used - 1;
                                }
                                else
                                {
                                    char * dectet = NULL;
                                    dectet = end -1;
                                    //end += strlen("\r\n");

                                	while (((*dectet == '\r') && (*(dectet + 2) =='-')) 
                                        || ((*dectet == '\n') && (*(dectet + 1) =='-'))
                                        || (*dectet == '-') )
                                   {
                                        end--;
                                        dectet--;
                                   } 
                                }
                            }
                            length = end - start;
                            printf("try write mem length %d~~~~~~~~~\n", length);

                            r = c->mem->used - c->offset - 1;
                            printf("start is %d/%d\n", strlen(start), length);
                                //if ((r = write(file_fd, c->mem->ptr + c->offset, c->mem->used - c->offset - 1)) < 0) {
                                //if ((fwrite(start, 1, length, file_fd)) <= 0) {
                                if ((write(file_fd, start, length)) <= 0) {
				//if ((write(file_fd, start, length)) <= 0) {
                                        switch(errno) {
					case ENOSPC:
						printf("error: %s", strerror(errno));
						con->http_status = 507;

						break;
					default:
						printf("error: %s", strerror(errno));
						//con->http_status = 403;
						break;
					}
                                }else
                                {
                                    whlength += r;
                                }
                                printf("write mem Done-------------\n" );
				break;
			case UNUSED_CHUNK:
				break;
			}

			if (r > 0) {
				c->offset += r;
				cq->bytes_out += r;
			} else {
				break;
			}
			chunkqueue_remove_finished_chunks(cq);
		}

            close(file_fd);
            if ((!strcasecmp(file_name, PATH_802MODE"/ca.pem")) || (!strcasecmp(file_name, PATH_802MODE"/client.pem")) || (!strcasecmp(file_name, PATH_802MODE"/user.prv")) ){
                chmod(file_name, 0744);
            }
	}
        
    int uploadsuc = 0;
    if( con->request.content_length - whlength < 1024 ){
        uploadsuc = 1;
    }
    printf("process done,uploadsuc = %d---------\r\n", uploadsuc);
    resType = msg_get_header(m, "format");

    if((resType != NULL) && !strcasecmp(resType, "json"))
    {
        jsonCallback = msg_get_header( m, "jsoncallback" );    

        if(jsonCallback != NULL)
        {
            tmp = malloc((strlen(jsonCallback) + 64) * sizeof(char));

            if(tmp != NULL)
            {
                if( uploadsuc )
                    sprintf(tmp, "%s(%s)", jsonCallback, "{\"res\" : \"success\", \"msg\" : \"upload done\"}");
                else
                    sprintf(tmp, "%s(%s)", jsonCallback, "{\"res\" : \"error\", \"msg\" : \"upload fail\"}");
                buffer_append_string(b, tmp);
                free(tmp);
            }
        }
        else
        {
            if( uploadsuc )
                buffer_append_string(b, "{\"res\" : \"success\", \"msg\" : \"upload done\"}");
            else
                buffer_append_string(b, "{\"res\" : \"error\", \"msg\" : \"upload fail\"}");
        }

        if(file_name != NULL){
            free(file_name);
        }
    }
    else
    {
        if( uploadsuc )
            buffer_append_string(b, "Response=Success\r\nMessage=Upload Done\r\n");
        else
            buffer_append_string(b, "Response=Error\r\nMessage=Upload Fail\r\n");

        if(file_name != NULL){
            if( !strcasecmp(file_name, FIFO_PATH) == 0 )
            {
                unsigned int size;
                FILE* fp = fopen( file_name, "rb" );
                fseek( fp, 0L, SEEK_END );
                size=ftell(fp);
                fclose(fp);
                //buffer_append_string(b, "filename !=null\r\n");

                tmp = malloc(32);
                memset(tmp, 0, sizeof(tmp));
                sprintf(tmp, "Size=%d\r\n", size);
                buffer_append_string(b, tmp);
                free(tmp);
            }
            free(file_name);
        }
    }

        printf("~~~%d~~~~~~~~~~~~~~upload done~~hah~~~~%d~~~~~\n", con->request.content_length, whlength);
    return 0;
}

#ifndef BUILD_RECOVER

int isReadable(int sd,int * error,int timeOut)
{ 
    // milliseconds
    fd_set socketReadSet;
    FD_ZERO(&socketReadSet);
    FD_SET(sd,&socketReadSet);
    struct timeval tv;
    
    if (timeOut)
    {
        tv.tv_sec  = timeOut / 1000;
        tv.tv_usec = (timeOut % 1000) * 1000;
    }
    else
    {
        tv.tv_sec  = 0;
        tv.tv_usec = 0;
    } // if

    
    if (select(sd+1,&socketReadSet,0,0,&tv) == -1) 
    {
        *error = 1;
        return 0;
    } // if
    *error = 0;
    
    return FD_ISSET(sd,&socketReadSet) != 0;
} /* isReadable */

#endif

static int process_message(server *srv, connection *con, buffer *b, const struct message *m)
{
    char action[80] = "";
    char res[256] = "";
    const char *temp = NULL;
    const char *resType = NULL;

    memset(action, 0, sizeof(action));
    temp = msg_get_header(m, "Action");

    if ( temp == NULL )
    {
        resType = msg_get_header(m, "format");
        if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
        {
             response_header_overwrite(srv, con, CONST_STR_LEN("Content-Type"), 
                CONST_STR_LEN("application/x-javascript; charset=utf-8"));
        
            const char * jsonCallback = msg_get_header( m, "jsoncallback" );

            if ( jsonCallback != NULL )
            {
                temp = malloc( 128 + strlen( jsonCallback ) );
                snprintf( temp, 128 + strlen( jsonCallback ),
                    "%s(%s)", jsonCallback, "{\"res\": \"error\", \"msg\" : \"command not found\"}" );
            }
            else
            {
                temp = malloc( 128 );
                snprintf( temp, 128, "%s", "{\"res\": \"error\", \"msg\" : \"command not found\"}" );
            }
            
            buffer_append_string( b, temp );
            free(temp);
        }
        else
        {
            sprintf(res, "Response=Error\r\nMessage=Command Not Found\r\n");
        }
        buffer_append_string(b, res);
        return -1;
    }
    
    strncpy(action, temp, sizeof(action) - 1);

    char *region = NULL;
    region = msg_get_header(m, "region");

    if (!strcasecmp(action, "login")) {
        int isadmin = 0;
        temp = msg_get_header(m, "Username");
        if (!strcasecmp ("admin", temp)){
            isadmin = 1;
        }else{
            isadmin = 0;
        }
        time_t now;
        time(&now);
        if( isadmin == 1 ){
            if( passwrongtimes >= 5 && now < lockoutime ){
                buffer_append_string(b, "Response=Error\r\nMessage=Locked\r\nLockType=1\r\n");
                return -1;
            }
        }else{
            if( userpasswrongtimes >= 5 && now < userlockoutime ){
                buffer_append_string(b, "Response=Error\r\nMessage=Locked\r\nLockType=1\r\n");
                return -1;
            }
        }
        int authres = authenticate(m);
        if (authres == -1) {
            if (isadmin){
                if( passwrongtimes >= 5 )
                    passwrongtimes = passwrongtimes % 5;
                passwrongtimes ++;
                if( passwrongtimes >= 5 ) {
                    lockoutime = now + LOCK_TIMEOUT;
                }
            }else{
                if( userpasswrongtimes >= 5 )
                    userpasswrongtimes = userpasswrongtimes % 5;
                userpasswrongtimes ++;
                if( userpasswrongtimes >= 5 ) {
                    userlockoutime = now + LOCK_TIMEOUT;
                }
            }

            resType = msg_get_header(m, "format");
            if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
            {
                 response_header_overwrite(srv, con, CONST_STR_LEN("Content-Type"), 
                    CONST_STR_LEN("application/x-javascript; charset=utf-8"));
            
                const char * jsonCallback = msg_get_header( m, "jsoncallback" );

                if ( jsonCallback != NULL )
                {

                    temp = malloc( 128 + strlen( jsonCallback ) );
                    snprintf( temp, 128 + strlen( jsonCallback ),
                            "%s(%s)%d%s", jsonCallback, "{\"res\": \"error\", \"msg\" : \"authentication failed\", \"times\":\"", isadmin == 1 ? passwrongtimes : userpasswrongtimes, "\"}" );
                }
                else
                {
                    temp = malloc( 128 );
                    snprintf( temp, 128, "%s%d%s", "{\"res\": \"error\", \"msg\" : \"authentication failed\", \"times\":\"", isadmin == 1 ? passwrongtimes : userpasswrongtimes, "\"}" );
                }
                
                buffer_append_string( b, temp );
                free(temp);
            }
            else
            {
                buffer_append_string(b, "Response=Error\r\nMessage=Authentication failed\r\n");
                temp = malloc( 32 );
                memset(temp, 0, 32);
                snprintf( temp, 32, "Times=%d\r\n", isadmin == 1 ? passwrongtimes : userpasswrongtimes);
                buffer_append_string(b,temp);
                free(temp);
            }
            return -1;
        } else if( authres == -2 ){
            buffer_append_string(b, "Response=Error\r\nMessage=Invalid Username\r\n");
        } else {
            if( isadmin ){
                passwrongtimes = 0;
                lockoutime = 0;
            }
            else{
                userpasswrongtimes = 0;
                userlockoutime = 0;
            }
            authenticate_success_response(srv, con, b, m, authres );
        }
    } else if (!strcasecmp(action, "checklockout")) {
        handle_checklockout( b );
    } else if (!strcasecmp(action, "loginrealm")) {
        handle_loginrealm( b );
    } else if (!strcasecmp(action, "insleepmode")) {
        handle_insleepmode(b);
        //handle_callservice_by_no_param(srv, con, b, m, "getIfInSleepMode");
    } else if (!strcasecmp(action, "product")) {
        handle_product( srv, con, b, m );
    } else if (!strcasecmp(action, "productinfo")) {
        handle_productinfo( srv, con, b, m );
#ifndef BUILD_RECOVER
    } else if( !strcasecmp(action, "coloreExist")) {
        handle_coloreExist(b);
    } else if (!strcasecmp(action, "vendor")) {
        handle_vendor( srv, con, b, m );
#else
    } else if (!strcasecmp(action, "recoverversion")) {
            handle_recoverversion(b);
#endif
    }else if(!strcasecmp(action,"getconnectstate")){
        handle_getconnectstate( srv, con, b, m );
    } 
    else if (valid_connection(con)) {
        int findcmd = 1;
#ifndef BUILD_RECOVER
        if (protected_command_find(command_protect, action))
        {
            sprintf(res, "Response=Error\r\nMessage=Command Not Found\r\n");
            buffer_append_string(b, res);
            return -1;
        }
#endif
        if( region == NULL || !strcasecmp(region, "")) {
            printf("region is null or empty \n");
#ifdef BUILD_RECOVER
            if (!strcasecmp(action, "startrecover")) {
                handle_startrecover(b,m);
            } else if (!strcasecmp(action, "recoverresult")) {
                handle_recoverresult(b);
            } else if (!strcasecmp(action, "recoverreset")) {
                handle_recoverreset(b);
            }
#else
            if (!strcasecmp(action, "get")) {
                handle_get(b, m);
            } else if (!strcasecmp(action, "put") || !strcasecmp(action, "setParameter") || !strcasecmp(action, "upgradeaddr") ) {
                handle_put(b, m);
            } else if (!strcasecmp(action, "applypvalue")) {
                handle_applypvalue(b, m);
            } else if (!strcasecmp(action, "applypvaluersps")) {
                handle_applyresponse(b);
            } else if (!strcasecmp(action, "needapply")) {
                handle_checkneedapplyp(b);
            } else if (!strcasecmp(action, "cfupdated")) {
                handle_cfupdated(b);
            } else if (!strcasecmp(action, "ping")) {
                sprintf(res, "Response=Pong\r\n");
                buffer_append_string(b, res);
            } else if (!strcasecmp(action, "logoff")) {
                handle_logoff(b);
            } else if (!strcasecmp(action, "fxoexist")) {
                handle_fxoexist(b);
            } else if (!strcasecmp(action, "reboot")) {
                handle_reboot(srv, con, b, m);
            } else if (!strcasecmp(action, "setprop")) {
                handle_set_property(b, m);
            //} else if (!strcasecmp(action, "sqlitesettings")) {
            //    handle_sqlitesettings(b, m);
            } else if (!strcasecmp(action, "savephbk")) {
                handle_savephbk(b, m);
            } else if (!strcasecmp(action, "putdownphbk")) {
                handle_putdownphbk(b, m);
            } else if (!strcasecmp(action, "phbkresponse")) {
                handle_phbkresponse(b, m);
            } else if (!strcasecmp(action, "getphbkparam")) {
                handle_getparams(b, CONF_PHBKDOWNLOAD);
            } else if (!strcasecmp(action, "putportphbk")) {
                handle_putportphbk(b, m);
            } else if (!strcasecmp(action, "portphbkresponse")) {
                handle_portphbkresponse(b, m);
            }
            else if (!strcasecmp(action, "confirmadminpsw")) {
                handle_confirmadminpsw(srv, con,b, m);
            }else if (!strcasecmp(action, "startping")) {
                handle_start_ping(b, m, 0);
            }else if (!strcasecmp(action, "getpingmsg")) {
                handle_get_ping_msg(b, m);
            }else if (!strcasecmp(action, "stopping")) {
                handle_stop_ping(b,0);
            }else if (!strcasecmp(action, "starttraceroute")) {
                handle_start_ping(b, m, 1);
            }else if (!strcasecmp(action, "gettracroutemsg")) {
                handle_get_tracroute_msg(b, m);
            }else if (!strcasecmp(action, "stoptracroute")) {
                handle_stop_ping(b,1);
            }else if(!strcasecmp(action,"gettcpserverstate")){
                handle_gettcpserverstate(srv, con, b, m);
            }else if(!strcasecmp(action,"developmode")){
                handle_developmode(srv, con, b, m);
            }else if (!strcasecmp(action, "hardware")) {
                handle_hardware( srv, con, b, m );
            } else if (!strcasecmp(action, "status")) {
                handle_status(srv,con,b, m);
            } else if (!strcasecmp(action, "vpnenable")) {
                handle_vpnenable(b);
            } else if (!strcasecmp(action, "uptime")) {
                handle_uptime( srv, con, b, m );
            } else if (!strcasecmp(action, "androidver")) {
                handle_androidverion( b );
            } else if (!strcasecmp(action, "network")) {
                handle_network(srv, con, b, m);
            } else if (!strcasecmp(action, "pn")) {
                handle_pn( srv, con, b, m );
            } else if (!strcasecmp(action, "sn")) {
                handle_sn( srv, con, b, m );
            }else if (!strcasecmp(action, "originatecall")) {
                handle_originatecall(srv, con, b, m);
            }else if (!strcasecmp(action, "upgrade")){
                handle_upgrade(b, m);
            } else if (!strcasecmp(action, "getmaxlinecount")){
                handle_callservice_by_no_param(srv, con, b, m, "getMaxLineCount");
            }else{
                findcmd = 0;
            }
#endif
        } else{
            if (!strcasecmp(region, "status")){
                if (!strcasecmp(action, "hardware")) {
                    handle_hardware( srv, con, b, m );
                } else if (!strcasecmp(action, "status")) {
                    handle_status(srv,con,b, m);
                } else if (!strcasecmp(action, "vpnenable")) {
                    handle_vpnenable(b);
                } else if (!strcasecmp(action, "uptime")) {
                    handle_uptime( srv, con, b, m );
                } else if (!strcasecmp(action, "androidver")) {
                    handle_androidverion( b );
                } else if (!strcasecmp(action, "network")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getCurrentNetworkInfo");
                } else if (!strcasecmp(action, "pn")) {
                    handle_pn( srv, con, b, m );
                } else if (!strcasecmp(action, "sn")) {
                    handle_sn( srv, con, b, m );
                } else if (!strcasecmp(action, "gethdmi1state")) {
                    //handle_gethdmi1state(b);
                    handle_callservice_by_no_param(srv, con, b, m, "getHDMIOneState");
                } else if (!strcasecmp(action, "gethdmi2state")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getHDMITwoState");
                } else if (!strcasecmp(action, "gethdmiinstate")){
                    handle_callservice_by_no_param(srv, con, b, m, "getHDMIInState");
                } /*else if (!strcasecmp(action, "getUSB2state")) {
                    handle_getUSB2state(b);
                } */ else if(!strcasecmp(action, "getusbstate")){
                    handle_callservice_by_no_param(srv, con, b, m, "getUSBState");
                } else if (!strcasecmp(action, "getsdcardstate")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getSDCardStatus");
                } else{
                    findcmd = 0;
                }

            }
            else if (!strcasecmp(region, "account")){
                if (!strcasecmp(action, "autoanswer")) {
                    handle_autoanswer(b, m);
                } else if (!strcasecmp(action, "vbupdated")) {
                    handle_vbupdated(b, m);
                } else if (!strcasecmp(action, "callforward")) {
                    handle_callforward(b, m);
                } else if (!strcasecmp(action, "converaudio")) {
                    handle_converaudio(b, m);
                } else if (!strcasecmp(action, "tonelist")) {
                    handle_tonelist(b, TONELIST_PATH);
                } else if (!strcasecmp(action, "notificationlist")) {
                    handle_tonelist(b, NOTIFICATIONS_PATH);
                } else if (!strcasecmp(action, "tonelist1")) {
                    handle_tonelist1(b);
                } else if (!strcasecmp(action, "tonedblist")) {
                    handle_tonelist_db(b, 1);
                } else if (!strcasecmp(action, "notificationdblist")) {
                    handle_tonelist_db(b, 0);
                } else if (!strcasecmp(action, "gettonename")) {
                    handle_gettonename(b, m);
                } else if (!strcasecmp(action, "deletetone")) {
                    handle_deltone(b, m);
                } else if (!strcasecmp(action, "setdefaultacct")) {
                    handle_callservice_by_one_param(srv, con, b, m, "account", "setDefaultAccount", 0);
                } else{
                    findcmd = 0;
                }
            }
            else if (!strcasecmp(region, "apps")){
                if (!strcasecmp(action, "sqlitecontacts")) {
                    handle_sqlitecontacts(b, m);
                } else if (!strcasecmp(action, "sqliteconf")) {
                    handle_sqliteconf(b, m);
                } else if (!strcasecmp(action, "getgoogleaccts")) {
                    handle_getgoogleaccts(b);
                } else{
                    findcmd = 0;
                }
            }
            else if (!strcasecmp(region, "control")){
                if (!strcasecmp(action, "getaudioinfo")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getAudioInfo");
                } else if (!strcasecmp(action, "getpresetinfo")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getPresetInfo");
                } else if (!strcasecmp(action, "setvolume")) {
                    handle_setvolume(srv, con, b, m);
                } else if (!strcasecmp(action, "ptzctrl")) {
                    handle_ptzctrl(b, m);
                } else if (!strcasecmp(action, "setpreset")) {
                    handle_setpreset(b, m);
                } else{
                    findcmd = 0;
                }
            }
            else if (!strcasecmp(region, "advanset")){
                if (!strcasecmp(action, "sqlitedisplay")) {
                    handle_sqlitedisplay(b, m);
                } else if (!strcasecmp(action, "getlanguages")) {
                    handle_getlanguages(b);
                } else if (!strcasecmp(action, "getcountry")) {
                    handle_getcountry(b);
                } else if (!strcasecmp(action, "clearlock")) {
                    handle_callservice_by_no_param(srv, con, b, m, "clearScreenLock");
                } else if (!strcasecmp(action, "savelockpwd")) {
                    handle_webservice_by_one_param(srv, con, b, m, "newlock", "setScreenLock", 1);
                } else if (!strcasecmp(action, "putlanguage")) {
                    handle_putlanguage(b, m);
                } else if (!strcasecmp(action, "putnetwork")) {
                    handle_putnetwork(b);
                } else if (!strcasecmp(action, "proxyupdated")) {
                    dbus_send_proxyupdated();
                    system("am broadcast -a \"android.net.conn.PROXY_CHANGE\"");
                } else if (!strcasecmp(action, "renameframecomp")) {
                    handle_rename_framecomp(b, m);
                } else if (!strcasecmp(action, "gettimezone")) {
                    //handle_gettimezone(b);
                    handle_callservice_by_no_param(srv, con, b, m, "getTimeZoneList");
                } else if (!strcasecmp(action, "savetimeset")) {
                    handle_savetimeset(b, m);
                } else if (!strcasecmp(action, "getvericert")) {
                    handle_getvericert(b);
                } else if (!strcasecmp(action, "checkvericert")) {
                    handle_check_vericert(b, m);
                } else if (!strcasecmp(action, "getptz")) {
                    handle_getptz(b);
                } else if (!strcasecmp(action, "setptz")) {
                    handle_setptz(b, m);
                } else if (!strcasecmp(action, "setfanspeed")) {
                    handle_setfanspeed(b);
                } else if (!strcasecmp(action, "getsleepmode")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getSleepMode");
                } else if (!strcasecmp(action, "checksecurity")) {
                    handle_checksecurity(b);
                } else if (!strcasecmp(action, "setsleepmode")) {
                    handle_callservice_by_one_param(srv, con, b, m, "sleepmode", "setSleepMode", 0);
                } else if (!strcasecmp(action, "getdisplayinfo")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getDisplayInfo");
                } else if (!strcasecmp(action, "setdisplayinfo")) {
                    handle_callservice_by_one_param(srv, con, b, m, "format", "setDisplayInfo", 0);
                    handle_setdisplay_dbus(b, m);
                } else if (!strcasecmp(action, "syncdisplayinfo")) {
                    handle_setdisplay_dbus(b, m);
                } else if (!strcasecmp(action, "setdisplaypercent")) {
                    handle_callservice_by_one_param(srv, con, b, m, "percent", "setDisplayPercent", 0);
                } else if (!strcasecmp(action, "setSitesettingInfo")) {
                    handle_setSitesettingInfo(srv, con,b, m);
                } else if (!strcasecmp(action, "setSitesettingOffset")) {
                    handle_setSitesettingOffset(srv, con,b, m);
                } else if (!strcasecmp(action, "enableiptalkpro")) {
                    handle_enableiptalkpro(b);
                } else if (!strcasecmp(action, "gethdmiconnectstatus")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getHdmiConnectStatus");
                } else if (!strcasecmp(action, "gethdmimodes")) {
                    handle_callservice_by_one_param(srv, con, b, m, "hdmi", "getHdmiModes", 1);
                } else if (!strcasecmp(action, "getcurhdmimode")) {
                    handle_callservice_by_one_param(srv, con, b, m, "hdmi", "getCurrentHdmiMode", 1);
                } else if (!strcasecmp(action, "sethdmioutputmode")) {
                    handle_sethdmioutputmode(srv, con,b, m);
                } else{
                    findcmd = 0;
                }
            }
            else if (!strcasecmp(region, "maintenance")){
                if (!strcasecmp(action, "capture")) {
                    handle_capture(b, m);
                } else if (!strcasecmp(action, "getdateinfo")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getDateInfo");
                } else if (!strcasecmp(action, "setdateinfo")) {
                    handle_webservice_by_two_string_param(srv, con, b, m, "datestr", "timestr", "setDateInfo"); 
                } else if (!strcasecmp(action, "tracelist")) {
                    handle_tracelist(b);
                } else if (!strcasecmp(action, "deletetrace")) {
                    handle_deletetrace(b, m);
                } else if (!strcasecmp(action, "initupstatus")) {
                    handle_initupstatus(b);
                } else if (!strcasecmp(action, "provisioninit")) {
                    handle_provisioninit(b, m);
                } else if (!strcasecmp(action, "upgradenow")) {
                    handle_upgradenow(b);
                } else if (!strcasecmp(action, "factset")) {
                    handle_factset(b,m);
                } else if (!strcasecmp(action, "saveconf")) {
                    handle_saveconf(b);
                } else if (!strcasecmp(action, "importconf")) {
                    handle_importconfig(b);
                } else if (!strcasecmp(action, "setheadset")) {
                    handle_setheadsettype(b, m);
                } else if (!strcasecmp(action, "clearlogcat")) {
                    handle_clearlogcat(b);
                } else if (!strcasecmp(action, "getlogcat")) {
                    handle_getlogcat(b, m);
                } else if (!strcasecmp(action, "setsyslogd")) {
                    handle_setsyslogd(b);
                } else if( !strcasecmp(action, "getcolore")) {
                    handle_getcolore(b);
                } else if( !strcasecmp(action, "putcolore")) {
                    handle_putcolore(b, m);
                } else if( !strcasecmp(action, "changepwd")) {
                    handle_changepwd(b, m);
                } else if (!strcasecmp(action, "chgcolorepwdrsps")) {
                    handle_chgcolorepwdrsps(b);
                } else if (!strcasecmp(action, "recording")) {
                    handle_recording(b, m);
                } else if (!strcasecmp(action, "recordingnotify")) {
                    handle_recording_notify(b, m);
                } else if (!strcasecmp(action, "downloadrecordings")) {
                    handle_downloadrecordings(b, m);
                } else if (!strcasecmp(action, "removetmprecord")) {
                    handle_removetmprecord(b);
                } else if (!strcasecmp(action, "getusbstate")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getUSBState");
                } else if (!strcasecmp(action, "getrecordingpath")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getRecordingPath");
                } else if (!strcasecmp(action, "setrecordingpath")) {
                    handle_callservice_by_one_param(srv, con, b, m, "path", "setRecordingPath", 1);
                } else if (!strcasecmp(action, "backupcfg")) {
                    handle_backupcfg(b);
                } else if (!strcasecmp(action, "restorecfg")) {
                    handle_restorecfg(b);
                } else if (!strcasecmp(action, "importlang")) {
                    handle_importlanguage(b);
                } else if (!strcasecmp(action, "importlanrsps")) {
                    handle_getimportlanresps(b);
                } else{
                    findcmd = 0;
                }
            }
            else if (!strcasecmp(region, "webservice")){
                if (!strcasecmp(action, "originatecall")) {
                    handle_originatecall(srv, con, b, m);
                } else if (!strcasecmp(action, "originatecallconf")) {
                    handle_webservice_by_one_param(srv, con, b, m, "confId", "originateCallConf", 0);
                } else if (!strcasecmp(action, "isanylinebusy")) {
                    handle_callservice_by_no_param(srv, con, b, m, "isAnyLineBusy");
                } else if (!strcasecmp(action, "setcontact")) {
                    handle_setcontact(srv, con, b, m);
                } else if (!strcasecmp(action, "removecontact")) {
                    handle_removecontact(srv, con, b, m);
                } else if (!strcasecmp(action, "setgroup")) {
                    handle_setgroup(srv, con, b, m);
                } else if (!strcasecmp(action, "updateGroupMemberShip")) {
                    handle_updategroupmembership(srv, con, b, m);
                } else if (!strcasecmp(action, "removegroup")) {
                    handle_removegroup(srv, con, b, m);
                } else if (!strcasecmp(action, "removecall")) {
                    handle_removecall(srv, con, b, m);
                } else if (!strcasecmp(action, "removecallbynumber")) {
                    handle_removecallbynumber(srv, con, b, m);
                } else if (!strcasecmp(action, "removecallconf")) {
                    handle_webservice_by_one_param(srv, con, b, m, "confId", "removeCallConf", 0);
                } else if (!strcasecmp(action, "removecallconfbyname")) {
                    handle_webservice_by_one_param(srv, con, b, m, "name", "removeCallConfByName", 1);
                } else if (!strcasecmp(action, "clearallcallhistory")) {
                    handle_clearallcallhistory(srv, con, b, m);
                } else if (!strcasecmp(action, "deleteconference")) {
                    handle_webservice_by_one_param(srv, con, b, m, "id", "deleteConference", 0);
                } else if (!strcasecmp(action, "getgroup")) {
                    handle_getgroup(srv, con, b, m);
                } else if (!strcasecmp(action, "setconference")) {
                    handle_setconference(srv, con, b, m);
                } else if (!strcasecmp(action, "addconference")) {
                    handle_webservice_by_one_param(srv, con, b, m, "name", "addConference", 1);
                } else if (!strcasecmp(action, "renameconference")) {
                    handle_renameconference(srv, con, b, m);
                } else if (!strcasecmp(action, "updateconferencemembership")) {
                    handle_updateconferencemembership(srv, con, b, m);
                } else if (!strcasecmp(action, "deleteschedule")) {
                    handle_webservice_by_one_param(srv, con, b, m, "id", "deleteSchedule", 0);
                } else if (!strcasecmp(action, "addschedule")) {
                    handle_updateschedule(srv, con, b, m);
                } else if (!strcasecmp(action, "updateschedule")) {
                    handle_updateschedule(srv, con, b, m);
                } else if (!strcasecmp(action, "notifyschedule")) {
                    handle_notify_schedule_change(b, m);
                } else if (!strcasecmp(action, "setgoogleschestatus")) {
                    handle_googleschedule_status(b, m);
                } else if (!strcasecmp(action, "delcaption")) {
                    handle_webservice_by_one_param(srv, con, b, m, "id", "delCaption", 0);
                } else if (!strcasecmp(action, "addcaption")) {
                    handle_updatecaption(srv, con, b, m, 0);
                } else if (!strcasecmp(action, "previewcaption")) {
                    handle_operatecaption(srv, con, b, m, 0);
                } else if (!strcasecmp(action, "stopcaption")) {
                    handle_operatecaption(srv, con, b, m, 1);
                } else if (!strcasecmp(action, "sharecaption")) {
                    handle_operatecaption(srv, con, b, m, 2);
                } else if (!strcasecmp(action, "updatecaption")) {
                    handle_updatecaption(srv, con, b, m, 1);
                } else if (!strcasecmp(action, "cleargroup")) {
                    handle_cleargroup(srv, con, b, m);
                } else if (!strcasecmp(action, "getcontact")) {
                    handle_getcontact(srv, con, b, m);
                } else if (!strcasecmp(action, "getcontactsbyorder")) {
                    handle_callservice_by_no_param(srv, con, b, m, "getContactsByOrder");
                } else if (!strcasecmp(action, "getgroupcount")) {
                    handle_getgroupcount(srv, con, b, m);
                } else if (!strcasecmp(action, "getcontactcount")) {
                    handle_getcontactcount(srv, con, b, m);
                } else if (!strcasecmp(action, "movetodefault")) {
                    handle_movetodefault(srv, con, b, m);
                } else if (!strcasecmp(action, "lineStatus")) {
                    handle_getLineStatus(srv, con, b, m);
                } else if (!strcasecmp(action, "endcall")) {
                    handle_endcall(srv, con, b, m);
                } else if (!strcasecmp(action, "gmiVersion")) {
                    handle_getGmiVersion(srv, con, b, m);
                } else if (!strcasecmp(action, "launchservice")){
                    handle_launchservice(srv, con, b, m);
                } else if (!strcasecmp(action, "closeservice")){
                    handle_closeservice(srv, con, b, m);
                }else if (!strcasecmp(action, "closecurservice")){
                    handle_closecurservice(srv, con, b, m);
                }else if (!strcasecmp(action, "grabwindow")){
                    handle_grabwindow(srv, con, b, m);
                }else if (!strcasecmp(action, "touchscreen")){
                    handle_touchscreen(srv, con, b, m);
                }else if(!strcasecmp(action, "swipescreen")){
                    handle_swipeScreen(srv, con, b, m);
                }else if (!strcasecmp(action, "getmessage")){
                    handle_getmessage(srv, con, b, m);
                }else if (!strcasecmp(action, "setnewmessage")){
                    handle_setnewmessage(srv, con, b, m);
                }else if (!strcasecmp(action, "senddraftmessage")){
                    handle_senddraftmessage(srv, con, b, m);
                }else if (!strcasecmp(action, "removemessage")){
                    handle_removemessage(srv, con, b, m);
                }else if (!strcasecmp(action, "savemessage")){
                    handle_savemessage(b, m);
                }else if (!strcasecmp(action, "getlastcall")){
                    handle_getlastcall(srv, con, b, m);
                }else if (!strcasecmp(action, "savecallhistory")){
                    handle_savecallhistory(b, m);
                }else if (!strcasecmp(action, "downloadphonebook")){
                    handle_importPhonebook(srv, con, b, m);
                }else if (!strcasecmp(action, "vgasend")){
                    handle_vgasend(srv, con, b, m);
                }
                else if (!strcasecmp(action, "vgaread")){
                    handle_vgaread(srv, con, b, m);
                }
                 else{
                    findcmd = 0;
                }
            }
            else if (!strcasecmp(region, "confctrl")){
                if (!strcasecmp(action, "addconfmemeber")) {
                    handle_addconfmemeber(srv, con, b, m);
                } 
                else if (!strcasecmp(action, "acceptringline")) {
                    handle_acceptringline(srv, con, b, m);
                }
                else if (!strcasecmp(action, "isacceptvideo")){
                    handle_callservice_by_two_param(srv, con, b, m, "isflag", "line", "acceptOrRejectVideo");
                }
                else if (!strcasecmp(action, "ctrlvideostate")){
                    handle_callservice_by_two_param(srv, con, b, m, "isflag", "line", "ctrlVideoState");
                }
                else if (!strcasecmp(action, "ctrllinemute")){
                    handle_callservice_by_two_param(srv, con, b, m, "setmute", "line", "ctrlLineMuteState");
                }
                else if (!strcasecmp(action, "lineholdstate")){
                    handle_callservice_by_two_param(srv, con, b, m, "sethold", "line", "ctrlLineHoldState");
                }
                else if (!strcasecmp(action, "ctrllocalmute")){
                    handle_callservice_by_one_param(srv, con, b, m, "setmute", "ctrlLocalMuteState", 0);
                }
                else if (!strcasecmp(action, "switchline")){
                    handle_callservice_by_one_param(srv, con, b, m, "line", "switchLine", 0);
                }
                else if (!strcasecmp(action, "confholdstate")){
                    handle_callservice_by_one_param(srv, con, b, m, "sethold", "ctrlConfHoldState", 0);
                }
                else if (!strcasecmp(action, "getpincode")){
                    handle_callservice_by_no_param(srv, con, b, m, "getPinCode");
                }
                else if (!strcasecmp(action, "setpincode")){
                    handle_callservice_by_one_param(srv, con, b, m, "pincode", "setPinCode", 1);
                }
                else if (!strcasecmp(action, "startrecord")){
                    handle_callservice_by_no_param(srv, con, b, m, "startRecord");
                }
                else if (!strcasecmp(action, "stoprecord")){
                    handle_callservice_by_no_param(srv, con, b, m, "stopRecord");
                }
                else if (!strcasecmp(action, "isconfonhold")){
                    handle_callservice_by_no_param(srv, con, b, m, "isConfOnHold");
                }
                else if (!strcasecmp(action, "endconf")){
                    handle_callservice_by_no_param(srv, con, b, m, "endConf");
                }
                else if (!strcasecmp(action, "endallcall")){
                    handle_callservice_by_no_param(srv, con, b, m, "endAllCall");
                }
                else if (!strcasecmp(action, "getallLineInfo")){
                    handle_callservice_by_no_param(srv, con, b, m, "getAllLineInfo");
                }
                else if (!strcasecmp(action, "setdndonoroff")){
                    handle_setdndonoroff(srv, con, b, m);
                }
                else if (!strcasecmp(action, "isdndon")){
                    handle_callservice_by_one_param(srv, con, b, m, "account", "isDNDOn", 0);
                }
                else if (!strcasecmp(action, "isconfdndon")){
                    handle_callservice_by_no_param(srv, con, b, m,"isConfDNDOn");
                }
                else if (!strcasecmp(action, "isscheduleconf")){
                    handle_callservice_by_no_param(srv, con, b, m,"isScheduleConf");
                }
                else if (!strcasecmp(action,"callstatusReport")){
                    handle_callstatus_report(srv, con,b, m, "ctrlopen", 0);
                }
                else if (!strcasecmp(action, "ctrlConfPauseState")){
                    handle_callservice_by_one_param(srv, con, b, m, "ispause", "ctrlConfPauseState", 0);
                }
                else if (!strcasecmp(action, "ctrlCameraBlockState")){
                    handle_callservice_by_one_param(srv, con, b, m, "isblock", "ctrlCameraBlockState", 0);
                }
                else if (!strcasecmp(action, "isConfOnHold")){
                    handle_callservice_by_no_param(srv, con, b, m, "isConfOnHold");
                }
                else if (!strcasecmp(action, "isCameraBlocked")){
                    handle_callservice_by_no_param(srv, con, b, m, "isCameraBlocked");
                }
                else if (!strcasecmp(action, "ctrlBFCPState")){
                    handle_callservice_by_one_param(srv, con, b, m, "ison", "ctrlBFCPState", 0);
                }
                else if (!strcasecmp(action, "isBFCPOn")){
                    handle_callservice_by_no_param(srv, con, b, m, "isBFCPOn");
                }
                else if (!strcasecmp(action, "getBFCPMode")){
                    handle_callservice_by_no_param(srv, con, b, m, "getBFCPMode");
                }
                else if (!strcasecmp(action, "sendDTMFchar")){
                    handle_sendDTMF(srv, con, b, m, "sendDTMFChar");
                }
                else if (!strcasecmp(action, "sendDTMFstring")){
                    handle_sendDTMF(srv, con, b, m, "sendDTMF");
                }
                else if (!strcasecmp(action, "transfernumber")){
                    handle_transfernumber(srv, con, b, m, "blinderTransferTo");
                }
                else if (!strcasecmp(action, "issubstreamon")){
                    handle_callservice_by_no_param(srv, con, b, m,"isSubStreamOn");
                }
                else if (!strcasecmp(action, "getconfdtmf")){
                    handle_callservice_by_no_param(srv, con, b, m,"getConfDTMF");
                }
                else if (!strcasecmp(action, "ctrlswitchtosubstream")){
                    handle_callservice_by_one_param(srv, con, b, m,"ison","switchToSubStream",0);
                }
                else if (!strcasecmp(action, "isBFCPSupport")){
                    handle_getBFCPSupport(srv, con, b, m);
                }
                else if (!strcasecmp(action, "isrecording")){
                    handle_callservice_by_no_param(srv, con, b, m,"isRecording");
                }
                else if(!strcasecmp(action, "attendtransfer"))
                {
                    handle_attendtransfer(srv, con, b, m);
                }
                else if(!strcasecmp(action, "attendtransfercancel"))
                {
                    handle_attendtransfercancel(srv, con, b, m);
                }
                else if(!strcasecmp(action, "attendtransfersplit"))
                {
                    handle_attendtransfersplit(srv, con, b, m);
                }
                else if(!strcasecmp(action, "attendtransferline"))
                {
                    handle_attendtransferline(srv, con, b, m);
                }
                else if (!strcasecmp(action, "redialLines")) {
                    handle_callservice_by_one_param(srv, con, b, m,"line","redialLines",0);
                }
                else if(!strcasecmp(action, "setcallmode"))
                {
                    handle_setcallmode(srv, con, b, m);
                }
                else if(!strcasecmp(action, "dialPlanCheck"))
                {
                    handle_dialPlanCheck(srv, con, b, m);
                }
                else if (!strcasecmp(action, "quickStartIPVConf")){
                    handle_callservice_by_one_param(srv, con, b, m, "isvideo", "quickStartIPVConf", 0);
                }
                else if (!strcasecmp(action, "getIPVConfInfo")){
                    handle_callservice_by_no_param(srv, con, b, m, "getIPVConfInfo");
                }
                else if (!strcasecmp(action, "isFECCEnable")){
                    handle_callservice_by_one_param(srv, con, b, m,"line","isFECCEnable",0);
                }
                else if (!strcasecmp(action, "startFECC")){
                    handle_callservice_by_one_param(srv, con, b, m,"line","startFECC",0);
                }
                else if (!strcasecmp(action, "stopFECC")){
                    handle_callservice_by_one_param(srv, con, b, m,"line","stopFECC",0);
                }
                else if (!strcasecmp(action, "FECCpreset")){
                    handle_fecc_preset(b, m);
                }
                else if (!strcasecmp(action, "setlayoutmode")){
                    handle_layoutctrl(srv, con, b, m);
                }
                else if (!strcasecmp(action, "setHDMIOutputMode")){
                    handle_callservice_by_one_param(srv, con, b, m,"mode","setHDMIOutputMode",0);
                }
                else if (!strcasecmp(action, "getlayout")){
                    handle_getlayout(srv, con, b, m);
                }
                else if (!strcasecmp(action, "blockLineOrNot")){
                    handle_callservice_by_one_param(srv, con, b, m,"line","blockLineOrNot",0);
                }
                else if (!strcasecmp(action, "blockAllLinesOrNot")){
                    handle_callservice_by_one_param(srv, con, b, m,"flag","blockAllLinesOrNot",0);
                }
                else if (!strcasecmp(action, "suspendLineOrNot")){
                    handle_callservice_by_one_param(srv, con, b, m,"line","suspendLineOrNot",0);
                }
                else if (!strcasecmp(action, "suspendAllLinesOrNot")){
                    handle_callservice_by_one_param(srv, con, b, m,"flag","suspendAllLinesOrNot",0);
                }
                else if (!strcasecmp(action, "muteAllLinesOrNot")){
                    handle_callservice_by_one_param(srv, con, b, m,"flag","muteAllLinesOrNot",0);
                }else if (!strcasecmp(action, "continueRecordCancel")){
                    handle_sendcontinuerecordCancel(srv, con, b, m);
                }
                else if (!strcasecmp(action, "getcustomslayout")){
                    handle_callservice_by_no_param(srv, con, b, m,"getCustomLayoutStatus");
                }
                else if (!strcasecmp(action, "setcustomlayoutstatus")){
                    //handle_set_customlayout(srv, con, b, m);
                }
                else if (!strcasecmp(action, "getlayoutlineinfo")){
                    handle_getlayoutlineinfo(srv, con, b, m);
                }
                else if (!strcasecmp(action, "gethdmi1displaymode")){
                    handle_callservice_by_no_param(srv, con, b, m,"getHdmiOneDisplayMode");
                }
                else if (!strcasecmp(action, "gethdmi2displaymode")){
                    handle_callservice_by_no_param(srv, con, b, m,"getHdmiTwoDisplayMode");
                }
                else if (!strcasecmp(action, "gethdmi1displaycontent")){
                    handle_callservice_by_no_param(srv, con, b, m,"getOutOneDisplayContent");
                }
                else if (!strcasecmp(action, "gethdmi2displaycontent")){
                    handle_callservice_by_no_param(srv, con, b, m,"getOutTwoDisplayContent");
                }
                else if(!strcasecmp(action, "issysrcmdmode")){
                    handle_callservice_by_no_param(srv, con, b, m,"isRecommendedDisplayMode");
                }
                else if(!strcasecmp(action, "setsysrcmdmode")){
                    handle_callservice_by_no_param(srv, con, b, m,"displayRecommendedMode");
                }
                else if(!strcasecmp(action, "setdefaultaverage")){
                    handle_callservice_by_no_param(srv, con, b, m,"displayDefaultAverage");
                }
                else if(!strcasecmp(action, "setdefaultpop")){
                    handle_callservice_by_no_param(srv, con, b, m,"displayDefaultChildMother");
                }
                else if(!strcasecmp(action, "setdefaultpip")){
                    handle_callservice_by_no_param(srv, con, b, m,"displayDefaultPIP");
                }
                else if(!strcasecmp(action, "setcustommode")){
                    handle_set_customlayout(srv, con, b, m);
                }
                else{
                    findcmd = 0;
                }
            }    
            else if (!strcasecmp(region, "remotekey")){
                if (!strcasecmp(action, "remotekeypress")) {
                    handle_callservice_by_two_param(srv, con, b, m, "keyaction", "keycode", "remoteKeyPress");
                }
                else{
                    findcmd = 0;
                }
            }
        }

        /*else if (!strcasecmp(action, "getnetwork")) {
            handle_getnetwork(b);
        } else if (!strcasecmp(action, "wifiscan")) {
            handle_wifiscan(b);
        }else if (!strcasecmp(action, "wifisave")) {
            handle_wifisave(b);
        } else if (!strcasecmp(action, "putwifiwpapsk")) {
            handle_putwifiwpapsk(b, m);
        } else if (!strcasecmp(action, "phonebookaddr")){
            handle_setPhonebookAddr(srv, con, b, m);
        }else if (!strcasecmp(action, "phoneStatus")) {
            handle_getPhoneStatus(b, m);
        } else if (!strcasecmp(action, "accountStatus")) {
            handle_status(srv,con,b, m);
        } else if (!strcasecmp(action, "fxostatus")) {
            handle_fxostatus(b);
        } else if (!strcasecmp(action, "putdownphbk")) {
            handle_putdownphbk(b, m);
        }   else if (!strcasecmp(action, "getpageitems")) {   //getpageitems
            handle_getPageItems(b);
        } else if (!strcasecmp(action, "sysconfig")) {
            //handle_sysconfig(b, m);
        } else if (!strcasecmp(action, "getapldacct")) {
	    	handle_getapldacct(b, m);
        } else if (!strcasecmp(action, "getblf")) {
            handle_getblf(b, m);
        } else if (!strcasecmp(action, "getmpkinfo")) {
            handle_getmpkinfo(b, m);
        } else if (!strcasecmp(action, "getmpkexist")) {
            handle_getmpkexist(b, m);
        } else if (!strcasecmp(action, "putblf")) {
            handle_putblf(b, m);
        } else if (!strcasecmp(action, "putblfext")) {
            handle_putblfext(b, m);
        } else if (!strcasecmp(action, "putmpkorder")) {
            handle_putmpkorder(b, m);
        } else if (!strcasecmp(action, "gethwservers")) {
            handle_gethwservers(b);
        } else if (!strcasecmp(action, "puthwservers")) {
            handle_puthwservers(b, m);
        } else if (!strcasecmp(action, "putmpk")) {
            handle_putmpk(b, m);
        } else if (!strcasecmp(action, "putblfimage")) {
            handle_putblfimage(b, m);
        } else if (!strcasecmp(action, "putmpkext")) {
			handle_putmpkext(b, m);
        }*/

        if( findcmd == 0 ) {
            resType = msg_get_header(m, "format");
            if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
            {
                temp = "{\"res\": \"error\", \"msg\": \"command not found\"}";
                temp = build_JSON_res( srv, con, m, temp );
                buffer_append_string( b, temp );
                free(temp);
            }
            else
            {
                sprintf(res, "Response=Error\r\nMessage=Command Not Found\r\n");
                buffer_append_string(b, res);
            }
            return -1;
        }

    	return 0;
    } else {
            resType = msg_get_header(m, "format");
            if ( (resType != NULL) && !strcasecmp( resType, "json" ) )
            {
                temp = "{\"res\": \"error\", \"msg\": \"authentication required\"}";
                temp = build_JSON_res( srv, con, m, temp );
                buffer_append_string( b, temp );
                free(temp);
            }
            else
            {
        	buffer_append_string(b,
        		"Response=Error\r\n"
        		"Message=Authentication Required\r\n");
            }
    	return -1;
    }

    return -1;
}

static connection *connections_get_new_connection(server *srv) {
	connections *conns = srv->conns;
	size_t i;

	if (conns->size == 0) {
		conns->size = 128;
		conns->ptr = NULL;
		conns->ptr = malloc(sizeof(*conns->ptr) * conns->size);
		for (i = 0; i < conns->size; i++) {
			conns->ptr[i] = connection_init(srv);
		}
	} else if (conns->size == conns->used) {
		conns->size += 128;
		conns->ptr = realloc(conns->ptr, sizeof(*conns->ptr) * conns->size);

		for (i = conns->used; i < conns->size; i++) {
			conns->ptr[i] = connection_init(srv);
		}
	}

	connection_reset(srv, conns->ptr[conns->used]);
#if 0
	fprintf(stderr, "%s.%d: add: ", __FILE__, __LINE__);
	for (i = 0; i < conns->used + 1; i++) {
		fprintf(stderr, "%d ", conns->ptr[i]->fd);
	}
	fprintf(stderr, "\n");
#endif

	conns->ptr[conns->used]->ndx = conns->used;
	return conns->ptr[conns->used++];
}

static int connection_del(server *srv, connection *con) {
	size_t i;
	connections *conns = srv->conns;
	connection *temp;

	if (con == NULL) return -1;

	if (-1 == con->ndx) return -1;

    buffer_reset(con->uri.authority);
    buffer_reset(con->uri.path);
    buffer_reset(con->uri.query);
    buffer_reset(con->request.orig_uri);

	i = con->ndx;

	/* not last element */

	if (i != conns->used - 1) {
		temp = conns->ptr[i];
		conns->ptr[i] = conns->ptr[conns->used - 1];
		conns->ptr[conns->used - 1] = temp;

		conns->ptr[i]->ndx = i;
		conns->ptr[conns->used - 1]->ndx = -1;
	}

	conns->used--;

	con->ndx = -1;
#if 0
	fprintf(stderr, "%s.%d: del: (%d)", __FILE__, __LINE__, conns->used);
	for (i = 0; i < conns->used; i++) {
		fprintf(stderr, "%d ", conns->ptr[i]->fd);
	}
	fprintf(stderr, "\n");
#endif
	return 0;
}

int connection_close(server *srv, connection *con) {
#ifdef USE_OPENSSL
	server_socket *srv_sock = con->srv_socket;
#endif

#ifdef USE_OPENSSL
	if (srv_sock->is_ssl) {
		if (con->ssl) SSL_free(con->ssl);
		con->ssl = NULL;
	}
#endif

	fdevent_event_del(srv->ev, &(con->fde_ndx), con->fd);
	fdevent_unregister(srv->ev, con->fd);
#ifdef __WIN32
	if (closesocket(con->fd)) {
		log_error_write(srv, __FILE__, __LINE__, "sds",
				"(warning) close:", con->fd, strerror(errno));
	}
#else
	if (close(con->fd)) {
		log_error_write(srv, __FILE__, __LINE__, "sds",
				"(warning) close:", con->fd, strerror(errno));
	}
#endif

	srv->cur_fds--;
#if 0
	log_error_write(srv, __FILE__, __LINE__, "sd",
			"closed()", con->fd);
#endif

	connection_del(srv, con);
	connection_set_state(srv, con, CON_STATE_CONNECT);

	return 0;
}

#if 0
static void dump_packet(const unsigned char *data, size_t len) {
	size_t i, j;

	if (len == 0) return;

	for (i = 0; i < len; i++) {
		if (i % 16 == 0) fprintf(stderr, "  ");

		fprintf(stderr, "%02x ", data[i]);

		if ((i + 1) % 16 == 0) {
			fprintf(stderr, "  ");
			for (j = 0; j <= i % 16; j++) {
				unsigned char c;

				if (i-15+j >= len) break;

				c = data[i-15+j];

				fprintf(stderr, "%c", c > 32 && c < 128 ? c : '.');
			}

			fprintf(stderr, "\n");
		}
	}

	if (len % 16 != 0) {
		for (j = i % 16; j < 16; j++) {
			fprintf(stderr, "   ");
		}

		fprintf(stderr, "  ");
		for (j = i & ~0xf; j < len; j++) {
			unsigned char c;

			c = data[j];
			fprintf(stderr, "%c", c > 32 && c < 128 ? c : '.');
		}
		fprintf(stderr, "\n");
	}
}
#endif

static int connection_handle_read_ssl(server *srv, connection *con) {
#ifdef USE_OPENSSL
    int r, ssl_err, len, count = 0, read_offset, toread;
    buffer *b = NULL;

    if (!con->conf.is_ssl) return -1;

    ERR_clear_error();
    do {
        if (NULL != con->read_queue->last) {
            b = con->read_queue->last->mem;
        }

        if (NULL == b || b->size - b->used < 1024) {
            b = chunkqueue_get_append_buffer(con->read_queue);
            len = SSL_pending(con->ssl);
            if (len < 4*1024) len = 4*1024; /* always alloc >= 4k buffer */
            buffer_prepare_copy(b, len + 1);

            /* overwrite everything with 0 */
            memset(b->ptr, 0, b->size);
        }

        read_offset = (b->used > 0) ? b->used - 1 : 0;
        toread = b->size - 1 - read_offset;

        len = SSL_read(con->ssl, b->ptr + read_offset, toread);

        if (con->renegotiations > 1 && con->conf.ssl_disable_client_renegotiation) {
            connection_set_state(srv, con, CON_STATE_ERROR);
            log_error_write(srv, __FILE__, __LINE__, "s", "SSL: renegotiation initiated by client");
            return -1;
        }

        if (len > 0) {
            if (b->used > 0) b->used--;
            b->used += len;
            b->ptr[b->used++] = '\0';

            con->bytes_read += len;

            count += len;
        }
    } while (len == toread && count < MAX_READ_LIMIT);


    if (len < 0) {
        int oerrno = errno;
        switch ((r = SSL_get_error(con->ssl, len))) {
        case SSL_ERROR_WANT_READ:
        case SSL_ERROR_WANT_WRITE:
            con->is_readable = 0;

            /* the manual says we have to call SSL_read with the same arguments next time.
             * we ignore this restriction; no one has complained about it in 1.5 yet, so it probably works anyway.
             */

            return 0;
        case SSL_ERROR_SYSCALL:
            /**
             * man SSL_get_error()
             *
             * SSL_ERROR_SYSCALL
             *   Some I/O error occurred.  The OpenSSL error queue may contain more
             *   information on the error.  If the error queue is empty (i.e.
             *   ERR_get_error() returns 0), ret can be used to find out more about
             *   the error: If ret == 0, an EOF was observed that violates the
             *   protocol.  If ret == -1, the underlying BIO reported an I/O error
             *   (for socket I/O on Unix systems, consult errno for details).
             *
             */
            while((ssl_err = ERR_get_error())) {
                /* get all errors from the error-queue */
                log_error_write(srv, __FILE__, __LINE__, "sds", "SSL:",
                        r, ERR_error_string(ssl_err, NULL));
            }

            switch(oerrno) {
            default:
                log_error_write(srv, __FILE__, __LINE__, "sddds", "SSL:",
                        len, r, oerrno,
                        strerror(oerrno));
                break;
            }

            break;
        case SSL_ERROR_ZERO_RETURN:
            /* clean shutdown on the remote side */

            if (r == 0) {
                /* FIXME: later */
            }

            /* fall thourgh */
        default:
            while((ssl_err = ERR_get_error())) {
                switch (ERR_GET_REASON(ssl_err)) {
                case SSL_R_SSL_HANDSHAKE_FAILURE:
                case SSL_R_TLSV1_ALERT_UNKNOWN_CA:
                case SSL_R_SSLV3_ALERT_CERTIFICATE_UNKNOWN:
                case SSL_R_SSLV3_ALERT_BAD_CERTIFICATE:
                    if (!con->conf.log_ssl_noise) continue;
                    break;
                default:
                    break;
                }
                /* get all errors from the error-queue */
                log_error_write(srv, __FILE__, __LINE__, "sds", "SSL:",
                                r, ERR_error_string(ssl_err, NULL));
            }
            break;
        }

        connection_set_state(srv, con, CON_STATE_ERROR);

        return -1;
    } else if (len == 0) {
        con->is_readable = 0;
        /* the other end close the connection -> KEEP-ALIVE */

        return -2;
    } else {
        joblist_append(srv, con);
    }

    return 0;
#else
    UNUSED(srv);
    UNUSED(con);
    return -1;
#endif
}

/* 0: everything ok, -1: error, -2: con closed */
static int connection_handle_read(server *srv, connection *con) {
    int len;
    buffer *b;
    int toread, read_offset;

    if (con->conf.is_ssl) {
        return connection_handle_read_ssl(srv, con);
    }

    b = (NULL != con->read_queue->last) ? con->read_queue->last->mem : NULL;

    /* default size for chunks is 4kb; only use bigger chunks if FIONREAD tells
     *  us more than 4kb is available
     * if FIONREAD doesn't signal a big chunk we fill the previous buffer
     *  if it has >= 1kb free
     */
#if defined(__WIN32)
    if (NULL == b || b->size - b->used < 1024) {
        b = chunkqueue_get_append_buffer(con->read_queue);
        buffer_prepare_copy(b, 4 * 1024);
    }

    read_offset = (b->used == 0) ? 0 : b->used - 1;
    len = recv(con->fd, b->ptr + read_offset, b->size - 1 - read_offset, 0);
#else
    if (ioctl(con->fd, FIONREAD, &toread) || toread == 0 || toread <= 4*1024) {
        if (NULL == b || b->size - b->used < 1024) {
            b = chunkqueue_get_append_buffer(con->read_queue);
            buffer_prepare_copy(b, 4 * 1024);
        }
    } else {
        if (toread > MAX_READ_LIMIT) toread = MAX_READ_LIMIT;
        b = chunkqueue_get_append_buffer(con->read_queue);
        buffer_prepare_copy(b, toread + 1);
    }

    read_offset = (b->used == 0) ? 0 : b->used - 1;
    len = read(con->fd, b->ptr + read_offset, b->size - 1 - read_offset);
#endif

    if (len < 0) {
        con->is_readable = 0;

        if (errno == EAGAIN) return 0;
        if (errno == EINTR) {
            /* we have been interrupted before we could read */
            con->is_readable = 1;
            return 0;
        }

        if (errno != ECONNRESET) {
            /* expected for keep-alive */
            log_error_write(srv, __FILE__, __LINE__, "ssd", "connection closed - read failed: ", strerror(errno), errno);
        }

        connection_set_state(srv, con, CON_STATE_ERROR);

        return -1;
    } else if (len == 0) {
        con->is_readable = 0;
        /* the other end close the connection -> KEEP-ALIVE */

        /* pipelining */

        return -2;
    } else if ((size_t)len < b->size - 1) {
        /* we got less then expected, wait for the next fd-event */

        con->is_readable = 0;
    }

    if (b->used > 0) b->used--;
    b->used += len;
    b->ptr[b->used++] = '\0';

    con->bytes_read += len;
#if 0
    dump_packet(b->ptr, len);
#endif

    return 0;
}

static int connection_handle_write_prepare(server *srv, connection *con) {
    int i;
    struct message m;

    if (con->mode == DIRECT) {
        /* static files */
        switch(con->request.http_method) {
        case HTTP_METHOD_GET:
        case HTTP_METHOD_POST:
        case HTTP_METHOD_HEAD:
        case HTTP_METHOD_PUT:
        case HTTP_METHOD_PATCH:
        case HTTP_METHOD_MKCOL:
        case HTTP_METHOD_DELETE:
        case HTTP_METHOD_COPY:
        case HTTP_METHOD_MOVE:
        case HTTP_METHOD_PROPFIND:
        case HTTP_METHOD_PROPPATCH:
        case HTTP_METHOD_LOCK:
        case HTTP_METHOD_UNLOCK:
            break;
        case HTTP_METHOD_OPTIONS:
            /*
             * 400 is coming from the request-parser BEFORE uri.path is set
             * 403 is from the response handler when noone else catched it
             *
             * */
            if ((!con->http_status || con->http_status == 200) && con->uri.path->used &&
                con->uri.path->ptr[0] != '*') {
                response_header_insert(srv, con, CONST_STR_LEN("Allow"), CONST_STR_LEN("OPTIONS, GET, HEAD, POST"));

                con->response.transfer_encoding &= ~HTTP_TRANSFER_ENCODING_CHUNKED;
                con->parsed_response &= ~HTTP_CONTENT_LENGTH;

                con->http_status = 200;
                con->file_finished = 1;

                chunkqueue_reset(con->write_queue);
            }
            break;
        default:
            switch(con->http_status) {
            case 400: /* bad request */
            case 401: /* authorization required */
            case 414: /* overload request header */
            case 505: /* unknown protocol */
            case 207: /* this was webdav */
                break;
            default:
                con->http_status = 501;
                break;
            }
            break;
        }
    }

    if (con->http_status == 0) {
        con->http_status = 403;
    }

    switch(con->http_status) {
    case 404:
        if (!strcasecmp(con->physical.rel_path->ptr, "/manager")) {
            con->http_status = 200;
            if (con->mode != DIRECT) break;

            con->file_finished = 0;

            //struct message m = { 0 };
            m.hdrcount = 0;
                    for (i = 0; i < MAX_MANHEADERS; i++)
                    {
                        m.headers[0] = NULL;
                    }

            //printf("before judeg query\n");
            if (con->uri.query->ptr != NULL) {
                m.headers[m.hdrcount++] = strtok(con->uri.query->ptr, "&");
                //printf("con->uri.query->ptr is %s\n", con->uri.query->ptr);
                while (m.hdrcount < (MAX_MANHEADERS - 1) &&
                    (m.headers[m.hdrcount] = strtok(NULL, "&"))) {
                    //printf("con->uri.query->ptr is %s\n", con->uri.query->ptr);
                    m.hdrcount++;
                }
            }

            buffer_reset(con->physical.path);

            if (!con->file_finished) {
                buffer *b;

                con->file_finished = 1;
                b = chunkqueue_get_append_buffer(con->write_queue);

                response_header_overwrite(srv, con, CONST_STR_LEN("Content-Type"), CONST_STR_LEN("text/plain"));
                response_header_overwrite(srv, con, CONST_STR_LEN("Cache-Control"), CONST_STR_LEN("no-cache"));
                response_header_overwrite(srv, con, CONST_STR_LEN("Pragma"), CONST_STR_LEN("no-cache"));
                process_message(srv, con, b, &m);
            }
            /* fall through */
            break;
        }
        else if (!strcasecmp(con->physical.rel_path->ptr, "/upload")) {
            printf("in upload--------------------\n");
            con->http_status = 200;
            if (con->mode != DIRECT) break;

            con->file_finished = 0;

            m.hdrcount = 0;
            for (i = 0; i < MAX_MANHEADERS; i++)
            {
                m.headers[0] = NULL;
            }

            //printf("before judeg query\n");
            if (con->uri.query->ptr != NULL) {
                m.headers[m.hdrcount++] = strtok(con->uri.query->ptr, "&");
                //printf("con->uri.query->ptr is %s\n", con->uri.query->ptr);
                while (m.hdrcount < (MAX_MANHEADERS - 1) &&
                    (m.headers[m.hdrcount] = strtok(NULL, "&"))) {
                    //printf("con->uri.query->ptr is %s\n", con->uri.query->ptr);
                    m.hdrcount++;
                }
            }

            buffer_reset(con->physical.path);

            if (!con->file_finished) {
                            buffer *b;

                con->file_finished = 1;
                b = chunkqueue_get_append_buffer(con->write_queue);
                            response_header_overwrite(srv, con, CONST_STR_LEN("Content-Type"), CONST_STR_LEN("text/plain"));
                response_header_overwrite(srv, con, CONST_STR_LEN("Cache-Control"), CONST_STR_LEN("no-cache"));
                response_header_overwrite(srv, con, CONST_STR_LEN("Pragma"), CONST_STR_LEN("no-cache"));
                                response_header_overwrite(srv, con, CONST_STR_LEN("Access-Control-Allow-Origin"), CONST_STR_LEN("*"));
                process_upload(srv, con, b, &m);
            }
            /* fall through */
            break;
        }

    case 204: /* class: header only */
    case 205:
    case 304:
        /* disable chunked encoding again as we have no body */
        con->response.transfer_encoding &= ~HTTP_TRANSFER_ENCODING_CHUNKED;
        con->parsed_response &= ~HTTP_CONTENT_LENGTH;
        chunkqueue_reset(con->write_queue);

        con->file_finished = 1;
        break;
    default: /* class: header + body */
        if (con->mode != DIRECT) break;

        if( con->http_status == 200 ){
            char *path = NULL, *pathname = NULL;
            pathname = malloc(128);
            memset(pathname, 0, 128);
            snprintf(pathname, 128, "%s", con->physical.rel_path->ptr);
            //printf("pathname = %s\n", pathname);

            path = strtok(pathname, "/");
            if( path != NULL ){
                //printf("path is %s, pathname is %s\n", path, pathname);
                if (!strcasecmp(path, "ppp")
                        || !strcasecmp(path, "phonebook")
                        || !strcasecmp(path, "logcat")
                        || !strcasecmp(path, "Recording")
                        || !strcasecmp(path, "config")
                        || !strcasecmp(path, "com.base.module.phone")){
                    if( !valid_connection(con) ){
                        printf("not valid connection\n", con->file_finished);
                        con->http_status = 403;
                        chunkqueue_reset(con->write_queue);
                    }
                }
            }
            free(pathname);
        }
        /* only custom body for 4xx and 5xx */
        if (con->http_status < 400 || con->http_status >= 600) break;

        con->file_finished = 0;

        buffer_reset(con->physical.path);

        /* try to send static errorfile */
        if (!buffer_is_empty(con->conf.errorfile_prefix)) {
            stat_cache_entry *sce = NULL;

            buffer_copy_string_buffer(con->physical.path, con->conf.errorfile_prefix);
            buffer_append_long(con->physical.path, con->http_status);
            buffer_append_string_len(con->physical.path, CONST_STR_LEN(".html"));

            if (HANDLER_ERROR != stat_cache_get_entry(srv, con, con->physical.path, &sce)) {
                con->file_finished = 1;

                http_chunk_append_file(srv, con, con->physical.path, 0, sce->st.st_size);
                response_header_overwrite(srv, con, CONST_STR_LEN("Content-Type"), CONST_BUF_LEN(sce->content_type));
            }
        }

        if (!con->file_finished) {
            buffer *b;

            buffer_reset(con->physical.path);

            con->file_finished = 1;
            b = chunkqueue_get_append_buffer(con->write_queue);
            /* build default error-page */
            buffer_copy_string_len(b, CONST_STR_LEN(
                       "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n"
                       "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\"\n"
                       "         \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n"
                       "<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n"
                       " <head>\n"
                       "  <title>"));
            buffer_append_long(b, con->http_status);
            buffer_append_string_len(b, CONST_STR_LEN(" - "));
            buffer_append_string(b, get_http_status_name(con->http_status));

            buffer_append_string_len(b, CONST_STR_LEN(
                         "</title>\n"
                         " </head>\n"
                         " <body>\n"
                         "  <h1>"));
            buffer_append_long(b, con->http_status);
            buffer_append_string_len(b, CONST_STR_LEN(" - "));
            buffer_append_string(b, get_http_status_name(con->http_status));

            buffer_append_string_len(b, CONST_STR_LEN("</h1>\n"
                         " </body>\n"
                         "</html>\n"
                         ));

            response_header_overwrite(srv, con, CONST_STR_LEN("Content-Type"), CONST_STR_LEN("text/html"));
        }
        break;
    }

    if (con->file_finished) {
        /* we have all the content and chunked encoding is not used, set a content-length */

        if ((!(con->parsed_response & HTTP_CONTENT_LENGTH)) &&
            (con->response.transfer_encoding & HTTP_TRANSFER_ENCODING_CHUNKED) == 0) {
            off_t qlen = chunkqueue_length(con->write_queue);

            /**
             * The Content-Length header only can be sent if we have content:
             * - HEAD doesn't have a content-body (but have a content-length)
             * - 1xx, 204 and 304 don't have a content-body (RFC 2616 Section 4.3)
             *
             * Otherwise generate a Content-Length header as chunked encoding is not
             * available
             */
            if ((con->http_status >= 100 && con->http_status < 200) ||
                con->http_status == 204 ||
                con->http_status == 304) {
                data_string *ds;
                /* no Content-Body, no Content-Length */
                if (NULL != (ds = (data_string*) array_get_element(con->response.headers, "Content-Length"))) {
                    buffer_reset(ds->value); /* Headers with empty values are ignored for output */
                }
            } else if (qlen > 0 || con->request.http_method != HTTP_METHOD_HEAD) {
                /* qlen = 0 is important for Redirects (301, ...) as they MAY have
                 * a content. Browsers are waiting for a Content otherwise
                 */
                buffer_copy_off_t(srv->tmp_buf, qlen);

                response_header_overwrite(srv, con, CONST_STR_LEN("Content-Length"), CONST_BUF_LEN(srv->tmp_buf));
            }
        }
    } else {
        /**
         * the file isn't finished yet, but we have all headers
         *
         * to get keep-alive we either need:
         * - Content-Length: ... (HTTP/1.0 and HTTP/1.0) or
         * - Transfer-Encoding: chunked (HTTP/1.1)
         */

        if (((con->parsed_response & HTTP_CONTENT_LENGTH) == 0) &&
            ((con->response.transfer_encoding & HTTP_TRANSFER_ENCODING_CHUNKED) == 0)) {
            con->keep_alive = 0;
        }

        /**
         * if the backend sent a Connection: close, follow the wish
         *
         * NOTE: if the backend sent Connection: Keep-Alive, but no Content-Length, we
         * will close the connection. That's fine. We can always decide the close
         * the connection
         *
         * FIXME: to be nice we should remove the Connection: ...
         */
        if (con->parsed_response & HTTP_CONNECTION) {
            /* a subrequest disable keep-alive although the client wanted it */
            if (con->keep_alive && !con->response.keep_alive) {
                con->keep_alive = 0;
            }
        }
    }

    if (con->request.http_method == HTTP_METHOD_HEAD) {
        /**
         * a HEAD request has the same as a GET
         * without the content
         */
        con->file_finished = 1;

        chunkqueue_reset(con->write_queue);
        con->response.transfer_encoding &= ~HTTP_TRANSFER_ENCODING_CHUNKED;
    }

    http_response_write_header(srv, con);

    return 0;
}

static int connection_handle_write(server *srv, connection *con) {
    switch(network_write_chunkqueue(srv, con, con->write_queue, MAX_WRITE_LIMIT)) {
    case 0:
        con->write_request_ts = srv->cur_ts;
        if (con->file_finished) {
            connection_set_state(srv, con, CON_STATE_RESPONSE_END);
            joblist_append(srv, con);
        }
        break;
    case -1: /* error on our side */
        log_error_write(srv, __FILE__, __LINE__, "sd",
                "connection closed: write failed on fd", con->fd);
        connection_set_state(srv, con, CON_STATE_ERROR);
        joblist_append(srv, con);
        break;
    case -2: /* remote close */
        connection_set_state(srv, con, CON_STATE_ERROR);
        joblist_append(srv, con);
        break;
    case 1:
        con->write_request_ts = srv->cur_ts;
        con->is_writable = 0;

        /* not finished yet -> WRITE */
        break;
    }

    return 0;
}

#ifndef BUILD_RECOVER

int protected_pvalue_find(PvalueList *protected_list, char *pvalue)
{
    int ret = 0;
    //if (strcmp(usertype, "admin"))
    if ( strcmp("admin", curuser) && strcmp("gmiadmin", curuser))
    {
        PvalueList *p = protected_list;
        if( strcmp( protected_list->pvalue, pvalue ) == 0 )
        {
            ret = 1;
        }else
        {
            while(p != NULL)
            {
                printf("in find while pvalue\n");
                if( strcmp( p->pvalue, pvalue ) == 0 )
                {
                    ret = 1;
                    break;
                }else
                {
                    p = p->next;
                }
            }
        }
    }
    //printf("protected_pvalue_find, ret is--------------%d\r\n", ret);

    return ret;
}

int apply_cache_pvalue(int init)
{
    PvalueList *curPtr = pvalue_cache;
    PvalueList *prePtr = curPtr;
    char hdr[64] = "";
    char *val = NULL;
    const char *var = NULL;

    printf("begin apply_cache_pvalue\n" );
    
    while ( curPtr != NULL )
    {
#ifdef BUILD_ON_ARM
        printf("nvram set %s to %s\n", curPtr->pvalue, curPtr->data  );
        nvram_set( curPtr->pvalue, curPtr->data );
#endif
        prePtr = curPtr;
        curPtr = curPtr->next;
        free( prePtr->pvalue );
        free( prePtr->data );
        free( prePtr );
        pvalue_cache = curPtr;
    }

#ifdef BUILD_ON_ARM
    nvram_commit();
#endif

    FILE *file_fd = NULL;
    file_fd = fopen(TEMP_PVALUES, "w+");

    if (file_fd != NULL)
    {
        curPtr = pvalue_cache;
        char *strToWrite = malloc( 512 );
        memset(strToWrite, 0, 512);
        int sizeOfStrToWrite = 512;

        while ( curPtr != NULL )
        {
            if ( sizeOfStrToWrite < ( strlen( strToWrite ) + strlen(curPtr->pvalue ) + strlen(curPtr->data )  + 1 ) ) 
            {
                strToWrite = realloc( strToWrite, sizeOfStrToWrite + 512 );
            }
            snprintf(hdr, sizeof(hdr), "%s=%s\n", var, val);
            strcat( strToWrite, hdr );
            printf("strToWrite is %s\n", strToWrite );
            curPtr = curPtr->next;
        }
        fwrite( strToWrite, 1, strlen(strToWrite), file_fd );
        fclose( file_fd );
        sync();
    }

    if( init )
        dbus_send_cfupdated();

    printf("end apply_cache_pvalue\n" );
    return 0;
}

int init_cache_pvalue()
{
    system("rm /cache/lighttpd-upload-* &");
    char *cmd = NULL;
    cmd = malloc(128);
    snprintf(cmd, 128, "rm %s/Recording.tar.gz &", RECORING_PATH);
    system(cmd);
    free(cmd);
    if( !access(FULL_UPGRADE_PATH, 0) )
    {
        printf("upgrade all file ---EXIST\n");
        unlink(FULL_UPGRADE_PATH);
    }
    //run tcpserver and flashsocket
    system("killall -9 tcpserver");
    system("killall -9 flashsocket");
    system("/system/lighttpd/sbin/tcpserver &");
    system("/system/lighttpd/sbin/flashsocket &");
    //run end
    printf("begin init_cache_pvalue\n" );
    FILE *fp = fopen( TEMP_PVALUES , "r");
    char line[1024] = "";
    char *var = NULL;
    char *val = NULL;
    char *strval = NULL;

    while ((  fp != NULL) && !feof( fp ) ) 
    {
        fgets( &line, sizeof(line), fp );
        printf("line is %s\n", line );
        val = strstr( line, "=");
        if( val != NULL ){
            val += strlen("=");
            strval = strsep(&val, "\n");
        }
        var = strtok( line, "=" );
        if ( var != NULL && strval != NULL )
        {
            printf("var  is %s, strval is %s \n", var, strval  );
            pvalue_cache = pvaluelist_append(pvalue_cache, var, strval );
        }
        memset(line, 0, sizeof(line));
    }

    printf("end init_cache_pvalue\n" );
    return pvalue_cache != NULL;
}


void protected_pvalue_init()
{
    //printf("protected_pvalue_init----------\r\n");
    pvalue_protect = create_list_node("904", "");
    //pvalue_protect = pvaluelist_append(pvalue_protect, "904");
    pvalue_protect = pvaluelist_append(pvalue_protect, "905", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "927", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "924", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "925", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "938", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "939", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "949", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "957", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "956", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "958", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "959", "" );

    /*advset_features page*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "91", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "186", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "277", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "184", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "278", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "71", "" );

     /*advset_genernal page*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "84", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "101", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "39", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "280", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "279", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "281", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "78", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "76", "" );

    /*mainten_update*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "238", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "212", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "192", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "237", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "232", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "233", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "234", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "235", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "145", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "194", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "193", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "88", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "240", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "285", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "286", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "193", "" );

    /*mainten_syslog*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "207", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "208", "" );

    /*mainten_vpnset*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "7050", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7051", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7052", "" );

    /*accountX_sip*/
    /*1*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "410", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "411", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "412", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "471", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "413", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "739", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "415", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "434", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "427", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "432", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "433", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "431", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "435", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "428", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "429", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "430", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "472", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "778", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "448", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "460", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "489", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "4341", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "440", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "441", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "4563", "" );
    /*2*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "510", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "511", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "512", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "571", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "513", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7007", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "515", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "534", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "527", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "532", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "533", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "531", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "535", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "528", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "529", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "530", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "572", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7008", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "548", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7002", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7019", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7022", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "540", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "541", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7021", "" );
    /*3*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "31", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "81", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "32", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "138", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "40", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "39", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "99", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "260", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "261", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "266", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "267", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "265", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "272", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "262", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "263", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "264", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "289", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "78", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "130", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "4562", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "291", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "288", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "4340", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "209", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "250", "" );

    /*accountX_network*/
    /*1*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "403", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "408", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "414", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "447", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "418", "" );
    /*2*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "503", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "508", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "514", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "547", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "518", "" );
    /*0*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "48", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "103", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "52", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "131", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "197", "" );

    /*accountX_general*/
    /*1*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "401", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "417", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "402", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "404", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "405", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "406", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "426", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "407", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "409", "" );
    /*2x*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "501", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "517", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "502", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "504", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "505", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "506", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "526", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "507", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "509", "" );
    /*0*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "271", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "270", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "47", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "35", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "36", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "34", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "33", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "3", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "63", "" );

    /*accountX_codec*/
    /*1*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "860", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "861", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "862", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "779", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "451", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "452", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "453", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "454", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "455", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "456", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "457", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "464", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "465", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "462", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "473", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "443", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "750", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "737", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "749", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "704", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "705", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "831", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "832", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "461", "" );
    /*2*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "7014", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7015", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7016", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7012", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "551", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "552", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "553", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "554", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "555", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "556", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "557", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "564", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "565", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "562", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "573", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "543", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7001", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7003", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7009", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7011", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7010", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7017", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7018", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "561", "" );
    /*0*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "850", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "851", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "852", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "79", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "57", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "58", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "59", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "60", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "61", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "62", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "46", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "295", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "296", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "293", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "350", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "183", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "50", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "37", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "49", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "96", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "97", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "133", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "132", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "292", "" );

    /*accountX_callset*/
    /*1*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "419", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "459", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "422", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "469", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "425", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "421", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "468", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "446", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "423", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "424", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "420", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "470", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "forward_1", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "busyForward_1", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "delayedForward_1", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "816", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "4561", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7023", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "772", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "4561", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "816", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "881", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "883", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "885", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "880", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "882", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "884", "" );
    /*2*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "519", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "559", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "522", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "569", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "525", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "521", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "568", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "546", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "523", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "524", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "520", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "570", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "forward_2", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "busyForward_2", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "delayedForward_2", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7006", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7020", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7004", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7005", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7020", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "7006", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "581", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "583", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "585", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "580", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "582", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "584", "" );
    /*0x*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "66", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "290", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "29", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "135", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "90", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "65", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "268", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "129", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "104", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "198", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "191", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "forward_0", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "busyForward_0", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "delayedForward_0", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "139", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "185", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "4560", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "85", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "72", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "4560", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "185", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "871", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "873", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "875", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "870", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "872", "" );
    pvalue_protect = pvaluelist_append(pvalue_protect, "874", "" );

    /*Admin password*/
    pvalue_protect = pvaluelist_append(pvalue_protect, "2", "" );

    //PrintSqList(pvalue_protect);

    //return pvalue_protect;
}

int protected_command_find(PvalueList *protected_list, char *command)
{
    //return 0;
    int ret = 0;

    //if (strcmp(usertype, "admin"))
    if( strcmp("admin", curuser) && strcmp("gmiadmin", curuser))
    {
        PvalueList *p = protected_list;
        if( strcmp( protected_list->pvalue, command ) == 0 )
        {
            ret = 1;
        }else
        {
            while(p != NULL)
            {
                if( strcmp( p->pvalue, command ) == 0 )
                {
                    ret = 1;
                    break;
                }else
                {
                    p = p->next;
                }
            }
        }
    }

    return ret;
}

//PvalueList* protected_command_init()
void protected_command_init()
{
    command_protect = create_list_node("factset", "");
    command_protect = pvaluelist_append(pvalue_protect, "saveconf", "" );
    command_protect = pvaluelist_append(pvalue_protect, "upgradenow", "" );
    command_protect = pvaluelist_append(pvalue_protect, "provisioninit", "" );
    command_protect = pvaluelist_append(pvalue_protect, "initupstatus", "" );
    //return command_protect;
}

void free_pvaluelist(PvalueList *protect_list)
{
    PvalueList *iterator = NULL;
    PvalueList *head = protect_list;
    char *string = NULL;

    for (; head != NULL; head = iterator)
    {
        string = iterator->data;
        iterator = head->next;
        free(string);
        free(head);
    }

    /*for (iterator = protect_list; iterator; )
    {
        string = iterator->data;
        iterator = iterator->next;
        protect_list = g_list_remove(protect_list, string);
        free(string);
    }
    g_list_free(protect_list);*/
}
#endif

connection *connection_init(server *srv) {
	connection *con;

	UNUSED(srv);

	con = calloc(1, sizeof(*con));

	con->fd = 0;
	con->ndx = -1;
	con->fde_ndx = -1;
	con->bytes_written = 0;
	con->bytes_read = 0;
	con->bytes_header = 0;
	con->loops_per_request = 0;

#define CLEAN(x) \
	con->x = buffer_init();

	CLEAN(request.uri);
	CLEAN(request.request_line);
	CLEAN(request.request);
	CLEAN(request.pathinfo);

	CLEAN(request.orig_uri);

	CLEAN(uri.scheme);
	CLEAN(uri.authority);
	CLEAN(uri.path);
	CLEAN(uri.path_raw);
	CLEAN(uri.query);

	CLEAN(physical.doc_root);
	CLEAN(physical.path);
	CLEAN(physical.basedir);
	CLEAN(physical.rel_path);
	CLEAN(physical.etag);
	CLEAN(parse_request);

	CLEAN(authed_user);
	CLEAN(server_name);
	CLEAN(error_handler);
	CLEAN(dst_addr_buf);

#if defined USE_OPENSSL && ! defined OPENSSL_NO_TLSEXT
    CLEAN(tlsext_server_name);
#endif

#undef CLEAN
	con->write_queue = chunkqueue_init();
	con->read_queue = chunkqueue_init();
	con->request_content_queue = chunkqueue_init();
	chunkqueue_set_tempdirs(con->request_content_queue, srv->srvconf.upload_tempdirs);

	con->request.headers      = array_init();
	con->response.headers     = array_init();
	con->environment     = array_init();

	/* init plugin specific connection structures */

	con->plugin_ctx = calloc(1, (srv->plugins.used + 1) * sizeof(void *));

	con->cond_cache = calloc(srv->config_context->used, sizeof(cond_cache_t));
	config_setup_connection(srv, con);

	return con;
}

void connections_free(server *srv) {
	connections *conns = srv->conns;
	size_t i;

	for (i = 0; i < conns->size; i++) {
		connection *con = conns->ptr[i];

		connection_reset(srv, con);

		chunkqueue_free(con->write_queue);
		chunkqueue_free(con->read_queue);
		chunkqueue_free(con->request_content_queue);
		array_free(con->request.headers);
		array_free(con->response.headers);
		array_free(con->environment);

#define CLEAN(x) \
	buffer_free(con->x);

		CLEAN(request.uri);
		CLEAN(request.request_line);
		CLEAN(request.request);
		CLEAN(request.pathinfo);

		CLEAN(request.orig_uri);

		CLEAN(uri.scheme);
		CLEAN(uri.authority);
		CLEAN(uri.path);
		CLEAN(uri.path_raw);
		CLEAN(uri.query);

		CLEAN(physical.doc_root);
		CLEAN(physical.path);
		CLEAN(physical.basedir);
		CLEAN(physical.etag);
		CLEAN(physical.rel_path);
		CLEAN(parse_request);

		CLEAN(authed_user);
		CLEAN(server_name);
		CLEAN(error_handler);
		CLEAN(dst_addr_buf);
#if defined USE_OPENSSL && ! defined OPENSSL_NO_TLSEXT
        CLEAN(tlsext_server_name);
#endif

#undef CLEAN
		free(con->plugin_ctx);
		free(con->cond_cache);

		free(con);
	}

	free(conns->ptr);
}


int connection_reset(server *srv, connection *con) {
    size_t i;

    plugins_call_connection_reset(srv, con);

    con->is_readable = 1;
    con->is_writable = 1;
    con->http_status = 0;
    con->file_finished = 0;
    con->file_started = 0;
    con->got_response = 0;

    con->parsed_response = 0;

    con->bytes_written = 0;
    con->bytes_written_cur_second = 0;
    con->bytes_read = 0;
    con->bytes_header = 0;
    con->loops_per_request = 0;

    con->request.http_method = HTTP_METHOD_UNSET;
    con->request.http_version = HTTP_VERSION_UNSET;

    con->request.http_if_modified_since = NULL;
    con->request.http_if_none_match = NULL;

    con->response.keep_alive = 0;
    con->response.content_length = -1;
    con->response.transfer_encoding = 0;

    con->mode = DIRECT;

#define CLEAN(x) \
    if (con->x) buffer_reset(con->x);

    CLEAN(request.uri);
    CLEAN(request.request_line);
    CLEAN(request.pathinfo);
    CLEAN(request.request);

    /* CLEAN(request.orig_uri); */

    CLEAN(uri.scheme);
    /* CLEAN(uri.authority); */
    /* CLEAN(uri.path); */
    CLEAN(uri.path_raw);
    /* CLEAN(uri.query); */

    CLEAN(physical.doc_root);
    CLEAN(physical.path);
    CLEAN(physical.basedir);
    CLEAN(physical.rel_path);
    CLEAN(physical.etag);

    CLEAN(parse_request);

    CLEAN(authed_user);
    CLEAN(server_name);
    CLEAN(error_handler);
#if defined USE_OPENSSL && ! defined OPENSSL_NO_TLSEXT
    CLEAN(tlsext_server_name);
#endif
#undef CLEAN

#define CLEAN(x) \
    if (con->x) con->x->used = 0;

#undef CLEAN

#define CLEAN(x) \
        con->request.x = NULL;

    CLEAN(http_host);
    CLEAN(http_range);
    CLEAN(http_content_type);
#undef CLEAN
    con->request.content_length = 0;

    array_reset(con->request.headers);
    array_reset(con->response.headers);
    array_reset(con->environment);

    chunkqueue_reset(con->write_queue);
    chunkqueue_reset(con->request_content_queue);

    /* the plugins should cleanup themself */
    for (i = 0; i < srv->plugins.used; i++) {
        plugin *p = ((plugin **)(srv->plugins.ptr))[i];
        plugin_data *pd = p->data;

        if (!pd) continue;

        if (con->plugin_ctx[pd->id] != NULL) {
            log_error_write(srv, __FILE__, __LINE__, "sb", "missing cleanup in", p->name);
        }

        con->plugin_ctx[pd->id] = NULL;
    }

    /* The cond_cache gets reset in response.c */
    /* config_cond_cache_reset(srv, con); */

    con->header_len = 0;
    con->in_error_handler = 0;

    config_setup_connection(srv, con);

    return 0;
}

/**
 * handle all header and content read
 *
 * we get called by the state-engine and by the fdevent-handler
 */
static int connection_handle_read_state(server *srv, connection *con)  {
	connection_state_t ostate = con->state;
	chunk *c, *last_chunk;
	off_t last_offset;
	chunkqueue *cq = con->read_queue;
	chunkqueue *dst_cq = con->request_content_queue;
	int is_closed = 0; /* the connection got closed, if we don't have a complete header, -> error */

	if (con->is_readable) {
		con->read_idle_ts = srv->cur_ts;

		switch(connection_handle_read(srv, con)) {
		case -1:
			return -1;
		case -2:
			is_closed = 1;
			break;
		default:
			break;
		}
	}

	/* the last chunk might be empty */
	for (c = cq->first; c;) {
		if (cq->first == c && c->mem->used == 0) {
			/* the first node is empty */
			/* ... and it is empty, move it to unused */

			cq->first = c->next;
			if (cq->first == NULL) cq->last = NULL;

			c->next = cq->unused;
			cq->unused = c;
			cq->unused_chunks++;

			c = cq->first;
		} else if (c->next && c->next->mem->used == 0) {
			chunk *fc;
			/* next node is the last one */
			/* ... and it is empty, move it to unused */

			fc = c->next;
			c->next = fc->next;

			fc->next = cq->unused;
			cq->unused = fc;
			cq->unused_chunks++;

			/* the last node was empty */
			if (c->next == NULL) {
				cq->last = c;
			}

			c = c->next;
		} else {
			c = c->next;
		}
	}

    /* we might have got several packets at once
	 */

    switch(ostate) {
    case CON_STATE_READ:
        /* if there is a \r\n\r\n in the chunkqueue
         *
         * scan the chunk-queue twice
         * 1. to find the \r\n\r\n
         * 2. to copy the header-packet
         *
         */

        last_chunk = NULL;
        last_offset = 0;

        for (c = cq->first; c; c = c->next) {
            buffer b;
            size_t i;

            b.ptr = c->mem->ptr + c->offset;
            b.used = c->mem->used - c->offset;
            if (b.used > 0) b.used--; /* buffer "used" includes terminating zero */

            for (i = 0; i < b.used; i++) {
                char ch = b.ptr[i];

                if ('\r' == ch) {
                    /* chec if \n\r\n follows */
                    size_t j = i+1;
                    chunk *cc = c;
                    const char header_end[] = "\r\n\r\n";
                    int header_end_match_pos = 1;

                    for ( ; cc; cc = cc->next, j = 0 ) {
                        buffer bb;
                        bb.ptr = cc->mem->ptr + cc->offset;
                        bb.used = cc->mem->used - cc->offset;
                        if (bb.used > 0) bb.used--; /* buffer "used" includes terminating zero */

                        for ( ; j < bb.used; j++) {
                            ch = bb.ptr[j];

                            if (ch == header_end[header_end_match_pos]) {
                                header_end_match_pos++;
                                if (4 == header_end_match_pos) {
                                    last_chunk = cc;
                                    last_offset = j+1;
                                    goto found_header_end;
                                }
                            } else {
                                goto reset_search;
                            }
                        }
                    }
                }
reset_search: ;
            }
        }
found_header_end:

		/* found */
		if (last_chunk) {
			buffer_reset(con->request.request);

			for (c = cq->first; c; c = c->next) {
				buffer b;

				b.ptr = c->mem->ptr + c->offset;
				b.used = c->mem->used - c->offset;

				if (c == last_chunk) {
					b.used = last_offset + 1;
				}

				buffer_append_string_buffer(con->request.request, &b);

				if (c == last_chunk) {
					c->offset += last_offset;

					break;
				} else {
					/* the whole packet was copied */
					c->offset = c->mem->used - 1;
				}
			}

			connection_set_state(srv, con, CON_STATE_REQUEST_END);
		} else if (chunkqueue_length(cq) > 64 * 1024) {
			log_error_write(srv, __FILE__, __LINE__, "s", "oversized request-header -> sending Status 414");

			con->http_status = 414; /* Request-URI too large */
			con->keep_alive = 0;
			connection_set_state(srv, con, CON_STATE_HANDLE_REQUEST);
		}
		break;
	case CON_STATE_READ_POST:
		for (c = cq->first; c && (dst_cq->bytes_in != (off_t)con->request.content_length); c = c->next) {
			off_t weWant, weHave, toRead;

			weWant = con->request.content_length - dst_cq->bytes_in;

			assert(c->mem->used);

			weHave = c->mem->used - c->offset - 1;

			toRead = weHave > weWant ? weWant : weHave;

			/* the new way, copy everything into a chunkqueue whcih might use tempfiles */
            //printf("upload file length is %d\n", con->request.content_length);
            if (con->request.content_length > 64 * 1024) {
				chunk *dst_c = NULL;
				/* copy everything to max 1Mb sized tempfiles */

				/*
				 * if the last chunk is
				 * - smaller than 1Mb (size < 1Mb)
				 * - not read yet (offset == 0)
				 * -> append to it
				 * otherwise
				 * -> create a new chunk
				 *
				 * */

				if (dst_cq->last &&
				    dst_cq->last->type == FILE_CHUNK &&
				    dst_cq->last->file.is_temp &&
				    dst_cq->last->offset == 0) {
					/* ok, take the last chunk for our job */

                if (dst_cq->last->file.length < 1 * 1024 * 1024) {
						dst_c = dst_cq->last;

						if (dst_c->file.fd == -1) {
							/* this should not happen as we cache the fd, but you never know */
							dst_c->file.fd = open(dst_c->file.name->ptr, O_WRONLY | O_APPEND);
#ifdef FD_CLOEXEC
                            fcntl(dst_c->file.fd, F_SETFD, FD_CLOEXEC);
#endif
						}
					} else {
						/* the chunk is too large now, close it */
						dst_c = dst_cq->last;

						if (dst_c->file.fd != -1) {
							close(dst_c->file.fd);
							dst_c->file.fd = -1;
						}
						dst_c = chunkqueue_get_append_tempfile(dst_cq);
					}
				} else {
					dst_c = chunkqueue_get_append_tempfile(dst_cq);
				}

				/* we have a chunk, let's write to it */

				if (dst_c->file.fd == -1) {
					/* we don't have file to write to,
					 * EACCES might be one reason.
					 *
					 * Instead of sending 500 we send 413 and say the request is too large
					 *  */

					log_error_write(srv, __FILE__, __LINE__, "sbs",
							"denying upload as opening to temp-file for upload failed:",
							dst_c->file.name, strerror(errno));

					con->http_status = 413; /* Request-Entity too large */
					con->keep_alive = 0;
					connection_set_state(srv, con, CON_STATE_HANDLE_REQUEST);

					break;
				}

				if (toRead != write(dst_c->file.fd, c->mem->ptr + c->offset, toRead)) {
					/* write failed for some reason ... disk full ? */
					log_error_write(srv, __FILE__, __LINE__, "sbs",
							"denying upload as writing to file failed:",
							dst_c->file.name, strerror(errno));

					con->http_status = 413; /* Request-Entity too large */
					con->keep_alive = 0;
					connection_set_state(srv, con, CON_STATE_HANDLE_REQUEST);

					close(dst_c->file.fd);
					dst_c->file.fd = -1;

					break;
				}

				dst_c->file.length += toRead;

				if (dst_cq->bytes_in + toRead == (off_t)con->request.content_length) {
					/* we read everything, close the chunk */
					close(dst_c->file.fd);
					dst_c->file.fd = -1;
				}
			} else {
				buffer *b;

                if (dst_cq->last &&
                    dst_cq->last->type == MEM_CHUNK) {
                    b = dst_cq->last->mem;
                } else {
                    b = chunkqueue_get_append_buffer(dst_cq);
                    /* prepare buffer size for remaining POST data; is < 64kb */
                    buffer_prepare_copy(b, con->request.content_length - dst_cq->bytes_in + 1);
                }
                buffer_append_string_len(b, c->mem->ptr + c->offset, toRead);
			}

			c->offset += toRead;
			dst_cq->bytes_in += toRead;
		}

		/* Content is ready */
		if (dst_cq->bytes_in == (off_t)con->request.content_length) {
			connection_set_state(srv, con, CON_STATE_HANDLE_REQUEST);
		}

		break;
	case CON_STATE_READ_CONTINUOUS:
		break;
	default: break;
	}

	/* the connection got closed and we didn't got enough data to leave one of the READ states
	 * the only way is to leave here */
	if (is_closed && ostate == con->state) {
		connection_set_state(srv, con, CON_STATE_ERROR);
	}

	chunkqueue_remove_finished_chunks(cq);

	return 0;
}

static handler_t connection_handle_fdevent(server *srv, void *context, int revents) {
    connection *con = context;

    joblist_append(srv, con);

    if (con->conf.is_ssl) {
        /* ssl may read and write for both reads and writes */
        if (revents & (FDEVENT_IN | FDEVENT_OUT)) {
            con->is_readable = 1;
            con->is_writable = 1;
        }
    } else {
        if (revents & FDEVENT_IN) {
            con->is_readable = 1;
        }
        if (revents & FDEVENT_OUT) {
            con->is_writable = 1;
            /* we don't need the event twice */
        }
    }


    if (revents & ~(FDEVENT_IN | FDEVENT_OUT)) {
        /* looks like an error */

        /* FIXME: revents = 0x19 still means that we should read from the queue */
        if (revents & FDEVENT_HUP) {
            if (con->state == CON_STATE_CLOSE) {
                con->close_timeout_ts = srv->cur_ts - (HTTP_LINGER_TIMEOUT+1);
            } else {
                /* sigio reports the wrong event here
                 *
                 * there was no HUP at all
                 */
#ifdef USE_LINUX_SIGIO
                if (srv->ev->in_sigio == 1) {
                    log_error_write(srv, __FILE__, __LINE__, "sd",
                        "connection closed: poll() -> HUP", con->fd);
                } else {
                    connection_set_state(srv, con, CON_STATE_ERROR);
                }
#else
                connection_set_state(srv, con, CON_STATE_ERROR);
#endif

            }
        } else if (revents & FDEVENT_ERR) {
            /* error, connection reset, whatever... we don't want to spam the logfile */
#if 0
            log_error_write(srv, __FILE__, __LINE__, "sd",
                    "connection closed: poll() -> ERR", con->fd);
#endif
            connection_set_state(srv, con, CON_STATE_ERROR);
        } else {
            log_error_write(srv, __FILE__, __LINE__, "sd",
                    "connection closed: poll() -> ???", revents);
        }
    }

    if (con->state == CON_STATE_READ ||
        con->state == CON_STATE_READ_POST) {
        connection_handle_read_state(srv, con);
    }

    if (con->state == CON_STATE_WRITE &&
        !chunkqueue_is_empty(con->write_queue) &&
        con->is_writable) {

        if (-1 == connection_handle_write(srv, con)) {
            connection_set_state(srv, con, CON_STATE_ERROR);

            log_error_write(srv, __FILE__, __LINE__, "ds",
                    con->fd,
                    "handle write failed.");
        }
    }

    if (con->state == CON_STATE_CLOSE) {
        /* flush the read buffers */
        int len;
        char buf[1024];

        len = read(con->fd, buf, sizeof(buf));
        if (len == 0 || (len < 0 && errno != EAGAIN && errno != EINTR) ) {
            con->close_timeout_ts = srv->cur_ts - (HTTP_LINGER_TIMEOUT+1);
        }
    }

    return HANDLER_FINISHED;
}

connection *connection_accept(server *srv, server_socket *srv_socket) {
	/* accept everything */

	/* search an empty place */
	int cnt;
	sock_addr cnt_addr;
	socklen_t cnt_len;
	/* accept it and register the fd */

	/**
	 * check if we can still open a new connections
	 *
	 * see #1216
	 */

	if (srv->conns->used >= srv->max_conns) {
		return NULL;
	}

	cnt_len = sizeof(cnt_addr);

	if (-1 == (cnt = accept(srv_socket->fd, (struct sockaddr *) &cnt_addr, &cnt_len))) {
		switch (errno) {
		case EAGAIN:
#if EWOULDBLOCK != EAGAIN
		case EWOULDBLOCK:
#endif
		case EINTR:
			/* we were stopped _before_ we had a connection */
		case ECONNABORTED: /* this is a FreeBSD thingy */
			/* we were stopped _after_ we had a connection */
			break;
		case EMFILE:
			/* out of fds */
			break;
		default:
			log_error_write(srv, __FILE__, __LINE__, "ssd", "accept failed:", strerror(errno), errno);
		}
		return NULL;
	} else {
		connection *con;

		srv->cur_fds++;

		/* ok, we have the connection, register it */
#if 0
		log_error_write(srv, __FILE__, __LINE__, "sd",
				"appected()", cnt);
#endif
		srv->con_opened++;

		con = connections_get_new_connection(srv);

		con->fd = cnt;
		con->fde_ndx = -1;
#if 0
		gettimeofday(&(con->start_tv), NULL);
#endif
		fdevent_register(srv->ev, con->fd, connection_handle_fdevent, con);

		connection_set_state(srv, con, CON_STATE_REQUEST_START);

		con->connection_start = srv->cur_ts;
		con->dst_addr = cnt_addr;
		buffer_copy_string(con->dst_addr_buf, inet_ntop_cache_get_ip(srv, &(con->dst_addr)));
		con->srv_socket = srv_socket;

		if (-1 == (fdevent_fcntl_set(srv->ev, con->fd))) {
			log_error_write(srv, __FILE__, __LINE__, "ss", "fcntl failed: ", strerror(errno));
			return NULL;
		}
#ifdef USE_OPENSSL
		/* connect FD to SSL */
		if (srv_socket->is_ssl) {
			if (NULL == (con->ssl = SSL_new(srv_socket->ssl_ctx))) {
				log_error_write(srv, __FILE__, __LINE__, "ss", "SSL:",
						ERR_error_string(ERR_get_error(), NULL));

				return NULL;
			}

            con->renegotiations = 0;
            SSL_set_app_data(con->ssl, con);
			SSL_set_accept_state(con->ssl);
			con->conf.is_ssl=1;

			if (1 != (SSL_set_fd(con->ssl, cnt))) {
				log_error_write(srv, __FILE__, __LINE__, "ss", "SSL:",
						ERR_error_string(ERR_get_error(), NULL));
				return NULL;
			}
		}
#endif
		return con;
	}
}


int connection_state_machine(server *srv, connection *con) {
	int done = 0, r;
#ifdef USE_OPENSSL
	server_socket *srv_sock = con->srv_socket;
#endif

	if (srv->srvconf.log_state_handling) {
		log_error_write(srv, __FILE__, __LINE__, "sds",
				"state at start",
				con->fd,
				connection_get_state(con->state));
	}

	while (done == 0) {
		size_t ostate = con->state;

		switch (con->state) {
		case CON_STATE_REQUEST_START: /* transient */
			if (srv->srvconf.log_state_handling) {
				log_error_write(srv, __FILE__, __LINE__, "sds",
						"state for fd", con->fd, connection_get_state(con->state));
			}

			con->request_start = srv->cur_ts;
			con->read_idle_ts = srv->cur_ts;

			con->request_count++;
			con->loops_per_request = 0;

			connection_set_state(srv, con, CON_STATE_READ);

			/* patch con->conf.is_ssl if the connection is a ssl-socket already */

#ifdef USE_OPENSSL
			con->conf.is_ssl = srv_sock->is_ssl;
#endif

			break;
		case CON_STATE_REQUEST_END: /* transient */
			if (srv->srvconf.log_state_handling) {
				log_error_write(srv, __FILE__, __LINE__, "sds",
						"state for fd", con->fd, connection_get_state(con->state));
			}

            buffer_reset(con->uri.authority);
            buffer_reset(con->uri.path);
            buffer_reset(con->uri.query);
            buffer_reset(con->request.orig_uri);

			if (http_request_parse(srv, con)) {
				/* we have to read some data from the POST request */

				connection_set_state(srv, con, CON_STATE_READ_POST);

				break;
			}

			connection_set_state(srv, con, CON_STATE_HANDLE_REQUEST);

			break;
		case CON_STATE_HANDLE_REQUEST:
			/*
			 * the request is parsed
			 *
			 * decided what to do with the request
			 * -
			 *
			 *
			 */

			if (srv->srvconf.log_state_handling) {
				log_error_write(srv, __FILE__, __LINE__, "sds",
						"state for fd", con->fd, connection_get_state(con->state));
			}

			switch (r = http_response_prepare(srv, con)) {
			case HANDLER_FINISHED:
				if (con->mode == DIRECT) {
					if (con->http_status == 404 ||
					    con->http_status == 403) {
						/* 404 error-handler */

						if (con->in_error_handler == 0 &&
						    (!buffer_is_empty(con->conf.error_handler) ||
						     !buffer_is_empty(con->error_handler))) {
							/* call error-handler */

							con->error_handler_saved_status = con->http_status;
							con->http_status = 0;

							if (buffer_is_empty(con->error_handler)) {
								buffer_copy_string_buffer(con->request.uri, con->conf.error_handler);
							} else {
								buffer_copy_string_buffer(con->request.uri, con->error_handler);
							}
							buffer_reset(con->physical.path);

							con->in_error_handler = 1;

							connection_set_state(srv, con, CON_STATE_HANDLE_REQUEST);

							done = -1;
							break;
						} else if (con->in_error_handler) {
							/* error-handler is a 404 */

							con->http_status = con->error_handler_saved_status;
						}
					} else if (con->in_error_handler) {
						/* error-handler is back and has generated content */
						/* if Status: was set, take it otherwise use 200 */
					}
				}
				if (con->http_status == 0) con->http_status = 200;

				/* we have something to send, go on */
				connection_set_state(srv, con, CON_STATE_RESPONSE_START);
				break;
			case HANDLER_WAIT_FOR_FD:
				srv->want_fds++;

				fdwaitqueue_append(srv, con);

				connection_set_state(srv, con, CON_STATE_HANDLE_REQUEST);

				break;
			case HANDLER_COMEBACK:
				done = -1;
			case HANDLER_WAIT_FOR_EVENT:
				/* come back here */
				if (con->state == CON_STATE_READ_CONTINUOUS) {
					break;
				}
				connection_set_state(srv, con, CON_STATE_HANDLE_REQUEST);

				break;
			case HANDLER_ERROR:
				/* something went wrong */
				connection_set_state(srv, con, CON_STATE_ERROR);
				break;
			default:
				log_error_write(srv, __FILE__, __LINE__, "sdd", "unknown ret-value: ", con->fd, r);
				break;
			}

			break;
		case CON_STATE_RESPONSE_START:
			/*
			 * the decision is done
			 * - create the HTTP-Response-Header
			 *
			 */

			if (srv->srvconf.log_state_handling) {
				log_error_write(srv, __FILE__, __LINE__, "sds",
						"state for fd", con->fd, connection_get_state(con->state));
			}

			if (-1 == connection_handle_write_prepare(srv, con)) {
				connection_set_state(srv, con, CON_STATE_ERROR);

				break;
			}

			connection_set_state(srv, con, CON_STATE_WRITE);
			break;
		case CON_STATE_RESPONSE_END: /* transient */
			/* log the request */

			if (srv->srvconf.log_state_handling) {
				log_error_write(srv, __FILE__, __LINE__, "sds",
						"state for fd", con->fd, connection_get_state(con->state));
			}

			plugins_call_handle_request_done(srv, con);

			srv->con_written++;

			if (con->keep_alive) {
				connection_set_state(srv, con, CON_STATE_REQUEST_START);

#if 0
				con->request_start = srv->cur_ts;
				con->read_idle_ts = srv->cur_ts;
#endif
			} else {
				switch(r = plugins_call_handle_connection_close(srv, con)) {
				case HANDLER_GO_ON:
				case HANDLER_FINISHED:
					break;
				default:
					log_error_write(srv, __FILE__, __LINE__, "sd", "unhandling return value", r);
					break;
				}

#ifdef USE_OPENSSL
				if (srv_sock->is_ssl) {
					switch (SSL_shutdown(con->ssl)) {
					case 1:
						/* done */
						break;
					case 0:
						/* wait for fd-event
						 *
						 * FIXME: wait for fdevent and call SSL_shutdown again
						 *
						 */

						break;
					default:
						log_error_write(srv, __FILE__, __LINE__, "ss", "SSL:",
								ERR_error_string(ERR_get_error(), NULL));
					}
				}
#endif
                if ((0 == shutdown(con->fd, SHUT_WR))) {
                    con->close_timeout_ts = srv->cur_ts;
                    connection_set_state(srv, con, CON_STATE_CLOSE);
                } else {
                    connection_close(srv, con);
                }

				srv->con_closed++;
			}

			connection_reset(srv, con);

			break;
		case CON_STATE_CONNECT:
			if (srv->srvconf.log_state_handling) {
				log_error_write(srv, __FILE__, __LINE__, "sds",
						"state for fd", con->fd, connection_get_state(con->state));
			}

			chunkqueue_reset(con->read_queue);

			con->request_count = 0;

			break;
        case CON_STATE_CLOSE:
            if (srv->srvconf.log_state_handling) {
                log_error_write(srv, __FILE__, __LINE__, "sds",
                        "state for fd", con->fd, connection_get_state(con->state));
            }

            /* we have to do the linger_on_close stuff regardless
             * of con->keep_alive; even non-keepalive sockets may
             * still have unread data, and closing before reading
             * it will make the client not see all our output.
             */
            {
                int len;
                char buf[1024];

                len = read(con->fd, buf, sizeof(buf));
                if (len == 0 || (len < 0 && errno != EAGAIN && errno != EINTR) ) {
                    con->close_timeout_ts = srv->cur_ts - (HTTP_LINGER_TIMEOUT+1);
                }
            }

            if (srv->cur_ts - con->close_timeout_ts > HTTP_LINGER_TIMEOUT) {
                connection_close(srv, con);

                if (srv->srvconf.log_state_handling) {
                    log_error_write(srv, __FILE__, __LINE__, "sd",
                            "connection closed for fd", con->fd);
                }
            }

            break;
		case CON_STATE_READ_POST:
		case CON_STATE_READ:
		case CON_STATE_READ_CONTINUOUS:
			if (srv->srvconf.log_state_handling) {
				log_error_write(srv, __FILE__, __LINE__, "sds",
						"state for fd", con->fd, connection_get_state(con->state));
			}

			connection_handle_read_state(srv, con);
			if (con->state == CON_STATE_READ_CONTINUOUS) {
				plugins_call_read_continuous(srv, con);
			}
			break;
		case CON_STATE_WRITE:
			if (srv->srvconf.log_state_handling) {
				log_error_write(srv, __FILE__, __LINE__, "sds",
						"state for fd", con->fd, connection_get_state(con->state));
			}

			/* only try to write if we have something in the queue */
			if (!chunkqueue_is_empty(con->write_queue)) {
#if 0
				log_error_write(srv, __FILE__, __LINE__, "dsd",
						con->fd,
						"packets to write:",
						con->write_queue->used);
#endif
			}
			if (!chunkqueue_is_empty(con->write_queue) && con->is_writable) {
				if (-1 == connection_handle_write(srv, con)) {
					log_error_write(srv, __FILE__, __LINE__, "ds",
							con->fd,
							"handle write failed.");
					connection_set_state(srv, con, CON_STATE_ERROR);
                }
			}

			break;
        case CON_STATE_ERROR: /* transient */

            /* even if the connection was drop we still have to write it to the access log */
            if (con->http_status) {
                plugins_call_handle_request_done(srv, con);
            }
#ifdef USE_OPENSSL
            if (srv_sock->is_ssl) {
                int ret, ssl_r;
                unsigned long err;
                ERR_clear_error();
                switch ((ret = SSL_shutdown(con->ssl))) {
                case 1:
                    /* ok */
                    break;
                case 0:
                    ERR_clear_error();
                    if (-1 != (ret = SSL_shutdown(con->ssl))) break;

                    /* fall through */
                default:

                    switch ((ssl_r = SSL_get_error(con->ssl, ret))) {
                    case SSL_ERROR_WANT_WRITE:
                    case SSL_ERROR_WANT_READ:
                        break;
                    case SSL_ERROR_SYSCALL:
                        /* perhaps we have error waiting in our error-queue */
                        if (0 != (err = ERR_get_error())) {
                            do {
                                log_error_write(srv, __FILE__, __LINE__, "sdds", "SSL:",
                                        ssl_r, ret,
                                        ERR_error_string(err, NULL));
                            } while((err = ERR_get_error()));
                        } else if (errno != 0) { /* ssl bug (see lighttpd ticket #2213): sometimes errno == 0 */
                            switch(errno) {
                            case EPIPE:
                            case ECONNRESET:
                                break;
                            default:
                                log_error_write(srv, __FILE__, __LINE__, "sddds", "SSL (error):",
                                    ssl_r, ret, errno,
                                    strerror(errno));
                                break;
                            }
                        }

                        break;
                    default:
                        while((err = ERR_get_error())) {
                            log_error_write(srv, __FILE__, __LINE__, "sdds", "SSL:",
                                    ssl_r, ret,
                                    ERR_error_string(err, NULL));
                        }

                        break;
                    }
                }
            }
            ERR_clear_error();
#endif

            switch(con->mode) {
            case DIRECT:
#if 0
                log_error_write(srv, __FILE__, __LINE__, "sd",
                        "emergency exit: direct",
                        con->fd);
#endif
                break;
            default:
                switch(r = plugins_call_handle_connection_close(srv, con)) {
                case HANDLER_GO_ON:
                case HANDLER_FINISHED:
                    break;
                default:
                    log_error_write(srv, __FILE__, __LINE__, "sd", "unhandling return value", r);
                    break;
                }
                break;
            }

			connection_reset(srv, con);

            /* close the connection */
            if ((0 == shutdown(con->fd, SHUT_WR))) {
                con->close_timeout_ts = srv->cur_ts;
                connection_set_state(srv, con, CON_STATE_CLOSE);

                if (srv->srvconf.log_state_handling) {
                    log_error_write(srv, __FILE__, __LINE__, "sd",
                            "shutdown for fd", con->fd);
                }
            } else {
                connection_close(srv, con);
            }

			con->keep_alive = 0;

			srv->con_closed++;

			break;
		default:
			log_error_write(srv, __FILE__, __LINE__, "sdd",
					"unknown state:", con->fd, con->state);

			break;
		}

		if (done == -1) {
			done = 0;
		} else if (ostate == con->state) {
			done = 1;
		}
	}

	if (srv->srvconf.log_state_handling) {
		log_error_write(srv, __FILE__, __LINE__, "sds",
				"state at exit:",
				con->fd,
				connection_get_state(con->state));
	}

	switch(con->state) {
	case CON_STATE_READ_POST:
	case CON_STATE_READ:
	case CON_STATE_CLOSE:
        fdevent_event_set(srv->ev, &(con->fde_ndx), con->fd, FDEVENT_IN);
		break;
	case CON_STATE_WRITE:
		/* request write-fdevent only if we really need it
		 * - if we have data to write
		 * - if the socket is not writable yet
		 */
		if (!chunkqueue_is_empty(con->write_queue) &&
		    (con->is_writable == 0) &&
		    (con->traffic_limit_reached == 0)) {
            fdevent_event_set(srv->ev, &(con->fde_ndx), con->fd, FDEVENT_OUT);
		} else {
			fdevent_event_del(srv->ev, &(con->fde_ndx), con->fd);
		}
		break;
	case CON_STATE_READ_CONTINUOUS:
		/* leave up to plugins */
		break;
	default:
		fdevent_event_del(srv->ev, &(con->fde_ndx), con->fd);
		break;
	}

	return 0;
}

