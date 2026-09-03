//
//  RXOSCommonTool.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import "RXOSCommonTool.h"
#import <UIKit/UIKit.h>
#import <CommonCrypto/CommonDigest.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>
#import <AdSupport/ASIdentifierManager.h>
#import <CoreTelephony/CTCellularData.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

@implementation RXOSCommonTool

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

//md5加密然后转大写
+ (NSString*)md532BitUpperWithStr:(NSString *)str
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
    NSString *regex = @"(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,32}";

    // 密码强度设置
    RXPasswordStrength passwordType = [RXOSUserUtility sharedManager].passwordType;
    if (passwordType == Default || passwordType == Average) {
        regex = @"^.{6,32}$";
    } else if (passwordType == Custom) {
        regex = [RXOSUserUtility sharedManager].pwdPattern;
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
 * 获取bundlId
 */
+ (NSString *)getBundleId
{
    return [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleIdentifier"];
}

+ (void)saveAccountWithUsername:(NSString *)username
                       password:(NSString *)password
{
    NSMutableArray *accountArr = [NSMutableArray array];
    BOOL include = NO;
    if (accountArr.count > 0) {
        for (int i = 0; i < accountArr.count; i++) {
            NSMutableDictionary *dic = (NSMutableDictionary *)accountArr[i];
            if ([dic[@"username"] isEqualToString:username]) {
                [dic setValue:password forKey:@"password"];
                include = YES;
            }
        }
        if (!include) {
            NSMutableDictionary *accountDic = [NSMutableDictionary dictionary];
            [accountDic setValue:username forKey:@"username"];
            [accountDic setValue:password forKey:@"password"];
            [accountArr addObject:accountDic];
        }
    } else {
        NSMutableDictionary *accountDic = [NSMutableDictionary dictionary];
        [accountDic setValue:username forKey:@"username"];
        [accountDic setValue:password forKey:@"password"];
        [accountArr addObject:accountDic];
    }
}

/**
 * 弹出动画
 */
+ (void)showWithAnimate:(UIView *)view
{
    float scale = (RXAC ? RXUScreenHeight : RXUScreenWidth) / 428.0;
    if (scale > 1.0) {
        scale = 1.0;
    }
    if ([ISPAD isEqualToString:@"iPad"]) {
        scale = 1.1;
    }
//    NSLog(@"%f", RXUScreenHeight);
//    NSLog(@"%f", RXUScreenWidth);
    
    [UIView animateKeyframesWithDuration:0.15 delay:0 options:nil animations:^{
//        [UIView addKeyframeWithRelativeStartTime:0 relativeDuration:0 animations:^{
//            view.transform = CGAffineTransformMakeScale(0, 0);
//        }];
//        [UIView addKeyframeWithRelativeStartTime:1/3.0 relativeDuration:0 animations:^{
//            view.transform = CGAffineTransformMakeScale(scale, scale);
//        }];
        [UIView addKeyframeWithRelativeStartTime:0.15 relativeDuration:0 animations:^{
            view.transform = CGAffineTransformMakeScale(scale, scale);
            [view layoutSubviews];
        }];
    } completion:^(BOOL finished) {
        [view layoutSubviews];
    }];
}

+ (void)showWithAnimate:(UIView *)view duration:(NSInteger)duration
{
    float scale = (RXAC ? RXUScreenHeight : RXUScreenWidth) / 428.0;
    if (scale > 1.0) {
        scale = 1.0;
    }
    if ([ISPAD isEqualToString:@"iPad"]) {
        scale = 1.1;
    }
//    NSLog(@"%f", RXUScreenHeight);
//    NSLog(@"%f", RXUScreenWidth);
    
    [UIView animateKeyframesWithDuration:duration delay:0 options:nil animations:^{
//        [UIView addKeyframeWithRelativeStartTime:0 relativeDuration:0 animations:^{
//            view.transform = CGAffineTransformMakeScale(0, 0);
//        }];
//        [UIView addKeyframeWithRelativeStartTime:1/3.0 relativeDuration:0 animations:^{
//            view.transform = CGAffineTransformMakeScale(scale, scale);
//        }];
        [UIView addKeyframeWithRelativeStartTime:duration relativeDuration:0 animations:^{
            view.transform = CGAffineTransformMakeScale(scale, scale);
            [view layoutSubviews];
        }];
    } completion:^(BOOL finished) {
        [view layoutSubviews];
    }];
}

/**
 * 缩放比例
 */
+ (void)transformWithView:(UIView *)view
{
    float scale = (RXAC ? RXUScreenHeight : RXUScreenWidth) / 428.0;
    if (scale > 1.0) {
        scale = 1.0;
    }
    if ([ISPAD isEqualToString:@"iPad"]) {
        scale = 1.1;
    }
    
    [UIView animateKeyframesWithDuration:0 delay:0 options:nil animations:^{
        [UIView addKeyframeWithRelativeStartTime:0.15 relativeDuration:0 animations:^{
            view.transform = CGAffineTransformMakeScale(scale - 0.05, scale - 0.05);
        }];
    } completion:^(BOOL finished) {
        
    }];
}

/**
 * userType枚举转换
 */
+ (RXUserType)getUserType:(NSString *)userTypeStr
{
    if ([userTypeStr isEqualToString:@"wechat"]) {
        return RXUserType_w;
    } else if ([userTypeStr isEqualToString:@"guest"]) {
        return RXUserType_visitor;
    } else if ([userTypeStr isEqualToString:@"apple"]) {
        return RXUserType_apple;
    } else if ([userTypeStr isEqualToString:@"auth"]) {
        return RXUserType_auth;
    } else if ([userTypeStr isEqualToString:@"username"]) {
        return RXUserType_account;
    } else if ([userTypeStr isEqualToString:@"history"]) {
        return RXUserType_history;
    } else if ([userTypeStr isEqualToString:@"code"] || [userTypeStr isEqualToString:@"captchacode"]) {
        return RXUserType_code;
    } else if ([userTypeStr isEqualToString:@"google"]) {
        return RXUserType_google;
    } else if ([userTypeStr isEqualToString:@"facebook"]) {
        return RXUserType_facebook;
    } else if ([userTypeStr isEqualToString:@"line"]) {
        return RXUserType_line;
    } else if ([userTypeStr isEqualToString:@"zalo"]) {
        return RXUserType_zalo;
    } else if ([userTypeStr isEqualToString:@"tiktok"]) {
        return RXUserType_tiktok;
    } else if ([userTypeStr isEqualToString:@"snapchat"]) {
        return RXUserType_snapchat;
    } else if ([userTypeStr isEqualToString:@"instagram"]) {
        return RXUserType_instagram;
    }else if ([userTypeStr isEqualToString:@"reddit"]) {
        return RXUserType_reddit;
    }
    
    return RXUserType_apple;
}

/**
 * 保存登录成功的账号
 */
+ (void)saveAccountWithUserInfo:(NSMutableDictionary *)userInfo
{
    NSMutableArray *accounts = [NSMutableArray arrayWithArray:[RXOSUserUtility sharedManager].accounts];
    
    if (accounts.count > 0) {
        for (int i = 0; i < accounts.count; i++) {
            NSMutableDictionary *userInfo_old = accounts[i];
            /**
             * 相同登录方式进行同openid去重，并移到数组第一位
             * 不同登录方式相同openid保留
             */
            if ((LoginType)userInfo[@"loginType"] == (LoginType)userInfo_old[@"loginType"]) {
                if ([userInfo[@"openid"] isEqualToString:userInfo_old[@"openid"]]) {
                    [accounts removeObjectAtIndex:i];
                    [accounts insertObject:userInfo atIndex:0];
                    break;
                } else {
                    [accounts insertObject:userInfo atIndex:0];
                    break;
                }
            } else {
                [accounts insertObject:userInfo atIndex:0];
                break;
            }
        }
    } else {
        [accounts addObject:userInfo];
    }
    
    [RXOSUserUtility saveAccounts:accounts];
}

/**
 * 获取icon
 */
+ (NSString *)getIconWithLoginType:(LoginType)loginType username:(NSString *)username
{
    NSString *icon = @"rx_login_username";
    switch (loginType) {
        case LoginTypeVisitor:
        {
            icon = @"rx_login_visitor";
            break;
        }
        case LoginTypeApple:
        {
            icon = @"rx_login_apple";
            break;
        }
        case LoginTypeW:
        {
            icon = @"rx_login_wechat";
            break;
        }
        case LoginTypeAuth:
        {
            icon = @"rx_login_auth";
            break;
        }
        case LoginTypeAccount:
        {
            icon = @"rx_login_mail";
            break;
        }
        case LoginTypeCapCode:
        {
            icon = @"rx_login_code";
            if ([RXOSCommonTool validateEmail:username]) {
                icon = @"rx_login_mail";
            }
            break;
        }
        case LoginTypeFacebook:
        {
            icon = @"rx_login_facebook";
            break;
        }
        case LoginTypeGoogle:
        {
            icon = @"rx_login_google";
            break;
        }
        case LoginTypeLine:
        {
            icon = @"rx_login_line";
            break;
        }
        case LoginTypeZalo:
        {
            icon = @"rx_login_zalo";
            break;
        }
        case LoginTypeTikTok:
        {
            icon = @"rx_login_tiktok";
            break;
        }
        case LoginTypeSnapChat:
        {
            icon = @"rx_login_snapchat";
            break;
        }
        case LoginTypeInstagram:
        {
            icon = @"rx_login_instagram";
            break;
        }
        case LoginTypeReddit:
        {
            icon = @"rx_login_reddit";
            break;
        }
    }
    return icon;
}

/**
 * 校验密码
 */
+ (BOOL)checkPasswordWith:(NSString *)regexStr
                     text:(NSString *)text
{
    NSRegularExpression * regex = [NSRegularExpression regularExpressionWithPattern:regexStr options:NSRegularExpressionAllowCommentsAndWhitespace error:nil];
    NSArray *result = [regex matchesInString:text options:NSMatchingReportCompletion range:NSMakeRange(0, text.length)];
    NSMutableString * newStr = [[NSMutableString alloc]initWithCapacity:0];
    for(NSTextCheckingResult *item in result)
    {
        [newStr appendString:[text substringWithRange:[item rangeAtIndex:0]]];
    }
    return [text isEqualToString:newStr];
}

/**
 * 验证是否是手机号
 */
+ (BOOL)validateMobile:(NSString *)phone
{
    NSString *mobile = @"^1[1234567890]\\d{9}$";
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
 * 判断当前是否有网
 */
//+ (BOOL)hasNetwork
//{
//    CTCellularData *cellularData = [[CTCellularData alloc] init];
//
//    __block BOOL hasNetwork = YES;
//    cellularData.cellularDataRestrictionDidUpdateNotifier = ^(CTCellularDataRestrictedState state){
//        //获取联网状态
//        switch(state) {
//            case kCTCellularDataRestricted:
//                NSLog(@"Restricted");//拒绝
//                hasNetwork = NO;
//                break;
//            case kCTCellularDataNotRestricted:
//                NSLog(@"Not Restricted");//允许
//                hasNetwork = YES;
//                break;
//            case kCTCellularDataRestrictedStateUnknown:
//                NSLog(@"Unknown");//未知
//                hasNetwork = NO;
//                break;
//            default:
//                hasNetwork = YES;
//                break;
//        }
//    };
//    return hasNetwork;
//}

+ (BOOL)hasNetwork
{
    BOOL hasNetwork = YES;
    CTTelephonyNetworkInfo *info = [[CTTelephonyNetworkInfo alloc] init];
    NSDictionary *currentStatus = info.serviceCurrentRadioAccessTechnology;
    if (currentStatus && currentStatus.allKeys.count > 0) {
        hasNetwork = YES;
    } else {
        hasNetwork = NO;
    }
    return hasNetwork;
}

/**
 * 获取屏幕宽 （横竖屏）
 */
+ (CGFloat)getScreenWidth
{
    NSInteger orientation = [RXOSCommonTool getInterfaceOrientation];
    if (!RXAC) { // 竖屏
        return 346;
    } else { // 横屏
        return 381;
    }
}

/**
 * 获取屏幕高 （横竖屏）
 */
+ (CGFloat)getScreenHeight
{
    NSInteger orientation = [RXOSCommonTool getInterfaceOrientation];
    if (orientation == 1) { // 竖屏
        return 293;
    } else { // 横屏
        return 265;
    }
}

+ (NSString *)getJsonString:(NSDictionary *)dic
{
    NSError *error;
    if (!dic) return @"";
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:&error];
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    
    return jsonString;
}

+ (NSDictionary *)dictionaryWithJsonString:(NSString *)jsonString
{
    if (jsonString == nil) {
        return nil;
    }

    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData
                                                        options:NSJSONReadingMutableContainers
                                                          error:&err];
    if(err)
    {
        NSLog(@"json解析失败：%@",err);
        return nil;
    }
    return dic;
}

+ (NSString *)getVersion
{
    return [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
}

/**
 * string转dic
 */
+ (NSDictionary *)stringToDic:(NSString *)string
{
    NSData *jsonData = [string dataUsingEncoding:NSUTF8StringEncoding];

    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:nil];
    
    return dic;
}

/**
 * 初始化配置文件模型转换
 */
+ (RXOSUILoginConfig *)fetchInitProfile
{
    RXOSUILoginConfig *loginConfig = [[RXOSUILoginConfig alloc] init];
    NSMutableDictionary *initProfile = [RXOSUserUtility sharedManager].inProfile[@"passport"];
    
    // logo
    loginConfig.logoImage = [RXOSCommonTool getImageFromURL:[initProfile valueForKey:@"logo"]];
    
    // 默认登录方式
    NSString *loginType_default = [initProfile valueForKey:@"logintype_default"];
    if (loginType_default && loginType_default.length > 0) {
        if ([loginType_default isEqualToString:@"captchacode"]) {
            loginConfig.loginViewType = 1;
        } else {
            loginConfig.loginViewType = 0;
        }
    } else {
        loginConfig.loginViewType = 0;
    }
    
    // 验证码登录后是否需要设置密码
    loginConfig.needSetPassword = [[initProfile valueForKey:@"set_password"] boolValue];
    
    // 登录方式
    NSMutableArray *fetchLoginTypes = [NSMutableArray arrayWithArray:[initProfile valueForKey:@"logintypes"]];
    for (int i = 0; i < fetchLoginTypes.count; i++) {
        if ([fetchLoginTypes[i] isEqualToString:@"captchacode"]) {
            [fetchLoginTypes replaceObjectAtIndex:i withObject:@"code"];
        }
    }
    loginConfig.loginTypes = fetchLoginTypes;
    
    // 登录后是否强制实名认证
    loginConfig.needRealAuth = [[initProfile valueForKey:@"realauth"] boolValue];
    
    // 协议，大于3取前3
    NSDictionary *profile_privacies = [initProfile valueForKey:@"privacies"];
    NSMutableArray *privacies = [NSMutableArray array];
    NSMutableArray *privaceTitles = [NSMutableArray array];
    
    NSString *setLanguage = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_setLanguage];
    if (!setLanguage || setLanguage.length <= 0) {
        setLanguage = [initProfile valueForKey:@"language_default"];
    }
    for (int i = 0; i < profile_privacies.allKeys.count; i++) {
        NSString *privaceUrl = [NSString stringWithFormat:@"%@/static/landing/#/v1/legal/terms/%@/%@/%@", [[RXService sharedSDK] getFirstBaseUrl], [RXOSUserUtility sharedManager].productId, [RXOSUserUtility sharedManager].channelId, profile_privacies.allKeys[i]];
        [privacies addObject:privaceUrl];
        
        // 取标题
        NSDictionary *privaceDic = profile_privacies.allValues[i];
        if (privaceDic[setLanguage]) {
            [privaceTitles addObject:privaceDic[setLanguage]];
        } else {
            [privaceTitles addObject:privaceDic[@"en"]];
        }
    }
    
    loginConfig.privacies = privacies;
    loginConfig.privacieTitles = privaceTitles;
    
    // 注销
    NSDictionary *deregisterDic = [initProfile valueForKey:@"deregister"];
    loginConfig.isShowDeregister = [deregisterDic[@"show"] boolValue];
    loginConfig.deregisterType = deregisterDic[@"btn_type"];
    
    // 账号登录方式键盘类型，0全键盘，1数字键盘
    loginConfig.keyboardType = [[initProfile valueForKey:@"keyboard_type"] integerValue];
    
    // 是否显示底部快速登录
    loginConfig.isQuickButtonBarVisible = [[initProfile valueForKey:@"quickbuttonbar_visible"] boolValue];
    
    // 默认语言
    loginConfig.language_default = [initProfile valueForKey:@"language_default"];
    
    // 支持的语言
    loginConfig.language_able = [initProfile valueForKey:@"language_able"];
    
    return loginConfig;
}

