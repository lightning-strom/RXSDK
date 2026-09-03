//
//  RXVKService.m
//  RXVKSDK
//
//  Created by 陈汉 on 2022/8/30.
//

#import "RXVKService.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>
#import <RXSDK_Pure/RXPrivateService.h>

@protocol RXVKIDBridgeProtocol <NSObject>

+ (instancetype)sharedBridge;
- (NSError * _Nullable)registerWithClientId:(NSString *)clientId
                               clientSecret:(NSString *)clientSecret;
- (BOOL)openURL:(NSURL *)url;
- (void)authorizeWithPresentingViewController:(UIViewController *)presentingViewController
                                   completion:(void (^)(NSDictionary * _Nullable result, NSError * _Nullable error))completion;
- (void)logout;

@end

@interface RXVKService ()

- (void)bindAccountWithExt:(NSDictionary *)ext
                  complete:(RequestComplete)complete;
- (id<RXVKIDBridgeProtocol>)vkBridge;

@end

@implementation RXVKService

static RXVKService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXVKService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        @try {
            [[RXSubPackage sharedSDK] setValue:@YES forKey:@"aVK"];
        } @catch (NSException *exception) {
            NSLog(@"%@", exception);
        }
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(loginAction:) name:rxUserDefault_login_vk object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bindAction:) name:rxUserDefault_bind_vk object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(openUrlAction:) name:rxUserDefault_openurl object:nil];
    }
    return self;
}

- (id<RXVKIDBridgeProtocol>)vkBridge
{
    Class<RXVKIDBridgeProtocol> bridgeClass = (Class<RXVKIDBridgeProtocol>)NSClassFromString(@"RXVKIDBridge");
    return [bridgeClass sharedBridge];
}

#pragma mark -- 生命周期
- (void)openUrlAction:(NSNotification *)noti
{
    NSURL *url = noti.userInfo[@"url"];
    
    [self VKOpenURL:url];
}

#pragma mark -- from main framework
- (void)loginAction:(NSNotification *)noti
{
    @try {
        id migrateArgs = noti.userInfo[@"migrateArgs"];
        NSArray *signFields = noti.userInfo[@"signFields"];
        NSDictionary *ext = noti.userInfo[@"ext"];
        
        [self loginWithExt:ext migrate_args:migrateArgs sign_fields:signFields];
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
 * 注册 VK ID
 */
- (void)VKRegistWithClientID:(NSString *)clientID
                clientSecret:(NSString *)clientSecret
{
    NSError *error = [[self vkBridge] registerWithClientId:clientID clientSecret:clientSecret];
    if (error) {
        NSLog(@"%@", error);
    }
}

/**
 * 跳转openURL
 */
- (BOOL)VKOpenURL:(NSURL *)url
{
    return [[self vkBridge] openURL:url];
}

/**
 * VK 登录
 * @param migrate_args 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param sign_fields 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
 */
- (void)VKLoginWithMigrate_args:(id _Nullable)migrate_args
                    sign_fields:(NSArray * _Nullable)sign_fields
{
    [self loginWithExt:nil migrate_args:migrate_args sign_fields:sign_fields];
}

- (void)loginWithExt:(NSDictionary * _Nullable)ext
        migrate_args:(id _Nullable)migrate_args
         sign_fields:(NSArray * _Nullable)sign_fields
{
    [[self vkBridge] authorizeWithPresentingViewController:[self currentViewController] completion:^(NSDictionary * _Nullable result, NSError * _Nullable error) {
        if (error) {
            [[NSNotificationCenter defaultCenter] postNotificationName:@"noti_LoginFail" object:nil userInfo:@{@"error" : error}];
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:@"rxlog_error_login"
                                                               url:@""
                                                              code:-123
                                                               msg:@""
                                                         thirdType:@"vk"
                                                         thirdcode:error.code
                                                          thirdmsg:error.description
                                                           traceid:@""];
        } else {
            NSMutableDictionary *response = [NSMutableDictionary dictionary];
            if ([ext isKindOfClass:[NSDictionary class]]) {
                [response addEntriesFromDictionary:ext];
            }
            if ([result isKindOfClass:[NSDictionary class]]) {
                [response addEntriesFromDictionary:(NSDictionary *)result];
            }
            [[RXService sharedSDK] loginWithExtDic:response username:nil password:nil sign_fields:sign_fields loginType:LoginTypeVK migrate_args:migrate_args];
        }
    }];
}

- (void)bindAccountWithExt:(NSDictionary *)ext
                  complete:(RequestComplete)complete
{
    [[self vkBridge] authorizeWithPresentingViewController:[self currentViewController] completion:^(NSDictionary * _Nullable result, NSError * _Nullable error) {
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
            if ([result isKindOfClass:[NSDictionary class]]) {
                [response addEntriesFromDictionary:(NSDictionary *)result];
            }

            [[RXPrivateService sharedSDK] bindThirdAccountWithMethod:@"vk" ext:response complete:complete];
        }
    }];
}

/**
 * VK 退出登录
 */
- (void)VKLogout
{
    [[self vkBridge] logout];
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
