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
    path: '/manage/calling',
    icon: 'icon-call',
    sub: [
      {
        name: 'r_010',
        path: '/manage/calling_call'
      },
      {
        name: 'r_011',
        path: '/manage/calling_contacts'
      },
      {
        name: 'r_012',
        path: '/manage/calling_schedule'
      },
      {
        name: 'r_013',
        path: '/manage/calling_history'
      }
    ]
  },
  // account
  {
    name: 'r_002',
    path: '/manage/acct',
    icon: 'icon-account',
    denyRole: 'user',
    sub: [
      {
        name: 'r_064',
        path: '/manage/acct_sip'
      },
      {
        name: 'r_065',
        path: '/manage/acct_ipvt'
      },
      {
        name: 'r_067',
        path: '/manage/acct_h323'
      },
      // 视频会议服务平台
      {
        name: 'r_072',
        path: '/manage/acct_videoconf'
      }
    ]
  },
  // call features
  {
    name: 'r_003',
    path: '/manage/callset',
    icon: 'icon-callset',
    sub: [
      {
        name: 'r_014',
        denyRole: 'user',
        path: '/manage/callset_general'
      },
      {
        name: 'r_015',
        path: '/manage/callset_callfeature'
      },
      {
        name: 'r_016',
        denyRole: 'user',
        path: '/manage/callset_sitename'
      },
      {
        name: 'r_017',
        denyRole: 'user',
        path: '/manage/callset_audio'
      },
      {
        name: 'r_018',
        denyRole: 'user',
        path: '/manage/callset_video'
      }
    ]
  },
  // network settings
  {
    name: 'r_004',
    path: '/manage/network',
    icon: 'icon-network',
    sub: [
      {
        name: 'r_019',
        path: '/manage/network_ethernet'
      },
      {
        name: 'r_020',
        path: '/manage/network_wifi'
      },
      {
        name: 'r_021',
        path: '/manage/network_openvpn'
      },
      {
        name: 'r_078',
        denyRole: 'user',
        path: '/manage/network_advanced'
      }
    ]
  },

  // system settings
  {
    name: 'r_005',
    path: '/manage/sys',
    icon: 'icon-sysset',
    sub: [
      {
        name: 'r_023',
        path: '/manage/sys_power'
      },
      {
        name: 'r_024',
        path: '/manage/sys_timelang'
      },
      {
        name: 'r_025',
        denyRole: 'user',
        path: '/manage/sys_tr069'
      },
      {
        name: 'r_026',
        path: '/manage/sys_security'
      },
      // 外围设备
      {
        name: 'r_029',
        path: '/manage/sys_peripheral'
      }
    ]
  },
  // device control
  {
    name: 'r_006',
    path: '/manage/dev',
    icon: 'icon-device',
    sub: [
      {
        name: 'r_028',
        path: '/manage/dev_preset'
      },
      {
        name: 'r_027',
        path: '/manage/dev_camera'
      },
      {
        name: 'r_030',
        path: '/manage/dev_remoteconrol'
      }
    ]
  },
  // app
  {
    name: 'r_007',
    path: '/manage/app',
    icon: 'icon-app',
    sub: [
      {
        name: 'r_031',
        path: '/manage/app_ldap'
      },
      {
        name: 'r_083',
        path: '/manage/app_broadsoftdir'
      },
      {
        name: 'r_032',
        path: '/manage/app_record'
      },
      {
        name: 'r_070',
        path: '/manage/app_tpapp'
      }
    ]
  },
  // maintenance
  {
    name: 'r_008',
    path: '/manage/maintenance',
    icon: 'icon-maintenance',
    sub: [
      {
        name: 'r_033',
        denyRole: 'user',
        path: '/manage/maintenance_upgrade'
      },
      {
        name: 'r_034',
        path: '/manage/maintenance_trouble'
      }
    ]
  },
  // status
  {
    name: 'r_009',
    path: '/manage/status',
    icon: 'icon-status',
    sub: [
      {
        name: 'r_035',
        path: '/manage/status_account'
      },
      {
        name: 'r_036',
        path: '/manage/status_peripheral'
      },
      {
        name: 'r_037',
        path: '/manage/status_network'
      },
      {
        name: 'r_038',
        path: '/manage/status_systeminfo'
      },
      {
        name: 'r_039',
        path: '/manage/status_remotecontrol'
      },
      {
        name: 'r_089',
        path: '/manage/status_license'
      }
    ]
  }
]
