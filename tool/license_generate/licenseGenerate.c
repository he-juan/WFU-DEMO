/*
 * @Description: 该程序用于将Android原生的License文件(/system/etc/NOTICE.xml)转换为JSON格式
 *               编译: gcc licenseGenerate.c cJSON.c -o licenseGenerate -lxml2 -I/usr/include/libxml2 -lm 
 * @Date: 2020-04-17 17:40:42
 * @Author: cchma
 */
#include "stdio.h"
#include "stdlib.h"
#include "cJSON.h"
#include <string.h>
#include <libxml/xmlreader.h>

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

static void parseLicenseXMLFile(char *filename) {
    cJSON *filesResObj = cJSON_CreateObject();
    cJSON *filesArrObj = cJSON_CreateArray();
    cJSON *licensesResObj = cJSON_CreateObject();
    cJSON *licensesArrObj = cJSON_CreateArray();

    if (!access(filename, 0)) {

        xmlTextReaderPtr reader;
        reader = xmlReaderForFile(filename, NULL, 0);

        int ret = xmlTextReaderRead(reader);
        while (ret == 1) {
            if (xmlTextReaderNodeType(reader) == XML_READER_TYPE_ELEMENT) {
                const xmlChar *nodeName = xmlTextReaderConstName(reader);

                if (nodeName != NULL && !strcmp((char*) nodeName, "file-name")) {
                    xmlChar *licenseId = xmlTextReaderGetAttribute(reader, BAD_CAST "contentId");

                    ret = xmlTextReaderRead(reader);

                    if (xmlTextReaderNodeType(reader) == XML_READER_TYPE_TEXT) {
                        const xmlChar *fileName = xmlTextReaderConstValue(reader);

                        if (licenseId != NULL && fileName != NULL) {
                            cJSON *fileObj = cJSON_CreateObject();

                            cJSON_AddStringToObject(fileObj, "name", (char*)fileName);
                            cJSON_AddStringToObject(fileObj, "licenseId", (char*)licenseId);
                            cJSON_AddItemToArray(filesArrObj, fileObj);
                        }
                    }
                } else if (nodeName != NULL && !strcmp((char*) nodeName, "file-content")) {
                    xmlChar *licenseId = xmlTextReaderGetAttribute(reader, BAD_CAST "contentId");

                    ret = xmlTextReaderRead(reader);

                    if (xmlTextReaderNodeType(reader) == XML_READER_TYPE_CDATA) {
                        const xmlChar *content = xmlTextReaderConstValue(reader);

                        if (licenseId != NULL && content != NULL) {
                            cJSON *licenseObj = cJSON_CreateObject();

                            cJSON_AddStringToObject(licenseObj, "licenseId", (char*)licenseId);
                            cJSON_AddStringToObject(licenseObj, "content", (char*)content);

                            cJSON_AddItemToArray(licensesArrObj, licenseObj);
                        }
                    }
                }
            }

            ret = xmlTextReaderRead(reader);
        }

        xmlFreeTextReader(reader);
        xmlCleanupParser();
    } else {
        printf("read xml file error!\n");
        return;
    }

    cJSON_AddItemToObject(filesResObj, "files", filesArrObj);
    char *res = cJSON_Print(filesResObj);
    FILE *out = fopen("../../webserver/etc/licenses/openSourceFiles.json", "wb");
    fwrite(res, 1, strlen(res), out);
    fclose(out);
    free(res);

    cJSON_AddItemToObject(licensesResObj, "licenses", licensesArrObj);
    char *licenseRes = cJSON_Print(licensesResObj);
    FILE *licenseOut = fopen("../../webserver/etc/licenses/openSourceLicenses.json", "wb");
    fwrite(licenseRes, 1, strlen(licenseRes), licenseOut);
    fclose(licenseOut);
    free(licenseRes);
}


