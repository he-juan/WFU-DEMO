#ifndef _CONNECTIONS_H_
#define _CONNECTIONS_H_

#include "server.h"
#include "fdevent.h"
#include <android/log.h>

#define MAX_MANHEADERS 300

#define LOGD(x...) __android_log_print(ANDROID_LOG_DEBUG, "WebServer", x)

#ifndef BUILD_RECOVER
typedef struct {
    char   *data;
    int    length;
} result_buffer;

typedef struct _pvaluelist
{
    char *pvalue;
    char *data;
    struct _pvaluelist *next;
}   PvalueList;

#endif

struct message {
	unsigned int hdrcount;
	const char *headers[MAX_MANHEADERS];
};

#ifndef BUILD_RECOVER
typedef struct {
    int acc1;
    int acc2;
    int acc3;
    int acc4;
    int acc5;
    int acc6;
    int acch323;
} ACCStatus;

/*Account status define
    0 - unregister
    1 - register(as idle)
    2 - idle
    3 - dialing
    4 - ringing
    5 - calling(as dialing)
    6 - connected(talking)
*/
typedef enum
{
    UNREGISTER = 0,
    REGISTER = 1,
    IDLE = 2,
    DIALING = 3,
    RINGING =4,
    CALLING= 5,
    CONNECTED =6
} StatusType;

typedef enum
{
    CALL_IDLE = 0,
    CALL_DIALING = 1,
    CALL_RINGING = 2,
    CALL_CALLING = 3,
    CALL_CONNECTED = 4,
    CALL_ONHOLD = 5,
    CALL_TRANSFERED = 6,
    CALL_ENDING = 7,
    CALL_FAILED = 8
} CallState;

#endif

connection *connection_init(server *srv);
int connection_reset(server *srv, connection *con);
void connections_free(server *srv);

connection * connection_accept(server *srv, server_socket *srv_sock);
int connection_close(server *srv, connection *con);

int connection_set_state(server *srv, connection *con, connection_state_t state);
const char * connection_get_state(connection_state_t state);
const char * connection_get_short_state(connection_state_t state);
int connection_state_machine(server *srv, connection *con);
#ifndef BUILD_RECOVER
int protected_command_find(PvalueList* protected_list, char *command);
void protected_command_init();
int protected_pvalue_find(PvalueList *protected_list, char *pvalue);
//int reboot_pvalue_find(PvalueList *protected_list, char *pvalue);
//void need_reboot_pvalue_init();
void protected_pvalue_init();
int init_cache_pvalue();
int apply_cache_pvalue(int init);
int doCommandTask(char* const argv[], const char *outfile, const char *infile, int isNonBlock);
int onelick_debug_task(char* mode);
#endif
#endif
