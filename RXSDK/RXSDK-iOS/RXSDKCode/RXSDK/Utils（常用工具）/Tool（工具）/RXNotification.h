//
//  RXNotification.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/8/21.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

static NSString *const rx_noti_alidns = @"rx_noti_alidns";

@interface RXNotification : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

- (void)postNotification:(NSString *)aName object:(nullable id)anObject userInfo:(nullable NSDictionary *)aUserInfo;

- (void)addNotification:(id)observer selector:(SEL)aSelector name:(nullable NSNotificationName)aName object:(nullable id)anObject;

@end

NS_ASSUME_NONNULL_END
