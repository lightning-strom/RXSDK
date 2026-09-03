//
//  AppDelegate.m
//  RXLineSDKDemo
//
//  Created by 陈汉 on 2023/3/8.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXLineSDK/RXLineSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor blackColor];
    
    ViewController *rootVC = [[ViewController alloc] init];

    UINavigationController *naVC = [[UINavigationController alloc] initWithRootViewController:rootVC];
    self.window.rootViewController = naVC;
    [self.window makeKeyAndVisible];
    
    [[RXService sharedSDK] initWithProductId:@"1002"
                                   channelId:@"101"
                                        cpid:@"1000049"
                                 baseUrlList:@[@"https://ruixue.weiletest.com/",
                                               @"https://ruixue.weiletest.com1/",
                                               @"https://ruixue.weiletest.com2/"]];
    
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary *)options
{
    return [[RXLineService sharedSDK] handleOpenURL:url];
}

@end
