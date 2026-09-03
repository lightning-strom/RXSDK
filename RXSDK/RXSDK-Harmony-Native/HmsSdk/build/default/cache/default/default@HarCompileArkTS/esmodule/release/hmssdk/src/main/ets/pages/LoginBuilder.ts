// @keepTs
// @ts-nocheck
import type { LoginConfig } from '../types/InitConfig';
import type { Account, LoginParams } from '../types/Index';
import { LoginComponent2 } from "@normalized:N&&&hmssdk/src/main/ets/pages/LoginComponent2&4.0.0";
export class LoginBuilderParams {
    onLoginClick?: (login: LoginParams) => void;
    onForgotPwdClick?: (event: ClickEvent) => void;
    onCloseClick?: (event?: ClickEvent) => void;
    privacyEnable: boolean = true;
    privacyText1: string = '用户协议';
    privacyText2: string = '隐私政策';
    privacyText3: string = '';
    privacyUrl1: string = '00001';
    privacyUrl2: string = '00002';
    privacyUrl3: string = '';
    lastMethod?: string;
    loginMethods?: Array<LoginConfig>;
    isCaptcha?: boolean;
    account?: Account;
    constructor(h96?: (login: LoginParams) => void, i96?: (event?: ClickEvent) => void) {
        this.onLoginClick = h96;
        this.onCloseClick = i96;
    }
    setLoginMethods(g96: Array<LoginConfig>) {
        this.loginMethods = g96;
        return this;
    }
}
export function loginBuilder(y95: LoginBuilderParams, z95 = null) {
    const a96 = y95;
    {
        (z95 ? z95 : this).observeComponentCreation2((b96, c96, d96 = a96) => {
            if (c96) {
                let e96 = new LoginComponent2(z95 ? z95 : this, {
                    account: d96.account,
                    privacyEnable: d96.privacyEnable,
                    privacyText1: d96.privacyText1,
                    privacyText2: d96.privacyText2,
                    privacyText3: d96.privacyText3,
                    privacyUrl1: d96.privacyUrl1,
                    privacyUrl2: d96.privacyUrl2,
                    privacyUrl3: d96.privacyUrl3,
                    onLoginClick: d96.onLoginClick,
                    onCloseClick: d96.onCloseClick,
                    onForgotPwdClick: d96.onForgotPwdClick,
                    loginMethods: d96.loginMethods,
                    isCaptcha: d96.isCaptcha ?? d96.loginMethods?.[0]?.method != "username" ?? true,
                    lastMethod: d96.lastMethod,
                }, undefined, b96, () => { }, { page: "HmsSdk/src/main/ets/pages/LoginBuilder.ets", line: 35, col: 3 });
                ViewPU.create(e96);
                let f96 = () => {
                    return {
                        account: d96.account,
                        privacyEnable: d96.privacyEnable,
                        privacyText1: d96.privacyText1,
                        privacyText2: d96.privacyText2,
                        privacyText3: d96.privacyText3,
                        privacyUrl1: d96.privacyUrl1,
                        privacyUrl2: d96.privacyUrl2,
                        privacyUrl3: d96.privacyUrl3,
                        onLoginClick: d96.onLoginClick,
                        onCloseClick: d96.onCloseClick,
                        onForgotPwdClick: d96.onForgotPwdClick,
                        loginMethods: d96.loginMethods,
                        isCaptcha: d96.isCaptcha ?? d96.loginMethods?.[0]?.method != "username" ?? true,
                        lastMethod: d96.lastMethod
                    };
                };
                e96.paramsGenerator_ = f96;
            }
            else {
                (z95 ? z95 : this).updateStateVarsOfChildByElmtId(b96, {});
            }
        }, { name: "LoginComponent2" });
    }
}
