//
//  RXIMInternalManager.m
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/22.
//

#import "RXIMInternalManager.h"
#import "RXIMInternalApi.h"
#import "RXIMLogManager.h"
#import "RXIMLoginModel.h"
#import "RXIMNetworkError.h"
#import "RXIMUserUtility.h"
#import "RXIMSocket.h"
#import "NSObject+RXUAddition.h"

@implementation RXIMInternalManager

static RXIMInternalManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMInternalManager alloc] init];
    });
    return sharedSDK;
}

#pragma mark - 刷新token
- (void)requestRefreshTokenWithComplete:(void(^)(RXIMError *error))complete
{
    RXLogDebug(prefixStr, nil);
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildRefreshTokenRequestWithRefreshToken:[RXIMUserUtility sharedManager].refreshToken] success:^(id  _Nullable responseObject) {
        
        RXIMLoginModel *model = [RXIMLoginModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess) {
            [RXIMUserUtility sharedManager].token = model.data.access_token;
            [RXIMUserUtility sharedManager].refreshToken = model.data.refresh_token;
            complete(nil);
        }else{
            [RXIMNetworkError internalError:model complete:complete];
        }
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:complete];
    }];
}

#pragma mark - 更换entry地址
- (void)getEntryAddressWithComplete:(void(^)(RXIMError *error))complete;
{
    RXLogDebug(prefixStr, nil);
    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMInternalApi buildGetEntryAddressWithOldEntryAddress:[RXIMUserUtility sharedManager].entryAddress] success:^(id  _Nullable responseObject) {
        RXIMConnectModel *model = [RXIMConnectModel rx_modelWithDictionary:responseObject];
        if (model.isSuccess && model.data) {
            NSString *entryAddress = model.data.entry_addrs[0];
            NSString *preStr = [entryAddress substringToIndex:3];
            if ([preStr isEqualToString:@"ws:"]) {
                [RXIMUserUtility sharedManager].socketType = RXIMSocketType_webSocket;
            }else{
                [RXIMUserUtility sharedManager].socketType = RXIMSocketType_socket;
            }
            [RXIMUserUtility sharedManager].entryAddress = model.data.entry_addrs;
        #ifdef RXIMSDK
            [RXIMUserUtility sharedManager].isBusiness = false;
        #else
//            [RXIMUserUtility sharedManager].isBusiness = model.data.business;
            [RXIMUserUtility sharedManager].isBusiness = true;
        #endif
            RXLogInfo(prefixStr, @"[RXIMUserUtility sharedManager].entryAddress = %@",[RXIMUserUtility sharedManager].entryAddress);
            RXIMConnectSts *stsModel = [RXIMConnectSts rx_modelWithDictionary:model.data.sts];
            [RXIMUserUtility sharedManager].ossEndpoint = stsModel.end_point;
            [RXIMUserUtility sharedManager].ossBucketName = stsModel.bucket;
            [RXIMUserUtility sharedManager].ossDomain = stsModel.domain;
            NSInteger timeout = model.data.conn_timeout_milli;
            if (timeout == 0) {
                timeout = 5;
            }else{
                timeout = timeout;
            }
            [RXIMUserUtility sharedManager].entryTimeout = timeout;
            if (complete) {
                complete(nil);
            }
        }else{
            [RXIMNetworkError internalError:model complete:complete];
        }
        
    } failure:^(RXCommonRequestError * _Nullable error) {
        [RXIMNetworkError networkError:error complete:complete];
    }];
}


@end
