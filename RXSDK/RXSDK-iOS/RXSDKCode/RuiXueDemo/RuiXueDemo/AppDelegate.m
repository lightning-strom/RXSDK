//
//  AppDelegate.m
//  RuiXueDemo
//
//  Created by 陈汉 on 2021/9/26.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import "ViewController1.h"
//#import <RXSDK/RXSDK.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <objc/runtime.h>
#import <UserNotifications/UserNotifications.h>
//#import <RXSDK_OS/RXSDK_OS.h>
//#import <RXWXSDK/RXWXSDK.h>
#import <RXPushSDK/RXPushSDK.h>
//#import <RXASAKit/RXASAKit.h>
//#import <RXZaloSDK/RXZaloSDK.h>
//#import <RXWXSDK_Pay/RXWXSDK_Pay.h>
//#import <AlicloudHttpDNS/AlicloudHttpDNS.h>
#import <RXTecentCloudDNSSDK/RXTecentCloudDNSSDK.h>
#import <RXAliCloudDNSSDK/RXAliCloudDNSSDK.h>
#import <RXASAKit/RXASAKit.h>
//#import <RXBDASignalSDK/RXBDASignalSDK.h>

@interface AppDelegate ()

@property (nonatomic, assign) BOOL allowRotation;//是否允许转向

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor blackColor];
    
    ViewController *rootVC = [[ViewController alloc] init];

    UINavigationController *naVC = [[UINavigationController alloc] initWithRootViewController:rootVC];
    self.window.rootViewController = naVC;
    [self.window makeKeyAndVisible];
    
    _allowRotation = [[NSUserDefaults standardUserDefaults] boolForKey:@"rotation"];
    
    [[RXASAService sharedSDK] regist];
    
    // 海外：http://rxapi.weilestar.com/
    // 国内：http://ruixue.weiletest.com/

    //    [[RXTecentCloudDNSSDKService sharedSDK] initWithAppID:@"com.ruixue.sdkdemo" dnsID:86004 dnsKey:@"F0F03Gd9" debug:YES];
    [[RXAliCloudDNSSDKService sharedSDK] initWithAccountID:121716 secretKey:@"6009b68f8ec3b44d0bc630e4fe869178" debug:YES];
    
    // 捕鱼测试
//    [[RXService sharedSDK] initWithAppId:@"433" channelId:@"101" cpid:@"1000037" baseUrlList:@[@"https://rxapi.xze601.com/"]];
//    [[RXWXService sharedSDK] configUniversallink:@"https://open.adaptablenb.com/jxfish/"];

    // 棋牌正式
//    [[RXService sharedSDK] initWithProductId:@"58"
//                                   channelId:@"102"
//                                        cpid:@"1000104"
//                                 baseUrlList:@[@"https://rxapi-v3.xze603.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
////        [[RXLogService sharedSDK] addLogWithEvent:@"test1111" distinctId:@"" properties:@{@"public" : @"33"}];
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"yjhc"
//                                   channelId:@"yjhcan"
//                                        cpid:@"1000270"
//                                 baseUrlList:@[@"https://yja8p5.wqpek.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
////        [[RXLogService sharedSDK] addLogWithEvent:@"test1111" distinctId:@"" properties:@{@"public" : @"33"}];
//    }];
    
//    [[RXLogService sharedSDK] addLogWithEvent:@"test1111" distinctId:@"" properties:nil];
    // 喵克斯 weiletest
//    [[RXService sharedSDK] initWithProductId:@"424"
//                                   channelId:@"102"
//                                        cpid:@"111"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"https://ruixue.weiletest.com/"]];
    
//    [[RXService sharedSDK] initWithProductId:@"ID-iOS"
//                                   channelId:@"iOS"
//                                        cpid:@"1000041"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"https://rxapi.jiaxiangfriend.com/"]];
    
    
    
//    [[RXLogService sharedSDK] addLogWithEvent:@"test1111" distinctId:@"" properties:nil];
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"101"
//                                        cpid:@"111"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"https://ruixue.weiletest.com"]];
    
//    [[RXService sharedSDK] initWithProductId:@"SDK"
//                                   channelId:@"iOS"
//                                        cpid:@"112"
//                                 baseUrlList:@[@"https://cn-api-demo. ruixueyun.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    // 家乡
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"101"
//                                        cpid:@"1000101"
//                                 baseUrlList:@[@"https://anhvcpo.weilekuiming.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"100"
//                                        cpid:@"1000101"
//                                 baseUrlList:@[@"https://anhvcpo.weilekuiming.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//    }];
    
    // 伏魔
//    [[RXService sharedSDK] initWithProductId:@"102"
//                                   channelId:@"100"
//                                        cpid:@"1000199"
//                                 baseUrlList:@[@"https://i3ixr7.weilefly.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"68"
//                                   channelId:@"818"
//                                        cpid:@"1000113"
//                                 baseUrlList:@[@"https://asiok9.mbwaljd.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    
//    [[RXService sharedSDK] initWithProductId:@"SDK"
//                                   channelId:@"iOS"
//                                        cpid:@"120"
//                                 baseUrlList:@[@"http://os-api-demo. ruixueyun.com"] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//    }];
    
