//
//  RXADJConfig.h
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/10.
//

#import <Foundation/Foundation.h>
#import "RXAdjustCommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXADJConfig : NSObject

/**
 * @brief Adjust app token
 */
@property (nonatomic, copy, readonly, nonnull) NSString *appToken;

/**
 * @brief Adjust 环境变量
 */
@property (nonatomic, copy, readonly, nonnull) NSString *environment;

/**
 * @brief 默认情况下，Adjust SDK 会在应用打开时启动。如果您想通过会话参数发送的数据在应用打开时不可用，那么则可以延迟 SDK 启动。
 * 当您想发送唯一标识符等信息时，这一方法尤其有效。
 */
@property (nonatomic, assign) double delayStart;

/**
 * @brief Change the verbosity of Adjust's logs.
 *
 * @note 您可以通过传递来增加或减少来自Adjust的日志数量
 *       以下参数之一。使用ADJLogLevelSuppress关闭所有日志记录。
 *       所需的最小日志级别(默认:info)
 *       
 *       Must be one of the following:
 *         - ADJLogLevelVerbose    (enable all logging)
 *         - ADJLogLevelDebug      (enable more logging)
 *         - ADJLogLevelInfo       (the default)
 *         - ADJLogLevelWarn       (disable info logging)
 *         - ADJLogLevelError      (disable warnings as well)
 *         - ADJLogLevelAssert     (disable errors as well)
 *         - ADJLogLevelSuppress   (suppress all logging)
 */
@property (nonatomic, assign) RXADJLogLevel logLevel;

/**
 * 初始化
 * @param appToken  adjust申请的AppToken
 * @param environment 环境变量
 * - sandbox     沙盒环境
 * - production  正式环境
 */
+ (nullable RXADJConfig *)configWithAppToken:(nonnull NSString *)appToken
                                 environment:(nonnull NSString *)environment;

@end

NS_ASSUME_NONNULL_END
