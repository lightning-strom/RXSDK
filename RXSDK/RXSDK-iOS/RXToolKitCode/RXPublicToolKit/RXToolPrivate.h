//
//  RXToolPrivate.h
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/4/9.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN


// - 判断是否是刘海屏幕
#define kRXToolIphoneX1 \
({\
    BOOL INTERFACE_IS_IPHONEX = NO;\
    if (@available(iOS 11.0, *)) {\
        if([[UIApplication sharedApplication] delegate].window.safeAreaInsets.bottom > 0.0) {\
            INTERFACE_IS_IPHONEX = YES;\
        }\
}\
    INTERFACE_IS_IPHONEX;\
})
#define kRXToolIphoneX2 [UIScreen mainScreen].bounds.size.height >= 812
#define kRXToolIphoneX (kRXToolIphoneX1?kRXToolIphoneX1:kRXToolIphoneX2)
#define kRXToolStatusBarHeight            (kRXToolIphoneX ? 44.f : 20.f)

// - 导航栏+状态栏高度
#define kRXToolNavigationAndStatusHeight (kRXToolIphoneX ? 84.f : 60.f)

#define ISPAD [UIDevice currentDevice].model



// 是否横屏
#define RXToolAC \
({\
    BOOL ISAC = NO;\
    if ([RXToolPrivate getInterfaceOrientation] == 2 || [ISPAD isEqualToString:@"iPad"]) {\
        ISAC = YES;\
    }\
    ISAC;\
})

// 关闭webView
static NSString * const RXToolNoti_closeWebView = @"RXToolNoti_closeWebView";
// 隐藏原生头
static NSString * const RXToolNoti_setNaviBarVisible = @"RXToolNoti_setNaviBarVisible";
// 设置标题
static NSString * const RXToolNoti_setTitle = @"RXToolNoti_setTitle";
// 显示关闭按钮
static NSString * const RXToolNoti_showClose = @"RXToolNoti_showClose";
// 显示返回按钮
static NSString * const RXToolNoti_showBack = @"RXToolNoti_showBack";

/** Noti **/
static NSString *const RXToolUser_setLanguage = @"rx_setLanguage";


@interface RXToolPrivate : NSObject

/**
 * 获取图片资源
 */
+ (UIImage *)rxToolBundleImageNamed:(NSString *)imageName;

/** 返回当前控制器 */
+ (UIViewController *)currentViewController;

/** 获取当前屏幕方向 */
+ (NSInteger)getInterfaceOrientation;

/**
 * 处理 webView scheme 数据
 */
+ (NSDictionary *)fetchWebViewSchemes:(NSString *)url;

+ (NSString *)urlEncodedString:(NSString *)string;

/**
 * 是否为RTL布局
 */
+ (BOOL)isRTL;

/**
 * NSDictionary to jsonString
 */
+ (NSString *)toJsonString:(NSDictionary *)dic;

/**
 * jsonString to NSDictionary
 */
+ (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString;

@end

NS_ASSUME_NONNULL_END
