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
    RXCommonRequestConfigure * config=[[RXCommonRequestConfigure alloc] init];
    NSMutableDictionary *tHeadDic = [self headParams];
    config.mheadParams=tHeadDic;
    config.baseUrl=[RXConfig sharedManager].apiDomain;
    RX_CommonNetworkExcute * client= [RX_CommonNetworkExcute shareInstanceWithConfig:config];
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
    NSArray *languageArr = [RXCommonTool getLanguageCountry];
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
    [dic setValue:[RXCommonTool uuid] forKey:@"ruixue-traceid"];
    [dic setValue:[RXUserUtility sharedManager].access forKey:@"ruixue-accesstoken"];
    [dic setValue:language forKey:@"ruixue-language"];
    [dic setValue:[RXUserUtility sharedManager].productId forKey:@"ruixue-productid"];
    [dic setValue:[RXUserUtility sharedManager].cpid forKey:@"ruixue-cpid"];
    [dic setValue:[RXUserUtility sharedManager].channelId forKey:@"ruixue-channelid"];
    [dic setValue:@"2" forKey:@"ruixue-platformid"];
    [dic setValue:[DeviceKey getDeviceIDInKeychain] forKey:@"ruixue-devicecode"];
    [dic setValue:@"v2.1.9" forKey:@"ruixue-version"];
    [dic setValue:@"application/json" forKey:@"Content-Type"];
    
    NSLog(@"请求头:\n %@",dic);
    
    return dic;
    
//    return [@{@"ruixue-traceid" : [ToolApi uuid],
//              @"ruixue-accesstoken" : [RXUserUtility sharedManager].access,
//              @"ruixue-appid" : [RXUserUtility sharedManager].appId,
//              @"ruixue-language" : language,
//              @"ruixue-cpid" : [RXUserUtility sharedManager].cpid,
//              @"ruixue-channelid" : [RXUserUtility sharedManager].channelId,
//              @"ruixue-platformid" : @"2",
//              @"ruixue-devicecode" : [DeviceKey getDeviceIDInKeychain],
//              @"Content-Type" : @"application/json",
//            } mutableCopy];
}

@end
