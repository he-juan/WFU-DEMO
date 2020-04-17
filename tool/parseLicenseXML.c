/*
 * @Description: 该程序用于将Android原生的License文件(/system/etc/NOTICE.xml)转换为JSON格式
 *               编译: gcc parseLicenseXML.c cJSON.c -o parseLicenseXML -lxml2 -I/usr/include/libxml2 -lm 
 * @Date: 2020-04-17 17:40:42
 * @Author: cchma
 */
#include "stdio.h"
#include "stdlib.h"
#include "cJSON.h"
#include <libxml/xmlreader.h>

#define LICENSES_XML_FILE "NOTICE.xml"
#define LICENSES_JSON_FILE "NOTICE.json"

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
                xmlChar *nodeName = xmlTextReaderConstName(reader);

                if (nodeName != NULL && !strcmp((char*) nodeName, "file-name")) {
                    xmlChar *licenseId = xmlTextReaderGetAttribute(reader, BAD_CAST "contentId");

                    ret = xmlTextReaderRead(reader);

                    if (xmlTextReaderNodeType(reader) == XML_READER_TYPE_TEXT) {
                        xmlChar *fileName = xmlTextReaderConstValue(reader);

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
                        xmlChar *content = xmlTextReaderConstValue(reader);

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
    FILE *out = fopen("openSourceFiles.json", "wb");
    fwrite(res, 1, strlen(res), out);
    fclose(out);
    free(res);

    cJSON_AddItemToObject(licensesResObj, "licenses", licensesArrObj);
    char *licenseRes = cJSON_Print(licensesResObj);
    FILE *licenseOut = fopen("openSourceLicenses.json", "wb");
    fwrite(licenseRes, 1, strlen(licenseRes), licenseOut);
    fclose(licenseOut);
    free(licenseRes);
}

int main(int argc, char *argv[]){
    if (argc != 2) {
        printf("Usage: parseLicenseXML [filename]");
        return(1);
    }

    parseLicenseXMLFile(argv[1]);
    return 0;
}


