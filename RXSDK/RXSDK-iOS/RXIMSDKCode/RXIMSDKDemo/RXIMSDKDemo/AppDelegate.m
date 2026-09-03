//
//  AppDelegate.m
//  RXIMSdkDemo
//
//  Created by 陈汉 on 2021/8/18.
//

#import "AppDelegate.h"
#import "ViewController.h"
//#import <RXIMSdk/RXIMSdk.h>
#import <RXIMSdk_business/RXIMSdk_business.h>
#import <Business/Business.h>
#ifdef DEBUG
//#import <DoraemonKit/DoraemonManager.h>
#endif

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
#ifdef DEBUG
//    [[DoraemonManager shareInstance] install];
#endif
    
    //IM初始化
//    [[RXIMSDKManager sharedSDK] initW  ithProductId:@"test_product" channelId:@"test_channel" cpid:1000000 clientType:262657 version:@"v1.0.0" baseUrl:@"http://ruixue.weiletest.com"];
//    [[RXIMSDKManager sharedSDK] initWithProductId:@"68" channelId:@"818" cpid:1000113 clientType:262657 version:@"v1.0.0" baseUrl:@"https://asiok9.mbwaljd.com/"];
    [[RXIMSDKManager sharedSDK] initWithProductId:@"1002" channelId:@"iOS" cpid:114 clientType:262657 version:@"v1.0.0" baseUrl:@"http://cn-api-test.ruixuecloud.com/"];
    
    //        [[RXService sharedSDK] initWithProductId:@"1002"
    //                                       channelId:@"iOS"
    //                                            cpid:@"114"
    //                                     baseUrlList:@[@"http://cn-api-test.ruixuecloud.com/"]
    //                                        complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    //            if (!error) {
    //                NSLog(@"初始化成功");
    //            } else {
    //                NSLog(@"初始化失败");
    //            }
    //        }];
    //    [[RXService sharedSDK] initWithProductId:@"SDK"
    //                                   channelId:@"iOS"
    //                                        cpid:@"112"
    //                                 baseUrlList:@[@"https://cn-api-demo.ruixuecloud.com"]
    //                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    //        if (!error) {
    //            NSLog(@"初始化成功");
    //        } else {
    //            NSLog(@"初始化失败");
    //        }
    //    }];
    
//    [[RXIMSDKManager sharedSDK] initWithProductId:rootVC.productId channelId:rootVC.channelId cpid:rootVC.cpId clientType:262657 version:@"v1.0.0" baseUrl:rootVC.domain];
//    [[RXIMSDKManager sharedSDK] initWithProductId:@"test_product" channelId:@"test_channel" cpid:1000000 clientType:262657 version:@"v1.0.0" baseUrl:@"https://api.demo.ruixueyun.com"];
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor whiteColor];
    ViewController *rootVC = [[ViewController alloc] init];
    self.window.rootViewController = rootVC;
    [self.window makeKeyAndVisible];

    return YES;
}

@end
