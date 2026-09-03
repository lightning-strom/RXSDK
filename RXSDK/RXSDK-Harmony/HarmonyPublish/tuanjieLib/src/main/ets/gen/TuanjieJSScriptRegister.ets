
//The file is effective through the path, please keep the file path unchanged.

import { RegisterTuanjieBridge } from '../TuanjieBridge';
import { RegisterRXWebViewManager } from '../RXWebViewManager';
import { RegisterHMSLoginManger } from '../HMSLoginManger';
import { RegisterSystemDateTimeManager } from '../SystemDateTimeManager';
import { RegisterLocationManager } from '../LocationManager';
import { RegisterHMSIAPManager } from '../HMSIAPManager';
import { RegisterRXWebViewControlBridge } from '../RXWebViewControlBridge';
import { RegisterNearbyManager } from '../NearbyManager';
import { RegisterHMSGameServiceManager } from '../HMSGameServiceManager';
import { RegisterDeviceInfoManager } from '../DeviceInfoManager';
import { RegisterHMSPushManager } from '../HMSPushManager';
import { RegisterWebviewControlBridge } from '../WebviewControlBridge';
import { RegisterHMSGetDataManager } from '../HMSGetDataManager';
import { RegisterRXAPIManager } from '../RXAPIManager';

import { RegisterGalleryManager, SetToGlobalThis } from 'classesLib';
import { RegisterWebviewControl } from 'classesLib';
import { RegisterMemorySnapshotManager } from 'classesLib';
import { TuanjieLog } from 'classesLib';

function register(tuanjieJSClasses:Record<string, Object>, functionName :Function) {
  let exportObj:Record<string, Object> = functionName();
  for (let key of Object.keys(exportObj)) {
    if(tuanjieJSClasses[key] !== undefined){
        TuanjieLog.error('Duplicate keys detected when exporting TypeScript module to C#: ' + key + '. This might cause overwrite exists module.');
    }
    tuanjieJSClasses[key] = exportObj[key];
  }
}

export function RegisterJSScriptToCSharp() {
  let tuanjieJSClasses:Record<string, Object> = {};
  register(tuanjieJSClasses, RegisterGalleryManager);
  register(tuanjieJSClasses, RegisterWebviewControl);
  register(tuanjieJSClasses, RegisterMemorySnapshotManager);
  register(tuanjieJSClasses, RegisterTuanjieBridge);
  register(tuanjieJSClasses, RegisterRXWebViewManager);
  register(tuanjieJSClasses, RegisterHMSLoginManger);
  register(tuanjieJSClasses, RegisterSystemDateTimeManager);
  register(tuanjieJSClasses, RegisterLocationManager);
  register(tuanjieJSClasses, RegisterHMSIAPManager);
  register(tuanjieJSClasses, RegisterRXWebViewControlBridge);
  register(tuanjieJSClasses, RegisterNearbyManager);
  register(tuanjieJSClasses, RegisterHMSGameServiceManager);
  register(tuanjieJSClasses, RegisterDeviceInfoManager);
  register(tuanjieJSClasses, RegisterHMSPushManager);
  register(tuanjieJSClasses, RegisterWebviewControlBridge);
  register(tuanjieJSClasses, RegisterHMSGetDataManager);
  register(tuanjieJSClasses, RegisterRXAPIManager);

  SetToGlobalThis('tuanjieJSScript', tuanjieJSClasses);
}