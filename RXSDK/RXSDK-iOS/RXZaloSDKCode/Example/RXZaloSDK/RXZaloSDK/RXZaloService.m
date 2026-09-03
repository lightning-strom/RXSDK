//
//  RXZaloService.m
//  RXZaloSDK
//
//  Created by 陈汉 on 2024/3/22.
//

#import "RXZaloService.h"
#import <ZaloSDK/ZaloSDK.h>
#import "RXZaloTool.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

typedef void(^RXZaloShareBlock)(NSDictionary *response);

@interface RXZaloService ()

@property (nonatomic, strong) NSString *accessToken;

@end

@implementation RXZaloService

static RXZaloService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXZaloService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [RXSubPackage sharedSDK].aZalo = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(shareAction:) name:rxUserDefault_share_zalo object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginAction:) name:rxUserDefault_login_zalo object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openUrlAction:) name:rxUserDefault_openurl object:nil];
    }
    return self;
}

#pragma mark -- 生命周期
- (void)openUrlAction:(NSNotification *)noti
{
    UIApplication *app = noti.userInfo[@"app"];
    NSURL *url = noti.userInfo[@"url"];
    NSDictionary *options = noti.userInfo[@"options"];
    
    [self application:app openURL:url options:options];
}

#pragma mark -- from main framework
- (void)shareAction:(NSNotification *)noti
{
    NSDictionary *shareInfo = noti.userInfo[@"shareInfo"];
    RXZaloShareBlock callback = noti.userInfo[@"callback"];
    
    [self shareWithShareInfo:shareInfo complete:callback];
}

- (void)loginAction:(NSNotification *)noti
{
    NSInteger type = [noti.userInfo[@"type"] integerValue];
    NSDictionary *ext = noti.userInfo[@"ext"];
    
    [self loginWithAuthenType:type ext:ext];
}

/**
 * 检测 zalo 是否安装
 */
- (BOOL)isZaloInstalled
{
    return [RXZaloTool isZaloInstalled];
}

/**
 * 初始化 Zalo
 */
- (void)initWithAppId:(NSString *)appid
{
    [[ZaloSDK sharedInstance] initializeWithAppId:appid];
}

/**
 * Zalo 登录
 * @param type 登录类型
 */
- (void)loginWithAuthenType:(RXZAloSDKAuthenType)type
                        ext:(NSDictionary * _Nullable)ext
{
    NSString *codeVerify = [RXZaloTool generateCodeVerifier];
    NSString *codeChallenge = [RXZaloTool generateCodeChallengeWithCodeVerifier:codeVerify];
    [[ZaloSDK sharedInstance] authenticateZaloWithAuthenType:ZAZAloSDKAuthenTypeViaZaloAppAndWebView parentController:[self currentViewController] codeChallenge:codeChallenge extInfo:ext handler:^(ZOOauthResponseObject *response) {
                
//        NSLog(@"oauth_code == %@", response.oauthCode);
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:response.oauthCode forKey:@"oauth_code"];
        [dic setValue:codeVerify forKey:@"code_verifier"];
        [dic setValue:@"zalo" forKey:@"method"];
        
        [[RXService sharedSDK] loginWithExtDic:dic username:nil password:nil sign_fields:nil loginType:LoginTypeDefault migrate_args:nil];
        
    }];
}

/**
 * openUrl 处理跳转信息
 */
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
    return [[ZDKApplicationDelegate sharedInstance] application:app openURL:url options:options];
}

/**
 * Zalo 分享
 */
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                  complete:(void(^)(NSDictionary *response))complete
{
    NSString *url = shareInfo[@"url"];
    NSString *desc = shareInfo[@"content"];
    NSString *title = shareInfo[@"title"];
    NSInteger shareScene = [shareInfo[@"shareScene"] integerValue];
    
    ZOFeed *feed = [[ZOFeed alloc] initWithLink:url appName:title message:desc others:nil];
    feed.linkSource = url;
    feed.linkTitle = title;
    feed.linkDesc = desc;
    
    if (shareScene == 1) {
        [[ZaloSDK sharedInstance] shareFeed:feed inController:[self currentViewController] callback:^(ZOShareResponseObject *response) {
            NSString *message = response.message;
            NSString *errorCode = @"";
            if ([response.result_data isKindOfClass:[NSDictionary class]]) {
                NSDictionary *result = (NSDictionary *)response.result_data;
                if (result[@"error_code"] && [result[@"error_code"] isKindOfClass:[NSString class]]) {
                    errorCode = result[@"error_code"];
                }
            }
            NSMutableDictionary *errorDic = [NSMutableDictionary dictionary];
            [errorDic setValue:message forKey:@"msg"];
            
            if ([errorCode integerValue] == 0) {
                if (complete) {
                    complete(@{@"code" : @(0)});
                }
            } else {
                if (errorCode && errorCode.length > 0) {
                    [errorDic setValue:@([errorCode integerValue]) forKey:@"code"];
                }
                
                if (complete) {
                    complete(errorDic);
                }
            }
        }];
    } else if (shareScene == 0) {
        [[ZaloSDK sharedInstance] sendMessage:feed inController:[self currentViewController] callback:^(ZOShareResponseObject *response) {
            NSString *message = response.message;
            NSString *errorCode = @"";
            if ([response.result_data isKindOfClass:[NSDictionary class]]) {
                NSDictionary *result = (NSDictionary *)response.result_data;
                if (result[@"error_code"] && [result[@"error_code"] isKindOfClass:[NSString class]]) {
                    errorCode = result[@"error_code"];
                }
            }
            NSMutableDictionary *errorDic = [NSMutableDictionary dictionary];
            [errorDic setValue:message forKey:@"msg"];
            
            if ([errorCode integerValue] == 0) {
                if (complete) {
                    complete(@{@"code" : @(0)}); 
                }
            } else {
                if (errorCode && errorCode.length > 0) {
                    [errorDic setValue:@([errorCode integerValue]) forKey:@"code"];
                }
                
                if (complete) {
                    complete(errorDic);
                }
            }
        }];
    } else {
        [[ZaloSDK sharedInstance] shareFeedOrSendMessage:feed inController:[self currentViewController] callback:^(ZOShareResponseObject *response) {
            NSString *message = response.message;
            NSString *errorCode = @"";
            if ([response.result_data isKindOfClass:[NSDictionary class]]) {
                NSDictionary *result = (NSDictionary *)response.result_data;
                if (result[@"error_code"] && [result[@"error_code"] isKindOfClass:[NSString class]]) {
                    errorCode = result[@"error_code"];
                }
            }
            NSMutableDictionary *errorDic = [NSMutableDictionary dictionary];
            [errorDic setValue:message forKey:@"msg"];
            
            if ([errorCode integerValue] == 0) {
                if (complete) {
                    complete(@{@"code" : @(0)});
                }
            } else {
                if (errorCode && errorCode.length > 0) {
                    [errorDic setValue:@([errorCode integerValue]) forKey:@"code"];
                }
                
                if (complete) {
                    complete(errorDic);
                }
            }
        }];
    }
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
