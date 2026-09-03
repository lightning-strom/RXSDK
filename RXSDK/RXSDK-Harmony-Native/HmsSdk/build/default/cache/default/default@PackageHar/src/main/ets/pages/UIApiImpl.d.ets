// @keepTs
// @ts-nocheck
import { IBaseDialog, LoginData, RealNameResult, RXCallback, RXLoginConfig, RXResult, RCallback, UIApi, WebViewConfig, HelperCenterArgs, UserCenterConfig, AnnouncementConfig, Account, PrivacyKeyArgs, Reward } from '../types/Index';
import { WebViewDialog } from './WebViewDialog';
import { UIContext } from '@ohos.arkui.UIContext';
import { Singleton } from '../types/Types';
declare class UIApiImpl extends Singleton<UIApiImpl> implements UIApi {
    showUserPrivacyPolicyUI(r140: UIContext, s140: string, t140: string, u140?: RCallback): IBaseDialog;
    showCaptchaVerifyUI(o140: UIContext, p140: string, q140?: RCallback): Promise<IBaseDialog<object>>;
    showAccountListUI(l140: UIContext, m140: RXLoginConfig, n140?: RCallback<Account>): IBaseDialog<Account>;
    showFeedbackListUI(k140: UIContext): Promise<IBaseDialog<object>>;
    showFeedbackUI(i140: UIContext, j140?: string[]): Promise<IBaseDialog<object>>;
    showDestroyAccountStatusView(b140: UIContext, c140: string, d140?: RCallback): IBaseDialog;
    showLoginUI(v139: UIContext, w139: RXLoginConfig, x139?: RXCallback<RXResult<LoginData>>): Promise<IBaseDialog<LoginData> | void>;
    showMailUI(s139: UIContext, t139?: string, u139?: (data: RXResult<object>) => void): Promise<IBaseDialog<object>>;
    showAnnouncementUI(p139: UIContext, q139: AnnouncementConfig, r139?: (data: RXResult<string>) => void): Promise<IBaseDialog<string>>;
    showPrivacyUI(m139: UIContext, n139: PrivacyKeyArgs, o139?: RCallback): IBaseDialog;
    showForgotPasswordUI(k139: UIContext, l139?: RCallback): IBaseDialog;
    showUserCenterUI(h139: UIContext, i139: UserCenterConfig, j139: RCallback): Promise<IBaseDialog>;
    showRealNameUI(d139: UIContext, e139?: RCallback<RealNameResult>, f139?: Reward[], g139?: boolean): IBaseDialog<RealNameResult>;
    showChangePasswordUI(b139: UIContext, c139?: RCallback): IBaseDialog;
    applyForDeregisterUI(x138: UIContext, y138?: HelperCenterArgs, z138?: RCallback, a139?: string): WebViewDialog;
    showHelperCenterUI(t138: UIContext, u138?: HelperCenterArgs, v138?: RCallback, w138?: string): WebViewDialog;
    showChatServicesUI(p138: UIContext, q138?: Record<string, string>, r138?: RCallback, s138?: string): WebViewDialog;
    showWebView(k138: UIContext, l138: WebViewConfig, m138?: RCallback, n138?: boolean): WebViewDialog;
}
declare const _default: UIApiImpl;
export default _default;
