
export enum PassportPath {

  REGISTER = "v1/passport/account/register",

  /**
   * SDK登录
   */
  LOGIN = "v1/passport/account/login_by_credential",

  // 二次登录
  LOGIN_TOKEN = "v1/passport/account/login_by_token",

  HARMONY_ASSOCIATION = "/v1/passport/user/harmony_association",

  /**
   * 发送验证码
   */
  SEND_CAPTCHA = "v1/passport/captcha/send",
  SEND_CAPTCHA_AUTH = "v1/passport/captcha/send_auth",

  /**
   * 校验验证码
   */
  VERIFY_CAPTCHA = "v1/passport/captcha/verify",
  /**
   * 刷新令牌
   */
  REFRESH_TOKEN = "v1/passport/token/refresh",
  /**
   * 获取用户信息
   */
  USER_INFO = "v1/passport/user/get_info",
  BIND_ACCOUNT = "v1/passport/user/bind_account",
  SYNC_APP_INFO = "v1/passport/user/sync_app_info",
  ACCOUNT_QUERY = "v1/passport/user/query",

  /**
   * 修改用户信息
   */
  UPDATE_USER = "v1/passport/user/update_info",
  /**
   * 绑定手机号
   */
  BIND_PHONE = "v1/passport/user/bind_phone",
  /**
   * 解绑手机号
   */
  UNBIND_PHONE = "v1/passport/user/unbind_phone",

  /**
   * 修改手机账号
   */
  CHANGE_PHONE = "v1/passport/user/change_phone",
  /**
   * 绑定邮箱
   */
  BIND_EMAIL = "v1/passport/user/bind_email",
  /**
   * 解绑邮箱
   */
  UNBIND_EMAIL = "v1/passport/user/unbind_email",
  /**
   * 修改密码
   */
  CHANGE_PWD = "v1/passport/user/change_password",
  /**
   * 密码重置
   */
  RESET_PWD = "v1/passport/user/reset_password",
  /**
   * 实名认证
   */
  CERTIFICATION = "v1/passport/user/realauth",
  /**
   * 获取 IIFAA 支付宝授权跳转地址
   */
  IIFAA_REDIRECT_URL = "v1/cgosdk/sdk/auth/iifaa/redirect_url",
  /**
   * 验证 IIFAA 支付宝认证结果
   */
  IIFAA_VALIDATE = "v1/cgosdk/sdk/auth/iifaa/validate_by_bizid",
  /**
   * 注销账号
   */
  USER_DEREGISTER = "v1/passport/user/deregister",

  /**
   * 撤销账号注销申请
   */
  USER_DEREGISTER_CANCEL = "v1/passport/user/cancel_deregister",

  ACCOUNT_BOUND_QUERY = "v1/passport/user/bound_accounts",
}

