//
//  RXIMSDK.m
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/19.
//

#import "RXIMSDKManager.h"
#import "RXIMSocket.h"
#import "RXIMWebSocket.h"
#import "RXIMUserUtility.h"
#import "RXIMSDKApi.h"
#import "RXIMApiUrl.h"
#import "RXIMLoginModel.h"
#import "NSObject+RXUAddition.h"
#import "RXIMCommonDevice.h"
#import "RXIMChatService.h"
#import "RXIMSessionService.h"
#import "RXIMWCDB.h"
#import "RXIMLogManager.h"
#import "RXIMNetworkError.h"
#import "RXIMInternalManager.h"
#import "RXIMCommonTool.h"
#import <RXNetworkingKit/RXNetworkingKit.h>

@interface RXIMSDKManager () <RequestDelegate>

@end

@implementation RXIMSDKManager

static RXIMSDKManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMSDKManager alloc] init];
    });
    return sharedSDK;
}

#pragma mark - 初始化sdk
- (void)initWithProductId:(NSString *)productId
                channelId:(NSString *)channelId
                     cpid:(NSInteger)cpId
               clientType:(NSInteger)clientType
                  version:(NSString *)version
                  baseUrl:(NSString *)baseUrl
{
    [RXIMUserUtility sharedManager].channelId = channelId;
    [RXIMUserUtility sharedManager].appId = productId;
    [RXIMUserUtility sharedManager].cpid = cpId;
    [RXIMUserUtility sharedManager].clientType = clientType;
    [RXIMUserUtility sharedManager].version = version;
    [RXIMUserUtility sharedManager].baseUrl = baseUrl;
    
    [RXCommonRequestConfigure sharedManger].successCode = @"0";
    [RXCommonRequestConfigure sharedManger].requestFailMsg = @"";
    [RXCommonRequestConfigure sharedManger].tokenTimeoutCode = @"302001";
    
    [RXCommonNetworkExcute shareInstance].delegate = self;
}

- (void)requestInterfaceExcuteError:(NSError *)error apiName:(NSString *)apiName apiFlag:(NSString *)apiFlag retObj:(id)retObj request:(RXCommonRequest *)request success:(RequestSuccess)success failure:(RequestFailed)failure
{
    // TODO: token失效处理
    if ([apiName isEqualToString:[RXIMApiUrl getRefreshTokenUrl]]) {
        RXLogError(prefixStr, @"code = %ld errMsg = %@",error.code,error.userInfo[@"NSLocalizedDescription"]);
        return;
    }
    [[RXIMInternalManager sharedSDK] requestRefreshTokenWithComplete:^(RXIMError * _Nonnull error) {
        if (!error) {
            request.headParams = [RXIMCommonTool headParams];
            [[RXCommonNetworkExcute shareInstance] beginRequest:request success:success failure:failure];
        }else{
            RXLogError(prefixStr, @"refresh token error");
        }
    }];
}

