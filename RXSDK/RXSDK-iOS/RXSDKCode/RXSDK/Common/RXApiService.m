//
//  RXApiService.m
//  RXSDK
//
//  Created by 陈汉 on 2021/11/9.
//

#import "RXApiService.h"
#import "RXCommonHeader.h"
#import "DeviceKey.h"
#import "RXCommonWebView.h"
#import "CHCid.h"
#import "RXAdManger.h"
#import "RXLogManager.h"
#import "RXCommonManager.h"
#import "RXUWAService.h"
#import "RXWelfareCodeManager.h"
#import "RXLogService.h"
#import "RXGameInfoService.h"
#import "RXUserActionLogManager.h"
#import "RXBDAManager.h"
#import "RXGDTManager.h"

@interface RXApiService ()

@property (nonatomic, strong) NSString *randstr;
@property (nonatomic, strong) NSString *ticket;

@end

@implementation RXApiService

static RXApiService *sharedSDK = nil;
static dispatch_once_t onceToken;
static NSInteger const RXIIFAAResultDefaultRetryCount = 3;
static NSInteger const RXIIFAAResultRetryErrorCode = 310039;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXApiService alloc] init];
    });
    return sharedSDK;
}

// 获取验证码
- (void)getCaptchaCodeWithType:(CaptchaType)type
                        target:(NSString *)target
                       purpose:(NSString *)purpose
                      complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    switch (type) {
        case CaptchaType_phone:
            [dic setValue:target forKey:@"phone"];
            break;
        case CaptchaType_email:
            [dic setValue:target forKey:@"email"];
            break;
        default:
            break;
    }
    
    [dic setValue:purpose forKey:@"purpose"];
    
    NSMutableDictionary *tencent_captcha = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:self.ticket].length > 0) {
        [tencent_captcha setValue:self.ticket forKey:@"ticket"];
    }
    if ([NSString rx_isNullToString:self.randstr].length > 0) {
        [tencent_captcha setValue:self.randstr forKey:@"randstr"];
    }

    [dic setValue:tencent_captcha forKey:@"tencent_captcha"];
    
    NSString *accessToken = [RXUserUtility valueForKey:keyUserData_access];
    NSString *url = @"v1/passport/captcha/send";
    if ([NSString rx_isNullToString:accessToken].length > 0) {
        url = @"/v1/passport/captcha/send_auth";
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    NSString *domain = [RXConfig sharedManager].apiDomain;
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
        
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"发送成功:\n %@", responseObject);
        
        self.ticket = @"";
        self.randstr = @"";
        
        if (complete) {
            complete(responseObject, nil);
        }
        
        [[RXLogManager sharedSDK] addCaptchaCodeLogWithPurpose:purpose errorInfo:nil];
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"发送失败:\n %@", error.error);
        NSMutableDictionary *errorRes = [NSMutableDictionary dictionaryWithDictionary:error.responesObject];
        NSInteger errorCode = [[errorRes valueForKey:@"code"] integerValue];
        
        // 需要进行滑块验证
        if (errorCode == 312241) {
            NSString *domain = [RXConfig sharedManager].apiDomain;
            if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
                domain = [NSString stringWithFormat:@"%@/", domain];
            }
            
            RXCommonWebView *webView = [[RXCommonWebView alloc] initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
            webView.params = [NSMutableDictionary dictionaryWithDictionary:[errorRes valueForKey:@"data"]];
//            webView.urlStr = @"http://10.10.2.64:8083/#/captcha";
            webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/captcha", domain];
            [[UIApplication sharedApplication].keyWindow addSubview:webView];
            
            webView.complete = ^(NSDictionary * _Nonnull response) {
                if ([response[@"code"] integerValue] == 0) {
//                    self.ticket = response[@"ticket"];
//                    self.randstr = response[@"randstr"];
                    [[NSNotificationCenter defaultCenter] postNotificationName:noti_slideCodeSuc object:nil userInfo:nil];
                    [self getCaptchaCodeLocalWithType:type target:target purpose:purpose ticket:response[@"ticket"] randstr:response[@"randstr"] complete:complete];
                }
            };
        } else if ([url isEqualToString:@"/v1/passport/captcha/send_auth"] && (errorCode == 302201 || errorCode == 302001 || errorCode == 302002 || errorCode == 302003)) {
            [RXUserUtility setValue:@"" ForKey:keyUserData_access];
            self.ticket = @"";
            self.randstr = @"";
            [self getCaptchaCodeLocalWithType:type target:target purpose:purpose ticket:@"" randstr:@"" complete:complete];
        } else {
            [[RXLogManager sharedSDK] addCaptchaCodeLogWithPurpose:purpose errorInfo:error.responesObject];
            self.ticket = @"";
            self.randstr = @"";
            if (complete) {
                complete(nil, error);
            }
        }
    }];
}

/**
 * 发送验证码
 * @param type 验证码类型
 * @param target 发送的目标（手机或邮箱），传空或nil默认为当前绑定的手机或邮箱
 * @param purpose 用途
 * ！register           // 注册
 * ！bindphone      // 绑定手机
 * ！unbindphone  // 解绑手机
 * ！resetpwd        // 重置密码
 * ！changepwd    // 修改密码
 * ！bindemail       // 绑定邮箱
 * ！unbindemail   // 解绑邮箱
 * ！login               // 登录
 */
- (void)sendCaptchaWithType:(CaptchaType)type
                     target:(NSString *)target
                    purpose:(NSString *)purpose
                   complete:(RequestComplete)complete
{
    [self getCaptchaCodeWithType:type target:target purpose:purpose complete:complete];
}

/**
 * 发送验证码
 * @param type 验证码类型
 * @param target 发送的目标（手机或邮箱），传空或nil默认为当前绑定的手机或邮箱
 * @param randstr 图形验证随机串，可传空
 * @param ticket 图形验证凭证，可传空
 * @param purpose 用途
 * ！register           // 注册
 * ！bindphone      // 绑定手机
 * ！unbindphone  // 解绑手机
 * ！resetpwd        // 重置密码
 * ！changepwd    // 修改密码
 * ！bindemail       // 绑定邮箱
 * ！unbindemail   // 解绑邮箱
 * ！login               // 登录
 */
- (void)sendCaptchaWithType:(CaptchaType)type
                     target:(NSString *)target
                    purpose:(NSString *)purpose
                     ticket:(NSString *)ticket
                    randstr:(NSString *)randstr
                   complete:(RequestComplete)complete
{
    [self getCaptchaCodeLocalWithType:type target:target purpose:purpose ticket:ticket randstr:randstr complete:complete];
}


- (void)getCaptchaCodeLocalWithType:(CaptchaType)type
                             target:(NSString *)target
                            purpose:(NSString *)purpose
                             ticket:(NSString *)ticket
                            randstr:(NSString *)randstr
                           complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    switch (type) {
        case CaptchaType_phone:
            [dic setValue:target forKey:@"phone"];
            break;
        case CaptchaType_email:
            [dic setValue:target forKey:@"email"];
            break;
        default:
            break;
    }
    
    [dic setValue:purpose forKey:@"purpose"];
    
    NSMutableDictionary *tencent_captcha = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:ticket].length > 0) {
        [tencent_captcha setValue:ticket forKey:@"ticket"];
    }
    if ([NSString rx_isNullToString:randstr].length > 0) {
        [tencent_captcha setValue:randstr forKey:@"randstr"];
    }

    [dic setValue:tencent_captcha forKey:@"tencent_captcha"];
    
    NSString *accessToken = [RXUserUtility valueForKey:keyUserData_access];
    NSString *url = @"v1/passport/captcha/send";
    if ([NSString rx_isNullToString:accessToken].length > 0) {
        url = @"/v1/passport/captcha/send_auth";
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    
    NSString *domain = [RXConfig sharedManager].apiDomain;
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
        
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"发送成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"发送失败:\n %@", error.error);
        NSMutableDictionary *errorRes = [NSMutableDictionary dictionaryWithDictionary:error.responesObject];
        NSInteger errorCode = [[errorRes valueForKey:@"code"] integerValue];
        
        // 需要进行滑块验证
        if (errorCode == 312241) {
            NSString *domain = [RXConfig sharedManager].apiDomain;
            if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
                domain = [NSString stringWithFormat:@"%@/", domain];
            }
            
            RXCommonWebView *webView = [[RXCommonWebView alloc] initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
            webView.params = [NSMutableDictionary dictionaryWithDictionary:[errorRes valueForKey:@"data"]];
//            webView.urlStr = @"http://10.10.2.64:8083/#/captcha";
            webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/captcha", domain];
            [[UIApplication sharedApplication].keyWindow addSubview:webView];
            
            webView.complete = ^(NSDictionary * _Nonnull response) {
                if ([response[@"code"] integerValue] == 0) {
                    self.ticket = response[@"ticket"];
                    self.randstr = response[@"randstr"];
                    [[NSNotificationCenter defaultCenter] postNotificationName:noti_slideCodeSuc object:nil userInfo:nil];
                    [self getCaptchaCodeWithType:type target:target purpose:purpose complete:complete];
                }
            };
        } else if ([url isEqualToString:@"/v1/passport/captcha/send_auth"] && (errorCode == 302201 || errorCode == 302001 || errorCode == 302002 || errorCode == 302003)) {
            [RXUserUtility setValue:@"" ForKey:keyUserData_access];
            [self getCaptchaCodeWithType:type target:target purpose:purpose complete:complete];
        } else {
            if (complete) {
                complete(nil, error);
            }
        }
    }];
}

