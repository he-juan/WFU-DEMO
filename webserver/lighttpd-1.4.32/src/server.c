#include <sys/types.h>
#include <sys/time.h>
#include <sys/stat.h>

#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <time.h>
#include <signal.h>
#include <assert.h>
#include <locale.h>

#include <stdio.h>
#include "version.h"

#include "server.h"
#include "buffer.h"
#include "network.h"
#include "log.h"
#include "keyvalue.h"
#include "response.h"
#include "request.h"
#include "chunk.h"
#include "http_chunk.h"
#include "fdevent.h"
#include "connections.h"
#include "stat_cache.h"
#include "plugin.h"
#include "joblist.h"
#include "network_backends.h"
#ifndef BUILD_RECOVER
#include <dbus/dbus.h>
#include <pthread.h>
#endif

#ifdef BUILD_ON_ARM
#include "nvram.h"
#endif

#ifdef HAVE_GETOPT_H
#include <getopt.h>
#endif

#ifdef HAVE_VALGRIND_VALGRIND_H
#include <valgrind/valgrind.h>
#endif

#ifdef HAVE_SYS_WAIT_H
#include <sys/wait.h>
#endif

#ifdef HAVE_PWD_H
#include <grp.h>
#include <pwd.h>
#endif

#ifdef HAVE_SYS_RESOURCE_H
#include <sys/resource.h>
#endif

#ifdef HAVE_SYS_PRCTL_H
#include <sys/prctl.h>
#endif

#ifdef USE_OPENSSL
# include <openssl/err.h> 
#endif

#ifndef __sgi
/* IRIX doesn't like the alarm based time() optimization */
/* #define USE_ALARM */
#endif

#ifdef HAVE_GETUID
# ifndef HAVE_ISSETUGID

static int l_issetugid(void) {
    return (geteuid() != getuid() || getegid() != getgid());
}

#  define issetugid l_issetugid
# endif
#endif

// signal status arg
#define SIGNAL_STATUS_NWUP      0
#define SIGNAL_STATUS_NWDN      1
#define SIGNAL_STATUS_RGST      2
#define SIGNAL_STATUS_URGST     3
#define SIGNAL_STATUS_SRTP      4

// signal call arg
#define SIGNAL_CALL_IDLE        0
#define SIGNAL_CALL_DIALING     1
#define SIGNAL_CALL_RINGING     2
#define SIGNAL_CALL_CALLING     3
#define SIGNAL_CALL_CONNECTED   4
#define SIGNAL_CALL_HOLD        5
#define SIGNAL_CALL_TRNFED      6
#define SIGNAL_CALL_ENDING      7
#define SIGNAL_CALL_FAILED      8

// signal phonebook download arg
#define SIGNAL_PHONE_BOOK_DOWNLOAD_OK               0     /*Download succeeded*/
#define SIGNAL_PHONE_BOOK_DOWNLOAD_PROCESSING       1      /*It is starting to download*/
#define SIGNAL_PHONE_BOOK_IS_FULL                   2           /*Phone book is full*/
#define SIGNAL_PHONE_BOOK_PARSE_ERR                 3         /*Phone Book file parse failed*/
#define SIGNAL_PHONE_BOOK_DOWNLOAD_ERROR            4       /*Download failed*/
#define SIGNAL_PHONE_BOOK_DOWNLOAD_OFF              5        /*The download mode is set to OFF*/
#define SIGNAL_PHONE_BOOK_DOWNLOAD_URL_INVALID      6      /*Download URL is invalid, NULL or empty*/
#define SIGNAL_PHONE_BOOK_DOWNLOAD_IS_PROCESSING        7     /*The download is processing*/
#define SIGNAL_PHONE_BOOK_GUI_IS_USING                  8          /*GUI is using or in the phone book window*/
#define SIGNAL_PHONE_BOOK_FILE_INVALID                  10          /*Phone book file invalid*/

#define DISPLAY_NAME         "DISPLAY"
#define DBUS_PATH               "/com/grandstream/dbus/gui"
#define DBUS_INTERFACE      "com.grandstream.dbus.signal"
#define SIGNAL_LIGHTTPD     "lighttpd"
#define SIGNAL_STATUS        "status"
#define SIGNAL_CALL             "call"
#define SIGNAL_DEVICE             "device"
#define SIGNAL_CAPTURE       "capture"
#define SIGNAL_PHONE_BOOK_PORTRESPONSE "phbk_export_response"
#define SIGNAL_PHONE_BOOK_RESPONSE "phone_book_response"
#define SIGNAL_RADIO_FAV_RESPONSE    "radio_fav"
#define SIGNAL_VIDEO_FAV_RESPONSE     "youtube_fav"
#define SIGNAL_WDPHOTO_FAV_RESPONSE   "worldphoto_fav"
#define SIGNAL_BOOKMARKS_RESPONSE        "bookmark_response"
#define SIGNAL_WEATHER_FAV_RESPONSE   "weather_fav"
#define SIGNAL_WIFI_SCAN_RESULT             "wifi_scan_result"
#define SIGNAL_LANGUAGE_RELOAD           "lan_reload"
#define SIGNAL_CURRENT_INPUTMETHOD    "inputmethod"
#define SIGNAL_GET_USB_MOUSE                "usbmouse"
#define SIGNAL_COLORE_CHGPWD_RESPONSE                "change_password_response"
#define SIGNAL_PHONEEXIT             "phone_exit"
#define SIGNAL_PHONEINIT             "phone_init"
#define METHOD_GETRINGTONE             "get_ringtone"
#define SIGNAL_LANGUAGE_IMPORT          "importlan_response"
#define SIGNAL_REQUEST_QR_URL       "request_qr_url"
#define SIGNAL_RESPONSE_QR_URL      "response_qr_url"


pthread_mutex_t dbusmutex = PTHREAD_MUTEX_INITIALIZER;
#ifndef BUILD_RECOVER
extern ACCStatus accountstatus;
extern int capmode;
extern int portphbkresponse;
extern int phbkresponse;
extern int radiofavresponse;
extern int videofavresponse;
extern int bookmarksrsps;
extern int wdphotorsps;
extern int weatherfavrsps;
extern int chgcolorepwdrsps;
extern int fxocon;
extern int fxostatus;
extern int wifiscanok;
extern int lan_reload_flag;
extern char *wifiscanresult;
extern int phonerebooting;
extern int importlanrsps;
extern int mpkextstartpvalue[5];
extern char qrtoken[16];

//extern pthread_cond_t changeinput_cond;
//extern pthread_cond_t getusbmouse_cond;

DBusConnection* bus;
DBusConnection *subbus;
extern PvalueList *pvalue_protect;
extern PvalueList *command_protect;

#endif

static volatile sig_atomic_t srv_shutdown = 0;
static volatile sig_atomic_t graceful_shutdown = 0;
static volatile sig_atomic_t handle_sig_alarm = 1;
static volatile sig_atomic_t handle_sig_hup = 0;
static volatile sig_atomic_t forwarded_sig_hup = 0;

#if defined(HAVE_SIGACTION) && defined(SA_SIGINFO)
static volatile siginfo_t last_sigterm_info;
static volatile siginfo_t last_sighup_info;

static void sigaction_handler(int sig, siginfo_t *si, void *context) {
    static siginfo_t empty_siginfo;
    UNUSED(context);

    if (!si) si = &empty_siginfo;

    switch (sig) {
    case SIGTERM:
        srv_shutdown = 1;
        last_sigterm_info = *si;
        break;
    case SIGINT:
        if (graceful_shutdown) {
            srv_shutdown = 1;
        } else {
            graceful_shutdown = 1;
        }
        last_sigterm_info = *si;

        break;
	case SIGALRM: 
		handle_sig_alarm = 1; 
		break;
	case SIGHUP:
		/** 
		 * we send the SIGHUP to all procs in the process-group
		 * this includes ourself
		 * 
		 * make sure we only send it once and don't create a 
		 * infinite loop
		 */
		if (!forwarded_sig_hup) {
			handle_sig_hup = 1;
            last_sighup_info = *si;
		} else {
			forwarded_sig_hup = 0;
		}
		break;
	case SIGCHLD:
		break;
	}
}
#elif defined(HAVE_SIGNAL) || defined(HAVE_SIGACTION)
static void signal_handler(int sig) {
	switch (sig) {
	case SIGTERM: srv_shutdown = 1; break;
	case SIGINT:
	     if (graceful_shutdown) srv_shutdown = 1;
	     else graceful_shutdown = 1;

	     break;
	case SIGALRM: handle_sig_alarm = 1; break;
	case SIGHUP:  handle_sig_hup = 1; break;
	case SIGCHLD:  break;
	}
}
#endif

#ifdef HAVE_FORK
static void daemonize(void) {
#ifdef SIGTTOU
	signal(SIGTTOU, SIG_IGN);
#endif
#ifdef SIGTTIN
	signal(SIGTTIN, SIG_IGN);
#endif
#ifdef SIGTSTP
	signal(SIGTSTP, SIG_IGN);
#endif
	if (0 != fork()) exit(0);

	if (-1 == setsid()) exit(0);

	signal(SIGHUP, SIG_IGN);

	if (0 != fork()) exit(0);

       if (0 != chdir("/")) exit(0);
}
#endif

