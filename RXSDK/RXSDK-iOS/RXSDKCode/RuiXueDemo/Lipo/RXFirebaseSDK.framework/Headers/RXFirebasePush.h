//
//  RXFirebasePush.h
//  RXFirebaseSDK
//
//  Created by 陈汉 on 2023/8/14.
//

#import <Foundation/Foundation.h>
#import <FirebaseMessaging/FirebaseMessaging.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXFirebasePush : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 设置代理
 */
- (void)setDelegate:(id<FIRMessagingDelegate>)delegate;

/**
 * 设置deviceToken
 */
- (void)setDeviceToken:(NSData *)deviceToken;

/**
 * 获取当前的注册令牌
 */
- (void)tokenWithCompletion:(void(^)(NSString *token, NSError *error))completion;

/**
 * 设置自动初始化
 * YES为开启，NO为关闭
 * 关闭需要在 Info.plist 添加元数据值：FirebaseMessagingAutoInitEnabled = NO
 */
- (void)autoInitEnabled:(BOOL)enable;

@end

NS_ASSUME_NONNULL_END
