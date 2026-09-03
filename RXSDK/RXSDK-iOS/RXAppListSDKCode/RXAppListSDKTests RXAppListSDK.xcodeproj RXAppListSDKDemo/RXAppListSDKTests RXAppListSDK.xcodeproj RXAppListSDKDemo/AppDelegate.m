//
//  AppDelegate.m
//  RXAppListSDKTests RXAppListSDK.xcodeproj RXAppListSDKDemo
//
//  Created by 陈汉 on 2024/3/28.
//

#import "AppDelegate.h"
#import <RXAppListSDK/RXAppListSDK.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    [[RXAppListService sharedSDK] getAppInfoWithConfig:@{@"ts" : @(333), @"in" : @[@"rx_app_name", @"rx_package_id", @"rx_version", @"rx_teamid", @"rx_minimum_system_version", @"rx_vendor_name"]} complete:^(NSArray * _Nonnull result) {
        NSLog(@"");
    }];
    
    return YES;
}

@end
