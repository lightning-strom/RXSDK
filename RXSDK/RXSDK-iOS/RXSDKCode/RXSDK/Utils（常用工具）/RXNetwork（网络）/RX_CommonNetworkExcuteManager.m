//
//  RX_NetworkExcuteManager.m
//  OverseaSocialApp
//
//  Created by 陈汉 on 2021/4/15.
//

#import "RX_CommonNetworkExcuteManager.h"
#import "RXConfig.h"
#import "RXCommonHeader.h"
#import "DeviceKey.h"

@implementation RX_CommonNetworkExcuteManager

+ (RX_CommonNetworkExcute *) buildNetworkExcuteWithBaseUrl:(NSString *)baseUrl
{
    RX_CommonRequestConfigure * config=[[RX_CommonRequestConfigure alloc] init];
//    NSMutableDictionary *tHeadDic = [self headParams];
//    config.mheadParams=tHeadDic;
    config.baseUrl=[RXConfig sharedManager].apiDomain;
    RX_CommonNetworkExcute * client= [RX_CommonNetworkExcute shareInstance];
    if (client) {
        client.configure=config;
        client.tokenBlock = ^{
            //TODO:token失效回调
            NSLog(@"token失效回调");
        };
    }
    return client;
}

+ (RX_CommonNetworkExcute *)commonRequestClient
{
    return [self buildNetworkExcuteWithBaseUrl:[RXConfig sharedManager].apiDomain];
}

+ (NSMutableDictionary *)headParams
{    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXCommonTool uuid] forKey:@"ruixue-traceid"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_access] forKey:@"ruixue-accesstoken"];
    
    NSString *language = [RXCommonTool getSystemLanguage];
    NSString *setLanguage = [RXUserUtility valueForKey:keyUserData_setLanguage];
    NSMutableDictionary *profile = [RXUserUtility valueForKey:keyUserData_initProfile];
    if ([NSString rx_isNullToString:setLanguage].length > 0) {
        language = setLanguage;
    } else if (profile && profile.allKeys.count > 0) {
        NSDictionary *profile_passport = profile[@"passport"];
        if ([profile_passport valueForKey:@"language_default"]) {
            language = [profile_passport valueForKey:@"language_default"];
        }
    }
    
    [dic setValue:language forKey:@"ruixue-language"];
    [dic setValue:[RXCommonTool getTimeZoneOffset] forKey:@"ruixue-tzoffset"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"ruixue-productid"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_cpId] forKey:@"ruixue-cpid"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"ruixue-channelid"];
    [dic setValue:@"2" forKey:@"ruixue-platformid"];
    [dic setValue:[DeviceKey getDeviceIDInKeychain] forKey:@"ruixue-devicecode"];
    [dic setValue:sdkVersion forKey:@"ruixue-version"];
    [dic setValue:@"application/json" forKey:@"Content-Type"];
    
    if ([RXUserUtility sharedManager].needEncrypt) {
        [dic setValue:@"text/plain" forKey:@"Content-Type"];
        [dic setValue:@"1" forKey:@"ruixue-encipher"];
    }
    
    NSString *appInfo = [RX_CommonNetworkExcuteManager getAppInfo];
    if ([NSString rx_isNullToString:appInfo].length > 0) {
        [dic setValue:appInfo forKey:@"ruixue-appinfo"];
    }

    NSString *regionTag = [RX_CommonNetworkExcuteManager getRegionTag];
    if ([NSString rx_isNullToString:regionTag].length > 0) {
        [dic setValue:regionTag forKey:@"ruixue-region"];
    }
    
    NSString *cpRoleId = [RX_CommonNetworkExcuteManager getCpRoleId];
    if ([NSString rx_isNullToString:cpRoleId].length > 0) {
        [dic setValue:cpRoleId forKey:@"ruixue-cp-role-id"];
    }
    
    NSString *area = [RXCommonTool getRequestArea];
    if ([NSString rx_isNullToString:area].length > 0) {
        [dic setValue:area forKey:@"ruixue-area"];
    }
    
    return dic;
}

+ (NSString *)getAppInfo
{
    // app 版本号
    NSString *appVersion = [RXCommonTool getAppVersion];
    NSString *appInfoStr = @"";
    if ([NSString rx_isNullToString:appVersion].length > 0) {
        appInfoStr = [NSString stringWithFormat:@"version=%@", appVersion];
    }
    
    return appInfoStr;
}

+ (NSString *)getRegionTag
{
    NSString *regionTag = [RXUserUtility sharedManager].cpRegionTag;
    
    return regionTag;
}

+ (NSString *)getCpRoleId
{
    NSString *cpRoleId = [RXUserUtility sharedManager].cpRoleId;
        
    return cpRoleId;
}

@end
