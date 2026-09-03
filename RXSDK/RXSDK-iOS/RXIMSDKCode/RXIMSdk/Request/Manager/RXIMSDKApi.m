//
//  RXIMSDKApi.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/27.
//

#import "RXIMSDKApi.h"
#import "RXIMCommonDevice.h"
#import "RXIMUserUtility.h"
#import "RXIMLogManager.h"
#import "RXIMApiUrl.h"
#import "RXIMCommonTool.h"

@implementation RXIMSDKApi

// 登陆
+ (RXCommonRequest *)buildLoginRequestWithUserId:(NSString *)userid
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:userid forKey:@"user_id"];
    NSInteger clientType = [RXIMUserUtility sharedManager].clientType;
    [dic setValue:@(clientType) forKey:@"client_type"];
    
    RXCommonRequest *request = [[RXCommonRequest alloc] initWithApiName:[RXIMApiUrl getLoginUrl] andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXIMUserUtility sharedManager].baseUrl;
    request.headParams = [RXIMCommonTool headParams];
    return request;
}

@end
