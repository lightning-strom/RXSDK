//
//  AppDelegate.m
//  RXAdjustSDKDemo
//
//  Created by 陈汉 on 2023/8/10.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    UINavigationController *navc = [[UINavigationController alloc] initWithRootViewController:[ViewController new]];
    self.window.rootViewController = navc;
    
    [self.window makeKeyAndVisible];
    
    [[RXService sharedSDK] initWithProductId:@"000003"
                                   channelId:@"qq11"
                                        cpid:@"119"
                                 baseUrlList:@[@"http://os-api-test.ruixueyun.com"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"iOS"
//                                        cpid:@"114"
//                                 baseUrlList:@[@"http://cn-api-test.ruixueyun.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    return YES;
}

@end