+ (UIImage *)getImageFromURL:(NSString *)fileURL
{
    if ([RXOSUserUtility sharedManager].logoImage) {
        return [RXOSUserUtility sharedManager].logoImage;
    }
    UIImage *result;
    NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:fileURL]];
    result = [UIImage imageWithData:data];
    [RXOSUserUtility sharedManager].logoImage = result;
    return result;
}

+ (UIImage *)getNormalImageFromURL:(NSString *)fileURL
{
    UIImage *result;
    NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:fileURL]];
    result = [UIImage imageWithData:data];
    [RXOSUserUtility sharedManager].logoImage = result;
    return result;
}

/**
 * 手机号加*
 */
+ (NSString *)usernameSec:(NSString *)str
{
    NSString *username = [str stringByReplacingCharactersInRange:NSMakeRange(8, 3) withString:@"***"];
    return username;
}

/**
 * 获取国家
 */
+ (NSString *)getCountryCode
{
    NSLocale *locale = [NSLocale currentLocale];
    NSString *countryCode = [locale objectForKey:NSLocaleCountryCode];
    return countryCode;
}

/**
 * 同步三方用户信息
 */
+ (void)syncInfo:(void(^)(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error))complete
{
    NSDictionary *loginData = [RXOSUserUtility sharedManager].loginData;
    NSString *method = loginData[@"method"];
    
    // 同步fb信息
    if ([method isEqualToString:@"facebook"]) {
        
        if ([RXSubPackage sharedSDK].aFacebook) {
            RequestComplete callback = ^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
                    NSMutableDictionary *loginData1 = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].apiLoginData];
                    NSMutableDictionary *apiLoginData = [NSMutableDictionary dictionaryWithDictionary:[[NSUserDefaults standardUserDefaults] valueForKey:keyUser_loginData]];
                    NSMutableDictionary *loginData2 = [NSMutableDictionary dictionaryWithDictionary:apiLoginData[@"loginData"][@"data"]];

                    NSDictionary *userInfo = response[@"data"];
                    
                    for (int i = 0; i < userInfo.allKeys.count; i++) {
                        if (loginData && loginData.allKeys.count > 0) {
                            [loginData setValue:userInfo.allValues[i] forKey:userInfo.allKeys[i]];
                        }
                        if (loginData1 && loginData1.allKeys.count > 0) {
                            [loginData1 setValue:userInfo.allValues[i] forKey:userInfo.allKeys[i]];
                        }
                        if (loginData2 && loginData2.allKeys.count > 0) {
                            [loginData2 setValue:userInfo.allValues[i] forKey:userInfo.allKeys[i]];
                        }
                    }
                    
                    if (loginData && loginData.allKeys.count > 0) {
                        [RXOSUserUtility sharedManager].loginData = loginData;
                    }
                    if (loginData1 && loginData1.allKeys.count > 0) {
                        [RXOSUserUtility sharedManager].apiLoginData = loginData1;
                    }
                    if (loginData2 && loginData2.allKeys.count > 0) {
                        NSMutableDictionary *subLoginData = [NSMutableDictionary dictionaryWithDictionary:apiLoginData[@"loginData"]];
                        [subLoginData setValue:loginData2 forKey:@"data"];
                        [apiLoginData setValue:subLoginData forKey:@"loginData"];
                        [[NSUserDefaults standardUserDefaults] setValue:apiLoginData forKey:keyUser_loginData];
                    }
                }
                if (complete) {
                    complete(response, error);
                }
            };
            
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:callback forKey:@"callback"];
            [RXNotificationCenter postNoti:rxUserDefault_osui_sync_fb object:nil userInfo:notiDic];
        }
        
    } else if ([method isEqualToString:@"line"]) { // 同步line信息
        
        if ([RXSubPackage sharedSDK].aLine) {
            RequestComplete callback = ^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                if (!error) {
                    NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
                    NSMutableDictionary *loginData1 = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].apiLoginData];
                    NSMutableDictionary *apiLoginData = [NSMutableDictionary dictionaryWithDictionary:[[NSUserDefaults standardUserDefaults] valueForKey:keyUser_loginData]];
                    NSMutableDictionary *loginData2 = [NSMutableDictionary dictionaryWithDictionary:apiLoginData[@"loginData"][@"data"]];
                    
                    NSDictionary *userInfo = response[@"data"];
                    
                    for (int i = 0; i < userInfo.allKeys.count; i++) {
                        if (loginData && loginData.allKeys.count > 0) {
                            [loginData setValue:userInfo.allValues[i] forKey:userInfo.allKeys[i]];
                        }
                        if (loginData1 && loginData1.allKeys.count > 0) {
                            [loginData1 setValue:userInfo.allValues[i] forKey:userInfo.allKeys[i]];
                        }
                        if (loginData2 && loginData2.allKeys.count > 0) {
                            [loginData2 setValue:userInfo.allValues[i] forKey:userInfo.allKeys[i]];
                        }
                    }
                    
                    if (loginData && loginData.allKeys.count > 0) {
                        [RXOSUserUtility sharedManager].loginData = loginData;
                    }
                    if (loginData1 && loginData1.allKeys.count > 0) {
                        [RXOSUserUtility sharedManager].apiLoginData = loginData1;
                    }
                    if (loginData2 && loginData2.allKeys.count > 0) {
                        [apiLoginData setValue:loginData2 forKey:@"data"];
                        [[NSUserDefaults standardUserDefaults] setValue:apiLoginData forKey:keyUser_loginData];
                    }
                }
                if (complete) {
                    complete(response, error);
                }
            };
            
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:callback forKey:@"callback"];
            [RXNotificationCenter postNoti:rxUserDefault_osui_sync_line object:nil userInfo:notiDic];
        }
    } else {
        
    }
}

