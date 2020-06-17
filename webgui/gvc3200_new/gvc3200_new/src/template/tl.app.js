export default {
  label: 'App',
  lang: 'r_007',
  path: 'app',
  sub: [
    {
      label: 'LDAPContacts',
      lang: 'r_031',
      path: 'ldap',
      sub: [
        // 连接模式
        { lang: 'app_ldap_001', p: 'P8037' },
        // 服务器地址
        { lang: 'app_ldap_002', p: 'P8020' },
        // 端口号
        { lang: 'app_ldap_003', p: 'P8021' },
        // 根节点
        { lang: 'app_ldap_004', p: 'P8022' },
        // 用户名(绑定节点)
        { lang: 'app_ldap_005', p: 'P8023' },
        // 密码
        { lang: 'app_ldap_006', p: 'P8024', noInit: 1 },
        // LDAP名字属性
        { lang: 'app_ldap_007', p: 'P8028' },
        // LDAP号码属性
        { lang: 'app_ldap_008', p: 'P8029' },
        // LDAP邮件属性
        { lang: 'app_ldap_009', p: 'P8038' },
        // LDAP名字筛选规则
        { lang: 'app_ldap_010', p: 'P8026' },
        // LDAP号码筛选规则
        { lang: 'app_ldap_011', p: 'P8025' },
        // LDAP邮箱筛选规则
        { lang: 'app_ldap_012', p: 'P8039' },
        // LDAP显示名属性
        { lang: 'app_ldap_013', p: 'P8030' },
        // 最大返回条数
        { lang: 'app_ldap_014', p: 'P8031' },
        // 搜索超时(秒)
        { lang: 'app_ldap_015', p: 'P8032' },
        // 拨号时进行LDAP查找
        { lang: 'app_ldap_016', p: 'P8034' },
        // 来电时进行LDAP查找
        { lang: 'app_ldap_017', p: 'P8035' }
      ]
    },
    {
      label: 'BroadSoftDir',
      lang: 'r_083',
      path: 'broadsoftdir',
      denyRole: 'user',
      sub: [
        {
          label: 'XSIService',
          lang: 'r_085',
          path: 'xsi',
          sub: [
            { lang: 'app_bro_001', p: 'P22054' },
            { lang: 'app_bro_002', p: 'P1591' },
            { lang: 'app_bro_003', p: 'P1592' },
            { lang: 'app_bro_004', p: 'P2937' },
            { lang: 'app_bro_005', p: 'P22034' },
            { lang: 'app_bro_007', p: 'P1593' },
            { lang: 'app_bro_008', p: 'P1594', noInit: 1 },
            { lang: 'app_bro_006', p: 'P22103', noInit: 1 },
            { lang: 'app_bro_009', _p: 'bsinterval' },
            { lang: 'app_bro_010', p: 'P22014' },
            { lang: 'app_bro_011', p: 'Pxsi_call_accountid' },
            { lang: 'app_bro_012', p: 'Pbs_contacts_order' }
          ]
        },
        {
          label: 'NetworkDir',
          lang: 'r_086',
          path: 'networkdir',
          sub: [

          ]
        }
      ]
    },
    {
      label: 'RecordingManage',
      lang: 'r_032',
      path: 'record',
      sub: [
        // 录像列表
        {},
        // 设置
        {
          label: 'RecordingConfig',
          lang: 'r_079',
          path: 'config',
          sub: [
            { lang: 'app_rec_001', _p: 'record_path' },
            // 录制模式
            { lang: 'app_rec_002', p: 'Pvideo_record_mode' }
          ]
        }
      ]
    },
    {
      label: 'ThirdPartyApp',
      lang: 'r_070',
      path: 'tpapp',
      sub: [
        // 开机自启动应用
        { lang: 'app_tpapp_001', p: 'Pconfig_user_app' }
      ]
    }
  ]
}
