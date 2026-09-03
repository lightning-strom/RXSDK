//
//  RXBDAManager.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/3/5.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXBDAManager : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 激活
 */
- (void)initBDA;

/**
 * 事件上报
 */
- (void)trackEssentialEventWithNameWithEvent:(NSString *)event
                                      params:(NSDictionary *)params;
/**
 * websocket 用
 */
- (void)ws_trackEssentialEventWithNameWithInfo:(NSDictionary *)info uuid:(NSString *)uuid;

@end

NS_ASSUME_NONNULL_END
