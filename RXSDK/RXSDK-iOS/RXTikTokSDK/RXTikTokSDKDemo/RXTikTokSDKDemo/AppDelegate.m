//
//  AppDelegate.m
//  RXTikTokSDKDemo
//
//  Created by 陈汉 on 2023/7/29.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXTikTokSDK/RXTikTokSDK.h>

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
    
    [[RXTikTokService sharedSDK] TTRegistWithApplication:application launchOptions:launchOptions];
    
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

//- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options
//{
//    return [[RXTikTokService sharedSDK] TTApplication:app openURL:url options:options];
//}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)optionsns {

    if ([[RXTikTokService sharedSDK] TTApplication:app openURL:url options:optionsns]) {
        return YES;
    }
    return NO;
}

@end
