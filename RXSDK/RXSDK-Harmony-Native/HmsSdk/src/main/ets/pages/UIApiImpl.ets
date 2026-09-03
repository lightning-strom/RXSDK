import ApiPath from '../constants/ApiPath'
import {
  IBaseDialog,
  LoginData,
  RealNameResult,
  RXCallback,
  RXLoginConfig,
  RXResult,
  RCallback,
  UIApi,
  WebViewConfig,
  HelperCenterArgs,
  UserCenterConfig,
  AnnouncementConfig,
  Account,
  RXErrorCode,
  PrivacyKeyArgs,
  Reward,
  LoginParams
} from '../types/Index'
import { RealNameDialog } from './RealNameDialog'
import { LoginDialog } from './LoginDialog'
import { PrivacyDialog } from './PrivacyDialog'
import { ForgotPasswordDialog } from './ForgotPasswordDialog'
import { UserCenterDialog } from './UserCenterDialog'
import { WebViewDialog } from './WebViewDialog'
import { ChangePasswordDialog } from './ChangePasswordDialog'
import { AnnouncementDialog } from './AnnouncementDialog'
import { MailListDialog } from './MailListDialog'
import { UIContext } from '@ohos.arkui.UIContext'
import { FeedbackDialog } from './FeedbackDialog'
import { FeedbackListDialog } from './FeedbackListDialog'
import { LoginAccountListDialog } from './LoginAccountListDialog'
import { LoginQuickDialog } from './LoginQuickDialog'
import AccountManager from '../base/AccountManager'
import Passport from '../base/Passport'
import { CaptchaVerifyDialog } from './CaptchaVerifyDialog'
import { Logger } from '../utils/Logger'
import { UserAgreementDialog } from './UserAgreementDialog'
import SDKConfig from '../sdk/SDKConfig'
import { Singleton } from '../types/Types'
import Objects from '../utils/Objects'
import { TipsDialog } from './TipsDialog'


class UIApiImpl extends Singleton<UIApiImpl> implements UIApi {
  showUserPrivacyPolicyUI(uiContext: UIContext, content: string, title: string, callback?: RCallback): IBaseDialog {
    return UserAgreementDialog.getInstance(uiContext)
      .setContent(content)
      .setCancelable(false)
      .setTitle(title)
      .setOnCallback(callback)
      .show()
  }

  showCaptchaVerifyUI(uiContext: UIContext, appid: string, callback?: RCallback): Promise<IBaseDialog<object>> {
    return CaptchaVerifyDialog.getInstance(uiContext).setAppid(appid).show(callback)
  }

  showAccountListUI(uiContext: UIContext, config: RXLoginConfig, callback?: RCallback<Account>): IBaseDialog<Account> {
    return LoginAccountListDialog.getInstance(uiContext).show(callback)
  }

  showFeedbackListUI(uiContext: UIContext): Promise<IBaseDialog<object>> {
    return FeedbackListDialog.getInstance(uiContext).show()
  }

  showFeedbackUI(uiContext: UIContext, config?: string[]): Promise<IBaseDialog<object>> {
    return FeedbackDialog.getInstance(uiContext).setTags(config).show()
  }

  showDestroyAccountStatusView(uiContext: UIContext, okButtonText: string, callback?: RCallback): IBaseDialog {
    return TipsDialog.getInstance(uiContext).setConfig({
      content: $r('app.string.rx_account_revoke'),
      confirmText: okButtonText || "继续登录",
      cancelText: "撤销注销",
      title: "已提交注销申请",
    }).show(async (event) => {
      let prom = uiContext.getPromptAction()
      try {
        if (event?.code == 0) {
          callback?.({ code: 0, data: { btn_type: 0 } } as RXResult)
          return
        }
        let ret = await Passport.deregisterCancel<object>()
        Logger.d("showDestroyAccountStatusView", JSON.stringify(ret))
        if (ret.code == 0) {
          prom.showToast({ message: "已成功取消注销申请！" })
          callback?.({ code: 0, data: { btn_type: 1 } } as RXResult)
        } else {
          prom.showToast(ret)
          ret.data = ret.data ?? {};
          ret.data["btn_type"] = 1
          callback?.(ret as RXResult)
        }
      } catch (e) {
        Logger.e(e)
        prom.showToast({ message: JSON.stringify(e) })
        callback?.(e as RXResult)
      }
    })
  }

