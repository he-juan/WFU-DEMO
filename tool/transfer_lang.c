#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#define LAN_PATH_DBG    "../../patch/language/"
#define WRITE_LAN_PATH_DBG                        "../webgui/gvc3200/lang"

char *lang_list[] = {"en", "zh", "es", "ru", "pt", "ja"};

void string_format(char **str)
{
    int last_flag = 0;
	int len = strlen(*str);
	char *tmpstr = malloc(len + 12);
	memset(tmpstr, 0, len + 12);

    if ((*str)[0] == '"') {
        strcat(tmpstr, "\\\"");
    }

    if ((*str)[strlen(*str)-1] == '"') {
        last_flag = 1;
    }

	char *strp = strtok(*str, "\"");
	while(strp != NULL)
	{
		strcat(tmpstr, strp);
		strp = strtok(NULL, "\"");
		if (strp != NULL) 
			strcat(tmpstr, "\\\"");
	}

    if (last_flag == 1) {
        strcat(tmpstr, "\\\"");
    }

	char *newstr = malloc(len + 12);
	memset(newstr, 0, len + 12);
	strp = strtok(tmpstr, "&&");
	while(strp != NULL)
	{
		strcat(newstr, strp);
		strp = strtok(NULL, "&&");
		if (strp != NULL)
			strcat(newstr, "&");
	}

	*str = newstr;
	free(tmpstr);
}

int init_lan_tr()
{
    printf("init_lan_tr\n");
    char *filepath = NULL, *writhpath = NULL;

    int len1 = strlen(LAN_PATH_DBG) + 32;
    int len2 = strlen(WRITE_LAN_PATH_DBG) + 32;

    char *filename = NULL, *writefile = NULL, *helpfile = NULL;
    filename = malloc(len1);
    writefile = malloc(len2);
    helpfile = malloc(len1);
    int wlen;
    int i = 0;
    for(i = 0; i < 6; i++)
    {
        memset(filename, 0, len1);
        snprintf(filename, len1, "%s/%s.txt", LAN_PATH_DBG, lang_list[i]);
        memset(writefile, 0, len2);
        snprintf(writefile, len2, "%s/%s.js", WRITE_LAN_PATH_DBG, lang_list[i]);

        printf("write tr filename-%s---------------------------\n", writefile );

        FILE *fp = fopen( filename , "r");
        FILE *wfp = fopen( writefile , "w+");
        FILE *hfp = NULL;
        char line[1024] = "";
        char hline[1024] = "";
        char *trid = NULL;
        char *lanstr = NULL;
        char *htrid = NULL;
        char *hlanstr = NULL;
        char *temp = NULL;

        if (i > 1) {
            memset(helpfile, 0, len1);
            snprintf(helpfile, len1, "%s/en.txt", LAN_PATH_DBG);
            hfp = fopen(helpfile, "r");
        }

        while ((  fp != NULL) && !feof( fp ) )
        {
            fgets( (char*)&line, sizeof(line), fp );
            if (hfp != NULL && !feof(hfp)) {
                fgets((char*)&hline, sizeof(hline), hfp);
            }
            if( strstr(line, ",") == NULL )
                continue;
            //printf("line is %s\n", line );
            trid = strtok( line, ",");
            if ( trid != NULL )
            {
                lanstr = strtok(NULL, "`"); //use a character which not incluede in en.txt file
				if (strstr(lanstr, "\r") != NULL)
					lanstr = strsep(&lanstr, "\r\n");
				else
                	lanstr = strsep(&lanstr, "\n");

                if (!strcmp(lanstr, "") && hfp != NULL) {
                    htrid = strtok(hline, ",");
                    if (htrid != NULL) {
                        hlanstr = strtok(NULL, "`");
                        if (strstr(hlanstr, "\r") != NULL)
                            hlanstr = strsep(&hlanstr, "\r\n");
                        else
                            hlanstr = strsep(&hlanstr, "\n");
                        lanstr = hlanstr;
                    }
                }

				string_format(&lanstr);

                //printf("trid is %s, lanstr is %s\n", trid, lanstr );
                wlen = 32 + strlen(lanstr);
                temp = malloc ( wlen );

				if (i < 6)
	                snprintf(temp, wlen, "var a_%s=\"%s\";\n", trid, lanstr);
	            else 
					snprintf(temp, wlen, "var tip_%s=\"%s\";\n", trid, lanstr);
                //printf("write str is %s\n", temp );
                if (fwrite(temp, strlen(temp), 1, wfp) <= 0)
                {
                    printf("write err-r----------------------------\n" );
                }
				free(lanstr);
                free(temp);
            }
            memset(line, 0, sizeof(line));
            if (hfp != NULL) {
                memset(hline, 0, sizeof(hline));
            }
        }
        fclose(fp);
        fclose(wfp);
        if (hfp != NULL) {
            fclose(hfp);
        }
        sync();
    }
    free(filename);
    free(writefile);
    free(helpfile);
    printf("init_lan_tr suc\n");
}

int main (int argc, char **argv) {
    init_lan_tr();
    return 0;
}
