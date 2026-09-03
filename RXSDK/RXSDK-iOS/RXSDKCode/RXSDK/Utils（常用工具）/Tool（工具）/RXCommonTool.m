//
//  RXCommonTool.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import "RXCommonTool.h"
#import <UIKit/UIKit.h>
#import <CommonCrypto/CommonDigest.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>
#import <AdSupport/ASIdentifierManager.h>
#import <WebKit/WebKit.h>
#import <CoreTelephony/CTCellularData.h>
#import "RXService.h"
#import <RXLanguageKit/RXLanguageKit.h>
#import "NSString+RXAddition.h"
#import <objc/runtime.h>
#import <objc/message.h>
#import <sys/utsname.h>//设备型号
#import <netinet/in.h>//本地地址测试网络状态
#import <SystemConfiguration/SystemConfiguration.h>//网络状态
#import <CoreTelephony/CTTelephonyNetworkInfo.h>//蜂窝类型

typedef void(^ASABlock)(NSDictionary *response, NSDictionary *error);

@interface RXCommonTool () <WKNavigationDelegate>

@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, strong) NSString *userAgent;
@property (nonatomic, assign) NSInteger requestCount;
@property (nonatomic, strong) NSMutableDictionary *errorMsgDict;

@end

@implementation RXCommonTool

static RXCommonTool *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXCommonTool alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
//        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
//            dispatch_async(dispatch_get_main_queue(), ^{
//                [self loadWebView];
//            });
//        });
        _errorMsgDict = [[NSMutableDictionary alloc] init];
    }
    return self;
}

/**
 * 获取手机语言地区
 */
+ (NSMutableArray *)getLanguageCountry
{
    NSMutableArray *langArr = [NSMutableArray array];
    NSString *langStr = [[[NSUserDefaults standardUserDefaults] objectForKey:@"AppleLanguages"] firstObject];
    NSArray *compontArr = [langStr componentsSeparatedByString:@"-"];
    if (compontArr.count > 2) {
        NSString *language = [NSString stringWithFormat:@"%@-%@", compontArr[0], compontArr[1]];
        [langArr addObject:language];
        [langArr addObject:compontArr[2]];
    } else if (compontArr.count == 2) {
        [langArr addObjectsFromArray:compontArr];
    } else {
        compontArr = @[@"zh-Hans", @"CN"];
        [langArr addObjectsFromArray:compontArr];
    }
    return langArr;
}

/**
 * 获取广告信息
 */
+ (NSMutableDictionary *)getAdInfo
{
    NSMutableDictionary *adDic = [NSMutableDictionary dictionary];
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSString *pasteString = pasteboard.string;
    
    if (pasteString.length > 0 && [pasteString containsString:@"type=rx"]) {
        pasteString = [pasteString stringByReplacingOccurrencesOfString:@"type=rx&" withString:@""];
        if (pasteString.length > 0 && [pasteString containsString:@"user_source"]) {
            NSMutableDictionary *userSourceDic = [NSMutableDictionary dictionary];
            NSString *userSourceKey = @"";

            NSArray *pasteArr = [pasteString componentsSeparatedByString:@"&"];

            for (int i = 0; i < pasteArr.count; i++) {
                NSString *kvcStr = pasteArr[i];
                NSArray *kvcArr = [kvcStr componentsSeparatedByString:@"="];
                if (kvcArr.count > 0) {
                    if ([kvcArr[0] isEqualToString:@"user_source"]) {
                        userSourceKey = kvcArr[1];
                    }
                    [userSourceDic setValue:[NSString stringWithFormat:@"%@", kvcArr[1]] forKey:kvcArr[0]];
                }
            }
            for (int i = 0; i < userSourceDic.allKeys.count; i++) {
                if ([userSourceDic.allKeys[i] isEqualToString:@"user_source"]) {
                    [userSourceDic removeObjectForKey:@"user_source"];
                    
                }
            }
            if (userSourceDic.allKeys.count > 0) {
                [adDic setValue:userSourceDic forKey:userSourceKey];
            }
        } else {
            NSArray *pasteArr = [pasteString componentsSeparatedByString:@"&"];

            for (int i = 0; i < pasteArr.count; i++) {
                NSString *kvcStr = pasteArr[i];
                NSArray *kvcArr = [kvcStr componentsSeparatedByString:@"="];
                if (kvcArr.count > 0) {
                    [adDic setValue:[NSString stringWithFormat:@"%@", kvcArr[1]] forKey:kvcArr[0]];
                }
            }
        }
    }
    [RXUserUtility setValue:adDic ForKey:keyUserData_pasteInfo];
    return adDic;
}

/**
 * 获取剪贴板信息
 */
