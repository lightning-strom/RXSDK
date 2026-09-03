import { RXRequest, RequestMethod } from '../net/RXRequest'
import { RXConfig, PasswordStrength, RXResult, UserCenterArgs, SDKEventType } from '../types/Index'
import { Logger } from '../utils/Logger'
import { RXEvent } from '../utils/RXEvent'
import { gamePlayer } from '@kit.GameServiceKit'
import { common, Context } from '@kit.AbilityKit'
import { UIContext } from '@kit.ArkUI'
import UserActivate from '../base/UserActivate'
import { InitConfig, LoginConfig } from '../types/InitConfig'
import Devices from '../utils/Devices'
import UserActionTracer from '../base/UserActionTracer'
import EventBus from '../base/EventBus'
import ApiPath from '../constants/ApiPath'
import Objects from '../utils/Objects'

interface InitParams {
  version: object
}

interface IEvent<T> {
  [eventName: string]: T;
}

const EVENT_ATTRS: string = "v1/sdkconfig/sync/event_attrs";
const SDK_CONFIG_INIT: string = ApiPath.SDK_CONFIG_INIT;
const sensitiveKey = Symbol('_event');

class SDKConfig {
  private readonly _TAG: string = "RXSDK"

  public get TAG(): string {
    return this._TAG
  }

  private _VERSION: string
  private _APP_VERSION: string
  public readonly START_TIME: number = new Date().getTime();
  private static instance: SDKConfig | null = null;
  private _cpid: string
  private _product_id: string
  private _encipher: number = 0
  private _channel_id: string
  private _sub_channel_id: string
  private _base_urls: string[]
  private _debugEnable: boolean = false
  private _lang: string = 'zh'
  private _country: string = 'cn'
  private _context
  private _uiContext

  private _syncInfoEnable: boolean
  private _passwordStrength: PasswordStrength = { password_type: "default" }
  private _ucBtns: string[]
  private _ipUrl: string;
  private _pushTaskId: string
  private _disableReadSensitiveInfo: boolean
  private _initConfig?: InitConfig | undefined
  private _isInit: boolean = false

  private _wx_appid?: string

  private _cpRoleId: string
  private _regionTag?: string

  public get isInit(): boolean {
    return this._isInit
  }

  public setGameInfo(roleId: string, regionTag: string) {
    this._cpRoleId = roleId
    this._regionTag = regionTag
  }


  public get cpRoleId(): string {
    return this._cpRoleId
  }

  public get regionTag(): string {
    return this._regionTag
  }

  //  1 标识是加密数据
  public get encipher(): number {
    return this._encipher
  }

  public get initConfig(): InitConfig | undefined {
    return this._initConfig
  }

  public get loginMethods(): Array<LoginConfig> {
    return this._initConfig?.client_login?.list
  }

  public get isModReport(): boolean {
    return this._initConfig?.device?.mod?.of
  }

  public get isNetReport(): boolean {
    return this._initConfig?.device?.net?.of
  }

  public get isUseFastAuth() {
    return this._initConfig?.channel?.ra?.fa ?? true
  }

  public get isCustomKeyboard() {
    // return false
    return this._initConfig?.channel?.ra?.ckb ?? true
  }

  public get isUseIifaaAuth() {
    return this._initConfig?.channel?.ra?.iifaa ?? true
  }

  public get realAuthIifaaScheme(): string {
    return this._initConfig?.channel?.sh ?? this._initConfig?.channel?.ra?.sh ?? ""
  }

  public get disableReadSensitiveInfo(): boolean {
    return this._disableReadSensitiveInfo
  }

  public get VERSION(): string {
    return this._VERSION
  }

  public get APP_VERSION(): string {
    return this._APP_VERSION
  }

  public get WX_APP_ID(): string {
    this._wx_appid = this._wx_appid || this._initConfig?.client_login?.list?.find(element => element.method === 'wechat')?.['wx_appid'];
    this._wx_appid ??= Devices.metaData?.["wx_appid"]
    return this._wx_appid;
  }

  public get ipUrl(): string {
    return this._ipUrl
  }

  public get userCenterConfig(): UserCenterArgs {
    if (this._ucBtns) {
      return { btns: this._ucBtns }
    } else {
      return {}
    }
  }

  public set pushTaskId(value: string) {
    this._pushTaskId = value
  }

  public get pushTaskId(): string {
    return this._pushTaskId
  }

  public set syncInfoEnable(value) {
    this._syncInfoEnable = value
  }

