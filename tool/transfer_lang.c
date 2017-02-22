#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#define LAN_PATH_DBG    "../../patch/language/"
#define WRITE_LAN_PATH_DBG                        "../webgui/gvc3200/lang"

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

    filepath = malloc(64);
    memset(filepath, 0, sizeof(filepath));
    writhpath = malloc(64);
    memset(writhpath, 0, sizeof(writhpath));
    sprintf(filepath, "%s", LAN_PATH_DBG);
    sprintf(writhpath, "%s", WRITE_LAN_PATH_DBG);

    char *filename = NULL, *wirtefile = NULL;
    filename = malloc(64);
    memset(filename, 0, sizeof(filename));
    wirtefile = malloc(64);
    memset(wirtefile, 0, sizeof(wirtefile));
    int wlen;
    int i = 0;
    for(i = 0; i < 5; i++)
    {
		if (i == 0)
		{
			sprintf(filename, "%s/en.txt", filepath);
            sprintf(wirtefile, "%s/en.js", writhpath);
		}
		else if (i == 1)
		{
			sprintf(filename, "%s/zh.txt", filepath);
            sprintf(wirtefile, "%s/zh.js", writhpath);		
		}
		else if (i == 2)
		{
			sprintf(filename, "%s/es.txt", filepath);
            sprintf(wirtefile, "%s/es.js", writhpath);		
		}
		else if (i == 3)
		{
			sprintf(filename, "%s/ru.txt", filepath);
            sprintf(wirtefile, "%s/ru.js", writhpath);		
		}
		else if (i == 4)
		{
			sprintf(filename, "%s/pt.txt", filepath);
            sprintf(wirtefile, "%s/pt.js", writhpath);		
		}

        printf("write tr filename-%s---------------------------\n", wirtefile );

        FILE *fp = fopen( filename , "r");
        FILE *wfp = fopen( wirtefile , "w+");
        char line[1024] = "";
        char *trid = NULL;
        char *lanstr = NULL;
        char *temp = NULL;

        while ((  fp != NULL) && !feof( fp ) )
        {
            fgets( &line, sizeof(line), fp );
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
                //printf("trid is %s, lanstr is %s\n", trid, lanstr );
                wlen = 32 + strlen(lanstr);
                temp = malloc ( wlen );

				string_format(&lanstr);

				if (i < 5)
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
        }
        fclose(fp);
        fclose(wfp);
        sync();
    }
    printf("init_lan_tr suc\n");
}

int main (int argc, char **argv) {
    init_lan_tr();
    return 0;
}
