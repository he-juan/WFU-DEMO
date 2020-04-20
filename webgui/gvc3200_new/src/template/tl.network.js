export default {
  label: 'Network',
  lang: 'r_004',
  path: 'network',
  sub: [
    {
      label: 'Ethernet',
      lang: 'r_019',
      path: 'ethernet',
      sub: [
        // 首选网络协议
        { lang: 'net_001', p: 'P1415' },

        // IPv4地址类型
        { lang: 'net_002', p: 'P8' },
        // DHCP VLAN模式
        { lang: 'net_003', p: 'P8300' },
        // 主机名(Option 12)
        { lang: 'net_004', p: 'P146' },
        // 厂家类别名(Option 60)
        { lang: 'net_005', p: 'P148' },
        // IP地址
        { lang: 'net_008', p: ['P9', 'P10', 'P11', 'P12'] },
        // 子网掩码
        { lang: 'net_009', p: ['P13', 'P14', 'P15', 'P16'] },
        // 网关
        { lang: 'net_010', p: ['P17', 'P18', 'P19', 'P20'] },
        // DNS服务器1
        { lang: 'net_011', p: ['P21', 'P22', 'P23', 'P24'] },
        // DNS服务器2
        { lang: 'net_012', p: ['P25', 'P26', 'P27', 'P28'] },
        // PPPoE帐号ID
        { lang: 'net_015', p: 'P82' },
        // PPPoE密码
        { lang: 'net_016', p: 'P83' },
        // 第二层QoS 802.1Q/VLAN标记 (以太网)
        { lang: 'net_006', p: 'P51' },
        // 第二层QoS 802.1p优先级 (以太网)
        { lang: 'net_007', p: 'P87' }, //  reboot: 1

        // IPv6地址
        { lang: 'net_019', p: 'P1419' },
        // 静态IPv6地址
        { lang: 'net_021', p: 'P1420' },
        // IPv6前缀长度
        { lang: 'net_022', p: 'P1421' },
        // DNS服务器1
        { lang: 'net_011', p: 'P1424' },
        // DNS服务器2
        { lang: 'net_012', p: 'P1425' },
        // 首选DNS服务器
        { lang: 'net_020', p: 'P1423' },
        // voip通话配置
        // IPv4地址类型(voip)
        { lang: 'net_002', p: 'P22105' },
        // IP地址(voip)
        { lang: 'net_008', p: 'P22106' },
        // 子网掩码(voip)
        { lang: 'net_009', p: 'P22107' },
        // 网关(voip)
        { lang: 'net_010', p: 'P22108' },
        // DNS服务器1(voip)
        { lang: 'net_011', p: 'P22109' },
        // DNS服务器2(voip)
        { lang: 'net_012', p: 'P22110' },
        // IPv6地址(voip)
        { lang: 'net_019', p: 'P22114' },
        // 静态IPv6地址(voip)
        { lang: 'net_021', p: 'P22115' },
        // IPv6前缀长度(voip)
        { lang: 'net_022', p: 'P22116' },

        // 802.1X模式
        { lang: 'net_025', p: 'P7901' },
        // 802.1X认证信息
        { lang: 'net_026', p: 'P7902' },
        // 802.1X密码
        { lang: 'net_027', p: 'P7903' },
        // CA证书
        { lang: 'net_028', _p: '802ca' },
        // 客户证书
        { lang: 'net_029', _p: '802client' },
        // 私钥
        { lang: 'net_030', _p: '802privatekey' }

      ]
    },

    {
      label: 'WIFI',
      lang: 'r_020',
      path: 'wifi',
      sub: [
        {
          label: 'Basic',
          lang: 'r_047',
          path: 'basic',
          sub: [
            // Wi-Fi功能
            { lang: 'net_031', p: 'P7800' },
            // ESSID
            { lang: 'net_032', _p: 'ESSID' }
          ]
        },
        {
          label: 'Add',
          lang: 'r_048',
          path: 'add',
          sub: [
            // ESSID
            { lang: 'net_033', p: 'P7812' },
            // 隐藏SSID的安全模式
            { lang: 'net_034', p: 'P7830' },
            // 密码
            { lang: 'net_035', p: 'P7814', noInit: 1 }
          ]
        },
        {
          label: 'Advanced',
          lang: 'r_022',
          path: 'advanced',
          sub: [
            // 国家码
            { lang: 'net_036', p: 'P7831', reboot: 1 },
            // 主机名(Option 12)
            { lang: 'net_037', p: 'P146', denyModel: 'GVC3220' },
            // 厂家类别名(Option 60)
            { lang: 'net_038', p: 'P148', denyModel: 'GVC3220' }
          ]
        }
      ]
    },

    {
      label: 'OpenVPN',
      lang: 'r_021',
      path: 'openvpn',
      sub: [
        // 开启OpenVPN®
        { lang: 'net_039', p: 'P7050' },
        // OpenVPN® 模式
        { lang: 'net_040', p: 'P22292' },
        // 开启OpenVPN®压缩算法
        { lang: 'net_042', p: 'P8508' },
        // OpenVPN®服务器地址
        { lang: 'net_043', p: 'P7051' },
        // OpenVPN®端口
        { lang: 'net_044', p: 'P7052' },
        // OpenVPN®传输方式
        { lang: 'net_045', p: 'P2912' },
        // OpenVPN® CA
        { lang: 'net_046', _p: 'delCA' },
        // OpenVPN®客户证书
        { lang: 'net_047', _p: 'delCert' },
        // OpenVPN®客户端秘钥
        { lang: 'net_048', _p: 'delKey' },
        // OpenVPN®加密方式
        { lang: 'net_049', p: 'P8396' },
        // OpenVPN®用户名
        { lang: 'net_050', p: 'P8394' },
        // OpenVPN®密码
        { lang: 'net_051', p: 'P8395' },
        // 上传OpenVPN®配置
        { lang: 'net_041', _p: 'uploadOpenVPNFiles', reboot: 1 }
      ]
    },

    {
      label: 'Advanced',
      lang: 'r_078',
      path: 'advanced',
      denyRole: 'user',
      sub: [
        // 首选DNS服务器1
        { lang: 'net_052', p: ['P92', 'P93', 'P94', 'P95'] },
        // 首选DNS服务器2
        { lang: 'net_053', p: ['P5026', 'P5027', 'P5028', 'P5029'] },
        // 开启LLDP
        { lang: 'net_054', p: 'P1684' },
        // LLDP TX间隔 (秒)
        { lang: 'net_064', p: 'P22122', reboot: 1 },
        // 开启CDP
        { lang: 'net_055', p: 'P22119', reboot: 1 },
        // 第三层SIP QoS
        { lang: 'net_056', p: 'P1558' },
        // 第三层音频QoS
        { lang: 'net_057', p: 'P1559' },
        // 第三层视频QoS
        { lang: 'net_058', p: 'P1560' },
        // HTTP/HTTPS用户代理
        { lang: 'net_059', p: 'P1541', reboot: 1 },
        // SIP用户代理
        { lang: 'net_060', p: 'P26027' },
        // HTTP/HTTPS代理服务器主机名
        { lang: 'net_061', _p: 'proxyHostName' }, // 由p值 1552 拆分
        // HTTP/HTTPS代理服务器端口
        { lang: 'net_062', _p: 'proxyPort' }, // 由p值 1552 拆分
        // 对以下网址不使用代理
        { lang: 'net_063', p: 'P22011' }
      ]

    }
  ]
}
