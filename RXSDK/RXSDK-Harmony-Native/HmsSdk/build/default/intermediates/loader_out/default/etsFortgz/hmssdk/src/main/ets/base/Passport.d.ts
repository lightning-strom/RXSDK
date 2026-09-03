import { CaptchaType, LoginData, LoginParams, Purpose, RXResult, AccessToken, UserInfoParams, RealNameResult, IPassport, PromoCode, RCallback, RewardKind, Reward, SendCaptchaParams, IifaaRedirectURLResp, IifaaValidateResp } from '../types/Index';
import gamePlayer from "@hms.core.gameservice.gameplayer";
declare enum AttrMask {
    /**
     * 实名标识
     */
    RealName = 1,
    /**
     * 用户当前是否有绑定手机号，1 表示有绑定。
     */
    BindPhone = 2,
    BindEmail = 4,
    SetPassword = 8,
    /**
     * 实名标识
     */
    RealNameInRX = 16
}
declare enum FlagMask {
    /**
     * 1是否新用户
     */
    NewUser = 1,
    /**
     * 2是否进行防沉迷控制
     */
    ScreenTime = 2,
    /**
     * 4-游客是否绑定了三方账号(仅在游客登录返回时有效)
     */
    GuestBindThird = 4,
    /**
     * 8-已完成首次绑定手机
     */
    FirstBindPhone = 8,
    /**
     * 16-已完成首次绑定 Email
     */
    FirstBindEmail = 16,
    /**
     * 32注销申请中
     */
    Deregister = 32
}
export declare class PlayerData implements LoginData {
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
    aas: number;
    age: number;
    sex: number;
    readonly openid: string;
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
    static load(g23: any): Promise<PlayerData>;
    static create(f23: Partial<LoginData>): PlayerData;
    constructor(e23: Partial<LoginData>);
    user_flag: number;
    flush(): void;
    update(c23: Partial<LoginData>): void;
    get nickNameDisplay(): string;
    get isRealName(): boolean;
    get realAuthReward(): Reward[];
    get isAnchor(): boolean;
    setAttr(b23: AttrMask): this;
    setFlag(a23: FlagMask): void;
    unsetAttr(z22: AttrMask): void;
    unsetFlag(y22: FlagMask): void;
    bindPhone(x22: object): void;
    bindEmail(w22: object): void;
    setRealName(v22: object): void;
    updateExt(u22: object): void;
    get isBindPhone(): boolean;
    get isBindEmail(): boolean;
    get isPasswordSet(): boolean;
    get isNewUser(): boolean;
    get isScreenTimeLimit(): boolean;
    get hasRealNameInfo(): any;
    get isGuestBindOtherAccount(): boolean;
    get isFinishFirstBindMobile(): boolean;
    get isFinishFirstBindMail(): boolean;
    get isDeregister(): boolean;
    setDeregister(t22: boolean): void;
    /**
     * @return 是否过期
     */
    isRefreshExpired(r22?: number): boolean;
    isExpired(p22?: number): boolean;
}
declare class Passport implements IPassport {
    private static instance;
    private lastIifaaCallbackUri;
    private iifaaAutoValidateCallback?;
    private iifaaAutoValidateSource?;
    private iifaaResumeCompensated;
    constructor();
    getPromoDisplayKEY(n22: RCallback<PromoCode>, o22?: boolean | undefined): void;
    exchangePromoCDKEY(l22: string, m22: RCallback<string>): Promise<RXResult<string>>;
    private _data?;
    initAsync(k22: any): Promise<void>;
    updateData(j22?: LoginData): void;
    get loginData(): PlayerData;
    get token(): AccessToken;
    get realAuthReward(): Reward[];
    updateToken(i22: AccessToken): void;
    isDeRegistering(h22?: LoginData): boolean;
    isRealName(g22?: LoginData): boolean;
    isNewUser(f22?: number): boolean;
    get isLoggedIn(): boolean;
    get openid(): string;
    get cpUserId(): string;
    get refreshToken(): string;
    get accessToken(): string;
    checkAccessToken(): Promise<{
        code: number;
    }>;
    refreshAccessToken(a22?: RCallback<AccessToken>): Promise<RXResult<AccessToken>>;
    searchBindingAccounts<x21>(y21?: RCallback<x21>): Promise<RXResult<x21>>;
    deregisterCancel<t21>(u21?: RCallback<t21>): Promise<RXResult<t21>>;
    deregister<m21>(n21: string, o21: string, p21: string, q21?: RCallback<m21>): Promise<RXResult<m21>>;
    unBindEmail<h21>(i21: string, j21: string, k21?: RCallback<h21>): Promise<RXResult<h21>>;
    bindEmail<a21>(b21: string, c21: string, d21: string, e21: object, f21?: RCallback<a21>): Promise<RXResult<a21>>;
    unBindPhone<v20>(w20: string, x20: string, y20?: RCallback<v20>): Promise<RXResult<v20>>;
    changePhone<o20>(p20: string, q20: string, r20: string, s20: object, t20?: RCallback<o20>): Promise<RXResult<o20>>;
    bindPhone<h20>(i20: string, j20: string, k20: string, l20: object, m20?: RCallback<h20>): Promise<RXResult<h20>>;
    updateUserInfo<c20>(d20: UserInfoParams, e20?: RCallback<c20>): Promise<RXResult<c20>>;
    getUserInfo<z19>(a20?: RCallback<z19>): Promise<RXResult<z19>>;
    syncInfo<w19>(x19: Record<string, any>, y19?: RCallback<w19>): Promise<RXResult<w19>>;
    bindAccount<t19>(u19: Record<string, any>, v19?: RCallback<t19>): Promise<RXResult<t19>>;
    realAuth(n19: string, o19: string, p19?: boolean, q19?: RCallback<RealNameResult>): Promise<RXResult<RealNameResult>>;
    getIifaaRedirectURL(i19?: string, j19?: string, k19?: RCallback<IifaaRedirectURLResp>): Promise<RXResult<IifaaRedirectURLResp>>;
    validateIifaa(h19?: RCallback<IifaaValidateResp>): Promise<RXResult<IifaaValidateResp>>;
    validateIifaaWithSource(d19?: string, e19?: RCallback<IifaaValidateResp>): Promise<RXResult<IifaaValidateResp>>;
    validateIifaaWithRetry(b19?: number, c19?: number): Promise<RXResult<IifaaValidateResp>>;
    validateIifaaWithSourceRetry(w18?: string, x18?: number, y18?: number): Promise<RXResult<IifaaValidateResp>>;
    private normalizeIifaaThirdPartSchema;
    setIifaaAutoValidateCallback(t18?: RCallback<IifaaValidateResp>): void;
    setIifaaAutoValidateCallbackWithSource(r18?: string, s18?: RCallback<IifaaValidateResp>): void;
    clearIifaaAutoValidateCallback(): void;
    tryCompensateIifaaAutoValidateOnResume(): Promise<void>;
    handleIifaaCallbackUri(m18?: string): Promise<void>;
    private isIifaaCallbackUri;
    private getUriScheme;
    private delay;
    md5Password(c18: string): string;
    changePassword<x17>(y17: string, z17: string, a18?: RCallback<x17>): Promise<RXResult<x17>>;
    searchHasAccounts<r17>(s17: string, t17: string, u17: number, v17?: RCallback<r17>): Promise<RXResult<r17>>;
    resetPassword<k17>(l17: string, m17: string, n17: string, o17: object, p17?: RCallback<k17>): Promise<RXResult<k17>>;
    attributionData(i17?: Record<string, object>): Record<string, any>;
    register<b17>(c17: string, d17: string, e17: string, f17?: Record<string, any>, g17?: RCallback<b17>): Promise<RXResult<b17>>;
    verifyCaptcha<u16>(v16: CaptchaType, w16: string, x16: Purpose, y16: string, z16?: RCallback<u16>): Promise<RXResult<u16>>;
    sendCaptcha<o16>(p16: SendCaptchaParams, q16?: RCallback<o16>): Promise<RXResult<o16>>;
    getAgeRange(n16: number): gamePlayer.ThirdUserAgeRange;
    handleGamePlayer(g16: boolean, h16?: string, i16?: string): Promise<void>;
    login(a16: LoginParams, b16?: RCallback<LoginData>): Promise<RXResult<LoginData>>;
    unbindPlayer(y15?: string, z15?: string): Promise<string>;
    logout(): Promise<RXResult>;
    association<r15 extends object>(s15: {
        code: string;
        scopes: string[];
    }, t15?: RCallback<r15>): Promise<r15>;
}
declare const _default: Passport;
export default _default;
