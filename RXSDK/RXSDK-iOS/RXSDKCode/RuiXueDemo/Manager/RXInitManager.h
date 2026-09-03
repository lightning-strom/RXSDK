//
//  RXInitManager.h
//  RXSDK
//
//  Created by 陈汉 on 2023/9/6.
//

#import <Foundation/Foundation.h>
#import "RXCommonTool.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXInitManager : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 初始化
 */
- (void)initSDKWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 获取大数据公共属性列表
 */
- (void)getEventPublicProperties:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/**
 * 获取服务器时间并刷新 st_offset（服务器时间与设备时间偏移量）
 */
- (void)refreshServerTimeOffset;

@end

NS_ASSUME_NONNULL_END
