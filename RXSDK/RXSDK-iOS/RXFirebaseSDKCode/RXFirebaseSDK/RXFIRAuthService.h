//
//  RXFIRAuthService.h
//  RXFirebaseSDK
//
//  Created by 陈汉 on 2024/6/3.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXFIRAuthService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 授权登录
 */
- (void)signInWithEmail;

/**
 * 监听授权
 */
- (void)addAuthStateDidChangeListener;

@end

NS_ASSUME_NONNULL_END
