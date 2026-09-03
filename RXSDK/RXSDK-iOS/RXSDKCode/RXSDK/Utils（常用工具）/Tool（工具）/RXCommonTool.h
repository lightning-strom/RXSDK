//
//  RXCommonTool.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import <Foundation/Foundation.h>
#import "RXCommonHeader.h"

//#import "RXLogModel.h"

NS_ASSUME_NONNULL_BEGIN

#define ISPAD [UIDevice currentDevice].model

// 是否横屏
#define RXAC \
({\
    BOOL ISAC = NO;\
    if ([RXCommonTool getInterfaceOrientation] == 2 || [ISPAD isEqualToString:@"iPad"]) {\
        ISAC = YES;\
    }\
    ISAC;\
})

// - 判断是否是刘海屏幕
#define kRXCommonIphoneX1 \
({\
    BOOL INTERFACE_IS_IPHONEX = NO;\
    if (@available(iOS 11.0, *)) {\
        if([[UIApplication sharedApplication] delegate].window.safeAreaInsets.bottom > 0.0) {\
            INTERFACE_IS_IPHONEX = YES;\
        }\
}\
    INTERFACE_IS_IPHONEX;\
})
#define kRXCommonIphoneX2 [UIScreen mainScreen].bounds.size.height >= 812
#define kRXCommonIphoneX (kRXCommonIphoneX1?kRXCommonIphoneX1:kRXCommonIphoneX2)
// - 状态栏高度
#define kRXCommonStatusBarHeight            (kRXCommonIphoneX ? 44.f : 20.f)
#define kRXCommonTabBarHeight               ((kRXCommonStatusBarHeight) > (20) ? (83) : (59))
#define kRXCommonTabbarSafeBottomMargin     (kRXCommonIphoneX ? 34.f : 0.f)// Tabbar safe bottom margin.

// 广告平台标识
static NSString *ad_tencent = @"tencent";
static NSString *ad_oceanengine = @"oceanengine";
static NSString *ad_kuaishou = @"kuaishou";
static NSString *ad_baidu = @"baidu";

@interface RXCommonTool : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 获取手机语言地区
 */
+ (NSMutableArray *)getLanguageCountry;

/**
 * 获取广告信息
 */
+ (NSMutableDictionary *)getAdInfo;

/**
 * 获取剪贴板信息
 */
+ (NSMutableDictionary *)getPasteboradInfo;

/**
 * 清空剪贴板
 */
+ (void)deletePasteboard;

/**
 * 处理激活数据
 */
+ (NSMutableDictionary *)fetchAdInfo:(NSDictionary *)adInfo;

/**
 * 获取当前时间  yyyy-MM-dd'T'HH:mm:ss.SSSZ
 */
+ (NSString *)getTimeForStr;

/**
 * 获取当前时区与UTC时差
 */
+ (NSString *)getTimeZoneOffset;

/**
 * 获取当前手机语言
 */
+ (NSString *)getSystemLanguage;

/**
 * md5加密然后转大写
 */
+ (NSString*)md532BitUpperWithStr:(NSString *)str;

//md5加密然后转小写
+ (NSString *)md532BitlowerWithStr:(NSString *)str;

/**
 * 密码校验
 */
+ (BOOL)checkPasswordWithPwd:(NSString *)pwd;

/**
 * 获取idfa
 */
+ (NSString *)getIDFA;

/**
 * 获取idfv
 */
+ (NSString *)getIDFV;

/**
 * 获取 bundleid
 */
+ (NSString *)getBundleID;

/**
 * 获取uuid
 */
+ (NSString *)uuid;

/**
 * 保存埋点数据
 */
+ (void)addLogObj:(NSMutableDictionary *)obj;

/**
 * 清除埋点数据
 */
+ (void)deleteLogArr;

/**
 * 保存用户行为埋点数据
 */
+ (void)addUserActionLogObj:(NSMutableDictionary *)obj;

/**
 * 清除用户行为埋点数据
 */
+ (void)deleteUserActionLogArr;

/**
 * 获取distinct_id
 */
+ (NSString *)getDistinct_id;

/**
 * 判断当前是否有网
 */
- (void)hasNetwork;

/**
 * 获取userAgent
 */
- (void)rx_getUserAgent:(void(^)(id _Nullable result))complete;

/**
 *  获取时间戳
 */
+ (NSInteger)getTimestamp;

/**
 * 订单号生成uuid
 */
+ (NSString *)orderIdToUid:(NSString *)uid;

/**
 * 国际化
 */
+ (NSString *)osLaunguage:(NSString *)text;

/**
 * 存储本地日志
 */
+ (void)saveLocalLogWithTraceid:(NSString *)traceid
                          event:(NSString *)event
                            url:(NSString *)url
                         header:(NSDictionary *)header
                           body:(NSDictionary *)body
                         result:(NSDictionary * _Nullable)result;

/**
 * 获取本地日志
 */
+ (NSMutableArray *)getLocalLog;

/**
 * 获取当前时间
 * yyyy-MM-dd HH:mm:ss.SSS
 */
+ (NSString *)getDateStr;

/**
 * 获取公网 ip
 */
+ (void)getPublicIPWithComplete:(void(^)(NSString *publicIP))complete;

/**
 * model转化为字典
 */
+ (NSDictionary *)dicFromObject:(NSObject *)object;

/**
 * 获取当前屏幕方向
 */
+ (NSInteger)getInterfaceOrientation;

/**
 * 验证是否是手机号
 */
+ (BOOL)validateMobile:(NSString *)phone;

/**
 * 验证是否是邮箱
 */
+ (BOOL)validateEmail:(NSString *)email;

/**
 * 获取推送 taskid
 */
+ (NSString *)getTaskid;

/**
 * 手机号加*
 */
+ (NSString *)usernameSec:(NSString *)str;

/**
 * 获取设备型号
 */
+ (NSString *)rxGetiPhoneDeviceType;

/**
 * 获取网络状态，WIFI、2G、3G、4G、5G、UNKNOWN
 */
+ (NSString *)rxGetNetworkStatus;

/**
 * 获取当前语言，返回小写
 */
+ (NSString *)getCurrentLanguage;

/**
 * 设置自定义错误码，由RXErrorTool调用
 */
- (void)configErrorMsg:(NSDictionary *)msgDic;

/**
 * 获取错误码信息，由RXErrorTool调用
 */
- (NSDictionary *)getCustomRXErrorMsgDic;

/**
 * 替换返回错误中的$thirdcode$、$thirdmsg$
 */
+ (NSDictionary *)customErrorMsgReplaceThirdCodeOrMsgWithDic:(NSDictionary *)errorMsgDic;

/**
 * 将"url?key1=value1&key2=value2"中的query截取并生成字典
 */
+ (NSDictionary *)parseQueryParametersFromURL:(NSString *)urlString;

/**
 * 获取 app 版本号
 */
+ (NSString *)getAppVersion;

// jsonString 转 dic
+ (NSDictionary *)stringToDictionary:(NSString *)jsonString;

// jsonString 转 array
+ (NSArray *)stringToArray:(NSString *)jsonString;

/**
 * 获取设备地区
 */
+ (NSString *)getLocalArea;

/**
 * 获取请求地区
 */
+ (NSString *)getRequestArea;

/**
 * urlencode
 */
+ (NSString *)urlEncodeString:(NSString *)str;

/**
 * urldecode
 */
+ (NSString *)urlDecodeString:(NSString *)encodeStr;

/**
 * 获取 openinstall 透传数据
 */
+ (void)getOpeninstallParams;

@end

NS_ASSUME_NONNULL_END
