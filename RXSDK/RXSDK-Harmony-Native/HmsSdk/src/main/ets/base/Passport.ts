import { RXRequest } from '../net/RXRequest'
import { Logger } from '../utils/Logger';
import { LoginDecorator } from './LoginDecorator';
import {
  CaptchaType,
  LoginData,
  LoginParams,
  Purpose,
  RXResult,
  AccessToken,
  UserInfoParams,
  RealNameResult,
  IPassport,
  LoginMethod,
  SDKEventType,
  RXError,
  RXErrorCode,
  PromoCode,
  RCallback,
  RewardKind,
  Reward,
  SendCaptchaParams,
  IifaaRedirectURLResp,
  IifaaValidateResp
} from '../types/Index'
import Devices from '../utils/Devices';
import { preferences } from '@kit.ArkData';
import { util } from '@kit.ArkTS';
import { gamePlayer } from '@kit.GameServiceKit';
import SDKConfig from '../sdk/SDKConfig';
import { common } from '@kit.AbilityKit';
import { CryptoUtil } from '../utils/CryptoUtil';
import { SDKHandler } from '../sdk/SDKHandler';
import Objects from '../utils/Objects';
import { PassportPath } from '../constants/PassportPath';
import CDKeyProvider from './CDKeyProvider';
import AccountManager from './AccountManager';
import UserActivate from './UserActivate';
import { RXUtil } from '../utils/RXUtil';
import EventBus from './EventBus';
import TextUtil from '../utils/TextUtil';


let STORAGE_KEY = "rx_login_data"
let LOGIN_DATA = "login_data"

interface AssociationParams {
  code: string;
  scopes: string[];
}

enum UserFlagMask {
  Anchor = 1
}

enum AttrMask {
  /**
   * 实名标识
   */
  RealName = 1 << 0,
  /**
   * 用户当前是否有绑定手机号，1 表示有绑定。
   */
  BindPhone = 1 << 1,
  BindEmail = 1 << 2,
  //        用户当前是否有已设置密码的登录凭证
  SetPassword = 1 << 3,
  /**
   * 实名标识
   */
  RealNameInRX = 1 << 4
}

enum FlagMask {
  /**
   * 1是否新用户
   */
  NewUser = 1 << 0,
  /**
   * 2是否进行防沉迷控制
   */
  ScreenTime = 1 << 1,
  /**
   * 4-游客是否绑定了三方账号(仅在游客登录返回时有效)
   */
  GuestBindThird = 1 << 2,
  /**
   * 8-已完成首次绑定手机
   */
  FirstBindPhone = 1 << 3,
  /**
   * 16-已完成首次绑定 Email
   */
  FirstBindEmail = 1 << 4,
  /**
   * 32注销申请中
   */
  Deregister = 1 << 5,
}