//    [[RXService sharedSDK] setInitParamsWithProductId:@"1002" channelId:@"101" cpid:@"112" baseUrlList:@[@"http://rxapi.jilinhaiqi.com"] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            
//    }];
    
    // tongits
//    [[RXService sharedSDK] initWithProductId:@"266"
//                                   channelId:@"1003"
//                                        cpid:@"1000107"
//                                 baseUrlList:@[@"http://rxapi.tongitstara.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
  
    // 缘之守护
//    [[RXService sharedSDK] initWithProductId:@"YZSH"
//                                   channelId:@"888"
//                                        cpid:@"1000121"
//                                 baseUrlList:@[@"https://rty56a.bestmyweile.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    // 棋牌斗地主
//    [[RXService sharedSDK] initWithProductId:@"34"
//                                   channelId:@"100"
//                                        cpid:@"1000103"
//                                 baseUrlList:@[@"https://gochsyj.pwypyq.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
    // 吉祥捕鱼
//    [[RXService sharedSDK] initWithProductId:@"434"
//                                   channelId:@"100"
//                                        cpid:@"1000037"
//                                 baseUrlList:@[@"https://ktxumynw.youlesns.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"yycs"
//                                   channelId:@"gnjh002"
//                                        cpid:@"1000214"
//                                 baseUrlList:@[@"https://a9p3i6.yzkdux.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    [[RXService sharedSDK] setLanguage:@"zh"];

//    [[RXWXService sharedSDK] configUniversallink:@"https://www2.weilemobile.com/wlappid141/"];
    
//    [[RXZaloService sharedSDK] initWithAppId:@"1290303975374472026"];
    
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(10 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    

//    [[RXService sharedSDK] initWithProductId:@"34"
//                                   channelId:@"101"
//                                        cpid:@"1000103"
//                                 baseUrlList:@[@"https://gochsyj.pwypyq.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//            
//            [[RXLogService sharedSDK] trackConfigWithReportTime:10
//                                                       maxCount:30];
////            [[RXLogService sharedSDK] addLogWithEvent:@"123" distinctId:nil properties:nil];
//            
//            [[RXLogService sharedSDK] dataTrackWithEvent:@"333" distinctId:nil properties:nil];
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
//    
//    [[RXPushService sharedSDK] initWithProductId:@"34"
//                                       channelId:@"101"
//                                            cpid:@"1000103"
//                                     baseUrlList:@[@"https://gochsyj.pwypyq.com"]];
    
//    [[RXService sharedSDK] setIAPProductId:@"com.ruixue.sdkdemo2" timeout:2];
//    [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:@"11" client_version:@"1.2.7" games:nil activities:nil type:@"js" json:@"json" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSString *jsonString = response[@"data"];
//            NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
//            NSDictionary *dictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
//        }
//    }];
//    
//    [[RXService sharedSDK] initWithProductId:@"109"
//                                   channelId:@"2004"
//                                        cpid:@"1000215"
//                                 baseUrlList:@[@"https://i4ksyn.dummygameth.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//            [[RXLogService sharedSDK] trackConfigWithReportTime:10
//                                                       maxCount:30];
//            [[RXLogService sharedSDK] addLogWithEvent:@"123" distinctId:nil properties:nil];
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXASAService sharedSDK] regist];
    
//    [[RXService sharedSDK] initWithProductId:@"264"
//                                   channelId:@"100"
//                                        cpid:@"1000038"
//                                 baseUrlList:@[@"https://yh9gc7be1n.hitoffapp.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
//    
//    
//
//    [[RXPushService sharedSDK] initWithProductId:@"1002"
//                                       channelId:@"iOS"
//                                            cpid:@"114"
//                                     baseUrlList:@[@"http://cn-api-test.ruixueyun.com/"]];
//    
    [[RXPushService sharedSDK] initUserNotificationCenter:self];
    
    [[RXService sharedSDK] setArea:@"CN"];
    
//    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
//    config.productId = @"1002";
//    config.channelId = @"iOS";
//    config.cpId = @"114";
//    config.baseUrlList = @[@"https://cn-api-test.ruixueyun.com/"];
//    config.isUseDNS = YES;
//    config.openRacing = NO;
//    [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
//    
    // 海外捕鱼
//    [[RXService sharedSDK] initWithProductId:@"301"
//                                   channelId:@"1002"
//                                        cpid:@"1000361"
//                                 baseUrlList:@[@"https://omlhj-api.nacardgame.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    [[RXService sharedSDK] initWithProductId:@"107"
                                   channelId:@"1002"
                                        cpid:@"1000350"
                                 baseUrlList:@[@"https://rxapi.mahjongsakura.com"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"初始化成功");
        } else {
            NSLog(@"初始化失败");
        }
    }];
    
//    [[RXService sharedSDK] initWithProductId:@"666"
//                                   channelId:@"100"
//                                        cpid:@"1000104"
//                                 baseUrlList:@[@"https://rxapi-v3.xze603.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    [[RXService sharedSDK] setPasswordStrength:Average];
        
