//
//  AppDelegate.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/2.
//

#import "AppDelegate.h"
#import "NAVC.h"
#import "ViewController.h"
#import "CHMarco.h"
#import <RXPushSDK/RXPushSDK.h>
#import <Bolts/Bolts.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RXUIKit/RXUIKit.h>

@interface AppDelegate ()<RXPushDelegate>

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    //应用跳转过来获取到的url
    NSURL *url = [launchOptions objectForKey:UIApplicationLaunchOptionsURLKey];
    if (url) {
       // 在这里处理获取到的URL
        NSString *sourceApplication = launchOptions[UIApplicationOpenURLOptionsSourceApplicationKey];
        BFURL *parsedUrl = [BFURL URLWithInboundURL:url sourceApplication:sourceApplication];
        [[NSUserDefaults standardUserDefaults] setObject:url.absoluteString forKey:@"finishURL"];
        [[NSUserDefaults standardUserDefaults] setObject:parsedUrl.inputURL.absoluteString forKey:@"finishbolturl"];
    }else{
        [[NSUserDefaults standardUserDefaults] setObject:@"无url或已清理" forKey:@"finishURL"];
        [[NSUserDefaults standardUserDefaults] setObject:@"无url或已清理" forKey:@"finishbolturl"];
    }
    //facebook深链接
    if (launchOptions[UIApplicationLaunchOptionsURLKey] == nil) {
        [FBSDKAppLinkUtility fetchDeferredAppLink:^(NSURL *url, NSError *error) {
          if (error) {
            NSLog(@"Received error while fetching deferred app link %@", error);
          }
          if (url) {
              [[UIApplication sharedApplication] openURL:url options:nil completionHandler:nil];
          }else{
              NSLog(@"无深链接url");
          }
        }];
    }else{
        NSLog(@"==%@",launchOptions[UIApplicationLaunchOptionsURLKey]);
    }
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor blackColor];
    
    ViewController *rootVC = [[ViewController alloc] init];

    NAVC *naVC = [[NAVC alloc] initWithRootViewController:rootVC];
    
    self.window.rootViewController = naVC;
    [self.window makeKeyAndVisible];
    
    [[RXUIKitService sharedSDK] regist];
    
    [[RXService sharedSDK] setArea:@"JP"];
    
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    config.productId = @"1002";
    config.channelId = @"iOS";
    config.cpId = @"114";
    config.baseUrlList = @[@"https://cn-api-test.ruixueyun.com/"];
    config.isUseDNS = YES;
    config.launchOptions = launchOptions;
    
    [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
    [[RXService sharedSDK] initWithProductId:@"1002"
                                   channelId:@"iOS"
                                        cpid:@"114"
                                 baseUrlList:@[@"https://cn-api-test.ruixueyun.com/"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
    //消息推送
    [[RXPushService sharedSDK] initUserNotificationCenter:self];
    [[RXPushService sharedSDK] setApplicationIconBadgeNumber:0];
    //海外sdk使用
    [[RXFacebookService sharedSDK] FBRegistWithApplication:application launchOptions:launchOptions];
    [[RXTikTokService sharedSDK] TTRegistWithApplication:application launchOptions:launchOptions];
    
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
    [[NSUserDefaults standardUserDefaults] setObject:url.absoluteString forKey:@"openURLurl"];
    NSString *sourceApplication = options[UIApplicationOpenURLOptionsSourceApplicationKey];
    BFURL *parsedUrl = [BFURL URLWithInboundURL:url sourceApplication:sourceApplication];
    [[NSUserDefaults standardUserDefaults] setObject:parsedUrl.inputURL.absoluteString forKey:@"openURLbolturl"];
    
    if ([[RXWXService sharedSDK] handleOpenUrl:url]) {
        return YES;
    }
    if ([[RXGoogleService sharedSDK] GOpenURL:url]) {
        return YES;
    }
    if ([[RXFacebookService sharedSDK] FBApplication:app openURL:url options:options]) {
        return YES;
    }
    if ([[RXLineService sharedSDK] handleOpenURL:url]) {
        return YES;
    }
    if ([[RXTikTokService sharedSDK] TTApplication:app openURL:url options:options]) {
        return YES;
    }
    if ([[RXSnapChatService sharedSDK] application:app openURL:url options:options]) {
        return YES;
    }
    if ([[RXZaloService sharedSDK] application:app openURL:url options:options]) {
        return YES;
    }
    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
    if ([[RXWXService sharedSDK] handleOpenUniversalLink:userActivity]) {
        return YES;
    }
    return YES;
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(nullable UIWindow *)window {
    if ([Tool sharedSDK].interface == 1) {
        return UIInterfaceOrientationMaskLandscape;
    } else {
        return UIInterfaceOrientationMaskPortrait;
    }
}

#pragma mark - RXPush Delegate
- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
    NSLog(@"willPresentNotification");
}

- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
    NSLog(@"didReceiveNotificationResponse");
}

#pragma mark - 注册APNS
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    if (![deviceToken isKindOfClass:[NSData class]]) return;
    /*
    NSString *pushToken=@"";
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 13.0) {
        const unsigned *tokenBytes = [deviceToken bytes];
        pushToken = [NSString stringWithFormat:@"%08x %08x %08x %08x %08x %08x %08x %08x",
                     ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                     ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                     ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];
    }
    else{
        pushToken = [NSString stringWithFormat:@"%@", deviceToken];
        if (pushToken != nil && pushToken.length> 3) {
            pushToken = [pushToken substringFromIndex:1];
            pushToken = [pushToken substringToIndex:pushToken.length -1];
        }
    }
    NSLog(@"deviceToken= %@", pushToken);
    self.deviceToken = pushToken;
    */
    [[NSUserDefaults standardUserDefaults] setValue:deviceToken forKey:@"deciceToken"];
}

@end
