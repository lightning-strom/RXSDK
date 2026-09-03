//
//  CHMarco.h
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/2.
//

#ifndef CHMarco_h
#define CHMarco_h

#import "Tool.h"
#import "UIView+Shade.h"
#import "UIColor+ColorUtility.h"
#import <UIView+SDAutoLayout.h>
#import "CHMarco.h"
#import "CHUtility.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXWXSDK/RXWXSDK.h>
#import <RXUIKit/RXHUD.h>
#import <RXUIKit/RXUIKit.h>
#import <RXUIKit_OS/RXUIKit_OS.h>
#import <RXGoogleSDK/RXGoogleSDK.h>
#import <RXFacebookSDK/RXFacebookSDK.h>
#import <RXLineSDK/RXLineSDK.h>
#import <RXZaloSDK/RXZaloSDK.h>
#import <RXSnapChatSDK/RXSnapChatSDK.h>
#import <RXInstagramSDK/RXInstagramSDK.h>
#import <RXRedditSDK/RXRedditSDK.h>
#import <RXTikTokSDK/RXTikTokSDK.h>
#import "RXLoginViewCell.h"
#import <RXPushSDK/RXPushSDK.h>
#import <MBProgressHUD/MBProgressHUD.h>
#import <Toast/Toast.h>

#define baseUrl112 @"https://cn-api-demo.ruixueyun.com/"
#define baseUrl114 @"https://cn-api-test.ruixueyun.com/"
#define baseUrl119 @"https://os-api-test.ruixueyun.com/"
#define baseUrl120 @"https://os-api-demo.ruixueyun.com/"

// - 判断是否是刘海屏幕
#define kIphoneX1 \
({\
    BOOL INTERFACE_IS_IPHONEX = NO;\
    if (@available(iOS 11.0, *)) {\
        if([[UIApplication sharedApplication] delegate].window.safeAreaInsets.bottom > 0.0) {\
            INTERFACE_IS_IPHONEX = YES;\
        }\
}\
    INTERFACE_IS_IPHONEX;\
})
#define kIphoneX2 [UIScreen mainScreen].bounds.size.height >= 812
#define kIphoneX (kIphoneX1?kIphoneX1:kIphoneX2)
// - 状态栏高度
#define kStatusBarHeight            (kIphoneX ? 44.f : 20.f)
#define kTabBarHeight               ((kStatusBarHeight) > (20) ? (83) : (59))
#define kTabbarSafeBottomMargin     (kIphoneX ? 34.f : 0.f)// Tabbar safe bottom margin.
// - 导航栏+状态栏高度
#define kNavigationAndStatusHeight (kIphoneX ? 98.f : 74.f)

#define kScreenWidth          [UIScreen mainScreen].bounds.size.width
#define kScaleWidth(x)        kScreenWidth/375.0*(x)

#define kImageNamed(x) [UIImage imageNamed:x]

#define Version @"3.5.0"

#endif /* CHMarco_h */
