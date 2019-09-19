/* eslint-disable no-multiple-empty-lines */
export default {
  /* Power management */

  sys_pow_001: 'Timeout options',
  sys_pow_001_tip: 'Set the timeout options, optional for into sleep mode and shut down, the default value is "Enter sleep mode".',

  sys_pow_002: 'Timeout setup',
  sys_pow_002_tip: 'According timeout option to set the timeout , if the time is set to "Never", the terminal will not be automatically entered into sleep mode or turn it off.The default value is "After 30 mins".',

  sys_pow_003: 'Reboot',
  sys_pow_003_tip: 'Set the device to restart.',

  sys_pow_004: 'Sleep',
  sys_pow_004_tip: 'Set the device to sleep mode.',

  sys_pow_005: 'Shutdown',
  sys_pow_005_tip: 'Turn off the device.',

  /* Time and Language */

  sys_tl_001: 'Assign NTP server address 1',
  sys_tl_001_tip: 'Defines the URL or IP address of the NTP server. The device may obtain the date and time from the server.',

  sys_tl_002: 'Assign NTP server address 2',
  sys_tl_002_tip: 'Defines the URL or IP address of the NTP server. The device may obtain the date and time from the server.',

  sys_tl_003: 'DHCP option 42 override NTP server',
  sys_tl_003_tip: 'Defines whether DHCP Option 42 should override NTP server or not. When enabled, DHCP Option 42 will override the NTP server to synchronize date and time on the device if it\'s set up on the LAN. The default setting is "Yes".',

  sys_tl_004: 'DHCP Option 2 to override time zone setting',
  sys_tl_004_tip: 'Allows device to get provisioned for Time Zone from DHCP Option 2 in the local server automatically. The default setting is "Yes".',

  sys_tl_005: 'Use 24-hour format',
  sys_tl_005_tip: 'Defines 12-hour or 24-hour time display format.',

  sys_tl_006: 'Date display format',
  sys_tl_006_tip: 'Configures date format displayed on the device.',

  sys_tl_007: 'Set date',
  sys_tl_007_tip: 'Customize date settings on the device.',

  sys_tl_008: 'Set time',
  sys_tl_008_tip: 'Customize time settings on the device.',

  sys_tl_009: 'Time Zone',
  sys_tl_009_tip: 'Configures specific timezone for the device. If DHCP Option2 is activated, the device will skip this setting and directly use the time zone sent by DHCP Option2.',

  sys_tl_010: 'Language selection',
  sys_tl_010_tip: 'Select the language from the drop-down menu.',

  sys_tl_011: 'Select language file',
  sys_tl_011_tip: 'Press "Browse" to bring up a file selection menu to select the local .txt file to upload to the device.',

  /* TR069 */

  sys_tr_001: 'Enable TR-069',
  sys_tr_001_tip: 'Enables TR-069. If set to "Yes", the device will send session request to the ACS server. The default setting is "Yes".',

  sys_tr_002: 'ACS URL',
  sys_tr_002_tip: 'URL for TR-069 Auto Configuration Servers (ACS).',

  sys_tr_003: 'ACS username',
  sys_tr_003_tip: 'ACS username for TR-069.',

  sys_tr_004: 'ACS password',
  sys_tr_004_tip: 'ACS password for TR-069.',

  sys_tr_005: 'Enable periodic inform',
  sys_tr_005_tip: 'Enables periodic inform. If set to "Yes", the device will send inform requests to the ACS periodically. The default setting is "No".',

  sys_tr_006: 'Periodic inform interval (s)',
  sys_tr_006_tip: 'Sets up the periodic inform interval to send the inform packets to the ACS.',

  sys_tr_007: 'Connection request username',
  sys_tr_007_tip: 'The user name for the ACS to connect to the device. It should match the configuration in the ACS.',

  sys_tr_008: 'Connection request password',
  sys_tr_008_tip: 'The password for the ACS to connect to the device. It should match the configuration in the ACS.',

  sys_tr_009: 'Connection request port',
  sys_tr_009_tip: 'The port for the request sent from the ACS to the device. It should not be occupied by other protocol used on the device. For example, it cannot be 5060 or 5004 which are already used for SIP protocol.',

  sys_tr_010: 'CPE cert file',
  sys_tr_010_tip: 'The Cert File for the device to connect to the ACS via SSL.',

  sys_tr_011: 'CPE cert key',
  sys_tr_011_tip: 'The Cert Key for the device to connect to the ACS via SSL.',

  /* Security settings */

  sys_sec_001: 'Disable SSH',
  sys_sec_001_tip: 'If set to "Yes", the device will not allow any SSH access to the device.',

  sys_sec_002: 'Access method',
  sys_sec_002_tip: 'Allows users to select HTTP or HTTPS for Web Access.',

  sys_sec_003: 'Port number',
  sys_sec_003_tip: 'By default, HTTP uses port 80 and HTTPS uses port 443. This field is for customizing the web port.',

  sys_sec_004_1: 'Current admin password',
  sys_sec_004_2: 'Current user password',
  sys_sec_004_tip: 'Enter current administrator\'s password. This field is case sensitive. The maximum length is 32 alphabet characters.',

  sys_sec_005: 'New admin password',
  sys_sec_005_tip: 'Allows the user to change the admin password. The password field is purposely blank after clicking the “Save” button for security purpose. This field is case sensitive with a maximum length of 32 characters.',

  sys_sec_006: 'Confirm new admin password',
  sys_sec_006_tip: 'Enter the new Admin password again to confirm.',

  sys_sec_007: 'New user password',
  sys_sec_007_tip: 'Allows the administrator to set the password for user-level web GUI access. This field is case sensitive with a maximum length of 32 characters.',

  sys_sec_008: 'Confirm new user password',
  sys_sec_008_tip: 'Enter the new User password again to confirm.',

  sys_sec_009: 'Delete screen lock password',
  sys_sec_009_tip: 'Allows the administrator to clear the screen lock password.',

  sys_sec_010: 'Screen lock password',
  sys_sec_010_tip: 'Enter the password for screen lock. The field is 6-digit number.',

  sys_sec_011: 'Confirm screen lock password',
  sys_sec_011_tip: 'Enter the new screen lock password again to confirm.',

  sys_sec_012: 'SIP TLS certificate',
  sys_sec_012_tip: 'Defines the SSL certificate used for SIP over TLS to access particular websites. The device supports SIP over TLS encryption via the built-in private key and SSL certificate. The SSL certificate for TLS encryption should be X.509 format.',

  sys_sec_013: 'SIP TLS private key',
  sys_sec_013_tip: 'Defines the SSL Private key used for SIP over TLS.',

  sys_sec_014: 'SIP TLS private key password',
  sys_sec_014_tip: 'Defines the SSL Private key password used for SIP over TLS.',

  sys_sec_015: 'CA Certificate',
  sys_sec_016: 'Import trusted CA certificates',
  sys_sec_016_tip: 'Click the BROWSE to upload certificate file from PC. The certificate file should be ".pem", ".crt" , ".cer" or ".der" format. The Browse button will turn to "Processing" and back to "Browse" once the upload finished.',
  sys_sec_017: 'Trusted CA certificates',
  sys_sec_018: 'Custom certificate',
  sys_sec_019: 'Import custom certificate',
  sys_sec_019_tip: 'Click "Browse" to upload custom certificate file from PC. The certificate file should be ".pem", ".crt", ".cer" or ".der" format.',

  sys_sec_020: ' Minimum TLS Version',
  sys_sec_020_tip: 'Configures the minimum TLS version supported by the phone.',

  sys_sec_021: ' Maximum TLS Version',
  sys_sec_021_tip: 'Configures the maximum TLS version supported by the phone.',

  sys_999: ''

}