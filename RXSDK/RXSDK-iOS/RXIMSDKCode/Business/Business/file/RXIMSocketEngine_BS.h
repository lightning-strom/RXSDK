//
//  RXIMSocketEngine_BS.h
//  Business
//
//  Created by Elbay on 2024/5/28.
//

#import <Foundation/Foundation.h>
@import RXIMSdk_business.RXIMError;
@import RXIMSdk_business.RXIMSocketEngine;

NS_ASSUME_NONNULL_BEGIN

/** IM连接引擎 */
@interface RXIMSocketEngine_BS : RXIMSocketEngine <RXIMSocketDelegate>

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 启动引擎
 */
-(void)onStart;
@end

NS_ASSUME_NONNULL_END
