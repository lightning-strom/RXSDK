//
//  RXOSCommonHeader.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#ifndef RXOSCommonHeader_h
#define RXOSCommonHeader_h


#import "UIColor+RXOSColorUtility.h"
#import "RXOSCommonTool.h"
#import "RXOSTextField.h"
#import "UIViewController+RXOSExtension.h"
#import "NSString+RXOSAddition.h"
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "UIImage+RXOSAddition.h"
#import "MBOSProgressHUD.h"
#import "RXOSUserUtility.h"
#import "RXOSHUD.h"
#import "RXLocation.h"


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

static NSString *const sdkVersion = @"4.0.2";

/* ------- userKeys ------- */
static NSString *const keyUser_loginData = @"rx_loginData";
static NSString *const keyUser_setLanguage = @"rx_setLanguage";
static NSString *const keyUser_isOS = @"rx_isOS";
static NSString *const keyUser_closeEmailRegister = @"rx_closeEmailRegister"; // 密码正则
// channel
static NSString *const keyUser_channel = @"rx_channel";

/* ------- notiKeys ------- */
static NSString *const noti_uPasswordChange = @"noti_passwordChange";
static NSString *const noti_rxLogin = @"noti_rxLogin";
static NSString *const noti_initProfile = @"noti_initProfile";
static NSString *const noti_register = @"noti_register";

/* ------- keys ------- */


#endif /* RXOSCommonHeader_h */

