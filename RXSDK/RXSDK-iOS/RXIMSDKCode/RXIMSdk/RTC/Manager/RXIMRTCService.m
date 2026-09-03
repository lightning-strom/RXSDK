//
//  RXIMRTCService.m
//  RXIMSdk
//
//  Created by 魏永健 on 2022/12/20.
//

#import "RXIMRTCService.h"
#import "RXIMInternalApi.h"
#import "RXIMNetworkError.h"
#import "RXIMSessionInterfaceModel.h"
#import "RXIMRTCAuthInfoInterface.h"
#import "RXIMUserUtility.h"
#import "RXIMCommonTool.h"
#import "NSObject+RXUAddition.h"

@implementation RXIMRTCService

static RXIMRTCService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMRTCService alloc] init];
    });
    return sharedSDK;
}

- (void)getRtcAuthInfo:(NSString *)channelId
     completionHandler:(void (^)(RXIMRTCAuthInfo *authInfo,RXIMError *error))completionHandler
{
    if (channelId==nil || channelId.length == 0) {
        channelId = [NSString stringWithFormat:@"%ld-%@-%@",[RXIMUserUtility sharedManager].cpid,[RXIMUserUtility sharedManager].userId,[RXIMCommonTool getNowTimeTimestamp]];
    }
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildGetRtcAuthInfo:channelId] success:^(id  _Nullable responseObject) {
        RXIMRTCAuthInfoInterface *interfaceModel = [RXIMRTCAuthInfoInterface rx_modelWithDictionary:responseObject];
        if (interfaceModel.isSuccess) {
            if (completionHandler) {
                completionHandler(interfaceModel.data,nil);
            }
        }else{
            [RXIMNetworkError internalError:interfaceModel completeWithArgument:completionHandler];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error completeWithArgument:completionHandler];
    }];
}

@end
