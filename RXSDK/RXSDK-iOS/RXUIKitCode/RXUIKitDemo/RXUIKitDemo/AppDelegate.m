//
//  AppDelegate.m
//  RXUIKitDemo
//
//  Created by 陈汉 on 2022/3/8.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXWXSDK/RXWXSDK.h>
#import <RXUIKit/RXUIKit.h>

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
    
//    [[RXService sharedSDK] initWithProductId:@"433" channelId:@"101" cpid:@"1000037" baseUrlList:@[@"https://rxapi.xze601.com/"]];
    
//    [[RXService sharedSDK] initWithProductId:@"SDK"
//                                   channelId:@"iOS"
//                                        cpid:@"112"
//                                 baseUrlList:@[@"http://cn-api-demo.ruixueyun.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
////        [[RXService sharedSDK] setLanguage:@"zh"];
//    }];
//
//    [[RXService sharedSDK] initWithProductId:@"123321"
//                                   channelId:@"7871"
//                                        cpid:@"112"
//                                 baseUrlList:@[@"http://cn-api-demo.ruixuecloud.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        [[RXService sharedSDK] setLanguage:@"zh"];
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"142"
//                                   channelId:@"101"
//                                        cpid:@"1000102"
//                                 baseUrlList:@[@"https://umusblhbv.wjhmqn.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"199"
//                                   channelId:@"100"
//                                        cpid:@"1000368"
//                                 baseUrlList:@[@"https://d5tsg9.tkysjx.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
//    
//    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
//    config.productId = @"1002";
//    config.channelId = @"iOS";
//    config.cpId = @"114";
////    config.baseUrlList = @[@"http://cn-api-test.ruixueyun.com/", @"http://cn-api-v1-test.ruixueyun.com/", @"http://cn-api-v2-test.ruixueyun.com/", @"http://cn-api-v3-test.ruixueyun.com", @"http://cn-api-test.ruixuecloud4.com/"];
//    config.baseUrlList = @[@"https://cn-api-test.ruixueyun.com/"];
//    config.isUseDNS = YES;
//    config.openRacing = YES;
//    [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    // 斗地主
//    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
//    config.productId = @"34";
//    config.channelId = @"101";
//    config.cpId = @"1000103";
////    config.baseUrlList = @[@"http://cn-api-test.ruixueyun.com/", @"http://cn-api-v1-test.ruixueyun.com/", @"http://cn-api-v2-test.ruixueyun.com/", @"http://cn-api-v3-test.ruixueyun.com", @"http://cn-api-test.ruixuecloud4.com/"];
//    config.baseUrlList = @[@"https://gochsyj.pwypyq.com/"];
//    config.isUseDNS = YES;
//    config.openRacing = YES;
//    [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
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
    
//    RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
//    config.productId = @"198";
//    config.channelId = @"101";
//    config.cpId = @"1000197";
//    config.baseUrlList = @[@"https://winykn.jiaxiangyouxi.com"];
//    config.isUseDNS = YES;
//    config.usePrivacy = YES;
////    config.agreementMap = @{@"00001" : @"用户协议"};
//    [[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"423"
//                                   channelId:@"101"
//                                        cpid:@"1000005"
//                                 baseUrlList:@[@"https://v063mk.weilemks.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"265"
//                                   channelId:@"1002"
//                                        cpid:@"1000040"
//                                 baseUrlList:@[@"https://rxapi.fishinggamezone.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
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
    
//    [[RXService sharedSDK] initWithProductId:@"102"
//                                   channelId:@"100"
//                                        cpid:@"1000199"
//                                 baseUrlList:@[@"https://i3ixr7.weilefly.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"264"
//                                   channelId:@"214"
//                                        cpid:@"1000038"
//                                 baseUrlList:@[@"https://yh9gc7be1n.hitoffapp.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"264"
//                                   channelId:@"1001"
//                                        cpid:@"1000112"
//                                 baseUrlList:@[@"https://wygzt.homelandfishingarcade.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"ios_test"
//                                   channelId:@"IOS01"
//                                        cpid:@"119"
//                                 baseUrlList:@[@"http://os-api-test.ruixuecloud.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"433"
//                                   channelId:@"100"
//                                        cpid:@"1000037"
//                                 baseUrlList:@[@"https://ktxumynw.youlesns.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"421"
//                                   channelId:@"101"
//                                        cpid:@"1000005"
//                                 baseUrlList:@[@"https://v063mk.weilemks.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"34"
//                                   channelId:@"101"
//                                        cpid:@"1000103"
//                                 baseUrlList:@[@"https://gochsyj.pwypyq.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"101"
//                                        cpid:@"111"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"https://ruixue.weiletest.com"]];
    
