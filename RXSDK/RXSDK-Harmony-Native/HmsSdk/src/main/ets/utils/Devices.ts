import util from '@ohos.util'
import preferences from '@ohos.data.preferences'
import DateTime from './DateTime'
import { BusinessError, deviceInfo, pasteboard } from '@kit.BasicServicesKit';
import { Logger } from "./Logger";
import { abilityAccessCtrl, bundleManager, Context, PermissionRequestResult, Permissions } from '@kit.AbilityKit';
import { identifier } from '@kit.AdsKit';
import SDKConfig from '../sdk/SDKConfig';
import { connection } from '@kit.NetworkKit';
import AESUtil from './AESUtil';
import { i18n } from '@kit.LocalizationKit';

let DEVICE_CODE = "devices_code"
let DISTINCT_ID = "distinct_id"
let STORAGE_KEY = "rx_device_info"
let RX_PRIVACY_AGREED = "rx_privacy_agreed"
const LAUNCH_COUNT_KEY = "app_launch_count";
const LOGIN_COUNT_KEY = "user_login_count";
const USER_ACTIVATED_KEY = "user_activated";
const RX_TYPE = "type=rx&";

const READ_PASTEBOARD: Permissions = 'ohos.permission.READ_PASTEBOARD'

const APP_TRACKING_CONSENT: Permissions = 'ohos.permission.APP_TRACKING_CONSENT'


class Devices {
  private static instance: Devices;
  private _deviceCode: string
  private _distinctId: string
  private readonly _platformId: number = 6
  private _preferences?: preferences.Preferences
  private privacyAgreed: boolean = false
  private _launchCount: number = 0
  private _loginCount: number = -1
  private isInit: boolean = false
  private _isActivated: boolean = false
  private _testDevices: boolean = false;

  constructor() {
    if (!Devices.instance) {
      Devices.instance = this;
    }
    return Devices.instance;
  }

  public async initAsync(context: Context) {
    try {
      context ??= globalThis?.AbilityContext;
      this._preferences = await preferences.getPreferences(context, STORAGE_KEY);
      this._distinctId = (await this._preferences.get(DISTINCT_ID, null))?.toString();
      this._deviceCode = String(await this._preferences.get(DEVICE_CODE, ""));
      this._isActivated = await this._preferences.get(USER_ACTIVATED_KEY, false) as boolean;

      if (!this.isInit) {
        this._launchCount = (await this._preferences.get(LAUNCH_COUNT_KEY, 0)) as number;
        this._launchCount = this._launchCount + 1;
        await this._preferences.put(LAUNCH_COUNT_KEY, this._launchCount);
        await this._preferences.flush();
      }
      let loginCount = this.getLoginCount();
      Logger.i(`App launched: ${this._launchCount},logined: ${loginCount}`);
      this.isInit = true;
    } catch (e) {
      Logger.e(e)
    }

  }

  setTestDevices(value?: string) {
    value ??= this.genUUID();
    this._deviceCode = value
    AESUtil.aesKey = value
  }

  public getNetCapabilities(): string {
    try {
      let netHandle: connection.NetHandle = connection.getDefaultNetSync()
      if (netHandle.netId == 0) {
        // 当前没有已连接的网络时，获取的netHandler的netid为0，属于异常场景，此处可以实际情况自行添加一些处理机制。
        return this.getNetTypeName(-1);
      }
      let data: connection.NetCapabilities = connection.getNetCapabilitiesSync(netHandle)
      // console.info("Succeeded to get data: " + JSON.stringify(data));
      return this.getNetTypeName(data?.bearerTypes?.[0])
    } catch (e) {
      // console.error(`Failed to get net capabilities. Code:${e.code}, message:${e.message}`);
      return this.getNetTypeName(e.code);
    }
  }

  private getNetTypeName(type: connection.NetBearType): string {
    if (type == null) {
      console.warn("NetBearType is null or undefined.");
      return "Unknown Network";
    }
    switch (type) {
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
        return `Unknown ${type}`;
    }
  }

  public get model() {
    return deviceInfo.productModel
  }

  //derived from the new interface's since field 6*10000 + 0*100 + 0
  public get distributionOSApiVersion() {
    return deviceInfo.distributionOSApiVersion
  }

  //5.0.0
  public get distributionOSVersion() {
    return deviceInfo.distributionOSVersion
  }
  //12
  public get sdkApiVersion() {
    return deviceInfo.sdkApiVersion
  }

  public setActivated(activated = true) {
    this._isActivated = activated
    this._preferences?.putSync(USER_ACTIVATED_KEY, this.isActivated);
    this._preferences?.flush();
  }

