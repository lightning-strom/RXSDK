import { Account, LoginData, LoginMethod, RealNameResult, RewardKind, RXCallback, RXErrorCode, RXLoginConfig, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import Passport from '../base/Passport';
import { loginBuilder, LoginBuilderParams } from './LoginBuilder';
import { RealNameDialog } from './RealNameDialog';
import { BaseDialog } from './BaseDialog';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { TipsDialog } from './TipsDialog';
import { Logger } from '../utils/Logger';
import { LoadingDialog } from './LoadingDialog';
import AccountManager from '../base/AccountManager';
import { RXApi } from '../sdk/RXApi';
import { LoginConfig } from '../types/InitConfig';
import Objects from '../utils/Objects';

let Instance: LoginDialog;

let supportMethods: Array<string> = [LoginMethod.Wechat, LoginMethod.UserName, LoginMethod.CaptchaCode, LoginMethod.Guest]

export class LoginDialog extends BaseDialog<LoginBuilderParams, LoginData> {
  private config?: RXLoginConfig;
  private fromUnionLogin?: boolean;
  private account?: Account;
  private loginMethods?: Array<LoginConfig>

  public setLoginMethods(loginMethods?: Array<LoginConfig>) {
    if (loginMethods) {
      this.loginMethods = loginMethods.filter((c: LoginConfig) =>
      supportMethods.includes(c.method)
      );
    } else {
      this.loginMethods = [];
    }

    return this;
  }

  public setAccount(account?: Account) {
    this.account = account;
    return this
  }

  public setFromUnionLogin() {
    this.fromUnionLogin = true;
    return this
  }

  public setConfig(value?: RXLoginConfig) {
    this.config = value;
    this.fromUnionLogin = this.config?.fromUnionLogin
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new LoginDialog(uiContext);
    }
    return Instance;
  }

  show(callback?: RXCallback<RXResult<LoginData>>) {
    let args = new LoginBuilderParams(async (loginObj) => {
      let loading = LoadingDialog.getInstance(this.uiContext).show()
      try {
        let p: object = Objects.assign(this.config?.ext, loginObj)
        p = Objects.deleteKey(p, "login_openid")
        let loginResult = await RXApi.getInstance().login(p).then(async resp => {
          loading.close()
          if (resp?.code == 0) {
            let isRealName = Passport.isRealName(resp.data)

            if (resp?.code == 0 && !isRealName && this.config?.indulgeAuth !== 0) {
              let ret = await new Promise<RXResult<RealNameResult>>((resolve, reject) => {
                RealNameDialog.getInstance(this.uiContext).setCancelable(this.config?.canCloseRealAuth).show(async (err, realDat) => {
                  Logger.d("real auth :", JSON.stringify(err), JSON.stringify(realDat))
                  if (err) {
                    reject(err)
                  } else {
                    resolve(realDat as RXResult<RealNameResult>)
                  }
                })
              })
              if (ret.code !== 0) {
                resp = ret as object as RXResult<LoginData>
              }
            }
            if (this.config?.firstNeedSetPassword && Passport.isNewUser(resp.data?.flag) && !resp.data?.password_set) {
              ChangePasswordDialog.getInstance(this.uiContext).show()
            }
            AccountManager.updateAccount(resp.data?.openid, resp.data)

            if (this.config?.isDeregisterShow !== false && Passport.isDeRegistering(resp.data)) {
              let deRet = await new Promise<RXResult>((resolve, reject) => {
                TipsDialog.getInstance(this.uiContext).setConfig({
                  content: $r('app.string.rx_account_revoke'),
                  confirmText: "继续登录",
                  cancelText: "撤销注销",
                  title: "已提交注销申请",
                }).show(async (event) => {
                  try {
                    if (event?.code == 0) {
                      resolve({ code: 0 } as RXResult)
                      return
                    }
                    let ret = await Passport.deregisterCancel<object>()
                    Logger.d("TipsDialog", JSON.stringify(ret))
                    if (ret.code == 0) {
                      this.uiPromptAction.showToast({ message: "已成功取消注销申请！" })
                      resolve(ret as RXResult)
                    } else {
                      this.uiPromptAction.showToast(ret)
                      reject(ret as RXResult)
                    }
                  } catch (e) {
                    Logger.e(e)
                    this.uiPromptAction.showToast({ message: JSON.stringify(e) })
                    reject(e)
                  }
                })
              })

            }
          }
          if (this.fromUnionLogin && resp.code == 0) {
            await Passport.handleGamePlayer(true)
          }
          return resp
        })
        if (loginResult.code == 0) {
          // Logger.d("loginResult "+loginResult.code)
          this.close()
          callback?.(null, loginResult)
        } else {
          this.uiPromptAction.showToast({ message: loginResult.msg })
        }

      } catch (e) {
        loading.close()
        Logger.e(e)
        this.uiPromptAction.showToast({ message: e.message })
      }
    }, () => {
      this.close()
      callback?.({
        code: RXErrorCode.LOGIN_CANCEL,
        message: '登录取消',
        msg: '登录取消',
        name: 'login'
      })
    })

    if (this.account) {
      args.account = this.account
    }
    if (this.config?.privacyEnable !== undefined) {
      args.privacyEnable = this.config?.privacyEnable
    }
    if (this.config?.privacyText1) {
      args.privacyText1 = this.config?.privacyText1
    }
    if (this.config?.privacyText2) {
      args.privacyText2 = this.config?.privacyText2
    }
    if (this.config?.privacyText3) {
      args.privacyText3 = this.config?.privacyText3
    }
    if (this.config?.privacyUrl1) {
      args.privacyUrl1 = this.config?.privacyUrl1
    }
    if (this.config?.privacyUrl2) {
      args.privacyUrl2 = this.config?.privacyUrl2
    }
    if (this.config?.privacyUrl3) {
      args.privacyUrl3 = this.config?.privacyUrl3
    }
    args.lastMethod = Passport.loginData?.login_method
    args.loginMethods = this.loginMethods


    if (this.contentNode) {
      this.contentNode.update(args)
    } else {
      this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(loginBuilder), args);
    }
    this._show(this.contentNode)
    return this
  }
}