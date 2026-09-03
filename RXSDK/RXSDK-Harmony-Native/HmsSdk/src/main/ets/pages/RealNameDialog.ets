import { IifaaRedirectURLResp, IifaaValidateResp, RealNameResult, Reward, RXCallback, RXErrorCode, RXResult } from '../types/Index';
import { ComponentContent } from '@kit.ArkUI';
import { realNameBuilder, RealNameParams } from './RealNameBuilder';
import Passport from '../base/Passport';
import { BaseDialog } from './BaseDialog';
import { SuccessTipsDialog } from './SuccessTipsDialog';
import { Logger } from '../utils/Logger';
import SDKConfig from '../sdk/SDKConfig';
import app from '../utils/App';

let Instance: RealNameDialog;

export class RealNameDialog extends BaseDialog<RealNameParams, RealNameResult> {
  private _props?: Reward[] | undefined;


  public get props(): Reward[] | undefined {
    return this._props || Passport.realAuthReward;
  }

  public setProps(value: Reward[] | undefined) {
    this._props = value;
    return this
  }

  public static getInstance(uiContext: UIContext) {
    if (Instance == null) {
      Instance = new RealNameDialog(uiContext);
    }
    return Instance;
  }

  show(callback?: RXCallback<RXResult<RealNameResult>> | undefined) {
    let args = new RealNameParams(async (realName, idCard, isFastAuth) => {
      await this.commitRealName(realName, idCard, isFastAuth, callback)
    }, () => {
      let rt = {
        code: RXErrorCode.LOGIN_ERROR,
        msg: "取消认证"
      } as RXResult<RealNameResult>
      callback?.(null, rt)
      this.onCallback?.(rt as RXResult<RealNameResult>)
      this.close()
    }, this.props)
    args.onAlipayAuthClick = async () => {
      await this.commitAlipayRealName(callback)
    }
    args.canCloseRealAuth = this.cancelable
    args.useAlipayAuth = SDKConfig.isUseIifaaAuth

    if (SDKConfig.isUseFastAuth) {
      args.realName = Passport.loginData?.ext?.["realname"]
      args.idCard = Passport.loginData?.ext?.["idcard"]
    }


    // if (this.contentNode) {
    //   this.contentNode.update(args)
    // } else {
    this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(realNameBuilder), args);
    // }

    this._show(this.contentNode)
    return this

  }

  onClose(): void {
    super.onClose();
    this._props = undefined
    Passport.clearIifaaAutoValidateCallback()
  }

  private async commitRealName(realName: string, idCard: string, isFastAuth: boolean,
    callback?: RXCallback<RXResult<RealNameResult>> | undefined) {
    try {
      Passport.clearIifaaAutoValidateCallback()
      let ret = await Passport.realAuth(realName, idCard, isFastAuth)
      Logger.d("real auth:", realName, idCard, JSON.stringify(ret))
      this.handleRealNameResult(ret, callback)
    } catch (e) {
      Logger.w("real auth error", realName, idCard, JSON.stringify(e))
      this.uiPromptAction.showToast({ message: JSON.stringify(e) })
      callback?.(e)
      this.onCallback?.(e)
    }
  }

  private async commitAlipayRealName(callback?: RXCallback<RXResult<RealNameResult>> | undefined) {
    try {
      this.uiPromptAction.showToast({ message: "正在打开支付宝实名认证" })
      let thirdPartSchema = this.getIifaaThirdPartSchema()
      if (!thirdPartSchema) {
        Logger.e("IIFAA third_part_schema is empty, check init config channel.sh")
        this.uiPromptAction.showToast({ message: "实名认证失败" })
        return
      }
      let redirectResp: RXResult<IifaaRedirectURLResp> = await Passport.getIifaaRedirectURL(app.name, thirdPartSchema)
      let redirectUrl = redirectResp.data?.redirect_url || redirectResp.data?.redirectUrl || redirectResp.data?.url
      if (redirectResp.code != 0 || !redirectUrl) {
        this.uiPromptAction.showToast(redirectResp)
        callback?.(null, redirectResp as RXResult<RealNameResult>)
        this.onCallback?.(redirectResp as RXResult<RealNameResult>)
        return
      }

      let started = await app.tryStartBrowser(redirectUrl)
      if (!started) {
        Passport.clearIifaaAutoValidateCallback()
        this.uiPromptAction.showToast({ message: "实名认证失败" })
        return
      }
      this.registerIifaaValidateCallback(callback)
    } catch (e) {
      Logger.w("alipay real auth error", JSON.stringify(e))
      this.uiPromptAction.showToast({ message: JSON.stringify(e) })
      callback?.(e)
      this.onCallback?.(e)
    }
  }

  private handleRealNameResult(ret: RXResult<RealNameResult>, callback?: RXCallback<RXResult<RealNameResult>> | undefined) {
    if (ret.code == 0 || ret.code == RXErrorCode.ALREADY_REAL_NAME) {
      ret.code = 0
      SuccessTipsDialog.getInstance(this.uiContext).setContent(ret.msg).show((r) => {
        Logger.d("SuccessTips: " + JSON.stringify(r))
        callback?.(null, ret)
        this.onCallback?.(ret as RXResult<RealNameResult>)
      })
      this.close()
    } else {
      this.uiPromptAction.showToast(ret)
      callback?.(null, ret)
      this.onCallback?.(ret as RXResult<RealNameResult>)
    }
  }

  private registerIifaaValidateCallback(callback?: RXCallback<RXResult<RealNameResult>> | undefined) {
    Passport.setIifaaAutoValidateCallback((resp: RXResult<IifaaValidateResp>) => {
      if (resp.code == 0 || resp.code == RXErrorCode.ALREADY_REAL_NAME) {
        Passport.clearIifaaAutoValidateCallback()
        this.close()
        let ret = resp as RXResult<RealNameResult>
        ret.code = 0
        callback?.(null, ret)
        this.onCallback?.(ret)
      } else {
        this.uiPromptAction.showToast(resp)
      }
    })
  }

  private getIifaaThirdPartSchema(): string {
    let scheme = SDKConfig.realAuthIifaaScheme.trim()
    if (!scheme) {
      return ""
    }
    return scheme.includes("://") ? scheme : scheme + "://"
  }
}