//    [[RXService sharedSDK] initWithProductId:@"58"
//                                   channelId:@"207"
//                                        cpid:@"1000104"
//                                 baseUrlList:@[@"https://hn79w.jixiangweb.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"421"
//                                   channelId:@"101"
//                                        cpid:@"1000005"
//                                 baseUrlList:@[@"https://rxapi2.weilemks.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
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
    
//    [[RXService sharedSDK] initWithProductId:@"422"
//                                   channelId:@"100"
//                                        cpid:@"1000005"
//                                 baseUrlList:@[@"https://v063mk.weilemks.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"34"
//                                   channelId:@"101"
//                                        cpid:@"1000103"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"https://gochsyj.pwypyq.com/"]];
  
//    [[RXService sharedSDK] initWithProductId:@"34"
//                                   channelId:@"102"
//                                        cpid:@"1000104"
//                                 baseUrlList:@[@"https://rxapi-v3.xze603.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"SDK"
//                                   channelId:@"iOSOS"
//                                        cpid:@"120"
//                                 baseUrlList:@[@"http://os-api-demo.ruixuecloud.com"] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"hunanmajiang"
//                                   channelId:@"cpsios"
//                                        cpid:@"1000000"
//                                 baseUrlList:@[@"https://api.demo.ruixuecloud.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        NSLog(@"");
//    }];
    [[RXWXService sharedSDK] configUniversallink:@"https://api.7nightapp.com/ulink/"];
//    [[RXWXService sharedSDK] configUniversallink:@"https://www2.weilemobile.com/wlappid141/"];
    
    [[RXService sharedSDK] initWithProductId:@"263"
                                   channelId:@"101"
                                        cpid:@"1000038"
                                 baseUrlList:@[@"https://yh9gc7be1n.hitoffapp.com/"]
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
    }];
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"206"
//                                        cpid:@"1000101"
//                                 baseUrlList:@[@"https://anhvcpo.weilekuiming.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
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
    
    
    // 四川
//    [[RXService sharedSDK] initWithProductId:@"142"
//                                   channelId:@"101"
//                                        cpid:@"1000102"
//                                 baseUrlList:@[@"https://umusblhbv.wjhmqn.com/"] 
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
    // 家乡
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"101"
//                                        cpid:@"1000101"
//                                 baseUrlList:@[@"https://anhvcpo.weilekuiming.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//    }];
    
//    [[RXService sharedSDK] initWithProfile:jsonString];
    
//    [[RXService sharedSDK] initWithProductId:@"423"
//                                   channelId:@"101"
//                                        cpid:@"1000005"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"https://rxapi2.weilemks.com"]];
    
//    [[RXService sharedSDK] initWithProductId:@"422"
//                                   channelId:@"100"
//                                        cpid:@"1000005"
//                                 baseUrlList:@[@"https://rxapi2.weilemks.com/"]];
    
//    [[RXWXService sharedSDK] configUniversallink:@"https://api.7nightapp.com/ulink/"];
    
    
    [[RXService sharedSDK] setPasswordStrength:Average];
    
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
    
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options{
    if([[RXWXService sharedSDK] handleOpenUrl:url]){
        return YES;
    }

    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler {
    if ([[RXWXService sharedSDK] handleOpenUniversalLink:userActivity]) {
        return YES;
    }
    return YES;
}

- (BOOL)application:(UIApplication *)application shouldAllowExtensionPointIdentifier:(UIApplicationExtensionPointIdentifier)extensionPointIdentifier
{
    if (![RXUIKitService sharedSDK].allowExtensionPointIdentifier) {
        return NO;
    }
    return YES;
}

//- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
//    return UIInterfaceOrientationMaskLandscapeLeft | UIInterfaceOrientationMaskLandscapeRight;
//}

@end
