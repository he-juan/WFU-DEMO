/* eslint-disable no-multiple-empty-lines */
/**
 * 通用词条
 * btns 按钮类
 * msgs 规则，提示类
 * routes 路由相关tab类
 * commons 通用类
 */
const routes = {
  r_001: 'Call',
  r_002: 'Account',
  r_003: 'Call Features',
  r_004: 'Network Settings',
  r_005: 'System Settings',
  r_006: 'Device Control',
  r_007: 'App',
  r_008: 'Maintenance',
  r_009: 'Status',
  r_010: 'Call',
  r_011: 'Contacts',
  r_012: 'Schedule',
  r_013: 'Call History',
  r_014: 'General Settings',
  r_015: 'Call Settings',
  r_016: 'Site Name',
  r_017: 'Audio Control',
  r_018: 'Video Settings',
  r_019: 'Ethernet Settings',
  r_020: 'WI-FI Settings',
  r_021: 'OpenVPN® Settings',
  r_022: 'Advanced Settings',
  r_023: 'Power Manager',
  r_024: 'Time & Language',
  r_025: 'TR-069',
  r_026: 'Security Settings',
  r_027: 'Camera Control',
  r_028: 'Preset Settings',
  r_029: 'Peripheral',
  r_030: 'Remote Control',
  r_031: 'LDAP Contacts',
  r_032: 'Recording Management',
  r_033: 'Upgrade',
  r_034: 'Troubleshooting',
  r_035: 'Account Status',
  r_036: 'Interface Status',
  r_037: 'Network Status',
  r_038: 'System Info',
  r_039: 'Remote Control Status',
  r_040: 'Contacts List',
  r_041: 'Group',
  r_042: 'Local Schedule',
  r_043: 'Invited',
  r_044: 'Sip Settings',
  r_045: 'Codec Settings',
  r_046: 'Call Settings',
  r_047: 'WI-FI Basics',
  r_048: 'Add Network',
  r_049: 'Time Settings',
  r_050: 'Language',
  r_051: 'Web/SSH Access',
  r_052: 'User Info Management',
  r_053: 'Screen Lock Password',
  r_054: 'Certificate Management',
  r_055: 'Firmware',
  r_056: 'Config File',
  r_057: 'Provision',
  r_058: 'Syslog',
  r_059: 'Logcat',
  r_060: 'Debug',
  r_061: 'Traceroute',
  r_062: 'Developer Mode',
  r_063: 'NSLookup',
  r_064: 'SIP',
  r_065: 'IPVideoTalk',
  r_066: 'Bluejeans',
  r_067: 'H.323',
  r_068: 'SIP TLS',
  r_069: 'Ping',
  r_070: 'Third Party Application',
  r_071: 'Remote Diagnosis',
  r_072: 'Video Conf Service Platform',
  r_073: 'Zoom',
  r_074: 'HDMI',
  r_075: 'Camera',
  r_076: '无线麦',
  r_077: 'Media',
  r_078: 'Advanced Network Settings',
  r_079: 'Recording Config',
  r_080: 'Video List',
  r_081: 'Audio List',
  r_083: 'BroadSoft Directories',
  r_085: 'XSI Service Settings',
  r_086: 'Network Directories',

  r_999: ''
}

