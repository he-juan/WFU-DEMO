/**
 * 账号下所有配置项的词条以及对应的tips词条
 */
export default {
  acct_001: 'Account Active',
  acct_001_tip: 'This field indicates whether the account is active. The default value for account H.323 is "No" and the default value for the other accounts is "Yes."',

  acct_002: 'Account Name',
  acct_002_tip: 'Configures the name associated with the account. It will show on the output display device.',

  acct_003: 'Sip Server',
  acct_003_tip: 'The URL or IP address, and port of the SIP server. This is provided by your VoIP service provider (ITSP).',

  acct_004: 'Secondary SIP Server',
  acct_004_tip: 'The URL or IP address, and port of the secondary SIP server. This will be used when the primary SIP server fails.',

  acct_005: 'Tertiary SIP Server',
  acct_005_tip: 'The URL or IP address, and port of the tertiary SIP server. This will be used when the secondary SIP server fails.',

  acct_006: 'SIP User Id',
  acct_006_tip: 'User account information, provided by your VoIP service provider (ITSP). It\'s usually in the form of digits similar to phone number or actually a phone number.',

  acct_007: 'SIP Authentication Id',
  acct_007_tip: 'SIP service subscriber\'s ID used for authentication. It can be identical to or different from the SIP User ID.',

  acct_008: 'SIP Authentication Password',
  acct_008_tip: 'The account password required for the phone to authenticate with the ITSP/SIP server before the account can be registered. The password will be hidden for secrurity purpose after it\'s saved.',

  acct_009: 'Display Name',
  acct_009_tip: 'The SIP server subscriber\'s name (optional) that will be used for Caller ID display.',

  acct_010: 'Voicemail Access Number',
  acct_010_tip: 'This ID is usually the VM portal access number. For example, in Asterisk server, 8500 could be used to access voice message.',

  acct_011: 'Tel URI',
  acct_011_tip: 'If the device has an assigned PSTN telephone number, this field should be set to "User=Phone". Then a "User=Phone" parameter will be attached to the Request-Line and "TO" header in the SIP request to indicate the E.164 number. If set to "Enable", "Tel:" will be used instead of "SIP:" in the SIP request. The default setting is "Disable".',

  acct_012: 'Outbound Proxy',
  acct_012_tip: 'IP address or domain name of the primary outbound proxy, media gateway, or session border controller. It\'s used by the device for Firewall or NAT penetration in different network environments. If a symmetric NAT is detected, STUN will not work and ONLY an outbound proxy can provide a solution.',

  acct_013: 'Secondary Outbound Proxy',
  acct_013_tip: 'IP address or Domain name of the Secondary Outbound Proxy, Media Gateway, or Session Border Controller. Secondary outbound proxy will be used when the primary outbound proxy fails.',

  acct_014: 'DNS Mode',
  acct_014_tip: 'This parameter controls how the Search Appliance looks up IP addresses for hostnames. There are three modes: A Record, SRV, NATPTR/SRV. The default setting is "A Record". If the user wishes to locate the server by DNS SRV, the user may select "SRV" or "NATPTR/SRV".',

  acct_015: 'NAT Traversal',
  acct_015_tip: 'Enables or disables the NAT traversal mechanism. If set to "STUN" and STUN server is configured, the device will route according to the STUN server. If NAT type is Full Cone, Restricted Cone or Port-Restricted Cone, the device will try to use public IP addresses and port number in all SIP and SDP messages. The device will send empty SDP packet to the SIP server periodically to keep the NAT port open if set to "Keep-alive". Select "NAT NO" if an outbound proxy is used. Select "OpenVPN" if OpenVPN is used. Select "UPnP" if the router supports UPnP. If set to "Auto", the device will try to use all traversal methods mentioned above until it finds an available one. If set to "TURN" and TURNserver is configured, the phone will route according to the TURN server. The default setting is "Keep-alive".',

  acct_016: 'Proxy-require',
  acct_016_tip: 'A SIP Extension to notify the SIP server that the device is behind a NAT/Firewall. Do not configure this parameter unless this feature is supported on the SIP server.',

  acct_017: 'SIP Registration',
  acct_017_tip: 'Selects whether or not the device will send SIP Register messages to the proxy/server. The default setting is "Yes".',

  acct_018: 'Unregister Before New Registration',
  acct_018_tip: 'If set to "No", the device will not unregister the SIP user\'s registration information. If set to "All",The SIP contact header will use "*" to clear all SIP user\'s registration information. If set to "Instance",the device only need to clear the current SIP user\'s info. The default is "Instance".',

  acct_019: 'Register Expiration (m)',
  acct_019_tip: 'Specifies the frequency (in minutes) in which the device refreshes its registration with the specified registrar. The default value is 60 minutes (1 hour). The maximum value is 64,800 minutes (about 45 days). The minimum value is 1 minute.',

  acct_020: 'Re-register Before Expiration (s)',
  acct_020_tip: 'Specifies the time frequency (in seconds) that the phone sends re-registration request before the Register Expiration. The range is from 0 to 64, 800.',

  acct_021: 'Subscribe Expiration (m)',
  acct_021_tip: 'Specifies the frequency (in minutes) in which the device refreshes its subscription with the specified register server. The maximun value is 64800(about 45 days).',

  acct_022: 'Wait Time Retry Registration (s)',
  acct_022_tip: 'The amount of time in which the device will retry the registration process in the event that is failed. The default value is 20 seconds.',

  acct_023: 'Local SIP Port',
  acct_023_tip: 'Defines the local SIP port used to listen and transmit. The default value is 5060.',
  acct_023_tip_2: 'Defines the local SIP port used to listen and transmit. The default value is 5070.',

  acct_024: 'SUBSCRIBE For MWI',
  acct_024_tip: 'When set to "Yes", a SUBSCRIBE for Message Waiting Indication will be sent periodically. The device supports synchronized and non-synchronized MWI. The default setting is "No".',

  acct_025: 'Enable Session Timer',
  acct_025_tip: 'This parameter is to enable/disable session timer function. If set to "Yes", the phone will configure the related parameters when sending session timer according to "Session Expiration". If set to "No", session timer is disabled. The default setting is "Yes".',

  acct_026: 'Session Expiration (s)',
  acct_026_tip: 'The SIP Session Timer extension that enables SIP sessions to be periodically "refreshed" via a SIP request (UPDATE, or re-INVITE). If there is no refresh via an UPDATE or re-INVITE message, the session will be terminated once the session interval expires.<br />Session Expiration is the time (in seconds) where the session is considered timed out, provided no successful session refresh transaction occurs beforehand. The default value is 180 seconds.',

  acct_027: 'Min-SE (s)',
  acct_027_tip: 'The minimum session expiration (in seconds). The default value is 90 seconds.',

  acct_028: 'UAC Specify Refresher',
  acct_028_tip: 'As a Caller, select UAC to use the device as the refresher; or select UAS to use the callee or proxy server as the refresher. When set to “Omit”, the refresh object is not specified.',

  acct_029: 'UAS Specify Refresher',
  acct_029_tip: 'As a Callee, select UAC to use caller or proxy server as the refresher; or select UAS to use the device as the refresher.',

  acct_030: 'Force INVITE ',
  acct_030_tip: 'The Session Timer can be refreshed using the INVITE method or the UPDATE method. Select "Yes" to use the INVITE method to refresh the session timer.',

  acct_031: 'Caller Request Timer',
  acct_031_tip: 'If set to "Yes" and the remote party supports session timers, the device will use a session timer when it makes outbound calls.',

  acct_032: 'Callee Request Timer',
  acct_032_tip: 'If set to "Yes" and the remote party supports session timers, the device will use a session timer when it makes outbound calls.',

  acct_033: 'Force Timer',
  acct_033_tip: 'If Force Timer is set to "Yes", the device will use the session timer even if the remote party does not support this feature. If Force Timer is set to "No", the device will enable the session timer only when the remote party supports this feature. To turn off the session timer, select "No".',

  acct_034: 'Enable 100rel',
  acct_034_tip: 'The use of the PRACK (Provisional Acknowledgment) method enables reliability to SIP provisional responses (1xx series). This is very important in order to support PSTN internetworking. To invoke a reliable provisional response, the 100rel tag is appended to the value of the required header of the initial signaling messages.',

  acct_035: 'Caller ID Display',
  acct_035_tip: 'When set to "Auto", the device will look for the caller ID in the order of P-Asserted Identity Header, Remote-Party-ID Header and From Header in the incoming SIP INVITE. When set to "Disabled", all incoming calls are displayed with "Unavailable".When set to "From Header", use the Caller ID in From Header.',

  acct_036: 'Use Privacy Header',
  acct_036_tip: 'Controls whether the Privacy header will present in the SIP INVITE message or not, whether the header contains the caller info. When set to "Default", the Privacy Header won\'t show in INVITE only when "Huawei IMS" special feature is on. If set to "Yes", the Privacy Header will always show in INVITE. If set to "No", the Privacy Header will not show in INVITE. The default setting is "Default".',

  acct_037: 'Use P-preferred-identity Header',
  acct_037_tip: 'Controls whether the P-Preferred-Identity Header will present in the SIP INVITE message or not.  When set to "Default", the P-Preferred-Identity header is not used by default in Huawei IMS. If set to "Yes", the P-Preferred-Identity Header will always show in INVITE. If set to "No", the header will not show in INVITE. The default setting is "Default".',

  acct_038: 'Use Mac Header',
  acct_038_tip: 'Configures whether to use MAC header. If set to "No", all SIP REGISTER messages will not contain MAC header; If set to "Only for REGISTER", MAC header will only be included in SIP REGISTER and UNREGISTER messages; If set to "Yes to All SIP", all outgoing SIP REGISTER messages will contain MAC header.',

  acct_039: 'SIP Transport',
  acct_039_tip: 'Determines the network protocol used for the SIP transport. For IPVideoTalk, users can choose from TCP/TLS. For other accounts, users can choose from TCP/UDP/TLS.',

  acct_040: 'RTP IP Filter',
  acct_040_tip: 'Configures whether to filter the received RTP. If set to "Disable", the device will receive RTP from any address; If set to "IP Only", the device will receive RTP from certain IP address in SDP with no port limited; If set to "IP and Port", the device only send RTP to IP address & port in SDP. The default setting is "Disable".',

  acct_041: 'RTP Timeout (s)',
  acct_041_tip: 'Configures the RTP timeout of the phone. If the phone does not receive the RTP packet within the specified RTP time, the call will be automatically disconnected. The default range is 0-600. If set to 0, the phone will not hang up the call automatically.',

  acct_042: 'SIP URI Scheme When Using TLS',
  acct_042_tip: 'Specifies if "sip:" or "sips:" will be used when TLS is selected for SIP Transport.',

  acct_043: 'Use Actual Ephemeral Port In Contact With TCP/TLS',
  acct_043_tip: 'Defines whether the actual ephemeral port in contact with TCP/TLS will be used when TLS/TCP is selected for SIP Transport.',

  acct_044: 'RFC2543 Hold',
  acct_044_tip: 'If yes, c=0.0.0.0 will be used in INVITE SDP for hold.',

  acct_045: 'Symmetric RTP',
  acct_045_tip: 'Defines whether symmetric RTP is supported or not. The default setting is "No".',

  acct_046: 'Support SIP Instance ID',
  acct_046_tip: 'Defines whether SIP Instance ID is supported or not. The default setting is "Yes".',

  acct_047: 'Validate Incoming SIP Messages',
  acct_047_tip: 'Defines whether the incoming SIP messages will be validated or not. The default setting is "No".',

  acct_048: 'Check SIP User ID For Incoming INVITE',
  acct_048_tip: 'If set to "Yes", SIP User ID will be checked in the Request URI of the incoming INVITE. If it doesn\'t match the device\'s SIP User ID, the call will be rejected.',

  acct_049: 'Authenticate Incoming INVITE',
  acct_049_tip: 'If set to "Yes", the device will challenge the incoming INVITE for authentication with SIP 401 Unauthorized response.',

  acct_050: 'SIP Realm Used For Challenge INVITE & NOTIFY',
  acct_050_tip: 'Configures this option to verify incoming INVITE, only take effect when enabled incoming INVITE first. It is used to verify provision NOTIFY information, including check-sync, resync and reboot, but only effective when enabled SIP authentication.',

  acct_051: 'Only Accept SIP Requests From Known Servers',
  acct_051_tip: 'If set to "Yes", for answering the SIP request from saved servers, only the SIP requests from saved servers will be accepted; and the SIP requests from the unregistered server will be rejected.',

  acct_052: 'SIP T1 Timeout',
  acct_052_tip: 'SIP T1 Timeout. T1 is the evaluation on RTT (Round Trip Time) between the server and the client. If the network latency takes a long time, please select a larger value to ensure the stability. The default setting is 0.5 seconds.',

  acct_053: 'SIP T2 Interval',
  acct_053_tip: 'SIP T2 Interval. T2 defines the interval between INVITE and non-INVITE. The default setting is 4 seconds.',

  acct_054: 'SIP Timer D Interval',
  acct_054_tip: 'Defines the time interval when the INVITE client receives 3xx ~ 6xx and then replys back till the whole transaction is over. The valid value is 0-64 seconds.',

  acct_055: 'Remove OBP From Route',
  acct_055_tip: 'Configures to remove outbound proxy from route. This is used for the SIP Extension to notify the SIP server that the device is behind a NAT/Firewall. The default setting is "No".',

  acct_056: 'Check Domain Certificates',
  acct_056_tip: 'Defines whether the domain certificates will be checked when TLS/TCP is used for SIP Transport.',

  acct_057: 'Validate Certification Chain',
  acct_057_tip: 'Validates certification chain when TLS/TCP is configured.',

  acct_058: 'DTMF',
  acct_058_tip: 'This parameter specifies the mechanism to transmit DTMF digits. There are 3 supported modes: <br />• In audio, which means DTMF is combined in the audio signal (not very reliable with low-bit-rate codecs); <br /> • RTP (RFC2833), which means to specify DTMF with RTP packet. Users could know the packet is DTMF in the RTP header as well as the type of DTMF;  <br />• SIP INFO. Use SIP INFO to carry DTMF. The downside of this mode is that it\'s easy to cause asynchrony of DTMF and media packet because SIP and RTP packets are transmitted respectively.  <br />The default setting is "RFC2833".',

  acct_059: 'DTMF Payload Type',
  acct_059_tip: 'This parameter sets the payload type for DTMF using RFC2833. Default is 101.',

  acct_060: 'Preferred Vocoder',
  acct_060_tip: 'Multiple types of vocoders are supported on the device. Users can configure the vocoder priority by adjusting the order in the list. The vocoders will be included in the SDP message with the same order.',

  acct_061: 'Codec Negotiation Priority',
  acct_061_tip: 'Configures the phone to use which codec sequence to negotiate as the callee. When set to "Caller", the phone negotiates by SDP codec sequence from received SIP Invite; When set to "Callee", the phone negotiates by audio codec sequence on the phone. The default setting is "Callee".',

  acct_062: 'Silence Suppression',
  acct_062_tip: 'This parameter controls the silence suppression/VAD feature. If set to "Yes", when silence is detected, a small quantity of VAD packets (instead of audio packets) will be sent during the period when there is no audio. If set to "No", this feature is disabled. The default setting is "No".',

  acct_063: 'Voice Frames Per TX',
  acct_063_tip: 'Configures the number of voice frames transmitted per packet (the maxium value of IS based on the ethernet packet is 1500 bytes or 120Kbit/s.) It should be noted that the "ptime" value for the SDP will change with different configurations here. This value is related to the codec used and the actual frames transmitted during the in payload call. If the TX exceeds the maximum value, the device will use and save the maximum value according to what the first codec selects. For end users, it is recommended to use the default setting, as incorrect settings may influence audio quality.',

  acct_064: 'G.722.1 Rate',
  acct_064_tip: 'Selects encoding rate for G.722.1 codec.',

  acct_065: 'G.722.1 Payload Type',
  acct_065_tip: 'Enter G.722.1 codec payload type. The valid range is from 96 to 126. The default value is 104.',

  acct_066: 'G.722.1C Rate',
  acct_066_tip: 'Selects encoding rate for G.722.1C codec.',

  acct_067: 'G.722.1C Payload Type',
  acct_067_tip: 'Enter G.722.1C codec payload type. The valid range is from 96 to 126. The default value is 103.',

  acct_068: 'Opus Payload Type',
  acct_068_tip: 'Enter a desired value (96-126) for the payload type of the Opus codec. The default value is 123.',

  acct_069: 'iLBC Frame Size',
  acct_069_tip: 'Selects iLBC packet frame size.',

  acct_070: 'Video FEC Mode',
  acct_070_tip: '0 represents FEC is not sent by separate port while 1 does.',

  acct_071: 'Use First Matching Vocoder In 200OK SDP',
  acct_071_tip: 'When set to "Yes", the device will use the first matching vocoder in the sent 200OK SDP as the codec.',

  acct_072: 'Enable Audio RED With FEC',
  acct_072_tip: 'If set to "Yes", FEC will be enabled for audio call. The default setting is "No".',

  acct_073: 'Audio FEC Payload Type',
  acct_073_tip: 'Configures audio FEC payload type. The valid range is from 96 to 126. The default value is 121.',

  acct_074: 'Audio RED Payload Type',
  acct_074_tip: 'Configures audio RED payload type. The valid range is from 96 to 126. The default value is 124.',

  acct_075: 'Enable RFC5168 Support',
  acct_075_tip: 'If set to "Yes", RFC5168 support will be enabled for video call. The default setting is "Yes".',

  acct_076: 'Packet Retransmission',
  acct_076_tip: 'When the function is enabled, signaling will carry RTX information, if the final negotiation is succeeded, the related media RTX function will realize packet loss retransmission purpose. When this function is disabled. then packet loss retransmission cannot be used.',

  acct_077: 'Enable Video FEC',
  acct_077_tip: 'If set to "Yes", FEC will be enabled for video call. The default setting is "No".',

  acct_078: 'FEC Payload Type',
  acct_078_tip: 'Configures FEC payload type. The valid range is from 96 to 126. The default value is 120.',

  acct_080: 'Enable FECC',
  acct_080_tip: 'If set to "Yes", You can control the camera of the opposite side for video call, but the opposite site must support FECC and allow remote control on its local camera. The default setting is "Yes".',

  acct_081: 'FECC H.224 Payload Type',
  acct_081_tip: 'Configures FECC H.224 payload type. The valid range is from 96 to 126. The default value is 125.',

  acct_082: 'SDP Bandwidth Attribute',
  acct_082_tip: 'Select the SDP bandwidth attribute from "Standard", "Media Level" or "None".<br />Standard: Use AS at the session level and TIAS at the media level.<br />Media Level: Use AS at the media level.<br />None: Do not change the format. <br />The default setting is "Media Level". Please do not change the format. Otherwise, it may cause decode failure if unclear about what format the server supports.',

  acct_083: 'Video Jitter Buffer Maximum (ms)',
  acct_083_tip: 'Configures the buffer size according to the network environment. The valid range is from 0 to 1000. The default settings is 50.',

  acct_084: 'Enable Video Gradual Decoder Refresh Function',
  acct_084_tip: 'GDR (Gradual decoder refresh) by P frame including the method of applying I block group to achieve asymptotic refresh. If set to "Yes", GDR will bring better network adaptability. The default setting is "No".',

  acct_085: 'Preferred Video Codec',
  acct_085_tip: 'This parameter lets you select your preferred video codec from the "available" list. The device supports H.264 and H.265. The H.264 codec is recommended.',

  acct_086: 'Image Size',
  acct_086_tip: 'Selects the image size. The default setting is "1080p".',

  acct_087: 'Video Bit Rate',
  acct_087_tip: 'Configures the bite rate of the video. The video bit rate can be adjusted based on the network environment. Increasing the video bit rate may improve video quality if the bandwidth is permitted. If the bandwidth is not permitted, the video quality will decrease due to packet loss. The default setting depends on H.264 Image Size:<br />H.264 Image Size = 4k, Video Bit Rate can be set to integer value from 1Mbps to 8Mbps. <br />H.264 Image Size = 1080p, Video Bit Rate can be set to integer value from 1Mbps to 4Mbps. <br />H.264 Image Size = 720p, Video Bit Rate can be set to integer value from 512kbps to 2Mbps. <br />H.264 Image Size = 4SIF/4CIF/VGA, Video Bit Rate can be set to integer value from 384kbps to 1Mbps.',

  acct_088: 'Video Frame Rate',
  acct_088_tip: 'Configures the frame rate for video call. The default setting is 30fps.',

  acct_089: 'H.264 Payload Type',
  acct_089_tip: 'Enter H.264 codec payload type. The valid range is from 96 to 126. The default value is 99.',

  acct_090: 'Packetization Mode',
  acct_090_tip: 'The packetization mode (0, 1 or Auto) for the video packets. The default setting is 1.',

  acct_091: 'H.264 Profile Type',
  acct_091_tip: 'Select the H.264 profile type from "Baseline Profile", "Main Profile", "High Profile" or "BP/MP/HP". The default setting is "BP/MP/HP". The lower profile type is easier to decode, while the higher level has high compression ratio. For device with low CPU, select "Baseline Profile" to play record; "Baseline Profile" is more likely to be used in a video conference that has high demandings for the video quality. Select among three types to achieve the best video effect.',

  acct_092: 'Use H.264 Constrained Profiles',
  acct_092_tip: 'Configures whether to use H.264 CBP to establish video call with WebRTC. The function takes effect when H.264 profile setting includes BP type. It is recommended to set to "Yes" when establish video call with WebRTC. The default setting is "No".',

  acct_093: 'H.265 Payload Type',
  acct_093_tip: 'Enter H.265 codec payload type. The valid range is from 96 to 126. The default value is 114.',

  acct_094: 'Enable Presentation',
  acct_094_tip: 'If set to "Yes", the device will be able to receive the presentation stream in video calls and video meetings. The default setting is "Yes".',

  acct_095: 'Initial INVITE With Media Info',
  acct_095_tip: 'Initial INVITE SDP contains presentation media.',

  acct_096: 'Presentation H.264 Image Size',
  acct_096_tip: 'Selects the H.264 image size. The default setting is "1080p".',

  acct_097: 'Presentation H.264 Profile Type',
  acct_097_tip: 'Select the Presentation H.264 Profile Type from "Baseline Profile", "Main Profile", "High Profile" and "BP&MP&HP". The default setting is "BP&MP&HP".The lower the profile type is, the easier the packet can be decoded. However, higher level has high compression ratio. For device with low CPU, select "Baseline Profile" to play record; "Baseline Profile" is more likely to be used in a video conference that has high demandings for the video quality. Select among the three types to achieve the best video effect.',

  acct_098: 'Presentation Video Bit Rate',
  acct_098_tip: 'Configures the bit rate of the video. The video bit rate can be adjusted based on the network environment. Increasing the video bit rate may improve video quality if the bandwidth is permitted. If the bandwidth is not permitted, the video quality will decrease due to packet loss. Video Bit Rate can be set to integer value from 512kbps to 2048kbps.',

  acct_099: 'Presentation Video Frame Rate',
  acct_099_tip: 'Configure the video frame rate for presentation, the default setting is 15fps.',

  acct_100: 'BFCP Transport Protocol',
  acct_100_tip: 'Defines the transport protocol used for BFCP. Users can choose from Auto/UDP/TCP. The default setting is "UDP" first, if not supported, then choose "TCP". If choose "Auto", automatically switches between "UDP" and "TCP".',

  acct_101: 'SRTP Mode',
  acct_101_tip: 'Enable the SRTP mode based on your selection from the drop-down menu. The default setting is "Disabled".',

  acct_102: 'SRTP Key Length',
  acct_102_tip: 'Configures the AES Encryption Bit for SRTP. The default setting "AES 128&256 bit" means provides AES 128 &256 encryption method for SRTP. If set to "AES 128 bit", provides 128 bit encryption method while "AES 256 bit" provides 256 bit encryption method.',

  acct_103: 'Remote Video Request',
  acct_103_tip: 'Configures the preference of video request handling during an audio call. Users could select "prompt", "accept" or "deny". The default setting is "prompt".',

  acct_104: 'Common Layout Mode',
  acct_104_tip: 'Set the common layout mode, which applies all the initial meeting layout modes.',

  acct_105: 'Dial Plan Prefix',
  acct_105_tip: 'Configures the prefix to be added to each dialed number. All numbers use this account will automatically add the prefix. e.g.: The prefix is 5, the phone number is 337, then the dial number is 5337. If set "Disable DialPlan" to "Yes", the dial plan prefix will be invalid.',

  acct_106: 'Disable Dialplan',
  acct_106_tip: 'Defines whether to disable dial plan when dialing from dial screen, Contacts, Call History and Click2Dial. If set to "Yes", dial plan will be disabled for the above cases.',

  acct_107: 'DialPlan',
  acct_107_tip: '1. Valid Value:<br />1,2,3,4,5,6,7,8,9,0,*,#,T；<br />2. Dial Plan Rules:<br />a) • xx - any 2 digit numbers from 0-9<br />b) • xx+ - at least 2 digit numbers from 0-9<br />c) • xx. - at least 1 digit number from 0-9<br />d) • xx? - 1 or 2 digit numbers from 0-9<br />e) • ^ - exclude<br />f) • T - dialing delay when matched<br />g) • [3-5] – any digit of 3, 4, or 5<br />h) [147] - any digit of 1, 4, or 7<br />i) <2=011> - replace digit 2 with 011 when dialing<br />j) \\{x+\\} - allow dialing all digit numbers<br />3. Examples:<br />Example 1: \\{[369]11 | 1617xxxxxxx\\}<br />Allow 311, 611, and 911 or any 10 digit numbers with leading digits 1617;<br />Example 2: \\{^1900x+ | <=1617>xxxxxxx\\}<br />Block any number of leading digits 1900 or add prefix 1617 for any dialed 7 digit numbers;',

  acct_108: 'Refer-to Use Target Contact',
  acct_108_tip: 'If set to "Yes", the "Refer-To" header uses the transferred target\'s Contact header information for attended transfer. The default setting is "No".',

  acct_109: 'Auto-answer',
  acct_109_tip: 'If set to "Yes", the device will automatically answer incoming calls after a short reminding beep. The default setting is "No".',

  acct_110: 'Send Anonymous',
  acct_110_tip: 'If set to "Yes", the "From" header in outgoing INVITE messages will be set to anonymous, essentially blocking the Caller ID to be displayed.',

  acct_111: 'Reject Anonymous Call',
  acct_111_tip: 'If set to "Yes", anonymous calls will be rejected. The default setting is "No".',

  acct_112: 'Call Log',
  acct_112_tip: 'Configures Call Log setting on the device. The default setting is "Log All".',

  acct_113: 'Special Feature',
  acct_113_tip: 'Different soft switch vendors have special requirements. Therefore users may need select special features to meet these requirements. Users can choose from Standard, CBCOM, RNK, China Mobile, ZTE IMS, Mobotix, ZTE NGN, or Huawei IMS depending on the server type. The default setting is "Standard".',

  acct_114: 'Feature Key Synchronization',
  acct_114_tip: 'This feature is used for Broadsoft call feature synchronization. When it\'s set to Broadsoft, DND and Call Forward features can be synchronized with Broadsoft server. The default setting is "Disable".',

  acct_115: 'Enable Call Features',
  acct_115_tip: 'If set to "Yes", call features (including call forwarding, DND and etc) will be supported locally instead of using the feature code supported on SIP server/proxy. The default setting is "Yes". Please refer to user manual for more details.',

  acct_116: 'Ring Timeout (s)',
  acct_116_tip: 'Defines the timeout (in seconds) for the rings on no answer. The default setting is 60 seconds.',

  acct_117: 'Use # As Dial Key',
  acct_117_tip: 'Allows users to configure the "#" key as the "Send" key. If set to "Yes", the "#" key will immediately dial out the input digits. In this case, this key is essentially equivalent to the "Send" key. If set to "No", the "#" key is treated as part of the dialed string.',

  acct_118: 'Upload Local MOH Audio File',
  acct_118_tip: 'Click the BROWSE to upload audio file from PC. The MOH audio file should be ".wav" or ".mp3" format. It may take a long time uploading and processing the file, please be patient. The Browse button will turn to "Processing" and back to "Browse" once the upload finished.',

  acct_119: 'Enable Local MOH',
  acct_119_tip: 'If set to "Yes" , the local MOH will be enabled. Users need to upload local MOH audio file. Once enabled, users could play the file when holding the call. The default setting is "No".',

  acct_120: 'Account Ring Tone',
  acct_120_tip: 'Selects different ringtones from the dropdown menu.',

  acct_121: 'Call Forwarding',
  acct_121_tip: 'Specifies the Call Forward Type. Select "None" to disable call forward feature. Select "Unconditional" to forward all calls to a particular number. Select "Time based" to set a time range for the call to be forwarded. Or select "Others" to set Call Forward On No Answer and Call Forward On Busy.',

  acct_122: 'All To',
  acct_122_tip: 'Specifies the number to be forwarded to when "Unconditional" Call Forward Type is used.',

  acct_123: 'Time Period',
  acct_123_tip: 'Configures the period of time to forward the call when "Time based" Call Forward Type is used. The time is 24-hour format HH:mm, 10:00 for example.',

  acct_124: 'In Time Forward To',
  acct_124_tip: 'When "Time based" Call Forward Type is used, specifies the number to be forwarded to within the configured Time Period above.',

  acct_125: 'Out Time Forward To',
  acct_125_tip: 'When "Time based" Call Forward Type is used, specifies the number to be forwarded to when it\'s not within the configured Time Period.',

  acct_126: 'Enable Busy Forward',
  acct_126_tip: 'If set to "Yes", call will be forwarded to the number specified below on busy.',

  acct_127: 'Busy To',
  acct_127_tip: 'Specifies the number to be forwarded to for Call Forward On Busy. When the device is busy, the new call will be forwarded to this number.',

  acct_128: 'Enable No Answer Forward',
  acct_128_tip: 'If set to "Yes", call will be forwarded to the number specified below on no answer.',

  acct_129: 'No Answer To',
  acct_129_tip: 'Specifies the number to be forwarded to for Call Forward On Busy. When the device is no answer, the new call will be forwarded to this number.',

  acct_130: 'No Answer Timeout (s)',
  acct_130_tip: 'Defines the timeout (in seconds) before the call is forwarded on no answer. The default value is 20 seconds.',

  acct_131: 'Enable DND Forward',
  acct_131_tip: 'If set to "Yes", call will be forwarded to the number specified below when DND on.',

  acct_132: 'DND To',
  acct_132_tip: 'Specifies the number to be forwarded to for Call Forward when DND on.',

  acct_133: 'Enable IPVideoTalk',
  acct_133_tip: 'Enable IPVideoTalk service, if set to "YES", the system will support IPVideoTalk related functions.The default value is "YES", which will take effect after restart.',

  acct_134: 'SIP Transport',
  acct_134_tip: 'Determines the network protocol used for the SIP transport. For IPVideoTalk, users can choose from TCP/TLS. For other accounts, users can choose from TCP/UDP/TLS.',

  acct_135: 'Auto Answer When Idle',
  acct_135_tip: 'If set to "Yes", the device will automatically turn on the speaker to answer incoming calls after a short reminder beep. The default setting is "No".',

  acct_136: 'Enable GK',
  acct_136_tip: 'Defines whether to enable GK, if check, the device will register to GK automatically, the default setting is "No".',

  acct_137: 'Enable H.460',
  acct_137_tip: 'If set to "Yes", H.460 support will be enabled for h323 call, the default setting is "No".',

  acct_138: 'Gk Discover Mode',
  acct_138_tip: 'Configures GK discover mode, users could set to "Auto" or "Manual". If set to "Auto", the device will discover GK automatically and register to GK; If set to "Manual", the device will discover GK via GK address and register to GK. The default setting is "Auto".',

  acct_139: 'Gk Address',
  acct_139_tip: 'Defines the address of the GK server.',

  acct_140: 'Site Number',
  acct_140_tip: 'Defines the site number, it could be a string or digits.',

  acct_141: 'Gk Authentication Username',
  acct_141_tip: 'Defines the username for GK authentication.',

  acct_142: 'Gk Authentication Password',
  acct_142_tip: 'Defines the password for GK authentication.',

  acct_143: 'H.323 Local Port',
  acct_143_tip: 'Defines the local H.323 port used to listen. The default value is 1720.',

  acct_144: 'Enable H225 Keep-alive',
  acct_144_tip: 'If enabled, only send H225 keep-alive packet as callee. The interval is 19s, the default setting is "No".',

  acct_145: 'Enable H245 Keep-alive',
  acct_145_tip: 'If enabled, send H245 keep-alive packet as caller or callee. The interval is 19s, the default setting is "No".',

  acct_146: 'Enable RTDR',
  acct_146_tip: 'If enabled, then send RTDP (roundTripDelayRequest) package as H245 keep-alive package per 10s. The timeout interval is 30s and will hang up the call once timed out. The default setting is "No". Note: if enabled, it may cause incompatibility with some devices.',

  acct_147: 'DTMF',
  acct_147_tip: 'This parameter specifies the mechanism to transmit DTMF digits. There are 3 supported modes: In audio，RFC2833，H245 signal.',

  acct_148: 'Match Incoming Caller ID',
  acct_148_tip: 'Set the ringing rule for the incoming calls. There are three spaces on the left to set the ringing rule. For example: 139x+ means that the ringing bell corresponding to the incoming call beginning with 139 is the ringtone on the right.',

  acct_149: 'Distinctive Ring Tone',
  acct_149_tip: 'This field specifies the distinctive ringtone for the matching incoming caller ID on the left. Users can choose from different ringtones from the dropdown menu.',

  acct_150: 'Add MAC In User-Agent',
  acct_150_tip: 'Configures whether to add MAC address in User-Agent header. If set to "No", all outgoing SIP messages  will not attach MAC address to the User-Agent header; If set to "Yes except REGISTER", all outgoing SIP messages except REGISTER message will attach the MAC address to the User-Agent header; If set to "Yes to All SIP", all outgoing SIP messages including REGISTER message will attach MAC address to the User-Agent header.',

  acct_151: 'Zoom Server',
  acct_151_tip: 'The URL or IP address, and port of the Zoom server. This is provided by your VoIP service provider (ITSP).',

  acct_152: 'Register Expiration (m)',
  acct_152_tip: 'Specifies the frequency (in minutes) in which the device refreshes its registration with the specified registrar. The default value is 60 minutes (1 hour). The maximum value is 1440 minutes (1 day). The minimum value is 1 minute.',

  acct_153: 'Voice Mail Access Number',
  acct_153_tip: 'This ID is usually the VM portal access number. For example, in Asterisk server, 8500 could be used.'

}
