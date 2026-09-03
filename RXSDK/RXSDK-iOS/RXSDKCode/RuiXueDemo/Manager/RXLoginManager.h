//
//  RXLoginManager.h
//  RXSDK
//
//  Created by 陈汉 on 2021/10/29.
//

#import <Foundation/Foundation.h>
#import "RXCommonHeader.h"
#import "RX_CommonRequestError.h"
#import "RXPublicHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXLoginManager : NSObject

// 登录
+ (void)loginWithExtDic:(NSMutableDictionary * __nullable)extDic
               username:(NSString *)username
               password:(NSString *)password
            sign_fields:(NSArray * _Nullable)sign_fields
              loginType:(LoginType)loginType
           migrate_args:(id _Nullable)migrate_args
               complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 二次登录
 * @param loginOpenId 登录返回的login_openid
 * @param extDic 扩展字段，可传nil
 */
+ (void)loginWithLoginOpenId:(NSString *)loginOpenId
                 sign_fields:(NSArray * _Nullable)sign_fields
                      extDic:(NSMutableDictionary * __nullable)extDic
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

+ (void)refreshTokenWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;


/**
 * 根据登录枚举，获取对应的登录平台类型字符串
 */
+ (NSString *)loginTypeStringFromLoginType:(LoginType)loginType;

/**
 * 解析初始化三方配置
 */
+ (void)fetchThirdConfig;

@end

NS_ASSUME_NONNULL_END
