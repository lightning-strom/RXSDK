import { UIContext } from "@ohos.arkui.UIContext";
import window from "@ohos.window";
import { ShareMediaType } from './ShareTypes';
import AbilityConstant from "@ohos.app.ability.AbilityConstant";
import common from "@ohos.app.ability.common";
import { Context } from "@ohos.abilityAccessCtrl";
import Want from "@ohos.app.ability.Want";
import { Callback } from "@ohos.base";
import harmonyShare from "@hms.collaboration.harmonyShare";
import { RXError } from '../base/RXError';
import { ISocial } from '../api/ISocial';
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
export declare enum LoginMethod {
    Guest = "guest",
    Wechat = "wechat",
    Harmony = "harmony",
    Hwjos = "hwjos",
    UserName = "username",
    CaptchaCode = "captchacode"
}
export declare enum RegisterType {
    Normal = 1,
    Phone = 2,
    Email = 3
}
export declare enum Purpose {
    PURPOSE_KEY = "purpose",
    /**
     * 短信意图-注册
     */
    Register = "register",
    /**
     * 短信意图-绑定手机
     */
    BindPhone = "bindphone",
    /**
     * 短信意图-解绑手机
     */
    UnbindPhone = "unbindphone",
    /**
     * 短信意图-重置密码
     */
    ResetPwd = "resetpwd",
    /**
     * 验证码意图 绑定邮箱
     */
    BindEmail = "bindemail",
    /**
     * 验证码意图 解绑邮箱
     */
    UnbindEmail = "unbindemail",
    /**
     * 登录
     */
    Login = "login",
    /**
     * 设置密码
     */
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
export declare enum RXErrorCode {
    OK = 0,
    CANCEL = 1,
    NET_ERROR = 1000,
    PASSWORD_FORMAT_ERROR = 3100,
    PASSWORD_NULL_ERROR = 3101,
    INIT_PARAMS_ERROR = 2000,
    INIT_ERROR = 2001,
    THIRD_INIT_ERROR = 2002,
    LOGIN_ERROR = 3000,
    /**
     * 登录取消
     */
    LOGIN_CANCEL = 3001,
    THIRD_LOGIN_ERROR = 3002,
    NOT_LOGIN_ERROR = 3003,
    TOKEN_ERROR = 3004,
    OTHER_LOGIN = 3005,
    UNSUPPORTED_LOGIN = 3006,
    REAL_NAME_ERROR = 3301,
    THIRD_REAL_NAME_ERROR = 3302,
    /**
     * 账号注销取消
     */
    DEREGISTER_CANCEL = 3201,
    PAY_ERROR = 4000,
    /**
     * 支付取消
     */
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
    /**
     * 关闭界面
     */
    UI_CLOSE = 6010,
    /**
     * 不同意隐私协议
     */
    DISAGREE_PRIVACY = 6000,
    PERMISSION_ERROR = 6001,
    /**
     * 权限被拒绝并不再提示
     */
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
    /**
     * 客户端随机生成的 ID，在用户注册前作为这个用户的唯一标识，仅需在首次登录时传递。
     */
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
export declare enum RewardKind {
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
export declare enum SDKEventType {
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
export declare enum JsHandlerType {
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
    onShown(data?: any): any;
    onActive(data?: any): any;
    onInactive(data?: any): any;
    onHidden(data?: any): any;
    onResumed(data?: any): any;
    onPaused(data?: any): any;
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
    updateToken(data: AccessToken): any;
    updateData(data?: LoginData): any;
    /**
     * @param type    枚举 手机或邮箱
     * @param target  手机或邮箱
     * @param purpose 意图
     */
    sendCaptcha<T>(params: SendCaptchaParams, callback?: RCallback<T>): Promise<RXResult<T>>;
    /**
     * @param type         枚举 手机或邮箱
     * @param target       手机或邮箱
     * @param purpose      意图
     * @param captcha_code 验证码
     */
    verifyCaptcha<T>(type: CaptchaType | string, target: string, purpose: Purpose | string, captcha_code: string, callback?: RCallback<T>): any;
    /**
     * @param username    用户名
     * @param password    password
     * @param captchaCode 验证码
     * @param ext         "nickname" : "昵称",      // string
     *                    "avatarUrl" : "头像地址"  // string
     *                    "sex" : 0     // 0男 1女  number
     */
    register<T>(username: string, password: string, captchaCode: string, ext: object, callback?: RCallback<T>): any;
    /**
     * @param password     password
     * @param captcha_code 验证码
     * @param migrate_args id
     */
    resetPassword<T>(username: string, password: string, captcha_code: string, migrate_args: object, callback?: RCallback<T>): any;
    /**
     * @param method     登录方式
     * @param devicecode 设备码
     * @param states     账号的位标记
     */
    searchHasAccounts<T>(method: string, devicecode: string, states: number, callback?: RCallback<T>): any;
    /**
     * @param activity 上下文对象
     */
    login(params: LoginParams, callback?: RCallback<LoginData>): Promise<RXResult<LoginData>>;
    syncInfo<T>(params: Record<string, any>, callback?: RCallback<T>): Promise<RXResult<T>>;
    bindAccount<T>(params: Record<string, any>, callback?: RCallback<T>): Promise<RXResult<T>>;
    association<T extends object>(params: {
        code: string;
        scopes: string[];
    }, callback?: RCallback<T>): Promise<T>;
    changePassword<T>(old_password: string, new_password: string, callback?: RCallback<T>): any;
    realAuth(realname: string, idcard: string, isFastAuth?: boolean, callback?: RCallback<RealNameResult>): Promise<RXResult<RealNameResult>>;
    getIifaaRedirectURL(appName?: string, thirdPartSchema?: string, callback?: RCallback<IifaaRedirectURLResp>): Promise<RXResult<IifaaRedirectURLResp>>;
    validateIifaa(callback?: RCallback<IifaaValidateResp>): Promise<RXResult<IifaaValidateResp>>;
    validateIifaaWithSource(source?: string, callback?: RCallback<IifaaValidateResp>): Promise<RXResult<IifaaValidateResp>>;
    validateIifaaWithRetry(retryCount?: number, intervalMs?: number): Promise<RXResult<IifaaValidateResp>>;
    validateIifaaWithSourceRetry(source?: string, retryCount?: number, intervalMs?: number): Promise<RXResult<IifaaValidateResp>>;
    /**
     * 获取用户信息
     * @param callback 回调函数
     */
    getUserInfo<T>(callback?: RCallback<T>): any;
    updateUserInfo<T>(params: UserInfoParams, callback?: RCallback<T>): any;
    bindPhone<T>(phone: string, password: string, captcha_code: string, migrate_args: object, callback?: RCallback<T>): any;
    changePhone<T>(newphone: string, newphone_captcha: string, oldphone_captcha: string, migrate_args: object, callback?: RCallback<T>): any;
    unBindPhone<T>(phone: string, captcha_code: string, callback?: RCallback<T>): any;
    bindEmail<T>(email: string, password: string, captcha_code: string, migrate_args: object, callback?: RCallback<T>): any;
    unBindEmail<T>(email: string, captcha_code: string, callback?: RCallback<T>): any;
    deregister<T>(idcard: string, realname: string, cpdata: string, callback?: RCallback<T>): any;
    deregisterCancel<T>(callback?: RCallback<T>): any;
    searchBindingAccounts<T>(callback?: RCallback<T>): any;
    getPromoDisplayKEY(callback: RCallback<PromoCode>, autoRefresh?: boolean): any;
    exchangePromoCDKEY(cdKey: string, callback: RCallback<string>): any;
}
export interface IHadoop {
    track(event: string, distinct_id: string, properties: Object): boolean;
    trackData(event: string, properties: Object, distinct_id?: string): boolean;
}
export interface IFeedback {
    /**
     * 创建意见反馈
     * @param content 返回内容
     * @param attachments 上传附件
     * @param phone 电话号
     * @param tags 标签标识， 游戏透传
     * @param callback 回调
     */
    feedbackCreate(content: string, attachments: string[], phone: string, tags: string[]): any;
    /**
     * 获取列表
     * @param page 页数， 从1开始
     * @param size 每页大小
     * @param status 1 未处理 2已处理
     * @param callback 回调
     */
    getFeedbackList(page: number, size: number, status: number, callback?: RCallback): any;
    /**
     * 获取反馈详情
     * @param id 反馈id
     * @param callback 回调
     */
    getFeedbackDetail(id: number, callback: RCallback): any;
    /**
     * 领取道具
     * @param id 反馈id
     * @param callback 回调
     */
    feedbackGetprop(id: number, callback: RCallback): any;
}
export interface IOperation {
    /**
     * 获取公告列表
     * @param limit 获取条数
     * @param callback 回调
     */
    getAnnouncement(limit?: number, callback?: RCallback<Announcement[]>): any;
    getEmailList(userId?: any, callback?: RCallback): any;
    deleteEmail(param: {
        cp_user_id?: string;
        type: number;
        rx_mail_id?: number;
    }, callback?: RCallback): any;
    getEmailDetail(mailId: number, userId?: string, callback?: RCallback): any;
    getEmailAward(param: {
        cp_user_id?: string;
        type: number;
        rx_mail_id?: number;
    }, callback?: RCallback): any;
    getOperationScene(callback?: RCallback): any;
}
export declare enum SharePlatforms {
    WECHAT = "wechat",
    HW_KNOCK = "hw_knock",
    SYSTEM = "system"
}
export type SharePlatform = `${SharePlatforms}`;
export declare enum ShareScenes {
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
/**
 * 短链接生成参数接口
 */
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
    onKnockShare(callback: Callback<harmonyShare.SharableTarget>): any;
    offKnockShare(): any;
    isSupportKnockShare(): any;
}
/**
 * 游戏区服和角色相关 API 接口
 */
/**
 * 修改区服参数
 */
export interface UpdateGameAreaParams {
    area_id?: string;
    area_name?: string;
    area_status?: string;
    area_type?: string;
    extension?: Record<string, any>;
}
/**
 * 创建区服参数
 */
export interface CreateGameAreaParams extends Omit<UpdateGameAreaParams, 'area_id'> {
    area_id: string;
}
/**
 * 创建角色参数
 */
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
/**
 * 更新角色参数
 */
export interface UpdateGameCharacterParams extends CreateGameCharacterParams {
    character_id: string;
}
/**
 * 删除角色参数
 */
export interface DeleteGameCharacterParams {
    area_id: string;
    character_id: string;
    cp_user_id: string;
}
export interface IGameAreaApi {
    searchGameAccount(callback: RCallback): any;
    /**
     * 查询游戏区服信息
     * @param areaId 区服唯一标识符，可为 null。
     * @param callback 请求结果的回调函数。
     */
    searchGameAreaInfo(areaId: string | null, callback: RCallback): any;
    /**
     * 查询区服列表信息
     * @param callback 请求结果的回调函数。
     */
    searchGameAreaListInfo(callback: RCallback): any;
    /**
     * 修改游戏区服信息
     * @param params 修改区服所需的参数。
     * @param callback 请求结果的回调函数。
     */
    updateGameAreaInfo(params: UpdateGameAreaParams, callback: RCallback): any;
    /**
     * 创建游戏区服
     * @param params 创建区服所需的参数。
     * @param callback 请求结果的回调函数。
     */
    createGameArea(params: CreateGameAreaParams, callback: RCallback): any;
    /**
     * 删除游戏区服
     * @param areaId 区服唯一标识符。
     * @param callback 请求结果的回调函数。
     */
    deleteGameArea(areaId: string, callback: RCallback): any;
    /**
     * 创建游戏角色
     * @param params 创建角色所需的参数。
     * @param callback 请求结果的回调函数。
     */
    createGameCharacter(params: CreateGameCharacterParams, callback: RCallback): any;
    /**
     * 更新游戏角色信息
     * @param params 更新角色所需的参数。
     * @param callback 请求结果的回调函数。
     */
    updateGameCharacterInfo(params: UpdateGameCharacterParams, callback: RCallback): any;
    /**
     * 删除游戏角色
     * @param params 删除角色所需的参数。
     * @param callback 请求结果的回调函数。
     */
    deleteGameCharacter(params: DeleteGameCharacterParams, callback: RCallback): any;
    /**
     * 查询账号下角色信息列表
     * @param cpUserId CP 用户唯一标识。
     * @param callback 请求结果的回调函数。
     */
    searchGameCharacterListInfo(cpUserId: string, callback: RCallback): any;
    /**
     * 查询某区服下角色信息列表
     * @param cpUserId CP 用户唯一标识。
     * @param areaId 区服唯一标识。
     * @param callback 请求结果的回调函数。
     */
    searchGameCharacterListInArea(cpUserId: string, areaId: string, callback: RCallback): any;
    /**
     * 查询具体角色信息
     * @param cpUserId CP 用户唯一标识。
     * @param areaId 区服唯一标识。
     * @param characterId 角色唯一标识。
     * @param callback 请求结果的回调函数。
     */
    searchGameCharacterInfo(cpUserId: string, areaId: string, characterId: string, callback: RCallback): any;
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
    onCreate(context: common.UIAbilityContext, want: Want, _launchParam: AbilityConstant.LaunchParam): any;
    onNewWant(context: common.UIAbilityContext, want: Want, _launchParam: AbilityConstant.LaunchParam): any;
    registerSdkEvent<T = object>(type: SDKEventType, data: (event: T) => void): any;
    unregisterSdkEvent<T = object>(type: SDKEventType, handler: (event: T) => void): any;
    initialize(conf: RXConfig, uiContext: UIContext): Promise<RXResult<object>>;
    pay(params: PayParams, callback?: RCallback): Promise<RXResult<object>>;
    queryPurchases(): Promise<RXResult<object>>;
    login(params: LoginParams, callback?: RCallback<LoginData>): Promise<RXResult<LoginData>>;
    syncInfo(params: LoginParams, callback?: RCallback): Promise<RXResult>;
    bindAccount(params: BindAccountParams, callback?: RCallback): Promise<RXResult>;
    unbindPlayer(): Promise<string>;
    logout(): Promise<RXResult>;
    setLogoRes(value: any): any;
    unionLogin(params: RXLoginConfig, uiContext: UIContext, callback?: RCallback<LoginData>): Promise<RXResult<LoginData>>;
    dataTrack(event: string, properties: Record<string, any>, distinct_id?: string): boolean;
    uploadFile(filePath: string, objectKey: string, callback?: RCallback): Promise<RXResult<object>>;
}
export { RXError };
