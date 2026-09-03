//
//  RXIMSDK.h
//  RXIMSdk
//
//  Created by 陈汉 on 2021/8/19.
//

#import <Foundation/Foundation.h>
#import "RXIMError.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMSDKManager : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化SDK
 * @param productId 产品id
 * @param channelId 渠道id
 * @param cpId 产品cpid
 * @param clientType 客户端类型
 * @param baseUrl 服务器域名
 * @param version sdk版本号
 */
- (void)initWithProductId:(NSString * _Nonnull)productId
                channelId:(NSString * _Nonnull)channelId
                     cpid:(NSInteger)cpId
               clientType:(NSInteger)clientType
                  version:(NSString * _Nonnull)version
                  baseUrl:(NSString * _Nonnull)baseUrl;

/**
 * 登陆IM
 * @param userId 用户标识符
 * @param accessToken 访问令牌
 * @param refreshToken 刷新令牌
 * @param aesKey AES 密钥
 */
- (void)loginRXIMSDKWithUserId:(NSString * _Nonnull)userId
                   accessToken:(NSString * _Nonnull)accessToken
                  refreshToken:(NSString * _Nonnull)refreshToken
                        aesKey:(NSString * _Nonnull)aesKey
                     complete:(void(^)(RXIMError *error))complete;

/**
 * 退出登录IM
 */
- (void)logout;

/**
 * 设置数据库的基地址(非必须)
 */
- (void)setDBBasePath:(NSString * _Nullable)path;

/**
 * 获取设备码
 */
- (NSString *)getDeviceCode;

@end

NS_ASSUME_NONNULL_END
