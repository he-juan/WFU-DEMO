/*
 acl - used for setting the access permission of options.
 [sample] acl: [0/1]
 0: all users can access.
 1: only admin can access.

 oem - used for setting the options hidden for oem requirement.
 [sample] oem: "oemid1, oemid2, ..."

 product - used for setting the options hidden for special products.
 [sample] product: "1, 2, ..."
 1: GVC3200 hidden
 2: GVC3210 hidden
 3: GVC3220 hidden
 */

export const options = [
    {"name": "calls", "lang": "a_calls", "sub": [
        {"name": "contact", "lang": "a_19631", "sub": [
            {"name": "contact", "lang": "a_19631", "sub": [
                {"name": "File Encoding", "lang": "a_4755"},
                {"name": "File Type", "lang": "a_4756"},
                {"name": "Save Phonebook to PC", "lang": "a_19644"},
                {"name": "Clear The Old List", "lang": "a_16485"},
                {"name": "Replace Duplicate Items", "lang": "a_19648"},
                {"name": "Local File", "lang": "a_16484"},
                {"name": "Download Mode", "lang": "a_4765"},
                {"name": "Download Server", "lang": "a_4766"},
                {"name": "Download Now", "lang": "a_16488"}
            ]}
        ]},
        {"name": "schedule", "lang": "a_10011", "sub": [
            {"name": "preschedule", "lang": "a_preschedule", "sub": [

                ]},
            {"name": "conf_history", "lang": "history_all", "product":"1,2", "sub": [

                ]}
        ]},
        {"name": "history", "lang": "a_3536", "sub": [
            {"name": "all", "lang": "history_all", "sub": [

                ]},
            {"name": "missed-call", "lang": "a_3524", "product":"1,2,3", "sub": [

                ]}
        ]},
    ]},
    {"name": "account", "lang": "a_account", "sub": [
        {"name": "sipAcct", "lang": "SIP", "sub": [
            {"name": "general", "lang": "a_16023", "acl": "1", "sub": [
                {"type": "p", "lang": "a_accountregister"},
                {"name": "Account Active", "lang": "a_1119"},
                {"name": "Account Name", "lang": "a_1120"},
                {"name": "SIP Server", "lang": "a_23536"},
                {"name": "Secondary SIP Server", "lang": "a_16055"},
                {"name": "Tertiary SIP Server", "lang": "a_19168"},
                {"name": "SIP User ID", "lang": "a_1122"},
                {"name": "SIP Authentication ID", "lang": "a_23538"},
                {"name": "SIP Authentication Password", "lang": "a_23539"},
                {"name": "Display name", "lang": "a_1126"},
                {"name": "voicemail access number", "lang": "a_1125", "acl": "1"},
                {"name": "Tel URI", "lang": "a_16056"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "network", "lang": "a_16024", "acl": "1", "sub": [
                {"name": "Outbound Proxy", "lang": "a_16057"},
                {"name": "Secondary Outbound Proxy", "lang": "a_16058"},
                {"name": "DNS Mode", "lang": "a_16059"},
                {"name": "NAT Traversal", "lang": "a_16060"},
                {"name": "Proxy-Require", "lang": "a_16061"}

            ]},
            {"name": "sip", "lang": "a_16025", "acl": "1", "sub": [
                {"name": "Register", "lang": "a_19054"},
                {"name": "Unregister Before New Registration", "lang": "a_16067"},
                {"name": "Register expiration (Min.)", "lang": "a_16069"},
                {"name": "Re-register before Expiration (s)", "lang": "a_19802"},
                {"name": "Wait time retry registration (s)", "lang": "a_16070"},
                {"name": "Local SIP port", "lang": "a_16071"},
                {"name": "SUBSCRIBE for MWI", "lang": "a_16072", "acl": "1"},
                {"name": "Enable Session Timer", "lang": "a_16675"},
                {"name": "Session expiration (s)", "lang": "a_16073"},
                {"name": "Min-SE (s)", "lang": "a_16074"},
                {"name": "UAC Specify Refresher", "lang": "a_16075"},
                {"name": "UAS Specify Refresher", "lang": "a_16076"},
                {"name": "Force INVITE", "lang": "a_16077"},
                {"name": "Caller Request Timer", "lang": "a_16090"},
                {"name": "Callee Request Timer", "lang": "a_16091"},
                {"name": "Force Timer", "lang": "a_16092"},
                {"name": "Enable 100rel", "lang": "a_16085"},
                {"name": "Caller ID Display", "lang": "a_16086"},
                {"name": "Use Privacy Header", "lang": "a_16088", "acl": "1"},
                {"name": "Use P-Preferred-Identity Header", "lang": "a_16089", "acl": "1"},
                {"name": "SIP Transport", "lang": "a_16093"}, 
                {"name": "RTP IP Filter", "lang": "a_19154"}, 
                {"name": "RTP Timeout (s)", "lang": "a_19287"},   
                {"name": "SIP URI Scheme When Using TLS", "lang": "a_16094"},
                {"name": "Use Actual Ephemeral Port in Contact with TCP/TLS", "lang": "a_16095"},
                {"name": "RFC2543 Hold", "lang": "RFC2543 Hold"},
                {"name": "Symmetric RTP", "lang": "a_16096"},
                {"name": "Support SIP Instance ID", "lang": "a_16097"},
                {"name": "Validate Incoming SIP Messages", "lang": "a_16098"},
                {"name": "Check SIP User ID for Incoming INVITE", "lang": "a_16078"},
                {"name": "Authenticate Incoming INVITE", "lang": "a_16079"},
                {"name": "SIP realm used for challenge INVITE & NOTIFY", "lang": "a_16691"},
                {"name": "Only Accept SIP Requests from Known Servers", "lang": "a_16080"},
                {"name": "SIP T1 Timeout", "lang": "a_16099"},
                {"name": "SIP T2 Interval", "lang": "a_16100"},
                {"name": "SIP Timer D Interval", "lang": "a_19803"},
                {"name": "Remove OBP from Route", "lang": "a_16101"},
                {"name": "Check Domain Certificates", "lang": "a_16102"},
                {"name": "Validate Certification Chain", "lang": "a_19336"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "codec", "lang": "a_16026", "acl": "1", "sub": [
                {"type": "p", "lang": "a_10017"},
                {"name": "DTMF", "lang": ""},
                {"name": "DTMF Payload Type", "lang": "a_16113"},
                {"name": "Preferred Vocoder", "lang": "a_16114"},
                {"name": "Codec Negotiation Priority", "lang": "a_19181"},
                {"name": "Silence Suppression", "lang": "a_16132"},
                {"name": "Voice Frames Per TX", "lang": "a_16133"},
                {"name": "G.722.1 Rate", "lang": "a_16134"},
                {"name": "G.722.1 Payload Type", "lang": "a_18563"},
                {"name": "G.722.1C Rate", "lang": "a_19005"},
                {"name": "G.722.1C Payload Type", "lang": "a_19109"},
                {"name": "Opus Payload Type", "lang": "a_19125"},
                {"name": "iLBC Frame Size", "lang": "a_16116"},
                {"name": "Use First Matching Vocoder in 200OK SDP", "lang": "a_19170"},
                {"name": "Enable Audio RED with FEC", "lang": "a_19387"},
                {"name": "Audio FEC Payload Type", "lang": "a_19388"},
                {"name": "Audio RED Payload Type", "lang": "a_19389"},
                {"name": "Enable RFC5168 Support", "lang": "a_16105"},
                {"name": "Packet retransmission", "lang" : "a_19256"},
                {"name": "Enable Video FEC", "lang": "a_16658"},
                {"name": "Video FEC Mode", "lang": "a_19111"},
                {"name": "FEC Payload Type", "lang": "a_16657"},
                {"name": "Enable FECC", "lang": "a_19020"},
                {"name": "FECC H.224 Payload Type", "lang": "a_19022"},
                {"name": "SDP Bandwidth Attribute", "lang": "a_16108"},
                {"name": "Video Jitter Buffer Maximum (ms)", "lang": "a_16146"},
                {"name": "Enable video gradual decoder refresh function", "lang": "a_19235"},
                {"name": "Preferred Video Codec", "lang": "a_16115"},
                {"name": "H.264 Image Size", "lang": "a_16118"},
                {"name": "Video Bit Rate", "lang": "a_10020"},
                {"name": "Video Frame Rate", "lang": "a_16274"},
                {"name": "H.264 Payload Type", "lang": "a_16124"},
                {"name": "Packetization mode", "lang": "a_16584"},
                {"name": "H.264 Profile Type", "lang": "a_16119"},
                {"name": "Use H.264 Constrained Profiles", "lang": "a_19253"},
                {"name": "H.265 payload type", "lang": "a_19258"},
                
                {"type": "p", "lang": "a_16640"},
                {"name": "Disable BFCP", "lang": "a_19014"},
                {"name": "Initial INVITE with Media Info", "lang": "a_19240"},
                {"name": "Presentation H.264 Image Size", "lang": "a_16214"},
                {"name": "Presentation H.264 Profile Type", "lang": "a_16215"},
                {"name": "Presentation Video Bit Rate(Kbps)", "lang": "a_16203"},
                {"name": "Presentation Video Frame Rate", "lang": "a_16205"},
                {"name": "BFCP Transport Protocol", "lang": "a_19134"},
                {"type": "p", "lang": "a_19819"},
                {"name": "SRTP Mode", "lang": "a_16128"},
                {"name": "SRTP Key Length", "lang": "a_16131"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "call", "lang": "a_16027", "sub": [
                {"name": "Remote Video Request", "lang": "a_16106", "acl": "1"},
                {"name": "Common layout mode", "lang": "a_12233"},
                {"name": "DialPlan Prefix", "lang": "a_16149"},
                {"name": "Disable DialPlan", "lang": "a_16291"},
                {"name": "DialPlan", "lang": "a_16150"},
                {"name": "Refer-To Use Target Contact", "lang": "a_16154", "acl": "1"},
                {"name": "Auto-answer", "lang": "a_1102", "acl": "1"},
                {"name": "Send Anonymous", "lang": "a_16155", "acl": "1"},
                {"name": "Reject anonymous call", "lang": "a_16156", "acl": "1"},
                {"name": "Call Log", "lang": "a_16157", "acl": "1"},
                {"name": "Special Feature", "lang": "a_16161"},
                {"name": "Feature Key Synchronization", "lang": "a_16164"},
                {"name": "Enable Call Features", "lang": "a_16165", "acl": "1"},
                {"name": "Ring Timeout", "lang": "a_16169"},
                {"name": "Use # as Dial Key", "lang": "a_16171"},
                {"name": "Upload Local MOH Audio File", "lang": "a_16180"},
                {"name": "Enable Local MOH", "lang": "a_16181"},
                {"name": "Account Ring Tone", "lang": "a_16177"},
                {"type": "p", "lang": "a_16166"},
                {"name": "Call forwarding", "lang": "a_1104"},
                {"type": "p", "lang": "a_4346"},
                {"name": "Match Incoming Caller ID", "lang": "a_16178"},
                {"name": "Distinctive Ring Tone", "lang": "a_16179"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name": "ipvtAcct", "lang": "IPVideoTalk", "sub": [
            {"name": "general", "lang": "a_16023", "sub": [
                {"name": "Enable IPVideoTalk", "lang": "a_19028"},
                {"name": "Account Active", "lang": "a_1119"},
                {"name": "Display name", "lang": "a_1126"},
                {"name": "SIP Transport", "lang": "a_16093"},
                // {"name": "Current plans", "lang": "a_9623"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "codec", "lang": "a_16026", "acl": "1", "sub": [
                {"name": "Preferred Video Codec", "lang": "a_16115"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "call", "lang": "a_16008", "sub": [
                {"name": "Auto Answer When Idle", "lang": "a_19141"},
                {"name": "Common layout mode", "lang": "a_12233"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name": "bluejeansAcct", "lang": "BlueJeans", "sub": [
            {"name": "general", "lang": "a_16023", "sub": [
                {"name": "Account Active", "lang": "a_1119"},
                {"name": "Display name", "lang": "a_1126"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "codec", "lang": "a_16026", "acl": "1", "sub": [
                {"type": "p", "lang": "a_10017"},
                {"name": "DTMF", "lang": ""},
                {"name": "DTMF Payload Type", "lang": "a_16113"},
                {"name": "Preferred Vocoder", "lang": "a_16114"},
                {"name": "Codec Negotiation Priority", "lang": "a_19181"},
                {"name": "Silence Suppression", "lang": "a_16132"},
                {"name": "Voice Frames Per TX", "lang": "a_16133"},
                {"name": "G.722.1 Rate", "lang": "a_16134"},
                {"name": "G.722.1 Payload Type", "lang": "a_18563"},
                {"name": "Use First Matching Vocoder in 200OK SDP", "lang": "a_19170"},
                {"name": "Enable Audio RED with FEC", "lang": "a_19387"},
                {"name": "Audio FEC Payload Type", "lang": "a_19388"},
                {"name": "Audio RED Payload Type", "lang": "a_19389"},
                {"type": "p", "lang": "a_10016"},
                {"name": "Enable RFC5168 Support", "lang": "a_16105"},
                {"name": "Packet retransmission", "lang" : "a_19256"},
                {"name": "Enable Video FEC", "lang": "a_16658"},
                {"name": "FEC Payload Type", "lang": "a_16657"},
                {"name": "SDP Bandwidth Attribute", "lang": "a_16108"},
                {"name": "Video jitter buffer maximum (ms)", "lang": "a_16146"},
                {"name": "H.264 Image Size", "lang": "a_16118"},
                {"name": "Video Bit Rate", "lang": "a_10020"},
                {"name": "Video Frame Rate", "lang": "a_16274"},
                {"name": "H.264 Payload Type", "lang": "a_16124"},
                {"name": "Packetization mode", "lang": "a_16584"},
                {"name": "H.264 Profile Type", "lang": "a_16119"},
                {"name": "Use H.264 Constrained Profiles", "lang": "a_19253"},
                {"type": "p", "lang": "a_16640"},
                {"name": "Disable BFCP", "lang": "a_19014"},
                {"name": "Initial INVITE with Media Info", "lang": "a_19240"},
                {"name": "Presentation H.264 Image Size", "lang": "a_16214"},
                {"name": "Presentation H.264 Profile", "lang": "a_16215"},
                {"name": "Presentation video bit rate", "lang": "a_16203"},
                {"name": "Presentation Video Frame Rate", "lang": "a_16205"},
            ]},
            {"name": "call", "lang": "a_16008", "sub": [
                {"name": "Call Log", "lang": "a_16157", "acl": "1"},
                {"name": "Use # as Dial Key", "lang": "a_16171"},
                {"name": "Upload Local MOH Audio File", "lang": "a_16180"},
                {"name": "Enable Local MOH", "lang": "a_16181"},
                {"name": "Common layout mode", "lang": "a_12233"}
            ]}
        ]},


        {"name": "h323mode", "lang": "H.323", "sub": [
            {"name": "general", "lang": "a_16023", "sub": [
                {"name": "Account Active", "lang": "a_1119"},
                {"name": "Enable GK", "lang": "a_19120"},
                {"name": "Enable H.460", "lang": "a_19204"},
                {"name": "GK Discover Mode", "lang": "a_19122"},
                {"name": "GK address", "lang": "a_19116"},
                {"name": "Site Number", "lang": "a_19117"},
                {"name": "GK Authentication Username", "lang": "a_19118"},
                {"name": "GK Authentication Password", "lang": "a_19119"},
                {"name": "Register expiration (Min.)", "lang": "a_16069"},
                {"name": "H.323 Local Port", "lang": "a_19210"},
                {"name": "Symmetric RTP", "lang": "a_16096"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "codec", "lang": "a_16026", "acl": "1", "sub": [
                {"name": "DTMF", "lang": ""},
                {"name": "Preferred Vocoder", "lang": "a_16114"},
                {"name": "H.264 Image Size", "lang": "a_16118"},
                {"name": "Video Bit Rate", "lang": "a_10020"},
                {"name": "Video Frame Rate", "lang": "a_16274"},
                {"name": "H.264 Payload Type", "lang": "a_16124"},
                {"name": "Packetization mode", "lang": "a_16584"},
            ]},
            {"name": "call", "lang": "a_16008", "sub": [
                {"name": "Auto-answer", "lang": "a_autoans", "acl": "1"},
                {"name": "Enable H225 Keep-Alive", "lang": "a_19160", "acl": "1"},
                {"name": "Enable H245 Keep-Alive", "lang": "a_19161"},
                {"name": "Enable RTDR", "lang": "a_19192"},
                {"name": "Common layout mode", "lang": "a_12233"}
            ]}
        ]}
    ]},
    {"name": "callset", "lang": "call_setting", "sub": [
        {"name": "general", "lang": "a_16023", "sub": [
            {"name": "conventional", "lang": "a_16007", "sub": [
                {"name": "Local RTP Port", "lang": "a_16280"},
                {"name": "Use Random Port", "lang": "a_16281", "oem": "54"},
                {"name": "Keep-alive Interval", "lang": "a_16282"},
                {"name": "STUN/TURN server", "lang": "a_16283"},
                {"name": "TURN Server Username", "lang": "a_19026"},
                {"name": "TURN Server Password", "lang": "a_19027"},
                {"name": "Use NAT IP", "lang": "a_16284"},
                // {"name": "Disable remote control app connect", "lang": "a_16283"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name": "callfeatures", "lang": "a_16027", "sub": [
            {"name": "callfeatures", "lang": "a_16027", "sub": [
                {"type": "p", "lang" : "a_10017"},
                {"name": "Disable Call-Waiting Tone", "lang": "a_16290"},
                {"name": "Disable DND Reminder Ring", "lang": "a_16292"},
                {"name": "Auto Mute on Entry", "lang": "a_19328"},

                {"type": "p", "lang" : "a_10016"},
                {"name": "Escape '#' as %23 in SIP URI", "lang": "a_16300"},
                {"name": "Disable in-call DTMF display", "lang": "a_16279"},
                {"name": "Filter Characters", "lang": "a_19112"},
                {"name": "Disable Call-Waiting", "lang": "a_16641"},
                {"name": "Disable Direct IP Call", "lang": "a_16293"},
                {"type": "button", "lang": "a_17"}
            ]},
        ]},
        {"name": "sitename", "lang": "a_16225", "sub": [
            {"name": "sitenameset", "lang": "a_16013", "sub": [
                {"name": "sitename", "lang": "a_16225"},
                {"name": "Background Transparency", "lang": "a_16221"},
                {"name": "Display Position", "lang": "a_16226"},
                {"name": "Display Duration", "lang": "a_16231"},
                {"name": "Font Color", "lang": "a_16234"},
                {"name": "Font Size", "lang": "a_16235"},
                {"name": "Bold", "lang": "a_16237"},
                {"name": "Horizontal Offset", "lang": "a_16610"},
                {"name": "Vertical Offset", "lang": "a_16611"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name": "audio", "lang": "advanced_ring", "sub": [
            {"name": "audio", "lang": "advanced_ring", "sub": [
                {"name": "Echo Delay", "lang": "a_19246"},
                {"name": "Ringtone volume", "lang": "a_16254"},
                {"name": "Media volume", "lang": "a_16636"},
                {"name": "Device ringtone", "lang": "a_12082"},
                {"name": "Notification ringtone", "lang": "a_12083"},
                {"name": "Audio Device", "lang": "a_19127"},
                // {"name": "Alarm volume", "lang": "a_19017"},
                {"name": "Ring Back Tone", "lang": "a_16306"},
                {"name": "Busy Tone", "lang": "a_16307"},
                {"name": "Reorder Tone", "lang": "a_16308"},
                {"name": "Confirmation Tone", "lang": "a_16309"},
                {"name": "Ring cadence", "lang": "a_16313"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name": "video", "lang": "a_16009", "sub": [
            {"name": "video", "lang": "a_16009", "sub": [
                {"name": "Start video automatically", "lang": "a_16151"},
                {"name": "Video Display Mode", "lang": "a_19365"},
                {"name": "Enable Frame Skipping in Video Decoder", "lang": "a_16276"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]}
    ]},
    {"name": "network", "lang": "a_16024", "sub": [
        {"name": "ethernet", "lang": "a_4120",  "sub": [
                {"name": "ethernet", "lang": "a_4120",  "sub": [
                    {"name": "Preferred Internet Protocol", "lang": "a_19225"},
                    {"type": "p", "lang": ""},
                    {"name": "Address Type", "lang": "a_19659"}, //
                    {"name": "DHCP VLAN Override", "lang": "a_19335"}, //
                    {"name": "Host name", "lang": "a_16187"}, //
                    {"name": "Vendor Class ID", "lang": "a_16189"}, //
                    {"name": "IP Address", "lang": "a_23531"}, //
                    {"name": "Subnet Mask", "lang": "a_4127"},//
                    {"name": "Default Gateway", "lang": "a_16191"},//
                    {"name": "DNS Server 1", "lang": "a_19227"},//
                    {"name": "DNS Server 2", "lang": "a_19228"},//
                    {"name": "PPPoE Account ID", "lang": "a_4156"},//
                    {"name": "PPPoE Password", "lang": "a_4157"},//
                    {"name": "Layer 2 QoS 802.1Q/VLAN Tag (Ethernet)", "lang": "a_19660"}, //
                    {"name": "Layer 2 QoS 802.1p Priority Value (Ethernet)", "lang": "a_19661"}, //
                    {"type": "p", "lang": ""},
                    {"name": "IPv6 Address", "lang": "a_19226"},
                    {"name": "Static IPv6 Address", "lang": "a_19309"},
                    {"name": "IPv6 Prefix length", "lang": "a_19310"},
                    {"name": "IPv6 DNS Server 1", "lang": "a_19227"},
                    {"name": "IPv6 DNS Server 2", "lang": "a_19228"},
                    {"name": "Preferred DNS Server", "lang": "a_19229"},
                    {"type": "p", "lang": "a_4140"},
                    {"name": "802.1X mode", "lang": "a_4140"},//
                    {"name": "802.1X Identity", "lang": "a_16195"},//
                    {"name": "802.1X Secret", "lang": "a_16196"},//
                    {"name": "CA Certificate", "lang": "a_19667"},//
                    {"name": "Client Certificate", "lang": "a_4392"},//
                    {"name": "Private Key", "lang": "a_4394"},//
                    {"type": "button", "lang": "a_17"}
                ]}
        ]},
        {"name": "wifi", "lang": "a_wifiset", "sub": [
            {"name": "basics", "lang": "a_wifinormal", "sub": [
                {"name": "Preferred Internet Protocol", "lang": "a_protocoltype"},
                {"name": "Wi-Fi Function", "lang": "a_wififunc"},
                {"name": "Wi-Fi Band", "lang": "a_wifiFrequency"},
                {"name": "ESSID", "lang": "ESSID"}
            ]},
            {"name": "security", "lang": "a_wifiauth", "sub": [
                {"name": "ESSID", "lang": "ESSID"},
                {"name": "Password", "lang": "a_password"},
                {"name": "Security Mode for Hidden SSID", "lang": "a_hiddenauthmode"}
            ]},
            {"name": "advanced", "lang": "advanced_menu", "sub": [
                // {"name": "Layer 2 QoS 802.1p Priority Value (Wi-Fi)", "lang": "a_layer2qospvwifi"},
                {"name": "Country Code", "lang": "a_countrycode" },
                {"name": "Host Name", "lang": "a_dhcpop12", "product": "2"},
                {"name": "Vendor Class ID", "lang": "a_dhcpop60", "product": "2"},
                {"type": "button", "lang": "a_save"}
            ]},
            {"name": "roaming", "lang": "a_wifiroaming", "product": "1,2", "sub": [
                {"name": "Signal Threshold", "lang": "a_signalthreshold"},
                {"name": "Good Signal Scan Interval (s)", "lang": "a_roaminggoodinterval"},
                {"name": "Poor Signal Scan Interval (s)", "lang": "a_roamingpoorinterval"}
            ]}
        ]},
        {"name": "openvpn", "lang": "a_19274", "sub": [
            {"name": "openvpn", "lang": "a_19274", "sub": [
                {"name": "OpenVPN Enable", "lang": "a_19265"},
                {"name": "OpenVPN Ｍode", "lang": "openvpn_type"},
                {"name": "OpenVPN Upload", "lang": "OpenVPNUpload"},
                {"name": "OpenVPN Server Address", "lang": "a_19266"},
                {"name": "OpenVPN Port", "lang": "a_19267"},
                {"name": "OpenVPN Transport", "lang": "a_19268"},
                {"name": "OpenVPN CA", "lang": "a_19668"},
                {"name": "OpenVPN Client Certificate", "lang": "a_19269"},
                {"name": "OpenVPN Client Key", "lang": "a_19270"},
                {"name": "OpenVPN Cipher Method", "lang": "a_19271"},
                {"name": "OpenVPN Username", "lang": "a_19272"},
                {"name": "OpenVPN Password", "lang": "a_19273"}
            ]}
        ]},
        {"name": "common", "lang": "a_19655", "sub": [
            {"name": "advanced", "lang": "a_19655", "sub": [
                {"type": "p", "lang": "a_19655"},
                {"name": "Alternate DNS Server", "lang": "a_16652"},
                {"name": "Second Alternate DNS Server", "lang": "a_19656"},
                {"name": "Enable LLDP", "lang": "a_16193"},
                {"name": "Enable CDP", "lang": "a_19286"},
                {"name": "Layer 3 QoS for SIP", "lang": "a_4275"},
                {"name": "Layer 3 QoS for Audio", "lang": "a_4276"},
                {"name": "Layer 3 QoS for Video", "lang": "a_4277"},
                {"name": "HTTP/HTTPS User-Agent", "lang": "a_16194"},
                {"name": "SIP User-Agent", "lang": "a_19128"},
                {"type": "p", "acl": "1", "lang": "a_16651"},
                {"name": "HTTP/HTTPS Proxy Hostname", "lang": "a_16198"},
                {"name": "HTTP/HTTPS Proxy Port", "lang": "a_16199"},
                {"name": "Bypass Proxy For", "lang": "a_16200"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]}
    ]},
    {"name": "sysset", "lang": "a_411", "sub": [
        {"name": "power", "lang": "a_12020", "sub": [
            {"name": "power", "lang": "a_12020", "sub": [
                {"name": "Timeout Options", "lang": "a_19321"},
                {"name": "Timeout Setup", "lang": "a_19322"},
                {"name": "Reboot", "lang": "a_19324"},
                {"name": "Sleep", "lang": "a_16375"},
                {"name": "Shutdown", "lang": "a_19325"},
            ]}
        ]},
        {"name": "timeandlang", "lang": "a_16626", "sub": [
            {"name": "Time Settings", "lang": "a_4030", "sub": [
                {"name": "Assign NTP Server Address 1", "lang": "a_12065"},
                {"name": "Assign NTP Server Address 2", "lang": "a_12065"},
                {"name": "Set Date", "lang": "a_16202"},
                {"name": "Set Time", "lang": "a_9067"},
                {"name": "Time Zone", "lang": "a_23527"},
                {"name": "DHCP Option 42 Override NTP Server", "lang": "a_16206"},
                {"name": "DHCP Option 2 to override Time Zone setting", "lang": "a_16207"},
                {"name": "Use 24-hour format", "lang": "a_16208"},
                {"name": "Date Display Format", "lang": "a_16209"},
                {"name": "Language selection", "lang": "a_8113"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "Language", "lang": "a_23526", "sub": [
                {"name": "Language selection", "lang": "a_8113"},
                {"name": "Select language file", "lang": "a_19023"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name": "TR-069", "lang": "a_16034", "sub": [
            {"name": "TR-069", "lang": "a_16034", "sub": [
                {"name": "Enable TR-069", "lang": "a_16360"},
                {"name": "ACS URL", "lang": "a_16365"},
                {"name": "ACS Username", "lang": "a_16366"},
                {"name": "ACS Password", "lang": "a_16367"},
                {"name": "Enable periodic inform", "lang": "a_16368"},
                {"name": "Periodic Inform Interval", "lang": "a_16369"},
                {"name": "Connection Request Username", "lang": "a_16370"},
                {"name": "Connection Request Password", "lang": "a_16371"},
                {"name": "Connection Request Port", "lang": "a_16372"},
                {"name": "CPE Cert File", "lang": "a_16373"},
                {"name": "CPE Cert Key", "lang": "a_16374"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name": "security", "lang": "a_4221", "sub": [
            {"name": "Web/SSH access", "acl": "1", "lang": "a_16029", "sub": [
                {"name": "Disable SSH", "lang": "a_16316"},
                {"name": "Access Method", "lang": "a_12057"},
                {"name": "Port number", "lang": "a_9207"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "User Info Management", "acl": "1", "lang": "a_19806", "sub": [
                {"name": "Current Admin Password", "lang": "a_19008"},
                {"name": "New admin password", "lang": "a_16317", "acl": "1"},
                {"name": "Confirm Admin Password", "lang": "a_16318", "acl": "1"},
                {"name": "New user password", "lang": "a_16319"},
                {"name": "Confirm User Password", "lang": "a_16320"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "Screen lock password", "acl": "1", "lang": "a_23547", "sub": [
                {"name": "Delete Screen Lock Password", "lang": "a_9690"},
                {"name": "Screen Lock Password", "lang": "a_9688"},
                {"name": "Confirm Screen Lock Password", "lang": "a_9689"},
                {"type": "button", "lang": "a_17"}

            ]},
            {"name": "SIP TLS", "acl": "1", "lang": "SIP TLS", "sub": [
                {"name": "SIP TLS Certificate", "lang": "a_16285"},
                {"name": "SIP TLS Private Key", "lang": "a_16286"},
                {"name": "SIP TLS Private Key Password", "lang": "a_16287"},
                {"type": "button", "lang": "a_17"}
                
            ]},
            {"name": "Certificate Management", "acl": "1", "lang": "a_19807", "sub": [
                {"name": "CA Certificate", "lang": "a_4391"},
                {"name": "Custom certificate", "lang": "a_19282"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]}
    ]},
    {"name":"devicecontrol","lang":"a_device_control","sub":[
        {"name":"cameracontrol","lang":"a_10121", "sub":[
            {"name":"cameracontrol","lang":"a_10121", "sub":[
                {"name": "Move Speed", "lang": "a_16606"},
                {"name": "The Initial Position", "lang": "a_initial_position"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name":"ptz","lang":"a_ptz", "sub":[
            {"name":"ptz","lang":"a_ptz", "sub":[
                {"name": "Camera Preset", "lang": "a_10024"},
                {"name": "PTZ Control", "lang": "a_16592"},
                {"name": "Adjusting Local Video Effects", "lang": "a_image_setting"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name":"peripheral","lang":"a_16590", "sub":[
            {"name":"peripheral","lang":"a_16590", "sub":[
                {"type": "p", "lang": "a_12152"},
                {"name": "HDMI 1 Out Resolution", "lang": "a_19341"},
                {"name": "HDMI 2 Out Resolution", "lang": "a_19342"},
                {"name": "Enable Auto Presentation When HDMI Plugged", "lang": "a_enablepreauto"},
                {"type": "p", "lang": "a_10007"},
                {"name": "Move speed", "lang": "a_16606"},
                {"name": "Initial position", "lang": "a_16607"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name":"remotecontrol","lang":"a_19043", "sub":[
            {"name":"remotecontrol","lang":"a_19043", "sub":[
                {"name": "Disable Remote Control App Connection", "lang": "a_remoteappconnect"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]}
    ]},
    {"name": "sysapp", "lang": "system_app", "sub": [
        {"name": "ldap", "lang": "a_8409", "sub": [
            {"name": "ldap", "lang": "a_8409", "sub": [
                {"name": "Connection Mode", "lang": "a_15022"},
                {"name": "Server Address", "lang": "a_6755"},
                {"name": "Port", "lang": "a_9207"},
                {"name": "Base DN", "lang": "a_6757"},
                {"name": "LDAP User Name", "lang": "a_19670"},
                {"name": "LDAP Password", "lang": "a_6759"},
                {"name": "LDAP Name Attributes", "lang": "a_6764"},
                {"name": "LDAP Number Attributes", "lang": "a_6765"},
                {"name": "LDAP Mail Attributes", "lang": "a_6766"},
                {"name": "LDAP Name Filter", "lang": "a_6774"},
                {"name": "LDAP Number Filter", "lang": "a_6775"},
                {"name": "LDAP Mail Filter", "lang": "a_6776"},
                // {"name": "Search Field Filter", "lang": "a_searchfieldfilter"},
                {"name": "LDAP Displaying Name Attributes", "lang": "a_6767"},
                {"name": "Max Hits", "lang": "a_6760"},
                {"name": "Search Timeout", "lang": "a_6763"},
                {"name": "LDAP Lookup For Dial", "lang": "a_6769"},
                {"name": "LDAP Lookup For Incoming Call", "lang": "a_6770"},
                {"name": "LDAP Dialing Default Account", "lang": "a_19671"},
                {"type": "button", "lang": "a_17"}
            ]}
        ]},
        {"name": "record", "lang": "a_12098", "sub": [
            {"name": "call", "lang": "a_12098", "sub": [
                {"type": "button", "lang": "a_21"}
            ]},
            {"name": "normal", "product": "1,2", "lang": "a_12098", "sub": [
                {"type": "button", "lang": "a_21"}
            ]}
        ]}
    ]},
    {"name": "maintenance", "lang": "maintenance_menu", "sub": [
        {"name": "upgrade", "lang": "maintenance_upgrade", "sub": [
            {"name": "upgrade", "lang": "a_1605", "sub": [
                {"name": "Complete Upgrade", "lang": "a_16648"},
                {"name": "Upload Firmware File to Update", "lang": "a_16328"},
                {"name": "Config upgrade mode", "lang": "a_19176"},
                {"name": "Firmware Server Path", "lang": "a_4113"},
                {"name": "HTTP/HTTPS username", "lang": "a_4111"},
                {"name": "HTTP/HTTPS password", "lang": "a_4112"},
                {"name": "Firmware File Prefix", "lang": "a_16330"},
                {"name": "Firmware File Postfix", "lang": "a_16331"},


                // {"name": "Firmware Upgrade Via", "lang": "a_19175"},
                // {"name": "Config Server Path", "lang": "a_4114"},
                // {"name": "Firmware HTTP/HTTPS User Name", "lang": "a_4111"},
                // {"name": "Firmware HTTP/HTTPS Password", "lang": "a_4112"},
                // {"name": "Config HTTP/HTTPS Password", "lang": "a_4112"},
                // {"name": "Hour of the Day(0-23)", "lang": "a_hourofday"},
                // {"name": "Firmware Upgrade and Provisioning", "lang": "a_autouprule"},
                // {"name": "Auto Reboot to Upgrade Without Prompt", "lang": "a_16329"},
                // {"name": "Allow DHCP Option 43 and Option 66 to Override Server", "lang": "a_16337"},
                {"type": "button", "lang": "a_17"}
            ]},
            {
                "name": "Config File", "lang": "a_19820", "sub": [
                    {"type": "p", "lang": "a_19180"},
                    {"name": "Use Grandstream GAPS", "lang": "a_19213", "oem": "70"},
                    {"name": "Config HTTP/HTTPS User Name", "lang": "a_19177"},
                    {"name": "Config HTTP/HTTPS Password", "lang": "a_19178"},
                    {"name": "Always send HTTP Basic Authentication Information", "lang": "a_16352"},
                    {"name": "Config File Prefix", "lang": "a_16332"},
                    {"name": "Config File Postfix", "lang": "a_16333"},
                    {"name": "Authenticate Conf File", "lang": "a_16347"},
                    {"name": "XML Config File Password", "lang": "a_16327"},
                    {"name": "Download Device Configuration", "lang": "a_16351"},
                    {"name": "Upload Device Configuration", "lang": "a_19184"},
                    {"type": "p", "lang": "a_19203"},
                    {"name": "GUI customization file download mode", "lang": "a_19200"},
                    {"name": "GUI customization file URL", "lang": "a_19199"},
                    {"name": "GUI customization file HTTP/HTTPS username", "lang": "a_19201"},
                    {"name": "GUI customization file HTTP/HTTPS password", "lang": "a_19202"},
                    {"name": "Use Configurations of Config File Server", "lang": "a_19224"},
                    {"type": "button", "lang": "a_17"}

                ]
            },
            {
                "name": "Provision", "lang": "", "sub": [
                    {"type": "p", "lang": "a_16340"},
                    {"name": "Automatic Upgrade", "lang": "a_16340"},
                    {"name": "Automatic upgrade hour", "lang": "a_16345"},
                    {"name": "Firmware upgrade and configuration file detection", "lang": "a_4107"},
                    {"name": "Upgrade without prompt", "lang": "a_16329"},
                    {"type": "p", "lang": "a_19702"},
                    {"name": "Config provision", "lang": "a_19702"},
                    {"type": "button", "lang": "a_17"}
                ]
            },
            {
                "name": "Advanced settings", "lang": "", "sub": [
                    {"name": "Disable SIP NOTIFY Authentication", "lang": "a_19013"},
                    {"name": "Validate Server Certificate", "lang": "a_19336"},
                    {"name": "mDNS Override Server", "lang": "a_16334"},
                    {"name": "Allow DHCP option 43, 160 and 66 to override server", "lang": "a_16337"},
                    {"name": "Additional Override DHCP Option", "lang": "a_19706"},
                    {"name": "DHCP option 120 override SIP server", "lang": "a_16338"},
                    {"name": "3CX Auto Provision", "lang": "a_16339"},
                    {"name": "Factory Reset", "lang": "a_4105"},
                    {"type": "button", "lang": "a_17"}

                ]
            }
        ]},
        {"name": "diagnosis", "lang": "a_19822", "sub": [
            {"name": "syslog", "acl": "1", "lang": "a_4144", "sub": [
                {"name": "Syslog protocol", "lang": "a_12200"},
                {"name": "Syslog server address", "lang": "a_4135"},
                {"name": "Syslog Level", "lang": "a_4136"},
                {"name": "Syslog keyword filter", "lang": "a_12201"},
                {"name": "H.323 syslog level", "lang": "a_19139"},
                {"type": "button", "lang": "a_17"}
            ]},
            {"name": "logcat", "lang": "a_16030", "sub": [
                {"name": "Clear Log", "lang": "a_16353"},
                {"name": "Log Tag", "lang": "a_16354"},
                {"name": "Log Priority", "lang": "a_16355"},
                {"type": "button", "lang": "a_17"}
                // {"name": "Get Log", "lang": "a_16356"}
            ]},
            {"name": "debug", "lang": "a_16031", "sub": [
                {"type": "p", "lang": "a_19277"},
                {"name": "One-click debugging", "lang": "a_19277"},
                {"name": "Debug info menu", "lang": "a_19280"},
                {"name": "Debug info list", "lang": "a_16359"},
                {"name": "View debug info", "lang": "a_16358"},
                {"type": "p", "lang": "a_19823"},
                {"name": "Enable core dump generation", "lang": "a_19262"},
                {"name": "Core dump list", "lang": "a_19263"},
                {"name": "View core dump", "lang": "a_19264"},
                {"type": "p", "lang": "a_410"},
                {"name": "Record", "lang": "a_410"},
                {"name": "Recording list", "lang": "a_19260"},
                {"name": "View recording", "lang": "a_19261"},
                {"type": "button", "lang": "a_17"}

            ]},
            {"name": "traceroute", "lang": "a_16628", "sub": [
                {"name": "Target Host", "lang": "a_16629"}
            ]},
            {"name": "devmode", "lang": "a_4347", "sub": [
                {"name": "Developer Mode", "lang": "a_4347"}
            ]},
            {"name": "ping", "acl": "1", "lang": "maintenance_ping", "sub": [
                {"name": "Target Host", "lang": "a_16629"}
            ]},
            {"name": "NSLookup", "acl": "1", "lang": "a_19814", "sub": [
                {"name": "Host Name", "lang": "a_19815"}
            ]},
        ]}
    ]},
    {"name": "status", "lang": "a_10060", "sub": [
        {"name": "acct", "lang": "a_4306", "sub": [
            {"name": "Account", "lang": "a_301"},
            {"name": "Number", "lang": "a_10006"},
            {"name": "SIP Server", "lang": "a_23536"},
            {"name": "Status", "lang": "a_10060"}
        ]},
        {"name":"peripheral","lang":"a_16590", "sub":[
            {"name": "HDMI In", "lang": "HDMI In"},
            {"name": "HDMI 1", "lang": "HDMI 1"},
            {"name": "HDMI 2", "lang": "HDMI 2"},
            {"name": "USB Port", "lang": "a_usbport"},
            {"name": "External Speakerphone", "lang": "a_extspeakerph"},
            {"name": "SD Card", "lang": "a_sd"}
        ]},
        {"name": "network", "lang": "a_4147", "sub": [
            {"name": "MAC Address", "lang": "a_16403"},
            {"name": "NAT Type", "lang": "a_4155"},
            {"name": "Address Type", "lang": "a_4150"},
            {"name": "IP Address", "lang": "a_4313"},
            {"name": "Subnet Mask", "lang": "a_4127"},
            {"name": "Default Gateway", "lang": "a_16191"},
            {"name": "DNS Server 1", "lang": "a_19227"},
            {"name": "DNS Server 2", "lang": "a_19228"},
        ]},
        {"name": "system", "lang": "a_4148", "sub": [
            {"name": "system", "lang": "a_4148",  "sub": [
                {"name": "Product Model", "lang": "a_16404"},
                {"name": "Hardware Revision", "lang": "a_4134"},
                {"name": "Part Number", "lang": "a_16406"},
                {"name": "System Version", "lang": "a_4130"},
                {"name": "Recovery Version", "lang": "a_4131"},
                {"name": "Boot Version", "lang": "a_16408"},
                {"name": "Kernel Version", "lang": "a_16416"},
                {"name": "Android Version", "lang": "a_16415"},
                {"name": "CPE Version", "lang": "a_4253"},
                {"name": "System Up Time", "lang": "a_16417"}
            ]}
        ]},
        {"name": "remotecontrolstatus", "lang": "a_16631", "sub": [
            {"name": "remotecontrolstatus", "lang": "a_16631",  "sub": [
                {"name": "Hardware Version", "lang": "a_4134"},
                {"name": "Software Version", "lang": "a_16633"},
                {"name": "Patch Version", "lang": "a_12215"},
                {"name": "Remote Battery", "lang": "a_16634"}
            ]}
        ]}
    ]}
]