// 校验验证码
- (void)verifyCaptchaCodeWithType:(CaptchaType)type
                           target:(NSString *)target
                          purpose:(NSString *)purpose
                     captcha_code:(NSString *)captcha_code
                         complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    switch (type) {
        case CaptchaType_phone:
            [dic setValue:target forKey:@"phone"];
            break;
        case CaptchaType_email:
            [dic setValue:target forKey:@"email"];
            break;
        default:
            break;
    }
    [dic setValue:purpose forKey:@"purpose"];
    [dic setValue:captcha_code forKey:@"captcha_code"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/captcha/verify" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"校验成功:\n %@", responseObject);
        
        [[RXLogManager sharedSDK] addVerifyCaptchaCodeLogWithErrorInfo:nil type:type];
        
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"校验失败:\n %@", error.error);
        
        [[RXLogManager sharedSDK] addVerifyCaptchaCodeLogWithErrorInfo:error.responesObject type:type];
        
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 校验验证码
 * @param type 验证码类型
 * @param target 发送的目标（手机或邮箱），传空或nil默认为当前绑定的手机或邮箱
 * @param captcha_code 验证码
 * @param purpose 用途
 * ！register           // 注册
 * ！bindphone      // 绑定手机
 * ！unbindphone  // 解绑手机
 * ！resetpwd        // 重置密码
 * ！changepwd    // 修改密码
 * ！bindemail       // 绑定邮箱
 * ！unbindemail   // 解绑邮箱
 * ！login               // 登录
 */
- (void)verifyCaptchaWithType:(CaptchaType)type
                       target:(NSString *)target
                      purpose:(NSString *)purpose
                  captchaCode:(NSString *)captchaCode
                     complete:(RequestComplete)complete
{
    [self verifyCaptchaCodeWithType:type target:target purpose:purpose captcha_code:captchaCode complete:complete];
}

// 绑定邮箱
- (void)bindingEmailWithCaptchaCode:(NSString *)captchaCode
                           password:(NSString *)password
                              email:(NSString *)email
                       migrate_args:(id _Nullable)migrate_args
                           complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:captchaCode forKey:@"captcha_code"];
    if (password && password.length > 0) {
        [dic setValue:[RXCommonTool md532BitUpperWithStr:password] forKey:@"password"];
    }
    [dic setValue:email forKey:@"email"];
    [dic setValue:migrate_args forKey:@"migrate_args"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/bind_email" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"绑定邮箱成功:\n %@", responseObject);
        
        // 绑定邮箱后修改位运算，attr第二位改为1，更换邮箱
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].loginData];
        
        int attr = [loginData[@"attr"] intValue];
        attr = attr | 4;
        
        [loginData setValue:@(attr) forKey:@"attr"];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        if (loginData[@"ext"]) {
            extDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"ext"]];
        }

        [extDic setValue:email forKey:@"email"];
        [loginData setValue:extDic forKey:@"ext"];
        
        [RXUserUtility sharedManager].loginData = loginData;
        
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"绑定邮箱失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

// 绑定邮箱
- (void)bindEmailWithEmail:(NSString *)email
                  password:(NSString *)password
               captchaCode:(NSString *)captchaCode
               migrateArgs:(id _Nullable)migrateArgs
                  complete:(RequestComplete)complete
{
    [self bindingEmailWithCaptchaCode:captchaCode password:password email:email migrate_args:migrateArgs complete:complete];
}

// 解绑邮箱
- (void)reliveBindingEmailWithCaptchaCode:(NSString *)captchaCode
                                    email:(NSString *)email
                                 complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:captchaCode forKey:@"captchaCode"];
    [dic setValue:email forKey:@"email"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/unbind_email" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"解除绑定邮箱成功:\n %@", responseObject);
        
        // 解绑邮箱后修改位运算，attr第二位改为0，解绑
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].loginData];
        int attr = [loginData[@"attr"] intValue];
        attr = attr & ~(1 << 2);
        
        [loginData setValue:@(attr) forKey:@"attr"];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        if (loginData[@"ext"]) {
            extDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"ext"]];
        }
        
        if ([extDic valueForKey:@"email"]) {
            [extDic removeObjectForKey:@"email"];
        }
        
        [loginData setValue:extDic forKey:@"ext"];
        
        [RXUserUtility sharedManager].loginData = loginData;
        
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"解除绑定邮箱失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 解绑邮箱
 * @param captchaCode 验证码
 * @param email 邮箱
 */
- (void)unBindEmailWithEmail:(NSString *)email
                 captchaCode:(NSString *)captchaCode
                    complete:(RequestComplete)complete
{
    [self reliveBindingEmailWithCaptchaCode:captchaCode email:email complete:complete];
}

// 绑定手机
- (void)bindingPhoneWithCaptchaCode:(NSString *)captchaCode
                           password:(NSString *)password
                              phone:(NSString *)phone
                       migrate_args:(id _Nullable)migrate_args
                           complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:captchaCode forKey:@"captcha_code"];
    if (password && password.length > 0) {
        [dic setValue:[RXCommonTool md532BitUpperWithStr:password] forKey:@"password"];
    }
    [dic setValue:phone forKey:@"phone"];
    [dic setValue:migrate_args forKey:@"migrate_args"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/bind_phone" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
//    if (password && password.length > 0 && ![RXCommonTool checkPasswordWithPwd:password]) {
//        RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
//        NSDictionary *errorRes = @{@"code" : @(RXLoginError_passwordRuleFail),
//                                   @"msg" : [RXErrorTool getRXErrorMsg:RXLoginError_passwordRuleFail]
//        };
//        error.responesObject = errorRes;
//        if (complete) {
//            complete(nil, error);
//        }
//        return;
//    }
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"绑定手机成功:\n %@", responseObject);
        
        // 绑定手机后修改位运算，attr第一位改为1，更换手机号
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].loginData];
        int attr = [loginData[@"attr"] intValue];
        attr = attr | 2;
        
        [loginData setValue:@(attr) forKey:@"attr"];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        if (loginData[@"ext"]) {
            extDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"ext"]];
        }
        
        NSString *fetchPhone = [RXCommonTool usernameSec:phone];
        
        if ([phone containsString:@"+"]) {
            if (phone.length > 4) {
                NSInteger zeroCount = 0;
                for (int i = 1; i < 5; i++) {
                    NSString *subStr = [phone substringWithRange:NSMakeRange(i, 1)];
                    if ([subStr isEqualToString:@"0"]) {
                        zeroCount++;
                    } else {
                        break;
                    }
                }
                if (zeroCount > 0) {
                    fetchPhone = [phone stringByReplacingCharactersInRange:NSMakeRange(1, zeroCount) withString:@""];
                }
            }
        }
        
        [extDic setValue:phone forKey:@"phone"];
        [loginData setValue:extDic forKey:@"ext"];
        
        [RXUserUtility sharedManager].loginData = loginData;
        
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"绑定手机失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

// 绑定手机
- (void)bindPhoneWithCaptchaCode:(NSString *)captchaCode
                        password:(NSString *)password
                           phone:(NSString *)phone
                     migrateArgs:(id _Nullable)migrateArgs
                        complete:(RequestComplete)complete
{
    [self bindingPhoneWithCaptchaCode:captchaCode password:password phone:phone migrate_args:migrateArgs complete:complete];
}

// 解绑手机
- (void)reliveBindingPhoneWithCaptchaCode:(NSString *)captchaCode
                                    phone:(NSString *)phone
                                 complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:captchaCode forKey:@"captchaCode"];
    [dic setValue:phone forKey:@"phone"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/unbind_phone" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"解除绑定手机成功:\n %@", responseObject);
        
        // 解绑手机后修改位运算，attr第一位改为0
        NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].loginData];
        int attr = [loginData[@"attr"] intValue];
        attr = attr & ~(1 << 1);
        
        [loginData setValue:@(attr) forKey:@"attr"];
        
        NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
        if (loginData[@"ext"]) {
            extDic = [NSMutableDictionary dictionaryWithDictionary:loginData[@"ext"]];
        }
        
        if ([extDic valueForKey:@"phone"]) {
            [extDic removeObjectForKey:@"phone"];
        }
        
        [loginData setValue:extDic forKey:@"ext"];
        
        [RXUserUtility sharedManager].loginData = loginData;
        
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"解除绑定手机失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 解绑手机
 * @param captchaCode 验证码
 * @param phone 手机号
 */
