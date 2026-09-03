#import <RXSDK_Pure/RXSDK_Pure.h>
#import "RuiXueIOSBridgeBase.h"
#import "RuiXueIOSBridgeLoginAPI.h"
#import "RuiXueIOSBridgeUtils.h"
#import "NSString+JSONCategories.h"
#import "RuiXueIOSBridgeLoginDelegate.h"


// 登录
void ios_loginWithLoginType(int loginType,
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
                        )
{
    NSArray *permissionsArray = [RuiXueIOSBridgeUtils toNSArray:permissions];
    NSMutableDictionary* dicExt = [RuiXueIOSBridgeUtils toNSDic:jsonExtDic];
    NSArray* arraySignFields = [RuiXueIOSBridgeUtils toNSArray:jsonArraySignFields];
    id migrateArgs = [RuiXueIOSBridgeUtils toObj:jsonMigrateArgs];
    
    RuiXueIOSBridgeLoginDelegate *loginDelegate = [RuiXueIOSBridgeLoginDelegate shareInstance];
    
    loginDelegate.onLoginSuccess = requestResponse;
    loginDelegate.onLoginError = requestError;
    
    [RXService sharedSDK].loginDelegate = loginDelegate;
    
    [[RXService sharedSDK] loginWithLoginType:(LoginType)loginType username:[RuiXueIOSBridgeUtils toNSString:username] password:[RuiXueIOSBridgeUtils toNSString:password] captchaCode:[RuiXueIOSBridgeUtils toNSString:captchaCode] permissions:permissionsArray loginOpenId:[RuiXueIOSBridgeUtils toNSString:loginOpenId]
                                       extDic:dicExt
                                   signFields:arraySignFields
                                  migrateArgs:migrateArgs];
}


