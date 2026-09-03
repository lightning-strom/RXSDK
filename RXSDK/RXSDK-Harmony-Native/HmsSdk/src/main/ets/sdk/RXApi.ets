import {
  RXConfig,
  IBaseDialog,
  IFeedback,
  IHadoop,
  IPassport,
  IRXApi,
  LoginData,
  LoginParams,
  PayParams,
  RealNameResult,
  RXCallback,
  RXLoginConfig,
  RXResult,
  SDKEventType,
  RCallback,
  UIApi,
  WebViewConfig,
  HelperCenterArgs,
  UserCenterConfig,
  IOperation,
  AnnouncementConfig,
  RXErrorCode,
  Account,
  IGameAreaApi,
  IShare,
  PrivacyKeyArgs,
  Any,
  Reward,
  SendCaptchaParams,
  BindAccountParams
} from '../types/Index'
import { UIContext } from '@ohos.arkui.UIContext';
import RXApiImpl from '../api/RXApiImpl';
import UIApiImpl from '../pages/UIApiImpl';
import { Logger } from '../utils/Logger';
import Devices from '../utils/Devices';

import SDKInfo from './SDKInfo';
import { AbilityConstant, common, Want } from '@kit.AbilityKit';
import app from '../utils/App';
import ShareProvider from '../share/ShareProvider';

import { WXApi } from '../wx/WXApi';
import { window } from '@kit.ArkUI';
import UserActionTracer from '../base/UserActionTracer';
import { RXUtil } from './RXIndex';
import { Singleton } from '../types/Types';
import Update from '../api/Update';
import SDKConfig from './SDKConfig';
import Passport from '../base/Passport';
import Ranking, { IRanking } from '../api/Ranking';
import { ISocial } from '../api/ISocial';
import Legal from '../api/Legal';
import { IPush, PushManager } from '../base/PushManager';
import ServiceChat from '../api/ServiceChat';
import { OpenInstall } from '../plug/OpenInstall';
import { WXSdkWrapper } from '../wx/WXSdkWrapper';

export interface TrackData {
  event_name: string;
  properties: Record<string, object>;
  distinct_id?: string;
}


export class RXApi extends Singleton<RXApi> implements IRXApi, UIApi {
  _instanceId: string;
  static instanceCount: number = 0;

  constructor() {
    super();
    this._instanceId = `RXApi_${Date.now()}_${RXApi.instanceCount}`;
    console.log("RXApi constructor " + this._instanceId)
  }


  get version(): string {
    return SDKInfo.VERSION
  }

  get appName(): string {
    return app.name
  }

  get rxapi(): IRXApi {
    return RXApiImpl
  }

  get rxui(): UIApi {
    return UIApiImpl
  }

  push(): IPush {
    return PushManager.getInstance()
  }

  operation(): IOperation {
    return this.rxapi.operation()
  }

  gameArea(): IGameAreaApi {
    return this.rxapi.gameArea()
  }

  wechat() {
    return WXSdkWrapper.getInstance()
  }

  rank(): IRanking {
    return Ranking
  }

  share(): IShare {
    return ShareProvider
  }

  onCreate(context: common.UIAbilityContext, want: Want, _launchParam: AbilityConstant.LaunchParam): void {
    Logger.d("onCreate" + JSON.stringify(want))
    app.handleWant(want)
    Passport.handleIifaaCallbackUri(want?.uri)
    this.handleWeChatCallIfNeed(want)
    OpenInstall.getInstance().preInit(context)

    // 开发者完成参数键值对赋值
    // let params: Record<string, hiAppEvent.ParamType> = {
    //   "test_data": 100,
    // };
    // // 开发者可以设置崩溃事件的自定义参数
    // hiAppEvent.setEventParam(params, hiAppEvent.domain.OS, hiAppEvent.event.APP_CRASH).then(() => {
    //   hilog.info(0x0000, 'testTag', `HiAppEvent success to set svent param`);
    // }).catch((err: BusinessError) => {
    //   hilog.error(0x0000, 'testTag', `HiAppEvent code: ${err.code}, message: ${err.message}`);
    // });
    this.rxapi.onCreate(context, want, _launchParam)
  }

