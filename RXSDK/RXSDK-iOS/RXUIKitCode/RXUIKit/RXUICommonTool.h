//
//  RXUICommonTool.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import <Foundation/Foundation.h>
#import "RXUICommonHeader.h"
#import "RXUIUserInfo.h"
#import "RXLoginUIConfig.h"

NS_ASSUME_NONNULL_BEGIN

// - 设备屏幕宽
#define RXUScreenWidth          [UIScreen mainScreen].bounds.size.width
// - 设备屏幕高
#define RXUScreenHeight         [UIScreen mainScreen].bounds.size.height

// - 缩放比例
#define RXUScaleWidth(x) \
({ \
    CGFloat scale = 1.0; \
    if ([ISPAD isEqualToString:@"iPad"]) { \
        scale = 1.1; \
    } else { \
        scale = RXAC ? (RXUScreenHeight / 375.0) : (RXUScreenWidth / 375.0); \
    } \
    scale * (x); \
})

#define RXUScaleHeight(x)   (RXAC ? RXUScreenHeight/750.0*(x) : RXUScreenHeight/750.0*(x))
//#define RXUScaleWidth(x) RXUScreenHeight/375.0*(x)

#define ISPAD [UIDevice currentDevice].model

// 是否横屏
#define RXAC \
({\
    BOOL ISAC = NO;\
    if ([RXUICommonTool getInterfaceOrientation] == 2 || [ISPAD isEqualToString:@"iPad"]) {\
        ISAC = YES;\
    }\
    ISAC;\
})
    

#define HexRGBAlpha(rgbValue,a) [UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 \
                                         green:((float)((rgbValue & 0xFF00) >> 8))/255.0 \
                                         blue:((float)(rgbValue & 0xFF))/255.0 alpha:(a)]

// 账号密码重新登录
static NSString * const RXUINoti_accountLogin = @"RXUINoti_accountLogin";
// 验证码重新登录
static NSString * const RXUINoti_codeLogin = @"RXUINoti_codeLogin";
// 切换验证码登录
static NSString * const RXUINoti_changeCodeLogin = @"RXUINoti_changeCodeLogin";
// 一键登录重新登录
static NSString * const RXUINoti_authLogin = @"RXUINoti_authLogin";
// 用户中心关闭按钮
static NSString * const RXUINoti_userCenterClose = @"RXUINoti_userCenterClose";
// 用户中心返回按钮
static NSString * const RXUINoti_userCenterBack = @"RXUINoti_userCenterBack";
// 关闭webView
static NSString * const RXUINoti_closeWebView = @"RXUINoti_closeWebView";
// 修改密码
static NSString * const RXUINoti_changePwd = @"RXUINoti_changePwd";
// 重置密码
static NSString * const RXUINoti_resetPwd = @"RXUINoti_resetPwd";
// 刷新登录UI
static NSString * const RXUINoti_refreshLoginUI = @"RXUINoti_refreshLoginUI";
// 滑块验证码成功
static NSString *const noti_slideCodeSuc = @"noti_slideCodeSuc";
// 关闭webView 客服中心
static NSString * const RXUINoti_closeWebView1 = @"RXUINoti_closeWebView1";
// 最小化
static NSString * const RXUINoti_minimized = @"RXUINoti_minimized";
// 最大化
static NSString * const RXUINoti_maxmized = @"RXUINoti_maxmized";
// 展示红点
static NSString * const RXUINoti_showTip = @"RXUINoti_showTip";
// 隐藏原生头
static NSString * const RXUINoti_setNaviBarVisible = @"RXUINoti_setNaviBarVisible";
// 关闭一键登录
static NSString * const RXUINoti_closeAuthView = @"RXUINoti_closeAuthView";
// 同步三方用户信息
static NSString * const RXUINoti_syncInfo = @"RXUINoti_syncInfo";
// 设置标题
static NSString * const RXUINoti_setTitle = @"RXUINoti_setTitle";
// 刷新邮箱列表
static NSString * const RXUINoti_refreshEmailList = @"RXUINoti_refreshEmailList";
// 刷新我的反馈列表
static NSString * const RXUINoti_refreshFeedbackList = @"RXUINoti_refreshFeedbackList";

// 获取登录方式
static NSString *const keyUserData_methodenum = @"rx_methodenum";