/**
 * 刷新token
 */
+ (void)refreshToken:(void(^)(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error))complete
{
    [[RXApiService sharedSDK] refreshTokenWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (!error) {
            NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
            NSMutableDictionary *loginData1 = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].apiLoginData];
            NSMutableDictionary *apiLoginData = [NSMutableDictionary dictionaryWithDictionary:[[NSUserDefaults standardUserDefaults] valueForKey:keyUser_loginData]];
            NSMutableDictionary *loginData2 = [NSMutableDictionary dictionaryWithDictionary:apiLoginData[@"loginData"][@"data"]];

            NSDictionary *tokenDic = response[@"data"];
            
            if (loginData && loginData.allKeys.count > 0) {
                [loginData setValue:tokenDic forKey:@"token"];
                [RXOSUserUtility sharedManager].loginData = loginData;
            }
            if (loginData1 && loginData1.allKeys.count > 0) {
                [loginData1 setValue:tokenDic forKey:@"token"];
                [RXOSUserUtility sharedManager].apiLoginData = loginData1;
            }
            if (loginData2 && loginData2.allKeys.count > 0) {
                [loginData2 setValue:tokenDic forKey:@"token"];
                [apiLoginData setValue:loginData2 forKey:@"data"];
                [[NSUserDefaults standardUserDefaults] setValue:apiLoginData forKey:keyUser_loginData];
            }
            if (complete) {
                complete(response, nil);
            }
        } else {
            if (complete) {
                complete(nil, error);
            }
        }
    }];
}

