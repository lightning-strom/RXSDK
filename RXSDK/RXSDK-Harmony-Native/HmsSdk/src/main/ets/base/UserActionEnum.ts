import { Context } from '@kit.AbilityKit';


const START_TIME_MARK: string = "start_time_mark"
const RX_USER_ACTION: string = "#rx_user_action"


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
  RealAuth = "realauth",
}

export enum UserAction {
  Init = "init",

  // 通用状态
  /**
   * 用于触发展示某个登录相关界面或功能的操作，例如展示登录表单、展示第三方登录按钮等
   */
  Show = "show",
  /**
   * 展示登录相关界面或功能成功的状态，如成功弹出一键登录窗口
   */
  ShowSuccess = "show_success",
  /**
   * 展示登录相关界面或功能失败的状态，可能是由于网络问题、资源加载失败等原因
   */
  ShowFail = "show_fail",
  /**
   * 通用的成功状态，可用于登录、获取验证码等操作成功
   */
  Success = "success",
  /**
   * 通用的失败状态，可用于登录、获取验证码等操作失败
   */
  Fail = "fail",
  /**
   * 用户点击了登录过程中的协议相关内容，如隐私协议、服务条款等
   */
  Privacy = "privacy",
  /**
   * 关闭登录页面的操作，不区分是用户主动关闭还是登录成功后自动关闭
   */
  Close = "close",
  /**
   * 瑞雪登录成功的状态，瑞雪可能是特定系统或平台的名称
   */
  LoginSuccess = "login_success",
  /**
   * 瑞雪登录失败的状态，可能会附带错误码和错误信息
   */
  LoginFail = "login_fail",

  // 账号相关操作
  /**
   * 用户点击了账号输入框，可能用于触发键盘输入、显示提示信息等操作
   */
  AccountTF = "account_tf",
  /**
   * 用户点击了密码输入框，可能用于触发键盘输入、显示密码可见按钮等操作
   */
  PasswordTF = "password_tf",
  /**
   * 用户点击了使用账号密码进行登录的按钮，会触发账号密码登录流程
   */
  AccountLogin = "login",
  /**
   * 用户点击了忘记密码的链接或按钮，可能会跳转到找回密码页面
   */
  ForgotPassword = "forgot_password",

  // 验证码相关操作
  /**
   * 用户点击了手机号输入框，可能用于输入获取验证码的手机号码
   */
  PhoneTF = "phone_tf",
  /**
   * 用户点击了验证码输入框，可能用于输入接收到的验证码
   */
  CaptchaCodeTF = "captchacode_tf",
  /**
   * 用户点击了发送验证码的按钮，会触发向指定手机号发送验证码的操作
   */
  CaptchaCodeSend = "captchacode_send",
  /**
   * 发送验证码操作成功的状态，用户可以使用接收到的验证码进行后续登录
   */
  CaptchaCodeSuccess = "captchacode_success",
  /**
   * 发送验证码操作失败的状态，可能是由于手机号码格式错误、短信通道故障等原因
   */
  CaptchaCodeFail = "captchacode_fail",

  // 第三方登录相关操作
  /**
   * 用户点击了第三方登录的按钮，如苹果登录、微信登录、游客登录等按钮
   */
  Click = "click",
  // Show = "show",
  NameTF = "name_tf",
  IDCardTF = "idcard_tf",
  Confirm = "confirm",
  // Success = "success",
  // Fail = "fail"
}




