# licenseGenerate 程序用于将Android原生的License XML列表以及项目中自带的开源软件信息转化成能让WebUI获取并解析的JSON格式的数据

### Android 原生License的转化
1. NOTICE.xml 为Android原生的License列表，文件位于设备的 /system/etc/NOTICE.xml.gz，进行转化前需现将文件解压
2. 转化的命令为 ./licenseGenerate NOTICE.xml
3. 转化成功后，会在 service/webserver/etc/licenses 下生成 openSourceFiles.json 和 openSourceLicenses.json 文件


### 项目中新增的开源库信息的转化
1. 需现将项目中新增的开源库信息整理成JSON格式的文件，格式以及字段名可参考 gsOpenSources.json 文件， 需指定好各开源软件的名称以及LICENSE文件的相对路径
2. 转化的命令为 ./licenseGenerate gsOpenSources.json
3. 转化成功后，会在 service/webserver/etc/licenses 下生成 gsOpenSourceFiles.json 和 gsOpenSourceLicenses.json 文件