#pragma mark - 登录IM
- (void)loginRXIMSDKWithUserId:(NSString * _Nonnull)userId
                   accessToken:(NSString * _Nonnull)accessToken
                  refreshToken:(NSString * _Nonnull)refreshToken
                        aesKey:(NSString * _Nonnull)aesKey
                     complete:(void(^)(RXIMError *error))complete
{
    RXLogDebug(prefixStr, nil);
//#ifdef DEBUG
////#ifdef RELEASE
//    [[RXCommonNetworkExcuteManager commonRequestClient] beginRequest:[RXIMSDKApi buildLoginRequestWithUserId:userId] success:^(id  _Nullable responseObject) {
//        RXIMLoginModel *loginModel = [RXIMLoginModel rx_modelWithDictionary:responseObject];
//        if (loginModel.isSuccess && loginModel.data) {
//            //保存数据
//            [RXIMUserUtility sharedManager].userId = userId;
//            [RXIMUserUtility sharedManager].token = loginModel.data.access_token;
//            [RXIMUserUtility sharedManager].secret = loginModel.data.aeskey;
//            [RXIMUserUtility sharedManager].refreshToken = loginModel.data.refresh_token;
//            [RXIMUserUtility sharedManager].deviceCode = [RXIMCommonDevice getDeviceCodeInKeychain];
//            [RXIMUserUtility sharedManager].sessionTableName = [NSString stringWithFormat:@"session_all_%@",userId];
//            [RXIMUserUtility sharedManager].msgTableName = [NSString stringWithFormat:@"msg_all_%@",userId];
//            [RXIMUserUtility sharedManager].msgLocalId = [RXIMCommonDevice getTimestamp];
//            [[RXIMInternalManager sharedSDK] getEntryAddressWithComplete:^(RXIMError * _Nonnull error) {
//                if (!error) {
//                    if (complete) {
////                        if (![[RXIMWCDB sharedSDK] isExistDB]) {
//                            [[RXIMWCDB sharedSDK] createDB];
////                        }
//                        complete(nil);
//                    }
//                }else{
//                    if (complete) {
//                        complete(error);
//                    }
//                }
//            }];
//        }else{
//            [RXIMNetworkError internalError:loginModel complete:complete];
//        }
//    } failure:^(RXCommonRequestError * _Nullable error) {
//        [RXIMNetworkError networkError:error complete:complete];
//    }];
//    return;
//#else
    [RXIMUserUtility sharedManager].userId = userId;
//    if (IsEmpty([RXIMUserUtility sharedManager].token)) {
        [RXIMUserUtility sharedManager].token = accessToken;
//    }
//    if (IsEmpty([RXIMUserUtility sharedManager].refreshToken)) {
        [RXIMUserUtility sharedManager].refreshToken = refreshToken;
//    }
//    if (IsEmpty([RXIMUserUtility sharedManager].secret)) {
        [RXIMUserUtility sharedManager].secret = aesKey;
//    }
    [[RXIMInternalManager sharedSDK] getEntryAddressWithComplete:^(RXIMError * _Nonnull error) {
        if (!error) {
            if (complete) {
                [RXIMUserUtility sharedManager].sessionTableName = [NSString stringWithFormat:@"session_all_%@",userId];
                [RXIMUserUtility sharedManager].msgTableName = [NSString stringWithFormat:@"msg_all_%@",userId];
                [RXIMUserUtility sharedManager].msgFTSTableName = [NSString stringWithFormat:@"msgFTS_all_%@",userId];
                [RXIMUserUtility sharedManager].msgFTSTableName = [NSString stringWithFormat:@"msgFTSPinyin_all_%@",userId];

                [RXIMUserUtility sharedManager].msgLocalId = [RXIMCommonDevice getTimestamp];
//                if (![[RXIMWCDB sharedSDK] isExistDB]) {
                    [[RXIMWCDB sharedSDK] createDB];
//                }
                complete(nil);
            }
        }else{
            if (complete) {
                complete(error);
            }
        }
    }];
//#endif
}

#pragma mark - 退出登录IM
- (void)logout
{
    RXLogDebug(prefixStr, nil);
    if ([RXIMUserUtility sharedManager].socketType == RXIMSocketType_webSocket) {
        [[RXIMWebSocket sharedSDK] closeSocket];
    }else{
        [[RXIMSocket sharedSDK] closeSocket];
    }
    [[RXIMWCDB sharedSDK] deleteMsgsWithSessionType:RXIMSessionType_channel];
    [[RXIMWCDB sharedSDK] deleteSessionWithSessionType:RXIMSessionType_channel];
}

/**
 * 设置数据库的基地址
 */
- (void)setDBBasePath:(NSString *)path
{
    [RXIMUserUtility sharedManager].dbBasePath = path;
}

/**
 * 获取设备码
 */
- (NSString *)getDeviceCode
{
    return [RXIMCommonDevice getDeviceCodeInKeychain];
}


/**
 * 更新token
 */
- (void)refreshAccessToken:(NSString * _Nonnull)accessToken{
    [RXIMUserUtility sharedManager].token = accessToken;
}

@end