/**
 * 获取当前设置的语言
 */
+ (NSString *)getLanguage
{
    NSString *setLanguage = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_setLanguage];
    return setLanguage;
}

/**
 * 是否为RTL布局
 */
+ (BOOL)isRTL
{
    NSString *language = [RXOSCommonTool getLanguage];
    if ([language isEqualToString:@"ar"]) {
        return YES;
    }
    return NO;
}

/**
 * 模型转换
 */
+ (RXOSUILoginConfig *)toConfig:(RXLoginUIModel *)model
{
    RXOSUILoginConfig *config = [[RXOSUILoginConfig alloc] init];
    config.loginTypes = model.loginMethods;
    config.privacies = model.privacies;
    config.privacieTitles = model.privacieTitles;
    config.logoImage = model.logoImage;
    config.isShowClose = model.isShowClose;
    config.loginViewType = model.loginViewType;
    config.keyboardType = model.keyboardType;
//    config.needRealAuth = model.needRealAuth;
//    config.canCloseRealAuth = model.canCloseRealAuth;
    config.needSetPassword = model.setFirstNeedSetPassword;
    config.isQuickButtonBarVisible = model.setQuickButtonBarVisible;
    config.isShowDeregister = model.setDeregisterShow;
    config.deregisterType = model.setLoginContinue ? @"login" : @"logout";
//    config.isHistoryViewEnable = model.isHistoryViewEnable;
    config.closeEmailRegister = model.closeEmailRegister;
    config.isAudit = model.isAudit;
    config.realAuthRegion = model.realAuthRegion;

    return config;
}

