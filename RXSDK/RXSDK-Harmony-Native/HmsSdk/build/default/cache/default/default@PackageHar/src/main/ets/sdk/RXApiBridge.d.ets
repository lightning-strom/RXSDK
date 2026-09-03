// @keepTs
// @ts-nocheck
import { CaptchaType, PayParams, Purpose, RXConfig, RXLoginConfig, UserCenterConfig } from "../types/Index";
import { Singleton } from "../types/Types";
export interface IRXApiBridge {
    Login(conf: RXLoginConfig, uiContext: UIContext): Promise<string>;
    Init(conf: RXConfig, uiContext: UIContext): Promise<string>;
    Logout(): Promise<string>;
    Pay(params: PayParams): Promise<string>;
    SendCaptcha(uiContext: UIContext, type: CaptchaType, target: string, purpose: Purpose, tencentCaptcha?: Record<string, object>): Promise<string>;
    ShowUserPrivacyPolicyUI(uiContext: UIContext, content: string, title: string): Promise<string>;
    ShowCaptchaVerifyUI(uiContext: UIContext, appid: string): Promise<string>;
    ShowFeedbackUI(uiContext: UIContext, config?: string[]): Promise<string>;
    ShowLoginUI(uiContext: UIContext, config: RXLoginConfig): Promise<string>;
    ShowUserCenterUI(uiContext: UIContext, config?: UserCenterConfig): Promise<string>;
}
export declare class RXApiBridge extends Singleton<RXApiBridge> {
    static Init(k158: RXConfig, l158: UIContext): Promise<string>;
    static Login(g158: RXLoginConfig, h158: UIContext): Promise<string>;
    static Logout(): Promise<string>;
    static Pay(b158: PayParams): Promise<string>;
    static SendCaptcha(u157: UIContext, v157: CaptchaType, w157: string, x157: Purpose, y157?: Record<string, object>): Promise<string>;
    ShowUserPrivacyPolicyUI(p157: UIContext, q157: string, r157: string): Promise<string>;
    ShowCaptchaVerifyUI(l157: UIContext, m157: string): Promise<string>;
    ShowFeedbackUI(h157: UIContext, i157?: string[]): Promise<string>;
    ShowLoginUI(d157: UIContext, e157: RXLoginConfig): Promise<string>;
    ShowUserCenterUI(z156: UIContext, a157?: UserCenterConfig): Promise<string>;
}
