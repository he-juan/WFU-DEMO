import React from 'react'
import { Route, IndexRoute, browserHistory } from 'react-router'


const SipAcct  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/account/sipAcct').default);
    }, 'account');
};
const IpvtAcct  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/account/ipvtAcct').default);
    }, 'account');
};

const BlueJeansAcct = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/account/blueJeansAcct').default);
    }, 'account');
}

const H323Acct = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/account/h323Acct').default)
    }, 'account')
}
const Account  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/status/account').default);
    }, 'status');
};
const Network  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/status/network').default);
    }, 'status');
};
const System  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/status/system').default);
    }, 'status');
};
const Storage  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/status/storage').default);
    }, 'status');
};

const DialUp  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/calls/dialup').default);
    }, 'calls');
};
const CallHistory  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/calls/history').default);
    }, 'calls');
};
const Schedule  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/calls/schedule').default);
    }, 'calls');
};
const Contact  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/calls/contact').default);
    }, 'calls');
};
const Dnd  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/calls/dnd').default);
    }, 'calls');
};
const General  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/callset/general').default);
    }, 'callset');
};
const Callfeatures  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/callset/callfeatures').default);
    }, 'callset');
};
const Audio  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/callset/audio').default);
    }, 'callset');
};
const Video  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/callset/video').default);
    }, 'callset');
};
const Multicast  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/callset/multicast').default);
    }, 'callset');
};
const Ptt  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/callset/ptt').default);
    }, 'callset');
};
const Sitename= (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/callset/sitename').default)
    }, 'callset')
}

const Ethernet  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/network/ethernet').default);
    }, 'network');
};
const Bluetooth  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/network/bluetooth').default);
    }, 'network');
};
const Wifi  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/network/wifi').default);
    }, 'network');
};
const OpenVPN  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/network/openvpn').default);
    }, 'network');
};
const Common  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/network/common').default);
    }, 'network');
};

const Timeandlang  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysset/timeandlang').default);
    }, 'sysset');
};
const Security  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysset/security').default);
    }, 'sysset');
};
const Peripherals  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysset/peripherals').default);
    }, 'sysset');
};
const Tr069  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysset/tr069').default);
    }, 'sysset');
};
const Switch  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysset/switch').default);
    }, 'sysset');
};
const Fxo  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysset/fxo').default);
    }, 'sysset');
};

const BackupForm  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysset/backup').default);
    }, 'sysset');
};

const Power = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysset/power').default);
    }, 'sysset');
}

const Preset  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/device/Preset').default);
    }, 'devicecontrol');
};

const eptz  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/device/eptz').default);
    }, 'devicecontrol');
};

const Upgrade  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/maintenance/upgrade').default);
    }, 'maintenance');
};
const Diagnosis  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/maintenance/diagnosis').default);
    }, 'maintenance');
};
const Eventnotice  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/maintenance/eventnotice').default);
    }, 'maintenance');
};

const Vpk  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysapp/vpk').default);
    }, 'sysapp');
};
const Mpk  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysapp/mpk').default);
    }, 'sysapp');
};
const Contacts  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysapp/contacts').default);
    }, 'sysapp');
};
const Record  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysapp/record').default);
    }, 'sysapp');
};
const Ldap  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/sysapp/ldap').default);
    }, 'sysapp');
};

const Gds  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/extension/gds').default);
    }, 'extension');
};
const Broadsoftfunc  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/extension/broadsoftfunc').default);
    }, 'extension');
};
const Broadsoftcontact  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/extension/broadsoftcontact').default);
    }, 'extension');
};
const Broadsoftimp  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/extension/broadsoftimp').default);
    }, 'extension');
};

const Loopback  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/detection/loopback').default);
    }, 'detection');
};
const Speaker  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/detection/speaker').default);
    }, 'detection');
};
const Led  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/detection/led').default);
    }, 'detection');
};
const CertVerify  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/detection/certverify').default);
    }, 'detection');
};
const Reset  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/detection/reset').default);
    }, 'detection');
};

