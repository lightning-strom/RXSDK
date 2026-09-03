// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { IBaseDialog, LoginData, RealNameResult, RXCallback, RXLoginConfig, RXResult, RCallback, UIApi, WebViewConfig, HelperCenterArgs, UserCenterConfig, AnnouncementConfig, Account, PrivacyKeyArgs, Reward, LoginParams } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { RealNameDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/RealNameDialog&4.0.0";
import { LoginDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginDialog&4.0.0";
import { PrivacyDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/PrivacyDialog&4.0.0";
import { ForgotPasswordDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/ForgotPasswordDialog&4.0.0";
import { UserCenterDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/UserCenterDialog&4.0.0";
import { WebViewDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/WebViewDialog&4.0.0";
import { ChangePasswordDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/ChangePasswordDialog&4.0.0";
import { AnnouncementDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/AnnouncementDialog&4.0.0";
import { MailListDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/MailListDialog&4.0.0";
import type { UIContext } from "@ohos:arkui.UIContext";
import { FeedbackDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/FeedbackDialog&4.0.0";
import { FeedbackListDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/FeedbackListDialog&4.0.0";
import { LoginAccountListDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginAccountListDialog&4.0.0";
import { LoginQuickDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginQuickDialog&4.0.0";
import AccountManager from "@normalized:N&&&hmssdk/src/main/ets/base/AccountManager&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import { CaptchaVerifyDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/CaptchaVerifyDialog&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { UserAgreementDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/UserAgreementDialog&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import { Singleton } from "@normalized:N&&&hmssdk/src/main/ets/types/Types&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import { TipsDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/TipsDialog&4.0.0";
class UIApiImpl extends Singleton<UIApiImpl> implements UIApi {
    showUserPrivacyPolicyUI(r140: UIContext, s140: string, t140: string, u140?: RCallback): IBaseDialog {
        return UserAgreementDialog.getInstance(r140)
            .setContent(s140)
            .setCancelable(false)
            .setTitle(t140)
            .setOnCallback(u140)
            .show();
    }
    showCaptchaVerifyUI(o140: UIContext, p140: string, q140?: RCallback): Promise<IBaseDialog<object>> {
        return CaptchaVerifyDialog.getInstance(o140).setAppid(p140).show(q140);
    }
    showAccountListUI(l140: UIContext, m140: RXLoginConfig, n140?: RCallback<Account>): IBaseDialog<Account> {
        return LoginAccountListDialog.getInstance(l140).show(n140);
    }
    showFeedbackListUI(k140: UIContext): Promise<IBaseDialog<object>> {
        return FeedbackListDialog.getInstance(k140).show();
    }
    showFeedbackUI(i140: UIContext, j140?: string[]): Promise<IBaseDialog<object>> {
        return FeedbackDialog.getInstance(i140).setTags(j140).show();
    }
    showDestroyAccountStatusView(b140: UIContext, c140: string, d140?: RCallback): IBaseDialog {
        return TipsDialog.getInstance(b140).setConfig({
            content: { "id": -1, "type": 10003, params: ['app.string.rx_account_revoke'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
            confirmText: c140 || "继续登录",
            cancelText: "撤销注销",
            title: "已提交注销申请",
        }).show(async (e140) => {
            let f140 = b140.getPromptAction();
            try {
                if (e140?.code == 0) {
                    d140?.({ code: 0, data: { btn_type: 0 } } as RXResult);
                    return;
                }
                let h140 = await Passport.deregisterCancel<object>();
                Logger.d("showDestroyAccountStatusView", JSON.stringify(h140));
                if (h140.code == 0) {
                    f140.showToast({ message: "已成功取消注销申请！" });
                    d140?.({ code: 0, data: { btn_type: 1 } } as RXResult);
                }
                else {
                    f140.showToast(h140);
                    h140.data = h140.data ?? {};
                    h140.data["btn_type"] = 1;
                    d140?.(h140 as RXResult);
                }
            }
            catch (g140) {
                Logger.e(g140);
                f140.showToast({ message: JSON.stringify(g140) });
                d140?.(g140 as RXResult);
            }
        });
    }
    async showLoginUI(v139: UIContext, w139: RXLoginConfig, x139?: RXCallback<RXResult<LoginData>>): Promise<IBaseDialog<LoginData> | void> {
        console.log("clicked showLoginDialog" + w139);
        if (!v139) {
            let a140 = new Error('Error:UIContext is null');
            x139?.({
                message: a140.message,
                code: RXErrorCode.LOGIN_ERROR,
                name: 'LoginError'
            });
            Logger.e('Error:UIContext is null，must adding [SetToGlobalThis("UIContext", this.getUIContext());] to the onPageShow function in the TuanjiePlayerAbilityIndex.ets file');
            throw a140;
        }
        let y139: LoginParams = w139?.ext as LoginParams;
        if (y139?.login_openid && y139?.method) {
            let z139 = await Passport.login(y139, x139);
            if (z139.code == 0) {
                return;
            }
            else {
                Objects.deleteKey(y139, "login_openid");
            }
        }
        if (w139?.quickLoginEnable && AccountManager.getFirstAccount()) {
            return LoginQuickDialog.getInstance(v139).setConfig(w139).setAccount(AccountManager.getFirstAccount()).show(x139);
        }
        else {
            return LoginDialog.getInstance(v139)
                .setConfig(w139)
                .setLoginMethods(w139.loginMethods?.length ? w139.loginMethods : SDKConfig.loginMethods)
                .setAccount(Passport.loginData)
                .show(x139);
        }
    }
    async showMailUI(s139: UIContext, t139?: string, u139?: (data: RXResult<object>) => void): Promise<IBaseDialog<object>> {
        return MailListDialog.getInstance(s139)
            .setUserId(t139)
            .setOnCallback(u139)
            .show();
    }
    async showAnnouncementUI(p139: UIContext, q139: AnnouncementConfig, r139?: (data: RXResult<string>) => void): Promise<IBaseDialog<string>> {
        return AnnouncementDialog.getInstance(p139)
            .setLimit(q139?.limit)
            .setAnnouncementList(q139?.data)
            .setOnCallback(r139)
            .show();
    }
    showPrivacyUI(m139: UIContext, n139: PrivacyKeyArgs, o139?: RCallback): IBaseDialog {
        return PrivacyDialog.getInstance(m139).setKeyData(n139.key_list, n139.key).setOnCallback(o139).show();
    }
    showForgotPasswordUI(k139: UIContext, l139?: RCallback): IBaseDialog {
        return ForgotPasswordDialog.getInstance(k139).setOnCallback(l139).show();
    }
    async showUserCenterUI(h139: UIContext, i139: UserCenterConfig, j139: RCallback): Promise<IBaseDialog> {
        Logger.d("showUserCenterUI with args->", i139);
        return UserCenterDialog.getInstance(h139).setConfigParams(i139).setOnCallback(j139).show();
    }
    showRealNameUI(d139: UIContext, e139?: RCallback<RealNameResult>, f139?: Reward[], g139?: boolean): IBaseDialog<RealNameResult> {
        return RealNameDialog.getInstance(d139)
            .setCancelable(g139)
            .setProps(f139)
            .setOnCallback(e139)
            .show();
    }
    showChangePasswordUI(b139: UIContext, c139?: RCallback): IBaseDialog {
        return ChangePasswordDialog.getInstance(b139).setOnCallback(c139).show();
    }
    applyForDeregisterUI(x138: UIContext, y138?: HelperCenterArgs, z138?: RCallback, a139?: string) {
        return this.showWebView(x138, {
            title: "账号注销",
            url: a139 ? a139 : ApiPath.getUrl(ApiPath.UNREGISTERCONDITION),
            webParams: y138 ? { "custom_params": JSON.stringify(y138) } : {},
            naviBarVisible: true
        }, z138, true);
    }
    showHelperCenterUI(t138: UIContext, u138?: HelperCenterArgs, v138?: RCallback, w138?: string) {
        return this.showWebView(t138, {
            url: w138 ? w138 : ApiPath.getUrl(ApiPath.STATIC_HELPER_CENTER),
            webParams: u138 ? { "custom_params": JSON.stringify(u138) } : {},
            naviBarVisible: false,
            backVisible: true
        }, v138, true);
    }
    showChatServicesUI(p138: UIContext, q138?: Record<string, string>, r138?: RCallback, s138?: string): WebViewDialog {
        return this.showWebView(p138, {
            url: s138 ? s138 : ApiPath.getUrl(ApiPath.STATIC_CHAT_SERVICE),
            webParams: q138,
        }, r138, true);
    }
    showWebView(k138: UIContext, l138: WebViewConfig, m138?: RCallback, n138 = true): WebViewDialog {
        let o138 = WebViewDialog.getInstance(k138, l138.url, n138).setTitle(l138.title);
        o138.setOnCallback(m138);
        if (l138.webParams) {
            o138.webParams = l138.webParams;
        }
        if (l138.naviBarVisible !== undefined) {
            o138.setNaviBarVisible(l138.naviBarVisible);
        }
        if (l138.backVisible !== undefined) {
            o138.setBackVisible(l138.backVisible);
        }
        if (l138.closeVisible !== undefined) {
            o138.setCloseVisible(l138.closeVisible);
        }
        return o138.show();
    }
}
export default UIApiImpl.getInstance();
