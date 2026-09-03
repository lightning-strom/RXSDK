// @keepTs
// @ts-nocheck
import { Account, LoginParams } from '../types/Index';
@Entry
@Component
export declare struct LoginComponent {
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
    aboutToAppear(): void;
    /**
     * Closes the custom pop-up window. If the window is closed, the window does not take effect.
     * @since 7
     */
    close(g100: ClickEvent): void;
    clickLogin(): void;
    showPrivacyDetailDialog(c100: string, d100: string): void;
    showPrivacyAgreeDialog(w99: (event: ClickEvent) => void): void;
    build(): void;
    @Builder
    Loading(): void;
    @Builder
    Body(): void;
}
