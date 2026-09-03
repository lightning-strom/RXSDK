//
//  RXGDTManager.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/12/2.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXGDTManager : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 激活
 */
- (void)initGDT;

/**
 * 注册
 */
- (void)registerGDT:(NSString *)method;

/**
 * 登录
 */
- (void)loginGDT:(NSString *)method;

@end

NS_ASSUME_NONNULL_END