+ (NSMutableDictionary *)getPasteboradInfo
{
    NSMutableDictionary *adDic = [NSMutableDictionary dictionary];
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSString *pasteString = pasteboard.string;
    
    if (pasteString.length > 0 && [pasteString containsString:@"type=rx"]) {
        pasteString = [pasteString stringByReplacingOccurrencesOfString:@"type=rx&" withString:@""];
        NSArray *pasteArr = [pasteString componentsSeparatedByString:@"&"];

        for (int i = 0; i < pasteArr.count; i++) {
            NSString *kvcStr = pasteArr[i];
            NSArray *kvcArr = [kvcStr componentsSeparatedByString:@"="];
            if (kvcArr.count > 0) {
                [adDic setValue:[NSString stringWithFormat:@"%@", kvcArr[1]] forKey:kvcArr[0]];
            }
        }
    }
    
    return adDic;
}

/**
 * 清空剪贴板
 */
+ (void)deletePasteboard
{
    NSMutableDictionary *adDic = [NSMutableDictionary dictionary];
    adDic = [RXUserUtility valueForKey:keyUserData_pasteInfo];
    if (adDic && adDic.allKeys.count > 0) {
        UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
        pasteboard.string = @"";
    }
}

/**
 * 处理激活数据
 */
+ (NSMutableDictionary *)fetchAdInfo:(NSDictionary *)adInfo
{
    NSMutableDictionary *fetchAdInfo = [NSMutableDictionary dictionaryWithDictionary:adInfo];
    
    if ([fetchAdInfo objectForKey:@"ad_platform"]) {
        NSString *ad_platform = [fetchAdInfo valueForKey:@"ad_platform"];
        if ([ad_platform isEqualToString:ad_tencent] && [fetchAdInfo objectForKey:@"gdt_vid"]) {
            NSString *gdt_vid = [fetchAdInfo valueForKey:@"gdt_vid"];
            [fetchAdInfo setValue:gdt_vid forKey:@"click_id"];
        } else if ([ad_platform isEqualToString:ad_oceanengine] && [fetchAdInfo objectForKey:@"req_id"]) {
            NSString *req_id = [fetchAdInfo valueForKey:@"req_id"];
            [fetchAdInfo setValue:req_id forKey:@"click_id"];
        } else if ([ad_platform isEqualToString:ad_baidu] && [fetchAdInfo objectForKey:@"req_id"]) {
            NSString *bd_vid = [fetchAdInfo valueForKey:@"bd_vid"];
            [fetchAdInfo setValue:bd_vid forKey:@"click_id"];
        }
    }
    
    return fetchAdInfo;
}

/**
 * 获取当前时间  yyyy-MM-dd'T'HH:mm:ss.SSSZ
 */
+ (NSString *)getTimeForStr
{
    NSDate *date = [NSDate date];
    NSDateFormatter *format1 = [[NSDateFormatter alloc] init];
    [format1 setDateFormat:@"yyyy-MM-dd'T'HH:mm:ss.SSSZ"];
    NSString *dateStr = [format1 stringFromDate:date];
    NSMutableString *dateMutaStr = [NSMutableString stringWithString:dateStr];
    if ([NSString rx_isNullToString:dateMutaStr].length > 2) {    
        [dateMutaStr insertString:@":" atIndex:dateMutaStr.length - 2];
    }
    
    return [NSString stringWithString:dateMutaStr];
}

/**
 * 获取当前时区与UTC时差
 */
+ (NSString *)getTimeZoneOffset
{
    [NSTimeZone resetSystemTimeZone];
    // 获取当前时区
    NSTimeZone *zone = [NSTimeZone systemTimeZone];
    CGFloat offset = zone.secondsFromGMT;

    offset = offset/3600.0;

    NSString *tzStr = [NSString stringWithFormat:@"%.2f", (CGFloat)offset];
//    if (offset < 0) {
//        tzStr = [NSString stringWithFormat:@"-%@", tzStr];
//    }
    
    return tzStr;
}

/**
 * 获取当前手机语言
 */
+ (NSString *)getSystemLanguage
{
    NSArray *languageArr = [RXCommonTool getLanguageCountry];
    NSString *language = languageArr[0];
    if (languageArr.count > 1) {
        NSArray *compareLan = [[languageArr[0] description] componentsSeparatedByString:@"-"];
        if (compareLan.count > 1) {
            language = [NSString stringWithFormat:@"%@-%@", compareLan[0], languageArr[1]];
        } else {
            language = [NSString stringWithFormat:@"%@-%@", languageArr[0], languageArr[1]];
        }
    }
    if (!language) {
        language = @"zh-cn";
    }
    return language;
}

//md5加密然后转大写
+ (NSString *)md532BitUpperWithStr:(NSString *)str
{
    const char *cStr = [str UTF8String];
    unsigned char result[16];
    NSNumber *num = [NSNumber numberWithUnsignedLong:strlen(cStr)];
    CC_MD5( cStr,[num intValue], result );
    return [[NSString stringWithFormat:
             @"%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X",
             result[0], result[1], result[2], result[3],
             result[4], result[5], result[6], result[7],
             result[8], result[9], result[10], result[11],
             result[12], result[13], result[14], result[15]
             ] uppercaseString];
}

