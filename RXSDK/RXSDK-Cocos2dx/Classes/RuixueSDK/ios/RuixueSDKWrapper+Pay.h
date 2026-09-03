/**
 * RuixueSDKWrapper+Pay.h
 * 瑞雪 SDK iOS 原生层封装 - 支付模块
 * 
 * 依赖：RXSDK_Pure（IAP 支付）或其他支付 pod
 */

#import "RuixueSDKWrapper.h"

NS_ASSUME_NONNULL_BEGIN

@interface RuixueSDKWrapper (Pay)

/**
 * 发起支付
 */
- (void)payWithParamsJson:(NSString *)paramsJson;

@end

NS_ASSUME_NONNULL_END
