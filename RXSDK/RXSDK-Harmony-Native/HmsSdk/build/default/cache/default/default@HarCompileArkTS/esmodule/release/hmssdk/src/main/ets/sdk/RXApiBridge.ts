// @keepTs
// @ts-nocheck
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { CaptchaType, PayParams, Purpose, RXConfig, RXLoginConfig, UserCenterConfig } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { Singleton } from "@normalized:N&&&hmssdk/src/main/ets/types/Types&4.0.0";
import { RXApi, RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXIndex&4.0.0";
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
export class RXApiBridge extends Singleton<RXApiBridge> {
    static async Init(k158: RXConfig, l158: UIContext): Promise<string> {
        try {
            let n158 = await RXApi.getInstance().init(k158, l158);
            return JSON.stringify(n158);
        }
        catch (m158) {
            m158.code ??= RXErrorCode.INIT_ERROR;
            return RXUtil.stringifyError(m158);
        }
    }
    static async Login(g158: RXLoginConfig, h158: UIContext): Promise<string> {
        try {
            let j158 = await RXApi.getInstance().unionLogin(g158, h158);
            return JSON.stringify(j158);
        }
        catch (i158) {
            return RXUtil.stringifyError(i158);
        }
    }
    static async Logout(): Promise<string> {
        try {
            const f158 = await RXApi.getInstance().logout();
            return JSON.stringify(f158);
        }
        catch (e158) {
            return RXUtil.stringifyError(e158);
        }
    }
    static async Pay(b158: PayParams): Promise<string> {
        try {
            const d158 = await RXApi.getInstance().pay(b158);
            return JSON.stringify(d158);
        }
        catch (c158) {
            return RXUtil.stringifyError(c158);
        }
    }
    static async SendCaptcha(u157: UIContext, v157: CaptchaType, w157: string, x157: Purpose, y157?: Record<string, object>): Promise<string> {
        try {
            const a158 = await RXApi.getInstance().sendCaptcha(u157, {
                purpose: x157,
                tencent_captcha: y157,
                type: v157,
                target: w157
            });
            return JSON.stringify(a158);
        }
        catch (z157) {
            return RXUtil.stringifyError(z157);
        }
    }
    async ShowUserPrivacyPolicyUI(p157: UIContext, q157: string, r157: string): Promise<string> {
        try {
            const t157 = RXApi.getInstance().showUserPrivacyPolicyUI(p157, q157, r157);
            return JSON.stringify(t157);
        }
        catch (s157) {
            return RXUtil.stringifyError(s157);
        }
    }
    async ShowCaptchaVerifyUI(l157: UIContext, m157: string): Promise<string> {
        try {
            const o157 = await RXApi.getInstance().showCaptchaVerifyUI(l157, m157);
            return JSON.stringify(o157);
        }
        catch (n157) {
            return RXUtil.stringifyError(n157);
        }
    }
    async ShowFeedbackUI(h157: UIContext, i157?: string[]): Promise<string> {
        try {
            const k157 = await RXApi.getInstance().showFeedbackUI(h157, i157);
            return JSON.stringify(k157);
        }
        catch (j157) {
            return RXUtil.stringifyError(j157);
        }
    }
    async ShowLoginUI(d157: UIContext, e157: RXLoginConfig): Promise<string> {
        try {
            const g157 = await RXApi.getInstance().showLoginUI(d157, e157);
            return JSON.stringify(g157);
        }
        catch (f157) {
            return RXUtil.stringifyError(f157);
        }
    }
    async ShowUserCenterUI(z156: UIContext, a157?: UserCenterConfig): Promise<string> {
        try {
            const c157 = await RXApi.getInstance().showUserCenterUI(z156, a157);
            return JSON.stringify(c157);
        }
        catch (b157) {
            return RXUtil.stringifyError(b157);
        }
    }
}