let preferencesObj: preferences.Preferences

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
    kind: RewardKind
    list: Reward[]
  }

  static async load(context) {
    try {
      preferencesObj = await preferences.getPreferences(context, STORAGE_KEY)
      let dat: preferences.ValueType = await preferencesObj.get(LOGIN_DATA, new Uint8Array(0))
      let textDecoder = util.TextDecoder.create('utf-8')
      let val = textDecoder.decodeToString(dat as Uint8Array);
      if (val) {
        return new PlayerData(JSON.parse(val));
      } else {
        Logger.d("logindata cache is null")
      }
    } catch (e) {
      e.msg ??= e.message
      Logger.w(e);
    }
  }

  static create(data: Partial<LoginData>) {
    if (data) {
      return new PlayerData(data)
    } else {
      preferencesObj.delete(LOGIN_DATA)
      preferencesObj.flush()
      return null
    }
  }

  constructor(data: Partial<LoginData>) {
    this.update(data)
    this.openid = data.openid || '';
    CDKeyProvider.getInstance().init(this.cp_user_id, this.isAnchor)
  }

  user_flag: number;

  flush() {
    if (preferencesObj) {
      let uInt8Array = new util.TextEncoder().encodeInto(JSON.stringify(this));
      preferencesObj.put(LOGIN_DATA, uInt8Array)
      preferencesObj.flush()
    }
  }

  update(data: Partial<LoginData>) {
    if (data.token && !data.token.is_local_time) {
      data.token.refresh_expire = data.token.refresh_expire > 0 ? (Devices.currentTimeSecond + data.token.refresh_expire) : data.token.refresh_expire;
      data.token.access_expire = data.token.access_expire > 0 ? (Devices.currentTimeSecond + data.token.access_expire) : data.token.access_expire;
      data.token.is_local_time = true
    }
    EventBus.getInstance().emit(SDKEventType.OnPlayerDataChanged, data);
    Object.assign(this, data);
    this.flush()
  }

  get nickNameDisplay(): string {
    Logger.d(this.nickname)
    return this.method == "guest" ? "游客账号" : this.nickname
  }

  get isRealName() {
    return (this.attr & AttrMask.RealName) > 0
  }

  get realAuthReward() {
    return (this.reward?.kind === RewardKind.REAL_AUTH) ? this.reward?.list : undefined
  }

  get isAnchor() {
    return (this.user_flag & UserFlagMask.Anchor) > 0;
  }

  setAttr(mask: AttrMask) {
    this.attr |= mask;
    return this
  }

  setFlag(mask: FlagMask) {
    this.attr |= mask;
  }

  unsetAttr(mask: AttrMask) {
    this.attr |= mask;
  }

  unsetFlag(mask: FlagMask) {
    this.flag &= ~mask;
  }

  bindPhone(ext: object) {
    this.setAttr(AttrMask.BindPhone)
    this.updateExt(ext)
  }

  bindEmail(ext: object) {
    this.setAttr(AttrMask.BindEmail)
    this.updateExt(ext)
  }

  setRealName(data: object) {
    if (data["age"]) {
      this.age == Number(data["age"])
      this.setAttr(AttrMask.RealName).setAttr(AttrMask.RealNameInRX)
    }
  }

  updateExt(ext: object) {
    this.ext = Object.assign({}, this.ext, ext)
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

  //注销中
  get isDeregister() {
    return (this.flag & FlagMask.Deregister) > 0;
  }

  setDeregister(isRequest: boolean) {
    if (isRequest) {
      this.flag |= FlagMask.Deregister;
    } else {
      this.flag &= ~(FlagMask.Deregister);
    }
  }

  /**
   * @return 是否过期
   */
  isRefreshExpired(nearly: number = 60) {
    let currentTime = Devices.currentTimeSecond;
    return currentTime >= this.token.refresh_expire - nearly;
  }

  //是否过期
  isExpired(nearly: number = 60) {
    let currentTime = Devices.currentTimeSecond;
    return currentTime >= this.token.access_expire - nearly;
  }
}

interface RXErrorConstructor {
  new(code: number, message?: string): RXError;

  readonly prototype: RXError;
}

class Passport implements IPassport {
  private static instance: Passport;
  private lastIifaaCallbackUri: string = ""
  private iifaaAutoValidateCallback?: RCallback<IifaaValidateResp>
  private iifaaAutoValidateSource?: string
  private iifaaResumeCompensated: boolean = false

  constructor() {
    if (!Passport.instance) {
      Passport.instance = this;
    }
    return Passport.instance;
  }


  getPromoDisplayKEY(callback: RCallback<PromoCode>, autoRefresh?: boolean | undefined): void {
    return CDKeyProvider.getInstance().getPromoDisplayKEY(callback, autoRefresh)
  }

  exchangePromoCDKEY(cdKey: string, callback: RCallback<string>): Promise<RXResult<string>> {
    return CDKeyProvider.getInstance().exchangePromoCDKEY(cdKey, callback)
  }

  private _data?: PlayerData = null

  public async initAsync(context) {
    this._data = await PlayerData.load(context)
  }

  public updateData(data?: LoginData) {
    if (this._data && this._data?.openid === data?.openid) {
      this._data.update(data)
    } else {
      this._data = PlayerData.create(data)
    }
  }

  get loginData() {
    return this._data
  }

  get token() {
    return this._data?.token
  }

  get realAuthReward() {
    return this._data?.realAuthReward
  }

  public updateToken(data: AccessToken) {
    if (data) {
      this._data?.update({ token: data })
    }
  }


  isDeRegistering(data?: LoginData): boolean {
    data ??= this.loginData
    return ((data?.flag ?? 0) & FlagMask.Deregister) > 0;
  }


