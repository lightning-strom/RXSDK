import preferences from '@ohos.data.preferences';
declare class PreferencesUtils {
    private mPreferences;
    lazyInit(w193: any): Promise<void>;
    get(u193: string, v193?: any): Promise<preferences.ValueType>;
    put(r193: string, s193: string, t193?: any): Promise<never>;
}
declare const _default: PreferencesUtils;
export default _default;
