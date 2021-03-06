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
const remotecontrolState  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/status/remotecontrolState').default);
    }, 'status');
};
const peripheralState  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/status/peripheralState').default);
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
const remotecontrol  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/device/remotecontrol').default);
    }, 'devicecontrol');
};

const peripheral  = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./modules/device/peripheral').default);
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
                <Route onEnter={ requireAuth } path="remotecontrolState" getComponent={remotecontrolState}/>
                <Route onEnter={ requireAuth } path="peripheralState" getComponent={peripheralState}/>
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
                <Route onEnter={ requireAuth } path="backup" getComponent={BackupForm} />
                <Route onEnter={ requireAuth } path="power" getComponent={Power} />
            </Route>
            <Route path="devicecontrol">
                <IndexRoute getComponent={ Preset } />
                <Route onEnter={ requireAuth } path="cameracontrol" getComponent={Preset}/>
                <Route onEnter={ requireAuth } path="ptz" getComponent={eptz}/>
                <Route onEnter={ requireAuth } path="peripheral" getComponent={peripheral}/>
                <Route onEnter={ requireAuth } path="remotecontrol" getComponent={remotecontrol}/>
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