- (void)unBindPhoneWithCaptchaCode:(NSString *)captchaCode
                             phone:(NSString *)phone
                          complete:(RequestComplete)complete
{
    [self reliveBindingPhoneWithCaptchaCode:captchaCode phone:phone complete:complete];
}

// 修改手机号
- (void)changePhoneWithOldphone_captcha:(NSString *)oldphone_captcha
                               newphone:(NSString *)newphone
                       newphone_captcha:(NSString *)newphone_captcha
                           migrate_args:(id _Nullable)migrate_args
                               complete:(RequestComplete)complete
{
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:oldphone_captcha forKey:@"oldphone_captcha"];
    [dic setValue:newphone forKey:@"newphone"];
    [dic setValue:newphone_captcha forKey:@"newphone_captcha"];
    [dic setValue:migrate_args forKey:@"migrate_args"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/change_phone" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"修改手机号成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"修改手机号失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

// 获取用户信息
- (void)changePhoneWithOldPhoneCaptcha:(NSString *)oldPhoneCaptcha
                              newphone:(NSString *)newphone
                       newPhoneCaptcha:(NSString *)newphone_captcha
                           migrateArgs:(id _Nullable)migrateArgs
                              complete:(RequestComplete)complete
{
    [self changePhoneWithOldphone_captcha:oldPhoneCaptcha newphone:newphone newphone_captcha:newphone_captcha migrate_args:migrateArgs complete:complete];
}

// 获取用户信息
- (void)getUserInfoWithComplete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_method] forKey:@"method"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"openid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/get_info" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取用户信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取用户信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

// 获取指定用户信息
- (void)getUserInfoByFieldWithParams:(NSDictionary *)params
                            complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:params ?: @{}];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/info_by_field" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取指定用户信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取指定用户信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

// 修改用户信息
- (void)updateUserInfoWithAvatarUrl:(NSString *)avatarUrl
                           nickname:(NSString *)nickname
                                sex:(NSString *)sex
                        w_avatarurl:(NSString *)w_avatarurl
                           complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:avatarUrl].length > 0) {
        [dic setValue:avatarUrl forKey:@"avatarUrl"];
    }
    if ([NSString rx_isNullToString:nickname].length > 0) {
        [dic setValue:nickname forKey:@"nickname"];
    }
    if ([NSString rx_isNullToString:sex].length > 0) {
        [dic setValue:@([sex integerValue]) forKey:@"sex"];
    }
    if ([NSString rx_isNullToString:w_avatarurl].length > 0) {
        [dic setValue:w_avatarurl forKey:@"wechat_avatarurl"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/update_info" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"修改用户信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"修改用户信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 修改用户信息
 * @param avatarUrl 头像url 非必传
 * @param nickname 用户昵称 非必传
 * @param sex 性别 1男 0女 非必传
 * @param region 地区码 非必传
 */
- (void)updateUserInfo:(NSString *)avatarUrl
              nickname:(NSString *)nickname
                   sex:(NSString *)sex
                region:(NSString *)region
                   ext:(NSDictionary *)ext
              complete:(RequestComplete)complete
{
    [self updateUserInfoPrivate:avatarUrl nickname:nickname sex:sex region:region ext:ext complete:complete];
}

- (void)updateUserInfo:(NSString *)avatarUrl
              nickname:(NSString *)nickname
                   sex:(NSString *)sex
                region:(NSString *)region
              complete:(RequestComplete)complete
{
    [self updateUserInfoPrivate:avatarUrl nickname:nickname sex:sex region:region ext:nil complete:complete];
}

- (void)updateUserInfoPrivate:(NSString *)avatarUrl
                     nickname:(NSString *)nickname
                          sex:(NSString *)sex
                       region:(NSString *)region
                          ext:(NSDictionary *)ext
                     complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:avatarUrl].length > 0) {
        [dic setValue:avatarUrl forKey:@"avatarUrl"];
    }
    if ([NSString rx_isNullToString:nickname].length > 0) {
        [dic setValue:nickname forKey:@"nickname"];
    }
    if ([NSString rx_isNullToString:sex].length > 0) {
        [dic setValue:@([sex integerValue]) forKey:@"sex"];
    }
    if ([NSString rx_isNullToString:region].length > 0) {
        [dic setValue:region forKey:@"region"];
    }
    if ([ext isKindOfClass:[NSDictionary class]] && ext.allKeys.count > 0) {
        [dic setValue:ext forKey:@"ext"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/update_info" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"修改用户信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"修改用户信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

// 修改密码
- (void)updatePasswordWithOldPwd:(NSString *)oldPwd
                          newPwd:(NSString *)newPwd
                        complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXCommonTool md532BitUpperWithStr:newPwd] forKey:@"new_password"];
//    [dic setValue:[RXCommonTool md532BitUpperWithStr:oldPwd] forKey:@"old_password"];
    
    NSMutableDictionary *oldDic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:oldPwd].length > 0) {
        [oldDic setValue:[RXCommonTool md532BitUpperWithStr:oldPwd] forKey:@"old_password"];
    } else {
        [oldDic setValue:@"" forKey:@"old_password"];
    }
    
    [dic setValue:oldDic forKey:@"by_oldpassword"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/change_password" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
//    if (![RXCommonTool checkPasswordWithPwd:oldPwd] && [NSString rx_isNullToString:oldPwd].length > 0) {
//        RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
//        NSDictionary *errorRes = @{@"code" : @(RXLoginError_passwordRuleFail),
//                                   @"msg" : [RXErrorTool getRXErrorMsg:RXLoginError_passwordRuleFail]
//        };
//        error.responesObject = errorRes;
//        if (complete) {
//            complete(nil, error);
//        }
//        return;
//    }
    if (![RXCommonTool checkPasswordWithPwd:newPwd]) {
        RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
        NSDictionary *errorRes = @{@"code" : @(RXLoginError_passwordRuleFail),
                                   @"msg" : [RXErrorTool getRXErrorMsg:RXLoginError_passwordRuleFail]
        };
        error.responesObject = errorRes;
        
        if (error != nil) {
            error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
        }
        
        if (complete) {
            complete(nil, error);
        }
        return;
    }
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        [[NSNotificationCenter defaultCenter] postNotificationName:noti_passwordChange object:nil userInfo:@{@"password" : newPwd}];
        NSLog(@"修改密码成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"修改密码失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 修改密码
 * @param oldPwd 旧密码
 * @param newPwd 新密码
 */
- (void)changePasswordWithNewPwd:(NSString *)newPwd
                          oldPwd:(NSString *)oldPwd
                        complete:(RequestComplete)complete
{
    [self updatePasswordWithOldPwd:oldPwd newPwd:newPwd complete:complete];
}

// 重置密码
- (void)resetPasswordWithUsername:(NSString *)username
                         password:(NSString *)password
                      captchaCode:(NSString *)captchaCode
                     migrate_args:(id _Nullable)migrate_args
                         complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:username forKey:@"username"];
    [dic setValue:[RXCommonTool md532BitUpperWithStr:password] forKey:@"password"];
    [dic setValue:captchaCode forKey:@"captcha_code"];
    [dic setValue:migrate_args forKey:@"migrate_args"];
    
    if (![RXCommonTool checkPasswordWithPwd:password]) {
        RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
        NSDictionary *errorRes = @{@"code" : @(RXLoginError_passwordRuleFail),
                                   @"msg" : [RXErrorTool getRXErrorMsg:RXLoginError_passwordRuleFail]
        };
        error.responesObject = errorRes;
        
        if (error != nil) {
            error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
        }
        
        if (complete) {
            complete(nil, error);
        }
        return;
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/account/reset_password" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    if (![RXCommonTool checkPasswordWithPwd:password]) {
        RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
        NSDictionary *errorRes = @{@"code" : @(RXLoginError_passwordRuleFail),
                                   @"msg" : [RXErrorTool getRXErrorMsg:RXLoginError_passwordRuleFail]
        };
        error.responesObject = errorRes;
        
        if (error != nil) {
            error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
        }
        
        if (complete) {
            complete(nil, error);
        }
        return;
    }
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"重置密码成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"重置密码失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 重置密码
 * @param username 用户名
 * @param password 密码
 * @param captchaCode 验证码
 * @param migrateArgs 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)resetPasswordWithUsername:(NSString *)username
                         password:(NSString *)password
                      captchaCode:(NSString *)captchaCode
                      migrateArgs:(id _Nullable)migrateArgs
                         complete:(RequestComplete)complete
{
    [self resetPasswordWithUsername:username password:password captchaCode:captchaCode migrate_args:migrateArgs complete:complete];
}

