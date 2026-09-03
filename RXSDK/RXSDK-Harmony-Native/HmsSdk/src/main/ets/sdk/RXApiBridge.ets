import { CaptchaType, PayParams, Purpose, RXConfig, RXErrorCode, RXLoginConfig, UserCenterConfig } from "../types/Index";
import { Singleton } from "../types/Types";

import { RXApi, RXUtil } from "./RXIndex";

export interface IRXApiBridge {
  Login(conf: RXLoginConfig, uiContext: UIContext): Promise<string>;

  Init(conf: RXConfig, uiContext: UIContext): Promise<string>;

  Logout(): Promise<string>;

  Pay(params: PayParams): Promise<string>;

  SendCaptcha(
    uiContext: UIContext,
    type: CaptchaType,
    target: string,
    purpose: Purpose,
    tencentCaptcha?: Record<string, object>
  ): Promise<string>;

  ShowUserPrivacyPolicyUI(
    uiContext: UIContext,
    content: string,
    title: string
  ): Promise<string>;

  ShowCaptchaVerifyUI(
    uiContext: UIContext,
    appid: string
  ): Promise<string>;

  ShowFeedbackUI(uiContext: UIContext, config?: string[]): Promise<string>;

  ShowLoginUI(
    uiContext: UIContext,
    config: RXLoginConfig
  ): Promise<string>;

  ShowUserCenterUI(
    uiContext: UIContext,
    config?: UserCenterConfig
  ): Promise<string>;
}

export class RXApiBridge extends Singleton<RXApiBridge> {
  static async Init(conf: RXConfig, uiContext: UIContext): Promise<string> {
    try {
      let ret = await RXApi.getInstance().init(conf, uiContext);
      return JSON.stringify(ret)
    } catch (e) {
      e.code ??= RXErrorCode.INIT_ERROR
      return RXUtil.stringifyError(e)
    }
  }

  static async Login(conf: RXLoginConfig, uiContext: UIContext): Promise<string> {
    try {
      let ret = await RXApi.getInstance().unionLogin(conf, uiContext);
      return JSON.stringify(ret)
    } catch (e) {
      return RXUtil.stringifyError(e)
    }
  }


  static async Logout(): Promise<string> {
    try {
      const ret = await RXApi.getInstance().logout();
      return JSON.stringify(ret);
    } catch (e) {
      return RXUtil.stringifyError(e)
    }
  }

  static async Pay(params: PayParams): Promise<string> {
    try {
      const ret = await RXApi.getInstance().pay(params);
      return JSON.stringify(ret);
    } catch (e) {
      return RXUtil.stringifyError(e)
    }
  }

  static async SendCaptcha(
    uiContext: UIContext,
    type: CaptchaType,
    target: string,
    purpose: Purpose,
    tencentCaptcha?: Record<string, object>
  ): Promise<string> {
    try {
      const ret = await RXApi.getInstance().sendCaptcha(
        uiContext, {
        purpose: purpose,
        tencent_captcha:tencentCaptcha,
        type:type,
        target:target
      }
      );
      return JSON.stringify(ret);
    } catch (e) {
      return RXUtil.stringifyError(e)
    }
  }

  async ShowUserPrivacyPolicyUI(
    uiContext: UIContext,
    content: string,
    title: string
  ): Promise<string> {
    try {
      const dialog = RXApi.getInstance().showUserPrivacyPolicyUI(
        uiContext,
        content,
        title
      );
      return JSON.stringify(dialog);
    } catch (e) {
      return RXUtil.stringifyError(e)
    }
  }

  async ShowCaptchaVerifyUI(
    uiContext: UIContext,
    appid: string
  ): Promise<string> {
    try {
      const dialog = await RXApi.getInstance().showCaptchaVerifyUI(
        uiContext,
        appid
      );
      return JSON.stringify(dialog);
    } catch (e) {
      return RXUtil.stringifyError(e)

    }
  }

  async ShowFeedbackUI(uiContext: UIContext, config?: string[]): Promise<string> {
    try {
      const dialog = await RXApi.getInstance().showFeedbackUI(
        uiContext,
        config
      );
      return JSON.stringify(dialog);
    } catch (e) {
      return RXUtil.stringifyError(e)
    }
  }

  async ShowLoginUI(
    uiContext: UIContext,
    config: RXLoginConfig
  ): Promise<string> {
    try {
      const dialog = await RXApi.getInstance().showLoginUI(uiContext, config);
      return JSON.stringify(dialog);
    } catch (e) {
      return RXUtil.stringifyError(e)
    }
  }

  async ShowUserCenterUI(
    uiContext: UIContext,
    config?: UserCenterConfig
  ): Promise<string> {
    try {
      const dialog = await RXApi.getInstance().showUserCenterUI(
        uiContext,
        config
      );
      return JSON.stringify(dialog);
    } catch (e) {
      return RXUtil.stringifyError(e)
    }
  }


}