const btns = {
  b_001: 'Save',
  b_002: 'OK',
  b_003: 'Delete',
  b_004: 'Upload',
  b_005: 'Cancel',
  b_006: 'Reboot',
  b_007: 'Sleep',
  b_008: 'Shutdown',
  b_009: 'Reboot',
  b_010: 'Power off',
  b_011: 'Reboot when idle',
  b_012: 'Sleep when idle',
  b_013: 'Power off when idle',
  b_014: 'Login',
  b_015: 'Refresh',
  b_016: 'Browse',
  b_017: 'Settings',
  b_018: 'Edit',
  b_019: 'Lock',
  b_020: 'Unlock',
  b_021: 'Download',
  b_022: 'Reset',
  b_023: 'Clear',
  b_024: 'Get log',
  b_025: 'Start',
  b_026: 'Stop',
  b_027: 'Pause',
  b_028: 'Capture',
  b_029: 'Please upload zip file',
  b_030: 'Scan',
  b_031: 'Details',
  b_032: 'Connect',
  b_033: 'Forget',
  b_034: 'Disconnect',
  b_035: 'Remote control',
  b_036: 'Logout',
  b_037: 'Clear all',
  b_038: 'New contact',
  b_039: 'Import contacts',
  b_040: 'Export contacts',
  b_041: 'Download contacts',
  b_042: 'More',
  b_043: 'Call',
  b_044: 'Add Number',
  b_045: 'Import',
  b_046: 'Export',
  b_047: 'New group',
  b_048: 'New Meeting',
  b_049: 'Reschedule',
  b_050: 'Delete recording',
  b_051: 'Start Meeting',
  b_052: 'Edit conference',
  b_053: 'Cancel conf',
  b_054: 'Cancel this meeting',
  b_055: 'Cancel the entire meeting',
  b_056: 'Add',
  b_057: 'Apply',
  b_058: 'Set as default',
  b_059: 'Continue Submit',
  b_060: 'Back edit',
  b_061: 'Video invite',
  b_062: 'Audio invite',
  b_063: 'Up',
  b_064: 'Down',
  b_065: '',
  b_066: '',
  b_067: '',
  b_068: '',
  b_069: '',

  b_999: ''
}