+ (RXOSUILoginConfig *)toConfigNew:(RXLoginUIModel *)model
{
    RXOSUILoginConfig *config = [[RXOSUILoginConfig alloc] init];
    
    if ([model.loginMethods isKindOfClass:[NSArray class]] && model.loginMethods.count > 0) {
        config.loginTypes = model.loginMethods;
    }
    if ([model.privacies isKindOfClass:[NSArray class]] && model.privacies.count > 0) {
        config.privacies = model.privacies;
    }
    if ([model.privacieTitles isKindOfClass:[NSArray class]] && model.privacieTitles.count > 0) {
        config.privacieTitles = model.privacieTitles;
    }
    if ([model.logoImage isKindOfClass:[UIImage class]] && model.logoImage) {
        config.logoImage = model.logoImage;
    }
    if (config.isShowClose) {
        config.isShowClose = model.isShowClose;
    }
    if (config.needSetPassword) {
        config.needSetPassword = model.setFirstNeedSetPassword;
    }
    if (config.isShowDeregister) {
        config.isShowDeregister = model.setDeregisterShow;
    }
    if (config.deregisterType) {
        config.deregisterType = model.setLoginContinue ? @"login" : @"logout";
    }
    if (config.closeEmailRegister) {
        config.closeEmailRegister = model.closeEmailRegister;
    }
    if (config.isAudit) {
        config.isAudit = model.isAudit;
    }
    if (config.realAuthRegion) {
        config.realAuthRegion = model.realAuthRegion;
    }

    return config;
}