/**
 * 注册
 * @param username 账号注册为账号，手机注册为手机号，邮箱注册为邮箱  必须
 * @param password 密码  必须
 * @param captchaCode 验证码  手机或邮箱注册为必须，账号注册非必须
 * @param ext 扩展字段
 * ！ext参数说明：
 * ！nickname 昵称  非必须    #NSString类型
 * ！avatarUrl 头像地址  非必须    #NSString类型
 * ！sex 性别,1:男,0:女  非必须    #NSString类型
 * ！migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)registWithUsername:(NSString *)username
                  password:(NSString *)password
               captchaCode:(NSString * _Nullable)captchaCode
                       ext:(NSDictionary * _Nullable)ext
                  complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableDictionary *adDic = [RXCommonTool getAdInfo];
    NSMutableDictionary *extDic1 = [NSMutableDictionary dictionaryWithDictionary:ext];
    
    if (![RXUserUtility valueForKey:keyUserData_isFirstLogin]) {
        NSMutableDictionary *deviceDic = [NSMutableDictionary dictionary];
        [deviceDic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
        [deviceDic setValue:[RXCommonTool getIDFV] forKey:@"idfv"];
        [deviceDic setValue:[RXCommonTool getBundleID] forKey:@"package_name"];
        
        [deviceDic setValue:[RXUserUtility valueForKey:keyUserData_cids] forKey:@"cid"];
        
        NSMutableDictionary *sourceAd = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_activityDevice]];
        NSString *user_agent = sourceAd[@"user_agent"];
        NSString *user_agent1 = sourceAd[@"user_agent1"];
        NSString *user_agent2 = sourceAd[@"user_agent2"];
        
        if ([NSString rx_isNullToString:user_agent].length > 0) {
            [deviceDic setValue:user_agent forKey:@"user_agent"];
        } else {
            [deviceDic setValue:[RXUserUtility valueForKey:keyUserData_ua] forKey:@"user_agent"];
        }
        
        if ([NSString rx_isNullToString:user_agent1].length > 0) {
            [deviceDic setValue:user_agent1 forKey:@"user_agent1"];
        }
        
        if ([NSString rx_isNullToString:user_agent2].length > 0) {
            [deviceDic setValue:user_agent2 forKey:@"user_agent2"];
        }
        
        NSString *ip1 = [RXUserUtility valueForKey:keyUserData_ipv4];
        if ([NSString rx_isNullToString:ip1].length > 0) {
            [deviceDic setValue:ip1 forKey:@"ipv4"];
        }
        
        [dic setValue:deviceDic forKey:@"device"];
        [dic setValue:[RXUserUtility valueForKey:keyUserData_distinct_id] forKey:@"distinct_id"];
        
        NSMutableDictionary *activateDic = [NSMutableDictionary dictionary];
        NSDictionary *activateResult = (NSDictionary *)[RXUserUtility valueForKey:keyUserData_activity];
        if (activateResult) {
            [activateDic setValue:[RXUserUtility valueForKey:keyUserData_activity] forKey:@"result"];
            [dic setValue:activateDic forKey:@"activate"];
        } else {
            NSMutableDictionary *adDic = [RXCommonTool getAdInfo];
            NSMutableDictionary *sourceAdDic = [NSMutableDictionary dictionary];
            if (adDic.allKeys.count > 0 && [adDic.allKeys[0] isEqualToString:@"ad"]) {
                if (adDic[@"ad"] && [adDic[@"ad"] isKindOfClass:[NSDictionary class]]) {
                    NSDictionary *ad = adDic[@"ad"];
                    for (int i = 0; i < ad.allKeys.count; i++) {
                        [sourceAdDic setValue:ad.allValues[i] forKey:ad.allKeys[i]];
                    }
                }
            }
            [activateDic setValue:sourceAdDic forKey:@"args"];
            [dic setValue:activateDic forKey:@"activate"];
        }
    } else {
        NSString *needContinue = extDic1[@"needContinue"];
        if ([RXUserUtility sharedManager].isOpenAdSwitch) {
            if (![needContinue isEqualToString:@"1"]) {
                [CHCid getCidWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                    if (!error) {
                        [extDic1 setValue:response[@"data"] forKey:@"cid"];
                    } else {
                        
                    }
                    
                    [extDic1 setValue:@"1" forKey:@"needContinue"];
                    [extDic1 setValue:response[@"data"] forKey:@"cid"];
                    
                    [self registWithUsername:username password:password captchaCode:captchaCode ext:extDic1 complete:complete];
                }];
                return;
            }
            NSMutableDictionary *deviceDic = [NSMutableDictionary dictionary];
            [deviceDic setValue:[RXCommonTool getIDFA] forKey:@"idfa"];
            [deviceDic setValue:[RXCommonTool getIDFV] forKey:@"idfv"];
            [deviceDic setValue:[RXCommonTool getBundleID] forKey:@"package_name"];
            [deviceDic setValue:extDic1[@"cid"] forKey:@"cid"];
            
            [extDic1 removeObjectForKey:@"cid"];
            [extDic1 removeObjectForKey:@"needContinue"];
            
            NSMutableDictionary *sourceAd = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_activityDevice]];
            NSString *user_agent = sourceAd[@"user_agent"];
            NSString *user_agent1 = sourceAd[@"user_agent1"];
            NSString *user_agent2 = sourceAd[@"user_agent2"];
            
            if ([NSString rx_isNullToString:user_agent].length > 0) {
                [deviceDic setValue:user_agent forKey:@"user_agent"];
            } else {
                [deviceDic setValue:[RXUserUtility valueForKey:keyUserData_ua] forKey:@"user_agent"];
            }
            
            if ([NSString rx_isNullToString:user_agent1].length > 0) {
                [deviceDic setValue:user_agent1 forKey:@"user_agent1"];
            }
            
            if ([NSString rx_isNullToString:user_agent2].length > 0) {
                [deviceDic setValue:user_agent2 forKey:@"user_agent2"];
            }
            
            NSString *ip1 = [RXUserUtility valueForKey:keyUserData_ipv4];
            if ([NSString rx_isNullToString:ip1].length > 0) {
                [deviceDic setValue:ip1 forKey:@"ipv4"];
            }
            
            [dic setValue:deviceDic forKey:@"device"];
            
            NSMutableDictionary *activateDic = [NSMutableDictionary dictionary];
            NSDictionary *activateResult = (NSDictionary *)[RXUserUtility valueForKey:keyUserData_activity];
            if (activateResult) {
                [activateDic setValue:[RXUserUtility valueForKey:keyUserData_activity] forKey:@"result"];
                [dic setValue:activateDic forKey:@"activate"];
            } else {
                NSMutableDictionary *adDic = [RXCommonTool getAdInfo];
                NSMutableDictionary *sourceAdDic = [NSMutableDictionary dictionary];
                if (adDic.allKeys.count > 0 && [adDic.allKeys[0] isEqualToString:@"ad"]) {
                    if (adDic[@"ad"] && [adDic[@"ad"] isKindOfClass:[NSDictionary class]]) {
                        NSDictionary *ad = adDic[@"ad"];
                        for (int i = 0; i < ad.allKeys.count; i++) {
                            [sourceAdDic setValue:ad.allValues[i] forKey:ad.allKeys[i]];
                        }
                    }
                }
                [activateDic setValue:sourceAdDic forKey:@"args"];
                [dic setValue:activateDic forKey:@"activate"];
            }
        }
    }

    // 传入子渠道
    NSString *subChannelId = [RXUserUtility sharedManager].subChannelId;
    NSMutableDictionary *subPackage = [NSMutableDictionary dictionary];
    [subPackage setValue:subChannelId forKey:@"sub_channel_id"];
    if ([NSString rx_isNullToString:subChannelId].length > 0) {
        NSMutableDictionary *user_source = [NSMutableDictionary dictionary];
        [user_source setValue:subPackage forKey:@"sub_package"];
        [dic setValue:user_source forKey:@"user_source"];
    }
    
    // 设置大数据用户属性，仅对本次登录新注册的用户有效，优先取客户端传入数据
    NSDictionary *user_attrs = extDic1[@"user_attrs"];
    if (user_attrs && [user_attrs isKindOfClass:[NSDictionary class]] && user_attrs.allKeys.count > 0) {
        [dic setValue:user_attrs forKey:@"user_attrs"];
        if (adDic && adDic.allKeys.count > 0) {
            [dic setValue:adDic forKey:@"user_source"];
        }
    } else {
        if (adDic.allKeys.count > 0) {
            if ([adDic.allKeys[0] isEqualToString:@"attr"]) {
                if (adDic[@"attr"] && [adDic[@"attr"] isKindOfClass:[NSDictionary class]]) {
                    NSDictionary *attrs = adDic[@"attr"];
                    NSMutableDictionary *attrsDic = [NSMutableDictionary dictionary];
                    for (int i = 0; i < attrs.allKeys.count; i++) {
                        [attrsDic setValue:attrs.allValues[i] forKey:attrs.allKeys[i]];
                    }
                    [dic setValue:attrsDic forKey:@"user_attrs"];
                }
            } else {
                if (adDic && adDic.allKeys.count > 0) {
                    [dic setValue:adDic forKey:@"user_source"];
                }
            }
        }
    }
    
    if ([NSString rx_isNullToString:[RXCommonTool getTaskid]].length > 0) {
        NSMutableDictionary *user_sourceDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"user_source"]];
        if (user_sourceDic && user_sourceDic.allKeys.count > 0) {
            NSMutableDictionary *pushInfoDic = [NSMutableDictionary dictionary];
            [pushInfoDic setValue:[RXCommonTool getTaskid] forKey:@"taskid"];
            [user_sourceDic setValue:pushInfoDic forKey:@"push"];
        } else {
            user_sourceDic = [NSMutableDictionary dictionary];
            NSMutableDictionary *pushInfoDic = [NSMutableDictionary dictionary];
            [pushInfoDic setValue:[RXCommonTool getTaskid] forKey:@"taskid"];
            [user_sourceDic setValue:pushInfoDic forKey:@"push"];
        }
        [dic setValue:user_sourceDic forKey:@"user_source"];
    }
    
    [dic setValue:username forKey:@"username"];
    [dic setValue:[RXCommonTool md532BitUpperWithStr:password] forKey:@"password"];
    [dic setValue:captchaCode forKey:@"captcha_code"];
    
    for (int i = 0; i < extDic1.allKeys.count; i++) {
        [dic setValue:extDic1.allValues[i] forKey:extDic1.allKeys[i]];
    }
    
    [dic setValue:extDic1[@"nickname"] forKey:@"nickname"];
    [dic setValue:extDic1[@"avatarUrl"] forKey:@"avatarUrl"];
//    [dic setValue:[CHCid getCCountryCode] forKey:@"country"];
    
    NSString *sex = extDic1[@"sex"];
    if (sex && sex.length > 0) {
        [dic setValue:@([sex integerValue]) forKey:@"sex"];
    }
    [dic setValue:extDic1[@"migrate_args"] forKey:@"migrate_args"];
    
    //设置大数据上报设备型号、设备网络状态
    BOOL mod = [RXUserUtility boolForKey:keyUserData_uploadMod];
    if (mod) {
        NSMutableDictionary *deviceInfoDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"device"]];
        [deviceInfoDic setValue:[RXCommonTool rxGetiPhoneDeviceType] forKey:@"model"];
        [dic setValue:deviceInfoDic forKey:@"device"];
    }
    BOOL net = [RXUserUtility boolForKey:keyUserData_uploadNet];
    if (net) {
        NSMutableDictionary *deviceInfoDic = [NSMutableDictionary dictionaryWithDictionary:dic[@"device"]];
        [deviceInfoDic setValue:[RXCommonTool rxGetNetworkStatus] forKey:@"network_standard"];
        [dic setValue:deviceInfoDic forKey:@"device"];
    }
    
    // 是否有自定义透传参数
    if ([extDic1 valueForKey:@"custom_ext"]) {
        
        NSMutableDictionary *customExt = [NSMutableDictionary dictionaryWithDictionary:[extDic1 valueForKey:@"custom_ext"]];
        if ([customExt isKindOfClass:[NSDictionary class]] && customExt.allKeys.count > 0) {
            [dic setValue:customExt forKey:@"custom_ext"];
        }
        
        [extDic1 removeObjectForKey:@"custom_ext"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/account/register" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    if (![RXCommonTool checkPasswordWithPwd:password]) {
        RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
        NSDictionary *errorRes = @{@"code" : @(RXLoginError_passwordRuleFail),
                                   @"msg" : [RXErrorTool getRXErrorMsg:RXLoginError_passwordRuleFail]
        };
        error.responesObject = errorRes;
        
        if (error != nil) {
            error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
        }
        
        if (complete) {
            complete(nil, error);
        }
        return;
    }
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        [RXUserUtility sharedManager].password = password;
        NSLog(@"注册成功:\n %@", responseObject);
        
        [[RXLogManager sharedSDK] addRegisterLogWithErrorInfo:nil];
        
        [RXUserUtility setBool:YES ForKey:keyUserData_isFirstLogin];
        
        NSDictionary *model = (NSDictionary *)responseObject[@"data"];
        [RXUserUtility setValue:model[@"openid"] ForKey:keyUserData_openId];
        
        [[RXAdManger sharedSDK] reportAdjustRegistEvent];
        // 上报广点通注册
        NSString *reportMethod = model[@"method"];
        [[RXGDTManager sharedSDK] registerGDT:reportMethod];
        
        //上报新注册用户的邮箱或电话，判断如果是邮箱和电话号码直接上报
        if (username.length > 0) {
            [[RXAdManger sharedSDK] reportRegisterEmailOrPhoneNumber:username];
        }
        
        // 上报UWA获取的用户属性
        NSString *uwaKey = [NSString stringWithFormat:@"uwa_%@", [[RXService sharedSDK] getOpenID]];
        NSDictionary *uwaUserProperty = [RXUserUtility valueForKey:uwaKey];
        if (uwaUserProperty) {//本地存在则对比是否有不同，如有不同之处则仅上报不同之处，否则不上传
            NSDictionary *differentUserProDic = [[RXUWAService sharedSDK] getUwaInfoCompareWithDict:[RXUserUtility sharedManager].uwaPropertyDic];;
            if ([differentUserProDic allKeys].count > 0) {
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"uwa_gpm" properties:differentUserProDic];
            }
        }else{//本地不存在，则存储本地一份，然后上报
            if ([RXUserUtility sharedManager].uwaPropertyDic) {
                [RXUserUtility setValue:[RXUserUtility sharedManager].uwaPropertyDic ForKey:uwaKey];
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"uwa_gpm" properties:[RXUserUtility sharedManager].uwaPropertyDic];
            }
            
        }
        
        // 上报gpm sdk获取的用户属性
        NSString *sdkkey = [NSString stringWithFormat:@"sdk_%@", [[RXService sharedSDK] getOpenID]];
        NSDictionary *sdkUserProperty = [RXUserUtility valueForKey:sdkkey];
        if (sdkUserProperty) {
            NSDictionary *differentUserProDic = [[RXUWAService sharedSDK] getSDKInfoCompareWithDict:[RXUserUtility sharedManager].sdkPropertyDic];;
            if ([differentUserProDic allKeys].count > 0) {
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"rx_gpm" properties:differentUserProDic];
            }
        }else{
            if ([RXUserUtility sharedManager].sdkPropertyDic) {
                [RXUserUtility setValue:[RXUserUtility sharedManager].sdkPropertyDic ForKey:sdkkey];
                [[RXCommonManager sharedSDK] reportUserSetWithAction:@"rx_gpm" properties:[RXUserUtility sharedManager].sdkPropertyDic];
            }
        }
        
        // 上报注册事件
        [[RXBDAManager sharedSDK] trackEssentialEventWithNameWithEvent:@"register" params:@{}];
        
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"注册失败:\n %@", error.error);
        
        [[RXLogManager sharedSDK] addRegisterLogWithErrorInfo:error.responesObject];
        
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 注册
 * @param username 账号注册为账号，手机注册为手机号，邮箱注册为邮箱  必须
 * @param password 密码  必须
 * @param captchaCode 验证码  手机或邮箱注册为必须，账号注册非必须
 * @param ext 扩展字段
 * ！ext参数说明：
 * ！nickname 昵称  非必须    #NSString类型
 * ！avatarUrl 头像地址  非必须    #NSString类型
 * ！sex 性别,1:男,0:女  非必须    #NSString类型
 * ！migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)registerWithUsername:(NSString * _Nullable)username
                    password:(NSString * _Nullable)password
                 captchaCode:(NSString * _Nullable)captchaCode
                         ext:(NSDictionary * _Nullable)ext
                    complete:(RequestComplete)complete;
{
    [self registWithUsername:username password:password captchaCode:captchaCode ext:ext complete:complete];
}

// 实名认证
- (void)approveWithRealName:(NSString *)realName
                     idCard:(NSString *)idCard
                 isFastAuth:(BOOL)isFastAuth
                   complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:realName forKey:@"realname"];
    [dic setValue:idCard forKey:@"idcard"];
    if (isFastAuth) {
        [dic setValue:@(1) forKey:@"is_fast_auth"];
    } else {
        [dic setValue:@(0) forKey:@"is_fast_auth"];
    }
    
    
    NSString *url = [NSString stringWithFormat:@"v1/passport/user/realauth?openid=%@", [RXUserUtility valueForKey:keyUserData_openId]];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        [self updateRealAuthInfoWithResponse:responseObject];
        NSLog(@"实名认证成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"实名认证失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

- (void)updateRealAuthInfoWithResponse:(NSDictionary *)responseObject
{
    NSDictionary *dic = responseObject[@"data"];
    [RXUserUtility sharedManager].age = [[NSString stringWithFormat:@"%@", dic[@"age"]] integerValue];
    
    NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].loginData];
    [loginData setValue:@([RXUserUtility sharedManager].age) forKey:@"age"];
    
    [RXUserUtility sharedManager].loginData = loginData;
}

// 实名认证
- (void)realAuthWithRealName:(NSString *)realName
                      idCard:(NSString *)idCard
                  isFastAuth:(BOOL)isFastAuth
                    complete:(RequestComplete)complete
{
    [self approveWithRealName:realName idCard:idCard isFastAuth:isFastAuth complete:complete];
}

// 实名认证
- (void)realAuthWithRealName:(NSString *)realName
                      idCard:(NSString *)idCard
                    complete:(RequestComplete)complete
{
    [self approveWithRealName:realName idCard:idCard isFastAuth:NO complete:complete];
}

// 获取 IIFAA 支付宝授权跳转地址（快速实名）
- (void)getIIFAARedirectURLWithAppName:(NSString *)appName
                       thirdPartSchema:(NSString *)thirdPartSchema
                              complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if (![thirdPartSchema isKindOfClass:[NSString class]] || thirdPartSchema.length <= 0) {
        thirdPartSchema = [RXUserUtility valueForKey:keyUserData_iifaaScheme];
    }
    if (![thirdPartSchema isKindOfClass:[NSString class]]) {
        thirdPartSchema = @"";
    }
    [dic setValue:appName forKey:@"app_name"];
    [dic setValue:thirdPartSchema forKey:@"third_part_schema"];
    [dic setValue:@"IIFAA_CREDENTIALS_WEILEGAME_ALIPAYUSER" forKey:@"scene_code"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/cgosdk/sdk/auth/iifaa/redirect_url" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

- (void)getIIFAAResult:(RequestComplete)complete
{
    [self getIIFAAResultWithSource:@"" retryCount:RXIIFAAResultDefaultRetryCount complete:complete];
}

- (void)getIIFAAResultWithRetryCount:(NSInteger)retryCount
                            complete:(RequestComplete)complete
{
    [self getIIFAAResultWithSource:@"" retryCount:retryCount complete:complete];
}

- (void)getIIFAAResultWithSource:(NSString *)source
                      retryCount:(NSInteger)retryCount
                        complete:(RequestComplete)complete
{
    NSInteger maxRetryCount = MAX(0, retryCount);
    [self getIIFAAResultWithSource:source retryCount:maxRetryCount retriedCount:0 complete:complete];
}

- (void)getIIFAAResultWithSource:(NSString *)source
                      retryCount:(NSInteger)retryCount
                    retriedCount:(NSInteger)retriedCount
                        complete:(RequestComplete)complete
{
    NSMutableDictionary *params = nil;
    // source 为空时走正常认证逻辑，deregister 表示注销场景
    if ([source isKindOfClass:[NSString class]] && source.length > 0) {
        params = [NSMutableDictionary dictionary];
        [params setValue:source forKey:@"source"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/cgosdk/sdk/auth/iifaa/validate_by_bizid" andParams:params requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        [self updateRealAuthInfoWithResponse:responseObject];
        NSLog(@"IIFAA认证结果查询成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"IIFAA认证结果查询失败:\n %@", error.error);
        
        NSInteger errorCode = [[error.responesObject valueForKey:@"code"] integerValue];
        if (errorCode == RXIIFAAResultRetryErrorCode && retriedCount < retryCount) {
            [self getIIFAAResultWithSource:source retryCount:retryCount retriedCount:retriedCount + 1 complete:complete];
            return;
        }
        
        if (complete) {
            complete(nil, error);
        }
    }];
}

// 查询用户拥有的账号
- (void)searchHasAccountsWithMethod:(NSString *)method
                         devicecode:(NSString *)devicecode
                             states:(NSInteger)states
                           complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    NSMutableDictionary *by_devicecode = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:devicecode]) {
        [by_devicecode setValue:devicecode forKey:@"devicecode"];
    } else {
        [by_devicecode setValue:[DeviceKey getDeviceIDInKeychain] forKey:@"devicecode"];
    }
    [by_devicecode setValue:method forKey:@"method"];
    [by_devicecode setValue:@(states) forKey:@"states"];
    [dic setValue:by_devicecode forKey:@"by_devicecode"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/query" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"查询用户拥有的账号成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"查询用户拥有的账号失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

// 查询当前用户绑定的手机/邮箱账号
- (void)searchBindingAccounts:(RequestComplete)complete
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/bound_accounts" andParams:nil requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"查询当前用户绑定的手机/邮箱账号成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"查询当前用户绑定的手机/邮箱账号失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 媒体平台自定义行为上报
 * @param params 上报数据
 * ！params 参数说明：
 * ！action 自定义行为
 */