  onNewWant(context: common.UIAbilityContext, want: Want, _launchParam: AbilityConstant.LaunchParam): void {
    Logger.d("onNewWant" + JSON.stringify(want))
    app.handleWant(want)
    Passport.handleIifaaCallbackUri(want?.uri)
    this.handleWeChatCallIfNeed(want)
    this.rxapi.onNewWant(context, want, _launchParam)
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    this.rxapi.onWindowStageCreate(windowStage)
  }


  private handleWeChatCallIfNeed(want: Want) {
    WXApi.getInstance().handleWant(want)
  }

  async sendCaptcha(uiContext: UIContext, params: SendCaptchaParams, callback?: RCallback): Promise<RXResult> {
    try {
      params.type ??= params.phone ? 'phone' : 'email'
      params.target ??= params.phone || params.email
      let ret = await this.rxapi.passport().sendCaptcha<object>(params)
      if (ret.code == RXErrorCode.CAPTCHA_VERIFY) {
        ret = await new Promise<RXResult>((resolve, reject) => {
          if (ret?.data) {
            this.showCaptchaVerifyUI(uiContext, ret?.data["captcha_app_id"], async (resp) => {
              if (resp?.code == 0) {
                params.tencent_captcha = resp as object as Record<string, object>
                let r = await this.rxapi.passport().sendCaptcha<object>(params)
                resolve(r as RXResult)
              } else {
                resolve(resp as RXResult)
              }
            })
          } else {
            resolve(ret)
          }
        })
      }
      callback?.(ret)
      return ret;
    } catch (e) {
      Logger.e(e)
      callback?.(RXUtil.formatResult(e))
      return e
    }

  }

  showUserPrivacyPolicyUI(uiContext: UIContext, content: string, title: string, callback?: RCallback): IBaseDialog {
    return this.rxui.showUserPrivacyPolicyUI(uiContext, content, title, callback)
  }

  showCaptchaVerifyUI(uiContext: UIContext, appid: string, callback?: RCallback): Promise<IBaseDialog<object>> {
    return this.rxui.showCaptchaVerifyUI(uiContext, appid, callback)
  }

  showFeedbackUI(uiContext: UIContext, config?: string[]): Promise<IBaseDialog<object>> {
    return this.rxui.showFeedbackUI(uiContext, config)
  }

  showFeedbackListUI(uiContext: UIContext): Promise<IBaseDialog<object>> {
    return this.rxui.showFeedbackListUI(uiContext)
  }

  showMailUI(uiContext: UIContext, userId?: string, callback?: RCallback): Promise<IBaseDialog<object>> {
    return this.rxui.showMailUI(uiContext, userId, callback)
  }

  showAnnouncementUI(uiContext: UIContext, config?: AnnouncementConfig, callback?: RCallback<string>): Promise<IBaseDialog<string>> {
    return this.rxui.showAnnouncementUI(uiContext, config, callback)
  }

  showLoginUI(uiContext: UIContext, config: RXLoginConfig, callback?: RXCallback<RXResult<LoginData>>): Promise<IBaseDialog<LoginData> | void> {
    this.setLogoRes(config.logoResource)
    return this.rxui.showLoginUI(uiContext, config, callback)
  }

  showDestroyAccountStatusView(uiContext: UIContext, okButtonText: string, callback?: RCallback): IBaseDialog {
    return this.rxui.showDestroyAccountStatusView(uiContext, okButtonText, callback)
  }

  showAccountListUI(uiContext: UIContext, config?: RXLoginConfig, callback?: RXCallback<RXResult<Account>>): IBaseDialog<Account> {
    return this.rxui.showAccountListUI(uiContext, config, callback)
  }

  showPrivacyUI(uiContext: UIContext, config: PrivacyKeyArgs, callback?: RCallback<object>): IBaseDialog<object> {
    return this.rxui.showPrivacyUI(uiContext, config, callback)
  }

