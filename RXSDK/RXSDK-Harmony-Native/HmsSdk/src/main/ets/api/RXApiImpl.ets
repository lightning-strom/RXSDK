import {
  RXConfig,
  RXResult,
  LoginParams,
  IRXApi,
  RXCallback,
  IFeedback,
  LoginData,
  RXLoginConfig,
  LoginMethod,
  IPassport,
  IHadoop,
  SDKEventType,
  RXError,
  PayParams,
  RXErrorCode,
  IOperation,
  IGameAreaApi,
  RCallback,
  BindAccountParams,
} from '../types/Index'
import Hadoop from '../base/Hadoop'
import Passport from '../base/Passport'
import SDKConfig from '../sdk/SDKConfig'
import Devices from '../utils/Devices'
import { Logger } from '../utils/Logger'
import { AbilityConstant, common, Want } from '@kit.AbilityKit'
import { SDKHandler } from '../sdk/SDKHandler'
import { gamePlayer } from '@kit.GameServiceKit'
import { authentication } from '@kit.AccountKit'
import Objects from '../utils/Objects'
import { uiObserver, window } from '@kit.ArkUI'
import UIApiImpl from '../pages/UIApiImpl'
import Operation from './Operation'
import Feedback from './Feedback'
import AccountManager from '../base/AccountManager'
import Oss from '../oss/Oss'
import GameArea from './GameArea'
import SDKInfo from '../sdk/SDKInfo'
import LoginProvider from '../base/LoginProvider'
import billingProvider from '../base/BillingProvider'
import HmsPay from '../base/HmsPay'
import EventBus from '../base/EventBus'
import { RXUtil } from '../sdk/RXIndex'
import { Singleton } from '../types/Types'
import { ISocial } from './ISocial'
import Social from './Social'
import { OpenInstall } from '../plug/OpenInstall'
import app from '../utils/App'
import UserActivate from '../base/UserActivate'

interface RXUnionLoginResult extends RXResult<LoginData>, gamePlayer.UnionLoginResult {}


class RXApiImpl extends Singleton<RXApiImpl> implements IRXApi {
  distinctId(): string {
    return Devices.distinctId
  }

  deviceCode(): string {
    return Devices.deviceCode
  }

  subChannelId(): string {
    return SDKConfig.subChannelId
  }

  domain(): string {
    return SDKConfig.domain
  }

  feedback(): IFeedback {
    return Feedback;
  }

  social(): ISocial {
    return Social
  }

  loginData(): LoginData | undefined {
    return Passport.loginData
  }

  passport(): IPassport {
    return Passport
  }

  hadoop(): IHadoop {
    return Hadoop
  }

  operation(): IOperation {
    return Operation
  }

  gameArea(): IGameAreaApi {
    return GameArea
  }

  aboutToAppear(): void {

  }

  aboutToDisappear(): void {

  }

  async init(conf: RXConfig, uiContext: UIContext): Promise<RXResult<object>> {
    let context = uiContext.getHostContext() as common.UIAbilityContext
    try {
      if (!uiContext) {
        Logger.e('Error:UIContext is null')
        throw new Error('Error:UIContext is null');
      }
      conf.debugEnable ??= SDKInfo.DEBUG
      Logger.debug(`InitArgs: ${JSON.stringify(conf)}`)
      this.onWindowStageCreate(context.windowStage)

      HmsPay.init()
      let config = SDKConfig.setConfig(conf, context, uiContext, SDKInfo.VERSION)
      await Devices.initAsync(context)
      let ret = await config.initAsync()

      if (ret.code == 0 && ret.data) {
        let cfg = ret.data;

        // if (cfg?.oi && cfg.oi.appid) {
        let act: Record<string, ESObject> = {}
        try {
          OpenInstall.getInstance().init(context, "")
          act["source_ad"] = {}
          let instData: ESObject = await OpenInstall.getInstance().getInstall()
          if (instData) {
            act["source_ad"]["openinstall"] = { "channelCode": instData?.channelCode, "data": instData?.bindData }
          }
          let wuData: ESObject = await OpenInstall.getInstance().getWakeUp(app.want)
          if (wuData) {
            act["source_ad"]["openinstall"] = { "channelCode": wuData?.channelCode, "data": wuData?.bindData }
          }
        } catch (e1) {
          Logger.e("openinstall :", e1)
        }
        // }
        UserActivate.init(context, act)
      }
      await AccountManager.initAsync(context)
      await Passport.initAsync(context)
      Hadoop.init(context)
      this.registerRouterPageUpdate(uiContext)
      return ret;
    } catch (e) {
      e.code ??= RXErrorCode.INIT_ERROR
      e.msg ??= e.message
      Logger.e(e)
      throw e as Error
    }
  }

