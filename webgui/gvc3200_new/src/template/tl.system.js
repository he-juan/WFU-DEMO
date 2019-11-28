export default {
  label: 'System',
  lang: 'r_005',
  path: 'sys',
  sub: [
    {
      label: 'Power',
      lang: 'r_023',
      path: 'power',
      sub: [
        // 超时操作
        { lang: 'sys_pow_001', _p: 'policy' },
        // 超时时间
        { lang: 'sys_pow_002', _p: 'sleepmode' },
        // 重启设备
        { lang: 'sys_pow_003', _p: 'reboot' },
        // 睡眠
        { lang: 'sys_pow_004', _p: 'sleep' },
        // 关机
        { lang: 'sys_pow_005', _p: 'shutdown' }
      ]
    },
    {
      label: 'TimeAndLang',
      lang: 'r_024',
      path: 'timelang',
      sub: [
        {
          label: 'Time',
          lang: 'r_049',
          path: 'power',
          sub: [
            // 指定网络时间协议服务器地址 1
            { lang: 'sys_tl_001', p: 'P30' },
            // 指定网络时间协议服务器地址 2
            { lang: 'sys_tl_002', p: 'P8333' },
            // 设置日期
            { lang: 'sys_tl_007', _p: 'DatePicker' },
            // 设置时间
            { lang: 'sys_tl_008', _p: 'TimePicker' },
            // 时区
            { lang: 'sys_tl_009', _p: 'timezone' },
            // 启动DHCP option 42设定NTP服务器
            { lang: 'sys_tl_003', p: 'P144', reboot: '1' },
            // 启动DHCP option 2设定时区
            { lang: 'sys_tl_004', p: 'P143', reboot: '1' },
            // 使用24小时格式
            { lang: 'sys_tl_005', p: 'P122' },
            // 日期显示格式
            { lang: 'sys_tl_006', p: 'P102' }
          ]
        },
        {
          label: 'Language',
          lang: 'r_050',
          path: 'lang',
          sub: [
            // 语言选择
            { lang: 'sys_tl_010', _p: 'curLanguage' },
            // 选择语言文件
            { lang: 'sys_tl_011', _p: 'importlan' }
          ]
        }
      ]
    },
    {
      label: 'TR069',
      lang: 'r_025',
      path: 'tr069',
      sub: [
        // 打开TR069
        { lang: 'sys_tr_001', p: 'P1409', reboot: 1 },
        // ACS源
        { lang: 'sys_tr_002', p: 'P4503' },
        // ACS用户名
        { lang: 'sys_tr_003', p: 'P4504' },
        // ACS密码
        { lang: 'sys_tr_004', p: 'P4505', noInit: 1 },
        // 开启定时连接
        { lang: 'sys_tr_005', p: 'P4506' },
        // 定时连接间隔(秒)
        { lang: 'sys_tr_006', p: 'P4507' },
        // ACS连接请求用户名
        { lang: 'sys_tr_007', p: 'P4511' },
        // ACS连接请求密码
        { lang: 'sys_tr_008', p: 'P4512', noInit: 1 },
        // ACS连接请求端口
        { lang: 'sys_tr_009', p: 'P4518' },
        // CPE证书
        { lang: 'sys_tr_010', p: 'P8220', noInit: 1 },
        // CPE证书密码
        { lang: 'sys_tr_011', p: 'P8221', noInit: 1 }
      ]
    },
    // Security settings 其中 UserInfoManage ScreenLock SIPTLS CertManage 不需要获取初始配置
    {
      label: 'Security',
      lang: 'r_026',
      path: 'security',
      denyRole: 'user',
      sub: [
        {
          label: 'WebSSHAccess',
          lang: 'r_051',
          path: 'webssh',
          sub: [
            // 禁止SSH访问
            { lang: 'sys_sec_001', p: 'P276' },
            // 访问方式
            { lang: 'sys_sec_002', p: 'P900' },
            // 端口号
            { lang: 'sys_sec_003', p: 'P901' }
          ]
        },
        {
          label: 'UserInfoManage',
          lang: 'r_052',
          path: 'userinfo',
          sub: [
            // 当前管理员密码
            { lang: 'sys_sec_004_1', _p: 'curadmipwd' },
            // 管理员新密码
            { lang: 'sys_sec_005', p: 'P2', noInit: 1 },
            // 确认管理员新密码
            { lang: 'sys_sec_006', _p: 'adminpasswd2' },
            // 用户新密码
            { lang: 'sys_sec_007', p: 'P196', noInit: 1 },
            // 确认用户新密码
            { lang: 'sys_sec_008', _p: 'userpasswd2' }
          ]
        },
        {
          label: 'ScreenLock',
          lang: 'r_053',
          path: 'screenlock',
          sub: [
            // 删除锁屏密码
            { lang: 'sys_sec_009', _p: 'deletelock' },
            // 锁屏密码
            { lang: 'sys_sec_010', _p: 'newlock' },
            // 确认锁屏密码
            { lang: 'sys_sec_011', _p: 'renewlock' }
          ]
        },
        {
          label: 'SIPTLS',
          lang: 'r_068',
          path: 'siptls',
          sub: [
            // 最小TLS版本
            { lang: 'sys_sec_020', p: 'P22293' },
            // 最大TLS版本
            { lang: 'sys_sec_021', p: 'P22294' },
            // SIP TLS验证
            { lang: 'sys_sec_012', p: 'P280', noInit: 1 },
            // SIP TLS私钥
            { lang: 'sys_sec_013', p: 'P279', noInit: 1 },
            // SIP TLS私钥密码
            { lang: 'sys_sec_014', p: 'P281', noInit: 1 }
          ]
        },
        {
          label: 'CertManage',
          lang: 'r_054',
          path: 'certmanage',
          sub: []
        }
      ]
    },
    // 外围设备
    {
      label: 'Peripheral',
      lang: 'r_029',
      path: 'peripheral',
      sub: [
        {
          label: 'HDMI',
          lang: 'r_074',
          path: 'hdmi',
          sub: [
            // HDMI 1输出分辨率
            { lang: 'sys_per_001', _p: 'HDMI1Res' },
            // HDMI 2输出分辨率
            { lang: 'sys_per_002', _p: 'HDMI2Res' },
            // 自动开启演示
            { lang: 'sys_per_003', p: 'P25109' }
          ]
        },
        {
          label: 'Camera',
          lang: 'r_075',
          path: 'camera',
          sub: [
            // 移动速度
            { lang: 'sys_per_004', p: 'P25029' },
            // 初始化位置
            { lang: 'sys_per_005', p: 'P25030' }
          ]
        },
        // 无线麦
        {
          label: 'WirelessMic',
          lang: 'r_076',
          path: 'wirelessmic',
          sub: []
        },
        // Media
        {
          label: 'Media',
          lang: 'r_077',
          path: 'media',
          sub: []
        }
      ]
    }
  ]
}
