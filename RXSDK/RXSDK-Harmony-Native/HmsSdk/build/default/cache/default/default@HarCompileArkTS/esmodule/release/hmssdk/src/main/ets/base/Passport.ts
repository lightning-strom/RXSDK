import { RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { LoginDecorator } from "@normalized:N&&&hmssdk/src/main/ets/base/LoginDecorator&4.0.0";
import { LoginMethod, SDKEventType, RXErrorCode, RewardKind } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { CaptchaType, LoginData, LoginParams, Purpose, RXResult, AccessToken, UserInfoParams, RealNameResult, IPassport, RXError, PromoCode, RCallback, Reward, SendCaptchaParams, IifaaRedirectURLResp, IifaaValidateResp } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import preferences from "@ohos:data.preferences";
import util from "@ohos:util";
import gamePlayer from "@hms:core.gameservice.gameplayer";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import type common from "@ohos:app.ability.common";
import { CryptoUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/CryptoUtil&4.0.0";
import { SDKHandler } from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKHandler&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import { PassportPath } from "@normalized:N&&&hmssdk/src/main/ets/constants/PassportPath&4.0.0";
import CDKeyProvider from "@normalized:N&&&hmssdk/src/main/ets/base/CDKeyProvider&4.0.0";
import AccountManager from "@normalized:N&&&hmssdk/src/main/ets/base/AccountManager&4.0.0";
import UserActivate from "@normalized:N&&&hmssdk/src/main/ets/base/UserActivate&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
import EventBus from "@normalized:N&&&hmssdk/src/main/ets/base/EventBus&4.0.0";
import TextUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/TextUtil&4.0.0";
let STORAGE_KEY = "rx_login_data";
let LOGIN_DATA = "login_data";
interface AssociationParams {
    code: string;
    scopes: string[];
}
enum UserFlagMask {
    Anchor = 1
}
enum AttrMask {
    RealName = 1,
    BindPhone = 2,
    BindEmail = 4,
    SetPassword = 8,
    RealNameInRX = 16
}
enum FlagMask {
    NewUser = 1,
    ScreenTime = 2,
    GuestBindThird = 4,
    FirstBindPhone = 8,
    FirstBindEmail = 16,
    Deregister = 32
}
let preferencesObj: preferences.Preferences;
export class PlayerData implements LoginData {
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
    static async load(g23) {
        try {
            preferencesObj = await preferences.getPreferences(g23, STORAGE_KEY);
            let i23: preferences.ValueType = await preferencesObj.get(LOGIN_DATA, new Uint8Array(0));
            let j23 = util.TextDecoder.create('utf-8');
            let k23 = j23.decodeToString(i23 as Uint8Array);
            if (k23) {
                return new PlayerData(JSON.parse(k23));
            }
            else {
                Logger.d("logindata cache is null");
            }
        }
        catch (h23) {
            h23.msg ??= h23.message;
            Logger.w(h23);
        }
    }
    static create(f23: Partial<LoginData>) {
        if (f23) {
            return new PlayerData(f23);
        }
        else {
            preferencesObj.delete(LOGIN_DATA);
            preferencesObj.flush();
            return null;
        }
    }
    constructor(e23: Partial<LoginData>) {
        this.update(e23);
        this.openid = e23.openid || '';
        CDKeyProvider.getInstance().init(this.cp_user_id, this.isAnchor);
    }
    user_flag: number;
    flush() {
        if (preferencesObj) {
            let d23 = new util.TextEncoder().encodeInto(JSON.stringify(this));
            preferencesObj.put(LOGIN_DATA, d23);
            preferencesObj.flush();
        }
    }
    update(c23: Partial<LoginData>) {
        if (c23.token && !c23.token.is_local_time) {
            c23.token.refresh_expire = c23.token.refresh_expire > 0 ? (Devices.currentTimeSecond + c23.token.refresh_expire) : c23.token.refresh_expire;
            c23.token.access_expire = c23.token.access_expire > 0 ? (Devices.currentTimeSecond + c23.token.access_expire) : c23.token.access_expire;
            c23.token.is_local_time = true;
        }
        EventBus.getInstance().emit(SDKEventType.OnPlayerDataChanged, c23);
        Object.assign(this, c23);
        this.flush();
    }
    get nickNameDisplay(): string {
        Logger.d(this.nickname);
        return this.method == "guest" ? "游客账号" : this.nickname;
    }
    get isRealName() {
        return (this.attr & AttrMask.RealName) > 0;
    }
    get realAuthReward() {
        return (this.reward?.kind === RewardKind.REAL_AUTH) ? this.reward?.list : undefined;
    }
    get isAnchor() {
        return (this.user_flag & UserFlagMask.Anchor) > 0;
    }
    setAttr(b23: AttrMask) {
        this.attr |= b23;
        return this;
    }
    setFlag(a23: FlagMask) {
        this.attr |= a23;
    }
    unsetAttr(z22: AttrMask) {
        this.attr |= z22;
    }
    unsetFlag(y22: FlagMask) {
        this.flag &= ~y22;
    }
    bindPhone(x22: object) {
        this.setAttr(AttrMask.BindPhone);
        this.updateExt(x22);
    }
    bindEmail(w22: object) {
        this.setAttr(AttrMask.BindEmail);
        this.updateExt(w22);
    }
    setRealName(v22: object) {
        if (v22["age"]) {
            this.age == Number(v22["age"]);
            this.setAttr(AttrMask.RealName).setAttr(AttrMask.RealNameInRX);
        }
    }
    updateExt(u22: object) {
        this.ext = Object.assign({}, this.ext, u22);
    }
    get isBindPhone() {
        return (this.attr & AttrMask.BindPhone) > 0;
    }
    get isBindEmail() {
        return (this.attr & AttrMask.BindEmail) > 0;
    }
    get isPasswordSet() {
        return this.password_set;
    }
    get isNewUser() {
        return (this.flag & FlagMask.NewUser) > 0;
    }
    get isScreenTimeLimit() {
        return (this.flag & FlagMask.ScreenTime) > 0;
    }
    get hasRealNameInfo() {
        return (this.ext && this.ext["realname"] && this.ext["idcard"]);
    }
    get isGuestBindOtherAccount() {
        return (this.flag & FlagMask.GuestBindThird) > 0;
    }
    get isFinishFirstBindMobile() {
        return (this.flag & FlagMask.FirstBindPhone) > 0;
    }
    get isFinishFirstBindMail() {
        return (this.flag & FlagMask.FirstBindEmail) > 0;
    }
    get isDeregister() {
        return (this.flag & FlagMask.Deregister) > 0;
    }
    setDeregister(t22: boolean) {
        if (t22) {
            this.flag |= FlagMask.Deregister;
        }
        else {
            this.flag &= ~(FlagMask.Deregister);
        }
    }
    isRefreshExpired(r22: number = 60) {
        let s22 = Devices.currentTimeSecond;
        return s22 >= this.token.refresh_expire - r22;
    }
    isExpired(p22: number = 60) {
        let q22 = Devices.currentTimeSecond;
        return q22 >= this.token.access_expire - p22;
    }
}
interface RXErrorConstructor {
    new (code: number, message?: string): RXError;
    readonly prototype: RXError;
}
class Passport implements IPassport {
    private static instance: Passport;
    private lastIifaaCallbackUri: string = "";
    private iifaaAutoValidateCallback?: RCallback<IifaaValidateResp>;
    private iifaaAutoValidateSource?: string;
    private iifaaResumeCompensated: boolean = false;
    constructor() {
        if (!Passport.instance) {
            Passport.instance = this;
        }
        return Passport.instance;
    }
    getPromoDisplayKEY(n22: RCallback<PromoCode>, o22?: boolean | undefined): void {
        return CDKeyProvider.getInstance().getPromoDisplayKEY(n22, o22);
    }
    exchangePromoCDKEY(l22: string, m22: RCallback<string>): Promise<RXResult<string>> {
        return CDKeyProvider.getInstance().exchangePromoCDKEY(l22, m22);
    }
    private _data?: PlayerData = null;
    public async initAsync(k22) {
        this._data = await PlayerData.load(k22);
    }
    public updateData(j22?: LoginData) {
        if (this._data && this._data?.openid === j22?.openid) {
            this._data.update(j22);
        }
        else {
            this._data = PlayerData.create(j22);
        }
    }
    get loginData() {
        return this._data;
    }
    get token() {
        return this._data?.token;
    }
    get realAuthReward() {
        return this._data?.realAuthReward;
    }
    public updateToken(i22: AccessToken) {
        if (i22) {
            this._data?.update({ token: i22 });
        }
    }
    isDeRegistering(h22?: LoginData): boolean {
        h22 ??= this.loginData;
        return ((h22?.flag ?? 0) & FlagMask.Deregister) > 0;
    }
    isRealName(g22?: LoginData): boolean {
        g22 ??= this.loginData;
        return ((g22?.attr ?? 0) & AttrMask.RealName) > 0;
    }
    isNewUser(f22?: number) {
        f22 ??= this.loginData?.flag;
        return ((f22 ?? 0) & FlagMask.NewUser) > 0;
    }
    get isLoggedIn(): boolean {
        if (this.loginData) {
            return this.loginData?.openid ? true : false;
        }
        else {
            return false;
        }
    }
    get openid(): string {
        return this.loginData?.openid;
    }
    get cpUserId(): string {
        return this.loginData?.cp_user_id;
    }
    get refreshToken() {
        if (this.loginData && this.loginData.token) {
            return this.loginData?.token?.refresh;
        }
        else {
            return "";
        }
    }
    get accessToken() {
        if (this.loginData && this.loginData.token) {
            return this.loginData?.token?.access;
        }
        else {
            return "";
        }
    }
    async checkAccessToken() {
        if (!this.isLoggedIn) {
            let e22 = "error not login,please login first.";
            Logger.e(e22);
            return Promise.reject(RXUtil.getRXResult(RXErrorCode.NOT_LOGIN_ERROR, e22));
        }
        try {
            if (!this._data?.isExpired()) {
                return Promise.resolve({ code: 0 });
            }
            const d22 = await this.refreshAccessToken();
            if (d22.code !== 0) {
                throw d22;
            }
            else {
                return d22;
            }
        }
        catch (c22: any) {
            c22.code ??= RXErrorCode.TOKEN_ERROR;
            c22.msg ??= c22.message;
            Logger.e(c22);
            throw c22;
        }
    }
    async refreshAccessToken(a22?: RCallback<AccessToken>): Promise<RXResult<AccessToken>> {
        return RXRequest.post<AccessToken>(PassportPath.REFRESH_TOKEN, {}, { "ruixue-refreshtoken": this.refreshToken }, a22).then(b22 => {
            if (b22.code === 0 && b22.data) {
                this.updateToken(b22.data);
            }
            return b22;
        });
    }
    async searchBindingAccounts<x21>(y21?: RCallback<x21>): Promise<RXResult<x21>> {
        let z21 = new Map<string, Object>();
        return RXRequest.post<x21>(PassportPath.ACCOUNT_BOUND_QUERY, z21, null, y21);
    }
    @LoginDecorator
    async deregisterCancel<t21>(u21?: RCallback<t21>): Promise<RXResult<t21>> {
        let v21 = new Map<string, Object>();
        return RXRequest.post<t21>(PassportPath.USER_DEREGISTER_CANCEL, v21, null, u21).then(w21 => {
            if (w21.code == 0) {
                this.loginData?.setDeregister(false);
            }
            return w21;
        });
    }
    @LoginDecorator
    async deregister<m21>(n21: string, o21: string, p21: string, q21?: RCallback<m21>): Promise<RXResult<m21>> {
        let r21 = new Map<string, Object>([
            ["idcard", n21],
            ["realname", o21],
            ["cpdata", p21]
        ]);
        return RXRequest.post<m21>(PassportPath.USER_DEREGISTER, r21, null, q21).then(s21 => {
            if (s21.code == 0) {
                this.loginData?.setDeregister(true);
            }
            return s21;
        });
    }
    @LoginDecorator
    async unBindEmail<h21>(i21: string, j21: string, k21?: RCallback<h21>): Promise<RXResult<h21>> {
        let l21 = new Map<string, Object>([
            ["email", i21],
            ["captcha_code", j21]
        ]);
        return RXRequest.post<h21>(PassportPath.UNBIND_EMAIL, l21, null, k21);
    }
    @LoginDecorator
    async bindEmail<a21>(b21: string, c21: string, d21: string, e21: object, f21?: RCallback<a21>): Promise<RXResult<a21>> {
        let g21 = new Map<string, Object>([
            ["email", b21],
            ["password", c21],
            ["captcha_code", d21],
            ["migrate_args", e21]
        ]);
        return RXRequest.post<a21>(PassportPath.BIND_EMAIL, g21, null, f21);
    }
    @LoginDecorator
    async unBindPhone<v20>(w20: string, x20: string, y20?: RCallback<v20>): Promise<RXResult<v20>> {
        let z20 = new Map<string, Object>([
            ["phone", w20],
            ["captcha_code", x20]
        ]);
        return RXRequest.post<v20>(PassportPath.UNBIND_PHONE, z20, null, y20);
    }
    @LoginDecorator
    async changePhone<o20>(p20: string, q20: string, r20: string, s20: object, t20?: RCallback<o20>) {
        let u20 = new Map<string, Object>([
            ["newphone", p20],
            ["newphone_captcha", q20],
            ["oldphone_captcha", r20],
            ["migrate_args", s20]
        ]);
        return RXRequest.post<o20>(PassportPath.CHANGE_PHONE, u20, null, t20);
    }
    @LoginDecorator
    async bindPhone<h20>(i20: string, j20: string, k20: string, l20: object, m20?: RCallback<h20>) {
        let n20 = new Map<string, Object>([
            ["phone", i20],
            ["password", j20],
            ["captcha_code", k20],
            ["migrate_args", l20]
        ]);
        return RXRequest.post<h20>(PassportPath.BIND_PHONE, n20, null, m20);
    }
    @LoginDecorator
    async updateUserInfo<c20>(d20: UserInfoParams, e20?: RCallback<c20>): Promise<RXResult<c20>> {
        return RXRequest.post<c20>(PassportPath.UPDATE_USER, d20, null, e20).then((f20) => {
            if (f20.code == 0) {
                let g20 = { ...d20 } as object as Partial<LoginData>;
                g20.avatar = d20.avatarUrl || g20.avatar;
                delete g20["avatarUrl"];
                this.loginData?.update(g20);
                f20.data = Objects.assign({}, f20.data, d20);
            }
            return f20;
        });
    }
    @LoginDecorator
    async getUserInfo<z19>(a20?: RCallback<z19>): Promise<RXResult<z19>> {
        let b20 = new Map<string, Object>([
            ["method", this.loginData.method],
            ["openid", this.loginData.openid]
        ]);
        return RXRequest.post<z19>(PassportPath.USER_INFO, b20, null, a20);
    }
    @LoginDecorator
    async syncInfo<w19>(x19: Record<string, any>, y19?: RCallback<w19>): Promise<RXResult<w19>> {
        return RXRequest.post<w19>(PassportPath.SYNC_APP_INFO, x19, null, y19);
    }
    @LoginDecorator
    async bindAccount<t19>(u19: Record<string, any>, v19?: RCallback<t19>): Promise<RXResult<t19>> {
        return RXRequest.post<t19>(PassportPath.BIND_ACCOUNT, u19, null, v19);
    }
    @LoginDecorator
    async realAuth(n19: string, o19: string, p19?: boolean, q19?: RCallback<RealNameResult>): Promise<RXResult<RealNameResult>> {
        let r19 = new Map<string, Object>([
            ["idcard", o19],
            ["realname", n19],
            ["is_fast_auth", p19 ? 1 : 0]
        ]);
        return await RXRequest.post(PassportPath.CERTIFICATION, r19, null, q19).then(s19 => {
            if (s19.code == 0 && s19.data) {
                this.loginData?.setRealName(s19.data);
            }
            return s19;
        });
    }
    @LoginDecorator
    async getIifaaRedirectURL(i19?: string, j19?: string, k19?: RCallback<IifaaRedirectURLResp>): Promise<RXResult<IifaaRedirectURLResp>> {
        let l19 = this.normalizeIifaaThirdPartSchema(j19 || SDKConfig.realAuthIifaaScheme);
        let m19 = new Map<string, Object>([
            ["app_name", i19 || ""],
            ["scene_code", "IIFAA_CREDENTIALS_WEILEGAME_ALIPAYUSER"],
            ["third_part_schema", l19 || ""]
        ]);
        return await RXRequest.post<IifaaRedirectURLResp>(PassportPath.IIFAA_REDIRECT_URL, m19, null, k19);
    }
    @LoginDecorator
    async validateIifaa(h19?: RCallback<IifaaValidateResp>): Promise<RXResult<IifaaValidateResp>> {
        return this.validateIifaaWithSource(undefined, h19);
    }
    async validateIifaaWithSource(d19?: string, e19?: RCallback<IifaaValidateResp>): Promise<RXResult<IifaaValidateResp>> {
        let f19 = new Map<string, Object>();
        if (d19) {
            f19.set("source", d19);
        }
        return await RXRequest.post<IifaaValidateResp>(PassportPath.IIFAA_VALIDATE, f19, null, e19).then(g19 => {
            if (g19.code == 0 && g19.data) {
                this.loginData?.setRealName(g19.data);
            }
            return g19;
        });
    }
    async validateIifaaWithRetry(b19: number = 20, c19: number = 1500): Promise<RXResult<IifaaValidateResp>> {
        return this.validateIifaaWithSourceRetry(undefined, b19, c19);
    }
    async validateIifaaWithSourceRetry(w18?: string, x18: number = 20, y18: number = 1500): Promise<RXResult<IifaaValidateResp>> {
        let z18 = 0;
        while (true) {
            let a19: RXResult<IifaaValidateResp> = await this.validateIifaaWithSource(w18);
            if (a19.code !== 310039) {
                return a19;
            }
            if (z18 >= x18) {
                return a19;
            }
            z18++;
            await this.delay(y18);
        }
    }
    private normalizeIifaaThirdPartSchema(u18?: string): string {
        let v18 = u18 ? u18.trim() : "";
        if (v18 && !v18.includes("://")) {
            return v18 + "://";
        }
        return v18;
    }
    setIifaaAutoValidateCallback(t18?: RCallback<IifaaValidateResp>) {
        this.setIifaaAutoValidateCallbackWithSource(undefined, t18);
    }
    setIifaaAutoValidateCallbackWithSource(r18?: string, s18?: RCallback<IifaaValidateResp>) {
        this.iifaaAutoValidateSource = r18;
        this.iifaaAutoValidateCallback = s18;
        this.iifaaResumeCompensated = false;
    }
    clearIifaaAutoValidateCallback() {
        this.iifaaAutoValidateSource = undefined;
        this.iifaaAutoValidateCallback = undefined;
        this.iifaaResumeCompensated = false;
    }
    async tryCompensateIifaaAutoValidateOnResume() {
        if (!this.iifaaAutoValidateCallback || this.iifaaResumeCompensated) {
            return;
        }
        this.iifaaResumeCompensated = true;
        Logger.i("IIFAA resume compensation validate start");
        try {
            let q18 = await this.validateIifaaWithSourceRetry(this.iifaaAutoValidateSource, 1);
            if (q18.code == 0 || q18.code == RXErrorCode.ALREADY_REAL_NAME) {
                Logger.i("IIFAA resume compensation validate success: " + JSON.stringify(q18));
            }
            else {
                Logger.e("IIFAA resume compensation validate failed: " + JSON.stringify(q18));
            }
            this.iifaaAutoValidateCallback?.(q18);
        }
        catch (p18) {
            Logger.e("IIFAA resume compensation validate error: " + JSON.stringify(p18));
            this.iifaaAutoValidateCallback?.({
                code: RXErrorCode.THIRD_REAL_NAME_ERROR,
                message: JSON.stringify(p18)
            } as RXResult<IifaaValidateResp>);
        }
    }
    async handleIifaaCallbackUri(m18?: string) {
        if (!m18 || !this.iifaaAutoValidateCallback || !this.isIifaaCallbackUri(m18)) {
            return;
        }
        if (m18 == this.lastIifaaCallbackUri) {
            return;
        }
        this.lastIifaaCallbackUri = m18;
        Logger.i("IIFAA callback detected, auto validate uri=" + m18);
        try {
            let o18 = await this.validateIifaaWithSourceRetry(this.iifaaAutoValidateSource, 3);
            this.iifaaAutoValidateCallback?.(o18);
        }
        catch (n18) {
            Logger.e("IIFAA auto validate error: " + JSON.stringify(n18));
            this.iifaaAutoValidateCallback?.({
                code: RXErrorCode.THIRD_REAL_NAME_ERROR,
                message: JSON.stringify(n18)
            } as RXResult<IifaaValidateResp>);
        }
    }
    private isIifaaCallbackUri(h18: string): boolean {
        let i18 = SDKConfig.realAuthIifaaScheme;
        if (!i18) {
            return false;
        }
        let j18 = this.getUriScheme(h18);
        let k18 = this.getUriScheme(i18) || i18;
        if (!j18 || j18.toLowerCase() !== k18.toLowerCase()) {
            return false;
        }
        let l18 = h18.toLowerCase();
        return l18.includes("bizid=") ||
            l18.includes("backfromalipay") ||
            l18.includes("iifaa") ||
            l18.includes("realauth") ||
            l18.includes("alipay");
    }
    private getUriScheme(f18: string): string {
        let g18 = f18.indexOf(":");
        if (g18 < 0) {
            return "";
        }
        return f18.substring(0, g18);
    }
    private delay(d18: number): Promise<void> {
        return new Promise<void>((e18) => {
            setTimeout(() => {
                e18();
            }, d18);
        });
    }
    md5Password(c18: string) {
        try {
            if (c18 && c18.trim().length > 0) {
                return CryptoUtil.md5Sync(c18);
            }
        }
        catch {
        }
        return c18;
    }
    @LoginDecorator
    async changePassword<x17>(y17: string, z17: string, a18?: RCallback<x17>): Promise<RXResult<x17>> {
        let b18 = new Map<string, Object>([
            ["new_password", this.md5Password(z17)],
            ["old_password", this.md5Password(y17)],
        ]);
        if (y17) {
            b18.set("by_oldpassword", {
                "old_password": this.md5Password(y17)
            });
        }
        return await RXRequest.post(PassportPath.CHANGE_PWD, b18, null, a18);
    }
    @LoginDecorator
    async searchHasAccounts<r17>(s17: string, t17: string, u17: number, v17?: RCallback<r17>): Promise<RXResult<r17>> {
        let w17 = new Map<string, Object>([
            ["method", s17],
            ["devicecode", t17],
            ["states", u17]
        ]);
        return await RXRequest.post(PassportPath.ACCOUNT_QUERY, w17, null, v17);
    }
    @LoginDecorator
    async resetPassword<k17>(l17: string, m17: string, n17: string, o17: object, p17?: RCallback<k17>): Promise<RXResult<k17>> {
        let q17 = new Map<string, Object>([
            ["username", l17],
            ["password", m17],
            ["captcha_code", n17],
            ["migrate_args", o17]
        ]);
        return await RXRequest.post(PassportPath.RESET_PWD, q17, null, p17);
    }
    attributionData(i17: Record<string, object> = {}): Record<string, any> {
        const j17: Record<string, any> = {
            distinct_id: Devices.distinctId,
            device: {},
            activate: {},
            user_attrs: {},
            user_source: {},
            migrate_args: {},
            user_transmits: ""
        };
        return { ...j17, ...i17 };
    }
    async register<b17>(c17: string, d17: string, e17: string, f17?: Record<string, any>, g17?: RCallback<b17>) {
        if (d17) {
            d17 = this.md5Password(d17);
        }
        let h17: Record<string, any> = {
            username: c17,
            password: d17,
            captcha_code: e17,
            ...f17
        };
        h17.country ?? "cn";
        h17.type ??= TextUtil.isValidEmail(c17) ? 3 : 2;
        return await RXRequest.post(PassportPath.REGISTER, this.attributionData(h17), null, g17);
    }
    async verifyCaptcha<u16>(v16: CaptchaType, w16: string, x16: Purpose, y16: string, z16?: RCallback<u16>): Promise<RXResult<u16>> {
        let a17 = new Map<string, Object>([
            ["purpose", x16],
            ["captcha_code", y16]
        ]);
        a17.set(v16, w16);
        return await RXRequest.post<u16>(PassportPath.VERIFY_CAPTCHA, a17, null, z16);
    }
    async sendCaptcha<o16>(p16: SendCaptchaParams, q16?: RCallback<o16>): Promise<RXResult<o16>> {
        const r16: Record<string, any> = {
            ...p16
        };
        r16[p16.type] = p16.target;
        delete r16["type"];
        delete r16["target"];
        const s16 = !('email' in r16) && !('phone' in r16);
        let t16 = s16 ? PassportPath.SEND_CAPTCHA_AUTH : PassportPath.SEND_CAPTCHA;
        return await RXRequest.post<o16>(t16, r16, null, q16);
    }
    getAgeRange(n16: number) {
        if (n16 > 18) {
            return gamePlayer.ThirdUserAgeRange.AGE_RANGE_ADULT;
        }
        else if (n16 > 16) {
            return gamePlayer.ThirdUserAgeRange.AGE_RANGE_18;
        }
        else if (n16 > 8) {
            return gamePlayer.ThirdUserAgeRange.AGE_RANGE_16;
        }
        else if (n16 > 0) {
            return gamePlayer.ThirdUserAgeRange.AGE_RANGE_8;
        }
    }
    async handleGamePlayer(g16: boolean, h16?: string, i16?: string) {
        try {
            let k16: gamePlayer.ThirdUserInfo = {
                thirdOpenId: this.loginData?.openid || "",
                isRealName: this._data?.isRealName || false,
                ageRange: this.getAgeRange(this._data?.age)
            };
            this._data?.age;
            let l16 = SDKConfig.context as common.UIAbilityContext;
            await gamePlayer.verifyLocalPlayer(l16, k16);
            if (g16) {
                let m16: gamePlayer.GSKPlayerRole = {
                    roleId: h16 || '0',
                    roleName: i16 || 'default',
                    teamPlayerId: this.loginData?.tid,
                    thirdOpenId: this.loginData?.openid
                };
                await gamePlayer.savePlayerRole(l16, m16);
                Logger.d("savePlayerRole finish");
            }
            Logger.d("verifyLocalPlayer finish");
        }
        catch (j16) {
            Logger.w("verifyLocalPlayer error");
            Logger.e(j16);
        }
    }
    async login(a16: LoginParams, b16?: RCallback<LoginData>): Promise<RXResult<LoginData>> {
        if (a16["login_method"]) {
            a16.method = a16["login_method"];
            delete a16["login_method"];
        }
        if (!a16.method) {
            a16.method = this.loginData?.login_method;
            a16.login_openid = this.loginData?.login_openid;
        }
        let c16 = a16.login_openid ? PassportPath.LOGIN_TOKEN : PassportPath.LOGIN;
        if (a16?.password) {
            a16.password = this.md5Password(a16?.password);
        }
        if (!a16.method) {
            let f16: RXResult<LoginData> = {
                code: RXErrorCode.LOGIN_ERROR,
                message: 'login method is null'
            };
            b16?.(f16);
            return f16;
        }
        a16 = Objects.assign(await UserActivate.getAttributionData(), a16);
        return RXRequest.request<LoginData>({
            path: c16,
            data: a16,
            method: 'POST',
            withToken: false,
        })
            .then(async (e16) => {
            if (e16.code === 0 && e16.data) {
                e16.data.login_method = a16.method;
                e16.data.login_username = a16.username;
                this.updateData(e16.data);
                AccountManager.updateAccount(e16.data?.openid, Objects.assign({}, a16, e16.data), true);
                Devices.incrementLoginCount();
                UserActivate.onLoginSuccess();
            }
            b16?.(e16);
            return e16;
        })
            .catch(d16 => {
            d16.code ??= RXErrorCode.LOGIN_ERROR;
            d16.msg ??= d16.message;
            if (b16) {
                b16(d16);
                return d16;
            }
            else {
                throw d16;
            }
        });
    }
    async unbindPlayer(y15?: string, z15?: string) {
        if (!y15) {
            y15 = this.loginData?.openid;
        }
        z15 ??= this.loginData?.tid;
        return await SDKHandler.getInstance().handleUnBingPlayer({ thirdOpenId: y15, teamPlayerId: z15 }, SDKConfig.context);
    }
    async logout(): Promise<RXResult> {
        let x15: RXResult = {
            code: 0,
            message: 'logout success'
        };
        if (this._data?.method == LoginMethod.Harmony || this._data?.method == LoginMethod.Hwjos) {
            x15 = await SDKHandler.getInstance().logout(SDKConfig.context) as RXResult;
        }
        if (x15?.code == 0) {
            this.updateData(null);
        }
        return x15;
    }
    async association<r15 extends object>(s15: {
        code: string;
        scopes: string[];
    }, t15?: RCallback<r15>): Promise<r15> {
        let u15 = PassportPath.HARMONY_ASSOCIATION;
        return RXRequest.post<r15>(u15, s15)
            .then(w15 => {
            t15?.(w15);
            return w15;
        }).catch(v15 => {
            t15?.(v15);
            return v15;
        });
    }
}
export default new Passport();