  private onRouterPageUpdate: (info: uiObserver.RouterPageInfo) => void = (info: uiObserver.RouterPageInfo) => {
    if (info.state == uiObserver.RouterPageState.ON_PAGE_SHOW) {
      this.onPageShow(info.pageId, info.path)
    } else if (info.state == uiObserver.RouterPageState.ON_PAGE_HIDE) {
      this.onPageHide(info.pageId, info.path)
    }
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    try {
      windowStage.on('windowStageEvent', (data) => {
        let stageEventType: window.WindowStageEventType = data;
        Logger.d(`windowStage ${stageEventType}`);
        EventBus.getInstance().emit(stageEventType)
        if (stageEventType == window.WindowStageEventType.ACTIVE ||
          stageEventType == window.WindowStageEventType.RESUMED) {
          Passport.tryCompensateIifaaAutoValidateOnResume()
        }
      });
    } catch (exception) {
      Logger.e(`Failed to enable the listener for window stage event changes. Cause: ${JSON.stringify(exception)}`);
    }
  }

  private registerRouterPageUpdate(uiContext: UIContext) {
    let uiObs = uiContext.getUIObserver()
    uiObs.off('routerPageUpdate', this.onRouterPageUpdate)
    uiObs.on('routerPageUpdate', this.onRouterPageUpdate);
  }

  public registerSdkEvent<T = object>(type: SDKEventType, data: (event: T) => void) {
    EventBus.getInstance().registerEvent(type, data)
  }

  unregisterSdkEvent<T = object>(type: SDKEventType, handler: (event: T) => void): void {
    return EventBus.getInstance().unregisterEvent(type, handler)
  }

  async initialize(conf: RXConfig, uiContext: UIContext): Promise<RXResult<object>> {
    return this.init(conf, uiContext)
  }

  onCreate(context: common.UIAbilityContext, want: Want, _launchParam: AbilityConstant.LaunchParam): void {
  }

  onNewWant(context: common.UIAbilityContext, want: Want, _launchParam: AbilityConstant.LaunchParam): void {
    Logger.info('rxsdk onNewWant Get message data successfully: %{public}s', JSON.stringify(want.parameters));
    // if (tuanjie) {
    //   tuanjie.TuanjieSendMessage("RuiXueSdk", "OnWant", JSON.stringify(want.parameters));
    // }
    EventBus.getInstance().dispatchEvent(SDKEventType.OnWant, _launchParam)

  }

  onPageShow(pageId: string, path?: string) {
    // Logger.log(`onPageShow pageId ${pageId}  path ${path}`);
  }

  onPageHide(pageId: string, path?: string) {
    // Logger.log(`onPageHide ${pageId} , ${path}`);
  }

  uploadData(data: ArrayBuffer, objectKey: string, callback?: RCallback): Promise<RXResult<object>> {
    return Oss.uploadData(data, objectKey, callback)
  }

  uploadFile(filePath: string, objectKey?: string, callback?: RCallback): Promise<RXResult<object>> {
    return Oss.uploadFile(getContext(), filePath, objectKey, callback)
  }

  pay(params: PayParams, callback?: RCallback): Promise<RXResult<object>> {
    try {
      return billingProvider.pay(params, callback)
    } catch (e) {
      return e
    }
  }

  queryPurchases(): Promise<RXResult<object>> {
    try {
      return billingProvider.queryPurchases(getContext())
    } catch (e) {
      return e
    }
  }

  unbindPlayer(thirdOpenId?: string, teamPlayerId?: string): Promise<string> {
    return Passport.unbindPlayer(thirdOpenId, teamPlayerId)
  }

  logout(): Promise<RXResult> {
    return Passport.logout()
  }

  setLogoRes(value: ResourceStr) {
    if (value && value !== "") {
      if (typeof value == 'string' && value?.startsWith('app.')) {
        value = $r(value)
      }
      AppStorage.setOrCreate('rx_logo', value);
    }
  }

