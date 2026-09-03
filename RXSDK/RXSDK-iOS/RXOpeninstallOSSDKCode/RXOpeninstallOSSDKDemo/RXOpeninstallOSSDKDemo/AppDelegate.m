//
//  AppDelegate.m
//  RXOpeninstallSDKDemo
//
//  Created by 陈汉 on 2025/11/18.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXOpeninstallOSSDK/RXOpeninstallOSSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

@interface AppDelegate ()

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    UINavigationController *navc = [[UINavigationController alloc] initWithRootViewController:[ViewController new]];
    self.window.rootViewController = navc;
    [self.window makeKeyAndVisible];
    
    [[RXOpeninstallService sharedSDK] regist];
    
    [self initWithRXComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            
        } else {

        }
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self initWithRXComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
        }];
    });
    
    return YES;
}

- (void)initWithRXComplete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete
{
    [[RXService sharedSDK] initWithProductId:@"SDKOS"
                                   channelId:@"iOSOS"
                                        cpid:@"119"
                                 baseUrlList:@[@"https://os-api-test.ruixueyun.com"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
    [[RXOpeninstallService sharedSDK] handleOpenUrl:url];
    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler{
    //处理通过openinstall一键拉起App时传递的数据
    [[RXOpeninstallService sharedSDK] continueUserActivity:userActivity];
    //其他第三方回调；
     return YES;
}

@end