/*import SipAcct from "./modules/account/sipAcct";
import IpvtAcct from "./modules/account/ipvtAcct";

import Account from "./modules/status/account";
import Network from "./modules/status/network";
import System from "./modules/status/system";
import Storage from "./modules/status/storage";

import DialUp from "./modules/calls/dialup";
import CallHistory from "./modules/calls/history";
import Contact from "./modules/calls/contact";
import Dnd from "./modules/calls/dnd";
import Blackwhite from "./modules/calls/blackwhite";*/

/*import General from "./modules/callset/general";
import Callfeatures from "./modules/callset/callfeatures";
import Audio from "./modules/callset/audio";
import Video from "./modules/callset/video";
import Multicast from "./modules/callset/multicast";
import Ptt from "./modules/callset/ptt"*/

/*import Ethernet from "./modules/network/ethernet";
import Bluetooth from "./modules/network/bluetooth";
import Wifi from "./modules/network/wifi";
import OpenVPN from "./modules/network/openvpn";
import Common from "./modules/network/common";*/

/*import Timeandlang from "./modules/sysset/timeandlang";
import Security from "./modules/sysset/security";
import Peripherals from "./modules/sysset/peripherals";
import Tr069 from "./modules/sysset/tr069";
import Switch from "./modules/sysset/switch";
import Fxo from "./modules/sysset/fxo";
import Sitename from "./modules/sysset/sitename";
import BackupForm from "./modules/sysset/backup";*/

/*import Upgrade from "./modules/maintenance/upgrade";
import Diagnosis from "./modules/maintenance/diagnosis";
import Eventnotice from "./modules/maintenance/eventnotice";*/

/*import Vpk from "./modules/sysapp/vpk";
import Mpk from "./modules/sysapp/mpk";
import Contacts from "./modules/sysapp/contacts";
import Record from "./modules/sysapp/record";
import Ldap from "./modules/sysapp/ldap";*/

/*import Gds from "./modules/extension/gds";
import Broadsoftfunc from "./modules/extension/broadsoftfunc";
import Broadsoftcontact from "./modules/extension/broadsoftcontact";
import Broadsoftimp from "./modules/extension/broadsoftimp";*/

/*import Loopback from "./modules/detection/loopback";
import Speaker from "./modules/detection/speaker";
import Led from "./modules/detection/led";
import CertVerify from "./modules/detection/certverify";
import Reset from "./modules/detection/reset";*/

