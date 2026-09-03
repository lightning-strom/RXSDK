//
//  AppleLogin.m
//  iosSDK
//
//  Created by 刘清林 on 2020/6/29.
//  Copyright © 2020 weile. All rights reserved.
//

#import "AppleLogin.h"
#import "RXErrorTool.h"
#import "NSString+RXAddition.h"
#import "RXPrivateService.h"
#if __has_include(<AuthenticationServices/AuthenticationServices.h>)
#import <AuthenticationServices/AuthenticationServices.h>
#else

#endif
 
typedef void(^AppleLoginBlock)(NSInteger state,NSString *msg,id data);
@interface AppleLogin ()
<
ASAuthorizationControllerDelegate
,ASAuthorizationControllerPresentationContextProviding
>
@property(nonatomic,strong)NSString *userId;
@property(nonatomic,copy)AppleLoginBlock appleLoginBlock;
@end
 
@implementation AppleLogin
 
+ (instancetype)sharedManager
{
    static AppleLogin *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[AppleLogin alloc] init];
    });
    return manager;
}

- (void)singInLogin:(NSString *)user block:(void(^)(NSInteger state,NSString *msg,id data))block
{
    _userId =user;
    _appleLoginBlock = block;
    if (@available(iOS 13.0, *)) {
        // 基于用户的Apple ID授权用户，生成用户授权请求的一种机制
        ASAuthorizationAppleIDProvider *appleIDProvider = [[ASAuthorizationAppleIDProvider alloc] init];
        // 创建新的AppleID 授权请求
        ASAuthorizationAppleIDRequest *appleIDRequest = [appleIDProvider createRequest];
        // 在用户授权期间请求的联系信息
        appleIDRequest.requestedScopes = @[ASAuthorizationScopeFullName, ASAuthorizationScopeEmail];
        // 由ASAuthorizationAppleIDProvider创建的授权请求 管理授权请求的控制器
        ASAuthorizationController *authorizationController = [[ASAuthorizationController alloc] initWithAuthorizationRequests:@[appleIDRequest]];
        // 设置授权控制器通知授权请求的成功与失败的代理
        authorizationController.delegate = self;
        // 设置提供 展示上下文的代理，在这个上下文中 系统可以展示授权界面给用户
        authorizationController.presentationContextProvider = self;
        // 在控制器初始化期间启动授权流
        [authorizationController performRequests];
    }else{
        // 处理不支持系统版本
        NSLog(@"该系统版本不可用Apple登录");
        if (self.appleLoginBlock)
        {
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setValue:@"该系统版本不可用Apple登录" forKey:@"errorMsg"];
            [dic setValue:@(RXLoginError_third) forKey:@"code"];
            self.appleLoginBlock(AppleLoginTypeFailure, @"该系统版本不可用Apple登录", dic);
        }
    }
}

- (void)bindAccountWithExt:(NSDictionary *)ext
                  complete:(RequestComplete)complete
{
    NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
    if ([ext isKindOfClass:[NSDictionary class]]) {
        [extDic addEntriesFromDictionary:ext];
    }

    [self singInLogin:@"" block:^(NSInteger state, NSString * _Nonnull msg, id  _Nonnull data) {
        if (state == AppleLoginTypeSuccessful || state == AppleLoginTypeUserSuccessful) {
            if ([data isKindOfClass:[NSDictionary class]]) {
                [extDic addEntriesFromDictionary:(NSDictionary *)data];
            }

            [[RXPrivateService sharedSDK] bindThirdAccountWithMethod:@"apple" ext:extDic complete:complete];
        } else if (state == AppleLoginTypeFailure) {
            RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
            NSMutableDictionary *errorDic = [NSMutableDictionary dictionary];
            if ([data isKindOfClass:[NSDictionary class]]) {
                NSDictionary *dataDic = (NSDictionary *)data;
                [errorDic setValue:dataDic[@"code"] forKey:@"code"];
                [errorDic setValue:dataDic[@"errorMsg"] forKey:@"msg"];
                [errorDic setValue:dataDic[@"thirdcode"] forKey:@"thirdcode"];
                [errorDic setValue:dataDic[@"thirdmsg"] forKey:@"thirdmsg"];
            }
            error.responesObject = errorDic;

            if (complete) {
                complete(nil, error);
            }
        }
    }];
}
 
