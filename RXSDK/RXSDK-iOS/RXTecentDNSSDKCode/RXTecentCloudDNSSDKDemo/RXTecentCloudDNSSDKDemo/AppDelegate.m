//
//  AppDelegate.m
//  RXTecentCloudDNSSDKDemo
//
//  Created by root11 on 2024/8/8.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXTecentCloudDNSSDK/RXTecentCloudDNSSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    [[RXTecentCloudDNSSDKService sharedSDK] initWithAppID:@"com.ruixue.sdkdemo" dnsID:86004 dnsKey:@"F0F03Gd9" debug:YES];
    
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
    
    self.window.backgroundColor = [UIColor blackColor];
    self.window.rootViewController = [[ViewController alloc] init];
    [self.window makeKeyAndVisible];
    return YES;
}




@end