+ (RXOSUILoginConfig *)configToConfig:(RXOSUILoginConfig *)model
                               config:(RXOSUILoginConfig *)config
{   
    if ([model.loginTypes isKindOfClass:[NSArray class]] && model.loginTypes.count > 0) {
        config.loginTypes = model.loginTypes;
    }
    if ([model.privacies isKindOfClass:[NSArray class]] && model.privacies.count > 0) {
        config.privacies = model.privacies;
    }
    if ([model.privacieTitles isKindOfClass:[NSArray class]] && model.privacieTitles.count > 0) {
        config.privacieTitles = model.privacieTitles;
    }
    if ([model.logoImage isKindOfClass:[UIImage class]] && model.logoImage) {
        config.logoImage = model.logoImage;
    }
    if (model.isShowClose) {
        config.isShowClose = model.isShowClose;
    }
    if (model.needSetPassword) {
        config.needSetPassword = model.needSetPassword;
    }
    if (model.isShowDeregister) {
        config.isShowDeregister = model.isShowDeregister;
    }
    if (model.deregisterType) {
        config.deregisterType = model.setLoginContinue ? @"login" : @"logout";
    }
    if (model.closeEmailRegister) {
        config.closeEmailRegister = model.closeEmailRegister;
    }
    if (model.isAudit) {
        config.isAudit = model.isAudit;
    }
    if (model.realAuthRegion) {
        config.realAuthRegion = model.realAuthRegion;
    }
    if (model.setCustomExt) {
        config.setCustomExt = model.setCustomExt;
    }

    return config;
}

