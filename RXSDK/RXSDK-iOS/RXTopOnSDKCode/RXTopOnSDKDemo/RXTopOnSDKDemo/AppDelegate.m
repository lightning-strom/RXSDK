//
//  AppDelegate.m
//  RXTopOnSDKDemo
//
//  Created by root11 on 2024/5/24.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import <RXTopOnSDK/RXTopOnSDK.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>


@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.backgroundColor = [UIColor blackColor];
    
//MARK: 分隔符中的 setHeaderBiddingTestModeWithDeviceID、setDebuggerConfig、umpTestDeviceIdentifiers、umpGeography相关测试调试代码，上线时需要移除
/**********************************************************************************************/
    // 设置测试的idfa，例如Meta广告测试设备等
    [RXTopOnInitManager setHeaderBiddingTestModeWithDeviceID:@"ACDBB022-CB4E-4F8B-BB0B-077BFBCDA1BA"];
    
    // 注意事项：调用该代码，广告请求会使用服务器下发的广告配置，如果测试完成，需要使用自己的广告配置，需要把这段去掉。
    [RXTopOnInitManager setDebuggerConfig:^(ATDebuggerConfig *debuggerConfig) {
        
//注：官方提供的测试模式下，adMob的插屏广告源中的开屏广告源缺失；为了测试功能完整性，netWorkType使用百度平台进行了以上缺失广告源的相关功能的测试.
        debuggerConfig.deviceIdfaStr = @"ACDBB022-CB4E-4F8B-BB0B-077BFBCDA1BA";

        debuggerConfig.netWorkType = ATAdNetWorkAdmobType;
//        debuggerConfig.netWorkType = ATAdNetWorkBaiduType;
        // admob
        debuggerConfig.adMob_rewardVideoAdType = ATAdMobRewardVideoAdDefaultType;
        debuggerConfig.adMob_bannerAdType = ATAdMobBannerAdDefaultType;
//        debuggerConfig.adMob_interstitialAdType = ATAdMobInterstitialAdPictureType;
        debuggerConfig.adMob_interstitialAdType = ATAdMobInterstitialAdVideoType;
        debuggerConfig.adMob_splashAdType = ATAdMobSplashAdDefaultType;
        debuggerConfig.adMob_nativeAdType = ATAdMobNativeAdPictureType;
//        debuggerConfig.adMob_nativeAdType = ATAdMobNativeAdVideoType;
        
        // GDT
        debuggerConfig.gdt_nativeAdType = ATGDTNativeAdVideoTemplateType;
        debuggerConfig.gdt_interstitialAdType = ATGDTInterstitialAdFullScreenVideoType;

        // Meta
        debuggerConfig.meta_nativeAdType = ATMetaNativeAdNativeBannerSelfRenderType;

        // 快手
        debuggerConfig.kuaiShou_nativeAdType = ATKuaiShouNativeAdDrawFeedType;

        // Nend
        debuggerConfig.nend_interstitialAdType = ATNendInterstitialAdFullScreenType;

        // 穿山甲
        debuggerConfig.csj_nativeAdType = ATCSJNativeAdFeedSelfRenderType;

        // MTG
        debuggerConfig.mintegral_nativeAdType = ATMintegralNativeAdSelfRenderType;
        debuggerConfig.mintegral_interstitialAdType = ATMintegralInterstitialAdVideoType;

        // 百度
        debuggerConfig.baidu_nativeAdType = ATBaiduNativeAdTemplateType;
        debuggerConfig.baidu_interstitialAdType = ATBaiduInterstitialAdFullScreenVideoType;
        debuggerConfig.baidu_splashAdType = ATBaiduSplashAdDefaultType;
        
    }];
    
    /**
     * 上线前需要移除此测试代码。模拟在欧盟地区弹出UMP GDPR弹窗
     *umpTestDeviceIdentifiers可以通过调用ATAPI单例中的showGDPRConsentDialogInViewController:dismissalCallback:方法后，在console控制台日志中过滤“UMPDebugSettings.testDeviceIdentifiers”获取
     */
//    [ATSDKGlobalSetting sharedManager].umpTestDeviceIdentifiers = @[@"ACDBB022-CB4E-4F8B-BB0B-077BFBCDA1BA"];
//    [ATSDKGlobalSetting sharedManager].umpGeography = ATUMPDebugGeographyEEA;
    