  showForgotPasswordUI(uiContext: UIContext, callback?: RCallback): IBaseDialog {
    return this.rxui.showForgotPasswordUI(uiContext, callback)
  }

  showUserCenterUI(uiContext: UIContext, config?: UserCenterConfig, callback?: RCallback): Promise<IBaseDialog> {
    return this.rxui.showUserCenterUI(uiContext, config, callback)
  }

  applyForDeregisterUI(uiContext: UIContext, config?: HelperCenterArgs, callback?: RCallback): IBaseDialog {
    return this.rxui.applyForDeregisterUI(uiContext, config, callback)
  }

  showRealNameUI(uiContext: UIContext, callback?: RCallback<RealNameResult>, rewards?: Reward[], closeAble?: boolean): IBaseDialog<RealNameResult> {
    return this.rxui.showRealNameUI(uiContext, callback, rewards, closeAble)
  }

  showChangePasswordUI(uiContext: UIContext, callback?: RCallback): IBaseDialog {
    return this.rxui.showChangePasswordUI(uiContext, callback)
  }

  showHelperCenterUI(uiContext: UIContext, config?: HelperCenterArgs, callback?: RCallback, url?: string): IBaseDialog {
    return this.rxui.showHelperCenterUI(uiContext, config, callback, url)
  }

  showChatServicesUI(uiContext: UIContext, config: Record<string, string>, callback?: RCallback, url?: string): IBaseDialog {
    return this.rxui.showChatServicesUI(uiContext, config, callback, url)
  }

  showWebView(uiContext: UIContext, config: WebViewConfig, callback?: RCallback, newView?: boolean): IBaseDialog {
    return this.rxui.showWebView(uiContext, config, callback, newView)
  }

  distinctId(): string {
    return this.rxapi.distinctId();
  }

  deviceCode(): string {
    return this.rxapi.deviceCode();
  }

  subChannelId(): string {
    return this.rxapi.subChannelId();
  }

  domain(): string {
    return this.rxapi.domain();
  }

  feedback(): IFeedback {
    return this.rxapi.feedback();
  }

  social(): ISocial {
    return this.rxapi.social();
  }

  loginData(): LoginData | undefined {
    return this.rxapi.loginData();
  }

  passport(): IPassport {
    return this.rxapi.passport();
  }

  hadoop(): IHadoop {
    return this.rxapi.hadoop();
  }

  async RXInit(conf: RXConfig, uiContext: UIContext): Promise<string> {
    try {
      let ret = await this.init(conf, uiContext);
      return JSON.stringify(ret)
    } catch (e) {
      e.code ??= RXErrorCode.INIT_ERROR
      e.msg ??= e.message
      return JSON.stringify(e)
    }
  }

  async RXLogin(conf: RXLoginConfig, uiContext: UIContext): Promise<string> {
    try {
      let ret = await this.rxapi.unionLogin(conf, uiContext);
      return JSON.stringify(ret)
    } catch (e) {
      e.msg ??= e.message
      return JSON.stringify(e)
    }
  }

  trackData(data: TrackData): boolean {
    return this.rxapi?.dataTrack(data.event_name, data.properties, data.distinct_id);
  }

  trackUserAction(properties: Record<string, Any>) {
    UserActionTracer.trackUserAction(properties)
  }

  stopTrackUserAction() {
    UserActionTracer.stopTrackUserAction()
  }

  setPrivacyAgree() {
    Devices.setPrivacyAgree(getContext())
  }

