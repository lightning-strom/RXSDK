//
//  AppDelegate.m
//  RXGDTSDKDemo
//
//  Created by 陈汉 on 2025/12/1.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXGDTSDK/RXGDTSDK.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    UINavigationController *navc = [[UINavigationController alloc] initWithRootViewController:[ViewController new]];
    self.window.rootViewController = navc;
    [self.window makeKeyAndVisible];
    
    [[RXGDTService sharedSDK] regist];
    
//    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
//    config.productId = @"1002";
//    config.channelId = @"iOS";
//    config.cpId = @"114";
//    config.baseUrlList = @[@"https://cn-api-test.ruixueyun.com/"];
//    config.isUseDNS = YES;
//    config.openRacing = NO;
//    [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    [[RXService sharedSDK] initWithProductId:@"263"
                                   channelId:@"101"
                                        cpid:@"1000038"
                                 baseUrlList:@[@"https://yh9gc7be1n.hitoffapp.com"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
    return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    [[RXGDTService sharedSDK] logAction:@"START_APP" actionParam:@{}];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
    [[RXGDTService sharedSDK] handleOpenUrl:url];
    return YES;
}

@end