#pragma mark ————————————— 登录按钮点击事件 —————————————
- (void)signInWithApple API_AVAILABLE(ios(13.0))
{
    if (@available(iOS 13.0, *))
    {
         NSLog(@"Apple Login Click");
        //基于用户的Apple ID授权用户，生成用户授权请求的一种机制
        ASAuthorizationAppleIDProvider *appleIDProvider = [ASAuthorizationAppleIDProvider new];
        if (_userId.length == 0)
        {
            NSLog(@"授权请求AppleID");
            ASAuthorizationAppleIDRequest *request = appleIDProvider.createRequest;
            [request setRequestedScopes:@[ASAuthorizationScopeFullName, ASAuthorizationScopeEmail]];
            //由ASAuthorizationAppleIDProvider创建的授权请求 管理授权请求的控制器
            ASAuthorizationController *controller = [[ASAuthorizationController alloc] initWithAuthorizationRequests:@[request]];
            //设置授权控制器通知授权请求的成功与失败的代理
            controller.delegate = self;
            //设置提供 展示上下文的代理，在这个上下文中 系统可以展示授权界面给用户
            controller.presentationContextProvider = self;
            //在控制器初始化期间启动授权流
            [controller performRequests];
        }
        else
        {
//            NSLog(@"快速登录使用授权登录返回的 user ");
            //快速登录
            [appleIDProvider getCredentialStateForUserID:_userId completion:^(ASAuthorizationAppleIDProviderCredentialState credentialState, NSError * _Nullable error) {
 
                if (credentialState == ASAuthorizationAppleIDProviderCredentialAuthorized)
                {
                    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
                    if (self.appleLoginBlock)
                    {
                      self.appleLoginBlock(AppleLoginTypeUserSuccessful,@"ok",dic);
                    }
                }
                else
                {   NSMutableDictionary *dic = [NSMutableDictionary dictionary];
                    [dic setValue:error.description forKey:@"errorMsg"];
                    [dic setValue:[NSNumber numberWithInteger:error.code] forKey:@"code"];
                    if (self.appleLoginBlock)
                    {
                      self.appleLoginBlock(AppleLoginTypeFailure,error.description,dic);
                    }
                }
            }];
        }
    }
    else
    {
 
    }
}
 