/**********************************************************************************************/
    
    [RXTopOnInitManager setLogEnabled:YES];//打开日志开关，打包上线时需关闭
    [RXTopOnInitManager integrationChecking];
    [[RXTopOnInitManager sharedSDK] setSystemPlatformType:ATSystemPlatformTypeIOS];
    
    if (@available(iOS 14, *)) {
        //iOS 14
        [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
            [[RXTopOnInitManager sharedSDK] startWithAppID:kTopOnAppID appKey:kTopOnAppKey error:nil];
            //to do something，like preloading
        }];
    } else {
        [[RXTopOnInitManager sharedSDK] startWithAppID:kTopOnAppID appKey:kTopOnAppKey error:nil];
    }
    
    
    //MARK: 应用在欧盟范围且使用了admob sdk，使用UMP流程设置GDPR，再初始化广告sdk；建议在ViewController中执行此代码
    /*
    [[RXTopOnInitManager sharedSDK] getUserLocationWithCallback:^(ATUserLocation location) {
        if (location == ATUserLocationInEU) {
            [[RXTopOnInitManager sharedSDK] showGDPRConsentDialogInViewController:[self currentViewController] dismissalCallback:^{
                if (@available(iOS 14, *)) {
                    //iOS 14
                    [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
                        [[RXTopOnInitManager sharedSDK] startWithAppID:kTopOnAppID appKey:kTopOnAppKey error:nil];
                        //to do something，like preloading
                    }];
                } else {
                    [[RXTopOnInitManager sharedSDK] startWithAppID:kTopOnAppID appKey:kTopOnAppKey error:nil];
                }
                
           }];
        }else{
            if (@available(iOS 14, *)) {
                //iOS 14
                [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
                    [[RXTopOnInitManager sharedSDK] startWithAppID:kTopOnAppID appKey:kTopOnAppKey error:nil];
                    //to do something，like preloading
                }];
            } else {
                [[RXTopOnInitManager sharedSDK] startWithAppID:kTopOnAppID appKey:kTopOnAppKey error:nil];
            }
            
        }
    }];
    */
    
    //MARK: 应用在欧盟范围且未使用admob sdk，使用正常的流程设置GDPR，再初始化广告sdk；建议在ViewController中执行此代码
    /*
    [[RXTopOnInitManager sharedSDK] getUserLocationWithCallback:^(ATUserLocation location) {
        if (location == ATUserLocationInEU && [RXTopOnInitManager sharedSDK].dataConsentSet == ATDataConsentSetUnknown) {
            [[RXTopOnInitManager sharedSDK] presentDataConsentDialogInViewController:[self currentViewController] loadingFailureCallback:^(NSError *error) {
                
            } dismissalCallback:^{
                if (@available(iOS 14, *)) {
                    //iOS 14
                    [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
                        [[RXTopOnInitManager sharedSDK] startWithAppID:kTopOnAppID appKey:kTopOnAppKey error:nil];
                        //to do something，like preloading
                    }];
                } else {
                    [[RXTopOnInitManager sharedSDK] startWithAppID:kTopOnAppID appKey:kTopOnAppKey error:nil];
                }
            }];
        }else{
            if (@available(iOS 14, *)) {
                //iOS 14
                [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
                    [[RXTopOnInitManager sharedSDK] startWithAppID:kTopOnAppID appKey:kTopOnAppKey error:nil];
                    //to do something，like preloading
                }];
            } else {
                [[RXTopOnInitManager sharedSDK] startWithAppID:kTopOnAppID appKey:kTopOnAppKey error:nil];
            }
            
        }
    }];
    */
            
   /*Ogury广告平台的的GDPR设置
   [[ConsentManager sharedManager] askWithViewController:myViewController assetKey:@"you assetKey" andCompletionBlock:^(NSError * error, ConsentManagerAnswer answer) {
       if(answer == 2){
            [[RXTopOnInitManager sharedSDK] setDataConsentSet:ATDataConsentSetPersonalized consentString:nil];
       } else {
           [[RXTopOnInitManager sharedSDK] setDataConsentSet:ATDataConsentSetNonpersonalized consentString:nil];
       }
    }];
   */
    
    self.window.rootViewController = [[UINavigationController alloc] initWithRootViewController:[[ViewController alloc] init]];
    [self.window makeKeyAndVisible];
    
    return YES;
}

//获取当前的ViewController
- (UIViewController *)currentViewController {
    UIViewController *currentViewController = [self getVisibleViewControllerFrom:[UIApplication sharedApplication].keyWindow.rootViewController];
    if (!currentViewController) {
        for (UIWindow *window in [UIApplication sharedApplication].windows) {
            if (window.isKeyWindow) {
                currentViewController = [self getVisibleViewControllerFrom:window.rootViewController];
                break;
            }
        }
    }
    return currentViewController;
}

- (UIViewController *)getVisibleViewControllerFrom:(UIViewController *)vc {
    if ([vc isKindOfClass:[UINavigationController class]]) {
        return [self getVisibleViewControllerFrom:[((UINavigationController *) vc) visibleViewController]];
    } else if ([vc isKindOfClass:[UITabBarController class]]) {
        return [self getVisibleViewControllerFrom:[((UITabBarController *) vc) selectedViewController]];
    } else {
        if (vc.presentedViewController) {
            return [self getVisibleViewControllerFrom:vc.presentedViewController];
        } else {
            return vc;
        }
    }
}


@end