- (void)addAttributionWithParams:(NSDictionary *)params
                        complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:params];
    
    if (!params[@"open_id"]) {
        [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"open_id"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/attribution/user/custom_action" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"媒体平台自定义行为上报成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"媒体平台自定义行为上报失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 同步三方授权信息
 * @param params 与登录的ext结构相同
 */
- (void)syncInfoWithParams:(NSDictionary *)params
                  complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:params];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/passport/user/sync_app_info" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"同步三方授权信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"同步三方授权信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

// 获取设备码
- (NSString *)getDeviceIDInKeychain
{
    return [DeviceKey getDeviceIDInKeychain];
}

/**
 * 获取设备码
 */
- (NSString *)getDeviceCode
{
    return [DeviceKey getDeviceIDInKeychain];
}

// 取当前时区与UTC时差
- (NSString *)getTimeZoneOffset
{
    [NSTimeZone resetSystemTimeZone];
    // 获取当前时区
    NSTimeZone *zone = [NSTimeZone systemTimeZone];
    CGFloat offset = zone.secondsFromGMT;

    offset = offset/3600.0;

    NSString *tzStr = [NSString stringWithFormat:@"%.2f", (CGFloat)offset];
//    if (offset < 0) {
//        tzStr = [NSString stringWithFormat:@"-%@", tzStr];
//    }
    
    return tzStr;
}

/**
 * 获取当前手机语言
 */
- (NSString *)getSystemLanguage
{
    NSArray *languageArr = [RXCommonTool getLanguageCountry];
    NSString *language = languageArr[0];
    if (languageArr.count > 1) {
        NSArray *compareLan = [[languageArr[0] description] componentsSeparatedByString:@"-"];
        if (compareLan.count > 1) {
            language = [NSString stringWithFormat:@"%@-%@", compareLan[0], languageArr[1]];
        }
    }
    if (!language) {
        language = @"zh-CN";
    }
    return language;
}

/**
 * 刷新token
 */
- (void)refreshTokenWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete
{
    // token有效期
    NSInteger accessExpire = [[RXUserUtility valueForKey:keyUserData_accessExpire] integerValue];
    // 上次登录或刷新token的时间
    NSInteger getAccessTimeStamp = [[RXUserUtility valueForKey:keyUserData_refreshTime] integerValue];
    
    // 上次获取和现在的时间差（秒）
    NSInteger time = [self beginTimestamp:getAccessTimeStamp];
    // 有效期剩余时间（秒）
    NSInteger reTime = accessExpire - time;
    
    // 剩余有效期小于10分钟刷新
    if ((reTime / 60) <= 10) {
        [RXLoginManager refreshTokenWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (complete) {
                complete(response, error);
            }
        }];
    } else {
        if (complete) {
            RX_CommonRequestError *rxErr = [[RX_CommonRequestError alloc] init];
            rxErr.responesObject = @{@"code" : @(-1)};
            complete(nil, rxErr);
        }
    }
}

