//
//  RXIMInternalManager.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/6/22.
//

#import <Foundation/Foundation.h>
#import "RXIMError.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMInternalManager : NSObject

/**
 * 获取internal实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 刷新token
 */
- (void)requestRefreshTokenWithComplete:(void(^)(RXIMError *error))complete;

/**
 * 获取/更换entry地址
 */
- (void)getEntryAddressWithComplete:(void(^)(RXIMError *error))complete;

@end

NS_ASSUME_NONNULL_END
