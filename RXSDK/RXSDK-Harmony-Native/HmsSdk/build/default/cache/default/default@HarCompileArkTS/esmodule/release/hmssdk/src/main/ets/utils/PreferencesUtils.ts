import preferences from "@ohos:data.preferences";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
const TAG: string = 'rxsdk';
const PREFERENCES_NAME: string = 'rxsdk_prefs';
class PreferencesUtils {
    private mPreferences: preferences.Preferences | undefined = undefined;
    async lazyInit(w193: any) {
        if (this.mPreferences === undefined && w193) {
            this.mPreferences = await preferences.getPreferences(w193, PREFERENCES_NAME);
        }
    }
    async get(u193: string, v193?: any) {
        await this.lazyInit(v193);
        if (this.mPreferences) {
            return await this.mPreferences.get(u193, null);
        }
        else {
            return Promise.reject("preferences not init");
        }
    }
    async put(r193: string, s193: string, t193?: any) {
        Logger.info(TAG, `set ${r193}`);
        await this.lazyInit(t193);
        if (this.mPreferences) {
            await this.mPreferences.put(r193, s193);
            await this.mPreferences.flush();
            Logger.debug(TAG, `put  end` + s193);
        }
        else {
            return Promise.reject("preferences not init");
        }
    }
}
export default new PreferencesUtils();
