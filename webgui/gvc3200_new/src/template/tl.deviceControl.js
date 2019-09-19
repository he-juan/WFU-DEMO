export default {
  label: 'DeviceControl',
  lang: 'r_006',
  path: 'dev',
  sub: [
    {
      label: 'Peripheral',
      lang: 'r_029',
      path: 'peripheral',
      sub: [
        // HDMI 1输出分辨率
        { lang: 'dev_per_001', _p: 'HDMI1Res' },
        // HDMI 2输出分辨率
        { lang: 'dev_per_002', _p: 'HDMI2Res' },
        // 自动开启演示
        { lang: 'dev_per_003', p: 'P25109' },
        // 移动速度
        { lang: 'dev_per_004', p: 'P25029' },
        // 初始化位置
        { lang: 'dev_per_005', p: 'P25030' }
      ]
    },
    {
      label: 'RemoteControl',
      lang: 'r_030',
      path: 'remoteconrol',
      sub: [
        // 禁止手机遥控器连接
        { lang: 'dev_rc_001', p: 'P25022' }
      ]
    }
  ]
}