  async showLoginUI(uiContext: UIContext, config: RXLoginConfig, callback?: RXCallback<RXResult<LoginData>>): Promise<IBaseDialog<LoginData> | void> {
    console.log("clicked showLoginDialog" + config)
    if (!uiContext) {
      let e = new Error('Error:UIContext is null')
      callback?.( {
        message: e.message,
        code: RXErrorCode.LOGIN_ERROR,
        name: 'LoginError'
      }  )
      Logger.e('Error:UIContext is null，must adding [SetToGlobalThis("UIContext", this.getUIContext());] to the onPageShow function in the TuanjiePlayerAbilityIndex.ets file')
      throw e;
    }
    let lp: LoginParams = config?.ext as LoginParams
    if (lp?.login_openid && lp?.method) {
      let ret = await Passport.login(lp, callback)
      if (ret.code == 0) {
        return
      } else {
        Objects.deleteKey(lp, "login_openid")
      }
    }
    if (config?.quickLoginEnable && AccountManager.getFirstAccount()) {
      return LoginQuickDialog.getInstance(uiContext).setConfig(config).setAccount(AccountManager.getFirstAccount()).show(callback)
    } else {
      return LoginDialog.getInstance(uiContext)
        .setConfig(config)
        .setLoginMethods(config.loginMethods?.length ? config.loginMethods : SDKConfig.loginMethods)
        .setAccount(Passport.loginData)
        .show(callback)
    }
  }

  async showMailUI(uiContext: UIContext, userId?: string, callback?: (data: RXResult<object>) => void): Promise<IBaseDialog<object>> {
    return MailListDialog.getInstance(uiContext)
      .setUserId(userId)
      .setOnCallback(callback)
      .show()
  }

  async showAnnouncementUI(uiContext: UIContext, config: AnnouncementConfig, callback?: (data: RXResult<string>) => void): Promise<IBaseDialog<string>> {
    return AnnouncementDialog.getInstance(uiContext)
      .setLimit(config?.limit)
      .setAnnouncementList(config?.data)
      .setOnCallback(callback)
      .show()
  }

  showPrivacyUI(uiContext: UIContext, config: PrivacyKeyArgs, callback?: RCallback): IBaseDialog {
    return PrivacyDialog.getInstance(uiContext).setKeyData(config.key_list, config.key).setOnCallback(callback).show()
  }

  showForgotPasswordUI(uiContext: UIContext, callback?: RCallback): IBaseDialog {
    return ForgotPasswordDialog.getInstance(uiContext).setOnCallback(callback).show()
  }

  async showUserCenterUI(uiContext: UIContext, config: UserCenterConfig, callback: RCallback): Promise<IBaseDialog> {
    Logger.d("showUserCenterUI with args->", config)
    return UserCenterDialog.getInstance(uiContext).setConfigParams(config).setOnCallback(callback).show()
  }

  showRealNameUI(uiContext: UIContext, callback?: RCallback<RealNameResult>, rewards?: Reward[], closeAble?: boolean): IBaseDialog<RealNameResult> {
    return RealNameDialog.getInstance(uiContext)
      .setCancelable(closeAble)
      .setProps(rewards)
      .setOnCallback(callback)
      .show()
  }

  showChangePasswordUI(uiContext: UIContext, callback?: RCallback): IBaseDialog {
    return ChangePasswordDialog.getInstance(uiContext).setOnCallback(callback).show()
  }

  applyForDeregisterUI(uiContext: UIContext, config?: HelperCenterArgs, callback?: RCallback, url?: string) {
    return this.showWebView(uiContext, {
      title: "账号注销",
      url: url ? url : ApiPath.getUrl(ApiPath.UNREGISTERCONDITION),
      webParams: config ? { "custom_params": JSON.stringify(config) } : {},
      naviBarVisible: true
    }, callback, true)
  }

  showHelperCenterUI(uiContext: UIContext, config?: HelperCenterArgs, callback?: RCallback, url?: string) {
    return this.showWebView(uiContext, {
      url: url ? url : ApiPath.getUrl(ApiPath.STATIC_HELPER_CENTER),
      webParams: config ? { "custom_params": JSON.stringify(config) } : {},
      naviBarVisible: false,
      backVisible: true
    }, callback, true)
  }

  showChatServicesUI(uiContext: UIContext, config?: Record<string, string>, callback?: RCallback, url?: string): WebViewDialog {
    return this.showWebView(uiContext, {
      url: url ? url : ApiPath.getUrl(ApiPath.STATIC_CHAT_SERVICE),
      webParams: config,
    }, callback, true)
  }

  showWebView(uiContext: UIContext, config: WebViewConfig, callback?: RCallback, newView = true): WebViewDialog {
    let dialog = WebViewDialog.getInstance(uiContext, config.url, newView).setTitle(config.title)
    dialog.setOnCallback(callback)
    if (config.webParams) {
      dialog.webParams = config.webParams
    }
    if (config.naviBarVisible !== undefined) {
      dialog.setNaviBarVisible(config.naviBarVisible)
    }
    if (config.backVisible !== undefined) {
      dialog.setBackVisible(config.backVisible)
    }
    if (config.closeVisible !== undefined) {
      dialog.setCloseVisible(config.closeVisible)
    }
    return dialog.show()
  }
}

export default UIApiImpl.getInstance()