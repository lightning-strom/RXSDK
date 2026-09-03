//
//  RXIMCommonTool.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import "RXIMCommonTool.h"
#import <UIKit/UIKit.h>
#import <CommonCrypto/CommonDigest.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>
#import <AdSupport/ASIdentifierManager.h>
#import <objc/runtime.h>
#import "RXIMUserUtility.h"
#import "RXIMCommonDevice.h"
#import "RXIMErrorCode.h"

@implementation RXIMCommonTool

/** 获取当前屏幕方向 */
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
        NSArray *pasteArr = [pasteString componentsSeparatedByString:@"&"];
        
        for (int i = 0; i < pasteArr.count; i++) {
            NSString *kvcStr = pasteArr[i];
            NSArray *kvcArr = [kvcStr componentsSeparatedByString:@"="];
            if (kvcArr.count > 0) {
                [adDic setValue:[NSString stringWithFormat:@"%@", kvcArr[1]] forKey:kvcArr[0]];
            }
        }
        pasteboard.string = @"";
    }
    return adDic;
}

/**
 * 获取当前时间戳
 */
+ (NSString *)getNowTimeTimestamp
{
    NSDateFormatter *formatter = [[NSDateFormatter alloc] init] ;
    [formatter setDateStyle:NSDateFormatterMediumStyle];
    [formatter setTimeStyle:NSDateFormatterShortStyle];
    [formatter setDateFormat:@"YYYY-MM-dd HH:mm:ss"];
    NSTimeZone* timeZone = [NSTimeZone timeZoneWithName:@"Asia/Shanghai"];
    [formatter setTimeZone:timeZone];
    NSDate *datenow = [NSDate date];//现在时间,你可以输出来看下是什么格式
    NSString *timeSp = [NSString stringWithFormat:@"%ld", (long)[datenow timeIntervalSince1970]];
    return timeSp;
}

/**
 * 获取当前时间  yyyy-MM-dd HH:mm:ss.SSS
 */
+ (NSString *)getTimeForStr
{
    NSDate *date = [NSDate date];
    NSDateFormatter *format1 = [[NSDateFormatter alloc] init];
    [format1 setDateFormat:@"yyyy-MM-dd HH:mm:ss.SSS"];
    NSString *dateStr;
    dateStr = [format1 stringFromDate:date];
    
    return dateStr;
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

+ (BOOL)checkPasswordWithPwd:(NSString *)pwd
{
    NSString *regex = @"[a-zA-Z0-9_@#%&*!$.-]{6,32}";
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
 * 获取bundlId
 */
+ (NSString *)getBundleId
{
    return [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleIdentifier"];
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

+ (BOOL)checkUrlWithString:(NSString *)urlStr
{
    if(urlStr == nil) {
        return NO;
    }
    NSString *url;
    if (urlStr.length>4 && [[urlStr substringToIndex:4] isEqualToString:@"www."]) {
        url = [NSString stringWithFormat:@"http://%@",self];
    }else{
        url = urlStr;
    }
    NSString *urlRegex = @"\\bhttps?://[a-zA-Z0-9\\-.]+(?::(\\d+))?(?:(?:/[a-zA-Z0-9\\-._?,'+\\&%$=~*!():@\\\\]*)+)?";
    NSPredicate* urlTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", urlRegex];
    return [urlTest evaluateWithObject:url];
}

//model转化为字典
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
            [dic setObject:[RXIMCommonTool arrayWithObject:value] forKey:name];
        } else if ([value isKindOfClass:[NSDictionary class]]) {
            //数组或字典
            [dic setObject:[self dicWithObject:value] forKey:name];
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
                [array addObject:[RXIMCommonTool arrayWithObject:object]];
            } else if ([object isKindOfClass:[NSDictionary class]]) {
                //数组或字典
                [array addObject:[RXIMCommonTool dicWithObject:object]];
            } else {
                //model
                [array addObject:[RXIMCommonTool dicFromObject:object]];
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
                [dic setObject:[RXIMCommonTool arrayWithObject:object] forKey:key];
            } else if ([object isKindOfClass:[NSDictionary class]]) {
                //数组或字典
                [dic setObject:[RXIMCommonTool dicWithObject:object] forKey:key];
            } else {
                //model
                [dic setObject:[RXIMCommonTool dicFromObject:object] forKey:key];
            }
        }
        return [dic copy];
    }
    return dic.copy;
}

+ (NSMutableDictionary *)headParams
{
    NSArray *languageArr = [RXIMCommonTool getLanguageCountry];
    NSString *language = languageArr[0];
    if (languageArr.count > 1) {
        NSArray *compareLan = [[languageArr[0] description] componentsSeparatedByString:@"-"];
        if (compareLan.count > 1) {
            language = [NSString stringWithFormat:@"%@-%@", compareLan[0], languageArr[1]];
        }
    }
    if (!language) {
        language = @"zh-CN";
    }
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXIMCommonTool uuid] forKey:@"ruixue-traceid"];
    [dic setValue:[RXIMUserUtility sharedManager].token forKey:@"ruixue-accesstoken"];
    [dic setValue:language forKey:@"ruixue-language"];
    [dic setValue:[RXIMUserUtility sharedManager].appId forKey:@"ruixue-appid"];
    [dic setValue:[RXIMUserUtility sharedManager].appId forKey:@"ruixue-productid"];
    [dic setValue:[NSString stringWithFormat:@"%ld",(long)[RXIMUserUtility sharedManager].cpid] forKey:@"ruixue-cpid"];
    [dic setValue:[RXIMUserUtility sharedManager].channelId forKey:@"ruixue-channelid"];
    [dic setValue:@"2" forKey:@"ruixue-platformid"];
    [dic setValue:[RXIMCommonDevice getDeviceCodeInKeychain] forKey:@"ruixue-devicecode"];
    [dic setValue:[RXIMUserUtility sharedManager].version forKey:@"ruixue-version"];
    [dic setValue:@"application/json" forKey:@"Content-Type"];
    
//    NSLog(@"请求头:\n %@",dic);
    
    return dic;
}

+ (NSInteger)getRandomInt:(NSInteger)value
{
    return (arc4random() % value) + 1;
}

+ (RXIMError *)verifyIsSupportBusiness
{
    RXIMError *error = nil;
    if (![RXIMUserUtility sharedManager].isBusiness) {
        error = [[RXIMError alloc]init];
        error.code = BasicErrCode_Nonsupport;
        error.developerMessage = @"暂不支持的业务";
    }
    return error;
}

@end
