/* eslint-disable no-multiple-empty-lines */
export default {
  /* LDAP Contacts */
  app_ldap_001: 'Connection Mode',
  app_ldap_001_tip: 'Configures to use LDAP or LDAPS to connect.',

  app_ldap_002: 'Server Address',
  app_ldap_002_tip: 'LDAP server address, the value can be IP or Domain name.',

  app_ldap_003: 'Port Number',
  app_ldap_003_tip: 'LDAP server port.',

  app_ldap_004: 'Base Dn',
  app_ldap_004_tip: 'Searching root directory of the server.',

  app_ldap_005: 'User Name(Binding DN)',
  app_ldap_005_tip: 'User name for loging in the server.',

  app_ldap_006: 'Password',
  app_ldap_006_tip: 'Password for loging out the server.',

  app_ldap_007: 'Ldap Name Attributes',
  app_ldap_007_tip: 'This setting specifies the “name” attributes of each record which are returned in the LDAP search result. The setting allows the users to configure multiple space separated name attributes. Example: gn cn sn description',

  app_ldap_008: 'Ldap Number Attributes',
  app_ldap_008_tip: 'Specifies the “number” attributes of each record which are returned in the LDAP search result. This field allows users to configure multiple space separated number attributes.Example: telephoneNumber telephoneNumber Mobile',

  app_ldap_009: 'Ldap Mail Attributes',
  app_ldap_009_tip: 'Specifies the “mail“ attributes of each record which are returned in the LDAP search result. This field allows users to configure multiple space separated E-Mail attributes.Example: mail mail mailBox',

  app_ldap_010: 'Ldap Name Filter',
  app_ldap_010_tip: 'Configures the filter used for name lookups. Examples: (|(cn=%)(sn=%)) returns all records which has the “cn“ or “sn“ field containing with the entered filter value;(!(sn=%)) returns all the records which do not have the “sn“ field containing with the entered filter value;(&(cn=%) (telephoneNumber=*)) returns all the records with the “cn“ field containing with the entered filter value and “telephoneNumber“ field set.',

  app_ldap_011: 'Ldap Number Filter',
  app_ldap_011_tip: 'Configures the filter used for number lookups. Examples:(|(telephoneNumber=%)(Mobile=%) returns all records which has the “telephoneNumber“ or “Mobile“ field containing with the entered filter value;(&(telephoneNumber=%) (cn=*)) returns all the records with the “telephoneNumber“ field containing with the entered filter value and “cn“ field set.',

  app_ldap_012: 'Ldap Mail Filter',
  app_ldap_012_tip: 'Configures the filter used for E-Mail lookups.Examples:(|(mail=%)(mailBox=%)) returns all records which has the “mail“ or “mailBox“ field containing with the entered filter value;(!(mail=%)) returns all the records which do not have the “mail“ field containing with the entered filter value;(&(mail=%) (cn=*)) returns all the records with the “mail“ field containing with the entered filter value and “cn“ field set.',

  app_ldap_013: 'Ldap Displaying Name Attributes',
  app_ldap_013_tip: 'Name attributes displayed in the main interface. Example: cn sn telephoneNumber.',

  app_ldap_014: 'Max Hits',
  app_ldap_014_tip: 'The maximum query results.',

  app_ldap_015: 'Search Timeout (s)',
  app_ldap_015_tip: 'Configures the search timeout value. If exceeds the value and the server does not response, then stop searching. The default setting is 30.',

  app_ldap_016: 'Ldap Lookup When Dialing',
  app_ldap_016_tip: 'If set to "Yes", the device will do LDAP search at the beginning of the outgoing call. The default setting is "Disable".',

  app_ldap_017: 'Search Ldap For Incoming Call',
  app_ldap_017_tip: 'If set to "Yes", the device will do LDAP search when there is an incoming call. The default setting is "Disable".',

  // app_ldap_018: 'Ldap Dialing Default Account',
  // app_ldap_018_tip: 'Configures the default account that being used when dialing LDAP contact. ',

  /* 第三方应用 */
  app_tpapp_001: 'Auto Launch Application On Start Up',
  app_tpapp_001_tip: ' If set to "Yes", the Remote Control App can be paired to the GVC3200 via Bluetooth, but it cannot connect to the GVC3200 to perform any operations. The default setting is "No".',

  app_999: ''
}
