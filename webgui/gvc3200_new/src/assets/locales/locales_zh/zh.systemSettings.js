/* eslint-disable no-multiple-empty-lines */
export default {
  /* 电源管理 */

  sys_pow_001: '超时操作',
  sys_pow_001_tip: 'Set the timeout options, optional for into sleep mode and shut down, the default value is "Enter sleep mode".',

  sys_pow_002: '超时时间',
  sys_pow_002_tip: '设置超时操作, 可选择“进入睡眠模式”或“关机”, 默认值为“进入睡眠模式”.',

  sys_pow_003: '重启设备',
  sys_pow_003_tip: '设置设备重启.',

  sys_pow_004: '睡眠',
  sys_pow_004_tip: '设置设备为睡眠模式.',

  sys_pow_005: '关机',
  sys_pow_005_tip: '关将设备关机.',

  /* 时间和语言 */

  sys_tl_001: '指定网络时间协议服务器地址 1',
  sys_tl_001_tip: '此项设置NTP服务器的IP地址。设备将会从该服务器获得日期和时间.',

  sys_tl_002: '指定网络时间协议服务器地址 2',
  sys_tl_002_tip: '此项设置NTP服务器的IP地址。设备将会从该服务器获得日期和时间.',

  sys_tl_003: '启动DHCP option 42设定NTP服务器',
  sys_tl_003_tip: '设置是否使用DHCP Option 42取代NTP服务器。若启用，当局域网中存在DHCP Option 42时，将会取代NTP服务器用来同步设备上的日期和时间。默认设置为“是”',

  sys_tl_004: '启动DHCP option 2设定时区',
  sys_tl_004_tip: '启用该项后设备将会从该DHCP服务器下发的Option 2中自动获取时区信息。默认设置为“是”.',

  sys_tl_005: '使用24小时格式',
  sys_tl_005_tip: '12小时或24小时制时间显示格式.',

  sys_tl_006: '日期显示格式',
  sys_tl_006_tip: '设置屏幕显示的日期格式.',

  sys_tl_007: '设置日期',
  sys_tl_007_tip: '自定义日期.',

  sys_tl_008: '设置时间',
  sys_tl_008_tip: '自定义时间.',

  sys_tl_009: '时区',
  sys_tl_009_tip: '设置时区控制日期/时间的显示。如果DHCP Option2被激活，设备将跳过此设置，直接使用Option2下发的时区.',

  sys_tl_010: '语言选择',
  sys_tl_010_tip: '选择设备显示的语言.',

  sys_tl_011: '选择语言文件',
  sys_tl_011_tip: '从电脑本地直接浏览上传到设备，点击“浏览”，选择txt文件.',

  /* 网管设置 */

  sys_tr_001: '打开TR069',
  sys_tr_001_tip: '设置是否启用TR-069。若设置为“是”，则设备向ACS服务器发送会话连接请求。默认设置为“是”.',

  sys_tr_002: 'ACS源',
  sys_tr_002_tip: '设置TR-069自动配置服务器的URL或IP地址及端口号。开启TR-069时必须配置此参数.',

  sys_tr_003: 'ACS用户名',
  sys_tr_003_tip: '设备向ACS发起连接请求时ACS对TR-069客户端即设备进行认证的用户名，必须与ACS侧的配置保持一致.',

  sys_tr_004: 'ACS密码',
  sys_tr_004_tip: 'ACS对设备进行认证的密码，必须与ACS侧的配置保持一致.',

  sys_tr_005: '开启定时连接',
  sys_tr_005_tip: '若启用定时连接，设备将会定时向ACS服务器发送连接请求。默认设置为“否”.',

  sys_tr_006: '定时连接间隔(秒)',
  sys_tr_006_tip: '此处填写设备向ACS定时发送连接请求的时间间隔.',

  sys_tr_007: 'ACS连接请求用户名',
  sys_tr_007_tip: 'ACS服务器向设备发起连接请求时设备对ACS进行认证的用户名，设备与ACS侧的配置必须保持一致.',

  sys_tr_008: 'ACS连接请求密码',
  sys_tr_008_tip: '设备对ACS进行认证的密码，设备与ACS服务器端的配置必须保持一致.',

  sys_tr_009: 'ACS连接请求端口',
  sys_tr_009_tip: 'ACS服务器向设备发起连接请求时所使用的端口号。该端口不能被设备其他应用占用，如不能使用5060、5004等SIP协议使用的端口号.',

  sys_tr_010: 'CPE证书',
  sys_tr_010_tip: '此处填写设备通过SSL连接ACS时需要使用的证书文件.',

  sys_tr_011: 'CPE证书密码',
  sys_tr_011_tip: '此处填写设备通过SSL连接ACS时需要使用的证书密码.',

  /* 安全设置 */
  sys_sec_001: '禁止SSH访问',
  sys_sec_001_tip: '如果设置为是,话机将禁止SSH方式进行访问.',

  sys_sec_002: '访问方式',
  sys_sec_002_tip: '选择通过http/https进行页面访问.',

  sys_sec_003: '端口号',
  sys_sec_003_tip: '设置使用http进行页面访问的端口.http默认使用80端口;https默认使用443端口.',

  sys_sec_004_1: '当前管理员密码',
  sys_sec_004_2: '当前用户密码',
  sys_sec_004_tip: '请输入当前管理员密码,密码为数字+字母/特殊字符,注意大小写,最大长度为32.',

  sys_sec_005: '管理员新密码',
  sys_sec_005_tip: '请输入管理员密码,密码为数字+字母/特殊字符,注意大小写,最大长度为32.',

  sys_sec_006: '确认管理员新密码',
  sys_sec_006_tip: '请再次输入管理员新密码确认.',

  sys_sec_007: '用户新密码',
  sys_sec_007_tip: '设置用户级别页面访问的密码.注意大小写,密码为数字+字母/特殊字符,最大长度为32.',

  sys_sec_008: '确认用户新密码',
  sys_sec_008_tip: '请再次输入用户新密码确认.',

  sys_sec_009: '删除锁屏密码',
  sys_sec_009_tip: '点击“删除”按钮以删除目前设置的锁屏密码.',

  sys_sec_010: '锁屏密码',
  sys_sec_010_tip: '请输入锁屏密码,密码为6位数字.',

  sys_sec_011: '确认锁屏密码',
  sys_sec_011_tip: '请输入锁屏密码,密码为6位数字.',

  sys_sec_012: 'SIP TLS验证',
  sys_sec_012_tip: '设置访问某些特定网站需要的SIP TLS验证内容.话机支持SIP over TLS加密,通过内置的私用密钥和SSL证书实现.用户指定的用于TLS加密的SSL证书必须是X.509格式的.',

  sys_sec_013: 'SIP TLS私钥',
  sys_sec_013_tip: '此项设置SIP TLS私钥.',

  sys_sec_014: 'SIP TLS私钥密码',
  sys_sec_014_tip: '此项设置SIP TLS私钥密码.',

  sys_sec_015: 'CA证书',
  sys_sec_016: '导入受信任CA证书',
  sys_sec_016_tip: '此处用于添加受信任CA证书,点击“浏览”按钮上传PC端证书文件.证书文件必须是.pem,.crt,.cer或者.der格式.一次可上传多份证书,多份证书在同一个文件中.',
  sys_sec_017: '受信任CA证书',
  sys_sec_018: '自定义证书',
  sys_sec_019: '导入自定义证书',
  sys_sec_019_tip: '点击“浏览”按钮上传用户自定义证书文件.证书文件必须是.pem, .crt, .cer或者.der格式.',

  sys_sec_020: '最小TLS版本',
  sys_sec_020_tip: '此项设置话机支持的最小TLS版本.',

  sys_sec_021: '最大TLS版本',
  sys_sec_021_tip: '此项设置话机支持的最大TLS版本.',

  sys_999: ''
}