// 注册
void ios_registerWithUsername(const char* username,
                            const char* password,
                            const char* captchaCode,
                            const char* jsonExtDic,
                            RequestResponseCallBack requestResponse,
                            RequestErrorCallBack requestError
                            )
{
    NSMutableDictionary* dicExt = [RuiXueIOSBridgeUtils toNSDic:jsonExtDic];
    
    [[RXApiService sharedSDK] registerWithUsername:[RuiXueIOSBridgeUtils toNSString:username]
                                          password:[RuiXueIOSBridgeUtils toNSString:password] captchaCode:[RuiXueIOSBridgeUtils toNSString:captchaCode]
            ext:dicExt
            complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
        if(!error)
        {
            NSLog(@"ios_registerWithUsername 请求成功");
            requestResponse("ios_registerWithUsername",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_registerWithUsername 请求失败");
            requestError("ios_registerWithUsername", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 发送验证码
void ios_sendCaptchaWithType(int captchaType,
                             const char* target,
                             const char* purpose,
                             RequestResponseCallBack requestResponse,
                             RequestErrorCallBack requestError)
{
    [[RXApiService sharedSDK] sendCaptchaWithType:(CaptchaType)captchaType
                                           target:[RuiXueIOSBridgeUtils toNSString:target]
                                          purpose:[RuiXueIOSBridgeUtils toNSString:purpose] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error)
        {
            NSLog(@"ios_sendCaptchaWithType 请求成功");
            requestResponse("ios_sendCaptchaWithType",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_sendCaptchaWithType 请求失败");
            requestError("ios_sendCaptchaWithType",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
    
}


// 校验验证码
void ios_verifyCaptchaWithType(int captchaType,
                               const char* target,
                               const char* purpose,
                               const char* captchaCode,
                               RequestResponseCallBack requestResponse,
                               RequestErrorCallBack requestError)
{
    [[RXApiService sharedSDK] verifyCaptchaWithType:(CaptchaType)captchaType
                                             target:[RuiXueIOSBridgeUtils toNSString:target] purpose:[RuiXueIOSBridgeUtils toNSString:purpose] captchaCode:[RuiXueIOSBridgeUtils toNSString:captchaCode] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error)
        {
            NSLog(@"ios_verifyCaptchaWithType 请求成功");
            requestResponse("ios_verifyCaptchaWithType",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_verifyCaptchaWithType 请求失败");
            requestError("ios_verifyCaptchaWithType",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 绑定邮箱
void ios_bindEmailWithEmail(const char* email,
                            const char* password,
                            const char* captchaCode,
                            const char* jsonMigrateArgs,
                            RequestResponseCallBack requestResponse,
                            RequestErrorCallBack requestError)
{
    id migrateArgs = [RuiXueIOSBridgeUtils toObj:jsonMigrateArgs];
    
    [[RXApiService sharedSDK] bindEmailWithEmail:[RuiXueIOSBridgeUtils toNSString:email] password:[RuiXueIOSBridgeUtils toNSString:password] captchaCode:[RuiXueIOSBridgeUtils toNSString:captchaCode]
                                     migrateArgs:migrateArgs complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_bindEmailWithEmail 请求成功");
            requestResponse("ios_bindEmailWithEmail",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_bindEmailWithEmail 请求失败");
            requestError("ios_bindEmailWithEmail",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 解绑邮箱
void ios_unBindEmailWithEmail(const char* email,
                              const char* captchaCode,
                              RequestResponseCallBack requestResponse,
                              RequestErrorCallBack requestError)
{
    [[RXApiService sharedSDK] unBindEmailWithEmail:[RuiXueIOSBridgeUtils toNSString:email] captchaCode:[RuiXueIOSBridgeUtils toNSString:captchaCode] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_unBindEmailWithEmail 请求成功");
            requestResponse("ios_unBindEmailWithEmail",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_unBindEmailWithEmail 请求失败");
            requestError("ios_unBindEmailWithEmail",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 绑定手机
void ios_bindPhoneWithCaptchaCode(const char* captchaCode,
                                  const char* password,
                                  const char* phone,
                                  const char* jsonMigrateArgs,
                                  RequestResponseCallBack requestResponse,
                                  RequestErrorCallBack requestError)
{
    id migrateArgs = [RuiXueIOSBridgeUtils toObj:jsonMigrateArgs];
    
    [[RXApiService sharedSDK] bindPhoneWithCaptchaCode:[RuiXueIOSBridgeUtils toNSString:captchaCode] password:[RuiXueIOSBridgeUtils toNSString:password] phone:[RuiXueIOSBridgeUtils toNSString:phone] migrateArgs:migrateArgs complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_bindPhoneWithCaptchaCode 请求成功");
            requestResponse("ios_bindPhoneWithCaptchaCode",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_bindPhoneWithCaptchaCode 请求失败");
            requestError("ios_bindPhoneWithCaptchaCode",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 解绑手机
void ios_unBindPhoneWithCaptchaCode(const char* captchaCode,
                                    const char* phone,
                                    RequestResponseCallBack requestResponse,
                                    RequestErrorCallBack requestError)
{
    [[RXApiService sharedSDK] unBindPhoneWithCaptchaCode:[RuiXueIOSBridgeUtils toNSString:captchaCode] phone:[RuiXueIOSBridgeUtils toNSString:phone] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_unBindPhoneWithCaptchaCode 请求成功");
            requestResponse("ios_unBindPhoneWithCaptchaCode",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_unBindPhoneWithCaptchaCode 请求失败");
            requestError("ios_unBindPhoneWithCaptchaCode",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
    
}

// 修改手机号
void ios_changePhoneWithOldPhoneCaptcha(const char* oldPhoneCaptcha,
                                        const char* newphone,
                                        const char* newphone_captcha,
                                        const char* jsonMigrateArgs,
                                        RequestResponseCallBack requestResponse,
                                        RequestErrorCallBack requestError)
{
    id migrateArgs = [RuiXueIOSBridgeUtils toObj:jsonMigrateArgs];
    
    [[RXApiService sharedSDK] changePhoneWithOldPhoneCaptcha:[RuiXueIOSBridgeUtils toNSString:oldPhoneCaptcha] newphone:[RuiXueIOSBridgeUtils toNSString:newphone] newPhoneCaptcha:[RuiXueIOSBridgeUtils toNSString:newphone_captcha] migrateArgs:migrateArgs complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_changePhoneWithOldPhoneCaptcha 请求成功");
            requestResponse("ios_changePhoneWithOldPhoneCaptcha",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_changePhoneWithOldPhoneCaptcha 请求失败");
            requestError("ios_changePhoneWithOldPhoneCaptcha",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 获取用户信息
void ios_getUserInfoWithComplete(RequestResponseCallBack requestResponse,
                                 RequestErrorCallBack requestError)
{
    [[RXApiService sharedSDK] getUserInfoWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_getUserInfoWithComplete 请求成功");
            requestResponse("ios_getUserInfoWithComplete",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_getUserInfoWithComplete 请求失败");
            requestError("ios_getUserInfoWithComplete",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
    
}


// 获取指定用户信息
void ios_getUserInfoByFieldWithParams(const char* jsonParam,
                                      RequestResponseCallBack requestResponse,
                                      RequestErrorCallBack requestError)
{
    NSDictionary *param = [RuiXueIOSBridgeUtils toNSDic:jsonParam];
    [[RXApiService sharedSDK] getUserInfoByFieldWithParams:param complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_getUserInfoByFieldWithParams 请求成功");
            requestResponse("ios_getUserInfoByFieldWithParams",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_getUserInfoByFieldWithParams 请求失败");
            requestError("ios_getUserInfoByFieldWithParams",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
    
}


// 修改用户信息
void ios_updateUserInfo(const char* avatarUrl,
                        const char* nickname,
                        const char* sex,
                        const char* region,
                        RequestResponseCallBack requestResponse,
                        RequestErrorCallBack requestError)
{
    [[RXApiService sharedSDK] updateUserInfo:[RuiXueIOSBridgeUtils toNSString:avatarUrl] nickname:[RuiXueIOSBridgeUtils toNSString:nickname] sex:[RuiXueIOSBridgeUtils toNSString:sex] region:[RuiXueIOSBridgeUtils toNSString:region] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_updateUserInfo 请求成功");
            requestResponse("ios_updateUserInfo",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_updateUserInfo 请求失败");
            requestError("ios_updateUserInfo",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 修改密码
void ios_changePasswordWithNewPwd(const char* newPwd,
                                  const char* oldPwd,
                                  RequestResponseCallBack requestResponse,
                                  RequestErrorCallBack requestError)
{
    [[RXApiService sharedSDK] changePasswordWithNewPwd:[RuiXueIOSBridgeUtils toNSString:newPwd] oldPwd:[RuiXueIOSBridgeUtils toNSString:oldPwd] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_changePasswordWithNewPwd 请求成功");
            requestResponse("ios_changePasswordWithNewPwd",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_changePasswordWithNewPwd 请求失败");
            requestError("ios_changePasswordWithNewPwd",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 重置密码
void ios_resetPasswordWithUsername(const char* username,
                               const char* password,
                               const char* captchaCode,
                               const char* jsonMigrateArgs,
                               RequestResponseCallBack requestResponse,
                               RequestErrorCallBack requestError)
{
    id migrateArgs = [RuiXueIOSBridgeUtils toObj:jsonMigrateArgs];
    [[RXApiService sharedSDK] resetPasswordWithUsername:[RuiXueIOSBridgeUtils toNSString:username] password:[RuiXueIOSBridgeUtils toNSString:password] captchaCode:[RuiXueIOSBridgeUtils toNSString:captchaCode] migrateArgs:migrateArgs complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_resetPasswordWithUsername 请求成功");
            requestResponse("ios_resetPasswordWithUsername",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_resetPasswordWithUsername 请求失败");
            requestError("ios_resetPasswordWithUsername",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 实名认证
void ios_realAuthWithRealName(const char* realName,
                              const char* idCard,
                              RequestResponseCallBack requestResponse,
                              RequestErrorCallBack requestError)
{
    [[RXApiService sharedSDK] realAuthWithRealName:[RuiXueIOSBridgeUtils toNSString:realName] idCard:[RuiXueIOSBridgeUtils toNSString:idCard] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_realAuthWithRealName 请求成功");
            requestResponse("ios_realAuthWithRealName",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_realAuthWithRealName 请求失败");
            requestError("ios_realAuthWithRealName",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 查询用户拥有的账号
void ios_searchHasAccountsWithMethod(const char* method,
                                     const char* deviceCode,
                                     int states,
                                     RequestResponseCallBack requestResponse,
                                     RequestErrorCallBack requestError)
{
    [[RXApiService sharedSDK] searchHasAccountsWithMethod:[RuiXueIOSBridgeUtils toNSString:method] devicecode:[RuiXueIOSBridgeUtils toNSString:deviceCode] states:states complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_searchHasAccountsWithMethod 请求成功");
            requestResponse("ios_searchHasAccountsWithMethod",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_searchHasAccountsWithMethod 请求失败");
            requestError("ios_searchHasAccountsWithMethod",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 申请注销账号
void ios_deregisterWithConfig(const char* config,
                                RequestResponseCallBack requestResponse,
                                RequestErrorCallBack requestError)
{
    RXDeregisterConfig* dergisterConfig = [[RXDeregisterConfig alloc] init];
    
    NSDictionary* dic = [RuiXueIOSBridgeUtils toNSDic:config];
    dergisterConfig.idCard = (NSString*)[dic objectForKey:@"idCard"];
    dergisterConfig.realname = (NSString*)[dic objectForKey:@"realname"];
    dergisterConfig.cpdata = (NSString*)[dic objectForKey:@"cpdata"];
    
    NSDictionary* dicThirdParams = [dic objectForKey:@"thirdParams"];
    dergisterConfig.thirdParams = dicThirdParams;
    
    [[RXDestroyAccountService sharedSDK] deregisterWithConfig:dergisterConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {

        if(!error)
        {
            NSLog(@"ios_deregisterWithConfig 请求成功");
            requestResponse("ios_deregisterWithConfig",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_deregisterWithConfig 请求失败");
            requestError("ios_deregisterWithConfig",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 撤销注销申请
void ios_deregisterCancelWithComplete(RequestResponseCallBack requestResponse,
                                      RequestErrorCallBack requestError)
{
    [[RXDestroyAccountService sharedSDK] deregisterCancelWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"ios_deregisterCancelWithComplete 请求成功");
            requestResponse("ios_deregisterCancelWithComplete",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"ios_deregisterCancelWithComplete 请求失败");
            requestError("ios_deregisterCancelWithComplete",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}
