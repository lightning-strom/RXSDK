//
//  AppDelegate.m
//  RXFeedbackSDKDemo
//
//  Created by root11 on 2024/10/23.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor blackColor];
    
    self.window.rootViewController = [[ViewController alloc] init];
    [self.window makeKeyAndVisible];
    
    [[RXService sharedSDK] setLanguage:@"en"];
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
    [[RXService sharedSDK] initWithProductId:@"1002"
                                   channelId:@"iOS"
                                        cpid:@"114"
                                 baseUrlList:@[@"https://cn-api-test.ruixuecloud.com"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
    return YES;
}




@end