typedef enum : NSUInteger {
    RXUserType_visitor = 1, // 游客登录
    RXUserType_apple = 2,   // 苹果登录
    RXUserType_w = 3,       // 微信登录
    RXUserType_auth = 4,    // 一键登录
    RXUserType_account = 5, // 账号登录
    RXUserType_history = 6,  // 历史账号
    RXUserType_code = 7  // 验证码登录
} RXUserType;

@interface RXUICommonTool : NSObject

/**
 * 获取当前屏幕方向
 * 1 竖屏  2横屏
 */
+ (NSInteger)getInterfaceOrientation;

/**
 * 获取手机语言地区
 */
+ (NSMutableArray *)getLanguageCountry;

/**
 * 获取广告信息
 */
+ (NSMutableDictionary *)getAdInfo;

/**
 * 获取当前时间戳
 */
+ (NSString *)getNowTimeTimestamp;

/**
 * md5加密然后转大写
 */
+ (NSString*)md532BitUpperWithStr:(NSString *)str;

/**
 * 密码校验
 */
+ (BOOL)checkPasswordWithPwd:(NSString *)pwd;

/**
 * 获取idfa
 */
+ (NSString *)getIDFA;

/**
 * 获取bundlId
 */
+ (NSString *)getBundleId;

/**
 * 保存账号信息
 */
+ (void)saveAccountWithUsername:(NSString *)username
                       password:(NSString *)password;

/**
 * 弹出动画
 */
+ (void)showWithAnimate:(UIView *)view;
+ (void)showWithAnimate:(UIView *)view duration:(NSInteger)duration;
+ (void)showWithAnimate:(UIView *)view addScale:(float)addScale;
+ (void)showWithAnimate:(UIView *)view animate:(BOOL)animate;

/**
 * 缩放比例
 */
+ (void)transformWithView:(UIView *)view;

/**
 * userType枚举转换
 */
+ (RXUserType)getUserType:(NSString *)userTypeStr;

/**
 * 保存登录成功的账号
 */
+ (void)saveAccountWithUserInfo:(NSMutableDictionary *)userInfo;

/**
 * 获取icon
 */
+ (NSString *)getIconWithLoginType:(LoginType)loginType;

/**
 * 校验密码
 */
+ (BOOL)checkPasswordWith:(NSString *)regexStr
                     text:(NSString *)text;

/**
 * 验证是否是手机号
 */
+ (BOOL)validateMobile:(NSString *)phone;

/**
 * 验证是否是邮箱
 */
+ (BOOL)validateEmail:(NSString *)email;

/**
 * 判断当前是否有网
 */
+ (BOOL)hasNetwork;

/**
 * 获取屏幕宽 （横竖屏）
 */
+ (CGFloat)getScreenWidth;

/**
 * 获取屏幕宽 （横竖屏）
 */
+ (CGFloat)getSingleScreenWidth;

/**
 * 获取屏幕高 （横竖屏）
 */
+ (CGFloat)getScreenHeight;

+ (NSString *)getJsonString:(NSDictionary *)dic;

+ (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString;

/**
 * 获取版本号
 */
+ (NSString *)getVersion;

/**
 * string转dic
 */
+ (NSDictionary *)stringToDic:(NSString *)string;

/**
 * 初始化配置文件模型转换
 */
+ (RXLoginUIConfig *)fetchInitProfile;

+ (UIImage *)getImageFromURL:(NSString *)fileURL;

/**
 * 手机号加*
 */
+ (NSString *)usernameSec:(NSString *)str;

/**
 * 获取国家
 */
+ (NSString *)getCountryCode;

/**
 * 获取网络图片
 */
+ (UIImage *)getNormalImageFromURL:(NSString *)fileURL;

/**
 * 同步三方用户信息
 */
+ (void)syncInfo:(void(^)(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error))complete;

/**
 * 刷新token
 */
+ (void)refreshToken:(void(^)(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error))complete;

/**
 * 模型转换
 */
+ (RXLoginUIConfig *)toConfig:(RXLoginUIModel *)model;

/**
 * 登录类型转换
 */
+ (NSString *)toMethodStr:(long)loginType;

/**
 * 登录类型转换
 */
+ (long)toLoginType:(NSString *)method;

@end

NS_ASSUME_NONNULL_END
