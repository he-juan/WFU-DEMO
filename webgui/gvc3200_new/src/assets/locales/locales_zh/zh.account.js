/**
 * 账号下所有配置项的词条以及对应的tips词条
 */
export default {
  acct_001: '帐号激活',
  acct_001_tip: '此项指出帐号是否被激活。H.323帐号默认不激活，其他帐号默认激活。',

  acct_002: '帐号名称',
  acct_002_tip: '与帐号对应的帐号名称，显示在设备上。',

  acct_003: 'SIP服务器',
  acct_003_tip: 'SIP服务器的IP地址或URL，由VoIP服务提供商提供。',

  acct_004: '备用SIP服务器',
  acct_004_tip: '设置备用SIP服务器的IP地址或URL。当首选SIP服务器失效时，话机将使用该备用SIP服务器。',

  acct_005: '第三SIP服务器',
  acct_005_tip: '设置第三SIP服务器的IP地址或URL。当备用SIP服务器失效时，话机将使用该第三SIP服务器。',

  acct_006: 'SIP用户ID',
  acct_006_tip: '用户帐号信息，由VoIP服务提供商提供，通常与电话号码形式相似或者就是实际的电话号码。',

  acct_007: 'SIP认证ID',
  acct_007_tip: 'SIP服务器电话用户用于验证的验证ID。可以与用户ID相同或不同。',

  acct_008: 'SIP认证密码',
  acct_008_tip: 'SIP电话用户向SIP服务器注册时使用的密码。输入的密码不以明文显示。',

  acct_009: '显示名称',
  acct_009_tip: 'SIP电话用户作为主叫时，显示在被叫方设备上的来电名称。可选项，可不填。',

  acct_010: '语音信箱接入号',
  acct_010_tip: '当配置了该项时，用户能够按设备上的MESSAGE按键拨打至语音信箱。这个号码通常是语音信箱入口接入码。例如：Asterisk服务器的语音信箱接入号为8500。',

  acct_011: '电话 URI',
  acct_011_tip: '若设备有指定的PSTN电话号码，该项应设置为“User=Phone”。此时设备在指示E.164号码时发送的SIP请求头文件中将附上“User=Phone”这一字段。若设置为“启用”，在发送SIP请求时“Tel:”将会替换“SIP:”。默认设置该项禁用。',

  acct_012: '出局代理',
  acct_012_tip: '配置出局代理服务器、多媒体网关或会话边界控制器的IP地址或URL。该配置用于不同网络环境的防火墙或NAT穿透。当系统检测到对称NAT时，STUN不能工作，此时出局服务器可以提供对称NAT的解决方案。',

  acct_013: '备用出局代理',
  acct_013_tip: '配置备用出局代理服务器、多媒体网关或会话边界控制器的IP地址或URL。当出局代理不能正常工作时使用备用出局代理。',

  acct_014: 'DNS模式',
  acct_014_tip: '设置将域名解析成IP地址的方式，共有A Record,SRV, NATPTR/SRV三种方式可供选择。默认设置成“A Record”。若用户要使用DNS SRV定位服务器，可选择“SRV”或“NATPTR/SRV”模式。',

  acct_015: 'NAT检测',
  acct_015_tip: '此参数决定NAT穿透机制是否被激活。<br /> <br />如果设置为“STUN”并且指定了STUN服务器地址，检测将会根据STUN服务器来运行。如果检测到的NAT类型为Full Cone、Restricted Cone或Port-Restricted Cone时，设备将在它所有的SIP和SDP信息中尝试使用公共IP地址和端口。<br /> <br />如果该项设置为“发送保活报文”,设备将会定时向SIP服务器发送空SDP包以保持NAT访问的端口处于打开状态。<br/>如果使用出口代理服务器，那么请设置为“ NAT NO”。<br /> <br />如果用户使用了OpenVPN，请设置为“OpenVPN”。<br /> <br />如果用户的路由器支持UPnP，可以设置为“UPnP”。<br /> <br />若设置为“自动”，设备将会尝试以上所有NAT穿透方式，直至找到可用的。<br /> <br />如果设置为“TURN”并且指定了TURN服务器地址，检测将会根据TURN服务器来运行。默认设置成“发送保活报文”。',

  acct_016: '使用代理',
  acct_016_tip: '填写SIP代理用以通知SIP服务器该设备在NAT或防火墙后面。若配置此项，请确保您所使用的SIP服务器支持该功能。',

  acct_017: 'SIP注册',
  acct_017_tip: '此项设置设备是否给代理或服务器发送SIP注册报文。默认设置为“是”。',

  acct_018: '重新注册前注销',
  acct_018_tip: '此项如果设置为“否”, 则不注销SIP用户注册信息, 如果设置为“全部”，在SIP注销报文Contact头域时将使用“*”来注销此帐号的所有注册信息，如果设置为“Instance”，则仅注销当前设备IP的注册信息。默认为“Instance”。',

  acct_019: '注册期限(分钟)',
  acct_019_tip: '此参数允许用户设定设备更新注册的频率（分钟）。默认时间间隔为60分钟（1小时）。最大时间间隔为64800分钟（大约45天）。最小值为1分钟。',

  acct_020: '注册期限内重新注册等待时间(秒)',
  acct_020_tip: '设置话机在注册期限内，重新发送注册请求的等待时间。有效值范围0至64800秒。',

  acct_021: '订阅超时(分钟)',
  acct_021_tip: '此项用于设置设备使用指定的注册服务器刷新其订阅的时间周期（分钟）。最小值为1分钟，最大值为64800分钟（大约45天）。',

  acct_022: '重试注册间隔时间(秒)',
  acct_022_tip: '注册失败重试间隔时间，默认20秒。',

  acct_023: '本地SIP端口',
  acct_023_tip: '该项设置设备监听和传输的本地SIP端口。默认值为5060。',

  acct_024: '支持MWI',
  acct_024_tip: '当该项设为“是”时，设备将会周期性发送语音留言的订阅消息（SUBSCRIBE）给服务器，服务器将会返回NOTIFY信息给设备。设备支持同步或异步的MWI。默认设置为“否”。',

  acct_025: '开启会话超时',
  acct_025_tip: '设置是否启用会话超时功能，若启用，则会根据下方的“会话超时时间”设置发送会话超时的相关参数，若设为为“否”，则将不会使用会话超时。默认设置为“是”。',

  acct_026: '会话超时时间(秒)',
  acct_026_tip: 'SIP会话期限是在没有成功的SIP会话刷新事务发生的前提下，会话从开始到被认为会话超时的SIP会话的时间，默认值是180秒。<br />SIP 会话计时通过SIP请求使SIP session周期性地刷新（UPDATE或re-INVITE。一旦session期满，如果通过UPDATE或 re-INVITE信息没有刷新，则session终止。）<br />会话超时时间是指在没有成功的刷新处理发生时会话被认定为超时的时间（秒）。',

  acct_027: '最小超时时间(秒)',
  acct_027_tip: '最小会话超时时间 (以秒为单位)，默认为90秒。',

  acct_028: 'UAC指定刷新对象',
  acct_028_tip: '作为主叫方,选择UAC使用设备做为刷新器；或选择UAS使用被叫方或代理服务器做为刷新器。当设置为“Omit”时，即不指定刷新对象。',

  acct_029: 'UAS指定刷新对象',
  acct_029_tip: '作为被叫方，选择UAC使用主叫方或代理服务器作为刷新器，或选择UAS使用设备刷新器。',

  acct_030: '强制INVITE',
  acct_030_tip: '会话计时可以选择使用INVITE或UPDATE方式进行刷新。若选择“是”，则使用INVITE方法刷新会话计时。',

  acct_031: '主叫请求计时',
  acct_031_tip: '若选择为“是”，当远端支持会话计时，设备将会在拨打电话时使用会话计时。默认为“否”。',

  acct_032: '被叫请求计时',
  acct_032_tip: '若选择为“是”，当接入有会话计时请求的电话时，设备会使用会话计时。默认为“否”。',

  acct_033: '强制计时',
  acct_033_tip: '若选择为“是”，则即使远端不支持会话计时，设备也会使用会话计时。若选择为“否”，则仅当远端支持会话计时时才允许设备启用会话计时。<br />主叫请求计时、被叫请求计时和强制计时这几项全部选择为“否”可关闭会话计时。',

  acct_034: '开启100rel',
  acct_034_tip: 'PRACK方法能够使SIP临时响应(1xx系列)为可靠的。这对于PSTN网络是必要的。为了调用有效的临时响应，信令消息的请求头文件中需要加上100rel标签。',

  acct_035: '来电ID显示',
  acct_035_tip: '当设为"自动"时，设备依次在SIP INVITE消息的P-Asserted Identity Header、Remote-Party-ID Header、From Header中查找caller ID。当设为"禁用"时，所有来电caller ID将显示为"Unavailable"。当设为"From头域"时，使用From头域中的Caller ID。',

  acct_036: '使用Privacy头域',
  acct_036_tip: '控制Privacy头域是否将出现在SIP INVITE消息中。头域中包含是否隐藏主叫号码的信息。当设置为“默认”时，仅当华为IMS的特殊功能开启后Privacy头域才不会出现在SIP INVITE消息中。当设置为“是”时，SIP INVITE消息将会一直显示Privacy头域。当设置为“否”时，SIP INVITE消息将不显示Privacy头域。默认设置为“默认”。',

  acct_037: '使用P-Preferred-Identity头域',
  acct_037_tip: '控制是否P-Preferred-Identity头域将出现在SIP INVITE消息中。仅当华为IMS的特殊功能开启后P-Preferred-Identity头域才会出现在SIP INVITE消息中。当设置为“是”时，SIP INVITE消息将会一直显示P-Preferred-Identity头域。当设置为“否”时，SIP INVITE消息将不显示P-Preferred-Identity头域。默认设置为“默认”。',

  acct_038: '使用MAC头域',
  acct_038_tip: '此项设置是否使用MAC头域。如果设置为“否”,则所有SIP REGISTER消息都不使用MAC头域；如果设置为“仅REGISTER”，则仅在注册/注销的SIP消息中包含MAC头域；如果设置为“全部”，则所有传出的SIP消息中都包含MAC头域。',

  acct_039: 'SIP传输',
  acct_039_tip: '设置SIP消息传输使用的网络协议，IPVideoTalk支持TCP/TLS两种，其它帐号支持TCP/UDP/TLS三种。',

  acct_040: 'RTP IP过滤',
  acct_040_tip: '设置是否对接收到的RTP进行过滤。当设置为“关闭”时，设备接收任意地址发来的RTP包；当设置为“仅IP”时，设备仅接收SDP中对于IP地址的RTP，此时端口不限制；当设置为“IP和端口”时，设备仅向SDP中的IP地址+端口发送RTP。默认设置为“关闭”。',

  acct_041: 'RTP超时（秒）',
  acct_041_tip: '此项用于设置话机如果在指定的RTP超时时间内没有收到RTP包，则将自动挂断通话。有效值范围是0-600秒。若设置为0秒，则话机不会自动挂断通话。',

  acct_042: 'TLS使用的SIP URI格式',
  acct_042_tip: '当SIP传输方式使用TLS/TCP时，选择"sips"。默认设置"sip"。',

  acct_043: 'TCP/TLS Contact使用实际临时端口',
  acct_043_tip: '当设备选择TCP/TLS作为SIP传输方式时，配置是否使用实际临时端口。',

  acct_044: 'RFC2543 Hold',
  acct_044_tip: '如果是，将在INVITE SDP for hold使用c=0.0.0.0。',

  acct_045: '对称RTP',
  acct_045_tip: '设置是否支持对称RTP。默认为否。',

  acct_046: '支持SIP实例ID',
  acct_046_tip: '设置是否支持SIP Instance ID。默认设置为“是”。',

  acct_047: '验证入局SIP消息',
  acct_047_tip: '该项设置是否对所接收到的SIP信息进行验证。默认设置为“否”。',

  acct_048: '检查来电INVITE的SIP用户ID',
  acct_048_tip: '启用时，SIP用户ID将在收到来电INVITE的请求URI中被检查。若不匹配，来电将被拒绝。默认为不勾选。',

  acct_049: '验证来电INVITE',
  acct_049_tip: '若启用，设备将发送SIP 401 Unauthorized对来电INVITE进行验证。默认为不勾选。',

  acct_050: '用于Challenge INVITE ＆ NOTIFY的SIP Realm',
  acct_050_tip: '配置该项可验证来电INVITE，但必须开启验证来电INVITE才能生效。可验证provision的NOTIFY信息，包括check-sync，resync和reboot，但必须开启SIP NOTIFY认证才能生效。',

  acct_051: '仅接受已知服务器的SIP请求',
  acct_051_tip: '启用后，仅已知的服务器发来的SIP请求才会被接受，即设备未使用过的SIP服务器发送来的请求信息将会被拒绝。默认为不勾选。',

  acct_052: 'SIP T1超时时间',
  acct_052_tip: '设置SIP T1 超时时间。T1是对服务器和客户端之间的事务往返延时（RTT）时间评估。如果网络等待时间很高，请选择更大的值以保证稳定的使用。默认设置为0.5秒。',

  acct_053: 'SIP T2间隔时间',
  acct_053_tip: '设置SIP T2 间隔时间。T2定义了INVITE响应和non-INVITE请求的时间间隔。默认设置为4秒。',

  acct_054: 'SIP Timer D间隔时间',
  acct_054_tip: 'SIP定时器D，用于INVITE客户端事务收到3xx ~ 6xx回复后到这个事务结束状态的时间间隔。有效值为0-64秒。',

  acct_055: '从路由移除OBP',
  acct_055_tip: '默认值为“否”。设备使用的路由中将移除代理。该设置用于设备在NAT/防火墙环境下，SIP帐号通知服务器将代理设置移除。',

  acct_056: '检查域名证书',
  acct_056_tip: '当TCP/TLS用于SIP传输时，配置是否检测域名证书。',

  acct_057: '验证证书链',
  acct_057_tip: '当TLS/TCP用于SIP传输时，配置建立连接时是否验证对端证书。',

  acct_058: 'DTMF',
  acct_058_tip: '此项设置传输DTMF数字的机制。共有3种模式：in audio，RFC2833，SIP INFO： <br />1. in audio：表示DTMF由语音信号合成（对于低比特率编码不是很稳定）。<br />2.RFC2833：RFC 2833（Out of Band DTMF）是DTMF信号用专门的RTP包进行标识，在RTP包的头域中就可得知该包是DTMF包，并且知道是什么DTMF信号。<br /> 3.SIP INFO：用SIP信令的INFO消息来携带DTMF信号。这个方法的主要缺陷是因为SIP控制信令和媒体传输（RTP）是分开传输，很容易造成DTMF信号和媒体包不同步。<br /> 默认设置为"RFC2833"。',

  acct_059: 'DTMF有效荷载类型',
  acct_059_tip: '此参数设置DTMF使用RFC2833的负载类型。默认为101。',

  acct_060: '语音编码',
  acct_060_tip: '设备支持多种不同的语言编码类型。设置优先选择列表中的语音编码，该列表与SDP信息的优先选择顺序相同。',

  acct_061: '编码协商优先级',
  acct_061_tip: '设置话机在作为被叫时进行编码协商时使用何种编码顺序。当设置为“主叫”时，话机按照收到的SIP Invite 中SDP的编码顺序进行协商；当设置为“被叫”时，话机根据话机中设置的语音编码顺序进行协商。默认设置为“被叫”。',

  acct_062: '静音抑制',
  acct_062_tip: '此项用于控制静音抑制/动态语音检测（VAD）。如果设置为“是”，当检测到通话无语音流时，设备会发出少量的VAD包（而不是语音包）。默认设置为“否”。',

  acct_063: '语音帧/TX',
  acct_063_tip: '此项用于设置单包发送的语音帧的数量（建议基于以太网数据包的IS限制最大值为1500个字节（或120Kbit/s）） <br />设置该值时，要注意请求数据报时间（ptime，在SDP数据报中）是配置该参数的结果。该参数与上面编码性能表中的首编码有关或者在通话双方中协商实际应用的有效载荷类型。<br />若“语音帧/TX”设置超过最大允许值，设备将对应首编码的选择来使用并保存最大允许值。<br />推荐使用提供的默认设置，不正确的设置会影响语音质量。',

  acct_064: 'G.722.1速率',
  acct_064_tip: 'G.722.1编码速率',

  acct_065: 'G.722.1有效荷载类型',
  acct_065_tip: '输入一个符合的值(96-126)在RTP负载G.722.1编码时。默认为104。',

  acct_066: 'G.722.1C 速率',
  acct_066_tip: 'G.722.1C编码速率',

  acct_067: 'G.722.1C有效荷载类型',
  acct_067_tip: '输入G.722.1C有效荷载值，范围为：96-126,默认为103。',

  acct_068: 'Opus有效荷载类型',
  acct_068_tip: '输入Opus有效荷载值，范围为：96-126,默认为123。',

  acct_069: 'iLBC帧大小',
  acct_069_tip: '选择iLBC帧时长',

  acct_070: '视频前向纠错模式',
  acct_070_tip: '0表示FEC不是使用独立端口发送，1表示FEC使用独立端口发送。',

  acct_071: '使用200OK SDP中首位匹配编码',
  acct_071_tip: '启用时，话机将使用200OK SDP中首位匹配编码进行通话。',

  acct_072: '开启音频前向纠错',
  acct_072_tip: '若勾选该项，音频电话将开启前向纠错。默认为不勾选。',

  acct_073: '音频FEC有效荷载类型',
  acct_073_tip: '此项设置音频FEC负载类型。输入音频FEC有效荷载值范围为：96-127。默认为121。',

  acct_074: '音频RED有效荷载类型',
  acct_074_tip: '此项设置音频RED负载类型。输入音频RED有效荷载值范围为：96-127。默认为124。',

  acct_075: '支持RFC5168',
  acct_075_tip: '若选择“是”，视频电话将支持RFC5168。默认为“是”。',

  acct_076: '丢包重传',
  acct_076_tip: '当开启该功能时，信令会携带RTX信息，若最终协商成功，会使能媒体RTX相关功能实现丢包重传的目的。当关闭该功能时，则无法应用丢包重传。',

  acct_077: '开启视频前向纠错',
  acct_077_tip: '若勾选该项，视频电话将开启前向纠错。默认为不勾选。',

  acct_078: 'FEC有效荷载类型',
  acct_078_tip: '此项设置FEC负载类型。输入FEC有效荷载值范围为：96-127。默认为120。',

  acct_080: '开启FECC',
  acct_080_tip: '若勾选该项，在通话中可以控制对方的摄像头。但需对方支持FECC且允许远端控制本地摄像头，默认为勾选。',

  acct_081: 'FECC H.224有效荷载类型',
  acct_081_tip: '此项设置FECC H.224有效荷载类型。输入FECC H.224有效荷载类型值范围为：96-127。默认为125。',

  acct_082: 'SDP带宽属性',
  acct_082_tip: '在服务器协商时，设置SDP带宽属性值，从而对会话格式进行修改。<br />标准：在会话级中使用AS格式，在媒体流级使用TIAS格式。<br />媒体流级：在视频流媒体级上使用AS格式。<br />无：不修改格式。<br />默认为媒体流级。在不清楚服务器支持的会话格式的情况下，请勿修改该设置，否则易造成视频解码失败。',

  acct_083: '视频抖动缓冲区最大值(ms)',
  acct_083_tip: '根据当前网络环境设置视频抖动缓冲区大小。有效范围：0-1000。默认值为50。',

  acct_084: '开启视频渐进刷新',
  acct_084_tip: '视频渐近刷新GDR(Gradual decoder refresh)是通过P帧内包括I块组的方法来实现渐近刷新，启动该项后会带来更优的网络适应性。默认设置为“否”。',

  acct_085: '视频编码',
  acct_085_tip: '设备支持H.264、H.265，推荐使用H.264。',

  acct_086: '视频大小',
  acct_086_tip: '支持的视频大小。默认为1080p.',

  acct_087: '视频比特率',
  acct_087_tip: '配置视频电话的比特率，可以根据网络环境调整的视频比特率。如果带宽允许的情况下建议增加比特率大小；如果带宽不够，视频质量将降低。默认值跟H.264 视频大小有关：<br />H.264 视频大小设置为4k，设置值为“1Mbps~8Mbps”之间的整数值。<br />H.264 视频大小设置为1080p，设置值为“1Mbps~4Mbps”之间的整数值。<br />H.264 视频大小设置为720p，设置值为“512kbps~2Mbps”之间的整数值。<br />H.264 视频大小设置为4SIF/4CIF/VGA，设置值为“384kbps~1Mbps”之间的整数值。',

  acct_088: '视频帧率',
  acct_088_tip: '配置视频通话的视频帧率。默认为“30帧/秒”。',

  acct_089: 'H.264有效荷载类型',
  acct_089_tip: '输入H.264有效荷载值，范围为：96-126,默认为99。',

  acct_090: '打包模式',
  acct_090_tip: '视频封包模式0,1或自动；默认为1。',

  acct_091: 'H.264 Profile类型',
  acct_091_tip: '设置H.264 Profile类型，可设置为基本档次、主要档次、高级档次或者BP/MP/HP。低级别的Profile类型更易解码，但是更高级别的Profile类型压缩率更高。通常，选择“高级档次”以获得高的视频压缩率。对于低CPU的设备，选择“基本档次”进行视频播放。通常会在要求较高的视频会议情况下使用“BP/MP/HP”，在视频解码时同时进行三种方式的协商，以达到最好的视频效果。',

  acct_092: '使用H.264 Constrained Profiles',
  acct_092_tip: '设置是否使用H.264 CBP，从而与WebRTC视频进行正常建立。此项仅当H.264 Profile类型设置中包含BP类型（基本档次）时有效。与WebRTC建立视频通话时建议开启。默认为否。',

  acct_093: 'H.265有效荷载类型',
  acct_093_tip: '输入H.265有效荷载值，范围为：96-127,默认为114。',

  acct_094: '禁止演示',
  acct_094_tip: '如果设置为“是”，在会议中设备将无法发送演示流和接收演示流。默认设置为“否”。',

  acct_095: '初始INVITE携带媒体信息',
  acct_095_tip: '初始INVITE SDP携带辅流媒体信息.',

  acct_096: '演示H.264 视频大小',
  acct_096_tip: '演示流支持的视频大小。默认为1080p@15 fps.',

  acct_097: '演示H.264 Profile类型',
  acct_097_tip: '设置演示流的H.264 Profile类型，可设置为基本档次、主要档次、高级档次或者BP&MP&HP。低级别的Profile类型更易解码，但是更高级别的Profile类型压缩率更高。通常，选择“高级档次”以获得高的视频压缩率。对于低CPU的设备，选择“基本档次”进行视频播放。通常会在要求较高的视频会议情况下使用“BP/MP/HP”，在视频解码时同时进行三种方式的协商，以达到最好的视频效果。',

  acct_098: '演示视频速率',
  acct_098_tip: '配置视频电话的演示流比特率，可以根据网络环境调整的演示流比特率。如果带宽允许的情况下建议增加比特率大小；如果带宽不够，演示质量将降低。设置值为“512kbps~2048kbps”之间的整数值。',

  acct_099: '演示视频帧率',
  acct_099_tip: '配置启用演示时的视频帧率。默认为“15帧/秒”。',

  acct_100: 'BFCP传输协议',
  acct_100_tip: '配置开启BFCP时使用的传输协议，可设置自动、UDP、TCP，选择自动：会自动切换使用UDP或者TCP，默认先使用UDP，如果对方不支持再使用TCP。默认为UDP。',

  acct_101: 'SRTP方式',
  acct_101_tip: '默认值为“禁用”。可以选择为允许且强制模式执行SRTP或使用允许但不强制即协商模式执行SRTP。',

  acct_102: 'SRTP加密位数',
  acct_102_tip: '设置SRTP使用的AES加密位数，默认为128&256位，即同时提供128位以及256位两种加密强度供SRTP接收方协商使用。若设置为128位，则仅提供128位加密强度的加密方式。若设置为256位，则仅提供256位加密强度的加密方式。',

  acct_103: '远程视频请求',
  acct_103_tip: '配置视频请求的处理方式。用户可以选择：提示，接受，拒绝。默认为“提示”。',

  acct_104: '常用布局模式',
  acct_104_tip: '设置常用布局模式，设置的模式将应用所有会议初始布局模式。',

  acct_105: '拨号前缀',
  acct_105_tip: '设置拨号前缀。使用该帐号拨打的一切号码将自动添加该前缀。如拨号前缀为5，设备上拨打的号码为337，则正常呼出的号码为5337。如果开启了“禁用拨号规则”，拨号前缀也会失效。',

  acct_106: '禁用拨号规则',
  acct_106_tip: '用于设置拨号界面、电话本、来电通话记录、去电通话记录 & Click2Dial是否禁用拨号规则，勾选后，相应功能将不再使用下方的拨号规则。',

  acct_107: '拨号规则',
  acct_107_tip: '设置话机所接受的号码范围或者实现快捷缩位拨号等。其语法规则如下： <br />1.有效值  <br />1,2,3,4,5,6,7,8,9,0,*,#,T； <br />2.拨号规则 <br />• xx - 表示任何两位 0-9 的数字； <br />• xx+ - 表示至少任何两位 0-9 的数字； <br />• xx. - 表示至少任何一位 0-9 的数字； <br />• xx? – 表示一或者两位 0-9 的数字； <br />• ^ - 拒绝； <br />• T - 匹配后延时呼出； <br />• [3-5] – 拨数字 3, 4, 或者 5； <br />• [147] – 拨数字 1, 4, 或者 7； <br />• <2=011> - 当拨号数字为 2 的时候将替换为 011； <br />• 设置 \\{x+\\} 允许所有的数字号码呼出。 <br />2.实例 <br />例一: \\{[369]11 \| 1617xxxxxx\\} – 允许 311, 611, 911, 任何 10 位数字开始为1617的呼叫出去； <br />例二: \\{^1900x+ \| <=1617>xxxxxxx\\} – 将拒绝拨打号码为 1900 头的号码，与拨打任何7位数增加前缀1617。',

  acct_108: '使用Refer-To报文头转移',
  acct_108_tip: '默认值为“否”。若选择为“是”且服务器支持这项功能，则设备会检查“Refer-To”报头来处理呼叫。',

  acct_109: '自动应答',
  acct_109_tip: '当设置为“是”时，设备将在有来电时自动接听。默认设置为“否”。',

  acct_110: '发送匿名',
  acct_110_tip: '如果此项被设置为“是”，以“From”开头发送的INVITE信息会被设置为匿名，来电显示将会被屏蔽。',

  acct_111: '拒绝匿名呼叫',
  acct_111_tip: '默认为"否"。如果设置为"是"，匿名来电将被拒绝。',

  acct_112: '呼叫日志',
  acct_112_tip: '此项设置设备的呼叫日志。默认设置为“记录所有呼叫”。',

  acct_113: '特殊模式',
  acct_113_tip: '不同的软交换供应商有不同的需求，用户可以选择不同的模式以满足供应商的需求。默认设置模式为“标准”。',

  acct_114: '功能键同步',
  acct_114_tip: '用于Broadsoft呼叫功能同步。启用时，DND和转接等功能可以与Broadsoft服务器同步。默认为“禁用”。',

  acct_115: '激活呼叫功能',
  acct_115_tip: '默认为“否”，本地支持呼叫转接、呼叫等待和呼叫转移等呼叫功能。<br />例如：*72+号码，即通过呼叫功能设置无条件转移号码。<br />当本地呼叫功能与服务器相冲突时，可以将本地呼叫功能关闭。<br />更多信息可参考用户手册激活呼叫功能章节。',

  acct_116: '振铃超时时间',
  acct_116_tip: '此参数定义无应答的超时时间。默认值为60s。',

  acct_117: '#键拨号',
  acct_117_tip: '此项用于设置是否使用“#”键作为“发送”键发送号码。若设置为“是”，按“#”键即可发送号码。若设置为“否”，“#”键只作为拨号的一部分。默认设置为“是”。',

  acct_118: '上传本地MOH音频文件',
  acct_118_tip: '点击“浏览”按钮上传PC端音频文件。MOH音频文件必须是.wav或者.mp3格式。<br />注意：上传、处理MP3格式文件时可能会花费较长时间，请耐心等待。选择文件上传时按钮将会变成“正在处理”，当上传完成后按钮将会变回到“浏览”。',

  acct_119: '开启本地MOH功能',
  acct_119_tip: '若设置为“是”，本地MOH功能将会开启。用户需要上传本地MOH音频文件。开启该功能后，当用户保持呼叫时可以播放该MOH音频文件。默认设置为“否”。',

  acct_120: '帐号默认铃声',
  acct_120_tip: '在下拉框当中选择帐号默认铃声。',

  acct_121: '呼叫转移类型',
  acct_121_tip: '在下拉菜单中选择呼叫转移类型。“无”表示不设置呼叫转移。“无条件”表示所有来电无条件转移到所设置的号码。“根据时间”表示根据设置的时间范围来转移来电。“其他”表示设置无应答转移或遇忙转移。',

  acct_122: '无条件到',
  acct_122_tip: '当设置“无条件转移”后，在此输入号码将来电无条件转移到该号码。',

  acct_123: '时间段',
  acct_123_tip: '当设置“根据时间”转移后，在此输入时间段。时间为24小时制的“小时:分钟”，如10:00。',

  acct_124: '时间段内转移到',
  acct_124_tip: '此处输入在设定的时间段内来电转移到的号码。',

  acct_125: '时间段外转移到',
  acct_125_tip: '此处输入在设定的时间段外来电转移到的号码。',

  acct_126: '开启遇忙转移',
  acct_126_tip: '如果设置为"是"，本地电话忙时将转移到下方设置的号码。',

  acct_127: '本地忙到',
  acct_127_tip: '此处输入本地电话忙时来电转移到的号码。',

  acct_128: '开启无应答转移',
  acct_128_tip: '如果设置为"是"，无应答时将转移到下方设置的号码。',

  acct_129: '无应答到',
  acct_129_tip: '此处输入本地电话无人应答时来电转移到的号码。当设备处于无人接听时，呼叫将转移到该电话号码上。',

  acct_130: '无应答超时时间(秒)',
  acct_130_tip: '此处输入来电转移前无应答超时时间间隔。默认设置为20秒。',

  acct_131: '开启勿扰转移',
  acct_131_tip: '如果设置为"是"，开启勿扰模式时来电将转移到下方设置的号码。',

  acct_132: '勿扰时到',
  acct_132_tip: '此处输入开启勿扰模式时来电转移到的号码。',

  acct_133: '开启IPVideoTalk服务',
  acct_133_tip: '设置是否启用IPVideoTalk帐号，如果设置为“是”，系统将支持IPVideoTalk 相关功能。默认值为“是” ，设置后重启生效。',

  acct_134: 'SIP传输',
  acct_134_tip: '设置SIP消息传输使用的网络协议，IPVideoTalk支持TCP/TLS两种，其它帐号支持TCP/UDP/TLS三种。',

  acct_135: '空闲时自动接听',
  acct_135_tip: '当设置为“是”时，设备将在有来电时自动接听。默认设置为“否”。',

  acct_136: '开启GK',
  acct_136_tip: '此项设置是否开启GK，如果勾选，设备会向GK注册，默认不勾选。',

  acct_137: '开启H.460',
  acct_137_tip: '若开启，H323通话支持H.460协议，默认不勾选。',

  acct_138: 'GK发现模式',
  acct_138_tip: '此项设置GK的发现模式，分为自动，手动两种方式。选择“自动”，设备自动发现GK并向GK注册。选择”手动”，设备通过GK地址发现GK并向GK注册。默认为自动。',

  acct_139: 'GK地址',
  acct_139_tip: '此项设置GK服务器的地址。',

  acct_140: '会场号码',
  acct_140_tip: '此项设置设备的会场号码，可以是字符串也可以是数字。',

  acct_141: 'GK认证用户名',
  acct_141_tip: '此项设置设备向GK注册用于认证的用户名。',

  acct_142: 'GK认证密码',
  acct_142_tip: '此项设置设备注册到GK，由GK提供的认证密码。',

  acct_143: 'H.323本地端口',
  acct_143_tip: '该项设置设备监听的本地H.323端口，默认值为1720。',

  acct_144: '开启H225心跳间隔',
  acct_144_tip: '若开启H225心跳间隔，只有当作为被叫时会发送H225 keep-alive包，间隔19s，默认不勾选。',

  acct_145: '开启H245心跳间隔',
  acct_145_tip: '若开启H245心跳间隔，无论是作为主叫还是被叫都会发送H245 keep-alive包，间隔19s，默认不勾选。',

  acct_146: '开启RTDR',
  acct_146_tip: '若开启,会定时向对端发送RTDP（roundTripDelayRequest）包作为H245保活包，发送周期为10s，超时时间为30s，超时后会挂断呼叫，默认不勾选。说明：若开启，可能导致与部分设备出现不兼容。',

  acct_147: 'DTMF',
  acct_147_tip: '该项设置传输DTMF数字的机制，共有In audio，RFC2833，H245 signal三种模式。',

  acct_148: '匹配来电号码',
  acct_148_tip: '设置来电号码振铃的规则，左边共有3个空格可以设置区别振铃规则。<br />例如：139x+ 即以139开头的来电对应响铃为右边的铃声。',

  acct_149: '自定义铃音',
  acct_149_tip: '该项指定对应左边的匹配来电的铃声。用户可以选择不同的铃声，也可以在配置页面“应用程序”的“铃声管理”上传mp3文件后选其作为铃声。',

  acct_150: 'User-Agent头域内添加MAC',
  acct_150_tip: '此项设置是否在User-Agent头域添加MAC地址。如果设置为“否”，则所有SIP消息的User-Agent头域都不添加MAC地址；如果设置为“除REGISTER”，则除了REGISTER消息外的所有传出的SIP消息都会在User-Agent头域添加MAC地址；如果设置为“全部”，则所有传出的SIP消息（包含REGISTER消息）都会在User-Agent头域中添加MAC地址。',

  acct_151: 'Zoom服务器',
  acct_151_tip: 'Zoom服务器的IP地址或URL，由VoIP服务提供商提供。',

  acct_152: '注册期限(分钟)',
  acct_152_tip: '此参数允许用户设定设备更新注册的频率（分钟）。默认时间间隔为60分钟（1小时）。最大时间间隔为1440分钟（1天）。最小值为1分钟。'

}
