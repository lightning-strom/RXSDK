//
//  RXIMSDKManager_Busniess.m
//  Busniess
//
//  Created by Elbay on 2024/5/28.
//

#import "RXIMSDKManager_BS.h"

@implementation RXIMSDKManager_BS

+ (instancetype)sharedSDK
{
    static RXIMSDKManager_BS *sharedSDK = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIMSDKManager_BS alloc] init];
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

    [[RXIMSDKManager sharedSDK] initWithProductId:productId channelId:channelId cpid:cpId clientType:clientType version:version baseUrl:baseUrl];

}

- (void)loginRXIMSDKWithUserId:(NSString * _Nonnull)userId
                   accessToken:(NSString * _Nonnull)accessToken
                  refreshToken:(NSString * _Nonnull)refreshToken
                        aesKey:(NSString * _Nonnull)aesKey
                      complete:(void(^)(RXIMError *error))complete{
    [[RXIMSDKManager sharedSDK] loginRXIMSDKWithUserId:userId
                                               accessToken:accessToken
                                              refreshToken:refreshToken
                                                    aesKey:aesKey
                                                 complete:complete];
    
}

/**
 * 退出登录IM
 */
- (void)logout{
    [[RXIMSDKManager sharedSDK] logout];
}

/**
 * 设置数据库的基地址(非必须)
 */
- (void)setDBBasePath:(NSString * _Nullable)path{
    [[RXIMSDKManager sharedSDK] setDBBasePath:path];
}

/**
 * 获取设备码
 */
- (NSString *)getDeviceCode{
    return [[RXIMSDKManager sharedSDK] getDeviceCode];
    
}


@end