//md5加密然后转小写
+ (NSString *)md532BitlowerWithStr:(NSString *)str
{
    const char *cStr = [str UTF8String];
    unsigned char result[16];
    NSNumber *num = [NSNumber numberWithUnsignedLong:strlen(cStr)];
    CC_MD5( cStr,[num intValue], result );
    return [[NSString stringWithFormat:
             @"%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X%02X",
             result[0], result[1], result[2], result[3],
             result[4], result[5], result[6], result[7],
             result[8], result[9], result[10], result[11],
             result[12], result[13], result[14], result[15]
             ] lowercaseString];
}

+ (BOOL)checkPasswordWithPwd:(NSString *)pwd
{
//    NSString *regex = @"[a-zA-Z0-9_@#%&*!$.-]{6,32}";
    NSString *regex = @"(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,32}";
    
    // 密码强度设置
    RXPasswordStrength passwordType = [[RXUserUtility valueForKey:keyUserData_simplePassword] longValue];
    if (passwordType == Default || passwordType == Average) {
        regex = @"^.{6,32}$";
    } else if (passwordType == Custom) {
        regex = [RXUserUtility valueForKey:keyUserData_pwdPattern];
    }
    
    NSPredicate *pred = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", regex];
    BOOL isMatch = [pred evaluateWithObject:pwd];
    
    return isMatch;
}

/**
 * 获取idfa
 */
+ (NSString *)getIDFA
{
    __block NSString *idfa = @"";
    if (@available(iOS 14, *)) {
        // iOS14及以上版本需要先请求权限
        [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
            // 获取到权限后，依然使用老方法获取idfa
            if (status == ATTrackingManagerAuthorizationStatusAuthorized) {
                idfa = [[ASIdentifierManager sharedManager].advertisingIdentifier UUIDString];
                NSLog(@"IDFA = %@",idfa);
            } else {
                NSLog(@"请在设置-隐私-跟踪中允许App请求跟踪");
            }
        }];
    } else {
        // iOS14以下版本依然使用老方法
        // 判断在设置-隐私里用户是否打开了广告跟踪
        if ([[ASIdentifierManager sharedManager] isAdvertisingTrackingEnabled]) {
            idfa = [[ASIdentifierManager sharedManager].advertisingIdentifier UUIDString];
            NSLog(@"IDFA = %@",idfa);
        } else {
            NSLog(@"请在设置-隐私-广告中打开广告跟踪功能");
        }
    }
    return idfa;
}

/**
 * 获取idfv
 */
+ (NSString *)getIDFV
{
    NSString *idfv = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    return idfv ?: @"";
}

/**
 * 获取 bundleid
 */
+ (NSString *)getBundleID
{
    NSString *bundleID = [[NSBundle mainBundle] bundleIdentifier];
    return bundleID ?: @"";
}

/**
 * 获取uuid
 */
+ (NSString *)uuid
{
    CFUUIDRef uuidref = CFUUIDCreate(kCFAllocatorDefault);
    CFStringRef uuid = CFUUIDCreateString(kCFAllocatorDefault, uuidref);
    NSString *result = (__bridge NSString *)uuid;
    CFRelease(uuidref);
    CFRelease(uuid);
    return result;
}

/**
 * 保存埋点数据
 */
+ (void)addLogObj:(NSMutableDictionary *)obj
{
    NSMutableArray *logArr = [NSMutableArray arrayWithArray:[RXUserUtility valueForKey:keyUserData_logArr]];
    [logArr addObject:obj];
    [RXUserUtility setValue:logArr ForKey:keyUserData_logArr];
}

/**
 * 清除埋点数据
 */
+ (void)deleteLogArr
{
    [RXUserUtility setValue:[NSMutableArray array] ForKey:keyUserData_logArr];
}

/**
 * 保存用户行为埋点数据
 */
+ (void)addUserActionLogObj:(NSMutableDictionary *)obj
{
    NSMutableArray *logArr = [NSMutableArray arrayWithArray:[RXUserUtility valueForKey:keyUserData_userActionLog]];
    [logArr addObject:obj];
    [RXUserUtility setValue:logArr ForKey:keyUserData_userActionLog];
}

/**
 * 清除用户行为埋点数据
 */
+ (void)deleteUserActionLogArr
{
    [RXUserUtility setValue:[NSMutableArray array] ForKey:keyUserData_userActionLog];
}

/**
 * 获取distinct_id
 */
+ (NSString *)getDistinct_id
{
    NSString *uuid = [RXUserUtility valueForKey:keyUserData_distinct_id];
    if (uuid && uuid.length > 0) {
        return uuid;
    } else {
        uuid = [RXCommonTool uuid];
        [RXUserUtility setValue:uuid ForKey:keyUserData_distinct_id];
        return uuid;
    }
}

/**
 * 判断当前是否有网
 */
- (void)hasNetwork
{
    CTCellularData *cellularData = [[CTCellularData alloc] init];
    
    __block NSInteger count = 0;
    cellularData.cellularDataRestrictionDidUpdateNotifier = ^(CTCellularDataRestrictedState state){
        //获取联网状态
        switch(state) {
            case kCTCellularDataRestricted:
                NSLog(@"Restricted");//拒绝
                break;
            case kCTCellularDataNotRestricted:
                NSLog(@"Not Restricted");//允许
                if (count >= 1) {
                    return;
                }
                count++;
                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                    [[NSNotificationCenter defaultCenter] postNotificationName:noti_openNetwork object:nil];
                });
                break;
            case kCTCellularDataRestrictedStateUnknown:
                NSLog(@"Unknown");//未知
                break;
            default:
                break;
        }
    };
}

