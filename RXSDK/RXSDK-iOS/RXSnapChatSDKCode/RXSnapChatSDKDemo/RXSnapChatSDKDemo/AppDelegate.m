//
//  AppDelegate.m
//  RXSnapChatSDKDemo
//
//  Created by 陈汉 on 2024/4/3.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXSnapChatSDK/RXSnapChatSDK.h>
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
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"iOS"
//                                        cpid:@"114"
//                                 baseUrlList:@[@"http://cn-api-test.ruixuecloud.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];   
    
    [[RXService sharedSDK] initWithProductId:@"SDKOS"
                                   channelId:@"iOSOS"
                                        cpid:@"119"
                                 baseUrlList:@[@"http://os-api-test.ruixuecloud.com/"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];   
    
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
    if ([[RXSnapChatService sharedSDK] application:app openURL:url options:options]) {
        return YES;
    }
    return YES;
}

@end
