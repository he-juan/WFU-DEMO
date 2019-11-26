export default {
  label: 'Maintenance',
  lang: 'r_008',
  path: 'maintenance',
  sub: [
    {
      label: 'Upgrade',
      lang: 'r_033',
      path: 'upgrade',
      denyRole: 'user',
      sub: [
        {
          label: 'Firmware',
          lang: 'r_055',
          path: 'firmware',
          sub: [
            // 完全升级
            { lang: 'mai_up_001', p: 'Pupgradeall' },
            // 上传固件文件更新
            { lang: 'mai_up_002', _p: 'upgradefile', reboot: 1 },
            // 固件升级方式
            { lang: 'mai_up_003', p: 'P6767' },
            // 固件服务器路径
            { lang: 'mai_up_004', p: 'P192' },
            // HTTP/HTTPS用户名称
            { lang: 'mai_up_005', p: 'P6768' },
            // HTTP/HTTPS密码
            { lang: 'mai_up_006', p: 'P6769' },
            // 固件文件前缀
            { lang: 'mai_up_007', p: 'P232' },
            // 固件文件后缀
            { lang: 'mai_up_008', p: 'P233' }
          ]
        },
        {
          label: 'ConfigFile',
          lang: 'r_056',
          path: 'configfile',
          sub: [
            // 使用Grandstream GAPS
            { lang: 'mai_up_009', _p: 'usegsgap' },
            // 配置文件升级方式
            { lang: 'mai_up_010', p: 'P212' },
            // 配置服务器路径
            { lang: 'mai_up_011', p: 'P237' },
            // 配置文件HTTP/HTTPS用户名称
            { lang: 'mai_up_012', p: 'P1360' },
            // 配置文件HTTP/HTTPS密码
            { lang: 'mai_up_013', p: 'P1361' },
            // 总是发送HTTP基本认证信息
            { lang: 'mai_up_014', p: 'P20713' },
            // 配置文件前缀
            { lang: 'mai_up_015', p: 'P234' },
            // 配置文件后缀
            { lang: 'mai_up_016', p: 'P235' },
            // 认证配置文件
            { lang: 'mai_up_017', p: 'P240' },
            // XML配置文件密码
            { lang: 'mai_up_018', p: 'P1359' },
            // 下载当前配置
            { lang: 'mai_up_019', _p: 'downConf' },
            // 上传设备配置
            { lang: 'mai_up_020', _p: 'importcfg', reboot: 1 },
            // GUI自定义文件下载方式
            { lang: 'mai_up_021', p: 'P6775' },
            // GUI自定义文件URL
            { lang: 'mai_up_022', p: 'P6774' },
            // GUI自定义文件HTTP/HTTPS用户名
            { lang: 'mai_up_023', p: 'P6776' },
            // GUI自定义文件HTTP/HTTPS密码
            { lang: 'mai_up_024', p: 'P6777' },
            // 使用配置文件服务器相关配置
            { lang: 'mai_up_025', p: 'P6778' }
          ]
        },
        {
          label: 'Provision',
          lang: 'r_057',
          path: 'provision',
          sub: [
            // 自动升级
            { lang: 'mai_up_026', p: 'P22296' },
            // 开启随机自动升级
            { lang: 'mai_up_033', p: 'P8458' },
            // 自动升级时间(0-23)
            { lang: 'mai_up_028', p: ['P285', 'P8459'] },
            // 每周的星期几
            { lang: 'mai_up_029', p: 'P286' },
            // 自动升级检查间隔(分)
            { lang: 'mai_up_027', p: 'P193' },
            // 固件升级和配置文件检测
            { lang: 'mai_up_030', p: 'P238' },
            // 升级时不弹出确认框
            { lang: 'mai_up_031', p: 'P1549' },
            // 配置文件部署
            { lang: 'mai_up_032', p: 'P8501' }
          ]
        },
        {
          label: 'AdvancedSettings',
          lang: 'r_022',
          path: 'advanced',
          sub: [
            // 禁用SIP NOTIFY认证
            { lang: 'mai_up_034', p: 'P4428' },
            // 验证服务器证书
            { lang: 'mai_up_035', p: 'P22030' },
            // 启动mDNS服务器设置
            { lang: 'mai_up_036', p: 'P1407', reboot: 1 },
            // 启动DHCP选项43、160和66服务器设置
            { lang: 'mai_up_037', p: 'P145', reboot: 1 },
            // 额外的DHCP选项设置
            { lang: 'mai_up_038', p: 'P8337', reboot: 1 },
            // 启动DHCP选项120服务器设置
            { lang: 'mai_up_039', p: 'P1411', reboot: 1 },
            // 3CX自动设定
            { lang: 'mai_up_040', p: 'P1414', reboot: 1 },
            // 恢复出厂设置
            { lang: 'mai_up_041', _p: 'reset' }
          ]
        }
      ]
    },
    {
      label: 'TroubleShooting',
      lang: 'r_034',
      path: 'trouble',
      sub: [
        {
          label: 'Syslog',
          lang: 'r_058',
          path: 'syslog',
          sub: [
            // 系统日志协议
            { lang: 'mai_tr_001', p: 'P8402' },
            // 系统日志服务器地址
            { lang: 'mai_tr_002', p: 'P207' },
            // 系统日志级别
            { lang: 'mai_tr_003', p: 'P208' },
            // 发送SIP日志
            { lang: 'mai_tr_006', p: 'P1387' },
            // 系统日志关键词过滤
            { lang: 'mai_tr_004', p: 'P22129' },
            // H.323信令日志级别
            { lang: 'mai_tr_005', p: 'P25055' }
          ]
        },
        {
          label: 'Logcat',
          lang: 'r_059',
          path: 'logcat',
          sub: [
            // 清除日志
            { lang: 'mai_tr_007', _p: 'clearLog' },
            // 日志标签
            { lang: 'mai_tr_008', _p: 'logTag' },
            // 日志优先级
            { lang: 'mai_tr_009', _p: 'logPri' }
          ]
        },
        {
          label: 'Debug',
          lang: 'r_060',
          path: 'debug',
          sub: [
            // 一键调试
            { lang: 'mai_tr_010', _p: 'debugging' },
            // 调试信息清单
            { lang: 'mai_tr_011', _p: 'debugAll' },
            // 已有调试信息列表
            { lang: 'mai_tr_012', _p: 'debugfile' },
            // 查看已有调试信息
            { lang: 'mai_tr_013', _p: 'debugInfo' },
            // 生成核心转储
            { lang: 'mai_tr_014', p: 'P29611', reboot: 1 },
            // 已有核心转储列表
            { lang: 'mai_tr_015', _p: 'coredumpfile' },
            // 查看已有核心转储
            { lang: 'mai_tr_016', _p: 'coreInfo' },
            // 录音
            { lang: 'mai_tr_017', _p: 'record' },
            // 已有录音列表
            { lang: 'mai_tr_018', _p: 'recordfile' },
            // 查看已有录音
            { lang: 'mai_tr_019', _p: 'recordInfo' }
          ]
        },
        {
          label: 'Traceroute',
          lang: 'r_061',
          path: 'traceroute',
          sub: [
            // 目标主机
            { lang: 'mai_tr_020', _p: 'targethost' }
          ]
        },
        {
          label: 'DeveloperMode',
          lang: 'r_062',
          path: 'developermode',
          sub: [
            // 开发者模式
            { lang: 'mai_tr_021', _p: 'devMode' }
          ]
        },
        {
          label: 'Ping',
          lang: 'r_069',
          path: 'ping',
          sub: [
            // 目标主机
            { lang: 'mai_tr_022', _p: 'targethost' }
          ]
        },
        {
          label: 'NSLookup',
          lang: 'r_063',
          path: 'nslookup',
          sub: [
            // 主机域名
            { lang: 'mai_tr_023', _p: 'addr' }
          ]
        },
        {
          label: 'Remotediagnosis',
          lang: 'r_071',
          path: 'remotediagnosis',
          sub: [
            // 远程诊断
            { lang: 'mai_tr_024', _p: 'mRsshtcfgswitch' }
          ]
        }
      ]
    }
  ]
}