  isRealName(data?: LoginData): boolean {
    data ??= this.loginData
    return ((data?.attr ?? 0) & AttrMask.RealName) > 0
  }

  isNewUser(flag?: number) {
    flag ??= this.loginData?.flag
    return ((flag ?? 0) & FlagMask.NewUser) > 0
  }

  get isLoggedIn(): boolean {
    if (this.loginData) {
      return this.loginData?.openid ? true : false
    } else {
      return false
    }
  }

  get openid(): string {
    return this.loginData?.openid
  }

  get cpUserId(): string {
    return this.loginData?.cp_user_id
  }

  get refreshToken() {
    if (this.loginData && this.loginData.token) {
      return this.loginData?.token?.refresh
    } else {
      return ""
    }
  }

  get accessToken() {
    if (this.loginData && this.loginData.token) {
      return this.loginData?.token?.access
    } else {
      return ""
    }
  }

  async checkAccessToken() {
    if (!this.isLoggedIn) {
      let msg = "error not login,please login first."
      Logger.e(msg)
      return Promise.reject(RXUtil.getRXResult(RXErrorCode.NOT_LOGIN_ERROR, msg));
    }
    try {
      if (!this._data?.isExpired()) {
        return Promise.resolve({ code: 0 });
      }
      // 尝试刷新访问令牌
      const resp = await this.refreshAccessToken();
      if (resp.code !== 0) {
        throw resp
      } else {
        return resp;
      }
    } catch (error: any) {
      error.code ??= RXErrorCode.TOKEN_ERROR
      error.msg ??= error.message
      Logger.e(error)
      // let rejectObj = {
      //   code: -1,
      //   ...error,
      //   msg: error.msg,
      //   message: error.message
      // }
      throw error
      // return Promise.reject(error);
    }
  }

  async refreshAccessToken(callback?: RCallback<AccessToken>): Promise<RXResult<AccessToken>> {
    return RXRequest.post<AccessToken>(PassportPath.REFRESH_TOKEN, {},
      { "ruixue-refreshtoken": this.refreshToken }
      , callback).then(resp => {
      if (resp.code === 0 && resp.data) {
        this.updateToken(resp.data)
      }
      return resp
    })
  }

  async searchBindingAccounts<T>(callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>()
    return RXRequest.post<T>(PassportPath.ACCOUNT_BOUND_QUERY, params, null, callback)
  }

  @LoginDecorator
  async deregisterCancel<T>(callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>()
    return RXRequest.post<T>(PassportPath.USER_DEREGISTER_CANCEL, params, null, callback).then(resp => {
      if (resp.code == 0) {
        this.loginData?.setDeregister(false)
      }
      return resp
    })
  }

  @LoginDecorator
  async deregister<T>(idcard: string, realname: string, cpdata: string, callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>([
      ["idcard", idcard],
      ["realname", realname],
      ["cpdata", cpdata]
    ])
    return RXRequest.post<T>(PassportPath.USER_DEREGISTER, params, null, callback).then(resp => {
      if (resp.code == 0) {
        this.loginData?.setDeregister(true)
      }
      return resp
    })
  }

  @LoginDecorator
  async unBindEmail<T>(email: string, captcha_code: string, callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>([
      ["email", email],
      ["captcha_code", captcha_code]
    ])
    // { email, captcha_code }
    return RXRequest.post<T>(PassportPath.UNBIND_EMAIL, params, null, callback)
  }

  @LoginDecorator
  async bindEmail<T>(email: string, password: string, captcha_code: string, migrate_args: object, callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>([
      ["email", email],
      ["password", password],
      ["captcha_code", captcha_code],
      ["migrate_args", migrate_args]
    ])

    // { email, password, captcha_code, migrate_args }
    return RXRequest.post<T>(PassportPath.BIND_EMAIL, params, null, callback)
  }

  @LoginDecorator
  async unBindPhone<T>(phone: string, captcha_code: string, callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>([
      ["phone", phone],
      ["captcha_code", captcha_code]
    ])
    // { phone, captcha_code }
    return RXRequest.post<T>(PassportPath.UNBIND_PHONE, params, null, callback)
  }

