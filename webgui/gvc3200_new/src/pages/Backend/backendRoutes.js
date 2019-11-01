import React, { lazy, Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { isMenuRouteDeny } from '@/utils/tools'

const routes = [
  /* call */
  { path: '/manage/calling_call', component: lazy(() => import(/* webpackChunkName: "calling" */ './Call/Call')) },
  { path: '/manage/calling_history', component: lazy(() => import(/* webpackChunkName: "calling" */ './Call/CallHistory')) },
  { path: '/manage/calling_contacts', component: lazy(() => import(/* webpackChunkName: "calling" */ './Call/Contacts')) },
  { path: '/manage/calling_schedule', component: lazy(() => import(/* webpackChunkName: "calling" */ './Call/Schedule')) },
  /* account */
  { path: '/manage/acct_sip', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "acct" */ './Account/SIP')) },
  { path: '/manage/acct_ipvt', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "acct" */ './Account/IPVideoTalk')) },
  { path: '/manage/acct_bj', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "acct" */ './Account/BlueJeans')) },
  { path: '/manage/acct_h323', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "acct" */ './Account/H323')) },

  /* call features */
  { path: '/manage/callset_general', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "callset" */ './CallFeatures/GeneralSettings')) },
  { path: '/manage/callset_callfeature', component: lazy(() => import(/* webpackChunkName: "callset" */ './CallFeatures/CallFeatures')) },
  { path: '/manage/callset_sitename', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "callset" */'./CallFeatures/SiteName')) },
  { path: '/manage/callset_audio', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "callset" */'./CallFeatures/AudioControl')) },
  { path: '/manage/callset_video', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "callset" */'./CallFeatures/VideoSettings')) },

  /* network settings */
  { path: '/manage/network_wifi', component: lazy(() => import(/* webpackChunkName: "network" */ './NetworkSettings/Wifi')) },
  { path: '/manage/network_ethernet', component: lazy(() => import(/* webpackChunkName: "network" */ './NetworkSettings/Ethernet')) },
  { path: '/manage/network_openvpn', component: lazy(() => import(/* webpackChunkName: "network" */'./NetworkSettings/Openvpn')) },
  { path: '/manage/network_advanced', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "network" */'./NetworkSettings/Advanced')) },

  /* system settings */
  { path: '/manage/sys_power', component: lazy(() => import(/* webpackChunkName: "systemset" */ './SystemSettings/Power')) },
  { path: '/manage/sys_timelang', component: lazy(() => import(/* webpackChunkName: "systemset" */ './SystemSettings/TimeAndLang')) },
  { path: '/manage/sys_tr069', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "systemset" */ './SystemSettings/TR069')) },
  { path: '/manage/sys_security', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "systemset" */ './SystemSettings/Security')) },

  /* device control */
  { path: '/manage/dev_preset', component: lazy(() => import(/* webpackChunkName: "devicectrl" */ './DeviceControl/PresetSettings')) },
  { path: '/manage/dev_camera', component: lazy(() => import(/* webpackChunkName: "devicectrl" */ './DeviceControl/CameraControl')) },
  { path: '/manage/dev_peripheral', component: lazy(() => import(/* webpackChunkName: "devicectrl" */ './DeviceControl/Peripheral')) },
  { path: '/manage/dev_remoteconrol', component: lazy(() => import(/* webpackChunkName: "devicectrl" */ './DeviceControl/RemoteControl')) },

  /** app */
  { path: '/manage/app_ldap', component: lazy(() => import(/* webpackChunkName: "app" */ './App/LDAPContacts')) },
  { path: '/manage/app_record', component: lazy(() => import(/* webpackChunkName: "app" */ './App/RecordingManage')) },
  { path: '/manage/app_tpapp', component: lazy(() => import(/* webpackChunkName: "app" */ './App/ThirdPartyApp')) },

  /** Maintenance */
  { path: '/manage/maintenance_upgrade', denyRole: 'user', component: lazy(() => import(/* webpackChunkName: "maintenance" */ './Maintenance/Upgrade')) },
  { path: '/manage/maintenance_trouble', component: lazy(() => import(/* webpackChunkName: "maintenance" */ './Maintenance/Troubleshooting')) },
  /* status */
  { path: '/manage/status_account', component: lazy(() => import(/* webpackChunkName: "status" */ './Status/AccountStatus')) },
  { path: '/manage/status_peripheral', component: lazy(() => import(/* webpackChunkName: "status" */ './Status/PeripheralStatus')) },
  { path: '/manage/status_network', component: lazy(() => import(/* webpackChunkName: "status" */ './Status/NetworkStatus')) },
  { path: '/manage/status_systeminfo', component: lazy(() => import(/* webpackChunkName: "status" */ './Status/SystemInfo')) },
  { path: '/manage/status_remotecontrol', component: lazy(() => import(/* webpackChunkName: "status" */ './Status/RemoteControlStatus')) }
]

export default (
  <Suspense fallback={null}>
    <TransitionGroup>
      <Switch>
        <Route exact path='/manage' component={() => <Redirect to={'/manage/calling_call'} />} />
        {
          routes.filter(v => !isMenuRouteDeny(v)).map(({ component: Component, path, ...props }) => (
            <Route key={path} path={path} {...props}>
              {({ match }) => (
                <CSSTransition
                  in={match != null}
                  timeout={1000}
                  classNames='ani-page'
                  unmountOnExit
                >
                  <Component />
                </CSSTransition>
              )}
            </Route>
          ))
        }
        <Route component={() => <Redirect to={'/manage'} />}/>
      </Switch>
    </TransitionGroup>
  </Suspense>
)
