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
        { lang: 'app_ldap_017', p: 'P8035' },
        // LDAP拨号默认帐号
        { lang: 'app_ldap_018', p: 'P22039' }
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
