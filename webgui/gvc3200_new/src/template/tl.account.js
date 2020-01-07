export default {
  label: 'Account',
  lang: 'r_002',
  path: 'acct',
  sub: [
    {
      label: 'SIP',
      lang: 'r_064',
      path: 'sip',
      denyRole: 'user',
      sub: [
        /** ****************Account.Sip.General********************* */
        {
          label: 'General',
          lang: 'r_014',
          path: 'general',
          sub: [
            // 帐号激活
            { lang: 'acct_001', p: 'P271', denyModel: '' },
            // 帐号名称
            { lang: 'acct_002', p: 'P270' },
            // SIP服务器
            { lang: 'acct_003', p: 'P47' },
            // 备用SIP服务器
            { lang: 'acct_004', p: 'P602' },
            // 第三SIP服务器
            { lang: 'acct_005', p: 'P1702' },
            // SIP用户ID
            { lang: 'acct_006', p: 'P35' },
            // SIP认证ID
            { lang: 'acct_007', p: 'P36' },
            // SIP认证密码
            { lang: 'acct_008', p: 'P34', noInit: 1 },
            // 显示名称
            { lang: 'acct_009', p: 'P3' },
            // 语音信箱接入号
            { lang: 'acct_010', p: 'P33' },
            // 电话URI
            { lang: 'acct_011', p: 'P63' }
          ]
        },
        /** ****************Account.Sip.Network********************* */
        {
          label: 'Network',
          lang: 'r_004',
          path: 'network',
          sub: [
            // 出局代理
            { lang: 'acct_012', p: 'P48' },
            // 备用出局代理
            { lang: 'acct_013', p: 'P2333' },
            // DNS模式
            { lang: 'acct_014', p: 'P103' },
            // NAT检测
            { lang: 'acct_015', p: 'P52' },
            // 使用代理
            { lang: 'acct_016', p: 'P197' }
          ]
        },
        /** ****************Account.Sip.Sip********************* */
        {
          label: 'SIP',
          lang: 'r_064',
          path: 'sip',
          sub: [
            // SIP注册
            { lang: 'acct_017', p: 'P31' },
            // 重新注册前注销
            { lang: 'acct_018', p: 'P81' },
            // 注册期限(分钟)
            { lang: 'acct_019', p: 'P32' },
            // 注册期限内重新注册等待时间(秒)
            { lang: 'acct_020', p: 'P2330', denyModel: 'GVC3220' }, // bugfree 2584 隐藏
            // 订阅超时(分钟)
            { lang: 'acct_021', p: 'P26051' },
            // 重试注册间隔时间(秒)
            { lang: 'acct_022', p: 'P138' },
            // 本地SIP端口
            { lang: 'acct_023', p: 'P40' },
            // 支持MWI
            { lang: 'acct_024', p: 'P99' },
            // 开启会话超时
            { lang: 'acct_025', p: 'P260' },
            // 会话超时时间(秒)
            { lang: 'acct_026', p: 'Psessionexp_0' },
            // 最小超时时间(秒)
            { lang: 'acct_027', p: 'P261' },
            // UAC指定刷新对象
            { lang: 'acct_028', p: 'P266' },
            // UAS指定刷新对象
            { lang: 'acct_029', p: 'P267' },
            // 强制INVITE
            { lang: 'acct_030', p: 'P265' },
            // 主叫请求计时
            { lang: 'acct_031', p: 'P262' },
            // 被叫请求计时
            { lang: 'acct_032', p: 'P263' },
            // 强制计时
            { lang: 'acct_033', p: 'P264' },
            // 开启100rel
            { lang: 'acct_034', p: 'P272' },
            // 来电ID显示
            { lang: 'acct_035', p: 'P2324' },
            // 使用Privacy头域
            { lang: 'acct_036', p: 'P2338' },
            // 使用P-Preferred-Identity头域
            { lang: 'acct_037', p: 'P2339' },
            // 使用MAC头域
            { lang: 'acct_038', p: 'P29090' },
            // 在User-Agent添加MAC
            { lang: 'acct_150', p: 'P26061' },
            // SIP传输
            { lang: 'acct_039', p: 'P130' },
            // RTP IP过滤
            { lang: 'acct_040', p: 'P26026' },
            // RTP超时（秒）
            { lang: 'acct_041', p: 'P29068' },
            // TLS使用的SIP URI格式
            { lang: 'acct_042', p: 'P2329' },
            // TCP/TLS Contact使用实际临时端口
            { lang: 'acct_043', p: 'P2331' },
            // RFC2543 Hold
            { lang: 'acct_044', p: 'P26062' },
            // 对称RTP
            { lang: 'acct_045', p: 'P1860' },
            // 支持SIP实例ID
            { lang: 'acct_046', p: 'P288' },
            // 验证入局SIP消息
            { lang: 'acct_047', p: 'P2306' },
            // 检查来电INVITE的SIP用户ID
            { lang: 'acct_048', p: 'P258' },
            // 验证来电INVITE
            { lang: 'acct_049', p: 'P2346' },
            // 用于Challenge INVITE ＆ NOTIFY的SIP Realm
            { lang: 'acct_050', p: 'P26021' },
            // 仅接受已知服务器的SIP请求
            { lang: 'acct_051', p: 'P2347' },
            // SIP T1超时时间
            { lang: 'acct_052', p: 'P209' },
            // SIP T2间隔时间
            { lang: 'acct_053', p: 'P250' },
            // SIP Timer D间隔时间
            { lang: 'acct_054', p: 'P2387', denyModel: 'GVC3220' }, // bugfree 2584 隐藏
            // 从路由移除OBP
            { lang: 'acct_055', p: 'P2305' },
            // 检查域名证书
            { lang: 'acct_056', p: 'P2311' },
            // 验证证书链
            { lang: 'acct_057', p: 'P2867' }
          ]
        },
        /** ****************Account.Sip.Codec********************* */
        {
          label: 'Codec',
          lang: 'r_045',
          path: 'codec',
          sub: [
            // DTMF
            { lang: 'acct_058', p: ['P2301', 'P2302', 'P2303'] },
            // DTMF有效荷载类型
            { lang: 'acct_059', p: 'P79' },
            // 语音编码
            { lang: 'acct_060', p: ['P57', 'P58', 'P59', 'P60', 'P61', 'P62', 'P46', 'P98'] },
            // 编码协商优先级
            { lang: 'acct_061', p: 'P29061' },
            // 静音抑制
            { lang: 'acct_062', p: 'P50' },
            // 语音帧/TX
            { lang: 'acct_063', p: 'P37' },
            // G.722.1速率
            { lang: 'acct_064', p: 'P2373' },
            // G.722.1有效荷载类型
            { lang: 'acct_065', p: 'P2374' },
            // G.722.1C 速率
            { lang: 'acct_066', p: 'P26017' },
            // G.722.1C有效荷载类型
            { lang: 'acct_067', p: 'P26016' },
            // Opus有效荷载类型
            { lang: 'acct_068', p: 'P2385' },
            // iLBC帧大小
            { lang: 'acct_069', p: 'P97' },
            // 使用200OK SDP中首位匹配编码
            { lang: 'acct_071', p: 'P2348' },
            // 开启音频前向纠错
            { lang: 'acct_072', p: 'P26073' },
            // 音频FEC有效荷载类型
            { lang: 'acct_073', p: 'P26074' },
            // 音频RED有效荷载类型
            { lang: 'acct_074', p: 'P26075' },

            // 支持RFC5168
            { lang: 'acct_075', p: 'P1331' },
            // 丢包重传
            { lang: 'acct_076', p: 'P26085' },
            // 开启视频前向纠错
            { lang: 'acct_077', p: 'P2393' },
            // FEC有效荷载类型
            { lang: 'acct_078', p: 'P2394' },
            // 视频前向纠错模式
            // { lang: 'acct_070', p: 'P26022' },
            // 开启FECC
            { lang: 'acct_080', p: 'P26004' },
            // FECC H.224有效荷载类型
            { lang: 'acct_081', p: 'P26008' },
            // SDP带宽属性
            { lang: 'acct_082', p: 'P2360' },
            // 视频抖动缓冲区最大值(ms)
            { lang: 'acct_083', p: 'P2381' },
            // 开启视频渐进刷新
            { lang: 'acct_084', p: 'P25111' },
            // 视频编码
            { lang: 'acct_085', p: ['P295', 'P296'] },
            // H.264 视频大小
            { lang: 'acct_086', p: 'P2307' },
            // 视频比特率
            { lang: 'acct_087', p: 'P2315' },
            // 视频帧率
            { lang: 'acct_088', p: 'P25004' },
            // H.264有效荷载类型
            { lang: 'acct_089', p: 'P293' },
            // 打包模式
            { lang: 'acct_090', p: 'P26005' },
            // H.264 Profile 类型
            { lang: 'acct_091', p: 'P2362' },
            // 使用H.264 Constrained Profiles
            { lang: 'acct_092', p: 'P26045' },
            // H.265有效荷载类型
            { lang: 'acct_093', p: 'P26086' },

            // 禁止演示
            { lang: 'acct_094', p: 'P26001' },
            // 初始INVITE携带媒体信息
            { lang: 'acct_095', p: 'PsendPreMode_0' },
            // 演示H.264 视频大小
            { lang: 'acct_096', p: 'P2376' },
            // 演示H.264 Profile类型
            { lang: 'acct_097', p: 'P2377' },
            // 演示视频速率
            { lang: 'acct_098', p: 'P2378' },
            // 演示视频帧率
            { lang: 'acct_099', p: 'P26042' },
            // BFCP传输协议
            { lang: 'acct_100', p: 'P26041' },
            // SRTP方式
            { lang: 'acct_101', p: 'P183' },
            // SRTP加密位数
            { lang: 'acct_102', p: 'P2383' }
          ]
        },
        /** ****************Account.Sip.Call********************* */
        {
          label: 'Call',
          lang: 'r_046',
          path: 'call',
          sub: [
            // 远程视频请求
            { lang: 'acct_103', p: 'P2326' },
            // 常用布局模式
            { lang: 'acct_104', p: 'P29070', denyModel: 'GVC3220' },
            // 拨号前缀
            { lang: 'acct_105', p: 'P66' },
            // 禁用拨号规则
            { lang: 'acct_106', p: 'P2382' },
            // 拨号规则
            { lang: 'acct_107', p: 'P290' },
            // 使用Refer-To报文头转移
            { lang: 'acct_108', p: 'P135' },
            // 自动应答
            { lang: 'acct_109', p: 'P90' },
            // 发送匿名
            { lang: 'acct_110', p: 'P65' },
            // 拒绝匿名呼叫
            { lang: 'acct_111', p: 'P129' },
            // 呼叫日志
            { lang: 'acct_112', p: 'P182' },
            // 特殊模式
            { lang: 'acct_113', p: 'P198' },
            // 功能键同步
            { lang: 'acct_114', p: 'P2325' },
            // 激活呼叫功能
            { lang: 'acct_115', p: 'P191' },
            // 振铃超时时间
            { lang: 'acct_116', p: 'P1328' },
            // #键拨号
            { lang: 'acct_117', p: 'P72' },
            // 上传本地MOH音频文件
            { lang: 'acct_118', _p: 'MOHUploadProps' },
            // 开启本地MOH功能
            { lang: 'acct_119', p: 'P2357' },
            // 帐号默认铃声
            { lang: 'acct_120', p: 'P104' },
            // 呼叫转移类型
            { lang: 'acct_121', p: 'Pdisplay_0' },
            // 无条件到
            { lang: 'acct_122', p: 'PallTo_0' },
            // 时间段
            { lang: 'acct_123', p: ['Pstarttime_0', 'Pfinishtime_0'] },
            // 时间段内转移到
            { lang: 'acct_124', p: 'PinTimeForward_0' },
            // 时间段外转移到
            { lang: 'acct_125', p: 'PoutTimeForward_0' },
            // 开启遇忙转移
            { lang: 'acct_126', p: 'PbusyForwardEnable_0' },
            // 本地忙到
            { lang: 'acct_127', p: 'PbusyForward_0' },
            // 开启无应答转移
            { lang: 'acct_128', p: 'PdelayedForwardEnable_0' },
            // 无应答到
            { lang: 'acct_129', p: 'PdelayedForward_0' },
            // 无应答超时时间
            { lang: 'acct_130', p: 'P139' },
            // 开启勿扰转移
            { lang: 'acct_131', p: 'PdndForwardEnable_0' },
            // 勿扰时到
            { lang: 'acct_132', p: 'PdndForward_0' },
            // 铃声
            { lang: 'c_137', p: ['P1488', 'P1489', 'P1490', 'P1491', 'P1492', 'P1493'] }
          ]
        }
      ]
    },
    {
      label: 'IPVT',
      lang: 'r_065',
      path: 'ipvt',
      denyRole: 'user',
      sub: [
        {
          label: 'General',
          lang: 'r_014',
          path: 'general',
          sub: [
            // 开启IPVideoTalk服务
            { lang: 'acct_133', p: 'P7059', reboot: 1 },
            // 帐号激活
            { lang: 'acct_001', p: 'P401' },
            // 显示名称
            { lang: 'acct_009', p: 'P407' },
            // SIP传输
            { lang: 'acct_039', p: 'P448' }
          ]
        },
        {
          label: 'Codec',
          lang: 'r_045',
          path: 'codec',
          sub: [
            // 视频编码
            { lang: 'acct_085', p: ['P464', 'P465'] }
          ]
        },
        {
          label: 'Call',
          lang: 'r_046',
          path: 'call',
          sub: [
            // 空闲时自动接听
            { lang: 'acct_135', p: 'P425' },
            // 常用布局模式
            { lang: 'acct_104', p: 'P29170', denyModel: 'GVC3220' }
          ]
        }
      ]
    },
    {
      label: 'H323',
      lang: 'r_067',
      path: 'h323',
      denyRole: 'user',
      sub: [
        {
          label: 'General',
          lang: 'r_014',
          path: 'general',
          sub: [
            // 帐号激活
            { lang: 'acct_001', p: 'P25059' },
            // 开启GK
            { lang: 'acct_136', p: 'P25032' },
            // 开启H.460
            { lang: 'acct_137', p: 'P25066' },
            // GK发现模式
            { lang: 'acct_138', p: 'P25051' },
            // GK地址
            { lang: 'acct_139', p: 'P25033' },
            // 会场号码
            { lang: 'acct_140', p: 'P25034' },
            // GK认证用户名
            { lang: 'acct_141', p: 'P25035' },
            // GK认证密码
            { lang: 'acct_142', p: 'P25036', noInit: 1 },
            // 语音信箱接入号
            { lang: 'acct_153', p: 'P626' },
            // 注册期限(分钟)
            { lang: 'acct_152', p: 'P25054' },
            // H.323本地端口
            { lang: 'acct_143', p: 'P25068' },
            // 对称RTP
            { lang: 'acct_045', p: 'P25067' }

          ]
        },
        {
          label: 'Codec',
          lang: 'r_045',
          path: 'codec',
          sub: [
            // DTMF
            { lang: 'acct_058', p: 'P25049' },
            // 语音编码
            { lang: 'acct_060', p: ['P25037', 'P25038', 'P25039', 'P25040', 'P25041'] },
            // H.264视频大小
            { lang: 'acct_086', p: 'P25061' },
            // 视频比特率
            { lang: 'acct_087', p: 'P25063' },
            // 视频帧率
            { lang: 'acct_088', p: 'P25062' },
            // H.264有效荷载类型
            { lang: 'acct_089', p: 'P25064' },
            // 打包模式
            { lang: 'acct_090', p: 'P25072' }
          ]
        },
        {
          label: 'Call',
          lang: 'r_046',
          path: 'call',
          sub: [
            // 自动应答
            { lang: 'acct_109', p: 'P25048' },
            // 开启H225心跳间隔
            { lang: 'acct_144', p: 'P25058' },
            // 开启H245心跳间隔
            { lang: 'acct_145', p: 'P25057' },
            // 开启RTDR
            { lang: 'acct_146', p: 'P25060' },
            // 常用布局模式
            { lang: 'acct_104', p: 'P25073', denyModel: 'GVC3220' }
          ]
        }
      ]
    },
    // 视频会议服务平台
    {
      label: 'VideoConf',
      lang: 'r_072',
      path: 'videoconf',
      denyRole: 'user',
      sub: [
        {
          label: 'BlueJeans',
          lang: 'r_066',
          path: 'bj',
          sub: [
            {
              label: 'General',
              lang: 'r_014',
              path: 'general',
              sub: [
              // 帐号激活
                { lang: 'acct_001', p: 'P501' },
                // 显示名称
                { lang: 'acct_009', p: 'P507' }

              ]
            },
            {
              label: 'Codec',
              lang: 'r_045',
              path: 'codec',
              sub: [
              // DTMF
                { lang: 'acct_058', p: ['P2501', 'P2502'] },
                // DTMF有效荷载类型
                { lang: 'acct_059', p: 'P596' },
                // 语音编码
                { lang: 'acct_060', p: ['P551', 'P552', 'P553', 'P554'] },
                // 编码协商优先级
                { lang: 'acct_061', p: 'P29261' },
                // 静音抑制
                { lang: 'acct_062', p: 'P585' },
                // 语音帧/TX
                { lang: 'acct_063', p: 'P586' },
                // G.722.1速率
                { lang: 'acct_064', p: 'P2573' },
                // G.722.1有效荷载类型
                { lang: 'acct_065', p: 'P2574' },
                // 使用200OK SDP中首位匹配编码
                { lang: 'acct_071', p: 'P2548' },
                // 开启音频前向纠错
                { lang: 'acct_072', p: 'P26273' },
                // 音频FEC有效荷载类型
                { lang: 'acct_073', p: 'P26274' },
                // 音频RED有效荷载类型
                { lang: 'acct_074', p: 'P26275' },

                // 支持RFC5168
                { lang: 'acct_075', p: 'P578' },
                // 丢包重传
                { lang: 'acct_076', p: 'P26285' },
                // 开启视频前向纠错
                { lang: 'acct_077', p: 'P2593' },
                // FEC有效荷载类型
                { lang: 'acct_078', p: 'P2594' },
                // SDP带宽属性
                { lang: 'acct_082', p: 'P2560' },
                // 视频抖动缓冲区最大值(ms)
                { lang: 'acct_083', p: 'P2581' },
                // H.264视频大小
                { lang: 'acct_086', p: 'P2507' },
                // 视频比特率
                { lang: 'acct_087', p: 'P2515' },
                // 视频帧率
                { lang: 'acct_088', p: 'P25006' },
                // H.264有效荷载类型
                { lang: 'acct_089', p: 'P562' },
                // 打包模式
                { lang: 'acct_090', p: 'P26205' },
                // H.264 Profile 类型
                { lang: 'acct_091', p: 'P2562' },
                // 使用H.264 Constrained Profiles
                { lang: 'acct_092', p: 'P26245' },

                // 禁止演示
                { lang: 'acct_094', p: 'P26201' },
                // 初始INVITE携带媒体信息
                { lang: 'acct_095', p: 'PsendPreMode_2' },
                // 演示H.264 视频大小
                { lang: 'acct_096', p: 'P2576' },
                // 演示H.264 Profile类型
                { lang: 'acct_097', p: 'P2577' },
                // 演示视频速率
                { lang: 'acct_098', p: 'P2578' },
                // 演示视频帧率
                { lang: 'acct_099', p: 'P26242' }
              ]
            },
            {
              label: 'Call',
              lang: 'r_046',
              path: 'call',
              sub: [
              // 呼叫日志
                { lang: 'acct_112', p: 'P542' },
                // #键拨号
                { lang: 'acct_117', p: 'P592' },
                // 上传本地MOH音频文件
                { lang: 'acct_118', _p: 'MOHUploadProps' },
                // 开启本地MOH功能
                { lang: 'acct_119', p: 'P2557' },
                // 常用布局模式
                { lang: 'acct_104', p: 'P29270', denyModel: 'GVC3220' }
              ]
            }
          ]
        },
        {
          label: 'Zoom',
          lang: 'r_073',
          path: 'zoom',
          sub: [
            {
              label: 'General',
              lang: 'r_014',
              path: 'general',
              sub: [
                // 帐号激活
                { lang: 'acct_001', p: 'P1801' },
                // Zoom服务器
                { lang: 'acct_151', p: 'P1802' },
                // 显示名称
                { lang: 'acct_009', p: 'P1807' }

              ]
            },
            {
              label: 'SIP',
              lang: 'r_064',
              path: 'sip',
              sub: [
                // SIP传输
                { lang: 'acct_039', p: 'P1848' },
                // 重新注册前注销
                { lang: 'acct_018', p: 'P1811' },
                // 注册期限(分钟)
                { lang: 'acct_019', p: 'P1812' },
                // 注册期限内重新注册等待时间(秒)
                { lang: 'acct_020', p: 'P2830' },
                // 订阅超时(分钟)
                { lang: 'acct_021', p: 'P26551' },
                // 重试注册间隔时间(秒)
                { lang: 'acct_022', p: 'P1871' },
                // 本地SIP端口
                { lang: 'acct_023', p: 'P1813' },
                // 支持MWI
                { lang: 'acct_024', p: 'P1815' },
                // 开启会话超时
                { lang: 'acct_025', p: 'P1834' },
                // 会话超时时间(秒)
                { lang: 'acct_026', p: 'Psessionexp_5' },
                // 最小超时时间(秒)
                { lang: 'acct_027', p: 'P1827' },
                // UAC指定刷新对象
                { lang: 'acct_028', p: 'P1832' },
                // UAS指定刷新对象
                { lang: 'acct_029', p: 'P1833' },
                // 强制INVITE
                { lang: 'acct_030', p: 'P1831' },
                // 主叫请求计时
                { lang: 'acct_031', p: 'P1828' },
                // 被叫请求计时
                { lang: 'acct_032', p: 'P1829' },
                // 强制计时
                { lang: 'acct_033', p: 'P1830' },
                // 开启100rel
                { lang: 'acct_034', p: 'P1835' },
                // 来电ID显示
                { lang: 'acct_035', p: 'P2824' },
                // 使用Privacy头域
                { lang: 'acct_036', p: 'P2838' },
                // 使用P-Preferred-Identity头域
                { lang: 'acct_037', p: 'P2839' },
                // 使用MAC头域
                { lang: 'acct_038', p: 'P29590' },
                // 在User-Agent添加MAC
                { lang: 'acct_150', p: 'P26561' },
                // SIP传输
                { lang: 'acct_039', p: 'P1875' },
                // RTP IP过滤
                { lang: 'acct_040', p: 'P26526' },
                // RTP超时（秒）
                { lang: 'acct_041', p: 'P29568' },
                // TLS使用的SIP URI格式
                { lang: 'acct_042', p: 'P2829' },
                // TCP/TLS Contact使用实际临时端口
                { lang: 'acct_043', p: 'P2831' },
                // RFC2543 Hold
                { lang: 'acct_044', p: 'P26562' },
                // 对称RTP
                { lang: 'acct_045', p: 'P1860' },
                // 支持SIP实例ID
                { lang: 'acct_046', p: 'P1889' },
                // 验证入局SIP消息
                { lang: 'acct_047', p: 'P2806' },
                // 检查来电INVITE的SIP用户ID
                { lang: 'acct_048', p: 'P1849' },
                // 验证来电INVITE
                { lang: 'acct_049', p: 'P2846' },
                // 用于Challenge INVITE ＆ NOTIFY的SIP Realm
                { lang: 'acct_050', p: 'P26521' },
                // 仅接受已知服务器的SIP请求
                { lang: 'acct_051', p: 'P2847' },
                // SIP T1超时时间
                { lang: 'acct_052', p: 'P1840' },
                // SIP T2间隔时间
                { lang: 'acct_053', p: 'P1841' },
                // SIP Timer D间隔时间
                { lang: 'acct_054', p: 'P2887' },
                // 从路由移除OBP
                { lang: 'acct_055', p: 'P2805' },
                // 检查域名证书
                { lang: 'acct_056', p: 'P2811' },
                // 验证证书链
                { lang: 'acct_057', p: 'P2867' }
              ]
            },
            {
              label: 'Codec',
              lang: 'r_045',
              path: 'codec',
              sub: [
                // DTMF
                { lang: 'acct_058', p: ['P2801', 'P2802', 'P2803'] },
                // DTMF有效荷载类型
                { lang: 'acct_059', p: 'P1896' },
                // 语音编码
                { lang: 'acct_060', p: ['P1851', 'P1852', 'P1853', 'P1854', 'P1855', 'P1856', 'P1857', 'P1858'] },
                // 编码协商优先级
                { lang: 'acct_061', p: 'P29561' },
                // 静音抑制
                { lang: 'acct_062', p: 'P1885' },
                // 语音帧/TX
                { lang: 'acct_063', p: 'P1886' },
                // G.722.1速率
                { lang: 'acct_064', p: 'P2873' },
                // G.722.1有效荷载类型
                { lang: 'acct_065', p: 'P2874' },
                // G.722.1C 速率
                { lang: 'acct_066', p: 'P26517' },
                // G.722.1C有效荷载类型
                { lang: 'acct_067', p: 'P26516' },
                // Opus有效荷载类型
                { lang: 'acct_068', p: 'P2885' },
                // iLBC帧大小
                { lang: 'acct_069', p: 'P1895' },
                // 使用200OK SDP中首位匹配编码
                { lang: 'acct_071', p: 'P2848' },
                // 开启音频前向纠错
                { lang: 'acct_072', p: 'P26573' },
                // 音频FEC有效荷载类型
                { lang: 'acct_073', p: 'P26574' },
                // 音频RED有效荷载类型
                { lang: 'acct_074', p: 'P26575' },

                // 支持RFC5168
                { lang: 'acct_075', p: 'P1878' },
                // 丢包重传
                { lang: 'acct_076', p: 'P26585' },
                // 开启视频前向纠错
                { lang: 'acct_077', p: 'P2893' },
                // FEC有效荷载类型
                { lang: 'acct_078', p: 'P2894' },
                // //视频前向纠错模式
                // { lang: 'acct_070', p: 'P26522' },
                // 开启FECC
                { lang: 'acct_080', p: 'P26504' },
                // FECC H.224有效荷载类型
                { lang: 'acct_081', p: 'P26508' },
                // SDP带宽属性
                { lang: 'acct_082', p: 'P2860' },
                // 视频抖动缓冲区最大值(ms)
                { lang: 'acct_083', p: 'P2881' },
                // 开启视频渐进刷新
                { lang: 'acct_084', p: 'P25111' }, // enable GDR
                // 视频编码
                { lang: 'acct_085', p: ['P1864', 'P1865'] },
                // H.264 视频大小
                { lang: 'acct_086', p: 'P2807' },
                // 视频比特率
                { lang: 'acct_087', p: 'P2815' },
                // 视频帧率
                { lang: 'acct_088', p: 'P25008' },
                // H.264有效荷载类型
                { lang: 'acct_089', p: 'P1862' },
                // 打包模式
                { lang: 'acct_090', p: 'P26505' },
                // H.264 Profile 类型
                { lang: 'acct_091', p: 'P2862' },
                // 使用H.264 Constrained Profiles
                { lang: 'acct_092', p: 'P26545' },
                // H.265有效荷载类型
                { lang: 'acct_093', p: 'P26586' },

                // 禁止演示
                { lang: 'acct_094', p: 'P26501' },
                // 初始INVITE携带媒体信息
                { lang: 'acct_095', p: 'PsendPreMode_5' },
                // 演示H.264 视频大小
                { lang: 'acct_096', p: 'P2876' },
                // 演示H.264 Profile类型
                { lang: 'acct_097', p: 'P2877' },
                // 演示视频速率
                { lang: 'acct_098', p: 'P2878' },
                // 演示视频帧率
                { lang: 'acct_099', p: 'P26542' },
                // BFCP传输协议
                { lang: 'acct_100', p: 'P26541' },
                // SRTP方式
                { lang: 'acct_101', p: 'P1843' },
                // SRTP加密位数
                { lang: 'acct_102', p: 'P2883' }
              ]
            },
            {
              label: 'Call',
              lang: 'r_046',
              path: 'call',
              sub: [
                // 呼叫日志
                { lang: 'acct_112', p: 'P1842' },
                // #键拨号
                { lang: 'acct_117', p: 'P1892' },
                // 上传本地MOH音频文件
                { lang: 'acct_118', _p: 'MOHUploadProps' },
                // 开启本地MOH功能
                { lang: 'acct_119', p: 'P2857' },
                // 常用布局模式
                { lang: 'acct_104', p: 'P29570', denyModel: 'GVC3220' }
              ]
            }
          ]
        }
      ]
    }
  ]
}
