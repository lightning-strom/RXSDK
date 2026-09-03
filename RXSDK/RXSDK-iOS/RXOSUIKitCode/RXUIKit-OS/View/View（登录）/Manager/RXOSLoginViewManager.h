//
//  RXOSLoginViewManager.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/15.
//

#import <Foundation/Foundation.h>
#import "RXOSCommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^LoginManagerComplete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXOSLoginViewManager : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

- (void)fetchLoginEvent:(LoginType)loginType
              loginInfo:(NSDictionary *)loginInfo
               complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 二次登录
 */
- (void)loginWithLoginType:(long)loginType
                 loginInfo:(NSDictionary *)loginInfo
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

- (void)loginWithconfig:(RXOSUILoginConfig *)config
               complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

@end

NS_ASSUME_NONNULL_END
