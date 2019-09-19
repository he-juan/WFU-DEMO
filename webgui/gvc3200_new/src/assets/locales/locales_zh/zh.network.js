/**
 * 网络设置配置项词条以及tips
 */
export default {
  net_001: '首选网络协议',
  net_001_tip: '选择网络协议。当IPv4和IPv6同时被启用时，首选协议将会被优先选择, 若首选协议启用失败，将自动切换至其它协议。',

  net_002: 'IPv4地址类型',
  net_002_tip: '本设备有三种网络模式: <br />• DHCP模式: 设备通过在所连接局域网的一个DHCP服务器获取IP。所有有关静态IP/PPPoE的域值都不可用（尽管有关域值已保存在闪存中）。<br />• PPPoE模式:配置PPPoE帐号/密码，通过拨号从PPPoE服务器获取IP。<br />• 静态IP:需要手动配置IP地址、子网掩码、默认路由器IP地址、DNS服务器1、DNS服务器2。',

  net_003: 'DHCP VLAN模式',
  net_003_tip: '选择DHCP Option VLAN模式。若选择“DHCP选项132和DHCP选项133”，设备将接收DHCP服务器发来的DHCP option 132 (802.1Q VLAN ID) 以及DHCP option 133 (QOS priority level)用于本地网络设置。若选择“封装于DHCP选项43”，设备将接收DHCP服务器发来的DHCP option 43用于本地网络设置。注：当选择“封装于DHCP Option 43”时，请确保维护->更新升级中的“启动DHCP选项43、160和66服务器设置”设置项已启用。默认为“禁用”。',

  net_004: '主机名(Option 12)',
  net_004_tip: '此项填写客户端主机名。可选项。某些网络服务提供商可能会用到。',

  net_005: '厂家类别名(Option 60)',
  net_005_tip: '此项填写用于客户端与服务器端交换厂家类别名。',

  net_006: '第二层QoS 802.1Q/VLAN标记 (以太网)',
  net_006_tip: '此项设置第二层QoS的VLAN标记值。默认值为0。注意：如果不确定第二层Qos请不要更改第二层VLAN标记和优先级，错误配置可能导致设备获取IP失败。',

  net_007: '第二层QoS 802.1p优先级 (以太网)',
  net_007_tip: '此项设置对应第二层Qos的优先级的值，默认值为0。',

  net_008: 'IP地址',
  net_008_tip: '输入IP地址。',

  net_009: '子网掩码',
  net_009_tip: '输入子网掩码。',

  net_010: '网关',
  net_010_tip: '输入默认网关。',

  net_011: 'DNS服务器1',
  net_011_tip: '输入DNS服务器1。',

  net_012: 'DNS服务器2',
  net_012_tip: '输入DNS服务器2。',

  net_013: '应用于数据的第二层QoS 802.1Q/VLAN标记(以太网)',

  net_014: '应用于数据的第二层QoS 802.1p优先级 (以太网)',

  net_015: 'PPPoE帐号ID',
  net_015_tip: '输入PPPoE帐号。',

  net_016: 'PPPoE密码',
  net_016_tip: '输入PPPoE密码。',

  net_019: 'IPv6地址',
  net_019_tip: '配置设备的IPv6地址。',

  net_020: '首选DNS服务器',
  net_020_tip: '输入首选DNS服务器地址。',

  net_021: '静态IPv6地址',
  net_021_tip: '当使用静态类型IPv6时，输入静态IPv6地址。',

  net_022: 'IPv6前缀长度',
  net_022_tip: '输入静态IPv6地址前缀长度。',

  net_025: '802.1X模式',
  net_025_tip: '设置是否启用802.1X模式。用于配置连接到交换机时进行的802.1X身份验证。默认设置为“禁用”。',

  net_026: '802.1X认证信息',
  net_026_tip: '此处输入802.1X认证信息。',

  net_027: '802.1X密码',
  net_027_tip: '此处输入802.1X密码。',

  net_028: 'CA证书',
  net_028_tip: '此处上传802.1X CA证书。',

  net_029: '客户证书',
  net_029_tip: '此处上传802.1X客户证书。',

  net_030: '私钥',
  net_030_tip: '此处上传802.1X私钥。',

  net_031: 'Wi-Fi功能',
  net_031_tip: '此项参数设置开启/关闭Wi-Fi。默认是关闭的。',

  net_032: 'ESSID',
  net_032_tip: '此项设置无线网络的ESSID。按扫描可以检测到可用的ESSID显示在列表中，括号中的数字表示信号强度。',

  net_033: 'ESSID',
  net_033_tip: '此项用于设置隐藏的ESSID。',

  net_034: '隐藏SSID的安全模式',
  net_034_tip: '此参数设置SSID为隐藏时的无线网络的安全模式。',

  net_035: '密码',
  net_035_tip: '此项用于设置隐藏的ESSID的密码。',

  net_036: '国家码',
  net_036_tip: '设置Wi-Fi国家码。默认为“US”。',

  net_037: '主机名(Option 12)',
  net_037_tip: '此项填写客户端主机名。可选项。某些网络服务提供商可能会用到。',

  net_038: '厂家类别名(Option 60)',
  net_038_tip: '此项填写用于客户端与服务器端交换厂家类别名。',

  net_039: '开启OpenVPN®',
  net_039_tip: '此项设置是否激活OpenVPN®功能,需要服务器支持。默认是关闭的。 注意: 用户如果需要使用OpenVPN功能，需要设置OpenVPN相关的所有配置，包括服务器地址，端口，OpenVPN®证书，客户证书，客户密码。 另外，通过帐号设置->网络设置，选择NAT类型为VPN。',

  net_040: 'OpenVPN® 模式',
  net_040_tip: '简约模式仅支持一些基本或通用参数配置; 专业模式支持配置文件上传，完全按需定制，请参考https://openvpn.net获取更多信息。',

  net_041: '上传OpenVPN®配置',
  net_041_tip: '将配置文件从当前电脑端上传到话机。',

  net_042: '开启OpenVPN®压缩算法',
  net_042_tip: '此项用于设置是否开启LZO压缩算法。当服务器端开启LZO Compression，话机端必须同时开启此配置，否则会导致网络连接失败。',

  net_043: 'OpenVPN®服务器地址',
  net_043_tip: '设置OpenVPN®服务器的URL/IP地址。',

  net_044: 'OpenVPN®端口',
  net_044_tip: '设置与OpenVPN®服务器通信的网络端口。默认端口为1194。',

  net_045: 'OpenVPN®传输方式',
  net_045_tip: '设置OpenVPN®传输的网络协议。',

  net_046: 'OpenVPN® CA',
  net_046_tip: 'OpenVPN®证书(ca.crt)用于与OpenVPN®服务器验证。点击“上传”将证书文件(ca.crt)上传到设备。',

  net_047: 'OpenVPN®客户证书',
  net_047_tip: 'OpenVPN®客户证书(*.crt)用于与OpenVPN®服务器验证。点击“上传”将客户证书文件(*.crt)上传到设备。',

  net_048: 'OpenVPN®客户端秘钥',
  net_048_tip: 'OpenVPN®客户端秘钥(*.key)用于与OpenVPN®服务器验证。点击“上传”将客户证书文件(*.key)上传到设备。',

  net_049: 'OpenVPN®加密方式',
  net_049_tip: '设置OpenVPN®加密方式，必须与OpenVPN®服务器使用的加密方式相同。',

  net_050: 'OpenVPN®用户名',
  net_050_tip: '设置OpenVPN®用户名（可选）。',

  net_051: 'OpenVPN®密码',
  net_051_tip: '设置OpenVPN®密码（可选）。',

  net_052: '首选DNS服务器1',
  net_052_tip: '此项用于设置首选DNS服务器1地址。',

  net_053: '首选DNS服务器2',
  net_053_tip: '此项用于设置首选DNS服务器2地址。',

  net_054: '开启LLDP',
  net_054_tip: '勾选后，设备将会接收交换机发送的LAN信息设置VLAN和QoS参数。默认为“是”。',

  net_055: '开启CDP',
  net_055_tip: '此项用于设置是否启用CDP实现与已开启CDP的网络设备进行信息收发。',

  net_056: '第三层SIP QoS',
  net_056_tip: '此项表示Layer 3 QoS用于IP优先级或Diff-Serv或MPLS的参数。默认值为26。',

  net_057: '第三层音频QoS',
  net_057_tip: '定义了音频数据包的3层QoS参数。此值用于IP优先级，Diff-Serv或MPLS。默认值为46。',

  net_058: '第三层视频QoS',
  net_058_tip: '定义了视频数据包的3层QoS参数。此值用于IP优先级，Diff-Serv或MPLS。默认值为34。',

  net_059: 'HTTP/HTTPS用户代理',
  net_059_tip: '该值可设置HTTP/HTTPS请求的用户代理。',

  net_060: 'SIP用户代理',
  net_060_tip: '该值可设置SIP的用户代理。若值包含$version，则会用真正的系统版本号替换$version。',

  net_061: 'HTTP/HTTPS代理服务器主机名',
  net_061_tip: '配置设备使用的HTTP代理服务器的主机名。',

  net_062: 'HTTP/HTTPS代理服务器端口',
  net_062_tip: '配置设备使用的HTTP代理服务器的端口。',

  net_063: '对以下网址不使用代理',
  net_063_tip: '配置设备不使用代理的目的地。'

}
