// {
//   name: '',
//   path: '',
//   icon: '',
//   denyRole: '',
//   denyModel: '',
//   sub: ''
// }
export default [
  // call
  {
    name: 'r_001',
    path: '/bak/calling',
    icon: 'icon-call',
    sub: [
      {
        name: 'r_001',
        path: '/bak/calling_call'
      },
      {
        name: 'r_011',
        path: '/bak/calling_contacts'
      },
      {
        name: 'r_012',
        path: '/bak/calling_schedule'
      },
      {
        name: 'r_013',
        path: '/bak/calling_history'
      }
    ]
  },
  // account
  {
    name: 'r_002',
    path: '/bak/acct',
    icon: 'icon-account',
    denyRole: 'user',
    sub: [
      {
        name: 'r_064',
        path: '/bak/acct_sip'
      },
      {
        name: 'r_065',
        path: '/bak/acct_ipvt'
      },
      {
        name: 'r_066',
        path: '/bak/acct_bj'
      },
      {
        name: 'r_067',
        path: '/bak/acct_h323'
      }
    ]
  },
  // call features
  {
    name: 'r_003',
    path: '/bak/callset',
    icon: 'icon-callset',
    sub: [
      {
        name: 'r_014',
        denyRole: 'user',
        path: '/bak/callset_general'
      },
      {
        name: 'r_003',
        path: '/bak/callset_callfeature'
      },
      {
        name: 'r_016',
        denyRole: 'user',
        path: '/bak/callset_sitename'
      },
      {
        name: 'r_017',
        denyRole: 'user',
        path: '/bak/callset_audio'
      },
      {
        name: 'r_018',
        denyRole: 'user',
        path: '/bak/callset_video'
      }
    ]
  },
  // network settings
  {
    name: 'r_004',
    path: '/bak/network',
    icon: 'icon-network',
    sub: [
      {
        name: 'r_019',
        path: '/bak/network_ethernet'
      },
      {
        name: 'r_020',
        path: '/bak/network_wifi'
      },
      {
        name: 'r_021',
        path: '/bak/network_openvpn'
      },
      {
        name: 'r_022',
        denyRole: 'user',
        path: '/bak/network_advanced'
      }
    ]
  },

  // system settings
  {
    name: 'r_005',
    path: '/bak/sys',
    icon: 'icon-sysset',
    sub: [
      {
        name: 'r_023',
        path: '/bak/sys_power'
      },
      {
        name: 'r_024',
        path: '/bak/sys_timelang'
      },
      {
        name: 'r_025',
        denyRole: 'user',
        path: '/bak/sys_tr069'
      },
      {
        name: 'r_026',
        denyRole: 'user',
        path: '/bak/sys_security'
      }
    ]
  },
  // device control
  {
    name: 'r_006',
    path: '/bak/dev',
    icon: 'icon-device',
    sub: [
      {
        name: 'r_028',
        path: '/bak/dev_preset'
      },
      {
        name: 'r_027',
        path: '/bak/dev_camera'
      },
      {
        name: 'r_029',
        path: '/bak/dev_peripheral'
      },
      {
        name: 'r_030',
        path: '/bak/dev_remoteconrol'
      }
    ]
  },
  // app
  {
    name: 'r_007',
    path: '/bak/app',
    icon: 'icon-app',
    sub: [
      {
        name: 'r_031',
        path: '/bak/app_ldap'
      },
      {
        name: 'r_032',
        path: '/bak/app_record'
      },
      {
        name: 'r_070',
        path: '/bak/app_tpapp'
      }
    ]
  },
  // maintenance
  {
    name: 'r_008',
    path: '/bak/maintenance',
    icon: 'icon-maintenance',
    sub: [
      {
        name: 'r_033',
        denyRole: 'user',
        path: '/bak/maintenance_upgrade'
      },
      {
        name: 'r_034',
        path: '/bak/maintenance_trouble'
      }
    ]
  },
  // status
  {
    name: 'r_009',
    path: '/bak/status',
    icon: 'icon-status',
    sub: [
      {
        name: 'r_035',
        path: '/bak/status_account'
      },
      {
        name: 'r_036',
        path: '/bak/status_peripheral'
      },
      {
        name: 'r_037',
        path: '/bak/status_network'
      },
      {
        name: 'r_038',
        path: '/bak/status_systeminfo'
      },
      {
        name: 'r_039',
        path: '/bak/status_remotecontrol'
      }
    ]
  }
]
