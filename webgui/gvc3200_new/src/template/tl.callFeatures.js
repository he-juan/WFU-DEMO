export default {
  label: 'CallFeature',
  lang: 'r_003',
  path: 'callset',
  sub: [
    {
      label: 'General',
      lang: 'r_014',
      path: 'general',
      denyRole: 'user',
      sub: [
        // 本地RTP端口
        { lang: 'call_001', p: 'P39' },
        // 使用随机端口
        { lang: 'call_002', p: 'P78' },
        // 心跳间隔
        { lang: 'call_003', p: 'P84' },
        // STUN/TURN服务器
        { lang: 'call_004', p: 'P76' },
        // TURN服务器用户名
        { lang: 'call_005', p: 'P22042' },
        // TURN服务器密码
        { lang: 'call_006', p: 'P22043', noInit: 1 },
        // 使用NAT IP
        { lang: 'call_007', p: 'P101' }
      ]
    },
    {
      label: 'CallFeature',
      lang: 'r_003',
      path: 'callfeature',
      sub: [
        // 开启呼叫等待音
        { lang: 'call_008', p: 'P186' },
        // 开启勿扰模式提醒音
        { lang: 'call_009', p: 'P1486' },
        // 接通时自动静音
        { lang: 'call_010', p: 'P29607' },
        // 将SIP URI中的"#"转义成%23
        { lang: 'call_011', p: 'P1406' },
        // 允许通话中DTMF显示
        { lang: 'call_012', p: 'P338' },
        // 过滤字符集
        { lang: 'call_013', p: 'P22012' },
        // 开启呼叫等待
        { lang: 'call_014', p: 'P91' },
        // 启用IP拨打模式
        { lang: 'call_015', p: 'P277' }
      ]
    },
    {
      label: 'SiteName',
      lang: 'r_016',
      path: 'sitename',
      denyRole: 'user',
      sub: [
        // 会场名称
        { lang: 'call_016', p: 'P29764' },
        // 背景透明度
        { lang: 'call_017', p: 'P29765' },
        // 显示位置
        { lang: 'call_018', p: 'P29766' },
        // 显示时间
        { lang: 'call_019', p: 'P29767' },
        // 字体颜色
        { lang: 'call_020', p: 'P29772' },
        // 字体大小
        { lang: 'call_021', p: 'P29768' },
        // 是否加粗
        { lang: 'call_022', p: 'P29769' },
        // 水平偏移
        { lang: 'call_023', p: 'P29770' },
        // 垂直偏移
        { lang: 'call_024', p: 'P29771' }
        // // 会场名称
        // { lang: 'call_016', _p: 'sitename' },
        // // 背景透明度
        // { lang: 'call_017', _p: 'bgtp' },
        // // 显示位置
        // { lang: 'call_018', _p: 'dispos' },
        // // 显示时间
        // { lang: 'call_019', _p: 'disdura' },
        // // 字体颜色
        // { lang: 'call_020', _p: 'fontcolor' },
        // // 字体大小
        // { lang: 'call_021', _p: 'fontsize' },
        // // 是否加粗
        // { lang: 'call_022', _p: 'bold' },
        // // 水平偏移
        // { lang: 'call_023', _p: 'horizont' },
        // // 垂直偏移
        // { lang: 'call_024', _p: 'vertical' }
      ]
    },
    {
      label: 'AudioControl',
      lang: 'r_017',
      path: 'audio',
      denyRole: 'user',
      sub: [
        // 回声延迟
        { lang: 'call_025', p: 'P22280' },
        // 铃声音量
        { lang: 'call_026', _p: 'curRing' },
        // 媒体音量
        { lang: 'call_027', _p: 'curMedia' },
        // 设备铃声
        { lang: 'call_028', _p: 'sysRingtone' },
        // 通知铃声
        { lang: 'call_029', _p: 'notifyRingtone' },
        // 音频设备
        { lang: 'call_030', _p: 'curAudioDev' },
        // 音频设备
        // { lang: 'call_030', p: 'P22050' },
        // 音频回声抑制等级
        // { lang: 'call_039', p: 'Pecholevel'},
        // 回铃音
        { lang: 'call_031', p: 'P4001' },
        // 忙音
        { lang: 'call_032', p: 'P4002' },
        // 续订音
        { lang: 'call_033', p: 'P4003' },
        // 确认铃音
        { lang: 'call_034', p: 'P4004' },
        // 默认振铃音
        { lang: 'call_035', p: 'P4040' }
      ]
    },
    {
      label: 'VideoSettings',
      lang: 'r_018',
      path: 'video',
      denyRole: 'user',
      sub: [
        // 自动开始视频
        { lang: 'call_036', p: 'P25023' },
        // 视频显示模式
        { lang: 'call_037', p: 'P921' },
        // 触发视频解码跳帧
        { lang: 'call_038', p: 'P22008' }
      ]
    }
  ]
}
