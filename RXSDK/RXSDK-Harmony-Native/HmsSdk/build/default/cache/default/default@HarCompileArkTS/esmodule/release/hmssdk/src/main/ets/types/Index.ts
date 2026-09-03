import type { UIContext } from "@ohos:arkui.UIContext";
import type window from "@ohos:window";
import type { ShareMediaType } from './ShareTypes';
import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import type common from "@ohos:app.ability.common";
import type { Context } from "@ohos:abilityAccessCtrl";
import type Want from "@ohos:app.ability.Want";
import type { Callback } from "@ohos:base";
import type harmonyShare from "@hms:collaboration.harmonyShare";
import { RXError } from "@normalized:N&&&hmssdk/src/main/ets/base/RXError&4.0.0";
import type { ISocial } from '../api/ISocial';
export interface RXMessage {
    type: string;
    funcName: string;
    args: ESObject;
    timeoutMs: number;
    userData: ESObject | undefined;
    modulePath: string | undefined;
    callback: ESObject | undefined;
    callbackFuncName: string | undefined;
}
export interface RXConfig {
    cpId: string;
    productId: string;
    channelId: string;
    baseUrls: string[];
    privacyEnable?: boolean;
    privacyTitle?: string;
    privacy?: string;
    disableReadSensitiveInfo?: boolean;
    debugEnable?: boolean;
    wxAppId?: string;
    logoResource?: any;
    cpRoleId?: string;
    regionTag?: string;
}
export interface EmptyObject {
}
export interface Obj {
}
export type ESObject = any;
export type Any = any;
export type CaptchaType = "email" | "phone";
export interface RealNameResult {
    aas?: number;
    age: number;
    limit: number;
}
export interface IifaaRedirectURLResp {
    redirect_url?: string;
    redirectUrl?: string;
    url?: string;
}
export interface IifaaValidateResp extends RealNameResult {
}
export enum LoginMethod {
    Guest = "guest",
    Wechat = "wechat",
    Harmony = "harmony",
    Hwjos = "hwjos",
    UserName = "username",
    CaptchaCode = "captchacode"
}
export enum RegisterType {
    Normal = 1,
    Phone = 2,
    Email = 3
}
export enum Purpose {
    PURPOSE_KEY = "purpose",
    Register = "register",
    BindPhone = "bindphone",
    UnbindPhone = "unbindphone",
    ResetPwd = "resetpwd",
    BindEmail = "bindemail",
    UnbindEmail = "unbindemail",
    Login = "login",
    SetPwd = "setpwd"
}
export interface SendCaptchaParams {
    type?: CaptchaType;
    target?: string;
    email?: string;
    phone?: string;
    purpose: Purpose;
    tencent_captcha?: Record<string, object>;
}
export enum RXErrorCode {
    OK = 0,
    CANCEL = 1,
    NET_ERROR = 1000,
    PASSWORD_FORMAT_ERROR = 3100,
    PASSWORD_NULL_ERROR = 3101,
    INIT_PARAMS_ERROR = 2000,
    INIT_ERROR = 2001,
    THIRD_INIT_ERROR = 2002,
    LOGIN_ERROR = 3000,
    LOGIN_CANCEL = 3001,
    THIRD_LOGIN_ERROR = 3002,
    NOT_LOGIN_ERROR = 3003,
    TOKEN_ERROR = 3004,
    OTHER_LOGIN = 3005,
    UNSUPPORTED_LOGIN = 3006,
    REAL_NAME_ERROR = 3301,
    THIRD_REAL_NAME_ERROR = 3302,
    DEREGISTER_CANCEL = 3201,
    PAY_ERROR = 4000,
    PAY_CANCEL = 4001,
    THIRD_PAY_ERROR = 4002,
    ORDER_PARAMS_ERROR = 4101,
    ORDER_REPEAT_ERROR = 4100,
    PAY_PARAMS_ERROR = 4102,
    SHARE_PARAMS_ERROR = 5000,
    SHARE_CANCEL = 5001,
    SHARE_NOT_SUPPORT = 5002,
    SHARE_KNOCK_NOT_ENABLE = 5003,
    GPS_DATA_ERROR = 6020,
    UI_CLOSE = 6010,
    DISAGREE_PRIVACY = 6000,
    PERMISSION_ERROR = 6001,
    PERMISSION_DENIED = 6002,
    NOT_INSTALL_WECHAT = 6101,
    PARAMETER_ERROR = 7000,
    THIRD_UNKNOWN_ERROR = 8000,
    UNKNOWN_ERROR = 9000,
    LOGIN_OPENID_ERROR = 302205,
    CAPTCHA_VERIFY = 312241,
    ALREADY_REAL_NAME = 312224
}
export interface PasswordStrength {
    password_type: "default" | "custom" | "average" | "strong";
    pattern?: string;
}
export interface RXLoginConfig {
    accountInfos?: Array<object>;
    showLoginDialog?: boolean;
    unbindPlayer?: boolean;
    loginPanelType?: number;
    scopes?: string[];
    permissions?: string[];
    forceAuthorization?: boolean;
    fromUnionLogin?: boolean;
    ext?: Record<string, any>;
    loginMethods?: Array<{
        method: string;
    }>;
    indulgeAuth?: 0 | 1;
    canCloseRealAuth?: boolean;
    firstNeedSetPassword?: boolean;
    quickLoginEnable?: boolean;
    isDeregisterShow?: boolean;
    privacyEnable?: boolean;
    privacyText1?: string;
    privacyText2?: string;
    privacyText3?: string;
    privacyUrl1?: string;
    privacyUrl2?: string;
    privacyUrl3?: string;
    logoResource?: any;
}
export interface LoginParams {
    method?: LoginMethod | string;
    username?: string;
    password?: string;
    login_openid?: string;
    user_attrs?: string;
    sign_fields?: string;
    migrate_args?: object;
    user_transmits?: object | string;
    device?: object;
    distinct_id?: string;
    ext?: object | CaptchaExt;
}
export interface BindAccountParams {
    method?: LoginMethod | string;
    wx_appid?: string;
    ext?: object;
}
export interface CaptchaExt {
    captcha_code: string;
}
export interface LoginData {
    token: AccessToken;
    username: string;
    method: string;
    login_method: string;
    login_username: string;
    password_set: boolean;
    nickname: string;
    avatar: string;
    ts: number;
    attr: number;
    flag: number;
    user_flag: number;
    aas: number;
    age: number;
    sex: number;
    openid: string;
    oldopenid: string;
    devicecode: string;
    cp_user_id: string;
    login_openid: string;
    fields_sign: string;
    source: string;
    source_channel: string;
    topinviter_openid: string;
    tid: string;
    uid: string;
    sub_channel_id: string;
    ext: object;
    binding?: boolean;
    user_transmits?: object | string;
    reward?: {
        kind: RewardKind;
        list: Reward[];
    };
}
export enum RewardKind {
    REAL_AUTH = "realauth"
}
export interface Reward {
    name: string;
    tag: string;
    icon: string;
    num: number;
    time_limit?: string;
    num_format?: string;
}
export interface Account {
    openid: string;
    login_openid?: string;
    method: string;
    login_method?: string;
    username?: string;
    password?: string;
    avatar?: string;
    nickname?: string;
    sex?: number;
}
export interface AccessToken {
    access: string;
    access_expire: number;
    refresh: string;
    refresh_expire: number;
    is_local_time: boolean;
}
export interface RegisterBean {
    id: number;
    openid: string;
}
export interface FeedbackItemBean {
    id: number;
    content: string;
    created_at: string;
    status: number;
    recover_at: string;
    is_prop: number;
}
export interface PayParams {
    pay_type?: string;
    goods_tag: string;
    trade_no: string;
    currency?: string;
    openid?: string;
    notify_url?: string;
    transmit_args?: string;
    indulge_auth?: number;
    age?: number;
    callback_from?: number;
    is_debug?: number;
    env?: number;
    use_h5?: boolean;
    ext?: Record<string, any>;
    game_info?: Record<string, any>;
    user_real_price?: number;
    user_real_currency?: string;
}
export interface OrderData {
    price?: number;
    goods_tag?: string;
    goods_name?: string;
    order_no?: string;
    trade_no?: string;
    hq_type?: string;
    notify_url?: string;
    transmit_args?: string;
    ext?: Record<string, any>;
}
export interface UserInfoParams {
    nickname?: string;
    avatarUrl?: string;
    region?: string;
    sex?: string;
}
export interface RXResult<T = object> {
    code: number;
    msg?: string;
    name?: string;
    message: string;
    thirdcode?: any;
    thirdmsg?: string;
    data?: T;
}
export interface RXResultT<T = void> extends RXResult<T> {
}
export type RXCallback<T> = (err: RXError, data?: T) => void;
export type NativeCallback = (type: string, status: string, data: string) => void;
export type RCallback<T = object> = (data: RXResult<T>) => void;
export enum SDKEventType {
    OnPlayerSwitchAccount = 0,
    OnShown = 1,
    OnActive = 2,
    OnInactive = 3,
    OnHidden = 4,
    OnResumed = 5,
    OnPaused = 6,
    OnWant = 7,
    OnPlayerDataChanged = 2001,
    OnPlayerAction = 3001
}
export enum JsHandlerType {
    change_phone = "change_phone",
    binding_phone = "binding_phone",
    binding_email = "binding_email",
    change_email = "change_email",
    real_auth = "real_auth",
    deregister = "deregister",
    underegister = "underegister",
    reset_password = "reset_password",
    close_webview = "close_webview",
    callback = "callback",
    refresh_token = "refresh_token",
    logBackIn = "logBackIn"
}
export interface IWindowLifecycle {
    onShown(data?: any);
    onActive(data?: any);
    onInactive(data?: any);
    onHidden(data?: any);
    onResumed(data?: any);
    onPaused(data?: any);
}
export interface JsObject {
    type: JsHandlerType;
    code: number;
    data?: object;
    ext?: object;
    update_data?: boolean;
}
export interface WebViewConfig {
    url: string;
    title?: string;
    naviBarVisible?: boolean;
    closeVisible?: boolean;
    backVisible?: boolean;
    webParams?: Record<string, string>;
}
export interface AnnouncementImage {
    image_url: string;
    link_url?: string;
}
export interface Announcement {
    id: number;
    type: number;
    timezone: number;
    start: string;
    end: string;
    content_type: number;
    is_popup: number;
    title: string;
    content?: string;
    images?: AnnouncementImage[];
}
export interface AnnouncementConfig {
    limit?: number;
    data?: Announcement[];
}
export interface PromoCode {
    refresh_period: number;
    promo_name: string;
    gift_name: string;
    promo_valid_start: string;
    promo_valid_end: string;
    promo_code: string;
    refresh_period_exp: number;
    polling: number;
}
export interface UserCenterConfig {
    config_prams?: UserCenterArgs;
    custom_params?: HelperCenterArgs;
}
export interface UserCenterArgs {
    btns?: string[];
}
export interface HelperCenterArgs {
    transmit_args?: string;
    game_user_id: string;
    nickname?: string;
    head_img_url?: string;
    queue_name?: string;
    is_fast_auth?: boolean;
}
export interface PrivacyKeyArgs {
    key_list: string[];
    key: string;
}
export interface IBaseDialog<T = object> {
    show(callback?: RCallback<T>): void;
    close(): void;
}
export interface UIApi {
    showCaptchaVerifyUI(uiContext: UIContext, appid: string, callback?: RCallback): Promise<IBaseDialog<object>>;
    showLoginUI(uiContext: UIContext, config: RXLoginConfig, callback?: RCallback<LoginData>): Promise<IBaseDialog<LoginData> | void>;
    showAccountListUI(uiContext: UIContext, config?: RXLoginConfig, callback?: RCallback<Account>): IBaseDialog<Account>;
    showPrivacyUI(uiContext: UIContext, config: PrivacyKeyArgs, callback?: RCallback): IBaseDialog;
    showForgotPasswordUI(uiContext: UIContext, callback?: RCallback): IBaseDialog;
    applyForDeregisterUI(uiContext: UIContext, config?: HelperCenterArgs, callback?: RCallback): IBaseDialog;
    showDestroyAccountStatusView(uiContext: UIContext, okButtonText: string, callback?: RCallback): IBaseDialog;
    showUserCenterUI(uiContext: UIContext, config: UserCenterConfig, callback?: RCallback): Promise<IBaseDialog>;
    showHelperCenterUI(uiContext: UIContext, config: HelperCenterArgs, callback?: RCallback, url?: string): IBaseDialog;
    showChatServicesUI(uiContext: UIContext, config?: Record<string, string>, callback?: RCallback, url?: string): IBaseDialog;
    showRealNameUI(uiContext: UIContext, callback?: RCallback<RealNameResult>, rewards?: Reward[], closeAble?: boolean): IBaseDialog<RealNameResult>;
    showChangePasswordUI(uiContext: UIContext, callback?: RCallback): IBaseDialog;
    showWebView(uiContext: UIContext, config: WebViewConfig, callback?: RCallback, newView?: boolean): IBaseDialog;
    showAnnouncementUI(uiContext: UIContext, config?: AnnouncementConfig, callback?: RCallback<string>): Promise<IBaseDialog<string>>;
    showMailUI(uiContext: UIContext, userId?: string, callback?: RCallback): Promise<IBaseDialog<object>>;
    showFeedbackUI(uiContext: UIContext, config?: string[]): Promise<IBaseDialog<object>>;
    showFeedbackListUI(uiContext: UIContext): Promise<IBaseDialog<object>>;
    showUserPrivacyPolicyUI(uiContext: UIContext, content: string, title: string, callback?: RCallback): IBaseDialog;
}
export interface IPassport {
    updateToken(data: AccessToken);
    updateData(data?: LoginData);
    sendCaptcha<T>(params: SendCaptchaParams, callback?: RCallback<T>): Promise<RXResult<T>>;
    verifyCaptcha<T>(type: CaptchaType | string, target: string, purpose: Purpose | string, captcha_code: string, callback?: RCallback<T>);
    register<T>(username: string, password: string, captchaCode: string, ext: object, callback?: RCallback<T>);
    resetPassword<T>(username: string, password: string, captcha_code: string, migrate_args: object, callback?: RCallback<T>);
    searchHasAccounts<T>(method: string, devicecode: string, states: number, callback?: RCallback<T>);
    login(params: LoginParams, callback?: RCallback<LoginData>): Promise<RXResult<LoginData>>;
    syncInfo<T>(params: Record<string, any>, callback?: RCallback<T>): Promise<RXResult<T>>;
    bindAccount<T>(params: Record<string, any>, callback?: RCallback<T>): Promise<RXResult<T>>;
    association<T extends object>(params: {
        code: string;
        scopes: string[];
    }, callback?: RCallback<T>): Promise<T>;
    changePassword<T>(old_password: string, new_password: string, callback?: RCallback<T>);
    realAuth(realname: string, idcard: string, isFastAuth?: boolean, callback?: RCallback<RealNameResult>): Promise<RXResult<RealNameResult>>;
    getIifaaRedirectURL(appName?: string, thirdPartSchema?: string, callback?: RCallback<IifaaRedirectURLResp>): Promise<RXResult<IifaaRedirectURLResp>>;
    validateIifaa(callback?: RCallback<IifaaValidateResp>): Promise<RXResult<IifaaValidateResp>>;
    validateIifaaWithSource(source?: string, callback?: RCallback<IifaaValidateResp>): Promise<RXResult<IifaaValidateResp>>;
    validateIifaaWithRetry(retryCount?: number, intervalMs?: number): Promise<RXResult<IifaaValidateResp>>;
    validateIifaaWithSourceRetry(source?: string, retryCount?: number, intervalMs?: number): Promise<RXResult<IifaaValidateResp>>;
    getUserInfo<T>(callback?: RCallback<T>);
    updateUserInfo<T>(params: UserInfoParams, callback?: RCallback<T>);
    bindPhone<T>(phone: string, password: string, captcha_code: string, migrate_args: object, callback?: RCallback<T>);
    changePhone<T>(newphone: string, newphone_captcha: string, oldphone_captcha: string, migrate_args: object, callback?: RCallback<T>);
    unBindPhone<T>(phone: string, captcha_code: string, callback?: RCallback<T>);
    bindEmail<T>(email: string, password: string, captcha_code: string, migrate_args: object, callback?: RCallback<T>);
    unBindEmail<T>(email: string, captcha_code: string, callback?: RCallback<T>);
    deregister<T>(idcard: string, realname: string, cpdata: string, callback?: RCallback<T>);
    deregisterCancel<T>(callback?: RCallback<T>);
    searchBindingAccounts<T>(callback?: RCallback<T>);
    getPromoDisplayKEY(callback: RCallback<PromoCode>, autoRefresh?: boolean);
    exchangePromoCDKEY(cdKey: string, callback: RCallback<string>);
}
export interface IHadoop {
    track(event: string, distinct_id: string, properties: Object): boolean;
    trackData(event: string, properties: Object, distinct_id?: string): boolean;
}
export interface IFeedback {
    feedbackCreate(content: string, attachments: string[], phone: string, tags: string[]);
    getFeedbackList(page: number, size: number, status: number, callback?: RCallback);
    getFeedbackDetail(id: number, callback: RCallback);
    feedbackGetprop(id: number, callback: RCallback);
}
export interface IOperation {
    getAnnouncement(limit?: number, callback?: RCallback<Announcement[]>);
    getEmailList(userId?, callback?: RCallback);
    deleteEmail(param: {
        cp_user_id?: string;
        type: number;
        rx_mail_id?: number;
    }, callback?: RCallback);
    getEmailDetail(mailId: number, userId?: string, callback?: RCallback);
    getEmailAward(param: {
        cp_user_id?: string;
        type: number;
        rx_mail_id?: number;
    }, callback?: RCallback);
    getOperationScene(callback?: RCallback);
}
export enum SharePlatforms {
    WECHAT = "wechat",
    HW_KNOCK = "hw_knock",
    SYSTEM = "system"
}
export type SharePlatform = `${SharePlatforms}`;
export enum ShareScenes {
    Friend = 1,
    FriendCircle = 2
}
export type ShareScene = -1 | 1 | 2;
export interface ShareParams {
    wx_appid?: string;
    platform: SharePlatform;
    share_scene: ShareScene;
    material_type: ShareMediaType;
    title?: string;
    content?: string;
    image?: string | ArrayBuffer;
    url?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    wh?: number;
    package_name?: string;
    class_name?: string;
    force_user_system_chooser?: boolean;
    border_size?: number;
    mini_type?: number;
    username?: string;
    path?: string;
}
export interface ShareFuncParams {
    func: string;
    region?: string;
    platform: SharePlatform;
    transmits?: string;
    protocol_android?: string;
    protocol_ios?: string;
    use_scheme?: string;
    custom_ext?: Record<string, any>;
}
export interface ShortLinkParams {
    url: string;
    title?: string;
    content?: string;
    image?: string;
    ext?: Record<string, any>;
}
export interface SchedulingReportParams extends ShareFuncParams {
    scheduling_event: boolean;
    scheduling_type: string;
    properties: Record<string, any>;
}
export interface IShare {
    getShareData(params: ShareFuncParams, callback?: RCallback): Promise<RXResult<object>>;
    share(context: Context, params: ShareFuncParams | ShareParams, callback?: RCallback): Promise<RXResult<object>>;
    shareCustom(context: Context, params: ShareParams, callback?: RCallback): Promise<RXResult<object>>;
    shareSchedulingReport(params: SchedulingReportParams, callback?: RCallback): Promise<RXResult<object>>;
    getShortUrl(params: ShortLinkParams, callback?: RCallback): Promise<RXResult<object>>;
    onKnockShare(callback: Callback<harmonyShare.SharableTarget>);
    offKnockShare();
    isSupportKnockShare();
}
export interface UpdateGameAreaParams {
    area_id?: string;
    area_name?: string;
    area_status?: string;
    area_type?: string;
    extension?: Record<string, any>;
}
export interface CreateGameAreaParams extends Omit<UpdateGameAreaParams, 'area_id'> {
    area_id: string;
}
export interface CreateGameCharacterParams {
    area_id?: string;
    character_name?: string;
    character_level?: string;
    character_faction?: string;
    character_profession?: string;
    character_status?: string;
    character_type?: string;
    character_vip_level?: string;
    cp_user_id?: string;
    extension?: Record<string, any>;
}
export interface UpdateGameCharacterParams extends CreateGameCharacterParams {
    character_id: string;
}
export interface DeleteGameCharacterParams {
    area_id: string;
    character_id: string;
    cp_user_id: string;
}
export interface IGameAreaApi {
    searchGameAccount(callback: RCallback);
    searchGameAreaInfo(areaId: string | null, callback: RCallback);
    searchGameAreaListInfo(callback: RCallback);
    updateGameAreaInfo(params: UpdateGameAreaParams, callback: RCallback);
    createGameArea(params: CreateGameAreaParams, callback: RCallback);
    deleteGameArea(areaId: string, callback: RCallback);
    createGameCharacter(params: CreateGameCharacterParams, callback: RCallback);
    updateGameCharacterInfo(params: UpdateGameCharacterParams, callback: RCallback);
    deleteGameCharacter(params: DeleteGameCharacterParams, callback: RCallback);
    searchGameCharacterListInfo(cpUserId: string, callback: RCallback);
    searchGameCharacterListInArea(cpUserId: string, areaId: string, callback: RCallback);
    searchGameCharacterInfo(cpUserId: string, areaId: string, characterId: string, callback: RCallback);
}
export interface IRXApi {
    distinctId: () => string;
    deviceCode: () => string;
    subChannelId: () => string;
    domain: () => string;
    feedback: () => IFeedback;
    social: () => ISocial;
    loginData: () => LoginData | undefined;
    passport: () => IPassport;
    hadoop: () => IHadoop;
    gameArea: () => IGameAreaApi;
    operation(): IOperation;
    init(conf: RXConfig, uiContext: UIContext): Promise<RXResult<object>>;
    onWindowStageCreate(windowStage: window.WindowStage): void;
    onCreate(context: common.UIAbilityContext, want: Want, _launchParam: AbilityConstant.LaunchParam);
    onNewWant(context: common.UIAbilityContext, want: Want, _launchParam: AbilityConstant.LaunchParam);
    registerSdkEvent<T = object>(type: SDKEventType, data: (event: T) => void);
    unregisterSdkEvent<T = object>(type: SDKEventType, handler: (event: T) => void);
    initialize(conf: RXConfig, uiContext: UIContext): Promise<RXResult<object>>;
    pay(params: PayParams, callback?: RCallback): Promise<RXResult<object>>;
    queryPurchases(): Promise<RXResult<object>>;
    login(params: LoginParams, callback?: RCallback<LoginData>): Promise<RXResult<LoginData>>;
    syncInfo(params: LoginParams, callback?: RCallback): Promise<RXResult>;
    bindAccount(params: BindAccountParams, callback?: RCallback): Promise<RXResult>;
    unbindPlayer(): Promise<string>;
    logout(): Promise<RXResult>;
    setLogoRes(value: any);
    unionLogin(params: RXLoginConfig, uiContext: UIContext, callback?: RCallback<LoginData>): Promise<RXResult<LoginData>>;
    dataTrack(event: string, properties: Record<string, any>, distinct_id?: string): boolean;
    uploadFile(filePath: string, objectKey: string, callback?: RCallback): Promise<RXResult<object>>;
}
export { RXError };
