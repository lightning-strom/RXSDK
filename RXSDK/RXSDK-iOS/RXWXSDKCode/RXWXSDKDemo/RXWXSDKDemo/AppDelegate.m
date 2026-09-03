//
//  AppDelegate.m
//  RXWXSDKDemo
//
//  Created by 陈汉 on 2022/5/30.
//

#import "AppDelegate.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXWXSDK/RXWXSDK.h>
#import "ViewController.h"

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor blackColor];
    
    ViewController *rootVC = [[ViewController alloc] init];

    UINavigationController *naVC = [[UINavigationController alloc] initWithRootViewController:rootVC];
    self.window.rootViewController = naVC;
    [self.window makeKeyAndVisible];
    
    // 捕鱼测试
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"101"
//                                        cpid:@"1000049"
//                                 baseUrlList:@[@"https://ruixue.weiletest.com/"]];
//    [[RXWXService sharedSDK] configUniversallink:@"https://open.weileapp.com/toolapi/"];
//    [[RXService sharedSDK] initWithProductId:@"263"
//                                   channelId:@"301"
//                                        cpid:@"1000038"
//                                 baseUrlList:@[@"https://rx-api.weileyurtr.com/"]];
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"iOS"
//                                        cpid:@"112"
//                                 baseUrlList:@[@"https://cn-api-demo.ruixuecloud.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"1002" channelId:@"iOS" cpid:@"112" ipv4Url:@"" baseUrlList:@[@"https://cn-api-demo.ruixuecloud.com"]];
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"iOS"
//                                        cpid:@"112"
//                                 baseUrlList:@[@"https://cn-api-demo.ruixuecloud.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    [[RXWXService sharedSDK] configUniversallink:@"https://api.7nightapp.com/ulink/"];
    
    [[RXService sharedSDK] initWithProductId:@"1002"
                                   channelId:@"iOS"
                                        cpid:@"114"
                                 baseUrlList:@[@"http://cn-api-test.ruixueyun.com/"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
//    [[RXService sharedSDK] initWithProductId:@"SDK"
//                                   channelId:@"iOS"
//                                        cpid:@"112"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"http://cn-api-demo.ruixuecloud.com"]];
//    [[RXWXService sharedSDK] configUniversallink:@"https://www.quicknb.com/"];
    
    // guiyangmj
//    [[RXWXService sharedSDK] configUniversallink:@"https://www2.weilemobile.com/wlappid141/"];
    
    
//    [[RXWXService sharedSDK] configUniversallink:@"https://api.7nightapp.com/ulink/"];
//    [[RXWXService sharedSDK] configUniversallink:@"https://open.adaptablenb.com"];

    // 喵克斯测试
//    [[RXService sharedSDK] initWithProductId:@"424"
//                                   channelId:@"101"
//                                        cpid:@"1000005"
//                                 baseUrlList:@[@"https://rx-api.weilemks.com"]];
//    [[RXWXService sharedSDK] configUniversallink:@"https://open.weileapp.com/cats/"];
    
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options
{
    [[RXSDK sharedSDK] application:app openURL:url options:options];
    
    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
    [[RXSDK sharedSDK] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
    
    return YES;
}

@end
