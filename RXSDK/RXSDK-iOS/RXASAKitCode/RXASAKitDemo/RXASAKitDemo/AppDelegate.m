//
//  AppDelegate.m
//  RXASAKitDemo
//
//  Created by 陈汉 on 2024/10/22.
//

#import "AppDelegate.h"
#import <RXASAKit/RXASAKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    [RXASAService sharedSDK];
    
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    config.productId = @"1002";
    config.channelId = @"iOS";
    config.cpId = @"114";
    config.baseUrlList = @[@"https://cn-api-test.ruixueyun.com/"];
    config.isUseDNS = YES;
    config.openRacing = NO;
    [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
    return YES;
}

@end
