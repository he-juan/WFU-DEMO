/* eslint-disable no-multiple-empty-lines */
export default {
  /* LDAP通讯录 */
  app_ldap_001: '连接模式',
  app_ldap_001_tip: '设置使用LDAP或者LDAPS方式进行访问连接. ',

  app_ldap_002: '服务器地址',
  app_ldap_002_tip: 'LDAP服务器地址, 可以填写IP地址或者域名.',

  app_ldap_003: '端口号',
  app_ldap_003_tip: 'LDAP服务器端口号.',

  app_ldap_004: '根节点',
  app_ldap_004_tip: '到服务器上查询的根节点, 相当于到哪个目录下查询联系人.',

  app_ldap_005: '用户名（绑定节点）',
  app_ldap_005_tip: '登陆服务器用户名.',

  app_ldap_006: '密码',
  app_ldap_006_tip: '登陆服务器密码.',

  app_ldap_007: 'LDAP名字属性',
  app_ldap_007_tip: '该设置指定LDAP搜索返回的每条记录的名字属性. 该设置允许用户配置多个名字属性, 以空格在隔开. 例如: gn <br/> cn sn description.',

  app_ldap_008: 'LDAP号码属性',
  app_ldap_008_tip: '该设置指定LDAP搜索返回的每条记录的号码属性. 该设置允许用户配置多个号码属性, 以空格在隔开. 例如: telephoneNumber <br/> telephoneNumber Mobile',

  app_ldap_009: 'LDAP邮件属性',
  app_ldap_009_tip: '该设置指定LDAP搜索返回的每条记录的邮件属性. 该设置允许用户配置多个邮件属性, 以空格在隔开. 例如: mail <br/> mail mailBox',

  app_ldap_010: 'LDAP名字筛选规则',
  app_ldap_010_tip: '配置名字查询时的过滤器. 例如: (|(cn=%)(sn=%)) 返回所有“cn”或“sn”域中有包含了指定过滤值的联系人;(!(sn=%)) 返回所有“sn”域中没有包含指定过滤值的联系人;(&(cn=%) (telephoneNumber=*)) 返回所有“cn”域中有包含了指定过滤值并且设置了“telephoneNumber“域的联系人.',

  app_ldap_011: 'LDAP号码筛选规则',
  app_ldap_011_tip: '配置号码查询时的过滤器. 例如:(|(telephoneNumber=%)(Mobile=%) 返回所有“telephoneNumber”或“Mobile”域中有包含了指定过滤值的联系人;(&(telephoneNumber=%) (cn=*)) 返回所有“telephoneNumber”域中有包含了指定过滤值并且设置了“cn“域的联系人.',

  app_ldap_012: 'LDAP邮箱筛选规则',
  app_ldap_012_tip: '配置邮件查询时的过滤器. 例如:(|(mail=%)(mailBox=%)) 返回所有“mail”或“mailBox”域中有包含了指定过滤值的联系人;(!(mail=%)) 返回所有“mail”域中没有包含指定过滤值的联系人;(&(mail=%) (cn=*)) 返回所有“mail”域中有包含了指定过滤值并且设置了“cn“域的联系人.',

  app_ldap_013: 'LDAP显示名属性',
  app_ldap_013_tip: '显示在设备上的名字属性. 例如：cn sn telephoneNumber',

  app_ldap_014: '最大返回条数',
  app_ldap_014_tip: '设置返回到LDAP服务器的最大查询结果的条数. 若设置为0,服务器将会返回所有搜索的结果. 默认设置为50.',

  app_ldap_015: '搜索超时 (秒)',
  app_ldap_015_tip: '设置搜索超时时间, 超过设置值后若服务器未响应则停止搜索. 默认设置为30. ',

  app_ldap_016: '拨号时进行LDAP查找',
  app_ldap_016_tip: '设置拨号时是否进行LDAP搜索. 默认设置为“否”. ',

  app_ldap_017: '来电时进行LDAP查找',
  app_ldap_017_tip: '设置来电号码是否进行LDAP搜索显示名. 默认设置为“否”. ',

  app_ldap_018: 'LDAP拨号默认帐号',
  app_ldap_018_tip: '123',

  /* 录像管理 */

  app_999: ''
}
