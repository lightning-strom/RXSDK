import util from "@ohos:util";
import preferences from "@ohos:data.preferences";
import DateTime from "@normalized:N&&&hmssdk/src/main/ets/utils/DateTime&4.0.0";
import type { BusinessError } from "@ohos:base";
import deviceInfo from "@ohos:deviceInfo";
import pasteboard from "@ohos:pasteboard";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import bundleManager from "@ohos:bundle.bundleManager";
import type { Context } from "@ohos:abilityAccessCtrl";
import type { PermissionRequestResult } from "@ohos:abilityAccessCtrl";
import type { Permissions } from "@ohos:abilityAccessCtrl";
import identifier from "@ohos:identifier.oaid";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import connection from "@ohos:net.connection";
import AESUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/AESUtil&4.0.0";
import i18n from "@ohos:i18n";
let DEVICE_CODE = "devices_code";
let DISTINCT_ID = "distinct_id";
let STORAGE_KEY = "rx_device_info";
let RX_PRIVACY_AGREED = "rx_privacy_agreed";
const LAUNCH_COUNT_KEY = "app_launch_count";
const LOGIN_COUNT_KEY = "user_login_count";
const USER_ACTIVATED_KEY = "user_activated";
const RX_TYPE = "type=rx&";
const READ_PASTEBOARD: Permissions = 'ohos.permission.READ_PASTEBOARD';
const APP_TRACKING_CONSENT: Permissions = 'ohos.permission.APP_TRACKING_CONSENT';
class Devices {
    private static instance: Devices;
    private _deviceCode: string;
    private _distinctId: string;
    private readonly _platformId: number = 6;
    private _preferences?: preferences.Preferences;
    private privacyAgreed: boolean = false;
    private _launchCount: number = 0;
    private _loginCount: number = -1;
    private isInit: boolean = false;
    private _isActivated: boolean = false;
    private _testDevices: boolean = false;
    constructor() {
        if (!Devices.instance) {
            Devices.instance = this;
        }
        return Devices.instance;
    }
    public async initAsync(q182: Context) {
        try {
            q182 ??= globalThis?.AbilityContext;
            this._preferences = await preferences.getPreferences(q182, STORAGE_KEY);
            this._distinctId = (await this._preferences.get(DISTINCT_ID, null))?.toString();
            this._deviceCode = String(await this._preferences.get(DEVICE_CODE, ""));
            this._isActivated = await this._preferences.get(USER_ACTIVATED_KEY, false) as boolean;
            if (!this.isInit) {
                this._launchCount = (await this._preferences.get(LAUNCH_COUNT_KEY, 0)) as number;
                this._launchCount = this._launchCount + 1;
                await this._preferences.put(LAUNCH_COUNT_KEY, this._launchCount);
                await this._preferences.flush();
            }
            let s182 = this.getLoginCount();
            Logger.i(`App launched: ${this._launchCount},logined: ${s182}`);
            this.isInit = true;
        }
        catch (r182) {
            Logger.e(r182);
        }
    }
    setTestDevices(p182?: string) {
        p182 ??= this.genUUID();
        this._deviceCode = p182;
        AESUtil.aesKey = p182;
    }
    public getNetCapabilities(): string {
        try {
            let n182: connection.NetHandle = connection.getDefaultNetSync();
            if (n182.netId == 0) {
                return this.getNetTypeName(-1);
            }
            let o182: connection.NetCapabilities = connection.getNetCapabilitiesSync(n182);
            return this.getNetTypeName(o182?.bearerTypes?.[0]);
        }
        catch (m182) {
            return this.getNetTypeName(m182.code);
        }
    }
    private getNetTypeName(l182: connection.NetBearType): string {
        if (l182 == null) {
            console.warn("NetBearType is null or undefined.");
            return "Unknown Network";
        }
        switch (l182) {
            case connection.NetBearType.BEARER_CELLULAR:
                return "Cellular ";
            case connection.NetBearType.BEARER_WIFI:
                return "Wi-Fi ";
            case connection.NetBearType.BEARER_BLUETOOTH:
                return "Bluetooth ";
            case connection.NetBearType.BEARER_ETHERNET:
                return "Ethernet ";
            case connection.NetBearType.BEARER_VPN:
                return "VPN ";
            default:
                return `Unknown ${l182}`;
        }
    }
    public get model() {
        return deviceInfo.productModel;
    }
    public get distributionOSApiVersion() {
        return deviceInfo.distributionOSApiVersion;
    }
    public get distributionOSVersion() {
        return deviceInfo.distributionOSVersion;
    }
    public get sdkApiVersion() {
        return deviceInfo.sdkApiVersion;
    }
    public setActivated(k182 = true) {
        this._isActivated = k182;
        this._preferences?.putSync(USER_ACTIVATED_KEY, this.isActivated);
        this._preferences?.flush();
    }
    async getRXPasteboardData(z181: boolean = false, a182?: Context): Promise<Record<string, any>> {
        try {
            const c182 = await this.getPasteboardData(a182);
            if (c182 && c182.startsWith(RX_TYPE)) {
                const d182 = c182.substring(RX_TYPE.length).split("&");
                const e182: Record<string, string> = {};
                d182.forEach((f182) => {
                    if (f182.includes("=")) {
                        const g182 = f182.split("=");
                        const h182 = g182.length;
                        if (h182 > 0) {
                            let i182 = "";
                            if (h182 > 1) {
                                try {
                                    i182 = decodeURIComponent(g182[1]);
                                }
                                catch (j182) {
                                    console.error(j182);
                                }
                            }
                            e182[g182[0]] = i182;
                        }
                    }
                });
                if (z181) {
                    pasteboard.getSystemPasteboard().clearDataSync();
                }
                return e182;
            }
        }
        catch (b182) {
            console.error(b182);
        }
    }
    async getPasteboardData(v181?: Context): Promise<string> {
        try {
            if (v181) {
                await this.checkOrRequestPermission(READ_PASTEBOARD, v181);
            }
            else {
                this.checkOrRequestPermission(READ_PASTEBOARD);
            }
            let x181: pasteboard.PasteData = pasteboard.getSystemPasteboard()?.getDataSync();
            x181.pasteStart();
            let y181 = x181?.getPrimaryText();
            x181.pasteComplete();
            return y181;
        }
        catch (w181) {
            console.error('Failed to getDataSync the pasteboard. Cause:' + w181.message);
        }
    }
    setPasteboardData(s181: string): void {
        let t181 = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, s181);
        let u181 = pasteboard.getSystemPasteboard();
        u181.setData(t181);
    }
    getLoginCount(): number {
        if (this._loginCount == -1) {
            this._loginCount = this._preferences?.getSync(LOGIN_COUNT_KEY, 0) as number;
        }
        return this._loginCount;
    }
    incrementLoginCount() {
        this._loginCount = this.getLoginCount() + 1;
        this._preferences?.putSync(LOGIN_COUNT_KEY, this._loginCount);
        this._preferences?.flush();
    }
    setPrivacyAgree(r181: Context) {
        if (!this._preferences) {
            this._preferences = preferences.getPreferencesSync(r181, { name: STORAGE_KEY });
        }
        this.privacyAgreed = true;
        this._preferences.putSync(RX_PRIVACY_AGREED, true);
        this._preferences.flush();
    }
    isPrivacyAgree(p181: Context): boolean {
        if (!this.privacyAgreed) {
            if (!this._preferences) {
                this._preferences = preferences.getPreferencesSync(p181, { name: STORAGE_KEY });
            }
            let q181 = this._preferences.getSync(RX_PRIVACY_AGREED, false);
            this.privacyAgreed = q181 as boolean;
        }
        return this.privacyAgreed;
    }
    get launchCount(): number {
        return this._launchCount;
    }
    get systemLanguage(): string {
        return i18n.System.getSystemLanguage();
    }
    get simplifiedLanguage(): string {
        return i18n.System.getSimplifiedLanguage(i18n.System.getSystemLocale());
    }
    get systemCountry(): string {
        return i18n.System.getSystemRegion();
    }
    get systemLocale(): string {
        return i18n.System.getSystemLocale();
    }
    get isActivated(): boolean {
        return this._isActivated;
    }
    get preferences() {
        return this._preferences;
    }
    get platformId() {
        return this._platformId;
    }
    get currentTimeSecond() {
        return Math.round(Date.now() / 1000);
    }
    get appInfo(): bundleManager.ApplicationInfo {
        return this.getBundleInfo().appInfo;
    }
    get bundleName() {
        return this.appInfo.name;
    }
    get signInfo() {
        return this.getBundleInfo(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_SIGNATURE_INFO);
    }
    get appIdentifier() {
        return this.signInfo.signatureInfo.appIdentifier;
    }
    get fingerprint() {
        return this.signInfo.signatureInfo.fingerprint;
    }
    get metaData(): Record<string, any> {
        const k181 = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION |
            bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_METADATA);
        return k181?.appInfo?.metadataArray?.reduce((l181: Record<string, any>, m181: bundleManager.ModuleMetadata) => {
            m181.metadata?.forEach(({ name: n181, value: o181 }: bundleManager.Metadata) => {
                l181[n181] = o181;
            });
            return l181;
        }, {});
    }
    get launchWant() {
        try {
            let j181 = bundleManager.getLaunchWant();
            return j181;
        }
        catch (h181) {
            let i181 = (h181 as BusinessError).message;
        }
    }
    genUUID() {
        return util.generateRandomUUID();
    }
    async getOAID(e181: Context): Promise<string> {
        try {
            if (SDKConfig.disableReadSensitiveInfo) {
                return undefined;
            }
            let g181 = await this.checkOrRequestPermission(APP_TRACKING_CONSENT, e181);
            if (g181) {
                return identifier.getOAID();
            }
            else {
                Logger.w('Failed to get oaid user not grant');
            }
        }
        catch (f181) {
            Logger.w('Failed to get oaid, catch error:' + f181);
            return undefined;
        }
    }
    public async checkOrRequestReadPasteboard(d181?: Context): Promise<boolean> {
        return this.checkOrRequestPermission(READ_PASTEBOARD, d181);
    }
    public async checkOrRequestPermission(a181: Permissions, b181?: Context): Promise<boolean> {
        let c181 = this.checkPermissionGrant(a181);
        if (!c181 && b181) {
            c181 = this.getPermissionResults(await this.requestPermissionsFromUser(b181, a181))?.[a181];
        }
        return c181;
    }
    getPermissionResults(v180: {
        permissions: string[];
        authResults: number[];
    }): Record<string, boolean> {
        const { permissions: w180, authResults: x180 } = v180;
        if (!w180 || !x180 || w180.length !== x180.length) {
            throw new Error('Invalid input data: permissions and authResults must have the same length.');
        }
        const y180: Record<string, boolean> = {};
        for (let z180 = 0; z180 < w180.length; z180++) {
            y180[w180[z180]] = x180[z180] === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED;
        }
        return y180;
    }
    getBundleInfo(t180: number = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION): bundleManager.BundleInfo {
        const u180: bundleManager.BundleInfo = bundleManager.getBundleInfoForSelfSync(t180);
        return u180;
    }
    checkPermissionGrant(j180: Permissions): boolean {
        let k180: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
        let l180: abilityAccessCtrl.GrantStatus = abilityAccessCtrl.GrantStatus.PERMISSION_DENIED;
        let m180: number = 0;
        try {
            let r180: bundleManager.BundleInfo = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
            let s180: bundleManager.ApplicationInfo = r180.appInfo;
            m180 = s180.accessTokenId;
        }
        catch (p180) {
            const q180: BusinessError = p180 as BusinessError;
            console.error(`Failed to get bundle info for self. Code is ${q180.code}, message is ${q180.message}`);
        }
        try {
            l180 = k180.checkAccessTokenSync(m180, j180);
        }
        catch (n180) {
            const o180: BusinessError = n180 as BusinessError;
            console.error(`Failed to check access token. Code is ${o180.code}, message is ${o180.message}`);
        }
        return l180 == abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED;
    }
    public requestPermissionsFromUser(f180: Context, ...g180: Array<Permissions>): Promise<PermissionRequestResult> {
        if (f180) {
            let i180: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
            return i180.requestPermissionsFromUser(f180, g180);
        }
        else {
            let h180: BusinessError = {
                code: -1,
                name: 'permissionGrantError',
                message: 'context null err'
            };
            throw h180;
        }
    }
    private genDistinctId() {
        this._distinctId = this.genUUID();
        this.preferences?.putSync(DISTINCT_ID, this._distinctId);
        this.preferences?.flush();
        return this._distinctId;
    }
    private genDeviceCode() {
        if (this.privacyAgreed) {
            this._deviceCode = deviceInfo.ODID?.replace(/-/g, '');
            this._deviceCode ??= this.genUUID().replace(/-/g, '');
            this.preferences?.putSync(DEVICE_CODE, this._deviceCode);
            this.preferences?.flush();
        }
        Logger.d(`genDeviceCode func privacyAgreed:${this.privacyAgreed}, deviceCode:${this.deviceCode}`);
        return this._deviceCode;
    }
    get distinctId(): string {
        if (!this._distinctId) {
            this.genDistinctId();
        }
        return this._distinctId;
    }
    get deviceCode(): string {
        try {
            if (!this._deviceCode) {
                return this.genDeviceCode();
            }
        }
        catch (e180) {
            Logger.e(e180?.errorfunc?.name + ":" + JSON.stringify(e180));
        }
        return this._deviceCode;
    }
    get timeOffset() {
        return DateTime.getTimezoneString();
    }
    getPhone(c180: string): string {
        if (c180 && c180.startsWith("+") && c180.length > 5) {
            const d180 = c180.substring(1, 5);
            return `+${parseInt(d180)}${c180.substring(5).replace(/(\d{3})\d{3}(\d{1})/, "$1***$2")}`;
        }
        else if (c180 && c180.trim() !== "") {
            return c180.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
        }
        else {
            return c180;
        }
    }
    isValidInternationalPhoneNumber(a180: string): boolean {
        const b180 = /^\+\d+$/;
        return b180.test(a180);
    }
    isValidEmail(y179: string): boolean {
        const z179 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return z179.test(y179);
    }
    isValidPhoneNumber(w179: string): boolean {
        const x179 = /^1[3-9]\d{9}$/;
        return x179.test(w179);
    }
}
export default new Devices();
