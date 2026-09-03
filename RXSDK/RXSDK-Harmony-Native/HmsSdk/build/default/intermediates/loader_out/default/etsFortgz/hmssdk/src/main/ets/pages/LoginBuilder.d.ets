// @keepTs
// @ts-nocheck
import { LoginConfig } from '../types/InitConfig';
import { Account, LoginParams } from '../types/Index';
export declare class LoginBuilderParams {
    onLoginClick?: (login: LoginParams) => void;
    onForgotPwdClick?: (event: ClickEvent) => void;
    onCloseClick?: (event?: ClickEvent) => void;
    privacyEnable: boolean;
    privacyText1: string;
    privacyText2: string;
    privacyText3: string;
    privacyUrl1: string;
    privacyUrl2: string;
    privacyUrl3: string;
    lastMethod?: string;
    loginMethods?: Array<LoginConfig>;
    isCaptcha?: boolean;
    account?: Account;
    constructor(h96?: (login: LoginParams) => void, i96?: (event?: ClickEvent) => void);
    setLoginMethods(g96: Array<LoginConfig>): this;
}
@Builder
export declare function loginBuilder(y95: LoginBuilderParams): void;
