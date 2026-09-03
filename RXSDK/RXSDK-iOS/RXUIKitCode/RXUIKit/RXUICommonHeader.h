//
//  RXUICommonHeader.h
//  RXUIKit
//
//  Created by 陈汉 on 2022/2/19.
//

#ifndef RXUICommonHeader_h
#define RXUICommonHeader_h

#import "UIColor+RXColorUtility.h"
//#import <SDAutoLayout/SDAutoLayout.h>
#if __has_include("UIView+SDAutoLayout.h")
#import "UIView+SDAutoLayout.h"
#else

#endif
//#import "RX_CommonRequestError.h"
#import "RXUICommonTool.h"
#import "RXTextField.h"
#import "UIViewController+RXUIExtension.h"
#import "NSString+RXAddition.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "UIImage+RXAddition.h"
//#import <MBProgressHUD/MBProgressHUD.h>
//#import <SVProgressHUD/SVProgressHUD.h>
#import "RXUIUserUtility.h"
#import "RXHUD.h"
//#import <ATAuthSDK/ATAuthSDK.h>


#ifdef DEBUG
#define NSLog(...) NSLog(__VA_ARGS__)
#define sLog( s, ... ) printf("class: <%p %s:(%d) > method: %s \n%s\n", self, [[[NSString stringWithUTF8String:__FILE__] lastPathComponent] UTF8String], __LINE__, __PRETTY_FUNCTION__, [[NSString stringWithFormat:(s), ##__VA_ARGS__] UTF8String] )
#define debugMethod() NSLog(@"%s", __func__)
#else// 发布状态, 关闭LOG功能
#define NSLog(...)
#define sLog( s, ... )
#define debugMethod()
#endif

// - 判断是否是刘海屏幕
#define kRXIphoneX1 \
({\
    BOOL INTERFACE_IS_IPHONEX = NO;\
    if (@available(iOS 11.0, *)) {\
        if([[UIApplication sharedApplication] delegate].window.safeAreaInsets.bottom > 0.0) {\
            INTERFACE_IS_IPHONEX = YES;\
        }\
}\
    INTERFACE_IS_IPHONEX;\
})
#define kRXIphoneX2 [UIScreen mainScreen].bounds.size.height >= 812
#define kRXIphoneX (kRXIphoneX1?kRXIphoneX1:kRXIphoneX2)
// - 状态栏高度
#define kRXStatusBarHeight            (kRXIphoneX ? 44.f : 20.f)
#define kRXTabBarHeight               ((kRXStatusBarHeight) > (20) ? (83) : (59))
#define kRXTabbarSafeBottomMargin     (kRXIphoneX ? 34.f : 0.f)// Tabbar safe bottom margin.
// - 导航栏+状态栏高度
#define kRXNavigationAndStatusHeight (kRXIphoneX ? 84.f : 60.f)

#define __MainScreenFrame           [[UIScreen mainScreen] bounds]
// 设备屏幕宽
#define __MainScreen_Width          __MainScreenFrame.size.width
// 设备屏幕高
#define __MainScreen_Height         __MainScreenFrame.size.height

static NSString *const sdkVersion = @"4.0.5";

/* ------- userKeys ------- */
static NSString *const keyUser_loginData = @"rx_loginData";
static NSString *const keyUser_isOS = @"rx_isOS";
// channel
static NSString *const keyUser_channel = @"rx_channel";

/* ------- notiKeys ------- */
static NSString *const noti_uPasswordChange = @"noti_passwordChange";
static NSString *const noti_rxLogin = @"noti_rxLogin";
static NSString *const noti_initProfile = @"noti_initProfile";
static NSString *const noti_privacySelected = @"noti_privacySelected";

/* ------- track ------- */
static NSString *const rxlog_error_login_ui = @"rxlog_error_login";
static NSString *const rxlog_error_ui = @"#rx_error";

/* ------- keys ------- */

#endif /* RXUICommonHeader_h */