/**
 * 获取userAgent
 */
- (void)rx_getUserAgent:(void(^)(id _Nullable result))complete
{
    if (!_webView) {
        WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
        if (@available(iOS 13.0, *)) {
            configuration.defaultWebpagePreferences.preferredContentMode = WKContentModeMobile;
        }
        
        _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:configuration];
        _webView.backgroundColor = [UIColor clearColor];
        _webView.navigationDelegate = self;
        
        [_webView evaluateJavaScript:@"navigator.userAgent" completionHandler:^(id _Nullable result, NSError * _Nullable error) {
            if (error == nil && result != nil) {
                self.userAgent = [NSString stringWithFormat:@"%@", result];
                NSLog(@"获取到的ua = %@", self.userAgent);
            } else {
                self.userAgent = @"";
                NSLog(@"获取到的ua = %@", self.userAgent);
            }
            if (complete) {
                complete(result);
            }
        }];
    }
}

/**
 *  获取时间戳
 */
+ (NSInteger)getTimestamp {
    NSDate *m_date = [NSDate dateWithTimeIntervalSinceNow:0];
    NSTimeInterval m_a=[m_date timeIntervalSince1970]*1000;
    NSString *m_time = [NSString stringWithFormat:@"%.0f",m_a];
    return [m_time integerValue];
}

/**
 * 订单号生成uuid
 */
+ (NSString *)orderIdToUid:(NSString *)uid
{
    NSString *uuid = uid;
    NSLog(@"uid = %@", uid);
    if ([NSString rx_isNullToString:uuid].length > 0) {
        // 取订单号版本
        NSString *orderVersion = [uuid substringFromIndex:uuid.length - 1];
        // 截断末尾v1
        uuid = [uuid substringToIndex:uuid.length - 2];
        
        // 前面补4位ffff，前补完后第5位传瑞雪订单版本号（原订单号最后一位）
        uuid = [NSString stringWithFormat:@"ffff%@%@", orderVersion,uuid];
        
        // 末位补4位ffff
        uuid = [NSString stringWithFormat:@"%@ffff", uuid];
        
        // 不足32位补0
        NSInteger uidLength = uuid.length;
        for (int i = 0; i < 32 - uidLength; i++) {
            uuid = [NSString stringWithFormat:@"%@0", uuid];
        }
        
        // 生成符合uuid格式的数据
        NSMutableString *uuid1 = [[NSMutableString alloc] initWithString:uuid];
        [uuid1 insertString:@"-" atIndex:8];
        [uuid1 insertString:@"-" atIndex:13];
        [uuid1 insertString:@"-" atIndex:18];
        [uuid1 insertString:@"-" atIndex:23];
        
        return uuid1;
    }
    return @"";
}

/**
 * 国际化
 */
+ (NSString *)osLaunguage:(NSString *)text
{
    NSString *language = [RXCommonTool getSystemLanguage];
    NSString *setLanguage = [RXUserUtility valueForKey:keyUserData_setLanguage];
    NSMutableDictionary *profile = [RXUserUtility valueForKey:keyUserData_initProfile];
    if (profile && profile.allKeys.count > 0) {
        NSDictionary *profile_passport = profile[@"passport"];
        if ([profile_passport valueForKey:@"language_default"]) {
            language = [profile_passport valueForKey:@"language_default"];
        }
    } 
    if ([NSString rx_isNullToString:setLanguage].length > 0) {
        language = setLanguage;
    }
    
    NSString *osStr = text;

    if ([[language lowercaseString] isEqualToString:@"zh"]) {
        return osStr;
    }
    if ([NSString rx_isNullToString:[RXLanguageService getTestWithLanguage:[language lowercaseString] text:text]].length > 0) {
        osStr = [RXLanguageService getTestWithLanguage:[language lowercaseString] text:text];
    }
    
    return osStr;
}

/**
 * 存储本地日志
 */
+ (void)saveLocalLogWithTraceid:(NSString *)traceid
                          event:(NSString *)event
                            url:(NSString *)url
                         header:(NSDictionary *)header
                           body:(NSDictionary *)body
                         result:(NSDictionary *)result
{
    NSMutableArray *arr = [NSMutableArray arrayWithArray:[RXUserUtility valueForKey:keyUserData_localLog]];
    NSMutableDictionary *logInfo = [RXUserUtility valueForKey:keyUserData_localLogInfo];
    NSInteger maxCount = [logInfo[@"no"] integerValue];
    BOOL of = [logInfo[@"of"] boolValue];
    
    if (!of) {
        return;
    }
    
    if (arr.count > maxCount) {
        [arr removeAllObjects];
    }
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:traceid forKey:@"traceid"];
    [dic setValue:[RXCommonTool getDateStr] forKey:@"time"];
    [dic setValue:event forKey:@"event"];
    [dic setValue:url forKey:@"url"];
    [dic setValue:header forKey:@"header"];
    [dic setValue:body forKey:@"body"];
    [dic setValue:result forKey:@"result"];
    
    for (int i = 0; i < dic.allKeys.count; i++) {
        NSString *key = dic.allKeys[i];
        id value = dic.allValues[i];
        if (!value) {
            [dic removeObjectForKey:key];
        }
    }
    
    if (!arr) {
        arr = [NSMutableArray array];
    }
    [arr addObject:dic];
    
    [RXUserUtility setValue:arr ForKey:keyUserData_localLog];
}

