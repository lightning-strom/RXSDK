//
//  RXGoogleService.m
//  RXGoogleSDK
//
//  Created by 陈汉 on 2022/8/30.
//

#import "RXGoogleService.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <GoogleSignIn/GoogleSignIn.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>
#import <RXSDK_Pure/RXPrivateService.h>

@interface RXGoogleService ()

@property (nonatomic, strong) GIDConfiguration *signInConfig;
@property (nonatomic, strong) NSString *migrate_args;
@property (nonatomic, strong) NSString *sign_fields;

- (void)bindAccountWithExt:(NSDictionary *)ext
                  complete:(RequestComplete)complete;

@end

@implementation RXGoogleService

static RXGoogleService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXGoogleService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [RXSubPackage sharedSDK].aGoogle = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginAction:) name:rxUserDefault_login_google object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bindAction:) name:@"rxUserDefault_bind_google" object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openUrlAction:) name:rxUserDefault_openurl object:nil];
    }
    return self;
}

#pragma mark -- 生命周期
- (void)openUrlAction:(NSNotification *)noti
{
    NSURL *url = noti.userInfo[@"url"];
    
    [self GOpenURL:url];
}

#pragma mark -- from main framework
- (void)loginAction:(NSNotification *)noti
{
    @try {
        id migrateArgs = noti.userInfo[@"migrateArgs"];
        NSArray *signFields = noti.userInfo[@"signFields"];
        
        [self GLoginInWithMigrate_args:migrateArgs sign_fields:signFields];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {

    }
}

- (void)bindAction:(NSNotification *)noti
{
    @try {
        NSDictionary *ext = noti.userInfo[@"ext"];
        RequestComplete callback = noti.userInfo[@"callback"];

        [self bindAccountWithExt:ext complete:callback];
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

/**
 * 注册谷歌
 */
- (void)GRegistWithClientID:(NSString *)clientID
{
    self.signInConfig = [[GIDConfiguration alloc] initWithClientID:clientID];
}

/**
 * 跳转openURL
 */
- (BOOL)GOpenURL:(NSURL *)url
{
    return [[GIDSignIn sharedInstance] handleURL:url];
}

/**
 * google登录
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 */
- (void)GLoginInWithMigrate_args:(id _Nullable)migrate_args
                     sign_fields:(NSArray * _Nullable)sign_fields
{
    [GIDSignIn.sharedInstance signInWithPresentingViewController:[self currentViewController] hint:nil additionalScopes:@[@"https://www.googleapis.com/auth/userinfo.profile", @"https://www.googleapis.com/auth/userinfo.email"] completion:^(GIDSignInResult * _Nullable signInResult, NSError * _Nullable error) {
        if (error) {
            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : error}];
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:@"rxlog_error_login"
                                                               url:@""
                                                              code:-123
                                                               msg:@""
                                                         thirdType:@"google"
                                                         thirdcode:error.code
                                                          thirdmsg:error.description
                                                           traceid:@""];
        } else {
            NSMutableDictionary *response = [NSMutableDictionary dictionary];
            [response setValue:signInResult.user.idToken.tokenString forKey:@"idToken"];
            [[RXService sharedSDK] loginWithExtDic:response username:nil password:nil sign_fields:sign_fields loginType:LoginTypeGoogle migrate_args:migrate_args];
        }
    }];
    /*
    [GIDSignIn.sharedInstance signInWithPresentingViewController:[self currentViewController] hint:nil completion:^(GIDSignInResult * _Nullable signInResult, NSError * _Nullable error) {
        if (error) {
            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : error}];
        } else {
            NSMutableDictionary *response = [NSMutableDictionary dictionary];
            [response setValue:signInResult.user.idToken.tokenString forKey:@"idToken"];
            [[RXService sharedSDK] loginWithExtDic:response username:nil password:nil sign_fields:sign_fields loginType:LoginTypeGoogle migrate_args:migrate_args];
        }
    }];
    */
//    [GIDSignIn.sharedInstance signInWithConfiguration:self.signInConfig presentingViewController:[self currentViewController] callback:^(GIDGoogleUser * _Nullable user, NSError * _Nullable error) {
//        if (error) {
//            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : error}];
//        } else {
//            NSMutableDictionary *response = [NSMutableDictionary dictionary];
//            [response setValue:user.authentication.idToken forKey:@"idToken"];
//            [[RXService sharedSDK] loginWithExtDic:response username:nil password:nil sign_fields:sign_fields loginType:LoginTypeGoogle migrate_args:migrate_args];
//        }
//    }];
}

