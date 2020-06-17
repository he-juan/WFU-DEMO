export default {
  label: 'DeviceControl',
  lang: 'r_006',
  path: 'dev',
  sub: [
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
