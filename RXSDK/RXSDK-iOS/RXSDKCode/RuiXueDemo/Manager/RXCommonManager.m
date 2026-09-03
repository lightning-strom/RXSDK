//
//  RXCommonManager.m
//  RXSDK-Pure
//
//  Created by 陈汉 on 2024/3/28.
//

#import "RXCommonManager.h"
#import <objc/message.h>
#import <RXSDK_Pure/RXLogService.h>

typedef void(^GetAppsInfoBlock)(NSArray *result);

@interface RXCommonManager ()

@property (nonatomic, copy) GetAppsInfoBlock getAppsInfoBlock;

@end

@implementation RXCommonManager

static RXCommonManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXCommonManager alloc] init];
    });
    return sharedSDK;
}

/**
 * 上报
 */
- (void)reportAppInfo
{
    NSDictionary *appsConfig = [RXUserUtility valueForKey:keyUserData_appsInfo];
    
    if (!appsConfig || appsConfig.allKeys.count <= 0) {
        return;
    }
    
    // 上报间隔（秒）
    NSInteger ts = [appsConfig[@"ts"] integerValue];
    
    // 不存在给出提示
    if (![RXSubPackage sharedSDK].aRXList) {
        NSLog(@"未接入RXAppListSDK");
        return;
    }
    
    // 判断两次上报间隔是否小于初始化下发的策略，小于不上报，大于上报
    NSInteger lastReportTS = [[RXUserUtility valueForKey:keyUserData_appsInfo_reportTS] integerValue];
    NSInteger reportTS = [RXCommonTool getTimestamp] / 1000;
    NSInteger limit = [appsConfig[@"ts"] integerValue];
    NSInteger interval = labs(reportTS - lastReportTS);
    
    if (limit > 0 && (interval > limit)) {
        
    } else {
        NSLog(@"未达到上报条件");
    }
    
    self.getAppsInfoBlock = ^(NSArray *result) {
        if (result && result.count > 0) {
            [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_apps distinctId:@"" properties:@{@"lists" : result}];
            
            // 记录上报时间，实时性要求不高，不需要等上报回调
            [RXUserUtility setValue:@(reportTS) ForKey:keyUserData_appsInfo_reportTS];
        }
    };
    
    NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
    [notiDic setValue:appsConfig forKey:@"appsConfig"];
    [notiDic setValue:self.getAppsInfoBlock forKey:@"callback"];
    [RXNotificationCenter postNoti:rxUserDefault_alist object:nil userInfo:notiDic];
}

/**
 * 设置默认语言
 */
- (void)setDefaultLanguage
{
    NSString *language = [RXCommonTool getSystemLanguage];
    
    NSArray *lang = [language componentsSeparatedByString:@"-"];
    
    if (lang.count > 1) {
        language = lang[0];
    }
    
    if (![self languageVisible:language]) {
        NSDictionary *configLanguageInfo = [RXUserUtility valueForKey:keyUserData_configLanguage];
        language = configLanguageInfo[@"df"];
    }
    
    [[RXService sharedSDK] setLanguage:language];
}

/**
 *
 */
- (BOOL)languageVisible:(NSString *)language
{
    BOOL isVisible = NO;
    if ([[language lowercaseString] isEqualToString:@"ja"]) { // 日语
        isVisible = YES;
    } else if ([[language lowercaseString] isEqualToString:@"id"]) { // 印尼语
        isVisible = YES;
    } else if ([[language lowercaseString] isEqualToString:@"tc"]) { // 繁体中文
        isVisible = YES;
    } else if ([[language lowercaseString] isEqualToString:@"th"]) { // 泰文
        isVisible = YES;
    } else if ([[language lowercaseString] isEqualToString:@"tl"]) { // 菲律宾语
        isVisible = YES;
    } else if ([[language lowercaseString] isEqualToString:@"vi"]) { // 越南语
        isVisible = YES;
    } else if ([[language lowercaseString] isEqualToString:@"ar"]) { // 阿拉伯语
        isVisible = YES;
    }else if ([[language lowercaseString] isEqualToString:@"en"]) { // 英语
        isVisible = YES;
    }
    
    return isVisible;
}

/**
 * 上报用户属性
 */
- (void)reportUserSetWithAction:(NSString *)action properties:(NSDictionary *)properties
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:action].length > 0) {
        [dic setValue:action forKey:@"action"];
    }
    
    if (properties && [properties isKindOfClass:[NSDictionary class]]) {
        [dic setValue:properties forKey:@"properties"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/passport/user/report" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"用户属性上报成功:\n %@", responseObject);
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"用户属性上报失败:\n %@", error.error);
    }];
}

@end