  login(params: LoginParams, callback?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>> {
    return this.doLogin(params, callback)
  }

  /**
   * @throws
   */
  async unionLogin(loginParams: RXLoginConfig, uiContext: UIContext, callback?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>> {
    try {
      this.setLogoRes(loginParams.logoResource)
      if (loginParams.ext && loginParams.ext["method"] && loginParams.ext["login_openid"]) {
        let r = await this.passport().login(loginParams.ext)
        if (r.code === 0) {
          callback?.(null, r)
          return r;
        } else {
          Objects.deleteKey(loginParams.ext, "login_openid")
          Logger.w("login by login_openid failed: " + JSON.stringify(r))
        }
      }

      let info = await SDKHandler.getInstance().handleUnionLogin(loginParams, SDKConfig.context)
      Logger.d(info)
      let result: RXUnionLoginResult = RXUtil.formatResult((JSON.parse(info) as RXUnionLoginResult))
      if (result.code !== 0) {
        callback?.(null, result )
        return result;
      }
      if (result?.accountName !== "hw_account") {
        let loginResult: RXResult<LoginData> = await new Promise<RXResult<LoginData>>((resolve, reject) => {
          loginParams.fromUnionLogin = true
          UIApiImpl.showLoginUI(uiContext, loginParams, (err: RXError, result) => {
            if (err != null) {
              reject(err)
            } else {
              resolve(result as RXResult<LoginData>)
            }
          })
        })
        loginResult = RXUtil.formatResult(loginResult)
        this.queryPurchases()
        callback?.(null, loginResult)
        return loginResult;
      } else {
        let p: LoginParams = Objects.assign(loginParams.ext, { method: LoginMethod.Harmony })
        p.ext = Objects.assign(p.ext, result.data)
        if (result.needBinding && !result.boundPlayerInfo?.thirdOpenId) {
          let authInfo: authentication.AuthorizationWithHuaweiIDCredential = result?.data as authentication.AuthorizationWithHuaweiIDCredential
          let assoc: RXResult<object> = await this.passport().association<RXResult<object>>({
            code: authInfo.authorizationCode,
            scopes: authInfo.authorizedScopes
          })
          Logger.d(assoc)
          if (assoc.code == 0) {
            p.ext = Objects.assign(p.ext, assoc.data)
          } else {
            callback?.(null, assoc as RXResult<LoginData>)
            return assoc as RXResult<LoginData>;
          }
        } else if (loginParams.unbindPlayer && (result.boundPlayerInfo?.thirdOpenId || result.localPlayer?.teamPlayerId)) {
          Logger.d(`unbindPlayer thirdOpenId:${result.boundPlayerInfo?.thirdOpenId} teamPlayerId:${result.localPlayer?.teamPlayerId} `)
          gamePlayer.unbindPlayer(SDKConfig.context as common.UIAbilityContext, result.boundPlayerInfo?.thirdOpenId, result.localPlayer?.teamPlayerId)
        }
        return await this.doLogin(p).then(async resp => {
          Logger.d(`doLogin then`)
          if (result.needBinding && !result.boundPlayerInfo?.thirdOpenId && resp?.code == 0 && resp.data && !resp.data['nobind']) {
            Logger.log("bindPlayer: thirdOpenId:" + resp.data?.openid + ", teamPlayerId:" + resp.data?.tid)
            await gamePlayer.bindPlayer(SDKConfig.context as common.UIAbilityContext, resp.data?.openid, resp.data?.tid)
            Hadoop.trackData("#bind_player", { thirdOpenId: resp.data?.openid, teamPlayerId: resp.data?.tid })
          }
          if (resp?.code == 0 && resp.data) {
            resp.data.binding = result.needBinding
          }
          await Passport.handleGamePlayer(true)
          this.queryPurchases()
          if (loginParams.isDeregisterShow !== false && resp?.code == 0 && Passport.isDeRegistering(resp.data)) {
            await new Promise<RXResult>((resolve, reject) => {
              UIApiImpl.showDestroyAccountStatusView(uiContext, "继续登录", (res) => {
                if (res.code == 0) {
                  resolve(res)
                } else {
                  reject(res)
                }
              })
            })
          }
          callback?.(null, resp)
          return resp
        })
      }
    } catch (e) {
      e.code ??= RXErrorCode.LOGIN_ERROR
      e = RXUtil.formatResult(e)
      callback?.(e)
      Logger.e(e)
      Hadoop.trackData("#login_error", Objects.toObject(e))
      return e
    }
  }

  private async doLogin(params: LoginParams, callback?: RXCallback<RXResult<LoginData>>): Promise<RXResult<LoginData>> {
    let ext = await LoginProvider.doLogin(params)
    params.ext = Objects.assign(params.ext, ext)
    Logger.d(`doLogin:${JSON.stringify(params)}`)
    return await this.passport().login(params, callback)
  }

  async syncInfo(params: LoginParams, callback?: RCallback): Promise<RXResult> {
    params.method ??= this.loginData()?.method
    let ext = await LoginProvider.doLogin(params)
    params.ext = Objects.assign(params.ext, ext)
    Logger.d(`syncInfo:${JSON.stringify(params)}`)
    return await this.passport().syncInfo(params, callback)
  }

  async bindAccount(params: LoginParams | BindAccountParams, callback?: RCallback): Promise<RXResult> {
    params.method ??= this.loginData()?.method
    let ext = await LoginProvider.doLogin(params)
    params.ext = Objects.assign(params.ext, ext)
    Logger.d(`bindAccount:${JSON.stringify(params)}`)
    return await this.passport().bindAccount(params, callback)
  }

  dataTrack(event: string, properties: Record<string, object>, distinct_id?: string): boolean {
    return Hadoop.trackData(event, properties, distinct_id)
  }
}

export default RXApiImpl.getInstance() as RXApiImpl

