import React, { lazy, Suspense } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const routes = [
  /* call */
  { path: '/bak/calling_call', component: lazy(() => import(/* webpackChunkName: "calling" */ './Call/Call')) },
  { path: '/bak/calling_history', component: lazy(() => import(/* webpackChunkName: "calling" */ './Call/CallHistory')) },
  { path: '/bak/calling_contacts', component: lazy(() => import(/* webpackChunkName: "calling" */ './Call/Contacts')) },
  { path: '/bak/calling_schedule', component: lazy(() => import(/* webpackChunkName: "calling" */ './Call/Schedule')) },
  /* account */
  { path: '/bak/acct_sip', component: lazy(() => import(/* webpackChunkName: "acct" */ './Account/SIP')) },
  { path: '/bak/acct_ipvt', component: lazy(() => import(/* webpackChunkName: "acct" */ './Account/IPVideoTalk')) },
  { path: '/bak/acct_bj', component: lazy(() => import(/* webpackChunkName: "acct" */ './Account/BlueJeans')) },
  { path: '/bak/acct_h323', component: lazy(() => import(/* webpackChunkName: "acct" */ './Account/H323')) },

  /* call features */
  { path: '/bak/callset_general', component: lazy(() => import(/* webpackChunkName: "callset" */ './CallFeatures/GeneralSettings')) },
  { path: '/bak/callset_callfeature', component: lazy(() => import(/* webpackChunkName: "callset" */ './CallFeatures/CallFeatures')) },
  { path: '/bak/callset_sitename', component: lazy(() => import(/* webpackChunkName: "callset" */'./CallFeatures/SiteName')) },
  { path: '/bak/callset_audio', component: lazy(() => import(/* webpackChunkName: "callset" */'./CallFeatures/AudioControl')) },
  { path: '/bak/callset_video', component: lazy(() => import(/* webpackChunkName: "callset" */'./CallFeatures/VideoSettings')) },

  /* network settings */
  { path: '/bak/network_wifi', component: lazy(() => import(/* webpackChunkName: "network" */ './NetworkSettings/Wifi')) },
  { path: '/bak/network_ethernet', component: lazy(() => import(/* webpackChunkName: "network" */ './NetworkSettings/Ethernet')) },
  { path: '/bak/network_openvpn', component: lazy(() => import(/* webpackChunkName: "network" */'./NetworkSettings/Openvpn')) },
  { path: '/bak/network_advanced', component: lazy(() => import(/* webpackChunkName: "network" */'./NetworkSettings/Advanced')) },

  /* system settings */
  { path: '/bak/sys_power', component: lazy(() => import(/* webpackChunkName: "systemset" */ './SystemSettings/Power')) },
  { path: '/bak/sys_timelang', component: lazy(() => import(/* webpackChunkName: "systemset" */ './SystemSettings/TimeAndLang')) },
  { path: '/bak/sys_tr069', component: lazy(() => import(/* webpackChunkName: "systemset" */ './SystemSettings/TR069')) },
  { path: '/bak/sys_security', component: lazy(() => import(/* webpackChunkName: "systemset" */ './SystemSettings/Security')) },

  /* device control */
  { path: '/bak/dev_preset', component: lazy(() => import(/* webpackChunkName: "devicectrl" */ './DeviceControl/PresetSettings')) },
  { path: '/bak/dev_camera', component: lazy(() => import(/* webpackChunkName: "devicectrl" */ './DeviceControl/CameraControl')) },
  { path: '/bak/dev_peripheral', component: lazy(() => import(/* webpackChunkName: "devicectrl" */ './DeviceControl/Peripheral')) },
  { path: '/bak/dev_remoteconrol', component: lazy(() => import(/* webpackChunkName: "devicectrl" */ './DeviceControl/RemoteControl')) },

  /** app */
  { path: '/bak/app_ldap', component: lazy(() => import(/* webpackChunkName: "app" */ './App/LDAPContacts')) },
  { path: '/bak/app_record', component: lazy(() => import(/* webpackChunkName: "app" */ './App/RecordingManage')) },

  /** Maintenance */
  { path: '/bak/maintenance_upgrade', component: lazy(() => import(/* webpackChunkName: "maintenance" */ './Maintenance/Upgrade')) },
  { path: '/bak/maintenance_trouble', component: lazy(() => import(/* webpackChunkName: "maintenance" */ './Maintenance/Troubleshooting')) },
  /* status */
  { path: '/bak/status_account', component: lazy(() => import(/* webpackChunkName: "status" */ './Status/AccountStatus')) },
  { path: '/bak/status_peripheral', component: lazy(() => import(/* webpackChunkName: "status" */ './Status/PeripheralStatus')) },
  { path: '/bak/status_network', component: lazy(() => import(/* webpackChunkName: "status" */ './Status/NetworkStatus')) },
  { path: '/bak/status_systeminfo', component: lazy(() => import(/* webpackChunkName: "status" */ './Status/SystemInfo')) },
  { path: '/bak/status_remotecontrol', component: lazy(() => import(/* webpackChunkName: "status" */ './Status/RemoteControlStatus')) }
]

export default (
  <Suspense fallback={null}>
    <TransitionGroup>
      <Switch>
        <Route exact path='/bak' component={() => <Redirect to={'/bak/acct_sip'} />} />
        {
          routes.map(({ component: Component, path, ...props }) => (
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
        <Route component={() => <Redirect to={'/bak'} />}/>
      </Switch>
    </TransitionGroup>
  </Suspense>
)
