//
//  AppDelegate.m
//  RXUIKit-OSDemo
//
//  Created by 陈汉 on 2023/6/15.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
//#import <RXWXSDK/RXWXSDK.h>
//#import <RXGoogleSDK/RXGoogleSDK.h>
//#import <RXLineSDK/RXLineSDK.h>
#import <RXFacebookSDK/RXFacebookSDK.h>
//#import <RXZaloSDK/RXZaloSDK.h>
//#import <RXTikTokSDK/RXTikTokSDK.h>
//#import <RXSnapChatSDK/RXSnapChatSDK.h>
//#import <RXInstagramSDK/RXInstagramSDK.h>
//#import <RXRedditSDK/RXRedditSDK.h>
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
    
    [[RXFacebookService sharedSDK] FBRegistWithApplication:application launchOptions:launchOptions];
    
//    [[RXService sharedSDK] initWithProductId:@"265"
//                                   channelId:@"2004"
//                                        cpid:@"1000040"
//                                 baseUrlList:@[@"https://rxapi.fishinggamezone.com/"] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"2001"
//                                   channelId:@"101"
//                                        cpid:@"1000189"
//                                 baseUrlList:@[@"https://r3269t.ipwana.com/"] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        
//    }];
        
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"iOS"
//                                        cpid:@"114"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"http://rxapi-test.jilinhaiqi.com"]];
    
//    [[RXService sharedSDK] initWithProductId:@"34"
//                                   channelId:@"101"
//                                        cpid:@"1000103"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"https://gochsyj.pwypyq.com/"]];
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"101"
//                                        cpid:@"112"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"http://rxapi.jilinhaiqi.com"]];
//
//    [[RXService sharedSDK] initWithProductId:@"263"
//                                   channelId:@"101"
//                                        cpid:@"1000038"
//                                     ipv4Url:@""
//                                 baseUrlList:@[@"https://yh9gc7be1n.hitoffapp.com/"]];
    
    // 美人国
//    [[RXService sharedSDK] initWithProductId:@"78460"
//                                   channelId:@"guge"
//                                        cpid:@"1000123"
//                                 baseUrlList:@[@"https://kfhrgc.beautifland.com"]];
    
    // 泰国棋牌
//    [[RXService sharedSDK] initWithProductId:@"78460"
//                                   channelId:@"IOS"
//                                        cpid:@"1000123"
//                                 baseUrlList:@[@"https://kfhrgc.beautifland.com"]];
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"iOS"
//                                        cpid:@"114"
//                                 baseUrlList:@[@"https://cn-api-test.ruixuecloud.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
//    [[RXService sharedSDK] initWithProductId:@"unity_test"
//                                   channelId:@"unity_test"
//                                        cpid:@"114"
//                                 baseUrlList:@[@"https://cn-api-test.ruixuecloud.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
//    [[RXService sharedSDK] setLanguage:@"zh"];
//    [[RXService sharedSDK] setInitParamsWithProductId:@"1002" channelId:@"iOS" cpid:@"114" baseUrlList:@"114" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//            
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"SDK"
//                                   channelId:@"iOS"
//                                        cpid:@"120"
//                                 baseUrlList:@[@"https://os-api-demo.ruixuecloud.com"] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//    }];
    
    // tongits
//    [[RXService sharedSDK] initWithProductId:@"FilmDreamer"
//                                   channelId:@"1002"
//                                        cpid:@"1000122"
//                                 baseUrlList:@[@"http://kvrjw.densetu-kantoku.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXService sharedSDK] initWithProfile:jsonString];
    
//    [[RXService sharedSDK] initWithProductId:@"421"
//                                   channelId:@"101"
//                                        cpid:@"1000005"
//                                 baseUrlList:@[@"https://rxapi2.weilemks.com"]];
    
//    [[RXService sharedSDK] initWithProductId:@"422"
//                                   channelId:@"100"
//                                        cpid:@"1000005"
//                                 baseUrlList:@[@"https://rxapi2.weilemks.com/"]];
    
//    [[RXService sharedSDK] initWithProductId:@"SDKOS"
//                                   channelId:@"iOSOS"
//                                        cpid:@"119"
//                                 baseUrlList:@[@"http://os-api-test.ruixueyun.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    [[RXService sharedSDK] setPasswordStrength:Average];
    
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
//
    
    [[RXService sharedSDK] setLanguage:@"en"];
//    [[RXInstagramService sharedSDK] initWithClientID:@"400197956108491" redirectURI:@"https://ruixue.com/instagram/oauth2"];
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
  
//    [[RXService sharedSDK] initWithProductId:@"SDK"
//                                   channelId:@"iOSOS"
//                                        cpid:@"120"
//                                 baseUrlList:@[@"http://os-api-demo.ruixuecloud.com"] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//    }];
    
//    [[RXService sharedSDK] initWithProductId:@"1002"
//                                   channelId:@"iOS"
//                                        cpid:@"114"
//                                 baseUrlList:@[@"http://cn-api-test.ruixueyun.com/"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
    [[RXService sharedSDK] setArea:@"EN"];
    
//    [[RXService sharedSDK] initWithProductId:@"264"
//                                   channelId:@"1002"
//                                        cpid:@"1000112"
//                                 baseUrlList:@[@"https://wygzt.homelandfishingarcade.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
//    
//    [[RXService sharedSDK] initWithProductId:@"unity_test"
//                                   channelId:@"unity_test"
//                                        cpid:@"114"
//                                 baseUrlList:@[@"https://cn-api-test.ruixuecloud.com"]
//                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//        if (!error) {
//            NSLog(@"初始化成功");
//        } else {
//            NSLog(@"初始化失败");
//        }
//    }];
    
//    [[RXTikTokService sharedSDK] TTRegistWithApplication:application launchOptions:launchOptions];
//    
//    [[RXWXService sharedSDK] configUniversallink:@"https://api.7nightapp.com/ulink/"];
//    [[RXZaloService sharedSDK] initWithAppId:@"1290303975374472026"];
//    [[RXRedditService sharedSDK] initWithClientID:@"G1hppG6SvuYA0j8B7XgKWg" redirectURI:@"https://ruixue.com/reddit/oauth2"];
    
    return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options{
//    if ([[RXWXService sharedSDK] handleOpenUrl:url]){
//        return YES;
//    }
//    if ([[RXGoogleService sharedSDK] GOpenURL:url]) {
//        return YES;
//    }
//    if ([[RXFacebookService sharedSDK] FBApplication:app openURL:url options:options]) {
//        return YES;
//    }
//    if ([[RXTikTokService sharedSDK] TTApplication:app openURL:url options:options]) {
//        return YES;
//    }
//    if ([[RXSnapChatService sharedSDK] application:app openURL:url options:options]) {
//        return YES;
//    }
//    if ([[RXZaloService sharedSDK] application:app openURL:url options:options]) {
//        return YES;
//    }
//    if ([[RXLineService sharedSDK] handleOpenURL:url]) {
//        return YES;
//    }

    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler {
//    if ([[RXWXService sharedSDK] handleOpenUniversalLink:userActivity]) {
//        return YES;
//    }
    return YES;
}

//- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
//    return UIInterfaceOrientationMaskLandscapeLeft | UIInterfaceOrientationMaskLandscapeRight;
//}

@end