/**
 * 登录类型转换
 */
+ (NSString *)toMethodStr:(long)loginType
{
    NSString *method = @"";
    
    switch (loginType) {
        case 0:
            method = @"guest";
            break;
        case 1:
            method = @"username";
            break;
        case 2:
            method = @"email";
            break;
        case 3:
            method = @"quickphone";
            break;
        case 4:
            method = @"wechat";
            break;
        case 5:
            method = @"apple";
            break;
        case 7:
            method = @"google";
            break;
        case 8:
            method = @"facebook";
            break;
        case 10:
            method = @"captchacode";
            break;
        case 11:
            method = @"line";
            break;
        case 12:
            method = @"zalo";
            break;
        case 13:
            method = @"tiktok";
            break;
        case 14:
            method = @"snapchat";
            break;
        case 15:
            method = @"instagram";
            break;
        case 16:
            method = @"reddit";
            break;
        default:
            break;
    }
    
    return method;
}

/**
 * 登录类型转换
 */
+ (long)toLoginType:(NSString *)method
{
    long loginType = 0;
    
    if ([method isEqualToString:@"guest"]) {
        loginType = 0;
    } else if ([method isEqualToString:@"username"]) {
        loginType = 1;
    } else if ([method isEqualToString:@"email"]) {
        loginType = 2;
    } else if ([method isEqualToString:@"quickphone"]) {
        loginType = 3;
    } else if ([method isEqualToString:@"wechat"]) {
        loginType = 4;
    } else if ([method isEqualToString:@"apple"]) {
        loginType = 5;
    } else if ([method isEqualToString:@"google"]) {
        loginType = 7;
    } else if ([method isEqualToString:@"facebook"]) {
        loginType = 8;
    } else if ([method isEqualToString:@"captchacode"]) {
        loginType = 10;
    } else if ([method isEqualToString:@"line"]) {
        loginType = 11;
    } else if ([method isEqualToString:@"zalo"]) {
        loginType = 12;
    } else if ([method isEqualToString:@"tiktok"]) {
        loginType = 13;
    } else if ([method isEqualToString:@"snapchat"]) {
        loginType = 14;
    } else if ([method isEqualToString:@"instagram"]) {
        loginType = 15;
    } else if ([method isEqualToString:@"reddit"]) {
        loginType = 16;
    }
    
    return loginType;
}

@end
