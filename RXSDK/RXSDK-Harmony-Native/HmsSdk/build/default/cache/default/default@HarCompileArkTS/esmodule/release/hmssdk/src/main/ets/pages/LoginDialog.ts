// @keepTs
// @ts-nocheck
import { __MODULE_NAME__, __BUNDLE_NAME__ } from "@normalized:N&&&hmssdk/build/default/generated/profile/default/ModuleInfo&4.0.0";
import { LoginMethod, RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { Account, LoginData, RealNameResult, RXCallback, RXLoginConfig, RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ComponentContent } from "@ohos:arkui.node";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import { loginBuilder, LoginBuilderParams } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginBuilder&4.0.0";
import { RealNameDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/RealNameDialog&4.0.0";
import { BaseDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/BaseDialog&4.0.0";
import { ChangePasswordDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/ChangePasswordDialog&4.0.0";
import { TipsDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/TipsDialog&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { LoadingDialog } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoadingDialog&4.0.0";
import AccountManager from "@normalized:N&&&hmssdk/src/main/ets/base/AccountManager&4.0.0";
import { RXApi } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXApi&4.0.0";
import type { LoginConfig } from '../types/InitConfig';
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
let Instance: LoginDialog;
let supportMethods: Array<string> = [LoginMethod.Wechat, LoginMethod.UserName, LoginMethod.CaptchaCode, LoginMethod.Guest];
export class LoginDialog extends BaseDialog<LoginBuilderParams, LoginData> {
    private config?: RXLoginConfig;
    private fromUnionLogin?: boolean;
    private account?: Account;
    private loginMethods?: Array<LoginConfig>;
    public setLoginMethods(e109?: Array<LoginConfig>) {
        if (e109) {
            this.loginMethods = e109.filter((f109: LoginConfig) => supportMethods.includes(f109.method));
        }
        else {
            this.loginMethods = [];
        }
        return this;
    }
    public setAccount(d109?: Account) {
        this.account = d109;
        return this;
    }
    public setFromUnionLogin() {
        this.fromUnionLogin = true;
        return this;
    }
    public setConfig(c109?: RXLoginConfig) {
        this.config = c109;
        this.fromUnionLogin = this.config?.fromUnionLogin;
        return this;
    }
    public static getInstance(b109: UIContext) {
        if (Instance == null) {
            Instance = new LoginDialog(b109);
        }
        return Instance;
    }
    show(h108?: RXCallback<RXResult<LoginData>>) {
        let i108 = new LoginBuilderParams(async (j108) => {
            let k108 = LoadingDialog.getInstance(this.uiContext).show();
            try {
                let m108: object = Objects.assign(this.config?.ext, j108);
                m108 = Objects.deleteKey(m108, "login_openid");
                let n108 = await RXApi.getInstance().login(m108).then(async (o108) => {
                    k108.close();
                    if (o108?.code == 0) {
                        let p108 = Passport.isRealName(o108.data);
                        if (o108?.code == 0 && !p108 && this.config?.indulgeAuth !== 0) {
                            let w108 = await new Promise<RXResult<RealNameResult>>((x108, y108) => {
                                RealNameDialog.getInstance(this.uiContext).setCancelable(this.config?.canCloseRealAuth).show(async (z108, a109) => {
                                    Logger.d("real auth :", JSON.stringify(z108), JSON.stringify(a109));
                                    if (z108) {
                                        y108(z108);
                                    }
                                    else {
                                        x108(a109 as RXResult<RealNameResult>);
                                    }
                                });
                            });
                            if (w108.code !== 0) {
                                o108 = w108 as object as RXResult<LoginData>;
                            }
                        }
                        if (this.config?.firstNeedSetPassword && Passport.isNewUser(o108.data?.flag) && !o108.data?.password_set) {
                            ChangePasswordDialog.getInstance(this.uiContext).show();
                        }
                        AccountManager.updateAccount(o108.data?.openid, o108.data);
                        if (this.config?.isDeregisterShow !== false && Passport.isDeRegistering(o108.data)) {
                            let q108 = await new Promise<RXResult>((r108, s108) => {
                                TipsDialog.getInstance(this.uiContext).setConfig({
                                    content: { "id": -1, "type": 10003, params: ['app.string.rx_account_revoke'], "bundleName": __BUNDLE_NAME__, "moduleName": __MODULE_NAME__ },
                                    confirmText: "继续登录",
                                    cancelText: "撤销注销",
                                    title: "已提交注销申请",
                                }).show(async (t108) => {
                                    try {
                                        if (t108?.code == 0) {
                                            r108({ code: 0 } as RXResult);
                                            return;
                                        }
                                        let v108 = await Passport.deregisterCancel<object>();
                                        Logger.d("TipsDialog", JSON.stringify(v108));
                                        if (v108.code == 0) {
                                            this.uiPromptAction.showToast({ message: "已成功取消注销申请！" });
                                            r108(v108 as RXResult);
                                        }
                                        else {
                                            this.uiPromptAction.showToast(v108);
                                            s108(v108 as RXResult);
                                        }
                                    }
                                    catch (u108) {
                                        Logger.e(u108);
                                        this.uiPromptAction.showToast({ message: JSON.stringify(u108) });
                                        s108(u108);
                                    }
                                });
                            });
                        }
                    }
                    if (this.fromUnionLogin && o108.code == 0) {
                        await Passport.handleGamePlayer(true);
                    }
                    return o108;
                });
                if (n108.code == 0) {
                    this.close();
                    h108?.(null, n108);
                }
                else {
                    this.uiPromptAction.showToast({ message: n108.msg });
                }
            }
            catch (l108) {
                k108.close();
                Logger.e(l108);
                this.uiPromptAction.showToast({ message: l108.message });
            }
        }, () => {
            this.close();
            h108?.({
                code: RXErrorCode.LOGIN_CANCEL,
                message: '登录取消',
                msg: '登录取消',
                name: 'login'
            });
        });
        if (this.account) {
            i108.account = this.account;
        }
        if (this.config?.privacyEnable !== undefined) {
            i108.privacyEnable = this.config?.privacyEnable;
        }
        if (this.config?.privacyText1) {
            i108.privacyText1 = this.config?.privacyText1;
        }
        if (this.config?.privacyText2) {
            i108.privacyText2 = this.config?.privacyText2;
        }
        if (this.config?.privacyText3) {
            i108.privacyText3 = this.config?.privacyText3;
        }
        if (this.config?.privacyUrl1) {
            i108.privacyUrl1 = this.config?.privacyUrl1;
        }
        if (this.config?.privacyUrl2) {
            i108.privacyUrl2 = this.config?.privacyUrl2;
        }
        if (this.config?.privacyUrl3) {
            i108.privacyUrl3 = this.config?.privacyUrl3;
        }
        i108.lastMethod = Passport.loginData?.login_method;
        i108.loginMethods = this.loginMethods;
        if (this.contentNode) {
            this.contentNode.update(i108);
        }
        else {
            this.contentNode = new ComponentContent(this.uiContext, wrapBuilder(loginBuilder), i108);
        }
        this._show(this.contentNode);
        return this;
    }
}