/**
 * 获取本地日志
 */
+ (NSMutableArray *)getLocalLog
{
    NSMutableArray *arr = [NSMutableArray arrayWithArray:[RXUserUtility valueForKey:keyUserData_localLog]];
    
    return arr;
}

/**
 * 获取当前时间
 * yyyy-MM-dd HH:mm:ss.SSS
 */
+ (NSString *)getDateStr
{
    
    NSDate *date = [NSDate date];
    NSDateFormatter *format1 = [[NSDateFormatter alloc] init];
    [format1 setDateFormat:@"yyyy-MM-dd HH:mm:ss.sss"];
    NSString *dateStr = [format1 stringFromDate:date];
    
    return dateStr;
}

/**
 * 获取公网 ip
 */
+ (void)getPublicIPWithComplete:(void(^)(NSString *publicIP))complete
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:rx_publicUrl andParams:nil requsetMethod:RequestMethod_Get];
//    request.baseUrl = [RXConfig sharedManager].apiDomain;
//    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取公网ip成功:\n %@", responseObject);
        NSString *ip = responseObject[@"publicIP"];
        if (complete) {
            complete(ip);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取公网ip失败:\n %@", error.error);
        if (complete) {
            complete(@"");
        }
    }];
}

/**
 * model转化为字典
 */
+ (NSDictionary *)dicFromObject:(NSObject *)object {
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    unsigned int count;
    objc_property_t *propertyList = class_copyPropertyList([object class], &count);
    
    for (int i = 0; i < count; i++) {
        objc_property_t property = propertyList[i];
        const char *cName = property_getName(property);
        NSString *name = [NSString stringWithUTF8String:cName];
        NSObject *value = [object valueForKey:name];//valueForKey返回的数字和字符串都是对象
        
        if ([value isKindOfClass:[NSString class]] || [value isKindOfClass:[NSNumber class]]) {
            //string , bool, int ,NSinteger
            [dic setObject:value forKey:name];
            
        } else if ([value isKindOfClass:[NSArray class]]) {
            //数组或字典
            [dic setObject:[RXCommonTool arrayWithObject:value] forKey:name];
        } else if ([value isKindOfClass:[NSDictionary class]]) {
            //数组或字典
            [dic setObject:[RXCommonTool dicWithObject:value] forKey:name];
        } else if (value == nil) {
            //null
            //[dic setObject:[NSNull null] forKey:name];//这行可以注释掉?????
        } else {
            //model
            [dic setObject:[self dicFromObject:value] forKey:name];
        }
    }
    
    return [dic copy];
}

+ (NSArray *)arrayWithObject:(id)object {
    //数组
    NSMutableArray *array = [NSMutableArray array];
    NSArray *originArr = (NSArray *)object;
    if ([originArr isKindOfClass:[NSArray class]]) {
        for (NSObject *object in originArr) {
            if ([object isKindOfClass:[NSString class]]||[object isKindOfClass:[NSNumber class]]) {
                //string , bool, int ,NSinteger
                [array addObject:object];
            } else if ([object isKindOfClass:[NSArray class]]) {
                //数组或字典
                [array addObject:[RXCommonTool arrayWithObject:object]];
            } else if ([object isKindOfClass:[NSDictionary class]]) {
                //数组或字典
                [array addObject:[RXCommonTool dicWithObject:object]];
            } else {
                //model
                [array addObject:[RXCommonTool dicFromObject:object]];
            }
        }
        return [array copy];
    }
    return array.copy;
}

+ (NSDictionary *)dicWithObject:(id)object {
    //字典
    NSDictionary *originDic = (NSDictionary *)object;
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([object isKindOfClass:[NSDictionary class]]) {
        for (NSString *key in originDic.allKeys) {
            id object = [originDic objectForKey:key];
            if ([object isKindOfClass:[NSString class]]||[object isKindOfClass:[NSNumber class]]) {
                //string , bool, int ,NSinteger
                [dic setObject:object forKey:key];
            } else if ([object isKindOfClass:[NSArray class]]) {
                //数组或字典
                [dic setObject:[RXCommonTool arrayWithObject:object] forKey:key];
            } else if ([object isKindOfClass:[NSDictionary class]]) {
                //数组或字典
                [dic setObject:[RXCommonTool dicWithObject:object] forKey:key];
            } else {
                //model
                [dic setObject:[RXCommonTool dicFromObject:object] forKey:key];
            }
        }
        return [dic copy];
    }
    return dic.copy;
}

