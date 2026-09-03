/**
 * RuixueSDKWrapper+Share.h
 * 瑞雪 SDK iOS 原生层封装 - 分享模块
 * 
 * 包含：一键分享、自定义分享
 * 依赖：RXSDK_Pure 分享接口
 */

#import "RuixueSDKWrapper.h"

NS_ASSUME_NONNULL_BEGIN

@interface RuixueSDKWrapper (Share)

/**
 * 一键分享
 */
- (void)shareWithParamsJson:(NSString *)paramsJson;

/**
 * 自定义分享
 */
- (void)shareCustomWithParamsJson:(NSString *)paramsJson;

/**
 * 打开客服
 */
- (void)openCustomerService;

@end

NS_ASSUME_NONNULL_END