- (void)bindAccountWithExt:(NSDictionary *)ext
                  complete:(RequestComplete)complete
{
    [GIDSignIn.sharedInstance signInWithPresentingViewController:[self currentViewController] hint:nil additionalScopes:@[@"https://www.googleapis.com/auth/userinfo.profile", @"https://www.googleapis.com/auth/userinfo.email"] completion:^(GIDSignInResult * _Nullable signInResult, NSError * _Nullable error) {
        if (error) {
            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];

            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXLoginError_third] forKey:@"msg"];
            [errorRes setValue:@(RXLoginError_third) forKey:@"code"];
            [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
            [errorRes setValue:@(error.code) forKey:@"thirdcode"];
            err.responesObject = errorRes;

            if (complete) {
                complete(nil, err);
            }
        } else {
            NSMutableDictionary *response = [NSMutableDictionary dictionary];
            if ([ext isKindOfClass:[NSDictionary class]]) {
                [response addEntriesFromDictionary:ext];
            }
            [response setValue:signInResult.user.idToken.tokenString forKey:@"idToken"];

            [[RXPrivateService sharedSDK] bindThirdAccountWithMethod:@"google" ext:response complete:complete];
        }
    }];
}

/**
 * 恢复登录
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]   非必须
 */
- (void)GRestorePreviousSignInWithMigrate_args:(id _Nullable)migrate_args
                                   sign_fields:(NSArray * _Nullable)sign_fields
{
    
    [GIDSignIn.sharedInstance restorePreviousSignInWithCompletion:^(GIDGoogleUser * _Nullable user, NSError * _Nullable error) {
        if (error) {
            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : error}];
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:@"rxlog_error_login"
                                                               url:@""
                                                              code:-123
                                                               msg:@""
                                                         thirdType:@"google"
                                                         thirdcode:error.code
                                                          thirdmsg:error.description
                                                           traceid:@""];
        } else {
            NSMutableDictionary *response = [NSMutableDictionary dictionary];
            [response setValue:user.idToken.tokenString forKey:@"idToken"];
            [[RXService sharedSDK] loginWithExtDic:response username:nil password:nil sign_fields:sign_fields loginType:LoginTypeGoogle migrate_args:migrate_args];
        }
    }];
    
//    [GIDSignIn.sharedInstance restorePreviousSignInWithCallback:^(GIDGoogleUser * _Nullable user,
//                                                                    NSError * _Nullable error) {
//        if (error) {
//            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : error}];
//        } else {
//            NSMutableDictionary *response = [NSMutableDictionary dictionary];
//            [response setValue:user.authentication.idToken forKey:@"idToken"];
////            [response setValue:user.userID forKey:@"userID"];
////            [response setValue:user.grantedScopes forKey:@"grantedScopes"];
////            [response setValue:user.hostedDomain forKey:@"hostedDomain"];
////            [response setValue:user.serverClientID forKey:@"serverClientID"];
////            [response setValue:user.serverAuthCode forKey:@"serverAuthCode"];
////            [response setValue:user.openIDRealm forKey:@"openIDRealm"];
////            [response setValue:user.profile.email forKey:@"email"];
////            [response setValue:user.profile.name forKey:@"name"];
////            [response setValue:user.profile.givenName forKey:@"givenName"];
////            [response setValue:user.profile.familyName forKey:@"familyName"];
////            [response setValue:@(user.profile.hasImage) forKey:@"hasImage"];
////            [response setValue:user.authentication.clientID forKey:@"clientID"];
////            [response setValue:user.authentication.accessToken forKey:@"accessToken"];
////            [response setValue:user.authentication.accessTokenExpirationDate forKey:@"accessTokenExpirationDate"];
////            [response setValue:user.authentication.refreshToken forKey:@"refreshToken"];
////            [response setValue:user.authentication.idTokenExpirationDate forKey:@"idTokenExpirationDate"];
//            
//            [[RXService sharedSDK] loginWithExtDic:response username:nil password:nil sign_fields:sign_fields loginType:LoginTypeGoogle migrate_args:migrate_args];
//        }
//      }];
}

/**
 * google退出登录
 */
- (void)GLogout
{
    [GIDSignIn.sharedInstance signOut];
}

/** appdelegate */
- (id<UIApplicationDelegate>)applicationDelegate {
    return [UIApplication sharedApplication].delegate;
}

/** 返回当前控制器 */
- (UIViewController *)currentViewController {
    
    UIViewController *rootViewController = [self applicationDelegate].window.rootViewController;
    return [self currentViewControllerFrom:rootViewController];
}

/** 返回当前的导航控制器 */
- (UINavigationController *)currentNavigationViewController {
    
    UIViewController *currentViewController = [self currentViewController];
    return currentViewController.navigationController;
}

/** 通过递归拿到当前控制器 */
- (UIViewController *)currentViewControllerFrom:(UIViewController*)viewController {
    
    // 如果传入的控制器是导航控制器,则返回最后一个
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        
        UINavigationController *navigationController = (UINavigationController *)viewController;
        return [self currentViewControllerFrom:navigationController.viewControllers.lastObject];
    }
    // 如果传入的控制器是tabBar控制器,则返回选中的那个
    else if([viewController isKindOfClass:[UITabBarController class]]) {
        
        UITabBarController *tabBarController = (UITabBarController *)viewController;
        return [self currentViewControllerFrom:tabBarController.selectedViewController];
    }
    // 如果传入的控制器发生了modal,则就可以拿到modal的那个控制器
    else if(viewController.presentedViewController != nil) {
        return [self currentViewControllerFrom:viewController.presentedViewController];
    }
    else {
        return viewController;
    }
}

@end
