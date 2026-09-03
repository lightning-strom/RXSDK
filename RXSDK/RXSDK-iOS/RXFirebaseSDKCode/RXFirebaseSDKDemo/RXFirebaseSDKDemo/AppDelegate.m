//
//  AppDelegate.m
//  RXFirebaseSDKDemo
//
//  Created by 陈汉 on 2023/8/12.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXFirebaseSDK/RXFirebaseSDK.h>
#import <RXFirebaseSDK/RXFIRAnalyticsService.h>

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
    
    [[RXFirebaseService sharedSDK] configure];
    
//    [[RXFIRAnalyticsService sharedSDK] initiateOnDeviceConversionMeasurementWithEmailAddress:@"chenhanmail1@163.com"];
    [[RXFIRAnalyticsService sharedSDK] initiateOnDeviceConversionMeasurementWithEmailAddress:nil];
    
    return YES;
}

@end