  async getRXPasteboardData(clearAfterRead: boolean = false, context?: Context): Promise<Record<string, any>> {
    try {
      const query = await this.getPasteboardData(context);
      if (query && query.startsWith(RX_TYPE)) {
        const arrs = query.substring(RX_TYPE.length).split("&");
        const map: Record<string, string> = {};
        arrs.forEach((arr) => {
          if (arr.includes("=")) {
            const arrChild = arr.split("=");
            const arrLen = arrChild.length;
            if (arrLen > 0) {
              let t = "";
              if (arrLen > 1) {
                try {
                  t = decodeURIComponent(arrChild[1]);
                } catch (e) {
                  console.error(e);
                }
              }
              map[arrChild[0]] = t;
            }
          }
        });
        if (clearAfterRead) {
          pasteboard.getSystemPasteboard().clearDataSync()
        }
        return map;
      }
    } catch (error) {
      console.error(error);
    }
  }


  async getPasteboardData(context?: Context): Promise<string> {
    try {
      if (context) {
        await this.checkOrRequestPermission(READ_PASTEBOARD, context)
      } else {
        this.checkOrRequestPermission(READ_PASTEBOARD)
      }
      let pasteData: pasteboard.PasteData = pasteboard.getSystemPasteboard()?.getDataSync()
      pasteData.pasteStart()
      let pText = pasteData?.getPrimaryText()
      pasteData.pasteComplete()
      return pText;
    } catch (err) {
      console.error('Failed to getDataSync the pasteboard. Cause:' + err.message);
    }
  }