/**
 * 获取当前屏幕方向
 */
+ (NSInteger)getInterfaceOrientation
{
    NSInteger ori = 0;
    UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
    
    if(orientation == 0) { //Default orientation
    
    }
    else if(orientation == UIInterfaceOrientationPortrait) { //竖屏
        ori = 1;
    }
    else if(orientation == UIInterfaceOrientationLandscapeLeft) { // 左横屏
        ori = 2;
    }
    else if(orientation == UIInterfaceOrientationLandscapeRight) { //右横屏
        ori = 2;
    }
    return ori;
}

/**
 * 验证是否是手机号
 */
+ (BOOL)validateMobile:(NSString *)phone
{
    NSString *mobile = @"^\\+?([1-9]{1}[0-9]{0,2})?[-.\\s]?\\(?([1-9][0-9]{0,3})\\)?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}$";
    NSPredicate *regexTestMobile = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", mobile];
    return [regexTestMobile evaluateWithObject:phone];
}

/**
 * 验证是否是邮箱
 */
+ (BOOL)validateEmail:(NSString *)email
{
    NSString *emailRegex = @"[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}";
    NSPredicate *emailTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", emailRegex];
    return [emailTest evaluateWithObject:email];
}

/**
 * 获取推送 taskid
 */
+ (NSString *)getTaskid
{
    if ([RXUserUtility sharedManager].isLogin) {
        return @"";
    }
    
    // 获取推送参数
    NSDictionary *pushInfo = [[NSUserDefaults standardUserDefaults] valueForKey:keyUserData_pushInfo];
    
    NSString *taskid = @"";
    if ([pushInfo isKindOfClass:[NSDictionary class]] && pushInfo.allKeys.count > 0) {
        taskid = [NSString stringWithFormat:@"%@", pushInfo[@"taskid"]];
    }
    
    return taskid;
}

/**
 * 手机号加*
 */
+ (NSString *)usernameSec:(NSString *)str
{
    NSString *username = @"";
    
    if ([str containsString:@"+"]) {
        NSString *username = [str stringByReplacingCharactersInRange:NSMakeRange(8, 3) withString:@"***"];
        return username;
    } else {
        if (str.length < 11) {
            return str;
        }
        username = [str stringByReplacingCharactersInRange:NSMakeRange(3, 4) withString:@"****"];
        return username;
    }
}

/**
 * 获取设备型号
 */
+ (NSString *)rxGetiPhoneDeviceType{
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *platform = [NSString stringWithCString:systemInfo.machine encoding:NSASCIIStringEncoding];
    return platform;
}

/**
 * 获取网络状态，WIFI、2G、3G、4G、5G、UNKNOWN
 */
+ (NSString *)rxGetNetworkStatus{
    // 使用0.0.0.0作为本地网络检测
    struct sockaddr_in address;
    memset(&address, 0, sizeof(address));
    address.sin_len = sizeof(address);
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = htonl(INADDR_ANY);
    //使用本地地址（0.0.0.0）来创建网络可达性引用，以检测本地网络状态
    SCNetworkReachabilityRef reachabilityRef = SCNetworkReachabilityCreateWithAddress(NULL, (struct sockaddr *)&address);
    SCNetworkReachabilityFlags flags;
    BOOL success = SCNetworkReachabilityGetFlags(reachabilityRef, &flags);//获取当前的网络状态标志
    CFRelease(reachabilityRef);
    
    if (!success) {
        return @"No connection flag";
    }
    
    BOOL isConnected = (flags & kSCNetworkReachabilityFlagsReachable);//表示网络是可达的
    BOOL needsConnection = (flags & kSCNetworkReachabilityFlagsConnectionRequired);//表示需要额外的连接步骤或需要连接
    BOOL isCellular = (flags & kSCNetworkReachabilityFlagsIsWWAN);//表示使用蜂窝网络
    
    if (isConnected && !needsConnection) {//如果网络可达并且不需要额外的连接步骤，connected
        if (isCellular) {//Cellular蜂窝数据
            return [self checkCellularNetworkType];
        } else {//WIFI数据
            return @"WIFI";
        }
    } else {
        return @"No connection";
    }
}