static server *server_init(void) {
    int i;
    FILE *frandom = NULL;

	server *srv = calloc(1, sizeof(*srv));
	assert(srv);
#define CLEAN(x) \
	srv->x = buffer_init();

	CLEAN(response_header);
	CLEAN(parse_full_path);
	CLEAN(ts_debug_str);
	CLEAN(ts_date_str);
	CLEAN(errorlog_buf);
	CLEAN(response_range);
	CLEAN(tmp_buf);
	srv->empty_string = buffer_init_string("");
	CLEAN(cond_check_buf);

	CLEAN(srvconf.errorlog_file);
    CLEAN(srvconf.breakagelog_file);
	CLEAN(srvconf.groupname);
	CLEAN(srvconf.username);
	CLEAN(srvconf.changeroot);
	CLEAN(srvconf.bindhost);
	CLEAN(srvconf.event_handler);
	CLEAN(srvconf.pid_file);

	CLEAN(tmp_chunk_len);
#undef CLEAN

#define CLEAN(x) \
	srv->x = array_init();

	CLEAN(config_context);
	CLEAN(config_touched);
	CLEAN(status);
#undef CLEAN

	for (i = 0; i < FILE_CACHE_MAX; i++) {
		srv->mtime_cache[i].mtime = (time_t)-1;
		srv->mtime_cache[i].str = buffer_init();
	}

    if ((NULL != (frandom = fopen("/dev/urandom", "rb")) || NULL != (frandom = fopen("/dev/random", "rb")))
                && 1 == fread(srv->entropy, sizeof(srv->entropy), 1, frandom)) {
        unsigned int e;
        memcpy(&e, srv->entropy, sizeof(e) < sizeof(srv->entropy) ? sizeof(e) : sizeof(srv->entropy));
        srand(e);
        srv->is_real_entropy = 1;
    } else {
        unsigned int j;
        srand(time(NULL) ^ getpid());
        srv->is_real_entropy = 0;
        for (j = 0; j < sizeof(srv->entropy); j++)
            srv->entropy[j] = rand();
    }
    if (frandom) fclose(frandom);

	srv->cur_ts = time(NULL);
	srv->startup_ts = srv->cur_ts;

	srv->conns = calloc(1, sizeof(*srv->conns));
	assert(srv->conns);

	srv->joblist = calloc(1, sizeof(*srv->joblist));
	assert(srv->joblist);

	srv->fdwaitqueue = calloc(1, sizeof(*srv->fdwaitqueue));
	assert(srv->fdwaitqueue);

	srv->srvconf.modules = array_init();
	srv->srvconf.modules_dir = buffer_init_string(LIBRARY_DIR);
	srv->srvconf.network_backend = buffer_init();
	srv->srvconf.upload_tempdirs = array_init();
    srv->srvconf.reject_expect_100_with_417 = 1;

    /* use syslog */
    srv->errorlog_fd = STDERR_FILENO;
    srv->errorlog_mode = ERRORLOG_FD;

	srv->split_vals = array_init();

	return srv;
}

static void server_free(server *srv) {
	size_t i;

	for (i = 0; i < FILE_CACHE_MAX; i++) {
		buffer_free(srv->mtime_cache[i].str);
	}

#define CLEAN(x) \
	buffer_free(srv->x);

	CLEAN(response_header);
	CLEAN(parse_full_path);
	CLEAN(ts_debug_str);
	CLEAN(ts_date_str);
	CLEAN(errorlog_buf);
	CLEAN(response_range);
	CLEAN(tmp_buf);
	CLEAN(empty_string);
	CLEAN(cond_check_buf);

	CLEAN(srvconf.errorlog_file);
    CLEAN(srvconf.breakagelog_file);
	CLEAN(srvconf.groupname);
	CLEAN(srvconf.username);
	CLEAN(srvconf.changeroot);
	CLEAN(srvconf.bindhost);
	CLEAN(srvconf.event_handler);
	CLEAN(srvconf.pid_file);
	CLEAN(srvconf.modules_dir);
	CLEAN(srvconf.network_backend);

	CLEAN(tmp_chunk_len);
#undef CLEAN

#if 0
	fdevent_unregister(srv->ev, srv->fd);
#endif
	fdevent_free(srv->ev);

	free(srv->conns);

	if (srv->config_storage) {
		for (i = 0; i < srv->config_context->used; i++) {
			specific_config *s = srv->config_storage[i];

			if (!s) continue;

			buffer_free(s->document_root);
			buffer_free(s->server_name);
			buffer_free(s->server_tag);
			buffer_free(s->ssl_pemfile);
			buffer_free(s->ssl_ca_file);
			buffer_free(s->ssl_cipher_list);
            buffer_free(s->ssl_dh_file);
            buffer_free(s->ssl_ec_curve);
            buffer_free(s->error_handler);
            buffer_free(s->errorfile_prefix);
            array_free(s->mimetypes);
            buffer_free(s->ssl_verifyclient_username);
#ifdef USE_OPENSSL
			SSL_CTX_free(s->ssl_ctx);
#endif
			free(s);
		}
		free(srv->config_storage);
		srv->config_storage = NULL;
	}

#define CLEAN(x) \
	array_free(srv->x);

	CLEAN(config_context);
	CLEAN(config_touched);
	CLEAN(status);
	CLEAN(srvconf.upload_tempdirs);
#undef CLEAN

	joblist_free(srv, srv->joblist);
	fdwaitqueue_free(srv, srv->fdwaitqueue);

	if (srv->stat_cache) {
		stat_cache_free(srv->stat_cache);
	}

	array_free(srv->srvconf.modules);
	array_free(srv->split_vals);

#ifdef USE_OPENSSL
	if (srv->ssl_is_init) {
		CRYPTO_cleanup_all_ex_data();
		ERR_free_strings();
		ERR_remove_state(0);
		EVP_cleanup();
	}
#endif

	free(srv);
}

static void show_version (void) {
#ifdef USE_OPENSSL
# define TEXT_SSL " (ssl)"
#else
# define TEXT_SSL
#endif
    char *b = PACKAGE_DESC TEXT_SSL \
" - a light and fast webserver\n" \
"Build-Date: " __DATE__ " " __TIME__ "\n";
;
#undef TEXT_SSL
	write(STDOUT_FILENO, b, strlen(b));
}

static void show_features (void) {
  const char features[] = ""
#ifdef USE_SELECT
      "\t+ select (generic)\n"
#else
      "\t- select (generic)\n"
#endif
#ifdef USE_POLL
      "\t+ poll (Unix)\n"
#else
      "\t- poll (Unix)\n"
#endif
#ifdef USE_LINUX_SIGIO
      "\t+ rt-signals (Linux 2.4+)\n"
#else
      "\t- rt-signals (Linux 2.4+)\n"
#endif
#ifdef USE_LINUX_EPOLL
      "\t+ epoll (Linux 2.6)\n"
#else
      "\t- epoll (Linux 2.6)\n"
#endif
#ifdef USE_SOLARIS_DEVPOLL
      "\t+ /dev/poll (Solaris)\n"
#else
      "\t- /dev/poll (Solaris)\n"
#endif
#ifdef USE_SOLARIS_PORT
      "\t+ eventports (Solaris)\n"
#else
      "\t- eventports (Solaris)\n"
#endif
#ifdef USE_FREEBSD_KQUEUE
      "\t+ kqueue (FreeBSD)\n"
#else
      "\t- kqueue (FreeBSD)\n"
#endif
#ifdef USE_LIBEV
      "\t+ libev (generic)\n"
#else
      "\t- libev (generic)\n"
#endif
      "\nNetwork handler:\n\n"
#if defined USE_LINUX_SENDFILE
      "\t+ linux-sendfile\n"
#else
      "\t- linux-sendfile\n"
#endif
#if defined USE_FREEBSD_SENDFILE
      "\t+ freebsd-sendfile\n"
#else
      "\t- freebsd-sendfile\n"
#endif
#if defined USE_SOLARIS_SENDFILEV
      "\t+ solaris-sendfilev\n"
#else
      "\t- solaris-sendfilev\n"
#endif
#if defined USE_WRITEV
      "\t+ writev\n"
#else
      "\t- writev\n"
#endif
      "\t+ write\n"
#ifdef USE_MMAP
      "\t+ mmap support\n"
#else
      "\t- mmap support\n"
#endif
      "\nFeatures:\n\n"
#ifdef HAVE_IPV6
      "\t+ IPv6 support\n"
#else
      "\t- IPv6 support\n"
#endif
#if defined HAVE_ZLIB_H && defined HAVE_LIBZ
      "\t+ zlib support\n"
#else
      "\t- zlib support\n"
#endif
#if defined HAVE_BZLIB_H && defined HAVE_LIBBZ2
      "\t+ bzip2 support\n"
#else
      "\t- bzip2 support\n"
#endif
#ifdef HAVE_LIBCRYPT
      "\t+ crypt support\n"
#else
      "\t- crypt support\n"
#endif
#ifdef USE_OPENSSL
      "\t+ SSL Support\n"
#else
      "\t- SSL Support\n"
#endif
#ifdef HAVE_LIBPCRE
      "\t+ PCRE support\n"
#else
      "\t- PCRE support\n"
#endif
#ifdef HAVE_MYSQL
      "\t+ mySQL support\n"
#else
      "\t- mySQL support\n"
#endif
#if defined(HAVE_LDAP_H) && defined(HAVE_LBER_H) && defined(HAVE_LIBLDAP) && defined(HAVE_LIBLBER)
      "\t+ LDAP support\n"
#else
      "\t- LDAP support\n"
#endif
#ifdef HAVE_MEMCACHE_H
      "\t+ memcached support\n"
#else
      "\t- memcached support\n"
#endif
#ifdef HAVE_FAM_H
      "\t+ FAM support\n"
#else
      "\t- FAM support\n"
#endif
#ifdef HAVE_LUA_H
      "\t+ LUA support\n"
#else
      "\t- LUA support\n"
#endif
#ifdef HAVE_LIBXML_H
      "\t+ xml support\n"
#else
      "\t- xml support\n"
#endif
#ifdef HAVE_SQLITE3_H
      "\t+ SQLite support\n"
#else
      "\t- SQLite support\n"
#endif
#ifdef HAVE_GDBM_H
      "\t+ GDBM support\n"
#else
      "\t- GDBM support\n"
#endif
      "\n";
  show_version();
  printf("\nEvent Handlers:\n\n%s", features);
}