/*import Preset from "./modules/device/Preset";
import eptz from "./modules/device/eptz";*/

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
                <IndexRoute getComponent={ Account } />
                <Route onEnter={ requireAuth } path="acct" getComponent={Account}/>
                <Route onEnter={ requireAuth } path="network" getComponent={Network}/>
                <Route onEnter={ requireAuth } path="system" getComponent={System}/>
                <Route onEnter={ requireAuth } path="storage" getComponent={Storage}/>
            </Route>
            <Route path="account">
                <IndexRoute getComponent={ SipAcct } />
                <Route onEnter={ requireAuth } path="sipAcct" getComponent={SipAcct}/>
                <Route onEnter={ requireAuth } path="ipvtAcct" getComponent={IpvtAcct}/>
                <Route onEnter={ requireAuth } path="BlueJeansAcct" getComponent={BlueJeansAcct}/>
                <Route onEnter={ requireAuth } path="H323Acct" getComponent={H323Acct}/>
            </Route>
            <Route path="calls" >
                <IndexRoute getComponent={ DialUp } />
                <Route onEnter={ requireAuth } path="dialup" getComponent={DialUp}/>
                <Route onEnter={ requireAuth } path="history" getComponent={CallHistory}/>
                <Route onEnter={ requireAuth } path="schedule" getComponent={Schedule}/>
                <Route onEnter={ requireAuth } path="contact" getComponent={Contact}/>
                <Route onEnter={ requireAuth } path="dnd" getComponent={Dnd}/>
            </Route>
            <Route path="callset">
                <IndexRoute getComponent={ General } />
                <Route onEnter={ requireAuth } path="general" getComponent={General}/>
                <Route onEnter={ requireAuth } path="callfeatures" getComponent={Callfeatures}/>
                <Route onEnter={ requireAuth } path="audio" getComponent={Audio}/>
                <Route onEnter={ requireAuth } path="video" getComponent={Video}/>
                <Route onEnter={ requireAuth } path="multicast" getComponent={Multicast}/>
                <Route onEnter={ requireAuth } path="pagingPtt" getComponent={Ptt}/>
                <Route onEnter={ requireAuth } path="sitename" getComponent={Sitename}/>
            </Route>
            <Route path="network">
                <IndexRoute getComponent={ Ethernet } />
                <Route onEnter={ requireAuth } path="ethernet" getComponent={Ethernet}/>
                <Route onEnter={ requireAuth } path="bluetooth" getComponent={Bluetooth}/>
                <Route onEnter={ requireAuth } path="wifi" getComponent={Wifi}/>
                <Route onEnter={ requireAuth } path="openvpn" getComponent={OpenVPN}/>
                <Route onEnter={ requireAuth } path="common" getComponent={Common}/>
            </Route>
            <Route path="sysset">
                <IndexRoute getComponent={ Power } />
                <Route onEnter={ requireAuth } path="timeandlang" getComponent={Timeandlang}/>
                <Route onEnter={ requireAuth } path="security" getComponent={Security}/>
                <Route onEnter={ requireAuth } path="peripherals" getComponent={Peripherals}/>
                <Route onEnter={ requireAuth } path="tr069" getComponent={Tr069}/>
                <Route onEnter={ requireAuth } path="fxo" getComponent={Fxo}/>
                <Route onEnter={ requireAuth } path="switch" getComponent={Switch}/>
                <Route onEnter={ requireAuth } path="backup" getComponent={BackupForm} />
                <Route onEnter={ requireAuth } path="power" getComponent={Power} />
            </Route>
            <Route path="devicecontrol">
                <IndexRoute getComponent={ Preset } />
                <Route onEnter={ requireAuth } path="cameracontrol" getComponent={Preset}/>
                <Route onEnter={ requireAuth } path="ptz" getComponent={eptz}/>
            </Route>
            <Route path="maintenance">
                <IndexRoute getComponent={ Upgrade } />
                <Route onEnter={ requireAuth } path="upgrade" getComponent={Upgrade}/>
                <Route onEnter={ requireAuth } path="diagnosis" getComponent={Diagnosis}/>
                <Route onEnter={ requireAuth } path="eventnotice" getComponent={Eventnotice}/>
            </Route>
            <Route path="sysapp">
                <IndexRoute getComponent={ Vpk } />
                <Route onEnter={ requireAuth } path="vpk" getComponent={Vpk}/>
                <Route onEnter={ requireAuth } path="mpk"  getComponent={Mpk}/>
                <Route onEnter={ requireAuth } path="contacts" getComponent={Contacts}/>
                <Route onEnter={ requireAuth } path="record" getComponent={Record}/>
                <Route onEnter={ requireAuth } path="ldap" getComponent={Ldap}/>
            </Route>
            <Route path="extension">
                <IndexRoute getComponent={ Gds } />
                <Route onEnter={ requireAuth } path="gds" getComponent={Gds}/>
                <Route onEnter={ requireAuth } path="broadsoftfunc" getComponent={Broadsoftfunc}/>
                <Route onEnter={ requireAuth } path="broadsoftcontact" getComponent={Broadsoftcontact}/>
                <Route onEnter={ requireAuth } path="broadsoftimp" getComponent={Broadsoftimp}/>
            </Route>
            <Route path="detection">
                <IndexRoute getComponent={ Loopback } />
                <Route onEnter={ requireAuth } path="loopback" getComponent={Loopback}/>
                <Route onEnter={ requireAuth } path="speaker" getComponent={Speaker}/>
                <Route onEnter={ requireAuth } path="led" getComponent={Led}/>
                <Route onEnter={ requireAuth } path="certverify" getComponent={CertVerify}/>
                <Route onEnter={ requireAuth } path="reset" getComponent={Reset}/>
            </Route>
        </div>
    )
}

export default routes;
