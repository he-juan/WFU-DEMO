import React from 'react'
import { Route, IndexRoute, browserHistory } from 'react-router'
import SipAcct from "./modules/account/sipAcct";
import IpvtAcct from "./modules/account/ipvtAcct";

import Account from "./modules/status/account";
import Network from "./modules/status/network";
import System from "./modules/status/system";
import Storage from "./modules/status/storage";

import DialUp from "./modules/calls/dialup";
import CallHistory from "./modules/calls/history";
import Contact from "./modules/calls/contact";
import Dnd from "./modules/calls/dnd";
import Blackwhite from "./modules/calls/blackwhite";

import General from "./modules/callset/general";
import Callfeatures from "./modules/callset/callfeatures";
import Audio from "./modules/callset/audio";
import Video from "./modules/callset/video";
import Multicast from "./modules/callset/multicast";
import Ptt from "./modules/callset/ptt"

import Ethernet from "./modules/network/ethernet";
import Bluetooth from "./modules/network/bluetooth";
import Wifi from "./modules/network/wifi";
import OpenVPN from "./modules/network/openvpn";
import Common from "./modules/network/common";

import Timeandlang from "./modules/sysset/timeandlang";
import Security from "./modules/sysset/security";
import Peripherals from "./modules/sysset/peripherals";
import Tr069 from "./modules/sysset/tr069";
import Switch from "./modules/sysset/switch";
import Fxo from "./modules/sysset/fxo";
import Sitename from "./modules/sysset/sitename";
import BackupForm from "./modules/sysset/backup";

import Upgrade from "./modules/maintenance/upgrade";
import Diagnosis from "./modules/maintenance/diagnosis";
import Eventnotice from "./modules/maintenance/eventnotice";

import Vpk from "./modules/sysapp/vpk";
import Mpk from "./modules/sysapp/mpk";
import Contacts from "./modules/sysapp/contacts";
import Record from "./modules/sysapp/record";
import Ldap from "./modules/sysapp/ldap";

import Gds from "./modules/extension/gds";
import Broadsoftfunc from "./modules/extension/broadsoftfunc";
import Broadsoftcontact from "./modules/extension/broadsoftcontact";
import Broadsoftimp from "./modules/extension/broadsoftimp";

import Loopback from "./modules/detection/loopback";
import Speaker from "./modules/detection/speaker";
import Led from "./modules/detection/led";
import CertVerify from "./modules/detection/certverify";
import Reset from "./modules/detection/reset";

import * as Store from './entry'

const routes = () => {
  function requireAuth() {
      let hashname = location.hash.split('/');
      Store.store.dispatch({type: 'HASH_CHANGE', hashChange: hashname});
      window.scrollTo(0,0);
  }
    return (
        <div>
            <Route path="status">
                <IndexRoute component={ Account } />
                <Route onEnter={ requireAuth } path="acct" component={Account}/>
                <Route onEnter={ requireAuth } path="network" component={Network}/>
                <Route onEnter={ requireAuth } path="system" component={System}/>
                <Route onEnter={ requireAuth } path="storage" component={Storage}/>
            </Route>
            <Route onEnter={ requireAuth } path="account">
                <IndexRoute component={ SipAcct } />
                <Route onEnter={ requireAuth } path="sipAcct" component={SipAcct}/>
                <Route onEnter={ requireAuth } path="ipvtAcct" component={IpvtAcct}/>
            </Route>
            <Route path="calls" >
                <IndexRoute component={ DialUp } />
                <Route onEnter={ requireAuth } path="dialup" component={DialUp}/>
                <Route onEnter={ requireAuth } path="history" component={CallHistory}/>
                <Route onEnter={ requireAuth } path="contact" component={Contact}/>
                <Route onEnter={ requireAuth } path="dnd" component={Dnd}/>
                <Route onEnter={ requireAuth } path="blackwhite" component={Blackwhite}/>
            </Route>
            <Route path="callset">
                <IndexRoute component={ General } />
                <Route onEnter={ requireAuth } path="general" component={General}/>
                <Route onEnter={ requireAuth } path="callfeatures" component={Callfeatures}/>
                <Route onEnter={ requireAuth } path="audio" component={Audio}/>
                <Route onEnter={ requireAuth } path="video" component={Video}/>
                <Route onEnter={ requireAuth } path="multicast" component={Multicast}/>
                <Route onEnter={ requireAuth } path="pagingPtt" component={Ptt}/>
            </Route>
            <Route path="network">
                <IndexRoute component={ Ethernet } />
                <Route onEnter={ requireAuth } path="ethernet" component={Ethernet}/>
                <Route onEnter={ requireAuth } path="bluetooth" component={Bluetooth}/>
                <Route onEnter={ requireAuth } path="wifi" component={Wifi}/>
                <Route onEnter={ requireAuth } path="openvpn" component={OpenVPN}/>
                <Route onEnter={ requireAuth } path="common" component={Common}/>
            </Route>
            <Route path="sysset">
                <IndexRoute component={ Ethernet } />
                <Route onEnter={ requireAuth } path="timeandlang" component={Timeandlang}/>
                <Route onEnter={ requireAuth } path="security" component={Security}/>
                <Route onEnter={ requireAuth } path="peripherals" component={Peripherals}/>
                <Route onEnter={ requireAuth } path="tr069" component={Tr069}/>
                <Route onEnter={ requireAuth } path="fxo" component={Fxo}/>
                <Route onEnter={ requireAuth } path="sitename" component={Sitename}/>
                <Route onEnter={ requireAuth } path="switch" component={Switch}/>
                <Route onEnter={ requireAuth } path="backup" component={BackupForm} />
            </Route>
            <Route path="maintenance">
                <IndexRoute component={ Upgrade } />
                <Route onEnter={ requireAuth } path="upgrade" component={Upgrade}/>
                <Route onEnter={ requireAuth } path="diagnosis" component={Diagnosis}/>
                <Route onEnter={ requireAuth } path="eventnotice" component={Eventnotice}/>
            </Route>
            <Route path="sysapp">
                <IndexRoute component={ Vpk } />
                <Route onEnter={ requireAuth } path="vpk" component={Vpk}/>
                <Route onEnter={ requireAuth } path="mpk" component={Mpk}/>
                <Route onEnter={ requireAuth } path="contacts" component={Contacts}/>
                <Route onEnter={ requireAuth } path="record" component={Record}/>
                <Route onEnter={ requireAuth } path="ldap" component={Ldap}/>
            </Route>
            <Route path="extension">
                <IndexRoute component={ Gds } />
                <Route onEnter={ requireAuth } path="gds" component={Gds}/>
                <Route onEnter={ requireAuth } path="broadsoftfunc" component={Broadsoftfunc}/>
                <Route onEnter={ requireAuth } path="broadsoftcontact" component={Broadsoftcontact}/>
                <Route onEnter={ requireAuth } path="broadsoftimp" component={Broadsoftimp}/>
            </Route>
            <Route path="detection">
                <IndexRoute component={ Loopback } />
                <Route onEnter={ requireAuth } path="loopback" component={Loopback}/>
                <Route onEnter={ requireAuth } path="speaker" component={Speaker}/>
                <Route onEnter={ requireAuth } path="led" component={Led}/>
                <Route onEnter={ requireAuth } path="certverify" component={CertVerify}/>
                <Route onEnter={ requireAuth } path="reset" component={Reset}/>
            </Route>
        </div>
    )
}

export default routes;
