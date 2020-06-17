export default {
  label: 'Status',
  lang: 'r_009',
  path: 'status',
  sub: [
    {
      label: 'Network Status',
      lang: 'r_037',
      path: 'network',
      sub: [
        // MAC地址
        { lang: 'sta_001' },
        // HTTP/HTTPS代理服务器
        { lang: 'sta_002' },
        // NAT类型
        { lang: 'sta_003' },
        // VPN IP
        { lang: 'sta_004' },
        // 地址类型
        { lang: 'sta_005' },
        // IPv4地址
        { lang: 'sta_006' },
        // 子网掩码
        { lang: 'sta_007' },
        // 网关
        { lang: 'sta_008' },
        // DNS服务器1
        { lang: 'sta_009' },
        // DNS服务器2
        { lang: 'sta_010' },
        // IPv6地址类型
        { lang: 'sta_011' },
        // IPv6地址
        { lang: 'sta_012' },
        // IPv6 DNS服务器1
        { lang: 'sta_013' },
        // IPv6 DNS服务器2
        { lang: 'sta_014' },
        // IP地址
        { lang: 'sta_015' }
      ]
    },
    {
      label: 'System Info',
      lang: 'r_038',
      path: 'systeminfo',
      sub: [
        // 产品型号
        { lang: 'sta_016' },
        // 硬件版本
        { lang: 'sta_017' },
        // PN值
        { lang: 'sta_018' },
        // 系统版本
        { lang: 'sta_019' },
        // Recovery版本
        { lang: 'sta_020', denyModel: 'GVC3220' },
        // 引导程序
        { lang: 'sta_021' },
        // 内核版本
        { lang: 'sta_022' },
        // Android™版本
        { lang: 'sta_023' },
        // CPE版本
        { lang: 'sta_024' },
        // 运行时长
        { lang: 'sta_025' }
      ]
    },
    {
      label: 'Remote control Status',
      lang: 'r_039',
      path: 'remotecontrol',
      sub: [
        // 硬件版本
        { lang: 'sta_026' },
        // 软件版本
        { lang: 'sta_027' },
        // 补丁版本
        { lang: 'sta_028' },
        // 遥控器电量
        { lang: 'sta_029' }
      ]
    }
  ]
}