// 获取时间差
- (NSInteger)beginTimestamp:(NSInteger)startTime
{
    NSTimeInterval timeInterval = startTime/1000;
    NSDate *detailDate = [NSDate dateWithTimeIntervalSince1970:timeInterval];
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    // 实例化一个NSDateFormatter对象，设定时间格式，这里可以设置成自己需要的格式
    [dateFormatter setDateFormat:@"yyyy-MM-dd"];
    NSString *dateStr = [dateFormatter stringFromDate:detailDate];

    NSInteger i = detailDate.timeIntervalSinceNow;
    return labs(i);
}

/**
 * 获取idfa
 */
+ (NSString *)getIDFA{
    return [RXCommonTool getIDFA];
}

/**
 * 请求福利码
 * autoRefresh 是否自动刷新，YES自动刷新并返回福利码，NO不自动刷新
 */
- (void)getPromoDisplayKeyWithAutoRefresh:(BOOL)autoRefresh complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete{
    [[RXWelfareCodeManager sharedSDK] getPromoDisplayKeyWithAutoRefresh:autoRefresh complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (response != nil) {
            if ([response[@"code"] integerValue] == 0) {
                if (complete) {
                    complete(response, nil);
                }
            }else{
                if (complete) {
                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                    err.responesObject = response;
                    complete(nil, err);
                }
            }
        }else{
            if (complete) {
                complete(nil, error);
            }
        }
        
    }];
}

/**
 * 获取福利码
 */
- (void)exchangePromoCDKEY:(NSString *)cdkey complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete{
    [[RXWelfareCodeManager sharedSDK] exchangePromoCDKEY:cdkey complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error == nil) {
            complete(response, nil);
        }else{
            complete(nil, error);
        }
    }];
}

/**
 * 获取公告列表
 * limit 返回条数
 */