const msgs = {
  m_001: 'Saved successfully',
  m_002: 'Settings failed to save. Please try again.',
  m_003: 'This field is required',
  m_004: 'Modify the connection method or port, web will lead to log out and jump to the new address:',
  m_005: 'Admin password error, please enter again.',
  m_006: 'Invalid character exists!',
  m_007: 'The two passwords you entered did not match.',
  m_008: 'Please enter at least 6 characters.',
  m_009: 'Alphanumeric password must contain at least one number and at least one lowercase letter, uppercase letter or special character.',
  m_010: 'Please input new administration\'s or user\'s password!',
  m_011: 'Please input new user password!',
  m_012: 'Screen lock password is six-digit number',
  m_013: 'Deleted successfully.',
  m_014: 'Delete failed.',
  m_015: 'Deleting',
  m_016: 'Are you sure to delete?',
  m_017: 'The number has reached its limit!',
  m_018: 'Uploaded successfully.',
  m_019: 'Upload failed.',
  m_020: 'The certificate is not a CA certificate!',
  m_021: 'The certificate already existed!',
  m_022: 'The certificate is not valid!',
  m_023: 'Do you want to reboot your device?',
  m_024: 'Do you want to enter sleep mode?',
  m_025: 'Do you want to shut down the device?',
  m_026: 'Please don\'t operate the device since it is upgrading now.',
  m_027: 'perated successfully.',
  m_028: 'Operation failed.',
  m_029: 'Device is busy now...',
  m_030: 'The device is rebooting now...',
  m_031: 'The device is shutting down now...',
  m_032: 'The device is sleeping now...',
  m_033: 'If the device is on a call, it will reboot after the call ends.<br/>You may relogin by clicking on the link below in 2 minutes after rebooting.',
  m_034: 'You may relogin by clicking on the link below after rebooting.',
  m_035: 'You may relogin by clicking on the link below after waking up the device.',
  m_036: 'detele custom language file?',
  m_037: 'Need reboot to take effect',
  m_038: 'Saving',
  m_039: 'Rename failed.',
  // m_040: 'Locked video cannot be edited',
  // m_041: 'Locked video cannot be deleted',
  m_042: 'The file name already exists. Please re-enter',
  m_043: 'Rename failed. Invalid characters!',
  m_044: 'Files are locked and cannot be renamed!',
  // m_045: 'Are you sure you want to delete this recording?',
  // m_046: 'Are you sure to delete the selected recording?',
  m_047: 'No storage device',
  // m_048: 'Record name cannot be empty',
  // m_049: 'Please enter Record name',
  m_050: 'The length can\'t exceed',
  m_051: 'Same version, do not need update!',
  m_052: 'Read file error!',
  m_053: 'Firmware signature error!',
  m_054: 'Unable to read the current version!',
  m_055: 'The firmware is not compatible with this hardware!',
  m_056: 'Incompatible image ID!',
  m_057: 'Incompatible firmware!',
  m_058: 'Low memory!',
  m_059: 'The firmware is damaged!',
  m_060: 'Insufficient disk space!',
  m_061: 'Unknown error!',
  m_062: 'Uploading',
  m_063: 'Please Wait..',
  m_064: 'Failed to initiate the upgrade!',
  m_065: 'Please fill in correct GUI customization file server path!',
  m_066: 'Factory reset will erase all your settings, please confirm to continue?',
  m_067: 'Cleared successfully.',
  m_068: 'There\'s not enough storage space left for this file.',
  m_069: 'Network error.',
  m_070: 'perated successfully, waiting...',
  m_071: 'Get failed!',
  m_072: 'Please enter a valid URL.',
  m_073: 'Please enter a valid IPv6 address.',
  m_074: 'Incorrect IP address format.',
  m_075: 'Valid: integer.',
  m_076: 'Can not include chinese characters.',
  m_077: 'Must be numbers.',
  m_078: 'Valid:{min}-{max}',
  m_079: 'Correct format hh:mm.',
  m_080: 'Please enter no more than {n} characters', // n length
  m_081: 'The session expiration value shouldn\'t be smaller than Min-SE.',
  m_082: 'Audio payload type cannot be 98 or 99.',
  m_083: 'Payload types cannot be the same.',
  m_084: 'Please keep at least one option.',
  m_085: 'Uploaded successfully. Please check the device.',
  m_086: 'Please upload file with correct format (.wav/.mp3)',
  m_087: 'Please enter an even number',
  m_088: 'PPPoE account ID and password cannot be empty.',
  m_089: 'Invalid subnet mask.',
  m_090: 'Hostname format error.',
  m_091: 'The hostname and port cannot be empty.',
  m_092: 'Password length can\'t less than 8!',
  m_093: 'WEP Wi-Fi only allows entering password with 5, 10, 13, 26, 16 or 32 digits!',
  m_094: 'Operate successfully, you may need to use new IP address to login if network environment has changed.',
  m_095: 'Please enter the name of the configuration.',
  m_096: 'Sorry, no matching results.',
  m_097: 'Please confirm to delete the selected contact.',
  m_098: 'Are you sure you want to clear all contacts?',
  m_099: 'Clear all successfully!',
  m_100: 'Clear all failed!',
  m_101: 'Number cannot be empty.',
  m_102: 'Contact name is empty, please enter a contact name.!',
  m_103: 'The name already exists, are you sure to continue: to create the same name contacts?',
  m_104: 'Importing. Please wait.',
  m_105: 'Import Succeed!',
  m_106: 'Import Fail!',
  m_107: 'The device has no storage space, import/download failed!',
  m_108: 'Address book is full, no more contacts can be added.',
  m_109: 'Import is not processed.Import will cause the number of contacts over',
  m_110: 'Contacts importing/exporting/downloading is already in progress, please do not operate again!',
  m_111: 'Exporting. Please wait.',
  m_112: 'Export Succeed!',
  m_113: 'Export Fail!',
  m_114: 'No contacts can be exported.',
  m_115: 'Authentication fails, can not download contacts, please check your user name and password.',
  m_116: 'Download server can\'t be empty!',
  m_117: 'Download succeed!',
  m_118: 'Download failed!',
  m_119: 'Do you want to clear the group?',
  m_120: 'Do you want to delete the group?',
  m_121: 'No callable number',
  m_122: 'Group name can\'t be empty!',
  m_123: 'The group name already exists, please enter a new group name.',
  m_124: 'Please confirm to delete the conference',
  m_125: 'Please confirm to cancel the conference.',
  m_126: 'In talking, You cannot start a new meeting.',
  m_127: 'Start time should be later than the current time + 5min.',
  m_128: 'Please select at least one member.',
  m_129: 'The maximum TLS version must be greater than or equal to the minimum TLS version.',
  m_130: 'Format error.',
  m_131: 'Config provision can not be empty',
  m_132: 'The end time cannot exceed start time of automatic upgrade hour.',
  m_133: 'The start time and the end time can not be empty.',
  // m_133: 'Error:The start time and the end time must be empty or not empty at the same time.', old
  m_134: 'The local SIP port is 5060 in your account, save the operation will change the port to the random one, sure to change?',
  m_135: 'Start time cannot be empty',
  m_136: 'Applying, please wait...',
  m_137: 'The number of members has reached the limit({max})',
  m_138: 'Install failed',
  m_139: 'Unknown error',
  m_140: 'Same version, do not need update',
  m_141: 'Read file error',
  m_142: 'Firmware signature error',
  m_143: 'The firmware is not compatible with this hardware',
  m_144: 'Incompatible image ID',
  m_145: 'Incompatible firmware',
  m_146: 'Low memory',
  m_147: 'The firmware is damaged',
  m_148: 'Insufficient disk space',
  m_149: 'Incompatible OEM ID',
  m_150: 'Firmware server path changed',
  m_151: 'Provision succeed, please check the device.',
  m_152: 'Please confirm to delete all selected call history.',
  m_153: 'Please confirm to clear all call history.',
  m_154: 'Please enter username',
  m_155: 'Please enter password',
  m_156: 'The user has locked out until next reboot.',
  m_157: 'The user has locked out for 5 minutes.',
  m_158: 'The username is not exist.',
  m_159: 'Wrong username or password, attempts-remaining:{n}',
  m_160: 'Too many consecutive failed login attempts. Locked out for 5 minutes.',
  m_161: 'Auth Failed',
  m_162: 'Please input new password',
  m_163: 'Please confirm password',
  m_164: 'Password does not match',
  m_165: 'Please enter at least 6 characters.',
  m_166: 'Password format incorrect',
  m_167: 'Change failed',
  m_168: 'Administrator password can\'t be empty',
  m_169: 'The administrator\'s new password can\'t be the same as the default password',
  m_170: 'The user password can\'t be empty',
  m_171: 'The user\'s new password cannot be the same as the default password',
  m_172: 'Invalid gateway.',
  m_173: 'Account error',
  m_174: 'The number is anonymous',
  m_175: 'The number is call feature number',
  m_176: 'Enable SRTP calling',
  m_177: 'Disable SRTP calling',
  m_178: '\"Send anonymous\" is enabled',
  m_179: '\"Send anonymous\" is disabled',
  m_180: '\"Call waiting\" is enabled',
  m_181: '\"Call waiting\" is disabled',
  m_182: 'Enable call forward unconditional',
  m_183: 'Disable call forward unconditional',
  m_184: 'Enable call forward when busy',
  m_185: 'Disable call forward when busy',
  m_186: 'Enable call forward when timeout',
  m_187: 'Disable call forward when timeout',
  m_188: 'IP Call has been disabled',
  m_189: 'IP address format error',
  m_190: 'The number do not match dial plan rule',
  m_191: 'The number match partial dial plan rule',
  m_192: 'Disable conference',
  m_193: 'The number of members has reached the limit',
  m_194: 'There is no enough conference seats',
  m_195: 'There is no enough idle line',
  m_196: 'The bluetooth line is full',
  m_197: 'The calling number has been exist in an other calling line',
  m_198: 'The calling number has been exist in an other ringing line',
  m_199: 'The calling number has been exist in an other talking line',
  m_200: 'The calling number has been exist in an other conference line',
  m_201: 'The calling number is not an emergency number',
  m_202: 'Can not calling because the phone is in recover backup',
  m_203: 'The video line is full, unable to make new video call',
  m_204: 'H.323 not support conference',
  m_205: 'Enable DND?',
  m_206: 'Disable DND?',
  m_207: 'Please fill in correct firmware server path',
  m_208: 'Please fill in correct config server path',
  m_209: 'The device is Factory Reseting now...',
  m_210: 'If the device is on a call, it will Factory Reset after the call ends.<br>You may log in again in about 2 minutes.',
  m_211: 'Remote diagnosis is enabled, ssh access cannot be disabled',
  m_212: 'Remote diagnosis is enabled, modification of access method and port is prohibited',
  m_213: 'This device will allow remote collection of log information and remote access to web pages in the background. It will automatically close after 48h. Please confirm to open.',
  m_214: 'URL format incorrect',
  m_215: 'Username format incorrect',
  m_216: 'Saved, press apply to confirm changes',
  m_217: 'IP cannot be a class D address',
  m_218: 'The hostname cannot be empty.',
  m_219: 'The port cannot be empty.',
  m_220: 'PPPoE account ID cannot be empty.',
  m_221: 'PPPoE password cannot be empty.',
  m_222: 'The maximum input length has been exceeded.',
  m_223: 'Downloading...',
  m_224: 'The number is prohibited by Dialplan!',
  m_225: 'The call line has reached the upper limit. Currently only IPVideoTalk numbers can be selected.',
  m_226: 'The number of members has reached the maximum.',
  m_227: 'IPVideoTalk members has reached the maximum.',
  m_228: '\'Ldap Number Attributes\' and \'Ldap Mail Attributes\' cannot be empty at the same time',
  m_229: 'Please re-login with new IP if your device IP address has changed. Some items need to be restarted to take effect.',
  m_230: 'There are already other scheduled meetings during this time period, it is recommended to adjust the meeting time.',
  m_231: 'The calling line has reached the upper limit, currently only ipvt contacts can be added.',
  m_232: 'Set up successfully',
  m_233: '{acct} account unregistered, failed to call',
  m_234: 'Number cannot be empty',
  m_235: 'The contact already exists',
  m_236: 'The number of members has reached the limit.',
  m_237: 'Port cannot be 443 when  access method is HTTP.',
  m_238: 'Port cannot be 80 when  access method is HTTPS.',
  m_239: 'Supports up to 5 keywords',
  m_240: 'Up to 50 bytes per keyword',
  m_241: 'The maximum length of the password is not more than 32',
  m_242: 'Are you sure you want to delete this video?',
  m_243: 'Are you sure you want to delete this audio?',
  m_244: 'The call line has reached the upper limit. Currently only IPVideoTalk numbers can be selected.',
  // m_245: 'Audio name',
  m_246: 'Please enter video name',
  m_247: 'Please enter audio name',
  m_248: 'Video name cannot be empty',
  m_249: 'Audio name cannot be empty',
  m_250: 'Are you sure to delete the selected video?',
  m_251: 'Are you sure to delete the selected audio??',
  m_252: 'Locked video cannot be edited',
  m_253: 'Locked audio cannot be edited',
  m_254: 'Locked video cannot be deleted',
  m_255: 'Locked auido cannot be deleted',
  m_256: 'End time cannot be empty',
  m_257: 'Day of the week cannot be empty',
  m_258: '{s} has been used',

  m_999: ''
}