  async init(conf: RXConfig, uiContext?: UIContext): Promise<RXResult> {
    try {
      Logger.log("RXSDK--Version: " + SDKInfo.VERSION);
      if (!this.rxapi) {
        throw new Error('RXApi not initialized properly');
      }
      uiContext ??= globalThis?.UIContext;
      if (!uiContext) {
        Logger.e('Error:UIContext is null')
        throw new Error('Error:UIContext is null');
      }
      if (!conf) {
        Logger.e('Error:init params RXConfig is null')
        throw new Error('Error:RXConfig params is null');
      }
      if (conf.logoResource) {
        this.setLogoRes(conf.logoResource)
      }

      if (conf.privacyEnable) {
        if (!Devices.isPrivacyAgree(getContext())) {
          let ret = await new Promise<RXResult>((resolve) => {
            this.showUserPrivacyPolicyUI(uiContext!, RXUtil.getSDKPrivacy(conf), conf.privacyTitle || "用户协议和隐私政策", (e) => {
              Logger.d("showUserPrivacyPolicyUI result :" + JSON.stringify(e))
              resolve(e)
            })
          })
          if (ret.code != RXErrorCode.OK) {
            return ret as object as RXResult
          }
        }
      } else {
        this.setPrivacyAgree()
      }
      return this.rxapi.init(conf, uiContext);
    } catch (e) {
      let ret = RXUtil.formatResult<RXResult>(e, RXErrorCode.INIT_ERROR)
      Logger.e(ret)
      return ret
    }
  }


  registerSdkEvent<T = object>(type: SDKEventType, data: (event: T) => void): ((event: T) => void) | undefined {
    return this.rxapi.registerSdkEvent(type, data);
  }

  unregisterSdkEvent<T = object>(type: SDKEventType, handler: (event: T) => void): void {
    return this.rxapi.unregisterSdkEvent(type, handler);
  }

  initialize(conf: RXConfig, uiContext: UIContext): Promise<RXResult> {
    return this.rxapi.initialize(conf, uiContext);
  }

  pay(params: PayParams, callback?: RCallback): Promise<RXResult> {
    return this.rxapi.pay(params, callback);
  }

  queryPurchases(): Promise<RXResult> {
    return this.rxapi.queryPurchases();
  }

  login(params: LoginParams, callback?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>> {
    return this.rxapi.login(params, callback);
  }

  syncInfo(params: LoginParams, callback?: RCallback): Promise<RXResult> {
    return this.rxapi.syncInfo(params, callback);
  }

  bindAccount(params: BindAccountParams, callback?: RCallback<object>): Promise<RXResult<object>> {
    return this.rxapi.bindAccount(params, callback);
  }

  unbindPlayer(): Promise<string> {
    return this.rxapi.unbindPlayer();
  }

  logout(): Promise<RXResult> {
    return this.rxapi.logout();
  }

  setLogoRes(value: ResourceStr): void {
    return this.rxapi?.setLogoRes?.(value);
  }

  setGameInfo(roleId: string, regionTag: string) {
    SDKConfig.setGameInfo(roleId, regionTag);
  }


  unionLogin(params: RXLoginConfig, uiContext: UIContext, callback?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>> {
    return this.rxapi?.unionLogin(params, uiContext, callback);
  }

  dataTrack(event: string, properties: Record<string, Any>, distinct_id?: string): boolean {
    return this.rxapi?.dataTrack(event, properties, distinct_id);
  }

  uploadFile(filePath: string, objectKey?: string, callback?: RCallback): Promise<RXResult> {
    return this.rxapi.uploadFile(filePath, objectKey, callback)
  }

  updateGameVersion(body: Record<string, Any>, callback: RCallback): Promise<RXResult> {
    return Update.updateGameVersion(body, callback);
  }

  checkAppUpdate(version: string, region: string, body?: Record<string, Any>, callback?: RCallback, method?: string, type?: string, format?: string): Promise<RXResult> {
    return Update.checkAppUpdate(version, region, body, callback, method, { type, format });
  }

  legal(callback?: RCallback): Promise<RXResult> {
    return Legal.legal(callback)
  }

  legalTerms(args: Record<string, Any>, callback?: RCallback): Promise<RXResult> {
    return Legal.legalTerms(args, callback)
  }

  getServiceChatUnreadCount(callback?: RCallback): Promise<RXResult> {
    return ServiceChat.getServiceChatUnreadCount(callback)
  }

  clearServiceChatUnreadCount(callback?: RCallback): Promise<RXResult> {
    return ServiceChat.clearServiceChatUnreadCount(callback)
  }
}


// export default new RXApi()