+ (NSString *)checkCellularNetworkType {
    @try {
        CTTelephonyNetworkInfo *info = [[CTTelephonyNetworkInfo alloc] init];
        /// 注意：没有SIM卡，值为空
        NSString *currentRadioAccessTechnology;
        if (@available(iOS 12.1, *)) {
            NSDictionary *radioDic = [info serviceCurrentRadioAccessTechnology];
            if (radioDic.allKeys.count) {
                currentRadioAccessTechnology = [radioDic objectForKey:radioDic.allKeys[0]];
            }
        } else {
            currentRadioAccessTechnology = info.currentRadioAccessTechnology;
        }
        
        if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyGPRS]) {
            return @"2G";//@"2G (GPRS)"
        } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyEdge]) {
            return @"2G";//@"2G (EDGE)"
        } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyWCDMA]) {
            return @"3G";//@"3G (WCDMA)"
        } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyHSDPA]) {
            return @"3G";//@"3.5G (HSDPA)"
        } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyHSUPA]) {
            return @"3G";//@"3.5G (HSUPA)"
        } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMA1x]) {
            return @"2G";//@"2G (CDMA1x)"
        } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMAEVDORev0]) {
            return @"3G";//@"3G (CDMAEVDORev0)"
        } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMAEVDORevA]) {
            return @"3G";//@"3G (CDMAEVDORevA)"
        } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMAEVDORevB]) {
            return @"3G";//@"3G (CDMAEVDORevB)"
        } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyeHRPD]) {
            return @"3G";//@"3G (eHRPD)"
        } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyLTE]) {
            return @"4G";//@"4G (LTE)"
        } else if (@available(iOS 14.1, *)) {
            if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyNRNSA]) {
                return @"5G";//@"5G (NRNSA)"
            } else if ([currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyNR]) {
                return @"5G";//@"5G (NR)"
            } else {
                return @"UNKNOWN";
            }
        } else {
            return @"UNKNOWN";
        }
    } @catch (NSException *exception) {
        return @"UNKNOWN";
    } @finally {
        
    }
}

/**
 * 获取当前语言，返回小写
 */
+ (NSString *)getCurrentLanguage{
    NSString *language = [RXCommonTool getSystemLanguage];
    NSString *setLanguage = [RXUserUtility valueForKey:keyUserData_setLanguage];
    NSMutableDictionary *profile = [RXUserUtility valueForKey:keyUserData_initProfile];
    if (profile && profile.allKeys.count > 0) {
        NSDictionary *profile_passport = profile[@"passport"];
        if ([profile_passport valueForKey:@"language_default"]) {
            language = [profile_passport valueForKey:@"language_default"];
        }
    }
    if ([NSString rx_isNullToString:setLanguage].length > 0) {
        language = setLanguage;
    }
    return [language lowercaseString];
}

/**
 * 设置自定义错误码，由RXErrorTool调用
 */
- (void)configErrorMsg:(NSDictionary *)msgDic{
    self.errorMsgDict = [NSMutableDictionary dictionaryWithDictionary:msgDic];
}

/**
 * 获取错误码信息，由RXErrorTool调用
 */
- (NSDictionary *)getCustomRXErrorMsgDic{
    return [self.errorMsgDict copy];
}

/**
 * 替换返回错误中的$thirdcode$、$thirdmsg$
 */
+ (NSDictionary *)customErrorMsgReplaceThirdCodeOrMsgWithDic:(NSDictionary *)errorMsgDic{
    NSMutableDictionary *errorDic = [NSMutableDictionary dictionaryWithDictionary:errorMsgDic];
    
    if ([[errorDic allKeys] containsObject:@"msg"]) {
        NSString *errorMsg = errorDic[@"msg"];
        
        if ([errorMsg containsString:@"$thirdcode$"]) {
            NSString *thirdCode = @"";
            if ([[errorDic allKeys] containsObject:@"thirdcode"]) {
                thirdCode = errorDic[@"thirdcode"];
            }
            errorMsg = [errorMsg stringByReplacingOccurrencesOfString:@"$thirdcode$" withString:thirdCode];
        }
        if ([errorMsg containsString:@"$thirdmsg$"]) {
            NSString *thirdmsg = @"";
            if ([[errorDic allKeys] containsObject:@"thirdmsg"]) {
                thirdmsg = errorDic[@"thirdmsg"];
            }
            errorMsg = [errorMsg stringByReplacingOccurrencesOfString:@"$thirdmsg$" withString:thirdmsg];
        }
        
        errorDic[@"msg"] = errorMsg;
    }
    return errorDic;
}

/**
 * 将"url?key1=value1&key2=value2"中的query截取并生成字典
 */