  @LoginDecorator
  async changePhone<T>(newphone: string, newphone_captcha: string, oldphone_captcha: string, migrate_args: object, callback?: RCallback<T>) {
    let params = new Map<string, Object>([
      ["newphone", newphone],
      ["newphone_captcha", newphone_captcha],
      ["oldphone_captcha", oldphone_captcha],
      ["migrate_args", migrate_args]
    ])
    // { newphone, newphone_captcha, oldphone_captcha, migrate_args }
    return RXRequest.post<T>(PassportPath.CHANGE_PHONE, params, null, callback)
  }

  @LoginDecorator
  async bindPhone<T>(phone: string, password: string, captcha_code: string, migrate_args: object, callback?: RCallback<T>) {
    let params = new Map<string, Object>([
      ["phone", phone],
      ["password", password],
      ["captcha_code", captcha_code],
      ["migrate_args", migrate_args]
    ])
    // { phone, password, captcha_code, migrate_args }
    return RXRequest.post<T>(PassportPath.BIND_PHONE, params, null, callback)
  }

  @LoginDecorator
  async updateUserInfo<T>(params: UserInfoParams, callback?: RCallback<T>): Promise<RXResult<T>> {
    return RXRequest.post<T>(PassportPath.UPDATE_USER, params, null, callback).then((resp) => {
      if (resp.code == 0) {
        let d = { ...params } as object as Partial<LoginData>
        d.avatar = params.avatarUrl || d.avatar
        delete d["avatarUrl"];
        this.loginData?.update(d)
        resp.data = Objects.assign({}, resp.data, params)
      }
      return resp
    })
  }

  @LoginDecorator
  async getUserInfo<T>(callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>([
      ["method", this.loginData.method],
      ["openid", this.loginData.openid]
    ])
    // { method: this.loginData.method, openid: this.loginData.openid }
    return RXRequest.post<T>(PassportPath.USER_INFO, params, null, callback)
  }

  @LoginDecorator
  async syncInfo<T>(params: Record<string, any>, callback?: RCallback<T>): Promise<RXResult<T>> {
    return RXRequest.post<T>(PassportPath.SYNC_APP_INFO, params, null, callback)
  }

  @LoginDecorator
  async bindAccount<T>(params: Record<string, any>, callback?: RCallback<T>): Promise<RXResult<T>> {
    return RXRequest.post<T>(PassportPath.BIND_ACCOUNT, params, null, callback)
  }

  @LoginDecorator
  async realAuth(realname: string, idcard: string, isFastAuth?: boolean, callback?: RCallback<RealNameResult>): Promise<RXResult<RealNameResult>> {
    let params = new Map<string, Object>([
      ["idcard", idcard],
      ["realname", realname],
      ["is_fast_auth", isFastAuth ? 1 : 0]
    ])
    // { idcard, realname }
    return await RXRequest.post(PassportPath.CERTIFICATION, params, null, callback).then(resp => {
      if (resp.code == 0 && resp.data) {
        this.loginData?.setRealName(resp.data)
      }
      return resp
    })
  }

  @LoginDecorator
  async getIifaaRedirectURL(appName?: string, thirdPartSchema?: string,
    callback?: RCallback<IifaaRedirectURLResp>): Promise<RXResult<IifaaRedirectURLResp>> {
    let resolvedThirdPartSchema = this.normalizeIifaaThirdPartSchema(thirdPartSchema || SDKConfig.realAuthIifaaScheme)
    let params = new Map<string, Object>([
      ["app_name", appName || ""],
      ["scene_code", "IIFAA_CREDENTIALS_WEILEGAME_ALIPAYUSER"],
      ["third_part_schema", resolvedThirdPartSchema || ""]
    ])
    return await RXRequest.post<IifaaRedirectURLResp>(PassportPath.IIFAA_REDIRECT_URL, params, null, callback)
  }

  @LoginDecorator
  async validateIifaa(callback?: RCallback<IifaaValidateResp>): Promise<RXResult<IifaaValidateResp>> {
    return this.validateIifaaWithSource(undefined, callback)
  }

  async validateIifaaWithSource(source?: string, callback?: RCallback<IifaaValidateResp>): Promise<RXResult<IifaaValidateResp>> {
    let params = new Map<string, Object>()
    if (source) {
      params.set("source", source)
    }
    return await RXRequest.post<IifaaValidateResp>(PassportPath.IIFAA_VALIDATE, params, null, callback).then(resp => {
      if (resp.code == 0 && resp.data) {
        this.loginData?.setRealName(resp.data)
      }
      return resp
    })
  }

