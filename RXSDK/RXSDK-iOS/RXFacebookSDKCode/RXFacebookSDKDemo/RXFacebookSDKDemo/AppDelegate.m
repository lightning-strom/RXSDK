//
//  AppDelegate.m
//  RXFacebookSDKDemo
//
//  Created by 陈汉 on 2023/7/19.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXFacebookSDK/RXFacebookSDK.h>
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
    
    
    [[RXService sharedSDK] initWithProductId:@"SDKOS"
                                   channelId:@"iOSOS"
                                        cpid:@"119"
                                 baseUrlList:@[@"http://os-api-test.ruixueyun.com"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
//    [[RXService sharedSDK] initWithProductId:@"264"
//                                   channelId:@"2004"
//                                        cpid:@"1000112"
//                                 baseUrlList:@[@"https://wygzt.homelandfishingarcade.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
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
    
//    [[RXService sharedSDK] setLanguage:@"vi"];
    
//    老闆別這樣， 該出海捕魚了
    
    [[RXLogService sharedSDK] configWithReportTime:5 maxCount:5];
    
    [[RXFacebookService sharedSDK] FBRegistWithApplication:application launchOptions:launchOptions];
    
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
    return [[RXFacebookService sharedSDK] FBApplication:app openURL:url options:options];
}

@end