- (void)getAnnouncementWithLimit:(int)limit complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete
{
    NSString *productId = [RXUserUtility valueForKey:keyUserData_productId];
    NSString *channelId = [RXUserUtility valueForKey:keyUserData_channelId];
    NSString *url = [NSString stringWithFormat:@"/v1/operationtoolsapi/maintain/get?limit=%d&product_id=%@&channel_id=%@", limit, productId, channelId];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 保存全量公告数据以及本地是否已读未读记录
 */
- (void)getLocalAnnouncementAndSetReadOrNotRecord{
    [[RXApiService sharedSDK] getAnnouncementWithLimit:100 complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error == nil) {
            [RXUserUtility sharedManager].announceArray = response[@"data"];//获取全量公告
            NSMutableDictionary *mDict = [NSMutableDictionary dictionaryWithDictionary:[[RXApiService sharedSDK] getLocalAnnouncementReadList]];
            for (NSDictionary *dict in [RXUserUtility sharedManager].announceArray) {//记录新公告的已读/未读记录
                NSString *announceIdKey = [dict[@"id"] stringValue];
                if (![[mDict allKeys] containsObject:announceIdKey]) {
                    [mDict setValue:@(NO) forKey:announceIdKey];
                }
            }
            //获取最新全量公告id集合
            NSMutableArray *announceIDArray = [NSMutableArray array];
            for (NSDictionary *idDict in [RXUserUtility sharedManager].announceArray) {
                [announceIDArray addObject:[idDict[@"id"] stringValue]];
            }
            //根据最新全量公告id集合，剔除本地的旧公告已读未读数据，只保留新的
            for (NSString *idStr in [mDict allKeys]) {
                if (![announceIDArray containsObject:idStr]) {
                    [mDict removeObjectForKey:idStr];
                }
            }
            [[RXApiService sharedSDK] syncLocalAnnouncementRecord:mDict];
        }else{
            NSLog(@"%@",error.responesObject);
        }
    }];
}

//获取当前本地的全量公告
- (NSArray *)getLocalAnnouncement{
    NSArray *announcementArray = [RXUserUtility sharedManager].announceArray;
    return announcementArray;
}

//获取本地公告是否已读记录
- (NSDictionary *)getLocalAnnouncementReadList{
    NSData *data = [RXUserUtility valueForKey:keyUserData_announce_list];
    NSDictionary *readDic = [NSKeyedUnarchiver unarchiveObjectWithData:data];
    return readDic;
}

//同步公告是否已读记录到本地
- (void)syncLocalAnnouncementRecord:(NSDictionary *)dict{
    NSData *data = [NSKeyedArchiver archivedDataWithRootObject:dict];
    [RXUserUtility setValue:data ForKey:keyUserData_announce_list];
}

/**
 * 获取邮箱列表
 * cpUserID 游戏角色id
 */
- (void)getEmailListWithCpUserID:(NSString *)cpUserID complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete{
    NSMutableDictionary *paramDict = [NSMutableDictionary dictionary];
    [paramDict setValue:cpUserID forKey:@"cp_user_id"];

    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/operationtoolsapi/rxmail/cpuser/list" andParams:paramDict requsetMethod:RequestMethod_Post];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];

    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取邮箱详情
 * cpUserID 游戏用户id
 * emailID 邮件id
 */
- (void)getEmailDetailWithCpUserID:(NSString *)cpUserID emailID:(NSInteger)emailID complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete{
    NSMutableDictionary *paramDict = [NSMutableDictionary dictionary];
    [paramDict setValue:cpUserID forKey:@"cp_user_id"];
    [paramDict setValue:@(emailID) forKey:@"rx_mail_id"];

    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/operationtoolsapi/rxmail/cpuser/detail" andParams:paramDict requsetMethod:RequestMethod_Post];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];

    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 领取道具
 * cpUserID 游戏用户id
 * type 传1为领取当前礼物，需要同时传emailID；传2，为一键领取所有礼物，无需传emailID，或传0即可
 * emailID 邮箱id
 */
- (void)receivePropsWithCpUserID:(NSString *)cpUserID type:(NSInteger)type emailID:(NSInteger)emailID complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete{
    NSMutableDictionary *paramDict = [NSMutableDictionary dictionary];
    [paramDict setValue:cpUserID forKey:@"cp_user_id"];
    [paramDict setValue:@(type) forKey:@"type"];
    [paramDict setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
    if (type == 1) {
        [paramDict setValue:@(emailID) forKey:@"rx_mail_id"];
    }

    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/operationtoolsapi/rxmail/cpuser/receive" andParams:paramDict requsetMethod:RequestMethod_Post];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];

    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 删除邮件
 * cpUserID 游戏用户id
 * type 传1为删除当前邮件，需要同时传emailID；传2，为一键删除所有邮件，无需传emailID，或传0即可
 * emailID 邮箱id
 */
- (void)deleteEmailWithCpUserID:(NSString *)cpUserID type:(NSInteger)type emailID:(NSInteger)emailID complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete{
    NSMutableDictionary *paramDict = [NSMutableDictionary dictionary];
    [paramDict setValue:cpUserID forKey:@"cp_user_id"];
    [paramDict setValue:@(type) forKey:@"type"];
    if (type == 1) {
        [paramDict setValue:@(emailID) forKey:@"rx_mail_id"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/operationtoolsapi/rxmail/cpuser/delete" andParams:paramDict requsetMethod:RequestMethod_Post];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 创建反馈
 * content 反馈内容，必填
 * attachments 附件地址数组，非必填
 * phone 手机号，必填
 * tags 游戏透传标识
 *
 */
- (void)feedbackCreateWithContent:(NSString *)content attachments:(NSArray *)attachmentsArray phone:(NSString *)phone tags:(NSArray *)tagArray complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete{
    NSMutableDictionary *paramDict = [NSMutableDictionary dictionary];
    [paramDict setValue:content forKey:@"content"];
    if (attachmentsArray.count > 0) {
        [paramDict setValue:attachmentsArray forKey:@"attachments"];
    }
    [paramDict setValue:phone forKey:@"phone"];
    if (tagArray.count > 0) {
        [paramDict setValue:tagArray forKey:@"tags"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/feedbackapi/player_feedback/create" andParams:paramDict requsetMethod:RequestMethod_Post];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取反馈列表
 * page 页数，必填
 * size 每页个数，必填
 * status 状态，1 未处理 2已处理，0为不传，获取所有状态
 */
- (void)getFeedbackListWithPage:(int)page size:(int)size status:(int)status complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete
{
    NSString *url = [NSString stringWithFormat:@"/v1/feedbackapi/player_feedback/list?page=%d&size=%d&status=%d", page, size, status];
    if (status == 0) {
        url = [NSString stringWithFormat:@"/v1/feedbackapi/player_feedback/list?page=%d&size=%d", page, size];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取反馈详情
 * feedbackID 反馈id
 */
- (void)getFeedbackDetailWithFeedbackID:(int)feedbackID complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete
{
    NSString *url = [NSString stringWithFormat:@"/v1/feedbackapi/player_feedback/detail?id=%d", feedbackID];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 领取反馈回复中的道具
 * feedbackID 反馈id
 */
- (void)feedbackGetpropWithFeedbackID:(int)feedbackID complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete{
    NSMutableDictionary *paramDict = [NSMutableDictionary dictionary];
    [paramDict setValue:@(feedbackID) forKey:@"id"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/feedbackapi/player_feedback/getprop" andParams:paramDict requsetMethod:RequestMethod_Post];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 图形验证 UI
 * @param appid 图形验证码 appid
 */
- (void)captchaVerifyUIWithAppid:(NSString *)appid
                        complete:(RequestComplete)complete
{
    NSString *domain = [RXConfig sharedManager].apiDomain;
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
    
    RXCommonWebView *webView = [[RXCommonWebView alloc] initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    webView.params = [NSMutableDictionary dictionaryWithDictionary:@{@"captcha_app_id" : appid}];
//            webView.urlStr = @"http://10.10.2.64:8083/#/captcha";
    webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/captcha", domain];
    [[UIApplication sharedApplication].keyWindow addSubview:webView];
    
    webView.complete = ^(NSDictionary * _Nonnull response) {
        if ([response[@"code"] integerValue] == 0) {
            NSMutableDictionary *res = [NSMutableDictionary dictionary];
            [res setValue:@(0) forKey:@"code"];
            [res setValue:response forKey:@"data"];
            if (complete) {
                complete(res, nil);
            }
        } else {
            if (complete) {
                RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
                
                NSInteger code = [response[@"code"] integerValue];
                if (!response[@"code"]) {
                    code = [response[@"ret"] integerValue];
                }
                NSDictionary *errorRes = @{@"code" : @(code),
                                           @"msg" : response[@"msg"] ? response[@"msg"] : @""
                };
                error.responesObject = errorRes;
                complete(nil, error);
            }
        }
    };
}

/**
 * login_openid 是否失效，YES 失效，NO 有效
 */
- (BOOL)loginOpenidExpireInvalid
{
    BOOL invalid = NO;
    
    // 获取当前时间戳
    long nowTime = (long)[RXCommonTool getTimestamp] / 1000;
    long lastTime = [[RXUserUtility valueForKey:keyUserData_loginSuccessTime] longValue];
    long expire = [[RXUserUtility valueForKey:keyUserData_loginOpenidExpire] longValue];
    
//    NSLog(@"%ld", nowTime - lastTime);
    if (nowTime - lastTime >= expire) {
        invalid = YES;
    }
    
    return invalid;
}

/**
 * 获取商业化窗口信息
 */
- (void)getOperationSceneWithComplete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/operationtoolsapi/user_data_operation_platform/scene/all" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取商业化窗口数据成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取商业化窗口数据失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 商业化信息上报
 */
- (void)reportWindowExposureWithWindowData:(NSDictionary *)windowData
                                  complete:(RequestComplete)complete
{
    [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_business_window distinctId:@"" properties:windowData complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"商业化上报成功:\n %@", response);
            if (complete) {
                complete(response, nil);
            }
        } else {
            NSLog(@"商业化上报失败:\n %@", error.error);
            if (complete) {
                complete(nil, error);
            }
        }
    }];
}

/**
 * 游戏区服信息查询
 * @param areaId 区服 id
 */
- (void)searchGameAreaInfoWithAreaId:(NSString *)areaId
                            complete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] searchGameAreaInfoWithAreaId:areaId complete:complete];
}

/**
 * 游戏区服信息修改
 * @param areaId 区服 id
 * @param areaName 区服名
 * @param areaStatus 区服状态
 * @param areaType 区服类型
 * @param extension 扩展字段
 */
- (void)updateGameAreaInfoWithAreaId:(NSString *)areaId
                            areaName:(NSString *)areaName
                          areaStatus:(NSString *)areaStatus
                            areaType:(NSString *)areaType
                           extension:(NSDictionary *)extension
                            complete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] updateGameAreaInfoWithAreaId:areaId areaName:areaName areaStatus:areaStatus areaType:areaType extension:extension complete:complete];
}

/**
 * 创建游戏区服
 * @param areaId 区服 id
 * @param areaName 区服名
 * @param areaStatus 区服状态
 * @param areaType 区服类型
 * @param extension 扩展字段
 */
- (void)createGameAreaWithAreaId:(NSString *)areaId
                        areaName:(NSString *)areaName
                      areaStatus:(NSString *)areaStatus
                        areaType:(NSString *)areaType
                       extension:(NSDictionary *)extension
                        complete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] createGameAreaWithAreaId:areaId areaName:areaName areaStatus:areaStatus areaType:areaType extension:extension complete:complete];
}

/**
 * 删除游戏区服
 * @param areaId 区服 id
 */
- (void)deleteGameAreaWithAreaId:(NSString *)areaId
                        complete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] deleteGameAreaWithAreaId:areaId complete:complete];
}

/**
 * 查询区服列表信息
 */
- (void)searchGameAreaListInfoWithComplete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] searchGameAreaListInfoWithComplete:complete];
}

