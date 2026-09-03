import pushService from '@hms.core.push.pushService';
import hilog from '@ohos.hilog';
import pushCommon from '@hms.core.push.pushCommon';
import { BusinessError } from '@ohos.base';

let TAG: string = 'tuanjie_rxsdk';

export default class HMSPushManager {
  public static getInstance(): HMSPushManager {
    return new HMSPushManager();
  }

  RegisterToken(callback: (msgType: string, status: string, data: string) => void) {
    try {
      pushService.getToken().then((data: string) => {
        hilog.info(0x0000, TAG, 'Get push token successfully: %{public}s.', data);
        callback("RegisterToken", "success", JSON.stringify({
          code: 0, data: {
            token: data
          } as ESObject
        }));
      }).catch((err: BusinessError) => {
        hilog.error(0x0000, TAG, 'Get push token failed: %{public}d %{public}s', err.code, err.message);
        callback("RegisterToken", "failed", JSON.stringify(err));
      });
    } catch (err) {
      let e: BusinessError = err as BusinessError;
      hilog.error(0x0000, TAG, 'Get push token catch error: %{public}d %{public}s', e.code, e.message);
      callback("RegisterToken", "failed", JSON.stringify(err));
    }
  }

  UnRegisterToken(callback: (msgType: string, status: string, data: string) => void) {
    try {
      pushService.deleteToken().then(() => {
        callback("UnRegisterToken", "success", JSON.stringify({
          code: 0
        }));
      });
      // hilog.info(0x0000, TAG, 'Get push token successfully: %{public}s', pushToken);
    } catch (err) {
      console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
      callback("UnRegisterToken", "failed", JSON.stringify(err));

    }
  }

  BindAlias(appProfileId: string, callback: (msgType: string, status: string, data: string) => void) {
    try {
      pushService.bindAppProfileId(pushCommon.AppProfileType.PROFILE_TYPE_APPLICATION_ACCOUNT, appProfileId).then(() => {
        callback("BindAlias", "success", JSON.stringify({
          code: 0
        }));
      });
      // hilog.info(0x0000, TAG, 'Get push token successfully: %{public}s', pushToken);
    } catch (err) {
      console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
       callback("BindAlias", "failed", JSON.stringify(err));
    }
  }

  UnBindAlias(appProfileId: string, callback: (msgType: string, status: string, data: string) => void) {
    try {
      pushService.unbindAppProfileId(appProfileId).then(() => {
        callback("UnBindAlias", "success", JSON.stringify({
          code: 0
        }));
      });
      // hilog.info(0x0000, TAG, 'Get push token successfully: %{public}s', pushToken);
    } catch (err) {
      console.error("errCode:" + (err as BusinessError).code + ",errMessage:" + (err as BusinessError).message);
       callback("UnBindAlias", "failed", JSON.stringify(err));
    }
  }
}


export function RegisterHMSPushManager() {
  let register: Record<string, Object> = {};
  register["HMSPushManager"] = HMSPushManager;
  return register;
}