  async validateIifaaWithRetry(retryCount: number = 20, intervalMs: number = 1500): Promise<RXResult<IifaaValidateResp>> {
    return this.validateIifaaWithSourceRetry(undefined, retryCount, intervalMs)
  }

  async validateIifaaWithSourceRetry(source?: string, retryCount: number = 20, intervalMs: number = 1500): Promise<RXResult<IifaaValidateResp>> {
    let retriedCount = 0
    while (true) {
      let lastResp: RXResult<IifaaValidateResp> = await this.validateIifaaWithSource(source)
      if (lastResp.code !== 310039) {
        return lastResp
      }
      if (retriedCount >= retryCount) {
        return lastResp
      }
      retriedCount++
      await this.delay(intervalMs)
    }
  }

  private normalizeIifaaThirdPartSchema(thirdPartSchema?: string): string {
    let schema = thirdPartSchema ? thirdPartSchema.trim() : ""
    if (schema && !schema.includes("://")) {
      return schema + "://"
    }
    return schema
  }

  setIifaaAutoValidateCallback(callback?: RCallback<IifaaValidateResp>) {
    this.setIifaaAutoValidateCallbackWithSource(undefined, callback)
  }

  setIifaaAutoValidateCallbackWithSource(source?: string, callback?: RCallback<IifaaValidateResp>) {
    this.iifaaAutoValidateSource = source
    this.iifaaAutoValidateCallback = callback
    this.iifaaResumeCompensated = false
  }

  clearIifaaAutoValidateCallback() {
    this.iifaaAutoValidateSource = undefined
    this.iifaaAutoValidateCallback = undefined
    this.iifaaResumeCompensated = false
  }

  async tryCompensateIifaaAutoValidateOnResume() {
    if (!this.iifaaAutoValidateCallback || this.iifaaResumeCompensated) {
      return
    }
    this.iifaaResumeCompensated = true
    Logger.i("IIFAA resume compensation validate start")
    try {
      let resp = await this.validateIifaaWithSourceRetry(this.iifaaAutoValidateSource, 1)
      if (resp.code == 0 || resp.code == RXErrorCode.ALREADY_REAL_NAME) {
        Logger.i("IIFAA resume compensation validate success: " + JSON.stringify(resp))
      } else {
        Logger.e("IIFAA resume compensation validate failed: " + JSON.stringify(resp))
      }
      this.iifaaAutoValidateCallback?.(resp)
    } catch (e) {
      Logger.e("IIFAA resume compensation validate error: " + JSON.stringify(e))
      this.iifaaAutoValidateCallback?.({
        code: RXErrorCode.THIRD_REAL_NAME_ERROR,
        message: JSON.stringify(e)
      } as RXResult<IifaaValidateResp>)
    }
  }

  async handleIifaaCallbackUri(uri?: string) {
    if (!uri || !this.iifaaAutoValidateCallback || !this.isIifaaCallbackUri(uri)) {
      return
    }
    if (uri == this.lastIifaaCallbackUri) {
      return
    }
    this.lastIifaaCallbackUri = uri
    Logger.i("IIFAA callback detected, auto validate uri=" + uri)
    try {
      let resp = await this.validateIifaaWithSourceRetry(this.iifaaAutoValidateSource, 3)
      this.iifaaAutoValidateCallback?.(resp)
    } catch (e) {
      Logger.e("IIFAA auto validate error: " + JSON.stringify(e))
      this.iifaaAutoValidateCallback?.({
        code: RXErrorCode.THIRD_REAL_NAME_ERROR,
        message: JSON.stringify(e)
      } as RXResult<IifaaValidateResp>)
    }
  }

  private isIifaaCallbackUri(uri: string): boolean {
    let configuredScheme = SDKConfig.realAuthIifaaScheme
    if (!configuredScheme) {
      return false
    }
    let scheme = this.getUriScheme(uri)
    let targetScheme = this.getUriScheme(configuredScheme) || configuredScheme
    if (!scheme || scheme.toLowerCase() !== targetScheme.toLowerCase()) {
      return false
    }
    let lowerUri = uri.toLowerCase()
    return lowerUri.includes("bizid=") ||
      lowerUri.includes("backfromalipay") ||
      lowerUri.includes("iifaa") ||
      lowerUri.includes("realauth") ||
      lowerUri.includes("alipay")
  }