static void parseLicenseJSONFile(char *filename) {
    FILE *fp = fopen(filename, "r");
    char *fileBuf = NULL;

    if (fp != NULL) {
        fseek(fp, 0, SEEK_END);
        int len = ftell(fp);

        fileBuf = (char*)malloc(len + 1);
        memset(fileBuf, 0, len + 1);
        fseek(fp, 0, SEEK_SET);
        fread(fileBuf, len, 1, fp);
        fclose(fp);
    } else {
        printf("找不到文件\n");
        return;
    }

    cJSON *jsonData = cJSON_Parse(fileBuf);

    if (jsonData != NULL) { 
        cJSON *filesResObj = cJSON_CreateObject();
        cJSON *filesArrObj = cJSON_CreateArray();
        cJSON *licensesResObj = cJSON_CreateObject();
        cJSON *licensesArrObj = cJSON_CreateArray(); 
        int licenseIndex = 0;

        cJSON *oriFilesArr = cJSON_GetObjectItem(jsonData, "files");

        int fileCount = cJSON_GetArraySize(oriFilesArr);

        int i;
        for (i = 0; i < fileCount; i++) {
            cJSON *oriFileObj = cJSON_GetArrayItem(oriFilesArr, i);
            char *licensePath = cJSON_GetObjectItem(oriFileObj, "path")->valuestring;

            if (licensePath != NULL) {
                FILE *li_fp = fopen(licensePath, "r");
                char *li_fileBuf = NULL;

                printf("licensePath: %s\n", licensePath);

                if (li_fp != NULL) {
                    fseek(li_fp, 0, SEEK_END);
                    int len = ftell(li_fp);

                    li_fileBuf = (char*)malloc(len + 1);

                    memset(li_fileBuf, 0, len + 1);
                    fseek(li_fp, 0, SEEK_SET);
                    fread(li_fileBuf, len, 1, li_fp);
                    fclose(li_fp);
                }

                if (li_fileBuf == NULL) {
                    continue;
                }

                //json_handle(li_fileBuf);

                printf("%s\n", li_fileBuf);

                cJSON *newFileObj = cJSON_CreateObject();

                cJSON_AddStringToObject(newFileObj, "name", cJSON_GetObjectItem(oriFileObj, "name")->valuestring);
                cJSON_AddStringToObject(newFileObj, "path", cJSON_GetObjectItem(oriFileObj, "path")->valuestring);

                int isDuplicate = 0;
                int j;
                for (j = 0; j < licenseIndex; j++) {
                    cJSON *licenseObj = cJSON_GetArrayItem(licensesArrObj, j);

                    if (!strcmp(cJSON_GetObjectItem(licenseObj, "content")->valuestring, li_fileBuf)) {
                        cJSON_AddStringToObject(newFileObj, "licenseId", cJSON_GetObjectItem(licenseObj, "licenseId")->valuestring);
                        isDuplicate = 1;
                        break;
                    }
                }

                if (isDuplicate == 0) {
                    cJSON *newLicenseObj = cJSON_CreateObject();

                    char licenseId_buf[16] = {0};
                    snprintf(licenseId_buf, sizeof(licenseId_buf), "gs_%d", licenseIndex++);

                    cJSON_AddStringToObject(newLicenseObj, "licenseId", licenseId_buf);
                    cJSON_AddStringToObject(newLicenseObj, "content", li_fileBuf);
                    cJSON_AddItemToArray(licensesArrObj, newLicenseObj);

                    cJSON_AddStringToObject(newFileObj, "licenseId", licenseId_buf);
                }

                cJSON_AddItemToArray(filesArrObj, newFileObj);

                free(li_fileBuf);
            }  
        }

        cJSON_AddItemToObject(filesResObj, "files", filesArrObj);
        char *res = cJSON_Print(filesResObj);
        FILE *out = fopen("../../webserver/etc/licenses/gsOpenSourceFiles.json", "wb");
        fwrite(res, 1, strlen(res), out);
        fclose(out);
        free(res);

        cJSON_AddItemToObject(licensesResObj, "licenses", licensesArrObj);
        char *licenseRes = cJSON_Print(licensesResObj);
        FILE *licenseOut = fopen("../../webserver/etc/licenses/gsOpenSourceLicenses.json", "wb");
        fwrite(licenseRes, 1, strlen(licenseRes), licenseOut);
        fclose(licenseOut);
        free(licenseRes);

        cJSON_Delete(jsonData);
    } else {
        printf("JSON文件格式错误\n");
    }
}


int main(int argc, char *argv[]){
    if (argc != 2) {
        printf("Usage: parseLicenseXML [filename]\n");
        return(1);
    }

    if (strstr(argv[1], "xml") != NULL 
        || strstr(argv[1], "XML") != NULL) {
        parseLicenseXMLFile(argv[1]);
    } else if (strstr(argv[1], "json") != NULL
        || strstr(argv[1], "JSON") != NULL) {
        parseLicenseJSONFile(argv[1]);
    } else {
        printf("文件格式不正确(XML/JSON)\n");
    }

    return 0;
}


