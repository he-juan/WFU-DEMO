/*
 acl - used for setting the access permission of options.
 [sample] acl: [0/1]
 0: all users can access.
 1: only admin can access.

 oem - used for setting the options hidden for oem requirement.
 [sample] oem: "oemid1, oemid2, ..."

 product - used for setting the options hidden for special products.
 [sample] product: "1, 2, ..."
 1: WP800 hidden
 2: GXV3380 hidden
 3: GXV3370 hidden
 4: GAC2510 hidden
 */

export const options = [
    {"name": "calls", "lang": "a_calls", "sub": [
        {"name": "contact", "lang": "a_contact", "sub": [
            {"name": "contact", "lang": "a_contact", "sub": [
                {"name": "File Encoding", "lang": "a_fileencode"},
                {"name": "File Type", "lang": "a_exporttype"},
                {"name": "Save Phonebook to PC", "lang": "a_savephone"},
                {"name": "Clear The Old List", "lang": "a_clearoldlist"},
                {"name": "Replace Duplicate Items", "lang": "a_downdup"},
                {"name": "Local File", "lang": "a_localfile"},
                {"name": "Download Mode", "lang": "a_downmode"},
                {"name": "Download Server", "lang": "a_downserver"},
                {"name": "Download Now", "lang": "a_downinterval"}
            ]}
        ]}
    ]},
    {"name": "account", "lang": "a_account", "sub": [
        {"name": "sipAcct", "lang": "SIP", "sub": [
            {"name": "general", "lang": "account_general", "acl": "1", "sub": [
                {"type": "p", "lang": "a_accountregister"},
                {"name": "Account Active", "lang": "a_accountactive"},
                {"name": "Account Name", "lang": "a_accountname"},
                {"name": "SIP Server", "lang": "a_sipserver"},
                {"name": "Secondary SIP Server", "lang": "a_secsipserver"},
                {"name": "Tertiary SIP Server", "lang": "a_tertsipserver"},
                {"name": "SIP User ID", "lang": "a_sipuid"},
                {"name": "SIP Authentication ID", "lang": "a_authid"},
                {"name": "SIP Authentication Password", "lang": "a_authpwd"},
                {"name": "Voice Mail Access Number", "lang": "a_voicemailuid", "acl": "1"},
                {"name": "Name", "lang": "a_name"},
                {"name": "Tel URI", "lang": "a_teluri"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "network", "lang": "network_setting", "acl": "1", "sub": [
                {"name": "Outbound Proxy", "lang": "a_outbp"},
                {"name": "Secondary Outbound Proxy", "lang": "a_secoutbp"},
                {"name": "DNS Mode", "lang": "a_usedns"},
                {"name": "NAT Traversal", "lang": "a_natstun"},
                {"name": "Proxy-Require", "lang": "a_proxy"}

            ]},
            {"name": "sip", "lang": "account_sip", "acl": "1", "sub": [
                {"type": "p", "lang": "a_sipbasic"},
                {"name": "SIP Registration", "lang": "a_sipreg"},
                {"name": "Unregister Before New Registration", "lang": "a_unregor"},
                {"name": "Register Expitation", "lang": "a_regexp"},
                {"name": "Reregister before Expiration", "lang": "a_regbeforeexp"},
                {"name": "Registration Retry Wait Time", "lang": "a_retrytime"},
                {"name": "Local SIP Port", "lang": "a_sipport"},
                {"name": "SUBSCRIBE for MWI", "lang": "a_s4mwi", "acl": "1"},
                {"name": "Enable Session Timer", "lang": "a_opensession"},
                {"name": "Session Expiration", "lang": "a_seexp"},
                {"name": "Min-SE", "lang": "a_minse"},
                {"name": "UAC Specify Refresher", "lang": "a_uacsr"},
                {"name": "UAS Specify Refresher", "lang": "a_uassr"},
                {"name": "Force INVITE", "lang": "a_forceinv"},
                {"name": "Caller Request Timer", "lang": "a_callerreq"},
                {"name": "Callee Request Timer", "lang": "a_calleereq"},
                {"name": "Force Timer", "lang": "a_fortimer"},
                {"name": "Enable 100rel", "lang": "a_en10rel"},
                {"name": "Caller ID Display", "lang": "a_callerdisplay"},
                {"name": "Use Privacy Header", "lang": "a_usepheader", "acl": "1"},
                {"name": "Use P-Preferred-Identity Header", "lang": "a_useppiheader", "acl": "1"},
                {"name": "SIP Transport", "lang": "a_siptranport"},
                {"name": "SIP URI Scheme When Using TLS", "lang": "a_sipschema"},
                {"name": "Use Actual Ephemeral Port in Contact with TCP/TLS", "lang": "a_useepport"},
                {"name": "Symmetric RTP", "lang": "a_symrtp"},
                {"name": "Support SIP Instance ID", "lang": "a_suptsipintid"},
                {"name": "Validate Incoming SIP Messages", "lang": "a_validincommsg"},
                {"name": "Check SIP User ID for Incoming INVITE", "lang": "a_checkinvite"},
                {"name": "SIP realm used for challenge INVITE & NOTIFY", "lang": "a_challenge"},
                {"name": "Only Accept SIP Requests from Known Servers", "lang": "a_accpsip"},
                {"name": "SIP T1 Timeout", "lang": "a_sipt1to"},
                {"name": "SIP T2 Interval", "lang": "a_sipt2int"},
                {"name": "SIP Timer D Interval", "lang": "a_siptdint"},
                {"name": "Remove OBP from Route", "lang": "a_removeobp"},
                {"name": "Check Domain Certificates", "lang": "a_checkdomain"},
                {"name": "Validate Certification Chain", "lang": "a_validatecert"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "codec", "lang": "account_codec", "acl": "1", "sub": [
                {"name": "DTMF", "lang": ""},
                {"name": "DTMF Payload Type", "lang": "a_dtmfpayload"},
                {"name": "Preferred Vocoder", "lang": "a_prevocoder"},
                {"name": "Codec Negotiation Priority", "lang": "a_codecpri"},
                {"name": "Silence Suppression", "lang": "a_silsup"},
                {"name": "Voice Frames Per TX", "lang": "a_vocfp"},
                {"name": "G.722.1 Rate", "lang": "a_g7221rate"},
                {"name": "G.722.1 Payload Type", "lang": "a_g7221payload"},
                {"name": "G.722.1C Payload Type", "lang": "a_g7221cpayload"},
                {"name": "Opus Payload Type", "lang": "a_opuspayload"},
                {"name": "iLBC Frame Size", "lang": "a_ilibcfs"},
                {"name": "Use First Matching Vocoder in 200OK SDP", "lang": "a_usefvcode"},
                {"name": "Enable Audio RED with FEC", "lang": "a_audioredfec"},
                {"name": "Audio FEC Payload Type", "lang": "a_audiofecpayload"},
                {"name": "Audio RED Payload Type", "lang": "a_audioredpayload"},
                {"name": "Enable RFC5168 Support", "lang": "a_enablerfc"},
                {"name": "Enable Video FEC", "lang": "a_enablefec"},
                {"name": "Video FEC Mode", "lang": "a_fecmode"},
                {"name": "FEC Payload Type", "lang": "a_fecpayload"},
                {"name": "Enable FECC", "lang": "a_enablefecc"},
                {"name": "FECC H.224 Payload Type", "lang": "a_fecch244payload"},
                {"name": "H.264 Payload Type", "lang": "a_h264payload"},
                {"name": "Packetization-mode", "lang": "a_packetmodel"},
                {"name": "H.264 Image Size", "lang": "a_h264imgsize"},
                {"name": "H.264 Profile Type", "lang": "a_h264protype"},
                {"name": "Video Bit Rate", "lang": "a_vidbr"},
                {"name": "SDP Bandwidth Attribute", "lang": "a_sdpattr"},
                {"name": "Video Frame Rate", "lang": "a_vidfr"},
                {"name": "Video Jitter Buffer Maximum (ms)", "lang": "a_videojittermax"},
                {"name": "Enable Video Gradual Decoder Refresh", "lang": "a_enablevideorefresh"},
                {"name": "Disable Presentation", "lang": "a_disablepres"},
                {"name": "Presentation H.264 Image Size", "lang": "a_presentimagesize"},
                {"name": "Presentation H.264 Profile", "lang": "a_presentprofile"},
                {"name": "Presentation Video Bit Rate(Kbps)", "lang": "a_presentvideobitrate"},
                {"name": "Presentation Video Frame Rate", "lang": "a_presentvideoframebate"},
                {"name": "BFCP Transport Protocol", "lang": "a_bfcptranspro"},
                {"name": "SRTP Mode", "lang": "a_srtp"},
                {"name": "SRTP Key Length", "lang": "a_encryptdigit"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "call", "lang": "account_call", "sub": [
                {"name": "Remote Video Request", "lang": "a_remotevideo", "acl": "1"},
                {"name": "Dial Plan Prefix", "lang": "a_dialplanpr"},
                {"name": "Disable DialPlan", "lang": "a_disdialplan"},
                {"name": "DialPlan", "lang": "a_dialplan"},
                {"name": "Refer-To Use Target Contact", "lang": "a_referto", "acl": "1"},
                {"name": "Auto Answer", "lang": "a_autoans", "acl": "1"},
                {"name": "Send Anonymous", "lang": "a_sendanoy", "acl": "1"},
                {"name": "Anonymous Call Rejection", "lang": "a_anonycallrej", "acl": "1"},
                {"name": "Call Log", "lang": "a_calllog", "acl": "1"},
                {"name": "Special Feature", "lang": "a_spefea"},
                {"name": "Feature Key Synchronization", "lang": "a_feakey"},
                {"name": "Enable Call Features", "lang": "a_encallfea", "acl": "1"},
                {"name": "Ring Timeout", "lang": "a_ringto"},
                {"name": "Use # as Dial Key", "lang": "a_usepound"},
                {"name": "Upload Local MOH Audio File", "lang": "a_uploadaudio"},
                {"name": "Enable Local MOH", "lang": "a_enablemoh"},
                {"name": "Account Ring Tone", "lang": "a_defaultringtone"},
                {"name": "Call Forward Type", "lang": "a_cftype"},
                {"name": "Match Incoming Caller ID", "lang": "a_matchincad"},
                {"name": "Distinctive Ring Tone", "lang": "a_cusrtone"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "ipvtAcct", "lang": "IPVideoTalk", "sub": [
            {"name": "general", "lang": "advanced_general", "sub": [
                {"name": "Account Active", "lang": "a_accountactive"},
                {"name": "Name", "lang": "a_name"},
                {"name": "SIP Transport", "lang": "a_siptranport"},
                // {"name": "Current plans", "lang": "a_curplans"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "codec", "lang": "account_codec", "acl": "1", "sub": [
                {"name": "Preferred Video Codec", "lang": "a_prevcoder"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "call", "lang": "advanced_call", "sub": [
                {"name": "Auto Answer When Idle", "lang": "a_autoansidle"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "bluejeansAcct", "lang": "BlueJeans", "sub": [
            {"name": "general", "lang": "advanced_general", "sub": [
                {"name": "Account Active", "lang": "a_accountactive"},
                {"name": "Name", "lang": "a_name"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "codec", "lang": "account_codec", "acl": "1", "sub": [
                {"name": "DTMF", "lang": ""},
                {"name": "DTMF Payload Type", "lang": "a_dtmfpayload"},
                {"name": "Preferred Vocoder", "lang": "a_prevocoder"},
                {"name": "Codec Negotiation Priority", "lang": "a_codecpri"},
                {"name": "Silence Suppression", "lang": "a_silsup"},
                {"name": "Voice Frames Per TX", "lang": "a_vocfp"},
                {"name": "G.722.1 Rate", "lang": "a_g7221rate"},
                {"name": "G.722.1 Payload Type", "lang": "a_g7221payload"},
                {"name": "Use First Matching Vocoder in 200OK SDP", "lang": "a_usefvcode"},
                {"name": "Enable Audio RED with FEC", "lang": "a_audioredfec"},
                {"name": "Audio FEC Payload Type", "lang": "a_audiofecpayload"},
                {"name": "Audio RED Payload Type", "lang": "a_audioredpayload"},
                {"name": "Enable Video FEC", "lang": "a_enablefec"},
                {"name": "FEC Payload Type", "lang": "a_fecpayload"},
                {"name": "H.264 Payload Type", "lang": "a_h264payload"},
                {"name": "Packetization-mode", "lang": "a_packetmodel"},
                {"name": "H.264 Image Size", "lang": "a_h264imgsize"},
                {"name": "H.264 Profile Type", "lang": "a_h264protype"},
                {"name": "Video Bit Rate", "lang": "a_vidbr"},
                {"name": "SDP Bandwidth Attribute", "lang": "a_sdpattr"},
                {"name": "Video Frame Rate", "lang": "a_vidfr"},
                {"name": "Video Jitter Buffer Maximum (ms)", "lang": "a_videojittermax"},
                {"name": "Use H.264 Constrained Profiles", "lang": "a_useh264profile"},
                {"name": "Disable Presentation", "lang": "a_disablepres"},
                {"name": "Presentation H.264 Image Size", "lang": "a_presentimagesize"},
                {"name": "Presentation H.264 Profile", "lang": "a_presentprofile"},
                {"name": "Presentation Video Bit Rate(Kbps)", "lang": "a_presentvideobitrate"},
                {"name": "Presentation Video Frame Rate", "lang": "a_presentvideoframebate"}
            ]},
            {"name": "call", "lang": "advanced_call", "sub": [
                {"name": "Call Log", "lang": "a_calllog", "acl": "1"},
                {"name": "Use # as Dial Key", "lang": "a_usepound"},
                {"name": "Upload Local MOH Audio File", "lang": "a_uploadaudio"},
                {"name": "Enable Local MOH", "lang": "a_enablemoh"}
            ]}
        ]},


        {"name": "h323mode", "lang": "H.323", "sub": [
            {"name": "general", "lang": "advanced_general", "sub": [
                {"name": "Account Active", "lang": "a_accountactive"},
                {"name": "Enable GK", "lang": "a_enablegk"},
                {"name": "Enable H.460", "lang": "a_enableh460"},
                {"name": "GK Discover Mode", "lang": "a_gkdiscovermode"},
                {"name": "Site Number", "lang": "a_sitenumber"},
                {"name": "GK Authentication Username", "lang": "a_gkauthusername"},
                {"name": "GK Authentication Password", "lang": "a_gkauthpwd"},
                {"name": "Register Expiration (m)", "lang": "a_regexp"},
                {"name": "H.323 Local Port", "lang": "a_h323localport"},
                {"name": "Symmetric RTP", "lang": "a_symrtp"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "codec", "lang": "account_codec", "acl": "1", "sub": [
                {"name": "DTMF", "lang": ""},
                {"name": "Preferred Vocoder", "lang": "a_prevocoder"},
                {"name": "H.264 Payload Type", "lang": "a_h264payload"},
                {"name": "H.264 Image Size", "lang": "a_h264imgsize"},
                {"name": "Video Bit Rate", "lang": "a_vidbr"},
                {"name": "Video Frame Rate", "lang": "a_vidfr"},
            ]},
            {"name": "call", "lang": "advanced_call", "sub": [
                {"name": "Auto Answer", "lang": "a_autoans", "acl": "1"},
                {"name": "Enable H225 Keep-Alive", "lang": "a_enableh225keepalive", "acl": "1"},
                {"name": "Enable H245 Keep-Alive", "lang": "a_enableh245keepalive"},
                {"name": "Enable RTDR", "lang": "a_enableRTDR"},
            ]}
        ]}
    ]},
    {"name": "callset", "lang": "call_setting", "sub": [
        {"name": "general", "lang": "account_general", "sub": [
            {"name": "conventional", "lang": "a_conventionset", "sub": [
                {"name": "Local RTP Port", "lang": "a_rtpport"},
                {"name": "Use Random Port", "lang": "a_useranport", "oem": "54"},
                {"name": "Keep-alive Interval", "lang": "a_keepa"},
                {"name": "STUN Server", "lang": "a_stunserver"},
                {"name": "TURN Server Username", "lang": "a_stunservername"},
                {"name": "TURN Server Password", "lang": "a_stunserverpwd"},
                {"name": "Use NAT IP", "lang": "a_usenatip"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "guest", "lang": "a_guestset", "sub": [
                {"name": "Guest Login", "lang": "a_publicmode"},
                {"name": "Guest Login Timeout", "lang": "a_publicmodeint"},
                {"name": "Guest Login PIN Code", "lang": "a_logoutpin"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "callfeatures", "lang": "account_call", "sub": [
            {"name": "callfeatures", "lang": "account_call", "sub": [
                {"name": "Disable Call-Waiting Tone", "lang": "a_discallwaittone"},
                {"name": "Disable DND Reminder Ring", "lang": "a_disdndring"},
                {"name": "Auto Mute on Entry", "lang": "a_entrymute"},
                {"name": "Noise Shield", "lang": "a_noiseshield"},
                {"name": "Filter Characters", "lang": "a_filterchars"},
                {"name": "Escape '#' as %23 in SIP URI", "lang": "a_escapeuri"},
                {"name": "Disable in-call DTMF display", "lang": "a_disdtmf"},
                {"name": "Disable Call-Waiting", "lang": "a_callwait"},
                {"type": "button", "lang": "a_save"}
            ]},
        ]},
        {"name": "sitename", "lang": "a_sitename", "sub": [
            {"name": "sitenameset", "lang": "a_sitenameset", "sub": [
                {"name": "Background Transparency", "lang": "a_backopacity"},
                {"name": "sitename", "lang": "a_sitename"},
                {"name": "Display Position", "lang": "a_displaypos"},
                {"name": "Display Duration", "lang": "a_displaytime"},
                {"name": "Font Color", "lang": "a_fontcolor"},
                {"name": "Font Size", "lang": "a_fontsize"},
                {"name": "Bold", "lang": "a_bold"},
                {"name": "Horizontal Offset", "lang": "a_horizonoffset"},
                {"name": "Vertical Offset", "lang": "a_vericaloffset"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "audio", "lang": "advanced_ring", "sub": [
            {"name": "audio", "lang": "advanced_ring", "sub": [
                {"name": "Echo Delay", "lang": "a_echo_delay"},
                {"name": "Volume：Ringtone + Media + Notification", "lang": "a_ringtonevol"},
                {"name": "Ringtone：System Ringtone + Alert Tone", "lang": "a_ringtoneset"},
                {"name": "Audio Device", "lang": "a_audiodevice"},
                {"name": "Ring Back Tone", "lang": "a_ringbt"},
                {"name": "Busy Tone", "lang": "a_busytone"},
                {"name": "Reorder Tone", "lang": "a_reordertone"},
                {"name": "Confirmation Tone", "lang": "a_confmtone"},
                {"name": "Default Ring Cadence", "lang": "a_defringcad2"},
                {"name": "AEC Level", "lang": "a_aeclevel"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "video", "lang": "advanced_video", "sub": [
            {"name": "video", "lang": "advanced_video", "sub": [
                {"name": "Always Ring Speaker", "lang": "a_alring"},
                {"name": "Video Display Mode", "lang": "a_avspipmode"},
                {"name": "Enable Frame Skipping in Video Decoder", "lang": "a_viddecodefs"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]}
    ]},
    {"name": "network", "lang": "network_setting", "sub": [
        {"name": "ethernet", "lang": "ethernet_set",  "sub": [
                {"name": "ethernet", "lang": "ethernet_set",  "sub": [
                    {"name": "Preferred Internet Protocol", "lang": "a_protocoltype"},
                    {"type": "p", "lang": ""},
                    {"type": "p", "lang": ""},
                    {"name": "Address Type", "lang": "a_addresstypeipv4"}, //
                    {"name": "DHCP VLAN Override", "lang": "a_dhcpvlan"}, //
                    {"name": "Host name", "lang": "a_dhcpop12"}, //
                    {"name": "Vendor Class ID", "lang": "a_dhcpop60"}, //
                    {"name": "IP Address", "lang": "a_ipaddr"}, //
                    {"name": "Subnet Mask", "lang": "a_subnetmask"},//
                    {"name": "Default Gateway", "lang": "a_gateway"},//
                    {"name": "DNS Server 1", "lang": "a_prednsser"},//
                    {"name": "DNS Server 2", "lang": "a_alerdnsser"},//
                    {"name": "PPPoE Account ID", "lang": "a_pppacc"},//
                    {"name": "PPPoE Password", "lang": "a_pppoepwd"},//
                    {"name": "Layer 2 QoS 802.1Q/VLAN Tag (Ethernet)", "lang": "a_layer2qosdata"}, //
                    {"name": "Layer 2 QoS 802.1p Priority Value (Ethernet)", "lang": "a_layer2qospvdata"}, //
                    {"type": "p", "lang": ""},
                    {"type": "p", "lang": ""},
                    {"name": "IPv6 Address", "lang": "a_ipv6addr"},
                    {"name": "Static IPv6 Address", "lang": "a_staticipv6addr"},
                    {"name": "IPv6 Prefix length", "lang": "a_ipv6prefixlen"},
                    {"name": "IPv6 DNS Server 1", "lang": "a_ipv6dns1"},
                    {"name": "IPv6 DNS Server 2", "lang": "a_ipv6dns2"},
                    {"type": "p", "lang": ""},
                    {"type": "p", "lang": "a_802mode"},
                    {"name": "802.1x mode", "lang": "a_802mode"},//
                    {"name": "802.1x Identity", "lang": "a_identity"},//
                    {"name": "802.1x Secret", "lang": "a_md5pas"},//
                    {"name": "CA Certificate", "lang": "a_802ca"},//
                    {"name": "Client Certificate", "lang": "a_802client"},//
                    {"name": "Private Key", "lang": "a_privatekey"},//
                    {"type": "button", "lang": "a_save"}
                ]}
        ]},
        {"name": "openvpn", "lang": "openvpn_set", "sub": [
            {"name": "openvpn", "lang": "openvpn_set", "sub": [
                {"name": "OpenVPN Enable", "lang": "enable_openvpn"},
                {"name": "OpenVPN Server Address", "lang": "openvpn_server"},
                {"name": "OpenVPN Port", "lang": "openvpn_port"},
                {"name": "OpenVPN Transport", "lang": "openvpn_trans"},
                {"name": "OpenVPN CA", "lang": "openvpn_ca"},
                {"name": "OpenVPN Client Certificate", "lang": "openvpn_cert"},
                {"name": "OpenVPN Client Key", "lang": "openvpn_key"},
                {"name": "OpenVPN Cipher Method", "lang": "openvpn_cipher"},
                {"name": "OpenVPN Username", "lang": "openvpn_username"},
                {"name": "OpenVPN Password", "lang": "openvpn_pwd"}
            ]}
        ]},
        {"name": "common", "lang": "common_net", "sub": [
            {"name": "advanced", "lang": "common_net", "sub": [
                {"type": "p", "lang": "common_net"},
                {"name": "Alternate DNS Server", "lang": "a_relprednsser"},
                {"name": "Second Alternate DNS Server", "lang": "a_2relprednsser"},
                {"name": "Enable LLDP", "lang": "a_enablelldp"},
                {"name": "Layer 3 QoS for SIP", "lang": "a_layer3qossip"},
                {"name": "Layer 3 QoS for Audio", "lang": "a_layer3qosaudio"},
                {"name": "Layer 3 QoS for Video", "lang": "a_layer3qosvideo"},
                {"name": "HTTP/HTTPS User-Agent", "lang": "a_useragent"},
                {"name": "SIP User-Agent", "lang": "a_sipuseragent"},
                {"type": "p", "acl": "1", "lang": "a_proxyset"},
                {"name": "HTTP/HTTPS Proxy Hostname", "lang": "a_proxyhttp"},
                {"name": "HTTP/HTTPS Proxy Port", "lang": "a_proxyport"},
                {"name": "Bypass Proxy For", "lang": "a_noproxy"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]}
    ]},
    {"name": "sysset", "lang": "system_setting", "sub": [
        {"name": "power", "lang": "sys_power", "sub": [
            {"name": "power", "lang": "sys_power", "sub": [
                {"name": "Timeout Options", "lang": "a_timeoutoptions"},
                {"name": "Timeout Setup", "lang": "a_timeoutsetup"},
                {"name": "Reboot", "lang": "reboot"},
                {"name": "Sleep", "lang": "a_sleep"},
                {"name": "Shutdown", "lang": "a_shutdown"},
            ]}
        ]},
        {"name": "timeandlang", "lang": "time_lang", "sub": [
            {"name": "timeandlang", "lang": "time_lang", "sub": [
                {"name": "Assign NTP Server Address 1", "lang": "a_ntpserver1"},
                {"name": "Assign NTP Server Address 2", "lang": "a_ntpserver2"},
                {"name": "DHCP Option 42 Override NTP Server", "lang": "a_dhcpoption"},
                {"name": "DHCP Option 2 to override Time Zone setting", "lang": "a_allowdhcpset"},
                {"name": "Time Zone", "lang": "a_timezone"},
                {"name": "Time Display Format", "lang": "a_timefmt"},
                {"name": "Date Display Format", "lang": "a_datefmt"},
                {"name": "Set Date", "lang": "a_setdate"},
                {"name": "Set Time", "lang": "a_settime"},
                {"name": "Language", "lang": "a_lang"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "tr069", "lang": "a_tr069", "sub": [
            {"name": "tr069", "lang": "a_tr069", "sub": [
                {"name": "Enable TR-069", "lang": "a_openacs"},
                {"name": "ACS URL", "lang": "a_acsurl"},
                {"name": "ACS Username", "lang": "a_acsusername"},
                {"name": "ACS Password", "lang": "a_acspwd"},
                {"name": "Periodic Inform Enable", "lang": "a_perialenable"},
                {"name": "Periodic Inform Interval", "lang": "a_perialinterval"},
                {"name": "Connection Request Username", "lang": "a_conusername"},
                {"name": "Connection Request Password", "lang": "a_conpwd"},
                {"name": "Connection Request Port", "lang": "a_conport"},
                {"name": "CPE Cert File", "lang": "a_cpecert"},
                {"name": "CPE Cert Key", "lang": "a_cpekey"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "security", "lang": "security_set", "sub": [
            {"name": "security", "acl": "1", "lang": "security_set", "sub": [
                {"name": "Disable SSH", "lang": "a_distelnet"},
                {"name": "Access Method", "lang": "a_httpena"},
                {"name": "Port", "lang": "a_port"},
                {"name": "Current Admin Password", "lang": "a_curuserpwd"},
                {"name": "Admin Password", "lang": "a_adminpwd", "acl": "1"},
                {"name": "Confirm Admin Password", "lang": "a_conadminpwd", "acl": "1"},
                {"name": "User Password", "lang": "a_userpwd"},
                {"name": "Confirm User Password", "lang": "a_conuserpwd"},
                {"name": "Delete Screen Lock Password", "lang": "a_delscreenlockpwd"},
                {"name": "Screen Lock Password", "lang": "a_screenlockpwd"},
                {"name": "Confirm Screen Lock Password", "lang": "a_conscreenlockpwd"},
                {"name": "SIP TLS Certificate", "lang": "a_sslcer"},
                {"name": "SIP TLS Private Key", "lang": "a_sslpkey"},
                {"name": "SIP TLS Private Key Password", "lang": "a_sslpkpwd"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]}
    ]},
    {"name":"devicecontrol","lang":"a_device_control","sub":[
        {"name":"cameracontrol","lang":"a_camera_control", "sub":[
            {"name":"cameracontrol","lang":"a_camera_control", "sub":[
                {"name": "Move Speed", "lang": "a_movespeed"},
                {"name": "The Initial Position", "lang": "a_initial_position"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name":"ptz","lang":"a_ptz", "sub":[
            {"name":"ptz","lang":"a_ptz", "sub":[
                {"name": "Camera Preset", "lang": "a_preset"},
                {"name": "PTZ Control", "lang": "a_ptz_control"},
                {"name": "Adjusting Local Video Effects", "lang": "a_image_setting"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name":"peripheral","lang":"a_peripheral", "sub":[
            {"name":"peripheral","lang":"a_peripheral", "sub":[
                {"name": "HDMI 1 Out Resolution", "lang": "a_HDMI1_out_resolution"},
                {"name": "HDMI 2 Out Resolution", "lang": "a_HDMI2_out_resolution"},
                {"name": "Enable Auto Presentation When HDMI Plugged", "lang": "a_enablepreauto"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name":"remotecontrol","lang":"a_remote_control", "sub":[
            {"name":"remotecontrol","lang":"a_remote_control", "sub":[
                {"name": "Disable Remote Control App Connection", "lang": "a_remoteappconnect"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]}
    ]},
    {"name": "sysapp", "lang": "system_app", "sub": [
        {"name": "ldap", "lang": "appset_ldap", "sub": [
            {"name": "ldap", "lang": "appset_ldap", "sub": [
                {"name": "Connection Mode", "lang": "a_connectmode"},
                {"name": "Server Address", "lang": "a_serveraddr"},
                {"name": "Port", "lang": "a_port"},
                {"name": "Base DN", "lang": "a_basedn"},
                {"name": "LDAP User Name", "lang": "a_username"},
                {"name": "LDAP Password", "lang": "a_password"},
                {"name": "LDAP Name Attributes", "lang": "a_nameattr"},
                {"name": "LDAP Number Attributes", "lang": "a_numattr"},
                {"name": "LDAP Mail Attributes", "lang": "a_mailattr"},
                {"name": "LDAP Name Filter", "lang": "a_namefilter"},
                {"name": "LDAP Number Filter", "lang": "a_numberfilter"},
                {"name": "LDAP Mail Filter", "lang": "a_mailfilter"},
                {"name": "Search Field Filter", "lang": "a_searchfieldfilter"},
                {"name": "LDAP Displaying Name Attributes", "lang": "a_disnameattr"},
                {"name": "Max Hits", "lang": "a_maxhits"},
                {"name": "Search Timeout", "lang": "a_searchtimeout"},
                {"name": "LDAP Lookup For Dial", "lang": "a_lookupdial"},
                {"name": "LDAP Lookup For Incoming Call", "lang": "a_lookupcall"},
                {"name": "LDAP Dialing Default Account", "lang": "a_ldapdftacct"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]}
    ]},
    {"name": "maintenance", "lang": "maintenance_menu", "sub": [
        {"name": "upgrade", "lang": "maintenance_upgrade", "sub": [
            {"name": "upgrade", "lang": "maintenance_upgrade", "sub": [
                {"name": "Complete Upgrade", "lang": "a_upgradeall"},
                {"name": "Upload Firmware File to Update", "lang": "a_upfirmfile"},
                {"name": "Firmware Upgrade Via", "lang": "a_upvia"},
                {"name": "Firmware Server Path", "lang": "a_firserpath"},
                {"name": "Config Server Path", "lang": "a_configserpath"},
                {"name": "Firmware HTTP/HTTPS User Name", "lang": "a_httpuser"},
                {"name": "Firmware HTTP/HTTPS Password", "lang": "a_httppass"},
                {"name": "Firmware File Prefix", "lang": "a_firfipre"},
                {"name": "Firmware File Postfix", "lang": "a_firfipost"},
                {"name": "Use Grandstream GAPS", "lang": "a_usegsgap", "oem": "70"},
                {"name": "Config HTTP/HTTPS User Name", "lang": "a_confighttpuser"},
                {"name": "Config HTTP/HTTPS Password", "lang": "a_confighttppass"},
                {"name": "Config File Prefix", "lang": "a_conffipre"},
                {"name": "Config File Postfix", "lang": "a_conffipost"},
                {"name": "XML Config File Password", "lang": "a_xmlpass"},
                {"name": "Authenticate Conf File", "lang": "a_authconffile"},
                {"name": "Download Device Configuration", "lang": "a_saveconf"},
                {"name": "Upload Device Configuration", "lang": "a_importconf"},
                {"name": "Always send HTTP Basic Authentication Information", "lang": "a_httpauth"},
                {"name": "GUI customization file download via", "lang": "a_custvia"},
                {"name": "GUI customization file URL", "lang": "a_custurl"},
                {"name": "GUI customization file HTTP/HTTPS username", "lang": "a_custusername"},
                {"name": "GUI customization file HTTP/HTTPS password", "lang": "a_custpassword"},
                {"name": "Use Configurations of Config File Server", "lang": "a_copyfromconfig"},
                {"name": "Automatic Upgrade", "lang": "a_autoup"},
                {"name": "Hour of the Day(0-23)", "lang": "a_hourofday"},
                {"name": "Firmware Upgrade and Provisioning", "lang": "a_autouprule"},
                {"name": "Auto Reboot to Upgrade Without Prompt", "lang": "a_autoreboot"},
                {"name": "Allow DHCP Option 43 and Option 66 to Override Server", "lang": "a_dhcp66"},
                {"name": "Validate Server Certificate", "lang": "a_validatecert"},
                {"name": "mDNS Override Server", "lang": "a_mdns"},
                {"name": "Factory Reset", "lang": "a_factreset"},
                {"name": "3CX Auto Provision", "lang": "a_3cxautoprovis"},
                {"name": "Disable SIP NOTIFY Authentication", "lang": "a_sipnotify"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "diagnosis", "lang": "system_diagnosis", "sub": [
            {"name": "logcat", "lang": "maintenance_logcat", "sub": [
                {"name": "Clear Log", "lang": "a_clearlog"},
                {"name": "Log Tag", "lang": "a_logtag"},
                {"name": "Log Priority", "lang": "a_logpriority"}
                // {"name": "Get Log", "lang": "a_getlog"}
            ]},
            {"name": "debug", "lang": "maintenance_debug", "sub": [
                {"name": "Capture Trace", "lang": "a_operation"},
                {"name": "Trace List", "lang": "a_tracelist"},
                {"name": "View Trace", "lang": "a_view"},
            ]},
            {"name": "syslog", "acl": "1", "lang": "maintenance_syslog", "sub": [
                {"name": "Syslog Server", "lang": "a_syslogser"},
                {"name": "Syslog Level", "lang": "a_sysloglev"},
            ]},
            {"name": "ping", "acl": "1", "lang": "maintenance_ping", "sub": [
                {"name": "Target Host", "lang": "a_targethost"}
            ]},
            {"name": "traceroute", "lang": "a_traceroute", "sub": [
                {"name": "Target Host", "lang": "a_targethost"}
            ]},
            {"name": "devmode", "lang": "maintenance_devmode", "sub": [
                {"name": "Developer Mode", "lang": "maintenance_devmode"}
            ]}
        ]}
    ]},
    {"name": "status", "lang": "status_menu", "sub": [
        {"name": "acct", "lang": "status_acc", "sub": [
            {"name": "Account", "lang": "a_account"},
            {"name": "Number", "lang": "a_number"},
            {"name": "SIP Server", "lang": "a_sipserver"},
            {"name": "Status", "lang": "a_status"}
        ]},
        {"name":"peripheral","lang":"a_peripheral", "sub":[
            {"name": "HDMI In", "lang": "HDMI In"},
            {"name": "HDMI 1", "lang": "HDMI 1"},
            {"name": "HDMI 2", "lang": "HDMI 2"},
            {"name": "USB Port", "lang": "a_usbport"},
            {"name": "External Speakerphone", "lang": "a_extspeakerph"},
            {"name": "SD Card", "lang": "a_sd"}
        ]},
        {"name": "network", "lang": "status_net", "sub": [
            {"name": "MAC Address", "lang": "a_mac"},
            {"name": "NAT Type", "lang": "a_nat"},
            {"name": "Address Type", "lang": "a_networktype"},
            {"name": "IP Address", "lang": "a_ipv4addr"},
            {"name": "Subnet Mask", "lang": "a_mask"},
            {"name": "Default Gateway", "lang": "a_gateway"},
            {"name": "DNS Server 1", "lang": "a_prednsser"},
            {"name": "DNS Server 2", "lang": "a_alerdnsser"},
        ]},
        {"name": "system", "lang": "status_info", "sub": [
            {"name": "system", "lang": "status_info",  "sub": [
                {"name": "Product Model", "lang": "a_promodel"},
                {"name": "Hardware Revision", "lang": "a_hardwarerev"},
                {"name": "Part Number", "lang": "a_pn"},
                {"name": "System Version", "lang": "a_systemver"},
                {"name": "Recovery Version", "lang": "a_recover"},
                {"name": "Boot Version", "lang": "a_bootver"},
                {"name": "Kernel Version", "lang": "a_kernel"},
                {"name": "Android Version", "lang": "a_android"},
                {"name": "System Up Time", "lang": "a_sysuptime"},
            ]}
        ]},
        {"name": "remotecontrolstatus", "lang": "status_remotecontrol", "sub": [
            {"name": "remotecontrolstatus", "lang": "status_remotecontrol",  "sub": [
                {"name": "Hardware Version", "lang": "a_hardwarever"},
                {"name": "Software Version", "lang": "a_softwarever"},
                {"name": "Patch Version", "lang": "a_patchver"},
                {"name": "Remote Battery", "lang": "a_remotebatt"},
            ]}
        ]}
    ]}
]