  public get syncInfoEnable(): boolean {
    return this._syncInfoEnable
  }

  public set passwordStrength(value: PasswordStrength) {
    this._passwordStrength = value
  }

  public get passwordStrength(): PasswordStrength {
    return this._passwordStrength
  }

  setConfig(config: RXConfig, context: Context, uiContext: UIContext, version: string) {
    this._cpid = config.cpId;
    this._product_id = config.productId;
    this._channel_id = config.channelId;
    this._base_urls = config.baseUrls;
    this._disableReadSensitiveInfo = config.disableReadSensitiveInfo;
    this._context = context
    this._context ??= globalThis?.AbilityContext;
    this._uiContext = uiContext
    this._VERSION = version
    this._wx_appid = config.wxAppId
    this._APP_VERSION = Devices.getBundleInfo().versionName
    this._debugEnable = config.debugEnable

    this._regionTag ??= config.regionTag
    this._cpRoleId ??= config.cpRoleId

    Logger.log(`init sdk v${this._VERSION} with:${JSON.stringify(config)}`);
    return this
  }

  public async initAsync(): Promise<RXResult<InitConfig>> {
    let params: InitParams = { version: {} }
    await gamePlayer.init(this.context as common.UIAbilityContext);
    gamePlayer.on('playerChanged', this.onPlayerChangedEventCallback);
    UserActionTracer.init(this.context)
    return await RXRequest.request<InitConfig>({
      path: SDK_CONFIG_INIT,
      data: params,
      method: RequestMethod.POST,
      withToken: false,
      encipher: 0
    }).then(async resp => {
      if (resp.code == 0 && resp.data) {
        let data = resp.data
        this._initConfig = data;

        Logger.log("rxsdk init data:" + JSON.stringify(data));

        this._ucBtns = data?.["channel"]?.["uc"]?.["list"];
        if (data?.["ip"]?.["api"]) {
          this._ipUrl = data['ip']['api']
        }
        this._encipher = (data?.cp?.of ?? false) ? 1 : 0;
        // this._encipher=0
        Logger.d("init encipher val:" + this._encipher)
        let grant = data?.device?.pb >= 0 ?? true;
        if (grant) {
          await Devices.checkOrRequestReadPasteboard(this.context)
        }
        UserActionTracer.setConfig(data.log?.ua?.of, data.log?.ua?.max, data.log?.ua?.no)
        this._isInit = true
      }
      return { ...resp, sdk: { version: this._VERSION }, }
    })
  }

  private constructor() {
    SDKConfig.instance = this;
    this[sensitiveKey] = new RXEvent()
  }


  public static get() {
    if (SDKConfig.instance == null) {
      SDKConfig.instance = new SDKConfig();
    }
    return SDKConfig.instance;
  }

  private onPlayerChangedEventCallback(result: gamePlayer.PlayerChangedResult) {
    if (result.event === gamePlayer.PlayerChangedEvent.SWITCH_GAME_ACCOUNT) {
      // 游戏号已切换，完成本地缓存清理工作后，再次调用unionLogin接口等
      Logger.info(`onPlayerChangedEventCallback ` + result.resultInfo);
    }
    EventBus.getInstance().emit(result.event as number, result.resultInfo)
  }


  get context() {
    return this._context || globalThis?.AbilityContext
  }

  public get uiContext() {
    return this._uiContext
  }


  get cpId() {
    return this._cpid
  }

  get productId() {
    return this._product_id
  }

  get channelId() {
    return this._channel_id
  }

  set subChannelId(sbid: string) {
    this._sub_channel_id = sbid
  }

  get subChannelId() {
    return this._sub_channel_id
  }

  get debugEnable() {
    return this._debugEnable
  }

  get lang() {
    return this._lang
  }


  get country() {
    return this._country
  }

  get domain(): string {
    const domain = this._base_urls?.[0];
    if (domain && domain.endsWith('/')) {
      return domain.slice(0, -1);
    }
    return domain ?? '';
  }

  get domains(): Array<string> {
    return this._base_urls
  }

  //   {
  //   "data": {
  //     "public_attr": null,
  //     "refresh": 600000,
  //     "version": "1700890177118"
  //   },
  //   "code": 0
  // }
  async eventAttrs() {
    let params: InitParams = {
      version: new Map<string, object>()
    }
    return await RXRequest.get<RXResult<object>>(EVENT_ATTRS, params)
  }
}

export default SDKConfig.get()