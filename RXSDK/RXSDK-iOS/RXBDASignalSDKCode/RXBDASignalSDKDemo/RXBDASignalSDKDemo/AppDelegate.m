//
//  AppDelegate.m
//  RXBDASignalSDKDemo
//
//  Created by 陈汉 on 2025/3/5.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXBDASignalSDK/RXBDASignalSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

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
    
    [RXBDAsignalService sharedSDK];
    
    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
    config.productId = @"1002";
    config.channelId = @"iOS";
    config.cpId = @"114";
    config.baseUrlList = @[@"https://cn-api-test.ruixueyun.com/"];
    config.isUseDNS = YES;
    config.openRacing = NO;
    config.launchOptions = launchOptions;
    [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
//    [[RXBDAsignalService sharedSDK] windowDidFinishLaunchingWithOptions:launchOptions connectOptions:nil];
//    [[RXBDAsignalService sharedSDK] enableIdfa:YES];
    
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options{

    if ([[RXBDAsignalService sharedSDK] application:app openURL:url options:options]) {
        return YES;
    }
     
    return YES;
}

@end