const commons = {
  c_001: 'Index ID',
  c_002: 'Issued to',
  c_003: 'Issued by',
  c_004: 'Expiration',
  c_005: 'Operate',
  c_006: 'Enter sleep mode',
  c_007: 'Shutdown',
  c_008: 'Never',
  c_009: 'All',
  c_010: 'After 1 min',
  c_011: 'After 5 mins',
  c_012: 'After 10 mins',
  c_013: 'After 15 mins',
  c_014: 'After 30 mins',
  c_015: 'After 60 mins',
  c_016: 'Regional (M/D/YYYY)',
  c_017: 'YYYY/MM/DD',
  c_018: 'MM/DD/YYYY',
  c_019: 'DD/MM/YYYY',
  c_020: 'Recommend',
  c_021: 'Not connected',
  c_022: 'System default position',
  c_023: 'Position when power off',
  c_024: 'Camera',
  c_025: 'Account',
  c_026: 'Default',
  c_027: 'File Name',
  c_028: 'Size',
  c_029: 'Power On Time',
  c_030: 'USB disk',
  c_031: 'extsd',
  c_032: 'Save path',
  c_033: 'Record name',
  c_034: 'Click Apply this preset',
  c_035: 'Click to edit the preset',
  c_036: 'Applied',
  c_037: 'Setting Name',
  c_038: 'Set Perspective',
  c_039: 'No data.',
  c_040: 'Config',
  c_041: 'CUST File',
  c_042: 'Prompt',
  c_043: 'Automatic Upgrade',
  c_044: 'Config Provision',
  c_045: 'Yes',
  c_046: 'No',
  c_047: 'Check every minute',
  c_048: 'Check every day',
  c_049: 'Check every week',
  c_050: 'Always check when bootup',
  c_051: 'When prefix/suffix changes',
  c_052: 'Skip firmware check',
  c_053: 'Not selected',
  c_054: 'Selected',
  c_055: 'Select all',
  c_056: 'Unselect all',
  c_057: 'Invert all',
  c_058: 'Sunday',
  c_059: 'Monday',
  c_060: 'Tuesday',
  c_061: 'Wednesday',
  c_062: 'Thursday',
  c_063: 'Friday',
  c_064: 'Saturday',
  c_065: 'None',
  c_066: 'Disable',
  c_067: 'Use type A',
  c_068: 'Use type SRV',
  c_069: 'On',
  c_070: 'Off',
  c_071: 'One-click debugging',
  c_072: 'List',
  c_073: 'Core Dump',
  c_074: 'Syslog',
  c_075: 'Logcat',
  c_076: 'Capture trace',
  c_077: 'Record',
  c_078: 'Account',
  c_079: 'Number',
  c_080: 'SIP Server',
  c_081: 'Status',
  c_082: 'Registered',
  c_083: 'Unregistered',
  c_084: 'DHCP',
  c_085: 'Static IP',
  c_086: 'Network Configuration of Data',
  c_087: 'Network Configuration of VoIP Calls',
  c_088: 'Day',
  c_089: 'Hours',
  c_090: 'Minutes',
  c_091: 'Seconds',
  c_092: 'Unknown',
  c_093: 'User=Phone',
  c_094: 'Enabled',
  c_095: 'Keep-alive',
  c_096: 'Automatic',
  c_097: 'From header',
  c_098: 'Close',
  c_099: 'IP only',
  c_100: 'IP and port',
  c_101: 'Audio',
  c_102: 'Caller',
  c_103: 'Callee',
  c_104: 'encoding rate',
  c_105: 'Video',
  c_106: 'Standard',
  c_107: 'Media level',
  c_108: 'fps',
  c_109: 'VFR',
  c_110: 'Auto',
  c_111: 'Baseline profile',
  c_112: 'Main profile',
  c_113: 'High profile',
  c_114: 'Presentation settings',
  c_115: 'RTP Settings',
  c_116: 'Enabled but not forced',
  c_117: 'Enabled and forced',
  c_118: 'Accept',
  c_119: 'Deny',
  c_120: 'Remote',
  c_121: 'Average',
  c_122: 'POP',
  c_123: 'PIP',
  c_124: 'Dial Page',
  c_125: 'Contact',
  c_126: 'Incoming Call History',
  c_127: 'Outgoing Call History',
  c_128: 'Log all',
  c_129: 'Log incoming/outgoing only (missed calls are not recorded)',
  c_130: 'Disable call log',
  c_131: 'China Mobile',
  c_132: 'Huawei IMS',
  c_133: 'Call forwarding',
  c_134: 'Unconditional',
  c_135: 'Time based',
  c_136: 'Other',
  c_137: 'Ringtone',
  c_138: 'Use system ringtone',
  c_139: 'Manual',
  c_140: 'Auto mute on incoming call',
  c_141: 'Auto mute on outgoing call',
  c_142: 'Auto mute on incoming & outgoing call',
  c_143: 'Rules',
  c_144: 'Opaque',
  c_145: 'Upper left corner',
  c_146: 'Upper right corner',
  c_147: 'Lower left corner',
  c_148: 'Lower right corner',
  c_149: 'Do Not display',
  c_150: 'Always display',
  c_151: 'Smallest',
  c_152: 'Smaller',
  c_153: 'Small',
  c_154: 'Medium',
  c_155: 'Large',
  c_156: 'Larger',
  c_157: 'Largest',
  c_158: 'Mute',
  c_159: 'Bluetooth',
  c_160: 'Built-in Speaker',
  c_161: 'Gooseneck mic',
  c_162: 'Original proportion',
  c_163: 'Equal proportional cutting',
  c_164: 'Proportional add black edge',
  c_165: 'Both, prefer IPv4',
  c_166: 'Both, prefer IPv6',
  c_167: 'IPv4 Only',
  c_168: 'IPv6 Only',
  c_170: 'DHCP Option 132 and DHCP Option 133',
  c_171: 'Encapsulated in DHCP Option 43',
  c_172: 'Auto-configured',
  c_173: 'Statically configured',
  c_174: '802.1X mode',
  c_175: 'Advanced Network Settings',
  c_176: 'Proxy',
  c_177: 'Simple Mode',
  c_178: 'Professional Mode',
  c_179: 'Connected',
  c_180: 'Available Wi-Fi',
  c_181: 'Saved',
  c_182: 'Network Prefix Length',
  c_183: 'Gateway',
  c_184: 'IP Address',
  c_185: 'Address Type',
  c_186: 'Show Advanced Options',
  c_187: 'Password',
  c_188: 'Anonymous identity',
  c_189: 'Identity',
  c_190: 'unspecified',
  c_191: 'User Certificate',
  c_192: 'CA Certificate',
  c_193: 'Phase 2 Authentication',
  c_194: 'EAP Method',
  c_195: 'Security Mode',
  c_196: 'Frequency',
  c_197: 'Wi-Fi Strength',
  c_198: 'Status',
  c_199: 'IPv6 Address',
  c_200: 'IPv4 Address',
  c_201: 'IP Address',
  c_202: 'Link Speed',
  c_203: 'Poor',
  c_204: 'Fair',
  c_205: 'Good',
  c_206: 'Excellent',
  c_207: 'DNS 1',
  c_208: 'DNS 2',
  c_209: 'Search',
  c_210: 'No search results',
  c_211: 'No contacts,try',
  c_212: 'or',
  c_213: 'Name',
  c_214: 'Number',
  c_215: 'Group',
  c_216: 'New contact',
  c_217: 'Edit contacts',
  c_218: 'Display name',
  c_219: 'Active account',
  c_220: 'Email',
  c_221: 'Address',
  c_222: 'Note',
  c_223: 'Website',
  c_224: 'Import contacts',
  c_225: 'Clear all',
  c_226: 'Keep Local Contacts',
  c_227: 'Replace by name',
  c_228: 'Replace by number',
  c_229: 'Export contacts',
  c_230: 'Download',
  c_231: 'No groups, try',
  c_233: 'Group Members',
  c_234: 'Member',
  c_235: 'Members',
  c_236: 'New group',
  c_237: 'Edit groups',
  c_238: 'Group name',
  c_239: 'Contacts',
  c_240: 'Selected contacts',
  c_241: 'Please check the contacts you want to add.',
  c_243: 'Some items need to be restarted to take effect, need to restart immediately?',
  c_244: 'No meeting appointment, try',
  c_245: 'Processing',
  c_246: 'To be hosted',
  c_247: 'Is not started',
  c_248: 'Over',
  c_249: 'Organizer',
  c_250: 'Cancel conf',
  c_251: 'Me',
  c_253: 'Time',
  c_254: 'Send invitation',
  c_255: 'Accept',
  c_256: 'Not determined',
  c_257: 'Not Repeat',
  c_258: 'Every weekday (Mon-Fri)',
  c_259: 'Every week ({n})',
  c_260: 'Monthly ({n}th of each month)',
  c_261: 'Custom',
  c_263: 'Daily',
  c_264: 'Weekly',
  c_265: 'Monthly (by week)',
  c_266: 'Monthly (by day)',
  c_267: 'Yearly',
  c_268: 'first',
  c_269: 'second',
  c_270: 'third',
  c_271: 'fourth',
  c_273: 'last',
  c_274: 'Preset',
  c_275: 'Meeting details',
  c_276: 'Every fixed days',
  c_277: 'Every fixed weeks',
  c_278: 'Every fixed months',
  c_279: 'Every fixed years',
  c_280: 'Status',
  c_281: 'Related account',
  c_283: 'Subject',
  c_284: 'Start time',
  c_285: 'Conference Duration',
  c_286: 'Repeat',
  c_287: 'Custom repeat',
  c_288: 'Day of the week',
  c_289: 'Repeat on',
  c_290: 'Please select',
  c_291: 'Cycle Time',
  c_292: 'Conference password',
  c_293: ' ',
  c_294: '0-10 digits',
  c_295: 'Conference members do not need a conference password',
  c_296: 'Member',
  c_297: 'No limit',
  c_298: 'Only for REGISTER',
  c_299: 'Yes to All SIP',
  c_300: 'Yes except REGISTER',
  c_301: 'Default account',
  c_302: 'Yesterday',
  c_303: 'Today',
  c_304: 'Tomorrow',
  c_305: 'Call',
  c_306: 'Deactivate the default account, set new default account to:',
  c_307: 'Firmware Upgrade',
  c_308: 'Missed Call',
  c_309: 'Call failed',
  c_310: ' Hour ',
  c_311: ' Min ',
  c_312: ' Sec ',
  c_313: 'Save to local contacts',
  c_314: 'Add contact',
  c_315: 'Date',
  c_316: 'Reschedule',
  c_317: 'Select contacts',
  c_318: 'Welcome to',
  c_319: 'Username',
  c_320: 'Change password',
  c_321: 'The device is currently using default password. Please change the password.',
  c_322: 'New password',
  c_323: '6 to 32 characters, contain at least 1 number, and 1 letter/special character.',
  c_324: 'Confirm password',
  c_325: 'The HDMI output interface marked with number "1" is the primary interface to output primary video. Please make sure to follow the port order when connecting HDMI OUT for normal use.',
  c_326: 'DND',
  c_327: 'Back to the top',
  c_328: 'Forbidden',
  c_329: 'Recent call',
  c_330: 'Please enter a number or IP address，Multiple numbers can be separated with "Enter". ',
  c_331: '(If empty, click to start IPVT meeting)',
  c_332: 'No active account',
  c_333: 'Local Contacts',
  c_334: 'Call History',
  c_335: 'Contacts',
  c_336: 'Add member',
  c_337: 'Meeting ID',
  c_338: 'Password (optional)',
  c_339: 'Local',
  c_340: 'Local + Remote',
  c_341: 'Presentation + Remote',
  c_342: 'Local + Presentation + Remote',
  c_343: 'No call history',
  c_345: 'Next Day',
  c_346: 'people', // 单数
  c_347: 'peoples', // 复数
  c_348: 'Video name',
  c_349: 'Audio name',
  c_350: 'Multiple numbers can be separated with "Enter".',


  c_391: 'Disabled',
  c_399: 'Enabled',
  c_405: 'Account ',
  c_450: 'Login Credentials',
  c_451: 'SIP Credentials',
  c_452: 'Personal Directory',
  c_453: 'Group Common',
  c_454: 'Group Directory',
  c_455: 'Enterprise Common',
  c_456: 'Enterprise Directory',
  c_457: 'Polycom Phonebook',
  c_458: 'Type',
  c_459: 'Name',
  c_460: 'Missed Call Log',
  c_461: 'Placed Call Log',
  c_462: 'Received Call Log',
  c_463: 'Level',
  c_464: 'Lowest',
  c_465: 'Highest',
  c_466: 'General Settings',
  c_467: 'PTT/Group Paging',
  c_468: 'Multicast Paging Function',
  c_469: 'Multicast Channel Settings',
  c_470: 'Not set',
  c_471: 'Channel',
  c_472: 'Multicast Address',
  c_473: 'PTT Config',
  c_474: 'Paging Config',
  c_475: 'Channel Config',
  c_476: 'Emergency call',
  c_477: 'Priority call',
  c_478: 'Available',
  c_479: 'Transmit',
  c_480: 'Subscribe',
  c_481: 'Join channel',
  c_482: 'Join group',
  c_483: 'Configure channel name',
  c_484: 'Multicast settings',
  c_485: 'Configure group name',
  c_486: 'IPV4 Address Type',


  c_999: ''
}

export default {
  ...btns,
  ...msgs,
  ...routes,
  ...commons
}
