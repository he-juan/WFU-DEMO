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
    {"name": "status", "lang": "status_menu", "sub": [
        {"name": "acct", "lang": "status_acc", "sub": []},
        {"name": "network", "lang": "status_net", "sub": [
            {"name": "MAC Address", "lang": "a_mac"},
            {"name": "HTTP/HTTPS Proxy", "lang": "a_proxystatus"},
            {"name": "NAT Type", "lang": "a_nat"},
            {"name": "VPN IP", "lang": ""},
            {"type": "p", "lang": "a_netfordata"},
            {"type": "p", "lang": ""},
            {"name": "Address Type", "lang": "a_networktype"},
            {"name": "IP Address", "lang": "a_ipv4addr"},
            {"name": "Subnet Mask", "lang": "a_mask"},
            {"name": "Default Gateway", "lang": "a_gateway"},
            {"name": "DNS Server 1", "lang": "a_prednsser"},
            {"name": "DNS Server 2", "lang": "a_alerdnsser"},
            {"type": "p", "lang": ""},
            {"name": "IPv6 Address Type", "lang": "a_ipv6addtype"},
            {"name": "IPv6 Address", "lang": "a_ipv6addr"},
            {"name": "IPv6 DNS Server 1", "lang": "a_ipv6dnsser1"},
            {"name": "IPv6 DNS Server 2", "lang": "a_ipv6dnsser2"},
            {"type": "p", "lang": "a_netforvoip"},
            {"name": "Address Type", "lang": "a_networktype"},
            {"name": "IP Address", "lang": "a_ipaddress"},
            {"name": "Subnet Mask ", "lang": "a_mask"},
            {"name": "Default Gateway", "lang": "a_gateway"},
            {"name": "DNS Server 1", "lang": "a_prednsser"},
            {"name": "DNS Server 2", "lang": "a_alerdnsser"}
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
                {"name": "Android Version", "lang": "a_android", "product": "1, 4"},
                {"name": "System Up Time", "lang": "a_sysuptime"},
                {"name": "LCD Serial Number", "lang": "a_lcdsn"},
                {"name": "DDR Serial Number", "lang": "a_ddrsn"},
                {"name": "Factory Serial Number", "lang": "a_fctsn"}
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
                {"name": "Secondary SIP Server", "lang": "a_secsipserver", "product": "2, 3, 4"},
                {"name": "SIP User ID", "lang": "a_sipuid"},
                {"name": "SIP Authentication ID", "lang": "a_authid"},
                {"name": "SIP Authentication Password", "lang": "a_authpwd"},
                {"name": "Name", "lang": "a_name"},
                {"name": "Show Account Name Only", "lang": "a_nameonly"},
                {"name": "Tel URI", "lang": "a_teluri"},
                {"name": "Voice Mail Access Number", "lang": "a_voicemailuid", "acl": "1"},
                {"type": "p", "lang": "account_net"},
                {"name": "Outbound Proxy", "lang": "a_outbp"},
                {"name": "Secondary Outbound Proxy", "lang": "a_secoutbp"},
                {"name": "DNS Mode", "lang": "a_usedns"},
                {"name": "DNS SRV Fail-over Mode", "lang": "a_dnsfailmode"},
                {"name": "NAT Traversal", "lang": "a_natstun"},
                {"name": "Proxy-Require", "lang": "a_proxy"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "sip", "lang": "account_sip", "acl": "1", "sub": [
                {"type": "p", "lang": "a_sipbasic"},
                {"name": "SIP Registration", "lang": "a_sipreg"},
                {"name": "Unregister Before New Registration", "lang": "a_unregor"},
                {"name": "Register Expitation", "lang": "a_regexp"},
                {"name": "Reregister before Expiration", "lang": "a_regbeforeexp"},
                {"name": "Registration Retry Wait Time", "lang": "a_retrytime"},
                {"name": "Add Auth Header On RE-REGISTER", "lang": "a_registerAuthHeader"},
                {"name": "Enable SIP OPTIONS Keep Alive", "lang": "a_enablesip"},
                {"name": "SIP OPTIONS Keep Alive Interval (s)", "lang": "a_sipperiod"},
                {"name": "SIP OPTIONS Keep Alive Maximum Tries", "lang": "a_maxsipmsg"},
                {"name": "SUBSCRIBE for MWI", "lang": "a_s4mwi", "acl": "1"},
                {"name": "Use Privacy Header", "lang": "a_usepheader", "acl": "1"},
                {"name": "Use P-Preferred-Identity Header", "lang": "a_useppiheader", "acl": "1"},
                {"name": "SIP Transport", "lang": "a_siptranport"},
                {"name": "Local SIP Port", "lang": "a_sipport"},
                {"name": "SIP URI Scheme When Using TLS", "lang": "a_sipschema"},
                {"name": "Use Actual Ephemeral Port in Contact with TCP/TLS", "lang": "a_useepport"},
                {"name": "Support SIP Instance ID", "lang": "a_suptsipintid"},
                {"name": "SIP T1 Timeout", "lang": "a_sipt1to"},
                {"name": "SIP T2 Interval", "lang": "a_sipt2int"},
                {"name": "SIP Timer D Interval", "lang": "a_siptdint"},
                {"name": "Remove OBP from Route", "lang": "a_removeobp"},
                {"name": "Enable 100rel", "lang": "a_en10rel"},
                {"type": "p", "lang": "a_sessiontime"},
                {"name": "Enable Session Timer", "lang": "a_opensession"},
                {"name": "Session Expiration", "lang": "a_seexp"},
                {"name": "Min-SE", "lang": "a_minse"},
                {"name": "UAC Specify Refresher", "lang": "a_uacsr"},
                {"name": "UAS Specify Refresher", "lang": "a_uassr"},
                {"name": "Caller Request Timer", "lang": "a_callerreq"},
                {"name": "Callee Request Timer", "lang": "a_calleereq"},
                {"name": "Force Timer", "lang": "a_fortimer"},
                {"name": "Force INVITE", "lang": "a_forceinv"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "codec", "lang": "account_codec", "acl": "1", "sub": [
                {"type": "p", "lang": "a_prevocoder"},
                {"name": "Preferred Vocoder", "lang": "a_prevocoder"},
                {"name": "Codec Negotiation Priority", "lang": "a_codecpri"},
                {"name": "Use First Matching Vocoder in 200OK SDP", "lang": "a_usefvcode"},
                {"name": "iLBC Frame Size", "lang": "a_ilibcfs"},
                {"name": "G726-32 ITU Payload", "lang": "a_g726payload", "product": "1"},
                {"name": "G726-32 Dynamic PT", "lang": "a_dynamicpt", "product": "1"},
                {"name": "Opus Payload Type", "lang": "a_opuspayload"},
                {"name": "DTMF", "lang": ""},
                {"name": "DTMF Payload Type", "lang": "a_dtmfpayload"},
                {"name": "Jitter Buffer Type", "lang": "a_jitterbt", "product": "1"},
                {"name": "Enable Audio RED with FEC", "lang": "a_audioredfec"},
                {"name": "Audio FEC Payload Type", "lang": "a_audiofecpayload"},
                {"name": "Audio RED Payload Type", "lang": "a_audioredpayload"},
                {"name": "Silence Suppression", "lang": "a_silsup"},
                {"name": "Voice Frames Per TX", "lang": "a_vocfp"},
                {"type": "p", "lang": "a_prevcoder", "product": "1, 4"},
                {"name": "Preferred Video Coder", "lang": "a_prevcoder", "product": "1, 4"},
                {"name": "Enable Video FEC", "lang": "a_enablefec", "product": "1, 4"},
                {"name": "Enable RFC5168 Support", "lang": "a_enablerfc", "product": "1, 4"},
                {"name": "Video FEC Mode", "lang": "a_fecmode", "product": "1, 4"},
                {"name": "FEC Payload Type", "lang": "a_fecpayload", "product": "1, 4"},
                {"name": "Packetization-mode", "lang": "a_packetmodel", "product": "1, 4"},
                {"name": "H.264 Image Size", "lang": "a_h264imgsize", "product": "1, 4"},
                {"name": "Use H.264 Constrained Profiles", "lang": "a_useh264profile", "product": "1, 4"},
                {"name": "H.264 Profile Type", "lang": "a_h264protype", "product": "1, 4"},
                {"name": "Video Bit Rate", "lang": "a_vidbr", "product": "1, 4"},
                {"name": "SDP Bandwidth Attribute", "lang": "a_sdpattr", "product": "1, 4"},
                {"name": "H.264 Payload Type", "lang": "a_h264payload", "product": "1, 4"},
                {"type": "p", "lang": "a_presentation", "product": "1, 4"},
                {"name": "Disable BFCP", "lang": "a_disablepresent", "product": "1, 4"},
                {"name": "INITIAL INVITE", "lang": "a_initialinvite", "product": "1, 4"},
                {"name": "Presentation H.264 Image Size", "lang": "a_presentimagesize", "product": "1, 4"},
                {"name": "Presentation H.264 Profile", "lang": "a_presentprofile", "product": "1, 4"},
                {"name": "Presentation Video Bit Rate(Kbps)", "lang": "a_presentvideobitrate", "product": "1, 4"},
                {"name": "Presentation Video Frame Rate", "lang": "a_presentvideoframebate", "product": "1, 4"},
                {"name": "BFCP Transport Protocol", "lang": "a_bfcptranspro", "product": "1, 4"},
                {"type": "p", "lang": "account_rtp"},
                {"name": "SRTP Mode", "lang": "a_srtp"},
                {"name": "SRTP Key Length", "lang": "a_encryptdigit"},
                {"name": "Enable SRTP Key Life Time", "lang": "a_srtplifttime"},
                {"name": "RTCP Destination", "lang": "a_rtcpserver"},
                {"name": "Symmetric RTP", "lang": "a_symrtp"},
                {"name": "RTP IP Filter", "lang": "a_rtpipfilter"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "call", "lang": "account_call", "sub": [
                {"type": "p", "lang": "a_apply_fun", "acl": "1"},
                {"name": "Start Video Automatically", "lang": "a_autovideo", "product": "1, 4", "acl": "1"},
                {"name": "Remote Video Request", "lang": "a_remotevideo", "product": "1, 4", "acl": "1"},
                {"name": "Video Layout", "lang": "a_videolayout", "product": "1, 2, 4", "acl": "1"},
                {"name": "Auto Answer", "lang": "a_autoans", "product": "4", "acl": "1"},
                {"name": "Start Time", "lang": "a_timestart", "product": "1, 3, 4", "acl": "1"},
                {"name": "End Time", "lang": "a_timeend", "product": "1, 3, 4", "acl": "1"},
                {"name": "Play warning tone for Auto Answer Intercom", "lang": "a_warmingtone", "acl": "1"},
                {"name": "Custom Alert-Info for Auto Answer", "lang": "a_caiforaa", "acl": "1"},
                {"name": "Intercom Barging", "lang": "a_interbarg", "acl": "1","product": "4"},
                {"name": "Auto Preview", "lang": "a_autoprvw", "product": "1,4", "acl": "1"},
                {"name": "Send Anonymous", "lang": "a_sendanoy", "acl": "1"},
                {"name": "Anonymous Call Rejection", "lang": "a_anonycallrej", "acl": "1"},
                {"name": "Call Log", "lang": "a_calllog", "acl": "1"},
                {"name": "Enable Call Features", "lang": "a_encallfea", "acl": "1"},
                {"name": "Transfer on 3 way conference Hangup", "lang": "a_tranonhang", "acl": "1","product": "4",},
                {"name": "Use # as Dial Key", "lang": "a_usepound", "acl": "1", "product": "1,4"},
                {"name": "DND Call Feature On", "lang": "a_dndfeaon", "acl": "1","product": "4"},
                {"name": "DND Call Feature Off", "lang": "a_dndfeaoff", "acl": "1","product": "4"},
                {"name": "No Key Entry Timeout", "lang": "a_nokeyentry", "acl": "1","product": "4"},
                {"name": "Ring Timeout", "lang": "a_ringto", "acl": "1"},
                {"name": "Refer-To Use Target Contact", "lang": "a_referto", "acl": "1"},
                {"name": "RFC2543 Hold", "lang": ""},
                {"type": "p", "lang": "a_callforward", "product":"4","oem":"54"},
                {"name": "Call Forward Type", "lang": "a_cftype", "product":"4","oem":"54"},
                {"name": "All To", "lang": "a_allto"},
                {"name": "Time Period", "lang": "a_timerd"},
                {"name": "In Time Forward To", "lang": "a_intimeto"},
                {"name": "Out Time Forward To", "lang": "a_outtimeto"},
                {"name": "Enable Busy Forward", "lang": "a_enablebusyto"},
                {"name": "Busy To", "lang": "a_busyto"},
                {"name": "Enable No Answer Forward", "lang": "a_enablenoanswerto"},
                {"name": "No Answer To", "lang": "a_noanswerto"},
                {"name": "No Answer Timeout", "lang": "a_forwardwt"},
                {"name": "Enable DND Forward", "lang": "a_enabledndforward"},
                {"name": "DND To", "lang": "a_dndto"},
                {"type": "p", "lang": "a_dialplan"},
                {"name": "Dial Plan Prefix", "lang": "a_dialplanpr"},
                {"name": "Disable DialPlan", "lang": "a_disdialplan"},
                {"name": "DialPlan", "lang": "a_dialplan"},
                {"type": "p", "lang": "a_callerids"},
                {"name": "Caller ID Display", "lang": "a_callerdisplay"},
                {"type": "p", "lang": "a_ringtone"},
                {"name": "Account Ring Tone", "lang": "a_defaultringtone"},
                {"name": "Ignore Alert-Info header", "lang": "a_ignoreAIheader"},
                {"type": "row", "lang": ""},
                {"type": "row", "lang": ""},
                {"type": "row", "lang": ""},
                {"type": "row", "lang": ""},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "advanced", "lang": "advanced_menu", "acl": "1", "sub": [
                {"type": "p", "lang": "security_set"},
                {"name": "Check Domain Certificates", "lang": "a_checkdomain"},
                {"name": "Validate Certification Chain", "lang": "a_validatecert"},
                {"name": "Validate Incoming SIP Messages", "lang": "a_validincommsg"},
                {"name": "Allow Unsolicited REFER", "lang": "a_allowrefer"},
                {"name": "Only Accept SIP Requests from Known Servers", "lang": "a_accpsip"},
                {"name": "Check SIP User ID for Incoming INVITE", "lang": "a_checkinvite"},
                {"name": "Allow SIP Reset", "lang": "a_sipreset"},
                {"name": "Authenticate Incoming INVITE", "lang": "a_authinvite"},
                {"name": "SIP realm used for challenge INVITE & NOTIFY", "lang": "a_challenge"},
                {"type": "p", "lang": ""},
                {"name": "Upload Local MOH Audio File", "lang": "a_uploadaudio"},
                {"name": "Enable Local MOH", "lang": "a_enablemoh"},
                {"type": "p", "lang": "a_advancedcallfun"},
                {"name": "Virtual Account Group", "lang": "a_group", "product": "1"},
                {"name": "Special Feature", "lang": "a_spefea"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "ipvtAcct", "lang": "IPVideoTalk", "product": "1", "sub": [
            {"name": "general", "lang": "advanced_general", "sub": [
                {"name": "Account Active", "lang": "a_accountactive"},
                {"name": "Name", "lang": "a_name"},
                {"name": "Current plans", "lang": "a_curplans"},
                {"name": "SIP Transport", "lang": "a_siptranport"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "call", "lang": "advanced_call", "sub": [
                {"name": "Auto Answer", "lang": "a_autoans"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]}
    ]},
    {"name": "calls", "lang": "a_calls", "sub": [
        {"name": "dialup", "lang": "a_dialup", "sub": []},
        {"name": "history", "lang": "call_history", "sub": [
            {"name": "all", "lang": "history_all", "sub": [

            ]},
            {"name": "intercept", "lang": "history_intercept", "sub": [

            ]}
        ]},
        {"name": "contact", "lang": "a_contact", "sub": [
            {"name": "contactTab", "lang": "a_contactlist", "sub": [

            ]},
            {"name": "groupTab", "lang": "a_contactgroups", "sub": [

            ]}
        ]},
        {"name": "blackwhite", "lang": "a_blackwhite", "sub": [
            {"name": "white", "lang": "a_whiteset", "product":"",  "sub": [

            ]},
            {"name": "black", "lang": "a_blackset", "sub": [

            ]},
            {"name": "blockrule", "lang": "a_blockrule", "sub": [
                {"name": "Non-white list calls", "lang": "a_unwhitecall"},
                {"name": "Call password", "lang": "a_callpwd"}
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
            {"name": "guest", "lang": "a_guestset", "product": "2, 3, 4", "sub": [
                {"name": "Guest Login", "lang": "a_publicmode"},
                {"name": "Guest Login Timeout", "lang": "a_publicmodeint", "product": "1"},
                {"name": "Guest Login PIN Code", "lang": "a_logoutpin"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "callfeatures", "lang": "account_call", "sub": [
            {"name": "callfeatures", "lang": "account_call", "sub": [
                {"name": "Disable Call-Waiting Tone", "lang": "a_discallwaittone","product":"4"},
                {"name": "Disable DND Reminder Ring", "lang": "a_disdndring","product":"4"},
                {"name": "Auto Mute on Entry", "lang": "a_entrymute"},
                {"name": "Noise Shield", "lang": "a_noiseshield"},
                {"name": "Filter Characters", "lang": "a_filterchars"},
                {"name": "Escape '#' as %23 in SIP URI", "lang": "a_escapeuri"},
                {"name": "Disable in-call DTMF display", "lang": "a_disdtmf"},
                {"name": "Disable Call-Waiting", "lang": "a_callwait","product":"4"},
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
                    // {"name": "Different Networks for Data and VoIP Calls", "lang": "a_twovlan", product: "1, 2, 3, 4"},
                    {"type": "p", "lang": ""},
                    // {"type": "p", "lang": "a_netfordata"},
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
                {"type": "p", "lang": "common_net", "product": "1,4"},
                {"name": "Alternate DNS Server", "lang": "a_relprednsser"},
                {"name": "Second Alternate DNS Server", "lang": "a_2relprednsser"},
                {"name": "Enable LLDP", "lang": "a_enablelldp", "product": "1"},
                {"name": "Layer 3 QoS for SIP", "lang": "a_layer3qossip"},
                {"name": "Layer 3 QoS for Audio", "lang": "a_layer3qosaudio"},
                {"name": "Layer 3 QoS for Video", "lang": "a_layer3qosvideo", "product": "1,4"},
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
        {"name": "timeandlang", "lang": "time_lang", "sub": [
            {"name": "time", "lang": "maintenance_time", "sub": [
                {"name": "Assign NTP Server Address", "lang": "a_ntpserver"},
                {"name": "DHCP Option 42 Override NTP Server", "lang": "a_dhcpoption"},
                {"name": "DHCP Option 2 to override Time Zone setting", "lang": "a_allowdhcpset"},
                {"name": "Time Zone", "lang": "a_timezone"},
                {"name": "Time Display Format", "lang": "a_timefmt"},
                {"name": "Date Display Format", "lang": "a_datefmt"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "language", "lang": "maintenance_lang", "sub": [
                {"name": "Language", "lang": "a_lang"},
                {"name": "Custom Language", "lang": "a_importlan"},
                {"name": "Default Custom Language", "lang": "a_cusdftlang"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "security", "lang": "security_set", "sub": [
            {"name": "web", "acl": "1", "lang": "maintenance_web", "sub": [
                {"name": "Disable SSH", "lang": "a_distelnet"},
                {"name": "Access Methode", "lang": "a_httpena"},
                {"name": "Port", "lang": "a_port"},
                {"name": "Configuration via Keypad Menu", "lang": "a_confmenu","product":"4"},
                {"name": "Permission to Install/Uninstall Apps", "lang": "a_apppermission", "product": "1,4"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "user", "lang": "a_userinfo", "sub": [
                {"name": "Current Admin Password", "lang": "a_curuserpwd"},
                {"name": "Admin Password", "lang": "a_adminpwd", "acl": "1"},
                {"name": "Confirm Admin Password", "lang": "a_conadminpwd", "acl": "1"},
                {"name": "User Password", "lang": "a_userpwd"},
                {"name": "Confirm User Password", "lang": "a_conuserpwd"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "siptls", "acl": "1", "lang": "SIP TLS", "sub": [
                {"name": "SIP TLS Certificate", "lang": "a_sslcer"},
                {"name": "SIP TLS Private Key", "lang": "a_sslpkey"},
                {"name": "SIP TLS Private Key Password", "lang": "a_sslpkpwd"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "certificate", "acl": "1", "lang": "a_certmanage", "sub": []}
        ]},
        {"name": "peripherals", "lang": "cpnt_peripheral", "sub": [
            {"name": "led", "lang": "a_lcdledmanage", "sub": [
                {"name": "Disable Missed Call Backlight", "lang": "a_disbacklight","product":"1, 4"},
                {"name": "Disable Missed Call Indicator", "lang": "a_dismissindtor"},
                {"name": "Disable MWI Indicator", "lang": "a_dismwiindtor","product":"4"},
                {"name": "Disable New Message Indicator", "lang": "a_disnewmsgindtor","product":"4"},
                {"name": "Disable Contact Full Indicator", "lang": "a_disfullindtor", "product": "1"},
                {"name": "Disable Indicator When LCD is Off", "lang": "a_dislcdindtor", "product": "1, 4"},
                {"name": "Disable Keypad Backlight", "lang": "a_diskbbacklight", "product": "2, 3, 4"},
                {"type": "button", "lang": "a_save"},
                {"type": "p", "lang": "a_adjustlight", "product": "1, 2, 3"},
                {"name": "Red light", "lang": "a_adjustred", "product": "1, 2, 3"},
                {"name": "Green light", "lang": "a_adjustgreen", "product": "1, 2, 3"},
                {"name": "Blue light", "lang": "a_adjustblue", "product": "1, 2, 3"}
            ]},
            {"name": "peripherals", "product": "1, 4", "lang": "a_perinterface", "sub": [
                {"name": "AE Mode", "lang": "a_aemode", "acl": "1"},
                {"name": "HDMI Control", "lang": "a_hdmimode", product: "2, 3"},
                {"name": "Disable RJ9 Headset Auto Detect", "lang": "a_disrj9autodtc", product: "2, 3"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "voice", "acl": "1", "product": "1, 4", "lang": "a_voicectrl", "sub": [
                {"name": "RJ9 Headset TX Gain", "lang": "a_headsettx", "product": "1"},
                {"name": "RJ9 Headset RX Gain", "lang": "a_headsetrx", "product": "1"},
                {"name": "3.5mm Earphone TX Gain", "lang": "a_earphonetx", "product": "1"},
                {"name": "3.5mm Earphone RX Gain", "lang": "a_earphonerx", "product": "1"},
                {"name": "Headset Type", "lang": "a_ehsheadset", "product": "1"},
                {"name": "Enable 3.5mm Headset Control", "lang": "a_headsetctrl", "product": "1"},
                {"name": "Handset TX Gain", "lang": "a_handsettx"},
                {"name": "Handset RX Gain", "lang": "a_handsetrx"},
                {"name": "Virtual Sound Card TX Gain", "lang": "a_vcardtx"},
                {"name": "Virtual Sound Card RX Gain", "lang": "a_vcardrx"},
                {"name": "Handset Equalizer RX", "lang": "a_handseteqrx"},
                {"name": "Adjust Volume", "lang": "a_adjustvol", "product": "1, 2, 3"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "gesture", "acl": "1", "product": "2, 3, 4", "lang": "a_gesture", "sub": [
                {"type": "p", "lang": "flip_phone"},
                {"name": "Reject incoming call", "lang": "a_ringoncall"},
                {"name": "Reply content", "lang": "a_msginfo"},
                {"name": "Customize", "lang": "a_msgcustom"},
                {"type": "p", "lang": "pick_phone"},
                {"name": "Lower Ring tone volume", "lang": "a_weakvolume"},
                {"name": "Alarm volume down", "lang": "a_weakalarm"},
                {"type": "p", "lang": "dounleTap_phone"},
                {"name": "Mute/unmute during a call", "lang": "a_callslience"},
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
        {"name": "sitename", "lang": "a_sitename","product": "1, 2, 4", "sub": [
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
        {"name": "switch", "lang": "a_swtich","product": "1, 2, 3", "sub": [
            {"name": "basic", "lang": "advanced_switchSetting", "sub": [
                {"type": "p", "lang": "switch_basic"},
                {"name": "product", "lang": "a_switchName"},
                {"name": "triggertype", "lang": "a_switchtype"},
                {"type": "p", "lang": "switch_linkage"},
                {"name": "soundPrompt", "lang": "a_soundPrompt"},
                {"name": "promptTone", "lang": "a_promptTone"},
                {"name": "callToDeal", "lang": "a_callToDeal"},
                {"name": "switchNumber", "lang": ""},
                {"name": "callRecordingFunction", "lang": "a_callRecordingFunction"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "time", "lang": "advanced_switchTime", "sub": [
                {"name": "switchTime", "lang": "a_switchTime"},
                {"name": "switchFrequency", "lang": "a_switchFrequency"},
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
        ]
    },
    {"name": "sysapp", "lang": "system_app", "sub": [
        {"name": "ldap", "lang": "appset_ldap","product":"1", "sub": [
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
            {"name": "firmware", "lang": "a_firmwaretitle", "sub": [
                {"name": "Complete Upgrade", "lang": "a_upgradeall"},
                {"name": "Upload Firmware File to Update", "lang": "a_upfirmfile"},
                {"name": "Firmware Upgrade Via", "lang": "a_upvia"},
                {"name": "Firmware Server Path", "lang": "a_firserpath"},
                {"name": "Firmware HTTP/HTTPS User Name", "lang": "a_httpuser"},
                {"name": "Firmware HTTP/HTTPS Password", "lang": "a_httppass"},
                {"name": "Firmware File Prefix", "lang": "a_firfipre"},
                {"name": "Firmware File Postfix", "lang": "a_firfipost"},
                {"name": "Firmware Upgrade", "lang": "a_firmwareupgrade"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "config", "lang": "a_configtitle", "sub": [
                {"type": "p", "lang": "a_configtitle"},
                {"name": "Use Grandstream GAPS", "lang": "a_usegsgap", "oem": "70"},
                {"name": "Config Upgrade Via", "lang": "a_configupvia"},
                {"name": "Config Server Path", "lang": "a_configserpath"},
                {"name": "Config HTTP/HTTPS User Name", "lang": "a_confighttpuser"},
                {"name": "Config HTTP/HTTPS Password", "lang": "a_confighttppass"},
                {"name": "Always send HTTP Basic Authentication Information", "lang": "a_httpauth"},
                {"name": "Config File Prefix", "lang": "a_conffipre"},
                {"name": "Config File Postfix", "lang": "a_conffipost"},
                {"name": "Authenticate Conf File", "lang": "a_authconffile"},
                {"name": "XML Config File Password", "lang": "a_xmlpass"},
                {"name": "Download Device Configuration", "lang": "a_saveconf"},
                {"name": "Upload Device Configuration", "lang": "a_importconf"},
                {"type": "p", "lang": "a_custtitle", "product": "1, 4"},
                {"name": "GUI customization file download via", "lang": "a_custvia", "product": "1, 4"},
                {"name": "GUI customization file URL", "lang": "a_custurl", "product": "1, 4"},
                {"name": "GUI customization file HTTP/HTTPS username", "lang": "a_custusername", "product": "1, 4"},
                {"name": "GUI customization file HTTP/HTTPS password", "lang": "a_custpassword", "product": "1, 4"},
                {"name": "Use Configurations of Config File Server", "lang": "a_copyfromconfig", "product": "1, 4"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "deploy", "lang": "a_deploy", "sub": [
                {"type": "p", "lang": "a_autoup"},
                {"name": "Automatic Upgrade", "lang": "a_autoup"},
                {"name": "Automatic Upgrade Check Interval", "lang": "a_period"},
                {"type": "row", "lang": "start_endhour"},
                {"name": "Day of the Week", "lang": "a_dayofweek"},
                {"name": "Firmware Upgrade and Provisioning", "lang": "a_autouprule"},
                {"name": "Auto Reboot to Upgrade Without Prompt", "lang": "a_autoreboot", "product": "4"},
                {"type": "p", "lang": "a_dhcptitle"},
                {"name": "Allow DHCP Option 43 and Option 66 to Override Server", "lang": "a_dhcp66"},
                {"name": "DHCP Option 120 Override SIP Server", "lang": "a_dhcp120"},
                {"name": "Allow DHCP Option 242 (Avaya IP Phones)", "lang": "a_dhcp242"},
                {"type": "p", "lang": "a_cfgProvision"},
                {"name": "CFG Provision", "lang": "a_CFG_Provision"},
                {"type": "p", "lang": "a_pnptitle", "product": "1"},
                {"name": "Enable PNP Feature", "lang": "a_enablepnp", "product": "1,4"},
                {"name": "PNP URL", "lang": "a_pnpurl", "product": "1,4"},
                {"name": "PnP(3CX) Auto Provision", "lang": "a_autopro", "product": "1"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "more", "lang": "a_more", "sub": [
                {"name": "Disable SIP NOTIFY Authentication", "lang": "a_sipnotify"},
                {"name": "Validate Server Certificate", "lang": "a_validatecert"},
                {"name": "mDNS Override Server", "lang": "a_mdns"},
                {"name": "Factory Reset", "lang": "a_factreset"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "diagnosis", "lang": "system_diagnosis", "sub": [
            {"name": "syslog", "acl": "1", "lang": "maintenance_syslog", "sub": [
                {"name": "Syslog Protocol", "lang": "a_syslogptl"},
                {"name": "Syslog Server", "lang": "a_syslogser"},
                {"name": "Syslog Level", "lang": "a_sysloglev"},
                {"name": "Send SIP Log", "lang": "a_sendlog"},
                {"name": "Syslog Keyword Filter", "lang": "a_syslogfilter"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "logcat", "lang": "maintenance_logcat", "sub": [
                {"name": "Clear Log", "lang": "a_clearlog"},
                {"name": "Log Tag", "lang": "a_logtag"},
                {"name": "Log Priority", "lang": "a_logpriority"},
                {"name": "Get Log", "lang": "a_getlog"}
            ]},
            {"name": "debug", "lang": "maintenance_debug", "sub": [
                {"type": "p", "lang": "a_oneclick"},
                {"name": "One-click Debugging", "lang": "a_oneclick"},
                {"name": "Debug Info Menu", "lang": "a_debuginfomenu"},
                {"name": "Debug Info List", "lang": "a_debuglist"},
                {"name": "View Debug Info", "lang": "a_viewdebug"},
                {"type": "p", "lang": "a_coredump"},
                {"name": "Enable Core Dump Generation", "lang": "a_enablecoredump"},
                {"name": "Core Dump List", "lang": "a_coredumplist"},
                {"name": "View Core Dump", "lang": "a_view_coredump"},
                {"type": "p", "lang": "a_record"},
                {"name": "Record", "lang": "a_record"},
                {"name": "Recording List", "lang": "a_reclist"},
                {"name": "View Recording", "lang": "a_viewrec"},
                {"type": "p", "lang": "a_screenshort", "product": "2, 3, 4"},
                {"name": "Screen Shot", "lang": "a_screenshort", "product": "2, 3, 4"},
                {"name": "Screen Short List", "lang": "a_screenlist", "product": "2, 3, 4"},
                {"name": "View Screen Short", "lang": "a_viewscreen", "product": "2, 3, 4"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "traceroute", "lang": "a_traceroute", "sub": [
                {"name": "Target Host", "lang": "a_targethost"}
            ]}
        ]},
        {"name": "eventnotice", "lang": "maintenance_actionurl", "sub": [
            {"name": "eventnotice", "lang": "maintenance_actionurl", "sub": [
                {"name": "On Boot Completed", "lang": "a_onboot"},
                {"name": "Incoming Call", "lang": "a_incomingcall"},
                {"name": "Outgoing Call", "lang": "a_outgoingcall"},
                {"name": "On offhook", "lang": "a_onoffhook", "product": "1,4"},
                {"name": "On onhook", "lang": "a_ononhook", "product": "1,4"},
                {"name": "Missed Call", "lang": "a_missedcall"},
                {"name": "On Connected", "lang": "a_onconnected"},
                {"name": "On Disconnected", "lang": "a_ondisconnected"},
                {"name": "DND On", "lang": "a_dndon", "product": "4"},
                {"name": "DND Off", "lang": "a_dndoff", "product": "4"},
                {"name": "Forward On", "lang": "a_forwardon"},
                {"name": "Forward Off", "lang": "a_forwardoff"},
                {"name": "On Blind Transfer", "lang": "a_blindtransfer"},
                {"name": "On Attended Transfer", "lang": "a_attendtransfer"},
                {"name": "On Hold", "lang": "a_onhold", "product": "4"},
                {"name": "On Unhold", "lang": "a_onunhold", "product": "4"},
                {"name": "Log On", "lang": "a_logon"},
                {"name": "Log Off", "lang": "a_logoff"},
                {"name": "On Register", "lang": "a_onregister"},
                {"name": "On Unregister", "lang": "a_onunregister"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]}
    ]},
    {"name": "extension", "lang": "extend_service", "sub": [
        {"name": "gds", "lang": "a_gds", "sub": [
            {"name": "gds", "lang": "a_gds_en", "sub": []}
        ]},
        {"name": "broadsoftfunc", "lang": "ext_broadsoft", "product": "1", "sub": [
            {"name": "call", "lang": "ext_broadsoft", "sub": [
                {"name": "Feature Key Synchronization", "lang": "a_feakey"},
                {"name": "Enable BroadSoft Call Park", "lang": "a_bscallpark"},
                {"name": "Conference URI", "lang": "a_confuri"},
                {"name": "BroadSoft Call Center", "lang": "a_bcallcenter"},
                {"name": "Hoteling Event", "lang": "a_hotelevent"},
                {"name": "Call Center Status", "lang": "a_centerstatus"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "sca", "lang": "SCA", "sub": [
                {"name": "Enable SCA (Shared Call Appearance)", "lang": "a_enablesca"},
                {"name": "Enable BargeIn", "lang": "a_enbargein"},
                {"name": "Auto-filling Pickup Feature Code", "lang": "a_audofillcode"},
                {"name": "Pickup Feature Code", "lang": "a_callcode"},
                {"name": "Line-seize Timeout", "lang": "a_lineseize"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "broadsoftcontact", "lang": "maintenance_broadsoft", "product": "1,3", "sub": [
            {"name": "xsi", "lang": "a_xsiset", "sub": [
                {"name": "Authentication Type", "lang": "a_bsauthtype"},
                {"name": "Server", "lang": "a_server"},
                {"name": "Port", "lang": "a_port"},
                {"name": "Action Path", "lang": "a_actionpath"},
                {"name": "User ID", "lang": "a_bsuserid"},
                {"name": "Username", "lang": "a_authid"},
                {"name": "Password", "lang": "a_authpwd"},
                {"name": "Password", "lang": "a_bspassword"},
                {"name": "BroadSoft Directory & Call Logs Update Interval", "lang": "a_bsupdateinterval"},
                {"name": "BroadSoft Directory Hits", "lang": "a_bsmaxhits"},
                {"name": "BroadSoft Directory Order", "lang": "a_bsorders"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "network", "lang": "a_netdir", "sub": []}
        ]},
        {"name": "broadsoftimp", "lang": "BroadSoft IM&P", "product": "1,3", "sub": [
            {"name": "login", "lang": "a_logincre", "sub": [
                {"name": "Server", "lang": "a_server"},
                {"name": "Port", "lang": "a_port"},
                {"name": "Username", "lang": "a_username"},
                {"name": "Password", "lang": "a_password"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "imp", "lang": "a_impsettings", "sub": [
                {"name": "Enable BroadSoft IM&P", "lang": "a_bsimp"},
                {"name": "Associated BroadSoft Account", "lang": "a_bsacct"},
                {"name": "Auto Login", "lang": "a_autologin"},
                {"name": "Display Non XMPP Contacts", "lang": "a_disnonxmpp"},
                {"type": "button", "lang": "a_save"}
            ]}
        ]},
        {"name": "detection", "lang": "device_detect", "sub": [
            {"name": "loopback", "lang": "audio_loopback", "sub": []},
            {"name": "speaker", "lang": "builtin_speaker", "sub": []},
            {"name": "led", "lang": "led_test", "sub": []},
            {"name": "certverify", "lang": "cert_check", "sub": []},
            {"name": "reset", "lang": "reset_test", "sub": []}
        ]}
    ]}
]