#pragma mark ————————————— 成功回调 —————————————
- (void)authorizationController:(ASAuthorizationController *)controller didCompleteWithAuthorization:(ASAuthorization *)authorization API_AVAILABLE(ios(13.0))
{
//        NSLog(@"授权完成:::%@", authorization.credential);
//        NSLog(@"%s", __FUNCTION__);
//        NSLog(@"%@", controller);
//        NSLog(@"%@", authorization);
        
        if ([authorization.credential isKindOfClass:[ASAuthorizationAppleIDCredential class]])
        {
            // 用户登录使用ASAuthorizationAppleIDCredential
            ASAuthorizationAppleIDCredential *appleIDCredential = authorization.credential;
            NSString *user = appleIDCredential.user;
            // 使用过授权的，可能获取不到以下三个参数
            NSString *familyName = appleIDCredential.fullName.familyName;
            NSString *givenName = appleIDCredential.fullName.givenName;
            NSString *nickname = appleIDCredential.fullName.nickname;
            NSString *email = appleIDCredential.email;
            NSString *state = appleIDCredential.state;
            NSData *identityToken = appleIDCredential.identityToken;
            NSData *authorizationCode = appleIDCredential.authorizationCode;
            ASUserDetectionStatus realUserStatus = appleIDCredential.realUserStatus;
            
            // 服务器验证需要使用的参数
            NSString *identityTokenStr = [[NSString alloc] initWithData:identityToken encoding:NSUTF8StringEncoding];
            NSString *authorizationCodeStr = [[NSString alloc] initWithData:authorizationCode encoding:NSUTF8StringEncoding];
            //  NSLog(@"%@\n\n%@", identityTokenStr, authorizationCodeStr);
 
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setValue:state forKey:@"state"];
            [dic setValue:user forKey:@"user"];
            [dic setValue:email forKey:@"email"];
            [dic setValue:familyName forKey:@"familyName"];
            [dic setValue:givenName forKey:@"givenName"];
            [dic setValue:nickname forKey:@"nickname"];

            NSString *username = @"";
            if ([NSString rx_isNullToString:familyName].length > 0 && [NSString rx_isNullToString:givenName].length > 0) {
                username = [NSString stringWithFormat:@"%@%@", familyName, givenName];
                [dic setValue:username forKey:@"nickname"];
            } else if ([NSString rx_isNullToString:familyName].length > 0) {
                username = [NSString stringWithFormat:@"%@", familyName];
                [dic setValue:username forKey:@"nickname"];
            } else if ([NSString rx_isNullToString:givenName].length > 0) {
                username = [NSString stringWithFormat:@"%@", givenName];
                [dic setValue:username forKey:@"nickname"];
            }
            
            [dic setValue:authorizationCodeStr forKey:@"authorizationCode"];
            [dic setValue:identityTokenStr forKey:@"identityToken"];
            
            if (self.appleLoginBlock)
            {
                self.appleLoginBlock(AppleLoginTypeSuccessful, @"ok",dic);
            }
            //  需要使用钥匙串的方式保存用户的唯一信息 Keychain
        }
        else if ([authorization.credential isKindOfClass:[ASPasswordCredential class]])
        {
            // 这个获取的是iCloud记录的账号密码，需要输入框支持iOS 12 记录账号密码的新特性，如果不支持，可以忽略
            // Sign in using an existing iCloud Keychain credential.
            // 用户登录使用现有的密码凭证
            ASPasswordCredential *passwordCredential = authorization.credential;
            // 密码凭证对象的用户标识 用户的唯一标识
            NSString *user = passwordCredential.user;
            // 密码凭证对象的密码
            NSString *password = passwordCredential.password;
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setValue:user forKey:@"user"];
            [dic setValue:password forKey:@"password"];
            if (self.appleLoginBlock)
            {
                self.appleLoginBlock(AppleLoginTypeSuccessful, @"ok",dic);
            }
        }
        else
        {
//            NSLog(@"授权信息均不符");
            NSString *errorMsg = @"授权信息不符";
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            [dic setValue:errorMsg forKey:@"errorMsg"];
            if (self.appleLoginBlock)
            {
              self.appleLoginBlock(AppleLoginTypeFailure,errorMsg,dic);
            }
        }
}
 
#pragma mark ————————————— 失败回调 —————————————
- (void)authorizationController:(ASAuthorizationController *)controller didCompleteWithError:(NSError *)error API_AVAILABLE(ios(13.0))
{
    NSInteger code = RXLoginError_third;
    NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLoginError_third];
    NSString *thirdmsg = [RXErrorTool getRXErrorMsg:RXLoginError_third];
    switch (error.code) {
        case ASAuthorizationErrorCanceled:
            errorMsg = [RXErrorTool getRXErrorMsg:RXLoginError_cancel];
            code = RXLoginError_cancel;
            thirdmsg = @"登录取消";
            break;
        case ASAuthorizationErrorFailed:
            thirdmsg = @"登录授权失败！";
            break;
        case ASAuthorizationErrorInvalidResponse:
            thirdmsg = @"授权请求响应无效";
            break;
        case ASAuthorizationErrorNotHandled:
            thirdmsg = @"未能处理授权请求";
            break;
        case ASAuthorizationErrorUnknown:
            thirdmsg = @"登录授权失败！";
            break;
    }
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:thirdmsg forKey:@"thirdmsg"];
    [dic setValue:[NSNumber numberWithInteger:error.code] forKey:@"thirdcode"];
    [dic setValue:errorMsg forKey:@"errorMsg"];
    [dic setValue:@(code) forKey:@"code"];
    
    if (self.appleLoginBlock)
    {
      self.appleLoginBlock(AppleLoginTypeFailure,errorMsg,dic);
    }
}
 
#pragma mark ————————————— 告诉代理应该在哪个window 展示内容给用户 —————————————
- (ASPresentationAnchor)presentationAnchorForAuthorizationController:(ASAuthorizationController *)controller API_AVAILABLE(ios(13.0))
{
    return [UIApplication sharedApplication].windows.lastObject;
}
 
@end