  setPasteboardData(data: string): void {
    let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, data);
    let systemPasteboard = pasteboard.getSystemPasteboard();
    systemPasteboard.setData(pasteData);
  }

  // 获取累计登录次数
  getLoginCount(): number {
    if (this._loginCount == -1) {
      this._loginCount = this._preferences?.getSync(LOGIN_COUNT_KEY, 0) as number;
    }
    return this._loginCount
  }

  // 增加登录次数
  incrementLoginCount() {
    this._loginCount = this.getLoginCount() + 1;
    this._preferences?.putSync(LOGIN_COUNT_KEY, this._loginCount);
    this._preferences?.flush();
  }

  setPrivacyAgree(context: Context) {
    if (!this._preferences) {
      this._preferences = preferences.getPreferencesSync(context, { name: STORAGE_KEY })
    }
    this.privacyAgreed = true;
    this._preferences.putSync(RX_PRIVACY_AGREED, true)
    this._preferences.flush()
  }

  isPrivacyAgree(context: Context): boolean {
    if (!this.privacyAgreed) {
      if (!this._preferences) {
        this._preferences = preferences.getPreferencesSync(context, { name: STORAGE_KEY })
      }
      let ret = this._preferences.getSync(RX_PRIVACY_AGREED, false)
      this.privacyAgreed = ret as boolean;
    }
    return this.privacyAgreed
  }

  get launchCount(): number {
    return this._launchCount;
  }

  get systemLanguage(): string {
    return i18n.System.getSystemLanguage(); // systemLanguage为当前系统语言
  }

  get simplifiedLanguage(): string {
    return i18n.System.getSimplifiedLanguage(i18n.System.getSystemLocale())
  }

  get systemCountry(): string {
    return i18n.System.getSystemRegion(); //CN
  }

  get systemLocale(): string {
    return i18n.System.getSystemLocale(); // zh-Hans-CN
  }

  get isActivated(): boolean {
    return this._isActivated;
  }

  get preferences() {
    return this._preferences;
  }

  get platformId() {
    return this._platformId
  }

  get currentTimeSecond() {
    return Math.round(Date.now() / 1000)
  }

  get appInfo(): bundleManager.ApplicationInfo {
    return this.getBundleInfo().appInfo;
  }

  get bundleName() {
    return this.appInfo.name
  }

  get signInfo() {
    return this.getBundleInfo(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_SIGNATURE_INFO)
  }

  get appIdentifier() {
    return this.signInfo.signatureInfo.appIdentifier
  }

  get fingerprint() {
    return this.signInfo.signatureInfo.fingerprint
  }


  get metaData(): Record<string, any> {
    const info = bundleManager.getBundleInfoForSelfSync(
      bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION |
      bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_METADATA
    );
    return info?.appInfo?.metadataArray?.reduce((meta: Record<string, any>, module: bundleManager.ModuleMetadata) => {
      module.metadata?.forEach(({ name, value }: bundleManager.Metadata) => {
        meta[name] = value;
      });
      return meta;
    }, {});
  }

  get launchWant() {
    try {
      let want = bundleManager.getLaunchWant();
      // hilog.info(0x0000, 'testTag', 'getLaunchWant ability name: %{public}s', want.abilityName);
      // hilog.info(0x0000, 'testTag', 'getLaunchWant bundle name: %{public}s', want.bundleName);
      return want
    } catch (error) {
      let message = (error as BusinessError).message;
      // hilog.error(0x0000, 'testTag', 'getLaunchWant failed: %{public}s', message);
    }
  }


  genUUID() {
    return util.generateRandomUUID()
  }

  async getOAID(context: Context): Promise<string> {
    try {
      if (SDKConfig.disableReadSensitiveInfo) {
        return undefined;
      }
      let isGrant = await this.checkOrRequestPermission(APP_TRACKING_CONSENT, context);
      if (isGrant) {
        return identifier.getOAID();
      } else {
        Logger.w('Failed to get oaid user not grant');
      }
    } catch (error) {
      Logger.w('Failed to get oaid, catch error:' + error);
      return undefined;
    }
  }

  public async checkOrRequestReadPasteboard(context?: Context): Promise<boolean> {
    return this.checkOrRequestPermission(READ_PASTEBOARD, context)
  }

  public async checkOrRequestPermission(permission: Permissions, context?: Context): Promise<boolean> {
    let isGrant = this.checkPermissionGrant(permission);
    if (!isGrant && context) {
      isGrant = this.getPermissionResults(await this.requestPermissionsFromUser(context, permission))?.[permission];
    }
    return isGrant;
  }

  getPermissionResults(
    data: {
      permissions: string[];
      authResults: number[];
    }
  ): Record<string, boolean> {
    const { permissions, authResults } = data;
    if (!permissions || !authResults || permissions.length !== authResults.length) {
      throw new Error('Invalid input data: permissions and authResults must have the same length.');
    }
    const result: Record<string, boolean> = {};
    for (let i = 0; i < permissions.length; i++) {
      result[permissions[i]] = authResults[i] === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED;
    }
    return result;
  }

  getBundleInfo(bundleFlags: number = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION): bundleManager.BundleInfo {
    const data: bundleManager.BundleInfo = bundleManager.getBundleInfoForSelfSync(bundleFlags);
    return data
  }

  checkPermissionGrant(permission: Permissions): boolean {
    let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
    let grantStatus: abilityAccessCtrl.GrantStatus = abilityAccessCtrl.GrantStatus.PERMISSION_DENIED;

    let tokenId: number = 0;
    try {
      let bundleInfo: bundleManager.BundleInfo = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
      let appInfo: bundleManager.ApplicationInfo = bundleInfo.appInfo;
      tokenId = appInfo.accessTokenId;
    } catch (error) {
      const err: BusinessError = error as BusinessError;
      console.error(`Failed to get bundle info for self. Code is ${err.code}, message is ${err.message}`);
    }
    try {
      grantStatus = atManager.checkAccessTokenSync(tokenId, permission);
    } catch (error) {
      const err: BusinessError = error as BusinessError;
      console.error(`Failed to check access token. Code is ${err.code}, message is ${err.message}`);
    }
    return grantStatus == abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED;
  }

  public requestPermissionsFromUser(context: Context, ...permissionList: Array<Permissions>): Promise<PermissionRequestResult> {
    if (context) {
      let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
      return atManager.requestPermissionsFromUser(context, permissionList);
    } else {
      let err: BusinessError = {
        code: -1,
        name: 'permissionGrantError',
        message: 'context null err'
      }
      throw err
    }
  }

  private genDistinctId() {
    this._distinctId = this.genUUID()
    this.preferences?.putSync(DISTINCT_ID, this._distinctId);
    this.preferences?.flush()
    return this._distinctId;
  }

  private genDeviceCode() {

    if (this.privacyAgreed) {
      this._deviceCode = deviceInfo.ODID?.replace(/-/g, '')
      this._deviceCode ??= this.genUUID().replace(/-/g, '')
      this.preferences?.putSync(DEVICE_CODE, this._deviceCode);
      this.preferences?.flush()
    }

    Logger.d(`genDeviceCode func privacyAgreed:${this.privacyAgreed}, deviceCode:${this.deviceCode}`)
    return this._deviceCode
  }

  get distinctId(): string {
    if (!this._distinctId) {
      this.genDistinctId()
    }
    return this._distinctId
  }

  get deviceCode(): string {
    try {
      if (!this._deviceCode) {
        return this.genDeviceCode()
      }
    } catch (e) {
      Logger.e(e?.errorfunc?.name + ":" + JSON.stringify(e))
    }
    return this._deviceCode
  }


  get timeOffset() {
    return DateTime.getTimezoneString()
  }

  getPhone(phone: string): string {
    if (phone && phone.startsWith("+") && phone.length > 5) {
      const regionCode = phone.substring(1, 5);
      return `+${parseInt(regionCode)}${phone.substring(5).replace(/(\d{3})\d{3}(\d{1})/, "$1***$2")}`;
    } else if (phone && phone.trim() !== "") {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    } else {
      return phone;
    }
  }

  isValidInternationalPhoneNumber(phoneNumber: string): boolean {
    // 这个正则表达式匹配以"+"开头，后跟1到多个数字的字符串
    const phoneRegex = /^\+\d+$/;
    return phoneRegex.test(phoneNumber);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  }
}

export default new Devices()

// export const devices = new Devices();