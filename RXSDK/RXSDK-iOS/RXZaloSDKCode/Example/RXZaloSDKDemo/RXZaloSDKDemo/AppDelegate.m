//
//  AppDelegate.m
//  RXZaloSDKDemo
//
//  Created by 陈汉 on 2024/3/22.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXZaloSDK/RXZaloSDK.h>
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
    
    [[RXZaloService sharedSDK] initWithAppId:@"1290303975374472026"];
    
    [[RXService sharedSDK] initWithProductId:@"265"
                                   channelId:@"2002"
                                        cpid:@"1000040"
                                 baseUrlList:@[@"https://rxapi.fishinggamezone.com/"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
//
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
    
//    [[RXService sharedSDK] initWithProductId:@"264"
//                                   channelId:@"1001"
//                                        cpid:@"1000112"
//                                 baseUrlList:@[@"https://wygzt.homelandfishingarcade.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options{
    if ([[RXZaloService sharedSDK] application:app openURL:url options:options]) {
        return YES;
    }

    return YES;
}

@end
