// @keepTs
// @ts-nocheck
import { Account, LoginParams, Obj } from '../types/Index';
import { LoginConfig } from '../types/InitConfig';
@Component
export declare struct LoginComponent2 {
    @State
    isLoading: boolean;
    @StorageProp("rx_logo")
    title: ResourceStr;
    @State
    userName: string;
    @State
    password: string;
    @State
    captcha: string;
    @State
    loginMethods?: Array<LoginConfig>;
    @State
    isCaptcha: boolean;
    @State
    switchText: string;
    @State
    isPrivacyAgreed: boolean;
    @State
    privacyEnable: boolean;
    @State
    marginBottom: number;
    @State
    privacyText1: string;
    @State
    privacyText2: string;
    @State
    privacyText3: string;
    privacyUrl1: string;
    privacyUrl2: string;
    privacyUrl3: string;
    privacyFontSize: number;
    account?: Account;
    onLoginClick?: (loginParams: LoginParams) => void;
    onCaptchaClick?: (event: ClickEvent) => void;
    onForgotPwdClick?: (event: ClickEvent) => void;
    onCloseClick?: (event?: ClickEvent) => void;
    @State
    offsetY: number;
    @State
    lastMethod?: string;
    @State
    showPasswordIcon: boolean;
    aboutToAppear(): void;
    /**
     * loginMethods 只开放其中一种时，上次登录方式不能把表单切到未开放的那一种，
     * 否则单一方式下没有「其他登录方式」入口可切回来。
     */
    pickCaptchaMode(b107?: Account): boolean;
    onAction(z106: string, a107?: Obj): void;
    play(): void;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(y106: ClickEvent): void;
    clickLogin(w106?: LoginParams): void;
    showPrivacyDetailDialog(u106: string, v106: string): void;
    showPrivacyAgreeDialog(o106: (event: ClickEvent) => void): void;
    build(): void;
    @Builder
    Loading(): void;
    @Builder
    Body(): void;
    isShowOtherLogin(i101?: Array<LoginConfig>): boolean;
}