+ (NSDictionary *)parseQueryParametersFromURL:(NSString *)urlString {
    // 判空校验
    if (urlString == nil || [urlString length] == 0) {
        return @{};
    }

    // 查找 ? 的位置
    NSRange questionMarkRange = [urlString rangeOfString:@"?"];
    if (questionMarkRange.location == NSNotFound) {
        return @{}; // 如果没有 ?，直接返回 空字典
    }

    // 按照 ? 分割 URL
    NSArray *components = [urlString componentsSeparatedByString:@"?"];
    if (components.count > 1) {
        // 获取查询参数部分
        NSString *queryString = components[1];
        
        // 判空校验
        if ([queryString length] == 0) {
            NSLog(@"Error: Query string is empty.");
            return @{};
        }

        // 按照 & 分割
        NSArray *keyValuePairs = [queryString componentsSeparatedByString:@"&"];
        NSMutableDictionary *queryParams = [NSMutableDictionary dictionary];

        for (NSString *pair in keyValuePairs) {
            // 按照 = 分割每个键值对
            NSArray *keyValue = [pair componentsSeparatedByString:@"="];
            if (keyValue.count == 2) {
                NSString *key = [keyValue[0] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
                NSString *value = [keyValue[1] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
                if (key.length > 0 && value.length > 0) {
                    queryParams[key] = value;
                } else {
                    NSLog(@"Warning: Key or value is empty in pair: %@", pair);
                }
            } else {
                NSLog(@"Warning: Invalid key-value pair: %@", pair);
            }
        }

        return queryParams;
    }
    
    return @{}; // 如果没有查询参数，返回 空字典
}

/**
 * 获取 app 版本号
 */
+ (NSString *)getAppVersion
{
    NSDictionary *appInfo = [[NSBundle mainBundle] infoDictionary];
    NSString *appVersion = [appInfo objectForKey:@"CFBundleShortVersionString"];
    
    return appVersion;
}

// jsonString 转 dic
+ (NSDictionary *)stringToDictionary:(NSString *)jsonString
{
    if ([NSString rx_isNullToString:jsonString].length <= 0) {
        return nil;
    }
    NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error = nil;
    NSDictionary *dictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    
    if (error) {
        NSLog(@"JSON 解析错误: %@", error.localizedDescription);
        return nil; // 解析失败时返回 nil
    }
    
    return dictionary; // 返回转换后的 NSDictionary
}

// jsonString 转 array
+ (NSArray *)stringToArray:(NSString *)jsonString
{
    NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error = nil;
    NSArray *array = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    
    if (error) {
        NSLog(@"JSON 解析错误: %@", error.localizedDescription);
        return nil; // 解析失败时返回 nil
    }
    
    return array; // 返回转换后的 NSArray
}

/**
 * 获取设备地区
 */
+ (NSString *)getLocalArea
{
    NSLocale *locale = [NSLocale currentLocale];
    NSString *countryCode = [locale objectForKey:NSLocaleCountryCode];
    
    return countryCode;
}

/**
 * 获取请求地区
 */
+ (NSString *)getRequestArea
{
    NSString *area = [RXCommonTool getLocalArea];
    if ([RXUserUtility sharedManager].area) {
        area = [RXUserUtility sharedManager].area;
    }
    
    return area;
}

/**
 * urlencode
 */
+ (NSString *)urlEncodeString:(NSString *)str
{
    NSCharacterSet *allowedCharacterSet = [NSCharacterSet URLQueryAllowedCharacterSet];
    NSString *encodedString = [str stringByAddingPercentEncodingWithAllowedCharacters:allowedCharacterSet];
    
    return encodedString;
}

/**
 * urldecode
 */
+ (NSString *)urlDecodeString:(NSString *)encodeStr
{
    NSString *decodeStr = [encodeStr stringByRemovingPercentEncoding];
    
    return decodeStr;
}

/**
 * 获取 openinstall 透传数据
 */
+ (void)getOpeninstallParams
{
    @try {
        if ([RXSubPackage sharedSDK].aRXOpeninstall) {
            if ([RXUserUtility sharedManager].openOI) {
                
                void (^GetOpeninstallParamsBlock)(NSDictionary *params) = ^(NSDictionary *params) {
                    
                    NSLog(@"获取 wakeup 回调:\n%@", params);
                    if ([params isKindOfClass:[NSDictionary class]] && params.allKeys.count > 0) {
                        
                        NSInteger localClickTime = [[RXUserUtility valueForKey:keyUserData_oi_clickTime] integerValue];
                        NSInteger clickTime = [params[@"data"][@"click_time"] integerValue];
                        NSLog(@"oiparams赋值 clicktime = %ld   localClickTime = %ld", clickTime, localClickTime);
                        if (clickTime != 0 && clickTime > localClickTime) {
                            NSLog(@"oiparams赋值");
                            [RXUserUtility sharedManager].oiParams = params;
                            [RXUserUtility setValue:@([params[@"data"][@"click_time"] integerValue]) ForKey:keyUserData_oi_clickTime];
                        } else {
        //                    NSLog(@"当前数据已上报过");
                        }
                    }
                };
                
                NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
                [notiDic setValue:GetOpeninstallParamsBlock forKey:@"callback"];
                [notiDic setValue:[RXUserUtility sharedManager].oiDomain forKey:@"domain"];
                [notiDic setValue:[RXUserUtility sharedManager].oiAppKey forKey:@"appkey"];
                
                NSMutableDictionary *pasteboardDic = [NSMutableDictionary dictionaryWithDictionary:[RXCommonTool getPasteboradInfo]];
                if ([pasteboardDic isKindOfClass:[NSDictionary class]] && pasteboardDic.allKeys.count > 0 && [[pasteboardDic allKeys] containsObject:@"oi"]) {
                    NSString *oiPasteborad = [pasteboardDic valueForKey:@"oi"];
                    [notiDic setValue:oiPasteborad forKey:@"oi"];
                }
                
                [RXNotificationCenter postNoti:rxUserDefault_oi object:nil userInfo:notiDic];
            }
        } else {
            NSLog(@"未接入 RXOpeninstallSDK");
        }
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

@end
