//
//  RXUniPinPayService.h
//  RXUniPinSDK
//
//  Created by root11 on 2024/5/14.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXUniPinPayService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * UniPin支付方法
 * @param info 支付相关参数
 * @note UniPin支付结果，以接入方后台返回的支付结果为准，SDK不提供回调方法
 */
- (void)payWithOrderInfo:(NSDictionary *)info;



@end

NS_ASSUME_NONNULL_END
