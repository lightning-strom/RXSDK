//
//  AppDelegate.m
//  RXGoogleSDKDemo
//
//  Created by 陈汉 on 2024/5/6.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXGoogleSDK/RXGoogleSDK.h>
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
                                 baseUrlList:@[@"http://os-api-test.ruixuecloud.com"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
    [[RXGoogleService sharedSDK] GRegistWithClientID:@"875255664003-eorr371qavp578ro0beafnfudr4upf1c.apps.googleusercontent.com"];
    
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options{

    if ([[RXGoogleService sharedSDK] GOpenURL:url]) {
        return YES;
    }

    return YES;
}

@end
