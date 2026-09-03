//
//  AppDelegate.m
//  RXPushSDKDemo
//
//  Created by 陈汉 on 2022/2/16.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXPushSDK/RXPushSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface AppDelegate () <RXPushDelegate>

@property (nonatomic, strong) NSString *deviceToken;

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"101"
//                                        cpid:@"1000049"
//                                 baseUrlList:@[@"https://ruixue.weiletest.com/"]];
    
    //    [[RXPushService sharedSDK] initWithProductId:@"263"
    //                                       channelId:@"101"
    //                                            cpid:@"1000038"
    //                                     baseUrlList:@[@"https://ruixue.weiletest.com/"]];
    
//    [[RXService sharedSDK] initWithProductId:@"263"
//                                   channelId:@"101"
//                                        cpid:@"1000038"
//                                 baseUrlList:@[@"https://rx-api.weileyurtr.com/"]];
  
//    [[RXPushService sharedSDK] initWithProductId:@"263"
//                                       channelId:@"101"
//                                            cpid:@"1000038"
//                                     baseUrlList:@[@"https://rx-api.weileyurtr.com/"]];
    
//    [[RXService sharedSDK] initWithProductId:@"102"
//                                   channelId:@"100"
//                                        cpid:@"1000199"
//                                 baseUrlList:@[@"https://i3ixr7.weilefly.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
////    
//    [[RXService sharedSDK] initWithProductId:@"SDKOS"
//                                   channelId:@"iOSOS"
//                                        cpid:@"119"
//                                 baseUrlList:@[@"http://os-api-test.ruixuecloud.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXPushService sharedSDK] initWithProductId:@"SDKOS"
//                                       channelId:@"iOSOS"
//                                            cpid:@"119"
//                                     baseUrlList:@[@"http://os-api-test.ruixuecloud.com"]];
    
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
//    
    [[RXPushService sharedSDK] initWithProductId:@"1002"
                                       channelId:@"iOS"
                                            cpid:@"114"
                                     baseUrlList:@[@"https://cn-api-test.ruixueyun.com/"]];
    
//    [[RXService sharedSDK] initWithProductId:@"265"
//                                   channelId:@"1002"
//                                        cpid:@"1000040"
//                                 baseUrlList:@[@"https://rxapi.fishinggamezone.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXPushService sharedSDK] initWithProductId:@"265"
//                                       channelId:@"1002"
//                                            cpid:@"1000040"
//                                     baseUrlList:@[@"https://rxapi.fishinggamezone.com"]];
    
    [[RXPushService sharedSDK] initUserNotificationCenter:self];
    [[RXPushService sharedSDK] setApplicationIconBadgeNumber:0];
    
//    [[RXPushService sharedSDK] initUserNotificationCenter:self];
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor blackColor];
    
    ViewController *rootVC = [[ViewController alloc] init];

    UINavigationController *naVC = [[UINavigationController alloc] initWithRootViewController:rootVC];
    self.window.rootViewController = naVC;
    [self.window makeKeyAndVisible];
    

//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(60 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//    });
    
    return YES;
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
    [[RXPushService sharedSDK] setApplicationIconBadgeNumber:1];
}

- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
    NSLog(@"willPresentNotification");
}

- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(100, 100, 300, 350)];
    label.backgroundColor = [UIColor yellowColor];
    
    // 获取所有推送内容
    NSDictionary *pushUserInfo = response.notification.request.content.userInfo;
    // 获取 deeplink 参数
    NSString *payload = pushUserInfo[@"payload"];
    label.text = [NSString stringWithFormat:@"%@", payload];
    label.numberOfLines = 0;
    [[UIApplication sharedApplication].keyWindow addSubview:label];
    
    NSLog(@"didReceiveNotificationResponse");
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    
    [[RXPushService sharedSDK] setApplicationIconBadgeNumber:2];
    // Required, iOS 7 Support
    
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(100, 100, 300, 50)];
    label.backgroundColor = [UIColor yellowColor];
    label.text = [NSString stringWithFormat:@"%@", userInfo];
    [[UIApplication sharedApplication].keyWindow addSubview:label];
    
    completionHandler(UIBackgroundFetchResultNewData);
   
    if (application.applicationState == UIApplicationStateActive || application.applicationState == UIApplicationStateBackground) {
   
    }
    else
    {
        
        //跳转到指定页面
    }
    
    
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
