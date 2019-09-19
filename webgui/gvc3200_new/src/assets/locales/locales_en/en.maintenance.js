/* eslint-disable no-multiple-empty-lines */
export default {
  /* Upgrade */
  mai_up_001: 'Complete upgrade',
  mai_up_001_tip: 'If enabled, all files will be replaced except user data.',

  mai_up_002: 'Upload firmware file to update',
  mai_up_002_tip: 'Upload the firmware to the device directly.',

  mai_up_003: 'Firmware upgrade mode',
  mai_up_003_tip: 'Selects the method to upgrade firmware.',

  mai_up_004: 'Firmware server path',
  mai_up_004_tip: 'Defines the server path for the firmware server. It could be different from the Config Server Path which is for provisioning.',

  mai_up_005: 'HTTP/HTTPS username',
  mai_up_005_tip: 'The user name for the firmware HTTP/HTTPS server.',

  mai_up_006: 'HTTP/HTTPS password',
  mai_up_006_tip: 'The password for the firmware HTTP/HTTPS server.',

  mai_up_007: 'Firmware file prefix',
  mai_up_007_tip: 'If configured, only the firmware with the matching encrypted prefix will be downloaded and flashed into the device. This setting is mainly for ITSP to configure so that only the firmware with specific prefix can be loaded.',

  mai_up_008: 'Firmware file postfix',
  mai_up_008_tip: 'If configured, only the firmware with the matching encrypted postfix will be downloaded and flashed into the device. This setting is mainly for ITSP to configure so that only the firmware with specific postfix can be loaded.',

  mai_up_009: 'Use Grandstream GAPS',
  mai_up_009_tip: 'It is used to configure the download path and update mode for the configuration file server. If set to "Yes", the device will set the download path of the configuration file to fm.grandstream.com/gs by default, and use HTTPS protocol to connect to the server; If set to "No", then users can manually configure the path and update mode for the configuration file server.',

  mai_up_010: 'Config upgrade mode',
  mai_up_010_tip: 'Allows users to choose the config upgrade method: TFTP, HTTP or HTTPS.',

  mai_up_011: 'Config server path',
  mai_up_011_tip: 'Defines the server path for provisioning. It could be different from the Firmware Server Path.',

  mai_up_012: 'Config HTTP/HTTPS username',
  mai_up_012_tip: 'The user name for the config HTTP/HTTPS server.',

  mai_up_013: 'Config HTTP/HTTPS password',
  mai_up_013_tip: 'The password for the config HTTP/HTTPS server.',

  mai_up_014: 'Always send HTTP basic authentication information',
  mai_up_014_tip: 'Configures to enable or disable sending HTTP basic authentication when the device uses wget to download "cfg.xml" file. If set to "Yes", the device will always send HTTP with credentials. Otherwise, the device will send HTTP with credentials only when the server requests for it. The default is setting is "No".',

  mai_up_015: 'Config file prefix',
  mai_up_015_tip: 'If configured, only the configuration file with the matching encrypted prefix will be downloaded and flashed into the device. This setting is mainly for ITSP to configure so that only the configuration file specific prefix can be loaded.',

  mai_up_016: 'Config file postfix',
  mai_up_016_tip: 'If configured, only the configuration file with the matching encrypted postfix will be downloaded and flashed into the device. This setting is mainly for ITSP to configure so that only the configuration file with specific postfix can be loaded.',

  mai_up_017: 'Authenticate conf file',
  mai_up_017_tip: 'Authenticate the configuration file before the device accepts it. The default setting is "No".',

  mai_up_018: 'XML config file password',
  mai_up_018_tip: 'The password for encrypting the XML configuration file using OpenSSL. This is required for the device to decrypt the encrypted XML configuration file.',

  mai_up_019: 'Download device configuration',
  mai_up_019_tip: 'Click to download the device configuration file to PC.',

  mai_up_020: 'Upload device configuration',
  mai_up_020_tip: 'Upload configuration file to the device.',

  mai_up_021: 'GUI customization file download mode',
  mai_up_021_tip: 'Selects the method to download customization file.',

  mai_up_022: 'GUI customization file URL',
  mai_up_022_tip: 'Defines the server path for the customization file server.',

  mai_up_023: 'GUI customization file HTTP/HTTPS username',
  mai_up_023_tip: 'The user name for the customization file HTTP/HTTPS server.',

  mai_up_024: 'GUI customization file HTTP/HTTPS password',
  mai_up_024_tip: 'The password for the customization file HTTP/HTTPS server.',

  mai_up_025: 'Use configurations of config file server',
  mai_up_025_tip: 'Retrieve and download cust file with the configurations of config file.',

  mai_up_026: 'Automatic upgrade',
  mai_up_026_tip: 'Enable automatic HTTP upgrade and provisioning. The default setting is "Check Every Day".',

  mai_up_027: 'Automatic upgrade check interval (Min)',
  mai_up_027_tip: 'Specifies the time period to check for firmware upgrade (in minutes). The default setting is 10080 minutes (7 days).',

  mai_up_028: 'Automatic upgrade hour(0-23)',
  mai_up_028_tip: 'Set the time or time period of automatic upgrade, and automatically update during the set time or time period.',

  mai_up_029: 'Day of the week',
  mai_up_029_tip: 'Defines the day of the week to check the HTTP/TFTP server for firmware upgrades or configuration files changes.',

  mai_up_030: 'Firmware upgrade and configuration file detection',
  mai_up_030_tip: 'Specifies how firmware upgrading and provisioning request to be sent.',

  mai_up_031: 'Upgrade without prompt',
  mai_up_031_tip: 'If set to "Yes", the device will automatically start upgrading after downloading the firmware files. Otherwise, users would need to confirm in the prompted message before upgrading process is started. The default value is "No".',

  mai_up_032: 'Config provision',
  mai_up_032_tip: 'Device will download the configuration files and provision by the order you set.',

  mai_up_033: 'Enable randomized automatic upgrade',
  mai_up_033_tip: 'Setting whether to upgrade automatically at random. It means whether the phone will upgrade automatically at random time point in the setting period. This option is mainly used for multiple phones upgrade at the same time.',

  mai_up_034: 'Disable SIP NOTIFY authentication',
  mai_up_034_tip: 'Device will not challenge NOTIFY with 401 when set to "Yes".',

  mai_up_035: 'Validate server certificate',
  mai_up_035_tip: 'Configures whether to validate the server certificate when download the firmware/config file. If set to "Yes", the phone will download the firmware/config file only from the legitimate server. The default setting is "No".',

  mai_up_036: 'mDNS override server',
  mai_up_036_tip: 'If set to "Use Type A", the device will send type A mDNS request to the server, then request to download config file once connected successfully. If set to "Use Type SRV", the device will send type SRV mDNS request to the server, then request to download config file once connected successfully. If set to "Disable", the device will not send request. The default setting is "Use Type A".',

  mai_up_037: 'Allow DHCP option 43, 160 and 66 to override server',
  mai_up_037_tip: 'If DHCP option 43, 160 and 66 is turned ON in the LAN, the device will reset the configuration CPE, upgrade, network vlan Tag, and Priority according to option 43 sent by the server. At the same time, the update mode and server path of the configuration upgrade module will be reset according to the option 160 and 66 sent by the server. The default setting is "on".',

  mai_up_038: 'Additional Override DHCP Option',
  mai_up_038_tip: 'Additional DHCP Option that will be used as a firmware server instead of the setting one or name server from option 43 and 66. However, this option will be effective only when option \'Allow DHCP Option 43 and Option 66 to Override Server\' is enabled.',

  mai_up_039: 'DHCP option 120 override SIP server',
  mai_up_039_tip: 'Enables DHCP Option 120 from local server to override the SIP Server on the device.',

  mai_up_040: '3CX auto provision',
  mai_up_040_tip: 'If set to "Yes", the device will send SUBSCRIBE packets to the multicast IP address to request 3CX server\'s provisioning. 3CX server should be properly set up in the LAN network before using this feature.',

  mai_up_041: 'Factory reset',
  mai_up_041_tip: 'If set to "Yes", the device will send SUBSCRIBE packets to the multicast IP address to request 3CX server\'s provisioning. 3CX server should be properly set up in the LAN network before using this feature.',

  /* Troubleshooting */
  mai_tr_001: 'Syslog protocol',
  mai_tr_001_tip: 'Configure sending syslog through UDP or secured SSL/TLS protocol to syslog server.',

  mai_tr_002: 'Syslog server address',
  mai_tr_002_tip: 'The IP address or URL for the System log server.',

  mai_tr_003: 'Syslog level',
  mai_tr_003_tip: 'Selects the syslog level from the drop-down menu. The default setting is "None", meaning no syslog is sent. Please refer to User Manual for more details.',

  mai_tr_004: 'Syslog keyword filter',
  mai_tr_004_tip: 'After entering the keywords, you will filter the system log with keywords, and multiple keywords should be separated by commas. For example, set the filter keyword "SIP" to filter SIP log. set the filter keyword "Http,SIP" to filter Http and SIP log.',

  mai_tr_005: 'H.323 syslog level',
  mai_tr_005_tip: 'Select H.323 Syslog level in the drop-down menu, the default setting is "Off", which means no H323 syslog info in syslog. You can also select from level 1 to 10, 10 is the highest level.',

  mai_tr_006: 'Send SIP log',
  mai_tr_006_tip: 'Configures whether the SIP log will be included in the syslog messages.',

  mai_tr_007: 'Clear log',
  mai_tr_007_tip: 'Click "CLEAR" button to delete the logs saved in the device.',

  mai_tr_008: 'Log tag',
  mai_tr_008_tip: 'Specifies the log tag to filter the log.',

  mai_tr_009: 'Log priority',
  mai_tr_009_tip: 'Selects the log priority. The log priority options are: <br/> Verbose/Debug/Info/Warn/Error/Fatal/Silent(suppress all output)',

  mai_tr_010: 'One-click debugging',
  mai_tr_010_tip: 'Capture the checked info in the debugging list, click "Start" to debug if including "Capture trace" item and click "Stop" to end, Click "Capture" in other situation. All retrieved files will be generated to a package, and the last package will be overwritten, while the trace file will stay remain.',

  mai_tr_011: 'Debug info menu',
  mai_tr_011_tip: 'Display a list of info items that can be debugged, currently supports system logs, info log and capture package. The captured data can be viewed in "Debug information list". The default is all selected.',

  mai_tr_012: 'Debug info list',
  mai_tr_012_tip: 'You can select the existing debugging info package or grab package. Click the "Delete" button on the right to delete the file.',

  mai_tr_013: 'View debug info',
  mai_tr_013_tip: 'Click "list" to view the existing debugging info package or trace file. The captured files are sorted in chronological order, click to download the file to the computer for analysis.',

  mai_tr_014: 'Enable core dump generation',
  mai_tr_014_tip: 'Configures whether to generate and save the core dump file when the programme crashes.',

  mai_tr_015: 'Core dump list',
  mai_tr_015_tip: 'Select the existing core dump file in the drop-down box. Users could lick the "Delete" button on the right to delete the file.',

  mai_tr_016: 'View core dump',
  mai_tr_016_tip: 'Click the "List" button to view all existing core dump files. The files are listed in chronological order, users could click the file name to download the file to the local computer.',

  mai_tr_017: 'Record',
  mai_tr_017_tip: 'Click to start capturing audio data, click the "Stop" button to end. To capture the audio data of the device can help to locate audio issues. The default is not enabled. You can record up to 1 minute audio data.',

  mai_tr_018: 'Recording list',
  mai_tr_018_tip: 'Choose the existing audio file. Click the "Delete" button on the right to delete this file.',

  mai_tr_019: 'View recording',
  mai_tr_019_tip: 'Click on the "List" button to view. The captured audio data will cover the data which saved last time. Click to download the data to the computer for analysis.',

  mai_tr_020: 'Target host',
  mai_tr_020_tip: 'The IP address or URL for the Target Host of the Traceroute.',

  mai_tr_021: 'Developer mode',
  mai_tr_021_tip: 'If turned on, ADB (Android Debug Bridge) function will be enabled on the device. The default setting is "Disabled".',

  mai_tr_022: 'Target host',
  mai_tr_022_tip: 'The IP address or URL for the Target Host of the Ping.',

  mai_tr_023: 'Host name',
  mai_tr_023_tip: 'Nslookup Target Host',

  mai_999: ''
}