//    [[RXService sharedSDK] initWithProductId:@"264"
//                                   channelId:@"2004"
//                                        cpid:@"1000112"
//                                 baseUrlList:@[@"https://wygzt.homelandfishingarcade.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//
    
    [[RXService sharedSDK] setArea:@"JP"];
    
//    [[RXService sharedSDK] initWithProductId:@"SDKOS"
//                                   channelId:@"iOSOS"
//                                        cpid:@"119"
//                                 baseUrlList:@[@"https://os-api-test.ruixueyun.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"3166"
//                                   channelId:@"1002"
//                                        cpid:@"1000317"
//                                 baseUrlList:@[@"https://xextog.dominogm.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"siya_dev"
//                                   channelId:@"siya_dev"
//                                        cpid:@"1000346"
//                                 baseUrlList:@[@"https://rx-siya-cpapi.siyau.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    // 斗地主
//    [[RXService sharedSDK] initWithProductId:@"421"
//                                   channelId:@"101"
//                                        cpid:@"1000005"
//                                 baseUrlList:@[@"https://v063mk.weilemks.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    // 四川
//    [[RXService sharedSDK] initWithProductId:@"142"
//                                   channelId:@"100"
//                                        cpid:@"1000102"
//                                 baseUrlList:@[@"https://umusblhbv.wjhmqn.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//            
//            [[RXLogService sharedSDK] trackConfigWithReportTime:1000
//                                                       maxCount:300];
//            //            [[RXLogService sharedSDK] addLogWithEvent:@"123" distinctId:nil properties:nil];
//            
//            [[RXLogService sharedSDK] dataTrackWithEvent:@"333" distinctId:nil properties:nil];
//        } else {
//            NSLog(@"初始化失败");
//            [[RXLogService sharedSDK] trackConfigWithReportTime:10
//                                                       maxCount:3];
//            //            [[RXLogService sharedSDK] addLogWithEvent:@"123" distinctId:nil properties:nil];
//            
//            [[RXLogService sharedSDK] dataTrackWithEvent:@"333" distinctId:nil properties:nil];
//        }
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"2001"
//                                   channelId:@"100"
//                                        cpid:@"1000105"
//                                 baseUrlList:@[@"http://rxapi.jiaxiangnetwork.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];

    // 吉祥捕鱼
//    [[RXService sharedSDK] initWithProductId:@"434"
//                                   channelId:@"209"
//                                        cpid:@"1000037"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"https://ktxumynw.youlesns.com/"]];
    
//    [[RXWXService sharedSDK] configUniversallink:@"https://api.7nightapp.com/ulink/"];
//    [[RXWXPayService sharedSDK] configUniversallink:@"https://api.7nightapp.com/ulink/"];

    
    [[RXService sharedSDK] setPasswordStrength:Average];
    

    
//    [[RXBDAsignalService sharedSDK] didFinishLaunchingWithOptions:launchOptions connectOptions:nil];

    return YES;
}

//- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
//    return UIInterfaceOrientationMaskLandscapeLeft | UIInterfaceOrientationMaskLandscapeRight;
//}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    //处理接收到的推送通知
    if (@available(iOS 10.0,*)) {
        completionHandler(UIBackgroundFetchResultNoData);
    }else {
        completionHandler(UIBackgroundFetchResultNewData);
    }
//    UIAlertAction *cancelAction=[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
//    }];
//    UIAlertController *alertController=[UIAlertController alertControllerWithTitle:@"收到推送" message:[NSString stringWithFormat:@"%@", userInfo] preferredStyle:UIAlertControllerStyleAlert];
//    [alertController addAction:cancelAction];
//    [[self currentViewController] presentViewController:alertController animated:YES completion:nil];
}

//-(BOOL)shouldAutorotate{
//   return YES;
//}
//
//// 设置屏幕方向
//- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
//    return UIInterfaceOrientationMaskLandscapeRight;
//}


- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options{
    
    [[RXSDK sharedSDK] application:app openURL:url options:options];
    return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    [RXApiService getIDFA];
}

#pragma mark - 注册APNS
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    if (![deviceToken isKindOfClass:[NSData class]]) return;
    NSString *pushToken=@"";
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 13.0) {
        const unsigned *tokenBytes = [deviceToken bytes];
        pushToken = [NSString stringWithFormat:@"%08x %08x %08x %08x %08x %08x %08x %08x",
                     ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                     ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                     ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];
    }
    else{
        pushToken = [NSString stringWithFormat:@"%@", deviceToken];
        if (pushToken != nil && pushToken.length> 3) {
            pushToken = [pushToken substringFromIndex:1];
            pushToken = [pushToken substringToIndex:pushToken.length -1];
        }
    }
    NSLog(@"deviceToken= %@", pushToken);
    [[NSUserDefaults standardUserDefaults] setValue:deviceToken forKey:@"deciceToken"];
//    [[RXPushService sharedSDK] registerDeviceToken:deviceToken openId:@"openId" complete:^(BOOL success, NSError * _Nonnull error) {
//            
//    }];
}

- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
    NSLog(@"");
}

- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
    NSLog(@"");
}

@end