  private getUriScheme(uri: string): string {
    let index = uri.indexOf(":")
    if (index < 0) {
      return ""
    }
    return uri.substring(0, index)
  }

  private delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }

  md5Password(password: string) {
    try {
      if (password && password.trim().length > 0) {
        return CryptoUtil.md5Sync(password)
      }
    } catch {
    }
    return password
  }

  @LoginDecorator
  async changePassword<T>(old_password: string, new_password: string, callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>([
      ["new_password", this.md5Password(new_password)],
      ["old_password", this.md5Password(old_password)],
    ])
    if (old_password) {
      params.set("by_oldpassword", {
        "old_password": this.md5Password(old_password)
      })
    }
    // { new_password, by_oldpassword: { old_password } }
    return await RXRequest.post(PassportPath.CHANGE_PWD, params, null, callback)
  }


  @LoginDecorator
  async searchHasAccounts<T>(method: string, devicecode: string, states: number, callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>([
      ["method", method],
      ["devicecode", devicecode],
      ["states", states]
    ])
    // { method, devicecode, states }
    return await RXRequest.post(PassportPath.ACCOUNT_QUERY, params, null, callback)
  }

  @LoginDecorator
  async resetPassword<T>(username: string, password: string, captcha_code: string, migrate_args: object, callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>([
      ["username", username],
      ["password", password],
      ["captcha_code", captcha_code],
      ["migrate_args", migrate_args]
    ])
    // { username, password, captcha_code, migrate_args }
    return await RXRequest.post(PassportPath.RESET_PWD, params, null, callback)
  }


  attributionData(param: Record<string, object> = {}): Record<string, any> {
    const attr: Record<string, any> = {
      distinct_id: Devices.distinctId, // 假设 Devices.distinctId 是合适的类型
      device: {}, // 默认为空对象
      activate: {}, // 默认为空对象
      user_attrs: {}, // 默认为空对象
      user_source: {}, // 默认为空对象
      migrate_args: {}, // 默认为空对象
      user_transmits: "" // 这是一个字符串，但你可以根据需求改变类型
    };

    // 使用 Object.assign 或展开运算符（...）来合并对象
    return { ...attr, ...param };
  }

  // 注册类型（1-普通账号注册，2-手机号注册,3-邮箱注册）：手机号注册必须填写验证码，邮箱注册必填验证码
  async register<T>(username: string, password: string, captcha_code: string, ext?: Record<string, any>, callback?: RCallback<T>) {
    if (password) {
      password = this.md5Password(password)
    }
    let params: Record<string, any> = {
      username,
      password,
      captcha_code,
      ...ext
    };
    params.country ?? "cn";
    params.type ??= TextUtil.isValidEmail(username) ? 3 : 2;
    return await RXRequest.post(PassportPath.REGISTER, this.attributionData(params), null, callback)
  }

  async verifyCaptcha<T>(type: CaptchaType, target: string, purpose: Purpose, captcha_code: string, callback?: RCallback<T>): Promise<RXResult<T>> {
    let params = new Map<string, Object>([
      ["purpose", purpose],
      ["captcha_code", captcha_code]
    ])
    params.set(type, target)
    // { purpose, captcha_code }
    // params[type] = targete
    return await RXRequest.post<T>(PassportPath.VERIFY_CAPTCHA, params, null, callback)
  }

  async sendCaptcha<T>(params: SendCaptchaParams, callback?: RCallback<T>): Promise<RXResult<T>> {
    const mergedParams: Record<string, any> = {
      ...params
    };

    mergedParams[params.type] = params.target;
    delete mergedParams["type"]
    delete mergedParams["target"]

    const needLogin = !('email' in mergedParams) && !('phone' in mergedParams);

    let path = needLogin ? PassportPath.SEND_CAPTCHA_AUTH : PassportPath.SEND_CAPTCHA;
    return await RXRequest.post<T>(path, mergedParams, null, callback)
  }

  getAgeRange(age: number) {
    if (age > 18) {
      return gamePlayer.ThirdUserAgeRange.AGE_RANGE_ADULT
    } else if (age > 16) {
      return gamePlayer.ThirdUserAgeRange.AGE_RANGE_18
    } else if (age > 8) {
      return gamePlayer.ThirdUserAgeRange.AGE_RANGE_16
    } else if (age > 0) {
      return gamePlayer.ThirdUserAgeRange.AGE_RANGE_8
    }
  }

  async handleGamePlayer(savePlayerRole: boolean, roleId?: string, roleName?: string) {
    try {
      let vl: gamePlayer.ThirdUserInfo = {
        thirdOpenId: this.loginData?.openid || "",
        isRealName: this._data?.isRealName || false,
        ageRange: this.getAgeRange(this._data?.age)
      }
      this._data?.age
      let ui = SDKConfig.context as common.UIAbilityContext
      await gamePlayer.verifyLocalPlayer(ui, vl)
      if (savePlayerRole) {
        let request: gamePlayer.GSKPlayerRole = {
          roleId: roleId || '0',
          roleName: roleName || 'default',
          teamPlayerId: this.loginData?.tid,
          thirdOpenId: this.loginData?.openid
        };
        await gamePlayer.savePlayerRole(ui, request)
        Logger.d("savePlayerRole finish")
      }
      Logger.d("verifyLocalPlayer finish")
    } catch (e) {
      Logger.w("verifyLocalPlayer error")
      Logger.e(e)
    }
  }

  async login(params: LoginParams, callback?: RCallback<LoginData>): Promise<RXResult<LoginData>> {
    if (params["login_method"]) {
      params.method = params["login_method"]
      delete params["login_method"]
    }

    if (!params.method) {
      params.method = this.loginData?.login_method
      params.login_openid = this.loginData?.login_openid
    }

    let url = params.login_openid ? PassportPath.LOGIN_TOKEN : PassportPath.LOGIN
    if (params?.password) {
      params.password = this.md5Password(params?.password)
    }
    if (!params.method) {
      let ret: RXResult<LoginData> = {
        code: RXErrorCode.LOGIN_ERROR,
        message: 'login method is null'
      }
      callback?.( ret)
      return ret
    }
    params = Objects.assign(await UserActivate.getAttributionData(), params)

    return RXRequest.request<LoginData>({
      path: url,
      data: params,
      method: 'POST',
      withToken: false,
    })
      .then(async resp => {
        if (resp.code === 0 && resp.data) {
          resp.data.login_method = params.method
          resp.data.login_username = params.username
          this.updateData(resp.data)
          AccountManager.updateAccount(resp.data?.openid, Objects.assign({}, params, resp.data), true)
          Devices.incrementLoginCount()
          UserActivate.onLoginSuccess()
        }
        callback?.(resp)
        return resp
      })
      .catch(e => {
        e.code ??= RXErrorCode.LOGIN_ERROR
        e.msg ??= e.message
        if (callback) {
          callback(e)
          return e
        } else {
          throw e
        }
      })
  }

  async unbindPlayer(thirdOpenId?: string, teamPlayerId?: string) {
    if (!thirdOpenId) {
      thirdOpenId = this.loginData?.openid
    }
    teamPlayerId ??= this.loginData?.tid
    return await SDKHandler.getInstance().handleUnBingPlayer({ thirdOpenId: thirdOpenId, teamPlayerId: teamPlayerId }, SDKConfig.context)
  }

  async logout(): Promise<RXResult> {
    let ret: RXResult = {
      code: 0,
      message: 'logout success'
    };
    if (this._data?.method == LoginMethod.Harmony || this._data?.method == LoginMethod.Hwjos) {
      ret = await SDKHandler.getInstance().logout(SDKConfig.context) as RXResult
    }
    if (ret?.code == 0) {
      this.updateData(null)
    }
    return ret
  }

  async association<T extends object>(params: {
    code: string,
    scopes: string[]
  }, callback?: RCallback<T>): Promise<T> {
    let url = PassportPath.HARMONY_ASSOCIATION
    return RXRequest.post<T>(url, params)
      .then(resp => {
        callback?.(resp)
        return resp
      }).catch(e => {
        callback?.(e)
        return e
      })
  }
}

export default new Passport()