/**
 * 创建角色
 * @param areaId 区服 id
 * @param characterFaction 角色阵营
 * @param characterId 角色id
 * @param characterLevel 角色等级
 * @param characterName 角色名
 * @param characterProfession 角色职业
 * @param characterStatus 角色状态
 * @param characterType 角色类型
 * @param characterVipLevel 角色VIP等级
 * @param cpUserId 游戏用户 id
 * @param extension 扩展字段
 */
- (void)createGameCharacterWithAreaId:(NSString *)areaId
                     characterFaction:(NSString *)characterFaction
                          characterId:(NSString *)characterId
                       characterLevel:(NSString *)characterLevel
                        characterName:(NSString *)characterName
                  characterProfession:(NSString *)characterProfession
                      characterStatus:(NSString *)characterStatus
                        characterType:(NSString *)characterType
                    characterVipLevel:(NSString *)characterVipLevel
                             cpUserId:(NSString *)cpUserId
                            extension:(NSDictionary *)extension
                             complete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] createGameCharacterWithAreaId:areaId characterFaction:characterFaction characterId:characterId characterLevel:characterLevel characterName:characterName characterProfession:characterProfession characterStatus:characterStatus characterType:characterType characterVipLevel:characterVipLevel cpUserId:cpUserId extension:extension complete:complete];
}

/**
 * 修改游戏角色信息
 * @param areaId 区服 id
 * @param characterFaction 角色阵营
 * @param characterId 角色id
 * @param characterLevel 角色等级
 * @param characterName 角色名
 * @param characterProfession 角色职业
 * @param characterStatus 角色状态
 * @param characterType 角色类型
 * @param characterVipLevel 角色VIP等级
 * @param cpUserId 游戏用户 id
 * @param extension 扩展字段
 */
- (void)updateGameCharacterInfoWithAreaId:(NSString *)areaId
                         characterFaction:(NSString *)characterFaction
                              characterId:(NSString *)characterId
                           characterLevel:(NSString *)characterLevel
                            characterName:(NSString *)characterName
                      characterProfession:(NSString *)characterProfession
                          characterStatus:(NSString *)characterStatus
                            characterType:(NSString *)characterType
                        characterVipLevel:(NSString *)characterVipLevel
                                 cpUserId:(NSString *)cpUserId
                                extension:(NSDictionary *)extension
                                 complete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] updateGameCharacterInfoWithAreaId:areaId characterFaction:characterFaction characterId:characterId characterLevel:characterLevel characterName:characterName characterProfession:characterProfession characterStatus:characterStatus characterType:characterType characterVipLevel:characterVipLevel cpUserId:cpUserId extension:extension complete:complete];
}

/**
 * 删除游戏区服
 * @param areaId 区服 id
 * @param characterId 角色id
 * @param cpUserId 游戏用户 id
 */
- (void)deleteGameCharacterWithAreaId:(NSString *)areaId
                          characterId:(NSString *)characterId
                             cpUserId:(NSString *)cpUserId
                             complete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] deleteGameCharacterWithAreaId:areaId characterId:characterId cpUserId:cpUserId complete:complete];
}

/**
 * 查询账号下角色信息列表
 * @param cpUserId 游戏用户 id
 */
- (void)searchGameCharacterListInfoWithCpUserId:(NSString *)cpUserId
                                       complete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] searchGameCharacterListInfoWithCpUserId:cpUserId complete:complete];
}

/**
 * 查询账号下某个区服下的角色信息列表
 * @param areaId 区服 id
 * @param cpUserId 游戏用户 id
 */
- (void)searchGameCharacterListInAreaWithAreaId:(NSString *)areaId
                                       cpUserId:(NSString *)cpUserId
                                       complete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] searchGameCharacterListInAreaWithAreaId:areaId cpUserId:cpUserId complete:complete];
}

/**
 * 查询具体角色信息
 * @param areaId 区服 id
 * @param cpUserId 游戏用户 id
 * @param characterId 角色id
 */
- (void)searchGameCharacterInfoWithAreaId:(NSString *)areaId
                                 cpUserId:(NSString *)cpUserId
                              characterId:(NSString *)characterId
                                 complete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] searchGameCharacterInfoWithAreaId:areaId cpUserId:cpUserId characterId:characterId complete:complete];
}

/**
 * 查询游戏角色信息
 * @note 订制功能
 */
- (void)searchGameAccountWithComplete:(RequestComplete)complete
{
    [[RXGameInfoService sharedSDK] searchGameAccountWithComplete:complete];
}

/**
 * 用户行为统计
 */
- (void)trackUserActionWithDistinctId:(NSString * _Nullable)distinctId
                           properties:(NSDictionary * _Nullable)properties
{
    [[RXUserActionLogManager sharedSDK] addUserActionWithEvent:@"#rx_user_action" distinctId:distinctId properties:properties];
}

/**
 * 终止用户行为统计
 */
- (void)stopTrackUserAction
{
    [[RXUserActionLogManager sharedSDK] stopTrackUserAction];
}

/**
 * 获取客服消息未读数
 */
- (void)getServiceChatUnreadCount:(RequestComplete)complete
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/servicechat/queue/get_global_unread" andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取未读数成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取未读数失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 清空客服消息未读数
 */
- (void)clearServiceChatUnreadCount:(RequestComplete)complete
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/servicechat/queue/clear_global_unread" andParams:nil requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"清空未读数成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"清空未读数失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 查询订单状态
 * @note 暂不支持
 * @param orderNo 瑞雪订单号
 */
- (void)tradeQueryWithOrderNo:(NSString *)orderNo
                     complete:(RequestComplete)complete
{
    NSString *url = [NSString stringWithFormat:@"/v1/ke/sdk/trade_query?order_no=%@", orderNo];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取临时公告
 */
- (void)getTempNotice:(RequestComplete)complete
{
    NSString *productId = [RXUserUtility valueForKey:keyUserData_productId];
    NSString *channelId = [RXUserUtility valueForKey:keyUserData_channelId];
    NSString *url = [NSString stringWithFormat:@"/v1/vcapi/maintain/%@/%@", productId, channelId];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:url andParams:nil requsetMethod:RequestMethod_Get];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (complete) {
            complete(nil, error);
        }
    }];
}

@end
