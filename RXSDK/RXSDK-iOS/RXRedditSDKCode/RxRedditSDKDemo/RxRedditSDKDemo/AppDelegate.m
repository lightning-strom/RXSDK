//
//  AppDelegate.m
//  RxRedditSDKDemo
//
//  Created by root11 on 2024/4/9.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXRedditSDK/RXRedditSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
@interface AppDelegate ()


@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor blackColor];
    self.window.rootViewController = [[UINavigationController alloc] initWithRootViewController:[[ViewController alloc] init]];
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
    //    G1hppG6SvuYA0j8B7XgKWg   bNaqOFUFMahiima4IU15ng https://ruixue.com/reddit/oauth2  
    [[RXRedditService sharedSDK] initWithClientID:@"MjsG77lLx0ndS4u8JPjqCw" redirectURI:@"http://localhost"];
    
    return YES;
}



@end
