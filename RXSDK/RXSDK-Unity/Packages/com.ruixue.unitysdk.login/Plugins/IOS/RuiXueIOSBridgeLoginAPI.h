#ifndef __RuiXue__IOSBridge__LoginAPI__
#define __RuiXue__IOSBridge__LoginAPI__

extern "C"
{
   
// 登录
void ios_loginWithLoginType(int LoginType,
                         const char* username,
                         const char* password,
                         const char* captchaCode,
                         const char* permissions,
                         const char* loginOpenId,
                         const char* jsonExtDic,
                         const char* jsonArraySignFields,
                         const char* jsonMigrateArgs,
                        RequestResponseCallBack requestResponse,
                        RequestErrorCallBack requestError
                         );


// 注册
void ios_registerWithUsername(const char* username,
                            const char* password,
                            const char* captchaCode,
                            const char* jsonExtDic,
                            RequestResponseCallBack requestResponse,
                            RequestErrorCallBack requestError
                            );


// 发送验证码
void ios_sendCaptchaWithType(int captchaType,
                             const char* target,
                             const char* purpose,
                             RequestResponseCallBack requestResponse,
                             RequestErrorCallBack requestError);


// 校验验证码
void ios_verifyCaptchaWithType(int captchaType,
                               const char* target,
                               const char* purpose,
                               const char* captchaCode,
                               RequestResponseCallBack requestResponse,
                               RequestErrorCallBack requestError);


// 绑定邮箱
void ios_bindEmailWithEmail(const char* email,
                            const char* password,
                            const char* captchaCode,
                            const char* jsonMigrateArgs,
                            RequestResponseCallBack requestResponse,
                            RequestErrorCallBack requestError);


// 解绑邮箱
void ios_unBindEmailWithEmail(const char* email,
                              const char* captchaCode,
                              RequestResponseCallBack requestResponse,
                              RequestErrorCallBack requestError);


// 绑定手机
void ios_bindPhoneWithCaptchaCode(const char* captchaCode,
                                  const char* password,
                                  const char* phone,
                                  const char* jsonMigrateArgs,
                                  RequestResponseCallBack requestResponse,
                                  RequestErrorCallBack requestError);

// 解绑手机
void ios_unBindPhoneWithCaptchaCode(const char* captchaCode,
                                    const char* phone,
                                    RequestResponseCallBack requestResponse,
                                    RequestErrorCallBack requestError);

// 修改手机号
void ios_changePhoneWithOldPhoneCaptcha(const char* oldPhoneCaptcha,
                                        const char* newphone,
                                        const char* newphone_captcha,
                                        const char* jsonMigrateArgs,
                                        RequestResponseCallBack requestResponse,
                                        RequestErrorCallBack requestError);


// 获取用户信息
void ios_getUserInfoWithComplete(RequestResponseCallBack requestResponse,
                                 RequestErrorCallBack requestError);

// 获取指定用户信息
void ios_getUserInfoByFieldWithParams(const char* jsonParam,
                                      RequestResponseCallBack requestResponse,
                                      RequestErrorCallBack requestError);


// 修改用户信息
void ios_updateUserInfo(const char* avatarUrl,
                        const char* nickname,
                        const char* sex,
                        const char* region,
                        RequestResponseCallBack requestResponse,
                        RequestErrorCallBack requestError);


// 修改密码
void ios_changePasswordWithNewPwd(const char* newPwd,
                                  const char* oldPwd,
                                  RequestResponseCallBack requestResponse,
                                  RequestErrorCallBack requestError);


// 重置密码
void ios_resetPasswordWithUsername(const char* username,
                               const char* password,
                               const char* captchaCode,
                               const char* jsonMigrateArgs,
                               RequestResponseCallBack requestResponse,
                               RequestErrorCallBack requestError);

// 实名认证
void ios_realAuthWithRealName(const char* realName,
                              const char* idCard,
                              RequestResponseCallBack requestResponse,
                              RequestErrorCallBack requestError);


// 查询用户拥有的账号
void ios_searchHasAccountsWithMethod(const char* method,
                                     const char* deviceCode,
                                     int states,
                                     RequestResponseCallBack requestResponse,
                                     RequestErrorCallBack requestError);


// 申请注销账号
void ios_deregisterWithConfig(const char* config,
                                RequestResponseCallBack requestResponse,
                                RequestErrorCallBack requestError);

// 撤销注销申请
void ios_deregisterCancelWithComplete(RequestResponseCallBack requestResponse,
                                      RequestErrorCallBack requestError);

}

#endif

