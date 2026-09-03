const START_TIME_MARK: string = "start_time_mark";
const RX_USER_ACTION: string = "#rx_user_action";
export interface APITraceData {
    error_code?: number;
    error_msg?: string;
    api?: string;
    request_body?: string | Object;
    request_header?: string | Object;
    third_res?: string | Object;
}
export interface UserTraceData extends APITraceData {
    scene: UserScene;
    action: string;
    method?: string;
}
export enum UserScene {
    Init = "init",
    VersionCheck = "version_check",
    Login = "login",
    RealAuth = "realauth"
}
export enum UserAction {
    Init = "init",
    Show = "show",
    ShowSuccess = "show_success",
    ShowFail = "show_fail",
    Success = "success",
    Fail = "fail",
    Privacy = "privacy",
    Close = "close",
    LoginSuccess = "login_success",
    LoginFail = "login_fail",
    AccountTF = "account_tf",
    PasswordTF = "password_tf",
    AccountLogin = "login",
    ForgotPassword = "forgot_password",
    PhoneTF = "phone_tf",
    CaptchaCodeTF = "captchacode_tf",
    CaptchaCodeSend = "captchacode_send",
    CaptchaCodeSuccess = "captchacode_success",
    CaptchaCodeFail = "captchacode_fail",
    Click = "click",
    NameTF = "name_tf",
    IDCardTF = "idcard_tf",
    Confirm = "confirm"
}
