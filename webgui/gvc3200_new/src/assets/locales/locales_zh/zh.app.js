/* eslint-disable no-multiple-empty-lines */
export default {
  /* LDAP通讯录 */
  app_ldap_001: '连接模式',
  app_ldap_001_tip: '设置使用LDAP或者LDAPS方式进行访问连接。 ',

  app_ldap_002: '服务器地址',
  app_ldap_002_tip: 'LDAP服务器地址, 可以填写IP地址或者域名。',

  app_ldap_003: '端口号',
  app_ldap_003_tip: 'LDAP服务器端口号。',

  app_ldap_004: '根节点',
  app_ldap_004_tip: '到服务器上查询的根节点, 相当于到哪个目录下查询联系人。',

  app_ldap_005: '用户名（绑定节点）',
  app_ldap_005_tip: '登陆服务器用户名。',

  app_ldap_006: '密码',
  app_ldap_006_tip: '登陆服务器密码。',

  app_ldap_007: 'LDAP名字属性',
  app_ldap_007_tip: '该设置指定LDAP搜索返回的每条记录的名字属性。 该设置允许用户配置多个名字属性, 以空格在隔开。 例如: gn <br/> cn sn description。',

  app_ldap_008: 'LDAP号码属性',
  app_ldap_008_tip: '该设置指定LDAP搜索返回的每条记录的号码属性。 该设置允许用户配置多个号码属性, 以空格在隔开。 例如: telephoneNumber <br/> telephoneNumber Mobile',

  app_ldap_009: 'LDAP邮件属性',
  app_ldap_009_tip: '该设置指定LDAP搜索返回的每条记录的邮件属性。 该设置允许用户配置多个邮件属性, 以空格在隔开。 例如: mail <br/> mail mailBox',

  app_ldap_010: 'LDAP名字筛选规则',
  app_ldap_010_tip: '配置名字查询时的过滤器。 例如: (|(cn=%)(sn=%)) 返回所有“cn”或“sn”域中有包含了指定过滤值的联系人;(!(sn=%)) 返回所有“sn”域中没有包含指定过滤值的联系人;(&(cn=%) (telephoneNumber=*)) 返回所有“cn”域中有包含了指定过滤值并且设置了“telephoneNumber“域的联系人。',

  app_ldap_011: 'LDAP号码筛选规则',
  app_ldap_011_tip: '配置号码查询时的过滤器。 例如:(|(telephoneNumber=%)(Mobile=%) 返回所有“telephoneNumber”或“Mobile”域中有包含了指定过滤值的联系人;(&(telephoneNumber=%) (cn=*)) 返回所有“telephoneNumber”域中有包含了指定过滤值并且设置了“cn“域的联系人。',

  app_ldap_012: 'LDAP邮件筛选规则',
  app_ldap_012_tip: '配置邮件查询时的过滤器。 例如:(|(mail=%)(mailBox=%)) 返回所有“mail”或“mailBox”域中有包含了指定过滤值的联系人;(!(mail=%)) 返回所有“mail”域中没有包含指定过滤值的联系人;(&(mail=%) (cn=*)) 返回所有“mail”域中有包含了指定过滤值并且设置了“cn“域的联系人。',

  app_ldap_013: 'LDAP显示名属性',
  app_ldap_013_tip: '显示在设备上的名字属性。 例如：cn sn telephoneNumber',

  app_ldap_014: '最大返回条数',
  app_ldap_014_tip: '设置返回到LDAP服务器的最大查询结果的条数。 若设置为0,服务器将会返回所有搜索的结果。 默认设置为50。',

  app_ldap_015: '搜索超时 (秒)',
  app_ldap_015_tip: '设置搜索超时时间, 超过设置值后若服务器未响应则停止搜索。 默认设置为30。 ',

  app_ldap_016: '拨号时进行LDAP查找',
  app_ldap_016_tip: '设置拨号时是否进行LDAP搜索。 默认设置为“否”。 ',

  app_ldap_017: '来电时进行LDAP查找',
  app_ldap_017_tip: '设置来电号码是否进行LDAP搜索显示名。 默认设置为“否”。 ',

  // app_ldap_018: 'LDAP拨号默认帐号',
  // app_ldap_018_tip: '设置拨打LDAP联系人搜索到的号码时默认使用的帐号。',

  app_rec_001: '保存路径',
  app_rec_001_tip: '设置保存路径。',

  app_rec_002: '视频录制模式',
  app_rec_002_tip: '设置视频录制模式。',

  /* 第三方应用 */
  app_tpapp_001: '开机自启动应用',
  app_tpapp_001_tip: '设置设备开机时自启动自三方应用，若设备已安装第三方应用，可选择一个应用在开机时自动开启，默认值为“禁止”。',

  app_bro_001: '认证类型',
  app_bro_001_tip: '设置使用登录方式进行认证还是使用SIP方式进行认证。若设置为“登录认证”，需要填写BroadWorks用户ID及登录密码；若设置为“SIP认证”，需要分别在BroadWorks用户ID、验证ID、验证密码处填写SIP用户名、SIP用户ID及密码。',

  app_bro_002: '服务器',
  app_bro_002_tip: '设置BroadSoft XSI服务器地址。',

  app_bro_003: '端口',
  app_bro_003_tip: '设置BroadSoft XSI服务器的端口。',

  app_bro_004: '请求路径',
  app_bro_004_tip: '设置BroadSoft XSI服务器的请求路径名。',

  app_bro_005: 'BroadWorks用户ID',
  app_bro_005_tip: '设置BroadSoft XSI服务器的用户ID。',

  app_bro_006: '登录密码',
  app_bro_006_tip: '设置BroadSoft XSI服务器的密码。',

  app_bro_007: 'SIP认证ID',
  app_bro_007_tip: '设置BroadSoft XSI服务器的用户名。',

  app_bro_008: 'SIP认证密码',
  app_bro_008_tip: '设置BroadSoft XSI服务器的密码。',

  app_bro_009: 'BroadSoft联系人及通话记录更新间隔(秒)',
  app_bro_009_tip: '设置获取BroadSoft通话记录及联系人数据的间隔时间，使拨号界面中的号码匹配数据得以更新。',

  app_bro_010: 'BroadSoft联系人返回条数',
  app_bro_010_tip: '设置BroadSoft XSI服务器联系人返回的最大条数。有效值为1-1000。 当为空时，使用服务器的默认值。',

  app_bro_011: '关联BroadSoft帐号',
  app_bro_011_tip: '此项用于设置拨打BroadSoft联系人时使用的BroadSoft帐号。',

  app_bro_012: 'BroadSoft联系人顺序',
  app_bro_012_tip: '设置BroadSoft联系人在LCD显示屏上的显示顺序。选择某条目录后点击右方的上/下箭头即可进行顺序调整。',


  app_999: ''
}