static void show_help (void) {
#ifdef USE_OPENSSL
# define TEXT_SSL " (ssl)"
#else
# define TEXT_SSL
#endif
    char *b = PACKAGE_DESC TEXT_SSL " ("__DATE__ " " __TIME__ ")" \
" - a light and fast webserver\n" \
"usage:\n" \
" -f <name>  filename of the config-file\n" \
" -m <name>  module directory (default: "LIBRARY_DIR")\n" \
" -p         print the parsed config-file in internal form, and exit\n" \
" -t         test the config-file, and exit\n" \
" -D         don't go to background (default: go to background)\n" \
" -v         show version\n" \
" -V         show compile-time features\n" \
" -h         show this help\n" \
"\n"
;
#undef TEXT_SSL
#undef TEXT_IPV6
	write(STDOUT_FILENO, b, strlen(b));
}

#ifndef BUILD_RECOVER
static void signal_status_handler( int arg1, int arg2 )
{
    printf("signal_status_handler: %d, %d\r\n", arg1, arg2);
    switch ( arg1 )
    {
        case SIGNAL_STATUS_NWUP:
            break;
        case SIGNAL_STATUS_NWDN:
            break;
        case SIGNAL_STATUS_RGST:
            switch ( arg2 )
            {
                case 0:
                    accountstatus.acc1 = REGISTER;
                    break;
                case 1:
                    accountstatus.acc2 = REGISTER;
                    break;
                case 2:
                    accountstatus.acc3 = REGISTER;
                    break;
                case 3:
                    accountstatus.acc4 = REGISTER;
                    break;
                case 4:
                    accountstatus.acc5 = REGISTER;
                    break;
                case 5:
                    accountstatus.acc6 = REGISTER;
                    break;
                case 8:
                    accountstatus.acch323 = REGISTER;
                    break;
                default:
                    break;
            }
            break;
        case SIGNAL_STATUS_URGST:
            switch ( arg2 )
            {
                case 0:
                    accountstatus.acc1 = UNREGISTER;
                    break;
                case 1:
                    accountstatus.acc2 = UNREGISTER;
                    break;
                case 2:
                    accountstatus.acc3 = UNREGISTER;
                    break;
                case 3:
                    accountstatus.acc4 = UNREGISTER;
                    break;
                case 4:
                    accountstatus.acc5 = UNREGISTER;
                    break;
                case 5:
                    accountstatus.acc6 = UNREGISTER;
                    break;
                case 8:
                    accountstatus.acch323 = UNREGISTER;
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
}

static void signal_capture_handler( int arg1 )
{
    switch ( arg1 )
    {
        case 4:
            capmode = 1;
            break;
        case 5:
            capmode = 2;
            break;
        default:
            break;
    }
}
#endif

#if 0
static void set_call_state( int state, int line, int acct, int msg, char* str, char* str2 )
{
    switch ( state )
    {
        case CALL_IDLE:
        case CALL_ENDING:
            /*switch ( acct )
            {
                case 0:
                    accountstatus.acc1 = IDLE;
                    break;
                case 1:
                    accountstatus.acc2 = IDLE;
                    break;
                case 2:
                    accountstatus.acc3 = IDLE;
                    break;
                default:
                    break;
            }*/
            break;
        case CALL_DIALING:
        case CALL_CALLING:
            /*switch ( acct )
            {
                case 0:
                    accountstatus.acc1 = DIALING;
                    if (accountstatus.acc2 == DIALING)
                    {
                        accountstatus.acc2 = IDLE;
                    }
                    
                    if (accountstatus.acc3 == DIALING)
                    {
                        accountstatus.acc3 = IDLE;
                    }
                    break;
                case 1:
                    accountstatus.acc2 = DIALING;
                    if (accountstatus.acc1 == DIALING)
                    {
                        accountstatus.acc1 = IDLE;
                    }
                    
                    if (accountstatus.acc3 == DIALING)
                    {
                        accountstatus.acc3 = IDLE;
                    }
                    break;
                case 2:
                    accountstatus.acc3 = DIALING;
                    if (accountstatus.acc1 == DIALING)
                    {
                        accountstatus.acc1 = IDLE;
                    }
                    
                    if (accountstatus.acc3 == DIALING)
                    {
                        accountstatus.acc3 = IDLE;
                    }
                    break;
                default:
                    break;
            }*/
            break;
        case CALL_RINGING:
        case CALL_FAILED:
            /*switch ( acct )
            {
                case 0:
                    accountstatus.acc1 = RINGING;
                    break;
                case 1:
                    accountstatus.acc2 = RINGING;
                    break;
                case 2:
                    accountstatus.acc3 = RINGING;
                    break;
                default:
                    break;
            }*/
            break;
        case CALL_CONNECTED:
        case CALL_ONHOLD:
        case CALL_TRANSFERED:
            /*ALL treat as talking*/
            /*switch ( acct )
            {
                case 0:
                    accountstatus.acc1 = CONNECTED;
                    break;
                case 1:
                    accountstatus.acc2 = CONNECTED;
                    break;
                case 2:
                    accountstatus.acc3 = CONNECTED;
                    break;
                default:
                    break;
            }*/
            break;
        default:
            break;
            
    }
}
#endif

#ifndef BUILD_RECOVER
/*Notice: since will block main thread, user can cancle ts by press "Home"( keypad dectet run in other thread),
also call will cancle ts cal( use lighttpd to send cancle socket)*/
static int cancleTS()
{
    printf("want send cancleTS\n");
#ifdef BUILD_ON_ARM    
    char *pValue = nvram_get( "tsSocketReady" );
    if (pValue == NULL || atoi(pValue) == 0)
    {
         printf("not need to send cancleTS\n");
        return 1;
    }
    else
    {
        int s,len;
        struct sockaddr_in remote_addr;
        char buf[] = "cancleTS";
        
        memset( &remote_addr, 0, sizeof( remote_addr ) );
        remote_addr.sin_family = AF_INET;
        remote_addr.sin_port = htons( 4321 );
        remote_addr.sin_addr.s_addr = inet_addr( "127.0.0.1" );

        if ( ( s = socket( AF_INET, SOCK_STREAM, 0 ) ) < 0 )
        {
            printf("create socket failed\n");
            return 1;
        }
        
        if ( connect( s, (struct sockaddr *)&remote_addr, sizeof( struct sockaddr ) ) < 0 )
        {
            printf("connect failed\n");
            return 0;
        }
        printf("sended cancleTS\n");
        len = send( s, buf, strlen( buf ), 0 );
        shutdown( s, 1 );
        close( s );
    }
#endif
    
    return 0;
}

static void set_device_state(int state,int acctnum)
{
    cancleTS();
    if ( acctnum == 3 )
    {
        switch ( state )
        {
            case CALL_IDLE:
            case CALL_ENDING:
                fxostatus = IDLE;
                break;
            case CALL_DIALING:
            case CALL_CALLING:
                fxostatus = DIALING;
                break;
            case CALL_RINGING:
            case CALL_FAILED:
                fxostatus = RINGING;
                break;
            case CALL_CONNECTED:
            case CALL_ONHOLD:
            case CALL_TRANSFERED:
                fxostatus = CONNECTED;
                break;
            default:
                break;
        }
    }
}

static DBusHandlerResult signal_filter2 (DBusConnection *dbconnection, DBusMessage *message, void *user_data)
{
    char* str;
    char* str2;
    //char* str3;
    int i, j, k, m;

    DBusError error;
    dbus_error_init (&error);
    printf("signal_filter2~~-------\r\n");

    if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_STATUS ) ) // signal status
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i,
            DBUS_TYPE_INT32, &j, DBUS_TYPE_INVALID ) )
        {
            printf( "receive status: %d, %d\n", i, j );
            signal_status_handler( i, j );
        }
        else
        {
            printf( "receive status error: %s\n", error.message );
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
            if(i == 8)
            {    
                fxocon = j;
            }
        }
        else
        {
            printf( "receive device error: %s\n", error.message );
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
            set_device_state(i,m);
        }
        else
        {
            printf( "receive call error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_method_call( message, DBUS_INTERFACE, METHOD_GETRINGTONE ) )
        // signal get_rinttone, use to cancle ts calibration, and return ringtone
    {
        cancleTS();
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_PHONEEXIT ) )  //phone start reboot
    {
        printf( "receive SIGNAL_PHONEEXIT ---:\n" );
        phonerebooting = 1;
        accountstatus.acc1 = UNREGISTER;
        accountstatus.acc2 = UNREGISTER;
        accountstatus.acc3 = UNREGISTER;
        accountstatus.acc4 = UNREGISTER;
        accountstatus.acc5 = UNREGISTER;
        accountstatus.acc6 = UNREGISTER;
        //accountstatus.acch323 = UNREGISTER;

        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_PHONEINIT ) )  //phone reboot ok
    {
        phonerebooting = 0;
        //init_register_status();
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_LANGUAGE_RELOAD ) ) // signal language changed
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive language_reload: %d\n", i );
            lan_reload_flag = i;
        }
        else
        {
            printf( "receive language_reload error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CAPTURE ) ) // signal capture
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive capture: %d\n", i );
            signal_capture_handler( i);
        }
        else
        {
            printf( "receive capture error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_PHONE_BOOK_RESPONSE ) ) // signal phonebook
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive phonebook: %d\n", i );
            phbkresponse = i;
        }
        else
        {
            printf( "receive phonebook error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_PHONE_BOOK_PORTRESPONSE ) ) // signal phonebook when export
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive export phonebook: %d\n", i );
            portphbkresponse = i;
        }
        else
        {
            printf( "receive export phonebook error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_LANGUAGE_IMPORT ) ) // signal language import
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive import language response: %d\n", i );
            importlanrsps = i;
        }
        else
        {
            printf( "receive import language response error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_RADIO_FAV_RESPONSE ) ) // signal radio_fav
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive radio_fav: %d\n", i );
            radiofavresponse = i;
        }
        else
        {
            printf( "receive radio_fav error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_VIDEO_FAV_RESPONSE ) ) // signal youtube_fav
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive youtube_fav: %d\n", i );
            videofavresponse = i;
        }
        else
        {
            printf( "receive youtube_fav error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_WDPHOTO_FAV_RESPONSE ) ) // signal worldphoto_fav
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive worldphoto_fav: %d\n", i );
            wdphotorsps = i;
        }
        else
        {
            printf( "receive worldphoto_fav error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_BOOKMARKS_RESPONSE ) ) // signal bookmarks
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive bookmarks: %d\n", i );
            bookmarksrsps = i;
        }
        else
        {
            printf( "receive bookmarks error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_WEATHER_FAV_RESPONSE ) ) // signal weather_fav
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive weather_fav: %d\n", i );
            weatherfavrsps = i;
        }
        else
        {
            printf( "receive weather_fav error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_COLORE_CHGPWD_RESPONSE ) ) // signal change colore password response
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive colore change password response: %d\n", i );
            chgcolorepwdrsps = i;
        }
        else
        {
            printf( "receive weather_fav error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_REQUEST_QR_URL ) ) // signal lcd request qrcode
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_STRING, &str, DBUS_TYPE_INVALID ) )
        {
            char *protocal = nvram_get("900");
            char *port = nvram_get("901");
            if (port == NULL) {
                port = "80";
            }
            int len;

            long unsigned int token = rand();
            snprintf(qrtoken, sizeof(qrtoken), "%08lx", token);

            len = strlen(str) + strlen(qrtoken) + 64;
            char *url = malloc(len);
            memset(url, 0, len);

            if (protocal != NULL && strcmp(protocal, "1") == 0) {
                snprintf(url, len, "https://%s:%s/quickconf.html#%s", str, port, qrtoken);
            } else {
                snprintf(url, len, "http://%s:%s/quickconf.html#%s", str, port, qrtoken);
            }
            
            printf("url: %s\n", url);

            DBusMessage* message;

            if ( bus == NULL )
            {
                printf( "Error: Dbus bus is NULL\n" );
                free(url);
                return DBUS_HANDLER_RESULT_HANDLED;
            }

            message = dbus_message_new_signal( DBUS_PATH, DBUS_INTERFACE, SIGNAL_RESPONSE_QR_URL);
            if ( message == NULL )
            {
                printf( "message is NULL\n" );
                free(url);
                return DBUS_HANDLER_RESULT_HANDLED;
            }

            dbus_message_append_args( message, DBUS_TYPE_STRING, &url, DBUS_TYPE_INVALID );

            dbus_connection_send( bus, message, NULL );
            dbus_message_unref( message );

            free(url);
        }
        else
        {
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    /*else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CURRENT_INPUTMETHOD) ) // signal inputmethod
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_STRING, &str, DBUS_TYPE_INVALID ) )
        {
            printf("receive inputmethod: %s\n", str);
#ifdef BUILD_ON_ARM
        pthread_mutex_lock(&dbusmutex);
#endif
            if (input_method != NULL)
            {
                g_free(input_method);
            }
            input_method = g_strdup_printf("%s", str);
            input_flag = TRUE;
#ifdef BUILD_ON_ARM
            pthread_mutex_unlock(&dbusmutex);
#endif       
            //pthread_cond_signal(&changeinput_cond);     
        }
        else
        {
            printf( "receive weather_fav error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_GET_USB_MOUSE) ) // signal usbmouse
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive usbmouse: %d\n", i);
#ifdef BUILD_ON_ARM
        pthread_mutex_lock(&dbusmutex);
#endif
            if (i == 0)
            {
                exist_usbmouse = FALSE;
            }
            else
            {
                exist_usbmouse = TRUE;
            }
             usbmouse_flag = TRUE;
#ifdef BUILD_ON_ARM
            pthread_mutex_unlock(&dbusmutex);
#endif   
            //pthread_cond_signal(&getusbmouse_cond);
        }
        else
        {
            printf( "receive weather_fav error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }*/
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_WIFI_SCAN_RESULT ) ) // signal wifi scan
    {
        DBusMessageIter args;
        int count = 0, n = 0;
        char tempint[4] = "";

        if ( !dbus_message_iter_init( message, &args ) )
            printf( "Wifi scan result has no args" );
        else if ( DBUS_TYPE_STRING != dbus_message_iter_get_arg_type( &args ) )
            printf( "Wifi scan result arg1 is not string\n" );
        else
            dbus_message_iter_get_basic( &args, &str );
        count ++;

        i = 0;
        j = 0;
        if( wifiscanresult != NULL ){
            free(wifiscanresult);
        }
        wifiscanresult = malloc(1024);
        memset(wifiscanresult, 0, 1024);
        strcpy(wifiscanresult, "{\"Response\":\"Success\",\"wifiscanresult\":[");

        while ( dbus_message_iter_next( &args ) )
        {
            switch(count)
            {
                case 0:
                    if ( DBUS_TYPE_STRING != dbus_message_iter_get_arg_type( &args ) )
                    {
                        printf( "Wifi scan result arg1 is not string\n" );
                        str = NULL;
                    }
                    else
                    {
                        dbus_message_iter_get_basic( &args, &str );
                    }
                    break;
                case 1:
                    if ( DBUS_TYPE_INT32 != dbus_message_iter_get_arg_type( &args ) )
                    {
                        printf( "Wifi scan result arg2 is not int\n" );
                        i = 0;
                    }
                    else
                    {
                        dbus_message_iter_get_basic( &args, &i );
                    }
                    break;
                case 2:
                    if ( DBUS_TYPE_INT32 != dbus_message_iter_get_arg_type( &args ) )
                    {
                        printf( "Wifi scan result arg3 is not int\n" );
                        j = 0;
                    }
                    else
                    {
                        dbus_message_iter_get_basic( &args, &j );
                    }
                    break;
                case 3:
                case 4:
                default:
                    break;
            }
            if (count >= 4)
            {
                if (str != NULL)
                {
                    if(!n)
                        strncat (wifiscanresult, "\"", 1);
                    else
                        strncat (wifiscanresult, ",\"", 2);

                    strncat (wifiscanresult, str, strlen(str) );
                    strncat (wifiscanresult, "(", 1);
                    snprintf(tempint, sizeof(tempint), "%d", i);
                    strncat (wifiscanresult, tempint, strlen(tempint) );
                    strncat (wifiscanresult, ",", 1);
                    snprintf(tempint, sizeof(tempint), "%d", j);
                    strncat (wifiscanresult, tempint, strlen(tempint) );
                    strncat (wifiscanresult, ")\"", 2);
                    n++;
                }
                count = 0;
            }
            else
            {
                count ++;
            }
        }

        strcat (wifiscanresult, "]}");
        wifiscanok = 1;

        if ( count % 3 )
            printf( "Wifi scan result args not match\n" );

        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else 
    {
        printf("Ignore the signal\n");
    }

    return DBUS_HANDLER_RESULT_NOT_YET_HANDLED;
}

static DBusHandlerResult signal_filter (DBusConnection *dbconnection, DBusMessage *message, void *user_data)
{
    /*char* str;
    char* str2;
    char* str3;
    int i, j, k, m;
    */
    //DBusError error;
    //dbus_error_init (&error);
    //Let dbus message process in thread
    #if 0

    if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_STATUS ) ) // signal status
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i,
            DBUS_TYPE_INT32, &j, DBUS_TYPE_INVALID ) )
        {
            printf( "receive status: %d, %d\n", i, j );
            signal_status_handler( i, j );
        }
        else
        {
            printf( "receive status error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    /*else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CALL ) ) // signal call
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
            set_call_state( i, j, m, k, str, str2 );
        }
        else
        {
            printf( "receive call error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }*/
    else if ( dbus_message_is_signal( message, DBUS_INTERFACE, SIGNAL_CAPTURE ) ) // signal call
    {
        if ( dbus_message_get_args( message, &error, DBUS_TYPE_INT32, &i, DBUS_TYPE_INVALID ) )
        {
            printf( "receive capture: %d\n", i );
            signal_capture_handler( i);
        }
        else
        {
            printf( "receive capture error: %s\n", error.message );
            dbus_error_free( &error );
        }
        return DBUS_HANDLER_RESULT_HANDLED;
    }
    else 
    {
        printf("Ignore the signal\n");
    }

    #endif
    return DBUS_HANDLER_RESULT_NOT_YET_HANDLED;
}

void init_register_status(){
    const char *var = NULL;
    var = nvram_safe_get("4921");
    if(strcasecmp(var,"Registered") == 0)
        accountstatus.acc1 = 1;
    else
        accountstatus.acc1 = 0;

    var = nvram_safe_get("4922");
    if(strcasecmp(var,"Registered") == 0)
        accountstatus.acc2 = 1;
    else
        accountstatus.acc2 = 0;

    var = nvram_safe_get("4923");
    if(strcasecmp(var,"Registered") == 0)
        accountstatus.acc3 = 1;
    else
        accountstatus.acc3 = 0;

    var = nvram_safe_get("4924");
    if(strcasecmp(var,"Registered") == 0)
        accountstatus.acc4 = 1;
    else
        accountstatus.acc4 = 0;

    var = nvram_safe_get("4925");
    if(strcasecmp(var,"Registered") == 0)
        accountstatus.acc5 = 1;
    else
        accountstatus.acc5 = 0;

    var = nvram_safe_get("4926");
    if(strcasecmp(var,"Registered") == 0)
        accountstatus.acc6 = 1;
    else
        accountstatus.acc6 = 0;

    var = nvram_safe_get("25056");
    if(strcasecmp(var,"Registered") == 0)
        accountstatus.acch323 = 1;
    else
        accountstatus.acch323 = 0;

}

static void dbus_process()
{
    DBusError suberror;
    pthread_mutex_lock(&dbusmutex);
    //init accountstatus
    init_register_status();
    const char *var = NULL;
    var = nvram_safe_get("ext_rang_start");
    int tmpmpkpvalue = 23000;
    if( !strcasecmp(var,"") == 0) {
        tmpmpkpvalue = atoi(var);
    }
    mpkextstartpvalue[0] = tmpmpkpvalue;
    mpkextstartpvalue[1] = tmpmpkpvalue+1;
    mpkextstartpvalue[2] = tmpmpkpvalue+2;
    mpkextstartpvalue[3] = tmpmpkpvalue+3;
    mpkextstartpvalue[4] = tmpmpkpvalue+4;

    if( access("/sdcard/ppp", 0) ) {
        mkdir("/sdcard/ppp", 0755);
    }

    pthread_mutex_unlock(&dbusmutex);

    dbus_error_init (&suberror);
    subbus = dbus_bus_get (DBUS_BUS_SYSTEM, &suberror);
    if (!subbus)
    {
        printf ("Warning:Failed to connect to the D-BUS daemon: %s", suberror.message);
        dbus_error_free (&suberror);
        return;
    }

    dbus_bus_add_match (subbus, "type='signal',interface='com.grandstream.dbus.signal'", &suberror);
    dbus_bus_add_match (subbus, "type='signal',interface='com.grandstream.dbus.signal.to.web'", &suberror);
    dbus_bus_add_match (subbus, "type='signal',interface='com.grandstream.dbus.signal.to.gui'", &suberror);
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

        printf("dbus select\n");
        int result = select(fd+1, &rd_fds, NULL, NULL, NULL);
        
        if (FD_ISSET(fd, &rd_fds))
        {
            while ( subbus != NULL )
            {
                printf("dbus dispatch\n");
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
                printf( "Failed to connect to Message Bus.Sleep for 3 seconds\r\n");
                sleep( 3 );
            }
            else
            {
                printf( "Failed to start GUI interface\r\n");
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
#endif

int main (int argc, char **argv) {
    server *srv = NULL;
    int print_config = 0;
    int test_config = 0;
    int i_am_root;
    int o;
    int num_childs = 0;
    int pid_fd = -1, fd;
    size_t i;
    const char *display;

#ifdef HAVE_SIGACTION
	struct sigaction act;
#endif
#ifdef HAVE_GETRLIMIT
	struct rlimit rlim;
#endif

#ifdef USE_ALARM
	struct itimerval interval;

	interval.it_interval.tv_sec = 1;
	interval.it_interval.tv_usec = 0;
	interval.it_value.tv_sec = 1;
	interval.it_value.tv_usec = 0;
#endif

        //chdir("/app/bin");

	/* for nice %b handling in strfime() */
	setlocale(LC_TIME, "C");

#ifndef BUILD_RECOVER
        display = getenv(DISPLAY_NAME);
        if (display == 0)
        {
            setenv(DISPLAY_NAME, ":0.0", TRUE);
        }
#endif
        
	if (NULL == (srv = server_init())) {
		fprintf(stderr, "did this really happen?\n");
		return -1;
	}

	/* init structs done */
#if 1
	srv->srvconf.port = 0;
#ifdef HAVE_GETUID
	i_am_root = (getuid() == 0);
#else
	i_am_root = 0;
#endif
	srv->srvconf.dont_daemonize = 0;

	while(-1 != (o = getopt(argc, argv, "f:m:hvVDpt"))) {
		switch(o) {
		case 'f':
            if (srv->config_storage) {
                log_error_write(srv, __FILE__, __LINE__, "s",
                        "Can only read one config file. Use the include command to use multiple config files.");

                server_free(srv);
                return -1;
            }

            //if (config_read(srv, optarg)) {
            if (config_read(srv, "/system/lighttpd/etc/lighttpd.conf")) {
				server_free(srv);
				return -1;
			}
			break;
		case 'm':
			buffer_copy_string(srv->srvconf.modules_dir, optarg);
			break;
		case 'p': print_config = 1; break;
		case 't': test_config = 1; break;
		case 'D': srv->srvconf.dont_daemonize = 1; break;
		case 'v': show_version(); return 0;
		case 'V': show_features(); return 0;
		case 'h': show_help(); return 0;
		default:
			show_help();
			server_free(srv);
			return -1;
		}
	}

	if (!srv->config_storage) {
		log_error_write(srv, __FILE__, __LINE__, "s",
				"No configuration available. Try using -f option.");

		server_free(srv);
		return -1;
	}

	if (print_config) {
		data_unset *dc = srv->config_context->data[0];
		if (dc) {
			dc->print(dc, 0);
			fprintf(stdout, "\n");
		} else {
			/* shouldn't happend */
			fprintf(stderr, "global config not found\n");
		}
	}

	if (test_config) {
		printf("Syntax OK\n");
	}

	if (test_config || print_config) {
		server_free(srv);
		return 0;
	}

	/* close stdin and stdout, as they are not needed */
        /* move stdin to /dev/null */
        if (-1 != (fd = open("/dev/null", O_RDONLY))) {
		close(STDIN_FILENO);
		dup2(fd, STDIN_FILENO);
		close(fd);
        }

        /* move stdout to /dev/null */
        if (-1 != (fd = open("/dev/null", O_WRONLY))) {
		close(STDOUT_FILENO);
		dup2(fd, STDOUT_FILENO);
		close(fd);
        }

	if (0 != config_set_defaults(srv)) {
		log_error_write(srv, __FILE__, __LINE__, "s",
				"setting default values failed");
		server_free(srv);
		return -1;
	}

	/* UID handling */
#ifdef HAVE_GETUID
    if (!i_am_root && issetugid()) {
		/* we are setuid-root */

		log_error_write(srv, __FILE__, __LINE__, "s",
				"Are you nuts ? Don't apply a SUID bit to this binary");

		server_free(srv);
		return -1;
	}
#endif

	/* check document-root */
	if (srv->config_storage[0]->document_root->used <= 1) {
		log_error_write(srv, __FILE__, __LINE__, "s",
				"document-root is not set\n");

		server_free(srv);

		return -1;
	}

	if (plugins_load(srv)) {
		log_error_write(srv, __FILE__, __LINE__, "s",
				"loading plugins finally failed");

		plugins_free(srv);
		server_free(srv);

		return -1;
	}

	/* open pid file BEFORE chroot */
	if (srv->srvconf.pid_file->used) {
		if (-1 == (pid_fd = open(srv->srvconf.pid_file->ptr, O_WRONLY | O_CREAT | O_EXCL | O_TRUNC, S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH))) {
			struct stat st;
			if (errno != EEXIST) {
				log_error_write(srv, __FILE__, __LINE__, "sbs",
					"opening pid-file failed:", srv->srvconf.pid_file, strerror(errno));
				return -1;
			}

			if (0 != stat(srv->srvconf.pid_file->ptr, &st)) {
				log_error_write(srv, __FILE__, __LINE__, "sbs",
						"stating existing pid-file failed:", srv->srvconf.pid_file, strerror(errno));
			}

			if (!S_ISREG(st.st_mode)) {
				log_error_write(srv, __FILE__, __LINE__, "sb",
						"pid-file exists and isn't regular file:", srv->srvconf.pid_file);
				return -1;
			}

			if (-1 == (pid_fd = open(srv->srvconf.pid_file->ptr, O_WRONLY | O_CREAT | O_TRUNC, S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH))) {
				log_error_write(srv, __FILE__, __LINE__, "sbs",
						"opening pid-file failed:", srv->srvconf.pid_file, strerror(errno));
				return -1;
			}
		}
	}

	if (srv->event_handler == FDEVENT_HANDLER_SELECT) {
		/* select limits itself
		 *
		 * as it is a hard limit and will lead to a segfault we add some safety
		 * */
		srv->max_fds = FD_SETSIZE - 200;
	} else {
		srv->max_fds = 4096;
	}

    if (access("/tmp/user.pem", 0)) {
        char *p = nvram_get("8472");
        if (p != NULL && strcmp(p, "") != 0) {
            system("nvram get 8472 > /tmp/user.pem");
        }
    }

	if (i_am_root) {
		struct group *grp = NULL;
		struct passwd *pwd = NULL;
		int use_rlimit = 1;

#ifdef HAVE_VALGRIND_VALGRIND_H
		if (RUNNING_ON_VALGRIND) use_rlimit = 0;
#endif
//tested 1 OK
#ifdef HAVE_GETRLIMIT
		if (0 != getrlimit(RLIMIT_NOFILE, &rlim)) {
			log_error_write(srv, __FILE__, __LINE__,
					"ss", "couldn't get 'max filedescriptors'",
					strerror(errno));
			return -1;
		}

		if (use_rlimit && srv->srvconf.max_fds) {
			/* set rlimits */

			rlim.rlim_cur = srv->srvconf.max_fds;
			rlim.rlim_max = srv->srvconf.max_fds;

			if (0 != setrlimit(RLIMIT_NOFILE, &rlim)) {
				log_error_write(srv, __FILE__, __LINE__,
						"ss", "couldn't set 'max filedescriptors'",
						strerror(errno));
				return -1;
			}
		}

		if (srv->event_handler == FDEVENT_HANDLER_SELECT) {
            srv->max_fds = rlim.rlim_cur < ((int)FD_SETSIZE) - 200 ? rlim.rlim_cur : FD_SETSIZE - 200;
		} else {
			srv->max_fds = rlim.rlim_cur;
		}

		/* set core file rlimit, if enable_cores is set */
		if (use_rlimit && srv->srvconf.enable_cores && getrlimit(RLIMIT_CORE, &rlim) == 0) {
			rlim.rlim_cur = rlim.rlim_max;
			setrlimit(RLIMIT_CORE, &rlim);
		}
#endif
		if (srv->event_handler == FDEVENT_HANDLER_SELECT) {
			/* don't raise the limit above FD_SET_SIZE */
            if (srv->max_fds > ((int)FD_SETSIZE) - 200) {
				log_error_write(srv, __FILE__, __LINE__, "sd",
						"can't raise max filedescriptors above",  FD_SETSIZE - 200,
						"if event-handler is 'select'. Use 'poll' or something else or reduce server.max-fds.");
				return -1;
			}
		}


#ifdef HAVE_PWD_H
		/* set user and group */
		if (srv->srvconf.username->used) {
			if (NULL == (pwd = getpwnam(srv->srvconf.username->ptr))) {
				log_error_write(srv, __FILE__, __LINE__, "sb",
						"can't find username", srv->srvconf.username);
				return -1;
			}

			if (pwd->pw_uid == 0) {
				log_error_write(srv, __FILE__, __LINE__, "s",
						"I will not set uid to 0\n");
				return -1;
			}
		}

		if (srv->srvconf.groupname->used) {
			if (NULL == (grp = getgrnam(srv->srvconf.groupname->ptr))) {
				log_error_write(srv, __FILE__, __LINE__, "sb",
					"can't find groupname", srv->srvconf.groupname);
				return -1;
			}
			if (grp->gr_gid == 0) {
				log_error_write(srv, __FILE__, __LINE__, "s",
						"I will not set gid to 0\n");
				return -1;
			}
		}
#endif
		/* we need root-perms for port < 1024 */
		if (0 != network_init(srv)) {
			plugins_free(srv);
			server_free(srv);

			return -1;
		}
#ifdef HAVE_PWD_H
		/* 
		 * Change group before chroot, when we have access
		 * to /etc/group
		 * */
        if (NULL != grp) {
			setgid(grp->gr_gid);
			setgroups(0, NULL);
			if (srv->srvconf.username->used) {
				initgroups(srv->srvconf.username->ptr, grp->gr_gid);
			}
		}
#endif
#ifdef HAVE_CHROOT
		if (srv->srvconf.changeroot->used) {
			tzset();

			if (-1 == chroot(srv->srvconf.changeroot->ptr)) {
				log_error_write(srv, __FILE__, __LINE__, "ss", "chroot failed: ", strerror(errno));
				return -1;
			}
			if (-1 == chdir("/")) {
				log_error_write(srv, __FILE__, __LINE__, "ss", "chdir failed: ", strerror(errno));
				return -1;
			}
		}
#endif
//tested 2 OK

#ifdef HAVE_PWD_H
		/* drop root privs */
        if (NULL != pwd) {
			setuid(pwd->pw_uid);
		}
#endif
#if defined(HAVE_SYS_PRCTL_H) && defined(PR_SET_DUMPABLE)
		/**
		 * on IRIX 6.5.30 they have prctl() but no DUMPABLE
		 */
		if (srv->srvconf.enable_cores) {
			prctl(PR_SET_DUMPABLE, 1, 0, 0, 0);
		}
#endif
	} else {

#ifdef HAVE_GETRLIMIT
		if (0 != getrlimit(RLIMIT_NOFILE, &rlim)) {
			log_error_write(srv, __FILE__, __LINE__,
					"ss", "couldn't get 'max filedescriptors'",
					strerror(errno));
			return -1;
		}

		/**
		 * we are not root can can't increase the fd-limit, but we can reduce it
		 */
		if (srv->srvconf.max_fds && srv->srvconf.max_fds < rlim.rlim_cur) {
			/* set rlimits */

			rlim.rlim_cur = srv->srvconf.max_fds;

			if (0 != setrlimit(RLIMIT_NOFILE, &rlim)) {
				log_error_write(srv, __FILE__, __LINE__,
						"ss", "couldn't set 'max filedescriptors'",
						strerror(errno));
				return -1;
			}
		}

		if (srv->event_handler == FDEVENT_HANDLER_SELECT) {
            srv->max_fds = rlim.rlim_cur < ((int)FD_SETSIZE) - 200 ? rlim.rlim_cur : FD_SETSIZE - 200;
		} else {
			srv->max_fds = rlim.rlim_cur;
		}

		/* set core file rlimit, if enable_cores is set */
		if (srv->srvconf.enable_cores && getrlimit(RLIMIT_CORE, &rlim) == 0) {
			rlim.rlim_cur = rlim.rlim_max;
			setrlimit(RLIMIT_CORE, &rlim);
		}

#endif
		if (srv->event_handler == FDEVENT_HANDLER_SELECT) {
			/* don't raise the limit above FD_SET_SIZE */
            if (srv->max_fds > ((int)FD_SETSIZE) - 200) {
				log_error_write(srv, __FILE__, __LINE__, "sd",
						"can't raise max filedescriptors above",  FD_SETSIZE - 200,
						"if event-handler is 'select'. Use 'poll' or something else or reduce server.max-fds.");
				return -1;
			}
		}

		if (0 != network_init(srv)) {
			plugins_free(srv);
			server_free(srv);

			return -1;
		}
	}

	/* set max-conns */
    if (srv->srvconf.max_conns > srv->max_fds/2) {
        /* we can't have more connections than max-fds/2 */
        log_error_write(srv, __FILE__, __LINE__, "sdd", "can't have more connections than fds/2: ", srv->srvconf.max_conns, srv->max_fds);
        srv->max_conns = srv->max_fds/2;
    } else if (srv->srvconf.max_conns) {
        /* otherwise respect the wishes of the user */
        srv->max_conns = srv->srvconf.max_conns;
    } else {
        /* or use the default: we really don't want to hit max-fds */
        srv->max_conns = srv->max_fds/3;
    }

	if (HANDLER_GO_ON != plugins_call_init(srv)) {
		log_error_write(srv, __FILE__, __LINE__, "s", "Initialization of plugins failed. Going down.");

		plugins_free(srv);
		network_close(srv);
		server_free(srv);

		return -1;
	}

//test 3 OK
#ifdef HAVE_FORK
	/* network is up, let's deamonize ourself */
	//if (srv->srvconf.dont_daemonize == 0)
            //daemonize();
            //;
#endif

#ifdef BUILD_ON_ARM
        //pthread_cond_init(&getusbmouse_cond, NULL);
        //pthread_cond_init(&changeinput_cond, NULL);
        
#ifndef BUILD_RECOVER
        dbus_init();
        pthread_attr_t attr;
        pthread_t thread;

        pthread_attr_init( &attr );
        pthread_attr_setdetachstate( &attr, PTHREAD_CREATE_DETACHED );
        pthread_create( &thread, &attr, (void *)dbus_process, NULL );
        pthread_attr_destroy( &attr );
#endif
#else
    	/* network is up, let's deamonize ourself */
	if (srv->srvconf.dont_daemonize == 0)
            daemonize();
#endif

#ifndef BUILD_RECOVER
    init_cache_pvalue();
    apply_cache_pvalue(1);
    protected_pvalue_init();
    protected_command_init();
#endif
	srv->gid = getgid();
	srv->uid = getuid();

	/* write pid file */
	if (pid_fd != -1) {
		buffer_copy_long(srv->tmp_buf, getpid());
        buffer_append_string_len(srv->tmp_buf, CONST_STR_LEN("\n"));
		write(pid_fd, srv->tmp_buf->ptr, srv->tmp_buf->used - 1);
		close(pid_fd);
		pid_fd = -1;
	}

//test 6 failed
	// Close stderr ASAP in the child process to make sure that nothing
	// is being written to that fd which may not be valid anymore.
	if (-1 == log_error_open(srv)) {
		log_error_write(srv, __FILE__, __LINE__, "s", "Opening errorlog failed. Going down.");

		plugins_free(srv);
		network_close(srv);
		server_free(srv);
		return -1;
	}

//tese 5 failed

	if (HANDLER_GO_ON != plugins_call_set_defaults(srv)) {
		log_error_write(srv, __FILE__, __LINE__, "s", "Configuration of plugins failed. Going down.");

		plugins_free(srv);
		network_close(srv);
		server_free(srv);

		return -1;
	}

	/* dump unused config-keys */
	for (i = 0; i < srv->config_context->used; i++) {
		array *config = ((data_config *)srv->config_context->data[i])->value;
		size_t j;

		for (j = 0; config && j < config->used; j++) {
			data_unset *du = config->data[j];

			/* all var.* is known as user defined variable */
			if (strncmp(du->key->ptr, "var.", sizeof("var.") - 1) == 0) {
				continue;
			}

			if (NULL == array_get_element(srv->config_touched, du->key->ptr)) {
				log_error_write(srv, __FILE__, __LINE__, "sbs",
						"WARNING: unknown config-key:",
						du->key,
						"(ignored)");
			}
		}
	}

	if (srv->config_unsupported) {
		log_error_write(srv, __FILE__, __LINE__, "s",
				"Configuration contains unsupported keys. Going down.");
	}

	if (srv->config_deprecated) {
		log_error_write(srv, __FILE__, __LINE__, "s",
				"Configuration contains deprecated keys. Going down.");
	}

	if (srv->config_unsupported || srv->config_deprecated) {
		plugins_free(srv);
		network_close(srv);
		server_free(srv);

		return -1;
	}

//test 4 failed
#ifdef HAVE_SIGACTION
	memset(&act, 0, sizeof(act));
	act.sa_handler = SIG_IGN;
	sigaction(SIGPIPE, &act, NULL);
	sigaction(SIGUSR1, &act, NULL);
# if defined(SA_SIGINFO)
	act.sa_sigaction = sigaction_handler;
	sigemptyset(&act.sa_mask);
	act.sa_flags = SA_SIGINFO;
# else
	act.sa_handler = signal_handler;
	sigemptyset(&act.sa_mask);
	act.sa_flags = 0;
# endif
	sigaction(SIGINT,  &act, NULL);
	sigaction(SIGTERM, &act, NULL);
	sigaction(SIGHUP,  &act, NULL);
	sigaction(SIGALRM, &act, NULL);
	sigaction(SIGCHLD, &act, NULL);

#elif defined(HAVE_SIGNAL)
	/* ignore the SIGPIPE from sendfile() */
	signal(SIGPIPE, SIG_IGN);
	signal(SIGUSR1, SIG_IGN);
	signal(SIGALRM, signal_handler);
	signal(SIGTERM, signal_handler);
	signal(SIGHUP,  signal_handler);
	signal(SIGCHLD,  signal_handler);
	signal(SIGINT,  signal_handler);
#endif

#ifdef USE_ALARM
	signal(SIGALRM, signal_handler);

	/* setup periodic timer (1 second) */
	if (setitimer(ITIMER_REAL, &interval, NULL)) {
		log_error_write(srv, __FILE__, __LINE__, "s", "setting timer failed");
		return -1;
	}

	getitimer(ITIMER_REAL, &interval);
#endif

#ifdef HAVE_FORK
	/* start watcher and workers */
	num_childs = srv->srvconf.max_worker;
	if (num_childs > 0) {
		int child = 0;
		while (!child && !srv_shutdown && !graceful_shutdown) {
			if (num_childs > 0) {
				switch (fork()) {
				case -1:
					return -1;
				case 0:
					child = 1;
					break;
				default:
					num_childs--;
					break;
				}
			} else {
				int status;

				if (-1 != wait(&status)) {
					/** 
					 * one of our workers went away 
					 */
					num_childs++;
				} else {
					switch (errno) {
					case EINTR:
						/**
						 * if we receive a SIGHUP we have to close our logs ourself as we don't 
						 * have the mainloop who can help us here
						 */
						if (handle_sig_hup) {
							handle_sig_hup = 0;

							log_error_cycle(srv);

							/**
							 * forward to all procs in the process-group
							 * 
							 * we also send it ourself
							 */
							if (!forwarded_sig_hup) {
								forwarded_sig_hup = 1;
								kill(0, SIGHUP);
							}
						}
						break;
					default:
						break;
					}
				}
			}
		}

		/**
		 * for the parent this is the exit-point 
		 */
		if (!child) {
			/** 
			 * kill all children too 
			 */
			if (graceful_shutdown) {
				kill(0, SIGINT);
			} else if (srv_shutdown) {
				kill(0, SIGTERM);
			}

			log_error_close(srv);
			network_close(srv);
			connections_free(srv);
			plugins_free(srv);
			server_free(srv);
			return 0;
		}
	}
#endif

    if (NULL == (srv->ev = fdevent_init(srv, srv->max_fds + 1, srv->event_handler))) {
        log_error_write(srv, __FILE__, __LINE__,
                "s", "fdevent_init failed");
        return -1;
    }

    /* libev backend overwrites our SIGCHLD handler and calls waitpid on SIGCHLD; we want our own SIGCHLD handling. */
#ifdef HAVE_SIGACTION
    sigaction(SIGCHLD, &act, NULL);
#elif defined(HAVE_SIGNAL)
    signal(SIGCHLD,  signal_handler);
#endif

	/*
	 * kqueue() is called here, select resets its internals,
	 * all server sockets get their handlers
	 *
	 * */
	if (0 != network_register_fdevents(srv)) {
		plugins_free(srv);
		network_close(srv);
		server_free(srv);

		return -1;
	}

	/* might fail if user is using fam (not gamin) and famd isn't running */
	if (NULL == (srv->stat_cache = stat_cache_init())) {
		log_error_write(srv, __FILE__, __LINE__, "s",
			"stat-cache could not be setup, dieing.");
		return -1;
	}

#ifdef HAVE_FAM_H
	/* setup FAM */
	if (srv->srvconf.stat_cache_engine == STAT_CACHE_ENGINE_FAM) {
		if (0 != FAMOpen2(srv->stat_cache->fam, "lighttpd")) {
			log_error_write(srv, __FILE__, __LINE__, "s",
					 "could not open a fam connection, dieing.");
			return -1;
		}
#ifdef HAVE_FAMNOEXISTS
		FAMNoExists(srv->stat_cache->fam);
#endif

		srv->stat_cache->fam_fcce_ndx = -1;
		fdevent_register(srv->ev, FAMCONNECTION_GETFD(srv->stat_cache->fam), stat_cache_handle_fdevent, NULL);
        fdevent_event_set(srv->ev, &(srv->stat_cache->fam_fcce_ndx), FAMCONNECTION_GETFD(srv->stat_cache->fam), FDEVENT_IN);
	}
#endif

//test 5
	/* get the current number of FDs */
	srv->cur_fds = open("/dev/null", O_RDONLY);
	close(srv->cur_fds);

	for (i = 0; i < srv->srv_sockets.used; i++) {
		server_socket *srv_socket = srv->srv_sockets.ptr[i];
		if (-1 == fdevent_fcntl_set(srv->ev, srv_socket->fd)) {
			log_error_write(srv, __FILE__, __LINE__, "ss", "fcntl failed:", strerror(errno));
			return -1;
		}
	}

	/* main-loop */

	while (!srv_shutdown) {
		int n;
		size_t ndx;
		time_t min_ts;

		if (handle_sig_hup) {
			handler_t r;

			/* reset notification */
			handle_sig_hup = 0;


			/* cycle logfiles */

			switch(r = plugins_call_handle_sighup(srv)) {
			case HANDLER_GO_ON:
				break;
			default:
				log_error_write(srv, __FILE__, __LINE__, "sd", "sighup-handler return with an error", r);
				break;
			}

			if (-1 == log_error_cycle(srv)) {
				log_error_write(srv, __FILE__, __LINE__, "s", "cycling errorlog failed, dying");

				return -1;
			} else {
#ifdef HAVE_SIGACTION
				log_error_write(srv, __FILE__, __LINE__, "sdsd", 
					"logfiles cycled UID =",
					last_sighup_info.si_uid,
					"PID =",
					last_sighup_info.si_pid);
#else
				log_error_write(srv, __FILE__, __LINE__, "s", 
					"logfiles cycled");
#endif
			}
		}

		if (handle_sig_alarm) {
			/* a new second */

#ifdef USE_ALARM
			/* reset notification */
			handle_sig_alarm = 0;
#endif

			/* get current time */
			min_ts = time(NULL);

			if (min_ts != srv->cur_ts) {
				int cs = 0;
				connections *conns = srv->conns;
				handler_t r;

				switch(r = plugins_call_handle_trigger(srv)) {
				case HANDLER_GO_ON:
					break;
				case HANDLER_ERROR:
					log_error_write(srv, __FILE__, __LINE__, "s", "one of the triggers failed");
					break;
				default:
					log_error_write(srv, __FILE__, __LINE__, "d", r);
					break;
				}

				/* trigger waitpid */
				srv->cur_ts = min_ts;

				/* cleanup stat-cache */
				stat_cache_trigger_cleanup(srv);
				/**
				 * check all connections for timeouts
				 *
				 */
				for (ndx = 0; ndx < conns->used; ndx++) {
					int changed = 0;
					connection *con;
					int t_diff;

					con = conns->ptr[ndx];

					if (con->state == CON_STATE_READ ||
					    con->state == CON_STATE_READ_POST) {
						if (con->request_count == 1) {
							if (srv->cur_ts - con->read_idle_ts > con->conf.max_read_idle) {
								/* time - out */
#if 0
								log_error_write(srv, __FILE__, __LINE__, "sd",
										"connection closed - read-timeout:", con->fd);
#endif
								connection_set_state(srv, con, CON_STATE_ERROR);
								changed = 1;
							}
						} else {
                            if (srv->cur_ts - con->read_idle_ts > con->keep_alive_idle) {
								/* time - out */
#if 0
								log_error_write(srv, __FILE__, __LINE__, "sd",
										"connection closed - read-timeout:", con->fd);
#endif
								connection_set_state(srv, con, CON_STATE_ERROR);
								changed = 1;
							}
						}
					}

					if ((con->state == CON_STATE_WRITE) &&
					    (con->write_request_ts != 0)) {
#if 0
						if (srv->cur_ts - con->write_request_ts > 60) {
							log_error_write(srv, __FILE__, __LINE__, "sdd",
									"connection closed - pre-write-request-timeout:", con->fd, srv->cur_ts - con->write_request_ts);
						}
#endif

						if (srv->cur_ts - con->write_request_ts > con->conf.max_write_idle) {
							/* time - out */
                        if (con->conf.log_timeouts) {
							log_error_write(srv, __FILE__, __LINE__, "sbsosds",
									"NOTE: a request for",
									con->request.uri,
									"timed out after writing",
									con->bytes_written,
									"bytes. We waited",
									(int)con->conf.max_write_idle,
									"seconds. If this a problem increase server.max-write-idle");
                        }
							connection_set_state(srv, con, CON_STATE_ERROR);
							changed = 1;
						}
					}
                    if (con->state == CON_STATE_CLOSE && (srv->cur_ts - con->close_timeout_ts > HTTP_LINGER_TIMEOUT)) {
                        changed = 1;
                    }
					/* we don't like div by zero */
					if (0 == (t_diff = srv->cur_ts - con->connection_start)) t_diff = 1;

					if (con->traffic_limit_reached &&
					    (con->conf.kbytes_per_second == 0 ||
					     ((con->bytes_written / t_diff) < con->conf.kbytes_per_second * 1024))) {
						/* enable connection again */
						con->traffic_limit_reached = 0;

						changed = 1;
					}

					if (changed) {
						connection_state_machine(srv, con);
					}
					con->bytes_written_cur_second = 0;
					*(con->conf.global_bytes_per_second_cnt_ptr) = 0;

#if 0
					if (cs == 0) {
						fprintf(stderr, "connection-state: ");
						cs = 1;
					}

					fprintf(stderr, "c[%d,%d]: %s ",
						con->fd,
						con->fcgi.fd,
						connection_get_state(con->state));
#endif
				}

				if (cs == 1) fprintf(stderr, "\n");
			}
		}

		if (srv->sockets_disabled) {
			/* our server sockets are disabled, why ? */

            if ((srv->cur_fds + srv->want_fds < srv->max_fds * 8 / 10) && /* we have enough unused fds */
                (srv->conns->used <= srv->max_conns * 9 / 10) &&
                (0 == graceful_shutdown)) {
                for (i = 0; i < srv->srv_sockets.used; i++) {
                    server_socket *srv_socket = srv->srv_sockets.ptr[i];
                    fdevent_event_set(srv->ev, &(srv_socket->fde_ndx), srv_socket->fd, FDEVENT_IN);
                }

                log_error_write(srv, __FILE__, __LINE__, "s", "[note] sockets enabled again");

                srv->sockets_disabled = 0;
            }
        } else {
            if ((srv->cur_fds + srv->want_fds > srv->max_fds * 9 / 10) || /* out of fds */
                (srv->conns->used >= srv->max_conns) || /* out of connections */
                (graceful_shutdown)) { /* graceful_shutdown */

				/* disable server-fds */

				for (i = 0; i < srv->srv_sockets.used; i++) {
					server_socket *srv_socket = srv->srv_sockets.ptr[i];
					fdevent_event_del(srv->ev, &(srv_socket->fde_ndx), srv_socket->fd);

					if (graceful_shutdown) {
						/* we don't want this socket anymore,
						 *
						 * closing it right away will make it possible for
						 * the next lighttpd to take over (graceful restart)
						 *  */

						fdevent_unregister(srv->ev, srv_socket->fd);
						close(srv_socket->fd);
						srv_socket->fd = -1;

						/* network_close() will cleanup after us */

						if (srv->srvconf.pid_file->used &&
						    srv->srvconf.changeroot->used == 0) {
							if (0 != unlink(srv->srvconf.pid_file->ptr)) {
								if (errno != EACCES && errno != EPERM) {
									log_error_write(srv, __FILE__, __LINE__, "sbds",
											"unlink failed for:",
											srv->srvconf.pid_file,
											errno,
											strerror(errno));
								}
							}
						}
					}
				}

				if (graceful_shutdown) {
					log_error_write(srv, __FILE__, __LINE__, "s", "[note] graceful shutdown started");
                } else if (srv->conns->used >= srv->max_conns) {
                    log_error_write(srv, __FILE__, __LINE__, "s", "[note] sockets disabled, connection limit reached");
				} else {
					log_error_write(srv, __FILE__, __LINE__, "s", "[note] sockets disabled, out-of-fds");
				}

				srv->sockets_disabled = 1;
			}
		}

		if (graceful_shutdown && srv->conns->used == 0) {
			/* we are in graceful shutdown phase and all connections are closed
			 * we are ready to terminate without harming anyone */
			srv_shutdown = 1;
		}

		/* we still have some fds to share */
		if (srv->want_fds) {
			/* check the fdwaitqueue for waiting fds */
			int free_fds = srv->max_fds - srv->cur_fds - 16;
			connection *con;

			for (; free_fds > 0 && NULL != (con = fdwaitqueue_unshift(srv, srv->fdwaitqueue)); free_fds--) {
				connection_state_machine(srv, con);

				srv->want_fds--;
			}
		}

		if ((n = fdevent_poll(srv->ev, 1000)) > 0) {
			/* n is the number of events */
			int revents;
			int fd_ndx;
#if 0
			if (n > 0) {
				log_error_write(srv, __FILE__, __LINE__, "sd",
						"polls:", n);
			}
#endif
			fd_ndx = -1;
			do {
				fdevent_handler handler;
				void *context;
				handler_t r;

				fd_ndx  = fdevent_event_next_fdndx (srv->ev, fd_ndx);
                if (-1 == fd_ndx) break; /* not all fdevent handlers know how many fds got an event */
				revents = fdevent_event_get_revent (srv->ev, fd_ndx);
				fd      = fdevent_event_get_fd     (srv->ev, fd_ndx);
				handler = fdevent_get_handler(srv->ev, fd);
				context = fdevent_get_context(srv->ev, fd);

				/* connection_handle_fdevent needs a joblist_append */
#if 0
				log_error_write(srv, __FILE__, __LINE__, "sdd",
						"event for", fd, revents);
#endif
				switch (r = (*handler)(srv, context, revents)) {
				case HANDLER_FINISHED:
				case HANDLER_GO_ON:
				case HANDLER_WAIT_FOR_EVENT:
				case HANDLER_WAIT_FOR_FD:
					break;
				case HANDLER_ERROR:
					/* should never happen */
					SEGFAULT();
					break;
				default:
					log_error_write(srv, __FILE__, __LINE__, "d", r);
					break;
				}
			} while (--n > 0);
		} else if (n < 0 && errno != EINTR) {
			log_error_write(srv, __FILE__, __LINE__, "ss",
					"fdevent_poll failed:",
					strerror(errno));
		}

		for (ndx = 0; ndx < srv->joblist->used; ndx++) {
			connection *con = srv->joblist->ptr[ndx];
			handler_t r;

			connection_state_machine(srv, con);

			switch(r = plugins_call_handle_joblist(srv, con)) {
			case HANDLER_FINISHED:
			case HANDLER_GO_ON:
				break;
			default:
				log_error_write(srv, __FILE__, __LINE__, "d", r);
				break;
			}

			con->in_joblist = 0;
		}

		srv->joblist->used = 0;
	}
    
	if (srv->srvconf.pid_file->used &&
	    srv->srvconf.changeroot->used == 0 &&
	    0 == graceful_shutdown) {
		if (0 != unlink(srv->srvconf.pid_file->ptr)) {
			if (errno != EACCES && errno != EPERM) {
				log_error_write(srv, __FILE__, __LINE__, "sbds",
						"unlink failed for:",
						srv->srvconf.pid_file,
						errno,
						strerror(errno));
			}
		}
	}

#ifdef HAVE_SIGACTION
	log_error_write(srv, __FILE__, __LINE__, "sdsd", 
			"server stopped by UID =",
			last_sigterm_info.si_uid,
			"PID =",
			last_sigterm_info.si_pid);
#else
	log_error_write(srv, __FILE__, __LINE__, "s", 
			"server stopped");
#endif

	/* clean-up */
	log_error_close(srv);
	network_close(srv);
	connections_free(srv);
	plugins_free(srv);
	server_free(srv);
#ifndef BUILD_RECOVER
    free_pvaluelist(pvalue_protect);
    free_pvaluelist(command_protect);

#endif
#endif
	return 0;    
}
