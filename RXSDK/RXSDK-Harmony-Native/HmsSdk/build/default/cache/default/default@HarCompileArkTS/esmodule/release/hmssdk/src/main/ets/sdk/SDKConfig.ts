import { RXRequest, RequestMethod } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import type { RXConfig, PasswordStrength, RXResult, UserCenterArgs } from '../types/Index';
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { RXEvent } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXEvent&4.0.0";
import gamePlayer from "@hms:core.gameservice.gameplayer";
import type common from "@ohos:app.ability.common";
import type { Context } from "@ohos:abilityAccessCtrl";
import type { UIContext } from "@ohos:arkui.UIContext";
import type { InitConfig, LoginConfig } from '../types/InitConfig';
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import UserActionTracer from "@normalized:N&&&hmssdk/src/main/ets/base/UserActionTracer&4.0.0";
import EventBus from "@normalized:N&&&hmssdk/src/main/ets/base/EventBus&4.0.0";
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
interface InitParams {
    version: object;
}
interface IEvent<T> {
    [eventName: string]: T;
}
const EVENT_ATTRS: string = "v1/sdkconfig/sync/event_attrs";
const SDK_CONFIG_INIT: string = ApiPath.SDK_CONFIG_INIT;
const sensitiveKey = Symbol('_event');
class SDKConfig {
    private readonly _TAG: string = "RXSDK";
    public get TAG(): string {
        return this._TAG;
    }
    private _VERSION: string;
    private _APP_VERSION: string;
    public readonly START_TIME: number = new Date().getTime();
    private static instance: SDKConfig | null = null;
    private _cpid: string;
    private _product_id: string;
    private _encipher: number = 0;
    private _channel_id: string;
    private _sub_channel_id: string;
    private _base_urls: string[];
    private _debugEnable: boolean = false;
    private _lang: string = 'zh';
    private _country: string = 'cn';
    private _context;
    private _uiContext;
    private _syncInfoEnable: boolean;
    private _passwordStrength: PasswordStrength = { password_type: "default" };
    private _ucBtns: string[];
    private _ipUrl: string;
    private _pushTaskId: string;
    private _disableReadSensitiveInfo: boolean;
    private _initConfig?: InitConfig | undefined;
    private _isInit: boolean = false;
    private _wx_appid?: string;
    private _cpRoleId: string;
    private _regionTag?: string;
    public get isInit(): boolean {
        return this._isInit;
    }
    public setGameInfo(g159: string, h159: string) {
        this._cpRoleId = g159;
        this._regionTag = h159;
    }
    public get cpRoleId(): string {
        return this._cpRoleId;
    }
    public get regionTag(): string {
        return this._regionTag;
    }
    public get encipher(): number {
        return this._encipher;
    }
    public get initConfig(): InitConfig | undefined {
        return this._initConfig;
    }
    public get loginMethods(): Array<LoginConfig> {
        return this._initConfig?.client_login?.list;
    }
    public get isModReport(): boolean {
        return this._initConfig?.device?.mod?.of;
    }
    public get isNetReport(): boolean {
        return this._initConfig?.device?.net?.of;
    }
    public get isUseFastAuth() {
        return this._initConfig?.channel?.ra?.fa ?? true;
    }
    public get isCustomKeyboard() {
        return this._initConfig?.channel?.ra?.ckb ?? true;
    }
    public get isUseIifaaAuth() {
        return this._initConfig?.channel?.ra?.iifaa ?? true;
    }
    public get realAuthIifaaScheme(): string {
        return this._initConfig?.channel?.sh ?? this._initConfig?.channel?.ra?.sh ?? "";
    }
    public get disableReadSensitiveInfo(): boolean {
        return this._disableReadSensitiveInfo;
    }
    public get VERSION(): string {
        return this._VERSION;
    }
    public get APP_VERSION(): string {
        return this._APP_VERSION;
    }
    public get WX_APP_ID(): string {
        this._wx_appid = this._wx_appid || this._initConfig?.client_login?.list?.find(f159 => f159.method === 'wechat')?.['wx_appid'];
        this._wx_appid ??= Devices.metaData?.["wx_appid"];
        return this._wx_appid;
    }
    public get ipUrl(): string {
        return this._ipUrl;
    }
    public get userCenterConfig(): UserCenterArgs {
        if (this._ucBtns) {
            return { btns: this._ucBtns };
        }
        else {
            return {};
        }
    }
    public set pushTaskId(e159: string) {
        this._pushTaskId = e159;
    }
    public get pushTaskId(): string {
        return this._pushTaskId;
    }
    public set syncInfoEnable(d159) {
        this._syncInfoEnable = d159;
    }
    public get syncInfoEnable(): boolean {
        return this._syncInfoEnable;
    }
    public set passwordStrength(c159: PasswordStrength) {
        this._passwordStrength = c159;
    }
    public get passwordStrength(): PasswordStrength {
        return this._passwordStrength;
    }
    setConfig(y158: RXConfig, z158: Context, a159: UIContext, b159: string) {
        this._cpid = y158.cpId;
        this._product_id = y158.productId;
        this._channel_id = y158.channelId;
        this._base_urls = y158.baseUrls;
        this._disableReadSensitiveInfo = y158.disableReadSensitiveInfo;
        this._context = z158;
        this._context ??= globalThis?.AbilityContext;
        this._uiContext = a159;
        this._VERSION = b159;
        this._wx_appid = y158.wxAppId;
        this._APP_VERSION = Devices.getBundleInfo().versionName;
        this._debugEnable = y158.debugEnable;
        this._regionTag ??= y158.regionTag;
        this._cpRoleId ??= y158.cpRoleId;
        Logger.log(`init sdk v${this._VERSION} with:${JSON.stringify(y158)}`);
        return this;
    }
    public async initAsync(): Promise<RXResult<InitConfig>> {
        let u158: InitParams = { version: {} };
        await gamePlayer.init(this.context as common.UIAbilityContext);
        gamePlayer.on('playerChanged', this.onPlayerChangedEventCallback);
        UserActionTracer.init(this.context);
        return await RXRequest.request<InitConfig>({
            path: SDK_CONFIG_INIT,
            data: u158,
            method: RequestMethod.POST,
            withToken: false,
            encipher: 0
        }).then(async (v158) => {
            if (v158.code == 0 && v158.data) {
                let w158 = v158.data;
                this._initConfig = w158;
                Logger.log("rxsdk init data:" + JSON.stringify(w158));
                this._ucBtns = w158?.["channel"]?.["uc"]?.["list"];
                if (w158?.["ip"]?.["api"]) {
                    this._ipUrl = w158['ip']['api'];
                }
                this._encipher = (w158?.cp?.of ?? false) ? 1 : 0;
                Logger.d("init encipher val:" + this._encipher);
                let x158 = w158?.device?.pb >= 0 ?? true;
                if (x158) {
                    await Devices.checkOrRequestReadPasteboard(this.context);
                }
                UserActionTracer.setConfig(w158.log?.ua?.of, w158.log?.ua?.max, w158.log?.ua?.no);
                this._isInit = true;
            }
            return { ...v158, sdk: { version: this._VERSION }, };
        });
    }
    private constructor() {
        SDKConfig.instance = this;
        this[sensitiveKey] = new RXEvent();
    }
    public static get() {
        if (SDKConfig.instance == null) {
            SDKConfig.instance = new SDKConfig();
        }
        return SDKConfig.instance;
    }
    private onPlayerChangedEventCallback(t158: gamePlayer.PlayerChangedResult) {
        if (t158.event === gamePlayer.PlayerChangedEvent.SWITCH_GAME_ACCOUNT) {
            Logger.info(`onPlayerChangedEventCallback ` + t158.resultInfo);
        }
        EventBus.getInstance().emit(t158.event as number, t158.resultInfo);
    }
    get context() {
        return this._context || globalThis?.AbilityContext;
    }
    public get uiContext() {
        return this._uiContext;
    }
    get cpId() {
        return this._cpid;
    }
    get productId() {
        return this._product_id;
    }
    get channelId() {
        return this._channel_id;
    }
    set subChannelId(s158: string) {
        this._sub_channel_id = s158;
    }
    get subChannelId() {
        return this._sub_channel_id;
    }
    get debugEnable() {
        return this._debugEnable;
    }
    get lang() {
        return this._lang;
    }
    get country() {
        return this._country;
    }
    get domain(): string {
        const r158 = this._base_urls?.[0];
        if (r158 && r158.endsWith('/')) {
            return r158.slice(0, -1);
        }
        return r158 ?? '';
    }
    get domains(): Array<string> {
        return this._base_urls;
    }
    async eventAttrs() {
        let q158: InitParams = {
            version: new Map<string, object>()
        };
        return await RXRequest.get<RXResult<object>>(EVENT_ATTRS, q158);
    }
}
export default SDKConfig.get();
